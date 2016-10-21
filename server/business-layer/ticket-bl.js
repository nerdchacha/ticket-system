/**
 * Created by dell on 7/18/2016.
 */
var q       = require('q'),
    _       = require('underscore'),
    R       = require('ramda'),
    Ticket  = require('../models/ticket-model.js'),
    roles   = require('../config/role-config.js'),
    helper  = require('../business-layer/helper.js');

var ticket = {};

ticket.fetchAllTickets = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);
    var deferred = q.defer();
    var getTicketsForPage = helper.getDataforPage(page, size);
    var sortTickets       = helper.sortData(order, sort);  

    var getAllTickets = R.composeP(
            sortTickets,
            getTicketsForPage,
            Ticket.getAllTickets,
            helper.isSupportUser,
            getUserFromReq
        )(req);

    getAllTickets
        .then(tickets => {
            var response = {};
            response.tickets   = tickets;
            response.page    = page;
            response.count   = tickets.length;
            response.size    = size;

            deferred.resolve(response)
        })
        .catch(error => deferred.reject(error));

    return deferred.promise;
};

ticket.fetchMyTickets = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);
    var deferred = q.defer();
    var getTicketsForPage = helper.getDataforPage(page, size);
    var sortTickets       = helper.sortData(order, sort);  

    var getAllTickets = R.composeP(
            sortTickets,
            getTicketsForPage,
            Ticket.getAllTicketsForUser,
            getUsernameFromReq
        )(req);

    getAllTickets
        .then(tickets => {
            var response        = {};
            response.tickets    = tickets;
            response.page       = page;
            response.count      = tickets.length;
            response.size       = size;

            deferred.resolve(response)
        })
        .catch(error => deferred.reject(error));

    return deferred.promise;
};

ticket.fetchToMeTickets = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);
    var deferred = q.defer();
    var getTicketsForPage = helper.getDataforPage(page, size);
    var sortTickets       = helper.sortData(order, sort);  

    var getAllTickets = R.composeP(
            sortTickets,
            getTicketsForPage,
            Ticket.getAllAssignedToMeTickets,
            getUsernameFromReq
        )(req);

    getAllTickets
        .then(tickets => {
            var response        = {};
            response.tickets    = tickets;
            response.page       = page;
            response.count      = tickets.length;
            response.size       = size;

            deferred.resolve(response)
        })
        .catch(error => deferred.reject(error));

    return deferred.promise;
};

ticket.createNewTicket = function(req,res){
    return Ticket.createTicket(new Ticket(createNewTicketObject(req)));
};

ticket.updateTicket = function(req,res){
    var deferred = q.defer();

    var id = req.body._id;
    var ticketId = req.body.id;
    var newTicket = createUpdateTicketObject(req);
    Ticket.getTicketById(ticketId)
    .then(oldTicket => {
        var comment = createDiffComment(req, oldTicket, newTicket);
        Ticket.updateTicketBySupport(id, newTicket)
        .then(() => Ticket.addComment(ticketId, comment))
        .then(ticket => deferred.resolve(ticket))
        .catch(err => deferred.reject(err));
    })
    .catch(err => deferred.reject(err));

    return deferred.promise;
};

ticket.getTicketByIdAll = function(id){
    return Ticket.getTicketById(id);
};

ticket.getTicketById = function(id, user){
    var deferred = q.defer();

    Ticket.getTicketById(id)
        .then(ticket => {
            var isSupportUser = isSupport(user);    
            if(isSupportUser || ticket.createdBy === user.username)
                deferred.resolve(ticket)
            else
                deferred.reject(403)
        })
        .catch(error => deferred.reject(error));

    return deferred.promise;
};

ticket.addComment = function(id, comment){
    var deferred = q.defer();
    comment.isDeletable = true;
    comment.commentMessage = {title: 'Comment', message: [comment.comment]};
    return Ticket.addComment(
        id,
        comment
    );
};

ticket.deleteComment = function(id, commentId){
    return Ticket.deleteComment(
        id, 
        commentId
    );
};

