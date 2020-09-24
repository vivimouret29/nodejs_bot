const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");


// message de connexion au serveur

client.on("ready", function () {
	console.log(`bip boup..  ${client.user.username} vas tout détruire !! bip boup bip..`)
	client.user.setActivity(`upgrade sa version`)
});

// message de connexion d'un nouveau membre

client.on('guildMemberAdd', member => {
  member.createDM().then(channel => {
	console.log('new member')
	return channel.send(`Jeune padawan ${member.displayName}, bienvenue à toi.`)
  }).catch(console.error)
});

client.on('message', async message => {

	// séparation commande / arguments
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	const msg = message.content.toLowerCase()
	const autmsg = message.author.username

	// time
	var utcdate = Date(Date.UTC(1, 1, 2, 3, 0, 0))
	let totalSeconds = (client.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);
	let uptime = `en ligne depuis ${days} jours, ${hours} heures, ${minutes} minutes et ${seconds} secondes`;

	// anti-boucle
	if (message.author.bot) return
	
	if (!message.content.startsWith(config.prefix)) {

		// plusieurs tacles
		if (msg.includes('tqt')) {
				message.reply('oui je m\'inquiète pour toi...')
				console.log(`reply tqt from ${autmsg}, (${utcdate})`)
				return
		}
		if (msg.includes('hahaha')) {
				message.channel.send('ta gueule')
				console.log(`reply hatg from ${autmsg}, (${utcdate})`)
				return
		}
		if (msg.includes('pute')) {
				message.channel.send('roooh pas les mamans :(')
				console.log(`reply pute from ${autmsg}, (${utcdate})`)
				return
		}
		if (msg.includes('crash')) {
				message.channel.send('je parie sur un ragequit :D')
				console.log(`reply crash from ${autmsg}, (${utcdate})`)
				return
		}
		if (msg.includes('brawl')) {
				message.channel.send('tu parles de ton skill éclaté ?')
				console.log(`reply brawl from ${autmsg}, (${utcdate})`)
				return
		}
			
		// gif
		if (msg.includes('yes')) {
				const yesgif = new Discord.MessageEmbed()
					.setTitle('YES YES YES YES YES')
					.attachFiles(['./images/YESYESYESYESYES.gif'])
				message.channel.send(yesgif)
				console.log(`reply yes from ${autmsg}, (${utcdate})`)
				return
		}
		if (msg.includes(client.user.username)) {
				const botgif = new Discord.MessageEmbed()
					.setTitle('je suis un petit être dans une fiole')
					.attachFiles(['./images/homonculus.gif'])
				message.channel.send(botgif)
				console.log(`reply homonculus from ${autmsg}, (${utcdate})`)
				return
		}

	} else {
	
			// help
			if (command === 'help') {
					message.delete().catch(O_o=>{})	// permet de supprimer le commentaire
					message.channel.send('```Liste help :\n\
					help : faire ce que tu fais ducon\n\
					ping : teste la latence\n\
					say : me fait répéter n\'importe quelle connerie\n\
					uptime : depuis quand le bot est actif\n\
					version : bah...\n\
					```')
					console.log(`reply help from ${autmsg}, (${utcdate})`)
			}
			// uptime
			if (command === 'uptime') {
					message.delete().catch(O_o=>{})
					message.channel.send(utcdate)
					message.channel.send(uptime)
					console.log(`reply uptime from ${autmsg}, (${utcdate})`)
			}

			// version
			if (command === 'version') {
					message.delete().catch(O_o=>{})
					message.channel.send('daftbot v1.1.5')
					console.log(`reply v from ${autmsg}, (${utcdate})`)
			}

			// perroquet
			if (command === 'say') {
					const sayMessage = args.join(" ")
					message.delete().catch(O_o=>{})
					message.channel.send(sayMessage)
					console.log(`reply spoke from ${autmsg}, (${utcdate})`)
			}

			// ping ?
			if (command === 'ping') {
					message.delete().catch(O_o=>{})
					const m = await message.channel.send("AAAAAAAATTTEEEEEEENNNNNNNNNNNNNDDDDDDDDDSSSSSSSSSSSSS!!!!")
					m.edit(`eeeh.. la latence est d'${m.createdTimestamp - message.createdTimestamp}ms.. hhh.. et celle de l'api est d'${Math.round(client.ws.ping)}ms.. aaarggh....`)
					message.reply('stp.. plus jamais putain...')
					console.log(`reply ping from ${autmsg}, (${utcdate})`)
			}

			// petite prune 
			if (command === 'prune') {
					message.reply('t\'as supprimé des messages...')
					const amount = parseInt(args[0])

					if (isNaN(amount)) {
						return message.reply('pas un nombre valide ça frère')
					} else if (amount < 1 || amount > 100) {
						return message.reply('donnes moi un nombre entre 1 et 100')
					}

					message.channel.bulkDelete(amount, true).catch(err => {
						console.error(err);
						message.channel.send('petit problème sur le channel, rien n\'est partie..');
					});
					console.log(`reply prune from ${autmsg} with ${message.content} erased lines, (${utcdate})`)
			}
		}
});

client.login(config.token);