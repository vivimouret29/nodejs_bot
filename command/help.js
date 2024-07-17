'use.strict'

const axios = require('axios'),
    { fr: langFr, en: langEn, uk: langUk } = require('../resx/lang.json'),
    { fr: helpFr, en: helpEn, uk: helpUk } = require('../resx/help.json'),
    { randomColor, getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'help',
        description: 'a dynamic help',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        let twitch = 'https://twitch.tv/daftmob',
            guidDot = await axios.get(twitch),
            guid = '',
            dot = '',
            desc = '',
            descSplit = '',
            lang = '';

        new Promise(resolve => setTimeout(resolve, 2.5 * 1000)); // 2.5 secondes
        switch (language) {
            case langFr:
                lang = 'fr';
                break;
            case langEn:
                lang = 'en';
                break;
            case langUk:
                lang = 'uk';
                break;
        };

        switch (lang) {
            case 'fr':
                descSplit = helpFr;
                break;
            case 'en':
                descSplit = helpEn;
                break;
            case 'uk':
                descSplit = helpUk;
                break;
        };

        for (i in descSplit) { desc += descSplit[i]; };

        if (guidDot == undefined) {
            console.log(`[${getCurrentDatetime('comm')}] Error function help() GUID [${guidDot}]`);
            return false;
        } else if (guidDot.data != undefined) {
            console.log(`[${getCurrentDatetime('comm')}] GUIDOT HELP ${guidDot.statusText}`);
            guid = guidDot.data.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
            console.log(`[${getCurrentDatetime('comm')}] GUID ${guid}`);
            if (guid == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() GUID [${guid}]`);
            guid = guid.split('s/')[1].split('-p')[0];
            console.log(`[${getCurrentDatetime('comm')}] GUID ${guid}`);
            if (guid == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() GUID [${guid}]`);

            dot = guidDot.data.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
            console.log(`[${getCurrentDatetime('comm')}] DOT ${dot}`);
            if (dot == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() DOT [${dot}]`);
            dot = dot.split('.')[1].split(' ')[0];
            console.log(`[${getCurrentDatetime('comm')}] DOT ${dot}`);
            if (dot == undefined) return console.log(`[${getCurrentDatetime('comm')}] Error function help() DOT [${dot}]`);
        };

        await message.channel
            .send({
                'channel_id': message.channel.channel_id,
                'content': `${client.emojis.cache.find(emoji => emoji.name === 'spirit_orb')} \
DM ${lang === 'fr' ? 'envoyé' : 'sent'}  ${client.emojis.cache.find(emoji => emoji.name === 'spirit_orb')}`
            })
            .then(async () => {
                await message.author
                    .send({
                        'channel_id': message.channel.channel_id,
                        'content': '',
                        'tts': false,
                        'embeds': [{
                            'type': 'rich',
                            'title': language.help,
                            'description': desc,
                            'color': randomColor(),
                            'timestamp': `2024-07-16T01:38:12.365Z`, //TODO: don't forget to update dis
                            'author': {
                                'name': client.user.username,
                                'icon_url': 'https://cdn.discordapp.com/app-icons/757955750164430980/94a997258883caba5f553f98aea8df59.png?size=256'
                            },
                            'footer': {
                                'text': language.helpAuthor,
                                'icon_url': `https://static-cdn.jtvnw.net/jtv_user_pictures/${guid}-profile_image-300x300.${dot}`,
                                'proxy_icon_url': twitch
                            }
                        }]
                    });
            })
            .catch(err => {
                message.channel.send(language.helpError);
                console.log(`[${getCurrentDatetime('comm')}] Error function help() ${err}`);
                return;
            });
    }
};
