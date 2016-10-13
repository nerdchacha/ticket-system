/**
 * Created by dell on 7/18/2016.
 */
var q       = require('q'),
    _       = require('underscore'),
    Ticket  = require('../models/ticket-model.js'),
    helper  = require('../business-layer/helper.js');

var ticket = {};

var sortLogic = function(tickets,order,sort,size,page){
    var ret = {};
    var sort = helper.sortByKey(sort, order, 'asc');
    var getPerPage = helper.itemsPerPage(page, size);
    ret.tickets = _.compose(getPerPage, sort)(tickets);
    ret.page = helper.intify(page);
    ret.count = tickets.length;
    ret.size = size;
    return ret;
};

ticket.fetchAllTickets = function(req,res){
    var deferred = q.defer();

    //check if current logged in user is regular user
    helper.isRegularUser(req.user)
        .then(function(isRegularUser){
            //Current user is admin or support user
            if(!isRegularUser){
                var sort = helper.isOrDefault(req.query.sort,'id');
                var order = helper.isOrDefault(req.query.order,'asc');
                var page = helper.isOrDefault(helper.intify(req.query.page), 1);
                var size = helper.isOrDefault(helper.intify(req.query.size), 10);
                // if(page === 'undefined') page = 1;
                // if(size === 'undefined') size = 10;

                Ticket.getAllTickets(function(err,tickets){
                    if(err) deferred.reject(err);
                    var ret = sortLogic(tickets,order,sort,size,page);
                    deferred.resolve(ret);
                });
            }
            else{
                deferred.reject(403);
            }
        });

    return deferred.promise;
};

ticket.fetchMyTickets = function(req,res){
    var sort = req.query.sort || 'id';
    var order = req.query.order || 'asc';
    var page = req.query.page || 1;
    var size = parseInt(req.query.size) || 10;
    if(page === 'undefined') page = 1;
    if(size === 'undefined') size = 10;
    var deferred = q.defer();

    Ticket.getAllTicketsForUser(req.user.username,function(err,tickets){
        if(err) deferred.reject(err);
        var ret = sortLogic(tickets,order,sort,size,page);
        deferred.resolve(ret);
    });

    return deferred.promise;
};

ticket.fetchToMeTickets = function(req,res){
    var deferred = q.defer();
    //Check is currently logged in user is regular user or not
    helper.isRegularUser(req.user)
        .then(function(isRegularUser){
            //Current user is admin or support user
            if(!isRegularUser){
                var sort = req.query.sort || 'id';
                var order = req.query.order || 'asc';
                var page = req.query.page || 1;
                var size = parseInt(req.query.size) || 10;
                if (page === 'undefined') page = 1;
                if (size === 'undefined') size = 10;

                Ticket.getAllAssignedToMeTickets(req.user.username, function (err, tickets) {
                    if (err) deferred.reject(err);
                    var ret = sortLogic(tickets, order, sort, size, page);
                    deferred.resolve(ret);
                });
            }
            else{
                deferred.reject(403);
            }
        });
    return deferred.promise;
};

ticket.createNewTicket = function(req,res){
    var deferred = q.defer();
    var title = req.body.title;
    var description = req.body.description;
    /*var priority = req.body.priority;*/
    var type = req.body.type;
    /*var assignee = req.body.assignee;*/
    var status = 'New';
    var createdBy = req.user.username;
    var createdDate = new Date();
    var lastUpdatedDate = Date.now();
    var newTicket = new Ticket({
        title: title,
        description: description,
        /*priority: priority,*/
        type: type,
        /*assignee: assignee,*/
        status: status,
        createdBy: createdBy,
        createdDate: createdDate,
        lastUpdatedDate : lastUpdatedDate,
        comments:[]
    });
    Ticket.createTicket(newTicket,function(err,ticket){
        if(err) deferred.reject(err);
        deferred.resolve(ticket);
    });

    return deferred.promise;
};

