'use.strict'

const { ActivityType } = require('discord.js'),
    { prefix, owner } = require('../config.json'),
    { sendEmbed } = require('../core/function.js');

module.exports = {
    data: {
        name: 'status',
        description: 'a dynamic status',
        args: true
    },
    async execute(message, client, language, args, initDateTime) {
        if (!(message.author.id === owner)) return await sendEmbed(message, language.areYouOwner);

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
            await sendEmbed(message, `${language.wrongContent}\n
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
                await sendEmbed(message, `${language.wrongStatus}\n
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
                await sendEmbed(message, `${language.wrongActivities}\n
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

        await sendEmbed(message, language.changedActivites);
    }
};