'use.strict'

const { Client, Collection, IntentsBitField, ActivityType, Events, Partials } = require('discord.js'),
    axios = require('axios'),
    packageVersion = require('../package.json'),
    { prefix, token, owner } = require('../config.json'),
    { clientId, identity } = require('./config.json'),
    { fr, en, uk } = require('../resx/lang.json'),
    { memes } = require('../resx/memes.json'),
    { sendEmbed, getCurrentDatetime, randomIntFromInterval } = require('./function.js'),
    mobbotFile = require('./mobbot.js'),
    commandFile = require('../app/command.js'),
    responseFile = require('../app/response.js'),
    clientFile = require('../app/client.js'),
    reactionFile = require('../app/reaction.js'),
    openaiFile = require('../app/openai.js');

const intents = new IntentsBitField();
intents.add(
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.MessageContent
);
const params = {
    headers: {
        Authorization: `Bearer ${identity.password}`,
        'Client-ID': clientId
    }
};
const partials = [
    Partials.Channel,
    Partials.Emoji,
    Partials.Guild,
    Partials.Integration,
    Partials.Invite,
    Partials.GuildMember,
    Partials.Message,
    Partials.Presence,
    Partials.ThreadChannel,
    Partials.ThreadMember,
    Partials.Reaction,
    Partials.Role,
    Partials.User
];

class DaftBot {
    constructor() {
        this.dbClient = new Client({ intents: intents, partials: partials });

        this.collectionCommands = new Collection();
        this.collectionMobbot = new Collection();
        this.collectionClient = new Collection();
        this.collectionResponse = new Collection();
        this.collectionOpenAI = new Collection();
        this.collectionReaction = new Collection();

        this.date = new Date();
        this.initDateTime = `${(this.date.getUTCHours() + 1) < 10 ? `0${this.date.getUTCHours()}` : this.date.getUTCHours()}:${this.date.getUTCMinutes() < 10 ? `0${this.date.getUTCMinutes()}` : this.date.getUTCMinutes()} - ${this.date.getUTCDate() < 10 ? `0${this.date.getUTCDate()}` : this.date.getUTCDate()}/${this.date.getUTCMonth() < 10 ? `0${this.date.getUTCMonth()}` : this.date.getUTCMonth()}/${this.date.getUTCFullYear()}`;
        this.isMuted = false;
        this.language = this.language == undefined ? fr : this.language;

        this.streamer = 'daftmob';

        this.emojiRoles = ['💜', '❤️', 'looners', 'mandalorian', 'linkitem', 'croisade'];
        this.rolesNames = ['/D/TWITCH', '/D/YOUTUBE', '/D/STALKERS', '/D/CHASSEURS', '/D/HÉROS', '/D/GUERRIERS', '/D/RECRUES'];
        this.avoidBot = ['757970907992948826', '758393470024155186', '758319298325905428'];
        this.channelToAvoid = ['948894919878123573'];
        this.userToCheck = ['491907126701064193'];
    };

    async on() {
        this.setCollection()
        await this.setLogin();
        await this.listenGuildNewMember();
        await this.listenMessage();
        await this.setRoles();
    };

    setCollection() {
        // Command Collection
        this.collectionCommands.set(commandFile.version.name, commandFile.version);
        this.collectionCommands.set(commandFile.say.name, commandFile.say);
        this.collectionCommands.set(commandFile.purge.name, commandFile.purge);
        this.collectionCommands.set(commandFile.imagine.name, commandFile.imagine);
        this.collectionCommands.set(commandFile.ping.name, commandFile.ping);
        this.collectionCommands.set(commandFile.invit.name, commandFile.invit);

        // Mobbot Collection
        this.collectionMobbot.set(mobbotFile.mobbot.name, mobbotFile.mobbot);
        this.collectionMobbot.set(mobbotFile.exportmobbot.name, mobbotFile.exportmobbot);
        this.collectionMobbot.set(mobbotFile.livenotif.name, mobbotFile.livenotif);

        // Client Collection
        this.collectionClient.set(clientFile.help.name, clientFile.help);
        this.collectionClient.set(clientFile.guild.name, clientFile.guild);
        this.collectionClient.set(clientFile.uptime.name, clientFile.uptime);
        this.collectionClient.set(clientFile.status.name, clientFile.status);
        this.collectionClient.set(clientFile.poll.name, clientFile.poll);
        this.collectionClient.set(clientFile.kill.name, clientFile.kill);
        this.collectionClient.set(clientFile.reset.name, clientFile.reset);

        // Reply Collection
        this.collectionResponse.set(responseFile.daftbot.name, responseFile.daftbot);
        this.collectionResponse.set(responseFile.laugh.name, responseFile.laugh);
        this.collectionResponse.set(responseFile.yes.name, responseFile.yes);
        this.collectionResponse.set(responseFile.no.name, responseFile.no);
        this.collectionResponse.set(responseFile.mais.name, responseFile.mais);
        this.collectionResponse.set(responseFile.tqt.name, responseFile.tqt);

        // OpenAI Collection
        this.collectionOpenAI.set(openaiFile.openai.name, openaiFile.openai);

        // Reaction Collection
        this.collectionReaction.set(reactionFile.trashtalk.name, reactionFile.trashtalk);
    }

