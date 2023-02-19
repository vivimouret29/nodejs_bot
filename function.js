async function sendEmbed(message, content, descp) {
	if (descp == undefined) descp = false;

	var messageToSend = message.channel
		.send({
			'channel_id': message.channel.channel_id,
			'content': descp ? 'https://discord.gg/ucwnMKKxZe' : '',
			'tts': false,
			'embeds': [{
				'type': 'rich',
				'title': '',
				'description': content,
				'color': randomColor(),
				// 'image': {
				// 	'url': ` `,
				// 	'proxy_url': ` `
				// },
				'author': {
					'name': message.author.username,
					'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
				},
				'footer': {
					'text': message.content,
					'icon_url': 'https://cdn.discordapp.com/app-icons/757955750164430980/94a997258883caba5f553f98aea8df59.png?size=256',
					'proxy_icon_url': 'https://discord.gg/ucwnMKKxZe'
				}
			}]
		})
		.catch(err => {
			message.channel.send(language.embedError);
			console.log(`[${getCurrentDatetime('comm')}] Error function sendEmbed() ${err}`);
			return;
		});

	return messageToSend;
};

function getCurrentDatetime(choice) {
	let date = new Date();
	switch (choice) {
		case 'csv':
			return `${date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()}${date.getUTCMonth() < 10 ? `0${date.getUTCMonth()}` : date.getUTCMonth()}${date.getUTCFullYear()}`;
		case 'date':
			return `${date.getUTCFullYear()}-${date.getUTCMonth() < 10 ? `0${date.getUTCMonth()}` : date.getUTCMonth()}-${date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()} ${(date.getUTCHours() + 1) < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()}:${date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()}`;
		case 'comm':
			return `${(date.getUTCHours() + 1) < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()}:${date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()} - ${date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()}/${date.getUTCMonth() < 10 ? `0${date.getUTCMonth()}` : date.getUTCMonth()}/${date.getUTCFullYear()}`;
	};
};

function randomColor() {
	let chars = '0123456789abcdef'.split(''),
		hex = '0x';

	for (let i = 0; i < 6; i++) { hex += chars[Math.floor(Math.random() * 16)]; };

	return Number(hex);
};

exports.sendEmbed = sendEmbed;
exports.getCurrentDatetime = getCurrentDatetime;
exports.randomColor = randomColor;