routeApp.controller('LoginCtrl', ['$scope', '$translate','$http','$rootScope', 'UtilService',function($scope, $translate, $http, $rootScope, UtilService) {
	  $scope.setLang = function(langKey) {
	    // You can change the language during runtime
	    $translate.use(langKey);
	  };
	  
	  init = function() {
		  if (angular.isDefined($rootScope.uiConfig)) {
			  if ($rootScope.uiConfig.copyrightFrom == constant.casic) {
				  $rootScope.isCasIc = true;
			  } else if ($rootScope.uiConfig.copyrightFrom == constant.casicunis) {
				  $rootScope.isCasIcUnis = true;
			  }
			  if (angular.isDefined($rootScope.uiConfig.loginBackground)) {
				  $scope.sysBackgroundImg=$rootScope.uiConfig.loginBackground;
			  } else {
				  //航天二院定制版本没有背景图片
				  if (!$rootScope.isCasIc) {
					  $scope.sysBackgroundImg='css/img/loginpage.png';
				  }
					if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
						 $scope.sysBackgroundImg='css/img/loginpage_unis.png';
						 $rootScope.faviconImg='css/img/favicon_unis.png';
					}
					if ($rootScope.uiConfig.copyrightFrom == constant.unicloud) {
						$scope.sysBackgroundImg='css/img/loginpage_unicloud.png';
						$rootScope.faviconImg='css/img/favicon_unicloud.png';
					}
			  }
			  $scope.sysCopyright = UtilService.getCopyright();
			  if (angular.isDefined($rootScope.uiConfig.appTopTitle)) {
				  $scope.systemLogo=$rootScope.uiConfig.appTopTitle;
				  $scope.h3cloudlogo = '';
			  } else {
				  if ($rootScope.isCasIc) {
					  $scope.systemLogo = $translate.instant("spaceflightlogoImgPath");
				  } else if ($rootScope.isCasIcUnis) {
					  $scope.systemLogo = $translate.instant("icunisLogoPath");
				  } else {					
					  $scope.systemLogo = $translate.instant("caslogoImgPath");
				  }
				  var copyrighFrom = $rootScope.uiConfig.copyrightFrom;
				  if (copyrighFrom != constant.unis && copyrighFrom != constant.casic && copyrighFrom != constant.casicunis && copyrighFrom != constant.unicloud) {
					  $scope.h3cloudlogo = 'css/img/h3cloud.png';
				  }
			  }
			  $scope.copyrightLogo = UtilService.getCopyrightLogo();
			  
			  UtilService.setFavicon();
			  UtilService.setSystemName();

		  } else {
			  $scope.h3cloudlogo = 'css/img/h3cloud.png';
//			  $scope.systemLogo='images/caslogo.png';
			  $scope.systemLogo = $translate.instant("caslogoImgPath");
			  $scope.systemName=$translate.instant('casname2');
			  $rootScope.faviconImg='css/img/favicon.png';
			  $rootScope.systemName=$scope.systemName;
		  }
		  
	  };
	  init();
}])
.controller('formController',['$rootScope','$scope', 'HttpService', '$state','$http','$location','$modal','$translate','UtilService','PermissionService',
   function($rootScope, $scope, HttpService, $state, $http, $location,$modal, $translate, UtilService, PermissionService){
	 $scope.isActive = false;
	 $scope.errorMessage = '';
	 $scope.formData = {};
	 $scope.formData.lang = $translate.use();
	 $scope.onSubmit = function(isForce) {
		 
	 };
	 
     $scope.processForm = function(isForce) {
    	 if ($scope.usbkey) {
    		 if (isEmpty($scope.formData.pin)) {
    			 UtilService.error($translate.instant("usbkey.needpin"));
    			 return;
    		 }
    		 var Sys = UtilService.getSys();
			 if (Sys.chrome) {
				 UtilService.sendGetSnEvent();
			 } else {
				  var devPath = UtilService.enumDev();
				  if (!isEmpty(devPath)) {
					  //获取设备序列号
					  var sn = UtilService.getsn(devPath);
					  if (!isEmpty(sn)) {
						  var certDn = UtilService.getCertDn(sn);
						  if (!isEmpty(certDn)) {
							  var cn = UtilService.getcnByDn(certDn);
							  if ($rootScope.certype == 0) { //标准证书
								  UtilService.sign(certDn, cn, "SGD_SHA1", $scope.formData.pin);
							  } else if ($rootScope.certype == 1){
								  UtilService.sign(certDn, cn, "SGD_SM3", $scope.formData.pin);
							  } else {
								  UtilService.error($translate.instant("usbkey.rootCaNoExist"));
					    		  return;
							  }
							 
						  }
					  } 
				  }
			  }
    	 } else {
    		 if ($scope.loginform.$invalid) {
    			 //修改问题单201603090247，设置鼠标悬停在登录按钮上时为手形，用户名或密码输入为空时弹出错误提示框，by ckf6302
    			 UtilService.error($translate.instant("loginError"));
    			 return;
    		 }
    		 $scope.loginform.$invalid = true;//提交一次按钮置灰，防止重复提交
    		 var loginmodal = UtilService.wait();
    		 var username = UtilService.encryptByDES($scope.formData.name);
    		 var pwd = UtilService.encryptByDES($scope.formData.password);
    		 $http({
    			 method  : 'POST',
    			 url     : 'spring_check',
    			 params:{name:username,password:pwd,lang:$scope.formData.lang,isForce:isForce,encrypt:"true"},
    			 headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    		 }).success(function(result) {
    			 loginmodal.dismiss('cancel');
    			 if (result.online) {
    				 PermissionService.setPermissions(result.permissions);
    				 $rootScope.loginInfo = {};
    				 $rootScope.loginInfo.userName = result.userName;
    				 $rootScope.loginInfo.loginName = result.loginName;
    				 $rootScope.loginInfo.loginIp = result.loginIp;
    				 $rootScope.loginInfo.loginTime = result.loginTime;
    				 $rootScope.loginInfo.id = result.id;
    				 if (angular.isDefined(localStorage)) {
    					 delete result.pwd;
    					 localStorage.setItem("cicLoginInfo", JSON.stringify(result));
    				 }
    				 $http({
    					 method  : 'GET',
    					 url     : 'ui/getParam/operSkin',
    					 params  : {}
    				 }).success(function(result) {
    					 if (result.data) {
    						 UtilService.changeSkin(result.data.param);
    					 }
    					 UtilService.loginToPage();
    				 }).error(function(response, code, headers, config) {
    					 UtilService.loginToPage();
    				 });
    				 
    				 //检查是否系统管理员使用默认密码登录
    				 $http({
    					 method : 'GET',
    					 url    : 'operator/isSysAdminDefPwd',
    				 }).success(function(result) {
    					 if (result) {
    						 //提示是否修改密码
    						 var modalInstance = $modal.open({
    							 templateUrl: 'html/partials/systemManage/securityMng/modifypwdTip.html',
    							 controller: 'ModifyOperatorCtrl',
    							 backdrop:'static',
    							 size: 'sm',
    							 resolve: {
    								 items: function () {
    									 return {"pwd":pwd};
    								 }
    							 }
    						 });
    						 
    						 modalInstance.result.then(function (selectedItem) {
    						 }, function () {
    						 });
    					 }
    				 }).error(function(response, code, headers, config) {
    					 
    				 });  
    				 
    				 
    			 } else {
    				 // 登录失败
    				 //用户登录失败－密码过期
    				 if (result.loginFailErrorCode == constant.USERAUTH_PASSWORD_OVERDUE_ERROR) {
    					 $scope.formData.password = null;
    					 $("#pwd").focus();
    					 $http({
    						 method  : 'GET',
    						 url     : 'systemConfig/pwdConfig'
    					 }).success(function(result) {
    						 UtilService.handleResult(result);
    						 if (result.success == true) {
    							 var map = result.data;
    							 var minlen = map['pwd.min.length'];
    							 var val = map['pwd.complexity'];
    							 var modalInstance = $modal.open({
    								 templateUrl: 'html/modal/login/modifypwd.html',
    								 controller: 'ModalInstanceCtrl',
    								 backdrop:'static',
    								 width:'520px',
    								 resolve: {
    									 items: function () {
    										 return {"minlen":minlen,"val":val,"modifyType":0};
    									 }
    								 }
    							 });
    							 
    							 modalInstance.result.then(function (selectedItem) {
    							 }, function () {
    							 });
    						 } 
    					 })
    				 } else if (result.loginFailErrorCode == constant.CURR_OPER_ONLINE_NUM_MORE_THAN_MAX_NUM) {// 此账户在线数量已经达到最大数量限制。
    					 $scope.loginform.$invalid = false;
    					 var modalInstance = UtilService.confirm($translate.instant('currOperOnlineMax'),$translate.instant('operConfirm'));
    					 modalInstance.result.then(function (selectedItem) {
    						 $scope.processForm(true);
    					 }, function () {
    						 //$log.info('Modal dismissed at: ' + new Date());
    					 });
    				 } else {
    					 // 重新输入密码
    					 UtilService.error(result.loginFailMessage);
    					 $scope.formData.password = null;
    					 $("#pwd").focus();
    				 }
    			 }
    		 }).error(function(response, code, headers, config) {
    			 loginmodal.dismiss('cancel');
    			 UtilService.handleError(code);
    		 });
    	 };
     }
     $scope.forgetPwd = function() {
    	 var modalInstance = $modal.open({
             templateUrl: 'html/modal/login/forgetPwd.html',
             controller: 'forgetPwdController',
             size: {width:'520px'},
             backdrop:'static'
         });
     };
     $scope.productRegister=function(){
    	 var resolve={};
    	 var registerInstance=UtilService.lgmodal('productRegister.html','registerController',resolve);
     };
	 //  License Server授权
	   $scope.registerByLicenseServer = function () {
		   $http.get('licenseClient/isUltimateCvm').then(function (result) {
			   if (result && result.data&& result.data.data === true) {
				   var modalInstance = UtilService.confirm($translate.instant('licenseServer.switchToLicenseServerModeTips'), $translate.instant('common.opertip'));
				   modalInstance.result.then(function (selectedItem) {
					   HttpService.put("licenseClient/switchToLicenseServerMode", undefined, undefined, function (result) { });
				   }, function () { });
			   } else {
				   var resolve = {
					   needCheckAdmin: function () { return true }
				   };
				   var registerInstance = UtilService.lgmodal('productRegisterByServer.html', 'registerByServerController', resolve);
				   registerInstance.result.then(function (selectedItem) {
				   }, function () {
				   });
			   }
		   });
	   }
     $scope.enter = function(ev) { 
		 if (ev.keyCode == 13 && $scope.formData.name != null && $scope.formData.password != null) 
		    if( !$scope.loginform.$invalid)//如果按钮置灰则不能提交
				 $scope.processForm();
	 };
     $scope.changeLanguage = function() { 
    	 $scope.setLang($scope.formData.lang);
     };
     $scope.$on('login', function(event,msg){
    	 var certDn = msg.certDn;
    	 var cn = UtilService.getcnByDn(certDn);
    	 if ($rootScope.certype == 0) {
    		 //标准证书
    		 UtilService.sendGetCertEvent(cn, certDn, constant.SGD_SHA1, $scope.formData.pin);
    	 } else if ($rootScope.certype == 1){ //国密证书
    		 UtilService.sendGetCertEvent(cn, certDn, constant.SGD_SM3, $scope.formData.pin);
    	 } else {
    		 UtilService.error($translate.instant("usbkey.rootCaNoExist"));
   		     return;
    	 }
    	
     })
}]);
routeApp.controller('ModalInstanceCtrl',['$scope','$http','$translate','$modalInstance','items','UtilService',
  function($scope, $http, $translate, $modalInstance, items, UtilService) {
	  $scope.pwd ={};
	  $scope.minlen = items.minlen;
	  $scope.minlenmsg= $translate.instant("minlenx",{v:items.minlen});
	  $scope.complexValue= items.val;
	  $scope.modifyType = items.modifyType;//0密码过期修改 1初始密码修改
	  $scope.getPwdCheckMsg = function(complex) {
	        if (1 == complex) {//必须混合使用字母和数字
	            return $translate.instant('securityMng.charNum');
	        } else if (2 == complex) {//必须包含特殊字符
	            return $translate.instant('securityMng.specialChar');
	        } else if (3 == complex) {//必须字母数字特殊字符
	            return $translate.instant('securityMng.charNumSpecial');
	        } else if (4 == complex) {//必须大小写字母数字特殊字符组合
	            return $translate.instant('securityMng.ulcharNumSpecial');
	        }
	    };
	  $scope.ok = function () {
		  $scope.pwd.loginName= $("#loginName").val();
		  var loginName = undefined;
		  if ($("#loginName").val() != undefined) {
			  loginName = UtilService.encryptByDES($("#loginName").val());
		  }
		  var oldPwd = UtilService.encryptByDES($scope.pwd.oldPwd);
		  var newPwd = UtilService.encryptByDES($scope.pwd.newPwd);
		  $http({
              method  : 'POST',
              url     : 'login/modifyPassword',
              params:{loginName:loginName,newPwd:newPwd,oldPwd:oldPwd}
          }).success(function(result) {
        	  UtilService.handleResult(result);
        	  if (result.success == true) {
        		  $modalInstance.dismiss('cancel');
        	  }
          }).error(function(response, code, headers, config) {
        	  UtilService.handleError(code);
		  });
	  };
	  
	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
}]);

