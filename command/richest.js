'use.strict'

const { sendEmbed, getCurrentDatetime, randomColor } = require('../core/utils.js'),
    csvParse = require('fast-csv'),
    fs = require('node:fs');

const filePath = `./data/user_roll.csv`;

async function messageEmbed(message, content, errornot) {
    var messageToSend = await message.channel
        .send({
            'channel_id': message.channel.channel_id,
            'tts': false,
            'embeds': [{
                'type': 'rich',
                'title': errornot ? `🏆 Les plus riches de ${message.guild.name} 🏆` : '',
                'description': content,
                'color': randomColor()
            }],
            'ephemeral': false
        });

    return messageToSend;
};

module.exports = {
    data: {
        name: 'richest',
        description: 'a dynamic richest',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        var dataUsers = {},
            i = 0;

        fs.exists(filePath, async (e) => {
            if (e) {
                fs.createReadStream(filePath)
                    .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
                    .on('data', row => {
                        if (row.id != 'id' && row.guildid == message.guild.id
                            && row.rubis != 0) {
                            dataUsers[i] = {
                                'id': Number(row.id),
                                'username': String(row.username),
                                'platform': String(row.platform),
                                'pseudo': String(row.pseudo),
                                'rubis': String(row.rubis),
                                'canroll': row.canroll == 'true' ? true : false,
                                'roll': Number(row.roll),
                                'lastroll': String(row.lastroll),
                                'dailyroll': String(row.dailyroll),
                                'canwork': row.canwork == 'true' ? true : false,
                                'claimwork': String(row.claimwork),
                                'worktime': Number(row.worktime),
                                'guildid': String(row.guildid)
                            };
                            i++;
                        };
                    })
                    .on('end', async () => {
                        let richest = {},
                            invent = '';

                        for (const [key, value] of Object.entries(dataUsers)) {
                            richest[key] = { 'username': value.username, 'rubis': value.rubis };
                        };

                        try {
                            if (richest[0] != undefined) {
                                for (let i = 0; i < 10; i++) {
                                    if (richest[i] == undefined) break;
                                    if (i == 0) {
                                        invent += `🥇 - **${richest[i].username}**
${client.emojis.cache.find(emoji => emoji.name === 'rubis')}   ${richest[i].rubis}\n\n`;
                                    } else if (i == 1) {
                                        invent += `🥈 - **${richest[i].username}**
${client.emojis.cache.find(emoji => emoji.name === 'rubis')}   ${richest[i].rubis}\n\n`;
                                    } else if (i == 2) {
                                        invent += `🥉 - **${richest[i].username}**
${client.emojis.cache.find(emoji => emoji.name === 'rubis')}   ${richest[i].rubis}\n\n`;
                                    } else {
                                        invent += `**${i + 1}** - **${richest[i].username}**
${client.emojis.cache.find(emoji => emoji.name === 'rubis')}   ${richest[i].rubis}${i == 9 ? '' : '\n\n'}`;
                                    };
                                };

                                await messageEmbed(message, invent, true)
                                    .catch(err => {
                                        message.reply({ 'content': language.error, 'ephemeral': true });
                                        console.log(`[${getCurrentDatetime('comm')}] Error returning richest RERROR ${err}`);
                                    });
                            } else {
                                await messageEmbed(message, language.richestEmpty, false)
                                    .catch(err => {
                                        message.reply({ 'content': language.error, 'ephemeral': true });
                                        console.log(`[${getCurrentDatetime('comm')}] Error returning richest RERROR ${err}`);
                                    });
                            };
                        } catch (err) {
                            console.log(`[${getCurrentDatetime('comm')}] Error returning richest RERROR ${err}`)
                            await sendEmbed(message, language.richestError, false)
                                .catch(err => {
                                    message.reply({ 'content': language.error, 'ephemeral': true });
                                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                                });
                        };
                    });
            } else {
                console.log(`[${getCurrentDatetime('comm')}] Error returning richest RERROR`)
                await messageEmbed(message, language.richestError, false)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
            };
        });
    }
};