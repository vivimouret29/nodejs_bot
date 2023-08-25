'use.strict'

module.exports = {
    data: {
        name: 'uptime',
        description: 'a dynamic uptime'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client.reply(channel, `le stream est en live depuis ${timestamp}`, userstate.id)
            .catch(e => console.log(e));
    }
};