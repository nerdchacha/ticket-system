/**
 * Created by dell on 7/31/2016.
 */
var express     = require('express'),
    usersBl     = require('../business-layer/users-bl.js'),
    validator   = require('../business-layer/request-validator.js'),
    helper      = require('../business-layer/helper.js'),
    R           = require('ramda'),
    log         = require('../config/log4js-config.js'),
    router      = express.Router();

router.get('/profile/:username',(req,res,next) => {
    validator.validateUsername(req)
    .then(() => usersBl.getUserByUsername(req.params.username))
    .then(user => helper.createResponseUser(user))
    .then(user => res.json({ user : user }))
    .catch(error => {
        log.error('Error in USERS ROUTER - GET /profile/:username endpoint -', error);
        var errors = helper.createResponseError(error, 'There was some error getting user details. Please try again later');
        res.json({ errors: errors });
    });
});

router.post('/profile/:username',(req,res,next) => {
    validator.validateUpdateProfile(req)
    .then(() => usersBl.updateProfile(req))
    .then(user => helper.createResponseUser(user))
    .then(user => res.json({ user: user }))
    .catch(error => {
        log.error('Error in USERS ROUTER - POST /profile/:username endpoint -', error);
        var errors = helper.createResponseError(error, 'There was some error update user details. Please try again later');
        res.json({ errors: errors });
    });        
});

router.post('/profile/change-password/:id',(req,res,next) => {
    validator.validateResetPassword(req)
    .then(() => usersBl.changePassword(req))
    .then(() => res.json({}))
    .catch(error => {
        log.error('Error in USERS ROUTER - POST /profile/change-password/:id endpoint -', error);
        var errors = helper.createResponseError(error, 'There was some error in resetting the users password. Please try again later');
        res.json({ errors: errors });
    });        
});


function getUsernameFromRequest(req){
    return req.params.username;
}

module.exports = router;