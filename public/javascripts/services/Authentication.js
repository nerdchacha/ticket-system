/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .factory('Authentication',function(){
        var factory = {};

        var isAuthenticated;
        factory.getIsAuthenticated = function(){
            return isAuthenticated;
        };
        factory.setIsAuthenticated = function(val){
            isAuthenticated = val;
        };
        factory.setUser = function(userDetails){
            localStorage.setItem('user', JSON.stringify(userDetails));
        };
        factory.clearUser = function(){
            localStorage.removeItem('user');
        };
        factory.getUser = function(){
            return JSON.parse(localStorage.getItem('user'));
        };
        return factory;
    });
