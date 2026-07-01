//=============================================================================================
//虚拟桌面池列表
//=============================================================================================
routeApp.controller('DesktopListCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService, GridService, DesktopService){
	// 虚拟桌面池列表；
	var url = "desktop";
	var maskDiv = 'desktopListDivId';
	
	//动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	$scope = GridService.grid($scope, url, null, null, null, maskDiv);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = DesktopService.desktopList();
	$scope.gridOptions.filterOptions=$scope.filterOptions;
	$scope.gridOptions.pagingOptions=$scope.pagingOptions;
	// 跳转函数
	$scope.jump = function(entity) {
		// 广播导航节点选中事件
		selectTreeNode($scope, 'main.desktop', 'desktop', 'list', entity.id);
    };
    // 删除
    $scope.delDesktop = function(rowObj){
    	DesktopService.delDesktop(rowObj);
    };
    // 增加
	$scope.addDesktop = function() {
		DesktopService.addDesktop();
	}
	// 修改
	$scope.modifyDesktop = function(rowObj) {
		DesktopService.modifyDesktop(rowObj);
	}
	
	//回收策略
	$scope.retrieve = function(rowObj) {
		DesktopService.retrieve(rowObj);
	}
	
	$scope.$on('onRefreshDesktop', function(event, msg) {
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    });
	//刷新
    $scope.refreshDesktopList=function(){
    	$scope.refreshPage();
    };
    
    //修改问题单:201706080624  遮罩层还在时切换页面,要等数据加载完才关闭.
    $scope.$on("$destroy", function() {
        UtilService.dismissAreawait(maskDiv + "areawait");
    });
});

routeApp.controller('addDesktopCtrl',function(params, $rootScope, $scope, $state, $http, $modalInstance, $location,$modal, $timeout, $translate, UtilService,HttpService, 
		GridService, DesktopService, PermissionService){
	$scope.model = {};
	$scope.data = {};
	$scope.groupSelections = [];
	$scope.stepTitles = [$translate.instant('virdesk.baseInfo'), $translate.instant('virdesk.configInfo'), $translate.instant('virdesk.mappingConfig')];
	$scope.levels = {
			assignModeOptions:[{value: 1, label:$translate.instant("virdesk.fixedDesktopPool")},
			                   {value: 2, label:$translate.instant("virdesk.floatingDesktopPool")}],
			sessionColorDeptOptions:[{value: 32, label:$translate.instant("virdesk.highestQuality")},
                              {value: 24, label:$translate.instant("virdesk.trueColor")},
                              {value: 16, label:$translate.instant("virdesk.enhancedColor")}
                              ]
	};
	
	// 设置基础信息初始值
	$scope.model.maxVmNum = 200;
	$scope.model.assignMode = 1;
	$scope.model.colorDepth = 32;
	$scope.editable = true;
	if (params != null && typeof(params.id) != 'undefined') {
		$http.get("desktop/editable?desktopPoolId=" + params.id).success(function(result){
			if (angular.isUndefined(result.data) || result.data == null){
				$scope.editable = true;
			} else if (Number(result.data) > 0){
				$scope.editable = false;
			} else {
				$scope.editable = true;
			}
		});
		// 修改虚拟桌面池
		$http.get("desktop/getDesktopInfo?id=" + params.id).success(function(result){
			UtilService.handleResult(result);
			// 基础信息
			var data = result.data;
			$scope.model.id = data.id;
			$scope.model.name = data.name;
			$scope.model.description = data.desc;
			$scope.model.maxVmNum = data.maxVmNum;
			$scope.min = data.num;
			$scope.model.assignMode = data.assignModel;
			if ($scope.model.assignMode == 1) {
				$scope.assignMode = $translate.instant("virdesk.fixedDesktopPool");
			} else {
				$scope.assignMode = $translate.instant("virdesk.floatingDesktopPool");
			}
		    // 所属组织
			$scope.model.orgId = data.orgId;
			$scope.orgName = data.orgName;
			$scope.templateName = data.templateName;
			$scope.model.domainId = data.domainId;
			$scope.model.clusterId = data.clusterId;
			$scope.clusterName = data.clusterName;
			$scope.model.resourcePoolId = data.resourcePoolId;
			$scope.flag = data.cloudType;
			$scope.resourcePoolName = data.resourcePoolName;
			//storagePoolName cas为名称，vmware为key
			$scope.model.storagePoolName = data.storage;
			//storageTitle  cas为显示名称，vmware为名称
			$scope.model.storageTitle = data.storageTitle;
			$scope.model.storagePath = data.path;
			$scope.model.storageType = data.type;	
			$scope.cloudType = data.flag;
			$scope.model.system = data.system;
			checkBatchDeploy();
			if (data.assignModel == 2) {
				//浮动桌面池显示用户分组
				var sels = data.userGrpList;
				for (var j=0;j<sels.length;j++) {					
					var sl = sels[j];
					$scope.groupSelections.push({
						name:sl.name,
						id:sl.id
					});
				}
				$scope.changeMangerStr();
			}
			
			// 外设
			$scope.model.colorDepth = data.colorDepth;
			
			if (data.clipBoard != null && data.clipBoard == 1) {
				$scope.model.redirectClipboard = true;	
			} else {
				$scope.model.redirectClipboard = false;	
			}
			
			if (data.localDisk != null && data.localDisk == 1) {
				$scope.model.redirectDrives = true;	
			} else {
				$scope.model.redirectDrives = false;	
			}
			
			if (data.printer != null && data.printer == 1) {
				$scope.model.redirectPrinters = true;	
			} else {
				$scope.model.redirectPrinters = false;	
			}
			
			if (data.usb != null && data.usb == 1) {
				$scope.model.redirectUsb = true;	
			} else {
				$scope.model.redirectUsb = false;	
			}
			
			if (data.serialPort != null && data.serialPort == 1) {
				$scope.model.redirectComports = true;	
			} else {
				$scope.model.redirectComports = false;	
			}
			
			if (data.localAudio != null && data.localAudio == 1) {
				$scope.model.audioMode = true;	
			} else {
				$scope.model.audioMode = false;	
			}
		});
		$scope.title=$translate.instant("virdesk.modify");
		$scope.isAdd=false;
	}else {
		//增加虚拟桌面池时，默认为Windows系统；修改时，根据查询结果设置systemType
		$scope.model.system = 0;//虚拟机模板的系统类型：0-Windows，1-Linux
		$scope.title=$translate.instant("virdesk.add");
		$scope.isAdd=true;
		$scope.min = 1;
		// 分配方式改变调整配置信息显示
		$scope.$watch('model.assignMode', function(newValue, oldValue){
			if (newValue == 1) {
				$scope.assignMode = $translate.instant("virdesk.fixedDesktopPool");
				$scope.groupNames = undefined;
				$scope.groupSelections = [];
			} else {
				$scope.assignMode = $translate.instant("virdesk.floatingDesktopPool");
				checkBatchDeploy();
				$scope.model.orgId = undefined;
				$scope.orgName = undefined;
				$scope.templateName = undefined;
				$scope.model.domainId = undefined;
				$scope.model.storagePoolName = undefined;
				$scope.model.storageTitle = undefined;
				$scope.model.storagePath = undefined;
				$scope.model.storageType = undefined;
				$scope.model.resourcePoolId = undefined;
				$scope.resourcePoolName = undefined;
				$scope.groupNames = undefined;
				$scope.groupSelections = [];
			}
		});
	}
	
	var checkBatchDeploy = function () {
		$scope.BatchDeploy = true;
		$scope.data.deploy = false;
		if (PermissionService.hasPermission('ORGANIZATION_VM_BATCH_DEPLOY')) {
			$scope.BatchDeploy = false;
			$scope.data.deploy = true;
		}
	}
	
    $scope.$watch('model.assignMode', function(newValue, oldValue) {
        if (angular.isUndefined(newValue) || newValue == oldValue) {
            return;
        }
        checkBatchDeploy();
    });
	
	// form之间的切换控制
	$scope.valids = {
		stepOneOver : function() {
			if ($('#form1').val() === "true") {
				return true;
			}
			return false;
		},
		stepTwoOver : function() {
			if ($('#form2').val() === "true")
				return true;
		},
		stepThreeOver : function() {
			if ($('#form2').val() === "true") {
				return true;
			}
			return false;
		}
	};		
	//选择组织
	$scope.selectOrg = function() {
		var params = null;
		if ($scope.model.assignMode == 2) {
			params = {type : constant.PUBLIC_CLOUD_CVM};
		}
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			width:'712px',
			controller:"selectSingleOrganizeCtrl",
			resolve: {
				params: function () {
                    return params;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				if ($scope.model.orgId != selectedItem[0].id) {
					$scope.model.orgId = selectedItem[0].id;
					$scope.orgName = selectedItem[0].name;
					$scope.templateName = undefined;
					$scope.model.domainId = undefined;
					$scope.model.storagePoolName = undefined;
					$scope.model.storageTitle = undefined;
					$scope.model.storagePath = undefined;
					$scope.model.storageType = undefined;
					$scope.model.resourcePoolId = undefined;
					$scope.resourcePoolName = undefined;
					$scope.groupNames = undefined;
					$scope.groupSelections = [];
				}
			}
			
		},function(reason){
		});
	};
	
	//选择虚拟机模板
	$scope.selectTemplate = function () {
		if ($scope.model.resourcePoolId == null) {
			UtilService.alert($translate.instant('workflow.selectResourcePoolAlert'), $translate.instant('common.opertip'));
			return;
		}		
		var param = {orgId:$scope.model.orgId,
				resourcePoolId: $scope.model.resourcePoolId,
				};
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"SelectSingleTemplateCtrl",
			width:"800px",
			resolve: {
				params: function () {
                    return param;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				$scope.templateName = selectedItem[0].domainName;
				$scope.model.domainId = selectedItem[0].id;
				$scope.model.system = selectedItem[0].system;
			}
		},function(reason){
		});
	};
	//选择资源池
	$scope.selectResourcePool = function() {
		if ($scope.model.orgId == null) {
			UtilService.alert($translate.instant('workflow.selectOrgAlert'), $translate.instant('common.opertip'));
			return;
		}
		var params = {orgId:$scope.model.orgId,selectMul:false};
		if ($scope.model.assignMode == 2) {
			params.cloudType = constant.PUBLIC_CLOUD_CVM;
		}
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"SelectOrgResourcePoolCtrl",
			width:"700px",
			resolve: {
				params: function () {
                    return params;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				if ($scope.model.resourcePoolId != selectedItem[0].id) {
					$scope.model.resourcePoolId = selectedItem[0].id;
					$scope.resourcePoolName = selectedItem[0].name;
					$scope.flag = selectedItem[0].cloudType;
					$scope.templateName = undefined;
					$scope.model.domainId = undefined;
					$scope.model.system = undefined;
					$scope.model.storagePoolName = undefined;
					$scope.model.storageTitle = undefined;
					$scope.model.storagePath = undefined;
					$scope.model.storageType = undefined;
				}
			}
		},function(reason){
		});
	};
	//选择存储
	$scope.selectStore = function() {
		if ($scope.model.resourcePoolId == null) {
			UtilService.alert($translate.instant('workflow.selectResourcePoolAlert'), $translate.instant('common.opertip'));
			return;
		}
		var params = {resourcePoolId : $scope.model.resourcePoolId};
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"SelectSingleStoreCtrl",
			resolve: {
				params: function () {
                    return params;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				$scope.model.storageTitle = selectedItem[0].title;
				$scope.model.storagePath = selectedItem[0].path;
				$scope.model.storageType = selectedItem[0].type;
				if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE) {				
					$scope.model.storagePoolKey = selectedItem[0].storagePoolKey;
					$scope.model.storagePoolName = selectedItem[0].storagePoolKey;
				} else {
					$scope.model.storagePoolName = selectedItem[0].name;
				}
			}
		},function(reason){
		});
	};
	//选择用户分组
	$scope.selectUserGroup = function() {
		if (!$scope.model.orgId) {
    		UtilService.alert($translate.instant('workflow.selectOrgAlert'), $translate.instant('common.opertip'));
            return;
    	}
		var params = {orgId : $scope.model.orgId};
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/org/selectOrgUserGroup.html',
            controller: 'SelectUserGrpCtrl',
            backdrop:'static',
            width:"700px",
            resolve : {
				params: function () {
                    return params;
                }
            },
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				var sels = selectedItem;
				$scope.groupSelections = [];
				if (!selectedItem instanceof Array) {
					sels = [selectedItem];
				}
				for (var j=0;j<sels.length;j++) {					
					var sl = sels[j];
					$scope.groupSelections.push({
						name:sl.name,
						id:sl.id
					});
				}
				$scope.changeMangerStr();
			}
		},function(reason){
		});
	};
	
	$scope.changeMangerStr = function() {
		$scope.groupNames = "";
		for (var j = 0; j < $scope.groupSelections.length; j++) {
			$scope.groupNames += $scope.groupSelections[j].name;
			if (j< $scope.groupSelections.length - 1) {
				$scope.groupNames += ",";
			}
		}
	};
	
  	$scope.callback = function(result){
  		if(result.state == '0' && $scope.model.assignMode == 2 && $scope.data.deploy){
  			//浮动桌面池选择立即部署
  			var data ={};
  			if(params != null && typeof(params.id) != 'undefined') {
  				data.id = params.id;
  			} else {
  				data.id = result.data;
  			}
  			
  			DesktopService.virDeskDeploy(data);
  		}
  		if (result.state == 0) { //执行成功 关闭对话框
  			$modalInstance.dismiss('ok');
  		}
	};
	
	// 确认
	$scope.ok = function () {
		var uri = "desktop/add";
		if (params != null && typeof(params.id) != 'undefined') {
			uri = "desktop/modify";
		}
		$scope.model.resourcePoolName = $scope.resourcePoolName;
		var data = $scope.model;
		var groups = [];
    	for (var i = 0; i < $scope.groupSelections.length; i++) {
    		var manger = $scope.groupSelections[i];
    		groups[i] = {id:manger.id, name:manger.name};
		}
    	data.desktopPoolUserGroups = groups;
    	if (params != null && typeof(params.id) != 'undefined') {
    		HttpService.put(uri, data, $modalInstance, $scope.callback);
    		$rootScope.$broadcast(constant.onRefreshDeskTopTemplate, {id:params.id});
    	} else {
    		HttpService.post(uri, data, $modalInstance, $scope.callback);
    	}
	};	
	
	// 关闭
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

});


