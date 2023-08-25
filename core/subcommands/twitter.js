'use.strict'

module.exports = {
    data: {
        name: 'twitter',
        description: 'a dynamic twitter'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client.reply(channel, 'le profil vide du daft sur twitter : https://twitter.com/daftm0b', userstate.id)
            .catch(e => console.log(e));
    }
};