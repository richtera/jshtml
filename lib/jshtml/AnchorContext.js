var util = require("util");
var assert = require("assert");



var base = require('./ContextBase');
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.categories = base.prototype.categories.concat([
		"jsIdentifier"
		, "jsBeginBlock"
		, "jsBeginGroup"
		, "default"
	]);

	target.prototype.onToken = function(token){
		var AnchorInlineContext = require('./AnchorInlineContext');
		var AnchorBlockContext = require('./AnchorBlockContext');
		var AnchorGroupContext = require('./AnchorGroupContext');

		if(token.index == 0)
		switch(token.category){
			case "jsIdentifier":
			return new AnchorInlineContext(this.end(), token);

			case "jsBeginBlock":
			return new AnchorBlockContext(this.end(), token);

			case "jsBeginGroup":
			return new AnchorGroupContext(this.end(), token);
		}

		this.echo('write(' + JSON.stringify(this.beginToken[0]) + ');');
		return this.end();
	};//onToken


	return target;

})(function(parent, beginToken){
	base.call(this, parent, beginToken);

	this.beginToken = beginToken;
});