routeApp.controller('retrieveCtrl',function(params, $scope, $state, $http, $modalInstance, $location,$modal, $timeout, $translate, UtilService,
		HttpService, GridService, DesktopService){
	$scope.model = {};
	$scope.data = {};
	$scope.levels = {
			reFrequencyOptions:[{value: 0, label:$translate.instant("virdesk.yearly")},
			               {value: 1, label:$translate.instant("virdesk.monthly")},
			               {value: 2, label:$translate.instant("virdesk.weekly")},
			               {value: 3, label:$translate.instant("virdesk.daily")}
			              ],
			actionOptions:[{value: 0, label:$translate.instant("virdesk.actionClose")},
                           {value: 1, label:$translate.instant("virdesk.actionStart")},
                           {value: 2, label:$translate.instant("virdesk.actionRetrieve")}],
			weekOptions:[{value: 0, label:$translate.instant("virdesk.monday")},
			             {value: 1, label:$translate.instant("virdesk.tuesday")},
			             {value: 2, label:$translate.instant("virdesk.wednesday")},
			             {value: 3, label:$translate.instant("virdesk.thursday")},
			             {value: 4, label:$translate.instant("virdesk.friday")},
			             {value: 5, label:$translate.instant("virdesk.saturday")},
			             {value: 6, label:$translate.instant("virdesk.sunday")}
			             ]
	};
	
	if (params != null && typeof(params.id) != 'undefined') {
		$http.get("desktop/retrieve?id=" + params.id).success(function(result){
			if (result.data) {
				var result = result.data;
				$scope.model.id = result.id;
				if (result.state == 0 ) {
					$scope.state = false;
				} else {
					$scope.state = true;
				}
				$scope.model.action = result.action;
				$scope.model.frequency = result.frequency;
				
				if (result.frequency == 0) {
					//每年
					$scope.data.startMonth = result.month;
					$scope.data.endMonth = result.monthEnd;
					$scope.data.startDate = result.day;
					$scope.data.endDate = result.dayEnd;
				} else if(result.frequency == 1) {
					// 每月
					$scope.data.startDay = result.day;
					$scope.data.endDay = result.dayEnd;
					
				} else if(result.frequency == 2) {
					// 每周
					$scope.data.startWeek = result.day;
					$scope.data.endWeek = result.dayEnd;
				}
				var retrieveTime = result.retrieveTime;
				if (retrieveTime != null && retrieveTime != '') {
					var checked = retrieveTime.split(",");
					for ( var i = 0; i < checked.length; i++){
						$("td#"+checked[i]).addClass("td-checked");
					}
				}
			} else {
				$scope.model.action = 2;
				$scope.model.frequency = 3;
			}
		});
	}
	
	$scope.$watch('model.frequency', function(newValue, oldValue){
		if (typeof(oldValue) != 'undefined' && newValue != oldValue) {
			if (newValue == 0) {
				//每年
				$scope.data.startMonth = 1
				$scope.data.startDate = 1
				$scope.data.endMonth = 12
				$scope.data.endDate = 31
				$scope.data.maxDay = 31;
				$scope.data.maxEndDay = 31;
			} else if (newValue == 1){
				//每月
				$scope.data.startDay = 1
				$scope.data.endDay = 28
			} else if (newValue == 2){
				//每周
				$scope.data.startWeek = 0
				$scope.data.endWeek = 6
			}
		}
	});
	$scope.monthList = [31,29,31,30,31,30,31,31,30,31,30,31];
	$scope.$watch('data.startMonth', function(newValue, oldValue){
		if (typeof(oldValue) != 'undefined' && newValue != oldValue) {
			$scope.data.maxDay = $scope.monthList[newValue-1];
		}
	});
	$scope.$watch('data.endMonth', function(newValue, oldValue){
		if (typeof(oldValue) != 'undefined' && newValue != oldValue) {
			$scope.data.maxEndDay = $scope.monthList[newValue-1];
		}
	});
	$timeout(function(){
//		$("td").prop("draggable", false);
		$("td").bind({"mousedown":function(){
			$(this).toggleClass("td-checked");
			$("td").bind("mouseover",function(){
				$(this).toggleClass("td-checked");
			})
		},"mouseup":function(){
			$("td").unbind("mouseover");
			var checked =[];
			$("td.td-checked").each(function(){
				checked.push($(this).attr("id"));
			});
			$scope.model.retrieveTime = checked.join();
		},"dragstart":function() {
			$("td").unbind("mouseover");
		}});
		$("tbody>tr").bind({"mouseout":function(){
	          var checked =[];
	          $("td.td-checked").each(function(){
	              checked.push($(this).attr("id"));
	          });
	          $scope.model.retrieveTime = checked.join();
	    }, "mouseleave":function(){
	    	$("td").unbind("mouseover");
	    }});
	});
	
	// 确认
	$scope.ok = function () {
		var uri = "desktop/addRetrieve";
		var data = $scope.model;
		if (0 == $scope.model.frequency) {
			//每年
            if ($scope.data.startMonth > $scope.data.endMonth) {
            	UtilService.alert($translate.instant('virdesk.checkReStrategyDate'), $translate.instant('common.opertip'));
                return;
            } else if ($scope.data.startMonth == $scope.data.endMonth) {
            	if ($scope.data.startDate > $scope.data.endDate) {
            		UtilService.alert($translate.instant('virdesk.checkReStrategyDate'), $translate.instant('common.opertip'));
            		return;
            	}
            }
			$scope.model.month = $scope.data.startMonth;
			$scope.model.monthEnd = $scope.data.endMonth;
			$scope.model.day = $scope.data.startDate;
			$scope.model.dayEnd = $scope.data.endDate;
		} else if(1 == $scope.model.frequency) {
			// 每月
			if ($scope.data.startDay > $scope.data.endDay) {
        		UtilService.alert($translate.instant('virdesk.checkReStrategyDate'), $translate.instant('common.opertip'));
        		return;
        	}
			$scope.model.day = $scope.data.startDay;
			$scope.model.dayEnd = $scope.data.endDay;
		} else if(2 == $scope.model.frequency) {
			// 每周
			if ($scope.data.startWeek > $scope.data.endWeek) {
        		UtilService.alert($translate.instant('virdesk.checkReStrategyDate'), $translate.instant('common.opertip'));
        		return;
        	}
			$scope.model.day = $scope.data.startWeek;
			$scope.model.dayEnd = $scope.data.endWeek;
		}
		
		if (params != null && typeof(params.id) != 'undefined') {
			$scope.model.desktopPoolId = params.id;
		}
		if ($scope.state) {
			$scope.model.state = 1;
		} else {
			$scope.model.state = 0;
		}
		HttpService.post(uri, data, $modalInstance);
    	$modalInstance.dismiss('ok');
	};	
	
	// 关闭
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

});

