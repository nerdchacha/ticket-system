/**
 * Created by dell on 7/23/2016.
 */
var mongoose    = require('mongoose'),
    q           = require('q'),
    statusEnum  = require('../config/enum-config.js').status;

var CounterSchema = mongoose.Schema({
    _id: {type:String, required: true},
    seq: {type:Number, default: 0}
});

var Counter = mongoose.model('counter',CounterSchema);

var TicketSchema = mongoose.Schema({
    id:{
        type:Number
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    priority:{
        type:String
    },
    type:{
        type:String
    },
    assignee:{
        type:String
    },
    status:{
        type:String
    },
    createdDate:{
        type:Date
    },
    lastUpdatedDate:{
        type:Date
    },
    createdBy:{
        type:String
    },
    comments:{
        type:[{
            commentMessage:Object,
            commentBy:String,
            commentDate:Date,
            isDeletable: Boolean,
            isVisible: Boolean
        }]
    }
});

//HOOK to set ticketId as auto incrementing identity
TicketSchema.pre('save', function(next){
    var doc = this;
    Counter.findByIdAndUpdate({_id: 'ticketId'}, {$inc: { seq: 1} }, (error, counter) => {
        if(error)
        return next(error);
        doc.id = counter.seq;
        next();
    });
});

var Ticket = mongoose.model('ticket',TicketSchema);

/*-------------------------------------------------------
 CREATE A NEW TICKET
 PARAMS:
 [newTicket - new ticket details]
 -------------------------------------------------------*/
Ticket.createTicket = newTicket => {
    var deferred = q.defer();
    newTicket.save((resolve(deferred)));
    return deferred.promise;
};


/*-------------------------------------------------------
 GET TICKET BY ID
 PARAMS:
 [id - id of the ticket that needs to be searched]
 -------------------------------------------------------*/
Ticket.getTicketById = id => {
    var deferred = q.defer();
    Ticket.findOne(
        {id : id},
        resolve(deferred));
    return deferred.promise;
};

/*-------------------------------------------------------
 GET ALL TICKETS COUNT IN THE SYSTEM
 PARAMS:
 -------------------------------------------------------*/
Ticket.getAllTicketsCount = () => {
    var deferred = q.defer();
    Ticket
    .find({})
    .count(resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 GET DETAILS FOR ALL THE TICKETS ACCORDING TO PAGINATION
 PARAMS:
  [skip - number of records to skip,
  limit - count of records to be retrieved
  sort - sort criteria]

 -------------------------------------------------------*/
Ticket.getAllTicketsPagination = (skip, limit, sort) => {
    var deferred = q.defer();

    Ticket.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(resolve(deferred));

    return deferred.promise;
};


/*-------------------------------------------------------
 GET ALL TICKETS COUNT FOR A PARTICULAR USER
 PARAMS:
 [username - username of the user for which tickets needs to be searched]
 -------------------------------------------------------*/
Ticket.getAllTicketsForUserCount = username => {
    var deferred = q.defer();
    Ticket
    .find({createdBy: username})
    .count(resolve(deferred));
    return deferred.promise;
};

/*-------------------------------------------------------
 GET DETAILS FOR ALL THE TICKETS ACCORDING TO PAGINATION FOR A USER
 PARAMS:
  [skip - number of records to skip,
  limit - count of records to be retrieved
  sort - sort criteria]

 -------------------------------------------------------*/
Ticket.getTicketsForUserPagination = (username, skip, limit, sort) => {
    var deferred = q.defer();

    Ticket.find({createdBy: username})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(resolve(deferred));

    return deferred.promise;
};


/*-------------------------------------------------------
 GET ALL TICKETS COUNT ASSIGNED TO USER
 PARAMS:
 [username - username of the user for which all tickets needs to be fetched that are assigned to him]
 -------------------------------------------------------*/
Ticket.getAllAssignedToMeTicketsCount = username => {
    var deferred = q.defer();
    Ticket
    .find({assignee: username})
    .count(resolve(deferred));
    return deferred.promise;
};

/*-------------------------------------------------------
 GET DETAILS FOR ALL THE TICKETS ASSIGNED TO A USER ACCORDING TO PAGINATION
 PARAMS:
  [skip - number of records to skip,
  limit - count of records to be retrieved
  sort - sort criteria]

 -------------------------------------------------------*/
Ticket.getTicketsAssignedToMePagination = (username, skip, limit, sort) => {
    var deferred = q.defer();

    Ticket.find({assignee: username})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(resolve(deferred));

    return deferred.promise;
};


/*-------------------------------------------------------
 GET DETAILS FOR ALL TICKETS COUNT OPEN WITHIN 24 HOURS ACCORDING TO PAGINATION
 PARAMS:
 -------------------------------------------------------*/
Ticket.getOpenWithin24HoursTicketsCount = () => {
    var deferred = q.defer();

    Ticket
    .find({ createdDate: { $gt: new Date(Date.now() - 24*60*60 * 1000) }})
    .count(resolve(deferred));

    return deferred.promise;
};


/*-------------------------------------------------------
 GET DETAILS FOR ALL TICKETS OPEN WITHIN 24 HOURS ACCORDING TO PAGINATION
 PARAMS:
  [skip - number of records to skip,
  limit - count of records to be retrieved
  sort - sort criteria]
 -------------------------------------------------------*/
Ticket.getOpenWithin24HoursTicketsPagination = (skip, limit, sort) => {
    var deferred = q.defer();

    Ticket.find({ createdDate: { $gt: new Date(Date.now() - 24*60*60 * 1000) }})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(resolve(deferred));

    return deferred.promise;
};

/*-------------------------------------------------------
 GET TICKET COUNT ACCORDING TO STATUS
 PARAMS:
 -------------------------------------------------------*/
Ticket.getFilterTicketCount = filter => {
    var deferred = q.defer();
    Ticket.find(        
        filter,
        {id: 1, title: 1, description: 1, type: 1, assignee: 1, createdDate: 1, createdBy: 1})
    .count(resolve(deferred));
    return deferred.promise;
};

/*-------------------------------------------------------
 GET TICKET COUNT ACCORDING TO STATUS
 PARAMS:  
 [skip - number of records to skip,
  limit - count of records to be retrieved
  sort - sort criteria]
 -------------------------------------------------------*/
Ticket.getFilterTicketPagination = (filter, skip, limit, sort) => {
    var deferred = q.defer();
    Ticket
    .find(      
        filter,
        {id: 1, title: 1, description: 1, type: 1, status: 1, createdDate: 1, priority: 1})
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec(resolve(deferred));
    return deferred.promise;
};


/*-------------------------------------------------------
 UPDATE TICKET
 PARAMS:
 [id- id of the ticket that needs to be updated]
 -------------------------------------------------------*/
Ticket.updateTicketBySupport = (id, ticket) => {
    var deferred = q.defer();
    Ticket.findOneAndUpdate(
        {_id : id},
        {$set : { title: ticket.title, description : ticket.description,  type: ticket.type, assignee: ticket.assignee, status: ticket.status, priority: ticket.priority}},
        {new : true},
        resolve(deferred));
    return deferred.promise;
};

/*-------------------------------------------------------
 ADD COMMENT TO A TICKET
 PARAMS:
 [id - i d of the ticket for which comment needs to be added]
 [comment - comment that needs to be added]
 -------------------------------------------------------*/
Ticket.addComment = (id, comment) => {
    var deferred = q.defer();
    Ticket.findOneAndUpdate(
        {id: id},
        {$push: {'comments' : {isDeletable: comment.isDeletable, commentMessage: comment.commentMessage, commentBy: comment.commentBy, commentDate: Date.now()}}},
        {new: true},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 DELETING A PARTICULAR COMMENT
 PARAMS:
 [id - id of ticket that has the comment]
 [commentId - id of the comment]
 -------------------------------------------------------*/
Ticket.deleteComment = (id, commentId) => {
    var deferred = q.defer();
    Ticket.findOneAndUpdate(
        {_id : id, 'comments.isDeletable': true},
        {$pull : {comments :{_id : commentId }}},
        {new: true},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 GET TICKET DETAILS BY COMMENT ID
 PARAMS:
 [commentId - id of the comment]
 -------------------------------------------------------*/
Ticket.getTicketByCommentId = commentId => {
    var deferred = q.defer();
    Ticket.findOne(
        {'comments._id' : commentId},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 ASSIGN TICKET TO NEW ASSIGNEE
 PARAMS:
 [id - id of the ticket
 assignee - username of the new assignee
 comment - comment added by user]
 -------------------------------------------------------*/
 Ticket.assignTicket = (id, assignee, comment) => {
    var deferred = q.defer();
    Ticket.findOneAndUpdate(
        {id: id},
        {
            $set: { assignee: assignee }, 
            $push: {'comments' : {isDeletable: comment.isDeletable, isVisible: comment.isVisible, commentMessage: comment.commentMessage, commentBy: comment.commentBy, commentDate: Date.now()}}
        },
        {new : true},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 ASSIGN TICKET TO NEW ASSIGNEE
 PARAMS:
 [id - id of the ticket
 status - new status
 comment - comment added by user]
 -------------------------------------------------------*/
 Ticket.changeStatus = (id, status, comment) => {
    var deferred = q.defer();
    Ticket.findOneAndUpdate(
        {id: id},
        {
            $set: { status: status }, 
            $push: {'comments' : {isDeletable: comment.isDeletable, commentMessage: comment.commentMessage, commentBy: comment.commentBy, commentDate: Date.now()}}
        },
        {new : true},
        resolve(deferred)
    );
    return deferred.promise;
};



function resolve(deferred){
    return (err, data) => {
        if(err) deferred.reject(err);
        else deferred.resolve(data);
    }
};

module.exports = Ticket;



