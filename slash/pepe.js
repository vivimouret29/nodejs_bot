'use.strict'

const { SlashCommandBuilder } = require('discord.js'),
	fs = require('node:fs'),
	axios = require('axios'),
	{ clientId, identity } = require('../core/config.json'),
	{ huggingface } = require('../config.json'),
	{ randomColor, getCurrentDatetime, randomIntFromInterval } = require('../core/utils.js');

var duration_average = randomIntFromInterval(40, 140);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pepe')
		.setDescription('Permet d\'imaginer une image via le bot avec pepe diffuser')
		.addStringOption(option => {
			return option.setName('prompt')
				.setDescription('what you want to see')
				.setRequired(true)
		}),
	async execute(message, client, language, user, initDateTime) {
		let args = message.options.get("prompt").value;

		await message.reply({
			'channel_id': message.channel.channel_id,
			'content': `pepe ${args} / *Waiting to display...*\n${language.timeAverage}${duration_average} seconds`,
			'fetchReply': true,
			'ephemeral': false
		})
			.catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });

		let response = { status: 100 },
			countResponse = -1,
			link = '';

		const urI = 'https://vivsmouret-dipl0-pepe-diffuser.hf.space/run/predict',
			headers = {
				'Authorization': `Bearer ${huggingface}`,
				'Content-Type': 'application/json',
				'Connection': 'Keep-Alive'
			},
			dt = JSON.stringify({
				data: [
					'pepe ' + args.toLowerCase()
				]
			});

		while (response.status != 200) {
			countResponse++;

			if (countResponse > 10) {
				message.editReply({
					'channel_id': message.channel.channel_id,
					'content': `${language.imagineError}`,
					'fetchReply': false,
					'ephemeral': false
				})
					.catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });
				return console.log(`[${getCurrentDatetime('comm')}] Error command pepe ${response.data}`);
			};

			response = await axios.post(urI, dt, { headers: headers })
				.catch(error => { return response = error.response; });

			if (response.status == 410) {
				message.editReply({
					'channel_id': message.channel.channel_id,
					'content': response.data,
					'fetchReply': false,
					'ephemeral': false
				})
					.catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe send ${err}`); });
				return console.log(`[${getCurrentDatetime('comm')}] Error command pepe ${response.data}`);
			};
		};

		const data = await response.data,
			splitted = data.data[0].split(',')[1],
			buffer = Buffer.from(splitted, 'base64');

		try {
			if (message.member == null) { console.log(`[${getCurrentDatetime('comm')}] ${message.user.username}'s DM # Success after ${(60 * countResponse) + data.duration} seconds - ${message.user.username} diffuse \'pepe ${args.toLowerCase()}\'`); }
			else { console.log(`[${getCurrentDatetime('comm')}] ${message.member.guild.name} / ${message.user.username} # Success after ${(60 * countResponse) + data.duration} seconds - ${message.user.username} diffuse \'pepe ${args.toLowerCase()}\'`); };
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

		fs.writeFileSync(`./styles/ai/pepe-diffuser.jpg`, buffer);
		await message.editReply({
			'channel_id': message.channel.channel_id,
			'content': `<@${message.user.id}>`,
			'tts': false,
			'embeds': [{
				'type': 'rich',
				'title': 'Pepe',
				'description': `**${args}**\n${language.timeDiffuse}${(60 * countResponse) + data.duration} seconds
${language.timeAverage}${data.average_duration} seconds\n\n[**Pepe Diffuser**](https://huggingface.co/Dipl0/pepe-diffuser)`,
				'color': randomColor(),
				'author': {
					'name': message.user.username,
					'icon_url': message.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
				},
				'thumbnail': {
					'url': `https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/${link}?w=200&h=200&f=face`,
					'proxy_url': 'https://huggingface.co/Dipl0/pepe-diffuser'
				}
			}],
			'files': [`./styles/ai/pepe-diffuser.jpg`],
			'fetchReply': false,
			'ephemeral': false
		})
			.catch(err => { console.log(`[${getCurrentDatetime('comm')}] Error command pepe edit ${err}`); });

		duration_average = data.average_duration;
	}
};