routeApp.controller('ModifyOperatorCtrl',['$scope','$http','$translate','$modalInstance','$modal', 'items','UtilService',
                                          function($scope, $http, $translate, $modalInstance, $modal, items, UtilService) {

 	$scope.ok = function () {
 		 $http({
 			 method  : 'GET',
 			 url     : 'systemConfig/pwdConfig'
 		 }).success(function(result) {
 			 UtilService.handleResult(result);
 			 if (result.success == true) {
 				 $modalInstance.dismiss('cancel');
 				 var map = result.data;
 				 var minlen = map['pwd.min.length'];
 				 var val = map['pwd.complexity'];
 				 
 				 var modalInstance = $modal.open({
 					 templateUrl: 'html/modal/login/modifypwd.html',
 					 controller: 'ModalInstanceCtrl',
 					 backdrop:'static',
 					 width:'520px',
 					 resolve: {
 						 items: function () {
 							 return {"minlen":minlen,"val":val,"modifyType":1};
 						 }
 					 }
 				 });
 				 
 				 modalInstance.result.then(function (selectedItem) {
 				 }, function () {
 				 });
 			 } 
 		 });
 	};
        	  
 	$scope.cancel = function () {
 		$modalInstance.dismiss('cancel');
 	};
 }]);

//待处理电子流提示气泡
routeApp.controller('flowHeadController',['$compile','$rootScope','$scope','$state','$http','$translate','$timeout','UtilService','GridService','PermissionService',
  function($compile, $rootScope, $scope, $state, $http, $translate, $timeout, UtilService, GridService, PermissionService) {
	$("#loginInfoButton").popover({ html: true });
	$scope.vmworkFlowTotal = 0;
	$scope.cloudDiskTotal = 0;
	$scope.registerUserWorkflowTotal = 0;
	$scope.backStrategyTotal = 0;
	//当前系统未处理电子流个数
	var getWorkFlowDetail = function() {
		$http.get("dashboard/getWorkFlowNum").success(function(result){
			if (PermissionService.hasPermission('VMWORKFLOW_VIEW')) { //虚拟机电子流
				$scope.vmworkFlowTotal = result.vmworkFlowTotal;
			} else {
				$scope.vmworkFlowTotal = 0;
			}
			if (PermissionService.hasPermission('CLOUDDISKFLOW_VIEW')) { //虚拟机电子流
				$scope.cloudDiskTotal = result.cloudDiskTotal;
			} else {
				$scope.cloudDiskTotal = 0;
			}
			if (PermissionService.hasPermission('USERREGISTERFLOW_VIEW')) { //虚拟机电子流
				$scope.registerUserWorkflowTotal = result.registerUserWorkflowTotal;
			} else {
				$scope.registerUserWorkflowTotal = 0;
			}
			if (PermissionService.hasPermission('CLOUDBACKUPSTRATEGY_VIEW')) { //虚拟机电子流
				$scope.backStrategyTotal = result.backStrategyTotal;
			} else {
				$scope.backStrategyTotal = 0;
			}
			var total = $scope.vmworkFlowTotal + $scope.cloudDiskTotal + $scope.registerUserWorkflowTotal + $scope.backStrategyTotal;
			$scope.flowNeed = total;
			$("#warn-top").text(total);
			$("#vmworkFlow_id").text($scope.vmworkFlowTotal);
			$("#cloudDisk_id").text($scope.cloudDiskTotal);
			$("#registerUserWorkflow_id").text($scope.registerUserWorkflowTotal);
			$("#backStrategy_id").text($scope.backStrategyTotal);
		})
	};
	//获取当前系统待处理电子流
	getWorkFlowDetail();
	//定时器开启定时查询
	var timer = setInterval(getWorkFlowDetail, $scope.cycle);

	//电子流按钮失去焦点时，显示的待处理电子流信息div消失
	$("#flowNeed").blur(function(){
		$("#flowNeed").popover('hide');
	});
	$("#flowNeed").popover({
		html:true, 
		content:function() {
			var flowNeedStr = '<nobr><button type="button" has-permission="VMWORKFLOW_VIEW" class="icon-vm-workflow-tooltip" custom-title="'+$translate.instant('cloudHost.cloudHost')+'" ng-click="btnToWorkFlowDetail()" style="background-color:#fff;border:none"/><span id="vmworkFlow_id" has-permission="VMWORKFLOW_VIEW" style="cursor:pointer;" ng-click="btnToWorkFlowDetail()">' + $scope.vmworkFlowTotal //$scope.vmworkFlowTotal
			+ '</span> <button type="button" has-permission="CLOUDDISKFLOW_VIEW" class="icon-vm-disk-workflow-tooltip" custom-title="'+$translate.instant('dashboard.cloudDisk')+'" ng-click="btnToDiskWorkFlowDetail()" style="background-color:#fff;border:none"/><span id="cloudDisk_id" has-permission="CLOUDDISKFLOW_VIEW" style="cursor:pointer;" ng-click="btnToDiskWorkFlowDetail()">' + $scope.cloudDiskTotal  //$scope.cloudDiskTotal
			+ '</span> <button type="button" has-permission="USERREGISTERFLOW_VIEW" class="icon-user-preregister-workflow-tooltip" custom-title="'+$translate.instant('dashboard.registerUserWorkflow')+'" ng-click="btnToPreregisterWorkFlowDetail()" style="background-color:#fff;border:none"/><span id="registerUserWorkflow_id" has-permission="USERREGISTERFLOW_VIEW" style="cursor:pointer;" ng-click="btnToPreregisterWorkFlowDetail()">' + $scope.registerUserWorkflowTotal  //$scope.registerUserWorkflowTotal
			+ '</span> <button type="button" has-permission="CLOUDBACKUPSTRATEGY_VIEW" class="icon-cvm-backup-tooltip" custom-title="'+$translate.instant('dashboard.backStrategy')+'" ng-click="btnToBackFlowDetail()"  style="background-color:#fff;border:none"/><span id="backStrategy_id" has-permission="CLOUDBACKUPSTRATEGY_VIEW" style="cursor:pointer;" ng-click="btnToBackFlowDetail()">' + $scope.backStrategyTotal + '</span></nobr>'; //$scope.backStrategyTotal
		 	return $compile($(flowNeedStr).html())($scope);
		}
	});
	
	$scope.btnToFlowView = function (level) {
		$("#loginInfoButton").popover('hide');
		//点击电子流按钮时刷新待处理电子流
		getWorkFlowDetail();
	};
	
	$scope.btnToWorkFlowDetail = function () {
		$("#flowNeed").popover('hide');
		var options = {};
		options.reload = true;
		if ($state.current.name == 'main.workflowVm') {
			//当前页就是云主机电子流页面，发送刷新事件
			$rootScope.$broadcast(constant.onReloadVmList);
		} else {
			//非云主机电子流页面，进行跳转
		$state.go('main.workflowVm', options);
		}
	};
	$scope.btnToDiskWorkFlowDetail = function () {
		$("#flowNeed").popover('hide');
		var options = {};
		options.reload = true;
		if ($state.current.name == 'main.workflowDisk') {
			//当前页就是云硬盘电子流页面，发送刷新事件
			$rootScope.$broadcast(constant.onReloadDiskWorkFlowList);
		} else {
		$state.go('main.workflowDisk', options);
		}
	};
	$scope.btnToPreregisterWorkFlowDetail = function () {
		$("#flowNeed").popover('hide');
		var options = {};
		options.reload = true;
		if ($state.current.name == 'main.workflowRegister') {
			//当前页就是用户预注册电子流页面，发送刷新事件
			$rootScope.$broadcast(constant.onReloadRegisterWorkFlowList);
		} else {
		$state.go('main.workflowRegister', options);
		}
	};
	$scope.btnToBackFlowDetail = function () {
		$("#flowNeed").popover('hide');
		var options = {};
		options.reload = true;
		if ($state.current.name == 'main.workflowBack') {
			//当前页就是云备份电子流页面，发送刷新事件
			$rootScope.$broadcast(constant.onReloadBackupWorkFlowList);
		} else {
		$state.go('main.workflowBack', options);
		}
	};
	$scope.$on("$destroy", function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	});
}]);	
//云工单提示气泡
routeApp.controller('workOrderController',['$compile','$rootScope','$scope','$state','$http','$translate','$timeout','UtilService','GridService',
  function($compile, $rootScope, $scope, $state, $http, $translate, $timeout, UtilService, GridService) {
	$("#loginInfoButton").popover({ html: true });
	$scope.workOrderNum = 0;
	//当前系统未处理云工单
	var getWorkOrderDetail = function() {
		$http.get("dashboard/getWorkOrderNum").success(function(result){
			var total = result.workOrderNum;
			$("#order-top").text(total);
			$scope.workOrderNeed = total;
		})
	};
	
	//当前系统待处理云工单
	getWorkOrderDetail();
	//定时器开启定时查询
	var timer = setInterval(getWorkOrderDetail, $scope.cycle);
	
	$scope.btnToWorkOrderView = function (level) {
		$("#loginInfoButton").popover('hide');
		$("#flowNeed").popover('hide');
		//点击电子流按钮时刷新待处理云工单
		getWorkOrderDetail();
		btnToWorkFlowDetail();
	};
	var btnToWorkFlowDetail = function () {
		var options = {};
		options.reload = true;
		if ($state.current.name == 'main.cloudWorkorder') {
			//当前页就是云工单页面，发送刷新事件
			$rootScope.$broadcast(constant.onReloadWorkOrderList);
		} else {
		$state.go('main.cloudWorkorder', options);
		}
	};
	$scope.$on("$destroy", function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	});
}]);	

