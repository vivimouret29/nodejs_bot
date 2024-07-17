'use.strict'

const { DaftBot } = require('./core/daftbot.js'),
	fs = require('fs'),
	util = require('util'),
	{ getCurrentDatetime } = require('./core/utils.js'),
	moment = require('moment-timezone'),
	utc2 = moment().tz('Europe/Paris'),
	daftBot = new DaftBot();

var logName = utc2.format('DD-MM-YYYY'),
	logFile = fs.createWriteStream(`data/logs/log_daftbot_mobbot_${logName}.log`, { flags: 'a' }), // 'w' to truncate | 'a' to agglomerate
	logStdout = process.stdout,
	results = [];

fs.readdirSync(__dirname).forEach(function (file) { results.push(file); });
results = results.reverse();
console.log(`[${getCurrentDatetime('comm')}] ` + util.inspect(results, false, null, true));

console.log = function () {
	logFile.write(util.format.apply(null, arguments) + '\n');
	logStdout.write(util.format.apply(null, arguments) + '\n');
};

console.error = console.log;

daftBot.onConnect();