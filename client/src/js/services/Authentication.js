/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .factory('Authentication',function(){
        var factory = {};

        factory.getIsAuthenticated = function(){
            if(localStorage.getItem('ticketSystemUser'))
                return true;
            else false;
        };
        /*factory.setIsAuthenticated = function(val){
            isAuthenticated = val;
        };*/
        factory.setUser = function(userDetails){
            localStorage.setItem('ticketSystemUser', JSON.stringify(userDetails));
        };
        factory.clearUser = function(){
            localStorage.removeItem('ticketSystemUser');
        };
        factory.getUser = function(){
            return JSON.parse(localStorage.getItem('ticketSystemUser'));
        };
        return factory;
    });
