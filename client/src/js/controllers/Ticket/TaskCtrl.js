// angular.module('ticketSystem')
//     .controller('TaskCtrl',['$scope','TaskFactory',
//     	function($scope, TaskFactory) {
//     		console.log(TaskFactory)
// 			$scope.getTask = TaskFactory.getTask;
// 			$scope.task = {};
// 			$scope.commentPartial = 'templates/partials/comments-partial.html';

// 			$scope.$watch('getTask()',function(newVal, oldVal){
// 				console.log(newVal);
// 				$scope.task.name = 'templates/partials/' + newVal +'-partial.html';
// 				switch(newVal){
// 					case 'comment':
// 						$scope.task.showTaskPanel = true;
// 						$scope.task.title = 'Add new comment';
// 						$scope.task.showMainPanel = false;
// 						$scope.task.showCommentsPanel = true;	
// 						break;
// 					case 'assign':
// 						$scope.task.showTaskPanel = true;
// 						$scope.task.title = 'Assign ticket';
// 						$scope.task.showMainPanel = true;
// 						$scope.task.showCommentsPanel = true;	
// 						break;
// 				};
// 			});
//     	}]);