angular.module('ticketSystem')
    .controller('TaskCtrl',['$scope','TaskFactory',
    	function($scope, TaskFactory) {
			$scope.getTask = TaskFactory.getTask;
			$scope.task = {};
			
			$scope.setSaveFn = function(callback){
				$scope.saveTask = callback;
			}

			$scope.setCancelFn = function(callback){
				$scope.cancelTask = callback
			}

			$scope.$watch('getTask()',function(newVal, oldVal){
				if(newVal){
					$scope.task.showTaskPanel = true;
					$scope.task.showMainPanel = true;
					$scope.task.name = 'templates/partials/action/' + newVal +'-action-partial.html';
					switch(newVal){
						case 'comment':
							$scope.task.title = 'Add new comment';
							break;
						case 'assign':
							$scope.task.title = 'Assign ticket';
							TaskFactory.getAssignees()
							.then(function(res){
								$scope.users = res.data.users;	
							});
							break;
						case 'changestatus':
							$scope.task.title = 'Change ticket status'
							var currentStatus = $scope.ticket.status;
							TaskFactory.getAllowedStatus(currentStatus)
							.then(function(res){
								$scope.allowedStatus = res.data.status.allowed;
								$scope.newStatus = res.data.status.allowed[0];
							})
							break;
					};
				}
			});
    	}])
    .controller('AssignActionCtrl',['$scope',
    	function($scope){
    		$scope.$watch('users',function(users){
    			if(users){
    				$scope.assignee = users[0].username;
    			}
    		});
    		$scope.setSaveFn(
    			function(){
    				
    			});
    	}])
    .controller('ChangeStatusActionCtrl',['$scope',
    	function($scope){    		
			$scope.setSaveFn(
    			function(){
    				
    			});
    	}])
    .controller('CommentActionCtrl',['$scope',
    	function($scope){    		
			$scope.setSaveFn(
    			function(){
    				
    			});
    	}])