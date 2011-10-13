var assert = require('assert');
var fs = require('fs');
var jsHtml = require('../main');
var srcDir = __dirname + '/../examples/';
var testData = require('./testData');

fs.readdirSync(srcDir).forEach(function(file) {
    var match = /(.+)\.jshtml$/i.exec(file);
    if (!match) return;
	
	console.log('[' + match[1] + ']');

	jsHtml.renderAsync(write, end, fs.readFileSync(srcDir + match[0], 'utf8'), testData);

	function write() {}
	function end() {}
});
