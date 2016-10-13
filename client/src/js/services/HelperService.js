/**
 * Created by dell on 8/5/2016.
 */
angular.module('ticketSystem')
    .factory('HelperFactory',['Authentication',
        function(Authentication){
            var fact = {};
            var static = {}
            static.loading = false;

            fact.createFlashMessage = function(res, successMessage){
                if(res.data.errors){
                    return res.data.errors.map(function(err) { return { message: err.error, class: 'danger' } });
                }
                return successMessage ? [{ message : successMessage, class: 'success' }] : [];
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
            fact.isCurrentUserAdminOrSupport = function(){
                return fact.isCurrentUserAdmin() || fact.isCurrentUserAdmin();
            }
            fact.stripHtml = function(text){
                //Strip HTML
                return text ? String(text).replace(/<[^>]+>/gm, '') : '';
            };
            fact.getLoading = function(){
                return static.loading;
            };
            fact.setLoading = function(val){
                static.loading = val;
            }
            return fact;
        }]);