var express     = require('express'),
    router      = express.Router(),
    ticketsBl   = require('../../business-layer/ticket-bl.js'),
    statusEnum  = require('../../config/enum-config.js').status,
    rolesEnum   = require('../../config/enum-config.js').roles,
    validator   = require('../../business-layer/request-validator.js'),
    log                     = require('../../config/log4js-config.js'),
    helper      = require('../../business-layer/helper.js');

router.post('/assign/:id', (req,res,next) => {
    validator.validateTicketAssign(req)
    .then(() => ticketsBl.assignTicket(req.user.username, req.params.id, req.body.assignee, req.body.comment, req.body.notify))
    .then(ticket => res.json(ticket))
    .catch(err => {
        log.error('Error in ADMIN-TICKETS-ROUTER - POST /assign/:id endpoint -', err);
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket assignee. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.post('/change-status/:id', (req,res,next) => {
    validator.validateTicketChangeStatus(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, req.body.status, req.body.comment, req.body.notify))
    .then(ticket => res.json(ticket))
    .catch(err => {
        log.error('Error in ADMIN-TICKETS-ROUTER - POST /change-status/:id endpoint -', err);
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.post('/awaiting-user-response/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, statusEnum.awaitingUserResponse , req.body.comment, req.body.notify))
    .then(ticket => res.json(ticket))
    .catch(err => {
        log.error('Error in ADMIN-TICKETS-ROUTER - POST /awaiting-user-response/:id endpoint -', err);
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.post('/close/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, statusEnum.closed, req.body.comment, req.body.notify))
    .then(ticket => res.json(ticket))
    .catch(err => {
        log.error('Error in ADMIN-TICKETS-ROUTER - POST /close/:id endpoint -', err);
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.post('/re-open/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username, req.params.id, statusEnum.reOpen, req.body.comment, req.body.notify))
    .then(ticket => res.json(ticket))
    .catch(err => {
        log.error('Error in ADMIN-TICKETS-ROUTER - POST /re-open/:id endpoint -', err);
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.post('/acknowledge/:id', (req,res,next) => {
    validator.validateTicketAddComment(req)
    .then(() => ticketsBl.changeStatus(req.user.username,req.params.id, statusEnum.open, req.body.comment, req.body.notify))
    .then(ticket => res.json(ticket))
    .catch(err => {
        log.error('Error in ADMIN-TICKETS-ROUTER - POST /acknowledge/:id endpoint -', err);
        var errors = helper.createResponseError(err, 'There was some error trying to change the ticket status. Please try again after some time.');
        res.json({ errors: errors});
    });
});

module.exports = router;