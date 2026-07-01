/**
 * @author 10450
 * @description 系统管理controller（点击左侧虚拟机树节点）. 
 */ 
routeApp.controller('systemCtrl' ,function($scope, $state, $http, $location, $modal, $translate, $timeout,UtilService, HttpService){
     $scope.system = {};
     $scope.pageType = 'listItem';
     $scope.params = {};
     
     $scope.seleteOperator = [];        //选择的操作员
     $scope.seleteGroup = [];           //选择的操作员分组
     $scope.seleteAccessStrategy = [];  //选择的访问策略
	 


     //refresh method
     $scope.refreshOperator = function(msg) {
    	if (angular.isDefined(msg)){
     	$scope.$root.$broadcast('onQueryOperatorList', msg);
    	} else {
    		$scope.$root.$broadcast('onQueryOperatorList', $scope.params);
    	}
     	
     };
     $scope.refreshOperatorGroup = function(msg) {
      	$scope.$root.$broadcast('onQueryOperatorGroupList', msg);
     };     
     
     //打开操作员过滤窗口
     $scope.operatorFilter = function() {
    	 var waitModal = UtilService.wait();
    	 $http.get('operator/operatorGroup?limit=0&offset=0')
    	 .success(function(result) {
    		 waitModal.dismiss();
    		 if (result.state == 0) {
    			 var group = result.data;
    			 var modalInstance = $modal.open({
    	              templateUrl: 'html/modal/systemManage/operatorFilter.html',
    	              controller: 'operatorFilterCtrl',
    	              backdrop:'static',
    	              resolve:{operatorGroups:function() {
    	            	  return group;
    	              },
                 	  filter: function () {
                          return $scope.params;
    	              }}
    	          });
    	          modalInstance.result.then(function (data) {
    	        	  if (angular.isObject(data)) {
    	        		  $scope.params = {};
    	        		  if (angular.isDefined(data.loginName)) {
    	        			  $scope.params.loginName = data.loginName;
    	        		  }
    	        		  if (angular.isDefined(data.authType)) {
    	        			  $scope.params.authType = data.authType;
    	        		  }
    	        		  if (angular.isDefined(data.userName)) {
    	        			  $scope.params.userName = encodeURIComponent(data.userName);	//$http GET请求服务器传送的参数中包含中文需要编码
    	        		  }
    	        		  if (angular.isDefined(data.operatorGrp)) {
    	        			  $scope.params.groupId = Number(data.operatorGrp);
    	        		  }
    	        		  if (angular.isDefined(data.email)) {
    	        			  $scope.params.email = data.email;
    	        		  }
                          if (angular.isDefined(data.enable)) {
                        	  $scope.params.enable = data.enable;
    	        	  }
    	        		  $scope.refreshOperator($scope.params);
    	        	  }
    	          }, function (reason) {
    	        	  
    	          });
    		 }
    	 }).error(function(response, code, headers, config) {
       	    waitModal.dismiss();
    	    UtilService.handleError(code);
    	 });
     };
     
     //打开增加操作员窗口
     $scope.addOperator = function() {
    	 $scope.pwdConf = {};
         $scope.pwdConf.complex = 0;
//         var waitModal = UtilService.wait();
         $http({
             method  : 'GET',
             url     : 'systemConfig/sysConfig',
             params:{type:"pwd_conf"}
         }).success(function(result) {
//        	    waitModal.dismiss();
             if (result.success) {
                 if (result.data["pwd.min.length"] != null) {
                     $scope.pwdConf.pwdMinlen = result.data["pwd.min.length"];
                 }
                 if (result.data["pwd.complexity"] != null) {
                     $scope.pwdConf.complex = result.data["pwd.complexity"];
                 }
                 if (result.data["pwd.valid.time"] != null) {
                     $scope.pwdConf.pwdValidTime = result.data["pwd.valid.time"];
                 }
             }
         var modalInstance = $modal.open({
              templateUrl: 'html/modal/systemManage/addOperator.html',
              controller: 'addOperatorCtrl',
              size:'lg',
              width:'900px',
              height:'660px',
              backdrop:'static',
              resolve: {
            	  pwdConf : function () {
                      return $scope.pwdConf;
                  },
                  operator: function () {
                      
                  },
                  type:function() {
                      return "add";
                  }
              }
          });
          modalInstance.result.then(function (selectedItem) {
          }, function () {
          });
         });
     };
     //删除操作员
     $scope.deleteOperator = function() {
         if ($scope.seleteOperator.length == 0) {
             return;
         }
         //make the select obj to a list for multi delete
         var delOper = [];
         if ($scope.seleteOperator.length > 0) {
             for (var i = 0; i < $scope.seleteOperator.length; i++) {
                 var oper = {};
                 oper.id = $scope.seleteOperator[i].id;
                 oper.loginName = $scope.seleteOperator[i].loginName;
                 oper.userName = $scope.seleteOperator[i].userName;
                 //禁止删除超级管理员
                 if ($scope.seleteOperator[i].id == 1) {
                     UtilService.error($translate.instant('systemMng.deleteAdminAlert'));
                     return;
                 }
                 delOper.push(oper);
             }
         }
         var modalInstance = UtilService.confirm($translate.instant('operator.delOperatorConfirm'),$translate.instant('operator.delOperator'));
         modalInstance.result.then(function (selectedItem) {
             HttpService.put('operator/delete', delOper, undefined, $scope.refreshOperator);
         }, function () {
         });
     };
     //修改操作员
     $scope.modifyOperator = function() {
         if ($scope.seleteOperator.length != 1) {
             return;
         }
         $scope.pwdConf = {};
         $scope.pwdConf.complex = 0;
         var waitModal = UtilService.wait();
         $http({
             method  : 'GET',
             url     : 'systemConfig/sysConfig',
             params:{type:"pwd_conf"}
         }).success(function(result) {
             if (result.success) {
                 if (result.data["pwd.min.length"] != null) {
                     $scope.pwdConf.pwdMinlen = result.data["pwd.min.length"];
                 }
                 if (result.data["pwd.complexity"] != null) {
                     $scope.pwdConf.complex = result.data["pwd.complexity"];
                 }
                 if (result.data["pwd.valid.time"] != null) {
                     $scope.pwdConf.pwdValidTime = result.data["pwd.valid.time"];
                 }
             }
    	 //query operator 
    	 $http.get('operator/' + $scope.seleteOperator[0].id + '/details')
    	 .success(function(result) {
    		 waitModal.dismiss();
    		 if (result.state == 0) {
    			 var oper = result.data;
                 oper.password = UtilService.decryptByDES(oper.password);
		         var modalInstance = $modal.open({
		              templateUrl: 'html/modal/systemManage/addOperator.html',
		              controller: 'addOperatorCtrl',
		              size:'lg',
		              width:'900px',
		              height:'660px',
		              backdrop:'static',
		              resolve: {
                          pwdConf: function() {
                              return $scope.pwdConf;
                          },
		                  operator: function () {
		                    return oper;
		                  },
		                  type:function() {
		                      return "modify";
		                  }
		              }
		          });
		          modalInstance.result.then(function (selectedItem) {
		          }, function () {
		          });
    		 } else if (result.errorCode=="21") {
    			 UtilService.error(result.failureMessage);
    		     $scope.$broadcast('onQueryOperatorList', {});
    		 }
    	 }).error(function(response, code, headers, config) {
       	    waitModal.dismiss();
    	    UtilService.handleError(code);
    	 });
        });
     };
     //查看操作员
     $scope.viewOperator = function() {
         if ($scope.seleteOperator.length != 1) {
             return;
         }
    	 //query operator 
//    	 var waitModal = UtilService.wait();
    	 $http.get('operator/' + $scope.seleteOperator[0].id + '/details')
    	 .success(function(result) {
//    		 waitModal.dismiss();
    		 if (result.state == 0) {
    			 var oper = result.data;
    			 oper.password = UtilService.decryptByDES(oper.password);
    			 var modalInstance = $modal.open({
    	              templateUrl: 'html/modal/systemManage/addOperator.html',
    	              controller: 'addOperatorCtrl',
    	              size:'lg',
    	              width:'900px',
    	              height:'616px',
    	              backdrop:'static',
    	              resolve: {
    	            	  pwdConf: function() {
                              return null;
                          },
    	                  operator: function () {
    	                      return oper;
    	                  },
    	                  type:function() {
    	                      return "view";
    	                  }
    	              }
    	          });
    	          modalInstance.result.then(function (selectedItem) {
    	          }, function () {
    	          });
    		 } else  if (result.errorCode=="21") {
    			 UtilService.error(result.failureMessage);
    		     $scope.$broadcast('onQueryOperatorList', {});
    		 }
    	 }).error(function(response, code, headers, config) {
//       	    waitModal.dismiss();
    	    UtilService.handleError(code);
    	 });
     };
     
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
     //增加访问策略
     $scope.addAccessStrategy = function() {
         var modalInstance = $modal.open({
             templateUrl: 'html/modal/systemManage/addAccessStrategy.html',
             controller: 'addAccessStrategyCtrl',
             backdrop:'static',
//             size:'lg',
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
             $scope.refreshAccessStrategy();
         }, function () {
         });
     };
     //修改访问策略
     $scope.modifyAccessStrategy = function() {
         if ($scope.seleteAccessStrategy.length != 1) {
             //提示选择一条策略
//             UtilService.alert($translate.instant('securityMng.selectConfirm'), $translate.instant('common.opertip'), false, 'error');
             return;
         }
         var waitModal = UtilService.wait();
         var params = {};
         params.id = $scope.seleteAccessStrategy[0].id;
         $http({
            method: 'GET',
            url: 'accessStrategy/' + params.id,
            params: params
         }).success(function(result) {
             waitModal.dismiss();
             if (result.success == true) {
                 var modalInstance = $modal.open({
                     templateUrl: 'html/modal/systemManage/addAccessStrategy.html',
                     controller: 'addAccessStrategyCtrl',
                     backdrop:'static',
//                     size:'lg',
                     resolve: {
                         access: function () {
                             return result.data;
                         },
                         type:function() {
                             return "modify";
                         }
                     }
                 });
                 modalInstance.result.then(function (selectedItem) {
                     //刷新策略表
                     $scope.refreshAccessStrategy();
                 }, function (reason) {
                 });
             } else {
                 UtilService.handleError(result.errorCode);
             }           
         }).error(function(response, code, headers, config) {
             waitModal.dismiss();
             UtilService.handleError(code);
         });
     }
     //查看访问策略
     $scope.viewAccessStrategy = function() {
         if ($scope.seleteAccessStrategy.length != 1) {
             //提示选择一条策略
//             UtilService.alert($translate.instant('securityMng.selectConfirm'), $translate.instant('common.opertip'), false, 'error');
             return;
         }
         var waitModal = UtilService.wait();
         var params = {};
         params.id = $scope.seleteAccessStrategy[0].id;
         
         $http({
             method: 'GET',
             url: 'accessStrategy/' + params.id,
             params: params
          }).success(function(result) {
             waitModal.dismiss();
             if (result.success == true) {
                 var modalInstance = $modal.open({
                     templateUrl: 'html/modal/systemManage/addAccessStrategy.html',
                     controller: 'addAccessStrategyCtrl',
                     backdrop:'static',
//                     size:'lg',
                     resolve: {
                         access: function () {
                             return result.data;
                         },
                         type:function() {
                             return "view";
                         }
                     }
                 });
                 modalInstance.result.then(function (selectedItem) {
                 }, function () {
                 });
             }
          });
     }
     
     //刷新访问控制策略
     $scope.refreshAccessStrategy = function(msg) {
         //var msg = {msg:'onQueryAccessStrategy'};
         $scope.$root.$broadcast('onQueryAccessStrategy', msg);
     }
     
     //删除访问策略
     $scope.deleteAccessStrategy = function() {
         if ($scope.seleteAccessStrategy.length < 1) {
             //提示选择一条策略
//             UtilService.alert($translate.instant('securityMng.selectConfirm'), $translate.instant('common.opertip'), false, 'error');
             return;
         }
         var modalInstance = UtilService.confirm($translate.instant('securityMng.deleteConfirm'),$translate.instant('operConfirm'));
         modalInstance.result.then(function (selectedItem) {
        	 //make the select obj to a list for multi delete
        	 var delAccess = [];
        	 if ($scope.seleteAccessStrategy.length > 0) {
        		 for (var i = 0; i < $scope.seleteAccessStrategy.length; i++) {
        			 var accessStrategy = {};
        			 accessStrategy.id = $scope.seleteAccessStrategy[i].id;
        			 accessStrategy.name = $scope.seleteAccessStrategy[i].name;
        			 delAccess.push(accessStrategy);
        		 }
        	 }
             HttpService.put('accessStrategy/delete', delAccess, modalInstance, $scope.refreshAccessStrategy);
         }, function () {
        	 
         });
     }
     $scope.refreshLog = function(){
    	 $scope.$broadcast(constant.onFilterOperlogList);
     }
   //清理操作日志
     $scope.clearLog = function() {
         var modalInstance = $modal.open({
             templateUrl: 'html/modal/common/clearLog.html',
             controller: 'clearOperlogCtrl',
             size:'mg',
             backdrop: 'static',
             resolve: {
             }
         });
         modalInstance.result.then(function (selectedItem) {
         }, function () {
         });
     }
     //过滤操作日志
     $scope.logFilter = function() {
         var modalInstance = $modal.open({
             templateUrl: 'html/modal/common/logFilter.html',
             controller: 'operlogFilterCtrl',
             backdrop: 'static',
             resolve: {
            	 operlogParams: function(){
            		 return $scope.operlogParams;
            	 }
             }
         });
         modalInstance.result.then(function (selectedItem) {
        	 if (angular.isDefined(selectedItem)) {
        		 $scope.operlogParams = selectedItem;
        	 }
         }, function (reason) {
         });
     };
     //下载操作日志
     $scope.downloadLog = function() {
         var modalInstance = UtilService.confirm($translate.instant('operlog.downloadConfirm'),$translate.instant('operConfirm'));
         modalInstance.result.then(function (selectedItem) {
        	 var params = {};
        	 if($scope.operlogParams){
        		 params = $scope.operlogParams;
        	 };
        	 $http({
        		 method: "GET",
        		 url: "operlog/compressLog",
        		 params: params
        	 }).success(function(result){
        		 var param = "height=100, width=100, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
        		 var path = encodeURIComponent(UtilService.encryptByDES(result.data.path));
        		 var name = encodeURIComponent(UtilService.encryptByDES("operationLog.tar.gz"));
        		 var url = "download/fileDownload?filePath=" + path + "&fileName=" + name;
        		 window.open(url, "_blank", param);
        	 })
         }, function () {
         });
     }
});
//清理操作日志
routeApp.controller('clearOperlogCtrl', function($scope, $rootScope, $http, $translate, $timeout, $modalInstance, UtilService,HttpService) {
	$scope.maxvalue = new Date();
	$http({
    	method: "GET",
    	url: 'operlog/getMaxCleanupDate'
    }).success(function(result){
    	$timeout(function() {
    		$scope.maxvalue.setTime(result);
    	});
    }).error(function(response, code, headers, config) {
    	UtilService.handleError(code);
    	return;
    });
	//回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };      
    
    var callback = function() {
    	$rootScope.$broadcast(constant.onFilterOperlogList);
    };
    
    $scope.ok = function () {
    	var params = {};
    	params.date = $scope.clearDate;
        HttpService.delete('operlog/delete',params, $modalInstance, callback);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//过滤操作日志
routeApp.controller('operlogFilterCtrl', function($scope, $rootScope, $state, $http, $translate,  $modalInstance,$timeout,operlogParams, UtilService,HttpService) {
	if ($state.current.name == 'main.operlog') {
		$scope.showCategory = true;
	} else {
		$scope.showCategory = false;
	}
	
	$scope.startMaxDate = new Date();
	$scope.endMaxDate = new Date();
	
	//获取上次过滤时的参数
	$scope.filter = {};	
	$scope.filter.category = 0;
	$scope.filter.result = 99;
	
    //操作分类
    $scope.category = {
        options:[]        
    };
    //执行结果
    $scope.result = {
        options:[]
    };
    $http({
    	method : "GET",
    	url : "operlog/categories"
    }).success(function(result){
    	if (angular.isArray(result)){
    		for (var i = 0; i < result.length; i++){
    			var item = {};
    			item.value = result[i].id;
    			item.label = result[i].name;
    			$scope.category.options.push(item);
    		}
    	}
    });
    $http({
    	method : "GET",
    	url : "operlog/results"
    }).success(function(result){
    	if (angular.isArray(result)){
    		for (var i = 0; i < result.length; i++){
    			var item = {};
    			item.value = result[i].id;
    			item.label = result[i].name;
    			$scope.result.options.push(item);
    		}
    	}
    });
    
	$timeout(function(){
		$("#finishTimeStartInput").change(function(){
			var value = $("#finishTimeStartInput").val();
			if (value != "") {
				var d = new Date();
				d.setYear(parseInt(value.substring(0, 4)));
				d.setMonth(parseInt(value.substring(5, 7))-1);
				d.setDate(parseInt(value.substring(8, 10)));
				$scope.endMinDate = d;
			} else {
				$scope.endMinDate = undefined;
			}
			$scope.$digest();
		});
		$("#finishTimeEndInput").change(function(){
			var value = $("#finishTimeEndInput").val();
			if (value != "") {
				var d = new Date();
				d.setYear(parseInt(value.substring(0, 4)));
				d.setMonth(parseInt(value.substring(5, 7))-1);
				d.setDate(parseInt(value.substring(8, 10)));
				$scope.startMaxDate = d;
			} else {
				$scope.startMaxDate = undefined;
			}
			$scope.$digest();
		});
		if(operlogParams != null && angular.isDefined(operlogParams)){
			var lastParams = operlogParams;
			$scope.filter.loginName = lastParams.loginName;
			if(!isEmpty(lastParams.userName)){
				$scope.filter.userName = decodeURIComponent(lastParams.userName);
			}
			$("#finishTimeStartInput").val(lastParams.operTime_from);
			if (lastParams.operTime_from != undefined) {
				var d = new Date();
				d.setYear(parseInt(lastParams.operTime_from.substring(0, 4)));
				d.setMonth(parseInt(lastParams.operTime_from.substring(5, 7))-1);
				d.setDate(parseInt(lastParams.operTime_from.substring(8, 10)));
				$scope.endMinDate = d;
			}
			$("#finishTimeEndInput").val(lastParams.operTime_to);
			if (lastParams.operTime_to != undefined) {
				var d = new Date();
				d.setYear(parseInt(lastParams.operTime_to.substring(0, 4)));
				d.setMonth(parseInt(lastParams.operTime_to.substring(5, 7))-1);
				d.setDate(parseInt(lastParams.operTime_to.substring(8, 10)));
				$scope.startMaxDate = d;
			}
		    $scope.filter.address = lastParams.address;
		    
			if(!isEmpty(lastParams.description)){
			    $scope.filter.description = decodeURIComponent(lastParams.description);
			}
			if (!isEmpty(lastParams.category)) {
				$scope.filter.category = lastParams.category;
			}
			if (!isEmpty(lastParams.result)) {
				$scope.filter.result = lastParams.result;
			}
		}
	});
    
    
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };      
    $scope.reset = function() {
    	$scope.filter.loginName = undefined;
		$scope.filter.userName = undefined;
		$("#finishTimeStartInput").val(""); 
		$("#finishTimeEndInput").val(""); 
	    $scope.filter.address = undefined;
	    $scope.filter.category = 0;
	    $scope.filter.description = undefined;
	    $scope.filter.result = 99;
	    //修改问题单201605190201，解决点击重置按钮后日期控件可选时间段的不生效问题  by ckf6302
	    $scope.startMaxDate = $scope.endMaxDate = new Date();
	    $scope.endMinDate= undefined;
	    
    }
    $scope.ok = function () {
        var params = {};
        if (!isEmpty($scope.filter.loginName)){
        	params.loginName = $scope.filter.loginName;
        }
        if (!isEmpty($scope.filter.userName)){
        	params.userName = encodeURIComponent($scope.filter.userName);
        }
        if (!isEmpty($("#finishTimeStartInput").val())){
        	params.operTime_from = $("#finishTimeStartInput").val().substring(0, 10);
        }
        if (!isEmpty($("#finishTimeEndInput").val())){
        	params.operTime_to = $("#finishTimeEndInput").val().substring(0, 10);
        }
        if (!isEmpty($scope.filter.address)){
        	params.address = $scope.filter.address;
        }
        if ($scope.filter.category != 0){
        	params.category = $scope.filter.category;
        }
        if (!isEmpty($scope.filter.description)){
        	params.description = encodeURIComponent($scope.filter.description);
        }
        if ($scope.filter.result != 99){
        	params.result = $scope.filter.result;
        }
        $rootScope.$broadcast(constant.onFilterOperlogList, params);
        $modalInstance.close(params);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//【系统管理】/用户
routeApp.controller('UserCtrl' ,function($scope, $http, $modal, $translate, $timeout,UtilService, HttpService, GridService){
	$scope.myData=$scope.mySelections=[];
	var column = [
                  { field: 'loginName', displayName: $translate.instant('user.loginName'), sortable: true, width:'10%', cellTemplate:titleTemplate},
                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'10%', cellTemplate:titleTemplate},
                  { field: 'groupName', displayName: $translate.instant('user.userGroup'), sortable: true, width:'7%', cellTemplate:titleTemplate},
                  { field: 'authType', displayName: $translate.instant('user.authentication'), sortable: true, width:'10%', cellFilter: 'authType'},
                  { field: 'ldapsyncname', displayName: $translate.instant('user.ldapStrategyName'), sortable: true, width:'10%'},
                  { field: 'lastLoginTime', displayName: $translate.instant('user.lastLoginTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'13%'},
                  { field: 'email', displayName: $translate.instant('user.email'), sortable: true, width:'10%', cellTemplate:titleTemplate},
                  { field: 'organization', displayName: $translate.instant('user.organization'), sortable: true, width:'10%', cellTemplate:titleTemplate},
                  { field: 'phone', displayName: $translate.instant('user.phone'), sortable: true, width:'10%'},
                  { field: 'state', displayName: $translate.instant('user.userStatus'), sortable: true, width:'10%', cellFilter:'userState'}
                  ]
    
    //动态调整表格大小
    var url = 'user/list';
	$scope = GridService.grid($scope, url, null, null,null, "userlistDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            showSelectionCheckbox: true,
            multiSelect: true,
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
            columnDefs:column
    }; 
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
    $scope.$on("refreshUserList", function(event, msg){
    	$scope.params = {};
    	if (angular.isDefined(msg) && !msg.refreshData) {
    		$scope.params = msg;
    	} 
    	$scope.refreshList();
    });
    $scope.refreshList = function() {
    	$scope.refreshPage();
    	//$scope.gridOptions.selectAll();
		if (angular.isArray($scope.seleteOperator)) {
			$scope.seleteOperator.splice(0, $scope.seleteOperator.length);// clear
		}
		$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
		$scope.gridOptions.$gridScope.model.allSelected = false;
		if (angular.isDefined($scope.gridOptions)) {
			
		}

    }
    //用户过滤
    $scope.userFilter=function(){
        var userFilterModal = $modal.open({
            templateUrl: 'html/modal/systemManage/user/userFilter.html',
            controller: 'userFilterCtrl',
            resolve : {
            	lastParams : function() {
            		return $scope.lastParams;
            	}
            },
            backdrop:'static'
        });
        userFilterModal.result.then(function (selectItem) {
        	if (angular.isDefined(selectItem)){
        		$scope.lastParams = selectItem;
        	}
        }, function (reason) {
        });
    };
    //增加用户
    $scope.addUser=function(){
        var addUserModal = $modal.open({
            templateUrl: 'html/modal/systemManage/user/addUser.html',
            controller: 'addUserCtrl',
            resolve : {type : function() {return "add"},
            		   rowObject : function() {return undefined}},
            backdrop:'static'
        });
        addUserModal.result.then(function () {
        	//$scope.refreshPage();
        }, function (reason) {
        });
    };
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
    //import user
    $scope.importUser = function(rowObject){
    	var importUserModal = $modal.open({
    		templateUrl: 'html/modal/systemManage/user/importUser.html',
    		controller: 'ImportUserCtrl',
            backdrop:'static',
            width:'950px',
            resolve:{
               	type:function(){return "import";},
               	rowObject:function(){return undefined;}
            }
    	});
    	importUserModal.result.then(function () {
        }, function (reason) {
        });
    }
    //delete user
    $scope.deleteUser = function(selectedItem){
    	var modalInstance = UtilService.confirm($translate.instant("user.delSelectedUsers"), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		var usersToDelete = [];
    		if (angular.isArray(selectedItem)){
    			for (var i = 0; i < selectedItem.length; i++){
    				var user = {};
    				user.id = selectedItem[i].id;
    				user.loginName = selectedItem[i].loginName;
    				user.organization = selectedItem[i].organization;
    				usersToDelete.push(user);
    			}
    		}
    		var callback = function(){
    			$scope.refreshPage();
    			$scope.gridOptions.selectAll();
    		};
    		HttpService.put("user/delUsers", usersToDelete, undefined, callback);
    	}, function(){});
    }
});
//【系统管理】/用户分组
routeApp.controller('UserGroupCtrl' ,function($scope, $state, $http, $modal, $translate, $timeout,UtilService, HttpService, GridService){
	var expandColumTitleTemplate = "<span custom-title='{{row.branch[expandingProperty.field]}}' set-td-width='43%' class='gird-ellipsis' style='display:inline-block;vertical-align:middle;'>{{row.branch[expandingProperty.field]}}</span>";
    if (!$scope.orgId) {
    $scope.column = [
                  { field: 'description', displayName: $translate.instant('operator.groupDesc'), sortable: false, width:'20%',cellTemplate:titleTemplate2,cellTemplateScope:$scope},
                  { field: 'orgName', displayName: $translate.instant('user.organization'), sortable: false, width:'15%',cellTemplate:titleTemplate2,cellTemplateScope:$scope},
                  { field: 'oper', visible:$scope.netStrategyMgr, displayName:  $translate.instant('common.oper'), sortable: false, width:'22%',cellTemplate:
                  	 '<div><div style="margin-top:-5px;">'
                	 +'<div ng-if="row.branch.id == 1" type="button" has-permission="USER_GROUP_ADD" class="btn btn-sm-icon icon-add-gray" disabled custom-title="'+$translate.instant('operator.addSubGrp')+'"></div>'
                   	 +'<div ng-if="row.branch.id != 1" type="button" has-permission="USER_GROUP_ADD" class="btn btn-sm-icon icon-add-gray" ng-click="cellTemplateScope.operate(row.branch,\'addChildGrp\')" custom-title="'+$translate.instant('operator.addSubGrp')+'"></div>'
                	 +'<div ng-if="row.branch.id == 1" type="button" has-permission="USER_GROUP_MODIFY" class="btn btn-sm-icon icon-modify-gray" disabled custom-title="'+$translate.instant('operator.modifyGrp')+'"></div>'
                	 +'<div ng-if="row.branch.id != 1" type="button" has-permission="USER_GROUP_MODIFY" class="btn btn-sm-icon icon-modify-gray" ng-click="cellTemplateScope.operate(row.branch,\'modify\')" custom-title="'+$translate.instant('operator.modifyGrp')+'"></div>'
                	 +'<div ng-if="row.branch.id == 1" type="button" has-permission="USER_GROUP_DELETE" class="btn btn-sm-icon icon-delete-gray" disabled custom-title="'+$translate.instant('operator.deleteGrp')+'"></div>'
                	 +'<div ng-if="row.branch.id != 1" type="button" has-permission="USER_GROUP_DELETE" class="btn btn-sm-icon icon-delete-gray" ng-click="cellTemplateScope.del(row.branch)" custom-title="'+$translate.instant('operator.deleteGrp')+'"></div>'
                  	 +'<div type="button" has-permission="USER_GROUP_VIEW" class="btn btn-sm-icon icon-preview-gray" ng-click="cellTemplateScope.viewUserGroup(row.branch)" custom-title="'+$translate.instant('operator.viewGrp')+'"></div>'
                  	 +'</div></div>',cellTemplateScope:$scope
                    }
                  ]
    } else {
    	$scope.column = [
   	                  { field: 'description', displayName: $translate.instant('operator.groupDesc'), sortable: false, width:'35%',cellTemplate:titleTemplate2,cellTemplateScope:$scope},
   	                  { field: 'oper', visible:$scope.netStrategyMgr, displayName:  $translate.instant('common.oper'), sortable: false, width:'22%',cellTemplate:
   	                  	 '<div><div style="margin-top:-5px;">'
   	                	 +'<div ng-if="row.branch.id == 1" type="button" has-permission="USER_GROUP_ADD" class="btn btn-sm-icon icon-add-gray" disabled custom-title="'+$translate.instant('operator.addSubGrp')+'"></div>'
   	                   	 +'<div ng-if="row.branch.id != 1" type="button" has-permission="USER_GROUP_ADD" class="btn btn-sm-icon icon-add-gray" ng-click="cellTemplateScope.operate(row.branch,\'addChildGrp\')" custom-title="'+$translate.instant('operator.addSubGrp')+'"></div>'
   	                	 +'<div ng-if="row.branch.id == 1" type="button" has-permission="USER_GROUP_MODIFY" class="btn btn-sm-icon icon-modify-gray" disabled custom-title="'+$translate.instant('operator.modifyGrp')+'"></div>'
   	                	 +'<div ng-if="row.branch.id != 1" type="button" has-permission="USER_GROUP_MODIFY" class="btn btn-sm-icon icon-modify-gray" ng-click="cellTemplateScope.operate(row.branch,\'modify\')" custom-title="'+$translate.instant('operator.modifyGrp')+'"></div>'
   	                	 +'<div ng-if="row.branch.id == 1" type="button" has-permission="USER_GROUP_DELETE" class="btn btn-sm-icon icon-delete-gray" disabled custom-title="'+$translate.instant('operator.deleteGrp')+'"></div>'
   	                	 +'<div ng-if="row.branch.id != 1" type="button" has-permission="USER_GROUP_DELETE" class="btn btn-sm-icon icon-delete-gray" ng-click="cellTemplateScope.del(row.branch)" custom-title="'+$translate.instant('operator.deleteGrp')+'"></div>'
   	                  	 +'</div></div>',cellTemplateScope:$scope
   	                    }
   	                  ]
    }
    $scope.expandColumn = { field: 'name', displayName: $translate.instant('operator.groupName'),width:'43%',cellTemplate:expandColumTitleTemplate};
    
    $scope.treeData = [];//树展示的数据
    var queryTreeData = function() {
    	var url = "user/subUserGroups";
    	if ($scope.orgId) {
    		var params = {};
    		params.orgId_in = $scope.orgId;
    		params.send_message = true;
    	    var waitModal = UtilService.areawait("userGrouplistDivId",true);
    		$http({
    			method : "GET",
    			url : url,
    			params : params
    		}).success(function(result) {
                if (angular.isArray(result) || (angular.isObject(result) && result.state == 0)) {
                    var groups = angular.isArray(result) ? result : result.data;
                    $timeout(function(){
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
                        	if (groups[i].parentId == null || angular.isUndefined(groups[i].parentId)) {
                        		$scope.treeData.push(groups[i]);
                        	}
                        }
                    });
                }
                UtilService.dismissAreawait(waitModal);
                UtilService.handleResult(result);
            }).error(function(response, code, headers, config) {
            	UtilService.dismissAreawait(waitModal);
                UtilService.handleError(code);
            });
    	} else {
    	    var waitModal = UtilService.areawait("userGrouplistDivId",true);
    	    var params = {};
    	    if($state.current.name == 'main.cloudMessage') {
    	    	params.send_message = true;
    	    }
    	    $http({
    			method : "GET",
    			url : url,
    			params : params
    		}).success(function(result) {
                if (angular.isArray(result) || (angular.isObject(result) && result.state == 0)) {
                    var groups = angular.isArray(result) ? result : result.data;
                    $timeout(function(){
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
                        	if (groups[i].parentId == null || angular.isUndefined(groups[i].parentId)) {
                        		$scope.treeData.push(groups[i]);
                        	}
                        }
                    });
                }
                UtilService.dismissAreawait(waitModal);
                UtilService.handleResult(result);
            }).error(function(response, code, headers, config) {
            	UtilService.dismissAreawait(waitModal);
                UtilService.handleError(code);
            });
    	}
           
    };
    queryTreeData();
    
    //注册刷新
    $scope.$on('onQueryUserGroupList', function(event, msg) {
        $scope.refreshPage();
    });
    //刷新树
    $scope.refreshPage = function() {
        $scope.treeData.splice(0, $scope.treeData.length);//清空树节点数据重新加载
        queryTreeData();
    }
    //增加用户分组
    $scope.addUserGroup=function(){
        var addUserGrpModal = $modal.open({
            templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
            controller: 'addUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	type:function(){return "addGrp";},
            	rowObj:function(){return undefined;}
            }
        });
        addUserGrpModal.result.then(function () {
        	$scope.refreshPage();
        }, function (reason) {
        });
    };
    //增加子分组/修改/查看
    $scope.operate=function(rowObj,type){
    	if (type == 'modify' && rowObj.id == 1){
    		UtilService.error($translate.instant("user.modifyDefAlert"), $translate.instant("common.opertip"));
    		return;
    	}
    	if (type == 'addChildGrp' && rowObj.id == 1){
    		UtilService.error($translate.instant("user.addChildDefAlert"), $translate.instant("common.opertip"));
    		return;
    	}
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
        	$scope.refreshPage();
        }, function (reason) {
        });
    };
    
    $scope.viewUserGroup=function(rowObj){
//    	rowObj.orgName = $stateParams.name;
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
            HttpService.put("user/delUserGroup", model, undefined, $scope.refreshPage);
        }, function () {
        });
    };
});
//-------------------------------------------------- 弹出对话框控制器 ----------------------------------------------
//操作员过滤控制器
routeApp.controller('operatorFilterCtrl',function($scope, $http, $translate, $modalInstance, operatorGroups, filter, HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象

    //认证方式
    $scope.authMode = {
       options:[{value:'0', label:$translate.instant('operator.pwdAuth')},
               {value:'1', label:$translate.instant('operator.ldapAuth')}]
    };
    
    //状态
    $scope.enable = {
		options:[{value:'1', label:$translate.instant('common.enable')},
		         {value:'0', label:$translate.instant('common.forbidden')}]
    }
    
    $scope.operatorGroup = [];
    if (angular.isArray(operatorGroups)) {
    	for (var i = 0; i < operatorGroups.length; i++) {
    		var option = {};
    		option.value = operatorGroups[i].id;
    		option.label = operatorGroups[i].name;
    		$scope.operatorGroup.push(option);
    	};
    }
    
    if (angular.isDefined(filter)) {
		if (!isEmpty(filter.loginName)) {
			$scope.entry.loginName = filter.loginName;
		}
		if (!isEmpty(filter.authType)) {
			$scope.entry.authType = filter.authType;
		}
		if (!isEmpty(filter.userName)) {
			$scope.entry.userName = decodeURIComponent(filter.userName);
		}
		if (!isEmpty(filter.groupId)) {
			$scope.entry.operatorGrp = filter.groupId;
		}
		if (!isEmpty(filter.email)) {
			$scope.entry.email = filter.email;
		}
		if (!isEmpty(filter.enable)) {
			$scope.entry.enable = filter.enable;
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
//增加操作员控制器
routeApp.controller('addOperatorCtrl',function($scope,$rootScope, $http, $compile, $translate, $modalInstance, operator, type,pwdConf, HttpService, UtilService) {
	$scope.operator = {};
	$scope.operator.disable = false;
	$scope.operator.resetPassword = false;
	$scope.entry = {};//用于向后台发送参数的对象    
    $scope.entry.onlineNum = 0;
    $scope.entry.authType = 0;
    $scope.entry.enable = 1;
    $scope.type = type;
    
    $scope.group = {};
    $scope.pwd = {};
    $scope.pwdConf = {};
    $scope.pwdConf.complex = 0;
    if (angular.isDefined(pwdConf)) {
        $scope.pwdConf = pwdConf;
    }
    $scope.isUsbKeyAuth = false;
    if (!isEmpty(operator)) {
    	$scope.isUsbKeyAuth = 3 == operator.authType;
    	$scope.operator.oldAuthType = operator.authType;
    }
    /*$scope.$watch('entry.password', function(newValue, oldValue) {
        if (newValue == oldValue) {
            return;
        }
        $scope.pwd.confirm = "";
    });*/
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
    }
    $scope.securityMode = 0;
	$http.get("systemConfig/sysConfig?type=sys_conf").success(function(result){
		if (result.data["security.mode.enable"] == "1") {
			$scope.entry.onlineNum = 1;
			$scope.securityMode = 1;
 	   	}
	})
	if (!$scope.isUsbKeyAuth) {		
		$http.get("systemConfig/sysConfig?type=cer_config").success(function(result){
			if (!isEmpty(result.data["cer.file"])) {
				$scope.isUsbKeyAuth = true;
				 $scope.entry.authType = 3;
			}
		})
	}
    $scope.isShowOnly = function() {
        //如果是查看或者是修改admin用户,权限树为只读状态
        if (type == "view") {
            return true;
        } else {
            return false;
        }
    }
    if (type == 'modify' && operator.id == 1) {
        $scope.modefyAdmin = true;
    } else {
        $scope.modefyAdmin = false;
    }
    
    $scope.title = $translate.instant('operator.addOperator');
    $scope.checkNameParam = {};         //重名检查参数
    if (type == "view" || type == "modify") {
        $scope.entry = operator;
        $scope.pwd.oldPwd = null;
        $scope.pwd.pwdConfirm = null;
        $scope.pwd.newPwd = null;
        $scope.group.id = operator.groupId;
        $scope.group.name = operator.operatorGroup;
        $scope.pwd.confirm = operator.password;
        $scope.group.mode = operator.groupMode;
        $scope.operator.disable = 0 == $scope.entry.enable;
        if (angular.isDefined(operator.accessStrategy)) {
        	$scope.accessStrategyName = operator.accessStrategy.name;
            $scope.entry.accessStrategyId = operator.accessStrategy.id;

        }
                
        $scope.entry.ldapServerId = operator.ldapServerId;
        if (type == "view") {
        	$scope.title = $translate.instant('operator.viewOperator');
        	$scope.selectNodes = operator.finalPermissions;
        	$scope.groupPermissions = operator.groupPermissions;
        } else {
        	$scope.title = $translate.instant('operator.modifyOperator');
        	$scope.selectNodes = operator.permissions;
        	$scope.checkNameParam.id = operator.id;
        	$scope.groupPermissions = operator.groupPermissions;
        }
    }
    //重名检查参数赋值
    $scope.$watch('entry.loginName', function(newValue, oldValue) {
        $scope.checkNameParam.loginName = newValue;
    });
    $scope.$watch('entry.email', function(newValue, oldValue) {
        $scope.checkNameParam.email = newValue;
    });
    
    $scope.$watch('group.mode', function(newValue, oldValue) {
        if (newValue == 1 || newValue == 2 ) {
     	   $scope.modifyPermission = true;
     	   $scope.selectNodes = $scope.groupPermissions;
        } else {
     	   $scope.modifyPermission = false;
        } 
     });
    
  //查询所有ldap服务器
	var getAllLdapServer = function() {
//    	 var waitModal = UtilService.wait();
    	 $http.get('ldap/getAllLdapServer')
    	 .success(function(result) {
//    		 waitModal.dismiss();
    		 var datas = result.data;
    		 for (var i = 0; i < datas.length; i++) {
    			 var id = datas[i].id;
    			 var name = datas[i].name;
    			 var optionNode = {value:id, label:name};
    			 $scope.ldapServer.options.push(optionNode);
    		 }
    	 }).error(function(response, code, headers, config) {
//       	    waitModal.dismiss();
    	    UtilService.handleError(code);
    	 });
	};
	getAllLdapServer();
    
    //认证方式
    $scope.authMode = {
       options:[{value:0, label:$translate.instant('operator.pwdAuth')},
               {value:1, label:$translate.instant('operator.ldapAuth')}]
    };
    $scope.authModeUsbkey = {
			options:[{value:3, label:$translate.instant('operatorUSBKeyAuth')}]
	};
	$scope.ldapServer = {      
	        options:[]
	};
    
    //步骤提示的显示
    $scope.guidStep = [ $translate.instant('operator.basicInfo'),
                        $translate.instant('operator.permissionConfig')];
    
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true") {
            	if ($scope.entry.authType == 1) {
            		if ($scope.entry.ldapServerId) {
            			return true;
            		} else {
            			return false;
            		}
            	}
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
    
    // lldp切换到密码认证时，如果原来有密码的需要输入旧密码才能修改密码
    $scope.isNeedOldPwd = true;
    $scope.$watch('entry.authType', function(newValue, oldValue) {
        if ($scope.operator.oldAuthType == 1 && newValue == 0) {
        	if (!isEmpty(operator.password)) {
        		$scope.isNeedOldPwd = true;
//        		$scope.operator.resetPassword = true;
        	} else {
        		$scope.isNeedOldPwd = false;
        	}
        } else if ($scope.operator.oldAuthType == 0 && newValue == 0 && isEmpty(operator.password)) {
        	$scope.isNeedOldPwd = false;
        }
    });
    
    /*issues:201607160061	--by ckf6302*/
    //201612200533 ---by l12838
    $scope.nextCallBack = {
        '1': function() {
        	$scope.isNext = true;
        	var flag = false;
        	if ($scope.entry.authType == 1 || $scope.entry.authType == 3 || $scope.operator.resetPassword == false) {
        		flag = true;
        	} else if ($scope.entry.authType == 0 && $scope.pwd.newPwd != $scope.pwd.pwdConfirm) {
            	UtilService.alert($translate.instant('pwdMatch'), $translate.instant('common.opertip'), false, 'error');
            } else if ($scope.entry.authType == 0 && $scope.pwd.newPwd == $scope.pwd.pwdConfirm) {
        		$.ajax({
        			type : 'GET',
        			url : 'operator/checkOperatorPassword',
        			async : false,
        			data : {"loginName":operator.loginName, "checkPwd":$scope.pwd.oldPwd},
        			dataType : 'json',
        			success : function (result) {
        				if (!result) {
        					$scope.isNext = false;
        					UtilService.alert($translate.instant('operator.initialPwdIsWrong'), $translate.instant('common.opertip'), false, 'error');
        				} else {
        					flag  = true;
        				}
        			}
        			
        		})
        	}
        	return flag;
        }
    };
    
    //增加按钮栏插件
    $scope.addPlug = {
            '1': function() {
                //向plugin插入组件
                var menuPlug = '<div style="float:left;"><button class="btn btn-green" id="collapseTreeId" ng-click="toggleTree()">'
                    + collapseTree +'</button></div>';
               if ($scope.isNext) {
            	   var template = angular.element(menuPlug);
                   var cElement = $compile(template)($scope);
                   return cElement;
               }
               return "";
            }
    };
    $scope.formPluginId = 'addOperatorForm';
    
    //默认树时展开的
    $scope.isExpand = true;
    var collapseTree = $translate.instant('systemMng.collapseTree');
    $scope.toggleTree = function() {
        if ($scope.isExpand) {
            $scope.isExpand = false;
            $("#permissionTree").treeview("collapseAll");
            collapseTree = $translate.instant('systemMng.expandTree');
            $("#collapseTreeId").text(collapseTree);
        } else {
            $scope.isExpand = true;
            $("#permissionTree").treeview("expandAll");
            collapseTree = $translate.instant('systemMng.collapseTree');
            $("#collapseTreeId").text(collapseTree);
        }
    }
    
    $scope.selectGroups = function() {
    	var groupInstance = UtilService.lgmodal('html/modal/common/operatorGroupSelector.html', 'operatorGroupSelectCtrl');
    	groupInstance.result.then(function () {
        }, function (reason) {
      	   if (angular.isDefined(reason) && reason != 'cancel') {
      		  // 点击了确定按钮
      		  $scope.group.id = reason.id;
      		  $scope.group.name = reason.name;
      		  $scope.group.mode = reason.mode;
      		  //选择分组后查询分组打权限信息
              $http.get('operator/group/' + reason.id + '/details')
              .success(function(result) {
                  if (result.state == 0) {
                      $scope.groupPermissions = result.data.permissions;
                      if (reason.mode == 1 || reason.mode == 2) {
                    	  $scope.modifyPermission = true;
                    	  $scope.selectNodes = result.data.permissions;
                      } else {
                    	  $scope.modifyPermission = false;
                      } 
                  }
                  UtilService.handleResult(result);
              }).error(function(response, code, headers, config) {
                  UtilService.handleError(code);
              });
      	   };
        });
    };
    $scope.selectAccess = function() {
    	//201612300073 判断操作员是否有查看访问策略的权限   l12838
    	if ($rootScope.permissions.contains(constant.ACCESS_STRATEGY_VIEW)) {
    		var accessInstance = UtilService.lgmodal('html/modal/common/accessStrategySelector.html', 'accessStrategySelectCtrl');
    		accessInstance.result.then(function () {
    		}, function (reason) {
    			if (angular.isDefined(reason) && reason != 'cancel') {
    				// 点击了确定按钮
    				$scope.entry.accessStrategyId = reason.id;
    				$scope.accessStrategyName = reason.name;
    			};
    		});
    	}else {
    		UtilService.alert($translate.instant('operator.accessStrategyViewIsNotSet'), $translate.instant('common.opertip'), false, 'error');
    	}
    };
    $scope.clearAccess = function() {
    	$scope.accessStrategyName = undefined;
    	$scope.entry.accessStrategyId = undefined;
    };
    
    //set params
    var setParams = function() {
    	
//    	if ($scope.entry.authType == 1) {
//    		$scope.entry.password = "";
//        }
    	if ($scope.entry.authType == 0) {
    		$scope.entry.ldapServerId = null;
        }
    	//set operator group 
    	if (angular.isDefined($scope.group.id)) {
    		$scope.entry.operatorGroups = [];
    		$scope.entry.operatorGroups.push($scope.group);
    	}
    	//set permissions
    	var tree = $('#permissionTree').data('treeview');
    	var checkedNodes = tree.getChecked();
    	if (angular.isDefined($scope.entry.permissions)) {
			$scope.entry.permissions.splice(0, $scope.entry.permissions.length);
		} else {
			$scope.entry.permissions = [];
		}
    	if (angular.isArray(checkedNodes) && checkedNodes.length > 0) {
    		for (var pIndex = 0; pIndex < checkedNodes.length; pIndex++) {
    		    //过滤掉用户分组的权限
                if ($scope.entry.id!=1 && $scope.groupPermissions.contains(checkedNodes[pIndex].entryId)) {
                    continue;
                }
    			var p = {};
    			p.permissionId = checkedNodes[pIndex].entryId;
    			$scope.entry.permissions.push(p);
    		};
    	};
    	
    	if ($scope.type == 'modify') {
    		//clear data not in Operator Object
    		$scope.entry.finalPermissions = undefined;
    		$scope.entry.accessStrategy = undefined;
    		$scope.entry.operatorGroup = undefined;
    		$scope.entry.groupId = undefined;
    	};
    	if ($scope.operator.disable) {
    	    $scope.entry.enable = 0;
    	} else {
    	    $scope.entry.enable = 1;
    	};
    };
    //callback function to refresh operator list
    var refreshList = function() {
    	$scope.$root.$broadcast('onQueryOperatorList', {});
    	$modalInstance.dismiss("cancel");
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
    	if ($scope.type == 'view') {
    		$modalInstance.dismiss('cancel');
    	} else if ($scope.type == 'modify') {
    		//clear permisstion first before set params
    		setParams();
    		var putdata = angular.copy($scope.entry);
            putdata.loginName = UtilService.encryptByDES(putdata.loginName);
            putdata.password = UtilService.encryptByDES(putdata.password);
            if ($scope.operator.resetPassword&&$scope.entry.authType==0) {
            	putdata.password = UtilService.encryptByDES($scope.pwd.pwdConfirm);
            }
    		HttpService.put('operator/modify', putdata, $modalInstance, refreshList);
    	} else if ($scope.type == 'add') {
	    	setParams();
	    	var postdata = angular.copy($scope.entry);
            postdata.loginName = UtilService.encryptByDES(postdata.loginName);
            postdata.password = UtilService.encryptByDES(postdata.password);
	        HttpService.post('operator/add', postdata, $modalInstance, refreshList);
    	}
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
//增加操作员分组控制器
routeApp.controller('addOperatorGroupCtrl',function($scope, $http,$compile, $translate, $modalInstance, group, type, parentId, parentMode, level,  HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象    
    $scope.entry.flag = 0;
    
    $scope.type = type;
    $scope.isChild = false;
    $scope.title = $translate.instant('operator.addGrp');
    $scope.checkNameParam = {};
    if (angular.isNumber(parentId)) {    	
		$scope.isChild = true;
    	$scope.entry.parentId = parentId;
    	$scope.title = $translate.instant('operator.addSubGrp');
    	 // 父节点为安全审计员组
        if ((angular.isNumber(parentMode) && parentMode == 1)) {
        	$scope.selectNodes = group.permissions;
        }
    }
    if (type == 'add') {
    	if ($scope.isChild == true) {
    		$scope.entry.level = level + 1;
    	} else {
    		$scope.entry.level = 1;
    	}
    } else if (type == "view" || type == "modify") {
    	$scope.entry = group;         
    	$scope.selectNodes = group.permissions;
    	
        if (type == "view") {
        	$scope.title = $translate.instant('operator.viewGrp');
        } else {
        	$scope.title = $translate.instant('operator.modifyGrp');
        	$scope.entry.grpCode = undefined;
        	$scope.entry.subGroups = undefined;
        	$scope.entry.code = group.grpGode;
        	$scope.checkNameParam.id = group.id;
        }
    }
    
    //重名检查参数赋值
    $scope.$watch('entry.name', function(newValue, oldValue) {
        $scope.checkNameParam.groupName = newValue;
    });
    $scope.isShowOnly = function() {
        //如果是查看或者是修改admin用户,权限树为只读状态
        if (type == "view") {
            return true;
        } else {
            return false;
        }
    }
    
//  if (type == 'modify' && group.id == 1) {
//  $scope.modefyDefault = false;
//} else {
//  $scope.modefyDefault = false;
//}
    //修改系统操作员分组不能修改权限
	if ((angular.isNumber(parentMode) && (parentMode == 1 || parentMode == 2)) || 
			(angular.isDefined(group) && (group.mode == 1 || group.mode == 2 || group.id == 1))) {
		$scope.modefyDefault = true;    	
	} else {
		$scope.modefyDefault = false;    	
	}
    
    //步骤提示的显示
    $scope.guidStep = [ $translate.instant('operator.basicInfo'),
                        $translate.instant('operator.permissionConfig')];
    
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#addOpGroupForm1').val() === "true") {
                return true;
            }
            return false;
        },
        stepTwoOver : function() {
            if ($('#addOpGroupForm2').val() === "true")
                return true;
            return false;
        }
    };
    
    //set params
    var setParams = function() {
    	//set permissions
    	var tree = $('#groupPermissionTree').data('treeview');
    	var checkedNodes = tree.getChecked();
    	if (angular.isDefined($scope.entry.permissions)) {
			$scope.entry.permissions.splice(0, $scope.entry.permissions.length);
		} else {
			$scope.entry.permissions = [];
		}
    	if (angular.isArray(checkedNodes) && checkedNodes.length > 0) {
    		for (var pIndex = 0; pIndex < checkedNodes.length; pIndex++) {
    			var p = {};
    			p.permissionId = checkedNodes[pIndex].entryId;
    			$scope.entry.permissions.push(p);
    		};
    	};
    	
    	if ($scope.type == 'modify') {
    		//clear data not in Operator Object
    		
    	};
    };
    
  //增加按钮栏插件
    $scope.addPlug = {
            '1': function() {
                //向plugin插入组件
                var menuPlug = '<div style="float:left;"><button class="btn btn-green" id="collapseTreeId" ng-click="toggleTree()">'
                    + collapseTree +'</button></div>';
               var template = angular.element(menuPlug);
               var cElement = $compile(template)($scope);
               return cElement;
            }
    };
    //配合获取footerPlugin的id,解决201607280470
    $scope.formPluginId = 'addOperatorGroupForm';
    //默认树时展开的
    $scope.isExpand = true;
    var collapseTree = $translate.instant('systemMng.collapseTree');
    $scope.toggleTree = function() {
        if ($scope.isExpand) {
            $scope.isExpand = false;
            $("#groupPermissionTree").treeview("collapseAll");
            collapseTree = $translate.instant('systemMng.expandTree');
            $("#collapseTreeId").text(collapseTree);
        } else {
            $scope.isExpand = true;
            $("#groupPermissionTree").treeview("expandAll");
            collapseTree = $translate.instant('systemMng.collapseTree');
            $("#collapseTreeId").text(collapseTree);
        }
    }
    //callback function to refresh operator list
    var refreshList = function() {
    	$scope.$root.$broadcast('onQueryOperatorGroupList');
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
    	$scope.entry.name = $scope.entry.name.trim();
    	if (type == 'add') {
    		setParams();
    		var entryObj=angular.copy($scope.entry);
    		if(entryObj.flag){
    			entryObj.flag=1;
    		}else{
    			entryObj.flag=0;
    		}
    		HttpService.post('operator/group/add', entryObj, $modalInstance, refreshList);
    	} else if (type == 'modify') {
    		setParams();
    		var entryObj=angular.copy($scope.entry);
    		if(entryObj.flag){
    			entryObj.flag=1;
    		}else{
    			entryObj.flag=0;
    		}
    		HttpService.put('operator/group/modify', entryObj, $modalInstance, refreshList);
    	} else if (type == 'view') {
    		$modalInstance.dismiss('cancel');
    	}
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
//增加访问控制策略控制器
routeApp.controller('addAccessStrategyCtrl',function($scope, $http, $modal, $timeout, $translate, $modalInstance, access, type,  HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象    
    $scope.type = type;
    $scope.entry.defaultAccessAction = '1';
    $scope.entry.accessRules = [];       //访问规则：starIp,endIp,action
    $scope.showAddRuleBtn = true;
    
    $scope.checkNameParam = {};//重名检查需要的参数
    $scope.entry.frequency = 0;
    //星期
    $scope.week = {
        options : [{value:0, label:$translate.instant('cloudResource.monday')},
                   {value:1, label:$translate.instant('cloudResource.tuesday')},
                   {value:2, label:$translate.instant('cloudResource.wednesday')},
                   {value:3, label:$translate.instant('cloudResource.thursday')},
                   {value:4, label:$translate.instant('cloudResource.friday')},
                   {value:5, label:$translate.instant('cloudResource.saturday')},
                   {value:6, label:$translate.instant('cloudResource.sunday')}]
    };
    // 时间
    $scope.timeGroup = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    
    $scope.$watch("entry.frequency", function(newValue, oldValue){
    	if (typeof(oldValue) != 'undefined' && newValue != oldValue) {
    		if(newValue == 1){
    			// 选择每周
    			$scope.entry.dateStart = 0;
    			$scope.entry.dateEnd = 4;
    		} else {
    			$scope.entry.dateStart = undefined;
    			$scope.entry.dateEnd = undefined;
    		}
    	}
	})
	
    //修改对话框标题
    if (type == "view") {
        $scope.accessOprType = false;//是否显示规则编辑框
        $scope.showAddRuleBtn = false;
        $scope.addTitle = $translate.instant('securityMng.viewAccessStrategy'); //修改对话框标题
    } else if (type == "modify") {
        $scope.showAddRuleBtn = true;
        $scope.accessOprType = true;
        $scope.addTitle = $translate.instant('securityMng.modifyAccessStrategy');
    } else {
        $scope.showAddRuleBtn = true;
        $scope.accessOprType = true;
        $scope.addTitle = $translate.instant('securityMng.addAccessStrategy');
    }
    if (type == "modify" || type == "view") {
        $scope.entry = access;
        $scope.entry.defaultAccessAction=(access.defaultAccessAction).toString();
        $scope.entry.description = access.description == 'null' ? undefined : access.description;
        
		if($scope.entry.accTimer){
			$timeout(function(){
				var accTimerList = $scope.entry.accTimer.split(",");
				if(angular.isArray(accTimerList)){
					for(var i = 0; i < accTimerList.length; i++){
						$("#accTimer").find("td#"+accTimerList[i]).addClass("td-checked");
					}
				}
	        });
		}
		$scope.checkNameParam.id = access.id;
		$scope.$watch('access.name', function(newValue, oldValue) {
			if (newValue) {
				$scope.checkNameParam.name = newValue.trim();
    }
		});
    }
    $scope.accessType = {       //默认访问类型
        options:[{value:'1', label:$translate.instant('securityMng.enable')},
                 {value:'0', label:$translate.instant('securityMng.refuse')}]
    };
    
    $scope.isShowAccessOnly = function() {
        return type == "view";
    }
    
    var getRuleIndex = function(ruleArray, rule) {
        if (angular.isArray(ruleArray)) {
            for (var i = 0; i < ruleArray.length; i++) {
                if (angular.equals(rule, ruleArray[i])) {
                    return i;
                };
            }
            return -1;
        } else {
            return -1;
        };
    }
    
    //打开增加访问策略规则对话框
    $scope.addAccessRule = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/systemManage/addAccessRule.html',
            controller: 'addAccessRuleCtrl',
            backdrop:'static',
            size:'mg',
            resolve: {
                rule : function() {
                    return null;
                },
                type: function() {
                    return "add";
                },
                accessRules: function() {
                    return $scope.entry.accessRules;
                },
                defaultAccessAction: function() {
                	return $scope.entry.defaultAccessAction;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            
        }, function () {
            //$scope.addRule();   //向规则列表添加规则 
            //$scope.$broadcast('onQueryAccessRuleConfig', null);
        });
    };
    
    /*$scope.addRule = function() {
        var rule = {};


        rule.startIp = $scope.startIp;
        rule.endIp = $scope.endIp;
        rule.action = $scope.accessAction;
        if (getRuleIndex($scope.entry.accessRules, rule) == -1) {      //rule不存在再添加
            $scope.entry.accessRules.push(rule);
        };
    }*/

    
    $scope.deleteRule = function(rule) {
    	var modalInstance = UtilService.confirm($translate.instant('securityMng.delRuleConfirm',{startIp:rule.startIp,endIp:rule.endIp}),$translate.instant('operConfirm'));
        modalInstance.result.then(function (selectedItem) {
            var index = getRuleIndex($scope.entry.accessRules, rule);
            if (index > -1) {
                $scope.entry.accessRules.splice(index ,1);
            };
        }, function () {
        });
    }
  
    //修改访问策略规则
    $scope.editAccessRule = function(rule) {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/systemManage/addAccessRule.html',
            controller: 'addAccessRuleCtrl',
            backdrop:'static',
            size:'mg',
            resolve: {
                rule : function() {
                    return rule;
                },
                type: function() {
                    return "edit";
                },
                accessRules: function() {
                    return $scope.entry.accessRules;
                },
                defaultAccessAction: function() {
                	return null;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            
        }, function () {
            //$scope.addRule();   //向规则列表添加规则 
            //$scope.$broadcast('onQueryAccessRuleConfig', null);
        });
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
        //若没有访问规则，不允许增加和修改
    	var accRuleCanEmpty = false;
    	// 如果默认访问类型为允许并且设置了访问时间则访问规则允许为空 否则不允许为空
    	
    		if ($scope.entry.frequency == 1 || $scope.entry.frequency == 2) {
            	var checked =[];
            	$("#accTimer").find("td.td-checked").each(function(){
            		checked.push($(this).attr("id"));
            	});
            	
            	if (checked.length == 0) {
            		UtilService.alert($translate.instant('securityMng.checkTimer'), $translate.instant('common.opertip'));
            		return;
            	}
            	
            	$scope.entry.accTimer = checked.join();
            	if ($scope.entry.defaultAccessAction == 1) {
            		accRuleCanEmpty  = true;
            	}
            } else {
            	$scope.entry.accTimer = undefined;
            }
    	
    	if (!accRuleCanEmpty) {
    		if ($scope.entry.accessRules.length == 0) {
                UtilService.alert($translate.instant('securityMng.accessStrategyNoRuleError'), $translate.instant('common.opertip'), false, 'error');
                return;
            }
    	}
    	
        //默认访问类型和规则中的访问类型不能全部一致。
        var accessRules = $scope.entry.accessRules;
        var defaultAccessAction = $scope.entry.defaultAccessAction;
        var accessCheck = false;
        if ($scope.entry.accessRules.length > 0) {
        	for (var i = 0; i <  accessRules.length; i++) {
                var accessRule = accessRules[i];
                if (accessRule.accessAction != null && defaultAccessAction != accessRule.accessAction) {
                    accessCheck = true;
                }
            }
        	if (!accessCheck) {
                UtilService.alert($translate.instant('securityMng.accessRuleActioniErr'), $translate.instant('common.opertip'), false, 'error');
                return;
            }
        } 
        
        if ($scope.entry.frequency == 1) {
        	 if ($scope.entry.dateStart > $scope.entry.dateEnd) {
         		UtilService.alert($translate.instant('securityMng.checkDate'), $translate.instant('common.opertip'));
         		return;
         	}
        }
        
        if (type == "add") {
            HttpService.post('accessStrategy/add', $scope.entry, $modalInstance);
        } else {
            HttpService.put('accessStrategy/modify', $scope.entry, $modalInstance);
        }
  
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
//增加访问策略规则控制器
routeApp.controller('addAccessRuleCtrl',function($scope, $http, $translate, $modalInstance, $modal, type, rule, accessRules, defaultAccessAction, UtilService) {
	$scope.action = {};
    $scope.accessType = {       //默认访问类型
            options:[{value:'1', label:$translate.instant('securityMng.enable')},
                     {value:'0', label:$translate.instant('securityMng.refuse')}]
        };
    
    if (type == "edit") {
    	$scope.accessRultTitle=$translate.instant('securityMng.modifyRule');
    	$scope.action.accessAction = rule.accessAction;
        $scope.startIp = rule.startIp;
        $scope.endIp = rule.endIp;
    } else {
    	$scope.accessRultTitle=$translate.instant('securityMng.addRule');
    	if (defaultAccessAction == 0 ) {
        	$scope.action.accessAction = 1;
        } else {
        	$scope.action.accessAction = 0;
        }
        $scope.startIp = null;
        $scope.endIp = null;
    }
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    $scope.ok = function () {

        var startIpStr = $scope.startIp;
        var endIpStr = $scope.endIp;
        var startIpNum = ip2Number(startIpStr);
        var endIpNum = ip2Number(endIpStr);
        
        //校验起始Ip不能大于结束IP
        if (parseInt(startIpNum) > parseInt(endIpNum)) {
            UtilService.alert($translate.instant('securityMng.startIpGreaterThenEndIp'), $translate.instant('common.opertip'), false, 'error');
            return;
        }
        
        if (type == "edit") {
            var modifyAccessRules = [];
            modifyAccessRules = accessRules.concat();
            var index = getRuleIndex(modifyAccessRules, rule);
            if (index > -1) {
                
                modifyAccessRules.splice(index ,1);//移除自身用于冲突校验
                
                //检验规则ip是否重叠
                var ipCoveredRule = checkSameRule(startIpStr, endIpStr, modifyAccessRules);
                if (ipCoveredRule != null) { //若有规则的IP冲突，弹出提示信息
                    UtilService.alert($translate.instant('securityMng.ruleIpAddrCovered',{value1:ipCoveredRule.startIp,value2:ipCoveredRule.endIp}), $translate.instant('common.opertip'), false, 'error');
                    return;
                }
                var modifyRule = accessRules[index];
                modifyRule.startIp = $scope.startIp;
                modifyRule.endIp = $scope.endIp;
                modifyRule.accessAction = $scope.action.accessAction;
            };
        } else {
            //检验规则ip是否重叠
            var ipCoveredRule = checkSameRule(startIpStr, endIpStr, accessRules);
            if (ipCoveredRule != null) { //若有规则的IP冲突，弹出提示信息
                UtilService.alert($translate.instant('securityMng.ruleIpAddrCovered',{value1:ipCoveredRule.startIp,value2:ipCoveredRule.endIp}), $translate.instant('common.opertip'), false, 'error');
                return;
            }
            
            
            $scope.$parent.accessAction = $scope.action.accessAction;
            $scope.$parent.startIp = $scope.startIp;
            $scope.$parent.endIp = $scope.endIp;
            
            var accessRule = {};
            accessRule.startIp = $scope.startIp;
            accessRule.endIp = $scope.endIp;
            accessRule.accessAction = $scope.action.accessAction;  //0 拒绝
            if (getRuleIndex(accessRules, accessRule) == -1) {      //accessRule不存在再添加
                accessRules.push(accessRule);
            };
        }
        $modalInstance.dismiss($scope.rule);
    };
  
    var getRuleIndex = function(ruleArray, rule) {
        if (angular.isArray(ruleArray)) {
            for (var i = 0; i < ruleArray.length; i++) {
                if (angular.equals(rule, ruleArray[i])) {
                    return i;
                };
            }
            return -1;
        } else {
            return -1;
        };
    }
  //IP转成整型
    ip2Number = function(ipAddr) {
    	var num = 0;
    	var ip = ipAddr.split(".");
    	num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256
    			+ Number(ip[2]) * 256 + Number(ip[3]);
    	num = num >>> 0;
    	return num;
    }

    //整型解析为IP地址
    number2IP = function (num) {
    	var str;
    	var tt = new Array();
    	tt[0] = (num >>> 24) >>> 0;
    	tt[1] = ((num << 8) >>> 24) >>> 0;
    	tt[2] = (num << 16) >>> 24;
    	tt[3] = (num << 24) >>> 24;
    	str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "."
    			+ String(tt[3]);
    	return str;
    }
    //将IP转为long型
    ipToLong = function(ipStr) {
        var ip = [];
        var position1 = ipStr.indexOf(".");
        var position2 = ipStr.indexOf(".", position1 + 1);
        var position3 = ipStr.indexOf(".", position2 + 1);
        ip[0] = ipStr.substring(0, position1);
        ip[1] = ipStr.substring(position1 + 1, position2);
        ip[2] = ipStr.substring(position2 + 1, position3);
        ip[3] = ipStr.substring(position3 + 1);
        return (ip[0] << 24) + (ip[1] << 16) + (ip[2] << 8) + (ip[3] << 0);
    }
    
    
    //检测规则IP是否有重复的区间。
    checkSameRule = function(startIpStr, endIpStr, pushedAccessRules) {
        if (pushedAccessRules != null && pushedAccessRules.length != 0) {
            //获取输入的开始IP与结束IP
            var sIp = ip2Number(startIpStr);
            var eIp = ip2Number(endIpStr);
            for (var i = 0; i <  pushedAccessRules.length; i++) {
                var start = ip2Number(pushedAccessRules[i].startIp);
                var end = ip2Number(pushedAccessRules[i].endIp);
                if (sIp >= start && sIp <= end) {
                    return pushedAccessRules[i];
                } else if (eIp >= start && eIp <= end) {
                    return pushedAccessRules[i];
                } else if (start >= sIp && start <= eIp) {
                    return pushedAccessRules[i];
                } else if (end >= sIp && end <= eIp) {
                    return pushedAccessRules[i];
                };
            };
        }
        return null;
    }
    
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//License详细信息
routeApp.controller('LicenseDetailsCtrl',function($scope, $http,HttpService, $translate, UtilService, HttpService) {
    $scope.model = {};//用于向后台发送参数的对象   
	$scope.license = {};
	$scope.licenseType = null;
    //添加假数据
    $scope.model.canMngCpuAmount=0;
    $scope.model.alreadyMngCpuAmount=1;
    //获取License信息函数
	$scope.getLicenseInfo = function() {
		$http.get('license/licenseInfo').success(function(result) {
			if (result.success) {
				$scope.license = result.data;
				if ($scope.license.timeStr == '-1') {
					$scope.license.validPeriodStr = $translate.instant('licenseMng.foreverValid');
				} else {
					$scope.license.validPeriodStr = $translate.instant('licenseMng.licenseTime', {value: $scope.license.validPeriod});
				}
			}
		});
	}
	$scope.getLicenseInfo();
    $scope.productRegister=function(){
	   	var resolve={};
	   	var registerInstance=UtilService.lgmodal('productRegister.html','registerController',resolve);
    };
    $scope.applyLicense=function(){
	   	var resolve={};
	   	var registerInstance=UtilService.lgmodal('html/modal/systemManage/license/applyLicense.html','applyLicenseCtrl',resolve);
    };
	$scope.getLicenseType = function() {
		$http.get('licenseClient/license/mode').success(function (result) {
			// 文件授权模式 "file";
			// license server 授权模式式 "server";
			// 无限授权模式 "unlimited";
			// 未定 "undecided";
			if (result.success) {
				$scope.licenseType = result.data;
			}
		});
    }
    $scope.getLicenseType();
    // License Server授权
    $scope.applyLicenseServer = function () {
		$http.get('licenseClient/isUltimateCvm').then(function(result) {
			if (result && result.data && result.data.data === true) {
				var modalInstance = UtilService.confirm($scope.licenseType==='server'? $translate.instant('licenseServer.noNeedToswitchToLicenseServerModeTips'):$translate.instant('licenseServer.switchToLicenseServerModeTips'),$translate.instant('common.opertip'));
				modalInstance.result.then(function (selectedItem) {
					if($scope.licenseType!=='server') {
						HttpService.put("licenseClient/switchToLicenseServerMode", undefined, undefined, function(result){});
					}
				}, function () {});
			}else {
				var resolve = {
					needCheckAdmin: function () { return false }
				};
				var registerInstance = UtilService.lgmodal('productRegisterByServer.html', 'registerByServerController', resolve);
				registerInstance.result.then(function (selectedItem) {
				}, function () {
				});
			}
		});
    };
    // 授权扩容/释放
    $scope.changeLicenseServer = function(){
		$http.get('licenseClient/isUltimateCvm').then(function(result) {
			if (result && result.data && result.data.data === true) {
				var modalInstance = UtilService.confirm($scope.licenseType==='server'? $translate.instant('licenseServer.noNeedToswitchToLicenseServerModeTips'):$translate.instant('licenseServer.switchToLicenseServerModeTips'),$translate.instant('common.opertip'));
				modalInstance.result.then(function (selectedItem) {
					if($scope.licenseType!=='server') {
						HttpService.put("licenseClient/switchToLicenseServerMode", undefined, undefined, function(result){});
					}
				}, function () {});
			}else {
				var resolve = {
					needCheckAdmin: function () { return false }
				};
				var registerInstance = UtilService.lgmodal('productRegisterByServer.html', 'registerByServerController', resolve);
				registerInstance.result.then(function (selectedItem) {
					$scope.getLicenseInfo();
				}, function () {
					$scope.getLicenseInfo();
				});
			}
		});
    };
    // 授权详细信息
    $scope.showLicenseServerDetail = function(){
        var resolve = {};
        var registerInstance = UtilService.lgmodal('html/modal/licenseServer/licenseServerDetail.html', 'licenseServerDetailController', resolve, {
            width: '1000px'
        });
        registerInstance.result.then(function (selectedItem) {
            $scope.getLicenseInfo();
        }, function () {
            $scope.getLicenseInfo();
        });
    };
    $scope.registerLicense=function(){
	   	var resolve={};
	   	var registerInstance=UtilService.modal('html/modal/systemManage/license/registerLicense.html','registerLicenseCtrl',resolve);
    };
    $scope.exportLicense=function(){
    	var elemIF = document.createElement("iframe");   
        elemIF.src = 'license/export';   
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);
    };
});
//正式申请License
routeApp.controller('applyLicenseCtrl',function($scope, $http, $translate, $modalInstance, UtilService, HttpService) {
	$scope.model = {};//用于向后台发送参数的对象   
	$scope.title = $translate.instant('licenseMng.applyLicense');
	$scope.stepTitles = [ $translate.instant('licenseMng.endUserInformation'),
	          			$translate.instant('licenseMng.applicantInfo')];
	$scope.nationRegion={
	   options:UtilService.getNationRegion()
	};
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
		}
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	}; 
	$scope.ok=function(){
		//保存参数配置
		var data = angular.copy($scope.model);
		$http({
	        method  : 'PUT',
	        url     : 'license/createHostInfo',
	        data    : data
	    }).success(function(result) {
			UtilService.handleResult(result);
			if (result.success == true) {
				$scope.download();
				$modalInstance.dismiss("cancel");
			}
		}).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		});
	};
	$scope.reset=function(){
		$scope.model = {};
	};
	$scope.download=function(){
//		window.open('license/download','_blank',null);
		var elemIF = document.createElement("iframe");   
        elemIF.src = 'license/download';   
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF); 
	};
});
//注册License
routeApp.controller('registerLicenseCtrl',function($scope, $http, $translate,$timeout, $modalInstance, UtilService, HttpService) {
	$scope.model = {};//用于向后台发送参数的对象   
	$scope.isOk=false;
    $scope.stream = null;
    
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
//    	simLimit: 1, /** 单次最大上传文件个数 */
    	extFilters: [".license", ".lic"], /** 允许的文件扩展名, 默认: [] */
    	checkFileName : false,/**对文件名检测是否允许输入特殊字符，默认为true*/
    	onSelect: function(list) {
    		$timeout(function(){$scope.licenseFilePath = list[0].name;$scope.isOk=false;});
    	}, /** 选择文件后的响应事件 */
//   		onMaxSizeExceed: function(size, limited, name) {alert('onMaxSizeExceed')}, /** 文件大小超出的响应事件 */
//   		onFileCountExceed: function(selected, limit) {alert('onFileCountExceed')}, /** 文件数量超出的响应事件 */
    	onNameRegexMismatch: function(file) {
			fShowMessage($translate.instant('licenseMng.uploadisoNameRegexMismatch',{value:file.name}), true);
		},
    	onExtNameMismatch: function(file, filters) {
    		fShowMessage($translate.instant('licenseMng.uploadisoNameRegexMismatch',{value:file.name}), true);
//    		$scope.licenseFilePath = "";
    	}, /** 文件的扩展名不匹配的响应事件 */
//   		onCancel : function(file) {$scope.progress = file.percent;}, /** 取消上传文件的响应事件 */
    	onComplete: function(file) {
    		$timeout(function(){$scope.isOk=true;});
    		$scope.stream.destroy();
    		$scope.stream = new Stream($scope.config);
    	}, /** 单个文件上传完毕的响应事件 */
//    		onQueueComplete: function() {alert('onQueueComplete')}, /** 所以文件上传完毕的响应事件 */
//    		onUploadError: function(status, msg) {alert('onUploadError')} /** 文件上传出错的响应事件 */
    	onUploadProgress: function(file) {},
    	onDestroy: function() {} /** 文件上传出错的响应事件 */
    };
    $scope.config = config;
    $timeout(function(){    	
    	$scope.stream = new Stream($scope.config);
    }, 200);
    $scope.upload=function(){
    	$scope.register();
    };
    $scope.register=function(){
    	var waitModal = UtilService.wait();
    	$http.put("license/register?fileName=" + encodeURIComponent(encodeURIComponent($scope.licenseFilePath)), $scope.domain).success(function(result){
    		waitModal.dismiss();
      	  	UtilService.handleResult(result);
      	  	if (result.success) {    
    	  		$scope.cancel();
    	  		$timeout(function(){    	
    	  			UtilService.alert($translate.instant('licenseMng.licenseRegistSucc'));
    	  		}, 500);
    	  	} else {
    	  		$scope.licenseFilePath = undefined;
    	  	}
    	}).error(function(response, code, headers, config) {
    		waitModal.dismiss();
    		UtilService.handleError(code);
	    });
   };
   
    $scope.cancel = function() {
    	if ($scope.stream != null) {
    		$scope.stream.destroy();
        	$scope.stream=null;
    	}
    	$modalInstance.dismiss("cancel");
    };
    function fShowMessage(msg, warning) {
    	var o = document.getElementById("license_select_files_btn_alert");
    	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
    }
	function falertMessage(msg,warning){
    	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:10px;padding:10px;margin-bottom:10px;word-break:break-all;" class="alert ';
    	s+= !!warning?"alert-danger":"alert-success";
    		s+='" role="alert">'+
    		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
    		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
    		msg+'</div>';
    	return s;
    }
});
//【日志文件收集控制器】
routeApp.controller('gatherLogFileCtrl',function($scope, $state, $http, $translate, UtilService, HttpService) {
    $scope.model = {};//用于向后台发送参数的对象   
    $scope.save=function(){
    	var tree = $('#hostTreeview1').data('treeview');
    	var checkedNodes = tree.getChecked();
    	if (angular.isArray(checkedNodes) && checkedNodes.length > 0) {
    	    $scope.allHostId=[];
    		for (var pIndex = 0; pIndex < checkedNodes.length; pIndex++) {
    			if(angular.isDefined(checkedNodes[pIndex].entryType)&&checkedNodes[pIndex].entryType=='host'){
        			$scope.allHostId.push(checkedNodes[pIndex].entryId);
    			}
    		};
    	};
    	var data = {};
    	data.time = $scope.model.timeRange;
    	data.size = $scope.model.fileSize;
    	if(angular.isDefined($scope.allHostId)){
    		data.hosts = [];
    		for(var i = 0; i < $scope.allHostId.length; i++){
    			data.hosts.push(parseInt($scope.allHostId[i].substring(5)));
    		}
    	}
    	$scope.callback1 = function(){
    		$state.go("main.downloadLog");
    	}
    	HttpService.put("operationlog/gatherLog", data, undefined, $scope.callback1);
    };
    
    $scope.download = function(){
    	var param = "height=100, width=100, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
		var url = "download/template?filePath=/tmp/cas.tar.gz";
		window.open(url, "_blank", param);
    	$state.go("main.gatherLog");
    }
    
    $scope.regather = function(){
    	$state.go("main.gatherLog");
    }
    $scope.timeRange = {
			options:[ {value:"1",label:$translate.instant('operateLog.oneDay')},
					  {value:'2',label:$translate.instant('operateLog.twoDay')},
					  {value:'3',label:$translate.instant('operateLog.threeDay')},
					  {value:'4',label:$translate.instant('operateLog.fourDay')},
					  {value:'5',label:$translate.instant('operateLog.fiveDay')},
					  {value:'6',label:$translate.instant('operateLog.sixDay')},
					  {value:'7',label:$translate.instant('operateLog.oneWeek')},
					  {value:'30',label:$translate.instant('operateLog.oneMonth')},
					  {value:'0',label:$translate.instant('operateLog.notLimit')}
			]
	};
   
});
//操作员分组列表(树形结构)的控制器
routeApp.controller('OperatorGrpTreeListCtrl',function($scope, $http, $modal, $translate, $timeout,UtilService,GridService,HttpService) {
	var expandColumTitleTemplate = "<span custom-title='{{row.branch[expandingProperty.field]}}' set-td-width='40%' class='gird-ellipsis' style='display:inline-block;vertical-align:middle;'>{{row.branch[expandingProperty.field]}}</span>";
	// var expandColumTitleTemplate = "<span custom-title shortcut short-width=150 cut-str=\"{{row.branch[expandingProperty.field]}}\">{{row.branch[expandingProperty.field]}}</span>";
//    var statusTemplate='<div> '+
//    '<span ng-if= \'row.branch[col.field] == "1"\' class="icon-active">' + $translate.instant('common.allow') + '</span>' +
//    '<span ng-if= \'row.branch[col.field] == "0"\' class="icon-inactive">' + $translate.instant('common.forbid') + '</span></div>' ;
    $scope.column = [{ field: 'description', displayName: $translate.instant('operator.groupDesc'), width:'25%',cellTemplate:titleTemplate2,cellTemplateScope:$scope},
                     { field: 'flag', displayName: $translate.instant('operator.enableMngChildGrp'),width:'15%',cellTemplate:statusTemplate},
                     { field: 'oper', displayName:  $translate.instant('common.oper'), width:'20%',
                         cellTemplate:'<div style="margin-top:-5px;">'
                         +'<div has-permission="OPERATOR_GROUP_ADD" type="button" class="btn btn-sm-icon icon-add-gray" ng-if="row.branch.mode != 1"  ng-click="cellTemplateScope.addChildGroup(row.branch)" custom-title="'+$translate.instant('operator.addChildGrp')+'"></div>'
                         +'<div has-permission="OPERATOR_GROUP_ADD" type="button" class="btn btn-sm-icon icon-add-gray" ng-if="row.branch.mode == 1" disabled  custom-title="'+$translate.instant('operator.addChildGrp')+'"></div>'
                         +'<div has-permission="OPERATOR_GROUP_MODIFY" type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="cellTemplateScope.operateGroup(row.branch, \'modify\')" custom-title="'+$translate.instant('operator.modifyGrp')+'"></div>'
                         +'<div has-permission="OPERATOR_GROUP_DELETE" ng-if="row.branch.id != 1  && row.branch.mode != 1 && row.branch.mode != 2" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="cellTemplateScope.deleteGroup(row.branch)" custom-title="'+$translate.instant('operator.deleteGrp')+'"></div>'
                         +'<div has-permission="OPERATOR_GROUP_DELETE" ng-if="row.branch.id == 1 || row.branch.mode == 1 || row.branch.mode == 2" type="button" disabled class="btn btn-sm-icon icon-delete-gray" custom-title="'+$translate.instant('operator.deleteGrp')+'"></div>'
                         +'<div has-permission="OPERATOR_GROUP_VIEW" type="button" class="btn btn-sm-icon icon-view-detail-gray" ng-click="cellTemplateScope.operateGroup(row.branch, \'view\')" custom-title="'+$translate.instant('operator.viewGrp')+'"></div>'
                         +'</div>',
                         cellTemplateScope:$scope}];
    $scope.expandColum = {field: 'name', displayName: $translate.instant('operator.groupName'),width:'40%',cellTemplate:expandColumTitleTemplate};
    
    $scope.treeData = [];//树展示的数据
    var queryTreeData = function() {
//        var url = 'operator/group/sub/' + id + '/' + managed;
        var url = 'operator/group/tree';
        var waitModal = UtilService.areawait("operatorGrpListDivId");
        $http.get(url).success(function(result) {
            if (angular.isArray(result) || (angular.isObject(result) && result.state == 0)) {
                var groups = angular.isArray(result) ? result : result.data;
                $timeout(function(){
                    for (var i = 0; i < groups.length; i++) {
                        $scope.treeData.push(groups[i]);
                    }
                });
               
            }
            UtilService.dismissAreawait(waitModal);
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
        	UtilService.dismissAreawait(waitModal);
            UtilService.handleError(code);
        });   
    };
    queryTreeData();
    $scope.beforeExpand = function(branch) {
//        queryTreeData(branch.id, branch.flag==1, branch);
    }
    //注册刷新
    $scope.$on('onQueryOperatorGroupList', function(event, msg) {
        $scope.refreshPage();
    });
    //刷新树
    $scope.refreshPage = function() {
        $scope.treeData.splice(0, $scope.treeData.length);//清空树节点数据重新加载
        queryTreeData();
    }
    
    //增加子分组
    $scope.addChildGroup = function(row) {
        if (row.level >= 9) {
            UtilService.alert($translate.instant('systemMng.subGroupLevelMaxAlert'));
            return;
        }
        if (row.mode == 1) {
       	 var url = 'operator/group/'+row.id+'/details';
            var waitModal = UtilService.wait();
            $http.get(url)
            .success(function(result) {
                waitModal.dismiss();
                if (result.state == 0) {
                    var opGroup = result.data;
                    var modalInstance = $modal.open({
                        templateUrl: 'html/modal/systemManage/addOperatorGroup.html',
                        controller: 'addOperatorGroupCtrl',
                        backdrop:'static',
                        size:'lg',
                        resolve: {
                            group: function () {
                                return opGroup;
                            },
                            parentId:function(){return row.id;},
                            parentMode:function(){return row.mode;},
                            level:function(){return row.level;},
                            type:function() {
                                return "add";
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                    }, function () {
                    });
                }
            }).error(function(response, code, headers, config) {
                waitModal.dismiss();
                UtilService.handleError(code);
            });
       } else {
       	var modalInstance = $modal.open({
               templateUrl: 'html/modal/systemManage/addOperatorGroup.html',
               controller: 'addOperatorGroupCtrl',
               backdrop:'static',
               size:'lg',
               resolve: {
                   group: function () {},
                   parentId:function(){
                       return row.id;
                   },
                   parentMode:function(){
                       return row.mode;
                   },
                   level:function(){
                       return row.level;
                   },
                   type:function() {
                       return "add";
                   }
               }
           });
           modalInstance.result.then(function (selectedItem) {
           }, function () {
           });
       }
    }
    //删除分组
    $scope.deleteGroup = function(row) {
        //禁止删除系统默认分组
    	if (row.id == 1 || (row.level == 1 && row.mode == 1)) {
            UtilService.alert($translate.instant('systemMng.deleteDefaultGroupAlert'));
            return;
        }
        if (angular.isArray(row.children) && row.children.length > 0) {
            //该分组存在子分组，不允许删除。
            UtilService.alert($translate.instant('systemMng.deleteParentGroupAlert'));
            return;
        }
        var modalInstance = UtilService.confirm($translate.instant('operator.delOperatorGroupConfirm'),$translate.instant('operator.deleteGrp'));
        modalInstance.result.then(function (selectedItem) {
            var groups = [];
            var group = {};
            group.id = row.id;
            group.name = row.name;
            groups.push(group);
            HttpService.put('operator/group/delete', groups, undefined, $scope.refreshPage);
        }, function () {
        });
    }
    //修改和查看分组 type=modify 修改 ； type=view 查看
    $scope.operateGroup = function(row, type) {
        var url = 'operator/group/'+row.id+'/details';
        var waitModal = UtilService.wait();
        $http.get(url)
        .success(function(result) {
            waitModal.dismiss();
            if (result.state == 0) {
                var opGroup = result.data;
                var modalInstance = $modal.open({
                    templateUrl: 'html/modal/systemManage/addOperatorGroup.html',
                    controller: 'addOperatorGroupCtrl',
                    backdrop:'static',
                    size:'lg',
                    resolve: {
                        group: function () {
                            return opGroup;
                        },
                        parentMode:function(){},
                        parentId:function(){},
                        level:function(){},
                        type:function() {
                            return type;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                });
            } else if (result.errorCode==35) {
            	UtilService.error(result.failureMessage);
            	$scope.refreshPage();
            }
        }).error(function(response, code, headers, config) {
            waitModal.dismiss();
            UtilService.handleError(code);
        });
    }
});

routeApp.controller('ldapServerConfigCtrl',function($scope, $http,$modal, $translate, HttpService, UtilService) {
	$scope.addServerConfig = function() {
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/systemManage/ldap/addLdapServerConfig.html',
			  controller: 'addLdapServerConfigCtrl',
			  backdrop:'static',
			  size:'lg',
			  resolve:{
	                mode:function(){return 'add';},
	                id:function(){return null;},
	                data:function(){return null;}
			  }
		});
		modalInstance.result.then(function (result) {
			$scope.refreshLdapServer();
		}, function () {
		});
	};
	
	$scope.refreshLdapServer = function() {
		$scope.$root.$broadcast('onQueryLdapServerConfigList', {});
	};
	

});

routeApp.controller('addLdapServerConfigCtrl',function($scope, $http,$modal,$modalInstance,$timeout, $translate,mode,data,id, HttpService, UtilService) {
	$scope.mode = mode;
	$scope.check = {};
	$scope.server = {};
	if (mode == 'add') {
		$scope.server.serverPort = 389;
		$scope.server.serverType = 1;
		$scope.server.serverVersion = '3';
		$scope.server.connectionTimeout = 30;
		$scope.server.syncTimeout = 0;
		$scope.server.userNameAttrName = 'cn';
	} else {
		$scope.server = data;
		$scope.check.serverIp = data.serverIp;
		$scope.check.baseDn = data.baseDn;
	}
	$scope.serverTypeList={
			options:[{value:'1', label:$translate.instant('ldap.authLdapTypeLdap')},
                     {value:'2', label:$translate.instant('ldap.authLdapTypeAd')}]
	};
	//步骤提示的显示
    $scope.stepTitles = [ $translate.instant('baseinfo'),
                          $translate.instant('otherInfo'),
                         ];
	$scope.checkNameParam = {};
	$scope.checkNameParam.mode = mode;
	$scope.$watch('server.serverIp', function(newValue, oldValue) {
		$scope.checkNameParam.serverAddr = newValue;
	});
	$scope.$watch('server.baseDn', function(newValue, oldValue) {
		$scope.checkNameParam.baseDn = newValue;
	});
	$scope.$watch('server.serverName', function(newValue, oldValue) {
		$scope.checkNameParam.serverName = newValue;
	});
	$scope.$watch('server.serverType', function(newValue, oldValue) {
		if (newValue != oldValue) {
			if (newValue == '1' && oldValue != undefined) {
				$scope.server.userNameAttrName = 'cn';
			} else if (newValue == '2' && oldValue != undefined) {
				$scope.server.userNameAttrName = 'sAMAccountName';
			}
			
		}
		$scope.checkNameParam.serverName = newValue;
	});
	
	$scope.serverVersionList={
			options:[{value:'2', label:'2'},
             {value:'3', label:'3'}]
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	//检测成功后，增加ldap服务器
	 var callback = function() {
		 if (mode == 'add') {
			 HttpService.post('ldap/addLdapServerConfig', $scope.server, $modalInstance);
		 } else {
			 if ($scope.checkNameParam.baseDn.trim() != $scope.check.baseDn.trim() || $scope.checkNameParam.serverAddr != $scope.check.serverIp) {
				var modalInstance = UtilService.confirm($translate.instant('ldap.ldapServerChange'), $translate.instant('common.opertip'));
				modalInstance.result.then(function () {
					HttpService.put('ldap/modifyLdapServer', $scope.server, $modalInstance);
				});	
			 } else {
				 HttpService.put('ldap/modifyLdapServer', $scope.server, $modalInstance);
			 }
		 }
	 }
//	 刷新ldap服务器列表
//	 var refreshLdapServer = function() {
//		 $scope.$root.$broadcast('onQueryLdapServerConfigList', {});
//		 $modalInstance.close();
//		 $scope.refreshLdapServer();
//	 }
	$scope.ok = function() {
		if (mode != 'view') {
			$scope.server.fun = 'submit';
			HttpService.post('ldap/queryLdapConnectTest', $scope.server, undefined, callback);
		}
	};
	
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	
	$scope.connectTest =function() {
		$scope.server.fun='test';
    	var url = 'ldap/queryLdapConnectTest';
		HttpService.post('ldap/queryLdapConnectTest', $scope.server);
	}
	
	 //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#ldapServerConfigForm1').val() === "true") {
                return true;
            }
            return false;
        },
        stepTwoOver : function() {
            if ($('#ldapServerConfigForm2').val() === "true")
                return true;
            return false;
        }
    };
});


//【系统管理】/【用户】/用户过滤
routeApp.controller('userFilterCtrl',function($scope, $http, $translate, $modalInstance, $rootScope, lastParams, HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象

    if (angular.isDefined(lastParams)) {
    	$scope.entry = lastParams;
    }
    //认证方式
    $scope.authMode = {
       options:[{value:'0', label:$translate.instant('operator.pwdAuth')},
               {value:'1', label:$translate.instant('operator.ldapAuth')}]
    };
  //认证方式
    $scope.userStatus = {
       options:[{value:'0', label:$translate.instant('user.notEffective')},
               {value:'1', label:$translate.instant('user.effective')}]
    };
    $http.get("user/userGroupList").success(function(result){
    	if(result.state == 0 && angular.isArray(result.data)){
    		$scope.userGroup = [];
	    	for (var i = 0; i < result.data.length; i++) {
	    		var option = {};
	    		option.value = result.data[i].id;
	    		option.label = result.data[i].name;
	    		$scope.userGroup.push(option);
	    	};
    	}
    })
    $http.get("user/listLdap").success(function(result){
    	if(result.state == 0 && angular.isArray(result.data)){
    		$scope.ldapStrategy = [];
    		for (var i = 0; i < result.data.length; i++) {
	    		var option = {};
	    		option.value = result.data[i].id;
	    		option.label = result.data[i].ldapname;
	    		$scope.ldapStrategy.push(option);
	    	};
    	}
    })
    /**/
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
    	var params = {};
    	if (!isEmpty($scope.entry.loginName)) {
    		params.loginName = $scope.entry.loginName;
    	}
    	if (!isEmpty($scope.entry.authType)) {
    		params.authType = $scope.entry.authType;
    	}
    	if (!isEmpty($scope.entry.userName)) {
    		params.userName = $scope.entry.userName;
    	}
    	if (!isEmpty($scope.entry.credentialNumber)) {
    		params.credentialNumber = $scope.entry.credentialNumber;
    	}
    	if (angular.isNumber($scope.entry.userGroupId)) {
    		params.userGroupId = $scope.entry.userGroupId;
    	}
    	if (!isEmpty($scope.entry.ldapSyncConfigId)) {
    		params.ldapSyncConfigId = $scope.entry.ldapSyncConfigId;
    	}
    	if (!isEmpty($scope.entry.organization)) {
    		params.organization = $scope.entry.organization;
    	}
    	if (!isEmpty($scope.entry.phone)) {
    		params.phone = $scope.entry.phone;
    	}
    	if (!isEmpty($scope.entry.userStatus)) {
    		params.userStatus = $scope.entry.userStatus;
    	}
    	if (!isEmpty($scope.entry.address)) {
    		params.address = $scope.entry.address;
    	}
    	if (!isEmpty($scope.entry.email)) {
    		params.email = $scope.entry.email;
    	}
    	$rootScope.$broadcast("refreshUserList", params);
    	$modalInstance.close(params);
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.reset = function () {
    	$scope.entry.loginName = undefined;
    	$scope.entry.authType = undefined;
    	$scope.entry.userName = undefined;
    	$scope.entry.credentialNumber = undefined;
    	$scope.entry.userGroupId = undefined;
    	$scope.entry.ldapSyncConfigId = undefined;
    	$scope.entry.organization = undefined;
    	$scope.entry.phone = undefined;
    	$scope.entry.userStatus = undefined;
    	$scope.entry.address = undefined;
    	$scope.entry.email = undefined;
    }

});
//【系统管理】/【用户】/增加用户
routeApp.controller('addUserCtrl',function($scope, $http,$modal, $translate, $modalInstance, type, rowObject, HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象
    $scope.type = type;
    
    if (type == "modify" || type == "view"){
    	$scope.checkNameParam = {id : rowObject.id};
    	$http({
    		method : "GET",
    		url : "user/" + rowObject.id
    	}).success(function (result){
    		var user = result.data;
    		if (result.state == 0 && user) {
    			$scope.entry.id = user.id;
        		$scope.entry.loginName = user.loginName;
        		$scope.entry.mailingAddress = user.address;
        	    //认证方式
        		$scope.entry.authType = user.authType;
        		if (user.authType == 0) {
        			$scope.entry.authMode = $translate.instant("user.pwdAuth");
        		} else {
        			$scope.entry.authMode = $translate.instant("user.ldapAuth");
        			$scope.entry.ldapId = user.ldapId;
    				$scope.entry.ldapName = user.ldapName;
        		}
        		$scope.entry.idNumber = user.credentialNumber;
        		$scope.entry.email = user.email;
        		$scope.entry.userGroup = user.groupName;
        		$scope.entry.userGroupId = user.groupId;
        		$scope.entry.orgId = user.orgId;
        		$scope.entry.organization = user.organization;
        		var pwd = UtilService.decryptByDES(user.password);
        		$scope.entry.loginPwd = pwd;
        		$scope.entry.checkPwd = pwd;
        		$scope.entry.phone = user.phone;
        		$scope.entry.userName = user.userName;
        		$scope.securityMode = user.securityMode;
    		} else {
    			UtilService.handleResult(result);
    			$modalInstance.dismiss("cancel");
    			$scope.$parent.$broadcast("refreshUserList");
    		}
    	})
    } else if (type == "orgAdd") {
    	$scope.entry.orgId = rowObject.orgId;
    	$scope.entry.organization = rowObject.orgName;
    	$scope.entry.authType = 0;
    	$scope.entry.authMode = $translate.instant("user.pwdAuth");
    } else {
    	$scope.entry.authType = 0;
    	$scope.entry.authMode = $translate.instant("user.pwdAuth");
    }
    //选择LDAP策略
    $scope.ldapStrategySelector = function(){
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectLdapStrategy.html',
        	controller:'SelectLdapCtrl',
        	backdrop:'static',
        	size:"lg"
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.entry.ldapId = selectItem[0].id;
    		$scope.entry.ldapName = selectItem[0].name;
    	},function(){
    		
    	});
    };
    //选择组织
    $scope.orgSelector=function(){
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectOrg.html',
        	controller:'SelectOrgCtrl',
        	backdrop:'static',
        	size:"lg"
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.entry.orgId = selectItem[0].id;
    		$scope.entry.organization = selectItem[0].name;
    		$scope.entry.userGroup = undefined;
    		$scope.entry.userGroupId = undefined;
    	},function(){
    		
    	});
    };
    //选择用户分组
    $scope.userGrpSelector=function(){
    	if (!$scope.entry.orgId) {
    		UtilService.error($translate.instant("user.orgSelectPrompt"), $translate.instant("user.selectGroup"));
    		return;
    	}
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectUserGrp.html',
        	controller:'SelUserGroupCtrl',
        	resolve:{ orgId : function() {return $scope.entry.orgId},
        		orgName : function() {return $scope.entry.organization}},
        	backdrop:'static',
        	size:{width:"1000px", height:"400px"}
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.entry.userGroup=selectItem.name;
    		$scope.entry.userGroupId = selectItem.id;
    	},function(){
    		
    	});
    };
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    var callback = function(result){
    	if (result.state == '0' || (result.state == '1' && result.errorCode == '1521')) {
    		$modalInstance.close();
        	$scope.$parent.$broadcast("refreshUserList");
    	}
    	
    }
    $scope.ok = function () {
    	var model = {};
    	model.loginName = UtilService.encryptByDES($scope.entry.loginName);
    	if ($scope.entry.authType == 0) {
        	model.authType = 0;
        	model.password = UtilService.encryptByDES($scope.entry.loginPwd);
    	} else {
        	model.authType = 1;
        	model.ldapSyncConfigId = $scope.entry.ldapId;
    	}
    	model.userName = $scope.entry.userName;
    	model.orgId = $scope.entry.orgId;
    	model.organization = $scope.entry.organization;
    	model.credentialNumber = $scope.entry.idNumber;
    	model.email = $scope.entry.email;
    	model.phone = $scope.entry.phone;
    	model.address = $scope.entry.mailingAddress;
    	model.userGroups = [];
    	var userGroup = {};
    	userGroup.id = $scope.entry.userGroupId;
    	userGroup.name = $scope.entry.userGroup;
    	model.userGroups.push(userGroup);
    	if (type == 'add' || type == "orgAdd") {
    		HttpService.post("user", model, $modalInstance, callback, callback);
    	} else if(type == 'modify') {
    		model.id = rowObject.id;
    		HttpService.put("user", model, $modalInstance, callback, callback);
    	}
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

routeApp.controller('viewUserCtrl',function($scope, $http,$modal, $translate, $modalInstance, data, HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象
    var user = data;
	$scope.entry.id = user.id;
	$scope.entry.loginName = user.loginName;
	$scope.entry.mailingAddress = user.address;
    //认证方式
	$scope.entry.authType = user.authType;
	if (user.authType == 0) {
		$scope.entry.authMode = $translate.instant("user.pwdAuth");
	} else {
		$scope.entry.authMode = $translate.instant("user.ldapAuth");
		$scope.entry.ldapId = user.ldapId;
		$scope.entry.ldapName = user.ldapName;
	}
	$scope.entry.idNumber = user.credentialNumber;
	$scope.entry.email = user.email;
	$scope.entry.userGroup = user.groupName;
	$scope.entry.userGroupId = user.groupId;
	$scope.entry.orgId = user.orgId;
	$scope.entry.organization = user.organization;
	$scope.entry.phone = user.phone;
	$scope.entry.userName = user.userName;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

//【系统管理】/【用户分组】/增加分组
routeApp.controller('addUserGrpCtrl',function($scope, $http, type,rowObj,$modal,$translate, $modalInstance, HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象
    if(type==="addGrp"){
        $scope.entry.parentGrp='/';
    	$scope.type="addGrp";
    	$scope.title=$translate.instant("user.addUserGrp");
    }else if(type==="addChildGrp"){
    	$scope.entry.parentGrp=rowObj.name;
    	$scope.entry.parentId = rowObj.id;
    	$scope.entry.level = rowObj.level + 1;
    	$scope.entry.orgName = rowObj.orgName;
    	$scope.entry.orgId = rowObj.orgId;
    	$scope.type="addChildGrp";
    	$scope.title=$translate.instant("user.addUserGrp");
    }else if(type==="modify"){
    	$scope.entry=angular.copy(rowObj);
    	if (isEmpty($scope.entry.parentGrp)){
    		$scope.entry.parentGrp = '/';
    	}
    	$scope.type="modify";
    	$scope.title=$translate.instant("user.modifyUserGrp");
    }else if(type==="view"){
    	$scope.entry=rowObj;
    	if (isEmpty($scope.entry.parentGrp)){
    		$scope.entry.parentGrp = '/';
    	}
    	$scope.type="view";
    	$scope.title=$translate.instant("user.viewUserGrp");
    } else if (type==="orgAddGrp") {
    	$scope.entry.orgName = rowObj.orgName;
    	$scope.entry.parentGrp = '/';
    	$scope.type="orgAddGrp";
    	$scope.entry.orgId = rowObj.orgId;
    	$scope.title=$translate.instant("user.addUserGrp");
    }
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    //修改时切换选择组织
    $scope.orgSelector=function(){
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectOrg.html',
        	controller:'SelectOrgCtrl',
        	backdrop:'static',
        	size:"lg"
        });
    	modalInstance.result.then(function(selectItem){
    		if (angular.isArray(selectItem) && selectItem.length > 0){
    			var orgObject = selectItem[0];
    			$scope.entry.orgName = selectItem[0].name;
    			$scope.entry.orgId = selectItem[0].id;
    		}
    	},function(){
    		
    	});
    };
    
    var callback = function(){
    	var model = {};
    	model.orgId = $scope.entry.orgId;
    	$scope.$parent.$broadcast("refreshUserGrpList", model);
    }
    $scope.ok = function () {
    	var model = {};
    	model.name = $scope.entry.name;
    	model.description = $scope.entry.description;
    	model.orgId = $scope.entry.orgId;
    	model.flag = 0;
    	if ($scope.type == 'addGrp'){
    		model.level = 1;
    		HttpService.post("user/userGroup", model, $modalInstance);
    		
    	} else if ($scope.type == 'modify'){
    		model.level = $scope.entry.level;
    		model.parentId = $scope.entry.parentId;
    		model.id = $scope.entry.id;
    		HttpService.put("user/userGroup", model, $modalInstance);
    	} else if ($scope.type == "addChildGrp"){
    		model.level = $scope.entry.level;
    		model.parentId = $scope.entry.parentId;
    		HttpService.post("user/userGroup", model, $modalInstance);
    	} else if (type==="orgAddGrp") {
    		model.level = 1;
    		HttpService.post("user/userGroup", model, $modalInstance, callback);
        }
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

routeApp.controller('viewUserGrpCtrl',function($scope, $http, rowObj, $modal, $translate, $modalInstance, HttpService, UtilService) {
    $scope.entry = {};//用于向后台发送参数的对象
	$scope.entry=rowObj;
	if (isEmpty($scope.entry.parentGrp)){
		$scope.entry.parentGrp = '/';
	}
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

//ladap同步策略
routeApp.controller('ldapSyncStrategyCtrl',function($scope, $rootScope, $http, $modal, $translate, $timeout, HttpService, UtilService, GridService) {
	var params = {};		
	var url = 'ldap/queryLdapStrategyConfig';
	var requireTemplate='<div class="ngCellText">'+
	  '<span ng-if="row.entity.require == 0">'+$translate.instant("common.no")+'</span>' +
	  '<span ng-if="row.entity.require == 1">'+$translate.instant("common.yes")+'</span>' +
	  +'</div>';
	var statusTemplate='<div class="ngCellText">'+
	  '<span ng-if="row.entity.status == 0">'+$translate.instant("ldap.inValidate")+'</span>' +
	  '<span ng-if="row.entity.status == 1">'+$translate.instant("ldap.validate")+'</span>' +
	  +'</div>';
	var operationTemplate = '<div><div class="ngCellButton">'
	  +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="LDAP_CONFIG_EDIT" ng-click="editLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.editLdapStra')+'"></div>'
	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="LDAP_CONFIG_DELETE" ng-click="deleteLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.deleteLdapStra')+'"></div>'
	  +'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="LDAP_CONFIG_VIEW" ng-click="viewLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.viewLdapStra')+'"></div>'
	  +'<div type="button" ng-if="row.entity.status==1" class="btn btn-sm-icon icon-synchronize-gray" has-permission="LDAP_CONFIG_SYNC" ng-click="syncLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.ldapSync')+'"></div>'
      +'</div></div>'
	
	var column = [
	              { field: 'name', displayName: $translate.instant('ldap.strategyName'), sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'serverName', displayName: $translate.instant('ldap.serverName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
	              { field: 'orgName', displayName: $translate.instant('ldap.organization'), sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'group', displayName: $translate.instant('ldap.userGroup'), sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'require', displayName: $translate.instant('ldap.syncRequired'), sortable: true, width:'12%',cellTemplate:requireTemplate},
	              { field: 'status', displayName: $translate.instant('ldap.status'), sortable: true, width:'12%',cellTemplate:statusTemplate},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'25%',cellTemplate:operationTemplate}
	              ]
	
	
	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, params, null, null, 'ldapSyncStrategyId');
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
			columnDefs:column
	};    
	
	
	$scope.refreshList = function() {
		$scope.refreshPage();
	};
	
	$scope.addStrategy = function() {
   	 	var modalInstance = $modal.open({
 			templateUrl: 'html/modal/systemManage/ldap/addLdapStrategy.html',
        	controller: 'addLdapStrategyCtrl',
        	size:'lg',
        	backdrop:'static',
        	resolve: {
	    		 isAdd:function() {
					  return true;
				  },
				 ldapData:function() {
					  return null;
				 }
        	}
 		});
        modalInstance.result.then(function (selectedItem) {
    		$scope.refreshList();
        }, function (reason) {
        });
	};
	
	$scope.deleteLdapStrategyConfig = function(row) {
		  var prompt= $translate.instant('ldap.confirmDelete',{value:row.name});
		  var modalInstance = UtilService.confirm(prompt, $translate.instant('operConfirm'));
		  modalInstance.result.then(function () {
			HttpService.delete('ldap/deleteLdapStrategy', {"name":row.name,"id":row.id}, undefined, $scope.refreshPage);
		  });
	};
	
	$scope.syncLdapStrategyConfig = function(row) {
		  var prompt= $translate.instant('ldap.confirmSync');
		  var modalInstance = UtilService.confirm(prompt, $translate.instant('operConfirm'));
		  modalInstance.result.then(function () {
			var waitModal = UtilService.wait();
			$http({
		        method  : 'GET',
		        url     : 'ldap/syncByLdapStrategy',
		        params  : {"id":row.id,"name":row.name}
		    }).success(function(result) {
		    	waitModal.dismiss();
		    	if (result.state == 1 && result.success == false && result.errorCode == 0) {
		    		UtilService.error($translate.instant("user.ldapConfigIsUnSupportSync",{"name":row.name}), $translate.instant('common.opertip'));
		    	} else if (result.state == 1 && result.success == false && result.errorCode == 3008) {
		    		UtilService.error(result.failureMessage, $translate.instant('common.opertip'));
		    	} else if(result.success == true) {
		    		UtilService.success(result.successMessage);
		    		$rootScope.$broadcast("onShowTaskList");
		    	} else {
		    		UtilService.error($translate.instant("user.ldapServerConnectError",{"v":result.errorCode}), $translate.instant('common.opertip'));
		    	}
		    	$scope.refreshPage;
			}).error(function(response, code, headers, config) {
				UtilService.handleError(code);
			})
		  });
	};
	
	$scope.editLdapStrategyConfig = function(row) {
		var ldapData = {};
		ldapData.id = row.id;
		var waitModal = UtilService.wait();
		$http({
	        method  : 'GET',
	        url     : 'ldap/checkLdapServer',
	        params  : {"id":row.id}
	    }).success(function(result) {
	    	waitModal.dismiss();
	    	if (result.state == 1 && result.success == false) {
	    		UtilService.error($translate.instant("user.ldapServerConnectError",{"v":result.errorCode}), $translate.instant('common.opertip'));
	    	} else {
   	 	var modalInstance = $modal.open({
 			templateUrl: 'html/modal/systemManage/ldap/addLdapStrategy.html',
        	controller: 'addLdapStrategyCtrl',
        	size:'lg',
        	backdrop:'static',
        	resolve: {
	    		 isAdd:function() {
					  return false;
				  },
				 ldapData:function() {
					  return ldapData;
				 }
        	}
 		});
        modalInstance.result.then(function (selectedItem) {
    		$scope.refreshList();
        }, function (reason) {
        });
	    	}
	    }).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		})
	};
	
	$scope.viewLdapStrategyConfig = function(row) {
		var ldapData = {};
		ldapData.id = row.id;
		var waitModal = UtilService.wait();
		$http({
	        method  : 'GET',
	        url     : 'ldap/checkLdapServer',
	        params  : {"id":row.id}
	    }).success(function(result) {
	    	waitModal.dismiss();
	    	if (result.state == 1 && result.success == false) {
	    		UtilService.error($translate.instant("user.ldapServerConnectError",{"v":result.errorCode}), $translate.instant('common.opertip'));
	    	} else {
   	 	var modalInstance = $modal.open({
 			templateUrl: 'html/modal/systemManage/ldap/viewLdapStrategy.html',
        	controller: 'addLdapStrategyCtrl',
        	backdrop:'static',
        	resolve: {
	    		 isAdd:function() {
					  return false;
				  },
				 ldapData:function() {
					  return ldapData;
				 }
        	}
 		});
        modalInstance.result.then(function (selectedItem) {
    		$scope.refreshList();
        }, function (reason) {
        });
	    	}
	    }).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		})
	};
	
	
});
//【系统管理】/用户/选择LDAP策略
routeApp.controller('SelectLdapCtrl' ,function($scope, $http, $modal, $translate,$modalInstance, $timeout,UtilService, HttpService,GridService){
	var params = {};		
	var url = 'ldap/queryLdapStrategyConfig';
	var requireTemplate='<div class="ngCellText">'+
	  '<span ng-if="row.entity.require == 0">'+$translate.instant("common.no")+'</span>' +
	  '<span ng-if="row.entity.require == 1">'+$translate.instant("common.yes")+'</span>' +
	  +'</div>';
	var statusTemplate='<div class="ngCellText">'+
	  '<span ng-if="row.entity.status == 0">'+$translate.instant("ldap.inValidate")+'</span>' +
	  '<span ng-if="row.entity.status == 1">'+$translate.instant("ldap.validate")+'</span>' +
	  +'</div>';
	var operationTemplate = '<div><div class="ngCellButton">'
	  +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="LDAP_CONFIG_EDIT" ng-click="editLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.editLdapStra')+'"></div>'
	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="LDAP_CONFIG_DELETE" ng-click="deleteLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.deleteLdapStra')+'"></div>'
	  +'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="LDAP_CONFIG_VIEW" ng-click="viewLdapStrategyConfig(row.entity)" custom-title="'+$translate.instant('ldap.viewLdapStra')+'"></div>'
      +'</div></div>'
	
	var column = [
	              { field: 'name', displayName: $translate.instant('ldap.strategyName'), sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'serverName', displayName: $translate.instant('ldap.serverName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
	              { field: 'orgName', displayName: $translate.instant('ldap.organization'), sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'group', displayName: $translate.instant('ldap.userGroup'), sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'require', displayName: $translate.instant('ldap.syncRequired'), sortable: true, width:'12%',cellTemplate:requireTemplate},
	              { field: 'status', displayName: $translate.instant('ldap.status'), sortable: true, width:'12%',cellTemplate:statusTemplate},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'25%',cellTemplate:operationTemplate}
	              ]
	
	$scope.multiSelect = false;

	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, params, null, null, 'ldapSyncStrategyId');
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
		columnDefs:column,
		rowTemplate: doubleClickTemplate    // 双击行模板
	};    
	
	$scope.addStrategy = function() {
   	 	var modalInstance = $modal.open({
 			templateUrl: 'html/modal/systemManage/ldap/addLdapStrategy.html',
        	controller: 'addLdapStrategyCtrl',
        	size:'lg',
        	backdrop:'static',
        	resolve: {
	    		 isAdd:function() {
					  return true;
				  },
				 ldapData:function() {
					  return null;
				 }
        	}
 		});
        modalInstance.result.then(function (selectedItem) {
    		$scope.refreshList();
        }, function (reason) {
        });
	};
	
	$scope.deleteLdapStrategyConfig = function(row) {
		  var prompt= $translate.instant('ldap.confirmDelete',{value:row.name});
		  var modalInstance = UtilService.confirm(prompt, $translate.instant('operConfirm'));
		  modalInstance.result.then(function () {
			HttpService.delete('ldap/deleteLdapStrategy', {"name":row.name,"id":row.id}, undefined, $scope.refreshPage);
		  });
	};
	
	$scope.editLdapStrategyConfig = function(row) {
		var ldapData = {};
		ldapData.id = row.id;
   	 	var modalInstance = $modal.open({
 			templateUrl: 'html/modal/systemManage/ldap/addLdapStrategy.html',
        	controller: 'addLdapStrategyCtrl',
        	size:'lg',
        	backdrop:'static',
        	resolve: {
	    		 isAdd:function() {
					  return false;
				  },
				 ldapData:function() {
					  return ldapData;
				 }
        	}
 		});
        modalInstance.result.then(function (selectedItem) {
    		$scope.refreshList();
        }, function (reason) {
        });
	};
	
	$scope.viewLdapStrategyConfig = function(row) {
		var ldapData = {};
		ldapData.id = row.id;
   	 	var modalInstance = $modal.open({
 			templateUrl: 'html/modal/systemManage/ldap/viewLdapStrategy.html',
        	controller: 'addLdapStrategyCtrl',
        	backdrop:'static',
        	resolve: {
	    		 isAdd:function() {
					  return false;
				  },
				 ldapData:function() {
					  return ldapData;
				 }
        	}
 		});
        modalInstance.result.then(function (selectedItem) {
    		$scope.refreshList();
        }, function (reason) {
        });
	};

	$scope.refreshList = function() {
		$scope.refreshPage();
	};

	 $scope.ok=function(){
		 $modalInstance.close($scope.mySelections);
	 };
	 $scope.jump = function(rowEntity){
		 $modalInstance.close([rowEntity]);
	 };
	 $scope.cancel=function(){
		 $modalInstance.dismiss("cancel");
	 };
});

