'use.strict'

const tmi = require('tmi.js');
const { parse } = require('json2csv');
const fs = require('fs');
const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);

const {
	clientId,
	identity,
	channels
} = require("./twitch_mobbot/config_mobbot.json");
const {
	prefix,
	token,
	owner,
	invit
} = require("./config_daftbot.json");

var commandFile = require('./response/command.js')
var replyFile = require('./response/reply.js')
var botFile = require('./response/bot.js')

var collectionCommands = new Discord.Collection();
var collectionReply = new Discord.Collection();
var collectionBot = new Discord.Collection();

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

const oauth = {
	options: {
		debug: true,
		clientId: clientId
	},
	identity: identity,
	channels: channels,
	connection: { reconnect: true }
};

const daftbot_client = new Discord.Client();		// TODO : faire une classe mère
const mobbot_client = new tmi.Client(oauth);

var date = new Date();
var initDateTime = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
var isMuted = false;
var dataToExport = [];

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

// (async () => {
// 	try {
// 		let feed = await parser.parseURL('https://www.zt-za.com/animes/');
// 		console.log(feed.title);
// 		feed.items.forEach(item => {
// 			console.log(item.title + ':' + item.link)
// 		});
// 	} catch (err) {
// 		console.log(`[${getCurrentDatetime('comm')}]# Erreur sortie asyncParser : `, err);
// 	}
// })();

daftbot_client
	.on('ready', async () => {
		await wait(5000);
		daftbot_client.user.setPresence({
			activity: {
				name: 'la chaîne du daftmob',
				type: 'WATCHING',
				url: 'https://youtu.be/_XJNXeyDW0A'
			},
			status: 'idle'
		})
			.catch(console.error);
	})
	.on('guildMemberAdd', member => {
		try {
			// const userRoles = member.roles.cache
			// if (this.member.id === memberber.id) {
			// 	this.member.get(userRoles)
			// } else { }
			member.guild.channels.cache
				.find(ch => ch.name === 'general-chat')
				.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`);
		} catch (err) {
			console.log(`[${getCurrentDatetime('comm')}]# Error message new member : `, err);
		}
	})
	.on('message', async message => {		// TODO : en faire une classe d'action
		var args = message.content.slice(prefix.length).trim().split(/ +/);
		var command = args.shift().toLowerCase();
		var msg = message.content.toLowerCase();
		var author = message.author.username;
		var badBot = ['757970907992948826', '758319298325905428'];
		var badChannels = [];
		var badBoy = [];
		var checkCollection;
		collectionCommands.has(command) ? checkCollection = collectionCommands.get(command).name : checkCollection = false;

		function invitation() {
			try {
				message.guild.fetchInvites()
					.then(invites => {
						let newObject = invites.array().filter(element => {
							if (element.maxAge === 0) {
								object = `${element.code}`;
								console.log(object);
							} else {
								message.channel.send('Aucun invitation éternel');
							};
						});
						return newObject;
					});
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Sortie invit() :`, err);
			};
		};

		// invitation(invit);
		// console.log(invitDiscord);
		// message.channel.send('Aller j\'suis gentil : ' + invitDiscord);

		if (message.author.bot) return;

		if (message.author.id === owner) {
			if (Math.random() < .15) {
				try {
					let dio = daftbot_client.emojis.cache.find(emoji => emoji.name === "dio_sama");
					message.react(dio)
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ZA WARUDO!!!`)
				} catch (err) {
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't find emoji her`)
				};
			};
		};

		if (message.content.startsWith(prefix)) {
			switch (command) {
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
				case checkCollection:
					collectionCommands
						.get(command)
						.execute(message, args, daftbot_client);
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`)
					return;
				default:
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Tentative de commande (${msg}) par (${author})`);
					message.channel.send('Nos développeurs travaillent actuellement sur cette commande.');
			};
		};

		if (isMuted) return;

		if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {

			if (Math.random() <= .005) {
				try {
					collectionBot.get('trashtalk').execute(message);
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}\n[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${daftbot_client.user.username} use (or not) a trashtalk`)
				} catch (err) {
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Erreur sortie randomCollection : `, err);
				};
			};
		};

		if (!message.content.startsWith(prefix)) {

			if (!collectionReply.has(msg)) return;

			try {
				collectionReply
					.get(msg)
					.execute(message);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Erreur sortie Reply : `, err);
			};

			if (badBoy.includes(message.author.id)) {

				if (Math.random() > .005) return;

				try {
					message.delete().catch(O_o => { })	// NEVER DELETE
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # message deleted`);
				} catch (err) {
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't delete badBoy's message`);
				};
			};
		};
	});

function setTwitchMobBot(message, author, msg, args) {
	let action = args[0];
	if (message.author.id === owner) {
		if (action != undefined) {
			if ((action.toLowerCase()) === 'on') {
				message.channel.send(`Démarrage de MobBot...`);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				processMobBot(message, true);
			} else if ((action.toLowerCase()) === 'off') {
				message.channel.send(`Arrêt de MobBot...`);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				processMobBot(message, false);
			} else {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send(`Renseignez On ou Off\n\r*e.g. : ${prefix}mobbot on*`);
			}
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(`Renseignez On ou Off\n\r*e.g. : ${prefix}mobbot on*`);
		}
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send('Restriction de la commande');
	};
};

function processMobBot(message, state) {
	switch (state) {
		case true:
			mobbot_client.on('connected', onConnectedHandler)
			mobbot_client.connect()
			message.channel.send(`* MobBot connecté sur irc-ws.chat.twitch.tv:443 *`);

			daftbot_client.user.setPresence({
				activity: {
					name: 'daftmob',
					type: 'STREAMING',
					url: 'https://www.twitch.tv/daftmob'
				},
				status: 'dnd'
			})
				.catch(console.error);

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
					activity: {
						name: 'la chaîne du daftmob',
						type: 'WATCHING',
						url: 'https://youtu.be/_XJNXeyDW0A'
					},
					status: 'idle'
				})
					.catch(console.error);
			} else { message.channel.send(`Mais... Il est même pas lancé débilus...`); }
			break;
	};
};

function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port} *`);
};

