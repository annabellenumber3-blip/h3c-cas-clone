/**
 * @author 10462
 * @description	概览页面 
 */ 
var hostIds = [];
var vmIds = [];
var red = "#F73737";
var yellow = "#d98629";
var green = "#84c308";
var blue = "#2ba6eb";
var purple = "#9176ce";
var imgPath = 'css/img/dashboard/';

//获取带透明度的红色
function getRedRgba (rgba) {
	if (!rgba) {
		rgba = 1;
	}
	return 'rgba(247,72,72, ' + rgba + ')';
}

//获取带透明度的黄色
function getYellowRgba (rgba) {
	if (!rgba) {
		rgba = 1;
	}
	return 'rgba(255,128,0, ' + rgba + ')';
}

//获取带透明度的蓝色#00B7FF
function getBlueRgba (rgba) {
	if (!rgba) {
		rgba = 1;
	}
	return 'rgba(0,183,255, ' + rgba + ')';
}

//获取带透明度的紫色#9B83DD
function getPurpleRgba (rgba) {
	if (!rgba) {
		rgba = 1;
	}
	return 'rgba(155,131,221, ' + rgba + ')';
}

//获取带透明度的绿色#86CC16
function getGreenRgba (rgba) {
	if (!rgba) {
		rgba = 1;
	}
	return 'rgba(134,204,22, ' + rgba + ')';
}

// 审批权限委托
routeApp.controller('EntrustCtrl', function($modal, $scope, $state, $timeout, $translate,$modalInstance, 
		$http, $rootScope, UtilService, HttpService){
	$scope.model = {};
	$scope.model.state = 0;
	
	// 初始化获取委托权限数据
	$http({
        method : 'GET',
        url    : 'workflow/queryEntrustor'
    }).success(function(result) {
    	if (result.success) {
    		var entrusts = result.data.entrusts;
    		if (!angular.isDefined(entrusts)) {
        		for (var i=0; i< entrusts.length; i++) {
        			var entrustOpId = entrusts[i].entrustOpId;
        			var entrustOpName = entrusts[i].entrustOpName;
        			var entrustType = entrusts[i].entrustType;
        			if (entrustType == 0 ) {
        				$scope.model.state = 0;
        				$('#effect_0').checked = true;
        				$('#effect_1').checked = false;
        				$scope.model.mandataryOpId = entrustOpId;
    					$scope.model.mandataryOpName = entrustOpName;
        			} else {
        				$scope.model.state = 1;
        				$('#effect_1').checked = true;
        				$('#effect_0').checked = false;
        				if (entrustType == 1) {
        					$scope.model.vmWorkFLowOpId = entrustOpId;
        					$scope.model.vmWorkFLowOpName = entrustOpName;
        				} else if (entrustType == 2) {
        					$scope.model.cloudDiskOpId = entrustOpId;
        					$scope.model.cloudDiskOpName = entrustOpName;
        				} else if (entrustType == 3) {
        					$scope.model.userRegisterOpId = entrustOpId;
        					$scope.model.userRegisterkOpName = entrustOpName;
        				} else if (entrustType == 4) {
        					$scope.model.cloudBackupStrategyOpId = entrustOpId;
        					$scope.model.cloudBackupStrategyOpName = entrustOpName;
        				}
        			}
        		}
    		}
    	}
    }).error(function(response, code, headers, config) {
    	
	});
	
	// 委托
	$scope.entrust = function () {
		
		if ($scope.model.state == 1) {
			if (!angular.isDefined($scope.model.vmWorkFLowOpId) && !angular.isDefined($scope.model.cloudDiskOpId)
    				&& !angular.isDefined($scope.model.userRegisterOpId) && !angular.isDefined($scope.model.cloudBackupStrategyOpId)) {
    			UtilService.alert($translate.instant("entrust.entrustAlert"));
    			return;
    		}
			delete $scope.model.mandataryOpId;
    		delete $scope.model.mandataryOpName;
		} else {
			if (!angular.isDefined($scope.model.mandataryOpId)) {
    			UtilService.alert($translate.instant("entrust.entrustAlert"));
    			return;
    		}
			delete $scope.model.vmWorkFLowOpId;
    		delete $scope.model.vmWorkFLowOpName;
    		delete $scope.model.cloudDiskOpId;
    		delete $scope.model.cloudDiskOpName;
    		delete $scope.model.userRegisterOpId;
    		delete $scope.model.userRegisterkOpName;
    		delete $scope.model.cloudBackupStrategyOpId;
    		delete $scope.model.cloudBackupStrategyOpName;
		}
		configEntrustor(0);
	};
	
	//回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.entrust();
		}
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
	// 取消委托权限
	$scope.canEntrust = function () {
		var modalInstance = UtilService.confirm($translate.instant('entrust.cancelEntrustTitle'),$translate.instant('operConfirm'));
		modalInstance.result.then(function (selectedItem) {
			configEntrustor(1);
		}, function () {
			
		});
	};
	
	var configEntrustor = function(type) {
		var waitModal = UtilService.wait();
		var param = {
			opId : null,
			type : type,
			allEntrustId : $scope.model.mandataryOpId,
			vmEntrustId : $scope.model.vmWorkFLowOpId,
			diskEntrustId : $scope.model.cloudDiskOpId,
			userEntrustId : $scope.model.userRegisterOpId,
			backupEntrustId : $scope.model.cloudBackupStrategyOpId
		};
		
		$http.put('workflow/configEntrustor', param)
		.success(function(result) {
			waitModal.dismiss();
			UtilService.handleResult(result);
			if (result.success == true) {
				$modalInstance.dismiss('success');
			}
		}).error(function(response, code, headers, config) {
			waitModal.dismiss();
			UtilService.handleError(code);
		});
	};
	
	// 选择操作员
	$scope.selectSingleOperator = function(type) {
		var param = {enable:1};
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingleOperator.html',
			backdrop:"static",
			controller:"SelectSingleOperatorCtrl",
			resolve:{
				param : function(){
					return param;
				}
			}
		});
		modalInstance.result.then(function(selectItem){
			if (angular.isDefined(selectItem) && selectItem!="cancel") {
				if (type == 'vmWorkFLow') {
					$scope.model.vmWorkFLowOpId = selectItem[0].id;
					$scope.model.vmWorkFLowOpName = selectItem[0].userName;
				} else if (type == 'cloudDisk') {
					$scope.model.cloudDiskOpId = selectItem[0].id;
					$scope.model.cloudDiskOpName = selectItem[0].userName;
				} else if (type == 'userRegister') {
					$scope.model.userRegisterOpId = selectItem[0].id;
					$scope.model.userRegisterkOpName = selectItem[0].userName;
				} else if (type == 'cloudBackupStrategy') {
					$scope.model.cloudBackupStrategyOpId = selectItem[0].id;
					$scope.model.cloudBackupStrategyOpName = selectItem[0].userName;
				}  else if (type == 'mandatary') {
					$scope.model.mandataryOpId = selectItem[0].id;
					$scope.model.mandataryOpName = selectItem[0].userName;
				}
			}
		},function(reason){
		});
	};
	
	$scope.clearOperator = function(type) {
		if (type == 'vmWorkFLow') {
			delete $scope.model.vmWorkFLowOpName;
		} else if (type == 'cloudDisk') {
			delete $scope.model.cloudDiskOpName;
		} else if (type == 'userRegister') {
			delete $scope.model.userRegisterkOpName;
		} else if (type == 'cloudBackupStrategy') {
			delete $scope.model.cloudBackupStrategyOpName;
		}
	};
	
	$scope.history = function() {
		var modalInstance=$modal.open({
			templateUrl: 'html/modal/workflow/entrustHistory.html',
            controller: 'entrustHistoryCtrl',
			backdrop:"static"
		});
	};
});

