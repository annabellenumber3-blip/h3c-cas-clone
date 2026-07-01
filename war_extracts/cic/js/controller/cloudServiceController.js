/**
 * author: kf6302
 * description: cloudServiceCtrl
 */
//【云服务】/云消息
routeApp.controller('CloudMessageCtrl',function($scope, $http, $modal, $translate, $timeout,UtilService, HttpService, GridService){
	var column = [
                  { field: 'title', displayName: $translate.instant('cloudService.title'), sortable: true, width:'20%', cellTemplate:titleTemplate},
                  { field: 'msgLevel', displayName: $translate.instant('cloudService.messageLevel'), sortable: false,cellFilter:'msgLevel', width:'20%'},
                  { field: 'content', displayName: $translate.instant('cloudService.content'), sortable: false, width:'40%', cellTemplate:titleTemplate},
                  { field: 'createTime', displayName: $translate.instant('cloudService.sendTime'), sortable: true, width:'20%', cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"'},
                  ]
    
	//动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    var url = 'cloudMessage/list';
	var params = {
		sortDir : 2,
		sortField : "createTime"
	};
	$scope = GridService.grid($scope, url, params, null,null, "cloudMsgListDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.mySelections=[];
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
    
    //修改问题单:201706080452 云消息支持多选
    $scope.$watch('mySelections', function(newValue, oldValue) {
        if (newValue.length == 1) {
            selectedRow.splice(0, selectedRow.length, newValue[0]);
            $scope.params2.msgId = newValue[0].id;
            		$scope.params2.sortDir = 0;
            		$scope.params2.sortField = "name";
            		$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);
        } else if (newValue.length == 0) {
            $scope.myData2.splice(0, $scope.myData2.length);
        } else {
            selectedRow.splice(0, selectedRow.length);
            $scope.myData2.splice(0, $scope.myData2.length);
        }    
    }, true);
    
    // 选中行的数组
    var selectedRow = new Array();
    // 默认选中第一行，如果已经有选择的元素则继续选中。
    selectFirstLine($scope, selectedRow, 'createTime');
    
    //刷新
    $scope.refreshCloudMsg=function(){
    	$scope.refreshPage();
    	$scope.gridOptions.selectAll(false);
    	$scope.myData2.splice(0, $scope.myData2.length);
    };
    //增加云消息
    $scope.addCloudMsg=function(){
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/addCloudMsg.html',
            controller: 'AddCloudMsgCtrl',
            backdrop:'static'
        });
        modalInstance.result.then(function () {
        	$scope.refreshPage();
        }, function (reason) {
        });
    };
    
    //删除云消息
    $scope.deleteCloudMsg=function(){
    	 var modalInstance = UtilService.confirm($translate.instant('cloudService.delCloudMsgConfirm'),$translate.instant('operator.delOperator'));
         modalInstance.result.then(function (selectedItem) {
             if (angular.isArray($scope.mySelections) && $scope.mySelections.length > 0){
            	 var request = [];
            	 for (var i = 0; i < $scope.mySelections.length; i++) {
            		 var requestItem = {};
            		 requestItem.id = $scope.mySelections[i].id;
            		 requestItem.title = $scope.mySelections[i].title;
            		 request.push(requestItem);
            	 }
            	 HttpService.put("cloudMessage/del/message", request, undefined, $scope.refreshCloudMsg);
             }
         }, function () {
         });
    };
    //user list
    var userType = '<div class="ngCellText" ng-class="col.colIndex()">' +
	'<span ng-if= \'row.entity.flag == 0\'>' + $translate.instant("common.organization") + '</span>' +
	'<span ng-if= \'row.entity.flag == 1\'>' + $translate.instant("org.user") + '</span>' +
	'<span ng-if= \'row.entity.flag == 2\'>' + $translate.instant("common.userGroup") + '</span></div>';
    var userOper ='<div><div class="ngCellButton">'
		+'<div type="button" has-permission="CLOUDMESSAGE_DELETE" class="btn btn-sm-icon icon-delete-gray" ng-click="delUser(row.entity)" custom-title="{{\'common.delete\'|translate}}"></div>'
		+'</div></div>';
    var defs2 = [{ field: 'name', displayName: $translate.instant('org.loginGpName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
                 { field: 'desc', displayName: $translate.instant('org.userDescName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
                 { field: 'flag', displayName: $translate.instant('common.type') , sortable: true, width:'20%',cellTemplate:userType},
                 { field: 'oper', displayName: $translate.instant('common.oper') , sortable: true, width:'20%',cellTemplate:userOper}];
    var urlUser = "cloudMessage/messageUser";
	var params2 = {msgId : -1, sortDir: 0, sortField : "name"};
	$scope = GridService.grid2($scope, urlUser, params2);
    $scope.userOptions = {
		data: 'myData2',
		jqueryUITheme: false,
		jqueryUIDraggable: false,
        selectedItems: $scope.mySelections2,
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
        totalServerItems: 'totalServerItems2',
        filterOptions: $scope.filterOptions2,
        pagingOptions: $scope.pagingOptions2,
        columnDefs: defs2
//        rowTemplate: doubleClickTemplate    //双击行模板
    }; 
    
    $scope.delUser = function(entity) {
    	if (angular.isObject(entity)) {
    		if (entity.flag == 1) {
    			var desc = $translate.instant("cloudService.confirmDeleteUserMessage", {name:entity.name});
    		} else {
    			var desc = $translate.instant("cloudService.confirmDeleteGroupMessage", {name:entity.name});
    		};
    		var modalInstance = UtilService.confirm(desc, $translate.instant("cloudService.deletePrivilegeTitle"));
    		modalInstance.result.then(function(){
    			var params = {};
    	    	params.flag = entity.flag;
    	    	params.umId = entity.umId;
    	    	params.name = entity.name;
    	    	if (angular.isArray($scope.myData)){
    	    		for (var i = 0; i < $scope.myData.length; i++){
    	        		if ($scope.myData[i].id == entity.msgId) {
    	        			params.msgTitle = $scope.myData[i].title;
    	        		}
    	        	}
    	    	}
    	    	HttpService.delete("cloudMessage/user/message", params, undefined, $scope.refreshCloudMsg);
    		}, function(){});
    	}
    }

});
//【云服务】/工单
routeApp.controller('CloudWorkorderCtrl' ,function($scope, $http, $modal, $translate, $timeout,UtilService, HttpService, GridService){
	$scope.model = {};
	$scope.model.processed = 1;  //默认为待处理
	var column = [
                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'15%'},
                  { field: 'title', displayName: $translate.instant('cloudService.title'), sortable: true, width:'15%', cellTemplate:titleTemplate},
                  { field: 'content', displayName: $translate.instant('cloudService.content'), sortable: false, width:'30%', cellTemplate:titleTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: false, width:'10%',cellFilter:'workOrderStatus'},
                  { field: 'createTime', displayName: $translate.instant('cloudService.sendTime'), sortable: true, width:'15%', cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"'},
                  { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
                   	 '<div><div class="ngCellButton">'
                 	 +'<div type="button" ng-if="row.entity.status==1" class="btn btn-sm-icon icon-task-manage-gray" has-permission="CLOUDWORKORDER_EDIT" ng-click="operate(row.entity,\'process\')" custom-title="'+$translate.instant('cloudService.processTicket')+'"></div>'
                   	 +'<div type="button" class="btn btn-sm-icon icon-preview-gray" has-permission="CLOUDWORKORDER_VIEW" ng-click="operate(row.entity,\'view\')" custom-title="'+$translate.instant('cloudService.viewTicket')+'"></div>'
                   	 +'</div></div>'
                     }
                  ];
    
	//动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    $scope.url = 'cloudWorkOrder/list';
    $scope.params = {};
    $scope.params.sortField = "id";
    $scope.params.sortDir = 2;
    $scope.params.type = 2;
    if ($scope.model.processed != 3){
    	$scope.params.status = $scope.model.processed;
    }
    $scope.$watch("model.processed", function(newValue, oldValue){
    	if (newValue != oldValue && newValue != 3){
    		$scope.params.status = newValue;
    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    	} else if (newValue != oldValue && newValue == 3){
    		$scope.params.status = undefined;
    		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    	}
    })
	$scope = GridService.grid($scope, $scope.url, $scope.params, null,null, "cloudTicketDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.mySelections=[];
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
    
    $scope.processed={
    		options:[{value:1,label:$translate.instant("cloudService.unprocessed")},
    		         {value:2,label:$translate.instant("cloudService.processed")},
    		         {value:3,label:$translate.instant("cloudService.all")}
    		         ]
    };
    
    $scope.$on(constant.onReloadWorkOrderList, function (event, msg) {
		$scope.refreshCloudTicket();
	});
    
    $scope.refreshCloudTicket = function(){
    	$scope.pagingOptions.currentPage = 1;
    	$scope.refreshPage();
    	$scope.gridOptions.selectAll(false);
    };
    $scope.deleteCloudTicket = function() {
    	var modalInstance = UtilService.confirm($translate.instant("cloudService.confirmDeleteWorkOrder"), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    	  var request = [];
    	  for (var i = 0; i < $scope.mySelections.length; i++) {
       		 var requestItem = {};
       		 requestItem.id = $scope.mySelections[i].id;
       		 requestItem.title = $scope.mySelections[i].title;
       		 request.push(requestItem);
       	  }
    	  HttpService.put("cloudWorkOrder/del", request, undefined, $scope.refreshCloudTicket);
    	}, function(){});
    };
    //操作，process:处理工单，view:查看工单
    $scope.operate=function(rowObj,type){
    	if(type=='process'){
    		if (rowObj.status == 1){
    			var modalInstance = $modal.open({
                    templateUrl: 'html/modal/cloudService/handleWorkorder.html',
                    controller: 'HandleWorkorderCtrl',
                    backdrop:'static',
                    resolve:{
                    	rowObj:function(){
                    		return rowObj;
                    	},
                    	type:function(){
                    		return "process";
                    	}
                    }
                });
                modalInstance.result.then(function () {
                	$scope.refreshPage();
                }, function (reason) {
                });
    		}
            
    	}else{
    		var modalInstance = $modal.open({
                templateUrl: 'html/modal/cloudService/handleWorkorder.html',
                controller: 'HandleWorkorderCtrl',
                backdrop:'static',
                resolve:{
                	rowObj:function(){
                		return rowObj;
                	},
                	type:function(){
                		return "view";
                	}
                }
            });
            modalInstance.result.then(function () {
            }, function (reason) {
            });
    	}
    };

});
//【云服务】/云消息/增加云消息
routeApp.controller('AddCloudMsgCtrl' ,function($scope, $http, $modal, $translate, $modalInstance,UtilService, HttpService){
	$scope.model={};
	$scope.model.userIds = [];
	$scope.model.userGrpIds = [];
	$scope.userNames = [];
	$scope.userGrpNames = [];
	$scope.messageLevel = {
			options:[ {value:1,label:$translate.instant("cloudService.generalNews")},
			          {value:2,label:$translate.instant("cloudService.importantNews")}]	
	};
	$scope.model.msgLevel = 1;
    //接收消息用户
    $scope.selReceiveMsgUser=function(){
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/selectUser.html',
            controller: 'SelectUserCtrl',
            resolve: {
            	params: function() {return {addCloudMessage:1};},
            	url:function() {return "user/list";},
            	entryNodeType : function() {return "cloudMsg"}
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
        	$scope.model.userNames=$scope.userNames.join(',');
        }, function (reason) {
        });
    };
    //接收消息分组
    $scope.selReceiveMsgGrp=function(){
    	var params = {};
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudService/selectUserGrp.html',
            controller: 'SelectUserGrpCtrl',
            backdrop:'static',
            size:'lg',
            resolve : {
            	params: function () {
		            return params;
		        }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.model.userGrpIds = [];
        	$scope.userGrpNames = [];
        	for(var i=0;i<selectedItem.length;i++){
        		$scope.model.userGrpIds.push(selectedItem[i].id);
        		$scope.userGrpNames.push(selectedItem[i].name);
        	}
        	$scope.model.userGrpNames=$scope.userGrpNames.join(",");
        }, function (reason) {
        });
    };
	$scope.send=function(){
		if (isEmpty($scope.model.userNames) && isEmpty($scope.model.userGrpNames)) {
			UtilService.error($translate.instant("user.selectUserOrGrp"),$translate.instant("common.opertip"));
			return;
		}
		HttpService.post("cloudMessage/create", $scope.model, $modalInstance);
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//【云服务】/云消息/增加云消息/选择用户分组
routeApp.controller('SelectUserGrpCtrl' ,function($scope, $http, $modal, $translate, $modalInstance, UtilService, HttpService, GridService, params){
	if (params.orgId != undefined) {
		$scope.orgId = params.orgId;
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
        	$scope.$broadcast('onQueryUserGroupList');
        }, function (reason) {
        });
    };
	$scope.selectedItems = new Array();//树选中数据
	$scope.ok=function(){
		$modalInstance.close($scope.selectedItems);
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//【云服务】/云消息/增加云消息/选择用户
routeApp.controller('SelectUserCtrl' ,function($scope, $http, $modal, $timeout, $translate, $modalInstance,params,url,entryNodeType,UtilService, HttpService, GridService){
    //修改问题单:201703240480 对话框界面列表不提供定制,只显示用户名,用户姓名,用户分组,证件号码,E-mail,电话.显示不全的增加tip
	//创建未分配此消息的用户列表
	var column1 = [{ field: 'loginName', displayName: $translate.instant('user.loginName'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                  { field: 'groupName', displayName: $translate.instant('user.userGroup'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                  { field: 'credentialNumber', displayName: $translate.instant('user.idNumber'), sortable: true,width:'15%',cellTemplate:titleTemplate},
                  { field: 'email', displayName: $translate.instant('user.email'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                  { field: 'phone', displayName: $translate.instant('user.phone'), sortable: true, width:'12%'},
                  { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'18%',cellTemplate:
	                  	 '<div><div class="ngCellButton">'
	                  	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="USER_MODIFY" ng-click="modifyUser(row.entity)" custom-title="'+$translate.instant('user.modifyUser')+'"></div>'
	                  	 +'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="USER_DELETE" ng-click="deleteUser(row.entity)" custom-title="'+$translate.instant('user.deleteUser')+'"></div>'
	                  	 +'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="USER_VIEW" ng-click="viewUser(row.entity)" custom-title="'+$translate.instant('user.viewUser')+'"></div>'
	                  	 +'</div></div>'
	                   }
                  ];
	if (angular.isDefined(entryNodeType) && entryNodeType) {
		$scope.topTitle = $translate.instant('cloudService.unselectedUser');
		$scope.buttomTitle = $translate.instant('cloudService.selectedUser');
	} else {
		$scope.topTitle = $translate.instant('org.userUnUseVm');
		$scope.buttomTitle = $translate.instant('org.userWillUseVm');
	}
	$scope.url = url;
	$scope.params = params;
	$scope = GridService.grid($scope, $scope.url, $scope.params, null, null, "userList1Div");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.mySelections1=[];
    $scope.gridOptions1 = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections1,
            showSelectionCheckbox: true,
            multiSelect: true,
            showGroupPanel: false,
            showColumnMenu: false,
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
            columnDefs:column1
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
    
    $scope.refreshUser = function() {
    	if($scope.myData2.length==0){
    		delete $scope.params.userIdNin;
    		$scope.refreshPage();
    		return;
    	}
    	var userIdNin = '';
    	for(var i=0;i<$scope.myData2.length;i++){
			if (userIdNin.length > 0) {
				userIdNin = userIdNin + "," + $scope.myData2[i].id;
			} else {
				userIdNin = userIdNin + $scope.myData2[i].id;
			}
			
		}
    	if (userIdNin.length > 0) {
    		$scope.params.userIdNin = userIdNin;
    	}
    	$scope.refreshPage();
    };
    //创建即将分配此消息的用户列表
	var column2 = [{ field: 'loginName', displayName: $translate.instant('user.loginName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
	                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'17%',cellTemplate:titleTemplate},
	                  { field: 'groupName', displayName: $translate.instant('user.userGroup'), sortable: true, width:'16%',cellTemplate:titleTemplate},
	                  { field: 'credentialNumber', displayName: $translate.instant('user.idNumber'), sortable: true,width:'18%',cellTemplate:titleTemplate},
	                  { field: 'email', displayName: $translate.instant('user.email'), sortable: true, width:'18%',cellTemplate:titleTemplate},
	                  { field: 'phone', displayName: $translate.instant('user.phone'), sortable: true, width:'16%'},
	                  ];
	$scope.myData2=[];	//demo
    $scope.mySelections2=[];
    $scope.gridOptions2 = {
            data: 'myData2',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections2,
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
            filterOptions: false,
            pagingOptions: false,
            columnDefs:column2
    }; 
    //追加用户
    $scope.appendUser=function(){
    	if($scope.mySelections1.length==0){
    		return;
    	}
    	for(var i=0;i<$scope.mySelections1.length;i++){
			var item = {};
			item.id = $scope.mySelections1[i].id;
			item.loginName = $scope.mySelections1[i].loginName;
			for(var j=0; j<$scope.myData.length; j++){
				if($scope.myData[j].id == item.id && $scope.myData[j].loginName == item.loginName){
					$scope.myData.splice(j,1);
					$scope.myData2.push($scope.mySelections1[i]);
				}
			}
		}
    	$scope.mySelections1.splice(0, $scope.mySelections1.length);
        if (angular.isDefined($scope.gridOptions1)) {
			$scope.gridOptions1.$gridScope.model.allSelected = false;
		}
    	
    	$scope.refreshUser();
    };
    //移除用户
    $scope.removeUser=function(){
    	if($scope.mySelections2.length==0){
    		return;
    	}
    	for(var i=0;i<$scope.mySelections2.length;i++){
			var item = {};
			item.id = $scope.mySelections2[i].id;
			item.loginName = $scope.mySelections2[i].loginName;
			for(var j=0; j<$scope.myData2.length; j++){
				if($scope.myData2[j].id == item.id && $scope.myData2[j].loginName == item.loginName){
					$scope.myData2.splice(j,1);
					$scope.myData.push($scope.mySelections2[i]);
				}
			}
		}
    	$scope.mySelections2.splice(0, $scope.mySelections2.length);
        if (angular.isDefined($scope.gridOptions2)) {
			$scope.gridOptions2.$gridScope.model.allSelected = false;
		}
    	
    	$scope.refreshUser();
    };
	$scope.ok=function(){
		$modalInstance.close($scope.myData2);
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
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
        	$scope.refreshUser();
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
        	$scope.refreshUser();
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
    
    //delete user
    $scope.deleteUser = function(selectedItem){
    	var modalInstance = UtilService.confirm($translate.instant("user.delSelectedUsers"), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		var usersToDelete = [];
    		var user = {};
			user.id = selectedItem.id;
			user.loginName = selectedItem.loginName;
			user.organization = selectedItem.organization;
			usersToDelete.push(user);
			
    		var callback = function(){
    			$scope.refreshUser();
    		};
    		HttpService.put("user/delUsers", usersToDelete, undefined, callback);
    	}, function(){});
    }
	
});
//【云服务】/工单/处理工单
routeApp.controller('HandleWorkorderCtrl' ,function($scope, $http, $modal,rowObj,type, $translate, $modalInstance,UtilService, HttpService){
	$scope.model={};
	$scope.type=type;
	$http({
		method : "GET",
		url : "cloudWorkOrder/" + rowObj.id
	}).success(function(result){
		if (result.success){
			$scope.model = result.data;
		} else {
			UtilService.handleResult(result);
			$modalInstance.close("cancel");
		}
	});
	if($scope.type=='process'){
		$scope.title=$translate.instant("cloudService.processTicket");
	}else{
		$scope.title=$translate.instant("cloudService.viewTicket");
	}
	
	$scope.send=function(){
		$scope.model.status = 2;
		HttpService.put("cloudWorkOrder", $scope.model, $modalInstance);
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
	
});


//防病毒配置控制器 树行
routeApp.controller('CloudAntivirusConfigCtrl', function($scope, $http, $modal, $translate, $filter, UtilService, HttpService){
	$scope.treeData = [];//树展示的数据
	//$scope.treeControl ={};
	//主机状态
	var hoststatusTemplate=function($translate) {
		return '<div class="ngCellText" ng-class="col.colIndex()"><div ng-if= \'row.branch[col.field] == 1 && row.branch.level != 1\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_normal_16x16.svg"></span><span>' + $translate.instant("common.normal") + '</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 2 && row.branch.level != 1\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_warning_16x16.svg"></span><span>'+$translate.instant("host.notInHA") +'</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 3 && row.branch.level != 1\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_maint_16x16.svg"></span><span>'+$translate.instant("host.maintainMode") +'</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 4 && row.branch.level != 1\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_maint_16x16.svg"></span><span>'+$translate.instant("host.maintainMode") +'</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 0 && row.branch.level != 1\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_error.svg"></span><span>' + $translate.instant("common.abnormal") + '</span></div></div>' ;
	};
	
	//0未安装 1已安装 -1未知
	var antivirusStatusTemplate=function($translate){
		return '<div class="ngCellText" ng-class="col.colIndex()"><div ng-if= \'row.branch[col.field] == 1 && row.branch.level != 1\'><span>' + $translate.instant("cloudService.enableAntivirus") + '</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 0 && row.branch.level != 1\'><span>' + $translate.instant("cloudService.disableAntivirus") + '</span></div>' +
		'<div ng-if= \'row.branch[col.field] == -1 && row.branch.level != 1\'><span>' + $translate.instant("cloudService.unknowAntivurus") + '</span></div></div>' ;
	};

	var antivirusNameTemplate=function($translate){
		return '<div class="ngCellText" ng-class="col.colIndex()"><div ng-if= \'row.branch[col.field] == 0 && row.branch.level != 1\'><span>' + $translate.instant("cloudService.antivirus_none") + '</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 1 && row.branch.level != 1\'><span>' + $translate.instant("cloudService.antivirusTrend") +'</span></div>' +
		'<div ng-if= \'row.branch[col.field] == 2 && row.branch.level != 1\'><span>' + $translate.instant("cloudService.antivirus360") + '</span></div></div>' ;
	};
	
    var cloudResourceTemplate ='<span>'
	    +'<span style="padding-left:2px;"></span>'
	    +'<span ng-if="cellTemplateScope.showTrendIcon(row.branch)" class="btn btn-sm-icon icon-security-manage-green" ng-click="cellTemplateScope.resourceViewAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.antivirusTrend')+'"></span>'
    	+'<span ng-if="cellTemplateScope.show360Icon(row.branch)" class="btn btn-sm-icon icon-security-manage-green" ng-click="cellTemplateScope.resourceViewAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.antivirus360')+'"></span>'
    	+'<span ng-if="cellTemplateScope.showSetupAntivirus(row.branch)" class="btn btn-sm-icon icon-security-manage-gray" ng-click="cellTemplateScope.resourceViewAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.antivirus_empty')+'"></span>'
    	+'<span shortcut custom-title short-width=200 cut-str="{{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}"></span>'
    	+'</span>';
	
    $scope.showTrendIcon = function(row){
    	if(row.level == 1) {
        	if (row.coType == "1") {
        		return true;
        	} else {
        		return false;
        	}
    	} 

    };
    
    $scope.showSetupAntivirus = function(row){
    	if(row.level == 1 && (row.coType == 0 || row.coType == null)) {
    		return true;
    	} else {
    		return false;
    	}
    };
	
    $scope.show360Icon = function(row){
    	if (row.level == 1 && row.coType == "2") {
    		return true;
    	} else {
    		return false;
    	}
    };
    
	$scope.column = [
	      { field: 'status', displayName: $translate.instant('cloudService.hostStatus'), width:'20%',
	    	  cellTemplate:hoststatusTemplate($translate), cellTemplateScope:$scope},
	      { field: 'ipAddr', displayName: $translate.instant('cloudService.ipAddr'), width:'20%',
	  		cellTemplateScope:$scope},
	      { field: 'antivirusStatus', displayName: $translate.instant('cloudService.patchStatus'), width:'20%',
	    	  cellTemplate:antivirusStatusTemplate($translate), cellTemplateScope:$scope},
	      { field: 'antivirusName', displayName: $translate.instant('cloudService.antivirusVendor'), width:'20%',
	  		cellTemplate:antivirusNameTemplate($translate), cellTemplateScope:$scope}
//     	  { field: 'oper', displayName:  $translate.instant('common.oper'),width:'8%', 
//     		  cellTemplate:'<div style="margin-top:-3px;">'
//            +'<div ng-if ="row.branch.level != 1 && row.branch.antivirusStatus == 0 && row.branch.antivirusName != 0" type="button" class="btn btn-sm-icon icon-setup-gray" ng-click="cellTemplateScope.setupAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.setup')+'"></div>'
//            +'<div ng-if="row.branch.level != 1 && (row.branch.antivirusStatus != 0 || row.branch.antivirusName == 0)" type="button" class="btn btn-sm-icon icon-setup-gray" disabled custom-title="'+$translate.instant('cloudService.setup')+'"></div>'
//            +'<div ng-if ="row.branch.level != 1 && row.branch.antivirusStatus == 1 && row.branch.antivirusName != 0" type="button" class="btn btn-sm-icon icon-vm-recycle-gray" ng-click="cellTemplateScope.unInstallAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.uninstall')+'"></div>'
//            +'<div ng-if="row.branch.level != 1 && row.branch.antivirusStatus != 1" type="button" class="btn btn-sm-icon icon-vm-recycle-gray" disabled custom-title="'+$translate.instant('cloudService.uninstall')+'"></div>'
//            //+'<div ng-if ="row.branch.level == 1 && row.branch.coType !=0" type="button" class="btn btn-sm-icon icon-setup-gray" ng-click="cellTemplateScope.oneClickSetupAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.oneClickSetup')+'"></div>'
//            //+'<div ng-if ="row.branch.level == 1 && row.branch.coType !=0" type="button" class="btn btn-sm-icon icon-vm-recycle-gray" ng-click="cellTemplateScope.oneClickUnInstallAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.oneClickUninstall')+'"></div>'
//            //+'<div ng-if ="row.branch.level == 1 && row.branch.coType ==0" type="button" class="btn btn-sm-icon icon-add-gray" ng-click="cellTemplateScope.resourceSetupAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.setupAntivirus')+'"></div>'
//            //+'<div ng-if ="row.branch.level == 1 && row.branch.coType !=0" type="button" class="btn btn-sm-icon icon-add-gray" disabled custom-title="'+$translate.instant('cloudService.setupAntivirus')+'"></div>'
//            //+'<div ng-if ="row.branch.level == 1" type="button" class="btn btn-sm-icon icon-preview-gray" ng-click="cellTemplateScope.resourceViewAntivirus(row.branch)" custom-title="'+$translate.instant('cloudService.viewAntivirus')+'"></div>'
//            //+'<div ng-if ="row.branch.level == 1 && row.branch.coType ==0" type="button" class="btn btn-sm-icon icon-preview-gray" disabled custom-title="'+$translate.instant('cloudService.viewAntivirus')+'"></div>'
//            +'</div>',cellTemplateScope:$scope}
	    	  ];
	$scope.expandColum = {field: 'resourceName', displayName: $translate.instant('cloudService.resourceName'),width:'20%',cellTemplate:cloudResourceTemplate, cellTemplateScope:$scope};
	
    var queryTreeData = function() {
    	var waitModal = UtilService.wait();
        $http({
            method: "GET",
            url: "antivirus/queryCloudAntivirusInfo"
        }).success(function(result) {
            waitModal.dismiss();
            if (result.success) {
            	$scope.initialTreeData = result.data;
            	packagingTreeData(result.data);
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            waitModal.dismiss();
            UtilService.handleError(code);
        });   
    };
    queryTreeData();
	
    
	/** 组装树结构数据*/
	function packagingTreeData(data) {
		var tempTreeMap = new Map();
        for (var i = 0; i < data.length; i++) {
        	var row = data[i];
        	var antivirus = row.antivirusInfo;
            if (tempTreeMap.get(row.cloudId) == null) {
            	var parent = {};
            	parent.resourceName = row.cloudName;
            	parent.level = 1;
            	parent.children = new Array();
            	parent.status = ""; //主机状态
            	parent.cloudStatus = row.errorCode;//云资源状态 0为正常
            	parent.annormalMsg = row.failureMessage;
            	parent.ipAddr = "";

            	parent.antivirusName = "";
            	parent.antivirusStatus = "";
            	parent.coType = 0;
            	if (antivirus != null) {
                	parent.filePath = antivirus.filePath;
                	parent.fileName = antivirus.fileName;
            		parent.coType = antivirus.coType == null ? 0 : antivirus.coType;
            	}
            	parent.expanded = true;
            	parent.id = row.cloudId;
            	tempTreeMap.put(row.cloudId ,parent);
            }
            if (row.errorCode == 0) {
            	if (antivirus.hostAntivirusInfoList != null) {
                    for (var j = 0; j < antivirus.hostAntivirusInfoList.length; j++) {
                    	var childRow = {};
                    	childRow.status = antivirus.hostAntivirusInfoList[j].status;
                    	childRow.ipAddr = antivirus.hostAntivirusInfoList[j].ip;
                    	//0 未安装 1 已安装
                    	childRow.antivirusStatus = antivirus.hostAntivirusInfoList[j].installStatus == null ? 0 : antivirus.hostAntivirusInfoList[j].installStatus;
                    	childRow.resourceName = antivirus.hostAntivirusInfoList[j].name;
                    	childRow.hostId = antivirus.hostAntivirusInfoList[j].id;
                    	childRow.antivirusName = antivirus.coType == null ? 0 : antivirus.coType;
                    	childRow.parentId = row.cloudId;
                    	childRow.children = new Array();
                    	childRow.level = 2;
                    	tempTreeMap.get(row.cloudId).children.push(childRow);
                    }
            	}
            }
        }
        tempTreeMap.each(function(key, value, index) {
        	$scope.treeData.splice(key - 1, 0, value);
        });
	}
	
    $scope.refresh = function() {
    	$scope.treeData.splice(0, $scope.treeData.length);//清空树节点数据重新加载
        if (angular.isDefined($scope.selectedItems)){
      	  	$scope.selectedItems.splice(0, $scope.selectedItems.length);//清空选中的数据
        }
    	queryTreeData();
    }
	
    //主机安装防病毒
    $scope.setupAntivirus = function(row) {
    	var entity = {};
    	var hostEntity = {};
    	hostEntity.id = row.hostId;
    	entity.cloudId = row.parentId;
    	entity.hostAntivirusInfoList = [];
    	entity.hostAntivirusInfoList.push(hostEntity);
    	HttpService.post('antivirus/installHostsAntivirus', entity, undefined, $scope.refresh);
    }
    
    //主机卸载防病毒
    $scope.unInstallAntivirus = function(row) {
    	var entity = {};
    	var hostEntity = {};
    	hostEntity.id = row.hostId;
    	entity.cloudId = row.parentId;
    	entity.hostAntivirusInfoList = [];
    	entity.hostAntivirusInfoList.push(hostEntity);
    	HttpService.post('antivirus/unInstallHostsAntivirus', entity, undefined, $scope.refresh);
    }
    
    //一键安装云资源防病毒
    $scope.oneClickSetupAntivirus = function(row) {
    	if (row.cloudStatus != 0) {
    		UtilService.alert(row.annormalMsg, $translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	var entity = {};
    	entity.cloudId = row.id;
    	entity.hostAntivirusInfoList = row.children;
    	HttpService.post('antivirus/oneClickInstallAntivirus', entity, undefined, $scope.refresh);
    }
    
    //一键卸载云资源防病毒
    $scope.oneClickUnInstallAntivirus = function(row) {
    	if (row.cloudStatus != 0) {
    		UtilService.alert(row.annormalMsg, $translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	var entity = {};
    	entity.cloudId = row.id;
    	entity.hostAntivirusInfoList = row.children;
    	HttpService.post('antivirus/oneClickUnInstallAntivirus', entity, undefined, $scope.refresh);
    }
    
    //云资源安装防病毒
    $scope.resourceSetupAntivirus = function(row) {
    	if (row.cloudStatus != 0) {
    		UtilService.alert(row.annormalMsg, $translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	
    	var modalInstance = $modal.open({
    		templateUrl: 'html/modal/cloudService/setupCloudAntivirus.html',
    		controller: 'setupAntivirusCtrl',
    		backdrop:'static',
    		resolve: {
    			cloudResource: function() {
    				return row;
    			}
    		}
		 
    	});
    	modalInstance.result.then(function (selectedItem) {
    		
    	}, function () {
    		
    	});
    	
    }
    
    $scope.resourceViewAntivirus = function(row) {
    	var modalInstance = $modal.open({
    		templateUrl: 'html/modal/cloudSecurity/antivirusSoftware/viewCloudAntivirusInfo.html',
    		controller: 'viewCloudAntivirusCtrl',
    		backdrop:'static',
    		resolve:{
                entity:function(){return row;}
    		}
    	});
    	modalInstance.result.then(function () {
    	}, function () {
    	});
    }
    
});

routeApp.controller('viewCloudAntivirusCtrl',function($scope, $http, $modal, $modalInstance, $timeout, $translate, entity, HttpService, UtilService) {
	$scope.info = entity;
	if (entity.coType == 1) {
		$scope.info.vendor = $translate.instant("cloudService.antivirusTrend");
	} else if (entity.coType == 2) {
		$scope.info.vendor = $translate.instant("cloudService.antivirus360");
	} else {
		$scope.info.vendor = $translate.instant("cloudService.antivirus_none");
	}
	
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
		

//云资源安装防病毒控制器
routeApp.controller('setupAntivirusCtrl',function($scope, $http, $modal,$translate, $modalInstance, UtilService, HttpService, cloudResource) {
	$scope.antivirus = {};
	$scope.antivirus.resourceName = cloudResource.resourceName;
	$scope.antivirus.cloudId = cloudResource.id;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.ok = function () {
		if ($scope.antivirus.targetPath.indexOf("/vms/") != 0) {
			UtilService.alert($translate.instant('cloudService.dirErrorPrompt'), $translate.instant('common.opertip'), false, 'error');
			return;
		}
		
		var entity = {};
		entity.cicFilePath = $scope.antivirus.filePath;
		entity.filePath = $scope.antivirus.targetPath;
		entity.fileName = $scope.antivirus.softName;
		entity.cloudId = $scope.antivirus.cloudId;
		HttpService.post('antivirus/installCloudAntivirus', entity, undefined);
    };
    
    //选择防病毒软件
    $scope.selAntivirusSoft = function() {
    	var modalInstance=$modal.open({
        	templateUrl:'html/modal/common/selectAntivirusSoft.html',
        	controller:'selectAntivirusSoftCtrl',
        	backdrop:'static'
        });
    	modalInstance.result.then(function(selectItem){
    		$scope.antivirus.softName = selectItem[0].fileName;
    		$scope.antivirus.filePath = selectItem[0].filePath;
    		
    	}, function(){
    		
    	});
    };
});


/**
 * 选择防病毒软件
 */
routeApp.controller('selectAntivirusSoftCtrl',function($scope, $http, $modal, $translate, $timeout,$modalInstance, UtilService,GridService,HttpService) {
	var params = {};
	$scope.antivirus = {};
	$scope.seleteAntivirus = [];
	var url = 'antivirus/list';
	var column = [{ field: 'fileName', displayName: $translate.instant('cloudSecurity.fileName'), sortable: true, width:'30%', cellTemplate: titleTemplate},
	              { field: 'vendor', displayName: $translate.instant('cloudSecurity.vendor') , cellFilter: 'antiVirusSoftwareVendor',sortable: true, width:'40%'},
                  { field: 'filePath', displayName: $translate.instant('cloudSecurity.filePath'), sortable: true, width:'30%', cellTemplate: titleTemplate}
                 ];
	
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, params);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.seleteAntivirus,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: true,
			showFooter: true,
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			rowTemplate: doubleClickTemplate,    // 双击行模板
			columnDefs:column
	};

	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	}   

	$scope.ok=function(){
		$modalInstance.close($scope.seleteAntivirus);
	}
	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

//【云安全】/防火墙
routeApp.controller('firewallCtrl' ,function($scope, $http, $modal, $translate ,UtilService, HttpService){
    $scope.seleteAcl = [];  //选择的ACL策略
    
    //查询使用防火墙的CVM
//    $scope.$on("queryFirewallCvm", function(event, params){
//		 $scope.$broadcast("onQueryFirewallCvm",params);
//	 });
    
    //刷新防火墙列表//onQueryAclStrategy
    $scope.refreshFirewallStrategy = function() {
        var msg = {msg:'onQueryFirewall'};
        $scope.$root.$broadcast('onQueryFirewall', msg);
    };

});

//Firewall策略列表
routeApp.controller('firewallListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
	var selectedRow = new Array();
	var params = {};
	var url = 'firewall/strategyList';
	var statusTemplate='<div class="ngCellText" ng-class="col.colIndex()"> '+
	'<span ng-if= \'row.entity[col.field] == "1"\'><span class="icon-active"></span><span class="span_padding"></span><span class="cell-icon-text">' + $translate.instant("securityMng.enable") + '</span></span>' +
	'<span ng-if= \'row.entity[col.field] == "0"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">' + $translate.instant("securityMng.refuse") + '</span></span></div>' ;
	var column = [
	              { field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'20%'},
	              { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'20%', cellFilter:'nullStr'},
	              { field: 'userName', displayName: $translate.instant('cloudSecurity.user'), sortable: true, width:'20%'},
	              { field: 'createTime', displayName: $translate.instant('securityMng.createTime'), cellFilter:'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'25%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-preview-gray" ng-click="viewFirewallStrategy(row.entity)" custom-title="'+$translate.instant('common.view')+'"></div>'
	            	  +'</div></div>'
	              }
	              
	              ]
	
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, params, undefined,undefined, 'firewallList');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	//现在只查询不用刷新，dongmei Hu
	$scope.$on('onQueryFirewall', function(event, msg) {    // 刷新策略表  
	    //清空gridOptions2数据
		if ($scope.myData.length == 1) {// 删除删除最后一条记录，清空cvm
            var rowObj = {};
            $scope.$root.$broadcast("clearAclStrategyCvm", rowObj);
	    }
	    $scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
		$scope.seleteAcl.splice(0, $scope.seleteAcl.length);
		$scope.refreshPage();
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		};
		$scope.gridOptions.selectRow(0, true);
    });

	$scope.$on('ngGridEventFilter', function(event, msg) {
		// 设置时间间隔
		if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
			$timeout.cancel($scope.keyInterval);
		}
		$scope.keyInterval = $timeout(function() {
			params.name = msg;
			$scope.pagingOptions.currentPage = 1;
			$scope.refreshPage();
			$scope.gridOptions.selectAll(false);
		}, constant.keyInterval);
	});
	selectFirstLine($scope, selectedRow, 'name');//选择默认第一行
	afterSelect();
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.seleteAcl,
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
			filterOptions : {
				filterText: "",
				useExternalFilter: true
			},
		    beforeSelectionChange: function(rowItem, event){
	        	/*if(event){
	        		var clickedClass = event.target.className;
	        		$scope.btnClicked = (clickedClass.indexOf("btn") != -1);
	        	}*/
	        	return true;
	        },
		    afterSelectionChange: function(rowItem, event) { // 选中事件完成后触发
		            selectedRow.splice(0, selectedRow.length, rowItem.entity);
		        	if ($scope.mySelections2) {
		        		$scope.mySelections2.splice(0, $scope.mySelections2.length);
		        	} 
		        	afterSelect();
		        	/*if(!$scope.btnClicked){
		        		afterSelect();
		        	}*/
		    }
	};    
	
    function afterSelect(){
    	if($scope.seleteAcl[0]){
            var params = {};
            params.id= $scope.seleteAcl[0].id;
            //$scope.$emit("queryFirewallCvm", params);
            $scope.$root.$broadcast("onQueryFirewallCvm",params);
    	}
    }

    //查看防火墙策略
    $scope.viewFirewallStrategy = function(entity) {
        var waitModal = UtilService.wait();
        $http({
           method: 'GET',
           url: 'firewall/strategy/' + entity.id +'/firewallRules'
        }).success(function(result) {
            waitModal.dismiss();
            if (result.success == true) {
                var modalInstance = $modal.open({
                    templateUrl: 'html/modal/cloudSecurity/firewall/viewFirewallStrategy.html',
                    controller: 'viewFirewallCtrl',//'addAclCtrl',
                    size:'lg',
                    backdrop:'static',
                    resolve: {
                    	firewallRulesEntry: function() {
                           return result.data;
                        },
                        firewallStrategyEntity: function(){
                            return entity;
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
    }
    
    
});

////查看防火墙策略
routeApp.controller('viewFirewallCtrl',function($scope, $http, $translate, $modalInstance, $modal,$timeout, firewallStrategyEntity,firewallRulesEntry, HttpService, UtilService) {
    $scope.name = firewallStrategyEntity.name;
    $scope.description = firewallStrategyEntity.description;
    $scope.firewallRulesEntry = firewallRulesEntry;
    $scope.defaultAction = "拒绝";
    
    $scope.isEffectTimeEnabled = function(time) {
          if (time == null || '' == time) {
              return false;
          }
          var arr = [];
          if ($scope.entry.effectTimeRange != null && $scope.entry.effectTimeRange != "") {
              arr = $scope.entry.effectTimeRange.split(",");
              for (var i=0; i<arr.length;i++) {
                  if (time == arr[i]) {
                      return true;
                  }
              }
          } 
          return false;
    }
   
    //定位规则在数组的位置
    var getRuleIndex = function(ruleArray, rule) {
        if (angular.isArray(ruleArray)) {
            for (var i = 0; i < ruleArray.length; i++) {
                if (angular.equals(rule, ruleArray[i])) {
                    return i;
                }
            }
            return -1;
        } else {
            return -1;
        }
    };
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
        
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//ACL规则列表
routeApp.controller('aclRuleListCtrl',function($scope, $http, $modal, $translate, UtilService, GridService) {
	var actionCell = "";
    // 查看时不显示操作按钮
    var columnV4 = [{field: 'direction', displayName: $translate.instant('securityMng.aspect') , sortable: false, width:'10%',cellFilter:'aspect'},
				    {field: 'protocol', displayName: $translate.instant('securityMng.protocol') , sortable: false, width:'10%',cellFilter:'protocol'},
				    {field: 'srcIp', displayName: $translate.instant('securityMng.sourceIp') , sortable: false, width:'10%'},
				    {field: 'srcMask', displayName: $translate.instant('securityMng.sourceMask') , sortable: false, width:'10%'},
				    {field: 'srcPort', displayName: $translate.instant('securityMng.sourcePort') , sortable: false, width:'10%',visible:false},
				    {field: 'destIp', displayName: $translate.instant('securityMng.targetIp') , sortable: false, width:'10%',visible:false},
				    {field: 'destMask', displayName: $translate.instant('securityMng.targetMask') , sortable: false, width:'10%',visible:false},
				    {field: 'destPort', displayName: $translate.instant('securityMng.targetPort') , sortable: false, width:'10%',visible:false},
				    {field: 'action', displayName: $translate.instant('securityMng.action') , sortable: false, width:'10%',cellFilter:'accessType'},
				    {field: 'priority', displayName: $translate.instant('common.priority') , sortable: false, width:'10%',visible:false},];

    
    // 使用父控制器的数据
    $scope.data = $scope.firewallRulesEntry;
    // 刷新数据
    $scope.$on('onRefreshAclRules', function(event, msg) {
           $scope.dataV4 = $scope.firewallRulesEntry;
    });

    // 创建表格
    $scope.v4GridOptions = {
            data: 'data',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.selItems,
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
            // totalServerItems: 'totalServerItems',
            filterOptions: false,
            pagingOptions: false,
            columnDefs:columnV4
    }
});

routeApp.controller("firewallCvmListCtrl", function($scope, $http, $modal, $translate, $timeout, UtilService, GridService, HttpService){
	
	var queryParams = {};
	
	$scope.$on("onQueryFirewallCvm", function(event, params){
		$scope.refreshAclStrategyCvmList(params);
	});
	
	$scope.$on("clearAclStrategyCvm", function(event, params){
		if ($scope.myData2) {
			$scope.myData2.splice(0, $scope.myData2.length);
		}
	});
	
	$scope.refreshAclStrategyCvmList = function(param) {
		var areaDivId = UtilService.areawait("aclStrategyCvmDivId");
		$http({
        		method: 'GET',
        		url: 'firewall/strategy/' + param.id +'/vms',
        	}).success(function (result) {	
        		UtilService.dismissAreawait(areaDivId);
        		if (result.success == true) {
        			if ($scope.myData2) {
        				$scope.myData2.splice(0, $scope.myData2.length);
        			}
        			$scope.myData2 = result.data;
        		}
        		if ($scope.mySelections2) {
            		$scope.mySelections2.splice(0, $scope.mySelections2.length);
            	} 
            }).error(function(){
            	UtilService.dismissAreawait(areaDivId);
            });
	};

	var column=[{ field: 'title', displayName:$translate.instant('common.displayName'),width:'30%'},
	            //{ field: 'ip', displayName:$translate.instant('paramconfig.ipAddr'),  width:'30%'},
                { field: 'mac', displayName:$translate.instant('cloudSecurity.macAddr'),  width:'30%'},
                { field: 'cloudResourceName', displayName:$translate.instant('cloudSecurity.cloudResourceName'),  width:'30%'},
               ];
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_RED_60, true);
	listenNavClick($scope, $timeout, LIST_HEIGHT_RED_60, true);
	$scope.gridOptions2 = {
    		data: 'myData2',
    		jqueryUITheme: false,
    		jqueryUIDraggable: false,
    		selectedItems: $scope.mySelections2,
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
    		columnDefs:column
    };
})



