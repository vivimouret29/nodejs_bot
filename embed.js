async function sendEmbed(message, content, descp) {
	if (descp == undefined) descp = false;

	var messageToSend = message.channel.send({
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
	});

	return messageToSend;
};

function randomColor() {
	let chars = '0123456789abcdef'.split(''),
		hex = '0x';

	for (let i = 0; i < 6; i++) { hex += chars[Math.floor(Math.random() * 16)]; };

	return Number(hex);
};

exports.sendEmbed = sendEmbed;
exports.randomColor = randomColor;