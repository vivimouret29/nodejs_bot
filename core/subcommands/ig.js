'use.strict'

module.exports = {
    data: {
        name: 'ig',
        description: 'a dynamic instant-gaming link'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost) {
            client.say(channel, `daft est maintenant affilié à instant-gaming ! profites des promotions exceptionnelles de Terry en utilisant ce lien https://www.instant-gaming.com/?igr=daftmob daftmo1Gotanitem`)
                .catch(e => console.log(e));
    }
};