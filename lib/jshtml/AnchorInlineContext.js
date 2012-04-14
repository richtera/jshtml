var util = require("util");
var assert = require("assert");



var base = require('./ContextBase');
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.categories = base.prototype.categories.concat([
		"semicolon"
	]);

	target.prototype.onToken = function(token){
		switch(token.category){
			case 'semicolon':
			return this.end(token);

			default:
			return base.prototype.onToken.apply(this, arguments);
		}

	};//onToken


	return target;

})(function(parent, beginToken){
	base.call(this, parent, beginToken);

	this.buffer = '';
});



