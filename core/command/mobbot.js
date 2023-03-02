'use.strict'

const { MobBot } = require('../mobbot.js'),
    mobbot = new MobBot();

module.exports = {
    data: {
        name: 'mobbotConnection',
        description: 'a dynamic tchat twitch bot'
    },
    async execute(message, client, language, gD, axios) {
        mobbot.onConnect();
    }
};