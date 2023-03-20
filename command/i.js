'use.strict'

const { sendEmbed, getCurrentDatetime, randomColor } = require('../core/utils.js'),
    fs = require('node:fs'),
    csvParse = require('fast-csv');

const filePath = `./data/inventory_user_roll.csv`;

async function messageEmbed(message, content) {
    var messageToSend = await message.channel
        .send({
            'channel_id': message.channel.channel_id,
            'content': '',
            'tts': false,
            'embeds': [{
                'type': 'rich',
                'title': '',
                'description': content,
                'color': randomColor(),
                'author': {
                    'name': message.author.username,
                    'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                },
                'thumbnail': { 'url': 'https://www.zelda.com/breath-of-the-wild/assets/img/features/sheikah.png' },
                'footer': {
                    'text': message.content,
                    'icon_url': 'https://cdn.discordapp.com/app-icons/757955750164430980/94a997258883caba5f553f98aea8df59.png?size=256',
                    'proxy_icon_url': 'https://discord.gg/ucwnMKKxZe'
                }
            }],
            'ephemeral': true
        });

    return messageToSend;
};

module.exports = {
    data: {
        name: 'i',
        description: 'a dynamic inventory',
        args: false
    },
    async execute(message, client, language, args, initDateTime) {
        var dataUsers = [];

        fs.exists(filePath, async (e) => {
            if (e) {
                fs.createReadStream(filePath)
                    .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
                    .on('data', row => {
                        if (row.id != 'id') {
                            dataUsers.push({
                                'id': Number(row.id),
                                'user': String(row.user),
                                'inventory': String(row.inventory)
                            });
                        };
                    })
                    .on('end', async () => {
                        let invent = '',
                            userInvent = [];
                        dataUsers.forEach(element => { if (element.id === Number(message.author.id)) { userInvent.push(element); }; });

                        try {
                            if (userInvent.length != 0) {
                                for (let item = 0; item < userInvent.length; item++) {
                                    let inventContent = userInvent[item].inventory.slice(3).split('_').join(' ');
                                    let inventEmoji = client.emojis.cache.find(emoji => emoji.name === userInvent[item].inventory);
                                    invent += `${inventEmoji} ${inventContent}\n`;
                                };

                                await messageEmbed(message, invent)
                                    .catch(err => {
                                        message.reply({ 'content': language.error, 'ephemeral': true });
                                        console.log(`[${getCurrentDatetime('comm')}] Error returning inventory IERROR ${err}`);
                                    });
                            } else {
                                await messageEmbed(message, language.inventEmpty)
                                    .catch(err => {
                                        message.reply({ 'content': language.error, 'ephemeral': true });
                                        console.log(`[${getCurrentDatetime('comm')}] Error returning inventory IERROR ${err}`);
                                    });
                            };
                        } catch (err) {
                            console.log(`[${getCurrentDatetime('comm')}] Error returning inventory IERROR ${err}`)
                            await sendEmbed(message, language.inventError)
                                .catch(err => {
                                    message.reply({ 'content': language.error, 'ephemeral': true });
                                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                                });
                        };
                    });
            } else {
                console.log(`[${getCurrentDatetime('comm')}] Error returning inventory IERROR`)
                await sendEmbed(message, language.inventError)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
            };
        });
    }
};