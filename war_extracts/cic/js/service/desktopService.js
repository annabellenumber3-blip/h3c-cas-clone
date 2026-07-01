angular.module('app.desktopService',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('DesktopService', function($http, $translate,$modal, HttpService, GridService,UtilService){
	return {
		 desktopList : function () {
			// 查询信息
			var operationTemplate = '<div><div class="ngCellButton">'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" has-permission="DESKTOP_POOL_EDIT" ng-click="modifyDesktop(row.entity)" custom-title="{{\'common.modify\'|translate}}"></div>'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" has-permission="DESKTOP_POOL_DEL" ng-click="delDesktop(row.entity)" custom-title="{{\'common.delete\'|translate}}"></div>'
	   	 			+'<div type="button" class="btn btn-sm-icon icon-synchronize-gray" has-permission="DESKTOP_POOL_RESTRATEGY" ng-if="row.entity.assignMode == 2" ng-click="retrieve(row.entity)" custom-title="{{\'virdesk.retrieveStrategy\'|translate}}"></div>'
	   	 			+'</div></div>';
			var column=[{ field: 'name', displayName:$translate.instant('common.name'), sortable: false, cellTemplate:titleTemplate, width:'15%'},
			            { field: 'description', displayName:$translate.instant('common.desc'), sortable: false, cellTemplate:titleTemplate, width:'40%'},
			            { field: 'assignMode', displayName:$translate.instant('virdesk.assignMode'), cellFilter:'desktopType', sortable: false, width:'15%'},
			            { field: 'summary', displayName:$translate.instant('vm.domainOverview'), sortable: false, width:'15%', cellTemplate:vmSummaryTemplate},
			            { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'15%', cellTemplate:operationTemplate}
			            ];
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
		addDesktop : function () {
			// 增加虚拟桌面池
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/desktop/addDesktop.html',
				controller: 'addDesktopCtrl',
				size: 'lg',
				backdrop:'static',
				resolve: {
					params : function() {
						return null;
					}
				}
			});
    		modalInstance.result.then(function (selectedItem) {
    		}, function (reason) {
    			if ("success" == reason) {

    			}
    		});
		},
		delDesktop :function (rowObj) {
			var modalInstance = UtilService.confirm($translate.instant('virdesk.delVirDeskAlter', {value:rowObj.name}),
					$translate.instant('operConfirm'));
	    	modalInstance.result.then(function(){
	    		var waitModal = UtilService.wait();
				$http({
					method : 'DELETE',
					url    : 'desktop/delete',
					params : {name:rowObj.name, id:rowObj.id}
				}).success(function(result) {
					waitModal.dismiss();
					UtilService.handleResult(result);
				}).error(function(response, code, headers, config) {
					waitModal.dismiss();
					UtilService.handleError(code);
				});
	    	},function(){});
		},
		modifyDesktop : function (rowObj) {
			var params = {id:rowObj.id};
			// 增加虚拟桌面池
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/desktop/addDesktop.html',
				controller: 'addDesktopCtrl',
				size: 'lg',
				backdrop:'static',
				resolve: {
					params : function() {
						return params;
					}
				}
			});
    		modalInstance.result.then(function (selectedItem) {
    		}, function (reason) {
    			if ("success" == reason) {

    			}
    		});
		},
		retrieve : function (rowObj) {
			var params = {id:rowObj.id};
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/desktop/retrieveStrategy.html',
				controller: 'retrieveCtrl',
				backdrop:'static',
				width:'712px',
				size:'lg',
				resolve: {
					params : function() {
						return params;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
			}, function (reason) {
				if ("success" == reason) {

				}
			});
		},
		virDeskDeploy : function (rowObj) {
			var params = {id:rowObj.id};
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/desktop/virDeskDeploy.html',
				controller: 'virDeskDeployCtrl',
				backdrop:'static',
				resolve: {
					params : function() {
						return params;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
			}, function (reason) {
				if ("success" == reason) {

				}
			});
		}
	};
});