//【系统管理】/用户/选择组织
routeApp.controller('SelectOrgCtrl' ,function($scope, $http, $modal, $translate,$modalInstance, $timeout,UtilService, HttpService,GridService,OrgService){
	var operationTemplate = '<div><div class="ngCellButton">'
			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyOrg(row.entity)" custom-title="{{\'common.modify\'|translate}}"></div>'
			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrg(row.entity)" custom-title="{{\'common.delete\'|translate}}"></div>'
			+'</div></div>';
	var column=[{ field: 'name', displayName:$translate.instant('common.name'), sortable: false, width:'25%', cellTemplate: titleTemplate},
	            { field: 'templateNum', displayName:$translate.instant('common.templateNum'), sortable: false, width:'15%'},
	            { field: 'vmNum', displayName:$translate.instant('common.vmNum'), sortable: false, width:'15%'},
	            { field: 'runVmNum', displayName:$translate.instant('common.runVmNum'), sortable: false, width:'15%'},
	            { field: 'userNum', displayName:$translate.instant('common.userNum'), sortable: false, width:'15%'},
	            { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'15%', cellTemplate:operationTemplate}];
	//创建表格
	var url = "org/list";
	$scope.multiSelect = false;
	$scope = GridService.noMaskGrid($scope, url);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.listStyle = $scope.gridStyle(-15);
	$scope.mySelections=[];
	$scope.gridOptions = {
		data: 'myData',
		jqueryUITheme: false,
		jqueryUIDraggable: true,
		selectedItems: $scope.mySelections,
		showGroupPanel: false,
		multiSelect: false,
		showColumnMenu: true,
		showFilter: false,
		enableCellSelection: false,
		enableCellEditOnFocus: false,
		enablePaging: true,
		showFooter: true,
		i18n: $translate.instant('lang'),
		totalServerItems: 'totalServerItems',
		columnDefs:column,
    	pagingOptions: $scope.pagingOptions,
		rowTemplate: doubleClickTemplate    // 双击行模板
	};
	
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
	 $scope.ok=function(){
		 $modalInstance.close($scope.mySelections);
	 };
	 $scope.jump = function(rowEntity){
		 $modalInstance.close([rowEntity]);
	 };
	 $scope.cancel=function(){
		 $modalInstance.dismiss("cancel");
	 };
});
//【系统管理】/用户/增加用户/选择用户分组
routeApp.controller('SelUserGroupCtrl' ,function($scope, $state, $http, $modal, $translate,$modalInstance, $timeout,orgId,orgName, UtilService, HttpService){
	if (angular.isDefined(orgId)){
		$scope.orgId = orgId;
	}
	$scope.selectData = {};         //选中的group
	$scope.setSelectData = function(branch) {
        $scope.selectData.id = branch.id;
        $scope.selectData.name = branch.name;
    }
	$scope.addUserGrp = function(){
		var addUserGrpModal = $modal.open({
            templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
            controller: 'addUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	type:function(){return "orgAddGrp";},
            	rowObj:function(){return {orgId:orgId, orgName:orgName};}
            }
        });
        addUserGrpModal.result.then(function () {
        	$scope.$broadcast('onQueryUserGroupList');
        }, function (reason) {
        });
	}
    $scope.ok=function(){
    	$modalInstance.close($scope.selectData);
    };
    $scope.cancel=function(){
    	$modalInstance.dismiss("cancel");
    };
});
//【密码策略】
routeApp.controller('PwdStrategyCtrl',function($scope, $http, $translate, UtilService, HttpService) {
	$scope.model = {};//用于向后台发送参数的对象  
	$scope.initParam = {};//用于控制前台界面展示
	$scope.initParam.securityMode = 0;//默认未启用保密模式
	$scope.model.complex = "0";
	$scope.model.pwdMinlen = "1";
	$scope.model.pwdValidTime = "0";
	//获取是否启用保密模式
	$scope.levels = {
			options:[{value:'0',label:$translate.instant('securityMng.unlimit')}
				,{value:'1',label:$translate.instant('securityMng.charNum')}
				,{value:'2',label:$translate.instant('securityMng.specialChar')}
				,{value:'3',label:$translate.instant('securityMng.charNumSpecial')}
				,{value:'4',label:$translate.instant('securityMng.ulcharNumSpecial')}
			]
		};
	$http.get("systemConfig/sysConfig?type=sys_conf").success(function(result){
		if (result.data["security.mode.enable"] != null && 
				"1" == result.data["security.mode.enable"]) {
			$scope.initParam.securityMode = 1;
			$scope.model.complex = "1";
			$scope.levels = {
				options:[{value:'1',label:$translate.instant('securityMng.charNum')}
				,{value:'3',label:$translate.instant('securityMng.charNumSpecial')}
				,{value:'4',label:$translate.instant('securityMng.ulcharNumSpecial')}
				]
			};
 	   	} 
	})
	
	
	//密码策略界面初始化
	$scope.queryPwdConfig = function() {
	    $http({
	        method  : 'GET',
	        url     : 'systemConfig/sysConfig',
	        params:{type:"pwd_conf"}
	    }).success(function(result) {
	        if (result.success) {
	            if (result.data["pwd.min.length"] != null) {
	                $scope.model.pwdMinlen = result.data["pwd.min.length"];
	            } else {
	            	$scope.model.pwdMinlen = "8";
	            }
	            if (result.data["pwd.complexity"] != null) {
	                $scope.model.complex = result.data["pwd.complexity"];
	            }
	            if (result.data["pwd.valid.time"] != null) {
	                $scope.model.pwdValidTime = result.data["pwd.valid.time"];
	            } else {
	            	$scope.model.pwdValidTime = "0";
	            }
	        }
	    }).error(function(response, code, headers, config) {
	        UtilService.handleError(code);
	    });
	}
	$scope.queryPwdConfig();
	
	//保存密码策略
	$scope.savePwdStrategy = function (form) {
	    if (form.$invalid) {
	        return;
	    }
	    
	    if ($scope.initParam.securityMode == 1 && ($scope.model.complex == 0 || $scope.model.complex == 2) ) {
	    	return;
	    }
		$scope.pwdEntry = {};
		$scope.pwdEntry.pwdMinlen = $scope.model.pwdMinlen;
		$scope.pwdEntry.pwdValidTime = $scope.model.pwdValidTime;
		$scope.pwdEntry.pwdComplexLevel = $scope.model.complex;
		
		var data = angular.copy($scope.pwdEntry);
		$http({
	        method  : 'PUT',
	        url     : 'systemConfig/sysConfig?type=pwd_conf',
	        data    : data
	    }).success(function(result) {
	        if (result.state == 0) {
	            $scope.queryPwdConfig();
	        }
			UtilService.handleResult(result);
		}).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		});

	};
});

//证书配置
routeApp.controller('CerConfigCtrl',function($scope, $http, $translate,$timeout, UtilService, HttpService) {
	// 限制文件大小最大为5M
	$scope.maxSize = Math.pow(1024, 2) * 5;
	// 文件是否在上传过程中
	$scope.isUploading = false;
	$scope.init = function () {		
		$scope.model = {
				frequency:1,
				day:1,
				hour:0,
				week:1,
				minute:0
		};
		$scope.param = {enable:false};
		$scope.cerFilePath="";
		$scope.model.cerFile="";
	}
	$scope.init();
	$http({
        method  : 'GET',
        url     : 'systemConfig/cerConfig'
    }).success(function(result) {
    	if (result.success) {
    		$scope.model.cerFile = result.data["cer.file"];
    		if (!isEmpty($scope.model.cerFile)) {
    			$scope.param.enable = true;
    		}
    		if (result.data["cer.crl.url"]) {
    			$scope.model.cerUrl = result.data["cer.crl.url"];
    			$scope.param.enableCrl = true;
    		}
    		if (!isEmpty(result.data["cer.crl.frequency"])) {    			
    			$scope.model.frequency= result.data["cer.crl.frequency"];
    		}
    		if (!isEmpty(result.data["cer.crl.day"])) {    			
    			$scope.model.day= result.data["cer.crl.day"];
    			if ($scope.model.frequency == 1) {
    				$scope.model.week = $scope.model.day;
    			}
    		}
    		if (!isEmpty(result.data["cer.crl.hour"])) {    			
    			$scope.model.hour= result.data["cer.crl.hour"];
    		}
    		if (!isEmpty(result.data["cer.crl.minute"])) {    			
    			$scope.model.minute= result.data["cer.crl.minute"];
    		}
    		$scope.cerFilePath = $scope.model.cerFile;
    	}
    }).error(function(response, code, headers, config) {
    	
	})
	$scope.saveCerConfig = function () {
		var data = {};//angular.copy($scope.model);
		if ($scope.param.enable) {
			data.cerFile = $scope.model.cerFile;
			if ($scope.param.enableCrl) {
				data.frequency=$scope.model.frequency;
				data.day = $scope.model.day;
				if (data.frequency == 1) {
					data.day = $scope.model.week;
				}
				data.hour = $scope.model.hour;
				data.minute = $scope.model.minute;
				data.cerUrl = $scope.model.cerUrl;
			}
		}
		//保存参数配置
		HttpService.put("systemConfig/cerConfig", data);
	};
	$scope.resetCerConfig = function(){
		var data = {reset:0};
		//保存参数配置
		HttpService.put("systemConfig/cerConfig", data);
		$scope.init();
		if ($scope.stream != null) {
			$scope.stream.destroy();
            $scope.stream = new Stream($scope.config);
	}
	}
	// 根证书上传
	var config = {
			customered : true, /**是否自定义ui**/
	        browseFileId : "cer_select_files_btn", /** 选择文件的ID, 默认: i_select_files */
	        browseFileBtn : "<div></div>", /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
	        dragAndDropArea: "cer_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
	        dragAndDropTips: "<span></span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
	        filesQueueId : "cer_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
	        filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
	        messagerId : "cer_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
	        multipleFiles: false, /** 多个文件一起上传, 默认: false */
	        autoUploading: true, /** 选择文件后是否自动上传, 默认: true */
	        tokenURL : "fileUpload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
	        frmUploadURL : "fileUpload/fd;", /** Flash上传的URI */
	        uploadURL : "fileUpload/upload", /** HTML5上传的URI */
	        swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
	        simLimit: 1, /** 单次最大上传文件个数 */
	        maxSize: $scope.maxSize,/** 单个文件的最大大小5M，默认:2G */
//	        extFilters: [".license", ".lic"], /** 允许的文件扩展名, 默认: [] */
	        checkFileName : true,/**对文件名检测是否允许输入特殊字符，默认为true*/
	        onSelect: function(list) {
	            $timeout(function(){
	            	$scope.isUploading = true;
	            $scope.cerFilePath = list[0].name;});
	        }, /** 选择文件后的响应事件 */
	        onMaxSizeExceed: function(file) { /** 文件大小超出的响应事件 */
	        	var modalInstance = UtilService.alert($translate.instant('uploadfile.uploadFilesizeLimitError', {value1 : file.name, value2 : file.formatSize, value3 : file.formatLimitSize}), $translate.instant('common.opertip'), false, 'error');
    			modalInstance.result.then(function (selectedItem) { 
    				$scope.cerFilePath = "";
    				$scope.model.cerFile = "";
    				$scope.isUploading = false;
    			});
			},
//	          onFileCountExceed: function(selected, limit) {alert('onFileCountExceed')}, /** 文件数量超出的响应事件 */
	        onNameRegexMismatch: function(file) {
	            var modalInstance = UtilService.alert($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}),$translate.instant('common.opertip'), false, 'error');
    			modalInstance.result.then(function (selectedItem) { 
    				$scope.cerFilePath="";
    				$scope.model.cerFile="";
    				$scope.isUploading = false;
    			});	
	        },
	        onExtNameMismatch: function(file, filters) {
	            var modalInstance = UtilService.alert($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}),$translate.instant('common.opertip'), false, 'error');
    			modalInstance.result.then(function (selectedItem) { 
    				$scope.cerFilePath="";
    				$scope.model.cerFile="";
    				$scope.isUploading = false;
    			});	
	        }, /** 文件的扩展名不匹配的响应事件 */
