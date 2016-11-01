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
    rolesEnum   = require('../config/enum-config.js').roles,
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
    validator.validateGetTicketById(req)
    .then(() => ticketsBl.getTicketById(req.params.id, req.user))
    .then(ticket => filterComments(ticket, req.user))
    .then(ticket => res.json({ticket : ticket}))
    .catch(err => {
        var errors = helper.createResponseError(err, 'No ticket exists with given ticket id.');
        res.json({errors: errors});
    });
});

router.post('/addComment/:id',(req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.addComment(req.params.id, {comment: req.body.comment, commentBy: req.user.username}, req.body.notify))
    .then(ticket => filterComments(ticket, req.user))
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


function filterComments(ticket, user){
    if(user.role.indexOf(rolesEnum.admin) > -1 || user.role.indexOf(rolesEnum.support) > -1)
        return ticket;
    else{
        ticket.comments = ticket.comments.filter(comment => comment.isVisible === true);
        return ticket;
    }
}

module.exports = router;