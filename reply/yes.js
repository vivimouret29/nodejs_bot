module.exports = {
    name: 'yes',
    description: 'a dynamic reply',
    execute(message, Discord) {
        const yesgif = new Discord.MessageEmbed()
            .setTitle('YES YES YES YES YES')
            .attachFiles(['./images/YESYESYESYESYES.gif']);

        message.channel.send(yesgif)
    }
};