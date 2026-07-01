var customTitleTemplate='<div class="ngCellText" style="padding-top:2px;" ng-class="col.colIndex()">' + 
		'<div style="text-overflow:ellipsis;" custom-title="{{row.entity.title}}" > {{row.entity.title}}</div>' +
		'</div>';
//=============================================================================================
// 组织列表
//=============================================================================================
routeApp.controller('OrgListCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, OrgService){
	// 虚拟机列表；
	var url = "org/list";
	var maskDiv = "orgListDivId";
	$scope = GridService.grid($scope, url, null, null, null, maskDiv);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_80, true);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_80, true);
    $scope.gridOptions = OrgService.orgList(true);
    $scope.gridOptions.filterOptions=$scope.filterOptions;
    $scope.gridOptions.pagingOptions=$scope.pagingOptions;
    
    // 跳转函数
	$scope.jump = function(entity) {
		// 广播导航节点选中事件
		selectTreeNode($scope, 'main.org', 'org', 'list', entity.id);
    };
    $scope.modifyOrg = function (org) {
    	OrgService.modifOrg(org, $scope.refreshPage);
    };
    
    $scope.addOrg = function () {
    	OrgService.addOrg();
    };
    $scope.delOrg = function (org) {
    	var modalInstance = UtilService.confirm($translate.instant('org.delAlt',{value:org.name}),$translate.instant('org.del'));
		modalInstance.result.then(function (selectedItem) {
			HttpService.delete('org/del/' + org.id + "/" + org.name, null, modalInstance);
		}, function () {
		});
    };
    //注册刷新组织事件
    $scope.$on(constant.onRefreshOrgList, function(event, msg) {
        $scope.refreshPage();
    });
    
    //修改问题单:201706080624  遮罩层还在时切换页面,要等数据加载完才关闭.
    $scope.$on("$destroy", function() {
        UtilService.dismissAreawait(maskDiv + "areawait");
    });
});

//=============================================================================================
//修改组织
//=============================================================================================
routeApp.controller('OrgModifyCtrl',function(org,$rootScope, $scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService, OrgService){
	$scope.model = org;
	$scope.storageOptions = [];
	$scope.tmp = {};
	$scope.tmp.storageOptions = [];
	$http({ 
		method: 'GET', 
		url: 'org/detail/' + org.id
	}).success(function(result) { 
		$scope.model = result.data;
		if (result.data != null && result.data.cloudType == 2) {
			//$scope.backupDestNum = 0;
			var i = 0;
			var backupDest = result.data.backupDest;
			if (result.data.storages != null) {				
				for(var j=0; j<result.data.storages.length;j++){
					$scope.tmp.storageOptions[i] = {value:i,label:result.data.storages[j].title,path:result.data.storages[j].path};
					if (backupDest == $scope.tmp.storageOptions[i].path) {
						$scope.tmp.backupDestNum = i;
					}
					i++;
				}
			}
		}
		$scope.storageOptions = $scope.tmp.storageOptions;
		UtilService.handleResult(result);
		if (result.state != 0) {
			//查询组织不存在 给出错误提示后关闭窗口 刷新列表
			$modalInstance.close();
		}
	}).error(function(response, code, headers, config) {
  	  	UtilService.handleError(code);
	});
	$scope.ok = function () {
		var workflowId = 4;
    	var param = angular.copy($scope.model);
    	if($scope.model.enableAdjustSetting){
    		param.enableAdjustSetting=1;
    	}else{
    		param.enableAdjustSetting=0;
    	}
		if ($scope.storageOptions.length > 0 && angular.isNumber($scope.tmp.backupDestNum) && $scope.storageOptions[$scope.tmp.backupDestNum]) {			
			param.backupDest = $scope.storageOptions[$scope.tmp.backupDestNum].path;
		}
		var addCallBack = function() {
			$rootScope.$broadcast('onRefreshOverview', org);
		}
		HttpService.put('org/modify', param, $modalInstance, addCallBack);
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

//=============================================================================================
//增加组织
//=============================================================================================
routeApp.controller('OrgAddCtrl',function($scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService, OrgService){
	$scope.model = {};
	$scope.cloudSelections = [];
	$scope.cloudId = -1;
	$scope.managerSelections = [];
	$scope.managerNames = "";
	$scope.rpName = $translate.instant('resourcePool.resourcePool');
	$scope.stepTitles = [$translate.instant('org.baseConfig'),$translate.instant('org.manager'),$translate.instant('org.quota')];
	//form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1_org').val() === "true")
                return true;
            return false;
        },
        stepThreeOver : function() {
            if ($('#form3_org').val() === "true" && $scope.clusterSelections.length > 0) {
            	return true;
            }
            return false;
        },
        stepFiveOver : function() {
            if ($('#form5_org').val() === "true") {
            	return true;
            }
            return false;
        },
        stepSixOver : function() {
            if ($('#form6_org').val() === "true")
                return true;
            return false;
        }
    };
	//回车
    $scope.ok = function(ev) {
    	var uri = "org/add";
    	var data = $scope.model;
//    	data.cloudId = $scope.cloudId;
//    	data.cloudType = $scope.cloudType;
    	data.resourcePool = $scope.resourcePool;
    	var mangers = [];
    	for (var i = 0; i < $scope.managerSelections.length; i++) {
    		var manger = $scope.managerSelections[i];
    		mangers[i] = {id:manger.id, name:manger.name, type:manger.type}
		}
    	data.mangers = mangers;
    	// 修改问题单201605130074 增加组织设置允许修改配置报错 add by z10350 2016.5.13
    	if ($scope.model.enableAdjustSetting == 1) {
    		data.enableAdjustSetting = 1;
    	} else {
    		data.enableAdjustSetting = 0;
    	}
    	
    	var waitModal = UtilService.wait();
    	$http.post(uri, data).success(function(result){
    		waitModal.dismiss();
    		UtilService.handleResult(result);
    		if (result.state == 0) { 
    			$modalInstance.close('success');
    			$timeout(function(){
    				var params = {};
        			params.id = result.data;
        			params.name = $scope.model.name;
        			params.cloudId = $scope.cloudId;
        			params.cloudType = $scope.cloudType;
//        			if ($scope.cloudType == 5) { //cloudoS组织直接跳到vm界面
//        				$state.go('main.org.cloudOsVm', params);
//        			} else {
//        				$state.go('main.org.summary', params);
//        			}
    			}, 45)
    		}
    	}).error(function(response, code, headers, config) {
    		waitModal.dismiss();
    		UtilService.handleError(code);
    	});
    	
//    	HttpService.post(uri, data, $modalInstance);
    };
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$watch('model.enableAdjustSetting', function(newVal, oldVal) {
    	if ($scope.model.enableAdjustSetting == 1) {
    		$scope.enableAdjustSetting = $translate.instant('common.yes');
    	} else {
    		$scope.enableAdjustSetting = $translate.instant('common.no');
    	}
	});

    $scope.selectResourcePool = function () {
    	var params = {};
    	params.selectMul = true;
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/common/selectSingle.html',
			controller: 'SelectOrgResourcePoolCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {
				params: function(){
					return params;
				}
			}
		});
		modalInstance.result.then(function (selectedItems) {
			if (angular.isDefined(selectedItems) && selectedItems.length > 0) {
				$scope.rpNames = "";
				$scope.resourcePool = [];
				for (var i=0; i<selectedItems.length; i++) {
					var sel = {};
					sel.id= selectedItems[i].id;
					sel.name = selectedItems[i].name;
					$scope.resourcePool.push(sel);
					$scope.rpNames += selectedItems[i].name +",";
				}
				$scope.rpNames = $scope.rpNames.substr(0,$scope.rpNames.length-1);
      		}
		}, function (reason) {
		});
    }
    
//////////////////////////////////////////////////////
// 配置组织管理员 
	var flagTmp = '<div class="ngCellText" ng-class="col.colIndex()">' +
	'<span ng-if= \'row.entity.type == 1\' >' + $translate.instant("operator.operator") + '</span>' +
	'<span ng-if= \'row.entity.type == 2\'>' + $translate.instant("operator.opertorGrp") + '</span></div>' ;
	var column=[{ field: 'name', displayName:$translate.instant('common.name'),width:'30%'},
	            { field: 'desc', displayName:$translate.instant('common.desc'),  width:'35%'},
	            { field: 'type', displayName:$translate.instant('common.type'), cellTemplate:flagTmp, width:'20%'},
	            { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="del(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div></div>'
	              }];
	$scope.managerGridOptions = {
		data: 'managerData',
		jqueryUITheme: false,
		jqueryUIDraggable: true,
		multiSelect: true,
		showGroupPanel: false,
		showColumnMenu: false,
		showFilter: false,
		enableCellSelection: false,
		enableCellEditOnFocus: false,
		enablePaging: false,
		showFooter: false,
		groupsCollapsedByDefault:false,
		i18n: $translate.instant('load.static.lang'),
		totalServerItems: 'totalServerItems',
		filterOptions: false,
		pagingOptions: false,
		columnDefs:column
	};
	$scope.managerData = $scope.managerSelections;
	$scope.selectOperator = function() {
		OrgService.selManger({}, addSelMangerCallBack);
	};
	$scope.changeMangerStr = function() {
		$scope.managerNames = "";
		for (var j = 0; j < $scope.managerSelections.length; j++) {
			$scope.managerNames += $scope.managerSelections[j].name;
			if (j< $scope.managerSelections.length - 1) {
				$scope.managerNames += ",";
			}
		}
	}
	var addSelMangerCallBack = function(mangers) {
		if (mangers instanceof Array) {
			for (var i = 0;i< mangers.length;i++) {
				var flag = true;
				for (var j = 0; j < $scope.managerSelections.length; j++) {
					var manger = $scope.managerSelections[j];
					if (manger.type == 1) {
						if (manger.id == mangers[i].id) {
							flag = false;
						}
					}
				}
				if (flag) {					
					$scope.managerSelections.push({
						name:mangers[i].loginName,
						desc:mangers[i].userName,
						id:mangers[i].id,
						type:1
					});
				}
			}
		}
		$scope.changeMangerStr();
	}
	$scope.selectGroups = function() {
//		var groupInstance = UtilService.lgmodal('html/modal/common/operatorGroupSelector.html', 'operatorGroupSelectCtrl');
		var param = {};
		var groupInstance = UtilService.lgmodal('html/modal/common/multiselect.html', 'SelectMulOpGroupCtrl',{param : function() {return param;}});
		groupInstance.result.then(function (reason) {
			if (angular.isDefined(reason) && reason != 'cancel') {
				var sels = reason;
				if (!reason instanceof Array) {
					sels = [reason];
				}
				for (var j=0;j<sels.length;j++) {					
					// 点击了确定按钮
					var sl = sels[j];
					var flag = true;
					for (var i = 0; i < $scope.managerSelections.length; i++) {
						var manger = $scope.managerSelections[i];
						if (manger.type == 2) {
							if (manger.id == sl.id) {
								flag = false;
							}
						}
					}
					if (flag) {
						sl.type=2
						$scope.managerSelections.push({
							name:sl.name,
							desc:sl.description,
							id:sl.id,
							type:2,
							gpCode:sl.code
						});
					}
				}
				$scope.changeMangerStr();
			};
		}, function (reason) {
			
		});
	};
	$scope.del = function(entity) {
		for (var i = 0; i < $scope.managerSelections.length; i++) {
			var manger = $scope.managerSelections[i];
			if (manger.type == entity.type && manger.id == entity.id) {
				$scope.managerSelections.splice(i,1);
				break;
			}
		}
		$scope.changeMangerStr();
	}
});

