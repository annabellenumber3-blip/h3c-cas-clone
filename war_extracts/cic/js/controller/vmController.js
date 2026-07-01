/**
 * @author 10191
 * @description 虚拟机面板controller（点击左侧虚拟机树节点）.
 */ 
routeApp.controller('VmCtrl',function($scope, $state, $http, $location, $modal, $timeout, $translate,UtilService, HttpService, DomainService){
	 
	 $scope.domain = {};
	 $scope.domain.id= $scope.vmId;
	 $scope.domain.name= $scope.vmName;
	 $scope.domain.title = $scope.title;
	 $scope.domain.hostId = $scope.hostId;
	 $scope.domain.clusterId = $scope.clusterId;
	 $scope.domain.hostPoolId = $scope.hpId;
	 
	 $scope.nav = {};
	 $scope.nav.id= $scope.vmId;
	 $scope.nav.title = $scope.title;
	 $scope.nav.status = $scope.status;
	 $scope.nav.hostId = $scope.hostId;
	 $scope.nav.hostName = $scope.hostName;
	 $scope.nav.clusterId = $scope.clusterId;
	 $scope.nav.clusterName = $scope.clusterName;
	 $scope.nav.hpId = $scope.hpId;
	 $scope.nav.hpName = $scope.hpName;
	 
	 $scope.vm = DomainService.vm;
	 
//	//进入维护状态，更新按钮为不可用 201604180243
//	$scope.$on('onUpdateIntoMaintainVmButton', function(event, msg) {
//			//更新虚拟机按钮状态
//        if (msg.id == $scope.hostId) {
//        	$scope.vm.enableStart = false;
//        	$scope.vm.enablePause = false;
//        	$scope.vm.enableRestore = false;
//        	$scope.vm.enableSleep = false;
//        	$scope.vm.enableReboot = false;
//        	$scope.vm.enableShutdown = false;
//        	$scope.vm.enableClone = false;
//        	$scope.vm.enableMigrate = false;
//        	$scope.vm.enableBackup = false;
//        	$scope.vm.enableExportOvf = false;
//        	$scope.vm.enableSnapshot = false;
//			//克隆为模板
//        	$scope.vm.enableCloneTemplate = false;
//			//转换为模板
//        	$scope.vm.enableConvertTemplate = false;
//			//删除虚拟机
//			$scope.vm.enableDelete = false;
//			$scope.vm.enableEdit = false;
//			$scope.vm.enableUpgradeCastools = false;
//			$scope.vm.enableConsole = false;
//			$scope.vm.enableCreateRestorePoint = false;
//        }
//	});
//	//退出维护状态，更新按钮 201604180243
//	$scope.$on('onUpdateExitMaintainVmButton', function(event, msg) {
//			//更新虚拟机按钮状态
//        if (msg.id == $scope.hostId) {
//			$http.get('domain/'+ DomainService.vm.vmId + "/summary").success(function(result) {
//				var msg = {};
//				msg.id = DomainService.vm.vmId;
//				msg.title = result.data.title;
//				msg.status = result.data.status;
//				msg.haManage = result.data.haManage;
//				msg.haStatus = result.data.haStatus;
//				msg.haEnable = result.data.haEnable;
//				msg.hostStatus = result.data.hostStatus;
//				msg.pageHostStatus = result.data.pageHostStatus;
//				msg.protect = result.data.protect;
//				$scope.$emit('onUpdateVmButton', msg);
//			});
//        }
//	});	 
//	 
//	 
//	 $scope.$on('onUpdateNavHost', function(event, msg) {
//	     if (msg.domainId == $scope.domain.id) {
//	         $timeout(function() {
//	             $scope.nav.hostId = msg.hostId;
//	             $scope.nav.hostName = msg.hostName;
//	             $scope.domain.hostId = msg.hostId;
//	         });
//	     }
//	 });
	 $scope.$on('onUpdateVmTitle', function(event, msg) {
		//when title updated, modefiy view on vm page nav
		$timeout(function() {
			$scope.domain.title = msg.title;
			$scope.nav.title = msg.title;
			$scope.$parent.title = msg.title;
		});
	 });
//	 $scope.$on('onUpdateVmButton', function(event, msg) {
//			//更新虚拟机按钮状态
//			$timeout(function() {
//				$scope.vm = DomainService.updateVmButton(msg);
//			});
//		 });
//	 
//	 //判断虚拟机的操作是否可用
//	 $scope.judgeAvailableVm = function(haManage, haStatus) {
//		 if (haManage == 0) {
//			 //若虚拟机不被管理，直接返回true
//			 return true;
//		 } else {
//			 //若虚拟机被管理，还需判断虚拟机HA异常状态。
//			 return haStatus == null || haStatus == 0;
//		 }
//	 };
//	 //启动虚拟机
//	 $scope.startVm = function() {
//		 DomainService.startVm($scope.vmId, $scope.showTaskList);
//	 };
//	 //暂停虚拟机
//	 $scope.pauseVm =  function(){
//		 DomainService.pauseVm($scope.vmId, $scope.showTaskList);
//	 };
//	 //恢复虚拟机
//	 $scope.resumeVm = function() {
//		 DomainService.resumeVm($scope.vmId, $scope.showTaskList);
//	 };
//	 //休眠虚拟机
//	 $scope.sleepVm =  function(){
//		 DomainService.sleepVm($scope.vmId, $scope.showTaskList);
//	 };
//	 //重启虚拟机
//	 $scope.restartVm = function() {
//		 DomainService.restartVm($scope.vmId, $scope.showTaskList);
//	 };
//	 //关闭虚拟机电源
//	 $scope.closeVm =  function(){
//		 DomainService.closeVm($scope.vmId,$scope.title, $scope.showTaskList);
//	 };
//	 //关闭虚拟机
//	 $scope.shutdownVm =  function(){
//		 DomainService.shutdownVm($scope.vmId,$scope.showTaskList);
//	 };
//	 //克隆虚拟机
//	 $scope.cloneVm =  function(){
//		 var resolve = { vmId: function () {return $scope.vmId;},
//				 vmName: function () {return  $scope.vmName;},
//		 		 vmTitle: function () {return $scope.title;},
//		 		 hostId: function() {return $scope.hostId;},
//		 		 hostName: function() {return $scope.hostName;}};
//		 DomainService.cloneVm(resolve);
//	 };
//	 //迁移虚拟机
//	 $scope.migrateVm = function() {
//		 DomainService.migrateVm($scope.vmId, $scope.hostName);
//	 };
//	 //立即备份虚拟机
//	 $scope.backupVm = function() {
//		 DomainService.backupVm($scope.vmId, $scope.hostId);
//	 };
//	 //导出OVF模板
//	 $scope.exportOvf = function() {
//		 DomainService.exportOvf($scope.domain,$scope);
//	 };
//	 //快照
//	 $scope.snapshotVm =  function() {
//		 DomainService.snapshotVm($scope.domain);
//	 };
//	 
//	 //删除虚拟机
//	 $scope.deleteVm = function() {
//		 DomainService.deleteVm($scope.vmId, $scope.title);
//	 };
	 //修改虚拟机
	 $scope.editVm =  function(id, hostId){
		 DomainService.editVm($scope.vmId, $scope.cloudId);
	 };
//	 //克隆为模板
//	 $scope.cloneTemplate =  function(id){
//		 var vmId = $scope.vmId;
//		 if (angular.isNumber(id)) {
//			 vmId = id;
//		 }
//		 DomainService.cloneTemplate(vmId);
//	 };
//	 //转换为模板
//	 $scope.toTemplate =  function(id){
//		 var vmId = $scope.vmId;
//		 if (angular.isNumber(id)) {
//			 vmId = id;
//		 }
//		 DomainService.toTemplate(vmId, $scope.title);
//	 };
//	 //打开控制台
//	 $scope.openConsole =  function(id){
//		 var vmId = $scope.vmId;
//		 if (angular.isNumber(id)) {
//			 vmId = id;
//		 }
//		 DomainService.openConsole(vmId);
//	 };
//	 //升级Castools
//	 $scope.upgradeCastools = function(id) {
//	     var vmId = $scope.vmId;
//         if (angular.isNumber(id)) {
//             vmId = id;
//         }
//         DomainService.upgradeCastools(vmId, $scope.showTaskList);
//	 } 
//	//创建还原点
//	 $scope.createRestorePoint = function(id) {
//	     var vmId = $scope.vmId;
//         if (angular.isNumber(id)) {
//             vmId = id;
//         }
//         DomainService.createRestorePoint(vmId, $scope.showTaskList);
//	 } 
//
//     $scope.enter = function(ev) { 
//		 if (ev.keyCode == 13 && $scope.formData.name != null && $scope.formData.password != null) 
//		    if( !$scope.loginform.$invalid)//如果按钮置灰则不能提交
//				 $scope.processForm();
//	 };
//
//	 $scope.hostpool={};
//	 $scope.hostpool.hpId= $scope.hpId;
//	 //删除主机池
//	 $scope.delHostpool = function() {
//		 var modalInstance = UtilService.confirm($translate.instant('confirmDelhostpool'),$translate.instant('connectAllHost'));
//		 modalInstance.result.then(function (selectedItem) {
//			 HttpService.post('hostpool/deleteHostpool', $scope.hostpool);
//		 }, function () {
//		 });
//	 };
//      //刷新任务列表（操作日志）
//	 $scope.refreshTaskList = function() {
//		$scope.$broadcast(constant.onFilterOperlogList);
//	 }
//     //清理操作日志
//     $scope.clearLog = function() {
//         var modalInstance = $modal.open({
//             templateUrl: 'html/modal/common/clearLog.html',
//             controller: 'clearOperlogCtrl',
//             size:'mg',
//             backdrop: 'static'
//         });
//         modalInstance.result.then(function (selectedItem) {
//         }, function () {
//         });
//     };
//     //过滤操作日志
//     $scope.logFilter = function() {
//         var modalInstance = $modal.open({
//             templateUrl: 'html/modal/common/logFilter.html',
//             controller: 'operlogFilterCtrl',
//             backdrop: 'static',
//             size:'mg',
//             resolve: {
//            	 operlogParams: function(){
//            		 return $scope.operlogParams;
//            	 }
//             }
//         });
//         modalInstance.result.then(function (selectedItem) {
//         }, function (reason) {
//        	 if(angular.isDefined(reason) && reason != "cancel"){
//        		 $scope.operlogParams = reason;
//        	 }
//         });
//     };
});


routeApp.controller('VmPerformanceCtrl',function($scope, $state, $http, $location,$modal, $translate,UtilService, HttpService){
    // 返回虚拟机CPU趋势数据。
    $scope.cpuRateUrl = 'domain/cpuTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    // 返回虚拟机内存趋势数据。
    $scope.memRateUrl = 'domain/memoryTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
	// 返回虚拟机I/O趋势数据。
    $scope.ioUrl = 'domain/IOTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    // 返回虚拟机网络I/O趋势数据。
    $scope.netUrl = 'domain/netIOTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    
    // CPU 使用情况
    $scope.cpuUsedUrl = 'domain/useHostCpuTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    
    // 磁盘请求（IOPS）
    $scope.iopsDisks = [];
    $scope.iops = {};
    $scope.iops.currentDisk = '';
    $scope.diskIOPSUrl = 'domain/IOPSTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    
    // 磁盘IO延迟
    $scope.ioDelayDisks = [];
    $scope.ioDelay = {};
    $scope.ioDelay.currentDisk = '';
    $scope.ioDelayUrl = 'domain/diskLatencyTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    
    $scope.diskUseRateUrl = 'domain/diskRateTrend?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
    
    $scope.openMore = function(queryFld) {
        var currentDisk = undefined;
        if (queryFld == 'diskLatency') {
            currentDisk = $scope.ioDelay.currentDisk;
        } else if (queryFld == 'iops') {
            currentDisk = $scope.iops.currentDisk;
        }
        var modalInstance=$modal.open({
            templateUrl:"html/partials/vm/performanceMore.html",
            controller:"PerfMoreCtrl",
            size:"lg",
            backdrop:"static",
            resolve : {
                params : function(){
                    return {
                        isDomain : true,
                        domainId : $scope.vmId,
                        name : $scope.title,
                        queryFld : queryFld,
                        currentDisk : currentDisk,
                        cloudId : $scope.cloudId
                    };}
            }
        });
        modalInstance.result.then(function(selectedItem){
        },function(){
            
        });
    };
});

routeApp.controller('PerfMoreCtrl', function($scope, $http, $modal, $translate, $modalInstance, $filter, params, UtilService,HttpService) {
    $scope.perfData = {};
    $scope.perfData.queryFld = params.queryFld;
    $scope.perfData.cloudId = params.cloudId;
    $scope.noDataDesc = $translate.instant("common.noData2");
    $scope.title="";
    if ($scope.perfData.queryFld == 'cpu') {
        $scope.title = $translate.instant("board.cpuInfo");
    } else if ($scope.perfData.queryFld == 'mem') {
        $scope.title = $translate.instant("board.memInfo");
    } else if ($scope.perfData.queryFld == 'cpu_usage') {
        $scope.title = $translate.instant("board.cpuUsedInfo");
    } else if ($scope.perfData.queryFld == 'io') {
        $scope.title = $translate.instant("board.ioInfoTitle");
    } else if ($scope.perfData.queryFld == 'net') {
        $scope.title = $translate.instant("board.netInfoTitle");
    } else if ($scope.perfData.queryFld == 'disk') {
        $scope.title = $translate.instant("board.diskUseRate");
    } else if ($scope.perfData.queryFld == 'diskLatency') {
        $scope.title = $translate.instant("board.diskIODelay");
    } else if ($scope.perfData.queryFld == 'iops') {
        $scope.title = $translate.instant("board.diskIOPSTitle");
    }
    
    $scope.mainTitle="";
    if (params.isDomain) {
        $scope.mainTitle= $translate.instant("cluster.vm") + "--" + params.name;
        $scope.perfData.domainId = params.domainId;
        $scope.moreUrl = 'domain/queryCpuTrendMore';
        $scope.divId = "morePerfDataChart";
        if ($scope.perfData.queryFld == 'io' || $scope.perfData.queryFld == 'disk') {
            $scope.moreUrl = 'domain/queryIoPerfDataMore';
            $scope.divId = "moreIoChart";
        } else if ($scope.perfData.queryFld == 'diskLatency' || $scope.perfData.queryFld == 'iops') {
            $scope.perfData.currentDisk = params.currentDisk;
            $scope.moreUrl = 'domain/queryIoPerfDataMore';
            $scope.divId = "moreIoChart2";
        } else if ($scope.perfData.queryFld == 'net'){
            $scope.moreUrl = 'domain/queryNetPerfDataMore';
            $scope.divId = "moreNetChart";
        }
    } else {
        $scope.mainTitle= $translate.instant("cluster.host") + "--" + params.name;
        $scope.perfData.hostId = params.hostId;
        $scope.hostId = params.hostId;
        $scope.moreUrl = 'host/queryHostCpuTrendMore';
        $scope.divId = "morePerfDataChart";
        if ($scope.perfData.queryFld == 'io' || $scope.perfData.queryFld == 'disk') {
            $scope.moreUrl = 'host/queryHostIoPerfDataMore';
            $scope.divId = "moreIoChart";
        } else if ($scope.perfData.queryFld == 'diskLatency' || $scope.perfData.queryFld == 'iops') {
            $scope.perfData.currentDisk = params.currentDisk;
            $scope.moreUrl = 'host/queryHostIoPerfDataMore';
            $scope.divId = "moreIoChart2";
        } else if ($scope.perfData.queryFld == 'net'){
            $scope.moreUrl = 'host/queryHostNetPerfDataMore';
            $scope.divId = "moreNetChart";
        }
    }
    
    $scope.formatTime = function(time) {
        var month = time.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
        var hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        var minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        var seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
        return time.getFullYear() + "-" + month + "-" + date
            + " " + hours + ":" + minutes + ":" + seconds;
    }
    
    $scope.handleStartTime = function(time) {
        $scope.perfData.startTime = time;
        $scope.perfData.startTimeLong = time.getTime();
        $scope.formatStartTime = $scope.formatTime($scope.perfData.startTime);
    }
    
    $scope.initStartTime = function () {
        var initTime = new Date(new Date() - 1000*60*60);
        $scope.handleStartTime(initTime);
    }
    $scope.initStartTime();
    
    $scope.$watch("perfData.startTime",function(newValue,oldValue) {
        var d = angular.copy(newValue);
        if (d.getHours() == 23) {
            d.setMinutes(59);
            d.setSeconds(59);
        } else {
            d.setHours(d.getHours() + 1);
        }
        $scope.perfData.endTime = d;
        $scope.perfData.endTimeLong = d.getTime();
        $scope.formatEndTime = $scope.formatTime($scope.perfData.endTime);
        $scope.$broadcast('onParamsChange', $scope.perfData, $scope.divId);
    });
    
    $scope.$watch("formatStartTime", function(newValue, oldValue) {
        if (newValue == oldValue) {
            return;
        }
        var d = new Date();
        var value = newValue;
        if (angular.isDefined(value) && value != null) {
            d.setYear(parseInt(value.substring(0, 4)));
            d.setMonth(parseInt(value.substring(5, 7))-1);
            d.setDate(parseInt(value.substring(8, 10)));
            d.setHours(parseInt(value.substring(11, 13)));
            d.setMinutes(parseInt(value.substring(14, 16)));
            d.setSeconds(parseInt(value.substring(17, 19)));
            $scope.perfData.startTime = d;
            $scope.perfData.startTimeLong = d.getTime();
        }
    });
    
    $scope.preHour = function() {
        var d = angular.copy($scope.perfData.startTime);
        d.setHours(d.getHours() - 1);
        $scope.handleStartTime(d);
    }
    
    $scope.nextHour = function() {
        var d = angular.copy($scope.perfData.startTime);
        d.setHours(d.getHours() + 1);
        $scope.handleStartTime(d);
    }
    
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});

//部署CloudOs虚拟机
routeApp.controller('OrgDeployCloudOSVmCtrl', function(template,$scope, $http,$modal,$translate, $modalInstance, $timeout, GridService, UtilService, HttpService) {
	$scope.deployInfo = {};
	$scope.model = {};
	$scope.deployInfo.assignMode = 0;
	$scope.levels = {};
	$scope.mySelections = [];
    $scope.destributeWay = [{value:0,label:$translate.instant('virdesk.noDistribute')},
     		               {value:1,label:$translate.instant('virdesk.disToUser')},
     		               {value:2,label:$translate.instant('virdesk.disToUserGrp')}];
	
    $scope.stepTitles = [$translate.instant('org.baseInfo'),$translate.instant('org.assignInfo'),
                         $translate.instant('org.netInfo')];
    
	//选择用户
    $scope.selectUser=function(){
    	var param = {orgId:template.id};
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/selectUser.html',
            controller: 'SelectUserCtrl',
            resolve: {
            	params : function() {return param;},
            	url:function() {return "user/list";},
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
        	$scope.deployInfo.userNames=$scope.userNames.join(',');
        	$scope.deployInfo.userIds = $scope.model.userIds;
        }, function (reason) {
        });
    };
	
	// 选择用户分组
	$scope.selectUserGroup = function () {
		var param = {orgId:template.id};
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/common/multiselect.html',
			controller: 'SelectMulUserGroupCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {params : function() {return param;}}
		});
		modalInstance.result.then(function (selectedItems) {
		    if (angular.isDefined(selectedItems)) {
                $scope.model.userGrpIds = [];
                var names = "";
                for (var i = 0;i< selectedItems.length;i++) {
                    $scope.model.userGrpIds.push(selectedItems[i].id);
                    names += selectedItems[i].name;
                    if (i< selectedItems.length - 1) {
                        names += ","
                    }
                }
                $scope.deployInfo.groupNames = names;
                $scope.deployInfo.userGrpIds = $scope.model.userGrpIds;
            }
		}, function (reason) {
		});
	};
    //查询资源区域
	var azonesUrl = 'cloudOS/azones';
	var azonesParam = {};
	azonesParam.cloudId = template.cloudId;
	$http({
    	method: 'GET',
    	url: azonesUrl,
    	params: azonesParam
    }).success(function(result) {
    	if (angular.isArray(result) || (angular.isObject(result) && result.state == 0)) {
    		var resOpts = [];
    		var initZone = undefined;
    		for (var i = 0; i < result.data.length; i++) {
    			//var id = result.data[i].id;
    			var zone = result.data[i].zone;
    			if (i == 0) {
    				initZone = zone;
    			}
    			var resOpt = {};
    			resOpt.value = zone;
    			resOpt.label = zone;
    			resOpts.push(resOpt);
    			$timeout(function() {
    				if (initZone != undefined) {
    					$scope.model.resourceArea = initZone;
    				}
    			});
    		}

    		$scope.levels.resourceAreaOptions = resOpts;
    	}
    }).error(function(response, code, headers, config) {
        UtilService.handleError(code);
    });  
	
	//查询计算资源规格
	var flavorsResult = {};
	var flavorsParam = {};
	flavorsParam.cloudId = template.cloudId;
	flavorsParam.miniCpu = template.miniCpu;
	flavorsParam.miniMem = template.miniMem;
	flavorsParam.miniDisks = template.miniDisks;
	var destUri = 'cloudOS/flavors';
	$http({
    	method: 'GET',
    	url: destUri,
    	params: flavorsParam
    }).success(function(result) {
    	if (angular.isArray(result) || (angular.isObject(result) && result.state == 0)) {
    		flavorsResult = result;
    		var cpuOps = [];
    		var memOps = [];
    		var diskOps = [];
    		var repeatCpuCheck = [];
    		var repeatMemCheck = [];
    		var repeatDiskCheck = [];
    		for (var i = 0; i < result.data.length; i++) {
    			var vcpu = result.data[i].vcpus;
    			var mem = result.data[i].ram;
    			var sysDisk = result.data[i].disk;
    			if (repeatCpuCheck.indexOf(vcpu) == -1) {
    				if (i == 0) {
    					$scope.model.cpu = vcpu;
    					$scope.model.memory = mem;
    					$scope.model.sysDisk = sysDisk;
    				}
    				repeatCpuCheck.push(vcpu);
        			var cpuOp = {};
        			cpuOp.value = vcpu;
        			cpuOp.label = vcpu;
        			cpuOps.push(cpuOp);
    			}
    			
    			if (vcpu == $scope.model.cpu && repeatMemCheck.indexOf(mem) == -1) {
    				repeatMemCheck.push(mem);
    				var memOp = {};
    				memOp.value = mem;
    				memOp.label = mem;
    				memOps.push(memOp);
    			}
    			
    			if (vcpu == $scope.model.cpu && mem == $scope.model.memory && repeatDiskCheck.indexOf(sysDisk) == -1) {
    				repeatDiskCheck.push(sysDisk);
    				var diskOp = {};
    				diskOp.value = sysDisk;
    				diskOp.label = sysDisk;
    				diskOps.push(diskOp);
    			}
    		}
    		$scope.levels.cpuOptions = cpuOps;
    		$scope.levels.memoryOptions = memOps;
    		$scope.levels.sysDiskOptions = diskOps;
    	}
    }).error(function(response, code, headers, config) {
        UtilService.handleError(code);
    });  

    $scope.$watch("model.cpu", function(newValue, oldValue){
        if (newValue != oldValue) {
    		var memOps = [];
    		var diskOps = [];
        	var repeatMemCheck = [];
        	var repeatDiskCheck = [];
        	var memFlag = 0;
        	for (var i = 0; i < flavorsResult.data.length; i++) {
    			var vcpu = flavorsResult.data[i].vcpus;
    			var mem = flavorsResult.data[i].ram;
    			var sysDisk = flavorsResult.data[i].disk;
    			if (vcpu == newValue && repeatMemCheck.indexOf(mem) == -1) {
    				if (memFlag == 0) {
    					$scope.model.memory = mem;
    					$scope.model.sysDisk = sysDisk;
    				}
    				memFlag++;
    				repeatMemCheck.push(mem);
    				var memOp = {};
    				memOp.value = mem;
    				memOp.label = mem;
    				memOps.push(memOp);
    			}
    			if (vcpu == newValue && mem == $scope.model.memory && repeatDiskCheck.indexOf(sysDisk) == -1) {
    				repeatDiskCheck.push(sysDisk);
    				var diskOp = {};
    				diskOp.value = sysDisk;
    				diskOp.label = sysDisk;
    				diskOps.push(diskOp);
    			}
        		$scope.levels.memoryOptions = memOps;
        		$scope.levels.sysDiskOptions = diskOps;
        	}
        }
    });
	
    $scope.$watch("model.memory", function(newValue, oldValue){
        if (newValue != oldValue) {
    		var diskOps = [];
        	var repeatDiskCheck = [];
        	var diskFlag = 0;
        	for (var i = 0; i < flavorsResult.data.length; i++) {
    			var vcpu = flavorsResult.data[i].vcpus;
    			var mem = flavorsResult.data[i].ram;
    			var sysDisk = flavorsResult.data[i].disk;
    			if (vcpu == $scope.model.cpu && mem == newValue && repeatDiskCheck.indexOf(sysDisk) == -1) {
    				if (diskFlag == 0) {
    					$scope.model.sysDisk = sysDisk;
    				}
    				diskFlag++;
    				repeatDiskCheck.push(sysDisk);
    				var diskOp = {};
    				diskOp.value = sysDisk;
    				diskOp.label = sysDisk;
    				diskOps.push(diskOp);
    			}
        		$scope.levels.sysDiskOptions = diskOps;
        	}
        }
    });
    
    
    $scope.stepIndex = 1;
    //点击下一步时增加校验
    $scope.nextCallBack = {
		"1":function(){
			$scope.stepIndex = 2;
			//资源区域为空时不能点击下一步
			if ($scope.model.resourceArea == undefined) {
				return false;
			}
		    return true;
		},
		"2":function(){
			$scope.stepIndex = 3;
		    return true;
		},
		"3":function(){
		    return true;
		},
	};	
	
    
	// form之间的切换控制
	$scope.valids = {
		stepOneOver : function() {
			if ($scope.model.resourceArea == undefined) {
				return false;
			}
			if ($('#form1').val() === "true") {
				return true;
			}

			return false;
		},
		stepTwoOver : function() {
			if ($scope.model.cpu == undefined || $scope.model.memory == undefined || $scope.model.sysDisk == undefined) {
				return false;
			}
			if ($('#form2').val() === "true")
				return true;
		},
		stepThreeOver : function() {
			var selItem = $scope.gridOptions.selectedItems;
			if (selItem == null || selItem.length == 0) {
				return false;
			}
			if ($('#form2').val() === "true") {
				return true;
			}
			return false;
		}
	};
	
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    //第三步
    var url = "cloudOS/networks";
    var params = {};
    params.cloudId = template.cloudId;
    
	var netTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-if= \'row.entity[col.field] == "true"\' translate="org.isShared"></span>' +
	   '<span ng-if= \'row.entity[col.field] == "false"\' translate="org.notShared")></span></div>' ;
    
    // 网络列表。
    var netsColumns = [
               {field: 'name', displayName: $translate.instant('org.cloudOsNetName') , sortable: true, width:'30%'},
               {field: 'cidr', displayName: $translate.instant('org.netCidr') , sortable: true, width:'40%'},
               {field: 'shared', displayName: $translate.instant('org.isShare') , sortable: true, width:'30%',cellTemplate:netTemplate}
            ];
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_80, true);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_80, true);
    // 创建表格
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
            showSelectionCheckbox:false,
            i18n: $translate.instant('lang'),
            filterOptions: false,
            pagingOptions: false,
            columnDefs:netsColumns
    }
    
    $scope = GridService.grid($scope, url, params, undefined, undefined, 'cloudOsNet');
	$scope.getDataAsync();
    
	
    $scope.ok = function () {
    	
		var url = "cloudOS/deploy";
		var entryData = {};
		entryData.metadata = {};
		entryData.networks = [];
		entryData.name = $scope.model.name;
		entryData.cpuNum = $scope.model.cpu;
		entryData.memNum = $scope.model.memory;
		entryData.diskNum = $scope.model.sysDisk;
		entryData.metadata.alias = $scope.model.alias;
		entryData.metadata.description = $scope.model.description;
		entryData.imageRef = template.tmpUUid;
		entryData.imageName = template.tmpName;
		entryData.availabilityZone = $scope.model.resourceArea;
		entryData.cloudId = template.cloudId;
		entryData.orgId = template.id; 
		
		var selItem = $scope.gridOptions.selectedItems[0];
		var net = {};
		net.uuid = selItem.id;
		entryData.networks.push(net);
		
		entryData.deployInfo = $scope.deployInfo;
		
		HttpService.post(url, entryData, $modalInstance);
	};
	
});

