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

	// anti-boucle
	if (message.author.bot) return
	
	if (!message.content.startsWith(config.prefix)) {

		// plusieurs tacles
		if (msg.includes('fuck')) {
				message.channel.send('je sais mec....')
				console.log(`reply fuck from ${member.displayName}`)
		}
		if (msg.includes('salope')) {
				message.reply('tu devrais baisser d\'un ton')
				console.log('reply salope')
		}
		if (msg.includes('beep')) {
				message.reply('boop')
				console.log('reply etib')
		}
		if (msg.includes('pute')) {
				message.channel.send('roooh pas les mamans')
				console.log('reply pute')
		}
		if (msg.includes('crash')) {
				message.channel.send('je parie sur un ragequit')
				console.log('reply crash')
		}
		if (msg.includes('buy')) {
				message.channel.send('Remerciement de la part de toutes les équipes de Steam et Instant-Gaming')
				console.log('reply buy')
		}
			
		// gif
		if (msg.includes('yes')) {
				const yesgif = new Discord.MessageEmbed()
					.setTitle('YES YES YES YES YES')
					.attachFiles(['./images/YESYESYESYESYES.gif'])
				message.channel.send(yesgif)
				console.log('reply yes')
		}
		if (msg.includes(client.user.username)) {
				const botgif = new Discord.MessageEmbed()
					.setTitle('je suis un petit être dans une fiole')
					.attachFiles(['./images/homonculus.gif'])
				message.channel.send(botgif)
				console.log('reply homonculus')
		}

	} else {
	
			// help
			if (command === 'help') {
					message.delete().catch(O_o=>{})	// permet de supprimer le commentaire
					message.channel.send('\
					```help : faire ce que tu fais ducon\
						say : permet de me faire répéter n\'importe quelle connerie\
						ping : teste la latence\
						version : bah...```\
					')
					console.log('reply help')
			}

			// version
			if (command === 'version') {
					message.delete().catch(O_o=>{})
					message.channel.send('daftbot v.1.1.2')
			}

			// perroquet
			if (command === 'say') {
					const sayMessage = args.join(" ")
					message.delete().catch(O_o=>{})
					message.channel.send(sayMessage)
					console.log('reply spoke')
			}

			// ping ?
			if (command === 'ping') {
					// message.delete().catch(O_o=>{})
					const m = await message.channel.send("AAAAAAAATTTEEEEEEENNNNNNNNNNNNNDDDDDDDDDSSSSSSSSSSSSS!!!!")
					m.edit(`.. la latence est d'${m.createdTimestamp - message.createdTimestamp}ms.. hhh.. et celle de l'api est d'${Math.round(client.ws.ping)}ms.. aaarggh....`)
					message.reply('plus jamais putain...')
					console.log('reply ping')
			}

			// petite prune 
			if (command === 'prune') {
					message.reply('t\'a supprimé des messages...')
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
					console.log('reply prune')
			}
		}
});

client.login(config.token);