'use.strict'

const { ActivityType } = require('discord.js'),
    { token } = require('../config.json'),
    { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'reset',
        description: 'a dynamic reset',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
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
                type: ActivityType.Watching

            }],
            status: 'online'
        });
    }
};