//	          onCancel : function(file) {$scope.progress = file.percent;}, /** 取消上传文件的响应事件 */
	        onComplete: function(file) {
	        	$timeout(function(){
	        		$scope.model.cerFile = $scope.cerFilePath;
	        		$scope.isUploading = false;
	        	});
	            $scope.stream.destroy();
	            $scope.stream = new Stream($scope.config);
	        }, /** 单个文件上传完毕的响应事件 */
//	          onQueueComplete: function() {alert('onQueueComplete')}, /** 所以文件上传完毕的响应事件 */
	        onUploadError: function(status, msg) {
	        	$scope.isUploading = false;
			}, /** 文件上传出错的响应事件 */
	        onUploadProgress: function(file) {
	        },
	        onDestroy: function() {} /** 文件上传出错的响应事件 */
	}
	$scope.config = config;
    $timeout(function(){        
        $scope.stream = new Stream($scope.config);
    }, 200);
	//频率。0:每月，1：每周，2：每日
    $scope.frequency = {
        options : [{value:'0', label:$translate.instant('cloudResource.everyMonth')},
                   {value:'1', label:$translate.instant('cloudResource.everyWeek')},
                   {value:'2', label:$translate.instant('cloudResource.everyDay')}]
    };
    //星期
    $scope.week = {
        options : [{value:'1', label:$translate.instant('cloudResource.monday')},
                   {value:'2', label:$translate.instant('cloudResource.tuesday')},
                   {value:'3', label:$translate.instant('cloudResource.wednesday')},
                   {value:'4', label:$translate.instant('cloudResource.thursday')},
                   {value:'5', label:$translate.instant('cloudResource.friday')},
                   {value:'6', label:$translate.instant('cloudResource.saturday')},
                   {value:'7', label:$translate.instant('cloudResource.sunday')}]
    };
});
//系统参数配置
routeApp.controller('SystemParamCtrl',function($scope, $http,$rootScope, $translate, $timeout,UtilService, HttpService) {
	$scope.model = {};
	var old_security_mode_enable = 0;
	$scope.pwd = {};
	var modifyPwd = false;
	var old_http_port = 8080;
	var old_https_port = 8443;	
	$scope.querySysConf = function() {
		$http({
	        method  : 'GET',
	        url     : 'systemConfig/sysConfig',
	        params:{type:"sys_conf"}
	    }).success(function(result) {
	    	if (result.success) {
		    	// 重新获取所有参数，保密模式的原来值也重获取
				$scope.model = {};
				old_security_mode_enable = 0;
				
	    		//启用保密模式
				if (!isEmpty(result.data["http.port"])) {
	    			old_http_port = result.data["http.port"];
	    		}
	    		if (!isEmpty(result.data["https.port"])) {
	    			old_https_port = result.data["https.port"];
	    		}
	    		$scope.model.security_mode_enable = 0;
	    		$scope.model.port = old_http_port;
	    		if(!isEmpty(result.data["security.mode.enable"])){
	    			$scope.model.security_mode_enable = result.data["security.mode.enable"];
	    			old_security_mode_enable = $scope.model.security_mode_enable;
	    			if ($scope.model.security_mode_enable == 1) {
	    				$scope.model.port = old_https_port;
	    			} else {
	    				$scope.model.port = old_http_port;
	    			}
	    		}
	    		
	    		// 是否存在安全区域 add by huangli 2017.6.20 保密局需求
	    		var isSafeAreaExist = result.data["safeAreaExist"];
	    		if (isSafeAreaExist=="true") {
	    		    $scope.safeArea = true;
	    		} else {
	    		    $scope.safeArea = false;
	    		}    	
	    		//缺省闲置超时时长
	    		$scope.model.idle_timeout = result.data["idle.timeout"];
	    		//允许登陆失败次数
	    		$scope.model.login_max_fail_counts = 3;
	    		if(!isEmpty(result.data["login.max.fail.counts"])){
	    			$scope.model.login_max_fail_counts = result.data["login.max.fail.counts"];
	    		}
	    		//趋势分析天数
	    		$scope.model.trend_analysis_days = 30;
	    		if(!isEmpty(result.data["trend.analysis.days"])){
	    			$scope.model.trend_analysis_days = result.data["trend.analysis.days"];
	    		}
	    		//登录失败锁定时长
	    		$scope.model.login_fail_lock_time = 1;
	    		if(!isEmpty(result.data["login.fail.lock.time"])){
	    			$scope.model.login_fail_lock_time = result.data["login.fail.lock.time"];
	    		}
	    		//管理台日志级别
	    		$scope.model.log_level = result.data["log.level"];
	    		//实时监控刷新间隔
	    		$scope.model.monitor_refresh_cycle = '0';
	    		if(result.data["monitor.refresh.cycle"] == 60000){
	    			$scope.model.monitor_refresh_cycle = '1';
	    		}else if(result.data["monitor.refresh.cycle"] == 300000){
	    			$scope.model.monitor_refresh_cycle = '2';
	    		}else if(result.data["monitor.refresh.cycle"] == 600000){
	    			$scope.model.monitor_refresh_cycle = '3';
	    		}
	    		//操作日志保留时长
	    		$scope.model.keep_operlog_month = 6;
	    		if (!isEmpty(result.data["keep.operlog.month"])) {
	    			$scope.model.keep_operlog_month = result.data["keep.operlog.month"];
	    		}
	    		
	    		//系统名称
	    		if(!isEmpty(result.data["cas.sys.name"])){
	    			$scope.model.cas_sys_name = result.data["cas.sys.name"];
	    		}
	    		
	    		//版权信息
	    		var copyinfo = result.data["cas.copyright.info"];
	    		if(copyinfo != null && typeof copyinfo != 'undefined' && copyinfo != ''){
	    			$scope.model.cas_copyright_info = copyinfo;
	    		}
	    		
	    		//切换动画效果
	    		$scope.model.transition_enable = '0';
	    		if (!isEmpty(result.data["transition.enable"])) {
	    			$scope.model.transition_enable = result.data["transition.enable"];
	    		}
	    		
	    		//最大在线操作员数
	    		$scope.model.max_online_num = 0;
	    		if(!isEmpty(result.data["max.online.num"])){
	    			$scope.model.max_online_num = result.data["max.online.num"];
	    		}
	    		
	    		//启用虚拟共享存储
	    		$scope.model.share_system_enable = 0;
	    		if(!isEmpty(result.data["share.system.enable"])){
	    			$scope.model.share_system_enable = result.data["share.system.enable"];
	    		}
	    		//登录页背景
	    		if(!isEmpty(result.data["login.background"])){
	    			$scope.model.login_background = result.data["login.background"];
	    		}
	    		//网站Favicon
	    		if(!isEmpty(result.data["cas.sys.favicon"])){
	    			$scope.model.sys_favicon = result.data["cas.sys.favicon"];
	    		}
	    		//版权Logo
	    		if(!isEmpty(result.data["cas.copyright.logo"])){
	    			$scope.model.cas_copyright_logo = result.data["cas.copyright.logo"];
	    		}
	    		//列表纵向分割线
	    		$scope.model.list_vertical_line = false;
	    		if(!isEmpty(result.data["list.vertical.line"])){
	    			if ('true' == result.data["list.vertical.line"]) {
	    				$scope.model.list_vertical_line = true;
	    			}
	    		} 
	    		//首页小Logo
	    		if(!isEmpty(result.data["app.top.logo.mini"])){
	    			$scope.model.app_top_logo_mini = result.data["app.top.logo.mini"];
	    		}
	    		
	    		//首页头背景
	    		if (!isEmpty(result.data["app.top.title"])){
	    			$scope.model.app_top_title = result.data["app.top.title"];
	    		}
	    		
	    		//产品Logo
	    		if (!isEmpty(result.data["app.top.logo"])){
	    			$scope.model.app_top_logo = result.data["app.top.logo"];
	    		}
	    		
	    		//注销虚拟机延迟天数
	    		$scope.model.logoutVmDelayDay = 0;
	    		if (!isEmpty(result.data["cancel.after.day"])){
	    			$scope.model.logoutVmDelayDay = result.data["cancel.after.day"];
	    		}
	    		
	    		// 注销动作
	    		$scope.model.logoutAction = '1';
	    		if (!isEmpty(result.data["cancel.action"])){
	    			$scope.model.logoutAction = result.data["cancel.action"];
	    		}
	    		
	    		//发送邮件提前天数
	    		$scope.model.sendEmailAheadDay = '0';
	    		if (!isEmpty(result.data["send.email.before.day"])){
	    			$scope.model.sendEmailAheadDay = result.data["send.email.before.day"];
	    		}
	    		
	    		$scope.model.deleteType = '0';
	    		if (!isEmpty(result.data["del.category"]) && $scope.model.logoutAction=='0'){
	    			$scope.model.deleteType = result.data["del.category"];
	    		}
	    		
	    		$scope.model.cloudBackupWorkPath = "/vms/vmbackup";
	    		
	    	}
	    }).error(function(response, code, headers, config) {
	    	
		});
	};
	$scope.$watch("model.security_mode_enable", function(newValue, oldValue){
		if (newValue == 1) {
			$scope.model.port = old_https_port;
		} else {
			$scope.model.port = old_http_port;
		}
	})	
	// 并没有什么用，密码策略页面是另外的页面，这里完全不需要。 comment by h14520 2017.9.8
	$scope.queryPasswordConf = function () {
		$http({
	        method  : 'GET',
	        url     : 'systemConfig/sysConfig',
	        params  : {type:"pwd_conf"}
	    }).success(function(result) {
	    	if (result.success) {
	    		// 重新获取参数
		    	$scope.pwd = {};
				modifyPwd = false;
				
	    		$scope.pwd.complexity = result.data["pwd.complexity"];
	    		$scope.pwd.length = result.data["pwd.min.length"];
	    		$scope.pwd.time = result.data["pwd.valid.time"];
	    		if ($scope.pwd.complexity == "0" || $scope.pwd.complexity == "2" || parseInt($scope.pwd.length) < 8 || parseInt($scope.pwd.time) < 1 || parseInt($scope.pwd.time) > 7) {
	    			modifyPwd = true;
	    		}
	    	}
	    }).error(function(response, code, headers, config) {
		
		});
	};
		
	$scope.levels = {
			options:[ {value:'3',label:$translate.instant('paramconfig.error')}
			,{value:'4',label:$translate.instant('paramconfig.warn')}
			,{value:'6',label:$translate.instant('paramconfig.tip')}
			],
			refreshCycleOptions:[ {value:'0',label:$translate.instant('paramconfig.30s')}
			,{value:'1',label:$translate.instant('paramconfig.1min')}
			,{value:'2',label:$translate.instant('paramconfig.5min')}
			,{value:'3',label:$translate.instant('paramconfig.10min')}
			],
			enableShareSystemOptions:[ {value:'1',label:$translate.instant('common.enable')}
			,{value:'0',label:$translate.instant('common.unable')}
			],
			enableTransitionOptions:[ {value:'1',label:$translate.instant('common.enable')}
			,{value:'0',label:$translate.instant('common.unable')}
			]
	};
	$scope.logoutAction={
		options:[{value:'1',label:$translate.instant("paramconfig.relieveRelation")},
		         {value:'0',label:$translate.instant("paramconfig.deleteVm")},
		         ]	
	};
	$scope.deleteType={
			options:[{value:'0',label:$translate.instant("paramconfig.saveMirror")},
			         {value:'1',label:$translate.instant("paramconfig.deleteMirror")},
			         ]	
		};
	$scope.saveParamConfig = function () {
		if (old_security_mode_enable != $scope.model.security_mode_enable) {
			var info = $translate.instant('paramconfig.securityModeConfigTip');
			if ($scope.model.security_mode_enable == 1) {
					info  = $translate.instant('paramconfig.securityModeConfigTip2');
			}
			var modalInstance = UtilService.confirm(info, $translate.instant('operConfirm'));
            modalInstance.result.then(function () {
            	$scope.save();
            	old_security_mode_enable = $scope.model.security_mode_enable; // add by h14520 更新保密模式当前值，确保重置时能弹出提示框
            }, function () {
            });
		} else {
			$scope.save();
		}
	};
	
	//重置系统参数后的回调函数 add by h14520 一线易用性需求, 系统参数增加重置按钮
	$scope.resetParamCallback = function() {
		$scope.querySysConf();
	};
	
	//重置 add by h14520 一线易用性需求, 系统参数增加重置按钮
	$scope.resetParamConfig = function () {
		if ($scope.safeArea) {
			UtilService.error($translate.instant("paramconfig.safeAreaExistForbidResetSysParam"),$translate.instant("common.opertip"));
			return;
		}
		var modalInstance = UtilService.confirm($translate.instant('paramconfig.confirmResetSystemParamConfig'), $translate.instant('operConfirm'));		
		modalInstance.result.then(function(){
			// 重置保密模式为关闭，弹出提示需要重启tomcat
			if (old_security_mode_enable != 0) {
				title = $translate.instant('paramconfig.securityModeConfigTip');
				var modalInstance = UtilService.confirm(title,$translate.instant('operConfirm'));
	            modalInstance.result.then(function () {
	            	HttpService.put("systemConfig/sysConfig/reset", undefined, undefined, $scope.resetParamCallback);
	            }, function () {
	            });
			} else {
				HttpService.put("systemConfig/sysConfig/reset", undefined, undefined, $scope.resetParamCallback);
			}
		})
	};
	
	
	$scope.save = function() {
		$scope.model.http_port = old_http_port;
		$scope.model.https_port = old_https_port;
		if ($scope.model.security_mode_enable == 1) {
			$scope.model.https_port = $scope.model.port;
		} else {
			$scope.model.http_port = $scope.model.port;
		}
		if($scope.isselected.login_background)
			$scope.stream.login_background.upload();
		if($scope.isselected.app_top_title)
			$scope.stream.app_top_title.upload();
		if($scope.isselected.sys_favicon)
			$scope.stream.sys_favicon.upload();
		if($scope.isselected.app_top_logo)
			$scope.stream.app_top_logo.upload();
		if($scope.isselected.app_top_logo_mini)
			$scope.stream.app_top_logo_mini.upload();
		if($scope.isselected.cas_copyright_logo)
			$scope.stream.cas_copyright_logo.upload();
		
		if(parseInt($scope.model.transition_enable)==1){
			$(".slidebar").addClass("transition");
//			$(".accordion").addClass("transition");
			$(".link").addClass("transition");
			$rootScope.transition=1;
		}else{
			$(".slidebar").removeClass("transition");
//			$(".accordion").addClass("transition");
			$(".link").removeClass("transition");
			$rootScope.transition=0;
		}
		//保存参数配置
		
		var data = angular.copy($scope.model);
		if($scope.model.monitor_refresh_cycle == '0'){
			data.monitor_refresh_cycle = 30000;
		}else if($scope.model.monitor_refresh_cycle == '1'){
			data.monitor_refresh_cycle = 60000;
		}else if($scope.model.monitor_refresh_cycle == '2'){
			data.monitor_refresh_cycle = 300000;
		}else if($scope.model.monitor_refresh_cycle == '3'){
			data.monitor_refresh_cycle = 600000;
		}
		
		$http({
	        method  : 'PUT',
	        url     : 'systemConfig/sysConfig?type=sys_conf',
	        data    : data
	    }).success(function(result) {
	    	$rootScope.listVerticalLine = data.list_vertical_line;
			UtilService.handleResult(result);
			if (result.success == true) {
				if ($rootScope.sessionTimer) {
					clearTimeout($rootScope.sessionTimer);
			}
					$rootScope.timeout = data.idle_timeout *60 * 1000;
				UtilService.startSessionTimer();
				}	
		}).error(function(response, code, headers, config) {
			UtilService.handleError(code);
		});
	};
	
	$scope.UPLOAD_IMAGE_OMMITED_PATH = "/img/cic/";
	$scope.isselected = {};
	$scope.isselected.login_background = false;
	$scope.isselected.app_top_title = false;
	$scope.isselected.sys_favicon = false;
	$scope.isselected.app_top_logo = false;
	$scope.isselected.app_top_logo_mini = false;
	$scope.isselected.cas_copyright_logo = false;
	
	$scope.stream = {};
	$scope.imgstream = {};
		
    function UploadImgStream(btnid,selectid,queueid,messageid,scope,param){
		   	
    	this.config = {    			
    	        customered : true, /**是否自定义ui**/
    	        browseFileId : btnid, /** 选择文件的ID, 默认: i_select_files */
    	        browseFileBtn : "<div>请选择文件</div>", /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
    	        dragAndDropArea: selectid, /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
    	        dragAndDropTips: "<span></span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
    	        filesQueueId : queueid, /** 文件上传容器的ID, 默认: i_stream_files_queue */
    	        filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
    	        messagerId : messageid, /** 消息显示容器的ID, 默认: i_stream_message_container */
    	        multipleFiles: false, /** 多个文件一起上传, 默认: false */
    	        autoUploading: false, /** 选择文件后是否自动上传, 默认: true */
    	        tokenURL : "fileUpload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
    	        frmUploadURL : "fileUpload/fd;", /** Flash上传的URI */
    	        uploadURL : "fileUpload/imgupload", /** HTML5上传的URI */
    	        swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
    	        simLimit: 1, /** 单次最大上传文件个数 */
    	        extFilters: [".jpg", ".png", ".bmp",".svg", "JPG", "PNG", "BMP", "SVG"], /** 允许的文件扩展名, 默认: [] */
    	        checkFileName : false,/**对文件名检测是否允许输入特殊字符，默认为true*/
    	        
    	        onSelect :function(list){
    	        	var cnt = 0;
    	        	for(c in scope['stream'][param].uploadInfo){
    	        		cnt++;
    	        	} 
    	        	if(cnt > 0 || scope['stream'][param].waiting.length > 0){
    	        		scope['stream'][param].uploadInfo = {};
    	        		scope['stream'][param].waiting.splice(0,scope['stream'][param].waiting.length);
    	        	}
    	        	$scope.$apply(function(){
    	        		scope['model'][param] = $scope.UPLOAD_IMAGE_OMMITED_PATH + list[0].name;   	        	
});
    	        	scope['isselected'][param] = true;    	      
    	        },
    	        onNameRegexMismatch: function(file) {
    	            fShowMessage($translate.instant('licenseMng.uploadisoNameRegexMismatch',{value:file.name}), true);
    	        },
    	        onExtNameMismatch: function(file, filters) {
    	            fShowMessage($translate.instant('licenseMng.uploadisoNameRegexMismatch',{value:file.name}), true);
    	        }, /** 文件的扩展名不匹配的响应事件 */
    	        onComplete: function(file) {
    	        	scope['isselected'][param] = false;
    	        },
    	        onUploadProgress: function(file) {
    	        },
    	        onDestroy: function() {} ,/** 文件上传出错的响应事件 */
    	        onCancel: function(){
    	        	scope['isselected'][param] = false;
    	        }
    	    };
    }
	$scope.imgstream.login_background = new UploadImgStream("login_background_btn","login_background_select_files",
			"login_background_stream_files_queue","login_background_stream_message_container",$scope,'login_background');	
	$scope.imgstream.app_top_title = new UploadImgStream("hometitle_background_btn","hometitle_background_select_files",
			"hometitle_background_stream_files_queue","hometitle_background_stream_message_container",$scope,'app_top_title');
	$scope.imgstream.sys_favicon = new UploadImgStream("sys_favicon_btn","sys_favicon_select_files",
			"sys_favicon_stream_files_queue","sys_favicon_stream_message_container",$scope,'sys_favicon');
	$scope.imgstream.app_top_logo = new UploadImgStream("app_top_logo_btn","app_top_logo_select_files",
			"app_top_logo_stream_files_queue","app_top_logo_stream_message_container",$scope,'app_top_logo');
	$scope.imgstream.app_top_logo_mini = new UploadImgStream("app_top_logo_mini_btn","app_top_logo_mini_select_files",
			"app_top_logo_mini_stream_files_queue","app_top_logo_mini_stream_message_container",$scope,'app_top_logo_mini');
	$scope.imgstream.cas_copyright_logo = new UploadImgStream("cas_copyright_logo_btn","cas_copyright_logo_select_files",
			"cas_copyright_logo_stream_files_queue","cas_copyright_logo_stream_message_container",$scope,'cas_copyright_logo');
    $timeout(function(){        
        $scope.stream.login_background = new Stream($scope.imgstream.login_background.config);
        $scope.stream.app_top_title = new Stream($scope.imgstream.app_top_title.config);
        $scope.stream.sys_favicon = new Stream($scope.imgstream.sys_favicon.config);
        $scope.stream.app_top_logo = new Stream($scope.imgstream.app_top_logo.config);
        $scope.stream.app_top_logo_mini = new Stream($scope.imgstream.app_top_logo_mini.config);
        $scope.stream.cas_copyright_logo = new Stream($scope.imgstream.cas_copyright_logo.config);
    }, 200);  
    
    $scope.clearImg = function(param){
    	$scope['model'][param] = "";
    	$scope['stream'][param].cancel();    	
    };

	// --- 切换到该页面后，自动刷新系统参数配置
	$scope.querySysConf();
	// $scope.queryPasswordConf // del by h14520 2017.9.8 系统参数的查询也修改也不依赖密码策略，不需要，因为密码策略页面完全是另外的控制器PwdStrategyCtrl来处理
});
//邮件配置
routeApp.controller('MailServerCtrl',function($scope, $http, $translate, UtilService, HttpService) {
	$scope.model = {};
	$scope.param = {};
	$http({
        method  : 'GET',
        url     : 'systemConfig/mailServer'
    }).success(function(result) {
    	if (result.success) {
    		$scope.model.server_addr = result.data["server.addr"];
    		$scope.model.server_port = result.data["server.port"];
    		if (isEmpty($scope.model.server_port)) {
    			$scope.model.server_port = 25;
    		}
    		$scope.model.auth_username = result.data["auth.username"];
    		var pwd = result.data["auth.password"];
    		if (pwd) {
    			pwd = UtilService.decryptByDES(pwd);
    		}
    		$scope.model.auth_password = pwd;
    		$scope.model.sender_addr = result.data["sender.addr"];
    		$scope.model.sender_name = result.data["sender.name"];
    		if(!isEmpty($scope.model.auth_username)){
    			$scope.param.auth = true;
    		}else{
    			$scope.param.auth = false;
    		}
    		if ($scope.param.auth) {
    			if (result.data["auth.ssl"] == 'true'){
    				$scope.model.sslEncrypt = true;
    			} else {
    				$scope.model.sslEncrypt = false;
    			}
    		} else {
    			$scope.model.sslEncrypt = false;
    		}
    	}
    }).error(function(response, code, headers, config) {
    	
	})
	$scope.saveParamConfig = function () {
		//保存参数配置
		var data = angular.copy($scope.model);
		if ($scope.model.sslEncrypt == true){
			data.sslEncrypt = 'true';
		} else if ($scope.model.sslEncrypt == false){
			data.sslEncrypt = 'false';
		}
		if (data.auth_password) {
			data.auth_password = UtilService.encryptByDES(data.auth_password);
		}
		HttpService.put("systemConfig/mailServer", data);
	};
	$scope.callback = function(){
		$scope.model.server_addr = "";
		$scope.model.server_port = 25;
		$scope.param.auth = false;
		$scope.model.auth_username = undefined;
		$scope.model.auth_password = undefined;
		$scope.model.sslEncrypt = false;
		$scope.model.sender_addr = "";
		$scope.model.sender_name = "";
	}
	//重置
	$scope.resetParamConfig = function() {
		// 弹出confirm对话框
        var modalInstance = UtilService.confirm($translate.instant('paramconfig.confirmResetMailConfig'), $translate.instant('operConfirm'));
        modalInstance.result.then(function (selectedItem) {
		HttpService.put("systemConfig/mailServer/reset", undefined, undefined, $scope.callback);
        }, function () {
        });
	}
	
	$scope.mailtest = function() {
		var data = angular.copy($scope.model);
		if ($scope.model.sslEncrypt == true){
			data.sslEncrypt = 'true';
		} else if ($scope.model.sslEncrypt == false){
			data.sslEncrypt = 'false';
		}
		if ($scope.param.auth == false) {
			data.auth_password = undefined;
			data.auth_username = undefined;
		}
		if (data.auth_password) {
			data.auth_password = UtilService.encryptByDES(data.auth_password);
		}
		HttpService.put("systemConfig/mailServer/test", data);
	}
});
//短信配置
routeApp.controller("SmsServerCtrl", function($scope, $http, $translate, UtilService, HttpService){
	$scope.jxt={};
	$scope.huawei={};
	$scope.smsTypes = [
	                   {value: '1', label: $translate.instant("paramconfig.huawei")},
	                   {value: '2', label: $translate.instant("paramconfig.jxt")}];
	$http({
		method:"GET",
		url:"systemConfig/smsServer"
	}).success(function(result){
		var data = result.data;
		if (data) {
			//华为短信机
			if (!isEmpty(data.smsHWDbPassword)) {
				data.smsHWDbPassword = UtilService.decryptByDES(data.smsHWDbPassword);
			}
			if (!isEmpty(data.smsHWPassword)) {
				data.smsHWPassword = UtilService.decryptByDES(data.smsHWPassword);
			}
			//吉信通短信平台
			if (!isEmpty(data.smsJXTPassword)) {
				data.smsJXTPassword = UtilService.decryptByDES(data.smsJXTPassword);
			}
			if (!isEmpty(data.smsJXTProxyPassword)) {
				data.smsJXTProxyPassword = UtilService.decryptByDES(data.smsJXTProxyPassword);
			}
		}
		$scope.model = data;
		if (isEmpty($scope.model.enableSms) || $scope.model.enableSms == '0'){
			$scope.model.enableSms = false;
		} else {
			$scope.model.enableSms = true;
		}
		if (isEmpty($scope.model.smsType)){
			$scope.model.smsType = '2';
		}
		if ($scope.model.smsType == '2'){
			if (isEmpty($scope.model.smsJXTEnableProxy) || $scope.model.smsJXTEnableProxy == '0'){
				$scope.model.smsJXTEnableProxy = false;
			} else {
				$scope.model.smsJXTEnableProxy = true;
			}
			
		}
		var businessView = $scope.model.smsBusinessView;
		var businessS = businessView.split(",");
		if (businessS.contains('1')) {
			$scope.model.vmApply = '1';
		} else {
			$scope.model.vmApply = '0';
		}
		if (businessS.contains('2')) {
			$scope.model.cloudHdApply = '1';
		} else {
			$scope.model.cloudHdApply = '0';
		}
		if (businessS.contains('3')) {
			$scope.model.userAheadRegister = '1';
		} else {
			$scope.model.userAheadRegister = '0';
		}
		if (businessS.contains('4')) {
			$scope.model.cloudBackupStrategy = '1';
		} else {
			$scope.model.cloudBackupStrategy = '0';
		}
		
	});
	$scope.callback = function(){
		$scope.form.$dirty = false;
		$scope.form.$pristine = true;
		$scope.model.enableSms = false;
		$scope.model.smsType = '2';
		
		$scope.model.smsJXTLoginName = undefined;
		$scope.model.smsJXTPassword = undefined;
		$scope.model.smsJXTEnableProxy = undefined;
		
		$scope.model.smsJXTProxyServer = undefined;
		$scope.model.smsJXTProxyPort = undefined;
		$scope.model.smsJXTProxyUserName = undefined;
		$scope.model.smsJXTProxyPassword = undefined;
		
		$scope.model.smsHWIpAddress = undefined;
		$scope.model.smsHWDbUserName = undefined;
		$scope.model.smsHWDbPassword = undefined;
		$scope.model.smsHWLoginName = undefined;
		$scope.model.smsHWPassword = undefined;
		$scope.model.smsHWIdNum = undefined;
		$scope.model.smsHWBusinessNum = undefined;
		
		//修改问题单：201703030447 CIC系统管理中参数配置短信配置里的重置按钮对“需转短信的业务”中的选项不生效。
		$scope.model.vmApply = undefined;
		$scope.model.cloudHdApply = undefined;
		$scope.model.userAheadRegister = undefined;
		$scope.model.cloudBackupStrategy = undefined;
		
	}
	//重置
	$scope.resetParamConfig = function(){
		// 弹出confirm对话框
        var modalInstance = UtilService.confirm($translate.instant('paramconfig.confirmResetSmsConfig'), $translate.instant('operConfirm'));
        modalInstance.result.then(function (selectedItem) {
		HttpService.put("systemConfig/smsServer/reset", undefined, undefined, $scope.callback);
        }, function () {
        });
	};
	$scope.getPutdata = function(){
		var data = angular.copy($scope.model);
		var businessView = "";
		if ($scope.model.vmApply == '1') {
			businessView += "1,";
		}
		if ($scope.model.cloudHdApply == '1'){
			businessView += "2,";
		}
		if ($scope.model.userAheadRegister == '1'){
			businessView += "3,";
		}
		if ($scope.model.cloudBackupStrategy == '1'){
			businessView += "4,";
		}
		if (!isEmpty(businessView)){
			businessView = businessView.substring(0, businessView.length - 1);
		}
		data.smsBusinessView = businessView;
		delete data.vmApply;
		delete data.cloudHdApply;
		delete data.userAheadRegister;
		delete data.cloudBackupStrategy;
		
		if ($scope.model.enableSms == true) {
			data.enableSms = '1';
		} else {
			data.enableSms = '0';
		}
		
		if ($scope.model.smsJXTEnableProxy == true){
			data.smsJXTEnableProxy = '1';
		} else {
			data.smsJXTEnableProxy = '0';
		}
		if (!isEmpty(data.smsHWDbPassword)) {
			data.smsHWDbPassword = UtilService.encryptByDES(data.smsHWDbPassword);
		}
		if (!isEmpty(data.smsHWPassword)) {
			data.smsHWPassword = UtilService.encryptByDES(data.smsHWPassword);
		}
		if (!isEmpty(data.smsJXTPassword)) {
			data.smsJXTPassword = UtilService.encryptByDES(data.smsJXTPassword);
		}
		if (!isEmpty(data.smsJXTProxyPassword)) {
			data.smsJXTProxyPassword = UtilService.encryptByDES(data.smsJXTProxyPassword);
		}
		return data;
	}
	//保存配置
	$scope.saveParamConfig = function(){
		if ($scope.model.vmApply == '0' && $scope.model.cloudHdApply == '0' && $scope.model.userAheadRegister == '0' &&
				$scope.model.cloudBackupStrategy == '0'){
			UtilService.error($translate.instant("paramconfig.selectBusinessView"), $translate.instant("common.opertip"));
			return;
		}
		var data = $scope.getPutdata();
		HttpService.put("systemConfig/smsServer", data);
	};
	
	//测试短信
	$scope.testSmsSend = function() {
		if ($scope.model.vmApply == '0' && $scope.model.cloudHdApply == '0' && $scope.model.userAheadRegister == '0' &&
				$scope.model.cloudBackupStrategy == '0'){
			UtilService.error($translate.instant("paramconfig.selectBusinessView"), $translate.instant("common.opertip"));
			return;
		}
		var data = $scope.getPutdata();
	    $http.put('systemConfig/smsServer', data).success(function(result) {
			if (result.success == true) {
				UtilService.mgmodal('html/modal/systemManage/testSms.html', 'testSmsCtrl');
			} else {
				UtilService.handleResult(result);
			}
		}).error(function(response, code, headers, config) {
			UtilService.handleError(code);
			return false;
		});
	};
});

