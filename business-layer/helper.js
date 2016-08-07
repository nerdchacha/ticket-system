/**
 * Created by dell on 8/5/2016.
 */
var q = require('q');

var helper = {};

helper.createResponseUser = function(user){
    var deferred = q.defer();
    //Make process asynchronous
    process.nextTick(function(){
        var response = {};
        if(user.local){
            response.firstname = user.local.firstname || null;
            response.lastname = user.local.lastname || null;
        }
        response.email = user.email || null;
        response.role = user.role || null;
        response.username = user.username || null;
        response.isActive = user.isActive || null;
        response._id = user._id || null;

        deferred.resolve(response);
    });
    return deferred.promise;
};

helper.createResponseError = function(err){
    var deferred = q.defer();
    //Make process asynchronous
    process.nextTick(function(){
        var response = [];
        //List of errors
        if(err.constructor === Array){
            for(var i= 0; i< err.length; i++)
                response.push(err[i]);
        }
        //Only one error
        else{
            response.push(err);
        }
    });
    return deferred.promise;
};

module.exports = helper;