'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { randomIntFromInterval, getCurrentDatetime } = require('../core/utils.js'),
    fs = require('node:fs'),
    { parse } = require('json2csv'),
    csvParse = require('fast-csv'),
    { Weapons } = require('../core/classes/weapons.js');

const filePath = `./data/inventory_user_roll.csv`;
const weapons = new Weapons();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rw')
        .setDescription('Pour lancer une roulette d\items de The Legend Of Zelda'),
    async execute(message, client, language, initDateTime) {
        var roll = [],
            result = [],
            earn = [],
            earnCsv = [],
            dataUser = [];

        try {
            weapons.setPreRoll(client);

            var sword = weapons.fiRoll,
                claymore = weapons.seRoll,
                shield = weapons.thRoll,
                bow = weapons.foRoll,
                axes = weapons.ffRoll;

            for (let i = 0; i < 15; i++) {
                if (roll.length < 3) {
                    roll.push(sword[randomIntFromInterval(0, (sword.length - 1))]);
                } else if (3 <= roll.length && roll.length < 6) {
                    roll.push(claymore[randomIntFromInterval(0, (claymore.length - 1))]);
                } else if (6 <= roll.length && roll.length < 9) {
                    roll.push(shield[randomIntFromInterval(0, (shield.length - 1))]);
                } else if (9 <= roll.length && roll.length < 12) {
                    roll.push(bow[randomIntFromInterval(0, (bow.length - 1))]);
                } else if (12 <= roll.length && roll.length < 15) {
                    roll.push(axes[randomIntFromInterval(0, (axes.length - 1))]);
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

            fs.exists(filePath, async (e) => {
                if (e) {
                    fs.createReadStream(filePath)
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
                            fs.writeFileSync(filePath, parse(dataUser), async function (err) {
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
                    fs.writeFileSync(filePath, parse(dataUser), async function (err) {
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