routeApp.controller('testSmsCtrl', function($scope, $translate, $modalInstance, UtilService, HttpService, $http) {
	  
	$scope.smsPhoneTest = function () {
		var waitModal = UtilService.wait();
		//组装请求数据
		var data = {};
		data.emailList = [];
		data.emailList.push($scope.model.phone);
	   	 //发送请求
	    $http.put('systemConfig/smsServerConTest', data).success(function(result) {
	    	waitModal.dismiss();
			//数据成功返回后执行回调方法
	    	if (result.data == true) {
	    		$modalInstance.dismiss('cancel');
	    		UtilService.alert($translate.instant('alarm.smsTestSucess'), $translate.instant('common.opertip'), false, 'error');
	    	} 
	    	UtilService.handleResult(result);
		}).error(function(response, code, headers, config) {
			waitModal.dismiss();
			UtilService.handleError(code);
		});
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


//【参数配置】/【用户自助系统参数】
routeApp.controller("UserSelfhelp", function($scope, $http, $translate, UtilService, HttpService){
	$scope.model = {};
	$scope.enable = {
			options:[ {value:'1',label:$translate.instant("common.enable")},
			          {value:'0',label:$translate.instant("common.unable")}]	
	};
	
	// 查询
	$scope.query = function() {
		$http({
	        method  : 'GET',
	        url     : 'systemConfig/sysConfig',
	        params:{type:"ssv_conf"}
	    }).success(function(result){
	    	$scope.model = {};
	    	
	    	$scope.model.isusing_snap = result.data["ssv.isusing.snap"];
	    	$scope.model.isusing_backup = result.data["ssv.isusing.backup"];
	    	$scope.model.isusing_disk = result.data["ssv.isusing.disk"];
	    	$scope.model.isusing_alarm = result.data["ssv.isusing.alarm"];
	    	$scope.model.isusing_firewall = result.data["ssv.isusing.firewall"];
	    	
	    	$scope.model.isusing_message = result.data["ssv.isusing.message"];
	    	$scope.model.isusing_workorder = result.data["ssv.isusing.workorder"];
	    	$scope.model.ssv_vnc = result.data["ssv.vnc"];
	    	$scope.model.isusing_instant_message = result.data["ssv.isusing.instant.message"];
	    	
	    	$scope.model.systemName = result.data["ssv.system.name"];
	    	$scope.model.systemLogo = result.data["ssv.system.logo"];
	    	$scope.model.systemLogoHeight = result.data["ssv.system.logo.height"];
	    	$scope.model.systemLogoWidth = result.data["ssv.system.logo.width"];
	    	$scope.model.copyright = result.data["ssv.copyright.info"];
	    	$scope.model.vendorLogo = result.data["ssv.vendor.logo"]
	    	$scope.model.vendorLogoHeight = result.data["ssv.vendor.logo.height"];
	    	$scope.model.vendorLogoWidth = result.data["ssv.vendor.logo.width"];
	    	if ($scope.model.systemLogoHeight == 'null'){
	    		$scope.model.systemLogoHeight = null;
	    	}
	    	if ($scope.model.systemLogoWidth == 'null'){
	    		$scope.model.systemLogoWidth = null;
	    	}
	    	if ($scope.model.vendorLogoHeight == 'null'){
	    		$scope.model.vendorLogoHeight = null;
	    	}
	    	if ($scope.model.vendorLogoWidth == 'null'){
	    		$scope.model.vendorLogoWidth = null;
	    	}
	    });
	}
	
	
	//保存配置
	$scope.save = function(){
//		if ($scope.model.isusing_backup == '1') {
//			$http.get("org/backup/isNull").success(function(result){
//				if (result && result.data) {
//					UtilService.error($translate.instant("paramconfig.orgBackupNullTip",{orgNames:result.data}), $translate.instant("common.opertip"))
//				}
//			});
//		}
		HttpService.put("systemConfig/sysConfig?type=ssv_conf", $scope.model);
	};
	
	
	
	// 重置的回调函数
	$scope.resetCallback = function() {
		$scope.query();
	}
	
	//重置
	$scope.resetParamConfig = function(){
		// 弹出confirm对话框
        var modalInstance = UtilService.confirm($translate.instant('paramconfig.confirmResetSsvConfig'), $translate.instant('operConfirm'));
        modalInstance.result.then(function (selectedItem) {
		HttpService.put("systemConfig/ssvConfig/reset", undefined, undefined, $scope.resetCallback);
        }, function () {
        });
	};
	
	
	// -- 界面初始化/刷新时，查询 ---
	$scope.query();
});
//【系统管理】/【用户】/导入用户
routeApp.controller("ImportUserCtrl", function($scope, $http, $translate,$modal,$modalInstance,$timeout, $rootScope, type, rowObject, UtilService, HttpService){
	$scope.model = {};
	$scope.type = type;
	if ($scope.type == "orgImport" && angular.isDefined(rowObject)){
		$scope.model.orgId = rowObject.orgId;
		$scope.model.organization = rowObject.orgName;
	}
	$scope.stream = null;
	$scope.stepTitles = [ $translate.instant('user.importFile'),
						  $translate.instant('user.configFile'),
						 ];
	var slideOne = true;
	$scope.valids = {
			stepOneOver : function() {
				if ($('#form1').val() === "true" && slideOne == true)
					return true;
				return false;
			},
			stepTwoOver : function() {
				if ($('#form2').val() === "true")
					return true;
				return false;
			}
		};
	$scope.separator = {
			options:[ {value:'0',label:$translate.instant("user.comma")},
			          {value:'1',label:$translate.instant("user.semicolon")},
			          {value:'2',label:$translate.instant("user.tabKey")},
			          {value:'3',label:$translate.instant("user.space")}
			]	
	};
	$scope.level={
			selectCols1:[],
			selectCols2:[]	
	};
	$scope.model.separator='0';
	
	$scope.$watch("model.separator", function(newValue, oldValue){
		if (newValue != oldValue){
			$scope.queryColNum();
		}
	});
	$scope.queryColNum = function(){
		var value = "";
		if ($scope.model.separator == '0') {
			value = ",";
		} else if ($scope.model.separator == '1') {
			value = ";";
		} else if ($scope.model.separator == '2') {
			value = "tab";
		} else if ($scope.model.separator == '3') {
			value = "space";
		}
		$http({
			method : "GET",
			url : "user/upload/success",
			params : {separator : value}
		}).success(function(result){
			$scope.col = result.data;
			slideOne = true;
			if (result.state == 1) {
				slideOne = false;
				UtilService.error($translate.instant("user.fileLayoutError"), $translate.instant("common.errorTip"));
			}
			$scope.level.selectCols1 = [];
			$scope.level.selectCols2 = [];
			for (var i = 0; i < $scope.col; i++){
				$scope.level.selectCols1.push({value : i, label : $translate.instant("user.columnDisplayName", {index:i+1})});
				$scope.level.selectCols2.push({value : i, label : $translate.instant("user.columnDisplayName", {index:i+1})});
			}
			$scope.level.selectCols2.push({value : $scope.col, label : $translate.instant("user.notSelectVal")});
			$scope.model.loginName = 0;
			$scope.model.password = 0;
			$scope.model.userName = 0;
			$scope.model.credentialNumber = result.data;
			$scope.model.email = 0;
			$scope.model.phone = result.data;
			$scope.model.address = result.data;
			$scope.model.userGroups = 0;
		}).error(function(response, code, headers, config) {
	    	  UtilService.handleError(code);
	    	  $timeout(function(){$scope.progress = 100;});
	    	});
	};
    //选择组织
    $scope.orgSelector=function(){
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectOrg.html',
        	controller:'SelectOrgCtrl',
        	backdrop:'static',
        	size:"lg"
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.model.orgId = selectItem[0].id;
    		$scope.model.organization = selectItem[0].name;
    		$scope.model.defaultGroupName = null;
    		$scope.model.defaultGroupId = null;
    	},function(){
    		
    	});
    };
    //选择指定用户分组
    $scope.assignUserGrpSelector=function(){
    	if (!$scope.model.organization) {
    		UtilService.error($translate.instant("user.orgSelectPrompt"), $translate.instant("user.selectGroup"));
    		return;
    	}
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectUserGrp.html',
        	controller:'SelUserGroupCtrl',
        	resolve:{ orgId : function() {return $scope.model.orgId},
        		orgName : function() {return $scope.model.organization}},
        	backdrop:'static',
        	size:{width:"1000px", height:"400px"}
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.model.defaultGroupName=selectItem.name;
    		$scope.model.defaultGroupId = selectItem.id;
    	},function(){
    		
    	});
    };
    $scope.downloadTemplate = function() {
		var url = "userTemplate.rar";
		window.open(url, "_blank", null);
    }
    $scope.preview = function() {
    	if (isEmpty($scope.model.importFile)){
    		return;
    	}
    	var resolve = {
    		separator : function(){
    			if ($scope.model.separator == '0') {
    				return ",";
    			} else if ($scope.model.separator == '1') {
    				return ";";
    			} else if ($scope.model.separator == '2') {
    				return "tab";
    			} else if ($scope.model.separator == '3') {
    				return "space";
    			}
    		},
    		colNum : function() {
    			return $scope.col;
    		}
    	};
    	var modalInstance = UtilService.lgmodal("html/modal/systemManage/user/previewUser.html", 'previewUserCtrl', resolve, {'width':'800px', 'height':'500px'});
    };
    var config = {
    		autoUploading : true, /**选择文件后是否自动上传**/
    		customered : true, /**是否自定义ui**/
    		browseFileId : "file_select_btn", /** 选择文件的ID, 默认: i_select_files */
    		filesQueueId : "i_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
    		filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
    		dragAndDropArea: "i_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
    		dragAndDropTips: "<span></span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
    		messagerId : "i_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
    		multipleFiles: false, /** 多个文件一起上传, 默认: false */
    		autoUploading: true, /** 选择文件后是否自动上传, 默认: true */
    		tokenURL : "fileUpload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
    		frmUploadURL : "fileUpload/fd;", /** Flash上传的URI */
    		uploadURL : "fileUpload/user/upload", /** HTML5上传的URI */
    		swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
    		simLimit: 1, /** 单次最大上传文件个数 */
    		extFilters: [".csv",".txt"], /** 允许的文件扩展名, 默认: [] */
    		checkFileName : false,/**对文件名检测是否允许输入特殊字符，默认为true*/
    		onSelect: function(list) {
    			$timeout(function(){
    				$scope.model.importFile = list[0].name;
    				//$scope.stream.upload();
    			})
    		}, /** 选择文件后的响应事件 */
    		onNameRegexMismatch: function(file) {
    			fShowMessage($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}), true);
    		},
    		onExtNameMismatch: function(file, filters) {
    			fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
    			$timeout(function(){$scope.model.importFile = "";});
    		}, /** 文件的扩展名不匹配的响应事件 */
    		onComplete: function(file) {
    			$scope.stream.destroy();
    			$scope.stream = new Stream($scope.config);
    			$scope.queryColNum();
    			$timeout(function(){$scope.progress = 100;});
    			//fShowMessage($translate.instant('uploadfile.uploadisoQueueComplete'), false);
    		}, /** 单个文件上传完毕的响应事件 */
    		onUploadProgress: function(file) {
    			$timeout(function(){
    				if (file.percent < 100) {					
    					$scope.progress = file.percent;
    				}
    			});
    		},
    		onDestroy: function() {} /** 文件上传出错的响应事件 */
    	};
    	$scope.config = config;
    	$timeout(function(){
    		if ($scope.stream == null) {
    			$scope.stream = new Stream($scope.config);
    		}
        	$("#i_select_files").hide();
    		$("#i_stream_files_queue").hide();
    		$("#i_stream_message_container").hide();
    	}, 500);
    	
    	
    	function fShowMessage(msg, warning) {
        	var o = document.getElementById("i_select_files_btn_alert");
        	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
        }
    	function falertMessage(msg,warning){
        	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:0px;padding:10px;margin-bottom:10px;text-align:center;word-break:break-all;" class="alert ';
        	s+= !!warning?"alert-danger":"alert-success";
        		s+='" role="alert">'+
        		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
        		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
        		msg+'</div>';
        	return s;
        }
	//保存配置
	var callback = function(result){
		$scope.showTaskList();
		if (angular.isArray(result.data) && result.data.length > 0) {
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/org/showErrorMessage.html',
				controller: 'ShowErrorCtrl',
				backdrop:'static',
				resolve: {title : function() {return $translate.instant("user.importUserError");},
					      store : function() {return result.data;}}
			});
			modalInstance.result.then(function (selectedItem) {
			}, function () {
				  
			});
		}
		
    }
	$scope.$watch("model.userGroups", function (){
		if ($scope.model.userGroups != $scope.col) {
			$scope.model.defaultGroupName = undefined;
			$scope.model.defaultGroupId = undefined;
		}
	});
	$scope.ok = function(){
		$scope.model.colNumber = $scope.col;
		if (!isEmpty($scope.model.defaultGroupName) && !isEmpty($scope.model.defaultGroupId)) {
			$scope.model.type = 2;
		} else {
			$scope.model.type = 1;
		}
		var data = angular.copy($scope.model);
		if (data.credentialNumber == $scope.col) {
			delete data.credentialNumber;
		}
		if (data.phone == $scope.col) {
			delete data.phone;
		} 
		if (data.address == $scope.col) {
			delete data.address;
		}
		if (data.userGroups == $scope.col) {
			delete data.userGroups;
		}
		delete data.importFile;
		HttpService.put("user/import", data, $modalInstance, callback);
	};
	$scope.cancel=function(){
		if ($scope.stream != null) {
			$scope.stream.destroy();
	    	$scope.stream=null;
		}
		$modalInstance.dismiss("cancel");
	};
});

