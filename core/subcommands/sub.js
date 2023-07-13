'use.strict'

const { randomIntFromInterval } = require('../utils.js');

module.exports = {
    data: {
        name: 'sub',
        description: 'a dynamic sub'
    },
    async execute(client, channel, message, userstate) {
        let mtpPhrases = [
            `avec le courage de ta CB, deviens le chevalier qu'il faut en suivant le lien : https://www.twitch.tv/products/daftmob daftmo1Gotanitem, sinon Terry prends le Prime gratuitement`,
            `rejoins l\'ordre de daft en donnant ton Prime ou en trouvant le chemin vers la force : https://www.twitch.tv/products/daftmob daftmo1Gotanitem`
        ];

        client.reply(channel, mtpPhrases[randomIntFromInterval(0, mtpPhrases.length - 1)], userstate.id)
            .catch(e => console.log(e));
    }
};