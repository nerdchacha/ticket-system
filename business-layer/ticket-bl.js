/**
 * Created by dell on 7/18/2016.
 */
var q = require('q');
var Ticket = require('../models/ticket-model.js');
var roles = require('../config/role-config.js');
var helper = require('../business-layer/helper.js');

var ticket = {};

var sortLogic = function(tickets,order,sort,size,page){
    var ret = {};
    tickets.sort(function(a,b){
        if(order === 'asc'){
            if(a[sort] < b[sort])
                return -1;
            else if(a[sort] > b[sort])
                return 1;
            return 0;
        }
        else{
            if(a[sort] > b[sort])
                return -1;
            else if(a[sort] < b[sort])
                return 1;
            return 0;
        }
    });
    ret.tickets = tickets.slice((page - 1) * size, ((page - 1) * size) + size);
    ret.page = parseInt(page);
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
                var sort = req.query.sort || 'id';
                var order = req.query.order || 'asc';
                var page = req.query.page || 1;
                var size = parseInt(req.query.size) || 10;
                if(page === 'undefined') page = 1;
                if(size === 'undefined') size = 10;

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
            console.log('old ticket found');
            console.log(oldTicket);
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
                comment.comment = {};
                comment.comment.title = "Changes";
                comment.comment.text = [];
                for(var i= 0; i<oldDetails.length; i++){
                    if(oldDetails[i] !== newDetails[i])
                        comment.comment.text.push(propertyNames[i] + ': "' + oldDetails[i] + '" changed to "' + newDetails[i] + '"');
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
    comment.comment = {title: '', text: [comment.comment]};
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

module.exports = ticket;