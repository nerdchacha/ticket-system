/**
 * Created by dell on 7/23/2016.
 */
var url = require('url');

module.exports.isAuthenticated = function(req,res,next){
    var parsed_url = url.parse(req.url);
    if(parsed_url.pathname === '/users/login' || parsed_url.pathname === '/users/register' || parsed_url.pathname === '/tickets')
        return next();
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.status(401);
        res.render('401.ejs');
    }
};