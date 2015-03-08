var models = require('./models/blog'),
    _ = require('lodash');

var Repository = function(key){ 
  this.key = key;
};

Repository.prototype.single = function(obj){
   if(obj == undefined){
     new Error("obj");
   }

   models[this.key].findOne(obj, function (err, model){
    if (err) {

      console.log(err);
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
}

Repository.prototype.findOne = function(callback, criteria){
  if(criteria == undefined){
    criteria = {};
  }
  
  models[this.key].findOne(criteria, callback);
}

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
//http://mongoosejs.com/docs/documents.html
Repository.prototype.update = function(model, callback){
    var id = model._id;
    delete model._id;
    models[this.key].findByIdAndUpdate(id,{$set : model}, {new : true}, callback);
};

module.exports = Repository;