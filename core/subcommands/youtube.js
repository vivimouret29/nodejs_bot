'use.strict'

module.exports = {
    data: {
        name: 'youtube',
        description: 'a dynamic youtube'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client.reply(channel, `voici un ptit lien vers le youtube game https://www.youtube.com/watch?v=${urI}`, userstate.id)
            .catch(e => console.log(e));
    }
};