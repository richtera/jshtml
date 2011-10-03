/*!
 * jshtml
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');
var JsHtmlParser = require('./lib/JsHtmlParser');
var util = require('./lib/util');


var cache = {};

function compile(template, options) {
	var fnSrc = '';
	var parser = new JsHtmlParser(function(data) {
		fnSrc += data;
	}, options);
	parser.end(template);

	var fn = new Function('locals', 'util', 'write', 'end', 'tag', 'partial', 'body', 'with(locals){' + fnSrc + '}');

	return function(locals, endCallback) {
		var buffer = '';

		function write()	{
			var argumentCount = arguments.length;
			for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex++){
				var argument = arguments[argumentIndex];
				buffer += util.str(argument);
			}
		}
		function end()	{
			write.apply(null, arguments);
			
			endCallback && endCallback.call(null);
		}

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

			buffer += '<';
			buffer += tagName;
			tagAttributeSetList.forEach(function(tagAttributeSet) {
				buffer += ' ';
				buffer += util.htmlAttributeEncode(tagAttributeSet);
			});
			if(hasContent) {
				buffer += '>';

				tagContentList.forEach(function(tagContent) {
					switch(typeof tagContent) {
						case 'function':
						tagContent();
						break;

						default:
						buffer += util.htmlLiteralEncode(tagContent);
					}
				});

				buffer += '</';
				buffer += tagName;
				buffer += '>';
			}
			else{
				buffer += ' />';
			}
		}

		function partial() {
			write(locals.partial.apply(null, arguments));
		}

		function body() {
			write(locals.body);
		}

		fn(locals, util, write, end, tag, partial, body);

		return buffer;
	};
}

function render(template, options) {
	var options = util.extend({}, options);
	var fn = options.filename 
		? (cache[options.filename] || (cache[options.filename] = compile(template, options)))
		: compile(template, options)
		;
	return fn.call(options.scope, options.locals || {});
}

//exports
exports.compile = compile;
exports.render = render;



