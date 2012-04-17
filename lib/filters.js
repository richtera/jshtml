var util = require("./util");

module.exports = function(options) {
	return {
		root:		['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorGroup', 'anchorBlock', 'anchorInline'
			, 'tagComment'
			]
		, tag:	['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorGroup', 'anchorBlock', 'anchorInline', 'tag1'
			, 'tagComment'
			]
		, tag1:		['anchorEscaped', 'anchorIfElse', 'anchorFor', 'anchorWhile', 'anchorDoWhile', 'anchorSwitch', 'anchorWith'
			, 'anchorFunction', 'anchorGroup', 'anchorBlock', 'anchorInline', 'tag', 'tag2'
			, 'tagComment'
			]

		, anchorInline:	['jsMember', 'jsBlock', 'jsGroup', 'jsArray', 'anchorInline1']
		, anchorGroup:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorGroup1']
		, anchorBlock:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorBlock1']

		, anchorIfElse:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorIfElse1']
		, anchorIfElse1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorIfElse2']
		, anchorIfElse2:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorIfElse3']

		, anchorFor:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorFor1']
		, anchorFor1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorFor2']

		, anchorWhile:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorWhile1']
		, anchorWhile1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorWhile2']

		, anchorDoWhile:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorDoWhile1']
		, anchorDoWhile1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorDoWhile2']

		, anchorSwitch:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorSwitch1']
		, anchorSwitch1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorSwitch2']

		, anchorWith:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorWith1']
		, anchorWith1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorWith2']

		, anchorFunction:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'anchorFunction1']
		, anchorFunction1:	['jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag', 'anchorFunction2']


		, jsBlock:	['jsBlock1', 'jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock', 'tag']
		, jsGroup:	['jsGroup1', 'jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock']
		, jsArray:	['jsArray1', 'jsBlock', 'jsGroup', 'jsArray', 'jsSingleQuote', 'jsDoubleQuote', 'jsRegExp', 'jsCommentLine', 'jsCommentBlock']
		, jsMember:	['jsMember', 'jsBlock', 'jsGroup', 'jsArray', 'jsMember1']
	};
}





