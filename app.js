var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');

// database
var mongoose = require('mongoose');
var dbinfo = require("./config");
mongoose.connect(dbinfo.connstring);

require('./database/generate');

var routes = require('./routes/index');
var users = require('./routes/users')(passport);
var timetable = require('./routes/timetable');
var bookings = require('./routes/bookings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'supersecretkey',
                        saveUninitialized: true,
                        resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/timetable', timetable);
app.use('/bookings', bookings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
