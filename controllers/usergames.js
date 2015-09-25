var db = require('../models');
var routerHelper = require('../middleware/routerHelper');

app.post('/users/:userId/usergames', function(req, res) {
  db.Game.findOrCreate({gameId: req.body.gameId}, req.body, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      db.User.findById(req.params.userId, function(err, user) {
        db.UserGame.findOneAndUpdate({user: user._id, game: game._id}, {userPrice: req.body.userPrice}, function(err, usergame) {
          if (usergame == null) {
            db.UserGame.create({user: user._id, game: game._id, userPrice: req.body.userPrice}, function(err, usergame) {
              user.games.push(usergame);
              user.save();
              res.send(user);
              console.log(usergame);
            });
          }
        });
      });
    }
  });
});

app.delete('/users/:userId/usergames/:id', function(req, res) {
  db.UserGame.findByIdAndRemove(req.params.id, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      game.remove();
      res.send(game);
    }
  });
});

app.put('/users/:userId/usergames/:id', function(req, res) {
  console.log('hello');
  db.UserGame.findByIdAndUpdate(req.params.id, req.body, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      res.send(game);
    }
  });
});

app.get('/users/:userId/usergames', routerHelper.ensureLoggedIn, function(req, res) {
  db.UserGame.find({user: req.params.userId}).populate('game').exec(function(err, userGame) {
    res.render('games/gamelist', {games: userGame});
  });
});
