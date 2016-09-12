/**
 * Created by dell on 8/15/2016.
 */
angular.module('ticketSystem')
    .directive('ygToggle',function(){
        return{
            restrict: 'E',
            scope: {
                toggle: '='
            },
            replace: true,
            template:   '<div ng-show="loaded" class="toggle-button">'+
                            '<div class="toggle"></div>'+
                        '</div>',
            link: function(scope,ele,attrs){
                var toggleClass = function(state){
                    scope.loaded = true;
                    if(state)
                        ele.addClass('is-active');
                    else
                        ele.removeClass('is-active');
                };

                scope.$watch('toggle.value',function(newVal, oldVal){
                    if(typeof newVal !== 'undefined'){
                        toggleClass(newVal);
                    }
                });
                /*var toggleButton = ele.find('.toggle');*/
                ele.on('click', function(){
                    scope.toggle.value = !scope.toggle.value;
                    toggleClass(scope.toggle.value);
                });
            }
        };
    });