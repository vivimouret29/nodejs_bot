'use.strict'

const { MobBot } = require('../mobbot.js'),
    mobbot = new MobBot();

module.exports = {
    data: {
        name: 'livenotif',
        description: 'a dynamic live notification'
    },
    execute(message, client, language, gD, axios) {
        mobbot.onLive(message, client, language, gD, axios);
    }
};