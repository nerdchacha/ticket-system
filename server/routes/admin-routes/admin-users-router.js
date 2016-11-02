/**
 * Created by dell on 8/2/2016.
 */
var express                 = require('express'),
    adminBl                 = require('../../business-layer/admin-bl.js'),
    ticketsBl               = require('../../business-layer/ticket-bl.js'),
    usersBl                 = require('../../business-layer/users-bl.js'),
    helper                  = require('../../business-layer/helper.js'),
    validator               = require('../../business-layer/request-validator.js'),
    R                       = require('ramda'),
    log                     = require('../../config/log4js-config.js'),
    q                       = require('q'),
    router                  = express.Router();



/*-------------------------------------------------------
 GET User details for a perticular user
 -------------------------------------------------------*/
router.get('/user-details/:username',(req,res,next) => {
    var getUserDetails = R.composeP(
        helper.createResponseUser,
        usersBl.getUserByUsername,
        getUsernameFromReq,      
        validator.validateUsername  
        )(req);

    getUserDetails
        .then(user => {
            res.json({user : user});
        })
        .catch(err => {
            log.error('Error in ADMIN-USERS-ROUTER - GET /user-details/:username endpoint -', err);  
            var errors = helper.createResponseError(errors, 'There was some error getting user details. Please try again later');
            res.json({ errors: errors });
        });
});

/*-------------------------------------------------------
 UPDATE User details for a perticular user
 -------------------------------------------------------*/
router.post('/update-user/:username',(req,res,next) => {
    var updateUserDetails = R.composeP(
        helper.createResponseUser,
        adminBl.updateUser,
        getUserDetails,
        validator.vaidateUpdateUser
        )(req);

    updateUserDetails
        .then(user => {
            res.json({user : user});
        })
        .catch(err => {
            log.error('Error in ADMIN-USERS-ROUTER - POST /user-details/:username endpoint -', err);  
            var errors = helper.createResponseError(errors, 'There was some error updating user details. Please try again later');
            res.json({ errors: errors });
        });
});

/*-------------------------------------------------------
 RESET password for a perticular user
 -------------------------------------------------------*/
router.post('/reset-password/:id',(req,res,next) => {
    var resetPassword = R.composeP(
        adminBl.resetPassword,
        validator.validateResetPassword
        )(req);

    resetPassword
        .then(() => {
            res.json();
        })
        .catch(err => {
            log.error('Error in ADMIN-USERS-ROUTER - POST /reset-password/:id -', err);  
            var errors = helper.createResponseError(errors, 'There was some error resetting user password. Please try again later');
            res.json({ errors: errors });
        });
});


//--------------------------------------------------------------------------------
//--------------------------------FUNCTIONS---------------------------------------
//--------------------------------------------------------------------------------


function getUserDetails(req){
    var user = {};
    user.username = req.params.username;
    user.email = req.body.email;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.isAdmin = req.body.isAdmin;
    user.isSupport = req.body.isSupport;
    user.isActive = req.body.isActive;

    return user;
}

function getUsernameFromReq(req){
    return req.params.username
}

module.exports = router;
