var util = require("util");
var assert = require("assert");



var base = require('./ContextBase');
module.exports = (function(target){

	util.inherits(target, base);

	target.prototype.echo = function(data, state){
		if(state.useFilter){
			if(state.atEnd){
				this.write('end(' + JSON.stringify(data) + ');');
			}
			else{
				this.write('write(' + JSON.stringify(data) + ');');
			}
		}
		else{
			echo(data);
		}
	}

	target.prototype.categories = [
		"tagComment"
		, "anchor"
	];

	target.prototype.onToken = function(token){
		var AnchorContext = require('./AnchorContext');
		
		switch(token.category){
			case 'tagComment':
			return this;

			case 'anchor':
			return new AnchorContext(this, token);
		}

		return base.prototype.onToken.apply(this, arguments);
	};//onToken


	return target;

})(function(write){
	this.write = write;

	base.call(this, null, null);
});



