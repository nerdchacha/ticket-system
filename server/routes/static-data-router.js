var express 	= require('express'),
	router 		= express.Router(),
	usersBl 	= require('../business-layer/users-bl.js'),
	staticBl 	= require('../business-layer/static-bl.js'),
    ticketBl    = require('../business-layer/ticket-bl.js'),
    q           = require('q'),
	validator 	= require('../business-layer/request-validator.js');

router.get('/all-users',function(req,res){
    usersBl.getAllActiveUsers()
    .then(function(users){
        res.json({error: null, users: users});
    })
    .catch(function(err){
        res.json({errpr: err, users: null})
    });
});

router.get('/allowed-status/:status',function(req,res){
	validator.validateGetTicketData(req,res)
	.then(function(){
		return staticBl.getInitialStaticData();
	})
	.then(function(data){
		var currentStatus = req.params.status;
        var allowedStatusList = data.values.find(function (value) {
            return value.name === 'allowed state';
        });
        var allowedStatus = allowedStatusList.values.find(function(value){
            return value.status === currentStatus;
        });
        res.json({error: null, status: allowedStatus});
	})
	.catch(function(err){
		res.json({errpr: err, status: null});
	})
});

router.get('/action-buttons/:id',function(req,res,next){
    validator.validateGetTicketById(req,res)
    .then(function(){
        return q.all([ 
        staticBl.getInitialStaticData(),
        ticketBl.getTicketByIdAll(req.params.id)
        ])
    })
    .then(function(resValues){
        var statusDetails = resValues[0];
        var ticketDetails = resValues[1];
        var currentStatus = ticketDetails.status;
        var allowedStatusList = statusDetails.values.find(function (value) {
            return value.name === 'allowed state';
        });
        var allowedStatus = allowedStatusList.values.find(function(value){
            return value.status === currentStatus;
        });
        var actionButtons = {};
        actionButtons.comment = true;
        if(currentStatus === 'Closed'){
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
            if(currentStatus === 'New'){
                actionButtons.acknowledge = true;
            }
            if(currentStatus === 'Resolved'){
                actionButtons.close = true;
            }
            if(allowedStatus.allowed.indexOf('Awaiting User Response') > -1){
                actionButtons.awaitingUserResponse = true;
            }
        }
        res.json({errors: null, actionButtons: actionButtons});
    })
    .catch(function(err){
        console.log(err);
        res.json({errors: err, actionButtons: null});
    })
});

module.exports = router;