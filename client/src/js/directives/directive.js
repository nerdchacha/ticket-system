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
    })
    .directive('ygSpinner',['HelperFactory', function(HelperFactory){
        return {
            restrict: 'E',
            template: '<div class="loading" ng-show="loading()"></div>',
            scope: {},
            link: function(scope, ele, attrs, ctrl){
                // scope.getLoading = HelperFactory.getLoading;
                // scope.$watch('getLoading()',function(newVal){
                //     console.log(newVal);
                //     scope.loading = newVal;
                // });
                scope.loading = HelperFactory.getLoading;
            }
        }
    }]);