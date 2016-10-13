/**
 * Created by dell on 8/2/2016.
 */
var express                 = require('express'),
    adminBl                 = require('../../business-layer/admin-bl.js'),
    usersBl                 = require('../../business-layer/users-bl.js'),
    helper                  = require('../../business-layer/helper.js'),
    validator               = require('../../business-layer/request-validator.js'),
    R                       = require('ramda'),
    router                  = express.Router();


/*-------------------------------------------------------
 GET User list of all users in the system
 -------------------------------------------------------*/
router.get('/users-details',(req,res,next) => {
    adminBl.fetchAllUsers(req,res)
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.json(helper.createError(err));
        });
});


/*-------------------------------------------------------
 GET User details for a perticular user
 -------------------------------------------------------*/
router.get('/user-details/:username',(req,res,next) => {
    var getUserDetails = R.pipeP(
        validator.validateUsername,  
        getUsernameFromReq,      
        usersBl.getUserByUsername,
        helper.createResponseUser
        )(req);

    getUserDetails
        .then(user => {
            res.json({user : user});
        })
        .catch(err => {
            res.json(helper.createError(err))
        });
});

/*-------------------------------------------------------
 UPDATE User details for a perticular user
 -------------------------------------------------------*/
router.post('/update-user/:username',(req,res,next) => {
    var updateUserDetails = R.pipeP(
        validator.vaidateUpdateUser,
        getUserDetails,
        adminBl.updateUser,
        helper.createResponseUser
        )(req);

    updateUserDetails
        .then(user => {
            res.json({user : user});
        })
        .catch(err => {
            res.json(helper.createError(err));
        });
});

/*-------------------------------------------------------
 RESET password for a perticular user
 -------------------------------------------------------*/
router.post('/reset-password/:id',(req,res,next) => {
    var resetPassword = R.pipeP(
        validator.validateResetPassword,
        adminBl.resetPassword
        )(req);

    resetPassword
        .then(() => {
            res.json();
        })
        .catch(err => {
           res.json(helper.createError(err));
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
    user.isActive = req.body.isActive;

    return user;
}

function getUsernameFromReq(req){
    return req.params.username
}

module.exports = router;
