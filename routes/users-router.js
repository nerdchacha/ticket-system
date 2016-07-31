/**
 * Created by dell on 7/31/2016.
 */
var express = require('express');
var router = express.Router();
var usersBl = require('../business-layer/users-bl.js')
var validator = require('../business-layer/request-validator.js')

router.get('/profile/:username',function(req,res,next){
    var errors = validator.validateUsername(req,res);
    if(errors) res.json({errors: errors, user: null});
    else{
        usersBl.getUserByUsername(req.params.username)
            .then(function(user){
                res.json({errors: null, user: {username: user.username, firstname: user.firstname, lastname : user.lastname, email: user.email}});
            })
            .catch(function(err){
                res.json({errors: [{msg:err}], user: null});
            });
    }
});

router.post('/profile/:username',function(req,res,next){
    var errors = validator.validateUpdateProfile(req,res);
    if(errors) res.json({errors: errors, user: null});
    else{
        usersBl.updateProfile(req,res)
            .then(function(user){
                res.json({errors: null, user: user});
            })
            .catch(function(err){
                res.json({errors: [{msg:err}], user: null});
            });
    }
});

module.exports = router;