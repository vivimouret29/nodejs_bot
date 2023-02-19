'use.strict'

const { ActivityType } = require('discord.js'),
    axios = require('axios'),
    { prefix, token, owner } = require('../config.json'),
    { fr, en, uk } = require('../resx/lang.json'),
    { master, user } = require('../resx/help.json'),
    { emojis: dctmj } = require('../resx/emojis.json'),
    { sendEmbed, getCurrentDatetime, randomColor } = require('../function.js');
    
Array.prototype.max = function () { return Math.max.apply(null, this); };
Array.prototype.min = function () { return Math.min.apply(null, this); };

module.exports = {
    help: {
        name: 'help',
        description: 'a dynamic help',
        async execute(message, client, language) {
            let twitch = 'https://twitch.tv/daftmob',
                guidDot = await axios.get(twitch),
                guid = '',
                dot = '',
                desc = '',
                descSplit = '',
                lang = '';

            switch (language) {
                case fr:
                    lang = 'fr';
                    break;
                case en:
                    lang = 'en';
                    break;
                case uk:
                    lang = 'uk';
                    break;
            };

            if (message.author.id === owner) {
                switch (lang) {
                    case 'fr':
                        descSplit = master.fr;
                        break;
                    case 'en':
                        descSplit = master.en;
                        break;
                    case 'uk':
                        descSplit = master.uk;
                        break;
                };
            } else {
                switch (lang) {
                    case 'fr':
                        descSplit = user.fr;
                        break;
                    case 'en':
                        descSplit = user.en;
                        break;
                    case 'uk':
                        descSplit = user.uk;
                        break;
                };
            };

            try {
                guid = guidDot.data.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
                guid = guid.split('s/')[1].split('-p')[0];

                dot = guidDot.data.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
                dot = dot.split('.')[1].split(' ')[0];
            } catch (err) {
                console.log(`[${getCurrentDatetime('comm')}] Can't get guid or dot`);
            };

            for (i in descSplit) { desc += descSplit[i]; };

            message.author.send({
                'channel_id': message.channel.channel_id,
                'content': '',
                'tts': false,
                'embeds': [{
                    'type': 'rich',
                    'title': language.help,
                    'description': desc,
                    'color': 0x0eb70b,
                    'timestamp': `2023-02-06T19:20:42.000Z`,
                    'author': {
                        'name': client.user.username
                    },
                    'footer': {
                        'text': language.helpAuthor,
                        'icon_url': `https://static-cdn.jtvnw.net/jtv_user_pictures/${guid}-profile_image-300x300.${dot}`,
                        'proxy_icon_url': twitch
                    }
                }]
            });
        }
    },
    guild: {
        name: 'guild',
        description: 'a dynamic guild',
        execute(message, client, language) {
            sendEmbed(message, `${client.user.username} ${language.guild}\n${client.guilds.cache.map(guild => guild.name).join(', ')}`);
        }
    },
    uptime: {
        name: 'uptime',
        description: 'a dynamic uptime',
        execute(message, client, language, initDateTime) {
            try {
                let totalSeconds = (client.uptime / 1000);
                let days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);
                let start = initDateTime;

                sendEmbed(message, `${language.uptime} ${start}\n${days}D:${hours}H:${minutes}M:${seconds}S`);
            } catch (err) {
                sendEmbed(message, language.error);
                console.log(`[${getCurrentDatetime('comm')}] Error function uptime() ${err}`);
            };
        }
    },
    status: {
        name: 'status',
        description: 'a dynamic status',
        args: true,
        execute(message, client, language, initDateTime, args) {
            if (!(message.author.id === owner)) return sendEmbed(message, language.areYouOwner);

            let typeThings = args[0],
                stOnOff = args[1],
                contenText = args[2],
                urlLike = args[3],
                urlBool,
                argNb = 3;

            for (it in args) {
                if (String(args[it]).startsWith('http')) {
                    urlBool = true;
                    break;
                } else { urlBool = false; };
            };

            if (String(contenText).startsWith('http') || contenText == undefined) {
                sendEmbed(message, `${language.wrongContent}\n
*e.g. ${prefix}status ${typeThings != undefined ? typeThings : 'watch'} ${stOnOff != undefined ? stOnOff : 'dnd'} hello world ! ${urlLike != undefined ? urlLike : ''}*`);
                return;
            };

            if (urlBool) {
                while (!String(urlLike).startsWith('http')) {
                    urlLike = args[argNb + 1];
                    contenText = contenText + ' ' + args[argNb];
                    argNb++;
                };
            } else {
                while (!(urlLike == undefined)) {
                    urlLike = args[argNb + 1];
                    contenText = contenText + ' ' + args[argNb];
                    argNb++;
                };
            };

            switch (stOnOff) {
                case 'online':
                    break;
                case 'idle':
                    break;
                case 'dnd':
                    break;
                default:
                    sendEmbed(message, `${language.wrongStatus}\n
*e.g. ${prefix}status ${typeThings != undefined ? typeThings : 'watch'} online ${contenText != undefined ? contenText : 'hello world !'} ${urlLike != undefined ? urlLike : ''}*`);
                    return;
            };

            switch (typeThings) {
                case 'play':
                    typeThings = ActivityType.Playing;
                    break;
                case 'watch':
                    typeThings = ActivityType.Watching;
                    break;
                case 'listen':
                    typeThings = ActivityType.Listening;
                    break;
                case 'stream':
                    typeThings = ActivityType.Streaming;
                    break;
                case 'compet':
                    typeThings = ActivityType.Competing;
                    break;
                default:
                    sendEmbed(message, `${language.wrongActivities}\n
*e.g. ${prefix}status stream ${stOnOff != undefined ? stOnOff : 'idle'} ${contenText != undefined ? contenText : 'hello world !'} ${urlLike != undefined ? urlLike : ''}*`);
                    return;
            };

            if (!urlBool) {
                client.user.setPresence({
                    activities: [{
                        name: String(contenText)
                    }],
                    status: String(stOnOff)
                });
                client.user.setActivity(String(contenText), { type: typeThings });
            } else {
                client.user.setPresence({
                    activities: [{
                        name: String(contenText),
                        type: typeThings,
                        url: String(urlLike)
                    }],
                    status: String(stOnOff)
                });
            };

            sendEmbed(message, language.changedActivites);
        }
    },
    kill: {
        name: 'kill',
        description: 'a dynamic kill',
        async execute(message, client, language) {
            if (!(message.author.id === owner)) return sendEmbed(message, language.areYouOwner);

            await sendEmbed(message, language.killBot);
            new Promise(resolve => setTimeout(resolve, 3 * 1000));
            client.destroy();
        }
    },
    reset: {
        name: 'reset',
        description: 'a dynamic reset',
        async execute(message, client, language) {
            if (!(message.author.id === owner)) return sendEmbed(message, language.areYouOwner);

            await sendEmbed(message, language.resetBot);
            new Promise(resolve => setTimeout(resolve, 1 * 1000));
            client.destroy();

            new Promise(resolve => setTimeout(resolve, 1 * 1000));
            client.login(token);

            client.user.setPresence({
                activities: [{
                    name: language.activities,
                    type: ActivityType.Watching

                }],
                status: 'online'
            });
        }
    },
    poll: {
        name: 'poll',
        description: 'a dynamic poll',
        args: true,
        async execute(message, client, language, initDateTime, args) {
            var survey = args.join(' ').split('-');
            if (survey == undefined) { return sendEmbed(message, language.error); };

            var dictMojis = [],
                maxCount = [],
                fields = [],
                reactions,
                highReact,
                postSurvey;

            for (i = 0; i < survey.length; i++) {
                let jis = client.emojis.cache.find(emoji => emoji.name === dctmj[i]);
                dictMojis.push(jis);
                fields.push({
                    'name': `${dictMojis[i]}`,
                    'value': survey[i],
                    'inline': false
                });
            };

            await message.channel
                .send({
                    'channel_id': message.channel.channel_id,
                    'content': '',
                    'tts': false,
                    'embeds': [{
                        'type': 'rich',
                        'title': 'Poll',
                        'description': '',
                        'color': randomColor(),
                        'author': {
                            'name': message.author.username,
                            'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                        },
                        'fields': fields
                    }]
                })
                .then(async (msg) => {
                    for (i = 0; i < dictMojis.length; i++) { await msg.react(dictMojis[i]) };
                    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                    return reactions = msg.reactions.cache.map(reaction => reaction);
                });

            for (i = 0; i < reactions.length; i++) { maxCount.push(reactions[i].count); };
            highReact = maxCount.max();
            dictMojis.forEach((emoji, index) => { reactions[index].count == highReact ? postSurvey = index : postSurvey; });

            message.channel.send(`The higher choice was ${survey[postSurvey]}`);
        }
    }
};