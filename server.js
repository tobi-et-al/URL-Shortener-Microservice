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

function generateURL(){ 
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    var xlength = firstPart + secondPart;
  if (findUid(xlength)){
    generateURL();
  }
  return xlength;
};

function findUid(uid){ 
 
    var MongoClient = require('mongodb').MongoClient

    var URL = 'mongodb://tobiogunleye:Bagel99999@ds147900.mlab.com:47900/postmalone'; 
    var togo = null;
 
    MongoClient.connect(URL, function(err, db) {
    
      var collection = db.collection('url');
      collection.find({uid: uid}).toArray(function(err, docs) {
 
        if(docs.length){
          return true
        }  
        db.close();
      });
      
    }); 
  
    return false
}

app.get("/:id", function (request, response) {
    var uid = request.params.id;
 
    var MongoClient = require('mongodb').MongoClient

    var URL = 'mongodb://tobiogunleye:Bagel99999@ds147900.mlab.com:47900/postmalone';
    var fullUrl = request.headers['x-forwarded-proto'].split(',')[0] + '://' + request.get('host') + '/' + uid;
    var togo = null;
 
    MongoClient.connect(URL, function(err, db) {
    
      var collection = db.collection('url');
      
      collection.find({uid: uid}).toArray(function(err, docs) {
 
        if(docs.length){
          
          togo =  docs[0].original_url; 
          (response.redirect(togo));

        } else{
              console.log('result found');
        }
        
        db.close();
      });
      
    }); 
 
});
app.get("/new/*", function (request, response) {
  var url = request.params[0];
  if (request.params[0].length){

    if(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url)){
      var MongoClient = require('mongodb').MongoClient

      var URL = 'mongodb://tobiogunleye:Bagel99999@ds147900.mlab.com:47900/postmalone';
      var fullUrl = request.headers['x-forwarded-proto'].split(',')[0] + '://' + request.get('host') + '/';

      MongoClient.connect(URL, function(err, db) {
      
      if (err) return
      
      var collection = db.collection('url');
          collection.find({original_url: url}).toArray(function(err, docs) {
            if(!docs.length){
              console.log('no result')
              var uid = generateURL();
              var togo =  { "original_url": url, "short_url": fullUrl + uid, "uid": uid };
              collection.insert(togo, function(err, result) {
                console.log(err, result);
                response.send({ 
                          "original_url": url, 
                          "short_url": fullUrl + uid 
                         });
              });
 
            }else{
              console.log('result found') 
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
