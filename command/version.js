'use.strict'

const { sendEmbed } = require('../core/function.js'),
    package = require('../package.json');

module.exports = {
    data: {
        name: 'version',
        description: 'a dynamic view version'
    },
    async execute(message, client, language, args, initDateTime) {
        await sendEmbed(message, `daftbot ${package.version}`);
    }
};