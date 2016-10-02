angular.module('ticketSystem')
    .controller('ButtonGroupCtrl',['$scope','ActionFactory',
    	function($scope,ActionFactory){
    		$scope.buttongroup = {};

            $scope.$watchCollection('ticket', function(ticket){
                if(ticket){
                    ActionFactory.getAllowedButtons(ticket.id)
                        .then(function(res){
                            //Get possible action buttons from server and set the status
                            $scope.buttongroup.showAssign = res.assign;
                            $scope.buttongroup.showComment = res.comment;
                            $scope.buttongroup.showchangeStatus = res.changeStatus;
                            $scope.buttongroup.showReopen = res.reopen;
                            $scope.buttongroup.showClose = res.close;
                            $scope.buttongroup.showAcknowledge = res.acknowledge;
                            $scope.buttongroup.showAwaitingUsersResponse = res.awaitingUserResponse;
                            $scope.buttongroup.showAssignToSelf = res.assignToSelf;
                        });
                }
            });
    		

    		$scope.buttongroup.comment = function(){
				ActionFactory.setTask('comment');
    		}

    		$scope.buttongroup.assign = function(){
    			ActionFactory.setTask('assign');	
    		}	

            $scope.buttongroup.changeStatus = function(){
                ActionFactory.setTask('changestatus');  
            }

            $scope.buttongroup.close = function(){
                ActionFactory.setTask('close');  
            }

            $scope.buttongroup.reopen = function(){
                ActionFactory.setTask('reopen');  
            }

            $scope.buttongroup.acknowledge = function(){
                ActionFactory.setTask('acknowledge');  
            }

            $scope.buttongroup.awaitingusersresponse = function(){
                ActionFactory.setTask('awaitingusersresponse');  
            }

            $scope.buttongroup.assignToSelf = function(){
                ActionFactory.setTask('assigntoself');  
            }

    	}]);