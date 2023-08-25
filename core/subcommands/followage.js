'use.strict'

const axios = require('axios'),
    { identity, clientId } = require('../config.json'),
    { getCurrentDatetime } = require('../utils.js');

const params = {
    headers: {
        Authorization: `Bearer ${identity.password}`,
        'Client-ID': clientId
    }
};

module.exports = {
    data: {
        name: 'followage',
        description: 'a dynamic followage'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        if (userstate.username === 'daftmob') {
            client.reply(channel, `debilus...`, userstate.id)
                .catch(e => console.log(e));
            return;
        };

        let fe = await axios.get(`https://api.twitch.tv/helix/channels/followed?user_id=${userstate.id}` + params)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error FETCH ${err}`); }),
            timeSince = new Date(fe.data.data[0].followed_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
            day = timeSince.split('/')[0],
            months = timeSince.split('/')[1],
            years = new Date(fe.data.data[0].followed_at).getUTCFullYear();

        switch (months) {
            case '01':
                months = months.replace('01', 'janvier');
                break;
            case '02':
                months = months.replace('02', 'février');
                break;
            case '03':
                months = months.replace('03', 'mars');
                break;
            case '04':
                months = months.replace('04', 'avril');
                break;
            case '05':
                months = months.replace('05', 'mai');
                break;
            case '06':
                months = months.replace('06', 'juin');
                break;
            case '07':
                months = months.replace('07', 'juillet');
                break;
            case '08':
                months = months.replace('08', 'août');
                break;
            case '09':
                months = months.replace('09', 'septembre');
                break;
            case '10':
                months = months.replace('10', 'octobre');
                break;
            case '11':
                months = months.replace('11', 'novembre');
                break;
            case '12':
                months = months.replace('12', 'décembre');
                break;
        };

        client.reply(channel, `${userstate.username} follow le ptit daft depuis ${day} ${months} ${years}`, userstate.id)
            .catch(e => console.log(e));
    }
};