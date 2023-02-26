'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    package = require('../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Pour connaître sa version actuelle'),
    async execute(message, client, language, initDateTime) {
        await message.reply({ 'content': `daftbot ${package.version}`, 'ephemeral': true });
    }
};