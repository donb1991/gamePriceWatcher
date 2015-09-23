var mongoose = require('mongoose');
var db = require('./index');

var userGameSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  },
  userPrice: Number,
});

var UserGame = mongoose.model('UserGame', userGameSchema);

module.exports = UserGame;
