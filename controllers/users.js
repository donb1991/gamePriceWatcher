var db = require('../models');
var bcrypt = require('bcrypt');
var routerHelper = require('../middleware/routerHelper');
var updateHelper = require('../middleware/updateHelper');
var randomGame = require('../middleware/randomgame');

app.get('/signup', routerHelper.preventLoginSignup, randomGame.getRandomGame, function(req, res) {
  res.render('users/signup');
});

app.get('/login', routerHelper.preventLoginSignup, randomGame.getRandomGame, function(req, res) {
  res.render('users/login');
});

app.get('/logout', routerHelper.ensureLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.post('/signup', routerHelper.preventLoginSignup, randomGame.getRandomGame, function(req, res) {
  db.User.create(req.body.user, function(err, data) {
    if (err) {
      if (err.code == 11000) {
        res.locals.err = 'User name not available';
      }

      res.render('users/signup');
    } else {
      req.login(data);
      res.redirect('/');
    }
  });
});

app.post('/login', routerHelper.preventLoginSignup, randomGame.getRandomGame, function(req, res) {
  db.User.authenticate(req.body.user, function(err, user) {
    if (err) {
      res.locals.err = err;
      res.render('users/login');
    } else {
      req.login(user);
      req.updateGames();
      res.redirect('users/' + user._id + '/usergames');
    }
  });
});

app.get('/users/:id', routerHelper.ensureLoggedIn, function(req, res) {
  res.render('users/search');
});
