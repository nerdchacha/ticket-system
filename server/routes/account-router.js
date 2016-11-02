var express             = require('express'),
    usersBl             = require('../business-layer/users-bl.js'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local').Strategy,
    GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy,
    User                = require('../models/user-model.js'),
    validator           = require('../business-layer/request-validator.js'),
    auth                = require('../config/auth.js'),
    helper              = require('../business-layer/helper.js'),
    q                   = require('q'),
    R                   = require('ramda'),
    log                 = require('../config/log4js-config.js'),
    router              = express.Router();


passport.use(new LocalStrategy(
    function(username, password, done) {
        //Get the user by username
        var user;
        usersBl.getUserByUsername(username)
            .then(function(user){
                this.user = user;
                //If no user exists, send appropriate message to client
                if(!user){
                    return done(null, false, {message: 'No user found with given username.'});
                }
                //If user is not a local user, send appropriate message to client
                if(!user.local.password){
                    return done(null, false, {message: 'The user is registered using google auth. Please log in using google auth.'});
                }
                //Match password
                return usersBl.comparePassword(password, user.local.password);
            })
            .then(function(isMatch){
                //If do not password match, call done with error message
                if(!isMatch)
                    return done(null, false, {message: 'The username and password do not match'});
                //password matches
                else {
                    return done(null,this.user);
                }
            })
            .catch(function(err){
                //In case of any errors, throw error
                log.error('Error getting user in LocalStratergy -', err);
                if(err) throw err;
            });
    }));

passport.use(new GoogleStrategy({
            clientID: auth.google.clientID,
            clientSecret: auth.google.clientSecret,
            callbackURL: auth.google.callbackURL
        },
        function(token,refreshToken,profile,done){
            process.nextTick(function(){
                User.findGoogleUser(profile.id)
                .then(user => {
                    if(user){
                        //if user is found, log them in
                        return done(null,user);
                    }
                    else{
                        //else create new google user in db
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.email = profile.emails[0].value;
                        newUser.role = ['User'];
                        newUser.isActive = true;

                        newUser.save(function(err){
                            if(err){
                                log.error('Error saving user in GoogleStratergy', err);
                                throw err;
                            }
                            return done(null,newUser);
                        })
                    }
                })
                .catch(err => {
                    log.error('Error finding user in GoogleStratergy -', err);
                    return done(err,null);
                });
                // User.findGoogleUser(profile.id,function(err,user){
                //     if(err) { return done(err,null); }
                //     if(user){
                //         //if user is found, log them in
                //         return done(null,user);
                //     }
                //     else{
                //         //else create new google user in db
                //         var newUser = new User();
                //         newUser.google.id = profile.id;
                //         newUser.google.token = token;
                //         newUser.google.name = profile.displayName;
                //         newUser.email = profile.emails[0].value;
                //         newUser.role = ['User'];
                //         newUser.isActive = true;

                //         newUser.save(function(err){
                //             if(err)
                //                 throw err;
                //             return done(null,newUser);
                //         })
                //     }
                // });
            })
        })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// passport.deserializeUser(function(id, done) {
//     User.findUserById(id, function(err, user) {
//         done(err, user);
//     });
// });

passport.deserializeUser(function(id, done) {
    User.findUserById(id)
    .then(function(user) {
        done(null, user);
    })
    .catch(function(error) {
        log.error('Error deserializing user -', err);
        done(error, null);
    });
});

router.post('/register',function(req,res,next){
    var createUser = R.composeP(
            usersBl.createLocalUser,
            validator.validateNewUser        
        )(req);

    createUser
        .then(() => res.json())
        .catch((error) => {
            log.error('Error in ACCOUNT ROUTER - POST at endpoint /register -', err);
            var errors = helper.createResponseError(error, 'There was some issue trying to create user. Please try again after some time')
            res.json({errors: errors});
        });
});

//POST the login form
router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info){
            //Set cookie age
            if (req.body.remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                req.session.cookie.maxAge = 1000 * 60 * 30; //Cookie expired after 30 minutes
            }
            //Error occurred while login
            if(err) {
                log.debug('Error occured while loggin in -', err);
                res.json({error : err, isAuthenticated : false, msg: 'There was some error while trying to log you in. Please try again after some time'});
            }
            //Wrong info provided by user
            if(!user) {
                log.info('Failed login due to wrong credentials -', req.body.username);
                res.json({error : null, isAuthenticated : false, msg: info.message});
            }
            //Successful login
            else {
                //User is not active
                if(!user.isActive){
                    log.info('Failed login due to inactive user -', req.body.username);
                    res.json({error : err, isAuthenticated : false, msg: 'The user is inactive.'});
                }

                req.login(user, function(err) {
                    if (err) { 
                        log.error('Error in ACCOUNT ROUTER - POST at /login endpoint -', err);
                        return next(err); 
                    }
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

//GET logout
router.get('/logout',function(req,res,next){
  req.logout();
  res.end();
});

//GET request fro google auth
router.get('/auth/google',passport.authenticate('google', { scope : ['profile', 'email'] }));

//GET request google makes after successful authentication
router.get('/auth/google/callback',function(req,res,next){
    passport.authenticate('google',function(err,user,info){
        if(err){
            log.error('Error authenticating google user', err);            
            res.render('oauth-redirect',{user : null, error: err, isActive : false});
        } 
        else if(!user) res.render('oauth-redirect',{user : null, error: 'User doesn\'t exist', isActive:false});
        //User is authenticated but since username name is not set, do not login user.
        else if(!user.username || user.username === '') res.render('oauth-redirect',{user: JSON.stringify(user), error: null, isActive: user.isActive});
        //Username is set but user is not active
        else if(!user.isActive) res.render('oauth-redirect',{user: null, error: 'User is inactive. Please contact the application Admin', isActive: false});
        //In case user is authenticated and username is set and user is active user, login the user.
        else {
            req.login(user, function(err) {
                if (err) { 
                    log.error('Error login in google user -', err);
                    return next(err); 
                }
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

//POST to set username for the first time when user logs in using OAuth2 provider.
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
            var deferred = q.defer();
            req.login(user, function(err) {
                if (err) {
                    log.error('Error login in user post username setup -', err);
                    deferred.reject(err);
                }
                deferred.resolve(user);
            });
            return deferred.promise;
        })
        .then(function(user){
            return helper.createResponseUser(user)
        })
        .then(function(resUser){
            res.json({errors : null, user : resUser});
        })
        .catch(function(errors){
            log.error('Error in /set-username endpoint -', err);
            var errors = helper.createResponseError(errors, 'There was some error update username. Please try again later');
            res.json({errors: errors});
        })
});

module.exports = router;
