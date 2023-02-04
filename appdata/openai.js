'use.strict'

const config = require("../config.json"),
    { Configuration, OpenAIApi } = require("openai"),
    configuration = new Configuration({ apiKey: config.openAI }),
    openaiAPI = new OpenAIApi(configuration);

module.exports = {
    openai: {
        name: 'openai',
        description: 'a dynamic tchat bot from openai',
        execute(message) {
            const completion = openaiAPI.createCompletion({
                model: "text-davinci-003",
                prompt: message.content,
                max_tokens: 1024,
                n: 1,
                stop: undefined,
                temperature: 0.9
            });

            completion.then((result) => {
                message.reply(result.data.choices[0].text);
            });
        }
    }
};