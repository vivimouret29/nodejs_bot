'use.strict'

module.exports = {
    data: {
        name: 'ping',
        description: 'a dynamic ping'
    },
    async execute(client, channel, message, userstate) {
        client.reply(channel, 'pong', userstate.id)
            .catch(e => console.log(e));
    }
};