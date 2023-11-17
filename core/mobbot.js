'use.strict'

const { Client } = require('tmi.js'),
    { ActivityType } = require('discord.js'),
    { parse } = require('json2csv'),
    axios = require('axios'),
    fs = require('node:fs'),
    path = require('node:path'),
    WebSocketClient = require('websocket').client,
    webSocket = new WebSocketClient(),
    { clientId, identity, channels } = require('./config.json'),
    { getCurrentDatetime, randomColor } = require('./utils.js'),
    { users: regular_users } = require('../resx/regular_users.json');

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
        this.date = new Date();

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
            await new Promise(resolve => setTimeout(resolve, 1800000)); // 30 minutes
        };
    };

    async setCollection() {
        const commandsPath = path.join(__dirname, './subcommands'),
            commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            var filePath = path.join(commandsPath, file),
                command = require(filePath);
            if ('data' in command && 'execute' in command) { this.mbCommands.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_COMMAND] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };
    };

    async onMessageListen() {
        this.mbClient.on('message', async (channel, userstate, message, self) => {
            if (self || userstate.username === 'mobbot_') return;

            var _rdm = Math.random();

            if (message.startsWith('https://')) {
                if (userstate.username != 'daftmob') {
                    if (message.startsWith('https://clips.twitch.tv/')) {
                        this.mbClient.reply(channel, `@${userstate.username} viens de partager un clip dans le chat, merci à toi !`, userstate.id)
                    } else {
                        await axios.delete('https://api.twitch.tv/helix/moderation/chat?broadcaster_id=70530820&moderator_id=844905873&message_id=' + userstate.id, params)
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
                this.mbClient.reply(channel, `salu ${userstate.username} PixelBob`, userstate.id)
                    .catch(e => console.log(e));
                this._count++;
            };

            this._count++;
            await this.onLiveSponsor();

            if (_rdm < .05 && !this.live) {
                await new Promise(resolve => setTimeout(resolve, 3500)); // 3.5 secondes
                this.mbClient.say(channel, `ALL SYSTEMS ARE OFFLINE MrDestructoid`)
                    .catch(e => console.log(e));
            };
        });
    };

    async onLiveSponsor() {
        if (this.live) {
            const minutesLater = new Date(this.date.getTime() + 30 * 60 * 1000), // 30 minutes
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
                throw err;
            } else {
                let emoji = client.emojis.cache.find(emoji => emoji.name === 'linkbadass');
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

    async onLive(message, client, language, gD, axios) {
        if (gD == undefined || axios == undefined) {
            return console.log(`[${getCurrentDatetime('comm')}] Error function liveNotif() : GUID [${gD}] and/or AXIOS [${axios}]`);
        };

        let guidDot = gD,
            channelTwitch = ['💻incoming', '🎦-fox-stream-🎦', 'twitch-support-🎥'],
            guid = '',
            dot = '';

        try {
            guid = guidDot.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
            guid = guid.split('s/')[1].split('-p')[0];

            dot = guidDot.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
            dot = dot.split('.')[1].split(' ')[0];
        } catch (err) {
            console.log(`[${getCurrentDatetime('comm')}] LIVENOTIFRROR Can't get guid and dot : `, err);
        };

        for (let chan in channelTwitch) {
            var channelSend = client.channels.cache.find(channel => channel.name == channelTwitch[chan]);
            if (channelSend == undefined) break;

            await client.channels.cache
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
                            'icon_url': client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
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

        client.user.setPresence({
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

        try {
            video = fetched.split(new RegExp(`(\:[^.]*\<\/)`, 'giu'));
            urI = video[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[10];
            title = video[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[18].slice(0, -2);
            thumbnail = video[6].split(new RegExp(`(\"[^.]*?\")`, 'giu'))[8];
            descp = video[6].split(new RegExp(`(\"[^.]*?\")`, 'giu'))[12].split(new RegExp(`(\>[^.]*?\:)`, 'giu'))[3].slice(1, -9);
        } catch (err) {
            console.log(`[${getCurrentDatetime('comm')}] VIDEONOTIFRROR Can't get video's information : `, err);
        };

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
        return String(fetched.split(new RegExp(`(\:[^.]*\<\/)`, 'giu'))[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[10]);
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