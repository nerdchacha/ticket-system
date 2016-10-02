/**
 * Created by dell on 8/2/2016.
 */
angular.module('ticketSystem')
    .controller('UsersListCtrl',['$scope','$state','$stateParams','HelperFactory','YgNotify',
        function($scope,$state,$stateParams,HelperFactory,YgNotify){
            HelperFactory.setLoading(true);
            var renderIsActive = function(){
                return '';
            };

            var renderIsActiveClass = function(data){
                //If user isActive
                if(data === true){
                    return 'fa fa-check';
                }
                else{
                    return 'fa fa-remove';
                }
            };

            var renderIsAdmin = function(){
                return '';
            };

            var renderIsAdminClass = function(data){
                if(data.indexOf('Admin') > -1){
                    return 'fa fa-check';
                }
                else {
                    return 'fa fa-remove';
                }
            };

            $scope.config = {};
            $scope.config.url = '/admin/users-details';
            $scope.config.columns = [];
            $scope.config.columns.push({key : 'username', name : 'Username', cssClass:"col-md-6"});
            $scope.config.columns.push({key : 'isActive', name : 'Is Active', cssClass: "col-md-3",render: renderIsActive, renderClass : renderIsActiveClass});
            $scope.config.columns.push({key : 'role', name : 'Is Admin', cssClass: "col-md-3",render: renderIsAdmin, renderClass: renderIsAdminClass});

            $scope.config.sortQuerystringParam = 'sort';
            $scope.config.orderQuerystringParam = 'order';
            $scope.config.pageQuerystringParam = 'page';
            $scope.config.sizeQuerystringParam = 'size';

            $scope.config.objectName = 'users';

            $scope.config.onRowClick = function(row){
                $state.go('admin-edit', {username: row.username});
            };

            $scope.$watch('agLoading()', function(newVal, oldVal){
                HelperFactory.setLoading(newVal);
            });
        }
    ])
    .controller('EditUsersCtrl',['$scope','$state','$stateParams','HelperFactory','UserFactory','YgNotify',
        function($scope,$state,$stateParams,HelperFactory,UserFactory,YgNotify){
            $scope.isActive = {};
            $scope.isAdmin = {};
            //User details
            $scope.userDetails = {};
            var username = $stateParams.username;
            UserFactory.getUserDetails(username)
                .then(function(res) {
                    HelperFactory.setLoading(false);    
                    $scope.userDetails.username = res.data.user.username;
                    $scope.userDetails.firstname = res.data.user.firstname;
                    $scope.userDetails.lastname = res.data.user.lastname;
                    $scope.userDetails.id = res.data.user._id;
                    var role = res.data.user.role;
                    //User is admin
                    if(role.indexOf('Admin') > -1)
                        $scope.userDetails.isAdmin = true;
                    else
                        $scope.userDetails.isAdmin = false;
                    $scope.userDetails.isActive = res.data.user.isActive;
                    $scope.userDetails.email = res.data.user.email;
                    $scope.isActive.key = "isActive";
                    $scope.isActive.value = $scope.userDetails.isActive;
                    $scope.isAdmin.key = "isAdmin";
                    $scope.isAdmin.value = $scope.userDetails.isAdmin;
                })
                .catch(function(err){
                    HelperFactory.setLoading(false);
                    YgNotify.alert('danger', 'There was some error trying to fetch user details. Please try again after some time.', 5000);
                });

            $scope.userDetails.update = function(){
                //Validate required fields
                if($scope.editUserForm.$invalid){
                    $scope.editUserForm.firstname.$touched = true;
                    $scope.editUserForm.lastname.$touched = true;
                    $scope.editUserForm.email.$touched = true;
                    return;
                }

                HelperFactory.setLoading(true);
                $scope.userDetails.isAdmin = $scope.isAdmin.value;
                $scope.userDetails.isActive = $scope.isActive.value;
                UserFactory.updateUserDetails($scope.userDetails.username,$scope.userDetails)
                    .then(function(res){
                        HelperFactory.setLoading(false);
                        YgNotify.alert('success', 'User details updated successfully', 5000);
                    })
                    .catch(function(err){
                        HelperFactory.setLoading(false);
                        YgNotify.alert('danger', 'There was some error trying to update user details. Please try again after some time.', 5000);
                    });
            };
        }
    ])
    .controller('ChangeUsersPasswordCtrl',['$scope','$state','$stateParams','HelperFactory','UserFactory','YgNotify',
        function($scope,$state,$stateParams,HelperFactory,UserFactory,YgNotify){
            //Reset password functionality
            $scope.resetPassword = {};
            $scope.resetPassword.reset = function(){
                if($scope.resetUsersPasswordForm.$invalid){
                    $scope.resetUsersPasswordForm.password2.$touched = true;
                    $scope.resetUsersPasswordForm.password1.$touched = true;
                    return;
                }

                HelperFactory.setLoading(true);    
                var id = $stateParams.id;
                UserFactory.resetPassword(id, $scope.resetPassword)
                    .then(function(res){
                        HelperFactory.setLoading(false);
                        if(!res.data.errors){
                            //Password reset successfully
                            YgNotify.alert('success', 'Password has been reset successfully', 5000);
                            $state.go('admin-user-management');
                        }
                        else{
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            errorMessage.forEach(function(error){
                                YgNotify.alert('danger', error, 5000);
                            });
                        }
                    })
                    .catch(function(err){
                        HelperFactory.setLoading(false);
                        YgNotify.alert('danger', 'The request could not ben made successfully. Please try later', 5000);
                    });
            };
        }
    ]);