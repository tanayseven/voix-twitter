// The MIT License (MIT)

// Copyright (c) 2015 Tanay PrabhuDesai

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require('querystring');
var handlebars = require('handlebars');
var http = require('http')
var cons = require('consolidate');

var UserHandler = new require('./src/user_controller');
var user = new UserHandler();

// var TwitterController = new require('./src/twitter_controller');
// var twitter = new TwitterController();

var PollController = new require('./src/poll_controller');
var poll = new PollController();

app.set('views',__dirname+'/views/');

app.use(express.static('public'));

app.set("ipaddr", "127.0.0.1");
app.set("port", Number(process.env.PORT || 5000));
var io = require("socket.io").listen(http.createServer(app).listen(app.get("port"),function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
})
);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

handlebars.registerHelper('json', function(context) {
	return JSON.stringify(context);
});

function assignUserToObj(obj) {
	obj.username = user.username;
	obj.email = user.email;
	return obj;
}

var replySent = false;
function compileAndRenderPage(file_name,res,args) {
	if (typeof(args) === 'undefined'){
		args = {};
	}
	args = assignUserToObj(args);
	// console.log(file_name+' '+args);
	cons.handlebars('views/' + file_name, args, function(err, html){
	  if (err){
			// throw err;
		} else {
			res.send(html);
		}
	});
}

app.get('/', function (req, res) {
	console.log("called /");
	// poll.assignDummy();
	// poll.fetchTweets('afwdad',function(ret){
	// 	console.log("done fetching");
	// });
	compileAndRenderPage('home.hbs',res);
});

app.post('/login', function (req, res) {
  user.loginUser(req.body,function (ret){
		var obj = {login:ret}
    if (ret.success) {
      compileAndRenderPage('home.hbs',res,obj);
    } else {
      compileAndRenderPage('home.hbs',res,obj);
    }
  });
});

app.get('/signup', function (req, res) {
  compileAndRenderPage('register.hbs',res);
});

app.post('/submit_new_acc', function (req, res) {
  user.registerUser(req.body,function (ret) {
		var obj = {registered:ret};
    compileAndRenderPage('home.hbs',res,obj);
  });
});

app.get('/create_poll',function (req,res) {
	compileAndRenderPage('create_poll.hbs',res);
});

app.post('/submit_new_poll', function (req,res) {
	// console.log(JSON.stringify(req.body));
	poll.createPoll(req.body,function(ret){
		console.log(JSON.stringify(ret));
		compileAndRenderPage('home.hbs',res);
	});
});

app.post('/search_polls', function (req,res) {
	poll.search(req.body.search_query,function(ret) {
		console.log(JSON.stringify(ret));
		var obj = {polls:ret};
		compileAndRenderPage('results.hbs',res,obj);
	});
});

app.get('/poll/:id',function (req,res) {
	poll.streamTweets(req.params.id,function(ret){
		compileAndRenderPage('poll.hbs',res,ret);
	});
});

io.sockets.on('connection', function(socket){
	socket.emit('status',{connected:true});
	socket.on('register',function(msg){
		socket.join(poll.poll_id);
		poll.addSocket(socket);
	});
});
