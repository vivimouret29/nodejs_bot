'use.strict'

const { owner } = require('../config.json'),
    { sendEmbed, messageErase } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'purge',
        description: 'a dynamic purge',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id == owner)) {
            return await sendEmbed(message, language.restricted)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };

        var amount = parseInt(args[0]);

        if (isNaN(amount)) {
            await sendEmbed(message, language.pruneInvalid)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        } else if (amount == 1) {
            await messageErase(message)
        } else if (amount > 1 && amount < 101) {
            await message.channel
                .bulkDelete(amount, true)
                .catch(err => {
                    console.error(err);
                    sendEmbed(message, language.pruneError)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': true });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                });
        } else {
            await sendEmbed(message, language.pruneOut)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };
    }
};