/**
 * Created by dell on 8/5/2016.
 */
angular.module('ticketSystem')
    .factory('HelperFactory',function(){
        var fact = {};
        var users;
                
        fact.createErrorMessage = function(errors){
            var errorMessage = '';
            for(var i = 0; i < errors.length; i++){
                errorMessage += errors[i].error + '<br/>'
            }
            return errorMessage;
        };

        fact.setAllUsers = function(users){
            this.users = users;
        };

        fact.getAllUsers = function(){
            return this.users;
        };

        return fact;
    });