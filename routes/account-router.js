var express = require('express');
var router = express.Router();
var usersBl = require('../business-layer/users-bl.js');
var passport = require('passport');
var LocalStratergy = require('passport-local').Stratergy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user-model.js');
var validator = require('../business-layer/request-validator.js');
var auth = require('../config/auth.js');

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
    usersBl.createLocalUser(req,res)
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

        User.comparePassword(password, user.local.password, function(err, isMatch){
          if(err) throw err;
          if(!isMatch)
            return done(null, false, {message: 'The username and password do not match'});
          else
            return done(null,user);
        })
      });
    }));

passport.use(new GoogleStrategy({
    clientID: auth.google.clientID,
    clientSecret: auth.google.clientSecret,
    callbackURL: auth.google.callbackURL
    },
    function(token,refreshToken,profile,done){
        process.nextTick(function(){
            User.findGoogleUser(profile.id,function(err,user){
                if(err) { return done(err,null); }
                if(user){
                    //if user is found, log them in
                    return done(null,user);
                }
                else{
                    //else create new user in db
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.email = profile.emails[0].value;
                    newUser.role = ['User'];
                    newUser.isActive = false;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null,newUser);
                    })
                }
            });
        })
    })
);

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
                //User is not active
                if(!user.isActive)
                res.json({error : err, isAuthenticated : false, msg: 'The user is inactive.'});

                req.login(user, function(err) {
                    if (err) { return next(err); }
                    //send user details back after successful login.
                    return res.json({error : null, isAuthenticated : true, msg: '', user:{
                            firstname: user.firstname,
                            lastname: user.lastname,
                            username: user.username,
                            email: user.email,
                            role: user.role
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

router.get('/auth/google',passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/auth/google/callback',function(req,res,next){
    passport.authenticate('google',function(err,user,info){
        if(err) res.render('oauth-redirect',{user : null, error: err, isActive : false});
        else if(!user) res.render('oauth-redirect',{user : null, error: 'User doesn\'t exist', isActive:false});
        //User is authenticated but since username name is not set, do not login user.
        else if(!user.isActive) res.render('oauth-redirect',{user: JSON.stringify(user), error: null, isActive: user.isActive});
        //In case user is authenticated and username is set, login the user.
        else {
            req.login(user, function(err) {
                if (err) { return next(err); }
                //send user details back after successful login.
                var user_response = {
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
                return res.render('oauth-redirect',{error : null, isActive : true, user: JSON.stringify(user_response)});
            });
        }
    })(req,res,next);
});

router.post('/set-username',function(req,res,next){
    var errors = validator.checkSetUsername(req,res);
    if(errors){
        res.render({errors: errors});
    }
    else{
        var id = req.body.id;
        var username = req.body.username;
        usersBl.setUsenameAndActive(id,username)
            .then(function(user){
                //Login user after updating username
                req.login(user, function(err) {
                    if (err) {
                        res.json({errors : [{msg : err}], user : null});
                    }
                    //send user details back after successful login.
                    var user_response = {
                        username: user.username,
                        email: user.email,
                        role: user.role
                    };
                    res.json({errors : null, user : user_response});
                });
            })
            .catch(function(err){
                res.json({errors : [{msg : err}], user : null});
            });
    }
});

module.exports = router;
