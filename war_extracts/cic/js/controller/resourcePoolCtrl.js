/**
 *资源池管理控制器 
 */

//资源池列表
routeApp.controller('resourcePoolListCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, OrgService, ResourcePoolService){
    //资源池列表
    var operationTemplate = '<div><div class="ngCellButton">'
        +'<div type="button" has-permission="RESOURCEPOOL_MODIFY" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyResourcePool(row.entity)" has-permission="ORGANIZATION_MODIFY" custom-title="{{\'common.modify\'|translate}}"></div>'
        +'<div type="button" has-permission="RESOURCEPOOL_DELETE" class="btn btn-sm-icon icon-delete-gray" ng-click="deleteResourcePool(row.entity)" has-permission="ORGANIZATION_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
        +'</div></div>';
    
    var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'15%',cellTemplate:titleLinkTemplate},
                  { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'20%',cellTemplate:titleTemplate},
                  { field: 'cloudType', displayName: $translate.instant('common.type'), sortable: true, width:'10%', cellFilter:'cloudType'},
                  { field: 'orgName', displayName: $translate.instant('org.org'), sortable: true, width:'15%', cellTemplate:titleTemplate},
                  { field: 'cpu', displayName: $translate.instant('resourcePool.cpu'), sortable: true, width:'10%'},
                  { field: 'memory', displayName: $translate.instant('resourcePool.memory'), sortable: true, width:'10%', cellFilter:'byteUnitRender'},
                  { field: 'totalStorageCapacity', displayName: $translate.instant('resourcePool.storage'), sortable: true, width:'10%', cellFilter:'byteUnitRender'},
                  { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'10%', cellTemplate:operationTemplate}
                  ];
    
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    var url = "resourcePool/queryList";
    $scope = GridService.grid($scope, url, null, null, null,'resourcePoolListDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
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
          enablePaging: true,
          showFooter: true,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          columnDefs:column,
          rowTemplate: doubleClickTemplate    // 双击行模板
    };
    
    /**
     * 监听刷新资源池消息
     */
    $scope.$on(constant.onRefreshResourcePool, function(msg) {
        $scope.refreshPage();
    });
    /**
     * 监听资源池节点变化
     */
    $scope.$on(constant.onVDCNodeChange, function(msg) {
        $scope.refreshPage();
    });
    
    //跳转到资源池
    $scope.jump = function(entity) {
        //跳转到对应主机概要页面,并且选中主机节点
        selectTreeNode($scope, 'main.resourcePool.summary', 'resource_pool', 'list', null, undefined, 'resource_pool_'+entity.id);
    }

    // 增加资源池
	$scope.addResourcePool=function(){
	    ResourcePoolService.addResourcePool();
	};
	//修改资源池
	$scope.modifyResourcePool = function(entity) {
	    ResourcePoolService.modifyResourcePool(entity);
	}
    
    //删除一条资源池记录
    $scope.deleteResourcePool = function(entity) {
        ResourcePoolService.deleteResourcePool(entity);
    }
});
//资源池
routeApp.controller('resourcePoolCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, OrgService, ResourcePoolService){
//    $scope.currentTab = 'summary';
	$scope.resourcePool = {};
	$scope.resourcePool.cloudType = $scope.cloudType;
	$scope.resourcePool.id = $scope.id;
	// 增加资源池
	$scope.addResourcePool=function(){
	    ResourcePoolService.addResourcePool();
	};
	//修改资源池
	$scope.modifyResourcePool = function() {
	    ResourcePoolService.modifyResourcePool($scope.resourcePool);
	}
	
	
});
//资源池概要
routeApp.controller('resourcePoolSummaryCtrl',function($scope, $state, $http, $location, $timeout, $translate, UtilService, HttpService,GridService, EchartService){
    $scope.summary = {};
    var core = $translate.instant('addDomain.core');
    //查询概要信息
    $scope.querySummary = function() {
        var summaryUrl = "resourcePool/" + $scope.id + "/summary";
        $http({
            method: 'GET',
            url: summaryUrl,
            params: {}
        }).success(function (result) {
            if (result.state == 0) {
                $timeout(function() {
                    $scope.summary = result.data;
                    if (result.data.cpu != null) {
                    	$scope.summary.cpu = result.data.cpu + core;
                    } else {
                        $scope.summary.cpu = '0' + core;
                    }
                });
            } else {
            	$timeout(function() {
                    $scope.summary = result.data;
                    $scope.summary.cpu = '0' + core;
                });
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    
	$scope.$on(constant.onRefreshResourcePool, function(event, msg) {
		$scope.querySummary();
	});	
    
    $scope.querySummary();
    
    //计算资源利用率
    var noDataText = $translate.instant('common.noData');
    var computeResourceChart = echarts.init(document.getElementById("resourcePoolMonitorInfo"));
    var queryChartsData = function() {
        var computeRateUrl = "resourcePool/" + $scope.id + "/computeRate";
        //计算资源监控仪表盘
        EchartService.getMonitorChart(computeRateUrl, computeResourceChart);
    }
    queryChartsData();
    
    //浏览器窗口resize的时候执行的函数
    $scope.resizeFun = function() {
        computeResourceChart.resize();
    };
    //监听大小改变事件，同步刷新图表
    $scope.$on(constant.onNavClick, function(event, msg) {
        $scope.resizeFun();
    });
    //监听浏览器大小变化
    $(window).on('resize', $scope.resizeFun);
    
    //画并图
    $scope.storageRateUrl = "resourcePool/" + $scope.id + "/storageRate";
    var storageMonitorInfo = undefined;
    storageMonitorInfo = echarts.init(document.getElementById("storageMonitorInfo"));
    EchartService.pieChart($scope.storageRateUrl,storageMonitorInfo);
});


//计算资源页签
routeApp.controller('computeResourceCtrl',function($scope, $state, $http, $timeout, $translate, UtilService, HttpService, EchartService){
    $scope.summary = {};    
    var summaryUrl = "resourcePool/" + $scope.id + "/computeResource/summary";
    $http.get(summaryUrl).success(function(result) {
        if (result.state == 0) {
            $timeout(function() {
                $scope.summary = result.data;
            });
        }
        UtilService.handleResult(result);
    }).error(function(response, code, headers, config) {
        UtilService.handleError(code);
    });
    
    var noDataText = $translate.instant('common.noData');
    var performanceUrl = "resourcePool/" + $scope.id + "/computeResource/trend/";
    // CPU利用率
    $scope.cpuUrl = performanceUrl + 'cpu';
    // 内存内存利用率
    $scope.memUrl = performanceUrl + 'mem';
    
    var noDataText = $translate.instant('common.noData');
    var vmCircle = echarts.init(document.getElementById("resourcePoolVmCircle"));
    
    //CVM的虚拟机topN
    if ($scope.cloudType == 2) {
        var vmCpuTop5Chart = echarts.init(document.getElementById("resourcePoolVmCpuTop5Chart"));
        var vmMemoryTop5Chart = echarts.init(document.getElementById("resourcePoolVmMemoryTop5Chart"));
    } else if ($scope.cloudType == 3) {
        // CPU利用率
        $scope.efcpuUrl = performanceUrl + 'efcpu';
        // 内存内存利用率
        $scope.efmemUrl = performanceUrl + 'efmem';
    }
    //图表数据
    var queryChartsData = function() {
        //获取虚拟机状态
        EchartService.getVmStatus("resourcePool/" + $scope.id + "/computeResource/vm/statues", vmCircle);
    	// EchartService.getVmStatus("resourcePool/" + $scope.id + "/computeResource/vm/statues", vmCircle);
        if ($scope.cloudType == 2) {
            //top5 虚拟机cpu 嵌套圆环
            var vmTop5Url = "resourcePool/" + $scope.id + "/computeResource/vm/top5/";;
            EchartService.vmTop5CpuFiveCricle(vmTop5Url + "cpu", vmCpuTop5Chart, noDataText, 'resourcePoolVmCpuTop5Chart');
            // top5虚拟机内存
            EchartService.vmTop5Mem(vmTop5Url + "memory", vmMemoryTop5Chart, noDataText, 'resourcePoolVmMemoryTop5Chart');
        }
    }
    queryChartsData();

    //监控浏览器变化,调整图形
    $scope.resizeFun = function() {
        if (angular.isDefined(vmCpuTop5Chart)) {
            vmCpuTop5Chart.resize();
            if (vmCpuTop5Chart.getOption()) {
	    		vmCpuTop5Chart.setOption({
	    			legend :{
	    				x : vmCpuTop5Chart.getDom().offsetWidth * 2 / 3
        }
	    		})
			}
        }
        if (angular.isDefined(vmMemoryTop5Chart)) {
            vmMemoryTop5Chart.resize();
        } 
        if (angular.isDefined(vmCircle)) {
            vmCircle.resize();
        }
    }
    
    $(window).on("resize", $scope.resizeFun);
    $scope.$on(constant.onNavClick, function(){
        $scope.resizeFun();
    });
    $scope.$on("$destroy", function(){
        $(window).off("resize", $scope.resizeFun);
        EchartService.dispose(vmCpuTop5Chart,vmMemoryTop5Chart, vmCircle);
    });
});

//虚拟交换机资源
routeApp.controller('vswitchResourceCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService, GridService, ResourcePoolService){
    var operationTemplate = '<div><div class="ngCellButton">'    
        +'<div type="button" has-permission="RESOURCEPOOL_MODIFY" class="btn btn-sm-icon icon-delete-gray" ng-click="delVswitch(row.entity)" has-permission="ORGANIZATION_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
        +'</div></div>';
    var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'30%'},
                  { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'30%'},
                  { field: 'mode', displayName: $translate.instant('vswitch.transmitType'), cellFilter: 'vsmode', sortable: true, width:'25%'},
                  { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'15%', cellTemplate:operationTemplate}
                  ];
    var url = 'resourcePool/resVswitchByResourcePoolId/' + $scope.id;
    $scope = GridService.grid($scope, url, null, null, null, 'vswitchResourceListDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
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
    $scope.delVswitch = function(entity) {
    	if($scope.myData.length < 2){
    		var modalInstance1 = UtilService.alert($translate.instant('resourcePool.delOnlyVswitchAlter',{value:entity.name}),$translate.instant('common.opertip'), false, 'error');	
    		modalInstance1.result.then(function (selectedItem) {
    			$scope.refreshPage();
    		});
    	} else {			
			var modalInstance = UtilService.confirm($translate.instant('resourcePool.delVswitchAlter',{value:entity.name}),$translate.instant('common.opertip'));
			modalInstance.result.then(function (selectedItem) {
				HttpService.delete('resourcePool/del/net/' + entity.id + '/' + entity.name, null, modalInstance, $scope.refreshPage);
			}, function () {
			});
		}
	};
	var resourcePoolId = $scope.id;
	$scope.releaseVswitch = function() {
		ResourcePoolService.releaseVswitch(resourcePoolId);
    }
	
	$scope.$on(constant.onRefreshVswitch, function(event, msg) {
		if ($scope.id == msg.id) {
			$scope.refreshPage();
		}
	});	
});
//发布虚拟交换机
routeApp.controller('resourcePoolReleaseVswitchCtrl',function(resourcePoolId,$scope, $http,$modalInstance, $translate, UtilService,GridService,HttpService) {	
	$scope.mySelections=[];
	$scope.isSelector = true
    //表头
    var column = [{field: 'name', displayName: $translate.instant('org.vswitchName') , sortable: true, width:'30%'},
                  {field: 'desc', displayName: $translate.instant('common.desc') , sortable: true, width:'40%'},                
                  {field: 'mode', displayName: $translate.instant('vswitch.transmitType'),cellFilter: 'vsmode', sortable: true, width:'30%'}];
    //vm数据
	var url = "resourcePool/getNetList/" + resourcePoolId;
	$scope = GridService.grid($scope, url);
	$scope.getDataAsync();
    //创建表格
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
            columnDefs:column
    };  
    $scope.ok=function(){$modalInstance.close($scope.mySelections);};
    $scope.cancel=function(){$modalInstance.dismiss("cancel");};
});
/** 选择云资源 */
routeApp.controller('SelectCloudResourceCtrl',function($scope, $rootScope, $state, $http,$filter,$compile, $location,$modal,$modalInstance,
		$timeout, $translate, UtilService, HttpService, EchartService, $interval){
	$scope.storagePools = [];
	$scope.selectedPool = {}
	$scope.limit = 5;
	// build storage pool list
	var buildStoragePoolList = function(result) {
		if (result && result.length > 0) {
			var items = "";
			var storagePoolItem = '<ul id="storagePoolCarousel" class="elastislide-list"> </ul>';
			$('.storagePoolPanel:last').html(storagePoolItem);
			for ( var i = 0; i < result.length; i++) {
				var pool = result[i];
				items += '<li><a>';
				items += '<span id="' + pool.name + '" cascheckbox class="cas-checkbox labeled-btn radio" style=" float:left;width:calc(100% - 10px)" ' + 
					'ng-model="selectModel.name" value="' + pool.name + '">';
				items += '<input name="selectedPool' + $scope.$id + '" type="radio"  ng-checked="isSelected(storagePools['+ i + '])">';
				items += '<span class="box poolBox" style="text-align: left; height:100px;margin-left:0px;">';
				items += '<span><span><img id="img'+pool.id+'" style="margin-top:10px;margin-left:8px;display:inline;" class="pic2img" src="css/img/green/Icon_cloud_website_green_16x16.svg" custom-title="' 
					  + $translate.instant("common.active") + '"></span>';
				items += '<span style="width:162px;padding-top:10px;float:right;"><span style="padding-top:10px;text-align: left;font-weight:bold;" shortcut custom-title ' 
					  + 'cut-str="' + pool.name +'" short-width="160"></span><br/>'
					  + '<span style="height:5px;display:block;"></span><span><span translate="common.type" style="margin-top:10px;text-align: left" class="span_padding"></span><span shortcut custom-title cut-str='
					  + '"' + $filter('cloudType')(pool.flag) + '" short-width="110"></span></span><br/><span style="height:5px;display:block;"></span><span><span translate="ip" style="margin-top:10px;text-align: left" class="span_padding"></span><span shortcut custom-title cut-str='
					  + '"' + pool.uri + '" short-width="110"></span></span></span>';
				items += '<span style="padding-left:130px;padding-top:4px;float:right;padding-right:3px;"> <span  type="button" style="margin-left:-3px;" class="btn btn-sm-icon icon-refresh-gray" ng-click="refreshResourcePool(storagePools['+ i + '])" custom-title="' 
				      + $translate.instant('cloudResource.refreashPublicCloud') + '"></span><span type="button" style="margin-left:-3px;" class="btn btn-sm-icon icon-view-detail-gray" ng-click="viewResourcePool(storagePools['+ i + '])" custom-title="'
					  + $translate.instant('cloudResource.viewPublicCoud') + '"></span></span>';									
				items += '<span ng-if="isSelected(storagePools['+ i + '])" class="selectedPool" style="position:absolute; top:calc(50% - 10px); left:100%; width: 0px; height: 0px;border-top: 10px solid rgba(0,0,0,0); border-bottom: 10px solid rgba(0,0,0,0)"></span>';
				items += '</span></span></a></li>';
			}
			$('.elastislide-list:last').html($compile(items)($scope));
			$timeout(function() {
				$(".elastislide-list:last").elastislide({
				orientation: 'vertical',
				minItems : 4
				});
			});
		}
	};
	// query storage pool
	$scope.queryStoragePool = function() {
		var url = "cloud/list";
		var params = {
				flag:[2,3,5]
		};
		$http({
			method  : 'GET',
			url     : url,
			params  : params
		}).success(function(result) {
			if (result.state == 0 && result.data != null && result.data.length > 0) {
				if (isEmpty($scope.selectedPool.name)) {					
					$scope.selectedPool = result.data[0];
				}
				$scope.storagePools = result.data;
				$timeout(function() {
					$scope.refreshResourcePool();
				});
				
			} else {
				$scope.storagePools = [];
			}
			buildStoragePoolList($scope.storagePools);
		});
	}
	$scope.queryStoragePool();
	
	//查看云资源
    $scope.viewResourcePool=function(rowObj){
    	var type="";
    	if(rowObj.flag==2){
    		type=$translate.instant("cloudResource.viewCvm");
    	}else if(rowObj.flag==3){
    		type=$translate.instant("cloudResource.viewVcenter");
    	}	
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/viewCvm.html',
            controller: 'viewCloudCtrl',
            backdrop: 'static',
            resolve:{flag:function(){return rowObj.flag;},
            		 id:function(){return rowObj.id;}
       }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function (reason) {
        });
    };
    
	//增加云资源
	$scope.addCloudResource = function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
            backdrop: 'static',
            resolve:{
            	flag:function(){return constant.PUBLIC_CLOUD_CVM;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.queryStoragePool();
        }, function (reason) {
        });
	};
	
	$scope.$on('onCloudNodeChange', function(envent, msg) {
    	$scope.queryStoragePool();
	});
	$scope.isSelected = function(pool) {
        if ($scope.selectedPool.name == pool.name) {
            return true;
        }
        return false;
    }
	$scope.selectModel = {};
	$scope.$watch('selectModel.name', function(newValue, oldValue) {
        if (angular.isUndefined(newValue) || newValue == oldValue) {
            return;
        }
        $scope.publicCloudIsNormal = null;
        if ($scope.storagePools != null) {
        	for(var i=0; i<$scope.storagePools.length; i++){
    			if (newValue == $scope.storagePools[i].name) {
    				$scope.selectedPool = $scope.storagePools[i];
    				break;
    			}
        	}
        }
        $scope.refreshResourcePool();
    });
	
	var hostCircle;
	var vmCircle;
	var countStoragePic;
//	var isSelectErrorRp = false;
//	UtilService.alert($translate.instant("cloudResource.cloudException"),$translate.instant('common.errorTip'),false,"error");
	$scope.refreshResourcePool = function() {
		var waitModal = UtilService.wait();
		//主机健康状态饼图
		getHostHealthyLoopPic($scope.selectedPool.id);
		//虚拟机健康状态饼图
		getVmHealthyLoopPic($scope.selectedPool.id);
		
		if ($scope.selectedPool.flag == 3) {
			$http.get("vmware/vcenter/" + $scope.selectedPool.id + "/summery").success(function(result){
				if (result.state == 0) {
					$scope.summaryTimeout = $timeout(function() {
						$scope.summary = result.data;
						$scope.publicCloudIsNormal = true;
						$("#img"+$scope.selectedPool.id)[0].src = "css/img/green/Icon_cloud_website_green_16x16.svg";
					});
				} else {
					$scope.publicCloudIsNormal = false;
					$("#img"+$scope.selectedPool.id)[0].src = "css/img/gray/Icon_cloud_website_16x16.svg";
					UtilService.alert($translate.instant("cloudResource.cloudException"),$translate.instant('common.errorTip'),false,"error");
				}
				waitModal.dismiss();
			}).error(function(response, code, headers, config) {
				UtilService.handleError(code);
				waitModal.dismiss();
			});
		} else if ($scope.selectedPool.flag == 2) {
			$http.get("dc/queryDcSummary?cloudId=" + $scope.selectedPool.id).success(function(result){
				waitModal.dismiss();
				var data = result.data;
				if(angular.isArray(data)){
					if (data.length != 0) {
//						isSelectErrorRp = false;
						setSummaryBlank();
						$("#dc-cpuCount").text(data[2].value);
						$("#dc-totalMemory").text(data[3].value);
						$("#dc-totalStorage").text(data[4].value);
						$("#dc-usableStorage").text(data[5].value);
						$("#dc-vm").html(desc_vm_status(data[6].total, data[6].run, data[6].shutoff));
						$("#dc-density").text(data[7].value);
						$("#dc-clusterNums").text(data[8].value);
						$("#dc-shareStorageCapacity").text(data[9].value);
						$("#dc-shareStorageRate").text(data[10].value + '%');
						$scope.publicCloudIsNormal = true;
						$("#img"+$scope.selectedPool.id)[0].src = "css/img/green/Icon_cloud_website_green_16x16.svg";
					} else {
//						isSelectErrorRp = true;
						setSummaryBlank();
						$scope.publicCloudIsNormal = false;
						$("#img"+$scope.selectedPool.id)[0].src = "css/img/gray/Icon_cloud_website_16x16.svg";
						UtilService.alert($translate.instant("cloudResource.cloudException"),$translate.instant('common.errorTip'),false,"error");
					}
				}
			}).error(function(response, code, headers, config) {
				UtilService.handleError(code);
				waitModal.dismiss();
			});
		}
	};
	
	var setSummaryBlank = function () {
		$("#dc-cpuCount").text('');
		$("#dc-totalMemory").text('');
		$("#dc-totalStorage").text('');
		$("#dc-usableStorage").text('');
		$("#dc-vm").html('');
		$("#dc-density").text('');
		$("#dc-clusterNums").text('');
		$("#dc-shareStorageCapacity").text('');
		$("#dc-shareStorageRate").text('');
	}
	
	
	//查询主机状态信息
	var getHostHealthyLoopPic = function(cloudId){
		 hostCircle = echarts.init(document.getElementById("hostCircle"));
		 // 获取主机状态
		 var url;
		 if ($scope.selectedPool.flag == 3) {
			 url = "vmware/vcenter/" + cloudId +"/hosts/state";
		 } else if ($scope.selectedPool.flag == 2) {
			 url = "dashboard/host?cloudId=" + cloudId;
		 }
		 EchartService.getHostStatus(url, hostCircle);
	};
	
	//查询虚拟机状态信息
	var getVmHealthyLoopPic = function(cloudId){
		var vmCircle = echarts.init(document.getElementById("vmCircle"));
		//获取虚拟机状态
		EchartService.getVmStatus("dashboard/vmCount?cloudId=" + cloudId, vmCircle);
	};
	
	
	$scope.clearCloudPanel = function () {
		$("#hostCPUCount").html('');
		$("#vmCPUCount").html('');
		$("#cpuRate").html('');
		$("#hostMemoryCount").html('');
		$("#vmMemoryCount").html('');
		$("#memRate").html('');
		$("#totalStorage").html('');
		$("#usedStorage").html('');
		$("#storageRate").html('');
	}
	
	$scope.$on("$destroy",
			function(event) {
			    //销毁echarts实例
			    EchartService.dispose(hostCircle, vmCircle);
			}
	);
	
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
	
    if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
        $timeout.cancel($scope.keyInterval);
    }
    
	$scope.ok = function () {
		if (!$scope.selectedPool.id) {
			UtilService.alert($translate.instant("cloudResource.selectResouecePoolError"),$translate.instant('common.errorTip'),false,"error");
			return;
		}
		var waitModal = UtilService.wait();
		$scope.timer = $interval(function(){
	        if ($scope.publicCloudIsNormal != null && $scope.publicCloudIsNormal != undefined){
	        	if ($scope.publicCloudIsNormal) {
	        		waitModal.dismiss();
	        		$interval.cancel($scope.timer);
	        		$modalInstance.close($scope.selectedPool);
	        	} else {
					waitModal.dismiss();
					$interval.cancel($scope.timer);
					UtilService.alert($translate.instant("cloudResource.cloudException"),$translate.instant('common.errorTip'),false,"error");
	        	}
	    	} else {
	    		waitModal.dismiss();
        		$interval.cancel($scope.timer);
        		UtilService.alert($translate.instant("cloudResource.cloudException"),$translate.instant('common.errorTip'),false,"error");
	    	}
	    }, 500);  
	};
	
	 $scope.cancel = function () {
		 $modalInstance.dismiss('cancel');
	 };
});

