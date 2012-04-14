var util = require("util");
var assert = require("assert");



var base = require('./JsContext');
module.exports = (function(target){
	util.inherits(target, base);

	target.prototype.tokenHandlerIndex = -1;
	target.prototype.nextTokenHandler = function(){
		this.tokenHandlerIndex++;
		if(this.tokenHandlerIndex < this.tokenHandlers.length) this.onToken = this.tokenHandlers[this.tokenHandlerIndex];
		else this.onToken = null;
	};

	target.prototype.tokenHandlers = [
		function(token){
			switch(token.category){
				case 'jsBeginGroup':
				this.echo(token[0]);
				this.nextTokenHandler();
				return this;

				default:
				return base.prototype.onToken.apply(this, arguments);
			}
		}
		, function(token){
			switch(token.category){
				case 'jsEndGroup':
				this.echo(token[0]);
				this.nextTokenHandler();
				return this;

				default:
				return base.prototype.onToken.apply(this, arguments);
			}
		}
		, function(token){
			switch(token.category){
				case 'jsBeginBlock':
				this.echo(token[0]);
				this.nextTokenHandler();
				return this;

				default:
				return base.prototype.onToken.apply(this, arguments);
			}
		}
		, function(token){
			switch(token.category){
				case 'jsEndBlock':
				this.echo(token[0]);
				return this.end(token);

				default:
				return base.prototype.onToken.apply(this, arguments);
			}
		}
	];



	return target;
})(function(parent, beginToken){
	assert.equal('while', beginToken[0]);

	base.call(this, parent, beginToken);

	this.echo(beginToken[0]);

	this.nextTokenHandler();
});



