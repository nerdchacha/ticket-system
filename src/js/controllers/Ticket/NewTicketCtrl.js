/**
 * Created by dell on 7/22/2016.
 */
angular.module('ticketSystem')
    .controller('NewTicketCtrl',['$scope','$state','TicketFactory','YgNotify','CommonFactory','HelperFactory',
        function($scope,$state,TicketFactory,YgNotify,CommonFactory,HelperFactory){
            CommonFactory.getInitialStaticData()
                .then(function(res){
                    // $scope.priorities = res.data.priorities.values;
                    $scope.types = res.data.types.values;
                    // $scope.users = res.data.users;
                    // $scope.newTicket.priority = $scope.priorities[0].value;
                    $scope.newTicket.type = $scope.types[0].value;
                    // $scope.newTicket.assignee = $scope.users[0].username;
                });

            $scope.newTicket = {};
            $scope.toolbarConfig = [
                ['h1','p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                [],
                ['insertLink']
            ];

            var validateForm = function(){
                if(!$scope.newTicket.title)
                    return false;
                if(!$scope.newTicket.description)
                    return false;
                if(!$scope.newTicket.type)
                    return false;
            }

            $scope.save = function (){
                //Do not submit form if form is invalid
                if($scope.newTicketForm.$invalid){
                    $scope.newTicketForm.title.$touched = true;
                    $scope.newTicketForm.description.$touched = true;
                    return;
                }
                TicketFactory.createNewTicket({
                    title: $scope.newTicket.title,
                    description: $scope.newTicket.description,
                    type: $scope.newTicket.type
                })
                .then(function(res){
                        if(res.data.errors){
                            var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                            errorMessage.forEach(function(error){
                                YgNotify.alert('danger', error, 5000);
                            });
                        }
                        else
                            $state.go('ticket-view',{id: res.data.id});
                },function(err){
                    YgNotify.alert('danger', "An error occurred while trying to create new ticket. Please try again later.", 5000);
                    console.log(err);
                });
            }
        }]);