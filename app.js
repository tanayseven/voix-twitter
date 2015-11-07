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
var bodyParser = require('body-parser');
var querystring = require('querystring');
var handlebars = require('handlebars');
var cons = require('consolidate');

var UserHandler = new require('./src/user_controller');
var user = new UserHandler();

var app = express();
app.set('views',__dirname+'/views/');

var port = Number(process.env.PORT || 5000);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

function compileAndRenderPage(file_name,res,args) {
	if (typeof(args) === 'undefined'){
		args = {};
	}
	cons.handlebars('views/' + file_name, args, function(err, html){
	  if (err) throw err;
		res.send(html);
	});
}

app.get('/', function (req, res) {
	compileAndRenderPage('index.hbs',res);
});

app.post('/login', function (req, res) {
  user.loginUser(req.body,function (ret){
    console.log(JSON.stringify(ret));
    if (ret.success) {
      compileAndRenderPage('logged_in.hbs',res,{login:ret});
    } else {
      compileAndRenderPage('index.hbs',res,{login:ret});
    }
  });
});

app.get('/signup', function (req, res) {
  compileAndRenderPage('register.hbs',res);
});

app.post('/submit_new_acc', function (req, res) {
  user.registerUser(req.body,function (ret) {
    compileAndRenderPage('index.hbs',res,{registered:ret});
  });
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Pitchy Bird started at http://%s:%s', host, port);
});