//=============================================================================================
//组织
//=============================================================================================
routeApp.controller('OrgCtrl',function($stateParams,$scope,$rootScope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, OrgService){
	/**按钮的权限信息start**/
	var permissions = localStorage.getItem("permissions");
	$scope.showModifyOrg = true;
	$scope.showAddResource = true;
	$scope.showAddStoragePool = true;
	$scope.showAddVSwitch = true;
	$scope.showDelOrg = true;
	$scope.showAddUser = true;
	$scope.showAddGroup = true;
	if (angular.isDefined(permissions)) {
		var permissonArr = JSON.parse(permissions);
		if (angular.isArray(permissonArr)) {
			$scope.showModifyOrg = permissonArr.contains(constant.HOST_ADD);
			$scope.showAddResource = permissonArr.contains(constant.HOST_MODIFY);
		}
	} 
	$scope.id = $stateParams.id;
	$scope.name = $stateParams.name;
	$scope.cloudId = $stateParams.cloudId;
	$scope.cloudType = $stateParams.cloudType;
	var org = {id:$stateParams.id,name:$stateParams.name,
			cloudId : $stateParams.cloudId, cloudType :$stateParams.cloudType}
	$scope.modifyOrg = function () {
	  	OrgService.modifOrg(org);
	};
	$scope.releaseResourcePool = function () {
	  	OrgService.releaseResourcePool($scope.id);
	};
	$scope.addRes = function () {
    	OrgService.addRes(org);
    };
//	$scope.releaseStorage = function() {
//		var addCallBack = function() {
//			$rootScope.$broadcast('onRefreshStorage', $stateParams);
//		};
//	  	OrgService.releaseStorage(org, addCallBack);
//	}
//	$scope.releaseVswitch = function() {
//		var addCallBack = function() {
//			$rootScope.$broadcast('onRefreshVswitch', $stateParams);
//		};
//	  	OrgService.releaseVswitch(org, addCallBack);
//	}
//	$scope.releaseProfile = function() {
//	  	OrgService.releaseProfile(org);
//	}
	$scope.delOrg = function() {
		OrgService.delOrg(org,function() {
		});
	}
	//增加用户
    $scope.addUser=function(){
        var addUserModal = $modal.open({
            templateUrl: 'html/modal/systemManage/user/addUser.html',
            controller: 'addUserCtrl',
            backdrop:'static',
            resolve:{
               	type:function(){return "orgAdd";},
               	rowObject:function(){return {orgId:$stateParams.id,orgName:$stateParams.name};}
            }
        });
        addUserModal.result.then(function () {
        	//$scope.refreshPage();
        }, function (reason) {
        });
    };
    //增加用户分组
    $scope.addGroup=function(){
        var addUserGrpModal = $modal.open({
            templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
            controller: 'addUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	type:function(){return "orgAddGrp";},
            	rowObj:function(){return {orgId:$stateParams.id,orgName:$stateParams.name};}
            }
        });
        addUserGrpModal.result.then(function () {
//        	$scope.queryData();
        }, function (reason) {
        });
    };
});
//=============================================================================================
// overview
//=============================================================================================
routeApp.controller('OrgOverviewCtrl',function($stateParams,$scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, OrgService, EchartService){
	var cpuTop5 = echarts.init(document.getElementById("vmringChart"));
	var memoryTop5 = echarts.init(document.getElementById("vmbarChart"));  
	var vmCircle = echarts.init(document.getElementById("vmCircle"));
	var countUserPic = echarts.init(document.getElementById("countUserPic"));
	var countCpuPic = echarts.init(document.getElementById("countCpuPic"));
	var countMemoryPic = echarts.init(document.getElementById("countMemoryPic"));
	var countStoragePic = echarts.init(document.getElementById("countStoragePic"));
	var countVmPic = echarts.init(document.getElementById("countVmPic"));
	var noDataText = $translate.instant('common.noData');
	
	var init = function () {
		if ($stateParams.cloudType == constant.PUBLIC_CLOUD_OS) {
			//CloudOS初始化
			
		} else {
			$http({
		        method : 'GET',
		        url    : 'dashboard/getOrgInfo?id=' + $stateParams.id
		    }).success(function(result) {
			   if (result && result.length > 0) {
				   var id = result[0].id;
				   var publicId = result[0].publicId;
				   
				   //获取虚拟机状态
				   EchartService.getVmStatus("dashboard/vmStatus?orgId=" + id + "&publicId=" + publicId, vmCircle);
				   // 用户数统计
				   EchartService.getUserStatus("dashboard/userStatus?orgId=" + id + "&publicId=" + publicId, countUserPic);
				   //CPU/内存统计
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countCpuPic, "orgCpu","orgCpuCur","cpuUtilRate",0);
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countMemoryPic, "orgMem","orgMemCur","memUtilRate",1);
				   //存储/虚拟机统计
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countStoragePic, "orgStorage", "orgStorageCur", "storageUtilRate",2);
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countVmPic, "orgVmCount", "orgVmCur", "vmUtilRate", 3);
				   //top5虚拟机CPU
				   EchartService.vmTop5Cpu("dashboard/vmTopCpuInfo?orgId=" + id, cpuTop5, noDataText, 'vmringChart');
				   //top5虚拟机内存
				   EchartService.vmTop5Mem("dashboard/vmTopMemInfo?orgId=" + id, memoryTop5, noDataText, 'vmbarChart');
			   }
		    }).error(function(response, code, headers, config) {
		    	UtilService.handleError(code);
			});
		}
	};
	$scope.$on('onRefreshOverview', function(event, msg) {
		if ($stateParams.id == msg.id) {
			init();
		}
	});	
	
	init();
	$scope.resizeFun = function() {
		if (angular.isDefined(cpuTop5)) {
			cpuTop5.resize();
		}
		if (angular.isDefined(memoryTop5)) {
			memoryTop5.resize();
		} 
		if (angular.isDefined(vmCircle)) {
			vmCircle.resize();
		}
		if (angular.isDefined(countUserPic)) {
			countUserPic.resize();
		};
		if (angular.isDefined(countCpuPic)) {
			countCpuPic.resize();
		};
		if (angular.isDefined(countMemoryPic)) {
			countMemoryPic.resize();
		}
		if (angular.isDefined(countStoragePic)) {
			countStoragePic.resize();
		}
		if (angular.isDefined(countVmPic)) {
			countVmPic.resize();
		}
	}
	
	$(window).on("resize", $scope.resizeFun);
	$scope.$on(constant.onNavClick, function(){
		$scope.resizeFun();
	});
	$scope.$on("$destroy", function(){
		$(window).off("resize", $scope.resizeFun);
		EchartService.dispose(cpuTop5,memoryTop5, vmCircle,countUserPic,countCpuPic,
				countMemoryPic,countStoragePic,countVmPic);
	});
	
});
// 组织虚拟机
routeApp.controller('OrgVmCtrl',function($stateParams,$scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, OrgService, DomainService){
	var domain = {};
	$scope.params2 = [];
	$scope.mySelections = [];
	var cloudType = $stateParams.cloudType;
	var defs = [];
	
	var antivirusTemplate = '<div><div class="ngCellText"><span ng-if="row.entity[col.field] == 0" translate="common.unable"></span>' +
	    '<span ng-if="row.entity[col.field] == 1" translate="common.enable"></span>' +
	    '</div></div>';
	
	//cloudOS虚拟机运行状态
	var cloudOSVmStatusTemplate='<div class="ngCellText" ng-class="col.colIndex()">' +
		'<div ng-if= \'row.entity[col.field] == "running"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_running.svg"></span><span>' + $translate.instant("vm.execute") + '</span></div>' +
		'<div ng-if= \'row.entity[col.field] == "shutOff"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span>' + $translate.instant("vm.close") + '</span></div>' +
		'<div ng-if= \'row.entity[col.field] == "suspended"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span>' + $translate.instant("vm.suspended") + '</span></div>' +
		'<div ng-if= \'row.entity[col.field] == "unknown"\'><span class="span_padding"><img class="pic1img" src="css/img/gray/Icon_unkown.svg"></span><span>' + $translate.instant("vm.unkown") + '</span></div></div>';
	
	if (cloudType == 5) {
		defs = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'10%',cellTemplate:titleTemplate,visible:false},
	            { field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'10%',cellTemplate:titleTemplate},
	            { field: 'desc', displayName: $translate.instant('common.desc') , sortable: true, cellTemplate:titleTemplate, width:'20%'},
                { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'10%', cellTemplate:cloudOSVmStatusTemplate},
                { field: 'cpu', displayName: 'CPUs', sortable: true,width:'10%'},
                { field: 'memory', displayName: $translate.instant('common.memory'), sortable: true,cellFilter:'byteUnitRender', width:'10%'},
                { field: 'osVersion', displayName: $translate.instant('common.os'), sortable: true, width:'20%'}
               ];
	} else {
		defs = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'9%',cellTemplate:titleTemplate,visible:false},
		        { field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'9%',cellTemplate:titleTemplate},
		        { field: 'desc', displayName: $translate.instant('common.desc') , sortable: true, cellTemplate:titleTemplate, width:'9%'},
	            { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'7%', cellTemplate:vmstatusTemplate($translate)},
                { field: 'cpuRate', displayName: $translate.instant('common.cpuRate'), sortable: true, width:'10%',cellTemplate:progressTemplate},
	            { field: 'memRate', displayName: $translate.instant('common.memoryRate'), sortable: true, width:'10%',cellTemplate:progressTemplate},
	            { field: 'cpu', displayName: 'CPUs', sortable: true,width:'5%'},
	            { field: 'mem', displayName: $translate.instant('common.memory'), sortable: true,cellFilter:'byteUnitRender', width:'8%'},
                { field: 'system', displayName: $translate.instant('common.os'), sortable: true, width:'10%', cellTemplate:titleTemplate},
	            { field: 'protectModel', displayName: $translate.instant('vm.protectModel') , sortable: true,cellTemplate :
	                	'<div class="ngCellText">' +
	                	'<span ng-if= \'row.entity.protectModel == 0\' >' + $translate.instant("common.unable") + '</span>' +
	                	'<span ng-if= \'row.entity.protectModel == 1\' >' + $translate.instant("common.enable") + '</span></div>'
	                	,width:'7%'},
	            { field: 'antivirusConfig', displayName: $translate.instant('cloudService.antivirusConfig'), sortable: true, width:'8%', cellTemplate:antivirusTemplate},  	
            	{ field: 'resName', displayName: $translate.instant('resourcePool.resourcePool') , sortable: true, width:'8%'}
	               ];
	}


	
	///动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);

    var maskDiv = 'orgVmListDiv';
	var url = "org/vms";
	var params = {orgId:$stateParams.id};
	$scope = GridService.grid($scope, url, params, undefined, undefined, maskDiv);
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
        afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
        	angular.copy($scope.mySelections, selectedRow);
        	domain = rowItem.entity;
        	//多选清空用户分组表
        	if ($scope.mySelections.length != 1) {
        		$scope.$watch('mySelections2', function(newValue, oldValue) {
        			if ($scope.mySelections.length != 1) {
        		$scope.mySelections2.splice(0, $scope.mySelections2.length);
        			}
        		});
//        		$scope.$watch('myData2', function(newValue, oldValue) {
//        			if ($scope.mySelections.length != 1) {
//        		$scope.myData2.splice(0, $scope.myData2.length); 
//        			}
//        		});
        		$scope.mySelections2.splice(0, $scope.mySelections2.length);
        		$scope.myData2.splice(0, $scope.myData2.length); 
        	} else { 
        		$scope.params2.id = $stateParams.id;
                $scope.params2.vmId = $scope.mySelections[0].id;
                $scope.params2.uniqueKey = rowItem.entity.uniqueKey;
                $scope.params2.cloudType = rowItem.entity.cloudType;
        		$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);
        		
        		//根据选中的虚拟机,确定云资源类型
        		if (rowItem.entity.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
        		    $scope.menuType = "vmwareOrg";
        		} else if (rowItem.entity.cloudType == constant.PUBLIC_CLOUD_CVM) {
        		    $scope.menuType = "cvmOrg";
        		} else if (rowItem.entity.cloudType == constant.PUBLIC_CLOUD_OS) {
        		    $scope.menuType = "cloudOSOrg";
                } else {
                    $scope.menuType = "cvmOrg";
                }
        	}
          	if (rowItem.selected == true && $stateParams.cloudType == 5) {
          		$scope.vm = DomainService.updateCloudOSVmButton(domain);
          	}
        },
        columnDefs: defs,
        rowTemplate: doubleClickTemplate    //双击行模板
    };  
    // 选中行的数组
    var selectedRow = new Array();
    
    $scope.$on('ngGridEventData', function(row, event) {
        var renderedRows = row.targetScope.renderedRows.length;
        if (renderedRows > 0) {              // 有数据显示时才执行
            var ngrow0 = row.targetScope.renderedRows[0];
            var ngCol0 = row.targetScope.renderedColumns[row.targetScope.renderedColumns.length - 1];
            if (ngrow0.selected == true || ngCol0.field == 'desktopPool') {   // 此处会执行多次，只要第一行选中就返回，防止多次触发afterSelectionChange事件
                return;
            }
            var selectArray = new Array();
            angular.copy(selectedRow, selectArray);
            if (angular.isArray(selectArray) && selectArray.length > 0) {
            	var existSelected = false;
	         	for (var i = 0; i < renderedRows; i++) {
	             	var ngrowi = row.targetScope.renderedRows[i];
	             	for (var j = 0; j < selectArray.length; j++) {
		             	if (ngrowi.entity['id'] == selectArray[j]['id']) {
		             		$scope.gridOptions.selectRow(ngrowi.rowIndex, true);
		             		existSelected = true;
		             		break;
		             	}
	             	}
	             }
	         	 // 如果已经选择的数组都不存在了,则默认选择第一行
             	 if (existSelected) {
             	 	return;
             	 }
	         }
            if($scope.gridOptions.hasOwnProperty("selectRow")){
            	$scope.gridOptions.selectRow(0, true);
            }
        } 
    });
    //搜索框
    $scope.$watch('vmListTitle', function(newValue, oldValue) {
        if (newValue != oldValue) {
            //设置时间间隔
            if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
                $timeout.cancel($scope.keyInterval);
            }
            $scope.keyInterval = $timeout(function() {
            	if (!isEmpty(newValue)) {
            		$scope.params.title = newValue;
            	} else {
            		delete $scope.params.title;
            	}
            	//修改问题单201608120501，虚拟机名称查询结果页面不从第一页显示
                $scope.pagingOptions.currentPage = 1;
                $scope.refreshOrgVmList();
            }, constant.keyInterval);
        }
    });
	//刷新虚拟桌面列表
    $scope.refreshOrgVmList = function() {
        $scope.mySelections.splice(0, $scope.mySelections.length);
        $scope.refreshPage();
    };
    
    //注册刷新事件
    $scope.$on(constant.onReloadVmList, function(event, msg) {
        $scope.refreshOrgVmList();
    });
	
	$scope.rightClick = function(row, e) {
        if (e.which == 3 && row.selected == false) {// 1:left, 2:middle, 3:right
            // unselected all rows
            $scope.gridOptions.selectAll(false);
            // select right click row
            $scope.gridOptions.selectRow(row.rowIndex, true);
        }
    };
    
    $scope.listStyle = $scope.gridStyle();
    var userType = '<div class="ngCellText" ng-class="col.colIndex()">' +
    		'<span ng-if= \'row.entity.flag == 0\'>' + $translate.instant("common.organization") + '</span>' +
			'<span ng-if= \'row.entity.flag == 1\'>' + $translate.instant("org.user") + '</span>' +
			'<span ng-if= \'row.entity.flag == 2\'>' + $translate.instant("common.userGroup") + '</span></div>';
    var userOper ='<div><div has-permission="VIRT_HOST_DISTRIBUTE" class="ngCellButton">'
	 		+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delUser(row.entity)" custom-title="{{\'common.delete\'|translate}}"></div>'
	 		+'</div></div>';
    var defs2 = [{ field: 'name', displayName: $translate.instant('org.loginGpName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
                 { field: 'desc', displayName: $translate.instant('org.userDescName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
                 { field: 'flag', displayName: $translate.instant('common.type') , sortable: true, width:'10%',cellTemplate:userType},
                 { field: 'desktopPool', displayName: $translate.instant('org.virDeskName') , sortable: true, width:'20%',cellTemplate:titleTemplate}];
    var urlUser = "org/vmUser";
	var params2 = {orgId:$scope.params2.id, vmId:$scope.params2.vmId};
	$scope = GridService.grid2($scope, urlUser, params2);
    $scope.userOptions = {
		data: 'myData2',
		jqueryUITheme: false,
		jqueryUIDraggable: false,
        selectedItems: $scope.mySelections2,
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
        totalServerItems: 'totalServerItems2',
        filterOptions: $scope.filterOptions2,
        pagingOptions: $scope.pagingOptions2,
        columnDefs: defs2
//        rowTemplate: doubleClickTemplate    //双击行模板
    };  
    $scope.delUser = function(user) {
    	var revokeAlert ;
    	if (user.flag == 0 ){
    		revokeAlert = $translate.instant('org.revokeOrg',{value:user.orgName})
    	} else if (user.flag == 1) {
    		revokeAlert = $translate.instant('org.revokeUser',{value:user.name})
    	} else {
    		revokeAlert = $translate.instant('org.revokeUserGroup',{value:user.name})
    	}
    	var modalInstance = UtilService.confirm(revokeAlert,$translate.instant('org.delAuthority'));
		modalInstance.result.then(function (selectedItem) {
			var params = {
					orgId:$stateParams.id,
			    	domainId:domain.id,
			    	title:domain.title,
			    	name:user.name,
			    	orgName:user.orgName,
			    	flag:user.flag,
			    	id:user.id,
			    	desktopPoolId:user.desktopPoolId,
			    	cloudType:domain.cloudType,
			    	uniqueKey:domain.uniqueKey
			};
			HttpService.put('org/revoke', params, modalInstance, refreshUserAndVm);
		}, function () {
		});
		var refreshUserAndVm = function () {
			$scope.refreshPage2();
			$scope.refreshOrgVmList();
		}
    };
    
    $scope.$on('onRefrenshVmUserList', function(event, msg) {
    	$scope.mySelections2.splice(0, $scope.mySelections2.length);
        $scope.refreshPage2();
    });
    
    //修改问题单:201706080624  遮罩层还在时切换页面,要等数据加载完才关闭.
    $scope.$on("$destroy", function() {
        UtilService.dismissAreawait(maskDiv + "areawait");
    });
});


//【虚拟机模板列表控制器】
routeApp.controller('OrgTemplateCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService,OrgService) {
	var params = {
			id:$stateParams.id,
			name:$stateParams.name
	};
//	params.id=$scope.id;
	var url = 'org/orgTemplate';
	var column = [{ field: 'domainName', displayName: $translate.instant('common.name'), sortable: true, width:'10%',cellTemplate:titleTemplate},
	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'20%',cellTemplate:titleTemplate},
	              { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'4%'},
	              { field: 'memory', displayName: $translate.instant('template.memory'), cellFilter:'memory', sortable: true, width:'8%'},
	              { field: 'storage', displayName: $translate.instant('template.storage'),cellFilter:'byteUnitRender', sortable: true, width:'8%'},
	              { field: 'createDate', displayName: $translate.instant('template.createTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'14%'},
	              { field: 'system', displayName: $translate.instant('common.os'), cellFilter:'system', sortable: true, width:'10%'},
	              { field: 'resourcePoolName', displayName: $translate.instant('resourcePool.resourcePool'), sortable: true, width:'19%', cellTemplate:titleTemplate},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-deploy-gray" has-permission="ORGANIZATION_VM_DEPLOY" ng-click="deployTemplate(row.entity)" custom-title="'+$translate.instant('template.deploy')+'"></div>'
	            	  +'<div type="button" class="btn btn-sm-icon icon-batchdeploy-gray" has-permission="ORGANIZATION_VM_BATCH_DEPLOY" ng-click="batchDeployTemplate(row.entity)" custom-title="'+$translate.instant('org.batchDeploy')+'"></div>'
	            	  +'</div></div>'
	              }
	              ];
	var column2 = [{ field: 'mac', displayName: $translate.instant('host.mac'), sortable: true, width:'12%'},
 	              { field: 'name', displayName: $translate.instant('addDomain.vswitch'), sortable: true, width:'13%',cellTemplate:titleTemplate},
	              { field: 'profileName', displayName: $translate.instant('addDomain.profile'), sortable: true, width:'15%', cellTemplate:titleTemplate},
	              { field: 'vlan', displayName: 'VLAN', sortable: true, width:'10%'},
	              { field: 'outAvgBand', displayName: $translate.instant('template.outBandwidthLimit'), sortable: true, width:'12%'},
	              { field: 'outBurst', displayName: $translate.instant('vm.outBytes'), sortable: true, width:'13%'},
	              { field: 'inAvgBand', displayName: $translate.instant('template.inBandwidthLimit'), sortable: true, width:'12%'},
	              { field: 'inBurst', displayName: $translate.instant('vm.inBytes'), sortable: true, width:'13%'}
	              ];
	var column3 = [{ field: 'device', displayName: $translate.instant('template.devName'), sortable: true, width:'25%'},
	               { field: 'targetBus', displayName: $translate.instant('template.busType'), sortable: true, width:'25%'},
	               { field: 'storeFile', displayName: $translate.instant('template.volName'), sortable: true, width:'25%'},
	               { field: 'capacity', displayName: $translate.instant('template.capacity'),cellFilter:'byteUnitRender', sortable: true, width:'25%'}
	               ];
	if ($stateParams.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
		//存储列表
		var column3 = [ { field: 'storeFile', displayName: $translate.instant('template.volName'), sortable: true, width:'50%', cellTemplate:titleTemplate},
		                { field: 'capacity', displayName: $translate.instant('template.capacity'), sortable: true, width:'50%', cellFilter:'byteUnitRender'}
		                      ];
		//网络列表
	    var column2 = [ { field: 'mac', displayName: $translate.instant('addDomain.mac'), sortable: true, width:'50%'},
		                  { field: 'name', displayName: $translate.instant('template.netname'), sortable: true, width:'50%'}
		                  ];
	}
	//Cloud OS只有“部署虚拟机”，“批量部署”和“删除虚拟机模板”删除
	if ($stateParams.cloudType == constant.PUBLIC_CLOUD_OS){
		var column = [{ field: 'domainName', displayName: $translate.instant('common.name'), sortable: true, width:'10%',cellTemplate:titleTemplate},
		              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'10%',cellTemplate:titleTemplate},
		              { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'10%'},
		              { field: 'memory', displayName: $translate.instant('template.memory'), cellFilter:'memory', sortable: true, width:'10%'},
		              { field: 'storage', displayName: $translate.instant('template.storage'),cellFilter:'byteUnitRender', sortable: true, width:'10%'},
		              { field: 'createDate', displayName: $translate.instant('template.createTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'15%'},
		              { field: 'system', displayName: $translate.instant('common.os'), cellFilter:'system', sortable: true, width:'15%'},
		              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
		            	  '<div><div class="ngCellButton">'
		            	  +'<div type="button" class="btn btn-sm-icon icon-deploy-gray" has-permission="ORGANIZATION_VM_DEPLOY" ng-click="deployTemplate(row.entity)" custom-title="'+$translate.instant('template.deploy')+'"></div>'
		            	  +'</div></div>'
		              }
		              ];
	}
	
    //手工同步虚拟机模板
    $scope.syncResourceTemp = function() {
        var operateInfo = {name:params.name};
        var syncInstance = UtilService.confirm($translate.instant('org.syncOrgTemplateConfirm', operateInfo),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            HttpService.put('org/'+ params.id +'/sync/temp');
        }, function () {
        });
    }
    
    //注册刷新事件
    $scope.$on(constant.onRefreshOrgVmTemplateList, function(event, msg) {
    	if (msg == params.id) {
    		$scope.refreshTempletPage();
    	}
    });
	//动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	$scope = GridService.grid($scope, url, params, null, null, 'templateListDivId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.setSelection = function() {
	        $scope.gridOptions.selectRow(0, true);
	};
	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(85);
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
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column,
			afterSelectionChange :function (rowItem, event) {
				selectedRow.splice(0, selectedRow.length, rowItem.entity);
				if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {
					var detailUrl = 'template/details';
			        var detailParam = {
			        		vmId:rowItem.entity.id,
							orgId:$stateParams.id
			        };
					if (rowItem.entity.publicCloudType == constant.PUBLIC_CLOUD_VMWARE) {
						detailUrl = 'vmware/vcenter/' + rowItem.entity.publicCloudId + '/vm/detail';
				        detailParam = {
			                isTemplate:true,
			                key:rowItem.entity.vmKey,
			                name:rowItem.entity.domainName
				        };
				      
					} 
					$http({
			            method: 'GET',
			            url: detailUrl,
			            params: detailParam
			        }).success(function (result) {
			            if (result.state == 0 && result.data) {
			                $scope.netData = result.data.networks;
			                $scope.storageData = result.data.storages;
			            }
			            //修改问题单201702100203  CVM处删除已经发布的某个虚拟机模板，CIC的组织的模板TAB页内选中CVM中被删除的模板，点击删除按钮，会先弹出“虚拟机模板不存在”的提示，点击确定后才能出现删除该模板的提示,建议修改成点击删除是直接弹出提示删除，不是先提示模板不存在
//			            UtilService.handleResult(result);
			        }).error(function(response, code, headers, config) {
			            UtilService.handleError(code);
			        });
				}
			}
	}; 
	$scope.gridOptions2 = {
			data: 'netData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.myNetSelections,
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
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column2
	}; 
	$scope.gridOptions3 = {
			data: 'storageData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.myStorageSelections,
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
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column3
	}; 
			$state.go('main.org.template.net');
	// 选中行的数组
    var selectedRow = new Array();
    // 默认选中第一行，如果已经有选择的元素则继续选中。
    selectFirstLine($scope, selectedRow, 'domainName');
	
	$scope.refreshTempletPage = function() {
		if ($scope.mySelections != null) {			
			$scope.mySelections.splice(0, $scope.mySelections.length);
		}
		$scope.refreshPage();
	}
	//注册列表刷新事件
//    $scope.$on(constant.onQueryTemplate, function (event, msg) {
//        $scope.refreshPage();
//    });
	 
	//手工同步虚拟机模板
/*    $scope.syncTemp = function() {
	    params.type = ($stateParams.cloudType == constant.PUBLIC_CLOUD_VMWARE) ? "VMWARE" : ($stateParams.cloudType == constant.PUBLIC_CLOUD_OS ? "CLOUD_OS" : "CVM");
        var operateInfo = {type:params.type,name:params.name};
        var syncInstance = UtilService.confirm($translate.instant('org.syncTempConfirm', operateInfo),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            HttpService.put('cloud/'+ params.id +'/temp/sync', null, null, function(){$scope.refreshTemplateList();});
        }, function () {
        });
    }*/
    $scope.deployTemplate = function(row) {
        var waitModal = UtilService.wait();
        $http({
            method:'GET',
            url:'template/check',
            params:{templetId:row.id}
        }).success(function(result) {
            waitModal.dismiss();
            if (result.success == true) {
                row.orgId = $stateParams.id;
                row.flag = row.publicCloudType;
                row.cloudId = row.publicCloudId;
                row.isManualDefinition = false;
                row.orgTemp = true;
                OrgService.deployTemplate(row);
            } else {
                UtilService.handleResult(result);
            }
        }).error(function(response, code, headers, config) {
            waitModal.dismiss();
            UtilService.handleError(code);
        });
	}
    $scope.batchDeployTemplate = function(row) {
        var waitModal = UtilService.wait();
    	$http({
            method:'GET',
            url:'template/check',
            params:{ templetId:row.id}
        }).success(function(result) {
            waitModal.dismiss();
            if (result.success == true) {
                row.orgId = $stateParams.id;
                row.flag = row.publicCloudType;
                row.cloudId = row.publicCloudId;
                row.orgTemp = true;
                OrgService.batchDeployTemplate(row);
            } else {
                UtilService.handleResult(result);
            }
        }).error(function(response, code, headers, config) {
            waitModal.dismiss();
            UtilService.handleError(code);
        });
	}
    var org = {id:$stateParams.id,name:$stateParams.name,
			cloudId : $stateParams.cloudId, cloudType :$stateParams.cloudType};
});

routeApp.controller('OrgCloudOsTemplateCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, 
		UtilService,GridService,HttpService,OrgService) {
	var column = [];
	$scope.cloudType = 5;
	var params = {};
	if ($stateParams.cloudId == undefined) { // 云资源/模板列表
		column = [{ field: 'domainName', displayName: $translate.instant('common.name'), sortable: true, width:'15%',cellTemplate:titleTemplate},
		              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'15%',cellTemplate:titleTemplate},
		              { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'10%'},
		              { field: 'memory', displayName: $translate.instant('template.memory'), cellFilter:'memory', sortable: true, width:'10%'},
		              { field: 'sysDisk', displayName: $translate.instant('template.miniDisk'), cellFilter:'storage:"GB"', sortable: true, width:'10%'},
		              { field: 'createDate', displayName: $translate.instant('template.createTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'20%'},
		              { field: 'system', displayName: $translate.instant('common.os'), cellFilter:'system', sortable: true, width:'20%'}
		              ];
		
		
		params = {
				cloudId:$stateParams.id
		};
	}  else { // 组织/模板列表
		column = [{ field: 'domainName', displayName: $translate.instant('common.name'), sortable: true, width:'10%',cellTemplate:titleTemplate},
	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'20%',cellTemplate:titleTemplate},
	              { field: 'cpu', displayName: $translate.instant('template.miniCpu'), sortable: true, width:'10%'},
	              { field: 'memory', displayName: $translate.instant('template.miniMem'), cellFilter:'memory', sortable: true, width:'10%'},
	              { field: 'sysDisk', displayName: $translate.instant('template.miniDisk'), cellFilter:'storage:"GB"', sortable: true, width:'10%'},
	              { field: 'createDate', displayName: $translate.instant('template.createTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'15%'},
	              { field: 'system', displayName: $translate.instant('common.os'), cellFilter:'system', sortable: true, width:'10%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	              	  '<div><div class="ngCellButton">'
	              	  +'<div type="button" class="btn btn-sm-icon icon-deploy-gray" has-permission="ORGANIZATION_VM_DEPLOY" ng-click="deployCloudOsVm(row.entity)" custom-title="'+$translate.instant('template.deploy')+'"></div>'
	              	  +'</div></div>'
	                }];
		
		params = {
				id:$stateParams.id,
				cloudId:$stateParams.cloudId,
				name:$stateParams.name
		};
		column.push();
	}

	var url = 'org/orgCloudOsTemplate';
	

	
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	$scope = GridService.grid($scope, url, params, null, null, 'templateListDivId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.setSelection = function() {
	        $scope.gridOptions.selectRow(0, true);
	};
	
	//部署cloudOs虚拟机
	$scope.deployCloudOsVm = function(row) {
		params.miniCpu = row.cpu;
		params.miniMem = row.memory;
		params.miniDisks = row.sysDisk;
		params.tmpUUid = row.uuid;
		params.tmpName = row.domainName;
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/org/orgCloudOsDeployVm.html',
			  controller: 'OrgDeployCloudOSVmCtrl',
			  size: {width:'900px'},
			  backdrop:'static',
			  resolve: {template : function() {return params;}}
		});
		modalInstance.result.then(function (selectedItem) {
		}, function () {
//	      	if (angular.isDefined(callBack)) {
//		    	if (angular.isFunction(callBack)) {
//		      		callBack.apply(this);
//		    	}
//	    	}
		});
	}
	
	
	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(85);
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
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	}; 
	
});

//由资源池代替,准备删除
///**
// * 组织集群
// */
//routeApp.controller('OrgClusterCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService) {
//	$http({
//        method : 'GET',
//        url    : 'org/orgCluster/check?id=' + $stateParams.id
//    }).success(function(result) {
//    	if (result.success) {
//    		
//    	} else {
//    		UtilService.handleResult(result);
//    	}
//    })
//	
//	var url = 'org/orgCluster/' + $stateParams.id;
//	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true,cellTemplate:titleTemplate, width:'30%'},
//	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true,cellTemplate:titleTemplate, width:'50%'},
//	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
//	            	  '<div><div has-permission="ORGANIZATION_MODIFY" class="ngCellButton">'
//	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgCluster(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//	            	  +'</div></div>'
//	              }];
//	//动态调整表格大小
//    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
//    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
//	$scope = GridService.grid($scope, url);
//	$scope.getDataAsync();
//	$scope.listStyle = $scope.gridStyle(15);
//	$scope.gridOptions = {
//			data: 'myData',
//			jqueryUITheme: false,
//			jqueryUIDraggable: false,
//			selectedItems: $scope.mySelections,
//			showSelectionCheckbox: false,
//			multiSelect: false,
//			showGroupPanel: false,
//			showColumnMenu: true,
//			showFilter: false,
//			enableCellSelection: false,
//			enableCellEditOnFocus: false,
//			enablePaging: false,
//			showFooter: false,
//			i18n: $translate.instant('lang'),
//			totalServerItems: 'totalServerItems',
//			filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			columnDefs:column
//	};  
//	$scope.delOrgCluster = function(entity) {
//    	var modalInstance = UtilService.confirm($translate.instant('org.delClusterAlter',{name:entity.name}),$translate.instant('common.opertip'));
//		modalInstance.result.then(function (selectedItem) {
//			HttpService.delete('org/orgDelCluster/' + $stateParams.id + "/" + entity.id, null, modalInstance, $scope.refreshPage);
//		}, function () {
//		});
//	};
//	
//	$scope.$on('onRefreshRes', function(event, msg) {
//		if ($stateParams.id == msg.id) {
//			$scope.refreshPage();
//		}
//	});
//});


