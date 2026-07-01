var routeApp = angular.module('app.main',['ui.router','ui.bootstrap','ngMessages','ngGrid','pascalprecht.translate','toggle-switch','treeGrid',
                                          'app.services','app.httpservice','app.httpservice2','app.gridservice','ui.casTag.input','app.workflowService','app.orgService',
                                          'app.vmservices','app.permissionservices','app.definedPageservices','app.desktopService','app.echartservices', 'app.cloudDiskServiceAsync','ui.casChart',
                                          'app.cloudResourceService','app.clusterservice','app.cloudResourceService','app.publicCloudServiceAsync','app.rainbowServiceAsync','app.resourcePoolService', 
                                          'app.vmServiceAsync','app.alarmServiceAsync']);
routeApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	  // For any unmatched url, redirect to /state
	  $urlRouterProvider.when("/main","/main/cloudResource")
	                    .when("/main/cloudResource","/main/cloudResource/dashboard")
	                    .when("/main/paramSet","/main/paramSet/systemParam")
	                    .otherwise("/login");
	  $locationProvider.html5Mode(true);
	  //config中注入UtilService报错， 此处暂时不用其中获取上下文方法
	  var pathName = document.location.pathname;
      var index = pathName.substr(1).indexOf("/");
      var contextpath = pathName.substring(0,index+1);
	  // Now set up the states
	  $stateProvider
	     .state('login', { //登录页面
	      url: "/login",
	      templateUrl: "html/partials/login.html",
	      resolve: {
	    	  isLoginObj:function($http, $rootScope, UtilService, PermissionService) {
	    		  return $http({method:'GET', url:'login/isLogin'})
	    		  .success(function(result) {
	    			  PermissionService.setPermissions(result.permissions);
	    			  $rootScope.loginInfo = {};
                      $rootScope.loginInfo.userName = result.userName;
                      $rootScope.loginInfo.loginName = result.loginName;
                      $rootScope.loginInfo.loginIp = result.loginIp;
                      $rootScope.loginInfo.loginTime = result.loginTime;
                      $rootScope.loginInfo.id = result.id;
                      $rootScope.isEn = globalLang == 'zh_CN' ? false : true;
	    			  UtilService.changeSkin(result.operSkin);
	    			  });
	    	  },
	    	  uiConfigObj:function($http) {
	    		  return $http.get('login/queryUiConfig').then(
	    				 function success(response) {return response.data;},
	    				 function error(reason) {return false;}
	    		  );
	    	  }
	      },
	      controller:function($state, $scope,$stateParams, uiConfigObj,$rootScope, UtilService) {
//	    	  $state.go('main.cloudResource.dashboard');
	    	  if (uiConfigObj.data.usbkey) {
    			  $rootScope.usbkey = true;
    			  $rootScope.certype = uiConfigObj.data.certype;
    			  var Sys = UtilService.getSys();
    			  if (Sys.chrome) {
    				  $rootScope.getDn = function(evt) {
    	  				  var certDn = evt.detail.CertDN;
    	  				  if(certDn) {
    	  						var IsSign = evt.detail.IsSign;
//    	  						var cn = UtilService.getcnByDn(certDn);
    	  						var msg = {};
    	  						msg.certDn = certDn;
    	  						$scope.$broadcast('login', msg);
//    	  						UtilService.sign(certDn, cn, "SGD_SHA1", $scope.formData.pin);
    	  				  }	else {
    	  					UtilService.error("usbkey.certDnFail");
    	  					return;
    	  				  }
    				  };
    				  $rootScope.getSn = function(evt) {
    					  if (evt.detail.SN) {
     	  					 UtilService.sendGetDnEvent(evt.detail.SN);
     	  				  } else {
     	  					 UtilService.error($translate.instant("usbkey.getsnError"));
     	  					 return;
     	  				  }
    				  };
    				  $rootScope.getCert = function(evt) {
    					  if (evt.detail.Signature && evt.detail.Cert) {
    						 UtilService.loginPost(evt.detail.Signature, evt.detail.Cert);
     	  				  } else {
     	  					 if (evt.detail && evt.detail.Result) {
     	  						 var arr = evt.detail.Result.split("=");
     	  						 if (arr.length == 2) {
     	  							 var hashType = constant.SGD_SHA1;
     	  							 if ($rootScope.certype == 1) {
     	  								hashType = constant.SGD_SM3;
     	  							 } 
     	  							 UtilService.handleSignError(arr[1], hashType);
     	  						 }
     	  						 console.error("evt.detail.Result:" + evt.detail.Result);
     	  					 } else {
     	  						UtilService.error($translate.instant("usbkey.signFail"));
     	  					 }
     	  					 return;
     	  				  }
    				  };
    				  //获取证书DN事件监听器
    				  window.addEventListener("MessageFromCScriptToPage_HS:CertDN", $scope.getDn, false);
    				 //获取证书序列号SN事件监听器
    	  			  window.addEventListener("MessageFromCScriptToPage_HS:SN", $scope.getSn, false);
    	  			 //获取证书序列号签名事件监听器
    	  			  window.addEventListener("MessageFromCScriptToPage_HS:Sign", $scope.getCert, false);
    			  } else {
    				  UtilService.createUsbTool('ukeyCT');
    			  }
    		  }
	    	  $("#loginName").focus();
	      },
	      onEnter: function($state, isLoginObj, uiConfigObj, $rootScope, PermissionService, UtilService){ 
	    	  if (uiConfigObj && uiConfigObj.data) {
	    		  $rootScope.uiConfig = uiConfigObj.data;
	    		  if ($rootScope.uiConfig.transitionEnable == '1') {
	    			  $rootScope.transition = 1;
	    		  } else {
	    			  $rootScope.transition = 0;
	    		  }
	    		  if ("true" == uiConfigObj.data["listVerticalLine"]) {
	    			  $rootScope.listVerticalLine = true;
	    		  }
	    	  };
	    	  
	    	  if (isLoginObj.data != '') {
	    		  if ("workflow" == isLoginObj.data.loginType) {
		    		  $state.go('workFlow', isLoginObj.data);
	    		  } else {
	    			  UtilService.loginToPage();
	    		  }
	    	  } else {
	    		 //清除本地缓存
	    		localStorage.removeItem('permissions');
	    		localStorage.removeItem('cicLoginInfo');
	    	  }
	      }
	    })
	     .state('main', { //登录后页面
		  resolve: {
		     cycleObj:function($http) {
	    		  return $http.get('systemConfig/sysConfig?type=sys_conf').then(
	    				 function success(response) { return response.data;},
	    				 function error(reason) {return false;}
	    		  );
		     }
		  },
		  abstract: true,
		  url: "/main",
		  templateUrl: "html/partials/main.html",
		  controller: function($rootScope, $scope, $http, UtilService, $translate, cycleObj) {
			  setScopeCycle($scope, cycleObj);
              //setup dialog centered where window resize
              var modalResize=function(){
            	  $(".modal-dialog").css({top:0,left:0});
              };
              var data = cycleObj.data;
              //单位 : 分钟
              var timeout =  data["idle.timeout"]; 
              $(window).on("resize.modal",modalResize);
              if (timeout) {
            	  $rootScope.timeout = 1000 * 60 * timeout;
            	  UtilService.startSessionTimer();
            	  UtilService.startTestRequest();
              }
              $http.get('systemConfig/license/checkLicenseTime')
              .success(function(result) {
                  $("#websocketIframe").css("display","none"); //solve the style issues of dragging the modal window
            	  if (result.data) {
            		  UtilService.alert($translate.instant('licenseMng.licenseTimeExpire'), $translate.instant("common.opertip"), false, 'error');
            	  }
                  UtilService.handleResult(result);
              }).error(function(response, code, headers, config) {
                  UtilService.handleError(code);
              });
		  }
	   })
	   .state('workFlow', { //邮件审批电子流界面
		  url: "main/workFlow/:appId/:appType",
		  templateUrl: "html/partials/handlerWorkflow.html",
		  resolve: {
	    	  workFlowObj:function($http, $stateParams, $rootScope, $translate, $state, UtilService, PermissionService) {
	    		  var params = {};
	  			  params.id = $stateParams.appId;
	    		  if ($stateParams.appType == 1){
		    		  return $http({method:'GET', url:'workflow/queryVmWorkflows' , params : params})
		    		  .success(function(result) {
		    			  var data = {}; 
		    			  if (angular.isDefined(result) && result.data != null && result.data.length > 0) {
		    				  data = result.data[0];
			    			  if (data.isHandler) {
			    				  data.opType = "add";
			    			  } else {
			    				  data.opType = "view";
			    			  }
			    			  data.workflowType = "vm"
			    			  $rootScope.workFlowObj = data;
		    			  } else {
		    				  UtilService.alert($translate.instant('workflow.vmWorkFlowNotExist'), $translate.instant("common.opertip"), false, 'error');
		    				  $state.go('blank');
		    			  }
		    	      });
	    		  } else if ($stateParams.appType == 2) {
		    		  return $http({method:'GET', url:'workflow/queryDisks' , params : params})
		    		  .success(function(result) {
		    			  var data = {}; 
		    			  if (angular.isDefined(result) && result.data != null && result.data.length > 0) {
		    				  data = result.data[0];
			    			  data.workflowType = "disk"
		    				  if (data.isHandler) {
			    				  data.opType = "add";
			    			  } else {
			    				  data.opType = "view";
			    			  }
			    			  $rootScope.workFlowObj = data;
		    			  } else {
		    				  UtilService.alert($translate.instant('workflow.diskWorkFlowNotExist'), $translate.instant("common.opertip"), false, 'error'); 
		    				  $state.go('blank');
		    			  }
		    	      });
	    		  } else if ($stateParams.appType == 3) {
		    		  return $http({method:'GET', url:'workflow/queryRegisters' , params : params})
		    		  .success(function(result) {
		    			  var data = {}; 
		    			  if (angular.isDefined(result) && result.data != null && result.data.length > 0) {
		    				  data = result.data[0];
		    				  if (data.isHandler) {
			    				  data.opType = "add";
			    			  } else {
			    				  data.opType = "view";
			    			  }
			    			  data.workflowType = "register"
			    			  $rootScope.workFlowObj = data;
		    			  } else {
		    				  UtilService.alert($translate.instant('workflow.registerWorkFlowNotExist'), $translate.instant("common.opertip"), false, 'error'); 
		    				  $state.go('blank');
		    			  }
		    	      });
	    		  } else if ($stateParams.appType == 4) {
		    		  return $http({method:'GET', url:'workflow/queryBackups' , params : params})
		    		  .success(function(result) {
		    			  var data = {}; 
		    			  if (angular.isDefined(result) && result.data != null && result.data.length > 0) {
		    				  data = result.data[0];
			    			  if (data.isHandler) {
			    				  data.opType = "add";
			    			  } else {
			    				  data.opType = "view";
			    			  }
			    			  data.workflowType = "backup"
			    			  $rootScope.workFlowObj = data;
		    			  } else {
		    				  UtilService.alert($translate.instant('workflow.backUpWorkFlowNotExist'), $translate.instant("common.opertip"), false, 'error'); 
		    				  $state.go('blank');
		    			  }
		    	      });
	    		  }
	    	  },
	    	  fieldFlowObj: function($http, $stateParams, $rootScope, UtilService, PermissionService) {
	    		  return $http({method:'GET', url:'workflow/field/list'})
	    		  .success(function(result) {
	    			  $rootScope.fieldFlowObj = result.data;
	    	      });
	    	  }
	      },
		  controller: function($scope,$rootScope, $stateParams) {
			  $scope.model = $rootScope.workFlowObj;
			  $scope.fields = $rootScope.fieldFlowObj;
			  $scope.appId = $stateParams.appId;
	    	  $scope.appType = $stateParams.appType;
		   }
	   })
	   .state('overview', { //全屏概览页面
		   resolve: {
			   cycleObj:function($http) {
				   return $http.get('systemConfig/sysConfig?type=sys_conf').then(
						   function success(response) { return response.data;},
						   function error(reason) {return false;}
				   );
			   }
		   },
		   url: "/overview",
		   templateUrl: "html/partials/overview/overview.html",
		   controller: function($scope, cycleObj, UtilService) {
			   setScopeCycle($scope, cycleObj);
			   UtilService.cancelSessionTimer();
		   },
		   onEnter: function($state, $rootScope){
			   $rootScope.expand = 1;
		   }
	   })
	   .state('main.blank', { //登录后页面，若没有任何权限，跳转到空白页面
		  url: "/blank",
		  templateUrl: "html/partials/overview/blank.html"
	   })
	   .state('blank', { //登录后页面，若没有任何权限，跳转到空白页面
		  url: "/workflow/blank",
		  templateUrl: "html/partials/overview/blank.html"
	   })
	   .state('main.overview', { //概览面板
		   resolve: {
		       cycleObj:function($http) {
				   return $http.get('systemConfig/sysConfig?type=sys_conf').then(
						   function success(response) { return response.data;},
						   function error(reason) {return false;}
				   );
			   }
		   },
		   url: "/overview",
		   templateUrl: "html/partials/overview/overview.html",
		   controller: function($scope,$stateParams, cycleObj) {
			   setScopeCycle($scope, cycleObj);
		   },
		   onEnter: function($state, $rootScope){
			   $rootScope.expand = 0;
		   }
	   })
	   .state('main.cloudService', { //云服务
		   	url: "/cloudService",
		  	templateUrl: "html/partials/cloudService/cloudService.html",
		    controller: function($scope,$stateParams) {
		    	//选中对应节点
		        selectTreeNode($scope, 'main.cloudService', 'cloudService', 'nav', -1, constant.oncloudServiceNodeSelected);
		    }
		})
		.state('main.cloudSecurity', { //云安全
			   	url: "/cloudSecurity",
			  	templateUrl: "html/partials/cloudSecurity/cloudSecurity.html",
			  	controller: function($scope,$stateParams) {
				    	//选中对应节点
			          selectTreeNode($scope, 'main.cloudSecurity', 'cloudSecurity', 'nav', 129, constant.oncloudServiceNodeSelected);
				    }
		})
		.state('main.cloudAntivirusConfig', { //防病毒配置
              url: "/cloudAntivirusConfig",
              templateUrl: "html/partials/cloudSecurity/antiVirusSoftware/cloudAntivirusConfig.html",
              controller: function($scope,$stateParams) {
                  selectTreeNode($scope, 'main.cloudAntivirusConfig', 'antivirus', 'nav', 501, constant.oncloudServiceNodeSelected);
              }
       })
       .state('main.acl', { //firewall
            url: "/cloudResource/cloudSecurity/firewall",
            templateUrl: "html/partials/cloudSecurity/acl/aclStrategy.html",
            controller: function($scope,$stateParams) {
                  selectTreeNode($scope, 'main.acl', 'firewall', 'nav', 502, constant.oncloudServiceNodeSelected);
              }
        })
		.state('main.cloudHost', { //云主机
		   	url: "/cloudHost",
		  	templateUrl: "html/partials/cloudHost/cloudHost.html",
		  	controller: function($scope,$stateParams) {
                  //选中对应节点
                  selectTreeNode($scope, 'main.cloudHost', 'cloudHost', 'nav', 126, constant.oncloudServiceNodeSelected);
            }
		})
		.state('main.vm', { //虚拟机面板
			resolve : {
				cloudObj:function($http,$stateParams) {
					return $http({method:'GET', url:'cloud/getInfo?flag=true&cloudId=' + $stateParams.cloudId})
					.success(function(result) {
						return result.data;
					});
				}
			},
	    	url: "/vm/:id/:name/:title/:status/:cloudId/:cloudType/:uniqueKey",
	    	templateUrl: "html/partials/vm/vm.html",
	    	controller: function($rootScope, $scope, $stateParams, $sce, cloudObj, UtilService) {
	    		$scope.title = $stateParams.title;
	    		if (cloudObj && cloudObj.data) {
	    			var waitModal = UtilService.wait();
	    			var cloud = cloudObj.data.data;
	    			var pwd = cloud.password;
	    			var protocol = cloud.protocal;
	    			var port = cloud.port;
	    			//修改问题单：201607040086 解决iframe使用https协议的问题。
	    			if (document.location.protocol == 'http:' && protocol == "https") {
	    				protocol = "http";
	    				port = "8080";
	    			}
	    			var b = new Base64();
	    			var desUserName = UtilService.encryptByDES(cloud.userName);
	    			var encodeU = b.encode(desUserName);
	    			var encodeP = b.encode(pwd);
	    			var base = protocol + "://" + cloud.uri + ":" + port + "/cas/cic";
	    			var url = base + "/vm/" + $stateParams.uniqueKey + "/" + cloud.operSkin + "?u=" + encodeURIComponent(encodeU)+ "&p="+encodeURIComponent(encodeP) + "&permission=" + encodeURIComponent(cloud.permission); 
	    			$scope.framesrc = $sce.trustAsResourceUrl(url);
	    			var ele = document.getElementById("iframepage_vm");
	    			ele.onload = function(){
	    				waitModal.close();
	    			}
	    			$("#websocketIframe").attr("src", $sce.trustAsResourceUrl(base + "/websocket"));
	    			
	             }
	    	}
	    })
		.state('main.cloudDisk', { //云硬盘
		   	url: "/cloudDisk",
		  	templateUrl: "html/partials/cloudDisk/cloudDisk.html",
		  	controller: function($scope,$stateParams) {
                //选中对应节点
                selectTreeNode($scope, 'main.cloudDisk', 'cloudDisk', 'nav', 127, constant.oncloudServiceNodeSelected);
		  	}
		})
		
		.state('main.cloudBackup', { //云备份
		   	url: "/cloudBackup",
		  	templateUrl: "html/partials/cloudBackup/cloudBackup.html",
		  	controller: function($scope,$stateParams) {
                //选中对应节点
                selectTreeNode($scope, 'main.cloudBackup', 'cloudBackup', 'nav', 128, constant.oncloudServiceNodeSelected);
            }
		})
		.state('main.cloudResource', { //云资源
		   	url: "/cloudResource",
		  	templateUrl: "html/partials/cloudResource/cloudResourceList.html",
			controller:function($scope,$stateParams){
				 selectTreeNode($scope, 'main.cloudResource', 'cloudResource', 'nav', -1,constant.onCloudNodeSelected);
			}
		})
		.state('main.cvmResource', { //cvm云资源节点
			url: "/cvmResource/:id/:name/:cloudType",
			templateUrl: "html/partials/cloudResource/cloudResource.html",
			controller: function($scope,$stateParams) {
				$scope.entryId = $stateParams.id;
				$scope.entryName = $stateParams.name;
				$scope.cloudType = $stateParams.cloudType;
				selectTreeNode($scope, 'main.cvmResource', 'cvm', 'nav', $stateParams.id);
			}
		})
		.state('main.cvmResource.dashboard', { //云资源/概要
		  resolve: {
		     cycleObj:function($http) {
	    		  return $http.get('systemConfig/sysConfig?type=sys_conf').then(
	    				 function success(response) { return response.data;},
	    				 function error(reason) {return false;}
	    		  );
		     }
		  },
	      url: "/dashboard",
	      templateUrl: "html/partials/cloudResource/overview.html",
          controller: function($scope, $stateParams, cycleObj) {
        	  $scope.entryId = $stateParams.id;
			  $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'dashboard';
              setScopeCycle($scope, cycleObj);
          }
	    })
	    .state('main.cvmResource.host', { //云资源/主机
	      url: "/host",
	      templateUrl: "html/partials/cloudResource/host.html",
          controller: function($scope,$stateParams) {
        	  $scope.entryId = $stateParams.id;
			  $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'host';
          }
	    })
	    .state('main.cvmResource.vm', { //云资源/虚拟机
	      url: "/host",
	      templateUrl: "html/partials/cloudResource/vm.html",
          controller: function($scope,$stateParams) {
        	  $scope.entryId = $stateParams.id;
			  $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'vm';
          }
	    })
	    .state('main.cvmResource.template', { //云资源/模板
	      url: "/template",
	      templateUrl: "html/partials/cloudResource/template.html",
          controller: function($scope,$stateParams) {
        	  $scope.entryId = $stateParams.id;
			  $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'template';
          }
	    })
