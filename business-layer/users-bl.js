/**
 * Created by dell on 7/23/2016.
 */
var User = require('../models/user-model.js');
var q = require('q');

var usersBl = {};

usersBl.createUser = function(req,res){
    var deferred = q.defer();
    var newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.createUser(newUser,function(err, user){
        if(err) deferred.reject();
        else
            deferred.resolve(user);
    });

    return deferred.promise;
};

usersBl.getAllUsers = function(req,res){
    var deferred = q.defer();
    User.getAllUsers(function(err,users){
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
    else    deferred.resolve(user);
    });
    return deferred.promise;
};

usersBl.updateProfile = function(req,res){
    var user = {username: req.params.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email};
    var deferred = q.defer();
    User.updateUser(user,function(err, user){
        if(err) deferred.reject(err);
        else deferred.resolve({firstname: user.firstname,lastname: user.lastname,email: user.email,username: user.username});
    });
    return deferred.promise;
};

module.exports = usersBl;