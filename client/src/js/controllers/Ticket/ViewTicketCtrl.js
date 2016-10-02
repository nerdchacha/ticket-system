/**
 * Created by dell on 7/24/2016.
 */
angular.module('ticketSystem')
    .controller('ViewTicketCtrl',['$scope','$stateParams','$state','TicketFactory','YgNotify','Authentication','HelperFactory','YgModal','ActionFactory',
        function($scope, $stateParams, $state, TicketFactory, YgNotify, Authentication,HelperFactory,YgModal,ActionFactory){

            HelperFactory.setLoading(true);

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
                    $scope.ticket.description = HelperFactory.stripHtml($scope.ticket.description);
                    $scope.ticket.assignee = !$scope.ticket.assignee ? 'Unassigned' : $scope.ticket.assignee;
                    $scope.ticket.createdDate = renderDate($scope.ticket.createdDate);
                    $scope.ticket.currentUser = Authentication.getUser().username;
                    $scope.statusClass = setStatusClass($scope.ticket.status);
                    $scope.ticket.priority = $scope.ticket.priority || 'N.A';
                    $scope.priorityClass = setPriorityClass($scope.ticket.priority);
                    if(showEdit($scope.ticket))
                        $scope.showEdit = true;
                    HelperFactory.setLoading(false);
                }
            })
            .catch(function(error){
                YgNotify.alert('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000);
                HelperFactory.setLoading(false);
            });

            $scope.ticket = {};
            $scope.edit = function(){
                $state.go('ticket-edit', {id: $scope.ticket.id});
            };

            //TODO: Move to different conntroller
            var deleteCallback = function(ticket, comment){
                return function(){
                    HelperFactory.setLoading(true);
                    ActionFactory.deleteComment(ticket,comment)
                        .then(function(res){
                            $scope.ticket.comments = res.data.comments;
                            YgNotify.alert('success', "The comment was deleted successfully", 5000);
                            HelperFactory.setLoading(false);
                        })
                        .catch(function(error){
                            YgNotify.alert('danger', "An error occurred while trying to delete comment. Please try again later.", 5000);
                            HelperFactory.setLoading(false);
                        });
                }
            };

            $scope.deleteComment = function(ticket, comment){
                YgModal.confirm(deleteCallback(ticket, comment));
                YgModal.open('Are you sure you want to do this?', 'This will delete the comment permanently');
            };



            function setLabelClass(value, config){
                value = value || '';
                config.success  = config.success || '';
                config.warning  = config.warning || '';
                config.danger   = config.danger || '';
                config.info     = config.info || '';

                switch(value.toLowerCase()){
                    case config.success.toLowerCase():
                        return 'success';
                    case config.warning.toLowerCase():
                        return 'warning';
                    case config.danger.toLowerCase():
                        return 'danger';
                    case config.info.toLowerCase():
                        return 'info';
                    default:
                        return 'info';
                }
            }

            function setStatusClass(status){
                return setLabelClass(
                        status,
                        {
                            success:    'in-progress',
                            warning:    'open',
                            info:       'new',
                            danger:     'resolved'
                        });
            }

            function setPriorityClass(priority){
                return setLabelClass(
                        priority,
                        {
                            success:    'low',
                            warning:    'medium',
                            danger:     'high'
                        });
            }

            function showEdit(ticket){
                //If current user is the assignee or if current user is ceator of ticket or if current user id admin/support
                if(ticket.assignee === ticket.currentUser)
                    return true;
                if(ticket.createdBy === ticket.currentUser)
                    return true;
                if(HelperFactory.isCurrentUserAdmin())
                    return true;
                if(HelperFactory.isCurrentUserSupport())
                    return true;
                return false;

            }

            function renderDate(date){
                return new Date(Date.parse(date)).toLocaleDateString();
            };

        }]);