/**
 * Created by dell on 7/27/2016.
 */
angular.module('ticketSystem')
    .factory('CommonFactory',['$http',
        function($http){
            var factory = {};

            factory.getInitialStaticData = function(){
                return $http.get('tickets/static-data');
            };        

            return factory;
        }])
    .factory('TaskFactory',['$http',
        function($http){
            var taskName;
            var factory = {};
            factory.setTask = function(name){
                taskName = name;
            };
            factory.getTask = function(){
                return taskName;
            };
            factory.getAssignees = function(){
                return $http.get('static/all-users');
            };
            factory.getAllowedStatus = function(currentStatus){
              return $http.get('static/allowed-status/'+ currentStatus);  
            }
            return factory;
        }])
    .filter('reverse',function(){
        return function(items) {
            if(items)
                return items.slice().reverse();
        }
    });