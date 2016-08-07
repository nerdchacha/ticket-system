var express = require('express');
var router = express.Router();
var usersBl = require('../business-layer/users-bl.js');
var passport = require('passport');
var LocalStratergy = require('passport-local').Stratergy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user-model.js');
var validator = require('../business-layer/request-validator.js');
var auth = require('../config/auth.js');
var helper = require('../business-layer/helper.js');


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserbyUsername(username,function(err,user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user found with given username.'});
            }
            if(!user.local.password){
                return done(null, false, {message: 'The user is registered using google auth. Please log in using google auth.'});
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
                        newUser.isActive = true;

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

//POST the data for the user registration form
router.post('/register',function(req,res,next){
    //validate if request has all required parameters
    validator.validateNewUser(req,res)
        .then(function(){
            //No validation errors
            //Crete a new local user
            return usersBl.createLocalUser(req,res)
        })
        .then(function(user){
            //New local user created successfully
            res.json({errors: null});
        },
        //Error in creating local user
        function(err){
            res.json({errors: [{msg : 'There was some issue trying to create user. Please try again after some time'}]});
        })
        .catch(function(errors){
          //If validation failed
          res.render({errors: errors});
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
        else if(!user.username || user.username === '') res.render('oauth-redirect',{user: JSON.stringify(user), error: null, isActive: user.isActive});
        //Username is set but user is not active
        else if(!user.isActive) res.render('oauth-redirect',{user: null, error: 'User is inactive. Please contact the application Admin', isActive: false});
        //In case user is authenticated and username is set and user is active user, login the user.
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
    //Check if http request has all mandatory params
    validator.checkSetUsername(req,res)
        .then(function(){
            //If no validation errors
            var id = req.body.id;
            var username = req.body.username;
            //set username and set active flag to true
            return usersBl.setUsenameAndActive(id,username)
        })
        .then(function(user){
            //Once username and active flag is set
            //Login user
            req.login(user, function(err) {
                if (err) {
                    res.json({errors : [{msg : err}], user : null});
                }
                //create response user object
                helper.createResponseUser(user)
                    .then(function(resUser){
                        //send response user object to client
                        res.json({errors : null, user : resUser});
                    });
            });
        },
        function(err){
            //Error updating username and active flag
            res.json({errors : [{msg : err}], user : null});
        })
        .catch(function(errors){
            //Validation error
            res.render({errors: errors});
        });
});

module.exports = router;
