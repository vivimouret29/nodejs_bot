'use.strict'

const { randomIntFromInterval } = require('../utils.js');

module.exports = {
    data: {
        name: 'timer',
        description: 'a dynamic timer'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost) {
        if (autoPost) {
            let mtpPhrases = [
                'passes rejoindre son discord https://discord.gg/ucwnMKKxZe',
                `penses à aller voir la dernière vidéo https://www.youtube.com/watch?v=${urI}`,
                'check quand je passe en live avec le twitter https://twitter.com/daftm0b',
                `rejoins l\'ordre de daft et devient un bon padawan :\nhttps://www.twitch.tv/products/daftmob`
            ];

            client.say(channel, `daft est en live depuis ${timestamp}, ` + mtpPhrases[randomIntFromInterval(0, mtpPhrases.length - 1)])
                .catch(e => console.log(e));
        } else {
            client.reply(channel, `daft est en live depuis ${timestamp}`, userstate.id)
                .catch(e => console.log(e));
        };
    }
};