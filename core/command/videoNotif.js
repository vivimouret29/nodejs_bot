'use.strict'

const { MobBot } = require('../mobbot.js'),
    mobbot = new MobBot();

module.exports = {
    data: {
        name: 'videonotif',
        description: 'a dynamic video notification'
    },
    async execute(message, client, language, gD, axios) {
        await mobbot.onVideoPublish(message, client, language);
    }
};