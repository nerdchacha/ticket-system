/**
 * Created by dell on 8/5/2016.
 */
var q = require('q'),
    User = require('../models/user-model.js');

var admin = {};

admin.fetchAllUsers = function(req,res){
    var sort = req.query.sort || 'id';
    var order = req.query.order || 'asc';
    var page = req.query.page || 1;
    var size = parseInt(req.query.size) || 10;
    if(page === 'undefined') page = 1;
    if(size === 'undefined') size = 10;
    var ret = {};
    var deferred = q.defer();

    User.getAllUserDetails(function(err, users){
        if(err) deferred.reject(err);
        else{
            users.sort(function(a,b){
                if(order === 'asc'){
                    if(a[sort] < b[sort])
                        return -1;
                    else if(a[sort] > b[sort])
                        return 1;
                    return 0;
                }
                else{
                    if(a[sort] > b[sort])
                        return -1;
                    else if(a[sort] < b[sort])
                        return 1;
                    return 0;
                }
            });
            ret.users = users.slice((page - 1) * size, ((page - 1) * size) + size);
            ret.page = parseInt(page);
            ret.count = users.length;
            ret.size = size;
            deferred.resolve(ret);
        }
    });
    return deferred.promise;
};

admin.updateUser = function(username,userDetails){
    var deferred = q.defer();

    User.updateUser(username,userDetails,function(err,user){
        if(err) deferred.reject(err);
        else deferred.resolve(user);
    });

    return deferred.promise;
};

admin.resetPassword = function(req,res){
    var deferred = q.defer();
    var id = req.params.id;
    var password = req.body.password;
    User.resetPassword(id,password,function(err){
        if(err) deferred.reject(err);
        else deferred.resolve();
    });

    return deferred.promise;
};

module.exports = admin;