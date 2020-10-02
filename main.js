'use.strict'

const {
	prefix,
	token
} = require("./config.json");

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');

const client = new Discord.Client();
const collection = new Discord.Collection();
const date = new Date();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const replyFiles = fs.readdirSync('./reply').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	collection.set(command.name, command);
}

for (const file of replyFiles) {
	const reply = require(`./reply/${file}`);

	collection.set(reply.name, reply);
}

client
	.on('ready', () => {
		client.user.setPresence({
			activity: {
				name: `à réparer les pots`,
				type: 'PLAYING',
			},
			status: 'idle'
		})
			// .then(console.log)
			.catch(console.error);
	})
	.on('guildMemberAdd', member => {
		member.createDM().then(channel => {
			console.log(`[${replydate}] REPLY NEW MEMBER ${message.author.username}`)
			return channel.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`);
		})
			.then(console.log)
			.catch(console.error);
	})
	.on('message', async message => {

		function uptimeFunction() {
			let totalSeconds = (client.uptime / 1000);
			let days = Math.floor(totalSeconds / 86400);
			totalSeconds %= 86400;
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = Math.floor(totalSeconds % 60);

			message.delete().catch(O_o => { })
			message.channel.send(`\`UPTIME|SATELLITE : ${days}D:${hours}H:${minutes}M:${seconds}S\``)
			console.log(`[${replydate}] REPLY ${command} FROM ${autmsg}`);
		}

		function statusFunction() {
			const stOnOff = args[0]
			const typeThings = args[1]
			const nameText = args[2]
			const urlLike = args[3]

			if (message.author.id === '431915542610313217') {
				if (!urlLike === undefined) {
					client.user.setPresence({
						activity: {
							name: `${nameText}`,
							type: `${typeThings}`,
							url: `${urlLike}`
						},
						status: `${stOnOff}`
							.catch(
								console.error,
								message.channel.send(`problème avec ton status`)
							)
					});
					message.delete().catch(O_o => { })
					message.channel.send('changement d\'activité !')
				} else {
					client.user.setPresence({
						activity: {
							name: `${nameText}`,
							type: `${typeThings}`
						},
						status: `${stOnOff}`
							.catch(
								console.error,
								message.channel.send(`problème avec ton status`)
							)
					});
					message.delete().catch(O_o => { })
					message.channel.send('changement d\'activité !')
				}
			} else return message.channel.send('t\'as pas le droit d\'y toucher')
			console.log(`[${replydate}] REPLY ${command} ${args}, FROM ${autmsg}`);
		}

		if (message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const msg = message.content.toLowerCase();
		const autmsg = message.author.username;
		const taggedUser = message.mentions.users.first();
		let replydate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

		if (!message.content.startsWith(prefix)) {

			if (!collection.has(msg)) return;

			try {
				collection.get(msg).execute(message);
				console.log(`[${replydate}] REPLY ${msg} FROM ${autmsg}`)
			} catch (error) {
				console.error(error);
			}
		} else {

			if (command === 'uptime') {
				uptimeFunction();
			}

			if (command === 'status') {
				statusFunction();
			}

			if (!collection.has(command)) return;

			try {
				if (command === 'prune') {
					collection.get(command).execute(message, args, client);
					console.log(`[${replydate}] REPLY ${command} FROM ${autmsg} WITH ${args} ERASED LINES`)
				} else if (command === 'kick') {
					collection.get(command).execute(message, args, client);
					console.log(`[${replydate}] REPLY ${command} FROM ${autmsg} TO ${taggedUser.username} lol`)
				} else {
					collection.get(command).execute(message, args, client);
					console.log(`[${replydate}] REPLY ${command} FROM ${autmsg}`)
				}
			} catch (error) {
				console.error(error);
			}
		}
	})
	.on('error', console.log);

client.login(token)
	.then(() => console.log(`${client.user.username} logged`))
	.catch(console.error);