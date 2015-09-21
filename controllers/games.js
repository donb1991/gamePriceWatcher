var db = require('../models');

app.get('/users/:user_id/games', function(req, res) {
  res.send('test');
});

app.post('/users/:user_id/games', function(req, res) {
  console.log(req.body);

  db.Game.create(req.body, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }

    res.redirect('/');
  });
});
