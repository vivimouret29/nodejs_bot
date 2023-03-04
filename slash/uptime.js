'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Pour connaître sa durée de fonctionnement'),
    async execute(message, client, language, initDateTime) {
        try {
            let totalSeconds = (client.uptime / 1000),
                days,
                hours,
                minutes,
                seconds,
                start = initDateTime;

            Math.floor(totalSeconds / 86400) < 10 ? days = `0${Math.floor(totalSeconds / 86400)}` : days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;

            Math.floor(totalSeconds / 3600) < 10 ? hours = `0${Math.floor(totalSeconds / 3600)}` : hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;

            Math.floor(totalSeconds / 60) < 10 ? minutes = `0${Math.floor(totalSeconds / 60)}` : minutes = Math.floor(totalSeconds / 60);
            Math.floor(totalSeconds % 60) < 10 ? seconds = `0${Math.floor(totalSeconds % 60)}` : seconds = Math.floor(totalSeconds % 60);

            message.reply({
                'content': `${language.uptime} **${days}:${hours}:${minutes}.${seconds}**\n${start}`,
                'ephemeral': true
            });
        } catch (err) {
            message.reply({ 'content': language.error, 'ephemeral': true });
            console.log(`[${getCurrentDatetime('comm')}] Error function uptime() ${err}`);
        };
    }
};