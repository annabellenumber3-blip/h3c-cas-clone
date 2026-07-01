routeApp.controller('CloudHostCtrl',function($scope, $state, $http, $location,$modal, $timeout, $translate, UtilService, GridService, DomainService, HttpService){
	var domain = {};
	$scope.isShowUser = false;
	$scope.showUserTitle = $translate.instant("cloudHost.showUser");
	$scope.mySelections = [];
	$scope.menuType = "cvmOrg";
	$scope.param = {};
    //搜索框
    $scope.$watch('vmListTitle', function(newValue, oldValue) {
        if (newValue != oldValue) {
            //设置时间间隔
            if (angular.isDefined($scope.keyInterval)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
                $timeout.cancel($scope.keyInterval);
            }
            $scope.keyInterval = $timeout(function() {
            	$scope.param.domainTitle = newValue;
            	$scope.refreshPage();
            }, constant.keyInterval);
        }
    });
	
	var antivirusTemplate = '<div><div class="ngCellText"><span ng-if="row.entity[col.field] == 0" translate="common.unable"></span>' +
    '<span ng-if="row.entity[col.field] == 1" translate="common.enable"></span>' +
    '</div></div>';
	
	var defs = [{ field: 'name', displayName: $translate.instant('common.name') , sortable: true, width:'10%',cellTemplate:titleTemplate,visible:false},
	            { field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'10%',
		        cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a ng-if= \'row.entity.status != "unknown"\' custom-title="{{row.entity[col.field]}}" ng-click="showDetail(row.entity)" style="text-decoration:underline;">{{row.entity[col.field]}}</a>'+
		        '<span ng-if= \'row.entity.status == "unknown"\' custom-title="{{row.entity[col.field]}}">{{row.entity[col.field]}}</span>'+'</div>'},
	            { field: 'desc', displayName: $translate.instant('common.desc') , sortable: true, width:'10%', cellTemplate:titleTemplate},
                { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'8%', cellTemplate:vmstatusTemplate($translate)},
                { field: 'cpu', displayName: 'CPUs', sortable: true,width:'8%'},
                { field: 'mem', displayName: $translate.instant('common.memory'), sortable: true,cellFilter:'byteUnitRender', width:'8%'},
                { field: 'cpuRate', displayName: $translate.instant('common.cpuRate'), sortable: true, width:'10%',cellTemplate:progressTemplate},
                { field: 'memRate', displayName: $translate.instant('common.memoryRate'), sortable: true, width:'10%',cellTemplate:progressTemplate},
                { field: 'system', displayName: $translate.instant('common.os'), sortable: true, width:'8%',cellTemplate:titleTemplate},
                { field: 'protectModel', displayName: $translate.instant('vm.protectModel') , sortable: true,cellTemplate :
                	'<div class="ngCellText">' +
                	'<span ng-if= \'row.entity.protectModel == 0\' >' + $translate.instant("common.unable") + '</span>' +
                	'<span ng-if= \'row.entity.protectModel == 1\' >' + $translate.instant("common.enable") + '</span></div>'
                	,width:'8%'},
                { field: 'antivirusConfig', displayName: $translate.instant('cloudService.antivirusConfig'), sortable: true, width:'10%', cellTemplate:antivirusTemplate}
               ];
	$scope = GridService.grid($scope, 'cloudHost/list', $scope.param, null, null, 'cloudHostListId');
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.listStyle = $scope.gridStyle();
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
        afterSelectionChange: function (rowItem, event) {   //选中事件完成后触发
        	domain = rowItem.entity;
        	if (angular.isDefined(rowItem.isClone) && rowItem.selected == true) {
        		if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
        	        $scope.menuType = "vmwareOrg";
        	        $scope.vm = DomainService.updateVmwareVmButton(domain);
        	        $scope.vm.isCloudCvm = false;
        	    } else {
        	        $scope.menuType = "cvmOrg";
        	        $scope.checkVmStatus(domain);
        	    }
        		if ($scope.isShowUser) {
        			params2.domainId = rowItem.entity.id;
        			params2.cloudType = rowItem.entity.cloudType;
        			params2.uniqueKey = rowItem.entity.uniqueKey;
            		$scope.getDataAsync2();
        		}
        	}
        },
        columnDefs: defs,
        rowTemplate: doubleClickTemplate    //双击行模板
    };
    $scope.showDetail = function(entity) {
    	if (entity.cloudType == constant.PUBLIC_CLOUD_CVM) {
    		$state.go('main.vm', entity);
    	} else if (entity.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		$state.go('main.vmwareVm.dashboard', entity);
    	}
    }
    $scope.checkVmStatus = function(domain) {
    	var params = {};
		params.cloudId = domain.cloudId;
		params.id = domain.id;
		$http({
	    	method: "GET",
	    	url: "domain/basicInfo",
	    	params: params
	    }).success(function(result) {
			var msg = {};
			msg.id = domain.id;
			if (angular.isDefined(result.data) && result.data != null) {
				msg.title = result.data.title;
				msg.status = result.data.status;
				msg.haManage = result.data.haManage;
				msg.haStatus = result.data.haStatus;
				msg.haEnable = result.data.hostHaEnable;
				msg.hostStatus = result.data.hoststatus;
				msg.protect = result.data.protectModel;
				msg.castoolStatus = result.data.castoolStatus;
				$timeout(function(){
					$scope.vm = DomainService.updateVmButton(msg);
					$scope.vm.isCloudCvm = true;
				});
			} else {
				$scope.vm = {};
				$scope.vm.enableStart = false;
				$scope.vm.enableShutdown = false;
				$scope.vm.enableClose = false;
				$scope.vm.enableConsole = false;
				$scope.vm.enableSnapshot = false;
				$scope.vm.enableDelete = true;
				$scope.vm.enablePause = false;
				$scope.vm.enableRestore = false;
				$scope.vm.enableSleep = false;
				$scope.vm.enableReboot = false;
				$scope.vm.enableDistribute = false;
				$scope.vm.enableBackup = false;
				$scope.vm.enableCloneTemplate = false;
				$scope.vm.enableMigrate = false;
				$scope.vm.isCloudCvm = true;
			}
		});
    }
    
    listenNavClick($scope, $timeout);
    
    //默认选中第一行.但是此监听会执行好多次需要处理
	$scope.$on('ngGridEventData', function(row, event) {
		if ($scope.mySelections.length < 1) {			
			$scope.gridOptions.selectRow(0, true);
		}
    });
	
	$scope.$on(constant.onReloadVmList, function (event, msg) {
		$scope.refreshCloudHost();
	});
    
    $scope.$watch("myData", function(newValue, oldValue) {
    	if ($scope.myData.length == 0) {
    		domain = undefined;
			$scope.myData2 = {};
		}
    });
    
    $scope.rightClick = function(row, e) {
		if (e.which == 3 && row.selected == false) {// 1:left, 2:middle, 3:right
			// unselected all rows
			$scope.gridOptions.selectAll(false);
			// select right click row
            $scope.gridOptions.selectRow(row.rowIndex, true);
		}
	};
    
    $scope.refreshCloudHost = function() {
		$scope.mySelections.splice(0, $scope.mySelections.length);
        $scope.refreshPage();
	}
    
    $scope.showCloudHostUser = function() {
		if ($scope.isShowUser ==  false) {
			$scope.isShowUser = true;
			$scope.showUserTitle = $translate.instant("cloudHost.hideUser");
			if (angular.isDefined($scope.mySelections[0]) && angular.isDefined($scope.mySelections[0].id) && $scope.mySelections[0].id != null) {
				params2.domainId = $scope.mySelections[0].id;
    			params2.cloudType = $scope.mySelections[0].cloudType;
    			params2.uniqueKey = $scope.mySelections[0].uniqueKey;
	    		$scope.getDataAsync2();
			}
			$timeout(function(){
				$scope.isShowUser2=true;
            },300);
		} else {
			$scope.isShowUser = false;
			$scope.showUserTitle = $translate.instant("cloudHost.showUser");
			$timeout(function(){
                $scope.isShowUser2=false;
            },300);
		}
		$(window).trigger('resize.nggrid');
	}
    
    var userType = '<div class="ngCellText" ng-class="col.colIndex()">' +
	'<span ng-if= \'row.entity.flag == 0\'>' + $translate.instant("common.organization") + '</span>' +
	'<span ng-if= \'row.entity.flag == 1\'>' + $translate.instant("org.user") + '</span>' +
	'<span ng-if= \'row.entity.flag == 2\'>' + $translate.instant("common.userGroup") + '</span></div>';
	var userOper = '<div><div class="ngCellButton">'
        +'<div type="button" ng-if="row.entity.flag == 1 || row.entity.flag == 2" class="btn btn-sm-icon icon-delete-gray" ng-click="delUser(row.entity)" custom-title="{{\'common.delete\'|translate}}"></div>'
        +'<div type="button" ng-if="!(row.entity.flag == 1 || row.entity.flag == 2)" class="btn btn-sm-icon icon-delete-gray btn-forbidden" custom-title="{{\'common.delete\'|translate}}"></div>'
        +'</div></div>';
	var defs2 = [{ field: 'name', displayName: $translate.instant('org.loginGpName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
	         { field: 'desc', displayName: $translate.instant('org.userDescName') , sortable: true, width:'30%',cellTemplate:titleTemplate},
	         { field: 'flag', displayName: $translate.instant('common.type') , sortable: true, width:'10%',cellTemplate:userType},
	         { field: 'orgName', displayName: $translate.instant('org.org') , sortable: true, width:'20%',cellTemplate:titleTemplate},
	         { field: 'oper', displayName: $translate.instant('common.oper') , sortable: true, width:'10%',cellTemplate:userOper}];
	var params2 = {};
	$scope = GridService.grid2($scope, 'cloudHost/user', params2, null, null, 'cloudHostUserId');
    $scope.userOptions = {
		data: 'myData2',
		jqueryUITheme: false,
		jqueryUIDraggable: false,
        selectedItems: $scope.mySelections2,
        showSelectionCheckbox: false,
        multiSelect: false,
        showGroupPanel: false,
        showColumnMenu: false,
        showFilter: false,
        enableCellSelection: false,
        enableCellEditOnFocus: false,
        i18n: $translate.instant('load.static.lang'),
        totalServerItems: 'totalServerItems2',
        columnDefs: defs2
    }; 
	
	$scope.delUser = function(user) {
    	var revokeAlert ;
    	if (user.flag == 1) {
    		revokeAlert = $translate.instant('org.revokeUser',{value:user.name})
    	} else {
    		revokeAlert = $translate.instant('org.revokeUserGroup',{value:user.name})
    	}
    	var modalInstance = UtilService.confirm(revokeAlert,$translate.instant('org.delAuthority'));
		modalInstance.result.then(function (selectedItem) {
			var params = {
					orgId:user.orgId,
			    	domainId:domain.id,
			    	title:domain.title,
			    	name:user.name,
			    	flag:user.flag,
			    	id:user.id,
			    	desktopPoolId:user.desktopPoolId,
			    	cloudType:domain.cloudType,
			    	uniqueKey:domain.uniqueKey
			};
			HttpService.put('org/revoke', params, modalInstance, $scope.refreshPage2);
		}, function () {
		});
    };
    
    $scope.refreshUser = function() {
    	if (angular.isDefined(params2) && angular.isDefined(params2.domainId) && $scope.mySelections[0].id != null) {
    		$scope.mySelections2.splice(0, $scope.mySelections2.length);
            $scope.refreshPage2();
    	}
	}
    
    $scope.$on('onRefrenshVmUserList', function(event, msg) {
        $scope.refreshUser();
    });
    
    //启动
    $scope.startVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		$scope.operateVmwareVm('start', row);
    	} else {
    		DomainService.startVm(row, $scope.showTaskList);
    	}
    	
    }
    //关闭电源
    $scope.shutdownVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		$scope.operateVmwareVm('shutdown', row);
    	} else {
    		DomainService.shutdownVm(row, $scope.showTaskList);
    	}
    }
    
    //关闭
    $scope.closeVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		$scope.operateVmwareVm('close', row);
    	} else {
    		DomainService.closeVm(row, $scope.showTaskList);
    	}
    }
    
    //控制台
    $scope.openConsole = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
    		DomainService.openConsole(row);
    	}
    }
    
    //迁移
    $scope.migrateVm = function() {
        var row = $scope.mySelections[0];
        if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            DomainService.migrateVmwareVm(row.cloudId, row.vmKey);
        }
    }
    
    //快照管理
    $scope.snapshotVm = function() {
    	var row = $scope.mySelections[0];
    	row.entryNodeType = "cloudHost";
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
        	DomainService.snapshotVm(row);
    	}
    }
    
    //创建快照
    $scope.createSnapshotVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
        	DomainService.createVmwareSnapshot(row.vCenterId, row.vmKey, row.name, row.status, $scope.showTaskList);
    	}
    }
    
    //删除
    $scope.deleteVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		DomainService.deleteVmwareVm([row], row.status, row.vCenterId, $scope.showTaskList);
    	} else {
        	DomainService.deleteVm(row, $scope.showTaskList);
    	}
    }
    
    //暂停
    $scope.pauseVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
        	DomainService.pauseVm(row, $scope.showTaskList);
    	}
    }
    
    //恢复
    $scope.resumeVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
        	DomainService.resumeVm(row, $scope.showTaskList);
    	}
    }
    
    //休眠
    $scope.sleepVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		$scope.operateVmwareVm('sleep', row);
    	} else {
        	DomainService.sleepVm(row, $scope.showTaskList);
    	}
    }
    
    //重启
    $scope.restartVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		$scope.operateVmwareVm('restart', row);
    	} else {
    		DomainService.restartVm(row, $scope.showTaskList);
    	}
    }
    
    //分配虚拟机
    $scope.distributeVm = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		var vmData = {
                    status:row.status,
                    vmKey:row.vmKey,
                    name:row.name,
                    id:row.id,
                    entryNodeType:"cloudHost"
            };
            DomainService.distributeVm(row.vCenterId, vmData);
    	} else {
    		DomainService.distributeVm(row.cloudId, row);
    	}
    }
    
    //取消分配虚拟机
    $scope.revokeDomain = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
    		var vmData = {
                    status:row.status,
                    vmKey:row.vmKey,
                    name:row.name,
                    id:row.id,
                    entryNodeType:"cloudHost"
            };
            DomainService.revokeDomain(row.vCenterId, vmData);
    	} else {
    		DomainService.revokeDomain(row.cloudId, row);
    	}
    }
    
    //立即备份
    $scope.backupVm = function() {
    	var row = $scope.mySelections[0];
    	row.entryNodeType = "cloudHost";
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
    		DomainService.backupVm(row);
    	}
    }
    
    //备份管理
    $scope.backupMng = function() {
        var row = $scope.mySelections[0];
        row.entryNodeType = "cloudHost";
        if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
            DomainService.backupMng(row);
        }
    }
    
    //克隆模板
    $scope.cloneTemplate = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_VMWARE) {
        	DomainService.cloneVmwareTemplate(row.vCenterId, row.vmKey, row.name, row.status, $scope.showTaskList);
    	}
    }
    
    //migrate domain
    $scope.migrateDomain = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
    		DomainService.migrateVm(row);
    	}
    }
    
    //升级castool
    $scope.upgradeCastools = function() {
    	var row = $scope.mySelections[0];
    	if (domain.cloudType == constant.PUBLIC_CLOUD_CVM) {
    		DomainService.upgradeCastools(row, $scope.showTaskList);
    	}
    }
    
    $scope.operateVmwareVm = function(type, row) {
        var operateInfo = {
                type:$translate.instant('menu.'+type),
                name:row.name
        };
        var name = row.name;
        var vmKey = row.vmKey;
        var cloudId = row.vCenterId;
        DomainService.operateVmwareVm(type, name, vmKey, cloudId, operateInfo, $scope.showTaskList);
    };
});