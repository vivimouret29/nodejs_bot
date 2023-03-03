'use.strict'

const axios = require('axios'),
    { owner } = require('../config.json'),
    { fr, en, uk } = require('../resx/lang.json'),
    { master, user } = require('../resx/help.json'),
    { getCurrentDatetime } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'help',
        description: 'a dynamic help'
    },
    async execute(message, client, language, args, initDateTime) {
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
            guid = await guidDot.data.split(new RegExp(`(s\/[^.]*-p)`, 'giu'))[1];
            guid = guid.split('s/')[1].split('-p')[0];

            dot = await guidDot.data.split(new RegExp(`(ge-[.]*...........)`, 'giu'))[1];
            dot = dot.split('.')[1].split(' ')[0];
        } catch (err) { console.log(`[${getCurrentDatetime('comm')}] Can't get guid or dot`); };

        for (i in descSplit) { desc += descSplit[i]; };

        message.author
            .send({
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
            })
            .catch(err => {
                message.channel.send(language.helpError);
                console.log(`[${getCurrentDatetime('comm')}] Error function help() ${err}`);
                return;
            });
    }
};
