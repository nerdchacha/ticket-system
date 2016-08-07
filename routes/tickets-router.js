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
            //validation erros
            res.json({errors: errors});
        });
});

//GET ticket byId
router.get('/getById/:id',function(req,res,next){
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
                ticket = ticket.toObject();
                ticket.currentUser = req.user.username;
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

var isSupportUser = function(req,res){
    if(req.user.role.indexOf(roles.admin) > -1 || req.user.role.indexOf(roles.support) > -1)
        return true;
    else
        return false;
};

module.exports = router;