//【云服务】/虚拟桌面池
routeApp.controller('desktopOverviewCtrl',function($scope, $modal, $stateParams, $http, $timeout, $translate, UtilService,
		HttpService, DesktopService, EchartService){
	//概要,外设映射规则
	$scope.refresh = function(){
		$http({
			method: 'GET',
			url:"desktop/type",
			params:{desktopPoolId : $stateParams.id}
		}).success(function(result){
			$scope.system = result.data;
		});
		$http({
			method: 'GET',
			url:"desktop/overview",
			params:{desktopPoolId : $stateParams.id}
		}).success(function(result){
			$scope.overview = result.data;
			UtilService.handleResult(result);
		});
		$timeout(function(){
		    var noDataText = $translate.instant('common.noData');
    		if (typeof($scope.cpuTop5) == 'undefined') {
    		    $scope.cpuTop5 = echarts.init(document.getElementById("vmringChart"));
    		}
    	    if (typeof($scope.memoryTop5) == 'undefined') {
    		   $scope.memoryTop5 = echarts.init(document.getElementById("vmbarChart")); 
    	    }
    	    if (typeof($scope.vmCircle) == 'undefined') {
    		   $scope.vmCircle = echarts.init(document.getElementById("vmCircle"));
    	    }
    	    //获取虚拟机状态
    	    EchartService.getVmStatus("desktop/vmStatus?desktopPoolId=" + $stateParams.id, $scope.vmCircle);
    	    //top5虚拟机CPU
    	    EchartService.vmTop5Cpu("desktop/top5cpu?desktopPoolId=" + $stateParams.id, $scope.cpuTop5, noDataText, 'vmringChart');
    	    //top5虚拟机内存
    	    EchartService.vmTop5Mem("desktop/top5mem?desktopPoolId=" + $stateParams.id, $scope.memoryTop5, noDataText, 'vmbarChart');
        });
	}
	
    function resize(){
	    $scope.cpuTop5.resize();
	    $scope.memoryTop5.resize();
	    $scope.vmCircle.resize();
    };
    //注册事件不应该写在方法内部. 从refresh方法内取出.
    $(window).on('resize', resize);
    $scope.$on(constant.onNavClick, function(){
        resize();
    });
	$scope.refresh();
	$scope.$on(constant.onRefreshDesktopSummary, function(event, msg) {
	    if (msg.entryId == $stateParams.id) {
	        $scope.refresh();
	    }
	});
	
	$scope.modify = function(){
		var params = {id:$stateParams.id};
		// 增加虚拟桌面池
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/desktop/addDesktop.html',
			controller: 'addDesktopCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {
				params : function() {
					return params;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			$scope.refresh();
		}, function (reason) {
		});
	};
	$scope.$on("$destroy", function(){
		$(window).off("resize",resize);
		EchartService.dispose($scope.cpuTop5, $scope.memoryTop5, $scope.vmCircle);
	});
	
});

