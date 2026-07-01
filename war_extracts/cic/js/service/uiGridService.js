/**
* UIGrid模块service.
* @author s13103 
* modify by h14520 2017.10.24 增加gridOptions增加对selectSameRowOptions的支持，允许表格数据更新后，依然保持选中的是之前选中的行。（针对单选且noUnselect的表格）
*/
(function(){// IIFE 避免全局变量
	angular.module('app.uiGridservices',['ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.permissionservices', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.autoResize','ui.grid.edit','ui.grid.exporter','ui.grid.cellNav', 'ui.grid.draggable-rows'])
	.factory('UiGridService', function($http , $modal ,$state, $rootScope, $translate,UtilService, $timeout, TableStateService, uiGridConstants){
		
		/**
		 * 更新每个列的drawnWidth，用于隐藏/显示某列时，重新调整每列的宽度，以自适应填满整个grid。 该代码来源于ui-grid updateColumnWidths 一样的算法
		 * autofitColumnWidths为了计算宽度调整的比例，依赖于每个列当前的drawinWidth,
		 * 当某个列从隐藏改变为显示状态时，其drawnWidth还没有算出来，需要先调用updateColumnsDrawnWidths计算出来它的drawnWidth
		 */
		function updateColumnsDrawnWidths(grid) {
		    var asterisksArray = [],
		        asteriskNum = 0,
		        usedWidthSum = 0,
		        ret = '';

		    // Get the width of the viewport
		    var availableWidth = grid.getViewportWidth() - grid.scrollbarWidth;

		    // get all the columns across all render containers, we have to calculate them all or one render container
		    // could consume the whole viewport
		    var columnCache = [];
		    // modify by h14520 ui-grid原来的算法是获取所有当前可见列，不包括才刚刚从隐藏状态切换到显示状态的列，因此我需要改成获取所有列
//		    angular.forEach(grid.renderContainers, function( container, name){
//		      columnCache = columnCache.concat(container.visibleColumnCache);
//		    });
		    columnCache = grid.columns;
		    
		   
		    // look at each column, process any manual values or %, put the * into an array to look at later
		    columnCache.forEach(function(column, i) {
		      var width = 0;
		      // Skip hidden columns
		      if (!column.visible) { return; }

		      if (angular.isNumber(column.width)) {
		        // pixel width, set to this value
		        width = parseInt(column.width, 10);
		        usedWidthSum = usedWidthSum + width;
		        column.drawnWidth = width;
		      } 
		      else if (column.width.endsWith("%")) {
		        // percentage width, set to percentage of the viewport
		        // round down to int - some browsers don't play nice with float maxWidth
		        width = parseInt(parseInt(column.width.replace(/%/g, ''), 10) / 100 * availableWidth);
		        
		        if ( width > column.maxWidth ){
		          width = column.maxWidth;
		        }

		        if ( width < column.minWidth ){
		          width = column.minWidth;
		        }

		        usedWidthSum = usedWidthSum + width;
		        column.drawnWidth = width;
		      } else if (angular.isString(column.width) && column.width.indexOf('*') !== -1) {
		        // is an asterisk column, the gridColumn already checked the string consists only of '****'
		        asteriskNum = asteriskNum + column.width.length;
		        asterisksArray.push(column);
		      }
		    });

		    // Get the remaining width (available width subtracted by the used widths sum)
		    var remainingWidth = availableWidth - usedWidthSum;

		    var i, column, colWidth;

		    if (asterisksArray.length > 0) {
		      // the width that each asterisk value would be assigned (this can be negative)
		      var asteriskVal = remainingWidth / asteriskNum;

		      asterisksArray.forEach(function( column ){
		        var width = parseInt(column.width.length * asteriskVal, 10);

		        if ( width > column.maxWidth ){
		          width = column.maxWidth;
		        }

		        if ( width < column.minWidth ){
		          width = column.minWidth;
		        }

		        usedWidthSum = usedWidthSum + width;
		        column.drawnWidth = width;
		      });
		    }
		}
		
		/**
		 * 自适应，调整所有可见列的宽度，填满整个grid
		 * add by h14520 2017.9.25
		 */
		function autofitColumnWidths(grid){
			if (!grid) {
				return;
			}
			
			// 针对多个步骤的选择框，当该选择框还没有看到的时候，得不到窗口的宽度，无法自适应计算列宽。因此这种情况，就不调用自适应
		    var availableWidth = grid.getViewportWidth() - grid.scrollbarWidth;
		    if ( isNaN(availableWidth) || (0==availableWidth) ) {
		    	return;
		    }
			
			// 当某个列从隐藏改变为显示状态时，其drawnWidth还没有算出来，需要先调用updateColumnsDrawnWidths计算出来它的drawnWidth
			updateColumnsDrawnWidths(grid);
			
			var columns = grid.columns;
			
			// 计算当前所有可见列的总列宽
   	 		var totalVisibleWidth = 0;
   	 		for (var i=0; i<columns.length; i++) {
   	 			if (!columns[i].visible) {
   	 				continue;
   	 			}
   	 			var width = columns[i].drawnWidth;
   	 			
   	 			// 异常情况：部分列的drawnWidth未定义
   	 			if ( isNaN(parseInt(width,10)) ) {
   	 				// console.log("column " + i + " drawin width is not number:" + width);
   	 				continue;
   	 			}
   	 			totalVisibleWidth += width;
   	 		}
   	 		
   	 		// 改变所有可见列的列宽 （column.width属性）,乘以一个缩放系数，填满整个grid
   	 		var gridWidth = grid.getViewportWidth(); // 计算grid实际宽度
   	 		var ajustRatio = gridWidth /  totalVisibleWidth; // 缩放系数

			// 如果支持横向滚动条，且当前所有列列宽大于表格宽度时，则不进行自适应调整列宽
			if (grid.options) {
				if (2==grid.options.enableHorizontalScrollbar && ajustRatio < 1) {
					return;
				}
			} 
			
   	 		var iLastVisibleCol = -1; // 最后一个可见列
	   	 	for (var i=0; i<columns.length; i++) {
   	 			var column = columns[i];
	   	 		if (!column.visible) {
   	 				continue;
   	 			}
   	 			
	   	 		// 跳过checkbox列，不改变checkbox列的列宽，始终是默认的(30)
	   	 		if (grid.isRowHeaderColumn(column)) {
	   	 			continue;
	   	 		}
	   	 		iLastVisibleCol = i; // 更新最后一个可见列的序号
	   	 		
	   	 		// 宽度值是数字的
	   	 		if (angular.isNumber(column.width)) {
		   	 		var oldWidth = column.width;
   	 				var newWidth = Math.round(oldWidth * ajustRatio);
   	 				column.width = newWidth;
	   	 		}
	   	 		// 宽度值， 5%
	   	 		else if (column.width.endWith('%')) {
   	 				var oldWidthPercent = parseInt(column.width.replace(/%/g, ''), 10);
   	 				var newWidthPercent = Math.round(oldWidthPercent * ajustRatio);
   	 				column.width = newWidthPercent + '%';
   	 			}
   	 			// 宽度值， *
   	 			else if (column.width.endWith('*')) {
   	 				// 不用调整，控件会自己计算
   	 			}
   	 			// 宽度值为 5px
   	 			else if (column.width.endWith('px')) {
	   	 			var oldWidth = parseInt(column.width.replace(/px/g, ''), 10);
   	 				var newWidth = Math.round(oldWidth * ajustRatio);
   	 				column.width = newWidth;
   	 			}
	   	 	}
	   	 	
	   	 	// 对最后一个可见列特殊处理，始终填满到表格最右边
	   	 	if (iLastVisibleCol >= 0) {
	   	 		var column = columns[iLastVisibleCol];
	   	 		column.width = '*'; // 强制改为*号
	   	 	}
		}
				
		/**
		 * 	初始gridOptions，在设置了gridOptions后调用，绑定ui-grid的事件。
		 *	并且将该grid的列宽等状态保存在divId为键值的本地存储内(每个用户可以个性化调整表格列宽，并自动保存起来)
		 *	grid改造为ui-grid后，需要设置默认的事件
		 *	当一个scope内有多个表格时，需要联动。例如 虚拟机模板，就需要使用本方法，对自列表对应的gridOptions2, gridOptions3初始化
		 *	用法：
		 *	$scope.gridOptions2 = ....; 
		 *	$scope.init(gridOptions2, divId2);
		 *	@param gridOptions 要初始化的ui-grid对应的gridOptions
		 *	@param gridDivId   要初始化的ui-grid对应的divId, 用于保存该grid的状态（列宽、列的顺序、列的显示隐藏）
		 */
		function initGridOptions($scope, gridOptions, gridDivId) {
			if (!gridOptions) {
				return;
			}
			
			// 只保存列宽、列顺序、列显示状态，其他状态不保存.
			gridOptions.saveWidths = true;
			gridOptions.saveOrder = true;
			gridOptions.saveVisible = true;
			gridOptions.saveScroll = false;
			gridOptions.saveFocus = false;
			gridOptions.saveSort = false;
			gridOptions.saveFilter = false;
			gridOptions.savePinning = false;
			gridOptions.saveGrouping = false;
			gridOptions.saveGroupingExpandedStates = false;
			gridOptions.saveTreeView = false;
			gridOptions.saveSelection = false; // 选择事件，一定不能保存，否则点排序时，会不断触发选择事件和数据更新事件，引起并混乱
			gridOptions.savePagination = false; // 不保存分页状态 - 当前页码、每页的数目 （这个开关是修改ui-grid源码新加的 add by h14520 2017.10.11）
				
			// 滚动条
			gridOptions.enableVerticalScrollbar = 2; //默认是1，改为2表示根据需要增加滚动条，防止最右边列和右边界间有空白，不能填满。
			
			// add by h14520 2017.10.19 修改ui-grid源码，gridOptions增加开关enableAdaptiveDataTypes，当开关打开时，每次数据刷新时都自适应判断数据类型（以首行数据为参考），作为前台排序依据；开关未定义或者未false时，不自动判断数据类型。uiGridService.init()将其默认置为true.
			// 否则首次加载表格时（恢复状态时、自适应时），由于还没有数据，会自动判断每列类型都为string，之后就一直保持。
			// 开启了开关后，就会在数据有更新时，重新自动判断数据类型，这样可以避免前台排序时，对数字字段按照字符串方式排序导致混乱，例如5排在100前面的问题。
			gridOptions.enableAdaptiveDataTypes = true;
			
			var isRenderFinished = false; // 是否完成了界面初始化加载，用于防止：在界面还未初始化完毕时，由于恢复状态改变列可见性，调用自适应
			
			// ui-grid的初始化事件，当每次加载grid时执行
			gridOptions.onRegisterApi = function(gridApi) {
				
				// add by h14520 2017.10.17 增加一个属性gridOptions.gridApi便于获取公共api, gridOptions.grid便于获取其对应的grid
				gridOptions.gridApi = gridApi;
				gridOptions.grid = gridApi.grid;
				
				isRenderFinished = false; // 记录渲染是否完成，区分columnChange是否是restoreState导致的还是用户操作导致的
				
				// 特性1.自动恢复列宽。如果列表有对应的divId，则将其列宽记录下来，下次打开时，可以自动恢复
				if (gridDivId) {
					// 列宽调整后，记录下来			
					gridApi.colResizable.on.columnSizeChanged($scope, function() {
						TableStateService.saveState($scope, gridApi, gridDivId);
			        });

					// 隐藏/显示列时，自适应调整列宽，保存列宽、隐藏显示的列
			   	 	gridApi.core.on.columnVisibilityChanged( $scope, function (column) {
			   	 		// 自适应调整列宽， 并保存下来
			   	 		// 当还未完成界面初始化加载化时，由于恢复状态，会进入columnVisibilityChange
			   	 		// 此时，就不要调用自适应和保存状态. 只有当完成界面初始化加载时，用户的实际操作隐藏显示某列才会进入columnVisibilityChagne
			   	 		if (!isRenderFinished) {
			   	 			return; 
			   	 		}
			   	 		autofitColumnWidths(column.grid);
			   	 		TableStateService.saveState($scope, gridApi, gridDivId);
			   	     } );
			   	 	
			   	 	// 交换列顺序时，保存列顺序
			   	 	gridApi.colMovable.on.columnPositionChanged($scope, function(colDef, originalPosition, newPosition) {
			   	 		// add by h14520 2017.10.10 解决调整列顺序后，填不满整个表格的问题：每次调整列顺序后，都调用一次自适应。
			   	 		autofitColumnWidths(gridApi.grid);
			   	 		// 保存状态：列顺序
			   	 		TableStateService.saveState($scope, gridApi, gridDivId);
			   	 	}); 
			   	 	
			   	 	// 初始化时，先恢复上次保存的列状态
					TableStateService.restoreState($scope, gridApi, gridDivId);
					// 初始化结束时（需要等待渲染结束），自适应列宽，并且记录下标识初始化完成
					$timeout( function()  {
						autofitColumnWidths(gridApi.grid);	
						isRenderFinished = true; // 渲染完成
					});
				}
		   	 	
				// 特性2：分页。当分页参数变化时（点击下一页、每页显示多少个），绑定事件
		   	 	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		   	 		// 需同步到gridOptions.pagingOptions，因为getPageData()等方法需要从这里面读取分页参数
		   	 		if (gridOptions.pagingOptions.pageSize != pageSize) {
		   	 			gridOptions.pagingOptions.pageSize = pageSize;
		   	 		}
		   	 		if (gridOptions.pagingOptions.currentPage != newPage) {
		   	 			gridOptions.pagingOptions.currentPage = newPage;
		   	 		}
		   	 		
		   	 		// 无需调用刷新数据，因为定义了pagingOptionsWatch监视器监控到pageOptions改变就刷新数据 
		   	 	});
		   	 	
		   	 	//add by l14389 20171020, 特性2.1：依赖于分页控件的过滤特性，当过滤文字输入发生变化，定制过滤文字变化后的相应函数
		   	 	if (angular.isFunction(gridOptions.afterFilterTextChanged) && gridOptions.showFilter) {
			   	 	gridApi.pagination.on.filterTextChanged($scope, function (newValue, oldValue){
			   	 		if (angular.isDefined(gridOptions.keyInternval)) {
			   	 			$timeout.cancel(gridOptions.keyInternval);
			   	 		};
				   	 	gridOptions.keyInternval = $timeout(function(){
				   	 		gridOptions.afterFilterTextChanged(newValue, oldValue);
				   	 	}, constant.keyInterval);
				   	 	});
		   	 	}
		   	 	
		   	 	
		   	 	// 特性3：后台排序。当使用后台排序时，绑定列排序事件，设置后台排序参数
		   	 	if ( gridOptions && gridOptions.useExternalSorting) {
		   	 		gridApi.core.on.sortChanged( $scope, $scope.sortChanged );
		   	 	}
		   	 	//特性4：页面点击选项发生改变时，将选中的项赋值给$scope.gridOptions.selectedItems
		   	 	if (angular.isArray(gridOptions.selectedItems)) {
			   	 	// 单行选中状态改变事件
		   	 		gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
			   	 		gridOptions.selectedItems.splice(0, gridOptions.selectedItems.length);//移除被选项
			   	 		var sellist = gridApi.selection.getSelectedRows();
			   	 		for(var i=0; i< sellist.length;i++) {
			   	 			gridOptions.selectedItems.push(sellist[i]);
			   	 		}
			   	 		//$scope.gridOptions.selectedItems = $scope.gridApi.selection.getSelectedRows();
			   	 		
			   	 		// 特性5： gridOptions可以定义附加的afterSelectionChange回调，如果存在则执行
			   	 		if ( gridOptions.afterSelectionChange
			   	 			 && (typeof gridOptions.afterSelectionChange == 'function') ) {
			   	 			gridOptions.afterSelectionChange(row, event);
			   	 		}
			   	 		
			   	 		// add by h14520 2017.10.24
			   	 		if (angular.isObject(gridOptions.selectSameRowOptions)) {
			   	 			gridOptions.selectSameRowOptions.lastSelectedEntity = row.entity;
			   	 		}
                        // 问题单201710230461 add by l14107 2017.10.30
                        if (angular.isFunction($scope.rowSelectionChanged)) {
                            $scope.rowSelectionChanged(row, event);
                        }
			   	 	});
			   	 	// 多行选中状态改变(例如点击了最上面的总checkbox), 或者从一个选择行点击另一行，会先执行changedBatch(之前的行),再执行changed(新选行)， add by h14520 2017.9.27
			   	 	gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows, event){
				   	 	gridOptions.selectedItems.splice(0, gridOptions.selectedItems.length);
			   	 		var sellist = gridApi.selection.getSelectedRows();
			   	 		for(var i=0; i< sellist.length;i++) {
			   	 			gridOptions.selectedItems.push(sellist[i]);
			   	 		}
			   	 		
			   	 		// 特性5： gridOptions可以定义附加的afterSelectionChange回调，如果存在则执行
			   	 		if ( gridOptions.afterSelectionChange
			   	 			 && (typeof gridOptions.afterSelectionChange == 'function') ) {
			   	 			gridOptions.afterSelectionChange(rows, event);
			   	 		}
			   	 	}); 
		   	 	};
		   	 	
                
                // 定义数据改变回调函数：自动选中首行
                var dataChangedCallback = function(grid) {
                	var gridOptions = grid.options;
                	
                	// 特性6：针对不能多选也不能取消选中的grid(永远有一个行被选中)，实现刷新时首行自动选中 add by h14520 2017.9.28
                	if (gridOptions.multiSelect==false && gridOptions.noUnselect==true) {
                		
                		// 如果开启了保持选择同一行，则数据刷新后依然选中之前选中的那行, 防止联动表格在修改数据后，选中行切换，不美观。
						var selectSameRowOptions = gridOptions.selectSameRowOptions; 
						if (angular.isObject(selectSameRowOptions)) {
							var enableSelectSameRow = selectSameRowOptions.enableSelectSameRow;
							var idFields = selectSameRowOptions.idFields;
							
							// 开启了开关，并且id列集不为空
							if (enableSelectSameRow 
									&& angular.isArray(idFields) && (idFields.length > 0) ) {
								var lastSelectedEntity= null; // 之前选中的行
								if ( angular.isDefined(selectSameRowOptions.lastSelectedEntity) ) {
									lastSelectedEntity = selectSameRowOptions.lastSelectedEntity;
								}
								
								if (lastSelectedEntity != null) {
									 //从所有可见行中搜索和之前选择行id列一致的数据
									var rows = gridApi.core.getVisibleRows(grid);
									for (var i=0;i<rows.length;i++) {
										var entity = rows[i].entity;
										var isRowSame = true; 
										for (var j=0;j<idFields.length;j++) {
											var col = idFields[j];
											if ( angular.isUndefined(entity[col])
													|| angular.isUndefined(lastSelectedEntity[col])
													|| !angular.equals(entity[col], lastSelectedEntity[col]) ) {
												isRowSame = false;
												break; //break for j 如果有一个字段不匹配，则整行不陪陪，跳到下一行
											}
										}
										if (isRowSame) {
											gridApi.selection.selectRow(entity);
											break; //break for i; 找到相同的行了，选中它，直接退出循环，不再找下个匹配行
										}
									}
								}
							}
						}
						
						// add by h14520 2017.10.23 当表格没有任何条目被选中时，自动选中首行。(表格每次重新加载时，即使noUnselect=true,默认也不会选中任何行，因此我们需要这里选上。
						//if (gridApi.selection.getSelectedCount() <= 0) { // modify by h14520 2017.10.24 这个方法不准，如果先选中一行，然后刷新数据，getSelectedRows()会返回1，
						if (gridApi.selection.getSelectedRows().length <= 0) {
							gridApi.selection.selectRowByVisibleIndex(0);
						}
                	}
                	
                	// 解决bug: 数据刷新后，全选勾没有去掉的问题
                	if (gridOptions.multiSelect==true && gridOptions.enableRowHeaderSelection==true) {
                		gridApi.grid.selection.selectAll = false;
                	}
                };

                // 注册Row change事件（当行数据刷新导致行增加或移除时），调用回调
                gridApi.grid.registerDataChangeCallback(dataChangedCallback, [uiGridConstants.dataChange.ROW]);
                
//		   	 	gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
                if(typeof gridOptions.extendRegisterApi === "function") {                        	
                	gridOptions.extendRegisterApi(gridApi);
                }
                
                // gridOptions支持selectRow函数，来选择某一行, e.g:  gridOptions.selectRow(myData[i], true)
                var selectRow = function(rowEntity, isSelect, event) {
                	if (isSelect==undefined || isSelect==null) {
                		isSelect = true;
                	}
                	if (isSelect) {
                		gridApi.selection.selectRow(rowEntity, event);
                	} else {
                		gridApi.selection.unSelectRow(rowEntity, event);
                	}
                }
                gridOptions.selectRow = selectRow;
                
                // gridOptions支持selectAll函数，来选择所有可见行，或者取消选中所有可见行
                var selectAll = function(isSelect, event) {
                	if (isSelect==undefined || isSelect==null) {
                		isSelect = true;
                	}
                	if (isSelect) {
                		gridApi.selection.selectAllVisibleRows(event);
                	} else {
                		gridApi.selection.clearSelectedRows(event);
                	}
                }
                gridOptions.selectAll = selectAll;
                
			}
		}
		
		return {

			/**
			 * divId  列表的div的id
			 * **/
			grid : function($scope, url, params, pagesizeArr,pagesize, divId, datakey) {
				 $scope.pageing = true; //标记是否分页
				 if (datakey) {
					 $scope[datakey]=[];
				 } else {
					 $scope.myData = [];
				 }
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
//			        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
			    	if ($scope.gridOptions && angular.isArray($scope.gridOptions.selectedItems)) {
			    		$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);//移除被选项	
//			    		$scope.gridOptions.$gridScope.selectionProvider.toggleSelectAll(false,true);
			    	}
			    	if (angular.isArray(result)) {
			    		 if (datakey) {
							 $scope[datakey] = result;
						 } else {
							 $scope.myData = result;
						 }
					     $scope.totalServerItems = result.length;
			    	} else {
			    		 if (datakey) {
			    			 $scope[datakey] = result.data;
			    		 } else {
			    			 $scope.myData = result.data;
			    		 }
					     $scope.totalServerItems = result.totalLength;
			    	}
			        if (!$rootScope.$$phase && !$scope.$$phase) {
			            $scope.$apply();
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
//			            var waitModal = UtilService.wait();
			            $http({
			            	method: 'GET',
			            	url: $scope.url,
			            	params: params
			            }).success(function (result) {
//			            	waitModal.dismiss();
			            	// 修改问题单 201705160723 解决窗口打开遮罩层还在时候关闭窗口，然后打开窗口会出现空白的问题，需在对应controller中将areaDivId销毁
//			            	if ($scope.gridOptions && !$scope.gridOptions.$gridScope) {
//			            		return;
//			            	}
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
			            	UtilService.handleResult(result);
			            }).error(function(response, code, headers, config) {
//				        	waitModal.dismiss();
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
				    	        // 改变参数时，同步到界面上gridOptions中
				    	        if ($scope.gridOptions) {
				    	        	$scope.gridOptions.paginationPageSize = newVal.pageSize;
			    	        		$scope.gridOptions.paginationCurrentPage = 1;
			    	        	}
				    	        // 取消选择
				    	        if ($scope.gridOptions && angular.isArray($scope.gridOptions.selectedItems)) {
				    	        	if (angular.isFunction($scope.gridOptions.selectAll)) {
				    	        	 	$scope.gridOptions.selectAll(false);
				    	        	}
				    	        }
				    	    }
				    	    
				    	    // 修改当前页时，将当前页同步到界面上gridOptions中
			    	        if (newVal.currentPage !== oldVal.currentPage) {
			    	        	if ($scope.gridOptions) {
			    	        		$scope.gridOptions.paginationCurrentPage = newVal.currentPage;
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
			    //后台排序支持
				$scope.sortChanged = function ( grid, sortColumns ) {
					if ($scope.params) {
						if (sortColumns && sortColumns.length == 0) {
							$scope.params.sortField = null;
							$scope.params.sortDir = null;
						} else {
							$scope.params.sortField = sortColumns[0].field;
							if ('asc' == sortColumns[0].sort.direction) {
		            			$scope.params.sortDir = 1;
		            		} else if ('desc' == sortColumns[0].sort.direction) {
		            			$scope.params.sortDir = 2;
		            		}
						}
					}
					$scope.refreshPage();
				};
				// 新的ui-grid 需要参数totalItem用于分页，当从后台返回totalServerItems变化后，需要同步改变totalItem
				if (!$scope.totalServerItemsWatch) {
				    $scope.totalServerItemsWatch = $scope.$watch('totalServerItems', function(newValue, oldValue) {
				    	if ($scope.gridOptions) {
				    		$scope.gridOptions.totalItems = newValue;
				    	}
					}, true);
			    }			
								
				
				// 初始化，在设置了gridOptions后调用，绑定ui-grid的事件。 
				// grid改造为ui-grid后，需要设置默认的事件
				// 用法：
				// $scope.gridOptions = ....; 
				// $scope.init();
				$scope.init = function(gridOptions, gridDivId) {
					// 当无参数传入时，采用默认值
					if (!gridOptions || null==gridOptions) {
						gridOptions = $scope.gridOptions;
					}
					if (!gridDivId || null==gridDivId) {
						gridDivId = divId; // divId来自$scope.grid方法
					}
					// add by h14520 2017.9.30 每个gridOptions要有自己的pagingOptions，如果没有设置，则给一个默认的. 防止一个scope有多个表格时，分页参数混淆
					if (!gridOptions.pagingOptions || null==gridOptions.pagingOptions) {
						gridOptions.pagingOptions = $scope.pagingOptions;
					}
					$scope.initGrid(gridOptions, gridDivId);
				};
				
				// 初始化，不保存列表宽度、列表哪些列显示隐藏的状态，用于对话框中的列表。。 
				$scope.initNoTableState = function(gridOptions) {
					// 当无参数传入时，采用默认值
					if (!gridOptions || null==gridOptions) {
						gridOptions = $scope.gridOptions;
					}
					
					// add by h14520 2017.9.30 每个gridOptions要有自己的pagingOptions，如果没有设置，则给一个默认的. 防止一个scope有多个表格时，分页参数混淆
					if (!gridOptions.pagingOptions || null==gridOptions.pagingOptions) {
						gridOptions.pagingOptions = $scope.pagingOptions;
					}
					$scope.initGrid(gridOptions);
				};
				
				// 初始gridOptions，在设置了gridOptions后调用，绑定ui-grid的事件。
				// 并且将该grid的列宽等状态保存在divId为键值的本地存储内(每个用户可以个性化调整表格列宽，并自动保存起来)
				// grid改造为ui-grid后，需要设置默认的事件
				// 当一个scope内有多个表格时，需要联动。例如 虚拟机模板，就需要使用本方法，对自列表对应的gridOptions2, gridOptions3初始化
				// 用法：
				// $scope.gridOptions2 = ....; 
				// $scope.init(gridOptions2, divId2);
				// @param gridOptions 要初始化的ui-grid对应的gridOptions
				// @param gridDivId   要初始化的ui-grid对应的divId, 用于保存该grid的状态（列宽、列的顺序、列的显示隐藏）
				$scope.initGrid = function(gridOptions, gridDivId) {
					initGridOptions($scope, gridOptions, gridDivId);
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
			    		if (angular.isFunction($scope.gridOptions2.selectAll)) {
			    			$scope.gridOptions2.selectAll(false);
			    		}
			    	}
					$scope.myData2 = result.data;
					$scope.totalServerItems2 = result.totalLength;
					if (!$rootScope.$$phase && !$scope.$$phase) {
						$scope.$apply();
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
//						var waitModal = UtilService.wait();
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
//								waitModal.dismiss();
								if (angular.isDefined(areaDivId)) {
				            		UtilService.dismissAreawait(areaDivId);
						        } 
								var resultData = result.data;
								data = resultData.filter(function(item) {
									return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
								});
								$scope.setPagingData2(result);
							}).error(function(response, code, headers, config) {
//					        	waitModal.dismiss();
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
//								waitModal.dismiss();
								if ((angular.isArray(result) || angular.isArray(result.data)) || result.success == true) {
				            		$scope.setPagingData2(result);
				            		//callback after load
				            		if (angular.isFunction($scope.afterLoad2) && (result.length >= 0 || (angular.isArray(result.data) && result.data.length >= 0))) {
				            			$scope.afterLoad2.apply();
				            		}
				            	}
								if (angular.isDefined(areaDivId)) {
									UtilService.dismissAreawait(areaDivId);
					            } 
								UtilService.handleResult(result);
							}).error(function(response, code, headers, config) {
//					        	waitModal.dismiss();
								if (angular.isDefined(areaDivId)) {
				            		UtilService.dismissAreawait(areaDivId);
						        } 
					        	UtilService.handleError(code);
					        });
						}
					});
				};
				
				/* -- modify by h14520 2017.10.11  grid2，修改gridOptions2.currentPage对界面当前页码的同步
				$scope.$watch('pagingOptions2', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						//修改页面大小时，将当前页重置为1。
						if (newVal.pageSize !== oldVal.pageSize) {
							$scope.pagingOptions2.currentPage = 1;
						}
						$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
					}
				}, true);
				*/
				$scope.$watch('pagingOptions2', function (newVal, oldVal) {
			    	if (newVal !== oldVal) {
			    		//修改页面大小时，将当前页重置为1。
			    	    if (newVal.pageSize !== oldVal.pageSize) {
			    	        $scope.pagingOptions2.currentPage = 1;
			    	        // 改变参数时，同步到界面上gridOptions中
			    	        if ($scope.pagingOptions2) {
			    	        	$scope.pagingOptions2.paginationPageSize = newVal.pageSize;
		    	        		$scope.pagingOptions2.paginationCurrentPage = 1;
		    	        	}
			    	    }
			    	    
			    	    // 修改当前页时，将当前页同步到界面上gridOptions中
		    	        if (newVal.currentPage !== oldVal.currentPage) {
		    	        	if ($scope.gridOptions2) {
		    	        		$scope.gridOptions2.paginationCurrentPage = newVal.currentPage;
		    	        	}
		    	        }
		    	        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
			    	}
			    }, true);
				
				$scope.$watch('filterOptions2', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage, $scope.filterOptions2.filterText);
					}
				}, true);
				
				// add by h14520 2017.9.30 新的ui-grid 需要参数totalItem2用于分页，当从后台返回totalServerItems2变化后，需要同步改变totalItem2
				if (!$scope.totalServerItemsWatch2) {
				    $scope.totalServerItemsWatch2 = $scope.$watch('totalServerItems2', function(newValue, oldValue) {
				    	if ($scope.gridOptions2) {
				    		$scope.gridOptions2.totalItems = newValue;
				    	}
					}, true);
			    };
				
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
//			        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
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
			},
			
			
			
			
			/** 提供一个缺省的gridOptions实现， 可以传参定制参数
			 * $scope 如果传入$scope 会把obj作为$scope的key值，不传的话 返回obj对象
			 * gridOpions ： 【非必传参数】  定制gridOpions名称
			 * objParam :对象参数 类似 
			 *    {
			 *       data:"",
			 *       selectedItems : "",
			 *       columnDefs : "",
			 *       dblclickFunc 【非必传参数】双击事件调用的方法  为空不注册双击事件
			 *    }
			 * **/
			gridOptions : function(scope, gridOpions, objParam) {
				if (!angular.isString(gridOpions)) {
					gridOpions = "gridOptions";
				}
				if (!angular.isObject(objParam)) {
					
				}
				var obj = {
						data: 'myData',
						jqueryUITheme: false,
						jqueryUIDraggable: false,
//				        selectedItems: [],
				        showSelectionCheckbox: false,
				        multiSelect: false,
				        showGroupPanel: false,
				        showColumnMenu: false,
				        showFilter: false,
				        enableCellSelection: false,
				        enableCellEditOnFocus: false,
				        enablePaging: false,
				        showFooter: false,
				        i18n: $translate.instant('lang'),
				        totalServerItems: 'totalServerItems',
				        filterOptions: false,
				        pagingOptions: false,
				        columnDefs:[]
				}
				if (angular.isObject(objParam)) {
					if (objParam.dblclickFunc) { //双击事件
						obj.rowTemplate = '<div ng-dblclick="' + objParam.dblclickFunc+'(row.entity)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>';
						delete objParam.dblclickFunc;
					}
					//从参数继承属性
					angular.extend(obj, objParam);
				}
				if (angular.isObject(scope)) {
					scope[gridOpions] = obj;
				} else {
					return obj;
				}
			},
			
			/**
			 * 构造一个不分页的默认gridOptions
			 * @param data 数据对应的scope变量字符串, 默认是'myData',[必填]
			 * @param columnDefs 列定义[必填]
			 * @param selectedItems 选择对象的绑定对象[必填]
			 * @param enableGridMenu 是否支持用户可控制部分列显示、隐藏, 默认值false
			 * @param multiSelect 是否支持多选，默认：false
			 * @param noUnselect  是否一定会有一行被选中：默认为false. (一般用于联动表格的主表格, 单选的表格)
			 * @param doubleClickTemplate 双击的template。如不填，表示没有
			 * @param afterSelectionChange 选中后事件。如不填，表示没有
			 * 用法：
			 * gridOptions = createNoPageGridOptions('myData', column, $scope.mySelections, true);
			 * 然后再设置特殊值
			 */
			createNoPageGridOptions : function(data, columnDefs, selectedItems, enableGridMenu, multiSelect, noUnselect, doubleClickTemplate, afterSelectionChange) {
				if (undefined == data) {
					data = 'myData';
				}
				if (undefined == selectedItems) {
					selectedItems = null;
				}
				if (undefined == enableGridMenu) {
					enableGridMenu = false;
				}
				if (undefined == multiSelect) {
					multiSelect = false;
				}
				if (undefined == noUnselect) {
					noUnselect = false;
				}
				
				var gridOptions = {
						// 数据
			            data: data,
			            columnDefs: columnDefs, // 列定义
			                            
			            // 样式
			            enableGridMenu: enableGridMenu, // 是否有选择 显示/隐藏列的菜单
			            enableHorizontalScrollbar: 0, 	// 是否显示表格的水平滚动条  
			            enableColumnMenus: false, 		// 是否显示每个列的扩展菜单（如添加排序，删除排序等）
			                            
			            // 选择
			            selectedItems: selectedItems, //绑定选择对象
			            enableRowSelection:true,//行是否可选择
			            enableFullRowSelection: true,   // 是否允许整行选择
			        
			            // 多选
			            multiSelect: multiSelect, // 是否允许多选
			            enableRowHeaderSelection: multiSelect, // 是否显示checkbox(多选才需要)
			            noUnselect:  noUnselect,  // 可以不选中
			            
			            // 双击和右键
			            rowTemplate: doubleClickTemplate,    // 双击行模板
			            
			            // 分页
			            useExternalPagination: false,//是否外部分页
			            enablePaginationControls: false, //是否使用默认的底部分页  -- 不支持分页  
			            //paginationPageSizes: $scope.pagingOptions.pageSizes, //每页显示个数选项  
			            //paginationCurrentPage:$scope.pagingOptions.currentPage, //当前的页码  
			            //paginationPageSize: $scope.pagingOptions.pageSize,        //每页显示个数 
			            
			            // 过滤器
			            
			            // 外部排序 (不分页，因此不用外排序)
			            useExternalSorting:false,
						
			            // 选中后事件绑定
						afterSelectionChange: afterSelectionChange
				};
				
				return gridOptions;
			},
			
			
			/**
			 * 初始gridOptions，在设置了gridOptions后调用，绑定ui-grid的事件。
			 */
			initGridOptions : initGridOptions
			
			
		};
	});
})();
