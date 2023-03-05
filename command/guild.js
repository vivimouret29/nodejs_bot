'use.strict'

const { owner } = require('../config.json'),
    { sendEmbed, messageErase } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'guild',
        description: 'a dynamic guild'
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id === owner)) {
            return await sendEmbed(message, language.areYouOwner)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };

        await sendEmbed(message, `${client.user.username} ${language.guild}\n${client.guilds.cache.map(guild => guild.name).join('\n ')}`)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};