    async setLogin() {
        this.dbClient
            .login(token)
            .then(() => console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username}\'s logged
[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} v${packageVersion.version}`))
            .catch(console.error);

        this.dbClient.on(Events.ClientReady, async () => {
            this.dbClient.user.setPresence({
                activities: [{
                    name: this.language.activities,
                    type: ActivityType.Watching
                }],
                status: 'online'
            });
            console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} present in : `, this.dbClient.guilds.cache.map(guild => guild.name));

            this.collectionMobbot
                .get('mobbotConnection')
                .execute();
            console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} connect on irc-ws.chat.twitch.tv:443`);

            if (this.dbClient.user.id == this.avoidBot[1]) return;

            let descpMemory = '',
                oldDescpMemory = '';

            while (true) {
                let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=` + this.streamer, params)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`); });

                if (ax.data.data.length == 0) {
                    descpMemory = '';
                } else {
                    descpMemory = ax.data.data[0].title;

                    if (descpMemory != oldDescpMemory && ax.data.data.length == 1) {
                        let guiDot = await axios.get(`https://twitch.tv/${ax.data.data[0].user_login}`);
                        this.collectionMobbot
                            .get('livenotif')
                            .execute(this.dbClient, this.language, guiDot, ax);
                    };
                };

                oldDescpMemory = descpMemory;
                await new Promise(resolve => setTimeout(resolve, 300 * 1000));
            };
        });

        this.dbClient.on(Events.GuildCreate, async (guild) => { console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} added in : ${guild.name}`); });

        this.dbClient.on(Events.GuildDelete, async (guild) => { console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} removed in : ${guild.name}`); });

    };

    async listenGuildNewMember() {
        this.dbClient.on(Events.GuildMemberAdd, async (guild) => {
            if (this.dbClient.user.id == this.avoidBot[1] || guild.id != '948894919878123570') return;
            console.log(`[${getCurrentDatetime('comm')}] New member \'${guild.user.username}\' join server : ${guild.guild.name}`);

            this.dbClient.channels.cache
                .get(guild.guild.systemChannelId)
                .send({
                    'channel_id': guild.guild.systemChannelId,
                    'content': '',
                    'tts': false,
                    'embeds': [{
                        'type': 'rich',
                        'title': `${guild.user.username} ${language.guildJoin}`,
                        'description': this.language.guildJoinDesc,
                        'color': 0x890b0b,
                        'image': {
                            'url': memes[randomIntFromInterval(0, (memes.length - 1))]
                        },
                        'thumbnail': {
                            'url': this.dbClient.users.cache.get(guild.user.id).avatarURL({ format: 'png', dynamic: true, size: 1024 })
                        },
                        'author': {
                            'name': this.dbClient.user.username,
                            'icon_url': this.dbClient.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                        }
                    }]
                })
                .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error GuildMemberAdd send() ${err}`); });
        });
    };

    async listenMessage() {
        this.dbClient.on(Events.MessageCreate, async (message) => {
            var args = message.content.slice(prefix.length).trim().split(/ +/),
                command = args.shift().toLowerCase(),
                msg = message.content.toLowerCase(),
                author = message.author.username,
                msgSplit = msg.split(' '),
                checkMobbotCollection,
                checkCollection,
                checkClientCollection;

            this.collectionMobbot.has(command) ? checkMobbotCollection = this.collectionMobbot.get(command).name : checkMobbotCollection = false;
            this.collectionCommands.has(command) ? checkCollection = this.collectionCommands.get(command).name : checkCollection = false;
            this.collectionClient.has(command) ? checkClientCollection = this.collectionClient.get(command).name : checkClientCollection = false;

            if (message.author.bot) return;

            if (message.content.startsWith(prefix)) {
                switch (command) {
                    case 'feature':
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${this.language.commandAttempt} : (${msg}) / (${author})`);
                        await sendEmbed(message, `${this.language.commandNotFound} ${command}`);
                        break;
                    case 'lang':
                        await this.setLanguage(this.dbClient, message, args);
                        break;
                    case 'language':
                        await this.setLanguage(this.dbClient, message, args);
                        break;
                    case 'mute':
                        if (!(message.author.id === owner)) return await sendEmbed(message, this.language.restricted);
                        await this.setMute(message, args);
                        break;
                    case checkMobbotCollection:
                        if (!(message.author.id === owner)) return await sendEmbed(message, this.language.restricted);
                        await this.collectionMobbot
                            .get(command)
                            .execute(message, this.dbClient.emojis);
                        break;
                    case checkClientCollection:
                        await this.collectionClient
                            .get(command)
                            .execute(message, this.dbClient, this.language, this.initDateTime, args);
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                        if (checkClientCollection == 'guild') { console.log(`[${getCurrentDatetime('comm')}] `, this.dbClient.guilds.cache.map(guild => guild.name)) };
                        break;
                    case checkCollection:
                        await this.collectionCommands
                            .get(command)
                            .execute(message, args, this.language);
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                        break;
                };
            };

            if (message.author.id == owner) {
                if (Math.random() < .05) {
                    let dio = this.dbClient.emojis.cache.find(emoji => emoji.name === 'dio_sama');
                    if (dio == undefined) return console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Dio Sama not found here`);
                    message.react(dio);
                };
            };

            if (this.isMuted) return;

            if (!message.content.startsWith(prefix)) {
                if ((message.mentions.has(this.dbClient.user.id)) && !(message.channel.messages.cache.get(message.id).mentions.everyone)) {
                    try {
                        await this.collectionOpenAI
                            .get('openai')
                            .execute(this.dbClient, message, this.language);
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                    } catch (err) {
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output openai() : ${err}`);
                    };
                };

                if (this.avoidBot.includes(message.author.id) && !(this.channelToAvoid.includes(message.channel.id))) {
                    if (Math.random() > .025) {
                        try {
                            this.collectionReaction
                                .get('trashtalk')
                                .execute(message);
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}
[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${this.dbClient.user.username} used (or not) a trashtalk`);
                        } catch (err) {
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output randomCollection() : ${err}`);
                        };
                    };
                };

                if (this.userToCheck.includes(message.author.id)) {
                    if (Math.random() > .05) return;
                    let userId = message.author.user;
                    try {
                        message.delete().catch(O_o => { });
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${userId}'s message deleted`);
                    } catch (err) {
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't delete ${userId}'s message : ${err}`);
                    };
                };

                for (let word in msgSplit) {
                    if (this.collectionResponse.has(msgSplit[word])) {
                        if (Math.random() > .15) return;
                        try {
                            this.collectionResponse
                                .get(msgSplit[word])
                                .execute(message, args, this.language);
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                        } catch (err) {
                            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output reply() : ${err}`);
                        };
                        return;
                    };
                };
            };
        });
    };

    async setRoles() {
        this.dbClient.on(Events.MessageReactionAdd, async (react, user) => {
            var roChan = '1068559351570247741',
                roMsg = '1071286935726854216',
                emoji = react.emoji.name,
                channel = this.dbClient.channels.cache.get(react.message.channelId),
                messageId = react.message.id,
                message = channel.messages.cache.get(messageId),
                guild = this.dbClient.guilds.cache.get(channel.guildId);

            if (message.channelId == roChan && message.id == roMsg && this.emojiRoles.includes(emoji)) {
                switch (emoji) {
                    case '💜':
                        await this.switchRoles(this.dbClient, guild, user.id, 0, true);
                        break;
                    case '❤️':
                        await this.switchRoles(this.dbClient, guild, user.id, 1, true);
                        break;
                    case 'looners':
                        await this.switchRoles(this.dbClient, guild, user.id, 2, true);
                        break;
                    case 'mandalorian':
                        await this.switchRoles(this.dbClient, guild, user.id, 3, true);
                        break;
                    case 'linkitem':
                        await this.switchRoles(this.dbClient, guild, user.id, 4, true);
                        break;
                    case 'croisade':
                        await this.switchRoles(this.dbClient, guild, user.id, 5, true);
                        break;
                };
            };

            var reChan = '1068557736306024519',
                reMsg = ['1077008507724890122', '1077008635865088110'],
                messageIdReg = react.message.id,
                messageReg = channel.messages.cache.get(messageIdReg);

            if (messageReg.channelId == reChan && reMsg.includes(message.id)) {
                await this.switchRoles(this.dbClient, guild, user.id, 6, true);
                console.log(`[${getCurrentDatetime('comm')}] ${guild.name} / ${channel.name} # ${user.username} read the reglement`);
            };
        });

        this.dbClient.on(Events.MessageReactionRemove, async (react, user) => {
            var rChan = '1068559351570247741',
                rMsg = '1071286935726854216',
                emoji = react.emoji.name,
                channel = this.dbClient.channels.cache.get(react.message.channelId),
                messageId = react.message.id,
                message = channel.messages.cache.get(messageId),
                guild = this.dbClient.guilds.cache.get(channel.guildId);

            if (message.channelId == rChan && message.id == rMsg && this.emojiRoles.includes(emoji)) {
                switch (emoji) {
                    case '💜':
                        await this.switchRoles(this.dbClient, guild, user.id, 0, false);
                        break;
                    case '❤️':
                        await this.switchRoles(this.dbClient, guild, user.id, 1, false);
                        break;
                    case 'looners':
                        await this.switchRoles(this.dbClient, guild, user.id, 2, false);
                        break;
                    case 'mandalorian':
                        await this.switchRoles(this.dbClient, guild, user.id, 3, false);
                        break;
                    case 'linkitem':
                        await this.switchRoles(this.dbClient, guild, user.id, 4, false);
                        break;
                    case 'croisade':
                        await this.switchRoles(this.dbClient, guild, user.id, 5, false);
                        break;
                };
            };
        });
    };

    async switchRoles(client, guild, userId, roleIndex, style) {
        var role = await client.guilds.cache.find(s => s.name == guild.name).roles.cache.find(r => r.name == this.rolesNames[roleIndex]),
            user = await client.guilds.cache.find(s => s.name == guild.name).members.cache.get(userId);

        switch (style) {
            case true:
                if (!(role.members.has(user.id))) {
                    try {
                        await user.roles.add(role);
                        console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} get ${role.name}`);
                    } catch (error) {
                        console.log(`[${getCurrentDatetime('comm')}] Error when assigning the role ${role.name} to ${user.user.username} : ${error}`);
                    };
                } else {
                    await user.send(this.language.addRole)
                        .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error author.send() ${err}`); });
                    console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} already have the role ${role.name}`);
                };
                break;
            case false:
                if (role.members.has(user.id)) {
                    try {
                        await user.roles.remove(role);
                        console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} remove ${role.name}`);
                    } catch (error) {
                        console.log(`[${getCurrentDatetime('comm')}] Error when unassigning the role ${role.name} to ${user.user.username} : ${error}`);
                    };
                } else {
                    awaituser.send(this.language.remRole)
                        .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error author.send() ${err}`); });
                    console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} have not the role ${role.name}`);
                };
                break;
        };
    };

    async setLanguage(client, message, args) {
        let msg = message.content.toLowerCase(),
            author = message.author.username;

        switch (args[0]) {
            case 'fr':
                this.language = fr;
                await sendEmbed(message, this.language.changLang);

                client.user.setPresence({
                    activities: [{
                        name: this.language.activities,
                        type: ActivityType.Watching
                    }],
                    status: 'online'
                });

                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                break;
            case 'en':
                this.language = en;
                await sendEmbed(message, this.language.changLang);

                client.user.setPresence({
                    activities: [{
                        name: this.language.activities,
                        type: ActivityType.Watching
                    }],
                    status: 'online'
                });

                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                break;
            case 'uk':
                this.language = uk;
                await sendEmbed(message, this.language.changLang);

                client.user.setPresence({
                    activities: [{
                        name: this.language.activities,
                        type: ActivityType.Watching
                    }],
                    status: 'online'
                });

                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                break;
            default:
                await sendEmbed(message, this.language.languageNtReco);
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                break;
        };
    };

    async setMute(message, args) {
        let action = args[0],
            msg = message.content.toLowerCase(),
            author = message.author.username;

        if (action != undefined) {
            if ((action.toLowerCase()) === 'on') {
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                await sendEmbed(message, this.language.botMuted);
                this.isMuted = true;
                return this.isMuted;
            } else if ((action.toLowerCase()) === 'off') {
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                await sendEmbed(message, this.language.botUnmuted);
                this.isMuted = false;
                return this.isMuted;
            } else {
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                await sendEmbed(message, `${this.language.howMute}\n\r*e.g. : ${prefix}mute on*`);
                this.isMuted = false;
                return this.isMuted;
            };
        } else {
            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
            await sendEmbed(message, `${this.language.howMute}\n\r*e.g. : ${prefix}mute on*`);
            this.isMuted = false;
            return this.isMuted;
        };
    };

};

exports.DaftBot = DaftBot;