//		.state('main.cvmResource.template.net', { //云资源/虚拟机模板/网络
//	    	url: "/net",
//	    	templateUrl: "html/partials/cloudService/org/netList.html",
//	    	controller: function($scope,$stateParams) {
//	    	}
//		})
//		.state('main.cvmResource.template.storage', { //云资源/虚拟机模板/存储 
//	    	url: "/storage",
//	    	templateUrl: "html/partials/cloudService/org/storageList.html",
//	    	controller: function($scope,$stateParams) {
//	    	}
//	    })
	    .state('main.cvmResource.netstrategy', { //云资源/网络策略模板
	      url: "/netstrategy",
	      templateUrl: "html/partials/cloudResource/netstrategy.html",
          controller: function($scope,$stateParams) {
        	  $scope.entryId = $stateParams.id;
			  $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'netstrategy';
          }
	    })
	    .state("main.orgMng",{//组织列表
		   url: "/orgMng",
		   templateUrl: "html/partials/cloudService/org/orgList.html",
		   controller:function($scope,$stateParams){
			   selectTreeNode($scope, 'main.orgMng', 'orgMng', 'nav', 515 ,constant.onVDCNodeSelected);
		   }
	   })
	   .state("main.org",{//组织
		   url: "/org/:id/:name/:cloudId/:cloudType",
		   templateUrl: "html/partials/cloudService/org/orgDetail.html",
		   controller: function($scope, $stateParams) {
			   $scope.id = $stateParams.id;
			   $scope.name = $stateParams.name;
			   $scope.cloudId = $stateParams.cloudId;
			   $scope.cloudType = $stateParams.cloudType;
	           selectTreeNode($scope, 'main.org', 'org', 'nav', $stateParams.id, constant.onVDCNodeSelected);
		   }
	   })
	   .state("main.org.summary",{//组织面板/概要
		   url: "/summary/:id/:name",
		   templateUrl: "html/partials/cloudService/org/overview.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'summary';
	       }
	   })
	   .state("main.org.vm",{//组织面板/虚拟机
		   url: "/vm/:id/:name",
		   templateUrl: "html/partials/cloudService/org/vm.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'vm';
	       }
	   })
	   .state("main.org.template",{//组织面板/虚拟机模板
		   url: "/template/:id/:name",
		   templateUrl: "html/partials/cloudService/org/template.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'template';
	       }
	   })
	   .state("main.org.cloudOsVm",{//组织面板/cloudOS虚拟机
		   url: "/vm/:id/:name",
		   templateUrl: "html/partials/cloudService/org/cloudOS/vm.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'vm';
	       }
	   })
	   .state("main.org.cloudOsImg",{//组织面板/cloudOS虚拟机模板
		   url: "/template/:id/:name",
		   templateUrl: "html/partials/cloudService/org/cloudOS/cloudOsImg.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'template';
	       }
	   })	   
	   .state('main.org.template.net', { //组织面板/虚拟机模板面板/网络
	    	url: "/net",
	    	templateUrl: "html/partials/cloudService/org/netList.html",
	    	controller: function($scope,$stateParams) {
	    	}
	    })
	    .state('main.org.template.storage', { //组织面板/虚拟机模板面板/存储 
	    	url: "/storage",
	    	templateUrl: "html/partials/cloudService/org/storageList.html",
	    	controller: function($scope,$stateParams) {
	    	}
	    })	  
	    .state("main.org.resourcePool",{//组织面板/资源池
		   url: "/resourcePool",
		   templateUrl: "html/partials/cloudService/org/resourcePool.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'resourcePool';
	       }
	   })
	   .state("main.org.cluster",{//组织面板/集群
		   url: "/cluster/:id/:name",
		   templateUrl: "html/partials/cloudService/org/cluster.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'cluster';
	       }
	   })
	   .state("main.org.vswitch",{//组织面板/虚拟交换机
		   url: "/vswitch/:id/:name",
		   templateUrl: "html/partials/cloudService/org/vswitch.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'vswitch';
	       }
	   })
	   .state("main.org.storage",{//组织面板/存储
		   url: "/storage/:id/:name",
		   templateUrl: "html/partials/cloudService/org/storage.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'storage';
	       }
	   })
	   .state("main.org.netSt",{//组织面板/网络策略模板
		   url: "/netSt/:id/:name",
		   templateUrl: "html/partials/cloudService/org/netSt.html",
	   })
	   .state("main.org.virDesk",{//组织面板/虚拟桌面池
		   url: "/virDesk/:id/:name",
		   templateUrl: "html/partials/cloudService/org/virDesk.html",
	   })
	   .state("main.org.user",{//组织面板/用户
		   url: "/user/:id/:name",
		   templateUrl: "html/partials/cloudService/org/user.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'user';
	       }
	   })
	   
	   .state('main.org.user.userVm', { //组织面板/用户/用户虚拟机
	    	url: "/userVm",
	    	templateUrl: "html/partials/cloudService/org/netList.html",
	    	controller: function($scope,$stateParams) {
	    	}
	    })
	    .state('main.org.user.backup', { //组织面板/用户/云备份策略
	    	url: "/backup",
	    	templateUrl: "html/partials/cloudService/org/storageList.html",
	    	controller: function($scope,$stateParams) {
	    	}
	    })
	   .state("main.org.group",{//组织面板/用户分组
		   url: "/group/:id/:name",
		   templateUrl: "html/partials/cloudService/org/group.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'group';
	       }
	   })
	   .state("main.org.manager",{//组织面板/组织管理员
		   url: "/manager/:id/:name",
		   templateUrl: "html/partials/cloudService/org/manager.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'manager';
	       }
	   })
	   .state("main.org.task",{//组织面板/任务
		   url: "/task/:id/:name",
		   templateUrl: "html/partials/cloudService/org/task.html",
	   })
	   .state("main.org.operLog",{//组织面板/用户操作日志
		   url: "/operLog/:id/:name",
		   templateUrl: "html/partials/cloudService/org/operLog.html",
	   })
	   .state("main.desktopMng",{//虚拟桌面池列表
		   url: "/desktopMng",
		   templateUrl: "html/partials/cloudService/desktop/desktopList.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.desktopMng', 'cloudService', 'nav', 517, constant.onVDCNodeSelected);
	       }
	   })
	   .state('main.desktop', { //虚拟桌面池节点
			url: "/desktop/:id/:name/:cloudId/:cloudType/:assignMode",
			templateUrl: "html/partials/cloudService/desktop/desktop.html",
			controller: function($scope,$stateParams) {
				$scope.entryId = $stateParams.id;
				$scope.entryName = $stateParams.name;
				$scope.cloudId = $stateParams.cloudId;
				$scope.cloudType = $stateParams.cloudType;
				$scope.assignMode = $stateParams.assignMode;
				selectTreeNode($scope, 'main.desktopMng', 'desktop', 'nav', $stateParams.id, constant.onVDCNodeSelected);
			}
		})
		.state('main.desktop.dashboard', { //虚拟桌面池节点/概要
	      url: "/dashboard",
	      templateUrl: "html/partials/cloudService/desktop/overview.html",
          controller: function($scope,$stateParams) {
        	  $scope.entryId = $stateParams.id;
			  $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'dashboard';
          }
	    })
	    .state('main.desktop.virtualDesk', { //虚拟桌面池节点/虚拟桌面
          url: "/virtualDesk",
          templateUrl: "html/partials/cloudService/desktop/virtualDesk.html",
          controller: function($scope,$stateParams) {
              $scope.entryId = $stateParams.id;
              $scope.entryName = $stateParams.name;
              $scope.$parent.currentTab = 'virtualDesk';
          }
        })
		.state('main.desktop.vmTemplate', { //虚拟桌面池节点/虚拟机模板
		   url: "/vmTemplate",
		   templateUrl: "html/partials/cloudService/desktop/vmTemplate.html",
	       controller: function($scope,$stateParams) {
	           $scope.entryId = $stateParams.id;
			   $scope.entryName = $stateParams.name;
	           $scope.$parent.currentTab = 'vmTemplate';
	        }
		})
		.state('main.desktop.vmTemplate.net', { //云服务/虚拟桌面池/虚拟机模板/网络
		    	url: "/net",
		    	templateUrl: "html/partials/cloudService/org/netList.html",
		    	controller: function($scope,$stateParams) {
		    	}
		})
		.state('main.desktop.vmTemplate.storage', { //云服务/虚拟桌面池/虚拟机模板/存储 
		    	url: "/storage",
		    	templateUrl: "html/partials/cloudService/org/storageList.html",
		    	controller: function($scope,$stateParams) {
		    	}
		})
	   .state("main.workflowMng",{//流程管理
		   url: "/workflowMng",
		   templateUrl: "html/partials/cloudService/workflow/workflowMng.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.workflowMng', 'workflowMng', 'nav', -1, constant.onWorkFlowMngNodeSelected);
	       }
	   })
	   .state("main.workflowVm",{//虚拟机电子流
		   url: "/workflowVm",
		   templateUrl: "html/partials/cloudService/workflow/workflowVm.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.workflowVm', 'workflowMng', 'nav', 211, constant.onWorkFlowMngNodeSelected);
	       }
	   })
	   .state("main.workflowDisk",{//云硬盘电子流
		   url: "/workflowDisk",
		   templateUrl: "html/partials/cloudService/workflow/workflowDisk.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.workflowDisk', 'workflowMng', 'nav', 212, constant.onWorkFlowMngNodeSelected);
	       }
	   })
	   .state("main.workflowRegister",{//用户预注册电子流
		   url: "/workflowRegister",
		   templateUrl: "html/partials/cloudService/workflow/workflowRegister.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.workflowRegister', 'workflowMng', 'nav', 213, constant.onWorkFlowMngNodeSelected);
	       }
	   })
	   .state("main.workflowBack",{//云备份策略电子流
		   url: "/workflowBack",
		   templateUrl: "html/partials/cloudService/workflow/workflowBack.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.workflowBack', 'workflowMng', 'nav', 214, constant.onWorkFlowMngNodeSelected);
	       }
	   })
	   .state("main.workflowSetting",{//流程定制
		   url: "/workflowSetting",
		   templateUrl: "html/partials/cloudService/workflow/workflowSetting.html",
	       controller: function($scope,$stateParams) {
	    	   //选中对应节点
	           selectTreeNode($scope, 'main.workflowSetting', 'workflowMng', 'nav', 215, constant.onWorkFlowMngNodeSelected);
	       }
	   })
	   .state("main.workflowStep",{//流程步骤设置
		   url: "/workflowStep?id",
		   templateUrl: "html/partials/cloudService/workflow/workflowStep.html",
		   controller: function($scope, $stateParams) {
			   $scope.workflowId = $stateParams.id;
		   }
	   })
	   .state('main.cloudMessage', { //云消息
	          url: "/cloudMessage",
	          templateUrl: "html/partials/cloudService/cloudMessage.html",
	          controller: function($scope,$stateParams) {
	        	  //选中对应节点
		           selectTreeNode($scope, 'main.cloudMessage', 'workflowMng', 'nav', 300, constant.onWorkFlowMngNodeSelected);
	          }
	    })
	    .state('main.cloudWorkorder', { //工单
	          url: "/cloudWorkorder",
	          templateUrl: "html/partials/cloudService/cloudWorkorder.html",
	          controller: function($scope,$stateParams) {
	        	  //选中对应节点
		           selectTreeNode($scope, 'main.cloudWorkorder', 'workflowMng', 'nav', 400, constant.onWorkFlowMngNodeSelected);
	          }
	   })
		.state('main.alarmMng', { //告警管理
			url: "/alarmMng",
		   	templateUrl: "html/partials/alarm/alarmOverview.html",
		   	controller: function($scope,$stateParams) {
		           selectTreeNode($scope, 'main.realtimeAlarm', 'realtimeAlarm', 'nav', -1, constant.onAlarmNodeSelected);
		   	}
	    })
	    .state('main.alarmConfig', { //告警配置
	    	url: "/alarmConfig",
	    	templateUrl: "html/partials/alarm/alarmConfig.html",
	    	controller: function($scope,$stateParams) {
	    	}
	    })
	    .state('main.cloudAlarmNode', { //实时告警节点
	    	url: "/cloudAlarmNode/:id/:name/:cloudType",
	    	templateUrl: "html/partials/alarm/realtimeAlarmNode.html",
	    	controller: function($scope,$stateParams) {
	    		$scope.cloudId = $stateParams.id;
				$scope.cloudName = $stateParams.name;
				$scope.cloudType = $stateParams.cloudType;
	    	}
	    })
	    .state('main.noticeTemplate', { //告警通知模板
	    	url: "/noticeTemplate",
	    	templateUrl: "html/partials/alarm/noticeTemplate.html",
	    	controller: function($scope,$stateParams) {
	    		
	    	}
	    })
	   .state('main.userManage', { //用户管理
          url: "/userManage",
          templateUrl: "html/partials/systemManage/userManage.html",
          controller: function($scope,$stateParams) {
        	  //选中对应节点
              selectTreeNode($scope, 'main.userManage', 'userManage', 'nav', 516, constant.onVDCNodeSelected);
          }
       })
	   .state('main.user', { //用户
	          url: "/user",
	          templateUrl: "html/partials/systemManage/user/user.html",
	          controller: function($scope,$stateParams) {
	        	//选中对应节点
	              selectTreeNode($scope, 'main.user', 'userManage', 'nav', 98, constant.onVDCNodeSelected);
	          }
	    })
	    .state('main.userGroup', { //用户分组
	          url: "/userGroup",
	          templateUrl: "html/partials/systemManage/userGroup/userGroup.html",
	          controller: function($scope,$stateParams) {
	        	//选中对应节点
	              selectTreeNode($scope, 'main.userGroup', 'userManage', 'nav', 99, constant.onVDCNodeSelected);
	          }
	   })
	   .state('main.monitorMng', { //监控管理
          url: "/monitorMng",
          templateUrl: "html/partials/report/monitorMng.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.monitorMng', 'monitor', 'nav', -1, constant.onMonitorMngNodeSelected);
          }
      })
      .state('main.storageResCapacity', { //存储资源容量监控
    	  url: "/storageResCapacity",
    	  templateUrl: "html/partials/report/storageResCapacity.html",
    	  controller: function($scope,$stateParams) {
    		  //选中对应节点
    		  selectTreeNode($scope, 'main.storageResCapacity', 'monitor', 'nav', 124, constant.onMonitorMngNodeSelected);
    	  }
      })
      .state('main.trendAnalysis', { //趋势分析
          url: "/trendAnalysis",
          templateUrl: "html/partials/report/trendAnalysis.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.trendAnalysis', 'monitor', 'nav', 122, constant.onMonitorMngNodeSelected);
          }
      })
      .state('main.riskAssessment', { //风险评估
          url: "/riskAssessment",
          templateUrl: "html/partials/report/riskAssessment.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.riskAssessment', 'monitor', 'nav', 123, constant.onMonitorMngNodeSelected);
          }
      })
      .state('main.performanceMonitor', { //监控定制
    	  url: "/performanceMonitor",
    	  templateUrl: "html/partials/cloudMonitor/performanceMonitor.html",
    	  controller: function($scope,$stateParams) {
    		  //选中对应节点
    		  selectTreeNode($scope, 'main.performanceMonitor', 'resource', 'nav', null, constant.onMonitorMngNodeSelected);
    	  }
      })
      .state('main.viewPage', { //监控面板
    	  resolve: {
    		  cycleObj:function($http) {
    			  return $http.get('systemConfig/sysConfig?type=sys_conf').then(
    					  function success(response) { return response.data;},
    					  function error(reason) {return false;}
    			  );
    		  }
    	  },
    	  url: "/viewPage/:id/:name",
    	  templateUrl: "html/partials/cloudMonitor/viewPage.html",
    	  controller: function($scope, $stateParams, cycleObj) {
    		  $scope.entryId = $stateParams.id;
    		  $scope.entryName = $stateParams.name;
    		  setScopeCycle($scope, cycleObj);
    	  },
    	  onEnter: function($state, $rootScope){
    		  $rootScope.expand = 0;
    	  }
      })
      .state('viewPage', { //监控面板
    	  resolve: {
    		  cycleObj:function($http) {
    			  return $http.get('systemConfig/sysConfig?type=sys_conf').then(
    					  function success(response) { return response.data;},
    					  function error(reason) {return false;}
    			  );
    		  }
    	  },
    	  url: "/viewPage/:id/:name",
    	  templateUrl: "html/partials/cloudMonitor/viewPageExpand.html",
    	  controller: function($scope, $stateParams, cycleObj) {
    		  $scope.entryId = $stateParams.id;
    		  $scope.entryName = $stateParams.name;
    		  setScopeCycle($scope, cycleObj);
    	  },
    	  onEnter: function($state, $rootScope){
    		  $rootScope.expand = 1;
    	  }
	   })
	   .state('expandPage', { //监控面板
		   resolve: {
			   cycleObj:function($http) {
				   return $http.get('systemConfig/sysConfig?type=sys_conf').then(
						   function success(response) { return response.data;},
						   function error(reason) {return false;}
				   );
			   }
		   },
		   url: "/expandPage/:id/:name/:dataId",
		   templateUrl: "html/partials/cloudMonitor/expandPage.html",
		   controller: function($scope,$stateParams, cycleObj) {
			   $scope.entryId = $stateParams.id;
			   $scope.entryName = $stateParams.name;
			   $scope.dataId = $stateParams.dataId;
			   setScopeCycle($scope, cycleObj);
		   },
		   onEnter: function($state, $rootScope){
			   $rootScope.expand = 1;
		   }
	   })
      .state('main.definedPage', { //设计模式面板
    	  url: "/definedPage/:id/:name",
    	  templateUrl: "html/partials/cloudMonitor/definedPage.html",
    	  controller: function($scope,$stateParams) {
    		  $scope.entryId = $stateParams.id;
    		  $scope.entryName = $stateParams.name;
    	  }
      })
	   .state('main.systemMng', { //系统管理
          url: "/systemMng",
          templateUrl: "html/partials/systemManage/systemMng.html",
          controller: function($scope,$stateParams,$state) {
              //选中对应节点
              selectTreeNode($scope, 'main.systemMng', 'system', 'nav', -1, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.operatorMng', { //操作员管理
          url: "/operatorMng",
          templateUrl: "html/partials/systemManage/operatorMng/operatorMng.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.operatorMng', 'system', 'nav', 100, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.operator', { //操作员
          url: "/operator",
          templateUrl: "html/partials/systemManage/operatorMng/operator.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.operator', 'system', 'nav', 101, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.operatorGroup', { //操作员分组
          url: "/operatorGroup",
          templateUrl: "html/partials/systemManage/operatorMng/operatorGroup.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.operatorGroup', 'system', 'nav', 102, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.onlineOperator', { //在线操作员
          url: "/onlineOperator",
          templateUrl: "html/partials/systemManage/operatorMng/onlineOperator.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.onlineOperator', 'system', 'nav', 103, constant.onSystemMngNodeSelected);
          }
      })
      /*.state('main.securityMng', { //安全管理
          url: "/securityMng",
          templateUrl: "html/partials/systemManage/securityMng/securityMng.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.securityMng', 'system', 'nav', 104, constant.onSystemMngNodeSelected);
          }
      })*/
      .state('main.pwdStrategy', { //密码策略
          url: "/pwdStrategy",
          templateUrl: "html/partials/systemManage/securityMng/pwdStrategy.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.pwdStrategy', 'system', 'nav', 105, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.accessStrategy', { //访问策略
          url: "/accessStrategy",
          templateUrl: "html/partials/systemManage/securityMng/accessStrategy.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.accessStrategy', 'system', 'nav', 106, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.cerConfig', { // 证书配置
			  url: "/cerConfig",
			  templateUrl: "html/partials/systemManage/securityMng/cerConfigTab.html",
			  controller: function($scope,$stateParams) {
			      $scope.$parent.currentTab = 'cerConfig';
			      //修改问题单:201706090504 点击证书配置,展开云资源树问题.
			      selectTreeNode($scope, 'main.cerConfig', 'security', 'nav', 126, constant.onSystemMngNodeSelected);
			  }
      })
      .state('main.cicBackupStrategy', { //CIC备份策略
          url: "/cicBackupStrategy",
          templateUrl: "html/partials/systemManage/securityMng/cicBackupStrategy.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.securityMng', 'system', 'nav', 121, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.cicBackupStrategy.cicBackupConfig', { //CIC备份策略/CIC备份配置
          url: "/cicBackupConfig",
          templateUrl: "html/partials/systemManage/securityMng/cicBackupCfgTab.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'cicBackupConfig';
          }
      })
      .state('main.cicBackupStrategy.cicBackupHistory', { //CIC备份策略/CIC备份历史
          url: "/cicBackupHistory",
          templateUrl: "html/partials/systemManage/securityMng/cicBackupHistoryTab.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'cicBackupHistory';
          }
      })
      .state('main.ldapUserSync', { //LDAP用户同步配置
          url: "/ldapUserSync",
          templateUrl: "html/partials/systemManage/ldap/ldapUserSync.html",
          controller: function($scope,$stateParams) {
        	//选中对应节点
              selectTreeNode($scope, 'main.ldapUserSync', 'system', 'nav', 117, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.ldapServerConfig', { //LDAP服务器配置
          url: "/ldapServerConfig",
          templateUrl: "html/partials/systemManage/ldap/ldapServerConfig.html",
          controller: function($scope,$stateParams) {
        	//选中对应节点
              selectTreeNode($scope, 'main.ldapServerConfig', 'system', 'nav', 118, constant.onSystemMngNodeSelected);
          }
      })
      .state('main.ldapSyncStrategy', { //LDAP同步策略配置
          url: "/ldapSyncStrategy",
          templateUrl: "html/partials/systemManage/ldap/ldapSyncStrategy.html",
          controller: function($scope,$stateParams) {
        	//选中对应节点
              selectTreeNode($scope, 'main.ldapSyncStrategy', 'system', 'nav', 119, constant.onSystemMngNodeSelected);
          }
      })
       .state('main.ldapUserExport', { //LDAP用户导出配置
          url: "/ldapUserExport",
          templateUrl: "html/partials/systemManage/ldap/ldapUserExport.html",
          controller: function($scope,$stateParams) {
        	//选中对应节点
              selectTreeNode($scope, 'main.ldapUserExport', 'system', 'nav', 120, constant.onSystemMngNodeSelected);
          }
      })
      .state("main.operlog",{	//系统管理/操作日志
		   url: "/operlog",
		   templateUrl: "html/partials/systemManage/operLog/operlog.html",
		   controller: function($scope,$stateParams) {
			 //选中对应节点
	              selectTreeNode($scope, 'main.operlog', 'system', 'nav', 112, constant.onSystemMngNodeSelected);
		   }
	   })
	   //修改问题单201703250270 日志收集按钮不可用，且现有实现易用性较差
	   .state("main.gatherLog", {	//系统管理/日志文件收集
		   url: "/systemMng",
		   templateUrl: "html/partials/systemManage/systemMng.html",
		   controller: function($scope, $stateParams,$translate,HttpService,$state, UtilService, PermissionService) {
     		 selectTreeNode($scope, 'main.gatherLog', 'system', 'nav', 113, constant.onSystemMngNodeSelected);
			 var modalInstance = UtilService.confirm($translate.instant("systemMng.logCollectionDesc"), $translate.instant("systemMng.logCollection"),{width:'350px'});
           	 modalInstance.result.then(function(){
           		HttpService.put("gatherLog/gather", undefined, undefined, function(result){
               		if (result.success){
                   		window.open("download/log", "_blank", "height=100,width=100,top=0,left=0,toolbar=no,menubar=no,location=no");	
               		}
               	});
   			 }, function(){});
           	 $state.go("main.gatherLog1");
		   }
	   })
	   .state("main.gatherLog1", {	//系统管理/日志文件收集
		   url: "/systemMng",
		   templateUrl: "html/partials/systemManage/systemMng.html",
		   controller: function($scope, $stateParams,$translate,HttpService,$state, UtilService, PermissionService) {
     		 
		   }
	   })
		  .state('main.paramSet', { //参数配置
			  url: "/paramSet",
			  templateUrl: "html/partials/systemManage/paramConfig/paramConfig.html",
			  controller: function($scope,$stateParams) {
	              //选中对应节点
	              selectTreeNode($scope, 'main.paramSet', 'system', 'nav', 114, constant.onSystemMngNodeSelected);
			  }
		  })
		  .state('main.paramSet.systemParam', { //参数配置/系统参数
			  url: "/systemParam",
			  templateUrl: "html/partials/systemManage/paramConfig/systemParamTab.html",
			  controller: function($scope,$stateParams) {
	              $scope.$parent.currentTab = 'systemParam';
			  }
		  })
		  .state('main.paramSet.mailServer', { //参数配置/邮件服务器
			  url: "/mailServer",
			  templateUrl: "html/partials/systemManage/paramConfig/mailServerTab.html",
			  controller: function($scope,$stateParams) {
	              $scope.$parent.currentTab = 'mailServer';
			  }
		  })
		  .state('main.paramSet.userSelfhelp', { //参数配置/用户自助系统参数
			  url: "/userSelfhelp",
			  templateUrl: "html/partials/systemManage/paramConfig/userSelfhelpTab.html",
			  controller: function($scope,$stateParams) {
	              $scope.$parent.currentTab = 'userSelfhelp';
			  }
		  })
		   .state('main.paramSet.smsServer', { //参数配置/短信配置
			  url: "/smsServer",
			  templateUrl: "html/partials/systemManage/paramConfig/smsServerTab.html",
			  controller: function($scope,$stateParams) {
	              $scope.$parent.currentTab = 'smsServer';
			  }
		  })
	  .state('main.license', { //License管理
		   url: "/license",
		   templateUrl: "html/partials/systemManage/license/license.html",
		   controller: function($scope,$stateParams) {
	              //选中对应节点
	              selectTreeNode($scope, 'main.license', 'system', 'nav', 116, constant.onSystemMngNodeSelected);
		   }
	   })
	   .state('main.license.licenseinfo', { //License详细
		   url: "/licenseinfo",
		   templateUrl: "html/partials/systemManage/license/licenseDetailTab.html",
		   controller: function($scope,$stateParams) {
		   }
		})
	   .state('main.license.applyLicense', { //正式申请License
		  url: "/applyLicense",
		  templateUrl: "html/partials/systemManage/license/applyLicenseTab.html",
		  controller: function($scope,$stateParams) {
		  }
	  })
	  .state('main.license.registerLicense', { //注册License
		  url: "/registerLicense",
		  templateUrl: "html/partials/systemManage/license/registerLicenseTab.html",
		  controller: function($scope,$stateParams) {
		  }
	  })
	  .state('main.cloudOS', { //cloudOS
          url: "/cloudOS/:id/:name",
          templateUrl: "html/partials/cloudResource/cloudOS/cloudOS.html",
          controller: function($scope,$stateParams) {
              $scope.entryId = $stateParams.id;
              $scope.entryName = $stateParams.name;
              //选中对应节点
              selectTreeNode($scope, 'main.cloudOS', 'cloudOS', 'nav', $stateParams.id);
          }
      })
      .state('main.cloudOS.vm', { //cloudOS vm
          url: "/vm",
          templateUrl: "html/partials/cloudResource/cloudOS/vmList.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'vm';
          }
      })
      .state("main.cloudOS.cloudOsImg",{//云资源面板/虚拟机模板
		   url: "/template",
		   templateUrl: "html/partials/cloudResource/cloudOS/cloudOsImg.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'template';
	       }
	   })	
      
      
	  .state('main.vmware', { //注册License
          url: "/vmware/:id/:name/:apiVersion",
          templateUrl: "html/partials/cloudResource/vmware/vmware.html",
          controller: function($scope,$stateParams) {
              $scope.entryId = $stateParams.id;
              $scope.entryName = $stateParams.name;
              $scope.apiVersion = $stateParams.apiVersion;
              //选中对应节点
              selectTreeNode($scope, 'main.vmware', 'vmware', 'nav', $stateParams.id);
          }
      })
      .state('main.vmware.dashboard', { //注册License
          url: "/dashboard",
          templateUrl: "html/partials/cloudResource/vmware/overview.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'dashboard';
          }
      })
      .state('main.vmware.host', { //注册License
          url: "/host",
          templateUrl: "html/partials/cloudResource/vmware/host.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'host';
          }
      })
      .state('main.vmware.vm', { //注册License
          url: "/vm",
          templateUrl: "html/partials/cloudResource/vmware/vm.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'vm';
          }
      })
      .state('main.vmware.template', { //vmware模板
          url: "/template",
          templateUrl: "html/partials/cloudResource/vmware/template.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'template';
          }
      }).state('main.vmwareVm', { //vmware云主机
          url: "/vmwareVm/:cloudId/:id/:name/:status/:cloudName/:hostKey/:hostName/:clusterKey/:clusterName/:hpKey/:hpName/:apiVersion/:vmKey",
          templateUrl: "html/partials/cloudResource/vmware/vm/vm.html",
          controller: function($scope,$stateParams) {
              $scope.cloudId = $stateParams.cloudId;
              $scope.entryId = $stateParams.id;
              $scope.entryName = $stateParams.name;
              $scope.status = $stateParams.status;
              //云资源列表的信息
              $scope.cloudName = $stateParams.cloudName;
              $scope.hpKey = $stateParams.hpKey;
              $scope.hpName = $stateParams.hpName;
              $scope.clusterKey = $stateParams.clusterKey;
              $scope.clusterName = $stateParams.clusterName;
              $scope.hostKey = $stateParams.hostKey;
              $scope.hostName = $stateParams.hostName;
              $scope.apiVersion = $stateParams.apiVersion;
              $scope.vmKey = $stateParams.vmKey;
          }
      }).state('main.vmwareVm.dashboard', { //vmware云主机概要
          url: "/dashboard",
          templateUrl: "html/partials/cloudResource/vmware/vm/overview.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'dashboard';
          }
      }).state('main.vmwareVm.performance', { //vmware云主机性能监控
          url: "/performance",
          templateUrl: "html/partials/cloudResource/vmware/vm/performance.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'performance';
          }
      }).state('main.vmwareHostpool', { //vmware主机池
          url: "/vmware/:id/:name/:hpKey/:hpName/:apiVersion",
          templateUrl: "html/partials/cloudResource/vmware/hostpool/hostpool.html",
          controller: function($scope,$stateParams) {
              $scope.cloudId = $stateParams.id;
              $scope.cloudName = $stateParams.name;
              $scope.hpKey = $stateParams.hpKey;
              $scope.hpName = $stateParams.hpName;
              $scope.apiVersion = $stateParams.apiVersion;
              //选中对应节点
              selectTreeNode($scope, 'main.vmwareHostpool', 'v_hostpool', 'nav', null, undefined, $stateParams.id+$stateParams.hpKey);
          }
      }).state('main.vmwareHostpool.dashboard', { //vmware主机池-概要
          url: "/dashboard",
          templateUrl: "html/partials/cloudResource/vmware/hostpool/overview.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'dashboard';
          }
      }).state('main.vmwareHostpool.host', { //vmware主机池-主机
          url: "/host",
          templateUrl: "html/partials/cloudResource/vmware/host.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'host';
              $scope.queryType = constant.PUBLIC_CLOUD_HOST_POOL;
              $scope.queryKey = $scope.hpKey;
          }
      }).state('main.vmwareHostpool.vm', { //vmware主机池-虚拟机
          url: "/vm",
          templateUrl: "html/partials/cloudResource/vmware/vm.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'vm';
              $scope.queryType = constant.PUBLIC_CLOUD_HOST_POOL;
              $scope.queryKey = $scope.hpKey;
          }
      }).state('main.vmwareCluster', { //vmware集群
          url: "/vmware/:id/:name/:hpKey/:hpName/:clusterKey/:clusterName/:apiVersion",
          templateUrl: "html/partials/cloudResource/vmware/cluster/cluster.html",
          controller: function($scope,$stateParams) {
              $scope.cloudId = $stateParams.id;
              $scope.cloudName = $stateParams.name;
              $scope.hpKey = $stateParams.hpKey;
              $scope.hpName = $stateParams.hpName;
              $scope.clusterKey = $stateParams.clusterKey;
              $scope.clusterName = $stateParams.clusterName;
              $scope.apiVersion = $stateParams.apiVersion;
              //选中对应节点
              selectTreeNode($scope, 'main.vmwareCluster', 'v_cluster', 'nav', null, undefined, $stateParams.id+$stateParams.clusterKey);
          }
      }).state('main.vmwareCluster.dashboard', { //vmware集群-概要
          url: "/dashboard",
          templateUrl: "html/partials/cloudResource/vmware/cluster/overview.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'dashboard';
          }
      }).state('main.vmwareCluster.performance', { //vmware集群-性能监控
          url: "/performance",
          templateUrl: "html/partials/cloudResource/vmware/cluster/performance.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'performance';
          }
      }).state('main.vmwareCluster.host', { //vmware集群-主机
          url: "/host",
          templateUrl: "html/partials/cloudResource/vmware/host.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'host';
              $scope.queryType = constant.PUBLIC_CLOUD_CLUSTER;
              $scope.queryKey = $scope.clusterKey;
          }
      }).state('main.vmwareCluster.vm', { //vmware集群-虚拟机
          url: "/vm",
          templateUrl: "html/partials/cloudResource/vmware/vm.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'vm';
              $scope.queryType = constant.PUBLIC_CLOUD_CLUSTER;
              $scope.queryKey = $scope.clusterKey;
          }
      }).state('main.vmwareHost', { //vmware主机
          url: "/vmware/:id/:name/:hpKey/:hpName/:clusterKey/:clusterName/:hostKey/:hostName/:apiVersion",
          templateUrl: "html/partials/cloudResource/vmware/host/host.html",
          controller: function($scope,$stateParams) {
              $scope.cloudId = $stateParams.id;
              $scope.cloudName = $stateParams.name;
              $scope.hpKey = $stateParams.hpKey;
              $scope.hpName = $stateParams.hpName;
              $scope.clusterKey = $stateParams.clusterKey;
              $scope.clusterName = $stateParams.clusterName;
              $scope.hostKey = $stateParams.hostKey;
              $scope.hostName = $stateParams.hostName
              $scope.apiVersion = $stateParams.apiVersion;
              //选中对应节点
              selectTreeNode($scope, 'main.vmwareHost', 'v_host', 'nav', null, undefined, $stateParams.id+$stateParams.hostKey);
          }
      }).state('main.vmwareHost.dashboard', { //vmware主机-概要
          url: "/dashboard",
          templateUrl: "html/partials/cloudResource/vmware/host/overview.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'dashboard';
          }
      }).state('main.vmwareHost.performance', { //vmware主机-性能监控
          url: "/performance",
          templateUrl: "html/partials/cloudResource/vmware/host/performance.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'performance';
          }
      }).state('main.vmwareHost.vm', { //vmware集群-虚拟机
          url: "/vm",
          templateUrl: "html/partials/cloudResource/vmware/vm.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'vm';
              $scope.queryType = constant.PUBLIC_CLOUD_HOST;
              $scope.queryKey = $scope.hostKey;
          }
      }).state('main.reportMng', { //统计报表
          url: "/reportMng",
          templateUrl: "html/partials/report/reportMng.html",
          controller: function($scope,$stateParams) {
              //选中对应节点
              selectTreeNode($scope, 'main.reportMng', 'monitor', 'nav', 510, constant.onMonitorMngNodeSelected);
          }
      }).state('main.resPoolCompute', {
    	  url: "/resPoolCompute",
    	  templateUrl: "html/partials/report/resPoolCompute.html",
    	  controller: function($scope, $stateParams) {
    		//选中对应节点
            selectTreeNode($scope, 'main.resPoolCompute', 'monitor', 'nav', 511, constant.onMonitorMngNodeSelected);
    	  }
      }).state('main.resPoolStorage', {
    	  url: "/resPoolStorage",
    	  templateUrl: "html/partials/report/resPoolStorage.html",
    	  controller: function($scope, $stateParams) {
    		//选中对应节点
            selectTreeNode($scope, 'main.resPoolStorage', 'monitor', 'nav', 512, constant.onMonitorMngNodeSelected);
    	  }
      }).state('main.orgResQuota', {
    	  url: "/orgResQuota",
    	  templateUrl: "html/partials/report/orgResQuota.html",
    	  controller: function($scope, $stateParams) {
    		  //选中对应节点
    		  selectTreeNode($scope, 'main.orgResQuota', 'monitor', 'nav', 513, constant.onMonitorMngNodeSelected);
    	  }
      }).state('main.vmUsage', { //虚拟机使用量统计
	    	url: "/vmUsage",
	    	templateUrl: "html/partials/report/reportVmUsage.html",
	    	params: {'vmKey': null, 'publicCloudId': null, 'nameOrTitle': null, 'startTime': null, 'endTime': null},
	    	controller: function($scope,$stateParams) {
	    		$scope.params = $stateParams;
     			$scope.lastFilter = $stateParams;
	    		//选中对应节点
	            selectTreeNode($scope, 'main.vmUsage', 'monitor', 'nav', 514, constant.onMonitorMngNodeSelected);
	    	}
      }).state('main.vmUsageSummary', { //虚拟机使用量报表汇总
	    	url: "/vmUsageSummary",
	    	templateUrl: "html/partials/report/reportVmUsageSummary.html",
	    	controller: function($scope,$stateParams) {
	    		//选中对应节点
	            selectTreeNode($scope, 'main.vmUsageSummary', 'monitor', 'nav', 519, constant.onMonitorMngNodeSelected);
	    	}
	   }).state('main.resourcePoolMng', { //资源池管理
          url: "/resourcePool",
          templateUrl: "html/partials/resourcePool/resourcePoolList.html",
          controller: function($scope,$stateParams) {
              selectTreeNode($scope, 'main.resourcePoolMng', 'resourcePoolMng', 'nav', 518, constant.onVDCNodeSelected);
          }
      }).state('main.resourcePool', { //资源池管理/概要
          url: "/resourcePool/:id/:name/:cloudId/:cloudType",
          templateUrl: "html/partials/resourcePool/resourcePool.html",
          controller: function($scope,$stateParams) {
              $scope.id = $stateParams.id;
              $scope.name = $stateParams.name;
              $scope.cloudId = $stateParams.cloudId;
              $scope.cloudType = $stateParams.cloudType;
              selectTreeNode($scope, 'main.resourcePool', 'resource_pool', 'nav', $scope.id, constant.onVDCNodeSelected);
          }
      })
      .state('main.resourcePool.summary', { //资源池管理/概要
          url: "/summary",
          templateUrl: "html/partials/resourcePool/overview.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'summary';
              //修改问题单:201706070790 不同页签显示不同帮助
              $scope.$parent.resourceHelpUrl = 'resourcePool/resourcePoolSummary';
          }
      })
      .state('main.resourcePool.cluster', { //资源池管理/集群
          url: "/cluster",
          templateUrl: "html/partials/resourcePool/computeResource.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'cluster';
              //修改问题单:201706070790 不同页签显示不同帮助
              $scope.$parent.resourceHelpUrl = 'resourcePool/resourcePoolComputeRes';
          }
      })
      .state('main.resourcePool.vswitch', { //资源池管理/网络
          url: "/vswitch",
          templateUrl: "html/partials/resourcePool/vswitch.html",
          controller: function($scope,$stateParams) {
              $scope.$parent.currentTab = 'vswitch';
              //修改问题单:201706070790 不同页签显示不同帮助
              $scope.$parent.resourceHelpUrl = 'resourcePool/resourcePoolNetResMgmt';
          }
      }).state("main.resourcePool.storageResource",{//组织面板/存储
		   url: "/storage",
		   templateUrl: "html/partials/resourcePool/storageResource.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'storageResource';
			   //修改问题单:201706070790 不同页签显示不同帮助
	           $scope.$parent.resourceHelpUrl = 'resourcePool/resourcePoolStorageResMgmt';
	       }
	   }).state("main.resourcePool.networkStrategyTemplet",{//资源池面板/
		   url: "/netStrategy",
		   templateUrl: "html/partials/resourcePool/networkStrategyTemplet.html",
		   controller: function($scope,$stateParams) {
			   $scope.$parent.currentTab = 'networkStrategyTemplet';
			   //修改问题单:201706070790 不同页签显示不同帮助
	           $scope.$parent.resourceHelpUrl = 'resourcePool/resourcePoolProfileMgmt';
	       }
	   
	   }).state('main.publicCloud', { //云彩虹
	    	url: "/publicCloud",
	    	templateUrl: "html/partials/cloudService/publicCloud/publicCloud.html",
	    	controller: function($scope,$stateParams) {
	    		//选中对应节点
	            selectTreeNode($scope, 'main.publicCloud', 'public_cloud', 'nav', 121, constant.oncloudServiceNodeSelected);
	    	}
	    }).state('main.pluginMng', { //插件管理
		   	url: "/pluginMng",
		  	templateUrl: "html/partials/pluginManager/plugin.html"
		}).state('main.pluginInfo',{
			url: "/pluginInfo/:id/:name",
			templateUrl: "html/partials/pluginManager/pluginInfo.html",
			controller: function($scope,$stateParams) {
	            $scope.id = $stateParams.id;
	            $scope.name = $stateParams.name;
	    	}
		}).state('main.plugin',{
			url: "/plugin/:name/:pluginHerf",
		  	templateUrl: "html/partials/pluginManager/pluginNavigation.html",
		  	controller: function($scope,$stateParams) {
	            $scope.name = $stateParams.name;
	            $scope.pluginHerf = $stateParams.pluginHerf;
	    	}		
		})
		.state('main.VDCMng',{//VDC管理
            url: "/vdcMng",
            templateUrl: "html/partials/vdc/vdcMng.html",
            controller: function($scope,$stateParams) {
                //选中VDC管理节点
                selectTreeNode($scope, 'main.VDCMng', 'VDCMng', 'nav', -1, constant.onVDCNodeSelected);
            }       
        })
	   ;

});
//配置请求拦截器
routeApp.factory('myInterceptor', function($q,$translate) {
	var interceptor = {
		'request' : function(config) {
			// 成功的请求方法
			return config; // 或者 $q.when(config);
		},
		'response' : function(response) {
			// 响应成功
			return response; // 或者 $q.when(config);
		},
		'requestError' : function(response) {
			// 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
			return response; // 或新的promise
			// 或者，可以通过返回一个rejection来阻止下一步
			// return $q.reject(rejection);
		},
		'responseError' : function(response) {
			// 请求发生了错误，如果能从错误中恢复，可以返回一个新的响应或promise
//			return rejection; // 或新的promise
			// 或者，可以通过返回一个rejection来阻止下一步
			return $q.reject(response);
//			 UtilService.handleError(rejection.status);
		}
	};
	return interceptor;
});
routeApp.config(function($httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');
});
routeApp.run(function($rootScope, $location, $http, $state, $timeout, UtilService) {
	// 给$routeChangeStart设置监听
	$rootScope.$on('$routeChangeStart', function(evt, next, curr) {
		$http({
				method: 'GET',
				url: 'islogin'
		}).success(function(data){
			if (data == false) {
				window.location.href="showlogin";
			}
		});
			
		
	});
	
	//动态设置列表的样式
	$rootScope.gridStyle = function(h, doubleList) {
//		var nav = $('#toggleli');
//		var navWidth = nav[0].clientWidth;
//		var w = navWidth + 60;			//导航栏宽度加上表格两边的空隙60
		var style = {};
//		var listWidth = getClientWidth() - w;
		var listHeight = getClientHeight() - 315;
		if (angular.isDefined(h) && angular.isUndefined(doubleList)) {
			if (angular.isNumber(h)) {
				listHeight = listHeight - h;
			}			
		} else if (angular.isDefined(h) && angular.isDefined(doubleList)) {
			if (angular.isNumber(h)) {
				listHeight = listHeight - h;
			}
			listHeight = listHeight / 2;
		} else {
			if (angular.isNumber(h)) {
				listHeight = listHeight - h;
			}
		}
		style.width = '100%';
		style.height = listHeight + 'px';
//		console.info('in root ctrl');
//		console.info(style);
//		$(window).resize();
		return style;
	};
	
	//动态设置 main.html class="mainContent"的div的高度，方便子元素继承高度属性。
	$rootScope.mainContentStyle = function() {
		var style = {};
		//50是右面板导航条高度（注销按钮所在的导航条）
		var height = getClientHeight() - 50;
		style.width = '100%';
		style.height = height + 'px';
		return style;
	}();
	
	//给content内容设置高度
	$rootScope.contentStyle = function(h) {
		var style = {};
		var listHeight = getClientHeight() - 315;
		if (angular.isNumber(h)) {
			listHeight = listHeight - h;
		}
		style.width = '100%';
		style.height = listHeight + 'px';
		return style;
	};
	if(!$rootScope.transition)
		$rootScope.transition=0;
	else{
	}
	
	$rootScope.overviewStyle = function(id) {
		var style = {};
		style.height = ($(window).height() - $("#"+ id).offset().top - 25) + 'px';
		return style;
	};
	//显示页面下方的任务台列表
	$rootScope.showTaskList = function() {
		$rootScope.$broadcast("onShowTaskList");
	};
	
	//展示帮助文件
	$rootScope.openHelp = function(type) {
		var param = 'height=600px,width=700px,top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no';
		var helpUrl = "html/help/plat/zh/";
		if ($rootScope.uiConfig.copyrightFrom == constant.unicloud) {
			helpUrl = "html/help/unicloud/zh/";
		}
		if (globalLang == "en_US") {
			helpUrl = "html/help/plat/en/";
		}
		var url = helpUrl + type + ".html";
		window.open(url,'cicHelpWindow',param);
	};
	
	//点击页面其他地方，列表的显示列菜单隐藏。
	$rootScope.docClick = function(event) {
		if ($rootScope.sessionTimer) {
			clearTimeout($rootScope.sessionTimer);
			$rootScope.sessionTimer = setTimeout(function(){
		  		  UtilService.logout(true);
		  	}, $rootScope.timeout);
		}
		//修改问题单201701170628：点击界面其他地方隐藏选择列面板  by ckf6302
		if (!$(event.target).hasClass("ngHeaderButton") && !$(event.target).hasClass("ngHeaderButtonArrow") 
				&& !$(event.target).hasClass("ngColListCheckbox") && !$(event.target.parentElement).hasClass("ngColListItem") 
				&& !$(event.target).hasClass("colListCheckbox")
				&& !$(event.target.parentElement).hasClass("ngColList")) {
			$rootScope.$broadcast('hideMenu');
		}
		if (!$(event.target).hasClass("icon-skin")) {
			$("#switchSkin").hide();
		}
	};
	
	$rootScope.colorPick = function(skincolor) {
		if(skincolor==="black"){
			$("#changeCss").attr("href","css/blackTheme.css");
			$("#switchSkin").hide();
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
			$rootScope.$broadcast('onSwitchSkin', 'grey');
			$http.post('ui/saveParam/operSkin/black', {})
			.success(function(result) {
				
			})
			
		} else if(skincolor==="blue"){
			$("#changeCss").attr("href","css/blueTheme.css");
			$("#switchSkin").hide();
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
			$rootScope.$broadcast('onSwitchSkin', 'blue');
			$http.post('ui/saveParam/operSkin/blue', {})
			.success(function(result) {
				
			})
		} else if(skincolor==="green"){
			$("#changeCss").attr("href","css/greenTheme.css");
			$("#switchSkin").hide();
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
			$rootScope.$broadcast('onSwitchSkin', 'green');
			$http.post('ui/saveParam/operSkin/green', {})
			.success(function(result) {
				
			})
		} else if(skincolor==="purple"){
			$("#changeCss").attr("href","css/purpleTheme.css");
			$("#switchSkin").hide();
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
			$rootScope.$broadcast('onSwitchSkin', 'purple');
			$http.post('ui/saveParam/operSkin/purple', {})
			.success(function(result) {
				
			})
		}  else if(skincolor==="red"){
			$("#changeCss").attr("href","css/redTheme.css");
			$("#switchSkin").hide();
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
			$rootScope.$broadcast('onSwitchSkin', 'red');
			$http.post('ui/saveParam/operSkin/red', {})
			.success(function(result) {
				
			})
		} else if(skincolor==="azure"){
			$("#changeCss").attr("href","css/azureTheme.css");
			$("#switchSkin").hide();
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
			$rootScope.$broadcast('onSwitchSkin', 'azure');
			$http.post('ui/saveParam/operSkin/azure', {})
			.success(function(result) {
				
			})
		} else if(skincolor==="casic"){
			$("#changeCss").attr("href","css/casicTheme.css");
			$("#switchSkin").hide();
			if($rootScope.switchSkinTimer){
				$timeout.cancel($rootScope.switchSkinTimer);
				delete $rootScope.switchSkinTimer;
			}
			$rootScope.$broadcast('onSwitchSkin', 'azure');
			$http.post('ui/saveParam/operSkin/casic', {});
		} 
		//云主机详情中发送更换皮肤消息
		if ($state.$current.name == 'main.vm') {
			var ele = document.getElementById("iframepage_vm");
			if (ele) {
				var win = ele.contentWindow;
				win.postMessage(skincolor, "*");
			}
		}
	}
	/*切换系统主题*/
	$rootScope.switchSkin=function(){
		if(angular.isDefined($rootScope.switchSkinTimer)){
			$timeout.cancel($rootScope.switchSkinTimer);
			delete $rootScope.switchSkinTimer;
		}
		
		$("#switchSkin").toggle();
		$rootScope.switchSkinTimer=$timeout(function(){
			if($("#switchSkin")[0]){
				$("#switchSkin").fadeOut();
				$timeout.cancel($rootScope.switchSkinTimer);
				delete $rootScope.switchSkinTimer;
			}
		},5000);
	};
});

