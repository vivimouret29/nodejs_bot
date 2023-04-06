'use.strict'

const { DaftBot } = require('./core/daftbot.js'),
	fs = require('fs'),
	util = require('util'),
	daftBot = new DaftBot();

var date = new Date();
var logName =  `${date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()}-${date.getUTCMonth() < 10 ? `0${date.getUTCMonth()}` : date.getUTCMonth()}-${date.getUTCFullYear()}`;
var logFile = fs.createWriteStream(`data/logs/log_daftbot_mobbot_${logName}.log`, { flags: 'a' }); // 'w' to truncate | 'a' to agglomerate
var logStdout = process.stdout;

console.log = function () {
	logFile.write(util.format.apply(null, arguments) + '\n');
	logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

daftBot.onConnect();