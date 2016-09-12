/**
 * Created by dell on 7/18/2016.
 */
angular.module('ticketSystem')
    .directive('hdSortHead',function(){
/*        return{
            restrict : 'A',
            controller: function($scope,$element,$attrs){
                this.addCssClass = function(name,order){
                    var cssClass = order === 'asc' ? 'glyphicon glyphicon-sort-by-attributes' : 'glyphicon glyphicon-sort-by-attributes-alt';
                    var headers = $element.find('a');
                    for(var i=0;i<headers.length;i++) {
                        if(headers[i].getAttribute('data-name') === name){
                            headers[i].getElementsByTagName('i')[0].className = "";
                            headers[i].getElementsByTagName('i')[0].className = cssClass;
                        }
                        else{
                            headers[i].getElementsByTagName('i')[0].className = "";
                        }
                    };
                }
            }
        }*/
    })
    .directive('hdSort',function(TicketsFactory){
/*        return{
            restrict : 'A',
            require : '^hdSortHead',
            scope:{
                config: '='
            },
            link : function(scope,ele,attrs,sortHeadCtrl){
                ele.bind('click',function(){
                    var order = attrs.order;
                    var sort = attrs.name;
                    order = order === 'asc' ? 'desc' : 'asc';
                    TicketsFactory.getTickets({ order : order, sort : sort , page : scope.config.page})
                        .then(function(res){
                            scope.config.tickets = res.data.tickets;
                            attrs.$set('order',order);
                            sortHeadCtrl.addCssClass(sort,order);
                            scope.config.order = order;
                            scope.config.sort = sort;
                        });
                });
            }
        }*/
    });