'use.strict'

const { getCurrentDatetime } = require("../core/utils");

module.exports = {
    roles: {
        name: 'roles',
        description: 'a dynamic roles setup',
        execute(message) {
            let er = dbClient.emojis.cache.find(emoji => emoji.name === 'looners'),
                rt = dbClient.emojis.cache.find(emoji => emoji.name === 'mandalorian'),
                ty = dbClient.emojis.cache.find(emoji => emoji.name === 'linkitem'),
                yu = dbClient.emojis.cache.find(emoji => emoji.name === 'croisade');

            message.delete().catch(O_o => { })
            message.channel.send({
                "channel_id": `${message.channel.id}`,
                "content": `<@&1071048787738497084>\n*Te permet de recevoir des notifications des lives Twitch*\n\n<@&1071049081910210661>\n*Te permet de recevoir des notifications des nouvelles vidéos Youtube*\n\n<@&1071043538810310697>\n*Te permet de recevoir des notifications à propos de l'univers STALKERS*\n\n<@&1071043898123751564>\n*Te permet de recevoir des notifications à propos de l'univers de la Bordure Extérieure*\n\n<@&1071048152834129949>\n*Te permet de recevoir des notifications à propos de l'univers de Hyrule*\n\n<@&1071043780263804938>\n*Te permet de recevoir des notifications à propos de l'univers de Calradia*`,
                "tts": false,
                "embeds": [{
                    "type": "rich",
                    "title": `Rôle`,
                    "description": `Voici tous les rôles actuellement à disposition de chacun,\nEn cliquant sur les réactions ci-dessous, vous pourrez vous mettre un rôle ou vous l'enlever`,
                    "color": 0x5c3ddb,
                    "author": {
                        "name": `daftbot`,
                        "icon_url": `https://cdn.discordapp.com/app-icons/1101098023259492493/235dfac49e136a686a5d7fd9e66430f3.webp?size=128`
                    }
                }]
            }).then(function (message) {
                message.react('💜')
                message.react('❤️')
                message.react(er)
                message.react(rt)
                message.react(ty)
                message.react(yu)
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} Role's Message Send`);
            }).catch((err) => {
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} Error writting role's message : ${err}`);
            });
        }
    }
};