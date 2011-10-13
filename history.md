2011-10-13
==========

require ; after dowhile. this

	do	{
	<p>bla</p>
	} while(false)

no longer works, and should be converted to this:

	do	{
	<p>bla</p>
	} while(false);
	

the control blocks are no longer required, so this:

	if(true)	{
		<p>true</p>
	}
	else	{
		<p>false</p>
	}

could now also be written as this:

	if(true)
		<p>true</p>
	else
		<p>false</p>


removed with(locals) statement from the function body. this:

	<html>
	<head>
	<title>@title</title>
	</head>
	<body>
	</body>

should now be written as this:

	<html>
	<head>
	<title>@locals.title</title>
	</head>
	<body>
	</body>

or this:

	@with(locals)
	<html>
	<head>
	<title>@title</title>
	</head>
	<body>
	</body>

