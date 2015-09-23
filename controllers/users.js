var db = require('../models');
var bcrypt = require('bcrypt');
var routerHelper = require('../middleware/routerHelper');
var updateHelper = require('../middleware/updateHelper');

app.get('/signup', routerHelper.preventLoginSignup, function(req, res) {
  res.render('users/signup');
});

app.get('/login', routerHelper.preventLoginSignup, function(req, res) {
  res.render('users/login');
});

app.get('/logout', routerHelper.ensureLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/login');
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
      res.render('/login');
    } else {
      req.login(user);
      req.updateGames();
      res.redirect('users/' + user._id + '/games');
    }
  });
});

app.get('/user/:id', routerHelper.ensureLoggedIn, function(req, res) {
  res.render('users/search');
});
