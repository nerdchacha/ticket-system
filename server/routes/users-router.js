/**
 * Created by dell on 7/31/2016.
 */
var express     = require('express'),
    usersBl     = require('../business-layer/users-bl.js'),
    validator   = require('../business-layer/request-validator.js'),
    helper      = require('../business-layer/helper.js'),
    R           = require('ramda'),
    router      = express.Router();

router.get('/profile/:username',function(req,res,next){
    var getUserProfile = R.composeP(
            helper.createResponseUser,
            usersBl.getUserByUsername,
            getUsernameFromRequest,
            validator.validateUsername      
        )(req);

    getUserProfile
        .then(user => res.json({ user : user }))
        .catch(error => {
            var errors = helper.createResponseError(errors, 'There was some error getting user details. Please try again later');
            res.json({ errors: errors });
        })
});

router.post('/profile/:username',function(req,res,next){
    var updateProfile = R.composeP(
            helper.createResponseUser,
            usersBl.updateProfile,
            validator.validateUpdateProfile
        )(req);

    updateProfile
        .then(user => res.json({ user: user }))
        .catch(error => {
            var errors = helper.createResponseError(errors, 'There was some error update user details. Please try again later');
            res.json({ errors: errors });
        });
});

router.post('/profile/change-password/:id',function(req,res,next){
    var changePassword = R.composeP(
            usersBl.changePassword,
            validator.validateResetPassword
        )(req);

    changePassword
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