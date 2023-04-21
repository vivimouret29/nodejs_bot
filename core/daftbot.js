'use.strict'

const { Client, Collection, GatewayIntentBits, PermissionsBitField, ActivityType, Events, Partials, REST, Routes } = require('discord.js'),
    axios = require('axios'),
    fs = require('node:fs'),
    { parse } = require('json2csv'),
    csvParse = require('fast-csv'),
    path = require('node:path'),
    packageVersion = require('../package.json'),
    { prefix, token, owner, client } = require('../config.json'),
    { clientId, identity, channels } = require('./config.json'),
    { fr, en, uk } = require('../resx/lang.json'),
    { memes } = require('../resx/memes.json'),
    { sendEmbed, messageErase, getCurrentDatetime, randomIntFromInterval } = require('./utils.js'),
    { Admin } = require('../core/classes/admin.js'),
    { User } = require('../core/classes/user.js');

const filePathUser = `./data/user_roll.csv`;
const filePathAdmin = `./data/admin.csv`;
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

        this.ownerCommands = ['export', 'kill', 'reset'];

        this.adminClass = new Admin();
        this.adminsProperty = [];
        this.admin;
        this.adminsCommands = ['guild', 'mute', 'purge', 'status', 'removeadmin'];

        this.userClass = new User();
        this.usersProperty = [];
        this.user;

        this.date = new Date();
        this.initDateTime = `${(this.date.getUTCHours() + 1) < 10 ? `0${this.date.getUTCHours()}` : this.date.getUTCHours()}:${this.date.getUTCMinutes() < 10 ? `0${this.date.getUTCMinutes()}` : this.date.getUTCMinutes()} - ${this.date.getUTCDate() < 10 ? `0${this.date.getUTCDate()}` : this.date.getUTCDate()}/${this.date.getUTCMonth() < 10 ? `0${this.date.getUTCMonth()}` : this.date.getUTCMonth()}/${this.date.getUTCFullYear()}`;
        this.isMuted = false;
        this.language = this.language == undefined ? fr : this.language;

        this.emojiRoles = ['💜', '❤️', 'looners', 'mandalorian', 'linkitem', 'croisade'];
        this.rolesNames = ['/D/TWITCH', '/D/YOUTUBE', '/D/STALKERS', '/D/CHASSEURS', '/D/HÉROS', '/D/GUERRIERS', '/D/RECRUES'];

        this.avoidBot = ['757970907992948826', '758393470024155186', '758319298325905428'];
        this.userToCheck = ['491907126701064193'];

        this.onFirstStart = true;
    };

    async onConnect() {
        await this.setCollection();
        await this.onLogin();
        await this.onListenGuildNewMember();
        await this.onListenMessage();
        await this.setRole();
    };

    async setCollection() {
        // Command Collection
        const commandsPath = path.join(__dirname, '../command'),
            commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            var filePath = path.join(commandsPath, file),
                command = require(filePath);
            if ('data' in command && 'execute' in command) { this.dbClient.command.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_COMMAND] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        // Mobbot Collection
        const mobbotsPath = path.join(__dirname, './command'),
            mobbotFiles = fs.readdirSync(mobbotsPath).filter(file => file.endsWith('.js'));

        for (let file of mobbotFiles) {
            var filePath = path.join(mobbotsPath, file),
                command = require(filePath);
            if ('data' in command && 'execute' in command) { this.dbClient.mobbot.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_MOBBOT] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        // Slash Collection
        const slashsPath = path.join(__dirname, '../slash'),
            slashFiles = fs.readdirSync(slashsPath).filter(file => file.endsWith('.js'));

        for (let file of slashFiles) {
            var filePath = path.join(slashsPath, file),
                command = require(filePath);
            if ('data' in command && 'execute' in command) {
                this.dbClient.slash.set(command.data.name, command);
                this.commands.push(command.data.toJSON());
            }
            else { console.log(`[ERROR_FILE_MOBBOT] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };

        // Response Collection
        const responsesPath = path.join(__dirname, '../response'),
            responseFiles = fs.readdirSync(responsesPath).filter(file => file.endsWith('.js'));

        for (let file of responseFiles) {
            var filePath = path.join(responsesPath, file),
                command = require(filePath);
            if ('data' in command && 'execute' in command) { this.dbClient.response.set(command.data.name, command); }
            else { console.log(`[ERROR_FILE_RESPONSE] The command at ${filePath} is missing a required "data" or "execute" property.`); };
        };
    };

    async onLogin() {
        this.dbClient
            .login(token)
            .then(async () => {
                console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username}\'s logged
[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} v${packageVersion.version}`);
                await this.readUserFile();
                await this.readAdminFile();
            })
            .catch(console.error);

        this.dbClient.on(Events.ClientReady, async () => {
            this.dbClient.user.setPresence({
                activities: [{
                    name: this.language.activities,
                    type: ActivityType.Streaming,
                    url: 'https://twitch.tv/daftmob'
                }],
                status: 'online'
            });
            console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} present in : `, this.dbClient.guilds.cache.map(guild => guild.name));

            this.dbClient.mobbot
                .get('mobbotConnection')
                .execute();
            console.log(`[${getCurrentDatetime('comm')}] ${this.dbClient.user.username} connect on irc-ws.chat.twitch.tv:443`);

            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            this.onFirstStart = false;
            if (this.dbClient.user.id == this.avoidBot[1]) return;

            let checkLive = true,
                gameMemory = '',
                urIMemory = '',
                oldGameMemory = '',
                oldUrIMemory = '',
                message;

            while (true) {
                if (channels[0] == undefined) { continue; };

                let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=` + channels[0].slice(1), params)
                    .catch(err => {
                        checkLive = false;
                        console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`);
                    });

                if (ax == undefined) { continue; };

                if (!checkLive || ax.data.data.length == 0) {
                    gameMemory = '';
                } else {
                    gameMemory = ax.data.data[0].game_name;
                    if (gameMemory != oldGameMemory && ax.data.data.length == 1) {
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

                checkLive = true;
                oldUrIMemory = urIMemory;
                oldGameMemory = gameMemory;
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

    async onListenGuildNewMember() {
        this.dbClient.on(Events.GuildMemberAdd, async (guild) => {
            if (this.dbClient.user.id == this.avoidBot[1] || guild.user.bot) return;
            console.log(`[${getCurrentDatetime('comm')}] New member \'${guild.user.username}\' join server : ${guild.guild.name}`);

            this.dbClient.channels.cache
                .get(guild.guild.systemChannelId)
                .send({
                    'channel_id': guild.guild.systemChannelId,
                    'content': '',
                    'tts': false,
                    'embeds': [{
                        'type': 'rich',
                        'title': `${guild.user.username} ${this.language.guildJoin}`,
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

    async onListenMessage() {
        this.dbClient.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isCommand() || interaction.user.bot) return;

            if (this.userClass.getUserProperty(interaction.user.id, this.usersProperty) == undefined) {
                this.user = this.userClass.setUserProperty({
                    'id': Number(interaction.user.id),
                    'username': String(interaction.user.username),
                    'canroll': true,
                    'roll': 0,
                    'lastroll': 0
                });
                await this.writeUserFile(this.user);
                await new Promise(resolve => setTimeout(resolve, 2 * 1000));
                await this.readUserFile();
            } else { this.user = this.userClass.getUserProperty(interaction.user.id, this.usersProperty); };

            if (this.adminClass.getAdminProperty(interaction.user.id, this.adminsProperty) != undefined) {
                this.admin = this.adminClass.getAdminProperty(interaction.user.id, this.adminsProperty);
            } else { this.admin = null; };

            var checkCollection;

            this.dbClient.slash.has(interaction.commandName) ? checkCollection = this.dbClient.slash.get(interaction.commandName).data.name : checkCollection = false;

            switch (interaction.commandName) {
                case checkCollection:
                    if (interaction.member == null) { console.log(`[${getCurrentDatetime('comm')}] ${interaction.user.username}'s DM # ${interaction.commandName}${interaction.options.get("prompt") != undefined ? ` - ${interaction.options.get("prompt").value}` : ''}`); }
                    else { console.log(`[${getCurrentDatetime('comm')}] ${interaction.member.guild.name} / ${interaction.user.username} # ${interaction.commandName}${interaction.options.get("prompt") != undefined ? ` - ${interaction.options.get("prompt").value}` : ''}`); };
                    await this.dbClient.slash
                        .get(interaction.commandName)
                        .execute(interaction, this.dbClient, this.language, this.user, this.initDateTime);
                    await new Promise(resolve => setTimeout(resolve, 2 * 1000));
                    if (checkCollection == 'rw' || checkCollection == 'rollweapons') { await this.readUserFile(); };
                    break;
            };
        });

        this.dbClient.on(Events.MessageCreate, async (message) => {
            if (message.author.bot) return;

            if (this.userClass.getUserProperty(message.author.id, this.usersProperty) == undefined) {
                this.user = this.userClass.setUserProperty({
                    'id': Number(message.author.id),
                    'username': String(message.author.username),
                    'canroll': true,
                    'roll': 0,
                    'lastroll': 0
                });
                await this.writeUserFile(this.user);
                await new Promise(resolve => setTimeout(resolve, 2 * 1000));
                await this.readUserFile();
            } else { this.user = this.userClass.getUserProperty(message.author.id, this.usersProperty); };

            if (this.adminClass.getAdminProperty(message.author.id, this.adminsProperty) != undefined) {
                this.admin = this.adminClass.getAdminProperty(message.author.id, this.adminsProperty);
            } else { this.admin = null; };

            var args = message.content.slice(prefix.length).trim().split(/ +/),
                command = args.shift().toLowerCase(),
                msg = message.content.toLowerCase(),
                author = message.author.username,
                msgSplit = msg.split(' '),
                checkMobbotCollection,
                checkCollection;

            this.dbClient.mobbot.has(command) ? checkMobbotCollection = this.dbClient.mobbot.get(command).data.name : checkMobbotCollection = false;
            this.dbClient.command.has(command) ? checkCollection = this.dbClient.command.get(command).data.name : checkCollection = false;

            if (message.content.startsWith(prefix)) {
                if (message.author.id != owner) {
                    if (this.admin == null && this.adminsCommands.includes(command)) {
                        return await sendEmbed(message, this.language.adminRestricted)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                    } else if (this.admin == null && !(this.adminsCommands.includes(command))) {
                        // do nothing, you can pass
                    } else if (this.admin.guild != Number(message.guildId)) {
                        return await sendEmbed(message, this.language.adminGuildRestricted)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                    } else if (this.admin != null && this.ownerCommands.includes(command)) return await sendEmbed(message, this.language.adminCommandRestricted)
                        .catch(err => {
                            message.reply({ 'content': language.error, 'ephemeral': true });
                            console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                        });

                    if ((!(message.author.id === owner) && this.ownerCommands.includes(command))
                        || (!(message.author.id === owner) && this.adminsCommands.includes(command) && this.admin == null)) return await sendEmbed(message, this.language.restricted)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                };

                switch (command) {
                    case 'lang':
                        await this.setLanguage(this.dbClient, message, args);
                        break;
                    case 'language':
                        await this.setLanguage(this.dbClient, message, args);
                        break;
                    case 'mute':
                        await this.setMute(message, args);
                        break;
                    case 'setadmin':
                        await this.setAdmin(message, args);
                        if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                        else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                        break;
                    case 'removeadmin':
                        await this.removeAdmin(message, args);
                        if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                        else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                        break;
                    case checkMobbotCollection:
                        if (!(message.author.id === owner)) return await sendEmbed(message, this.language.restricted)
                            .catch(err => {
                                message.reply({ 'content': language.error, 'ephemeral': true });
                                console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                            });
                        if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                        else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                        await this.dbClient.mobbot
                            .get(command)
                            .execute(message, this.dbClient, this.language);
                        break;
                    case checkCollection:
                        if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                        else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                        await this.dbClient.command
                            .get(command)
                            .execute(message, this.dbClient, this.language, this.user, args, this.initDateTime);
                        await new Promise(resolve => setTimeout(resolve, 2 * 1000));
                        if (checkCollection == 'rw' || checkCollection == 'rollweapons'
                            || checkCollection == 'ra' || checkCollection == 'rollarmors') { await this.readUserFile(); };
                        break;
                };
            };

            if (message.author.id == owner) {
                if (Math.random() < .05) {
                    let dio = this.dbClient.emojis.cache.find(emoji => emoji.name === 'dio_sama');
                    if (dio == undefined) { return console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Dio Sama not found here`); };
                    message.react(dio);
                };
            };

            if (this.isMuted || message.content.startsWith(prefix)) return;

            if ((message.mentions.has(this.dbClient.user.id)) && !(message.channel.messages.cache.get(message.id).mentions.everyone)) {
                try {
                    await this.dbClient.command
                        .get('openai')
                        .execute(this.dbClient, message, this.language);
                    if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                    else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                } catch (err) {
                    if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # Error output openai() : ${err}`); }
                    else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output openai() : ${err}`); };
                };
            };

            if (this.userToCheck.includes(message.author.id)) {
                if (Math.random() > .01) return;
                try {
                    if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${message.content}`); }
                    else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author}'s message '${message.content}' deleted`); };
                    message.channel.send({ 'channel_id': message.channel.channel_id, 'content': `**${author}** a écrit ${message.content}`, 'tts': false });
                    await messageErase(message);
                } catch (err) {
                    if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # Can't delete ${author}'s message : ${err}`); }
                    else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't delete ${author}'s message : ${err}`); };
                };
            };

            for (let word in msgSplit) {
                if (this.dbClient.response.has(msgSplit[word])) {
                    if (Math.random() > .05) return;
                    try {
                        this.dbClient.response
                            .get(msgSplit[word])
                            .execute(message, args, this.language);
                        if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                        else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                    } catch (err) {
                        if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # Error output reply() : ${err}`); }
                        else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output reply() : ${err}`); };
                    };
                };
            };
        });
    };

    async setRole() {
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

    async setAdmin(message, args) {
        let canSet = false,
            userRole = message.guild.members.cache.get(message.author.id).roles.cache.map(role => role),
            user = message.guild.members.cache.get(args[0].slice(2, -1));

        userRole.forEach(async element => {
            if (element.permissions.has(PermissionsBitField.Flags.Administrator)) { canSet = true; };
        });

        if (canSet) {
            if (this.adminClass.getAdminProperty(user.id, this.adminsProperty) == undefined) {
                this.writeAdminFile(user, false);
                await sendEmbed(message, this.language.adminCreated)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
            } else {
                await sendEmbed(message, this.language.adminExisting)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
            };
        } else {
            await sendEmbed(message, this.language.adminRestricted)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };
    };

    async removeAdmin(message, args) {
        let user = message.guild.members.cache.get(args[0].slice(2, -1));

        if (this.adminClass.getAdminProperty(user.id, this.adminsProperty) == undefined) {
            await sendEmbed(message, this.language.adminNotExisting)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        } else {
            this.writeAdminFile(user, true);
            await sendEmbed(message, this.language.adminDeleted)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
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
                        type: ActivityType.Streaming,
                        url: 'https://twitch.tv/daftmob'
                    }],
                    status: 'online'
                });

                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
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
                        type: ActivityType.Streaming,
                        url: 'https://twitch.tv/daftmob'
                    }],
                    status: 'online'
                });

                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
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
                        type: ActivityType.Streaming,
                        url: 'https://twitch.tv/daftmob'
                    }],
                    status: 'online'
                });

                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                break;
            default:
                await sendEmbed(message, this.language.languageNtReco)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                break;
        };
    };

    async setMute(message, args) {
        let action = args[0],
            msg = message.content.toLowerCase(),
            author = message.author.username;

        if (action != undefined) {
            if ((action.toLowerCase()) === 'on') {
                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                await sendEmbed(message, this.language.botMuted)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                this.isMuted = true;
                return this.isMuted;
            } else if ((action.toLowerCase()) === 'off') {
                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                await sendEmbed(message, this.language.botUnmuted)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                this.isMuted = false;
                return this.isMuted;
            } else {
                if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
                else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
                await sendEmbed(message, `${this.language.howMute}\n\r*e.g. : ${prefix}mute on*`)
                    .catch(err => {
                        message.reply({ 'content': language.error, 'ephemeral': true });
                        console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                    });
                this.isMuted = false;
                return this.isMuted;
            };
        } else {
            if (message.guild == null && message.channel.name == undefined) { console.log(`[${getCurrentDatetime('comm')}] ${author}'s DM # ${msg}`); }
            else { console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`); };
            await sendEmbed(message, `${this.language.howMute}\n\r*e.g. : ${prefix}mute on*`)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
            this.isMuted = false;
            return this.isMuted;
        };
    };

    async readUserFile() {
        this.usersProperty = [];
        await fs.createReadStream(filePathUser)
            .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
            .on('data', row => {
                if (row.id != 'id') {
                    let user;
                    if (new Date(Number(row.lastroll)) > new Date(Date.now())) {
                        user = this.userClass.setUserProperty({
                            'id': Number(row.id),
                            'username': String(row.username),
                            'canroll': false,
                            'roll': Number(row.roll),
                            'lastroll': Number(row.lastroll)
                        });
                    } else {
                        user = this.userClass.setUserProperty({
                            'id': Number(row.id),
                            'username': String(row.username),
                            'canroll': true,
                            'roll': Number(row.roll),
                            'lastroll': Number(row.lastroll)
                        });
                    };

                    this.usersProperty.push({
                        "key": Number(user.id),
                        "value": user
                    });
                };
            })
            .on('end', () => {
                if (this.onFirstStart) {
                    console.log(`[${getCurrentDatetime('comm')}] CSV file successfully processed with ${this.usersProperty.length} users`);
                };
            });
    };

    async writeUserFile(user) {
        let userToSave = [{
            'id': Number(user.id),
            'username': String(user.username),
            'canroll': Boolean(user.canroll),
            'roll': Number(user.roll),
            'lastroll': Number(user.lastroll)
        }];

        await fs.createReadStream(filePathUser)
            .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
            .on('data', row => {
                if (row.id != 'id') {
                    userToSave.push({
                        'id': Number(row.id),
                        'username': String(row.username),
                        'canroll': row.canroll == 'true' ? true : false,
                        'roll': Number(row.roll),
                        'lastroll': Number(row.lastroll)
                    });
                };
            })
            .on('end', async () => {
                fs.writeFileSync(filePathUser, parse(userToSave), function (err) {
                    if (err) {
                        message.channel.send(`${language.csvError}`);
                        console.log(`[${getCurrentDatetime('comm')}] # ${user.username} not added ${err}`);
                        throw err;
                    };
                });
                await this.readUserFile();
            });
    };

    async readAdminFile() {
        this.adminsProperty = [];
        await fs.createReadStream(filePathAdmin)
            .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
            .on('data', row => {
                if (row.id != 'id') {
                    let admin = this.adminClass.setAdminProperty({
                        'id': Number(row.id),
                        'username': String(row.username),
                        'guild': Number(row.guild)
                    });

                    this.adminsProperty.push({
                        "key": Number(admin.id),
                        "value": admin
                    });
                };
            })
            .on('end', () => {
                if (this.onFirstStart) {
                    console.log(`[${getCurrentDatetime('comm')}] CSV file successfully processed with ${this.adminsProperty.length} admins`);
                };
            });
    };

    async writeAdminFile(admin, addorremove) {
        let adminToSave = [];

        switch (addorremove) {
            case false:
                adminToSave = [{
                    'id': Number(admin.id),
                    'username': String(admin.user.username),
                    'guild': Number(admin.guild.id)
                }];
                break;
            case true:
                adminToSave = [];
                break;
        };

        await fs.createReadStream(filePathAdmin)
            .pipe(csvParse.parse({ headers: true, delimiter: ',' }))
            .on('data', row => {
                if (row.id != 'id') {
                    switch (addorremove) {
                        case false:
                            adminToSave.push({
                                'id': Number(row.id),
                                'username': String(row.username),
                                'guild': Number(row.guild)
                            });
                            break;
                        case true:
                            if (Number(admin.id) != Number(row.id)) {
                                adminToSave.push({
                                    'id': Number(row.id),
                                    'username': String(row.username),
                                    'guild': Number(row.guild)
                                });
                            };
                    };
                };
            })
            .on('end', async () => {
                fs.writeFileSync(filePathAdmin, parse(adminToSave), function (err) {
                    if (err) {
                        message.channel.send(`${language.csvError}`);
                        console.log(`[${getCurrentDatetime('comm')}] # ${admin.username} not added ${err}`);
                        throw err;
                    };
                });
                await this.readAdminFile();
            });
    };
};

exports.DaftBot = DaftBot;