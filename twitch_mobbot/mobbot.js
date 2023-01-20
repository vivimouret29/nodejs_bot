'use.strict'

const tmi = require('tmi.js');
const { parse } = require('json2csv');
const fs = require('fs');
const {
    clientId,
    identity,
    channels
} = require("./config.json");

const oauth = {
    options: {
        debug: true,
        clientId: clientId
    },
    identity: identity,
    channels: channels,
    connection: { reconnect: true }
};

const client = new tmi.Client(oauth);

var data_to_exp = [];

var date = new Date();
const dateTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

client.on('connected', onConnectedHandler);
client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self || tags['username'] === 'moobot') return;

    let data =
    {
        "id": Number(tags['user-id']),
        "date": getCurrentDatetime(false),
        // "badges": tags['badges'],
        "color": String(tags['color']),
        "username": String(tags['username']),
        "message": String(message),
        "emotes": tags['emotes-raw'] == null ? null : String(tags['emotes-raw']),
        "turbo": Boolean(tags['turbo'])
    };

    return exportingData(data);
});

function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port} *`);
};

function getCurrentDatetime(bool) {
    if (bool) {
        return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
    } else {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }
};

function exportingData(data) {
    data_to_exp.push(data);

    if (getCurrentDatetime(false) === dateTime) return;

    fs.writeFile(`./twitch_mobbot/mobbot_analytics_${getCurrentDatetime(true)}.csv`, parse(data_to_exp), function (err) {
        if (err) throw err;
    });
}