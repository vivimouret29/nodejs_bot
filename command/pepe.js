'use.strict'

const fs = require('node:fs'),
    axios = require('axios'),
    { clientId, identity } = require('../core/config.json'),
    { sendEmbed, messageErase, randomColor, getCurrentDatetime, randomIntFromInterval } = require('../core/utils.js');

var duration_average = randomIntFromInterval(0, 100);

module.exports = {
    data: {
        name: 'pepe',
        description: 'a dynamic pepe',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        if (args.length == 0) { return await sendEmbed(message, language.argsUndefined); };

        let msg = await message.channel
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

        await messageErase(msg);
        fs.writeFileSync(`./styles/ai/pepe-diffuser.jpg`, buffer);
        await message
            .reply({
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
};