'use.strict'

const { EmbedBuilder } = require('discord.js');

module.exports = {
    daftbot: {
        name: 'daftbot',
        description: 'a dynamic reply',
        async execute(message, args, language) {
            let reply = new EmbedBuilder()
                .setDescription(language.replyBot)
                .setImage('https://i.pinimg.com/originals/47/2f/f2/472ff232694ba223afd8e26b82e4cdc8.gif');

            await message.channel.send({ embeds: [reply] });
        }
    },
    mais: {
        name: 'mais',
        description: 'a dynamic reply',
        async execute(message, args, language) { await message.channel.send(language.replyMais); }
    },
    laugh: {
        name: 'hahaha',
        description: 'a dynamic reply',
        async execute(message, args, language) { await message.channel.send(language.replyAgg); }
    },
    no: {
        name: 'no',
        description: 'a dynamic reply',
        async execute(message) {
            let reply = new EmbedBuilder()
                .setDescription('NO NO NO')
                .setImage('https://i.pinimg.com/originals/da/eb/26/daeb26a70a817fbeef6f8e3b5c9baee1.gif');

            await message.channel.send({ embeds: [reply] });
        }
    },
    yes: {
        name: 'yes',
        description: 'a dynamic reply',
        async execute(message) {
            let reply = new EmbedBuilder()
                .setDescription('YES YES YES')
                .setImage('https://i.pinimg.com/originals/80/ca/e3/80cae3013cf2513e3cef9179f7d64073.gif');

            await message.channel.send({ embeds: [reply] });
        }
    },
    tqt: {
        name: 'tqt',
        description: 'a dynamic reply',
        async execute(message, args, language) { await message.channel.send(language.replyWorried); }
    }
};