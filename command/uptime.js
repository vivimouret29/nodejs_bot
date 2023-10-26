'use.strict'

const { sendEmbed, getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'uptime',
        description: 'a dynamic uptime',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
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

            await sendEmbed(message, `${language.uptime} **${days}::${hours}:${minutes}.${seconds}**\n${start}`)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        } catch (err) {
            await sendEmbed(message, language.error)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
            console.log(`[${getCurrentDatetime('comm')}] Error function uptime() ${err}`);
        };
    }
};