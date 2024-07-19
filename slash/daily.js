'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { getCurrentDatetime, randomIntFromInterval, getTimeRemaining, randomColor } = require('../core/utils.js'),
    csvParse = require('fast-csv'),
    fs = require('node:fs'),
    moment = require('moment-timezone'),
    { parse } = require('json2csv');

const filePathUser = `./data/user_roll.csv`;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Récupères ta récompense journalière !'),
    async execute(message, client, language, user, args, initDateTime) {
        if (moment(user.dailyroll).tz('Europe/Paris').format() < moment().tz('Europe/Paris').format()) {
            let updateDailyRoll = moment().tz('Europe/Paris').add(22, 'hours').format(),
                winday = randomIntFromInterval(250, 1200),
                text = `${language.dailyreward} !
<@${message.user.id}>, ${language.dailywin} : **${winday}** ${client.emojis.cache.find(emoji => emoji.name === 'rubis')} !`;

            await message.reply({
                'channel_id': message.channel.channel_id,
                'embeds': [{
                    'type': 'rich',
                    'description': text,
                    'color': randomColor()
                }],
                'fetchReply': false,
                'ephemeral': false
            })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command daily send ${err}`); });

            let usersProperty = [];
            fs.createReadStream(filePathUser)
                .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
                .on('data', row => {
                    usersProperty.push({
                        'id': Number(row.id),
                        'username': String(row.username),
                        'platform': String(row.platform),
                        'pseudo': String(row.pseudo),
                        'rubis': Number(row.rubis) + Number(winday),
                        'canroll': row.canroll == 'true' ? true : false,
                        'roll': Number(row.roll),
                        'lastroll': String(moment(row.lastroll).tz('Europe/Paris').format()),
                        'dailyroll': String(updateDailyRoll),
                        'canwork': row.canwork == 'true' ? true : false,
                        'claimwork': String(row.claimwork),
                        'guildid': String(row.guildid)
                    });
                })
                .on('end', () => {
                    fs.writeFileSync(filePathUser, parse(usersProperty), function (err) {
                        if (err) {
                            message.channel.send(`${language.errorRoll}`);
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username}'s error save ${err}`);
                            throw err;
                        };
                    });
                });
            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username} got ${Number(winday)} for his daily reward`);
        } else if (moment(user.dailyroll).tz('Europe/Paris').format() > moment().tz('Europe/Paris').format()) {
            let duration = getTimeRemaining(user.dailyroll);
            await message.reply({
                'channel_id': message.channel.channel_id,
                'embeds': [{
                    'type': 'rich',
                    'description': `${language.delaydaily} **${duration.hours} ${language.hours} ${duration.minutes} ${language.minutes} ${duration.seconds} ${language.seconds}**`,
                    'color': randomColor()
                }],
                'fetchReply': false,
                'ephemeral': false
            })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command daily send ${err}`); });
            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username} already got his daily`);
        };
    }
};