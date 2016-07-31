/**
 * Created by dell on 7/30/2016.
 */
angular.module('ticketSystem')
    .controller('MainCtrl',function($scope,Authentication,UserFactory){
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

        $scope.getProfile = function(){
            window.location = '#/users/profile';
        };
    });