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
                `avec le courage de ta CB, deviens le chevalier qu'il faut en suivant le lien : https://www.twitch.tv/products/daftmob daftmo1Gotanitem, sinon Terry prends le Prime gratuitement`,
                `rejoins l\'ordre de daft en donnant ton Prime ou en trouvant le chemin vers la force : https://www.twitch.tv/products/daftmob daftmo1Gotanitem`,
                'ALL SYSTEMS ARE ONLINE MrDestructoid',
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