/**
 * Created by dell on 7/24/2016.
 */
angular.module('ticketSystem')
    .controller('ViewTicketCtrl',['$scope','$stateParams','$state','TicketFactory','YgNotify','Authentication','HelperFactory',
        function($scope, $stateParams, $state, TicketFactory, YgNotify, Authentication, HelperFactory){


            TicketFactory.getTicketById($stateParams.id)
            .then(function(res){
                HelperFactory
                    .createFlashMessage(
                        res)
                    .forEach(function(msg){
                        YgNotify.alert(msg.class, msg.message, 5000);
                    })

                if(!res.data.errors){
                    $scope.ticket = res.data.ticket;
                    $scope.ticket.description = HelperFactory.stripHtml($scope.ticket.description);
                    $scope.ticket.assignee = !$scope.ticket.assignee ? 'Unassigned' : $scope.ticket.assignee;
                    $scope.ticket.createdDate = $scope.renderDate($scope.ticket.createdDate);
                    $scope.ticket.currentUser = Authentication.getUser().username;
                    $scope.statusClass = setStatusClass($scope.ticket.status);
                    $scope.ticket.priority = $scope.ticket.priority || 'N.A';
                    $scope.priorityClass = setPriorityClass($scope.ticket.priority);
                    if(showEdit($scope.ticket))
                        $scope.showEdit = true;
                }
            })
            .catch(function(error){
                YgNotify.alert('danger', "An error occurred while trying to get ticket details. Please try again later.", 5000);
            });

            $scope.ticket = {};
            $scope.edit = function(){
                $state.go('ticket-edit', {id: $scope.ticket.id});
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

            $scope.renderDate = function(date){
                return new Date(Date.parse(date)).toLocaleDateString();
            };

        }]);