routeApp.controller('Ctrl', ['$scope', '$translate', function($scope, $translate) {

	  $scope.setLang = function(langKey) {
	    // You can change the language during runtime
	    $translate.use(langKey);
	  };
	}]);
//底部控制台 2015-07-02
routeApp.controller('ControlController', function($rootScope, $scope, $translate, $interval) {
	//切换页面下方的任务台列表
	$scope.toogleTaskList=function(){
		if ($("#bottomPanel").css('visibility') == 'hidden') {
			$scope.openTaskList();
		} else {
			$scope.cancelTaskList();
		}
	}
	//打开页面下方的任务台列表
	$scope.openTaskList=function(){
	    if ($("#bottomPanel").css('visibility') == 'hidden') {
	    	//防止nggrid列表的宽度变小
	    	$("#main").css("overflow", "hidden");
	    	$("#bottomPanel").css('visibility','visible');
	    	var bottomHeight = $("#bottomPanel").height();
	    	$("#mainPanel").height("calc(100% - " + bottomHeight+"px)");
	    	$("#slidebar").css("min-height",bottomHeight+"px");
	    	var diff = $("#bottomPanel").height() + 84;
	    	$("#treeDivId").height("calc(100vh - "+diff+ "px)");
	    	$(window).trigger('resize.nggrid');
	    	$(window).trigger('resize');
	    }
	};
	//关闭页面下方的任务台列表
	$scope.cancelTaskList=function(){
		if ($("#bottomPanel").css('visibility') != 'hidden') {
			$("#bottomPanel").css('visibility','hidden');
			var h=window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight; 
			$("#mainPanel").height("100%");
			$("#slidebar").css("min-height",h+"px");
	    	$("#treeDivId").height("calc(100vh - 84px)");
	    	$(window).trigger('resize.nggrid');
	    	$(window).trigger('resize');
		}
	};
	var clicklink  = $("#openBottomControl");
	if(clicklink){
		clicklink.bind("click",function(){
			$scope.toogleTaskList();
		});
	}
	//接收消息 显示页面下方的任务台。
	$scope.$on('onShowTaskList', function() {
		$scope.openTaskList();
	})
	//注册主面板右上角帮助图标的鼠标点击的监听事件
	$("#mainPanelHelp").on("click",function(){
		var origin = document.location.origin;
		var url = origin+ "/cvmhelp/index.jsp?topic=%2Fcom.virtual.help%2Fhtml%2FsysIntro.html";
		window.open(url,"_blank");
	});
	
});
//routeApp.directive('checkUser', ['$rootScope', '$location', 'IsoService', function ($root, $location, IsoService) {
//	 return {
//	  link: function (scope, elem, attrs, ctrl) {
//	  $root.$on('$routeChangeStart', function(event, currRoute, prevRoute){
//		  alert(IsoService.isLogin())
//	    if (!IsoService.isLogin()) {
//	    // reload the login route
//	    }
//	    /*
//	    * IMPORTANT:
//	    * It's not difficult to fool the previous control,
//	    * so it's really IMPORTANT to repeat the control also in the backend,
//	    * before sending back from the server reserved information.
//	    */
//	  });
//	  }
//	 }
//	}]);
routeApp.directive("main",function(){
	return{
		restrict:'AE',
		link:function(scope,element,attrs){	
			element.css('width',(window.innerWidth-226)+'px');
		}
	};
});
function bindDraggableOfAppJs(evt,scope){
	if(evt.className.match("ui-draggable")==null && evt.className.match("modal-loading")==null ){
		$(evt).draggable({ handle: ".modal-header",
						   containment:$("#bodyid")  //控制弹窗在浏览器中可见区域内拖拽
		});//不重复绑定drag事件，如果是loading页面那么不绑定drag
	}
}
function getFileNameOfAppJS(str){
	var val = "";
	if(typeof str === "string"){
		var addressArray = str.split("\\");
		if(addressArray.length==0){
			val = "";
		}else if(addressArray.length==1){
			val = addressArray[0];
		}else if(addressArray.length>1){
			val = addressArray[addressArray.length-1];
		}
	}
	return val;
}

