// grid单元格中的进度条模
//修改问题单201605270163，解决进度条中百分数在Chrome V43.0.2357.134下显示异常的问题 --by ckf6302 2016.6.13
var progressTemplate='<div class="ngCellText" style="padding-top:2px;" ng-class="col.colIndex()"><div class="progress progressgray" style="text-align:center;">' +
					 '<span>{{row.entity[col.field] | number:2}}%</span>' + 
                     '<div class="progress-bar progressgreen" ng-if="row.entity[col.field] < 50" role="progressbar" aria-valuenow="{{row.entity[col.field] | number:2}}" aria-valuemin="0" aria-valuemax="100" ng-style="{\'width\': (row.entity[col.field] | number:2)+ \'%\'}">' + 
//                     '<span>{{row.entity[col.field] | number:2}}%</span>' + 
                     '</div>' + 
                     '<div class="progress-bar progressyellow" ng-if="row.entity[col.field] >= 50 && row.entity[col.field] <= 80" role="progressbar" aria-valuenow="{{row.entity[col.field] | number:2}}" aria-valuemin="0" aria-valuemax="100" ng-style="{\'width\': (row.entity[col.field] | number:2)+ \'%\'}">' + 
//                     '<span>{{row.entity[col.field] | number:2}}%</span>' + 
                     '</div>' + 
                     '<div class="progress-bar progressred" ng-if="row.entity[col.field] > 80" role="progressbar" aria-valuenow="{{row.entity[col.field] | number:2}}" aria-valuemin="0" aria-valuemax="100" ng-style="{\'width\': (row.entity[col.field] | number:2)+ \'%\'}">' + 
//                     '<span>{{row.entity[col.field] | number:2}}%</span>' + 
                     '</div>' + 
                     '</div></div>';
// 主机列表下的虚拟机概要状态
var vmSummaryTemplate = '<div class="ngCellText" ng-class="col.colIndex()">'
    +'<span ng-cell-text>{{row.entity[col.field]}}</span><span class="span_padding"></span><span class="span_padding">[</span>'
    +'<span ng-cell-text class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_running.svg"></span><span class="span_color_green" ng-cell-text ng-bind="row.entity.vmRunCount"></span>&nbsp;'
    +'<span ng-cell-text class="span_padding"><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span class="span_color_red" ng-cell-text ng-bind="row.entity.vmShutoff"></span>'
    +'<span class="span_padding">]</span></div>';
//ngGrid列表的状态模板（如操作员分组列表） 状态：允许 禁止
var statusTemplate = '<div> '+
    '<span ng-if= \'row.branch[col.field] == "1"\'><span class="icon-active"></span><span class="span_padding"></span><span class="cell-icon-text">{{\'common.allow\'|translate}}</span></span>' +
    '<span ng-if= \'row.branch[col.field] == "0"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">{{\'common.forbid\'|translate}}</span></span></div>' ;
//ngGrid列表的状态模板（如操作员列表） 状态：启用 禁用
var statusTemplate2='<div class="ngCellText" ng-class="col.colIndex()"> '+
'<span ng-if= \'row.entity[col.field] == "1"\'><span class="icon-active"></span><span class="span_padding"></span><span class="cell-icon-text">{{\'common.enable\'|translate}}</span></span>' +
'<span ng-if= \'row.entity[col.field] == "0"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">{{\'common.forbidden\'|translate}}</span></span></div>' ;
/**
 * desc	cell的tip模板
 * details titleTemplate用于ngGrid插件 |titleTemplate2用于treeGrid插件
 */
var titleTemplate = "<div class='ngCellText' ng-class='col.colIndex()'><span custom-title='{{row.entity[col.field]}}'>{{row.entity[col.field]}}</span></div>";
var titleTemplate2 = "<span custom-title='{{row.branch[col.field]}}' set-td-width='{{col.width}}' class='gird-ellipsis'>{{row.branch[col.field]}}</span>";
var titleLinkTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a custom-title="{{row.entity[col.field]}}" ng-click="jump(row.entity)" style="text-decoration:underline;">{{row.entity[col.field]}}</a></div>';
//虚拟机运行状态
var vmstatusTemplate=function($translate){
    return '<div class="ngCellText" ng-class="col.colIndex()">' +
    '<div ng-if= \'row.entity[col.field] == "running"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_vm_running.svg"></span><span>' + $translate.instant("vm.execute") + '</span></div>' +
    '<div ng-if= \'row.entity[col.field] == "paused"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_vm_pause.svg"></span><span>' + $translate.instant("vm.pause") + '</span></div>' +
    '<div ng-if= \'row.entity[col.field] == "notdeploy"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_unkown.svg"></span><span>' + $translate.instant("vm.noDeploy") + '</span></div>' +
    '<div ng-if= \'row.entity[col.field] == "shutOff"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_vm_close.svg""></span><span>' + $translate.instant("vm.close") + '</span></div>' +
    '<div ng-if= \'row.entity[col.field] == "ha_exception"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_vm_haexception.svg"></span><span>' + $translate.instant("vm.haException") + '</span></div>' +
    '<div ng-if= \'row.entity[col.field] == "unmanage"\'><span class="span_padding"  ><img class="pic1img" src="css/img/gray/Icon_unkown.svg"></span><span>' + $translate.instant("vm.noManage") + '</span></div>' +
    '<div ng-if= \'row.entity[col.field] == "unknown"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_unkown.svg"></span><span>' + $translate.instant("vm.unkown") + '</span></div></div>';
};
//主机状态
var hoststatusTemplate=function($translate) {
	return '<div class="ngCellText" ng-class="col.colIndex()"><div ng-if= \'row.entity[col.field] == "1"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_normal_16x16.svg"></span><span>' + $translate.instant("common.normal") + '</span></div>' +
	'<div ng-if= \'row.entity[col.field] == "2"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_warning_16x16.svg"></span><span>'+$translate.instant("host.notInHA") +'</span></div>' +
	'<div ng-if= \'row.entity[col.field] == "3"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_maint_16x16.svg"></span><span>'+$translate.instant("host.maintainMode") +'</span></div>' +
	'<div ng-if= \'row.entity[col.field] == "4"\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_maint_16x16.svg"></span><span>'+$translate.instant("host.maintainMode") +'</span></div>' +
	'<div ng-if= \'row.entity[col.field] == ""\'><span class="span_padding" ><img class="pic1img" src="css/img/gray/Icon_host_error.svg"></span><span>' + $translate.instant("common.abnormal") + '</span></div></div>' ;
};
//选中行之前进行是否已经选中的判断
function beforeSelectionChange(rowItem, event) {
    // 如果点击的是已经选中行则立即返回，不做查询。选中事件之前触发，用于做校验。返回true继续选中，返回false中断选中。
    if (rowItem.selected == true) {
        return false;
    }
    return true;
}
// 选中行以后向父scope冒泡eventName事件，并将id赋值给paramName属性
function afterSelectionChange(rowItem, event, scope, eventName, paramName) {   // 选中事件完成后触发
    // 一次ngGridEventData会激发2此afterSelectionChange事件。这里要处理只执行后面那次
    // ngGridEventData激发的2次afterSelectionChange中，rowItem.selected都为true，这里需要额外处理。
    // 这里使用isClone属性识别，其中一个有此属性，另一个没有。
    if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {     // 在点击时，因为会有原来行与新选中行，这里只需要新选中行。
        var rowObj = rowItem.entity;
        if (angular.isDefined(paramName)) {
            var params = {};
            params[paramName] = rowObj.id;
            // 向父controller冒泡选择事件。
            scope.$emit(eventName, params);
// console.info("afterSelectionChange: emit-> " + eventName);
        } else {
            scope.$emit(eventName, rowObj);
        }        
    }
}
            
//选择主机列表控制器
//行模板，用于双击跳转
var doubleClickTemplate = '<div ng-dblclick="jump(row.entity)" ng-mousedown="rightClick(row, $event)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell><div class="ngVerticalBar ngVerticalBarVisible ng-class="ngVerticalBarVisible : !$last"></div></div>';

//监听导航栏的收起展开事件，控制grid的宽度自动调整。
//scope：grid的$scope, timeout:$timeout服务
//调用该方法之前必须先给style变量赋值：$scope.listStyle = $scope.gridStyle();
function listenNavClick(scope, timeout, h, dl) {
  scope.$on('onNavClick', function(event, msg) {
       //点击事件触发后对style重新赋值，并触发resize事件调整表格宽度
       timeout(function() {
           $('#main').css("overflow","hidden");
           scope.listStyle = scope.gridStyle(h, dl);
           $(window).resize();
       });
       //先禁用main面板的滚动条，再启用防止出现不必要的滚动条。
       timeout(function() {
           $('#main').css("overflow","auto"); 
       }, 300);
   });
  //浏览器大小改变是触发样式调整
  //暂不支持，分页栏有时会跟不上表格的高度变化。
//$(window).on('resize.nggrid', function(event, msg) {
//    timeout(function() {
//         scope.listStyle = scope.gridStyle();
//     }, 30);    
//     setTimeout(function() {
//         $(window).resize();
//     }, 300);
//});
}

//list的高度调整参数，高度加90px。
var LIST_HEIGHT_ADD_90 = -90;
var LIST_HEIGHT_ADD_85 = -85;
var LIST_HEIGHT_ADD_80 = -76;       //由80改为76
var LIST_HEIGHT_RED_60 = 60;
var LIST_HEIGHT_RED_14 = 14;        
//表格列模板的标准开头和结尾
var TEMPLATE_START = '<div class="ngCellButton" ng-class="col.colIndex()"><span ng-cell-text>';
var TEMPLATE_END = '</span></div>';

//-----------------------------------------------------------------------------------------------------------