//性能监控
routeApp.controller('PerformanceMonitorCtrl', function($compile, $modal,$scope, $state, $timeout, $rootScope,$translate,$http, UtilService, definedPageService, EchartService){
	// 加载数据
	var loadData = function () {
		$http({
            method : 'GET',
            url    : 'cloudMonitor/getPerformanceMonitor'
        }).success(function(result) {
        	var html = "";
        	if (!isEmpty(result)) {
        		for (var i = 0 ; i < result.length ; i++) {
        			var id = result[i].id;
    				var name = result[i].nodeName;
    				var str = name;
    				if (name.length > 12) {
    					str = name.substring(0, 12) + "...";
    				}
    				var editStr = $translate.instant("cloudMonitor.edit");
    				var delStr = $translate.instant("cloudMonitor.delete");
    				html += "<div class=\"dashboard-box\" data-id=\"" + id +"\" data-name=\"" + name + "\">";
    				html += "<div class=\"monitorDel del\" has-permission=\"REPORT_CUSTOMMONITOR_MANAGE\"><span class=\"fa fa-cog\" custom-title=\"" + editStr  + "\"></span><span class=\"fa fa-times\" custom-title=\"" + delStr  + "\"></span></div>";
    				html += "<span class=\"custom-picture Icon_view_monitor Icon_common_display\" ></span><span class=\"box-title\" custom-title=\"" + name + "\">" + str + "</span></div>";
        		}
        	}
        	var addMonitor = $translate.instant("cloudMonitor.addMonitor");
        	html += "<div><div class=\"dashboard-box\" id=\"addNode\" has-permission=\"REPORT_CUSTOMMONITOR_MANAGE\"><span class=\"custom-picture Icon_add Icon_common_display\"></span>";
    		html += "<span class=\"box-title\" >" + addMonitor + "</span></div></div>";    	
        	    	
        	$(".viewflow").html($compile(html)($scope));
        	$(".custom-picture").click(function(){  
        		var dataid = $(this).parents(".dashboard-box").attr("data-id");
        		var dataName = $(this).parents(".dashboard-box").attr("data-name");
        		if (typeof(dataid) != 'undefined') {
        			selectTreeNode($scope, 'main.viewPage' , 'performance_monitor_node', {id:dataid, name:dataName}, dataid, 'onNodeParamStateGo');
        		}
        	}); 
        	$(".box-title").click(function(){  
        		var dataid = $(this).parents(".dashboard-box").attr("data-id");
        		var dataName = $(this).parents(".dashboard-box").attr("data-name");
        		if (typeof(dataid) != 'undefined') {
        			selectTreeNode($scope, 'main.viewPage' , 'performance_monitor_node', {id:dataid, name:dataName}, dataid, 'onNodeParamStateGo');
        		}
        	});

        	$("#addNode").click(function(){ 
        		// 增加监控面板
        		definedPageService.openAddMonitorNode();
        	}); 

        	$(".fa-cog").click(function(){  
        		var dataid = $(this).parents(".dashboard-box").attr("data-id");
        		// 修改监控面板
        		definedPageService.openEidtMonitorNode(dataid);
        	}); 

        	$(".fa-times").click(function(){  
        		var dataid = $(this).parents(".dashboard-box").attr("data-id");
        		var dataName = $(this).parents(".dashboard-box").attr("data-name");
        		definedPageService.openDeleteMonitorNode(dataid, dataName);
        	}); 
        }).error(function(response, code, headers, config) {
        	
    	});
		
	};
	loadData();
	
	
	$scope.$on('onRefreshPerformanceMonitor', function(event, msg) {
		loadData();
    });
});
//增加监控面板
routeApp.controller('addMonitorNodeCtrl',function($rootScope,$scope, $http, $modal, $translate,$modalInstance, $timeout, UtilService, HttpService, dataid, EchartService) {
	$scope.model = {};
	$scope.checkNameParam = {};//重名检查需要的参数
	$scope.isAdd = true;
	if(dataid != null) {
		$scope.checkNameParam.id = dataid;
		$timeout(
			function(){
				$('h4').html($translate.instant("cloudMonitor.modifyMonitor"));
			}
		);
		$scope.isAdd = false;
		$http({
	        method : 'GET',
	        url    : 'cloudMonitor/definedMonitor',
	        params : {id:dataid}
	    }).success(function(result) {
	    	if (result.success) {
	    		$scope.model.monitorNodeName = result.data.nodeName;
	    	}
	    }).error(function(response, code, headers, config) {
	    	
		});
	}
	
	$scope.ok = function () {
		if(dataid != null) {
			HttpService.put('cloudMonitor/definedMonitor/modify', {nodeName:$scope.model.monitorNodeName, id:dataid}, $modalInstance);
		} else {
			HttpService.post('cloudMonitor/definedMonitor/add', {nodeName:$scope.model.monitorNodeName}, $modalInstance);
		
		}
	};
	
	// 回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});
// 概览
routeApp.controller('DashboardCtrl', function($translate, $timeout, $compile,$modal, $scope, $state, $timeout, $http,
		$rootScope, UtilService, EchartService){
	$('#dashboardExpandPanel').focus();
	
	$scope.keydown = function(ev) {
		if (ev.keyCode == 27 && $rootScope.expand == 1) {
			$state.go('main.overview');
			$rootScope.expand = 0;
        }	
	};
	
	
	if(!angular.isDefined($rootScope.expand)) {
		$rootScope.expand = 0; 
	}
	
	if ($rootScope.expand == 1) {
		$('#expand').hide();
		$('#entrust').hide();
	} else {
		$('#expand').show();
		$('#entrust').show();
	}

	
	$('#expand').on("click", function() {
		$state.go('overview');
	});
	
	var refreshNum = function(){
		//概览 待处理电子流
		$http({
	        method : 'GET',
	        url    : 'dashboard/getWorkFlowNum'
	    }).success(function(result) {
	    	$("#vmworkFlowTotal").text(result.vmworkFlowTotal);
	    	$("#cloudDiskTotal").text(result.cloudDiskTotal);
	    	$("#registerUserWorkflowTotal").text(result.registerUserWorkflowTotal);
	    	$("#backStrategyTotal").text(result.backStrategyTotal);
	    }).error(function(response, code, headers, config) {
	    	
		});
		//概览 云工单
		$http({
	        method : 'GET',
	        url    : 'dashboard/getWorkOrderNum'
	    }).success(function(result) {
	    	$("#workOrderTotal").text(result.workOrderNum);
	    }).error(function(response, code, headers, config) {
	    	
		});
	}
	refreshNum();
	//定时器开启定时查询
	var timer = setInterval(refreshNum, $scope.cycle);
	
	var vmCircle;
	var countUserPic;
	var countCpuPic;
	var countMemoryPic;
	var countStoragePic;
	var countVmPic;
	var timerOrg;
	var timerPool;
	var noDataText = $translate.instant('common.noData');
	$http({
        method : 'GET',
        url    : 'dashboard/getOrgInfo'
    }).success(function(result) {
	   if (!isEmpty(result) && result.length > 0) {
		   $('#orgInfo').attr("style", "display: block;");
		   var items = "";
		   var orgMain = '<ul id="org_carousel" class="elastislide-list"> </ul>';
		   $('.orgElasti').html(orgMain);
		   for ( var i = 0; i < result.length; i++) {
			   items += '<li>';
			   items += '<a class="box org" style="width: 130px; height: 130px;" >';
			   items += '<span class="custom-picture" style="width: 80px; height: 80px; opacity: 0.7;" custom-title="' + $translate.instant('dashboard.orgTooltip') + '"> ';
			   items += '<img src="images/Icon_organize.svg">';
			   var str = result[i].name;
			   if (str.length > 12) {
				   str = str.substring(0, 12) + "...";
			   }
			   if (result[i].isOver == 1) {
				   items += '</span><span class="box-title" custom-title = "' + result[i].name +  '" id =org' + result[i].id + ' dataId = ' + result[i].id +' name="' + result[i].name + '" style="background-color:#FF6161;">' + str;
			   } else {
				   items += '</span><span class="box-title" custom-title = "' + result[i].name + '" id =org' + result[i].id + ' dataId = ' + result[i].id +  ' name="' + result[i].name + '">' + str;
			   }
			   items += '</span>';
			   items += '</a></li>';
		   }
		   $('#org_carousel').html($compile(items)($scope));
		   $('#org_carousel').elastislide();
		   $('.box.org').click(function(){
			   if (typeof(vmCircle) != 'undefined') {
				   vmCircle.dispose();
				   vmCircle = echarts.init(document.getElementById("vmCircle"));
			   } else {
				   vmCircle = echarts.init(document.getElementById("vmCircle"));
			   }
			   if (typeof(countUserPic) != 'undefined') {
				   countUserPic.dispose();
				   countUserPic = echarts.init(document.getElementById("countUserPic"));
			   } else {
				   countUserPic = echarts.init(document.getElementById("countUserPic"));
			   }
			   if (typeof(countCpuPic) != 'undefined') {
				   countCpuPic.dispose();
				   countCpuPic = echarts.init(document.getElementById("countCpuPic"));
			   } else {
				   countCpuPic = echarts.init(document.getElementById("countCpuPic"));
			   }
			   if (typeof(countMemoryPic) != 'undefined') {
				   countMemoryPic.dispose();
				   countMemoryPic = echarts.init(document.getElementById("countMemoryPic"));
			   } else {
				   countMemoryPic = echarts.init(document.getElementById("countMemoryPic"));
			   }
			   if (typeof(countStoragePic) != 'undefined') {
				   countStoragePic.dispose();
				   countStoragePic = echarts.init(document.getElementById("countStoragePic"));
			   } else {
				   countStoragePic = echarts.init(document.getElementById("countStoragePic"));
			   }
			   if (typeof(countVmPic) != 'undefined') {
				   countVmPic.dispose();
				   countVmPic = echarts.init(document.getElementById("countVmPic"));
			   } else {
				   countVmPic = echarts.init(document.getElementById("countVmPic"));
			   }
			   
			   var id = $(this).children(".box-title").attr("dataId");
			   var name = $(this).children(".box-title").attr("name");
			   var params = {};
			   params.id = id;
			   params.name = name;
			   var forwardvm = function () {
				   $state.go('main.org.vm', params);
			   }
			   var forwardUser = function () {
				   $state.go('main.org.user', params);
			   }
			   
			   var refreshOverview = function(){
				   //获取虚拟机状态
				   EchartService.getVmStatus("dashboard/vmStatus?orgId=" + id , vmCircle, forwardvm);
				   // 用户数统计
				   EchartService.getUserStatus("dashboard/userStatus?orgId=" + id , countUserPic, forwardUser);
				   //CPU/内存统计
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countCpuPic, "orgCpu","orgCpuCur","cpuUtilRate",0);
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countMemoryPic, "orgMem","orgMemCur","memUtilRate",1);
				   //存储/虚拟机统计
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countStoragePic, "orgStorage", "orgStorageCur", "storageUtilRate",2);
				   EchartService.getMaxAndCountRate("dashboard/vmStatus?orgId=" + id , countVmPic, "orgVmCount", "orgVmCur", "vmUtilRate", 3);
			   }
			   refreshOverview();
			   $("#orgName").text(name);
			   $('.box.org').attr("class", "box org");
			   $(this).attr("class", "box org active");
			   clearInterval(timerOrg);
			   timerOrg = null;
			   timerOrg = setInterval(refreshOverview, $scope.cycle);
		   });
		   $('.box.org').dblclick(function(){
			   var id = $(this).children(".box-title").attr("dataId");
			   var name = $(this).children(".box-title").attr("name");
			   var params = {};
			   params.id = id;
			   params.name = name;
			   $state.go('main.org.summary', params);
		   });
		   $("#org" + result[0].id).click();
	   } else {
		   $('#orgInfo').attr("style", "display: none;");
	   }
    }).error(function(response, code, headers, config) {
    	
	});
	
	// 资源池概览信息
	var poolCountCpuPic;
	var poolCountMemoryPic;
	var poolCountStoragePic;
	var poolParams = {};
	// CIC概要统计资源池信息
	$http({
        method : 'GET',
        url    : 'dashboard/getResPoolInfo'
    }).success(function(result) {
	   if (!isEmpty(result) && result.length > 0) {
		   $('#resPoolInfo').attr("style", "display: block;");
		   var items = "";
		   var poolMain = '<ul id="resPool_carousel" class="elastislide-list"> </ul>';
		   $('.resPoolElasti').html(poolMain);
		   for ( var i = 0; i < result.length; i++) {
			   items += '<li>';
			   items += '<a class="box respool" style="width: 130px; height: 130px;" >';
			   items += '<span class="custom-picture" style="width: 80px; height: 80px; opacity: 0.7;" custom-title="' + $translate.instant('dashboard.poolTooltip') + '"> ';
			   items += '<img src="css/img/blue/Icon_resourcePool.svg">';
			   var str = result[i].name;
			   if (str.length > 12) {
				   str = str.substring(0, 12) + "...";
			   }
			   if (result[i].isOver == 1) {
				   items += '</span><span class="box-title" custom-title = "' + result[i].name +  '" cloudType=' + result[i].cloudType + ' publicId=' + result[i].cloudId +' id =pool' + result[i].id + ' dataId = ' + result[i].id + ' name="' + result[i].name + '" style="background-color:#FF6161;">' + str;
			   } else {
				   items += '</span><span class="box-title" custom-title = "' + result[i].name + '" cloudType=' + result[i].cloudType + ' publicId=' + result[i].cloudId +' id =pool' + result[i].id + ' dataId = ' + result[i].id + ' name="' + result[i].name + '">' + str;
			   }
			   items += '</span>';
			   items += '</a></li>';
		   }
		   $('#resPool_carousel').html($compile(items)($scope));
		   $('#resPool_carousel').elastislide();
		   $('.box.respool').click(function(){
			   var id = $(this).children(".box-title").attr("dataId");
			   var name = $(this).children(".box-title").attr("name");
			   var publicId = $(this).children(".box-title").attr("publicId");
			   var cloudType = $(this).children(".box-title").attr("cloudType");
			   poolParams = {};
			   poolParams.id = id;
			   poolParams.name = name;
			   poolParams.cloudId = publicId;
			   poolParams.cloudType = cloudType;
			   poolParams.poolId = id;
			   
			   if (typeof(poolCountCpuPic) == 'undefined') {
				   poolCountCpuPic = echarts.init(document.getElementById("poolCountCpuPic"));
			   }
			   if (typeof(poolCountMemoryPic) == 'undefined') {
				   poolCountMemoryPic = echarts.init(document.getElementById("poolCountMemoryPic"));
			   }
			   if (typeof(poolCountStoragePic) == 'undefined') {
				   poolCountStoragePic = echarts.init(document.getElementById("poolCountStoragePic"));
			   }
			   
			   var refreshPool = function(){
				   //系统健康度
				   $(".health_span").css("margin-top", (Number($('#healthChart').parent("div").outerHeight(true)) - Number(35)) * Number(0.25));
				   EchartService.getHealthInfo(true, 'healthChart', 'health_span', poolParams);
				   EchartService.getRateResourceCount(poolCountCpuPic, null, poolParams, false, null, 'cpu');
				   EchartService.getRateResourceCount(poolCountMemoryPic, null, poolParams, false, null, 'memory');
				   EchartService.getRateResourceCount(poolCountStoragePic, null, poolParams, false, null, 'storage');
			   }
			   $("#poolName").text(name);
			   $('.box.respool').attr("class", "box respool");
			   $(this).attr("class", "box respool active");
			   refreshPool();
			   clearInterval(timerPool);
			   timerPool = null;
			   timerPool = setInterval(refreshPool, $scope.cycle);
		   });
		   $('.box.respool').dblclick(function(){
			   var id = $(this).children(".box-title").attr("dataId");
			   var name = $(this).children(".box-title").attr("name");
			   var publicId = $(this).children(".box-title").attr("publicId");
			   var cloudType = $(this).children(".box-title").attr("cloudType");
			   var params = {};
			   params.id = id;
			   params.name = name;
			   params.cloudId = publicId;
			   params.cloudType = cloudType;
			   $state.go('main.resourcePool.summary', params);
		   });
		   $("#pool" + result[0].id).click();
	   } else {
		   $('#resPoolInfo').attr("style", "display: none;");
	   }
    }).error(function(response, code, headers, config) {
    	
	});
	
	
	
	$scope.resizeFun = function() {
		if (vmCircle) {
			vmCircle.resize();
		}
		if (countUserPic) {
			countUserPic.resize();
		}
		if (countCpuPic) {
			countCpuPic.resize();
		}
		if (countMemoryPic) {
			countMemoryPic.resize();
		}
		if (countStoragePic) {
			countStoragePic.resize();
		}
		if (countVmPic) {
			countVmPic.resize();
		}
		
		$(".health_span").css("margin-top", (Number($('#healthChart').parent("div").outerHeight(true)) - Number(35)) * Number(0.25));
		EchartService.getHealthInfo(true, 'healthChart', 'health_span', poolParams);
		if (poolCountCpuPic) {
			poolCountCpuPic.resize();
		}
		if (poolCountMemoryPic) {
			poolCountMemoryPic.resize();
		}
		if (poolCountStoragePic) {
			poolCountStoragePic.resize();
		}
	};
	$scope.$on("onNavClick", function() {
		$scope.resizeFun();
	});
	
	$(window).on('resize', $scope.resizeFun);
	
	$scope.entrust = function () {
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/workflow/workFlowEntrust.html',
			controller: 'EntrustCtrl',
			backdrop:'static',
			resolve: {
				dataid : function() {
					return null;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
		}, function (reason) {
			if ("success" == reason) {

			}
		});
	};

	
    $scope.$on("$destroy", function() {
		//销毁echarts实例
		EchartService.dispose(vmCircle, countUserPic,countCpuPic, countMemoryPic, countStoragePic, countVmPic, poolCountCpuPic, poolCountMemoryPic, poolCountStoragePic);
		$(window).off('resize', $scope.resizeFun);
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (timerOrg) {
			clearInterval(timerOrg);
			timerOrg = null;
		}
		if (timerPool) {
			clearInterval(timerPool);
			timerPool = null;
		}
    });
});

