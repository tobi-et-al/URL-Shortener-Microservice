// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

function generateURL(url){
  var xlength = ( Math.random().toString());
  xlength = xlength.substr(2)
  return url + xlength;
};
app.get("/:id", function (request, response) {
    var url = request.params.id;
 
    var MongoClient = require('mongodb').MongoClient

    var URL = 'mongodb://tobiogunleye:Bagel99999@ds147900.mlab.com:47900/postmalone';
    var fullUrl = request.headers['x-forwarded-proto'].split(',')[0] + '://' + request.get('host') + '/' + url;
    var togo = null;
 
    MongoClient.connect(URL, function(err, db) {
    
      var collection = db.collection('url');
      
      collection.find({short_url: fullUrl}).toArray(function(err, docs) {
 
        if(docs.length){
          
          togo =  docs[0].original_url; 
          (response.redirect(togo));

        } 
        
        db.close();
      });
      
    }); 
 
});
app.get("/new/*", function (request, response) {
  var url = request.params[0];
  if (request.params[0].length){

    if(/^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/.test(url)){
      var MongoClient = require('mongodb').MongoClient

      var URL = 'mongodb://tobiogunleye:Bagel99999@ds147900.mlab.com:47900/postmalone';
      var fullUrl = request.headers['x-forwarded-proto'].split(',')[0] + '://' + request.get('host') + '/';

      MongoClient.connect(URL, function(err, db) {
      
      if (err) return

      var collection = db.collection('url');
          collection.find({original_url: url}).toArray(function(err, docs) {
            if(!docs.length){
              console.log('no result')
              var togo =  { "original_url": url, "short_url": generateURL(fullUrl) };
              collection.insert(togo, function(err, result) {
                console.log(err, result);
                response.send(togo);
              });
            }else{
              console.log('result found')
              console.log(docs[0])
              var togo = { 
                          "original_url": docs[0].original_url, 
                           "short_url": docs[0].short_url 
                         };
              response.send(togo);

            }
            db.close()
          })
      });
    }else{
      response.send({error: 'invalid URL'});
    }
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
