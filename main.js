'use.strict'

const { Client, Collection, IntentsBitField, ActivityType, Events, Partials } = require('discord.js'),
	axios = require('axios'),
	packageVersion = require('./package.json'),
	{ prefix, token, owner } = require('./config.json'),
	{ clientId, identity } = require('./mobbot/config.json'),
	{ fr, en, uk } = require('./resx/lang.json'),
	{ sendEmbed } = require('./embed.js'),
	commandFile = require('./appdata/command.js'),
	responseFile = require('./appdata/response.js'),
	mobbotFile = require('./mobbot/mobbot.js'),
	clientFile = require('./appdata/client.js'),
	reactionFile = require('./appdata/reaction.js'),
	openaiFile = require('./appdata/openai.js');

var collectionCommands = new Collection(),
	collectionResponse = new Collection(),
	collectionMobbot = new Collection(),
	collectionClient = new Collection(),
	collectionReaction = new Collection(),
	collectionOpenAI = new Collection();

// Command Collection
collectionCommands.set(commandFile.version.name, commandFile.version);
collectionCommands.set(commandFile.say.name, commandFile.say);
collectionCommands.set(commandFile.prune.name, commandFile.prune);
collectionCommands.set(commandFile.ping.name, commandFile.ping);
collectionCommands.set(commandFile.invit.name, commandFile.invit);

// Mobbot Collection
collectionMobbot.set(mobbotFile.mobbot.name, mobbotFile.mobbot);
collectionMobbot.set(mobbotFile.exportmobbot.name, mobbotFile.exportmobbot);
collectionMobbot.set(mobbotFile.livenotif.name, mobbotFile.livenotif);

// Client Collection
collectionClient.set(clientFile.help.name, clientFile.help);
collectionClient.set(clientFile.guild.name, clientFile.guild);
collectionClient.set(clientFile.uptime.name, clientFile.uptime);
collectionClient.set(clientFile.status.name, clientFile.status);
collectionClient.set(clientFile.kill.name, clientFile.kill);
collectionClient.set(clientFile.reset.name, clientFile.reset);

// Reply Collection
collectionResponse.set(responseFile.daftbot.name, responseFile.daftbot);
collectionResponse.set(responseFile.laugh.name, responseFile.laugh);
collectionResponse.set(responseFile.yes.name, responseFile.yes);
collectionResponse.set(responseFile.no.name, responseFile.no);
collectionResponse.set(responseFile.tqt.name, responseFile.tqt);

// OpenAI Collection
collectionOpenAI.set(openaiFile.openai.name, openaiFile.openai);

// Reaction Collection
collectionReaction.set(reactionFile.trashtalk.name, reactionFile.trashtalk);

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

const dbClient = new Client({ intents: intents, partials: partials });

var date = new Date(),
	initDateTime = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
	isMuted = false,
	language = language == undefined ? fr : language,
	streamers = ['daftmob', 'dpl0', 'fantabobshow', 'mistermv', 'drfeelgood', 'laink', 'ponce', 'captainfracas'],
	emojiRoles = [
		'💜',
		'❤️',
		'looners',
		'mandalorian',
		'linkitem',
		'croisade'
	],
	rolesNames = [
		'/D/TWITCH',
		'/D/YOUTUBE',
		'/D/STALKERS',
		'/D/CHASSEURS',
		'/D/HÉROS',
		'/D/GUERRIERS'
	],
	memes = [
		'https://media3.giphy.com/media/3o84sCIUu49AtNYkDK/giphy.gif',
		'https://media1.giphy.com/media/3ohuPwwRuluP6GiZoI/giphy.gif',
		'https://media2.giphy.com/media/3ohuPePwzcG9sA3VSw/giphy.gif'
	],
	badBot = ['757970907992948826', '758393470024155186', '758319298325905428'],
	badChannels = [],
	badBoy = [];

function getCurrentDatetime(choice) {
	switch (choice) {
		case 'csv':
			return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
		case 'date':
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
		case 'comm':
			return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
	};
};

dbClient.on(Events.ClientReady, async () => {
	await new Promise(resolve => setTimeout(resolve, 5 * 1000));

	dbClient.user.setPresence({
		activities: [{
			name: language.activities,
			type: ActivityType.Watching
		}],
		status: 'online'
	});

	console.log(`[${getCurrentDatetime('comm')}] ${dbClient.user.username} present in : `, dbClient.guilds.cache.map(guild => guild.name));
	await new Promise(resolve => setTimeout(resolve, 5 * 1000));

	if (dbClient.user.id == badBot[1]) return;

	collectionMobbot
		.get('mobbot')
		.execute();
	console.log(`[${getCurrentDatetime('comm')}] ${dbClient.user.username} connect on irc-ws.chat.twitch.tv:443`);
	await new Promise(resolve => setTimeout(resolve, 10 * 1000));

	let descpMemory = [],
		oldDescpMemory = [];

	for (let i = 0; i < streamers.length; i++) {
		descpMemory.push('');
		oldDescpMemory.push('');
	};

	while (true) {
		for (streamId in streamers) {
			let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=${streamers[streamId]}`, params);

			if (ax.data.data.length == 0) {
				descpMemory[streamId] = '';
			} else {
				descpMemory[streamId] = ax.data.data[0].title;

				if (descpMemory[streamId] != oldDescpMemory[streamId] && ax.data.data.length == 1) {
					let guiDot = await axios.get(`https://twitch.tv/${ax.data.data[0].user_login}`);
					collectionMobbot
						.get('livenotif')
						.execute(dbClient, language, guiDot, ax);
					console.log(`[${getCurrentDatetime('comm')}] Notif Twitch ${ax.data.data[0].user_name}`);
				};
			};
		};

		for (let i = 0; i < streamers.length; i++) { oldDescpMemory[i] = descpMemory[i]; };
		await new Promise(resolve => setTimeout(resolve, 300 * 1000));
	};
});

