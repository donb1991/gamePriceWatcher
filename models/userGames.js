var mongoose = require('mongoose');
var db = require('./index');

var userGamesSchema = mongoose.Schema({
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

var UserGames = mongoose.model('UserGames', userGamesSchema);

module.exports = UserGames;
