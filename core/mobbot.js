'use.strict'

const { Client } = require('tmi.js'),
    axios = require('axios'),
    dynamic = new Function('modulePath', 'return import(modulePath)'),
    fs = require('node:fs'),
    moment = require('moment-timezone'),
    path = require('node:path'),
    util = require('util'),
    { ActivityType } = require('discord.js'),
    { clientId, identity, channels, x } = require('./config.json'),
    { parse } = require('json2csv'),
    { randomIntFromInterval, getCurrentDatetime, randomColor, downloadImagesFromUrl, threadPause } = require('./utils.js'),
    { users: regular_users } = require('../resx/regular_users.json'),
    { TwitterApi } = require('twitter-api-v2');

const oauth = {
    options: {
        debug: true,
        clientId: clientId
    },
    identity: identity,
    channels: channels,
    connection: {
        reconnect: true,
        secure: true,
    }
};
const params = {
    headers: {
        Authorization: `Bearer ${identity.password}`,
        'Client-ID': clientId
    }
};
const xApi = new TwitterApi({
    appKey: x.api_key,
    appSecret: x.api_secret,
    accessToken: x.atas,
    accessSecret: x.atas_secret,
    bearerToken: x.bearer
});
const rwClient = xApi.readWrite;

var dataToExport = [];

class MobBot {
    constructor() {
        this.mbClient = new Client(oauth);

        this.mbCommands = new Map();

        this.live = false | this.live;
        this._count = 0 | this._count;
        this._emote = true | this._emote;
        this.date;
    };

