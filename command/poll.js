'use.strict'

const { emojis: dctmj } = require('../resx/emojis.json'),
    { sendEmbed, getCurrentDatetime, randomColor, threadPause } = require('../core/utils.js');

module.exports = {
    data: {
        name: 'poll',
        description: 'a dynamic poll',
        args: true
    },
    async execute(message, client, language, user, args, initDateTime) {
        Array.prototype.max = function () { return Math.max.apply(null, this); };

        try {
            var survey = args.join(' '),
                wt = survey.split('/')[0],
                ctm = survey.split('/')[1].split('-');
        } catch (err) {
            return await sendEmbed(message, language.error)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error split command poll ${err}`);
                });
        };

        if (ctm == undefined) {
            return await sendEmbed(message, language.error)
                .catch(err => {
                    message.reply({ 'content': language.error, 'ephemeral': true });
                    console.log(`[${getCurrentDatetime('comm')}] Error sending message SEERROR ${err}`);
                });
        };

        var dictMojis = [],
            maxCount = [],
            fields = [],
            reactions,
            highReact,
            postSurvey;

        for (i = 0; i < ctm.length; i++) {
            let jis = client.emojis.cache.find(emoji => emoji.name === dctmj[i]);
            dictMojis.push(jis);
            fields.push({
                'name': ctm[i],
                'value': `${dictMojis[i]}`,
                'inline': false
            });
        };

        await message
            .reply({
                'channel_id': message.channel.channel_id,
                'content': '',
                'tts': false,
                'embeds': [{
                    'type': 'rich',
                    'title': wt,
                    'description': '',
                    'color': randomColor(),
                    'author': {
                        'name': message.author.username,
                        'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
                    },
                    'fields': fields
                }]
            })
            .then(async (msg) => {
                for (i = 0; i < dictMojis.length; i++) { await msg.react(dictMojis[i]) };
                await threadPause(30, false); // 30 secondes
                return reactions = msg.reactions.cache.map(reaction => reaction);
            })
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command send poll ${err}`); });

        for (i = 0; i < reactions.length; i++) { maxCount.push(reactions[i].count); };
        highReact = maxCount.max();
        dictMojis.forEach((emoji, index) => { reactions[index].count == highReact ? postSurvey = index : postSurvey; });

        message
            .reply(`${wt}${ctm[postSurvey]}`)
            .catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command poll result ${err}`); });
    }
};