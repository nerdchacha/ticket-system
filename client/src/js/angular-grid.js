angular.module('yangular-grid',['ui.bootstrap'])
    .factory('agSortFactory',['$http',
        function($http){
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
        }])
    .factory('pageFactory',
        function(){
            var ret = {};
            ret.GetPager = function(totalItems, currentPage, pageSize) {
                // default to first page
                currentPage = currentPage || 1;
         
                // default page size is 10
                pageSize = pageSize || 10;
         
                // calculate total pages
                var totalPages = Math.ceil(totalItems / pageSize);
         
                var startPage, endPage;
                if (totalPages <= 10) {
                    // less than 10 total pages so show all
                    startPage = 1;
                    endPage = totalPages;
                } else {
                    // more than 10 total pages so calculate start and end pages
                    if (currentPage <= 6) {
                        startPage = 1;
                        endPage = 10;
                    } else if (currentPage + 4 >= totalPages) {
                        startPage = totalPages - 9;
                        endPage = totalPages;
                    } else {
                        startPage = currentPage - 5;
                        endPage = currentPage + 4;
                    }
                }
         
                // calculate start and end item indexes
                var startIndex = (currentPage - 1) * pageSize;
                var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
         
                // create an array of pages to ng-repeat in the pager control
                var arr = new Array(endPage + 1 - startPage).fill(undefined);
                var pages = arr.map(function(val){ return startPage++; });
                //var pages = _.range(startPage, endPage + 1);
         
                // return object with all pager properties required by the view
                return {
                    totalItems: totalItems,
                    currentPage: currentPage,
                    pageSize: pageSize,
                    totalPages: totalPages,
                    startPage: startPage,
                    endPage: endPage,
                    startIndex: startIndex,
                    endIndex: endIndex,
                    pages: pages
                };
            }
            return ret;
        })
	.directive('yag',['agSortFactory','pageFactory','$timeout',
        function(agSortFactory,pageFactory,$timeout){
    		return{
    			restrict : 'E',
                replace: true,
                template :  '<div id="yag">'+
                                '<div ng-if="rows.length > 0"><div class="form-inline"><div class="form-group">Show <select class="form-control" ng-model="size" ng-change="changeSize(this)"><option value="10">10</option><option value="20">20</option><option value="30">30</option></select>  per page</div></div></div><br/>'+
                                '<table class="table table-responsive table-bordered table-striped">'+
                                    '<thead>'+
                                        '<tr yag-sort-head>'+
                                            '<th ng-repeat="col in config.columns" class="{{col.cssClass}}"><a yag-sort data-name="{{col.key}}" data-order="asc">{{col.name}} <i ng-class="{glyphicon : col.key === sort,\'glyphicon-sort-by-attributes\' : col.key === sort }"></i></a></th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                        '<tr ng-if="rows.length > 0" ng-repeat="row in rows" ng-click="rowClick(row)">'+
                                            '<td ng-repeat="col in config.columns"><i ng-class="col.renderClass(row[col.key])"></i><span ng-if="!col.render" data-toggle="tooltip" data-placement="top" title="{{row[col.key]}}">{{row[col.key]}}</span><span ng-if="col.render" data-toggle="tooltip" data-placement="top" title="{{col.render(row[col.key])}}">{{col.render(row[col.key])}}</span></td>'+
                                        '</tr>'+
                                        '<tr ng-if="rows.length === 0">'+
                                            '<td colspan="{{config.columns.length}}">No data available to display</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                    '<tfoot ng-if="rows.length > 0">'+
                                        '<tr><td colspan="{{config.columns.length}}">' +
                                        '<div>'+
                                                '<span ng-if="size * pager.currentPage - 1 < count" class="text-info">Showing {{size * (pager.currentPage - 1) + 1}} to {{size * pager.currentPage}} of {{count}}</span>'+
                                                '<span ng-if="size * pager.currentPage - 1 > count" class="text-info">Showing {{size * (pager.currentPage - 1) + 1}} to {{count}} of {{count}}</span>'+
                                            '</div>'+
                                        '</td></tr>'+
                                    '</tfoot>'+
                                '</table>'+
                                '<nav ng-if="rows.length > 0">'+
                                    '<ul ng-if="pager.pages.length" class="pagination">'+
                                        '<li ng-class="{disabled:pager.currentPage === 1}">'+
                                            '<a ng-click="setPage(1)">First</a>'+
                                        '</li>'+
                                        '<li ng-class="{disabled:pager.currentPage === 1}">'+
                                            '<a ng-click="setPage(pager.currentPage - 1)">Previous</a>'+
                                        '</li>'+
                                        '<li ng-repeat="page in pager.pages" ng-class="{active:pager.currentPage === page}">'+
                                            '<a ng-click="setPage(page)">{{page}}</a>'+
                                        '</li>'+               
                                        '<li ng-class="{disabled:pager.currentPage === pager.totalPages}">'+
                                            '<a ng-click="setPage(pager.currentPage + 1)">Next</a>'+
                                        '</li>'+
                                        '<li ng-class="{disabled:pager.currentPage === pager.totalPages}">'+
                                            '<a ng-click="setPage(pager.totalPages)">Last</a>'+
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
                        return $scope.pager.currentPage;
                    };
                    this.getPageSize = function(){
                        return $scope.size;
                    };
                    this.getRowObjectName = function(){
                        return $scope.config.objectName;
                    };
                    $scope.size = $scope.config.pageSize || "10";
                    agSortFactory.getRowsOnLoad()
                        .then(function(res){
                            readResponse(res);
                            initController();
                            if($scope.rows.length > 0){
                                $scope.order = 'asc';
                                $scope.sort = 'id';
                            }
                        })
                        .catch(function(err){
                        });
 
                    $scope.pager = {};
                    $scope.setPage = setPage;
                 
                    function initController() {
                        // initialize to page 1
                        $scope.setPage(1);
                    }
                 
                    function setPage(page) {
                        if (page < 1 || page > $scope.pager.totalPages) {
                            return;
                        }
                 
                        // get pager object from service
                        $scope.pager = pageFactory.GetPager($scope.count, page, $scope.size);
                    }

                    $scope.$watch('pager.currentPage',function(pageNumber, oldPageNumber){
                        if(oldPageNumber != pageNumber){
                            agSortFactory.getRows({order: $scope.order, sort: $scope.sort, page: pageNumber, size: $scope.size})
                            .then(function (res) {
                                readResponse(res);
                            })
                            .catch(function(err){
                            });
                        }
                    });

                    $scope.changeSize = function(ele){
                        $scope.size = ele.size;
                        $scope.pager = pageFactory.GetPager($scope.count, 1, $scope.size);
                        //$scope.pager.currentPage = 1;
                        agSortFactory.getRows({order: $scope.order, sort: $scope.sort, page: $scope.pager.currentPage, size: $scope.size})
                            .then(function (res) {
                                readResponse(res);
                            })
                            .catch(function(err){
                            });
                    }

                    $scope.rowClick = function(row){
                        if($scope.config.onRowClick)
                            $scope.config.onRowClick(row);
                    };

                    var readResponse = function(res){
                        $scope.rows = res.data[$scope.config.objectName];
                        $scope.count = res.data.count;
                        //$scope.currentPage = res.data.page;
                        $scope.size = res.data.size.toString();
                        $scope.totalPages = Math.ceil($scope.count/$scope.size);

                    }
                }
    		}
    	}])
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
	.directive('yagSort',['agSortFactory',
        function(agSortFactory){
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
                            })
                            .catch(function(err){
                            });
                    });
                }
            }
        }]);