/** 增加资源池 */
routeApp.controller('addResourcePoolCtrl',function($scope, $rootScope, $state, $http, $filter, $compile, $location, $modal, $modalInstance,
		$timeout, $translate, UtilService, HttpService, GridService, EchartService, ResourcePoolService){
	
	$scope.stepTitles = [ $translate.instant('resourcePool.basicInfo'),
	                      $translate.instant('resourcePool.cluster'),
	                      $translate.instant('resourcePool.vswitch'),
	                      $translate.instant('resourcePool.storage'),
	                      $translate.instant('resourcePool.portProfile')];
	 var templateSwitch = TEMPLATE_START +
	    '<div ng-click="stopPropagation(row.entity, $event)" ><div toggle-switch style="margin-top: 0px;" on-label="' + $translate.instant('common.yes') + '" off-label="' + $translate.instant('common.no') + '" ng-class="{ \'disabled\': isDisabled }" is-disabled="row.selected != true" ng-mousedown="switchDefault(row, $event)" class="switch-small switch-success" ng-model="row.entity[col.field]"></div></div>' +
	    TEMPLATE_END;
	$scope.resource = {};
	$scope.resource.mySelections = [];
	$scope.resource.switchSelections = [];
	$scope.resource.storageSelections = [];
	$scope.resource.portProfileSelections = [];
	
	$scope.model={};
	$scope.showPortProfile = false;
	$scope.isCVM = false;
	//允许使用本地存储---cvm允许
    $scope.valids = {
            stepOneOver : function() {
                if ($('#rpForm1').val() === "true")
                    return true;
                return false;
            },
            stepTwoOver : function() {
                if ($scope.resource.mySelections.length > 0) {
                	return true;
                }
                return false;
            },
            stepThreeOver : function() {
                if ($scope.resource.switchSelections.length > 0) {
                	return true;
                }
                return false;
            },
            stepFourOver : function() {
                if ($scope.resource.storageSelections.length > 0)
                    return true;
                return false;
            },
            stepFiveOver : function() {
                if ($scope.resource.portProfileSelections.length > 0)
                    return true;
                return false;
            }
    };
    
    $scope.switchDefault = function (row, event) {
    	if (!row.selected) {
    		return;
    	}
    	var entity = row.entity;
    	var selects = $scope.resource.storageSelections;
		if (!entity.check) {
			for(var index in selects) {
				if (selects[index].name != entity.name) {
					selects[index].check = false;
				}
			}
		}
    	
    }
    
    $scope.stopPropagation = function (entity, event) {
    	if (!event) {
            event = window.event;
        }
    	event.stopPropagation();
    }
	
	$scope.selectCloudResource = function () {
		ResourcePoolService.selectCloudResource({}, getCloudResource);
	}
	
	var getCloudResource = function (result) {
		$scope.model.cloudResourceName = result.name;
		$scope.model.cloudResourceId = result.id;
		$scope.model.cloudResourceType = result.flag;
		//云资源为cvm时，显示网络策略模板
		//资源池网络策略模板删除$scope.showPortProfile = result.flag == 2;
		$scope.isCVM = result.flag == 2;
	}
	
    $scope.nextCallBack = {
        	"1" : function(){
        		var url = "resourcePool/res?cloudId=" + $scope.model.cloudResourceId;
        		$scope = GridService.grid($scope, url);
        		$scope.getDataAsync();
        		return true;
        	},
        	"2" : function(){
        		$scope.vswitchOptions.selectAll(false);
        		if ($scope.model.cloudResourceType == 2){       			
        			$scope.storageOptions1.selectAll(false);
        		} else {       			
        			$scope.storageOptions2.selectAll(false);
        		}
        		//资源池网络策略模板删除$scope.portProfileOptions.selectAll(false);
        		return true;
        	},
        	"4" : function() {
        		var isSelectBackupStorage = false;
        		for (var int = 0; int < $scope.resource.storageSelections.length; int++) {
					if ($scope.resource.storageSelections[int].check) {
						isSelectBackupStorage = true;
					}
				}
        		if ($scope.isCVM && !isSelectBackupStorage) {
	  				UtilService.alert($translate.instant('resourcePool.selectBackupStoragePro'), $translate.instant('common.opertip'), false, 'error');
	  		    	return false;
	  			}
        	}
    }
	
	//表头
	var column = [{ field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true, width:'20%', cellTemplate:titleTemplate},
	              { field: 'vmNum', displayName: $translate.instant('org.vmNum'), sortable: true, width:'20%'},
		          { field: 'runVmNum', displayName:$translate.instant('common.runVmNum'),width:'20%'},
		          { field: 'cpuRate', displayName:$translate.instant('common.cpuRate'),width:'20%', cellTemplate:progressTemplate},
		          { field: 'memRate', displayName:$translate.instant('common.memoryRate'),width:'20%', cellTemplate:progressTemplate}]

    //创建表格
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.resource.mySelections,
            showSelectionCheckbox: false,
            multiSelect: false,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
//		    groups:['hostPoolName'],
		    groupsCollapsedByDefault:false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
	        	var entity = rowItem.entity;
	        	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {
	        		$scope.queryVswitchs(entity);
	        		$scope.queryStorages(entity);
	        		//资源池网络策略模板删除$scope.queryPortProfiles(entity);
	        		$scope.clusterName = entity.clusterName;
	        		$scope.netResource = "";
	        		$scope.storageResource = "";
	        		$scope.portProfileResource = "";
	        	}
	        },
            columnDefs:column
    };  
    $scope.listStyle = $scope.gridStyle(-15);
    // 网络资源
    var vsColumn = [{field: 'name', displayName: $translate.instant('org.vswitchName') , sortable: true, width:'40%', cellTemplate:titleTemplate},
    				{field: 'model', displayName: $translate.instant('org.switchMode'),cellFilter: 'vsmode', sortable: true, width:'40%'}
    				]
    $scope.vswitchOptions = {
            data: 'vswitchData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.resource.switchSelections,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
				var vsStr = "";
				if (angular.isArray(rowItem)) {
					for (var index = 0;index < rowItem.length; index++) {
						if (!rowItem[index].selected) {
							rowItem[index].entity.check = false;
						}
					}
				} else {
					if (!rowItem.selected) {
						rowItem.entity.check = false;
					}
				}
				if ($scope.resource.switchSelections.length > 0) {
					for (var i = 0; i < $scope.resource.switchSelections.length; i++) {
						vsStr += $scope.resource.switchSelections[i].name + ",";
					}
				}
				$scope.netResource = vsStr.substring(0, vsStr.length - 1); 
	        },
            columnDefs:vsColumn
    }; 
    $scope.queryVswitchs = function(entity) {
	    var url = "resourcePool/resVswitch?cloudId=" + $scope.model.cloudResourceId + "&clusterId=" + entity.id + "&uniqueKey=" + entity.uniqueKey;
//	    if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//			url = "org/resVswitch/vmware/" + org.id +  "/" + entity.hostPoolId;
//		}
	    $scope.resource.switchSelections.splice(0, $scope.resource.switchSelections.length);
	    $http({
	    	method:"GET",
	    	url: url
	    }).success(function(result){
	    	if (result) {	
	    		$scope.vswitchData = result.data;
	    	}
	    });
	}; 
	
