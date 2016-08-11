/**
 * Created by dell on 7/30/2016.
 */
var validator = {};
var Ticket = require('../models/ticket-model.js');
var q = require('q');

validator.validateNewTicket = function(req,res){
    var deferred = q.defer();

    //Making task async
    process.nextTick(function(){
        req.checkBody('title','Ticket title cannot be blank').notEmpty();
        req.checkBody('description','Ticket description cannot be blank').notEmpty();
        req.checkBody('type','Ticket type cannot be blank').notEmpty();

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.validateUpdateTicket = function(req,res){
    var deferred = q.defer();

    //Making task async
    process.nextTick(function(){
        req.checkBody('title','Ticket title cannot be blank').notEmpty();
        req.checkBody('description','Ticket description cannot be blank').notEmpty();
        req.checkBody('type','Ticket type cannot be blank').notEmpty();
        req.checkBody('status','Ticket status cannot be blank').notEmpty();

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.validateGetTicketById = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        req.checkParams('id' ,'No ticket with selected id found').notEmpty();
        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.validateGetTicketData = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        req.checkParams('status' ,'ticket status is required').notEmpty();
        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.validateTicketAddComment = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        req.checkParams('id' ,'No ticket with selected id found').notEmpty();
        req.checkBody('comment' ,'Comment is required').notEmpty();
        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });
    return deferred.promise;
};

validator.validateTicketDeleteComment = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        req.checkParams('id' ,'No ticket with selected id found').notEmpty();
        req.checkParams('id' ,'Comment ID is required').notEmpty();

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });
    return deferred.promise;
};

validator.validateNewUser = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
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
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.canUserDeleteComment = function(req,res,commentId){
    var deferred = q.defer();
    Ticket.getTicketByCommentId(commentId, function(err, ticket){
        if (err){
            deferred.reject({error: err, canDelete: false});
        }
        var comment = ticket.comments.find(function (comment) {
            return comment._id.toString() === commentId;
        });
        var commentBy = comment.commentBy;
        if(commentBy !== req.user.username)
            deferred.reject({error: 'User cannot delete comments of other users', canDelete: false});
        else
            deferred.resolve({error: null, canDelete: true});
    });
    return deferred.promise;
};

validator.validateUsername = function(req,res){
    var deferred = q.defer();
    process.nextTick(function(){
        req.checkParams('username' ,'Username is require').notEmpty();
        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });
    return deferred.promise;
};

validator.validateUpdateProfile = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){
        req.checkParams('username' ,'Username is require').notEmpty();
        req.checkBody('firstname' ,'First name is require').notEmpty();
        req.checkBody('lastname' ,'Last name is require').notEmpty();
        req.checkBody('email' ,'Email is require').notEmpty();

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.checkSetUsername = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){
        req.checkBody('id' ,'user ID  is require').notEmpty();
        req.checkBody('username' ,'Username is require').notEmpty();

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

validator.vaidateUpdateUser = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){
        req.checkParams('username' ,'Username is require').notEmpty();
        req.checkBody('email' ,'Email id is require').notEmpty();
        req.checkBody('isAdmin' ,'Is Admin field id is require').notEmpty();
        req.checkBody('isActive' ,'Is Active id is require').notEmpty();

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else {
            var user = {};
            user.email = req.body.email;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.isAdmin = req.body.isAdmin;
            user.isActive = req.body.isActive;
            deferred.resolve(user);
        }
    });

    return deferred.promise;
};

validator.validateResetPassword = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){
        req.checkParams('id' ,'Username id is require').notEmpty();
        req.checkBody('password' ,'password name is require').notEmpty();
        req.checkBody('password2' ,'retyped password is require').notEmpty();
        req.checkBody('password2' ,'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    });

    return deferred.promise;
};

module.exports = validator;