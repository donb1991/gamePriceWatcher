var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  title: String,
  publiser: String,
  retailer: String,
  price: Number,
  userPrice: Number,
  thumb: String,
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
