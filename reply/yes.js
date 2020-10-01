module.exports = {
    name: 'yes',
    description: 'a dynamic reply',
    execute(message) {
        const Discord = require('discord.js');
        const yesgif = new Discord.MessageEmbed()
            .setTitle('YES YES YES YES YES')
            .attachFiles(['./images/YESYESYESYESYES.gif']);

        message.channel.send(yesgif)
    }
};