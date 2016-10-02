angular.module('ticketSystem')
    .controller('ButtonGroupCtrl',['$scope','ActionFactory',
    	function($scope,ActionFactory){
    		$scope.buttongroup = {};

            $scope.$watch('ticket.status', function(newVal){
                if(newVal){
                    ActionFactory.getAllowedButtons(newVal)
                        .then(function(res){
                            //Get possible actio buttons from server and set the status
                            $scope.buttongroup.showAssign = res.assign;
                            $scope.buttongroup.showComment = res.comment;
                            $scope.buttongroup.showchangeStatus = res.changeStatus;
                            $scope.buttongroup.showReopen = res.reopen;
                            $scope.buttongroup.showClose = res.close;
                            $scope.buttongroup.showAcknowledge = res.acknowledge;
                            $scope.buttongroup.showAwaitingUsersResponse = res.awaitingUserResponse;
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

    	}]);