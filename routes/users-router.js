var express = require('express');
var router = express.Router();
var usersBl = require('../business-layer/users-bl.js');
var passport = require('passport');
var LocalStratergy = require('passport-local').Stratergy;
var User = require('../models/user-model.js');
var validator = require('../business-layer/request-validator.js');

//GET the user registration form
router.get('/register',function(req,res,next){
  res.render('user/register', {errors:null} );
});

//POST the data for the user registration form
router.post('/register',function(req,res,next){
  var errors = validator.validateNewUser(req,res);
  if(errors){
    console.log('errors');
    res.render('user/register',{errors: errors});
  }
  else{
    usersBl.createUser(req,res)
        .then(function(user){
            req.flash('success_msg','User has been created successfully. You can now login.');
            res.redirect('/users/login');
        })
        .catch(function(error){
          req.flash('error_msg','There was some issue trying to create user. Please try again after some time');
          res.redirect('/users/login');
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

/* GET the login page. */
router.get('/login',function(req,res,next){
  res.render('user/login');
});

//POST to the login page
router.post('/login', passport.authenticate('local', { successRedirect: '/tickets',
  failureRedirect: '/users/login', failureFlash: true }));

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('login');
});



module.exports = router;
