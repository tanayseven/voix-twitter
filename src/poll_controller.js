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
  this.twitter_db = db.get('twitter');
  this.votes = {};
  this.client_sockets = [];
  this.poll_id = null;
  this.doc= null;
  this.twitter = new TwitterController();
}

PollController.prototype.createPoll = function (obj,callback) { //TODO add functionality here
  var parent = this;
  for (var i = 0 ; i < obj.votes_tag.length ; ++i) {
    obj.votes_tag[i] = obj.votes_tag[i].split(' ');
  }
  obj.poll_keywords = obj.poll_keywords.split(' ');
  console.log(JSON.stringify(obj));
  var obj_insert = {
    end_time: new Date(),
    start_time: new Date(),
    poll_name: obj.poll_name,
    poll_keywords: obj.poll_keywords,
    votes:[],
    tweets:[]
  }
  for (var i = 0 ; i < obj.votes_name.length ; ++i) {
    obj_insert.votes.push({name:obj.votes_name[i], tags:obj.votes_tag[i], count:0});
  }
  console.log(JSON.stringify(obj_insert));
  parent.db.insert(obj_insert,function(err,doc) {
    if (err) throw err;
    if (doc) {
      console.log('Inserted successfully');
      callback({success:true});
    } else {
      console.log('Failed to insert');
      callback({success:false});
    }
  });
};

var unifyVoteKeywords = function (doc) {
  var res = [];
  for (var i = 0; i < doc.votes.length; i++) {
    for (var j = 0; j < doc.votes[i].tags.length; j++) {
      res.push(doc.votes[i].tags[j]);
    }
  }
  console.log(JSON.stringify(res));
  return res;
};

PollController.prototype.search = function (str_search,callback) {
  var parent = this;
  parent.db.find({poll_name:{$regex:str_search.split(' ').join('|'),$options: 'i'}},function (err,doc) {
    if (err) throw err;
    if(doc){
      // console.log(JSON.stringify(doc));
      callback(doc);
    }
  });
};

PollController.prototype.processTweet = function (tweet_id,tweet) {
  var parent = this;
  tweet = tweet.toLowerCase();
  console.log("Processing tweet");
      for (var i = 0; i < parent.votes.length; i++) {
        for (var j = 0; j < parent.votes[i].tags.length; j++) {
          if ( tweet.toLowerCase().indexOf(parent.votes[i].tags[j].toLowerCase()) >= 0 ) {
            console.log("Match found "+parent.poll_id+' '+parent.votes[i].name+" "+tweet_id);
            parent.db.update({_id:parent.poll_id,"votes.name":parent.votes[i].name,tweets:{$ne:tweet_id}},{$inc:{"votes.$.count":1}}, function(err,doc) {
              if (err) throw err;
              if (doc) {
                console.log("Updated/incremented");
              }
            });
            break;
          }
        }
      }
      parent.db.update({_id:parent.poll_id,tweets:{$ne:tweet_id}},{$push:{tweets:tweet_id}},function(err,doc) {
        if (err) throw err;
        if (doc) {
          console.log("Tweet added to poll");
        }
      });
};

PollController.prototype.getPoll = function(poll_id,callback) {

};

PollController.prototype.streamTweets = function() {
  var parent =  this;
  parent.twitter.getTweets(function (tweet) {
    // console.log('Tweeting: '+JSON.stringify(tweet));
    for (var i = 0 ; i < parent.client_sockets.length ; ++i ) {
      // console.log('Entered for loop');
      parent.client_sockets[i].emit('tweet',tweet);
    }
  });
};

PollController.prototype.addSocket = function (socket) {
  console.log('Adding socket');
  this.client_sockets.push(socket);
};

module.exports = PollController;
