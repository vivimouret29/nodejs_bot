'use.strict'

const package = require("../package.json"),
    { owner } = require("../config.json"),
    { sendEmbed } = require('../embed.js');

module.exports = {
    invit: {
        name: 'invit',
        description: 'a dynamic invit',
        args: true,
        execute(message, args) {
            sendEmbed(message, args.language.invitMsg, true);
        }
    },
    version: {
        name: 'version',
        description: 'a dynamic view version',
        execute(message) {
            sendEmbed(message, `daftbot ${package.version}`);
        }
    },
    say: {
        name: 'say',
        description: 'a dynamic tchat',
        args: true,
        execute(message, args) {
            var sayMessage = args.args.join(' ');

            message.delete().catch(O_o => { });
            message.channel.send(sayMessage);
        }
    },
    prune: {
        name: 'prune',
        description: 'a dynamic prune',
        args: true,
        execute(message, args) {
            if (!(message.author.id == owner)) return sendEmbed(message, args.language.restricted);

            var amount = parseInt(args.args[0]);

            if (isNaN(amount)) {
                sendEmbed(message, args.language.pruneInvalid);
            } else if (amount > 0 && amount < 101) {
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    sendEmbed(message, args.language.pruneError);
                });
            } else {
                sendEmbed(message, args.language.pruneOut);
            };
        }
    },
    ping: {
        name: 'ping',
        description: 'a dynamic ping',
        async execute(message, args) {
            var wait = await message.channel.send(args.language.pingWait);
            wait.edit(`Bip. ${args.language.pingEdit} ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`);
        }
    }
};
