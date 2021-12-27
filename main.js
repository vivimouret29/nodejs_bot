'use.strict'

const {
	prefix,
	token,
	invit,
	owner
} = require("./config.json");

const Discord = require('discord.js');

const wait = require('util').promisify(setTimeout);

var client = new Discord.Client();		// TODO : faire une classe mère
var collectionCommands = new Discord.Collection();
var collectionReply = new Discord.Collection();
var collectionBot = new Discord.Collection();
var date = new Date();

var initdate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

var commandFile = require('./response/command.js')
var replyFile = require('./response/reply.js')
var botFile = require('./response/bot.js')

var ismuted = false;

collectionCommands.set(commandFile.version.name, commandFile.version);
collectionCommands.set(commandFile.say.name, commandFile.say);
collectionCommands.set(commandFile.prune.name, commandFile.prune);
collectionCommands.set(commandFile.ping.name, commandFile.ping);

collectionReply.set(replyFile.daftbot.name, replyFile.daftbot);
collectionReply.set(replyFile.laugh.name, replyFile.laugh);
collectionReply.set(replyFile.yes.name, replyFile.yes);
collectionReply.set(replyFile.no.name, replyFile.no);
collectionReply.set(replyFile.tqt.name, replyFile.tqt);

collectionBot.set(botFile.trashtalk.name, botFile.trashtalk);

function getCurrentDatetime() {		// TODO : faire une sous classe mère
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
				name: `LofiGirl`,
				type: 'STREAMING',
				url: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
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

		function uptimeFunction() {
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

		function statusFunction() {
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

		async function kickCounter() {
			function invitCounter() {
				try {
					message.guild.fetchInvites()
						.then(invites => {
							invites.forEach(element => {
								if (element.maxAge === 0) {
									console.log(element.code);
									return 'https://discord.gg/' + element.code;
								} else {
									return 'Aucun invitation éternel';
								};
							});
						});
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Sortie invit() :`, err);
				};
			};

			try {
				let member = message.guild.member(message.author);
				let taggedUser = message.mentions.users.first();
				let alive = client.emojis.cache.find(emoji => emoji.name === "alive");
				let dead = client.emojis.cache.find(emoji => emoji.name === "dead");

				if (!message.mentions.users.size) return message.reply('T\'as oublié le tag sérieux');

				let emojiReact = (reaction, user) => {
					return ["dead", "alive"].includes(reaction.emoji.name) && user.id === message.author.id;
				};

				await message.channel
					.send(`<@!${message.author.id}> veut expulser ${args}.\nIl vit : ${alive}\nIl meurt : ${dead}`)
					.then(() => {
						console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} veut expulser ${taggedUser.username}`)
					});
				await message.react(dead).then(() => message.react(alive));
				await message.awaitReactions(emojiReact, { max: 1 })
					.then(collected => {
						let reaction = collected.first();
						let countgif = new Discord.MessageEmbed()
							.setTitle('#EXEC KICKCOUNTER.EXE')
							.attachFiles('https://i.pinimg.com/originals/fc/1b/71/fc1b714dd4e30ba4c1be2d7d432d51b0.gif');

						if (reaction.emoji.name === "dead") {
							message.channel.send(countgif);
							message.author
								.send('Au final c\'est toi qui est exclue hahaha\n' + invitCounter())
								.then(() => {
									message.delete().catch(O_o => { })
									member.kick();
									console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${client.user.username} : executé`);
								});
						} else {
							message.channel.send('Une sentence annulée...');
							console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${client.user.username} : suspendu`);
						};
					});
			} catch (err) {
				message.channel.send('Maintenance de la commande en cours...');
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Sortie kickCounter() :`, err);
			};
		};

		async function mute() {
			let action = args[0];
			if (message.author.id === owner) {
				if (action === 'true') {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
					message.channel.send('Incapable de répliquer');
					ismuted = true;
					return ismuted;
				} else if (action === 'false') {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
					message.channel.send('Capable de répliquer');
					ismuted = false;
					return ismuted;
				}
			} else {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} :  ${msg}`);
				message.channel.send('Restriction de la commande');
			};
		};

		async function killBot() {
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

		async function resetBot() {
			if (message.author.id === owner) {
				await message.channel.send('Petite douche je reviens')
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
					uptimeFunction();
					return;
				case 'status':
					statusFunction();
					return;
				case 'votekick':
					kickCounter();
					return;
				case 'kill':
					killBot();
					return;
				case 'reset':
					resetBot();
					return;
				case 'mute':
					mute();
					return;
				case checkCollection:
					collectionCommands
						.get(command)
						.execute(message, args, client);
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`)
					return;
				default:
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Tentative de command ${msg} par ${author}`);
					message.channel.send('Nos développeurs travaillent actuellement sur cette commande');
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

client.login(token)
	.then(() => console.log(`[${getCurrentDatetime()}]# ${client.user.username} logged`))
	.catch(console.error);