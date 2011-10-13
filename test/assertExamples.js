var assert = require('assert');
var fs = require('fs');
var jsHtml = require('../main');
var util = require('../lib/util');
var srcDir = __dirname + '/../examples/';
var testData = require('./testData');

var whitespaceRegex = /\s+/g;

fs.readdirSync(srcDir).forEach(function(file) {
    var match = /(.+)\.html$/i.exec(file);
    if (!match) return;
	
	console.log('[' + match[1] + ']');
	var expect = fs.readFileSync(srcDir + match[1] + '.html', 'utf8');
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
	
	jsHtml.renderAsync(write, end, fs.readFileSync(srcDir + match[1] + '.jshtml', 'utf8'), testData);
	
});


