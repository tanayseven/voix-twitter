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

var connString = process.env.DB_CONN_STRING || 'mongodb://127.0.0.1:27017/voix-twitter';
var mongo = require('mongodb');
var TwitterController = require('./twitter_controller');
var db = require('monk')(connString);

function PollController(){
  this.db = db.get('poll');
  this.voted_handles = {};
  this.poll_id = null;
  this.doc= null;
  this.twitter = new TwitterController();
}

PollController.prototype.assignDummy = function () {
  var parent = this;
  this.poll_id = '563f23812399ec75d216e9d2';
}

var unifyVoteKeywords = function (doc) {
  var res = [];
  for (var i = 0; i < doc.votes.length; i++) {
    res.push(doc.votes[i]);
    for (var j = 0; j < doc.vote_keywords[i.toString()].length; j++) {
      res.push(doc.vote_keywords[i.toString()][j]);
    }
  }
  return res;
};

PollController.prototype.fetchTweets = function(poll_id,callback) {
  var parent = this;
  console.log('called fetchign tweets');
  // console.log(parent.poll_id);
  parent.db.findById(parent.poll_id,function(err,doc) {
    if (err) throw err;
    console.log('found poll, i guess :-|');
    if (doc) {
      var dateSince = doc.start_time;
      parent.doc = doc;
      // console.log(JSON.stringify(doc));
      parent.twitter.getTweets(doc.poll_keywords, unifyVoteKeywords(doc), doc.start_time, doc.end_time, function (ret) {
        console.log('getting tweets');
        callback(ret);
      });
    }
  });
};

module.exports = PollController;
