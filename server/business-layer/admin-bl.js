/**
 * Created by dell on 8/5/2016.
 */
var q       = require('q'),
    R       = require('ramda'),
    helper  = require('../business-layer/helper.js'),
    User    = require('../models/user-model.js');

var admin = {};

admin.fetchAllUsers = req => {

    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);

    var deferred = q.defer();
    var getUsersForPage = helper.getDataforPage(page, size);
    var sortUsers       = helper.sortData(order, sort);    

    var getAllUserDetails = R.composeP(
        sortUsers,
        getUsersForPage,
        User.getAllUserDetails
    )();

    getAllUserDetails
        .then(users => {
            var response = {};
            response.users   = users;
            response.page    = page;
            response.count   = users.length;
            response.size    = size;

            deferred.resolve(response);
        })
        .catch(error => deferred.reject(error));  

    return deferred.promise;  
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

module.exports = admin;