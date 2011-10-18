2011-10-18
==========

Raining in Den Haag. Today I take my first MSTC exam.


Breaking change
----------

use writeBody() / writePartial(view) instead of body() and partial(view).

and remember, this:

	@{
	writePartial('header');
	writeBody();
	}

or this:

	@writePartial('header');
	@writeBody();

but this

	@writePartial('header')
	@writeBody()

is bad!


Bugfix
----------

I was using JSON.encode instead of JSON.parse in the unit tests. Very stupid indeed.



