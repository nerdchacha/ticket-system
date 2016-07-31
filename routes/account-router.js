var express = require('express');
var router = express.Router();
var usersBl = require('../business-layer/users-bl.js');
var passport = require('passport');
var LocalStratergy = require('passport-local').Stratergy;
var User = require('../models/user-model.js');
var validator = require('../business-layer/request-validator.js');

//GET the user registration form
/*router.get('/register',function(req,res,next){
  res.render('user/register', {errors:null} );
});*/

//POST the data for the user registration form
router.post('/register',function(req,res,next){
  var errors = validator.validateNewUser(req,res);
  if(errors){
    res.render({errors: errors});
  }
  else{
    usersBl.createUser(req,res)
        .then(function(user){
            res.json({error: null});
        })
        .catch(function(error){
          res.json({error: [{msg : 'There was some issue trying to create user. Please try again after some time'}]});
        });
  }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserbyUsername(username,function(err,user){
        if(err) throw err;
        if(!user){
          return done(null, false, {message: 'No user found with given username.'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(!isMatch)
            return done(null, false, {message: 'The username and password do not match'});
          else
            return done(null,user);
        })
      });
    }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findUserById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info){
            //Set cookie age
            if (req.body.remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                req.session.cookie.expires = false;
                req.session.cookie.maxAge = 1000 * 60 * 30; //Cookie expired after 30 minutes
            }
            //Error occurred while login
            if(err) res.json({error : err, isAuthenticated : false, msg: 'There was some error while trying to log you in. Please try again after some time'});
            //Wrong info provided by user
            if(!user) res.json({error : null, isAuthenticated : false, msg: info.message});
            //Successful login
            else {
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    //send user details back after successful login.
                    return res.json({error : null, isAuthenticated : true, msg: '', user:{
                            firstname: user.firstname,
                            lastname: user.lastname,
                            username: user.username,
                            email: user.email
                        }
                    });
                });
            }
        })(req, res, next);
    });

router.get('/logout',function(req,res,next){
  req.logout();
  res.end();
});

module.exports = router;
