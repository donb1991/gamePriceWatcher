var db = require('../models');

var routerHelper = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id != null || req.session.id != undefined) {
      return next();
    } else {
      res.redirect('/login');
    }
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