dbClient.on(Events.GuildMemberAdd, async (guild) => {
	dbClient.channels.cache
		.get(guild.guild.systemChannelId)
		.send({
			'channel_id': guild.guild.systemChannelId,
			'content': '',
			'tts': false,
			'embeds': [{
				'type': 'rich',
				'title': `${guild.user.username} ${language.guildJoin}`,
				'description': language.guildJoinDesc,
				'color': 0x890b0b,
				'image': {
					'url': memes[randomIntFromInterval(0, (memes.length - 1))]
				},
				'thumbnail': {
					'url': dbClient.users.cache.get(guild.user.id).avatarURL({ format: 'png', dynamic: true, size: 1024 })
				},
				'author': {
					'name': dbClient.user.username,
					'icon_url': dbClient.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
				}
			}]
		});

	console.log(`[${getCurrentDatetime('comm')}] New member \'${guild.user.username}\' join server : ${guild.guild.name}`);

	function randomIntFromInterval(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) };
});

dbClient.on(Events.MessageCreate, async (message) => {
	var args = message.content.slice(prefix.length).trim().split(/ +/),
		command = args.shift().toLowerCase(),
		msg = message.content.toLowerCase(),
		author = message.author.username,
		checkCollection,
		checkClientCollection;

	collectionCommands.has(command) ? checkCollection = collectionCommands.get(command).name : checkCollection = false;
	collectionClient.has(command) ? checkClientCollection = collectionClient.get(command).name : checkClientCollection = false;

	if (message.author.bot) return;
	if (token == undefined) dbClient.destroy();

	if (message.content.startsWith(prefix)) {
		switch (command) {
			case 'mobbot':
				if (!(message.author.id === owner)) return sendEmbed(message, language.restricted);
				collectionMobbot
					.get('exportmobbot')
					.execute(message, dbClient.emojis);
				break;
			case 'lang':
				setLanguage(message, author, msg, args);
				break;
			case 'language':
				setLanguage(message, author, msg, args);
				break;
			case 'mute':
				if (!(message.author.id === owner)) return sendEmbed(message, language.restricted);
				setMute(message, author, msg, args);
				break;
			case checkClientCollection:
				collectionClient
					.get(command)
					.execute(message, dbClient, language, initDateTime, args);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
				break;
			case checkCollection:
				collectionCommands
					.get(command)
					.execute(message, { args, language: language });
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
				break;
			default:
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${language.commandAttempt} : (${msg}) / (${author})`);
				sendEmbed(message, language.commandNotFound);
				break;
		};
	};

	if (message.author.id === owner) {
		if (Math.random() < .05) {
			let dio = dbClient.emojis.cache.find(emoji => emoji.name === 'dio_sama');

			if (dio == undefined) return console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Emoji not found`);
			message.react(dio);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Za Warudo`);
		};
	};

	if (isMuted) return;

	if (!message.content.startsWith(prefix)) {
		if ((message.mentions.has(dbClient.user.id)) ||
			((message.reference != undefined) && (message.channel.messages.fetch(message.reference.messageId).user == dbClient.user))) {
			try {
				collectionOpenAI
					.get('openai')
					.execute(message);
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output openai() : `, err);
			};
		};

		if (!collectionResponse.has(msg)) return;

		try {
			collectionResponse
				.get(msg)
				.execute(message, { args, languageChoosen: language });
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
		} catch (err) {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output reply() : `, err);
		};

		if (badBot.includes(message.author.id) && !(badChannels.includes(message.channel.name))) {
			if (Math.random() <= .005) {
				try {
					collectionReaction
						.get('trashtalk')
						.execute(message);
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}\n[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${dbClient.user.username} used (or not) a trashtalk`);
				} catch (err) {
					console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Error output randomCollection() : `, err);
				};
			};
		};

		if (badBoy.includes(message.author.id)) {
			if (Math.random() > .005) return;
			try {
				message.delete().catch(O_o => { })
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Message deleted`);
			} catch (err) {
				console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # Can't delete badBoy's message : `, err);
			};
		};
	};
});

