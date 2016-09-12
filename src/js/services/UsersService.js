/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .factory('UserFactory',['$http',
        function($http) {
            var factory = {};
            //User account related http requests
            factory.login = function(username,password,remember){
                return $http.post('accounts/login',{username : username, password: password, remember: remember});
            };
            factory.logout = function(){
                return $http.get('accounts/logout');
            };
            factory.registerUser = function(newUser){
                return $http.post('accounts/register', newUser);
            };


            //User related http request
            factory.getUserByUsername = function(username){
                return $http.get('users/profile/' + username);
            };

            factory.updateProfile = function(user){
                return $http.post('users/profile/' + user.username ,user);
            };
            factory.setUsername = function(details){
                return $http.post('accounts/set-username', details);
            };

            //Admin related http requests
            factory.getAllUserDetails = function(){
                return $http.get('admin/users-details');
            };
            factory.getUserDetails = function(username){
                return $http.get('admin/user-details/' + username);
            };
            factory.updateUserDetails = function(username,userDetails){
                return $http.post('admin/update-user/' + username, userDetails);
            };
            factory.resetPassword = function(id,passwords){
                return $http.post('admin/reset-password/' + id, passwords);
            };

            return factory;
        }]);