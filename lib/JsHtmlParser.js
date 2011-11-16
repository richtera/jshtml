/*!
 * JsHtmlParser
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var assert = require('assert');
var util = require('./util');
var expressions = require('./expressions');
var StackableWriter = require('./StackableWriter');
var ContextualParser = require('./ContextualParser');

function JsHtmlParser(writeCallback, options) {
	var writeEnd = true;
	var parser = this;
	var options = util.extend({anchor: '@'}, options);

	var anchorPattern = '';
	options.anchor.split('').forEach(function(ch){anchorPattern += '\\' + ch;});
	
	var expressionSet = expressions(options);


	var expressionFilters = {
		root:		['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorAsync', 'anchorGroup', 'anchorBlock', 'anchorInline'
			]
		, tag:	['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorAsync', 'anchorGroup', 'anchorBlock', 'anchorInline', 'tag1'
			]
		, tag1:		['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorAsync', 'anchorGroup', 'anchorBlock', 'anchorInline', 'tag', 'tag2'
			]

		, anchorInline:	['jsMember', 'jsBlock', 'jsGroup', 'jsArray', 'anchorInline1']
		, anchorGroup:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorGroup1']
		, anchorBlock:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorBlock1']

		, anchorIfElse:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorIfElse1']
		, anchorIfElse1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorIfElse2']
		, anchorIfElse2:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorIfElse3']

		, anchorFor:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorFor1']
		, anchorFor1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorFor2']

		, anchorWhile:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorWhile1']
		, anchorWhile1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorWhile2']

		, anchorDoWhile:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorDoWhile1']
		, anchorDoWhile1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorDoWhile2']

		, anchorSwitch:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorSwitch1']
		, anchorSwitch1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorSwitch2']

		, anchorWith:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorWith1']
		, anchorWith1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorWith2']

		, anchorFunction:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'anchorFunction1']
		, anchorFunction1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorFunction2']

		, anchorAsync:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag', 'anchorAsync1']
		, anchorAsync1:	['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorAsync', 'anchorGroup', 'anchorBlock', 'anchorInline', 'anchorAsync2']

		, jsBlock:	['jsBlock1', 'jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'tag']
		, jsGroup:	['jsGroup1', 'jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote']
		, jsArray:	['jsArray1', 'jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote']
		, jsMember:	['jsMember', 'jsBlock', 'jsGroup', 'jsArray', 'jsMember1']
		, jsDoubleQuote:	['jsStringEscaped', 'jsDoubleQuote1']
		, jsSingleQuote:	['jsStringEscaped', 'jsSingleQuote1']
	};


	var htmlWriteOptions = util.extend({}, options, {
		writeFilter: function(data, state) {
			var str = data;
			if(!str) return '';
			return ('write(' + JSON.stringify(str) + ');');
		}
	});
	var jsWriteOptions = util.extend({}, options, {
		streaming: false
		, flushFilter: function(data, state) {
			return ('write(' + data + ');');
		}
	});
	var jsInlineOptions = util.extend({}, options, {
		streaming: false
		, flushFilter: function(data, state) {
			return (''
			+ 'if(typeof ' + state.requireVariable + ' == "undefined") write(util.htmlEncode(' + JSON.stringify(options.anchor + data) + '));'
			+ 'else ' + data + ''
			);
		}
	});
	var jsInlineWriteOptions = util.extend({}, options, {
		streaming: false
		, flushFilter: function(data, state) {
			return (''
			+ 'if(typeof ' + state.requireVariable + ' == "undefined") write(util.htmlEncode(' + JSON.stringify(options.anchor + data) + '));'
			+ 'else write(' + data + ');'
			);
		}
	});
	
	var rootContext = {
		filter: expressionFilters.root
		, writer: new StackableWriter(writeCallback, htmlWriteOptions)
		};
	var innerParser = new ContextualParser(onParse, expressionSet, rootContext, options);


	function onParse(token) {
		//console.log(token.category, token[0]);
		switch (token.category) {
			case 'anchorEscaped':
			innerParser.getWriter().write(token[1]);
			break;

			case 'anchorGroup':
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter(), jsWriteOptions));
			break;

			case 'anchorGroup1':
			innerParser.popContext();
			break;


			case 'anchorBlock':
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter()));
			break;
		
			case 'anchorBlock1':
			innerParser.popContext();
			break;


			case 'anchorAsync':
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter()));
			innerParser.getWriter().write('function async() {');
			innerParser.getWriter().write('delete async;');
			break;

			case 'anchorAsync1':
			innerParser.getWriter().write('}');
			innerParser.getWriter().write('function sync() {');
			innerParser.getWriter().write('delete sync;');
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter(), htmlWriteOptions));
			break;

			case 'anchorAsync2':
			innerParser.popContext();
			if(writeEnd) {
				innerParser.getWriter().write('end();');
				writeEnd = false;
				}
			innerParser.getWriter().write('}');
			innerParser.getWriter().write('async();');
			innerParser.popContext();
			break;


			case 'anchorInline':
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter(), jsInlineOptions, {requireVariable: token[1], anchor: options.anchor}));
			innerParser.getWriter().write(token[1]);
			break;

			case 'anchorInline1':
			/*
			 * without ';' at the end, we should encode it and write it
			 * example: @instance.member()
			 * 
			 * with ';' at the end, we should not write it example:
			 * @instance.member();
			 */
			innerParser.getWriter().write(token[1]);
			if(!token[1]) {
				innerParser.getWriter().setOptions(jsInlineWriteOptions);
			}
			innerParser.popContext();
			break;


			
			case 'anchorIfElse':
			case 'anchorFor':
			case 'anchorWhile':
			case 'anchorDoWhile':
			case 'anchorSwitch':
			case 'anchorWith':
			case 'anchorFunction':
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter()));
			innerParser.getWriter().write(token[1]);
			break;

			case 'anchorIfElse1':
			case 'anchorIfElse2':
			case 'anchorIfElse3':
			case 'anchorFor1':
			case 'anchorFor2':
			case 'anchorWhile1':
			case 'anchorWhile2':
			case 'anchorDoWhile1':
			case 'anchorDoWhile2':
			case 'anchorSwitch1':
			case 'anchorSwitch2':
			case 'anchorWith1':
			case 'anchorWith2':
			case 'anchorFunction1':
			case 'anchorFunction2':
			if (token[1]) {
				if (token[2]) {
					innerParser.getWriter().write(token[1]);
					innerParser.getWriter().write(token[2]);
					innerParser.popContext();
				}
				else{
					innerParser.getWriter().write(token[1]);
					innerParser.popContext();
					innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter()));
				}
			}
			else{
				innerParser.popContext();
			}
			break;



			case 'jsStringEscaped':
			innerParser.getWriter().write(token[0]);
			break;



			case 'jsMember':
			case 'jsDoubleQuote':
			case 'jsSingleQuote':
			case 'jsGroup':
			case 'jsBlock':
			case 'jsArray':
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter()));
			innerParser.getWriter().write(token[1]);
			break;

			case 'jsMember1':
			case 'jsDoubleQuote1':
			case 'jsSingleQuote1':
			case 'jsGroup1':
			case 'jsBlock1':
			case 'jsArray1':
			innerParser.getWriter().write(token[1]);
			innerParser.popContext();
			break;


			case 'tag':
			var tagName = token[1];
			var state = innerParser.getState();
			if(!state)	{
				state = {tagName: tagName};
			}
			if(state.tagName != tagName)	{
				innerParser.getWriter().write(token[0]);
				return;
			}
			innerParser.getWriter().call(null, '{');
			innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter(), htmlWriteOptions),	state);
			if(state.tagName != 'text')	{
				innerParser.getWriter().write(token[0]);
			}
			break;

			case 'tag1':
			var state = innerParser.getState();
			if(state.tagName != 'text')	{
				innerParser.getWriter().write(token[0]);
			}
			innerParser.popContext();

			/*
			if this is a self-closing tag
			*/
			if(token[1] == '/')	{
				innerParser.getWriter().call(null, '}');
			}
			/*
			if this is nog a self-closing tag
			*/
			else	{
				innerParser.pushContext(expressionFilters[token.category], new StackableWriter(innerParser.getWriter(), htmlWriteOptions), state);
			}
			break;

			case 'tag2':
			var tagName = token[1];
			var state = innerParser.getState();
			if(state.tagName != tagName)	{
				innerParser.getWriter().write(token[0]);
				return;
			}
			if(state.tagName != 'text')	{
				innerParser.getWriter().write(token[0]);
			}
			innerParser.popContext();
			innerParser.getWriter().call(null, '}');
			break;

			default:
			throw 'unknown ' + token.category;
		}
		//console.log();
	}

	function end(){
		innerParser.end.apply(null, arguments);
		if(writeEnd) {
			writeCallback('end();');
			writeEnd = false;
		}
	}

	util.extend(this, innerParser, {
		end: end
	});
}

// exports
module.exports = JsHtmlParser;



