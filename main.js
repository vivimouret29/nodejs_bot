'use.strict'

const {
	prefix,
	token,
	invit,
	godMaster
} = require("./config.json");

const Discord = require('discord.js');
const fs = require('fs');

const wait = require('util').promisify(setTimeout);

const client = new Discord.Client();
const collectionCommands = new Discord.Collection();
const collectionReply = new Discord.Collection();
const collectionBot = new Discord.Collection();
const date = new Date();

// const Parser = require('rss-parser');
// const parser = new Parser();

const initdate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const replyFiles = fs.readdirSync('./reply').filter(file => file.endsWith('.js'));
const botFiles = fs.readdirSync('./bot').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	collectionCommands.set(command.name, command);
}

for (const file of replyFiles) {
	const command = require(`./reply/${file}`);
	collectionReply.set(command.name, command);
}

for (const file of botFiles) {
	const command = require(`./bot/${file}`);
	collectionBot.set(command.name, command);
}

function getCurrentDatetime() {
	const newDate = new Date()
	return `${newDate.getHours()}:${newDate.getMinutes()} - ${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
}

// (async () => {
// 	try {
// 		const feed = await parser.parseURL('https://www.zt-za.com/animes/');
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
				name: `tous les logs`,
				type: 'LISTENING',
			},
			status: 'online'
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
	.on('message', async message => {

		// console.log()

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const msg = message.content.toLowerCase();
		const authorMessage = message.author.username;
		const badChannels = ['news-anime', 'leekwars'];
		const badBot = ['757970907992948826', '758319298325905428'];
		const badBoy = ['346551215036956672'];
		var artificial_replie = false;
		const human_question = message.content.trim().toLowerCase().split(/ +/)
		let checkCollection
		collectionCommands.has(command) ? checkCollection = collectionCommands.get(command).name : checkCollection = false;

		function uptimeFunction() {
			let totalSeconds = (client.uptime / 1000);
			let days = Math.floor(totalSeconds / 86400);
			totalSeconds %= 86400;
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = Math.floor(totalSeconds % 60);
			let update = initdate

			message.delete().catch(O_o => { })
			message.channel.send(`\`UPDATE|SATELLITE : ${update}\`\n\`UPTIME|SATELLITE : ${days}D:${hours}H:${minutes}M:${seconds}S\``)
			console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} :  ${msg}`);
		}

		function statusFunction() {
			const stOnOff = args[0]
			const typeThings = args[1]
			const nameText = args[2]
			const urlLike = args[3]

			if (message.author.id === godMaster) {

				if (urlLike === undefined) {
					client.user.setPresence({
						activity: {
							name: `${nameText}`,
							type: `${typeThings}`
						},
						status: `${stOnOff}`
					})
						.catch(
							console.error,
						)
					message.delete().catch(O_o => { })
					message.channel.send('changement d\'activité !')

				} else {

					client.user.setPresence({
						activity: {
							name: `${nameText}`,
							type: `${typeThings}`,
							url: `${urlLike}`
						},
						status: `${stOnOff}`
					})
						.catch(
							console.error,
						)
					message.delete().catch(O_o => { })
					message.channel.send('changement d\'activité !')
				}

			} else return message.channel.send('t\'as pas le droit d\'y toucher');
			console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} :  ${msg}`);
		}

		function invit() {
			try {
				message.guild.fetchInvites()
					.then(invites => {

						const newObject = invites.array().filter(element => {

							if (element.maxAge === 0) {
								object = `${element.code}`;
								console.log(object);
							} else {
								message.channel.send('no eternal invit');
							}

						})

						return newObject;
					});
			} catch (err) {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Sortie invit() :`, err);
			}
		}

		const invitDiscord = '';
		// invit(invitDiscord);
		// console.log(invitDiscord);
		// message.channel.send('aller j\'suis gentil : ' + invitDiscord);

		async function kickCounter() {

			function invit() {
				try {
					message.guild.fetchInvites()
						.then(invites => {
							invites.forEach(element => {

								if (element.maxAge === 0) {
									console.log(element.code)
									return 'https://discord.gg/' + element.code
								} else {
									return 'no eternal invit'
								}

							})
						});
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Sortie invit() :`, err);
				}
			}

			try {
				const member = message.guild.member(message.author);
				const taggedUser = message.mentions.users.first();
				const alive = client.emojis.cache.find(emoji => emoji.name === "alive");
				const dead = client.emojis.cache.find(emoji => emoji.name === "dead");

				if (!message.mentions.users.size) return message.reply('t\'as oublié le tag sérieux');

				const emojiReact = (reaction, user) => {
					return ["dead", "alive"].includes(reaction.emoji.name) && user.id === message.author.id;
				};

				await message.channel
					.send(`<@!${message.author.id}> veut expulser ${args}.\nIl vit : ${alive}\nIl meurt : ${dead}`)
					.then(() => {
						console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} veut expulser ${taggedUser.username}`)
					});
				await message.react(dead).then(() => message.react(alive));
				await message.awaitReactions(emojiReact, { max: 1 })
					.then(collected => {
						const reaction = collected.first();
						const countgif = new Discord.MessageEmbed()
							.setTitle('#EXEC KICKCOUNTER.EXE')
							.attachFiles('https://i.pinimg.com/originals/fc/1b/71/fc1b714dd4e30ba4c1be2d7d432d51b0.gif');

						if (reaction.emoji.name === "dead") {
							message.channel.send(countgif);
							message.author
								.send('au final c\'est toi qui est exclue hahaha\n' + invit())
								.then(() => {
									// message.delete().catch(O_o => { })
									member.kick();
									console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${client.user.username} : executé`);
								})
						} else {
							message.channel.send('une sentence annulée...');
							console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${client.user.username} : suspendu`);
						}
					});
			} catch (err) {
				message.channel.send('maintenance de la commande en cours...')
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Sortie kickCounter() :`, err);
			}
		}

		async function response_controller() {
			let list_communs_go = 0
			let list_communs_do = 0
			let list_communs_log = 0
			let list_communs_lov = 0
			let list_communs_hi = 0
			let list_communs_by = 0
			const list_replies = {
				"bonjour": ["salut", "bonjour", "coucou", "yo"],
				"bye": ["à", "plus", "toute", "bye", "revoir"],
				"aller": ["va", "bien", "vas", "tu", "ça", "comment", "?", "gaze"],
				"faire": ["fais", "fous", "fait", "tu", "quoi", "?"],
				"logs": ["écoute", "logs", "regarde", "quoi", "tu", "mate", "?"],
				"shifumi": ["pierre", "feuille", "ciseau", "shifumi", "shi-fu-mi", "shi", "fu", "mi"],
				"aimer": ["m'aime", "t'aime", "je", "tu", "m'aimes", "t'aimes", "?"]
			}

			for (i in human_question) {
				for (y in list_replies) {
					if (list_replies[y] == list_replies["bonjour"]) {
						for (w in list_replies["bonjour"]) {
							if (list_replies["bonjour"][w] == human_question[i]) {
								list_communs_hi += 1
								if (list_communs_hi == 1) {
									message.channel.send(`bien le bonjour à toi ${authorMessage}!`)
									list_communs_hi = 0
								}
							}
						}
					} else if (list_replies[y] == list_replies["bye"]) {
						for (w in list_replies["bye"]) {
							if (list_replies["bye"][w] == human_question[i]) {
								list_communs_by += 1
								if (list_communs_by >= 1) {
									message.channel.send(`à une prochaine ${authorMessage} !`)
									list_communs_by = 0
								}
							}
						}
					} else if (list_replies[y] == list_replies["aller"]) {
						for (w in list_replies["aller"]) {
							if (list_replies["aller"][w] == human_question[i]) {
								list_communs_go += 1
								if (list_communs_go >= 3) {
									message.channel.send('je vais bien et toi ?')
									list_communs_go = 0
								}
							}
						}
					} else if (list_replies[y] == list_replies["faire"]) {
						for (w in list_replies["faire"]) {
							if (list_replies["faire"][w] == human_question[i]) {
								list_communs_do += 1
								if (list_communs_do >= 3) {
									message.channel.send('je zone sur discord...')
									list_communs_do = 0
								}
							}
						}
					} else if (list_replies[y] == list_replies["logs"]) {
						for (w in list_replies["logs"]) {
							if (list_replies["logs"][w] == human_question[i]) {
								list_communs_log += 1
								if (list_communs_log >= 3) {
									message.channel.send(`j'espionne tout`)
									list_communs_log = 0
								}
							}
						}
					} else if (list_replies[y] == list_replies["aimer"]) {
						for (w in list_replies["aimer"]) {
							if (list_replies["aimer"][w] == human_question[i]) {
								list_communs_lov += 1
								if (list_communs_lov >= 2) {
									if (human_question.indexOf(list_replies["aimer"]["?"])) {
										message.channel.send(`oh moi aussi ${authorMessage}...`)
									} else {
										message.channel.send(`oooh !`)
									}
									list_communs_lov = 0
								}
							}
						}
					} else if (list_replies[y] == list_replies["shifumi"]) {
						for (w in list_replies["shifumi"]) {
							if (list_replies["shifumi"][w] == human_question[i]) {
								const shifumi = [
									"pierre",
									"feuille",
									"ciseaux"
								]
								const random_shifumi = shifumi[Math.floor(Math.random() * shifumi.length)]
								message.channel.send('vas-y ! dans 3 !..')
								await wait(4)
								message.channel.send('2 !!')
								await wait(4)
								message.channel.send('et 1 ....!')
								await wait(4)
								message.channel.send(` ${random_shifumi} !!`)
								// TODO: add win or lose
							}
						}
					}
				}
			}
		}

		async function killBot() {
			if (message.author.id === godMaster) {
				message.delete().catch(O_o => { })
				await message.channel.send('destroyiiiiniginezoesqocpnqfkn')
					.then(() => {
						wait(1000)
						client.destroy()
					});
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} :  ${msg}`)
			} else {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} :  ${msg}`)
				message.channel.send('nos développeurs travaillent actuellement sur cette commande')
			}
		}

		async function resetBot() {
			if (message.author.id === godMaster) {
				message.delete().catch(O_o => { })
				await message.channel.send('petite douche je reviens')
					.then(() => {
						wait(1000)
						client.destroy()
					})
					.then(() => {
						wait(1000)
						client.login(token)
					});
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} :  ${msg}`);

			} else {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} :  ${msg}`)
				message.channel.send('nos développeurs travaillent actuellement sur cette commande')
			}
		}

		if (message.author.bot) return;

		if (message.author.id === godMaster) {

			if (Math.random() < .05) {

				try {
					const dio = client.emojis.cache.find(emoji => emoji.name === "dio");
					message.react(dio)
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ZA WARUDO!!!`)
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Can't find emoji her`)
				}
			}
		}

		if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {

			if (Math.random() <= 1) {
				try {
					collectionBot.get('trashtalk').execute(message);
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} : ${msg}\n[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${client.user.username} use (or not) a trashtalk`)
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Erreur sortie randomCollection : `, err);
				}
			}
		}

		for (i in human_question) {
			if (human_question[i] == `<@!${client.user.id}>`) {
				delete human_question[i];
				response_controller();
			}
		}

		if (!message.content.startsWith(prefix)) {

			if (!collectionReply.has(msg)) return;

			try {
				collectionReply
					.get(msg)
					.execute(message);
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} : ${msg}`)
			} catch (err) {
				console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Erreur sortie Reply : `, err);
			}
			if (badBoy.includes(message.author.id)) {

				if (Math.random() > .05) return;

				try {
					message.delete().catch(O_o => { })
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # message deleted`)
				} catch (err) {
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # Can't delete badBoy's message`)
				}
			}
		} else {
			switch (command) {
				case 'uptime':
					uptimeFunction();
					break;
				case 'status':
					statusFunction();
					break
				case 'votekick':
					kickCounter();
					break
				case 'kill':
					killBot();
					break
				case 'reset':
					resetBot();
					break
				case checkCollection:
					collectionCommands
						.get(command)
						.execute(message, args, client);
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # ${authorMessage} : ${msg}`)
					break
				default:
					console.log(`[${getCurrentDatetime()}] || ${message.guild.name} / ${message.channel.name} # tentative de command ${msg} par ${authorMessage}`)
					message.channel.send('nos développeurs travaillent actuellement sur cette commande')
			}
		}
	})

client.login(token)
	.then(() => console.log(`[${getCurrentDatetime()}]# ${client.user.username} logged`))
	.catch(console.error);