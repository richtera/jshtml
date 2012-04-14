var util = require("util");
var assert = require("assert");



var base = require('./ContextBase');
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.echo = function(buffer){
		this.buffer += buffer;
	};//echo

	target.prototype.end = function(endToken){
		var result = base.prototype.end.apply(this, arguments);

		if(this.isAsync) base.prototype.echo.call(this, this.buffer);
		else base.prototype.echo.call(this, this.content);

		return result;
	};//end


	target.prototype.onToken = function(token){
		
		var JsBlockContext = require('./JsBlockContext');
		var JsGroupContext = require('./JsGroupContext');
		var JsArrayContext = require('./JsArrayContext');

		var JsAsyncContext = require('./JsAsyncContext');
		var JsWhileContext = require('./JsWhileContext');
		var JsIfContext = require('./JsIfContext');
		var JsForContext = require('./JsForContext');

		var TagContext = require('./TagContext');

		switch(token.category){
			case 'jsCommentLine':
			case 'jsCommentBlock':
			return this;

			case 'whitespace':
			case 'semicolon':
			case 'jsDoubleQuote':
			case 'jsSingleQuote':
			case 'jsRegExp':
			this.echo(token[0]);
			return this;
		
			case 'jsBeginBlock':
			return new JsBlockContext(this, token);

			case 'jsBeginGroup':
			return new JsGroupContext(this, token);

			case 'jsBeginArray':
			return new JsArrayContext(this, token);

			case 'jsIdentifier':
			switch(token[0]){
				case 'async':
				return new JsAsyncContext(this, token);

				case 'while':
				return new JsWhileContext(this, token);

				case 'if':
				return new JsIfContext(this, token);

				case 'for':
				return new JsForContext(this, token);

				case 'do':
				throw 'do is not (yet) supported!!!';
				
				case 'switch':
				throw 'switch is not (yet) supported!!!';

				default:
				this.echo(token[0]);
				return this;
			}

			case 'tag':
			return new TagContext(this, token);
		}

	};//onToken


	return target;

})(function(parent, beginToken){
	base.call(this, parent, beginToken);

	this.buffer = '';
});



