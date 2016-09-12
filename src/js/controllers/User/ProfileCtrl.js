angular.module('ticketSystem')
    .controller('ProfileCtrl',['$scope','$state','Authentication','UserFactory','HelperFactory','Flash',
        function($scope,$state,Authentication,UserFactory,HelperFactory,Flash){
            $scope.user = {};
            $scope.init = function(){
                UserFactory.getUserByUsername(Authentication.getUser().username)
                    .then(function(res){
                        if(res.data.errors) {
                            //If user details could not be fetched properly
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            Flash.create('danger', errorMessage, 5000, {}, false);
                            $state.go('ticket.my-tickets');
                        }
                        else
                            //Set user details to scope variable
                            $scope.user.firstname = res.data.user.firstname;
                            $scope.user.lastname = res.data.user.lastname;
                            $scope.user.username = res.data.user.username;
                            $scope.user.email = res.data.user.email;
                    });
            };

            $scope.update = function(){
                UserFactory.updateProfile($scope.user)
                    .then(function(res){
                        $scope.user.firstname = res.data.user.firstname;
                        $scope.user.lastname = res.data.user.lastname;
                        $scope.user.username = res.data.user.username;
                        $scope.user.email = res.data.user.email;
                        Authentication.setUser($scope.user);
                        Flash.create('success', 'User details have been updated successfully', 5000, {}, false);
                        $state.go('/');
                    })
                    .catch(function(res){
                        Flash.create('danger', 'There was some error trying to update user details. Please try again after some time.', 5000, {}, false);
                    })
            }
        }]);