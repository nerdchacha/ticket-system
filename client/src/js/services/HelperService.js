/**
 * Created by dell on 8/5/2016.
 */
angular.module('ticketSystem')
    .factory('HelperFactory',['Authentication',
        function(Authentication){
            var fact = {};
            var users;
            var loading = false;
                    
            fact.createErrorMessage = function(errors){
                var errorMessage = [];
                for(var i = 0; i < errors.length; i++){
                    errorMessage.push(errors[i].error);
                }
                return errorMessage;
            };
            fact.setAllUsers = function(users){
                this.users = users;
            };
            fact.getAllUsers = function(){
                return this.users;
            };
            fact.getAllUsersButSelf = function(users){
                var currentUsername = Authentication.getUser().username;
                return users.filter(function(user){ return user.username !== currentUsername });
            };
            fact.removeUserFromUsers = function(users, removeList){
                return users.filter(function(user){
                    var ret = removeList.indexOf(user.username) === -1 ? true : false;
                    return ret;
                });
            };
            fact.isCurrentUserAdmin = function(){
                var currentUser = Authentication.getUser();
                if(currentUser.role.indexOf('Admin') > -1)
                    return true;
                return false;
            };
            fact.isCurrentUserSupport = function(){
                var currentUser = Authentication.getUser();
                if(currentUser.role.indexOf('Support') > -1)
                    return true;
                return false;
            };
            fact.stripHtml = function(text){
                //Strip HTML
                return text ? String(text).replace(/<[^>]+>/gm, '') : '';
            };
            fact.getLoading = function(){
                return loading;
            };
            fact.setLoading = function(val){
                loading = val;
            }
            return fact;
        }]);