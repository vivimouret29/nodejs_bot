module.exports = {
    name: 'daftbot',
    description: 'a dynamic reply',
    execute(message) {
        const Discord = require('discord.js');
        const botgif = new Discord.MessageEmbed()
            .setTitle('je suis un petit être dans une fiole')
            .attachFiles('https://i.skyrock.net/7297/93457297/pics/3273728730_1_2_yrHEcA4w.gif');
            
        message.channel.send(botgif)
    }
};