var mongoose    = require('mongoose'),
    q           = require('q'),
    log      	= require('../config/log4js-config.js');

var CommentSchema = mongoose.Schema({
	ticketId : mongoose.Schema.ObjectId,
	commentMessage: Object,
    commentBy: String,
    commentDate: Date,
    isDeletable: Boolean,
    isVisible: Boolean,
    deleted: Boolean
})

var Comment = mongoose.model('comment', CommentSchema);

/*-------------------------------------------------------
 CREATE A NEW COMMENT
 PARAMS:
 [comment - comment details]
 -------------------------------------------------------*/
Comment.addComment = comment => {
    var deferred = q.defer();
    comment.save(resolve(deferred));
    return deferred.promise;
};

Comment.getCommentForTicket = _id => {
	var deferred = q.defer();
    Comment.find(
    	{ticketId : _id, deleted: false},
    	resolve(deferred))
    return deferred.promise;	
}

Comment.deleteComment = _id => {
	var deferred = q.defer();
	Comment.findOneAndUpdate(
		{_id : _id, isDeletable: true},
		{$set: { deleted : true }},
		{new : true},
		resolve(deferred))
	return deferred.promise;
}


function resolve(deferred){
    return (err, data) => {
        if(err) {
            log.error('Error in COMMENT-MODEL -', err);
            deferred.reject(err);
        }
        else deferred.resolve(data);
    }
};

module.exports = Comment;