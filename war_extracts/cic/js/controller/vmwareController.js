/**
 * VMWARE功能
 */ 
routeApp.controller('vmwareController', function($scope, $http, $modal, $translate, $timeout, UtilService,HttpService) {
    
});

/**
 * VMWARE 概要页签
 */ 
routeApp.controller('vmwareSummaryController', function($scope, $http, $modal, $translate, $timeout, UtilService,HttpService,EchartService) {
    $scope.summary = {};
    //概要
    $scope.querySummary = function() {
        $http.get("vmware/vcenter/" + $scope.entryId + "/summery").success(function(result){
            if (result.state == 0) {
                $scope.summaryTimeout = $timeout(function() {
                    $scope.summary = result.data;
                });
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    $scope.querySummary();
    
    //初始化图表
    var noDataText = $translate.instant('common.noData');
    var hostCircle = echarts.init(document.getElementById("vcenterHostCircle"));
    var hostCpuTop5Chart  = echarts.init(document.getElementById("vcenterHostCpuTop5Chart"));
    var hostMemoryTop5Chart = echarts.init(document.getElementById("vcenterHostMemoryTop5Chart"));
    var vmCpuTop5Chart = echarts.init(document.getElementById("vcenterVmCpuTop5Chart"));
    var vmMemoryTop5Chart = echarts.init(document.getElementById("vcenterVmMemoryTop5Chart"));
    //图表数据
    var queryChartsData = function() {
        // 获取主机状态             修改问题单:201711020410  主机状态不显示问题. w10450
        EchartService.getHostStatus("vmware/vcenter/" + $scope.entryId + "/hosts/state", hostCircle);
        // top5主机CPU
        EchartService.hostTop5Cpu("vmware/vcenter/" + $scope.entryId + "/top5/host/cpu", hostCpuTop5Chart, noDataText, 'vcenterHostCpuTop5Chart');
        // Top5主机内存
        EchartService.hostTop5Mem("vmware/vcenter/" + $scope.entryId + "/top5/host/memory", hostMemoryTop5Chart, noDataText, 'vcenterHostMemoryTop5Chart');
        //top5 虚拟机cpu 嵌套圆环
        EchartService.vmTop5CpuFiveCricle("vmware/vcenter/" + $scope.entryId + "/top5/vm/cpu", vmCpuTop5Chart, noDataText, 'vcenterVmCpuTop5Chart');
        // top5虚拟机内存
        EchartService.vmTop5Mem("vmware/vcenter/" + $scope.entryId + "/top5/vm/memory", vmMemoryTop5Chart, noDataText, 'vcenterVmMemoryTop5Chart');
    }
    queryChartsData();
    //浏览器窗口resize的时候执行的函数
	 $scope.cloudResourceResizeFun = function() {
		  hostCpuTop5Chart.resize();
		  hostMemoryTop5Chart.resize();
		  hostCircle.resize();
		  vmMemoryTop5Chart.resize();
		  vmCpuTop5Chart.resize();
		  if (vmCpuTop5Chart.getOption()) {
	    		vmCpuTop5Chart.setOption({
	    			legend :{
	    				x : vmCpuTop5Chart.getDom().offsetWidth * 2 / 3
		  }
	    		})
			}
	  };
    $(window).on('resize', $scope.cloudResourceResizeFun);
    $scope.$on(constant.onNavClick, function(event, msg) {
        $scope.cloudResourceResizeFun();
    });
    
    //销毁资源
    $scope.$on("$destroy", function() {
        if ($scope.summaryTimeout) {
            $timeout.cancel($scope.summaryTimeout);
        }
        $(window).off('resize', $scope.cloudResourceResizeFun);
        //销毁echarts实例
		EchartService.dispose(hostCpuTop5Chart, hostMemoryTop5Chart, hostCircle, vmCpuTop5Chart, vmMemoryTop5Chart);
    });
});
/**
 * vcenter 主机列表
 * 
 */
routeApp.controller('vmwareHostListController', function($scope, $http, $modal, $translate, $timeout, UtilService,HttpService,GridService) {
    var titleLinkTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a custom-title="{{row.entity[col.field]}}" ng-click="jump(row.entity)" style="text-decoration:underline;">{{row.entity[col.field]}}</a></div>';
	var vmwareHoststatusTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' + 
        '<div ng-if= \'row.entity[col.field] == "1"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_normal_16x16.svg"></span><span>' + $translate.instant("common.normal") + '</span></div>' +
        '<div ng-if= \'row.entity[col.field] == "2"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_warning_16x16.svg"></span><span>'+$translate.instant("vmware.warning") +'</span></div>' +
        '<div ng-if= \'row.entity[col.field] == "3"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_maint_16x16.svg"></span><span>'+$translate.instant("host.maintainMode") +'</span></div>' +
        '<div ng-if= \'row.entity[col.field] == "0"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_error.svg"></span><span>' + $translate.instant("common.abnormal") + '</span></div></div>' ;
    
    var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'15%',cellTemplate:titleLinkTemplate},
                  { field: 'hostPool', displayName: $translate.instant('hostpool.hostpool') , sortable: true, width:'12%',cellTemplate:titleTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'10%',cellTemplate:vmwareHoststatusTemplate},
                  { field: 'vmNum', displayName: $translate.instant('vm.domainOverview'), sortable: true, width:'10%',cellTemplate:vmSummaryTemplate},
                  { field: 'cpuRate', displayName: $translate.instant('host.hostcpuRate'), sortable: true, width:'12%', cellTemplate:progressTemplate},
                  { field: 'memRate', displayName: $translate.instant('host.hostMemRate'), sortable: true, width:'12%', cellTemplate:progressTemplate},
                  { field: 'diskSize', displayName: $translate.instant('host.diskCapacity'), sortable: true, width:'10%',cellFilter:'byteUnitRender2'},
                  { field: 'platForm', displayName: $translate.instant('host.platform'), sortable: true, width:'18%'}];
    $scope.mySelections = [];
    var params = {};
    var url = "vmware/vcenter/" + $scope.entryId + "/host/list";
    //主机池,集群下的主机列表
    if ($scope.queryType) {
        column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'17%',cellTemplate:titleLinkTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'10%',cellTemplate:vmwareHoststatusTemplate},
                  { field: 'vmNum', displayName: $translate.instant('vm.domainOverview'), sortable: true, width:'12%',cellTemplate:vmSummaryTemplate},
                  { field: 'cpuRate', displayName: $translate.instant('host.hostcpuRate'), sortable: true, width:'14%', cellTemplate:progressTemplate},
                  { field: 'memRate', displayName: $translate.instant('host.hostMemRate'), sortable: true, width:'14%', cellTemplate:progressTemplate},
                  { field: 'diskSize', displayName: $translate.instant('host.diskCapacity'), sortable: true, width:'12%',cellFilter:'byteUnitRender2'},
                  { field: 'platForm', displayName: $translate.instant('host.platform'), sortable: true, width:'20%'}];
        url = "vmware/vcenter/" + $scope.cloudId + "/host/list?type=" + $scope.queryType + "&key=" + $scope.queryKey;
    }
    $scope = GridService.grid($scope, url, params, undefined, undefined, 'vmwareHostListDiv');
    $scope.getDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    listenNavClick($scope, $timeout);
    
    $scope.gridOptions = {
          data: 'myData',
          jqueryUITheme: false,
          jqueryUIDraggable: false,
          selectedItems: $scope.mySelections,
          showSelectionCheckbox: false,
          multiSelect: false,
          showGroupPanel: false,
          showColumnMenu: true,
          showFilter: false,
          enableCellSelection: false,
          enableCellEditOnFocus: false,
          enablePaging: false,
          showFooter: false,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          columnDefs:column
    };
    //刷新主机列表
    $scope.refreshHostList = function() {
       $scope.refreshPage();
    };
    //双击主机行,跳转到主机页面
    $scope.jump = function(entity) {
        //跳转到对应主机概要页面,并且选中主机节点
        selectTreeNode($scope, 'main.vmwareHost.dashboard', 'v_host', 'list', null, undefined, $scope.cloudId+'host-'+entity.id);
    }
});

/**
 * vcenter 虚拟机列表
 */
