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

var Twit = require('twit');

var env = (function(){
  var Habitat = require("habitat");
  Habitat.load();
  return new Habitat();
}());

function TwitterController () {
  this.api = new Twit({
    consumer_key:        process.env.TWIT_CONSUMER_KEY        || env.get('CONSUMER_KEY'),
    consumer_secret:     process.env.TWIT_CONSUMER_SECRET     || env.get('CONSUMER_SECRET'),
    access_token:        process.env.TWIT_ACCESS_TOKEN        || env.get('ACCESS_TOKEN'),
    access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET || env.get('ACCESS_TOKEN_SECRET')
  });
  // this.api.get('search/tweets', { q: 'apple OR mango OR pineapple since:2011-11-11', count: 100000 }, function(err, data, response) {
  //   console.log(data);
  // });
}

function appendKeywords (arr,option) {
  var str = arr[0];
  if (typeof(option) == 'undefined') {
    option = '';
  }
  for (var i = 1 ; i < arr.length ; ++i ) {
    str += option + arr[i];
  }
  return str;
}

function getDateString(date) {
  var str = '';
  str += date.getFullYear().toString() + '-';
  str += (date.getMonth()+1)<=9?'0'+(date.getMonth()+1).toString()+'-':(date.getMonth()+1).toString()+'-';
  str += (date.getDate()<=9)?'0'+date.getDate().toString():date.getDate().toString();
  return str;
}

TwitterController.prototype.getTweets = function (keywordsOptions,keywordsVotes,dateStart,dateUntil,callback) {
  var strKey = appendKeywords(keywordsOptions,' ');
  strKey += ' ' + appendKeywords(keywordsVotes,' OR ');
  console.log(strKey);
  var strDateSince = getDateString(dateStart);
  var strDateUntil = getDateString(dateUntil);
  // console.log('getting tweets');
  console.log( ' ' + strKey + ' since:'+strDateSince+' until:'+strDateUntil);
  // this.api.get('search/tweets', { q: strKey + ' ' + ' since:'+strDateSince+' until:'+strDateUntil}, function(err, data, response) {
  this.api.get('search/tweets', { q: 'election+india+2014+congress+OR+bjp+OR+modi+OR+aap+OR+congress since:'+strDateSince+' until:'+strDateUntil}, function(err, data, response) {
    console.log('got tweets');
    console.log(data);
    callback(data);
  });
};

module.exports = TwitterController;
