/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .controller('MainCtrl',['$scope','$state','Authentication','UserFactory','$window','YgNotify','$rootScope','ActionFactory',
            function($scope,$state,Authentication,UserFactory,$window,YgNotify, $rootScope, ActionFactory){
            var checkRole = function(){
                var user = Authentication.getUser();
                if(user.role.indexOf('Admin') > -1){
                    $scope.isAdmin = true;
                }
                else
                    $scope.isAdmin = false;

                $scope.isRegularUser = true;
                if(Authentication.getUser().role.indexOf('Support') > -1 || Authentication.getUser().role.indexOf('Admin') > -1){
                    $scope.isRegularUser = false;
                }
            };
            $scope.init = function(){
                var user = Authentication.getUser();
                if(user){
                    if(user.role.indexOf('Admin') > -1){
                        $scope.isAdmin = true;
                    }
                    else
                        $scope.isAdmin = false;
                }
            };
            $scope.getUser = Authentication.getUser;
            $scope.isAuthenticated = Authentication.getIsAuthenticated;
            $scope.logout = function(){
                UserFactory.logout()
                    .then(function(){
                        //Remove user details on logout
                        Authentication.clearUser();
                        $state.go('users-login.login');
                    });
            };

            $scope.$on('successful-login',checkRole);

            $scope.getProfile = function(){
                $state.go('users-profile');
            };
            //Setting state of axtion items to null to collapse all panels
            $rootScope.$on('$stateChangeStart', function(){
                ActionFactory.setTask(null);
            });

            $window.app = {};
            $window.app.auth = function(error, user){
               if(error !== '')
                    YgNotify.alert('danger', error.toString(), 5000);
                else if(!user.username || user.username === ''){
                    $state.go('auth-google', {id: user._id.toString(), email: user.email});
               }
                else if(user){
                    Authentication.setUser(user);
                    checkRole();
                   $state.go('ticket.my-tickets')
               }
            }
        }]);