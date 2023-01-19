'use.strict'

const {
	prefix,
	token,
	owner,
	invit
} = require("./config.json");

const Discord = require('discord.js');

const wait = require('util').promisify(setTimeout);

var client = new Discord.Client();		// TODO : faire une classe mère
var date = new Date();

var initdate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

var commandFile = require('./response/command.js')
var replyFile = require('./response/reply.js')
var botFile = require('./response/bot.js')

var ismuted = false;

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

function getCurrentDatetime() {		// TODO : extraire de main
	let newDate = new Date();
	return `${newDate.getHours()}:${newDate.getMinutes()} - ${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
};

// (async () => {
// 	try {
// 		let feed = await parser.parseURL('https://www.zt-za.com/animes/');
// 		console.log(feed.title);
// 		feed.items.forEach(item => {
// 			console.log(item.title + ':' + item.link)
// 		});
// 	} catch (err) {
// 		console.log(`[${getCurrentDatetime()}]# Erreur sortie asyncParser : `, err);
// 	}
// })();

client
	.on('ready', async () => {
		await wait(1000);
		client.user.setPresence({
			activity: {
				name: 'le bon daftmob',
				type: 'STREAMING',
				url: 'https://www.twitch.tv/daftmob'
			},
			status: 'dnd'
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
			console.log(`[${getCurrentDatetime()}]# Error message new member : `, err);
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
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Sortie invit() :`, err);
			};
		};

		// invitation(invit);
		// console.log(invitDiscord);
		// message.channel.send('Aller j\'suis gentil : ' + invitDiscord);

		if (message.author.bot) return;

		if (message.author.id === owner) {
			if (Math.random() < .15) {
				try {
					let dio = client.emojis.cache.find(emoji => emoji.name === "dio_sama");
					message.react(dio)
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ZA WARUDO!!!`)
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Can't find emoji her`)
				};
			};
		};

		if (message.content.startsWith(prefix)) {
			switch (command) {
				case 'uptime':
					uptimeFunction(message, client, author, msg);
					return;
				case 'status':
					statusFunction(message, client, author, msg, args);
					return;
				case 'kill':
					killBot(message, client, author, msg);
					return;
				case 'mute':
					mute(message, author, msg, args);
					return;
				case 'reset':
					resetBot(message, client, author, msg);
					return;
				// case 'votekick':
				// 	kickCounter(message, client, author, msg);
				// 	return;
				case checkCollection:
					collectionCommands
						.get(command)
						.execute(message, args, client);
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`)
					return;
				default:
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Tentative de commande (${msg}) par (${author})`);
					message.channel.send('Nos développeurs travaillent actuellement sur cette commande.');
			};
		};

		if (ismuted) return;

		if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {

			if (Math.random() <= .005) {
				try {
					collectionBot.get('trashtalk').execute(message);
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}\n[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${client.user.username} use (or not) a trashtalk`)
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Erreur sortie randomCollection : `, err);
				};
			};
		};

		if (!message.content.startsWith(prefix)) {

			if (!collectionReply.has(msg)) return;

			try {
				collectionReply
					.get(msg)
					.execute(message);
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			} catch (err) {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Erreur sortie Reply : `, err);
			};

			if (badBoy.includes(message.author.id)) {

				if (Math.random() > .005) return;

				try {
					message.delete().catch(O_o => { })	// NEVER DELETE
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # message deleted`);
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Can't delete badBoy's message`);
				};
			};
		};
	});

function uptimeFunction(message, client, author, msg) {
	let totalSeconds = (client.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);
	let start = initdate

	message.channel.send(`Jour initial : ${start}\nTemps : ${days}D:${hours}H:${minutes}M:${seconds}S`);
	console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

function statusFunction(message, client, author, msg, args) {
	let stOnOff = args[0];
	let typeThings = args[1];
	let nameText = args[2];
	let urlLike = args[3];

	if (message.author.id === owner) {
		if (urlLike === undefined) {
			client.user.setPresence({
				activity: {
					name: `${nameText}`,
					type: `${typeThings}`
				},
				status: `${stOnOff}`
			}).catch(
				console.error
			);
			message.channel.send('Changement d\'activité !');
		} else {
			client.user.setPresence({
				activity: {
					name: `${nameText}`,
					type: `${typeThings}`,
					url: `${urlLike}`
				},
				status: `${stOnOff}`
			}).catch(
				console.error
			);
			message.channel.send('Changement d\'activité !');
		};
	} else return message.channel.send('T\'as pas le droit d\'y toucher');
	console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
};

async function killBot(message, client, author, msg) {
	if (message.author.id === owner) {
		await message.channel.send('Destroyiiiiniginezoesqocpnqfkn')
			.then(() => {
				wait(1000)
				client.destroy()
			});
		console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
	} else {
		console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send('Restriction de la commande');
	};
};

async function mute(message, author, msg, args) {
	let action = args[0];
	if (message.author.id === owner) {
		if (action != undefined) {
			if ((action.toLowerCase()) === 'true') {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send('Incapable de répliquer');
				ismuted = true;
				return ismuted;
			} else if ((action.toLowerCase()) === 'false') {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send('Capable de répliquer');
				ismuted = false;
				return ismuted;
			} else {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send(`Renseignez True ou False\n\r*e.g. : ${prefix}mute true*`);
				ismuted = false;
				return ismuted;
			}
		} else {
			console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
			message.channel.send(`Renseignez True ou False\n\r*e.g. : ${prefix}mute true*`);
			ismuted = false;
			return ismuted;
		}
	} else {
		console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
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
		console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
	} else {
		console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
		message.channel.send('Restriction de la commande');
	};
};

client.login(token)
	.then(() => console.log(`[${getCurrentDatetime()}]# ${client.user.username}\'s logged`))
	.catch(console.error);