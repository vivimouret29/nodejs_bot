'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { randomColor } = require('../function.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild')
        .setDescription('Liste les serveurs où daftbot règne'),
    async execute(message, client, language, initDateTime) {
        await message.reply({
            'content': '',
            'tts': false,
            'embeds': [{
                'type': 'rich',
                'title': `Guild`,
                'description': `${client.user.username} ${language.guild}\n${client.guilds.cache.map(guild => guild.name).join('\n ')}`,
                'color': randomColor(),
                'author': {
                    'name': message.user.username,
                    'icon_url': message.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                },
                'footer': {
                    'text': '/guild',
                    'icon_url': 'https://cdn.discordapp.com/app-icons/757955750164430980/94a997258883caba5f553f98aea8df59.png?size=256',
                    'proxy_icon_url': 'https://discord.gg/ucwnMKKxZe'
                }
            }],
            'ephemeral': true
        });
    }
};