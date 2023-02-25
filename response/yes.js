'use.strict'

const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'oui',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) {
        let reply = new EmbedBuilder()
            .setDescription('YES YES YES')
            .setImage('https://i.pinimg.com/originals/80/ca/e3/80cae3013cf2513e3cef9179f7d64073.gif');

        await message.channel.send({ embeds: [reply] });
    }
};