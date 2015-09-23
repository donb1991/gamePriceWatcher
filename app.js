var express = require('express');
app = express();
var bodyParser = require('body-parser');
var session = require('cookie-session');
var ejs = require('ejs');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var loginHelper = require('./middleware/loginHelper');
var updateHelper = require('./middleware/updateHelper');
var db = require('./models');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
  maxAge: 36000000,
  secret: 'Its on sale',
  name: 'saleWatcher',
}));
app.use(loginHelper);
app.use(updateHelper);

require('./controllers');

app.listen(3000, function() {
  console.log('http://localhost:3000');
});
