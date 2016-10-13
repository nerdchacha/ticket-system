/**
 * Created by dell on 8/5/2016.
 */
var q       = require('q'),
    R       = require('ramda'),
    User    = require('../models/user-model.js');

var admin = {};

admin.fetchAllUsers = req => {

    var sort    = getSort(req),
        order   = getOrder(req),
        page    = getPage(req),
        size    = getSize(req);

    var deferred = q.defer();
    var getUsersForPage = getDataforPage(page, size);
    var sortUsers       = sortData(order, sort);    

    User.getAllUserDetails((err, users) => {
        if(err) deferred.reject(err);
        
        var processedUsers = R.pipe(
            sortUsers,
            getUsersForPage
            )(users);

        var response = {};
        response.users   = processedUsers;
        response.page    = page;
        response.count   = processedUsers.length;
        response.size    = size;

        deferred.resolve(response);
    });  

    return deferred.promise;  

    /*var sort = req.query.sort || 'id';
    var order = req.query.order || 'asc';
    var page = req.query.page || 1;
    var size = parseInt(req.query.size) || 10;
    if(page === 'undefined') page = 1;
    if(size === 'undefined') size = 10;
    var ret = {};
    var deferred = q.defer();

    User.getAllUserDetails((err, users) => {
        if(err) deferred.reject(err);
        else{
            users.sort((a,b) => {
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
    return deferred.promise;*/
};

admin.updateUser = userDetails => {
    var deferred = q.defer();

    User.updateUser(
        userDetails.username, 
        userDetails, 
        (err,user) => {
            if(err) deferred.reject(err);
            else deferred.resolve(user);
        });

    return deferred.promise;
};

admin.resetPassword = req => {
    var deferred = q.defer();
    User.resetPassword(
        req.params.id,
        req.body.password,
        err => {
            if(err) deferred.reject(err);
            else deferred.resolve();
        });

    return deferred.promise;
};



function getSort(req){
    return req.query.sort ? req.query.sort : 'id';
}

function getOrder(req){
    return req.query.order ? req.query.order : 'asc';
}

function getPage(req){
    return req.query.page ? parseInt(req.query.page) : 1;
}

function getSize(req){
    return req.query.size ? parseInt(req.query.size) : 10;
}

function sortData(order, sort){
    return function(list){
        console.log(list.map((user) => user.username));
        return order === 'asc' ? list.sort((a,b) => b[sort] <= a[sort]) : list.sort((a,b) => a[sort] <= b[sort]);
    }
}

function getDataforPage(page, size){
    return function(list){
        console.log(list.map((user) => user.username));
        return list.slice((page - 1) * size, ((page - 1) * size) + size);
    }
}

module.exports = admin;