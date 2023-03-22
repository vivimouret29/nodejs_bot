'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { getCurrentDatetime, randomIntFromInterval } = require('../core/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pour connaître son ping'),
    async execute(message, client, language, user, initDateTime) {
        await message
            .reply({ 'content': language.pingWait, 'fetchReply': true, 'ephemeral': true })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error send command ping ${err}`); });

        await message.editReply({ 'content': `Bip. ${language.pingEdit} ${randomIntFromInterval(200, 399)}ms.. Bip Boup..`, 'fetchReply': false, 'ephemeral': true })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error edit command ping ${err}`); });
    }
};