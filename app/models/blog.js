//dtabase schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title:  String,
  category: String,
  author: String,
  body:   String,
  comments: [
      {
          userName: { type : String},
          body: {type : String},
          date: {type:Date, default: Date.now }
      }],
  date: { type: Date, default: Date.now },
  active: Boolean,
  meta: {
    upvotes: Number,
    downvotes: Number,
    favs: Number
  }
});

var categorySchema = new Schema(
    {
        name : String,
        createDate : { type: Date, default:Date.now}
    });

var userSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        userName : String,
        password: String,
        active: Boolean,
        createDate : {type:Date, default : Date.now}
    });

module.exports = { 
    article : mongoose.model('Articles', articleSchema),

    category : mongoose.model('Category', categorySchema),

    user: mongoose.model('User', userSchema)
};