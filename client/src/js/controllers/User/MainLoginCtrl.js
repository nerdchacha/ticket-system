/**
 * Created by dell on 7/31/2016.
 */
angular.module('ticketSystem')
    .controller('MainLoginCtrl',['$rootScope', '$scope', '$state',
    	function($rootScope, $scope, $state){
	        $scope.statename = $state.current.name;
	        $rootScope.$on('$stateChangeStart', 
	        function(event, toState, toParams, fromState, fromParams){ 
	            $scope.statename = toState.name;
	        })
	    }]);
