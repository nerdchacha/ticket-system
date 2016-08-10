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
            comment:Object,
            commentBy:String,
            commentDate:Date
        }]
    }
});

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

Ticket.createTicket = function(newTicket,callback){
    newTicket.save(callback);
};

Ticket.getAllTickets = function(callback){
    Ticket.find({},callback);
};

Ticket.getAllTicketsForUser = function(username,callback){
    Ticket.find({username: username}, callback);
};

Ticket.getAllAssignedToMeTickets = function(username,callback){
    Ticket.find({assignee: username}, callback);
};

Ticket.getTicketById = function(id, callback){
    Ticket.findOne({id : id}, callback);
};

Ticket.updateTicketBySupport = function(id, ticket, callback){
    Ticket.findOneAndUpdate(
        {_id : id},
        {$set : { title: ticket.title, description : ticket.description,  type: ticket.type, assignee: ticket.assignee, status: ticket.status, priority: ticket.priority}},
        {new : true},
        callback);
};

Ticket.addComment = function(id, comment, callback){
    Ticket.findOneAndUpdate(
        {id: id},
        {$push: {'comments' : {comment: comment.comment, commentBy: comment.commentBy, commentDate: Date.now()}}},
        {new: true},
        callback
    );
};

Ticket.deleteComment = function(id,commentId, callback){
    Ticket.findOneAndUpdate(
        {_id : id},
        {$pull : {comments :{_id : commentId }}},
        {new: true},
        callback
    );
};

Ticket.getTicketByCommentId = function(commentId, callback){
        Ticket.findOne({'comments._id' : commentId},
        callback
    );
};

module.exports = Ticket;

