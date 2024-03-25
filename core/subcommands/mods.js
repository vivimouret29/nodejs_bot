'use.strict'

module.exports = {
    data: {
        name: 'mods',
        description: 'a dynamic mods list'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        client
            .reply(channel,
                'ptite liste des mods de valheim : https://docs.google.com/spreadsheets/d/1xs6wocOW_jJBU4ork9Y5Z6XmIV03uiGTYBCbU6r_ODo/edit?usp=sharing daftmo1Whaaa',
                userstate.id)
            .catch(e => console.log(e));
    }
};