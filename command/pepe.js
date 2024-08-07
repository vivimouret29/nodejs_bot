'use.strict'

const dynamic = new Function('modulePath', 'return import(modulePath)'),
    axios = require('axios'),
    { clientId, identity } = require('../core/config.json'),
    { huggingface } = require('../config.json'),
    { sendEmbed, messageErase, randomColor, getCurrentDatetime, randomIntFromInterval, downloadImagesFromUrl } = require('../core/utils.js');

let duration_average = randomIntFromInterval(4, 140),
    totalDuration = 0,
    executionCount = 0;

module.exports = {
    data: {
        name: 'pepe',
        description: 'a dynamic pepe',
        args: true
    },
    async execute(message, client_, language, user, args, initDateTime) {
        const { client } = await dynamic('@gradio/client');

        if (args.length == 0) { return await sendEmbed(message, language.argsUndefined); };

        let msg = await message.channel
            .send({
                'channel_id': message.channel.channel_id,
                'content': `pepe ${args.join(' ')} / *Waiting to display...*\n${language.timeAverage}${duration_average}s`
            })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });

        let app = await client('vivsmouret/pepe-diffuser'),
            response,
            startTime = Date.now();

        try {
            response = await app.predict('/predict', [
                'pepe ' + args.join(' ').toLowerCase(),
            ]);
        } catch (err) {
            console.log(`[${getCurrentDatetime('comm')}] Error command pepe predict ${err}`);
            return msg.edit({
                'channel_id': message.channel.channel_id,
                'content': language.imagineError,
                'fetchReply': false,
                'ephemeral': false
            })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });
        };

        let endTime = Date.now(),
            duration = (endTime - startTime) / 1000;

        totalDuration += duration;
        executionCount += 1;
        duration_average = totalDuration / executionCount;

        if (response == undefined) {
            return msg.edit({
                'channel_id': message.channel.channel_id,
                'content': language.imagineError,
                'fetchReply': false,
                'ephemeral': false
            })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe predict ${err}`); });
        };

        downloadImagesFromUrl(response.data[0].url, `./styles/ai/pepe-diffuser.jpg`, function () {
            console.log(`[${getCurrentDatetime('comm')}] Image successfully downloaded from HuggingFace`);
        });

        try {
            if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${message.author.username}'s DM # Success after ${duration} seconds - ${message.author.username} diffuse \'pepe ${args.join(' ').toLowerCase()}\'`); }
            else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Success after ${duration} seconds - ${message.author.username} diffuse \'pepe ${args.join(' ').toLowerCase()}\'`); };
        } catch (err) { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); };

        var fetchPdp = await axios.get('https://huggingface.co/Dipl0', {
            headers: {
                Authorization: `Bearer ${identity.password}`,
                'Client-ID': clientId
            }
        });
        console.log(`[${getCurrentDatetime('comm')}] FETCH HUGGINGFACE PEPE ${fetchPdp.statusText}`);

        link = fetchPdp.data.split(new RegExp(`(s\/[^.]..........................................)`, 'giu'))[3];
        link = link.split('s/')[1];
        link = link.slice(0, -7);
        console.log(`[${getCurrentDatetime('comm')}] LINK HUGGINGFACE ${link}`);

        await messageErase(msg);
        await message
            .reply({
                'channel_id': message.channel.channel_id,
                'content': `<@${message.author.id}>`,
                'tts': false,
                'embeds': [{
                    'type': 'rich',
                    'title': 'Pepe',
                    'description': `**${args.join(' ')}**\n${language.timeDiffuse}${duration}s
${language.timeAverage}${duration_average}s\n\n[**Pepe Diffuser**](https://huggingface.co/Dipl0/pepe-diffuser)`,
                    'color': randomColor(),
                    'image': { 'url': response.data[0].url },
                    'author': {
                        'name': message.author.username,
                        'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                    },
                    'thumbnail': {
                        'url': `https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/${link}?w=128&h=128&f=face`,
                        'proxy_url': 'https://huggingface.co/Dipl0/pepe-diffuser'
                    }
                }]
            })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe edit ${err}`); });
    }
};