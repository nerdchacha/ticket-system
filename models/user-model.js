/**
 * Created by dell on 7/23/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Schema
var UserSchema = mongoose.Schema({
    firstname:{
       type:String
    },
    lastname:{
        type: String
    },
    email:{
        type: String
    },
    username:{
        type: String,
        index:true
    },
    password:{
        type: String
    }
});

var User = mongoose.model('user',UserSchema);

User.createUser = function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
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

User.getAllUsers = function(callback){
    User.find({},'username',callback);
};

User.updateUser = function(user,callback){
    User.findOneAndUpdate(
        {username: user.username},
        {$set: {firstname : user.firstname, lastname : user.lastname, email: user.email}},
        {new:true},
        callback
    );
};

module.exports = User;