var mongoose = require('mongoose');

mongoose.connect( process.env.MONGOLAB_URI || 'mongodb://localhost/gamePriceWatcher');

module.exports.User = require('./users');
module.exports.Game = require('./games');
module.exports.UserGame = require('./UserGames');