//部署虚拟机
routeApp.controller('OrgDeployVmCtrl', function(template,$scope, $http,$modal,$translate, $modalInstance, $timeout, UtilService,HttpService) {
	$scope.flag = template.flag;
	$scope.cloudId = template.cloudId;
	$scope.title=$translate.instant("template.deploy");
    $scope.isManualDefinition = template.isManualDefinition ? true : false;
    $scope.checkNameParam = {orgId:template.orgId};// 重名检测。
    $scope.orgTemp = template.orgTemp ? true : false;
    $scope.model = {
    		id:template.id,
    		orgId:template.orgId,
    		vmTempName:template.domainName,
    		deployType:2,
    		deployMode:false
    }
    $scope.regOrGroupType=1;
    
    $scope.system = 0;
    if (!isEmpty(template.system)){
    	$scope.system = template.system;//0:Windows;1:Linux。
    }
    
    $scope.initTip = $translate.instant("virdesk.initTip");
    if($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
        $scope.initTip = $translate.instant("virdesk.vmwareInitTip");
    }
    $scope.$watch("osInfo.initType", function(newValue, oldValue){
        if (newValue == '0' && $scope.flag != constant.PUBLIC_CLOUD_VMWARE){
            $scope.initTip = $translate.instant("virdesk.initTip");
        } else if (newValue == '1' && $scope.flag != constant.PUBLIC_CLOUD_WMWARE){
            $scope.initTip = $translate.instant("virdesk.initTip2");
        }
    });
    
    $scope.advance = $translate.instant('migrateVm.showAdvance');
    //磁盘格式
    $scope.showFormat = false;
    $scope.designatedFormat = function() {
    	$scope.showFormat = !$scope.showFormat;
    	if ($scope.showFormat) {
    		var detailUrl = 'template/details';
    		var detailParam = {
    	    		vmId:template.id,
    				orgId:template.orgId
    	    };		
    		$http({
    	        method: 'GET',
    	        url: detailUrl,
    	        params: detailParam
    	    }).success(function (result) {
    			if (result.success == true) {
    				var dataArr = result.data.networks;
    				for (var i = 0; i < dataArr.length; i ++) {
    					//var data = dataArr[i];
    					dataArr[i].network = $translate.instant('addDomain.network') + (i+1);
    				}
    				$scope.myData1 = dataArr;				
    			}
    		});    		
    		
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
    		/*资源池网络策略模板删除var profileUrl = "resourcePool/resProfileByResourcePoolId/"+ $scope.resourcePoolId;
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
            		$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            		/*资源池网络策略模板删除for (var k = 0; k < $scope.profiles.length; k++){
            			if($scope.myData1[i].profileName == $scope.profiles[k].name && $scope.profiles[k].isExist) {
            				$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            				$scope.myData1[i].noProfileValue = false;
            				break;
            			}
            		}*/
            		if (typeof($scope.myData1[i].vswitchName) == "undefined") {
            			$scope.myData1[i].noVswitchValue = true;
            		}
            		/*资源池网络策略模板删除if (typeof($scope.myData1[i].netProfileName) == "undefined") {
            			$scope.myData1[i].noProfileValue = true;
            		}*/
            		}
            	}
    		
    	} else {
        	$scope.clearNetAndProfile();
    		$scope.advance = $translate.instant('migrateVm.showAdvance');
            if (angular.isDefined($scope.keyInterval)) {
                $timeout.cancel($scope.keyInterval);
            }
    	}
    };
    
    $scope.osInfo = {regOrGroupType:1,initType:'0'};
    $scope.stepTitles = [$translate.instant('org.baseInfo'),$translate.instant('org.assignInfo'),
                         $translate.instant('org.netInfo'),$translate.instant('org.submitInfo')];
    $scope.localgroupOptions = [{value:"Administrators",label:"Administrators"},{value:"Power Users",label:"Power Users"},{value:"Users",label:"Users"}];
    $scope.destributeWay = [{value:0,label:$translate.instant('virdesk.noDistribute')},
    		               {value:1,label:$translate.instant('virdesk.disToUser')},
    		               {value:2,label:$translate.instant('virdesk.disToUserGrp')}];
    $scope.memoryUnit = [{value:'MB',label:"MB"},{value:'GB',label:'GB'}];
    $scope.model.timezone = 210;
    $scope.timezones = getTimezones($translate);
    $scope.deployInfo ={};
    $scope.valids = {
            stepOneOver : function() {
                if ($('#form1').val() === "true") {
                    return true;
                }
                return false;
            },
            stepTwoOver : function() {
                if ($('#form2').val() === "true") {                	
                	return true;
                }
                return false;
            },
            stepThreeOver : function() {
                if ($('#form3').val() === "true") {
                	return true;
                }
                return false;
            },
            stepFourOver : function() {
                if ($('#form4').val() === "true" )
                    return true;
                return false;
            }
    };
    $scope.nextCallBack = {
    		"2" : function(){
    			return $scope.checkCPU();
    		}
    }
    $scope.checkCPU = function(){
    	if (!isEmpty($scope.model.cpuSocket) && !isEmpty($scope.model.cpuCore)) {    		
    		var num = $scope.model.cpuSocket * $scope.model.cpuCore;
    		if (num > constant.VM_CPU_MAX_NUM2){
    			UtilService.error($translate.instant("virdesk.cpuMax128"));
    			return false;
    		}
    		if (!isEmpty($scope.clusterMaxCpu)) {    			
    			if (num > $scope.clusterMaxCpu){
    				UtilService.error($translate.instant("virdesk.deployCpuMax",{value:$scope.clusterMaxCpu}),$translate.instant("template.deploy"));
    				return false;
    			}
    		}
    	}
		return true;
    }
    $http({
		method:'GET',
		url:'template/deployTemplateInfo',
		params:{ id:template.id, orgId:template.orgId }
	}).success(function(result) {
		$scope.deployInfo = result.data;
		if ($scope.orgTemp) {
			$scope.deployInfo.resourcePoolOptions =[];
			if ($scope.deployInfo.resourcePools.length == 0){							
		        var modalInstance = UtilService.alert($translate.instant('org.unusableResourcePool'), $translate.instant('common.opertip'), false, 'error');
		        modalInstance.result.then(function () {
		        	$scope.cancel();
		        }, function () {
		        });
			}
			if (angular.isDefined($scope.deployInfo) && angular.isDefined($scope.deployInfo.resourcePoolOptions)) {
				for (var i = 0 ; i < $scope.deployInfo.resourcePools.length; i++) {
					var resourcePool = {
							value:i,
							label:$scope.deployInfo.resourcePools[i].resourcePoolName,
							resourcePoolId:$scope.deployInfo.resourcePools[i].resourcePoolId,
							clusterId:$scope.deployInfo.resourcePools[i].clusterId,
							clusterMaxCpu:$scope.deployInfo.resourcePools[i].clusterMaxCpu,
							clusterMaxMem:$scope.deployInfo.resourcePools[i].clusterMaxMem
					}					
					$scope.deployInfo.resourcePoolOptions[i] = resourcePool;
					if (template.resourcePoolId != undefined) {
						if ($scope.deployInfo.resourcePools[i].resourcePoolId == template.resourcePoolId) {
							$scope.model.resourcePoolNum = i;
						}
					} else {
						$scope.model.resourcePoolNum = 0;
					}
				
				}
				$scope.model.cpuSocket = $scope.deployInfo.cpuSocket;
				$scope.model.cpuCore = $scope.deployInfo.cpuCore;
				$scope.model.memoryInit = $scope.deployInfo.memoryInit;
				$scope.model.memoryUnit = $scope.deployInfo.memoryUnit;
				$scope.system = $scope.deployInfo.system;
				if (isEmpty($scope.model.memoryUnit)){
					$scope.model.memoryUnit = "MB";
				}
			}
		} else {
			$scope.resourcePoolId = template.resourcePoolId;
		}
		// 设置初始化数据
		$scope.deployInfo.assignMode = 0;
		$scope.deployInfo.sysIpType=1;
	    $scope.model.network={};
		UtilService.handleResult(result);
	}).error(function(response, code, headers, config) {
		UtilService.handleError(code);
	});
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    if($scope.orgTemp){ 
	    $scope.$watch("model.resourcePoolNum", function(newValue, oldValue){
	    	var i = newValue;
	    	if (angular.isDefined(i) && newValue != oldValue){    		   			
	    		$scope.resourcePoolId = $scope.deployInfo.resourcePoolOptions[i].resourcePoolId;    		
	    		$scope.model.resourcePoolName = $scope.deployInfo.resourcePoolOptions[i].label;
	    		$scope.clusterMaxCpu = $scope.deployInfo.resourcePoolOptions[i].clusterMaxCpu;
	        	$scope.clusterMaxMem = $scope.deployInfo.resourcePoolOptions[i].clusterMaxMem;
	        	$scope.clearStorePool();
	        	if ($scope.showFormat) {
	        		$scope.designatedFormat();
	        	}
	    	}
	    });
    };
    $scope.$watch("model.memoryUnit", function(newValue, oldValue) {
    	if (newValue == 'MB'){
    		$scope.minMem = 512;
    		$scope.maxMem = $scope.clusterMaxMem;
    	} else if (newValue == 'GB'){
    		$scope.minMem = 1;
    		$scope.maxMem = UtilService.transformMBTOGB($scope.clusterMaxMem).toFixed(2);
    	}
    });
    $scope.$watch("osInfo.regOrGroupType", function(newValue, oldValue){
    	if (newValue == 1){
    		$scope.osInfo.regOrGroup = undefined;
    		$scope.osInfo.loginAccount = undefined;
    	} else {
    		$scope.osInfo.regOrGroup = "WORKGROUP";
    		if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    			$scope.osInfo.loginAccount = "Administrator";
    		}    		
    	}
    });
    $scope.ok = function () {
    	if (!$scope.checkCPU()) {
    		return;
    	}
    	//修改问题单:201701240135  计算机名和登录名相同,禁止提交.
        if ($scope.deployInfo.sysConfig == true && $scope.osInfo.loginAccount == $scope.osInfo.sysName){
            UtilService.error($translate.instant("virdesk.loginAccountSameError"), $translate.instant("template.deploy"));
            return;
        }
		var url = "domain/deploy";
		var data = $scope.model;
		data.deployMode = $scope.model.deployMode ? 1 : 0;
		if ($scope.deployInfo.sysConfig) {
			data.osInfo = $scope.osInfo;
			//修改问题单:201707200164  如果开启DHCP,则清空IP相关参数
            if ($scope.deployInfo.sysIpType == 1) {
                data.osInfo.sysIp = undefined;
                data.osInfo.sysMask = undefined;
                data.osInfo.sysGateway = undefined;
                data.osInfo.sysdns = undefined;
                data.osInfo.secondaryDns = undefined;
                data.osInfo.isBindIp = undefined;
		}
		}
		data.resourcePoolId = $scope.resourcePoolId;
		if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
			url = "vmware/deploy";
		} 
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
		if ($scope.isManualDefinition) {		
		    data.deployMode = 1;//批量部署为快速部署.
			$modalInstance.dismiss(data);
		} else {			
			HttpService.post(url, data, $modalInstance);
		}
	};
	
	//选择用户
    $scope.selectUser=function(){
    	var param = {orgId:template.orgId};
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/selectUser.html',
            controller: 'SelectUserCtrl',
            resolve: {
            	params : function() {return param;},
            	url:function() {return "user/list";},
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
        	$scope.deployInfo.userNames=$scope.userNames.join(',');
        }, function (reason) {
        });
    };
	
	// 选择用户分组
	$scope.selectUserGroup = function (){
		var params = {orgId:template.orgId};
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
		modalInstance.result.then(function (selectedItems) {
		    if (angular.isDefined(selectedItems)) {
                $scope.model.userGrpIds = [];
                var names = "";
                for (var i = 0;i< selectedItems.length;i++) {
                    $scope.model.userGrpIds[i] = selectedItems[i].id;
                    names += selectedItems[i].name;
                    if (i< selectedItems.length - 1) {
                        names += ","
                    }
                }
                $scope.deployInfo.groupNames = names;
            }
		}, function (reason) {
		});
	};
			
	// 选择存储池
	$scope.selectStorePool = function (){
		var params = {
				resourcePoolId : $scope.resourcePoolId,
				domainId : template.id
				};
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
				$scope.deployInfo.poolName = selectedItem[0].title;
				$scope.model.storagePoolName = selectedItem[0].name;
				$scope.model.storageName = selectedItem[0].title;
				$scope.model.storagePath = selectedItem[0].path;
				$scope.model.storageType = selectedItem[0].type;
			}
		},function(reason){
		});
	};
	
	$scope.clearStorePool = function (){
		$scope.deployInfo.poolName = undefined;
		$scope.model.storageName = undefined;
		$scope.model.storagePoolName = undefined;
		$scope.model.storagePath = undefined;
		$scope.model.storageType = undefined;
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
	
    $scope.$watch("osInfo.regOrGroupType", function(newValue, oldValue){
    	if (newValue == 1){
    		$scope.osInfo.regOrGroup = undefined;
    		$scope.osInfo.loginAccount = undefined;
    	} else {
    		$scope.osInfo.regOrGroup = "WORKGROUP";
    		if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    			$scope.osInfo.loginAccount = "Administrator";
    		}
    		
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
			}
		}, function (reason) {
		});
	};
	
	$scope.clearNetAndProfile = function (){
		$scope.myData1 = undefined;
	};
});
//////////////////////////////////////
//批量部署虚拟机
//////////////////////////////////////
routeApp.controller('OrgBatchDeployVmCtrl', function(template, deployType, $scope, $http,$modal,$translate, $modalInstance, $timeout, UtilService,HttpService) {
	$scope.flag = template.flag;
	$scope.deployInfo = {};
	$scope.entry = {};
	$scope.deployType = deployType;
	$scope.entry.deployMode = true;
	var params = { id:template.id, orgId:template.orgId };
	if ($scope.deployType == constant.VIR_DESK_DEPLOY) {
		params.id = template.vmId;
	}
	$http({
		method:'GET',
		url:'template/deployTemplateInfo',
		params:params
	}).success(function(result) {
		$scope.deployInfo = result.data;
		$scope.deployInfo.resourcePoolOptions =[];
		if ($scope.deployInfo.resourcePools.length == 0){							
	        var modalInstance = UtilService.alert($translate.instant('org.unusableResourcePool'), $translate.instant('common.opertip'), false, 'error');
	        modalInstance.result.then(function () {
	        	$scope.cancel();
	        }, function () {
	        });
		}
		if (angular.isDefined($scope.deployInfo) && angular.isDefined($scope.deployInfo.resourcePoolOptions)) {
			for (var i = 0 ; i < $scope.deployInfo.resourcePools.length; i++) {
				var resourcePool = {
						value:i,
						label:$scope.deployInfo.resourcePools[i].resourcePoolName,
						resourcePoolId:$scope.deployInfo.resourcePools[i].resourcePoolId,
						clusterId:$scope.deployInfo.resourcePools[i].clusterId,
						clusterMaxCpu:$scope.deployInfo.resourcePools[i].clusterMaxCpu,
						clusterMaxMem:$scope.deployInfo.resourcePools[i].clusterMaxMem
				}					
				$scope.deployInfo.resourcePoolOptions[i] = resourcePool;
				if ($scope.deployType == 1 && template.resourcePoolId != undefined) {
					if ($scope.deployInfo.resourcePools[i].resourcePoolId == template.resourcePoolId) {
						$scope.resourcePoolNum = i;
					}
				} else {
					$scope.resourcePoolNum = 0;
				}
			
			}
		}
		// 设置初始化数据
		$scope.deployInfo.assignMode = 0;
		UtilService.handleResult(result);
		if (!$scope.$$phase){
			$scope.$apply();
		}
	}).error(function(response, code, headers, config) {
		UtilService.handleError(code);
	});
	$scope.$watch("entry.protectModel", function(newValue, oldValue){
		if (newValue == true){
			$scope.entry.deployMode = true;
		}
	});
	
	$scope.$watch("resourcePoolNum", function(newValue, oldValue){
    	var i = newValue;
    	if (angular.isDefined(i)){
    		$scope.resourcePoolId = $scope.deployInfo.resourcePoolOptions[i].resourcePoolId;
    	}
	});
	// 表格
	var column=[{ field: 'title', displayName:$translate.instant('vm.displayName'),  width:'25%'},
	            { field: 'desc', displayName:$translate.instant('common.desc'),  width:'20%'},
	            { field: 'osInfo.loginAccount', displayName:$translate.instant('common.loginName'), width:'15%'},
	            { field: 'osInfo.sysName', displayName:$translate.instant('org.sysName'), width:'20%'},
	            { field: 'osInfo.sysIp', displayName:$translate.instant('ip'), width:'10%'},
	            { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="del(row)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div></div>'
	              }];
	$scope.gridOptions = {
		data: 'gridData',
		jqueryUITheme: false,
		jqueryUIDraggable: true,
		multiSelect: true,
		showGroupPanel: false,
		showColumnMenu: false,
		showFilter: false,
		enableCellSelection: false,
		enableCellEditOnFocus: false,
		enablePaging: false,
		showFooter: true,
		groupsCollapsedByDefault:false,
		i18n: $translate.instant('load.static.lang'),
		totalServerItems: 'totalServerItems',
		filterOptions: $scope.filterOptions,
		pagingOptions: $scope.pagingOptions,
		filterOptions: false,
		columnDefs:column,
		footerTemplate:"<div ng-show=\"showFooter\" class=\"ngFooterPanel\" ng-class=\"{'ui-widget-content': jqueryUITheme, 'ui-corner-bottom': jqueryUITheme}\" ng-style=\"footerStyle()\">\r" +
	    			   "\n" +
					   "    <div class=\"ngTotalSelectContainer\" >\r" +
					   "\n" +
					   "        <div class=\"ngFooterTotalItems\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\" >\r" +
					   "\n" +
					   "            <span class=\"ngLabel\" style='font-size:12px;'>{{i18n.ngTotalNum}}{{maxRows()}}{{i18n.ngTotalNumEndLabel}}</span>\r" +
					   "\n" +
					   "        </div>\r" +
					   "\n" +
					   "    </div>\r" +
					   "\n" +
					   "</div>\r"
	};
	$scope.gridData = [];
	$scope.del = function(row) {
	    //修改问题单:201706070682  批量部署删除导入记录每次都删除第一条问题. w10450 2017-06-09
	    if ($scope.gridData.length >= row.rowIndex) {
	        $scope.gridData.splice(row.rowIndex, 1);
	        $scope.totalServerItems = $scope.gridData.length;
	    }
	}

	// 手工定义
	$scope.manualDefinition = function (){
		template.isManualDefinition = true;
		if ($scope.deployType == constant.VIR_DESK_DEPLOY) {
			var modalInstance=$modal.open({
    			templateUrl:'html/modal/desktop/deployVm.html',
    			backdrop:'static',
    			resolve:{templateInfo : function() {return template;}},
    			size:'lg',
    			controller:'deployVmCtrl'
    		});
    		modalInstance.result.then(function(selectedItem){
    			$scope.gridData.push(selectedItem);
    			$scope.totalServerItems = $scope.gridData.length;
    		},function(reason){
    		});
		} else {
			template.resourcePoolId = $scope.resourcePoolId;
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/org/orgDeployVm.html',
				controller: 'OrgDeployVmCtrl',
				size: {width:'900px'},
				backdrop:'static',
				resolve: {template : function() {return template;}}
			});
			modalInstance.result.then(function (vmData) {}, function (vmData) {
				if (vmData != 'cancel') {				
					$scope.gridData.push(vmData);
					$scope.totalServerItems = $scope.gridData.length;
				}
			});
		}
		
	}
	// 文件导入
	$scope.inportFromFile = function (){
		template.isManualDefinition = true;
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/org/importDeployConfig.html',
			controller: 'OrgImportDeployConfigCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {template : function() {return template;},
				      deployType : function() {return $scope.deployType;}				      
					  }
		});
		modalInstance.result.then(function (vmData) {
			var errorList = new Array();
			var rightList = new Array();
//			for (var i = 0;i< vmData.length; i++) {
//				var isExistSameName = false;
//				var fileDomainName = vmData[i].domainName.toUpperCase();
//				for (var j = 0; j < $scope.gridData.length; j++) {
//					var domainName = $scope.gridData[j].domainName.toUpperCase();
//					if (domainName == fileDomainName) {
//						isExistSameName = true;
//						var data = {};
//						data.errorInfo = vmData[i].domainName;
//						errorList.push(data);
//					}
//				}
//				if (!isExistSameName) {
//					rightList.push(vmData[i]);
//				}
//			}
			if ($scope.gridData.length > 0 && ($scope.gridData.length + vmData.length) > 1000) {
				var modalInstance = UtilService.confirm($translate.instant('virdesk.virMachineExcessInfo'),$translate.instant('operConfirm'));
				modalInstance.result.then(function (selectedItem) {
					$scope.gridData.splice(0, $scope.gridData.length);
					$scope.gridData = $scope.gridData.concat(vmData);
					$scope.totalServerItems = $scope.gridData.length;
				}, function () {
				});
				return;
			}
			
			if (errorList.length > 0) {
				$scope.gridData = $scope.gridData.concat(rightList);
				$scope.totalServerItems = $scope.gridData.length;
				var modalInstance = $modal.open({
					templateUrl: 'html/modal/org/showErrorMessage.html',
					controller: 'ShowErrorCtrl',
					backdrop:'static',
					resolve: {title : function() {return $translate.instant('virdesk.virMachineNameRepetitionInfo');},
						      store : function() {return errorList;}}
				});
				modalInstance.result.then(function (selectedItem) {
				}, function () {
					  
				});
				return;
			}
				
			$scope.gridData = $scope.gridData.concat(vmData);
			$scope.totalServerItems = $scope.gridData.length;
		}, function () {
			
		});
	}
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
		var url = "domain/batchDeploy";
		var data = [];
		for (var i = 0; i < $scope.gridData.length; i ++) {
			var d = $scope.gridData[i];
			d.orgId = template.orgId;
			if ($scope.deployType == constant.ORG_DEPLOY){
				d.id = template.id;
			} else {
				d.id = template.vmId;
			}
			d.vmTempName = template.domainName;
			if (angular.isDefined(template.desktopPoolId)) {
				d.desktopPoolId = template.desktopPoolId;
			}
			if ($scope.deployType == 1 && $scope.flag != 3 && !isEmpty($scope.entry.protectModel)) {
				d.protectMode = $scope.entry.protectModel ? 1 : 0;
			}
			d.deployMode = $scope.entry.deployMode ? 1 : 0;
			d.resourcePoolId = $scope.resourcePoolId;
			data[i] = d;
		}
		if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
			url = "vmware/batchDeploy";
		}
		HttpService.post(url, data, $modalInstance, $scope.showTaskList);
//		$modalInstance.dismiss('cancel');
	};
});

