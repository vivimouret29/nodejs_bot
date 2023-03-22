'use.strict'

const config = require("../config.json"),
    { Configuration, OpenAIApi } = require("openai"),
    configuration = new Configuration({ apiKey: config.openAI }),
    openaiAPI = new OpenAIApi(configuration);

module.exports = {
    data: {
        name: 'openai',
        description: 'a dynamic tchat bot from openai',
        args: true
    },
    async execute(client, message, language, user, args, initDateTime) {
        var content = message.content.split(' ');
        for (let word in content) { if (content[word].includes(`<@${client.user.id}>`)) { content.splice(word, 1); }; };

        await openaiAPI
            .createCompletion({
                model: "text-davinci-003",
                prompt: content.join(' '),
                max_tokens: 1024,
                n: 1,
                stop: undefined,
                temperature: 0.9
            })
            .then((data) => {
                message
                    .reply(data.data.choices[0].text)
                    .catch(err => {
                        message.channel.send(language.embedError);
                        console.log(`[${getCurrentDatetime('comm')}] Error message openai() ${err}`);
                        return;
                    });
            })
            .catch(err => {
                message.channel.send(language.openAiCrash);
                console.log(`[${getCurrentDatetime('comm')}] Error openai() ${err}`);
                return;
            });
    }
};