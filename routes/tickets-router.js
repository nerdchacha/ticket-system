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

router.get('/',function(req,res,next){
    res.render('tickets/index.ejs');
});

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
            var users = values[1];
            res.json({priorities: priorities,types: types,users: users});
        });
});

//GET all tickets
router.get('/get',function(req,res,next){
    ticketsBl.fetchTickets(req,res)
        .then(function(ticketDetails){
             res.json(ticketDetails);
         });
});

//POST new ticket
router.post('/new',function(req,res,next){
    var errors  = validator.validateNewTicket(req,res);
    if(errors) {
        res.json({errors: errors});
    }
    else{
        ticketsBl.createNewTicket(req,res)
            .then(function(ticket){
                res.json(ticket);
        });
    }
});

//GET ticket byId
router.get('/getById/:id',function(req,res,next){
    var errors = validator.validateGetTicketById(req,res);
    if(errors){
        res.json({errors: errors});
    }
    else{
        ticketsBl.getTicketById(req.params.id)
            .then(function(ticket){
                if(!ticket) {
                    res.json({errors: [{msg : 'No ticket exists with given ticket id.'}]});
                }
                else {
                    ticket = ticket.toObject();
                    ticket.currentUser = req.user.username;
                    res.json(ticket);
                }
            });
    }
});

//POST comment on a ticket
router.post('/addComment/:id',function(req,res,next){
    var errors = validator.validateTicketAddComment(req,res);
    if(errors){
        res.json({errors: errors});
    }
    else{
        ticketsBl.addComment(req.params.id, {comment: req.body.comment, commentBy: req.user.username})
            .then(function(ticket){
                res.json(ticket);
            })
            .catch(function(error){
                res.json({errors: error});
            });
    }
});

//DELETE comment
router.delete('/deleteComment/:id', function(req,res,next){
    var ticketId = req.params.id;
    var commentId = req.query.commentId;
    var errors = validator.validateTicketDeleteComment(req,res);
    if(errors){
        res.json({errors: errors});
    }
    else{
        validator.canUserDeleteComment(req,res,commentId)
            .then(function(response){
                //user cannot delete comment
                if(!response.flag)
                    throw new Error(response.error);
                //user can delete comment
                return ticketsBl.deleteComment(ticketId,commentId)
            })
            .then(function(ticket){
                res.json(ticket);
            })
            .catch(function(error){
                res.json({errors: error});
            });
    }
});

module.exports = router;