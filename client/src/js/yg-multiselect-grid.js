angular.module('yg-multiselect-grid',[])
.directive('multiselectItem', function(){
    return{
        require: '^ygMultiselectGrid',
        link: function(scope,elem,attrs,ctrl){
            elem.on('click', function(){
                var listType = elem.attr('data-list-type');
                var listId = parseInt(elem.attr('data-item-id'));
                if(elem.hasClass('multiselect-item-highlight')){
                    elem.removeClass('multiselect-item-highlight')
                    if(listType === 'model'){
                        ctrl.highlightModel(listId, false);
                    }
                    else{
                        ctrl.highlightOptions(listId, false);
                    }
                }
                else{
                    elem.addClass('multiselect-item-highlight');
                    if(listType === 'model'){
                        ctrl.highlightModel(listId, true);
                    }
                    else{
                        ctrl.highlightOptions(listId, true);
                    }
                }
            })
            elem.on('dblclick', function(e){
                var listType = elem.attr('data-list-type');
                var listId = parseInt(elem.attr('data-item-id'));
                elem.removeClass('multiselect-item-highlight');
                if(listType === 'model')
                    ctrl.moveToOptions(listId);
                else
                    ctrl.moveToModel(listId);
                scope.$apply();
            });

            scope.$on('rerender', function(){
                elem.removeClass('multiselect-item-highlight');
            });
        }
    }
})
.directive('ygMultiselectGrid',function(){
    return{
        template:'<div class="multiselect-grid-parent col-xs-12">'+
                    '<div class="col-md-4 col-sm-12">'+
                        '<div class="panelbody-basic">'+
                            '<div class="pnl-title">{{modelText}}</div>'+
                            '<ul class="multiselect-item">'+
                                '<li ng-show="model.length > 0" ng-dblclick="deselectAll()"><b>Move All</b></li>'+
                                '<li multiselect-item ng-repeat="item in model | orderBy: titleProp track by $index" data-list-type="model" data-item-id="{{item[idProp]}}">{{item[titleProp]}}</li>'+
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-md-2 col-sm-12 multiselect-buttons">'+
                        '<button class="btn btn-sm btn-primary" ng-click="moveLeft()">'+
                            '<span class="hidden-xs">Left</span>'+
                            '<span class="hidden-lg hidden-md hidden-sm">Up</span>'+
                        '</button>&nbsp;&nbsp;'+
                        '<button class="btn btn-sm btn-primary" ng-click="moveRight()">'+
                            '<span class="hidden-xs">Right</span>'+
                            '<span class="hidden-lg hidden-md hidden-sm">Down</span>'+
                        '</button>'+
                    '</div>'+
                    '<div class="col-md-4 col-sm-12">'+
                        '<div class="panelbody-basic">'+
                            '<div class="pnl-title">{{optionsText}}</div>'+
                            '<ul class="multiselect-item">'+
                                '<li ng-show="options.length > 0" ng-dblclick="selectAll()"><b>Move All</b></li>'+
                                '<li multiselect-item ng-repeat="item in options | orderBy: titleProp track by $index" data-list-type="options" data-item-id="{{item[idProp]}}">{{item[titleProp]}}</div>'+
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                '</div>',
        scope:{
            options: '=',
            model: '=',
            config: '='
        },
        controller: function($scope, $element, $attrs){
            $scope.highlighted = [];
            this.moveToOptions = function(id){
                //Move item from model to options
                $scope.options.push($scope.model.find(function(item) { return item[$scope.idProp] === id }));
                //Set highlighted property of moved item to false
                $scope.options.map(function(item){
                    item.highlighted = item.id === id ? false : item.highlighted;
                });
                //Remove item from model
                $scope.model = $scope.model.filter(function(item){ return item[$scope.idProp] !== id });
            }
            this.moveToModel = function(id){
                //Move item from options to model
                $scope.model.push($scope.options.find(function(item) { return item[$scope.idProp] === id }));
                //Set highlighted property of moved item to false
                $scope.model.map(function(item){
                    item.highlighted = item.id === id ? false : item.highlighted;
                });
                //Remove item from options
                $scope.options = $scope.options.filter(function(item){ return item[$scope.idProp] !== id });
            }
            this.highlightOptions = function(id, option){
                $scope.options.map(function(item){
                    item.highlighted = item[$scope.idProp] === id ? option : item.highlighted;
                });
            }
            this.highlightModel = function(id, option){
                $scope.model.map(function(item){
                    item.highlighted = item[$scope.idProp] === id ? option : item.highlighted;
                });
            }
        },
        link: function(scope,elem,attrs){
            scope.titleProp = scope.config.titleProp || 'title';
            scope.idProp = scope.config.idProp || 'id';
            scope.options = scope.options || [];
            scope.options.forEach(function(item) { return item.highlighted = false });
            scope.model = scope.model || [];
            scope.modelText = scope.config.modelText || 'Selected';
            scope.optionsText = scope.config.optionsText || 'Options'; 
            scope.model.forEach(function(item) { return item.highlighted = false });
            scope.moveLeft = function(){
                var highlightedOptions = scope.options.filter(function(item){ return item.highlighted === true });
                scope.options = scope.options.filter(function(item){ return item.highlighted !== true });
                highlightedOptions.forEach(function(item){ 
                    item.highlighted = false;
                    scope.model.push(item);
                });
                scope.$broadcast('rerender');
            }
            scope.moveRight = function(){
                var highlightedModel = scope.model.filter(function(item){ return item.highlighted === true });
                scope.model = scope.model.filter(function(item){ return item.highlighted !== true });
                highlightedModel.forEach(function(item){ 
                    item.highlighted = false;
                    scope.options.push(item);
                });
                scope.$broadcast('rerender');
            }
            scope.selectAll = function(){
                console.log('')
                scope.options.forEach(function(item){
                    item.highlighted = false;
                    scope.model.push(item);
                })
                scope.options = [];
                scope.$broadcast('rerender');
            }
            scope.deselectAll = function(){
                scope.model.forEach(function(item){
                    item.highlighted = false;
                    scope.options.push(item);
                })
                scope.model = [];
                scope.$broadcast('rerender');
            }
        }
    }
})