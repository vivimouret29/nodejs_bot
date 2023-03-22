'use.strict'

const { sendEmbed } = require('../core/utils.js'),
    package = require('../package.json');

module.exports = {
    data: {
        name: 'version',
        description: 'a dynamic view version',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        await sendEmbed(message, `daftbot ${package.version}`)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};