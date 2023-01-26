'use.strict'

const { Client } = require('tmi.js'),
    { parse } = require('json2csv'),
    fs = require('fs'),
    { 
        clientId,
        identity,
        channels
    } = require('./config_mobbot.json');

const oauth = {
    options: {
        debug: true,
        clientId: clientId
    },
    identity: identity,
    channels: channels,
    connection: { reconnect: true }
};

const mobbot_client = new Client(oauth);

var data_to_exp = [];
var date = new Date();

mobbot_client.on('connected', onConnectedHandler);
mobbot_client.connect();

mobbot_client
    .on('message', (channel, tags, message, self) => {
        if (self || tags['username'] === 'moobot') return;

        let data =
        {
            "id": Number(tags['user-id']),
            "date": getCurrentDatetime('date'),
            "badges": tags['badges'],
            "color": String(tags['color']),
            "username": String(tags['username']),
            "message": String(message),
            "emotes": tags['emotes-raw'] == null ? null : String(tags['emotes-raw']),
            "turbo": Boolean(tags['turbo'])
        };

        return data_to_exp.push(data);
    });

if (mobbot_client.readyState() === `OPEN`) {
    mobbot_client.disconnect();
    exportingData(message);
};

function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port} *`);
};

function getCurrentDatetime(choice) {
    switch (choice) {
        case 'csv':
            return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
        case 'date':
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        case 'comm':
            return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    }
};

function exportingData(message) {
    if (data_to_exp.length === 0) { return };

    writeFile(`./twitch_mobbot/mobbot_analytics_${getCurrentDatetime('csv')}.csv`, parse(data_to_exp), function (err) {
        if (err) { throw err };
    });
};