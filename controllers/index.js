var routerHelper = require('../middleware/routerHelper');

app.get('/', function(req, res) {
  res.render('home');
});

require('./users');
require('./games');

app.get('*', function(req, res) {
  res.send(404);
});