//右上角导航条控制器
routeApp.controller('NavController',['$timeout','$rootScope','$scope','$state','$window','$http','$translate','$modal','UtilService','HttpService',
		function($timeout, $rootScope, $scope, $state,$window, $http, $translate, $modal, UtilService, HttpService) {
	$scope.logout = function () {
		var modalInstance = UtilService.confirm($translate.instant('common.confirmLogout'), $translate.instant('operConfirm'));
		modalInstance.result.then(function (selectedItem) {
			UtilService.logout();
		}, function () {
			//点击取消
		});
	};
	
	$scope.openHelp = function() {
		var origin = document.location.origin;
		var url = origin+ "/cichelp/index.jsp?topic=%2Fcom.virtual.help%2Fhtml%2FsysIntro.html";
		if ($rootScope.uiConfig.copyrightFrom != constant.unicloud) {
        	if ("en_US" == globalLang) {
        		url = origin+ "/cicenhelp/index.jsp?topic=%2Fcom.virtual.help%2Fhtml%2FsysIntro.html";
        	}
		} else {
		    url = origin+ "/ischelp/index.jsp?topic=%2Fcom.virtual.help%2Fhtml%2FsysIntro.html";
		}
		window.open(url,"_blank");
	};
	//关于
	$scope.openAbout = function() {
		var modalInstance = $modal.open({
	        templateUrl: 'html/modal/common/about.html',
	        controller: 'AboutCtrl',
	        width:'450px',
	        backdrop:'static'
	      });

	      modalInstance.result.then(function (selectedItem) {
	      }, function () {
	  });
		
	};
	//技术论坛
	$scope.openTechForum = function() {
		var url = "http://forum.h3c.com/forum-643-1.html";
		window.open(url,"_blank");
	};
	//资料下载
	$scope.techExper = function() {
		var url = "http://www.h3c.com.cn/pub/weizhan/201603/cas/";
		window.open(url,"_blank");
	};
	$scope.helpExper = function() {
		var url = 'html/help/plat/'
		if ($rootScope.uiConfig.copyrightFrom != constant.unicloud) {
			if("en_US" == globalLang){
				url = url +'CIC_help_en.chm'
			}else{
				url = url +'CIC_help_zh.chm'
			}
		} else {
			url = "html/help/unicloud/";
			url = url +'ISC_help_zh.chm'
		}
		window.open(url,"_blank");
	};
}]);
routeApp.controller('AboutCtrl',['$rootScope','$scope','$http','$translate','$modal','$modalInstance', 'UtilService','HttpService',
        function($rootScope, $scope, $http, $translate, $modal,$modalInstance, UtilService, HttpService) {
  	$("#keydownModalBody").focus();
  	$("#keydownModalBody").focus();
  	$scope.productName= UtilService.getSystemName("casname");
	$scope.copyright = UtilService.getCopyright();
  	$scope.isShowInnerVersion = false;
  	$scope.keydown = function(ev) { 
  		 if (ev.keyCode == 120) {
  			 $scope.showInnerVersion = true;
  		 }
  	};
  	$http.get("cloud/version").success(function(result){
  		var strList = result.data;
  		if (angular.isArray(strList) && strList.length >= 3) {
  			$scope.productVersion = strList[0];
  		}
  		var innerVersion = strList[2];
  		if (!isEmpty(innerVersion)) {
  			$scope.innerVersion = innerVersion;
  		}
  	});
  	$scope.cancel = function () {
  		$modalInstance.dismiss('cancel');
      };
  }]);
