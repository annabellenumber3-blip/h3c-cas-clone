/**
 * @author 10651
 * @description 云彩虹controller
 */ 
//云彩虹控制器
routeApp.controller('CloudRainbowCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService, PermissionService, PublicCloudServiceAsync, RainbowServiceAsync, VmServiceAsync) {
	$scope.hasPermission = PermissionService.hasPermission;
	
	$scope.getPublicCloudList = function (callback) {
		var callbackObj = {callback:callback, self:rainBowTopo};
		PublicCloudServiceAsync.queryPublicCloudList(null, null, callbackObj);
	}
	
	$scope.nodeNotExist = function () {
		var modalInstance = UtilService.error($translate.instant('publicCloud.nodeNotExist'));
	}
	
	$scope.queryPublicCloudDetail = function (id, callback) {
		var callbackObj = {callback:callback, self:rainBowTopo};
		PublicCloudServiceAsync.queryPublicCloudDetail(id, callbackObj);
	}
	
	$scope.confirmSaveDesign = function () {
		var data = rainBowTopo.saveDesignData();
		if(data.data.length){
			var modalInstance = UtilService.confirm($translate.instant('publicCloud.saveDesingData'),$translate.instant('operConfirm'));
			modalInstance.result.then(function (yes) {
				var callbackObj = {callback:UtilService.handleResult, self:UtilService};
				PublicCloudServiceAsync.modifyDesignData(data, callbackObj);
			}, function (no) {
			});
		}else {
			UtilService.alert($translate.instant('publicCloud.noDataCenterSelect'), $translate.instant('common.opertip'), false, 'error');
		}
	}
	
	// 初始化rainbow topo
	var rainBowTopo = new RainBowTopo();
	rainBowTopo.init();
	
	$scope.resize = function () {
		rainBowTopo.resizePanel();
	};
	
	$('#leftTreeToggle').click($scope.resize);
	
	//刷新数据
	$scope.$on(constant.onRefreshRainbowData, function(event, msg) {
		try {
			var cloudIds = msg;
			rainBowTopo.refreshRainbow(cloudIds);
		} catch (e) {
			console.log("refresh rainbow data error : " + e);
		}
	});
	
	//刷新虚拟机数据
	$scope.$on('onCloudNodeChange', function(event, msg) {
		try {
			if (msg && msg.stateParams) {
				var stateParams = msg.stateParams;
				rainBowTopo.refreshVmData(stateParams);
			}
		} catch (e) {
			console.log("refresh rainbow data error : " + e);
		}
	});
	
	//迁移配置
	$scope.migrateConfig = function(entry) {
		var waitModal = UtilService.wait();
		RainbowServiceAsync.checkVmCanMigrate(entry.srcCloudId, entry.dstCloudId, entry.domainId, entry.destHostId, function(result) {
			waitModal.dismiss();
			if (result.success == true) {
				var modalInstance = $modal.open({	
					 templateUrl: 'html/modal/cloudService/publicCloud/migrateConfig.html',
					 controller: 'MigrateConfigCtrl',
					 backdrop:'static',
					 size:"lg",
					 resolve: {
		            	entry:function(){
							return entry;
						}
					 }
				 });
				 modalInstance.result.then(function () {
		        	//TODO 刷新
				 }, function (reason) {
				 });
			} else {
				UtilService.handleResult(result);
			}
		});
	}
	
	
	/** 操作虚拟机 **/
	$scope.operatVm = function (type, elementData, publicCloudId) {
		var callbackObj = {callback:UtilService.handleResult, self:UtilService};
		if (type == 'start') {
			VmServiceAsync.startDomain(elementData, callbackObj);
		} else if (type == 'shutdown') {
			VmServiceAsync.shutDownDomain(elementData, callbackObj);
		} else if (type == 'restart') {
			VmServiceAsync.restartDomain(elementData, callbackObj);
		} else if (type == 'close') {
			VmServiceAsync.closeDomain(elementData, callbackObj);
		} else if (type == 'restore') {
			VmServiceAsync.restoreDomain(elementData, callbackObj);
		} else if (type == 'pause') {
			VmServiceAsync.pauseDomain(elementData, callbackObj);
		} else if (type == 'sleep') {
			VmServiceAsync.sleepDomain(elementData, callbackObj);
		}
	}
	
	$scope.$on("$destroy", function() {
    	rainBowTopo.gc();
	});
});


