var routerHelper = require('../middleware/routerHelper');

app.get('/', routerHelper.ensureLoggedIn, function(req, res) {
  res.redirect('users/' + req.session.id + '/usergames');
});

require('./users');
require('./usergames');

app.get('*', function(req, res) {
  res.sendStatus(404);
});