routeApp.controller('OrgImportDeployConfigCtrl', function(template,deployType,$scope, $http,$modal,$translate, $modalInstance, $timeout, UtilService,HttpService) {
	$scope.model = {};
	$scope.model.separatorNum = 0;
    $scope.model.initType = 0;
    $scope.model.localgroup = "Administrators";
    $scope.enablePreview = false;
    $scope.cloumnOptions = [];// = {value:0,label:"文件中第" + (i+1) + "列"};
	// 选择框更换
    $scope.$watch('model.separatorNum', function(newVal, oldVal) {
		if ($scope.model.separatorNum != null){
			$scope.separatorStr = $scope.separatorOptions[$scope.model.separatorNum].label;
			if ($scope.fileName){
				var url = "domain/importDeploy?fileName=" + $scope.fileName + "&separator=" + $scope.model.separatorNum
		    	$http.put(url).success(function(result){
		    		if (result.success) {
		    			$scope.cloumnOptions.splice(0, $scope.cloumnOptions.length);
		    			for (var i = 0; i < result.data; i ++) {
			    			$scope.cloumnOptions[i] = {value:i,label: $translate.instant('org.fileColumn',{value:i+1})};
			    		}
			    		$scope.cloumnOptions2 = angular.copy($scope.cloumnOptions);
			    		$scope.cloumnOptions2.push({value : result.data, label:$translate.instant("user.notSelectVal")});
			    		$scope.model.colNumber = result.data;
			    		$scope.model.assignMode = 0;
	    	  		    $scope.model.sysIpType = 0;
	    	  			$scope.model.regOrGroupType = 0;
//	    	  		    $scope.model.domainNameNum = 0,
	    	  		    $scope.model.titleNum = 0;
	    	  			$scope.model.descNum = result.data;
	    	  			$scope.model.cpuSocketNum = 0;
	    	  			$scope.model.cpuCoreNum = 0;
	    	  			$scope.model.memoryInitNum = 0;
	    	  			$scope.model.memoryUnitNum = 0;
	    	  		    $scope.model.userGroupNum = 0;
	    	  			$scope.model.sysNameNum = 0;
	    	  			$scope.model.ipAddressNum = 0;
	    	  			$scope.model.submaskNum = 0;
	    	  			$scope.model.gatewayNum = result.data;
	    	  			$scope.model.sysDnsNum = result.data;
	    	  			$scope.model.secondaryDnsNum = result.data;
	    	  			$scope.model.regGroupNum = 0;
	    	  			$scope.model.loginAccountNum = 0;
	    	  			$scope.model.loginPasswordNum = 0;
	    	  			$scope.model.productKeyNum = result.data;
	    	  			$scope.enablePreview = true;
		    		} else {
		    			$scope.enablePreview = false;
    	    			$scope.fileFilePath = '';
		    		}
		      	  	UtilService.handleResult(result);
		    	}).error(function(response, code, headers, config) {
		    	  UtilService.handleError(code);
		    	});
			}
		}
	});
//	$scope.$watch('model.domainNameNum', function(newVal, oldVal) {
//		if ($scope.model.domainNameNum != null && $scope.cloumnOptions[$scope.model.domainNameNum])
//			$scope.domainNameStr = $scope.cloumnOptions[$scope.model.domainNameNum].label;
//	});
	$scope.$watch('model.titleNum', function(newVal, oldVal) {
		if ($scope.model.titleNum != null && $scope.cloumnOptions[$scope.model.titleNum])
			$scope.titleStr = $scope.cloumnOptions[$scope.model.titleNum].label;
	});
	$scope.$watch('model.descNum', function(newVal, oldVal) {
		if ($scope.model.descNum != null && $scope.model.descNum != -1 && $scope.cloumnOptions2[$scope.model.descNum])
			$scope.descStr = $scope.cloumnOptions2[$scope.model.descNum].label;
	});
	$scope.$watch('model.cpuSocketNum', function(newVal, oldVal) {
		if ($scope.model.cpuSocketNum != null && $scope.cloumnOptions[$scope.model.cpuSocketNum])
			$scope.cpuSocketStr = $scope.cloumnOptions[$scope.model.cpuSocketNum].label;
	});
	$scope.$watch('model.cpuCoreNum', function(newVal, oldVal) {
		if ($scope.model.cpuCoreNum != null && $scope.cloumnOptions[$scope.model.cpuCoreNum])
			$scope.cpuCoreStr = $scope.cloumnOptions[$scope.model.cpuCoreNum].label;
	});
	$scope.$watch('model.memoryInitNum', function(newVal, oldVal) {
		if ($scope.model.memoryInitNum != null && $scope.cloumnOptions[$scope.model.memoryInitNum])
			$scope.memoryInitStr = $scope.cloumnOptions[$scope.model.memoryInitNum].label;
	});
	$scope.$watch('model.memoryUnitNum', function(newVal, oldVal) {
		if ($scope.model.memoryUnitNum != null && $scope.cloumnOptions[$scope.model.memoryUnitNum])
			$scope.memoryUnitStr = $scope.cloumnOptions[$scope.model.memoryUnitNum].label;
	});
	$scope.$watch('model.userGroupNum', function(newVal, oldVal) {
		if ($scope.model.userGroupNum != null && $scope.cloumnOptions[$scope.model.userGroupNum])
			$scope.userGroupStr = $scope.cloumnOptions[$scope.model.userGroupNum].label;
	});
	$scope.$watch('model.sysNameNum', function(newVal, oldVal) {
		if ($scope.model.sysNameNum != null && $scope.cloumnOptions[$scope.model.sysNameNum])
			$scope.sysNameStr = $scope.cloumnOptions[$scope.model.sysNameNum].label;
	});
	$scope.$watch('model.ipAddressNum', function(newVal, oldVal) {
		if ($scope.model.ipAddressNum != null && $scope.cloumnOptions[$scope.model.ipAddressNum])
			$scope.ipAddressStr = $scope.cloumnOptions[$scope.model.ipAddressNum].label;
	});
	$scope.$watch('model.submaskNum', function(newVal, oldVal) {
		if ($scope.model.submaskNum != null && $scope.cloumnOptions[$scope.model.submaskNum])
			$scope.submaskStr = $scope.cloumnOptions[$scope.model.submaskNum].label;
	});
	$scope.$watch('model.gatewayNum', function(newVal, oldVal) {
		if ($scope.model.gatewayNum != null && $scope.model.gatewayNum != -1 && $scope.cloumnOptions2[$scope.model.gatewayNum])
			$scope.gatewayStr = $scope.cloumnOptions2[$scope.model.gatewayNum].label;
	});
	$scope.$watch('model.sysDnsNum', function(newVal, oldVal) {
		if ($scope.model.sysDnsNum != null && $scope.model.sysDnsNum != -1 && $scope.cloumnOptions2[$scope.model.sysDnsNum])
			$scope.sysDnsStr = $scope.cloumnOptions2[$scope.model.sysDnsNum].label;
	});
	$scope.$watch('model.secondaryDnsNum', function(newVal, oldVal) {
		if ($scope.model.secondaryDnsNum != null && $scope.model.secondaryDnsNum != -1 && $scope.cloumnOptions2[$scope.model.secondaryDnsNum])
			$scope.secondaryDnsStr = $scope.cloumnOptions2[$scope.model.secondaryDnsNum].label;
	});
	$scope.$watch('model.regGroupNum', function(newVal, oldVal) {
		if ($scope.model.regGroupNum != null && $scope.cloumnOptions[$scope.model.regGroupNum])
			$scope.regGroupStr = $scope.cloumnOptions[$scope.model.regGroupNum].label;
	});
	$scope.$watch('model.loginAccountNum', function(newVal, oldVal) {
		if ($scope.model.loginAccountNum != null && $scope.cloumnOptions[$scope.model.loginAccountNum])
			$scope.loginAccountStr = $scope.cloumnOptions[$scope.model.loginAccountNum].label;
	});
	$scope.$watch('model.loginPasswordNum', function(newVal, oldVal) {
		if ($scope.model.loginPasswordNum != null && $scope.cloumnOptions[$scope.model.loginPasswordNum])
			$scope.loginPasswordStr = $scope.cloumnOptions[$scope.model.loginPasswordNum].label;
	});
	$scope.$watch('model.localgroup', function(newVal, oldVal) {
		if ($scope.model.localgroup != null)
			$scope.localgroupStr = $scope.model.localgroup;
	});
	$scope.$watch('model.productKeyNum', function(newVal, oldVal) {
		if ($scope.model.productKeyNum != null && $scope.model.productKeyNum != -1 && $scope.cloumnOptions2[$scope.model.productKeyNum])
			$scope.productKeyStr = $scope.cloumnOptions2[$scope.model.productKeyNum].label;
	});
	
	$scope.vmData = [];
	$scope.system=0;
	$scope.flag = template.flag;
	$scope.deployType = deployType;
	$scope.deployInfo = {sysConfig:false};
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.goTwo = $scope.goThree = $scope.goFour = false;
    $scope.separatorOptions = [{value:0,label:$translate.instant("user.comma")},{value:1,label:$translate.instant("user.semicolon")},{value:2,label:$translate.instant("user.tabKey")},{value:3,label:$translate.instant("user.space")}];
    $scope.stepTitles = [$translate.instant("org.inputFile"),$translate.instant("baseinfo"),
                         $translate.instant("vm.cloneVmDlg.netInfo"),$translate.instant("org.sysInfo")];
    $scope.destributeWay = [{value:0,label:$translate.instant('virdesk.noDistribute')},
    		               {value:1,label:$translate.instant('virdesk.disToUser')},
    		               {value:2,label:$translate.instant('virdesk.disToUserGrp')}];
    $scope.localgroupOptions = [{value:"Administrators",label:"Administrators"},{value:"Power Users",label:"Power Users"},{value:"Users",label:"Users"}];
	
	// 获取模板信息
	var params = { id:template.id, orgId:template.orgId }
	if ($scope.deployType == constant.VIR_DESK_DEPLOY) {
		params.id = template.vmId;
	}
	$http({
		method:'GET',
		url:'template/deployTemplateInfo',
		params:params
	}).success(function(result) {
		$scope.deployInfo = result.data;
		if (angular.isDefined($scope.deployInfo)) {
			$scope.system = $scope.deployInfo.system;
		}
		if (!$scope.system){
			$scope.system = template.system;
		}
		$scope.deployInfo.sysConfig = 0;
		if (deployType == constant.VIR_DESK_DEPLOY) {
			$scope.deployInfo.sysConfig = 1;
		}
		UtilService.handleResult(result);
	}).error(function(response, code, headers, config) {
		UtilService.handleError(code);
	});
	
	
    var config = {
    		autoUploading : false, /**选择文件后是否自动上传**/
    		customered : true, /**是否自定义ui**/
    		browseFileId : "file_select_files_btn", /** 选择文件的ID, 默认: i_select_files */
    		browseFileBtn : "<div>请选择文件</div>", /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
    		dragAndDropArea: "file_stream_files_area", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
    		dragAndDropTips: "<span></span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
    		filesQueueId : "file_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
    		filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
    		messagerId : "file_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
    		multipleFiles: false, /** 多个文件一起上传, 默认: false */
    		autoUploading: true, /** 选择文件后是否自动上传, 默认: true */
    		tokenURL : "fileUpload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
    		frmUploadURL : "fileUpload/fd;", /** Flash上传的URI */
    		uploadURL : "fileUpload/domain/upload", /** HTML5上传的URI */
    		swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
    		simLimit: 1, /** 单次最大上传文件个数 */
    		extFilters: [".txt",".csv"], /** 允许的文件扩展名, 默认: [] */
    		checkFileName : false,/**对文件名检测是否允许输入特殊字符，默认为true*/
    		onSelect: function(list) {
    			$timeout(function(){$scope.fileFilePath = list[0].name;});
    		}, /** 选择文件后的响应事件 */
//    		onMaxSizeExceed: function(size, limited, name) {alert('onMaxSizeExceed')}, /** 文件大小超出的响应事件 */
//    		onFileCountExceed: function(selected, limit) {alert('onFileCountExceed')}, /** 文件数量超出的响应事件 */
    		onExtNameMismatch: function(file, filters) {
    			fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
    			$timeout(function(){$scope.fileFilePath = "";});
    		}, /** 文件的扩展名不匹配的响应事件 */
//    		onCancel : function(file) {$scope.progress = file.percent;}, /** 取消上传文件的响应事件 */
    		onComplete: function(file) {
    			$scope.stream.destroy();
    			$scope.stream = new Stream($scope.config);
    			var waitModal = UtilService.wait();
    			$scope.fileName = file.name;
    			var url = "domain/importDeploy?fileName=" + file.name + "&separator=" + $scope.model.separatorNum
    	    	$http.put(url).success(function(result){
    	    		waitModal.dismiss();
    	    		$timeout(function(){$scope.progress = 100;});
    	    		if (result.success) {
    	    			$scope.cloumnOptions.splice(0, $scope.cloumnOptions.length);
        	    		for (var i = 0; i < result.data; i ++) {
        	    			$scope.cloumnOptions[i] = {value:i,label: $translate.instant('org.fileColumn',{value:i+1})};
        	    		}
        	    		$scope.cloumnOptions2 = angular.copy($scope.cloumnOptions);
        	    		$scope.cloumnOptions2.push({value : result.data, label:$translate.instant("user.notSelectVal")});
        	    		$scope.model.colNumber = result.data;
        	    		$scope.model.assignMode = 0;
        	  		    $scope.model.sysIpType = 0;
        	  			$scope.model.regOrGroupType = 0;
//        	  		    $scope.model.domainNameNum = 0,
        	  		    $scope.model.titleNum = 0;
        	  			$scope.model.descNum = result.data;
        	  			$scope.model.cpuSocketNum = 0;
        	  			$scope.model.cpuCoreNum = 0;
        	  			$scope.model.memoryInitNum = 0;
        	  			$scope.model.memoryUnitNum = 0;
        	  		    $scope.model.userGroupNum = 0;
        	  			$scope.model.sysNameNum = 0;
        	  			$scope.model.ipAddressNum = 0;
        	  			$scope.model.submaskNum = 0;
        	  			$scope.model.gatewayNum = result.data;
        	  			$scope.model.sysDnsNum = result.data;
        	  			$scope.model.secondaryDnsNum = result.data;
        	  			$scope.model.regGroupNum = 0;
        	  			$scope.model.loginAccountNum = 0;
        	  			$scope.model.loginPasswordNum = 0;
        	  			$scope.model.productKeyNum = result.data;
        	  			$scope.enablePreview = true;
    	    		} else {
    	    			$scope.enablePreview = false;
    	    			$scope.fileFilePath = '';
    	    		}
    	      	  	UtilService.handleResult(result);
    	    	}).error(function(response, code, headers, config) {
    	      	  waitModal.dismiss();
    	    	  UtilService.handleError(code);
    	    	  $timeout(function(){$scope.progress = 100;});
    	    	});
    		}, /** 单个文件上传完毕的响应事件 */
//    		onQueueComplete: function() {alert('onQueueComplete')}, /** 所以文件上传完毕的响应事件 */
//    		onUploadError: function(status, msg) {alert('onUploadError')} /** 文件上传出错的响应事件 */
    		onUploadProgress: function(file) {
    			$timeout(function(){
    				if (file.percent < 100) {					
    					$scope.progress = file.percent;
    				}
    			});
    		},
    		onDestroy: function() {} /** 文件上传出错的响应事件 */
    	};
    $scope.preview = function() {
    	if (isEmpty($scope.fileFilePath) || !$scope.enablePreview){
    		return;
    	}
    	var resolve = {
    		separator : function(){
    			if ($scope.model.separatorNum == 0) {
    				return ",";
    			} else if ($scope.model.separatorNum == 1) {
    				return ";";
    			} else if ($scope.model.separatorNum == 2) {
    				return "tab";
    			} else if ($scope.model.separatorNum == 3) {
    				return "space";
    			}
    		},
    		colNum : function() {
    			return $scope.model.colNumber;
    		}
    	};
    	var modalInstance = UtilService.lgmodal("html/modal/org/previewVmconfig.html", 'previewVmconfigCtrl', resolve, {'width':'1000px', 'height':'500px'});
    };
    if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    	$scope.initTip = $translate.instant("virdesk.vmwareInitTip");
    }
    $scope.$watch("model.initType", function(newValue, oldValue){
    	if (newValue == '0'  && $scope.flag != constant.PUBLIC_CLOUD_VMWARE){
    		$scope.initTip = $translate.instant("virdesk.initTip");
    	} else if (newValue == '1'  && $scope.flag != constant.PUBLIC_CLOUD_VMWARE){
    		$scope.initTip = $translate.instant("virdesk.initTip2");
    	}
    });
    	
    	
    	$scope.config = config;
    	$timeout(function(){    	
        	$scope.stream = new Stream($scope.config);
        }, 1000);
    	$scope.valids = {
    			stepOneOver : function() {
    	            if ($('#form1').val() === "true")
    	                return true;
    	            return false;
    	        },
    	        stepTwoOver : function() {
    	            if ($('#form2').val() === "true" && $scope.model.titleNum != null) {
    	            	if ($scope.deployInfo.enableAdjustSetting == 1) {
    	            		if ($scope.model.cpuSocketNum != null && $scope.model.cpuCoreNum != null &&
        	            			$scope.model.memoryInitNum != null && $scope.model.memoryUnitNum != null ) {    	            			
    	            			if ($scope.model.assignMode == 1 || $scope.model.assignMode == 2) {
    	            				if ($scope.model.userGroupNum != null) {     	            					
    	            					return true;
    	            				}
    	            			} else {
    	            				return true;
    	            			}
    	            		}
    	            	} else { 
    	            		if ($scope.model.assignMode == 1 || $scope.model.assignMode == 2) {
    	            			if ($scope.model.userGroupNum != null) {    	            				
    	            				return true;
    	            			}
    	            		} else {    	            			
    	            			return true;
    	            		}
    	            	}
    	            }
    	            return false;
    	        },
	    		stepThreeOver : function() {
	    	        if ($('#form3').val() === "true") {
	    	        	return true;
	    	     	}
	    	    	return false;
	    		},
	    	  	stepFourOver : function() {
	    	       	if ($('#form4').val() === "true")
	    	        	return true;
	    	    	return false;
	    		}
    	};
    	
    $scope.nextCallBack = {
    	"1" : function(){
    		$scope.goTwo = true;
    	},
    	"2" : function(){
    		$scope.goThree = true;
    	},
    	"3" : function(){
    		$scope.goFour = true;
    	}
    }
	$scope.ok = function () {
		var data = angular.copy($scope.model);
		data.orgId = template.orgId;
		data.fileName = $scope.fileName;
		if ($scope.deployInfo.sysConfig == 0) {
			data.initType = null;
		}
		if ($scope.system != 0) {
			data.regOrGroupType = null;
		}
		if (data.descNum == $scope.model.colNumber) {
			data.descNum = null;
		}
		if (data.gatewayNum == $scope.model.colNumber) {
			data.gatewayNum = null;
		}
		if (data.sysDnsNum == $scope.model.colNumber) {
			data.sysDnsNum = null;
		}
		if (data.secondaryDnsNum == $scope.model.colNumber) {
			data.secondaryDnsNum = null;
		}
		if ($scope.deployInfo.enableAdjustSetting != 1) {
			data.cpuSocketNum = null;
			data.cpuCoreNum = null;
			data.memoryUnitNum = null;
			data.memoryInitNum = null;
		}
		if ($scope.deployInfo.sysConfig != true || $scope.model.initType != 1 || $scope.system != 0 || data.productKeyNum == $scope.model.colNumber){
			data.productKeyNum = null;
		}
		data.setBindIp = $scope.model.setBindIp == true ? 1:0;
		$http.post("domain/importDeploy", data).success(function(result) {
			if (result.state == 0) {
				UtilService.handleResult(result);
				$modalInstance.close(result.data.rightList);
			} else if (result.state == 2) {
				if (result.data && result.data.errorList) {
					var modalInstance = $modal.open({
						templateUrl: 'html/modal/org/showErrorMessage.html',
						controller: 'ShowErrorCtrl',
						backdrop:'static',
						resolve: {title : function() {return result.successMessage;},
							store : function() {return result.data.errorList;}}
					});
				} else {
					UtilService.handleResult(result);
				}
			} else {
				 UtilService.alert(result.failureMessage, $translate.instant('common.opertip'), false, 'error');
			}
		}).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		});
	};
});

routeApp.controller('previewVmconfigCtrl',function($scope, $translate, $modalInstance, separator, colNum, UtilService, GridService, $timeout) {
	var column = [];
	for (var i = 0; i < colNum; i++){
		column.push({field : "col" + i, displayName : $translate.instant("user.columni", {index:i+1}), sortable:false, width:"100px", cellTemplate:titleTemplate});
	}
	$scope.url = "domain/import/preview";
	$scope.params = {separator : separator};
	$scope = GridService.grid($scope, $scope.url, $scope.params, null, null, "previewUserListId");
	$scope.getDataAsync();
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
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
			filterOptions: false,
			pagingOptions: false,
			columnDefs:column
	};  
	$timeout(function(){
	   	 // 列总宽大于列表本身的宽度，需要横向滚动条
	     $("#previewUserListId").find("div.ngViewport").css('overflow-x', 'auto');
	});  
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
});

//快照管理
routeApp.controller('SnapshotVmCtrl', function($scope, $rootScope, $http, $translate, $timeout, domain, $modalInstance, UtilService, HttpService) {
	$scope.domain = domain;
	$scope.selectSnap = {};
	$scope.tmp = {};
	$scope.entryNodeType = domain.entryNodeType;
	$scope.$on('onClearSnapNode', function() {
		$scope.selectSnap = {};
	});
	$scope.createSnap = function () {
		var url = 'domain/basicInfo';
		var waitModal = UtilService.wait();
		$http({
			method:'GET',
			url:url,
			params:{id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId}
		}).success(function (result) {
        	waitModal.dismiss();
        	if (result.state == 0) {
        		//get domain status
        		var param = angular.copy($scope.domain);
        		if (result.data.status == 'running' || result.data.status == 'paused') {
        			param.showSnapMem = true;
        		} else {
        			param.showSnapMem = false;
        		}        		
        		var resolve = { domain: function () {return param;}};
        	    var modalInstance = UtilService.modal('html/modal/vm/createSnapshot.html', 'createSnapshotCtrl', resolve);
        	    modalInstance.result.then(function (selectedItem) {
        		}, function (reason) {
        			if (reason == 'success') {
        				//创建成功后刷新快照树
        				$scope.cbObjcet.callback();
        			}
        		});
        	}
        	UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
        	waitModal.dismiss();
        	UtilService.handleError(code);
        });
	};
	
	//show task list
	$scope.cbObjcet = {
		callback: function() {
			$rootScope.showTaskList();
		}
	};
	
	$scope.resoreSnap = function () {
		//确认操作
		var modalInstance = UtilService.confirm($translate.instant('snapshot.restoreConfirm', {'name':$scope.selectSnap.name}),$translate.instant('snapshot.restoreVm'));
		modalInstance.result.then(function (selectedItem) {
			$scope.snap = {
				domainId : domain.id,
				orgId : domain.orgId,
				cloudId : domain.cloudId,
				domainName : domain.name,
				domainTitle : domain.title,
				name : $scope.selectSnap.name
			};
			HttpService.put('domain/snapshot/restore', $scope.snap, undefined, $scope.cbObjcet);
		}, function () {
		});
	};
	$scope.deleteSnap = function () {
		//确认操作
		var modalInstance = UtilService.confirm($translate.instant('snapshot.deleteConfirm', {'name':$scope.selectSnap.name}),$translate.instant('snapshot.deleteSnap'));
		modalInstance.result.then(function (selectedItem) {
			var param = {
				domainId : domain.id,
				orgId : domain.orgId,
				cloudId : domain.cloudId,
				domainName : domain.name,
				domainTitle : domain.title,
				name : $scope.selectSnap.name
			};
			var delUri = 'domain/snapshot/del';
			HttpService.delete(delUri, param, undefined, $scope.cbObjcet);
		}, function () {
		});
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
});
//创建快照
routeApp.controller('createSnapshotCtrl',function($scope, $http, $translate, domain, $modalInstance, UtilService, HttpService) {
	$scope.snap = {
			domainId:domain.id,
			orgId:domain.orgId,
			domainTitle:domain.title, 
			cloudId:domain.cloudId
	};
	$scope.showSnapMem=domain.showSnapMem;
	if ($scope.showSnapMem == true) {
		$scope.snap.snapMem = false;
	}
	
	//修改问题单201703080467，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【虚拟机管理】【快照管理】：虚拟机快照在执行内存快照输入超大值后切换至否状态，点击确定提示错误
	$scope.$watch("snap.snapMem", function(newValue, oldValue) {
		if (newValue == 'false' && oldValue == 'true') {
			$scope.snap.snapshotTimeout = undefined;
		} else if (newValue == 'true' && oldValue == 'false') {
			$scope.snap.snapshotTimeout = 5;
		}
	});
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
	$scope.ok = function () {
		HttpService.post('domain/snapshot/create', $scope.snap, $modalInstance, $scope.showTaskList);
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});


//界面定制对话框
routeApp.controller('uicustomCtrl', function(data,$scope, $rootScope, $http, $translate,$modalInstance,$timeout, $state, UtilService,HttpService) {
  var url=uiName=""; //请求服务器的url
  if(data.type == "main.cvmResource.vm"){
      url='ui/params/virtualHostColTitle';
      uiName="virtualHostColTitle";
  }else if (data.type == 'vm.workflow') {
	  url='ui/params/VM_WORKFLOW_UI';
      uiName="VM_WORKFLOW_UI";
  }
  $scope.domainAttrs=[];
  
  $timeout(function(){
      $('#nestable').nestable().on("change",function(){
          // 更新列的显示顺序
               var doms = $(this).find(".dd-item");
               for(index = 0; index < doms.length; index++){
                      var data_id = $(doms[index]).attr('data-id');
                      $scope.domainAttrs[Number(data_id)].order = index;
//                    console.log($scope.domainAttrs[Number(data_id)].attrName+":"+$scope.domainAttrs[Number(data_id)].order);
               }
               $scope.$apply();
      });
      $('#nestable').on('mousedown','.dd-handle input',function(e){
          e.stopPropagation();
      });
      $('#nestable').on('mousedown','.dd-handle .ui-spinner',function(e){
          e.stopPropagation();
      });
      $('#nestable').on('mousedown','.dd-handle .switch-small',function(e){
          e.stopPropagation();
      });

      $scope.tempAttrs=[];
      var areawaitId=UtilService.areawait("form");
      $http({
          method:'GET',
          url:url
      }).success(function(data,status,headers,cfg){
          for(var i=0;i<data.data.length;i++){
              $scope.tempAttrs[i]={};
              $scope.tempAttrs[i].index=i;
              $scope.tempAttrs[i].id=data.data[i].id;
              $scope.tempAttrs[i].attrName=data.data[i].name;
              $scope.tempAttrs[i].order=i;
              $scope.tempAttrs[i].widthVal=data.data[i].width;
              $scope.tempAttrs[i].showFlag=true;
          }
          $scope.showColLength=$scope.tempAttrs.length;
          var params={};
          params.type='hide';
          $http({
              method:'GET',
              url:url,
              params:params
          }).success(function(data,status,headers,cfg){
              UtilService.dismissAreawait(areawaitId);
              for(var i=0;i<data.data.length;i++){
                  $scope.tempAttrs[$scope.showColLength+i]={};
                  $scope.tempAttrs[$scope.showColLength+i].index=$scope.showColLength+i;
                  $scope.tempAttrs[$scope.showColLength+i].id=data.data[i].id;
                  $scope.tempAttrs[$scope.showColLength+i].attrName= data.data[i].name;
                  $scope.tempAttrs[$scope.showColLength+i].order=$scope.showColLength+i;
                  $scope.tempAttrs[$scope.showColLength+i].widthVal=data.data[i].width;
                  $scope.tempAttrs[$scope.showColLength+i].showFlag=false;
              }
              $scope.domainAttrs=$scope.tempAttrs;
          }).error(function(response, code, headers, config) {
              UtilService.dismissAreawait(areawaitId);
              UtilService.handleError(code);
          }); 
      }).error(function(response, code, headers, config) {
          UtilService.dismissAreawait(areawaitId);
          UtilService.handleError(code);
      });
  });     
  
  $scope.ok = function () {
//  	对虚拟机列表标题数组按order进行排序【冒泡排序】
  	var i=0,j=0,objArr=$scope.domainAttrs,temp={},allHideFlag=true;
  	for(i=0;i<objArr.length;i++){
		if(objArr[i].showFlag==true){	//判断是否有显示的列，若有则设置allHideFlag为false 无true
			allHideFlag=false;
			break;
		}
	}
	if(allHideFlag){
		UtilService.alert($translate.instant('uicustomVm.uicustomVmTip'), $translate.instant('common.opertip'), false, 'error');
        return;
	}
  	for(i=0;i<objArr.length;i++){
  		 for(j=i+1;j<objArr.length;j++){
  			 if(objArr[i].order>objArr[j].order){
  				 temp=objArr[i];
  				 objArr[i]=objArr[j];
  				 objArr[j]=temp;
  			 }
  		 }
  		 
  	}
      //重新加载虚拟机列表打回调方法
      var renderVmList = function() {
          
      }
      
      var showArr=[];
      for(i=0;i<objArr.length;i++){
          if (objArr[i].showFlag == true) {
              var showItem = {};
              showItem.name=objArr[i].id;
              showItem.value=objArr[i].widthVal;
              showArr.push(showItem);
          }
      }
      HttpService.post('ui/save/' + uiName, showArr, $modalInstance, renderVmList);
      $rootScope.$broadcast(constant.onReloadVmList);
  };
  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };
});
routeApp.controller('DeleteVmCtrl',function(domain, $rootScope, $scope, $http, $translate, $modalInstance, $modal, UtilService, HttpService) {
	$scope.del = {};
	$scope.del.vmId = domain.id;
	$scope.del.title = domain.title;
	$scope.del.type = 3;
	$scope.recycleReadonly = domain.status == "unknown";
	if ($scope.recycleReadonly) {
	    $scope.del.type = 0;
	}
	
	var vmList = domain.list;
	function callback(result) {
		//直接删除数据库,不显示任务栏.
		if (result.state == 0 && result.errorCode == 1001) {
		    $rootScope.$broadcast(constant.onReloadVmList);
		} else {
		    $scope.showTaskList();
		}		
	}
	$scope.ok = function () {
	    $scope.del.isWipeVolume = $scope.del.data == '1';
	    //单个删除
	    if (angular.isDefined(domain.id)) {
	        var confirmParam = {title:$scope.del.title};
            var confirmMsg = $translate.instant('vm.confirmDelete', confirmParam);
            if ($scope.del.type == 3) {
                //移入回收站
                confirmMsg = $translate.instant('vm.confirmRecycle');
            }
            var modalInstance = UtilService.confirm(confirmMsg, $translate.instant('vm.deleteVm'));
            modalInstance.result.then(function (selectedItem) {
                var url = 'domain/delDomain';// + vmId + '/' + $scope.del.type + '?isWipeVolume=' + $scope.del.isWipeVolume;
                var delPm = {						
						id: domain.id,
						cloudId: domain.cloudId,
						orgId: domain.orgId,
						title: domain.title,
						isWipeVolume:$scope.del.isWipeVolume,
						delType: $scope.del.type
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
                        HttpService.delete(url, delPm, $modalInstance, callback);
                    },function(reason){
                    });
                } else {
                    HttpService.delete(url, delPm, $modalInstance, callback);
                }
            }, function () {
            });
	    }
	    //批量删除
	    if (angular.isArray(vmList)) {
	        var listData = [];
	         for (var i = 0; i < vmList.length; i++) {
	             var vmData = {};
	             vmData.id = vmList[i].id;
	             vmData.cloudId = vmList[i].cloudId,
	             vmData.title = vmList[i].title;
	             vmData.delType = $scope.del.type;
	             vmData.isWipeVolume = $scope.del.isWipeVolume;
	             listData.push(vmData);
	         }
	         
	         var confirmParam = {type:$translate.instant('vm.batchDelete')};
	         var confirmMsg = $translate.instant('vm.confirmBatchOperateVm', confirmParam);
	         if ($scope.del.type == 3) {
	             //移入回收站
	             confirmMsg = $translate.instant('vm.batchDeleteToRecycle');
	         }
	         var modalInstance = UtilService.confirm(confirmMsg, $translate.instant('vm.deleteVm'));
	         modalInstance.result.then(function (selectedItem) {
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
                        HttpService.put('domain/batchdelete', listData, $modalInstance, callback);
                    },function(reason){
                    });
                } else {
                    HttpService.put('domain/batchdelete', listData, $modalInstance, callback);
                }
	         }, function () {
	         });
	    }
//	    $modalInstance.close();
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

routeApp.controller('BackupVmCtrl',function(domain, $scope, $rootScope, $http,$timeout, $translate, $modalInstance, UtilService, HttpService, GridService) {
	$scope.backup ={};
	$scope.backup.type = 0;
	$scope.backup.vmId = domain.id;
	$scope.backup.title = domain.title;
	$scope.backup.backupType = 0;
	$scope.backup.backupMode = 0;
	$scope.backup.storeMode = 0;
	$scope.backup.isMd5Check = 0;
	$scope.backup.isCompression = 0;
	$scope.backup.orgId = domain.orgId;
	$scope.backup.cloudId = domain.cloudId;
	$scope.entryNodeType = domain.entryNodeType;
	$scope.checkNameParam = {
			vmId : domain.id,
			cloudId : domain.cloudId,			
			};
	$scope.tmp = {isCompression : true};
	var param = {id:domain.id, cloudId:domain.cloudId};
	$http({
		method: "GET",
		url: "domain/isExistBlock",
        params: param
	}).success(function(result){
		$scope.isExistBlock = result.data;
		//如果存在块设备，备份时默认压缩，且不能修改
		if (result.data) {
			$scope.tmp.isCompression = true;
		}
	});
	
	var url = "domain/" + domain.id + "/backupStorage?cloudId=" + domain.cloudId;
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	$scope = GridService.grid($scope, url);
//	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.getDataAsync();
	var volumeCol = [{ field: 'devName', displayName: $translate.instant('vm.devName') , sortable: true,  width:'15%',cellTemplate:titleTemplate},
	                  { field: 'type', displayName: $translate.instant('common.type'), sortable: true, width:'10%'},
	                  { field: 'driverType', displayName: $translate.instant('editDomain.format'), cellFilter:'driverType',cellTemplate:titleTemplate, sortable: true, width:'20%'},
	                  { field: 'driverCache', displayName: $translate.instant('addDomain.cacheType'), cellFilter:'driverCache',cellTemplate:titleTemplate, sortable: true, width:'20%'},
	                  { field: 'name', displayName: $translate.instant('vm.storagePath'), sortable: true, width:'20%',cellTemplate:titleTemplate}];
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
    		enablePaging: false,
    		showFooter: false,
    		searchBoxSize:'small',
//    		pagingOptions: $scope.pagingOptions2,
//    		totalServerItems: 'totalServerItems2',
    		i18n: $translate.instant('load.static.lang'),
    		columnDefs:volumeCol,    	
    		filterOptions : {
    				filterText: "",
    				useExternalFilter: true
    		},
    		afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
				var diskStr = "";
				if ($scope.mySelections.length > 0) {
					for (var i = 0; i < $scope.mySelections.length; i++) {
						diskStr += $scope.mySelections[i].devName + ",";
					}
				}
				$scope.disksConfirm = diskStr.substring(0, diskStr.length - 1); 
	        },
    		rowTemplate: doubleClickTemplate    // 双击行模板
    }; 

	
	
	
	
