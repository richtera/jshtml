/*!
 * jshtml
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');
var assert = require('assert');
var JsHtmlParser = require('./lib/JsHtmlParser');
var util = require('./lib/util');


var cache = {};

function compile(template, options) {

	return function(locals)	{
		var buffer = '';
		var atEnd = false;
	
		function write()	{
			var argumentCount = arguments.length;
			for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex++){
				var argument = arguments[argumentIndex];
				buffer += util.str(argument);
			}
		}
		function end()	{
			write.apply(this, arguments);
			atEnd = true;
		}
		
		compileAsync(template, options).call(this, write, end, locals);

		assert.ok(atEnd, 'not ended');
		
		return buffer;
	}
}

function render(template, options) {
	var options = util.extend({}, options);
	var fn = options.filename 
		? (cache[options.filename] || (cache[options.filename] = compile(template, options)))
		: compile(template, options)
		;
	return fn.call(options.scope, options.locals || {});
}



var cacheAsync = {};

function compileAsync(template, options) {
	var fnSrc = '';
	var parser = new JsHtmlParser(function(data) {
		fnSrc += data;
	}, options);
	parser.end(template);

	var fn = new Function('write', 'end', 'tag', 'partial', 'body', 'util', 'locals', fnSrc);

	return function(writeCallback, endCallback, locals) {

		function tag(tagName) {
			var tagAttributeSetList = [];
			var tagContentList = [];
			var argumentCount = arguments.length;
			var hasContent = false;
			for(var argumentIndex = 1; argumentIndex < argumentCount; argumentIndex++){
				var argument = arguments[argumentIndex];
				switch(typeof argument) {
					case 'object':
					tagAttributeSetList.push(argument);
					break;

					default:
					hasContent = true;
					tagContentList.push(argument);
				}
			}

			writeCallback.call(this, '<', tagName);
			tagAttributeSetList.forEach(function(tagAttributeSet) {
				writeCallback.call(this, ' ', util.htmlAttributeEncode(tagAttributeSet));
			});
			if(hasContent) {
				writeCallback.call(this, '>');

				tagContentList.forEach(function(tagContent) {
					switch(typeof tagContent) {
						case 'function':
						tagContent();
						break;

						default:
						writeCallback.call(this, util.htmlLiteralEncode(tagContent));
					}
				});

				writeCallback.call(this, '</', tagName, '>');
			}
			else{
				writeCallback.call(this, ' />');
			}
		}

		function partial() {
			write(locals.partial.apply(this, arguments));
		}

		function body() {
			write(locals.body);
		}

		fn(writeCallback, endCallback, tag, partial, body, util, locals);
	};
}

function renderAsync(writeCallback, endCallback, template, options) {
	var options = util.extend({}, options);
	var fn = options.filename 
		? (cacheAsync[options.filename] || (cacheAsync[options.filename] = compileAsync(template, options)))
		: compileAsync(template, options)
		;
	fn.call(options.scope, writeCallback, endCallback, options.locals || {});
}


//exports
exports.compileAsync = compileAsync;
exports.renderAsync = renderAsync;
exports.compile = compile;
exports.render = render;



