angular.module('ticketSystem')
    .controller('ProfileCtrl',['$scope','$state','Authentication','UserFactory','HelperFactory','YgNotify',
        function($scope,$state,Authentication,UserFactory,HelperFactory,YgNotify){
            $scope.user = {};
            $scope.init = function(){
                UserFactory.getUserByUsername(Authentication.getUser().username)
                    .then(function(res){
                        HelperFactory
                            .createFlashMessage(
                                res)
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        if(!res.data.errors){
                            //Set user details to scope variable
                            $scope.user.firstname = res.data.user.firstname;
                            $scope.user.lastname = res.data.user.lastname;
                            $scope.user.username = res.data.user.username;
                            $scope.user.email = res.data.user.email;
                            $scope.user.userId = res.data.user._id;
                        }
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
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'User details have been updated successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        if(!res.data.errors){
                            $scope.user.firstname = res.data.user.firstname;
                            $scope.user.lastname = res.data.user.lastname;
                            $scope.user.username = res.data.user.username;
                            $scope.user.email = res.data.user.email;
                            $scope.user.role = res.data.user.role;
                            Authentication.setUser($scope.user);
                        }

                    })
                    .catch(function(res){
                        YgNotify.alert('danger', 'There was some error trying to update user details. Please try again after some time.', 5000);
                    })
            }
        }]);