//	$scope.levels = {
//			options:[{value:'0',label:$translate.instant('backupVm.localDir')},
//			         {value:'1',label:$translate.instant('backupVm.remoteServer')}]
//	}
	$scope.stepTitles = [ $translate.instant('baseinfo'),
						  $translate.instant('backupVm.backupset'),
						  $translate.instant('backupVm.selectStorage')
						 ];
	$scope.stepIndex = 0;
	$scope.nextCallBack = {
			"1" :function() {
				$scope.stepIndex = 1;
			}
			
	}
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
			},
			stepThreeOver : function() {
				if ($scope.mySelections.length > 0)
					return true;
				return false;
			}

		};
	//连接测试
	$scope.connectTest = function() {
//		var testmodel = {};
//		testmodel.type = $scope.backup.type;
//		testmodel.userName = $scope.backup.userName;
//		testmodel.password = $scope.backup.password;
//		testmodel.targetAddr = $scope.backup.directory;
//		testmodel.orgId = domain.orgId;
		
		
		var testmodel = {};
		testmodel.targetAddr = $scope.backup.targetAddr;
		testmodel.vmId = $scope.backup.vmId;
		testmodel.type = $scope.backup.type;
		testmodel.userName = UtilService.encryptByDES($scope.backup.userName);
		testmodel.password = UtilService.encryptByDES($scope.backup.password);
		testmodel.directory = $scope.backup.directory;
		testmodel.cloudId = $scope.backup.cloudId;
		
		HttpService.put('cloudBackup/connectTest', testmodel);
	};
	
	//回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.ok = function () {
		if ($scope.tmp.isCompression == true) {
			$scope.backup.isCompression = 1;
		} else {
			$scope.backup.isCompression = 0;
		}
		
		$scope.backup.diskList = [];
		for (var i = 0; i < $scope.mySelections.length; i++) {
			var disk = {};
			disk.devName = $scope.mySelections[i].devName;
			disk.filePath = $scope.mySelections[i].name;
			$scope.backup.diskList.push(disk);
		}
		//修改问题单：201706220926 ，对远端服务器备份类型，做连接检查
	if ($scope.backup.storeMode == 1) {
			var waitModal = UtilService.wait();
			var testmodel = {};
			testmodel.targetAddr = $scope.backup.targetAddr;
			testmodel.vmId = $scope.backup.vmId;
			testmodel.type = $scope.backup.type;
			testmodel.userName = UtilService.encryptByDES($scope.backup.userName);
			testmodel.password = UtilService.encryptByDES($scope.backup.password);
			testmodel.directory = $scope.backup.directory;
			testmodel.cloudId = $scope.backup.cloudId;
			$http.put('cloudBackup/connectTest', testmodel)
			.success(function(result) {
				waitModal.dismiss();
				if (result.success == true) {
		// 虚拟机存在raw格式的磁盘则禁止在线备份
		$scope.backup.userName = UtilService.encryptByDES($scope.backup.userName);
		$scope.backup.password = UtilService.encryptByDES($scope.backup.password);
		HttpService.post('cloudBackup/vmbackup', $scope.backup, $modalInstance,  cbObject);
				} else {
					UtilService.handleResult(result);
				}
			}).error(function(response, code, headers, config) {
				waitModal.dismiss();
				UtilService.handleError(code);
			});
		} else {
			delete $scope.backup.password;
			delete $scope.backup.targetAddr;
			delete $scope.backup.type;
			delete $scope.backup.userName;
			// 虚拟机存在raw格式的磁盘则禁止在线备份
			HttpService.post('cloudBackup/vmbackup', $scope.backup, $modalInstance,  cbObject);
		}

	};
	var cbObject = function() {
		$scope.showTaskList();
		$rootScope.$broadcast("onQueryBackupTreeList");
	}
	
	$scope.$on(constant.onCarouselExtraBtnClick , function(){
		$scope.importBackupStrategy();
	})
	//导入备份策略
    $scope.importBackupStrategy=function(){
    	var modalInstance=UtilService.lgmodal("html/modal/host/selParaQuote.html","SelParaQuoteCtrl");
	   	modalInstance.result.then(function(result){
	   		if (result == 'cancel') return;
    		$scope.backup.storeMode = result.storeMode;
    		if (result.storeMode != 0) { //本地目录
    			$scope.backup.userName = result.loginName;
    			$scope.backup.password = result.password;
    			$scope.backup.targetAddr = result.targetAddr;
    			//0:FTP  1:SCP
    			$scope.backup.type = result.type;
    		}
    		//0 全量  1：增量   2：差异
    		$scope.backup.backupMode = result.incBackupFlag;
    		$scope.backup.directory = result.storeLocation;
    		$scope.backup.readRatio = result.readRatio;
    		$scope.backup.writeRatio = result.writeRatio;
    		$scope.backup.isCompression = result.isCompression;
    		if (result.isCompression == 1) {
    			$scope.tmp.isCompression = true;
    		} else {
    			$scope.tmp.isCompression = false;
    		}
			$scope.backup.tmpDir = result.tmpDir;
			$scope.backup.backupType = result.backupType;
    	});
    };
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});
/** 备份还原管理 */
routeApp.controller('BackupMngCtrl',function(domain, $scope,$modal, $http, $translate, $modalInstance, UtilService, HttpService) {
	$scope.title=$translate.instant('vm.backupMng');
	$scope.domain = domain;
	$scope.ok=function(){
		$modalInstance.dismiss($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	// 导入
	$scope.importBackupFile=function(){
		var modalInstance=$modal.open({
    		templateUrl:"html/modal/vm/importBackupFile.html",
	   		controller:"ImportBackupFileCtrl",
    		backdrop:"static",
    		resolve:{domain:function(){return domain;}}
    	});
	   	modalInstance.result.then(function(selectedItem){
    	},function(){
    		
    	});
	};
});

routeApp.controller('BackupTreeListCtrl',function($scope, $http, $modal, $translate, UtilService, HttpService) {
	$scope.domain = $scope.$parent.domain;
	$scope.status = $scope.domain.status;
	var titleTemplate  = '<div  ng-class="col.colIndex()" custom-title="{{row.branch[col.field]}}" >{{row.branch[col.field]}}</div>';
    var modeTemplate  = '<div  ng-class="col.colIndex()" >{{row.branch[col.field]|backupMode}}</div>';
    var dateTemplate = '<div  ng-class="col.colIndex()" >{{row.branch[col.field]|date:"yyyy-MM-dd HH:mm:ss"}}</div>';
    var sizeTemplate = '<div  ng-class="col.colIndex()" >{{row.branch[col.field]|byteUnitRender}}</div>';
    var backupTypeTemplate = '<div ng-class="col.colIndex()" >{{row.branch[col.field]|backupType}}</div>';
    var backupFileTemplate = "<span  custom-title='{{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}' set-td-width='19%' class='gird-ellipsis' style='display:inline-block;vertical-align: middle;line-height: 14px;'>{{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}</span>";
    var locationTemplate ="<span  custom-title='{{row.branch[col.field]}}' set-td-width='19%' class='gird-ellipsis' style='display:inline-block;vertical-align: middle;line-height: 14px;'>{{row.branch[col.field]}}</span>";
//    var diskNameTemplate = "<span custom-title='{{row.branch[col.field]}}' set-td-width='9%' class='gird-ellipsis' style='display:inline-block;vertical-align: middle;line-height: 14px;'>{{row.branch[col.field]}}</span>";
	$scope.column = [
	              { field: 'time',width:'15%', displayName: $translate.instant('securityMng.createTime'), cellTemplate:dateTemplate,cellTemplateScope:$scope},
	              { field: 'mode',width:'15%', displayName: $translate.instant('vm.backupMode'), cellTemplate:modeTemplate,cellTemplateScope:$scope},
	              { field: 'location',width:'20%', displayName: $translate.instant('backupVm.backupLocation'),cellTemplate:locationTemplate,cellTemplateScope:$scope},
	              { field: 'size',width:'10%', displayName: $translate.instant('host.filesize'),cellTemplate:sizeTemplate,cellTemplateScope:$scope},
	              { field: 'backupType', width:'10%', displayName: $translate.instant('backupVm.backupType'),cellTemplate:backupTypeTemplate,cellTemplateScope:$scope},
//	              { field: 'diskName', width:'10%', displayName: $translate.instant('backupVm.diskName'),cellTemplate:diskNameTemplate,cellTemplateScope:$scope},
	              { field: 'oper',width:'8%', displayName:  $translate.instant('common.oper'),cellTemplate:
	            	  '<div style="margin-top: -6px;">'
	            	  +'<div ng-if="cellTemplateScope.status == \'running\' || cellTemplateScope.status == \'paused\'" type="button" class="btn btn-sm-icon icon-vm-restore-gray btn-forbidden" custom-title="'+$translate.instant('common.revert')+'"></div>'
	            	  +'<div ng-if="cellTemplateScope.status != \'running\' && cellTemplateScope.status != \'paused\'" type="button" class="btn btn-sm-icon icon-vm-restore-gray" ng-click="cellTemplateScope.revertBackup(row.branch)" custom-title="'+$translate.instant('common.revert')+'"></div>'
	            	  +'<div ng-if="row.branch.isDelete == 0 " type="button" class="btn btn-sm-icon icon-delete-gray btn-forbidden" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'<div ng-if="row.branch.isDelete == 1 " type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="cellTemplateScope.deleteBackup(row.branch)" custom-title="'+$translate.instant('common.delete')+'"></div>'
	            	  +'</div>',
	            	  cellTemplateScope:$scope
	              }
	              ]
    $scope.expandColum = {field: 'name',width:'20%', displayName: $translate.instant('backupVm.backupFileName'),cellTemplate:backupFileTemplate, cellTemplateScope:$scope};
	
	$scope.treeData = [];// 树展示的数据
    var waitModal = UtilService.areawait("backupMngListDiv");
    var queryTreeData = function() {
    	var url = "cloudBackup/vmBackupFileTree?vmId=" + $scope.domain.id;
    	if (angular.isDefined($scope.domain.orgId) && $scope.domain.orgId != "") {
    		url = url + "&orgId=" + $scope.domain.orgId;
    	}
    	if (angular.isDefined($scope.domain.cloudId) && $scope.domain.cloudId != "") {
    		url = url + "&cloudId=" + $scope.domain.cloudId;
    	}
    	$http.get(url).success(function(result) {
            UtilService.dismissAreawait(waitModal);
            if (angular.isArray(result) || (angular.isObject(result) && result.state == 0)) {
                var groups = angular.isArray(result) ? result : result.data;
                var tempTreeData = [];
                for (var i = 0; i < groups.length; i++) {
                	  groups[i].expanded = true;
                	  tempTreeData.push(groups[i]);
                }
                $scope.treeData = tempTreeData;
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
      	  UtilService.dismissAreawait(waitModal);
            UtilService.handleError(code);
        });
    };

    //注册刷新
    $scope.$on(constant.onQueryBackupFileList, function(event, msg) {
        $scope.refreshPage();
    });
    //刷新树
    $scope.refreshPage = function() {
        $scope.treeData.splice(0, $scope.treeData.length);//清空树节点数据重新加载
        queryTreeData();
    }
    $scope.refreshPage();
    
	// 还原备份文件
	$scope.revertBackup = function(rowEntity) {
	    //根据domainId查看池hostUniqueKey
	    var queryHostUrl = "domain/" + $scope.domain.id + "/remoteHostId";
	    $http.get(queryHostUrl).success(function(result) {
	        if (result.state == 0) {
	            rowEntity.hostId = result.data;
		rowEntity.domainName = $scope.domain.name;
	            rowEntity.domainTitle = $scope.domain.title;
	            //修改问题单:201707010333 传入cic的domainId
	            rowEntity.vmId = $scope.domain.id;
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/vm/restoreVmFromBackup.html',
			  controller: 'RestoreVmCtrl',
			  backdrop:'static',
			  resolve: {
				  backup: function () {
  	                 return rowEntity;
  	              }
			  }
		  });
		  modalInstance.result.then(function (selectedItem) {
		  }, function (reason) {
		      // function executed after modal dismissal
		  });
	        } else {
	            UtilService.handleResult(result);
	        }
	    }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
	};
	var selectRowEntity;
	// 删除备份文件
    $scope.deleteBackup = function(rowEntity) {
    	selectRowEntity = rowEntity;
    	var mode = rowEntity.mode;
    	var modalInstance = UtilService.confirm($translate.instant('backupVm.deleteFileWarn'),$translate.instant('operConfirm'));
		modalInstance.result.then(function (selectedItem) {
			var param = {};
			param.domainId = rowEntity.domainId;
			// 修改问题单201501280670 删除差异备份的全量备份时给出提示 --by h10630 2015.1.31
			if (mode == 20) {
				var modalInstance1 = UtilService.confirm($translate.instant('backupVm.deleteDiffFileWarn'),$translate.instant('operConfirm'));
				modalInstance1.result.then(function (selectedItem) {
					$scope.deleteBackupFile(rowEntity, false);
				});
			} else if (mode == 10 || mode == 11) {
				var modalInstance1 = UtilService.confirm($translate.instant('backupVm.deleteIncFileWarn'),$translate.instant('operConfirm'));
				modalInstance1.result.then(function (selectedItem) {
					$scope.deleteBackupFile(rowEntity, false);
				});
			} else {
				$scope.deleteBackupFile(rowEntity, false);
			}
		}, function () {
			// $log.info('Modal dismissed at: ' + new Date());
		});
		
		
		$scope.deleteBackupFile = function(rowEntity, isForce) {
			var url = 'cloudBackup/delVmbackup';//?vmId=' + rowEntity.domainId + "&backupName=" + rowEntity.name + "&cloudId=" + rowEntity.cloudId;// + rowEntity.domainId + "/backup/"+ rowEntity.id +"?isForce=false";
			var parm = {
					id:rowEntity.id,
					vmId:rowEntity.domainId,
					backupName:rowEntity.name,
					cloudId:rowEntity.cloudId,
					isForce : isForce
			};
//			var url = 'backupStrategy/domain/' + rowEntity.domainId + "/backup/"+ rowEntity.id +"?isForce=" + isForce;
			var waitModal = UtilService.wait();
			$http({
				method  : 'DELETE',
				url     : url,
				params: parm
			}).success(function(result) {
				waitModal.dismiss();
				if (result.errorCode == 4521) {
					var modalInstance = UtilService.confirm($translate.instant('backupVm.forceDeleteWarn', {error:result.failureMessage}),$translate.instant('operConfirm'));
					modalInstance.result.then(function () {
						$scope.deleteBackupFile(selectRowEntity, true);
					});
				} else {
					UtilService.handleResult(result);
				}
				$scope.refreshPage();
				
			}).error(function(response, code, headers, config) {
				waitModal.dismiss();
				UtilService.handleError(code);
			});
			
		};
    }
		
    
//    $scope.deleteBackupFile = function(rowEntity) {
//		var url = 'cloudBackup/delVmbackup';//?vmId=' + rowEntity.domainId + "&backupName=" + rowEntity.name + "&cloudId=" + rowEntity.cloudId;// + rowEntity.domainId + "/backup/"+ rowEntity.id +"?isForce=false";
//		var parm = {
//				id:rowEntity.id,
//				vmId:rowEntity.domainId,
//				backupName:rowEntity.name,
//				cloudId:rowEntity.cloudId,
//				isForce : false
//		};
//		HttpService.delete(url,parm,undefined, queryTreeData);
//    }
});


//虚拟机备份管理 虚拟机还原窗口 controller
routeApp.controller('RestoreVmCtrl',function(backup, $scope, $http, $translate, $modalInstance, UtilService, HttpService) {
	$scope.model ={};
	$scope.model.tmpDir = "/vms/vmbackuptmp";
	$scope.model.size = backup.size;
	$scope.model.hostId = backup.hostId;
	//回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.ok = function () {
		var params = {};
		params.tmpDir = $scope.model.tmpDir;
		params.size = backup.size;
		params.hostId = backup.hostId;
		params.cloudId = backup.cloudId;
		$http({
            method  : 'GET',
            url     : 'cloudBackup/isTmpDirBackup',
            params:params
        }).success(function(result) {
        	if (result == true) { //存在可用临时目录
        		$scope.onSubmit(backup);
        	} else { 
        		//不存在可用临时目录
        		var modalInstance = UtilService.confirm($translate.instant('backupVm.restoreWarn'),$translate.instant('operConfirm'));
        		modalInstance.result.then(function (selectedItem) {
        			$scope.onSubmit(backup);
        		}, function () {
        		});
        	}
        	
        });
	};
	$scope.onSubmit = function(rowEntity) {
		if (rowEntity.type == 'cp') {
			var datamodel = $scope.fillModel(rowEntity);
			$scope.restoreSubmit(datamodel, false);
//			datamodel.isForce = false;
//			HttpService.put('restore/vm', datamodel, $modalInstance, $scope.showTaskList);
		} else {
			var testmodel = {};
			if (rowEntity.type == "scp") {
				testmodel.type = 1;
				testmodel.storeMode = 1;
			} else if (rowEntity.type == "ftp")  {
				testmodel.type = 0;
				testmodel.storeMode = 1;
			} else {
				testmodel.storeMode = 0;
			}
			testmodel.targetAddr = rowEntity.targetAddr;
			testmodel.userName = rowEntity.userName;
			testmodel.password = rowEntity.password;
			testmodel.directory = rowEntity.directory;
			testmodel.id = rowEntity.id;
			//修改问题单:201707010333 使用cic的domainId
			testmodel.vmId = rowEntity.vmId;
			testmodel.cloudId = rowEntity.cloudId;
			var waitModal = UtilService.wait();
			$http.put('cloudBackup/connectTest', testmodel)
	          .success(function(result) {
	        	  waitModal.dismiss();
	        	  if (result.success == true) {
	        		  var datamodel = $scope.fillModel(rowEntity);
	      			  $scope.restoreSubmit(datamodel, false);
//	        		  HttpService.put('restore/vm', datamodel, $modalInstance, $scope.showTaskList);
	        	  } else {
	        		  if (result.errorCode == 4555) {
	        			 UtilService.alert($translate.instant('backupVm.dirNotExist'), $translate.instant('common.opertip'), false, 'error');
					  } 
	        	  }
	        	  UtilService.handleResult(result);
	          }).error(function(response, code, headers, config) {
	        	  waitModal.dismiss();
	        	  UtilService.handleError(code);
	        });
		}
	};
	
	/**
	 * @param isForce,true:强制还原；false:非强制还原
	 */
	$scope.restoreSubmit = function(datamodel, isForce) {
		datamodel.isForce = isForce;
		var waitModal = UtilService.wait();
		$http.put('restore/vm', datamodel).success(function(result) {
			waitModal.dismiss();
			if (result.success == true) {
				UtilService.handleResult(result);
				 //修改问题单201705150115    备份类型是整机备份时，才给出提示  -add  by h10630  2017.7.14
				if (datamodel.backupType == 0) {
				UtilService.alert($translate.instant('backupVm.resetNetwork'), $translate.instant('common.opertip'));
				}
		    	$modalInstance.dismiss('cancel');
		    } else if (result.errorCode == constant.VM_DISK_CHANGE_FORBID_RESTORE) {
		    	var modalInstance = UtilService.confirm(result.failureMessage, $translate.instant('operConfirm'));
		    	modalInstance.result.then(function (selectedItem) {
		    		var datamodel = $scope.fillModel(backup);
		    		$scope.restoreSubmit(datamodel, true);
		    	}, function () {});
		    } else if (result.errorCode == constant.VM_BACKUP_NOT_EXISTS || result.errorCode == constant.VM_BACKUP_DIR_NOT_EXISTS) {
		        		  // 修改问题单201501240187     备份文件不存在时给出提示    --by h10630 2015.1.28
		    	UtilService.error($translate.instant("backupVm.backupNotExistInfo"), $translate.instant("common.opertip"));
		    } else {
		    	UtilService.handleResult(result);
		    }
		}).error(function(response, code, headers, config) {
		 	  waitModal.dismiss();
		  	  UtilService.handleError(code);
		});
	};
	$scope.fillModel = function(rowEntity) {
		var datamodel = {};
		datamodel.entryType ='VIRTUAL_HOST';
		datamodel.type = rowEntity.type;
		datamodel.targetAddr = rowEntity.targetAddr;
		datamodel.userName = rowEntity.userName;
		datamodel.password = rowEntity.password;
		datamodel.directory = rowEntity.directory;
		datamodel.time = rowEntity.time;
		datamodel.tmpDir = $scope.model.tmpDir;
		datamodel.backupId = rowEntity.id;
		datamodel.cloudId = rowEntity.cloudId;
		datamodel.hostId = $scope.model.hostId;
		datamodel.vmName = rowEntity.domainName;
		datamodel.backupType = rowEntity.backupType;
		datamodel.devName = rowEntity.devName;
		datamodel.filePath = rowEntity.filePath;
		datamodel.name = rowEntity.name;
		datamodel.title = rowEntity.domainTitle;
		datamodel.id = rowEntity.id;
		return datamodel;
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

//备份文件导入对话框控制器
routeApp.controller('ImportBackupFileCtrl', function(domain,$scope, $http, $modal,$translate, $modalInstance, UtilService,HttpService, DomainService) {
      $scope.model = {
    		  vmId : domain.id,
    		  vmName:domain.name,
    		  title:domain.title,
    		  hostId:domain.hostId,
    		  cloudId:domain.cloudId
      };
      $scope.model.tmpDir = 'vms/vmbackuptmp';
      //选择框的数据
      var sel = $scope.restoreType = {
              options:[{value:'cp', label:$translate.instant('host.localHost')}, 
                       {value:'ftp', label:$translate.instant('host.ftpType')},
                       {value:'scp', label:$translate.instant('host.scpType')}]
      }
      
      //回车
      $scope.enter = function(ev) { 
          if (ev.keyCode == 13 && $scope.form.$valid) {
              $scope.ok();
          }
      };
      //参数引用
      $scope.paraQuote=function(){
    	  DomainService.importBackupStrategy($scope);
      };
      $scope.ok = function () {
    	  HttpService.put('restore/importHistory', $scope.model, $modalInstance, $scope.showTaskList);
      };
      
      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
});

//迁移虚拟机
routeApp.controller('migrateVmCtrl',function($scope, $http, $translate, $timeout, $modalInstance, $compile, basicInfo, vmList, UtilService, HttpService, GridService) {
	$scope.model = {};		//向后台传递的模型
	//  迁移主机
    var MIGRATE_HOST = 0;
    //  迁移存储
    var MIRGRATE_STORAGE = 1;
    //  迁移主机和存储
    var MIGRATE_HOST_STORAGE = 2;
    
    //是否批量迁移的标记
    $scope.isBatch = false;
    if (angular.isArray(vmList)) {
        $scope.isBatch = true;
    }
    
    $scope.model.migrateType = MIGRATE_HOST;
    $scope.model.timeout = 5;                           //迁移超时时长
    $scope.model.compress = false;                      //压缩
    $scope.targetHost = {};
    $scope.model.targetType = "host";
    if ($scope.isBatch == true) {
        //批量迁移
        $scope.dlgTitle = $translate.instant('migrateVm.batchMigrateVm');
        
        //收集选中虚拟机的主机id，如果都来自同一主机则可以迁移存储，否则不能迁移存储
        $scope.hostSet = [];
        $scope.hostNameSet = []; 
        $scope.vmIdList = [];
        $scope.vmTitleList = [];
        $scope.model.cloudId = vmList[0].cloudId;
        
        for (var i = 0; i < vmList.length; i++) {
            var vm = vmList[i];
            if (vm.hostKey != undefined) {            	
            	$scope.hostSet.push(vm.hostKey);
            } else {
            $scope.hostSet.push(vm.hostId);
            }
            $scope.hostNameSet.push(vm.host);
            $scope.vmIdList.push(vm.id);
            $scope.vmTitleList.push(vm.title);
        }
        //去掉重复项
        $scope.hostSet = $scope.hostSet.unique();
        $scope.hostNameSet = $scope.hostNameSet.unique();
        
        if ($scope.hostSet.length > 1) {
            //选择的虚拟机来自不同的主机
            $scope.enableMigrateStorage = true;
            $scope.sourceHost = $scope.hostNameSet.join(',');
        } else {
            //选择的虚拟机来自同一个主机
            $scope.enableMigrateStorage = false;
            $scope.hostId = $scope.hostSet[0];
            $scope.sourceHost = $scope.hostNameSet[0];
        }       
        $scope.isStorageFailure = false;
        $scope.enableFormat = true;//不可修改。
        $scope.vmTitle = $scope.vmTitleList.join(',');
        
        var queryPlsUrl = 'domain/batch/storagePool';
        var queryParams = {};
        queryParams.ids = $scope.vmIdList;
        queryParams.cloudId = $scope.model.cloudId;
        $http({
            method: 'GET',
            url: queryPlsUrl,
            params: queryParams
        })
        .success(function(result) {
            if (result.success == true) {
                var plsArray = result.data;
                var poolTitleArr = [];
                for (var iPls = 0; iPls < plsArray.length; iPls++) {
                    var pos = 0;
                    if(!isEmpty(plsArray[iPls].name) && plsArray[iPls].name.lastIndexOf('/') > 0) {
                        if ('cdrom' != plsArray[iPls].diskType && 'floppy' != plsArray[iPls].diskType && plsArray[iPls].poolName && !poolTitleArr.contains(plsArray[iPls].poolName)) {
                            poolTitleArr.push(plsArray[iPls].poolName)
                        }
                    }
                }
                $timeout(function() {
                    $scope.sourcePool = poolTitleArr.join();
                });
            }
        });
    } else {
        //单个迁移
        $scope.dlgTitle = $translate.instant('migrateVm.migrateVm');
        $scope.hasCdromOrFloppy = false;
        
        //查询虚拟机相关的存储池。
        $scope.vmStoragePls = [];
        var params = {};
		params.cloudId = basicInfo.cloudId;
		params.id = basicInfo.id;
		$http({
			method: "GET",
			url: "domain/storagePool",
			params: params
		}).success(function(result) {
            if (result.success == true) {
                var plsArray = result.data;
                var poolTitleArr = [];
                for (var iPls = 0; iPls < plsArray.length; iPls++) {
                    var pos = 0;
                    if(!isEmpty(plsArray[iPls].name) && plsArray[iPls].name.lastIndexOf('/') > 0) {
                        var pl = {};
                        pos = plsArray[iPls].name.lastIndexOf('/');
                        pl.path = plsArray[iPls].name.substr(0, pos);
                        pl.poolType = plsArray[iPls].poolType;
                        pl.diskType = plsArray[iPls].diskDevice;
                        if ('cdrom' == pl.diskType || 'floppy' == pl.diskType) {
                            $scope.hasCdromOrFloppy = true;
                        }
                        $scope.vmStoragePls.push(pl);
                        if ('cdrom' != pl.diskType && 'floppy' != pl.diskType && plsArray[iPls].poolName && !poolTitleArr.contains(plsArray[iPls].poolName)) {
                            poolTitleArr.push(plsArray[iPls].poolName)
                    }
                }
            }
                $timeout(function() {
                	$scope.sourcePool = poolTitleArr.join();
        });
            }
        });
        
        $scope.model.id = basicInfo.id;
        $scope.model.cloudId = basicInfo.cloudId;
        $scope.model.domainName = basicInfo.domainName;
        $scope.model.title = basicInfo.title;
        $scope.model.targetHostId = basicInfo.hostId;       //when MIRGRATE_STORAGE
        $scope.isOnline = false;
        if ("running" == basicInfo.status || "paused" == basicInfo.status) {
            $scope.model.onlineMigrate = 1;
            $scope.isOnline = true;
        } else {
            //离线迁移
        	$scope.model.onlineMigrate = 0;
        	$scope.isOnline = false;
        }
        $scope.vmTitle = basicInfo.title;
        $scope.sourceHost = basicInfo.hostName;
        $scope.hostId = basicInfo.hostId;
        var existPciOrUsb = basicInfo.existPciOrUsb;
        var existCdromOrFloppy = basicInfo.existCdromOrFloppy;
        var existRaw = basicInfo.existRaw;
        var existBlock = basicInfo.existBlock;
        $scope.existBlock = existBlock;
        //这些熟悉用于设置cascheckbox的readonly属性， 如果enable为true，则readonly为false
        //修改问题单：201603240500 在线迁移时磁盘格式不允许修改。
        $scope.enableFormat = (basicInfo.formatEnable != 1) || $scope.isOnline;//1表示可以修改， 非1为不可修改。
        $scope.enableMigrateStorage = $scope.isOnline && existRaw;
        $scope.isStorageFailure = basicInfo.hoststatus == constant.HOST_MAINTAIN_STATUS_STORAGE_FAILURE;
    }
    
    $scope.selectPool = {};       //选中的存储
    $scope.selectPool.pool = {};
    $scope.$watch('selectPool.pool', function(newValue, oldValue) {
        console.info(newValue);
    },true);
    $scope.hideOper = true;         //不显示存储池操作列
    $scope.advance = $translate.instant('migrateVm.showAdvance');
    //磁盘格式
    $scope.showFormat = false;
    $scope.designatedFormat = function() {
    	$scope.showFormat = !$scope.showFormat;
    	if ($scope.showFormat) {
    		$scope.advance = $translate.instant('migrateVm.hideAdvance');
    	} else {
    		$scope.advance = $translate.instant('migrateVm.showAdvance');
    	}
    };
    
    //根据迁移类型调整导航步骤
    $scope.$watch('model.migrateType', function() {
    	$timeout(function() {    	    
    		if ($scope.model.migrateType == MIGRATE_HOST_STORAGE) {
        		$scope.step = $scope.changeHostAndStorageStep;
        	} else if ($scope.model.migrateType == MIRGRATE_STORAGE) {
        		$scope.step = $scope.changeStorageStep;
        		if ($scope.isBatch == true) {
        		    if ($scope.hostSet.length > 1) {
                        //选择的虚拟机来自不同的主机
                        $scope.enableMigrateStorage = true;
                        $scope.sourceHost = hostNameSet.join(',');
                    } else {
                        $scope.targetHost.id = $scope.hostSet[0];
                        $scope.targetHost.name = $scope.hostNameSet[0];
                        $scope.model.targetHostId = $scope.targetHost.id;
                    }   
        		} else {
        		    $scope.model.targetHostId = basicInfo.hostId;
        		}
        	} else {
        		$scope.step = $scope.changeHostStep;
        	}
    		$scope.model.diskFormat = 'keep';
    		$scope.showTargetHost = false;
            $scope.showTargetStorage = false;
            $scope.showDiskFormat = false;
    	});    	
    });	
	
	//步骤提示的显示
    $scope.changeHostStep = [$translate.instant('migrateVm.selectMigrateType'),
                             $translate.instant('migrateVm.selectTargetHost')];
    $scope.changeStorageStep = [$translate.instant('migrateVm.selectMigrateType'),
                                $translate.instant('migrateVm.selectTargetStorage')];
    $scope.changeHostAndStorageStep = [$translate.instant('migrateVm.selectMigrateType'),
							           $translate.instant('migrateVm.selectTargetHost'),
							           $translate.instant('migrateVm.selectTargetStorage')];
    $scope.step = $scope.changeHostStep;
    
    //when next button is pressed, call this method.
    $scope.showTargetHost = false;
    $scope.showTargetStorage = false;
    $scope.showDiskFormat = false;
    $scope.nextCallBack = {
    	'1': function() {
    	    if ($scope.model.migrateType != MIRGRATE_STORAGE) {
    	        $scope.showTargetHost = true;
    	        $scope.showTargetStorage = false;
    	        $scope.showDiskFormat = false;
    	    } else {
    	        $scope.showTargetHost = false;
    	        $scope.showTargetStorage = true;
    	        $scope.showDiskFormat = true;
    	    }
    	},
    	'2':function() {
//    	    if ($scope.isBatch == true) {
//    	      //如果是批量迁移，给hostId赋值用于查询存储池
//              $scope.hostId = $scope.targetHost.id;
//    	    }
    	    $scope.model.targetHostId = $scope.targetHost.id;
    	    return submitCheck();
    	}
    };
	//form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true")
                return true;
            return false;
        },
        stepTwoOver : function() {
            if (!$scope.targetHost.id) {
                return false;
            }
            if ($('#form2').val() === "true" && $scope.targetHost.entryType == 'host'){
                return true;
            }
            return false;
        },
        stepThreeOver : function() {
            if ($scope.selectPool.pool && $scope.selectPool.pool.path)
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
    
    //提交前检查
    var submitCheck = function() {
        if ($scope.isBatch == true) {
            if ($scope.model.migrateType != MIRGRATE_STORAGE && $scope.hostSet.length == 1 && $scope.hostSet[0] == $scope.targetHost.id) {
                //批量操作的虚拟机来自同一个主机， 则做目的主机是否为统一的判断
                UtilService.alert($translate.instant('migrateVm.sameHostAlert'), $translate.instant('common.opertip'), false, 'error');
                return false;
            }
        } else {
            //迁移存储时，做相同存储判断
            if ($scope.model.migrateType == MIRGRATE_STORAGE) {
                //检查选择的是否相同
                for (var j = 0; j < $scope.vmStoragePls.length; j++) {
                    if ('cdrom' == $scope.vmStoragePls[j].diskType || 'floppy' == $scope.vmStoragePls[j].diskType) {
                        continue;
                    }
                    if ($scope.selectPool.pool.path && $scope.selectPool.pool.path == $scope.vmStoragePls[j].path && 
                            $scope.selectPool.pool.type == $scope.vmStoragePls[j].poolType) {
                        UtilService.alert($translate.instant('migrateVm.sameHostPoolAlert'), $translate.instant('common.opertip'), false, 'error');
                        return false;
                    } 
                }
            } else {
                //不迁移存储时，才校验主机
                if($scope.hostId==$scope.targetHost.id) {
                    UtilService.alert($translate.instant('migrateVm.sameHostAlert'), $translate.instant('common.opertip'), false, 'error');
                    return false;
                }
                //主机状态判断
                if($scope.targetHost.entryType == 'host' && $scope.targetHost.hostData.status != 1) {
                    UtilService.alert($translate.instant('common.hostStatusAlarm'), $translate.instant('common.opertip'), false, 'error');
                    return false;
                }
            }
        }
        if ($scope.model.migrateType != MIGRATE_HOST) {
            //迁移存储或主机和存储时显示
            $scope.showTargetStorage = true;
            $scope.showDiskFormat = true;
        }
        return true;
    }
    
	$scope.ok = function () {
	    //如果检查不过，则直接返回
	    if(!submitCheck()) {
	        return;
	    }
	    $scope.model.migrateType = Number($scope.model.migrateType);
		if ($scope.model.migrateType != MIRGRATE_STORAGE) {
			$scope.model.targetHostId = $scope.targetHost.id;		//set target host id.
		}
		
		if ($scope.selectPool.pool && $scope.selectPool.pool.path) {
			$scope.model.targetPoolTitle = $scope.selectPool.pool.title;
			$scope.model.targetPool = $scope.selectPool.pool.name;
			$scope.model.targetPath = $scope.selectPool.pool.path;
			$scope.model.remainSize = $scope.selectPool.pool.remainSize;
		} 
		
		if ($scope.model.diskFormat == 'keep') {
			$scope.model.diskFormat = undefined;
		}
		
		if ($scope.isBatch == true) {
		    //将model重新设置虚拟机信息后装入list
		    var modelList = [];
		    for (var i = 0; i < vmList.length; i++) {
	            var model = angular.copy($scope.model);
	            model.id = vmList[i].id;
	            model.cloudId = vmList[i].cloudId;
	            model.domainName = vmList[i].name;
	            model.title = vmList[i].title;
	            if ("running" == vmList[i].status || "paused"  == vmList[i].status) {
	                model.onlineMigrate = 1;
	            } else {
	                //离线迁移
	            	model.onlineMigrate = 0;
	            }
	            modelList.push(model);
	        }
		    HttpService.post('domain/batch/migrate', modelList, $modalInstance,  $scope.showTaskList);
		} else {
		    HttpService.post('domain/migrate', $scope.model, $modalInstance,  $scope.showTaskList);
		}		
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

//克隆虚拟机
routeApp.controller('CloneVmCtrl',function($scope, $http,$rootScope, $modal,$translate,$timeout,domain,$modalInstance, UtilService, HttpService, GridService, DomainService) {
	$scope.oldDomainName = domain.title;
	$scope.model ={};
	$scope.model.id =domain.id;	
	$scope.model.oldTitle = domain.title;
	$scope.model.srcHostId = domain.hostId;
	$scope.model.cloneType = 0;	
	$scope.model.targetHostId=domain.hostId;
	$scope.model.cloudId=domain.cloudId;
	$scope.treemodel = {};
	$scope.treemodel.targetHost={};
	$scope.domainNameUrl = "domain/name/exist?cloudId=" + domain.cloudId;
	
	//修改问题单201702250289，克隆虚拟机，存储信息没有实时保留配置，建议修改以增强易用性。
	$scope.oldParams = {};
	$scope.oldParams.targetHostId = domain.hostId;
	$scope.oldParams.oldTitle = domain.title + '_clone';
	
	$scope.mySelections=[];
	$scope.mySelections2=[];
    $scope.advance = $translate.instant('migrateVm.showAdvance');
	//根据克隆的目的地调整导航步骤
    $scope.$watch('model.cloneType', function() {
    	$timeout(function() {
    		if ($scope.model.cloneType == '0') {
    			//本地克隆
        		$scope.stepTitles = $scope.changeHostin;
        	}  else {
        		$scope.stepTitles = $scope.changeHostout;
        	}
    		$scope.model.diskFormat = '';
    	});    	
    });	
	//步骤提示的显示
    $scope.changeHostin = [$translate.instant('baseinfo'),
                           $translate.instant('vm.cloneVmDlg.storageInfo'),
                           $translate.instant('vm.cloneVmDlg.netInfo')];
    $scope.changeHostout = [$translate.instant('baseinfo'),
                            $translate.instant('vm.cloneVmDlg.targetHost'),
                            $translate.instant('vm.cloneVmDlg.storageInfo'),
                            $translate.instant('vm.cloneVmDlg.netInfo')];
    $scope.stepTitles = $scope.changeHostin;
    $scope.valids = {
	       stepOneOver : function() {
	          			if ($('#form1').val() === "true"){
		          			return true;
	          			}
	          			return false;
	          		},
	       stepTwoOver : function() {
	    	   			if ($('#form2').val() === "true"){
	          				if ($scope.model.cloneType=="1"&&$scope.treemodel.targetHost.entryType=="host"){
	          					$scope.model.targetHostId=$scope.treemodel.targetHost.id;
		    	   				return true;
	          				} else if ($scope.model.cloneType == "0") {
	          					return true;
	          				}
	          				
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
  //点击下一步的回调函数 “2”后面的函数代表点击第二步的回调函数
    $scope.nextCallBack = {
    		"1":function() {
    		    if (!DomainService.checkSrcStorage(domain.id, domain.cloudId)) {
    		        return false;
    		    }
    			if ($scope.model.cloneType == "0" && (isEmpty($scope.oldParams.cloneType1) 
    					|| $scope.oldParams.oldTitle != $scope.model.title 
    					|| $scope.model.cloneType != $scope.oldParams.cloneType1)) { 
    				//主机内克隆
    				$scope.destStorage=$translate.instant("host.targetPool");
    				var params = {
    					"domainId" : domain.id,
    					"hostId" : domain.hostId,
    					"domainName" : encodeURI($scope.model.title),
    					"cloudId" : domain.cloudId
    				};
    				$http({
		            	method: 'GET',
		            	url: 'domain/clone/preCreateDiskInfo',
		            	params: params
		            }).success(function(result) {
		            	//修改问题单201702250289，部署虚机时当选好目的存储池时返回去修改虚机显示名称或显示名称前缀后再返回来发现目的存储池又变回默认了 c11817
		            	if (angular.isArray($scope.myData) && angular.isArray(result.data) && $scope.model.cloneType == $scope.oldParams.cloneType1 && $scope.oldParams.oldTitle != $scope.model.title) {
		            		var length1 = $scope.myData.length;
		            		var length2 = result.data.length;
		            		for (var i = 0; i < length1; i++) {
		            			for (var j = 0; j < length2; j++) {
		            				if ($scope.myData[i].srcFullname == result.data[j].srcFullname) {
		            					$scope.myData[i].destName = result.data[j].destName;
		            					break;
		            				}
		            			}
		            		}
		            	} else {
    					$scope.myData = result.data;
		            	}
		            	$scope.oldParams.cloneType1 = $scope.model.cloneType;
	    				$scope.oldParams.cloneType2 = $scope.model.cloneType;
	    				$scope.oldParams.oldTitle = $scope.model.title;
	    				$scope.model.targetHostId = domain.hostId;
    					
    			    });
    				
    				
    			} 
    		},
    		"2":function() {
    			if ($scope.model.cloneType == "0") { 
    				//主机内克隆
    				$scope.destStorage=$translate.instant("host.targetPool");
    				if (isEmpty($scope.oldParams.getNet)) {
    				$scope.getNetData();
    				}
    				$scope.oldParams.getNet = true;
    			} else if ($scope.model.cloneType == "1") {
    			    //主机状态判断
    			    if($scope.treemodel.targetHost.entryType == 'host' && $scope.treemodel.targetHost.hostData.status != 1) {
                        UtilService.alert($translate.instant('common.hostStatusAlarm'), $translate.instant('common.opertip'), false, 'error');
                        return false;
                    }
    				//主机间克隆
    				$scope.destStorage=$translate.instant("host.targetPool");
    				if ((isEmpty($scope.oldParams.cloneType2) 
        					|| $scope.oldParams.oldTitle != $scope.model.title 
        					|| $scope.model.cloneType != $scope.oldParams.cloneType2)
        					|| ($scope.treemodel.targetHost.id != $scope.oldParams.targetHostId && $scope.oldParams.cloneType2 == '1')) {
    				var params = {
    					"domainId" : domain.id,
    					"hostId" : $scope.treemodel.targetHost.id,
    					"domainName" : encodeURI($scope.model.title),
    					"cloudId" : domain.cloudId
    				};
    				$http({
		            	method: 'GET',
		            	url: 'domain/clone/preCreateDiskInfo',
		            	params: params
		            }).success(function(result) {
    			            	//修改问题单201702250289，部署虚机时当选好目的存储池时返回去修改虚机显示名称或显示名称前缀后再返回来发现目的存储池又变回默认了 c11817
    			            	if (angular.isArray($scope.myData) && angular.isArray(result.data) && $scope.model.cloneType == $scope.oldParams.cloneType2 
    			            			&& $scope.treemodel.targetHost.id == $scope.oldParams.targetHostId && $scope.oldParams.oldTitle != $scope.model.title) {
    			            		var length1 = $scope.myData.length;
    			            		var length2 = result.data.length;
    			            		for (var i = 0; i < length1; i++) {
    			            			for (var j = 0; j < length2; j++) {
    			            				if ($scope.myData[i].srcFullname == result.data[j].srcFullname) {
    			            					$scope.myData[i].destName = result.data[j].destName;
    			            					break;
    			            				}
    			            			}
    			            		}
    			            	} else {
    					$scope.myData = result.data;
    			            	}
    			            	$scope.oldParams.cloneType1 = $scope.model.cloneType;
    		    				$scope.oldParams.cloneType2 = $scope.model.cloneType;
    		    				$scope.oldParams.oldTitle = $scope.model.title;
    		    				$scope.oldParams.targetHostId = $scope.treemodel.targetHost.id;
    			    });
    				}
    				
    				if($scope.treemodel.targetHost.id==domain.hostId) {	//修改问题单	201602280043 --by kf6302
    	                UtilService.alert($translate.instant('vm.sameHostAlert'), $translate.instant('common.opertip'), false, 'error');
    	                return false;
    	            }
    			}
    		},
    		"3" :function() {
    			//主机间克隆
    			if ($scope.model.cloneType == "1") {
    				if (isEmpty($scope.oldParams.getNet)) {
    				$scope.getNetData();
    			}
    		}
    		}
    };
	$scope.showFormat = false;
	$scope.designatedFormat = function() {
	    $scope.showFormat = !$scope.showFormat;
	    if ($scope.showFormat) {
    		$scope.advance = $translate.instant('migrateVm.hideAdvance');
    	} else {
    		$scope.advance = $translate.instant('migrateVm.showAdvance');
    	}
	};
	//克隆类型 
	$scope.getCloneType=function (){
		if($scope.model.cloneMode=="0"){
			return $translate.instant('vm.normalClone');
		}else if($scope.model.cloneMode=="1"){
			return $translate.instant('vm.fastClone');
		}else if($scope.model.cloneMode=="2"){
			return $translate.instant('vm.allClone');
		}
	};
	//克隆方式 0：本地克隆  1：异地克隆
	$scope.getCloneDest=function (){
		if($scope.model.cloneType=="0"){
			return $translate.instant('vm.cloneInHost');
		}else if($scope.model.cloneType=="1"){
			return $translate.instant('vm.cloneOutHost');
		}
	};
	//克隆类型 
	$scope.$watch("model.getCloneType",function(newValue,oldValue){
		if($scope.model.getCloneType=='1') {
			delete $scope.model.diskFormat;
		}
	});
	//磁盘格式
	$scope.getStorageFormat=function (){
		if ($scope.model.diskFormat=="") {
			return $translate.instant('vm.cloneVmDlg.sameFormat');
		} else if($scope.model.diskFormat=="qcow2") {
			return $translate.instant('storagePool.qcow2');
		} else if($scope.model.diskFormat=="raw") {
		    return $translate.instant('storagePool.raw');
		}
		$scope.model.diskFormat="";
	};
	$scope.getTargetHost=function(){
		if($scope.treemodel.targetHost.name) {
			return $scope.treemodel.targetHost.name;
		}
	};
	//回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.ok = function () {
		if ($scope.myData.length > 0 ) {
			//存储信息
			$scope.model.storages = [];
			for (var i = 0; i< $scope.myData.length; i++) {
				var store = $scope.myData[i];
				var data = {};
				data.src = store.srcName;
				data.dest = store.destName;
				//修改问题单201703030189，cic上克隆虚拟机时选择显示名称与名称不一致的存储池，报找不到存储池；
				data.pool = store.poolName;
				$scope.model.storages.push(data);
			}
			
		}
		if ($scope.myData2.length > 0) {
			//网络信息
			$scope.model.nets = [];
			for (var i = 0; i< $scope.myData2.length; i++) {
				var net = $scope.myData2[i];
				if (angular.isDefined(net)) {
					var data = {
							mac:net.mac,
							//add by l14389 20180201 ref 201801310169 cas克隆接口需要有虚拟交换机名字
							name:net.vsName,
							sysIpType:net.sysIpType,
							sysIp:net.sysIp,
							sysMask:net.sysMask,
							sysGateway:net.sysGateway,
							sysDns:net.sysDns,
							secondaryDns:net.secondaryDns,
							isBindIp:false
						};
					if (net.isBindIp == 1) {
						data.isBindIp = true;
					}
					$scope.model.nets.push(data);
				}
			}
		}
		var postdata = $.extend({}, $scope.model);
		if (postdata.diskFormat == '') {
			delete postdata.diskFormat;
		}
	
		HttpService.post('domain/clone', postdata, $modalInstance,  $scope.showTaskList);
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
    var destNameTemplate=TEMPLATE_START +
		'<input checkname grid-alert style="width:120px;" inputTag="true" ng-trim="false" ng-maxlength=100 custom-title="{{row.entity[col.field]}}" ng-model="row.entity[col.field]"  class="gridInput" required>' +
		TEMPLATE_END ; 
    var hpCellTemplate= TEMPLATE_START  +
		'<input custom-title="{{row.entity[col.field]}}" ng-model="row.entity[col.field]" style="display:inline-block;width:125px;cursor:pointer" class="gridInput" ng-click="selectStoragePool(row)" readonly>' +
		'<span class="input-group-addon gridSpan" ng-click="selectStoragePool(row)"><span class="fa fa-search"></span></span>'+
		TEMPLATE_END ; 

	$scope.myData=[];
	var column = [{ field: 'srcName', displayName: $translate.instant('host.sourceFile') , sortable: true, width:'28%',cellTemplate:titleTemplate},
                  { field: 'destName', displayName: $translate.instant('host.targetFile'), sortable: true, width:'32%',cellTemplate:destNameTemplate},
                  { field: 'poolTitle', displayName: $translate.instant('host.targetPool'), sortable: true, width:'40%',cellTemplate:hpCellTemplate}
                 ];
    
    $scope.gridOptions = {
		data: 'myData',
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
        enablePaging: false,
        showFooter: false,
        i18n: $translate.instant('lang'),
//        totalServerItems: 'totalServerItems',
        filterOptions: false,
        pagingOptions: false,
        columnDefs:column
    };    

	$scope.getTargetStorageFile=function(){
		 if ($scope.myData.length >0) {
			 var destFileArray=[];
			 for(var i=0;i<$scope.myData.length;i++){
				 destFileArray.push($scope.myData[i].destName);
			 }
   		  return destFileArray.join(',');
   	  } else {
   		  return undefined;
   	  }
	};
	$scope.myData2=[{"mac":"demoMac"}];
	//获取网络数据的方法
    $scope.getNetData = function() {
    	$http({
        	method: 'GET',
        	url: 'domain/network',
        	params: {"id":domain.id,"cloudId":domain.cloudId},
        }).success(function(result) {
			$scope.myData2 = result.data;
			if (!isEmpty($scope.myData2) && $scope.myData2.length > 0) {
				for (var i = 0; i < $scope.myData2.length; i ++) {
					var data = $scope.myData2[i];
					data.sysIp = $translate.instant('common.default');
					data.sysIpType = 0;
				}
			}
	    });
    }
	var netparamCellTemplate=TEMPLATE_START +
		   '<input custom-title="{{row.entity[col.field]}}" ng-model="row.entity[col.field]" style="display:inline-block;width:114px;" class="gridInput" ng-click="selectNetParam(row)" readonly>' +
		   '<span class="input-group-addon gridSpan" ng-click="selectNetParam(row)"><span class="fa fa-search"></span></span>'+
		   TEMPLATE_END ; 
	var column2 = [{ field: 'mac', displayName: $translate.instant('host.mac') , sortable: true, width:'34%',cellTemplate:titleTemplate},
               { field: 'vsName', displayName: $translate.instant('addDomain.vswitch'), sortable: true, width:'33%',cellTemplate:titleTemplate},
               { field: 'sysIp', displayName: $translate.instant('common.netParameter'), sortable: true, width:'33%',cellTemplate:netparamCellTemplate}
              ];
    $scope.gridOptions2 = {
		data: 'myData2',
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
        enablePaging: false,
        showFooter: false,
        i18n: $translate.instant('lang'),
//        totalServerItems: 'totalServerItems',
        filterOptions: false,
        pagingOptions: false,
        columnDefs:column2
    };
  //选择网络参数
	$scope.selectNetParam = function(row) {
		$scope.tmpNet = angular.copy(row.entity);
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/common/setNetParam.html',
			  controller: 'SetNetParamCtrl',
			  backdrop:'static',
			  resolve:{
				  objdata:function(){
					  return $scope.tmpNet;
				  }
			  }
		});
		modalInstance.result.then(function (selectedItem) {
		}, function (reason) {
			if (!isEmpty(reason)) {					
				row.entity = reason;
				if (reason.sysIpType == '0') {			   
					reason.sysIp = $translate.instant('common.default');
				} else if(reason.sysIpType=='1'){
					reason.sysIp = 'DHCP';
				}
				if (!isEmpty($scope.myData2) && $scope.myData2.length > 0) {
					for (var i = 0; i < $scope.myData2.length; i ++) {
						var data = $scope.myData2[i];
						if (data.mac == reason.mac) {
							$scope.myData2[i] = reason;
							break;
						}
					}
				}
			}
       });
	}
 	//选择存储池
 	$scope.selectStoragePool = function(row) {
 		var self=this;
 		$scope.temp=self;
 		var resolve = {
				paramsObj :function() {
					return {
						hostId : $scope.model.targetHostId,
						cloudId : $scope.model.cloudId
					}
			    }
		}
 		var modalInstance = UtilService.lgmodal('html/modal/common/storagepoolSelectorInHost.html', 'storagePoolSelectInHostCtrl', resolve);
 		modalInstance.result.then(function (reason) {
 			if (angular.isDefined(reason)){
 				//修改问题单201703030189，cic上克隆虚拟机时选择显示名称与名称不一致的存储池，报找不到存储池；
 				row.entity.poolTitle = reason.storagepoolName;
 				row.entity.poolName = reason.name;
 			} 
 		});
 	}
 
});
/*设置网络参数*/
routeApp.controller('SetNetParamCtrl',function($scope, $http, $translate, $timeout,objdata,$modalInstance,UtilService, HttpService, GridService) {
	$scope.entry = objdata;
	
	$scope.netFocus = function() {
		if (isEmpty($scope.entry.sysMask)) {
			$scope.entry.sysMask = "255.255.255.0";
		}
	};
	
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.ok=function(){
		$modalInstance.dismiss($scope.entry);
	}
	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});
/**
 * 删除虚拟机（删除镜像）确认
 */
routeApp.controller('deleteConfirmCtrl',function($scope, $http, $translate, $modalInstance, UtilService, HttpService) {
    $scope.tmp = {};
    $scope.ok = function () {
        if ($scope.tmp.userInput.toUpperCase() != 'DELETE') {
            UtilService.alert($translate.instant('common.userInputError'), $translate.instant('common.opertip'), false, 'error');
            $scope.tmp.userInput = '';
            return;
        }
        $modalInstance.close('ok');
    };
    
      //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}); 

/**
 * 克隆为模板控制器及转换为模板控制器
 */
routeApp.controller('CloneTemplateCtrl',function($scope, $http, $modal, $translate, vmId, cloudId, $modalInstance, UtilService, HttpService) {
    $scope.template ={};
    $scope.template.opType =1;
    $scope.template.cloudId = cloudId;
    $scope.template.vmId =vmId;
    
    $scope.selectTempletStorage = function () {
        var modalInstance = $modal.open({
            templateUrl:'html/modal/common/templateStorageSelector2.html',
            backdrop:"static",
            controller:"SelectTemplateStorageListCtrl2",
            width:"540px",
            resolve: {
                cloudId: function(){return cloudId;}
            }
        });
        modalInstance.result.then(function(selectItem){
            console.log(selectItem.targetPath);
            $scope.template.templetStoragePath = selectItem.targetPath;
        },function(reason){

        });
    };

    $scope.ok = function () {
        HttpService.post('template', $scope.template, $modalInstance, $scope.showTaskList);
    };
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});

/**
 * 转换为模板控制器
 */
routeApp.controller('ToTemplateCtrl',function($scope, $http, $modal, $translate,vmId,title,cloudId, $modalInstance, UtilService, HttpService) {
    $scope.template ={};
    $scope.template.opType = 2;
    $scope.template.cloudId = cloudId;
    $scope.template.vmId =vmId;
    $scope.template.name = title;
    $scope.selectTempletStorage = function () {
        var modalInstance = $modal.open({
            templateUrl:'html/modal/common/templateStorageSelector2.html',
            backdrop:"static",
            controller:"SelectTemplateStorageListCtrl2",
            width:"540px",
            resolve: {
                cloudId: function(){return cloudId;}
            }
        });
        modalInstance.result.then(function(selectItem){
            console.log(selectItem.targetPath);
            $scope.template.templetStoragePath = selectItem.targetPath;
        },function(reason){

        });
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
         var modalInstance = UtilService.confirm($translate.instant('vm.confirmToTemplate'),$translate.instant('vm.toTemplate'));
         modalInstance.result.then(function (selectedItem) {
             HttpService.post('template', $scope.template, $modalInstance, $scope.showTaskList);
         }, function () {
         });
        
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});

//虚拟机概要
routeApp.controller('VmOverviewCtrl',function($rootScope,$scope, $http, $modal,$timeout,$interval, $translate, UtilService,GridService, HttpService,DomainService, EchartService) {
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
		$scope.$apply();
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
	
    $(window).on("resize", onResize);
    
	$scope.summary = {};
	$scope.summary.title = '';
	$scope.myData = {};
	$scope.dataList = [];
	$scope.myData.data1 = [];
	//获取虚拟机概要信息函数
	$scope.getDomainSummary = function() {
		$http.get('domain/summary/new?vmId='+$scope.vmId+"&cloudId="+$scope.cloudId).success(function(result) {
			$scope.summary = result.data;
			$scope.myData.data0 = result.data;
		});
	}
	$scope.getDomainSummary();
	
	$scope.editVmTitle=function(){
		 var resolve = { 
				 vmId: function() {
					return $scope.vmId; 
				 },
				 title: function () {
			      return $scope.summary.title;
			      
				 },
				 cloudId: function () {
					 return $scope.cloudId;
				 }
		 };
		 var modifyInstance=UtilService.lgmodal('html/modal/vm/modifyVmTitle.html', 'ModifyVmTitleCtrl', resolve, {width:"432px"});
	};
	$scope.handleHa = function(){
		HttpService.put("domain/handleHa?title=" + $scope.title + "&id=" + $scope.vmId + "&cloudId=" + $scope.cloudId, undefined, undefined, $scope.refresh);
	}
	$scope.openAdvanced = function(){
		var resolve = {
				summary: function(){
					return $scope.summary;
				}
		};
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/vm/advancedProperties.html',
			  controller: 'showAdvancedCtrl',
			  backdrop:true,
			  resolve: resolve
			  }
		);
	};
	$scope.openMore = function(index){
		var item = $scope.dataList[index];
		var resolve = {
				item: function(){
					return item;
				},
				cloudId: function(){
					return $scope.cloudId;
				}
		}
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/vm/moreProperties.html',
			  controller: 'showMoreCtrl',
			  backdrop:true,
			  resolve: resolve
			  }
		);
	};
	//升级Castools
	 $scope.upgradeCastools = function(id) {
	     var vmId = $scope.vmId;
        if (angular.isNumber(id)) {
            vmId = id;
        }
        DomainService.upgradeCastools(vmId, $scope.showTaskList);
	 } 
	$scope.getDomainStorage = function(){
		$http({
    		method: 'GET',
    		url: 'domain/storages',
    		params: { id : $scope.vmId, cloudId : $scope.cloudId}
    	}).success(function (result) {	
    		if (result.success == true) {
    			if(angular.isArray(result.data)){
    				var storageData = [];
    				//重新排列存储的顺序
    				for(var i = 0; i < result.data.length; i++){
    					if(result.data[i].deviceType == "disk"){
    						storageData.push(result.data[i]);
    					}
    				}
    				for(var i = 0; i < result.data.length; i++){
    					if(result.data[i].deviceType == "cdrom"){
    						storageData.push(result.data[i]);
    					}
    				}
    				for(var i = 0; i < result.data.length; i++){
    					if(result.data[i].deviceType == "floppy"){
    						storageData.push(result.data[i]);
    					}
    				}
    				$scope.myData.data1 = storageData;
    			}
    		}
    	});    
	}
	
	$scope.getDomainStorage();
	
    $scope.myData.data2 = [];
    //获取虚拟机网络列表的函数
    $scope.getDomainNet = function() {
    	$http({
    		method: 'GET',
    		url: 'domain/network',
    		params: { id : $scope.vmId, cloudId : $scope.cloudId}
    	}).success(function (result) {	
    		if (result.success == true) {
    			$scope.myData.data2 = result.data;
    		}
    	});    
    }
    
    $scope.getDomainNet();
    
    $scope.$watch("myData", function(){
    	
    	if($scope.myData.data1.length >= 0 && $scope.myData.data2.length >= 0 &&angular.isDefined($scope.myData.data0)){
    		$scope.dataList = [];
    		var cpuItem = {};
    		cpuItem.deviceType = "cpu";
    		cpuItem.cpuRate = $scope.myData.data0.cpuRate;
    		cpuItem.cpusocket = $scope.myData.data0.cpuSocket;
    		cpuItem.cpucore = $scope.myData.data0.cpuCore;
    		$scope.dataList.push(cpuItem);
    		var memItem = {};
    		memItem.deviceType = "memory";
    		memItem.memory = $scope.myData.data0.memory;
    		memItem.memRate = $scope.myData.data0.memoryRate;
    		$scope.dataList.push(memItem);
    		for(var i = 0;i < $scope.myData.data1.length; i++){
    			if($scope.myData.data1[i].deviceType == 'disk'){
    				$scope.dataList.push($scope.myData.data1[i]);
    			}
    		}
    		for(var i = 0;i < $scope.myData.data2.length; i++){
    			$scope.myData.data2[i].deviceType = "net";
    			$scope.dataList.push($scope.myData.data2[i]);
    		}
    		for(var i = 0;i < $scope.myData.data1.length; i++){
    			if($scope.myData.data1[i].deviceType != 'disk'){
    				$scope.dataList.push($scope.myData.data1[i]);
    			}
    		}
    		
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
				$(this).css("width", hardwareBoxWidth + "px");
			});
			$(".hardwareAttributes").css("width", hardwareBoxWidth - 80 + "px");
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
			
			initChart();
    	}
    }, true);
    
	$scope.drawCpuTrend = function(result){
		   var color1 = 'rgba(0,183,255,0.3)';
		   var color2 = '#00B7FF';
		   var names = [];
		   var seriesdata = [];
		   
		   names.push($scope.vmName)
		   var ratesdata = result;
			  
		   seriesdata.push({
				name : $scope.vmName,
				type : 'line',
				showAllSymbol : true,
				smooth : true,
				itemStyle:{normal:{areaStyle:{type:'default',color:color1},lineStyle:{color:color2,width:1}}},
				symbolSize:0,
				data : (function(rates) {
					var d = [];
					for (var j=0;j<rates.length;j++){
						d.push([new Date(rates[j].time),
						        rates[j].rate.toFixed(2) - 0 ]);
					}
					return d;
				})(ratesdata)
			})//放置一个linechart
				
			
		 if(angular.isArray(result) && result.length > 0){
			$scope.vmCpuRateChart = echarts.init(document.getElementById("cpuChart"));
		 } 
		 var vmTrendOption = {
		    		    tooltip : {
		    		        trigger: 'item',
		    		        formatter : function (params) {
		    		            var date = new Date(params.value[0]);
		    		            data = date.getFullYear() + '-'
		    		                   + (date.getMonth() + 1) + '-'
		    		                   + date.getDate() + ' '
		    		                   + date.getHours() + ':'
		    		                   + date.getMinutes();
		    		            return $scope.vmName+'<br/>'
		    		                   + data + '<br/>'
		    		                   + params.value[1] ;
		    		        }
		    		    },
		    		    legend : {
		    		        data : names,
		    		        y:'bottom',
		    		        show:false
		    		    },
		    		    grid: {
		    		    	x: 50,
		    		    	x2:30,
		    		        y: '10%',
		    		        y2: '10%'
		    		    },
		    		    xAxis : [
		    		        {
		    		            type : 'time',
		    		            splitNumber:6,
		    		            axisLabel : {
		    		                formatter: function(value){
		    		                	var hour = value.getHours();
		    		                	var minute = value.getMinutes();
		    		                	if(minute < 10){
		    		                		minute = '0' + minute;
		    		                	}
		    		                	return hour + ":" + minute;
		    		                }
		    		            },
		    		            axisLine : {
		    		            	lineStyle : {
		    		            		width : 1
		    		            	}
		    		            }
		    		        }
		    		    ],
		    		    yAxis : [
		    		        {
		    		            type : 'value',
		    		            max : 100,
		    		            axisLabel : {
		    		                formatter: '{value}%'
		    		            },
		    		            axisLine : {
		    		            	lineStyle : {
		    		            		width : 1
		    		            	}
		    		            }
		    		        }
		    		    ],
		    		    series :seriesdata,
		    		    animation:false
		    		};
		 if(angular.isArray(result) && result.length > 0){
			 $scope.vmCpuRateChart.setOption(vmTrendOption); 
		 }
		
	};	
	$scope.drawMemTrend = function(result){
		var color1 = 'rgba(134,204,22,0.3)';
		var color2 = '#86CC16';
		var names = [];
		   var seriesdata = [];
		   
		   names.push($scope.vmName)
		   var ratesdata = result;
			  
		   seriesdata.push({
				name : $scope.vmName,
				type : 'line',
				showAllSymbol : true,
				smooth : true,
				itemStyle:{normal:{areaStyle:{type:'default',color:color1},lineStyle:{color:color2,width:1}}},
				symbolSize:0,
				data : (function(rates) {
					var d = [];
					for (var j=0;j<rates.length;j++){
						d.push([new Date(rates[j].time),
						        rates[j].rate.toFixed(2) - 0 ]);
					}
					return d;
				})(ratesdata)
			})//放置一个linechart
				
			
		  if(angular.isArray(result) && result.length > 0){
			  $scope.vmMemRateChart = echarts.init(document.getElementById("memoryChart"));
		  } 
		 var vmTrendOption = {
		    		    tooltip : {
		    		        trigger: 'item',
		    		        formatter : function (params) {
		    		            var date = new Date(params.value[0]);
		    		            data = date.getFullYear() + '-'
		    		                   + (date.getMonth() + 1) + '-'
		    		                   + date.getDate() + ' '
		    		                   + date.getHours() + ':'
		    		                   + date.getMinutes();
		    		            return $scope.vmName+'<br/>'
		    		                   + data + '<br/>'
		    		                   + params.value[1] ;
		    		        }
		    		    },
		    		    legend : {
		    		        data : names,
		    		        y:'bottom',
		    		        show:false
		    		    },
		    		    grid: {
		    		    	x: 50,
		    		    	x2:30,
		    		        y: '10%',
		    		        y2: '10%'
		    		    },
		    		    xAxis : [
		    		        {
		    		            type : 'time',
		    		            splitNumber:6,
		    		            axisLabel : {
		    		                formatter: function(value){
		    		                	var hour = value.getHours();
		    		                	var minute = value.getMinutes();
		    		                	if(minute < 10){
		    		                		minute = '0' + minute;
		    		                	}
		    		                	return hour + ":" + minute;
		    		                }
		    		            },
		    		            axisLine : {
		    		            	lineStyle : {
		    		            		width : 1
		    		            	}
		    		            }
		    		        }
		    		    ],
		    		    yAxis : [
		    		        {
		    		            type : 'value',
		    		            max : 100,
		    		            axisLabel : {
		    		                formatter: '{value}%'
		    		            },
		    		            axisLine : {
		    		            	lineStyle : {
		    		            		width : 1
		    		            	}
		    		            }
		    		        }
		    		    ],
		    		    series :seriesdata,
		    		    animation:false
		    		};
		 if(angular.isArray(result) && result.length > 0){
			 $scope.vmMemRateChart.setOption(vmTrendOption); 
		 }
		
	}
   
	$scope.loadTrend = function(){
		
		$http({
			method : 'GET',
			url : 'domain/cpuTrend',
			params: {id : $scope.vmId, cloudId : $scope.cloudId}
		}).success(function(result) {
			$scope.drawCpuTrend(result.data);
		});
		$http({
			method : 'GET',
			url : 'domain/memoryTrend',
			params: {id : $scope.vmId, cloudId : $scope.cloudId}
		}).success(function(result) {
			$scope.drawMemTrend(result.data);
		});
    }
	var initChart = function() {
    	var parentWidth = $(".overview-col").width();
    	var parentHeight = $(".overview-col").height();
    	$(".chartStyle").css("width", parentWidth + "px");
    	$(".chartStyle").css("height", parentHeight - 50 + "px");
    	$(".altStyle").css("padding-left", parentWidth/2 - 30 + 'px');
    	$(".altStyle").css("padding-top", parentHeight/2 - 40 + 'px');
    	$(".altStyle").css("font-size", "12px");
    	$scope.loadTrend();
    }
	$timeout(function(){
		$scope.loadTrend();
	});
	
	var timeTicket = $interval($scope.loadTrend, $scope.cycle);
	
	$scope.$on("$destroy", function(){
		$interval.cancel(timeTicket);
		$("#main").css("overflow", "auto");
		$(window).off("resize", onResize);
		//销毁echarts实例
		EchartService.dispose($scope.vmCpuRateChart, $scope.vmMemRateChart);
    });
	
    //刷新整个页面函数
    $scope.refresh = function() {
    	$scope.getDomainSummary();
    	$scope.getDomainStorage();
    	$scope.getDomainNet();
    	$scope.loadTrend();
    	
    }
    //接收刷新页面的事件
    $scope.$on('onMessage', function(event,msg){
    	if (angular.isArray(msg.refreshData)) {
    		var data = msg.refreshData[0];
    		if (angular.isDefined(data)) {
    			if (data.value == $scope.vmId) {
    				$scope.refresh();
    			}
    		}
    	}
    	
    });
    $scope.$on('onRefreshVmInfo', function(event,msg){
        if (msg.id == $scope.vmId) {
            $scope.refresh();
        }
    });
    $scope.$on('onUpdateVmTitle', function(event, msg){
    	if (msg.id == $scope.vmId) {
    		$scope.summary.title = msg.title;
    	}
    });
    $scope.getHoverTitle = function(item){
    	if(item.deviceType == 'cpu'){
    		return $translate.instant("editDomain.changeCpuQuota");
    	}else if(item.deviceType == 'memory'){
    		return $translate.instant("editDomain.changeMem");
    	}else if(item.deviceType == 'cdrom' && item.name ==''){
    		return $translate.instant("editDomain.mountCdrom");
    	}else if(item.deviceType == 'cdrom' && item.name != ''){
    		return $translate.instant("editDomain.umountCdrom");
    	}else if(item.deviceType == 'floppy' && item.name ==''){
    		return $translate.instant("editDomain.mountFloppy");
    	}else if(item.deviceType == 'floppy' && item.name != ''){
    		return $translate.instant("editDomain.umountFloppy");
    	}
    	
    };
    //修改硬件设备的快捷方式
    $scope.modify = function(item){
    	//修改问题单201605180405，CVM中虚拟机概要页面下，快速连续点击修改内存或修改cpu按钮，页面上会有2到3个同样弹出框。
    	var areawaitId = UtilService.areawait("hardwarePort");
    	$http.get("domain/domainDetail?id=" + $scope.vmId + "&cloudId=" + $scope.cloudId)
	 	  .success(function(result){
	 		UtilService.dismissAreawait(areawaitId);  
	 		$scope.domain = result.data;
	 		var resolve = { vmId: function() {return $scope.vmId;},
			 		 body: function() {return result.data;},
			 		 inRecycle: function() {return 'false';},
			 		 source:function(){
			 			 return item.deviceType;
			 		 }};
	 		 if(angular.isDefined(item.deviceType) && item.deviceType == "cpu"){
	 			var modalInstance = $modal.open({
		  			  templateUrl: 'html/modal/vmEdit/EditCpuNum.html',
		  			  controller: 'EditVmCtrl',
		  			  size : {width:'434px'},
		  			  backdrop:'static',
		  			  resolve: resolve
		  			  }
		  		);
	 			modalInstance.result.then(function(){
	 				$scope.refresh();
	 			}, function(reason){})
	     	}else if(angular.isDefined(item.deviceType) && item.deviceType == "memory"){
	     		var modalInstance = $modal.open({
		  			  templateUrl: 'html/modal/vmEdit/EditMem.html',
		  			  controller: 'EditVmCtrl',
		  			  backdrop:'static',
		  			  size : {width:'434px'},
		  			  resolve: resolve
		  			  }
		  		);
	     		modalInstance.result.then(function(){
	 				$scope.refresh();
	 			}, function(reason){})
	     	}else if(angular.isDefined(item.deviceType) && item.deviceType == "cdrom"){
	     		var index = 0;
	     		for(var i = 0; i < $scope.domain.cDROMList.length; i++){
	     			if($scope.domain.cDROMList[i].deviceName == item.devName){
	     				index = i;
	     				break;
	     			}
	     		}
	     		$scope.index = index;
	     		if(isEmpty(item.name)){
	     			resolve = {
		     				cdrom:function(){
		     					return result.data.cDROMList[index];
		     				},
		     				vmId:function(){
		     					return $scope.vmId;
		     				},
		     				hostId:function(){
		     					return $scope.hostId;
		     				},
		     				clusterId: function(){
		     					return $scope.clusterId;
		     				},
		     				cloudId: function(){
		     					return $scope.cloudId;
		     				}
		     		}
		     		var modalInstance = $modal.open({
		     			templateUrl: 'html/modal/vmEdit/mount.html',
		     			resolve:resolve,
		     			controller:'MountCtrl',
		     			size : {width:'434px'},
		     			backdrop:'static'
		     		});
	     			modalInstance.result.then(function (cdrom) {
						//connect
	     					$scope.domain.operType = 6;
	     					$scope.domain.currentTabId = "cdrom" + $scope.index;
	     					$scope.domain.cDROMList[$scope.index] = cdrom;
					    	$http.put("domain", $scope.domain).success(function(result){
					      	  	UtilService.handleResult(result);
					    		$scope.refresh();
					    	}).error(function(response, code, headers, config) {
					    	  UtilService.handleError(code);
					      });
				       }, function (reason) {
				       });
	     		}else{
	     			//断开连接
					$scope.domain.operType = 5;
					$scope.domain.currentTabId = "cdrom" + $scope.index;
			    	$http.put("domain", $scope.domain).success(function(result){
			      	  	UtilService.handleResult(result);
			      	  	$scope.refresh();
			    	}).error(function(response, code, headers, config) {
			    	  UtilService.handleError(code);
			      });
	     		}
	     		
	     	}else if(angular.isDefined(item.deviceType) && item.deviceType == 'floppy'){
	     		var index = 0;
	     		for(var i = 0; i < $scope.domain.floppyList.length; i++){
	     			if($scope.domain.floppyList[i].deviceName == item.devName){
	     				index = i;
	     				break;
	     			}
	     		}
	     		$scope.index = index;
	     		if(isEmpty(item.name)){
	     			resolve = {
		     				cdrom:function(){
		     					return result.data.floppyList[index];
		     				},
		     				vmId:function(){
		     					return $scope.vmId;
		     				},
		     				hostId:function(){
		     					return $scope.hostId;
		     				},
		     				clusterId: function(){
		     					return $scope.clusterId;
		     				},
		     				cloudId: function(){
		     					return $scope.cloudId;
		     				}
		     		}
		     		var modalInstance = $modal.open({
		     			templateUrl: 'html/modal/vmEdit/mount2.html',
		     			resolve:resolve,
		     			controller:'MountCtrl',
		     			size : {width:'434px'},
		     			backdrop:'static'
		     		});
	     			modalInstance.result.then(function (cdrom) {
						//connect
	     					$scope.domain.operType = 6;
	     					$scope.domain.currentTabId = "floppy" + $scope.index;
	     					$scope.domain.floppyList[$scope.index] = cdrom;
					    	$http.put("domain", $scope.domain).success(function(result){
					      	  	UtilService.handleResult(result);
					    		$scope.refresh();
					    	}).error(function(response, code, headers, config) {
					    	  UtilService.handleError(code);
					      });
				       }, function (reason) {
				       });
					
	     		}else{
	     			//断开连接
					$scope.domain.operType = 5;
					$scope.domain.currentTabId = "floppy" + $scope.index;
			    	$http.put("domain", $scope.domain).success(function(result){
			      	  	UtilService.handleResult(result);
			      	  	$scope.refresh();
			    	}).error(function(response, code, headers, config) {
			    	  UtilService.handleError(code);
			      });
	     		}
	     	}
	  		
	 	  });
    	
    	
    };
});

routeApp.controller("showAdvancedCtrl", function($scope, $modalInstance, summary){
	$scope.summary = summary;
	$scope.cancel = function(){
		$modalInstance.dismiss("cancel");
	}
});
//重复指令, 准备删除
//routeApp.controller("showNetProfileCtrl", function($scope, $modalInstance, $translate, $http, $modal, UtilService,item){
//	var params = {};
//	params.id = item.npId;
//	params.name = item.npName;
//	$http({
//		method : "GET",
//		url : "network/netProfile/info",
//		params : params
//	}).success(function(result){
//		if (result.success){
//			$scope.entry = result.data;
//			$scope.entry.aclId = $scope.entry.aclStrategyId;
//			
//		} else {
//			UtilService.handleResult(result);
//			$modalInstance.dismiss("cancel");
//		}
//	}).error(function(response, code, headers, config) {
//		UtilService.handleError(code);
//	});
//	//查看ACL策略
//    $scope.viewAcl = function(aclId) {
//        var waitModal = UtilService.wait();
//        $http({
//           method: 'GET',
//           url: 'acl/' + aclId
//        }).success(function(result) {
//            waitModal.dismiss();
//            if (result.success == true) {
//                var modalInstance = $modal.open({
//                    templateUrl: 'html/modal/systemManage/addAcl.html',
//                    controller: 'addAclCtrl',
//                    size:'lg',
//                    backdrop:'static',
//                    resolve: {
//                        entry: function() {
//                           return result.data;
//                        },
//                        type:function() {
//               	        return "view";
//                        }	
//                    }
//                });
//            } else {
//                UtilService.handleError(result.errorCode);
//            }           
//        }).error(function(response, code, headers, config) {
//            waitModal.dismiss();
//            UtilService.handleError(code);
//        });
//    };
//	$scope.cancel = function() {
//		$modalInstance.dismiss("cancel");
//	}
//});	
routeApp.controller("showMoreCtrl", function($scope, $modalInstance,$translate,$modal, item, cloudId){
	$scope.item = angular.copy(item);
	if($scope.item.deviceType == 'disk'){
		$scope.item.deviceType = $translate.instant("addDomain.disk");
	}else if($scope.item.deviceType == 'cdrom'){
		$scope.item.deviceType = $translate.instant("common.cdrom")
	}else if($scope.item.deviceType == 'floppy'){
		$scope.item.deviceType = $translate.instant("addDomain.floppy");
	}
	var resolve = {
			item : function(){
				return $scope.item;
			},
			cloudId : function() {
				return cloudId;
			}
	}
	$scope.openNetProfile = function() {
		var modalInstance = $modal.open({
			templateUrl:"html/modal/cloudResource/viewNetworkStrategy.html",
			controller: 'showNetProfileCtrl',
			backdrop:true,
			resolve: resolve
		});
	}
	$scope.cancel = function(){
		$modalInstance.dismiss("cancel");
	}
});
routeApp.controller("showNetProfileCtrl", function($scope, $modalInstance, $translate, $http, $modal, UtilService,item,cloudId){
	var params = {};
	params.id = item.npId;
	params.name = item.npName;
	params.cloudId = cloudId;
	$http({
		method : "GET",
		url : "network/netProfile/info",
		params : params
	}).success(function(result){
		if (result.success){
			$scope.entry = result.data;
			$scope.entry.aclId = $scope.entry.aclStrategyId;
			
		} else {
			UtilService.handleResult(result);
			$modalInstance.dismiss("cancel");
		}
	}).error(function(response, code, headers, config) {
		UtilService.handleError(code);
	});
	//查看ACL策略
    $scope.viewAcl = function(aclId) {
        var waitModal = UtilService.wait();
        $http({
           method: 'GET',
           url: 'acl/' + aclId
        }).success(function(result) {
            waitModal.dismiss();
            if (result.success == true) {
                var modalInstance = $modal.open({
                    templateUrl: 'html/modal/systemManage/addAcl.html',
                    controller: 'addAclCtrl',
                    size:'lg',
                    backdrop:'static',
                    resolve: {
                        entry: function() {
                           return result.data;
                        },
                        type:function() {
               	        return "view";
                        }	
                    }
                });
            } else {
                UtilService.handleError(result.errorCode);
            }           
        }).error(function(response, code, headers, config) {
            waitModal.dismiss();
            UtilService.handleError(code);
        });
    };
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
});	
/*修改虚拟机显示名称*/
routeApp.controller('ModifyVmTitleCtrl',function($scope, $rootScope, $http, $translate, $modalInstance, vmId, title, cloudId, UtilService, HttpService) {
	  $scope.vm ={};
	  $scope.vm.id = parseInt(vmId);
	  $scope.vm.title = title;
	  $scope.vm.publicCloudId = parseInt(cloudId);
	  var callback = function() {
		  $rootScope.$broadcast("onUpdateVmTitle", $scope.vm);
	  }
	  $scope.ok = function () {
		  HttpService.put('domain/rename', $scope.vm, $modalInstance, callback);
	  };
	  
	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
});
routeApp.controller("EditVmCtrl", function($scope, $rootScope, $http, $modal, $translate, $timeout, vmId, inRecycle,  body, source, $modalInstance, HttpService, UtilService) {
	$scope.domain = body;
	$scope.vmId = vmId;
	$scope.hostId = body.hostId;
	$scope.cloudId = body.cloudId;
	$scope.inRecycle = inRecycle;
	$scope.ableModify = 'true';
	$scope.lastTab = '#overview';
	if(inRecycle == 'false'){
		$http({
			method: "GET",
			url: "domain/ableModify",
			params: {
				id : vmId,
				cloudId : $scope.cloudId
			}
		}).success(function(result){
			if(!result.data){
				$scope.ableModify = 'false';
			}
		})
	}
	$scope.domain.isAntivirusConfigured = false;
	$http({
		method: "GET",
		url: "antivirus/isConfigured",
		params: {
			cloudId: $scope.cloudId
		}
	}).success(function(result) {
		$scope.domain.isAntivirusConfigured = result.data;
	}).error(function(response, code, headers, config) {
		UtilService.handleError(code);
  });;
	
	$scope.haEnable = 0;
	$http({
		method: "GET",
		url: "host/ha",
		params: {
			hostId : $scope.hostId,
			cloudId : $scope.cloudId
		}
	}).success(function(result){
		$scope.haEnable = result.data;
	});
	$scope.tpmOptions = [];
	$http({
		method: "GET",
		url: "host/tpm",
		params: {
			hostId : $scope.hostId,
			cloudId : $scope.cloudId
		}
	}).success(function(result){
		if(angular.isArray(result.data)){
			for(var i = 0; i < result.data.length; i++){
				$scope.tpmOptions.push({value:result.data[i].name, label:result.data[i].name});
			}
		}
	});	
	if(source == 'cpu'){
		$scope.domain.operType = 1;
		$scope.domain.source = 'cpu';
		$scope.dirty = false;
		var first = true;
		$scope.$watch("domain.cpu.cpudetail", function(){
			if(first == true){
				first = !first;
			}else{
				$scope.dirty = true;
			}
		}, true);
	}else if(source == 'memory'){
		$scope.dirty = false;
		$scope.domain.operType = 2;
		$scope.domain.source = 'memory';
		$timeout(function(){
			var max = $scope.domain.mem.detail.maxMemory;
	        var min = 512;
	        if($scope.domain.mem.detail.curMemoryUnit == 'GB'){
	        	var min = 1024;
	        }
	        var spinner = $("#quickChangeMem").spinner();
	        if($scope.domain.mem.detail.curMemoryUnit == 'MB'){
			} else {
				max = UtilService.transformMBTOGB(max);
			    min = 1;
				
	        	//$scope.domain.mem.detail.maxValue = UtilService.transformMBTOGB($scope.domain.mem.detail.maxValue);
				//$scope.domain.mem.detail.maxMemory = UtilService.transformMBTOGB($scope.domain.mem.detail.maxMemory);
			}
	        $scope.max = max;
	        $scope.min = min;
			$scope.$watch('domain.mem.detail.curMemoryUnit', function(newValue, oldValue){
				if(newValue == 'GB' && oldValue == 'MB'){
					$scope.domain.mem.detail.curValue = UtilService.transformMBTOGB($scope.domain.mem.detail.curValue);
					
					
					$scope.max = UtilService.transformMBTOGB($scope.max);
					$scope.min = 1;
					
				} else if(newValue == 'MB' && oldValue == 'GB'){
					$scope.domain.mem.detail.curValue = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
					
					
					$scope.max = UtilService.transformGBTOMB($scope.max);
					$scope.min = 512;
					
				}
			});
			var first = true;
			$scope.$watch('domain.mem.detail', function(){
				if(first == true){
					first = !first;
				}else{
					$scope.dirty = true;
				}
				
			}, true);
		});
	}else if(source == 'cdrom' || source == 'floppy'){
		$scope.domain.operType = 4;
	}
	$scope.memoryUnit = {
			options:[{value:'MB', label:'MB'},
			         {value:'GB', label:'GB'}]
	};
	
	//各个页签的脏检测数据
	$scope.dirties = {
			overview: false,
			cpu:false,
			memory: false,
			boot: false,
			disks: [],
			cdroms: [],
			floppies: [],
			networks: [],
			sriovs: [],
			displays: [],
			videos: [],
			serials: [],
			safety: false,
			gpus: []
	};
	
	
	$scope.valids = {
			overview: true,
			cpu: true,
			memory: true,
			disks: [],
			networks: [],
			sriovs: [],
			advanced: true,
	}
	
	//数据初始化
	for(var i = 0; i < $scope.domain.diskList.length; i++){
		$scope.dirties.disks[i] = false;
		$scope.valids.disks[i] = true;
	};
	for(var i = 0; i < $scope.domain.floppyList.length; i++){
		$scope.dirties.floppies[i] = false;
	}
	for(var i = 0; i < $scope.domain.cDROMList.length; i++){
		$scope.dirties.cdroms[i] = false;
	}
	for(var i = 0; i < $scope.domain.networkList.length; i++){
		$scope.dirties.networks[i] = false;
		$scope.valids.networks[i] = true;
		$scope.domain.networkList[i].detail.oldMac = $scope.domain.networkList[i].detail.mac;
	}
	for(var i = 0; i < $scope.domain.sriovNetworkList.length; i++){
		$scope.dirties.sriovs[i] = false;
		$scope.valids.sriovs[i] = true;
		$scope.domain.sriovNetworkList[i].detail.oldMac = $scope.domain.sriovNetworkList[i].detail.mac;
	}
	for(var i = 0; i < $scope.domain.displayList.length; i++){
		$scope.dirties.displays[i] = false;
	}
	for(var i = 0; i < $scope.domain.videoList.length; i++){
		$scope.dirties.videos[i] = false;
	}
	for(var i = 0; i < $scope.domain.serialList.length; i++){
		$scope.dirties.serials[i] = false;
	}
	for(var i = 0; i < $scope.domain.gpuList.length; i++){
		$scope.dirties.gpus[i] = false;
	}
	//脏检测
	function isDirty(tabId){
		if("#overview" == tabId){
			return  $scope.dirties.overview;
		}else if("#cpu" == tabId){
			return $scope.dirties.cpu;
		}else if("#memory" == tabId){
			return $scope.dirties.memory;
		}else if("#bootDev" == tabId){
			return $scope.dirties.boot;
		}else if(tabId.startWith("#disk")){
			var panelIndex = tabId.substring(5);
			var index = parseInt(panelIndex);
			return $scope.dirties.disks[index];
		}else if(tabId.startWith("#network")){
			var panelIndex = tabId.substring(8);
			var index = parseInt(panelIndex);
			return $scope.dirties.networks[index];
		} else if (tabId.startWith("#sriov")){
			var panelIndex = tabId.substring(6);
			var index = parseInt(panelIndex);
			return $scope.dirties.sriovs[index];
		} else if(tabId.startWith("#floppy")){
			var panelIndex = tabId.substring(7);
			var index = parseInt(panelIndex);
			return $scope.dirties.floppies[index];
		}else if(tabId.startWith("#cdrom")){
			var panelIndex = tabId.substring(6);
			var index = parseInt(panelIndex);
			return $scope.dirties.cdroms[index];
		}else if(tabId.startWith("#vnc")){
			var panelIndex = tabId.substring(4);
			var index = parseInt(panelIndex);
			return $scope.dirties.displays[index];
		}else if(tabId.startWith("#videoCard")){
			var panelIndex = tabId.substring(10);
			var index = parseInt(panelIndex);
			return $scope.dirties.videos[index];
		}else if(tabId.startWith("#serial")){
			var panelIndex = tabId.substring(7);
			var index = parseInt(panelIndex);
			return $scope.dirties.serials[index];
		}else if("#advanced" == tabId){
			return $scope.dirties.safety;
		}else if(tabId.startWith("#gpu")){
			var panelIndex = tabId.substring(4);
			var index = parseInt(panelIndex);
			return $scope.dirties.gpus[index];
		}
		return false;
	}
	$scope.modified = false;
	
	$scope.triangle = $('<div id="triangle-right"></div>');
	
	function setOperType(activeId, clickedId){
			$scope.lastTab = clickedId;
			var active = $("#nav-tree li.active");
			var clickedElement = $(clickedId + "-nav");
			if(!active.hasClass("dropdown")){
				$("#triangle-right").remove();
			}
			if(clickedElement.parents(".dropdown-menu.editVmNav").length == 0){
				$scope.triangle.css("left", "58px");
				clickedElement.find("a").append($scope.triangle);
			}
			if(activeId == '#'){
				if(clickedElement.parents(".dropdown-menu.editVmNav").length == 0){
					var topActive = $("#nav-tree .dropdown.active");
					var activeLogo = $(topActive).find(".dropdown-toggle span[class*='Icon']").attr("class").split(" ")[1];
					//var reg = /white/;
					
					var suffix_index = activeLogo.indexOf("_white");
					if(suffix_index != -1){
						var activeLogo2 = activeLogo.substring(0, suffix_index);
					}
					$(topActive).find(".dropdown-toggle span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
				}
				
				
				//var reg = /white/;
				var childActive = $("#nav-tree .dropdown-menu .active");
				if (childActive.length != 0){
					activeLogo = $(childActive).find("span[class*='Icon']").attr("class").split(" ")[1];
				}
				if(activeLogo){
					var suffix_index = activeLogo.indexOf("_white");
					if(suffix_index != -1){
						var activeLogo2 = activeLogo.substring(0, suffix_index);
					}
				}
				$(childActive).find("span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
				
				
				if(clickedElement.parents(".dropdown-menu.editVmNav").length == 0){
					active.removeClass("active");
				}else if(active.length == 2){
					$(active[1]).removeClass("active");
				}
			}else{
				//之前活动区域为顶级列表项的情况
				active.removeClass("active");
				$(activeId + "-nav").removeClass("active");
				var activeLogo = $(activeId + "-nav span[class*='Icon']").attr("class").split(" ")[1];
				//var reg = /white/;
				if(activeLogo){
					var suffix_index = activeLogo.indexOf("_white");
					if(suffix_index != -1){
						var activeLogo2 = activeLogo.substring(0, suffix_index);
					}
				}
				$(activeId + "-nav span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
			}
			
			
			if(clickedId){
				var clickedLogo = $(clickedId + "-nav span[class*='Icon']").attr("class").split(" ")[1];
				//reg = /blue/;
				if(clickedLogo){
					var clickedLogo2 = clickedLogo + "_white";
				} 
				
				$(clickedId + "-nav span[class*='Icon']").removeClass(clickedLogo).addClass(clickedLogo2);
				
				$scope.domain.currentTabId = clickedId.substring(1);
				if("#overview" == clickedId){
					$scope.domain.operType = 0;
				}else if("#cpu" == clickedId){
					$scope.domain.operType = 1;
				}else if("#memory" == clickedId){
					$scope.domain.operType = 2;
				}else if("#bootDev" == clickedId){
					$scope.domain.operType = 3;
				}else if(clickedId.startWith("#disk") || clickedId.startWith("#floppy") || clickedId.startWith("#cdrom")){
					$scope.domain.operType = 4;
				}else if(clickedId.startWith("#network")){
					$scope.domain.operType = 7;
				}else if(clickedId.startWith("#sriov")){
					$scope.domain.operType = 11;
				}else if(clickedId.startWith("#vnc")){
					$scope.domain.operType = 9;
				}else if(clickedId.startWith("#videoCard")){
					$scope.domain.operType = 8;
				}else if("#advanced" == clickedId){
					$scope.domain.operType = 13;
				}else if(clickedId.startWith("#gpu")){
					$scope.domain.operType = 14; // added in 3.0, no operType in 2.0
				} else if (clickedId.startWith("#serial")) {
					$scope.domain.operType = 15;
				}
			}
			
			
	}
	//点击导航项时的逻辑
	$scope.navClicked = function(event){
		//获取点击部位所在的导航项及其id
		var clickedId = $(event.target).attr("data-target");
		if(angular.isUndefined(clickedId)){
			clickedId = $(event.target).parents("a").attr("data-target");
			if(angular.isUndefined(clickedId)){
				clickedId = $(event.target).children("a").attr("data-target");
			}
		}
		var active = $("#nav-tree li.active");
		var activeId = active.children(0).attr("data-target");
		if(active.length == 2){
			var activeIdChild = $(active[1]).children(0).attr("data-target");
		}
		
		if(angular.isDefined(clickedId) && angular.isDefined(activeId) && clickedId == activeId){
			return;
		}else if((angular.isDefined(activeIdChild) && isDirty(activeIdChild)) || (angular.isUndefined(activeIdChild) && isDirty(activeId) ||
				(angular.isUndefined(activeIdChild) && (activeId == '#') && isDirty($scope.lastTab))) ){
			event.stopPropagation();
			var modalInstance = UtilService.confirm($translate.instant("editDomain.switchConfirm"), 
					$translate.instant("editDomain.switchPanel"));
			modalInstance.result.then(function(){
				setOperType(activeId, clickedId);
				$(clickedId+"-nav a").tab('show');
				for(var key in $scope.dirties){
					$scope.dirties[key] = false;
				}
			}, function(){
				$(activeId+"-nav a").tab('show');
			});
		}else{
			setOperType(activeId, clickedId);
		}
	}
	
	//点击下拉菜单时的逻辑
	$scope.dropClicked = function(event){
		var active = $("#nav-tree > li.active");
		var activeId = active.children(0).attr("data-target");
		
		active.removeClass("active");
		if(activeId != '#'){
			var activeLogo = $(activeId + "-nav span[class*='Icon']").attr("class").split(" ")[1];
			//var reg = /white/;
			var suffix_index = activeLogo.indexOf("_white");
			if(suffix_index != -1){
				var activeLogo2 = activeLogo.substring(0, suffix_index);
			}
			$(activeId + "-nav span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
		}if(activeId == '#'){
			var activeLogo = active.find(".dropdown-toggle span[class*='Icon']").attr("class").split(" ")[1];
			//var reg = /white/;
			var suffix_index = activeLogo.indexOf("_white");
			if(suffix_index != -1){
				var activeLogo2 = activeLogo.substring(0, suffix_index);
			}
			active.find(".dropdown-toggle span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
		}
		
		var clickedItem = $(event.target).parents("li") || $(event.target);
		$("#triangle-right").remove();
		$scope.triangle.css("left", "48px");
		clickedItem.find("a[data-target='#']").append($scope.triangle);
		clickedItem.addClass("active");
		var clickedLogo = $(clickedItem).find(".dropdown-toggle>span[class*='Icon']").attr("class").split(" ")[1];
		//reg = /blue/;
		if(clickedLogo){
			var clickedLogo2 = clickedLogo + "_white";
		} 
		
		$(clickedItem).find(".dropdown-toggle>span[class*='Icon']").removeClass(clickedLogo).addClass(clickedLogo2);
		
	}

	$scope.delEnable = false;
	$scope.valid = true;//当前页签
	$scope.$watch("valids", function(newValue, oldValue){
		if($scope.domain.currentTabId == "overview"){
			$scope.valid = $scope.valids.overview;
		}else if($scope.domain.currentTabId.startWith("network")){
			var index = parseInt($scope.domain.currentTabId.substring(7));
			$scope.valid = $scope.valids.networks[index];
		}else if($scope.domain.currentTabId == 'cpu'){
			$scope.valid = $scope.valids.cpu;
		}else if($scope.domain.currentTabId == 'memory'){
			$scope.valid = $scope.valids.memory;
		}else if($scope.domain.currentTabId.startWith("disk")){
			var index = parseInt($scope.domain.currentTabId.substring(4));
			$scope.valid = $scope.valids.disks[index];
		} else if($scope.domain.currentTabId.startWith("sriov")){
			var index = parseInt($scope.domain.currentTabId.substring(5));
			$scope.valid = $scope.valids.sriovs[index];
		} else if ($scope.domain.currentTabId == 'advanced') {
			$scope.valid = $scope.valids.advanced;
		}
	}, true);
	$scope.$watch("dirties", function(){
		$scope.modified = isDirty("#" + $scope.domain.currentTabId);
	}, true);
	$scope.$watch("domain.currentTabId", function(newValue, oldValue){
		//alert(newValue);
		$scope.delEnable = false;
		if(newValue.startWith("disk") || newValue.startWith("floppy") || newValue.startWith("cdrom")
				|| newValue.startWith("network") || newValue.startWith("notepad") || newValue.startWith("vnc")
				|| newValue.startWith("video") || newValue.startWith("serial") || newValue.startWith("usb")
				|| newValue.startWith("pci") || newValue.startWith("sound") || newValue.startWith("gpu")||
				newValue == "tpm" || newValue == "shmem" || newValue.startWith("sriov")){
			$scope.delEnable = true;
		}
		if(newValue == "serial0"){
			$scope.delEnable = false;
		}
		if (newValue.startWith("mouse")){
			var index = parseInt(newValue.substring(5));
			if (index != -1){
				var bus = $scope.domain.mouseList[index].detail.bus;
				if (bus == 'usb'){
					$scope.delEnable = true;
				}
			}
		}
		if(newValue == "overview"){
			$scope.valid = $scope.valids.overview;
		} else if(newValue.startWith("network")){
			var index = parseInt(newValue.substring(7));
			$scope.valid = $scope.valids.networks[index];
		} else{
			$scope.valid = true;
		}
		$scope.modified = isDirty("#" + newValue);
	});
    
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    //添加硬件
    $scope.add = function(){
    	if(isDirty("#"+$scope.domain.currentTabId)){
    		var confirmInstance = UtilService.confirm($translate.instant("editDomain.modifyAddHw"));
    		confirmInstance.result.then(function(){
    			var resolve = { vmId: function() {return $scope.vmId;},
    	 		 		hostId: function() {return $scope.hostId;},
    	 		 		clusterId:function() {return $scope.domain.clusterId},
    	 		 		cloudId:function() {return $scope.domain.cloudId},
    	 		 		isCluster:function() {return $scope.domain.clusterId ? 'true' : 'false'},
    	 		 		name: function() {return $scope.domain.domainName;},
    	 		 		title: function() {return $scope.domain.title;},
    	 		 		domain:function() {return $scope.domain;}
    					};
        		var modalInstance = $modal.open({
    				  templateUrl: 'html/modal/vmEdit/addHw.html',
    				  size: 'lg',
    				  controller: 'AddHardwareCtrl',
    				  backdrop:'static',
    				  resolve:resolve
    				  }
    			);
    			modalInstance.result.then(function(domain){
    				//refresh
    				setToOverview("#" + $scope.domain.currentTabId);
    				$scope.domain = domain;
    				clearDirties("overview");
    				var msg = {};
          	  		msg.refreshData = [];
          	  		var data = {};
          	  		data.value = $scope.domain.id;
          	  		msg.refreshData.push(data);
          	  		$scope.$root.$broadcast("onMessage", msg);
    			}, function(reason){
    				
    			});
    		}, function(){});
    	} else {
    		var resolve = { vmId: function() {return $scope.vmId;},
	 		 		hostId: function() {return $scope.hostId;},
	 		 		clusterId:function() {return $scope.domain.clusterId},
	 		 		cloudId:function() { return $scope.domain.cloudId;},
	 		 		isCluster:function() {return $scope.domain.clusterId ? 'true' : 'false'},
	 		 		name: function() {return $scope.domain.domainName;},
	 		 		title: function() {return $scope.domain.title;},
	 		 		domain:function() {return $scope.domain}
					};
    		var modalInstance = $modal.open({
				  templateUrl: 'html/modal/vmEdit/addHw.html',
				  size: 'lg',
				  controller: 'AddHardwareCtrl',
				  backdrop:'static',
				  resolve:resolve
				  }
			);
			modalInstance.result.then(function(domain){
				//refresh
				setToOverview("#" + $scope.domain.currentTabId);
				$scope.domain = domain;
				clearDirties("overview");
				var msg = {};
      	  		msg.refreshData = [];
      	  		var data = {};
      	  		data.value = $scope.domain.id;
      	  		msg.refreshData.push(data);
      	  		$scope.$root.$broadcast("onMessage", msg);
				
			}, function(reason){
				
			});
    	}
    	
    }
    //删除硬件
    $scope.del = function(){
    	$scope.devType = 0;
		var activeId = "#" + $scope.domain.currentTabId;
		var isVirtio = false;
		var obj = {};
		obj.id = $scope.vmId;
		obj.name = $scope.domain.domainName;
		obj.title = $scope.domain.title;
		if(activeId.startWith("#disk")){
			var panelIndex = activeId.substring(5);
			var index = parseInt(panelIndex);
			var deviceName = $scope.domain.diskList[index].detail.deviceName;
			var status = $scope.domain.summary.detail.status;
			var dispName = $scope.domain.diskList[index].dispName ? $scope.domain.diskList[index].dispName : "";
			isVirtio = (dispName.indexOf("Virtio") != -1);
			if(status == 'running' || status == 'paused'){
				if(isVirtio == true){
					var msg = $translate.instant("editDomain.runningVirtioInfo");
				}else{
					var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.diskList[index].dispName}) 
							+ $translate.instant("editDomain.runningDiskInfo");
				}
			}else{
				var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.diskList[index].dispName});
			}
			obj.storage = {};
			obj.storage.deviceName = deviceName;
			$scope.devType = 1;
		}else if(activeId.startWith("#floppy")){
			var panelIndex = activeId.substring(7);
			var index = parseInt(panelIndex);
			var deviceName = $scope.domain.floppyList[index].detail.deviceName;
			obj.storage = {};
			obj.storage.deviceName = deviceName;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.floppyList[index].dispName});
			$scope.devType = 1;
		}else if(activeId.startWith("#cdrom")){
			var panelIndex = activeId.substring(6);
			var index = parseInt(panelIndex);
			var deviceName = $scope.domain.cDROMList[index].detail.deviceName;
			obj.storage = {};
			obj.storage.deviceName = deviceName;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.cDROMList[index].dispName});
			$scope.devType = 1;
		}else if(activeId.startWith("#network")){
			var panelIndex = activeId.substring(8);
			var index = parseInt(panelIndex);
			var macAddr = $scope.domain.networkList[index].detail.mac;
			obj.network = {};
			obj.network.mac = macAddr;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.networkList[index].dispName});
			$scope.devType = 2;
		}else if(activeId.startWith("#sriov")){
			var panelIndex = activeId.substring(6);
			var index = parseInt(panelIndex);
			var macAddr = $scope.domain.sriovNetworkList[index].detail.mac;
			obj.network = {};
			obj.network.mac = macAddr;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.sriovNetworkList[index].dispName});
			$scope.devType = 11;
			obj.network.devType = 11;
		}else if(activeId.startWith("#notepad")){
			var panelIndex = activeId.substring(8);
			var index = parseInt(panelIndex);
			obj.input = {};
			obj.input.bus = $scope.domain.tabletList[index].detail.bus;
			obj.input.type = "tablet";
			var msg = $translate.instant("editDomain.delNotepadInfo",{"dispName":$scope.domain.tabletList[index].dispName});
		}else if(activeId.startWith("#mouse")){
			var panelIndex = activeId.substring(6);
			var index = parseInt(panelIndex);
			obj.input = {};
			obj.input.bus = $scope.domain.mouseList[index].detail.bus;
			obj.input.type = "mouse";
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.mouseList[index].dispName});
		}else if(activeId.startWith("#vnc")){
			var panelIndex = activeId.substring(4);
			var index = parseInt(panelIndex);
			obj.vncConfig = {};
			obj.vncConfig.type = $scope.domain.displayList[index].detail.type;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.displayList[index].dispName});
		}else if(activeId.startWith("#sound")){
			var panelIndex = activeId.substring(6);
			var index = parseInt(panelIndex);
			obj.soundType = $scope.domain.soundList[index].type;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.soundList[index].dispName});
		}else if(activeId.startWith("#usb")){
			var panelIndex = activeId.substring(4);
			var index = parseInt(panelIndex);
			obj.usb = {};
			var usb = $scope.domain.usbList[index];
			obj.usb.productId = usb.detail.productId;
			obj.usb.vendorId = usb.detail.vendorId;
			obj.usb.bus = usb.detail.bus;
			obj.usb.device = usb.detail.device;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.usbList[index].dispName});
			$scope.devType = 3;
		}else if(activeId.startWith("#pci")){
			var panelIndex = activeId.substring(4);
			var index = parseInt(panelIndex);
			obj.pci = {};
			var pci = $scope.domain.pciList[index];
			obj.pci.bus = pci.detail.bus;
			obj.pci.slot = pci.detail.slot;
			obj.pci["function"] = pci.detail["function"];
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.pciList[index].dispName});
		}else if(activeId.startWith("#serial")){
			var panelIndex = activeId.substring(7);
			var index = parseInt(panelIndex);
			obj.serial = {};
			obj.serial.port = $scope.domain.serialList[index].detail.targetPort;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.serialList[index].dispName});
		}else if(activeId.startWith("#videoCard")){
			var panelIndex = activeId.substring(10);
			var index = parseInt(panelIndex);
			obj.videoType = "qxl";
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.videoList[index].dispName});
		}else if(activeId.startWith("#gpu")){
			obj.gpuDev = {};
			obj.gpuDev.resPoolId = $scope.domain.gpuList[0].vendorId;
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.gpuList[0].dispName});
		}else if(activeId.startWith("#tpm")){
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.tpm.dispName});
			obj.tpmDev = {};
			obj.tpmDev.tpmPath = $scope.domain.tpm.name;
		}else if(activeId.startWith("#shmem")){
			var msg = $translate.instant("editDomain.delDevInfo", {dispName:$scope.domain.shmem.dispName});
			obj.shmem = {};
			obj.shmem.size = $scope.domain.shmem.value;
		}
		var title = $translate.instant("editDomain.delDevTitle");
    	var modalInstance = UtilService.confirm(msg, title, {"width" : "400px"});
    	modalInstance.result.then(function(){
    		
    		var waitModal = UtilService.wait();
    		$http.post("domain/delDev?cloudId=" + $scope.domain.cloudId, obj).success(function(result){
    			waitModal.dismiss();
          	  	UtilService.handleResult(result);
          	  	if (result.state != 0) {
          	  		return;
          	  	}
          	  	var status = $scope.domain.summary.detail.status;
          	  	if (("running" == status || "paused" == status) && $scope.devType != 1 && $scope.devType != 2 && $scope.devType != 3) {
          	  		UtilService.error($translate.instant("editDomain.editVirtHostPrompt"), $translate.instant("editDomain.editVm"));
          	  	}
          	  	if (("running" == status || "paused" == status) && $scope.devType == 1 && isVirtio == false) {
          		    UtilService.error($translate.instant("editDomain.editVirtHostDiskPrompt"), $translate.instant("editDomain.editVm"));
          	  	}
    			$http.get("domain/domainDetail?id=" + $scope.vmId + "&cloudId=" + $scope.domain.cloudId).success(function(domain){
    				setToOverview("#" + $scope.domain.currentTabId);
    				
    				$scope.domain = domain.data;
    				clearDirties("overview");
    				var msg = {};
          	  		msg.refreshData = [];
          	  		var data = {};
          	  		data.value = $scope.domain.id;
          	  		msg.refreshData.push(data);
          	  		$scope.$root.$broadcast("onMessage", msg);
    				
        		});
    			
    		}).error(function(response, code, headers, config) {
      	      	  waitModal.dismiss();
    	    	  UtilService.handleError(code);
    	});
    	}, function(){});
		
    }
    function setToOverview(activeId){
    	$("#triangle-right").remove();
    	if($(activeId + "-nav").parents(".dropdown").length != 0){
    		//修改删除/添加了下拉菜单项的顶级菜单图标颜色 white -> blue
    		var topActive = $("#nav-tree .dropdown.active");
			var activeLogo = $(topActive).find(".dropdown-toggle>span[class*='Icon']").attr("class").split(" ")[1];
			//var reg = /white/;
			if(activeLogo){
				var suffix_index = activeLogo.indexOf("_white");
				if(suffix_index != -1){
					var activeLogo2 = activeLogo.substring(0, suffix_index);
				}
			}
			$(topActive).find(".dropdown-toggle>span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
    	}
    	if($("#nav-tree > .active")){
    		var topActive = $("#nav-tree > .active");
			var activeLogo = $(topActive).children("a").find("span[class*='Icon']").attr("class").split(" ")[1];
			//var reg = /white/;
			if(activeLogo){
				var suffix_index = activeLogo.indexOf("_white");
				if(suffix_index != -1){
					var activeLogo2 = activeLogo.substring(0, suffix_index);
				}
			}
			$("#nav-tree > li.active > a > span[class*='Icon']").removeClass(activeLogo).addClass(activeLogo2);
    	}
    	
    	//handle triangle
    	$scope.triangle.css("left", "58px");
    	$("#overview-nav a").append($scope.triangle);
    	//overview img color blue -> white
    	var overviewLogo = $("#overview-nav").find("span[class*='Icon']").attr("class").split(" ")[1];
    	//var reg = /blue/;
    	overviewLogo2 = overviewLogo + "_white";
    	$("#overview-nav").find("span[class*='Icon']").removeClass(overviewLogo).addClass(overviewLogo2);
    	$("#overview-nav a").tab('show');
    	$scope.lastTab = "#overview";
    	clearDirties("overview");
    }
    function clearDirties(tabId){
    	if("overview" == tabId){
			$scope.dirties.overview = false;
		}else if("cpu" == tabId){
			$scope.dirties.cpu = false;
		}else if("memory" == tabId){
			$scope.dirties.memory = false;
		}else if("bootDev" == tabId){
			$scope.dirties.boot = false;
		}else if(tabId.startWith("disk")){
			var panelIndex = tabId.substring(4);
			var index = parseInt(panelIndex);
			$scope.dirties.disks[index] = false;
		}else if(tabId.startWith("network")){
			var panelIndex = tabId.substring(7);
			var index = parseInt(panelIndex);
			$scope.dirties.networks[index] = false;
		} else if(tabId.startWith("sriov")){
			var panelIndex = tabId.substring(5);
			var index = parseInt(panelIndex);
			$scope.dirties.sriovs[index] = false;
		} else if(tabId.startWith("floppy")){
			var panelIndex = tabId.substring(6);
			var index = parseInt(panelIndex);
			$scope.dirties.floppies[index] = false;
		}else if(tabId.startWith("cdrom")){
			var panelIndex = tabId.substring(5);
			var index = parseInt(panelIndex);
			$scope.dirties.cdroms[index] = false;
		}else if(tabId.startWith("vnc")){
			var panelIndex = tabId.substring(3);
			var index = parseInt(panelIndex);
			$scope.dirties.displays[index] = false;
		}else if(tabId.startWith("videoCard")){
			var panelIndex = tabId.substring(9);
			var index = parseInt(panelIndex);
			$scope.dirties.videos[index] = false;
		}else if(tabId.startWith("serial")){
			var panelIndex = tabId.substring(6);
			var index = parseInt(panelIndex);
			$scope.dirties.serials[index] = false;
		}else if("advanced" == tabId){
			$scope.dirties.safety = false;
		}else if(tabId.startWith("gpu")){
			var panelIndex = tabId.substring(3);
			var index = parseInt(panelIndex);
			$scope.dirties.gpus[index] = false;
		}
    } 
    $scope.ok = function () {
    	if($scope.domain.operType == 1){
    		var cpu = Number($scope.domain.cpu.cpudetail.cpuSocket) * Number($scope.domain.cpu.cpudetail.cpuCore);
    		if (cpu > constant.VM_CPU_MAX_NUM2){
    			UtilService.error($translate.instant("editDomain.cpuMax128Prompt"));
    			return;
    		}
    		if (cpu > $scope.domain.cpu.cpudetail.maxValue){
    			UtilService.error($translate.instant("editDomain.cpuMaxPrompt", {maxCpuSocket:$scope.domain.cpu.cpudetail.maxValue}));
    			return;
    		}
    	}
    	if ($scope.domain.operType == 7){
    		var tabId = $scope.domain.currentTabId;
    		var index = parseInt(tabId.substring(7));
    		var network = $scope.domain.networkList[index];
    		if(network.detail.casConfig == true){
    			if(!isEmpty(network.detail.ip) && network.detail.ip == network.detail.gateway){
    				UtilService.error($translate.instant("editDomain.ipGatewaySameAlert"), $translate.instant("common.opertip"));
    				return;
    			}
    			if(!isEmpty(network.detail.dns) && network.detail.dns == network.detail.secondDns){
    				UtilService.error($translate.instant("editDomain.dnsSameAlert"), $translate.instant("common.opertip"));
    				return;
    			}
    		}
    	}
    	
    	if($scope.domain.operType == 13){
    		if ($scope.domain.safety.spiceTls == true && 
        			(angular.isArray($scope.domain.safety.spiceChannels)&&$scope.domain.safety.spiceChannels.length==0)) {
    			UtilService.error($translate.instant("editDomain.checkSpiceName"));
    			return;
    		}
    		if ($scope.domain.safety.spiceTls == true && $scope.domain.safety.ifSupSpice == false) {
    			UtilService.error($translate.instant("editDomain.spiceUnOpen"));
    			return;
    		}
    	}
    	
    	if($scope.domain.operType != 14){
    		var waitModal = UtilService.wait();
    		$http.put("domain", $scope.domain).success(function(result){
        		waitModal.dismiss();
          	  	UtilService.handleResult(result);
          	  	for(var i = 0; i < $scope.domain.networkList.length; i++){
          	  		$scope.domain.networkList[i].detail.oldMac = $scope.domain.networkList[i].detail.mac;
          	  	}
          	  	for (var i = 0; i < $scope.domain.sriovNetworkList.length; i++){
          	  		$scope.domain.sriovNetworkList[i].detail.oldMac = $scope.domain.sriovNetworkList[i].detail.mac;
          	  	}
          	  	$timeout(function(){
    	      	  	if($scope.domain.operType == 0){
    	          		//rename
    	          		var entity = {};
    	          		entity.eventType = 22;
    	          		entity.refreshData = [];
    	          		entity.refreshData[0] = {};
    	          		entity.refreshData[0].value = $scope.domain.id;
    	          		handleVmTaskEvent($rootScope, entity, $http);
    	          		var msg = {};
    	    			msg.title = $scope.domain.summary.detail.title;
    	    			$scope.$root.$broadcast('onUpdateVmTitle', msg);
    	          	}
          	  	}, 3000);
          	  	
        		$scope.modified = false;
          	  	clearDirties($scope.domain.currentTabId);
          	  	if(source == 'cpu' || source == 'memory' || source == 'cdrom' || source == 'floppy'){
          	  		$modalInstance.close(source);
          	  	}else{
          	  		//tell vm overview page to refresh data
          	  		var msg = {};
          	  		msg.refreshData = [];
          	  		var data = {};
          	  		data.value = $scope.domain.id;
          	  		msg.refreshData.push(data);
          	  		$scope.$root.$broadcast("onMessage", msg);
          	  	}
          	  	if ($scope.domain.operType == 4) {
          	  		var msg = {};
          	  		$scope.$root.$broadcast('onCapacityChange', msg);
          	  	}
        	}).error(function(response, code, headers, config) {
          	  waitModal.dismiss();
        	  UtilService.handleError(code);
          });
    	}else if($scope.domain.operType == 14){
    		var gpu = {};
    		gpu.domainId = $scope.domain.id;
    		gpu.resPoolId = $scope.domain.gpuList[0].resPoolId;
    		gpu.resPoolName = $scope.domain.gpuList[0].resPool;
    		gpu.businessTempId = $scope.domain.gpuList[0].businessTemId;
    		gpu.businessTempName = $scope.domain.gpuList[0].businessTem;
    		HttpService.put("resPool/vm", gpu, undefined, function(){
    			$scope.modified = false;
          	  	clearDirties($scope.domain.currentTabId);
    		});
    	}
        
    };
    
    $scope.close = function() {
    	//alert(body);
    	$modalInstance.dismiss('cancel');
    }
});
routeApp.controller("BindVCPUCtrl",function($scope,vmId, body, isAdd, $state, $http, $location, $modal, $modalInstance, $translate, UtilService, HttpService){
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.close = function () {
		
		$modalInstance.dismiss('cancel');
	};
	$scope.ok = function () {
		$modalInstance.close($scope.mySelections);
	}
	
	$scope.bindData = getBindData();
	function getBindData(){
		var totalVCPU = body.cpu.cpudetail.cpuSocket*body.cpu.cpudetail.cpuCore;
		var data = [];
		$scope.mySelections = [];
		for(i = 0; i < totalVCPU; i++){
			var lineItem = {};
			lineItem.vcpu = $translate.instant("editDomain.VCPU") + i;
			lineItem.vcpuId = i;
			lineItem.pcpu = "";
			var bindings = body.cpu.cpudetail.bindPhysicalCpu;
			for(tmpIndex = 0; tmpIndex < bindings.length; tmpIndex++ ){
				
				if(bindings[tmpIndex].vcpu == i){
					pcpus = bindings[tmpIndex].cpuset.split(",");
					for(j = 0; j < pcpus.length; j++){
						lineItem.pcpu += $translate.instant("editDomain.PCPU") + pcpus[j] + ' ';
						var selection = {};
						selection.text = $translate.instant("editDomain.PCPU") + pcpus[j];
						selection.entryId = pcpus[j];
						selection.id = parseInt(pcpus[j]);
						selection.entryType = 'cpu';
						$scope.mySelections[i] = [];
						$scope.mySelections[i].push(selection);
					}
				}
			}
			data.push(lineItem);
			
		}
		return data;
	}
	
	
	var column = [{field:'vcpu',displayName:$translate.instant("editDomain.VCPU"), width:'25%'},
	              {field:'pcpu', displayName:$translate.instant("editDomain.PCPU"), cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><div  id="vcpu{{row.entity.vcpuId}}" custom-title="{{row.entity.pcpu}}">' +
	            	  '{{row.entity.pcpu}}</div></div>'},
	              {field:'browse', displayName:'', width:'15%', cellTemplate:'<div>' + 
	            	  '<div class="ngCellButton"><div type="button" class="btn btn-sm-icon icon-search-gray" ng-click="edit(row.entity)" custom-title="'+$translate.instant('editDomain.bindCpu')+'"></div></div>'}];
	$scope.gridOptions = {
			multiSelect: false,
			data: 'bindData',
			enableSorting:false,
			i18n: $translate.instant('lang'),
			columnDefs:column
	};
	var getCheckType = function(entity) {
		if (angular.isArray($scope.preSelect) && $scope.preSelect.length > 0 && entity.vcpuId == $scope.preVcpuId) {
			return $scope.preSelect[0].entryType;
		}
		if (isAdd == false && body.numa.detail.associate == true) {
			return "numa";
		}
		return 'cpu';
	}
	$scope.edit = function(entity){
		var size = {'width' : '600px'};
		var modalInstance = $modal.open({  
            templateUrl: 'html/modal/vmEdit/bindPhysicalCPU.html',  
            controller: 'BindPCPUCtrl',  
            backdrop: 'static',
            size: size,
            resolve: { 
            	domain: function () {
            		return body;
            	},
                vcpu: function () {
                	return entity.vcpuId;
                },
                isAdd: function() {
                	return isAdd;
                },
                preSelect: function() {
                	if (entity.vcpuId == $scope.preVcpuId){
                		return $scope.preSelect;
                	} else {
                		return undefined;
                	}
                	
                },
                checkType: function() {
                	return getCheckType(entity);
                }
            }  
        });  
          
        modalInstance.result.then(function (checkedNodes) {  
        	 $scope.preSelect = checkedNodes;
             $scope.mySelections[entity.vcpuId] = checkedNodes;
             var showSelection = "";
             for(var i = 0; i < $scope.mySelections[entity.vcpuId].length; i++){
            	 if($scope.mySelections[entity.vcpuId][i].entryType == 'cpu'){
            		 showSelection += $scope.mySelections[entity.vcpuId][i].text + " "; 
            	 }
             }
             //修改问他单：201603280433  排序后各行数据错乱
             entity.pcpu = showSelection;
             $scope.preVcpuId = entity.vcpuId;
        }, function (reason) {  
              
        });  
	}
}); 

