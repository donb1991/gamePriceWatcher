var db = require('../models');
var routerHelper = require('../middleware/routerHelper');

app.post('/users/:userId/games', function(req, res) {
  db.Game.create(req.body, function(err, game) {
    if (err) {
      console.log(err);
    } else {
      db.User.findById(req.params.userId, function(err, user) {
        user.games.push(game);
        user.save();
        game.save();
        res.send(user);
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

app.get('/users/:userId/games', routerHelper.ensureLoggedIn, function(req, res) {
  db.User.findById(req.params.userId).populate('games').exec(function(err, data) {
    // res.send(data);
    res.render('users/gamelist', data);
  });
});
