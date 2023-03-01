'use.strict'

const { Client, Collection, GatewayIntentBits, ActivityType, Events, Partials, REST, Routes } = require('discord.js'),
    axios = require('axios'),
    fs = require('node:fs'),
    path = require('node:path'),
    packageVersion = require('../package.json'),
    { prefix, token, owner, client } = require('../config.json'),
    { clientId, identity } = require('./config.json'),
    { fr, en, uk } = require('../resx/lang.json'),
    { memes } = require('../resx/memes.json'),
    { sendEmbed, messageErase, getCurrentDatetime, randomIntFromInterval } = require('./function.js');

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions
];
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
const rest = new REST({ version: '10' }).setToken(token);

class DaftBot {
    constructor() {
        this.dbClient = new Client({ intents: intents, partials: partials });

        this.dbClient.command = new Collection();
        this.dbClient.mobbot = new Collection();
        this.dbClient.response = new Collection();
        this.dbClient.slash = new Collection();
        this.commands = [];

        this.date = new Date();
        this.initDateTime = `${(this.date.getUTCHours() + 1) < 10 ? `0${this.date.getUTCHours()}` : this.date.getUTCHours()}:${this.date.getUTCMinutes() < 10 ? `0${this.date.getUTCMinutes()}` : this.date.getUTCMinutes()} - ${this.date.getUTCDate() < 10 ? `0${this.date.getUTCDate()}` : this.date.getUTCDate()}/${this.date.getUTCMonth() < 10 ? `0${this.date.getUTCMonth()}` : this.date.getUTCMonth()}/${this.date.getUTCFullYear()}`;
        this.isMuted = false;
        this.language = this.language == undefined ? fr : this.language;

        this.streamer = 'daftmob';
        this.emojiRoles = ['💜', '❤️', 'looners', 'mandalorian', 'linkitem', 'croisade'];
        this.rolesNames = ['/D/TWITCH', '/D/YOUTUBE', '/D/STALKERS', '/D/CHASSEURS', '/D/HÉROS', '/D/GUERRIERS', '/D/RECRUES'];

        this.avoidBot = ['757970907992948826', '758393470024155186', '758319298325905428'];
        this.userToCheck = ['491907126701064193'];
    };

    async on() {
        this.setCollection();
        await this.setLogin();
        await this.listenGuildNewMember();
        await this.listenMessage();
        await this.setRoles();
    };

