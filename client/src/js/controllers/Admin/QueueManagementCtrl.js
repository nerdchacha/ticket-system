angular.module('ticketSystem')
    .controller('QueueManagementCtrl',['$scope','PaginationService','QueueFactory','YgNotify',
        function($scope,PaginationService,QueueFactory,YgNotify){ 

				$scope.queues = []
	        	QueueFactory.getQueues()
	        	.then(function(res){
	        		$scope.queues = res.data.queues;
	        		console.log(res.data.queues);
	        		initController();
	        	})
	        	.catch(function(err){
        			YgNotify.alert('danger', 'There was some error trying to get the queue details. Please try again after some time.', 5000);
	        	})
			    

			    $scope.pager = {};
			    $scope.setPage = setPage;
			 
			 
			    function initController() {
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
			    $scope.showUpdateQueuePanel = function(id){
			    	console.log(id)
			    	$scope.showUpdateQueue = true;
			    	$scope.updateQueueId = id;
			    	$scope.updateQueueName = $scope.queues.find(function(item){ return item._id === id}).name
			    }
			    $scope.hideUpdateQueuePanel = function(){
			    	$scope.showUpdateQueue = false;
			    	$scope.updateQueueForm.updateQueue.$touched = false;
			    	$scope.updateQueueId = '';
			    	$scope.updateQueueName = '';	
			    }
			    $scope.addQueue = function(){
			    	if($scope.addQueueForm.$invalid){
	                    $scope.addQueueForm.newQueue.$touched = true;
	                    return;
                	}

                	QueueFactory.addQueue($scope.newQueue)
		        	.then(function(res){
		        		$scope.queues = res.data.queues;
		        		$scope.setPage($scope.pager.currentPage);

		        		//Resetting form
		        		$scope.newQueue = '';
		        		addQueueForm.newQueue.$touched = false;
		        		$scope.showAddQueue = false;

		        		YgNotify.alert('success', 'Queue has been added successfully', 5000);
		        	})
		        	.catch(function(err){
	        			YgNotify.alert('danger', 'There was some error trying to add a new queue. Please try again after some time.', 5000);
		        	})
			    }
			    $scope.updateQueue = function(){
			    	if($scope.updateQueueForm.$invalid){
	                    $scope.updateQueueForm.updateQueueName.$touched = true;
	                    return;
                	}

                	QueueFactory.updateQueue($scope.updateQueueId ,$scope.updateQueueName)
		        	.then(function(res){
		        		$scope.queues = res.data.queues;
		        		$scope.setPage($scope.pager.currentPage);

		        		//Resetting form
		        		$scope.updateQueueName = '';
		        		$scope.updateQueueId = ''
		        		updateQueueForm.updateQueueName.$touched = false;
		        		$scope.showUpdateQueue = false;

		        		YgNotify.alert('success', 'Queue name has been updated successfully', 5000);
		        	})
		        	.catch(function(err){
	        			YgNotify.alert('danger', 'There was some error trying to update the queue name. Please try again after some time.', 5000);
		        	})
			    }
        }
    ]);