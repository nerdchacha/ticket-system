/**
 * Created by dell on 7/27/2016.
 */
angular.module('ticketSystem')
    .factory('CommonFactory',function($http){
        var factory = {};

        factory.getInitialStaticData = function(){
            return $http.get('tickets/static-data');
        };        

        return factory;
    })
    .factory('TaskFactory', function(){
        var taskName;
        var factory = {};
        factory.setTask = function(name){
            taskName = name;
        };

        factory.getTask = function(){
            return taskName;
        };

        return factory;
    })
    .filter('reverse',function(){
        return function(items) {
            if(items)
                return items.slice().reverse();
        }
    });