var express = require('express');
app = express();
var bodyParser = require('body-parser');
var session = require('cookie-session');
var ejs = require('ejs');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var db = require('./models');

app.use(bodyParser);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
  maxAge: 36000000,
  secret: 'Its on sale',
  name: 'saleWatcher',
}));

app.listen(3000, function() {
  console.log('http://localhost:3000');
});
