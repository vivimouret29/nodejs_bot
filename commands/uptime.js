module.exports = {
    name: 'uptime',
    description: 'a dynamic uptime',
    execute(message) {
        const Discord = require('discord.js');
        const client = new Discord.Client();

        let totalSeconds = (client.uptime / 1000)
		let days = Math.floor(totalSeconds / 86400)
		totalSeconds %= 86400
		let hours = Math.floor(totalSeconds / 3600)
		totalSeconds %= 3600
		let minutes = Math.floor(totalSeconds / 60)
		let seconds = Math.floor(totalSeconds % 60)
        let uptime = `en ligne depuis ${days}j, ${hours}h, ${minutes}m et ${seconds}s frère`
        
        message.delete().catch(O_o => { })
        message.channel.send(uptime)
    }
};