routeApp.controller('vmwareVmListController', function($scope, $http, $modal, $translate, $timeout, $state, UtilService,HttpService,GridService,DomainService) {
    var titleLinkTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a custom-title="{{row.entity[col.field]}}" ng-click="showDetail(row.entity)" style="text-decoration:underline;">{{row.entity[col.field]}}</a></div>';
    var vmwareVmStatusTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' +
        '<div ng-if= \'row.entity[col.field] == "running"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_vm_running.svg"></span><span>' + $translate.instant("vm.execute") + '</span></div>' +
        '<div ng-if= \'row.entity[col.field] == "shutOff"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span>' + $translate.instant("vm.close") + '</span></div>' +
        '<div ng-if= \'row.entity[col.field] == "unknown"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_unkown.svg"></span><span>' + $translate.instant("vm.unkown") + '</span></div></div>';
    var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'20%',cellTemplate:titleLinkTemplate},
                  { field: 'hostName', displayName: $translate.instant('host.host') , sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'6%',cellTemplate:vmwareVmStatusTemplate},
                  { field: 'cpuRate', displayName: $translate.instant('common.cpuRate'), sortable: true, width:'11%', cellTemplate:progressTemplate},
                  { field: 'memRate', displayName: $translate.instant('common.memRate'), sortable: true, width:'11%', cellTemplate:progressTemplate},
                  { field: 'cpuNum', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'6%'},
                  { field: 'memSize', displayName: $translate.instant('vm.memory'), sortable: true, width:'7%',cellFilter:'byteUnitRender'},
                  { field: 'storage', displayName: $translate.instant('vmware.storageCapacity'), sortable: true, width:'7%',cellFilter:'byteUnitRender'},
                  { field: 'system', displayName: $translate.instant('common.os'), sortable: true, width:'22%',cellTemplate:titleTemplate}];
    $scope.mySelections = [];
    var params = {type:19};
    var url = "vmware/vcenter/" + $scope.entryId + "/vm/list";
    //主机池,集群,主机下的虚拟机查询(type:20-22)
    if ($scope.queryType) {
        url = "vmware/vcenter/" + $scope.cloudId + "/vm/list";
        params.type = $scope.queryType;
        params.key = $scope.queryKey;
    }
    
    $scope = GridService.grid($scope, url, params, undefined, undefined, 'vmwareVmListDiv');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    //监听刷新事件
    $scope.$on(constant.onReloadVmwareVmList, function(event, msg) {
        if ($scope.queryType) {
        if (msg.cloudId == $scope.cloudId) {
            $scope.refreshPage();
        }
        } else {
            if (msg.cloudId == $scope.entryId) {
                $scope.refreshPage();
            }
        }
    });
    
    listenNavClick($scope, $timeout);
    
    $scope.gridOptions = {
          data: 'myData',
          jqueryUITheme: false,
          jqueryUIDraggable: false,
          selectedItems: $scope.mySelections,
          showSelectionCheckbox: true,
          multiSelect: true,
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
          rowTemplate: doubleClickTemplate,    //双击行模板
          columnDefs:column
    };
    //刷新虚拟机机列表
    $scope.refreshVmList = function() {
       $scope.mySelections.splice(0, $scope.mySelections.length);
       $scope.status = "unknown";
       $scope.refreshPage();
       if (angular.isArray($scope.seleteOperator)) {
			$scope.seleteOperator.splice(0, $scope.seleteOperator.length);// clear
       }
       $scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
       if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
       }
    };
    
    $scope.status = "unknown";
    //监控选中虚拟机的状态，更新按钮栏
    $scope.$watch('mySelections', function(newValue, oldValue) {
        if (newValue && newValue.length == 1) {
            $timeout(function() {
                $scope.status = newValue[0].status;
            });
        }
    }, true);
    
    $scope.rightClick = function(row, e) {
        if (e.which == 3 && row.selected == false) {// 1:left, 2:middle, 3:right
            // unselected all rows
            $scope.gridOptions.selectAll(false);
            // select right click row
            $scope.gridOptions.selectRow(row.rowIndex, true);
        }
    };
    
    //点击名称链接,进入虚拟机详细信息
    $scope.showDetail = function(entity) {
        //查询虚拟机父节点信息
        var queryVmNodeUrl = 'tree/vcenter/vm/node?cloudId=' + entity.vCenterId +  '&vmKey=' + entity.vmKey;
        $http.get(queryVmNodeUrl).success(function(result){
            if (result.state == 0 && result.data) {
                var params = angular.copy(result.data.stateParams);
                params.status = entity.status;
                params.vmKey = entity.vmKey;
                params.id = entity.id;
                $state.go('main.vmwareVm.dashboard', params);
            }
            UtilService.handleResult(result);
         }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
         });
    }
    
    //批量操作虚拟机(不包括删除)
    $scope.batchOperateVm = function(type) {
        if ($scope.mySelections.length <= 0) {
            UtilService.alert($translate.instant('vm.vmSelectAlert'), $translate.instant('common.opertip'), false, 'error');
            return;
        }
        var operateInfo = {
                type:$translate.instant('menu.'+type),
        };
        DomainService.batchOperateVmwareVm(type, $scope.mySelections, operateInfo, $scope.showTaskList);
    };
    
    //创建快照
    $scope.createSnapshot = function() {
        if ($scope.status=='unknown') {
            return;
        }
        DomainService.createVmwareSnapshot($scope.entryId, $scope.mySelections[0].vmKey, $scope.mySelections[0].name, $scope.status);
    }
    
    //克隆为模板
    $scope.cloneTemplate = function() {
        if ($scope.status=='unknown') {
            return;
        }
        DomainService.cloneVmwareTemplate($scope.entryId, $scope.mySelections[0].vmKey, $scope.mySelections[0].name, $scope.status);
    }
    
    //分配虚拟机
    $scope.distributeVm = function() {
        if ($scope.status=='unknown') {
            return;
        }
        var vmData = {
                status:$scope.status,
                vmKey:$scope.mySelections[0].vmKey,
                name:$scope.mySelections[0].name
        };
        DomainService.distributeVm($scope.entryId, vmData);
    }
    
    //手工同步
    $scope.syncResource = function() {
        var operateInfo = {type:"VCenter",name:$scope.entryName};
        var syncInstance = UtilService.confirm($translate.instant('cloudResource.syncResourceConfirm', operateInfo),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            HttpService.put('cloud/'+ $scope.entryId +'/resource/sync');
        }, function () {
        });
    }
    
    //注册刷新事件
    $scope.$on(constant.onRefreshVmwareVmList, function(event, msg) {
    	if (msg == $scope.entryId) {
    		$scope.refreshVmList();
    	}
    });
    
    //导出
    $scope.exportVms = function() {
        var syncInstance = UtilService.confirm($translate.instant('cloudResource.exportVmsConfirm'),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            var param = "height=105, width=400, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
            var url = 'download/vcenter/vm?vCenterId=' + $scope.entryId + '&type=19';
            window.open(url, "_blank", param);
        }, function () {
        });
    }
    
    //注册刷新事件
    $scope.$on(constant.onReloadVmList, function(event, msg) {
        $scope.refreshVmList();
    });
    
    //搜索框
    $scope.$watch('filterName', function(newValue, oldValue) {
        if (newValue != oldValue) {
            //设置时间间隔
            if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
                $timeout.cancel($scope.keyInterval);
            }
            $scope.keyInterval = $timeout(function() {
                $scope.filterLock = true;//控制搜索框,在搜索期间不可输入.刷新完成后才可以输入,防止结果被覆盖.
                $scope.params.filterName = newValue;
                $scope.pagingOptions.currentPage = 1;
                $scope.refreshVmList();
            }, 1200);
        }
    });
    
    $scope.afterLoad = function() {
        $timeout(function() {
            $scope.filterLock = false;
        });
    }
    
    $scope.$on("$destroy", function() {//scope销毁时，销毁定时器
        if (angular.isDefined($scope.keyInterval)) {
            $timeout.cancel($scope.keyInterval);
        }
    });
});

