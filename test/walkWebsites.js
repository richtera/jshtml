var cp = require('child_process');
var zombie = require('zombie');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var jsHtml = require('zombie');
var util = require('../lib/util');

function runDirectory(dirPath, options)	{
	var extendOptionsJson = '{}';

	try	{
		extendOptionsJson = fs.readFileSync(dirPath + '.json', 'utf-8');
	}
	catch(ex)	{
	}
	
	var extendOptions = JSON.parse(extendOptionsJson);
	var options = util.extend({}, options, extendOptions);

	var hasServer = false;
	var serverPath = dirPath + '/' + options.server + '.js';
	var serverStat = null;

	try	{
		var serverStat = fs.statSync(serverPath);
	}
	catch(ex)	{
	}

	if(serverStat && serverStat.isFile())	{
		runServer(dirPath, options);
	}
	else	{
		fs.readdirSync(dirPath).forEach(function(subPath) {
			var filePath = dirPath + '/' + subPath;
			var fileStat = fs.statSync(filePath);
			if(fileStat.isDirectory()) runDirectory(filePath, options);
		});
	}
}

function runServer(rootPath, options)	{
	var server = cp.spawn('node', [options.server, options.port], {cwd: rootPath, customFds: [process.stdin.fd, process.stdout.fd, process.stderr.fd]});
	
	server.on('exit', function (code, signal) {
		assert.ifError(code);
	});
	
	setTimeout(function(){
		walkServer(server, options);
	}, options.startupDelay);
}

function walkServer(server, options){
	var history = [];
	var pendingVisits = 0;
	var rootUrl = 'http://localhost:' + options.port + '/';

	walkUrl(rootUrl) ;

	function beginVisit()	{
		pendingVisits++;
	}
	function endVisit()	{
		pendingVisits--;
		if(!pendingVisits) server.kill('SIGHUP');
	}

	function walkUrl(url)	{
		if(url.substring(0, rootUrl.length) != rootUrl) return;
		if(~history.indexOf(url)) return;
		history.push(url);
		beginVisit();
		zombie.visit(url, function (err, browser, status) {
			console.log(status + '\t' + url);
			assert.ifError(err);
		
			//console.log(browser);
			var links = browser.querySelectorAll('a');
			var linkCount = links.length;
			for(var linkIndex = 0; linkIndex < linkCount; linkIndex++)	{
				var link = links[linkIndex];
				walkUrl(link.href);
			}
			endVisit();
		});
	}
}

runDirectory(path.normalize(__dirname + '/../examples/websites'), {});