//监控节点
routeApp.controller('viewMonitorCtrl', function($http, $compile, $modal, $scope, $state,$translate, $timeout, $rootScope, UtilService, EchartService, definedPageService){
	translate = $translate;
	$scope.monitor = {};
	$scope.monitor.id = $scope.entryId;
	$scope.monitor.name = $scope.entryName;
	
	
	$scope.$on('onMonitorNodeChange', function(envent, msg) {
		if (msg.type == 'update') {
			if ($scope.monitor.id = msg.entryId) {
				$scope.monitor.name = msg.text;
			}
		} 
	});
	
	
	$('#viewPageExpand').focus();
	
	$scope.keydown = function(ev) {
		if (ev.keyCode == 27) {
			$state.go('main.viewPage', {id: $scope.monitor.id, name:$scope.monitor.name});
			$rootScope.expand = 0;
        }	
	};
	
	var init = function () {
		var height = $(".viewflow").outerHeight(true);
		var width = $(".viewflow").outerWidth(true);
		var widthpercent = 23.5;
		var heightpercent = 47;
		if ($rootScope.expand == 1) {
			widthpercent = 24;
			heightpercent = 47.5;
		}
		gridster = $(".gridster ul").gridster({
			widget_base_dimensions : [ (Number(width) * Number(widthpercent))/ Number(100), (Number(height) * Number(heightpercent))/ Number(100) ],
			widget_margins : [ 5, 5 ],
			resize : {
				enabled : false,
				max_size : [ 4, 2 ],
				min_size : [ 1, 1 ]
			}
		}).data('gridster');
		
		$.ajax({
		   type: "GET",
		   dataType:"json",
		   url: "cloudMonitor/getView?entryId=" + $scope.monitor.id,
		   success: function(result){
			   if ($rootScope.expand == 1) {
				   $('#expand').hide();
				   $('#enter').hide();
			   } else {
				   $('#expand').show();
				   $('#enter').show();
			   }
			   $('#expand').on("click", function() {
				   $state.go('viewPage', {id: $scope.monitor.id, name:$scope.monitor.name});
			   });

			   $("#enter").bind("click", function(){
				   $state.go('main.definedPage', {id: $scope.monitor.id, name:$scope.monitor.name});
			   });
			   
			   if (!isEmpty(result) && result.length > 0) {
				   $('ul').on("mouseenter", ".viewback", function() {
					   $(this).find('.himg').find('img').show();
				   });
				   
				   $('ul').on("mouseleave", ".viewback", function() {
					   $(this).find('.himg').find('img').hide();
				   });
				   
				   $('ul').on("click", ".himg", function() {
					   // 单独放大界面
					   $state.go('expandPage', {id: $scope.monitor.id, name:$scope.monitor.name, dataId: $(this).attr("data-id")});
				   });
				   
				   for ( var i = 0; i < result.length; i++) {
					   var col = result[i].col;
					   var row = result[i].row;
					   var sizex = result[i].sizex;
					   var sizey = result[i].sizey;
					   var dataId = result[i].dataId;
					   var dataTitle = result[i].dataTitle;
					   var dataItem = result[i].dataItem;
					   var dataRelative = result[i].dataRelative;
					   var dataDisk = result[i].dataDisk;
					   var dataGraph = result[i].dataGraph;
					   
					   var params = {};
					   if (dataItem == 0) {
						   params.orgId = dataRelative;
					   } else {
						   params.poolId = dataRelative;
					   }
					   var lihtml = '<li class="viewback">' + definedPageService.getHtmlInfoByDataId(dataId, dataTitle, 'view') + '</li>'
					   gridster.add_widget($compile(lihtml)($scope), sizex, sizey, col, row);
					   getViewMonitorJs (dataId, EchartService, $scope.cycle, params, 'view');
				   }
			   }
		   }
		});
	}
	
	$timeout(function(){
		init();
	});
	
	$scope.$on("$destroy",
		function( event ) {
			// 清理定时器
			$.ajax({
	            url    : 'cloudMonitor/getViewInterval',
	        	type    : 'get', 
	        	data    : {entryId : $scope.entryId},
	        	async   : false,
	        	cache   : false,
	        	success : function(result) {
	        	if (result) {
	        		for (var i=0; i < result.length; i++ ) {
	        			if (window[result[i].dataId]) {
	        				var obj = eval(result[i].dataId);
		        			if (obj) {
		        				clearInterval(obj);
			        			obj = undefined;
		        			}
	        			}
	        			if (window[result[i].dataId + 'echart' + 'view']) {
	        				var objechart = eval(result[i].dataId + 'echart' + 'view');
		        			if (objechart) {
		        				EchartService.dispose(objechart);
			        			objechart = undefined;
		        			}
	        			}
	        		}
	        	}
		        }
	    	});
		}
	);
});

