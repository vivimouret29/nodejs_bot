'use.strict'

const { EmbedBuilder } = require('discord.js');

module.exports = {
    daftbot: {
        name: 'daftbot',
        description: 'a dynamic reply',
        execute(message, args) {
            let reply = new EmbedBuilder()
                .setDescription(args.language.replyBot)
                .setImage('https://i.skyrock.net/7297/93457297/pics/3273728730_1_2_yrHEcA4w.gif');

            message.channel.send({ embeds: [reply] });
        }
    },
    laugh: {
        name: 'hahaha',
        description: 'a dynamic reply',
        execute(message, args) {
            message.channel.send(args.language.replyAgg);
        }
    },
    no: {
        name: 'no',
        description: 'a dynamic reply',
        execute(message) {
            let reply = new EmbedBuilder()
                .setDescription('NO NO NO')
                .setImage('https://i.pinimg.com/originals/da/eb/26/daeb26a70a817fbeef6f8e3b5c9baee1.gif');

            message.channel.send({ embeds: [reply] });
        }
    },
    yes: {
        name: 'yes',
        description: 'a dynamic reply',
        execute(message) {
            let reply = new EmbedBuilder()
                .setDescription('YES YES YES')
                .setImage('https://i.pinimg.com/originals/80/ca/e3/80cae3013cf2513e3cef9179f7d64073.gif');

            message.channel.send({ embeds: [reply] });
        }
    },
    tqt: {
        name: 'tqt',
        description: 'a dynamic reply',
        execute(message, args) {
            message.reply(args.language.replyWorried);
        }
    }
};