//全局搜素控制器
routeApp.controller('casSearchController',['$scope','$state','$http','$translate','$timeout','UtilService','GridService',
  function($scope, $state, $http, $translate, $timeout, UtilService, GridService) {
	$scope.entity = undefined;   //store selected host or domain, support params to $state.go()
	$scope.searchType = 'vm_title';
	$scope.holder = $translate.instant('vmTitleSearchHolder');
	
	$scope.params = {};
	$scope.url = 'domain';
	$scope.nameKey = 'title';
	$scope.selectedValue = 'title';
	$scope.selectedText = 'title';
	$scope.searchUrl = 'domain/title';
	
	$scope.selectSearchType = function(type) {
		$scope.searchType = type;
		$scope.globalSearchText = undefined;
		if (type == 'vm_title') {
			$scope.params = {};
			$scope.url = 'domain';
			$scope.selectedText = 'title';
			$scope.holder = $translate.instant('vmTitleSearchHolder');
			$scope.nameKey = 'title';
			$scope.searchUrl = 'domain/title';
		} else if (type == 'vm_ip') {
			$scope.url = 'domain/ipAddr';
			$scope.params = {};
			$scope.selectedText = 'displayname';
			$scope.nameKey = 'ipAddr';
			$scope.holder = $translate.instant('vmIPSearchHolder');
			$scope.searchUrl = 'domain/ipAddress';
		} else {
			$scope.params = {};
			$scope.selectedText = 'name';
			$scope.nameKey = 'hostName';
			$scope.url = 'host/condition';
			$scope.holder = $translate.instant('hostNameSearchHolder');
			$scope.searchUrl = 'host/name';
		}
	};
    
    $scope.$on('car-search-select', function(event, entity) {
    	$scope.entity = entity;
    });
	
	//search button click
	$scope.globalSearch = function() {
		//when Enter key pressed or shear button clicked, hide grid.
		if (angular.isUndefined($scope.entity)) {
			if ($scope.globalSearchText != null && $scope.globalSearchText != "") {
				var params ={};
				params[$scope.nameKey] = $scope.globalSearchText;
				$http({
	                method: 'GET',
	                url: $scope.searchUrl,
	                params: params
	            }).success(function(result) {
	            	if (result.success == true) {
	            		$scope.entity = result.data;
		            	goState();
	            	} else {
	            		UtilService.handleResult(result)
	            	}
	            }).error(function(response, code, headers, config) {
	                UtilService.handleError(code);
	            });
			}
		} else {
			goState();
		}
		
	};
	
	function goState() {
		if ($scope.searchType == 'vm_title' || $scope.searchType == 'vm_ip') {
//			if ($scope.searchType == 'vm_title' && $scope.globalSearchText != $scope.entity.title) {
//				return;
//			}
//			if ($scope.searchType == 'vm_ip' && $scope.globalSearchText != $scope.entity.displayname) {
//				return;
//			}
			//set params and go to domain page
			var params = {};
			params.id = $scope.entity.id;
			params.name = $scope.entity.domainName;
			params.title = $scope.entity.title;
			params.hostId = $scope.entity.hostId;
			params.hostName = $scope.entity.hostName;
			params.clusterId = $scope.entity.clusterId;
			params.clusterName = $scope.entity.clusterName;
			params.hpId = $scope.entity.hpId;
			params.hpName = $scope.entity.hpName;
			$state.go('main.vm.dashboard', params);
			$scope.entity = undefined;
		} else {
//			if ($scope.globalSearchText != $scope.entity.name) {
//				return;
//			}
			
			var params = {};
			params.id = $scope.entity.id;
			params.name = $scope.entity.name;
			params.clusterId = $scope.entity.clusterId;
			params.clusterName = $scope.entity.clusterName;
			params.hpId = $scope.entity.hpId;
			params.hpName = $scope.entity.hpName;
			$state.go('main.host.dashboard', params);
			$scope.entity = undefined;
		}
	}
}]);	
routeApp.controller('forgetPwdController',['$scope','$http','$translate','HttpService','$modalInstance','UtilService',
                                           function($scope, $http, $translate, HttpService, $modalInstance, UtilService) {
    	$scope.entry = {};
    	$scope.ok = function() {
    		var url = 'login/forgetPassword';
    		HttpService.post(url, $scope.entry, $modalInstance);
    	};
    	$scope.cancel = function() {
    		$modalInstance.dismiss("cancel");
    	};
}]);
//【产品注册控制器】
routeApp.controller('registerController',['$scope','$http','$translate','$timeout','$modalInstance','UtilService',
  function($scope, $http, $translate, $timeout, $modalInstance, UtilService) {
	$scope.model = {};
	$scope.isOk = false;
	$scope.model.licenseOpe = '0';
	$scope.stream = null;
	$scope.confirmClose = 1; 
	$scope.stepTitles = [ $translate.instant('selBasicOperate'),
			$translate.instant('inputRegisterInfo'),
			$translate.instant('downloadFile') ];
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
				return true;
		}

	};
	$scope.licenseOpe = {
		options : [ {
			value : '0',
			label : $translate.instant("applyNewLicenseOrUpdate")
		}, {
			value : '1',
			label : $translate.instant("useLicenseRegister")
		} ]
	};
	$scope.nationRegion = {
		options : UtilService.getNationRegion()
	};
	$scope.$watch('model.licenseOpe', function() {
		if ($scope.model.licenseOpe == '0') {
			$scope.stepTitles = [ $translate.instant('selBasicOperate'),
					$translate.instant('inputRegisterInfo'),
					$translate.instant('downloadFile') ];
		} else {
			$scope.stepTitles = [ $translate.instant('selBasicOperate'),
					$translate.instant('licenseMng.registerLicense') ];
		}
	});
	var config = {
		customered : true, /**是否自定义ui**/
		browseFileId : "license_select_files_btn", /** 选择文件的ID, 默认: i_select_files */
		browseFileBtn : "<div>请选择文件</div>", /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
		dragAndDropArea: "license_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
		dragAndDropTips: "<span></span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
		filesQueueId : "license_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
		filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
		messagerId : "license_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
		multipleFiles: false, /** 多个文件一起上传, 默认: false */
		autoUploading: true, /** 选择文件后是否自动上传, 默认: true */
		tokenURL : "fileUpload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
		frmUploadURL : "fileUpload/fd;", /** Flash上传的URI */
		uploadURL : "fileUpload/upload", /** HTML5上传的URI */
		swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
		simLimit: 1, /** 单次最大上传文件个数 */
		extFilters: [".license", ".lic"], /** 允许的文件扩展名, 默认: [] */
		checkFileName : false,/**对文件名检测是否允许输入特殊字符，默认为true*/
		onSelect: function(list) {
			$timeout(function(){$scope.licenseFilePath = list[0].name;
				$scope.isOk = false;
			});
		}, /** 选择文件后的响应事件 */
//		onMaxSizeExceed: function(size, limited, name) {alert('onMaxSizeExceed')}, /** 文件大小超出的响应事件 */
//		onFileCountExceed: function(selected, limit) {alert('onFileCountExceed')}, /** 文件数量超出的响应事件 */
		onNameRegexMismatch: function(file) {
			fShowMessage($translate.instant('licenseMng.uploadisoNameRegexMismatch',{value:file.name}), true);
		},
		onExtNameMismatch: function(file, filters) {
			fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
			$timeout(function(){$scope.licenseFilePath = "";});
		}, /** 文件的扩展名不匹配的响应事件 */
//		onCancel : function(file) {$scope.progress = file.percent;}, /** 取消上传文件的响应事件 */
		onComplete: function(file) {
			$timeout(function(){$scope.isOk = true;});
			$scope.stream.destroy();
			$scope.stream = new Stream($scope.config);
		}, /** 单个文件上传完毕的响应事件 */
//		onQueueComplete: function() {alert('onQueueComplete')}, /** 所以文件上传完毕的响应事件 */
//		onUploadError: function(status, msg) {alert('onUploadError')} /** 文件上传出错的响应事件 */
		onUploadProgress: function(file) {},
		onDestroy: function() {} /** 文件上传出错的响应事件 */
	};
	$scope.config = config;
	$scope.register = function() {
		var waitModal = UtilService.wait();
    	$http.put("license/register?fileName=" + encodeURIComponent(encodeURIComponent($scope.licenseFilePath)), $scope.domain).success(function(result){
    		waitModal.dismiss();
      	  	UtilService.handleResult(result);
      	  	if (!result.success) {
      	  		$scope.isOk = false;
      	  		$scope.licenseFilePath = undefined;
      	  	}
    	}).error(function(response, code, headers, config) {
      	  waitModal.dismiss();
    	  UtilService.handleError(code);
    	});
	}
	$scope.nextCallBack = {
		"0":function() {
	    },
		"1":function() {
    		if ($scope.model.licenseOpe == "1") { 
    			if ($scope.stream == null) {
    				$scope.stream = new Stream($scope.config);
    				$("#license_select_files").hide();
    				$("#license_stream_files_queue").hide();
    				$("#license_stream_message_container").hide();
    			}
    		}
    		if ($scope.model.loginPwd && $scope.model.loginPwd != "") {					
    			var promise = UtilService.checkAdminPwd($scope.model.loginPwd);	 
    			promise.then(function(result){
    				if (!isEmpty(result.loginFailMessage)) {
    					UtilService.error(result.loginFailMessage, $translate.instant('common.errorTip'));
			}  else {
    					result.success = true;
    				}
    			})
    			return promise;
    		} else {
				return true;
			}
    	}		
	};
	function fShowMessage(msg, warning) {
    	var o = document.getElementById("license_select_files_btn_alert");
    	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
    }
	function falertMessage(msg,warning){
    	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:0px;padding:10px;margin-bottom:10px;word-break:break-all;" class="alert ';
    	s+= !!warning?"alert-danger":"alert-success";
    		s+='" role="alert">'+
    		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
    		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
    		msg+'</div>';
    	return s;
    }
	$scope.download = function() {
		// 保存参数配置
		var data = angular.copy($scope.model);
		$http({
			method : 'PUT',
			url : 'license/createHostInfo',
			data : data
		}).success(function(result) {
			UtilService.handleResult(result);
			if (result.success) {
//				window.open('license/download', '_blank', null);
				var elemIF = document.createElement("iframe");   
		        elemIF.src = 'license/download';   
		        elemIF.style.display = "none";   
		        document.body.appendChild(elemIF); 
			}
		}).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		});
	};
	$scope.ok = function() {
		if ($scope.stream != null) {
			$scope.stream.destroy();
	    	$scope.stream=null;
		}
		$modalInstance.dismiss("cancel");
	};
	$scope.cancel = function() {
		if ($scope.stream != null) {
			$scope.stream.destroy();
	    	$scope.stream=null;
		}
		$modalInstance.dismiss("cancel");
	};
}]);

