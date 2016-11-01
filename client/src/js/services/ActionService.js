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
            factory.getAllowedButtons = function(id){
                var deferred = $q.defer();
                $http.get('static/action-buttons/'+ id)
                .then(function(res){
                    var buttons = {};
                    buttons.assign = res.data.actionButtons.assign;
                    buttons.comment = res.data.actionButtons.comment;
                    buttons.changeStatus = res.data.actionButtons.changeStatus;
                    buttons.reopen = res.data.actionButtons.reopen;
                    buttons.close = res.data.actionButtons.close;
                    buttons.acknowledge = res.data.actionButtons.acknowledge;
                    buttons.awaitingUserResponse = res.data.actionButtons.awaitingUserResponse;
                    buttons.assignToSelf = res.data.actionButtons.assignToSelf;
                    deferred.resolve(buttons);
                })
                .catch(function(err){
                    deferred.reject(err);
                });

                return deferred.promise;     
            };
            //Admin related methods
            factory.assign = function(id,assignee,comment,notify){
                return $http.post('admin/tickets/assign/' + id, {assignee: assignee, comment: comment, notify: notify});
            };
            factory.changeStatus = function(id, status, comment,notify){
                return $http.post('admin/tickets/change-status/' + id, {status: status, comment: comment, notify: notify});
            };
            factory.awaitingUserResponse = function(id, comment,notify){
                return $http.post('admin/tickets/awaiting-user-response/' + id, {comment: comment, notify: notify});
            };
            factory.reopen = function(id, comment,notify){
                return $http.post('admin/tickets/re-open/' + id, {comment: comment, notify: notify});
            };
            factory.close = function(id, comment,notify){
                return $http.post('admin/tickets/close/' + id, {comment: comment, notify: notify});
            };
            factory.acknowledgeTicket = function(id,comment,notify){
                return $http.post('admin/tickets/acknowledge/' + id, {comment: comment, notify: notify});
            };

            //General methods
            factory.addComment = function(id, comment){
                return $http.post('tickets/addComment/' + id, {comment: comment});
            };
            factory.deleteComment = function(ticket,comment){
                return $http.delete('tickets/deleteComment/' + ticket._id + '?commentId=' + comment._id);
            };
            return factory;
        }]);