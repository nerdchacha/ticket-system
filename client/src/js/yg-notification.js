angular.module('yg-notification',[])
.factory('YgNotify', ['$rootScope', function($rootScope){
	var fact = {};
	fact.alert = function(className, message, duration){
		var alertObj = {className: className, message: message, duration: duration};
		$rootScope.$emit('ygmessage', alertObj);
	}

	return fact;
}])
.directive('ygNotification',function($rootScope, $compile, $timeout){
	return {
		restrict : 'E',
		scope : {},
		template: '<div class="yg-notification"></div>',
		link: function(scope, elem, attrs, ctrl){
			$rootScope.$on('ygmessage', function(event, alert){
				var message = angular.element('<div class="yg-message in ' + alert.className + '">' + alert.message + '</div>');
				elem.children().append(message);
				//Add removing animation
				$timeout(function(){
					message.removeClass('in');
					message.addClass('out');
				}, alert.duration)
				//Remove element
				$timeout(function(){
					 message.remove();
				}, alert.duration + 600)

			})
		}
	}
});