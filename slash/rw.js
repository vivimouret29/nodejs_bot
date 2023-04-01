'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { randomIntFromInterval, getCurrentDatetime } = require('../core/utils.js'),
    fs = require('node:fs'),
    { parse } = require('json2csv'),
    csvParse = require('fast-csv'),
    { Weapons } = require('../core/classes/weapons.js');

const filePathUser = `./data/user_roll.csv`;
const filePathInventory = `./data/weap_inventory_user_roll.csv`;
const weapons = new Weapons();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rw')
        .setDescription('Pour lancer une roulette d\'armes de The Legend Of Zelda: Breath Of The Wild'),
    async execute(message, client, language, user, initDateTime) {
        if (!user.canroll) {
            return message.reply({
                'channel_id': message.channel.channel_id,
                'content': `${message.user.username}: ${language.rollWait} **${String(new Date(Number(user.lastroll) - Date.now())).slice(16, -43)}**`,
                'fetchReply': false,
                'ephemeral': true
            });
        };

        var roll = [],
            result = [],
            earn = [],
            earnCsv = [],
            dataUser = [];

        try {
            weapons.setPreRoll(client);

            var sword = weapons.roll.sword,
                clubs = weapons.roll.clubs,
                spear = weapons.roll.spear,
                twohands = weapons.roll.twohands,
                axes = weapons.roll.axes,
                boomerang = weapons.roll.boomerang,
                shield = weapons.roll.shield,
                bow = weapons.roll.bow;

            let trueOrFalse = randomIntFromInterval(0, 1) == 0 ? true : false;

            for (let i = 0; i < 15; i++) {
                if (roll.length < 3) {
                    switch (trueOrFalse) {
                        case true:
                            if (sword.length > 0) {
                                if (sword.length >= 5) {
                                    roll.push(await sword[randomIntFromInterval(0, 4)].cache);
                                } else {
                                    roll.push(await sword[randomIntFromInterval(0, (sword.length - 1))].cache);
                                };
                            } else {
                                roll.push(await clubs[randomIntFromInterval(0, (clubs.length - 1))].cache);
                            };
                            break;
                        case false:
                            if (clubs.length > 0) {
                                if (clubs.length >= 5) {
                                    roll.push(await clubs[randomIntFromInterval(0, 4)].cache);
                                } else {
                                    roll.push(await clubs[randomIntFromInterval(0, (clubs.length - 1))].cache);
                                };
                            } else {
                                roll.push(await sword[randomIntFromInterval(0, (sword.length - 1))].cache);
                            };
                            break;
                    };
                } else if (3 <= roll.length && roll.length < 6) {
                    switch (trueOrFalse) {
                        case true:
                            if (twohands.length > 0) {
                                if (twohands.length >= 5) {
                                    roll.push(await twohands[randomIntFromInterval(0, 4)].cache);
                                } else {
                                    roll.push(await twohands[randomIntFromInterval(0, (twohands.length - 1))].cache);
                                };
                            } else {
                                roll.push(await spear[randomIntFromInterval(0, (spear.length - 1))].cache);
                            };
                            break;
                        case false:
                            if (spear.length > 0) {
                                if (spear.length >= 5) {
                                    roll.push(await spear[randomIntFromInterval(0, 4)].cache);
                                } else {
                                    roll.push(await spear[randomIntFromInterval(0, (spear.length - 1))].cache);
                                };
                            } else {
                                roll.push(await twohands[randomIntFromInterval(0, (twohands.length - 1))].cache);
                            };
                            break;
                    };
                } else if (6 <= roll.length && roll.length < 9) {
                    switch (trueOrFalse) {
                        case true:
                            if (boomerang.length > 0) {
                                if (boomerang.length >= 5) {
                                    roll.push(await boomerang[randomIntFromInterval(0, 4)].cache);
                                } else {
                                    roll.push(await boomerang[randomIntFromInterval(0, (boomerang.length - 1))].cache);
                                };
                            } else {
                                roll.push(await axes[randomIntFromInterval(0, (axes.length - 1))].cache);
                            };
                            break;
                        case false:
                            if (axes.length > 0) {
                                if (axes.length >= 5) {
                                    roll.push(await axes[randomIntFromInterval(0, 4)].cache);
                                } else {
                                    roll.push(await axes[randomIntFromInterval(0, (axes.length - 1))].cache);
                                };
                            } else {
                                roll.push(await boomerang[randomIntFromInterval(0, (boomerang.length - 1))].cache);
                            };
                            break;
                    };
                } else if (9 <= roll.length && roll.length < 12) {
                    if (shield.length >= 9) {
                        roll.push(await shield[randomIntFromInterval(0, 7)].cache);
                    } else {
                        roll.push(await shield[randomIntFromInterval(0, (shield.length - 1))].cache);
                    }
                } else if (12 <= roll.length && roll.length < 15) {
                    if (bow.length >= 9) {
                        roll.push(await bow[randomIntFromInterval(0, 7)].cache);
                    } else {
                        roll.push(await bow[randomIntFromInterval(0, (bow.length - 1))].cache);
                    };
                };

                if (roll.length % 3 == 0) {
                    let y = i - 1,
                        ii = i - 2;
                    if (roll[i].name == roll[y].name && roll[i].name == roll[ii].name) {
                        result.push('☑️');
                        earn.push(roll[i].name.slice(3).split('_').join(' '));
                        earnCsv.push(roll[i].name);
                    } else { result.push('❌'); };
                };
            };
        } catch (err) {
            return message
                .reply({
                    'channel_id': message.channel.channel_id,
                    'content': `${language.errorRoll}`,
                    'fetchReply': false,
                    'ephemeral': true
                })
                .then(() => {
                    console.log(`[${getCurrentDatetime('comm')}] Error roll algo ${err}`);
                });
        };

        if (earnCsv.length != 0) {
            for (let i = 0; i < earnCsv.length; i++) {
                dataUser.push({
                    'id': Number(message.user.id),
                    'user': String(message.user.username),
                    'inventory': String(earnCsv[i])
                });
            };

            fs.exists(filePathInventory, async (e) => {
                if (e) {
                    fs.createReadStream(filePathInventory)
                        .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
                        .on('data', async row => {
                            if (row.id != 'id') {
                                dataUser.push({
                                    'id': Number(row.id),
                                    'user': String(row.user),
                                    'inventory': String(row.inventory)
                                });
                            };
                        })
                        .on('end', () => {
                            fs.writeFileSync(filePathInventory, parse(dataUser), async function (err) {
                                if (err) {
                                    await message.editReply({
                                        'channel_id': message.channel.channel_id,
                                        'content': `${language.errorRoll}`,
                                        'fetchReply': false,
                                        'ephemeral': true
                                    });
                                    console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username}'s inventory error save ${err}`);
                                    throw err;
                                } else {
                                    console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username}'s inventory save`);
                                };
                            });
                        });
                } else {
                    fs.writeFileSync(filePathInventory, parse(dataUser), async function (err) {
                        if (err) {
                            await message.editReply({
                                'channel_id': message.channel.channel_id,
                                'content': `${language.errorRoll}`,
                                'fetchReply': false,
                                'ephemeral': true
                            });
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username}'s inventory error save ${err}`);
                            throw err;
                        } else {
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username}'s inventory save`);
                        };
                    });
                };
            });
        };

        let usersProperty = [];
        fs.createReadStream(filePathUser)
            .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
            .on('data', row => {
                if (row.id != 'id' &&
                    Number(row.id) == Number(message.author.id)) {
                    if ((Number(row.roll) + 1) % 3 == 0) {
                        usersProperty.push({
                            'id': Number(row.id),
                            'username': String(row.username),
                            'canroll': false,
                            'roll': Number(row.roll) + 1,
                            'lastroll': Date.now() + 40000000
                        });
                    } else {
                        usersProperty.push({
                            'id': Number(row.id),
                            'username': String(row.username),
                            'canroll': true,
                            'roll': Number(row.roll) + 1,
                            'lastroll': Number(row.lastroll)
                        });
                    };
                } else {
                    usersProperty.push({
                        'id': Number(row.id),
                        'username': String(row.username),
                        'canroll': row.canroll == 'true' ? true : false,
                        'roll': Number(row.roll),
                        'lastroll': Number(row.lastroll)
                    });
                };
            })
            .on('end', () => {
                fs.writeFileSync(filePathUser, parse(usersProperty), function (err) {
                    if (err) {
                        message.channel.send(`${language.errorRoll}`);
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username}'s error save ${err}`);
                        throw err;
                    };
                });
            });

        var fi_line = `${roll[0]} ${roll[1]} ${roll[2]} ${result[0]}`,
            se_line = `${roll[3]} ${roll[4]} ${roll[5]} ${result[1]}`,
            th_line = `${roll[6]} ${roll[7]} ${roll[8]} ${result[2]}`,
            fo_line = `${roll[9]} ${roll[10]} ${roll[11]} ${result[3]}`,
            ff_line = `${roll[12]} ${roll[13]} ${roll[14]} ${result[4]}`;

        await message.reply(
            {
                'channel_id': message.channel.channel_id,
                'content': fi_line + '\n' +
                    se_line + '\n' +
                    th_line + '\n' +
                    fo_line + '\n' +
                    ff_line,
                'fetchReply': true,
                'ephemeral': false
            }
        );

        switch (earn.length) {
            case 1:
                await message.editReply(
                    {
                        'channel_id': message.channel.channel_id,
                        'content': fi_line + '\n' +
                            se_line + '\n' +
                            th_line + '\n' +
                            fo_line + '\n' +
                            ff_line + '\n' +
                            `${message.user.username}: ${language.winRoll} **${earn}** !`,
                        'fetchReply': false,
                        'ephemeral': false
                    })
                break;
            case 2:
                await message.editReply(
                    {
                        'channel_id': message.channel.channel_id,
                        'content': fi_line + '\n' +
                            se_line + '\n' +
                            th_line + '\n' +
                            fo_line + '\n' +
                            ff_line + '\n' +
                            `${message.user.username}: ${language.winRoll} **${earn[0]}** !\n${language.winRoll2} **${earn[1]}** !!!`,
                        'fetchReply': false,
                        'ephemeral': false
                    });
                break;
            case 3:
                await message.editReply(
                    {
                        'channel_id': message.channel.channel_id,
                        'content': fi_line + '\n' +
                            se_line + '\n' +
                            th_line + '\n' +
                            fo_line + '\n' +
                            ff_line + '\n' +
                            `${message.user.username}: ${language.winRoll3} **${earn[0]}** + **${earn[1]}** + **${earn[2]}** WTFFF ...`,
                        'fetchReply': false,
                        'ephemeral': false
                    });
                break;
            case 4:
                await message.editReply(
                    {
                        'channel_id': message.channel.channel_id,
                        'content': fi_line + '\n' +
                            se_line + '\n' +
                            th_line + '\n' +
                            fo_line + '\n' +
                            ff_line + '\n' +
                            `${message.user.username}: ${language.winRoll41} **${earn[0]}**, **${earn[1]}**, **${earn[2]}**, **${earn[3]}** ${language.winRoll42} .....`,
                        'fetchReply': false,
                        'ephemeral': false
                    });
                break;
            case 5:
                await message.editReply(
                    {
                        'channel_id': message.channel.channel_id,
                        'content': fi_line + '\n' +
                            se_line + '\n' +
                            th_line + '\n' +
                            fo_line + '\n' +
                            ff_line + '\n' +
                            `${message.user.username}: **${earn[0]}**, **${earn[1]}**, **${earn[2]}**, **${earn[3]}**, **${earn[4]}** ${language.winRoll5}`,
                        'fetchReply': false,
                        'ephemeral': false
                    });
                break;
            default:
                await message.editReply(
                    {
                        'channel_id': message.channel.channel_id,
                        'content': fi_line + '\n' +
                            se_line + '\n' +
                            th_line + '\n' +
                            fo_line + '\n' +
                            ff_line + '\n' +
                            `${message.user.username}: ${language.lossRoll}`,
                        'fetchReply': false,
                        'ephemeral': false
                    });
                break;
        };
    }
};