//【云服务】/虚拟桌
routeApp.controller('virtualDeskCtrl',function($scope, $modal, $stateParams, $http, $timeout, $translate, UtilService, GridService,
        HttpService, DesktopService, DomainService){
    $scope.entryId = $scope.entryId;
    $scope.cloudId = $scope.cloudId;
    $scope.cloudType = $scope.cloudType;
    
	var antivirusTemplate = '<div><div class="ngCellText"><span ng-if="row.entity[col.field] == 0" translate="common.unable"></span>' +
	    '<span ng-if="row.entity[col.field] == 1" translate="common.enable"></span>' +
	    '</div></div>';
    
    //虚拟桌面列表
    var column = [{ field: 'title', displayName: $translate.instant('common.displayName'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'6%',cellTemplate:vmstatusTemplate($translate)},
                  { field: 'cpuRate', displayName: $translate.instant('common.cpuRate'), sortable: true, width:'10%', cellTemplate:progressTemplate},
                  { field: 'memRate', displayName: $translate.instant('common.memRate'), sortable: true, width:'10%', cellTemplate:progressTemplate},
                  { field: 'cpu', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'6%'},
                  { field: 'mem', displayName: $translate.instant('vm.memory'), sortable: true, width:'7%',cellFilter:'byteUnitRender'},
                  { field: 'system', displayName: $translate.instant('common.os'), sortable: true, width:'12%',cellTemplate:titleTemplate},
                  { field: 'protectModel', displayName: $translate.instant('vm.protectModel') , sortable: true,cellTemplate :
                  	'<div class="ngCellText">' +
                  	'<span ng-if= \'row.entity.protectModel == 0\' >' + $translate.instant("common.unable") + '</span>' +
                  	'<span ng-if= \'row.entity.protectModel == 1\' >' + $translate.instant("common.enable") + '</span></div>'
                  	,width:'8%'},
                  
                  { field: 'antivirusConfig', displayName: $translate.instant('cloudService.antivirusConfig'), sortable: true, width:'8%', cellTemplate:antivirusTemplate},	
                  { field: 'expireDate', displayName: $translate.instant('common.expireDate'),cellFilter:'dayDate', sortable: true, width:'13%'},
                  ];
    
    //vmware虚拟桌面没有保护模式
    if ($scope.cloudType == 3) {
            column = [{ field: 'title', displayName: $translate.instant('common.displayName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                      { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                      { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'6%',cellTemplate:vmstatusTemplate($translate)},
                      { field: 'cpuRate', displayName: $translate.instant('common.cpuRate'), sortable: true, width:'10%', cellTemplate:progressTemplate},
                      { field: 'memRate', displayName: $translate.instant('common.memRate'), sortable: true, width:'10%', cellTemplate:progressTemplate},
                      { field: 'cpu', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'6%'},
                      { field: 'mem', displayName: $translate.instant('vm.memory'), sortable: true, width:'7%',cellFilter:'byteUnitRender'},
                      { field: 'system', displayName: $translate.instant('common.os'), sortable: true, width:'18%',cellTemplate:titleTemplate},
                      { field: 'expireDate', displayName: $translate.instant('common.expireDate'),cellFilter:'date:"yyyy-MM-dd"', sortable: true, width:'13%'},
                      ];
    }
    
    $scope.userListTitle = $translate.instant('cloudService.vmUserOrUserGrp');
    var maskDiv = 'virtualDeskDivId';
    var url = "org/vms";
    var params = {};
    params.desktopPoolId = $scope.entryId;
    $scope = GridService.grid($scope, url, params, null, null, maskDiv);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
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
          pagingOptions: $scope.pagingOptions,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          rowTemplate: doubleClickTemplate,    //双击行模板
          columnDefs:column,
          afterSelectionChange: function (rowItem, event) {   // 选中事件完成后触发
        	  angular.copy($scope.mySelections, selectedRow);
              if ($scope.mySelections.length == 1) {     // 在点击时，因为会有原来行与新选中行，这里只需要新选中行。
                  var rowObj = $scope.mySelections[0];
                  $scope.queryVmUsers(rowObj);
                  $scope.userListTitle = $translate.instant('cloudService.vmUserOrUserGrp', {title:rowObj.title});
              } else {
//            	  $scope.$watch('myData2', function(newValue, oldValue) {
//            		  if ($scope.mySelections.length != 1) {
//            			  $scope.myData2.splice(0, $scope.myData2.length);
//            		  }
//            	  });
				  $scope.myData2.splice(0, $scope.myData2.length);
                  $scope.userListTitle = $translate.instant('cloudService.vmUserOrUserGrp');
                  $scope.totalServerItems2 = 0;
             }
          }
    };
    
	// 选中行的数组
    var selectedRow = new Array();
    
    $scope.$on('ngGridEventData', function(row, event) {
        var renderedRows = row.targetScope.renderedRows.length;
        if (renderedRows > 0) {              // 有数据显示时才执行
            var ngrow0 = row.targetScope.renderedRows[0];
            var ngCol0 = row.targetScope.renderedColumns[row.targetScope.renderedColumns.length - 1];
            if (ngrow0.selected == true || ngCol0.field == 'orgName') {   // 此处会执行多次，只要第一行选中就返回，防止多次触发afterSelectionChange事件
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
    
    $scope.myData2 = [];
    $scope.status = "unknown";
    //监控选中虚拟机的状态，更新按钮栏
    $scope.$watch('mySelections', function(newValue, oldValue) {
        if (newValue && newValue.length == 1) {
            if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
                $timeout(function() {
                    $scope.status = newValue[0].status;
                });
            } else {
                var params = {};
                params.cloudId = $scope.cloudId;
                params.id = newValue[0].id;
                $http({
                    method: "GET",
                    url: "domain/basicInfo",
                    params: params
                }).success(function(result) {
                    var msg = {};
                    msg.id = newValue[0].id;
                    msg.title = result.data.title;
                    msg.status = result.data.status;
                    msg.haManage = result.data.haManage;
                    msg.haStatus = result.data.haStatus;
                    msg.haEnable = result.data.hostHaEnable;
                    msg.hostStatus = result.data.hoststatus;
                    msg.protect = result.data.protectModel;
                    $timeout(function(){
                        $scope.vm = DomainService.updateVmButton(msg);
                    });
                });
                $scope.status = newValue[0].status;
            }
        } else {
            $scope.myData2.splice(0, $scope.myData2.length);
            $scope.userListTitle = $translate.instant('cloudService.vmUserOrUserGrp');
        }
    }, true);
    
    //刷新虚拟桌面列表
    $scope.refreshVirtualDeskList = function() {
    	$scope.mySelections.splice(0, $scope.mySelections.length);
        $scope.status = "unknown";
        $scope.refreshPage();
    };
    
    //注册刷新事件
    $scope.$on(constant.onReloadVmList, function(event, msg) {
        $scope.refreshVirtualDeskList();
    });
    
    //右击选中行
    $scope.rightClick = function(row, e) {
        if (e.which == 3 && row.selected == false) {// 1:left, 2:middle, 3:right
            // unselected all rows
            $scope.gridOptions.selectAll(false);
            // select right click row
            $scope.gridOptions.selectRow(row.rowIndex, true);
        }
    };
    
    //根据虚拟桌面类型，设置菜单类型
    $scope.menuType = "fixedDeskpool";
    if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
        $scope.menuType = "vmwareDeskpool";
    } else {
        if ($scope.assignMode == 2) {
            //浮动桌面池
            $scope.menuType = "floatDeskpool";
        } else {
            $scope.menuType = "fixedDeskpool";
        }
    }
    
    //启动
    $scope.startVm = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.mySelections.length!=1||$scope.status!='shutOff') {
                return;
            }
            $scope.operateVmwareVm("start");
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableStart != true) {
                return;
            }
            DomainService.startVm($scope.mySelections[0], $scope.showTaskList);
        }
    };
    
    //暂停（CVM）
    $scope.pauseVm = function() {
        if ($scope.mySelections.length!=1||$scope.vm.enablePause!=true) {
            return;
        }        
        DomainService.pauseVm($scope.mySelections[0], $scope.showTaskList);
    }
    //恢复（CVM）
    $scope.resumeVm = function() {
        if ($scope.mySelections.length!=1||$scope.vm.enableRestore!=true) {
            return;
        }
        DomainService.resumeVm($scope.mySelections[0], $scope.showTaskList);
    }

    //休眠
    $scope.sleepVm = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.mySelections.length!=1||$scope.status!='running') {
                return;
            }
            $scope.operateVmwareVm("sleep");
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableSleep!=true) {
                return;
            }
            DomainService.sleepVm($scope.mySelections[0], $scope.showTaskList);
        }
    }
    //重启
    $scope.restartVm = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.mySelections.length!=1||$scope.status!='running') {
                return;
            }
            $scope.operateVmwareVm("restart");
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableReboot!=true) {
                return;
            }
            DomainService.restartVm($scope.mySelections[0], $scope.showTaskList);
        }
    }
    //关闭
    $scope.shutdownVm = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.mySelections.length!=1||$scope.status!='running') {
                return;
            }
            $scope.operateVmwareVm("shutdown");
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableShutdown!=true) {
                return;
            }
            DomainService.shutdownVm($scope.mySelections[0], $scope.showTaskList);
        }
    }
    //关闭电源
    $scope.closeVm = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.mySelections.length!=1||$scope.status!='running') {
                return;
            }
            $scope.operateVmwareVm("close");
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableClose!=true) {
                return;
            }
            DomainService.closeVm($scope.mySelections[0], $scope.showTaskList);
        }
    }
    //删除
    $scope.deleteVm = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.mySelections.length!=1) {
                return;
            }
            DomainService.deleteVmwareVm($scope.mySelections, $scope.status, $scope.cloudId);
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableDelete!=true) {
                return;
            }
            DomainService.deleteVm($scope.mySelections[0], $scope.showTaskList);
        }
    }
    
    //操作虚拟机(不包括删除)
    $scope.operateVmwareVm = function(type) {
        var operateInfo = {
                type:$translate.instant('menu.'+type),
                name:$scope.mySelections[0].name
        };
        var name = $scope.mySelections[0].name;
        var vmKey = $scope.mySelections[0].vmKey;
        var cloudId = $scope.cloudId;
        DomainService.operateVmwareVm(type, name, vmKey, cloudId, operateInfo);
    };
    
    //创建快照
    $scope.createSnapshot = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.status=='unknown') {
                return;
            }
            DomainService.createVmwareSnapshot($scope.cloudId, $scope.mySelections[0].vmKey, $scope.mySelections[0].name, $scope.status);
        } else {
            if ($scope.mySelections.length!=1||$scope.vm.enableSnapshot!=true) {
                return;
            }
            DomainService.snapshotVm($scope.mySelections[0]);
        }
    }
    
    //克隆为模板
    $scope.cloneTemplate = function() {
        if ($scope.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            if ($scope.status=='unknown') {
                return;
            }
            DomainService.cloneVmwareTemplate($scope.cloudId, $scope.mySelections[0].vmKey, $scope.mySelections[0].name, $scope.status);
        }
    }
    
    //分配虚拟机
    $scope.distributeVm = function() {
        if ($scope.status=='unknown') {
            return;
        }
        var vmData = {
                status:$scope.status,
                vmKey:$scope.mySelections[0].vmKey,
                id:$scope.mySelections[0].id,
                name:$scope.mySelections[0].name
        };
        DomainService.distributeVm($scope.cloudId, vmData);
    }
    
    //立即备份（CVM）
    $scope.backupVm = function() {
        if ($scope.mySelections.length!=1||$scope.vm.enableBackup!=true) {
            return;
        }
        DomainService.backupVm($scope.mySelections[0]);
    }
    
    //打开控制台(CVM)
    $scope.openConsole = function() {
        if ($scope.mySelections.length!=1||$scope.vm.enableConsole!=true) {
            return;
        }
        DomainService.openConsole($scope.mySelections[0]);
    }
    
    //浮动桌面池
    //回收虚拟机
    $scope.retrieveVm = function() {
        if ($scope.mySelections.length!=1) {
            return;
        }
        DomainService.retrieveVm($scope.mySelections[0]);
    }
    //回收策略
    $scope.retrieveStrategy = function() {
        var params = {id:$scope.entryId};
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/desktop/retrieveStrategy.html',
            controller: 'retrieveCtrl',
            backdrop:'static',
            resolve: {
                params : function() {
                    return params;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function (reason) {
            if ("success" == reason) {

            }
        });
    }
    //健康检查
    $scope.checkVirDesk = function() {
    	//查询需要检测的虚拟机
    	var params = {id : $scope.entryId,
    			cloudId : $scope.cloudId,
    			cloudType : $scope.cloudType};
    	var modalInstance = $modal.open({
    		templateUrl: 'html/modal/desktop/checkVmHealth.html',
    		controller: 'checkVmHealthCtrl',
    		backdrop:'static',
    		width:'915px',
    		resolve: {
    			params : function() {
    				return params;
    			}
    		}
    	});
    }
    
    $scope.$on('onRefrenshVmUserList', function(event, msg) {
        $scope.refreshVmUserList();
    });
    
    $scope.refreshVmUserList = function() {
        if ($scope.mySelections.length!=1) {
            return;
        }
        $scope.queryVmUsers($scope.mySelections[0]);
    }
    
    //用户列表
    var userUrl = 'org/vmUser';
    var params2 = {};
    $scope = GridService.grid2($scope, userUrl, params2, null, null, 'vmUserOrUserGrpListDivId');
    $scope.queryVmUsers = function(row) {
        $scope.params2.vmId = row.id;
        $scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);      
    }
    var operTemplate = '<div><div has-permission="VIRT_HOST_DISTRIBUTE" class="ngCellButton">'
        +'<div type="button" ng-if="row.entity.flag == 1 || row.entity.flag == 2 || row.entity.assignMode == 1" class="btn btn-sm-icon icon-delete-gray" ng-click="revokePrivilege(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
        +'<div type="button" ng-if="!(row.entity.flag == 1 || row.entity.flag == 2 || row.entity.assignMode == 1)" class="btn btn-sm-icon icon-delete-gray btn-forbidden" custom-title="'+$translate.instant('common.delete')+'"></div>'
        +'</div></div>';
    var column2 = [{ field: 'name', displayName: $translate.instant('cloudResource.loginNameOrGrpName'), sortable: true, width:'35%',cellTemplate:titleTemplate},
                   { field: 'desc', displayName: $translate.instant('cloudResource.userNameOrDesc'), sortable: true, width:'25%',cellTemplate:titleTemplate},
                   { field: 'flag', displayName: $translate.instant('common.type'), sortable: true, width:'20%',cellFilter:'virtualDeskType'},
                   { field: 'orgName', displayName: $translate.instant('org.org'), sortable: true, width:'20%',cellTemplate:titleTemplate}];
     $scope.mySelections2 = [];
     
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
             enablePaging: true,
             showFooter: true,
             pagingOptions: $scope.pagingOptions2,
             i18n: $translate.instant('load.static.lang'),
             totalServerItems: 'totalServerItems2',
             columnDefs:column2
      };
     
    $scope.revokePrivilege = function(row) {
        if (!(row.flag == 1 || row.flag == 2 || row.assignMode == 1)) {
            return;
        }
        var param = {};
        param.orgId = row.orgId;
        param.domainId = $scope.mySelections[0].id;
        param.title = $scope.mySelections[0]?$scope.mySelections[0].title:'';
        param.name = row.name;
        param.flag = row.flag;
        param.id = row.id;
        param.desktopPoolId = row.desktopPoolId;
        //TODO 若cloudOs支持虚拟桌面池，需要处理该参数
//    	cloudType:domain.cloudType,
//    	uniqueKey:domain.uniqueKey
        var modalInstance = UtilService.confirm($translate.instant('cloudResource.revokeConfirm',{name:row.name}),$translate.instant('org.del'));
        modalInstance.result.then(function (selectedItem) {
            HttpService.put('org/revoke', param, modalInstance, $scope.refreshVirtualDeskList);
        }, function () {
        });
    }
     
    //修改问题单:201706080624  遮罩层还在时切换页面,要等数据加载完才关闭.
    $scope.$on("$destroy", function() {
        UtilService.dismissAreawait(maskDiv + "areawait");
    });
});
//【云服务】/虚拟桌面池/虚拟机模板控制器
routeApp.controller('vmTemplateCtrl' ,function($scope,$state, $http, $modal, $translate, $stateParams, $timeout,UtilService, HttpService, GridService, DesktopService){
	$http({
		method : "GET",
		url : "desktop/all"
	}).success(function(result){
		if (angular.isArray(result.data)){
			for (var i = 0; i < result.data.length; i++){
				if (result.data[i].id == $stateParams.id){
					$scope.entry = result.data[i];
				}
			}
		}
	})
	$scope.$on(constant.onRefreshDeskTopTemplate, function(event, msg){
		$scope.refreshPage();
    })
	
	//虚拟机模板列表
	var vmTemplateCol = [ { field: 'domainName', displayName: $translate.instant('common.name'), sortable: true, width:'14%'},
	                      { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'20%'},
	                      { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'12%'},
	                      { field: 'memory', displayName: $translate.instant('template.memory'), sortable: true, cellFilter:'byteUnitRender',width:'12%'},
	                      { field: 'storage', displayName: $translate.instant('template.storage'), sortable: true, cellFilter:'byteUnitRender',width:'12%'},
	                      { field: 'createDate', displayName: $translate.instant('template.createTime'), sortable: true, cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',width:'15%'},
	                      { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	                    	  '<div><div class="ngCellButton">'
	                    	  +'<div type="button" class="btn btn-sm-icon icon-batchdeploy-gray" has-permission="ORGANIZATION_VM_BATCH_DEPLOY" ng-if="entry.assignMode==2" ng-click="deployOperate(row.entity,\'floatBatch\')" custom-title="'+$translate.instant('virdesk.batchDeployVD')+'"></div>'
	                    	  +'<div type="button" class="btn btn-sm-icon icon-deploy-gray" has-permission="ORGANIZATION_VM_DEPLOY" ng-if="entry.assignMode==1" ng-click="deployOperate(row.entity,\'fixedSingle\')" custom-title="'+$translate.instant('virdesk.deployVirDesk')+'"></div>'
	                    	  +'<div type="button" class="btn btn-sm-icon icon-batchdeploy-gray" has-permission="ORGANIZATION_VM_BATCH_DEPLOY" ng-if="entry.assignMode==1" ng-click="deployOperate(row.entity,\'fixedBatch\')" custom-title="'+$translate.instant('virdesk.batchDeployVD')+'"></div>'
	                    	  +'</div></div>'
	                      }
	                     ];
	//存储列表
	var storageColumn = [ { field: 'device', displayName: $translate.instant('template.devName'), sortable: true, width:'20%'},
	                      { field: 'targetBus', displayName: $translate.instant('template.busType'), sortable: true, width:'25%'},
	                      { field: 'storeFile', displayName: $translate.instant('template.volName'), sortable: true, width:'30%', cellTemplate:titleTemplate},
	                      { field: 'capacity', displayName: $translate.instant('template.capacity'), sortable: true, width:'25%', cellFilter:'byteUnitRender'}
	                      ];
	//网络列表
    var netColumn = [ { field: 'mac', displayName: $translate.instant('host.mac'), sortable: true, width:'12%'},
    	              { field: 'name', displayName: $translate.instant('addDomain.vswitch'), sortable: true, width:'13%',cellTemplate:titleTemplate},
    	              { field: 'profileName', displayName: $translate.instant('addDomain.profile'), sortable: true, width:'15%', cellTemplate:titleTemplate},
    	              { field: 'vlan', displayName: 'VLAN', sortable: true, width:'10%'},
    	              { field: 'outAvgBand', displayName: $translate.instant('template.outBandwidthLimit'), sortable: true, width:'12%'},
    	              { field: 'outBurst', displayName: $translate.instant('vm.outBytes'), sortable: true, width:'13%'},
    	              { field: 'inAvgBand', displayName: $translate.instant('template.inBandwidthLimit'), sortable: true, width:'12%'},
    	              { field: 'inBurst', displayName: $translate.instant('vm.inBytes'), sortable: true, width:'13%'}
	                  ];
    if ($stateParams.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
		//存储列表
		var storageColumn = [ { field: 'storeFile', displayName: $translate.instant('template.volName'), sortable: true, width:'50%', cellTemplate:titleTemplate},
		                { field: 'capacity', displayName: $translate.instant('template.capacity'), sortable: true, width:'50%', cellFilter:'byteUnitRender'}
		                      ];
		//网络列表
	    var netColumn = [ { field: 'mac', displayName: $translate.instant('addDomain.mac'), sortable: true, width:'50%'},
		                  { field: 'name', displayName: $translate.instant('template.netname'), sortable: true, width:'50%'}
		                  ];
	}
	$scope.url = "desktop/template";
	$scope.params = {desktopPoolId:$stateParams.id};
	$scope = GridService.grid($scope, $scope.url, $scope.params, null, null, "vmTemplateListDivId");
	$scope.getDataAsync();
    $scope.mySelections=[];
    $scope.dataDetail={};
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: true,
            selectedItems: $scope.mySelections,
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
            columnDefs:vmTemplateCol,
            afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
                $scope.dataDetail={};
            	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) { 
            		var vmId = rowItem.entity.id;
            		
            		var publicCloudId = $scope.entry.publicCloudId;
            		var flag = $scope.entry.flag;
            		if (flag == constant.PUBLIC_CLOUD_VMWARE) {//vmware
            			var vmKey = rowItem.entity.vmKey;
            			$http({
            				method:"GET",
            				url:"vmware/vcenter/" + publicCloudId + "/vm/detail",
            				params:{key:vmKey, isTemplate:true}
            			}).success(function(result){
            			    if (result.data) {
                				$scope.dataDetail.netData = result.data.networks;
                				$scope.dataDetail.storageData = result.data.storages;
            			    }
            				UtilService.handleResult(result);
            			})
            		} else { //cvm
            			$http({
            				method:"GET",
            				url:"template/details",
            				params:{vmId:vmId, cloudId:publicCloudId}
            			}).success(function(result){
            			    if (result.data) {
                				$scope.dataDetail.netData = result.data.networks;
                				$scope.dataDetail.storageData = result.data.storages;
            			    }
//            				$scope.$broadcast("broadcastData",$scope.dataDetail);
            			})
            		}
            	}
            }
    }; 
  //默认选中第一行.但是此监听会执行好多次需要处理
	$scope.$on('ngGridEventData', function(row, event) {
		if ($scope.mySelections.length < 1) {			
			$scope.gridOptions.selectRow(0, true);
		}
    });
    $scope.netSelections=[];
    $scope.dataDetail.netData=[];
    $scope.gridOptions2 = {
            data: 'dataDetail.netData',
            jqueryUITheme: false,
            jqueryUIDraggable: true,
            selectedItems: $scope.netSelections,
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
            columnDefs:netColumn
    }; 
    
  
    $scope.storageSelections=[];
    $scope.dataDetail.storageData=[];
    $scope.gridOptions3 = {
            data: 'dataDetail.storageData',
            jqueryUITheme: false,
            jqueryUIDraggable: true,
            selectedItems: $scope.storageSelections,
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
            columnDefs:storageColumn
    };
	$state.go('main.desktop.vmTemplate.net');
    //部署虚拟机操作，type取值：floatBatch浮动桌面池批量部署 |fixedSingle固定桌面池单个部署 |fixedBatch固定桌面池批量部署
	var deploy = function(rowObj, type) {
	    if(type==='floatBatch'){
            DesktopService.virDeskDeploy($scope.entry);
        }else if(type==='fixedSingle'){
            var resolve = {
                    templateInfo: function(){
                        var obj = {};
                        obj.vmId = rowObj.id;
                        obj.orgId = $scope.entry.orgId;
                        obj.desktopPoolId = $scope.entry.id;
                        obj.publicCloudId = $scope.entry.publicCloudId;
                        obj.resourcePoolId = $scope.entry.resourcePoolId;
                        obj.vmTempName = rowObj.domainName;
                        obj.system = rowObj.system;
                        obj.flag = $scope.entry.flag;
                        return obj;
                    }
            };
            var modalInstance=$modal.open({
                templateUrl:'html/modal/desktop/deployVm.html',
                backdrop:'static',
                resolve:resolve,
                size:'lg',
                controller:'deployVmCtrl'
            });
            modalInstance.result.then(function(selectedItem){
                
            },function(reason){
            });
            
        }else{
            var resolve = {
                    template: function(){
                        var obj = {};
                        obj.vmId = rowObj.id;
                        obj.orgId = $scope.entry.orgId;
                        obj.desktopPoolId = $scope.entry.id;
                        obj.publicCloudId = $scope.entry.publicCloudId;
                        obj.clusterId = $scope.entry.clusterId;
                        obj.resourcePoolId = $scope.entry.resourcePoolId;
                        obj.domainName = rowObj.domainName;
                        obj.system = rowObj.system;
                        obj.flag = $scope.entry.flag;
                        return obj;
                    },
                    deployType : function() {return constant.VIR_DESK_DEPLOY;}
            };
            var modalInstance = $modal.open({
                  templateUrl: 'html/modal/org/orgBatchDeploy.html',
                  controller: 'OrgBatchDeployVmCtrl',
                  size: 'lg',
                  backdrop:'static',
                  resolve: resolve
            });
        }
	}
    $scope.deployOperate=function(rowObj,type){
        if (rowObj.vmKey) {
            deploy(rowObj,type);
        } else {
            var waitModal = UtilService.wait();
            $http({
                method:'GET',
                url:'template/check',
                params:{ templetId:rowObj.id}
            }).success(function(result) {
                waitModal.dismiss();
                if (result.success == true) {
                    deploy(rowObj,type);
                } else {
                    UtilService.handleResult(result);
                }
            }).error(function(response, code, headers, config) {
                waitModal.dismiss();
                UtilService.handleError(code);
            });
        }
    }
});

