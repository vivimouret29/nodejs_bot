'use.strict'

const { DaftBot } = require('./core/daftbot.js'),
	fs = require('fs'),
	util = require('util'),
	moment = require('moment-timezone'),
	utc2 = moment().tz('Europe/Paris'),
	daftBot = new DaftBot();

var logName = utc2.format('DD-MM-YYYY');
var logFile = fs.createWriteStream(`data/logs/log_daftbot_mobbot_${logName}.log`, { flags: 'a' }); // 'w' to truncate | 'a' to agglomerate
var logStdout = process.stdout;

console.log = function () {
	logFile.write(util.format.apply(null, arguments) + '\n');

	logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

daftBot.onConnect();