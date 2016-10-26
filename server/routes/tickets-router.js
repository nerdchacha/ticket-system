// /**
//  * Created by dell on 7/18/2016.
//  */
// var express     = require('express'),
//     router      = express.Router(),
//     ticketsBl   = require('../business-layer/ticket-bl.js'),
//     staticBl    = require('../business-layer/static-bl.js'),
//     usersBl     = require('../business-layer/users-bl.js'),
//     q           = require('q'),
//     validator   = require('../business-layer/request-validator.js'),
//     helper      = require('../business-layer/helper.js');

// var setStaticData = function(values){
//     var priorities = values[0].values.find(function (value) {
//         return value.name === 'priority'
//     });
//     var types = values[0].values.find(function (value) {
//         return value.name === 'type'
//     });
//     var status = values[0].values.find(function (value) {
//         return value.name === 'status'
//     });
//     var users = values[1];
//     return {priorities: priorities,types: types,statuses:status, users: users};
// };

// //GET static data on page load
// router.get('/static-data',function(req,res,next){
//     q.all([
//         staticBl.getInitialStaticData(),
//         usersBl.getAllActiveUsers()])
//         .then(function(values) {
//             var staticValues = setStaticData(values);
//             res.json(staticValues);
//         });
// });

// //GET static data with only possible ticket status on edit ticket page load
// router.get('/edit-ticket/initial-load/:status',function(req,res,next){
//     //Check if request is valid
//     validator.validateGetTicketData(req,res)
//         .then(function(){
//             return q.all([
//                 staticBl.getInitialStaticData(),
//                 usersBl.getAllActiveUsers()]);
//         })
//         .then(function(values) {
//             //request is valid
//             var currentStatus = req.params.status;
//             var allowedStatusList = values[0].values.find(function (value) {
//                 return value.name === 'allowed state';
//             });
//             var allowedStatus = allowedStatusList.values.find(function(value){
//                 return value.status === currentStatus;
//             });
//             allowedStatus.allowed.push(currentStatus);
//             var staticValues = setStaticData(values);
//             staticValues.statuses = allowedStatus.allowed;

//             res.json(staticValues);
//         })
//         .catch(function(err){
//             //invalid request
//             helper.createResponseError(err,'There was some issue trying to fetch static values. Please try again later');
//         })
//         .then(function(error){
//             res.json({errors: error});
//         });
// });

// //GET all tickets
// router.get('/all',function(req,res,next){
//     ticketsBl.fetchAllTickets(req,res)
//         .then(function(ticketDetails){
//             res.json(ticketDetails);
//         })
//         .catch(function(err){
//             if(err === 403){
//                 res.status(403);
//                 res.end();
//             }
//             else{
//                 res.json({errors: [{error: err}]});
//             }
//         });
// });

// //GET all tickets created by me
// router.get('/my',function(req,res,next){
//     ticketsBl.fetchMyTickets(req,res)
//         .then(function(ticketDetails){
//             res.json(ticketDetails);
//         });
// });

// //GET all tickets assigned to me
// router.get('/to-me',function(req,res,next){
//     //Check if current logged in user has rights to view 'Assigned to me' tickets
//     ticketsBl.fetchToMeTickets(req,res)
//         .then(function(ticketDetails){
//             res.json(ticketDetails);
//         })
//         .catch(function(err){
//             if(err === 403){
//                 res.status(403);
//                 res.end();
//             }
//             else{
//                 res.json({errors: [{error: err}]});
//             }

//         });
// });

// //POST new ticket
// router.post('/new',function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateNewTicket(req,res)
//         .then(function(){
//             //No validation errors
//             return ticketsBl.createNewTicket(req,res)
//         })
//         .then(function(ticket){
//             //Create new ticket and send ticket data to client
//             res.json(ticket);
//         })
//         .catch(function(errors){
//             //validation errors
//             return helper.createResponseError(errors, 'There was some error trying to create a new ticket. Please try again after some time.');
//         })
//         .then(function(errors){
//             res.json({errors: errors});
//         })
// });

