/**
 * Created by dell on 8/5/2016.
 */
var q       = require('q'),
    R       = require('ramda'),
    helper  = require('./helper.js'),
    log     = require('../config/log4js-config.js'),
    User    = require('../models/user-model.js');

var admin = {};

admin.fetchAllUsers = req => {
    var sort    = helper.getSort(req),
            order   = helper.getOrder(req),
            page    = helper.getPage(req),
            size    = helper.getSize(req);
    
        var skip = (page - 1) * size;
        var limit = size;
        var sortString = helper.createSortString(sort, order);
        
        return q.all([
            User.getPaginationUserDetails(skip, limit, sortString),
            User.getAllUserCount()
            ])
        .then(values => {
            var users = values[0];
            var count = values[1];
            var response = {};
            response.users   = users;
            response.page    = page;
            response.count   = count;
            response.size    = size;
            return response;
        })
};

admin.updateUser = userDetails => User.updateUser(userDetails.username, userDetails);

admin.resetPassword = req => User.resetPassword(req.params.id,req.body.password);

module.exports = admin;