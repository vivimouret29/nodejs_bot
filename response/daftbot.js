'use.strict'

const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'daftbot',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) {
        let reply = new EmbedBuilder()
            .setDescription(language.replyBot)
            .setImage('https://i.pinimg.com/originals/47/2f/f2/472ff232694ba223afd8e26b82e4cdc8.gif');

        await message.channel.send({ embeds: [reply] });
    }
};