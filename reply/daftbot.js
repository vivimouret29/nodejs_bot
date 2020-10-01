module.exports = {
    name: 'daftbot',
    description: 'a dynamic reply',
    execute(message, Discord) {
        const botgif = new Discord.MessageEmbed()
            .setTitle('je suis un petit être dans une fiole')
            .attachFiles(['./images/homonculus.gif']);
            
        message.channel.send(botgif)
    }
};