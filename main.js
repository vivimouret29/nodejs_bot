require('dotenv').config()

const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;

//Toutes les actions à faire quand le bot se connecte
bot.on("ready", function () {
    console.log('daftbot vas tout détruire bip bip')
})

bot.login(TOKEN)

bot.on('guildMemberAdd', member => {
  member.createDM().then(channel => {
    return channel.send('Bienvenue à toi jeune padawan ' + member.displayName)
  }).catch(console.error)
})

//ajoute une variable msg pour remplacer message.content

bot.on('message', message => { 
	if (message.content == 'bot') {
		message.reply('on sait tous que daftbot est supérieur à pybot')
		console.log('reply bestbot')
	}
	if (message.content === 'salope') {
		message.reply('toi-même connard')
		console.log('reply salope')
	}
	if (message.content === 'pute') {
                message.reply('pas les mamans')
		console.log('reply pute')
        }
	if (message.content === 'crash') {
                message.reply('je parie sur un ragequit')
		console.log('reply crash')
        }
	if (message.content == 'buy') {
                message.reply('Remerciement de la part de toutes les équipes de Steam et Instant-Gaming')
		console.log('reply buy')
        }
	//if (message.content === 'yes') {
	//	message.content.channel.send('', {files: ["./images/ElatedGlamorousAmericanindianhorse-size_restricted.gif"]})
	//	console.log('reply yes')
	//}
})

//Permissions du bot au sein du serveur

//class discord.Permissions(permissions=515136) {
//	discord.utils.oauth_url(757955750164430980,permissions=515136)
//}
