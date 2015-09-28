var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var db = require('./index');

var userSchema = mongoose.Schema({
  userName: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserGames',
  },],
});

userSchema.pre('save', function(next) {
  var _this = this;
  if (!_this.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    return bcrypt.hash(_this.password, salt, function(err, hash) {
      if (err) {
        return next();
      }

      _this.password = hash;
      return next();
    });
  });
});

userSchema.statics.authenticate = function(formData, next) {
  this.findOne({
    userName: formData.userName,
  }, function(err, user) {
    if (err || !(user)) {
      next('Invaild username or password');
    } else {
      user.checkPassword(formData.password, next);
    }
  });
};

userSchema.methods.checkPassword = function(password, next) {
  var _this = this;
  bcrypt.compare(password, _this.password, function(err, isMatch) {
    if (isMatch) {
      next(null, _this);
    } else {
      next('Invaild username or password', null);
    }
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