//由资源池代替,准备删除
///**
// * 组织虚拟交换机
// */
//routeApp.controller('OrgVswitchCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService,OrgService) {
//	var url = 'org/orgVswitch/' + $stateParams.id;
//	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true,cellTemplate:titleTemplate, width:'20%'},
//	              { field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true,cellTemplate:titleTemplate, width:'20%'},
//	              { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true,cellTemplate:titleTemplate, width:'30%'},
//		          { field: 'mode', displayName:$translate.instant('org.switchMode'),cellFilter: 'vsmode',width:'15%'},
//	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
//	            	  '<div><div has-permission="ORGANIZATION_MODIFY" class="ngCellButton">'
//	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgVswitch(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//	            	  +'</div></div>'
//	              }];
//	//动态调整表格大小
//    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
//    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
//	$scope = GridService.grid($scope, url,null,null,null,"orgVswitchListDivId");
//	$scope.getDataAsync();
//	$scope.listStyle = $scope.gridStyle(15);
//	$scope.gridOptions = {
//			data: 'myData',
//			jqueryUITheme: false,
//			jqueryUIDraggable: false,
//			selectedItems: $scope.mySelections,
//			showSelectionCheckbox: false,
//			multiSelect: false,
//			showGroupPanel: false,
//			showColumnMenu: true,
//			showFilter: false,
//			enableCellSelection: false,
//			enableCellEditOnFocus: false,
//			enablePaging: false,
//			showFooter: false,
//			i18n: $translate.instant('lang'),
//			totalServerItems: 'totalServerItems',
//			filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			columnDefs:column
//	};  
//	$scope.delOrgVswitch = function(entity) {
//    	var modalInstance = UtilService.confirm($translate.instant('org.delVswitchAlter',{value:entity.name}),$translate.instant('common.opertip'));
//		modalInstance.result.then(function (selectedItem) {
//			HttpService.delete('org/orgDelVswitch/' + $stateParams.id + "/" + entity.id, null, modalInstance, $scope.refreshPage);
//		}, function () {
//		});
//	};
//	var org = {id:$stateParams.id,name:$stateParams.name,
//			cloudId : $stateParams.cloudId, cloudType :$stateParams.cloudType};
//	$scope.releaseVswitch = function() {
//    	OrgService.releaseVswitch(org, $scope.refreshPage);
//    }
//	
//	$scope.$on('onRefreshVswitch', function(event, msg) {
//		if ($stateParams.id == msg.id) {
//			$scope.refreshPage();
//		}
//	});	
//	$scope.$on('onRefreshRes', function(event, msg) {
//		if ($stateParams.id == msg.id) {
//			$scope.refreshPage();
//		}
//	});	
//	
//});

/**
 * 组织存储池
 */
//由资源池代替,准备删除
//routeApp.controller('OrgStorageCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService,OrgService) {
//    $scope.cloudType = $stateParams.cloudType;
//	var url = 'org/orgStorage/' + $stateParams.id;
//	var column = [{ field: 'title', displayName: $translate.instant('uicustomVm.title'), sortable: true, cellTemplate:titleTemplate, width:'15%'},
//	              { field: 'name', displayName: $translate.instant('common.name'), sortable: true, visible : false, cellTemplate:titleTemplate, width:'15%'},
//	              { field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true, cellTemplate:titleTemplate, width:'10%'},
//		          { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType', width:'15%'},
//		          { field: 'path', displayName:$translate.instant('host.path'),cellTemplate:titleTemplate, width:'15%'},
//		          { field: 'storage', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'},
//	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
//	            	  '<div><div has-permission="ORGANIZATION_MODIFY" class="ngCellButton">'
//	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgStorage(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//	            	  +'</div></div>'
//	              }];
//	if ($stateParams.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//		var column = [
//		              { field: 'name', displayName: $translate.instant('common.name'), sortable: true,  cellTemplate:titleTemplate, width:'20%'},
//		              { field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true, cellTemplate:titleTemplate, width:'10%'},
//		          { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType', width:'20%'},
//		          { field: 'path', displayName:$translate.instant('host.path'),cellTemplate:titleTemplate, width:'20%'},
//		          { field: 'storage', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'},
//	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
//	            	  '<div><div has-permission="ORGANIZATION_MODIFY" class="ngCellButton">'
//	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgStorage(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//	            	  +'</div></div>'
//	              }];
//	}
//	//动态调整表格大小
//    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
//    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
//	$scope = GridService.grid($scope, url,null,null,null,"orgStorageListDivId");
//	$scope.getDataAsync();
//	$scope.listStyle = $scope.gridStyle(15);
//	$scope.gridOptions = {
//			data: 'myData',
//			jqueryUITheme: false,
//			jqueryUIDraggable: false,
//			selectedItems: $scope.mySelections,
//			showSelectionCheckbox: false,
//			multiSelect: false,
//			showGroupPanel: false,
//			showColumnMenu: true,
//			showFilter: false,
//			enableCellSelection: false,
//			enableCellEditOnFocus: false,
//			enablePaging: false,
//			showFooter: false,
//			i18n: $translate.instant('lang'),
//			totalServerItems: 'totalServerItems',
//			filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
//	        	var st = rowItem.entity;
//	        	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) { 
//	        		var params = {orgId:st.orgId, clusterId:st.clusterId, clusterName:st.clusterName, name:st.name, path:st.path};
//	        		$http({
//						method:'GET',
//						url:'org/orgStorageFolder',
//						params:params
//					}).success(function(result) {
//						if (result.data != null && typeof result.data != 'undefined') {						
//							$scope.folderData = result.data;
//						} else {
//							$scope.folderData = [];
//						}
//					});
//	        	}
//	        },
//			columnDefs:column
//	};  
//	//默认选中第一行.但是此监听会执行好多次需要处理
//	$scope.$on('ngGridEventData', function(row, event) {
//		if ($scope.mySelections.length < 1) {			
//			$scope.gridOptions.selectRow(0, true);
//		}
//		if ($scope.folderSelections != null && $scope.folderSelections.length < 1) {
//			$scope.folderOptions.selectRow(0, true);
//		}
//    });
//	$scope.refesh = function() {
//		if ($scope.mySelections != null) {			
//			$scope.mySelections.splice(0, $scope.mySelections.length);
//		}
//		$scope.refreshPage();
//	};	 
//	$scope.delOrgStorage = function(entity) {
//		var showName = entity.name;
//		if ($stateParams.cloudType == constant.PUBLIC_CLOUD_CVM) {
//			showName = entity.title
//		}
//    	var modalInstance = UtilService.confirm($translate.instant('org.delStorageAlter',{value:showName}),$translate.instant('common.opertip'));
//		modalInstance.result.then(function (selectedItem) {
//			var param ={id:entity.id,orgId:entity.orgId,path:entity.path,clusterId:entity.clusterId};
//			HttpService.delete('org/orgDelStorage', param, modalInstance, $scope.refreshPage);
//		}, function () {
//		});
//	};
//	
//	var org = {id:$stateParams.id,name:$stateParams.name,
//			cloudId : $stateParams.cloudId, cloudType :$stateParams.cloudType};
//	$scope.releaseStorage = function() {
//    	OrgService.releaseStorage(org, $scope.refesh);
//    }
//	$scope.$on('onRefreshStorage', function(event, msg) {
//		if ($stateParams.id == msg.id) {
//			$scope.refesh();
//		}
//	});	
//	$scope.$on('onRefreshRes', function(event, msg) {
//		if ($stateParams.id == msg.id) {
//			$scope.refesh();
//		}
//	});	
//	
//});

//由资源池代替,准备删除
/**
 * 网络策略模板
 */
//routeApp.controller('OrgNetStCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService,OrgService) {
//	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'10%'},
//	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'10%'},
//		          { field: 'vlanType', displayName:$translate.instant('common.type'),width:'10%',cellFilter:'vlanType'},
//		          { field: 'vlan', displayName:"VLAN/VXLAN",width:'12%'},
//		          { field: 'inAvgBandwidth', displayName:$translate.instant('org.inAvgBandwidth'), width:'12%'},
//		          { field: 'inBurstSize', displayName:$translate.instant('org.inBurstSize'), width:'12%'},
//		          { field: 'outAvgBandwidth', displayName:$translate.instant('org.outAvgBandwidth'), width:'12%'},
//		          { field: 'outBurstSize', displayName:$translate.instant('org.outBurstSize'), width:'12%'},
//	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
//	            	  '<div><div class="ngCellButton">'
//	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgNetProfile(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//	            	  +'</div></div>'
//	              }]	
//	var url = 'org/orgNetProfile';
//	var params = {orgId:$stateParams.id};
//	$scope = GridService.grid($scope, url, params, null, null);
//	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//	$scope.listStyle = $scope.gridStyle(15);
//	$scope.gridOptions = {
//			data: 'myData',
//			jqueryUITheme: false,
//			jqueryUIDraggable: false,
//			selectedItems: $scope.mySelections,
//			showSelectionCheckbox: false,
//			multiSelect: false,
//			showGroupPanel: false,
//			showColumnMenu: true,
//			showFilter: false,
//			enableCellSelection: false,
//			enableCellEditOnFocus: false,
//			enablePaging: true,
//			showFooter: true,
//			i18n: $translate.instant('lang'),
//			totalServerItems: 'totalServerItems',
//			filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			columnDefs:column
//	};  
//	$scope.delOrgNetProfile = function(entity) {
//		var modalInstance = UtilService.confirm($translate.instant('org.delOrgNetProfileAlter',{value:entity.name}),$translate.instant('common.opertip'));
//		modalInstance.result.then(function (selectedItem) {
//			HttpService.delete('org/orgDelStorageFile/' + entity.id + "/" + entity.name, null, modalInstance, $scope.refreshPage);
//		}, function () {
//		});
//	}
//	var org = {id:$stateParams.id,name:$stateParams.name};
//	$scope.releaseProfile = function() {
//    	OrgService.releaseProfile(org, $scope.refreshPage);
//    }
//});

/** 虚拟桌面 */
routeApp.controller('OrgVirDeskCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService) {
	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'20%'},
	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'30%'},
		          { field: 'assignMode', displayName:$translate.instant('virdesk.assignMode'),width:'15%'},
		          { field: 'maxVmNum', displayName:$translate.instant('virdesk.maxVmNum'),width:'15%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgNetProfile(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div></div>'
	              }]	
	var url = 'virDesk/list';
	var params = {orgId:$stateParams.id};
	$scope = GridService.grid($scope, url, params, null, null);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.listStyle = $scope.gridStyle(15);
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
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	};  
	$scope.delOrgNetProfile = function(entity) {
		var modalInstance = UtilService.confirm($translate.instant('virdesk.delVirDeskAlter',{value:entity.name}),$translate.instant('common.opertip'));
		modalInstance.result.then(function (selectedItem) {
			HttpService.delete('virDesk/orgDelStorageFile/' + entity.id + "/" + entity.name, null, modalInstance, $scope.refreshPage);
		}, function () {
		});
	}
});


