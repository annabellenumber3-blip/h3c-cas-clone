angular.module('app.gridservice',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services'])
.factory('GridService', function($http , $modal ,$state, $rootScope, $translate,UtilService){
	
	//=================================
	return {
		/**
		 * divId  列表的div的id
		 * **/
		grid : function($scope, url, params, pagesizeArr,pagesize, divId) {
			 $scope.pageing = true; //标记是否分页
			 $scope.myData = [];
			 $scope.mySelections = [];
			 $scope.filterOptions = {
				        filterText: "",
				        useExternalFilter: false
		     };
			 if (url) {
				 $scope.url = url;
			 }
			 if (angular.isObject(params)) {
				 $scope.params = params;
			 }
			 $scope.totalServerItems = 0;
			 if ((pagesizeArr instanceof Array) && typeof pagesize == 'number') {
				 $scope.pagingOptions = {
					 pageSizes: pagesizeArr, //page Sizes
					 pageSize: pagesize, //Size of Paging data
					 currentPage: 1 //what page they are currently on
				 };
			 } else {
				 $scope.pagingOptions = {
						 pageSizes: [10, 20, 30, 40 ,50, 100, 200], //page Sizes
						 pageSize: 30, //Size of Paging data
						 currentPage: 1 //what page they are currently on
				 };
			 }
		    $scope.setPagingData = function(result){	
//		        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		    	if ($scope.gridOptions && angular.isArray($scope.gridOptions.selectedItems)) {
		    		$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);//移除被选项		    		
		    	}
		    	if (angular.isArray(result)) {
		    		 $scope.myData = result;
				     $scope.totalServerItems = result.length;
		    	} else {
		    		 $scope.myData = result.data;
				     $scope.totalServerItems = result.totalLength;
		    	}
		        if (!$rootScope.$$phase && !$scope.$$phase) {
		            $scope.$apply();
		        }
		        if ($scope.gridOptions && angular.isArray($scope.gridOptions.selectedItems)) {
		    		$scope.gridOptions.$gridScope.selectionProvider.toggleSelectAll(false,true);		    		
		    	}
		    };
		    //带有分页的查询
		    $scope.getPagedDataAsync = function (pageSize, page, selectFirstRow) {
		    	$scope.pageing = true;
		    	if (!page) {
		    		page = 1;
		    	}
		    	if ($scope.params) {
		    		$scope.params.limit= pageSize;
		    		$scope.params.offset = (page - 1) * pageSize;
		    	} else {
		    		$scope.params = {"limit":pageSize,"offset" : page-1};
		    	}
		    	$scope.getData($scope.params, selectFirstRow);
		    };
		    //不带分页的查询
		    $scope.getDataAsync = function (selectFirstRow) {
		    	$scope.pageing = false;
		    	if (!$scope.params) {
	        		$scope.params = {};
	        	} 
		    	$scope.getData($scope.params, selectFirstRow);
		    };
		    $scope.getData = function (params, selectFirstRow) {
		        setTimeout(function () {
		            var data;
		            var areaDivId;
		            if (angular.isDefined(divId)) {
		            	 areaDivId = UtilService.areawait(divId);
		            } 
//		            var waitModal = UtilService.wait();
		            $http({
		            	method: 'GET',
		            	url: $scope.url,
		            	params: params
		            }).success(function (result) {
//		            	waitModal.dismiss();
		            	if (angular.isDefined(areaDivId)) {
		            		UtilService.dismissAreawait(areaDivId);
				        } 
		            	if ((angular.isArray(result) || angular.isArray(result.data)) || result.success == true) {
		            		$scope.setPagingData(result);
		            		//callback after load
		            		if (angular.isFunction($scope.afterLoad) && (result.length >= 0 || (angular.isArray(result.data) && result.data.length >= 0))) {
		            			$scope.afterLoad.apply();
		            		}
		            	}
		            	if (result.success != true) {
		            		$rootScope.$broadcast(constant.onQueryGridError);
		            	}
		            	UtilService.handleResult(result);
		            }).error(function(response, code, headers, config) {
//			        	waitModal.dismiss();
		            	if (angular.isDefined(areaDivId)) {
		            		UtilService.dismissAreawait(areaDivId);
				        } 
			        	UtilService.handleError(code);
			        });
		            
		        });
		    };
		    if (!$scope.pagingOptionsWatch) {
		        $scope.pagingOptionsWatch = $scope.$watch('pagingOptions', function (newVal, oldVal) {
			    	if (newVal !== oldVal) {
			    	    //修改页面大小时，将当前页重置为1。
			    	    if (newVal.pageSize !== oldVal.pageSize) {
			    	        $scope.pagingOptions.currentPage = 1;
			    	        if ($scope.gridOptions && angular.isArray($scope.gridOptions.selectedItems)) {
			    	        	if (angular.isFunction($scope.gridOptions.selectAll)) {
			    	        	 	$scope.gridOptions.selectAll(false);
			    	        	}
			    	        }
			    	    }
			    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
			    	}
			    }, true);
		    }
		    if (!$scope.filterOptionsWatch) {
			    $scope.filterOptionsWatch = $scope.$watch('filterOptions', function (newVal, oldVal) {
			    	if (newVal !== oldVal) {
			    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
			    	}
			    }, true);
		    }
		    //刷新表格当前页数据
		    $scope.refreshPage = function() {
		    	if ($scope.pageing == true) {
		    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		    	} else {
		    		$scope.getDataAsync();
		    	}
		    };
			return $scope;
		},
		grid2 : function($scope, url, params, pagesizeArr,pagesize, divId) {
			$scope.pageing2 = true;
			$scope.myData2 = [];
			$scope.mySelections2 = [];
			$scope.filterOptions2 = {
					filterText: "",
					useExternalFilter: false
			};
			$scope.totalServerItems2 = 0;
			if (url) {
				$scope.url2 = url;
			}
			if (angular.isObject(params)) {
				 $scope.params2 = params;
			}
			if ((pagesizeArr instanceof Array) && typeof pagesize == 'number') {
				$scope.pagingOptions2 = {
						pageSizes: pagesizeArr, //page Sizes
						pageSize: pagesize, //Size of Paging data
						currentPage: 1 //what page they are currently on
				};
			} else {
				$scope.pagingOptions2 = {
						pageSizes: [10, 20, 30, 40 ,50, 100, 200], //page Sizes
						pageSize: 30, //Size of Paging data
						currentPage: 1 //what page they are currently on
				};
			}
			$scope.setPagingData2 = function(result){	
	//	        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
				if ($scope.gridOptions2 && angular.isArray($scope.gridOptions2.selectedItems)) {
		    		$scope.gridOptions2.selectedItems.splice(0, $scope.gridOptions2.selectedItems.length);//移除被选项
		    	}
				if (angular.isArray(result)) {
					 $scope.myData2 = result;
				     $scope.totalServerItems2 = result.length;
				} else {
					$scope.myData2 = result.data;
					$scope.totalServerItems2 = result.totalLength;					
				}
				if (!$rootScope.$$phase && !$scope.$$phase) {
					$scope.$apply();
				}
		        if ($scope.gridOptions2 && angular.isArray($scope.gridOptions2.selectedItems2)) {
		    		$scope.gridOptions2.$gridScope.selectionProvider.toggleSelectAll(false,true);		    		
		    	}
			};			
			$scope.getPagedDataAsync2 = function (pageSize, page,searchText) {
				$scope.pageing2 = true;
				if ($scope.params2) {
					$scope.params2.limit= pageSize;
					$scope.params2.offset = (page - 1) * pageSize;
				} else {
					$scope.params2 = {"limit":pageSize,"offset" : page-1};
				}
				$scope.getData2($scope.params2, searchText);
			};
			$scope.getDataAsync2 = function (searchText) {
				$scope.pageing2 = false;
		    	if (!$scope.params2) {
	        		$scope.params2 = {};
	        	} 
				$scope.getData2($scope.params2, searchText);
			}
			$scope.getData2 = function (params2,searchText) {
				setTimeout(function () {
					var data;
//					var waitModal = UtilService.wait();
					var areaDivId;
					if (angular.isDefined(divId)) {
		            	 areaDivId = UtilService.areawait(divId);
		            } 
					if (searchText) {
						var ft = searchText.toLowerCase();
						$http({
							method: 'GET',
							url: $scope.url2,
							params: $scope.params2
						}).success(function (result) {	
//							waitModal.dismiss();
							if (angular.isDefined(areaDivId)) {
			            		UtilService.dismissAreawait(areaDivId);
					        } 
							var resultData = result.data;
							data = resultData.filter(function(item) {
								return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
							});
							$scope.setPagingData2(result);
						}).error(function(response, code, headers, config) {
//				        	waitModal.dismiss();
							if (angular.isDefined(areaDivId)) {
								UtilService.dismissAreawait(areaDivId);
				            } 
				        	UtilService.handleError(code);
				        });            
					} else {
						$http({
							method: 'GET',
							url: $scope.url2,
							params: $scope.params2
						}).success(function (result) {
//							waitModal.dismiss();
							if (angular.isDefined(areaDivId)) {
								UtilService.dismissAreawait(areaDivId);
				            } 
							if ((angular.isArray(result) || angular.isArray(result.data)) || result.success == true) {
								$scope.setPagingData2(result);
								//callback after load
			            		if (angular.isFunction($scope.afterLoad2) && (result.length >= 0 || (angular.isArray(result.data) && result.data.length >= 0))) {
									$scope.afterLoad2.apply();
								}
							}
							UtilService.handleResult(result);						
						}).error(function(response, code, headers, config) {
//				        	waitModal.dismiss();
							if (angular.isDefined(areaDivId)) {
			            		UtilService.dismissAreawait(areaDivId);
					        } 
				        	UtilService.handleError(code);
				        });
					}
				});
			};
			$scope.$watch('pagingOptions2', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					//修改页面大小时，将当前页重置为1。
					if (newVal.pageSize !== oldVal.pageSize) {
						$scope.pagingOptions2.currentPage = 1;
					}
					$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
				}
			}, true);
			$scope.$watch('filterOptions2', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
				}
			}, true);
			
			//刷新表格当前页数据
			$scope.refreshPage2 = function() {
				if ($scope.pageing2 == true) {
					$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
				} else {
					$scope.getDataAsync2();
				}
			};
			return $scope;
		},
		noMaskGrid : function($scope, url, params, pagesizeArr,pagesize) {
			 $scope.pageing = true; //标记是否分页
			 $scope.myData = [];
			 $scope.mySelections = [];
			 $scope.filterOptions = {
				        filterText: "",
				        useExternalFilter: false
		     };
			 if (url) {
				 $scope.url = url;
			 }
			 if (angular.isObject(params)) {
				 $scope.params = params;
			 }
			 $scope.totalServerItems = 0;
			 if ((pagesizeArr instanceof Array) && typeof pagesize == 'number') {
				 $scope.pagingOptions = {
					 pageSizes: pagesizeArr, //page Sizes
					 pageSize: pagesize, //Size of Paging data
					 currentPage: 1 //what page they are currently on
				 };
			 } else {
				 $scope.pagingOptions = {
						 pageSizes: [10, 20, 30, 40 ,50, 100, 200], //page Sizes
						 pageSize: 30, //Size of Paging data
						 currentPage: 1 //what page they are currently on
				 };
			 }
		    $scope.setPagingData = function(result){	
//		        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		    	if (angular.isArray(result)) {
		    		 $scope.myData = result;
				     $scope.totalServerItems = result.length;
		    	} else {
		    		 $scope.myData = result.data;
				     $scope.totalServerItems = result.totalLength;
		    	}
		        if (!$rootScope.$$phase && !$scope.$$phase) {
		            $scope.$apply();
		        }
		    };
		    //带有分页的查询
		    $scope.getPagedDataAsync = function (pageSize, page, selectFirstRow) {
		    	$scope.pageing = true;
		    	if ($scope.params) {
		    		$scope.params.limit= pageSize;
		    		$scope.params.offset = (page - 1) * pageSize;
		    	} else {
		    		$scope.params = {"limit":pageSize,"offset" : page-1};
		    	}
		    	$scope.getData($scope.params, selectFirstRow);
		    };
		    //不带分页的查询
		    $scope.getDataAsync = function (selectFirstRow) {
		    	$scope.pageing = false;
		    	if (!$scope.params) {
	        		$scope.params = {};
	        	} 
		    	$scope.getData($scope.params, selectFirstRow);
		    };
		    $scope.getData = function (params, selectFirstRow) {
		        setTimeout(function () {
		            var data;
		            $http({
		            	method: 'GET',
		            	url: $scope.url,
		            	params: params
		            }).success(function (result) {
		            	if ((angular.isArray(result) || angular.isArray(result.data)) || result.success == true) {
		            		$scope.setPagingData(result);
		            		//callback after load
		            		if (angular.isFunction($scope.afterLoad) && (result.length >= 0 || (angular.isArray(result.data) && result.data.length >= 0))) {
		            			$scope.afterLoad.apply();
		            		}
		            	}
		            	UtilService.handleResult(result);
		            }).error(function(response, code, headers, config) {
			        	UtilService.handleError(code);
			        });
		            
		        });
		    };
		    $scope.$watch('pagingOptions', function (newVal, oldVal) {
		    	if (newVal !== oldVal) {
		    	    //修改页面大小时，将当前页重置为1。
		    	    if (newVal.pageSize !== oldVal.pageSize) {
		    	        $scope.pagingOptions.currentPage = 1;
		    	    }
		    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		    	}
		    }, true);
		    $scope.$watch('filterOptions', function (newVal, oldVal) {
		    	if (newVal !== oldVal) {
		    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		    	}
		    }, true);
		    
		    //刷新表格当前页数据
		    $scope.refreshPage = function() {
		    	if ($scope.pageing == true) {
		    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		    	} else {
		    		$scope.getDataAsync();
		    	}
		    };
			return $scope;
		}
	};
	
});