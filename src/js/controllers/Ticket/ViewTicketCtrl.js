/**
 * Created by dell on 7/24/2016.
 */
angular.module('ticketSystem')
    .controller('ViewTicketCtrl',['$scope','$stateParams','$state','TicketFactory','Flash','Authentication','HelperFactory','YgModal','ActionFactory',
        function($scope, $stateParams, $state, TicketFactory, Flash, Authentication,HelperFactory,YgModal,ActionFactory){

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
                    ActionFactory.deleteComment(ticket,comment)
                        .then(function(res){
                            console.log(res);
                            $scope.ticket.comments = res.data.comments;
                            Flash.create('success', "The comment was deleted successfully", 5000, {}, false);
                        })
                        .catch(function(error){
                            Flash.create('danger', "An error occurred while trying to delete comment. Please try again later.", 5000, {}, false);
                        });
                }
            };

            $scope.deleteComment = function(ticket, comment){
                YgModal.confirm(deleteCallback(ticket, comment));
                YgModal.open('Are you sure you want to do this?', 'This will delete the comment permanently');
            };

            TicketFactory.getTicketById($stateParams.id)
                .then(function(res){
                    if(res.data.errors){
                        $state.go('ticket.my-tickets');
                        Flash.create('danger', res.data.errors[0].msg, 4000, {}, false);
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
                })
                .catch(function(error){
                    console.log(error);
                    Flash.create('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000, {}, false);
                });
        }]);