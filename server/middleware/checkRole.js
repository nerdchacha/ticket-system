/**
 * Created by dell on 8/1/2016.
 */
var userBl      = require('../business-layer/users-bl.js'),
    q           = require('q'),
    rolesEnum   = require('../config/enum-config.js').roles;

var roles = {};

roles.isSupport = (req,res,next) => {
    //User is not authenticated
    if (!req.user) {
        res.status(403);
        res.end();
    };
    //Let admin user pass or support user
    if(req.user.role.indexOf(rolesEnum.admin) > -1 || req.user.role.indexOf(rolesEnum.support))
        next();
    //User trying to access the route is not an admin or support user
    else{
        res.status(403);
        res.end();
    }
};

roles.isAdmin = (req,res,next) => {
    //User is not authenticated
    if (!req.user) {
        res.status(403);
        res.end();
    };
    //User trying to access the route is not an admin
    if (req.user.role.indexOf(rolesEnum.admin) === -1) {
        res.status(403);
        res.end();
    }
    else{
        //User is authenticated and is admin
        next();
    }
};

module.exports = roles;