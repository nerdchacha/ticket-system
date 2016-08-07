/**
 * Created by dell on 7/18/2016.
 */
var q = require('q');
var Ticket = require('../models/ticket-model.js');
var roles = require('../config/role-config.js');

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
    //Current user is admin or support user
    if(req.user.role.indexOf(roles.admin) > -1 || req.user.role.indexOf(roles.support) > -1) {
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
    //Current user is admin or support user
    if(req.user.role.indexOf(roles.admin) > -1 || req.user.role.indexOf(roles.support) > -1) {
        var sort = req.query.sort || 'id';
        var order = req.query.order || 'asc';
        var page = req.query.page || 1;
        var size = parseInt(req.query.size) || 10;
        if (page === 'undefined') page = 1;
        if (size === 'undefined') size = 10;

        Ticket.getAllAssignedToMeTickets(req.user.username, function (err, tickets) {
            console.log(tickets);
            if (err) deferred.reject(err);
            var ret = sortLogic(tickets, order, sort, size, page);
            deferred.resolve(ret);
        });
    }
    else{
        deferred.reject(403);
    };

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
    var newTicket = new Ticket({
        title: title,
        description: description,
        /*priority: priority,*/
        type: type,
        /*assignee: assignee,*/
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

ticket.getTicketById = function(id, user){
    var deferred = q.defer();
    Ticket.getTicketById(id,function(err, ticket){
        //If normal user is trying to access tickets created by other users
            if(user.role.indexOf(roles.admin) > -1 || user.role.indexOf(roles.support) > -1 || ticket.createdBy === user.username){
                //User is either admin or support or logged in user is also creator
                if(err) deferred.reject(err);
                deferred.resolve(ticket);
            }
        else
            //reject with 403
            deferred.reject(403);
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