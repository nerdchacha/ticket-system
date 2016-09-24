angular.module('ticketSystem')
    .controller('ActionsCtrl',['$scope','ActionFactory','HelperFactory',
    	function($scope, ActionFactory,HelperFactory) {
			$scope.getTask = ActionFactory.getTask;
			$scope.task = {};
			
			$scope.setSaveFn = function(callback){
				$scope.saveTask = callback;
			}

			/*$scope.setCancelFn = function(callback){
				$scope.cancelTask = callback
			}*/

			$scope.cancelTask = function(){
				ActionFactory.setTask(null);
				$scope.task.comment = '';
				$scope.task.showTaskPanel = false;
				$scope.task.showMainPanel = false;
			}

			$scope.setSaveBtnName = function(name){
				$scope.saveBtnName = name;
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
						case 'awaitingusersresponse':
							$scope.task.title = 'Awaiting users response';
							break;
						case 'close':
							$scope.task.title = 'Close ticket';
							break;
						case 'reopen':
							$scope.task.title = 'Reopen ticket';
							break;
						case 'acknowledge':
							$scope.task.title = 'Acknowledge ticket';
							break;
						case 'assign':
							$scope.task.title = 'Assign ticket';
							ActionFactory.getAssignees()
							.then(function(res){
								$scope.users = res.data.users;	
								$scope.users = HelperFactory.removeUserFromUsers($scope.users, 
									[
										$scope.ticket.createdBy,
										$scope.ticket.assignee
									]);
							});
							break;
						case 'changestatus':
							$scope.task.title = 'Change ticket status'
							var currentStatus = $scope.ticket.status;
							ActionFactory.getAllowedStatus(currentStatus)
							.then(function(res){
								$scope.allowedStatus = res.data.status.allowed;
							})
							break;
					};
				}
			});
    	}])
    .controller('AssignActionCtrl',['$scope','ActionFactory','Flash',
    	function($scope,ActionFactory, Flash){
    		$scope.$watch('users',function(users){
    			if(users){
    				$scope.assignee = users[0].username;
    			}
    		});
    		$scope.setSaveFn(
    			function(){
    				ActionFactory.assign($scope.ticket.id, $scope.assignee, $scope.task.comment)
    				.then(function(res){
    					//Update comments and assignee on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.assignee = res.data.assignee;
    					Flash.create('success', 'The assignee has been changed successfully', 5000, {}, false);
    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
						Flash.create('danger', 'There was some error trying to assign the ticket. Please try again after some time.', 5000, {}, false);
						$scope.cancelTask();
    				})
    			});

    		$scope.setSaveBtnName('Assign Ticket');
    	}])
    .controller('ChangeStatusActionCtrl',['$scope','ActionFactory','Flash',
    	function($scope,ActionFactory, Flash){    
    		$scope.$watch('allowedStatus',function(allowedStatus){
    			if(allowedStatus){
    				console.log(allowedStatus);
    				$scope.newStatus = allowedStatus[0];
    			}
    		});
			$scope.setSaveFn(
    			function(){
    				ActionFactory.changeStatus($scope.ticket.id, $scope.newStatus, $scope.task.comment)
    				.then(function(res){
						//Update comments and assignee on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					Flash.create('success', 'The assignee has been changed successfully', 5000, {}, false);
    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					Flash.create('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000, {}, false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Change Status');
    	}])
    .controller('CommentActionCtrl',['$scope','ActionFactory','Flash',
    	function($scope,ActionFactory,Flash){    		
			$scope.setSaveFn(
    			function(){
    				ActionFactory.addComment($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					Flash.create('success', 'The comment has been added successfully', 5000, {}, false);
    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					Flash.create('danger', 'There was some error trying to add comment. Please try again after some time.', 5000, {}, false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Add Comment');
    	}])
    .controller('CloseActionCtrl',['$scope','ActionFactory','Flash',
    	function($scope,ActionFactory,Flash){    		
			$scope.setSaveFn(
    			function(){
    				ActionFactory.close($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					Flash.create('success', 'The status has been changed successfully', 5000, {}, false);
    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					Flash.create('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000, {}, false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Close');
    	}])
    .controller('ReopenActionCtrl',['$scope','ActionFactory','Flash',
    	function($scope,ActionFactory,Flash){    		
			$scope.setSaveFn(
    			function(){
    				ActionFactory.reopen($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					Flash.create('success', 'The status has been changed successfully', 5000, {}, false);
    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					Flash.create('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000, {}, false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Reopen');
    	}])
    .controller('AwaitingActionCtrl',['$scope','ActionFactory','Flash',
    	function($scope,ActionFactory,Flash){    		
			$scope.setSaveFn(
    			function(){
    				ActionFactory.awaitingUserResponse($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					Flash.create('success', 'The status has been changed successfully', 5000, {}, false);
    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					Flash.create('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000, {}, false);
						$scope.cancelTask();	
    				});
    			});

			$scope.setSaveBtnName('Change Status');
    	}])