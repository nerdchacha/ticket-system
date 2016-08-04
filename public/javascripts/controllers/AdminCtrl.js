/**
 * Created by dell on 8/2/2016.
 */
angular.module('ticketSystem')
    .controller('ManageUsersCtrl',function($scope, Authentication, UserFactory, Flash){
        $scope.config = {};
        $scope.config.url = '/admin/users-details';
        $scope.config.columns = [];
        $scope.config.columns.push({key : 'Username', name : 'username', cssClass:"col-md-6"});
        $scope.config.columns.push({key : 'is Active', name : 'isActive', cssClass: "col-md-3"});
        $scope.config.columns.push({key : 'is Admin', name : 'firstname', cssClass: "col-md-3"});

        $scope.config.sortQuerystringParam = 'sort';
        $scope.config.orderQuerystringParam = 'order';
        $scope.config.pageQuerystringParam = 'page';
        $scope.config.sizeQuerystringParam = 'size';

        $scope.config.objectName = 'users';

        UserFactory.getAllUserDetails()
            .then(function(res){
                console.log(res);
            })
            .catch(function(res){
                console.log(res);
            });
    });