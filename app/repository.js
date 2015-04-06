var models = require('./models/blog'),
    _ = require('lodash'),
    _log = require('./logging/loggingWrapper');

var Repository = function(key){ 
  this.key = key;
};

Repository.prototype.single = function(obj){
   if(obj == undefined){
     new Error("obj");
   }

   models[this.key].findOne(obj, function (err, model){
    if (err) {

        _log.error(err);
        return null;
    } else {
        return model;
    }
  });
};

Repository.prototype.find = function(callback, criteria){
    if(criteria == undefined){
        criteria = {};
    }

    models[this.key].find(criteria, callback);
};

Repository.prototype.findOne = function(callback, criteria){
    if(criteria == undefined){
    criteria = {};
    }

    models[this.key].findOne(criteria, callback);
};

Repository.prototype.store = function(model, callback){
  
    model.save(function (err, model){
        if (err){
          console.log(err);

          callback({success: 0});
        }
        else
        {
          callback(model);
        }
    });
};

Repository.prototype.update = function(id, updateProps, callback){
    models[this.key].findByIdAndUpdate(id, { $set : updateProps }, callback);
};

module.exports = Repository;