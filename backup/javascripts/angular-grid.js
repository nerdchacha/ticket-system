var app = angular.module('yangular-grid',[]);

app.factory('agSortFactory',function($http){
        var apiurl,sortQuerystringName,orderQuerystringName,pageQueryStringName,sizeQueryStringName;
        var ret = {};
        ret.setUrl = function(url){
            apiurl = url;
        };
        ret.setQuerystringNames = function(sort,order,page,size){
            sortQuerystringName = sort;
            orderQuerystringName = order;
            pageQueryStringName = page;
            sizeQueryStringName = size;
        };
        ret.getRowsOnLoad = function(){
            return $http.get(apiurl);
        };
        ret.getRows = function(query){
            return $http.get(apiurl + '?'+ sortQuerystringName +'=' + query.sort + '&'+ orderQuerystringName +'=' + query.order + '&'+ pageQueryStringName +'=' + query.page + '&' + sizeQueryStringName + '=' + query.size);
        };
        return ret;
    })
	.directive('yag',function(agSortFactory){
		return{
			restrict : 'E',
            replace: true,
            template :  '<div id="yag">'+
                            '<div><div class="form-inline"><div class="form-group">Show <select class="form-control" ng-model="size" ng-change="changeSize()"><option value="10">10</option><option value="20">20</option><option value="30">30</option></select>  per page</div></div></div><br/>'+
                            '<table class="table table-responsive table-bordered table-striped">'+
                                '<thead>'+
                                    '<tr yag-sort-head>'+
                                        '<th ng-repeat="col in config.columns" class="{{col.cssClass}}"><a yag-sort data-name="{{col.key}}" data-order="asc">{{col.name}} <i ng-class="{glyphicon : col.key === sort,\'glyphicon-sort-by-attributes\' : col.key === sort }"></i></a></th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody>'+
                                    '<tr ng-repeat="row in rows" ng-click="rowClick(row)">'+
                                        '<td ng-repeat="col in config.columns"><i ng-class="col.renderClass(row[col.key])"></i><span ng-if="!col.render" data-toggle="tooltip" data-placement="top" title="{{row[col.key]}}">{{row[col.key]}}</span><span ng-if="col.render" data-toggle="tooltip" data-placement="top" title="{{col.render(row[col.key])}}">{{col.render(row[col.key])}}</span></td>'+
                                    '</tr>'+
                                '</tbody>'+
                                '<tfoot>'+
                                    '<tr><td colspan="{{config.columns.length}}">' +
                                    '<div>'+
                                            '<span ng-if="size * currentPage < count" class="text-info">Showing {{size * (currentPage - 1) + 1}} to {{size * currentPage}} of {{count}}</span>'+
                                            '<span ng-if="size * currentPage > count" class="text-info">Showing {{size * (currentPage - 1) + 1}} to {{count}} of {{count}}</span>'+
                                        '</div>'+
                                    '</td></tr>'+
                                '</tfoot>'+
                            '</table>'+
                            '<nav>'+
                                '<ul class="pagination">'+
                                    '<li class="page-item" ng-class="{disabled : currentPage === 1}" ng-click="previous()">'+
                                        '<a class="page-link" aria-label="Previous">'+
                                            '<span aria-hidden="true">&laquo;</span>'+
                                            '<span class="sr-only">Previous</span>'+
                                        '</a>'+
                                    '</li>'+
                                    '<li class="page-item" ng-repeat="page in getPageList() track by $index" ng-class="{ active : currentPage == $index+1 }" ng-click="pageNumberClick($index+1)"><a class="page-link">{{$index+1}}</a></li>'+
                                    '<li class="page-item" ng-class="{disabled : currentPage === totalPages}" ng-click="next()">'+
                                        '<a class="page-link" aria-label="Next">'+
                                            '<span aria-hidden="true">&raquo;</span>'+
                                            '<span class="sr-only">Next</span>'+
                                        '</a>'+
                                    '</li>'+
                                '</ul>'+
                            '</nav>'+
                        '<div>',
            scope:{
                config: '='
            },
            controller: function($scope,$element,$attrs){
                agSortFactory.setUrl($scope.config.url);
                agSortFactory.setQuerystringNames($scope.config.sortQuerystringParam, $scope.config.orderQuerystringParam, $scope.config.pageQuerystringParam, $scope.config.sizeQuerystringParam);
                this.setOrder = function(order){
                    $scope.order = order;
                };
                this.setSort = function(sort){
                    $scope.sort = sort
                };
                this.setRows = function(rows){
                    $scope.rows = rows;
                };
                this.getCurrentPage = function(){
                    return $scope.currentPage;
                };
                this.getPageSize = function(){
                    return $scope.size;
                };
                this.getRowObjectName = function(){
                    return $scope.config.objectName;
                };
                $scope.size = "10";
                agSortFactory.getRowsOnLoad().then(function(res){
                    readResponse(res);
                    if($scope.rows.length > 0){
                        $scope.order = 'asc';
                        $scope.sort = 'id';
                    }
                });

                $scope.getPageList = function(){
                    return new Array($scope.totalPages);
                };

                $scope.next = function(){
                    if($scope.currentPage === $scope.totalPages)
                        return;
                    else {
                        agSortFactory.getRows({order : $scope.order, sort : $scope.sort , page : $scope.currentPage + 1, size: $scope.size})
                            .then(function(res){
                                readResponse(res);
                            });
                    }
                };

                $scope.previous = function(){
                    if($scope.currentPage === 1)
                        return;
                    else{
                        agSortFactory.getRows({order : $scope.order, sort : $scope.sort , page : $scope.currentPage - 1, size: $scope.size})
                            .then(function(res){
                                readResponse(res);
                            });
                    }
                };

                $scope.pageNumberClick = function(pageNumber) {
                    if (pageNumber === $scope.currentPage) {
                        return;
                    }
                    else {
                        agSortFactory.getRows({order: $scope.order, sort: $scope.sort, page: pageNumber, size: $scope.size})
                            .then(function (res) {
                                readResponse(res);
                            });
                    }
                };

                $scope.changeSize = function(){
                    $scope.currentPage = 1;
                    agSortFactory.getRows({order: $scope.order, sort: $scope.sort, page: $scope.currentPage, size: $scope.size})
                        .then(function (res) {
                            readResponse(res);
                        });
                }

                $scope.rowClick = function(row){
                    if($scope.config.onRowClick)
                        $scope.config.onRowClick(row);
                };

                var readResponse = function(res){
                    $scope.rows = res.data[$scope.config.objectName];
                    $scope.count = res.data.count;
                    $scope.currentPage = res.data.page;
                    $scope.size = res.data.size.toString();
                    $scope.totalPages = Math.ceil($scope.count/$scope.size);

                }
            }
		}
	})
	.directive('yagSortHead',function(){
        return{
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
                    }
                }
            }
        }
    })
	.directive('yagSort',function(agSortFactory){
        return{
            restrict : 'A',
            require : ['^yagSortHead','^^yag'],
            scope:{
                config: '='
            },
            link : function(scope,ele,attrs,controllers){
                var yagSortHeadCtrl = controllers[0];
                var yagCtrl = controllers[1];
                ele.bind('click',function(){
                    var order = attrs.order;
                    var sort = attrs.name;
                    order = order === 'asc' ? 'desc' : 'asc';
                    agSortFactory.getRows({ order : order, sort : sort , page : yagCtrl.getCurrentPage(), size: yagCtrl.getPageSize()})
                        .then(function(res){
                            yagCtrl.setRows(res.data[yagCtrl.getRowObjectName()]);
                            attrs.$set('order',order);
                            yagSortHeadCtrl.addCssClass(sort,order);
                            yagCtrl.setOrder(order);
                            yagCtrl.setSort(sort);
                        });
                });
            }
        }
    });