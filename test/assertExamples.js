var assert = require('assert');
var path = require('path');
var fs = require('fs');
var jsHtml = require('../main');
var util = require('../lib/util');

var whitespaceRegex = /\s+/g;

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
	var match = /((.*\/)?(.+))\.html$/i.exec(filePath);
	if (!match) return;

	console.log('[' + match[3] + ']');

	try	{
		options = util.extend({}, options, JSON.parse(fs.readFileSync(match[1] + '.json')));
	}
	catch(ex){}

	var expect = fs.readFileSync(match[1] + '.html', 'utf-8');
	var actual = '';
	function write(){
		var argumentCount = arguments.length;
		for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex++){
			var argument = arguments[argumentIndex];
			actual += util.str(argument);
		}
	}
	function end(){
		write.apply(this, arguments);

		expect = expect.replace(whitespaceRegex, '');
		actual = actual.replace(whitespaceRegex, '');

		assert.equal(actual, expect);
	}

	jsHtml.renderAsync(write, end, fs.readFileSync(match[1] + '.jshtml', 'utf-8'), options);
}

runDirectory(path.normalize(__dirname + '/../examples'), {});


