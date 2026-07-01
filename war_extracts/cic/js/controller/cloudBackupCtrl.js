routeApp.controller('CloudBackUpCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate,UtilService, GridService){
	var column = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'20%', cellTemplate:titleTemplate},
                  { field: 'description', displayName: $translate.instant('cloudBackup.description'), sortable: true, width:'20%', cellTemplate: titleTemplate},
                  { field: 'domainName', displayName: $translate.instant('cloudBackup.domainName'), sortable: true, width:'15%', cellTemplate: titleTemplate},
                  { field: 'createTime', displayName: $translate.instant('cloudBackup.createTime'), sortable: true, width:'15%', cellTemplate: titleTemplate},
                  { field: 'path', displayName: $translate.instant('cloudBackup.path'), sortable: true, width:'15%', cellTemplate: titleTemplate},
                  { field: 'userName', displayName: $translate.instant('cloudBackup.user'),sortable: true, width:'15%',cellTemplate:titleTemplate}
                 ];
	
	GridService.grid($scope, 'cloudBackupHistory/list', null, null, null, 'cloudBackupListId');
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
	
	$scope.refreshCloudBackUp = function() {
        $scope.refreshPage();
	}
});