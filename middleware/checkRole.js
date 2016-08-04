/**
 * Created by dell on 8/1/2016.
 */
var userBl = require('../business-layer/users-bl.js');
var q = require('q');

module.exports.isAdmin = function(req,res,next){
    //User is not authenticated
    if (!req.user) {
        res.status(403);
        res.end();
    };

    userBl.getUserByUsername(req.user.username)
        .then(function (user) {
            //User trying to access the route is not an admin
            if (user.role.indexOf('Admin') === -1) {
                res.status(403);
                res.end();
            }
            else{
                //User is authenticated and is admin
                next();
            }
        });
};