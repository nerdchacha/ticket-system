/**
 * Created by dell on 7/24/2016.
 */
angular.module('ticketSystem')
    .controller('ViewTicketCtrl',function($scope, $stateParams,$state,TicketFactory,Flash,CommonFactory){
        CommonFactory.getInitialStaticData()
            .then(function(res){
                $scope.priorities = res.data.priorities.values;
                $scope.types = res.data.types.values;
                $scope.users = res.data.users;
                $scope.statuses = res.data.statuses.values;
            });
        $scope.toolbarConfig = [
            ['h1','p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            [],
            ['insertLink']
        ];
        $scope.showCommentPanel = false;
        $scope.ticket = {};
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
        $scope.edit = function(){
            $state.go('ticket-edit', {id: $scope.ticket.id});
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
        $scope.addComment = function(){
            TicketFactory.addComment($scope.ticket.id,{comment: $scope.ticket.newComment})
                .then(function(res){
                    $scope.ticket.comments = res.data.comments;
                    $scope.hideCommentPanelFn();
                })
                .catch(function(){
                    Flash.create('danger', "An error occurred while trying to add comment. Please try again later.", 5000, {}, false);
                });
        };
        TicketFactory.getTicketById($stateParams.id)
            .then(function(res){
                if(res.data.errors){
                    $state.go('ticket.my-tickets');
                    Flash.create('danger', res.data.errors[0].msg, 4000, {}, false);
                }
                else{
                    $scope.ticket = res.data
                }
            })
            .catch(function(error){
                console.log(error);
                Flash.create('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000, {}, false);
            });
    });