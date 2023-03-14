'use.strict'

const { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'vote',
        description: 'a dynamic view vote',
        args: false
    },
    async execute(message, client, language, args, initDateTime) {
        await sendEmbed(message, `${language.vote}\nhttps://top.gg/bot/757955750164430980/vote`)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};