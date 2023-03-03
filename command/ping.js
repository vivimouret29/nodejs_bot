'use.strict'

const { getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'a dynamic ping'
    },
    async execute(message, client, language, args, initDateTime) {
        var wait = await message.channel
            .send(language.pingWait)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error send command ping ${err}`); });

        wait.edit(`Bip. ${language.pingEdit} ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error edit command ping ${err}`); });
    }
};