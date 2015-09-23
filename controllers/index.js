var routerHelper = require('../middleware/routerHelper');

app.get('/', routerHelper.ensureLoggedIn, function(req, res) {
  res.redirect('users/' + req.session.id + '/games');
});

require('./users');
require('./games');

app.get('*', function(req, res) {
  res.send(404);
});