//【云服务】/虚拟桌面池/虚拟机模板/部署虚拟机
routeApp.controller('deployVmCtrl' ,function($scope, $http, $modal, $modalInstance, $timeout, $translate,templateInfo,UtilService, HttpService, GridService){
  $scope.templateInfo = templateInfo;
  $scope.cloudId = templateInfo.publicCloudId;
  $scope.isManualDefinition = $scope.templateInfo.isManualDefinition;
  $scope.resourcePoolId = $scope.templateInfo.resourcePoolId;
  $scope.flag = $scope.templateInfo.flag;
  $scope.deployType = constant.VIR_DESK_DEPLOY;
  if (!isEmpty($scope.templateInfo.system)){
	  $scope.system = $scope.templateInfo.system;
  }
 
  $scope.domainNameUrl = "domain/nameExist?publicCloudId=" + $scope.cloudId;
  $scope.title=$translate.instant("template.deploy");
  $scope.entry={};
  $scope.stepTitles = [$translate.instant("baseinfo"),
                       $translate.instant("virdesk.configInfo"),
                       $translate.instant('virdesk.systemParam'),
                       $translate.instant('virdesk.loginInfo')
	                  ];
	$scope.valids = {
	       stepOneOver : function() {
	          			if ($('#form1').val() === "true"){
		          			return true;
	          			}
	          			return false;
	       },
	       stepTwoOver : function() {
     			if ($('#form2').val() === "true"){
         			return true;
     			}
     			return false;
     		},
 	       stepThreeOver : function() {
     			if ($('#form3').val() === "true"){
         			return true;
     			}
     			return false;
     		},
 	       stepFourOver : function() {
     			if ($('#form4').val() === "true"){
         			return true;
     			}
     			return false;
     		}
  	};
    $scope.selOptions={
    		destributeWay:[{value:'0',label:$translate.instant('virdesk.noDistribute')},
    		               {value:'1',label:$translate.instant('virdesk.disToUser')},
    		               {value:'2',label:$translate.instant('virdesk.disToUserGrp')}],
    		storageUnit:[{value:"MB",label:"MB"},
    		       	     {value:"GB",label:"GB"}],
    		localgroup:[{value:"Administrators",label:"Administrators"},
    		            {value:"Power Users",label:"Power Users"},
    		            {value:"Users",label:"Users"}],
    		initWay:[{value:'0',label:$translate.instant('virdesk.fastInit')},
    		            {value:'1',label:$translate.instant('virdesk.absoluteInit')}]            
    };
    $scope.timezones = getTimezones($translate);
    $http({
    	method : "GET",
    	url : "template/deployTemplateInfo",
    	params : {id : $scope.templateInfo.vmId, cloudId:$scope.templateInfo.publicCloudId, orgId:$scope.templateInfo.orgId}
    }).success(function(result){
    	//console.log(result.data);
    	$scope.deployInfo = result.data;
    	
    	if (isEmpty($scope.flag)){
    		$scope.flag = result.data.flag;
    	}
    	if (angular.isArray($scope.deployInfo.resourcePools)){
    		if ($scope.resourcePoolId == undefined){
    			$scope.resourcePoolId = $scope.deployInfo.resourcePools[0].resourcePoolId;
    			$scope.maxCpu = $scope.deployInfo.resourcePools[0].clusterMaxCpu;
    			$scope.maxMem = $scope.deployInfo.resourcePools[0].clusterMaxMem;
    		} else {
    			for (var k = 0; k < $scope.deployInfo.resourcePools.length; k++) {
    				if ($scope.deployInfo.resourcePools[k].resourcePoolId == $scope.resourcePoolId) {    					
    					$scope.maxCpu = $scope.deployInfo.resourcePools[k].clusterMaxCpu;
    					$scope.maxMem = $scope.deployInfo.resourcePools[k].clusterMaxMem;
    					break;
    				}
    			}
    		}
    	}
    	
    	if (!isEmpty($scope.deployInfo.cpuSocket)){
    		$scope.entry.cpuSocket = $scope.deployInfo.cpuSocket;
    	} else {
    		$scope.entry.cpuSocket = 1;
    	}
    	if (!isEmpty($scope.deployInfo.cpuCore)){
    		$scope.entry.cpuCore = $scope.deployInfo.cpuCore;
    	} else {
    		$scope.entry.cpuCore = 1;
    	}
    	
    	if (!isEmpty($scope.deployInfo.memoryInit)){
    		$scope.entry.memory = $scope.deployInfo.memoryInit;
    	} else if (!isEmpty($scope.deployInfo.memory)) {
    		$scope.entry.memory = $scope.deployInfo.memory;
    	} else {
    		$scope.entry.memory = 512;
    	}
    	if (!isEmpty($scope.deployInfo.memoryUnit)){
    		$scope.entry.memoryUnit = $scope.deployInfo.memoryUnit;
    	} else {
    		$scope.entry.memoryUnit = "MB";
    	}
    	if ($scope.entry.memoryUnit == 'GB'){
    		$scope.maxMem = UtilService.transformMBTOGB($scope.maxMem).toFixedFloor(2);
    		$scope.minMem = 1;
    	} else {
    		$scope.minMem = 512;
    	}
    });
    $scope.entry.localgroup='Administrators';
    $scope.entry.initWay='0';
    $scope.entry.ipAssignMode='0';
    $scope.entry.belongTo='0';
    $scope.entry.fastDeploy = true;
    $scope.entry.assignMode='1';
    $scope.entry.timezone = 210;
    $scope.deployWay=$translate.instant("cloudBusiness.fastDeploy");
    if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    	$scope.initTip = $translate.instant("virdesk.vmwareInitTip");
    }
    $scope.$watch("entry.protectModel",function(newValue, oldValue){
    	if (newValue != oldValue){
    		if (newValue == true){
    			$scope.entry.fastDeploy = true;
    		}
    	}
    });
    $scope.$watch("entry.memoryUnit", function(newValue, oldValue){
    	if (newValue == 'MB' && oldValue == 'GB'){
    		$scope.maxMem = UtilService.transformGBTOMB($scope.maxMem);
    		$scope.minMem = 512;
    	} else if (newValue == 'GB' && oldValue == 'MB'){
    		$scope.maxMem = UtilService.transformMBTOGB($scope.maxMem).toFixedFloor(2);
    		$scope.minMem = 1;
    	}
    });
    $scope.$watch("entry.initWay", function(newValue, oldValue){
    	if (newValue == '0' && $scope.flag != constant.PUBLIC_CLOUD_VMWARE){
    		$scope.initTip = $translate.instant("virdesk.initTip");
    	} else if (newValue == '1' && $scope.flag != constant.PUBLIC_CLOUD_WMWARE){
    		$scope.initTip = $translate.instant("virdesk.initTip2");
    	}
    });
    $scope.$watch("entry.belongTo", function(newValue, oldValue){
    	if (newValue == '0'){
    		$scope.maxLength = 63; 
    		$scope.entry.domain = undefined;
    		$scope.entry.loginAccount = undefined;
    	} else {
    		$scope.maxLength = 15;
    		$scope.entry.domain = "WORKGROUP";
    		if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    			$scope.entry.loginAccount = "Administrator";
    		}
    		
    	}
    });
    //选择用户
    $scope.model={};
    $scope.selectUser=function(){
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/selectUser.html',
            controller: 'SelectUserCtrl',
            resolve: {
            	params : function() {return {orgId:$scope.templateInfo.orgId};},
            	url : function() {
            		return "user/list";
            	},
            	entryNodeType : function() {return undefined}
            },
            backdrop:'static',
            size:'lg'
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.model.userIds = [];
        	$scope.userNames = [];
        	for(var i=0;i<selectedItem.length;i++){
        		$scope.model.userIds.push(selectedItem[i].id);
        		$scope.userNames.push(selectedItem[i].loginName);
        	}
        	$scope.entry.user=$scope.userNames.join(',');
        }, function (reason) {
        });
    };
    $scope.selectUserGroup=function(){
    	var params = {orgId : $scope.templateInfo.orgId};
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/selectUserGrp.html',
            controller: 'SelectUserGrpCtrl',
            width:'700px',
            resolve : {
            	params: function () {
		            return params;
            	}
            },
            backdrop:'static'
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.model.userGrpIds = [];
        	$scope.userGrpNames = [];
        	for(var i=0;i<selectedItem.length;i++){
        		$scope.model.userGrpIds.push(selectedItem[i].id);
        		$scope.userGrpNames.push(selectedItem[i].name);
        	}
        	$scope.entry.userGrp=$scope.userGrpNames.join(",");
        }, function (reason) {
        });
    };
    //控制右侧配置详情中标签对应的值不提前显示
    $scope.goTwo=$scope.goThree=false;
    $scope.nextCallBack={
    	"1":function(){
    		$scope.goTwo=true;
    	},
    	"2":function(){
    		$scope.goThree=true;
    		var num = $scope.entry.cpuSocket * $scope.entry.cpuCore;
    		if (num > constant.VM_CPU_MAX_NUM2){
    			UtilService.error($translate.instant("virdesk.cpuMax128"));
    			return false;
    		}
    		if (num > $scope.maxCpu){
    			UtilService.error($translate.instant("virdesk.deployCpuMax",{value:$scope.maxCpu}),$translate.instant("template.deploy"));
    			return false;
    		}
    	},
    	"3":function(){
    		$scope.goFour=true;
    		if ($scope.entry.ipAssignMode == '1' && !isEmpty($scope.entry.ip) && !isEmpty($scope.entry.ipMask)){
    			if (!UtilService.validateIpAddress($scope.entry.ip, $scope.entry.ipMask)){
    				UtilService.error($translate.instant("validatorIllegalIp"), $translate.instant("template.deploy"));
    				return false;
    			}
    		}
    	}
    }
    $scope.ok=function(){
    	if ($scope.flag != constant.PUBLIC_CLOUD_VMWARE && $scope.entry.initWay == '1'){
    		if ($scope.entry.loginAccount == 'Administrator' || $scope.entry.loginAccount == 'Guest' ){
    			UtilService.error($translate.instant("virdesk.loginAccountError"), $translate.instant("template.deploy"));
    			return;
    		}
    	}
    	if ($scope.entry.loginAccount == $scope.entry.sysName){
    		UtilService.error($translate.instant("virdesk.loginAccountSameError"), $translate.instant("template.deploy"));
    		return;
    	}
    	var data = {};
    	data.id = $scope.templateInfo.vmId;
    	data.vmTempName = $scope.templateInfo.vmTempName;
    	data.protectMode = $scope.entry.protectModel ? 1 : 0;
    	data.deployMode = $scope.entry.fastDeploy ? 1 : 0;
    	data.deployType = 2;
    	data.domainName = $scope.entry.domainName;
    	data.title = $scope.entry.displayName;
    	data.desc = $scope.entry.desc;
    	data.orgId = $scope.templateInfo.orgId;    
    	data.desktopPoolId = $scope.templateInfo.desktopPoolId;
    	if ($scope.entry.assignMode == '1'){
    		data.userIds = $scope.model.userIds;
    	} else if ($scope.entry.assignMode == '2'){
    		data.userGrpIds = $scope.model.userGrpIds;
    	}
    	if ("MB" == $scope.entry.memoryUnit) {
    		data.memory = $scope.entry.memory
    	} else {
    		data.memory = $scope.entry.memory * 1024;
    	}
    	data.memoryInit = $scope.entry.memory;
    	data.memoryUnit = $scope.entry.memoryUnit;
    	data.cpuSocket = $scope.entry.cpuSocket;
    	data.cpuCore = $scope.entry.cpuCore;
    	data.osInfo = {};
    	data.osInfo.initType = Number($scope.entry.initWay);
    	data.osInfo.sysName = $scope.entry.sysName;
    	if ($scope.entry.ipAssignMode == '1'){
    		data.osInfo.sysIp = $scope.entry.ip;
    		data.osInfo.sysMask = $scope.entry.ipMask;
    		data.osInfo.sysGateway = $scope.entry.gateway;
    		data.osInfo.sysdns = $scope.entry.firstDns;
    		data.osInfo.secondaryDns = $scope.entry.secondDns;
    		data.osInfo.isBindIp = $scope.entry.isBindIp; 
    	} 
    	if ($scope.system == 0 || $scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    		if ($scope.entry.belongTo == '0'){
    			data.osInfo.regOrGroupType = 1;
    		} else {
    			data.osInfo.regOrGroupType = 2;
    		}
    		data.osInfo.regOrGroup = $scope.entry.domain;
    		data.osInfo.localgroup = $scope.entry.localgroup;
    		
    	}
    	data.osInfo.loginAccount = $scope.entry.loginAccount;
    	data.osInfo.loginPassword = $scope.entry.loginPwd;
    	data.osInfo.productKey = $scope.entry.productkey;
    	data.timezone = $scope.entry.timezone;
    	//网络信息
		data.networks = [];
		if ($scope.showFormat) {
			for( i = 0; i < $scope.myData1.length; i++){
				var netdata = $scope.myData1[i];
				var objnet = {
						"mac" : netdata.mac,
						"vSwitchName" :  netdata.vswitchName,
						"profileName" :  netdata.netProfileName
				};
				data.networks.push(objnet);
			}
		}
    	if (angular.isUndefined($scope.isManualDefinition)){
    		if ($scope.flag != constant.PUBLIC_CLOUD_VMWARE){
    			HttpService.post("domain/deploy", data, $modalInstance, $scope.showTaskList);
    		} else {
    			HttpService.post("vmware/deploy", data, $modalInstance, $scope.showTaskList);
    		}
    		
    	} else if ($scope.isManualDefinition == true){
    		$modalInstance.close(data);
    	}
    	
//    	$modalInstance.close();
    };
    $scope.cancel=function(){
    	$modalInstance.dismiss("cancel");
    };
    $scope.advance = $translate.instant('migrateVm.showAdvance');
    //磁盘格式
    $scope.showFormat = false;
    $scope.designatedFormat = function() {
    	$scope.showFormat = !$scope.showFormat;
    	if ($scope.showFormat) {
    		$scope.advance = $translate.instant('migrateVm.hideAdvance');
    		var vswitchUrl= "resourcePool/resVswitchByResourcePoolId/"+ $scope.resourcePoolId;
    		$http({
    	        method: 'GET',
    	        url: vswitchUrl,
    	    }).success(function (result) {
    			if (result.success == true) {
    				var dataArr = result.data;
    				$scope.vswitchs = dataArr;				
    			}
    		});
    		/* 资源池网络策略模板删除 var profileUrl = "resourcePool/resProfile/"+ $scope.cloudId;
    		$http({
    	        method: 'GET',
    	        url: profileUrl,
    	    }).success(function (result) {
    			if (result.success == true) {
    				var dataArr = result.data;
    				$scope.profiles = dataArr;				
    			}
    		});*/
            if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
                $timeout.cancel($scope.keyInterval);
            }
            $scope.keyInterval = $timeout(function() {
                if ($scope.vswitchs != undefined){
                	showNetwork();
                	$timeout.cancel($scope.keyInterval);
                }
            }, constant.keyInterval);   
            function showNetwork(){           	
            	for (var i = 0; i < $scope.myData1.length; i ++) {
            		for (var j = 0; j < $scope.vswitchs.length; j++){
            			if ($scope.myData1[i].name == $scope.vswitchs[j].name && $scope.vswitchs[j].isExist) {
            				$scope.myData1[i].vswitchName = $scope.myData1[i].name;
            				$scope.myData1[i].noVswitchValue = false;
            				break;
            			}
            		}
            		/*  资源池网络策略模板删除 for (var k = 0; k < $scope.profiles.length; k++){
            			if($scope.myData1[i].profileName == $scope.profiles[k].name && $scope.profiles[k].isExist){
            				$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            				$scope.myData1[i].noProfileValue = false;
            				break;
            			}
            		}*/
            		$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            		if (typeof($scope.myData1[i].vswitchName) == "undefined") {
            			$scope.myData1[i].noVswitchValue = true;
            		}
            		/*资源池网络策略模板删除 if (typeof($scope.myData1[i].netProfileName) == "undefined") {
            			$scope.myData1[i].noProfileValue = true;
            		}*/
            		}
            	}
    		
    	} else {
    		$scope.advance = $translate.instant('migrateVm.showAdvance');
            if (angular.isDefined($scope.keyInterval)) {
                $timeout.cancel($scope.keyInterval);
            }
    	}
    };   	
	 var vswitchCellTemplate=TEMPLATE_START +
	   '<input custom-title="{{row.entity[col.field]}}" ng-style="{\'border\': row.entity.noVswitchValue ? \'2px solid #a94442\' : \'2px solid #ebebeb\'}" ng-model="row.entity[col.field]" style="display:inline-block;width:114px;" class="gridInput" ng-click="selectVswitch(row.entity)" readonly required>' +
	   '<span class="input-group-addon gridSpan" ng-click="selectVswitch(row.entity)"><span class="fa fa-search"></span></span>'+
	   TEMPLATE_END , 
  
     netstrategyCellTemplate=TEMPLATE_START +
	   '<input custom-title="{{row.entity[col.field]}}" ng-model="row.entity[col.field]" style="display:inline-block;width:114px;" class="gridInput" ng-click="selectNetProfile(row.entity)" readonly required>' +
	   '<span class="input-group-addon gridSpan" ng-click="selectNetProfile(row.entity)"><span class="fa fa-search"></span></span>'+
	   TEMPLATE_END ; 
	var column1 = [{ field: 'network', displayName: $translate.instant('addDomain.network'), sortable: true, width:'20%'},
	              { field: 'vswitchName', displayName: $translate.instant('addDomain.vswitch'), sortable: true, width:'40%',cellTemplate:vswitchCellTemplate},
	              { field: 'netProfileName', displayName: $translate.instant('addDomain.profile'), sortable: true, width:'40%',cellTemplate:netstrategyCellTemplate}
	              ]
	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	var detailUrl = 'template/details';
	var detailParam = {
    		vmId:$scope.templateInfo.vmId,
			orgId:$scope.templateInfo.orgId
    };		
	$http({
        method: 'GET',
        url: detailUrl,
        params: detailParam
    }).success(function (result) {
		if (result.success == true) {
			var dataArr = result.data.networks;
			for (var i = 0; i < dataArr.length; i ++) {
				dataArr[i].network = $translate.instant('addDomain.network') + (i+1);
			}
			$scope.myData1 = dataArr;				
		}
	});

	$scope.gridOptions1 = {
			data: 'myData1',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections3,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: true,
			showFilter: false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: false,
			showFooter: false,
			i18n: $translate.instant('lang'),
//			totalServerItems: 'totalServerItems',
			filterOptions: false,
			pagingOptions: false,
			columnDefs:column1
	};
	// 选择虚拟交换机模板
	$scope.selectVswitch = function (row){
		var resolve = {
		        inputParam: function() {
                    var inputParam = {};
                    inputParam.resourcePoolId = $scope.resourcePoolId;                                       
                    return inputParam;
                }
	        };
        var vswitchInstance = UtilService.lgmodal('html/modal/common/vswitchSelector.html', 'vswitchSelectCtrl', resolve);
        vswitchInstance.result.then(function (selectedItem) {
        	if (angular.isDefined(selectedItem)) {
        		row.vswitchName = selectedItem.name;
        		row.noVswitchValue = false;  
        	}
        }, function (reason) {

       });	
	};
	
	$scope.clearNetProfile = function (){
		$scope.myData1 = undefined;
	};
	
	
	// 选择网路策略模板
	$scope.selectNetProfile = function (row){
		var resolve={
				inputParam: function() {
                    var inputParam = {};                   
                    inputParam.cloudId = $scope.cloudId;         
                    return inputParam;
                }
		};
		var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
		profileInstance.result.then(function (selectedItem) {
			if(angular.isDefined(selectedItem)){
				row.netProfileName = selectedItem.name;
				//资源池网络策略模板删除row.noProfileValue = false;
			}
		}, function (reason) {
		});
	};
	
	$scope.clearNetProfile = function (){
		$scope.myData1 = undefined;
	};
  
});


