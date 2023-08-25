'use.strict'

const fs = require('fs'),
    path = require('path');

module.exports = {
    data: {
        name: 'command',
        description: 'a dynamic command'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        let commandsPath = path.join(__dirname, '../subcommands'),
            commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')),
            commands = []

        for (let file of commandFiles) { commands.push(file.split('.')[0]) };

        client.reply(channel, `toutes les commandes : !${commands.join(', !')} !`, userstate.id)
            .catch(e => console.log(e));
    }
};