//迁移配置
routeApp.controller('MigrateConfigCtrl', function($scope, $http, $translate, $timeout, $modalInstance, entry, UtilService, PublicCloudServiceAsync, RainbowServiceAsync) {
	$scope.config = {};//传入后台的实体
	$scope.config.timeout = 20; //迁移超时时长默认为20分钟
	$scope.config.srcCloudId = entry.srcCloudId;
	$scope.config.dstCloudId = entry.dstCloudId;
	$scope.config.destHostId = entry.destHostId;
	$scope.config.domainId = entry.domainId;
	$scope.config.destHostName = entry.destHostName;
	$scope.config.sourceHostName = entry.sourceHostName;
	$scope.config.domainName = entry.domainName;
	
	$scope.poolList = [];
	$scope.selectModel ={};
	
	//加载对端主机的存储池
    $scope.loadPool = function() {
    	var waitModal = UtilService.wait();
    	PublicCloudServiceAsync.queryDestHostStorageList($scope.config.dstCloudId, $scope.config.destHostId, function(result){
    		waitModal.dismiss();
    		if (result.success == true) {
    			$scope.poolList = result.data;
    		} else {
    			UtilService.handleResult(result);
            }
    	});
    };
    $scope.loadPool();
    
    // 向导标题：基本配置，目标存储
    $scope.stepTitles = [ $translate.instant('publicCloud.baseInfo'),
	                       $translate.instant('publicCloud.targetStorage')];
    
    // form之间的切换控制
	$scope.stepValids = {
       stepOneOver : function() {
           if ($('#form1').val() === "true") {
               return true;
           }
           return false;
       },
       stepTwoOver : function() {
    	   if (angular.isDefined($scope.selectPool) && $scope.selectPool != "") {
    		   return true;
    	   }
           return false;
       }
	};
    
    $scope.$watch('selectModel.model', function(newValue, oldValue) {
        $timeout(function() {
            $scope.selectPool = angular.fromJson(newValue);//将字符串转成json对象
        });                
    }, true);
    
    $scope.fillData = function() {
    	var data = angular.copy($scope.config);
    	data.destPoolName = $scope.selectPool.name;
    	data.domainTitle = $scope.config.domainName;
    	data.compressed = $scope.config.compress;
    	return data;
    }
    
	var migrate = function() {
    	var waitModal = UtilService.wait();
    	RainbowServiceAsync.migrate($scope.config.srcCloudId, $scope.config.dstCloudId, $scope.fillData(),
    			function(result){
    		waitModal.dismiss();
    		if (result.success == true) {
    			$modalInstance.close("success");
    			// TODO 刷新树
    		} else {
    			UtilService.handleResult(result);
    		}
    	});
	}	
	$scope.ok = function() {
		var params = {"vmId":entry.domainId};
		var waitModal = UtilService.wait();
		$http({
			method: "GET",
			url: "org/vmUser",
			params: params
		}).success(function(result) {
			if (result.success) {
				waitModal.dismiss();
				if (result.data && result.data.length > 0) {
					var modalInstance = UtilService.confirm($translate.instant('publicCloud.migrateConfirm'),$translate.instant('operConfirm'));
					modalInstance.result.then(function (selectedItem) {
						migrate();
					}, function () {
					});
				} else {
					migrate();
				}
			} else {
				UtilService.handleResult(result);
				waitModal.dismiss();
			}
		}).error(function(response, code, headers, config) {
			waitModal.dismiss();
			UtilService.handleError(code);
		});;
    };
    
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

