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

function UserHandler(){
  this.db = db.get('user');
}

UserHandler.prototype.registerUser = function(obj,callback) {
  var parent = this;
  parent.db.findOne(obj,function(err,doc){
    if (err) throw err;
    if (!doc) {
      parent.db.insert(obj,function(err,doc){
        if (err) throw err;
        callback({success:true});
      });
    } else {
      callback({success:false});
    }
  });
};

UserHandler.prototype.loginUser = function(obj,callback) {
  var parent = this;
  parent.db.findOne(obj,function(err,doc) {
    if (err) throw err;
    if (!doc) {
      callback({success:false});
    } else {
      callback({success:true});
    }
  });
};

module.exports = UserHandler;