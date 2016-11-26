/**
 * Created by dell on 7/30/2016.
 */
var validator                   = {},
    Ticket                      = require('../models/ticket-model.js'),
    q                           = require('q'),
    R                           = require('ramda'),
    queryHasCommentId           = checkRequiredQuery('commentId', 'commentId is required'),
    bodyHasStatus               = checkRequiredBody('status', 'status is required'),  
    bodyHasComment              = checkRequiredBody('comment', 'comment is required'),
    bodyHasTitle                = checkRequiredBody('title', 'title is required'),
    bodyHasDesc                 = checkRequiredBody('description', 'description is required'),
    bodyHasFirstname            = checkRequiredBody('firstname', 'firstname is required'),
    bodyHasLastname             = checkRequiredBody('lastname', 'lastname is required'),
    bodyHasEmail                = checkRequiredBody('email', 'email is required'),
    bodyHasPassword             = checkRequiredBody('password', 'password is required'),
    bodyHasPassword2            = checkRequiredBody('password2', 'retyped password is required'),
    bodyIsEmail                 = checkIsEmailBody('email', 'Email id is not valid'),
    bodyHasUserId               = checkRequiredBody('id', 'user is required'),
    bodyHasAssignee             = checkRequiredBody('assignee', 'assignee is required'),
    bodyHasUsername             = checkRequiredBody('username', 'username is required'),
    bodyHasType                 = checkRequiredBody('type', 'type is required'),
    bodyHasUsers                = checkRequiredBody('users', 'users are required'),
    bodyHasisAdmin              = checkRequiredBody('isAdmin' ,'Is Admin field id is require'),
    bodyHasisActive             = checkRequiredBody('isActive' ,'Is Active id is require'),
    bodyPasswordEqualsPassword2 = checkIsEqualBody('password2', 'password and re entered password do not match'),
    bodyHasName                 = checkRequiredBody('name', 'queue name is required'),    
    paramsHasUsername           = checkRequiredParams('username', 'username is required'),
    paramsHasStatus             = checkRequiredParams('status', 'status is required'),
    paramsHasType               = checkRequiredParams('type', 'type is required'),
    paramsHasPriority           = checkRequiredParams('priority', 'priority is required'),
    paramsHasId                 = checkRequiredParams('id', 'id is required');




/*-------------------------------------------------------
 A MODULE TO CHECK HTTP BODY AND PARAMS TO VALiDATE IF ALL MANDATORY PARAMETERS ARE A PART OF IT
 -------------------------------------------------------*/

validator.validateNewTicket = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
                resolve(deferred), 
                bodyHasType,
                bodyHasDesc,
                bodyHasTitle)(req);
    });

    return deferred.promise;
};

validator.validateUpdateTicket = (req) =>{
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
                resolve(deferred), 
                bodyHasStatus,
                bodyHasType,
                bodyHasDesc,
                bodyHasTitle)(req);
    });

    return deferred.promise;
};

validator.validateGetTicketById = (req) => {
    
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            paramsHasId)(req);
    });

    return deferred.promise;
};

validator.validateGetTicketData = (req) =>{
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            paramsHasStatus)(req); 
    });

    return deferred.promise;
};

validator.validateTicketAddComment = (req) => {
    var deferred = q.defer();


    process.nextTick(() => {
        R.compose(
            resolve(deferred), 
            bodyHasComment,
            paramsHasId)(req);
    });
    return deferred.promise;
};

validator.validateTicketDeleteComment = (req) => {
    var deferred = q.defer();


    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            paramsHasId,
            queryHasCommentId)(req);
    });

    return deferred.promise;
};

validator.validateNewUser = (req) => {
    var deferred = q.defer();


    process.nextTick(() => {
         R.compose(
            resolve(deferred), 
            bodyPasswordEqualsPassword2(req.body.password),
            bodyHasPassword2,
            bodyHasPassword,
            bodyHasUsername,
            bodyIsEmail,
            bodyHasEmail,
            bodyHasLastname,
            bodyHasFirstname)(req);
        });

    return deferred.promise;
};

validator.validateUsername = (req) => {
    var deferred = q.defer();
    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            paramsHasUsername)(req);
    });
    return deferred.promise;
};

validator.validateUpdateProfile = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            bodyHasFirstname,
            bodyHasLastname,
            bodyHasEmail,
            paramsHasUsername)(req);
    });

    return deferred.promise;
};

validator.checkSetUsername = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            bodyHasUserId,
            bodyHasUsername)(req);
    });

    return deferred.promise;
};

validator.filterByType = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            paramsHasType)(req);
    });

    return deferred.promise;
};

validator.filterByPriority = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            paramsHasPriority)(req);
    });

    return deferred.promise;
};

validator.vaidateUpdateUser = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            bodyHasisActive,
            bodyHasisAdmin,
            bodyHasEmail,
            bodyHasLastname,
            bodyHasFirstname,
            paramsHasUsername)(req); 

    });

    return deferred.promise;
};

validator.validateResetPassword = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

         R.compose(
            resolve(deferred),
            bodyPasswordEqualsPassword2(req.body.password),
            bodyHasPassword2,
            bodyHasPassword,
            paramsHasId)(req);
        });

    return deferred.promise;
};

validator.validateTicketAssign = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            bodyHasComment,
            bodyHasAssignee,
            paramsHasId)(req);
    });

    return deferred.promise;
}

validator.validateTicketChangeStatus = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {

        R.compose(
            resolve(deferred),
            bodyHasComment,
            bodyHasStatus,
            paramsHasId)(req);
    });

    return deferred.promise;
}

validator.validateAddQueue = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            bodyHasName)(req);
    });

    return deferred.promise;
}


validator.validateUpdateQueue = (req) => {
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            bodyHasName,
            paramsHasId)(req);
    });

    return deferred.promise;   
}

validator.validateGetQueueUsers = (req) => {
    
    var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            paramsHasId)(req);
    });

    return deferred.promise;
};

validator.validateUpdateQueueUsers = (req) => {
  var deferred = q.defer();

    process.nextTick(() => {
        R.compose(
            resolve(deferred),
            bodyHasUsers,
            paramsHasId)(req);
    });

    return deferred.promise;  
}

//--------------------------------------------------------------------------------
//-----------------------------------REUSABLE FUNCTIONS---------------------------
//--------------------------------------------------------------------------------

function resolve(deferred){
    return (req)  => {
        var errors = req.validationErrors();
        if(errors) deferred.reject(errors);
        else deferred.resolve(req);
    }
}

function checkRequiredBody(param, message, req){
    return (req)  => {
        req
        .checkBody(param, message)
        .notEmpty();

        return req;
    }
}

function checkRequiredParams(param, message, req){
    return (req)  => {
        req
        .checkParams(param, message)
        .notEmpty();

        return req;
    }
}

function checkRequiredQuery(param, message, req){
    return (req)  => {
        req
        .checkQuery(param, message)
        .notEmpty();

        return req;
    }
}

function checkIsEmailBody(param, message, req){
    return (req)  => {
        req
        .checkBody(param, message)
        .isEmail();

        return req;
    }    
}


function checkIsEqualBody(param, message, check, req){
    return (check) => {
        return (req) => {
            req
            .checkBody(param, message)
            .equals(check);
            return req;
        }
    }    
}



module.exports = validator;