//单独节点放大
routeApp.controller('expandPageCtrl', function($http, $compile, $modal, $scope, $state, $timeout, $rootScope, UtilService, EchartService, definedPageService){
	$scope.monitor = {};
	$scope.monitor.id = $scope.entryId;
	$scope.monitor.dataId = $scope.dataId;
	$scope.monitor.name = $scope.entryName;
	
	$('#expandPage').focus();
	
	$scope.keydown = function(ev) {
		if (ev.keyCode == 27) {
			$state.go('main.viewPage', {id: $scope.monitor.id, name:$scope.monitor.name});
			$rootScope.expand = 0;
        }	
	};
	// 加载数据
	$.ajax({
		   type: "GET",
		   dataType:"json",
		   url: "cloudMonitor/getView?entryId=" + $scope.monitor.id + "&dataId=" + $scope.monitor.dataId,
		   success: function(result){
			   if (!isEmpty(result) && result.length > 0) {
				   result = result[0];
				   var dataId = result.dataId;
				   var dataTitle = result.dataTitle;
				   var dataItem = result.dataItem;
				   var dataRelative = result.dataRelative;
				   var lihtml = definedPageService.getHtmlInfoByDataId(dataId, dataTitle, 'single');
				   $(".viewflow").html($compile(lihtml)($scope));
				   var params = {};
				   if (dataItem == 0) {
					   params.orgId = dataRelative;
				   } else {
					   params.poolId = dataRelative;
				   }
				   getViewMonitorJs (dataId, EchartService, $scope.cycle, params, 'expand');
			   }
			   
		   }
	});
	
	$scope.$on("$destroy",
		function( event ) {
			// 清理定时器
		    if (window[$scope.monitor.dataId]) {
		    	var obj = eval($scope.monitor.dataId);
				if (obj) {
					clearInterval(obj);
					obj = undefined;
				}
		    }
		    if (window[$scope.monitor.dataId + 'echart' + 'expand']) {
		    	var objechart = eval($scope.monitor.dataId + 'echart' + 'expand');
				if (objechart) {
					EchartService.dispose(objechart);
					objechart = undefined;
				}
		    }
		}
	);
});

