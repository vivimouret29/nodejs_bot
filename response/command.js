'use.strict'

var packageVersion = require("../package.json");

module.exports = {
    version: {
        name: 'version',
        description: 'a dynamic view version',
        execute(message) {
            message.delete().catch(O_o => { });
            message.channel.send(`daftbot ${packageVersion.version}`);
        }
    },
    say: {
        name: 'say',
        description: 'a dynamic tchat',
        args: true,
        execute(message, args) {
            var sayMessage = args.join(" ");
            message.delete().catch(O_o => { });
            message.channel.send(sayMessage);
        }
    },
    prune: {
        name: 'prune',
        description: 'a dynamic prune',
        args: true,
        execute(message, args) {
            if (message.author.id === '431915542610313217') {
                var amount = parseInt(args[0]);
                if (isNaN(amount)) {
                    message.reply('Pas un nombre valide ça frère');
                } else if (amount > 0 & amount < 101) {
                    message.reply('Donnes moi un nombre entre 1 et 100');
                };
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    message.channel.send('Petit problème sur le channel, rien n\'est partie..');
                });
            } else {
                message.channel.send(`Trop de lignes ${message.author.toString()}`);
            };
        }
    },
    ping: {
        name: 'ping',
        description: 'a dynamic ping',
        async execute(message) {
            message.delete().catch(O_o => { })
            const wait = await message.channel.send("AAAAAAAATTTEEEEEEENNNNNNNNNNNNNDDDDDDDDDSSSSSSSSSSSSS!!!!");
            wait.edit(`Bip. Latence de ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`);
        }
    }
};
