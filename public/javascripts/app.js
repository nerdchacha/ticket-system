/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem',['ngRoute','textAngular','yangular-grid','ngFlash','ui.router'])
    .service('authInterceptor', function($q,$location,Authentication) {
        return {
            response: function(response){
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
                //In case user if forbidden to access part of the web app, redirect to home page
                if(rejection.status === 403){
                    $location.path('/');
                }
                return $q.reject(rejection);
            }
        }
    })
    .config(function($routeProvider,$httpProvider,$stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('/', {
                url: '/',
                controller: 'TicketsCtrl',
                templateUrl: 'templates/tickets/tickets.html'
            })
            .state('/ticket/new',{
                url: '/ticket/new',
                controller: 'NewTicketCtrl',
                templateUrl: 'templates/tickets/new-ticket.html'
            })
            .state('/ticket/view/:id',{
                url: '/ticket/view/:id',
                controller: 'ViewTicketCtrl',
                templateUrl: 'templates/tickets/view-ticket.html'
            })
            .state('/ticket/edit/:id',{
                url : '/ticket/edit/:id',
                controller: 'EditTicketCtrl',
                templateUrl: 'templates/tickets/edit-ticket.html'
            })
            .state('/users/login',{
                url : '/users/login',
                controller: 'LoginCtrl',
                templateUrl: 'templates/users/login.html'
            })
            .state('/users/profile',{
                url : '/users/profile',
                controller: 'ProfileCtrl',
                templateUrl: 'templates/users/profile.html'
            })
            .state('/users/register',{
                url : '/users/register',
                controller: 'RegisterCtrl',
                templateUrl: 'templates/users/register.html'
            })
            .state('/admin/user-management',{
                url : '/admin/user-management',
                controller: 'ManageUsersCtrl',
                templateUrl: 'templates/admin/manage-users.html'
            })
            .state('/auth/google/:id/:email',{
                url : '/auth/google/:id/:email',
                controller: 'SetUserCtrl',
                templateUrl: 'templates/users/set-username.html'
            })
            .state('/admin/edit/:username',{
                url : '/admin/edit/:username',
                controller: 'ManageUsersCtrl',
                templateUrl: 'templates/admin/edit-user.html'
            })
            .state('/admin/reset-password/:id',{
                url : '/admin/reset-password/:id',
                controller: 'ManageUsersCtrl',
                templateUrl: 'templates/admin/reset-password.html'
            });
        /*$routeProvider
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
            .when('/admin/edit/:username',{
                controller: 'ManageUsersCtrl',
                templateUrl: 'templates/admin/edit-user.html'
            })
            .when('/admin/reset-password/:id',{
                controller: 'ManageUsersCtrl',
                templateUrl: 'templates/admin/reset-password.html'
            })
            .otherwise({redirectTo : '/'});*/

        $httpProvider.interceptors.push('authInterceptor');
    });