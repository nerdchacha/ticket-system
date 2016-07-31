/**
 * Created by dell on 7/22/2016.
 */
angular.module('ticketSystem')
    .controller('NewTicketCtrl',function($scope,$location,TicketFactory,Flash,CommonFactory){

        CommonFactory.getInitialStaticData()
            .then(function(res){
                $scope.priorities = res.data.priorities.values;
                $scope.types = res.data.types.values;
                $scope.users = res.data.users;
                $scope.newTicket.priority = $scope.priorities[0].value;
                $scope.newTicket.type = $scope.types[0].value;
                $scope.newTicket.assignee = $scope.users[0].username;
            });

        $scope.newTicket = {};
        $scope.toolbarConfig = [
            ['h1','p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            [],
            ['insertLink']
        ];

        $scope.save = function (){
            TicketFactory.createNewTicket({
                title: $scope.newTicket.title,
                description: $scope.newTicket.description,
                priority: $scope.newTicket.priority,
                type: $scope.newTicket.type,
                assignee : $scope.newTicket.assignee
            })
            .then(function(res){
                    if(res.data.errors){
                        var msg ='<ul>';
                        for(var i in res.data.errors)
                            msg += "<li>" + res.data.errors[i].msg + "</li>";
                        msg += '</ul>'
                        Flash.create('danger', msg, 8000, {}, false);
                    }
                    else
                        $location.path('/ticket/view/' + res.data.id);
            },function(res){
                Flash.create('danger', "An error occurred while trying to create new ticket. Please try again later.", 5000, {}, false);
                console.log('An error occurred while trying to create new ticket');
                //set flash message
            });
        }
    });