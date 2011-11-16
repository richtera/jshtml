var util = require("./util");

module.exports = function(options) {
	var anchorPattern = util.regExpEncode(options.anchor);

	return {
		anchorEscaped:	new RegExp('' + anchorPattern + '(' + anchorPattern + '+)')

		, anchorGroup:	new RegExp('' + anchorPattern + '\\(\\s*')
		, anchorGroup1:	/\s*\)/

		, anchorBlock:	new RegExp('' + anchorPattern + '\\{\\s*')
		, anchorBlock1:	/\s*\}/

		, anchorInline:	new RegExp('' + anchorPattern + '([$_A-Za-z][$_A-Za-z0-9]*)')
		, anchorInline1:	/^(;)?/

		, anchorIfElse:	new RegExp('' + anchorPattern + '(if\\s*\\()\\s*')
		, anchorIfElse1:	/(\))\s*/
		, anchorIfElse2:	/^\s*(else)?\s*/
		, anchorIfElse3:	/^/

		, anchorFor:	new RegExp('' + anchorPattern + '(for\\s*\\()\\s*')
		, anchorFor1:	/(\))\s*/
		, anchorFor2:	/^/

		, anchorWhile:	new RegExp('' + anchorPattern + '(while\\s*\\()\\s*')
		, anchorWhile1:	/(\))\s*/
		, anchorWhile2:	/^/
	
		, anchorDoWhile:	new RegExp('' + anchorPattern + '(do)\\s*')
		, anchorDoWhile1:	/(while\()/
		, anchorDoWhile2:	/(\))(;)/

		, anchorSwitch:	new RegExp('' + anchorPattern + '(switch\\s*\\()\\s*')
		, anchorSwitch1:	/(\))\s*/
		, anchorSwitch2:	/^/

		, anchorWith:	new RegExp('' + anchorPattern + '(with\\s*\\()\\s*')
		, anchorWith1:	/(\))\s*/
		, anchorWith2:	/^/


		, anchorFunction:	new RegExp('' + anchorPattern + '(function\\s+[$_A-Za-z][$_A-Za-z0-9]*\\s*\\()\\s*')
		, anchorFunction1:	/(\))\s*/
		, anchorFunction2:	/^/


		, jsMember:	/^\.[$_A-Za-z][$_A-Za-z0-9]*/
		, jsMember1:	/^/


		, "anchor":	options.anchor
		, "default":	/^/
		
		, "jsCommentLine":	/\/\/.*?\n/
		, "jsCommentBlock":	/\/\*[\s\S]*?\*\//
		, "jsDoubleQuote":	/"(?:\\.|.)*?[^\\]?"/
		, "jsSingleQuote":	/'(?:\\.|.)*?[^\\]?'/
		, "jsRegExp":	/\/(?:\\.|.)+?[^\\]?\/[gim]*/
		, "jsStatement":	/^[$_A-Za-z][$_A-Za-z0-9]*/
		, "jsMember":	/^\.[$_A-Za-z][$_A-Za-z0-9]*/
		, "jsEnd":	/^;?/
		, "jsBlock":	"{"
		, "jsBlock1":	"}"
		, "jsGroup":	"("
		, "jsGroup1":	")"
		, "jsArray":	"["
		, "jsArray1":	"]"

		, "tagComment":	/<!--[\s\S]*?-->\s*/
		, "tag":	/<([\w:]+)/
		, "tag1":	/\s*(\/?)>/
		, "tag2":	/<\/([\w:]+)\s*>/

	};
}