routeApp.controller('previewUserCtrl',function($scope, $translate, $modalInstance, separator, colNum, UtilService, GridService, $timeout) {
	var column = [];
	for (var i = 0; i < colNum; i++){
		column.push({field : "col" + i, displayName : $translate.instant("user.columni", {index:i+1}), sortable:false, width:"100px"});
	}
	$scope.url = "user/import/preview";
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
    })
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
});

//LDAP用户导出控制器
routeApp.controller('ldapExportCtrl',function($scope, $http, $timeout, $translate, UtilService, HttpService) {
	//初始化过滤条件
	$scope.attrSelections = [];
	$scope.model={};
	$scope.model.filterCondition = "(&(objectclass=*)(cn=*))";
	$scope.showAttribute = false;
	$scope.model.ldapServer = 0;
	$scope.model.format = 0;//CSV
	$scope.model.columnSeparateSign = 0;//列分隔符
	$scope.model.exportAttrName = 0;//是否导出属性名称
	$scope.ldapSearch = function(){
		var ldapServerId = $scope.model.ldapServer;
		var filterName = $scope.model.filterCondition;
		var param = {};
		param.id = ldapServerId;
		param.filter = filterName;
		
		var callBack = function(result) {
			if (angular.isDefined(result) && result.success) {
				var datas = result.data;
				$scope.myData = datas;
				$scope.showAttribute = true;
			}
		}
		HttpService.put('ldap/queryAttributes', param, undefined, callBack);
	};
	
	//重置LDAP服务器和过滤条件
	$scope.ldapServerReset = function() {
		$scope.model.ldapServer = "";
		$scope.model.filterCondition = "(&(objectclass=*)(cn=*))";
	}
	//邮件服务器
	$scope.ldapServer = {      
	        options:[]
	};
	//文件格式
	$scope.format = {      
	        options:[{value:0, label:"CSV"},
	                 {value:1, label:"txt"}]
	};
	//列分隔符
	$scope.columnSeparateSign = {      
	        options:[{value:0, label:$translate.instant('ldap.space')},
	                 {value:1, label:","},
	                 {value:2, label:";"},
	                 {value:3, label:":"},
	                 {value:4, label:"TAB"},
	                 {value:5, label:"#"},
	                 {value:6, label:"$"}]
	};
	
	//列分隔符
	$scope.exportAttrName = {      
	        options:[{value:0, label:$translate.instant('ldap.no')},
	                 {value:1, label:$translate.instant('ldap.yes')}]
	};
	
	//返回
	$scope.goBack = function() {
		$scope.showAttribute = false;
	};
	
	$scope.$watch("model.format", function(newValue, oldValue){
		if($scope.model.format == '0'){
			$scope.model.columnSeparateSign = 1;
		} 
	});
	
	//导出LDAP用户
	$scope.exportLdapUser = function() {
		var ldapServerId = $scope.model.ldapServer;
		var filterName = $scope.model.filterCondition;
		var param = {};
		param.id = ldapServerId;
		param.filter = filterName;
		param.attrList = $scope.attrSelections;
		if ($scope.attrSelections.length == 0) {
			UtilService.alert($translate.instant('ldap.exportAttriTip'), $translate.instant('common.opertip'), false, 'error');
			return;
		}
		param.separator = $scope.model.columnSeparateSign;
		param.showHeader = $scope.model.exportAttrName;
		var format = ".csv";
		if ($scope.model.format == 1) {
			format = ".txt";
		} 
		var callBack = function(result) {
			if (angular.isDefined(result) && result.success) {
				$scope.attrSelections.splice(0, $scope.attrSelections.length);
				var fileName = $scope.model.exportName;
				//var datas = result.data;
				//$scope.myData = datas;
				$scope.showAttribute = false;
			    var param = "height=100, width=100, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
			    var filePath = encodeURIComponent(UtilService.encryptByDES(result.data));
       		 	var name = encodeURIComponent(UtilService.encryptByDES(fileName + format));
			    var uri =  "download/fileDownload?filePath=" + filePath + "&fileName=" + name;
				window.open(uri, "_blank", param);
			}
		}
		HttpService.put('ldap/exportUsers', param, undefined, callBack);
	};
	
	//查询所有ldap服务器
	var getAllLdapServer = function() {
    	 var waitModal = UtilService.wait();
    	 $http.get('ldap/getAllLdapServer')
    	 .success(function(result) {
    		 waitModal.dismiss();
    		 var datas = result.data;
    		 for (var i = 0; i < datas.length; i++) {
    			 var id = datas[i].id;
    			 var name = datas[i].name;
    			 var optionNode = {value:id, label:name};
    			 $scope.ldapServer.options.push(optionNode);
    		 }
    	 }).error(function(response, code, headers, config) {
       	    waitModal.dismiss();
    	    UtilService.handleError(code);
    	 });
	};
	getAllLdapServer();
	
    $scope.listStyle = $scope.gridStyle(50, true);
	listenNavClick($scope, $timeout, 50, true);
	
	var column = [{ field: 'attr', displayName: $translate.instant('ldap.attributeName'), sortable: true, width:'50%'},
	              { field: 'value', displayName: $translate.instant('ldap.egData'), sortable: true, width:'50%'}
	              ]
	
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.attrSelections,
			showSelectionCheckbox: true,
			multiSelect: true,
			showGroupPanel: false,
			showColumnMenu: true,
			showFilter: false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: false,
			showFooter: false,
			i18n: $translate.instant('load.static.lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	};  
});

//增加LDAP策略
routeApp.controller('addLdapStrategyCtrl', function($scope, $http, $modal, $translate, $timeout, $modalInstance, isAdd, ldapData, UtilService, HttpService) {
	 $scope.isAdd = isAdd;
	 if (isAdd) {
		 //增加LDAP同步策略
		 $scope.headTitle = $translate.instant('ldap.addStrategy');
	  } else {
		 //修改LDAP同步策略
		 $scope.headTitle = $translate.instant('ldap.editLdapStra');
	  }
	  //步骤提示的显示
     $scope.stepTitles = [ $translate.instant('baseinfo'),
                           $translate.instant('ldap.syncConfig'),
                           $translate.instant('ldap.syncStrategyInfo'),
                           $translate.instant('ldap.userInfo')
                          ];
     //数据初始化
	 $scope.strategy = {};
	 $scope.strategy.syncUserGroup=0;
	 $scope.strategy.status=1;
	 $scope.strategy.requiredSync=false;
	 $scope.strategy.autoSync=false;
	 $scope.strategy.newSync=false;
	 $scope.strategy.existSync=false;
	 $scope.strategy.childSync=false;
	 $scope.strategy.autoDeleteUser=false;
	 $scope.strategy.iDNum = $translate.instant('ldap.notSyncFromLDAP');
	 $scope.strategy.address = $translate.instant('ldap.notSyncFromLDAP');
	 $scope.strategy.phoneNum = $translate.instant('ldap.notSyncFromLDAP');
	 
	 $scope.syncUserGroupOptions = {      
		        options:[{value:1, label:$translate.instant('ldap.syncOUGroup')},
		                 {value:0, label:$translate.instant('ldap.notSyncGroup')}
		                ]
	 }; 
	

	 $scope.statusOptions = {      
		        options:[{value:1, label:$translate.instant('ldap.validate')},
		                 {value:0, label:$translate.instant('ldap.inValidate')}
		                ]
	 }; 
	 
	 $scope.userNameOptions = {      
		        options:[]
	 }; 
	 
	 $scope.iDNumOptions = {      
		        options:[{value:$translate.instant('ldap.notSyncFromLDAP'), label:$translate.instant('ldap.notSyncFromLDAP')}]
	 }; 
	 $scope.addressOptions = {      
		        options:[{value:$translate.instant('ldap.notSyncFromLDAP'), label:$translate.instant('ldap.notSyncFromLDAP')}]
	 }; 
	 $scope.phoneNumOptions = {      
		        options:[{value:$translate.instant('ldap.notSyncFromLDAP'), label:$translate.instant('ldap.notSyncFromLDAP')}]
	 }; 
	 $scope.eMailOptions = {      
		        options:[]
	 }; 
	 

	 $scope.$watch('strategy.requiredSync',function(newVal, oldVal) {
			if (newVal == true) {
				$scope.strategy.newSync=false;
			}
	 });
	 $scope.$watch('strategy.newSync',function(newVal, oldVal) {
			if (newVal == true) {
				$scope.strategy.requiredSync=false;
			} 
	 });
	 
	 
	 if (!isAdd) {
		//修改LDAP策略
		 var params = {};
    	 params.id = ldapData.id;
    	 //执行查寻用户信息操作
    		$http({
                method: 'GET',
                url: 'ldap/queryLdapStrategyById',
                params: params
            }).success(function(result) {
            	if (result.success) {
            	var ldapData = result.data;
            	if (ldapData != null) {
            	  	$scope.strategy.strategyName = ldapData.strategyName;
            	  	var ldapServerData = ldapData.ldapServerData;
            	  	if (ldapServerData != null) {
            	  		$scope.strategy.ldapServer = ldapServerData.name;
            	  		$scope.strategy.loginName = ldapServerData.loginName;
            	  	    $scope.strategy.ldapServerId = ldapServerData.id;
            	  	    $scope.strategy.baseDn = ldapServerData.baseDn;
            	  	}
            	  	$scope.strategy.childBaseDN = ldapData.childBaseDN;
            	  	//201701190366 当子Base DN不存在时，修改页面的子Base DN属性置为空
            	  	if (ldapData.checkSubBaseDn != null && ldapData.checkSubBaseDn == false) {
            	  		$scope.strategy.childBaseDN = "";
            	  	}
            	  	$scope.strategy.conditions = ldapData.conditions;
            	  	$scope.strategy.orgId = ldapData.orgId;
            		$scope.strategy.orgName = ldapData.orgName;
            		$scope.strategy.userGroupName = ldapData.userGroupName;
            		$scope.strategy.userGroupId = ldapData.userGroupId;
            		$scope.strategy.syncUserGroup=ldapData.syncUserGroup;
            		$scope.strategy.status=ldapData.status;
            		
            		$scope.strategy.autoSync = ldapData.autoSync == 0? false : true;
            		$scope.strategy.requiredSync = ldapData.requiredSync == 0? false : true;
            		$scope.strategy.newSync = ldapData.newSync == 0? false : true;
            		$scope.strategy.existSync = ldapData.existSync == 0? false : true;
            		$scope.strategy.childSync = ldapData.childSync == 0? false : true;
            		$scope.strategy.autoDeleteUser = ldapData.autoDeleteUser == 0? false : true;
            	  	
            		 var params = {};
		        	 params.serverId = $scope.strategy.ldapServerId;
		        	 params.subBaseDn = $scope.strategy.childBaseDN;
	        		$http({
	                    method: 'GET',
	                    url: 'ldap/queryLdapServerAttributes',
	                    params: params
	                }).success(function(res) {
	               	  if (res.success == true) {
	               		  var data = res.data;
	               		  if(data) {
	        				  for(var i = 0 ; i< data.length; i++) {
	        					  var temp = {value:data[i]+'', label:data[i]};
	        					  $scope.userNameOptions.options.push(temp);
	        					  $scope.iDNumOptions.options.push(temp);
	        					  $scope.addressOptions.options.push(temp);
	        					  $scope.phoneNumOptions.options.push(temp);
	        					  $scope.eMailOptions.options.push(temp);
	        				  }
	        				  if (data.length) {
	        					  //选择项赋值
	        					  $scope.strategy.userName = ldapData.userName;
	        				      $scope.strategy.iDNum = ldapData.IDNum == null ? $translate.instant('ldap.notSyncFromLDAP'):ldapData.IDNum;
        				    	  $scope.strategy.address = ldapData.address == null ? $translate.instant('ldap.notSyncFromLDAP'):ldapData.address;
	        				      $scope.strategy.phoneNum = ldapData.phoneNum == null? $translate.instant('ldap.notSyncFromLDAP'):ldapData.phoneNum;
        				    	  $scope.strategy.eMail = ldapData.eMail;
	        				  }
	        			  }
	               		  
	               	  } else {
	               	  }
	                 }).error(function(response, code, headers, config) {
	                });
            	}
            	} else {
            		UtilService.error($translate.instant("user.ldapServerConnectError",{"v":result.errorCode}), $translate.instant('common.opertip'));
            	}
            }).error(function(response, code, headers, config) {
            });
	 }
	 
	 $scope.cancel = function () {
	     $modalInstance.dismiss('cancel');
	 };
	 
	 // 回车
	 $scope.enter = function(ev) { 
		 if (ev.keyCode == 13 && !$scope.form.$invalid) {
          $scope.ok();
		 }
	  }; 
	  // 选择子BaseDn
	  $scope.selectChildBaseDn = function() {
		  //若未选择LDAP,弹出提示
		   if (!$scope.strategy.ldapServer) {
				  UtilService.alert($translate.instant('ldap.chooseServerFirst'), $translate.instant('common.opertip'), false, 'error');
				  return;
			  }
		      var modalInstance=$modal.open({
		          templateUrl:'html/modal/systemManage/ldap/childBaseDnSelector.html',
		          backdrop:"static",
		          controller:"childBaseDnListCtrl",
		          resolve: {
		        	 serverId : function() {return $scope.strategy.ldapServerId}
		          }
		      });
		      modalInstance.result.then(function(select){
		          //初始化数据
                  $scope.userNameOptions.options = [];
                  $scope.iDNumOptions.options = [{value:$translate.instant('ldap.notSyncFromLDAP'), label:$translate.instant('ldap.notSyncFromLDAP')}];
                  $scope.addressOptions.options = [{value:$translate.instant('ldap.notSyncFromLDAP'), label:$translate.instant('ldap.notSyncFromLDAP')}];
                  $scope.phoneNumOptions.options = [{value:$translate.instant('ldap.notSyncFromLDAP'), label:$translate.instant('ldap.notSyncFromLDAP')}];
                  $scope.eMailOptions.options = [];
                  $scope.strategy.userName = null;
                  $scope.strategy.iDNum = $translate.instant('ldap.notSyncFromLDAP');
                  $scope.strategy.address = $translate.instant('ldap.notSyncFromLDAP');
                  $scope.strategy.phoneNum = $translate.instant('ldap.notSyncFromLDAP');
                  $scope.strategy.eMail = null;
                  if(angular.isDefined(select) && select != "cancel" && select != "escape key press"){
                     $scope.strategy.childBaseDN = select.subBaseDN;
                     var params = {};
                     params.serverId = $scope.strategy.ldapServerId;
                     params.subBaseDn = select.subBaseDN;
                     //执行查寻用户信息操作
                        $http({
                            method: 'GET',
                            url: 'ldap/queryLdapServerAttributes',
                            params: params
                        }).success(function(res) {
                          if (res.success == true) {
                              var data = res.data;
                              if(data) {
                                  for(var i = 0 ; i< data.length; i++) {
                                      var temp = {value:data[i]+'', label:data[i]};
                                      $scope.userNameOptions.options.push(temp);
                                      $scope.iDNumOptions.options.push(temp);
                                      $scope.addressOptions.options.push(temp);
                                      $scope.phoneNumOptions.options.push(temp);
                                      $scope.eMailOptions.options.push(temp);
                                  }
                                  if (data.length) {
                                      //选择项赋值
                                      $scope.strategy.userName = data[0];
                                      $scope.strategy.eMail = data[0];
                                  }
                              }
                              
                          } else {
                          }
                         }).error(function(response, code, headers, config) {
                        });
                }
		      },function(cancel){
		      });  
	  
	  }
	  
	  
	 // 选择ldap服务器
	 $scope.selectLdapServer = function() {
  		 var resolve={};
  		 var profileInstance = UtilService.lgmodal('html/modal/systemManage/ldap/ldapServerSelector.html', 'ldapServerSelectorCtrl', resolve);
  	     profileInstance.result.then(function (selectedItem) {
         }, function (select) {
      	    if(angular.isDefined(select) && select != 'cancel' && select != "escape key press"){
      	      $scope.strategy.ldapServerId = select.id;
      	      $scope.strategy.ldapServer = select.name;
      	      $scope.strategy.baseDn = select.baseDn;
      	      $scope.strategy.loginName = select.loginName;
      	      $scope.strategy.childBaseDN = null;
      	      $scope.strategy.conditions = "(&(objectclass=*)(" + select.loginName + "=*))";
      	    }
         });
	  }
	  
    //增加站点
    $scope.ok = function () {
      	var data = $.extend({}, $scope.strategy);
    	data.autoSync = $scope.strategy.autoSync == false ? 0:1;
    	data.syncAccordingNeed = $scope.strategy.requiredSync == false ? 0:1;
    	data.syncNewUser = $scope.strategy.newSync == false ? 0:1;
    	data.syncExistUser = $scope.strategy.existSync == false ? 0:1;
    	data.syncOnlyCurrentNode = $scope.strategy.childSync == false ? 0:1;
    	data.autoDeleteUser = $scope.strategy.autoDeleteUser == false ? 0:1;
    	data.iDNum = $scope.strategy.iDNum == $translate.instant('ldap.notSyncFromLDAP') ? null:$scope.strategy.iDNum;
    	data.address = $scope.strategy.address == $translate.instant('ldap.notSyncFromLDAP')? null:$scope.strategy.address;
    	data.phoneNum = $scope.strategy.phoneNum == $translate.instant('ldap.notSyncFromLDAP')? null:$scope.strategy.phoneNum;
    	
     	delete data.requiredSync;
     	delete data.newSync;
    	delete data.existSync;
      	delete data.childSync;
    	delete data.ldapServer;
     	delete data.baseDn;
     	delete data.orgName;
     	delete data.userGroupName;
     	
    	if (isAdd) {
    	   //增加
           HttpService.post('ldap/addLdapStrategy', data, $modalInstance);
    	} else {
    	   data.id = ldapData.id;
    	   HttpService.put('ldap/modifyLdapStrategy', data, $modalInstance);
    	}
    };
    //增加站点的form之间的切换控制
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
        stepTreeOver : function() {
        	if ($('#form3').val() === "true") {
             	return true;
        	}
        	return false;
        },
        stepFourOver : function() {
        	if ($('#form4').val() === "true") {
        		if($scope.strategy.userName == null || $scope.strategy.eMail == null) {
        		   return false;
        		}
           	    return true;
        	}
        	return false;
        }
    };
    
    //选择组织
    $scope.orgSelector=function(){
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectOrg.html',
        	controller:'SelectOrgCtrl',
        	backdrop:'static',
        	size:"lg"
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.strategy.orgId = selectItem[0].id;
    		$scope.strategy.orgName = selectItem[0].name;
    	},function(){
    		
    	});
    };
    //选择用户分组
    $scope.userGrpSelector=function(){
    	if (!$scope.strategy.orgId) {
    		UtilService.error($translate.instant("user.orgSelectPrompt"), $translate.instant("user.selectGroup"));
    		return;
    	}
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/systemManage/user/selectUserGrp.html',
        	controller:'SelUserGroupCtrl',
        	resolve:{ orgId : function() {return $scope.strategy.orgId},
        		orgName : function() {return $scope.strategy.orgName}},
        	backdrop:'static',
        	size:"lg"
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.strategy.userGroupName=selectItem.name;
    		$scope.strategy.userGroupId = selectItem.id;
    	},function(){
    		
    	});
    };
    
    $scope.removeUserGroup = function() {
        $scope.strategy.userGroupName = null;
        $scope.strategy.userGroupId = null;
    }