routeApp.controller('virDeskDeployCtrl',function(params, $scope, $state, $http, $modalInstance, $location,$modal, $timeout, $translate, UtilService,
		HttpService, GridService, DesktopService){
	$scope.model = {};
	if (params != null && typeof(params.id) != 'undefined') {
		// 修改虚拟桌面池
		$http.get("desktop/getDesktopInfo?id=" + params.id).success(function(result){
			// 基础信息
			$scope.model.cloudId = result.data.cloudId;
			$scope.model.id = result.data.id;
			$scope.model.startIp = result.data.startIp;
			$scope.model.endIp = result.data.endIp;
			$scope.model.ipMask = result.data.ipMask;
			$scope.model.gateway = result.data.gateway;
			$scope.model.firstDns = result.data.firstDns;
			$scope.model.secondDns = result.data.secondDns;
			$scope.model.userData = result.data.userData;
		});
	}
	
	// 确认
	$scope.ok = function () {
		var uri = "desktop/deploy";
		var data = $scope.model;
		HttpService.post(uri, data, $modalInstance);
//    	$modalInstance.dismiss('ok');
	};	
	
	// 关闭
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

});
//健康检测对话框控制器
routeApp.controller('checkVmHealthCtrl',function(params,$compile, $scope, $state, $http, $modalInstance, $translate,$modal, $timeout, UtilService,
        HttpService, GridService, DesktopService){
    $scope.totalNum = 0;
    $scope.normalNum = 0;
    $scope.errorNum = 0;
    $scope.isChecking = false;
    $scope.vmList = params;
    if (angular.isArray($scope.vmList)) {
        $scope.totalNum = $scope.vmList.length;
    }
    
    $scope.checkInfo = $translate.instant("virdesk.needCheckVmNumber", {totalNum:$scope.totalNum});
    // 进入健康检测界面进行查询虚拟桌面池虚拟机数量
    $http({
        method: 'GET',
        url: 'desktop/health/query',
        params: {virDeskPoolId : params.id}
    }).success(function (result) {
    	if (result != null && result.data != null && result.data.length > 0) {
    		$scope.domains = result.data;
			var domainNames = "";
			for(var i in $scope.domains) {
				domainNames += $scope.domains[i].title +",";
			}
			domainNames=domainNames.substring(0,domainNames.length-1);
			$scope.totalNum = $scope.domains.length;
			$scope.checkInfo = $translate.instant("virdesk.needCheckVmNumber", {totalNum:$scope.totalNum});
		} else {
			$scope.checkInfo = $translate.instant("virdesk.domainNoNeedCheck");
		}
    })
    
    //检查完成后显示打虚拟机列表
    $scope.showVmList = [];
    
    //检测
    $scope.checkVmsHealth = function() {
    	$("#checkResult").html("");
        if ($scope.totalNum <= 0) {
            return;
        }
        $timeout(function() {
            $scope.isChecking = true;
            $scope.normalNum = 0;
            $scope.errorNum = 0;
            $scope.checkInfo = $translate.instant("virdesk.checkingVm");
            $scope.showVmList.splice(0, $scope.showVmList.length);
        });
        if (angular.isArray($scope.domains)) {
            for (var i=0; i< $scope.domains.length ; i++) {
            	var cloudId = $scope.domains[i].cloudId;
            	var domainId = $scope.domains[i].domainId;
            	var title = $scope.domains[i].title;
            	var type = $scope.checkPing?"ping":"";
                var healthParams = {
                    type:$scope.checkPing?"ping":"",
                    domainId:domainId,
                    cloudId:cloudId
                }; 
                var healthUrl = "desktop/health/checkVm?domainId=" + domainId + "&cloudId=" + cloudId + "&type=" + type;
        		$.ajax({
      			  type: 'GET',
      			  async : true, // 同步执行。
      			  url: healthUrl,
      			  success: function(result){
      				if (!result.health) {
      					var errorInfo = $translate.instant("virdesk.errorInfo") + result.result;
      					var cutStr;
      					var showStr;
      					if (errorInfo.getWidth(14)<388) {
      						cutStr = errorInfo;
      					} else {
      						for(var i=1;i<errorInfo.length;i++){
        						showStr=errorInfo.substr(0,errorInfo.length-i);
        						cutStr = showStr+'...';
        						if(cutStr.getWidth(14)<388){
        							break;
        						}
        					}
      					}
    					
                		var srcImg =  "desktop/health/vmScreen/query?cloudId=" + cloudId + "&domainId=" + result.domainId + "&" + Math.random();
                		var reimg = '<div style="width:100%;"><div style="width:40%;height:110px ;margin-top:5px;float:left;"><img src="' + srcImg + '" style="max-width:93px;height:105px;margin-left: 1px"></div>';
                		reimg += '<div style="width:60%;float:right;"><h5 style=" margin-bottom: 5px;"><div>' + $translate.instant("virdesk.vmTitle") +
                		'</div><div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;padding-left: 4px;width: 135px;" title="'+ result.title +'">' + result.title +'</div>' + 
                		'</h5><div title="'+ errorInfo + '" style="word-break: break-all;">' + cutStr + "</div></div>";
                		reimg += '<div style="clear:both"></div></div>'

//                		var errInfoDiv = '<div style = "width:400px;float:left;" class="cas-checkbox labeled-btn" id="checkboxDiv' + result.domainId +'">';
//                		errInfoDiv += '<input class = "error-vm-sellect" id="checkbox' + result.domainId + '" type="checkbox" value="' + result.domainId +'"/>';
//                		errInfoDiv += '<div class="corner-label"><i class="glyphicon glyphicon-ok icon"></i></div>';
//                		errInfoDiv += '<div class="box"><div class="box-name">' + reimg + '</div></div>';
//                		errInfoDiv += '</div>';
                		var errInfoDiv = '<div class="samplechart">';
                		errInfoDiv += '<div class="dashboard-corner-label"><i class="definedicon glyphicon glyphicon-ok icon"></i></div>';
                		errInfoDiv += '<div class="checkboximg" id="checkboximg' + result.domainId + '" data-id="' + result.domainId + 
                					  '" data-title="' + result.title + 
                					  '" data-cloudId="' + cloudId + 
                					  '">';
                		errInfoDiv += reimg;
                		errInfoDiv += '</div></div>';
                		$("#checkResult").append($compile(errInfoDiv)($scope));
            			$("#checkboximg" + result.domainId).bind("click",function() {
        					if ($(this).attr("class") == 'checkboximg active') {
        						$(this).parent("div").children("div").attr("class", "dashboard-corner-label");
        						$(this).attr("class", "checkboximg");
        					} else {
        						$(this).parent("div").children("div").attr("class", "dashboard-corner-label active");
        						$(this).attr("class", "checkboximg active");
        					}
        		        });
                        $scope.showVmList.push(result);
                        $scope.errorNum++;
                    } else {
                        $scope.normalNum++;
                    }
      				$timeout(function() {
      					$scope.checkInfo = $translate.instant("virdesk.checkVmResult",{
      						totalNum:$scope.totalNum,
      						normalNum:$scope.normalNum,
      						errorNum:$scope.errorNum
      					});
      				});
                    if ($scope.totalNum == $scope.errorNum + $scope.normalNum) {
                        $scope.isChecking = false;
                    }
      			   },
      			  dataType: "json"
        		});
            }
        }
    }
    
    
    //修复
    $scope.repairVm = function() {
    	var needRepairVm = 0;
    	$(".checkboximg").each(function(){
    		if ($(this).attr("class") == 'checkboximg active') {
    			needRepairVm ++;
    		}
    	});
    	if (needRepairVm == 0) {
    		UtilService.alert($translate.instant('virdesk.alertRepairVm'), $translate.instant('common.opertip'));
    		return;
    	}
    	
    	var modalInstance = UtilService.confirm($translate.instant('virdesk.confirmRepairVm'),
				$translate.instant('operConfirm'));
    	modalInstance.result.then(function (selectedItem) {
    		$scope.checkInfo = "";
    		$(".checkboximg").each(function(){ 
    			if ($(this).attr("class") == 'checkboximg active') {
    				var url = "desktop/health/repairVm?domainId=" + $(this).attr("data-id") + 
    				"&cloudId=" + $(this).attr("data-cloudId") + "&title=" + $(this).attr("data-title");
    				$.ajax({
    					  type: 'GET',
    					  async : false, // 同步执行。
    					  url: url,
    					  success: function(result){
    						  if (result != null) {
    							  if (result.state == 0) {
    								  var resultDiv = result.successMessage;
    								  $scope.checkInfo += resultDiv;
    							  } else {
    								  var failMsg = result.failureMessage; 
    								  $scope.checkInfo += failMsg; 
    							  }
    						  }
    					   },
    					  dataType: "json"
    				});
    			}
    		});
	    }, function () {
	    });
    }
    
    //全选
    $scope.selecetAllVm = function() {
		$(".checkboximg").each(function(){ 
			$(this).parent("div").children("div").attr("class", "dashboard-corner-label active");
			$(this).attr("class", "checkboximg active");		
		});
	}
    
    // 关闭
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});