require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;

// variable personnelles
const yesyes = new Discord.MessageEmbed()
	.setTitle('YES YES YES YES YES')
	.attachFiles(['./images/ElatedGlamorousAmericanindianhorse-size_restricted.gif'])
const homonculus = new Discord.MessageEmbed()
	.setTitle('je suis un petit être dans une fiole')
	.attachFiles(['./images/received_3303082543102197.gif'])

// message de connexion au serveur

module.exports.run = async(client, message, args) => {
	let User = args[0];
	let Reason = args.slice(1).join(` `);
}

client.on("ready", function () {
	console.log('bip boup.. ' + client.user.username + ' vas tout détruire !! bip bip..')
	// console.log(client.users.cache.Collection[1])
	// client.users.get('name', 'hbooex').id
	// for (guild in client.guilds) {
	// 	console.log('Nom du serveur : ' + guilds.name)
	// 	for (member in guild.members) {
	// 		console.log('Nom : ' + member.name)
	// 		console.log('ID : ' + member.id)
	// 	}
	// }
});

// id des serveurs
// '758064568911265834' => DevBot
// '636204768842219531' => Games & Work
// message de connexion d'un nouveau membre

client.on('guildMemberAdd', member => {
  member.createDM().then(channel => {
	console.log('new member')
	return channel.send('Bienvenue à toi jeune padawan ' + member.displayName)
  }).catch(console.error)
});

client.on('message', message => {
	if (message.author === client.user) {
		return
	}
	// switch (message)
	if (message.content.includes('fuck')) {
		message.channel.send('je sais mec....')
		console.log('reply fuck')
	}
	if (message.content.includes('salope')) {
		message.reply('tu devrais baisser d\'un ton')
		console.log('reply salope')
	}
	if (message.content.includes('pute')) {
                message.channel.send('roooh pas les mamans')
		console.log('reply pute')
        }
	if (message.content.includes('crash')) {
                message.channel.send('je parie sur un ragequit')
		console.log('reply crash')
        }
	if (message.content.includes('buy')) {
                message.channel.send('Remerciement de la part de toutes les équipes de Steam et Instant-Gaming')
		console.log('reply buy')
        }
	if (message.content.includes('yes')) {
		message.channel.send(yesyes)
		console.log('reply yes')
	}
	if (message.content.includes('daftbot')) {
		message.channel.send(homonculus)
		console.log('reply homonculus')
	}
});

client.login(TOKEN);