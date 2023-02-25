'use.strict'

const { ActivityType } = require('discord.js'),
    { token, owner } = require('../config.json'),
    { sendEmbed } = require('../core/function.js');

module.exports = {
    data: {
        name: 'reset',
        description: 'a dynamic reset'
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id === owner)) return await sendEmbed(message, language.areYouOwner);

        await await sendEmbed(message, language.resetBot);
        new Promise(resolve => setTimeout(resolve, 1 * 1000));
        client.destroy();

        new Promise(resolve => setTimeout(resolve, 1 * 1000));
        client.login(token);

        client.user.setPresence({
            activities: [{
                name: language.activities,
                type: ActivityType.Watching

            }],
            status: 'online'
        });
    }
};