routeApp.controller('SelectSingleOperatorCtrl',function(param, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
//	var statusTemplate='<div class="ngCellText" ng-class="col.colIndex()"> '+
//    '<span ng-if= \'row.entity[col.field] == "1"\' class="icon-active">{{\'common.enable\'|translate}}</span>' +
//    '<span ng-if= \'row.entity[col.field] == "0"\' class="icon-inactive">{{\'common.forbidden\'|translate}}</span></div>' ;
	var column = [{ field: 'loginName', displayName: $translate.instant('common.loginName'), sortable: true, width:'25%'},
	              { field: 'userName', displayName: $translate.instant('common.operatorName'), sortable: true, width:'25%'},
	              { field: 'enable', displayName: $translate.instant('common.state'), sortable: true, width:'20%', cellTemplate:statusTemplate2},
	              { field: 'operatorGroup', displayName: $translate.instant('operator.opertorGrp'), sortable: true, width:'30%'}
	              ];
	$scope.mySelections = [];
	var params = {
			enable:param.enable
	};
	if (!isEmpty(param.workflowId)) {
		params.workflowId = param.workflowId;
	}
	
	var url = "operator";
    $scope = GridService.grid($scope, url, params);
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
	      i18n: $translate.instant('load.static.lang'),
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
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
/** 选择多操作员*/
routeApp.controller('SelectMulOperatorCtrl',function(param, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.checkOrg = true;
	$scope.title = $translate.instant("common.selectOperator");
	$scope.helpFlag = "selManger";
//	var statusTemplate='<div class="ngCellText" ng-class="col.colIndex()"> '+
//    '<span ng-if= \'row.entity[col.field] == "1"\' class="icon-active">{{\'common.enable\'|translate}}</span>' +
//    '<span ng-if= \'row.entity[col.field] == "0"\' class="icon-inactive">{{\'common.forbidden\'|translate}}</span></div>' ;
	var column = [{ field: 'loginName', displayName: $translate.instant('common.loginName'), sortable: true, width:'25%'},
	              { field: 'userName', displayName: $translate.instant('common.operatorName'), sortable: true, width:'25%'},
	              { field: 'enable', displayName: $translate.instant('common.state'), sortable: true,cellTemplate:statusTemplate2, width:'20%'},
	              { field: 'operatorGroup', displayName: $translate.instant('operator.opertorGrp'), sortable: true, width:'30%'}
	              ];
	$scope.mySelections = [];
	var params = {
			organization:param.name
	};//param;
	var url = "operator";
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
	      i18n: $translate.instant('load.static.lang'),
	      totalServerItems: 'totalServerItems',
	      filterOptions: $scope.filterOptions,
	      pagingOptions: $scope.pagingOptions,
	     // rowTemplate: doubleClickTemplate,    //双击行模板
	      columnDefs:column
  	};
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

/** 选择多操作员与操作员分组*/
routeApp.controller('SelectMulOperatorAndGroupCtrl',function(param, workflowId, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.helpFlag = "selManger";
	$scope.operatorOrGroup = '1';
	$scope.title = $translate.instant("common.selectOperator");
	$scope.selOperator = $translate.instant("entrust.selOperator");
	$scope.selGroup = $translate.instant("entrust.selGroup");
	$scope.workflowType = $translate.instant("entrust.workflowType");
	$scope.orgName = $translate.instant('workflow.orgOperators');
//	var statusTemplate='<div class="ngCellText" ng-class="col.colIndex()"> '+
//    '<span ng-if= \'row.entity[col.field] == "1"\' class="icon-active">{{\'common.enable\'|translate}}</span>' +
//    '<span ng-if= \'row.entity[col.field] == "0"\' class="icon-inactive">{{\'common.forbidden\'|translate}}</span></div>' ;
	var column = [{ field: 'loginName', displayName: $translate.instant('common.loginName'), sortable: true, width:'25%'},
	              { field: 'userName', displayName: $translate.instant('common.operatorName'), sortable: true, width:'25%'},
	              { field: 'enable', displayName: $translate.instant('common.state'), sortable: true,cellTemplate:statusTemplate2, width:'20%'},
	              { field: 'operatorGroup', displayName: $translate.instant('operator.opertorGrp'), sortable: true, width:'30%'}
	              ];
	$scope.mySelections = [];
	var params = {
			organization:param.name,
			workflowId:workflowId[0].workflowId,
			enable:param.enable
	};//param;
	var url = "operator";
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
	      i18n: $translate.instant('load.static.lang'),
	      totalServerItems: 'totalServerItems',
	      filterOptions: $scope.filterOptions,
	      pagingOptions: $scope.pagingOptions,
	      rowTemplate: doubleClickTemplate,    //双击行模板
	      columnDefs:column
  	};
	//操作员分组
    var column2 = [ {field: 'name', displayName: $translate.instant('operator.groupName'),width:'50%',sortable: true},
                    { field: 'description', displayName: $translate.instant('operator.groupDesc'), width:'50%',sortable: true}
                  ];
	$scope.mySelections2 = [];
	var params2 = {
			workflowId:workflowId[0].workflowId
	};//param;
	var url2 = "operator/group/tree";
    $scope = GridService.grid2($scope, url2, params2);
	$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, $scope.pagingOptions2.currentPage);
	$scope.gridOptions2 = {
		  data: 'myData2',
		  jqueryUITheme: false,
		  jqueryUIDraggable: false,
	      selectedItems: $scope.mySelections2,
	      showSelectionCheckbox: true,
	      multiSelect: true,
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
	   //   rowTemplate: doubleClickTemplate,    //双击行模板
	      columnDefs:column2
  	};
	//流程定制为用户预注册电子流没有组管理员
	$scope.afterLoad2 = function() {
		if (workflowId[0].workflowId != '3') {
			var object = {};
			object.name = $scope.orgName;
			object.description = $translate.instant('workflow.orgDescribe');
			$scope.myData2.push(object);
		}
	}
	
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		var selecttion = [];
		var selecttion2 = [];
		var selDetail = {};
		if ($scope.mySelections.length>0) {
			for (var i=0; i<$scope.mySelections.length; i++) {
				selDetail = {opType: "0", id:$scope.mySelections[i].id, userName:$scope.mySelections[i].userName}
				selecttion.push(selDetail);
			}
		}
		if ($scope.mySelections2.length>0) {
			for (var i=0; i<$scope.mySelections2.length; i++) {
				if ($scope.mySelections2[i].name == $scope.orgName) {
					selDetail = {opType: "2", id:"0", userName:$scope.orgName}
					selecttion2.push(selDetail);
				} else {
					selDetail = {opType: "1", id:$scope.mySelections2[i].id, userName:$scope.mySelections2[i].name}
					selecttion2.push(selDetail);
				}
			}
		}
		selecttion = selecttion.concat(selecttion2);
		$modalInstance.close(selecttion);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

// 选择组织
routeApp.controller('selectSingleOrganizeCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService, OrgService, HttpService) {
	$scope.showAddOrgBtn = true;
	$scope.title= $translate.instant('workflow.selectOrg');
	var operationTemplate = '<div><div class="ngCellButton">'
			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyOrg(row.entity)" has-permission="ORGANIZATION_MODIFY" custom-title="{{\'common.modify\'|translate}}"></div>'
			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrg(row.entity)" has-permission="ORGANIZATION_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
			+'</div></div>';
	var column = [{field: 'name', displayName:$translate.instant('name'), sortable: true, width:'25%', cellTemplate:titleTemplate},
	              {field: 'templateNum', displayName:$translate.instant('common.templateNum'), sortable: true, width:'15%'},
	              {field: 'vmNum', displayName:$translate.instant('common.vmNum'), sortable: true, width:'15%'},
	              {field: 'runVmNum', displayName:$translate.instant('common.runVmNum'), sortable: true, width:'15%'},
	              {field: 'userNum', displayName:$translate.instant('common.userNum'), sortable: true, width:'15%'},
	              { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'15%', cellTemplate:operationTemplate}
	              ];
	$scope.mySelections = [];
	var param = {};
	if (params != null && params.type == constant.PUBLIC_CLOUD_CVM) {
		param = {type : params.type};
	}
	var url = "org/list";
    $scope = GridService.grid($scope, url, param, null, null, 'singleGrid');
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
	      i18n: $translate.instant('load.static.lang'),
	      totalServerItems: 'totalServerItems',
	      filterOptions: $scope.filterOptions,
	      pagingOptions: $scope.pagingOptions,
	      rowTemplate: doubleClickTemplate,    //双击行模板
	      columnDefs:column
  	};
	
	//注册刷新组织事件
    $scope.$on(constant.onRefreshOrgList, function(event, msg) {
        $scope.refreshPage();
    });
	
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
	$scope.modifyOrg = function (org) {
    	OrgService.modifOrg(org, $scope.refreshPage);
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
});
//选择组织用户分组
routeApp.controller('SelectSingleGroupCtrl',function(orgId, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('common.selectUserGroup');
	var column = [{field: 'name', displayName:$translate.instant('operator.groupName'), sortable: true, width:'40%'},
	              {field: 'desc', displayName:$translate.instant('operator.groupDesc'), sortable: true, width:'60%'}
	              ];
	$scope.mySelections = [];
	var params = {};
	var url = "org/grouplist?orgId=" + orgId;
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
	      showTreeExpandNoChildren: true,
	      enablePaging: false,
	      i18n: $translate.instant('load.static.lang'),
	      rowTemplate: doubleClickTemplate,    //双击行模板
	      columnDefs:column
  	};
	$http.get(url).success(function(data) {
		for (var i in data) {
			data[i].$$treeLevel = data[i].level;
		}
		$scope.myData = data;
	});
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});


//多选择组织用户分组
routeApp.controller('SelectMulGroupCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('common.selectUserGroup');
	$scope.helpFlag= "selUserGp";
	var column = [{field: 'name', displayName:$translate.instant('operator.groupName'), sortable: true, width:'40%'},
	              {field: 'description', displayName:$translate.instant('operator.groupDesc'), sortable: true, width:'60%'}
	              ];
	$scope.mySelections = [];
	var url = "org/grouplist?orgId=" + params.orgId;
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
	      showColumnMenu: true,
	      showFilter: false,
	      enableCellSelection: false,
	      enableCellEditOnFocus: false,
	      showTreeExpandNoChildren: true,
	      enablePaging: false,
	      i18n: $translate.instant('load.static.lang'),
	      columnDefs:column
  	};
	
	$scope.addUserGrp = function(){
		var addUserGrpModal = $modal.open({
            templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
            controller: 'addUserGrpCtrl',
            backdrop:'static',
            resolve:{
            	type:function(){return "orgAddGrp";},
            	rowObj:function(){return {orgId:params.orgId, orgName:params.name};}
            }
        });
        addUserGrpModal.result.then(function () {
    		$scope.refreshPage();
        }, function (reason) {
        });
	}

	
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

//选择组织用户
routeApp.controller('SelectSingleUserCtrl',function(orgId, $scope, $http, $modal, $translate, $timeout, $modalInstance,UtilService,GridService) {
	$scope.title=$translate.instant('common.selectUser');
	var column = [{ field: 'loginName', displayName: $translate.instant('user.loginName'), sortable: true, width:'10%'},
                  { field: 'userName', displayName: $translate.instant('user.userName'), sortable: true, width:'15%'},
                  { field: 'groupName', displayName: $translate.instant('user.userGroup'), sortable: true, width:'15%'},
                  { field: 'authType', displayName: $translate.instant('user.authentication'), sortable: true, width:'10%', cellFilter:"authType"},
                  { field: 'credentialNumber', displayName: $translate.instant('user.idNumber'), sortable: true, visible: false,width:'15%'},
                  { field: 'email', displayName: $translate.instant('user.email'), sortable: true, width:'10%'},
                  { field: 'phone', displayName: $translate.instant('user.phone'), sortable: true, width:'10%'},
                  { field: 'address', displayName: $translate.instant('user.mailingAddress'), sortable: true, visible: false, width:'15%'}
                  ];
	$scope.mySelections = [];
	var params = {};
	var url = "user/list?orgId=" + orgId;
	$scope = GridService.grid($scope, url, params);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            showSelectionCheckbox: false,
            multiSelect:false,
            showGroupPanel: false,
            showColumnMenu: true,
            showFilter: true,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: true,
            showFooter: true,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: {
      			filterText: "",
      			useExternalFilter: true
            },
            pagingOptions: $scope.pagingOptions,
            columnDefs:column,
            rowTemplate: doubleClickTemplate    //双击行模板
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
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
// 委托历史信息
routeApp.controller('entrustHistoryCtrl',function($scope, $http, $modal, $translate, $modalInstance,UtilService,GridService) {
	var typeTemplate='<div class="ngCellText" ng-class="col.colIndex()">' +
	'<span ng-if= \'row.entity[col.field] == 0\' >' + $translate.instant("entrust.allEntrust")+ '</span>' +
	'<span ng-if= \'row.entity[col.field] == 1\' >' + $translate.instant("entrust.vmWorkFLow") + '</span>' +
	'<span ng-if= \'row.entity[col.field] == 2\' >'+ $translate.instant("entrust.cloudDisk") + '</span>' +
	'<span ng-if= \'row.entity[col.field] == 3\' >'+ $translate.instant("entrust.userRegister") + '</span>' +
	'<span ng-if= \'row.entity[col.field] == 4\' >'+ $translate.instant("entrust.cloudBackupStrategy") + '</span>' +
	'</div>' ;
	
	
	var column = [{ field: 'entrustOpName', displayName: $translate.instant('entrust.mandatary') , sortable: true, width:'20%'},
	              { field: 'type', displayName: $translate.instant('entrust.entrust') ,cellTemplate:typeTemplate, sortable: true, width:'25%'},
	              { field: 'startTime', displayName: $translate.instant('entrust.entrustStartTime') , sortable: true, width:'25%' ,cellFilter:'date:"yyyy-MM-dd HH:mm:ss"'},
	              { field: 'endTime', displayName: $translate.instant('entrust.entrustEndTime') , sortable: true, width:'25%' ,cellFilter:'date:"yyyy-MM-dd HH:mm:ss"'}	              
				 ];
	var url = "workflow/entrystHistory";
	var params = {};
    $scope = GridService.grid($scope, url, params);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
	$scope.gridOptions = {
	  data: 'myData',
	  jqueryUITheme: false,
	  jqueryUIDraggable: true,
      showSelectionCheckbox: false,
      multiSelect: true,
      showGroupPanel: false,
      showColumnMenu: false,
      showFilter: false,
      enableCellSelection: false,
      enableCellEditOnFocus: false,
      enablePaging: false,
      showFooter: false,
      i18n: $translate.instant('load.static.lang'),
      totalServerItems: 'totalServerItems',
      columnDefs:column
  	};

	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//操作员列表控制器
routeApp.controller('OperatorListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
    var params = {};
//  params.id=$scope.id;
    var url = 'operator';
//    var statusTemplate='<div class="ngCellText" ng-class="col.colIndex()"> '+
//    '<span ng-if= \'row.entity[col.field] == "1"\' class="icon-active">{{\'common.enable\'|translate}}</span>' +
//    '<span ng-if= \'row.entity[col.field] == "0"\' class="icon-inactive">{{\'common.forbidden\'|translate}}</span></div>' ;
    var column = [
                  { field: 'loginName', displayName: $translate.instant('common.loginName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                  { field: 'userName', displayName: $translate.instant('common.operatorName'), sortable: true, width:'15%',cellTemplate:titleTemplate},
                  { field: 'enable', displayName: $translate.instant('common.state'),cellTemplate:statusTemplate2, sortable: true, width:'10%'},
                  { field: 'operatorGroup', displayName: $translate.instant('operator.opertorGrp'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'authType', displayName: $translate.instant('operator.authMode'), cellFilter:'authMode', sortable: true, width:'10%'},
                  { field: 'lastLoginTime', displayName: $translate.instant('operator.lastLoginTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'15%'},
                  { field: 'email', displayName:  'E-mail', sortable: false, width:'13%',cellTemplate:titleTemplate},
                  { field: 'phone', displayName:  $translate.instant('operator.phone'), sortable: false, width:'12%',cellTemplate:titleTemplate}
                  ]
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    $scope = GridService.grid($scope, url, params, null, null,'operatorListDivId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.$on('onQueryOperatorList', function(event, msg) {
        if (angular.isDefined(msg)) {
            $scope.params = msg;
        } else {
		    $scope.params = {};
		}
        $scope.pagingOptions.currentPage = 1;
        $scope.refreshPage();
        if (angular.isArray($scope.seleteOperator)) {
            $scope.seleteOperator.splice(0, $scope.seleteOperator.length);//clear select array
        }
        $scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
        if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
    });
    
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.seleteOperator,
            showSelectionCheckbox: true,
            multiSelect:true,
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
    
    if ($scope.$parent.pageType = 'listItem') {
        //if is operator list page ,support multi select
        $scope.gridOptions.multiSelect = true;
    } else {
        $scope.gridOptions.multiSelect = false;
    }
    
    $scope.modify = function() {
        
    }
    $scope.issue = function() {
        
    }
});
//访问策略列表控制器
routeApp.controller('AccessStrategyListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
    var params = {};
//  params.id=$scope.id;
    var url = 'accessStrategy';
    var statusTemplate='<div class="ngCellText" ng-class="col.colIndex()"> '+
    '<span ng-if= \'row.entity[col.field] == "1"\' class="icon-active">{{\'securityMng.enable\'|translate}}</span>' +
    '<span ng-if= \'row.entity[col.field] == "0"\' class="icon-inactive">{{\'securityMng.refuse\'|translate}}</span></div>' ;
    var column = [
                  { field: 'name', displayName: $translate.instant('securityMng.strategyName'), sortable: true, width:'20%',cellTemplate:titleTemplate},
                  { field: 'description', displayName: $translate.instant('securityMng.strategyDesc'), sortable: true, width:'20%',cellFilter:'nullStr',cellTemplate:titleTemplate},
                  { field: 'timerDisplay', displayName: $translate.instant('securityMng.accTimeCtr'), sortable: false, width:'30%',cellTemplate:titleTemplate},
                  { field: 'defaultAccessAction', displayName: $translate.instant('securityMng.defaultAccessType'),cellTemplate:statusTemplate, sortable: true, width:'10%'},
                  { field: 'createTime', displayName: $translate.instant('securityMng.createTime'), cellFilter:'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'20%'}
                 ];
    //由增加操作员弹窗内选择访问策略列表跳转过来
    if($scope.$parent.isSelector){
    	column = [
                  { field: 'name', displayName: $translate.instant('securityMng.strategyName'), sortable: true, width:'10%',cellTemplate:titleTemplate},
                  { field: 'description', displayName: $translate.instant('securityMng.strategyDesc'), sortable: true, width:'12%',cellFilter:'nullStr',cellTemplate:titleTemplate},
                  { field: 'timerDisplay', displayName: $translate.instant('securityMng.accTimeCtr'), sortable: false, width:'30%',cellTemplate:titleTemplate},
                  { field: 'defaultAccessAction', displayName: $translate.instant('securityMng.defaultAccessType'),cellTemplate:statusTemplate, sortable: true, width:'15%'},
                  { field: 'createTime', displayName: $translate.instant('securityMng.createTime'), cellFilter:'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'18%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'15%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div has-permission="ACCESS_STRATEGY_MODIFY" type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyAccessStrategy(row.entity)" has-permission="ACCESS_STRATEGY_MODIFY" custom-title="'+$translate.instant('securityMng.modifyAccessStrategy')+'"></div>'
	            	  +'<div has-permission="ACCESS_STRATEGY_DELETE" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="deleteAccessStrategy(row.entity)" has-permission="ACCESS_STRATEGY_DELETE" custom-title="'+$translate.instant('securityMng.delAccessStrategy')+'"></div>'
	            	  +'<div has-permission="ACCESS_STRATEGY_VIEW" type="button" class="btn btn-sm-icon icon-preview-gray" ng-click="viewAccessStrategy(row.entity)" has-permission="ACCESS_STRATEGY_VIEW" custom-title="'+$translate.instant('securityMng.viewAccessStrategy')+'"></div>'
	            	  +'</div></div>'
	              }
                 ];
    	  //修改访问策略
        $scope.modifyAccessStrategy = function(rowObj) {
            var waitModal = UtilService.wait();
            $http({
               method: 'GET',
               url: 'accessStrategy/' + rowObj.id
            }).success(function(result) {
                waitModal.dismiss();
                if (result.success == true) {
                    var modalInstance = $modal.open({
                        templateUrl: 'html/modal/systemManage/addAccessStrategy.html',
                        controller: 'addAccessStrategyCtrl',
                        backdrop:'static',
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
                    	$scope.refreshList();
                    }, function (reason) {
                    });
                } else if (result.failureMessage){
                    UtilService.error(result.failureMessage);
                	$scope.refreshList();
                }           
            }).error(function(response, code, headers, config) {
                waitModal.dismiss();
                UtilService.handleError(code);
            });
        };
        //查看访问策略
        $scope.viewAccessStrategy = function(rowObj) {
            var waitModal = UtilService.wait();
            $http({
                method: 'GET',
                url: 'accessStrategy/' + rowObj.id
             }).success(function(result) {
                waitModal.dismiss();
                if (result.success == true) {
                    var modalInstance = $modal.open({
                        templateUrl: 'html/modal/systemManage/addAccessStrategy.html',
                        controller: 'addAccessStrategyCtrl',
                        backdrop:'static',
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
                } else if (result.failureMessage){
                    UtilService.error(result.failureMessage);
                	$scope.refreshList();
                } 
             });
        };
        
        //删除访问策略
        $scope.deleteAccessStrategy = function(rowObj) {
            var modalInstance = UtilService.confirm($translate.instant('securityMng.deleteConfirm'),$translate.instant('operConfirm'));
            modalInstance.result.then(function (selectedItem) {
           	 //make the select obj to a list for multi delete
           	 var delAccess = [],accessStrategy={};
           	 accessStrategy.id = rowObj.id;
             accessStrategy.name = rowObj.name;
           	 delAccess.push(accessStrategy);
             HttpService.put('accessStrategy/delete', delAccess, modalInstance, $scope.refreshList());
            }, function () {
           	 
            });
        };
    }
    
    $scope = GridService.grid($scope, url, params,null, null,'accessStrategyGridList');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    if (angular.isArray($scope.$parent.seleteAccessStrategy)) {
        $scope.seleteAccessStrategy = $scope.$parent.seleteAccessStrategy;
    }
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    //刷新当前页
    $scope.$on('onQueryAccessStrategy', function(event, msg) {
    	$scope.refreshList(msg);
    });
    //刷新访问策略列表
    $scope.refreshList=function (msg){
         if (angular.isDefined(msg)) {
              $scope.params = msg;
         }
         $scope.refreshPage();
         if (angular.isArray($scope.seleteAccessStrategy)) {
              $scope.seleteAccessStrategy.splice(0, $scope.seleteAccessStrategy.length);//clear select array
         }
		 $scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
		 if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		 }

    };
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.seleteAccessStrategy,
            showSelectionCheckbox: $scope.$parent.isSelector? false : true,
            multiSelect: $scope.$parent.isSelector? false : true,
            showGroupPanel: false,
            showColumnMenu: false,
            showFilter: true,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: true,
            showFooter: true,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
            pagingOptions: $scope.pagingOptions,
            filterOptions : {
    			filterText: "",
    			useExternalFilter: true
    		},
            columnDefs:column,
            rowTemplate: doubleClickTemplate    //双击行模板
    };
    
    $scope.jump = function(entity) {
        if ($scope.$parent.isSelector == true && angular.isFunction($scope.$parent.ok)) {
            $scope.$parent.ok.apply();
        } else {
            if ($scope.isSelector == true && angular.isFunction($scope.ok)) {
                $scope.ok.apply();
            }
        }
    };
    
    $scope.$on('ngGridEventFilter', function(event, msg) {
		// 设置时间间隔
		if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
			$timeout.cancel($scope.keyInterval);
		}
		$scope.keyInterval = $timeout(function() {
			params.name = msg;
			$scope.pagingOptions.currentPage = 1;
			$scope.refreshPage();
		}, constant.keyInterval);
	});
});
//访问策略规则列表
routeApp.controller('accessRuleListCtrl',function($scope, $http, $modal, $translate, UtilService, GridService) {
    //表头
    var column = [{field: 'startIp', displayName: $translate.instant('securityMng.startIp') , sortable: true, width:'30%'},
                  {field: 'endIp', displayName: $translate.instant('securityMng.endIp') , sortable: true, width:'30%'},
                  {field: 'accessAction', displayName: $translate.instant('securityMng.accessType') , sortable: true, width:'20%',cellFilter:'accessType'},
                  {field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate: 
                    	  '<div><div class="ngCellButton">'
                	  	  +'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-show="accessOprType" ng-click="editAccessRule(row.entity)" custom-title="'+$translate.instant('common.modify')+'"></div>'
                          +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-show="accessOprType" ng-click="deleteRule(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
                          +'</div></div>'}];
    if ("view" == $scope.$parent.type) {
    	column = [{field: 'startIp', displayName: $translate.instant('securityMng.startIp') , sortable: true, width:'35%'},
                  {field: 'endIp', displayName: $translate.instant('securityMng.endIp') , sortable: true, width:'35%'},
                  {field: 'accessAction', displayName: $translate.instant('securityMng.accessType') , sortable: true, width:'30%',cellFilter:'accessType'}];
    }

    //demo数据
    $scope.data = $scope.entry.accessRules;

    //创建表格
    $scope.gridOptions = {
            data: 'data',
            jqueryUITheme: false,
            jqueryUIDraggable: true,
            selectedItems: $scope.selItems,
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
//            totalServerItems: 'totalServerItems',
            filterOptions: false,
            pagingOptions: false,
            columnDefs:column
    }
});

//ldap服务器设置
routeApp.controller('ldapServerConfigListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
  //------------------------- 权限信息 ---------------------
//    var permissions = localStorage.getItem("permissions");
//    if (angular.isDefined(permissions)) {
//        var permissonArr = JSON.parse(permissions);
//        if (angular.isArray(permissonArr)) {
//           $scope.showOperatorOffline = permissonArr.contains(constant.OPERATOR_OFFLINE);
//        } else {
//           $scope.showOperatorOffline = true;
//        }
//    } else {
//        $scope.showOperatorOffline = true;
//    }
    //-------------------------------------------------------
    var params = {};
//  params.id=$scope.id;
    var url = 'ldap/queryServerConfig';
    var serverTypeTemplate = '<div class="ngCellText"> '+
    '<span ng-if= "row.entity.serverType == 1">' + $translate.instant('ldap.authLdapTypeLdap') + '</span>' +
    '<span ng-if= "row.entity.serverType == 2">' + $translate.instant('ldap.authLdapTypeAd') + '</span>' +
    '</div>';
    var column = [
                  { field: 'name', displayName: $translate.instant('ldap.ldapServerName'), sortable: true, width:'15%'},
                  { field: 'serverType', displayName: $translate.instant('ldap.serverType'), sortable: true, width:'15%',cellTemplate:serverTypeTemplate},
                  { field: 'ipAddr', displayName: $translate.instant('ldap.authLdapAddr'), sortable: true, width:'15%'},
                  { field: 'baseDn', displayName: $translate.instant('ldap.authLdapBaseDn'), sortable: true, width:'20%'},
                  { field: 'adminDn', displayName: $translate.instant('ldap.authLdapAdminDn'), sortable: true, width:'15%'},
                  {field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'20%',
                      cellTemplate: '<div><div class="ngCellButton">'
                    	  +'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="LDAP_SERVER_DEL" ng-click="deleteLdapServerConfig(row.entity)" custom-title="'+$translate.instant('ldap.deleteLdapServerConfig')+'"></div>'
		            	  +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="LDAP_SERVER_EDIT" ng-click="editLdapServerConfig(row.entity)" custom-title="'+$translate.instant('ldap.editLdapServerConfig')+'"></div>'
		            	  +'<div type="button" class="btn btn-sm-icon icon-view-detail-gray" has-permission="LDAP_SERVER_VIEW" ng-click="viewLdapServerConfig(row.entity)" custom-title="'+$translate.instant('ldap.viewLdapServerConfig')+'"></div>'
		            	  +'<div type="button" class="btn btn-sm-icon icon-synchronize-gray" has-permission="LDAP_SERVER_VIEW" ng-click="checkLdapServerConfig(row.entity)" custom-title="'+$translate.instant('ldap.checkLdapServerConfig')+'"></div>'
                          +'</div></div>'}
                  ];
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    $scope = GridService.grid($scope, url, params);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.$on('onQueryLdapServerConfigList', function(event, msg) {
        if (angular.isDefined(msg)) {
            $scope.params = msg;
        }
        $scope.refreshPage();
    });
    
    if ($scope.$parent.mySelections) {
		$scope.mySelections = $scope.$parent.mySelections;
	}
    
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
    
    
    $scope.editLdapServerConfig = function(row) {
    	var waitModal = UtilService.wait();
		$http.get('ldap/queryLdapServerById?id=' + row.id).success(function(result) {
			if (result.success) {
				var modalInstance = $modal.open({
		    		templateUrl: 'html/modal/systemManage/ldap/addLdapServerConfig.html',
		    		controller: 'addLdapServerConfigCtrl',
		    		backdrop:'static',
		    		size:'lg',
		    		resolve:{
		                mode:function(){return 'modify';},
		                id:function(){return row.id;},
		                data:function(){return result.data}
		    		}
		    	});
		    	modalInstance.result.then(function () {
		    		$scope.refreshPage();
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
    
    $scope.viewLdapServerConfig = function(row) {
    	var waitModal = UtilService.wait();
		$http.get('ldap/queryLdapServerById?id=' + row.id).success(function(result) {
			if (result.success) {
				var modalInstance = $modal.open({
		    		templateUrl: 'html/modal/systemManage/ldap/viewLdapServerConfig.html',
		    		controller: 'addLdapServerConfigCtrl',
		    		backdrop:'static',
		    		resolve:{
		                mode:function(){return 'view';},
		                id:function(){return row.id;},
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
    
    
    //刷新ldap服务器列表
	 var refreshLdapServer = function() {
		 $scope.$root.$broadcast('onQueryLdapServerConfigList', {});
	 }
    
    $scope.deleteLdapServerConfig = function(row) {
    	var modalInstance = UtilService.confirm($translate.instant('ldap.delLdapServerConfirm',{value:row.name}),$translate.instant('operConfirm'));
    	modalInstance.result.then(function (selectedItem) {
    		var url = 'ldap/deleteLdapServerConfig?id=' + row.id;
    		HttpService.delete(url, undefined, modalInstance, refreshLdapServer);
    	}, function () {
    	});
    };
    
    $scope.checkLdapServerConfig = function(row) {
    	var waitModal = UtilService.wait();
    	$http.get('ldap/queryLdapServerById?id=' + row.id).success(function(result) {
			if (result.success) {
				waitModal.dismiss();
				result.data.fun = 'test';
		    	var url = 'ldap/queryLdapConnectTest';
		    	HttpService.post(url, result.data, undefined, undefined);
			} else {
				UtilService.handleResult(result);
				waitModal.dismiss();
			}
		}).error(function(response, code, headers, config) {
	      	  waitModal.dismiss();
	    	  UtilService.handleError(code);
			});
//    	var params = {};
//    	params.serverName = row.serverName;
//    	params.serverIp = row.ldapServerAddr;
//    	params.serverPort = row.ldapServerPort;
//    	params.serverVersion = row.ldapVersion;
//    	params.serverType = row.ldapType;
//    	params.connectionTimeout = row.connectionTimeout;
//    	params.syncTimeout = row.syncTimeout;
//    	params.baseDn = row.ldapBaseDn;
//    	params.adminDn = row.ldapAdminDn;
//    	params.adminPwd = row.ldapAdminPwd;
//    	params.userNameAttrName = row.ldapUserNameAttrName;
    	
        };
});
//在线操作员列表控制器
routeApp.controller('OnlineOperatorListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
  //------------------------- 权限信息 ---------------------
    var permissions = localStorage.getItem("permissions");
    if (angular.isDefined(permissions)) {
        var permissonArr = JSON.parse(permissions);
        if (angular.isArray(permissonArr)) {
           $scope.showOperatorOffline = permissonArr.contains(constant.OPERATOR_OFFLINE);
        } else {
           $scope.showOperatorOffline = true;
        }
    } else {
        $scope.showOperatorOffline = true;
    }
    //-------------------------------------------------------
    var params = {};
//  params.id=$scope.id;
    var url = 'operator/online';
    var column = [
                  { field: 'loginName', displayName: $translate.instant('common.loginName'), sortable: true, width:'15%'},
                  { field: 'userName', displayName: $translate.instant('common.operatorName'), sortable: true, width:'15%'},
                  { field: 'operatorGroupName', displayName: $translate.instant('operator.opertorGrp'), sortable: true, width:'15%'},
                  { field: 'loginTime', displayName: $translate.instant('operator.loginTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'15%'},
                  { field: 'loginIp', displayName: $translate.instant('common.address'), sortable: true, width:'15%'},
                  { field: 'sessionId', displayName: $translate.instant('operator.sessionId'), sortable: true, width:'25%'},
                
                  ]
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    //销毁遮罩层
	$scope.$on("$destroy", function() {
		UtilService.dismissAreawait("onlineOperatorGrid" + constant.AREAWAIT);
    });
    
    $scope = GridService.grid($scope, url, params, null, null, 'onlineOperatorGrid');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    $scope.$on('onQueryOnlineOperator', function(event, msg) {
        if (angular.isDefined(msg)) {
            $scope.params = msg;
        }
        $scope.refreshPage();
    });
    
    $scope.refresh = function(msg) {
		$scope.pagingOptions.currentPage = 1;
		$scope.refreshPage();
		$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
	}
    
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
    $scope.filter = function() {
        var modalInstance = UtilService.modal('html/modal/systemManage/onlineOperatorFilter.html', 'onlineOperatorFilterCtrl',{
        	filter: function () {
                return $scope.params;
        	}
        });
        modalInstance.result.then(function (data) {
        	if (angular.isObject(data)) {
                $scope.params = {};
                if (angular.isDefined(data.loginName)) {
                    $scope.params.loginName = data.loginName;
                }
                if (angular.isDefined(data.userName)) {
                    $scope.params.userName = encodeURIComponent(data.userName);
                }
                if (angular.isDefined(data.loginIP)) {
                    $scope.params.loginIp = data.loginIP;
                }
                $scope.pagingOptions.currentPage = 1;
                $scope.refreshPage();
            }
        }, function (reason) {
            
        });
    }
    $scope.offline = function() {
        if ($scope.mySelections.length == 0) {
//            UtilService.alert($translate.instant('operator.selectOperatorConfirm'), $translate.instant('common.opertip'), false, 'error');
            return;
        }
        var modalInstance = UtilService.confirm($translate.instant('operator.offlineConfirm'),$translate.instant('operConfirm'));
         modalInstance.result.then(function (selectedItem) {
             var offOperators = [];
             for (var i = 0; i < $scope.mySelections.length; i++) {
                 offOperators.push($scope.mySelections[i].sessionId)
             }
             HttpService.put('operator/offline', offOperators, modalInstance, $scope.refreshPage);
         }, function () {
         });
    }
});
//操作日志列表控制器
routeApp.controller('OperlogListCtrl',function($scope, $rootScope, $state, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
	var params = {};
	var adjust = LIST_HEIGHT_ADD_90;
	if ($state.current.name != 'main.operlog') {
		//when in host, cluster Task list
		params.category=$scope.category;
		params.targetId=$scope.targetId;
		adjust = 0;
	}
	var url = 'operlog/list';
	$scope.$on(constant.onFilterOperlogList, function(event, msg){
		if (angular.isDefined(msg)) {
		$scope.params = {};
			if ($state.current.name != 'main.operlog') {
				//when in host, cluster Task list
				$scope.params.category=$scope.category;
				$scope.params.targetId=$scope.targetId;
			}
			if(angular.isDefined(msg.loginName)){
				$scope.params.loginName = msg.loginName;
			}
			if(angular.isDefined(msg.userName)){
				$scope.params.userName = msg.userName;
			}
			if(angular.isDefined(msg.operTime_from)){
				$scope.params.operTime_from = msg.operTime_from;
			}
			if(angular.isDefined(msg.operTime_to)){
				$scope.params.operTime_to = msg.operTime_to;
			}
			if(angular.isDefined(msg.address)){
				$scope.params.address = msg.address;
			}
			if(angular.isDefined(msg.category)){
				$scope.params.category = msg.category;
			}
			if(angular.isDefined(msg.result)){
				$scope.params.result = msg.result;
			}
			if(angular.isDefined(msg.description)){
				$scope.params.description = msg.description;
			}
			if(angular.isDefined(msg.target_id)){
				$scope.params.target_id = msg.target_id;
			}
		} else {
			//refresh
			if ($state.current.name != 'main.operlog') {
				//when in host, cluster Task list
				$scope.params.category=$scope.category;
				$scope.params.targetId=$scope.targetId;
			}
		}
		if ($scope.pagingOptions.currentPage != 1){
			//invoke getPagedDataAsync
			$scope.pagingOptions.currentPage = 1;
		} else {
			$scope.refreshPage();
		}
	});
	
	var column = [{ field: 'loginName', displayName: $translate.instant('common.loginName') , sortable: true, width:'11%'},
                  { field: 'userName', displayName: $translate.instant('common.operatorName') , sortable: true, width:'8%'},
                  { field: 'operTime', displayName: $translate.instant('common.finishTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'15%'},
                  { field: 'address', displayName: $translate.instant('common.address'), sortable: true, width:'10%'},
                  { field: 'category', displayName: $translate.instant('common.category'), sortable: true, width:'10%'},
                  { field: 'description', displayName: $translate.instant('common.operDesc'), sortable: true, width:'20%',cellTemplate:titleTemplate},
                  { field: 'result_int', displayName: $translate.instant('common.result'), sortable: true, width:'10%', cellTemplate:resultTemplate},
                  { field: 'failureReason', displayName: $translate.instant('common.failReson'), sortable: false, width:'15%',cellTemplate:titleTemplate}
                 ]
	
	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(adjust);
	listenNavClick($scope, $timeout, adjust);
	
	$scope = GridService.grid($scope, url, params, null, null, "operlogDivId");
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
});
/**
 * 流程定制列表
 */
routeApp.controller('WorkflowListCtrl',function($scope, $rootScope, $state, $http, $modal, $translate, $timeout, UtilService, GridService, HttpService) {
	var params = {"sortDir":1,"sortField":"id"};
    var url = 'workflow';
    var column = [
                  { field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'20%'},
                  { field: 'desc', displayName: $translate.instant('common.desc'), sortable: true, width:'70%',cellFilter:'nullStr'},
                  { field: 'oper', displayName: $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
                  	 '<div><div class="ngCellButton">'
                  	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="CUSTWORKFLOW_MNG" ui-sref="main.workflowStep({id:\'{{row.entity.id}}\'})" custom-title="'+$translate.instant('common.workflowStepSet')+'"></div>'
                  	 +'</div></div>'
                    }
                 ]
    $scope = GridService.grid($scope, url, params);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    
    //动态调整表格大小
    $scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    
    //刷新当前页
    $scope.$on('onQueryWorkflowList', function(event, msg) {
        $scope.refreshPage();
    });
    
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
});

//选择childBaseDn
routeApp.controller('childBaseDnListCtrl',function($scope, $http, $modal, $translate, $modalInstance, serverId, UtilService, GridService) {
	
	var column = [{ field: 'subBaseDN', displayName: $translate.instant('ldap.childBaseDn') , sortable: true, width:'100%',cellTemplate:titleTemplate}
                ];
	
	$scope.mySelections = [];
	$scope.headTitle = $translate.instant('ldap.childBaseDn');
	var params = {};
	params.serverId = serverId;
	var url = 'ldap/querySubBaseDN';
    $scope = GridService.grid($scope, url, params);
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
      enablePaging: false,
      showFooter: false,
      i18n: $translate.instant('load.static.lang'),
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
		$modalInstance.close($scope.mySelections[0]);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
});

//storage pool 选择控制器。
routeApp.controller('storagePoolSelectInHostCtrl',function($scope, $http, $translate, $modalInstance, $modal, paramsObj, UtilService, HttpService, GridService) {
    $scope.mySelections = [];           //选中的存池
    $scope.isSelector = true;
    
	var params = {
		"id" :paramsObj.hostId,
		"cloudId" :paramsObj.cloudId
	};
	if (paramsObj.mode) {
		// 0： 全部查询，1：查询块, 2: 查询文件
		params.mode = paramsObj.mode;
		if (paramsObj.mode == 2) {
		}
	}
	if (paramsObj.type) {
		params.type = paramsObj.type;
	}
	if (paramsObj.blockType) {
		params.blockType = paramsObj.blockType;
	}
	if (paramsObj.exceptPoolName) {
		params.exceptPoolName = paramsObj.exceptPoolName;
	}
	// 存储池状态 0：不活动，1：活动
	params.status = 1;
	var url = $scope.url;
	if (typeof url == 'undefined') {
		url = "storage/queryStoragePoolList";
	}
	
    var storagePoolstatusTemplate='<div class="ngCellText" ng-class="col.colIndex()">' +
    '<span ng-if= \'row.entity[col.field] == "0"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">' + $translate.instant("common.inactive")+ '</span></span>' +
    '<span ng-if= \'row.entity[col.field] == "1"\'><span class="icon-active"></span><span class="span_padding"></span><span class="cell-icon-text">' + $translate.instant("common.active") + '</span></span>' +
    '<span ng-if= \'row.entity[col.field] == "2"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">'+ $translate.instant("common.unkown") + '</span></span>' +
    '</div>' ;
    var column = null;
    if (angular.isDefined($scope.isCluster) && $scope.isCluster == 'true') {
		column = [{ field: 'name', displayName: $translate.instant('vm.storagepoolModal.title') , sortable: true, width:'100%'}];
	} else {
		column = [{ field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'20%'},
	              { field: 'type', displayName: $translate.instant('common.type'), cellFilter:'storageType', sortable: true, width:'15%'},
	              { field: 'path', displayName: $translate.instant('host.path'), sortable: true, width:'25%'},
	              { field: 'maxSize', displayName: $translate.instant('cluster.maxStorage'), cellFilter:'byteUnitRender',sortable: true, width:'15%'},
	              { field: 'remainSize', displayName: $translate.instant('cluster.availableStorage'), cellFilter:'byteUnitRender',sortable: true, width:'13%'},
	              { field: 'status', displayName: $translate.instant('common.state'), cellTemplate:storagePoolstatusTemplate, sortable: true, width:'12%'},];
	}
    $scope = GridService.grid($scope, url, params, null, null, 'storagepoolSelectorInHost');
    $scope.getDataAsync();
    
    if (angular.isDefined($scope.$parent.mySelections)) {
		$scope.mySelections = $scope.$parent.mySelections;
	}
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
            i18n: $translate.instant('load.static.lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: $scope.filterOptions,
            columnDefs:column,
            rowTemplate: doubleClickTemplate    // 双击行模板
        };   
    
    $scope.jump = function(entity) {
    	if ($scope.$parent.isSelector == true && angular.isFunction($scope.$parent.ok)) {
    		$scope.$parent.ok.apply();
    	} else {
    		if ($scope.isSelector == true && angular.isFunction($scope.ok)) {
    			$scope.ok.apply();
    		}
    	}
    };
    $scope.$on('onQueryStoragePoolList', function(event, msg) {
        $scope.refreshPage();
    });
    
//    //增加存储池
//    $scope.addStoragePool = function() {
//       var modalInstance = $modal.open({
//          templateUrl: 'html/modal/host/addStoragePool.html',
//          controller: 'addStoragePoolCtrl',
//          backdrop: 'static',
//          size:"lg",
//          resolve: {
//              hostId: function () {
//                  return paramsObj.hostId;
//              },
//              mode:function() {return paramsObj.mode;}
//          }
//       });
//       modalInstance.result.then(function (selectedItem) {
//       }, function () {
//       });
//    }; 
    $scope.ok = function () {
        var param = {};
        if ($scope.mySelections.length == 1) {
            param.name = $scope.mySelections[0].name;
            param.path = $scope.mySelections[0].path;   
            param.storagepoolName=$scope.mySelections[0].title;
        };
        
        $modalInstance.close(param);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

routeApp.controller('ShowErrorCtrl',function($scope, $translate, $modalInstance, $timeout, title, store, UtilService, GridService) {
	var column = [{ field: 'errorInfo', displayName: '' , sortable: false, width:'100%', cellTemplate:titleTemplate}];
	$scope = GridService.grid($scope);
	$scope.title = title;
	$scope.myData = store;
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
	        selectedItems: $scope.mySelections,
	        showGroupPanel: false,
	        showFilter: false,
	        enableCellSelection: false,
	        enableCellEditOnFocus: false,
	        i18n: $translate.instant('load.static.lang'),
	        columnDefs:column,
	        headerRowHeight:0
	};
	
	//动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	}
});


//host Disk partition rate info list Controller
routeApp.controller('vmDiskPartitionListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService) {
	var url = 'domain/partitionRate?cloudId=' + $scope.cloudId + '&id=' + $scope.vmId;
	var column = [{ field: 'sysPartition', displayName: $translate.instant('host.sysPartition'), sortable: true, width:'25%'},
                  { field: 'capabilityGB', displayName: $translate.instant('host.capacity') + '(GB)', sortable: true, width:'25%'},
                  { field: 'useCapability', displayName: $translate.instant('host.useCapability') + '(GB)', sortable: true, width:'25%'},
                  { field: 'occRate', displayName: $translate.instant('host.occRate') + '(%)', sortable: true, width:'25%'}]
	
	$scope = GridService.noMaskGrid($scope, url);
	$scope.getDataAsync();
	
	// 动态调整表格大小
    $scope.listStyle = $scope.gridStyle(15, true);
    listenNavClick($scope, $timeout, 15, true);
	
	// refresh grid
	$scope.$on('onRefreshVmDiskPartitionList', function(event, msg) {
		$scope.refreshPage();
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
        columnDefs:column
    };
});


//【虚拟机】/【控制台】
routeApp.controller('ConsoleCtrl',function($scope, $http, $modal, $translate,$timeout, UtilService,GridService) {
	$scope.styleTimer = $timeout(function(){
		$scope.rightStyle = {};
		$scope.rightStyle.width = $(".flex-box").width() - $(".description").width() - 30 + "px";
	});
	
	$scope.isWindows = UtilService.isWindows();
	$scope.isLinux = UtilService.isLinux();
	$scope.summary = {};
	$scope.summary.title = 'aa';
//	$http.get('domain/'+ $scope.vmId + "/summary").success(function(result) {
//		$scope.summary = result.data;
//	});
	$.ajax({
		url: "domain/summary/new?cloudId=" + $scope.cloudId + "&vmId=" + $scope.vmId,
		type: 'GET',
		dataType: 'json',
		async: false,
		success: function(result){
			$scope.summary = result.data;
		}
	});
	// 接收刷新页面的事件
    $scope.$on('onMessage', function(event,msg){
    	if (angular.isArray(msg.refreshData)) {
    		var data = msg.refreshData[0];
    		if (angular.isDefined(data)) {
    			if (data.value == $scope.vmId) {
    				$http.get("domain/summary?cloudId=" + $scope.cloudId + "&vmId=" + $scope.vmId).success(function(result) {
    					$scope.summary = result.data;
    				});
    			}
    		}
    	}
    	
    });
	$http.get("domain/domainScreen?cloudId=" + $scope.cloudId + "&id=" + $scope.vmId).success(function(result) {
		$scope.domainScreen = "domain/domainScreenUrl?cloudId=" + $scope.cloudId + "&id=" + $scope.vmId + "&" + new Date();
		if (result) {
			$scope.domainScreenAlt = result.data.xml;
		} else {
			$scope.domainScreenAlt = $translate.instant('vm.screenFail');
		}
	});
	var params = {};
	params.id=$scope.id;
	params.vmId=$scope.id;
	var url = "domain/network?cloudId=" + $scope.cloudId + "&id=" + $scope.vmId;
	var column = [{ field: 'mac', displayName: $translate.instant('host.mac') , sortable: true, width:'30%'},
	              { field: 'ip', displayName: $translate.instant('host.ip'), sortable: true, width:'30%'},
	              { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'40%',cellTemplate:
	            	  '<div><div class="ngCellButton">'
	            	  +'<div type="button" class="btn btn-sm-icon icon-vm-rdp-gray" ng-click="rdp(row.entity)" custom-title="'+$translate.instant('vm.remoteDesktop')+'"></div>'
	            	  +'</div></div>'
	              }
	              ]
	$scope = GridService.grid($scope, url, params);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
	
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: false,
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
	var consoleParams = {};
	consoleParams.id = $scope.vmId;
	consoleParams.cloudId = $scope.cloudId;
	consoleParams.title = $scope.summary.title;
	$scope.openVNC = function() {
		if ($scope.summary.displayType != "VNC") {
			UtilService.error($translate.instant("vm.vncDeleted"));
			return;
		}
		UtilService.openConsole(consoleParams, false);
	};
	
    $scope.openNoNVC = function() {
    	if ($scope.summary.displayType != "VNC") {
			UtilService.error($translate.instant("vm.vncDeleted"));
			return;
		}
    	UtilService.openConsole(consoleParams, true);
	};
	// 远程桌面
	$scope.rdp = function(rowEntity) {
		if (rowEntity.ip != null && rowEntity.ip != '') {
			UtilService.rdp(rowEntity.ip);
		}
	};
	// 下载jre
	$scope.downloadJre = function(type) {
		var param = "height=105, width=200, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
		if (type == 'windows') {
	    	window.open("jre-7u51-windows-i586.exe", "_blank", param);
		} else if (type == 'linux') {
	    	window.open("jre-7u79-linux-i586.tar.gz", "_blank", param);
		}
	}
	$scope.$on("$destroy", function(){
		if (angular.isDefined($scope.styleTimer)){
			$timeout.cancel($scope.styleTimer);
		}
	});
});

//主机下存储列表controller.
routeApp.controller('SelectStorageListInHostCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService, HttpService, PermissionService) {
	$scope.noselected = true;
	$scope.isFCBlock = false;
	$scope.isPoolActive = true;
	$scope.params = {};
	if (angular.isDefined($scope.cloudId)) {
		$scope.params.cloudId = $scope.cloudId;
	}
	$scope.params.id = $scope.id;
	if (angular.isDefined($scope.hostId)) {
		$scope.params.id = $scope.hostId;
	}
	
	var params = $scope.params;
	$scope.url = 'storage/queryStoragePoolList';
	$scope.url2 = 'storage/queryStorageVolumeList';
	
	column = [{ field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'80%',cellTemplate:titleTemplate},
	          { field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'20%',cellTemplate:
                  '<div><div class="ngCellButton">'
                  +'<div ng-if="row.entity.status==1" type="button" class="btn btn-sm-icon icon-synchronize-gray" ng-click="refreshStoragePool(row.entity)" custom-title="'+$translate.instant('storagePool.refreshStoragePool')+'"></div>'
                  +'<div ng-if="row.entity.status!=1" type="button" class="btn btn-sm-icon icon-synchronize-gray" disabled custom-title="'+$translate.instant('storagePool.refreshStoragePool')+'"></div>'
                  +'</div></div>'
               }];
	volumeCol = [{ field: 'name', displayName: $translate.instant('host.filename') , sortable: true, width:'30%',cellTemplate:titleTemplate},
                 { field: 'size', displayName: $translate.instant('host.filesize'), cellFilter:'byteUnitRender', sortable: true, width:'20%'},
                 { field: 'format', displayName: $translate.instant('common.type'), sortable: true, width:'20%'},
                 { field: 'list', displayName: $translate.instant('host.user'), sortable: true, width:'30%',cellTemplate:titleTemplate}];

	var poolListId = 'storagePoolListSelectorDivId';;
	var volumesListId = 'storageListSelectorDivId';
	
	$scope = GridService.grid($scope, null, null, null, null, poolListId);
	$scope = GridService.grid2($scope, null, null, null, null, volumesListId);
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, true);
	
	if ($scope.$parent.mySelections) {
		$scope.mySelections = $scope.$parent.mySelections;
	}
	if ($scope.$parent.mySelections2) {
		$scope.mySelections2 = $scope.$parent.mySelections2;
	}
	
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
        i18n: $translate.instant('load.static.lang'),
        totalServerItems: 'totalServerItems',
        filterOptions: $scope.filterOptions,
        beforeSelectionChange: function (rowItem, event) {
		    return beforeSelectionChange(rowItem, event);
        },
        afterSelectionChange: function (rowItem, event) {   // 选中事件完成后触发
            // 选择其他存储池时, 先清空选中的存储卷
            $scope.clearMySelections2();
        	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {     // 在点击时，因为会有原来行与新选中行，这里只需要新选中行。
        		// 向父congroller传播事件
// $scope.$emit("onStorageListSelected", rowItem.entity);
        		if ($scope.noselected == true) {
        			$scope.noselected = false;
        		}
        		if (rowItem.entity.path == constant.FCPATH) {
        			$scope.isFCBlock = true;
        		} else {
        			$scope.isFCBlock = false;
        		}
        		
        		if (rowItem.entity.status != 1) {
        			$scope.isPoolActive = false;
        		} else {
        			$scope.isPoolActive = true;
        		}
        		$scope.selectedPool = rowItem.entity.name;
        		$scope.params2.spName = rowItem.entity.name;
                $scope.params2.path = rowItem.entity.path;
                $scope.params2.type = rowItem.entity.type;
                $scope.params2.cloudId = $scope.cloudId;
                //修改问题单：201606080236 解决更换选中的存储池，存储卷列表的分页显示为2/1的问题。
                $scope.pagingOptions2.currentPage = 1;
        		$scope.getPagedDataAsync2($scope.pagingOptions2.pageSize, 1);
            }
        },
        columnDefs:column
    };    
    
    $scope.$on('ngGridEventData', function(row, event) {
        var renderedRows = row.targetScope.renderedRows.length;
        if (renderedRows > 0) {              // 有数据显示时才执行
            var ngrow0 = row.targetScope.renderedRows[0];
            var ngCol0 = row.targetScope.renderedColumns[0];
            // ngCol0.field == 'name' 去除存储卷列表的ngGridEventData事件，去掉该判断会导致死循环。
            if (ngrow0.selected == true || ngCol0.field != 'title') {   // 此处会执行多次，只要第一行选中就返回，防止多次触发afterSelectionChange事件
                return;
            }
            for (var i = 0; i < renderedRows; i++) {
            	var ngrowi = row.targetScope.renderedRows[i];
            	if (angular.isDefined($scope.selectedPool) && ngrowi.entity.name == $scope.selectedPool) {
            		$scope.gridOptions.selectRow(ngrowi.rowIndex, true);
            		return;
            	}
            }
            $scope.gridOptions.selectRow(0, true);
        } 
    });
    // 选择存储卷弹出框过滤
    $scope.$on('ngGridEventFilter', function(event, msg) {
        // 设置时间间隔
        if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
            $timeout.cancel($scope.keyInterval);
        }
        $scope.keyInterval = $timeout(function() {
        	$scope.params2.storageVolumeName = msg;
            $scope.clearMySelections2();
            $scope.pagingOptions2.currentPage = 1;
        	$scope.refreshPage2();
        }, constant.keyInterval);
    });
    
    $scope.params2 = {};
	$scope.params2.id=$scope.id;
	if (angular.isDefined($scope.hostId)) {
		$scope.params2.id = $scope.hostId;
	}
	
	$scope.hasRawVolumes = false;
	
    $scope.gridOptions2 = {
    		data: 'myData2',
    		jqueryUITheme: false,
    		jqueryUIDraggable: false,
    		selectedItems: $scope.mySelections2,
    		showSelectionCheckbox: false,
    		multiSelect: false,
    		showGroupPanel: false,
    		showColumnMenu: true,
    		showFilter: true,
    		enableCellSelection: false,
    		enableCellEditOnFocus: false,
    		enablePaging: true,
    		showFooter: true,
    		searchBoxSize:'small',
    		pagingOptions: $scope.pagingOptions2,
    		totalServerItems: 'totalServerItems2',
    		i18n: $translate.instant('load.static.lang'),
    		columnDefs:volumeCol,    	
    		filterOptions : {
    				filterText: "",
    				useExternalFilter: true
    		},
    		rowTemplate: doubleClickTemplate    // 双击行模板
    }; 
    
    
    $scope.jump = function(entity) {
    	if ($scope.isSelector == true && angular.isFunction($scope.ok)) {
    		$scope.ok.apply();
    	}
    }
    
    // 清空选中的存储卷缓存
    $scope.clearMySelections2 = function() {
        if ($scope.$parent.mySelections2) {
            $scope.$parent.mySelections2.splice(0, 1);
        } else {
            $scope.mySelections2.splice(0, $scope.mySelections2.length);
        }
    }
    
	 // 刷新存储池
	 $scope.refreshStoragePool = function(row) {
	     HttpService.put("storage/host/pool/refresh?hostId=" + $scope.hostId + "&cloudId=" + $scope.cloudId + "&poolName=" + row.name
	    		 + "&title=" + row.title + "&hostName=" + $scope.hostName, undefined,$scope.refreshPage, $scope.refreshPage );
	 }
	 
	 // 注册查询存储卷事件
	    $scope.$on(constant.onQueryStorageVolumeList, function(event, msg) {
	    	if (msg.hostId == $scope.hostId && msg.cloudId == $scope.cloudId) {
	    		if ($scope.isInBatchMigrateVolumes == false) {
	    			$scope.refreshVolumeList();
	    		}
	    	}
	    });
	 // 刷新存储卷
		$scope.refreshVolumeList = function() {
		     if (!$scope.isPoolActive) {
	             return;
	         }
		     if (angular.isDefined($scope.volumeNameFilter)) {
		         $scope.params2.storageVolumeName = $scope.volumeNameFilter;
		     } else {
		         $scope.params2.storageVolumeName = '';
		     }
		     // 刷新前要清空缓存
		     $scope.clearMySelections2();
			 $scope.refreshPage2();
		 }
	 
    $scope.$on("$destroy", function() {// scope销毁时，销毁定时器
        if (angular.isDefined($scope.keyInterval)) {
            $timeout.cancel($scope.keyInterval);
        }
    });
    
});


routeApp.controller('VswitchListInHostCtrl',function($scope, $http, $modal, $timeout,$translate, UtilService,GridService, HttpService) {
	var statusTemplate ='<div class="ngCellText" ng-class="col.colIndex()">'+
	'<span ng-if= \'row.entity[col.field] == "0"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">'+$translate.instant("common.inactive")+'</span></span>' +
	'<span ng-if= \'row.entity[col.field] == "1"\'><span class="icon-active"></span><span class="span_padding"></span><span class="cell-icon-text">'+$translate.instant("common.active")+'</span></span>' +
	'<span ng-if= \'row.entity[col.field] == "2"\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">'+$translate.instant("unkown")+'</span></span></div>' ;
	

    $scope.url = "resourcePool/resVswitchByResourcePoolId/"+ $scope.resourcePoolId;
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'30%',cellTemplate:titleTemplate},
	              { field: 'desc', displayName: $translate.instant('common.desc') , visible:true,  width:'33%',sortable: true, cellTemplate:titleTemplate},
	              { field: 'mode', displayName: $translate.instant('cluster.vswitchMode'), cellFilter: 'vsmode', sortable: true, width:'30%'}
                 /* { field: 'interface', displayName: $translate.instant('host.eth'), sortable: true, width:'10%'},
                  { field: 'vlanId', displayName: 'VLAN ID', sortable: true, width:'10%'},
                  { field: 'status', displayName: $translate.instant('common.state'), cellTemplate:statusTemplate, sortable: true, width:'10%'},
                  { field: 'ip', displayName: $translate.instant('host.ip'), sortable: true, width:'11%', cellTemplate:titleTemplate},
                  { field: 'netmask', displayName: $translate.instant('host.mask'), sortable: true, width:'11%', cellTemplate:titleTemplate},
                  { field: 'gateway', displayName: $translate.instant('host.gateway'), sortable: true, width:'11%', cellTemplate:titleTemplate}*/
                  /*{ field: 'oper', displayName:  $translate.instant('common.oper'), sortable: false, width:'22%',cellTemplate:
                 	 '<div has-permission="HOST_VSWITCH_MGR"><div class="ngCellButton">'
                 	 +'<div type="button" class="btn btn-sm-icon icon-start-gray" ng-disabled="row.entity.status==1||row.entity.mode==4" ng-click="start(row.entity)" custom-title="'+$translate.instant('host.startVswitch')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-pause-gray" ng-disabled="row.entity.status==0||row.entity.mode==4" ng-click="pause(row.entity)" custom-title="'+$translate.instant('host.stopVswitch')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-disabled="row.entity.mode==4" ng-click="edit(row.entity)" custom-title="'+$translate.instant('cluster.modifyVswitch')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delete(row.entity)" custom-title="'+$translate.instant('cluster.deleteVswitch')+'"></div>'
//                 	 +'<div type="button" class="btn btn-sm-icon icon-advanced-gray" ng-disabled="row.entity.mode==4" ng-click="advanced(row.entity)" custom-title="'+$translate.instant('host.advanced')+'"></div>'
                 	 +'</div></div>'
                  }*/
                 ]
	
	$scope = GridService.grid($scope, null, null, null, null, 'VswitchListInHostDivId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, true);
	
	// 注册查询事件
    $scope.$on('onQueryVswitchListInHost', function(event, msg) {
        $scope.refreshPage();
    });
    
    $scope.listStyle = $scope.gridStyle(140, true);
	listenNavClick($scope, $timeout, 140, true);

	if ($scope.$parent.mySelections) {
		$scope.mySelections = $scope.$parent.mySelections;
	}
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
        enablePaging: false,
        showFooter: false,
        i18n: $translate.instant('load.static.lang'),
        totalServerItems: 'totalServerItems',
        filterOptions: $scope.filterOptions,
        pagingOptions: $scope.pagingOptions,
        columnDefs:column,
    	rowTemplate: doubleClickTemplate    // 双击行模板
    };    
    
    $scope.jump = function(entity) {
    	if ($scope.isSelector == true && angular.isFunction($scope.ok)) {
    		$scope.ok.apply();
    	}
    }
    
    $scope.start = function(rowObject){
    	if(rowObject.status == 1 || rowObject.mode==4){
    		return;
    	}
    	var modalInstance = UtilService.confirm($translate.instant("host.startVsPrompt", {vsName: rowObject.name}), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		var url = "network/" + $scope.cloudId + "/host/" + $scope.hostId + "/" + $scope.hostName + "/net/" + rowObject.name + "/start";
    		HttpService.put(url, undefined, undefined, $scope.refreshPage);
    	}, function(){});
    }
    
    $scope.pause = function(rowObject){
    	if(rowObject.status != 1 || rowObject.mode==4){
    		return;
    	}
    	var modalInstance = UtilService.confirm($translate.instant("host.stopVsPrompt", {vsName: rowObject.name}), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		if (rowObject.isManage != null && rowObject.isManage == 1) {
    			var modalInstance = UtilService.confirm($translate.instant("host.pauseManageVswitchMessageBoxInfo", {vsName: rowObject.name}), $translate.instant("common.opertip"));
    	    	modalInstance.result.then(function(){
    	    		var url = "network/host/" + $scope.hostId + "/" + $scope.hostName + "/net/" + rowObject.name + "/stop?cloudId=" + $scope.cloudId;
    	    		HttpService.put(url, undefined, undefined, $scope.refreshPage);
    	    	}, function(){});
    	    	return;
    		}
    		var url = "network/" + $scope.cloudId + "/host/" + $scope.hostId + "/" + $scope.hostName + "/net/" + rowObject.name + "/stop";
    		HttpService.put(url, undefined, undefined, $scope.refreshPage);
    	}, function(){});
    }
    
    $scope.edit = function(rowObject){
    	if(rowObject.mode == 4){
    		return;
    	}
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/host/addVswitch.html',
            controller: 'addVswitchCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                hostId: function () {
                    return $scope.hostId;
                },
                hostName: function(){
                	return $scope.hostName;
                },
                entry: function() {
                	return rowObject;
                },
                cloudId: function() {
                	return $scope.cloudId;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.refreshPage();
        }, function (reason) {
        });
    }
    
    $scope.delete = function(rowObject){
    	var modalInstance = UtilService.confirm($translate.instant("vswitch.deleteVsPrompt", {vsName: rowObject.name}), $translate.instant("common.opertip"));
    	modalInstance.result.then(function(){
    		var url = "network/vswitch";
    		var params = {};
    		params.id = rowObject.id;
    		params.name = rowObject.name;
    		params.hostId = $scope.hostId;
    		params.hostName = $scope.hostName;
    		params.cloudId = $scope.cloudId;
    		HttpService.delete(url, params, undefined, $scope.refreshPage);
    	}, function(){});
    }
});

//云资源的网络策略模板列表控制器
routeApp.controller('selectNetStrategyListCtrl',function($scope, $http, $modal, $translate, $timeout, UtilService,GridService,HttpService, PermissionService) {
	// 权限信息
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'10%'},
                  { field: 'operatorGroupname', displayName: $translate.instant('netstrategy.operatorGrpName'), sortable: true, width:'10%', visible:false},
                  { field: 'description', displayName: $translate.instant('common.desc'), sortable: true, width:'10%', visible:false},
                  { field: 'vlanId', displayName: 'VLAN ID', sortable: true, width:'10%'},
                  { field: 'aclName', displayName: $translate.instant('netstrategy.acl'), sortable: true, width:'10%'},
                  { field: 'vnetPriority', displayName: $translate.instant('netstrategy.netPriority'), cellFilter:'priority', sortable: true, width:'10%'},
                  { field: 'inAvgBandwidth', displayName: $translate.instant('netstrategy.inAvgBandwidth'), cellFilter: 'kbps', sortable: true, width:'10%', visible:false},
                  { field: 'inBurstSize', displayName: $translate.instant('netstrategy.inBurstSize'), cellFilter: 'KBytes', sortable: true, width:'10%', visible:false},
                  { field: 'outAvgBandwidth', displayName: $translate.instant('netstrategy.outAvgBandwidth'), cellFilter: 'kbps', sortable: true, width:'10%', visible:false},
                  { field: 'outBurstSize', displayName: $translate.instant('netstrategy.outBurstSize'), cellFilter: 'KBytes', sortable: true, width:'10%', visible:false}
//                  { field: 'oper', visible:$scope.netStrategyMgr, displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
//                 	 '<div><div class="ngCellButton">'
//                 	 +'<div type="button" class="btn btn-sm-icon icon-preview-gray" ng-click="view(row.entity)" custom-title="'+$translate.instant('common.view')+'"></div>'
//                 	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modify(row.entity)" custom-title="'+$translate.instant('common.modify')+'"></div>'
//                 	 +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="del(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
//                 	 +'</div></div>'
//                   }
                 ]
	//var url = 'network/' + $scope.cloudId + '/list';
	var url = "resourcePool/resProfile/"+ $scope.cloudId;
	$scope = GridService.grid($scope, url, null, null, null, 'selectNetStrategyListDivId');
	$scope.getDataAsync();
	
	// 注册查询列表事件
	$scope.$on('onQueryNetStrategyList', function(event, msg) {
	    $scope.refreshPage();
	});	
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle();
	listenNavClick($scope, $timeout);
	

	if ($scope.$parent.mySelections) {
		$scope.mySelections = $scope.$parent.mySelections;
	}
	
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
        enablePaging: false,
        showFooter: false,
        i18n: $translate.instant('load.static.lang'),
        totalServerItems: 'totalServerItems',
        filterOptions: false,
        pagingOptions: false,
        columnDefs:column,
        rowTemplate: doubleClickTemplate    // 双击行模板
    };    
    
    $scope.jump = function(entity) {
    	if ($scope.isSelector == true && angular.isFunction($scope.ok)) {
    		$scope.ok.apply();
    	}
    }   
    
    // 查看网络策略模板
	$scope.view = function(row){
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/viewNetworkStrategy.html',
            controller: 'viewTemplateCtrl',
            backdrop:'static',
            resolve: {
                rowEntry: function () {
                    return row;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
	};
	// 修改网络策略模板
    $scope.modify = function(row){
    	var waitModal = UtilService.wait();
        $http({
           method: 'GET',
           url: 'network/portprofile/' + row.id
        }).success(function(result) {
            waitModal.dismiss();
            if (result.success == true) {
                var modalInstance = $modal.open({
                    templateUrl: 'html/modal/cloudResource/addNetworkStrategy.html',
                    controller: 'networkStrategyCtrl',
                    size:'lg',
                    backdrop:'static',
                    resolve: {
                        entry: function() {
                            return result.data;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function (reason) {
                    if ("success" == reason) {     // 成功才刷新
                       // $scope.refreshMonitorStrategy();
                    	$scope.refreshPage();
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
	// 删除网络策略模板
    $scope.del = function(row){
    	 // 弹出confirm对话框
        var modalInstance = UtilService.confirm($translate.instant('netstrategy.confirmDelete',{v:row.name}),$translate.instant('netstrategy.delete'));
        modalInstance.result.then(function (selectedItem) {
            HttpService.delete('network/portprofile/' + row.id, null, modalInstance, $scope.refreshPage);
            // post完成后刷新虚拟机列表
        }, function () {
        });
	};
});

//资源池概要,虚拟机列信息表查询
routeApp.controller('resourcePoolVmInfoListCtrl',function($scope, $translate, GridService) {
    var percentTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' +
    '<span ng-if="row.entity[\'resourcePoolVmNum\'] > 0">{{row.entity[col.field]/row.entity[\'resourcePoolVmNum\']*100|number:2}}%</span>' +
    '<span ng-if="row.entity[\'resourcePoolVmNum\'] == 0">0.00%</span>' +
    '</div>' ;
    //虚拟机分配信息
    var column = [{ field: 'name', displayName: $translate.instant('org.org'), sortable: true, width:'40%', cellTemplate:titleTemplate},
                  { field: 'vmNum', displayName: $translate.instant('resourcePool.vmNum'), sortable: true, width:'30%'},
                  { field: 'vmNum', displayName:$translate.instant('resourcePool.percent'), sortable: true, width:'30%',cellTemplate:percentTemplate}
                  ];
    var url = "resourcePool/" + $scope.id + "/orgVmInfo";
    $scope = GridService.grid($scope, url, {});
    $scope.getDataAsync();
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
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          columnDefs:column
    };
});
//资源池概要,CPU信息列表查询
routeApp.controller('resourcePoolCPUInfoListCtrl',function($scope, $translate, GridService) {
    //CPU分配信息
    var percentTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' +
    '<span ng-if="row.entity[\'resourcePoolCpuNum\'] > 0">{{row.entity[col.field]/row.entity[\'resourcePoolCpuNum\']*100|number:2}}%</span>' +
    '<span ng-if="row.entity[\'resourcePoolCpuNum\'] == 0">0.00%</span>' +
    '</div>' ;
    var column = [{ field: 'name', displayName: $translate.instant('org.org'), sortable: true, width:'40%', cellTemplate:titleTemplate},
                  { field: 'cpuNum', displayName: $translate.instant('resourcePool.cpu'), sortable: true, width:'30%'},
                  { field: 'cpuNum', displayName:$translate.instant('resourcePool.percent'), sortable: true, width:'30%',cellTemplate:percentTemplate}
                  ];
    var url = "resourcePool/" + $scope.id + "/orgCPUInfo";
    $scope = GridService.grid($scope, url, {});
    $scope.getDataAsync();
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
          i18n: $translate.instant('load.static.lang'),
          totalServerItems: 'totalServerItems',
          filterOptions: $scope.filterOptions,
          pagingOptions: $scope.pagingOptions,
          columnDefs:column
    };
});
//资源池概要,内存信息列表查询
routeApp.controller('resourcePoolMemoryInfoListCtrl',function($scope, $translate, GridService) {
    var percentTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' +
    '<span ng-if="row.entity[\'resourcePoolMemory\'] > 0">{{row.entity[col.field]/row.entity[\'resourcePoolMemory\']*100|number:2}}%</span>' +
    '<span ng-if="row.entity[\'resourcePoolMemory\'] == 0">0.00%</span>' +
    '</div>' ;
    //内存分配信息
    var column3 = [{ field: 'name', displayName: $translate.instant('org.org'), sortable: true, width:'40%', cellTemplate:titleTemplate},
                   { field: 'memory', displayName: $translate.instant('resourcePool.memory'), sortable: true, width:'30%', cellFilter:'byteUnitRender'},
                   { field: 'memory', displayName:$translate.instant('resourcePool.percent'), sortable: true, width:'30%', cellTemplate:percentTemplate}
                   ];
    var url = "resourcePool/" + $scope.id + "/orgMemoryInfo";
    $scope = GridService.grid($scope, url, {});
    $scope.getDataAsync();
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
           i18n: $translate.instant('load.static.lang'),
           totalServerItems: 'totalServerItems',
           filterOptions: $scope.filterOptions,
           pagingOptions: $scope.pagingOptions,
           columnDefs:column3
     };
});

// 选择版本及CPU授权数量
routeApp.controller('chooseVersionAndCpuCtrl', function ($scope, $translate, UtilService, GridService) {
	$scope.$watch('licenseArray',function(newVal, oldVal) {
		$scope.myData = newVal;
	});
	$scope.actionArray = {
		options: [
			{ value: '1', label: $translate.instant('licenseServer.apply') },
			{ value: '2', label: $translate.instant('licenseServer.free') }
		]
	};
	var column = [
		{ field: 'licTitle', displayName: $translate.instant('licenseServer.version'), enableSorting: false, width: '20%', cellTemplate: titleTemplate },
		{ field: 'availableDisplay', displayName: $translate.instant('licenseServer.freeCpuNumber'), enableSorting: false, width: '20%' },
		{ field: 'ownedDisplay', displayName: $translate.instant('licenseServer.usedCpuNumber'), width: "20%", enableSorting: false },
		{
			field: 'dbAmount', displayName: $translate.instant('licenseServer.wantCpuNumber'), enableSorting: false, width: '20%', cellTemplate:
				'<div>' +
				'<div ng-if="row.entity.licName!==\'cvm_cpu_enterprise_unlimit\'" class="ui-grid-cell-contents" style="padding-top: 2px;width: 90%;"><input spinner checkint embed-grid="true" ng-model="row.entity[col.field]" spinner-min=0 spinner-max={{row.entity.owned-0+row.entity.available-0}}></div>' +
				'<div ng-if="row.entity.licName===\'cvm_cpu_enterprise_unlimit\'">'+
				'<div toggle-switch allow-animate="false" style="margin-top: 3px;margin-left:6px;" on-label="' + $translate.instant('licenseServer.apply') + '" off-label="' + $translate.instant('licenseServer.free') + '" class="switch-small switch-success" ng-mousedown="grid.appScope.changeUnlimitedLicense(row.entity, $event)" ng-model="row.entity[col.field]"></div>' +
				'</div>' +
				'</div>',
		},
		{
			field: 'action', displayName: $translate.instant('common.oper'), enableSorting: false, width: '20%', cellTemplate:
			'<div class="ngCellText"  ng-if="row.entity.licName!==\'cvm_cpu_enterprise_unlimit\'">' +
				'<span ng-if="row.entity.dbAmount>row.entity.oldDbAmount">' + $translate.instant('licenseServer.apply') + '{{row.entity.dbAmount-row.entity.oldDbAmount}}</span>' +
				'<span ng-if="row.entity.dbAmount<row.entity.oldDbAmount">' + $translate.instant('licenseServer.free') + '{{row.entity.oldDbAmount-row.entity.dbAmount}}</span>' +
				'</div>'
		},
	];
	$scope.choosedNameArray=[];
	$scope.gridOptions = {
		data: 'myData',
		noUnselect: false,
		useExternalPagination: false,//是否外部分页
		enablePaginationControls: false, //是否使用默认的底部分页
		totalItems: 0,
		enableHorizontalScrollbar: 0,//表格的水平滚动条  
		enableRowSelection: false,//行选择是否可用
		multiSelect: false,//是否可以多选
		enableRowHeaderSelection: false,//选择头是否显示
		enableColumnMenus: false,
		useExternalSorting: false,
		enableGridMenu: false,
		saveWidths: true,
		saveScroll: false,
		//  pagingOptions: $scope.pagingOptions,
		columnDefs: column,
		onRegisterApi: function (gridApi) {
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
				$scope.choosedLicenseArray.length = 0;
				var sellist = gridApi.selection.getSelectedRows();
				var tempArr = [], choosedNameTemp = [];
				for (var i = 0; i < sellist.length; i++) {
					$scope.choosedLicenseArray.push(sellist[i]);
					choosedNameTemp.push(sellist[i].licName);
				}
				$scope.choosedNameArray = choosedNameTemp;
			});
			gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows, event) { });
		}
	};
	$scope.myData = [];
	//销毁遮罩层
	$scope.$on("$destroy", function () {
		UtilService.dismissAreawait("storageListDivId" + constant.AREAWAIT);
	});
});
// SRM可保护虚拟机数量授权
routeApp.controller('chooseSrmVmLicenseCtrl', function ($scope, $translate, UtilService, GridService) {
	$scope.$watch('srmLicenseArray',function(newVal, oldVal) {
		$scope.myData = newVal;
	});
	
	$scope.actionArray = {
		options: [
			{ value: '1', label: $translate.instant('licenseServer.apply') },
			{ value: '2', label: $translate.instant('licenseServer.free') }
		]
	};
	var column = [
		{ field: 'licTitle', displayName: $translate.instant('common.name'), enableSorting: false, width: '20%', cellTemplate: titleTemplate },
		{ field: 'availableDisplay', displayName: $translate.instant('licenseServer.freeVmNumber'), enableSorting: false, width: '20%' },
		{ field: 'ownedDisplay', displayName: $translate.instant('licenseServer.usedVmNumber'), width: "20%", enableSorting: false },
		// {
		// 	field: 'action', displayName: $translate.instant('common.oper'), enableSorting: false, width: '20%', cellTemplate:
		// 		'<div>' +
		// 		'<select-input ng-if="row.entity.licName!==\'cvm_cpu_enterprise_unlimit\'" class="select-in-table" options="grid.appScope.actionArray.options" bind-model="row.entity.action" input-id="{{\'actionId\'+row.entity.licName}}" input-name="action">' +
		// 		'</select-input>' +
		// 		'<div class="ngCellText"><span ng-if="row.entity.licName==\'cvm_cpu_enterprise_unlimit\'&&row.entity.available == 1" translate="licenseServer.apply"></span>' +
		// 		'<span ng-if="row.entity.licName==\'cvm_cpu_enterprise_unlimit\'&&row.entity.owned == 1" translate="licenseServer.free"></span></div>' +
		// 		'</div>'
		// },
		{
			field: 'dbAmount', displayName: $translate.instant('licenseServer.applyVmNumber'), enableSorting: false, width: '20%', cellTemplate:
				'<div>' +
				'<div class="ui-grid-cell-contents" style="padding-top: 2px;width: 90%;"><input spinner checkint embed-grid="true" ng-model="row.entity[col.field]" spinner-min=0 spinner-max={{row.entity.owned-0+row.entity.available-0}}></div>' +
				'</div>'
		},
		{
			field: 'action', displayName: $translate.instant('common.oper'), enableSorting: false, width: '20%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.dbAmount-0>row.entity.oldDbAmount-0">' + $translate.instant('licenseServer.apply') + '{{row.entity.dbAmount-row.entity.oldDbAmount}}</span>' +
				'<span ng-if="row.entity.dbAmount-0<row.entity.oldDbAmount-0">' + $translate.instant('licenseServer.free') + '{{row.entity.oldDbAmount-row.entity.dbAmount}}</span>' +
				'</div>'
		},
	];
	$scope.choosedNameArray=[];
	$scope.gridOptions = {
		data: 'myData',
		noUnselect: false,
		useExternalPagination: false,//是否外部分页
		enablePaginationControls: false, //是否使用默认的底部分页
		totalItems: 0,
		enableHorizontalScrollbar: 0,//表格的水平滚动条  
		enableRowSelection: false,//行选择是否可用
		multiSelect: false,//是否可以多选
		enableRowHeaderSelection: false,//选择头是否显示
		enableColumnMenus: false,
		useExternalSorting: false,
		enableGridMenu: false,
		saveWidths: true,
		saveScroll: false,
		//  pagingOptions: $scope.pagingOptions,
		columnDefs: column,
		onRegisterApi: function (gridApi) {
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
				$scope.choosedSrmLicenseArray.length = 0;
				var sellist = gridApi.selection.getSelectedRows();
				var tempArr = [], choosedNameTemp = [];
				for (var i = 0; i < sellist.length; i++) {
					$scope.choosedSrmLicenseArray.push(sellist[i]);
					choosedNameTemp.push(sellist[i].licName);
				}
				$scope.choosedNameArray = choosedNameTemp;
			});
			gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows, event) { });
		}
	};
	$scope.myData = [];
	//销毁遮罩层
	$scope.$on("$destroy", function () {
		UtilService.dismissAreawait("storageListDivId" + constant.AREAWAIT);
	});
});
// CIC可管理虚拟机数量授权
routeApp.controller('chooseCicVmLicenseCtrl', function ($scope, $translate, UtilService, GridService) {
	$scope.$watch('cicLicenseArray',function(newVal, oldVal) {
		$scope.myData = newVal;
	})
	$scope.actionArray = {
		options: [
			{ value: '1', label: $translate.instant('licenseServer.apply') },
			{ value: '2', label: $translate.instant('licenseServer.free') }
		]
	};
	var column = [
		{ field: 'licTitle', displayName: $translate.instant('common.name'), enableSorting: false, width: '20%', cellTemplate: titleTemplate },
		{ field: 'availableDisplay', displayName: $translate.instant('licenseServer.freeVmNumber'), enableSorting: false, width: '20%' },
		{ field: 'ownedDisplay', displayName: $translate.instant('licenseServer.usedVmNumber'), width: "20%", enableSorting: false },
		// {
		// 	field: 'action', displayName: $translate.instant('common.oper'), enableSorting: false, width: '20%', cellTemplate:
		// 		'<div>' +
		// 		'<select-input ng-if="row.entity.licName!==\'cvm_cpu_enterprise_unlimit\'" class="select-in-table" options="grid.appScope.actionArray.options" bind-model="row.entity.action" input-id="{{\'actionId\'+row.entity.licName}}" input-name="action">' +
		// 		'</select-input>' +
		// 		'<div class="ngCellText"><span ng-if="row.entity.licName==\'cvm_cpu_enterprise_unlimit\'&&row.entity.available == 1" translate="licenseServer.apply"></span>' +
		// 		'<span ng-if="row.entity.licName==\'cvm_cpu_enterprise_unlimit\'&&row.entity.owned == 1" translate="licenseServer.free"></span></div>' +
		// 		'</div>'
		// },
		// {
		// 	field: 'dbAmount', displayName: $translate.instant('licenseServer.applyVmNumber'), enableSorting: false, width: '20%', cellTemplate:
		// 		'<div>' +
		// 		'<div class="ui-grid-cell-contents" style="padding-top: 2px;width: 90%;"><input spinner checkint embed-grid="true" ng-model="row.entity[col.field]" spinner-min=0 spinner-max={{row.entity.owned-0+row.entity.available-0}} style="width:80px;"> </div>' +
		// 		'</div>'
		// },
		// {
		// 	field: 'action', displayName: $translate.instant('common.oper'), enableSorting: false, width: '20%', cellTemplate:
		// 		'<div class="ngCellText">' +
		// 		'<span ng-if="row.entity.dbAmount>row.entity.oldDbAmount-0">' + $translate.instant('licenseServer.apply') + '{{row.entity.dbAmount-row.entity.oldDbAmount}}</span>' +
		// 		'<span ng-if="row.entity.dbAmount<row.entity.oldDbAmount-0">' + $translate.instant('licenseServer.free') + '{{row.entity.oldDbAmount-row.entity.dbAmount}}</span>' +
		// 		'</div>'
		// },
		{
			field: 'action', displayName: $translate.instant('common.oper'), enableSorting: false, width: '15%', cellTemplate:
				'<select-input class="select-in-table" options="actionArray.options" bind-model="row.entity.action" input-id="{{\'actionId\'+row.entity.licName}}" input-name="action">' +
				'</select-input>'
		},
		{
			field: 'amount', displayName: $translate.instant('licenseServer.vmNumber'), enableSorting: false, width: '23%', cellTemplate:
				'<div ng-if="row.entity.licName!==\'cvm_cpu_enterprise_unlimit\'">' +
				'<div class="ui-grid-cell-contents" style="padding-top: 2px;width: 70%;"><input spinner id="{{row.entity.licName}}" checkint embed-grid="true" ng-model="row.entity[col.field]" spinner-min=0 spinner-max="{{row.entity.action == \'2\' ? row.entity.owned - 0 : row.entity.available}}"></div>' +
				'<div class="ngCellText"></div>' +
				'</div>'
			
		},
	];
	$scope.choosedNameArray=[];
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
		i18n: $translate.instant('load.static.lang'),
		columnDefs: column
	};
	$scope.myData = [];
	//销毁遮罩层
	$scope.$on("$destroy", function () {
		UtilService.dismissAreawait("storageListDivId" + constant.AREAWAIT);
	});
});
// 当前版本及CPU数量授权信息
routeApp.controller('versionAndCpuListCtrl', function ($scope, $translate, UtilService, GridService) {
	$scope.$watch('licenseArray',function(newVal, oldVal) {
		$scope.myData = newVal;
	});
	var column = [
		{ field: 'licTitle', displayName: $translate.instant('common.name'), enableSorting: false, width: '20%', cellTemplate: titleTemplate },
		{ field: 'licenseSn', displayName: $translate.instant('licenseServer.sn'), enableSorting: false, width: '20%', cellTemplate: titleTemplate },
		{ field: 'amount', displayName: $translate.instant('licenseServer.usedCpuNumber'), width: "20%", enableSorting: false },
		{
			field: 'flagType', displayName: $translate.instant('common.type'), enableSorting: false, width: '20%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.flagType==1" translate="licenseServer.formal"></span>' +
				'<span ng-if="row.entity.flagType==2" translate="licenseServer.temporary"></span>' +
				'</div>'
		},
		{
			field: 'remainHours', displayName: $translate.instant('licenseServer.remainingTime'), enableSorting: false, width: '20%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.remainHours == \'-1\'" translate="licenseServer.forever"></span>' +
				'<span ng-if="row.entity.remainHours != \'-1\'">{{row.entity.remainHours}}' + $translate.instant('common.hour') + '</span>' +
				'</div>'
		},
	];
	$scope.gridOptions = {
		data: 'myData',
		noUnselect: false,
		useExternalPagination: false,//是否外部分页
		enablePaginationControls: false, //是否使用默认的底部分页
		totalItems: 0,
		enableHorizontalScrollbar: 0,//表格的水平滚动条  
		enableRowSelection: true,//行选择是否可用
		multiSelect: false,//是否可以多选
		enableRowHeaderSelection: false,//选择头是否显示
		enableColumnMenus: false,
		useExternalSorting: false,
		enableGridMenu: false,
		saveWidths: true,
		saveScroll: false,
		//  pagingOptions: $scope.pagingOptions,
		columnDefs: column
	};
	$scope.myData = [];
	//销毁遮罩层
	$scope.$on("$destroy", function () {
		UtilService.dismissAreawait("versionAndCpuListDivId" + constant.AREAWAIT);
	});
});
// 当前SRM保护虚拟机数量授权信息
routeApp.controller('srmVmLicenseListCtrl', function ($scope, $translate, UtilService, GridService) {
	$scope.$watch('srmLicenseArray',function(newVal, oldVal) {
		$scope.myData = newVal;
	});
	var column = [
		{ field: 'licenseSn', displayName: $translate.instant('licenseServer.sn'), enableSorting: false, width: '25%', cellTemplate: titleTemplate },
		{ field: 'amount', displayName: $translate.instant('licenseServer.usedCpuNumber'), width: "25%", enableSorting: false },
		{
			field: 'flagType', displayName: $translate.instant('common.type'), enableSorting: false, width: '25%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.flagType==1" translate="licenseServer.formal"></span>' +
				'<span ng-if="row.entity.flagType==2" translate="licenseServer.temporary"></span>' +
				'</div>'
		},
		{
			field: 'remainHours', displayName: $translate.instant('licenseServer.remainingTime'), enableSorting: false, width: '25%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.remainHours == \'-1\'" translate="licenseServer.forever"></span>' +
				'<span ng-if="row.entity.remainHours != \'-1\'">{{row.entity.remainHours}}' + $translate.instant('common.hour') + '</span>' +
				'</div>'
		},
	];
	$scope.gridOptions = {
		data: 'myData',
		noUnselect: false,
		useExternalPagination: false,//是否外部分页
		enablePaginationControls: false, //是否使用默认的底部分页
		totalItems: 0,
		enableHorizontalScrollbar: 0,//表格的水平滚动条  
		enableRowSelection: true,//行选择是否可用
		multiSelect: false,//是否可以多选
		enableRowHeaderSelection: false,//选择头是否显示
		enableColumnMenus: false,
		useExternalSorting: false,
		enableGridMenu: false,
		saveWidths: true,
		saveScroll: false,
		//  pagingOptions: $scope.pagingOptions,
		columnDefs: column,
	};
	$scope.myData = [];
	//销毁遮罩层
	$scope.$on("$destroy", function () {
		UtilService.dismissAreawait("srmVmLicenseListDivId" + constant.AREAWAIT);
	});
});
// 当前CIC管理虚拟机数量授权信息
routeApp.controller('cicVmLicenseListCtrl', function ($scope, $translate, UtilService, GridService) {
	$scope.$watch('cicLicenseArray',function(newVal, oldVal) {
		$scope.myData = newVal;
	})
	var column = [
		{ field: 'licenseSn', displayName: $translate.instant('licenseServer.sn'), enableSorting: false, width: '25%', cellTemplate: titleTemplate },
		{ field: 'amount', displayName: $translate.instant('licenseServer.usedCpuNumber'), width: "25%", enableSorting: false },
		{
			field: 'flagType', displayName: $translate.instant('common.type'), enableSorting: false, width: '25%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.flagType==1" translate="licenseServer.formal"></span>' +
				'<span ng-if="row.entity.flagType==2" translate="licenseServer.temporary"></span>' +
				'</div>'
		},
		{
			field: 'remainHours', displayName: $translate.instant('licenseServer.remainingTime'), enableSorting: false, width: '25%', cellTemplate:
				'<div class="ngCellText">' +
				'<span ng-if="row.entity.remainHours == \'-1\'" translate="licenseServer.forever"></span>' +
				'<span ng-if="row.entity.remainHours != \'-1\'">{{row.entity.remainHours}}' + $translate.instant('common.hour') + '</span>' +
				'</div>'
		},
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
		i18n: $translate.instant('load.static.lang'),
		columnDefs: column
	};
	$scope.myData = [];
	//销毁遮罩层
	$scope.$on("$destroy", function () {
		UtilService.dismissAreawait("cicVmLicenseListDivId" + constant.AREAWAIT);
	});
});