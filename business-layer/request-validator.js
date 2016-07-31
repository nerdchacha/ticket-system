/**
 * Created by dell on 7/30/2016.
 */
var validator = {};
var Ticket = require('../models/ticket-model.js');
var q = require('q');

validator.validateNewTicket = function(req,res){
    req.checkBody('title','Ticket title cannot be blank').notEmpty();
    req.checkBody('description','Ticket description cannot be blank').notEmpty();
    req.checkBody('type','Ticket type cannot be blank').notEmpty();
    req.checkBody('priority','Ticket priority cannot be blank').notEmpty();
    req.checkBody('assignee','Ticket assignee cannot be blank').notEmpty();

    var errors = req.validationErrors();
    return errors;
};

validator.validateGetTicketById = function(req,res){
    req.checkParams('id' ,'No ticket with selected id found').notEmpty();
    var errors = req.validationErrors();
    return errors;
};

validator.validateTicketAddComment = function(req,res){
    req.checkParams('id' ,'No ticket with selected id found').notEmpty();
    req.checkBody('comment' ,'Comment is required').notEmpty();
    var errors = req.validationErrors();
    return errors;
};


validator.validateTicketDeleteComment = function(req,res){
    req.checkParams('id' ,'No ticket with selected id found').notEmpty();
    req.checkQuery('commentId', 'No comment with selected id found').isInt();
};

validator.validateNewUser = function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('firstname' ,'First name is require').notEmpty();
    req.checkBody('lastname' ,'Last name is require').notEmpty();
    req.checkBody('email' ,'Email is require').notEmpty();
    req.checkBody('email' ,'Email is not valid').isEmail();
    req.checkBody('username' ,'Username is require').notEmpty();
    req.checkBody('password' ,'Password is require').notEmpty();
    req.checkBody('password2' ,'Re enter password is require').notEmpty();
    req.checkBody('password2' ,'Passwords do not match').equals(req.body.password);


    var errors = req.validationErrors();
    return errors;
};

validator.canUserDeleteComment = function(req,res,commentId){
    var deferred = q.defer();
    Ticket.getTicketByCommentId(commentId, function(err, ticket){
        if (err){
            deferred.reject({error: err, flag: false});
        }
        var comment = ticket.comments.find(function (comment) {
            return comment._id.toString() === commentId;
        });
        var commentBy = comment.commentBy;
        if(commentBy !== req.user.username)
            deferred.reject({error: 'User cannot delete comments of other users', flag: false});
        else
            deferred.resolve({error: null, flag: true});
    });
    return deferred.promise;
};

validator.validateUsername = function(req,res){
    req.checkParams('username' ,'Username is require').notEmpty();
    var errors = req.validationErrors();
    return errors;
};

validator.validateUpdateProfile = function(req,res){
    req.checkParams('username' ,'Username is require').notEmpty();
    req.checkBody('firstname' ,'First name is require').notEmpty();
    req.checkBody('lastname' ,'Last name is require').notEmpty();
    req.checkBody('email' ,'Email is require').notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    return errors;
};

module.exports = validator;