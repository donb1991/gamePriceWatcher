var db = require('../models');
var routerHelper = require('../middleware/routerHelper');

app.post('/users/:userId/games', function(req, res) {
  db.Game.create(req.body, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      db.User.findById(req.params.userId, function(err, user) {
        db.UserGames.create({user: user._id, game: game._id, userPrice: req.body.userPrice}, function(err, userGame) {
          user.games.push(userGame);
          user.save();
          res.send(user);
        });
      });
    }
  });
});

app.delete('/users/:userId/games/:id', function(req, res) {
  db.Game.findByIdAndRemove(req.params.id, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      game.remove();
      res.send(game);
    }
  });
});

app.put('/users/:userId/games/:id', function(req, res) {
  db.Game.findByIdAndUpdate(req.params.id, req.body, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      res.send(game);
    }
  });
});

app.get('/users/:userId/games', routerHelper.ensureLoggedIn, function(req, res) {
  db.UserGames.find({user: req.params.userId}).populate('game').exec(function(err, userGames) {
    res.render('users/gamelist', {games: userGames});
  });
});