routeApp.controller('personalizationController', ['$scope', '$translate', '$rootScope','UtilService', function($scope, $translate, $rootScope, UtilService) {
	if ($rootScope.uiConfig) {
		if ($rootScope.uiConfig.copyrightFrom == constant.casic) {
			$rootScope.isCasIc = true;
		} else if ($rootScope.uiConfig.copyrightFrom == constant.casicunis) {
			$rootScope.isCasIcUnis = true;
		}
		if (angular.isDefined($rootScope.uiConfig.appTopLogoMini)) {
			$scope.appTopLogoMini = $rootScope.uiConfig.appTopLogoMini;				
		} else {
			if ($rootScope.isCasIc) {
				$scope.appTopLogoMini='css/img/spaceflight-01.png';app
			} else if($rootScope.uiConfig.copyrightFrom == constant.unis) {
                $scope.appTopLogoMini='css/img/logo_unis.svg';
            }else if ($rootScope.uiConfig.copyrightFrom == constant.unicloud) {
							$scope.appTopLogoMini='css/img/logo_unicloud.png';
						}  else {					
				$scope.appTopLogoMini='css/img/cas-01.png';
			}
		}
		if (angular.isDefined($rootScope.uiConfig.appTopLogo)) {
			$scope.appTopLogo = $rootScope.uiConfig.appTopLogo;				
		} else {
			if ($rootScope.isCasIc) {
				$scope.appTopLogo= $translate.instant("spaceflightImgPath");
			} else if ($rootScope.isCasIcUnis) {
				$scope.appTopLogo= $translate.instant("icunisLogoPath");
			}  else {					
				$scope.appTopLogo= $translate.instant("caslogoImgPath");
			}
		}
		UtilService.setFavicon();
		UtilService.setSystemName();
	}
}]);