/*	资源池网络策略模板删除// 网络策略模板
    var portProfileColumn = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'10%', cellTemplate:titleTemplate},
                             { field: 'operatorGroupname', displayName: $translate.instant('netstrategy.operatorGrpName'), sortable: true, width:'15%', visible:false, cellTemplate:titleTemplate},
                             { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'10%', visible:false, cellTemplate:titleTemplate},
                             { field: 'vlanType', displayName: $translate.instant('common.type'), sortable: false, cellFilter:'vlanType',width:'10%'},
                             { field: 'vlan', displayName: $translate.instant('template.vlanTypeId'), sortable: true, width:'15%'},
                             { field: 'aclName', displayName: $translate.instant('netstrategy.acl'), sortable: true, width:'15%', cellTemplate:titleTemplate},
                             { field: 'vnetPriority', displayName: $translate.instant('netstrategy.netPriority'), cellFilter:'priority', sortable: true, width:'10%', cellTemplate:titleTemplate}
                             ]
    $scope.portProfileOptions = {
            data: 'portProfileData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.resource.portProfileSelections,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
				var portProfileStr = "";
				if (angular.isArray(rowItem)) {
					for (var index = 0;index < rowItem.length; index++) {
						if (!rowItem[index].selected) {
							rowItem[index].entity.check = false;
						}
					}
				} else {
					if (!rowItem.selected) {
						rowItem.entity.check = false;
					}
				}
				if ($scope.resource.portProfileSelections.length > 0) {
					for (var i = 0; i < $scope.resource.portProfileSelections.length; i++) {
						portProfileStr += $scope.resource.portProfileSelections[i].name + ",";
					}
				}
				$scope.portProfileResource = portProfileStr.substring(0, portProfileStr.length - 1); 
	        },
            columnDefs:portProfileColumn
    }; 
    $scope.queryPortProfiles = function(entity) {
	    var url = 'network/' + $scope.model.cloudResourceId + '/list';
	    $scope.resource.portProfileSelections.splice(0, $scope.resource.portProfileSelections.length);
	    $http({
	    	method:"GET",
	    	url: url
	    }).success(function(result){
	    	if (result) {	
	    		$scope.portProfileData = result.data;
	    	}
	    });
	};*/
	
    // 存储资源
	var stColumn1 = [{ field: 'title', displayName: $translate.instant('common.name'), sortable: true, width:'18%', cellTemplate:titleTemplate},
			        { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'18%'},
			        { field: 'path', displayName:$translate.instant('host.path'),width:'18%', cellTemplate:titleTemplate},
			        { field: 'avalibaleCapacity', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'15%'},
			        { field: 'check', displayName:$translate.instant('resourcePool.backupStorage'), sortable: false, width:'31%', cellTemplate:templateSwitch}]
	 // 存储资源
	var stColumn2 = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'30%', cellTemplate:titleTemplate},
			        { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'20%'},
			        { field: 'path', displayName:$translate.instant('host.path'),width:'30%', cellTemplate:titleTemplate},
			        { field: 'avalibaleCapacity', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'}]
    $scope.storageOptions1 = {
            data: 'storageData',
            jqueryUITheme: false,
            jqueryUIDraggable: true,
            selectedItems: $scope.resource.storageSelections,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
		    groups:['hostPoolName'],
		    groupsCollapsedByDefault:false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
				var storageStr = "";
				if (angular.isArray(rowItem)) {
					for (var index = 0;index < rowItem.length; index++) {
						if (!rowItem[index].selected) {
							rowItem[index].entity.check = false;
						}
					}
				} else {
					if (!rowItem.selected) {
						rowItem.entity.check = false;
					}
				}
				if ($scope.resource.storageSelections.length > 0) {
					var hasChecked = false;
					for (var i = 0; i < $scope.resource.storageSelections.length; i++) {
						storageStr += $scope.resource.storageSelections[i].title + ",";
						if ($scope.resource.storageSelections[i].check) {
							hasChecked = true;
						}
					}
					if (!hasChecked) {
						$scope.resource.storageSelections[0].check = true;
					}
				}
				$scope.storageResource = storageStr.substring(0, storageStr.length - 1); 
	        },
            columnDefs:stColumn1
    }; 
	$scope.storageOptions2 = {
            data: 'storageData',
            jqueryUITheme: false,
            jqueryUIDraggable: true,
            selectedItems: $scope.resource.storageSelections,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
		    groups:['hostPoolName'],
		    groupsCollapsedByDefault:false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
				var storageStr = "";
				if (angular.isArray(rowItem)) {
					for (var index = 0;index < rowItem.length; index++) {
						if (!rowItem[index].selected) {
							rowItem[index].entity.check = false;
						}
					}
				} else {
					if (!rowItem.selected) {
						rowItem.entity.check = false;
					}
				}
				if ($scope.resource.storageSelections.length > 0) {
					var hasChecked = false;
					for (var i = 0; i < $scope.resource.storageSelections.length; i++) {
						storageStr += $scope.resource.storageSelections[i].name + ",";
						if ($scope.resource.storageSelections[i].check) {
							hasChecked = true;
						}
					}
					if (!hasChecked) {
						$scope.resource.storageSelections[0].check = true;
					}
				}
				$scope.storageResource = storageStr.substring(0, storageStr.length - 1); 
	        },
            columnDefs:stColumn2
    }; 
    $scope.queryStorages = function(entity) {
	    var url = "resourcePool/resStorage?cloudId=" + $scope.model.cloudResourceId + "&clusterId=" + entity.id + "&uniqueKey=" + entity.uniqueKey;
//	    if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//			url = "org/resStorage/vmware/" + org.id + "/" + entity.clusterId;
//		}
	    $scope.resource.storageSelections.splice(0, $scope.resource.storageSelections.length);
	    $http({
	    	method:"GET",
	    	url: url
	    }).success(function(result){
	    	if (result) {	
	    		$scope.storageData = result.data;
	    	}
	    });
	};
	
	$scope.ok = function () {
//		var url = "org/addOrgRes";
//		var cluster = {};
		var vswitchs = [];
		var storages = [];
		var portProfiles = [];
		var clusters = [];
		var cloud = {};
		var useLocalStorageFlag = 0;
		if ($scope.model.useLocalStorageFlag){
			useLocalStorageFlag = 1;
		}
		if ($scope.resource.mySelections.length > 0) {
			clusters[0] = {};
			clusters[0].id = $scope.resource.mySelections[0].id;
			clusters[0].uniqueKey = $scope.resource.mySelections[0].uniqueKey;
			clusters[0].name = $scope.resource.mySelections[0].clusterName;
		}
		if ($scope.model) {
			cloud.cloudId = $scope.model.cloudResourceId;
			cloud.cloudName = $scope.model.cloudResourceName;
			cloud.cloudType = $scope.model.cloudResourceType;
		}
		
		if ($scope.resource.switchSelections.length > 0) {
			for (var i=0;i<$scope.resource.switchSelections.length;i++) {
				var vs = {name : $scope.resource.switchSelections[i].name,};
				if (cloud.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
					vs = {name : $scope.resource.switchSelections[i].vswitchKey,};
				}
				vswitchs[i] = vs;
			}
		}
		
		/* 资源池网络策略模板删除if ($scope.resource.portProfileSelections.length > 0) {
			for (var i=0;i<$scope.resource.portProfileSelections.length;i++) {
				var portProfile = {name:$scope.resource.portProfileSelections[i].name,};
				portProfiles[i] = portProfile;
			}
		}*/
		
		if ($scope.resource.storageSelections.length > 0) {
			for (var i=0;i<$scope.resource.storageSelections.length;i++) {
				var isBackup;
				if ($scope.resource.storageSelections[i].check) {
					isBackup = '1';
				} else {
					isBackup = '0';
				}
				var st = {
					name:$scope.resource.storageSelections[i].name,
					path:$scope.resource.storageSelections[i].path,
					type:$scope.resource.storageSelections[i].type,
					isBackup:isBackup,
				}
				if (cloud.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
					st = {
							name:$scope.resource.storageSelections[i].storagePoolKey,
							path:$scope.resource.storageSelections[i].path,
							type:$scope.resource.storageSelections[i].type,
							isBackup:isBackup,
					}
				}
				storages[i] = st;
			}
		}
		var data = {
				name : $scope.model.name,
				description : $scope.model.description,
				useLocalStorageFlag : useLocalStorageFlag,
				cloud : cloud,
				clusters : clusters,
				nets : vswitchs,
				storages : storages,
				/*资源池网络策略模板删除profiles : portProfiles,*/
		};
		var aToStr=JSON.stringify(data); 
		HttpService.post('resourcePool/add', data, $modalInstance);
//		$modalInstance.close(data);
//		 var url = "resourcePool/add";
//         if (result) {
//             HttpService.post(url, result, modalInstance, callBack);
//         }

//		HttpService.post(url, data, $modalInstance, addCallBack);
//		$modalInstance.dismiss('cancel');
	};
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
});
//资源池存储
routeApp.controller('storageResource',function($scope, $rootScope, $http, $modal, $translate, $state, $timeout, $compile, UtilService, GridService, HttpService, EchartService, PermissionService, ResourcePoolService) {
	//默认一次显示的资源池个数
	var defaultLimit = 6;
	var index = 0;
	$scope.params = {};
	$scope.params.cloudType = $scope.cloudType;
	$scope.params.id = $scope.id;
	var storageName = "";
	
	$scope.queryStorage = function(limit, currentIndex){
        var param = {
                limit:limit,
                offset:currentIndex * limit,
                resorcePoolId: $scope.id
        };
        $http({
            method  : 'GET',
            url     : "resourcePool/rpStorageList",
            params: param}).
        success(function(result) {
            if (result.state == 0) {
            	index = currentIndex;
            	if (currentIndex > 0 && result.data.length == 0) {
            		currentIndex = index - 1;
            		$scope.queryStorage(defaultLimit, currentIndex);
            		return;
            	}
                $timeout(function() {
                	if (result.data.length > 0) {
                		emptyCheck = false ;
                	} else {
                		emptyCheck = true;
                	}
                	var length = result.successMessage == null ? 1 : parseInt(result.successMessage);
                    if (angular.isUndefined($scope.slideArray)) {
                        $scope.slideArray = new Array(Math.ceil(length/limit));

                        for (var i = 0; i < $scope.slideArray.length; i++) {
                            $scope.slideArray[i] = new Object();
                        }
                    } else {
                    	var arrSize = Math.ceil(length/limit);
                    	if (arrSize > $scope.slideArray.length) {
                    		var oldSize = $scope.slideArray.length;
                    		var addSize = arrSize - oldSize;
                    		for (var i = 0; i < addSize; i++) {
                                $scope.slideArray[oldSize + i] = new Object();
                    		}
                    	} else if (arrSize < $scope.slideArray.length) {
                    		 var arr = new Array(arrSize);
                    		 for (var i = 0; i < arrSize; i++) {
                                 arr[i] = $scope.slideArray[i];
                             }
                    		 $scope.slideArray = arr;
                    	}
                    }
                    if ($scope.slideArray.length > 0 && !emptyCheck) {
    					$scope.slideArray[currentIndex].value = result.data;
                        $scope.selectedStorage = result.data[0];
                        
                        var add = {};//加入增加按钮
                        add.addType = "add";
                        $scope.slideArray[currentIndex].value[result.data.length] = add;
                        if ($scope.selectedStorage.flag) {
                        	storageName = result.data[0].title;
                        	$scope.showPerformance(result.data[0].id, result.data[0].title);
                        } else {
                        	$scope.storageId = result.data[0].id;
                        	$scope.showPerformance(0,null);
                        }
                    } else {
                    	$scope.slideArray = new Array(1);
                        $scope.slideArray[0] = new Object();
                        var add = {};//加入增加按钮
                        add.addType = "add";
                        var arr = new Array();
                        arr.push(add);
                        $scope.slideArray[0].value = arr;
                    }
                });                            
            } else {
            	$scope.slideArray = new Array(1);
                $scope.slideArray[0] = new Object();
                var add = {};//加入增加按钮
                add.addType = "add";
                var arr = new Array();
                arr.push(add);
                $scope.slideArray[0].value = arr;
            }
        }).error(function(data, code, headers, cfg) {
            UtilService.handleError(code);
        });
    
	};
    $scope.hasModifyPermission = PermissionService.hasPermission('RESOURCEPOOL_MODIFY');
    
	var ioChart = "";
	var iopsChart = "";
	var vmChart = ""; 
	var orgChart = ""; 
	var noDataText = $translate.instant('common.noData');
	$scope.vmwareDatastoreUsed = 'resourcePool/0/perfTrend/used';//已使用
	$scope.vmwareDatastoreProvisioned = 'resourcePool/0/perfTrend/provisioned';//已分配
	
	$scope.showPerformance = function (id, title) {
		$scope.storage = {};
		EchartService.dispose(ioChart, iopsChart, vmChart, orgChart);
		if ($scope.params.cloudType == 2) { //CVM存储池才初始化io和iops
		ioChart = echarts.init(document.getElementById("ioChart")); 
		iopsChart = echarts.init(document.getElementById("iopsChart")); 
		}
		vmChart = echarts.init(document.getElementById("vmChart")); 
		orgChart = echarts.init(document.getElementById("orgChart"));
		var url = "resourcePool/"+id+"/storageInfo";
		$http({
			method:'GET',
			url:url,
			params:{}
		}).success(function(result){
			if (result.state == 0) {
				 $timeout(function() {
					 if (result.data == null) {
						 return;
					 }
					 var summary = result.data;
					 //存储概要信息
					 $scope.storage.name = summary.name;
					 $scope.storage.type = storageType(summary.type);
					 $scope.storage.totalStorage = showSize(summary.capacity);
					 $scope.storage.preStorage = showSize(summary.preallocation);
					 $scope.storage.activalStorage = showSize(summary.freeSpace);
					 $scope.storage.useCapability = showSize(summary.capacity-summary.freeSpace);
					 $scope.storage.storageScale = (summary.preallocation/summary.capacity*100).toFixed(2) + '%';
					 $scope.storage.storageRate = ((summary.capacity-summary.freeSpace)/summary.capacity*100).toFixed(2);
				 });
			} 
			if (result.state == 1 || result.data == null) {
				//存储异常
				$("#img"+$scope.storageId+"")[0].src = "css/img/gray/Icon_storage_16x16.svg";
			}
			UtilService.handleResult(result);
		}).error(function(response, code, headers, config) {
            UtilService.handleError(code);
		});
		var readName = storageName+$translate.instant('resourcePool.read');
		var writeName = storageName+$translate.instant('resourcePool.write');
		var vmUrl = "resourcePool/"+$scope.id+"/queryVmStorageInfo/"+id+"/cvm";
		var rogVmUrl = "resourcePool/"+$scope.id+"/queryOrgVmUseStorage/"+id+"/cvm";
		if ($scope.cloudType == 3) {
			vmUrl = "resourcePool/"+$scope.id+"/queryVmStorageInfo/"+id+"/"+title;
			rogVmUrl = "resourcePool/"+$scope.id+"/queryOrgVmUseStorage/"+id+"/"+title;
			//发送参数改事件
            var vmwareDatastoreUsedNew = 'resourcePool/' + id + '/perfTrend/used';//已使用
            var vmwareDatastoreProvisionedNew = 'resourcePool/' + id + '/perfTrend/provisioned';//已分配
            $scope.$broadcast("onUrlChange", vmwareDatastoreUsedNew, "vmwareDatastoreUsedChart");
            $scope.$broadcast("onUrlChange", vmwareDatastoreProvisionedNew, "vmwareDatastoreProvisionedChart");
		}
		EchartService.drawColumnTrend('vmChart',vmUrl, vmChart, noDataText, false, "", "", toolFormat);
		EchartService.drawColumnTrend('orgChart',rogVmUrl, orgChart, noDataText, false, "", "", toolFormat);
		if ($scope.params.cloudType == 2) { //CVM存储池才初始化io和iops
		EchartService.rpStorageIo("resourcePool/"+id+"/queryIoAndIops/ioRw", readName, writeName, ioChart, 'ioChart');
		EchartService.rpStorageIo("resourcePool/"+id+"/queryIoAndIops/iops", readName, writeName, iopsChart, 'iopsChart');
		}
	};
	
	var disposeEchart = function (){
		$scope.storage = {};
		EchartService.dispose(ioChart, iopsChart, vmChart, orgChart);
	}
	
	var toolFormat = function (param) {
		$translate.instant('dashboard.orgStorageCur')+'<br/>';
		var value = param.value+" GB";
		var name = param.name +' : ';
		return $translate.instant('dashboard.orgStorageCur')+'<br/>' + name + value;
	}
	
	function showSize(size){//size  unit --> MB
		if (size == undefined || size == null || size == 0) {
			return 0;
		}
		if (size > 1024 && size < 1024*1024) {
			return (size/1024).toFixed(2) + 'GB';
		} else if (size < 1024) {
			return size + 'MB';
		} else {
			return (size/1024/1024).toFixed(2) + 'TB';
		}
	};
	
	function storageType (type) {
		if (type == 'fc') {
			return $translate.instant('storagePool.fc');
		} else if (type == 'iscsi') {
			return  $translate.instant('storagePool.iscsi');
		} else if (type == 'nfs') {
			return $translate.instant('storagePool.nfs');
		} else if (type == 'fs') {
			return $translate.instant('storagePool.shareFs');
		} else if ($scope.cloudType != 2) {
			return type;
		}
	};
	
    $scope.isSelected = function(id) {
        if ($scope.selectedStorage.id == id) {
            return true;
        }
        return false;
    };
    
    $scope.selectedStorage = {}
    $scope.selectedStorage.id = 0;
    $scope.selectModel = {};
    $scope.$watch('selectModel.model', function(newValue, oldValue) {
        if (angular.isUndefined(newValue) || newValue == oldValue) {
            return;
        }
        var selected = angular.fromJson(newValue);//将字符串转成json对象
        if(angular.isString(selected.addType)) {
        	return;
        }
        $scope.selectedStorage = selected;
        if ($scope.selectedStorage.flag) {
        	storageName = $scope.selectedStorage.title;
        	$scope.showPerformance($scope.selectedStorage.id, $scope.selectedStorage.title);
        } else {
        	$scope.storageId = $scope.selectedStorage.id;
        	$scope.showPerformance(0, null)
        }
    });
    
    //浏览器窗口resize的时候执行的函数
    $scope.resizeFun = function() {
        if ($scope.params.cloudType == 2) { //CVM存储池才初始化io和iops
        ioChart.resize();
        iopsChart.resize();
        }
    	vmChart.resize();
    	orgChart.resize();
    };
    //监听大小改变事件，同步刷新图表
    $scope.$on(constant.onNavClick, function(event, msg) {
        $scope.resizeFun();
    });
    //监听浏览器大小变化
    $(window).on('resize', $scope.resizeFun);
    
    var count = 0;
    var check = false;
    $scope.queryStorage(defaultLimit, 0);
    $scope.$on("transitionDoneTag", function(event, currentIndex){
    	if (!check && currentIndex == 0) {
    		check =  true;
    		return;
    	}
    	if (currentIndex == 0) {
    		count ++;
    	} else {
    		count == 0;
    	}
    	if (count > 2) {
    		return;
    	}
    	index = currentIndex;
        $scope.queryStorage(defaultLimit, index);
    });
    
    $scope.$on(constant.onRefreshResourcePoolStorage, function(event, msg){
    	if ($scope.id == msg.id) {
    		$scope.queryStorage(defaultLimit, index);
    	}
    })
    
	$scope.addStorage = function() {
	    ResourcePoolService.addStorage($scope.params);
	};

	$scope.delStorage = function(storage) {
    	var modalInstance = UtilService.confirm($translate.instant('resourcePool.delStorageConfirm'),$translate.instant('common.delete'));
		modalInstance.result.then(function (selectedItem) {
		 var waitModal = UtilService.wait();
	       $http({
	             method  : 'GET',
	             url     : 'resourcePool/checkStorageVMBackUp',
	             params:{id:$scope.id, path:storage.path}
	         }).success(function(result) { 
	        	 waitModal.dismiss();
	        	 if (result.data == true) {
	        	    	var modalInstance = UtilService.confirm($translate.instant('resourcePool.storageExistVmBackUp'),$translate.instant('common.opertip'));
	        			modalInstance.result.then(function (selectedItem) {
	        				deletStorage(storage);
	        			}, function () {
	        			});
	        	 } else {
	        		 deletStorage(storage);
	        	 }
	         }).error(function(response, code, headers, config) {
	        	  waitModal.dismiss();
	        	  UtilService.handleError(code);
	          });
		}, function () {
		});
    }
	
	var deletStorage = function(storage) {
		 var waitModal = UtilService.wait();
		 var param = {};
		 param.id=storage.id;
		 param.stname=(storage.title == "" ? storage.name : storage.title);
		 param.rpName = $scope.name;
         $http({
             method  : 'DELETE',
             url     : 'resourcePool/del/storage',
             params:param
         }).success(function(result) {
	       	  waitModal.dismiss();
	    	  $scope.queryStorage(defaultLimit, index);
	    	  disposeEchart();
	    	  UtilService.handleResult(result);
          }).error(function(response, code, headers, config) {
        	  waitModal.dismiss();
        	  UtilService.handleError(code);
          });
    }
	
});
//云资源获取存储
routeApp.controller('addStorage',function(params, $scope, $http, $modalInstance, $translate, UtilService, GridService) {	
	$scope.mySelections=[];
	$scope.isSelector = true
    //表头
    var column = [{ field: 'title', displayName: $translate.instant('org.storagePoolTitle') , sortable: true, width:'34%'},
		          { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'33%'},
		          { field: 'freeSpace', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'33%'}];
    //vm数据
	var url = "resourcePool/getStorageList";
	var param = {};
	param.resourcePoolId = params.rpId;
	$scope = GridService.grid($scope, url, param);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    //创建表格
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
            columnDefs:column
    };  
    $scope.ok=function(){
    	var array = new Array();
		var reason = $scope.mySelections;
		for (var i=0; i<reason.length; i++) {
			var storage = {};
			storage.name = reason[i].name;
			storage.title = reason[i].title;
			storage.path = reason[i].path;
			storage.type = reason[i].type;
			storage.rpId = params.rpId;
			array.push(storage);
		}
		var waitModal = UtilService.wait();
		$http.post("resourcePool/addStorage", array).success(function(result){
			waitModal.dismiss();
			UtilService.handleResult(result);
			$modalInstance.close();
		})
    };
    $scope.cancel=function(){$modalInstance.dismiss("cancel");};
});