routeApp.controller("BindPCPUCtrl",function($scope, vcpu, domain, isAdd, preSelect,checkType, $state, $http, $location, $modal, $modalInstance, $translate, UtilService, HttpService){
	$scope.domain = domain;
	$scope.hostId = $scope.domain.hostId;
	$scope.cloudId = $scope.domain.cloudId;
	$scope.vcpu = vcpu;
	$scope.isAdd = isAdd;
	$scope.preSelect = preSelect;
	$scope.entry = {};
	if (checkType == 'numa'){
		$scope.entry.checkType = 'numa';
	} else {
		$scope.entry.checkType = 'cpu';
	}
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	}
	$scope.ok = function (){
		var cpuTree = $('#hostCpuTree').data('treeview');
		var checkedNodes = cpuTree.getChecked();
		$modalInstance.close(checkedNodes);
	}
	
});
routeApp.controller("AddHardwareCtrl", function($scope,$http, hostId, vmId,cloudId, name, title, clusterId, isCluster,domain,$modal,$modalInstance, $translate,$timeout,UtilService,HttpService,GridService){
	$scope.hostId = hostId;
	$scope.vmId = vmId;
	$scope.name = name;
	$scope.title = title;
	$scope.licenseVersion = {};
	$scope.cloudId = cloudId;
	
	$scope.stepTitles = [$translate.instant("addHw.addHwStepOne"),
	               $translate.instant("addHw.addHwStepTwo")];
	$scope.valids={	stepOneOver:function(){
						if($("#hwForm1").val()==="true")
							return true;
						return false;
					},
					stepTwoOver:function(){
						if($("#hwForm2").val()==="true"){
							if($scope.model.type=='usb'&&$scope.mySelections1.length<1){
								return false;
							}
							if($scope.model.type=='pci'&&$scope.mySelections2.length<1){
								return false;
							}
							if ($scope.model.type=='tpm'&&!$scope.model.tpm.tpmPath){
								return false;
							}
							return true;
						}
						return false;
					}
	};
	$scope.hwList = [{value: 'storage', label:$translate.instant("addHw.storage")},
	                 {value: 'network', label:$translate.instant("editDomain.network")},
	                 {value: 'input', label:$translate.instant("addHw.input")},
	                 {value: 'console', label:$translate.instant("editDomain.vnc")},
	                 {value: 'sound', label: $translate.instant("addHw.sound")},
	                 {value: 'usb', label: $translate.instant("addHw.usbDevice")},
	                 {value: 'pci', label:$translate.instant("addHw.pci")},
	                 {value: 'video', label:$translate.instant("editDomain.videoCard")},
	                 {value: 'com', label:$translate.instant("editDomain.serial")},
	                 {value: 'tpm', label:$translate.instant("addHw.tpm")}
	                 ];
	$scope.busList = [{value: 'ide', label:$translate.instant("addHw.IDE-hd")},
	                  {value: "scsi", label:$translate.instant("addHw.SCSI-hd")},
	                  {value: "usb", label:$translate.instant("addHw.USB-hd")},
	                  {value: "virtio", label:$translate.instant("addHw.Virtio-hd")},
	                  {value: "ide-cdrom", label:$translate.instant("addHw.IDE-cdrom")},
	                  {value: "fdc", label:$translate.instant("addHw.FDC")},
	                  {value: "virtioScsi", label:$translate.instant("addHw.Virtio-SCSI-hd")}
	                  ];
	//windows系统不支持scsi硬盘
	var system = domain.summary.detail.system;
	if (system == 0) {
		$scope.busList.splice(1,1);
	}
	
	$scope.cacheMethod=[{value: 'directsync', label:$translate.instant("editDomain.directsync")},
		                {value: "writethrough", label:$translate.instant("editDomain.writethrough")},
		                {value: "writeback", label:$translate.instant("editDomain.writeback")},
		                {value: "none", label:$translate.instant("editDomain.none")}
		                ];
	$scope.controllerList = [{value: '0', label:$translate.instant("addHw.create")}];
	var existController = domain.summary.detail.existController;
	if (angular.isArray(existController) && existController.length > 0){
		for (var i = 0; i < existController.length; i++){
			$scope.controllerList.push({value : existController[i], label: "Controller " + existController[i]});
		}
	}
	$scope.deviceType=[{value: 'general', label:$translate.instant("addDomain.generalNetwork")},
		                {value: "virtio", label:$translate.instant("addDomain.virtioNetwork")},
		                {value: "e1000", label:$translate.instant("addDomain.e1000Network")}
		                ];

    //获取License信息函数
	$scope.getLicenseInfo = function() {
		$http.get('license/licenseInfo').success(function(result) {
			if (result.success) {
				if (result.data.cicVer == $translate.instant('licenseMng.versionStandar')) {
					$scope.licenseVersion = 1;
				} else if (result.data.cicVer == $translate.instant('licenseMng.versionEnterprise')) {
					$scope.licenseVersion = 2;
				} else {
					$scope.licenseVersion = 3;
				}
				/*if ($scope.licenseVersion != 1) {//不为标准版，才允许使用sriov
					$scope.deviceType.push({value: "srIov", label:$translate.instant("addDomain.srIovNetwork")});
					$scope.hwList.push({value: 'gpu', label:$translate.instant("addHw.gpu")});
				}*/
			}
		});
	}
	$scope.getLicenseInfo();
	

	$scope.keyboards=[  {value: 'ar', label:$translate.instant("keyboard.argentinaKeyboard")},
		                {value: "da", label:$translate.instant("keyboard.denmarkKeyboard")},
		                {value: "en-gb", label:$translate.instant("keyboard.britainKeyboard")},
		                {value: "et", label:$translate.instant("keyboard.estonianKeyboard")},
		                {value: 'fr', label:$translate.instant("keyboard.frenchKeyboard")},
		                {value: 'fr-ch', label:$translate.instant("keyboard.swissFrenchKeyboard")},
		                {value: "is", label:$translate.instant("keyboard.icelanKeyboard")},
		                {value: "lt", label:$translate.instant("keyboard.lithuaniaKeyboar")},
		                {value: "no", label:$translate.instant("keyboard.norwayKeyboard")},
		                {value: 'pt-br', label:$translate.instant("keyboard.brazilGrapeKeyboard")},
		                {value: "sv", label:$translate.instant("keyboard.swedenKeyboard")},
		                {value: "de", label:$translate.instant("keyboard.germanKeyboard")},
		                {value: "en-us", label:$translate.instant("keyboard.usaKeyboard")},
		                
		                {value: 'fi', label:$translate.instant("keyboard.finlandKeyboard")},
		                {value: "fr-be", label:$translate.instant("keyboard.belgiumFrenchKeyboard")},
		                {value: "hr", label:$translate.instant("keyboard.keluodiyaKeyboard")},
		                {value: "it", label:$translate.instant("keyboard.italyKeyboard")},
		                {value: 'lv', label:$translate.instant("keyboard.latuoweiyaKeyboard")},
		                {value: 'nl', label:$translate.instant("keyboard.hollandKeyboard")},
		                {value: "pl", label:$translate.instant("keyboard.polandKeyboard")},
		                {value: "ru", label:$translate.instant("keyboard.russianKeyboard")},
		                {value: "th", label:$translate.instant("keyboard.thailandKeyboard")},
		                {value: 'common', label:$translate.instant("keyboard.globalKeyboard")},
		                {value: "de-ch", label:$translate.instant("keyboard.swissGermanKeyboard")},
		                {value: "es", label:$translate.instant("keyboard.spanishKeyboard")},
		                {value: "fo", label:$translate.instant("keyboard.faluoKeyboard")},
		                
		                {value: 'fr-ca', label:$translate.instant("keyboard.canadaFrenchKeyboar")},
		                {value: "hu", label:$translate.instant("keyboard.hungaryKeyboard")},
		                {value: "ja", label:$translate.instant("keyboard.japanKeyboard")},
		                {value: "mk", label:$translate.instant("keyboard.makedoniaKeyboard")},
		                {value: 'nl-be', label:$translate.instant("keyboard.belgiumHollandKeyboard")},
		                {value: "pt", label:$translate.instant("keyboard.portugalKeyboard")},
		                {value: "sl", label:$translate.instant("keyboard.skocjanKeyboard")},
		                {value: "tr", label:$translate.instant("keyboard.turkeyKeyboard")}
		                ];
	$scope.usbs=[{value: 'usb1', label:$translate.instant("addHw.usb1")},
		         {value: "usb2", label:$translate.instant("addHw.usb2")},
		         {value: "usb3", label:$translate.instant("addHw.usb3")}
		        ];
	$scope.serials = [{value : '0', label : $translate.instant("addHw.serialPortDev")},
	                  {value : '1', label : $translate.instant("addHw.serialPortPty")}];
	$scope.consoleList = [{value : '0', label:$translate.instant("addHw.vnc")},
	                      {value : '1', label:$translate.instant("addHw.spice")}];
	$scope.tpmOptions = [];
	$http({
		method: "GET",
		url: "host/tpm",
		params: {
			hostId : $scope.hostId,
			cloudId : $scope.cloudId
		}
	}).success(function(result){
		if(angular.isArray(result.data)){
			for(var i = 0; i < result.data.length; i++){
				$scope.tpmOptions.push({value:result.data[i].name, label:result.data[i].name});
			}
		}
	});	
	$scope.model = {};
    $scope.model.storage = {};
    $scope.model.network={};
    $scope.model.input={};
    $scope.model.console={};
    $scope.model.sound={};
    $scope.model.usb={};
    $scope.model.pci={};
    $scope.model.video={};
    $scope.model.com={};
    $scope.model.tpm={};
    $scope.model.gpu={};
    $scope.model.shmem={};
    
    $scope.model.storage.pathType = "0";
    $scope.model.storage.cacheMethod = 'directsync';
    $scope.mySelections1=[];
    $scope.mySelections2=[];
    
    var osVersion = domain.summary.detail.osVersion;
	if (!isEmpty(osVersion) && 
			("Microsoft Windows 8(64-bit)".toLowerCase() == osVersion.toLowerCase() || "Microsoft Windows 8(32-bit)".toLowerCase() == osVersion.toLowerCase()
					|| "Microsoft Windows 7(64-bit)".toLowerCase() == osVersion.toLowerCase() || "Microsoft Windows 7(32-bit)".toLowerCase() == osVersion.toLowerCase())) {
		$scope.model.sound.type = "1";
	} else {
		$scope.model.sound.type = "0";
	}
    $scope.$watch("model.storage.busType",function(){
    	if($scope.model.storage.busType!="ide-cdrom")
    		$scope.model.storage.pathType='0';
    });
	$scope.getCtrl=function(){
		if($scope.model.storage.controller=='0'){
			return $translate.instant("addHw.create");
		}else{
			return $translate.instant("addHw.ctrl1");
		}
	};
	$scope.getTransmitMode=function(){
		if($scope.model.network.transmitMode=='0'){
			return $translate.instant("vswitch.veb");
		}else if($scope.model.network.transmitMode=='3'){
			return $translate.instant("vswitch.vds");
		}else if($scope.model.network.transmitMode=='4'){
			return $translate.instant('vswitch.vxlanCas');
		}
	};
	
	$scope.getNewMac = function(){
		$http.get("domain/getMacAddress?cloudId=" + $scope.cloudId)
		.success(function(result){
			var data = result.data;
			$scope.model.network.mac = data.macAddress;
		})
		.error(function(response, code, headers, config) {
	    	  UtilService.handleError(code);
	      })
		
	};
	/*$scope.nextCallBack = {
    	'1':function(){
    		alert($scope.model.type);
    	}
    };*/
	$scope.fileSizeUnit="MB";
	// 选择块设备路径
    $scope.selBlockPath = function() {
    	var resolve = {
    			paramsObj : function(){
    				return {
    					hostId : $scope.hostId,
    					cloudId : $scope.cloudId,
    					mode:1
    				}
    			}
        };
  	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
  	    storeFileInstance.result.then(function (reason) {
  	    	if (angular.isDefined(reason) && reason != 'cancel') {
  	    		$scope.model.storage.blockPath = reason.filePath;
  	    		$scope.model.storage.fileSize=reason.capacity;
  	    		$scope.model.storage.format=reason.format;
  	    	}
        });
    };
 // 选择文件路径
    $scope.selFilePath = function() {
    	var resolve = {
    			paramsObj : function(){
    				return {
    					hostId : $scope.hostId,
    					cloudId : $scope.cloudId,
    					mode:2
    				}
    			}
        };
  	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
  	    storeFileInstance.result.then(function (reason) {
  	    	if (angular.isDefined(reason) && reason != 'cancel') {
  	    		$scope.model.storage.filePath = reason.filePath;
  	    		$scope.model.storage.fileSize=reason.capacity;
  	    		$scope.model.storage.format=reason.format;
  	    	}
        });
    };
 // 选择IDE光驱文件路径
    $scope.selIdePath = function() {
    	var resolve = {
    			paramsObj : function(){
    				return {
    					hostId : $scope.hostId,
    					cloudId : $scope.cloudId
    				}
    			}
        };
  	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
  	    storeFileInstance.result.then(function (reason) {
  	    	if (angular.isDefined(reason) && reason != 'cancel') {
  	    		$scope.model.storage.idefilePath = reason.filePath;
  	    	}
        });
    };
	$scope.selVswitch=function(){
		var resolve = {
		        inputParam: function() {
                    var inputParam = {};
                    inputParam.hostId = hostId;
                    inputParam.cloudId = cloudId;
                    return inputParam;
                }
	        };
	        var vswitchInstance = UtilService.lgmodal('html/modal/common/vswitchSelector.html', 'vswitchSelectCtrl', resolve);
	        vswitchInstance.result.then(function (selectedItem) {
	        	if (angular.isDefined(selectedItem)) {
	        	    $scope.model.network.vswitch=selectedItem.name;
	        	    $scope.model.network.vsId = selectedItem.id;
	        	    if (selectedItem.mode == 0) {
	        		    $scope.model.network.transmitMode = 'veb';
	        	    } else if (selectedItem.mode == 1) {
	        		    $scope.model.network.transmitMode = 'vepa';
	        	    } else if (selectedItem.mode == 4) {
	        		    $scope.model.network.transmitMode = '4';
	        	    } else if (selectedItem.mode == 3) {
	        		    $scope.model.network.transmitMode = 'dvs';
	        	    }
	        	}
	        }, function (reason) {

	       });	
	};
	$scope.selProfile=function(){
		var resolve={
	        vswitch:function(){},
	        cloudId : function() {
	        	return cloudId
	        }
		};
		var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
  	    profileInstance.result.then(function (selectedItem) {
  	    	if(angular.isDefined(selectedItem)){
         	   $scope.model.network.profile= selectedItem.name;
         	   $scope.model.network.profileId = selectedItem.id;
       	   }
        }, function (reason) {
        });
	};
	
	// 选择GPU resource pool
    $scope.selGpuResPool = function() {
    	var resolve = {
            hostId: function () {return $scope.hostId; },
            clusterId: function() {return clusterId;},
            isCluster:function () {return isCluster;},
        };
  	    var resPoolInstance = UtilService.lgmodal('html/modal/common/resourcePoolSelector.html', 'resPoolSelectCtrl', resolve);
  	    resPoolInstance.result.then(function (selectedItem) {
        }, function (reason) {
      	   if (angular.isDefined(reason) && reason != 'cancel') {
      		  // 点击了确定按钮
      		  $scope.model.gpu.vendorId = reason.id;
      		  $scope.model.gpu.gpuResPool = reason.name;
      	   }
        });
    };
    // 选择GPU template
    $scope.selSerTemplate = function() {
    	var resolve = {
            hostId: function () {return $scope.hostId; },
            clusterId: function() {return clusterId;},
            isCluster:function () {return isCluster;},
        };
  	    var templateInstance = UtilService.lgmodal('html/modal/common/businessTemplateSelector.html', 'businessTemplateSelectCtrl', resolve);
  	    templateInstance.result.then(function (selectedItem) {
        }, function (reason) {
      	   if (angular.isDefined(reason) && reason != 'cancel') {
      		  // 点击了确定按钮
      		  $scope.model.gpu.templateId = reason.id;
      		  $scope.model.gpu.serviceTemplate = reason.name;
      	   }
        });
    };
	
	$scope.$watch("model.network.sysSetMac", function(newValue, oldValue){
		if(newValue == '0'){
			$http.get("domain/getMacAddress?cloudId=" + $scope.cloudId)
    		.success(function(result){
    			var data = result.data;
    			$scope.model.network.mac = data.macAddress;
    		})
    		.error(function(response, code, headers, config) {
		    	  UtilService.handleError(code);
		    })
			
		}else if(newValue == '1'){
			$scope.model.network.mac = '';
		}
	})
	$scope.getInputDevice=function(){
		if($scope.model.input.inputDevice=='0'){
			return $translate.instant("editDomain.notepad");
		}else{
			return $translate.instant("editDomain.mouse");
		}
	};
	$scope.getConsoleType=function(){
		if($scope.model.console.type=='0'){
			return $translate.instant("addHw.vnc");
		}else{
			return $translate.instant("addHw.spice");
		}
	};
	$scope.getAssignWay=function(){
		if($scope.model.console.portAssignWay=='0'){
			return $translate.instant("addHw.sysAssign");
		}else{
			return $scope.model.console.port;
		}
	};
	$scope.getKeyboard=function(){
		if($scope.model.console.keyboard=='1'){
			return $translate.instant("addHw.keepWithHost");
		}else{
			return $scope.model.console.port;
		}
	};
	$scope.getSoundType=function(){
		if($scope.model.sound.type=='0'){
			return $translate.instant("addHw.ac97");
		}else{
			return $translate.instant("addHw.ich6");
		}
	};
	$scope.getUsb=function(){
		if($scope.model.usb.ctrl=='1'){
			return $translate.instant("addHw.usb1");
		}else if($scope.model.usb.ctrl=='2'){
			return $translate.instant("addHw.usb2");
		}else{
			return $translate.instant("addHw.usb3");
		}
		
	}
	$scope.getDriverType=function(){
		if($scope.model.pci.driverType=='0'){
			return $translate.instant("addHw.kvm");
		}else{
			return $translate.instant("addHw.vfio");
		}
	};
	$scope.getComType=function(){
		if($scope.model.com.serialDev=='0'){
			return $translate.instant("addHw.serialPortDev");
		}else{
			return $translate.instant("addHw.serialPortPty");
		}
	};
	$scope.getSriovDriverType = function(){
		if ($scope.model.network.driverType == '0'){
			return 'KVM';
		} else {
			return 'VFIO';
		}
	}
	/*选择物理网卡事件*/
	$scope.selPhysicalNetCard=function(){
		var waitModal = UtilService.wait();
		var deviceModel = "";
		if($scope.model.network.deviceType == 'srIov'){
			deviceModel = "SR_IOV";
				}else if($scope.model.network.deviceType == 'general'){
			deviceModel = 'rtl8139';
				}else if($scope.model.network.deviceType == 'virtio'){
			deviceModel = 'virtio';
				}else if($scope.model.network.deviceType == 'e1000'){
			deviceModel = 'e1000';
				}
		var request = {
				deviceModel : deviceModel,
				hostId :  $scope.hostId,
				isPhysical: 1
		};
		$http({
            method  : 'GET',
            url     : 'host/queryPhysicalNetCardList',
            params  : request
        }).success(
 		function(result){
 			waitModal.dismiss();
 			var data = result.data;
 			var myData = [];
 			if(data){
 				for(var i = 0; i < data.length; i++){
     				var item = {'eth' : data[i].name,
     						    'type' : data[i].desc,
     						    'networkCardAddr' : data[i].addr};
     				myData.push(item);
     			}
 				var resolve = {
 						myData: function() { return myData;}
 				}
 				var modalInstance=$modal.open({
 	 				resolve: resolve,
 	 				templateUrl:'html/modal/vmEdit/physicalNetCardList.html',
 	 				controller:'PhyNetCardListCtrl',
 	 				backdrop:'static'
 	 			});
 	 			modalInstance.result.then(function(selectedItem){
 	 			},function(reason){
 	 				if(angular.isDefined(reason)&&reason!="cancel"){
 	 					$scope.model.network.physicalNetCard=reason.eth;
 	 					$scope.model.network.type = reason.type;
 	 					$scope.model.network.address = reason.networkCardAddr;
 	 				}
 	 			});
 			}
 			
 			
 		})
		
	};
	/*usb设备列表*/
	var column1 = [{ field: 'devName', displayName: $translate.instant('vm.devName'), sortable: true, width:'35%'},
                  { field: 'provider', displayName: $translate.instant('addHw.provider'), sortable: true, width:'35%'},
                  { field: 'productName', displayName: $translate.instant('addHw.productName'), sortable: true, width:'30%'}
                 ];
/*	$scope = GridService.grid($scope, url);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);*/
	
	$scope.listStyle = $scope.gridStyle(250, true);
	listenNavClick($scope, $timeout, 250, true);
	
	$scope.myData1=[];
	$http({
		method : "GET",
		url : "host/usb",
		params: {
			hostId : $scope.hostId,
			cloudId : $scope.cloudId
		}
	}).success(function(result){
		var data = result.data;
		if(angular.isArray(data)){
			for(var i = 0; i < data.length; i++){
				var item = {};
				item.devName = data[i].name;
				item.provider = data[i].vendor;
				item.productName = data[i].product;
				item.vendorId = data[i].vendorId;
				item.productId = data[i].productId;
				item.bus = data[i].bus;
				item.device = data[i].device;
				$scope.myData1.push(item);
			}
		}
	})
    
    $scope.gridOptions1 = {
		data: 'myData1',
		jqueryUITheme: false,
		jqueryUIDraggable: false,
        selectedItems: $scope.mySelections1,
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
        columnDefs:column1
    };
    /*pci设备列表*/
	var column2 = [{ field: 'devName', displayName: $translate.instant('vm.devName'), sortable: true, width:'20%'},
                  { field: 'provider', displayName: $translate.instant('addHw.provider'), sortable: true, width:'30%'},
                  { field: 'productName', displayName: $translate.instant('addHw.productName'), sortable: true, width:'30%'},
                  { field: 'eth', displayName: $translate.instant('vswitch.eth'), sortable: true, width:'20%'}
                 ];
    $scope.myData2=[];
    $http({
    	method : "GET",
    	url : "host/pci",
    	params: {
			hostId : $scope.hostId,
			cloudId : $scope.cloudId
		}
    }).success(function(result){
		var data = result.data;
		if(angular.isArray(data)){
			for(var i = 0; i < data.length; i++){
				var item = {};
				item.devName = data[i].name;
				item.provider = data[i].vendor;
				item.productName = data[i].product;
				item.eth = data[i].ethName;
				item.productId = data[i].productId;
				item.vendorId = data[i].vendorId;
				item.bus = data[i].bus;
				item.slot = data[i].slot;
				item["function"] = data[i]["function"];
				
				$scope.myData2.push(item);
			}
		}
	})
    $scope.gridOptions2 = {
		data: 'myData2',
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
        enablePaging: false,
        showFooter: false,
        i18n: $translate.instant('lang'),
        totalServerItems: 'totalServerItems',
        filterOptions: false,
        pagingOptions: false,
        columnDefs:column2
    };
    $scope.ok=function(){
    	var obj={};	
    	obj.id = $scope.vmId;
    	obj.name = $scope.name;
    	obj.title = $scope.title;
    	$scope.devType = 0;
    	var isVirtio = false;
    	/*硬件类型为存储*/
    	if($scope.model.type=='storage'){
    		$scope.devType = 1;
    		obj.storage={};
    		if($scope.model.storage.busType=='ide'){
        		obj.storage.targetBus="ide"; 
        		obj.storage.type="ide";
        		obj.storage.device="disk";
    		}else if($scope.model.storage.busType=='scsi'){
        		obj.storage.targetBus="scsi";
        		obj.storage.type="scsi";
        		obj.storage.device="disk";
    		}else if($scope.model.storage.busType=='usb'){
        		obj.storage.targetBus="usb"; 
        		obj.storage.type="usb";
        		obj.storage.device="disk";
    		}else if($scope.model.storage.busType=='virtio'){
        		obj.storage.targetBus="virtio";
        		obj.storage.type="virtio";
        		obj.storage.device="disk";
        		isVirtio = true;
    		}else if($scope.model.storage.busType=='ide-cdrom'){
        		obj.storage.targetBus="ide";
        		obj.storage.type="ide";
        		obj.storage.device="cdrom";
    		}else if($scope.model.storage.busType=='fdc'){
        		obj.storage.targetBus="fdc";
        		obj.storage.type="fdc";
        		obj.storage.device="floppy";
    		}else if($scope.model.storage.busType=='virtioScsi'){
    			obj.storage.targetBus='virtioScsi';
    			obj.storage.type="virtio-scsi";
    			obj.storage.device="disk";
    			obj.storage.controller=$scope.model.storage.controller;
    		}
    		if($scope.model.storage.busType=="ide-cdrom"){
    			if($scope.model.storage.ideType=='0'){
    				obj.storage.path="/dev/cdrom";    				
    			}else{
    				obj.storage.path=$scope.model.storage.idefilePath;    	    				
    			}

    		}else if($scope.model.storage.busType=="fdc"){
    			if($scope.model.storage.pathType=='0'){
    				obj.storage.fileType="file";
        			obj.storage.path=$scope.model.storage.filePath;
        			obj.storage.size=parseInt($scope.model.storage.fileSize);
        			obj.storage.format=$scope.model.storage.format;
    			}else{
    				obj.storage.fileType="block";
        			obj.storage.path=$scope.model.storage.blockPath;	
        			obj.storage.size=parseInt($scope.model.storage.fileSize);
        			obj.storage.format=$scope.model.storage.format;
    			}
    		}else{
    			if($scope.model.storage.pathType=='0'){
    				obj.storage.fileType="file";
        			obj.storage.path=$scope.model.storage.filePath;
        			obj.storage.size=parseInt($scope.model.storage.fileSize);
        			obj.storage.format=$scope.model.storage.format;
    			}else{
    				obj.storage.fileType="block";
        			obj.storage.path=$scope.model.storage.blockPath;	
        			obj.storage.size=parseInt($scope.model.storage.fileSize);
        			obj.storage.format=$scope.model.storage.format;
    			}
    			obj.storage.cacheType=$scope.model.storage.cacheMethod;
    			if($scope.model.storage.limitIoRead){
    				obj.storage.readBytesSec=$scope.model.storage.limitIoRead;
    			}
    			if($scope.model.storage.limitIoWrite){
    				obj.storage.writeBytesSec=$scope.model.storage.limitIoWrite;
    			}
    			if($scope.model.storage.limitIopsRead){
    				obj.storage.readIopsSec=$scope.model.storage.limitIopsRead;
    			}
    			if($scope.model.storage.limitIopsWrite){
    				obj.storage.writeIopsSec=$scope.model.storage.limitIopsWrite;
    			}
    		}
    		obj.storage.cacheType = $scope.model.storage.cacheMethod;
    	}else if($scope.model.type=='network'){
    		$scope.devType = 2;
    		obj.network={};
    		if($scope.model.network.deviceType == 'srIov'){
    			obj.network.devtype = 10;
    			obj.network.deviceModel = "SR_IOV";
    		}else if($scope.model.network.deviceType == 'general'){
    			obj.network.devtype = 2;
    			obj.network.deviceModel = 'rtl8139';
    		}else if($scope.model.network.deviceType == 'virtio'){
    			obj.network.devtype = 2;
    			obj.network.deviceModel = 'virtio';
    		}else if($scope.model.network.deviceType == 'e1000'){
    			obj.network.devtype = 2;
    			obj.network.deviceModel = 'e1000';
    		}
    		
    		obj.network.mac = $scope.model.network.mac;
    		
    		if(obj.network.devtype == 2){
    			obj.network.vsId = $scope.model.network.vsId;
        		obj.network.vsName = $scope.model.network.vswitch;
        		
        		obj.network.profileId = $scope.model.network.profileId;
        		obj.network.profileName = $scope.model.network.profile;
        		obj.network.ipAddr = $scope.model.network.ip;
        		
        		if(obj.network.deviceModel == 'virtio'){
        			if ($scope.model.network.kernelAcce == true){
        				obj.network.kernelAccelerated = '1';
        			} else {
        				obj.network.kernelAccelerated = '0';
        			}
        			
        		}
        		obj.network.mode = $scope.model.network.transmitMode;
            		
    		}else{
    			$scope.devType = 10;
    			if($scope.model.network.driverType == '0'){
    				obj.network.driverType = 'KVM';
    			}else if($scope.model.network.driverType == '1'){
    				obj.network.driverType = 'VFIO';
    			}
    			
    			obj.network.ethName = $scope.model.network.physicalNetCard;
    			obj.network.address = $scope.model.network.address;
    		}
    		
    		}else if($scope.model.type=='input'){
    		obj.input = {};
    		if($scope.model.input.inputDevice == '0'){
    			obj.input.type = 'tablet';
    		}
    		else{
    			obj.input.type = 'mouse';
    		}
    		obj.input.bus = $scope.model.input.bus;
    	}else if($scope.model.type=='console'){
    		obj.vncConfig = {};
    		if($scope.model.console.type == '0'){
    			obj.vncConfig.type = 'vnc';
    			if ($scope.model.console.enableVncProxy == true){
    				obj.vncConfig.enableVncProxy = '1';
    			} else if ($scope.model.console.enableVncProxy == false){
    				obj.vncConfig.enableVncProxy = '0';
    			}
    		}else if($scope.model.console.type == '1'){
    			obj.vncConfig.type = 'spice';
    		}
    		
    		if($scope.model.console.listenAllNetInterface == true){
    			obj.vncConfig.address = '0.0.0.0';
    		}else if($scope.model.console.listenAllNetInterface == false){
    			obj.vncConfig.address = '127.0.0.1';
    		}
    		
    		if($scope.model.console.portAssignWay =='0'){
    			obj.vncConfig.port = -1;
    		}else if($scope.model.console.portAssignWay == '1'){
    			obj.vncConfig.port = $scope.model.console.port;
    		}
    		
    		obj.vncConfig.password = $scope.model.console.password;
    		
    		if($scope.model.console.keyboardMap == true){
    			obj.vncConfig.kayboardMap = null;
    		}else{
    			obj.vncConfig.kayboardMap = $scope.model.console.keyboard;
    		}
    	}else if($scope.model.type == 'sound'){
    		if($scope.model.sound.type == '0'){
    			obj.soundType = 'ac97';
    		}else if($scope.model.sound.type == '1'){
    			obj.soundType = 'ich6'
    		}
    	}else if($scope.model.type == 'video'){
    		obj.videoType = $scope.model.video.type;
    	}else if($scope.model.type == 'usb'){
    		$scope.devType = 3;
    		obj.usb = {};
    		obj.usb.devName = $scope.mySelections1[0].devName;
    		obj.usb.productId = $scope.mySelections1[0].productId;
    		obj.usb.product = $scope.mySelections1[0].productName;
    		obj.usb.vendorId = $scope.mySelections1[0].vendorId;
    		obj.usb.vendor = $scope.mySelections1[0].provider;
    		obj.usb.bus = $scope.mySelections1[0].bus;
    		obj.usb.device = $scope.mySelections1[0].device;
    		obj.usb.controller = $scope.model.usb.ctrl;
    	}else if($scope.model.type == 'pci'){
    		obj.pci = {};
    		var selection2 = $scope.mySelections2[0];
    		obj.pci.devName = selection2.devName;
    		obj.pci.productId = selection2.productId;
    		obj.pci.product = selection2.productName;
    		obj.pci.vendorId = selection2.vendorId;
    		obj.pci.vendor = selection2.provider;
    		obj.pci.bus = selection2.bus;
    		obj.pci["function"] = selection2["function"];
    		obj.pci.slot = selection2.slot;
    		obj.pci.ethName = selection2.eth;
    		if($scope.model.pci.driverType == '0'){
    			obj.pci.driver = 'KVM';
    		}else if($scope.model.pci.driverType == '1'){
    			obj.pci.driver = 'VFIO';
    		}
    	}else if($scope.model.type == 'com'){
    		obj.serial = {};
    		if($scope.model.com.serialDev == '0'){
    			obj.serial.type = 'dev';
    		}else if($scope.model.com.serialDev == '1'){
    			obj.serial.type = 'pty';
    		}
    		
    		obj.serial.port = $scope.model.com.serialPort;
    		if(obj.serial.type == 'dev'){
    			obj.serial.devPath = $scope.model.com.path;
    		}
    		
    	}else if($scope.model.type == 'shmem'){
    		obj.shmem = {};
    		obj.shmem.size = $scope.model.shmem.size;
    	}else if($scope.model.type == 'gpu'){
    		obj = {};
    		obj.domainId = $scope.vmId;
    		obj.domainName = $scope.name;
    		obj.title = $scope.title;
    		obj.clusterId = clusterId;
    		obj.hostId = $scope.hostId;
    		obj.resPoolId = $scope.model.gpu.vendorId;
    		obj.resPoolName = $scope.model.gpu.gpuResPool;
    		obj.businessTempId = $scope.model.gpu.templateId;
    		obj.businessTempName = $scope.model.gpu.serviceTemplate;
    	}else if($scope.model.type == 'tpm'){
    		if ($scope.model.tpm.tpmPath){
    			obj.tpmDev = {};
    			obj.tpmDev.tpmPath = $scope.model.tpm.tpmPath;
    		} else {
    			return;
    		}
    		
    	}
    	if($scope.model.type != 'gpu'){
    		HttpService.post("domain/addDev?cloudId=" + $scope.cloudId, obj, undefined, function(){
        		$http.get("domain/domainDetail?id=" + $scope.vmId + "&cloudId=" + $scope.cloudId).success(function(result){
        			$scope.domain = result.data;
        			$modalInstance.close($scope.domain);
        			var status = $scope.domain.summary.detail.status;
              	  	if (("running" == status || "paused" == status) && $scope.devType != 1 && $scope.devType != 2 && $scope.devType != 3) {
              	  		UtilService.error($translate.instant("editDomain.editVirtHostPrompt"), $translate.instant("editDomain.editVm"));
              	  	}
              	  	if (("running" == status || "paused" == status) && $scope.devType == 1 && isVirtio == false) {
              		    UtilService.error($translate.instant("editDomain.editVirtHostDiskPrompt"), $translate.instant("editDomain.editVm"));
              	  	}
        		});
        	});
    	}else if($scope.model.type == 'gpu'){
    		HttpService.post("resPool/vm?cloudId=" + $scope.cloudId, obj, undefined, function(){
    			$http.get("domain/domainDetail?id=" + $scope.vmId + "&cloudId=" + $scope.cloudId).success(function(result){
        			$scope.domain = result.data;
        			$modalInstance.close($scope.domain);
        			if (("running" == status || "paused" == status) && $scope.devType != 1 && $scope.devType != 2 && $scope.devType != 3) {
              	  		UtilService.error($translate.instant("editDomain.editVirtHostPrompt"), $translate.instant("editDomain.editVm"));
              	  	}
        		});
    		})
    	}
    	
    	
    };
	$scope.cancel = function(){
		$modalInstance.dismiss("cancel");
	}
});

