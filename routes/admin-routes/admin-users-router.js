/**
 * Created by dell on 8/2/2016.
 */
var express = require('express');
var router = express.Router();
var adminBl = require('../../business-layer/admin-bl.js');
var usersBl =require('../../business-layer/users-bl.js');
var helper = require('../../business-layer/helper.js');
var validator = require('../../business-layer/request-validator.js');

//GET all users details
router.get('/users-details',function(req,res,next){
    adminBl.fetchAllUsers(req,res)
        .then(function(users){
            res.json(users);
        })
        .catch(function(err){
            res.json({errors: [{msg : err}] });
        });
});

//GET user details of a user
router.get('/user-details/:username',function(req,res,next){
    //Check if request has all mandatory parameters
    validator.validateUsername(req,res)
        .then(function(){
            //request is valid
            var username = req.params.username;
            return usersBl.getUserByUsername(username);
        })
        .then(function(user){
            //User with given username found
            return helper.createResponseUser(user);
        },
            function(err){
            //Error finding user details
            res.json({user : null, errors : [{msg : err}]});
        })
        .then(function(user){
            res.json({user : user, errors : null});
        })
        .catch(function(err){
            //invalid request
            res.json({user : null, errors : err})
        });
});

router.post('/update-user/:username',function(req,res,next){
    //Check if request has mandatory fields
    validator.vaidateUpdateUser(req,res)
        .then(function(user){
            //Valid request
            var username = req.params.username;
            //Update user details
            return adminBl.updateUser(username, user)
        })
        .then(function(user){
            //Pass on the updated user details to client
            helper.createResponseUser(user)
                .then(function(resUser){
                    res.json({user : resUser, errors: null});
                });
        },
            function(err){
                console.log(err);
                //Error while updating ser details
                res.json({user : null, errors: [{msg : err}]});
            })
        .catch(function(err){
            //Invalid request
            res.json({user : null, errors : err});
        })
});

router.post('/reset-password/:id',function(req,res,next){
    //Check if request has all mandatory parameters
    validator.validateResetPassword(req,res)
        .then(function(){
            //Request is valid
            return adminBl.resetPassword(req, res)
        })
        .then(function(){
            //Password successfully reset
            res.json({errors: null});
        },
            function(err){
                //Error in resetting password
                res.json({errors: [{msg : err}]});
        })
        .catch(function(err){
            //Request is invalid
           res.json({errors : err});
        });
});

module.exports = router;
