'use.strict'

const {
	prefix,
	token
} = require("./config.json");

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');

const wait = require('util').promisify(setTimeout);

const client = new Discord.Client();
const collection = new Discord.Collection();
const date = new Date();

const replydate = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

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
	.on('ready', async () => {
		await wait(1000);

		client.user.setPresence({
			activity: {
				name: `réparer les pots`,
				type: 'PLAYING',
			},
			status: 'idle'
		})
			.catch(console.error);
	})
	.on('guildMemberAdd', member => {
		member.createDM().then(channel => {
			console.log(`[${replydate}]# Games-&-Work/Homepage/general-chat/newMember/${member.user.username}`)
			return channel.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`);
		})
			.catch(console.error);
	})
	.on('message', async message => {

		if (message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const msg = message.content.toLowerCase();
		const authorMessage = message.author.username;
		const member = message.guild.member(message.author);

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
			console.log(`[${replydate}]# ${authorMessage} :  ${msg}`);
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
			console.log(`[${replydate}]# ${authorMessage} :  ${msg}`);
		}

		async function kickCounter() {
			if (message.author.id === '431915542610313217') {
				const tkick = new Discord.MessageEmbed()
					.setTitle('bye bye')
					.attachFiles(['./images/bob.gif'])

				if (!message.mentions.users.size) {
					return message.reply('tag une personne aléatoirement ehe');
				}

				message.delete().catch(O_o => { })
				message.channel.send(`eh ${args}, une surprise t'attend...`);

				await message.author.send(`au final c'est toi qui est exclue hahaha`)
				await message.author.send(tkick)
				await message.author.send('https://discord.gg/3ZQmHb')
				await member.kick()
				console.log(`[${replydate}]# ${authorMessage} :  ${prefix}${command} ${authorMessage}\n[${replydate}]# ${client.user.username} : lol`)
			} else {
				message.channel.send('fonctionnality not available for you yet xoxo')
				console.log(`[${replydate}]# ${authorMessage} :  ${prefix}${command} ${authorMessage}`)
			}
		}


		if (!message.content.startsWith(prefix)) {

			if (!collection.has(msg)) return;

			try {
				collection.get(msg).execute(message);
				console.log(`[${replydate}]# ${authorMessage} :  ${msg}`)
			} catch (error) {
				console.error(error);
			}
		} else {

			if (command === 'uptime') return uptimeFunction();

			if (command === 'status') return statusFunction();

			if (command === 'votekick') return kickCounter(member);

			if (!collection.has(command)) return;

			try {
				if (command === 'prune') {
					collection.get(command).execute(message, args, client);
					console.log(`[${replydate}]# ${authorMessage} :  ${msg}`)
					// } else if (command === 'kick') {
					// 	collection.get(command).execute(message, args, client);
					// 	console.log(`[${replydate}]# ${authorMessage} :  ${msg} \n[${replydate}]# ${client.user.username} : lol`)
				} else {
					collection.get(command).execute(message, args, client);
					console.log(`[${replydate}]# ${authorMessage} :  ${msg}`)
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