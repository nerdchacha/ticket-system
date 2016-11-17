/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .factory('QueueFactory',['$http',
        function($http) {
            var factory = {};

            factory.getQueues = function(){
                return $http.get('admin/users/get-queues');
            };
            factory.addQueue = function(name){
                return $http.post('admin/users/add-queue', {name: name});
            };

            return factory;
        }]);