/** 用户 */
routeApp.controller('OrgUserCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService) {
	$scope.isUser = true;
	$scope.isBackup = false;
	$scope.selectTab = function(type) {
		$scope.isUser = type == "user";
		$scope.isBackup = type == "backup";
	};
	
	var column = [{ field: 'loginName', displayName: $translate.instant('common.loginName'), sortable: true, width:'15%', cellTemplate:titleTemplate},
	              { field: 'userName', displayName: $translate.instant('licenseMng.userName'), sortable: true, width:'15%', cellTemplate:titleTemplate},
		          { field: 'groupName', displayName:$translate.instant('common.userGroup'),width:'15%', cellTemplate:titleTemplate},
		          { field: 'authType', displayName:$translate.instant('operator.authMode'),width:'15%', cellFilter: 'authType'},
		          { field: 'email', displayName:"Email",width:'15%', cellTemplate:titleTemplate},
		          { field: 'phone', displayName:$translate.instant('workflow.phone'),width:'10%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div has-permission="USER_DELETE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="deleteUser(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'<div has-permission="USER_MODIFY" type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyUser(row.entity)" custom-title="'+$translate.instant('user.modifyUser')+'"></div>'
	            	  +'<div has-permission="USER_VIEW" type="button" class="btn btn-sm-icon icon-preview-gray" ng-click="viewUser(row.entity)" custom-title="'+$translate.instant('user.viewUser')+'"></div>'
	            	  +'</div></div>'
	              }];
	//动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	var url = 'user/list';
	var params = {orgId:$stateParams.id};
	$scope = GridService.grid($scope, url, params, null, null,"userListDiv");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.listStyle = $scope.gridStyle(15);
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: true,
			showFilter: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: true,
			showFooter: true,
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions : {
      			filterText: "",
      			useExternalFilter: true
            },
			pagingOptions: $scope.pagingOptions,
			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
	        	var st = rowItem.entity;
	        	selectedRow.splice(0, selectedRow.length, rowItem.entity);
	        	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {
	        		rowItem.entity.orgId = $stateParams.id;
	        		var pa = {orgId:$stateParams.id,userId:rowItem.entity.id,flag:1};
	        		$scope.$broadcast('transfer.user', pa);  
	        	}
	        },
			columnDefs:column
	}; 
    // 选中行的数组
    var selectedRow = new Array();
    // 默认选中第一行，如果已经有选择的元素则继续选中。
    selectFirstLine($scope, selectedRow, 'id', undefined, 'loginName');
    
	$scope.$on('ngGridEventFilter', function(event, msg) {
        // 设置时间间隔
        if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
            $timeout.cancel($scope.keyInterval);
        }
        $scope.keyInterval = $timeout(function() {
        	$scope.params.loginNameORuserName = msg;
        	$scope.pagingOptions.currentPage = 1;
        	$scope.refreshPage();
        }, constant.keyInterval);
    });
	//增加用户
    $scope.addUser=function(){
        var addUserModal = $modal.open({
            templateUrl: 'html/modal/systemManage/user/addUser.html',
            controller: 'addUserCtrl',
            backdrop:'static',
            resolve:{
               	type:function(){return "orgAdd";},
               	rowObject:function(){return {orgId:$stateParams.id,orgName:$stateParams.name};}
            }
        });
        addUserModal.result.then(function () {
        }, function (reason) {
        	$scope.refreshPage();
        });
    };
  //import user
    $scope.importUser = function(rowObject){
    	var importUserModal = $modal.open({
    		templateUrl: 'html/modal/systemManage/user/importUser.html',
    		controller: 'ImportUserCtrl',
            backdrop:'static',
            width:'950px',
            resolve:{
               	type:function(){return "orgImport";},
               	rowObject:function(){return {orgId:$stateParams.id,orgName:$stateParams.name};}
            }
    	});
    	importUserModal.result.then(function () {
        }, function (reason) {
        });
    }
    //修改用户
    $scope.modifyUser=function(rowObject){
        var modifyUserModal = $modal.open({
            templateUrl: 'html/modal/systemManage/user/addUser.html',
            controller: 'addUserCtrl',
            resolve : {type : function() {return "modify"},
            		   rowObject : function() {return rowObject}},
            backdrop:'static'
        });
        modifyUserModal.result.then(function () {
        }, function (reason) {
        });
    };
    //view user
    $scope.viewUser = function(row) {
    	var waitModal = UtilService.wait();
		$http.get("user/" + row.id).success(function(result) {
			if (result.success) {
				var modalInstance = $modal.open({
		    		templateUrl: 'html/partials/systemManage/user/viewUser.html',
		    		controller: 'viewUserCtrl',
		    		backdrop:'static',
		    		resolve:{
		                data:function(){return result.data}
		    		}
    	});
		    	modalInstance.result.then(function () {
		    	}, function () {
        });
				waitModal.dismiss();
			} else {
				UtilService.handleResult(result);
				waitModal.dismiss();
    }
		}).error(function(response, code, headers, config) {
      	  waitModal.dismiss();
    	  UtilService.handleError(code);
		});
    	
    };
    
    //delete user
    $scope.deleteUser = function(selectedItem){
    	var modalInstance = UtilService.confirm($translate.instant("user.delSelectedUsers",{value:selectedItem.userName}), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		var usersToDelete = [];
    		var user = {};
    		user.id = selectedItem.id;
    		user.loginName = selectedItem.loginName;
    		user.organization = $stateParams.name;
    		usersToDelete.push(user);
    		HttpService.put("user/delUsers", usersToDelete, undefined, $scope.refreshPage);
    	}, function(){});
    }
    
    $scope.$on('refreshUserList', function(event, msg) {
		$scope.refreshPage();
	});
    
});
/** 【组织管理】/用户/用户虚拟机、云备份策略 */
routeApp.controller('OrgUserDetailCtrl',function($stateParams,$scope, $rootScope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService,DomainService) {	
	$state.go("main.org.user.userVm");
	var column = [{ field: 'title', displayName: $translate.instant('common.displayName'), sortable: true, width:'10%'},
	              { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'20%'},
		          { field: 'status', displayName:$translate.instant('common.state'),width:'10%', cellTemplate:vmstatusTemplate($translate)},
		          { field: 'cpu', displayName:"CPUs",width:'10%'},
		          { field: 'mem', displayName:$translate.instant('common.memory'),width:'10%', cellFilter:'byteUnitRender'},
		          { field: 'system', displayName:$translate.instant('common.os'),width:'20%'},
		          { field: 'expireDate', displayName:$translate.instant('common.expireDate'),width:'10%', cellTemplate:titleTemplate},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
	            	  '<div><div has-permission="VIRT_HOST_DISTRIBUTE" class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delVm(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div></div>'
	              }]	
	var url = 'org/orgUserVm';
	var params = {orgId:$stateParams.id};
	$scope = GridService.grid2($scope, url, params, null, null);
	$scope.listStyle = $scope.gridStyle(15);
	$scope.gridOptions2 = {
			data: 'myData2',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: false,
			showFilter: false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: true,
			showFooter: true,
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems2',
			filterOptions: $scope.filterOptions2,
			pagingOptions: $scope.pagingOptions2,
			columnDefs:column
	}; 
	$scope.delVm = function (entry) {
		if (entry.cloudType == constant.PUBLIC_CLOUD_CVM) {
			DomainService.deleteVm(entry);
		} else if ((entry.cloudType == constant.PUBLIC_CLOUD_VMWARE)) {
			DomainService.deleteVmwareVm([entry], entry.status, entry.vCenterId, $scope.showTaskList);
		} else if ((entry.cloudType == constant.PUBLIC_CLOUD_OS)) {
			var cloudOSDomainItem = {}
			cloudOSDomainItem.cloudId = entry.cloudId;
			cloudOSDomainItem.cloudType = entry.cloudType;
			cloudOSDomainItem.uuid = entry.uniqueKey;
			cloudOSDomainItem.title = entry.title;
			cloudOSDomainItem.operateType = 'delete';
			DomainService.operateCloudOSVm('delete', cloudOSDomainItem);
		}
		
	}
	 $scope.$on('transfer.user', function(event, data) {  
        if ($scope.params == null) {
        	$scope.params = {};
        }
        $scope.params2.conditions = {orgId:data.orgId,userId:data.userId, userGrpId:data.userGrpId,flag:data.flag};
        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);
        
        if ($scope.params2 == null) {
        	$scope.params2 = {};
        }
        $scope.params3.conditions = {orgId:data.orgId,userId:data.userId,flag:data.flag};
        $scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage);
     });
	 
	 $scope.$on(constant.onReloadVmList, function() {
			$scope.refreshPage2(); 
	 });
	 
	 var column2 = [{ field: 'name', displayName: $translate.instant('common.displayName'), sortable: true, width:'10%'},
		              { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'20%'},
			          { field: 'timePeriod', displayName:$translate.instant('workflow.timePeriod'),width:'15%'},
			          { field: 'keepTimes', displayName:$translate.instant('workflow.keepNumber'),width:'10%'},
			          { field: 'vmName', displayName:$translate.instant('workflow.domain'),width:'20%'},
			          { field: 'status', displayName:$translate.instant('common.state'),width:'10%',cellFilter:'active'},
		              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
		            	  '<div><div class="ngCellButton">'
		            	  +'<div has-permission="VIRT_HOST_DISTRIBUTE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delBackupStrategy(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
		            	  +'</div></div>'
		              }]	
		var url3 = 'cloudBackup/list';
		var params3 = {orgId:$stateParams.id};
		$scope = grid3($scope, url3, params3, null, null);
		$scope.gridOptions3 = {
				data: 'myData3',
				jqueryUITheme: false,
				jqueryUIDraggable: false,
				selectedItems: $scope.mySelections2,
				showSelectionCheckbox: false,
				multiSelect: false,
				showGroupPanel: false,
				showColumnMenu: false,
				showFilter: false,
				enableCellSelection: false,
				enableCellEditOnFocus: false,
				enablePaging: true,
				showFooter: true,
				i18n: $translate.instant('lang'),
				totalServerItems: 'totalServerItems3',
				filterOptions: $scope.filterOptions3,
				pagingOptions: $scope.pagingOptions3,
				columnDefs:column2
		};
		
		$scope.delBackupStrategy = function (entry) {
			var modalInstance = UtilService.confirm($translate.instant("cloudBackup.deleteBackupStrategyInfo",{name:entry.name}),$translate.instant("cloudBackup.deleteBackupStrategy"));
			modalInstance.result.then(function(){
				var uri = "cloudBackup/" + entry.id + "/" + entry.name;
				HttpService.delete(uri, undefined, undefined, $scope.refreshPage);
	    	}, function(){});
		}
		
		 function grid3($scope, url, params, pagesizeArr,pagesize, divId) {
			$scope.pageing3 = true;
			$scope.myData3 = [];
			$scope.mySelections3 = [];
			$scope.filterOptions3 = {
					filterText: "",
					useExternalFilter: false
			};
			$scope.totalServerItems3 = 0;
			if (url) {
				$scope.url3 = url;
			}
			if (angular.isObject(params)) {
				 $scope.params3 = params;
			}
			if ((pagesizeArr instanceof Array) && typeof pagesize == 'number') {
				$scope.pagingOptions3 = {
						pageSizes: pagesizeArr, //page Sizes
						pageSize: pagesize, //Size of Paging data
						currentPage: 1 //what page they are currently on
				};
			} else {
				$scope.pagingOptions3 = {
						pageSizes: [10, 20, 30, 40 ,50, 100, 200], //page Sizes
						pageSize: 30, //Size of Paging data
						currentPage: 1 //what page they are currently on
				};
			}
			$scope.setPagingData3 = function(result){	
	//	        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
				if ($scope.gridOptions3 && angular.isArray($scope.gridOptions3.selectedItems)) {
		    		$scope.gridOptions3.selectedItems.splice(0, $scope.gridOptions3.selectedItems.length);//移除被选项
		    	}
				$scope.myData3 = result.data;
				$scope.totalServerItems3 = result.totalLength;
				if (!$rootScope.$$phase && !$scope.$$phase) {
					$scope.$apply();
				}
			};
			$scope.getPagedDataAsync3 = function (pageSize, page,searchText) {
				$scope.pageing3 = true;
				if ($scope.params3) {
					$scope.params3.limit= pageSize;
					$scope.params3.offset = (page - 1) * pageSize;
				} else {
					$scope.params3 = {"limit":pageSize,"offset" : page-1};
				}
				$scope.getData3($scope.params3, searchText);
			};
			$scope.getDataAsync3 = function (searchText) {
				$scope.pageing3 = false;
		    	if (!$scope.params3) {
	        		$scope.params3 = {};
	        	} 
				$scope.getData3($scope.params3, searchText);
			}
			$scope.getData3 = function (params3,searchText) {
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
							url: $scope.url3,
							params: $scope.params3
						}).success(function (result) {	
//							waitModal.dismiss();
							if (angular.isDefined(areaDivId)) {
			            		UtilService.dismissAreawait(areaDivId);
					        } 
							var resultData = result.data;
							data = resultData.filter(function(item) {
								return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
							});
							$scope.setPagingData3(result);
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
							url: $scope.url3,
							params: $scope.params3
						}).success(function (result) {
//							waitModal.dismiss();
							if (angular.isDefined(areaDivId)) {
								UtilService.dismissAreawait(areaDivId);
				            } 
							if (result.success == true) {
								$scope.setPagingData3(result);
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
			$scope.$watch('pagingOptions3', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					//修改页面大小时，将当前页重置为1。"是否删除云备份策略"+entry.name
					if (newVal.pageSize !== oldVal.pageSize) {
						$scope.pagingOptions3.currentPage = 1;
					}
					$scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.filterOptions3.filterText);
				}
			}, true);
			$scope.$watch('filterOptions3', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.filterOptions3.filterText);
				}
			}, true);
			
			//刷新表格当前页数据
			$scope.refreshPage3 = function() {
				if ($scope.pageing3 == true) {
					$scope.getPagedDataAsync3($scope.pagingOptions3.pageSize, $scope.pagingOptions3.currentPage, $scope.filterOptions3.filterText);
				} else {
					$scope.getDataAsync3();
				}
			};
			return $scope;
		}
});

/** 用户分组 */
routeApp.controller('OrgUserGroupCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService) {	
	var expandColumTitleTemplate = "<span custom-title='{{row.branch[expandingProperty.field]}}' set-td-width='58%' class='gird-ellipsis' style='display:inline-block;vertical-align:middle;'>{{row.branch[expandingProperty.field]}}</span>";
	$scope.column = [{ field: 'description', displayName: $translate.instant('common.desc'), width:'20%',cellTemplate:titleTemplate2,cellTemplateScope:$scope},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), width:'22%',cellTemplate:
	            	'<div style="margin-top:-5px;">'
	            	+'<div has-permission="USER_GROUP_ADD" type="button" class="btn btn-sm-icon icon-add-gray" ng-click="cellTemplateScope.operate(row.branch,\'addChildGrp\')" custom-title="'+$translate.instant('operator.addSubGrp')+'"></div>'
	            	+'<div has-permission="USER_GROUP_MODIFY" type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="cellTemplateScope.operate(row.branch,\'modify\')" custom-title="'+$translate.instant('operator.modifyGrp')+'"></div>'
	            	+'<div has-permission="USER_GROUP_DELETE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="cellTemplateScope.del(row.branch)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	+'<div has-permission="USER_GROUP_VIEW" type="button" class="btn btn-sm-icon icon-preview-gray" ng-click="cellTemplateScope.viewUserGroup(row.branch)" custom-title="'+$translate.instant('operator.viewGrp')+'"></div>'
	            	+'</div>',cellTemplateScope:$scope
	              }]	
	var url = 'user/userGroupList';
	var params = {orgId:$stateParams.id};
	$scope.expandColum = {field: 'name', displayName: $translate.instant('operator.groupName'), width:'58%',cellTemplate:expandColumTitleTemplate};
	$scope.treeData = [];
//	$scope.expanding_property = "name";
//	$scope.col_defs = column; 
	$scope.getTree = function (data, primaryIdName, parentIdName){
		if(!data || data.length==0 || !primaryIdName ||!parentIdName)
			return [];
		var tree = [], groups = data;
		for (var i = 0; i < groups.length; i++) {
    		groups[i].children = [];
    	}
        for (var i = 0; i < groups.length; i++) {
        	if (angular.isNumber(groups[i].parentId)){
        		var parentId = groups[i].parentId;
        		for (var j = 0; j < groups.length; j++) {
        			if (groups[j].id == parentId) {
        				groups[j].children.push(groups[i]);
        				groups[i].parentGrp = groups[j].name;
        				break;
        			}
        		}
        	} 
            
        }
        for (var i = 0; i < groups.length; i++){
        	groups[i].hasChildren = groups[i].children.length != 0 ? true : false;
        	if (groups[i].parentId == null || angular.isUndefined(groups[i].parentId)) {
        		tree.push(groups[i]);
        	}
        }
		return tree;
	} 
	$scope.queryData = function() {
		var areawaitModal=UtilService.areawait("orgUserGrpListDivId");
		$http({ 
			method: 'GET', 
			url: url,
			params: params
		}).success(function(result) {
			if (result.data != null) {
				if (result.data != null) {				
					$scope.treeData = $scope.getTree(result.data, "id", "parentId"); 
					if ($scope.treeData.length > 0) {	
						$scope.treeData[0].selected = true;
						$scope.onSelect($scope.treeData[0]);
					}
				}
			}
			UtilService.dismissAreawait(areawaitModal);
			UtilService.handleResult(result);
		}).error(function(response, code, headers, config) {
			UtilService.dismissAreawait(areawaitModal);
			UtilService.handleError(code);
		});
	}
	$scope.onSelect = function(branch) {
		var param = {orgId:$stateParams.id,userGrpId:branch.id,flag:2};
		$scope.$broadcast('transfer.user', param);  
	}
	$scope.queryData();
	//增加用户分组
    $scope.addUserGroup=function(){
        var addUserGrpModal = $modal.open({
            templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
            controller: 'addUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	type:function(){return "orgAddGrp";},
            	rowObj:function(){return {orgId:$stateParams.id,orgName:$stateParams.name};}
            }
        });
        addUserGrpModal.result.then(function () {
        	$scope.queryData();
        }, function (reason) {
        });
    };
    
  //增加子分组/修改/查看
    $scope.operate=function(rowObj,type){
    	if (type == 'modify' && rowObj.id == 1){
    		UtilService.error($translate.instant("user.modifyDefAlert"), $translate.instant("common.opertip"));
    		return;
    	}
    	rowObj.orgName = $stateParams.name;
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
            controller: 'addUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	type:function(){return type;},
            	rowObj:function(){return rowObj;}
            }
        });
        modalInstance.result.then(function () {
        	$scope.queryData();
        }, function (reason) {
        });
    };
    
    $scope.viewUserGroup=function(rowObj){
    	rowObj.orgName = $stateParams.name;
        var modalInstance = $modal.open({
            templateUrl: 'html/partials/systemManage/userGroup/viewUserGroup.html',
            controller: 'viewUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	rowObj:function(){return rowObj;}
            }
        });
        modalInstance.result.then(function () {
        	$scope.queryData();
        }, function (reason) {
        });
    };
    
    //删除
    $scope.del=function(rowObj){
    	if (rowObj.id == 1){
    		UtilService.error($translate.instant("user.delDefAlert"), $translate.instant("common.opertip"));
    		return;
    	}
    	if (rowObj.hasChildren){
    		UtilService.error($translate.instant("user.hasChildAlert"), $translate.instant("common.opertip"));
    		return;
    	}
    	var modalInstance = UtilService.confirm($translate.instant('user.confirmDelGrp'),$translate.instant('operConfirm'));
        modalInstance.result.then(function (selectedItem) {
            var model = {};
            model.id = rowObj.id;
            model.name = rowObj.name;
            model.orgId = rowObj.orgId;
            model.parentId = rowObj.parentId;
            HttpService.put("user/delUserGroup", model, undefined, $scope.queryData);
        }, function () {
        });
    };
    $scope.refresh=function(){
    	$scope.queryData();
    }
    
    $scope.$on('refreshUserGrpList', function(event, msg) {
    	if ($stateParams.id == msg.orgId) {
    		$scope.refresh();
    	}
	});
    
});

