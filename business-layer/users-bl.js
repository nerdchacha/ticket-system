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

module.exports = usersBl;