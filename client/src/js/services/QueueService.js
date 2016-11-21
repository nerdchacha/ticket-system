/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .factory('QueueFactory',['$http',
        function($http) {
            var factory = {};

            factory.getQueues = function(){
                return $http.get('admin/users/queue');
            };
            factory.addQueue = function(name){
                return $http.post('admin/users/queue', {name: name});
            };
            factory.updateQueue = function(id, name){
                return $http.put('admin/users/queue/' + id, {name: name});
            };

            return factory;
        }]);