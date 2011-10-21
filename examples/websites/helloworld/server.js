var express = require('express');
var jshtml = require('jshtml');

var port = parseInt(process.argv.pop());
var app = express.createServer();
app.configure(function() {
	app.use(express.bodyParser());
	//app.use(jshtml.script());
	app.use(app.router);
});

app.set('view engine', 'jshtml');
app.get('/', function(req, res) {
	res.render('index', {
		title : 'Test!',
		message : 'De groeten',
		list : [ 'een', 'twee', 'drie' ]
	});
});

app.listen(port);
