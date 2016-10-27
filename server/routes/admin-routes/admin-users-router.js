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
    q                       = require('q'),
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
            var errors = helper.createResponseError(errors, 'There was some error getting all the users. Please try again later');
            res.json({ errors: errors });
        });
});


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
            var errors = helper.createResponseError(errors, 'There was some error resetting user password. Please try again later');
            res.json({ errors: errors });
        });
});


/*-------------------------------------------------------
 GET tickets count
 -------------------------------------------------------*/
router.get('/dashboard',(req,res,next) => {
    q.all([
        ticketsBl.getNewTicketCount(),
        ticketsBl.getOpenTicketCount(),
        ticketsBl.getInProgressTicketCount(),
        ticketsBl.getAwaitingUserResponseTicketCount(),
        ticketsBl.getBugTicketCount(),
        ticketsBl.getNeedInfoTicketCount(),
        ticketsBl.getImprovementTicketCount(),
        ticketsBl.getHighTicketCount(),
        ticketsBl.getMediumTicketCount(),
        ticketsBl.getLowTicketCount()
    ])
    .then(ticketCounts => {
        res.json({
            tickets: {
                new                     : {count: ticketCounts[0]},
                open                    : {count: ticketCounts[1]},
                inProgress              : {count: ticketCounts[2]},
                awaitingUserResponse    : {count: ticketCounts[3]},
                bug                     : {count: ticketCounts[4]},
                needInfo                : {count: ticketCounts[5]},
                improvement             : {count: ticketCounts[6]},
                high                    : {count: ticketCounts[7]},
                medium                  : {count: ticketCounts[8]},
                low                     : {count: ticketCounts[9]}
            }
        });
    })
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to load dashboard data. Please try again after some time.');
        res.json({ errors: errors});
    })
});


/*-------------------------------------------------------
 GET tickets opened within 24 hours
 -------------------------------------------------------*/
router.get('/open-within-day', (req,res,next) => {
    ticketsBl.openWithin24Hours(req,res)
    .then(ticketDetails => res.json(ticketDetails))
    .catch(err => {            
        var errors= helper.createResponseError(err, 'There was some error trying to get the tickets created within 24 hours. Please try again after some time.');
        res.json({errors: errors});
    });
});


/*-------------------------------------------------------
 GET tickets filtered by status
 -------------------------------------------------------*/
router.get('/status/:status', (req,res,next) => {
    validator.validateGetTicketData(req)
    .then(() => ticketsBl.getTicketsByStatus(req,res))
    .then(ticketDetails => res.json(ticketDetails))
    .catch(err => {          
        var errors= helper.createResponseError(err, 'There was some error trying to get the tickets filtered by status. Please try again after some time.');
        res.json({errors: errors});
    });
});


/*-------------------------------------------------------
 GET tickets filtered by type
 -------------------------------------------------------*/
router.get('/type/:type', (req,res,next) => {
    validator.filterByType(req)
    .then(() => ticketsBl.getTicketsByType(req,res))
    .then(ticketDetails => res.json(ticketDetails))
    .catch(err => {          
        var errors= helper.createResponseError(err, 'There was some error trying to get the tickets filtered by status. Please try again after some time.');
        res.json({errors: errors});
    });
});

/*-------------------------------------------------------
 GET tickets filtered by priority
 -------------------------------------------------------*/
router.get('/priority/:priority', (req,res,next) => {
    validator.filterByPriority(req)
    .then(() => ticketsBl.getTicketsByPriority(req,res))
    .then(ticketDetails => res.json(ticketDetails))
    .catch(err => {          
        var errors= helper.createResponseError(err, 'There was some error trying to get the tickets filtered by status. Please try again after some time.');
        res.json({errors: errors});
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
