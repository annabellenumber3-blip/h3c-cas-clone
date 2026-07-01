routeApp.controller('CloudResourceCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate,UtilService, HttpService, GridService, CloudResourceService){
    /** 阿里服务器。 */
    var CLOUD_ALI = 1;
    /** CVM。 */
    var CLOUD_CVM = 2;
    /** VMware服务器。 */
    var CLOUD_VMWARE = 3;
    /** CIC。 */
    var CLOUD_CIC = 4;
    /** CloudOS。 */
    // TODO Cloud_CloudOS=5
    
    $scope.licenseVersion = {};
    
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
			}
		});
	}
	$scope.getLicenseInfo();
    //增加云资源（包括CVM,vCenter,CloundOS）
	$scope.addCloudResource = function(){
	    CloudResourceService.addCloudResource();
	};
	//增加CVM资源
	$scope.addCvm=function(){
	    CloudResourceService.addCloudResource(CLOUD_CVM);
	};
	//增加vCenter资源
	$scope.addVcenter=function(){
        CloudResourceService.addCloudResource(CLOUD_VMWARE);
	};
	//刷新列表
	$scope.refreshCloudResList=function(){
        $scope.refreshPage();
	};
	
	$scope.$on(constant.onRefreshCloudNode, function(event, msg) {
		$scope.refreshCloudResList();
    });
	//	云资源面板中的列表
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, cellTemplate:titleTemplate, width:'15%'},
                  { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, cellTemplate:titleTemplate, width:'30%'},
                  { field: 'flag', displayName: $translate.instant('common.type'), sortable: true, width:'10%',cellFilter:"cloudType"},
                  { field: 'uri', displayName: $translate.instant('ip'), sortable: true, width:'15%'},
                  { field: 'userName', displayName: $translate.instant('username'),sortable: true, width:'10%'},
                  { field: 'oper', visible: $scope.hostVswitchMgr, displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
                 	 '<div><div class="ngCellButton">'
                 	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="CVM_MNG_EDIT" ng-click="edit(row.entity)" custom-title="'+$translate.instant('cloudResource.modifyCR')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="CVM_MNG_DELETE" ng-click="del(row.entity)" custom-title="'+$translate.instant('cloudResource.deleteCR')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="CVM_MNG_VIEW" ng-click="view(row.entity)" custom-title="'+$translate.instant('cloudResource.viewCR')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-remote-login-gray" has-permission="CVM_MNG_LOGIN" ng-if="row.entity.flag == 2" ng-click="login(row.entity)" custom-title="'+$translate.instant('login')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-res-auth-gray" has-permission="CVM_MNG_GRANT" ng-click="resourceAssignMng(row.entity)" custom-title="'+$translate.instant('cloudResource.resourceAssignMng')+'"></div>'
                 	 +'</div></div>'
                  }
                 ];

	GridService.grid($scope, 'cloud/cloudList',null,null,null,"cloudResourceListDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
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
	        enablePaging: true,
	        showFooter: true,
	        i18n: $translate.instant('load.static.lang'),
	        totalServerItems: 'totalServerItems',
	        filterOptions: $scope.filterOptions,
	        pagingOptions: $scope.pagingOptions,
	        columnDefs:column,
	        rowTemplate: doubleClickTemplate    // 双击行模板
	};
	// 跳转函数
	$scope.jump = function(entity) {
		// 广播导航节点选中事件
		if(entity.flag == 2){
			selectTreeNode($scope, 'main.cvmResource', 'cvm', 'list', entity.id);
		} else if(entity.flag == 3){
			selectTreeNode($scope, 'main.vmware', 'vmware', 'list', entity.id);
		}
    };
    //修改云资源，type操作类型，modify-修改 add-增加 
    $scope.edit=function(rowObj){
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{flag:function(){return rowObj.flag;},
                     id:function(){return rowObj.id;},
                     type:function(){return "modify";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
    };
    //查看云资源
    $scope.view=function(rowObj){
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
    //删除
    $scope.del=function(rowObj){
    	var type="";
    	if(rowObj.flag==2){
    		type=$translate.instant("cloudResource.deleteCvm");
    	}else if(rowObj.flag==3){
    		type=$translate.instant("cloudResource.deleteVcenter");
    	}		
    	var modalInstance = UtilService.confirm($translate.instant("cloudResource.confirmDel")+type+'\"'+rowObj.name+'\"?', type);	
    	modalInstance.result.then(function(){
    		var waitModal = UtilService.areawait("cloudResourceListDivId");
			$http({
				method : 'DELETE',
				url    : 'cloud/delete',
				params : {name:rowObj.name, cloudId:rowObj.id}
			}).success(function(result) {
				UtilService.dismissAreawait(waitModal);
				$scope.refreshPage();
				UtilService.handleResult(result);
			}).error(function(response, code, headers, config) {
				UtilService.dismissAreawait(waitModal);
				UtilService.handleError(code);
			});
    	},function(){});
    };
    
    // 单点登录
    $scope.login = function(rowObj){
		$http.get("cloud/getInfo?cloudId=" + rowObj.id).success(function(result){
			var turnForm = document.createElement("form");   
	    	//一定要加入到body中！！   
	    	document.body.appendChild(turnForm);
	    	turnForm.name = "casLogin";
	    	turnForm.method = "post";
	    	turnForm.action = result.data.protocal + "://" + result.data.uri + ":" + result.data.port;
	    	turnForm.target = "_blank";
	    	//创建隐藏表单
	    	var username = UtilService.encryptByDES(result.data.userName);
	    	var userNameElement = document.createElement("input");
	    	userNameElement.setAttribute("name", "name");
	    	userNameElement.setAttribute("type", "hidden");
	    	userNameElement.setAttribute("value", username);
	    	turnForm.appendChild(userNameElement);
	    
	    	var passwordElement = document.createElement("input");
	    	passwordElement.setAttribute("name", "password");
	    	passwordElement.setAttribute("type", "hidden");
	    	passwordElement.setAttribute("value", result.data.password);
	    	turnForm.appendChild(passwordElement);
	    	
	    	var loginTypeElement = document.createElement("input");
	    	loginTypeElement.setAttribute("name", "loginType");
	    	loginTypeElement.setAttribute("type", "hidden");
	    	loginTypeElement.setAttribute("value", "cic");
	    	turnForm.appendChild(loginTypeElement);
	    
	    	var encryptElement = document.createElement("input");
	    	encryptElement.setAttribute("name", "encrypt");
	    	encryptElement.setAttribute("type", "hidden");
	    	encryptElement.setAttribute("value", "true");
	    	turnForm.appendChild(encryptElement)
	    	
	    	turnForm.submit();  
		});
    }
    
    //资源授权管理
    $scope.resourceAssignMng=function(rowObj){
   	 	var modalInstance = $modal.open({
		  templateUrl: 'html/modal/cloudResource/assignAuthority.html',
		  controller: 'resourceManCtrl',
		  backdrop:'static',
		  size:'mg',
		  resolve: {
			  entry: function(){	
				  return rowObj;
			  }
		  }

   	 	});
   	 	modalInstance.result.then(function (selectedItem) {
   	 	}, function () {
   	 	});
    };
});
//增加CVM资源//增加云资源
routeApp.controller('addPublicCloudCtrl',function($rootScope, $scope, $state, $http,$modalInstance, $timeout, $translate,flag, id,type,UtilService, HttpService){
	$scope.cloudResource = {};
	$scope.cloudResource.id = id;
	// $scope.cloudResource.protocal = constant.HTTP;
    // $scope.title = $translate.instant("cloudResource.addCvm");
    // $scope.alert = $translate.instant("cloudResource.addCvmAlert");
		$scope.title = $translate.instant("cloudResource.addVcenter");
		$scope.alert = $translate.instant("cloudResource.addVcenterAlert");
		$scope.cloudResource.protocal = constant.HTTPS;
		$scope.cloudResource.port = 443;
    // $scope.cloudResource.protocal = constant.HTTP;
		// $scope.cloudResource.port = 8080;
    $scope.type = type;
	//云资源类型//外部云资源类型flag---type
    $scope.cloudResourceType = {
        options:[
					// {value:constant.PUBLIC_CLOUD_CVM, label:$translate.instant('cloudResource.cvmResource')},
	             {value:constant.PUBLIC_CLOUD_VMWARE, label:$translate.instant('cloudResource.vCenterResource')}]
//	             {value:constant.PUBLIC_CLOUD_OS, label:$translate.instant('cloudResource.cloudOSResource')}]
    };
    //增加时，设置默认提示信息、协议和端口
    if (angular.isDefined(flag) && flag != null){
        $scope.cloudResource.type = flag;
      //修改时根据CloudID来查询数据
        $scope.getData = function(cloudId){
        	$http.get("cloud/getInfo?cloudId=" + id).success(function(result){
    			$scope.cloudResource.name = result.data.name;
    			$scope.cloudResource.description = result.data.description;
    			$scope.cloudResource.type = result.data.flag;
    			$scope.cloudResource.uri = result.data.uri;
    			$scope.cloudResource.userName = result.data.userName;
    			var pwd = result.data.password;
    			pwd = UtilService.decryptByDES(pwd);
    			$scope.cloudResource.password = pwd;
    			$scope.cloudResource.port = result.data.port;
    			$scope.cloudResource.protocal = result.data.protocal;
    		});
        }
        //修改时，查询数据根据云资源类型修改标题和描述
        if (type != 'add'){
        	$scope.getData(id);
        	if ($scope.cloudResource.type === constant.PUBLIC_CLOUD_CVM){
        		$scope.title = $translate.instant("cloudResource.modifyCvm");
        		$scope.alert = $translate.instant("cloudResource.addCvmAlert");
        	} else if ($scope.cloudResource.type === constant.PUBLIC_CLOUD_VMWARE){
        		$scope.title = $translate.instant("cloudResource.modifyVcenter");
    		    if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
    			    $scope.alert = $translate.instant("cloudResource.addVcenterAlert_unis");
    		    } else {
    			    $scope.alert = $translate.instant("cloudResource.addVcenterAlert");
    		    }
        	} else if ($scope.cloudResource.type === constant.PUBLIC_CLOUD_OS){
        		$scope.title = $translate.instant("cloudResource.modifyCloudOS");
        		$scope.alert = $translate.instant("cloudResource.addCloundOSAlert");
        	}
        }
    } else {
    	$scope.cloudResource.type = constant.PUBLIC_CLOUD_VMWARE;
    	$scope.alert = $translate.instant("cloudResource.addCvmAlert");
			$scope.cloudResource.port = 443;
    }
    
    //检查云资源类型变化情况，根据云资源类型，显示相应的提示信息--标题/描述/登录方式
    $scope.$watch('cloudResource.type',function(newValue,oldValue){
    	if (newValue != oldValue) { 
//    		$scope.changeAlertAndProtocol($scope.cloudResource.type);
    		if ($scope.cloudResource.type === constant.PUBLIC_CLOUD_CVM){
    			//设置默认协议、端口号、标题、描述
        		$scope.cloudResource.protocal = constant.HTTP;
        		$scope.cloudResource.port = 8080;
    			$scope.title = $translate.instant("cloudResource.addCvm");
    			$scope.alert = $translate.instant("cloudResource.addCvmAlert");
    		} else if ($scope.cloudResource.type === constant.PUBLIC_CLOUD_VMWARE){
    			//issues 201606200259,change the default login way and port on adding vCenter
    			//设置默认协议、端口号、标题、描述
    			$scope.title = $translate.instant("cloudResource.addVcenter");
        		$scope.cloudResource.protocal = constant.HTTPS;
        		$scope.cloudResource.port = 443;
    			if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
    				$scope.alert = $translate.instant("cloudResource.addVcenterAlert_unis");
    			} else {
    				$scope.alert = $translate.instant("cloudResource.addVcenterAlert");
    			}
    		} else if($scope.cloudResource.type === constant.PUBLIC_CLOUD_OS){
    			//增加CloudOS云资源
    			//设置默认协议、端口号、标题、描述
        		$scope.cloudResource.protocal = constant.HTTP;
        		$scope.cloudResource.port = 9000;
    			$scope.title = $translate.instant("cloudResource.addCloudOS");
    			$scope.alert = $translate.instant("cloudResource.addCloundOSAlert");
    		}
		}
	});
    //监听协议，同步更新端口
    $scope.$watch('cloudResource.protocal',function(newValue,oldValue){
    	if (newValue != oldValue) { 
    		if($scope.cloudResource.type == constant.PUBLIC_CLOUD_CVM){
    			if ($scope.cloudResource.protocal == constant.HTTP) {
		            $scope.cloudResource.port = 8080;
		        } else {
		        	// 修改问题单201605300138 修改端口号显示 add by z10350 2016.5.31
		            $scope.cloudResource.port = 8443;
		        }
    		} else if($scope.cloudResource.type == constant.PUBLIC_CLOUD_VMWARE){
    			if ($scope.cloudResource.protocal == constant.HTTPS) {
		            $scope.cloudResource.port = 443;
		        } else {
		        	// 修改问题单201605300138 修改端口号显示 add by z10350 2016.5.31
		            $scope.cloudResource.port = 80;
		        }
    		} else if($scope.cloudResource.type == constant.PUBLIC_CLOUD_OS){
    			if ($scope.cloudResource.protocal == constant.HTTP) {
		            $scope.cloudResource.port = 9000;
		        } else {
		        	// 修改问题单201605300138 修改端口号显示 add by z10350 2016.5.31
		            $scope.cloudResource.port = 8443;
		        }
    		}
		}
	});
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && $scope.form.$valid) {
            $scope.ok();
        }
    };
	$scope.ok=function(){
		var data = angular.copy($scope.cloudResource);
		//将flag赋值为类型type，否则为空dongmei
		data.flag = $scope.cloudResource.type;
		data.password = UtilService.encryptByDES(data.password);
	    HttpService.post('cloud/addOrModify', data, $modalInstance);
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
});
//【云资源】/查看CVM资源dongmei
routeApp.controller('viewCloudCtrl',function($scope, $state, $http,$modalInstance, $translate, flag,id,UtilService, HttpService){
	$scope.cloudResource = {};
	if (angular.isDefined(flag)){
	    //修改问题单：201605160273  增加vcenter云资源查看处理
		if (flag===constant.PUBLIC_CLOUD_CVM){
			$scope.title = $translate.instant("cloudResource.viewCvm");
		} else if (flag===constant.PUBLIC_CLOUD_VMWARE){
			$scope.title = $translate.instant("cloudResource.viewVcenter");
		} else if (flag===constant.PUBLIC_CLOUD_OS){
			//增加查看CloudOS
			$scope.title = $translate.instant("cloudResource.viewCloudOS");
		}
		$http.get("cloud/getInfo?cloudId=" + id).success(function(result){
            $scope.cloudResource.name = result.data.name;
            $scope.cloudResource.description = result.data.description;
            $scope.cloudResource.uri = result.data.uri;
            $scope.cloudResource.userName = result.data.userName;
            $scope.cloudResource.port = result.data.port;
            $scope.cloudResource.protocal = result.data.protocal;
        });
	}
	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//【云资源】/资源授权管理控制器
routeApp.controller('resourceManCtrl',function(entry, $scope, $http, $modal,$translate, $modalInstance, UtilService, HttpService) {
 $scope.hp={};
 $scope.hp.srcGroup="";
 $http({
     method  : 'GET',
     url     : 'cloud/queryPermision',
     params:{cloudId:entry.id}
 }).success(function(result) {
	   if (result.success == true) {
		   $scope.hp.srcGroup= result.data.groupName;
	   }
 }).error(function(response, code, headers, config) {
	 UtilService.handleError(code);
 });
 $scope.selOperatorGroup=function(){
	 var groupInstance = UtilService.lgmodal('html/modal/common/operatorGroupSelector.html', 'operatorGroupSelectCtrl');
     groupInstance.result.then(function () {
     }, function (reason) {
        if (angular.isDefined(reason) && reason != 'cancel') {
           // 点击了确定按钮
           $scope.hp.id = reason.id;
           $scope.hp.newGroup=reason.name;
        };
     });
 };
  
  $scope.ok=function(){
  	var url = 'cloud/modifyPermision?cloudId='+entry.id+ "&groupId=" +  $scope.hp.id;
  	HttpService.put(url, {}, $modalInstance);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

// 【云资源】-【cvm云资源】
routeApp.controller('cvmCloudResourceCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate,UtilService, HttpService, GridService){
	$scope.resource = {};
	$scope.resource.id = $scope.entryId;
	$scope.resource.name = $scope.entryName;
	
	
	$scope.$on('onCloudNodeChange', function(envent, msg) {
		if (msg.type == 'update') {
			if ($scope.resource.id = msg.entryId) {
				$scope.resource.name = msg.text;
			}
		} 
	});
	
});

//云资源概要(dashboard)
routeApp.controller('cvmCloudResourceOverviewCtrl',['$scope','$http','$timeout', '$translate','EchartService',
   function($scope, $http, $timeout, $translate, EchartService) {
	  var cloudId = $scope.entryId;
	  $scope.dc ={};
	  $http.get("dc/queryDcSummary?cloudId=" + cloudId).success(function(result){
		  var data = result.data;
		  if(angular.isArray(data) && data.length >0){
			  $("#dc-hostpool").text(data[0].value);
			  $("#dc-host").text(data[1].value);
			  $("#dc-cpuCount").text(data[2].value);
			  $("#dc-totalMemory").text(data[3].value);
			  $("#dc-totalStorage").text(data[4].value);
			  $("#dc-usableStorage").text(data[5].value);
			  $("#dc-vm").html(desc_vm_status(data[6].total, data[6].run, data[6].shutoff));
			  $("#dc-density").text(data[7].value);
		  }
	  })
//	  var hostCircleHeight = $("#hostCircle").outerHeight(true);
//	  $("#hostCircle").css("height", Number(hostCircleHeight) - Number(62));
	  var noDataText = $translate.instant('common.noData');
	  var hostCpuTop5Chart  = echarts.init(document.getElementById("hostCpuTop5Chart"));
	  var hostMemoryTop5Chart = echarts.init(document.getElementById("hostMemoryTop5Chart"));
	  var hostCircle = echarts.init(document.getElementById("hostCircle"));
	  var vmCpuTop5Chart = echarts.init(document.getElementById("vmCpuTop5Chart"));
	  var vmMemoryTop5Chart = echarts.init(document.getElementById("vmMemoryTop5Chart"));
	  
	  $scope.execFunction = function() {
		  // top5主机CPU
		  EchartService.hostTop5Cpu("dc/queryHostCpuRate?cloudId=" + cloudId, hostCpuTop5Chart, noDataText, 'hostCpuTop5Chart');
		  // Top5主机内存
		  EchartService.hostTop5Mem("dc/queryHostMemoryRate?cloudId=" + cloudId, hostMemoryTop5Chart, noDataText, 'hostMemoryTop5Chart');
		  // 获取主机状态
		  EchartService.getHostStatus("dashboard/host?cloudId=" + cloudId, hostCircle);
		  //top5 虚拟机cpu 嵌套圆环
		  EchartService.vmTop5CpuFiveCricle("dc/queryVirtualHostCpuRate?cloudId=" + cloudId, vmCpuTop5Chart, noDataText, 'vmCpuTop5Chart');
		  // top5虚拟机内存
		  EchartService.vmTop5Mem("dc/queryVirtualHostMemoryRate?cloudId=" + cloudId, vmMemoryTop5Chart, noDataText, 'vmMemoryTop5Chart');
	  }
	  
	  $scope.execFunction();
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
	  
	  $scope.$on(constant.onNavClick, function(){
		  $scope.cloudResourceResizeFun();
	  })
	  
      var intervalFunc = setInterval(function(){$scope.execFunction()}, $scope.cycle);
      
      $scope.$on("$destroy", function() {
			clearInterval(intervalFunc);
			intervalFunc = undefined;
			$(window).off('resize', $scope.cloudResourceResizeFun);
			//销毁echarts实例
			EchartService.dispose(hostCpuTop5Chart, hostMemoryTop5Chart, hostCircle, vmCpuTop5Chart, vmMemoryTop5Chart);
	  }
	);
	  
}]);

//云资源主机
routeApp.controller('CvmCloudResourceHostCtrl',['$scope','$http','$timeout', '$translate', 'GridService',
   function($scope, $http, $timeout, $translate, GridService) {
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'15%',cellTemplate:titleTemplate},
	              { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'12%',cellTemplate:hoststatusTemplate($translate)},
	              { field: 'summary', displayName: $translate.instant('vm.domainOverview'), sortable: true, width:'15%',cellTemplate:vmSummaryTemplate},
	              { field: 'cpuRate', displayName: $translate.instant('host.hostcpuRate'), sortable: true, width:'15%', cellTemplate:progressTemplate},
	              { field: 'memRate', displayName: $translate.instant('host.hostMemRate'), sortable: true, width:'15%', cellTemplate:progressTemplate},
	              { field: 'storage', displayName: $translate.instant('host.diskCapacity'), sortable: true, width:'13%',cellFilter:'byteUnitRender'},
	              { field: 'platform', displayName: $translate.instant('host.platform'), sortable: true, width:'15%',cellTemplate:titleTemplate}
	              ]
    $scope.mySelections = [];
    var params = {};
    var url = "dc/" + $scope.entryId + "/host";
    $scope = GridService.grid($scope, url, params, null, null, 'cvmHostListDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    listenNavClick($scope, $timeout);
    
    $scope.gridOptions = {
          data: 'myData',
          jqueryUITheme: false,
          jqueryUIDraggable: false,
          selectedItems: $scope.mySelections,
          showGroupPanel: false,
          showColumnMenu: true,
          multiSelect: false,
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
    //刷新主机列表
    $scope.refreshHostList = function() {
       $scope.refreshPage();
    };
	  
}]);

//云资源虚拟机
routeApp.controller('CvmVmListController',['$scope','$http','$timeout', '$translate', 'GridService', 'UtilService', 'HttpService','DomainService','$modal',
   function($scope, $http, $timeout, $translate, GridService, UtilService, HttpService, DomainService,$modal) {
	 //刷新虚拟机列表
    $scope.refreshVmList = function() {
        var msg = {title: $scope.vmListTitle};
        $scope.$broadcast(constant.onRefreshVmListData, msg);
    };
    //搜索框
    $scope.$watch('vmListTitle', function(newValue, oldValue) {
        if (newValue != oldValue) {
            //设置时间间隔
            if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
                $timeout.cancel($scope.keyInterval);
            }
            $scope.keyInterval = $timeout(function() {
                var msg = {title: newValue, pageOne:true};
                $scope.$broadcast(constant.onRefreshVmListData, msg);
            }, constant.keyInterval);
        }
    });
    
    $scope.$on("$destroy", function() {//scope销毁时，销毁定时器
        if (angular.isDefined($scope.keyInterval)) {
            $timeout.cancel($scope.keyInterval);
        }
    });
    
    //手工同步
    $scope.syncResource = function() {
        var operateInfo = {type:"CVM",name:$scope.entryName};
        var syncInstance = UtilService.confirm($translate.instant('cloudResource.syncResourceConfirm', operateInfo),$translate.instant('operConfirm'));
        syncInstance.result.then(function (selectedItem) {
            HttpService.put('cloud/'+ $scope.entryId +'/resource/sync');
        }, function () {
        });
    }
    
    //注册刷新事件
    $scope.$on(constant.onRefreshCvmVmList, function(event, msg) {
    	if (msg == $scope.entryId) {
    		$scope.refreshVmList();
    	}
    });
    
    //界面定制按钮
    $scope.uicustom = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/common/uicustom.html',
            controller: 'uicustomCtrl',
            width:'900PX',
            WINDOWCLass: "editvm-dialog",
            backdrop: 'static',
	        resolve: {
	            data: function () {
	            	return {type:"main.cvmResource.vm"};
	            }
	       }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    };
    
    //--------------------------- 批量操作 --------------------
    $scope.batchOperateVm = function(operType) {
        var msg = {type: operType};
        $scope.$broadcast('onBatchOper', msg);
    };
}]);


//云资源虚拟机模板
routeApp.controller('CvmTemplateListCtrl',['$scope','$http','$timeout', '$translate', 'GridService', 'UtilService', 'HttpService','$state',
   function($scope, $http, $timeout, $translate, GridService, UtilService, HttpService,$state) {
	var column = [{ field: 'title', displayName: $translate.instant('common.name'), sortable: true, width:'10%',cellTemplate:titleTemplate},
	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'15%',cellTemplate:titleTemplate},
	              { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'10%'},
	              { field: 'memory', displayName: $translate.instant('template.memory'), cellFilter:'memory', sortable: true, width:'15%'},
	              { field: 'storageCapacity', displayName: $translate.instant('template.storage'),cellFilter:'byteUnitRender', sortable: true, width:'15%'},
	              { field: 'createDate', displayName: $translate.instant('template.createTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'16%'},
	              { field: 'system', displayName: $translate.instant('common.os'), cellFilter:'system', sortable: true, width:'15%'}
	              ];
    var url = "template/list";
	var params = {};
	params.cloudId = $scope.entryId;
    $scope = GridService.grid($scope, url, params, null, null, 'templateDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    listenNavClick($scope, $timeout);
    
    // 选中行的数组
    var selectedRow = new Array();
    // 默认选中第一行，如果已经有选择的元素则继续选中。
    selectFirstLine($scope, selectedRow, 'uniqueKey');
    
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
          enablePaging: true,
          showFooter: true,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          rowTemplate: doubleClickTemplate,    //双击行模板
          columnDefs:column,
          beforeSelectionChange: function (rowItem, event) {
              return beforeSelectionChange(rowItem, event);
          },
          afterSelectionChange: function (rowItem, event) {   // 选中事件完成后触发
              if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {     // 在点击时，因为会有原来行与新选中行，这里只需要新选中行。
            	  selectedRow.splice(0, selectedRow.length, rowItem.entity);
                  var rowObj = rowItem.entity;
                  $scope.queryTemplateDetails(rowObj);
              }
          }
    };
    //刷新模板列表
    $scope.refreshTemplateList = function() {
       if ($scope.myData.length==1) {
           $scope.mySelections.splice(0, $scope.mySelections.length);
       }
       $scope.refreshPage();
    };
    //手工同步虚拟机模板
    $scope.syncResource = function() {
        var operateInfo = {type:"CVM",name:$scope.entryName};
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
        var detailUrl = 'template/details';
        var detailParam = {
                vmId:row.id,
                cloudId:$scope.entryId
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
                   { field: 'name', displayName: $translate.instant('template.netname'), sortable: true, width:'15%'},
                   { field: 'vlan', displayName: $translate.instant('template.vlanType'), sortable: true, width:'10%'},
                   { field: 'outAvgBand', displayName: $translate.instant('template.outBandwidthLimit'), sortable: true, width:'20%'},
                   { field: 'inAvgBand', displayName: $translate.instant('template.inBandwidthLimit'), sortable: true, width:'20%'},];
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
    var column3 = [{ field: 'device', displayName: $translate.instant('template.devName'), sortable: true, width:'25%',cellTemplate:titleTemplate},
                   { field: 'targetBus', displayName: $translate.instant('template.busType'), sortable: true, width:'25%',cellTemplate:titleTemplate},
                   { field: 'storeFile', displayName: $translate.instant('template.volName'), sortable: true, width:'35%',cellTemplate:titleTemplate},
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

//云资源网络策略模板
routeApp.controller('NetStrategyListCtrl',['$scope','$http','$timeout', '$translate', 'GridService', 'UtilService', 'HttpService',
   function($scope, $http, $timeout, $translate, GridService, UtilService, HttpService) {
	// 权限信息
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'13%',cellTemplate:titleTemplate},
                  { field: 'vlan', displayName: 'VLAN ID', sortable: true, width:'10%'},
                  { field: 'aclName', displayName: $translate.instant('netstrategy.acl'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'netLimitTitle', displayName: $translate.instant('netstrategy.netLimitTitle'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'vnetPriority', displayName: $translate.instant('netstrategy.netPriority'), cellFilter:'priority', sortable: true, width:'7%'},
                  { field: 'inAvgBandwidth', displayName: $translate.instant('netstrategy.inAvgBandwidth'), cellFilter: 'kbps', sortable: true, width:'10%'},
                  { field: 'inBurstSize', displayName: $translate.instant('netstrategy.inBurstSize'), cellFilter: 'KBytes', sortable: true, width:'10%'},
                  { field: 'outAvgBandwidth', displayName: $translate.instant('netstrategy.outAvgBandwidth'), cellFilter: 'kbps', sortable: true, width:'10%'},
                  { field: 'outBurstSize', displayName: $translate.instant('netstrategy.outBurstSize'), cellFilter: 'KBytes', sortable: true, width:'10%'}
//                  { field: 'oper', visible:$scope.netStrategyMgr, displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
//                 	 '<div><div class="ngCellButton">'
//                	  +'<div type="button" class="btn btn-sm-icon icon-release-template-gray" ng-click="releaseNetStrategy(row.entity)" custom-title="'+$translate.instant('netstrategy.release')+'"></div>'
//                 	 +'</div></div>'
//                   }
                 ]
	var url = 'network/' + $scope.entryId + '/list';
	$scope = GridService.grid($scope, url, null, null, null, 'netStrategyDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//    $scope.getDataAsync();
//    $scope.listStyle = $scope.gridStyle();
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
          enablePaging: true,
          showFooter: true,
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          rowTemplate: doubleClickTemplate,    //双击行模板
          columnDefs:column
    };
    
    //刷新模板列表
    $scope.refreshNetStrategyList = function() {
       $scope.refreshPage();
    };
//    组织逻辑修改,准备删除
//    //发布网络策略模板
//    $scope.releaseNetStrategy = function(row) {
//    	var resolve = {
//			id : function() {
//				return row.id;
//			},
//			cloudId : function(){
//				return $scope.entryId;
//			},
//			url : function(){
//				return 'org/profile/unreleasedOrg';
//			},
//			title : function(){
//				return $translate.instant('netstrategy.orgTempNoRlease', {"name":row.name});;
//			}
//		};
//		var modalInstance=UtilService.lgmodal("html/modal/common/selectOrg.html","SelOrgCtrl", resolve);
//		modalInstance.result.then(function(selectedItem){
//			if (angular.isDefined(selectedItem)) {
//				var param = {};
//				param.cloudId = $scope.entryId;
//				param.id = row.id;
//				param.orgIds = new Array();
//				for (var i = 0; i < selectedItem.length; i ++) {
//					param.orgIds.push(selectedItem[i].id);
//				}
//				HttpService.post('network/releaseToOrg', param, undefined, $scope.refreshPage(), $scope.refreshPage());
//			}
//		},function(reason){
//		});
//    }
}]);
//虚拟机列表内的iPv4属性详细信息弹窗
routeApp.controller('viewIpv4AttrsListCtrl',function($scope, $http, $modal, $translate, $modalInstance,ipv4Obj, UtilService,GridService) {
	var macTemplate='<div><div class="ngCellText"></div></div>';	// mac列数据隐藏
	var column=[  { field: 'mac', displayName: $translate.instant('uicustomVm.mac') , sortable: false, width:'34%',cellTemplate:macTemplate},
	              { field: 'ipAddr', displayName: $translate.instant('uicustomVm.ip') ,sortable: false, width:'33%'},
	              { field: 'mask', displayName: $translate.instant('uicustomVm.mask') ,sortable: false, width:'33%'}];
	$scope.tempObj=[];
	if(ipv4Obj){
		var i=j=0;
		for(var a in ipv4Obj){
			for(j=0;j<(ipv4Obj[a]).length;j++){
				$scope.tempObj[i+j]={};
				$scope.tempObj[i+j].mac=(ipv4Obj[a])[j].mac;
				$scope.tempObj[i+j].ipAddr=(ipv4Obj[a])[j].ipAddr;
				$scope.tempObj[i+j].mask=(ipv4Obj[a])[j].mask;
			}
			i+=j;
		}
	}
	$scope.myData=$scope.tempObj;
	var aggregateTemplate = '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" style="cursor:pointer;" class="ngAggregate">' +
							'<div class="{{row.aggClass()}}"></div><div style="margin-left:30px;margin-top:5px;"><span><span ng-if="row.label==\'null\'"></span><span ng-if="row.label!=\'null\'">{{row.label}}</span>'+
							'<span>({{row.totalChildren()}}{{"item"|translate}})</span></div></span></div>';
	// 创建表格
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
      groups:['mac'],
      groupsCollapsedByDefault:false,
      aggregateTemplate:aggregateTemplate,
      i18n: $translate.instant('load.static.lang'),
      totalServerItems: 'totalServerItems',
      filterOptions: false,
      pagingOptions: false,
      columnDefs:column
  	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
/**
 * @description 云资源虚拟机列表controller.
 */ 
routeApp.controller('VmListCtrl',function($scope, $rootScope, $http, $modal, $translate, $state, $timeout, $compile, UtilService, GridService, DomainService, HttpService) {
	$scope.$on(constant.onReloadVmList, function (event, msg) {
		if (angular.isObject(msg)) {
	        $scope.params.title = msg.title;
	    }
		//批量操作以后刷新界面时，获取搜索框的搜索条件进行界面刷新
		if ($scope.params.title == undefined && $scope.params.title == null) {
			$scope.params.title = $scope.vmListTitle;
		}
		
	    $timeout(function() {
	        $scope.gridOptions = undefined;
	        $scope.refreshAllGrid();
	    });
	});
	$scope.$on(constant.onRefreshVmListData, function(event, msg) {
		if (angular.isObject(msg)) {
	        $scope.params.title = msg.title;
	        if (msg.pageOne) {
	        	$scope.pagingOptions.currentPage = 1;
	        }
	    }
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
		$scope.refreshPage();
	});
	
	$scope.getVmGirdTitle=function(dataArr) {
		var col=[];// 需要显示的列
		var ipv4Template='<div><div class="ngCellText">'
      	  +'<a href="javascript:void(0)" ng-click="viewIpv4Details(row.entity)">{{row.entity[col.field]}}</a>'
    	  +'</div></div>';
		var castoolsStatusTemplate = '<div><div class="ngCellText"><span ng-if="row.entity[col.field] ==  \'noRunning\'" translate="common.noRunning"></span>' +
		  '<span ng-if="row.entity[col.field] == \'running\'" translate="common.running"></span>' +
		  '<span ng-if="row.entity[col.field] == \'--\'"  translate="--"></span>' +
		  '</div></div>';
		var antivirusTemplate = '<div><div class="ngCellText"><span ng-if="row.entity[col.field] == 0" translate="common.unable"></span>' +
        '<span ng-if="row.entity[col.field] == 1" translate="common.enable"></span>' +
        '</div></div>';
		var gridWidth=$("div.cas-list-body").width(),widthSum=25;	//25px是复选框列所占的宽度
        for (var i = 0; i < dataArr.length; i++) {
        	var obj = {};
        	obj.sortable = true;
        	if (dataArr[i].id == "castoolsStatus") {
        		obj.field = "castools";
			 } else {
        	obj.field = dataArr[i].id;
			 }
        	obj.displayName = dataArr[i].name;
        	obj.width = dataArr[i].width +"px";
        	if(i==dataArr.length-1&&(widthSum+dataArr[i].width)<gridWidth){	//修改问题单201602270357，by kf6302
        		obj.width=(gridWidth-widthSum)+"px";
        		$scope.beyondScreen=false;		//列总宽小于列表本身的宽度，不需要横向滚动条
        	}else{
            	widthSum+=dataArr[i].width;
            	$scope.beyondScreen=true;
        	}
        	if (dataArr[i].id == '') {
        		
        	}
        	switch(dataArr[i].id) {
        	   case "mem":obj.cellFilter="memory";break;
        	   case "status":obj.cellTemplate = vmstatusTemplate($translate);break;
        	   case "cpuRate" : obj.cellTemplate = progressTemplate;break;
        	   case "memRate" : obj.cellTemplate = progressTemplate;break;
        	   case "system" : obj.cellTemplate = titleTemplate;break;
        	   case "iPv4Attributes" : obj.cellTemplate = ipv4Template;break;
        	   case "castoolsStatus" : obj.cellTemplate = castoolsStatusTemplate;break;
        	   case "uptime" : obj.cellFilter = "uptime";break;
        	   case "desc": obj.cellTemplate = titleTemplate;break;
        	   case "title" : obj.cellTemplate = titleTemplate;break;
        	   case "antivirusConfig" : obj.cellTemplate = antivirusTemplate;break;
        	   case "name" : obj.cellTemplate = titleTemplate;break;
        	   default: break;
        	}
        	col.push(obj);
        }
        $scope.viewIpv4Details = function(rowEntity){
        	var modalInstance = $modal.open({
                templateUrl: 'html/modal/common/viewIpv4Attributes.html',
                controller: 'viewIpv4AttrsListCtrl',
//                size:"lg",
                backdrop: 'static',
                resolve: {
                    ipv4Obj: function() {
                   	 	return rowEntity.iPv4Data;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });
        };
        if (!angular.isObject($scope.params)) {
        	$scope.params = {};
        	$scope.params.id = $scope.id;
        }
        
        var url = $scope.queryurl;
        if (url == null || typeof url == 'undefined') {
            url = 'domain/list';
        }
        $scope.params.cloudId=$scope.entryId;
        //修改问题单:201801310542 刷新虚拟机列表支持保留当前页 w10450 2018-05-16
        var pagesizeArr = [10, 20, 30, 40 ,50, 100, 200];
        var pagesize = 30;
        var currentPage = 1;
        if ($scope.pagingOptions) {
            pagesizeArr = $scope.pagingOptions.pageSizes;
            pagesize = $scope.pagingOptions.pageSize;
            currentPage = $scope.pagingOptions.currentPage;
        }
        $scope = GridService.grid($scope, url, $scope.params, pagesizeArr, pagesize, 'cvmVmListDivId');
        //修改问题单:201801310542 刷新虚拟机列表支持保留当前页 w10450 2018-05-16
        $scope.pagingOptions.currentPage = currentPage;
        $scope.pagingOptions.pageSize = pagesize;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
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
                   enablePaging: true,
                   showFooter: true,
                   i18n: $translate.instant('load.static.lang'),
                   totalServerItems: 'totalServerItems',
                   filterOptions: $scope.filterOptions,
                   pagingOptions: $scope.pagingOptions,
                   columnDefs: col,
                   rowTemplate: doubleClickTemplate    // 双击行模板
         };
         $timeout(function(){
        	 if($scope.beyondScreen){	//列总宽大于列表本身的宽度，需要横向滚动条
            	 $("#cvmVmListDivId").find("div.ngViewport").css('overflow-x', 'auto');
        	 }
         })
        // 动态控制grid的宽和高
        $scope.listStyle = $scope.gridStyle();
        listenNavClick($scope, $timeout);
    };
    
    $scope.refreshAllGrid=function(){
		 var uiUrl=uiName=""; // 请求服务器的url
		 // 主机下的虚拟机界面定制
		 uiUrl='ui/params/virtualHostColTitle';
		 uiName="virtualHostColTitle";
//		 var params={};
//		 params.uiName="hostVirtualHostColTitle";
		 $http({
	         method:'GET',
	         url:uiUrl
	     }).success(function(data,status,headers,cfg){
	    	 $scope.tempAttrs=[];
	         for(var i=0;i<data.data.length;i++){
	             $scope.tempAttrs[i]={};
	             $scope.tempAttrs[i].field=data.data[i].id;
	             $scope.tempAttrs[i].displayName=data.data[i].name;
	             $scope.tempAttrs[i].widthVal=data.data[i].width;
	         }
	         $scope.getVmGirdTitle(data.data);
	         
	     }).error(function(response, code, headers, config) {
	         UtilService.handleError(code);
	     }); 		 
	};
	$scope.refreshAllGrid();
	
	$scope.rightClick = function(row, e) {
		if (e.which == 3 && row.selected == false) {// 1:left, 2:middle, 3:right
			// unselected all rows
			$scope.gridOptions.selectAll(false);
			// select right click row
            $scope.gridOptions.selectRow(row.rowIndex, true);
		}
	};
	$scope.$on('onBatchOper', function(event, msg) {
	    if ($scope.gridOptions.selectedItems.length == 0) {
	        // 如果选择数量不知，则弹出提示对话框
	        UtilService.alert($translate.instant('vm.vmSelectAlert'), $translate.instant('common.opertip'), false, 'error');
            return;
	    }
	    if (msg.type == 'batchStartVm') {
	        // 批量启动
	        DomainService.batchStartVm($scope.gridOptions.selectedItems, $scope.showTaskList);
	    }
	    if (msg.type == 'batchPauseVm') {
	    	// 批量暂停
	    	DomainService.batchPauseVm($scope.gridOptions.selectedItems, $scope.showTaskList);
	    }
        if (msg.type == 'batchResumeVm') {
            // 批量恢复
            DomainService.batchResumeVm($scope.gridOptions.selectedItems, $scope.showTaskList);
        }
        if (msg.type == 'batchRestartVm') {
            // 批量重启
            DomainService.batchRestartVm($scope.gridOptions.selectedItems, $scope.showTaskList);
        }if (msg.type == 'batchShutdownVm') {
            // 批量关闭
            DomainService.batchShutdownVm($scope.gridOptions.selectedItems, $scope.showTaskList);
        }
        if (msg.type == 'batchCloseVm') {
            // 批量关闭电源
            DomainService.batchCloseVm($scope.gridOptions.selectedItems, $scope.showTaskList);
        }
        if (msg.type == 'batchDeleteVm') {
            // 批量删除
            DomainService.batchDeleteVm($scope.gridOptions.selectedItems);
        }
        if (msg.type == 'batchUpgradeCastools') {
            // 批量升级Castools
            DomainService.batchUpgradeCastools($scope.gridOptions.selectedItems, $scope.showTaskList);
        }
	    if (msg.type == 'batchMigrateVm') {
	        // 批量迁移
	        DomainService.batchMigrateVm($scope.gridOptions.selectedItems);
	    }
	    if (msg.type == 'batchCreateRestorePoint') {
	        // 批量创建还原点
	        DomainService.batchCreateRestorePoint($scope.gridOptions.selectedItems, $scope.showTaskList);
	    }
	    if (msg.type == 'batchModifyVm') {
	    	// 批量修改虚拟机
	    	DomainService.batchModifyVm($scope.gridOptions.selectedItems);
	    }
	});
});
function desc_vm_status (total, run, shutoff) {
	var str = "<span class=\"span_padding\">" + total + "</span>" +
		"<span class=\"span_padding\">[</span>" +
		"<span class='span_padding' ><img class=\"pic1img\" src=\"css/img/gray/Icon_vm_running.svg\"></img></span>" +
		"<span class=\"span_padding span_color_green \">" + run + "</span>" +
		"<span class='span_padding' ><img class=\"pic1img\" src=\"css/img/gray/Icon_vm_close.svg\"></img></span>" +
		"<span class=\"span_padding span_color_red \">" + shutoff + "</span>" +
		"<span class=\"span_padding\">]</span>" ;
	return str;
}
//hdm
routeApp.controller('AntiVirusSoftwareCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate,UtilService, GridService,HttpService){
	var column = [{ field: 'fileName', displayName: $translate.instant('cloudSecurity.fileName'), sortable: true, width:'20%', cellTemplate: titleTemplate},
	              { field: 'vendor', displayName: $translate.instant('cloudSecurity.vendor') , cellFilter: 'antiVirusSoftwareVendor',sortable: true, width:'20%'},
                  { field: 'filePath', displayName: $translate.instant('cloudSecurity.filePath'), sortable: true, width:'20%', cellTemplate: titleTemplate},
                  { field: 'uploadStatus', displayName: $translate.instant('cloudSecurity.uploadStatus'), sortable: true, width:'20%', cellFilter: 'antiVirusSoftwareUploadStatus'},
                  { field: 'operation', displayName: $translate.instant('cloudSecurity.operation'), sortable: true, width:'20%', cellTemplate:
                  	 '<div><div class="ngCellButton">'
                  	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="ANTI_VIRUS_SOFTWARE_EDIT" ng-click="edit(row.entity)" custom-title="'+$translate.instant('cloudSecurity.modifyAntiVirus')+'"></div>'
                  	 +'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="ANTI_VIRUS_SOFTWARE_DELETE" ng-click="del(row.entity)" custom-title="'+$translate.instant('cloudSecurity.deleteAntiVirus')+'"></div>'
                  	 +'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="ANTI_VIRUS_SOFTWARE_INSTALL" ng-click="view(row.entity)" custom-title="'+$translate.instant('cloudSecurity.installAntiVirus')+'"></div>'
                  	+'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="ANTI_VIRUS_SOFTWARE_INSTALL" ng-click="upload(row.entity)" custom-title="'+$translate.instant('cloudSecurity.installAntiVirus')+'"></div>'
                  	 +'</div></div>'},
                 ];
	var url = 'antivirus/list';
	GridService.grid($scope, url, null, null, null, 'antiVirusSoftwareDiv');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
	        selectedItems: $scope.mySelections,
	        showGroupPanel: false,
	        showColumnMenu: true,
	        multiSelect: false,
	        showFilter: false,
	        enableCellSelection: false,
	        enableCellEditOnFocus: false,
	        enablePaging: true,
	        showFooter: true,
	        i18n: $translate.instant('load.static.lang'),
	        totalServerItems: 'totalServerItems',
	        filterOptions: $scope.filterOptions,
	        pagingOptions: $scope.pagingOptions,
	        columnDefs:column
	};
	listenNavClick($scope, $timeout);
	
	$scope.refresh = function() {
        $scope.refreshPage();
	}

	$scope.addAntiVirusSoftWare = function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/cloudSecurity/antivirusSoftware/addAntiVirusSoftware.html',
            controller: 'addAntiVirusSoftwareCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                operationType: function () {
                    return "add";
                 },
                 id: function() {
                 	return undefined;
                 },
                 entry: function () {
	                	return undefined;
	                }
            }
        });
	    modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
	    }, function (reason) {
	    });  

	}
	
	$scope.edit = function(rowObj){
		$http.get("antivirus/getInfo?Id=" + rowObj.id).success(function(result){
	        var modalInstance = $modal.open({
	            templateUrl: 'html/modal/cloudService/cloudSecurity/antivirusSoftware/addAntiVirusSoftware.html',
	            controller: 'addAntiVirusSoftwareCtrl',
	            size: 'lg',
	            backdrop: 'static',
	            resolve: {
	                operationType: function () {
	                    return "edit";
	                },
	                id: function() {
	                	return rowObj.id;
	                },
	                entry: function () {
	                	return result.data;
	                }
	            }
	        });
			modalInstance.result.then(function (selectedItem) {
	            $scope.refreshPage();
	        }, function (reason) {
	        });
	    });
	}
	$scope.del = function(rowObj){
		var modalInstance = UtilService.confirm($translate.instant("cloudSecurity.deletePatchPrompt", {fileName: rowObj.fileName}), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		var url = "antivirus/delete";
    		var params = {};
    		params.id = rowObj.id;
    		HttpService.delete(url, params, undefined, $scope.refreshPage);
    	}, function(){});
	}
	
});
//增加防病毒软件包
routeApp.controller('addAntiVirusSoftwareCtrl', function($scope, $http, operationType,$translate, $modal, $modalInstance,$timeout,entry, UtilService,HttpService) {
	$scope.isFirstPage = true;
	$scope.antiVirusSoftware = {};
	$scope.antiVirusSoftware.filePath = '/vms/';
    $scope.antiVirusSoftware.stepTitles = [ $translate.instant('cloudSecurity.antiVirusSoftwareStep1'),
                                            $translate.instant('cloudSecurity.antiVirusSoftwareStep2')];
    $scope.antiVirusSoftware.vendor = '1';
    $scope.operationType = operationType;
    $scope.antiVirusSoftwareType = {
            options:[{value:'1', label:$translate.instant('cloudSecurity.antiVirusSoftware_Trend')},
                     {value:'2', label:$translate.instant('cloudSecurity.antiVirusSoftware_360')}]
    }
    if (angular.isDefined(entry) && entry != null) {
    	$scope.antiVirusSoftware.id = entry.id;
    	$scope.antiVirusSoftware.filePath = entry.filePath;
    	$scope.antiVirusSoftware.vendor = entry.vendor;
    }
    $scope.antiVirusSoftware.valids = {
            stepOneOver : function() {
            	if ($('#form1').val() === "true"){
            		return true;
            	}
            	return false;
            },
            stepTwoOver : function() {
                if ($('#form2').val() === "true")
                    return true;
                return false;
            }
        };
    $scope.nextCallBack = {
    	"1" : function(){
    		$scope.isFirstPage=false;
    		//隐藏上一步按钮
    		$("#prevbutton").remove();
    		if (!isEmpty($scope.antiVirusSoftware.filePath)) {
        		var path = $scope.antiVirusSoftware.filePath.substring(0,5);
        		if (path.trim() != '/vms/') {
        			UtilService.error($translate.instant("cloudSecurity.invalidFilePath"));
        			return false;
        		}
    		}

        	$scope.stream.destroy();
        	$scope.stream = new Stream(config);
    		return true;
    	}
    }
    
    $scope.$watch('antiVirusSoftware.filePath',function(newValue,oldValue){
    	config.tokenURL = "antivirus/upload/tk?path=" + newValue;
    });
    
    var size = Math.pow(1024,3) * 200;
    var config = {
		    autoUploading : false, /**选择文件后是否自动上传**/
			customered : false, /**是否自定义ui**/
			autoRemoveCompleted : true, /**文件上传后是否移除，customered=false时有效**/
		    browseFileId : "i_select_files", /** 选择文件的ID, 默认: i_select_files */
		    browseFileBtn : $translate.instant('uploadfile.uploadisoBrowseFileBtn'), /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
			dragAndDropArea: "i_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
			dragAndDropTips: $translate.instant('uploadfile.uploadisoDragAndDropTips'), /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
			filesQueueId : "i_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
			filesQueueHeight : 314, /** 文件上传容器的高度（px）, 默认: 450 */
			messagerId : "i_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
			multipleFiles: false /** 多个文件一起上传, 默认: false */,
			retryCount : 2, /** HTML5上传失败的重试次数 */
			tokenURL : "antivirus/upload/tk?path=" + $scope.antiVirusSoftware.filePath, /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
			frmUploadURL : "antivirus/upload/fd;", /** Flash上传的URI */
			uploadURL : "antivirus/upload/upload", /** HTML5上传的URI */
			swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
			maxSize: size,/** 单个文件的最大大小200G，默认:2G */
			extFilters : ['.gz'], /**允许上传文件的类型**/
			checkFileName : false,/**对文件名检测是否允许输入特殊字符，默认为true*/
//			postVarsPerFile:{"path": row[0].path, "poolName" : row[0].title, "hostId" : hostId},  /**上传文件时传入的参数**/
			onNameRegexMismatch: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}), true);
			},
			onSelect : function(list) {
				var uploadFileName=list[0].name;
				$scope.antiVirusSoftware.fileName = uploadFileName;
				var fileExt=uploadFileName.split('.');
				if(fileExt[fileExt.length-1]=='gz'){
					$("#i_select_files").hide();
					$("#i_stream_files_queue").show();
					$("#streambtn").show();
				}
				fShowMessage($translate.instant('uploadfile.uploadisoSelectFile',{value:list.length}));
			},
			onFileCountExceed : function(selected, limit) {
				fShowMessage($translate.instant('uploadfile.uploadisoFileCountExceed ',{value1:selected,value2:limit}), true);
			},
			onMaxSizeExceed : function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoMaxSizeExceed',{value1:file.name,value2:file.size,value3:file.limitSize}), true);
			},
			onExtNameMismatch: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
			},
			onAddTask: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoAddTask',{value:file.name}));
			},
			onCancel : function(file) {
				//UtilService.startSessionTimer();
				$("#i_stream_files_queue").hide();
				$("#streambtn").hide();
				$("#i_select_files").show();
				fShowMessage($translate.instant('uploadfile.uploadisoCancel',{value:file.name}));
			},
			onStop : function() {
				//UtilService.startSessionTimer();
				fShowMessage($translate.instant('uploadfile.uploadisoStop'));
			},
			onCancelAll : function(numbers) {
				//UtilService.startSessionTimer();
				fShowMessage($translate.instant('uploadfile.uploadisoCancelAll',{value:numbers}));
			},
			onComplete : function(file) {
				//UtilService.startSessionTimer();
				fShowMessage($translate.instant('uploadfile.uploadisoComplete',{value1:file.name,value2:file.formatSize}));
				var msgJson = jQuery.parseJSON(file.msg);
				if (typeof msgJson == 'string') {
					msgJson = jQuery.parseJSON(msgJson);
				}
				$scope.hasUpload = true;
				$scope.domain.uploadFilePath = msgJson.complete;
				if (msgJson.complete !=null && msgJson.complete != '') {
					//查询基本信息
//					$http({
//						method  : 'GET',
//						url     : 'template/ovfconfig',
//						params:{uploadFilePath:msgJson.complete}
//					}).success(function(result) {
//						if (result.success == true) {
//							$scope.domain.domainName = result.data.name;
//							$scope.domain.title = result.data.name;
//						}
//					});
					//查询网络信息
//					$http({
//						method  : 'GET',
//						url     : 'template/ovfnet',
//						params:{uploadFilePath:msgJson.complete, destHostId : hostId}
//					}).success(function(result) {
//						if (result.success == true) {
//							$scope.netData = result.data;
//						}
//					});
					$scope.$broadcast(constant.onnext);
				}
			},
			onQueueComplete : function(msg) {
				fShowMessage($translate.instant('uploadfile.uploadisoQueueComplete'));
			},
			onUploadError : function(status, msg) {
				//UtilService.startSessionTimer();
				var msgJson = jQuery.parseJSON(msg);
				if (typeof msgJson == 'string') {
					msgJson = jQuery.parseJSON(msgJson);
				}
				if (msg.success) {
                    fShowMessage(msgJson.message);
				} else {
				    fShowMessage(msgJson.message, true);
				}
			},
			onMaxSizeExceed: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadFilesizeLimitError',{value1:file.name,value2:file.formatSize,value3:file.formatLimitSize}), true);
			}
			
	    };
    
    $scope.config = config;
    
    function fShowMessage(msg, warning) {
    	var o = document.getElementById("i_stream_message_container");
    	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
    }
    function falertMessage(msg,warning){
    	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:0px;padding:10px;margin-bottom:0px;word-break:break-all;" class="alert ';
    	s+= !!warning?"alert-danger":"alert-success"
    		s+='" role="alert">'+
    		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
    		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
    		msg+'</div>';
    	return s;
    } 
    
    $timeout(function(){
    	$scope.stream = new Stream(config);
    	$("#i_stream_files_queue").hide();
    	$("#streambtn").hide();
    	//隐藏上一步按钮
		$("#prevbutton").remove();
    }, 200);
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.upload = function() {
		$scope.stream.upload();
		//UtilService.cancelSessionTimer();
	}
    $scope.ok = function(){
		var data = angular.copy($scope.antiVirusSoftware);
		if ($scope.operationType == "add") {
			HttpService.post('antivirus/add', data, $modalInstance);
		} else {
			HttpService.put('antivirus/modify', data, $modalInstance);
		}
	    
	
    }

});  