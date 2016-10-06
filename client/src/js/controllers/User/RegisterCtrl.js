angular.module('ticketSystem')
    .controller('RegisterCtrl',['$scope','$state','UserFactory','HelperFactory','YgNotify',
     function($scope,$state,UserFactory,HelperFactory,YgNotify){
            $scope.newUser = {};
            $scope.register = function(){
                UserFactory.registerUser($scope.newUser)
                    .then(function(res){
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'User has been created successfully. You can now login.')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        if(res.data.errors) {
                            $state.go('users-login.login');
                        }
                    })
                    .catch(function(res){
                        YgNotify.alert('danger', 'There was some error trying to create the user. Please try again after some time.', 5000);
                    });
            };
        }]);