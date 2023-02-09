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
        execute(message, args, language) {
            sendEmbed(message, language.invitMsg, true);
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
            var sayMessage = args.join(' ');

            message.delete().catch(O_o => { });
            message.channel.send(sayMessage);
        }
    },
    prune: {
        name: 'prune',
        description: 'a dynamic prune',
        args: true,
        execute(message, args, language) {
            if (!(message.author.id == owner)) return sendEmbed(message, language.restricted);

            var amount = parseInt(args[0]);

            if (isNaN(amount)) {
                sendEmbed(message, language.pruneInvalid);
            } else if (amount > 0 && amount < 101) {
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    sendEmbed(message, language.pruneError);
                });
            } else {
                sendEmbed(message, language.pruneOut);
            };
        }
    },
    ping: {
        name: 'ping',
        description: 'a dynamic ping',
        async execute(message, args, language) {
            var wait = await message.channel.send(language.pingWait);
            wait.edit(`Bip. ${language.pingEdit} ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`);
        }
    },
    imagine: {
        name: 'imagine',
        description: 'a dynamic pepe',
        args: true,
        async execute(message, args, language) {
            if (args.length == 0) { return sendEmbed(message, language.argsUndefined); };

            var msg = await message.channel.send({
                'channel_id': message.channel.channel_id,
                'content': `${args.join(' ')}, *Waiting to display...*`
            });

            const response = await fetch('https://dipl0-dipl0-pepe-diffuser.hf.space/run/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [
                        args.join(' ')
                    ]
                })
            });
            
            if (response.status != 200) {
                console.log(`[ERROR] ${message.guild.name} / ${message.channel.name} # ${message.author.username} : ${message.content.toLowerCase()} // ${response.status} ${response.statusText}`);
                sendEmbed(message, `${response.status} : ${language.imagineError}`);
                return;
            };

            const data = await response.json(),
                splitted = data.data[0].split(',')[1],
                buffer = Buffer.from(splitted, 'base64');
            let saveDiffuser = false;

            if (message.author.id == owner) { saveDiffuser = true; };

            fs.writeFileSync(`./styles/ai/${saveDiffuser ? args.join('') : 'pepe-diffuser'}.jpg`, buffer);
            msg.edit({
                'channel_id': message.channel.channel_id,
                'content': '',
                'tts': false,
                'embeds': [{
                    'type': 'rich',
                    'title': 'Imagine',
                    'description': `**${args.join(' ')}**\nDuration : ${data.duration} seconds\nAverage duration : ${data.average_duration} seconds\n\n[**Pepe Diffuser**](https://huggingface.co/Dipl0/pepe-diffuser)`,
                    'color': randomColor(),
                    'author': {
                        'name': message.author.username,
                        'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                    },
                    'footer': {
                        'text': args.join(' '),
                        'icon_url': 'https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/1611668769240-noauth.png?w=200&h=200&f=face',
                        'proxy_icon_url': 'https://huggingface.co/Dipl0/pepe-diffuser'
                    }
                }],
                files: [
                    `./styles/ai/${saveDiffuser ? args.join('') : 'pepe-diffuser'}.jpg`
                ]
            });
        }
    }
};