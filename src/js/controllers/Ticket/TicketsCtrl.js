/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem')
    .controller('TicketsCtrl',['$scope','$state','agSortFactory',
        function($scope, $state,agSortFactory){
            $scope.isSupport = false;
            var user = JSON.parse(localStorage.getItem('ticketSystemUser'));
            if(user){
                if(user.role.indexOf('Admin') > -1 || user.role.indexOf('Support') > -1)
                    $scope.isSupport = true;
            }


            var renderDate = function(date){
                return new Date(Date.parse(date)).toLocaleDateString();
            };
            var renderDescription = function(desc){
                //Strip HTML
                return desc ? String(desc).replace(/<[^>]+>/gm, '') : '';
            };
            var renderAssignee = function(assignee){
                if(!assignee)
                    return 'Unassigned';
                else
                    return assignee;
            };

            $scope.config = {};
            $scope.config.columns = [];
            $scope.config.columns.push({key : 'id', name : 'ID', cssClass:"col-md-1"});
            $scope.config.columns.push({key : 'title', name : 'Title', cssClass: "col-md-2"});
            $scope.config.columns.push({key : 'description', name : 'Description', cssClass: "col-md-2", render : renderDescription});
            $scope.config.columns.push({key : 'type', name : 'Type', cssClass: "col-md-1"});
            $scope.config.columns.push({key : 'assignee', name : 'Assignee', cssClass: "col-md-2", render: renderAssignee});
            $scope.config.columns.push({key : 'createdDate', name : 'Created Date', cssClass: "col-md-2", render : renderDate});
            $scope.config.columns.push({key : 'createdBy', name : 'Created By', cssClass: "col-md-2"});

            $scope.config.sortQuerystringParam = 'sort';
            $scope.config.orderQuerystringParam = 'order';
            $scope.config.pageQuerystringParam = 'page';
            $scope.config.sizeQuerystringParam = 'size';

            $scope.active = '';
            $scope.agLoading = agSortFactory.getLoading;

            $scope.config.onRowClick = function(row){
                $state.go('ticket-view', {id: row.id});
            };

            $scope.config.objectName = 'tickets';

            $scope.initiateAllTicket = function(){
                $scope.config.url = '/tickets/all';
                $scope.$parent.active = 'all';
            };

            $scope.initiateMyTicket = function(){
                $scope.config.url = '/tickets/my';
                $scope.$parent.active = 'my';
            };

            $scope.initiateToMeTicket = function(){
                $scope.config.url = '/tickets/to-me';
                $scope.$parent.active = 'tome';
            };

            $scope.$watch('agLoading()', function(newVal, oldVal){
                    $scope.setLoading(newVal);
            });

        }]);