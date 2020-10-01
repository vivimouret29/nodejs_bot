module.exports = {
    name: 'prune',
    description: 'a dynamic prune',
    execute(message, args) {
        if (message.author.id === '431915542610313217') {
            const amount = parseInt(args[0])
            
            if (isNaN(amount)) {
                return message.reply('pas un nombre valide ça frère');
            } else if (amount < 2 || amount > 100) {
                return message.reply('donnes moi un nombre entre 1 et 100');
            }
            message.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                message.channel.send('petit problème sur le channel, rien n\'est partie..');
            });
        } else {
            return message.channel.send(`out of sight ${message.author.toString()}`);
        }
    },
};