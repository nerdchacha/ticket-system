/**
 * Created by dell on 8/5/2016.
 */
angular.module('ticketSystem')
    .factory('HelperFactory',function(){
        var fact = {};
        fact.createErrorMessage = function(errors){
            var errorMessage = '';
            for(var i = 0; i < errors.length; i++){
                errorMessage += errors[i].error + '<br/>'
            }
            return errorMessage;
        };
        return fact;
    });