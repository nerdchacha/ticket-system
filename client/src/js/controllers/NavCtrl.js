
angular.module('ticketSystem')
    .controller('NavCtrl',['$scope',
            function($scope){
            $scope.navClass = '';
            $scope.toggleNav = function(e){
                var ele = angular.element(e.target)
                if(!ele.hasClass('is-open')){
                    $scope.navClass = 'is-open';
                }
                else
                    $scope.navClass = 'is-close';
            }

            $scope.navClick = function(e){
                $scope.navClass =  e.target.tagName.toLowerCase() === 'a' ? 'is-close' : $scope.navClass;
            }
        }
    ]);