'use.strict'

const { ActivityType } = require('discord.js'),
    axios = require('axios'),
    { prefix, token, owner } = require('../config.json'),
    { fr, en, uk } = require('../resx/lang.json'),
    { master, user, topgg } = require('../resx/help.json'),
    { sendEmbed, getCurrentDatetime } = require('../function.js'),
    date = new Date();

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
            } else if (message.guild.name == 'Top.gg Verification Center') {
                switch (lang) {
                    case 'fr':
                        descSplit = topgg.fr;
                        break;
                    case 'en':
                        descSplit = topgg.en;
                        break;
                    case 'uk':
                        descSplit = topgg.uk;
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

            if (desc == language.helpTopGg) console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username} been trolled`);
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
            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
            let start = initDateTime;

            sendEmbed(message, `${language.uptime} ${start}\n${days}D:${hours}H:${minutes}M:${seconds}S`);
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
                nameText = args[2],
                urlLike = args[3],
                urlBool,
                argNb = 3;

            for (it in args) {
                if (String(args[it]).startsWith('http')) {
                    urlBool = true;
                    break;
                } else { urlBool = false; }
            };

            if (urlBool) {
                while (!String(urlLike).startsWith('http')) {
                    urlLike = args[argNb + 1];
                    nameText = nameText + ' ' + args[argNb];
                    argNb++;
                };
            } else {
                while (!(urlLike == undefined)) {
                    urlLike = args[argNb + 1];
                    nameText = nameText + ' ' + args[argNb];
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
                    return sendEmbed(message, `${fr.wrongStatus}\n
*e.g. ${prefix}status ${typeThings} online ${nameText} ${urlLike}*`);
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
                    return sendEmbed(message, `${fr.wrongActivities}\n
*e.g. ${prefix} stream ${stOnOff} ${nameText} ${urlLike}*`);
            };

            if (!urlBool) {
                client.user.setPresence({
                    activities: [{
                        name: String(nameText)
                    }],
                    status: String(stOnOff)
                });
                client.user.setActivity(String(nameText), { type: typeThings });
            } else {
                client.user.setPresence({
                    activities: [{
                        name: String(nameText),
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
            new Promise(resolve => setTimeout(resolve, 3 * 1000));
            client.destroy();

            new Promise(resolve => setTimeout(resolve, 3 * 1000));
            client.login(token);

            client.user.setPresence({
                activities: [{
                    name: language.activities,
                    type: ActivityType.Watching

                }],
                status: 'online'
            });
        }
    }
};