ticket.updateTicket = function(req,res){
    var deferred = q.defer();

    var id = req.body._id;
    var ticketId = req.body.id;
    var newDetails = [];
    var title = req.body.title;
    newDetails.push(title);
    var description = req.body.description;
    newDetails.push(description);
    var priority = req.body.priority;
    newDetails.push(priority);
    var type = req.body.type;
    newDetails.push(type);
    var assignee = req.body.assignee;
    newDetails.push(assignee);
    var status = req.body.status;
    newDetails.push(status);
    var lastUpdatedDate = Date.now();

    var newTicket = {title: title, description: description, priority: priority, type: type, assignee: assignee, status: status, lastUpdatedDate : lastUpdatedDate};

    Ticket.getTicketById(ticketId,function(err, oldTicket){
        if(err) deferred.reject(err);
        else{
            Ticket.updateTicketBySupport(id, newTicket, function(err, updatedTicket){
                if(err) deferred.reject(err);
                var propertyNames = ['Title', 'Description', 'Priority', 'Type', 'Assignee' , 'Status']
                var oldDetails = [];
                var oldTitle = oldTicket.title;
                oldDetails.push(oldTitle);
                var oldDescription = oldTicket.description;
                oldDetails.push(oldDescription);
                var oldPriority = oldTicket.priority;
                oldDetails.push(oldPriority);
                var oldType = oldTicket.type;
                oldDetails.push(oldType);
                var oldAssignee = oldTicket.assignee;
                oldDetails.push(oldAssignee);
                var oldStatus = oldTicket.status;
                oldDetails.push(oldStatus);

                var comment = {};
                comment.commentDate = Date.now();
                comment.commentBy = req.user.username;
                comment.commentMessage = {};
                comment.commentMessage.title = "Changes";
                comment.commentMessage.message = [];
                comment.isDeletable = false;
                for(var i= 0; i<oldDetails.length; i++){
                    if(oldDetails[i] !== newDetails[i]){
                        var oldPropVal = !oldDetails[i] || typeof oldDetails[i] === 'undefined'|| oldDetails[i] === '' ? 'none' : oldDetails[i];
                        var newPropVal = newDetails[i];
                        comment.commentMessage.message.push(propertyNames[i] + ': changed from "' + oldPropVal + '" to "' + newPropVal + '"');
                    }
                }

                Ticket.addComment(ticketId, comment, function(err, ticket){
                    if(err) deferred.reject(err);
                    else deferred.resolve(ticket);
                });
            });
        }
    });

    return deferred.promise;
};

ticket.getTicketByIdAll = function(id){
    var deferred = q.defer();
    Ticket.getTicketById(id,function(err, ticket){
      if(err) deferred.reject(err);
      deferred.resolve(ticket);
    });
    return deferred.promise;
};

ticket.getTicketById = function(id, user){
    var deferred = q.defer();
    Ticket.getTicketById(id,function(err, ticket){
        //If normal user is trying to access tickets created by other users
        helper.isRegularUser(user)
            .then(function(isRegularUser){
              if(!isRegularUser || ticket.createdBy === user.username){
                  if(err) deferred.reject(err);
                  deferred.resolve(ticket);
              }
                else{
                  //reject with 403
                  deferred.reject(403);
              }
            });
    });
    return deferred.promise;
};

ticket.addComment = function(id, comment){
    var deferred = q.defer();
    comment.isDeletable = true;
    comment.commentMessage = {title: 'Comment', message: [comment.comment]};
    Ticket.addComment(id,comment, function(err, ticket){
        if(err) deferred.reject(err);
        deferred.resolve(ticket);
    });
    return deferred.promise;
};

ticket.deleteComment = function(id, commentId){
    var deferred = q.defer();
    Ticket.deleteComment(id, commentId, function(err, ticket){
        if(err) deferred.reject(err);
        deferred.resolve(ticket);
    });
    return deferred.promise;
};

ticket.assignTicket = function(username ,id, newAssignee, userComment){
    var deferred = q.defer();
    Ticket.getTicketById(id, function(err, oldTicket){
        if(err) deferred.reject(err);
        var oldAssignee = oldTicket.assignee;
        var comment = {};
        comment.commentDate = Date.now();
        comment.commentBy = username;
        comment.commentMessage = {};
        comment.commentMessage.title = "Changes";
        comment.commentMessage.message = ['Assignee changed from "' + oldAssignee + '" to "' + newAssignee + '"', 'Comment : "' + userComment + '"'];
        comment.isDeletable = false;       
        Ticket.assignTicket(id, newAssignee, comment, function(err, newTicket){
            if(err) promise.reject(err);
            deferred.resolve(newTicket);
        });
    });
    return deferred.promise;
};

ticket.changeStatus = function(username ,id, newStatus, userComment){
    var deferred = q.defer();
    Ticket.getTicketById(id, function(err, oldTicket){
        if(err) deferred.reject(err);
        var oldStatus = oldTicket.status;
        var comment = {};
        comment.commentDate = Date.now();
        comment.commentBy = username;
        comment.commentMessage = {};
        comment.commentMessage.title = "Changes";
        comment.commentMessage.message = ['Status changed from "' + oldStatus + '" to "' + newStatus + '"', 'Comment : "' + userComment + '"'];
        comment.isDeletable = false;       
        Ticket.changeStatus(id, newStatus, comment, function(err, newTicket){
            if(err) promise.reject(err);
            deferred.resolve(newTicket);
        });
    });
    
    return deferred.promise;
};

ticket.canUserDeleteComment = function(req,res,commentId){
    var deferred = q.defer();
    Ticket.getTicketByCommentId(commentId, function(err, ticket){
        if (err) deferred.reject({error: err});
        var comment = ticket.comments.find(function (comment) {return comment._id.toString() === commentId;});
        if(comment.commentBy !== req.user.username) deferred.reject({error: 'User cannot delete comments of other users'});
        
        deferred.resolve();
    });
    return deferred.promise;
};


module.exports = ticket;