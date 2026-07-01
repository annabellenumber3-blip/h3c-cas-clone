angular.module('app.vmservices',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('DomainService', function($http ,$modal, $rootScope, $state, $translate, UtilService, HttpService){
	 var vm = {};
	 //启动
	 vm.enableStart = false;
	 //关闭
	 vm.enableShutdown = false;
	 //关闭电源
	 vm.enableClose = false;
	 //暂停
	 vm.enablePause = false;
	 //恢复
	 vm.enableRestore = false;
	 //休眠
	 vm.enableSleep = false;
	 //重启
	 vm.enableReboot = false;
	 //克隆为模板
	 vm.enableCloneTemplate = false;
	 //转换为模板
	 vm.enableConvertTemplate = false;
	 //克隆
	 vm.enableClone = false;
	 //迁移
	 vm.enableMigrate = false;
	 //修改虚拟机
	 vm.enableEdit = false;
	 //备份虚拟机
	 vm.enableBackup = false;
	 //备份管理
	 vm.enableBackupMgr = false;
	 //快照虚拟机
	 vm.enableSnapshot = false;
	 //删除虚拟机
	 vm.enableDelete = true;
	 //导出ovf模板
	 vm.enableExportOvf = false;
	 //控制台
	 vm.enableConsole = false;
	 //升级Castools
     vm.enableUpgradeCastools = false;
     //分配虚拟机
     vm.enableDistribute = false;
	 //判断虚拟机的操作是否可用
	 var judgeAvailableVmFun = function(haManage, haStatus) {
		 if (haManage == 0) {
			 //若虚拟机不被管理，直接返回true
			 return true;
		 } else {
			 //若虚拟机被管理，还需判断虚拟机HA异常状态。
			 return haStatus == null || haStatus == 0;
		 }
	 };
	 var batchOperateVm = function(vmList, showTaskList, operType, url,dialogTitle) {
         var listData = [];
         for (var i = 0; i < vmList.length; i++) {
             var vmData = {};
             vmData.id = vmList[i].id;
             vmData.title = vmList[i].title;
             vmData.cloudId = vmList[i].cloudId;
             listData.push(vmData);
         }
         var confirmParam = {type:operType};
		 var content=$translate.instant('vm.confirmBatchOperateVm', confirmParam);
		 if(dialogTitle===$translate.instant("vm.shutdownVm")){
			 content=$translate.instant('vm.confirmBatchOperateVm2');
		 }
         var modalInstance = UtilService.confirm(content,dialogTitle);
         modalInstance.result.then(function (selectedItem) {
             HttpService.put(url, listData, undefined, showTaskList);
         }, function () {
         });
     }
	 return {
		 vm: vm,
		 
		 updateVmButton : function(msg) {
			//更新虚拟机按钮状态
			if (msg.id) {
//					vm.status = msg.status;
//					vm.haManage = msg.haManage;
//					vm.haStatus = msg.haStatus;
				var judgeAvailableVm = judgeAvailableVmFun(msg.haManage,msg.haStatus);
				var protectModel =  msg.protect == 1 ? true : false;
				//var protectModel =  msg.protectModel == $translate.instant('common.enable') ? true : false;
				//启动
				if (msg.status != 'paused' && msg.status != 'running' && msg.status != 'unknown') {
					vm.enableStart = true;
					vm.enableConvertTemplate = true;
				} else {
					vm.enableConvertTemplate = false;
					vm.enableStart = false;
				}
				//关闭
				if (msg.status == 'running' && judgeAvailableVm) {
					vm.enableShutdown = true;
				} else {
					vm.enableShutdown = false;
				}
				
				//关闭电源
				if ((msg.status == 'running' || msg.status == 'paused') && judgeAvailableVm) {
					 vm.enableClose = true;
				} else {
					 vm.enableClose = false;
				}
				//暂停
				if ((msg.status == 'running' && msg.status != 'paused') && judgeAvailableVm) {
					 vm.enablePause = true;
				} else {
					 vm.enablePause = false;
				}
				//恢复
				if (msg.status == 'paused' && judgeAvailableVm) {
					 vm.enableRestore = true;
				} else {
					 vm.enableRestore = false;
				}
				//休眠 和 重启
				if ((msg.status == 'running' || msg.status == 'paused') && judgeAvailableVm) {
					 vm.enableSleep = true;
					 vm.enableReboot = true;
				} else {
					 vm.enableSleep = false;
					 vm.enableReboot = false;
				}
				if (msg.status == 'unknown' || !judgeAvailableVm) {
					vm.enableDistribute = false;
				} else {
					vm.enableDistribute = true;
				}
				//升级Castools
                if (msg.status == 'running' && !protectModel && msg.castoolStatus == 1) {
                    vm.enableUpgradeCastools = true;
                } else {
                    vm.enableUpgradeCastools = false;
                }
				if (msg.hostStatus == 1) {
					//主机正常
					//启动
					if (msg.status != 'paused' && msg.status != 'running' && msg.status != 'unknown' && judgeAvailableVm) {
						vm.enableStart = true;
					} else {
						vm.enableStart = false;
					}
					//克隆
					vm.enableClone = judgeAvailableVm && msg.status != 'unknown';
					//迁移
					vm.enableMigrate = judgeAvailableVm && msg.status != 'unknown';
					//编辑
					vm.enableEdit = judgeAvailableVm && msg.status != 'unknown';
					//克隆为模板
					vm.enableCloneTemplate = judgeAvailableVm && msg.status != 'unknown';
					//转换为模板
					vm.enableConvertTemplate = msg.status != 'paused' && msg.status != 'running' && msg.status != 'unknown' && judgeAvailableVm;
					//备份虚拟机
					vm.enableBackup = judgeAvailableVm && msg.status != 'unknown' && !protectModel;
					//备份管理
					vm.enableBackupMgr = judgeAvailableVm && msg.status != 'unknown'&& !protectModel;
					//快照虚拟机
					vm.enableSnapshot = judgeAvailableVm && msg.status != 'unknown';
					//删除虚拟机
					vm.enableDelete = judgeAvailableVm;
					//导出ovf模板
					vm.enableExportOvf = msg.status != 'paused' && msg.status != 'running' && judgeAvailableVm;
					//控制台
					vm.enableConsole = msg.status != 'unknown';
					//回收
					vm.enableRetrieve = msg.status != 'unknown';
				} else {
					//3:主机维护模式  4：主机维护模式（本地存储故障）
					if (msg.hostStatus == 3 || msg.hostStatus == 4 || msg.haEnable == 0) {
						vm.enableStart = false;
					}
					//克隆
					vm.enableClone = false;
					//迁移
					if (msg.hostStatus == 3 || msg.hostStatus == 4 && "ha_exception" != msg.status || "unknown" == msg.status) {
						vm.enableMigrate = false;
					} else {
						vm.enableMigrate = true;
					}
					if (msg.hostStatus == 4) {
						vm.enableReboot = false;
					}
					vm.enableSleep = !(msg.hostStatus == 4 && msg.hostStatus == 3) && vm.enableSleep;
					vm.enableEdit = false;
					//克隆为模板
					vm.enableCloneTemplate = false;
					//转换为模板
					vm.enableConvertTemplate = false;
					vm.enableSnapshot = false;
					//导出ovf模板
					vm.enableExportOvf = false;
					//控制台
					vm.enableConsole = false;
					//回收
                    vm.enableRetrieve = false;
                    //备份
                    vm.enableBackup = false;
                    //删除 主机状态未知时允许删除
                    vm.enableDelete = msg.hostStatus == 0 ? true : false;
                    //备份管理
                    vm.enableBackupMgr = false;
				}
			 }
			 return vm;
		 },
		 
		 updateVmwareVmButton : function(msg) {
				//更新虚拟机按钮状态
				if (msg.id) {
					//启动
					if (msg.status == 'shutOff') {
						vm.enableStart = true;
					} else {
						vm.enableStart = false;
					}
					//关闭,休眠,重启，关闭电源
					if (msg.status == 'running') {
						vm.enableShutdown = true;
						vm.enableClose = true;
						vm.enableSleep = true;
						vm.enableReboot = true;
					} else {
						vm.enableShutdown = false;
						vm.enableClose = false;
						vm.enableSleep = false;
						vm.enableReboot = false;
					}
					if (msg.status == 'unknown') {
						vm.enableSnapshot = false;
						vm.enableCloneTemplate = false;
						vm.enableDistribute = false;
						vm.enableMigrate = false;
					} else {
						vm.enableSnapshot = true;
						vm.enableCloneTemplate = true;
						vm.enableDistribute = true;
						vm.enableMigrate = true;
					}
					vm.enableConsole = false;
					vm.enableDelete = true;
				 }
				 return vm;
			 },
		 updateCloudOSVmButton : function(msg) {
				//更新虚拟机按钮状态
				if (msg.id) {
					//启动
					if (msg.status == 'shutOff') {
						vm.enableStart = true;
					} else {
						vm.enableStart = false;
					}
					//关闭,休眠,重启，关闭电源
					if (msg.status == 'running') {
						vm.enableShutdown = true;
						vm.enableClose = true;
						vm.enableSuspended = true;
						vm.enableReboot = true;
					} else {
						vm.enableShutdown = false;
						vm.enableClose = false;
						vm.enableSuspended = false;
						vm.enableReboot = false;
					}
					if (msg.status == 'suspended') {
						vm.enableRestore = true;
					} else {
						vm.enableRestore = false;
					}
					if (msg.status == 'unknown') {
						vm.enableSnapshot = false;
						vm.enableCloneTemplate = false;
						vm.enableDistribute = false;
						vm.enableRestore = false;
					} else {
						vm.enableDistribute = true;
					}
					vm.enableDelete = true;
				 }
				 return vm;
			 },
		 //启动虚拟机
		 startVm : function(domain, showTaskList) {
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmStartVm'),$translate.instant('vm.startVm'));
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/start', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //暂停虚拟机
		 pauseVm :  function(domain, showTaskList){
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmPauseVm'),$translate.instant('vm.pauseVm'));
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/pause', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //恢复虚拟机
		 resumeVm : function(domain,showTaskList) {
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmResumeVm'),$translate.instant('vm.resumeVm'));
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/restore', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //休眠虚拟机
		 sleepVm : function(domain, showTaskList){
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmSleepVm'),$translate.instant('vm.sleepVm'));
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/sleep', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //重启虚拟机
		 restartVm : function(domain, showTaskList) {
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmRestartVm'),$translate.instant('vm.restartVm'));
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/restart', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //关闭虚拟机
		 closeVm : function(domain, showTaskList){
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmShutdownVm', {name:domain.title}),$translate.instant('vm.shutdownVm'), 'mg');
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/close', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //关闭虚拟机电源
		 shutdownVm : function(domain, showTaskList){
			 var modalInstance = UtilService.confirm($translate.instant('vm.confirmCloseVm'),$translate.instant('vm.closeVm'));
			 modalInstance.result.then(function (selectedItem) {
				 var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
				 HttpService.put('domain/shutDown', param, undefined, showTaskList);
			 }, function () {
			 });
		 },
		 //克隆虚拟机
		 cloneVm : function(domain){
			 var resolve = {
					 domain: function() {return domain;}
			 };
		     UtilService.lgmodal('html/modal/vm/cloneVm.html', 'CloneVmCtrl', resolve);
		 },
		 //迁移虚拟机
		 migrateVm : function(domain) {
			 var params = {};
			 params.cloudId = domain.cloudId;
			 params.id = domain.id;
			 $http({
				 method: "GET",
				 url: "domain/basicInfo",
				 params: params
			 }).success(function(result){
				  if (result.success == true) {
					  var basicInfo = result.data;
					  //check domain status and device
					  var isOnline = false;
					  if (basicInfo.status == 'running' || basicInfo.status == 'paused') {
						  isOnline = true;
					  }
					  var existPciOrUsb = basicInfo.existPciOrUsb;
					  var existCdromOrFloppy = basicInfo.existCdromOrFloppy;
					  var existRaw = basicInfo.existRaw;
					  var existBlock = basicInfo.existBlock;
					  if (existPciOrUsb == true && isOnline == true) {
						  UtilService.alert($translate.instant('migrateVm.existPciOrUsb'), $translate.instant('common.opertip'), false, 'error');
						  return;
					  } else if (existPciOrUsb == true && isOnline == false && existBlock == true) {
						  UtilService.alert($translate.instant('migrateVm.existPciOrUsbAndBlock'), $translate.instant('common.opertip'), false, 'error');
						  return;
					  } else if (existCdromOrFloppy == true && existBlock == true) {
						  UtilService.alert($translate.instant('migrateVm.existCdromOrFloppyAndBlock'), $translate.instant('common.opertip'), false, 'error');
						  return;
					  } else if (isOnline == true && existRaw == true && existCdromOrFloppy == true) {
						  UtilService.alert($translate.instant('migrateVm.existCdromOrFloppyAndRaw'), $translate.instant('common.opertip'), false, 'error');
						  return;
					  }
					  
					  basicInfo.hostName = domain.host;					 
					  var resolve = {basicInfo: function() {return basicInfo;},
					                 vmList : function() {}};
					  var modalInstance = UtilService.lgmodal('html/modal/vm/migrateVm.html', 'migrateVmCtrl', resolve);
					  modalInstance.result.then(function (selectedItem) {
					  }, function () {
						  
					  });
				  }
				  UtilService.handleResult(result);
			 }).error(function(response, code, headers, config) {
				  UtilService.handleError(code);
			 });
		 },
		 //立即备份虚拟机
		 backupVm : function(domain) {
			 var params = {};
			 params.cloudId = domain.cloudId;
			 params.id = domain.id;
			 $http({
				 method: "GET",
				 url: "domain/basicInfo",
				 params: params
			 }).success(function(resultInfo){
				  if (resultInfo.success == true) {
					  var basicInfo = resultInfo.data;
					  var isOnline = false;
					  if (basicInfo.status == 'running' || basicInfo.status == 'paused') {
						  isOnline = true;
					  }
					  var param = {id:domain.id,orgId:domain.orgId,cloudId:domain.cloudId,title:domain.title};
						 $http({
				             method  : 'GET',
				             url     : "domain/existRaw",
				             params: param
				         }).success(function(result){
							 if (result.data == true && isOnline) {
								 UtilService.error($translate.instant("backupVm.existRawTip"), $translate.instant("common.opertip"));
								 return;
							 } else {
								 var resolve = { 
										 domain: function () {return domain;}
								 };
								 UtilService.lgmodal('html/modal/vm/backupVm.html', 'BackupVmCtrl', resolve);
							 }
						 });
				  }
				  UtilService.handleResult(resultInfo);
			 }).error(function(response, code, headers, config) {
				  UtilService.handleError(code);
			 });
		 },
		 // 备份管理
		 backupMng : function(domain) {
			 var resolve = { 
				domain: function () {return domain;}
			 };
			 UtilService.modal('html/modal/vm/backupMng.html', 'BackupMngCtrl', resolve, '1000px');
		 },
		 //快照
		 snapshotVm : function(domain) {
			 var resolve = { domain: function () {return domain;}};
		     UtilService.modal('html/modal/vm/snapshotVm.html', 'SnapshotVmCtrl', resolve, '700px');
		 },
		 
		 //删除虚拟机
		 deleteVm : function(domain, showTaskList){
			 var resolve = { domain: function () {return domain;}};
		     UtilService.modal('html/modal/vm/deleteVm.html', 'DeleteVmCtrl', resolve, '480px');
		 },
		 //打开控制台
		 openConsole : function(domian){
			 var ishtml5 = UtilService.checkHtml5();
			 UtilService.openConsole(domian, ishtml5);
		 },
		 //导入备份策略（主机下导入虚拟机的参数引用和虚拟机备份管理中导入窗口的参数引用）
		 importBackupStrategy : function(scope) {
			 var resolve = { cloudId: function () {return scope.model.cloudId;}};
			 var modalInstance=UtilService.lgmodal("html/modal/common/selectSingle.html","SelParaQuoteCtrl",resolve);
		  	   	modalInstance.result.then(function(selectedItem){
		      	},function(result){
		      		if (result == 'cancel') {
		      			return;
		      		}
		      		if (result.storeMode == 0) { //本地目录
		      			 scope.model.type = 'cp';
		      			 
		      		} else {
		      			if (result.type == 0) { //ftp
		      				scope.model.type = 'ftp';
		      			} else if (result.type == 1) {//scp
		      				scope.model.type = 'scp';
		      			}
		      			scope.model.userName = result.loginName;
		      			scope.model.password = result.password;
		      			scope.model.targetAddr = result.targetAddr;
		      		}
		      		scope.model.directory = result.storeLocation;
		 			scope.model.tmpDir = result.tmpDir;
		      	});
		 },
		 //升级CAStools
         upgradeCastools : function(vm, showTaskList) {
             var modalInstance = UtilService.confirm($translate.instant('vm.confirmUpgradeCastools'),$translate.instant('menu.upgradeCastools'), undefined);
             modalInstance.result.then(function (selectedItem) {
                 HttpService.put('domain/castools/upgrade', vm, undefined, showTaskList);
             }, function () {
             });
         },
         //分配虚拟机
         distributeVm : function(cloudId, vmData) {
 	        var param = {};
 	        param.cloudId = cloudId;
        	param.vmKey = vmData.vmKey;
        	param.domainId = vmData.id;
        	param.uniqueKey = vmData.uniqueKey;
        	param.cloudType = vmData.cloudType;
        	
 	        $http({
	            method: 'GET',
	            url: "domain/org",
	            params: param
	        }).success(function (result) {
	            if (result.state == 0) {
	                var orgData = result.data;//属性：orgId，orgName， domainId
	                orgData.uniqueKey = vmData.uniqueKey;
	                orgData.vmKey = vmData.vmKey;
	                orgData.domainId = vmData.id;
	                orgData.cloudId = cloudId;
	                orgData.clusterId = vmData.clusterId;
	                if (angular.isDefined(vmData.vmKey)) {
	                	orgData.cloudType = 3;
	                } else if (vmData.cloudType == 5) {
	                	orgData.cloudType = 5;
	                } else {
	                	orgData.cloudType = 2;
	                }
	                //修改问题单：201605140068 活动桌面池虚拟机提示不可分配。
	                orgData.domainName = vmData.name;
	                orgData.domainTitle = vmData.title;
	                orgData.entryNodeType = vmData.entryNodeType;
	                if (orgData.isAssignMode == true) {
	                    //如果虚拟机属于活动桌面池，则弹出提示框
	                    UtilService.alert($translate.instant('virdesk.vmIsAssignModeTip'), $translate.instant('common.opertip'), false, 'error');
	                } else {
    	                var resolve = { orgData: function () {return orgData;},
    	                                domainList: function () {return null;}};
    	                var distrInstance = UtilService.modal('html/modal/common/distributeVmToUserOrUserGrp.html', 'destributeVmCtrl', resolve, '520px');
    	                distrInstance.result.then(function (snap) {
    	                    $rootScope.$broadcast("onRefrenshVmUserList");
    	                }, function () {
    	                });
	                }
	            }
	            UtilService.handleResult(result);
	        }).error(function(response, code, headers, config) {
	            UtilService.handleError(code);
	        });
 	    },
 	    revokeDomain :function (cloudId, vmData) {
         	
  	       	var param = {};
 	        param.cloudId = cloudId;
        	param.vmKey = vmData.vmKey;
        	param.domainId = vmData.id;
        	param.uniqueKey = vmData.uniqueKey;
        	param.cloudType = vmData.cloudType;
        	
 	        $http({
	            method: 'GET',
	            url: "domain/org",
	            params: param
	        }).success(function (result) {
	            if (result.state == 0) {
	                var orgData = result.data;//属性：orgId，orgName， domainId
	                orgData.uniqueKey = vmData.uniqueKey;
	                orgData.vmKey = vmData.vmKey;
	                orgData.domainId = vmData.id;
	                orgData.cloudId = cloudId;
	                orgData.clusterId = vmData.clusterId;
	                if (angular.isDefined(vmData.vmKey)) {
	                	orgData.cloudType = 3;
	                } else if (vmData.cloudType == 5) {
	                	orgData.cloudType = 5;
	                } else {
	                	orgData.cloudType = 2;
	                }
	                //修改问题单：201605140068 活动桌面池虚拟机提示不可分配。
	                orgData.domainName = vmData.name;
	                orgData.domainTitle = vmData.title;
	                orgData.entryNodeType = vmData.entryNodeType;
	                if (orgData.isAssignMode == true) {
	                    //如果虚拟机属于活动桌面池，则弹出提示框
	                    UtilService.alert($translate.instant('virdesk.vmIsAssignModeTip'), $translate.instant('common.opertip'), false, 'error');
	                } else {
    	                var resolve = { param: function () {return orgData;}};
    	                var distrInstance = UtilService.modal('html/modal/common/multiselect.html', 'revokeDomainCtrl', resolve, '800px');
    	             	distrInstance.result.then(function () {
//    	             		$rootScope.$broadcast("onRefrenshVmUserList");
    	             		$rootScope.$broadcast(constant.onReloadVmList);
    	             	}, function () {
    	             	});
	                }
	            }
	            UtilService.handleResult(result);
	        }).error(function(response, code, headers, config) {
	            UtilService.handleError(code);
	        });
 	    },
        checkSrcStorage: function(domainId, cloudId) {
             var presult = false;
             $.ajax({ 
                 url:'domain/clone/srcStorageCheck',
                 type:'get', 
                 data:{"domainId":domainId,"cloudId":cloudId},
                 async:false,
                 cache:false,
                 success: function(result) {
                     presult = result.success;
                     if (!result.success) {
                         UtilService.alert(result.failureMessage, $translate.instant('common.opertip'), false, 'error');
                     }
                 },
                 error: function(data) {
                     UtilService.alert($translate.instant('drx.validatorIllegalIp'), $translate.instant('common.opertip'), false, 'error');
                 }
             });
             return presult;
         },
         retrieveVm : function(domain) {
             var param = {
                     cloudId:domain.cloudId,
                     id:domain.id,
                     desktopPoolId:domain.desktopPoolId,
                     orgId:domain.orgId,
                     title:domain.title
             };
             
             var refreshVmUserList = function() {
                 $rootScope.$broadcast('onRefrenshVmUserList');
             }
             
             var retrieveVmInstance = UtilService.confirm($translate.instant('virdesk.retrieveConfirm', {title:domain.title}),$translate.instant('operConfirm'));
             retrieveVmInstance.result.then(function (selectedItem) {
                 HttpService.put('virDesk/retrieve', param, undefined, refreshVmUserList);
             }, function () {
             });
         },
         //克隆为模板
         cloneTemplate : function(param){
             var resolve = { vmId: function () {return param.id;},
                             cloudId: function(){return param.cloudId;}};
             UtilService.mgmodal('html/modal/vm/cloneTemplate.html', 'CloneTemplateCtrl', resolve);
         },
         //转换为模板
         toTemplate : function(param){
             var resolve = { 
                     vmId: function () {return param.id;},
                     title :function() {return param.title;},
                     cloudId: function(){return param.cloudId;}
             };
             UtilService.mgmodal('html/modal/vm/toTemplate.html', 'ToTemplateCtrl', resolve);
         },
       //修改虚拟机
		 editVm : function(vmId, cloudId){
			 var waitModal = UtilService.wait();
			 $http.get("domain/domainDetail?id=" + vmId + "&cloudId=" + cloudId)
			 	  .success(function(result){
			 		 waitModal.dismiss();
			 		 var resolve = { vmId: function() {return vmId;},
					 		 body: function() {return result.data;},
					 		 inRecycle: function() {return 'false';},
					 		 source: function() { return "editVm";}}
			 		var size = {width:'950px', height:'650px'};
			 		var modalInstance = $modal.open({
			  			  templateUrl: 'html/modal/vm/editDomain.html',
			  			  size: size,
			  			  windowClass: "editvm-dialog",
			  			  controller: 'EditVmCtrl',
			  			  backdrop:'static',
			  			  resolve: resolve
			  			  }
			  		);
			  		modalInstance.result.then(function (selectedItem) {
			         }, function () {
			         });
			 	  }).error(function(response, code, headers, config) {
				 		waitModal.dismiss();
			            UtilService.handleError(code);
			      });;
			 
		 },
         
		 //--------------------------- 批量操作 --------------------
		 //批量启动
		 batchStartVm : function(vmList, showTaskList) {
             var operType = $translate.instant('vm.batchStart');
             var dialogTitle=$translate.instant('vm.startVm');
             var url = 'domain/batch/start';
             batchOperateVm(vmList, showTaskList, operType, url,dialogTitle);
		 },
		 // 批量暂停
		 batchPauseVm : function(vmList, showTaskList) {
			 var operType = $translate.instant('vm.batchPause');
             var dialogTitle=$translate.instant('vm.pauseVm');
			 var url = 'domain/batch/pause';
			 batchOperateVm(vmList, showTaskList, operType, url,dialogTitle);
		 },
		 //批量恢复
		 batchResumeVm : function(vmList, showTaskList) {
		     var operType = $translate.instant('vm.batchResume');
             var dialogTitle=$translate.instant('vm.resumeVm');
		     var url = 'domain/batch/resume';
		     batchOperateVm(vmList, showTaskList, operType, url,dialogTitle);
		 },
		 //批量重启
		 batchRestartVm : function(vmList, showTaskList) {
		     var operType = $translate.instant('vm.batchRestart');
             var dialogTitle=$translate.instant('vm.restartVm');
             var url = 'domain/batch/restart';
             batchOperateVm(vmList, showTaskList, operType, url,dialogTitle);
		 },
		 //批量关闭
		 batchShutdownVm : function(vmList, showTaskList) {
             var operType = $translate.instant('vm.batchShutdown');
             var dialogTitle=$translate.instant('vm.closeVm');
             var url = 'domain/batch/shutdown';
             batchOperateVm(vmList, showTaskList, operType, url,dialogTitle);
         },
		 //批量关闭电源
         batchCloseVm : function(vmList, showTaskList) {
             var operType = $translate.instant('vm.batchClose');
             var dialogTitle=$translate.instant('vm.shutdownVm');
             var url = 'domain/batch/close';
             batchOperateVm(vmList, showTaskList, operType, url,dialogTitle);
         },
		 //批量删除
         batchDeleteVm : function(vmList) {
        	 var domain = {list : vmList};
        	 var resolve = { domain: function () {return domain;}};
             UtilService.modal('html/modal/vm/deleteVm.html', 'DeleteVmCtrl', resolve, '480px');
         },
         //批量更新CAStools
         batchUpgradeCastools : function(vmList, showTaskList) {
             var listData = [];
             for (var i = 0; i < vmList.length; i++) {
                 var vmData = {};
                 vmData.id = vmList[i].id;
                 vmData.cloudId = vmList[i].cloudId;
                 vmData.title = vmList[i].title;
                 listData.push(vmData);
             }
             var modalInstance = UtilService.confirm($translate.instant('vm.confirmBatchUpgradeCastools'),$translate.instant('vm.batchUpgradeCastools'), undefined);
             modalInstance.result.then(function (selectedItem) {
                 HttpService.put('domain/batch/castools/upgrade', listData, undefined, showTaskList);
             }, function () {
             });
         },
		 //批量修改虚拟机
		 batchModifyVm : function(vmList) {
			 if (angular.isDefined(vmList)) {
				 var resolve = {vmList : function() {return vmList}};
				 var modalInstance = $modal.open({
						templateUrl: 'html/modal/common/batchModifyVm.html',
						controller: 'BatchModifyVmCtrl',
						size: {'width':'750px'},
						backdrop:'static',
						windowClass:"editvm-dialog",
						resolve: resolve
					}
					);
				 modalInstance.result.then(function (selectedItem) {
	             	}, function () {
	             });
			 }
		 },
		 //批量迁移虚拟机
		 batchMigrateVm : function(vmList) {
		     var resolve = {basicInfo: function() {},
		                    vmList : function() {return vmList}};
             var modalInstance = UtilService.lgmodal('html/modal/vm/migrateVm.html', 'migrateVmCtrl', resolve);
             modalInstance.result.then(function (selectedItem) {
             }, function () {
                 
             });
		 },
		 //批量创建还原点
		 batchCreateRestorePoint : function(vmList, showTaskList) {
			 if (angular.isDefined(vmList)) {
				 var modalInstance = UtilService.confirm($translate.instant('vm.createRestorePointConfirm'),$translate.instant('operConfirm'));
				 modalInstance.result.then(function () {
					 if (vmList.length > 0) {
						 var oneBtnRestoreDomainDetails = [];
						 for (var i = 0; i < vmList.length; i++) {
							 var oneBtnRestoreDomainDetail = {};
							 oneBtnRestoreDomainDetail.id = vmList[i].id;
							 oneBtnRestoreDomainDetail.title = vmList[i].title;
							 oneBtnRestoreDomainDetails.push(oneBtnRestoreDomainDetail);
						 }
					 }
					 HttpService.put("btnSeries/createRestorePoint", oneBtnRestoreDomainDetails, modalInstance, showTaskList);
				 }, function () {
				 });
			 }
		},
		//批量分配虚拟机
        batchDistributeVm : function(domainList) {
           var resolve = { orgData: function () {return null;},
                           domainList: function () {return domainList;}};
           var distrInstance = UtilService.modal('html/modal/common/distributeVmToUserOrUserGrp.html', 'destributeVmCtrl', resolve, '520px');
           distrInstance.result.then(function (snap) {
               $rootScope.$broadcast("onRefrenshVmUserList");
           }, function () {
               $rootScope.$broadcast("onRefrenshVmUserList");
           });
       },
		//--------------------------- Vmware 虚拟机操作 start--------------------
		//操作虚拟机(不包括删除)
	    operateVmwareVm : function(type, name, vmKey, cloudId, operateInfo, showTaskList) {
	        var param = {
	                vCenterId:cloudId,
	                key:vmKey,
	                name:name,
	                operateType:type
	        };
	        var operateVmInstance = UtilService.confirm($translate.instant('vm.operateConfirm', operateInfo),$translate.instant('operConfirm'));
	        operateVmInstance.result.then(function (selectedItem) {
	            HttpService.put('vmware/vcenter/vm/operate', param, undefined, showTaskList);
	        }, function () {
	        });
	    },
	    deleteVmwareVm : function(vmList, status, cloudId, showTaskList) {
	        if (vmList.length!=1) {
	            return;
	        }
	        var resolve = { vmStatus: function () {return status;},
	                        cloudId: function() {return cloudId},
	                        vmList: function() {return vmList}};
	        var deleteInstance = UtilService.modal('html/modal/vmware/deleteVm.html', 'deleteVmwareVmCtrl', resolve, '480px');
	        deleteInstance.result.then(function (deleteType) {
	            }, function () {
	            });
	    },
	    //创建快照
	    createVmwareSnapshot : function(cloudId, vmKey, name, status, showTaskList) {
	        if (status=='unknown') {
	            return;
	        }
	        var resolve = { vmStatus: function () {return status;}};
	        var snapInstance = UtilService.modal('html/modal/vmware/createSnapshot.html', 'snapshotVmwareVmCtrl', resolve, '520px');
	        snapInstance.result.then(function (snap) {
	            var param = angular.copy(snap);
	            param.vCenterId = cloudId;
	            param.key = vmKey;
	            param.name = name;
	            param.operateType = "snapshot";
	            HttpService.put('vmware/vcenter/vm/operate', param, undefined, showTaskList);
	        }, function () {
	        });
	    },
	    //克隆为模板
	    cloneVmwareTemplate : function(cloudId, vmKey, name, status, showTaskList) {
	        if (status=='unknown') {
	            return;
	        }
	        var resolve = { vcenterId: function () {return cloudId}};
	        var snapInstance = UtilService.modal('html/modal/vmware/cloneTemplate.html', 'cloneVmwareVmToTemplateCtrl', resolve, '510px');
	        snapInstance.result.then(function (snap) {
	            var param = angular.copy(snap);
	            param.vCenterId = cloudId;
	            param.key = vmKey;
	            param.name = name;
	            param.storageMorValue = snap.morValue;
	            param.operateType = "cloneToTemplate";
	            HttpService.put('vmware/vcenter/vm/operate', param, undefined, showTaskList);
	        }, function () {
	        });
	    },
	    //批量操作虚拟机
	    batchOperateVmwareVm : function(type, vmList, operateInfo, showTaskList) {
	        if (!angular.isArray(vmList) || vmList.length == 0) {
	            return;
	        }
	        var paramArr = [];
	        if ('delete' == type) {
	            var resolve = { vmStatus: function () {return status;},
                        cloudId: function() {return null},
                        vmList: function() {return vmList}};
	            
	            var deleteInstance = UtilService.modal('html/modal/vmware/deleteVm.html', 'deleteVmwareVmCtrl', resolve, '480px');
	            deleteInstance.result.then(function (deleteType) {
	                }, function () {
	                });
	        } else {
	            for (var i = 0; i < vmList.length; i++) {
	                var param = {
	                        vCenterId:vmList[i].vCenterId||vmList[i].cloudId,
	                        key:vmList[i].vmKey,
	                        //修改问题单:201707070085 批量操作虚拟机,未知状态虚拟机提示名称为null
	                        name:vmList[i].title || vmList[i].name,
	                        operateType:type
	                };
	                paramArr.push(param);
	            }
	            var operateVmInstance = UtilService.confirm($translate.instant('vm.confirmBatchOperateVm', operateInfo),$translate.instant('operConfirm'));
	            operateVmInstance.result.then(function (selectedItem) {
	                HttpService.put('vmware/vcenter/vm/batch/operate', paramArr, undefined, showTaskList);
	            }, function () {
	            }); 
	        }	        
        },
        //创建vmware虚拟机
        createVmwareVm : function(vmInfo) {
            var resolve = { vmInfo: function () {return vmInfo}};
            var snapInstance = UtilService.lgmodal('html/modal/vmware/createVm.html', 'vmwareCreateVmController', resolve);
            snapInstance.result.then(function (snap) {
            }, function () {
            });
        },
        //迁移vmware虚拟机
        migrateVmwareVm : function(cloudId, vmKey) {
            var waitModal = UtilService.wait();
            //查询虚拟机状态及所在主机key
            $http.get("vmware/vcenter/" + cloudId + "/vm/migrate?vmKey=" + vmKey)
                 .success(function(result){
                    waitModal.dismiss();
                    if (result.state == 0) {
                        var resolve = { vmInfo: function () {return result.data}};
                        var snapInstance = UtilService.lgmodal('html/modal/vmware/migrateVm.html', 'vmwareMigrateVmController', resolve);
                        snapInstance.result.then(function (snap) {
                        }, function () {
                        });
                    }
                    UtilService.handleResult(result);
                 }).error(function(response, code, headers, config) {
                       waitModal.dismiss();
                       UtilService.handleError(code);
                 });
        },
        //虚拟机在详细信息中删除,跳转到其上层虚拟机列表
        stateGoVmwareVmList : function(state) {
          //通过树节点判断当前页前
            var node = {};
            //云资源树
            var cloudResourceTree = $('#cloudResourcTreeId').data('treeview');
            //云服务树
            var cloudServiceTree = $('#cloudServiceTreeId').data('treeview');
            if (cloudResourceTree) {
                var selectNodesResource = cloudResourceTree.getSelected();
                if (selectNodesResource && selectNodesResource.length == 1) {
                    node = selectNodesResource[0];
                }
            }
            if (cloudServiceTree && !node.entryType) {
                var selectNodesService = cloudServiceTree.getSelected();
                if (selectNodesService && selectNodesService.length == 1) {
                    node = selectNodesService[0];
                }
            }
            
            if (node.entryType == constant.VMWARE) {
                state.go('main.vmware.vm', node.stateParams);
            } else if (node.entryType == constant.VMWARE_HOSTPOOL_TYPE) {
                state.go('main.vmwareHostpool.vm', node.stateParams);
            } else if (node.entryType == constant.VMWARE_CLUSTER_TYPE) {
                state.go('main.vmwareCluster.vm', node.stateParams);
            } else if (node.entryType == constant.VMWARE_HOST_TYPE) {
                state.go('main.vmwareHost.vm', node.stateParams);
            } else if (node.entryType == constant.CLOUD_HOST_TYPE) {
                state.go('main.cloudHost');
            }   
        },
	    //--------------------------- Vmware 虚拟机操作 end--------------------
        
        
        //--------------------------- cloudOS虚拟机操作 start--------------------
        //启动虚拟机
        operateCloudOSVm : function(type, domain, showTaskList) {
        	var operateInfo = '';
        	var size = undefined;
        	if (type == 'start') {
        		operateInfo = $translate.instant('vm.confirmStartVm');
        	} else if (type == 'close') {
        		operateInfo = $translate.instant('vm.confirmShutdownVm', {name:domain.title});
        		size = 'mg';
        	} else if (type == 'suspended') {
        		operateInfo = $translate.instant('vm.confirmSuspendedVm');
        	} else if (type == 'restart') {
        		operateInfo = $translate.instant('vm.confirmRestartVm');
        	} else if (type == 'revert') {
        		operateInfo = $translate.instant('vm.confirmResumeVm');
        	} else if (type == 'delete') {
        		operateInfo = $translate.instant('vm.confirmDeleteCloudOSVm');
        	}
        	domain.operateType = type;
        	
        	if (type == 'delete') {
	            var delmodalInstance = $modal.open({
	                templateUrl:'html/modal/common/deleteConfirm.html',
	                backdrop:"static",
	                controller:"deleteConfirmCtrl",
	                size:'mg',
	                width:'322px'
	            });
	            delmodalInstance.result.then(function(selectItem){
	                HttpService.post('cloudOS/vm/operate', domain, undefined, showTaskList);
	            },function(reason){
	            });
        	} else {
        		var operateVmInstance = UtilService.confirm(operateInfo, $translate.instant('operConfirm'), size);
       	        operateVmInstance.result.then(function (selectedItem) {
       	            HttpService.post('cloudOS/vm/operate', domain, undefined, showTaskList);
       	        }, function () {
       	        });
        	}
		 },
		 //批量操作虚拟机
		 batchOperateCloudOSVm : function(type, vmList, operateInfo, showTaskList) {
			 
		 },
	 };
});