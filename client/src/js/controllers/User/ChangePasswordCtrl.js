angular.module('ticketSystem')
    .controller('ChangePasswordCtrl',['$scope','$state','$stateParams','UserFactory','HelperFactory','YgNotify',
        function($scope,$state,$stateParams,UserFactory,HelperFactory,YgNotify){
            $scope.changePassword = {};
            $scope.changePassword.title = 'Change Password';
            $scope.changePassword.saveTitle = 'Change Password';
            $scope.changePassword.cancelHref = '#/users/profile';
            $scope.changePassword.save = function(form){
                if(form.$invalid){
                    form.password2.$touched = true;
                    form.password1.$touched = true;
                    return;
                }
                var id = $stateParams.id;
                UserFactory.changePassword(id, $scope.changePassword)
                    .then(function(res){
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The password has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });
                            
                        if(!res.data.errors){
                            $state.go('users-profile');
                        }
                    })
                    .catch(function(err){
                        YgNotify.alert('danger', 'The request could not ben made successfully. Please try later', 5000);
                    });
            };
        }]);