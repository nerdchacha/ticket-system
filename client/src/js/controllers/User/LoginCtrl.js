angular.module('ticketSystem')
    .controller('LoginCtrl',['$scope','$state','$window','UserFactory','Authentication',
        function($scope,$state,$window,UserFactory,Authentication){
            $scope.error = false;
            $scope.message = '';
            $scope.login = function(){
                UserFactory.login($scope.username, $scope.password, $scope.remember)
                    .then(function(res){
                        //If user is not authenticated
                        if(!res.data.isAuthenticated){
                            $scope.error = true;
                            $scope.message = res.data.msg;
                        }
                        else{
                            //Set user details in Common Factory
                            Authentication.setUser(res.data.user);
                            $scope.$emit('successful-login');
                            $state.go('ticket.my-tickets');
                        }
                    }).
                    catch(function(error){
                        $scope.error = true;
                        $scope.message = 'An error occurred while trying to log you in. Please try again later';

                    });
            };
            $scope.googleLogin = function(){
                //Open a new window and make a get request to google auth url
                var url = 'accounts/auth/google',
                    width = 600,
                    height = 450,
                    top = (window.outerHeight - height) / 2,
                    left = (window.outerWidth - width) / 2;
                $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
            }
        }]);