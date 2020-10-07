module.exports = {
    name: 'yes',
    description: 'a dynamic reply',
    execute(message) {
        const Discord = require('discord.js');
        const yesgif = new Discord.MessageEmbed()
            .setTitle('YES YES YES YES YES')
            .attachFiles('https://i.pinimg.com/originals/80/ca/e3/80cae3013cf2513e3cef9179f7d64073.gif');

        message.channel.send(yesgif)
    }
};