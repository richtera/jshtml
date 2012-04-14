var util = require("util");
var assert = require("assert");



var base = require('./ContextBase');
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.categories = base.prototype.categories.concat([
		"jsIdentifier"
		, "jsBeginBlock"
		, "jsBeginGroup"
	]);

	target.prototype.onToken = function(token){
		var AnchorInlineContext = require('./AnchorInlineContext');
		var AnchorBlockContext = require('./AnchorBlockContext');
		var AnchorGroupContext = require('./AnchorGroupContext');

		switch(token.category){
			case "jsIdentifier":
			return new AnchorInlineContext(this.parent, token);

			case "jsBeginBlock":
			return new AnchorBlockContext(this.parent, token);

			case "jsBeginGroup":
			return new AnchorGroupContext(this.parent, token);
		}

		return base.prototype.onToken.apply(this, arguments);
	};//onToken


	return target;

})(function(parent, beginToken){
	base.call(this, parent, beginToken);
});



