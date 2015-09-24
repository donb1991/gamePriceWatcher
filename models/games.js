var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var User = require('./users');
var db = require('./index');

var gameSchema = mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  title: String,
  publisher: String,
  retailer: String,
  price: Number,
  thumb: String,
});

gameSchema.plugin(findOrCreate);

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
