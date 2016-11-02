angular.module('ticketSystem')
    .controller('QueueManagementCtrl',['$scope','PaginationService',
        function($scope,PaginationService){        	    
	        	// $scope.queues = [
	        	// 	{id: 1, name: '1 queue'},
	        	// 	{id: 2, name: '2 queue'},
	        	// 	{id: 3, name: '3 queue'},
	        	// 	{id: 4, name: '4 queue'},
	        	// 	{id: 5, name: '5 queue'},
	        	// 	{id: 6, name: '6 queue'},
	        	// 	{id: 7, name: '7 queue'},
	        	// 	{id: 8, name: '8 queue'},
	        	// 	{id: 9, name: '9 queue'},
	        	// 	{id: 10, name: '10 queue'},
	        	// 	{id: 11, name: '11 queue'},
	        	// 	{id: 12, name: '12 queue'}];

	        	$scope.queues = [];
			    

			    $scope.pager = {};
			    $scope.setPage = setPage;
			 
			    initController();
			 
			    function initController() {
			        // initialize to page 1
			        $scope.setPage(1);
			    }
			 
			    function setPage(page) {
			        if (page < 1 || page > $scope.pager.totalPages) {
			            return;
			        }
			 
			        // get pager object from service
			        $scope.pager = PaginationService.GetPager($scope.queues.length, page);
			 
			        // get current page of items
			        $scope.items = $scope.queues.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
			    }

			    $scope.showAddQueuePanel = function(){
			    	$scope.showAddQueue = true;
			    }
			    $scope.hideAddQueuePanel = function(){
			    	$scope.showAddQueue = false;
			    	$scope.addQueueForm.newQueue.$touched = false;
			    	$scope.newQueue = '';	
			    }
			    $scope.addQueue = function(){
			    	if($scope.addQueueForm.$invalid){
	                    $scope.addQueueForm.newQueue.$touched = true;
	                    return;
                	}
			    }
        }
    ]);