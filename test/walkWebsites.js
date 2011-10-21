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
	walkUrl('http://localhost:' + options.port + '/', function(){
		server.kill('SIGHUP');
	});
}

function walkUrl(url, cb)	{
	zombie.visit(url, function (err, browser, status) {
		console.log(url + '\t' + status);
		assert.ifError(err);
		console.log(browser);
		//console.log(browser.querySelectorAll('a'));
		cb && cb();		
	});
}

runDirectory(path.normalize(__dirname + '/../examples/websites'), {});


