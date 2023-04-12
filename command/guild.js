'use.strict'

const { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'guild',
        description: 'a dynamic guild',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        await sendEmbed(message, `${client.user.username} ${language.guild} (**${client.guilds.cache.size}**)\n${client.guilds.cache.map(guild => guild.name).join('\n ')}`)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};