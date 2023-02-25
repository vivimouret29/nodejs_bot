'use.strict'

const { getCurrentDatetime } = require('../core/function.js');

module.exports = {
    data: {
        name: 'say',
        description: 'a dynamic tchat',
        args: true
    },
    execute(message, client, language, args, initDateTime) {
        var say = args.join(' ');

        message.delete().catch(O_o => { });
        message.channel
            .send(say)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command say ${err}`); });
    }
};