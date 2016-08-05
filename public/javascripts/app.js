/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem',['ngRoute','textAngular','yangular-grid','ngFlash'])
    .service('authInterceptor', function($q,$location,Authentication) {
        return {
            response: function(response){
                var isAuthenticated = response.headers('isAuthenticated') === 'true' ? true : false;
                Authentication.setIsAuthenticated(isAuthenticated);
                if (response.status === 401) {
                    Authentication.clearUser();
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                //If server responds with unauthorized status code
                if (rejection.status === 401) {
                    //Clear user data from local storage in case it is set
                    Authentication.clearUser();
                    //Redirect to login page in case user is unauthorized
                    $location.path('users/login');
                }
                return $q.reject(rejection);
            }
        }
    })
    .config(function($routeProvider,$httpProvider){
        $routeProvider
            .when('/', {
                controller: 'TicketsCtrl',
                templateUrl: 'templates/tickets/tickets.html'
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
            .when('/users/login',{
                controller: 'LoginCtrl',
                templateUrl: 'templates/users/login.html'
            })
            .when('/users/profile',{
                controller: 'ProfileCtrl',
                templateUrl: 'templates/users/profile.html'
            })
            .when('/users/register',{
                controller: 'RegisterCtrl',
                templateUrl: 'templates/users/register.html'
            })
            .when('/admin/user-management',{
                controller: 'ManageUsersCtrl',
                templateUrl: 'templates/admin/manage-users.html'
            })
            .when('/auth/google/:id/:email',{
                controller: 'SetUserCtrl',
                templateUrl: 'templates/users/set-username.html'
            })
            .otherwise({redirectTo : '/'});

        $httpProvider.interceptors.push('authInterceptor');
    });