/*  //点击下一步时增加校验
    $scope.preCallBack = {
		"0":function(){
			//$(".modal-dialog").removeClass("modal-lg");
			//显示配置详情
			//$("#configDetail").show();
			//$("#groupInput").css("width","100%");
		}
    };*/
    
	$scope.stepIndex = 0;
    
    //点击下一步时增加校验
    $scope.nextCallBack = {
		"1":function(){
			$scope.stepIndex = 1;
			return true;
		},
		"2":function(){
			$scope.stepIndex = 2;
			return true;
		},
		"3":function(){
			$scope.stepIndex = 3;
			if (!($scope.strategy.requiredSync || $scope.strategy.newSync || $scope.strategy.existSync)) {
				UtilService.alert($translate.instant('ldap.rneWarning'), $translate.instant('common.opertip'), false, 'error');
				return false;
			}	
			return true;
		}
	};
});

//选择LDAP服务器
routeApp.controller('ldapServerSelectorCtrl',function($scope, $http, $translate, $modalInstance, $modal, UtilService, HttpService, GridService) {
	$scope.mySelections = [];	
	
	//增加LDAP服务器
	$scope.addLdapServer =  function() {
		var refreshLdapServer = function() {
			$scope.$root.$broadcast('onQueryLdapServerConfigList', {});
		};
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/systemManage/ldap/addLdapServerConfig.html',
			  controller: 'addLdapServerConfigCtrl',
			  size:'lg',
			  backdrop:'static',
			  resolve:{
	                mode:function(){return 'add';},
	                id:function(){return null;},
	                data:function(){return null;}
			  }
		});
		modalInstance.result.then(function () {
			refreshLdapServer();
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
    	$modalInstance.dismiss($scope.mySelections[0]);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//CIC备份策略控制器
routeApp.controller('cicBackupStrategyCtrl',function($scope, $http, $translate, UtilService, HttpService) {
    $scope.model = {};//用于向后台发送参数的对象   
    var waitModal = UtilService.areawait("cicBackupCfg");
    $scope.model.serverType = 0;
    var configPort = -1; //数据库中保存的port
    $http({
       method: 'GET',
       url: 'cicBackup/queryBackupCICStrategy'
    }).success(function(result) {
        UtilService.dismissAreawait(waitModal);
        if (result.success == true) {
            var data = result.data;
            $scope.model.storeMode = data.storeMode;
            if (data.state == 1) {
                $scope.model.state = true;
            }  else {
                $scope.model.state = false;
            }
//          $scope.model.state = data.state;
            $scope.model.storeLocation = data.storeLocation;
            if (data.storeMode != undefined && data.storeMode == 1) {
                $scope.model.targetAddr = data.targetAddr;
                $scope.model.loginName = UtilService.decryptByDES(data.loginName);
                $scope.model.password = UtilService.decryptByDES(data.password);
                $scope.model.serverType = data.serverType;
                $scope.model.port = data.port;
                configPort = data.port;
            }
            if (data.state != undefined && data.state == 1) {
                $scope.model.frequency = data.frequency;
                if (data.frequency != undefined && data.frequency == 1) {
                    $scope.model.week = data.day;
                } else {
                    $scope.model.week = '3';
                }
                $scope.model.day = data.day;
                $scope.model.hour = data.hour;
                $scope.model.minutes = data.minutes;
                $scope.model.keepTimes = data.keepTimes == 0 ? null : data.keepTimes;
            } else if (data.state != undefined && data.state == 0) {
                $scope.model.frequency = '1';
                $scope.model.week = '3';
                $scope.model.hour = 1;
                $scope.model.minutes = 0;
                $scope.model.day = 5;
            }
        } else {
            UtilService.handleError(result.errorCode);
        }           
    }).error(function(response, code, headers, config) {
        UtilService.dismissAreawait(waitModal);
        UtilService.handleError(code);
    });
    
  //备份目的地
    /*$scope.backupTarget = {
        options : [{value:'0', label:$translate.instant('cloudResource.backupLocal')},
                   {value:'1', label:$translate.instant('cloudResource.backupRemote')}]
                
        };*/
  //频率。0:每月，1：每周，2：每日
    $scope.frequency = {
        options : [{value:'0', label:$translate.instant('cloudResource.everyMonth')},
                   {value:'1', label:$translate.instant('cloudResource.everyWeek')},
                   {value:'2', label:$translate.instant('cloudResource.everyDay')}]
    };
    //星期
    $scope.week = {
        options : [{value:'1', label:$translate.instant('cloudResource.monday')},
                   {value:'2', label:$translate.instant('cloudResource.tuesday')},
                   {value:'3', label:$translate.instant('cloudResource.wednesday')},
                   {value:'4', label:$translate.instant('cloudResource.thursday')},
                   {value:'5', label:$translate.instant('cloudResource.friday')},
                   {value:'6', label:$translate.instant('cloudResource.saturday')},
                   {value:'7', label:$translate.instant('cloudResource.sunday')}]
    };
    $scope.$watch("model.serverType",function(newValue,oldValue){
        if(newValue=='1'){
            $scope.model.port=22;
        }else if(newValue=='0'){
            $scope.model.port=21;
        }
        if (configPort != -1) {
            $scope.model.port = configPort;
        }
    });
    
    //CIC本地目录选择器
    $scope.cicFolderSelector = function(hostType) {
        var resolve = {};
        var modalInstance = UtilService.modal('html/modal/common/cicFolderSelector.html', 'cicFolderSelectorCtrl',resolve);
        modalInstance.result.then(function (path) {
//            $timeout(function() {
//            });            
            $scope.model.storeLocation = path;
        }, function (reason) {
        });
    }

    $scope.save=function(){
        if ($scope.model.frequency != undefined && $scope.model.frequency == 1) {
            $scope.model.day = $scope.model.week;
        }
        if ($scope.model.state == true) {
            $scope.model.state = 1;
        } else {
            $scope.model.state = 0;
        }
        
        var data = angular.copy($scope.model);
        data.loginName = UtilService.encryptByDES(data.loginName);
        data.password = UtilService.encryptByDES(data.password);
        
        if ($scope.model.storeMode &&  $scope.model.storeMode == 1) {
            var callback = {};
            callback.noHandler = true;
            callback.callback = function() {
                 HttpService.post('cicBackup/modifyBackupCICStrategy', data);
            }
            $scope.connectTest(callback);
        } else {
            HttpService.post('cicBackup/modifyBackupCICStrategy', data);
        }
    };
    $scope.backupNow=function(){
        if ($scope.model.frequency != undefined && $scope.model.frequency == 1) {
            $scope.model.day = $scope.model.week;
        }
        if ($scope.model.state == true) {
            $scope.model.state = 1;
        } else {
            $scope.model.state = 0;
        }
        
        var data = {id : -1};
        var testdata = angular.copy($scope.model);
        testdata.loginName = UtilService.encryptByDES(testdata.loginName);
        testdata.password = UtilService.encryptByDES(testdata.password);
        var modalInstance = UtilService.confirm($translate.instant('securityMng.isBackupCvm'),$translate.instant('cloudResource.backupCvm'));
        modalInstance.result.then(function () {
            HttpService.post('cicBackup/backupCICData', testdata, modalInstance);
        }, function () {
        });
    };
    $scope.connectTest=function(callback){
        var conData = {};   //仅传连接需要的参数
        conData.server = $scope.model.targetAddr;
        conData.type = $scope.model.serverType == '0' ? 'ftp' : 'scp'; 
        conData.userName = UtilService.encryptByDES($scope.model.loginName);
        conData.password = UtilService.encryptByDES($scope.model.password);
        conData.port = $scope.model.port;
        if (conData.type == 'ftp') {
            conData.dir = "." + $scope.model.storeLocation;
        } else {
            conData.dir = $scope.model.storeLocation;
        }
        HttpService.put('cicBackup/connectTest', conData, undefined, callback);
    };
    
    $scope.selBackupPath = function() {
        
    }

   
});
//CVM备份历史控制器【系统管理-安全管理】
routeApp.controller('cicBackupHistoryCtrl',function($scope, $http, $modal, $translate,$timeout,UtilService, GridService, HttpService) {
    var params = {};
//  params.id=$scope.id;
    var url = 'cicBackup/getCICBackupHistoryList';
    $scope.mySelections=[];
    var backupModeTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-if= \'row.entity[col.field] == 0\' translate="securityMng.localType"></span>' +
       '<span ng-if= \'row.entity[col.field] == 1\' translate="securityMng.remoteType")></span></div>' ;
    
    var operTemp =  '<div><div class="ngCellButton">'
        +'<div type="button" class="btn btn-sm-icon icon-download-gray" ng-click="download(row.entity)" custom-title="'+$translate.instant('common.download')+'"></div>'
        +'<div type="button" class="btn btn-sm-icon icon-cvm-restore-gray" ng-click="restore(row.entity)" custom-title="'+$translate.instant('common.restoreCICData')+'"></div>'
        +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="deleteBackInfo(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
        +'</div></div>';
    if ($scope.uiConfig.copyrightFrom == constant.unis) {
        operTemp =  '<div><div class="ngCellButton">'
            +'<div type="button" class="btn btn-sm-icon icon-download-gray" ng-click="download(row.entity)" custom-title="'+$translate.instant('common.download')+'"></div>'
            +'<div type="button" class="btn btn-sm-icon icon-vm-restore-gray " ng-click="restore(row.entity)" custom-title="'+$translate.instant('common.restoreCICData')+'"></div>'
            +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="deleteBackInfo(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
            +'</div></div>';
    }
    //表头
    var column = [{field: 'name', displayName: $translate.instant('fileName') , sortable: true, width:'25%'},
                  {field: 'id', visible:false},
                  {field: 'loginName', visible:false},
                  {field: 'password', visible:false},
                  {field: 'port', visible:false},
                  {field: 'createTime', displayName: $translate.instant('common.createTime') , sortable: true, width:'15%'},
                  {field: 'version', displayName: $translate.instant('common.version') , sortable: true, width:'10%'},
                  {field: 'storeMode', displayName: $translate.instant('securityMng.storeMode') , sortable: true, width:'10%',cellTemplate:backupModeTemplate},
                  {field: 'targetAddr', displayName: $translate.instant('securityMng.targetIpAddr') , sortable: true, width:'10%'},
                  {field: 'serverType', displayName: $translate.instant('securityMng.serverType') , sortable: true, width:'10%',cellFilter:'servertype'},
                  {field: 'backupLocation', displayName: $translate.instant('securityMng.backupLocation') , sortable: true, width:'10%'},
                  { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
                      operTemp
                    }
                  ]

    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90); 
    
    $scope = GridService.grid($scope, url, params);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    //刷新当前页
    $scope.$on('onQueryBackUpStrategyHistory', function(event, msg) {
        if (angular.isDefined(msg)) {
            $scope.params = msg;
        }
        $scope.refreshPage();
    });
    
//  $scope.data=[{name:"cvm",createTime:"2015-11-24",version:"E0218H03"}];
    //创建表格
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
            enablePaging: true,
        	showFooter: true,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
        	filterOptions: $scope.filterOptions,
        	pagingOptions: $scope.pagingOptions,
            columnDefs:column
    };
    
    //还原CIC数据
    $scope.restore = function(selectedItem) {
         if (!selectedItem.enableRestore) {
            UtilService.error($translate.instant('securityMng.cvmHotServerErrorTip'), $translate.instant('common.opertip'));
            return;
         }
         if (!selectedItem.isCurrentVersion) {
             UtilService.error($translate.instant('securityMng.cvmRestoreDiffVersionTip'), $translate.instant('common.opertip'));
             return;
         }
         //提示还原成功
         var successCallBack = function() {
             UtilService.success($translate.instant('securityMng.cicRestorSuccess'),$translate.instant('common.successTip'));
             //刷新备份历史表
             $scope.refreshPage();
         };
         var modalInstance = UtilService.confirm($translate.instant('securityMng.backupCvmConfirm'),$translate.instant('operConfirm'));
         modalInstance.result.then(function () {
             var param = angular.copy(selectedItem);
             param.backupName = param.name;
             param.name = undefined;
             HttpService.post('cicBackup/restoreCIC', param, modalInstance, successCallBack);
         }, function () {
         });
     };
     
     //上传备份文件
     //导入模板
     $scope.uploadBackInfo = function() {
         var modalInstance = $modal.open({
             templateUrl: 'html/modal/systemManage/importCICBackupFile.html',
             controller: 'ImportCICBackupCtrl',
             backdrop:'static',
             size:"lg"
         });
         modalInstance.result.then(function (selectedItem) {
             
         }, function (reason) {
             
         });
     };
    
     $scope.refreshHistoryPage = function() {
         $scope.refreshPage();
     }
     
     //删除备份历史信息
     $scope.deleteBackInfo = function(selectedItem) {
        var deletePrompt= $translate.instant('securityMng.delBackUpHistoryConfirm');
        var modalInstance = UtilService.confirm(deletePrompt, $translate.instant('operConfirm'));

        modalInstance.result.then(function () {
            var params = {};
            params.id = selectedItem.id;
            params.name = selectedItem.name;
            params.serverType = selectedItem.serverType == undefined ? "" : selectedItem.serverType;
            params.storeMode = selectedItem.storeMode;
            params.targetAddr = selectedItem.targetAddr == undefined ? "" : selectedItem.targetAddr;
            params.backupLocation = selectedItem.backupLocation;
            $scope.deleteBackupFile('cicBackup/deleteBackUpHistory', params);
        });
     };
     
     //修改问题单201702170154  删除出错时提示强制删除  --by w10450   2017-03-08
     $scope.deleteBackupFile = function(url, params) {
         var waitModal = UtilService.wait();
         $http({
             method  : 'DELETE',
             url     : url,
             params: params
         }).success(function(result) {
             waitModal.dismiss();
             if (result.errorCode > 0) {
                 var deleteConformInstance = UtilService.confirm($translate.instant('backupVm.forceDeleteWarn', {error:result.failureMessage}),$translate.instant('operConfirm'));
                 deleteConformInstance.result.then(function () {
                     var list = [];
                     list.push({id:params.id, name:params.name});
                     HttpService.put("cicBackup/deleteBackUpHistorys/database", list, deleteConformInstance, $scope.refreshHistoryPage);
                 });
             } else {
                UtilService.handleResult(result);
             }
             $scope.refreshHistoryPage();           
         }).error(function(response, code, headers, config) {
             waitModal.dismiss();
             UtilService.handleError(code);
         });
     }
     
     var callback = function(result) {
    	 var filePath = encodeURIComponent(UtilService.encryptByDES(result.data.path));
         window.open('download/fileDownload?filePath=' + filePath, '_blank', null);
     }
      //下载CIC备份数据
     $scope.download = function(selectedItem) {
//       var modalInstance = UtilService.confirm($translate.instant('securityMng.downloadCvmConfirm'),$translate.instant('operConfirm'));
//       modalInstance.result.then(function () {
//       }, function () {
//       });
         var param = angular.copy(selectedItem);
         param.backupName = param.name;
         param.name = undefined;
         HttpService.post('cicBackup/getBackupCICDownloadPath', param, undefined, callback);
     };
     
     //导入备份历史
     $scope.importBackupCICHistory = function() {
         var modalInstance = $modal.open({
             templateUrl: 'html/modal/systemManage/importCICBackupHistory.html',
             controller: 'importCICBackupHistoryCtrl',
             backdrop:'static',
             width:"530px"
         });
     };
});


/*导入CIC备份信息*/
routeApp.controller('ImportCICBackupCtrl',function($rootScope, $scope, $http, $timeout, $translate, $modalInstance, UtilService, GridService, HttpService) {
    $scope.model = {};
    $scope.model.storeMode = 0;
    $scope.backUpPath = "";
    $scope.model.serverType = 1;
    
    $scope.entry = {};
    $scope.backUpFileName = "";
    $scope.hasUpload = false;
    $scope.stepTitles=[$translate.instant("host.uploadFile"),
                       $translate.instant("securityMng.uploadConfig")];

    //清除文件上传面板内容
    removeUploadPanel();
    //初始化文件上传面板
    initUploadPanel();
    
    $scope.valids={ stepOneOver:function(){
                        if($scope.hasUpload == true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    stepTwoOver:function(){
                        //本地上传必须输入上传文件目的地
                        if ($scope.model.storeMode == 0 && ($scope.model.storeLocation != undefined && $scope.model.storeLocation != "")) {
                            return true;
                        } else if ($scope.model.storeMode == 1 && $scope.model.targetAddr != undefined && $scope.model.storeLocation != undefined
                                && $scope.model.loginName != undefined && $scope.model.password != undefined && $scope.model.port != undefined) {
                            return true;
                        }
                        return false;
                    }
    };
    
    //CIC本地目录选择器
    $scope.cvmFolderSelector = function(hostType) {
        var resolve = { hostType: function () {return hostType;}};
        var modalInstance = UtilService.modal('html/modal/common/cicFolderSelector.html', 'cicFolderSelectorCtrl',resolve);
        modalInstance.result.then(function (path) {
//            $timeout(function() {
//            });            
            $scope.model.storeLocation = path;
        }, function (reason) {
        });
    }
    
//  $scope.nextCallBack = {
//            "1":function() {
//                    //清除文件上传面板内容
//                    removeUploadPanel();
//                    //初始化文件上传面板
//                    initUploadPanel();
//            }
//  };
    
    $scope.$watch("model.serverType",function(newValue,oldValue){
        if(newValue=='1'){
            $scope.model.port=22;
        }else if(newValue=='0'){
            $scope.model.port=21;
        }
    });
    
    $scope.connectTest=function(){
        var conData = {};   //仅传连接需要的参数
        conData.server = $scope.model.targetAddr;
        conData.type = $scope.model.serverType == '0' ? 'ftp' : 'scp'; 
        conData.userName = UtilService.encryptByDES($scope.model.loginName);
        conData.password = UtilService.encryptByDES($scope.model.password);
        conData.port = $scope.model.port;
        if (conData.type == 'ftp') {
            conData.dir = "." + $scope.model.storeLocation;
        } else {
            conData.dir = $scope.model.storeLocation;
        }
        HttpService.put('cicBackup/connectTest', conData);
    };
    
    $scope.ok = function () {
        var params = {};
        params.name = $scope.backUpFileName;
        
        params.storeMode = $scope.model.storeMode
        if (params.storeMode != 0) {
            params.targetAddr = $scope.model.targetAddr;
            params.loginName = UtilService.encryptByDES($scope.model.loginName);
            params.password = UtilService.encryptByDES($scope.model.password);
            params.serverType = $scope.model.serverType
            params.port = $scope.model.port;
        }
        params.backupLocation = $scope.model.storeLocation;
		//成功上传文件后刷新列表,修改问题单201701130178：成功上传文件后列表不刷新的问题 --by ckf6302
		$scope.cb = function() {
			$scope.$root.$broadcast("onQueryBackUpStrategyHistory");
		};
        HttpService.post('cicBackup/uploadCICData', params, $modalInstance, $scope.cb);
    };
    $scope.cancel = function () {
        //上传成功后才可以删除
        if ($scope.backUpPath != '' && $scope.hasUpload) {
            var params = {};
            params.backUpPath = $scope.backUpPath;
            $http({
                 method  : 'DELETE',
                 url     : 'backupStrategy/deleteTmpFile',
                 params: params
             }).success(function(result) {
                 
             })
        }
        if ($scope.stream) {
            $scope.stream.destroy();
            $scope.stream=null;
        }
        $modalInstance.dismiss('cancel');
    };
    
    function removeUploadPanel() {
        $("#i_select_files").empty();
        $("#i_stream_files_queue").empty();
        $("#i_stream_message_container").empty();
        $("#streambtn").hide();
        if (typeof($scope.stream) != "undefined") {
            $scope.stream.destroy()
        }
    }
    
    function initUploadPanel() {
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
                tokenURL : "cicbackup/upload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
                frmUploadURL : "cicbackup/upload/fd;", /** Flash上传的URI */
                uploadURL : "cicbackup/upload/upload", /** HTML5上传的URI */
                swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
                maxSize: size,/** 单个文件的最大大小200G，默认:2G */
                extFilters : ['.gz'], /**允许上传文件的类型**/
                checkFileName : true,/**对文件名检测是否允许输入特殊字符，默认为true*/
                onNameRegexMismatch: function(file) {
                    fShowMessage($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}), true);
                    $("#i_select_files").show();
                    $("#i_stream_files_queue").hide();
                    $("#streambtn").hide();
                },
                onSelect : function(list) {
                    var checkFlag = true;
                    var uploadFileName=list[0].name;
                    $scope.uploadFileName = uploadFileName;
                    //先检查上传文件的名称
                    var strIndex = uploadFileName.indexOf("CIC_INFO_BACK");
                    if (strIndex != 0) { //
                        fShowMessage($translate.instant('securityMng.uploadbackupFileNameMismatch'), true);
                        checkFlag = false;
                    }
                    var fileName = "";
                    var suffixIndex = uploadFileName.lastIndexOf(".tar.gz");
                    
                    if (suffixIndex != -1) {
                        var nameLength = uploadFileName.length-7;
                        if (nameLength == suffixIndex) {
                            fileName = uploadFileName.substring(0, uploadFileName.length - 7);
                        }
                    }
                    //根据文件名称校验文件版本是否一致
                    var names = uploadFileName.split("_");
                    var version = "";
                    if (names[3] != null) {
                        version = names[3];
                    }
                    var params = {};
                    params.version = version;
                    params.fileName = fileName;
                    $.ajax({
                        url : 'cicBackup/isBackupFileAggred',
                        async : false,
                        type : "GET",
                        data:params,
                        dataType : 'json',
                        success : function (result){ //同名文件已存在
                            if (result.data == 1) {
                                fShowMessage($translate.instant('securityMng.uploadbackupFileNameAlreadyExists'), true);
                                checkFlag = false;
                            } else if (result.data == 2) { //版本不正确
                                fShowMessage($translate.instant('securityMng.uploadbackupFileVersionMismatch'), true);
                                checkFlag = false;
                            }
                        }
                    });
                    
                    //检查文件后缀是否符合
                    var fileExt=uploadFileName.split('.');
                    if(fileExt[fileExt.length-1]=='gz' && fileExt[fileExt.length-2]=='tar'){
                        $("#i_select_files").hide();
                        $("#i_stream_files_queue").show();
                        $("#streambtn").show();
                    } else {
                        fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:uploadFileName,value2:".tar.gz"}), true);
                        checkFlag = false;
                    }
                    
                    if (!checkFlag) {
                        $scope.cancelUpload();
                        arguments.callee.caller([]);	//修改问题单201701130178：避免将选择错误的文件加入到上传任务中（取消上传插件重复初始化，解决在选择文件对话框时弹出两次的问题）
                    }
                    var tempNames = fileExt.slice(0, fileExt.length-2);
                    $scope.backUpFileName = tempNames.join(".");
                    fShowMessage($translate.instant('uploadfile.uploadisoSelectFile',{value:list.length}));
                    setBtnStatus(0);
                },
                onFileCountExceed : function(selected, limit) {
                    fShowMessage($translate.instant('uploadfile.uploadisoFileCountExceed ',{value1:selected,value2:limit}), true);
                    $scope.cancelUpload();
                },
                onMaxSizeExceed : function(file) {
                    fShowMessage($translate.instant('uploadfile.uploadisoMaxSizeExceed',{value1:file.name,value2:file.size,value3:file.limitSize}), true);
                },
                onExtNameMismatch: function(file) {
                    fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
                    $scope.cancelUpload();
                },
                onAddTask: function(file) {
                    fShowMessage($translate.instant('uploadfile.uploadisoAddTask',{value:file.name}));
                },
                onCancel : function(file) {
                    $("#i_stream_files_queue").hide();
                    $("#streambtn").hide();
                    $("#i_select_files").show();
                    fShowMessage($translate.instant('uploadfile.uploadisoCancel',{value:file.name}));
                },
                onStop : function() {
                    fShowMessage($translate.instant('uploadfile.uploadisoStop'));
                },
                onCancelAll : function(numbers) {
                    fShowMessage($translate.instant('uploadfile.uploadisoCancelAll',{value:numbers}));
                },
                onComplete : function(file) {
                    fShowMessage($translate.instant('uploadfile.uploadisoComplete',{value1:file.name,value2:file.formatSize}));
                    var msgJson = jQuery.parseJSON(file.msg);
                    if (typeof msgJson == 'string') {
                        msgJson = jQuery.parseJSON(msgJson);
                    }
                    $scope.backUpPath = msgJson.complete;

                    $scope.$broadcast(constant.onnext);
                    $scope.hasUpload = true;
                    
                    //隐藏上一步按钮
                    $timeout(function() {
                    	$("#prevbutton").hide();
                    }, 200);
                },
                onQueueComplete : function(msg) {
//              fShowMessage($translate.instant('uploadfile.uploadisoQueueComplete'));
                },
                onUploadError : function(status, msg) {
                    var msgJson = jQuery.parseJSON(msg);
                    if (typeof msgJson == 'string') {
                        msgJson = jQuery.parseJSON(msgJson);
                    }
                    if (msgJson.success == false) {
                        if (msgJson.errorcode == 20) {
                            fShowMessage($translate.instant('uploadfile.uploadRenameError',{value:msgJson.filename}), true);
                        } else if (msgJson.errorcode == 21) {
                            fShowMessage($translate.instant('uploadfile.uploadCapacityError'), true);
                        } else {
                            fShowMessage(msgJson.message, true);
                        }
                        
                    }
                    setBtnStatus(3);
                },
                onMaxSizeExceed: function(file) {
                    fShowMessage($translate.instant('uploadfile.uploadFilesizeLimitError',{value1:file.name,value2:file.formatSize,value3:file.formatLimitSize}), true);
                }
                
        };
        $scope.config = config;
        
        $timeout(function(){
            $scope.stream = new Stream($scope.config);
            $("#i_select_files").show();
            $("#i_stream_files_queue").hide();
            $("#streambtn").hide();
            //隐藏上一步按钮
            $("#prevbutton").hide();
        }, 200);
    }
    
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
            '<span style="word-wrap:break-word;">'+ msg + '</span>' + 
            '</div>';
        return s;
    }
    $scope.cancelUpload = function() {
    	//修改问题单201701130178：取消上传插件重复初始化，解决在关闭选择文件对话框时再次弹出的问题
//        $scope.stream = null;
//        initUploadPanel();
    	$("#i_select_files").show();
    	$("#i_stream_files_queue").hide();
    	$("#streambtn").hide();
    	setBtnStatus(0);
    	fShowMessage($translate.instant('uploadfile.uploadisoCancel',{value:$scope.uploadFileName}));
    }
    $scope.upload = function() {
        setBtnStatus(1);
        $scope.stream.upload();
        $(".stream-cancel").hide();
    }
    
    $scope.stop = function() {
        var totalPercent = getStreamPercent();
        if (totalPercent < 98) {            
            setBtnStatus(2);
            $scope.stream.stop();
            $(".stream-cancel").show();
        } else {
            UtilService.error($translate.instant("uploadfile.uploadStopError"),$translate.instant("common.opertip"));
        }
    }
    function getStreamPercent() {
        var percentStr = $(".stream-percent").get(0).innerHTML;
        return percentStr.substring(0,percentStr.length-1) - 0;
    }
    // status 0：准备上传 1：上传中 2：暂停中 3：上传错误
    function setBtnStatus(status) {
        if (status == 1) {
            $scope.uploadDisable = true;
            $scope.stopDisable = false;
            $scope.cancelDisable = true;
        } else if (status == 2) {
            $scope.uploadDisable = false;
            $scope.stopDisable = true;
            $scope.cancelDisable = false;
        } else if (status == 3) {
            $scope.uploadDisable = true;
            $scope.stopDisable = true;
            $scope.cancelDisable = false;
        } else if(status == 0) {
            $scope.uploadDisable = false;
            $scope.stopDisable = true;
            $scope.cancelDisable = true;
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        
    }
    
    var keydown = function(ev){
        if (ev.keyCode == 27) {
            ev.preventDefault();
            ev.stopPropagation();
            $scope.cancel();
        }
    };
    
    $(document).on('keydown', keydown);
    $scope.$on("$destroy", function(){
        $(document).off('keydown', keydown);
    })
    
});
/**
 * 导入CIC备份历史
 */
