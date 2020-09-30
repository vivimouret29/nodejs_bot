module.exports = {
    name: 'version',
    description: 'a dynamic view version',
    execute(message) {
        const Discord = require('discord.js');
        const client = new Discord.Client();
        const packageVersion = require("../package.json");

        message.delete().catch(O_o => { })
        message.channel.send(`daftbot ${packageVersion.version}`)
    }
};