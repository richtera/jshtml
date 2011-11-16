/*!
 * JsHtmlParser
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var assert = require('assert');
var Tokenizer = require('2kenizer');
var util = require('./util');
var expressions = require('./expressions');
var filters = require('./filters');
var StackableWriter = require('./StackableWriter');

function JsHtmlParser(writeCallback, options) {
	var options = util.extend({anchor: "@", textTag: "text", debug: false, trace: false}, options);
	var parser = this;
	var tokenizer = new Tokenizer(onToken, expressions(options));

	var line = 0;

	function write()	{
		if(options.trace)	{
			var argumentCount = arguments.length;
			for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex++)	{
				var argument = arguments[argumentIndex];
				console.log(argument);
			}	
		}
		writeCallback.apply(null, arguments);
	}

	/*
	when a new token is found...
	*/
	function onToken(token, buffer) {
		/*
		if there is no token, we are at the end!
		*/
		if(token)	{
			currentContext.writer.write(buffer.substr(0, token.index));
		}
		else	{
			currentContext.writer.write(buffer);
			assert.equal(contextStack.length, 1, "Parse error");
			write("end();");
			return;
		}
		

		/*
		if the debug option is on, track the line number
		*/
		if(options.debug)	{
			for(var index = buffer.indexOf(newline); ~index && index < token.index; index = buffer.indexOf(newline, index + newline.length))	{
			line++;
			}
		}
		
		/*
		call the function that matches the category
		*/
		actions[token.category].apply(null, arguments);
	}


	/*
	array tha holds all contexts
	*/
	var contextStack = [];
	/*
	holds the context we are currently in
	*/
	var currentContext;
	/*
	push the context to the stack and change che currentContext
	to it.
	*/
	function enterContext(context)	{
		currentContext = context;
		tokenizer.filter(currentContext.filter);
		contextStack.unshift(currentContext);
	}
	/*
	pop the contextStack and change the currentContext to the previous
	*/
	function exitContext()	{
		currentContext.writer.end();
		contextStack.shift();
		if(contextStack.length > 0)	{
			currentContext = contextStack[0];
			tokenizer.filter(currentContext.filter);
		}
		else	{
			delete currentContext;
			delete tokenizer;
		}
	}




	var expressionSet = expressions(options);
	var expressionFilters = filters(options);





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
	

	enterContext({
		filter: expressionFilters.root
		, writer: new StackableWriter(write, htmlWriteOptions)
	});

	var actions = {
		'anchorEscaped':	function(token, buffer)	{
			currentContext.writer.write(token[1]);
		}

		, 'anchorGroup':		function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer, jsWriteOptions)
			});
		}

		, 'anchorGroup1':	function(token, buffer)	{
			exitContext();
		}


		, 'anchorBlock':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
		}
		
		, 'anchorBlock1':	function(token, buffer)	{
			exitContext();
		}



		, 'anchorInline':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer, jsInlineOptions, {requireVariable: token[1], anchor: options.anchor})
			});
			currentContext.writer.write(token[1]);
		}

		, 'anchorInline1':	function(token, buffer)	{
			/*
			 * without ';' at the end, we should encode it and write it
			 * example: @instance.member()
			 * 
			 * with ';' at the end, we should not write it example:
			 * @instance.member();
			 */
			currentContext.writer.write(token[1]);
			if(!token[1]) {
				currentContext.writer.setOptions(jsInlineWriteOptions);
			}
			exitContext();
		}


			
		, 'anchorIfElse':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}
		, 'anchorFor':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}
		, 'anchorWhile':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}
		, 'anchorDoWhile':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}
		, 'anchorSwitch':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}
		, 'anchorWith':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}
		, 'anchorFunction':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[1]);
		}

		, 'anchorIfElse1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorIfElse2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorIfElse3':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorFor1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorFor2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorWhile1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorWhile2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorDoWhile1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorDoWhile2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorSwitch1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorSwitch2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorWith1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorWith2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorFunction1':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}
		, 'anchorFunction2':	function(token, buffer)	{
			if (token[1]) {
				if (token[2]) {
					currentContext.writer.write(token[1]);
					currentContext.writer.write(token[2]);
					exitContext();
				}
				else{
					currentContext.writer.write(token[1]);
					exitContext();
					enterContext({
						filter:	expressionFilters[token.category]
						, writer:	new StackableWriter(currentContext.writer)
					});
				}
			}
			else{
				exitContext();
			}
		}



		, 'jsStringEscaped':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
		}


		, 'jsCommentLine':	function(token, buffer)	{
		}
		, 'jsCommentBlock':	function(token, buffer)	{
		}

		, 'jsDoubleQuote':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
		}
		, 'jsSingleQuote':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
		}
		, 'jsRegExp':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
		}
			

		, 'jsMember':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[0]);
		}
		, 'jsGroup':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[0]);
		}
		, 'jsBlock':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[0]);
		}
		, 'jsArray':	function(token, buffer)	{
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer)
			});
			currentContext.writer.write(token[0]);
		}

		, 'jsMember1':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
			exitContext();
		}
		, 'jsGroup1':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
			exitContext();
		}
		, 'jsBlock1':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
			exitContext();
		}
		, 'jsArray1':	function(token, buffer)	{
			currentContext.writer.write(token[0]);
			exitContext();
		}



		, 'tagComment':	function(token, buffer)	{
		}


		, 'tag':	function(token, buffer)	{
			var tagName = token[1];
			var state = currentContext.state;
			if(!state)	{
				state = {tagName: tagName};
			}
			if(state.tagName != tagName)	{
				currentContext.writer.write(token[0]);
				return;
			}
			currentContext.writer.call(null, '{');
			enterContext({
				filter:	expressionFilters[token.category]
				, writer:	new StackableWriter(currentContext.writer, htmlWriteOptions)
				, state:	state
			});
			if(state.tagName != 'text')	{
				currentContext.writer.write(token[0]);
			}
		}

		, 'tag1':	function(token, buffer)	{
			var state = currentContext.state;
			if(state.tagName != 'text')	{
				currentContext.writer.write(token[0]);
			}
			exitContext();

			/*
			if this is a self-closing tag
			*/
			if(token[1] == '/')	{
				currentContext.writer.call(null, '}');
			}
			/*
			if this is nog a self-closing tag
			*/
			else	{
				enterContext({
					filter:	expressionFilters[token.category]
					, writer:	new StackableWriter(currentContext.writer, htmlWriteOptions)
					, state:	state
				});
			}
		}

		, 'tag2':	function(token, buffer)	{
			var tagName = token[1];
			var state = currentContext.state;
			if(state.tagName != tagName)	{
				currentContext.writer.write(token[0]);
				return;
			}
			if(state.tagName != 'text')	{
				currentContext.writer.write(token[0]);
			}
			exitContext();
			currentContext.writer.call(null, '}');
		}

	};

	util.extend(this, tokenizer, {});
}

// exports
module.exports = JsHtmlParser;



