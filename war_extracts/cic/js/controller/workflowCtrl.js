//=============================================================================================
// 流程管理
//=============================================================================================
routeApp.controller('WorkflowMngCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate){
	var permissions = localStorage.getItem("permissions");
	 if (angular.isDefined(permissions)) {
		 var permissonArr = JSON.parse(permissions);
		 if (angular.isArray(permissonArr)) {
			 $scope.showVmWorkflow = true;//permissonArr.contains(constant.VMWORKFLOW_MNG);
			 $scope.showDiskWorkflow = true;//permissonArr.contains(constant.CLOUDDISKFLOW_MNG);
			 $scope.showRegisterWorkflow = true;//permissonArr.contains(constant.USERREGISTERFLOW_MNG);
			 $scope.showBackupWorkflow = true;//permissonArr.contains(constant.CLOUDBACKUPSTRATEGY_MNG);
		 } 
	 } 
});

//=============================================================================================
// 虚拟机电子流
//=============================================================================================
routeApp.controller('WorkflowVmCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, WorkflowService){
	$scope.model ={
			status:0
	};
	$scope.filterParams = {
			status:15
	};
	$scope.downloadParams = {};
	/** 状态（0待审批，1审批中，2通过，3拒绝，30撤销，10待实施，11部署成功，12部署失败，13删除成功，14删除失败）*/
	$scope.statusOptions=[{value:0,label:$translate.instant('workflow.wating')},{value:2,label:$translate.instant('workflow.pass')},
                {value:3,label:$translate.instant('workflow.refuse')},{value:30,label:$translate.instant('workflow.revoke')},
                {value:11,label:$translate.instant('workflow.deploySuccess')},{value:12,label:$translate.instant('workflow.deployFail')},
                {value:13,label:$translate.instant('workflow.delSuccess')},{value:14,label:$translate.instant('workflow.delFail')},
                {value:15,label:$translate.instant('workflow.all')}];
	$scope.$watch('model.status', function(newVal, oldVal) {
		$scope.downloadParams.status = $scope.model.status;
		var pms = {type:"refash"};
		if ($scope.model.status != 15) {
			pms.status = $scope.model.status;
		} else {
			pms.all = "all";
		}
		pms.isJump = true;
		$scope.$broadcast('WorkflowVmList', pms);
	});
	$scope.refresh = function() {
		$scope.downloadParams.status = $scope.model.status;
		var pms = {type:"refash"};
		if ($scope.model.status != 15) {
			pms.status = $scope.model.status;
		} else {
			pms.all = "all";
		}
		$scope.$broadcast('WorkflowVmList', pms);
	}
	$scope.filterWorkflow = function() {
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/workflow/advancedFilter.html',
            controller: 'filterWorkflowCtrl',
            size:{width:'486px'},
            backdrop: 'static',
            resolve: {
           	 filterParams: function(){
           		 return $scope.filterParams;
           	 }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.filterParams = selectedItem;
        	$scope.downloadParams = selectedItem;
        }, function (reason) {
       	 
        });
	}
	$scope.delWorkflows = function() {		
		var pms = {type:"del"};
		$scope.$broadcast('WorkflowVmList', pms);
	}
	$scope.uicustom = function() {
		WorkflowService.uicustom({type:'vm.workflow'});
	}
	$scope.defineField = function() {
		WorkflowService.defineField();
	}
	$scope.downloadWorkflow = function() {
		WorkflowService.downloadWorkflow($scope.downloadParams);
	}
	
});
routeApp.controller('WorkflowVmListCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, WorkflowService){
	//该事件由电子流列表的界面定制弹窗发射过来，用于定制界面后刷新整个列表
	$scope.$on(constant.onReloadVmList, function (event, msg) {
		 $timeout(function() {
	        $scope.gridOptions = undefined;
	        $scope.initColumn();
	    });
	});
	$scope.model ={};
	/** 状态（0待审批，1审批中，2通过，3拒绝，30撤销，10待实施，11部署成功，12部署失败，13删除成功，14删除失败）*/
	var workflowStatus='<div class="ngCellText" ng-class="col.colIndex()">' +
	    '<span ng-if= \'row.entity.status == 0\' class="" translate="workflow.pendingApproval"></span>' +
	    '<span ng-if= \'row.entity.status == 1\' class="" translate="workflow.pending"></span>' +
	    '<span ng-if= \'row.entity.status == 2\' class="" translate="workflow.pass"></span>' +
	    '<span ng-if= \'row.entity.status == 3\' class="" translate="workflow.refuse"></span>' +
	    '<span ng-if= \'row.entity.status == 10\' class="" translate="workflow.implementing"></span>' +
	    '<span ng-if= \'row.entity.status == 11\' class="" translate="workflow.deploySuccess"></span>' +
	    '<span ng-if= \'row.entity.status == 12\' class="" translate="workflow.deployFail"></span>' +
	    '<span ng-if= \'row.entity.status == 13\' class="" translate="workflow.delSuccess"></span>' +
	    '<span ng-if= \'row.entity.status == 14\' class="" translate="workflow.delFail"></span>' +
	    '<span ng-if= \'row.entity.status == 30\' class="" translate="workflow.revoke"></span></div>' ;
	var operationTemplate = '<div><div class="ngCellButton">'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.status == 0 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="VMWORKFLOW_HANDLE" custom-title="{{\'workflow.vmImplement\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.status == 1 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="VMWORKFLOW_HANDLE" custom-title="{{\'workflow.vmImplement\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.status == 10 && row.entity.implement" ng-click="implement(row.entity)" custom-title="{{\'workflow.vmImplement\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" ng-click="viewWorkflow(row.entity)" custom-title="{{\'common.view\'|translate}}" has-permission="VMWORKFLOW_VIEW"></div>'
		+'</div></div>';
	/** 申请类型，1:申请虚拟机，0:注销虚拟机3 ：不通过模板直接申请虚拟机。4:延期 */
	var vmWorkflowType = '<div class="ngCellText" ng-class="col.colIndex()">' +
		'<span ng-if= \'row.entity.type == 0\' class="" translate="workflow.logout"></span>' +
		'<span ng-if= \'row.entity.type == 1\' class="" translate="workflow.apply"></span>' +
		'<span ng-if= \'row.entity.type == 3\' class="" translate="workflow.apply"></span>' +
		'<span ng-if= \'row.entity.type == 4\' class="" translate="workflow.delay"></span>' +
		'</div>';
	var cpuNum = '<div class="ngCellText" ng-class="col.colIndex()">' + 
	    '<span ng-if="row.entity.cpuSockets && row.entity.cpuCores">{{row.entity.cpuSockets}}*{{row.entity.cpuCores}}</span>' + 
	    '</div>';
	
	// 获取配置
	$scope.initColumn = function() {
		$http({
			method:'GET',
			url:'ui/params/visible',
			params:{uiName : "VM_WORKFLOW_UI"} }).success(function(result){
				UtilService.handleResult(result);
				if (result && result.data && result.data.visibleParams && result.data.visibleParams.length > 0) {
					$scope.column = [];
					var columnData = result.data.visibleParams;
					var gridWidth=$("div.cas-list-body").width(),widthSum=125;	//25px是复选框列所占的宽度,100px:operation column
					for(var i = 0;i<columnData.length;i++) {
						var data = columnData[i];
						var col = {};
						col.field = data.id;
						col.displayName = data.name;
						col.width = data.width + 'px';
						switch (data.id) {
						case "title":
							col.cellTemplate = titleTemplate;
							break;
						case "templateName":
							col.cellTemplate = titleTemplate;
							break;
						case "applyReason":
							col.cellTemplate = titleTemplate;
							break;
						case "handleReason":
							col.cellTemplate = titleTemplate;
							break;
						case "status": // status,90;
							col.cellTemplate = workflowStatus;
							break;
						case "type": // type,50;
							col.cellTemplate = vmWorkflowType;
							break;
						case "memory":
							col.cellFilter = "byteUnitRender:true";
							break;
						case "cpuSockets":
							col.cellTemplate = cpuNum;
							break;
						default : break;
						}
						if(i == columnData.length-1&&(widthSum+columnData[i].width)<gridWidth){	//修改问题单201602270357，by kf6302
			        		col.width=(gridWidth-widthSum)+"px";
			        		$scope.beyond = false;
			        	}else{
			            	widthSum+=columnData[i].width;
			            	$scope.beyond = true;
			        	}
						$scope.column.push(col);
					}
					$scope.column.push({ field: 'oper', displayName:$translate.instant('common.oper'), sortable:false, width:'100px', cellTemplate:operationTemplate});
				} else {
					$scope.column = [
					                 {field:'title', displayName:$translate.instant("vm.displayName"), width:'10%', cellTemplate:titleTemplate},
					                 {field:'templateName', displayName:$translate.instant("vm.templateName"), width:"10%", cellTemplate:titleTemplate},
				 					 {field:'status', displayName:$translate.instant("vm.storagepoolModal.status"), width:'6%', cellTemplate:workflowStatus},
				 					 {field:'type', displayName:$translate.instant("vm.storagepoolModal.type"),width:"6%", cellTemplate:vmWorkflowType},
				 					 {field:'userName', displayName:$translate.instant("username"), width:"8%"},
				 					 {field:"applyReason", displayName:$translate.instant("workflow.delayResion"), width:"14%", cellTemplate:titleTemplate},
				 					 {field:"handleReason", displayName:$translate.instant("workflow.reason"), width:"14%", cellTempalte:titleTemplate},
				 					 {field:"createDate", displayName:$translate.instant("workflow.applyTime"), width:"12%"},
				 					 {field:"handleDate", displayName:$translate.instant("workflow.impTime"), width:"12%"},
				 					 {field: 'oper', displayName:$translate.instant('common.oper'), sortable:false, width:'8%', cellTemplate:operationTemplate}
				 					 ];
					$scope.beyond = false;
				}
				$scope.initGrid();
			});
		
	};
	$scope.initGrid = function(){
		var url = "workflow/queryVmWorkflows";
		var params = {
				isFlow:"isFlow"
		};
		if ($scope.model.all != "all"){
			params.conditions = $scope.model.status ? $scope.model.status : 0;
		}
		$scope = GridService.grid($scope, url, params, null, null, "workflowVmListDiv");
		if ($scope.pagingOptionsTemp) {
            $scope.pagingOptions.pageSize = $scope.pagingOptionsTemp.pageSize;
            $scope.pagingOptions.currentPage = $scope.pagingOptionsTemp.currentPage;
        }
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		// 动态控制grid的宽和高
        $scope.listStyle = $scope.gridStyle();
        listenNavClick($scope, $timeout);
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
				i18n: $translate.instant('lang'),
				totalServerItems: 'totalServerItems',
				filterOptions: $scope.filterOptions,
				pagingOptions: $scope.pagingOptions,
				columnDefs:$scope.column,
				rowTemplate: doubleClickTemplate    // 双击行模板
		  	};
		
	    $timeout(function(){
	    	if ($scope.beyond == true) {
	    		$("#workflowVmListDiv").find("div.ngViewport").css('overflow-x', 'auto');
	    	}
	    })
	};
	//$scope.initColumn();
	
	
	$scope.$on('WorkflowVmList',function (event, pms){
		if ("refash" == pms.type) {			
			if (angular.isDefined($scope.params)) {	
				$scope.model.status = pms.status;
				$scope.model.all = pms.all;
			}
			if ($scope.pagingOptions) {
			    $scope.pagingOptionsTemp = {};
			    $scope.pagingOptionsTemp.pageSize = $scope.pagingOptions.pageSize;
				if (pms.isJump) {
					 $scope.pagingOptionsTemp.currentPage = 1;
				} else {
	            $scope.pagingOptionsTemp.currentPage = $scope.pagingOptions.currentPage;
			}
			}
			//修改问题单:201605230388 刷新后再选中数据,mySelections数组没有数据
			$timeout(function(){
			    $scope.gridOptions = undefined;
			    $scope.initColumn();
	        });
		} else if ("del" == pms.type) {
			$scope.delWorkflow();
		} 
    });
	$scope.$on('advancedQueryInVmWorkflow', function(event, params){
		var data = angular.copy(params);
		if (data.status == 15){
			delete data.status
		}
		$scope.params = data;
		$scope.pagingOptions.currentPage = 1;
		$scope.refreshPage();
	});
	
	$scope.$on('onRefreshVmWorkflow', function(event, params){
		$scope.refreshPage();
	});
	
	$scope.handlerWorkflow = function(data) {
		data.workflowType = "vm";
		data.opType = "add";
//		data.callBackQuery = $scope.initColumn;
		data.callBackQuery = function() {
			$scope.gridOptions = undefined;
		    $scope.initColumn();
		};
		WorkflowService.handlerWorkflow(data);
	};
	$scope.viewWorkflow = function(data) {
		data.workflowType = "vm";
		data.opType = "view";
		data.callBackQuery = $scope.initColumn;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.query = function() {
		if (angular.isDefined($scope.params)) {			
			$scope.refreshPage();
		} else {
			$scope.params = {};
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		}
	};
	$scope.implement = function(data) {
		data.callBackQuery = $scope.query;
		WorkflowService.vmImplement(data);
	}
	$scope.delWorkflow = function() {
		if(!$scope.gridOptions.selectedItems || $scope.gridOptions.selectedItems.length == 0){
    		UtilService.error($translate.instant("workflow.delSelectAlert"),$translate.instant("common.opertip"));
    		return;
    	}else{
    		for(var i = 0; i < $scope.gridOptions.selectedItems.length; i++){
				if ($scope.gridOptions.selectedItems[i].status != 0 && $scope.gridOptions.selectedItems[i].status != 30) {
					UtilService.error($translate.instant("workflow.delVmWorkflowAlert"),$translate.instant("common.opertip"));
		    		return;
				}
			}
    		var modalInstance = UtilService.confirm($translate.instant('workflow.delConfirm'));
    		modalInstance.result.then(function (selectedItem) {
    			var queryStr = "";
    			for(var i = 0; i < $scope.gridOptions.selectedItems.length; i++){
    				queryStr += "deleteIds=" + $scope.gridOptions.selectedItems[i].id+"&";
    			}
    			queryStr = queryStr.substring(0, queryStr.length-1);
    			var d = new Date();
    			$scope.lastCheckTime = d.getTime();
    			HttpService.delete("workflow/delVmWorkflows?"+queryStr, undefined, undefined, $scope.refreshPage);
    		}, function () {
    		});
    	}
	}
});
//=============================================================================================
// 附加字段
//=============================================================================================
routeApp.controller('DefineFieldCtrl',function($scope, $state, $http, $modal, $modalInstance, $translate,$timeout, UtilService, HttpService,GridService, WorkflowService){
	$scope.model ={};
	$scope.title = $translate.instant('field.title');
	///-------数据查询---------/////
	var url = 'workflow/field/list';
	//查询
	$scope.query = function() {
		$scope.refreshPage();
	};
	$scope.refreshPage = function() {
		$scope.tempAttrs=[];
	      $http({
	          method:'GET',
	          url:url
	      }).success(function(data,status,headers,cfg){
	          for(var i=0;i<data.data.length;i++){
	              $scope.tempAttrs[i]=data.data[i];
	              $scope.tempAttrs[i].index=i;
	          }
	      });
	      $scope.myData = $scope.tempAttrs;
	};
	$timeout(function(){
	      $('#nestable').nestable().on("change",function(){
	          // 更新列的显示顺序
	               var doms = $(this).find(".dd-item");
	               for(index = 0; index < doms.length; index++){
	                      var data_id = $(doms[index]).attr('data-id');
	                      $scope.myData[Number(data_id)].fieldPriority = index + 1;
//	                    console.log($scope.domainAttrs[Number(data_id)].attrName+":"+$scope.domainAttrs[Number(data_id)].order);
	               }
	               $scope.$apply();
	      });
	      $('#nestable').on('mousedown','.dd-handle .btn',function(e){
	          e.stopPropagation();
	      });
	      $scope.refreshPage();
	      
	});
	$scope.ok=function(){
		HttpService.post("workflow/field/saveList", $scope.myData, $modalInstance, $scope.refreshPage);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	$scope.del = function(entity) {
		var modalInstance = UtilService.confirm($translate.instant('field.delConfirm', {value:entity.fieldName}));
		modalInstance.result.then(function (selectedItem) {
			var url = "workflow/field/del/" + entity.id + "/" + entity.fieldName;
    		HttpService.delete(url, undefined, undefined, $scope.query);
		}, function () {
		});
	};
	//界面定制按钮
	$scope.add = function(data) {
		if (isEmpty(data)) {
			data = {};
		}
		data.opType="add";
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/workflow/defineField.html',
            controller: 'AddEditDefineFieldCtrl',
            backdrop: 'static',
            resolve: {
            	data: function () {
            		return data;
            	}
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.query();
        }, function () {
        	
        });
    };
    $scope.modify = function(data) {
		data.opType="modify";
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/workflow/defineField.html',
            controller: 'AddEditDefineFieldCtrl',
            backdrop: 'static',
            resolve: {
            	data: function () {
            		return data;
            	}
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.query();
        }, function () {
        	
        });
    };
});
//=============================================================================================
//附加字段 add Edit
//=============================================================================================
routeApp.controller('AddEditDefineFieldCtrl',function(data, $scope, $state, $http, $timeout, $modal, $modalInstance, $translate, UtilService, HttpService,GridService, WorkflowService){
	$scope.title = $translate.instant('field.add');
	$scope.model={
			fieldAllowBlank:0,
			fieldType:0,
			fieldMin:0,
			fieldLen:64,
			fieldMax:10,
			fieldPriority:1
	};
	$scope.options=[];
	if (data.opType == "modify") {
		$scope.title = $translate.instant('field.modify');
		$scope.checkNameParam = {id:data.id};// 重名检测。
		$.ajax({
			type:'GET',
			url:'workflow/field/getField/' + data.id,
			async: false,
			success: function(result){
				UtilService.handleResult(result);
				if (result && result.data && result.data != null) {
					var reData = result.data;
					$scope.model={
							fieldName:reData.fieldName,
							fieldAllowBlank:reData.fieldAllowBlank,
							fieldType:reData.fieldType,
							defaultValue:reData.defaultValue,
							fieldMin:reData.minValue,
							fieldMax:reData.maxValue,
							fieldLen:reData.maxLen,
							fieldPriority:data.fieldPriority
					};
					var ops = reData.itemList;
					if (ops != null && ops.length > 0) {
						for (var i=0;i<ops.length;i++){
							var op={value:ops[i],label:ops[i]};
							$scope.options.push(op);
						}
					}
				}
			}
		});
	}
	$scope.fieldAllowBlankOptions =[{value:0,label:$translate.instant('field.allowBlank')},{value:1,label:$translate.instant('field.forbBlank')}];
	$scope.fieldTypeOptions =[{value:0,label:$translate.instant('field.intager')},{value:1,label:$translate.instant('field.strIntager')},
	                          {value:2,label:$translate.instant('field.anyStr')},{value:3,label:$translate.instant('field.selData')}];
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.ok=function(){
		var ops;
		var tmp;
		if ($scope.model.fieldType == 3 && $scope.options.length <= 0) {
			UtilService.error($translate.instant("field.optionsNullError"));
			return;
		}
		if ($scope.model.fieldType == 3 && $scope.options.length > 0) {
			ops = [];
			tmp = [];
			for (var i=0;i<$scope.options.length;i++){
				var pa = {fieldOptions:$scope.options[i].value};
				ops.push(pa);
				tmp.push($scope.options[i].value);
			}
			if (!isEmpty($scope.model.defaultValue) && !tmp.contains($scope.model.defaultValue)) {
				UtilService.error($translate.instant("field.defaultValueEqlError"));
				return;
			}
		}
        var param ={
        		id:data.id,
        		fieldName:$scope.model.fieldName, 
        		fieldType:$scope.model.fieldType, 
        		fieldAllowBlank:$scope.model.fieldAllowBlank,
        		fieldMax:$scope.model.fieldMax,
        		fieldMin:$scope.model.fieldMin,
        		fieldLen:$scope.model.fieldLen,
        		defaultValue:$scope.model.defaultValue,
        		options:ops,
        		fieldPriority:$scope.model.fieldPriority
        }
        if (data.opType == "modify") {
        	var url = "workflow/field/modify";
        	HttpService.put(url, param, $modalInstance);
        } else {        	
        	var url = "workflow/field/add";
        	HttpService.post(url, param, $modalInstance);
        }
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	$scope.$watch('model.optionsSelectValue', function(newVal, oldVal) {
		if ($scope.model.optionsSelectValue){
			$scope.model.selectValue = String($scope.model.optionsSelectValue);
		}
		
	});
	
	$scope.$watch("model.fieldType", function(newValue, oldValue) {
		if (newValue != oldValue) {
			if (newValue == 0) {
				if (!$scope.model.fieldMin) {
					$scope.model.fieldMin = 0;
				}
				if (!$scope.model.fieldMax) {
					$scope.model.fieldMax = 10;
				}
				
			} 
			$scope.model.defaultValue = undefined;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}
	})
	
	$scope.addSelectValue=function(){
		var flag = true;
		var vl = $scope.model.selectValue;
		for (var i=0;i<$scope.options.length;i++){
			if (vl == $scope.options[i].value || isEmpty(vl)) {
				flag = false;
				break;
			}
		}
		if (flag && !isEmpty(vl)) {			
			var op={value:vl,label:vl};
			$scope.options.push(op);
			$scope.model.optionsSelectValue = vl;
		}
	};
	$scope.modifySelectValue = function(){
		if (isEmpty($scope.model.selectValue)){
			return;
		}
		if (angular.isArray($scope.options) && $scope.options.length > 0){
			for (var i = 0; i < $scope.options.length; i++){
				if ($scope.model.optionsSelectValue == $scope.options[i].value){
					$scope.options[i] = {value: $scope.model.selectValue, label: $scope.model.selectValue};
					break;
				}
			}
			$scope.model.optionsSelectValue = $scope.model.selectValue;
		}
	};
	$scope.removeSelectValue=function(){
		var sv = $scope.model.optionsSelectValue;
		if (isEmpty(sv)){
			return;
		}
		for (var i=0;i<$scope.options.length;i++){
			if (sv == $scope.options[i].value) {
				$scope.options.splice(i,1); //同shift 
				break;
			}
		}
		$scope.model.optionsSelectValue = undefined;
	};
	$scope.moveUpSelectValue = function(){
		var sv = $scope.model.optionsSelectValue;
		if (isEmpty(sv)){
			return;
		}
		for (var i=0;i<$scope.options.length;i++){
			if (sv == $scope.options[i].value) {
				var index = i;
				break;
			}
		}
		if (angular.isUndefined(index) || index == 0 || index >= $scope.options.length){
			return;
		}
		var obj = angular.copy($scope.options[i]);
		$scope.options[i] = angular.copy($scope.options[i-1]);
		$scope.options[i-1] = obj;
		if (!$scope.$$phase){
			$scope.$apply();
		}
	};
	$scope.moveDownSelectValue = function(){
		var sv = $scope.model.optionsSelectValue;
		if (isEmpty(sv)){
			return;
		}
		for (var i=0;i<$scope.options.length;i++){
			if (sv == $scope.options[i].value) {
				var index = i;
				break;
			}
		}
		if (angular.isUndefined(index) || index >= $scope.options.length - 1){
			return;
		}
		var obj = angular.copy($scope.options[i]);
		$scope.options[i] = angular.copy($scope.options[i+1]);
		$scope.options[i+1] = obj;
		if (!$scope.$$phase){
			$scope.$apply();
		}
	};
	$scope.defaultSelectValue = function(){
		var sv = $scope.model.optionsSelectValue;
		if (isEmpty(sv)){
			return;
		}
		if (angular.isArray(sv)){
			$scope.model.defaultValue = sv[0];
		} else {
			$scope.model.defaultValue = sv;
		}
		
	}
	// initData
});
//=============================================================================================
// 云硬盘电子流
//=============================================================================================
routeApp.controller('WorkflowDiskCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService, WorkflowService){
	$scope.model ={};
	$scope.levels = {
			statusOptions:[ {value:0,label:$translate.instant('workflow.wating')},{value:1,label:$translate.instant('workflow.pass')},
			                {value:2,label:$translate.instant('workflow.refuse')},{value:3,label:$translate.instant('workflow.all')}]
	};
	$scope.model.status = 0;
	
	///-------数据查询---------/////
	var params = {conditions:"",isFlow:"isFlow"};
	var url = 'workflow/queryDisks';
	var workflowStatus='<div class="ngCellText" ng-class="col.colIndex()">' +
		    '<span ng-if= \'row.entity.state == 0\' class="" translate="workflow.pendingApproval"></span>' +
		    '<span ng-if= \'row.entity.state == 1\' class="" translate="workflow.pass"></span>' +
		    '<span ng-if= \'row.entity.state == 2\' class="" translate="workflow.refuse"></span>' +
		    '<span ng-if= \'row.entity.state == 4\' class="" translate="workflow.pending"></span>' +
		    '<span ng-if= \'row.entity.state == 5\' class="" translate="workflow.implementing"></span></div>' ;
	var operationTemplate = '<div><div class="ngCellButton">'
   	 		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 0 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="CLOUDDISKFLOW_HANDLE" custom-title="{{\'workflow.diskImplement\'|translate}}"></div>'
   	 		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 4 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="CLOUDDISKFLOW_HANDLE" custom-title="{{\'workflow.diskImplement\'|translate}}"></div>'
   	 		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 5 && row.entity.implement" ng-click="implement(row.entity)" custom-title="{{\'workflow.diskImplement\'|translate}}"></div>'
   	 		+'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" ng-click="viewWorkflow(row.entity)" custom-title="{{\'common.view\'|translate}}" has-permission="CLOUDDISKFLOW_VIEW"></div>'
   	 		+'</div></div>';
	var column = [
	              { field: 'name', displayName:$translate.instant('workflow.diskName'), sortable: true, width:'10%',cellTemplate:titleTemplate},
	              { field: 'userName', displayName:$translate.instant('licenseMng.userName'), sortable: true, width:'10%'},
	              { field: 'state', displayName:$translate.instant('common.state'), sortable: true, width:'10%', cellTemplate:workflowStatus},
	              { field: 'capacity', displayName:$translate.instant('host.capacity'), sortable: true, width:'10%', cellTemplate:'<div><div class="ngCellText">{{row.entity.capacity}}GB</div></div>'},
	              { field:"reason", displayName:$translate.instant("workflow.reason"), width:"22%", cellTemplate:titleTemplate},
				  { field:"createDate", displayName:$translate.instant("workflow.applyTime"), width:"15%"},
				  { field:"handleDate", displayName:$translate.instant("workflow.impTime"), width:"15%"},
	              { field: 'eventDesc', displayName:$translate.instant('common.oper'), sortable:false, width:'8%', cellTemplate:operationTemplate}
	              ];
	$scope = GridService.grid($scope, url, params, null, null, "diskWorkflowDiv");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
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
	$scope.listStyle = $scope.gridStyle(-15);
	listenNavClick($scope, $timeout, -15);
	//查询
	$scope.query = function() {
		if (angular.isDefined($scope.params)) {			
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		} else {
			$scope.params = {};
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		}
	};
	$scope.$watch('model.status', function(newVal, oldVal) {
		$scope.pagingOptions.currentPage = 1;
		$scope.query();
	});
	$scope.$on(constant.onReloadDiskWorkFlowList, function (event, msg) {
		$scope.refresh();
	});
	
	$scope.refresh = function(){
		$scope.query();
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
	}
	//动态控制grid的宽和高
	// DEL
	var callback = function(){
    	$scope.query();
    };
	$scope.delWorkflows = function() {
    	if(!$scope.mySelections || $scope.mySelections.length == 0){
    		UtilService.error($translate.instant("workflow.delSelectAlert"),$translate.instant("common.opertip"));
    		return;
    	}else{
    		for(var i = 0; i < $scope.mySelections.length; i++){
				if ($scope.mySelections[i].state != 0) {
					UtilService.error($translate.instant("workflow.delDiskWorkflowAlert"),$translate.instant("common.opertip"));
		    		return;
				}
			}
    		var modalInstance = UtilService.confirm($translate.instant('workflow.delConfirm'));
    		modalInstance.result.then(function (selectedItem) {
    			var queryStr = "";
    			for(var i = 0; i < $scope.mySelections.length; i++){
    				queryStr += "deleteIds=" + $scope.mySelections[i].id+"&";
    			}
    			queryStr = queryStr.substring(0, queryStr.length-1);
    			var d = new Date();
    			$scope.lastCheckTime = d.getTime();
    			HttpService.delete("workflow/delDisks?"+queryStr, undefined, undefined, callback);
    		}, function () {
    		});
    	}
	};
	$scope.handlerWorkflow = function(data) {
		data.workflowType = "disk";
		data.opType = "add";
		data.callBackQuery = $scope.query;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.viewWorkflow = function(data) {
		data.workflowType = "disk";
		data.opType = "view";
		data.callBackQuery = $scope.query;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.implement = function(data) {
		data.callBackQuery = $scope.query;
		WorkflowService.diskImplement(data);
	};
});
//=============================================================================================
// 用户预注册电子流
//=============================================================================================
routeApp.controller('WorkflowRegisterCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService,WorkflowService){
	$scope.model ={};
	$scope.levels = {
			statusOptions:[ {value:0,label:$translate.instant('workflow.wating')},{value:1,label:$translate.instant('workflow.pass')},
			                {value:2,label:$translate.instant('workflow.refuse')},{value:3,label:$translate.instant('workflow.all')}]
	};
	$scope.model.status = 0;
	///-------数据查询---------/////
	var params = {conditions: $scope.model.status,isFlow:"isFlow"};
	var url = 'workflow/queryRegisters';
	var workflowStatus='<div class="ngCellText" ng-class="col.colIndex()">' +
	    '<span ng-if= \'row.entity.state == 0\' class="" translate="workflow.pendingApproval"></span>' +
	    '<span ng-if= \'row.entity.state == 1\' class="" translate="workflow.pass"></span>' +
	    '<span ng-if= \'row.entity.state == 2\' class="" translate="workflow.refuse"></span>' +
	    '<span ng-if= \'row.entity.state == 4\' class="" translate="workflow.pending"></span>' +
	    '<span ng-if= \'row.entity.state == 5\' class="" translate="workflow.implementing"></span></div>' ;
	var operationTemplate = '<div><div class="ngCellButton">'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 0 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="USERREGISTERFLOW_HANDLE" custom-title="{{\'workflow.handleRegister\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 4 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="USERREGISTERFLOW_HANDLE" custom-title="{{\'workflow.handleRegister\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 5" ng-click="implement(row.entity)" custom-title="{{\'workflow.handleRegister\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" ng-click="viewWorkflow(row.entity)" custom-title="{{\'common.view\'|translate}}" has-permission="USERREGISTERFLOW_VIEW"></div>'
		+'</div></div>';
	var column = [
	              { field: 'loginName', displayName:$translate.instant('common.loginName'), sortable: true, width:'10%', cellTemplate:titleTemplate},
	              { field: 'userName', displayName:$translate.instant('licenseMng.userName'), sortable: true, width:'10%', cellTemplate:titleTemplate},
	              { field: 'state', displayName:$translate.instant('common.state'), sortable: true, width:'5%', cellTemplate:workflowStatus},
	              { field: 'credentialNumber', displayName:$translate.instant('workflow.credentialNumber'), sortable: true, width:'10%', cellTemplate:titleTemplate},
	              { field: 'email', displayName: "E-mail", sortable: true, width:'15%', cellTemplate:titleTemplate},
	              { field: 'phone', displayName:$translate.instant('workflow.phone'), sortable: true, width:'15%', cellTemplate:titleTemplate},
	              { field: 'address', displayName:$translate.instant('workflow.address'), sortable: true, width:'25%', cellTemplate:titleTemplate},
	              { field: 'eventDesc', displayName:$translate.instant('common.oper'), sortable:false, width:'10%', cellTemplate:operationTemplate}
	              ];
	$scope = GridService.grid($scope, url, params, null, null, "registerWorkflowDiv");
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
	//查询
	$scope.query = function() {
		if (angular.isDefined($scope.params)) {			
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		} else {
			$scope.params = {};
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		}
	};
	$scope.$watch('model.status', function(newVal, oldVal) {
		$scope.pagingOptions.currentPage = 1;
		$scope.query();
	});
	//动态控制grid的宽和高
	$scope.listStyle = $scope.gridStyle(-5);
	listenNavClick($scope, $timeout, -5);
	$scope.$on(constant.onReloadRegisterWorkFlowList, function (event, msg) {
		$scope.refresh();
	});
	$scope.refresh = function(){
		$scope.query();
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
	}
	// DEL
	var callback = function(){
    	$scope.query();
    };
	$scope.delWorkflows = function() {
    	if(!$scope.mySelections || $scope.mySelections.length == 0){
    		UtilService.error($translate.instant("workflow.delSelectAlert"),$translate.instant("common.opertip"));
    		return;
    	}else{
    		for(var i = 0; i < $scope.mySelections.length; i++){
				if ($scope.mySelections[i].state != 0) {
					UtilService.error($translate.instant("workflow.delDiskWorkflowAlert"),$translate.instant("common.opertip"));
		    		return;
				}
			}
    		var modalInstance = UtilService.confirm($translate.instant('workflow.delConfirm'));
    		modalInstance.result.then(function (selectedItem) {
    			var queryStr = "";
    			for(var i = 0; i < $scope.mySelections.length; i++){
    				queryStr += "deleteIds=" + $scope.mySelections[i].id+"&";
    			}
    			queryStr = queryStr.substring(0, queryStr.length-1);
    			var d = new Date();
    			$scope.lastCheckTime = d.getTime();
    			HttpService.delete("workflow/delRegisters?"+queryStr, undefined, undefined, callback);
    		}, function () {
    		});
    	}
	};
	$scope.handlerWorkflow = function(data) {
		data.workflowType = "register";
		data.opType = "add";
		data.callBackQuery = $scope.query;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.viewWorkflow = function(data) {
		data.workflowType = "register";
		data.opType = "view";
		data.callBackQuery = $scope.query;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.implement = function(data) {
		data.callBackQuery = $scope.query;
		WorkflowService.registerImplement(data);
	};
});

//=============================================================================================
//云备份电子流
//=============================================================================================
routeApp.controller('WorkflowBackupCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, HttpService,GridService,WorkflowService){
	$scope.model ={};
	$scope.levels = {
		statusOptions:[ {value:0,label:$translate.instant('workflow.wating')},{value:1,label:$translate.instant('workflow.pass')},
		                {value:2,label:$translate.instant('workflow.refuse')},{value:3,label:$translate.instant('workflow.revoke')},
		                {value:4,label:$translate.instant('workflow.all')}]
	};
	$scope.model.status = 0;
	///-------数据查询---------/////
	var params = {conditions:$scope.model.status};
	var url = 'workflow/queryBackups';
	var workflowStatus='<div class="ngCellText" ng-class="col.colIndex()">' +
	    '<span ng-if= \'row.entity.state == 0\' translate="workflow.pendingApproval"></span>' +
	    '<span ng-if= \'row.entity.state == 10\' translate="workflow.pass"></span>' +
	    '<span ng-if= \'row.entity.state == 20\' translate="workflow.refuse"></span>' +
	    '<span ng-if= \'row.entity.state == 30\' translate="workflow.revoke"></span>' +
	    '<span ng-if= \'row.entity.state == 40\' translate="workflow.pending"></span>' +
	    '<span ng-if= \'row.entity.state == 50\' translate="workflow.implementing"></span></div>' ;
	var operationTemplate = '<div><div class="ngCellButton">'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 0 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="CLOUDBACKUPSTRATEGY_HANDLE" custom-title="{{\'workflow.backupImplement\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 40 && row.entity.isHandler" ng-click="handlerWorkflow(row.entity)" has-permission="CLOUDBACKUPSTRATEGY_HANDLE" custom-title="{{\'workflow.backupImplement\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-task-manage-gray" ng-if="row.entity.state == 50 && row.entity.implement" ng-click="implement(row.entity)" custom-title="{{\'workflow.backupImplement\'|translate}}"></div>'
		+'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" ng-click="viewWorkflow(row.entity)" has-permission="CLOUDBACKUPSTRATEGY_VIEW" custom-title="{{\'common.view\'|translate}}" ></div>'
		+'</div></div>';
	var column = [
	              { field: 'name', displayName:$translate.instant('workflow.backupStName'), sortable: true, width:'10%',cellTemplate:titleTemplate},
	              { field: 'userName', displayName:$translate.instant('licenseMng.userName'), sortable: true, width:'10%'},
	              { field: 'desc', displayName:$translate.instant('common.desc'), sortable: true, width:'10%',cellTemplate:titleTemplate},
	              { field: 'timePeriod', displayName:$translate.instant('workflow.timePeriod'), sortable: true, width:'10%'},
	              { field: 'state', displayName: $translate.instant('common.state'), sortable: true, width:'10%', cellTemplate:workflowStatus},
				  { field: 'suggestion', displayName:$translate.instant("workflow.reason"), width:"14%", cellTemplate:titleTemplate},
				  { field: 'createDate', displayName:$translate.instant("workflow.applyTime"), width:"13%"},
				  { field: 'handleDate', displayName:$translate.instant("workflow.impTime"), width:"13%"},
	              { field: 'eventDesc', displayName: $translate.instant('common.oper'), sortable:false, width:'10%', cellTemplate:operationTemplate}
	              ];
	$scope = GridService.grid($scope, url, params, null, null, "backupWorkflowDiv");
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
	//查询
	$scope.query = function() {
		if (angular.isDefined($scope.params)) {			
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		} else {
			$scope.params = {};
			$scope.params.conditions = $scope.model.status;
			$scope.refreshPage();
		}
	};
	$scope.$watch('model.status', function(newVal, oldVal) {
		$scope.pagingOptions.currentPage = 1;
		$scope.query();
	});
	//动态控制grid的宽和高
	$scope.listStyle = $scope.gridStyle(-5);
	listenNavClick($scope, $timeout, -5);
	$scope.$on(constant.onReloadBackupWorkFlowList, function (event, msg) {
		$scope.refresh();
	});
	$scope.refresh = function(){
		$scope.query();
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
	}
	// DEL
	var callback = function(){
    	$scope.query();
    };
	$scope.delWorkflows = function() {
    	if(!$scope.mySelections || $scope.mySelections.length == 0){
    		UtilService.error($translate.instant("workflow.delSelectAlert"),$translate.instant("common.opertip"));
    		return;
    	}else{
    		for(var i = 0; i < $scope.mySelections.length; i++){
				if ($scope.mySelections[i].state != 0 && $scope.mySelections[i].state != 30) {
					UtilService.error($translate.instant("workflow.delVmWorkflowAlert"),$translate.instant("common.opertip"));
		    		return;
				}
			}
    		var modalInstance = UtilService.confirm($translate.instant('workflow.delConfirm'));
    		modalInstance.result.then(function (selectedItem) {
    			var queryStr = "";
        		for(var i = 0; i < $scope.mySelections.length; i++){
        			queryStr += "deleteIds=" + $scope.mySelections[i].id+"&";
        		}
        		queryStr = queryStr.substring(0, queryStr.length-1);
        		var d = new Date();
        		$scope.lastCheckTime = d.getTime();
        		HttpService.delete("workflow/delBackups?"+queryStr, undefined, undefined, callback);
    		}, function () {
    		});
    	}
	};
	$scope.handlerWorkflow = function(data) {
		data.workflowType = "backup";
		data.opType = "add";
		data.callBackQuery = $scope.query;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.viewWorkflow = function(data) {
		data.workflowType = "backup";
		data.opType = "view";
		data.callBackQuery = $scope.query;
		WorkflowService.handlerWorkflow(data);
	};
	$scope.implement = function(data) {
		data.callBackQuery = $scope.query;
		WorkflowService.backupImplement(data);
	};
});
routeApp.controller('WorkflowCommonCtrl',function(data, fields, $scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService,WorkflowService){
	$scope.model=data;
	$scope.moreInfo = [];
	$scope.isMoreInfoExistent = false;
	if (fields.length > 0) {
	    $scope.isMoreInfoExistent = true;
	}
	for (var i = 0; i < fields.length; i++) {
	    var po = {};
        po.name = fields[i].fieldName + ":";
        po.value = data[fields[i].columnName];
        $scope.moreInfo.push(po);
	}
	$scope.model.handleResult = 1;
	var vmTitleStr = ""
	if (data.vmTitles && data.vmTitles.length) {
		for (var i=0; i < data.vmTitles.length; i++) {
			vmTitleStr += data.vmTitles[i] + ",";
		}
		vmTitleStr = vmTitleStr.substring(0, vmTitleStr.length - 1);
	}
	$scope.model.vmTitleStr = vmTitleStr;
	var workflowId = 0;
	if (data.workflowType == "vm") {
		workflowId = 1;
		$http({
			method : "GET",
			url : "workflow/vmworkflow/status",
			params : {id : data.id}
		}).success(function(result){
			if (!result.success){
				$modalInstance.dismiss("cancel");
				UtilService.handleResult(result);
				data.callBackQuery();
				
			}
		});
		//修改问题单:201708040440   虚拟机电子流审批显示磁盘大小
		if (data.type == 1) {//模板申请时
		    $http({
	            method : "GET",
	            url : "domain/" + data.domainId,
	            params : {}
	        }).success(function(result){
	            if (result.success){
	                //虚拟机查询结果的磁盘单位时MB
	                $timeout(function() {
	                    $scope.cloudType = result.data ? result.data.cloudType : 2;
	                    $scope.diskSize = result.data ? result.data.storageCapacity : 0;         
	                });	                           
	            } else {
	                UtilService.handleResult(result);
	            }
	        });
		} else if (data.type == 3) {//自定义申请虚拟机
		    $scope.diskSize = $scope.model.storage;//单位时GB
		}		
	} else if (data.workflowType == "disk") {
		workflowId = 2;
	} else if (data.workflowType == "register") {
		workflowId = 3;
	} else if (data.workflowType == "backup") {
		workflowId = 4;
	}
	$scope.workflowId = workflowId;
	$scope.ok = function () {
		var param = {
			id:data.id,
			workflowId:workflowId,
			entrustOpId:$scope.model.entrustOpId,
			entrustOpName:$scope.model.entrustOpName,
			handleResult:$scope.model.handleResult,
			handleReason:$scope.model.handleReason
		};
		var callBack = function(result) {
			if (angular.isDefined(result) && result.state == '0' && result.data == 3) {
				switch (workflowId) {
				case 1:					
					WorkflowService.vmImplement(data);
					break;
				case 2:					
					WorkflowService.diskImplement(data);
					break;
				case 3:
					WorkflowService.registerImplement(data);
					break;
				case 4:
					WorkflowService.backupImplement(data);
					break;
				}
			}
			if (angular.isDefined(result) && result.state != '1') {				
			data.callBackQuery();
		}
		}
		HttpService.put('workflow/handleWorkflow', param, $modalInstance, callBack, data.callBackQuery);
	};
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    var url = "workflow/queryWorkflowInfoById";
	$http({
		method:"GET",
		url: url,
		params: {id:data.id, workflowId:workflowId}
	}).success(function(result){
		if (result && result.success) {	
			$scope.myData = result.data;
		} else {
			UtilService.handleResult(result);
			data.callBackQuery();
			$modalInstance.dismiss("cancel");
		}
	});
    $scope.gridOptions = WorkflowService.handleWorkflowInfo();
//	$scope.listStyle = $scope.gridStyle(-5);
    //回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	
	// 选择操作员
	$scope.selectSingleOperator = function() {
		var param = {};
		param.enable = 1;
		param.workflowId = workflowId;
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
			if(angular.isDefined(selectItem) && selectItem!="cancel"){
				$scope.model.entrustOpId = selectItem[0].id;
				$scope.model.entrustOpName = selectItem[0].userName;
				$scope.opName = selectItem[0].userName;
			}
		},function(reason){
		});
	};
});

routeApp.controller('WorkflowCtrlAuth',function($scope, $state, $http, $location, $modal, $timeout, $translate, UtilService, HttpService,GridService,WorkflowService){
	var data = {};
	data = $scope.model;
	$scope.moreInfo = [];
	$scope.isMoreInfoExistent = false;
	var fields = $scope.fields;
	if (fields.length > 0) {
	    $scope.isMoreInfoExistent = true;
	}
	for (var i = 0; i < fields.length; i++) {
	    var po = {};
        po.name = fields[i].fieldName + ":";
        po.value = data[fields[i].columnName];
        $scope.moreInfo.push(po);
	}
	$scope.model.handleResult = 1;
	var workflowId = 0;
	if (data.workflowType == "vm") {
		workflowId = 1;
		$http({
			method : "GET",
			url : "workflow/vmworkflow/status",
			params : {id : data.id}
		}).success(function(result){
			if (!result.success){
				UtilService.handleResult(result);
				data.callBackQuery();
			}
		})
	} else if (data.workflowType == "disk") {
		workflowId = 2;
	} else if (data.workflowType == "register") {
		workflowId = 3;
	} else if (data.workflowType == "backup") {
		workflowId = 4;
	}
	$scope.workflowId = workflowId;
	$scope.ok = function () {
		var param = {
			id:data.id,
			workflowId:workflowId,
			entrustOpId:$scope.model.entrustOpId,
			entrustOpName:$scope.model.entrustOpName,
			handleResult:$scope.model.handleResult,
			handleReason:$scope.model.handleReason
		};
		var callBack = function(result) {
		  if (angular.isDefined(result)) {
			  var params = {};
			  params.id = $scope.appId;
			  if ($scope.appType == 1){
	    		  $http({method:'GET', url:'workflow/queryVmWorkflows' , params : params})
	    		  .success(function(result) {
	    			  var data = {}; 
	    			  data = result.data[0];
	    			  if (data.isHandler) {
	    				  data.opType = "add";
	    			  } else {
	    				  data.opType = "view";
	    			  }
	    			  data.workflowType = "vm"
	    			  $scope.model = data;
	    			  $scope.getGridInfo();
	    	      });
			  } else if ($scope.appType == 2) {
	    		  $http({method:'GET', url:'workflow/queryDisks' , params : params})
	    		  .success(function(result) {
	    			  var data = {}; 
	    			  data = result.data[0];
	    			  data.workflowType = "disk"
					  if (data.isHandler) {
	    				  data.opType = "add";
	    			  } else {
	    				  data.opType = "view";
	    			  }
	    			  $scope.model = data;
	    			  $scope.getGridInfo();
	    	      });
			  } else if ($scope.appType == 3) {
	    		  $http({method:'GET', url:'workflow/queryRegisters' , params : params})
	    		  .success(function(result) {
	    			  var data = {}; 
	    			  data = result.data[0];
					  if (data.isHandler) {
	    				  data.opType = "add";
	    			  } else {
	    				  data.opType = "view";
	    			  }
	    			  data.workflowType = "register"
	    			  $scope.model = data;
	    			  $scope.getGridInfo();
	    	      });
			  } else if ($scope.appType == 4) {
	    		  $http({method:'GET', url:'workflow/queryBackups' , params : params})
	    		  .success(function(result) {
	    			  var data = {}; 
	    			  data = result.data[0];
	    			  if (data.isHandler) {
	    				  data.opType = "add";
	    			  } else {
	    				  data.opType = "view";
	    			  }
	    			  data.workflowType = "backup"
	    			  $scope.model = data;
	    			  $scope.getGridInfo();
	    	      });
			  }
		  }
		}
		HttpService.put('workflow/handleWorkflow', param, undefined, callBack);
	};
   
	
	$scope.getGridInfo = function () {
		var url = "workflow/queryWorkflowInfoById";
		$http({
			method:"GET",
			url: url,
			params: {id:data.id, workflowId:workflowId}
		}).success(function(result){
			if (result && result.success) {	
				$scope.myData = result.data;
			} else {
				UtilService.handleResult(result);
				data.callBackQuery();
			}
		});
	    $scope.gridOptions = WorkflowService.handleWorkflowInfo();
	}
	
	$scope.getGridInfo();
    
//	$scope.listStyle = $scope.gridStyle(-5);
    //回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	
	// 选择操作员
	$scope.selectSingleOperator = function() {
		var param = {};
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
			if(angular.isDefined(selectItem) && selectItem!="cancel"){
				$scope.model.entrustOpId = selectItem[0].id;
				$scope.model.entrustOpName = selectItem[0].userName;
				$scope.opName = selectItem[0].userName;
			}
		},function(reason){
		});
	};
	
});

//=============================================================================================
// 申请空的虚拟机 电子流部署
//=============================================================================================
routeApp.controller('VmImplementCtrl',function(data, $scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService){
	$scope.stepTitles = [$translate.instant('baseinfo'), $translate.instant("common.configInfo"),$translate.instant('workflow.extendField')];
	$scope.memoryUnit = [{value:'MB',label:"MB"},{value:'GB',label:'GB'}];
	$scope.stUnit = [{value:'MB',label:"MB"},{value:'GB',label:'GB'},{value:'TB',label:'TB'}];
	$scope.fileFormatList = [{value:0,label:$translate.instant('storagePool.qcow2')},{value:1,label:$translate.instant('storagePool.raw')}];
	var vmData = angular.copy(data);
	$scope.model = vmData;
	$scope.domainUrl = "domain/nameExist?publicCloudId=" + data.publicCloudId; 
	$scope.cloudId = data.publicCloudId; 
	$scope.clusters = [];
	$scope.virDesks = [];
	$scope.model.virDeskNum = 0;
	$scope.model.deployType = false;
//	$scope.model.firewallName = data.firewallName;
//	$scope.model.firewallUUid = data.firewallUUid;
	$scope.defineFields = [];
	$scope.isDefineField = false;
	$scope.deployInfo ={};
	$scope.enableAdjustSetting = 1;
	//修改问题:201612230243 ssv申请到期时间,审批部署不显示问题. -w10450
    if (data.expireDate) {
        $scope.initExpireDate = "true";
    }
	
	$scope.today = new Date();
	var subCallBack = function(result) {
		if (result.state != '0') {
			var param = getCommonParm();
			param.status = 12;
			$http.put('workflow/vmImplement', param);
		}
		if (angular.isFunction(data.callBackQuery)) {
			data.callBackQuery.apply(this,[result]);
		}
	}
	var getDeployPo = function() {
		var desktopPoolId;
		if ($scope.virDesks.length > 0) {
			desktopPoolId = $scope.virDesks[$scope.model.virDeskNum].id;
		}
		if (angular.isUndefined($scope.model.antivirusEnable)) {
			$scope.model.antivirusEnable = 0;
		}
		//网络信息
		var networks = [];
		if ($scope.showFormat) {			
			for( i = 0; i < $scope.myData1.length; i++){
				var netdata = $scope.myData1[i];
				var objnet = {
						"mac" : netdata.mac,
						"vSwitchName" :  netdata.vswitchName,
						"profileName" :  netdata.netProfileName
				};
				networks.push(objnet);
			}
		}
		return {
			id:$scope.model.templateId,
			vmTempName:$scope.templateName,
			desc:$scope.model.description,
			orgId:$scope.model.orgId,
			userIds:[$scope.model.userId],
			desktopPoolId:desktopPoolId,
			resourcePoolId:$scope.resourcePoolId,
			expireDateStr:$scope.model.expireDate,
			workFlowId:$scope.model.id,
			domainName:$scope.model.domainName,
			title:$scope.model.title,   
			deployMode:$scope.model.deployMode ? 1 : 0,
			targetClusterId:$scope.model.clusterId,
		    cpuSocket:$scope.model.cpuSockets,
		    cpuCore:$scope.model.cpuCores,
		    memoryInit:$scope.model.memoryInit,
			memoryUnit:$scope.model.memoryUnit,
			storagePoolName: $scope.model.storagePoolName,
			networks:networks,
			antivirusEnable: $scope.model.antivirusEnable
		};
	}
	var deployDomain = function() {// 通过模板部署虚拟机
		var param = getDeployPo();
		HttpService.post('domain/deploy', param, $modalInstance, subCallBack);
	}
	var addOrgDomain = function() {// 增加虚拟机
		var param = getAddDomainPo();
		HttpService.post('domain/addOrgDomain', param, $modalInstance, subCallBack);
	}
	var getAddDomainPo = function() {
		var desktopPoolId;
		if ($scope.virDesks.length > 0) {
			desktopPoolId = $scope.virDesks[$scope.model.virDeskNum].id;
		}
		var capacity = 0;
		if ("GB" == $scope.model.storageUnit) {
			capacity = $scope.model.storageInit * 1024;
		} else if ("TB" == $scope.model.storageUnit) {
			capacity = $scope.model.storageInit * 1024 * 1024;
		} else {
			capacity = $scope.model.storageInit;
		}
		var driveType = "qcow2";
		if ($scope.model.fileFormatNum == 1) {
			driveType = "raw";
		}
		if (angular.isUndefined($scope.model.antivirusEnable)) {
			$scope.model.antivirusEnable = 0;
		}
		return {
			orgId:$scope.model.orgId,
			desktopPoolId:desktopPoolId,
			resourcePoolId:$scope.resourcePoolId,
			expireDate:$scope.model.expireDate,
			workFlowId:$scope.model.id,
			domainName:$scope.model.domainName,
			title:$scope.model.title,  
			desc:$scope.model.description,
			clusterId:$scope.model.clusterId,
		    cpuSocket:$scope.model.cpuSockets,
		    cpuCore:$scope.model.cpuCores,
		    memoryInit:$scope.model.memoryInit,
			memoryUnit:$scope.model.memoryUnit,
			osVersion:$scope.model.osVersion,
			storeFile:$scope.model.filename,
			driveType:driveType,
		    capacity:capacity,
		    profileName:$scope.model.profileName,
		    vswitchName:$scope.model.vswitchName,
		    storagePoolName: $scope.model.storagePoolName,
		    antivirusEnable: $scope.model.antivirusEnable
		};
	}
	var getCommonParm = function() {
		var desktopPoolId;
		if ($scope.virDesks.length > 0) {
			desktopPoolId = $scope.virDesks[$scope.model.virDeskNum].id;
		}
		var type = $scope.model.deployType==true ? 1:3;
		return {
				title:$scope.model.title,  
				type:type,
				handleReason:$scope.model.reason,
				desktopPoolId:desktopPoolId,
				expireDateStr:$scope.model.expireDate,
				id:$scope.model.id
		};
	}
	var getvmWorkflowAppend = function() {
		if ($scope.isDefineField) {			
			var workflowAppends = {};
			for (var i = 0;i <$scope.defineFields.length;i++ ) {
				var cname = $scope.defineFields[i].columnName.toLowerCase();
				cname = cname.replace("_","");
				workflowAppends[cname] = $scope.defineFields[i].value;
			}
			return workflowAppends;
		}
	}
	
	$scope.ok = function () {
		if (!$scope.checkCPU()) {
    		return;
    	}
		var param = getCommonParm();
		param.status = 2;
		if ($scope.model.deployType==true) {
			param.domainDeployPo = getDeployPo();
		} else {			
			param.addDomainPo = getAddDomainPo();
		}
		param.vmWorkflowAppend = getvmWorkflowAppend();
		
		
		var waitModal = UtilService.wait();
		$http.put('workflow/vmImplement', param).success(function(result) {
      		waitModal.dismiss();
      		UtilService.handleResult(result);
      		//confirm对话框没有$modalInstance对象
      		if (result.success) {
      			if ($scope.model.deployType==true) {
					deployDomain();// 通过模板部署虚拟机
				} else {
					addOrgDomain();// 增加新的虚拟机
				}
      		}
        }).error(function(response, code, headers, config) {
        		waitModal.dismiss();
        		UtilService.handleError(code);
        })
	};
	//这2个是常量，到时候提取到全局的或者常量中
    $scope.windowsList = getWindowsVersions($translate);
    $scope.linuxList = getLinuxVersions($translate);
    $scope.osList = $scope.windowsList;
    //操作系统选择,这里还有watch函数。因为使用ng-checked有问题，操作系统列表选择后会再次触发ng-checked事件，导致死循环
    $scope.$watch('model.system', function() {
        if ($scope.model.system == "0") {
            $scope.osList = $scope.windowsList;
            if ($scope.model.osVersion.indexOf("Microsoft") < 0) {
            	$scope.model.osVersion = 'Microsoft Windows Server 2012';  //widows列表设置初始值
            }
        } else {
            $scope.osList = $scope.linuxList;
            if ($scope.model.osVersion.indexOf("Microsoft") > -1) {
            	$scope.model.osVersion = 'Red Hat Enterprise Linux 7(64-bit)'; //linux列表设置初始值
            }
        }
    });  
    $scope.deployVmWorkflowInfo = function(){
    	var url = "template/deployTemplateInfo";
    	$http({
    		method:"GET",
    		url: url,
    		params: {orgId:data.orgId}
    	}).success(function(result){
    		$scope.deployInfo = result.data;
    		$scope.deployInfo.resourcePoolOptions = [];
			if ($scope.deployInfo.resourcePools.length == 0){							
		        var modalInstance = UtilService.alert($translate.instant('org.unusableResourcePool'), $translate.instant('common.opertip'), false, 'error');
		        modalInstance.result.then(function () {
		        	$scope.cancel();
		        }, function () {
		        });
			}
			if (angular.isDefined($scope.deployInfo) && angular.isDefined($scope.deployInfo.resourcePoolOptions)) {
				var resourcePools = $scope.deployInfo.resourcePools;
				for (var i = 0 ; i < resourcePools.length; i++) {
					resourcePools[i].value = i;
					resourcePools[i].label = resourcePools[i].resourcePoolName;
					resourcePools[i].resourcePoolId = resourcePools[i].resourcePoolId;
					resourcePools[i].cloudId = resourcePools[i].cloudId;
				}
				$scope.deployInfo.resourcePoolOptions = resourcePools;
				$scope.model.resourcePoolNum = 0;
				$scope.enableAdjustSetting = result.data.enableAdjustSetting;
			}

    	});
    }
    $scope.$watch("model.resourcePoolNum", function(newValue, oldValue){
    	var i = newValue;
    	if (angular.isDefined(i) && newValue != oldValue){  
    		var resourcePool = $scope.deployInfo.resourcePoolOptions[i];
    		$scope.resourcePoolId = resourcePool.resourcePoolId;
    		$scope.cloudId = resourcePool.cloudId;
    		$scope.model.resourcePoolName = resourcePool.label;
    		$scope.maxCpu = resourcePool.clusterMaxCpu;
    		$scope.flag = resourcePool.cloudType;
        	$scope.clusterMaxMem = resourcePool.clusterMaxMem;
        	$scope.templateName = undefined;
        	$scope.model.templateId = undefined;
        	var params = {orgId:data.orgId,resourcePoolId:$scope.resourcePoolId};
        	params.assignMode = 1;
        	$scope.queryVirDeskInfo(params);
        	$scope.clearStorePool();
        	$scope.clearNetProfile();
        	$scope.clearVswitch();
        	if ($scope.showFormat) {
        		$scope.designatedFormat();
        	}
    	}
    });
    
    $scope.$watch("model.deployType",function(newValue, oldValue){
    	if (angular.isDefined(newValue)){  
    		if (newValue == 0) {
    			$scope.showFormat = false;
    			$scope.myData1 = undefined;
    		}
    	}   
	});
    
    $scope.$watch("model.memoryUnit", function(newValue, oldValue) {
    	if (newValue == 'MB'){
    		$scope.minMem = 512;
    		$scope.maxMem = $scope.clusterMaxMem;
    	} else if (newValue == 'GB'){
    		$scope.minMem = 1;
    		$scope.maxMem = UtilService.transformMBTOGB($scope.clusterMaxMem).toFixed(2);
    	}
    });
    // 获取虚拟桌面池
    $scope.queryVirDeskInfo = function(parms){
    	var url = "virDesk/list";
    	var pm = {conditions:parms};
    	$http({
    		method:"GET",
    		url: url,
    		params: pm //{orgId:data.orgId}
    	}).success(function(result){
    		$scope.virDesks.splice(0, $scope.virDesks.length);
    		$scope.virDesks.push({value:0,label:" -- "});
    		if (result && result.data && result.data.length > 0) {
    			for (var i=0;i<result.data.length;i++) { 
    				result.data[i].value = i + 1;
    				result.data[i].label = result.data[i].name;
    				$scope.virDesks.push(result.data[i]);
    			}
    		}
    	});
    }
    
    $scope.$watch("model.virDeskNum", function(newValue, oldValue){
    	if (newValue != 0 ){
    		$scope.model.storageName = $scope.virDesks[$scope.model.virDeskNum].storageTitle;
    	} else {
    		$scope.model.storageName = undefined;
    	}
    });
    
    // 获取扩展字段
    $scope.queryDefineField = function(parms){
    	var url = "workflow/queryDefineField";
    	$http({
    		method:"GET",
    		url: url
    	}).success(function(result){
    		if (result && result.state == 0 && result.data.length > 0) {
    			$scope.defineFields = result.data;
    			for (var i = 0;i<result.data.length;i++) {
    				result.data[i].value = $scope.model[result.data[i].columnName];
    			}
    			$scope.isDefineField = true;
    		}
    	});
    }
	//form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true")
                return true;
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
        }
    };
    $scope.stepIndex = 0;
    $scope.nextCallBack = {
    		"1" : function() {
    			$scope.stepIndex = 1;
    		},
    		"2" : function(){
    			$scope.stepIndex = 2;
    			return $scope.checkCPU();
    		}
    }
    $scope.checkCPU = function(){
    	if (!isEmpty($scope.model.cpuSockets) && !isEmpty($scope.model.cpuCores)) {    		
    		var num = $scope.model.cpuSockets * $scope.model.cpuCores;
    		if (num > constant.VM_CPU_MAX_NUM2){
    			UtilService.error($translate.instant("virdesk.cpuMax128"));
    			return false;
    		}
    		if (!isEmpty($scope.maxCpu)) {    			
    			if (num > $scope.maxCpu){
        			UtilService.error($translate.instant("virdesk.deployCpuMax",{value:$scope.maxCpu}),$translate.instant("template.deploy"));
        			return false;
        		}
    		}
    	}
		return true;
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
    $scope.enter = function(ev) {
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.selectTemplate = function () {
		var params = {orgId:data.orgId,resourcePoolId:$scope.resourcePoolId};
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"SelectSingleTemplateCtrl",
			resolve: {
				params: function () {
                    return params;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				if ($scope.model.templateId != selectedItem[0].id) {
					$scope.templateName = selectedItem[0].domainName;
					$scope.model.templateId = selectedItem[0].id;
					if ($scope.showFormat) { 
						$scope.designatedFormat();
					}
				} 
			}
		},function(reason){
		});
	}
	// 获取初始化信息
	$scope.deployVmWorkflowInfo();
	$scope.queryDefineField();
	if ($scope.model.osVersion.indexOf("Microsoft") > -1) {
		$scope.model.system = "0";
	} else {
		$scope.model.system = "1";
	}
	$scope.model.storageInit = data.storage;
		
    $scope.advance = $translate.instant('migrateVm.showAdvance');
    //磁盘格式
    $scope.showFormat = false;
    $scope.designatedFormat = function() {
    	$scope.showFormat = !$scope.showFormat;
    	if ($scope.showFormat) {   
    		var detailUrl = 'template/details';
    		var detailParam = {
    	    		vmId:$scope.model.templateId,
    				orgId:$scope.model.orgId
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
            $scope.keyInterval = $timeout(function () {
                if ($scope.vswitchs != undefined){
                	showNetwork();
                	$timeout.cancel($scope.keyInterval);
                }
            }, constant.keyInterval);   
            function showNetwork () {           	
            	for (var i = 0; i < $scope.myData1.length; i ++) {
            		for (var j = 0; j < $scope.vswitchs.length; j++){
            			if ($scope.myData1[i].name == $scope.vswitchs[j].name  && $scope.vswitchs[j].isExist) {
            				$scope.myData1[i].vswitchName = $scope.myData1[i].name;
            				$scope.myData1[i].noVswitchValue = false;
            				break;
            			}
            		}
            		$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            		/*资源池网络策略模板删除for (var k = 0; k < $scope.profiles.length; k++){
            			if($scope.myData1[i].profileName == $scope.profiles[k].name && $scope.profiles[k].isExist){
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
	
	// 选择网络策略模板
	$scope.selectNetProfile = function (row){
		var resolve = {
		        inputParam: function() {
                    var inputParam = {};
                    inputParam.cloudId = $scope.cloudId;                                       
                    return inputParam;
                }
	        };
		var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
		profileInstance.result.then(function (selectedItem) {
			if(angular.isDefined(selectedItem)){
				if ($scope.showFormat) {
					row.netProfileName = selectedItem.name;
				} else{
					$scope.model.profileName = selectedItem.name;
				}			
			}
		}, function (reason) {
		});
	};
	
	$scope.clearNetProfile = function (){
		$scope.model.profileId = undefined;
		$scope.model.profileName = undefined;
	};
	
	// 选择虚拟交换机
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
			if(angular.isDefined(selectedItem)){
				if ($scope.showFormat) {
					row.vswitchName = selectedItem.name;
	        		row.noVswitchValue = false;  
				} else {
					$scope.model.vswitchName = selectedItem.name;
				}				
			}
		}, function (reason) {
		});
	};
	
	$scope.clearVswitch = function (){
		$scope.model.vswitchName = undefined;
	};
	
	$scope.clearNetAndProfile = function (){
		$scope.myData1 = undefined;
	};
	
	// 选择防火墙
//	$scope.selectFirewall = function (){
////		var resolve={
////				vswitch:function(){},
////				cloudId : function() {
////					return $scope.cloudId;
////				}
////		};
////		var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
////		profileInstance.result.then(function (selectedItem) {
////			if(angular.isDefined(selectedItem)){
////				$scope.model.firewallUUid = selectedItem.uuid;
////				$scope.model.firewallName = selectedItem.name;
////			}
////		}, function (reason) {
////		});
//	};
	
//	$scope.clearFirewall = function (){
//		$scope.model.firewallUUid = undefined;
//		$scope.model.firewallName = undefined;
//	};
	
	// 选择存储池
	$scope.selectStorePool = function (){
		var params = {resourcePoolId : $scope.resourcePoolId};
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
				$scope.model.storagePoolName = selectedItem[0].name;
				$scope.model.storageName = selectedItem[0].title;
/*				if (params.flag == constant.PUBLIC_CLOUD_CVM){
					$scope.model.storagePoolTitle = selectedItem[0].title;
				} */
				$scope.model.storagePath = selectedItem[0].path;
				$scope.model.storageType = selectedItem[0].type;
			}
		},function(reason){
		});
	};
	
	$scope.clearStorePool = function (){
		$scope.model.storagePoolName = undefined;
		$scope.model.storageName = undefined;
		$scope.model.storagePath = undefined;
		$scope.model.storageType = undefined;
		$scope.model.storagePoolTitle = undefined;
	};
});
//=============================================================================================
//Template 电子流模板部署
//=============================================================================================
routeApp.controller('VmDeployImplementCtrl',function(data, $scope, $state, $http, $location,$modal,$modalInstance, $translate, $timeout, UtilService, HttpService,GridService){
	$scope.title=$translate.instant("template.deploy");
    $scope.checkNameParam = {orgId:data.orgId};// 重名检测。
    $scope.domainUrl = "domain/nameExist?publicCloudId=" + data.publicCloudId; 
    $scope.cloudId = data.publicCloudId;
    $scope.today = new Date();
    $scope.tmp = {};
    $scope.tmp.fastDeploy = false;
    $scope.model = {
    		virDeskNum:0,
    		sysConfig:0,
    		id:data.domainId,
    		orgId:data.orgId,
    		domainName:data.domainName,
    		title:data.title,
    		deployType:2,
    		deployMode:0,
    		timezone:210,
//    		firewallName:data.firewallName,
//    		firewallUUid:data.firewallUUid,
    		cpuSocket:isEmpty(data.cpuSockets) ? 1 : data.cpuSockets,
    		cpuCore:isEmpty(data.cpuCores) ? 1 : data.cpuCores,
    		antivirusEnable:isEmpty(data.antivirusEnable) ? 0 : data.antivirusEnable
    };
    if (data.storage && data.storage > 0) {
        $scope.model.extendDiskCapacity = data.storage;
        $scope.showExtendDiskCapacity = true;
    }
    
    $scope.$watch("tmp.fastDeploy", function(){
    	if ($scope.tmp.fastDeploy == true) {
    		$scope.model.deployMode = 1;
    	} else {
    		$scope.model.deployMode = 0;
    	}
    })
    
    //修改问题:201612230243 ssv申请到期时间,审批部署不显示问题. -w10450
    if (data.expireDate) {
        $scope.initExpireDate = "true";
        $scope.model.expireDate = data.expireDate;
    }
    
    $scope.osInfo = {
    		initType:0,
    		sysIpType:1,
    		sysIp:data.ip,
    		sysMask:data.mask,
    		sysGateway:data.gateway,
    		sysdns:data.firstDns,
    		secondaryDns:data.secondDsn,
    		regOrGroupType:1
    }
    if (!isEmpty(data.ip)) {
    	$scope.osInfo.sysIpType = 2;
    	$scope.checkStaticIp = true
    } else {
        $scope.checkDhcp=true
    }
    $scope.regOrGroupType=1;
    $scope.system = 0;//0:Windows;1:Linux。
    $scope.stepTitles = [$translate.instant("workflow.basicInfo"),$translate.instant("workflow.configInfo"),$translate.instant('virdesk.loginInfo')];
    $scope.stepTitlesNo = [$translate.instant("workflow.basicInfo"),$translate.instant("workflow.configInfo")];
    $scope.stepTitlesOs = [$translate.instant("workflow.basicInfo"),$translate.instant("workflow.configInfo"),$translate.instant("workflow.systemInfo"),$translate.instant('virdesk.loginInfo')];
    $scope.stepTitlesNoEx = [$translate.instant("workflow.basicInfo"),$translate.instant("workflow.configInfo"),$translate.instant("workflow.extendField")];
    $scope.stepTitlesOsEx = [$translate.instant("workflow.basicInfo"),$translate.instant("workflow.configInfo"),$translate.instant("workflow.systemInfo"),$translate.instant('virdesk.loginInfo'),$translate.instant("workflow.extendField")];
    $scope.localgroupOptions = [{value:"Administrators",label:"Administrators"},{value:"Power Users",label:"Power Users"},{value:"Users",label:"Users"}];
    $scope.memoryUnit = [{value:'MB',label:"MB"},{value:'GB',label:'GB'}];
    $scope.clusters = [];
    $scope.virDesks = [];
    $scope.isDefineField = false;
    $scope.deployInfo ={};
    $scope.timezones = getTimezones($translate);
    $scope.valids = {
            stepOneOver : function() {
                if ($('#form1').val() === "true")
                    return true;
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
            },
            stepFiveOver : function() {
                if ($('#form5').val() === "true" )
                    return true;
                return false;
            }
    };
    $scope.stepIndex = 0;
    $scope.nextCallBack = {
    		"1" :function (){
    			$scope.stepIndex = 1;
    		},
    		"2" : function(){
    			$scope.stepIndex = 2;
    			return $scope.checkCPU();
    		},
    		"3" : function(){
    			$scope.stepIndex = 3;
    		},
    		"4" : function(){
                $scope.stepIndex = 4;
                if ($scope.isDefineField == true) {
                    //修改问题单:201701240135  计算机名和登录名相同,禁止提交.
                    if ($scope.model.sysConfig == true && $scope.osInfo.loginAccount == $scope.osInfo.sysName){
                        UtilService.error($translate.instant("virdesk.loginAccountSameError"), $translate.instant("template.deploy"));
                        return false;
                    }
                }
            }
    		
    };
    $scope.checkCPU = function(){
    	if (!isEmpty($scope.model.cpuSocket) && !isEmpty($scope.model.cpuCore)) {    		
    		var num = $scope.model.cpuSocket * $scope.model.cpuCore;
    		if (num > constant.VM_CPU_MAX_NUM2){
    			UtilService.error($translate.instant("virdesk.cpuMax128"));
    			return false;
    		}
    		if (!isEmpty($scope.maxCpu)) {    			
    			if (num > $scope.maxCpu){
        			UtilService.error($translate.instant("virdesk.deployCpuMax",{value:$scope.maxCpu}),$translate.instant("template.deploy"));
        			return false;
        		}
    		}
    	}
		return true;
    }
    $scope.deployVmWorkflowInfo = function() { 	
    	$http({
    		method:'GET',
    		url:'template/deployTemplateInfo',
    		params:{ id:data.domainId, orgId:data.orgId }
    	}).success(function(result) {
    		if (result.success) {    			
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
    				var resourcePools = $scope.deployInfo.resourcePools;
    				for (var i = 0 ; i < resourcePools.length; i++) {
    					resourcePools[i].value = i;
    					resourcePools[i].label = resourcePools[i].resourcePoolName;
    					resourcePools[i].resourcePoolId = resourcePools[i].resourcePoolId;
    					resourcePools[i].cloudId = resourcePools[i].cloudId;
    				}
    				$scope.deployInfo.resourcePoolOptions = resourcePools;
    				$scope.model.resourcePoolNum = 0;
    				if (isEmpty($scope.model.cpuSocket)){
    					$scope.model.cpuSocket = $scope.deployInfo.cpuSocket;
    				}
    				if (isEmpty($scope.model.cpuCore)){
    					$scope.model.cpuCore = $scope.deployInfo.cpuCore;
    				}
    				if (!isEmpty(data.memoryInit)){
    					$scope.model.memoryInit = data.memoryInit;
    				} else if (!isEmpty(data.memory)){
    					$scope.model.memoryInit = data.memory;
    				}
    				if (!isEmpty(data.memoryUnit)){
    					$scope.model.memoryUnit = data.memoryUnit;
    				} else {
    					$scope.model.memoryUnit = "MB";
    				}
    				
    				$scope.system = $scope.deployInfo.system;
    				$scope.flag = $scope.deployInfo.flag;
    				/*	if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE) {
    					$scope.model.isPublicCloud = $scope.deployInfo.isPublicCloud;
    				}
    				if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE){
    			    	$scope.initTip = $translate.instant("virdesk.vmwareInitTip");
    			    }*/
    			}
    			// 设置初始化数据
    			$scope.deployInfo.assignMode = 0;
    			$scope.enableAdjustSetting = $scope.deployInfo.enableAdjustSetting;
    		}
    		UtilService.handleResult(result);
    	}).error(function(response, code, headers, config) {
    		UtilService.handleError(code);
    	});
    };
    $scope.$watch("model.resourcePoolNum", function(newValue, oldValue){
    	var i = newValue;
    	if (angular.isDefined(i) && newValue != oldValue){  
    		var resourcePool = $scope.deployInfo.resourcePoolOptions[i];
    		$scope.resourcePoolId = resourcePool.resourcePoolId;
    		$scope.cloudId = resourcePool.cloudId;
    		$scope.model.resourcePoolName = resourcePool.label;
    		$scope.maxCpu = resourcePool.clusterMaxCpu;
        	$scope.clusterMaxMem = resourcePool.clusterMaxMem;
        	var params = {orgId:data.orgId,resourcePoolId:$scope.resourcePoolId};
        	params.assignMode = 1;
        	$scope.queryVirDeskInfo(params);
        	$scope.clearStorePool();
        	if ($scope.showFormat) {
        		$scope.designatedFormat();
        	}
    	}
    });
    $scope.$watch("model.deployType",function(newValue, oldValue){
    	if (angular.isDefined(newValue)){  
    		if (newValue == 0) {
    			$scope.showFormat = false;
    			$scope.myData1 = undefined;
    		}
    	}   
	});
    
    $scope.$watch("model.memoryUnit", function(newValue, oldValue) {
    	if (newValue == 'MB'){
    		$scope.minMem = 512;
    		$scope.maxMem = $scope.clusterMaxMem;
    	} else if (newValue == 'GB'){
    		$scope.minMem = 1;
    		$scope.maxMem = UtilService.transformMBTOGB($scope.clusterMaxMem);
    	}
    });
    $scope.$watch('model.sysConfig', function(newVal, oldVal) {
    	if ($scope.model.sysConfig == true) {
    	    if ($scope.isDefineField) {
    	    	$scope.stepTitles = $scope.stepTitlesOsEx;
    	    } else {
    	    	$scope.stepTitles = $scope.stepTitlesOs;
    	    }
    	} else {
    		if ($scope.isDefineField) {    			
    			$scope.stepTitles = $scope.stepTitlesNoEx;
    		} else {
    			$scope.stepTitles = $scope.stepTitlesNo;
    		}
    	}
    });
    $scope.$watch("osInfo.initType", function(newValue, oldValue){
    	if (newValue == '0' && $scope.flag != constant.PUBLIC_CLOUD_VMWARE){
    		$scope.initTip = $translate.instant("virdesk.initTip");
    	} else if (newValue == '1' && $scope.flag != constant.PUBLIC_CLOUD_WMWARE){
    		$scope.initTip = $translate.instant("virdesk.initTip2");
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
    $scope.$watch("model.virDeskNum", function(newValue, oldValue){
    	if (newValue != 0 ){
    		$scope.model.storageName = $scope.virDesks[$scope.model.virDeskNum].storageTitle;
    	} else {
    		$scope.model.storageName = undefined;
    	}
    });
    // 获取虚拟桌面池
    $scope.queryVirDeskInfo = function(parms){
    	var url = "virDesk/list";
    	var pm = {conditions:parms};
    	$http({
    		method:"GET",
    		url: url,
    		params: pm //{orgId:data.orgId}
    	}).success(function(result){
    		$scope.virDesks.splice(0, $scope.virDesks.length);
    		$scope.virDesks.push({value:0,label:" -- "});
    		if (result && result.data && result.data.length > 0) {
    			for (var i=0;i<result.data.length;i++) { 
    				result.data[i].value = i + 1;
    				result.data[i].label = result.data[i].name;
    				$scope.virDesks.push(result.data[i]);
    			}
    		}
    	});
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    var getDeployPo = function() {
		var desktopPoolId;
		if ($scope.virDesks.length > 0) {
			desktopPoolId = $scope.virDesks[$scope.model.virDeskNum].id;
			if (desktopPoolId == -1){
				desktopPoolId = null;
			}
		}
		var osInfo = null;
		//201706010238 如果不是windows模板则删除localgroup这个参数
		if ($scope.system != 0) {
			delete $scope.osInfo.localgroup;
		}
		//201707190219 部署时，如果手动设置静态ip,且没有设置网关dns字段，则将其置空，避免向castools传入空字符串。
		if (isEmpty($scope.osInfo.sysIp)) {
			$scope.osInfo.sysIp = undefined;
		}
		if (isEmpty($scope.osInfo.sysMask)) {
			$scope.osInfo.sysMask = undefined;
		}
 		if (isEmpty($scope.osInfo.sysdns)) {
			$scope.osInfo.sysdns = undefined;
		}
		if (isEmpty($scope.osInfo.secondaryDns)) {
			$scope.osInfo.secondaryDns = undefined;
		}
		if (isEmpty($scope.osInfo.sysGateway)) {
			$scope.osInfo.sysGateway = undefined;
		}
		if ($scope.model.sysConfig == true) {
			osInfo = $scope.osInfo;
			//修改问题单:201707200164  如果开启DHCP,则清空IP相关参数
			if ($scope.osInfo.sysIpType == 1) {
			    osInfo.sysIp = undefined;
			    osInfo.sysMask = undefined;
			    osInfo.sysGateway = undefined;
			    osInfo.sysdns = undefined;
			    osInfo.secondaryDns = undefined;
			    osInfo.isBindIp = undefined;
		}
		}
		//网络信息
		var networks = [];
		if ($scope.showFormat) {			
			for( i = 0; i < $scope.myData1.length; i++){
				var netdata = $scope.myData1[i];
				var objnet = {
						"mac" : netdata.mac,
						"vSwitchName" :  netdata.vswitchName,
						"profileName" :  netdata.netProfileName
				};
				networks.push(objnet);
			}
		}
		return {
			id:data.domainId,
			vmTempName:data.templateName,
			orgId:data.orgId,
			userIds:[data.userId],
			desktopPoolId:desktopPoolId,
			resourcePoolId:$scope.resourcePoolId,
			workFlowId:data.id,
			domainName:$scope.model.domainName,
			desc:data.description,
			expireDateStr:$scope.model.expireDate,
			title:$scope.model.title,   
			deployMode:$scope.tmp.fastDeploy?1:0,
			targetClusterId:$scope.model.clusterId,
		    cpuSocket:$scope.model.cpuSocket,
		    cpuCore:$scope.model.cpuCore,
		    memoryInit:$scope.model.memoryInit,
			memoryUnit:$scope.model.memoryUnit,
			osInfo:osInfo,
			isBindIp:$scope.model.isBindIp,
			networks:networks,
			//firewallUUid:$scope.model.firewallUUid,
			storagePoolName:$scope.model.storagePoolName,
			extendDiskCapacity:$scope.model.extendDiskCapacity,
			antivirusEnable:$scope.model.antivirusEnable
		};
	}
    var subCallBack = function(result) {
		if (result.state != '0') {
			var param = getCommonParm();
			param.status = 12;
			$http.put('workflow/vmImplement', param);
		}
		if (angular.isFunction(data.callBackQuery)) {
			data.callBackQuery.apply(this,[result]);
		}
	}
	var deployDomain = function() {// 通过模板部署虚拟机
		var param = getDeployPo();
		var url = "domain/deploy";
		if ($scope.flag == constant.PUBLIC_CLOUD_VMWARE) {
			url = "vmware/deploy";
		}
		HttpService.post(url, param, $modalInstance, subCallBack);
	}
	var getCommonParm = function() {
		var desktopPoolId;
		if ($scope.virDesks.length > 0) {
			desktopPoolId = $scope.virDesks[$scope.model.virDeskNum].id;
			if (desktopPoolId == -1){
				desktopPoolId = null;
			}
		}
		var type = $scope.model.deployType==1 ? 1:3;
		return {
				title:$scope.model.title,  
				type:type,
				handleReason:$scope.model.reason,
				desktopPoolId:desktopPoolId,
				expireDateStr:$scope.model.expireDate,
				id:data.id
		};
	}
	var getvmWorkflowAppend = function() {
		if ($scope.isDefineField) {			
			var workflowAppends = {};
			for (var i = 0;i <$scope.defineFields.length;i++ ) {
				var cname = $scope.defineFields[i].columnName.toLowerCase();
				cname = cname.replace("_","");
				workflowAppends[cname] = $scope.defineFields[i].value;
			}
			return workflowAppends;
		}
	}
    $scope.ok = function () {
    	if (!$scope.checkCPU()) {
    		return;
    	}
    	if ($scope.isDefineField == false) {
            //修改问题单:201701240135  计算机名和登录名相同,禁止提交.
            if ($scope.model.sysConfig == true  && $scope.osInfo.loginAccount == $scope.osInfo.sysName){
                UtilService.error($translate.instant("virdesk.loginAccountSameError"), $translate.instant("template.deploy"));
                return;
            }
        }
		var param = getCommonParm();
		param.status = 2;
		param.domainDeployPo = getDeployPo();
		param.vmWorkflowAppend = getvmWorkflowAppend();
		var waitModal = UtilService.wait();
		$http.put('workflow/vmImplement', param).success(function(result) {
      		waitModal.dismiss();
      		UtilService.handleResult(result);
      		//confirm对话框没有$modalInstance对象
      		if (result.success) {
      			deployDomain();// 通过模板部署虚拟机
      		}
        }).error(function(response, code, headers, config) {
        		waitModal.dismiss();
        		UtilService.handleError(code);
        })
	};
	// 获取扩展字段
    $scope.queryDefineField = function(parms){
    	var url = "workflow/queryDefineField";
    	$http({
    		method:"GET",
    		url: url
    	}).success(function(result){
    		if (result && result.state == 0 && result.data.length > 0) {
    			$scope.defineFields = result.data;
    			for (var i = 0;i<result.data.length;i++) {
    				result.data[i].value = data[result.data[i].columnName];
    			}
    			$scope.isDefineField = true;
    			$scope.stepTitles = $scope.stepTitlesNoEx;
    		}
    		if (!isEmpty(data.ip)) {
    			$scope.model.sysConfig = true;
    		}
    	});
    }
 // 获取初始化信息
	$scope.deployVmWorkflowInfo();
	$scope.queryDefineField();
	
    $scope.advance = $translate.instant('migrateVm.showAdvance');
    //磁盘格式
    $scope.showFormat = false;
    $scope.designatedFormat = function() {
    	$scope.showFormat = !$scope.showFormat;
    	if ($scope.showFormat) {
    		var detailUrl = 'template/details';
    		var detailParam = {
    				vmId:data.domainId,
    				orgId:$scope.model.orgId
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
            		/*for (var k = 0; k < $scope.profiles.length; k++){
            			if($scope.myData1[i].profileName == $scope.profiles[k].name && $scope.profiles[k].isExist){
            				$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            				$scope.myData1[i].noProfileValue = false;
            				break;
            			}
            		}*/
            		$scope.myData1[i].netProfileName = $scope.myData1[i].profileName;
            		if (typeof($scope.myData1[i].vswitchName) == "undefined") {
            			$scope.myData1[i].noVswitchValue = true;
            		}
            		/*if (typeof($scope.myData1[i].netProfileName) == "undefined") {
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
	
	// 选择网络策略模板
	$scope.selectNetProfile = function (row){
		var resolve = {
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
	// 选择虚拟交换机
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
			if(angular.isDefined(selectedItem)){
				row.vswitchName = selectedItem.name;
	        	row.noVswitchValue = false;  				
			}
		}, function (reason) {
		});
	};
	$scope.clearNetAndProfile = function (){
		$scope.myData1 = undefined;
	};
	
	
	// 选择防火墙
//	$scope.selectFirewall = function (){
////		var resolve={
////				vswitch:function(){},
////				cloudId : function() {
////					return $scope.cloudId;
////				}
////		};
////		var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
////		profileInstance.result.then(function (selectedItem) {
////			if(angular.isDefined(selectedItem)){
////				$scope.model.firewallUUid = selectedItem.uuid;
////				$scope.model.firewallName = selectedItem.name;
////			}
////		}, function (reason) {
////		});
//	};
	
//	$scope.clearFirewall = function (){
//		$scope.model.firewallUUid = undefined;
//		$scope.model.firewallName = undefined;
//	};
	
	// 选择存储池
	$scope.selectStorePool = function (){
		var params = {
				resourcePoolId : $scope.resourcePoolId,
				domainId : data.domainId
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
				$scope.model.storagePoolName = selectedItem[0].name;
				$scope.model.storageName = selectedItem[0].title;
				$scope.model.storagePath = selectedItem[0].path;
				$scope.model.storageType = selectedItem[0].type;
			}
		},function(reason){
		});
	};
	
	$scope.clearStorePool = function (){
		$scope.model.storagePoolName = undefined;
		$scope.model.storageName = undefined;
		$scope.model.storagePath = undefined;
		$scope.model.storageType = undefined;
		$scope.model.storagePoolTitle = undefined;
	};
});
//=============================================================================================
//Unix电子流
//=============================================================================================
routeApp.controller('VmUnixImplementCtrl',function(data, $scope, $state, $http, $location,$modal,$modalInstance, $translate, UtilService, HttpService,GridService){
	$scope.model=data;
	// 获取扩展字段
    $scope.queryDefineField = function(parms){
    	var url = "workflow/queryDefineField";
    	$http({
    		method:"GET",
    		url: url
    	}).success(function(result){
    		if (result && result.state == 0 && result.data.length > 0) {
    			$scope.defineFields = result.data;
    			for (var i = 0;i<result.data.length;i++) {
    				result.data[i].value = $scope.model[result.data[i].columnName];
    			}
    			$scope.isDefineField = true;
    		}
    	});
    }
    $scope.queryDefineField();
    $scope.ok = function () {
		var param = {
				id:$scope.model.id,
				status:2,	
				handleReason:$scope.handleReason,
				title:$scope.model.title
		};
		HttpService.put('workflow/vmImplement', param, $modalInstance, data.callBackQuery);
	};
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
    $scope.enter = function(ev) {
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
});
//=============================================================================================
//注销电子流
//=============================================================================================
routeApp.controller('VmCancelImplementCtrl',function(data, $scope, $state, $http, $location, $modal,$modalInstance, $translate, UtilService, HttpService,GridService){
	$scope.model=data;
	$scope.delVmType = 0;
    $scope.ok = function () {
    	if ($scope.delVmType == 1) {
    		var modalInstance = UtilService.confirm($translate.instant('workflow.delVmTypeConfirm'));
    		modalInstance.result.then(function (selectedItem) {
    			$scope.cancelVm();
    		}, function () {
    		});
    	} else {
    		$scope.cancelVm();
    	}
	};
	var callBack = function(result) {
		if (result.state != '0') {
			var param = {
					title:$scope.model.title,  
					type:$scope.model.type,
					expireDateStr:$scope.model.expireDate,
					id:data.id
			}
			param.status = 14;
			$http.put('workflow/vmImplement', param);
		} else {			
			if ($scope.delVmType == 1) { // 删除虚拟机
				if (data.publicCloudId == undefined) {
					 var delPm = {						
							 id: data.domainId,
							 orgId: data.orgId,
							 workFlowId:data.id,
							 title: data.title
					 }
					 HttpService.delete('domain/delDomain', delPm, $modalInstance, data.callBackQuery);		
				} else {
					$http.get("cloud/getInfo?cloudId=" + data.publicCloudId).success(function(result){
						 if ($scope.model.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
							 var param = {
			    	                    vCenterId:data.publicCloudId,
			    	                    domainId:data.domainId,
			    	                    name:data.domainName,
			    	                    operateType:"delete",
			    	                    delType:0
			    	         };
							 HttpService.put('vmware/vcenter/vm/operate', param, $modalInstance, data.callBackQuery);
						 } else {
							 var delPm = {						
									 id: data.domainId,
									 orgId: data.orgId,
									 workFlowId:data.id,
									 title: data.title
							 }
							 HttpService.delete('domain/delDomain', delPm, $modalInstance, data.callBackQuery);		
						 }
					});
				}				
			} else { // 回收权限
				//TODO 10633 若cloudOS支持虚拟桌面池，需增加参数处理
//		    	cloudType:domain.cloudType,
//		    	uniqueKey:domain.uniqueKey
				var pm = {						
						orgId: data.orgId,
						domainId: data.domainId,
						title: data.title,
						name: data.userName,
						flag: 1,
						id: data.userId
				}
				HttpService.put('org/revoke', pm, $modalInstance, data.callBackQuery);		
			}
		}
//		if (angular.isFunction(data.callBackQuery)) {
//			data.callBackQuery.apply(this,[result]);
//		}
	}
	$scope.cancelVm = function () {
		var param = {
				id:$scope.model.id,
				status:2,	
//				cancelType : $scope.model.type,
				title: data.title,
				handleReason:$scope.handleReason
		};
		HttpService.put('workflow/vmImplement', param, $modalInstance, callBack);		
	};
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
    $scope.enter = function(ev) {
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
});
//=============================================================================================
//延期电子流
//=============================================================================================
routeApp.controller('VmDelayImplementCtrl',function(data, $scope, $rootScope, $state, $timeout, $http, $location,$modal,$modalInstance, $translate, UtilService, HttpService,GridService){
	$scope.model=data;
	$scope.minDate = new Date();
	$http({
		method: "GET",
		url: "org/expireDate",
		params : {"userId" : data.userId, "domainId" : data.domainId}
	}).success(function(result) {
		if (result) {
			$scope.minDate.setTime(result.data);
		}
	});
	$timeout(function(){
		$("#expireDate").datetimepicker("update");
	})
    $scope.ok = function () {
		var param = {
				id:$scope.model.id,
				status:2,	
				expireDateStr:$scope.model.expireDate,
				title: data.title,
				handleReason:$scope.handleReason
		};
		HttpService.put('workflow/vmImplement', param, $modalInstance, $scope.callBackQuery);
	};
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.callBackQuery = function() {
    	$rootScope.$broadcast("onRefreshVmWorkflow");
    }
    
    //回车
    $scope.enter = function(ev) {
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
});

routeApp.controller('DiskImplementCtrl',function(data, $scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService){
	$scope.model=data;
	$scope.ok = function () {
		var workflowId = 2;
		var param = {
			id:data.id,
        	reason:$scope.model.reason,
        	name:data.name,
        	capacity:$scope.model.capacity
		};
		HttpService.put('workflow/diskImplement', param, $modalInstance, data.callBackQuery);
	};
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
    $scope.enter = function(ev) {
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
});

routeApp.controller('RegisterImplementCtrl',function(data, $scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService){
	$scope.model=angular.copy(data);
	$scope.ok = function () {
		var workflowId = 3;
		var param = {
        	id:data.id,
	    	loginName:data.loginName,
	    	userName:data.userName,
	    	credentialNumber:data.credentialNumber,
	    	email:data.email,
	    	phone:data.phone,
	    	address:data.address,
	    	orgId:$scope.model.orgId,
	    	groupId:$scope.model.groupId
		};
		var callback = function(result) {
			//　邮件发送失败，关闭窗口。
		  if (result.state == 1 && result.errorCode == 1521 && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.dismiss)) {
      		  $modalInstance.close('success');
      	  }
			data.callBackQuery();
		};
		HttpService.put('workflow/registerImplement', param, $modalInstance, callback);
	};
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
	$scope.selectSingleOrganize = function() {
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"selectSingleOrganizeCtrl",
			resolve: {
				params: function () {
                    return null;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				$scope.model.orgId = selectedItem[0].id;
				$scope.orgName = selectedItem[0].name;
				$scope.model.groupId = undefined;
				$scope.groupName = undefined;
			}
		},function(reason){
			
		});
	};
	$scope.selectSingleGroup = function() {
		if (!$scope.model.orgId) {
    		UtilService.alert($translate.instant('workflow.selectOrgAlert'), $translate.instant('common.opertip'));
            return;
    	}
		var modalInstance=$modal.open({
			templateUrl:'html/modal/systemManage/user/selectUserGrp.html',
	    	controller:'SelUserGroupCtrl',
	    	resolve:{ orgId : function() {return $scope.model.orgId},
	    		orgName : function() {return $scope.orgName}},
	    	backdrop:'static',
	    	size:"lg"
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				$scope.model.groupId = selectedItem.id;
				$scope.groupName = selectedItem.name;
			}
		},function(reason){
			
		});
	};
});
routeApp.controller('BackupImplementCtrl',function(data, $scope, $state, $http, $location,$modal,$modalInstance, $timeout, $translate, UtilService, HttpService,GridService){
	$scope.model=data;
	$scope.autoReplacement = data.autoReplacement == 1 ? true : false;
	$scope.ok = function () {
		var workflowId = 4;
		var param = {
			id:data.id,
			name:data.name,
			suggestion:$scope.model.reason,
			keepNumber:$scope.model.keepNumber,
			autoReplacement:$scope.model.autoReplacement
		};
		HttpService.put('workflow/backupImplement', param, $modalInstance, data.callBackQuery);
	};
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //回车
	$scope.enter = function(ev) { 
		if (ev.keyCode == 13 && !$scope.form.$invalid) {
			$scope.ok();
		}
	};
});
//=============================================================================================
//流程步骤设置
//=============================================================================================
routeApp.controller('WorkflowStepCtrl',function($scope, $state, $http, $location, $modal, $timeout, $translate, UtilService, HttpService, GridService, WorkflowService){
	$scope.title = $translate.instant('common.vmWorkflowStepSet');
	$scope.addApprovalStep = $translate.instant('workflow.addApprovalStep');
	
	var singleSign = $translate.instant('workflow.singleSign');
	var allSign = $translate.instant('workflow.allSign');
	var selSign = $translate.instant('workflow.selSign');
	var halfSign = $translate.instant('workflow.halfSign');
	var approver = $translate.instant('workflow.approver');
	var deleteTitle = $translate.instant('common.delete');
	
	var approvalType = $translate.instant('workflow.approvalType');
	
	var deleteStep = $translate.instant('workflow.deleteStep');
	
	$scope.defaultOper = $translate.instant('org.manger');
	if ($scope.workflowId == '1') {
		$scope.title = $translate.instant('common.vmWorkflowStepSet');
	} else if ($scope.workflowId == '2') {
		$scope.title = $translate.instant('common.diskWorkflowStepSet');
	} else if ($scope.workflowId == '3') {
		$scope.title = $translate.instant('common.regieterWorkflowStepSet');
		$scope.defaultOper = $translate.instant('operator.operator');
	} else if ($scope.workflowId == '4') {
		$scope.title = $translate.instant('common.backUpWorkflowStepSet');
	}

	_workflow_bd = jQuery('.workflow .bd');
	
	$scope.getWorkflowStepList = function() {
		var waitModal = UtilService.wait();
	var params = {};
	params.workflowId = $scope.workflowId;
	$http({
		method: 'GET',
		url: 'workflow/workflowStep',
		params: params
	}).success(function(result) {
		waitModal.dismiss();
		$timeout(function() {
			//初始化页面数据
			$scope.result = result;
			$scope.drawWorkflowStepList(result);
		});  
	}).error(function(response, code, headers, config) {
		waitModal.dismiss();
		UtilService.handleError(code);
	});
	};
	
	$scope.drawWorkflowStepList = function(result) {
		var addNode = $(_workflow_bd).find('.add');
		if (result[0].operators == null) {
			//value : 审批员标识符：0-操作员 1-操作员组 2-组织管理员
			//dataId：审批员id
			var userName = $translate.instant('workflow.orgOperators');
			var value = '2';
			var dataId = '0';
			if (result[0].workflowId == '3') {//用户注册电子流
				userName = $translate.instant('workflow.systemOperator');
				value = '1';
				dataId = '1';
			} 
			var typeName = "type0";
			var stepHtml = '<li class="step">'
				 + '<div class="typeBox">'
				 + '<label>' + approvalType + '</label>';
				stepHtml += '<label class="typeRadio" id="single" style="opacity:0.5"><input value="1" name="' + typeName + '" type="radio" disabled="true">'+singleSign+'</label>'
							 + '<label class="typeRadio" id ="all"><input value="2" name="' + typeName + '" type="radio">'+allSign+'</label>'
							 + '<label class="typeRadio" id="sel"><input value="3" name="' + typeName + '" type="radio" checked="checked">'+selSign+'</label>'
							 + '<label class="typeRadio" id="half"><input value="4" name="' + typeName + '" type="radio">'+halfSign+'</label>'
				stepHtml += '</div>'
					+ '<div class="personBox">'
					+ '<div class="l"><label class="lbl">'+approver+'</label></div>'
					+ '<div class="r"><ul class="selected">';
					var operHtml = '';
						operHtml += '<li class="oper" value='+value+' data-id= '+dataId+'>'
						+ '<span class="operImg"></span>'+userName+'<span class="delOper" title="'+deleteTitle+'"></span></li>';
					stepHtml += operHtml;
					stepHtml += '<li id="s" class="selectOper">+</li></ul></div>'
						+ '</div></li>';
				addNode.before(stepHtml);
		} else {
			$.each(result, function(i, data) {
					var firstFlag = false;
					if (i==0) {
						firstFlag = true;
					}
					var type = data.type;
					var operators = data.operators;
					
					var typeName = 'type' + i;
					var stepHtml = '<li class="step">'
								 + '<div class="typeBox">'
								 + '<label>' + approvalType + '</label>';
					
					//审批类型，1:单签，2:会签，3：选签，4:半数签
					if (type == 1) {
						stepHtml += '<label class="typeRadio" id="single"><input value="1" name="' + typeName + '" type="radio" checked="checked" disabled="true">'+singleSign+'</label>'
								  + '<label class="typeRadio" id ="all" style="opacity:0.5"><input value="2" name="' + typeName + '" type="radio" disabled="true">'+allSign+'</label>'
								  + '<label class="typeRadio" id="sel" style="opacity:0.5"><input value="3" name="' + typeName + '" type="radio" disabled="true">'+selSign+'</label>'
								  + '<label class="typeRadio" id="half" style="opacity:0.5"><input value="4" name="' + typeName + '" type="radio" disabled="true">'+halfSign+'</label>'
					} else if (type == 2) {
						stepHtml += '<label class="typeRadio" id="single" style="opacity:0.5"><input value="1" name="' + typeName + '" type="radio" disabled="true">'+singleSign+'</label>'
								  + '<label class="typeRadio" id ="all"><input value="2" name="' + typeName + '" type="radio" checked="checked">'+allSign+'</label>'
								  + '<label class="typeRadio" id="sel"><input value="3" name="' + typeName + '" type="radio">'+selSign+'</label>'
								  + '<label class="typeRadio" id="half"><input value="4" name="' + typeName + '" type="radio">'+halfSign+'</label>'
					} else if (type == 3) {
						stepHtml += '<label class="typeRadio" id="single" style="opacity:0.5"><input value="1" name="' + typeName + '" type="radio" disabled="true">'+singleSign+'</label>'
								  + '<label class="typeRadio" id ="all"><input value="2" name="' + typeName + '" type="radio">'+allSign+'</label>'
								  + '<label class="typeRadio" id="sel"><input value="3" name="' + typeName + '" type="radio" checked="checked">'+selSign+'</label>'
								  + '<label class="typeRadio" id="half"><input value="4" name="' + typeName + '" type="radio">'+halfSign+'</label>'
					} else if (type == 4) {
						stepHtml += '<label class="typeRadio" id="single" style="opacity:0.5"><input value="1" name="' + typeName + '" type="radio" disabled="true">'+singleSign+'</label>'
								  + '<label class="typeRadio" id ="all"><input value="2" name="' + typeName + '" type="radio">'+allSign+'</label>'
								  + '<label class="typeRadio" id="sel"><input value="3" name="' + typeName + '" type="radio">'+selSign+'</label>'
								  + '<label class="typeRadio" id="half"><input value="4" name="' + typeName + '" type="radio" checked="checked">'+halfSign+'</label>'
					}
					stepHtml += '</div>'
						+ '<div class="personBox">'
						+ '<div class="l"><label class="lbl">'+approver+'</label></div>'
						+ '<div class="r"><ul class="selected">';
					if (operators.length > 0) {
						var operHtml = '';
						for (var j = 0; j < operators.length; j++) {
							operHtml += '<li class="oper" value="'+operators[j].opType+'"data-id="'+ operators[j].id +'">'
							+ '<span class="operImg"></span>'
							+ operators[j].userName +'<span class="delOper" title="'+deleteTitle+'"></span></li>';
						}
						stepHtml += operHtml;
					}		  
					if (firstFlag) {
						stepHtml += '<li id="s" class="selectOper">+</li></ul></div>'
							+ '</div></li>'
					} else {
						stepHtml += '<li id="s" class="selectOper">+</li></ul></div>'
							+ '</div>'
							+ '<span  class="delStep" title="'+deleteStep+'"></span>'
							+ '</li>';
					}
					addNode.before(stepHtml);
			});
		}
	};
	
	/**
	 * 初始化页面数据
	 */
	$scope.getWorkflowStepList();
	
	_workflow_bd.delegate('.selectOper','click',function(event) {
		var clickedNode = $(event.target);
		var param ={};
		param.enable = 1;
		var modalInstance = $modal.open({
			  templateUrl: 'html/modal/common/selectOperOrGrp.html',
			  controller: 'SelectMulOperatorAndGroupCtrl',
			  size: 'lg',
			  backdrop:'static',
			  resolve: {
				  param : function() {
					  return param;
				  },
				  workflowId : function() {
					  return $scope.result;
				  }
			  }
		});
		modalInstance.result.then(function (result) {
			if(angular.isDefined(result) && result != "cancel" && result !="escape key press") {
				var clickedNodePrevAll = clickedNode.prevAll();
				var operHtml = '';
				
				var addOperCount = 0;
				var addGrpCount = 0;//增加操作员分组
				for(var i = 0; i < result.length; i++) {
					var flag = false;
					if (clickedNodePrevAll.length > 0) {
						for (var j = 0; j < clickedNodePrevAll.length; j++) {
							if (result[i].id == $(clickedNodePrevAll[j]).attr("data-id") && result[i].opType == $(clickedNodePrevAll[j]).attr("value")) {
								flag = true;
								break;
							}
						}
					}
					if (flag) {
						continue;
					}
					operHtml += '<li class="oper" value="'+result[i].opType+'"data-id="'+ result[i].id +'">'
  					   	  + '<span class="operImg"></span>'
  					   	  + result[i].userName +'<span class="delOper" title="'+deleteTitle+'"></span></li>';
					if (result[i].opType == "0") {
						addOperCount++;
					} else if (result[i].opType == "1" || result[i].opType == "2") {
						addGrpCount++;
					}
				}
				$(operHtml).insertBefore(clickedNode);
				var operNum = parseInt(clickedNodePrevAll.length) + parseInt(addOperCount)  + parseInt(addGrpCount)*2;//判断选择的审批员人数
				var parentStepNode = $(clickedNode).parents("li.step");
				$scope.setTypeRadio(operNum, parentStepNode);
			}
		}, function (selectedItems) {

		});
	});
	
	$scope.setTypeRadio = function (operNum, node) {
		var parentStepNode = $(node);
		
		if (parseInt(operNum) <= 1) {
			$(parentStepNode).find('input[type="radio"][value="1"]').removeAttr("checked");
			$(parentStepNode).find('input[type="radio"][value="2"]').removeAttr("checked");
			$(parentStepNode).find('input[type="radio"][value="3"]').removeAttr("checked");
			$(parentStepNode).find('input[type="radio"][value="4"]').removeAttr("checked");
			
			$(parentStepNode).find('input[type="radio"][value="1"]').prop("checked", true);
			
			$(parentStepNode).find('input[type="radio"][value="1"]').attr("disabled", true);
			$(parentStepNode).find('input[type="radio"][value="2"]').attr("disabled", true);
			$(parentStepNode).find('input[type="radio"][value="3"]').attr("disabled", true);
			$(parentStepNode).find('input[type="radio"][value="4"]').attr("disabled", true);

			$(parentStepNode).find("#single").css("opacity", '1');
			$(parentStepNode).find("#all").css("opacity", '0.5');
			$(parentStepNode).find("#sel").css("opacity", '0.5');
			$(parentStepNode).find("#half").css("opacity", '0.5');
		} else if (parseInt(operNum) > 1) {
			$(parentStepNode).find('input[type="radio"][value="1"]').removeAttr("checked");
			$(parentStepNode).find('input[type="radio"][value="2"]').removeAttr("checked");
			$(parentStepNode).find('input[type="radio"][value="3"]').removeAttr("checked");
			$(parentStepNode).find('input[type="radio"][value="4"]').removeAttr("checked");
			
			$(parentStepNode).find('input[type="radio"][value="3"]').prop("checked", true);
			
			$(parentStepNode).find('input[type="radio"][value="1"]').attr("disabled", true);
			$(parentStepNode).find('input[type="radio"][value="2"]').attr("disabled", false);
			$(parentStepNode).find('input[type="radio"][value="3"]').attr("disabled", false);
			$(parentStepNode).find('input[type="radio"][value="4"]').attr("disabled", false);
			
			$(parentStepNode).find("#single").css("opacity", '0.5');
			$(parentStepNode).find("#all").css("opacity", '1');
			$(parentStepNode).find("#sel").css("opacity", '1');
			$(parentStepNode).find("#half").css("opacity", '1');
			
        }
	};
	
	_workflow_bd.delegate('.delOper','click',function(event) {
		var clickedNode = $(event.target);
		var parentStepNode = $(clickedNode).parents("li.step");
		var operNode = clickedNode.parent('li');
		operNode.remove();
		var operNodeList = $(parentStepNode[0]).find('.oper');
		var addOperCount = 0;
		var addGrpCount = 0;//操作员分组数量
		if (operNodeList.length > 0) {
			for (var j = 0; j < operNodeList.length; j++) {
				if ($(operNodeList[j]).attr("value") == "0") {
					addOperCount++;
				} else {
					addGrpCount++;
				}
			}
		}
		var operNum = parseInt(addOperCount) + parseInt(addGrpCount)*2;
		$scope.setTypeRadio(operNum, parentStepNode);
	});
	
	_workflow_bd.delegate('.add','click',function(event) {
		var clickedNode = $(event.target);
		var idx = clickedNode.index();
		console.log('idx='+idx);
		var typeName = 'type' + (idx-1);
		var stepHtml = '<li class="step">'
					 + '<div class="typeBox">'
					 + '<label>'+approvalType+'</label>'
					 + '<label class="typeRadio" id="single"><input value="1" name="' + typeName + '" type="radio" checked="checked" disabled="true">'+singleSign+'</label>'
					 + '<label class="typeRadio" id="all" style="opacity:0.5"><input value="2" name="' + typeName + '" type="radio" disabled="true">'+allSign+'</label>'
					 + '<label class="typeRadio" id="sel" style="opacity:0.5"><input value="3" name="' + typeName + '" type="radio" disabled="true">'+selSign+'</label>'
					 + '<label class="typeRadio" id="half" style="opacity:0.5"><input value="4" name="' + typeName + '" type="radio" disabled="true">'+halfSign+'</label>'
					 + '</div>'
					 + '<div class="personBox">'
					 + '<div class="l"><label class="lbl">'+approver+'</label></div>'
					 + '<div class="r"><ul class="selected"><li id="s" class="selectOper">+</li></ul></div>'
					 + '</div>'
					 + '<span class="delStep"></span>'
					 + '</li>';
		clickedNode.before(stepHtml);
	});
	
	_workflow_bd.delegate('.delStep','click',function(event) {
		var clickedNode = $(event.target);
		var currNode = clickedNode.parent('li');
		currNode.remove();
	});
	
	$scope.save = function() {
		$scope.workflowStepListJson = {};
		$scope.workflowStepListJson.workflowStepList = [];
		
		var data1 = {};
/*		data1.type = 3;//审批类型，1:单签，2:会签，3：选签，4:半数签
		data1.level = 1;
		data1.workflowId = $scope.workflowId;
		$scope.workflowStepListJson.workflowStepList.push(data1);*/

		var stepNodeList = $(_workflow_bd).find('li.step');
		if (stepNodeList.length > 0) {
			for (var i = 0; i < stepNodeList.length; i++) {
				var stepNode = $(stepNodeList[i]);
				
				var type = parseInt(stepNode.find('input[type="radio"]:checked').val());
				var level = parseInt(i + 1);
				
				var data = {};
				data.type = type;//审批类型，1:单签，2:会签，3：选签，4:半数签
				data.level = level;
				data.workflowId = $scope.workflowId;
				data.opIds = new Array();
				data.opTypes = new Array();
				
				var operNodeList = stepNode.find('.oper');
				if (operNodeList.length == 0) {
					UtilService.alert($translate.instant('common.setApprovalStep', {num:level}), $translate.instant('common.opertip'), false, 'error');
		            return;
				}
				if (operNodeList.length > 0) {
					for (var j = 0; j < operNodeList.length; j++) {
						data.opIds.push($(operNodeList[j]).attr("data-id"));
						data.opTypes.push($(operNodeList[j]).attr("value"));
					}
				}
				
				$scope.workflowStepListJson.workflowStepList.push(data);
			}
		}
		
		HttpService.put("workflow/workflowStep", $scope.workflowStepListJson);
	}
});
//=========================================================================================
//高级过滤
//=========================================================================================
routeApp.controller('filterWorkflowCtrl',function($scope, $state, $http, $modal, $timeout, $translate,$modalInstance, filterParams, UtilService, HttpService, GridService, WorkflowService){
	/** 状态（0待审批，1审批中，2通过，3拒绝，30撤销，10待实施，11部署成功，12部署失败，13删除成功，14删除失败）*/
	$scope.statusOptions=[{value:0,label:$translate.instant('workflow.wating')},{value:2,label:$translate.instant('workflow.pass')},
                {value:3,label:$translate.instant('workflow.refuse')},{value:30,label:$translate.instant('workflow.revoke')},
                {value:11,label:$translate.instant('workflow.deploySuccess')},{value:12,label:$translate.instant('workflow.deployFail')},
                {value:13,label:$translate.instant('workflow.delSuccess')},{value:14,label:$translate.instant('workflow.delFail')},
                {value:15,label:$translate.instant('workflow.all')}];
	$scope.typeOptions=[{value:1,label:$translate.instant("workflow.apply")}, 
	                    {value:0,label:$translate.instant("workflow.logout")},
	                    {value:4,label:$translate.instant("workflow.delay")}];
	$scope.filter = {};
	$scope.filter.status = 15;
	$timeout(function(){
		$("#createTimeStartInput").change(function(){
			var value = $("#createTimeStartInput").val();
			if (value != "") {
				var d = new Date();
				d.setYear(parseInt(value.substring(0, 4)));
				d.setMonth(parseInt(value.substring(5, 7))-1);
				d.setDate(parseInt(value.substring(8, 10)));
				$scope.createEndMinDate = d;
			} else {
				$scope.createEndMinDate = undefined;
			}
			$scope.$digest();
		});
		$("#createTimeEndInput").change(function(){
			var value = $("#createTimeEndInput").val();
			if (value != "") {
				var d = new Date();
				d.setYear(parseInt(value.substring(0, 4)));
				d.setMonth(parseInt(value.substring(5, 7))-1);
				d.setDate(parseInt(value.substring(8, 10)));
				$scope.createStartMaxDate = d;
			} else {
				$scope.createStartMaxDate = undefined;
			}
			$scope.$digest();
		});
		$("#handleTimeStartInput").change(function(){
			var value = $("#handleTimeStartInput").val();
			if (value != "") {
				var d = new Date();
				d.setYear(parseInt(value.substring(0, 4)));
				d.setMonth(parseInt(value.substring(5, 7))-1);
				d.setDate(parseInt(value.substring(8, 10)));
				$scope.handleEndMinDate = d;
			} else {
				$scope.handleEndMinDate = undefined;
			}
			$scope.$digest();
		});
		$("#handleTimeEndInput").change(function(){
			var value = $("#handleTimeEndInput").val();
			if (value != "") {
				var d = new Date();
				d.setYear(parseInt(value.substring(0, 4)));
				d.setMonth(parseInt(value.substring(5, 7))-1);
				d.setDate(parseInt(value.substring(8, 10)));
				$scope.handleStartMaxDate = d;
			} else {
				$scope.handleStartMaxDate = undefined;
			}
			$scope.$digest();
		});
		if (filterParams != null && angular.isDefined(filterParams)){
			$scope.filter.userName = filterParams.userName;
			$scope.filter.templateName = filterParams.templateName;
			$scope.filter.status = filterParams.status;
			$scope.filter.type = filterParams.type;
			$scope.filter.createTime_start = filterParams.createDate_start;
			$scope.filter.createTime_end = filterParams.createDate_end;
			$scope.filter.handleTime_start = filterParams.handleDate_start;
			$scope.filter.handleTime_end = filterParams.handleDate_end;
			$("#createTimeStartInput").val(filterParams.createDate_start); 
			if (filterParams.createDate_start != undefined) {
				var d = new Date();
				d.setYear(parseInt(filterParams.createDate_start.substring(0, 4)));
				d.setMonth(parseInt(filterParams.createDate_start.substring(5, 7))-1);
				d.setDate(parseInt(filterParams.createDate_start.substring(8, 10)));
				$scope.createEndMinDate = d;
			}
			$("#createTimeEndInput").val(filterParams.createDate_end);
			if (filterParams.createDate_end != undefined) {
				var d = new Date();
				d.setYear(parseInt(filterParams.createDate_end.substring(0, 4)));
				d.setMonth(parseInt(filterParams.createDate_end.substring(5, 7))-1);
				d.setDate(parseInt(filterParams.createDate_end.substring(8, 10)));
				$scope.createStartMaxDate = d;
			}
			$("#handleTimeStartInput").val(filterParams.handleDate_start);
			if (filterParams.handleDate_start != undefined) {
				var d = new Date();
				d.setYear(parseInt(filterParams.handleDate_start.substring(0, 4)));
				d.setMonth(parseInt(filterParams.handleDate_start.substring(5, 7))-1);
				d.setDate(parseInt(filterParams.handleDate_start.substring(8, 10)));
				$scope.handleEndMinDate = d;
			}
			$("#handleTimeEndInput").val(filterParams.handleDate_end);
			if (filterParams.handleDate_end != undefined) {
				var d = new Date();
				d.setYear(parseInt(filterParams.handleDate_end.substring(0, 4)));
				d.setMonth(parseInt(filterParams.handleDate_end.substring(5, 7))-1);
				d.setDate(parseInt(filterParams.handleDate_end.substring(8, 10)));
				$scope.handleStartMaxDate = d;
			}
		}
	});
	$scope.ok = function(){
		var params = {};
		if (!isEmpty($scope.filter.userName)){
			params.userName = $scope.filter.userName;
		}
		if (!isEmpty($scope.filter.templateName)){
			params.templateName = $scope.filter.templateName;
		}
		if (!isEmpty($scope.filter.status)){
			params.status = $scope.filter.status;
		}
		if (!isEmpty($scope.filter.type)){
			params.type = $scope.filter.type;
		}
		if (!isEmpty($scope.filter.createTime_start)){
			params.createDate_start = $scope.filter.createTime_start;
		}
		if (!isEmpty($scope.filter.createTime_end)){
			params.createDate_end = $scope.filter.createTime_end;
		}
		if (!isEmpty($scope.filter.handleTime_start)){
			params.handleDate_start = $scope.filter.handleTime_start;
		}
		if (!isEmpty($scope.filter.handleTime_end)){
			params.handleDate_end = $scope.filter.handleTime_end;
		}
		$scope.$root.$broadcast("advancedQueryInVmWorkflow", params);
		$modalInstance.close(params);
	}
	$scope.reset = function(){
		$scope.filter.userName = undefined;
		$scope.filter.templateName = undefined;
		$scope.filter.status = 15;
		$scope.filter.type = undefined;
		$scope.filter.createTime_start = undefined;
		$scope.filter.createTime_end = undefined;
		$scope.filter.handleTime_start = undefined;
		$scope.filter.handleTime_end = undefined;
		$("#createTimeStartInput").val(""); 
		$("#createTimeEndInput").val("");
		$("#handleTimeStartInput").val(""); 
		$("#handleTimeEndInput").val(""); 
		$scope.createEndMinDate = undefined;
		$scope.createStartMaxDate = undefined;
		$scope.handleEndMinDate = undefined;
		$scope.handleStartMaxDate = undefined;
	}
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
});
