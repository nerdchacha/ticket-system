angular.module('ticketSystem')
    .controller('SetUserCtrl',['$scope','$stateParams','$state','UserFactory','Flash','Authentication',
     function($scope,$stateParams,$state,UserFactory,Flash,Authentication){
            var id = $stateParams.id;
            var email = $stateParams.email;
            $scope.setUsername = {};
            $scope.setUsername.email = email;
            $scope.saveUsername = function(){
                UserFactory.setUsername({id: id,username :$scope.setUsername.username})
                    .then(function(res){
                        if(res.data.errors){
                            //SOme error on the server side
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            Flash.create('danger', errorMessage, 5000, {}, false);
                        }
                        else{
                            Authentication.setUser(res.data.user);
                            $scope.$emit('successful-login');
                            $state.go('ticket.my-tickets');
                            Flash.create('success', 'Username has been set successfully.', 5000, {}, false);
                        }
                    })
                    .catch(function(err){
                        //SOme error on client side
                        Flash.create('danger', 'There was some error trying to set the username. Please try again after some time.', 5000, {}, false);
                    });
            }
        }]);