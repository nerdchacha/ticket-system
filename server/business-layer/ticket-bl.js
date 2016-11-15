/**
 * Created by dell on 7/18/2016.
 */
var q               = require('q'),
    _               = require('underscore'),
    R               = require('ramda'),
    Ticket          = require('../models/ticket-model'),
    Comment         = require('../models/comment-model')
    rolesEnum       = require('../config/enum-config').roles,
    statusEnum      = require('../config/enum-config').status,
    priorityEnum    = require('../config/enum-config').priority,
    typeEnum        = require('../config/enum-config').type,
    log             = require('../config/log4js-config'),
    commentBl       = require('./comment-bl'),
    helper          = require('../business-layer/helper');

var ticket = {};

ticket.fetchAllTickets = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);

    var skip = (page - 1) * size;
    var limit = size;
    var sortString = helper.createSortString(sort, order);

    return q.all([
        Ticket.getAllTicketsPagination(skip, limit,sortString),
        Ticket.getAllTicketsCount()
        ])    
        .then(values => {
            var tickets = values[0];
            var count = values[1];
            var response = {};
            response.tickets   = tickets;
            response.page    = page;
            response.count   = count;
            response.size    = size;
            return response;
        })
};

ticket.fetchMyTickets = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);

    var skip = (page - 1) * size;
    var limit = size;
    var sortString = helper.createSortString(sort, order);

    return q.all([
        Ticket.getTicketsForUserPagination(req.user.username, skip, limit,sortString),
        Ticket.getAllTicketsForUserCount(req.user.username)
        ])
        .then(values => {
            var tickets = values[0];
            var count = values[1];
            var response        = {};
            response.tickets    = tickets;
            response.page       = page;
            response.count      = count;
            response.size       = size;
            return response
        })

    return deferred.promise;
};

ticket.fetchToMeTickets = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);

    var skip = (page - 1) * size;   
    var limit = size;
    var sortString = helper.createSortString(sort, order);

    return q.all([
        Ticket.getTicketsAssignedToMePagination(req.user.username, skip, limit,sortString),
        Ticket.getAllAssignedToMeTicketsCount(req.user.username)
        ])
        .then(values => {
            var tickets = values[0];
            var count = values[1];
            var response        = {};
            response.tickets    = tickets;
            response.page       = page;
            response.count      = count;
            response.size       = size;
            return response
        })

    return deferred.promise;
};

ticket.getTicketsByStatus = (req,res) => filterDashboardTicket(req, {status: req.params.status});

ticket.getTicketsByType = (req,res) => filterDashboardTicket(req, {type: req.params.type});

ticket.getTicketsByPriority = (req,res) => filterDashboardTicket(req, {priority: req.params.priority});

ticket.createNewTicket = (req,res) => Ticket.createTicket(new Ticket(createNewTicketObject(req)));

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
    .catch(err => {
        log.error('Error in TICKET-BL at updateTicket -', error);
        log.debug('Http request body -', req.body);
        deferred.reject(err)}
        );

    return deferred.promise;
};

ticket.getTicketByIdAll = id => Ticket.getTicketById(id);

ticket.getTicketById = function(id, user){
    return Ticket.getTicketById(id)
    .then(ticket => {
        if(isSupport(user))
            return ticket    
        if(userCreatedTicket(ticket, user))
            return ticket
        throw new Error('User doesn\'t have access to view the ticket');
    })
    .then(commentBl.getTicketWithComments)
};

ticket.addComment = (id, comment, notify) => {
    comment.isDeletable = true;
    comment.isVisible = false;
    comment.commentMessage = {title: 'Comment', message: [comment.comment]};

    return Ticket.getTicketById(id)
    .then(ticket => commentBl.addComment(ticket, comment))
    .then(ticket => {
        if(notify.map(item => item.id).indexOf(ticket.createdBy) > -1)
            comment.isVisible = true;
        if(userCreatedComment(comment, ticket))
            comment.isVisible = true;
        return ticket;
    })
    .then(ticket => ticket)
};

ticket.deleteComment = (id, _commentId) => {
    return Ticket.getTicketById(id)
    .then(ticket => commentBl.deleteComment(ticket, _commentId))
    .then(ticket => ticket)
};

// ticket.assignTicket = function(username ,id, newAssignee, userComment, notify){
//     return R.composeP(
//         R.curry(Ticket.assignTicket)(id, newAssignee),
//         createAssignTicketComment(username, newAssignee, userComment, notify),
//         Ticket.getTicketById
//     )(id);
// };

ticket.assignTicket = (username ,id, newAssignee, userComment, notify) => {
    return Ticket.getTicketById(id)
    .then(ticket => {
        var comment = createAssignTicketComment(username, newAssignee, userComment, notify)(ticket)
        comment.ticketId = mongoose.Types.ObjectId(ticket._id);
        return Comment.addComment(new Comment(comment))
    })
    .then(comment => Ticket.assignTicket(id, newAssignee))
    .then(commentBl.getTicketWithComments)
};

ticket.changeStatus = (username ,id, newStatus, userComment, notify) => {
    return Ticket.getTicketById(id)
    .then(ticket => {
        var comment = createChangeStatusComment(username, newStatus, userComment, notify)(ticket)
        comment.ticketId = mongoose.Types.ObjectId(ticket._id);
        return Comment.addComment(new Comment(comment))
    })
    .then(comment => Ticket.changeStatus(id, newStatus))
    .then(commentBl.getTicketWithComments)
};


// ticket.changeStatus = function(username ,id, newStatus, userComment, notify){
//     return R.composeP(
//         R.curry(Ticket.changeStatus)(id, newStatus),
//         createChangeStatusComment(username, newStatus, userComment, notify),
//         Ticket.getTicketById
//     )(id);
// };

