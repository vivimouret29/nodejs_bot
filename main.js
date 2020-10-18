'use.strict'

const {
	prefix,
	token,
	invit
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
				name: `s'embellir`,
				type: 'PLAYING',
			},
			status: 'dnd'
		})
			// .catch(console.error);
	})
	.on('guildMemberAdd', member => {
		// const userRoles = member.roles.cache
		// if (this.member.id === memberber.id) {
		// 	this.member.get(userRoles)
		// } else {
		member.createDM().then(channel => {
			console.log(`[${getCurrentDatetime()}]# Games-&-Work/Homepage/general-chat/newMember/${member.user.username}`)
			return channel.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`);
		})
		// }
	})
	.on('message', async message => {

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const msg = message.content.toLowerCase();
		const authorMessage = message.author.username;
		const member = message.guild.member(message.author);

		// console.log(member.roles.cache)

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

			if (message.author.id === '431915542610313217') {

				if (urlLike === undefined) {
					client.user.setPresence({
						activity: {
							name: `${nameText}`,
							type: `${typeThings}`
						},
						status: `${stOnOff}`
					})
						// .catch(
						// 	console.error,
						// )
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
						// .catch(
						// 	console.error,
						// )
					message.delete().catch(O_o => { })
					message.channel.send('changement d\'activité !')
				}

			} else return message.channel.send('t\'as pas le droit d\'y toucher')
			console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`);
		}

		async function kickCounter() {
			const filter = (reaction, user) => {
				return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			if (!message.mentions.users.size) return message.reply('t\'as oublié le tag sérieux');

			message.react('👍').then(() => message.react('👎'));

			message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();
					const countgif = new Discord.MessageEmbed()
						.setTitle('#EXEC KICKCOUNTER.EXE')
						.attachFiles('https://i.pinimg.com/originals/fc/1b/71/fc1b714dd4e30ba4c1be2d7d432d51b0.gif');

					if (reaction.emoji.name === '👍') {
						message.channel.send(countgif)
						return message.author.send('au final c\'est toi qui est exclue hahaha\n' + invit)
							.then(() => {
								member.kick()
								console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}\n[${getCurrentDatetime()}]# ${client.user.username} : executé`)
							})
					} else {
						message.channel.send('une sentence annulée...')
						console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}\n[${getCurrentDatetime()}]# ${client.user.username} : suspendu`)
					}
				});
		}

		function randomCollection() {
			if (Math.random() < .5) return collectionBot.get('trash').execute(message);
			else return collectionBot.get('talk').execute(message);
		}

		if (message.author.id === '757970907992948826') {

			if (Math.random() <= .3) {
				try {
					randomCollection()
					console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}\n[${getCurrentDatetime()}]# ${client.user.username} : petit trashtalk`)
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
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`)
			} catch (error) {
				console.error(error);
			}

		} else {

			if (command === 'uptime') return uptimeFunction();

			if (command === 'status') return statusFunction();

			if (command === 'votekick') return kickCounter(member);

			if (!collectionCommands.has(command)) return;

			try {
				collectionCommands
					.get(command)
					.execute(message, args, client);
				console.log(`[${getCurrentDatetime()}]# ${authorMessage} :  ${msg}`)
			} catch (error) {
				console.error(error);
			}
		}
	})

client.login(token)
	.then(() => console.log(`${client.user.username} logged`))
	// .catch(console.error);