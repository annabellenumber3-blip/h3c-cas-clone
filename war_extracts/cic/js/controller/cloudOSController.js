
/**
 * cloudOS虚拟机列表
 */
routeApp.controller('cloudOSVmListController', function($scope, $http, $modal, $translate, $timeout, $interval, $state, UtilService,HttpService,GridService,DomainService) {
  
	
	//cloudOS虚拟机运行状态
	var cloudOSVmStatusTemplate='<div class="ngCellText" ng-class="col.colIndex()">' +
		'<div ng-if= \'row.entity[col.field] == "running"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_running.svg"></span><span>' + $translate.instant("vm.execute") + '</span></div>' +
		'<div ng-if= \'row.entity[col.field] == "shutOff"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span>' + $translate.instant("vm.close") + '</span></div>' +
		'<div ng-if= \'row.entity[col.field] == "suspended"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span>' + $translate.instant("vm.suspended") + '</span></div>' +
		'<div ng-if= \'row.entity[col.field] == "unknown"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_unkown.svg"></span><span>' + $translate.instant("vm.unkown") + '</span></div></div>';
	
	
    var column = [{ field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'15%',cellTemplate:titleTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'10%',cellTemplate:cloudOSVmStatusTemplate},
                  { field: 'cpu', displayName: 'CPU', sortable: true,width:'10%'},
                  { field: 'memory', displayName: $translate.instant('common.memory'), sortable: true, width:'10%', cellFilter:'byteUnitRender'},
                  { field: 'storageCapacity', displayName: $translate.instant('vmware.storageCapacity'), sortable: true, width:'15%',cellFilter:'byteUnitRender'},
                  { field: 'osVersion', displayName: $translate.instant('common.os'), sortable: true, width:'25%',cellTemplate:titleTemplate},
                  { field: 'createDate', displayName: $translate.instant('common.createTime'), sortable: true, width:'15%',cellTemplate:titleTemplate}
    ];
    
    
    $scope.mySelections = [];
    var params = {};
    params.cloudId = $scope.entryId;
    var url = "cloudOS/vmList";
    
    
    
    $scope = GridService.grid($scope, url, params, undefined, undefined, 'cloudOSVmListDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    listenNavClick($scope, $timeout);
    
    $scope.gridOptions = {
          data: 'myData',
          jqueryUITheme: false,
          jqueryUIDraggable: false,
          selectedItems: $scope.mySelections,
          showSelectionCheckbox: true,
          multiSelect: false,
          showGroupPanel: false,
          showColumnMenu: true,
          showFilter: false,
          enableCellSelection: false,
          enableCellEditOnFocus: false,
          enablePaging: true,
          showFooter: true,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
          	domain = rowItem.entity;
          	if (rowItem.selected == true) {
          		$scope.vm = DomainService.updateCloudOSVmButton(domain);
          	}
          },
          columnDefs:column,
          rowTemplate: doubleClickTemplate    //双击行模板
    };
    //刷新虚拟机机列表
    $scope.refreshVmList = function() {
       $scope.vm = {};
       $scope.mySelections.splice(0, $scope.mySelections.length);
       $scope.refreshPage();
       if (angular.isArray($scope.seleteOperator)) {
			$scope.seleteOperator.splice(0, $scope.seleteOperator.length);// clear
       }
       $scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
       if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
       }
    };
    
    //监控选中虚拟机的状态，更新按钮栏
  /*  $scope.$watch('mySelections', function(newValue, oldValue) {
        if (newValue && newValue.length == 1) {
            $timeout(function() {
                $scope.status = newValue[0].status;
            });
        }
    }, true);*/
    
   $scope.rightClick = function(row, e) {
        if (e.which == 3 && row.selected == false) {// 1:left, 2:middle, 3:right
            // unselected all rows
            $scope.gridOptions.selectAll(false);
            // select right click row
            $scope.gridOptions.selectRow(row.rowIndex, true);
        }
    };
    
    $scope.operateCloudOSVm = function(type) {
    	var row = $scope.mySelections[0];
		DomainService.operateCloudOSVm(type, row, $scope.showTaskList);
    };
    
    //手工同步
    $scope.syncResource = function() {
        var operateInfo = {type:"CloudOS",name:$scope.entryName};
        var syncInstance = UtilService.confirm($translate.instant('cloudResource.syncResourceConfirm', operateInfo),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            HttpService.put('cloud/'+ $scope.entryId +'/resource/sync');
        }, function () {
        });
    };
    
    
    
    //批量操作虚拟机
    /*$scope.batchOperateVm = function(type) {
        if ($scope.mySelections.length <= 0) {
            UtilService.alert($translate.instant('vm.vmSelectAlert'), $translate.instant('common.opertip'), false, 'error');
            return;
        }
        var operateInfo = {
                type:$translate.instant('menu.'+type),
        };
        DomainService.batchOperateVmwareVm(type, $scope.mySelections, operateInfo, $scope.showTaskList);
    };*/
    
    
    
    //注册刷新事件
    $scope.$on(constant.onRefreshCloudOSVmList, function(event, msg) {
    	if (msg == $scope.entryId) {
    		$scope.refreshVmList();
    	}
    });
    
 
    //搜索框
    $scope.$watch('filterName', function(newValue, oldValue) {
        if (newValue != oldValue) {
            //设置时间间隔
            if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
                $timeout.cancel($scope.keyInterval);
            }
            $scope.keyInterval = $timeout(function() {
	            $scope.params.title = newValue;
	            $scope.pagingOptions.currentPage = 1;
	            $scope.refreshVmList();
            }, constant.keyInterval);
        }
    });
    
    $scope.$on("$destroy", function() {//scope销毁时，销毁定时器
        if (angular.isDefined($scope.keyInterval)) {
            $timeout.cancel($scope.keyInterval);
        }
    });
    //分配虚拟机
    $scope.distributeCloudOSVm = function() {
    	var row = $scope.mySelections[0];
    	if (row == undefined) {
    		return;
    	}
    	DomainService.distributeVm(row.cloudId, row);
    };
    
    
    /*
    //设置刷新时间间隔
	$scope.intervalOptions= [ {value:5000,label:$translate.instant('paramconfig.5s')}
			,{value:10000,label:$translate.instant('paramconfig.10s')}
			,{value:30000,label:$translate.instant('paramconfig.30s')}
			,{value:60000,label:$translate.instant('paramconfig.1min')}
			,{value:300000,label:$translate.instant('paramconfig.5min')}];
    $scope.model = {};
    $scope.model.interval = 30000;
	$scope.$watch("model.interval", function(){
		$scope.controRefreshData();
	});
	$scope.controRefreshData = function(){
		if($scope.timer){
			$interval.cancel($scope.timer);
		}
		$scope.timer = $interval(function(){
		   $scope.refreshVmList();
		}, $scope.model.interval);
	};
	$scope.$on("$destroy", function(){
		if($scope.timer){
			$interval.cancel($scope.timer);
		}
	});*/
    
});