    setCollection() {
        // Command Collection
        const commandsPath = path.join(__dirname, '../command');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            var filePath = path.join(commandsPath, file);
            var command = require(filePath);
            if ('data' in command && 'execute' in command) { this.dbClient.command.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_COMMAND] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        // Mobbot Collection
        const mobbotsPath = path.join(__dirname, './command');
        const mobbotFiles = fs.readdirSync(mobbotsPath).filter(file => file.endsWith('.js'));

        for (let file of mobbotFiles) {
            var filePath = path.join(mobbotsPath, file);
            var command = require(filePath);
            if ('data' in command && 'execute' in command) { this.dbClient.mobbot.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_MOBBOT] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        // Slash Collection
        const slashsPath = path.join(__dirname, '../slash');
        const slashFiles = fs.readdirSync(slashsPath).filter(file => file.endsWith('.js'));

        for (let file of slashFiles) {
            var filePath = path.join(slashsPath, file);
            var command = require(filePath);
            if ('data' in command && 'execute' in command) {
                this.dbClient.slash.set(command.data.name, command);
                this.commands.push(command.data.toJSON());
            }
            else { console.log(`[ERROR_FILE_MOBBOT] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        // Response Collection
        const responsesPath = path.join(__dirname, '../response');
        const responseFiles = fs.readdirSync(responsesPath).filter(file => file.endsWith('.js'));

        for (let file of responseFiles) {
            var filePath = path.join(responsesPath, file);
            var command = require(filePath);
            if ('data' in command && 'execute' in command) { this.dbClient.response.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_RESPONSE] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };
    };

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

            this.dbClient.mobbot
                .get('mobbotConnection')
                .execute();
            console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} connect on irc-ws.chat.twitch.tv:443`);

            // if (this.dbClient.user.id == this.avoidBot[1]) return;

            let descpMemory = '',
                urIMemory = '',
                oldDescpMemory = '',
                oldUrIMemory = '',
                message;

            while (true) {
                let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=` + this.streamer, params)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`); });

                if (ax.data.data.length == 0) {
                    descpMemory = '';
                } else {
                    descpMemory = ax.data.data[0].game_name;

                    if (descpMemory != oldDescpMemory && ax.data.data.length == 1) {
                        let guiDot = await axios.get(`https://twitch.tv/${ax.data.data[0].user_login}`);
                        this.dbClient.mobbot
                            .get('livenotif')
                            .execute(message, this.dbClient, this.language, guiDot.data, ax);
                    };
                };

                let fe = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=UCreItrEewfO6IPZYPu4C7pA`)
                    .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error FETCH ${err}`); }),
                    fetched = await fe.text(),
                    published = fetched.split(new RegExp(`(\>[^.]*?\/)`, 'giu'))[37].slice(15, -2),
                    pubDate = new Date(published);
                urIMemory = fetched.split(new RegExp(`(\:[^.]*\<\/)`, 'giu'))[3].split(new RegExp(`(\<[^.]*?\>)`, 'giu'))[10];

                if (new Date(new Date().setHours(new Date().getHours() - 2)) < pubDate && urIMemory != oldUrIMemory) {
                    this.dbClient.mobbot
                        .get('videonotif')
                        .execute(message, this.dbClient, this.language);
                };

                oldUrIMemory = urIMemory;
                oldDescpMemory = descpMemory;
                await new Promise(resolve => setTimeout(resolve, 600 * 1000));
            };
        });

        this.dbClient.on(Events.GuildCreate, async (guild) => { console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} added in : ${guild.name}`); });
        this.dbClient.on(Events.GuildDelete, async (guild) => { console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} removed in : ${guild.name}`); });

        await rest.put(
            Routes.applicationCommands(client),
            { body: this.commands },
        );
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
        this.dbClient.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isCommand()) return;

            var checkCollection;

            this.dbClient.slash.has(interaction.commandName) ? checkCollection = this.dbClient.slash.get(interaction.commandName).data.name : checkCollection = false;

            switch (interaction.commandName) {
                case checkCollection:
                    await this.dbClient.slash
                        .get(interaction.commandName)
                        .execute(interaction, this.dbClient, this.language, this.initDateTime);
                    console.log(`[${getCurrentDatetime('comm')}] ${interaction.member.guild.name} / ${interaction.member.user.username} # ${interaction.commandName}${interaction.options.get("prompt") != undefined ? ` - ${interaction.options.get("prompt").value}` : ''}`);
                    break;
            };
        });

        this.dbClient.on(Events.MessageCreate, async (message) => {
            var args = message.content.slice(prefix.length).trim().split(/ +/),
                command = args.shift().toLowerCase(),
                msg = message.content.toLowerCase(),
                author = message.author.username,
                msgSplit = msg.split(' '),
                checkMobbotCollection,
                checkCollection;

            this.dbClient.mobbot.has(command) ? checkMobbotCollection = this.dbClient.mobbot.get(command).data.name : checkMobbotCollection = false;
            this.dbClient.command.has(command) ? checkCollection = this.dbClient.command.get(command).data.name : checkCollection = false;

            if (message.author.bot) return;

            if (message.content.startsWith(prefix)) {
                switch (command) {
                    case 'feature':
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${this.language.commandAttempt} : (${msg}) / (${author})`);
                        await sendEmbed(message, `${this.language.commandNotFound} ${command}`)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        break;
                    case 'lang':
                        await this.setLanguage(this.dbClient, message, args);
                        break;
                    case 'language':
                        await this.setLanguage(this.dbClient, message, args);
                        break;
                    case 'mute':
                        if (!(message.author.id === owner)) return await sendEmbed(message, this.language.restricted)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        await this.setMute(message, args);
                        break;
                    case checkMobbotCollection:
                        if (!(message.author.id === owner)) return await sendEmbed(message, this.language.restricted)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        await this.dbClient.mobbot
                            .get(command)
                            .execute(message, this.dbClient, this.language);
                        break;
                    case checkCollection:
                        await this.dbClient.command
                            .get(command)
                            .execute(message, this.dbClient, this.language, args, this.initDateTime);
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
                        await this.dbClient.command
                            .get('openai')
                            .execute(this.dbClient, message, this.language);
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                    } catch (err) {
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output openai() : ${err}`);
                    };
                };

                if (this.userToCheck.includes(message.author.id)) {
                    if (Math.random() > .05) return;
                    let userId = message.author.user;
                    try {
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${userId}'s message deleted`);
                        await messageErase(message);
                    } catch (err) {
                        console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't delete ${userId}'s message : ${err}`);
                    };
                };

                for (let word in msgSplit) {
                    if (this.dbClient.response.has(msgSplit[word])) {
                        if (Math.random() > .15) return;
                        try {
                            this.dbClient.response
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
                await sendEmbed(message, this.language.changLang)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });

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
                await sendEmbed(message, this.language.changLang)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });

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
                await sendEmbed(message, this.language.changLang)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });

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
                await sendEmbed(message, this.language.languageNtReco)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
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
                await sendEmbed(message, this.language.botMuted)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                this.isMuted = true;
                return this.isMuted;
            } else if ((action.toLowerCase()) === 'off') {
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                await sendEmbed(message, this.language.botUnmuted)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                this.isMuted = false;
                return this.isMuted;
            } else {
                console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
                await sendEmbed(message, `${this.language.howMute}\n\r*e.g. : ${prefix}mute on*`)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                this.isMuted = false;
                return this.isMuted;
            };
        } else {
            console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
            await sendEmbed(message, `${this.language.howMute}\n\r*e.g. : ${prefix}mute on*`)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
            this.isMuted = false;
            return this.isMuted;
        };
    };

};

exports.DaftBot = DaftBot;