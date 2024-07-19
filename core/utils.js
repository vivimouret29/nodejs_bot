'use.strict'

const fs = require('node:fs'),
	moment = require('moment-timezone'),
	request = require('request');

async function sendEmbed(message, content) {
	var messageToSend = await message
		.reply({
			'channel_id': message.channel.channel_id,
			'content': '',
			'tts': false,
			'embeds': [{
				'type': 'rich',
				'title': '',
				'description': content,
				'color': randomColor(),
				'author': {
					'name': message.author.username,
					'icon_url': message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 })
				},
				'footer': {
					'text': message.content,
					'icon_url': 'https://cdn.discordapp.com/app-icons/1101098023259492493/235dfac49e136a686a5d7fd9e66430f3.webp?size=128',
					'proxy_icon_url': 'https://discord.gg/ucwnMKKxZe'
				}
			}],
			'ephemeral': true
		})
		.catch(err => {
			message.reply({ 'content': 'Error while sending a custom message', 'ephemeral': true });
			console.log(`[${getCurrentDatetime('comm')}] Error function sendEmbed() ${err}`);
			return;
		});

	return messageToSend;
};

async function messageErase(message) { await message.delete().catch(O_o => { }); };

function randomIntFromInterval(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) };

function getCurrentDatetime(choice) {
	switch (choice) {
		case 'csv':
			return `${moment().tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss')}`;
		case 'date':
			return `${moment().tz('Europe/Paris').format('DDMMYYYY')}`;
		case 'comm':
			return `${moment().tz('Europe/Paris').format('HH:mm:ss DD/MM/YYYY')}`;
	};
};

function randomColor() {
	let chars = '0123456789abcdef'.split(''),
		hex = '0x';

	for (let i = 0; i < 6; i++) { hex += chars[Math.floor(Math.random() * 16)]; };

	return Number(hex);
};

function downloadImagesFromUrl(uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

async function threadPause(numbers, time) {
	switch (time) {
		case true:
			await new Promise(resolve => setTimeout(resolve, numbers * 60000)); // minutes
			break;
		case false:
			await new Promise(resolve => setTimeout(resolve, numbers * 1000)); // secondes
			break;
	};
};

function getTimeRemaining(targetDate) {
	targetDate = moment.tz(targetDate, "Europe/Paris")
	let momentNow = moment().tz('Europe/Paris'),
		diff = targetDate.diff(momentNow),
		duration = moment.duration(diff),
		durationList = {
			hours: duration.hours(),
			minutes: duration.minutes(),
			seconds: duration.seconds()
		};

	return durationList;
}

exports.sendEmbed = sendEmbed;
exports.messageErase = messageErase;
exports.randomIntFromInterval = randomIntFromInterval;
exports.getCurrentDatetime = getCurrentDatetime;
exports.randomColor = randomColor;
exports.downloadImagesFromUrl = downloadImagesFromUrl;
exports.threadPause = threadPause;
exports.getTimeRemaining = getTimeRemaining;