// ticket.canUserDeleteComment = function(commentId, req){
//     var deferred = q.defer();
//     Ticket.getTicketByCommentId(commentId)
//         .then(ticket => {
//             var comment = ticket.comments.find(comment => comment._id.toString() === commentId);
//             if(comment.commentBy !== req.user.username) 
//                 deferred.reject('User cannot delete comments of other users');
//             else
//                 deferred.resolve();
//         })
//         .catch(error => {
//             log.error('Error in TICKET-BL at canUserDeleteComment -', error);
//             deferred.reject(error)
//         });
//     return deferred.promise;
// };

ticket.openWithin24Hours = (req,res) => {
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);

    var skip = (page - 1) * size;   
    var limit = size;
    var sortString = helper.createSortString(sort, order);

    return q.all([
        Ticket.getOpenWithin24HoursTicketsPagination(skip, limit, sortString),
        Ticket.getOpenWithin24HoursTicketsCount()
        ])
        .then(values => {
            var tickets = values[0];
            var count = values[1];
            var response        = {};
            response.tickets    = tickets;
            response.page       = page;
            response.count      = count;
            response.size       = size;
            return response
        })
}

/*------------------TICKET STATUS COUNT------------------------------*/

ticket.getNewTicketCount = () => Ticket.getFilterTicketCount({status: statusEnum.new});

ticket.getOpenTicketCount = () => Ticket.getFilterTicketCount({status: statusEnum.open});

ticket.getInProgressTicketCount = () => Ticket.getFilterTicketCount({status: statusEnum.inProgress});

ticket.getAwaitingUserResponseTicketCount = () => Ticket.getFilterTicketCount({status: statusEnum.awaitingUserResponse});

/*------------------TICKET TYPE COUNT------------------------------*/

ticket.getBugTicketCount = () => Ticket.getFilterTicketCount({type: typeEnum.bug});

ticket.getNeedInfoTicketCount = () => Ticket.getFilterTicketCount({type: typeEnum.needInfo});

ticket.getImprovementTicketCount = () => Ticket.getFilterTicketCount({type: typeEnum.improvement});

/*------------------TICKET PRIORITY COUNT------------------------------*/

ticket.getHighTicketCount = () => Ticket.getFilterTicketCount({priority: priorityEnum.high});

ticket.getMediumTicketCount = () => Ticket.getFilterTicketCount({priority:priorityEnum.medium});

ticket.getLowTicketCount = () => Ticket.getFilterTicketCount({priority:priorityEnum.low});








/*--------------------------------------------------------------------------
--------------------------------FUNCTIONS-----------------------------------
--------------------------------------------------------------------------*/



// function getUserFromReq(req){
//     var deferred = q.defer()
//     deferred.resolve(req.user);
//     return deferred.promise;
// }

// function getUsernameFromReq(req){
//     var deferred = q.defer()
//     deferred.resolve(req.user.username);
//     return deferred.promise;
// }

function createNewTicketObject(req){
    return{
        title : req.body.title,
        description : req.body.description,
        type : req.body.type,
        status : statusEnum.new,
        createdBy : req.user.username,
        createdDate : Date.now(),
        lastUpdatedDate : Date.now(),
        comments: []
    }
}

// function canUserViewTicket(user){
//     return function(ticket){
//         return isSupport(user) || ticket.createdBy === user.username;
//     }
// }

function isSupport(user){
    return user.role.indexOf(rolesEnum.admin) > -1 || user.role.indexOf(rolesEnum.support) > -1;
}

function userCreatedTicket(ticket, user){
    return ticket.createdBy === user.username ? true : false;
}

function userCreatedComment(comment, user){
    return comment.commentBy === user.username ? true : false;
}
function createCommentBoiler(username, createdBy, notify){
    return {
        commentDate     : Date.now(),
        commentBy       : username,
        isDeletable     : false,
        deleted         : false,
        isVisible       : canUserSeeComment(createdBy, notify) ? true : false,
        commentMessage  : {
            title : "Changes"
        }
    }
}

function canUserSeeComment(createdBy, notifyList){
    return notifyList.map(user => user.id).indexOf(createdBy) > -1 ? true : false;
}

function createChangeStatusComment(username, newStatus, userComment, notify){
    return function(ticket){
        var comment = createCommentBoiler(username, ticket.createdBy, notify);
        var oldStatus = ticket.status === undefined ? 'None' : ticket.status;
        comment.commentMessage.message = ['Status changed from "' + oldStatus + '" to "' + newStatus + '"', 'Comment : "' + userComment + '"'];
        return comment;
    }
}

function createAssignTicketComment(username, newAssignee, userComment, notify){
    return function(ticket){
        console.log(ticket)
        var comment = createCommentBoiler(username, ticket.createdBy, notify);
        var oldAssignee = ticket.assignee === undefined ? 'None' : ticket.assignee;
        comment.commentMessage.message = ['Assignee changed from "' + oldAssignee + '" to "' + newAssignee + '"', 'Comment : "' + userComment + '"'];
        return comment;
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

function filterDashboardTicket(req, object){
    var sort    = helper.getSort(req),
        order   = helper.getOrder(req),
        page    = helper.getPage(req),
        size    = helper.getSize(req);

    var skip = (page - 1) * size;   
    var limit = size;
    var sortString = helper.createSortString(sort, order);

    return q.all([
        Ticket.getFilterTicketPagination(object, skip, limit,sortString),
        Ticket.getFilterTicketCount(object)
        ])
        .then(values => {
            var tickets = values[0];
            var count = values[1];
            var response        = {};
            response.tickets    = tickets;
            response.page       = page;
            response.count      = count;
            response.size       = size;
            return response
        })
}

module.exports = ticket;