/** 用户虚拟机 */
routeApp.controller('OrgUserVmCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService, DomainService) {	
	var column = [{ field: 'title', displayName: $translate.instant('common.displayName'), sortable: true, width:'10%'},
	              { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'25%'},
		          { field: 'status', displayName:$translate.instant('common.state'),width:'10%', cellTemplate:vmstatusTemplate($translate)},
		          { field: 'cpu', displayName:"CPU",width:'10%'},
		          { field: 'mem', displayName:$translate.instant('common.memory'),width:'10%', cellFilter:'byteUnitRender'},
		          { field: 'system', displayName:$translate.instant('common.os'),width:'20%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div has-permission="VIRT_HOST_DISTRIBUTE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delVm(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div></div>'
	              }];
	//动态调整表格大小
	$scope.delVm = function (entry) {
		if (entry.cloudType == constant.PUBLIC_CLOUD_CVM) {
			DomainService.deleteVm(entry);
		} else if ((entry.cloudType == constant.PUBLIC_CLOUD_VMWARE)) {
			DomainService.deleteVmwareVm([entry], entry.status, entry.vCenterId, $scope.showTaskList);
		} else if ((entry.cloudType == constant.PUBLIC_CLOUD_OS)) {
			var cloudOSDomainItem = {}
			cloudOSDomainItem.cloudId = entry.cloudId;
			cloudOSDomainItem.cloudType = entry.cloudType;
			cloudOSDomainItem.uuid = entry.uniqueKey;
			cloudOSDomainItem.title = entry.title;
			cloudOSDomainItem.operateType = 'delete';
			DomainService.operateCloudOSVm('delete', cloudOSDomainItem);
		}
	}
	
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	var url = 'org/orgUserVm';
	var params = {orgId:$stateParams.id};
	$scope = GridService.grid($scope, url, params, null, null);
	$scope.listStyle = $scope.gridStyle(15);
	$scope.userVmOptions = {
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
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	}; 
	 $scope.$on('transfer.user', function(event, data) {  
        if ($scope.params == null) {
        	$scope.params = {};
        }
        $scope.params.conditions = {orgId:data.orgId,userId:data.userId, userGrpId:data.userGrpId,flag:data.flag};
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
     });
	 $scope.$on(constant.onReloadVmList, function() {
		$scope.refreshPage(); 
	 });
});

/** 管理员 */
routeApp.controller('OrgManagerCtrl',function($stateParams,$scope, $http, $state,$timeout,$modal, $translate, UtilService,GridService,HttpService,OrgService) {	
	var flagTmp = '<div class="ngCellText" ng-class="col.colIndex()">' +
		'<span ng-if= \'row.entity.type == "oper"\' >' + $translate.instant("operator.operator") + '</span>' +
		'<span ng-if= \'row.entity.type == "group"\'>' + $translate.instant("operator.opertorGrp") + '</span></div>' ;
	var column = [{ field: 'name', displayName: $translate.instant('common.loginNameOrGroupName'), sortable: true, width:'25%'},
	              { field: 'desc', displayName: $translate.instant('common.nameOrDesc'), sortable: true, width:'35%'},
		          { field: 'type', displayName:$translate.instant('common.type'),width:'20%', cellTemplate:flagTmp},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div ng-if= "row.entity.type == \'oper\'" has-permission="OPERATOR_DELETE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delManager(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'<div ng-if= "row.entity.type == \'group\'" has-permission="OPERATOR_GROUP_DELETE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delManager(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div></div>'
	              }];
	//动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	var url = 'org/orgMangers';
	var params = {orgId:$stateParams.id};
	$scope = GridService.grid($scope, url, params, null, null,"orgManagerListDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.listStyle = $scope.gridStyle(15);
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
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	}; 
	var org ={id:$stateParams.id,name:$stateParams.name};
	var addSelMangerCallBack = function(mangers) {
		if (mangers instanceof Array) {
			addParams(mangers,1);
		}
	}
	var addSelMangerGpCallBack = function(mangerGps) {
		if (mangerGps instanceof Array) {
			addParams(mangerGps,2);
		} else {
			var pam = [mangerGps];
			addParams(pam,2);
		}
	}
	function addParams(mangers, type) {
		var ms = [];
		for (var i=0;i<mangers.length;i++) {
			var ma = {
					id:mangers[i].id,
					orgId:$stateParams.id,
					type:type
			}
			ms[i] = ma;
		}
		var waitModal = UtilService.wait();
		$http.post("org/addOrgManager", ms).success(function(result) {
      		waitModal.dismiss();
      		UtilService.handleResult(result);
      		$scope.refreshPage();
        }).error(function(response, code, headers, config) {
      		waitModal.dismiss();
      		UtilService.handleError(code);
        });
	}
	$scope.selManger = function() {
		var param ={};
		OrgService.selManger(param, addSelMangerCallBack);
	}
	$scope.selMangerGp = function() {
		OrgService.selMangerGp(org, addSelMangerGpCallBack);
	}
	$scope.delManager = function(entity) {
		var title = $translate.instant('org.delOperPower');
		if (entity.flag == 2) {
			title = $translate.instant('org.delGroupPower');
		}
		var modalInstance = UtilService.confirm(title,$translate.instant('common.opertip'));
		modalInstance.result.then(function (selectedItem) {
			var param = {
					id:entity.id,
					orgId:entity.orgId,
					type:entity.flag
			};
			HttpService.delete('org/orgDelOperator/', param, modalInstance, $scope.refreshPage);
		}, function () {
		});
	}
});

//组织逻辑修改,准备删除
//routeApp.controller('OrgReleaseTemplateCtrl',function(org, $scope, $http,$modalInstance, $translate, UtilService,GridService,HttpService) {
//	        $scope.helpFlag = 'releaseTemplate'; 	  	  	 
// 	        $scope.title = $translate.instant("org.seletTempate"); 	  	  	 
//	        $scope.mySelections=[]; 	  	  	 
//	        $scope.isSelector = true 	  	  	 
// 	        	  	  	 
//	    //表头 	  	  	 
// 	    var column = [{field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'15%',cellTemplate:titleTemplate}, 	  	  	 
// 	                  {field: 'desc', displayName: $translate.instant('common.desc') , sortable: true, width:'25%',cellTemplate:titleTemplate}, 	  	  	 
// 	                  {field: 'cpu', displayName: $translate.instant('template.vcpuNum') , sortable: true, width:'10%'}, 	  	  	 
// 	                  {field: 'memory', displayName: $translate.instant('template.memory') , sortable: true, width:'10%' ,cellFilter:'memory'}, 	  	  	 
//	                  {field: 'storage', displayName: $translate.instant('template.storage'),cellFilter:'storage' , sortable: true, width:'20%'}, 	  	  	 
// 	                  {field: 'createDate', displayName: $translate.instant('template.createTime') , sortable: true, width:'20%',cellTemplate:titleTemplate}]; 	  	  	 
// 	    //vm数据 	  	  	 
// 	        var url = "org/tempNoOrg"; 	  	  	 
//	        if (org.cloudType == constant.PUBLIC_CLOUD_VMWARE) { 	  	  	 
//	                url = "org/tempNoOrg/vmware"; 	  	  	 
//	        } 	  	  	 
// 	        var params = {orgId:org.id, cloudId:org.cloudId}; 	  	  	 
//	        $scope = GridService.grid($scope, url, params); 	  	  	 
//	        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage); 	  	  	 
//	    //创建表格 	  	  	 
//	    $scope.gridOptions = { 	  	  	 
//	            data: 'myData', 	  	  	 
//	            jqueryUITheme: false, 	  	  	 
//	            jqueryUIDraggable: false, 	  	  	 
//	            selectedItems: $scope.mySelections, 	  	  	 
//	            showSelectionCheckbox: true, 	  	  	 
// 	            multiSelect: true, 	  	  	 
//	            showGroupPanel: false, 	  	  	 
//	            showColumnMenu: false, 	  	  	 
//	            showFilter: false, 	  	  	 
//	            enableCellSelection: false, 	  	  	 
// 	            enableCellEditOnFocus: false, 	  	  	 
//	            enablePaging: false, 	  	  	 
//	            showFooter: false, 	  	  	 
//	            i18n: $translate.instant('lang'), 	  	  	 
//	            totalServerItems: 'totalServerItems', 	  	  	 
//	            filterOptions: $scope.filterOptions, 	  	  	 
//	                        pagingOptions: $scope.pagingOptions, 	  	  	 
//	            columnDefs:column 	  	  	 
// 	    };  	  	  	 
// 	    $scope.ok=function(){$modalInstance.close($scope.mySelections);}; 	  	  	 
// 	    $scope.cancel=function(){$modalInstance.dismiss("cancel");}; 	  	  	 
// });

//组织逻辑修改,准备删除
//routeApp.controller('OrgReleaseVswitchCtrl',function(org,$scope, $http,$modalInstance, $translate, UtilService,GridService,HttpService) {	
//	$scope.helpFlag = 'releaseVswitch';
//	$scope.title = $translate.instant("common.selectVswitch");
//	$scope.mySelections=[];
//	$scope.isSelector = true
//    //表头
//    var column = [{field: 'clusterName', displayName: $translate.instant('cluster.cluster') , sortable: true, width:'40%'},
//                  {field: 'vswitch', displayName: $translate.instant('org.vswitchName') , sortable: true, width:'30%'},
//                  {field: 'model', displayName: $translate.instant('org.switchMode'),cellFilter: 'vsmode', sortable: true, width:'30%'}];
//    //vm数据
//	var url = "org/vswitchNoOrg/" + org.id;
//	$scope = GridService.grid($scope, url);
//	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//    //创建表格
//    $scope.gridOptions = {
//            data: 'myData',
//            jqueryUITheme: false,
//            jqueryUIDraggable: false,
//            selectedItems: $scope.mySelections,
//            showSelectionCheckbox: true,
//            multiSelect: true,
//            showGroupPanel: false,
//            showColumnMenu: false,
//            showFilter: false,
//            enableCellSelection: false,
//            enableCellEditOnFocus: false,
//            enablePaging: false,
//            showFooter: false,
//            i18n: $translate.instant('lang'),
//            totalServerItems: 'totalServerItems',
//            filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//            columnDefs:column
//    };  
//    $scope.ok=function(){$modalInstance.close($scope.mySelections);};
//    $scope.cancel=function(){$modalInstance.dismiss("cancel");};
//});

//组织逻辑修改,准备删除
//routeApp.controller('OrgReleaseStorageCtrl',function(org,$scope, $http,$modalInstance, $translate, UtilService,GridService,HttpService) {	
//	$scope.helpFlag = 'releaseStorage';
//	$scope.title = $translate.instant("vm.storagepoolModal.selectStoragepool");
//	$scope.mySelections=[];
//	$scope.isSelector = true
//    //表头
//    var column = [{ field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true, width:'20%'},
//                  { field: 'storagePoolTitle', displayName: $translate.instant('org.storagePoolTitle') , sortable: true, width:'20%'},
//		          { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'20%'},
//		          { field: 'path', displayName:$translate.instant('host.path'),width:'20%'},
//		          { field: 'storage', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'}];
//    if (org.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//    	column = [{ field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true, width:'20%'},
//                  {field: 'storagePool', displayName: $translate.instant('org.storageName') , sortable: true, width:'20%'},
//		          { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'20%'},
//		          { field: 'path', displayName:$translate.instant('host.path'),width:'20%'},
//		          { field: 'storage', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'}];
//    }
//    //vm数据
//	var url = "org/storageNoOrg/" + org.id;
//	if (org.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//		url = "org/storageNoOrg/vmware";
//	}
//	var params = {orgId:org.id, cloudId:org.cloudId};
//	$scope = GridService.grid($scope, url, params);
//	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//    //创建表格
//    $scope.gridOptions = {
//            data: 'myData',
//            jqueryUITheme: false,
//            jqueryUIDraggable: false,
//            selectedItems: $scope.mySelections,
//            showSelectionCheckbox: true,
//            multiSelect: true,
//            showGroupPanel: false,
//            showColumnMenu: false,
//            showFilter: false,
//            enableCellSelection: false,
//            enableCellEditOnFocus: false,
//            enablePaging: false,
//            showFooter: false,
//            i18n: $translate.instant('lang'),
//            totalServerItems: 'totalServerItems',
//            filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//            columnDefs:column
//    };  
//    $scope.ok=function(){$modalInstance.close($scope.mySelections);};
//    $scope.cancel=function(){$modalInstance.dismiss("cancel");};
//});

//组织逻辑修改,准备删除
//routeApp.controller('OrgReleaseProfileCtrl',function(org,$scope, $http,$modalInstance, $translate, UtilService,GridService,HttpService) {	
//	$scope.title = $translate.instant("common.selectProfile");
//	$scope.mySelections=[];
//	$scope.isSelector = true
//    //表头
//	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'10%'},
//	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'10%'},
//		          { field: 'vlanType', displayName:$translate.instant('common.type'),width:'10%'},
//		          { field: 'vlan', displayName:"VLAN/VXLAN",width:'10%'},
//		          { field: 'aclName', displayName:$translate.instant('netstrategy.acl'),width:'10%'},
//		          { field: 'inAvgBandwidth', displayName:$translate.instant('org.inAvgBandwidth'), width:'10%'},
//		          { field: 'inBurstSize', displayName:$translate.instant('org.inBurstSize'), width:'10%'},
//		          { field: 'outAvgBandwidth', displayName:$translate.instant('org.outAvgBandwidth'), width:'10%'},
//		          { field: 'outBurstSize', displayName:$translate.instant('org.outBurstSize'), width:'10%'},
//	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
//	            	  '<div><div class="ngCellButton">'
//	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrgNetProfile(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//	            	  +'</div></div>'
//	              }]
//	//vm数据
//	var url = "network/queryProfiles/";
//	var params = {orgId:org.id};
//	$scope = GridService.grid($scope, url, params);
//	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//    //创建表格
//    $scope.gridOptions = {
//            data: 'myData',
//            jqueryUITheme: false,
//            jqueryUIDraggable: false,
//            selectedItems: $scope.mySelections,
//            showSelectionCheckbox: true,
//            multiSelect: true,
//            showGroupPanel: false,
//            showColumnMenu: false,
//            showFilter: false,
//            enableCellSelection: false,
//            enableCellEditOnFocus: false,
//            enablePaging: false,
//            showFooter: false,
//            i18n: $translate.instant('lang'),
//            totalServerItems: 'totalServerItems',
//            filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//            columnDefs:column
//    };  
//    $scope.ok=function(){$modalInstance.close($scope.mySelections);};
//    $scope.cancel=function(){$modalInstance.dismiss("cancel");};
//});

