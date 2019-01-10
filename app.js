require('dotenv').config();
const MLAB_URI = process.env.MLAB_URI;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');

var indexRouter = require('./routes/index');
var checklistRouter = require('./routes/checklist');
var usersRouter = require('./routes/users');

var app = express();

// configure sessions
const session = require('express-session');
app.use(session({ secret: '${SESSION_CODE}', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: require("handlebars-helpers")()
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', checklistRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Database setup
const mongoose = require('mongoose');
const mlabURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${MLAB_URI}`;
console.log(mlabURI);
mongoose.connect(process.env.MONGODB_URI || mlabURI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true); // silencing a deprecated feature warning that's a bug per https://github.com/Automattic/mongoose/issues/6890
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// for heroku
const port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;