// //Update ticket after edit
// router.put('/:id',function(req,res,next){
//     //Check if request has mandatory parameters
//     validator.validateUpdateTicket(req,res)
//         .then(function(){
//             //Request is valid
//             return ticketsBl.updateTicket(req,res);
//         })
//         .then(function(ticket){
//             res.json(ticket)
//         })
//         .catch(function(errors){
//             return helper.createResponseError(errors, 'There was some error trying to get the ticket details. Please try again after some time.');
//         })
//         .then(function(errors){
//             res.json({errors: errors});
//         });
// });

// //GET ticket by Id
// router.get('/:id',function(req,res,next){
//     //Check if request has mandatory parameters
//     validator.validateGetTicketById(req,res)
//         .then(function(){
//             //No validation errors
//             return ticketsBl.getTicketById(req.params.id, req.user)
//         })
//         .then(function(ticket){
//             if(!ticket) {
//                 res.json({errors: [{error : 'No ticket exists with given ticket id.'}]});
//             }
//             else {
//                 res.json(ticket);
//             }
//         })
//         .catch(function(errors){
//             if(errors === 403){
//                 res.status(403);
//                 res.end();
//             }
//             else return helper.createResponseError(errors, 'There was some error trying to get the ticket details. Please try again after some time.');
//         })
//         .then(function(errors){
//             res.json({errors: errors});
//         });
// });

// //POST comment on a ticket
// router.post('/addComment/:id',function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketAddComment(req,res)
//         .then(function(){
//             //No validation errors
//             //Add comment
//             return ticketsBl.addComment(req.params.id, {comment: req.body.comment, commentBy: req.user.username})
//         })
//         .then(function(ticket){
//             //Comment added successfully
//             res.json(ticket);
//         })
//         .catch(function(errors){
//             return helper.createResponseError(errors, 'There was some error trying to get the ticket details. Please try again after some time.');
//         })
//         .then(function(errors){
//             res.json({errors: errors});
//         });
// });

// //DELETE comment from a ticket
// router.delete('/deleteComment/:id', function(req,res,next){
//     validator.validateTicketDeleteComment(req,res)
//         .then(function(){
//             var commentId = req.query.commentId;
//             return ticketsBl.canUserDeleteComment(req,res,commentId)
//         })
//         .then(function(){
//             return ticketsBl.deleteComment(
//                 req.params.id,
//                 req.query.commentId)
//         })
//         .then(function(ticket){
//             res.json(ticket);
//         })        
//         .catch(function(errors){
//             res.json(helper.createError(errors));
//         });
// });


// //Change assignee for a ticket
// router.post('/assign/:id', function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketAssign(req,res)
//     .then(function(){
//         var id = req.params.id;
//         var assignee = req.body.assignee;
//         var comment = req.body.comment;
//         return ticketsBl.assignTicket(req.user.username, id, assignee, comment)
//     })
//     .then(function(ticket){
//         res.json(ticket);
//     })
//     .catch(function(errors){
//         res.json({errors: errors});
//     })
// });

// //Change status for a ticket
// router.post('/change-status/:id', function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketChangeStatus(req,res)
//     .then(function(){
//         var id = req.params.id;
//         var status = req.body.status;
//         var comment = req.body.comment;
//         return ticketsBl.changeStatus(req.user.username, id, status, comment)
//     })
//     .then(function(ticket){
//         res.json(ticket);
//     })
//     .catch(function(errors){
//         res.json({errors: errors});
//     })
// });

// //Change status for a ticket to awaiting users response
// router.post('/awaiting-user-response/:id', function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketAddComment(req,res)
//     .then(function(){
//         var id = req.params.id;
//         var status = 'Awaiting User Response';
//         var comment = req.body.comment;
//         return ticketsBl.changeStatus(req.user.username, id, status, comment)
//     })
//     .then(function(ticket){
//         res.json(ticket);
//     })
//     .catch(function(errors){
//         res.json({errors: errors});
//     });
// });

