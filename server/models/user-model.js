/**
 * Created by dell on 7/23/2016.
 */
var mongoose    = require('mongoose'),
    bcrypt      = require('bcryptjs'),
    log      = require('../config/log4js-config.js'),
    rolesEnum       = require('../config/enum-config.js').roles,
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
    return deferred.promise;
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
 GET DETAILS COUNT FOR ALL THE USERS
 PARAMS:
 -------------------------------------------------------*/
User.getAllUserCount = () => {
    var deferred = q.defer();

    User
    .find({})
    .count(resolve(deferred));
    return deferred.promise;
};

/*-------------------------------------------------------
 GET DETAILS FOR ALL THE USERS ACCORDING TO PAGINATION
 PARAMS:
  [skip - number of records to skip,
  limit - count of records to be retrieved
  sort - sort criteria]

 -------------------------------------------------------*/
User.getPaginationUserDetails = (skip, limit, sort) => {
    var deferred = q.defer();

    User.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-password -google')
        .exec(resolve(deferred));

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

    User.findOneAndUpdate(
        {username: username},
        {$set: { role : []}},
        {new: true},
        function(err, user){
            if(err) throw err;

            var newRoles = [];
            newRoles.push(rolesEnum.user);
            if(userDetails.isAdmin)
                newRoles.push(rolesEnum.admin);
            if(userDetails.isSupport)
                newRoles.push(rolesEnum.support);

            User.findOneAndUpdate(
                {username, username},
                {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}, $addToSet : {role: {$each: newRoles}}},
                {new : true},
                resolve(deferred));
        })

    // User.findOne(
    //         {username : username},
    //         (err, user) => {
    //             //User already admin
    //             if(user.role.indexOf(rolesEnum.admin) > -1){
    //                 //request is to remove user from admin
    //                 if(!userDetails.isAdmin){
    //                     User.findOneAndUpdate({username : username},
    //                         //Set other fields and remove from admin role
    //                         {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive} ,$pull : {role : rolesEnum.admin}},
    //                         {new : true},
    //                         resolve(deferred));
    //                 }
    //                 else{
    //                     //only set user details and not alter the role
    //                     User.findOneAndUpdate({username : username},
    //                         //Set other fields and remove from admin role
    //                         {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}},
    //                         {new : true},
    //                         resolve(deferred))
    //                 }
    //             }
    //             //User is not already admin
    //             else{
    //                 if(userDetails.isAdmin){
    //                     User.findOneAndUpdate({username : username},
    //                         //Set other fields and add to admin role
    //                         {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive},$push : {role : rolesEnum.admin}},
    //                         {new : true},
    //                         resolve(deferred));
    //                 }
    //                 else{
    //                     //only set user details and not alter the role
    //                     User.findOneAndUpdate({username : username},
    //                         //Set other fields and remove from admin role
    //                         {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, 'email': userDetails.email , isActive: userDetails.isActive}},
    //                         {new : true},
    //                         resolve(deferred))
    //                 }
    //             }
    //         });
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
        if(err) {
            log.error('Error in USER-MODEL -', err);
            deferred.reject(err);
        }
        else deferred.resolve(data);
    }
};

module.exports = User;