//云资源虚拟机模板
routeApp.controller('VmwareTemplateListCtrl',['$scope','$http','$timeout', '$translate', 'GridService', 'UtilService', 'HttpService',
   function($scope, $http, $timeout, $translate, GridService, UtilService, HttpService) {
	var column = [{ field: 'title', displayName: $translate.instant('common.name'), sortable: true, width:'25%',cellTemplate:titleTemplate},
	              { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'15%'},
	              { field: 'memory', displayName: $translate.instant('template.memory'), cellFilter:'memory', sortable: true, width:'15%'},
	              { field: 'storageCapacity', displayName: $translate.instant('template.storage'),cellFilter:'byteUnitRender', sortable: true, width:'15%'},
	              { field: 'osVersion', displayName: $translate.instant('common.os'), sortable: true, width:'20%'},
	              ];
    var url = "template/list";
	var params = {};
	params.cloudId = $scope.entryId;
    $scope = GridService.grid($scope, url, params, null, null, 'templateDivId');
    $scope.getDataAsync();
    listenNavClick($scope, $timeout);  
    $scope.gridOptions = {
          data: 'myData',
          jqueryUITheme: false,
          jqueryUIDraggable: false,
          selectedItems: $scope.mySelections,
          multiSelect: false,
          showGroupPanel: false,
          showColumnMenu: true,
          showFilter: false,
          enableCellSelection: false,
          enableCellEditOnFocus: false,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          rowTemplate: doubleClickTemplate,    //双击行模板
          columnDefs:column,
          beforeSelectionChange: function (rowItem, event) {
              return beforeSelectionChange(rowItem, event);
          },
          afterSelectionChange: function (rowItem, event) {   // 选中事件完成后触发
        	  selectedRow.splice(0, selectedRow.length, rowItem.entity);
              if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {     // 在点击时，因为会有原来行与新选中行，这里只需要新选中行。
                  var rowObj = rowItem.entity;
                  $scope.queryTemplateDetails(rowObj);
              }
          }
    };
    
    // 选中行的数组
    var selectedRow = new Array();
    // 默认选中第一行，如果已经有选择的元素则继续选中。
    selectFirstLine($scope, selectedRow, 'uniqueKey');
    
    //刷新模板列表
    $scope.refreshTemplateList = function() {
       if ($scope.myData.length==1) {
           $scope.mySelections.splice(0, $scope.mySelections.length);
       }
       $scope.refreshPage();
    };
    
    //手工同步虚拟机模板
    $scope.syncResource = function() {
        var operateInfo = {type:"VCenter",name:$scope.entryName};
        var syncInstance = UtilService.confirm($translate.instant('cloudResource.syncResourceTemplateConfirm', operateInfo),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            HttpService.put('cloud/'+ $scope.entryId +'/resource/sync/temp');
        }, function () {
        });
    }
    
    //注册刷新事件
    $scope.$on(constant.onRefreshCvmVmList, function(event, msg) {
    	if (msg == $scope.entryId) {
    		$scope.refreshTemplateList();
    	}
    });
    
    $scope.currentTab = 'netCards';//默认选中的是网卡列表
    $scope.selectNet = function() {
        $timeout(function() {
            $scope.currentTab = 'netCards';
            $scope.queryTemplateDetails($scope.mySelections[0]);
        });
        
    }
    $scope.selectDisk = function() {
        $timeout(function() {
            $scope.currentTab = 'disks';
            $scope.queryTemplateDetails($scope.mySelections[0]);
        });
    }
    $scope.queryTemplateDetails = function(row) {
        if (!row) {
            return;
        }
        var detailUrl = 'vmware/vcenter/' + $scope.entryId + '/vm/detail';
        var detailParam = {
                isTemplate:true,
                key:row.uniqueKey,
                name:row.title
        };
        $http({
            method: 'GET',
            url: detailUrl,
            params: detailParam
        }).success(function (result) {
            if (result.state == 0 && result.data) {
                $scope.myData2 = result.data.networks;
                $scope.myData3 = result.data.storages;
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    //网卡列表
    var column2 = [{ field: 'mac', displayName: $translate.instant('host.mac'), sortable: true, width:'35%',cellTemplate:titleTemplate},
                  { field: 'name', displayName: $translate.instant('template.netname'), sortable: true, width:'15%'},];
    $scope.mySelections2 = [];
    $scope.myData2 = [];
    $scope.gridOptions2 = {
            data: 'myData2',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections2,
            multiSelect: false,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            i18n: $translate.instant('load.static.lang'),
            totalServerItems: 'totalServerItems',
            columnDefs:column2
     };
    
    //磁盘列表
    var column3 = [{ field: 'storeFile', displayName: $translate.instant('template.volName'), sortable: true, width:'35%',cellTemplate:titleTemplate},
                   { field: 'capacity', displayName: $translate.instant('template.capacity'), sortable: true, cellFilter:'byteUnitRender', width:'15%'},];
    $scope.mySelections3 = [];
    $scope.myData3 = [];
    $scope.gridOptions3 = {
            data: 'myData3',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections2,
            multiSelect: false,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            i18n: $translate.instant('load.static.lang'),
            totalServerItems: 'totalServerItems',
            columnDefs:column3
      };
    
}]);
/**
 * 删除vmware虚拟机对话框
 */
routeApp.controller('deleteVmwareVmCtrl',function($scope, $rootScope, $http, $translate, $modalInstance, $modal,  vmStatus, cloudId, vmList, UtilService) {
    $scope.del = {};
    $scope.del.type = 0;
    $scope.status = vmStatus;
    $scope.ok = function () {
        //修改问题单:201703140428   弹出确认提示时,不关闭删除选项对话框.
        if (vmList.length == 1) {
            //单个删除
            var confirmMsg = $translate.instant('vmware.confirmDelete');
            var modalInstance = UtilService.confirm(confirmMsg, $translate.instant('vm.deleteVm'));
            modalInstance.result.then(function (selectedItem) {
                var param = {
                        vCenterId:cloudId,
                        domainId:vmList[0].id,
                        name:vmList[0].title || vmList[0].name,
                        operateType:"delete",
                        delType:$scope.del.type
                };
                
                //如果删除磁盘，需要输入delete确认
                if ($scope.del.type == 1) {
                    var delmodalInstance = $modal.open({
                        templateUrl:'html/modal/common/deleteConfirm.html',
                        backdrop:"static",
                        controller:"deleteConfirmCtrl",
                        size:'mg',
                        width:'322px'
                    });
                    delmodalInstance.result.then(function(selectItem){
                        //201706290547  不存在虚拟机删除失败 --l12838
                         $http.put("vmware/vcenter/vm/operate", param).success(function(result){
				        	  UtilService.handleResult(result);
				        	  if (result.success == true || result.state == 1) {
				        		  $modalInstance.close('success');
				        	  }
				        	  if (result.state == 2) {
	                              $modalInstance.close('partSuccess');
	                          }
                                 $rootScope.$broadcast(constant.onReloadVmList);
                         }).error(function(response, code, headers, config) {
                            UtilService.handleError(code);
                         });
                    },function(reason){
                    });
                } else {
                     $http.put("vmware/vcenter/vm/operate", param).success(function(result){
			        	  UtilService.handleResult(result);
			        	  if (result.success == true || result.state == 1) {
			        		  $modalInstance.close('success');
			        	  }
			        	  if (result.state == 2) {
                              $modalInstance.close('partSuccess');
                          }
                             $rootScope.$broadcast(constant.onReloadVmList);
                     }).error(function(response, code, headers, config) {
                        UtilService.handleError(code);
                     });
                }
            }, function () {
            });
        } else {
            //批量删除
            var confirmParam = {type:$translate.instant('vm.batchDelete')};
            var confirmMsg = $translate.instant('vm.confirmBatchOperateVm', confirmParam);
            var modalInstance = UtilService.confirm(confirmMsg, $translate.instant('vm.deleteVm'));
            modalInstance.result.then(function (selectedItem) {
                var paramArr = [];
                for (var i = 0; i < vmList.length; i++) {
                    var param = {
                            vCenterId:vmList[i].vCenterId||vmList[i].cloudId,
                            domainId:vmList[i].id,
                            name:vmList[i].title || vmList[i].name,
                            operateType:"delete",
                            delType:$scope.del.type
                    };
                    paramArr.push(param);
                }
                
                //如果删除磁盘，需要输入delete确认
                if ($scope.del.type == 1) {
                    var delmodalInstance = $modal.open({
                        templateUrl:'html/modal/common/deleteConfirm.html',
                        backdrop:"static",
                        controller:"deleteConfirmCtrl",
                        size:'mg',
                        width:'322px'
                    });
                    delmodalInstance.result.then(function(selectItem){
//                       HttpService.put('vmware/vcenter/vm/batch/operate', paramArr, undefined, showTaskList);
                         //201706290547  不存在虚拟机删除失败 --l12838
                         $http.put("vmware/vcenter/vm/batch/operate", paramArr).success(function(result){
                             //删除异常时刷新数据
                             if (result.state != 0) {
                                 $rootScope.$broadcast(constant.onReloadVmList);
                             } else {
                                 //正常删除,关闭对话框.
                                 $modalInstance.close();
                             }
                             UtilService.handleResult(result);
                         }).error(function(response, code, headers, config) {
                            UtilService.handleError(code);
                         });
                    },function(reason){
                    });
                } else {
//                  HttpService.put('vmware/vcenter/vm/batch/operate', paramArr, undefined, showTaskList);
                     $http.put("vmware/vcenter/vm/batch/operate", paramArr).success(function(result){
                         //删除异常时刷新数据
                         if (result.state != 0) {
                             $rootScope.$broadcast(constant.onReloadVmList);
                         } else {
                             //正常删除,关闭对话框.
                             $modalInstance.close();
                         }
                         UtilService.handleResult(result);
                     }).error(function(response, code, headers, config) {
                        UtilService.handleError(code);
                     });
                }
            }, function () {
            });
        }
    };    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
/**
 * 快照vmware虚拟机对话框
 */
routeApp.controller('snapshotVmwareVmCtrl',function($scope, $translate, $modalInstance, vmStatus) {
    $scope.snap = {};
    $scope.showSnapMem = vmStatus=='running';
    if ($scope.showSnapMem) {
        $scope.snap.snapMem = false;
        $scope.snap.quiesce = false;
    }    
    $scope.ok = function () {
        $modalInstance.close($scope.snap);
    };    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
/**
 * 克隆vmware虚拟机为模板对话框
 */
routeApp.controller('cloneVmwareVmToTemplateCtrl',function($scope, $modal, $translate, $modalInstance, vcenterId) {
    $scope.template = {};
    $scope.checkNameParam = {vCenterId:vcenterId};
    
    //选择模板存储
    $scope.selectTempletStorage = function() {
        var modalInstance = $modal.open({
            templateUrl:'html/modal/vmware/vmwareStorageSelector.html',
            backdrop:"static",
            controller:"SelectVmwareStorageListCtrl",
            width:"540px",
            resolve: {
                url: function(){return 'vmware/'+vcenterId+'/storageList';},
        		type: function(){}
            }
        });
        modalInstance.result.then(function(selectItem){
            console.log(selectItem.targetPath);
            $scope.template.templetStoragePath = selectItem.name;
            $scope.template.morValue = selectItem.morValue;
        },function(reason){

        });
    }
    
    $scope.ok = function () {
        $modalInstance.close($scope.template);
    };    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
/**
 * 选择模板存储对话框
 */
routeApp.controller('SelectVmwareStorageListCtrl',function(type, url, $scope, $http, $modal, $translate, $modalInstance, UtilService, GridService, HttpService) {
    $scope.selectPool = {};       // 选中的存储
    $scope.queryStorageUrl = url;
    $scope.type = type;
    $scope.ok = function () {
        if ($scope.selectPool.targetPath) {
            var status = $scope.selectPool.status;
            if (status != "1") {
                UtilService.alert($translate.instant('template.selectActiveTemplateStorage'), $translate.instant('common.opertip'), false, 'error');
                return;
            }
        }
        $modalInstance.close($scope.selectPool);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
/**
 * vmware云主机详细信息
 */
routeApp.controller('vmwareVmController',function($scope, $modal, $translate, $timeout, $state, DomainService) {
    $scope.id = $scope.entryId;
    $scope.name = $scope.entryName;
    $scope.vmKey = $scope.vmKey;
    var msg = {id:$scope.vmKey, status:$scope.status};
    $scope.vm = DomainService.updateVmwareVmButton(msg);
    $scope.$on('onUpdateVmwareVmButton', function(event, msg) {
        $scope.status = msg.status;
        $timeout(function() {
            $scope.vm = DomainService.updateVmwareVmButton(msg);
        });
    });
    //操作虚拟机type:start, sleep, restart, shutdown, close
    $scope.operateVmwareVm = function(type) {
        var operateInfo = {
                type:$translate.instant('menu.'+type),
                name:$scope.name
        };
        DomainService.operateVmwareVm(type, $scope.name, $scope.vmKey, $scope.cloudId, operateInfo);
    };
   
    //删除
    $scope.deleteVm = function() {
        var goCloudHost = function() {
            $state.go('main.cloudHost');
        }
        var entity = {
                //修改问题单:201706240500 vmware虚拟机详细信息, 无法删除虚拟机问题
                id:$scope.id,
                name:$scope.name
        };
        DomainService.deleteVmwareVm([entity], $scope.status, $scope.cloudId, goCloudHost);
    }
    //创建快照
    $scope.createSnapshot = function() {
        DomainService.createVmwareSnapshot($scope.cloudId, $scope.vmKey, $scope.name, $scope.status);//$scope.showTaskList
    }
    //克隆为模板
    $scope.cloneTemplate = function() {
        DomainService.cloneVmwareTemplate($scope.cloudId, $scope.vmKey, $scope.name, $scope.status);
    }
    //迁移虚拟机
    $scope.migrateVm = function() {
        DomainService.migrateVmwareVm($scope.cloudId, $scope.vmKey);
    }
});
/**
 * vmware云主机详细信息-概要
 */
routeApp.controller('vmwareVmOverviewController',function($scope, $http, $modal, $timeout, $translate, $state, UtilService, DomainService) {
    
    $scope.dataList = [];//硬件信息列表
    
    //查询概要信息
    var querySummary = function() {
        var summaryUrl = 'vmware/' + $scope.cloudId + '/vm/summary';
        var params = {id:$scope.id,queryDevices:true};
        $http({
            method: 'GET',
            url: summaryUrl,
            params: params
        }).success(function (result) {
            if (result.state == 0) {
                $scope.summary = result.data;
                //组装硬件列表数据
                createDeviceData();
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    
    //组装dataList
    var createDeviceData = function() {
        if ($scope.summary) {
            //cpu
            var cpuItem = {};
            cpuItem.deviceType = "cpu";
            cpuItem.cpuRate = $scope.summary.cpuRate;
            cpuItem.cpucore = $scope.summary.cpu;
            $scope.dataList.push(cpuItem);
            //内存
            var memItem = {};
            memItem.deviceType = "memory";
            memItem.memory = $scope.summary.memory;
            memItem.memRate = $scope.summary.memoryRate;
            $scope.dataList.push(memItem);
            
            if ($scope.summary.devices) {
                //磁盘
                if ($scope.summary.devices.disks) {
                    for (var i = 0; i < $scope.summary.devices.disks.length; i++) {
                        var diskItem = angular.copy($scope.summary.devices.disks[i]);
                        diskItem.deviceType="disk";
                        $scope.dataList.push(diskItem);
                    }
                }
                //网卡
                if ($scope.summary.devices.netcards) {
                    for (var i = 0; i < $scope.summary.devices.netcards.length; i++) {
                        var netcardItem = angular.copy($scope.summary.devices.netcards[i]);
                        netcardItem.deviceType="net";
                        $scope.dataList.push(netcardItem);
                    }
                }
                //软驱
                if ($scope.summary.devices.floppies) {
                    for (var i = 0; i < $scope.summary.devices.floppies.length; i++) {
                        var floppyItem = angular.copy($scope.summary.devices.floppies[i]);
                        floppyItem.deviceType="floppy";
                        $scope.dataList.push(floppyItem);
                    }
                }
                //光驱 
                if ($scope.summary.devices.cdroms) {
                    for (var i = 0; i < $scope.summary.devices.cdroms.length; i++) {
                        var cdromItem = angular.copy($scope.summary.devices.cdroms[i]);
                        cdromItem.deviceType="cdrom";
                        $scope.dataList.push(cdromItem);
                    }
                }
            }
            
            //计算宽度和列数
            var hardwarePortWidth = $("#hardwarePort").width();
            
            $scope.col = Math.floor((hardwarePortWidth - 13) / 260);
            $scope.cols = [];
            for(var i = 0; i < $scope.col; i++){
                $scope.cols.push(i);
            }
            var hardwareBoxWidth = (hardwarePortWidth - 10*$scope.col) / $scope.col - 10;
            
            $scope.hardwareBoxWidth = hardwareBoxWidth;
            var line = Math.ceil($scope.dataList.length/$scope.col);
            
            $scope.lines = [];
            for(var i = 0; i < line; i++){
                $scope.lines.push(i);
            }
        }
    }
    //展示完成后重新调整宽度
    $scope.repaintDone = function(){
        $(".hardwareBox").each(function(){
            $(this).css("width", $scope.hardwareBoxWidth + "px");
        });
        $(".hardwareAttributes").css("width", $scope.hardwareBoxWidth - 80 + "px");
        var line = $scope.lines.length;
        if(line == 1 || line == 2){
            var height = $("#summary").height() - $("#hardwarePort").height() - 12;
            $("#usagePort").css("height", height + "px");
            var parentWidth = $(".overview-col").width();
            var parentHeight = $(".overview-col").height();
            $(".chartStyle").css("width", parentWidth + "px");
            $(".chartStyle").css("height", parentHeight - 50 + "px");
            $(".altStyle").css("padding-left", parentWidth/2 - 30 + 'px');
            $(".altStyle").css("padding-top", parentHeight/2 - 40 + 'px');
        }
    }
    
    querySummary();
    
    //刷新虚拟机状态
    var refreshStatus = function() {
        var summaryUrl = 'vmware/' + $scope.cloudId + '/vm/summary';
        var params = {id:$scope.id,queryDevices:true};
        $http({
            method: 'GET',
            url: summaryUrl,
            params: params
        }).success(function (result) {
            if (result.state == 0) {
                $timeout(function() {
                    $scope.summary = result.data;
                    //组装硬件列表数据
                    $scope.dataList.splice(0, $scope.dataList.length);
                    createDeviceData();
                });
                $scope.$emit('onUpdateVmwareVmButton', {id:$scope.vmKey, status:result.data.status});
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    $scope.$on(constant.onReloadVmList, function(event, msg) {
        if (msg && msg.refreshData && msg.refreshData[0] && 
                msg.refreshData[0].vCenterId == $scope.cloudId && msg.refreshData[0].vmKey == $scope.vmKey) {
            //修改问题单:201706240500 虚拟机详细信息删除,不跳转.  如果时删除,则跳转到上一层
            if (msg.refreshData[0].type == 'delete') {
                DomainService.stateGoVmwareVmList($state);             
            } else {
            refreshStatus();
        } 
        } 
    });
    
    //监听左侧导航和浏览器大小变化
    $scope.style = {};
    var onResize = function () {
        var hardwarePortWidth = $("#hardwarePort").width();
        
        $scope.col = Math.floor((hardwarePortWidth - 13) / 260);
        $scope.cols = [];
        for(var i = 0; i < $scope.col; i++){
            $scope.cols.push(i);
        }
        var hardwareBoxWidth = (hardwarePortWidth - 10*$scope.col) / $scope.col - 10;
        
        $scope.hardwareBoxWidth = hardwareBoxWidth;
        var line = Math.ceil($scope.dataList.length/$scope.col);
        
        $scope.lines = [];
        for(var i = 0; i < line; i++){
            $scope.lines.push(i);
        }
        $(".hardwareBox").each(function(){
            $(this).css("width", $scope.hardwareBoxWidth + "px");
        });
        $(".hardwareAttributes").css("width", $scope.hardwareBoxWidth - 80 + "px");
        var hardwarePortHeight = 35 + $(".hardwareRow").height * line;
        $("#hardwarePort").height(hardwarePortHeight);
        if(line == 1 || line == 2){
            var height = $("#summary").height() - $("#hardwarePort").height() - 12;
            $("#usagePort").css("height", height + "px");
        }
        
        $(".progressgray > .progress-bar span").each(function(){
            var ele = this;
            var progressWidth = $(ele).parents(".progressgray").width();
            var margin = (progressWidth - 30) / 2;
            $(ele).css("position", "relative");
            $(ele).css("margin-left", margin + "px");
            $(ele).css("bottom", 1 + "px");
        });
        //修改问题单201605310031，虚拟机概览上的CPU、内存利用率图表，在任务台出现后，超出了框框 c11817 2016-06-02
        var parentWidth = $(".overview-col").width();
        var parentHeight = $(".overview-col").height();
        $(".chartStyle").css("width", parentWidth + "px");
        $(".chartStyle").css("height", parentHeight - 50 + "px");
        $(".altStyle").css("padding-left", parentWidth/2 - 30 + 'px');
        $(".altStyle").css("padding-top", parentHeight/2 - 40 + 'px');
        if (angular.isDefined($scope.vmCpuRateChart)) {
            $scope.vmCpuRateChart.resize();
        }
        if (angular.isDefined($scope.vmMemRateChart)) {
            $scope.vmMemRateChart.resize();
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }
    //监听大小改变事件，同步刷新图表
    $scope.$on('onNavClick', function(event, msg) {
        setTimeout(onResize, 100);
    });
    $(window).on("resize", onResize);
    
    //CPU内存性能数据url
    var performanceUrl = 'vmware/vm/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.vmKey + '&type=';
    // 返回虚拟机CPU趋势数据。
    $scope.cpuRateUrl = performanceUrl + 'cpu';
    // 返回虚拟机内存趋势数据。
    $scope.memRateUrl = performanceUrl + 'mem';
    
    $scope.$on("$destroy", function() {
        $(window).off('resize', onResize);
    });
});
/**
 * vmware云主机详细信息-性能监控
 */
routeApp.controller('vmwareVmPerformanceController',function($scope, $http, $modal, $translate) {
    var performanceUrl = 'vmware/vm/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.vmKey + '&type=';
    // 返回虚拟机CPU趋势数据。
    $scope.cpuRateUrl = performanceUrl + 'cpu';
    // 返回虚拟机内存趋势数据。
    $scope.memRateUrl = performanceUrl + 'mem';
    // 返回虚拟机I/O趋势数据。
    $scope.ioUrl = performanceUrl + 'disk';
    // 返回虚拟机网络I/O趋势数据。
    $scope.netUrl = performanceUrl + 'net';
});
/**
 * VMWARE 主机池概要页签
 */ 
routeApp.controller('vmwareDCSummaryController', function($scope, $http, $modal, $translate, $timeout, UtilService,HttpService,EchartService) {
    $scope.summary = {};
    //概要
    $scope.queryDcSummary = function() {
        var dcUrl = "vmware/vcenter/" + $scope.cloudId + "/dc/summery";
        var params = {dcKey:$scope.hpKey};
        $http({
            method: 'GET',
            url: dcUrl,
            params: params
        }).success(function(result){
            if (result.state == 0) {
                $scope.summaryTimeout = $timeout(function() {
                    $scope.summary = result.data;
                });
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    $scope.queryDcSummary();
    
    //初始化图表
    var noDataText = $translate.instant('common.noData');
    var hostCircle = echarts.init(document.getElementById("vcenterHostCircle"));
    var hostCpuTop5Chart  = echarts.init(document.getElementById("vcenterHostCpuTop5Chart"));
    var hostMemoryTop5Chart = echarts.init(document.getElementById("vcenterHostMemoryTop5Chart"));
    var vmCpuTop5Chart = echarts.init(document.getElementById("vcenterVmCpuTop5Chart"));
    var vmMemoryTop5Chart = echarts.init(document.getElementById("vcenterVmMemoryTop5Chart"));
    //图表数据
    var queryChartsData = function() {
        // 获取主机状态
        EchartService.getHostStatus("vmware/vcenter/" + $scope.cloudId + "/hosts/state?type=" + constant.PUBLIC_CLOUD_HOST_POOL + "&key=" + $scope.hpKey, hostCircle);
        // top5主机CPU
        EchartService.hostTop5Cpu("vmware/vcenter/" + $scope.cloudId + "/top5/host/cpu?type=" + constant.PUBLIC_CLOUD_HOST_POOL + "&key=" + $scope.hpKey, hostCpuTop5Chart, noDataText, 'vcenterHostCpuTop5Chart');
        // Top5主机内存
        EchartService.hostTop5Mem("vmware/vcenter/" + $scope.cloudId + "/top5/host/memory?type=" + constant.PUBLIC_CLOUD_HOST_POOL + "&key=" + $scope.hpKey, hostMemoryTop5Chart, noDataText, 'vcenterHostMemoryTop5Chart');
        //top5 虚拟机cpu 嵌套圆环
        EchartService.vmTop5CpuFiveCricle("vmware/vcenter/" + $scope.cloudId + "/top5/vm/cpu?type=" + constant.PUBLIC_CLOUD_HOST_POOL + "&key=" + $scope.hpKey, vmCpuTop5Chart, noDataText, 'vcenterVmCpuTop5Chart');
        // top5虚拟机内存
        EchartService.vmTop5Mem("vmware/vcenter/" + $scope.cloudId + "/top5/vm/memory?type=" + constant.PUBLIC_CLOUD_HOST_POOL + "&key=" + $scope.hpKey, vmMemoryTop5Chart, noDataText, 'vcenterVmMemoryTop5Chart');
    }
    queryChartsData();
    //浏览器窗口resize的时候执行的函数
    $scope.resizeFun = function() {
         hostCpuTop5Chart.resize();
         hostMemoryTop5Chart.resize();
         hostCircle.resize();
         vmMemoryTop5Chart.resize();
         vmCpuTop5Chart.resize();
         if (vmCpuTop5Chart.getOption()) {
	    		vmCpuTop5Chart.setOption({
	    			legend :{
	    				x : vmCpuTop5Chart.getDom().offsetWidth * 2 / 3
         }
	    		})
			}
     };
   $(window).on('resize', $scope.resizeFun);
   $scope.$on(constant.onNavClick, function(event, msg) {
       $scope.resizeFun();
   });
    
    
    //销毁资源
    $scope.$on("$destroy", function() {
        if ($scope.summaryTimeout) {
            $timeout.cancel($scope.summaryTimeout);
        }
        if (hostCircle) {
            hostCircle.dispose();
        }
        if (hostCpuTop5Chart) {
            hostCpuTop5Chart.dispose();
        }
        if (hostMemoryTop5Chart) {
            hostMemoryTop5Chart.dispose();
        }
        if (vmCpuTop5Chart) {
            vmCpuTop5Chart.dispose();
        }
        if (vmMemoryTop5Chart) {
            vmMemoryTop5Chart.dispose();
        }
    });
});
/**
 * vmware集群
 */
routeApp.controller('vmwareClusterController',function($scope, $http, $modal, $translate, $timeout, DomainService, ClusterService, UtilService) {
    $scope.apiVersionFloat = parseFloat($scope.apiVersion);
    
    //在暂缺权限的情况下,临时处理安全审计员登录时,隐藏按钮
    $scope.hideButtons = true;
    $http.get("vmware/vcenter/button/view").success(function(result){
        $timeout(function() {
            $scope.hideButtons = result;
        });
    });    
    
    //增加虚拟机
    $scope.createDomain = function() {
        //修改问题单:201611180303 点击增加虚拟机按钮,判断集群是否有可用主机.
        var hasHostUrl = "vmware/vcenter/" + $scope.cloudId + "/cluster/hasActiveHost?clusterKey=" + $scope.clusterKey;
        $http.get(hasHostUrl).success(function(result){
            if (result.state == 0) {
                if (result.data == true) {
                    var vmInfo = {
                            cloudId : $scope.cloudId,
                            clusterKey : $scope.clusterKey,
                            apiVersion : $scope.apiVersion
                        };
                        DomainService.createVmwareVm(vmInfo, $scope.showTaskList);
                } else {
                    //弹出提示框
                    UtilService.alert($translate.instant('vmware.noActiveHostInCluster'), $translate.instant('common.opertip'), false, 'error');
                }
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    //配置HA
    $scope.configHA = function() {
        ClusterService.configVmwareHA($scope.cloudId, $scope.clusterKey);
    }
    //配置DRS
    $scope.configDRS = function() {
        ClusterService.configVmwareDRS($scope.cloudId, $scope.clusterKey);
    }
});
/**
 * VMWARE 集群概要页签
 */ 
routeApp.controller('vmwareClusterSummaryController', function($scope, $rootScope, $http, $modal, $translate, $timeout, UtilService,HttpService,EchartService) {
    $scope.summary = {};
    //概要
    $scope.queryClusterSummary = function() {
        var dcUrl = "vmware/vcenter/" + $scope.cloudId + "/cluster/summery";
        var params = {clusterKey:$scope.clusterKey};
        $http({
            method: 'GET',
            url: dcUrl,
            params: params
        }).success(function(result){
            if (result.state == 0) {
                $scope.summaryTimeout = $timeout(function() {
                    $scope.summary = result.data;
                    //修改问题单:201611160391  刷新导航树节点
                    var msg = {};
                    msg.type = "update";
                    msg.nodeType = "v_cluster";
                    msg.nodeTypeId = $scope.cloudId + $scope.clusterKey;
                    if ($scope.summary.dasEnable == 0) {
                        msg.icon = "icon-cluster-noha";
                    } else {
                        msg.icon = "icon-cluster-ha";
                    }
                    $rootScope.$broadcast("onCloudNodeChange", msg);
                });
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    $scope.queryClusterSummary();
    //接收时间刷新概要
    $scope.$on(constant.onReloadVmwareClusterSummary, function(event, msg) {
        if (msg && msg.cloudId == $scope.cloudId && msg.clusterKey == $scope.clusterKey) {
            if ($scope.summaryTimeout) {
                $timeout.cancel($scope.summaryTimeout);
            }
            $scope.queryClusterSummary();
        }
    });
    
    //初始化图表
    var noDataText = $translate.instant('common.noData');
    var hostCpuTop5Chart  = echarts.init(document.getElementById("vcenterHostCpuTop5Chart"));
    var hostMemoryTop5Chart = echarts.init(document.getElementById("vcenterHostMemoryTop5Chart"));
    var vmCpuTop5Chart = echarts.init(document.getElementById("vcenterVmCpuTop5Chart"));
    var vmMemoryTop5Chart = echarts.init(document.getElementById("vcenterVmMemoryTop5Chart"));
    //图表数据
    var queryChartsData = function() {
        // top5主机CPU
        EchartService.hostTop5Cpu("vmware/vcenter/" + $scope.cloudId + "/top5/host/cpu?type=" + constant.PUBLIC_CLOUD_CLUSTER + "&key=" + $scope.clusterKey, hostCpuTop5Chart, noDataText, 'vcenterHostCpuTop5Chart');
        // Top5主机内存
        EchartService.hostTop5Mem("vmware/vcenter/" + $scope.cloudId + "/top5/host/memory?type=" + constant.PUBLIC_CLOUD_CLUSTER + "&key=" + $scope.clusterKey, hostMemoryTop5Chart, noDataText, 'vcenterHostMemoryTop5Chart');
        //top5 虚拟机cpu 嵌套圆环
        EchartService.vmTop5CpuFiveCricle("vmware/vcenter/" + $scope.cloudId + "/top5/vm/cpu?type=" + constant.PUBLIC_CLOUD_CLUSTER + "&key=" + $scope.clusterKey, vmCpuTop5Chart, noDataText, 'vcenterVmCpuTop5Chart');
        // top5虚拟机内存
        EchartService.vmTop5Mem("vmware/vcenter/" + $scope.cloudId + "/top5/vm/memory?type=" + constant.PUBLIC_CLOUD_CLUSTER + "&key=" + $scope.clusterKey, vmMemoryTop5Chart, noDataText, 'vcenterVmMemoryTop5Chart');
    }
    queryChartsData();
    //浏览器窗口resize的时候执行的函数
    $scope.resizeFun = function() {
         hostCpuTop5Chart.resize();
         hostMemoryTop5Chart.resize();
         vmMemoryTop5Chart.resize();
         vmCpuTop5Chart.resize();
         if (vmCpuTop5Chart.getOption()) {
	    		vmCpuTop5Chart.setOption({
	    			legend :{
	    				x : vmCpuTop5Chart.getDom().offsetWidth * 2 / 3
         }
	    		})
			}
     };
   $(window).on('resize', $scope.resizeFun);
   $scope.$on(constant.onNavClick, function(event, msg) {
       $scope.resizeFun();
   });
    
    //销毁资源
    $scope.$on("$destroy", function() {
        if ($scope.summaryTimeout) {
            $timeout.cancel($scope.summaryTimeout);
        }
        if (hostCpuTop5Chart) {
            hostCpuTop5Chart.dispose();
        }
        if (hostMemoryTop5Chart) {
            hostMemoryTop5Chart.dispose();
        }
        if (vmCpuTop5Chart) {
            vmCpuTop5Chart.dispose();
        }
        if (vmMemoryTop5Chart) {
            vmMemoryTop5Chart.dispose();
        }
    });
});
/**
 * vmware集群-性能监控
 */
routeApp.controller('vmwareClusterPerformanceController',function($scope, $http, $modal, $translate) {
    var performanceUrl = 'vmware/cluster/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.clusterKey + '&type=';
    // cpu利用率。
    $scope.cpuRateUrl = performanceUrl + 'cpu';
    // 内存利用率(6.0取消了改数据)。
    $scope.memRateUrl = performanceUrl + 'mem';
    // 已经消耗的CPU
    $scope.efcpuUrl = performanceUrl + 'efcpu';
    // 已经消耗的内存
    $scope.efmemUrl = performanceUrl + 'efmem';
});
/**
 * vmware主机
 */
routeApp.controller('vmwareHostController',function($scope, $http, $modal, $translate, $timeout, DomainService) {
    $scope.apiVersionFloat = parseFloat($scope.apiVersion);
    
    //在暂缺权限的情况下,临时处理安全审计员登录时,隐藏按钮
    $scope.hideButtons = true;
    $http.get("vmware/vcenter/button/view").success(function(result){
        $timeout(function() {
            $scope.hideButtons = result;
        });
    });    
    
    $scope.createDomain = function() {
        var vmInfo = {
            cloudId : $scope.cloudId,
            clusterKey : $scope.clusterKey,
            hostKey : $scope.hostKey,
            apiVersion : $scope.apiVersion
        };
        DomainService.createVmwareVm(vmInfo, $scope.showTaskList);
    }
    //修改问题单：201609290412， 主机状态异常时，增加虚拟机按钮置灰
    $scope.hostState = 1;
    $scope.$on('vmwareHostState', function(event, msg) {
        $timeout(function() {
            $scope.hostState = msg;
        });
    });
});
/**
 * VMWARE 主机概要页签
 */ 
routeApp.controller('vmwareHostSummaryController', function($scope, $http, $modal, $translate, $timeout, UtilService,HttpService,EchartService) {
    $scope.summary = {};
    //概要
    $scope.queryHostSummary = function() {
        var dcUrl = "vmware/vcenter/" + $scope.cloudId + "/host/summery";
        var params = {hostKey:$scope.hostKey};
        $http({
            method: 'GET',
            url: dcUrl,
            params: params
        }).success(function(result){
            if (result.state == 0) {
                $scope.summaryTimeout = $timeout(function() {
                    $scope.summary = result.data;
                });
                $scope.$emit('vmwareHostState', result.data.status);
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    $scope.queryHostSummary();
    
    //初始化图表
    var noDataText = $translate.instant('common.noData');
    var vmCpuTop5Chart = echarts.init(document.getElementById("vcenterVmCpuTop5Chart"));
    var vmMemoryTop5Chart = echarts.init(document.getElementById("vcenterVmMemoryTop5Chart"));
    var monitorChart = echarts.init(document.getElementById("monitorChart"));
//    var hostMonitorNetChart = echarts.init(document.getElementById("hostMonitorNetChart"));
    //图表数据
    var queryChartsData = function() {
        //top5 虚拟机cpu 嵌套圆环
        EchartService.vmTop5CpuFiveCricle("vmware/vcenter/" + $scope.cloudId + "/top5/vm/cpu?type=" + constant.PUBLIC_CLOUD_HOST + "&key=" + $scope.hostKey, vmCpuTop5Chart, noDataText, 'vcenterVmCpuTop5Chart');
        // top5虚拟机内存
        EchartService.vmTop5Mem("vmware/vcenter/" + $scope.cloudId + "/top5/vm/memory?type=" + constant.PUBLIC_CLOUD_HOST + "&key=" + $scope.hostKey, vmMemoryTop5Chart, noDataText, 'vcenterVmMemoryTop5Chart');
        //主机性能监控仪表盘
        EchartService.getMonitorChart("vmware/vcenter/" + $scope.cloudId + "/host/monitor?key=" + $scope.hostKey, monitorChart);
        //主机网络流量统计
//        var netUrl = 'vmware/host/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.hostKey + '&type=net';
//        EchartService.drawNotXYTrend (netUrl, hostMonitorNetChart, getBlueRgba(0.5), true, noDataText, "Network");
    }
    queryChartsData();
    
    $scope.netUrl = 'vmware/host/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.hostKey + '&type=net';
    
    //浏览器窗口resize的时候执行的函数
    $scope.resizeFun = function() {
         monitorChart.resize();
//         hostMonitorNetChart.resize();
         vmMemoryTop5Chart.resize();
         vmCpuTop5Chart.resize();
         if (vmCpuTop5Chart.getOption()) {
	    		vmCpuTop5Chart.setOption({
	    			legend :{
	    				x : vmCpuTop5Chart.getDom().offsetWidth * 2 / 3
         }
	    		})
			}
     };
     $(window).on('resize', $scope.resizeFun);
     $scope.$on(constant.onNavClick, function(event, msg) {
         $scope.resizeFun();
     });
    
//    $scope.netUrl = 'vmware/host/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.hostKey + '&type=net';
    
    //销毁资源
    $scope.$on("$destroy", function() {
        if (vmCpuTop5Chart) {
            vmCpuTop5Chart.dispose();
        }
        if (vmMemoryTop5Chart) {
            vmMemoryTop5Chart.dispose();
        }
        if (monitorChart) {
            monitorChart.dispose();
        }
//        if (hostMonitorNetChart) {
//            hostMonitorNetChart.dispose();
//        }
    });
});
/**
 * vmware主机-性能监控
 */
routeApp.controller('vmwareHostPerformanceController',function($scope, $http, $modal, $translate) {
    var performanceUrl = 'vmware/host/performance?cloudId=' + $scope.cloudId + '&key=' + $scope.hostKey + '&type=';
    // cpu利用率。
    $scope.cpuRateUrl = performanceUrl + 'cpu';
    // 内存利用率。
    $scope.memRateUrl = performanceUrl + 'mem';
    // IO吞吐量统计MBps
    $scope.diskUrl = performanceUrl + 'io';
    // 网络吞吐量统计MBps
    $scope.netUrl = performanceUrl + 'net';
});
/**
 * vmware增加虚拟机
 */
routeApp.controller('vmwareCreateVmController',function(vmInfo, $scope, $rootScope, $modalInstance, $http, $timeout, $translate, $compile, HttpService, UtilService) {
    $scope.domain = {};
    $scope.domain.networks = [];
    $scope.domain.cloudId = vmInfo.cloudId;
    $scope.domain.clusterKey = vmInfo.clusterKey;
    $scope.domain.hostKey = vmInfo.hostKey;
    
    $scope.pageData = {};//仅页面显示,不做为参数传入后台
    $scope.pageData.selectPool = {};
    $scope.pageData.system = '0';
    $scope.pageData.cpuSocket = 1
    $scope.pageData.coresPerSocket = 1;//每个cpu的核数
    $scope.pageData.memoryUnitSelect = [{value:'GB',label:'GB'},{value:'MB',label:"MB"}];
    $scope.pageData.memoryUnit = 'GB';
    $scope.pageData.memory = 4;
    $scope.pageData.diskUnit = 'GB';
    $scope.pageData.diskSize = 40;
    $scope.pageData.netcardNum = '1'; //网卡数量
    $scope.pageData.netcards = [{},{},{},{}];
    //网络适配器
    $scope.pageData.adapters = [{value:'VirtualE1000', label:$translate.instant('vmware.VirtualE1000')},
                                {value:'VirtualE1000e', label:$translate.instant('vmware.VirtualE1000e')},
                                {value:'VirtualVmxnet2', label:$translate.instant('vmware.VirtualVmxnet2')},
                                {value:'VirtualVmxnet3', label:$translate.instant('vmware.VirtualVmxnet3')},
                                {value:'VirtualPCNet32', label:$translate.instant('vmware.VirtualPCNet32')},
                                {value:'VirtualVmxnet', label:$translate.instant('vmware.VirtualVmxnet')}];
    
    //名称校验参数
    $scope.checkNameParam = {vCenterId:vmInfo.cloudId};
    
    $scope.osList = [];
    //查询支持的操作系统systemType：windowsGuest(window)，linuxGuest(linux)
    $scope.getSupportedGuest = function(systemType) {
        var param = '?clusterKey=' + $scope.domain.clusterKey + '&systemType=' + systemType;
        if ($scope.domain.hostKey) {
            param = '?clusterKey=' + $scope.domain.clusterKey + '&hostKey=' + $scope.domain.hostKey + '&systemType=' + systemType;
        }                    
        var querySupportedGuestUrl = 'vmware/vcenter/'+$scope.domain.cloudId+'/guest/supported' + param;
        $http.get(querySupportedGuestUrl).success(function(result){
            $timeout(function() {
                if (result.state == 0) {
                    $scope.osList.splice(0, $scope.osList.length);
                    var supportedArr = result.data;
                    if (supportedArr.length > 0) {
                        for (var i = 0; i < supportedArr.length; i++) {
                            var item = {};
                            item.value = supportedArr[i].guestId;
                            item.label = supportedArr[i].guestFullName;
                            $scope.osList.push(item);
                        }
                    }
                }
            });
        });
    }    
    $scope.$watch('pageData.system', function() {
        if ($scope.pageData.system == "0") {
            $scope.getSupportedGuest('windowsGuest');
            $scope.domain.guestId = 'windows7Server64Guest';  //widows列表设置初始值
        } else {
            $scope.getSupportedGuest('linuxGuest');
            if (vmInfo.apiVersion == '5.0' || vmInfo.apiVersion == '5.1') {
                $scope.domain.guestId = 'rhel6_64Guest'; //linux列表设置初始值
            } else {
                $scope.domain.guestId = 'rhel7_64Guest'; //linux列表设置初始值
            }
        }
    });
    
    //步骤提示的显示
    $scope.guidStep = [ $translate.instant('vmware.basicInfo'),
                        $translate.instant('vmware.hardware')];
    
    $scope.stepIndex = 1;
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true")
                return true;
            return false;
        },
        stepTwoOver : function() {
            if ($('#form2').val() === "true")
                return true;
            return false;
        }
    };
    $scope.nextCallBack = {
        '1': function() {
            $scope.stepIndex = 2;            
        }
    };
    
    //增加按钮栏插件
    $scope.addPlug = {
            '1': function() {
                //向plugin插入组件
                var menuPlug = '<div class="btn-group" style="float:left;" role="group" aria-label="...">' + 
                '<label class="btn btn-default btn-menu" ng-click="addDevice(form2, \'nic\')">' + 
                    '<span class="sm-icon icon-net"></span><span translate="addDomain.addNetwork"></span>' +
                '</label>' +
                '</div>';
               var template = angular.element(menuPlug);
               var cElement = $compile(template)($scope);
               return cElement;
            }
      };
    var addNetwork = function(boxId, index) {
        $scope.netIndex++;
                  
        var parentElement = $('#' + boxId);
        //拼出需要的html，不能用指令标签，因为会编译所有的指令标签。
        //取自模板：html/template/input/vmwareNetwork.html
        var html = '<div vmware-network form="form2" index="' + index + 
                   '" cluster-key="' + $scope.domain.clusterKey + '" host-key="' + $scope.domain.hostKey + 
                   '" cloud-id="' + $scope.domain.cloudId + '" bind-model="pageData.netcards[' + index + 
                   ']" guest-id="domain.guestId" delete-icon=true></div>';
        var template = angular.element(html);
        var cElement = $compile(template)($scope);
        parentElement.append(cElement); 
    };
    var getNetworkIndex = function() {
        for (var i = 1; i < 4; i++) {
            if (!$scope.pageData.netcards[i] || !$scope.pageData.netcards[i].deviceName) {
                return i;
            }            
        }
        return 0;
    };
    var getNetworkNum = function() {
        var num = 0;
        for (var i = 1; i < 4; i++) {
            if ($scope.pageData.netcards[i] && $scope.pageData.netcards[i].deviceName) {
                num++;
            }            
        }
        return num;
    };
    $scope.addDevice = function(form, type) {
        if (angular.isUndefined($scope.form2)) {
            $scope.form2 = form;
        }        
        var netNum = getNetworkNum();
        if (netNum >= 3) {
            UtilService.alert($translate.instant('vmware.netcardMaxTip'), $translate.instant('common.opertip'), false, 'error');
            return;
        }
        var netIndex = getNetworkIndex();        
        addNetwork('vmwareNetwork_add_' + netIndex, netIndex);
        //如果form出现滚动条，则跳转至最底下
        $timeout(function() {
            var configForm = $('#addVmConfigForm');
            if (configForm[0].scrollHeight > 263) {//如果出现滚动条
                configForm[0].scrollTop = configForm[0].scrollHeight - 263;
            }     
        }, 50);             
    };
    
    //将页面参数加入domain
    var resetDomain = function() {
        //cpu总核数
        $scope.domain.coresPerSocket = $scope.pageData.coresPerSocket;
        $scope.domain.cpuCore = $scope.pageData.cpuSocket * $scope.pageData.coresPerSocket;
        //内存
        if ($scope.pageData.memoryUnit == 'GB') {
            $scope.domain.memory = $scope.pageData.memory * 1024;
        } else {
            $scope.domain.memory = $scope.pageData.memory;
        }
        //存储器
        $scope.domain.datastoreName = $scope.pageData.selectPool.name;
        $scope.domain.datastoreKey = $scope.pageData.selectPool.morValue;
        //磁盘
        $scope.domain.diskModel = $scope.pageData.diskModel;//置备方式
        if ($scope.pageData.diskUnit == "GB") {
            $scope.domain.diskSize = $scope.pageData.diskSize * 1048576;
        } else {
            $scope.domain.diskSize = $scope.pageData.diskSize * 1024
        }
        //调整网卡数量
        $scope.domain.networks.splice(0, $scope.domain.networks.length);
        for (var i = 0; i < 4; i++) {
            if ($scope.pageData.netcards[i] && $scope.pageData.netcards[i].deviceName) {
                $scope.domain.networks.push($scope.pageData.netcards[i]);
            }
        }
    }
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
        resetDomain();
        HttpService.post('vmware/domain', $scope.domain, $modalInstance, $rootScope.showTaskList);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
/**
 * vmware迁移虚拟机
 */
routeApp.controller('vmwareMigrateVmController',function(vmInfo, $scope, $rootScope, $modalInstance, $http, $timeout, $translate, HttpService, UtilService) {
    $scope.model = {};      //向后台传递的模型
    //  迁移主机
    var MIGRATE_HOST = 0;
    //  迁移存储
    var MIRGRATE_STORAGE = 1;
    //  迁移主机和存储
    var MIGRATE_HOST_STORAGE = 2;
    
    $scope.model.cloudId = vmInfo.cloudId;
    $scope.model.vmKey = vmInfo.vmKey;
    
    $scope.pageData = {};   //页面用到单不传入后台的数据
    $scope.pageData.migrateType = MIGRATE_HOST;
    $scope.pageData.targetHost = {};//选中的主机
    $scope.pageData.selectPool = {};//选中的存储器
    
    //步骤提示的显示
    $scope.changeHostStep = [$translate.instant('migrateVm.selectMigrateType'),
                             $translate.instant('migrateVm.selectTargetHost')];
    $scope.changeStorageStep = [$translate.instant('migrateVm.selectMigrateType'),
                                $translate.instant('migrateVm.selectTargetStorage')];
    $scope.changeHostAndStorageStep = [$translate.instant('migrateVm.selectMigrateType'),
                                       $translate.instant('migrateVm.selectTargetHost'),
                                       $translate.instant('migrateVm.selectTargetStorage')];
    $scope.step = $scope.changeHostStep;
    
    $scope.isOnline = vmInfo.status == 'running';
    if ($scope.isOnline) {
        $scope.pageData.migrateType = MIRGRATE_STORAGE;
    }
    
    //根据迁移类型调整导航步骤
    $scope.$watch('pageData.migrateType', function() {
        $timeout(function() { 
            if ($scope.pageData.migrateType == MIGRATE_HOST_STORAGE) {
                $scope.step = $scope.changeHostAndStorageStep;
                $scope.unselectNode();
            } else if ($scope.pageData.migrateType == MIRGRATE_STORAGE) {
                $scope.step = $scope.changeStorageStep;
                $scope.pageData.targetHostKey = vmInfo.hostKey;
                $scope.queryStorageUrl = 'vmware/'+vmInfo.cloudId+'/storageList?type=3&key='+vmInfo.hostKey;
            } else {
                $scope.step = $scope.changeHostStep;
                $scope.unselectNode();
            }
            $scope.accessMsg = undefined;
            $scope.showTargetHost = false;
            $scope.showTargetStorage = false;
        });     
    }); 
    //树去选中, 并且targetHostKey值空
    $scope.unselectNode = function() {
        $scope.pageData.targetHostKey = undefined;
        $scope.pageData.targetHost = {};
        var hostTree = $('#hostTreeview1').data('treeview');
        if (hostTree) {
            var selectNodes = hostTree.getSelected();
            if (selectNodes.length > 0) {
                hostTree.unselectNode(selectNodes);
            }
        }
    }
    $scope.isHostAccess = false;
    //监控targetHost的变化
    $scope.$watch('pageData.targetHost', function(newValue, oldValue) {
        $timeout(function() {           
            if (newValue && newValue.key) {
                $scope.pageData.targetHostKey = newValue.key;
                $scope.queryStorageUrl = 'vmware/'+vmInfo.cloudId+'/storageList?type=3&key='+newValue.key;
            }
        }); 
        //如果只迁移主机,则检查主机是否可访问虚拟机使用的存储
        if ($scope.pageData.migrateType == MIGRATE_HOST && 
                ((newValue && oldValue && newValue.key != oldValue.key) || (newValue && !oldValue))) {
            $scope.checkTargetHost(vmInfo.cloudId, vmInfo.vmKey, newValue.key);
        }
    }); 
    
    $scope.checkTargetHost = function(cloudId, vmKey, hostKey) {
        $scope.isHostAccess = false;
        $scope.accessMsg = undefined;
        var accessUrl = "vmware/vcenter/hostAccess?cloudId=" + cloudId + "&vmKey=" + vmKey + "&hostKey=" + hostKey;
        $http.get(accessUrl).success(function(result){
            $timeout(function() {
                $scope.isHostAccess = result.state == 0;
                $scope.accessMsg = result.failureMessage;
            });
         }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
         });
    }
    $scope.nextCallBack = {
            '1': function() {
                if ($scope.pageData.migrateType != MIRGRATE_STORAGE) {
                    $scope.showTargetHost = true;
                    $scope.showTargetStorage = false;
                } else {
                    $scope.showTargetHost = false;
                    $scope.showTargetStorage = true;
                }
            },
            '2':function() {
                if ($scope.pageData.migrateType == MIGRATE_HOST_STORAGE) {
                    $scope.showTargetStorage = true;
                    return submitCheck();
                }
            }
        };
    //提交前检查
    var submitCheck = function() {
        if ($scope.model.migrateType != MIRGRATE_STORAGE) {
            //主机状态判断
            if($scope.pageData.targetHost.entryType == 'v_host' && $scope.pageData.targetHost.icon != 'icon-host-normal-gray' &&
               $scope.pageData.targetHost.icon != 'icon-host-warning-gray') {//修改问题单:201611170275 迁移虚拟机,目的主机为告警状态主机,点击下一步弹出提示框问题
                UtilService.alert($translate.instant('common.hostStatusAlarm'), $translate.instant('common.opertip'), false, 'error');
                return false;
            }
        }
        return true;
    }
    
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true")
                return true;
            return false;
        },
        stepTwoOver : function() {
            if ($scope.pageData.targetHost.entryType == 'v_host') {
                if ($scope.pageData.migrateType == MIGRATE_HOST) {
                    return $scope.isHostAccess;
                } else {
                    return true;
                }
            }
            return false;
        },
        stepThreeOver : function() {
            if ($scope.pageData.selectPool && $scope.pageData.selectPool.morValue)
                return true;
            return false;
        }
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
        if(!submitCheck()) {
            return;
        }
        $scope.model.cloudId = vmInfo.cloudId;
        $scope.model.vmKey = vmInfo.vmKey;
        $scope.model.vmName = vmInfo.vmName;
        $scope.model.hostKey = $scope.pageData.targetHostKey;
        if ($scope.pageData.selectPool && $scope.pageData.selectPool.morValue) {
            $scope.model.storageKey = $scope.pageData.selectPool.morValue;
        }
        HttpService.put('vmware/domain/migrate', $scope.model, $modalInstance,  $scope.showTaskList);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
/**
 * vmware配置集群HA
 */
routeApp.controller('vmwareConfigHAController',function(clusterInfo, $scope, $rootScope, $modal, $modalInstance, $http, $timeout, $translate, HttpService, UtilService) {
    $scope.model = {};      //向后台传递的模型
    
    $scope.btntext = $translate.instant("common.finish");
    $scope.pageData = angular.copy(clusterInfo);   //页面用到单不传入后台的数据
    $scope.pageData.hostMonitoring = clusterInfo.hostMonitoring == 'enabled';//主机监控状态
    $scope.pageData.admissionControlPolicyType = 1;
    if (!$scope.pageData.admissionControlPolicy) {
        $scope.pageData.admissionControlPolicy = {};
    }
    //将秒转换成小时
    if (clusterInfo.maxFailureWindow >= 3600) {
        $scope.pageData.maxFailureWindow = clusterInfo.maxFailureWindow / 3600;
    } else {
        $scope.pageData.maxFailureWindow = undefined;
    }
    
    //给接入控制策略选择赋值
    if ($scope.pageData.admissionControlPolicy.policyType == 1) {
        $scope.pageData.admissionControlPolicyType = 1;
        $scope.pageData.admissionControlPolicy.cpuFailoverResourcesPercent = 25;
        $scope.pageData.admissionControlPolicy.memoryFailoverResourcesPercent = 25;
    } else if ($scope.pageData.admissionControlPolicy.policyType == 2) {
        $scope.pageData.admissionControlPolicyType = 2;
        $scope.pageData.admissionControlPolicy.failoverLevel = 1;
    } else if ($scope.pageData.admissionControlPolicy.policyType == 3) {
        $scope.pageData.admissionControlPolicyType = 3;
        $scope.pageData.admissionControlPolicy.failoverLevel = 1;
        $scope.pageData.admissionControlPolicy.cpuFailoverResourcesPercent = 25;
        $scope.pageData.admissionControlPolicy.memoryFailoverResourcesPercent = 25;
        if (angular.isArray($scope.pageData.admissionControlPolicy.failoverHostList)) {
            $scope.pageData.failoverHostNum = $translate.instant('vmware.failoverHostNum', 
                    {num:$scope.pageData.admissionControlPolicy.failoverHostList.length});
        }
    }
    
    //步骤提示的显示
    $scope.stepOne = [$translate.instant('vmware.clusterConfigStep1')];
    $scope.stepTwo = [$translate.instant('vmware.clusterConfigStep1'),
                      $translate.instant('vmware.clusterConfigStep2')];
    $scope.guidStep = $scope.stepOne;
    
    //监控HA是否开启,如果关闭,则同步关闭其他功能
    $scope.$watch('pageData.enable', function(newValue, oldValue) {
        $timeout(function() {
            if (newValue == false) {
                $scope.guidStep = $scope.stepOne;
                $scope.pageData.hostMonitoring = false;
                $scope.pageData.admissionControlEnabled = false;
                $scope.btntext = undefined;
            } else if (newValue == true) {
                $scope.guidStep = $scope.stepTwo;
                $scope.btntext = $translate.instant("common.finish");
            }
        });     
    }); 
    //虚拟机重新启动优先级选项
    $scope.vmRestartPriorityArr = [{value:'disabled', label:$translate.instant('vmware.disabled')},
                                   {value:'low', label:$translate.instant('vmware.low')},
                                   {value:'medium', label:$translate.instant('vmware.medium')},
                                   {value:'high', label:$translate.instant('vmware.high')}];
    //主机隔离响应选项
    $scope.isolationResponseArr = [{value:'none', label:$translate.instant('vmware.keepOnPower')},
                                   {value:'powerOff', label:$translate.instant('vmware.powerOff')},
                                   {value:'shutdown', label:$translate.instant('vmware.shutoff')}];
    //虚拟机监控选项
    $scope.vmMonitoringArr = [{value:'vmMonitoringDisabled', label:$translate.instant('vmware.disabled')},
                              {value:'vmMonitoringOnly', label:$translate.instant('vmware.monitorVmOnly')},
                              {value:'vmAndAppMonitoring', label:$translate.instant('vmware.monitorVmAndApp')}];
    
    //选中故障切换主机
    $scope.selectSwitchhost = function() {
        if ($scope.pageData.admissionControlPolicyType != 3) {
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/vmware/managedEntitySelector.html',
            backdrop: 'static',
            controller:"SelectVMwareHostListCtrl",         
            resolve: {
                paramsObj:function(){
                    var obj = {};
                    obj.cloudId = clusterInfo.cloudId;
                    obj.type = constant.PUBLIC_CLOUD_CLUSTER;
                    obj.key = clusterInfo.clusterKey;
                    obj.title = $translate.instant('vmware.failoverHostTip');
                    if (clusterInfo.admissionControlPolicy) {
                        obj.hostKeyArr = $scope.pageData.admissionControlPolicy.failoverHostList;
                    }
                    return obj;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            if(angular.isArray(selectedItem)){
                if ($scope.pageData.admissionControlPolicy.failoverHostList) {
                    $scope.pageData.admissionControlPolicy.failoverHostList.splice(0, $scope.pageData.admissionControlPolicy.failoverHostList.length);
                } else {
                    $scope.pageData.admissionControlPolicy.failoverHostList = [];
                }
                for(var i=0;i<selectedItem.length;i++){
                    var key = 'host-' + selectedItem[i].id;
                    $scope.pageData.admissionControlPolicy.failoverHostList.push(key);
                }
                $scope.pageData.failoverHostNum = $translate.instant('vmware.failoverHostNum', 
                        {num:$scope.pageData.admissionControlPolicy.failoverHostList.length});
            }
        }, function (reason) {
        });
    }
    
    $scope.pageIndex = 1;
    $scope.nextCallBack = {
        '1': function() {
            $scope.pageIndex = 2;
            $scope.btntext = undefined;
        }
    };
    $scope.preCallBack = {
        '0': function() {
            $scope.btntext = $translate.instant("common.finish");
        }
    };
    
    //组装传入后台的参数
    var setModel = function() {
        $scope.model.cloudId = $scope.pageData.cloudId;
        $scope.model.clusterKey = $scope.pageData.clusterKey;
        $scope.model.clusterName = $scope.pageData.clusterName;
        $scope.model.enable = $scope.pageData.enable;
        //如果开启集群HA,则传入后续参数
        if ($scope.pageData.enable) {
            $scope.model.hostMonitoring = $scope.pageData.hostMonitoring?'enabled':'disabled';
            $scope.model.admissionControlEnabled = $scope.pageData.admissionControlEnabled;
            if ($scope.pageData.admissionControlEnabled) {
                $scope.model.admissionControlPolicy = {};
                $scope.model.admissionControlPolicy.policyType = $scope.pageData.admissionControlPolicyType;
                if ($scope.pageData.admissionControlPolicyType == 1) {
                    $scope.model.admissionControlPolicy.failoverLevel = $scope.pageData.admissionControlPolicy.failoverLevel;
                } else if ($scope.pageData.admissionControlPolicyType == 2) {
                    $scope.model.admissionControlPolicy.cpuFailoverResourcesPercent = $scope.pageData.admissionControlPolicy.cpuFailoverResourcesPercent;
                    $scope.model.admissionControlPolicy.memoryFailoverResourcesPercent = $scope.pageData.admissionControlPolicy.memoryFailoverResourcesPercent;
                } else if ($scope.pageData.admissionControlPolicyType == 3) {
                    $scope.model.admissionControlPolicy.failoverHostList = $scope.pageData.admissionControlPolicy.failoverHostList;
                }
            }
            $scope.model.vmRestartPriority = $scope.pageData.vmRestartPriority;
            $scope.model.isolationResponse = $scope.pageData.isolationResponse;
            $scope.model.vmMonitoring = $scope.pageData.vmMonitoring;
            $scope.model.failureInterval = $scope.pageData.failureInterval;
            $scope.model.minUpTime = $scope.pageData.minUpTime;
            $scope.model.maxFailures = $scope.pageData.maxFailures;
            if ($scope.pageData.maxFailureWindow > 0) {
                $scope.model.maxFailureWindow = $scope.pageData.maxFailureWindow * 3600;//小时转成秒
            } else {
                $scope.model.maxFailureWindow = -1;
            }
        }        
    }
    
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true")
                return true;
            return false;
        },
        stepTwoOver : function() {
            if ($('#form2').val() === "true") {
                return true;
            }
            return false;
        }
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
        setModel();
        HttpService.put('vmware/cluster/ha', $scope.model, $modalInstance,  $scope.showTaskList);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//选择vmware主机列表控制器
routeApp.controller('SelectVMwareHostListCtrl',function(paramsObj, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
    var column = [{ field: 'name', displayName: $translate.instant('cluster.hostname') , sortable: true, width:'100%'}];
    $scope.mySelections = [];
    var ispageing = true;
    var hostKeyArr = paramsObj.hostKeyArr;
    var params = {
            type:paramsObj.type,
            key:paramsObj.key
    };
    $scope.title = paramsObj.title;
    
    var url = 'vmware/vcenter/' + paramsObj.cloudId + '/host/list';
    $scope = GridService.grid($scope, url, params, null, null, 'vmwareEntitySelectorDiv');
    $scope.getDataAsync();
    
    $scope.gridOptions = {
      data: 'myData',
      jqueryUITheme: false,
      jqueryUIDraggable: false,
      selectedItems: $scope.mySelections,
      showSelectionCheckbox: true,
      multiSelect: true,
      showGroupPanel: false,
      showColumnMenu: true,
      showFilter: false,
      enableCellSelection: false,
      enableCellEditOnFocus: false,
      enablePaging: ispageing,
      showFooter: false,
      i18n: $translate.instant('load.static.lang'),
      totalServerItems: 'totalServerItems',
      filterOptions: $scope.filterOptions,
      pagingOptions: $scope.pagingOptions,
      columnDefs:column
    };
    
    selectHostList = function(){
        if (angular.isUndefined(hostKeyArr) || !angular.isArray(hostKeyArr) || $scope.myData.length == 0) {
            return;
        }
        for (var i = 0; i < $scope.myData.length; i++) {
            var key = 'host-'+$scope.myData[i].id;
            if ($.inArray(key, hostKeyArr) >= 0) {
                $scope.gridOptions.selectRow(i, true);
            }
        }
    };
    $scope.$on('ngGridEventData', function(row, event) {
         selectHostList();
    });

    $scope.ok=function(){
        $modalInstance.close($scope.mySelections);
    };  
    $scope.cancel=function(){
        $modalInstance.dismiss("cancel");
    };
});
/**
 * vmware配置集群DRS
 */
routeApp.controller('vmwareConfigDRSController',function(clusterInfo, $scope, $rootScope, $modal, $modalInstance, $http, $timeout, $translate, HttpService, UtilService) {
    $scope.model = {};      //向后台传递的模型
    
    $scope.pageData = angular.copy(clusterInfo);   //页面用到但不传入后台的数据
    if (clusterInfo.dpmEnable && clusterInfo.defaultDpmBehavior == 'manual') {
        $scope.pageData.dpm = 'manual';
    } else if (clusterInfo.dpmEnable && clusterInfo.defaultDpmBehavior == 'automated') {
        $scope.pageData.dpm = 'automated';
    } else {
        $scope.pageData.dpm = 'disabled';
    }
    
    //组装传入后台的参数
    var setModel = function() {
        $scope.model.cloudId = $scope.pageData.cloudId;
        $scope.model.clusterKey = $scope.pageData.clusterKey;
        $scope.model.clusterName = $scope.pageData.clusterName;
        $scope.model.enable = $scope.pageData.enable;
        //如果开启集群DRS,则传入后续参数
        if ($scope.pageData.enable) {
            $scope.model.defaultVmBehavior = $scope.pageData.defaultVmBehavior;
            $scope.model.vmotionRate = $scope.pageData.vmotionRate;
            if ($scope.pageData.dpm == 'disabled') {
                $scope.model.dpmEnable = false;
            } else {
                $scope.model.dpmEnable = true;
                $scope.model.defaultDpmBehavior = $scope.pageData.dpm;
            }
            $scope.model.hostPowerActionRate = $scope.pageData.hostPowerActionRate;
        }        
    }
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
        setModel();
        HttpService.put('vmware/cluster/drs', $scope.model, $modalInstance,  $scope.showTaskList);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});