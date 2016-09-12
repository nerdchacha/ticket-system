angular.module('ticketSystem')
    .controller('ButtonGroupCtrl',['$scope','TaskFactory',
    	function($scope,TaskFactory){
    		$scope.buttongroup = {};
    		$scope.buttongroup.showAssign = true;
    		$scope.buttongroup.showComment = true;
    		$scope.buttongroup.showEdit = true;
            $scope.buttongroup.showchangeStatus = true;

    		$scope.buttongroup.comment = function(){
				TaskFactory.setTask('comment');
    		}

    		$scope.buttongroup.assign = function(){
    			TaskFactory.setTask('assign');	
    		}	

            $scope.buttongroup.changeStatus = function(){
                TaskFactory.setTask('changestatus');  
            }

    	}]);