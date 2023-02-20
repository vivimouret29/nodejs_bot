'use.strict'

const package = require("../package.json"),
    { owner } = require("../config.json"),
    { clientId, identity } = require('../core/config.json'),
    fs = require('fs'),
    axios = require('axios'),
    { sendEmbed, randomColor, getCurrentDatetime } = require('../core/function.js');

var duration_average = 0;

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
            message.channel
                .send(sayMessage)
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command say ${err}`); });
        }
    },
    purge: {
        name: 'purge',
        description: 'a dynamic purge',
        args: true,
        execute(message, args, language) {
            if (!(message.author.id == owner)) return sendEmbed(message, language.restricted);

            var amount = parseInt(args[0]);

            if (isNaN(amount)) {
                sendEmbed(message, language.pruneInvalid);
            } else if (amount > 0 && amount < 101) {
                message.channel
                    .bulkDelete(amount, true)
                    .catch(err => {
                        console.error(err);
                        sendEmbed(message, language.pruneError);
                    });
            } else { sendEmbed(message, language.pruneOut); };
        }
    },
    ping: {
        name: 'ping',
        description: 'a dynamic ping',
        async execute(message, args, language) {
            var wait = await message.channel
                .send(language.pingWait)
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error send command ping ${err}`); });

            wait.edit(`Bip. ${language.pingEdit} ${wait.createdTimestamp - message.createdTimestamp}ms.. Bip Boup..`)
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error edit command ping ${err}`); });
        }
    },
    imagine: {
        name: 'pepe',
        description: 'a dynamic pepe',
        args: true,
        async execute(message, args, language) {
            if (args.length == 0) { return sendEmbed(message, language.argsUndefined); };

            var msg = await message.channel
                .send({
                    'channel_id': message.channel.channel_id,
                    'content': `pepe ${args.join(' ')} / *Waiting to display...*\n${language.timeAverage}${duration_average} seconds`
                })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });

            const urI = `https://vivsmouret-dipl0-pepe-diffuser-bot.hf.space/run/predict`,
                headers = {
                    'Content-Type': 'application/json',
                    'Connection': 'Keep-Alive'
                },
                dt = JSON.stringify({
                    data: [
                        'pepe ' + args.join(' ').toLowerCase()
                    ]
                });

            let response = { status: 100 },
                countResponse = -1,
                link = '';

            while (response.status != 200) {
                countResponse++;
                response = await axios
                    .post(urI, dt, { headers: headers, timeout: 300000 }) // timeout not really working so infinite loop
                    .catch(error => { return response = error.response; });
            };

            const data = await response.data,
                splitted = data.data[0].split(',')[1],
                buffer = Buffer.from(splitted, 'base64');
            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Success after ${(60 * countResponse) + data.duration} seconds - ${message.author.username} diffuse \'pepe ${args.join(' ').toLowerCase()}\'`)

            var fetchPdp = await axios.get('https://huggingface.co/Dipl0', {
                headers: {
                    Authorization: `Bearer ${identity.password}`,
                    'Client-ID': clientId
                }
            });

            try {
                link = fetchPdp.data.split(new RegExp(`(s\/[^.]..........................................)`, 'giu'))[3];
                link.endsWith('?') ? link = link.slice(2, -1) : link = link.split('s/')[1]
            } catch (err) {
                console.log(`[${getCurrentDatetime('comm')}] Can't get guid : `, err);
            };

            fs.writeFileSync(`./styles/ai/pepe-diffuser.jpg`, buffer);
            msg.edit({
                'channel_id': message.channel.channel_id,
                'content': `<@${message.author.id}>`,
                'tts': false,
                'embeds': [{
                    'type': 'rich',
                    'title': 'Pepe',
                    'description': `**${args.join(' ')}**\n${language.timeDiffuse}${(60 * countResponse) + data.duration} seconds
${language.timeAverage}${data.average_duration} seconds\n\n[**Pepe Diffuser**](https://huggingface.co/Dipl0/pepe-diffuser)`,
                    'color': randomColor(),
                    'author': {
                        'name': message.author.username,
                        'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                    },
                    'thumbnail': {
                        'url': `https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/${link}?w=200&h=200&f=face`,
                        'proxy_url': 'https://huggingface.co/Dipl0/pepe-diffuser'
                    }
                }],
                'files': [`./styles/ai/pepe-diffuser.jpg`]
            })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe edit ${err}`); });

            duration_average = data.average_duration;
        }
    }
};