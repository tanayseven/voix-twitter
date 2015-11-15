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
  for (var i = 0; i < doc.poll_keywords.length; i++) {
    res.push(doc.poll_keywords[i]);
  }
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

PollController.prototype.processTweet = function (tweet) {
  var parent = this;
  tweet = tweet.toLowerCase();
  console.log("Processing tweet");
      for (var i = 0; i < parent.votes.length; i++) {
        for (var j = 0; j < parent.votes[i].tags.length; j++) {
          if ( tweet.toLowerCase().indexOf(parent.votes[i].tags[j].toLowerCase()) >= 0 ) {
            console.log("Match found "+parent.poll_id+' '+parent.votes[i].name);
            parent.votes[i].count++;
          }
        }
      }
};

PollController.prototype.streamTweets = function(poll_id,callback) {
  var parent =  this;
  // if (parent.poll_id === null) {
    parent.db.findById(poll_id,function(err,doc){
      if (err) throw err;
      console.log(JSON.stringify(doc));
      if(doc) {
        parent.doc = doc;
        parent.poll_id = poll_id;
        parent.votes = doc.votes;
        parent.keywords = unifyVoteKeywords(doc);
        parent.twitter.setKeywords(parent.keywords);
        parent.twitter.getTweets(function (tweet) {
          for (var i = 0 ; i < parent.client_sockets.length ; ++i ) {
            parent.client_sockets[i].emit('tweet',tweet);
          }
          parent.processTweet(tweet.text);
          doc.success = true;
          callback(doc);
        });
      }
    });
  setInterval(this.commitPolls, 5000,this);
};

PollController.prototype.commitPolls = function (obj) {
  var parent = obj;
  console.log("Called commit Polls");
  parent.db.findById(parent.poll_id,function(err,doc) {
    if(err) throw err;
    if(doc) {
      var j = 0;
      for (var i = 0; i < parent.votes.length; i++) {
        console.log("Added by ID");
        parent.db.update({_id:parent.poll_id,"votes.name":parent.votes[i].name,tweets:{$ne:parent.tweet_id}},{$set:{"votes.$.count":parent.votes[i].count}}, function(err,doc) {
          if (err) throw err;
          if (doc) {
            console.log("Stored.......................");
          }
        });
      }
    }
  });
};

PollController.prototype.addSocket = function (socket) {
  console.log('Adding socket');
  this.client_sockets.push(socket);
};

PollController.prototype.removeSocket = function (socket) {
  console.log('Adding socket');
  var i = this.client_sockets.indexOf(socket);
  this.client_sockets.splice(i,1);
};

module.exports = PollController;
