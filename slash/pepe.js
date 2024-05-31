'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
	dynamic = new Function('modulePath', 'return import(modulePath)'),
	axios = require('axios'),
	{ clientId, identity } = require('../core/config.json'),
	{ huggingface } = require('../config.json'),
	{ randomColor, getCurrentDatetime, randomIntFromInterval, downloadImagesFromUrl } = require('../core/utils.js');

let duration_average = randomIntFromInterval(4, 140),
	totalDuration = 0,
	executionCount = 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pepe')
		.setDescription('Permet d\'imaginer une image via le bot avec pepe diffuser')
		.addStringOption(option => {
			return option.setName('prompt')
				.setDescription('what you want to see')
				.setRequired(true)
		}),
	async execute(message, client_, language, user, initDateTime) {
		const { client } = await dynamic('@gradio/client');

		let args = message.options.get("prompt").value;

		await message.reply({
			'channel_id': message.channel.channel_id,
			'content': `pepe ${args} / *Waiting to display...*\n${language.timeAverage}${duration_average}s`,
			'fetchReply': true,
			'ephemeral': false
		})
			.catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });

		const app = await client('vivsmouret/pepe-diffuser');

		const startTime = Date.now();
		const response = await app.predict('/predict', [
			'pepe ' + args.toLowerCase(),
		]);
		const endTime = Date.now();

		const duration = (endTime - startTime) / 1000;

		totalDuration += duration;
		executionCount += 1;
		duration_average = totalDuration / executionCount;

		const data = await response.data;

		downloadImagesFromUrl(data[0].url, `./styles/ai/pepe-diffuser.jpg`, function () {
			console.log(`[${getCurrentDatetime('comm')}] Image successfully downloaded from HuggingFace`);
		});

		try {
			if (message.member == null) { console.log(`[${getCurrentDatetime('comm')}] ${message.user.username}'s DM # Success after ${duration} seconds - ${message.user.username} diffuse \'pepe ${args.toLowerCase()}\'`); }
			else { console.log(`[${getCurrentDatetime('comm')}] ${message.member.guild.name} / ${message.user.username} # Success after ${duration} seconds - ${message.user.username} diffuse \'pepe ${args.toLowerCase()}\'`); };
		} catch (err) { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); };

		var fetchPdp = await axios.get('https://huggingface.co/Dipl0', {
			headers: {
				Authorization: `Bearer ${identity.password}`,
				'Client-ID': clientId
			}
		});

		try {
			link = await fetchPdp.data.split(new RegExp(`(s\/[^.]..........................................)`, 'giu'))[3];
			link.endsWith('?') ? link = link.slice(2, -1) : link = link.split('s/')[1]
		} catch (err) {
			console.log(`[${getCurrentDatetime('comm')}] Can't get guid : `, err);
		};

		await message.editReply({
			'channel_id': message.channel.channel_id,
			'content': `<@${message.user.id}>`,
			'tts': false,
			'embeds': [{
				'type': 'rich',
				'title': 'Pepe',
				'description': `**${args}**\n${language.timeDiffuse}${duration}s
${language.timeAverage}${duration_average}s\n\n[**Pepe Diffuser**](https://huggingface.co/Dipl0/pepe-diffuser)`,
				'color': randomColor(),
				'image': { 'url': data[0].url },
				'author': {
					'name': message.user.username,
					'icon_url': message.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
				},
				'thumbnail': {
					'url': `https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/${link}?w=200&h=200&f=face`,
					'proxy_url': 'https://huggingface.co/Dipl0/pepe-diffuser'
				}
			}],
			'fetchReply': false,
			'ephemeral': false
		})
			.catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe edit ${err}`); });
	}
};