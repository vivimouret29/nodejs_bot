'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
    { createCanvas, loadImage } = require('canvas'),
    { getCurrentDatetime } = require('../core/utils.js'),
    axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Permet d\'afficher son MMR sur Rocket League')
        .addStringOption(option => {
            return option.setName('platform')
                .setDescription('La plateforme lié au compte')
                .setRequired(false)
        })
        .addStringOption(option => {
            return option.setName('pseudo')
                .setDescription('Le pseudo du compte')
                .setRequired(false)
        }),
    // .addStringOption(option => {
    //     return option.setName('extras')
    //         .setDescription('Voir les informations des Match Extras')
    //         .setRequired(false)
    // })
    // .addStringOption(option => {
    //     return option.setName('historic')
    //         .setDescription('Voir l\'historique de ton compte')
    //         .setRequired(false)
    // }),
    async execute(message, client, language, user, initDateTime) {
        // let plateform = message.options.get('platform').value,
        //     pseudo = message.options.get('pseudo').value;
        let plateform = 'steam',
            pseudo = 'daftmob';

        await message.reply({
            'channel_id': message.channel.channel_id,
            'content': `${client.emojis.cache.find(emoji => emoji.name === 'nyankat')} **Recherche en cours** de votre rang MMR`,
            'fetchReply': true,
            'ephemeral': false
        })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command obs send ${err}`); });
        console.log(`[${getCurrentDatetime('comm')}] ${message.member.user.globalName} search ${pseudo} MMR's rank`);

        let url = `https://api.tracker.gg/api/v2/rocket-league/standard/profile/${plateform}/${pseudo}?forceCollect=true`;
        let headers = {};
        // headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['authority'] = 'api.tracker.gg';
        headers['method'] = 'GET';
        headers['path'] = `/api/v2/rocket-league/standard/profile/${plateform}/${pseudo}`;
        headers['scheme'] = 'https';
        headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';
        headers['Accept-Encoding'] = 'gzip, deflate, br, zstd';
        headers['Accept-Language'] = 'fr-FR';
        headers['Cache-Control'] = 'no-cache';
        headers['Content-Type'] = 'application/json; charset=utf-8';
        headers['Pragma'] = 'no-cache';
        headers['Priority'] = 'u=0';
        headers['Sec-Ch-Ua'] = 'Brave';
        headers['Sec-Ch-Ua-Mobile'] = '?0';
        headers['Sec-Ch-Ua-Platform'] = 'Windows';
        headers['Sec-Fetch-Des'] = 'document';
        headers['Sec-Fetch-Mode'] = 'navigate';
        headers['Sec-Fetch-User'] = '?1';
        headers['Sec-Gpc'] = 1;
        headers['Upgrade-Insecure-Requests'] = 1;
        headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 11.0; Win64; x64)';
        headers['Vary'] = 'Accept-Encoding';

        var mateub = axios.get(url, {
            headers: headers
        });


        console.log(mateub)
    }
};

// userProperty