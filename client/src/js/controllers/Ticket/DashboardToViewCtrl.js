angular.module('ticketSystem')
    .controller('DashboardToViewCtrl',['$scope', '$state', '$stateParams', 'YgNotify', 'TicketFactory',
        function($scope, $state, $stateParams, YgNotify, TicketFactory){
        	$scope.type = $stateParams.type;
        	$scope.value = $stateParams.value;

        	$scope.config = {};
            $scope.config.columns = [];
            $scope.config.columns.push({key : 'id', name : 'ID', cssClass:"col-md-1"});
            $scope.config.columns.push({key : 'title', name : 'Title', cssClass: "col-md-2"});
            $scope.config.columns.push({key : 'description', name : 'Description', cssClass: "col-md-2", render : renderDescription});
            $scope.config.columns.push({key : 'type', name : 'Type', cssClass: "col-md-1"});
            $scope.config.columns.push({key : 'status', name : 'Status', cssClass: "col-md-2"});
            $scope.config.columns.push({key : 'priority', name : 'Priority', cssClass: "col-md-2", render: renderPriority});
            $scope.config.columns.push({key : 'createdDate', name : 'Created Date', cssClass: "col-md-2", render : renderDate});

            $scope.config.sortQuerystringParam = 'sort';
            $scope.config.orderQuerystringParam = 'order';
            $scope.config.pageQuerystringParam = 'page';
            $scope.config.sizeQuerystringParam = 'size';

            $scope.config.onRowClick = function(row){
                $state.go('ticket-view', {id: row.id});
            };

            $scope.config.objectName = 'tickets';
            $scope.config.url = '/admin/'+ $stateParams.type + '/' + $stateParams.value;

            function renderDate(date){
                return new Date(Date.parse(date)).toLocaleDateString();
            };
            function renderDescription(desc){
                //Strip HTML
                return desc ? String(desc).replace(/<[^>]+>/gm, '') : '';
            };
            function renderPriority(priority){
                if(!priority)
                    return 'None';
                else
                    return priority;
            };
        }
    ]);