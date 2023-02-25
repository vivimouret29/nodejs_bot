'use.strict'

module.exports = {
    data: {
        name: 'mais',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) { await message.channel.send(language.replyMais); }
};