var util = require("util");
var assert = require("assert");



var base = Object;
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.categories = [];

	target.prototype.onToken = function(token){
		throw 'unexpected token ' + token.category;
	};//onToken

	target.prototype.echo = function(data, state){
		this.parent && this.parent.echo(data, {});
	};//echo

	target.prototype.end = function(endToken){
		//this.echo(this.suffix);
		return this.parent;
	};//end

	return target;

})(function(parent, beginToken){

	base.call(this);

	this.parent = parent;
});


