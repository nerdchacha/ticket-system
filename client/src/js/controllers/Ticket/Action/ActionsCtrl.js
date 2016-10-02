angular.module('ticketSystem')
    .controller('ActionsCtrl',['$scope','ActionFactory','HelperFactory','$rootScope',
    	function($scope, ActionFactory,HelperFactory,$rootScope) {
			$scope.getTask = ActionFactory.getTask;
			$scope.task = {};
			$scope.task.showTaskPanel = false;
            $scope.task.showMainPanel = false;
            ActionFactory.setTask(null);

			$scope.setSaveFn = function(callback){
				$scope.saveTask = callback;
			}

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
                   HelperFactory.setLoading(true);
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
							break;
						case 'changestatus':
							$scope.task.title = 'Change ticket status'
							break;
					};
				}
                else{
                    $scope.task.name = null;
                }
			});
    	}])
    .controller('AssignActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){
            console.log('set assignee');
            //Get list of all users
            ActionFactory.getAssignees()
            .then(function(res){
                $scope.users = res.data.users;  
                //remove createdBy and current assignee from users list
                $scope.users = HelperFactory.removeUserFromUsers($scope.users, 
                    [
                        $scope.ticket.createdBy,
                        $scope.ticket.assignee
                    ]);
                $scope.assignee = $scope.users[0].username;
                HelperFactory.setLoading(false);
            });
    		$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid || $scope.actionForm.assignee.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        $scope.actionForm.assignee.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
    				ActionFactory.assign($scope.ticket.id, $scope.assignee, $scope.task.comment)
    				.then(function(res){
                        if(res.data.errors){
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            errorMessage.forEach(function(error){
                                YgNotify.alert('danger', error, 5000);
                            });
                            return;
                        }
    					//Update comments and assignee on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.assignee = res.data.assignee;
    					YgNotify.alert('success', 'The assignee has been changed successfully', 5000);
    					//Close panel
                        HelperFactory.setLoading(false);
						$scope.cancelTask();
    				})
    				.catch(function(err){
						YgNotify.alert('danger', 'There was some error trying to assign the ticket. Please try again after some time.', 5000);
						$scope.cancelTask();
                        HelperFactory.setLoading(false);
    				})
    			});

    		$scope.setSaveBtnName('Assign Ticket');
    	}])
    .controller('ChangeStatusActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){
            var currentStatus = $scope.ticket.status;
            ActionFactory.getAllowedStatus(currentStatus)
            .then(function(res){
                console.log(res.data);
                $scope.allowedStatus = res.data.status.allowed;
                $scope.newStatus  = $scope.allowedStatus[0];
                HelperFactory.setLoading(false);
            });  
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid || $scope.actionForm.newStatus.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        $scope.actionForm.newStatus.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
    				ActionFactory.changeStatus($scope.ticket.id, $scope.newStatus, $scope.task.comment)
    				.then(function(res){
						//Update comments and assignee on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					YgNotify.alert('success', 'The assignee has been changed successfully', 5000);
    					//Close panel
                        HelperFactory.setLoading(false);
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
                        HelperFactory.setLoading(false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Change Status');
    	}])
    .controller('CommentActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){    
            HelperFactory.setLoading(false);		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
    				ActionFactory.addComment($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
                        YgNotify.alert('success','The comment has been added successfully',5000);
    					//Close panel
                        HelperFactory.setLoading(false);
						$scope.cancelTask();                        
    				})
    				.catch(function(err){
                        YgNotify.alert('danger','There was some error trying to add comment. Please try again after some time.',5000);
                        HelperFactory.setLoading(false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Add Comment');
    	}])
    .controller('CloseActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){    
            HelperFactory.setLoading(false);		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
    				ActionFactory.close($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					YgNotify.alert('success', 'The status has been changed successfully', 5000);
    					//Close panel
                        HelperFactory.setLoading(false);
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
                        HelperFactory.setLoading(false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Close');
    	}])
    .controller('ReopenActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){   
            HelperFactory.setLoading(false); 		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
    				ActionFactory.reopen($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					YgNotify.alert('success', 'The status has been changed successfully', 5000);
    					//Close panel
                        HelperFactory.setLoading(false);
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
                        HelperFactory.setLoading(false);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Reopen');
    	}])
    .controller('AwaitingActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){  
            HelperFactory.setLoading(false);  		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
    				ActionFactory.awaitingUserResponse($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;
    					YgNotify.alert('success', 'The status has been changed successfully', 5000);
    					//Close panel
                        HelperFactory.setLoading(false);
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
                        HelperFactory.setLoading(false);
						$scope.cancelTask();	
    				});
    			});

			$scope.setSaveBtnName('Change Status');
    	}])
    .controller('AcknowledgeActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
        function($scope,ActionFactory,YgNotify,HelperFactory){            
            HelperFactory.setLoading(false);
            $scope.setSaveFn(
                function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    HelperFactory.setLoading(true);
                    ActionFactory.acknowledgeTicket($scope.ticket.id, $scope.task.comment)
                    .then(function(res){
                        //Update comments and status on view
                        $scope.ticket.comments = res.data.comments;
                        $scope.ticket.status = res.data.status;
                        YgNotify.alert('success', 'The status has been changed successfully', 5000);
                        //Close panel
                        HelperFactory.setLoading(false);
                        $scope.cancelTask();
                    })
                    .catch(function(err){
                        YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
                        HelperFactory.setLoading(false);
                        $scope.cancelTask();    
                    });
                });

            $scope.setSaveBtnName('Acknowledge Ticket');
        }])