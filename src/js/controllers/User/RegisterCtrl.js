angular.module('ticketSystem')
    .controller('RegisterCtrl',['$scope','$state','UserFactory','HelperFactory','Flash',
     function($scope,$state,UserFactory,HelperFactory,Flash){
            $scope.newUser = {};
            $scope.register = function(){
                UserFactory.registerUser($scope.newUser)
                    .then(function(res){
                        if(res.data.errors) {
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            Flash.create('danger', errorMessage, 5000, {}, false);
                        }
                        else{
                            Flash.create('success', 'User has been created successfully. You can now login.', 5000, {}, false);
                            $state.go('users-login.login');
                        }
                    })
                    .catch(function(res){
                        Flash.create('danger', 'There was some error trying to create the user. Please try again after some time.', 5000, {}, false);
                    });
            };
        }]);