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

module.exports = router;