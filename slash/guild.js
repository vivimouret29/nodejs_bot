'use.strict'

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild')
        .setDescription('Liste les serveurs où daftbot règne'),
    async execute(message, client, language, initDateTime) {
        await message.reply({
            'content': `${client.user.username} ${language.guild}\n${client.guilds.cache.map(guild => guild.name).join('\n ')}`,
            'ephemeral': true
        });
    }
};