var service = require('./models/blog'),
    Blog = service.article,
    User = service.user,
    Repository = require('./repository'),
    _ = require('lodash'),
    fs = require('fs');

module.exports = function(app) {

    function handleError(res){
        return res.json({success : 0});
    };

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
                //TODO
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
            repo.update(req.param("id"), { viewCount : blog.viewCount + 1}, function(){});

            res.json(blog); // return single blog in JSON format
        }, {_id: req.param("id")});
    });

    app.put('/api/blogs', function(req, res){
        var blog = _.extend({}, req.body);

        var repo = new Repository('article');

            repo.update(blog._id, {title: blog.title, headLine : blog.body.substring(0, 100),  body : blog.body}, function (model){
            clearBlogCache();
            res.json(model);
        });
    });

    ///Create the new article
    app.post('/api/blogs', function(req, res){
                
        var blog = new Blog({
              "title" :  req.body.title,
              "author": "szabi",
              "headLine" : req.body.body.substring(0, 100) +'...',
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

    app.get('/movie', function(req, res){
console.log(__dirname)
        var path = './public/img/wcf-design-concepts_service-contracts-02.mp4';
        var stat = fs.statSync(path);
        var total = stat.size;
        if (req.headers['range']) {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];

            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total-1;
            var chunksize = (end-start)+1;
            console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

            var file = fs.createReadStream(path, {start: start, end: end});
            res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
            file.pipe(res);
        } else {
            console.log('ALL: ' + total);
            res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
            fs.createReadStream(path).pipe(res);
        }
    });

    // route to handle all angular requests
    app.get('*', function(req, res) {
        console.log('*' + req.session);

        res.sendfile( __dirname + '/public/index.html'); // load our public/index.html file
    });
};
