/**
 * Created by dell on 7/24/2016.
 */
angular.module('ticketSystem')
    .controller('ViewTicketCtrl',['$scope','$stateParams','$state','TicketFactory','Flash','Authentication',
        function($scope, $stateParams, $state, TicketFactory, Flash, Authentication){

            $scope.ticket = {};
            $scope.renderDate = function(date){
                return new Date(Date.parse(date)).toLocaleDateString();
            };
            $scope.edit = function(){
                $state.go('ticket-edit', {id: $scope.ticket.id});
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
                    }
                })
                .catch(function(error){
                    console.log(error);
                    Flash.create('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000, {}, false);
                });
        }])
    .controller('CommentCtrl',['$scope','$window','YgModal','TicketFactory','Flash',
        function($scope, $window, YgModal, TicketFactory, Flash){

        /*$scope.showTaskPanel = false;

        $scope.showCommentPanelFn = function(){
            $scope.showTaskPanel = true;
        };

        $scope.hideCommentPanelFn = function(){
            $scope.ticket.newComment = '';
            $scope.showTaskPanel = false;
        };

        //Create closure
        var deleteCallback = function(ticket, comment){
            return function(){
                TicketFactory.deleteComment(ticket,comment)
                    .then(function(res){
                        console.log(res);
                        $scope.ticket.comments = res.data.comments;
                        Flash.create('success', "The comment was deleted successfully", 5000, {}, false);
                    })
                    .catch(function(error){
                        Flash.create('danger', "An error occurred while trying to delete comment. Please try again later.", 5000, {}, false);
                    })
                    .finally(function(){
                        //Scroll to top of page
                        $window.scrollTo(0, 0);
                    });
            }
        };

        $scope.deleteComment = function(ticket, comment){
            YgModal.confirm(deleteCallback(ticket, comment));
            YgModal.open('Are you sure you want to do this?', 'This will delete the comment permanently');
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
        };*/
    }]);