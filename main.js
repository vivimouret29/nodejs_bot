'use.strict'

const tmi = require('tmi.js');
const { parse } = require('json2csv');
const fs = require('fs');
const { Discord, Client, Collection, IntentsBitField, ActivityType } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const {
	clientId,
	identity,
	channels
} = require("./twitch_mobbot/config_mobbot.json");
const {
	prefix,
	token,
	owner
} = require("./config_daftbot.json");
const {
	fr, en, uk
} = require("./resx/lang.json");

var commandFile = require('./response/command.js'),
	replyFile = require('./response/reply.js'),
	botFile = require('./response/bot.js'),
	packageVersion = require("./package.json");

var collectionCommands = new Collection(),
	collectionReply = new Collection(),
	collectionBot = new Collection();

// Command Collection
collectionCommands.set(commandFile.version.name, commandFile.version);
collectionCommands.set(commandFile.say.name, commandFile.say);
collectionCommands.set(commandFile.prune.name, commandFile.prune);
collectionCommands.set(commandFile.ping.name, commandFile.ping);

// Reply Collection
collectionReply.set(replyFile.daftbot.name, replyFile.daftbot);
collectionReply.set(replyFile.laugh.name, replyFile.laugh);
collectionReply.set(replyFile.yes.name, replyFile.yes);
collectionReply.set(replyFile.no.name, replyFile.no);
collectionReply.set(replyFile.tqt.name, replyFile.tqt);

// Bot Collection
collectionBot.set(botFile.trashtalk.name, botFile.trashtalk);

const discordIntents = new IntentsBitField();
discordIntents.add(
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildInvites,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.MessageContent,
	IntentsBitField.Flags.GuildEmojisAndStickers,
	IntentsBitField.Flags.DirectMessages
);
const oauth = {
	options: {
		debug: true,
		clientId: clientId
	},
	identity: identity,
	channels: channels,
	connection: { reconnect: true }
};

const daftbot_client = new Client({ intents: discordIntents }),
	mobbot_client = new tmi.Client(oauth);

var date = new Date(),
	initDateTime = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
	isMuted = false,
	dataToExport = [],
	languageChoosen = languageChoosen === undefined ? en : languageChoosen;

function getCurrentDatetime(choice) {
	switch (choice) {
		case 'csv':
			return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
		case 'date':
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
		case 'comm':
			return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
	}
};

daftbot_client
	.on('ready', () => {
		wait(5000);
		daftbot_client.user.setPresence({
			activities: [{
				name: languageChoosen.activities,
				type: ActivityType.Watching
			}],
			status: 'online'
		});
	});

