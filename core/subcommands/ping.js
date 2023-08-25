'use.strict'

module.exports = {
    data: {
        name: 'ping',
        description: 'a dynamic ping'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client.reply(channel, 'pong', userstate.id)
            .catch(e => console.log(e));
    }
};