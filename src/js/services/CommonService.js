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
    .filter('reverse',function(){
        return function(items) {
            if(items)
                return items.slice().reverse();
        }
    });