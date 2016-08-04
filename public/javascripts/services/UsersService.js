/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .factory('UserFactory',function($http) {
        var factory = {};
        factory.login = function(username,password,remember){
            return $http.post('accounts/login',{username : username, password: password, remember: remember});
        };
        factory.logout = function(){
            return $http.get('accounts/logout');
        };
        factory.getUserByUsername = function(username){
            return $http.get('users/profile/' + username);
        };
        factory.registerUser = function(newUser){
            return $http.post('accounts/register', newUser);
        };
        factory.updateProfile = function(user){
            return $http.post('users/profile/' + user.username ,user);
        };
        factory.getAllUserDetails = function(){
            return $http.get('admin/users-details');
        };
        factory.setUsername = function(details){
            return $http.post('accounts/set-username', details);
        };
        return factory;
    });