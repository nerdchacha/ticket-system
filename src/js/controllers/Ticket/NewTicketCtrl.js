/**
 * Created by dell on 7/22/2016.
 */
angular.module('ticketSystem')
    .controller('NewTicketCtrl',['$scope','$state','TicketFactory','YgNotify','CommonFactory','HelperFactory',
        function($scope,$state,TicketFactory,YgNotify,CommonFactory,HelperFactory){
            CommonFactory.getInitialStaticData()
                .then(function(res){
                    $scope.newTicket.types = res.data.types.values;
                    $scope.newTicket.type = $scope.newTicket.types[0].value;
                });

            $scope.newTicket = {};
            $scope.toolbarConfig = [
                ['h1','p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                [],
                ['insertLink']
            ];

            $scope.save = function (){
                //Validate required fields
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