daftbot_client.on('messageCreate', (message) => {
	var args = message.content.slice(prefix.length).trim().split(/ +/),
		command = args.shift().toLowerCase(),
		msg = message.content.toLowerCase(),
		author = message.author.username,
		badBot = ['757970907992948826', '758319298325905428'],
		badChannels = [],
		badBoy = [],
		checkCollection;

	collectionCommands.has(command) ? checkCollection = collectionCommands.get(command).name : checkCollection = false;

	if (message.author.bot) return;

	if (message.author.id === owner) {
		if (Math.random() < .15) {
			try {
				let dio = daftbot_client.emojis.cache.find(emoji => emoji.name === "dio_sama");
				message.react(dio)
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ZA WARUDO!!!`)
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't find emoji here`)
			};
		};
	};

	if (message.content.startsWith(prefix)) {
		switch (command) {
			case 'help':
				help(message)
				return;
			case 'mobbot':
				setTwitchMobBot(message, author, msg, args);
				return;
			case 'uptime':
				getUptime(message, daftbot_client, author, msg);
				return;
			case 'status':
				setStatus(message, daftbot_client, author, msg, args);
				return;
			case 'kill':
				killBot(message, daftbot_client, author, msg);
				return;
			case 'mute':
				setMute(message, author, msg, args);
				return;
			case 'reset':
				resetBot(message, daftbot_client, author, msg);
				return;
			case 'language':
				setLanguage(message, author, msg, args);
				return;
			case checkCollection:
				collectionCommands
					.get(command)
					.execute(message, { args, languageChoosen });
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`)
				return;
			default:
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${languageChoosen.commandAttempt} : (${msg}) / (${author})`);
				message.channel.send(languageChoosen.commandNotFound);
		};
	};

	if (isMuted) return;

	if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {

		if (Math.random() <= .005) {
			try {
				collectionBot.get('trashtalk').execute(message);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}\n[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${daftbot_client.user.username} used (or not) a trashtalk`)
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output randomCollection() : `, err);
			};
		};
	};

	if (!message.content.startsWith(prefix)) {

		if (!collectionReply.has(msg)) return;

		try {
			collectionReply
				.get(msg)
				.execute(message, { args, languageChoosen });
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
		} catch (err) {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output reply() : `, err);
		};

		if (badBoy.includes(message.author.id)) {

			if (Math.random() > .005) return;

			try {
				message.delete().catch(O_o => { })
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Message deleted`);
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't delete badBoy's message : `, err);
			};
		};
	};
});

function setTwitchMobBot(message, author, msg, args) {
	let action = args[0];
	if (message.author.id === owner) {
		if (action != undefined) {
			if ((action.toLowerCase()) === 'on') {
				message.channel.send(languageChoosen.mobBotOn);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				processMobBot(message, true);
			} else if ((action.toLowerCase()) === 'off') {
				message.channel.send(languageChoosen.mobBotOff);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				processMobBot(message, false);
			} else {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send(`${languageChoosen.mobbotFail}\n\r*e.g. : ${prefix}mobbot on*`);
			}
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(`${languageChoosen.mobbotFail}\n\r*e.g. : ${prefix}mobbot on*`);
		}
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send(languageChoosen.restricted);
	};
};

function processMobBot(message, state) {
	switch (state) {
		case true:
			mobbot_client.on('connected', onConnectedHandler)
			mobbot_client.connect()
			message.channel.send(languageChoosen.mobbotSucced);

			daftbot_client.user.setPresence({
				activities: [{
					name: 'daftmob',
					type: ActivityType.Streaming,
					url: 'https://www.twitch.tv/daftmob'
				}],
				status: 'dnd'
			});

			mobbot_client
				.on('message', (channel, tags, message, self) => {
					if (self || tags['username'] === 'moobot') return;

					let data =
					{
						"id": Number(tags['user-id']),
						"date": getCurrentDatetime('date'),
						"badges": tags['badges'],
						"color": String(tags['color']),
						"username": String(tags['username']),
						"message": String(message),
						"emotes": tags['emotes-raw'] == null ? null : String(tags['emotes-raw']),
						"turbo": Boolean(tags['turbo'])
					};

					return dataToExport.push(data);
				});
			break;
		case false:
			if (mobbot_client.readyState() === `OPEN`) {
				mobbot_client.disconnect();
				exportingDataSet(message);

				daftbot_client.user.setPresence({
					activities: [{
						name: languageChoosen.activities,
						type: ActivityType.Watching
					}],
					status: 'online'
				});

			} else { message.channel.send(languageChoosen.mobbotErrorStart); }
			break;
	};
};

function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port} *`);
};

function exportingDataSet(message) {
	if (dataToExport.length === 0) {
		message.channel.send(languageChoosen.mobbotNoData);
		return;
	}

	fs.writeFile(`./twitch_mobbot/mobbot_analytics_${getCurrentDatetime('csv')}.csv`, parse(dataToExport), function (err) {
		if (err) {
			message.channel.send(languageChoosen.csvFail);
			throw err;
		}
		else { message.channel.send(languageChoosen.csvSucced) }
	});
};

function help(message) {
	message.reply({
		'channel_id': `${message.channel.channel_id}`,
		'content': '',
		'tts': false,
		'embeds': [
			{
				'type': 'rich',
				'title': `${languageChoosen.helpTitle}`,
				'description': `${languageChoosen.helpDescp}`,
				'color': 0x0eb70b,
				'timestamp': `2023-01-25T15:20:42.000Z`,
				'author': {
					'name': `${daftbot_client.user.username}`
				},
				'footer': {
					'text': `${languageChoosen.helpAuthor}`
				}
			}
		]
	});
};

