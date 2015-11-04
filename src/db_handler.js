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

var connString = 'mongodb://127.0.0.1:27017/voix-twitter';
var mongo = require('mongodb');
var twitter_handler = require('./twitter_controller');
var db = require('monk')(connString);

function DatabaseHandler(){
	this.users = db.get('users');
	if (this.db) {
		console.log('Connected successfully');
	}
}
DatabaseHandler.prototype.__fetchIfExists = function(doc, obj, callback) {
	this[doc].find(obj, function(err, doc){
		console.log(doc);
		if (doc) {
			callback(doc);
		}
	});
};

DatabaseHandler.prototype.__extractRegistrationDetails = function(raw_obj) {
	var obj = {
		username : raw_obj.username,
		password : raw_obj.password,
		email : raw_obj.email
	};
	return obj;
};

DatabaseHandler.prototype.registerUser = function(raw_obj) {
	console.log('Registring user');
	var obj = this.__extractRegistrationDetails(raw_obj);
	this.__fetchIfExists('users',{$or: [ {username:obj.username}, {email:obj.email} ] } , function(obj) {
		if (obj[0]) {
			console.log("Already exists");
		} else {
			this.users.insert(obj);
		}
	});
};

DatabaseHandler.prototype.__extractLoginDetails = function(raw_obj) {
	var obj = {
		username: raw_obj.username,
		password: raw_obj.password
	};
	return obj;
};

DatabaseHandler.prototype.loginUser = function(obj) {
	this.__fetchIfExists('users',{username:obj.username, password:obj.password}, function(obj){
		if(obj[0]){
			console.log("Successfully logged in");
		}
		else {
			console.log("Failed to login");
		}
	});
};

module.exports = DatabaseHandler;