// //Change status for a ticket to awaiting users response
// router.post('/close/:id', function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketAddComment(req,res)
//     .then(function(){
//         var id = req.params.id;
//         var status = 'Closed';
//         var comment = req.body.comment;
//         return ticketsBl.changeStatus(req.user.username, id, status, comment)
//     })
//     .then(function(ticket){
//         res.json(ticket);
//     })
//     .catch(function(errors){
//         res.json({errors: errors});
//     });
// });

// //Change status for a ticket to awaiting users response
// router.post('/re-open/:id', function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketAddComment(req,res)
//     .then(function(){
//         var id = req.params.id;
//         var status = 'Re-Open';
//         var comment = req.body.comment;
//         return ticketsBl.changeStatus(req.user.username, id, status, comment)
//     })
//     .then(function(ticket){
//         res.json(ticket);
//     })
//     .catch(function(errors){
//         res.json({errors: errors});
//     });
// });


// //Change status for a ticket to awaiting users response
// router.post('/acknowledge/:id', function(req,res,next){
//     //Check if http request has mandatory parameters
//     validator.validateTicketAddComment(req,res)
//     .then(function(){
//         return ticketsBl.changeStatus(
//             req.user.username,
//             req.params.id,
//             'Open', 
//             req.body.comment)
//     })
//     .then(function(ticket){
//         res.json(ticket);
//     })
//     .catch(function(errors){
//         res.json({errors: errors});
//     });
// });

// module.exports = router;


/**
 * Created by dell on 7/18/2016.
 */
var express     = require('express'),
    router      = express.Router(),
    ticketsBl   = require('../business-layer/ticket-bl.js'),
    staticBl    = require('../business-layer/static-bl.js'),
    usersBl     = require('../business-layer/users-bl.js'),
    q           = require('q'),
    R           = require('ramda'),
    statusEnum  = require('../config/enum-config.js').status,
    validator   = require('../business-layer/request-validator.js'),
    helper      = require('../business-layer/helper.js');

var setStaticData = values => {
    var priorities = values[0].values.find(value => {
        return value.name === 'priority'
    });
    var types = values[0].values.find(value => {
        return value.name === 'type'
    });
    var status = values[0].values.find(value => {
        return value.name === 'status'
    });
    var users = values[1];
    return {
        priorities: priorities,
        types: types,
        statuses: status, 
        users: users
    };
};

router.get('/static-data',(req,res,next) => {
    q.all([
        staticBl.getInitialStaticData(),
        usersBl.getAllActiveUsers()])
        .then(values => {
            var staticValues = setStaticData(values);
            res.json(staticValues);
        });
});

router.get('/edit-ticket/initial-load/:status',(req,res,next) => {
    validator.validateGetTicketData(req)
        .then(() => {
            return q.all([
                staticBl.getInitialStaticData(),
                usersBl.getAllActiveUsers()]);
        })
        .then(values => {
            var currentStatus = req.params.status;
            var allowedStatusList = values[0].values.find(value => {
                return value.name === 'allowed state';
            });
            var allowedStatus = allowedStatusList.values.find(value => {
                return value.status === currentStatus;
            });
            allowedStatus.allowed.push(currentStatus);
            var staticValues = setStaticData(values);
            staticValues.statuses = allowedStatus.allowed;

            res.json(staticValues);
        })
        .catch(err => {
            var errors = helper.createResponseError(err,'There was some issue trying to fetch static values. Please try again later');
            res.json({errors: errors});
        });
});

router.get('/all',(req,res,next) => {
    ticketsBl.fetchAllTickets(req,res)
        .then(ticketDetails => res.json(ticketDetails))
        .catch(err => {            
            var errors= helper.createResponseError(err, 'There was some error trying to get all the tickets. Please try again after some time.');
            res.json({errors: errors});
        });
});