ticket.assignTicket = function(username ,id, newAssignee, userComment){
    return R.composeP(
        changeAssigneeCurried(id, newAssignee),
        createAssignTicketComment(username, newAssignee, userComment),
        Ticket.getTicketById
    )(id);
};

ticket.changeStatus = function(username ,id, newStatus, userComment){
    return R.composeP(
        changeStatusCurried(id, newStatus),
        createChangeStatusComment(username, newStatus, userComment),
        Ticket.getTicketById
    )(id);
};

ticket.canUserDeleteComment = function(commentId, req){
    var deferred = q.defer();
    Ticket.getTicketByCommentId(commentId)
        .then(ticket => {
            var comment = ticket.comments.find(comment => comment._id.toString() === commentId);
            if(comment.commentBy !== req.user.username) 
                deferred.reject('User cannot delete comments of other users');
            else
                deferred.resolve();
        })
        .catch(error => deferred.reject(error));
    return deferred.promise;
};










/*--------------------------------------------------------------------------
--------------------------------FUNCTIONS-----------------------------------
--------------------------------------------------------------------------*/



function getUserFromReq(req){
    var deferred = q.defer()
    deferred.resolve(req.user);
    return deferred.promise;
}

function getUsernameFromReq(req){
    var deferred = q.defer()
    deferred.resolve(req.user.username);
    return deferred.promise;
}

function createNewTicketObject(req){
    return{
        title : req.body.title,
        description : req.body.description,
        type : req.body.type,
        status : 'New',
        createdBy : req.user.username,
        createdDate : Date.now(),
        lastUpdatedDate : Date.now(),
        comments: []
    }
}

function canUserViewTicket(user){
    return function(ticket){
        return isSupport(user) || ticket.createdBy === user.username;
    }
}

function isSupport(user){
    return user.role.indexOf(roles.admin) > -1 || user.role.indexOf(roles.support) > -1;
}

function createCommentBoiler(username){
    return {
        commentDate     : Date.now(),
        commentBy       : username,
        isDeletable     : false,
        commentMessage  : {
            title : "Changes"
        }
    }
}

function createChangeStatusComment(username, newStatus, userComment){
    return function(ticket){
        var comment = createCommentBoiler(username);
        comment.commentMessage.message = ['Status changed from "' + ticket.status + '" to "' + newStatus + '"', 'Comment : "' + userComment + '"'];
        return comment;
    }
}

function createAssignTicketComment(username, newAssignee, userComment){
    return function(ticket){
        var comment = createCommentBoiler(username);
        comment.commentMessage.message = ['Assignee changed from "' + ticket.assignee + '" to "' + newAssignee + '"', 'Comment : "' + userComment + '"'];
        return comment;
    }
}

function changeAssigneeCurried(id, newAssignee){
    return function(comment){
        return Ticket.assignTicket(id, newAssignee, comment);
    }
}

function changeStatusCurried(id, newStatus){
    return function(comment){
        return Ticket.changeStatus(id, newStatus, comment);
    }
}

function createUpdateTicketObject(req){
    return{
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        type: req.body.type,
        assignee: req.body.assignee,
        status: req.body.status,
        lastUpdatedDate: Date.now()
    }
}

function createDiffComment(req, oldTicket, newTicket){
    var comment = {
        commentDate: Date.now(),
        commentBy: req.user.username,
        isDeletable: false,
        commentMessage : {
            title: "Changes",
            message: []
        },
    };

    for(var prop in newTicket){
        if(oldTicket[prop] != newTicket[prop] && !(oldTicket[prop] instanceof Date)){
            var oldPropVal = !oldTicket[prop] || typeof oldTicket[prop] === 'undefined'|| oldTicket[prop] === '' ? 'none' : oldTicket[prop];
            var newPropVal = newTicket[prop];
            comment.commentMessage.message.push(prop + ': changed from "' + oldPropVal + '" to "' + newPropVal + '"');
        }
    }

    return comment;
}

module.exports = ticket;