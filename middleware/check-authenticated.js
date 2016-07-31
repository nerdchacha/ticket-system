/**
 * Created by dell on 7/23/2016.
 */
var url = require('url');

module.exports.isAuthenticated = function(req,res,next){
    var parsed_url = url.parse(req.url);
    if(parsed_url.pathname === '/')
        return next();
    if(req.isAuthenticated()){
        //Set isAuthenticated header if user is authenticated
        res.header('isAuthenticated', true);
        return next();
    }
    else{
        res.status(401);
        res.end();
    }
};