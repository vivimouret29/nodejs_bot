'use.strict'


const fs = require('node:fs'),
    axios = require('axios'),
    { clientId, identity } = require('../core/config.json'),
    { huggingface } = require('../config.json'),
    { sendEmbed, messageErase, randomColor, getCurrentDatetime, randomIntFromInterval } = require('../core/utils.js');

var duration_average = randomIntFromInterval(40, 140);

module.exports = {
    data: {
        name: 'pepe',
        description: 'a dynamic pepe',
        args: true
    },
    async execute(message, client_, language, user, args, initDateTime) {
        if (args.length == 0) { return await sendEmbed(message, language.argsUndefined); };

        let msg = await message.channel
            .send({
                'channel_id': message.channel.channel_id,
                'content': `pepe ${args.join(' ')} / *Waiting to display...*\n${language.timeAverage}${duration_average} seconds`
            })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });

        let response = { status: 100 },
            countResponse = -1,
            link = '';

        const urI = 'https://dipl0-dipl0-pepe-diffuser-bot.hf.space/run/predict',
            headers = {
                'Authorization': `Bearer ${huggingface}`,
                'Content-Type': 'application/json',
                'Connection': 'Keep-Alive'
            },
            dt = JSON.stringify({
                data: [
                    'pepe ' + args.join(' ').toLowerCase()
                ]
            });

        while (response.status != 200) {
            countResponse++;
            if (countResponse > 11) {
                msg.edit({
                    'channel_id': message.channel.channel_id,
                    'content': `${language.imagineError}`,
                    'fetchReply': false,
                    'ephemeral': false
                })
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });
                return;
            };

            response = await axios.post(urI, dt, { headers: headers })
                .catch(error => { return response = error.response; });

            if (response.status == 410) {
                msg.edit({
                    'channel_id': message.channel.channel_id,
                    'content': response.data,
                    'fetchReply': false,
                    'ephemeral': false
                })
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });
                return;
            };
        };

        const data = await response.data,
            splitted = data.data[0].split(',')[1],
            buffer = Buffer.from(splitted, 'base64');

        try {
            if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${message.author.username}'s DM # Success after ${(60 * countResponse) + data.duration} seconds - ${message.author.username} diffuse \'pepe ${args.join(' ').toLowerCase()}\'`); }
            else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Success after ${(60 * countResponse) + data.duration} seconds - ${message.author.username} diffuse \'pepe ${args.join(' ').toLowerCase()}\'`); };
        } catch (err) { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); };

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