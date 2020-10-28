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
			// } else {
			member.guild.channels.cache
				.find(ch => ch.name === 'général')
				.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`);
		} catch (err) {
			console.log(`[${getCurrentDatetime()}]# Erreur d'ajout de membre(s)/rôle : `, err);
		}
		// }
	})
	.on('message', async message => {

		// console.log(message.guild)
		
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const msg = message.content.toLowerCase();
		const authorMessage = message.author.username;
		const badChannels = ['news-anime', 'leekwars'];
		const badBot = ['757970907992948826', '758319298325905428'];
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
			console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`);
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

			} else return message.channel.send('t\'as pas le droit d\'y toucher')
			console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`);
		}

		async function kickCounter() {

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
						console.log(`[${getCurrentDatetime()}]# ${authorMessage} veut expulser ${taggedUser.username}`)
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
								.send('au final c\'est toi qui est exclue hahaha\n' + invit)
								.then(() => {
									member.kick();
									console.log(`[${getCurrentDatetime()}]# ${client.user.username} : executé`);
								})
						} else {
							message.channel.send('une sentence annulée...');
							console.log(`[${getCurrentDatetime()}]# ${client.user.username} : suspendu`);
						}
					});
			} catch (err) {
				message.channel.send('maintenance de la commande en cours...')
				console.log(`[${getCurrentDatetime()}]# Sortie kickCounter() :`, err);
			}
		}

		function randomCollection() {
			if (Math.random() < .5) return collectionBot.get('trash').execute(message);
			else return collectionBot.get('talk').execute(message);
		}

		async function killBot() {
			if (message.author.id === godMaster) {
				message.delete().catch(O_o => { })
				await message.channel.send('destroyiiiiniginezoesqocpnqfkn')
					.then(() => client.destroy());
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`)
			} else {
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`)
				message.channel.send('nos développeurs travaillent actuellement sur cette commande')
			}
		}

		async function resetBot() {
			if (message.author.id === godMaster) {
				message.delete().catch(O_o => { })
				await message.channel.send('petite douche je reviens')
					.then(() => client.destroy())
					.then(() => client.login(token));
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`);

			} else {
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`)
				message.channel.send('nos développeurs travaillent actuellement sur cette commande')
			}
		}

		if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {

			if (Math.random() <= .2) {

				try {
					randomCollection()
					console.log(`[${getCurrentDatetime()}]# ${authorMessage} : ${msg}\n[${getCurrentDatetime()}]# ${client.user.username} : petit trashtalk`)
				} catch (error) {
					console.error(error);
				}
			}
		}

		if (message.author.bot) return;

		if (!message.content.startsWith(prefix)) {

			if (!collectionReply.has(msg)) return;

			try {
				collectionReply
					.get(msg)
					.execute(message);
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} : ${msg}`)
			} catch (err) {
				console.log(`[${getCurrentDatetime()}]# Sortie : `, err);
			}

		} else {

			switch (command) {
				case 'uptime', 'up':
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
					console.log(`[${getCurrentDatetime()}]# ${authorMessage} : ${msg}`)
					break
				default:
					console.log(`[${getCurrentDatetime()}]# ${authorMessage} : ${msg}`)
					message.channel.send('nos développeurs travaillent actuellement sur cette commande')
			}
		}
	})

client.login(token)
	.then(() => {
		console.log(`[${getCurrentDatetime()}]# ${client.user.username} logged`)
	})
	.catch(console.error);