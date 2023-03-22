'use.strict'

const { getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'a dynamic ping',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        var wait = await message
            .reply(language.pingWait)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error send command ping ${err}`); });

        wait.edit(`Bip. ${language.pingEdit} ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error edit command ping ${err}`); });
    }
};