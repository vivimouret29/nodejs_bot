'use.strict'

const package = require("../package.json"),
    { owner } = require("../config.json"),
	fetch = require('node-fetch'),
	fs = require('fs'),
    { sendEmbed, randomColor } = require('../embed.js');

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
    },
    imagine: {
        name: 'imagine',
        description: 'a dynamic pepe',
        args: true,
        async execute(message, args) {
            if (args.args.length == 0) { return sendEmbed(message, args.language.argsUndefined); };

            var msg = await message.channel.send({
                'channel_id': message.channel.channel_id,
                'content': `${args.args.join(' ')}, *Waiting to display...*`
            });
        
            const response = await fetch('https://dipl0-dipl0-pepe-diffuser.hf.space/run/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [
                        args.args.join(' ')
                    ]
                })
            });
        
            const data = await response.json(),
                splitted = data.data[0].split(',')[1],
                buffer = Buffer.from(splitted, 'base64');
            let saveDiffuser = false;
        
            if (message.author.id == owner) { saveDiffuser = true; };
        
            fs.writeFileSync(`./styles/ai/${saveDiffuser ? args.args.join('') : 'pepe-diffuser'}.jpg`, buffer);
            msg.edit({
                'channel_id': message.channel.channel_id,
                'content': '',
                'tts': false,
                'embeds': [{
                    'type': 'rich',
                    'title': 'Imagine',
                    'description': `**${args.args.join(' ')}**\nDuration : ${data.duration} seconds\nAverage duration : ${data.average_duration} seconds\n\n[**Pepe Diffuser**](https://huggingface.co/Dipl0/pepe-diffuser)`,
                    'color': randomColor(),
                    'author': {
                        'name': message.author.username,
                        'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                    },
                    'footer': {
                        'text': args.args.join(' '),
                        'icon_url': 'https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/1611668769240-noauth.png?w=200&h=200&f=face',
                        'proxy_icon_url': 'https://huggingface.co/Dipl0/pepe-diffuser'
                    }
                }],
                files: [
                    `./styles/ai/${saveDiffuser ? args.args.join('') : 'pepe-diffuser'}.jpg`
                ]
            });
        }
    }
};
