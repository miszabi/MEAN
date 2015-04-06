// server.js

//modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
//var session = require('express-session');
//var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

/*
var http = require('http');

var querystring = require('querystring');

var post_data = "------WebKitFormBoundary2iz0yaajr9anPbyz"+
"Content-Disposition: form-data; name='cod'"+

"8539532"+
"------WebKitFormBoundary2iz0yaajr9anPbyz--"+
"";

function getpostdata(fields) {
  function encodeFieldPart(boundary, name, value) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\r\n\r\n";
    return_part += value + "\r\n";
    return return_part;
  }

  var boundary = Math.random();
  var post_data = [];
  if (fields) {
    for (var key in fields) {
      var value = fields[key];
      post_data.push(new Buffer(encodeFieldPart(boundary, key, value), 'utf8'));
    }
  }

  var length = 0;
  for(var i = 0; i < post_data.length; i++) {
    length += post_data[i].length;
  }

  var params = {
    postdata : post_data,
    headers : {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': length
    }
  };
  return params;
}

var headerparams = getpostdata({'cod': '8539532'});
var totalheaders = headerparams.headers;
var headers = {'Cookie' : ''};
for (var key in headers) totalheaders[key] = headers[key];


var post_options = {
  host: 'www.mfinante.ro',
  port: 80,
  path: '/infocodfiscal.html',
  method: 'POST',
  headers: totalheaders
};

console.log(post_options);

var req = http.request(post_options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  res.on('end', function() {
    //console.log(res);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

for (var i = 0; i < headerparams.postdata.length; i++) {
  console.log(headerparams.postdata[i])
  req.write(headerparams.postdata[i]);
}
// write data to request body
req.end();
*/
//http://www.anandprakash.net/2011/10/20/server-side-multipartform-data-uploads-from-nodejs/


/*querystring.stringify({
------WebKitFormBoundary2iz0yaajr9anPbyz
Content-Disposition: form-data; name="cod"

8539532
------WebKitFormBoundary2iz0yaajr9anPbyz--

});*/


//var post_data = new Buffer("cod\r\n\r\n8539532", "utf-8")
//var post_data ="cod=8539532";
/*

var options = {
  hostname: 'www.mfinante.ro',
  path: '/infocodfiscal.html',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary2iz0yaajr9anPbyz',
    'Content-Length': Buffer.byteLength(post_data),
    'Connection': 'keep-alive',
    'Content-Language' : 'en-US',
    'Pragma':'No-chache'
    */
/*'Content-Disposition': 'form-data'*//*

  }
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(post_data);
req.end();
*/


///////////////////
/*var post_data ="cod=8539532";


var post_req  = http.request({
  host: 'http://www.mfinante.ro',
  path:'/infocodfiscal.html',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Content-Length': post_data.length
  }
}, function(response){
console.log('that is a response');

  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

post_req.write(post_data);
post_req.end();

*/

//configuration

var db = require('./config/db');

// set up our port
var port = process.env.PORT || 3000;

//connect to our mongoDB database
mongoose.connect(db.url);
/*must be use before session*/
//app.use(cookieParser());

/*session management*/
/*app.use(session({
  resave : true, // don't save session if unmodified
  saveUninitialized : true, // don't create session until something stored
  secret: 'server_sercret',
  cookie: { secure: true, httpOnly : false, maxAge: 36000000 }
}));*/

app.use(cookieSession({
  keys: ['key1', 'key2']
}));

//get all data/stuff of the body (POST) parameter
//parse application/json

app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         
