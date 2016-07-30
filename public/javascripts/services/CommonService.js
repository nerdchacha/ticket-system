/**
 * Created by dell on 7/27/2016.
 */
angular.module('ticketSystem')
    .factory('CommonFactory',function($http){
        var factory = {};
        factory.getInitialStaticData = function(){
            return $http.get('tickets/static-data');
        }

        return factory;
    });