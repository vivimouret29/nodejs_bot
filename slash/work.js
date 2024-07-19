'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { getCurrentDatetime, randomIntFromInterval, getTimeRemaining, randomColor } = require('../core/utils.js'),
    csvParse = require('fast-csv'),
    fs = require('node:fs'),
    moment = require('moment-timezone'),
    { parse } = require('json2csv');

const filePathUser = `./data/user_roll.csv`;

async function messageEmbed(message, content) {
    var messageToSend = await message
        .reply({
            'channel_id': message.channel.channel_id,
            'tts': false,
            'embeds': [{
                'type': 'rich',
                'title': '',
                'description': content,
                'color': randomColor()
            }],
            'ephemeral': false
        });

    return messageToSend;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Travailles et récupères des rubis en échange !')
        .addStringOption(option => {
            return option.setName('claim')
                .setDescription('Récupères la récompense de ton labeur en écrivant \'claim\'')
                .setRequired(false)
        }),
    async execute(message, client, language, user, initDateTime) {
        let userWorking,
            value = false,
            fsToParse = false,
            claimWork = randomIntFromInterval(50, 750);

        if (message.options.get("claim") != null) { value = true; };

        switch (value) {
            case true:
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
                    await messageEmbed(message, `<@${message.user.id}>, ${language.workDone} **${claimWork}** ${client.emojis.cache.find(emoji => emoji.name === 'rubis')} !`)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': false });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                    break;
                } else {
                    if (user.canwork) {
                        await messageEmbed(message, `${language.workNotStar} <@${message.user.id}>`)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': false });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        break;
                    } else if (!user.canwork && moment().tz('Europe/Paris').format() < moment(user.claimwork).tz('Europe/Paris').format()) {
                        let duration = getTimeRemaining(user.claimwork);
                        await messageEmbed(message, `<@${message.user.id}>, ${language.workNotFinish} **${duration.hours} ${language.hours} ${duration.minutes} ${language.minutes} ${duration.seconds} ${language.seconds}** ${language.workNotFinishYet}`)
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
                    await messageEmbed(message, `<@${message.user.id}>, ${language.workStarted} !`)
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
                    await messageEmbed(message, `<@${message.user.id}>, ${language.workDone} **${claimWork}** ${client.emojis.cache.find(emoji => emoji.name === 'rubis')} !
${language.workStartAgain} !`)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': false });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });
                    break;
                } else if (!user.canwork && moment().tz('Europe/Paris').format() < moment(user.claimwork).tz('Europe/Paris').format()) {
                    let duration = getTimeRemaining(user.claimwork);
                    await messageEmbed(message,
                        `<@${message.user.id}>, ${language.workNotOver} **${duration.hours} ${language.hours} ${duration.minutes} ${language.minutes} ${duration.seconds} ${language.seconds}**`)
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
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${message.user.username}'s error save ${err}`);
                            throw err;
                        };
                    });
                });
        };
    }
};