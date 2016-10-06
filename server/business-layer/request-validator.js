/**
 * Created by dell on 7/30/2016.
 */
var validator           = {},
    Ticket              = require('../models/ticket-model.js'),
    helper              = require('./helper.js'),
    q                   = require('q'),
    _                   = require('underscore'),
    bodyHasStatus       = checkRequiredBody('status', 'status is required'),  
    bodyHasComment      = checkRequiredBody('comment', 'comment is required'),
    queryHasCommentId   = checkRequiredQuery('commentId', 'commentId is required'),
    bodyHasTitle        = checkRequiredBody('title', 'title is required'),
    bodyHasDesc         = checkRequiredBody('description', 'description is required'),
    bodyHasFirstname    = checkRequiredBody('firstname', 'firstname is required'),
    bodyHasLastname     = checkRequiredBody('lastname', 'lastname is required'),
    bodyHasEmail        = checkRequiredBody('email', 'email is required'),
    bodyHasUserId       = checkRequiredBody('id', 'user is required'),
    bodyHasAssignee     = checkRequiredBody('assigneee', 'assignee is required'),
    bodyHasUsername     = checkRequiredBody('username', 'username is required'),
    bodyHasType         = checkRequiredBody('type', 'type is required'),
    paramsHasUsername   = checkRequiredParams('username', 'username is required'),
    paramsHasId         = checkRequiredParams('id', 'id is required');

/*-------------------------------------------------------
 A MODULE TO CHECK HTTP BODY AND PARAMS TO VALiDATE IF ALL MANDATORY PARAMETERS ARE A PART OF IT
 -------------------------------------------------------*/

validator.validateNewTicket = function(req,res){
    var deferred = q.defer();

    //Making task async
    process.nextTick(function(){
        _.compose(
                resolveValidator(deferred), 
                bodyHasType,
                bodyHasDesc,
                bodyHasTitle)(req);
    });

    return deferred.promise;
};

validator.validateUpdateTicket = function(req,res){
    var deferred = q.defer();

    //Making task async
    process.nextTick(function(){
        _.compose(
                resolveValidator(deferred), 
                bodyHasStatus,
                bodyHasType,
                bodyHasDesc,
                bodyHasTitle)(req);
    });

    return deferred.promise;
};

validator.validateGetTicketById = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        _.compose(
            resolveValidator(deferred),
            paramsHasId)(req);
    });

    return deferred.promise;
};

validator.validateGetTicketData = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        _.compose(
            resolveValidator(deferred),
            bodyHasStatus)(req); 
    });

    return deferred.promise;
};

validator.validateTicketAddComment = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        _.compose(
            resolveValidator(deferred), 
            bodyHasComment,
            paramsHasId)(req);
    });
    return deferred.promise;
};

validator.validateTicketDeleteComment = function(req,res){
    var deferred = q.defer();

    //Make task async
    process.nextTick(function(){
        _.compose(
            resolveValidator(deferred),
            paramsHasId,
            queryHasCommentId)(req);
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

        resolveValidator(deferred, req);
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

        _.compose(
            resolveValidator(deferred),
            paramsHasUsername)(req);
    });
    return deferred.promise;
};

validator.validateUpdateProfile = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){

        _.compose(
            resolveValidator(deferred),
            bodyHasFirstname,
            bodyHasLastname,
            bodyHasEmail,
            paramsHasUsername)(req);
    });

    return deferred.promise;
};

validator.checkSetUsername = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){

        _.compose(
            resolveValidator(deferred),
            bodyHasUserId,
            bodyHasUsername)(req);
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

        resolveValidator(deferred, req);
    });

    return deferred.promise;
};

validator.validateTicketAssign = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){    
        _.compose(
            resolveValidator(deferred),
            bodyHasComment,
            bodyHasAssignee,
            paramsHasId)(req);
    });

    return deferred.promise;
}

validator.validateTicketChangeStatus = function(req,res){
    var deferred = q.defer();
    //Make task async
    process.nextTick(function(){

        _.compose(
            resolveValidator(deferred),
            bodyHasComment,
            bodyHasStatus,
            paramsHasId)(req);
    });

    return deferred.promise;
}

function resolveValidator(deferred, req){
    return function(req){
        return _.compose(resolver(deferred), req.validationErrors)();
    }
}

function resolver(deferred, errors){
    return function(errors){
        if(errors) deferred.reject(errors);
        else deferred.resolve();
    }
}

function checkRequiredBody(param, message, req){
    return function(req){
        req
        .checkBody(param, message)
        .notEmpty();

        return req
    }
}

function checkRequiredParams(param, message, req){
    return function(req){
        req
        .checkParams(param, message)
        .notEmpty();

        return req;
    }
}

function checkRequiredQuery(param, message, req){
    return function(req){
        req
        .checkQuery(param, message)
        .notEmpty();

        return req
    }
}

module.exports = validator;