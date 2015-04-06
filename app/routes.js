var service = require('./models/blog'),
    Blog = service.article,
    User = service.user,
    Repository = require('./repository'),
    _ = require('lodash');

module.exports = function(app) {

    function handleError(res){
        return res.json({success : 0});
    };

    app.post('/api/authenticate', function(req, res){
        var repo = new Repository('user');
console.log('auth' );
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
            res.json({ isAuthenticated: true, name : req.session.user.firstName + ' ' + req.session.user.lastName});
        } else {
            res.json({isAuthenticated : false});
        }
    });

    app.post('/api/logout', function(req, res){
        req.session.destroy();

        res.json({success : 1});
    });

    var _blogs = [];

    function clearBlogCache(){
        _blogs = [];
    }

    setInterval(clearBlogCache, 1/*1000 * 60 * 60 * 24*/);

    // sample api route
    app.get('/api/blogs', function(req, res) {

        if(_blogs.length){
            res.json(_blogs);
            return;
        }

        var repo = new Repository('article');
        console.log(repo);
        repo.find(function(err, blogs) {

            if (err) {
                res.send(err);
            }
            _blogs = blogs;
            res.json(_blogs); // return all blogs in JSON format
        });
    });

    app.get('/api/blogs/:id', function(req, res) {
        var repo = new Repository('article');

        repo.findOne(function(err, blog) {

            if (err) {
                res.json(err);
            }

            res.json(blog); // return single blog in JSON format
        }, {_id: req.param("id")});
    });

    app.put('/api/blogs', function(req, res){
                var blog = _.extend({}, req.body);

        var repo = new Repository('article');

        repo.update(blog._id, {title: blog.title, body : blog.body}, function (model){
            clearBlogCache();
            res.json(model);
        });
    });

    ///Create the new article
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
        
        var repo = new Repository('article');
        var result = repo.store(blog, function (model){
            clearBlogCache();
            res.json(model);
        });
    });

    app.post('/api/comment', function(req, res, next){
        Blog.update({"_id" : req.body.articleId}, {$push : {comments : {body : req.body.body, userName : req.body.userName} }}, function(err, numberAffected, raw){
            if(err){
                response.json({success : 0});
            }

            res.json({success : 1});
        });
    });

    app.post('/login', function(req, res){

        var repo = new Repository('user');
        
        repo.find(function(err, user) {

            if (err) {
                res.send(err);
            }

            res.json(user);
        }, {'userName': req.body.userName, 'password': req.body.password});
    });

    // route to handle all angular requests
    app.get('*', function(req, res) {
        console.log('*' + req.session);

        res.sendfile( __dirname + '/public/index.html'); // load our public/index.html file
    });
};
