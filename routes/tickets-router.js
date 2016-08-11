/**
 * Created by dell on 7/18/2016.
 */
var express = require('express');
var router = express.Router();
var ticketsBl = require('../business-layer/ticket-bl.js');
var staticBl = require('../business-layer/static-bl.js');
var usersBl = require('../business-layer/users-bl.js');
var q = require('q');
var validator = require('../business-layer/request-validator.js');
var roles = require('../config/role-config');

router.get('/static-data',function(req,res,next){
    q.all([
        staticBl.getInitialStaticData(),
        usersBl.getAllActiveUsers()])
        .then(function(values) {
            var priorities = values[0].values.find(function (value) {
                return value.name === 'priority'
            });
            var types = values[0].values.find(function (value) {
                return value.name === 'type'
            });
            var status = values[0].values.find(function (value) {
                return value.name === 'status'
            });
            var users = values[1];
            res.json({priorities: priorities,types: types,statuses:status, users: users});
        });
});

router.get('/edit-ticket/initial-load/:status',function(req,res,next){
    //Check if request is valid
    validator.validateGetTicketData(req,res)
        .then(function(){
            return q.all([
                staticBl.getInitialStaticData(),
                usersBl.getAllActiveUsers()]);
        })
        .then(function(values) {
            //request is valid
            var currentStatus = req.params.status;
            var priorities = values[0].values.find(function (value) {
                return value.name === 'priority'
            });
            var allowedStatusList = values[0].values.find(function (value) {
                return value.name === 'allowed state';
            });
            var allowedStatus = allowedStatusList.values.find(function(value){
                return value.status === currentStatus;
            });
            allowedStatus.allowed.push(currentStatus);
            var types = values[0].values.find(function (value) {
                return value.name === 'type'
            });
            var users = values[1];
            res.json({priorities: priorities,types: types,statuses: allowedStatus.allowed , users: users});
        })
        .catch(function(err){
            console.log('send error');
            //invalid request
            res.json({errors: err});
        });
});

//GET all tickets
router.get('/all',function(req,res,next){
    ticketsBl.fetchAllTickets(req,res)
        .then(function(ticketDetails){
            res.json(ticketDetails);
        })
        .catch(function(err){
            if(err === 403){
                res.status(403);
                res.end();
            }
            else{
                res.json({errors: [{error: msg}]});
            }

        });
});

router.get('/my',function(req,res,next){
    ticketsBl.fetchMyTickets(req,res)
        .then(function(ticketDetails){
            res.json(ticketDetails);
        });
});

router.get('/to-me',function(req,res,next){
    //Check if current logged in user has rights to view 'Assigned to me' tickets
    ticketsBl.fetchToMeTickets(req,res)
        .then(function(ticketDetails){
            res.json(ticketDetails);
        })
        .catch(function(err){
            if(err === 403){
                res.status(403);
                res.end();
            }
            else{
                res.json({errors: [{error: msg}]});
            }

        });
});

//POST new ticket
router.post('/new',function(req,res,next){
    //Check if http request has mandatory parameters
    validator.validateNewTicket(req,res)
        .then(function(){
            //No validation erros
            return ticketsBl.createNewTicket(req,res)
        })
        .then(function(ticket){
            //Create new ticket and send ticket data to client
            res.json(ticket);
        },
        //Error while creating ticket
        function(err){
            res.json({errors: [{msg:err}] });
        })
        .catch(function(errors){
            //validation errors
            res.json({errors: errors});
        });
});

router.put('/:id',function(req,res,next){
    //Check if request has mandatory parameters
    validator.validateUpdateTicket(req,res)
        .then(function(){
            //Request is valid
            return ticketsBl.updateTicket(req,res);
        })
        .then(function(ticket){
            res.json(ticket)
        }
        //Error while creating ticket
        ,function(err){
            res.json({errors: [{msg:err}] });
        })
        .catch(function(err){
            //validation errors
            res.json({errors: err});
        });
});

//GET ticket byId
router.get('/:id',function(req,res,next){
    //Check if request has mandatory parameters
    validator.validateGetTicketById(req,res)
        .then(function(){
            //No validation errors
            return ticketsBl.getTicketById(req.params.id, req.user)
        })
        .then(function(ticket){
            if(!ticket) {
                res.json({errors: [{msg : 'No ticket exists with given ticket id.'}]});
            }
            else {
                res.json(ticket);
            }
        },
        //Error getting ticket
        function(err){
            if(err === 403){
                res.status(403);
                res.end();
            }
            else
                res.json({errors: [{msg: err}]});
        })
        .catch(function(errors){
            //Validation errors
            res.json({errors: errors});
        });
});

//POST comment on a ticket
router.post('/addComment/:id',function(req,res,next){
    //Check if http request has mandatory parameters
    validator.validateTicketAddComment(req,res)
        .then(function(){
            //No validation errors
            //Add comment
            return ticketsBl.addComment(req.params.id, {comment: req.body.comment, commentBy: req.user.username})
        })
        .then(function(ticket){
            //Comment added successfully
            res.json(ticket);
        },
        function(error){
            //Error adding comment
            res.json({errors: error});
        })
        .catch(function(errors){
            //Validation errors
            res.json({errors: errors});
        });
});

//DELETE comment
router.delete('/deleteComment/:id', function(req,res,next){
    //Check if http request has mandatory parameters
    validator.validateTicketDeleteComment(req,res)
        .then(function(){
            //No validation errors
            //Check if comment was added by same user
            var commentId = req.query.commentId;
            return validator.canUserDeleteComment(req,res,commentId)
        })
        .then(function(response){
            //user cannot delete comment
            if(!response.canDelete)
                res.json({errors: [{msg : response.error}]});
            //user can delete comment
            var ticketId = req.params.id;
            var commentId = req.query.commentId;
            return ticketsBl.deleteComment(ticketId,commentId)
        })
        .then(function(ticket){
            //Comment deleted successfully
            res.json(ticket);
        },
            function(error){
                //Error deleting comment
            res.json({errors: error});
        })
        .catch(function(errors){
            //Validation error
            res.json({errors: errors});
        });
});

module.exports = router;