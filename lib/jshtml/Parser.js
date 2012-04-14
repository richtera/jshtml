/*!
 * JsHtml
 * Copyright(c) 2012 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */


var util = require("util");
var assert = require("assert");
var RootContext = require('./RootContext');
var tools = require('../tools');





var base = require("2kenizer");
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.onToken = function onToken(token, buffer) {
		/*
		if there is no token, we are finished
		*/
		if(token)	{
			console.log(token);
			this.context.echo(buffer.substring(0, token.index), {useFilter:true});
			do{
				var previousContext = this.context;
				token.redo = false;
				this.context = this.context.onToken(token);
				this.categories = this.context.categories;
			} while(token.redo);
		}
		else{
			this.context.content += buffer;
			this.context.echo(buffer, {useFilter:true, atEnd:true});
			this.context = this.context.end(token);
			this.categories = null;
			assert.ifError(this.context);
		}

	};//onToken


	return target;

})(function(echo, options){
	var options = tools.extend({anchor: "@", textTag: "text", debug: false, trace: false}, options);
	var regExpAnchor = tools.regExpEncode(options.anchor);
	var expressions = {
		"anchor":	new RegExp("(\\w*)" + regExpAnchor + "((?:" + regExpAnchor + ")*)(?=[^])")

		//, "default":	null
		, "whitespace":	/\s+/
		, "semicolon":	";"		

		, "jsIdentifier":	/[$_A-Za-z][$_A-Za-z0-9]*/

		, "jsBeginBlock":	"{"
		, "jsEndBlock":	"}"
		
		, "jsBeginGroup":	"("
		, "jsEndGroup":	")"
		
		, "jsBeginArray":	"["
		, "jsEndArray":	"]"

		, "jsDoubleQuote":	/"(?:\\.|.)*?[^\\]?"/
		, "jsSingleQuote":	/'(?:\\.|.)*?[^\\]?'/
		, "jsRegExp":		/\/(?:\\.|.)+?[^\\]?\/[gim]*/

		, "jsCommentLine":	/\/\/.*?\n/
		, "jsCommentBlock":	/\/\*[\s\S]*?\*\//

		, "tagComment":	/<!--[\s\S]*?-->\s*/
		, "tag":		/<([\w:]+)/
		, "tag1":		/(\/?>)\s*/
		, "tag2":		/<\/([\w:]+)\s*>\s*/
	};

	base.call(this, this.onToken, expressions, options);

	this.context = new RootContext(echo);
	this.categories = this.context.categories;
});

