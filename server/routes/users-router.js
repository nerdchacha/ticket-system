/**
 * Created by dell on 7/31/2016.
 */
var express     = require('express'),
    usersBl     = require('../business-layer/users-bl.js'),
    validator   = require('../business-layer/request-validator.js'),
    helper      = require('../business-layer/helper.js'),
    R           = require('ramda'),
    router      = express.Router();

router.get('/profile/:username',(req,res,next) => {
    validator.validateUsername(req)
    .then(() => usersBl.getUserByUsername(req.params.username))
    .then(user => helper.createResponseUser(user))
    .then(user => res.json({ user : user }))
    .catch(error => {
        var errors = helper.createResponseError(errors, 'There was some error getting user details. Please try again later');
        res.json({ errors: errors });
    });
});

router.post('/profile/:username',(req,res,next) => {
    validator.validateUpdateProfile(req)
    .then(() => usersBl.updateProfile(req))
    .then(user => helper.createResponseUser(user))
    .then(user => res.json({ user: user }))
    .catch(error => {
        var errors = helper.createResponseError(errors, 'There was some error update user details. Please try again later');
        res.json({ errors: errors });
    });        
});

router.post('/profile/change-password/:id',(req,res,next) => {
    validator.validateResetPassword(req)
    .then(() => usersBl.changePassword(req))
    .then(() => res.json({}))
    .catch(error => {
        var errors = helper.createResponseError(errors, 'There was some error in resetting the users password. Please try again later');
        res.json({ errors: errors });
    });        
});


function getUsernameFromRequest(req){
    return req.params.username;
}

module.exports = router;