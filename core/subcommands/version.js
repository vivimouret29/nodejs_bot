'use.strict'

const package = require('../package.json');

module.exports = {
    data: {
        name: 'version',
        description: 'a dynamic version'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client.reply(channel, `mobbot\'s version : ${package.version}`, userstate.id)
            .catch(e => console.log(e));
    }
};