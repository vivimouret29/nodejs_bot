'use.strict'

const { owner } = require('../config.json'),
    { sendEmbed } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'kill',
        description: 'a dynamic kill',
        args: false
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id === owner)) {
            return await sendEmbed(message, language.areYouOwner)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };

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