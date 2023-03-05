'use.strict'

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invit')
        .setDescription('Te fournit un lien direct pour inviter tes amis sur le serveur de daftmob'),
    async execute(message, client, language, initDateTime) {
        await message.reply({ 'content': `${language.invitMsg}`, 'ephemere': true });
    }
};