//进入设计模式
routeApp.controller('definedMonitorCtrl', function($translate, $compile, $modal,$scope, $state, $timeout, $rootScope, UtilService, definedPageService, EchartService){
	$scope.monitor = {};
	$scope.monitor.id = $scope.entryId;
	$scope.monitor.name = $scope.entryName;
	var initHtml ;
	$timeout(function(){
		var height = $(".west").outerHeight(true);
		var width = $(".west").outerWidth(true) - Number(275);
		gridster = $(".gridster ul").gridster({
			widget_base_dimensions : [ (Number(width) * Number(21))/ Number(100), (Number(height) * Number(42))/ Number(100) ],
			widget_margins : [ 5, 5 ],
			helper : 'clone',
			resize : {
				enabled : true,
				max_size : [ 4, 2 ],
				min_size : [ 1, 1 ]
			},
			serialize_params: function($w, wgd) {// $w为要输出位置的网格对象（li），wgd为该网格对象的坐标对象，包括col，row，size
				return { 
					col: wgd.col, 
					row: wgd.row, 
					sizex: wgd.size_x, 
					sizey: wgd.size_y,
					dataId:$w.attr("data-id"),
					dataTitle:$w.attr("data-title"),
					dataItem:$w.attr("data-item"),
					dataRelative:$w.attr("data-relative"),
					dataDisk:$w.attr("data-disk"),
					dataGraph:$w.attr("data-graph")
				};
			}
		}).data('gridster');
		
		// 加载数据
		$.ajax({
			   type: "GET",
			   dataType:"json",
			   url: "cloudMonitor/getDefinedList?entryId=" + $scope.monitor.id,
			   success: function(result){
				   if (result.success == true) {
					   result = result.data;
					   if (!isEmpty(result) && result.length > 0) {
						   var li = "";
						   for ( var i = 0; i < result.length; i++) {
							   var col = result[i].col;
							   var row = result[i].row;
							   var sizex = result[i].sizex;
							   var sizey = result[i].sizey;
							   var dataId = result[i].dataId;
							   var dataTitle = result[i].dataTitle;
							   var dataItem = result[i].dataItem;
							   var dataRelative = result[i].dataRelative;
							   var dataDisk = result[i].dataDisk;
							   var dataGraph = result[i].dataGraph;
							   var conifg_size = null;
							   var dataIdEntity = dataId.substring(0, dataId.indexOf('_')); 
							   var class_sample = dataIdEntity + '_sample';
							   li = '<li class="'+ class_sample +'"  id="' + dataId +'" data-id="' + dataId +'" data-item="' + dataItem +'" data-relative="' + dataRelative +
							   '" data-title="' + dataTitle +'">' +
								'<div class="del"><span class="fa fa-cog" custom-title="' + $translate.instant('dashboard.configTip') + '"></span><span class="fa fa-times" custom-title="' + 
							   $translate.instant('dashboard.deleteTip') + '"></span></div><header> ' + dataTitle +'</header></li>';
							   switch (dataIdEntity)
							   {
							   case 'healthChart':
								   conifg_size = [1,1];
								   break;
							   case 'healthFlow':
								   break;
							   case 'cpuRate':
								   conifg_size = [1,1];
								   break;
							   case 'memRate':
								   conifg_size = [1,1];
								   break;
							   case 'storeRate':
								   conifg_size = [1,1];
								   break;
							   case 'cpuRateOrg':
								   conifg_size = [1,1];
								   break;
							   case 'memRateOrg':
								   conifg_size = [1,1];
								   break;
							   case 'storeRateOrg':
								   conifg_size = [1,1];
								   break;
							   case 'vmRateOrg':
								   conifg_size = [1,1];
								   break;
							   case 'warnInfo':
								   conifg_size = [1,1];
								   break;
							   case 'hoststatus':
								   conifg_size = [1,1];
								   break;
							   case 'userstatus':
								   conifg_size = [1,1];
								   break;
							   case 'risk':
								   conifg_size = [1,1];
								   break;
							   }
							   
							   if (conifg_size) {
								   gridster.add_widget($compile(li)($scope), sizex, sizey, col, row, conifg_size, conifg_size);
							   } else {
								   gridster.add_widget($compile(li)($scope), sizex, sizey, col, row);
							   }
						   }
					   }
					   var json = gridster.serialize();
					   initHtml = JSON.stringify(json);
		             } else {
		            	 UtilService.alert(result.failureMessage);
		             } 
			   }
		});
	});
	
	// 删除按钮
	$('ul').on("click", ".fa-times", function() {
		var li = $(this).parents("li");
		var dataTitle = $(this).parents("li").attr("data-title");
		var modalInstance = UtilService.confirm($translate.instant('cloudMonitor.delDefinedInfoPromot', {name:dataTitle}),$translate.instant('operConfirm'));
		modalInstance.result.then(function(){
			gridster.remove_widget(li);
			var dataid = li.attr("data-id").substring(0, li.attr("data-id").indexOf('_'));
//			$('#' + dataid).attr("style", "");
			$('#' + dataid + '_img').attr("class", "checkboximg");
		});
	});
	
	// 配置按钮
	$('ul').on("click", ".fa-cog", function() {
		var modalInstance;
		var dataid = $(this).parents("li").attr("data-id");
		var dataItem = $(this).parents("li").attr("data-item");
		var dataRelative = $(this).parents("li").attr("data-relative");
		var dataDisk = $(this).parents("li").attr("data-disk");
		var dataTitle = $(this).parents("li").attr("data-title");
		var dataGraph = $(this).parents("li").attr("data-graph");
		$scope.definedInfo = {};
		$scope.definedInfo.dataid = dataid;
		$scope.definedInfo.dataItem = dataItem;
		$scope.definedInfo.dataRelative = dataRelative;
		$scope.definedInfo.dataDisk = dataDisk;
		$scope.definedInfo.dataTitle = dataTitle;
		$scope.definedInfo.dataGraph = dataGraph;
		
		modalInstance = $modal.open({
			templateUrl: 'html/modal/cloudMonitor/operDefined.html',
			controller: 'operDefinedCtrl',
			backdrop: 'static',
			resolve: {
				entry: function(){	
					return $scope.definedInfo;
				},
				params: function(){	
					return null;
				}
			}
		});
		
		modalInstance.result.then(function (result) {
			$("#" + dataid).find('header').html(result.dataTitle);
			$("#" + dataid).attr("data-title", result.dataTitle);
			$("#" + dataid).attr("data-item", result.dataItem);
			$("#" + dataid).attr("data-relative", result.dataRelative);
			$("#" + dataid).attr("data-disk", result.dataDisk);
			$("#" + dataid).attr("data-graph", result.dataGraph);
		}, function (reason) {
			if ("success" == reason) {
				
			}
		});
	});
	
	// 弹出配置所有信息窗口
	var configAll = function (dataArray) {
		var params = {};
		var orgFlag = false;
		var poolFlag = false;
		var allFlag = false;
		if (!isEmpty(dataArray)) {
			for(var item in dataArray) {
				if (UtilService.checkPoolArray(dataArray[item])) {
					poolFlag = true;
					break;
				}
				if (UtilService.checkOrgArray(dataArray[item])) {
					orgFlag = true;
					break;
				}
				if (UtilService.checkAllArray(dataArray[item])) {
					allFlag = true;
					break;
				}
			}
		}
		params.orgFlag = orgFlag;
		params.poolFlag = poolFlag;
		params.allFlag = allFlag;
		
		var modalInstance;
		modalInstance = $modal.open({
			templateUrl: 'html/modal/cloudMonitor/operDefined.html',
			controller: 'operDefinedCtrl',
			backdrop: 'static',
			resolve: {
				entry: function(){	
					return null;
				},
				params: function(){	
					return params;
				}
			}
		});
		
		modalInstance.result.then(function (result) {
			$("li").each(function(){
				var dataItem = $(this).attr("data-item");
				var dataRelative = $(this).attr("data-relative");
				if ((dataItem == null || typeof(dataItem) == 'undefined') 
						&& (dataRelative == null || typeof(dataItem) == 'undefined')) {
					$(this).attr("data-item", result.dataItem);
					$(this).attr("data-relative", result.dataRelative);
				}
		    });
		}, function (reason) {
			if ("success" == reason) {
				
			}
		});
	}
	
	// 保存按钮
	var save = function (param) {
		var json = gridster.serialize();
        if (Number(getCount(JSON.stringify(json), 'dataId')) > 0 && 
        	(Number(getCount(JSON.stringify(json), 'dataRelative')) != Number(getCount(JSON.stringify(json), 'dataId')))) {
        	UtilService.alert($translate.instant("cloudMonitor.notdefine"));
        } else {
	   		$.ajax({
	   			   type: "PUT",
	   			   dataType:"json",
	   			   url: "cloudMonitor/saveDefinedInfo?definedInfo=" + encodeURI(encodeURI(JSON.stringify(json))) + "&entryId=" + $scope.monitor.id,
	   			   success: function(result){
	   				   if (result.success == true) {
	   					   result = result.data;
						   if (!isEmpty(result)) {
	   						   if (param == 'alert') {
	   							   initHtml = JSON.stringify(json);
	   							   UtilService.alert(result.successMsgs);
	   							   if (result.alertMsgs) {
	   								   UtilService.alert(result.alertMsgs);
	   							   }
	   							   if (result.errorMsgs) {
	   								   UtilService.alert(result.errorMsgs);
	   							   }
	   						   } else {
	   							   $state.go('main.viewPage', {id: $scope.monitor.id, name:$scope.monitor.name});
	   						   }
	   					   } 
	   				   } else {
	   					   UtilService.alert(result.failureMessage);
	   				   } 
	   			   }
	   		});
        }
	};
	
	$('#save').on("click", function() {
		save('alert');
	});
	
	
  $(".checkboximg").bind("click", function(){
	  if ($(this).attr("class") == 'checkboximg active') {
		  $(this).parent("div").find("div").attr("class", "dashboard-corner-label");
		  $(this).attr("class", "checkboximg");
	  } else {
		  $(this).parent("div").find("div").attr("class", "dashboard-corner-label active");
		  $(this).attr("class", "checkboximg active");
	  }
  });
	
	$('.checkboximg').draggable({
		axis:"x",
		opacity:0.35,
		revert:true,
		cursor:"copy",
		zIndex:9999,
		stack:".products"
	});
	$('.west').droppable({
		drop: function(event, ui) {
			var timestamp = new Date().getTime();
			var attrValue = ui.draggable[0].id;
			var haschk = false;
			var thischk = false;
			var checkNum = 0;
			var attrArray = [];
			// 修改问题单201606240362 处理选择指标项弹出框拖拽问题 add by z10350 2016.6.29
			if (!isEmpty(attrValue)) {
				if ($("#" + attrValue).attr("class").indexOf('checkboximg active') >= 0) {
					thischk = true;
				}
				attrValue = attrValue.substring(0, attrValue.indexOf("_img"));
				$(".checkboximg").each(function(){
					if ($(this).attr("class").indexOf('checkboximg active') >= 0) {
						var entity = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_img"));
						checkNum ++;
						attrArray.push(entity);
			    		haschk = true;
			    	}
			    });
				if (false == thischk &&  true == haschk) {
					// 如果复选框有选中状态&&拖拽的不是自己本身直接返回
					
				} else {
					if (false == haschk) {
						definedPageService.check_attr_addWidget(gridster, attrValue, timestamp , $scope);
						$("#" + attrValue + '_' + timestamp).find('.fa-cog').click();
					} else {
						$(".checkboximg").each(function(){
							if ($(this).attr("class").indexOf('checkboximg active') >= 0) {
								attrValue = $(this).attr("id").substring(0, $(this).attr("id").indexOf("_img"));
								definedPageService.check_attr_addWidget(gridster, attrValue , timestamp, $scope);
							}
					    });
						if (checkNum > 1) {
							if (!UtilService.checkConflict(attrArray)) {
								configAll(attrArray);
							}
						} else {
							$("#" + attrValue + '_' + timestamp).find('.fa-cog').click();
						}
					}
				}
			}
		}
	});
	
	$("#exit").bind("click", function(){
		var json = gridster.serialize();
		if (initHtml != JSON.stringify(json)) {
			var buttonParams = [];
			var buttonParamFirst = {translate : 'cloudMonitor.saveExit'};
			var buttonParamSecond = {translate : 'cloudMonitor.notSaveExit'};
			buttonParams.push(buttonParamFirst);
			buttonParams.push(buttonParamSecond);
			var modalInstance = UtilService.confirm($translate.instant('cloudMonitor.defineConfirmInfo'),$translate.instant('operConfirm'), {"width" : "400px"}, buttonParams);
			modalInstance.result.then(function (selectedItem) {
				save('unalert');
			}, function (reason) {
				if ("close" == reason) {
					$state.go('main.viewPage', {id: $scope.monitor.id, name:$scope.monitor.name});
				}
			});
		} else {
			var modalInstance = UtilService.confirm($translate.instant('cloudMonitor.exitDesignConfirmInfo'),$translate.instant('operConfirm'));
			modalInstance.result.then(function (selectedItem) {
				$state.go('main.viewPage', {id: $scope.monitor.id, name:$scope.monitor.name});
			}, function () {
			});
		}
	});
	
});


