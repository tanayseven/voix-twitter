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
    consumer_key:         env.get('CONSUMER_KEY'),
    consumer_secret:      env.get('CONSUMER_SECRET'),
    access_token:         env.get('ACCESS_TOKEN'),
    access_token_secret:  env.get('ACCESS_TOKEN_SECRET')
  });
  this.api.get('search/tweets', { q: 'banana since:2011-11-11', count: 100000 }, function(err, data, response) {
    console.log(data);
  });
}

module.exports = TwitterController;
