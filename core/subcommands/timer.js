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
                'passes rejoindre son discord https://discord.gg/ucwnMKKxZe PixelBob',
                `PogChamp penses à aller voir la dernière vidéo https://www.youtube.com/watch?v=${urI} PogChamp`,
                'check quand je passe en live avec le twitter https://twitter.com/daftm0b Kappa',
                `Terry t'offre une montagne de réduction sur Instant-Gaming en utilisant ce lien https://www.instant-gaming.com/?igr=daftmob daftmo1Gotanitem`,
                `rejoins l\'ordre de daft en lâchant ton Prime ou en trouvant le chemin de la force https://www.twitch.tv/products/daftmob daftmo1Gotanitem`,
                'avec le discord du daft https://discord.gg/ucwnMKKxZe et/ou avec son twitter https://twitter.com/daftm0b daftmo1Whaaa, tiens-toi au courant des prochains lives !'
            ];

            client.say(channel, `daft est en live depuis ${timestamp}, ` + mtpPhrases[randomIntFromInterval(0, mtpPhrases.length - 1)])
                .catch(e => console.log(e));
        } else {
            client.reply(channel, `daft est en live depuis ${timestamp}`, userstate.id)
                .catch(e => console.log(e));
        };
    }
};