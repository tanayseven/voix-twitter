# Voix - A poll client that uses twitter

Goal's behind the project:

 * Getting a completely working twitter polling client 
 * Learn the working of MongoDB and use it
 * Learn the working of Twitterr API
 * Use socket.io for real time twitter streaming
 * Use Twitter Streaming api in the project
 * Use Chart.js on the browser
 * Get it up and working on heroku


This project is hosted live on [heroku](http://voix-twitter.herokuapp.com) (Its just in alpha stage and can crash).

### Stuff used to make this project:
 
 * [Node.js](https://nodejs.org/en/)
 * [MongoDB](https://www.mongodb.org/)
 * [Twitter Stream API](https://dev.twitter.com/streaming/reference/post/statuses/filter)
 * [Socket.io](http://socket.io/)
 * [Express](http://expressjs.com/)
 * [Monk](https://github.com/Automattic/monk)
 * [Handlebars](http://handlebarsjs.com/)
 * [Habitat](https://github.com/HackBerkeley/habitat)
 * [Consolidate](https://github.com/tj/consolidate.js/)
 * [Twit](https://github.com/ttezel/twit)

Installation/running instructions (Linux[Debian based/Ubuntu]):
```sh
sudo apt-get install nodejs-legacy npm mongodb git
git clone https://github.com/tanayseven/voix-twitter.git
cd voix-twitter
npm install
node app.js
```

Installation/running instructions (Windows):
* Download and install [Node.js](https://nodejs.org/en/download/)
* Download ans install [MongoDB](https://www.mongodb.org/downloads)
* Add to the path the locations of the binary where node and mongo is installed
* Download this [file](https://github.com/tanayseven/voix-twitter/archive/master.zip)
* Run the Mongo daemon `mongod` from another command prompt
* Extract that downloadedd zip to a location and open that extracted folder
* Run the command `npm install`
* Then execute the node server by typing `node app.js`

This is [on GitHub](https://github.com/tanayseven/voix-twitter) so please fork me or to add/fix stuff.



## License (MIT):
```

Copyright (c) 2015 Tanay PrabhuDesai, Ravikiran Kadannavar


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

