'use.strict'

const { Client, Collection, IntentsBitField, ActivityType, Events, Partials } = require('discord.js'),
	tmi = require('tmi.js'),
	{ parse } = require('json2csv'),
	fs = require('fs'),
	axios = require('axios');

const packageVersion = require('./package.json'),
	{
		prefix,
		token,
		owner
	} = require('./config.json'),
	{
		clientId,
		identity,
		channels
	} = require('./mobbot/config.json'),
	{
		fr,
		en,
		uk
	} = require('./resx/lang.json'),
	commandFile = require('./appdata/command.js'),
	replyFile = require('./appdata/reply.js'),
	botFile = require('./appdata/bot.js');

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

const intents = new IntentsBitField();
intents.add(
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.DirectMessageReactions,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildInvites,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.GuildEmojisAndStickers,
	IntentsBitField.Flags.MessageContent
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
const params = {
	headers: {
		Connection: 'keep-alive',
		Authorization: `Bearer ${identity.password}`,
		'Client-ID': clientId
	}
};
const partials = [
	Partials.Channel,
	Partials.Emoji,
	Partials.Guild,
	Partials.Integration,
	Partials.Invite,
	Partials.GuildMember,
	Partials.Message,
	Partials.Presence,
	Partials.ThreadChannel,
	Partials.ThreadMember,
	Partials.Reaction,
	Partials.Role,
	Partials.User
];

const dbClient = new Client({ intents: intents, partials: partials }),
	mbClient = new tmi.Client(oauth);

var date = new Date(),
	initDateTime = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
	isMuted = false,
	dataToExport = [],
	channelTwitch = ['twitch'],// ':cinema: -fox-stream- :cinema:'],
	streamers = ['daftmob', 'dpl0', 'fantabobshow', 'mistermv', 'drfeelgood', 'laink', 'ponce', 'captainfracas'],
	language = language === undefined ? en : language,
	memes = [
		'https://media3.giphy.com/media/3o84sCIUu49AtNYkDK/giphy.gif',
		'https://media1.giphy.com/media/3ohuPwwRuluP6GiZoI/giphy.gif',
		'https://media2.giphy.com/media/3ohuPePwzcG9sA3VSw/giphy.gif'
	];

function getCurrentDatetime(choice) {
	switch (choice) {
		case 'csv':
			return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
		case 'date':
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
		case 'comm':
			return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
	};
};

dbClient.on(Events.ClientReady, async () => {
	await new Promise(resolve => setTimeout(resolve, 5000));
	dbClient.user.setPresence({
		activities: [{
			name: language.activities,
			type: ActivityType.Watching
		}],
		status: 'online'
	});

	if (dbClient.user.id == '758393470024155186') return;

	let descpMemory = [],
		oldDescpMemory = [];

	for (let xTime = 0; xTime < streamers.length; xTime++) {
		descpMemory.push('');
		oldDescpMemory.push('');
	};

	while (true) {
		for (streamId in streamers) {
			let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=${streamers[streamId]}`, params);

			if (ax.data.data.length == 0) {
				descpMemory[streamId] = '';
				continue;
			}
			else { descpMemory[streamId] = ax.data.data[0].title };

			if (descpMemory[streamId] != oldDescpMemory[streamId] && ax.data.data.length == 1) {
				sendLiveNotifEmbed(ax);
				console.log(`[${getCurrentDatetime('comm')}] Notif Twitch ${ax.data.data[0].user_name}`);
			};
		};

		oldDescpMemory = descpMemory;
		await new Promise(resolve => setTimeout(resolve, 300000));
	};
});

dbClient.on(Events.MessageReactionAdd, (react) => {
	var emoji = react.emoji.name,
		channel = dbClient.channels.cache.get(react.message.channelId),
		messageId = react.message.id,
		message = channel.messages.cache.get(messageId);

	if (['diosama'].includes(emoji) && message.channel.id == channel.id) {
		console.log('dio', react);
		// TODO: add role here now with a switch case
	};
});

dbClient.on(Events.GuildMemberAdd, async (guild) => {
	dbClient.channels.cache
		.get(guild.guild.systemChannelId)
		.send({
			'channel_id': `${guild.guild.systemChannelId}`,
			'content': '',
			'tts': false,
			'embeds': [{
				'type': 'rich',
				'title': `${guild.user.username} ${language.guildJoin}`,
				'description': `${language.guildJoinDesc}`,
				'color': 0x890b0b,
				'image': {
					'url': `${memes[randomIntFromInterval(0, (memes.length - 1))]}`,
					'height': 0,
					'width': 0
				},
				'thumbnail': {
					'url': `${dbClient.users.cache.get(guild.user.id).avatarURL({ format: 'png', dynamic: true, size: 1024 })}`,
					'height': 0,
					'width': 0
				},
				'author': {
					'name': `daftbot`,
					'icon_url': `${dbClient.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })}`
				}
			}]
		});
	console.log(`[${getCurrentDatetime('comm')}] New member \'${guild.user.username}\' join server : ${guild.guild.name}`);
});

dbClient.on(Events.MessageCreate, async (message) => {
	var args = message.content.slice(prefix.length).trim().split(/ +/),
		command = args.shift().toLowerCase(),
		msg = message.content.toLowerCase(),
		author = message.author.username,
		badBot = ['757970907992948826', '758393470024155186'],
		badChannels = [],
		badBoy = [],
		checkCollection;

	collectionCommands.has(command) ? checkCollection = collectionCommands.get(command).name : checkCollection = false;

	if (message.author.bot) return;

	if (message.author.id === owner) {
		if (Math.random() < .05) {
			let dio = dbClient.emojis.cache.find(emoji => emoji.name === 'dio_sama');

			if (dio == undefined) return console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} : Emoji not found`);
			message.react(dio);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} : Za Warudo`);
		};
	};

	if (message.content.startsWith(prefix)) {
		switch (command) {
			case 'help':
				if (!(message.author.id === owner)) {
					getHelp(message, language.helpDescp);
				} else {
					getHelp(message, language.helpDescpTotal);
				};
				return;
			case 'mobbot':
				setTwitchMobBot(message, author, msg, args);
				return;
			case 'streamers':
				setStreamers(message, author, msg, args);
				break;
			case 'uptime':
				getUptime(message, dbClient, author, msg);
				return;
			case 'status':
				setStatus(message, dbClient, author, msg, args);
				return;
			case 'kill':
				killBot(message, dbClient, author, msg);
				return;
			case 'mute':
				setMute(message, author, msg, args);
				return;
			case 'reset':
				resetBot(message, dbClient, author, msg);
				return;
			case 'language' || 'lang':
				setLanguage(message, author, msg, args);
				return;
			case checkCollection:
				collectionCommands
					.get(command)
					.execute(message, { args, language: language });
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
				return;
			default:
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${language.commandAttempt} : (${msg}) / (${author})`);
				message.channel.send(language.commandNotFound);
		};
	};

	if (isMuted) return;

	if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {

		if (Math.random() <= .005) {
			try {
				collectionBot
					.get('trashtalk')
					.execute(message);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}\n[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${dbClient.user.username} used (or not) a trashtalk`);
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
				.execute(message, { args, language: language });
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
	if (!(message.author.id === owner)) return message.channel.send(language.areYouOwner);

	let action = args[0];

	if (action != undefined) {
		if ((action.toLowerCase()) === 'on') {
			message.channel.send(language.mobbotOn);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			processMobBot(message, true);
		} else if ((action.toLowerCase()) === 'off') {
			message.channel.send(language.mobbotOff);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			processMobBot(message, false);
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			message.channel.send(`${language.mobbotFail}\n\r*e.g. : ${prefix}mobbot on*`);
		};
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
		message.channel.send(`${language.mobbotFail}\n\r*e.g. : ${prefix}mobbot on*`);
	};
};

async function processMobBot(message, state) {
	switch (state) {
		case true:
			mbClient.on('connected', onConnectedHandler);
			mbClient.connect();

			message.channel.send(`*${language.mobbotSucceed}*`);

			dbClient.user.setPresence({
				activities: [{
					name: `daftmob`,
					type: ActivityType.Streaming,
					url: `https://www.twitch.tv/daftmob`
				}],
				status: 'dnd'
			});

			mbClient
				.on('message', (channel, tags, message, self) => {
					if (self || tags['username'] === 'moobot') return;

					let data = {
						'id': Number(tags['user-id']),
						'date': getCurrentDatetime('date'),
						'badges': tags['badges'],
						'color': String(tags['color']),
						'username': String(tags['username']),
						'message': String(message),
						'emotes': tags['emotes-raw'] == null ? null : String(tags['emotes-raw']),
						'turbo': Boolean(tags['turbo'])
					};

					return dataToExport.push(data);
				});
			break;
		case false:
			if (mbClient.readyState() === `OPEN`) {
				mbClient.disconnect();
				exportingDataSet(message);

				dbClient.user.setPresence({
					activities: [{
						name: language.activities,
						type: ActivityType.Watching
					}],
					status: 'online'
				});
			} else { message.channel.send(language.mobbotErrorStart) }
			break;
		default:
			message.channel.send(language.mobbotErrorStart);
			break;
	};
};

async function sendLiveNotifEmbed(ax) {
	let guidDot = await axios.get(`https://twitch.tv/${ax.data.data[0].user_login}`);

	let guid = guidDot.data.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
	guid = guid.split('s/')[1].split('-p')[0];

	let dot = guidDot.data.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
	dot = dot.split('.')[1].split(' ')[0];

	for (chan in channelTwitch) {
		var channelSend = dbClient.channels.cache.find(channel => channel.name == channelTwitch[chan]);

		dbClient.channels.cache
			.get(channelSend.id)
			.send({
				'channel_id': `${channelSend.id}`,
				'content': '',
				'tts': false,
				'embeds': [{
					'type': 'rich',
					'title': `Live de ${ax.data.data[0].user_name}`,
					'description': `${language.descLiveSt} ${ax.data.data[0].user_name} ${language.descLiveNd}`,
					'color': 0x4d04bb,
					'fields': [{
						'name': `${ax.data.data[0].game_name}`,
						'value': `${ax.data.data[0].title}`,
					}],
					'image': {
						'url': `https://static-cdn.jtvnw.net/previews-ttv/live_user_${ax.data.data[0].user_login}-360x220.jpg`,
						'proxy_url': `https://twitch.tv/${ax.data.data[0].user_login}`,
						'height': 0,
						'width': 0
					},
					'thumbnail': {
						'url': `https://static-cdn.jtvnw.net/jtv_user_pictures/${guid}-profile_image-300x300.${dot}`,
						'proxy_url': `https://twitch.tv/${ax.data.data[0].user_login}`,
					},
					'author': {
						'name': `mobbot`,
						'url': `https://twitch.tv/${ax.data.data[0].user_login}`,
						'icon_url': `${dbClient.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })}`
					},
					'footer': {
						'text': `Viewers : ${ax.data.data[0].viewer_count}`,
						'icon_url': `https://cdn-icons-png.flaticon.com/512/4299/4299106.png`,
						'proxy_icon_url': `https://twitch.tv/${ax.data.data[0].user_login}`
					},
					'url': `https://twitch.tv/${ax.data.data[0].user_login}`
				}]
			});
	};
};

function exportingDataSet(message) {
	if (dataToExport.length === 0) {
		message.author.send(language.mobbotNoData);
		return;
	};

	fs.writeFile(`./mobbot/mobbot_analytics_${getCurrentDatetime('csv')}.csv`, parse(dataToExport), function (err) {
		if (err) {
			message.author.send(language.csvFail);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username} : ${message.content.toLowerCase()} ${err}`);
			throw err;
		}
		else {
			message.author.send(language.csvSucceed);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username} : ${message.content.toLowerCase()}`);
		};
	});
};

