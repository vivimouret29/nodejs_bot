module.exports = {
    name: 'ping',
    description: 'a dynamic ping',
    async execute(message) {
        const Discord = require('discord.js');
        const client = new Discord.Client();

        message.delete().catch(O_o => { })
        const wait = await message.channel.send("AAAAAAAATTTEEEEEEENNNNNNNNNNNNNDDDDDDDDDSSSSSSSSSSSSS!!!!")
        wait.edit(`eeeh.. la latence est d'${wait.createdTimestamp - message.createdTimestamp}ms.. hhh.. et celle de l'api est d'${Math.round(client.ws.ping)}ms.. aaarggh....`)
        message.reply('stp.. plus jamais putain...')
    }
}