    async onConnect() {
        this.date = moment().tz('Europe/Paris').format();

        await this.setCollection();

        this.mbClient.on('connected', this.onConnectedHandler);

        await this.onDataImport();
        await this.onMessageListen();
        await this.onSubscription();
        await this.onGiftSubscription();
        await this.onReSubsciption();
        await this.onCheers();

        this.mbClient.on('connectFailed', function (error) {
            console.log('Connect Error ' + error.toString());
        });

        this.mbClient.on('connect', function (connection) {
            console.log('// WebSocket Client Connected \\\\');

            connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
            connection.sendUTF(`PASS oauth:${oauth.identity.password}`);
            connection.sendUTF(`NICK ${oauth.identity.username}_`);
            connection.sendUTF(`JOIN #${channels[0].slice(1)}`);
        });

        await this.mbClient.connect('ws://irc-ws.chat.twitch.tv:443').catch(console.error);

        let checkLive = true,
            gameMemory = '',
            oldGameMemory = '';

        while (true) {
            let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=` + channels[0].slice(1), params)
                .catch(err => {
                    checkLive = false;
                    console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`);
                });

            if (ax == undefined) { break; };

            if (!checkLive || ax.data.data.length == 0) {
                gameMemory = '';
                this.live = false;
                this._emote = false;
            } else {
                gameMemory = ax.data.data[0].game_name;
                this.live = true;
                this._emote = true;
                if (gameMemory != oldGameMemory && ax.data.data.length == 1) {
                    this.mbCommands
                        .get('timer')
                        .execute(this.mbClient,
                            channels[0],
                            undefined,
                            undefined,
                            await this.onLastVideo(),
                            await this.onTimeStamp(),
                            true,
                            false);
                };
            };

            checkLive = true;
            oldGameMemory = gameMemory;

            await this.onLiveSponsor();
            await threadPause(15, true); // 15 minutes
        };
    };

    async setCollection() {
        var commandCount = 0,
            commandName = [];
        const commandsPath = path.join(__dirname, './subcommands'),
            commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            var filePath = path.join(commandsPath, file),
                command = require(filePath);
                commandCount++;
                commandName.push(command.data.name);
            if ('data' in command && 'execute' in command) { this.mbCommands.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_COMMAND] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        console.log(`[${getCurrentDatetime('comm')}] ${commandCount} commands loaded : ` + util.inspect(commandName, false, null, true));
    };

    async onMessageListen() {
        this.mbClient.on('message', async (channel, userstate, message, self) => {
            if (self || userstate.username === 'mobbot_') return;

            var _rdm = Math.random();

            if (message.startsWith('http')) {
                if (userstate.username != 'daftmob') {
                    if (message.startsWith('https://clips.twitch.tv/')) {
                        this.mbClient.reply(channel, `@${userstate.username} viens de partager un clip dans le chat, merci à toi !`, userstate.id);
                        console.log(`[${getCurrentDatetime('comm')}] ${userstate.id}@${userstate.username} create a clip ${message}`);
                    } else {
                        await axios.delete('https://api.twitch.tv/helix/moderation/chat?broadcaster_id=70530820&moderator_id=844905873&message_id=' + userstate.id, params);
                        console.log(`[${getCurrentDatetime('comm')}] MESSAGE DELETE ${userstate.id}@${userstate.username} | ${message}`);
                    };
                };
            };

            if (message.startsWith('!')) {
                let msg = message.trim().toLowerCase(),
                    args = msg.slice(1).split(' '),
                    command = args.shift().toLowerCase(),
                    checkCollection;

                this.mbCommands.has(command) ? checkCollection = this.mbCommands.get(command).data.name : checkCollection = false;

                switch (command) {
                    case checkCollection:
                        await this.mbCommands
                            .get(checkCollection)
                            .execute(this.mbClient,
                                channel,
                                message,
                                userstate,
                                await this.onLastVideo(),
                                await this.onTimeStamp(),
                                false,
                                false);
                        this._count++;
                        break;
                    case 'test':
                        this.mbClient.reply(channel, 'Can not send message (-&?. undefined)', userstate.id)
                            .catch(e => console.log(e));
                        this._count++;
                        break;
                };

                if (command.includes('emote')) {
                    this.mbClient.say(channel, '!emote daftmo1Gotanitem')
                        .catch(e => console.log(e));
                    this._emote = false;
                    this._count++;
                };
            };

            for (let i in message.split(' ')) {
                if (message.split(' ')[i].toLowerCase() === '@mobbot_') {
                    this.mbClient.reply(channel, 'yes, sir ?', userstate.id)
                        .catch(e => console.log(e));
                    this._count++;
                };
            };

            if (regular_users.includes(userstate.username) && _rdm < .005) {
                let regulars_msg = [
                    `salut ${userstate.username} PixelBob`,
                    `ouah ${userstate.username} est là MyAvatar`,
                    `${userstate.username} PotFriend`,
                    `le GOAT ${userstate.username} GoatEmotey`
                ];

                this.mbClient.reply(channel, regulars_msg[randomIntFromInterval(0, regulars_msg.length - 1)], userstate.id)
                    .catch(e => console.log(e));

                this._count++;
            };

            this._count++;
            await this.onLiveSponsor();

            if (_rdm < .05 && !this.live) {
                await threadPause(3.5, false); // 3.5 secondes
                this.mbClient.say(channel, `ALL SYSTEMS ARE OFFLINE MrDestructoid`)
                    .catch(e => console.log(e));
            };
        });
    };

    async onLiveSponsor() {
        if (this.live) {
            const minutesLater = moment().tz('Europe/Paris').add(30, 'minutes').toDate(), // 30 minutes
                hasMinutesPassed = new Date() >= minutesLater;

            if (this._count % 20 === 0 || hasMinutesPassed) {
                await this.mbCommands
                    .get('timer')
                    .execute(this.mbClient,
                        channels[0],
                        undefined,
                        undefined,
                        await this.onLastVideo(),
                        await this.onTimeStamp(),
                        false,
                        true);
            };

            hasMinutesPassed ? this.date = new Date() : null;
        };
    };

    async onSubscription() {
        this.mbClient.on("subscription", (channel, username, method, message, userstate) => {
            this.mbClient.say(channel, `eh @${username} fais maintenant parti des recrues, merci !`)
                .catch(e => console.log(e));
        });
    };

    async onReSubsciption() {
        this.mbClient.on("resub", (channel, username, months, message, userstate, methods) => {
            let cumulativeMonths = userstate["msg-param-cumulative-months"];
            this.mbClient.say(channel, `un exploit GlitchCat @${username} est revenu pour le ${cumulativeMonths} mois consécutif`)
                .catch(e => console.log(e));
        });
    };

    async onCheers() {
        this.mbClient.on("cheer", (channel, userstate, message) => {
            this.mbClient.say(channel, `trop généreux !! @${userstate.username} m'envoie ${userstate.bits} bits RyuChamp`)
                .catch(e => console.log(e));
        });
    };

    async onGiftSubscription() {
        this.mbClient.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
            this.mbClient.say(channel, `ok ok... @${username} offre ${numbOfSubs} sub PogChamp PogChamp`)
                .catch(e => console.log(e));
        });
    };

    async onYeeetTheChild() {
        this.mbClient.on("ban", (channel, username, reason, userstate) => {
            this.mbClient.say(channel, `YEEEEEEEEEEEEEEEEEEET ${username} !! DarkMode`)
                .catch(e => console.log(e));
        });
    };

    async onEasyYeeetTheChild() {
        this.mbClient.on("timeout", (channel, username, reason, duration, userstate) => {
            this.mbClient.say(channel, `${username} plus tard, reviendra !! FBPass`)
                .catch(e => console.log(e));
        });
    }

    async onDataImport() {
        this.mbClient.on('message', (channel, userstate, message, self) => {
            if (self || userstate['username'] === 'moobot_') return;
            return dataToExport.push({
                'id': Number(userstate['user-id']),
                'date': getCurrentDatetime('date'),
                'badges': userstate['badges'],
                'color': String(userstate['color']),
                'username': String(userstate['username']),
                'message': String(message),
                'emotes': userstate['emotes-raw'] == null ? null : String(userstate['emotes-raw']),
                'turbo': Boolean(userstate['turbo'])
            });
        });
    };

    async onDataExport(message, client) {
        if (dataToExport.length === 0) {
            let emoji = client.emojis.cache.find(emoji => emoji.id === '1071408691875676262');
            message
                .react(emoji)
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error react ${err}`); });
            return;
        };

        fs.writeFile(`./core/data/mobbot_analytics.csv`, parse(dataToExport), function (err) {
            if (err) {
                let emoji = client.emojis.cache.find(emoji => emoji.id === '1071407982472085624');
                message
                    .react(emoji)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error react ${err}`); });
                throw err;
            } else {
                let emoji = client.emojis.cache.find(emoji => emoji.id === '1071050224291819560');
                message
                    .react(emoji)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error react ${err}`); });
            };
        });

        message.author
            .send({ 'content': 'csv being transferred' })
            .then((msg) => { msg.edit({ 'content': 'csv transferred', 'files': ['./core/data/mobbot_analytics.csv'] }); })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error during file send ${err}`); });
    };

    async onLive(message, client_, language, gD, axios) {
        const { client } = await dynamic('@gradio/client');
        let app = await client('vivsmouret/pepe-diffuser'),
            response = undefined,
            toggleMedia = true;

        if (axios == undefined) {
            return console.log(`[${getCurrentDatetime('comm')}] Error function liveNotif() AXIOS [${axios}]`);
        } else {
            console.log(`[${getCurrentDatetime('comm')}] AXIOS PEPE LIVE ${axios.statusText}`);
            try {
                response = await app.predict('/predict', [
                    'pepe is playing at ' + axios.data.data[0].game_name,
                ]);
                console.log(`[${getCurrentDatetime('comm')}] LIVENOTIF Success predict: `, response.data[0].path);
            } catch (err) {
                console.log(`[${getCurrentDatetime('comm')}] LIVENOTIFRROR HuggingFace API Error ${err}`);
            };
        };

        if (response == undefined) {
            toggleMedia = false;
            console.log(`[${getCurrentDatetime('comm')}] LIVENOTIFRROR When get response data : `, response);
        } else {
            downloadImagesFromUrl(response.data[0].url, `./styles/ai/pepe-diffuser-x.jpg`, function () {
                console.log(`[${getCurrentDatetime('comm')}] Image successfully downloaded from HuggingFace`);
            });
        };

        let channelTwitch = ['💻incoming', '🎦-fox-stream-🎦', 'twitch-support-🎥', 'bots', 'pirate-bots'],
            guid = '',
            dot = '';

        if (gD == undefined) {
            return console.log(`[${getCurrentDatetime('comm')}] Error function liveNotif() GUID [${gD}]`);
        } else if (gD != undefined) {
            guid = gD.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
            console.log(`[${getCurrentDatetime('comm')}] GUID ${guid}`);
            if (guid == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() GUID [${guid}]`);
            guid = guid.split('s/')[1].split('-p')[0];
            console.log(`[${getCurrentDatetime('comm')}] GUID ${guid}`);
            if (guid == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() GUID [${guid}]`);

            dot = gD.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
            console.log(`[${getCurrentDatetime('comm')}] DOT ${dot}`);
            if (dot == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() DOT [${dot}]`);
            dot = dot.split('.')[1].split(' ')[0];
            console.log(`[${getCurrentDatetime('comm')}] DOT ${dot}`);
            if (dot == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() DOT [${dot}]`);
        };

        switch (toggleMedia) {
            case true:
                const mediaIds = await Promise.all([
                    xApi.v1.uploadMedia('./styles/ai/pepe-diffuser-x.jpg')
                ]);
                await rwClient.v2.tweet({
                    text: `${axios.data.data[0].title}\
                        \n#daftmob #${axios.data.data[0].game_name.split(' ').join('')} #twitch #pepe\
                        \n\nhttps://twitch.tv/${axios.data.data[0].user_name}`,
                    media: { media_ids: mediaIds }
                });
                console.log(`[${getCurrentDatetime('comm')}] LIVENOTIF Tweet with media`);
                break;
            case false:
                await rwClient.v2.tweet({
                    text: `${axios.data.data[0].title}\
                        \n#daftmob #${axios.data.data[0].game_name.split(' ').join('')} #twitch #pepe\
                        \n\nhttps://twitch.tv/${axios.data.data[0].user_name}`
                });
                console.log(`[${getCurrentDatetime('comm')}] LIVENOTIF Tweet without media`);
                toggleMedia = true;
                break;
        };

        for (let chan in channelTwitch) {
            var channelSend = client_.channels.cache.find(channel => channel.name == channelTwitch[chan]);
            if (channelSend == undefined) break;
            if (channelTwitch[chan] == 'bots' && axios.data.data[0].game_name != 'Rocket League') break;
            if (channelTwitch[chan] == 'pirate-bots' && axios.data.data[0].game_name != 'Sea of Thieves') break;

            await client_.channels.cache
                .get(channelSend.id)
                .send({
                    'channel_id': channelSend.id,
                    'content': channelTwitch[chan] == '💻incoming' ? 'le daft part en live sur <@&1071048787738497084>, venez le retrouver !' : '',
                    'tts': false,
                    'embeds': [{
                        'type': 'rich',
                        'title': `Live de ${axios.data.data[0].user_name}`,
                        'description': `${language.descLiveSt} **${axios.data.data[0].user_name}** ${language.descLiveNd}`,
                        'color': randomColor(),
                        'fields': [{
                            'name': axios.data.data[0].game_name,
                            'value': axios.data.data[0].title
                        }],
                        'image': {
                            'url': `https://static-cdn.jtvnw.net/previews-ttv/live_user_${axios.data.data[0].user_login}-320x180.jpg?r=294998`,
                            'proxy_url': `https://twitch.tv/${axios.data.data[0].user_login}`
                        },
                        'thumbnail': {
                            'url': `https://static-cdn.jtvnw.net/jtv_user_pictures/${guid}-profile_image-300x300.${dot}`,
                            'proxy_url': `https://twitch.tv/${axios.data.data[0].user_login}`
                        },
                        'author': {
                            'name': oauth.identity.username,
                            'url': `https://twitch.tv/${axios.data.data[0].user_login}`,
                            'icon_url': client_.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                        },
                        'footer': {
                            'text': `Viewers : ${axios.data.data[0].viewer_count}`,
                            'icon_url': `https://em-content.zobj.net/thumbs/120/microsoft/319/busts-in-silhouette_1f465.png`,
                            'proxy_icon_url': `https://twitch.tv/${axios.data.data[0].user_login}`
                        },
                        'url': `https://twitch.tv/${axios.data.data[0].user_login}`
                    }]
                })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error message liveNotif() ${err}`); });
        };

        client_.user.setPresence({
            activities: [{
                name: language.stream,
                type: ActivityType.Streaming,
                url: 'https://twitch.tv/daftmob'
            }],
            status: 'online'
        });

        console.log(`[${getCurrentDatetime('comm')}] LIVETWT ${axios.data.data[0].game_name} | ${axios.data.data[0].title} / ${channelTwitch}`);
    };

    async onVideoPublish(message, client, language) {
        let fe = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=UCreItrEewfO6IPZYPu4C7pA`)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`); }),
            fetched = await fe.text(),
            channelYoutube = ['📺video'],
            video = [],
            urI,
            title,
            thumbnail,
            descp;

        console.log(`[${getCurrentDatetime('comm')}] FETCH VIDEO YTB ${fe.statusText}`);
        video = fetched.split(new RegExp(`(\:[^.]*\<\/)`, 'giu'));
        console.log(`[${getCurrentDatetime('comm')}] VIDEO DATA ${video[3]} /// ${video[6]}`);
        urI = video[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[10];
        console.log(`[${getCurrentDatetime('comm')}] URL ${urI}`);
        title = video[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[18].slice(0, -2);
        console.log(`[${getCurrentDatetime('comm')}] TITLE ${title}`);
        thumbnail = video[6].split(new RegExp(`(\"[^.]*?\")`, 'giu'))[8];
        console.log(`[${getCurrentDatetime('comm')}] THUMBNAIL ${thumbnail}`);
        descp = video[6].split(new RegExp(`(\"[^.]*?\")`, 'giu'))[12].split(new RegExp(`(\>[^.]*?\:)`, 'giu'))[3].slice(1, -9);
        console.log(`[${getCurrentDatetime('comm')}] DESCP ${descp}`);

        await rwClient.v2.tweet({
            text: `${title}\
            \n${descp}\
            \n#daftmob #youtube #pepe\
            \n\nhttps://www.youtube.com/watch?v=${urI}`
        });
        console.log(`[${getCurrentDatetime('comm')}] YTBVIDEO Tweet ${title}`);

        for (let chan in channelYoutube) {
            var channelSend = client.channels.cache.find(channel => channel.name == channelYoutube[chan]);
            if (channelSend.id == undefined) break;

            client.channels.cache
                .get(channelSend.id)
                .send({
                    'channel_id': channelSend.id,
                    'content': 'je viens de pondre une vidéo <@&1071049081910210661> !',
                    'tts': false,
                    'embeds': [{
                        'type': 'rich',
                        'title': title,
                        'description': descp,
                        'color': randomColor(),
                        'image': {
                            'url': thumbnail,
                            'proxy_url': `https://www.youtube.com/watch?v=${urI}`
                        },
                        'thumbnail': {
                            'url': `https://yt3.ggpht.com/SeggshbVSGnz8KFWP-KsS6pQyYpc-BRNc_OxvJH_ilwuLgKEo7bxtxoP1yooIH2ELiq7hTGM=s600-c-k-c0x00ffffff-no-rj-rp-mo`,
                            'proxy_url': `https://www.youtube.com/watch?v=${urI}`
                        },
                        'author': {
                            'name': 'Les Lives de daftmob',
                            'url': `https://www.youtube.com/watch?v=${urI}`,
                            'icon_url': client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                        },
                        'url': `https://www.youtube.com/watch?v=${urI}`
                    }]
                })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error message videoNotif() ${err}`); });
        };

        console.log(`[${getCurrentDatetime('comm')}] YTBVIDEO ${title} / ${channelYoutube}`);
    };

    async onLastVideo() {
        let fe = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=UCreItrEewfO6IPZYPu4C7pA`)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error FETCH ${err}`); }),
            fetched = await fe.text();
        return String(fetched.split(new RegExp(`(\:[^.]*\<\/)`, 'giu'))[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[10]); // split doesn't work simetimes ?
    };

    async onTimeStamp() {
        let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=` + channels[0].slice(1), params)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`); });

        return ax.data.data.length != 0 ?
            new Date(new Date().getTime() - new Date(ax.data.data[0].started_at).getTime()).toUTCString().slice(17, -4) :
            '00:00:00';
    };

    onConnectedHandler(addr, port) { console.log(`* Connected to ${addr}:${port} *`); };
};

exports.MobBot = MobBot;