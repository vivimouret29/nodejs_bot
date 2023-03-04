'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Pour connaître sa durée de fonctionnement'),
    async execute(message, client, language, initDateTime) {
        try {
            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
            let start = initDateTime;

            message.reply({ 'content': `${language.uptime} ${days}:${hours}:${minutes}:${seconds}\n${start}`, 'ephemeral': true });
        } catch (err) {
            message.reply({ 'content': language.error, 'ephemeral': true });
            console.log(`[${getCurrentDatetime('comm')}] Error function uptime() ${err}`);
        };
    }
};