function setLanguage(message, author, msg, args) {
	switch (args[0]) {
		case 'fr':
			languageChoosen = fr;
			message.channel.send(`Langue changée en Français`);

			wait(1000);
			daftbot_client.user.setPresence({
				activities: [{
					name: languageChoosen.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			return languageChoosen;
		case 'en':
			languageChoosen = en;
			message.channel.send(`Language changed to English`);
			
			wait(1000);
			daftbot_client.user.setPresence({
				activities: [{
					name: languageChoosen.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			return languageChoosen;
		case 'uk':
			languageChoosen = uk;
			message.channel.send(`Мову змінено на українську`);
			
			wait(1000);
			daftbot_client.user.setPresence({
				activities: [{
					name: languageChoosen.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});
			
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			return languageChoosen;
		default:
			message.channel.send(languageChoosen.languageNtReco);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			return languageChoosen;
	};
};

function getUptime(message, client, author, msg) {
	let totalSeconds = (client.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);
	let start = initDateTime;

	message.channel.send(`${languageChoosen.uptime} : ${start}\n${days}D:${hours}H:${minutes}M:${seconds}S`);
	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

function setStatus(message, client, author, msg, args) {
	if (!(message.author.id === owner)) return message.channel.send(languageChoosen.areYouOwner);

	let typeThings = args[0],
		stOnOff = args[1],
		nameText = args[2],
		urlLike = args[3],
		urlBool,
		argNb = 3;

	for (it in args) {
		if (String(args[it]).startsWith('http')) {
			urlBool = true;
			break;
		} else { urlBool = false; }
	};

	if (urlBool) {
		while (!String(urlLike).startsWith('http')) {
			urlLike = args[argNb + 1];
			nameText = nameText + ' ' + args[argNb];
			argNb++;
		};
	} else {
		while (!(urlLike == undefined)) {
			urlLike = args[argNb + 1];
			nameText = nameText + ' ' + args[argNb];
			argNb++;
		};
	};

	switch (stOnOff) {
		case 'online':
			break;
		case 'idle':
			break;
		case 'dnd':
			break;
		default:
			return message.reply(`${fr.wrongStatus}\n
*e.g. ${prefix}status ${typeThings} online ${nameText} ${urlLike}*`);
	};

	switch (typeThings) {
		case 'play':
			typeThings = ActivityType.Playing;
			break;
		case 'watch':
			typeThings = ActivityType.Watching;
			break;
		case 'listen':
			typeThings = ActivityType.Listening;
			break;
		case 'stream':
			typeThings = ActivityType.Streaming;
			break;
		case 'compet':
			typeThings = ActivityType.Competing;
			break;
		default:
			return message.reply(`${fr.wrongActivities}\n
*e.g. ${prefix} stream ${stOnOff} ${nameText} ${urlLike}*`);
	};

	if (!urlBool) {
		client.user.setPresence({
			activities: [{
				name: String(nameText)
			}],
			status: String(stOnOff)
		});
		client.user.setActivity(String(nameText), { type: typeThings });
	} else {
		client.user.setPresence({
			activities: [{
				name: String(nameText),
				type: typeThings,
				url: String(urlLike)
			}],
			status: String(stOnOff)
		});
	};

	message.channel.send(languageChoosen.changedActivites);
	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

async function killBot(message, client, author, msg) {
	if (!(message.author.id === owner)) return message.channel.send(languageChoosen.areYouOwner);

	await message.channel.send(languageChoosen.killBot)
		.then(() => {
			wait(1000)
			client.destroy()
		});

	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

async function setMute(message, author, msg, args) {
	if (!(message.author.id === owner)) return message.channel.send(languageChoosen.restricted);

	let action = args[0];
	if (action != undefined) {
		if ((action.toLowerCase()) === 'on') {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(languageChoosen.botMuted);
			isMuted = true;
			return isMuted;
		} else if ((action.toLowerCase()) === 'off') {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(languageChoosen.botUnmuted);
			isMuted = false;
			return isMuted;
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(`${languageChoosen.howMute}\n\r*e.g. : ${prefix}mute on*`);
			isMuted = false;
			return isMuted;
		}
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send(`${languageChoosen.howMute}\n\r*e.g. : ${prefix}mute on*`);
		isMuted = false;
		return isMuted;
	};
};

async function resetBot(message, client, author, msg) {
	if (!(message.author.id === owner)) return message.channel.send(languageChoosen.areYouOwner);

	await message.channel.send(languageChoosen.resetBot)
		.then(() => {
			wait(1000)
			client.destroy()
		})
		.then(() => {
			wait(1000)
			client.login(token)
			daftbot_client.user.setPresence({
				activities: [{
					name: languageChoosen.activities,
					type: ActivityType.Watching
					
				}],
				status: 'online'
			});
		});

	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

daftbot_client.login(token)
	.then(() => console.log(`[${getCurrentDatetime('comm')}]# ${daftbot_client.user.username}\'s logged
[${getCurrentDatetime('comm')}]# v${packageVersion.version}`))
	.catch(console.error);