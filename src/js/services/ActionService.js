angular.module('ticketSystem')
    .factory('ActionFactory',['$http','$q',
        function($http, $q){
            var taskName;
            var factory = {};
            factory.setTask = function(name){
                taskName = name;
            };
            factory.getTask = function(){
                return taskName;
            };
            factory.getAssignees = function(){
                return $http.get('static/all-users');
            };
            factory.getAllowedStatus = function(currentStatus){
              return $http.get('static/allowed-status/'+ currentStatus);  
            };
            factory.getAllowedButtons = function(currentStatus){
                var deferred = $q.defer();
                $http.get('static/action-buttons/'+ currentStatus)
                .then(function(res){
                    var buttons = {};
                    buttons.assign = res.data.actionButtons.assign;
                    buttons.comment = res.data.actionButtons.comment;
                    buttons.changeStatus = res.data.actionButtons.changeStatus;
                    buttons.reopen = res.data.actionButtons.reopen;
                    buttons.close = res.data.actionButtons.close;
                    buttons.acknowledge = res.data.actionButtons.acknowledge;
                    buttons.awaitingUserResponse = res.data.actionButtons.awaitingUserResponse;
                    deferred.resolve(buttons);
                })
                .catch(function(err){
                    deferred.reject(err);
                });

                return deferred.promise;     
            };
            factory.assign = function(id,assignee,comment){
                return $http.post('tickets/assign/' + id, {assignee: assignee, comment: comment});
            };
            factory.changeStatus = function(id, status, comment){
                return $http.post('tickets/change-status/' + id, {status: status, comment: comment});
            }
            factory.awaitingUserResponse = function(id, comment){
                return $http.post('tickets/awaiting-user-response/' + id, {comment: comment});
            }
            factory.reopen = function(id, comment){
                return $http.post('tickets/re-open/' + id, {comment: comment});
            }
            factory.close = function(id, comment){
                return $http.post('tickets/close/' + id, {comment: comment});
            }
            factory.addComment = function(id, comment){
                return $http.post('tickets/addComment/' + id, {comment: comment});
            };
            factory.deleteComment = function(ticket,comment){
                return $http.delete('tickets/deleteComment/' + ticket._id + '?commentId=' + comment._id);
            };
            factory.acknowledgeTicket = function(id,comment){
                return $http.post('tickets/acknowledge/' + id, {comment: comment});
            };
            return factory;
        }]);