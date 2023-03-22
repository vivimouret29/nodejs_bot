'use.strict'

const { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'invit',
        description: 'a dynamic invit',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        await sendEmbed(message, language.invitMsg)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};