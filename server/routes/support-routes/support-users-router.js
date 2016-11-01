var express                 = require('express'),
    adminBl                 = require('../../business-layer/admin-bl.js'),
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

module.exports = router;