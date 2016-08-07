/**
 * Created by dell on 8/2/2016.
 */
angular.module('ticketSystem')
    .controller('ManageUsersCtrl',function($scope,$location,$stateParams,Authentication,HelperFactory,UserFactory,Flash){
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
            $location.path('admin/edit/' + row.username);
        };

        //User details
        $scope.userDetails = {};
        $scope.userDetails.getUserDetails = function(){
            var username = $stateParams.username;
            UserFactory.getUserDetails(username)
                .then(function(res) {
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
                })
                .catch(function(err){
                    Flash.create('danger', 'There was some error trying to fetch user details. Please try again after some time.', 5000, {}, false);
                });
        };
        $scope.userDetails.update = function(){
            UserFactory.updateUserDetails($scope.userDetails.username,$scope.userDetails)
                .then(function(res){
                    Flash.create('success', 'User details updated successfully', 5000, {}, false);
                })
                .catch(function(err){
                    Flash.create('danger', 'There was some error trying to update user details. Please try again after some time.', 5000, {}, false);
                });
        };

        //Reset password functionality
        $scope.resetPassword = {};
        $scope.resetPassword.reset = function(){
            var id = $stateParams.id;
            UserFactory.resetPassword(id, $scope.resetPassword)
                .then(function(res){
                    console.log(res);
                    if(!res.data.errors){
                        //Password reset successfully
                        Flash.create('success', 'Password has been reset successfully', 5000, {}, false);
                        $location.path('/admin/user-management');
                    }
                    else{
                        var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                        Flash.create('danger', errorMessage, 5000, {}, false);
                    }
                })
                .catch(function(err){
                    Flash.create('danger', 'The request could not ben made successfully. Please try later', 5000, {}, false);
                });
        };

    });