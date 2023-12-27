'use.strict'

const { randomIntFromInterval } = require('../utils.js');

module.exports = {
    data: {
        name: 'sub',
        description: 'a dynamic sub'
    },
    async execute(client, channel, message, userstate, urI, timestamp, autoPost, sponso) {
        let mtpPhrases = [
            `avec le courage de ta CB, deviens un héros en suivant le lien https://www.twitch.tv/products/daftmob, sinon Terry prends le Prime gratuitement`,
            `rejoins l\'ordre de daft en donnant ton Prime ou en trouvant le chemin vers la force https://www.twitch.tv/products/daftmob daftmo1Gotanitem`
        ];

        client.reply(channel, mtpPhrases[randomIntFromInterval(0, mtpPhrases.length - 1)], userstate.id)
            .catch(e => console.log(e));
    }
};