routeApp.controller('MountCtrl', function($scope, $http, $translate, $modalInstance, vmId, hostId,clusterId,cloudId, cdrom, UtilService, HttpService){
	$scope.mountType = "file";
	$scope.casPath = "/vms/isos/castools.iso"
	$scope.cdrom = cdrom;
	$scope.hostId = hostId;
	$scope.clusterId = clusterId;
	$scope.cloudId = cloudId;
	$scope.options = [{value : "block", label : $translate.instant("editDomain.CD-driver")},
	                  {value : "file", label : $translate.instant("editDomain.image")},
	                  {value : "tool", label : $translate.instant("editDomain.castool")}];
	// 选择存储卷
    $scope.selectVolume = function() {
    	var resolve = {
    			paramsObj : function(){
    				return {
    					hostId : $scope.hostId,
    					cloudId : $scope.cloudId
    				}
    			}
        };
  	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
  	    storeFileInstance.result.then(function (reason) {
  	    	if (angular.isDefined(reason) && reason != 'cancel') {
  	    		// 点击了确定按钮
  	    		$scope.storeFile = reason.filePath;
  	    		$scope.cdrom.detail.filePath = reason.filePath;
  	    		$scope.cdrom.detail.type = $scope.mountType;
  	    		//console.log(reason);
  	    	}
        });
    };
    
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
	$scope.ok = function(){
		if($scope.mountType == "file"){
			$modalInstance.close($scope.cdrom);
		}else if($scope.mountType == "tool"){
			$scope.cdrom.detail.filePath = $scope.casPath;
			$modalInstance.close($scope.cdrom);
		}else if($scope.mountType == "block"){
			$scope.cdrom.detail.filePath = "/dev/cdrom";
			$modalInstance.close($scope.cdrom);
		}
		
	}
});

routeApp.controller("VncParamCtrl", function($scope,cloudId, $modalInstance, $http, HttpService){
	$scope.params = {};
	$http.get("systemConfig/sysConfig/rest?type=sys_conf&cloudId=" + cloudId)
	.success(function(result){
		$scope.params = {'ip' : result.data["vnc.proxy.ip"],
						 'username' : result.data["vnc.proxy.login.name"],
						 'pwd' : result.data["vnc.proxy.login.pwd"]};
	})
	$scope.ok = function(){
		var sysConfig = {"vnc_proxy_ip" : $scope.params.ip,
						 "vnc_proxy_login_name" : $scope.params.username,
						 "vnc_proxy_login_pwd" : $scope.params.pwd};
		HttpService.put("systemConfig/sysConfig/rest?type=sys_conf&cloudId=" + cloudId, sysConfig,$modalInstance);
	}
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
});
