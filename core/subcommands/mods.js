'use.strict'

module.exports = {
    data: {
        name: 'ping',
        description: 'a dynamic ping'
    },
    async execute(client, channel, message, userstate) {
        client
            .reply(channel,
                'ptit lien des mods de stalker gamma : https://github.com/Grokitach/Stalker_GAMMA/blob/main/G.A.M.M.A/modpack_data/modlist.txt',
                userstate.id)
            .catch(e => console.log(e));
    }
};