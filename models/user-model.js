/**
 * Created by dell on 7/23/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var roles = require('../config/role-config.js');

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

User.createUser = function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.local.password, salt, function(err, hash) {
            newUser.local.password = hash;
            newUser.save(callback);
        });
    });
};

User.getUserbyUsername = function(username, callback){
    var query = {username : username};
    User.findOne(query, callback);
};

User.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null,  isMatch);
    });
};

User.findUserById = function(id, callback){
    User.findById(id, function(err, user){
        if(err) throw err;
        callback(null, user);
    });
};

User.getAllActiveUsers = function(callback){
    User.find({isActive : true},'username',callback);
};

User.updateProfile = function(user,callback){
    User.findOneAndUpdate(
        {username: user.username},
        {$set: {'local.firstname' : user.firstname, 'local.lastname' : user.lastname, 'email': user.email}},
        {new:true},
        callback
    );
};

User.getAllUserDetails = function(callback){
    //Fetch all details except for password
    User.find({},{password: 0, google : 0}, callback);
};

User.findGoogleUser = function(id,callback){
    User.findOne({'google.id' : id},
        callback);};

User.setUsenameAndActive = function(id,username,callback){
    User.findByIdAndUpdate(id,
        {username: username,isActive: true},
        {new:true},
        callback);
};

User.updateUser = function(username, userDetails, callback){
    User.findOne({username : username},
                function(err, user){
                    //User already admin
                    if(user.role.indexOf(roles.admin) > -1){
                        //request is to remove user from admin
                        if(!userDetails.isAdmin){
                            User.findOneAndUpdate({username : username},
                                //Set other fields and remove from admin role
                                {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, isActive: userDetails.isActive} ,$pull : {role : roles.admin}},
                                {new : true},
                                callback);
                        }
                        else{
                            //only set user details and not alter the role
                            User.findOneAndUpdate({username : username},
                                //Set other fields and remove from admin role
                                {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, isActive: userDetails.isActive}},
                                {new : true},
                                callback)
                        }
                    }
                    //User is not already admin
                    else{
                        if(userDetails.isAdmin){
                            console.log('Make user admin');
                            User.findOneAndUpdate({username : username},
                                //Set other fields and add to admin role
                                {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, isActive: userDetails.isActive},$push : {role : roles.admin}},
                                {new : true},
                                callback);
                        }
                        else{
                            //only set user details and not alter the role
                            User.findOneAndUpdate({username : username},
                                //Set other fields and remove from admin role
                                {$set : {'local.firstname' : userDetails.firstname, 'local.lastname' : userDetails.lastname, isActive: userDetails.isActive}},
                                {new : true},
                                callback)
                        }
                    }
                });
};

User.resetPassword = function(id, password,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            User.findByIdAndUpdate(id,
                {$set : {'local.password' : hash}},
                callback
            );
        });
    });
};

module.exports = User;