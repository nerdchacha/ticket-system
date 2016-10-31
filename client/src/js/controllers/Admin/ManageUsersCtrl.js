/**
 * Created by dell on 8/2/2016.
 */
angular.module('ticketSystem')
    .controller('UsersListCtrl',['$scope','$state','$stateParams','HelperFactory','YgNotify',
        function($scope,$state,$stateParams,HelperFactory,YgNotify){
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
            $scope.config.url = '/admin/users/users-details';
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
        }
    ])
    .controller('EditUsersCtrl',['$scope','$state','$stateParams','HelperFactory','UserFactory','YgNotify',
        function($scope,$state,$stateParams,HelperFactory,UserFactory,YgNotify){
            $scope.isActive = {};
            $scope.isAdmin = {};
            $scope.isSupport = {};
            //User details
            $scope.userDetails = {};
            var username = $stateParams.username;
            UserFactory.getUserDetails(username)
                .then(function(res) {
                    $scope.userDetails.username = res.data.user.username;
                    $scope.userDetails.firstname = res.data.user.firstname;
                    $scope.userDetails.lastname = res.data.user.lastname;
                    $scope.userDetails.id = res.data.user._id;
                    var role = res.data.user.role;
                    //User is admin
                    $scope.userDetails.isAdmin = role.indexOf('Admin') > -1 ? true : false;
                    $scope.userDetails.isSupport = role.indexOf('Support') > -1 ? true : false;
                    // if(role.indexOf('Admin') > -1)
                    //     $scope.userDetails.isAdmin = true;
                    // else
                    //     $scope.userDetails.isAdmin = false;
                    $scope.userDetails.isActive = res.data.user.isActive;
                    $scope.userDetails.email = res.data.user.email;
                    $scope.isActive.key = "isActive";
                    $scope.isActive.value = $scope.userDetails.isActive;
                    $scope.isAdmin.key = "isAdmin";
                    $scope.isAdmin.value = $scope.userDetails.isAdmin;
                    $scope.isSupport.key = "isSupport";
                    $scope.isSupport.value = $scope.userDetails.isSupport;
                })
                .catch(function(err){
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

                $scope.userDetails.isAdmin = $scope.isAdmin.value;
                $scope.userDetails.isActive = $scope.isActive.value;
                $scope.userDetails.isSupport = $scope.isSupport.value;
                UserFactory.updateUserDetails($scope.userDetails.username,$scope.userDetails)
                    .then(function(res){
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'User details updated successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });
                    })
                    .catch(function(err){
                        YgNotify.alert('danger', 'There was some error trying to update user details. Please try again after some time.', 5000);
                    });
            };
        }
    ])
    .controller('ChangeUsersPasswordCtrl',['$scope','$state','$stateParams','HelperFactory','UserFactory','YgNotify',
        function($scope,$state,$stateParams,HelperFactory,UserFactory,YgNotify){
            //Reset password functionality
            $scope.changePassword = {};
            $scope.changePassword.title = 'Reset Password';
            $scope.changePassword.saveTitle = 'Reset';
            $scope.changePassword.cancelHref = '#/admin/user-management';
            $scope.changePassword.save = function(form){
                if(form.$invalid){
                    form.password2.$touched = true;
                    form.password1.$touched = true;
                    return;
                }    
                var id = $stateParams.id;
                UserFactory.resetPassword(id, $scope.changePassword)
                    .then(function(res){
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'Password has been reset successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });
                        //$state.go('admin-user-management');
                    })
                    .catch(function(err){
                        YgNotify.alert('danger', 'The request could not ben made successfully. Please try later', 5000);
                    });
            };
        }
    ]);