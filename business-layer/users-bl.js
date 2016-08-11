/**
 * Created by dell on 7/23/2016.
 */
var User = require('../models/user-model.js');
var q = require('q');
var roles = require('../config/role-config.js');

var usersBl = {};

usersBl.createLocalUser = function(req,res){
    var deferred = q.defer();
    var newUser = new User({
        username: req.body.username,
        isActive : true,
        role: [roles.user],
        email: req.body.email,
        local:{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        }
    });

    User.createUser(newUser,function(err, user){
        if(err) deferred.reject();
        else
            deferred.resolve(user);
    });

    return deferred.promise;
};

usersBl.getAllActiveUsers = function(req,res){
    var deferred = q.defer();
    User.getAllActiveUsers(function(err,users){
        if(err) deferred.reject(err);
        else
            deferred.resolve(users);
    });
    return deferred.promise;
};

usersBl.getUserByUsername = function(username){
    var deferred = q.defer();
    User.getUserbyUsername(username,function(err, user){
    if(err) deferred.reject(err);
    else deferred.resolve(user);
    });
    return deferred.promise;
};

usersBl.updateProfile = function(req,res){
    var user = {username: req.params.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email};
    var deferred = q.defer();
    User.updateProfile(user,function(err, user){
        if(err) deferred.reject(err);
        else deferred.resolve(user);
    });
    return deferred.promise;
};

usersBl.getAllUserDetails = function(){
    var deferred = q.defer();
    User.getAllUserDetails(function(err,user){
        if(err) deferred.reject(err);
        else deferred.resolve(user);
    });
    return deferred.promise;
};

usersBl.setUsenameAndActive = function(id,username){
    var deferred = q.defer();
    User.findUserById(id,function(err,user){
        //Check if user exists with the given user id.
        if(err) deferred.reject('Invalid user id');
        //check if the username is not already set.
        else if(user.username && user.username !== '') deferred.reject('User has username already set');
        else {
            //set new username for the user with given id
            User.setUsenameAndActive(id, username, function(err,user){
                if(err) deferred.reject(err);
                else deferred.resolve(user);
            });
        }
    });
    return deferred.promise;
};

//Just wrapping compare password inside a promise
usersBl.comparePassword = function(password, hash){
    var deferred = q.defer();
    User.comparePassword(password,hash,function(err, isMatch){
        if(err) deferred.reject(err);
        deferred.resolve(isMatch);
    });

    return deferred.promise;
};

module.exports = usersBl;