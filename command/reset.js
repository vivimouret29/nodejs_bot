'use.strict'

const { ActivityType } = require('discord.js'),
    { token, owner } = require('../config.json'),
    { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'reset',
        description: 'a dynamic reset'
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id === owner)) {
            return await sendEmbed(message, language.areYouOwner)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };

        await sendEmbed(message, language.resetBot)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
        client.destroy();

        new Promise(resolve => setTimeout(resolve, 2 * 1000));
        client.login(token);

        new Promise(resolve => setTimeout(resolve, 5 * 1000));
        client.user.setPresence({
            activities: [{
                name: language.activities,
                type: ActivityType.Streaming,
                url: 'https://twitch.tv/daftmob'

            }],
            status: 'online'
        });
    }
};