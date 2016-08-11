/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem')
    .factory('TicketFactory',function($http){
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
        factory.addComment = function(ticketId, comment){
            return $http.post('tickets/addComment/' + ticketId, comment);
        };
        factory.deleteComment = function(ticket,comment){
            return $http.delete('tickets/deleteComment/' + ticket._id + '?commentId=' + comment._id);
        };
        factory.getInitialTicketData = function(status){
            return $http.get('tickets/edit-ticket/initial-load/' + status);
        };
        return factory;
    });