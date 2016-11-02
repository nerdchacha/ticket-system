/**
 * Created by dell on 7/23/2016.
 */
var User        = require('../models/user-model.js'),
    q           = require('q'),
    log     = require('../config/log4js-config.js'),
    rolesEnum   = require('../config/enum-config.js').roles;

var usersBl = {};

usersBl.createLocalUser = (req) => {
    return User.createUser(new User(createLocalUserObject(req, rolesEnum)));
};

usersBl.getAllActiveUsers = (req) => {
    return User.getAllActiveUsers()
};

usersBl.getUserByUsername = (username) => {
    return User.getUserByUsername(username)
};

usersBl.updateProfile = (req) => {
    return User.updateProfile(createUpdateProfileObject(req));
};

usersBl.getAllUserDetails = () => {
    return User.getAllUserDetails()
};

//TODO : Fix this
usersBl.setUsenameAndActive = (id,username) => {
    var deferred = q.defer();

    User.findUserById(id)
        .then( user => {
            if(!isUsernameSet(user.username)) deferred.reject('User has username already set');
            else {
                User.setUsenameAndActive(id, username)
                .then(user => deferred.resolve(user))
                .catch(deferred.reject(err))
            }
        })
        .catch(err => {
            log.error('Error in USERS-BL at setUsenameAndActive -', error);
            deferred.reject('Invalid user id')
        });

    return deferred.promise;
};

usersBl.comparePassword = (password, hash) => {
    return User.comparePassword(
        password,
        hash
    );
};

usersBl.changePassword = (req) => {
    return User.resetPassword(req.params.id,req.body.password);
};

function createUpdateProfileObject(req){
    return {
        username: req.params.username, 
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        email: req.body.email
    };
}

function createLocalUserObject(req, roles){
    return {
        username: req.body.username,
        isActive : true,
        role: [roles.user],
        email: req.body.email,
        local:{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        }
    }
}

function isUsernameSet(username){
    if(!username)
        return false;
    if(username === '')
        return false;
    return true;
}

module.exports = usersBl;