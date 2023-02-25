'use.strict'

const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'non',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) {
        let reply = new EmbedBuilder()
            .setDescription('NO NO NO')
            .setImage('https://i.pinimg.com/originals/da/eb/26/daeb26a70a817fbeef6f8e3b5c9baee1.gif');

        await message.channel.send({ embeds: [reply] });
    }
};