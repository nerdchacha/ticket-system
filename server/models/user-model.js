// /**
//  * Created by dell on 7/23/2016.
//  */
// var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');
// var roles = require('../config/role-config.js');
// var q = require('q');

// //Schema
// var UserSchema = mongoose.Schema({
//     username:{
//         type: String,
//         index:true
//     },
//     isActive : {
//         type: Boolean
//     },
//     role:[{
//         type:String
//     }],
//     email: {
//         type: String
//     },
//     local:{
//         firstname:{
//            type:String
//         },
//         lastname:{
//             type: String
//         },
//         email:{
//             type: String
//         },
//         password:{
//             type: String
//         }
//     },
//     google:{
//         id: {
//             type:String
//         },
//         token: {
//             type:String
//         },
//         name: {
//             type:String
//         },
//         email: {
//             type:String
//         }
//     }
// });

// var User = mongoose.model('user',UserSchema);

// /*-------------------------------------------------------
// CREATE A NEW USER
// PARAMS:
// [newUser - new user details]
// [callback - callback function to be executed on successfully creation of user]
// -------------------------------------------------------*/
// User.createUser = function(newUser,callback){
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash(newUser.local.password, salt, function(err, hash) {
//             newUser.local.password = hash;
//             newUser.save(callback);
//         });
//     });
// };

// /*-------------------------------------------------------
//  FETCH A USER BY USERNAME
//  PARAMS:
//  [username - username to be searched for]
//  [callback - callback function to be executed on successfully finding the user]
//  -------------------------------------------------------*/
// // User.getUserByUsername = function(username, callback){
// //     var query = {username : username};
// //     User.findOne(query, callback);
// // };

// User.getUserByUsername = function(username){
//     var deferred = q.defer();
//     var query = {username : username};
//     User.findOne(
//         query,
//         (err, data) => {
//             if(err) deferred.reject(err);
//             else deferred.resolve(data);
//         }
//     );
//     return deferred.promise;
// };

// /*-------------------------------------------------------
//  COMPARE PASSWORD STORED IN DB V/S SUPPLIED PASSWORD
//  PARAMS:
//  [password - clear text password supplied by user]
//  [hash - hashed password saved in the DB]
//  [callback - callback function to be executed on successfully matching the password]
//  -------------------------------------------------------*/
// User.comparePassword = function(password, hash, callback){
//     bcrypt.compare(password, hash, function(err, isMatch) {
//         if(err) throw err;
//         callback(null,  isMatch);
//     });
// };

// /*-------------------------------------------------------
//  FIND USER BY USER ID
//  PARAMS:
//  [id - user id to be searched for]
//  [callback - callback function to be executed on successfully finding the user]
//  -------------------------------------------------------*/
// User.findUserById = function(id, callback){
//     User.findById(id, function(err, user){
//         if(err) throw err;
//         callback(null, user);
//     });
// };

// /*-------------------------------------------------------
//  GET ALL ACTIVE USERS IN SYSTEM
//  PARAMS:
//  [callback - callback function to be executed on successfully fetching all active users in the system]
//  -------------------------------------------------------*/
// User.getAllActiveUsers = function(callback){
//     User.find({isActive : true},'username',callback);
// };

// /*-------------------------------------------------------
//  UPDATE USER PROFILE FOR PARTICULAR USER
//  PARAMS:
//  [user - an object with user profile details]
//  [callback - callback function to be executed on successfully updating of user profile]
//  -------------------------------------------------------*/
// User.updateProfile = function(user,callback){
//     User.findOneAndUpdate(
//         {username: user.username},
//         {$set: {'local.firstname' : user.firstname, 'local.lastname' : user.lastname, 'email': user.email}},
//         {new:true},
//         callback
//     );
// };

// /*-------------------------------------------------------
//  GET DETAILS FOR ALL THE USERS
//  PARAMS:
//  [callback - callback function to be executed on successfully fetching user details for all the users in system]
//  -------------------------------------------------------*/
// User.getAllUserDetails = function(callback){
//     //Fetch all details except for password
//     User.find({},{password: 0, google : 0}, callback);
// };

// -------------------------------------------------------
//  FIND GOOGLE AUTHENTICATED USER
//  PARAMS:
//  [id - google id (supplied by google) of the user ro be searched for]
//  [callback - callback function to be executed on successfully searching the user]
//  -------------------------------------------------------
// User.findGoogleUser = function(id,callback){
//     User.findOne({'google.id' : id},
//         callback);};

// /*-------------------------------------------------------
//  SET USERNAME AND ISACTIVE FLAG FOR USERS WO HAVE AUTHENTICATED USING GOOGLE
//  PARAMS:
//  [id - user id of the user to be updated]
//  [callback - callback function to be executed on successfully updating the user details]
//  -------------------------------------------------------*/
// User.setUsenameAndActive = function(id,username,callback){
//     User.findByIdAndUpdate(id,
//         {username: username,isActive: true},
//         {new:true},
//         callback);
// };

// /*-------------------------------------------------------
//  UPDATE USER DETAILS
//  PARAMS:
//  [username - username of the user for which details needs to be updated]
//  [userDetials- details of the user that needs to be updated]
//  [callback - callback function to be executed on successfully updating user details]
//  -------------------------------------------------------*/
// User.updateUser = function(username, userDetails, callback){
//     User.findOne({username : username},
//                 function(err, user){
//                     //User already admin
//                     if(user.role.indexOf(roles.admin) > -1){
//                         //request is to remove user from admin
//                         if(!userDetails.isAdmin){
//                             User.findOneAndUpdate({username : username},
//                                 //Set other fields and remove from admin role
//                                 {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive} ,$pull : {role : roles.admin}},
//                                 {new : true},
//                                 callback);
//                         }
//                         else{
//                             //only set user details and not alter the role
//                             User.findOneAndUpdate({username : username},
//                                 //Set other fields and remove from admin role
//                                 {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}},
//                                 {new : true},
//                                 callback)
//                         }
//                     }
//                     //User is not already admin
//                     else{
//                         if(userDetails.isAdmin){
//                             User.findOneAndUpdate({username : username},
//                                 //Set other fields and add to admin role
//                                 {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive},$push : {role : roles.admin}},
//                                 {new : true},
//                                 callback);
//                         }
//                         else{
//                             //only set user details and not alter the role
//                             User.findOneAndUpdate({username : username},
//                                 //Set other fields and remove from admin role
//                                 {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}},
//                                 {new : true},
//                                 callback)
//                         }
//                     }
//                 });
// };

// /*-------------------------------------------------------
//  RESET THE PASSWORD FOR A GIVEN USER
//  PARAMS:
//  [id - id of the user for which the password needs to be reset]
//  [password - new password that needs to be set]
//  [callback - callback function to be executed on successfully reseting the password]
//  -------------------------------------------------------*/
// User.resetPassword = function(id, password,callback){
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash(password, salt, function(err, hash) {
//             User.findByIdAndUpdate(id,
//                 {$set : {'local.password' : hash}},
//                 callback
//             );
//         });
//     });
// };

// module.exports = User;






/**
 * Created by dell on 7/23/2016.
 */
var mongoose    = require('mongoose'),
    bcrypt      = require('bcryptjs'),
    roles       = require('../config/role-config.js'),
    q           = require('q');

//Schema
var UserSchema = mongoose.Schema({
    username:{
        type: String,
        index:true
    },
    isActive : {
        type: Boolean
    },
    role:[{
        type:String
    }],
    email: {
        type: String
    },
    local:{
        firstname:{
           type:String
        },
        lastname:{
            type: String
        },
        email:{
            type: String
        },
        password:{
            type: String
        }
    },
    google:{
        id: {
            type:String
        },
        token: {
            type:String
        },
        name: {
            type:String
        },
        email: {
            type:String
        }
    }
});

var User = mongoose.model('user',UserSchema);

/*-------------------------------------------------------
CREATE A NEW USER
PARAMS:
[newUser - new user details]
-------------------------------------------------------*/
User.createUser = newUser => {
    var deferred = q.defer();

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.local.password, salt, (err, hash) => {
            newUser.local.password = hash;
            newUser.save(resolve(deferred));
        });
    });
    return deferred.promise;
};

/*-------------------------------------------------------
 FETCH A USER BY USERNAME
 PARAMS:
 [username - username to be searched for]
 -------------------------------------------------------*/
User.getUserByUsername = username => {
    var deferred = q.defer();

    User.findOne(
        {username : username},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 COMPARE PASSWORD STORED IN DB V/S SUPPLIED PASSWORD
 PARAMS:
 [password - clear text password supplied by user]
 [hash - hashed password saved in the DB]
 -------------------------------------------------------*/
User.comparePassword = (password, hash) => {
    var deferred = q.defer();

    bcrypt.compare(
        password,
        hash,
        resolve(deferred)
    );
    return  deferred.promise;
};

/*-------------------------------------------------------
 FIND USER BY USER ID
 PARAMS:
 [id - user id to be searched for]
 [callback - callback function to be executed on successfully finding the user]
 -------------------------------------------------------*/
User.findUserById = id => {
    var deferred = q.defer();
    User.findById(
        id,
        resolve(deferred)
    );
    return  deferred.promise;
};

/*-------------------------------------------------------
 GET ALL ACTIVE USERS IN SYSTEM
 PARAMS:
 -------------------------------------------------------*/
User.getAllActiveUsers = () => {
    var deferred = q.defer();

    User.find(
        {isActive : true},
        'username',
        resolve(deferred)
        );
    return deferred.promise;
};

/*-------------------------------------------------------
 UPDATE USER PROFILE FOR PARTICULAR USER
 PARAMS:
 [user - an object with user profile details]
 -------------------------------------------------------*/
User.updateProfile = user => {
    var deferred = q.defer();

    User.findOneAndUpdate(
        {username: user.username},
        {$set: {'local.firstname' : user.firstname, 'local.lastname' : user.lastname, 'email': user.email}},
        {new:true},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 GET DETAILS FOR ALL THE USERS
 PARAMS:
 -------------------------------------------------------*/
User.getAllUserDetails = () => {
    var deferred = q.defer();

    User.find(
        {},
        {password: 0, google : 0}, 
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 FIND GOOGLE AUTHENTICATED USER
 PARAMS:
 [id - google id (supplied by google) of the user ro be searched for]
 -------------------------------------------------------*/
User.findGoogleUser = id => {
    var deferred = q.defer();

    User.findOne(
        {'google.id' : id},
        resolve(deferred)
    )
    return deferred.promise;
}

/*-------------------------------------------------------
 SET USERNAME AND ISACTIVE FLAG FOR USERS WO HAVE AUTHENTICATED USING GOOGLE
 PARAMS:
 [id - user id of the user to be updated]
 -------------------------------------------------------*/
User.setUsenameAndActive = (id,username) => {
    var deferred = q.defer();

    User.findByIdAndUpdate(
        id,
        {username: username,isActive: true},
        {new:true},
        resolve(deferred)
    );
    return deferred.promise;
};

/*-------------------------------------------------------
 UPDATE USER DETAILS
 PARAMS:
 [username - username of the user for which details needs to be updated]
 [userDetials- details of the user that needs to be updated]
 -------------------------------------------------------*/
User.updateUser = (username, userDetails) => {
    var deferred = q.defer();

    User.findOne(
            {username : username},
            (err, user) => {
                //User already admin
                if(user.role.indexOf(roles.admin) > -1){
                    //request is to remove user from admin
                    if(!userDetails.isAdmin){
                        User.findOneAndUpdate({username : username},
                            //Set other fields and remove from admin role
                            {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive} ,$pull : {role : roles.admin}},
                            {new : true},
                            resolve(deferred));
                    }
                    else{
                        //only set user details and not alter the role
                        User.findOneAndUpdate({username : username},
                            //Set other fields and remove from admin role
                            {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}},
                            {new : true},
                            resolve(deferred))
                    }
                }
                //User is not already admin
                else{
                    if(userDetails.isAdmin){
                        User.findOneAndUpdate({username : username},
                            //Set other fields and add to admin role
                            {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive},$push : {role : roles.admin}},
                            {new : true},
                            resolve(deferred));
                    }
                    else{
                        //only set user details and not alter the role
                        User.findOneAndUpdate({username : username},
                            //Set other fields and remove from admin role
                            {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}},
                            {new : true},
                            resolve(deferred))
                    }
                }
            });
    return deferred.promise;

};

/*-------------------------------------------------------
 RESET THE PASSWORD FOR A GIVEN USER
 PARAMS:
 [id - id of the user for which the password needs to be reset]
 [password - new password that needs to be set]
 -------------------------------------------------------*/
User.resetPassword = (id, password) => {
    var deferred = q.defer();

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            User.findByIdAndUpdate(
                id,
                {$set : {'local.password' : hash}},
                resolve(deferred)
            );
        });
    });
    return deferred.promise;
};



function resolve(deferred){
    return (err, data) => {
        if(err) deferred.reject(err);
        else deferred.resolve(data);
    }
};

module.exports = User;