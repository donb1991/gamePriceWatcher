var db = require('../models');

var routerHelper = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id != null || req.session.id != undefined) {
      return next();
    } else {
      res.redirect('/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.UserGame.findById(req.params.id, function(err, userGame) {
      if (req.session.id == userGame.user) {
        return next();
      } else {
        res.redirect('/');
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id != null || req.session.id != undefined) {
      res.redirect('/');
    } else {
      return next();
    }
  },
};

module.exports = routerHelper;
