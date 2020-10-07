module.exports = {
    name: 'no',
    description: 'a dynamic reply',
    execute(message) {
        const Discord = require('discord.js');
        const nogif = new Discord.MessageEmbed()
            .setTitle('NO NO NO NO NO')
            .attachFiles('https://i.pinimg.com/originals/da/eb/26/daeb26a70a817fbeef6f8e3b5c9baee1.gif');

        message.channel.send(nogif)
    }
};