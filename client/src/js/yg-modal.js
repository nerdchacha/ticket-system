/**
 * Created by dell on 8/14/2016.
 */

var app = angular.module('yg-modal',[]);

app.factory('YgModal', function(){
    var modal  ={};
    var state = {};
    state.isOpen = false;
    modal.open = function(title, body){
        state.title = title;
        state.body = body;
        state.isOpen = true;
    };
    modal.close = function(){
        state.isOpen = false;
    };
    modal.getModalState = function(){
        return state;
    };
    modal.confirm = function(callback){
        state.callback = callback;
    };
    return modal;
});

app.directive('ygModal',['YgModal',
    function(YgModal){
        return {
            restrict: 'E',
            scope: {},
            template:'<div class="yg-modal-overlay" ng-class="{\'is-open\' : isopen === true}">'
                            +'<div class="yg-modal">'
                                +'<div class="yg-modal-header">'
                                    +'{{title}}'
                                    +'<div class="yg-modal-close" ng-click="close()"></div>'
                                +'</div>'
                                +'<div class="yg-modal-body">'
                                    +'{{body}}'
                                    +'<div class="yg-modal-buttons">'
                                        +'<button class="confirm" ng-click="confirm()">OK</button>'
                                        +'<button class="cancel" ng-click="close()">Cancel</button>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>',
            controller: function($scope,$element,$attrs){
                $scope.state = YgModal.getModalState;
                $scope.$watch('state().isOpen',function(newVal, oldVal){
                    $scope.title = $scope.state().title;
                    $scope.body = $scope.state().body;
                    $scope.confirm = function(){
                        $scope.close();
                        $scope.state().callback();
                    };
                    if(newVal === true){
                        //open the modal
                        $scope.isopen = true;
                    }
                    else {
                        //close the modal
                        $scope.isopen = false;
                    }

                    $scope.close = function(){
                        YgModal.close();
                        $scope.isopen = false;
                    }
                });
            }
        }
    }]);