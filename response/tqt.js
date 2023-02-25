'use.strict'

module.exports = {
    data: {
        name: 'tqt',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) { await message.channel.send(language.replyWorried); }
};