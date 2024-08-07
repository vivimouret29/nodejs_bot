'use.strict'

const { randomIntFromInterval, getCurrentDatetime, getTimeRemaining } = require('../core/utils.js'),
    csvParse = require('fast-csv'),
    fs = require('node:fs'),
    moment = require('moment-timezone'),
    { Armors } = require('../core/classes/armors.js'),
    { parse } = require('json2csv');

const filePathUser = `./data/user_roll.csv`;
const filePathInventory = `./data/arm_inventory_user_roll.csv`;
const armors = new Armors();

module.exports = {
    data: {
        name: 'rollarmors',
        description: 'a dynamic roll armors',
        args: false
    },
    async execute(message, client, language, user, args, initDateTime) {
        if (!user.canroll) {
            let duration = getTimeRemaining(user.lastroll);
            return message.channel.send(
                `${message.author.username}: ${language.rollWait} **${duration.hours} ${language.hours} ${duration.minutes} ${language.minutes} ${duration.seconds} ${language.seconds}**`
            );
        };

        var roll = [],
            result = [],
            earn = [],
            earnCsv = [],
            dataUser = [];

        try {
            armors.setPreRoll(client);

            var head = armors.roll.head,
                body = armors.roll.body,
                legs = armors.roll.legs;

            for (let i = 0; i < 15; i++) {
                if (roll.length < 3) {
                    roll.push(await head[randomIntFromInterval(0, (head.length - 1))].cache);
                } else if (3 <= roll.length && roll.length < 6) {
                    roll.push(await body[randomIntFromInterval(0, (body.length - 1))].cache);
                } else if (6 <= roll.length && roll.length < 9) {
                    roll.push(await body[randomIntFromInterval(0, (body.length - 1))].cache);
                } else if (9 <= roll.length && roll.length < 12) {
                    roll.push(await legs[randomIntFromInterval(0, (legs.length - 1))].cache);
                } else if (12 <= roll.length && roll.length < 15) {
                    roll.push(await legs[randomIntFromInterval(0, (legs.length - 1))].cache);
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
            return message.channel
                .send(`${language.errorRoll}`)
                .then(() => {
                    console.log(`[${getCurrentDatetime('comm')}] Error roll algo ${err}`);
                });
        };

        if (earnCsv.length != 0) {
            for (let i = 0; i < earnCsv.length; i++) {
                dataUser.push({
                    'id': Number(message.author.id),
                    'user': String(message.author.username),
                    'inventory': String(earnCsv[i])
                });
            };

            fs.exists(filePathInventory, (e) => {
                if (e) {
                    fs.createReadStream(filePathInventory)
                        .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
                        .on('data', row => {
                            if (row.id != 'id') {
                                dataUser.push({
                                    'id': Number(row.id),
                                    'user': String(row.user),
                                    'inventory': String(row.inventory)
                                });
                            };
                        })
                        .on('end', () => {
                            fs.writeFileSync(filePathInventory, parse(dataUser), function (err) {
                                if (err) {
                                    message.channel.send(`${language.errorRoll}`);
                                    console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username}'s inventory error save ${err}`);
                                    throw err;
                                } else {
                                    console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username}'s inventory save`);
                                };
                            });
                        });
                } else {
                    fs.writeFileSync(filePathInventory, parse(dataUser), function (err) {
                        if (err) {
                            message.channel.send(`${language.errorRoll}`);
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username}'s inventory error save ${err}`);
                            throw err;
                        } else {
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username}'s inventory save`);
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
                            'platform': String(row.platform),
                            'pseudo': String(row.pseudo),
                            'rubis': Number(row.rubis),
                            'canroll': false,
                            'roll': Number(row.roll) + 1,
                            'lastroll': String(moment().tz('Europe/Paris').subtract(-14, 'hours').format()),
                            'dailyroll': String(row.dailyroll),
                            'canwork': row.canwork == 'true' ? true : false,
                            'claimwork': String(row.claimwork),
                            'worktime': Number(row.worktime),
                            'guildid': String(row.guildid)
                        });
                    } else {
                        usersProperty.push({
                            'id': Number(row.id),
                            'username': String(row.username),
                            'platform': String(row.platform),
                            'pseudo': String(row.pseudo),
                            'rubis': Number(row.rubis),
                            'canroll': true,
                            'roll': Number(row.roll) + 1,
                            'lastroll': String(moment().tz('Europe/Paris').format(row.lastroll)),
                            'dailyroll': String(row.dailyroll),
                            'canwork': row.canwork == 'true' ? true : false,
                            'claimwork': String(row.claimwork),
                            'worktime': Number(row.worktime),
                            'guildid': String(row.guildid)
                        });
                    };
                } else {
                    usersProperty.push({
                        'id': Number(row.id),
                        'username': String(row.username),
                        'platform': String(row.platform),
                        'pseudo': String(row.pseudo),
                        'rubis': Number(row.rubis),
                        'canroll': row.canroll == 'true' ? true : false,
                        'roll': Number(row.roll),
                        'lastroll': String(moment().tz('Europe/Paris').format(row.lastroll)),
                        'dailyroll': String(row.dailyroll),
                        'canwork': row.canwork == 'true' ? true : false,
                        'claimwork': String(row.claimwork),
                        'worktime': Number(row.worktime),
                        'guildid': String(row.guildid)
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

        message.channel
            .send(
                fi_line + '\n' +
                se_line + '\n' +
                th_line + '\n' +
                fo_line + '\n' +
                ff_line
            )
            .then(msg => {
                switch (earn.length) {
                    case 1:
                        msg.channel.send(`${message.author.username}: ${language.winRoll} **${earn}** !`);
                        break;
                    case 2:
                        msg.channel.send(`${message.author.username}: ${language.winRoll} **${earn[0]}** !\n${language.winRoll2} **${earn[1]}** !!!`);
                        break;
                    case 3:
                        msg.channel.send(`${message.author.username}: ${language.winRoll3} **${earn[0]}** + **${earn[1]}** + **${earn[2]}** WTFFF ...`);
                        break;
                    case 4:
                        msg.channel.send(`${message.author.username}: ${language.winRoll41} **${earn[0]}**, **${earn[1]}**, **${earn[2]}**, **${earn[3]}** ${language.winRoll42} .....`);
                        break;
                    case 5:
                        msg.channel.send(`${message.author.username}: **${earn[0]}**, **${earn[1]}**, **${earn[2]}**, **${earn[3]}**, **${earn[4]}** ${language.winRoll5}`);
                        break;
                    default:
                        msg.channel.send(`${message.author.username}: ${language.lossRoll}`);
                        break;
                };
            });
    }
};