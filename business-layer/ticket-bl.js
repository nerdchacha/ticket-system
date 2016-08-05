/**
 * Created by dell on 7/18/2016.
 */
var q = require('q'),
    Ticket = require('../models/ticket-model.js');

var ticket = {};

ticket.fetchTickets = function(req,res){
    var sort = req.query.sort || 'id';
    var order = req.query.order || 'asc';
    var page = req.query.page || 1;
    var size = parseInt(req.query.size) || 10;
    if(page === 'undefined') page = 1;
    if(size === 'undefined') size = 10;
    var ret = {};
    var deferred = q.defer();

    Ticket.getAllTickets(function(err,tickets){
        if(err) deferred.reject(err);
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
        deferred.resolve(ret);
    });

    return deferred.promise;
};

ticket.createNewTicket = function(req,res){
    var deferred = q.defer();
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var type = req.body.type;
    var assignee = req.body.assignee;
    var status = 'New';
    var createdBy = req.user.username;
    var createdDate = new Date();
    var newTicket = new Ticket({
        title: title,
        description: description,
        priority: priority,
        type: type,
        assignee: assignee,
        status: status,
        createdBy: createdBy,
        createdDate: createdDate,
        comments:[]
    });
    Ticket.createTicket(newTicket,function(err,ticket){
        if(err) deferred.reject(err);
        deferred.resolve(ticket);
    });

    return deferred.promise;
};

ticket.getTicketById = function(id){
    var deferred = q.defer();
    Ticket.getTicketById(id,function(err, ticket){
    if(err) deferred.reject(err);
    deferred.resolve(ticket);
    });
    return deferred.promise;
};

ticket.addComment = function(id, comment){
    var deferred = q.defer();
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