//自定义设置
routeApp.controller('operDefinedCtrl',function(entry, params, $scope, $http, $modal, $translate, $modalInstance, UtilService, HttpService, EchartService) {
    // 需关注的指向标列表数据
	$scope.model = {};
	$scope.model.isOnly = true;
	$scope.model.isUnSelect = false;
	$scope.levels = {
		options:[{value: 0, label:$translate.instant("org.org")},
		         {value: 1, label:$translate.instant("report.respool")}
	    ]
	};

	if(!isEmpty(entry)) {
		$scope.model.dataTitle = entry.dataTitle;
		var dataIdEntity = entry.dataid.substring(0, entry.dataid.indexOf('_'));
		if (UtilService.checkPoolArray(dataIdEntity)) {
			$scope.model.dataItem = 1;
			$scope.model.isUnSelect = true;
		}
		if (UtilService.checkOrgArray(dataIdEntity)) {
			$scope.model.dataItem = 0;
			$scope.model.isUnSelect = true;
		}
		if (UtilService.checkAllArray(dataIdEntity)) {
			$scope.model.dataItem = 0;
		}
		if (!isEmpty(entry.dataItem)) {
			$scope.model.dataItem = entry.dataItem;
		}
		if (entry.dataItem == 0) {
			// 根据id查询组织
			$http({
	            method : 'GET',
	            url: 'org/detail/' + entry.dataRelative,
	        }).success(function(result) {
	        	if (result.success) {
	        		$scope.model.orgId = result.data.id;
	        		$scope.orgName = result.data.name;
	        	}
	        }).error(function(response, code, headers, config) {
	        	
	    	});
		} else {
			// 根据id查询资源池
			$http({
	            method : 'GET',
	            url: 'resourcePool/query/' + entry.dataRelative,
	        }).success(function(result) {
	        	if (result.success) {
	                $scope.model.poolId = result.data.id;
					$scope.poolName = result.data.name;
	        	}
	        }).error(function(response, code, headers, config) {
	        	
	    	});
		}
	} else {
		if (params.orgFlag) {
			$scope.model.dataItem = 0;
			$scope.model.isUnSelect = true;
		} else if (params.poolFlag) {
			$scope.model.dataItem = 1;
			$scope.model.isUnSelect = true;
		} else if (params.allFlag) {
			$scope.model.dataItem = 0;
		}
		$scope.model.isOnly = false;
	}
	$scope.ok = function () {
		if (0 == $scope.model.dataItem) {
			$scope.model.dataRelative  = $scope.model.orgId;
		} else {
			$scope.model.dataRelative  = $scope.model.poolId;
		}
		$modalInstance.close($scope.model);
	};
	// 回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
	//选择组织
	$scope.selectOrg = function() {
		var resolve = {
				params: function () {return null;}
			};
			var orgInstance = UtilService.modal('html/modal/common/selectSingle.html', 'selectSingleOrganizeCtrl', resolve, '712px');
			orgInstance.result.then(function(org) {
				if (angular.isDefined(org) && org != null) {
					$scope.model.orgId = org[0].id;
					$scope.orgName = org[0].name;
				}
			}, function() {
			});
    };
	
	//选择资源池
	$scope.selectResPool = function() {
		var modalInstance=$modal.open({
			templateUrl:'html/partials/resourcePool/resPoolList.html',
			backdrop:"static",
			controller:"selectResPoolCtrl",
			width:"420px",
			resolve: {
				resourcePoolId : function() {
					return $scope.model.poolId;
				}
			}
		  });
		  modalInstance.result.then(function(selectItem){
			  if (!isEmpty(selectItem)) {
				  if ($scope.model.poolId != selectItem.id) {
					  $scope.model.poolId = selectItem.id;
					  $scope.poolName = selectItem.name;
				  }
			  }
		  },function(reason){
		  });
	};
    
    // 切换指标项时 组织或资源池选择
    $scope.$watch("model.dataItem",function(newValue,oldValue){
    	if(!isEmpty(newValue)) {
    		if (0 == newValue) {
    			$scope.model.poolId = undefined;
    			$scope.poolName = undefined;
    		} else {
    			$scope.model.orgId = undefined;
    			$scope.orgName = undefined;
    		}
    	}
    },true);
    
});


