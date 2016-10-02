angular.module('ticketSystem')
    .controller('ProfileCtrl',['$scope','$state','Authentication','UserFactory','HelperFactory','YgNotify',
        function($scope,$state,Authentication,UserFactory,HelperFactory,YgNotify){
            HelperFactory.setLoading(true);
            $scope.user = {};
            $scope.init = function(){
                UserFactory.getUserByUsername(Authentication.getUser().username)
                    .then(function(res){
                        if(res.data.errors) {
                            //If user details could not be fetched properly
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            errorMessage.forEach(function(error){
                                YgNotify.alert('danger', errorMessage, 5000);
                            });
                            $state.go('ticket.my-tickets');
                            HelperFactory.setLoading(false);
                        }
                        else
                            //Set user details to scope variable
                            $scope.user.firstname = res.data.user.firstname;
                            $scope.user.lastname = res.data.user.lastname;
                            $scope.user.username = res.data.user.username;
                            $scope.user.email = res.data.user.email;
                            $scope.user.userId = res.data.user._id;
                            HelperFactory.setLoading(false);
                    });
            };

            $scope.update = function(){
                if($scope.profileForm.$invalid){
                    $scope.profileForm.firstname.$touched = true;
                    $scope.profileForm.lastname.$touched = true;
                    $scope.profileForm.email.$touched = true;
                    return;
                }
                HelperFactory.setLoading(true);
                UserFactory.updateProfile($scope.user)
                    .then(function(res){
                        $scope.user.firstname = res.data.user.firstname;
                        $scope.user.lastname = res.data.user.lastname;
                        $scope.user.username = res.data.user.username;
                        $scope.user.email = res.data.user.email;
                        $scope.user.role = res.data.user.role;
                        Authentication.setUser($scope.user);
                        YgNotify.alert('success', 'User details have been updated successfully', 5000);
                        HelperFactory.setLoading(false);
                        // $state.go('/');
                    })
                    .catch(function(res){
                        YgNotify.alert('danger', 'There was some error trying to update user details. Please try again after some time.', 5000);
                        HelperFactory.setLoading(false);
                    })
            }
        }]);