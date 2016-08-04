/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .controller('MainCtrl',function($scope,Authentication,UserFactory,$window,Flash){
        $scope.init = function(){
            var user = JSON.parse(localStorage.getItem('user'));
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
                    Authentication.setIsAuthenticated(false);
                    //Remove user details on logout
                    Authentication.clearUser();
                    window.location = "#/users/login";
                });
        };
        $scope.$on('successful-login',function(){
            var user = JSON.parse(localStorage.getItem('user'));
            if(user.role.indexOf('Admin') > -1){
                $scope.isAdmin = true;
            }
            else
                $scope.isAdmin = false;
        });
        $scope.getProfile = function(){
            window.location = '#/users/profile';
        };
        $window.app = {};
        $window.app.auth = function(error, user, isActive){
           if(error !== '')
                Flash.create('danger', error.toString(), 5000, {}, false);
            else if(!isActive){
                window.location.hash = '#/auth/google/' + user._id.toString() + '/' + user.email;
           }
            else if(user){
                Authentication.setUser(user);
                window.location.hash = '#/'
           }
        }
    });