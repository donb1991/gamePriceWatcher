app.get('/', function(req, res) {
  res.send('Home Page');
});

//require game and user controllers
require('./users');

app.get('*', function(req, res) {
  res.send(404);
});