async function getHelp(message, desc) {
	let twitch = 'https://twitch.tv/daftmob',
		guidDot = await axios.get(twitch);

	let guid = guidDot.data.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
	guid = guid.split('s/')[1].split('-p')[0];

	let dot = guidDot.data.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
	dot = dot.split('.')[1].split(' ')[0];

	message.author.send({
		'channel_id': `${message.channel.channel_id}`,
		'content': '',
		'tts': false,
		'embeds': [{
			'type': 'rich',
			'title': `${language.helpTitle}`,
			'description': `${desc}`,
			'color': 0x0eb70b,
			'timestamp': `2023-02-02T03:20:42.000Z`,
			'author': {
				'name': `${dbClient.user.username}`
			},
			'footer': {
				'text': `${language.helpAuthor}`,
				'icon_url': `https://static-cdn.jtvnw.net/jtv_user_pictures/${guid}-profile_image-300x300.${dot}`,
				'proxy_icon_url': twitch
			}
		}]
	});

	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username} : ${message.content.toLowerCase()}`);
};

async function setLanguage(message, author, msg, args) {
	switch (args[0]) {
		case 'fr':
			language = fr;
			message.channel.send(`Langue changée en Français`);

			await new Promise(resolve => setTimeout(resolve, 1000));
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
		case 'en':
			language = en;
			message.channel.send(`Language changed to English`);

			await new Promise(resolve => setTimeout(resolve, 1000));
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
		case 'uk':
			language = uk;
			message.channel.send(`Мову змінено на українську`);

			await new Promise(resolve => setTimeout(resolve, 1000));
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
		default:
			message.channel.send(language.languageNtReco);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
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

	message.channel.send(`${language.uptime} : ${start}\n${days}D:${hours}H:${minutes}M:${seconds}S`);
	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
};

function setStatus(message, client, author, msg, args) {
	if (!(message.author.id === owner)) return message.channel.send(language.areYouOwner);

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

	message.channel.send(language.changedActivites);
	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
};

async function killBot(message, client, author, msg) {
	if (!(message.author.id === owner)) return message.channel.send(language.areYouOwner);

	await message.channel.send(language.killBot)
		.then(() => {
			new Promise(resolve => setTimeout(resolve, 1000))
			client.destroy()
		});

	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
};

async function setMute(message, author, msg, args) {
	if (!(message.author.id === owner)) return message.channel.send(language.restricted);

	let action = args[0];
	if (action != undefined) {
		if ((action.toLowerCase()) === 'on') {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			message.channel.send(language.botMuted);
			isMuted = true;
			return isMuted;
		} else if ((action.toLowerCase()) === 'off') {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			message.channel.send(language.botUnmuted);
			isMuted = false;
			return isMuted;
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			message.channel.send(`${language.howMute}\n\r*e.g. : ${prefix}mute on*`);
			isMuted = false;
			return isMuted;
		};
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
		message.channel.send(`${language.howMute}\n\r*e.g. : ${prefix}mute on*`);
		isMuted = false;
		return isMuted;
	};
};

async function resetBot(message, client, author, msg) {
	if (!(message.author.id === owner)) return message.channel.send(language.areYouOwner);

	await message.channel.send(language.resetBot)
		.then(() => {
			new Promise(resolve => setTimeout(resolve, 1000));
			client.destroy();
		})
		.then(() => {
			new Promise(resolve => setTimeout(resolve, 1000));
			client.login(token);
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching

				}],
				status: 'online'
			});
		});

	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
};

function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port} *`);
};

dbClient
	.login(token)
	.then(() => console.log(`[${getCurrentDatetime('comm')}] ${dbClient.user.username}\'s logged
[${getCurrentDatetime('comm')}] ${dbClient.user.username} v${packageVersion.version}`))
	.catch(console.error);