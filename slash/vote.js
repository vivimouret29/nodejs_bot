'use.strict'

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Voter sur Top.gg pour daftbot'),
    async execute(message, client, language, args, user, initDateTime) {
        await message.reply({ 'content': `${language.vote}\nhttps://top.gg/bot/757955750164430980/vote`, 'ephemeral': true })
            .catch(err => {
                message.reply({ 'content': language.error, 'ephemeral': true });
                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
            });
    }
};