/**
 * Created by dell on 7/31/2016.
 */
var express = require('express');
var router = express.Router();
var usersBl = require('../business-layer/users-bl.js');
var validator = require('../business-layer/request-validator.js');
var helper = require('../business-layer/helper.js');

//GET user profile
router.get('/profile/:username',function(req,res,next){
    //Validate if 'username' is sent in the http request params
    validator.validateUsername(req,res)
        .then(function(){
            //If no errors are found
            //Fetch user with given username
            return usersBl.getUserByUsername(req.params.username)
        })
        //get user by username
        .then(function(user){
            //User found
           return helper.createResponseUser(user)
        })
        //After user with username is found
        //Create response user object with only selective propertoes like firstname, lastname etc
        .then(function(resUser){
            res.json({errors: null, user: resUser});
        })
        //In case validation fails or any other erros generated
        .catch(function(errors){
            return helper.createResponseError(errors, 'There was some error getting user details. Please try again later');
        })
        .then(function(errors){
            //Send error back to client
            res.json({errors: errors, user: null});
        });
});

//POST data to update user profile
router.post('/profile/:username',function(req,res,next){
    validator.validateUpdateProfile(req,res)
        .then(function(){
            //Update profile if no validation errors
            return usersBl.updateProfile(req,res)
        })
        .then(function(user){
            //If profile updated successfully, send updated user to client
            return helper.createResponseUser(user)
        })
        .then(function(resUser){
            res.json({errors: null, user: resUser});
        })
        //Request validation failed as required values were not provided
        .catch(function(errors){
            return helper.createResponseError(errors, 'There was some error update user details. Please try again later');
        })
        .then(function(errors){
            res.json({errors: errors, user: null});
        });
});

module.exports = router;