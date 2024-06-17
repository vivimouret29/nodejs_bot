'use.strict'

module.exports = {
    data: {
        name: 'discord',
        description: 'a dynamic discord'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client
            .reply(channel,
                'Cliques sur le lien suivant pour sortir de la bordure et rejoindre le serveur du daft : https://discord.gg/8qMFZC4djd',
                userstate.id)
            .catch(e => console.log(e));
    }
};