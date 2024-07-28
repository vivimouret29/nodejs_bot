'use.strict'

const { SlashCommandBuilder, ActivityType } = require('discord.js'),
    { clientId, identity, channels } = require('../core/config.json'),
    { getCurrentDatetime, threadPause } = require('../core/utils.js'),
    axios = require('axios');

const params = {
    headers: {
        Authorization: `Bearer ${identity.password}`,
        'Client-ID': clientId
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('obs')
        .setDescription('Permet de contrôler les notifications des lives'),
    async execute(message, client, language, user, initDateTime) {
        let ping = true,
            checkLive = true,
            gameMemory = '',
            oldGameMemory = '';

        await message.reply({
            'channel_id': message.channel.channel_id,
            'content': `Live Notifications are now **ON** ${client.emojis.cache.find(emoji => emoji.name === 'myes')}`,
            'fetchReply': true,
            'ephemeral': true
        })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command obs send ${err}`); });
        console.log(`[${getCurrentDatetime('comm')}] Live Notifications ON`);

        while (ping) {
            if (channels[0] == undefined) { continue; };

            let ax = await axios.get(`http://api.twitch.tv/helix/streams?user_login=` + channels[0].slice(1), params)
                .catch(err => {
                    checkLive = false;
                    console.log(`[${getCurrentDatetime('comm')}] Error GET AXIOS ${err}`);
                });
            if (ax == undefined) { continue; };
            console.log(`[${getCurrentDatetime('comm')}] AXIOS WHILEDAFT ${ax.data.data}`);

            if (!checkLive || ax.data.data.length == 0) { gameMemory = ''; }
            else {
                gameMemory = ax.data.data[0].game_name;
                if (gameMemory != oldGameMemory && ax.data.data.length == 1) {
                    let guiDot = ax.data.data[0].user_login;
                    if (client.user.id == '758393470024155186') { continue; };
                    await threadPause(2.5, false); // 2.5 secondes
                    client.mobbot
                        .get('livenotif')
                        .execute(message, client, language, guiDot, ax);
                    await message.editReply({
                        'channel_id': message.channel.channel_id,
                        'content': `Live Notifications are now **OFF** ${client.emojis.cache.find(emoji => emoji.name === 'yeeeeeee')}`,
                        'fetchReply': true,
                        'ephemeral': true
                    })
                        .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command obs send ${err}`); });
                    console.log(`[${getCurrentDatetime('comm')}] Live Notifications OFF`);
                    client.user.setPresence({
                        activities: [{
                            name: language.activities,
                            type: ActivityType.Watching
                        }],
                        status: 'idle'
                    });
                    ping = false;
                };
            };

            checkLive = true;
            oldGameMemory = gameMemory;

            if (ping) { await threadPause(30, false); }; // 30 secondes
        };
    }
};