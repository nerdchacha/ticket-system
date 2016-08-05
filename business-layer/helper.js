/**
 * Created by dell on 8/5/2016.
 */
var q = require('q');

var helper = {};

helper.createResponseUser = function(user){
    var deferred = q.defer();
    //Make process asynchronous
    process.nextTick(function(){
        console.log('before');
        console.log(user);
        var response = {};
        if(user.local){
            response.firstname = user.local.firstname || null;
            response.lastname = user.local.lastname || null;
        }
        response.email = user.email || null;
        response.role = user.role || null;
        response.username = user.username || null;
        console.log('after');
        console.log(response);
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
        if(typeof err === 'Array'){
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