var express = require('express');
var jshtml = require('jshtml');
var globalize = require('globalize');
require('globalize/lib/cultures/globalize.cultures');
globalize = globalize('nl');

var port = parseInt(process.argv.pop());
var app = express.createServer();
app.configure(function() {
 	app.use(express.static(__dirname + '/static', { maxAge: 60 * 60 * 24 }));
	app.use(express.bodyParser());
	app.use(app.router);
});

app.set('view engine', 'jshtml');
app.set('view options', {
	with:	'locals'
	, layout:	false
});

app.all('/', function(req, res, next)	{
	next();
});

app.get('/', function(req, res, next) {
	res.render('voorstel1', {
		globalize:	globalize
		, title:	'Nieuwsbrief'
		, newsLetter:	{
			recipient:	{
				firstName:	'Elmer'
				, lastName:	'Bulthuis'
				, email:	'elmerbulthuis@gmail.com'
			}
			, date:	new Date()
			, head:	{
				title:	'Payoff Ipsum Lorem '
				, subTitle:	'Lorem Lorem Ipsum Ipsum'
				, image:	'/resources/_demo1.jpg'
			}
			, articles:	[
				{
					title:	'Bespaar op uw energierekening!'
					, subTitle:	'Subtitle'
					, thumbnail:	null
					, paragraphs:	[
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac turpis quis arcu ornare bibendum in varius justo. Lorem ipsum viverra felis nec erat gravida sed pharetra dolor egestas. Phasellus at purus quis metus pulvinar volutpat nec non tortor.'
						, 'Praesent convallis fermentum arcu eget faucibus. Aenean a ligula id arcu fringilla molestie non non nulla. Vestibulum tempus magna nec sapien sodales luctus. '
						, 'Fusce luctus varius sem sed faucibus. Proin at nulla tellus, nec auctor mauris. Etiam vulputate, massa et convallis tristique, quam enim consectetur magna, a viverra ipsum elit nec velit. Sed commodo ornare ante id tempor. Praesent imperdiet mauris vitae lacus ultrices vitae tincidunt risus aliquam.'
					]	
				}
				, {
					title:	'Groene Stroom Windmolens'
					, subTitle:	globalize.format(new Date(), 'D')
					, thumbnail:	'/resources/_demo2.jpg'
					, paragraphs:	[
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac turpis quis arcu ornare bibendum in varius justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a tellus urna, ac volutpat leo. In porta, metus in convallis tincidunt, dolor tellus porta purus, sed facilisis ipsum lectus sed nibh.'
						, 'In convallis tellus eu sapien dignissim vel fermentum enim laoreet. Vivamus dapibus ultricies arcu quis aliquam. Nulla viverra felis nec erat gravida sed pharetra dolor egestas. Phasellus at purus quis metus pulvinar volutpat nec non tortor.'
						, 'Praesent convallis fermentum arcu eget faucibus. Aenean a ligula id arcu fringilla molestie non non nulla. Vestibulum tempus magna nec sapien sodales luctus.'
						, 'Fusce luctus varius sem sed faucibus. Proin at nulla tellus, nec auctor mauris. Etiam vulputate, massa et convallis tristique, quam enim consectetur magna, a viverra ipsum elit nec velit. Sed commodo ornare ante id tempor. Praesent imperdiet mauris vitae lacus ultrices vitae tincidunt risus aliquam.'
					]	
				}
				, {
					title:	'Waarom Groen? Lorem Ipsum'
					, subTitle:	null
					, thumbnail:	'/resources/_demo4.jpg'
					, paragraphs:	[
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac turpis quis arcu ornare bibendum in varius justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a tellus urna, ac volutpat leo. In porta, metus in convallis tincidunt, dolor tellus porta purus, sed facilisis ipsum lectus sed nibh. In convallis tellus eu sapien dignissim vel fermentum enim laoreet. Vivamus dapibus ultricies arcu quis aliquam. Nulla viverra felis nec erat gravida sed pharetra dolor egestas. Phasellus at purus quis metus pulvinar volutpat nec non tortor.'
					]	
				}
			]
			, newsLinks:	[
				{
					title:	'Interview Jan Jonker'
					, href:	''
				}
				, {
					title:	'Evenement uit de regio - Green Sensation'
					, href:	''
				}
				, {
					title:	'Ambassafeursavond was een succes!'
					, href:	''
				}
			]
		}
	});
});

app.listen(port);

console.log('nhec nieuwsbrief running at port ' + port);

