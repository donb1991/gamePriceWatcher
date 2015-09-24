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

userGameSchema.pre('remove', function(next) {
  db.User.findOneAndUpdate({games: {$in: [this._id]}}, {$pull: {games: this._id}}, function(err, user) {
    next();
  });
});

var UserGame = mongoose.model('UserGame', userGameSchema);

module.exports = UserGame;
