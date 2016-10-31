var express 	= require('express'),
	router 		= express.Router(),
	usersBl 	= require('../business-layer/users-bl.js'),
	staticBl 	= require('../business-layer/static-bl.js'),
    ticketBl    = require('../business-layer/ticket-bl.js'),
    q           = require('q'),
    statusEnum  = require('../config/enum-config.js').status,
	validator 	= require('../business-layer/request-validator.js');

router.get('/all-users',(req,res) => {
    usersBl.getAllActiveUsers()
    .then(users => res.json({users: users}))
    .catch(err => {
        var errors = helper.createResponseError(err, 'There was some error trying to get the user list. Please try again after some time.');
        res.json({ errors: errors});
    });
});

router.get('/allowed-status/:status',(req,res) => {
	validator.validateGetTicketData(req)
	.then(() => staticBl.getInitialStaticData())
	.then(data => {
        var allowedStatus = data.values
                            .find(value => value.name === 'allowed state')
                            .values
                            .find(value => value.status === req.params.status);
        res.json({status: allowedStatus});
	})
	.catch(err => {
		var errors = helper.createResponseError(err, 'There was some error trying to get list of allowed status. Please try again after some time.');
        res.json({ errors: errors});
	})
});

router.get('/action-buttons/:id',(req,res,next) => {
    validator.validateGetTicketById(req)
    .then(() => {
        return q.all([ 
            staticBl.getInitialStaticData(),
            ticketBl.getTicketByIdAll(req.params.id)
        ]);
    })
    .then(resValues => {
        var statusDetails = resValues[0];
        var ticketDetails = resValues[1];
        var currentStatus = ticketDetails.status;
        var allowedStatus = statusDetails.values
                            .find(value => value.name === 'allowed state')
                            .values
                            .find(value => value.status === currentStatus);
        var actionButtons = {};
        actionButtons.comment = true;
        if(currentStatus === statusEnum.closed){
            actionButtons.reopen = true;
        }
        else{
            if(ticketDetails.assignee){
                if(ticketDetails.assignee === req.user.username)
                    actionButtons.assignToSelf = false;
                if(ticketDetails.createdBy === req.user.username)
                    actionButtons.assignToSelf = false;
            }
            else
                actionButtons.assignToSelf = true;
            actionButtons.changeStatus = true;
            actionButtons.assign = true;
            if(currentStatus === statusEnum.new){
                actionButtons.acknowledge = true;
            }
            if(currentStatus === statusEnum.resolved){
                actionButtons.close = true;
            }
            if(allowedStatus.allowed.indexOf(statusEnum.awaitingUserResponse) > -1){
                actionButtons.awaitingUserResponse = true;
            }
        }
        res.json({actionButtons: actionButtons});
    })
    .catch(err => res.json({errors: err}))
});

module.exports = router;