/**
 * Created by dell on 7/22/2016.
 */
angular.module('ticketSystem')
    .controller('NewTicketCtrl',['$scope','$state','TicketFactory','Flash','CommonFactory','HelperFactory',
        function($scope,$state,TicketFactory,Flash,CommonFactory,HelperFactory){
            CommonFactory.getInitialStaticData()
                .then(function(res){
                    $scope.priorities = res.data.priorities.values;
                    $scope.types = res.data.types.values;
                    $scope.users = res.data.users;
                    $scope.newTicket.priority = $scope.priorities[0].value;
                    $scope.newTicket.type = $scope.types[0].value;
                    $scope.newTicket.assignee = $scope.users[0].username;
                });

            $scope.newTicket = {};
            $scope.toolbarConfig = [
                ['h1','p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                [],
                ['insertLink']
            ];

            $scope.save = function (){
                TicketFactory.createNewTicket({
                    title: $scope.newTicket.title,
                    description: $scope.newTicket.description,
                    type: $scope.newTicket.type
                })
                .then(function(res){
                        if(res.data.errors){
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            Flash.create('danger', errorMessage, 5000, {}, false);
                        }
                        else
                            $state.go('ticket-view',{id: res.data.id});
                },function(err){
                    Flash.create('danger', "An error occurred while trying to create new ticket. Please try again later.", 5000, {}, false);
                    console.log(err);
                    //set flash message
                });
            }
        }]);