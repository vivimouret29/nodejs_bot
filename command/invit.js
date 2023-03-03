'use.strict'

const { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'invit',
        description: 'a dynamic invit',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        await sendEmbed(message, language.invitMsg, true)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};