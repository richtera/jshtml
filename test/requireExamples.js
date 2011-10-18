var path = require('path');
var fs = require('fs');
var jsHtml = require('../main');
var util = require('../lib/util');

function runDirectory(dirPath, options)	{
	try	{
		options = util.extend({}, options, JSON.parse(fs.readFileSync(dirPath + '.json', 'utf-8')));
	}
	catch(ex){}
	
	fs.readdirSync(dirPath).forEach(function(subPath) {
		var filePath = dirPath + '/' + subPath;
		var fileStat = fs.statSync(filePath);
		if(fileStat.isDirectory()) runDirectory(filePath, options);
		if(fileStat.isFile()) runFile(filePath, options);
	});
}

function runFile(filePath, options)	{
	var match = /((.*\/)?(.+))\.jshtml$/i.exec(filePath);
	if (!match) return;

	console.log('[' + match[3] + ']');

	try	{
		options = util.extend({}, options, JSON.parse(fs.readFileSync(match[1] + '.json')));
	}
	catch(ex){}

	function write() {}
	function end() {}

	var fn = require(match[1]);
	fn.call(options.scope, write, end, options.locals);	
}

runDirectory(path.normalize(__dirname + '/../examples'), {
	locals:	{
		body: ''
		, partial: function(){}
	}
});


