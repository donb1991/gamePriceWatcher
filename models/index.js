var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gamePriceWatcher');

module.exports.User = require('./users');
module.exports.Game = require('./games');
module.exports.UserGame = require('./UserGames');
