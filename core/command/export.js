'use.strict'

const { MobBot } = require('../mobbot.js'),
    mobbot = new MobBot();

module.exports = {
    data: {
        name: 'export',
        description: 'a dynamic export of mobbot dataset'
    },
    async execute(message, client, language, gD, axios) {
        await mobbot.onDataExport(message, client);
    }
};