function getCount(str1,str2)
{
	var r = new RegExp(str2,"gi");
	if (str1.match(r) != null ) {
		return str1.match(r).length;
	} else {
		return 0;
	}
} 


function getViewMonitorJs (dataId, EchartService, periodMillis, params, type) {
	   var dataIdEntity = dataId.substring(0, dataId.indexOf('_'));
	   if (dataIdEntity == 'computeTrend' || dataIdEntity == 'storeTrend' || dataIdEntity == 'risk') {
		   // 重置资源池ID数组
		   var resourcePoolIdList = [];
		   if (params.poolId) {
			   // 趋势分析和风险评估需要数组参数
			   resourcePoolIdList.push(params.poolId);
			   params.id = resourcePoolIdList;
			   params.trendFlag = true;
		   }
	   }
	   var dataIdKey = dataId.substring(dataId.indexOf('_'), dataId.length); 
	   switch (dataIdEntity) 
	   {
	   case 'healthChart':
		   $(".health_span").css("margin-top", (Number($('#healthChart'+ dataIdKey).parent("li").outerHeight(true)) - Number(42)) * Number(0.23));
		   var name = 'healthChart' + dataIdKey;
		   window[name] = setInterval(function(){EchartService.getHealthInfo(false, 'healthChart' + dataIdKey, 'health_span', params)},  periodMillis );
		   EchartService.getHealthInfo(false, 'healthChart' + dataIdKey, 'health_span', params);
		   break;
	   case 'healthFlow':
		   var name = 'healthFlow' + dataIdKey;
		   /*var nameEchart = 'healthFlow' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("dashboard_healthFlow" + dataIdKey));*/
		   window[name] = setInterval(function(){EchartService.dashboard_getCvkInfo("dashboard_healthFlow" + dataIdKey, dataIdKey, type, params)}, periodMillis);
		   EchartService.dashboard_getCvkInfo("dashboard_healthFlow" + dataIdKey, dataIdKey, type, params);
		   break;
	   case 'vmRateOrg':
		   var name = 'vmRateOrg' + dataIdKey;
		   window[name] = setInterval(EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey), periodMillis );
		   EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey);
		   break;
	   case 'cpuRateOrg':
		   var name = 'cpuRateOrg' + dataIdKey;
		   window[name] = setInterval(EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey), periodMillis );
		   EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey);
		   break;
	   case 'memRateOrg':
		   var name = 'memRateOrg' + dataIdKey;
		   window[name] = setInterval(EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey), periodMillis );
		   EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey);
		   break;
	   case 'storeRateOrg':
		   var name = 'storeRateOrg' + dataIdKey;
		   window[name] = setInterval(EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey), periodMillis );
		   EchartService.getResourceCount('dashboard/vmStatus', params, dataIdKey);
		   break;
	   case 'cpuRate':
		   var name = 'cpuRate' + dataIdKey;
		   window[name] = setInterval(EchartService.getPoolResourceCount('dashboard/source', params, dataIdKey), periodMillis );
		   EchartService.getPoolResourceCount('dashboard/source', params, dataIdKey);
		   break;
	   case 'memRate':
		   var name = 'memRate' + dataIdKey;
		   window[name] = setInterval(EchartService.getPoolResourceCount('dashboard/source', params, dataIdKey), periodMillis );
		   EchartService.getPoolResourceCount('dashboard/source', params, dataIdKey);
		   break;
	   case 'storeRate':
		   var name = 'storeRate' + dataIdKey;
		   window[name] = setInterval(EchartService.getPoolResourceCount('dashboard/source', params, dataIdKey), periodMillis );
		   EchartService.getPoolResourceCount('dashboard/source', params, dataIdKey);
		   break;
	   case 'hoststatus':
		   var name = 'hoststatus' + dataIdKey;
		   var nameEchart = 'hoststatus' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("hostCircle" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.dashboard_hostStatus("dashboard/hostStatus" , eval(nameEchart), dataIdKey, params)},periodMillis );
		   EchartService.dashboard_hostStatus("dashboard/hostStatus" , eval(nameEchart), dataIdKey, params);
		   break;
	   case 'top5hostcpu':
		   var name = 'top5hostcpu' + dataIdKey;
		   var nameEchart = 'top5hostcpu' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("ringChart" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.top5Horzontal('dashboard/hostCpu', eval(nameEchart), params, null, "ringChart" + dataIdKey)}, periodMillis );
		   EchartService.top5Horzontal('dashboard/hostCpu', eval(nameEchart), params, null, "ringChart" + dataIdKey);
		   break;
	   case 'top5hostmem':
		   var name = 'top5hostmem' + dataIdKey;
		   var nameEchart = 'top5hostmem' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("barChart" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.drawTrend("barChart" + dataIdKey,'dashboard/hostMemTrend', eval(nameEchart), params, true, false, true)}, periodMillis );
		   EchartService.drawTrend("barChart" + dataIdKey,'dashboard/hostMemTrend', eval(nameEchart), params, true, false, true);
		   break;
	   case 'vmstatus':
		   var name = 'vmstatus' + dataIdKey;
		   var nameEchart = 'vmstatus' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("vmCircle" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.dashboard_vmStatus("dashboard/monitorVm" , eval(nameEchart), dataIdKey, params)}, periodMillis );
		   EchartService.dashboard_vmStatus("dashboard/monitorVm" , eval(nameEchart), dataIdKey, params);
		   break;
	   case 'top5vmcpu':
		   var name = 'top5vmcpu' + dataIdKey;
		   var nameEchart = 'top5vmcpu' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("vmringChart" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.top5Horzontal('dashboard/vmTopCpuInfo', eval(nameEchart), params, null, "vmringChart" + dataIdKey)}, periodMillis );
		   EchartService.top5Horzontal('dashboard/vmTopCpuInfo', eval(nameEchart), params, null, "vmringChart" + dataIdKey);
		   break;
	   case 'top5vmmem':
		   var name = 'top5vmmem' + dataIdKey;
		   var nameEchart = 'top5vmmem' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("vmbarChart" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.drawTrend("vmbarChart" + dataIdKey,'dashboard/vmMemTrend', eval(nameEchart), params, true, false, true)}, periodMillis);
		   EchartService.drawTrend("vmbarChart" + dataIdKey,'dashboard/vmMemTrend', eval(nameEchart), params, true, false, true);
		   break;
	   case 'userstatus':
		   var name = 'userstatus' + dataIdKey;
		   var nameEchart = 'userstatus' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("userCircle" + dataIdKey));
		   window[name] = setInterval(EchartService.dashboardUserStatus('dashboard/userStatus', eval(nameEchart), params, dataIdKey), periodMillis );
		   EchartService.dashboardUserStatus('dashboard/userStatus', eval(nameEchart), params, dataIdKey);
		   break;
	   case 'computeTrend':
		   var name = 'computeTrend' + dataIdKey;
		   var nameEchart = 'computeTrend' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("computeTrendBarChar" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.drawTrend("computeTrendBarChar" + dataIdKey,"computeTrendBarChar" + dataIdKey,'report/cpuMemTrend', eval(nameEchart), params, true, false, true)}, periodMillis);
		   EchartService.drawTrend("computeTrendBarChar" + dataIdKey,"computeTrendBarChar" + dataIdKey,'report/cpuMemTrend', eval(nameEchart), params, true, false, true);
		   break;
	   case 'storeTrend':
		   var name = 'storeTrend' + dataIdKey;
		   var nameEchart = 'storeTrend' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("storeTrendBarChar" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.drawTrend("storeTrendBarChar" + dataIdKey,'report/storageTrend', eval(nameEchart), params, true, false, true)}, periodMillis);
		   EchartService.drawTrend("storeTrendBarChar" + dataIdKey,'report/storageTrend', eval(nameEchart), params, true, false, true);
		   break;
	   case 'risk':
		   var name = 'risk' + dataIdKey;
		   var nameEchart = 'risk' + dataIdKey + 'echart' + type;
		   window[nameEchart] = echarts.init(document.getElementById("riskCircle" + dataIdKey));
		   window[name] = setInterval(function(){EchartService.dashboard_drawRisk('report/riskAssessment', eval(nameEchart), params, dataIdKey)}, periodMillis);
		   EchartService.dashboard_drawRisk('report/riskAssessment', eval(nameEchart), params, dataIdKey);
		   break;
	   }
}
