//operator group 选择器。

routeApp.controller('operatorGroupSelectCtrl',function($scope, $http, $translate, $modalInstance, $modal, $timeout, UtilService, HttpService, GridService) {
    $scope.seleteData = {};         //选中的group
    $scope.isSelector = true;
    
    $scope.setSelectData = function(branch) {
        $scope.seleteData.id = branch.id;
        $scope.seleteData.name = branch.name;
        $scope.seleteData.desc = branch.description;
        $scope.seleteData.mode = branch.mode;
    }
    
   var permissions = localStorage.getItem("permissions");
   if (angular.isDefined(permissions)) {
       var permissonArr = JSON.parse(permissions);
       if (angular.isArray(permissonArr)) {
          //操作员分组
          $scope.showOperatorGroupMgr = permissonArr.contains(constant.OPERATOR_GROUP_MNG);
          $scope.showAddOperatorGroup = permissonArr.contains(constant.OPERATOR_GROUP_ADD);
          $scope.showModifyOperatorGroup = permissonArr.contains(constant.OPERATOR_GROUP_MODIFY);
          $scope.showDeleteOperatorGroup = permissonArr.contains(constant.OPERATOR_GROUP_DELETE);
          $scope.showViewOperatorGroup = permissonArr.contains(constant.OPERATOR_GROUP_VIEW);
      } else {
          //操作员分组
          $scope.showOperatorGroupMgr = true;
          $scope.showAddOperatorGroup = true;
          $scope.showModifyOperatorGroup = true;
          $scope.showDeleteOperatorGroup = true;
          $scope.showViewOperatorGroup = true;
       }
    } else {
       //操作员分组
       $scope.showOperatorGroupMgr = true;
       $scope.showAddOperatorGroup = true;
       $scope.showModifyOperatorGroup = true;
       $scope.showDeleteOperatorGroup = true;
       $scope.showViewOperatorGroup = true;
    }
    
    //增加操作员分组
    $scope.addOperatorGroup = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/systemManage/addOperatorGroup.html',
            controller: 'addOperatorGroupCtrl',
            backdrop:'static',
            size:'lg',
            resolve: {
                group: function () {},
                parentId:function(){},
                parentMode:function(){},
                level:function(){},
                type:function() {
                    return "add";
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    $scope.ok = function () {
        $modalInstance.dismiss($scope.seleteData);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//选择操作员分组   SelectMulOpGroupCtrl
routeApp.controller('SelectMulOpGroupCtrl',function(param, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('operator.selectOperatorGroup');
	$scope.checkOrg = true;
	$scope.helpFlag= "selMangerGp";
	var column = [{field: 'name', displayName:$translate.instant('operator.groupName'), sortable: true, width:'40%'},
	              {field: 'description', displayName:$translate.instant('operator.groupDesc'), sortable: true, width:'60%'}
	              ];
	$scope.mySelections = [];
	var url = "operator/operatorGroup";
	var pm = {};
	$scope = GridService.grid($scope, url, pm);
    $scope.getDataAsync();
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
	      showTreeExpandNoChildren: true,
	      enablePaging: false,
	      i18n: $translate.instant('load.static.lang'),
	      columnDefs:column
  	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//access strategy 选择器。
routeApp.controller('accessStrategySelectCtrl',function($scope, $http, $translate, $modalInstance, $modal, UtilService, HttpService, GridService) {
    $scope.seleteAccessStrategy = [];           //选中的group
    $scope.isSelector = true;
    //增加访问策略
    $scope.add = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/systemManage/addAccessStrategy.html',
            controller: 'addAccessStrategyCtrl',
            backdrop:'static',
            resolve: {
                access: function () {
                   
                },
                type:function() {
                    return "add";
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            //刷新策略表
            $scope.$broadcast("onQueryAccessStrategy");
        }, function () {
        });
    };
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    $scope.ok = function () {
        var param = {};
        if ($scope.seleteAccessStrategy.length == 1) {
            param.id = $scope.seleteAccessStrategy[0].id;
            param.name = $scope.seleteAccessStrategy[0].name;
        };
        
        $modalInstance.dismiss(param);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//过滤在线操作员
routeApp.controller('onlineOperatorFilterCtrl',function($scope, $http, $translate, $modalInstance, $modal, filter,UtilService, HttpService, GridService) {
    $scope.entry = {};
    
    if (angular.isDefined(filter)) {
		if (!isEmpty(filter.loginName)) {
			$scope.entry.loginName = filter.loginName;
		}
		if (!isEmpty(filter.userName)) {
			$scope.entry.userName = decodeURIComponent(filter.userName);
		}
		if (!isEmpty(filter.loginIp)) {
			$scope.entry.loginIP = filter.loginIp;
		}
	}

    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    $scope.ok = function () {
        $modalInstance.close($scope.entry);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.reset = function () {
    	$scope.entry = {};
    };
});

//选择用户分组
routeApp.controller('SelectMulUserGroupCtrl',function(params, url, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('common.selectUserGroup');
	var column = [{field: 'name', displayName:$translate.instant('operator.groupName'), sortable: true, width:'70%'},
	              {field: 'description', displayName:$translate.instant('operator.groupDesc'), sortable: true, width:'30%'}
	              ];
	$scope.mySelections = [];
	var url = url;
	$scope = GridService.grid($scope, url, params);
    $scope.getDataAsync();
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
	      showTreeExpandNoChildren: true,
	      enablePaging: false,
	      i18n: $translate.instant('load.static.lang'),
	      columnDefs:column
  	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

//选择用户
routeApp.controller('SelectMulUserCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('common.selectUser');
	var column = [
                  { field: 'loginName', displayName: $translate.instant('user.loginName'), sortable: true, width:'20%'},
                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'20%'},
                  { field: 'userGroup', displayName: $translate.instant('user.userGroup'), sortable: true, width:'10%'},
                  { field: 'authentication', displayName: $translate.instant('user.authentication'), sortable: true, width:'10%'},
                  { field: 'email', displayName: $translate.instant('user.email'), sortable: false, width:'20%'},
                  { field: 'phone', displayName: $translate.instant('user.phone'), sortable: true, width:'20%'}
                  ]
	$scope.mySelections = [];
	$scope.userSelections = [];
	$scope.userData = [];
	var url = "user/list";
	params.count= true;
	if (params.domainId) {
	    url = "user/list/vm";
	}
	$scope = GridService.grid($scope, url, params);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
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
		i18n: $translate.instant('lang'),
		totalServerItems: 'totalServerItems',
		filterOptions: $scope.filterOptions,
		pagingOptions: $scope.pagingOptions,
		columnDefs:column
  	};
	
	var columnUser = [
                  { field: 'loginName', displayName: $translate.instant('user.loginName'), sortable: true, width:'20%'},
                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'20%'},
                  { field: 'userGroup', displayName: $translate.instant('user.userGroup'), sortable: true, width:'10%'},
                  { field: 'authentication', displayName: $translate.instant('user.authentication'), sortable: true, width:'10%'},
                  { field: 'email', displayName: $translate.instant('user.email'), sortable: false, width:'20%'},
                  { field: 'phone', displayName: $translate.instant('user.phone'), sortable: true, width:'20%'}
                  ]
	$scope.userOptions = {
		  data: 'userData',
		  jqueryUITheme: false,
		  jqueryUIDraggable: false,
	      selectedItems: $scope.userSelections,
	      showSelectionCheckbox: true,
	      multiSelect: true,
	      showGroupPanel: false,
	      showColumnMenu: true,
	      showFilter: false,
	      enableCellSelection: false,
	      enableCellEditOnFocus: false,
	      showTreeExpandNoChildren: true,
	      enablePaging: false,
	      i18n: $translate.instant('load.static.lang'),
	      columnDefs:columnUser
	};
	$scope.addUser=function(){
		if ($scope.mySelections.length > 0) {
			for (var i=0;i<$scope.mySelections.length;i++) {				
				$scope.userData.push($scope.mySelections[i]);
			}
		}
		$scope.refreshPageParams();
	}
	$scope.removeUser=function(){
		if ($scope.userSelections.length > 0) {
			for (var i=0;i<$scope.userSelections.length;i++) {				
				for (var j=0;j<$scope.userData.length;j++) {
					if ($scope.userSelections[i].id == $scope.userData[j].id) {
						$scope.userData.splice(j,1);
					}
				}
			}
		}
		$scope.refreshPageParams();
	}
	$scope.refreshPageParams = function(){
		$scope.mySelections.splice(0, $scope.mySelections.length);
		$scope.userSelections.splice(0, $scope.userSelections.length);
		var userIdNoIn = "";
		for (var j=0;j<$scope.userData.length;j++) {
			userIdNoIn += $scope.userData[j].id;
			if (j<$scope.userData.length-1) {
				userIdNoIn +=",";
			}
		}
		if ("" == userIdNoIn) {
			userIdNoIn = null;
		}
		$scope.params.userIdNin = userIdNoIn;
		$scope.refreshPage();
	}
	$scope.ok=function(){
		$modalInstance.close($scope.userData);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

// select publicCloud
routeApp.controller('SelectSingleCloudCtrl',function(params, customUrl, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('org.selectPublic');
	$scope.showAddCloudResource = true;
	$scope.showAddCvmBtn = true;
	$scope.showAddVcenterBtn = true;
	var flagTmp = '<div class="ngCellText" ng-class="col.colIndex()">' +
		'<span ng-if= \'row.entity.flag == 1\'>阿里云</span>' +
		'<span ng-if= \'row.entity.flag == 2\'>CVM</span>' +
		'<span ng-if= \'row.entity.flag == 3\'>vCenter</span>' +
		'<span ng-if= \'row.entity.flag == 4\'>CIC</span>' +
		'<span ng-if= \'row.entity.flag == 5\'>CloudOS</span></div>';
	var column=[{ field: 'name', displayName:$translate.instant('common.name'),width:'20%'},
	            { field: 'description', displayName:$translate.instant('common.desc'),  width:'25%'},
	            { field: 'flag', displayName:$translate.instant('common.type'), cellTemplate:flagTmp, width:'15%'},
	            { field: 'uri', displayName:$translate.instant('paramconfig.ipAddr'),  width:'20%'},
	            { field: 'userName', displayName:$translate.instant('username'), width:'20%'}];
	var url = "cloud/list";
	var pms = {
			flag:[2,3,5]
	};
	if (angular.isDefined(params) && params != null ) {
		pms = params;
	}
	if (angular.isDefined(customUrl) && customUrl != null ) {
		url = customUrl;
	}
	
	$scope = GridService.grid($scope, url, pms);
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
		i18n: $translate.instant('lang'),
		totalServerItems: 'totalServerItems',
		filterOptions: $scope.filterOptions,
		pagingOptions: $scope.pagingOptions,
		rowTemplate: doubleClickTemplate,    //双击行模板
		columnDefs:column
  	};
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	}  
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	//增加云资源dongmei
	$scope.addCloudResource = function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{
            	flag:function(){return constant.PUBLIC_CLOUD_CVM;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
	};
	//增加CVM资源
	$scope.addCvm=function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{flag:function(){return CLOUD_CVM;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
	};
	//增加vCenter资源
	$scope.addVcenter=function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{flag:function(){return CLOUD_VMWARE;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
	};
});

//select publicCloud
routeApp.controller('SelectMultiCloudCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('org.selectPublic');
	$scope.showAddCloudResource = true;
	$scope.showAddCvmBtn = true;
	$scope.showAddVcenterBtn = true;
	var flagTmp = '<div class="ngCellText" ng-class="col.colIndex()">' +
		'<span ng-if= \'row.entity.flag == 1\'>阿里云</span>' +
		'<span ng-if= \'row.entity.flag == 2\'>CVM</span>' +
		'<span ng-if= \'row.entity.flag == 3\'>vCenter</span>' +
		'<span ng-if= \'row.entity.flag == 4\'>CIC</span>' +
		'<span ng-if= \'row.entity.flag == 5\'>CloudOS</span></div>';
	var column=[{ field: 'name', displayName:$translate.instant('common.name'),width:'20%'},
	            { field: 'description', displayName:$translate.instant('common.desc'),  width:'25%'},
	            { field: 'flag', displayName:$translate.instant('common.type'), cellTemplate:flagTmp, width:'15%'},
	            { field: 'uri', displayName:$translate.instant('paramconfig.ipAddr'),  width:'20%'},
	            { field: 'userName', displayName:$translate.instant('username'), width:'20%'}];
	var url = "cloud/list";
	
	var pms = {
			flag:[2,3,5]
	};
	if (params) {
		pms = params;
	}
	$scope = GridService.grid($scope, url, pms);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
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
		i18n: $translate.instant('lang'),
		totalServerItems: 'totalServerItems',
		filterOptions: $scope.filterOptions,
		pagingOptions: $scope.pagingOptions,
		rowTemplate: doubleClickTemplate,    //双击行模板
		columnDefs:column
  	};
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	}  
	$scope.ok=function(){
		$modalInstance.dismiss($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	//增加云资源dongmei
	$scope.addCloudResource = function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{
            	flag:function(){return constant.PUBLIC_CLOUD_CVM;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
	};
	//增加CVM资源
	$scope.addCvm=function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{flag:function(){return CLOUD_CVM;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
	};
	//增加vCenter资源
	$scope.addVcenter=function(){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addCvm.html',
            controller: 'addPublicCloudCtrl',
//            size: 'lg',
            backdrop: 'static',
            resolve:{flag:function(){return CLOUD_VMWARE;},
                id:function(){return undefined;},
                type:function(){return "add";}
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.refreshPage();
        }, function (reason) {
        });
	};
});


//select org Template
routeApp.controller('SelectSingleTemplateCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService, OrgService) {
	$scope.title=$translate.instant('org.seletTempate');
	//表头
	var column = [{ field: 'domainName', displayName: $translate.instant('common.name'), sortable: true, width:'20%', cellTemplate:titleTemplate},
	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'20%', cellTemplate:titleTemplate},
	              { field: 'cpu', displayName: $translate.instant('template.vcpuNum'), sortable: true, width:'10%'},
	              { field: 'memory', displayName: $translate.instant('template.memory'), cellFilter:'memory', sortable: true, width:'10%'},
	              { field: 'storage', displayName: $translate.instant('template.storage'),cellFilter:'byteUnitRender', sortable: true, width:'10%'},
	              { field: 'createDate', displayName: $translate.instant('template.createTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'15%'},
	              { field: 'system', displayName: $translate.instant('common.os'), cellFilter:'system', sortable: true, width:'15%'},]

	var url = "org/orgTemplate";
	var param = {id:params.orgId};
	var resourcePoolId = params.resourcePoolId;
	if (resourcePoolId != null){
		param.resourcePoolId = resourcePoolId;
	}
	$scope = GridService.grid($scope, url, param);
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
		i18n: $translate.instant('lang'),
		totalServerItems: 'totalServerItems',
		filterOptions: $scope.filterOptions,
		pagingOptions: $scope.pagingOptions,
		rowTemplate: doubleClickTemplate,    //双击行模板
		columnDefs:column
  	};
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	}  
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

//由资源池代替,准备删除
//routeApp.controller('SelectSingleClusterCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
//	$scope.title=$translate.instant('virdesk.selCluster');
//	//表头
//	var column = [{ field: 'hostPoolName', displayName: $translate.instant('virdesk.hostpool'), sortable: true, width:'25%', cellTemplate:titleTemplate},
//	              { field: 'name', displayName: $translate.instant('virdesk.cluster'), sortable: true, width:'25%', cellTemplate:titleTemplate},
//	              { field: 'desc', displayName: $translate.instant('virdesk.desc'), sortable: true, width:'25%', cellTemplate:titleTemplate},
//	              { field: 'vmNum', displayName: $translate.instant('virdesk.vmNum'), sortable: true, width:'25%'}
//	              ]
//	var url = "org/orgCluster/" + params.orgId;
//	if (angular.isDefined(params) && params != null ) {
//		params.selector = 'select';
//	}
//	$scope = GridService.grid($scope, url, params, null, null, "singleGrid");
//	$scope.getDataAsync();
//	$scope.gridOptions = {
//		data: 'myData',
//		jqueryUITheme: false,
//		jqueryUIDraggable: false,
//		selectedItems: $scope.mySelections,
//		showSelectionCheckbox: false,
//		multiSelect: false,
//		showGroupPanel: false,
//		showColumnMenu: true,
//		showFilter: false,
//		enableCellSelection: false,
//		enableCellEditOnFocus: false,
//		enablePaging: false,
//		showFooter: false,
//		i18n: $translate.instant('lang'),
//		totalServerItems: 'totalServerItems',
//		filterOptions: $scope.filterOptions,
//		pagingOptions: $scope.pagingOptions,
//		rowTemplate: doubleClickTemplate,    //双击行模板
//		columnDefs:column
//  	};
//	$scope.jump = function(entity) {
//		if (angular.isFunction($scope.ok)) {
//			$scope.ok.apply();
//		}
//	}  
//	$scope.ok=function(){
//		$modalInstance.close($scope.mySelections);
//	};	
//	$scope.cancel=function(){
//		$modalInstance.dismiss("cancel");
//	};
//});


routeApp.controller('SelectSingleStoreCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('virdesk.selStore');
	//表头
	var column = [{ field: 'title', displayName: $translate.instant('virdesk.poolName'), sortable: true, width:'25%'},
	              { field: 'type', displayName: $translate.instant('virdesk.poolType'), cellFilter: 'storageType', sortable: true, width:'25%'},
	              { field: 'path', displayName: $translate.instant('virdesk.poolPath'), sortable: true, width:'25%'},
	              { field: 'avalibaleCapacity', displayName: $translate.instant('virdesk.useableStore'),cellFilter:'storage', sortable: true, width:'25%'},]

/*	if (angular.isDefined(params.flag) && params.flag == constant.PUBLIC_CLOUD_CVM) {
		var column = [{ field: 'title', displayName: $translate.instant('org.storagePoolTitle'), cellTemplate: titleTemplate, sortable: true, width:'25%'},
		              { field: 'type', displayName: $translate.instant('virdesk.poolType'), cellFilter: 'storageType', sortable: true, width:'25%'},
		              { field: 'path', displayName: $translate.instant('virdesk.poolPath'), sortable: true, width:'25%'},
		              { field: 'storage', displayName: $translate.instant('virdesk.useableStore'),cellFilter:'storage', sortable: true, width:'25%'},]
	}*/
/*	$scope.resourcePoolId = params.resourcePoolId;
	params = {};*/
    var url = "resourcePool/resStorageByResourcePoolId";
	/*var url = "org/orgStorage/" + params.orgId;
	if (angular.isDefined(params.clusterId)) {
		url = "org/orgClusterStorage";
	}*/
	$scope = GridService.grid($scope, url, params);
	$scope.getDataAsync();
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
		i18n: $translate.instant('lang'),
		totalServerItems: 'totalServerItems',
		rowTemplate: doubleClickTemplate,    //双击行模板
		columnDefs:column
  	};
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	}  
	$scope.ok = function() {
		for (var i = 0; i < $scope.mySelections.length; i++) {
			var count = 0;
			if (!$scope.mySelections[i].isExist) {
				count++;		
			}
		}
		if (count > 0) {
    		var modalInstance1 = UtilService.alert($translate.instant('resourcePool.storageNotExist'),$translate.instant('common.opertip'), false, 'error');	
		} else {
			//模板部署，检查存储是否可用
			if ($scope.params.domainId) {
				var params = {};
				params.rpId = $scope.params.resourcePoolId;
				params.name = $scope.mySelections[0].name;
				params.domainId = $scope.params.domainId;
				$http({
					method: 'GET',
					url: 'resourcePool/checkStorageAvailable',
					params: params
				}).success(function (result) {
					if (result.state != 0) {
						UtilService.handleResult(result);
					} else {
						$modalInstance.close($scope.mySelections);
					}
				}).error(function(response, code, headers, config) {
					UtilService.handleError(code);
				});
			} else {
				$modalInstance.close($scope.mySelections);
			}
		}
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

/* 备份管理》导入窗口》引用参数窗口控制器 */
routeApp.controller('SelParaQuoteCtrl',function(cloudId, $scope, $http, $translate, $modalInstance, UtilService, GridService, HttpService) {
	$scope.title = $translate.instant('host.paraQuoteTitle');
	$scope.isSelector = true;
	$scope.mySelections = [];
	var column = [{ field: 'backupName', displayName: $translate.instant('common.name') , sortable: true, width:'20%'},
	              { field: 'storeMode', displayName: $translate.instant('backupVm.backupDest') , cellFilter:'backupmode', sortable: true, width:'15%'},
	              { field: 'targetAddr', displayName: $translate.instant('ip') , sortable: true, width:'15%'},
	              { field: 'loginName', displayName: $translate.instant('username') , sortable: true, width:'15%'},
	              { field: 'type', displayName: $translate.instant('serverType') ,cellFilter:'servertype', sortable: true, width:'15%'},
	              { field: 'storeLocation', displayName: $translate.instant('backupVm.backupLocation') , sortable: true, width:'20%'}
				 ];
    
	$http({
    	method: 'GET',
    	url: 'cloudBackup/backupStragegys/' + cloudId,
    	params: $scope.params
    }).success(function (result) {
    	$scope.myData = result.data;
    	UtilService.handleResult(result);
    }).error(function(response, code, headers, config) {
    	UtilService.handleError(code);
    });
    
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
        columnDefs:column,
        rowTemplate: doubleClickTemplate    // 双击行模板
    };    
    
    $scope.ok=function(){
    	var param =$scope.mySelections[0];
    	$modalInstance.dismiss(param);
    };
    $scope.cancel=function(){
    	$modalInstance.dismiss("cancel");
    }; 
    $scope.jump = function(entity) {
    	if ($scope.isSelector == true && angular.isFunction($scope.ok)) {
    		$scope.ok.apply();
    	}
    }    
});
/**
 * 分配虚拟机给用户或者用户分组弹出窗口控制器 CAS与VMware共用
 */
routeApp.controller('destributeVmCtrl',function($scope, $http, $timeout, $translate, $modalInstance, orgData, domainList, UtilService, HttpService) {
    $scope.entity = {};
    if (orgData) {
        $scope.entity.orgId = orgData.orgId;
        $scope.entity.orgName = orgData.orgName;
        $scope.entity.domainId = orgData.domainId;
        $scope.entity.domainName = orgData.domainName;
        $scope.entity.domainTitle = orgData.domainTitle;
        $scope.entity.vmKey = orgData.vmKey;
        $scope.entity.uniqueKey = orgData.uniqueKey;
        $scope.entity.cloudType = orgData.cloudType;
        
        $scope.entryNodeType = orgData.entryNodeType;
        
        $scope.hasOrg = angular.isNumber(orgData.orgId);
        $scope.cloudId = orgData.cloudId;//云资源id
        $scope.cloudType = orgData.cloudType;//云资源类型：3 VMware， 2 CVM
        $scope.clusterId = orgData.clusterId;
    } else {
        //批量分配
        $scope.hasOrg = false;
    }
    
    $scope.entity.type = 'user';
    
    //选择组织
    $scope.selectOrg =  function() {
        var resolve = { 
                queryData: function () {
                    return {type:$scope.cloudType,
                            publicCloudId:$scope.cloudId,
                            clusterId:$scope.clusterId}
                }
        };
        var orgInstance = UtilService.lgmodal('html/modal/common/selectOrg.html', 'selectOrgCtrl', resolve);
        orgInstance.result.then(function (org) {
            $scope.entity.orgId = org.id;
            $scope.entity.orgName = org.name;
            $scope.loadVirDeskPool();
        }, function () {
        });
    }
    
    //选中用户
    $scope.selectUsers = function() {
        if (!angular.isNumber($scope.entity.orgId)) {
            //修改问题单:201706200563  增加提示
            UtilService.alert($translate.instant('common.selectOrgFirst'),$translate.instant('common.opertip'), false, 'error');
            return;
        }
        var resolve = { 
        		params: function () {
        			return {
        				orgId:$scope.entity.orgId, 
        				domainId:$scope.entity.domainId,
        				uniqueKey:$scope.entity.uniqueKey,
        				cloudType:$scope.entity.cloudType,
        				count:true
        			}
        		},
        		url : function() {
            		return "user/list/vm";
            	},
            	entryNodeType : function() {
            		return undefined
            	}
        };
        var userInstance = UtilService.lgmodal('html/modal/cloudService/selectUser.html', 'SelectUserCtrl', resolve);
        userInstance.result.then(function (selectedItems) {
            if (angular.isDefined(selectedItems)) {
                $scope.entity.users = [];
                var names = "";
                for (var i = 0;i< selectedItems.length;i++) {
                    $scope.entity.users[i] = {userId:selectedItems[i].id, userGrpId:selectedItems[i].groupId};
                    names += selectedItems[i].loginName;
                    if (i< selectedItems.length - 1) {
                        names += ","
                    }
                }
                $scope.destrUsers = names;
            }
        }, function () {
        });
    }
    
    //选择用户分组
    $scope.selectUserGrp = function() {
        if (!angular.isNumber($scope.entity.orgId)) {
            //修改问题单:201706200563  增加提示
            UtilService.alert($translate.instant('common.selectOrgFirst'),$translate.instant('common.opertip'), false, 'error');
            return;
        }
        var resolve = { 
        		params: function () {
        			return {
        				orgId:$scope.entity.orgId,
        				domainId:$scope.entity.domainId
        			}
        		},
        		url: function(){
        			return "user/userGroupList/vm";
        		}
        };
        var userGrpInstance = UtilService.lgmodal('html/modal/common/multiselect.html', 'SelectMulUserGroupCtrl', resolve);
        userGrpInstance.result.then(function (selectedItems) {
            if (angular.isDefined(selectedItems)) {
                $scope.entity.userGrpIds = [];
                var names = "";
                for (var i = 0;i< selectedItems.length;i++) {
                    $scope.entity.userGrpIds[i] = {userGrpId:selectedItems[i].id};
                    names += selectedItems[i].name;
                    if (i< selectedItems.length - 1) {
                        names += ","
                    }
                }
                $scope.destrUserGrp = names;
            }
        }, function () {
        });
    }
    
    //组织发生变化时,清空用户和用户分组和桌面池
    $scope.$watch('entity.orgId', function(newValue, oldValue) {
        if (newValue && oldValue && newValue != oldValue) {
            //clearVirDesk提供了timeout方法
            $scope.entity.userGrpIds = [];
            $scope.destrUserGrp = null;
            $scope.entity.users = [];
            $scope.destrUsers = null;
            $scope.clearVirDesk();
        }
    });
    
    //选择虚拟桌面池
    $scope.virDeskList = [];
    $scope.loadVirDeskPool = function() {
        if (!angular.isNumber($scope.entity.orgId)) {
            return;
        }
        $scope.virDeskList.splice(0, $scope.virDeskList.length);
        var params = {
                orgId:$scope.entity.orgId,
                assignMode:1,                    //分配模式 1：固定桌面池，2：浮动桌面池
                domainId:$scope.entity.domainId
        };
        $http({
            method: 'GET',
            url: 'desktop/list/simple',
            params: params
        }).success(function (result) {
            if (result.state == 0) {
                var deskList = result.data;
                $timeout(function() {
                    for (var i = 0; i < deskList.length; i++) {
                        var desk = {value:deskList[i].id, label:deskList[i].name};
                        $scope.virDeskList.push(desk);
                    }
                });
            }
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    $scope.loadVirDeskPool();
    $scope.clearVirDesk = function() {
        $timeout(function() {
            $scope.entity.virDesk = undefined;
        });
    }
    
    //清空到期日期
    $scope.minDate = new Date();
    
    $scope.ok = function () {
        var url = 'org/vm/distribute';
        var data = {};
        if (orgData) {
            data.domainId = $scope.entity.domainId;
            data.name = $scope.entity.domainName;
            data.title = $scope.entity.domainTitle;
            data.vmKey = $scope.entity.vmKey;
            data.uniqueKey = $scope.entity.uniqueKey || data.vmKey;
            data.cloudType = $scope.entity.cloudType;
            data.cloudId = $scope.cloudId;
        } else {
            //批量分配
            url = 'org/vm/distribute/batch';
            var domainParamList = [];
            for (var i = 0; i < domainList.length; i++) {
                var domain = {};
                domain.id = domainList[i].id;
                domain.title = domainList[i].title || domainList[i].name;
                domain.uniqueKey = domainList[i].uniqueKey || domainList[i].vmKey;
                domain.cloudType = domainList[i].cloudType;
                domain.cloudId = domainList[i].cloudId || domainList[i].vCenterId;
                domainParamList.push(domain);
            }
            data.domainList = domainParamList;
        }
        
        data.orgId = $scope.entity.orgId;
        data.virDeskPoolId = $scope.entity.virDesk;
        data.type = $scope.entity.type;
        data.expireDate = $scope.entity.expireDate;
        if ($scope.entity.type == 'user') {
            data.userVmList = $scope.entity.users;
        } else {
            data.userVmList = $scope.entity.userGrpIds;
        }
        HttpService.put(url, data, $modalInstance);
    };    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//取消分配云主机
routeApp.controller('revokeDomainCtrl',function(param, $scope, $http, $modalInstance, $translate, UtilService, GridService, HttpService) {	
	$scope.title = $translate.instant("menu.revokeDomain");
	$scope.mySelections=[];
	$scope.isSelector = true
	$scope.helpFlag = param.entryNodeType;
	var userType = '<div class="ngCellText" ng-class="col.colIndex()">' +
	'<span ng-if= \'row.entity.flag == 0\'>' + $translate.instant("common.organization") + '</span>' +
	'<span ng-if= \'row.entity.flag == 1\'>' + $translate.instant("org.user") + '</span>' +
	'<span ng-if= \'row.entity.flag == 2\'>' + $translate.instant("common.userGroup") + '</span></div>';
	var column = [{ field: 'name', displayName: $translate.instant('org.loginGpName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
	             { field: 'desc', displayName: $translate.instant('org.userDescName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
	             { field: 'flag', displayName: $translate.instant('common.type') , sortable: true, width:'20%',cellTemplate:userType},
	             { field: 'desktopPool', displayName: $translate.instant('org.virDeskName') , sortable: true, width:'20%',cellTemplate:titleTemplate}];
	var urlUser = "org/vmUser";
	var params = {vmId:param.domainId};
	$scope = GridService.grid($scope, urlUser, params);
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
            enablePaging: false,
            showFooter: false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
            columnDefs:column
    };  
      
    $scope.ok=function(){
    	var revokeParams = [];
    	for (var int = 0; int < $scope.mySelections.length; int++) {
    		 var revokeParam = {};
    		 var row = $scope.mySelections[int];
    		 revokeParam.orgId = row.orgId;
    		 revokeParam.domainId = param.domainId;
    		 revokeParam.title = param.domainTitle;
    		 revokeParam.name = row.name;
    		 revokeParam.flag = row.flag;
    		 revokeParam.id = row.id;
    		 revokeParam.desktopPoolId = row.desktopPoolId;
             revokeParams.push(revokeParam);
    	}
    	var callback =  function () {
    		$modalInstance.close();
    	}
    	var modalInstance = UtilService.confirm($translate.instant('cloudResource.revokeConfirm',{name:row.name}),$translate.instant('org.del'));
    	modalInstance.result.then(function (selectedItem) {
    		HttpService.put('org/batchRevoke', revokeParams, modalInstance, callback);
    	}, function () {
    	});
    	
    	
    };
    $scope.cancel=function(){$modalInstance.dismiss("cancel");};
});

/**
 * 选择组织通用对话框控制器
 */
routeApp.controller('selectOrgCtrl',function($scope, $http, $translate, $modalInstance,queryData,UtilService,GridService,OrgService,HttpService) {
    var url = "org/list";
    $scope.pageTitle = $translate.instant('common.organization');
    $scope.multiSelect = false;
    if (queryData.type == 5) { //cloudOs虚拟机没有集群ID
    	queryData.clusterId = undefined;
    }
    $scope = GridService.noMaskGrid($scope, url, queryData);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.gridOptions = OrgService.orgList();
    $scope.gridOptions.selectedItems = $scope.mySelections;
    $scope.gridOptions.showColumnMenu = false;
    $scope.gridOptions.multiSelect = false;
    $scope.gridOptions.rowTemplate = doubleClickTemplate;
    $scope.gridOptions.filterOptions=$scope.filterOptions;
    $scope.gridOptions.pagingOptions=$scope.pagingOptions;
    $scope.listStyle = $scope.gridStyle(-15);
    
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
        $modalInstance.close($scope.mySelections[0]);
    };  
    $scope.cancel=function(){
        $modalInstance.dismiss("cancel");
    };
});

/**
 * 选择模板存储对话框
 */
routeApp.controller('SelectTemplateStorageListCtrl2',function(cloudId, $scope, $http, $modal, $translate, $modalInstance, UtilService, GridService, HttpService) {
    $scope.cloudId = cloudId;
    $scope.selectPool = {};       // 选中的存储

    $scope.ok = function () {
        if ($scope.selectPool.targetPath) {
            var status = $scope.selectPool.status;
            if (status != "1") {
                UtilService.alert($translate.instant('template.selectActiveTemplateStorage'), $translate.instant('common.opertip'), false, 'error');
                return;
            }
        }
        $modalInstance.close($scope.selectPool);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//存储文件选择控制器。这里存储选择对话框作为一个通用组件，内部高度耦合。
routeApp.controller('storageFileSelectCtrl',function($scope, $http, $translate, $modalInstance, $modal,paramsObj, UtilService, HttpService, GridService) {
	$scope.mySelections = [];			//选中的存池
	$scope.mySelections2 = [];		    //选择的存储卷
	$scope.hostId = paramsObj.hostId;
	$scope.cloudId = paramsObj.cloudId;
	$scope.isSelectBase = paramsObj.isSelectBase;
	$scope.isSelector = true;
	
	$scope.paramsObj = paramsObj;
	if (angular.isUndefined(paramsObj.mode)) {
	    $scope.paramsObj.mode = 0;
	}
	
	$http({
		method : "GET",
		url : "host/detail?hostId=" + $scope.hostId + "&cloudId=" + $scope.cloudId
	}).success(function(result){
		if (result.data){
			$scope.hostName = result.data.name;
		}
	})
	
	//增加存储池
	$scope.addStoragePool = function() {
	   var modalInstance = $modal.open({
          templateUrl: 'html/modal/host/addStoragePool.html',
          controller: 'addStoragePoolCtrl',
          backdrop: 'static',
          size:"lg",
          resolve: {
              hostId: function () {
                  return $scope.hostId;
              },
              mode:function() {return $scope.paramsObj.mode;}
          }
       });
       modalInstance.result.then(function (selectedItem) {
       }, function () {
       });
	};
	 
   //增加存储卷
   $scope.addStorage = function() {
	    if ($scope.mySelections.length != 1) {
		    return;
	    }
	    var poolTitle = $scope.mySelections[0].title;
	   	var status = $scope.mySelections[0].status;
	   	var poolPath = $scope.mySelections[0].path;
	   	if (status ==1) { //存储池运行状态
	   		var modalInstance = $modal.open({
   				templateUrl: 'html/modal/host/addStorage.html',
   				controller: 'AddStorageCtrl',
   				width:'540px',
   				backdrop: 'static',
   				resolve: {
   					hostId: function () {
   						return $scope.hostId;
   					},
   					cloudId: function () {
   						return $scope.cloudId;
   					},
   					storepoolName: function() {
   						return $scope.mySelections[0].name;
   					},
   					storepoolPath: function() {
                        return $scope.mySelections[0].path;
                    },
   					remainSize: function() {
   						return $scope.mySelections[0].remainSize;
   					}
   				}
   			});
   			modalInstance.result.then(function (selectedItem) {
   			}, function () {
   			});
	   	} else {
	   		UtilService.error($translate.instant("storagePool.createVolWithStoragePoolInactive",{'v':poolTitle}), $translate.instant("paramconfig.warn"));
	   	}
   };
   //上传存储卷
   $scope.uploadFile = function() {
	   	if ($scope.mySelections.length != 1) {
	   		return;
	   	}
	   	var modalInstance = $modal.open({
	   		templateUrl: 'html/modal/common/uploadFile.html',
	   		controller: 'UploadCtrl',
	   		size:'lg',
	   		backdrop: 'static',
	   		resolve: {
	   			hostId: function () {
	   				return $scope.hostId;
	   			},
	   			row : function() {
	   				return $scope.mySelections;
	   			},
	   			cloudId: function() {
	   				return $scope.cloudId;
	   			}
	   		}
	   	});
	   	modalInstance.result.then(function (selectedItem) {
	   		var msg = {};
	   		msg.hostId = $scope.hostId;
	   		msg.cloudId = $scope.cloudId;
	   		$rootScope.$broadcast('onQueryStorageVolumeList',msg);
	   	}, function () {
	   	});
   };
	
   // 刷新存储池
	 $scope.refreshStoragePool = function(row) {
	     HttpService.put("storage/host/pool/refresh?hostId=" + $scope.hostId + "&cloudId=" + $scope.cloudId + "&poolName=" + row.name
	    		 + "&title=" + row.title + "&hostName=" + $scope.hostName, undefined,$scope.refreshPage, $scope.refreshPage );
	 }
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    //接收新建成功打消息
    $scope.$on('onSendSelectVolume', function(event, msg) {
        var param = {};
        param.format = msg.format;
        param.filePath = $scope.mySelections[0].path + '/' + msg.volName;
        param.capacity = msg.capacity;
        $modalInstance.close(param);        
    });
    
    $scope.ok = function () {
    	var param = {};
    	if ($scope.mySelections2.length == 1) {
    		if (angular.isDefined($scope.mySelections2[0].list) && $scope.mySelections2[0].list != "") {    			
    			var modalInstance = UtilService.confirm($translate.instant('storagePool.volumeUsed',{'v': $scope.mySelections2[0].list}),$translate.instant('operConfirm'));
    			modalInstance.result.then(function (selectedItem) { 
    				param.format = $scope.mySelections2[0].format;
       		 		param.filePath = $scope.mySelections[0].path + '/' + $scope.mySelections2[0].name;
       		 		param.capacity = $scope.mySelections2[0].size;
       		 		param.type = $scope.mySelections2[0].type;
       		 		$modalInstance.close(param);
    			});			 
    		} else if (angular.isDefined($scope.mySelections2[0].isBaseFile) && $scope.mySelections2[0].isBaseFile) {    			
    			var modalInstance = UtilService.alert($translate.instant('storagePool.volumeIsBase'),$translate.instant('common.opertip'), false, 'error');
    			modalInstance.result.then(function (selectedItem) {
    				return;
    			});			 
    		} else if (angular.isDefined($scope.mySelections2[0].isTempImg) && $scope.mySelections2[0].isTempImg) {    			
    			var modalInstance = UtilService.alert($translate.instant('storagePool.volumeIsTemp'),$translate.instant('common.opertip'), false, 'error');
    			modalInstance.result.then(function (selectedItem) { 
    				return;
    			});			 
    		} else if (angular.isDefined($scope.isSelectBase) && $scope.isSelectBase) {  
    			if (angular.isDefined($scope.mySelections2[0].format) && $scope.mySelections2[0].format == 'iso') {
    				var modalInstance = UtilService.alert($translate.instant('storagePool.volumeIsoCannotBase'),$translate.instant('common.opertip'), false, 'error');
    				modalInstance.result.then(function (selectedItem) { 
    					return;
    				});			 
    			} else if (angular.isDefined($scope.mySelections2[0].isBaseFile) && $scope.mySelections2[0].isBaseFile) {    				
    				var modalInstance = UtilService.alert($translate.instant('storagePool.volumeCannotBase'),$translate.instant('common.opertip'), false, 'error');
    				modalInstance.result.then(function (selectedItem) { 
    					return;
    				});			 
    			} else {
    				param.format = $scope.mySelections2[0].format;
       		 		param.filePath = $scope.mySelections[0].path + '/' + $scope.mySelections2[0].name;
       		 		param.capacity = $scope.mySelections2[0].size;
       		 		param.type = $scope.mySelections2[0].type;
       		 		$modalInstance.close(param);
    			}
    		} else {
   		 		param.format = $scope.mySelections2[0].format;
   		 		param.filePath = $scope.mySelections[0].path + '/' + $scope.mySelections2[0].name;
   		 		param.capacity = $scope.mySelections2[0].size;
   		 		param.type = $scope.mySelections2[0].type;
   		 		$modalInstance.close(param);
   		 	}
    	};
    	
    	
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//选择虚拟交换机控制器
routeApp.controller('vswitchSelectCtrl',function($scope, $http, $translate, $rootScope, $modalInstance, $modal, inputParam, UtilService, HttpService, GridService) {
	$scope.mySelections = [];			//选中的虚拟交换机
/*	$scope.hostId = inputParam.hostId;	
	$scope.cloudId = inputParam.cloudId;*/	
	$scope.resourcePoolId = inputParam.resourcePoolId;
	$scope.isSelector = true;
	$scope.isFromVxlanScope = false;
	$scope.isForRoute = false;
	if (angular.isDefined(inputParam.isFromVxlanScope) && inputParam.isFromVxlanScope) {
	    $scope.isFromVxlanScope = true;
	}
	if (angular.isDefined(inputParam.isForRoute) && inputParam.isForRoute) {
	    $scope.isForRoute = true;
	}
/*	if (angular.isDefined($scope.resourcePoolId)) {
		$http({
			method : "GET",
			//url : "host/detail?hostId=" + inputParam.hostId + "&cloudId=" + inputParam.cloudId
			url : "resourcePool/resVswitchByResourcePoolId/"+ inputParam.resourcePoolId
		}).success(function(result){
			if (result.data){
				$scope.hostName = result.data.name;
			}
		})
	}*/
	//增加虚拟交换机
	$scope.addVswitch =  function() {
	     var modalInstance = $modal.open({
            templateUrl: 'html/modal/host/addVswitch.html',
            controller: 'addVswitchCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                hostId: function () {
                    return $scope.hostId;
                },
                cloudId: function() {
                	return $scope.cloudId;
                },
                hostName: function () {
                	return $scope.hostName;
                }, 
                entry: function () {
                	
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	//增加成功刷新虚拟交换机列表
        	$rootScope.$broadcast("onQueryVswitchListInHost");
        }, function (reason) {
       
        });
	 };
	
	//回车
    $scope.enter = function(ev) {
        if (ev.keyCode == 13 && $scope.mySelections.length == 1) {
            $scope.ok();
        }
    };
    
    $scope.ok = function() {
		for (var i = 0; i < $scope.mySelections.length; i++){
			var name = "";
			if (!$scope.mySelections[i].isExist) {
				name += $scope.mySelections[i].name + ",";				
			}						
		}
		if (name != "") {
			name = name.substring(0, name.length - 1);
    		var modalInstance1 = UtilService.alert($translate.instant('resourcePool.vswitchNotExist',{value:name}),$translate.instant('common.opertip'), false, 'error');	
		} else {			
			$modalInstance.close($scope.mySelections[0]);
		}
	};	    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//选择网络策略模板控制器
routeApp.controller('profileSelectCtrl',function($scope, $http, $translate, $modalInstance, $modal, inputParam, UtilService, HttpService, GridService,CloudResourceService) {
	$scope.mySelections = [];			
	$scope.isSelector = true;
	$scope.cloudId = inputParam.cloudId;
	
	//增加网络策略模板
//	$scope.addProfile =  function() {
//		CloudResourceService.addNetStrategy();
//	 };
	
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
	$scope.ok = function() {		
			$modalInstance.close($scope.mySelections[0]);
	};	
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//CIC本地目录选择器
routeApp.controller('cicFolderSelectorCtrl',function($scope, $http, $translate, $modalInstance, $modal, UtilService, HttpService, GridService) {
    $scope.selectFolder = null;//选中的目录   
    //增加目录
    $scope.addFolder = function() {
        if ($scope.selectFolder == null) {
            return;
        }
        var resolve = {parentFolder:function() {return $scope.selectFolder.entryId}};
        var modalInstance = UtilService.modal('html/modal/common/addCICFolder.html', 'addCICFolderCtrl', resolve);
        modalInstance.result.then(function (path) {
            //增加目录成功后更新节点
            var msg = {};
            msg.parentEntryId = $scope.selectFolder.entryId;
            msg.parentEntryType = 'cvm_folder';
            msg.subNodes = [];
            var sub = {};
            sub.entryId = $scope.selectFolder.entryId + '/' + path;
            sub.entryType = 'cvm_folder';
            sub.text = path;
            sub.icon = 'icon-folder-gray';
            msg.subNodes.push(sub);
            $scope.$broadcast('onAddCvmFolder', msg);
        }, function (reason) {
        });
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    $scope.ok = function () {
        $modalInstance.close($scope.selectFolder.entryId);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//CIC本地目录选择器
routeApp.controller('addCICFolderCtrl',function($scope, $http, $translate, $modalInstance, $modal, parentFolder, UtilService, HttpService, GridService) {
    $scope.addFolderName = null;
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };

    var callback = function() {
        $modalInstance.close($scope.addFolderName);
    }
    
    $scope.ok = function () {
        var param = {};
        param.dirName = parentFolder + '/' + $scope.addFolderName;
        HttpService.post('cicBackup/cic/folder', param, undefined, callback);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

routeApp.controller('SelectOrgResourcePoolCtrl',function($scope, $http, $modal, $translate, $modalInstance, $timeout, UtilService, GridService, ResourcePoolService, params) {
	$scope.title = $translate.instant('resourcePool.selectResourcePool');
	$scope.addRpTitle = $translate.instant('resourcePool.selectResourcePool');
	$scope.showAddOrgResourcePool = true;
	var flag = params.selectMul;
	var orgId = params.orgId;
	var param = {};
	if (orgId != null) {
		param.orgId = orgId;
	} 
	if (params.cloudType != null) {
		param.cloudType = params.cloudType;
	}
    //资源池列表
    
    var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'20%',cellTemplate:titleTemplate},
                  { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'28%',cellTemplate:titleTemplate},
                  { field: 'cloudType', displayName: $translate.instant('common.type'), sortable: true, width:'13%', cellFilter:'cloudType'},
                  { field: 'cpu', displayName: $translate.instant('resourcePool.cpu'), sortable: true, width:'13%'},
                  { field: 'memory', displayName: $translate.instant('resourcePool.memory'), sortable: true, width:'13%', cellFilter:'byteUnitRender'},
                  { field: 'totalStorageCapacity', displayName: $translate.instant('resourcePool.storage'), sortable: true, width:'13%', cellFilter:'byteUnitRender'}
                  ];
    
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    var url = "resourcePool/queryList";
    $scope = GridService.grid($scope, url, param, null, null,'resourcePoolListDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.gridOptions = {
          data: 'myData',
          jqueryUITheme: false,
          jqueryUIDraggable: false,
          selectedItems: $scope.mySelections,
          showSelectionCheckbox: flag == true ? flag : false,
          multiSelect: flag == true ? flag : false,
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
	$scope.jump = function(entity) {
		if (!flag) {
			if (angular.isFunction($scope.ok)) {
				$scope.ok.apply();
			}
		}
	}	
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
	$scope.$on(constant.onRefreshOrgResourcePoolList, function(msg) {
		$scope.refreshPage();
	});
	
    // 增加资源池
	$scope.addResourcePool=function(){
	    ResourcePoolService.addResourcePool();
	};
});