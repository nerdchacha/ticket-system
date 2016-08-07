/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .controller('MainCtrl',function($scope,$state,Authentication,UserFactory,$window,Flash){
        var checkRole = function(){
            var user = Authentication.getUser();
            if(user.role.indexOf('Admin') > -1){
                $scope.isAdmin = true;
            }
            else
                $scope.isAdmin = false;
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
                    window.location = "#/users/login";
                });
        };

        $scope.$on('successful-login',checkRole);

        $scope.getProfile = function(){
            window.location = '#/users/profile';
        };
        $window.app = {};
        $window.app.auth = function(error, user){
           if(error !== '')
                Flash.create('danger', error.toString(), 5000, {}, false);
            else if(!user.username || user.username === ''){
                $state.go('auth-google' + {id: user._id.toString(), email: user.email});
           }
            else if(user){
                Authentication.setUser(user);
                checkRole();
               $state.go('ticket.my-tickets')
           }
        }
    });