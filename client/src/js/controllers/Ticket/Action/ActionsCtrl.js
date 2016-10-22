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
                $scope.task.name = null;
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
							break;
						case 'changestatus':
							$scope.task.title = 'Change ticket status'
							break;
                        case 'assigntoself':
                            $scope.task.title = 'Assign to self'
                            break;
					};
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
            });
    		$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid || $scope.actionForm.assignee.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        $scope.actionForm.assignee.$touched = true;
                        return;
                    }

    				ActionFactory.assign($scope.ticket.id, $scope.assignee, $scope.task.comment)
    				.then(function(res){

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The assignee has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        if(res.data.comments){
				            //Update comments and assignee on view
				            $scope.ticket.comments = res.data.comments;
			    	        $scope.ticket.assignee = res.data.assignee;
                        }

    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
						YgNotify.alert('danger', 'There was some error trying to assign the ticket. Please try again after some time.', 5000);
						$scope.cancelTask();
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
            });  
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid || $scope.actionForm.newStatus.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        $scope.actionForm.newStatus.$touched = true;
                        return;
                    }

    				ActionFactory.changeStatus($scope.ticket.id, $scope.newStatus, $scope.task.comment)
    				.then(function(res){
						//Update comments and assignee on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The status has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Change Status');
    	}])
    .controller('CommentActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){    		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

    				ActionFactory.addComment($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The comment has been added successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

    					//Close panel
						$scope.cancelTask();                        
    				})
    				.catch(function(err){
                        YgNotify.alert('danger','There was some error trying to add comment. Please try again after some time.',5000);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Add Comment');
    	}])
    .controller('CloseActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){    		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

    				ActionFactory.close($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The status has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Close');
    	}])
    .controller('ReopenActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){    		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

    				ActionFactory.reopen($scope.ticket.id, $scope.task.comment)
    				.then(function(res){
						//Update comments and status on view
    					$scope.ticket.comments = res.data.comments;
    					$scope.ticket.status = res.data.status;

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The status has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
						$scope.cancelTask();	
    				})
    			});

			$scope.setSaveBtnName('Reopen');
    	}])
    .controller('AwaitingActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
    	function($scope,ActionFactory,YgNotify,HelperFactory){    		
			$scope.setSaveFn(
    			function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

    				ActionFactory.awaitingUserResponse($scope.ticket.id, $scope.task.comment)
    				.then(function(res){

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The status has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        if(res.data.comments){    
                            //Update comments and status on view
                            $scope.ticket.comments = res.data.comments;
                            $scope.ticket.status = res.data.status;
                        }

    					//Close panel
						$scope.cancelTask();
    				})
    				.catch(function(err){
    					YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
						$scope.cancelTask();	
    				});
    			});

			$scope.setSaveBtnName('Change Status');
    	}])
    .controller('AcknowledgeActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory',
        function($scope,ActionFactory,YgNotify,HelperFactory){            
            $scope.setSaveFn(
                function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    ActionFactory.acknowledgeTicket($scope.ticket.id, $scope.task.comment)
                    .then(function(res){
                        //Update comments and status on view
                        $scope.ticket.comments = res.data.comments;
                        $scope.ticket.status = res.data.status;

                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The status has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        //Close panel
                        $scope.cancelTask();
                    })
                    .catch(function(err){
                        YgNotify.alert('danger', 'There was some error trying to change the ticket status. Please try again after some time.', 5000);
                        $scope.cancelTask();    
                    });
                });

            $scope.setSaveBtnName('Acknowledge Ticket');
        }])
    .controller('AssignToSelfActionCtrl',['$scope','ActionFactory','YgNotify','HelperFactory','Authentication',
        function($scope,ActionFactory,YgNotify,HelperFactory,Authentication){           
            $scope.setSaveFn(
                function(){
                    //Validate required fields
                    if($scope.actionForm.comment.$invalid){
                        $scope.actionForm.comment.$touched = true;
                        return;
                    }

                    var currentUser = Authentication.getUser();
                    console.log(currentUser);
                    ActionFactory.assign($scope.ticket.id, currentUser.username, $scope.task.comment)
                    .then(function(res){
                        
                        HelperFactory
                            .createFlashMessage(
                                res,
                                'The assignee has been changed successfully')
                            .forEach(function(msg){
                                YgNotify.alert(msg.class, msg.message, 5000);
                            });

                        if(res.data.comments){    
                            //Update comments and assignee on view
                            $scope.ticket.comments = res.data.comments;
                            $scope.ticket.assignee = res.data.assignee;
                        }

                        //Close panel
                        $scope.cancelTask();
                    })
                    .catch(function(err){
                        YgNotify.alert('danger', 'There was some error trying to assign the ticket. Please try again after some time.', 5000);
                        $scope.cancelTask();
                    });
                });

            $scope.setSaveBtnName('Assign To Self');
        }])