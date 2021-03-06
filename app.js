var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var sessionController = require('./controllers/session_controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//add marco
app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
  
  //guardar path para redireccionar despues de haces login
  if(!req.path.match(/\/login|\/logout/)) {
      req.session.redir = req.path;
  }

  //hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();

});

//auto-logout
app.use(function(req,res,next) {

  if(req.session.ultimoAcceso) {
    var sg = 120;
    if ((new Date().getTime() - (sg*1000)) > req.session.ultimoAcceso) {
      sessionController.delete(req,res);
    }
  }
  req.session.ultimoAcceso = new Date().getTime();
  next();

});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('---Not Found');
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
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
