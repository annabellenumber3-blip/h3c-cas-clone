routeApp.controller('CloudDiskCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate,UtilService, GridService, CloudDiskServiceAsync){
	var workflowStatus = '<div class="ngCellText" ng-class="col.colIndex()">' +
	'<span ng-if= \'row.entity[col.field] == 1\'><span class="icon-active"></span><span class="span_padding"></span><span class="cell-icon-text">'+$translate.instant('cloudDisk.normal')+'</span></span>' +
	'<span ng-if= \'row.entity[col.field] == 3\'><span class="icon-inactive"></span><span class="span_padding"></span><span class="cell-icon-text">'+$translate.instant('cloudDisk.notExist')+'</span></span>'
	'</div>';
	
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'15%', cellTemplate:titleTemplate},
                  { field: 'state', displayName: $translate.instant('common.state'), sortable: true, width:'10%', cellTemplate: workflowStatus},
                  { field: 'path', displayName: $translate.instant('cloudDisk.path'), sortable: true, width:'20%', cellTemplate: titleTemplate},
                  { field: 'capacity', displayName: $translate.instant('cloudDisk.capacity'), sortable: true, width:'9%', cellTemplate:'<div><div class="ngCellText">{{row.entity.capacity}}GB</div></div>'},
                  { field: 'orgName', displayName: $translate.instant('cloudDisk.org'),sortable: true, width:'12%',cellTemplate:titleTemplate},
                  { field: 'title', displayName: $translate.instant('cloudDisk.cloudHost'), sortable: true, width:'12%',cellTemplate:titleTemplate},
                  { field: 'userName', displayName: $translate.instant('cloudDisk.user'),sortable: true, width:'12%',cellTemplate:titleTemplate},
                  { field: 'oper', visible: $scope.hostVswitchMgr, displayName:  $translate.instant('common.oper'), sortable: false, width:'10%',cellTemplate:
                 	 '<div><div class="ngCellButton">'
                 	 +'<div has-permission="CLOUD_DISK_Delete" type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="del(row.entity)" custom-title="'+$translate.instant('cloudDisk.delCloudDisk')+'"></div>'
                 	 +'</div></div>'
                  }
                 ];
	GridService.grid($scope, 'cloudDisk/list', null, null, null, 'cloudDiskListId');
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
	        columnDefs:column
	};
	
	listenNavClick($scope, $timeout);
	
	$scope.del = function(row) {
		var modalInstance = UtilService.confirm($translate.instant('cloudDisk.deleteCloudDiskConfirm', {name:row.name}),$translate.instant('cloudDisk.delCloudDisk'),'mg');
        modalInstance.result.then(function (selectedItem) {
        	CloudDiskServiceAsync.deleteCloudDisk(row.id, function(result) {
        	    UtilService.handleResult(result);
        		if (result.success == true) {
        			$scope.refreshPage();
        		}
        	});
        }, function () {
        });
	};
	
	$scope.batchDelCloudDisk = function() {
		if ($scope.gridOptions.selectedItems.length == 0) {
			UtilService.alert($translate.instant('cloudDisk.selectAtLeastOne'), $translate.instant('common.opertip'), false, 'error');
    		return;
		}
		var modalInstance = UtilService.confirm($translate.instant('cloudDisk.batchDelCloudDiskconfirm'),$translate.instant('cloudDisk.batchDel'));
        modalInstance.result.then(function (selectedItem) {
            var idList = [];
            for (var i = 0; i < $scope.gridOptions.selectedItems.length; i++) {
                idList.push($scope.gridOptions.selectedItems[i].id);
            }
            CloudDiskServiceAsync.batchDeleteCloudDisk(idList, function(result) {
                UtilService.handleResult(result);
                if (result.success == true || result.state == 2) {
                    $scope.refreshPage();
                }
            	});
        }, function () {
        });
	};
	
	$scope.refreshCloudDisk = function() {
		$scope.mySelections.splice(0, $scope.mySelections.length);
        $scope.refreshPage();
        
		if (angular.isArray($scope.seleteOperator)) {
			$scope.seleteOperator.splice(0, $scope.seleteOperator.length);// clear
		}
		$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}

	}
});