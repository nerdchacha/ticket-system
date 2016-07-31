var express = require('express');
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    authenticate = require('./middleware/check-authenticated.js'),
    User = require('./models/user-model.js');

mongoose.connect('mongodb://localhost/ticket-system');
var db = mongoose.connection;

var routes = require('./routes/index-router');
var accounts = require('./routes/account-router');
var tickets = require('./routes/tickets-router');
var users = require('./routes/users-router');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

//Middle ware to set authentication to false
app.use(function(req,res,next){
    res.header('isAuthenticated', false);
    next();
});

// view engine setup)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower',express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : 'IbXRRd8nT1Ao2HAhefTZ',
    saveUninitialized : true,
    resave : true
}));

app.use(passport.initialize());
app.use(passport.session());

/*app.use(flash());

//global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});*/

//Hard code force login user for testing
/*
app.use(function(req,res,next){
    User.getUserbyUsername('ygera',function(err, user){
        if(err) console.log(err);
            req.user = user;
            req.login(user,function(err,data){
            if(err)console.log(err);
            next();
        });
    });
});
*/

app.use(allowCrossDomain);
//Do not authenticate calls to user route.
app.use('/accounts', accounts);
//Authenticate every request before its route is matched
app.use(authenticate.isAuthenticated);
app.use('/users',users);
app.use('/tickets',tickets);
app.use('/', routes);

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
