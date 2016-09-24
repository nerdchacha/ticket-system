/**
 * Created by dell on 7/23/2016.
 */
var mongoose = require('mongoose');

var CounterSchema = mongoose.Schema({
    _id:{
        type:String
    },
    seq:{
        type:Number
    }
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
            isDeletable: Boolean
        }]
    }
});

//HOOK to set ticketId as auto incrementing identity
TicketSchema.pre('save',function(next){
    var doc = this;
    Counter.findByIdAndUpdate({_id: 'ticketId'}, {$inc: { seq: 1} }, function(error, counter)   {
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
 [callback - callback function to be executed on successfully creation of ticket]
 -------------------------------------------------------*/
Ticket.createTicket = function(newTicket,callback){
    newTicket.save(callback);
};

/*-------------------------------------------------------
 GET ALL TICKETS IN THE SYSTEM
 PARAMS:
 [callback - callback function to be executed on successfully fetching all tickets in the system]
 -------------------------------------------------------*/
Ticket.getAllTickets = function(callback){
    Ticket.find({},callback);
};

/*-------------------------------------------------------
 GET ALL TICKETS FOR A PARTICULAR USER
 PARAMS:
 [username - username of the user for which tickets needs to be searched]
 [callback - callback function to be executed on successfully fetching all tickets for user]
 -------------------------------------------------------*/
Ticket.getAllTicketsForUser = function(username,callback){
    Ticket.find({createdBy: username}, callback);
};

/*-------------------------------------------------------
 GET ALL TICKETS ASSIGNED TO USER
 PARAMS:
 [username - username of the user for which all tickets needs to be fetched that are assigned to him]
 [callback - callback function to be executed on successfully fetching tickets]
 -------------------------------------------------------*/
Ticket.getAllAssignedToMeTickets = function(username,callback){
    Ticket.find({assignee: username}, callback);
};

/*-------------------------------------------------------
 GET TICKET BY ID
 PARAMS:
 [id - id of the ticket that needs to be searched]
 [callback - callback function to be executed on successfully searching ticket]
 -------------------------------------------------------*/
Ticket.getTicketById = function(id, callback){
    Ticket.findOne({id : id}, callback);
};

/*-------------------------------------------------------
 UPDATE TICKET
 PARAMS:
 [id- id of the ticket that needs to be updated]
 [callback - callback function to be executed on successfully updating ticket]
 -------------------------------------------------------*/
Ticket.updateTicketBySupport = function(id, ticket, callback){
    Ticket.findOneAndUpdate(
        {_id : id},
        {$set : { title: ticket.title, description : ticket.description,  type: ticket.type, assignee: ticket.assignee, status: ticket.status, priority: ticket.priority}},
        {new : true},
        callback);
};

/*-------------------------------------------------------
 ADD COMMENT TO A TICKET
 PARAMS:
 [id - i d of the ticket for which comment needs to be added]
 [comment - comment that needs to be added]
 [callback - callback function to be executed on successfully adding comment]
 -------------------------------------------------------*/
Ticket.addComment = function(id, comment, callback){
    Ticket.findOneAndUpdate(
        {id: id},
        {$push: {'comments' : {isDeletable: comment.isDeletable, commentMessage: comment.commentMessage, commentBy: comment.commentBy, commentDate: Date.now()}}},
        {new: true},
        callback
    );
};

/*-------------------------------------------------------
 DELETING A PARTICULAR COMMENT
 PARAMS:
 [id - id of ticket that has the comment]
 [commentId - id of the comment]
 [callback - callback function to be executed on successfully deleting comment]
 -------------------------------------------------------*/
Ticket.deleteComment = function(id,commentId, callback){
    Ticket.findOneAndUpdate(
        {_id : id, 'comments.isDeletable': true},
        {$pull : {comments :{_id : commentId }}},
        {new: true},
        callback
    );
};

/*-------------------------------------------------------
 GET TICKET DETAILS BY COMMENT ID
 PARAMS:
 [commentId - id of the comment]
 [callback - callback function to be executed on successfully fetching fetching ticket by commentId]
 -------------------------------------------------------*/
Ticket.getTicketByCommentId = function(commentId, callback){
        Ticket.findOne({'comments._id' : commentId},
        callback
    );
};

/*-------------------------------------------------------
 ASSIGN TICKET TO NEW ASSIGNEE
 PARAMS:
 [id - id of the ticket
 assignee - username of the new assignee
 comment - comment added by user]
 -------------------------------------------------------*/
 Ticket.assignTicket = function(id, assignee, comment, callback){
        Ticket.findOneAndUpdate(
            {id: id},
            {
                $set: { assignee: assignee }, 
                $push: {'comments' : {isDeletable: comment.isDeletable, commentMessage: comment.commentMessage, commentBy: comment.commentBy, commentDate: Date.now()}}
            },
            {new : true},
            callback
    );
};

/*-------------------------------------------------------
 ASSIGN TICKET TO NEW ASSIGNEE
 PARAMS:
 [id - id of the ticket
 status - new status
 comment - comment added by user]
 -------------------------------------------------------*/
 Ticket.changeStatus = function(id, status, comment, callback){
        Ticket.findOneAndUpdate(
            {id: id},
            {
                $set: { status: status }, 
                $push: {'comments' : {isDeletable: comment.isDeletable, commentMessage: comment.commentMessage, commentBy: comment.commentBy, commentDate: Date.now()}}
            },
            {new : true},
            callback
    );
};

module.exports = Ticket;

