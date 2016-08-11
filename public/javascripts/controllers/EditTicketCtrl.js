/**
 * Created by dell on 7/27/2016.
 */
angular.module('ticketSystem')
    .controller('EditTicketCtrl',function($scope,$stateParams,$state,TicketFactory,Flash,CommonFactory,HelperFactory,Authentication){
        $scope.toolbarConfig = [
            ['h1','p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            [],
            ['insertLink']
        ];

        $scope.cancel = function(){
            $state.go('ticket-view', {id: $scope.ticket.id});
        };
        $scope.renderDate = function(date){
            return new Date(Date.parse(date)).toLocaleDateString();
        };
        $scope.showCommentPanelFn = function(){
            $scope.showCommentPanel = true;
        };
        $scope.hideCommentPanelFn = function(){
            $scope.ticket.newComment = '';
            $scope.showCommentPanel = false;
        };
        $scope.addComment = function(){
            TicketFactory.addComment(ticketId,{comment: $scope.ticket.newComment})
                .then(function(res){
                    $scope.ticket.comments = res.data.comments;
                    $scope.hideCommentPanelFn();
                })
                .catch(function(){
                    Flash.create('danger', "An error occurred while trying to add comment. Please try again later.", 5000, {}, false);
                });
        };
        $scope.deleteComment = function(ticket,comment){
            TicketFactory.deleteComment(ticket,comment)
                .then(function(res){
                    $scope.ticket.comments = res.data.comments;
                    Flash.create('success', "The comment was deleted successfully", 5000, {}, false);
                })
                .catch(function(error){
                    Flash.create('danger', "An error occurred while trying to delete comment. Please try again later.", 5000, {}, false);
                });
        };
        $scope.showCommentPanel = false;
        TicketFactory.getTicketById($stateParams.id)
            .then(function(res){
                if(res.data.errors){
                    $state.go('ticket.my-tickets');
                    var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                    Flash.create('danger', errorMessage, 4000, {}, false);
                }
                else{
                    $scope.ticket = res.data;
                    $scope.ticket.currentUser = Authentication.getUser().username;
                    TicketFactory.getInitialTicketData($scope.ticket.status)
                        .then(function(res){
                            $scope.priorities = res.data.priorities.values;
                            $scope.types = res.data.types.values;
                            $scope.users = res.data.users;
                            $scope.statuses = res.data.statuses;
                        })
                        .catch(function(err){
                            console.log(err);
                            Flash.create('danger', "An error occurred while trying to detch the static data.", 5000, {}, false);
                        });
                }
            })
            .catch(function(error){
                console.log(error);
                Flash.create('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000, {}, false);
            });

        $scope.update = function(){
            TicketFactory.updateTicket($scope.ticket._id, $scope.ticket).
                then(function(res){
                    $scope.ticket = res.data;
                    Flash.create('success', "Ticket updated successfully.", 5000, {}, false);
                    $state.go('ticket-view', {id : res.data.id});
                })
                .catch(function(err){
                    console.log(err);
                    Flash.create('danger', "An error occurred while trying to update ticket details. Please try again later.", 5000, {}, false);
                });
        };

/*        CommonFactory.getInitialStaticData()
            .then(function(res){
                $scope.priorities = res.data.priorities.values;
                $scope.types = res.data.types.values;
                $scope.users = res.data.users;
                $scope.statuses = res.data.statuses.values;
            });*/
    });