angular.module('ticketSystem')
    .controller('DashboardCtrl',['$scope', '$state', 'YgNotify', 'TicketFactory',
        function($scope, $state, YgNotify, TicketFactory){

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

            $scope.config.url = '/admin/open-within-day';
            $scope.config.sortQuerystringParam = 'sort';
            $scope.config.orderQuerystringParam = 'order';
            $scope.config.pageQuerystringParam = 'page';
            $scope.config.sizeQuerystringParam = 'size';

            $scope.config.onRowClick = function(row){
                $state.go('ticket-view', {id: row.id});
            };

            $scope.config.objectName = 'tickets';


            TicketFactory.getDashboardData()
            .then(function(res){
            	var tickets = res.data.tickets;
            	$scope.new = {};
            	$scope.open = {};
            	$scope.inProgress = {};
            	$scope.awaitingUserResponse = {};

            	$scope.new.ticket 					= tickets.new.ticket;
            	$scope.new.count 					= tickets.new.count;
            	$scope.open.ticket 					= tickets.open.ticket;
            	$scope.open.count 					= tickets.open.count;
            	$scope.inProgress.ticket 			= tickets.inProgress.ticket;
            	$scope.inProgress.count 			= tickets.inProgress.count;
            	$scope.awaitingUserResponse.ticket 	= tickets.awaitingUserResponse.ticket;
            	$scope.awaitingUserResponse.count 	= tickets.awaitingUserResponse.count;
            })
            .catch(function(error){
            	YgNotify.alert('danger', "An error occurred while trying to fetch the dashboard data. Please try again later.", 5000);
            })
        }
    ]);