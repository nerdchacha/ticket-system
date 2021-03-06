//--------------------------------------------------------
//-----------------General Middleware---------------------
//--------------------------------------------------------

var express             = require('express');
    path                = require('path'),
    favicon             = require('serve-favicon'),
    logger              = require('morgan'),
    cookieParser        = require('cookie-parser'),
    bodyParser          = require('body-parser'),
    expressValidator    = require('express-validator'),
    flash               = require('connect-flash'),
    session             = require('express-session'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local').Strategy;
    mongo               = require('mongodb'),
    mongoose            = require('mongoose'),
    authenticate        = require('./middleware/check-authenticated.js'),
    checkRole           = require('./middleware/checkRole.js'),
    User                = require('./models/user-model.js');


//--------------------------------------------------------
//-----------------Router Middleware----------------------
//--------------------------------------------------------

var indexRoutes             = require('./routes/index-router'),
    accountsRoutes          = require('./routes/account-router'),
    ticketsRoutes           = require('./routes/tickets-router'),
    usersRoutes             = require('./routes/users-router'),
    staticRouter            = require('./routes/static-data-router'),
    supportTicketsRoutes    = require('./routes/support-routes/support-tickets-router'),
    supportUserssRoutes     = require('./routes/support-routes/support-users-router'),
    adminUsersRoutes        = require('./routes/admin-routes/admin-users-router');
    adminTicketsRoutes      = require('./routes/admin-routes/admin-tickets-router');


var app = express();

//--------------------------------------------------------
//---------------------DB Config--------------------------
//--------------------------------------------------------

app.configureMongoose = function(path){
    mongoose.connect(path);
    var db = mongoose.connection;
}

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// view engine setup
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
            error   : msg,
            value : value
        };
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower',express.static(path.join(__dirname, '/../bower_components')));
app.use(express.static(path.join(__dirname, '/../client/public')));

app.use(session({
    secret : 'IbXRRd8nT1Ao2HAhefTZ',
    saveUninitialized : true,
    resave : true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(allowCrossDomain);
//Do not authenticate calls to accounts route.
app.use('/accounts', accountsRoutes);
//Authenticate every request before its route is matched
app.use(authenticate.isAuthenticated);
app.use('/users',usersRoutes);
app.use('/tickets',ticketsRoutes);
app.use('/', indexRoutes);
app.use('/static', staticRouter);
//Check if user is support before executing route
app.use(checkRole.isSupport);
app.use('/support/users', supportUserssRoutes);
app.use('/support/tickets', supportTicketsRoutes);
//Check if user is admin before executing route
app.use(checkRole.isAdmin);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/tickets', adminTicketsRoutes)

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
