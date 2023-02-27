'use.strict'

const { Client } = require('tmi.js'),
    { ActivityType } = require('discord.js'),
    { parse } = require('json2csv'),
    fs = require('node:fs'),
    { clientId, identity, channels } = require('./config.json'),
    { getCurrentDatetime } = require('./function.js');

const oauth = {
    options: {
        debug: true,
        clientId: clientId
    },
    identity: identity,
    channels: channels,
    connection: { reconnect: true }
};

var dataToExport = [];

class MobBot {
    constructor() {
        this.mbClient = new Client(oauth);
    };

    on() {
        this.mbClient.on('connected', this.onConnectedHandler);
        this.mbClient.connect();
    };

    data() {
        this.mbClient
            .on('message', (channel, tags, message, self) => {
                if (self || tags['username'] === 'moobot') return;

                let data = {
                    'id': Number(tags['user-id']),
                    'date': getCurrentDatetime('date'),
                    'badges': tags['badges'],
                    'color': String(tags['color']),
                    'username': String(tags['username']),
                    'message': String(message),
                    'emotes': tags['emotes-raw'] == null ? null : String(tags['emotes-raw']),
                    'turbo': Boolean(tags['turbo'])
                };

                return dataToExport.push(data);
            });
    };

    export(message, client) {
        if (dataToExport.length === 0) {
            let emoji = client.emojis.cache.find(emoji => emoji.name === 'sadpepe');
            message
                .react(emoji)
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error react ${err}`); });
            return;
        };

        fs.writeFile(`./core/data/mobbot_analytics.csv`, parse(dataToExport), function (err) {
            if (err) {
                let emoji = client.emojis.cache.find(emoji => emoji.name === 'fufufu');
                message
                    .react(emoji)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error react ${err}`); });
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username} : ${message.content.toLowerCase()} ${err}`);
                throw err;
            } else {
                let emoji = client.emojis.cache.find(emoji => emoji.name === 'linkbadass');
                message
                    .react(emoji)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error react ${err}`); });
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username} : ${message.content.toLowerCase()}`);
            };
        });

        message.author
            .send({ 'content': 'csv being transferred' })
            .then((msg) => { msg.edit({ 'content': 'csv transferred', 'files': ['./core/data/mobbot_analytics.csv'] }); })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error during file send ${err}`); });
    };

    liveNotif(message, client, language, gD, axios) {
        let guidDot = gD,
            channelTwitch = ['twitch', '🎦-fox-stream-🎦'],
            guid = '',
            dot = '';

        try {
            guid = guidDot.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
            guid = guid.split('s/')[1].split('-p')[0];

            dot = guidDot.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
            dot = dot.split('.')[1].split(' ')[0];
        } catch (err) {
            console.log(`[${getCurrentDatetime('comm')}] Can't get guid and dot : `, err);
        };

        for (let chan in channelTwitch) {
            var channelSend = client.channels.cache.find(channel => channel.name == channelTwitch[chan]);
            if (channelSend.id == undefined) break;

            client.channels.cache
                .get(channelSend.id)
                .send({
                    'channel_id': channelSend.id,
                    'content': channelTwitch[chan] == 'twitch' ? '<@&1071048787738497084>' : '',
                    'tts': false,
                    'embeds': [{
                        'type': 'rich',
                        'title': `Live de ${axios.data.data[0].user_name}`,
                        'description': `${language.descLiveSt} ${axios.data.data[0].user_name} ${language.descLiveNd}`,
                        'color': 0x4d04bb,
                        'fields': [{
                            'name': axios.data.data[0].game_name,
                            'value': axios.data.data[0].title
                        }],
                        'image': {
                            'url': `https://static-cdn.jtvnw.net/previews-ttv/live_user_${axios.data.data[0].user_login}-360x220.jpg`,
                            'proxy_url': `https://twitch.tv/${axios.data.data[0].user_login}`
                        },
                        'thumbnail': {
                            'url': `https://static-cdn.jtvnw.net/jtv_user_pictures/${guid}-profile_image-300x300.${dot}`,
                            'proxy_url': `https://twitch.tv/${axios.data.data[0].user_login}`
                        },
                        'author': {
                            'name': oauth.identity.username,
                            'url': `https://twitch.tv/${axios.data.data[0].user_login}`,
                            'icon_url': client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                        },
                        'footer': {
                            'text': `Viewers : ${axios.data.data[0].viewer_count}`,
                            'icon_url': `https://cdn-icons-png.flaticon.com/512/4299/4299106.png`,
                            'proxy_icon_url': `https://twitch.tv/${axios.data.data[0].user_login}`
                        },
                        'url': `https://twitch.tv/${axios.data.data[0].user_login}`
                    }]
                })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error livenotif ${err}`); });
        };

        client.user.setPresence({
            activities: [{
                name: language.stream,
                type: ActivityType.Streaming,
                url: 'https://twitch.tv/daftmob'
            }],
            status: 'online'
        });

        console.log(`[${getCurrentDatetime('comm')}] ${channelTwitch}`);
    };

    onConnectedHandler(addr, port) { console.log(`* Connected to ${addr}:${port} *`); };
};

exports.MobBot = MobBot;