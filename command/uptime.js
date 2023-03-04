'use.strict'

const { sendEmbed, getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'uptime',
        description: 'a dynamic uptime'
    },
    async execute(message, client, language, args, initDateTime) {
        try {
            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
            let start = initDateTime;

            await sendEmbed(message, `${language.uptime} ${days}:${hours}:${minutes}:${seconds}\n${start}`)
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