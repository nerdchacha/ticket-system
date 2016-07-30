/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem',['ngRoute','textAngular','yangular-grid','ngFlash'])
    .service('authInterceptor', function($q,$location) {
        return {
            response: function(response){
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                console.log(rejection);
                if (rejection.status === 401) {
                    console.log("Response Error 401",rejection);
                    //Redirect to login page in case user is unauthorized
                    window.location = 'users/login';
                }
                return $q.reject(rejection);
            }
        }
    })
    .config(function($routeProvider,$httpProvider){
        $routeProvider
            .when('/', {
                controller: 'TicketsCtrl',
                templateUrl: '/templates/tickets/tickets.html'
            })
            .when('/ticket/new',{
                controller: 'NewTicketCtrl',
                templateUrl: 'templates/tickets/new-ticket.html'
            })
            .when('/ticket/view/:id',{
                controller: 'ViewTicketCtrl',
                templateUrl: 'templates/tickets/view-ticket.html'
            })
            .when('/ticket/edit/:id',{
                controller: 'EditTicketCtrl',
                templateUrl: 'templates/tickets/edit-ticket.html'
            })
            .otherwise({redirectTo : '/'});

        $httpProvider.interceptors.push('authInterceptor');
    });