router.get('/my',(req,res,next) => {
    ticketsBl.fetchMyTickets(req,res)
        .then(ticketDetails => res.json(ticketDetails))
        .catch(err => {            
            var errors= helper.createResponseError(err, 'There was some error trying to get your tickets. Please try again after some time.');
            res.json({errors: errors});
        });
});

router.get('/to-me',(req,res,next) => {
    ticketsBl.fetchToMeTickets(req,res)
        .then(ticketDetails => res.json(ticketDetails))
        .catch(err => {            
            var errors= helper.createResponseError(err, 'There was some error trying to get the tickets assigned to me. Please try again after some time.');
            res.json({errors: errors});
        });
});


router.post('/new',(req,res,next) => {
    validator.validateNewTicket(req,res)
        .then(() => ticketsBl.createNewTicket(req,res))
        .then(ticket => res.json(ticket))
        .catch(err => {
            var errors = helper.createResponseError(err, 'There was some error trying to create a new ticket. Please try again after some time.');
            res.json({errors: errors});
        });
});


router.put('/:id',(req,res,next) => {
    validator.validateUpdateTicket(req)
        .then(() => ticketsBl.updateTicket(req,res))
        .then(ticket => res.json(ticket))
        .catch(err => {
            var errors = helper.createResponseError(err, 'There was some error trying to get the ticket details. Please try again after some time.');
            res.json({errors: errors});
        });
});


router.get('/:id', (req,res,next) => {
    console.log('hi');
    validator.validateGetTicketById(req)
    .then(() => ticketsBl.getTicketById(req.params.id, req.user))
    .then(ticket => res.json({ticket : ticket}))
    .catch(err => {
        var errors = helper.createResponseError(err, 'No ticket exists with given ticket id.');
        res.json({errors: errors});
    });
});


router.post('/addComment/:id',(req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.addComment(req.params.id, {comment: req.body.comment, commentBy: req.user.username}))
    .then(ticket => res.json(ticket))
    .catch( err => {
        var errors = helper.createResponseError(err, 'There was some error trying to add comment to the ticket. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.delete('/deleteComment/:id', (req,res,next) => {
    validator.validateTicketDeleteComment(req)
        .then(() => ticketsBl.canUserDeleteComment(req.query.commentId, req))
        .then(() => ticketsBl.deleteComment(req.params.id,req.query.commentId))
        .then(ticket => res.json(ticket))        
        .catch(err => {
            var errors = helper.createResponseError(err, 'There was some error trying to delete the comment. Please try again after some time.');
            res.json({ errors: errors});
        });
});


router.post('/assign/:id', (req,res,next) => {
    validator.validateTicketAssign(req)
    .then(() => ticketsBl.assignTicket(req.user.username, req.params.id, req.body.assignee, req.body.comment))
    .then(ticket => res.json(ticket))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket assignee. Please try again after some time.');
        res.json({ errors: errors});
    });
});


router.post('/change-status/:id', (req,res,next) => {
    validator.validateTicketChangeStatus(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, req.body.status, req.body.comment))
    .then(ticket => res.json(ticket))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});


router.post('/awaiting-user-response/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, statusEnum.awaitingUserResponse , req.body.comment))
    .then(ticket => res.json(ticket))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.post('/close/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, statusEnum.closed, req.body.comment))
    .then(ticket => res.json(ticket))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});


router.post('/re-open/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, statusEnum.reOpen, req.body.comment))
    .then(ticket => res.json(ticket))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});


router.post('/acknowledge/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username,req.params.id, statusEnum.open, req.body.comment))
    .then(ticket => res.json(ticket))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});


// function getUserFromReq(req){
//     return req.user;
// }

// function createGetTicketResponse(ticket){
//     if(ticket)
//         return { ticket : ticket };
//     else{
//         var errors = helper.createResponseError(null, 'No ticket exists with given ticket id.');
//         return {errors: errors};
//     }
// }

module.exports = router;