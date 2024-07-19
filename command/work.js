'use.strict'

const { sendEmbed, getCurrentDatetime, randomIntFromInterval, getTimeRemaining } = require('../core/utils.js'),
    csvParse = require('fast-csv'),
    fs = require('node:fs'),
    moment = require('moment-timezone'),
    { parse } = require('json2csv');

const filePathUser = `./data/user_roll.csv`;

module.exports = {
    data: {
        name: 'work',
        description: 'a dynamic work',
        args: true
    },
    async execute(message, client, language, user, args, initDateTime) {
        let userWorking,
            fsToParse = false,
            claimWork = randomIntFromInterval(50, 750);

        switch (args[0]) {
            case 'claim':
                if (!user.canwork && moment().tz('Europe/Paris').format() > moment(user.claimwork).tz('Europe/Paris').format()) {
                    userWorking = {
                        'id': Number(user.id),
                        'username': String(user.username),
                        'platform': String(user.platform),
                        'pseudo': String(user.pseudo),
                        'rubis': Number(user.rubis) + Number(claimWork),
                        'canroll': Boolean(user.canroll),
                        'roll': Number(user.roll),
                        'lastroll': String(user.lastroll),
                        'dailyroll': String(user.dailyroll),
                        'canwork': true,
                        'claimwork': String(moment().tz('Europe/Paris').format()),
                        'worktime': Number(user.worktime) + 1,
                        'guildid': String(user.guildid)
                    };
                    fsToParse = true;
                    await sendEmbed(message, `<@${message.author.id}>, ${language.workDone} ${claimWork} ${client.emojis.cache.find(emoji => emoji.name === 'rubis')} !`)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': false });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                    break;
                } else {
                    if (user.canwork) {
                        await sendEmbed(message, `${language.workNotStar} <@${message.author.id}>`)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': false });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        break;
                    } else if (!user.canwork && moment().tz('Europe/Paris').format() < moment(user.claimwork).tz('Europe/Paris').format()) {
                        let duration = getTimeRemaining(user.claimwork);
                        await sendEmbed(message, `<@${message.author.id}>, ${language.workNotFinish} **${duration.hours} ${language.hours} ${duration.minutes} ${language.minutes} ${duration.seconds} ${language.seconds}** ${language.workNotFinishYet}`)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': false });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        break;
                    };
                };
                break;
            default:
                if (user.canwork) {
                    userWorking = {
                        'id': Number(user.id),
                        'username': String(user.username),
                        'platform': String(user.platform),
                        'pseudo': String(user.pseudo),
                        'rubis': Number(user.rubis),
                        'canroll': Boolean(user.canroll),
                        'roll': Number(user.roll),
                        'lastroll': String(user.lastroll),
                        'dailyroll': String(user.dailyroll),
                        'canwork': false,
                        'claimwork': String(moment().tz('Europe/Paris').add(2, 'hours').format()),
                        'worktime': Number(user.worktime),
                        'guildid': String(user.guildid)
                    };
                    fsToParse = true;
                    await sendEmbed(message, `<@${message.author.id}>, ${language.workStarted} !`)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': false });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                    break;
                } else if (!user.canwork && moment().tz('Europe/Paris').format() > moment(user.claimwork).tz('Europe/Paris').format()) {
                    userWorking = {
                        'id': Number(user.id),
                        'username': String(user.username),
                        'platform': String(user.platform),
                        'pseudo': String(user.pseudo),
                        'rubis': Number(user.rubis) + Number(claimWork),
                        'canroll': Boolean(user.canroll),
                        'roll': Number(user.roll),
                        'lastroll': String(user.lastroll),
                        'dailyroll': String(user.dailyroll),
                        'canwork': false,
                        'claimwork': String(moment().tz('Europe/Paris').add(2, 'hours').format()),
                        'worktime': Number(user.worktime) + 1,
                        'guildid': String(user.guildid)
                    };
                    fsToParse = true;
                    await sendEmbed(message, `<@${message.author.id}>, ${language.workDone} ${claimWork} ${client.emojis.cache.find(emoji => emoji.name === 'rubis')} !
${language.workStartAgain} !`)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': false });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                    break;
                } else if (!user.canwork && moment().tz('Europe/Paris').format() < moment(user.claimwork).tz('Europe/Paris').format()) {
                    let duration = getTimeRemaining(user.claimwork);
                    await sendEmbed(message,
                        `<@${message.author.id}>, ${language.workNotOver} **${duration.hours} ${language.hours} ${duration.minutes} ${language.minutes} ${duration.seconds} ${language.seconds}**`)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': false });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                    break;
                };
                break;
        };

        if (fsToParse) {
            let usersProperty = [];
            fs.createReadStream(filePathUser)
                .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
                .on('data', row => { if (row.id == user.id) { usersProperty.push(userWorking); }; })
                .on('end', () => {
                    fs.writeFileSync(filePathUser, parse(usersProperty), function (err) {
                        if (err) {
                            message.channel.send(`${language.errorRoll}`);
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.author.username}'s error save ${err}`);
                            throw err;
                        };
                    });
                });
        };
    }
};