routeApp.controller('pusherchatController', ['$scope', '$translate', '$rootScope','$compile','$http', function($scope, $translate, $rootScope,$compile, $http) {
	$http({
        method  : 'GET',
        url     : 'systemConfig/sysConfig',
        params:{type:"ssv_conf"}
    }).success(function(result){
    	var instantMessage = result.data["ssv.isusing.instant.message"];
    	if (instantMessage == 0) {
    		$('.nonConnected').hide();
    	}
    	if (instantMessage == 1) {
      	  createWebSocket();
        }
    });
	
	var loginName = $rootScope.loginInfo.loginName;
	var websocket;
	var operatorAndUserList;
	function createWebSocket() {
          var wsUri ="ws://" + window.location.host +"/cic/livechat?username=" + loginName +"&usertype=1";
          //修改问题单201702240260， ssv用https访问，鼠标移动到在线服务上，不能够弹出对话框，并且在cic上看到在线的用户还是0。
          if (window.location.protocol == 'https:') {
        	  wsUri ="wss://" + window.location.host +"/cic/livechat?username=" + loginName +"&usertype=1";
          }
          websocket = new WebSocket(wsUri);
          websocket.onopen = function(evt) {
              onOpen(evt)
          };
          websocket.onclose = function(evt) {
              onClose(evt)
          };
          websocket.onmessage = function(evt) {
              onMessage(evt)
          };
          websocket.onerror = function(evt) {
              onError(evt)
          };
    }

	function onOpen(evt) {
		
	}
	
	function onClose(evt) {
		clearMessage();
	}

	function onMessage(evt) {
		var dataJson=$.parseJSON(evt.data);
		if (dataJson.type == 1) {
			memberUpdate(dataJson.userlist);
		} else if (dataJson.type == 2) {
			var obj = $('a[href=#' + dataJson.user + '_' + dataJson.usertype + ']');
			createChatBox(obj);
			var name = $('#id_' + dataJson.user + '_' + dataJson.usertype).find('.boxHeader .userName').html();
			var message = dataJson.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			var time = getTimeString();
			$('#id_' + dataJson.user + '_' + dataJson.usertype + ' .msgTxt').append('<p class="friend"><b>' + name + '</b>' + '<b class="time">' + time + '</b><br/>'+ message +'</p>');
			$('#id_' + dataJson.user + '_' + dataJson.usertype + ' .boxHeader').addClass('headtwinkling');
			$('#id_' + dataJson.user + '_' + dataJson.usertype + ' .logMsg').scrollTop( $('#id_' + dataJson.user + '_' + dataJson.usertype + ' .msgTxt')[0].scrollHeight );
			if (!$('#pusherChat #members-list a[href="#' + dataJson.user + '_' + dataJson.usertype + '"] span.notreadnum').html()) {
				if (!$('#id_' + dataJson.user + '_' + dataJson.usertype).is(':visible')){
					$('#pusherChat #members-list a[href="#' + dataJson.user + '_' + dataJson.usertype + '"]').append('<span class="notreadnum">1</span>');
				}
			} else {
				var ust = $('#pusherChat #members-list a[href="#' + dataJson.user + '_' + dataJson.usertype + '"] span.notreadnum').html();
				$('#pusherChat #members-list a[href="#' + dataJson.user + '_' + dataJson.usertype + '"] span.notreadnum').html(parseInt(ust)+1);
			}
			if (!$('#id_' + dataJson.user + '_' + dataJson.usertype).is(':visible')){
				$('#pusherChat #members-list a[href="#' + dataJson.user + '_' + dataJson.usertype + '"]').addClass('usertwinkling');
			}
			updateHeadTwinkleState();
		}
	}

	function onError(evt) {
		clearMessage();
	}
	function doSend(data) {
		var message = {};
		message.type=2;
		message.user=data.from;
		message.usertype=1;
		message.touser=data.to;
		message.tousertype=data.totype;
		message.message=data.message;
		var sendData = JSON.stringify(message);
		websocket.send(sendData);
	}

	function memberUpdate(userList) {
		operatorAndUserList = userList;
		//删除不再在线的用户
		$('#pusherChat #members-list a').each(function(index, val) {
			var id = $(val).attr('href').replace('#','');
			var isExist = false;
			$.each(userList, function(i, vl) {
				if ((vl.username + '_' + vl.type) == id) {
					isExist = true;
					return;
				}
			});
			if (!isExist) {
			    $(val).remove();
			}
		});
		
		var count=0;
		var userNameList=[];
		$.each(userList, function(index, val) {
			userNameList[index] = val.username + '_' + val.type;
			if (val.type == 2 || loginName != val.username) {
				count++;
				var userImage;
				var loginType;
				if (val.type == 1) {
					userImage = val.image; 
					loginType = $translate.instant('common.operator');
				} else if (val.type == 2) {
					userImage = "http://" + window.location.host + "/ssv/" + val.image;
					if (window.location.protocol == 'https:') {
						userImage = "https://" + window.location.host + "/ssv/" + val.image;
					}
					loginType = $translate.instant('common.user');
				}
				var onlineUser = $('#pusherChat #members-list a[href=#' + val.username + '_' + val.type + ']');
				if (onlineUser.html()) {
					onlineUser.find('img').attr('src' , userImage);
					onlineUser.find('span.realName').attr('title' , val.realname).html(val.realname);
					var temp = onlineUser.clone();
					onlineUser.remove();
					$('#pusherChat #members-list').append(temp);
				} else {
					var onlineUser = '<a href="#' + val.username + '_' + val.type + '" class="on"><img  src="'+userImage+'"/> <span class="realName" title=' + 
					                  val.realname + '>'+ val.realname +'</span><span>'+ loginType +'</sapn></a>';
					$('#pusherChat #members-list').append(onlineUser);
				}
				$('#id_'+val.username + '_' + val.type + ' .userName').html(val.realname);
			}
		});
		$('.chatBoxslide > .pusherChatBox').each(function () {
			var obj = $(this);    
			var id = obj.attr('id').replace('id_', '');
			if (userNameList.indexOf(id) == -1) {
				if (obj.is(':visible')) {
					obj.hide();
					updateBoxPosition();
				}
			}
			
		});
		if ($('#pusherChat #membersContent .scroll').is(':visible')) {
			$('#pusherChat #membersContent .openDlg').hide();
			$('#pusherChat #membersContent .closeDlg').show();
		} else {
			$('#pusherChat #membersContent .openDlg').show();
			$('#pusherChat #membersContent .closeDlg').hide();
		}

		$("#count").html(count);
	}
      
	function clearMessage () {
		$('#pusherChat #members-list').html('');
		$("#count").html(0);
		$('.chatBoxslide > .pusherChatBox').hide();
	}
	
	/*-----------------------------------------------------------*
	 * slide up & down chat boxes
	 *-----------------------------------------------------------*/  
	$('.nonConnected').on('click','#pusherChat .pusherChatBox .expand',function(){
		var obj = $(this);
		obj.parent().parent().find('.headerBottom').show();
		obj.parent().parent().parent().find('.slider').slideToggle('1', function() {
			if ($(this).is(':visible')){
				obj.find('.closeDlg').show();
				obj.find('.openDlg').hide();
			}else {
				obj.find('.closeDlg').hide();
				obj.find('.openDlg').show();
				obj.parent().parent().find('.headerBottom').hide();
			}
		});    
		return false;
	});
	
	/*-----------------------------------------------------------*
	 * slide up & down friends list
	 *-----------------------------------------------------------*/  
	$('.nonConnected').on('click','#pusherChat #membersContent .expand',function(){
		var obj = $(this);
		obj.parent().find('.scroll').slideToggle('1', function() {
			if ($(this).is(':visible')){
				obj.find('.closeDlg').show();
				obj.find('.openDlg').hide();
			}else {
				obj.find('.closeDlg').hide();
				obj.find('.openDlg').show();
			}
		});    
		return false;
	});
	
	// close chat box
	$('.nonConnected').on('click','#pusherChat .closeBox',function(){
		$(this).parents('.pusherChatBox').hide();
		updateBoxPosition();
		return false;
	});
	
	// trigger click on friend & create chat box
	$('.nonConnected').on('click','#pusherChat #members-list a',function(){
		var obj=$(this);
		showChatBox(obj);
		obj.find('span.notreadnum').remove();
		obj.removeClass('usertwinkling');
		updateHeadTwinkleState();
		var name = obj.attr('href').replace('#','id_');
		var chatBox = $('.pusherChatBox[id=' + name + ']');
		chatBox.find('.boxHeader').removeClass('headtwinkling');
		if (!chatBox.find('.slider').is(':visible')) {
			chatBox.find('.headerBottom').show();
			chatBox.find('.slider').show();
			chatBox.find('.expand .closeDlg').show();
			chatBox.find('.expand .openDlg').hide();
		}
		return false;
	});
	
	// some action whene click on chat box
	$('.nonConnected').on('click','.pusherChatBox',function(){
		var newMessage = false;
		$(this).find('.boxHeader').removeClass('headtwinkling');
		var name = $(this).attr("id").replace('id_','');
		$('#pusherChat #members-list a[href="#' + name + '"]').removeClass('usertwinkling').find('span.notreadnum').remove();
		updateHeadTwinkleState();
		$('.pusherChatBox').each(function(){
			if ($(this).find('.boxHeader').hasClass('headtwinkling')){
				newMessage = true;
				return false; 
			}       
		});  
	});
	
	/*-----------------------------------------------------------*
	 * create a chat box from the html template 
	 *-----------------------------------------------------------*/        
	function createChatBox(obj){
		var name = obj.find('span').html();
		var img = obj.find('img').attr('src');
		var id = obj.attr('href').replace('#', 'id_');
		var off = clone ='';
		if (obj.hasClass('off')) off = 'off';
		if (!$('#'+id).html()){
			$('#templateChatBox .pusherChatBox .boxHeader .userName').html(name);
			$('#templateChatBox .pusherChatBox .boxHeader .userName').attr("title",name);
			$('#templateChatBox .pusherChatBox .boxHeader img.imgFriend').attr('src',img);
			$('.chatBoxslide').prepend($('#templateChatBox .pusherChatBox').clone().hide().attr('id',id));
		}
		$('#'+id+' .to').val(obj.attr('href'));
		$('#'+id).addClass(off);
		return false;
	}
	
	function showChatBox(obj){
		var id = obj.attr('href').replace('#', 'id_');
		if (!$('#'+id).html()){
			createChatBox(obj);
		}
        
		if (!$('#'+id).is(':visible')){
			$('.chatBoxslide .pusherChatBox:visible').hide();
			$('#'+id).show();
		}
		
		$('#'+id+' textarea').focus();
		updateBoxPosition();
		return false;
	}
	
	/*-----------------------------------------------------------*
	 * reorganize the chat box position on adding or removing
	 *-----------------------------------------------------------*/  
	function updateBoxPosition(){
		var right=0;
		var slideLeft = false;
		$('.chatBoxslide .pusherChatBox:visible').each(function(){
			$(this).css({
				'right':right
			});
			right += $(this).width()+20;
			$('.chatBoxslide').css({
				'width':right
			});
			if ($(this).offset().left- 20<0){
				$(this).addClass('overFlow');
				slideLeft = true;
			}
			else
				$(this).removeClass('overFlow');
		});          
		if(slideLeft) $('#slideLeft').show();
		else $('#slideLeft').hide();
		
		if($('.overFlowHide').html()) $('#slideRight').show();
		else $('#slideRight').hide();
	}
	
	$('.nonConnected').on('click','#slideLeft',function(){
		$('.chatBoxslide .pusherChatBox:visible:first').addClass('overFlowHide');
		$('.chatBoxslide .pusherChatBox.overFlow').removeClass('overFlow');
		updateBoxPosition();
	});
	
	$('.nonConnected').on('click','#slideRight',function(){
		$('.chatBoxslide .pusherChatBox.overFlowHide:last').removeClass('overFlowHide');
		updateBoxPosition();
	});
	
	/*-----------------------------------------------------------*
	 * send message & typing event to server
	 *-----------------------------------------------------------*/ 
	$(".nonConnected").on('keypress','.pusherChatBox textarea',function(event) {
		if ($(this).val().length > 500) {
  		  $(this).val($(this).val().substring(0, 500));
  	    }
		if (event.which == 13) { 
			if ($(this).val() == '\n' || $(this).val() == '') {
				$(this).val('');
				$(this).focus();
				return;
			}
			var to = $(this).next().val().replace('#', '');
			if (!checkOnlineUser(loginName)) {
				websocket.close();
				console.log('Exit liveChat');
				return;
			}
			var totype = to.substring(to.lastIndexOf('_') + 1);
			var touser = to.substring(0, to.lastIndexOf('_'));
			var data={};
			data.from = loginName;
			data.to = touser;
			data.totype = totype;
			data.message = $(this).val().replace(/</g,'&lt;').replace(/>/g,'&gt;');
			doSend(data);
			event.preventDefault();
			$(this).val('');
			$(this).focus();
			var time = getTimeString();
			$('#id_' + to +' .msgTxt').append('<p class="you"><b>' + $translate.instant('common.myName') + '</b>' + '<b class="time">' + time + '</b>' + '<br/>'+ data.message+'</p>');
			$('#id_' + to +' .logMsg').scrollTop( $('#id_' + to + ' .msgTxt')[0].scrollHeight );
		} 
	});     
	
	function checkOnlineUser(currentuser) {
		var result = false;
		var loginInfostr = localStorage.getItem("cicLoginInfo");
		if (angular.isDefined(loginInfostr) && loginInfostr != null) {
			var loginInfo = JSON.parse(loginInfostr);
			if (loginInfo != null && loginInfo.loginName == currentuser) {
				result = true;
			}
		}
		return result;
	}
	
	function getTimeString() {
		var da = new Date();
		return (da.getHours() < 10 ? '0' + da.getHours() : '' + da.getHours()) + ':' + (da.getMinutes() < 10 ? '0' + da.getMinutes() : '' + da.getMinutes());
	}
	
	function updateHeadTwinkleState() {
		var needTwikle = false;
		$('#pusherChat #members-list a').each(function(index, item) {
			if ($(item).hasClass('usertwinkling')) {
				needTwikle = true;
			}
		});
		if (needTwikle) {
           $('#pusherChat #membersContent').addClass('headtwinkling');
		} else {
		   $('#pusherChat #membersContent').removeClass('headtwinkling');
		}
	}
	
      /*-----------------------------------------------------------*
       * some css tricks
       *-----------------------------------------------------------*/ 
      $('#pusherChat .scroll').css({
          'max-height':$(window).height()/2
      })               

      $('#pusherChat .chatBoxWrap').css({
          'width':$(window).width() -  $('#membersContent').width()-30 
      })           

      $(window).resize(function(){
          $('#pusherChat .scroll').css({
              'max-height':$(window).height()/2
          });
  
          $('#pusherChat .chatBoxWrap').css({
              'width':$(window).width() -  $('#membersContent').width() -30
          }) 
          updateBoxPosition();
      });

}]);

//控制台的进度条模板
var ctrlProgressTemplate='<div class="ngCellText" ng-class="col.colIndex()"><div class="progress progressgray" style="margin-top:0;">' + 
                     '<div class="progress-bar progress-bar-success progress-bar-striped"  role="progressbar" aria-valuenow="{{row.entity[col.field] | number:2}}" aria-valuemin="0" aria-valuemax="100" style="width: {{row.entity[col.field] | number:2}}%">' + 
                     '<span>{{row.entity[col.field] | number:2}}%</span>' + 
                     '</div>' + 
                     '</div></div>';