//【产品注册 License Server控制器】
routeApp.controller('registerByServerController', function ($q, $scope, $http, $translate, $timeout, $modal, $modalInstance, UtilService, HttpService, needCheckAdmin) {
	$scope.model = {};
	$scope.connectFormChanged = false;
	$scope.loginModel = {};
	$scope.license = {};
	$scope.editDisabled = false;
	$scope.showClientPasswordInput = true;
	$scope.connectStatus = false;
	$scope.showSrmTable = false;
	$scope.showCicTable = false;
	$scope.finalApplyLicense = null;
	$scope.needCheckAdmin = needCheckAdmin;
	$scope.licenseArray = [];
	$scope.srmLicenseArray = [];
	$scope.cicLicenseArray = [];
	$scope.choosedLicenseArray = [];
	$scope.choosedSrmLicenseArray = [];
	$scope.choosedCicLicenseArray = [];
	$scope.stepTitles = [
		$translate.instant('selBasicOperate'),
		$translate.instant('vmLicenseConfig')
	];
	$scope.valids = {
		stepOneOver: function () {
			if ($('#form1').val() === "true") {
				return true;
			}
			return false;
		},
		stepTwoOver: function () {
			if ($('#form2').val() === "true") {
				return true;
			}
			return false;
		}

	};
	// 检测是否使用了cvm的license server
	$scope.checkIsUsingCvmLicenseServer = function () {
		$http({
			method: 'GET',
			url: 'licenseClient/hasCvm',
		}).success(function (result) {
			if (result.success && result.data === true) {
				$scope.editDisabled = true;
			}
		}).error(function (response, code, headers, config) { });
	}
	$scope.$watch('model.ip', function (newVal, oldVal) {
		if (newVal !== oldVal && newVal !== $scope.originModel.ip) {
			$scope.connectFormChanged = true;
		}
	}, true);
	$scope.$watch('model.port', function (newVal, oldVal) {
		if (newVal !== oldVal && newVal !== $scope.originModel.port) {
			$scope.connectFormChanged = true;
		}
	}, true);
	$scope.$watch('model.username', function (newVal, oldVal) {
		if (newVal !== oldVal && newVal !== $scope.originModel.username) {
			$scope.connectFormChanged = true;
		}
	}, true);
	$scope.connectLicenseServer = function () {
		var deferred = $q.defer();
		var param = {
			username: $scope.model.username,
			password: $scope.model.newPassword ? UtilService.encryptByDES($scope.model.newPassword) : UtilService.encryptByDES($scope.model.password),
			ip: $scope.model.ip,
			port: $scope.model.port,
			loginPwd: $scope.loginModel.loginPwd,
		};
		if ($scope.connectStatus === true) {
			HttpService.put('licenseClient/disconnect', {}, undefined, function () {
				$http({
					method: 'PUT',
					url: 'licenseClient/connectAndSaveConfig',
					data: param
				}).success(function (result) {
					if (result.success) {
						$scope.refreshData();
						deferred.resolve(result);
					} else {
						UtilService.error($translate.instant('licenseServer.connectLicenseError'), $translate.instant('common.errorTip'));
						deferred.reject(result);
					}
				}).error(function (response, code, headers, config) {
					deferred.reject(code);
				});
			});
		} else {
			$http({
				method: 'PUT',
				url: 'licenseClient/connectAndSaveConfig',
				data: param
			}).success(function (result) {
				if (result.success) {
					$scope.refreshData();
					deferred.resolve(result);
				} else {
					UtilService.error($translate.instant('licenseServer.connectLicenseError'), $translate.instant('common.errorTip'));
					deferred.reject(result);
				}
			}).error(function (response, code, headers, config) {
				deferred.reject(code);
			});
		}
		return deferred.promise;
	};
	$scope.stopConnectLicenseServer = function () {
		var modalInstance = UtilService.confirm($translate.instant("licenseServer.stopConnectLicenserver"), $translate.instant("common.opertip"));
		modalInstance.result.then(function () {
			if ($('#form1').val() === "true") {
				if ($scope.needCheckAdmin) {
					var promise = UtilService.checkAdminPwd($scope.loginModel.loginPwd);
					promise.then(function (result) {
						if (!isEmpty(result.loginFailMessage)) {
							UtilService.error(result.loginFailMessage, $translate.instant('common.errorTip'));
						} else {
							var param = {
								username: $scope.model.username,
								password: UtilService.encryptByDES($scope.model.password),
								ip: $scope.model.ip,
								port: $scope.model.port,
								loginPwd: $scope.loginModel.loginPwd,
							};
							HttpService.put('licenseClient/disconnect', param, undefined, $scope.refreshDataAfterDisconnect);
						}
					})
				} else {
					var param = {
						username: $scope.model.username,
						password: UtilService.encryptByDES($scope.model.password),
						ip: $scope.model.ip,
						port: $scope.model.port,
						loginPwd: $scope.loginModel.loginPwd,
					};
					HttpService.put('licenseClient/disconnect', param, undefined, $scope.refreshDataAfterDisconnect);
				}
			}
		})
	};
	$scope.nextCallBack = {
		"0": function () {},
		"1": function () {
			if ($scope.needCheckAdmin) {
				var promise = UtilService.checkAdminPwd($scope.loginModel.loginPwd).then(function (result) {
					if (!isEmpty(result.loginFailMessage)) {
						UtilService.error(result.loginFailMessage, $translate.instant('common.errorTip'));
					} else {
						if ($scope.connectStatus === false||$scope.connectFormChanged===true) {
							var promise2 = $scope.connectLicenseServer();
							promise2.then(function (result2) {
								result.success = true;
								result2.success = true;
							})
							return promise2;
						} else {
							result.success = true;
							return {
								success: true
							}
						}
					}
				});
				return promise;
			} else {
				if ($scope.connectStatus === false||$scope.connectFormChanged===true) {
					var promise2 = $scope.connectLicenseServer();
					promise2.then(function (result2) {
						result2.success = true;
					})
					return promise2;
				} else {
					return {
						success: true
					}
				}
			}
		},
		"2": function () {}
	};
	$scope.getLicenseBasicInfo = function () {
		$http.get('licenseClient/config').success(function (result) {
			if (result && result.data) {
				$scope.model = result.data;
				$scope.originModel = angular.copy(result.data);
				$scope.connectFormChanged = false;
				if ($scope.model.password) {
					$scope.showClientPasswordInput = false;
					$scope.model.password = UtilService.decryptByDES($scope.model.password);
				}
				if ($scope.model.port===0) {
					$scope.model.port = 5555;
				}
			} else {
				$scope.model = {};
			}
		});
	};
	$scope.getLicenseArray = function () {
		// 产品族ID pdtId
		// license名称（feature 名称） licName：CAS标准版CPU授权 "cvm_cpu_standard";CAS企业版CPU授权 "cvm_cpu_enterprise";CAS企业版CPU无限授权 "cvm_cpu_enterprise_unlimit";CAS企业增强版CPU授权 "cvm_cpu_ultimate";CAS标准版升企业版CPU授权 "cvm_cpu_upgrade_s2e";CAS标准版升企业增强版CPU授权 "cvm_cpu_upgrade_s2u";CAS企业版升企业增强版CPU授权 "cvm_cpu_upgrade_e2u";SRM可保护虚拟机数量授权 "cvm_srm";CIC可管理虚拟机数量授权 "cic_vm_standard";
		// license类型 licType： 数量型授权 "UINT32";功能型授权 "BOOL";字符串型，目前CAS使用不到  "STRING";
		//（本客户端）已分配到的数量 owned
		// 可分配的数量 available
		$http.get('licenseClient/license/all').success(function (result) {
			if (result && result.data) {
				var responseData = result.data;
				var licenseArrayTemp = [],
					srmLicenseArrayTemp = [],
					cicLicenseArrayTemp = [];
				responseData.forEach(function (item, index) {
					item.licTitle = $translate.instant('licenseServer.' + item.licName);
					item.oldDbAmount = item.dbAmount;
					item.action = '1';
					item.amount = 0;
					if (item.licName === 'cvm_cpu_enterprise_unlimit') {
						if (item.owned > 0) {
							// item.action = 1;
							// item.amount = 1;
							item.ownedDisplay = $translate.instant('licenseServer.unlimited');
							item.availableDisplay = '--';
						} else {
							// item.action = 2;
							// item.amount = 0;
							item.availableDisplay = $translate.instant('licenseServer.unlimited');
							item.ownedDisplay = '--';
						}
					} else {
						item.availableDisplay = item.available;
						item.ownedDisplay = item.owned;
					}

					if (item.licName === 'cvm_srm') {
						srmLicenseArrayTemp.push(item)
					} else if (item.licName === 'cic_vm_standard') {
						cicLicenseArrayTemp.push(item)
					} else {
						licenseArrayTemp.push(item)
					}
				})
				$scope.licenseArray = licenseArrayTemp;
				$scope.srmLicenseArray = srmLicenseArrayTemp;
				$scope.cicLicenseArray = cicLicenseArrayTemp;
			} else {
			}
		});

	};
	$scope.getConnectInfo = function () {
		// linkStatus 链路状态：  NORMAL：链路正常  CLOSED：链路断开
		// loginStatus 登录状态： INIT：初始    LOGGING_IN：登录中   LOGGED_IN：已登录   LOGGED_OUT：登出 
		$http.get('licenseClient/status').success(function (result) {
			if (result.success && result.data && result.data.loginStatus && result.data.linkStatus) {
				if (result.data.loginStatus === 'LOGGED_IN' && result.data.linkStatus === 'NORMAL') {
					$scope.connectStatus = true;
				} else {
					$scope.connectStatus = false;
				}
			} else {
				$scope.connectStatus = false;
			}
		});
	}
	$scope.getLicenseInfo = function () {
		$http.get('systemConfig/license/licenseInfo').success(function (result) {
			if (result.success) {
				$scope.license = result.data;
				if ($scope.license.validPeriod == '-1') {
					$scope.license.validPeriodStr = $translate.instant('licenseMng.foreverValid');
				} else {
					$scope.license.validPeriodStr = $translate.instant('licenseMng.licenseTime', { value: $scope.license.validPeriod });
				}
			}
		});
	}
	$scope.ok = function () {
		var delmodalInstance = $modal.open({
			templateUrl: 'html/modal/common/applyLicenseConfirm.html',
			backdrop: "static",
			controller: "applyLicenseServerConfirmCtrl",
			size: 'mg',
			width: '322px'
		});
		delmodalInstance.result.then(function (selectItem) {
		}, function (reason) {
			if (angular.isDefined(reason) && reason == "ok") {
				// $scope.applyLicenseServer();
				var requestArray = [];
				$scope.srmLicenseArray.forEach(function (item, index) {
					item.dbAmount = item.action === '2' ? item.owned - item.amount : (item.owned - 0) + (item.amount - 0);
				});
				$scope.cicLicenseArray.forEach(function (item, index) {
					item.dbAmount = item.action === '2' ? item.owned - item.amount : (item.owned - 0) + (item.amount - 0);
				});
				requestArray = requestArray.concat($scope.licenseArray);
				requestArray = requestArray.concat($scope.srmLicenseArray);
				requestArray = requestArray.concat($scope.cicLicenseArray);
				HttpService.post('licenseClient/license/action', requestArray, $modalInstance, $scope.alertSuccessInfo);
			}
		});
		// $modalInstance.dismiss("cancel");
	};
	$scope.alertSuccessInfo = function () {
		$timeout(function () {
			UtilService.alert($translate.instant('licenseMng.licenseRegistSucc'));
			UtilService.logout();
		}, 500);
	}


	$scope.cancel = function () {
		$modalInstance.dismiss("cancel");
	};
	$scope.refreshData = function () {
		$scope.connectFormChanged = false;
		$scope.getConnectInfo();
		$scope.getLicenseBasicInfo();
		$scope.getLicenseArray();
		// $scope.getLicenseInfo();
		$scope.checkIsUsingCvmLicenseServer();
	}
	$scope.refreshDataAfterDisconnect = function () {
		$scope.connectFormChanged = false;
		$scope.getConnectInfo();
		$scope.getLicenseBasicInfo();
		// $scope.getLicenseInfo();
		$scope.checkIsUsingCvmLicenseServer();
	}
	$scope.refreshData();
});

