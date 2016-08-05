/**
 * Created by dell on 7/27/2016.
 */
angular.module('ticketSystem')
    .controller('EditTicketCtrl',function($scope,$routeParams,$location,TicketFactory,Flash,CommonFactory,HelperFactory){
        $scope.toolbarConfig = [
            ['h1','p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            [],
            ['insertLink']
        ];

        $scope.cancel = function(){
            $location.path('/ticket/view/' + $scope.ticket.id);
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

        TicketFactory.getTicketById($routeParams.id)
            .then(function(res){
                if(res.data.errors){
                    $location.path('/');
                    var errorMessage = HelperFactory.createErrorMessage(res.data.errors);
                    Flash.create('danger', errorMessage, 4000, {}, false);
                }
                else{
                    $scope.ticket = res.data
                }
            })
            .catch(function(error){
                console.log(error);
                Flash.create('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000, {}, false);
            });

        CommonFactory.getInitialStaticData()
            .then(function(res){
                $scope.priorities = res.data.priorities.values;
                $scope.types = res.data.types.values;
                $scope.users = res.data.users;
            });
    });