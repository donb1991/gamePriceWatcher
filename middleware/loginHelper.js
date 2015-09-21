var db = require('../models');

var loginHelper = function(req, res, next) {
  req.login = function(user) {
    req.session.id = user._id;
  };

  req.logout = function() {
    req.session.id = null;
  };

  if (req.session.id === null) {
    res.locals.user = null;
  } else {
    res.locals.user = user._id;
  }

  next();
};
