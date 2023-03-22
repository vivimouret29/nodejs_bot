'use.strict'

const { sendEmbed, getCurrentDatetime, messageErase } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'say',
        description: 'a dynamic tchat',
        args: true
    },
    async execute(message, client, language, user, args, initDateTime) {
        if (message.guildId == null) {
            return await sendEmbed(message, language.restricted)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };

        var say = args.join(' ');

        await messageErase(message);
        await message.channel
            .send(say)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command say ${err}`); });
    }
};