/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem')
    .factory('TicketFactory',['$http',
        function($http){
            var factory = {};
            factory.createNewTicket = function(newTicket){
                return $http.post('tickets/new',newTicket);
            };
            factory.updateTicket = function(ticketId, ticket){
                return $http.put('tickets/' + ticketId, ticket);
            };
            factory.getTicketById = function(ticketId){
                return $http.get('tickets/' + ticketId);
            };
            factory.getInitialTicketData = function(status){
                return $http.get('tickets/edit-ticket/initial-load/' + status);
            };
            factory.getDashboardData = function(){
              return $http.get('admin/dashboard');
            }
            return factory;
        }]);