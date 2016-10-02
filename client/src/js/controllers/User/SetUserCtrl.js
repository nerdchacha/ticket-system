angular.module('ticketSystem')
    .controller('SetUserCtrl',['$scope','$stateParams','$state','UserFactory','YgNotify','Authentication',
     function($scope,$stateParams,$state,UserFactory,YgNotify,Authentication){
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
                            errorMessage.forEach(function(error){
                                YgNotify.alert('danger', error, 5000);
                            });
                        }
                        else{
                            Authentication.setUser(res.data.user);
                            $scope.$emit('successful-login');
                            $state.go('ticket.my-tickets');
                            YgNotify.alert('success', 'Username has been set successfully.', 5000);
                        }
                    })
                    .catch(function(err){
                        //SOme error on client side
                        YgNotify.alert('danger', 'There was some error trying to set the username. Please try again after some time.', 5000);
                    });
            }
        }]);