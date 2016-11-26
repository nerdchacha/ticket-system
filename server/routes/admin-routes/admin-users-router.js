/**
 * Created by dell on 8/2/2016.
 */
var express                 = require('express'),
    adminBl                 = require('../../business-layer/admin-bl.js'),
    ticketsBl               = require('../../business-layer/ticket-bl.js'),
    usersBl                 = require('../../business-layer/users-bl.js'),
    queueBl                 = require('../../business-layer/queue-bl.js')
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
        .then(user => res.json({user : user}))
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
        .then(user => res.json({user : user}))
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
        .then(() => res.json())
        .catch(err => {
            log.error('Error in ADMIN-USERS-ROUTER - POST /reset-password/:id -', err);  
            var errors = helper.createResponseError(errors, 'There was some error resetting user password. Please try again later');
            res.json({ errors: errors });
        });
});


/*-------------------------------------------------------
 POST a new queue name
 -------------------------------------------------------*/
router.post('/queue', (req,res,next) => {
    validator.validateAddQueue(req)
    .then(() => queueBl.createQueue(req.body.name))
    .then(queueBl.getQueue)
    .then(queues => res.json({queues: queues, errors: null}))
    .catch(err => {
        log.error('Error in ADMIN-USERS-ROUTER - POST /add-queue -', err);  
        var errors = helper.createResponseError(errors, 'There was some error adding a new queue. Please try again later');
        res.json({ errors: errors });
    })
})


/*-------------------------------------------------------
 PUT rename a queue
 -------------------------------------------------------*/
router.put('/queue/:id', (req,res,next) => {
    validator.validateUpdateQueue(req)
    .then(() => queueBl.updateQueue(req.params.id, req.body.name))
    .then(queueBl.getQueue)
    .then(queues => res.json({queues: queues, errors: null}))
    .catch(err => {
        log.error('Error in ADMIN-USERS-ROUTER - PUT /update-queue -', err);  
        var errors = helper.createResponseError(errors, 'There was some error adding a update queue. Please try again later');
        res.json({ errors: errors });
    })
})

/*-------------------------------------------------------
 GET all queues
 -------------------------------------------------------*/
router.get('/queue', (req,res,next) => {
    queueBl.getQueues()
    .then(queues => res.json({queues: queues, errors: null}))
    .catch(err => {
        log.error('Error in ADMIN-USERS-ROUTER - POST /get-queues -', err);  
        var errors = helper.createResponseError(errors, 'There was some error fetching queue list. Please try again later');
        res.json({ errors: errors });
    })
})

/*-------------------------------------------------------
 GET users for queue 
 -------------------------------------------------------*/
router.get('/queue/users/:id', (req, res, next) => {
    validator.validateGetQueueUsers(req)
    .then(() => queueBl.getQueueUsers(req.params.id))
    .then(users => res.json({users : users, error: null}))
    .catch(err => {
        console.log(err)
        log.error('Error in ADMIN-USERS-ROUTER - GET /queue/users -', err);  
        var errors = helper.createResponseError(errors, 'There was some error fetching users for queue. Please try again later');
        res.json({ errors: errors });
    })
})


/*-------------------------------------------------------
 PUT update users for queue 
 -------------------------------------------------------*/
router.put('/queue/users/:id', (req, res, next) => {
    validator.validateUpdateQueueUsers(req)
    .then(() => queueBl.updateQueueUsers(req.params.id, req.body.users))
    .then(users => res.json({users : users, error: null}))
    .catch(err => {
        console.log(err)
        log.error('Error in ADMIN-USERS-ROUTER - GET /queue/users -', err);  
        var errors = helper.createResponseError(errors, 'There was some error fetching users for queue. Please try again later');
        res.json({ errors: errors });
    })
})




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
