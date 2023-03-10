'use.strict'

const { } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'roll',
        description: 'a dynamic roll',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {

        var fi_line = `sword sword sword result`,
            se_line = `sword sword sword result`,
            th_line = `sword sword sword result`,
            fo_line = `sword sword sword result`,
            ff_line = `sword sword sword result`

        var msg = message.channel.send(
            fi_line + '\n' +
            se_line + '\n' +
            th_line + '\n' +
            fo_line + '\n' +
            ff_line);

            
    }
};