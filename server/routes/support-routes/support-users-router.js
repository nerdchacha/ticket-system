var express                 = require('express'),
    adminBl                 = require('../../business-layer/admin-bl.js'),
    log                     = require('../../config/log4js-config.js'),
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
            log.error('Error in SUPPORT-USERS-ROUTER - GET /users-details endpoint -', err);   
            var errors = helper.createResponseError(errors, 'There was some error getting all the users. Please try again later');
            res.json({ errors: errors });
        });
});

module.exports = router;