//组织逻辑修改,准备删除
/** 增加计算资源 */
//routeApp.controller('OrgAddResCtrl',function(org,$scope, $rootScope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService, OrgService){
//	$scope.model = org;
//	$scope.mySelections = [];
//	$scope.switchSelections = [];
//	$scope.storageSelections = [];
//	$scope.isVswitch = true;
//	$scope.isStorage = false;
//	$scope.stepTitles = [ $translate.instant('org.selCluster'),
//	                      $translate.instant('org.configNetSource'),
//	                      $translate.instant('org.configStoreSource')];
//	$scope.valids = {
//	        stepOneOver : function() {
//	            if ($scope.mySelections.length > 0)
//	                return true;
//	            return false;
//	        },
//	        stepTwoOver : function() {return true;},
//	        stepThreeOver : function() {return true;}
//	}
//	//表头
//	var column = [{ field: 'hostPoolName', displayName: $translate.instant('hostpool.hostpool'), sortable: true, width:'30%'},
//	              { field: 'clusterName', displayName: $translate.instant('cluster.cluster'), sortable: true, width:'30%'},
//	              { field: 'vmNum', displayName: $translate.instant('org.vmNum'), sortable: true, width:'20%'},
//		          { field: 'runVmNum', displayName:$translate.instant('common.runVmNum'),width:'20%'}]
//	//vm数据
//	var url = "org/res/" + org.id;
//	if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//		url = "org/res/vmware/" + org.id;
//	}
//	$scope = GridService.grid($scope, url);
//	$scope.getDataAsync();
//    //创建表格
//    $scope.gridOptions = {
//            data: 'myData',
//            jqueryUITheme: false,
//            jqueryUIDraggable: false,
//            selectedItems: $scope.mySelections,
//            showSelectionCheckbox: false,
//            multiSelect: false,
//            showGroupPanel: false,
//            showColumnMenu: false,
//            showFilter: false,
//            enableCellSelection: false,
//            enableCellEditOnFocus: false,
//            enablePaging: false,
//            showFooter: false,
////		    groups:['hostPoolName'],
//		    groupsCollapsedByDefault:false,
//            i18n: $translate.instant('lang'),
//            totalServerItems: 'totalServerItems',
//            filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
//	        	var entity = rowItem.entity;
//	        	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {
//	        		$scope.queryVswitchs(entity);
//	        		$scope.queryStorages(entity);
//	        		$scope.clusterName = entity.clusterName;
//	        		$scope.netResource = "";
//	        		$scope.storageResource = "";
//	        	}
//	        },
//            columnDefs:column
//    };  
//    $scope.listStyle = $scope.gridStyle(-15);
//    ////// 网络资源
//    var vsColumn = [{field: 'vswitch', displayName: $translate.instant('org.vswitchName') , sortable: true, width:'60%'},
//    				{field: 'model', displayName: $translate.instant('org.switchMode'),cellFilter: 'vsmode', sortable: true, width:'40%'}]
//    $scope.vswitchOptions = {
//            data: 'vswitchData',
//            jqueryUITheme: false,
//            jqueryUIDraggable: false,
//            selectedItems: $scope.switchSelections,
//            showSelectionCheckbox: true,
//            multiSelect: true,
//            showGroupPanel: false,
//            showColumnMenu: false,
//            showFilter: false,
//            enableCellSelection: false,
//            enableCellEditOnFocus: false,
//            enablePaging: false,
//            showFooter: false,
//            i18n: $translate.instant('lang'),
//            totalServerItems: 'totalServerItems',
//            filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
//				var vsStr = "";
//				if ($scope.switchSelections.length > 0) {
//					for (var i = 0; i < $scope.switchSelections.length; i++) {
//						vsStr += $scope.switchSelections[i].vswitch + ",";
//					}
//				}
//				$scope.netResource = vsStr.substring(0, vsStr.length - 1); 
//	        },
//            columnDefs:vsColumn
//    }; 
//    $scope.queryVswitchs = function(entity) {
//	    var url = "org/resVswitch/" + org.id + "/" + entity.clusterId;
//	    if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//			url = "org/resVswitch/vmware/" + org.id +  "/" + entity.hostPoolId;
//		}
//	    $scope.switchSelections.splice(0, $scope.switchSelections.length);
//	    $http({
//	    	method:"GET",
//	    	url: url
//	    }).success(function(result){
//	    	if (result) {	
//	    		$scope.vswitchData = result.data;
//	    	}
//	    });
//	};
//    ////// 存储资源
//	 //表头
//    var stColumn = [{ field: 'storagePoolTitle', displayName: $translate.instant('org.storagePoolTitle'), cellTemplate:titleTemplate, sortable: true, width:'30%'},
//			        { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'30%'},
//			        { field: 'path', displayName:$translate.instant('host.path'),width:'20%'},
//		          { field: 'storage', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'}];
//    if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//    	stColumn = [
//                  { field: 'storagePool', displayName: $translate.instant('org.storageName'), cellTemplate:titleTemplate, sortable: true, width:'30%'},
//		          { field: 'type', displayName:$translate.instant('org.storageType'),cellFilter: 'storageType',width:'30%'},
//		          { field: 'path', displayName:$translate.instant('host.path'),width:'20%'},
//		          { field: 'storage', displayName:$translate.instant('cluster.availableStorage'), cellFilter:'storage', width:'20%'}];
//    }
//    $scope.storageOptions = {
//            data: 'storageData',
//            jqueryUITheme: false,
//            jqueryUIDraggable: true,
//            selectedItems: $scope.storageSelections,
//            showSelectionCheckbox: true,
//            multiSelect: true,
//            showGroupPanel: false,
//            showColumnMenu: false,
//            showFilter: false,
//            enableCellSelection: false,
//            enableCellEditOnFocus: false,
//            enablePaging: false,
//            showFooter: false,
//            i18n: $translate.instant('lang'),
//            totalServerItems: 'totalServerItems',
//            filterOptions: $scope.filterOptions,
//			pagingOptions: $scope.pagingOptions,
//			afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
//				var vsStr = "";
//				if ($scope.storageSelections.length > 0) {
//					for (var i = 0; i < $scope.storageSelections.length; i++) {
//						vsStr += $scope.storageSelections[i].storagePool + ",";
//					}
//				}
//				$scope.storageResource = vsStr.substring(0, vsStr.length - 1); 
//	        },
//            columnDefs:stColumn
//    }; 
//    $scope.queryStorages = function(entity) {
//	    var url = "org/resStorage/" + org.id + "/" + entity.clusterId;
//	    if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//			url = "org/resStorage/vmware/" + org.id + "/" + entity.clusterId;
//		}
//	    $scope.storageSelections.splice(0, $scope.storageSelections.length);
//	    $http({
//	    	method:"GET",
//	    	url: url
//	    }).success(function(result){
//	    	if (result) {	
//	    		$scope.storageData = result.data;
//	    	}
//	    });
//	};
//	
//	$scope.ok = function () {
//		var url = "org/addOrgRes";
//		var cluster = {};
//		var vswitchs = [];
//		var storages = [];
//		if ($scope.mySelections.length > 0) {
//			cluster = $scope.mySelections[0];
//		}
//		if ($scope.switchSelections.length > 0) {
//			for (var i=0;i<$scope.switchSelections.length;i++) {
//				var vs = {name:$scope.switchSelections[i].vswitch};
//				if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//					vs = {name:$scope.switchSelections[i].vswitchKey};
//				}
//				vswitchs[i] = vs;
//			}
//		}
//		if ($scope.storageSelections.length > 0) {
//			for (var i=0;i<$scope.storageSelections.length;i++) {
//				var st = {
//					name:$scope.storageSelections[i].storagePool,
//					title:$scope.storageSelections[i].storagePoolTitle,
//					path:$scope.storageSelections[i].path,
//					type:$scope.storageSelections[i].type,
//					capacity:$scope.storageSelections[i].storage
//				}
//				if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
//					st = {
//							name:$scope.storageSelections[i].storagePoolKey,
//							path:$scope.storageSelections[i].path,
//							type:$scope.storageSelections[i].type,
//							capacity:$scope.storageSelections[i].storage
//						}
//				}
//				storages[i] = st;
//			}
//		}
//		var data = {
//				id:org.id,
//				clusters:[{id:cluster.clusterId}],
//				vswitchs:vswitchs,
//				storages:storages
//			};
//		
//		var addCallBack = function() {
//			$rootScope.$broadcast('onRefreshRes', data);
//		}
//		HttpService.post(url, data, $modalInstance, addCallBack);
////		$modalInstance.dismiss('cancel');
//	};
//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };
//    //回车
//	$scope.enter = function(ev) { 
//		if (ev.keyCode == 13 && !$scope.form.$invalid) {
//			$scope.ok();
//		}
//	};
//});

/**
 * 发布虚拟机模板，网络策略模板，选择组织通用对话框控制器
 */
