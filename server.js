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
