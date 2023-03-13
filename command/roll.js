'use.strict'

const { randomIntFromInterval } = require('../core/utils.js'),
    { zelda: zedIco } = require('../resx/emojis.json');

module.exports = {
    data: {
        name: 'roll',
        description: 'a dynamic roll',
        args: false
    },
    async execute(message, client, language, args, initDateTime) {
        var roll = [],
            result = [],
            item = [],
            earn = [];

        for (let u = 0; u != 15; u++) {
            let _rdm = randomIntFromInterval(0, zedIco.length);
            item.push(client.emojis.cache.find(emoji => emoji.name === zedIco[_rdm]));
        };

        try {
            for (let i = 0; i != 15; i++) {
                roll.push(item[randomIntFromInterval(0, item.length - 1)]);
                if (roll.length % 3 == 0) {
                    let y = i - 1,
                        ii = i - 2;
                    if (roll[i].name == roll[y].name && roll[i].name == roll[ii].name) {
                        result.push('☑️');
                        earn.push(roll[i].name.split('_').join(' '));
                    } else { result.push('❌'); };
                };
            };
        } catch (err) { message.channel.send(`${message.author.username}: ${language.error}`); };

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
                if (earn.length != 0) { msg.channel.send(`${message.author.username}: ${language.winRoll} **${earn}** !`); }
                else { msg.channel.send(`${message.author.username}: ${language.lossRoll}`); };
            });

        await new Promise(resolve => setTimeout(resolve, 2 * 1000));
    }
};