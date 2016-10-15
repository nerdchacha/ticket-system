// /**
//  * Created by dell on 7/23/2016.
//  */
// var User        = require('../models/user-model.js'),
//     q           = require('q'),
//     roles       = require('../config/role-config.js');

// var usersBl = {};

// usersBl.createLocalUser = (req) => {
//     var deferred = q.defer();

//     User.createUser(
//         new User(createLocalUserObject(req, roles)),
//         (err, user) => {
//             if(err) deferred.reject();
//             else deferred.resolve(user);
//         }
//     );
//     return deferred.promise;
// };

// usersBl.getAllActiveUsers = (req,res) => {
//     var deferred = q.defer();
//     User.getAllActiveUsers(
//         (err,users) => {
//             if(err) deferred.reject(err);
//             else deferred.resolve(users);
//         }
//     );
//     return deferred.promise;
// };

// /*usersBl.getUserByUsername = (username) => {
//     var deferred = q.defer();
//     User.getUserByUsername(
//         username,
//         (err, user) => {
//             if(err) deferred.reject(err);
//             else deferred.resolve(user);
//         }
//     );
//     return deferred.promise;
// };*/

// usersBl.getUserByUsername = (username) => {
//     return User.getUserByUsername(username)
// };

// usersBl.updateProfile = (req,res) => {
//     var deferred = q.defer();
//     User.updateProfile(
//         createUpdateProfileObject(req),
//         (err, user) => {
//             if(err) deferred.reject(err);
//             else deferred.resolve(user);
//         }
//     );
//     return deferred.promise;
// };

// usersBl.getAllUserDetails = () => {
//     var deferred = q.defer();
//     User.getAllUserDetails(
//         (err,user) => {
//             if(err) deferred.reject(err);
//             else deferred.resolve(user);
//         }
//     );
//     return deferred.promise;
// };

// usersBl.setUsenameAndActive = (id,username) => {
//     var deferred = q.defer();
//     User.findUserById(
//         id,
//         (err,user) => {
//             if(err) deferred.reject('Invalid user id');
//             else if(!isUsernameSet(user.username)) deferred.reject('User has username already set');
//             else {
//                 User.setUsenameAndActive(id, username, (err,user) => {
//                     if(err) deferred.reject(err);
//                     else deferred.resolve(user);
//                 });
//             }
//     });
//     return deferred.promise;
// };

// //Just wrapping compare password inside a promise
// usersBl.comparePassword = (password, hash) => {
//     var deferred = q.defer();
//     User.comparePassword(
//         password,
//         hash,
//         (err, isMatch) => {
//             if(err) deferred.reject(err);
//             else deferred.resolve(isMatch);
//         }
//     );
//     return deferred.promise;
// };

// usersBl.changePassword = (req,res) => {
//     var deferred = q.defer();
//     User.resetPassword(
//         req.params.id,
//         req.body.password, err => {
//             if(err) deferred.reject(err);
//             else deferred.resolve();
//         }
//     );
//     return deferred.promise;
// };

// function createUpdateProfileObject(req){
//     return {
//         username: req.params.username, 
//         firstname: req.body.firstname, 
//         lastname: req.body.lastname, 
//         email: req.body.email
//     };
// }

// function createLocalUserObject(req, roles){
//     return {
//         username: req.body.username,
//         isActive : true,
//         role: [roles.user],
//         email: req.body.email,
//         local:{
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             password: req.body.password
//         }
//     }
// }

// function isUsernameSet(username){
//     if(!username)
//         return false;
//     if(username === '')
//         return false;
//     return true;
// }

// module.exports = usersBl;


/**
 * Created by dell on 7/23/2016.
 */
var User        = require('../models/user-model.js'),
    q           = require('q'),
    roles       = require('../config/role-config.js');

var usersBl = {};

usersBl.createLocalUser = (req) => {
    return User.createUser(new User(createLocalUserObject(req, roles)));
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
        .catch(err => deferred.reject('Invalid user id'));

    return deferred.promise;
};

usersBl.comparePassword = (password, hash) => {
    return User.comparePassword(
        password,
        hash
    );
};

usersBl.changePassword = (req) => {
    return User.resetPassword(
        req.params.id,
        req.body.password
    );
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