routeApp.controller('SelOrgCtrl',function($scope, $rootScope, $http, $translate, $modalInstance, url, title, id, cloudId,entryType, UtilService, GridService, OrgService, HttpService) {
    $scope.mySelections = new Array();
    $scope.multiSelect = true;
    $scope.pageTitle = title;
    $scope.entryType = entryType;
    $scope.openHelp = function() { 
        if ($scope.entryType && $scope.entryType == "cvmTemplate") {
            $rootScope.openHelp("cloudResource/vmTemp/distributeVMTemp");
        } else if ($scope.entryType && $scope.entryType == "vmwareTemplate") {
            $rootScope.openHelp("cloudResource/vCenter/vmTemp/distributevCenterVmTemp");
        }
    }
    var param = {};
    param.cloudId = cloudId;
    param.id = id;
    $scope = GridService.noMaskGrid($scope, url, param);
    $scope.gridOptions = OrgService.orgList();
    $scope.gridOptions.columnDefs = [{ field: 'name', displayName:$translate.instant('common.name'), sortable: false, width:'25%', cellTemplate: titleTemplate},
	            { field: 'templateNum', displayName:$translate.instant('common.templateNum'), sortable: false, width:'20%'},
	            { field: 'vmNum', displayName:$translate.instant('common.vmNum'), sortable: false, width:'20%'},
	            { field: 'userNum', displayName:$translate.instant('common.userNum'), sortable: false, width:'20%'},
	            { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'15%', cellTemplate:
	            	'<div><div class="ngCellButton">'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyOrg(row.entity)" custom-title="{{\'common.modify\'|translate}}"></div>'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrg(row.entity)" custom-title="{{\'common.delete\'|translate}}"></div>'
	   	 			+'</div></div>'}];
    $scope.gridOptions.enablePaging = false;
    $scope.gridOptions.showFooter = false;
    $scope.gridOptions.showSelectionCheckbox = true;
    $scope.gridOptions.multiSelect = true;
    $scope.gridOptions.selectedItems = $scope.mySelections;
    $scope.listStyle = $scope.gridStyle(-15);
	$scope.getDataAsync();
	
	//注册刷新组织事件
    $scope.$on(constant.onRefreshOrgList, function(event, msg) {
        $scope.refreshPage();
    });
    
    $scope.modifyOrg = function (org) {
        OrgService.modifOrg(org);
    };
    $scope.addOrg = function () {
        OrgService.addOrg();
    };
    $scope.delOrg = function (org) {
        var modalInstance = UtilService.confirm($translate.instant('org.delAlt',{value:org.name}),$translate.instant('org.del'));
        modalInstance.result.then(function (selectedItem) {
            HttpService.delete('org/del/' + org.id + "/" + org.name, null, modalInstance, $scope.refreshPage);
        }, function () {
        });
    };
    
    $scope.jump = function(entity) {
        if (angular.isFunction($scope.ok)) {
            $scope.ok.apply();
        }
    }  
    $scope.ok=function(){
        if ($scope.mySelections.length == 0) {
        	UtilService.alert($translate.instant('cloudResource.selectOrgTempPrompt'), $translate.instant('common.opertip'), false, 'error');
			return;
        }
        $modalInstance.close($scope.mySelections); 
    };  
    $scope.cancel=function(){
        $modalInstance.dismiss("cancel");
    };
});
routeApp.controller('OrgResourcePoolCtrl',function($scope, $state, $modal, $http, $timeout, $translate, UtilService, HttpService, EchartService, OrgService, PermissionService, $translate) {	
    var defaultLimit = 6;//默认一次显示的资源池个数
    var index = 0;
    var emptyCheck = true;
    //根据条件查询云资源 currentIndex:第几页的数据
    $scope.queryRp = function(limit, currentIndex) {
        index = currentIndex;
        var params = {
                limit:limit,
                offset:currentIndex * limit,
                orgId: $scope.id
        };
        $http({
            method  : 'GET',
            url     : "org/queyResourcePoolList",
            params: params}).
        success(function(result) {
            if (result.state == 0) {
            	if (currentIndex > 0 && result.data.length == 0) {
            		currentIndex = index - 1;
            		$scope.queryRp(defaultLimit, currentIndex);
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
                        $scope.selectedRp = result.data[0];
                        $scope.showPerformance(result.data[0].id, result.data[0].cloudType);
                        
                        var add = {};//加入增加按钮
                        add.type = "add";
                        $scope.slideArray[currentIndex].value[result.data.length] = add;
                    } else {
                    	$scope.slideArray = new Array(1);
                        $scope.slideArray[0] = new Object();
                        var add = {};//加入增加按钮
                        add.type = "add";
                        var arr = new Array();
                        arr.push(add);
                        $scope.slideArray[0].value = arr;
                    }
                });                            
            } else {
            	$scope.slideArray = new Array(1);
                $scope.slideArray[0] = new Object();
                var add = {};//加入增加按钮
                add.type = "add";
                var arr = new Array();
                arr.push(add);
                $scope.slideArray[0].value = arr;
            }
        }).error(function(data, code, headers, cfg) {
            UtilService.handleError(code);
        });
    };
    $scope.hasModifyPermission = PermissionService.hasPermission('ORGANIZATION_MODIFY');

    $scope.isSelected = function(id) {
        if ($scope.selectedRp.id == id) {
            return true;
        }
        return false;
    }
    var index = 0;
    var count = 0;
    var check = false;
    $scope.queryRp(defaultLimit, 0);
    
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
        $scope.queryRp(defaultLimit, currentIndex);
    });

    $scope.computes = {
			options:[{value:'0',label:$translate.instant('common.cpu')}
				,{value:'1',label:$translate.instant('common.memory')}
			]
		};
    $scope.selectedRp = {}
    $scope.selectedRp.id = 0;
    $scope.selectModel = {};
    $scope.model = {};
    $scope.$watch('selectModel.model', function(newValue, oldValue) {
        if (angular.isUndefined(newValue) || newValue == oldValue) {
            return;
        }
        var selected = angular.fromJson(newValue);//将字符串转成json对象
        if(angular.isString(selected.type)) {
        	return;
        }
        $scope.selectedRp = selected;
        $scope.showPerformance($scope.selectedRp.id, $scope.selectedRp.cloudType);
    });
	
	
	//计算资源利用率
    var computeResourceChart = undefined;
    var orgTopVmMem = undefined;
    var orgTopVmStorage = undefined;
    var storageMonitorInfo = undefined;
    var noDataText = $translate.instant('common.noData');
	var noDataText = $translate.instant('common.noData');
	var core = $translate.instant('addDomain.core');
	$scope.rpErrorMsg = "";
	$scope.showPerformance = function (id,type) {
		//销毁echarts实例
		$scope.summary = {};
	    EchartService.dispose(computeResourceChart, orgTopVmMem, orgTopVmStorage, storageMonitorInfo);
		computeResourceChart = echarts.init(document.getElementById("orgResourcePoolMonitorInfo"));
		orgTopVmMem = echarts.init(document.getElementById("orgTopVmMem")); 
		orgTopVmStorage = echarts.init(document.getElementById("orgTopVmStorage")); 
		storageMonitorInfo = echarts.init(document.getElementById("storageMonitorInfo"));
		var flag = false;
		$scope.cloudType = type
	    $scope.summary = {};
	    var url = "resourcePool/"+id+"/summary";
	    //查询概要信息
        $http({
            method: 'GET',
            url: url,
            params: {}
        }).success(function (result) {
            if (result.state == 0) {
                $timeout(function() {
                    $scope.summary = result.data;
                    if (result.data.cpu != null) {
                    	$scope.summary.cpu = result.data.cpu + core;
                    }
                });
            } else if (result.state == 1) {
            	//资源池异常，图标置灰
            	$("#img"+id)[0].src = "css/img/gray/resourcePool_gray.svg";
//            	$rootScope.orgRpErrorId = id;
//            	$scope.rpErrorMsg = result.failureMessage;
            }
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
        //计算资源监控信息
        EchartService.getMonitorChart("resourcePool/"+id+"/computeRate", computeResourceChart, '120%');
        //存储资源监控信息
        EchartService.pieChart("resourcePool/"+id+"/storageRate", storageMonitorInfo)
	    //计算资源top5分配虚拟机
	    getTop5CpuOrMemory(id);
	    //组织内top5存储分配虚拟机
	    EchartService.drawColumnTrend('orgTopVmStorage',"resourcePool/"+$scope.id+"/vmTopStorageInfo/"+id, orgTopVmStorage, noDataText, false, "", "", toolFormatGB);
	};
    
	var getTop5CpuOrMemory = function (id) {
		if (angular.isUndefined($scope.topType) || $scope.topType == "cpu") {
			//计算资源top5 cpu分配虚拟机
			$scope.selectName = $translate.instant("org.Top5CPUVm");
		    EchartService.drawCpuOrMemColumnTrend('orgTopVmMem',"org/"+id+"/queryCpuOrMemory/"+$scope.id+"/cpu", orgTopVmMem, noDataText, true, toolFormat);
		} else if ($scope.topType == "mem") {
			//计算资源top5 memory分配虚拟机
			$scope.selectName = $translate.instant("org.Top5MemVm");
			EchartService.drawCpuOrMemColumnTrend('orgTopVmMem',"org/"+ id+"/queryCpuOrMemory/"+$scope.id+"/memory", orgTopVmMem, noDataText, false, toolFormatMB);
		}
	}
	
	
	var toolFormatMB = function (param) {
		var name = param.name;
		var str = name + ' : ' +param.value + ' MB';
		return str;
	}
	
	var toolFormatGB = function (param) {
		var name = param.name;
		var str = name + ' : ' +param.value + ' GB';
		return str;
	}
	
	var toolFormat = function (param) {
		var name = param.name;
		var str = name + ' : ' +param.value + core;
		return str;
	}
	
    //浏览器窗口resize的时候执行的函数
    $scope.resizeFun = function() {
        computeResourceChart.resize();
        orgTopVmMem.resize();
    	orgTopVmStorage.resize();
    	storageMonitorInfo.resize();
    };
    //监听大小改变事件，同步刷新图表
    $scope.$on(constant.onNavClick, function(event, msg) {
        $scope.resizeFun();
    });
    //监听浏览器大小变化
    $(window).on('resize', $scope.resizeFun);
    
	$scope.releaseResourcePool = function(){
		OrgService.releaseResourcePool($scope.id, queryResourcePool);
	};
	
	var queryResourcePool = function () {
		$scope.queryRp(defaultLimit, index);
	}
	
	$scope.$on("refreshOrgRp",function(event,msg){
		queryResourcePool();
	});
	
	$scope.delRp = function(resourcePool) {
		var modalInstance = UtilService.confirm($translate.instant("resourcePool.delOrgResourcePoolConfirm",{name:resourcePool.name}),$translate.instant('common.opertip'));
		modalInstance.result.then(function (selectedItem) {
			var waitModal = UtilService.wait();
        	$http({
                method:'GET',
                url:'org/checkDelOrgRp',
                params:{ orgId:$scope.id,resourcePoolId:resourcePool.id}
            }).success(function(result) {
                waitModal.dismiss();
                if (result.success == true) {
                	if (result.successMessage == null) {
                		deleteOrgRp(resourcePool);
                	} else {
	                	//确认删除用户云主机或云硬盘
	            		var modalInstance = UtilService.confirm(result.successMessage, $translate.instant('common.opertip'));
	            		modalInstance.result.then(function (selectedItem) {
	                    	deleteOrgRp(resourcePool);
	            		}, function () {
	            		});
	            	} 
                } else {
                	UtilService.handleResult(result);
                }
            }).error(function(response, code, headers, config) {
                waitModal.dismiss();
                UtilService.handleError(code);
            });
		}, function () {
		});
	}
	var deleteOrgRp = function(resourcePool) {
		var waitModal = UtilService.wait();
		$http({
			method  : 'DELETE',
			url     : "org/delOrgRp",
			params: {orgId:$scope.id, rpId:resourcePool.id, rpName:resourcePool.name}
		}).success(function(result) {
			waitModal.dismiss();
			if (result.state == 0) {
				$scope.queryRp(defaultLimit, index);
			}
			UtilService.handleResult(result);
		}).error(function(response, code, headers, config) {
			waitModal.dismiss();
			UtilService.handleError(code);
		})
	};	
	$scope.model.compute = "0";
	$scope.$watch("model.compute",function(newValue,oldValue) {
		 if (newValue == '0'){
			$scope.topType = "cpu";
         } else if (newValue == '1' ){
			$scope.topType = "mem";
         }
		 getTop5CpuOrMemory($scope.selectedRp.id);
    });

	//图标轮循
	$http({
        method: "GET",
        url: "systemConfig/sysConfig?type=sys_conf"
      }).success(function(result){
        var data = result.data;
        var cycle = 30000;
        if(data["monitor.refresh.cycle"]) {
            cycle = data["monitor.refresh.cycle"];
        }
        $scope.intervalTime = setInterval(function(){
        	if ($scope.selectedRp.id == null || $scope.selectedRp.cloudType == null) {
        		return;
        	}
        	$scope.showPerformance($scope.selectedRp.id, $scope.selectedRp.cloudType);
        }, cycle);
     });
    $scope.$on("$destroy", function() {
        if (angular.isDefined($scope.intervalTime)) {
        	clearInterval($scope.intervalTime);
        }
        $(window).off('resize', $scope.resizeFun);
        EchartService.dispose(computeResourceChart, orgTopVmMem, orgTopVmStorage, storageMonitorInfo);
        var computeResourceChart = undefined;
        var orgTopVmMem = undefined;
        var orgTopVmStorage = undefined;
        var storageMonitorInfo = undefined;
    });
    
    //跳转到对应资源池
    $scope.jumpToResourcePool = function(line) {
    	var rp = {};
    	rp.id = line.id;
    	rp.name = line.name;
    	rp.cloudId = line.cloudId;
    	rp.cloudType = line.cloudType;
//    	$state.go("main.resourcePool.summary", rp);
    	selectTreeNode($scope, 'main.resourcePool', 'resource_pool', 'nav', line.id, constant.onResourcePoolMngNodeSelected);
    	$state.go("main.resourcePool.summary", rp);
    }
});
/** 发布资源池 */
routeApp.controller('OrgReleaseResourcePoolCtrl',function($scope, $rootScope, $state, $http,$filter,$compile, $location,$modal,$modalInstance,
		$timeout, $translate, UtilService, HttpService,GridService, OrgService,EchartService,ResourcePoolService, $interval, orgId){
	$scope.resourcePools = [];
	$scope.selectedPool = {}
	$scope.limit = 5;
	// build resourcePool list
	var buildResourcePoolList = function(result) {
		var items = "";
		var resourcePoolItem = '<ul id="resourcePoolCarousel" class="elastislide-list"> </ul>';
		$('.resourcePoolPanel:last').html(resourcePoolItem);
		for ( var i = 0; i < result.length; i++) {
			var pool = result[i];
			items += '<li><a>';
			items += '<span id="' + pool.name + '" cascheckbox class="cas-checkbox labeled-btn radio" style=" float:left;width:calc(100% - 10px)" ' + 
				'ng-model="selectModel.name" value="' + pool.name + '">';
			items += '<input name="selectedPool' + $scope.$id + '" type="radio"  ng-checked="isSelected(resourcePools['+ i + '])">';
			items += '<span class="box poolBox" style="text-align: left; height:100px;margin-left:0px;">';
			items += '<span><span><img id="orgImg'+pool.id+'" style="margin-top:10px;margin-left:8px;display:inline;" class="pic2img" src="css/img/green/resourcePool_green.svg" custom-title="' 
				  + $translate.instant("common.active") + '"></span>';
			items += '<span style="width:162px;padding-top:10px;float:right;"><span style="padding-top:10px;text-align: left;font-weight:bold;" shortcut custom-title ' 
				  + 'cut-str="' + pool.name +'" short-width="160"></span><br/>'
				  + '<span style="height:5px;display:block;"></span><span><span translate="cloudResource.cloudResource" style="margin-top:10px;text-align: left" class="span_padding"></span><span shortcut custom-title cut-str='
				  + '" ' + pool.cloudName + '" short-width="110"></span></span><br/><span style="height:5px;display:block;"></span><span><span translate="cloudResource.cloudResourceType" style="margin-top:10px;text-align: left" class="span_padding"></span><span shortcut custom-title cut-str='
				  + '" ' + $filter('cloudType')(pool.cloudType) + '" short-width="110"></span></span></span>';
			items += '<span style="padding-left:130px;padding-top:4px;float:right;padding-right:3px;"> <span  type="button" style="margin-left:-3px;" class="btn btn-sm-icon icon-refresh-gray" ng-click="refreshResourcePool(resourcePools['+ i + '])" custom-title="' 
			      + $translate.instant('resourcePool.refreshResourcePool') + '"></span>';									
			items += '<span ng-if="isSelected(resourcePools['+ i + '])" class="selectedPool" style="position:absolute; top:calc(50% - 10px); left:100%; width: 0px; height: 0px;border-top: 10px solid rgba(0,0,0,0); border-bottom: 10px solid rgba(0,0,0,0)"></span>';
			items += '</span></span></a></li>';
		}
		$('.elastislide-list:last').html($compile(items)($scope));
		$timeout(function() {
			$(".elastislide-list:last").elastislide({
			orientation: 'vertical',
			minItems : 4
			});
		});

	};
	
	var isRpNotExist = false;
	$scope.queryResourcePool = function() {
		var url = "resourcePool/queryList";
		var params = {};
		params.orgId = orgId;
		params.conditions = "addOrgQueryRp";
		$http({
			method  : 'GET',
			url     : url,
			params  : params
		}).success(function(result) {
			if (result.state == 0 && result.data != null && result.data.length > 0) {
				if (isEmpty($scope.selectedPool.name) || isRpNotExist) {					
					$scope.selectedPool = result.data[0];
					$scope.selectedPool.orgId = orgId;
					$scope.id = result.data[0].id;
    				$scope.cloudType = result.data[0].cloudType;
    				isRpExist = false;
				}
				$scope.refreshResourcePool();				
				$scope.resourcePools = result.data;
			} else {
				$scope.resourcePools = [];
				EchartService.dispose(computeResourceChart);
				$scope.summary = new Array();
				
			}
			buildResourcePoolList($scope.resourcePools);
		});
	}
	$scope.queryResourcePool();
    $scope.$on(constant.onRefreshOrgResourcePoolList, function(msg) {
    	$scope.queryResourcePool();
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
        if ($scope.resourcePools != null) {
        	for(var i=0; i<$scope.resourcePools.length; i++){
    			if (newValue == $scope.resourcePools[i].name) {
    				$scope.selectedPool = $scope.resourcePools[i];
    				$scope.id = $scope.resourcePools[i].id;
    				$scope.cloudType = $scope.resourcePools[i].cloudType;
    				$scope.selectedPool.orgId = orgId;
    				break;
    			}
        	}
        }
        $scope.refreshResourcePool();
    });	
    $scope.summary = {};
    var core = $translate.instant('addDomain.core');
    //查询概要信息
    $scope.querySummary = function() {
    	$scope.resourcePoolIsNormal = undefined;
    	var waitModal = UtilService.wait();
        var summaryUrl = "resourcePool/" + $scope.id + "/summary";
        $http({
            method: 'GET',
            url: summaryUrl,
            params: {}
        }).success(function (result) {
            if (result.state == 0) {
                $timeout(function() {
                    $scope.summary = result.data;
                    if ($scope.summary.totalStorageCapacity > 0){                    	
                    	$scope.summary.storageRate = (($scope.summary.totalStorageCapacity-$scope.summary.avalibaleStorageCapacity)/$scope.summary.totalStorageCapacity*100).toFixed(2);
                    } else {
                    	$scope.summary.storageRate = '0.00%';
                    }
                    if (result.data.cpu != null) {
                    	$scope.summary.cpu = result.data.cpu + core;
                    } else {
                        $scope.summary.cpu = '0' + core;
                    }
                    $scope.resourcePoolIsNormal = true;
                });
            } else {
                $scope.summary = result.data;
                $scope.summary.storageRate = '0.00%';
                $scope.summary.cpu = '0' + core;
                $scope.resourcePoolIsNormal = false;
                $("#orgImg"+$scope.selectedPool.id)[0].src = "css/img/gray/resourcePool_gray.svg";
            }
    		waitModal.dismiss();
        }).error(function(response, code, headers, config) {
        	waitModal.dismiss();
            UtilService.handleError(code);
        });
    }
    //计算资源利用率
    var noDataText = $translate.instant('common.noData');
    var computeResourceChart = " ";
    var computeRateUrl = " ";
    var queryChartsData = function() {
    	computeResourceChart = echarts.init(document.getElementById("selectResourcePoolMonitorInfo"));
        computeRateUrl = "resourcePool/" + $scope.id + "/computeRate";
        //计算资源监控仪表盘
        EchartService.getMonitorChart(computeRateUrl, computeResourceChart, '120%');
    }	
	$scope.refreshResourcePool = function() {
		EchartService.dispose(computeResourceChart);
		$scope.querySummary();
	    queryChartsData();		
	};
	$scope.$on("$destroy",
			function(event) {
			    //销毁echarts实例
			    EchartService.dispose(computeResourceChart);
			}
	);
	$scope.addResourcePool = function () {
	    // 增加资源池
	    ResourcePoolService.addResourcePool();
	}
	
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
		if ($scope.selectedPool.id == undefined ) {
			return;
		}
		var waitModal = UtilService.wait();
		$scope.timer = $interval(function(){
	        if ($scope.resourcePoolIsNormal != null && $scope.resourcePoolIsNormal != undefined){
	        	if ($scope.resourcePoolIsNormal) {
	        		waitModal.dismiss();
	        		$interval.cancel($scope.timer);
					$http.post("org/releaseResourcePool", $scope.selectedPool).success(function(result){
						if (result.state == 0) {
							$modalInstance.close($scope.selectedPool);
						}
						if (result.state == 1) {
							isRpNotExist = true;
							$scope.queryResourcePool();
						}
						UtilService.handleResult(result);
					}).error(function(response, code, headers, config) {
						waitModal.dismiss();
						UtilService.handleError(code);
					});
				} else {
					waitModal.dismiss();
					$interval.cancel($scope.timer);
					UtilService.alert($translate.instant("resourcePool.resourcePoolException"),$translate.instant('common.errorTip'),false,"error");
				}
	        }
	    }, 500);  
	};
	 $scope.cancel = function () {
		 $modalInstance.dismiss('cancel');
	 };
});