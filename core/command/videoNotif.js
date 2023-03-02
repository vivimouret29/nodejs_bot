'use.strict'

const { MobBot } = require('../mobbot.js'),
    mobbot = new MobBot();

module.exports = {
    data: {
        name: 'videonotif',
        description: 'a dynamic video notification'
    },
    execute(message, client, language, gD, axios) {
        mobbot.onVideoPublish(message, client, language);
    }
};