//【授权详细信息】
routeApp.controller('licenseServerDetailController', function ($scope, $http, HttpService, $translate, $timeout, $modal, $modalInstance, UtilService, HttpService) {
	$scope.model = {};
	$scope.connectStatus = false;
	$scope.license = {};
	$scope.licenseArray = [];
	$scope.srmLicenseArray = [];
	$scope.cicLicenseArray = [];
	$scope.connectLicenseServer = function () {
		var param = {
			username: $scope.model.username,
			password: UtilService.encryptByDES($scope.model.password),
			ip: $scope.model.ip,
			port: $scope.model.port,
		};
		HttpService.put('licenseClient/connectAndSaveConfig', param, undefined, $scope.refreshData);
	};
	$scope.stopConnectLicenseServer = function () {
		var modalInstance = UtilService.confirm($translate.instant("licenseServer.stopConnectLicenserver"), $translate.instant("common.opertip"));
		modalInstance.result.then(function () {
			var param = {
				username: $scope.model.username,
				password: UtilService.encryptByDES($scope.model.password),
				ip: $scope.model.ip,
				port: $scope.model.port,
			};
			HttpService.put('licenseClient/disconnect', param, undefined, $scope.refreshData);
		});
	};
	// （1）实现前端接口：从license server上查询所有CAS可用的license信息（GET licenseClient/license/all）
	// （2）实现前端接口：申请或释放license（POST licenseClient/license/action）
	$scope.getLicenseBasicInfo = function () {
		$http.get('licenseClient/config').success(function (result) {
			if (result && result.data) {
				$scope.model = result.data;
				if($scope.model.password){
					$scope.model.password = UtilService.decryptByDES($scope.model.password);
				}
			} else {
				$scope.model = {};
			}
		});
	};
	$scope.getLicenseArray = function () {
		$http.get('licenseClient/license/allocated').success(function (result) {
			if (result && result.data) {
				var responseData = result.data;

				var licenseArrayTemp = [],
					srmLicenseArrayTemp = [],
					cicLicenseArrayTemp = []
				responseData.forEach(function (item, index) {
					if (item.licName === 'cvm_srm') {
						item.licenses.forEach(function(item2,index2) {
							srmLicenseArrayTemp.push(item2)
						})
					} else if (item.licName === 'cic_vm_standard') {
						item.licenses.forEach(function(item2,index2) {
							cicLicenseArrayTemp.push(item2)
						})
					} else {
						item.licenses.forEach(function(item2,index2) {
							item2.licTitle = $translate.instant('licenseServer.' + item.licName);
							licenseArrayTemp.push(item2)
						})
					}
				})
				$scope.licenseArray = licenseArrayTemp;
				$scope.srmLicenseArray = srmLicenseArrayTemp;
				$scope.cicLicenseArray = cicLicenseArrayTemp;
			} else {
			}
		});
	};
	$scope.getLicenseInfo = function () {
		$http.get('systemConfig/license/licenseInfo').success(function (result) {
			if (result.success) {
				$scope.license = result.data;
				if ($scope.license.validPeriod == '-1') {
					$scope.license.validPeriodStr = $translate.instant('licenseMng.foreverValid');
				} else {
					$scope.license.validPeriodStr = $translate.instant('licenseMng.licenseTime', { value: $scope.license.validPeriod });
				}
			}
		});
	}
	$scope.changeLicenseServer = function () {
		$http.get('licenseClient/isUltimateCvm').then(function(result) {
			if (result && result.data && result.data.data === true) {
				var modalInstance = UtilService.confirm($translate.instant('licenseServer.switchToLicenseServerModeTips'),$translate.instant('common.opertip'));
				modalInstance.result.then(function (selectedItem) {
					HttpService.put("licenseClient/switchToLicenseServerMode", undefined, undefined, function(result){});
				}, function () {});
			}else {
				var resolve = {
					needCheckAdmin: function () { return false }
				};
				var registerInstance = UtilService.lgmodal('productRegisterByServer.html', 'registerByServerController', resolve);
				registerInstance.result.then(function (selectedItem) {
					$scope.refreshData();
				}, function () {
					$scope.refreshData();
				});
			}
		});
	}
	$scope.getConnectInfo = function () {
		// linkStatus 链路状态：  NORMAL：链路正常  CLOSED：链路断开
		// loginStatus 登录状态： INIT：初始    LOGGING_IN：登录中   LOGGED_IN：已登录   LOGGED_OUT：登出 
		$http.get('licenseClient/status').success(function (result) {
			if (result.success && result.data && result.data.loginStatus && result.data.linkStatus) {
				if (result.data.loginStatus === 'LOGGED_IN' && result.data.linkStatus === 'NORMAL') {
					$scope.connectStatus = true;
				} else {
					$scope.connectStatus = false;
				}
			} else {
				$scope.connectStatus = false;
			}
		});
	}
	$scope.cancel = function () {
		$modalInstance.dismiss("cancel");
	};
	$scope.refreshData = function () {
		$scope.getConnectInfo();
		$scope.getLicenseBasicInfo();
		$scope.getLicenseArray();
		// $scope.getLicenseInfo();
	}
	$scope.refreshData();
});

