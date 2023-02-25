'use.strict'

const { sendEmbed } = require('../core/function.js');

module.exports = {
    data: {
        name: 'invit',
        description: 'a dynamic invit',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        await sendEmbed(message, language.invitMsg, true);
    }
};