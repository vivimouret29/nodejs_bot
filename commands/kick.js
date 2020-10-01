module.exports = {
    name: 'kick',
    description: 'a dynamic kick member (but not really actually).',
    args: true,
    async execute(message, args, member) {
        const {
            Discord,
            GuildChannel
        } = require('discord.js');

        const tkick = new Discord.MessageEmbed()
            .setTitle('bye bye')
            .attachFiles(['./images/bob.gif'])

        if (!message.mentions.users.size) {
            return message.reply('tag une personne aléatoirement ehe');
        }

        message.delete().catch(O_o => { })
        message.channel.send(`eh ${args}, une surprise t'attend...`);
        member.author.username.createDM().then(channel => {       // .kick()
            channel.send(`au final c'est toi qui est exclue hahaha`);
            channel.send(`${tkick}`);
            channel.createInvite({
                unique: true,
                temporary: false
            })
                .catch(console.error);
        })
            .catch(console.error);
    },
};