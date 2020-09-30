module.exports = {
    name: 'status',
    description: 'a dynamic status',
    execute(message, args) {
        const Discord = require('discord.js');
        const client = new Discord.Client();

        message.delete().catch(O_o => { })
        client.user.setPresence({
            game: {
                name: 'some youtube videos',
                type: 'WATCHING',
                url: ''
            },
            status: ''
                .then(presence => console.log(`[${replydate}] REPLY ${client.user.username} go to ${presence.activities[0].name} (${args}), FROM ${autmsg}`))
                .catch(
                    console.error,
                    message.channel.send('')
                )
        })
        message.channel.send('')
    }
};