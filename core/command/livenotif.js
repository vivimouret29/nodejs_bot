'use.strict'

const { MobBot } = require('../mobbot.js'),
    mobbot = new MobBot();

module.exports = {
    data: {
        name: 'livenotif',
        description: 'a dynamic live notification'
    },
    async execute(message, client, language, gD, axios) {
        await mobbot.onLive(message, client, language, gD, axios);
    }
};