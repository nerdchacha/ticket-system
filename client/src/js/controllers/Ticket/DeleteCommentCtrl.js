angular.module('ticketSystem')
    .controller('DeleteCommentCtrl',['$scope','YgNotify','HelperFactory','YgModal','ActionFactory',
        function($scope, YgNotify, HelperFactory,YgModal,ActionFactory){
            var deleteCallback = function(ticket, comment){
                return function(){
                    ActionFactory.deleteComment(ticket,comment)
                        .then(function(res){
                            HelperFactory
                                .createFlashMessage(
                                    res,
                                    'The comment was deleted successfully')
                                .forEach(function(msg){
                                    YgNotify.alert(msg.class, msg.message, 5000);
                                })
                            if(!res.data.errors)
                                $scope.ticket.comments = res.data.comments;
                        })
                        .catch(function(error){
                            YgNotify.alert('danger', "An error occurred while trying to delete comment. Please try again later.", 5000);
                        });
                }
            };

            $scope.deleteComment = function(ticket, comment){
                YgModal.confirm(deleteCallback(ticket, comment));
                YgModal.open('Are you sure you want to do this?', 'This will delete the comment permanently');
            };
        }
    ]);