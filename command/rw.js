'use.strict'

const { randomIntFromInterval, getCurrentDatetime } = require('../core/utils.js'),
    fs = require('node:fs'),
    { parse } = require('json2csv'),
    csvParse = require('fast-csv'),
    { Weapons } = require('../core/classes/weapons.js');

const filePathInventory = `./data/inventory_user_roll.csv`;
const weapons = new Weapons();

module.exports = {
    data: {
        name: 'rw',
        description: 'a dynamic roll weapons',
        args: false
    },
    async execute(message, client, language, args, initDateTime) {
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
            return message.channel
                .send(`${language.errorRoll}`)
                .then(() => {
                    console.log(`[${getCurrentDatetime('comm')}] Error roll algo ${err}`);
                });
        };

        if (earnCsv.length != 0) {
            for (let i = 0; i < earnCsv.length; i++) {
                let data = {
                    'id': Number(message.author.id),
                    'user': String(message.author.username),
                    'inventory': String(earnCsv[i])
                };

                dataUser.push(data);
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