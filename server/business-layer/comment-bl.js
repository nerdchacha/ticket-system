var mongoose 	= require('mongoose'),
	q 			= require('q'),
	Comment		= require('../models/comment-model');

var commentBl = {};

commentBl.addComment = (ticket, comment) => {
	var deferred = q.defer();

	comment.ticketId = mongoose.Types.ObjectId(ticket._id);
	comment.deleted = false;

	Comment.addComment(new Comment(comment))
	.then(() => commentBl.getTicketWithComments(ticket))
	.then(deferred.resolve.bind(deferred))
	.catch(err => deferred.reject(err))

	return deferred.promise;
}

commentBl.deleteComment = (ticket, _commentId) => {
	var deferred = q.defer();

	Comment.deleteComment(_commentId)
	.then(() => commentBl.getTicketWithComments(ticket))
	.then(deferred.resolve.bind(deferred))
	.catch(err => deferred.reject(err))

	return deferred.promise;
}

commentBl.getTicketWithComments = ticket => {
	var deferred = q.defer();

	Comment.getCommentForTicket(ticket._id)
	.then(comments => {
		ticket.comments = comments;
		deferred.resolve(ticket);
	})
	.catch(err => deferred.reject(err))

	return deferred.promise;
}

module.exports = commentBl;