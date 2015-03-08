// app/routes.js

// grab the model and repos
var service = require('./models/blog'),
    Blog = service.blog,
    User = service.user,
    Repository = require('./repository'),
    _ = require('lodash');

module.exports = function(app) {

    app.post('/api/authenticate', function(req, res){
        var repo = new Repository('user');

        repo.findOne(function(err, user){
            if(err){
               res.json(err);
            }

            if(user != null){
                req.session.user = user;
                res.json({firstName : user.firstName, lastName : user.lastName, _id : user._id});
            }
            else{
                res.json(null);
            }
        }, {userName : req.body.userName, password : req.body.password});
    });

    app.post('/api/logout', function(req, res){
        req.session = null;

        res.json({isAuthenticated: false});
    });

    app.get('/api/authenticate', function(req, res){
        var _session = req.session;

        if(_session && _session.user) {
            console.log('is authenticated' + " " + _session.user);
            res.json({ isAuthenticated: true, name : req.session.user.firstName + ' ' + req.session.user.lastName});
        } else {
            res.json({isAuthenticated : false});
        }
    });

    app.post('/api/logout', function(req, res){
        req.session.destroy();

        res.json({success : 1});
    });

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    var _blogs = [];

    function clearBlogCache(){
        console.log('blogcache cleared');
        _blogs = [];
    }

    setInterval(clearBlogCache, 1000 * 60 * 60 * 24);

    // sample api route
    app.get('/api/blogs', function(req, res) {
        // use mongoose to get all blogs in the database

        if(_blogs.length){
            console.log('returned from cache');
            res.json(_blogs);
            return;
        }
        var repo = new Repository('blog');
        
        repo.find(function(err, blogs) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }
            _blogs = blogs;
            res.json(_blogs); // return all blogs in JSON format
        });
    });

    app.get('/api/blogs/:id', function(req, res) {
        // use mongoose to get all blogs in the database
        var repo = new Repository('blog');

        repo.findOne(function(err, blog) {

            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }

            res.json(blog); // return single blog in JSON format
        }, {_id: req.param("id")});
    });

    app.put('/api/blogs', function(req, res){
        var blog = new Blog();

        blog = _.extend(blog, req.body);
        var upsertData = blog.toObject();

         delete upsertData._id;

        var repo = new Repository('blog');

        repo.update(blog, function (model){
            res.json(model);
        });
    });

    app.post('/api/blogs', function(req, res){
                
        var blog = new Blog({
              "title" :  req.body.title,
              "author": "szabi",
              "body":   req.body.body,
              "comments": [],
              "active": req.body.active,
              "meta": {
                "upvotes": 0,
                "downvotes": 0,
                "favs":  0
              }
            });
        
        var repo = new Repository('blog');
        var result = repo.store(blog, function (model){
            clearBlogCache();
            res.json(model);
        });
    });

    app.post('/login', function(req, res){

        var repo = new Repository('user');
        
        repo.find(function(err, user) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(user); // return all nerds in JSON format
        }, {'userName': req.body.userName, 'password': req.body.password});
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        console.log('*' + req.session);
        /*if(req.session.user === undefined){
            res.redirect('/login');
        }
        */
        res.sendfile( __dirname + '/public/views/index.html'); // load our public/index.html file
    });
};
