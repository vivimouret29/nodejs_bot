'use.strict'

const { getCurrentDatetime, messageErase } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'say',
        description: 'a dynamic tchat',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        var say = args.join(' ');

        await messageErase(message);
        await message.channel
            .send(say)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command say ${err}`); });
    }
};