/** 修改资源池 */
routeApp.controller('modifyResourcePoolCtrl',function($scope, $rootScope, $state, $http,$filter,$compile, $location,$modal,$modalInstance,
		$timeout, $translate, UtilService, HttpService, resourcePool){
	$scope.model = {};
	$scope.tmp = {};
	$scope.tmp.backupDest = [];
	$http.get("resourcePool/query/"+resourcePool.rpId).success(function(result){
		$scope.model = result.data;
		if (result != null && result.data != null && result.data.cloudType == 2) {
			if (result.data.storages != null && result.data.storages.length != 0) {
				for (var i=0; i<result.data.storages.length; i++) {
					$scope.tmp.backupDest[i] = {value:i,label:result.data.storages[i].name,key:result.data.storages[i].id}
					if (result.data.storages[i].isBackup == 1) {
						$scope.tmp.backupDestNum = i;
					}
				}
			}
			$scope.storageOptions = $scope.tmp.backupDest;
		}
		if (result.state != 0) {
			//查询组织不存在 给出错误提示后关闭窗口 刷新列表
			UtilService.handleResult(result);
			$modalInstance.close();
		}
	}).error(function(response, code, headers, config) {
  	  	UtilService.handleError(code);
	});
	
	$scope.ok = function(){
		var resourcePool = {};
		resourcePool = angular.copy($scope.model);
		if ($scope.model.useLocalStorageFlag){
			resourcePool.useLocalStorageFlag = 1;
		} else {
			resourcePool.useLocalStorageFlag = 0;
		};
		if ($scope.storageOptions && $scope.storageOptions.length > 0 && angular.isNumber($scope.tmp.backupDestNum) && $scope.storageOptions[$scope.tmp.backupDestNum]) {
			resourcePool.storageId = $scope.storageOptions[$scope.tmp.backupDestNum].key;
		};
		
		
		HttpService.put("resourcePool/modify", resourcePool, $modalInstance);
	}
	
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	
})


