/**
 * Created by dell on 8/1/2016.
 */
var userBl      = require('../business-layer/users-bl.js'),
    q           = require('q'),
    roles       = require('../config/role-config.js');

module.exports.isAdmin = function(req,res,next){
    //User is not authenticated
    if (!req.user) {
        res.status(403);
        res.end();
    };
    //User trying to access the route is not an admin
    if (req.user.role.indexOf(roles.admin) === -1) {
        res.status(403);
        res.end();
    }
    else{
        //User is authenticated and is admin
        next();
    }
};