routeApp.controller('importCICBackupHistoryCtrl',function($scope, $http, $modalInstance, $translate, $timeout, UtilService, HttpService) {
    $scope.model = {};//用于向后台发送参数的对象   
    $scope.model.serverType = 0;
    $scope.model.storeMode = 0;
    var configPort = 21; //数据库中保存的port
    
    $scope.$watch("model.serverType",function(newValue,oldValue){
        if(newValue=='1') {
            $scope.model.port=22;
        }else if(newValue=='0') {
            $scope.model.port=21;
        }
    });
    
    //CIC本地目录选择器
    $scope.cicFolderSelector = function(hostType) {
        var resolve = {};
        var modalInstance = UtilService.modal('html/modal/common/cicFolderSelector.html', 'cicFolderSelectorCtrl',resolve);
        modalInstance.result.then(function (path) {
            $scope.model.storeLocation = path;
        }, function (reason) {
        });
    }

    $scope.ok=function(){
    	var data = angular.copy($scope.model);
    	data.loginName = UtilService.encryptByDES($scope.model.loginName);
    	data.password = UtilService.encryptByDES($scope.model.password);
        HttpService.post("cicBackup/importCICBackupHistory", data, $modalInstance);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.connectTest=function(callback){
        var conData = {};   //仅传连接需要的参数
        conData.server = $scope.model.targetAddr;
        conData.type = $scope.model.serverType == '0' ? 'ftp' : 'scp'; 
        conData.userName = UtilService.encryptByDES($scope.model.loginName);
        conData.password = UtilService.encryptByDES($scope.model.password);
        conData.port = $scope.model.port;
        if (conData.type == 'ftp') {
            conData.dir = "." + $scope.model.storeLocation;
        } else {
            conData.dir = $scope.model.storeLocation;
        }
        HttpService.put('cicBackup/connectTest', conData, undefined, callback);
    };
});