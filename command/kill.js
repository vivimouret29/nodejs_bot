'use.strict'

const { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'kill',
        description: 'a dynamic kill',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        await sendEmbed(message, language.killBot)
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });

        new Promise(resolve => setTimeout(resolve, 3 * 1000));
        
        client.destroy();
        process.kill(process.pid);
    }
};