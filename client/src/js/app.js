/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem',['ngRoute','textAngular','yangular-grid','yg-modal','ngFlash','ui.router','yg-notification','angularjs-dropdown-multiselect'])
    .service('authInterceptor', ['$q','$injector','Authentication','HelperFactory',
        function($q,$injector,Authentication,HelperFactory) {
            return {
                request: function(config){
                    //Show Spinner
                    HelperFactory.setLoading(true);
                    return config;
                },
                response: function(response){
                    //Hide Spinner
                    HelperFactory.setLoading(false);

                    if (response.status === 401) {
                        Authentication.clearUser();
                    }
                    return response || $q.when(response);
                },
                responseError: function(rejection) {
                    //Hide Spinner
                    HelperFactory.setLoading(false);
                    
                    //If server responds with unauthorized status code
                    if (rejection.status === 401) {
                        //Clear user data from local storage in case it is set
                        Authentication.clearUser();
                        //Redirect to login page in case user is unauthorized
                        $injector.get('$state').go('users-login.login');
                    }
                    //In case user if forbidden to access part of the web app, redirect to home page
                    if(rejection.status === 403){
                        $injector.get('$state').go('ticket.my-tickets');
                    }
                    return $q.reject(rejection);
                }
            }
        }])
    .config(['$httpProvider','$stateProvider','$urlRouterProvider',
        function($httpProvider,$stateProvider,$urlRouterProvider){
            $urlRouterProvider.otherwise('/ticket/my-tickets');
            $stateProvider
                .state('ticket', {
                    url: '/ticket',
                    controller: 'TicketsCtrl',
                    templateUrl: 'templates/tickets/tickets.html'
                })
                    .state('ticket.my-tickets', {
                        url: '/my-tickets',
                        controller: 'TicketsCtrl',
                        templateUrl: 'templates/tickets/view-my-tickets.html'
                    })
                    .state('ticket.to-me-tickets', {
                        url: '/tome-tickets',
                        controller: 'TicketsCtrl',
                        templateUrl: 'templates/tickets/view-tome-tickets.html'
                    })
                    .state('ticket.all-tickets', {
                        url: '/all-tickets',
                        controller: 'TicketsCtrl',
                        templateUrl: 'templates/tickets/view-all-tickets.html'
                    })
                .state('dashboard',{
                    url: '/ticket/dashboard',
                    controller: 'DashboardCtrl',
                    templateUrl: 'templates/tickets/dashboard.html'
                })
                .state('dashboard-to-view',{
                    url: '/ticket/dashboard/:type/:value',
                    controller: 'DashboardToViewCtrl',
                    templateUrl: 'templates/tickets/dashboard-to-view.html'
                })
                .state('ticket-new',{
                    url: '/ticket/new',
                    controller: 'NewTicketCtrl',
                    templateUrl: 'templates/tickets/new-ticket.html'
                })
                .state('ticket-view',{
                    url: '/ticket/view/:id',
                    controller: 'ViewTicketCtrl',
                    templateUrl: 'templates/tickets/view-ticket.html'
                })
                .state('ticket-edit',{
                    url : '/ticket/edit/:id',
                    controller: 'EditTicketCtrl',
                    templateUrl: 'templates/tickets/edit-ticket.html'
                })
                .state('users-login',{
                    url : '/users',
                    controller: 'MainLoginCtrl',
                    templateUrl: 'templates/users/user-login.html'
                })
                    .state('users-login.login',{
                        url : '/login',
                        controller: 'LoginCtrl',
                        templateUrl: 'templates/users/login.html'
                    })
                    .state('users-login.register',{
                        url : '/register',
                        controller: 'RegisterCtrl',
                        templateUrl: 'templates/users/register.html'
                    })
                .state('users-profile',{
                    url : '/users/profile',
                    controller: 'ProfileCtrl',
                    templateUrl: 'templates/users/profile.html'
                })
                .state('change-password',{
                    url : '/users/profile/change-password/:id',
                    controller: 'ChangePasswordCtrl',
                    templateUrl: 'templates/users/change-password.html'
                })
                .state('users-register',{
                    url : '/users/register',
                    controller: 'RegisterCtrl',
                    templateUrl: 'templates/users/register.html'
                })
                .state('admin-user-management',{
                    url : '/admin/user-management',
                    controller: 'UsersListCtrl',
                    templateUrl: 'templates/admin/manage-users.html'
                })
                .state('auth-google',{
                    url : '/auth/google/:id/:email',
                    controller: 'SetUserCtrl',
                    templateUrl: 'templates/users/set-username.html'
                })
                .state('admin-edit',{
                    url : '/admin/edit/:username',
                    controller: 'EditUsersCtrl',
                    templateUrl: 'templates/admin/edit-user.html'
                })
                .state('admin-reset-password',{
                    url : '/admin/reset-password/:id',
                    controller: 'ChangeUsersPasswordCtrl',
                    templateUrl: 'templates/admin/reset-password.html'
                });

            $httpProvider.interceptors.push('authInterceptor');
        }]);