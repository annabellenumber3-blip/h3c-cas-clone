angular.module('app.orgService',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('OrgService', function($translate, $modal, HttpService, GridService, UtilService, $http){
	return {
		modifOrg : function(org, callBack) {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/org/modifyOrg.html',
	  			  controller: 'OrgModifyCtrl',
	  			  windowClass: 'editvm-dialog',
	  			  backdrop:'static',
	  			  resolve: {org : function() {return org;}}
	  		});
	  		modalInstance.result.then(function (selectedItem) {
	  			if (angular.isDefined(callBack)) {
		      		 if (angular.isFunction(callBack)) {
		      			 callBack.apply(this);
		      		 }
	      	  	}
	        }, function () {
	        });
		},
		delOrg : function(org, callBack) {
			var modalInstance = UtilService.confirm($translate.instant('org.delAlt',{value:org.name}),$translate.instant('org.del'));
			modalInstance.result.then(function (selectedItem) {
				HttpService.delete('org/del/' + org.id + "/" + org.name, null, modalInstance, callBack);
			}, function () {
			});
		},
		addOrg : function() {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/org/addOrg.html',
	  			  controller: 'OrgAddCtrl',
	  			  size: 'lg',
	  			  backdrop:'static'
	  		});
	  		modalInstance.result.then(function (selectedItem) {
	        }, function () {
	        });
		},
//		addRes : function(org, callBack) { // 增加计算资源   组织逻辑修改,准备删除
//			var modalInstance = $modal.open({
//	  			templateUrl: 'html/modal/org/addRes.html',
//	  			controller: 'OrgAddResCtrl',
//	  			size: 'lg',
//	  			backdrop:'static',
//	  			resolve: {org : function() {return org;}}
//	  		});
//	  		modalInstance.result.then(function (selectedItem) {
//	        }, function () {
//	        	if (angular.isDefined(callBack)) {
//		      		 if (angular.isFunction(callBack) && callBack != null) {
//		      			 callBack.apply(this);
//		      		 }
//	      	  	}
//	        });
//		},
		 orgList : function (showLink) {
			// 查询步骤信息
			var operationTemplate = '<div><div class="ngCellButton">'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyOrg(row.entity)" has-permission="ORGANIZATION_MODIFY" custom-title="{{\'common.modify\'|translate}}"></div>'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delOrg(row.entity)" has-permission="ORGANIZATION_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
	   	 			+'</div></div>';
			var column=[{ field: 'name', displayName:$translate.instant('common.name'), sortable: false, cellTemplate:titleTemplate, width:'25%'},
			            { field: 'templateNum', displayName:$translate.instant('common.templateNum'), sortable: false, width:'15%'},
			            { field: 'vmNum', displayName:$translate.instant('common.vmNum'), sortable: false, width:'15%'},
			            { field: 'runVmNum', displayName:$translate.instant('common.runVmNum'), sortable: false, width:'15%'},
			            { field: 'userNum', displayName:$translate.instant('common.userNum'), sortable: false, width:'15%'},
			            { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'15%', cellTemplate:operationTemplate}];
			if (showLink) {
			    column[0] = { field: 'name', displayName:$translate.instant('common.name'), sortable: false, cellTemplate:titleLinkTemplate, width:'25%'};
			}
			//创建表格
			var gridOptions = {
				data: 'myData',
				jqueryUITheme: false,
				jqueryUIDraggable: false,
				showGroupPanel: false,
				showColumnMenu: true,
				showFilter: false,
				enableCellSelection: false,
				enableCellEditOnFocus: false,
				enablePaging: true,
				showFooter: true,
				i18n: $translate.instant('lang'),
				totalServerItems: 'totalServerItems',
				columnDefs:column,
				rowTemplate: doubleClickTemplate    // 双击行模板
			};
			return gridOptions;
		},
		/** 部署模板 */
		deployTemplate : function(template, callBack) {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/org/orgDeployVm.html',
	  			  controller: 'OrgDeployVmCtrl',
	  			  size: {width:'900px'},
	  			  backdrop:'static',
	  			  resolve: {template : function() {return template;}}
	  		});
	  		modalInstance.result.then(function (selectedItem) {
	        }, function () {
	        	if (angular.isDefined(callBack)) {
		      		 if (angular.isFunction(callBack)) {
		      			 callBack.apply(this);
		      		 }
	      	  	}
	        });
		},
		/** 批量部署模板 */
		batchDeployTemplate : function(template, callBack) {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/org/orgBatchDeploy.html',
	  			  controller: 'OrgBatchDeployVmCtrl',
	  			  size: 'lg',
	  			  backdrop:'static',
	  			  resolve: {template : function() {return template;},
	  				        deployType : function() {return constant.ORG_DEPLOY;}}
	  		});
	  		modalInstance.result.then(function (selectedItem) {
	        }, function () {
	        	if (angular.isDefined(callBack)) {
		      		 if (angular.isFunction(callBack)) {
		      			 callBack.apply(this);
		      		 }
	      	  	}
	        });
		},
		/** 选择管理员 */
		selManger : function(param, callBack) {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/common/multiselect.html',
	  			  controller: 'SelectMulOperatorCtrl',
	  			  size: 'lg',
	  			  backdrop:'static',
	  			  resolve: {param : function() {return param;}}
	  		});
	  		modalInstance.result.then(function (result) {
	        	if (angular.isDefined(callBack) && result != "cancel" && result !="escape key press") {
		      		 if (angular.isFunction(callBack)) {
		      			 callBack.apply(this,[result]);
		      		 }
	      	  	}
	        }, function (selectedItems) {
	        	
	        });
		},
		/** 选择管理分组 */
		selMangerGp : function(param, callBack) {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/common/multiselect.html',
	  			  controller: 'SelectMulOpGroupCtrl',
	  			  size: 'lg',
	  			  backdrop:'static',
	  			  resolve: {param : function() {return param;}}
	  		});
	  		modalInstance.result.then(function (result) {
	  			if (angular.isDefined(result) && result != "cancel" && result !="escape key press") {	        			
	  				if (angular.isDefined(callBack)) {
	  					if (angular.isFunction(callBack)) {
	  						callBack.apply(this,[result]);
	  					}
	  				}
	  			}
	        }, function (selectedItems) {
	        });
		},
		/** 发布资源池 */
		releaseResourcePool : function(param, callBack) {
			var params = {};
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/org/releaseResourcePool.html',
				controller: 'OrgReleaseResourcePoolCtrl',
				width:'760px',
				backdrop:'static',
				resolve: {
					orgId:function(){return param}
				}
			});
			modalInstance.result.then(function (result) {
				callBack.apply(this);
			}, function (selectedItems) {
			});	
		},
	};
});