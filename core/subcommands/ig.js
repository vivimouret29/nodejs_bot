'use.strict'

module.exports = {
    data: {
        name: 'ig',
        description: 'a dynamic instant-gaming link'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client.say(channel, `daft est maintenant affilié à instant-gaming, 
        profites des promotions exceptionnelles de Terry en passant par ce lien https://www.instant-gaming.com/?igr=daftmob daftmo1Gotanitem 
        et tentes de gagner des jeux gratuits en participant aux giveaway avec mon lien https://www.instant-gaming.com/fr/giveaway/instantgaming?igr=daftmob daftmo1Diosama`)
            .catch(e => console.log(e));
    }
};