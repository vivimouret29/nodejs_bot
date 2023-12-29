'use.strict'

const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'hahaha',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) { 
        let reply = new EmbedBuilder()
            .setDescription(language.replyLaugh)
            .setImage('https://media2.giphy.com/media/jQmVFypWInKCc/giphy.gif?cid=ecf05e4718162bqt0bq1i56jd38ym14f26scslk3pmmnaqbb&ep=v1_gifs_search&rid=giphy.gif&ct=g');

        await message.channel.send({ embeds: [reply] });
    }
};