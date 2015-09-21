var db = require('../models');
var bcrypt = require('bcrypt');
var routerHelper = require('../middleware/routerHelper');

app.get('/signup', routerHelper.preventLoginSignup, function(req, res) {
  res.render('users/signup');
});

app.get('/login', routerHelper.preventLoginSignup, function(req, res) {
  res.render('users/login');
});

app.get('/logout', routerHelper.ensureLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/signup', routerHelper.preventLoginSignup, function(req, res) {
  db.User.create(req.body.user, function(err, data) {
    if (err) {
      console.log(err);
      res.redirect('/signup');
    } else {
      req.login(data);
      res.redirect('/');
    }
  });
});

app.post('/login', routerHelper.preventLoginSignup, function(req, res) {
  db.User.authenticate(req.body.user, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/login');
    } else {
      req.login(user);
      res.redirect('/');
    }
  });
});
