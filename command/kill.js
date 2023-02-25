'use.strict'

const { owner } = require('../config.json'),
    { sendEmbed } = require('../core/function.js');

module.exports = {
    data: {
        name: 'kill',
        description: 'a dynamic kill'
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id === owner)) return await sendEmbed(message, language.areYouOwner);

        await await sendEmbed(message, language.killBot);
        new Promise(resolve => setTimeout(resolve, 3 * 1000));
        client.destroy();
    }
};