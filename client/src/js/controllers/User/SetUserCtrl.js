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
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'Username has been set successfully.')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });
                            
                        if(!res.data.errors){
                            Authentication.setUser(res.data.user);
                            $scope.$emit('successful-login');
                            $state.go('ticket.my-tickets');
                        }
                    })
                    .catch(function(err){
                        //SOme error on client side
                        YgNotify.alert('danger', 'There was some error trying to set the username. Please try again after some time.', 5000);
                    });
            }
        }]);