function exportingDataSet(message) {
	if (dataToExport.length === 0) {
		message.channel.send(`Aucune données à sauvegarder`);
		return;
	}

	fs.writeFile(`./twitch_mobbot/mobbot_analytics_${getCurrentDatetime('csv')}.csv`, parse(dataToExport), function (err) {
		if (err) {
			message.channel.send(`Erreur lors de la sauvegarde du .CSV`);
			throw err;
		}
		else { message.channel.send(`Sauvegarde du .CSV réussite !`) }
	});
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

	message.channel.send(`Jour initial : ${start}\nTemps : ${days}D:${hours}H:${minutes}M:${seconds}S`);
	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

function setStatus(message, client, author, msg, args) {
	let stOnOff = args[1];
	let typeThings = args[2];
	let nameText = args[0];
	let urlLike = args[3];

	if (message.author.id === owner) {
		if (urlLike === undefined) {
			client.user.setPresence({
				activity: {
					name: `${nameText}`,
					type: `${typeThings}`
				},
				status: `${stOnOff}`
			})
				.catch(console.error);
		} else {
			client.user.setPresence({
				activity: {
					name: `${nameText}`,
					type: `${typeThings}`,
					url: `${urlLike}`
				},
				status: `${stOnOff}`
			})
				.catch(console.error);
		};
		message.channel.send('Changement d\'activité !');
	} else return message.channel.send('T\'as pas le droit d\'y toucher');
	console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

async function killBot(message, client, author, msg) {
	if (message.author.id === owner) {
		await message.channel.send('Destroyiiiiniginezoesqocpnqfkn.....')
			.then(() => {
				wait(1000)
				client.destroy()
			});
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send('Restriction de la commande');
	};
};

async function setMute(message, author, msg, args) {
	let action = args[0];
	if (message.author.id === owner) {
		if (action != undefined) {
			if ((action.toLowerCase()) === 'off') {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send('Incapable de répliquer');
				isMuted = true;
				return isMuted;
			} else if ((action.toLowerCase()) === 'on') {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send('Capable de répliquer');
				isMuted = false;
				return isMuted;
			} else {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send(`Renseignez **On** ou **Off**\n\r*e.g. : ${prefix}mute on*`);
				isMuted = false;
				return isMuted;
			}
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(`Renseignez **On** ou **Off**\n\r*e.g. : ${prefix}mute on*`);
			isMuted = false;
			return isMuted;
		}
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send('Restriction de la commande');
	};
};

async function resetBot(message, client, author, msg) {
	if (message.author.id === owner) {
		await message.channel.send('Petite douche je reviens...')
			.then(() => {
				wait(1000)
				client.destroy()
			})
			.then(() => {
				wait(1000)
				client.login(token)
			});
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send('Restriction de la commande');
	};
};

daftbot_client.login(token)
	.then(() => console.log(`[${getCurrentDatetime('comm')}]# ${daftbot_client.user.username}\'s logged`))
	.catch(console.error);