'use.strict'

const { sendEmbed } = require('../core/function.js');

module.exports = {
    data: {
        name: 'guild',
        description: 'a dynamic guild'
    },
    async execute(message, client, language, args, initDateTime) {
        await sendEmbed(message, `${client.user.username} ${language.guild}\n${client.guilds.cache.map(guild => guild.name).join(', ')}`);
    }
};