/**
 * 申请license server确认
 */
routeApp.controller('applyLicenseServerConfirmCtrl',function($scope, $http, $translate, $modalInstance, UtilService, HttpService) {
	$scope.tmp = {};
	$scope.ok = function () {
		if ($scope.tmp.userInput.toUpperCase() != 'CONFIRM') {
			UtilService.alert($translate.instant('common.userInputError'), $translate.instant('common.opertip'), false, 'error');
			$scope.tmp.userInput = '';
			return;
		}
		$modalInstance.dismiss('ok');
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

//一键操作 控制器
routeApp.controller('oneBtnToController',['$scope','$state','$http','$translate','$timeout','UtilService','GridService',
  function($scope, $state, $http, $translate, $timeout, UtilService, GridService) {
	
	$("#oneBtnControl").mouseenter(function() {
		if ($("#oneBtnControl").attr("aria-expanded") == 'false') {
			$("#oneBtnControl").click();
		} 
	});
	
	$scope.btnToHealthyCheck = function () {
		$state.go('main.btnToHealthyCheck');
	};
	
	$scope.btnToResourceAnalysis = function () {
		$state.go('main.btnToResourceAnalysis');
	};
	
	$scope.btnToStorageClean = function () {
		$state.go('main.btnToStorageClean');
	};
	
	$scope.btnToVMExport = function () {
		$state.go('main.btnToVMExport');
	};
	
	$scope.btnToDomainRestore = function () {
		$state.go('main.btnToDomainRestore');
	};
}]);	

routeApp.controller('warnInfoController',['$compile','$scope','$state','$http','$translate','$timeout','UtilService','GridService',
  function($compile, $scope, $state, $http, $translate, $timeout, UtilService, GridService) {
	
	$("#warnTotal").popover({ html: true });
	$("#loginInfoButton").popover({ html: true });
	//当前系统告警消息类型个数
	var getWarnMsgDetail = function() {
		$.ajax({
			type: "GET",
			dataType:"json",
			url: "btnSeries/warningCount",
			success: function(result){
				$timeout(function(){
					$scope.urgent = result.urgent;
					$scope.important = result.important;
					$scope.accessory = result.accessory;
					$scope.warning = result.warning;
					var total = result.urgent + result.important + result.accessory + result.warning;
					$scope.warnTotal = total;
				});
				
			}
		});
	};
	
	//当前系统告警消息
	getWarnMsgDetail();
	//告警按钮失去焦点时，显示的告警信息div消失
	$("#warnTotal").blur(function(){
		$("#warnTotal").popover('hide');
	});
	
	$scope.btnToWarnView = function (level) {
		
		var html = $('#warnDetailInfo').html();
		if (html == "") {
			var warnCountStr = '<button type="button" class="icon-waring-critical" ng-click="btnToWarnDetailView(1)" style="background-color:#fff;border:none"/>' + $scope.urgent
			+ ' <button type="button" class="icon-waring-major" ng-click="btnToWarnDetailView(2)" style="background-color:#fff;border:none"/>' + $scope.important
			+ ' <button type="button" class="icon-waring-minor" ng-click="btnToWarnDetailView(3)" style="background-color:#fff;border:none"/>' + $scope.accessory
			+ ' <button type="button" class="icon-waring-prompt" ng-click="btnToWarnDetailView(4)" style="background-color:#fff;border:none"/>' + $scope.warning ; 
			var value = $compile(warnCountStr)($scope);
			//var ele = $('#warnDetailInfo');
		    //ele.append(value);
			$('#warnDetailInfo').html(value);
			$("#loginInfoButton").popover('hide')
			
		}
//		$state.go('main.realtimeAlarm', {warnLevel: level});  //取消点击告警按钮发生的页面跳转事件
	};
	
	$scope.btnToWarnDetailView = function (level) {
		$("#warnTotal").popover('hide');
		$state.go('main.realtimeAlarm', {warnLevel: level});
	};
	

}]);	

routeApp.controller('loginInfoController', function($scope, $translate, $compile) {
    $("#loginInfoButton").popover({ html: true });
    $scope.iconClick = function() {
    	//如果取不到数据则不显示
    	if (angular.isUndefined($scope.loginInfo) || angular.isUndefined($scope.loginInfo.loginName)) {
    	    return;
    	}
        //date filter不稳定，使用自己拼接打时间显示。
        var sd = new Date($scope.loginInfo.loginTime);
        var year = sd.getFullYear();
        var m = (sd.getMonth()+1<10?'0'+(sd.getMonth()+1):(sd.getMonth()+1));
        var d = sd.getDate()<10?('0'+sd.getDate()):sd.getDate();
        var h = sd.getHours()<10?('0'+sd.getHours()):sd.getHours();
        var mi = sd.getMinutes()<10?('0'+sd.getMinutes()):sd.getMinutes();
        var s = sd.getSeconds()<10?('0'+sd.getSeconds()):sd.getSeconds();
        $scope.showTime = year + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
        var html = $('#loginInfoDiv').html();
        var loginInfoStr = "<div><span>{{'operator.operator'|translate}}</span><span class='loginInfoContent' shortcut custom-title cut-str='{{loginInfo.userName}}' short-width='130'>{{loginInfo.userName}}</span></div>" +
        "<div><span>{{'common.loginName'|translate}}</span><span class='loginInfoContent' shortcut custom-title cut-str='{{loginInfo.loginName}}' short-width='130'>{{loginInfo.loginName}}</span></div>" +
        "<div><span>{{'operator.loginTime'|translate}}</span><span class='loginInfoContent'>{{showTime}}</span></div>" +
        "<div><span>{{'common.address'|translate}}</span><span class='loginInfoContent' shortcut custom-title cut-str='{{loginInfo.loginIp}}' short-width='130'>{{loginInfo.loginIp}}</span></div>";
        var value = $compile(loginInfoStr)($scope);
        //var ele = $('#warnDetailInfo');
        //ele.append(value);
        $('#loginInfoDiv').html(value);
    };
    //鼠标移开登录按钮，显示的登录信息消失
    $("#loginInfoButton").mouseleave(function(){
		$("#loginInfoButton").popover('hide');
    });
});
