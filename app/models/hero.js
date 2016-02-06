var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Schema object of mongoDB

//Make a new schema named HeroSchema with a field of string type called 'name'
var HeroSchema = new Schema({
    name : String
});

//expose te Schema for other directories/files
module.exports = mongoose.model('Hero', HeroSchema);