dbClient.on(Events.MessageReactionAdd, (react, user) => {
	var rChan = '1068559351570247741',
		rMsg = '1071286935726854216',
		emoji = react.emoji.name,
		channel = dbClient.channels.cache.get(react.message.channelId),
		messageId = react.message.id,
		message = channel.messages.cache.get(messageId),
		guild = dbClient.guilds.cache.get(channel.guildId);

	if (message.channelId != rChan && message.id != rMsg && emoji.includes(emojiRoles)) return;

	switch (emoji) {
		case '💜':
			switchRoles(guild, user.id, 0, true);
			break;
		case '❤️':
			switchRoles(guild, user.id, 1, true);
			break;
		case 'looners':
			switchRoles(guild, user.id, 2, true);
			break;
		case 'mandalorian':
			switchRoles(guild, user.id, 3, true);
			break;
		case 'linkitem':
			switchRoles(guild, user.id, 4, true);
			break;
		case 'croisade':
			switchRoles(guild, user.id, 5, true);
			break;
		default:
			break;
	};
});

dbClient.on(Events.MessageReactionRemove, (react, user) => {
	var rChan = '1068559351570247741',
		rMsg = '1071286935726854216',
		emoji = react.emoji.name,
		channel = dbClient.channels.cache.get(react.message.channelId),
		messageId = react.message.id,
		message = channel.messages.cache.get(messageId),
		guild = dbClient.guilds.cache.get(channel.guildId);

	if (message.channelId != rChan && message.id != rMsg && emoji.includes(emojiRoles)) return;

	switch (emoji) {
		case '💜':
			switchRoles(guild, user.id, 0, false);
			break;
		case '❤️':
			switchRoles(guild, user.id, 1, false);
			break;
		case 'looners':
			switchRoles(guild, user.id, 2, false);
			break;
		case 'mandalorian':
			switchRoles(guild, user.id, 3, false);
			break;
		case 'linkitem':
			switchRoles(guild, user.id, 4, false);
			break;
		case 'croisade':
			switchRoles(guild, user.id, 5, false);
			break;
		default:
			break;
	};
});

function switchRoles(guild, userId, roleIndex, style) {
	var role = guild.roles.cache.find(r => r.name == rolesNames[roleIndex]),
		user = guild.members.cache.get(userId);

	switch (style) {
		case true:
			if (!(role.members.has(user.id))) {
				try {
					user.roles.add(role);
					console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} get ${role.name}`);
				} catch (error) {
					console.log(`[${getCurrentDatetime('comm')}] Error when assigning the role ${role.name} to ${user.user.username} : ${error}`);
				}
			} else {
				user.send(language.addRole);
				console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} already have the role ${role.name}`);
			};
			break;
		case false:
			if (role.members.has(user.id)) {
				try {
					user.roles.remove(role);
					console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} remove ${role.name}`);
				} catch (error) {
					console.log(`[${getCurrentDatetime('comm')}] Error when unassigning the role ${role.name} to ${user.user.username} : ${error}`);
				}
			} else {
				user.send(language.remRole);
				console.log(`[${getCurrentDatetime('comm')}] ${user.user.username} have not the role ${role.name}`);
			};
			break;
	};
};

async function setLanguage(message, author, msg, args) {
	switch (args[0]) {
		case 'fr':
			language = fr;
			sendEmbed(message, language.changLang);

			await new Promise(resolve => setTimeout(resolve, 30 * 1000));
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
		case 'en':
			language = en;
			sendEmbed(message, language.changLang);

			await new Promise(resolve => setTimeout(resolve, 30 * 1000));
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
		case 'uk':
			language = uk;
			sendEmbed(message, language.changLang);

			await new Promise(resolve => setTimeout(resolve, 30 * 1000));
			dbClient.user.setPresence({
				activities: [{
					name: language.activities,
					type: ActivityType.Watching
				}],
				status: 'online'
			});

			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
		default:
			sendEmbed(message, language.languageNtReco);
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			return language;
	};
};

function setMute(message, author, msg, args) {
	let action = args[0];
	if (action != undefined) {
		if ((action.toLowerCase()) === 'on') {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			sendEmbed(message, language.botMuted);
			isMuted = true;
			return isMuted;
		} else if ((action.toLowerCase()) === 'off') {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			sendEmbed(message, language.botUnmuted);
			isMuted = false;
			return isMuted;
		} else {
			console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
			sendEmbed(message, `${language.howMute}\n\r*e.g. : ${prefix}mute on*`);
			isMuted = false;
			return isMuted;
		};
	} else {
		console.log(`[${getCurrentDatetime('comm')}] ${message.guild.name} / ${message.channel.name} # ${author} : ${msg}`);
		sendEmbed(message, `${language.howMute}\n\r*e.g. : ${prefix}mute on*`);
		isMuted = false;
		return isMuted;
	};
};


dbClient
	.login(token)
	.then(() => console.log(`[${getCurrentDatetime('comm')}] ${dbClient.user.username}\'s logged
[${getCurrentDatetime('comm')}] ${dbClient.user.username} v${packageVersion.version}`))
	.catch(console.error);