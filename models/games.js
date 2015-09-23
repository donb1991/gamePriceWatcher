var mongoose = require('mongoose');
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

// gameSchema.pre('remove', function(next) {
//   db.User.findOneAndUpdate({games: {$in: [this._id]}}, {$pull: {games: this._id}}, function(err, user) {
//     next();
//   });
// });

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
