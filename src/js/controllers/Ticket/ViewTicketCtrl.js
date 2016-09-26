/**
 * Created by dell on 7/24/2016.
 */
angular.module('ticketSystem')
    .controller('ViewTicketCtrl',['$scope','$stateParams','$state','TicketFactory','YgNotify','Authentication','HelperFactory','YgModal','ActionFactory',
        function($scope, $stateParams, $state, TicketFactory, YgNotify, Authentication,HelperFactory,YgModal,ActionFactory){

            $scope.ticket = {};
            $scope.renderDate = function(date){
                return new Date(Date.parse(date)).toLocaleDateString();
            };
            $scope.edit = function(){
                $state.go('ticket-edit', {id: $scope.ticket.id});
            };

            //Create closure
            var deleteCallback = function(ticket, comment){
                return function(){
                    $scope.setLoading(true);
                    ActionFactory.deleteComment(ticket,comment)
                        .then(function(res){
                            $scope.ticket.comments = res.data.comments;
                            YgNotify.alert('success', "The comment was deleted successfully", 5000);
                            $scope.setLoading(false);
                        })
                        .catch(function(error){
                            YgNotify.alert('danger', "An error occurred while trying to delete comment. Please try again later.", 5000);
                            $scope.setLoading(false);
                        });
                }
            };

            $scope.deleteComment = function(ticket, comment){
                YgModal.confirm(deleteCallback(ticket, comment));
                YgModal.open('Are you sure you want to do this?', 'This will delete the comment permanently');
            };


            $scope.setLoading(true);
            TicketFactory.getTicketById($stateParams.id)
                .then(function(res){
                    if(res.data.errors){
                        $state.go('ticket.my-tickets');
                        var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                        errorMessage.forEach(function(error){
                            YgNotify.alert('danger', error, 5000);
                        });
                    }
                    else{
                        $scope.ticket = res.data;
                        $scope.ticket.assignee = !$scope.ticket.assignee ? 'Unassigned' : $scope.ticket.assignee;
                        $scope.ticket.createdDate = $scope.renderDate($scope.ticket.createdDate);
                        $scope.ticket.currentUser = Authentication.getUser().username;
                        //If current user is the assignee or if current user is ceator of ticket or if current user id admin/support
                        if($scope.ticket.assignee === $scope.ticket.currentUser || $scope.ticket.createdBy === $scope.ticket.currentUser || HelperFactory.isCurrentUserAdmin() || HelperFactory.isCurrentUserSupport())
                            $scope.showEdit = true;
                    }
                    $scope.setLoading(false);
                })
                .catch(function(error){
                    console.log(error);
                    YgNotify.alert('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000);
                    $scope.setLoading(false);
                });
        }]);