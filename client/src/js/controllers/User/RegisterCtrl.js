angular.module('ticketSystem')
    .controller('RegisterCtrl',['$scope','$state','UserFactory','HelperFactory','YgNotify',
     function($scope,$state,UserFactory,HelperFactory,YgNotify){
            $scope.newUser = {};
            $scope.register = function(){
                UserFactory.registerUser($scope.newUser)
                    .then(function(res){
                        if(res.data.errors) {
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            errorMessage.forEach(function(error){
                                YgNotify.alert('danger', error, 5000);
                            });
                        }
                        else{
                            YgNotify.alert('success', 'User has been created successfully. You can now login.', 5000);
                            $state.go('users-login.login');
                        }
                    })
                    .catch(function(res){
                        YgNotify.alert('danger', 'There was some error trying to create the user. Please try again after some time.', 5000);
                    });
            };
        }]);