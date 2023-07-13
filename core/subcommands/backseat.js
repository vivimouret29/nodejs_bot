'use.strict'

module.exports = {
    data: {
        name: 'backseat',
        description: 'a dynamic backseat'
    },
    async execute(client, channel, message, userstate) {
        client.reply(channel, 'pas de conseil si le daft n\'en demandes pas, sinon tu risques le ban', userstate.id)
            .catch(e => console.log(e));
    }
};