'use.strict'

module.exports = {
    data: {
        name: 'hahaha',
        description: 'a dynamic reply'
    },
    async execute(message, args, language) { await message.channel.send(language.replyAgg); }
};