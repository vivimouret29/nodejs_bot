'use.strict'

const package = require("../package.json"),
    owner = require("../config_daftbot.json");

module.exports = {
    version: {
        name: 'version',
        description: 'a dynamic view version',
        execute(message) {
            message.channel.send(`daftbot ${package.version}`);
        }
    },
    say: {
        name: 'say',
        description: 'a dynamic tchat',
        args: true,
        execute(message, args) {
            var sayMessage = args.join(" ");
            message.delete().catch(O_o => { })
            message.channel.send(sayMessage);
        }
    },
    prune: {
        name: 'prune',
        description: 'a dynamic prune',
        args: true,
        execute(message, args) {
            if (message.author.id === owner) return message.channel.send(args.languageChoosen.restricted); // TODO: check this out

            var amount = parseInt(args.args[0]);
            if (isNaN(amount)) {
                message.reply(args.languageChoosen.pruneInvalid);
            } else if (amount > 0 && amount < 101) {
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    message.channel.send(args.languageChoosen.pruneError);
                });
            } else {
                message.reply(args.languageChoosen.pruneOut);
            };
        }
    },
    ping: {
        name: 'ping',
        description: 'a dynamic ping',
        async execute(message, args) {
            const wait = await message.channel.send(args.languageChoosen.pingWait);
            wait.edit(`Bip. ${args.languageChoosen.pingEdit} ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`);
        }
    }
};
