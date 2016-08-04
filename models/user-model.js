/**
 * Created by dell on 7/23/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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

User.updateUser = function(user,callback){
    User.findOneAndUpdate(
        {username: user.username},
        {$set: {'local.firstname' : user.firstname, 'local.lastname' : user.lastname, 'email': user.email}},
        {new:true},
        callback
    );
};

User.getAllUserDetails = function(callback){
    User.find({},{username:1,isActive:1, role:1}, callback);
};

User.findGoogleUser = function(id,callback){
    User.findOne({'google.id' : id}, callback);
};

User.setUsenameAndActive = function(id,username,callback){
    User.findByIdAndUpdate(id,
        {username: username,isActive: true},
        {new:true},
        callback);
};

module.exports = User;