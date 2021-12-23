'use.strict'

module.exports = {
    trashtalk: {
        name: 'trashtalk',
        description: 'a dynamic trashtalk',
        execute(message) {

            let listReplies = ['toujours plus venant de ta part',
                'tu sais pas fermer ta gueule toi...',
                'mais qui t\'écoute ?',
                'commence par calmer ton python éclaté'
            ];

            function choose(choices) {
                let index = Math.floor(Math.random() * choices.length);
                return choices[index];
            };

            if (Math.random() < .2) message.reply(choose(listReplies));
        }
    }
};