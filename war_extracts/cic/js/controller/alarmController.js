routeApp.controller('alarmCtrl' ,['$scope','$state','$http', '$location','$modal', '$translate', 'UtilService', 'HttpService',
  function($scope, $state, $http, $location, $modal, $translate, UtilService, HttpService){
	 //-------------------------------------------------------
	 $scope.alarm = {};
     $scope.refresh = function() {
    	 $scope.$broadcast(constant.onQueryAlarmThresholdList);
     }
     $scope.currentPage = $state.current.name;
}]);

//【告警阈值配置控制器】
routeApp.controller('AlarmConfigListCtrl',function($scope, $http, $modal, $translate,$timeout, $filter, UtilService,GridService, HttpService, AlarmServiceAsync) {
	var url = 'alarm/configs';
	var params = {};
	var operationTemplate = '<div><div class="ngCellButton">'
	 			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyConfig(row.entity)" has-permission="ALARM_CONFIG_MODIFY" custom-title="{{\'common.modify\'|translate}}"></div>'
	 			+'<div type="button" class="btn btn-sm-icon icon-release-template-gray" ng-click="issueConfig(row.entity)" has-permission="ALARM_CONFIG_MODIFY" custom-title="{{\'alarm.issueAlarm\'|translate}}"></div>'
	 			+'<div type="button" class="btn btn-sm-icon icon-srm-faliover-gray" ng-click="test(row.entity)" has-permission="ALARM_CONFIG_MODIFY" custom-title="{{\'alarm.testNoticy\'|translate}}"></div>'
	 			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delConfig(row.entity)" has-permission="ALARM_CONFIG_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
	 			+'</div></div>';
	var column=[{ field: 'cloudName', displayName:$translate.instant('cloudResource.cloudResource'), sortable: false, cellTemplate:titleTemplate, width:'25%'},
	            { field: 'emailTemplateName', displayName:$translate.instant('alarm.emailNoticeTemplate'), sortable: false, width:'25%'},
	            { field: 'messageTemplateName', displayName:$translate.instant('alarm.messageNoticeTemplate'), sortable: false, width:'25%'},
	            { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'25%', cellTemplate:operationTemplate}];
	$scope = GridService.grid($scope, url, params, undefined, undefined , "alarmSetListDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			multiSelect:false,
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
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope.refresh = function() {
		$scope.refreshPage();
	}
	
	$scope.addConfig = function() {
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/alarm/addAlarmConfig.html',
            controller: 'AddAlarmConfigCtrl',
            backdrop: 'static',
            size:"lg",
            resolve: {
            	config : function (){
                	return undefined;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.refreshPage();
        }, function () {
        });
	};
	
	$scope.modifyConfig = function(row) {        
        $http({
           	method: 'GET',
           	url: 'alarm/config/' + row.id
        }).success(function (result) {
  			if (angular.isDefined(result)) {
  				var modalInstance = $modal.open({
  		            templateUrl: 'html/modal/alarm/addAlarmConfig.html',
  		            controller: 'AddAlarmConfigCtrl',
  		            backdrop: 'static',
  		            size: 'lg',
  		            resolve: {
  		            	config : function (){
  		                	return result.data;
  		                }
  		            }
  		        });
  		        modalInstance.result.then(function (selectedItem) {
  		        	$scope.refreshPage();
  		        }, function () {
  		        });
  			}			
        }).error(function(response, code, headers, config) {
        	console.error("http error");
        });
	};
	
	$scope.issueConfig = function(row) {
		AlarmServiceAsync.checkAlarmConfigById(row.id, function(result) {
    		UtilService.handleResult(result);
    		if (angular.isDefined(result) && result.state == 0) {
    			if (result.data != null && result.data.length > 0) {
      				var modalInstance = UtilService.confirm(result.data + $translate.instant('alarm.confirmToContinue'),$translate.instant('common.opertip'));
      		        modalInstance.result.then(function (selectedItem) {
      		        	var waitModal = UtilService.wait();
      		        	AlarmServiceAsync.issueAlarmConfig(row.id, function(result) {
      		        		waitModal.dismiss();
      		        		UtilService.handleResult(result);
      		        		$scope.refreshPage();
      		        	});
      		        }, function () {
      		        });
      			} else {
      				var modalInstance = UtilService.confirm($translate.instant('alarm.issueConfigPrompt', {name:row.cloudName}),$translate.instant('common.opertip'));
      		        modalInstance.result.then(function (selectedItem) {
      		        	var waitModal = UtilService.wait();
      		        	AlarmServiceAsync.issueAlarmConfig(row.id, function(result) {
      		        		waitModal.dismiss();
      		        		UtilService.handleResult(result);
      		        		$scope.refreshPage();
      		        	});
      		        }, function () {
      		        });
      			}
    		}
    	});
	};
	
	$scope.test = function(row) {
		var modalInstance = UtilService.confirm($translate.instant('alarm.testNoticyTip'),$translate.instant('common.opertip'));
        modalInstance.result.then(function (selectedItem) {
        	var waitModal = UtilService.wait();
    		AlarmServiceAsync.testNoticeConfig(row.id, function(result) {
        		waitModal.dismiss();
        		UtilService.handleResult(result);
        	});
        }, function () {
        });
	}
	
	$scope.delConfig = function(row) {
        var modalInstance = UtilService.confirm($translate.instant('alarm.deleteAlarmConfig', {name:row.cloudName}),$translate.instant('common.opertip'));
        modalInstance.result.then(function (selectedItem) {
        	var waitModal = UtilService.wait();
        	AlarmServiceAsync.deleteAlarmConfigById(row.id, function(result) {
        		waitModal.dismiss();
        		UtilService.handleResult(result);
        		$scope.refreshPage();
        	});
        }, function () {
        });
	};
});

//增加告警配置
routeApp.controller('AddAlarmConfigCtrl', function($scope, $http, $modal, $translate, config, $modalInstance, HttpService, UtilService, AlarmServiceAsync) {
	$scope.config = {};
	$scope.config.bindSameRes = false;
	$scope.showEmailItem = true;
	$scope.showMessageItem = false;
	$scope.currentPage = "email";
	
	$scope.stepTitles1 = [$translate.instant('alarm.baseInfo'), $translate.instant('alarm.followItem')];
    $scope.stepTitles2 = [$translate.instant('alarm.baseInfo'), $translate.instant('alarm.emailItem')];
    $scope.stepTitles3 = [$translate.instant('alarm.baseInfo'), $translate.instant('alarm.messageItem')];
    $scope.stepTitles4 = [$translate.instant('alarm.baseInfo'), $translate.instant('alarm.emailItem'), $translate.instant('alarm.messageItem')];
    
    $scope.isSameResource = function (emailResources, messageResources) {
    	if (emailResources.length == messageResources.length && messageResources.length == 0) {
    		return true;
    	} else if (emailResources.length != messageResources.length) {
    		return false;
    	} else {
    		var emailHostKeys = [];
    		var emailDomainKeys = [];
    		for (var i = 0; i < emailResources.length; i++) {
    			if (emailResources[i].resourceType == 0) {
    				emailHostKeys.push(emailResources[i].uniqueKey);
    			} else {
    				emailDomainKeys.push(emailResources[i].uniqueKey);
    			}
    		}
    		
    		var messageHostKeys = [];
    		var messageDomainKeys = [];
    		for (var j = 0; j < messageResources.length; j++) {
    			if (messageResources[j].resourceType == 0) {
    				messageHostKeys.push(messageResources[j].uniqueKey);
    			} else {
    				messageDomainKeys.push(messageResources[j].uniqueKey)
    			}
    		}
    		
    		if (emailHostKeys.sort().toString() == messageHostKeys.sort().toString() &&
    				emailDomainKeys.sort().toString() == messageDomainKeys.sort().toString()) {
    			return true;
    		} else {
    			return false;
    		}
    	}
    }
    
    if (angular.isDefined(config)) {
    	$scope.type = "edit";
    	$scope.config.cloudId = config.cloudId;
    	$scope.config.cloudName = config.cloudName;
    	$scope.config.emailTemplateId = config.emailTemplateId;
    	$scope.config.emailTemplateName = config.emailTemplateName;
    	$scope.config.messageTemplateId = config.messageTemplateId;
    	$scope.config.messageTemplateName = config.messageTemplateName;
    	$scope.config.emailResources = config.emailResources;
    	$scope.config.messageResources = config.messageResources;
    	if ($scope.isSameResource(config.emailResources, config.messageResources)) {
    		$scope.config.bindSameRes = true;
    		$scope.config.sameResources = $scope.config.emailResources;
    	} else {
    		$scope.config.bindSameRes = false;
    	}
    	$scope.title = $translate.instant("alarm.editAlarmConfig");
    	if ($scope.config.emailTemplateId != null && $scope.config.messageTemplateId != null && $scope.config.bindSameRes) {
    		$scope.showEmailItem = true;
    		$scope.showMessageItem = true;
    		$scope.stepTitles = $scope.stepTitles1;
    	} else if ($scope.config.emailTemplateId != null && $scope.config.messageTemplateId != null && !$scope.config.bindSameRes) {
    		$scope.showEmailItem = true;
    		$scope.showMessageItem = true;
    		$scope.stepTitles = $scope.stepTitles4;
    	} else if ($scope.config.emailTemplateId == null && $scope.config.messageTemplateId != null){
    		$scope.showEmailItem = false;
    		$scope.showMessageItem = true;
    		$scope.stepTitles = $scope.stepTitles3;
    	} else if ($scope.config.emailTemplateId != null && $scope.config.messageTemplateId == null) {
    		$scope.showEmailItem = true;
    		$scope.showMessageItem = false;
    		$scope.stepTitles = $scope.stepTitles2;
    	}
    } else {
    	$scope.type = "add";
    	$scope.title = $translate.instant("alarm.addAlarmConfig");
    	$scope.stepTitles = $scope.stepTitles2;
    }
    
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#addAlarmConfigForm').val() === "true") {
                return true;
            }
            return false;
        },
        stepTwoOver : function() {
            return true;
        },
        stepThreeOver : function() {
        	return true;
        },
        stepFourOver : function() {
        	return true;
        }
    };
    
    $scope.nextCallBack = {
	  		"1":function(){
	  			if (($scope.config.emailTemplateId == undefined || $scope.config.emailTemplateId == null)
	  					&& ($scope.config.messageTemplateId == undefined || $scope.config.messageTemplateId == null)) {
	  				UtilService.alert($translate.instant('alarm.selectNoticeTemplatePro'), $translate.instant('common.opertip'), false, 'error');
	  		    	return false;
	  			}
	  			
	  			if ($scope.config.bindSameRes) {
	  				$scope.currentPage = "same";
	  				var msg = {};
	  				msg.data = $scope.config.sameResources;
	  				$scope.$broadcast("changeAlarmItemData", msg);
	  			} else if ($scope.showEmailItem) {
	  				$scope.currentPage = "email";
	  				var msg = {};
	  				msg.data = $scope.config.emailResources;
	  				$scope.$broadcast("changeAlarmItemData", msg);
	  			} else if ($scope.showMessageItem) {
	  				$scope.currentPage = "message";
	  				var msg = {};
	  				msg.data = $scope.config.messageResources;
	  				$scope.$broadcast("changeAlarmItemData", msg);
	  			}
	  			return true;
	  		},
	  		"2":function() {
	  			if ($scope.showMessageItem) {
	  				$scope.currentPage = "message";
	  				var msg = {};
	  				msg.data = $scope.config.messageResources;
	  				$scope.$broadcast("changeAlarmItemData", msg);
	  			}
	  			return true;
	  		}
	};
    
    $scope.preCallBack = {
    		"0":function(){
    			return true;
    		},   
      		"1":function(){
      			if ($scope.showEmailItem) {
      				$scope.currentPage = "email";
	  				var msg = {};
	  				msg.data = $scope.config.emailResources;
	  				$scope.$broadcast("changeAlarmItemData", msg);
      			}
      		}
       };
    
    $scope.$watch("config.bindSameRes", function(newValue, oldValue){
		if (newValue != oldValue) {
			if (newValue == true) {
				$scope.stepTitles = $scope.stepTitles1;
			} else {
				$scope.stepTitles = $scope.stepTitles4;
			}
		}
	});
    
    //选择云资源
    $scope.selectPublicCloud = function() {
    	var param = {flag:2};
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/common/selectSingle.html',
			controller: 'SelectSingleCloudCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {
				params: function(){
					return param;
				},
				customUrl: function(){
					return "alarm/clouds";
				}
			}
		});
		modalInstance.result.then(function (selectedItems) {
			if (angular.isDefined(selectedItems) && selectedItems.length > 0) {
				if (selectedItems[0].id != $scope.config.cloudId) {
					$scope.config.sameResources = [];
					$scope.config.emailResources = [];
					$scope.config.messageResources = [];
				}
				$scope.config.cloudId = selectedItems[0].id;
				$scope.config.cloudName = selectedItems[0].name;
      		}
		}, function (reason) {
		});
    }
    //选择邮件通知模板
    $scope.selectEmailTemplate = function() {
    	var param = {sendType:0};
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/common/selectSingle.html',
			controller: 'SelectNoticeTemplateCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {params : function() {return param;}}
		});
		modalInstance.result.then(function (selectedItems) {
			if (angular.isDefined(selectedItems) && selectedItems.length > 0) {	
				$scope.config.emailTemplateId = selectedItems[0].id;
				$scope.config.emailTemplateName = selectedItems[0].name;
				$scope.showEmailItem = true;
				if ($scope.config.messageTemplateId == undefined && $scope.config.messageTemplateId == null) {
					$scope.showMessageItem = false;
				}
				if ($scope.showMessageItem) {
					if ($scope.config.bindSameRes) {
						$scope.stepTitles = $scope.stepTitles1;
					} else {
						$scope.stepTitles = $scope.stepTitles4;
					}
				} else {
					$scope.stepTitles = $scope.stepTitles2;
				}
      		}
		}, function (reason) {
		});
    }
    //选择短信通知模板
    $scope.selectMessageTemplate = function() {
    	var param = {sendType:1};
		var modalInstance = $modal.open({
			templateUrl: 'html/modal/common/selectSingle.html',
			controller: 'SelectNoticeTemplateCtrl',
			size: 'lg',
			backdrop:'static',
			resolve: {params : function() {return param;}}
		});
		modalInstance.result.then(function (selectedItems) {
			if (angular.isDefined(selectedItems) && selectedItems.length > 0) {	
				$scope.config.messageTemplateId = selectedItems[0].id;
				$scope.config.messageTemplateName = selectedItems[0].name;
				$scope.showMessageItem = true;
				if ($scope.config.emailTemplateId == undefined && $scope.config.emailTemplateId == null) {
					$scope.showEmailItem = false;
				}
				if ($scope.showEmailItem) {
					if ($scope.config.bindSameRes) {
						$scope.stepTitles = $scope.stepTitles1;
					} else {
						$scope.stepTitles = $scope.stepTitles4;
					}
				} else {
					$scope.stepTitles = $scope.stepTitles3;
				}
      		}
		}, function (reason) {
		});
    }
    
    $scope.removeMessageTemplate = function() {
    	$scope.config.messageTemplateId= undefined;
		$scope.config.messageTemplateName = undefined;
		$scope.config.bindSameRes =false;
		$scope.showMessageItem = false;
		$scope.stepTitles = $scope.stepTitles2;
    }
    
    $scope.removeEmailTemplate = function() {
    	$scope.config.emailTemplateId= undefined;
		$scope.config.emailTemplateName = undefined;
		$scope.config.bindSameRes =false;
		$scope.showEmailItem = false;
		if ($scope.showMessageItem) {
			$scope.stepTitles = $scope.stepTitles3;
		} else {
			$scope.stepTitles = $scope.stepTitles2;
		}
    }
    
    function fillData() {
    	var data = {};
    	if (angular.isDefined(config)) {
    		data.id = config.id;
    	}
    	data.cloudId = $scope.config.cloudId;
    	data.cloudName = $scope.config.cloudName;
    	data.emailTemplateId = $scope.config.emailTemplateId;
    	data.emailTemplateName = $scope.config.emailTemplateName;
    	data.messageTemplateId = $scope.config.messageTemplateId;
    	data.messageTemplateName = $scope.config.messageTemplateName;
    	if ($scope.config.bindSameRes) {
    		data.emailResources = data.messageResources= $scope.config.sameResources;
    	} else {
    		if (angular.isDefined(data.emailTemplateId) && data.emailTemplateId != null && (!$scope.config.bindSameRes)) {
        		data.emailResources = $scope.config.emailResources;
        	}
        	if (angular.isDefined(data.messageTemplateId) && data.messageTemplateId != null && (!$scope.config.bindSameRes)) {
            	data.messageResources = $scope.config.messageResources;
        	}
    	}
    	return data;
    }
    
    $scope.ok = function () {
    	var data = fillData();
    	AlarmServiceAsync.checkAlarmConfig(data, function(result) {
    		UtilService.handleResult(result);
    		if (angular.isDefined(result) && result.state == 0) {
    			if (result.data != null && result.data.length > 0) {
      				var modalInstance = UtilService.confirm(result.data + $translate.instant('alarm.confirmToContinue'),$translate.instant('common.opertip'));
      		        modalInstance.result.then(function (selectedItem) {
      		        	$scope.addOrModify(data);
      		        }, function () {
      		        });
      			} else {
      				$scope.addOrModify(data);
      			}
    		}
    	});
    };
    
    $scope.testEmail = function() {
    	if ($scope.config.cloudId == undefined || $scope.config.cloudId == null) {
    		UtilService.alert($translate.instant('alarm.selectCloudTip'), $translate.instant('common.opertip'), false, 'error');
	    	return false;
    	}
    	if ($scope.config.emailTemplateId == undefined || $scope.config.emailTemplateId == null) {
			UtilService.alert($translate.instant('alarm.selectEmailTip'), $translate.instant('common.opertip'), false, 'error');
	    	return false;
		}
    	var modalInstance = UtilService.confirm($translate.instant('alarm.testEmailTip'),$translate.instant('common.opertip'));
        modalInstance.result.then(function (selectedItem) {
        	var waitModal = UtilService.wait();
    		AlarmServiceAsync.testCloudNotice($scope.config.cloudId, $scope.config.emailTemplateId, function(result) {
        		waitModal.dismiss();
        		UtilService.handleResult(result);
        	});
        }, function () {
        });
    	
	}
    
    $scope.testMessage = function() {
    	if ($scope.config.cloudId == undefined || $scope.config.cloudId == null) {
    		UtilService.alert($translate.instant('alarm.selectCloudTip'), $translate.instant('common.opertip'), false, 'error');
	    	return false;
    	}
    	if ($scope.config.messageTemplateId == undefined || $scope.config.messageTemplateId == null) {
			UtilService.alert($translate.instant('alarm.selectMessageTip'), $translate.instant('common.opertip'), false, 'error');
	    	return false;
		}
    	var modalInstance = UtilService.confirm($translate.instant('alarm.testMessageTip'),$translate.instant('common.opertip'));
        modalInstance.result.then(function (selectedItem) {
        	var waitModal = UtilService.wait();
    		AlarmServiceAsync.testCloudNotice($scope.config.cloudId, $scope.config.messageTemplateId, function(result) {
        		waitModal.dismiss();
        		UtilService.handleResult(result);
        	});
        }, function () {
        });
	}
    
    $scope.addOrModify = function(data) {
    	var waitModal = UtilService.wait();
    	if ($scope.type == 'add') {
    		AlarmServiceAsync.addAlarmConfig(data, function(result) {
    			waitModal.dismiss();
    			UtilService.handleResult(result);
    			if (result.state != 1) {
    				$modalInstance.close('success');
    			}
    		});
    	} else {
    		AlarmServiceAsync.modifyAlarmConfig(data, function(result) {
    			waitModal.dismiss();
    			UtilService.handleResult(result);
    			if (result.state != 1) {
    				$modalInstance.close('success');
    			}
    		});
    	}
    }
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

routeApp.controller('selectAlarmItemCtrl',function($scope, $http, $modal, $translate, UtilService,GridService) {
	$scope.mySelections=[];
    $scope.myData=[];
    var column=[{field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'50%', headerCellTemplate:""},
                {field: 'resourceType', displayName: $translate.instant('common.type'), sortable: true,cellFilter:'warnNotifyIndexFlag', width:'50%'}];
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
			filterOptions: false,
			pagingOptions: false,
			columnDefs:column
	};
    
    $scope.$on("changeAlarmItemData", function(event, msg){
    	var hostArr = [];
    	var vmArr = [];
    	for (var i = 0; i < msg.data.length; i++) {
    		if (msg.data[i].resourceType == 0) {
    			hostArr.push(msg.data[i]);
    		} else {
    			vmArr.push(msg.data[i]);
    		}
    	}
		$scope.myData = hostArr.concat(vmArr);
	});
    
    $scope.addHost = function() {
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/common/multiselect.html',
            backdrop: 'static',
            controller:"SelectHostItemCtrl",         
            resolve: {
            	cloudId: function(){
        			return $scope.config.cloudId;
        		},
        		preSelections: function(){
        			var pre = [];
        			for (var i = 0; i < $scope.myData.length; i++) {
        				if ($scope.myData[i].resourceType == 0) {
        					pre.push($scope.myData[i].uniqueKey);
        				}
        			}
        			return pre;
        		}
			}
        });
    	modalInstance.result.then(function (selectedItem) {
        	if(angular.isDefined(selectedItem)){
        		for(var i=0;i<selectedItem.length;i++){
        			var item = {};
        			item.uniqueKey = selectedItem[i].uniqueKey;
        			item.name = selectedItem[i].name;
        			item.resourceType = 0;
        			for(var j=0; j<$scope.myData.length; j++){
        				if($scope.myData[j].uniqueKey == item.uniqueKey && $scope.myData[j].resourceType == item.resourceType){
        					break;
        				}
        			}
        			if(j == $scope.myData.length){
        				$scope.myData.push(item);
        			}
        		}
        		emitDataToParent();
        	}
        }, function (reason) {
        });
    }
    
    $scope.addVms = function() {
    	var modalInstance=$modal.open({
        	templateUrl:"html/modal/common/multiselect.html",
        	controller:"SelectDomainItemCtrl",
        	backdrop:"static",
        	resolve: {
        		cloudId: function(){
        			return $scope.config.cloudId;
        		},
        		preSelections: function(){
        			var pre = [];
        			for (var i = 0; i < $scope.myData.length; i++) {
        				if ($scope.myData[i].resourceType == 1) {
        					pre.push($scope.myData[i].uniqueKey);
        				}
        			}
        			return pre;
        		}
        	}
        });
        modalInstance.result.then(function(selectItem){
        	if(angular.isDefined(selectItem)){
        		for(var i=0;i<selectItem.length;i++){
        			var item = {};
        			item.uniqueKey = selectItem[i].uniqueKey;
        			item.name = selectItem[i].title;
        			item.resourceType = 1;
        			for(var j=0; j<$scope.myData.length; j++){
        				if($scope.myData[j].uniqueKey == item.uniqueKey && $scope.myData[j].resourceType == item.resourceType){
        					break;
        				}
        			}
        			if(j == $scope.myData.length){
        				$scope.myData.push(item);
        			}
        		}
        		emitDataToParent();
        	}
        },function(reason){
        });
    }
    
    //删除指标项
    $scope.deleteIndexs = function() {
    	if ($scope.mySelections.length == 0) {
            return;
        }
        for(var i = 0; i < $scope.mySelections.length; i++){
        	for(var j = 0; j < $scope.myData.length; j++){
        		if($scope.mySelections[i].uniqueKey == $scope.myData[j].uniqueKey && $scope.mySelections[i].resourceType == $scope.myData[j].resourceType){
        			$scope.myData.splice(j,1);
        		}
        	}
        }
        emitDataToParent();
        $scope.mySelections.splice(0, $scope.mySelections.length);//移除被选项
        $scope.gridOptions.$gridScope.model.allSelected = false;//取消全选标记
    };
    
    //向父controller传递指标项数据
    function emitDataToParent() {
    	if ($scope.currentPage == "same") {
    		$scope.config.sameResources = $scope.myData;
    	} else if ($scope.currentPage == "email"){
    		$scope.config.emailResources = $scope.myData;
    	} else if ($scope.currentPage == "message"){
    		$scope.config.messageResources = $scope.myData;
    	}
    }
});

routeApp.controller('SelectHostItemCtrl',function(cloudId, preSelections, $scope, $http, $modal, $translate, $modalInstance,GridService) {
	$scope.title = $translate.instant('alarm.selectHost');
	var column = [{ field: 'name', displayName: $translate.instant('cluster.hostname') , sortable: true, width:'50%'},
	              { field: 'ipAddr', displayName: $translate.instant('cluster.hostip'), sortable: true, width:'50%'},
	              ];
	$scope.mySelections = [];
	$scope.params = {};
	$scope.params.exclusiveUniqueKeyList = preSelections;
	var url = 'alarm/' + cloudId +'/hosts';
    $scope = GridService.grid($scope, url, $scope.params, null, null, 'multiselectGrid');
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

	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

routeApp.controller('SelectDomainItemCtrl',function(cloudId, preSelections, $scope, $http, $timeout, $modal, $translate, $modalInstance,GridService) {
	$scope.title = $translate.instant('alarm.selectVm');
	$scope.params = {};
	$scope.params.exclusiveUniqueKeyList = preSelections;
	var column = [
                  {field: 'title', displayName: $translate.instant('common.displayName') , sortable: true, width:'25%'},
                  {field: 'host', displayName: $translate.instant('cluster.hostname') , sortable: true, width:'20%'},
                  {field: 'desc', displayName: $translate.instant('common.desc') , sortable: true, width:'25%'},
                  {field: 'status', displayName: $translate.instant('common.state') , cellTemplate : vmstatusTemplate($translate), sortable: true, width:'25%'},
                 ];
    // vm数据
	var url = "alarm/" + cloudId +"/domains";
	$scope = GridService.grid($scope, url, $scope.params, null, null, 'multiselectGrid');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    // 创建表格
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
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
			pagingOptions: $scope.pagingOptions,
            columnDefs:column,
            searchBoxSize:'small',
            filterOptions : {
      			filterText: "",
      			useExternalFilter: true
            }
    };
    
    $scope.$on('ngGridEventFilter', function(event, msg) {
        // 设置时间间隔
        if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
            $timeout.cancel($scope.keyInterval);
        }
        $scope.keyInterval = $timeout(function() {
        	selectItem = [];
        	if ($scope.gridOptions && angular.isArray($scope.gridOptions.selectedItems)) {
        		$scope.gridOptions.$gridScope.model.allSelected = false;
            	$scope.gridOptions.selectAll(false);
        	}
        	$scope.params.title = encodeURIComponent(msg);
            $scope.pagingOptions.currentPage = 1;
        	$scope.refreshPage();
        }, constant.keyInterval);
    });
    
    $scope.ok=function(){
    	$modalInstance.close($scope.mySelections);
    };
    
    $scope.cancel=function(){
    	$modalInstance.dismiss("cancel");
    };
});

routeApp.controller('SelectNoticeTemplateCtrl',function(params, $scope, $http, $modal, $translate, $modalInstance,UtilService,GridService, AlarmServiceAsync) {
	$scope.title=$translate.instant('alarm.selectNoticeTemplate');
	$scope.showAddNoticeTemplate = true;
	
	var operationTemplate = '<div><div class="ngCellButton">'
			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyTemplate(row.entity)" has-permission="ALARM_NOTICETEMPLATE_MODIFY" custom-title="{{\'common.modify\'|translate}}"></div>'
			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delTemplate(row.entity)" has-permission="ALARM_NOTICETEMPLATE_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
			+'</div></div>';
	var column=[{ field: 'name', displayName:$translate.instant('common.name'), sortable: false, cellTemplate:titleTemplate, width:'20%'},
        { field: 'desc', displayName:$translate.instant('common.desc'), sortable: false, width:'10%',cellTemplate:titleTemplate},
        { field: 'sendType', displayName:$translate.instant('common.type'), sortable: false, width:'10%',cellFilter:'alarmNoticeType'},
        { field: 'addressStr', displayName:$translate.instant('alarm.address'), sortable: false, width:'20%',cellTemplate:titleTemplate},
        { field: 'alarmLevel', displayName:$translate.instant('alarm.alarmLevel'), sortable: false, width:'15%',cellFilter:'alarmNoticeLevel'},
        { field: 'selectedRuleType', displayName:$translate.instant('alarm.alarmRule'), sortable: false, width:'15%',cellFilter:'alarmNoticeRule'},
        { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'10%', cellTemplate:operationTemplate}];
	var url = "alarm/noticeTemplates";
	$scope = GridService.grid($scope, url, params, undefined, undefined, "singleGrid");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = {
		data: 'myData',
		jqueryUITheme: false,
		jqueryUIDraggable: false,
		selectedItems: $scope.mySelections,
		multiSelect:false,
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
	
	$scope.afterLoad = function() {
		for (var i = 0; i < $scope.myData.length; i++) {
			var addressStr = "";
			for (var j = 0; j < $scope.myData[i].addresses.length; j++) {
				addressStr += $scope.myData[i].addresses[j] + ",";
			}
			if (addressStr.length > 0) {
				addressStr = addressStr.substr(0, addressStr.length - 1);
			}
			$scope.myData[i].addressStr = addressStr;
		}
	}
	
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
	
	$scope.addNoticeTemplate = function() {
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/alarm/addNoticeTemplate.html',
            controller: 'AddNoticeTemplateCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
            	template : function (){
                	return undefined;
                },
                sendType : function() {
                	return params.sendType;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.refreshPage();
        }, function () {
        });
	};
	
	$scope.modifyTemplate = function(row) {
		AlarmServiceAsync.queryNoticeTemplateById(row.id,function(result){
			if (angular.isDefined(result)) {
  				var modalInstance = $modal.open({
  		            templateUrl: 'html/modal/alarm/addNoticeTemplate.html',
  		            controller: 'AddNoticeTemplateCtrl',
  		            backdrop: 'static',
  		            size: 'lg',
  		            resolve: {
  		            	template : function (){
  		                	return result.data;
  		                },
	  		            sendType : function() {
	  	                	return undefined;
	  	                }
  		            }
  		        });
  		        modalInstance.result.then(function (selectedItem) {
  		        	$scope.refreshPage();
  		        }, function () {
  		        });
  			}
		});
	};
	
	$scope.delTemplate = function(row) {
        var modalInstance = UtilService.confirm($translate.instant('alarm.deleteAlarmConfig', {name:row.cloudName}),$translate.instant('common.opertip'));
        modalInstance.result.then(function (selectedItem) {
        	AlarmServiceAsync.deleteNoticeTemplateById(row.id, function(result){
        		UtilService.handleResult(result);
        		$scope.refreshPage();
        	});
        }, function () {
        });
	};
});

routeApp.controller('AlarmOverviewCtrl',function($scope, $rootScope, $http, $modal, $filter, $translate, $state, $timeout, $compile, UtilService, HttpService, EchartService, AlarmServiceAsync) {
	var noDataText = $translate.instant('common.noData');
	var alarmNumChart = echarts.init(document.getElementById("alarmNumChart"));
	var alarmStatusChart = echarts.init(document.getElementById("alarmStatusChart"));
	var alarmLevelChart = echarts.init(document.getElementById("alarmLevelChart"));
	var alarmCatecoryChart = echarts.init(document.getElementById("alarmCatecoryChart"));
	
	var levelColor = ['#F74848','#FF8000','#DFD714','#00B7FF'];
	var catecoryColor = ['#F74848','#FF8000','#9B83DD','#00B7FF','#86CC16','#00676B'];//l14389增加安全类告警颜色
	
	$scope.model = {};
	$scope.catecoryClouds = [];
	$scope.levelClouds = [];
	var params = {flag : 2};
	$http({
       	method: 'GET',
       	url: 'cloud/cloudList',
       	params: params
    }).success(function (result) {
			if (angular.isDefined(result)) {
				var data = result.data;
				for (var i = 0; i < data.length; i++) {
					if (i == 0) {
						$scope.model.currentLevelCloud = $scope.model.currentCatecoryCloud = data[i].id;
					}
					var cloud = {
					      value: data[i].id,
					      label: data[i].name
					};
					$scope.catecoryClouds.push(cloud);
					$scope.levelClouds.push(cloud);
				}
				$scope.execFunction();
				$scope.$watch("model.currentLevelCloud", function(newValue, oldValue){
					if (angular.isDefined(newValue) && newValue != oldValue) {
						EchartService.drawTimePieTrend("alarm/cloud/" + $scope.model.currentLevelCloud + "/levelNum", alarmLevelChart, noDataText, true, null, null, "{b}:{c}({d}%)", levelColor, "alarmLevelChart");
					}
				});
				
				$scope.$watch("model.currentCatecoryCloud", function(newValue, oldValue){
					if (angular.isDefined(newValue) && newValue != oldValue) {
						EchartService.drawTimePieTrend("alarm/cloud/" + $scope.model.currentCatecoryCloud + "/catecoryNum", alarmCatecoryChart, noDataText, true, null, null, "{b}:{c}({d}%)", catecoryColor, "alarmCatecoryChart");
					}
				});
			}			
    }).error(function(response, code, headers, config) {
    	console.error("http error");
    });
	
	var xAxisFormatter = function (params) {
		var date = new Date(params);
		if ("1970-01-01" == date.Format("yyyy-MM-dd")) {
			date = new Date();
			date.setDate(date.getDate() - 1);
		}
        return date.Format("yyyy-MM-dd");
    }
	
	var numChart_DataFormatter = function(rates) {
		var d = [];
		for (var j=0;j<rates.length;j++){
			var date = new Date(rates[j].time);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			d.push([date, rates[j].rate ]);
		}
		return d;
	}
	
	var yAxisFormatter = function (value) {
    	if (value > 1000) {
    		var result = value / 1000;
    		return result + 'k';
    	} else {
    		return value;
    	}
    }
	
	var numChart_TooltipFormatter = function (params) {
    	var name = params.series.name;
		if (name.length > 24) {
			name = name.substring(0, name.length/3) + '<br/>' + name.substring(name.length/3, (name.length/3) * 2) +
			'<br/>' + name.substring((name.length/3) * 2);
		}
        var date = new Date(params.value[0]);
        var data = date.Format("yyyy-MM-dd");
        return name+'<br/>' + data + '<br/>' + params.value[1];
    }
	
	var columnTrend_TooltipFormatter = function (params) {
        return params.name + '<br/>' + params.data;
    }
	
	$scope.execFunction = function() {
		EchartService.drawColumnTrend('alarmStatusChart',"alarm/clouds/unconfirmedNum", alarmStatusChart, '', false, undefined, undefined, columnTrend_TooltipFormatter, undefined, yAxisFormatter);
		EchartService.drawLineTrend('alarmNumChart',"alarm/clouds/num", alarmNumChart, '', false, false, xAxisFormatter, yAxisFormatter, numChart_DataFormatter, numChart_TooltipFormatter, 8 ,18);
		if (angular.isDefined($scope.model.currentLevelCloud)) {
			EchartService.drawTimePieTrend("alarm/cloud/" + $scope.model.currentLevelCloud + "/levelNum", alarmLevelChart, '', true, null, null, "{b}:{c}({d}%)", levelColor, "alarmLevelChart");
		}
		if (angular.isDefined($scope.model.currentCatecoryCloud)) {
			EchartService.drawTimePieTrend("alarm/cloud/" + $scope.model.currentCatecoryCloud + "/catecoryNum", alarmCatecoryChart, '', true, null, null, "{b}:{c}({d}%)", catecoryColor, "alarmCatecoryChart");
		}
	}
	
	var resizeDiv = function() {
		var colWidth = $("#overviewPanel").width() * 0.99;
		var colHeight = ($("#overviewPanel").height() * 0.98 - 20) / 2;
		$(".rowDashboard").css("width", colWidth);
		$(".rowDashboard").css("height", colHeight);
		$(".square-dashboard-49").css("width", (colWidth -20) / 2);
		$(".square-dashboard-49").css("height", colHeight - 10);
	} 
	
	$("#overviewPanel").on('resize', function() {
		resizeDiv();
		alarmNumChart.resize();
		alarmStatusChart.resize();
		alarmLevelChart.resize();
		alarmCatecoryChart.resize();
	});
});

//【实时告警列表控制器】
routeApp.controller('RealtimeAlarmListCtrl',function($scope, $http, $modal, $translate,$timeout, $interval, UtilService,GridService,HttpService) {
	$scope.model = {};
	
	$scope.interval = {
			options:[ {value:5000,label:$translate.instant('paramconfig.5s')}
			,{value:10000,label:$translate.instant('paramconfig.10s')}
			,{value:30000,label:$translate.instant('paramconfig.30s')}
			,{value:60000,label:$translate.instant('paramconfig.1min')}
			,{value:300000,label:$translate.instant('paramconfig.5min')}]
	}
	
	var refreshAlarm = function() {
		$scope.refreshPage();
		$scope.gridOptions.selectedItems.splice(0, $scope.gridOptions.selectedItems.length);
		if (angular.isDefined($scope.gridOptions)) {
			$scope.gridOptions.$gridScope.model.allSelected = false;
		}
	};
	$scope.$watch("model.interval", function(){
		var d = new Date();
		$scope.lastCheckTime = d.getTime();
		$scope.controRefreshData();
	});
	$scope.controRefreshData = function(){
		if($scope.timer){
			$interval.cancel($scope.timer);
		}
		$scope.timer = $interval(function(){
			var now = new Date();
			if(Math.abs(now.getTime() - $scope.lastCheckTime) > $scope.model.interval){
				refreshAlarm();
				$scope.gridOptions.selectAll(false);

			}
		}, $scope.model.interval);
	};
	$scope.$on("$destroy", function(){
		if($scope.timer){
			$interval.cancel($scope.timer);
		}
	})
	$scope.params = {};
	$scope.params.sortDir=2;
	$scope.params.sortField="eventTime";
    
	$scope.model.interval = 10000;
	var url = 'alarm/' + $scope.cloudId + '/realTimeAlarms';
	var column = [
	              { field: 'eventLevel', displayName: $translate.instant('alarm.level'), sortable: true, width:'6%', 
	            	cellTemplate:"<div><div class='ngCellText' ng-class='col.colIndex()'>" +
	            	        "<span ng-if='row.entity[col.field]==1' class='icon-event-critial'></span><span ng-if='row.entity[col.field]==1' style='margin-left:2px;'>{{'alarm.emergency'|translate}}</span>"+
	            	        "<span ng-if='row.entity[col.field]==2' class='icon-event-major'></span><span ng-if='row.entity[col.field]==2' style='margin-left:2px;'>{{'alarm.important'|translate}}</span>"+
	            	        "<span ng-if='row.entity[col.field]==3' class='icon-event-minor'></span><span ng-if='row.entity[col.field]==3' style='margin-left:2px;'>{{'alarm.secondary'|translate}}</span>"+
	            	        "<span ng-if='row.entity[col.field]==4' class='icon-event-prompt'></span><span ng-if='row.entity[col.field]==4' style='margin-left:2px;'>{{'alarm.tip'|translate}}</span>"+
	            			"</div></div>"},
	              { field: 'state', displayName: $translate.instant('alarm.confirmState'), sortable: true, width:'6%', cellFilter: 'alarmStatus'},
	              { field: 'eventSrc', displayName: $translate.instant('alarm.alarmSource'), sortable: true, width:'17%',
	            	  cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">'+
		            	'<div  custom-title="{{row.entity[col.field]}}">{{row.entity[col.field]}}</div>'+
		              	'</div>'},
	              { field: 'category', displayName: $translate.instant('common.type'), sortable: true, width:'10%', cellFilter: 'alarmType'},
	              { field: 'eventDesc', displayName: $translate.instant('alarm.alarmInfo'), sortable: true, width:'26%', 
	            	cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" custom-title="{{row.entity[col.field]}}">{{row.entity[col.field]}}</div>'},
	              { field: 'eventTime', displayName: $translate.instant('alarm.alarmTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'13%'},
	              { field: 'firstEventTime', displayName: $translate.instant('alarm.firstAlarmTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"', sortable: true, width:'13%'},
	              { field: 'eventCount', displayName: $translate.instant('alarm.eventCount'), sortable: true, width:'9%'}
	              ]
	$scope = GridService.grid($scope, url, $scope.params, null, null, 'realtimeAlarmListDivId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
	$scope.$on(constant.onQueryGridError, function(event, msg){
		if($scope.timer){
			$interval.cancel($scope.timer);
		}
	});
	
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showGroupPanel: false,
			multiSelect:false,
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
	// 动态控制grid的宽和高
	$scope.listStyle = $scope.gridStyle(-5);
	listenNavClick($scope, $timeout);
	
	// 刷新页面
	$scope.refresh = function() {
		refreshAlarm();
	}
	
	//过滤
    $scope.filter = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/alarm/realTimeAlarmFilter.html',
            controller: 'RealTimeAlarmFilterCtrl',
            backdrop: 'static',
            resolve: {
            	params: function(){
           		 return $scope.params;
           	 }
            }
        });
        modalInstance.result.then(function (selectedItem) {
       	 	if (angular.isDefined(selectedItem)) {
       	 		$scope.params = selectedItem;
       	 		$scope.params.sortDir=2;
       	 		$scope.params.sortField="eventTime";
	       	 	if ($scope.pagingOptions.currentPage != 1){
					$scope.pagingOptions.currentPage = 1;
				} else {
		   		 	$scope.refresh();
				}
       	 	}
        }, function (reason) {
        });
    };
    
    $scope.exportAlarm=function(){
    	 var param = "height=100, width=100, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
    	 var url = "download/" + + $scope.cloudId +  "/alarm";
		 var queryStr = "";
		 if($scope.params.state){
			 queryStr += "state="+$scope.params.state+"&";
		 }
		 if($scope.params.eventLevel){
			 queryStr += "eventLevel="+$scope.params.eventLevel+"&";
		 }
		 if($scope.params.category){
			 queryStr += "category="+$scope.params.category+"&";
		 }
		 if($scope.params.eventDesc){
			 queryStr += "eventDesc="+encodeURIComponent($scope.params.eventDesc)+"&";
		 }
		 if($scope.params.eventSrc){
			 queryStr += "eventSrc="+encodeURIComponent($scope.params.eventSrc)+"&";
		 }
		 if ($scope.params.eventTime_to){
			 queryStr += "eventTime_from="+$scope.params.eventTime_from+"&";
		 }
		 if ($scope.params.eventTime_to){
			 queryStr += "eventTime_to="+$scope.params.eventTime_to+"&";
		 }
		 if(queryStr){
			 queryStr = queryStr.substring(0, queryStr.length - 1);
			 url += "?" + queryStr;
		 }
		 window.open(url, "_blank", param);
    }
});

//过滤实时告警
routeApp.controller('RealTimeAlarmFilterCtrl', function($scope, $rootScope, $state, $http, $translate, $modalInstance,$timeout,params) {
	$scope.startMaxDate = new Date();
	$scope.endMaxDate = new Date();
	$scope.filter = {};
	$scope.filter.state = 0;
	$scope.filter.eventLevel = 0;
	$scope.filter.category = 0;
	$scope.state = {
			options:[{value:'0',label:$translate.instant('alarm.allState')}
			,{value:'1',label:$translate.instant('alarm.confirmOk')}
			,{value:'2',label:$translate.instant('alarm.notconfirm')}]
	};
	$scope.level = {
			options:[{value:'0',label:$translate.instant('alarm.allLevel')}
			,{value:'1',label:$translate.instant('alarm.emergency')}
			,{value:'2',label:$translate.instant('alarm.important')}
			,{value:'3',label:$translate.instant('alarm.secondary')}
			,{value:'4',label:$translate.instant('alarm.tip')}]
	};
	
	$scope.category = {
			options:[{value:'0',label:$translate.instant('alarm.allType')}
			,{value:'1',label:$translate.instant('alarm.hostAlarm')}
			,{value:'2',label:$translate.instant('alarm.vmAlarm')}
			,{value:'3',label:$translate.instant('alarm.clusterAlarm')}
			,{value:'4',label:$translate.instant('alarm.troubleAlarm')}
//			,{value:'5',label:$translate.instant('alarm.opertorAlarm')}
			,{value:'7',label:$translate.instant('alarm.securityAlarm')}
			,{value:'6',label:$translate.instant('alarm.exceptionAlarm')}
			]
	
	};
    
	$timeout(function(){
        $("#finishTimeStartInput").change(function(){
            var value = $("#finishTimeStartInput").val();
            if (value != "") {
            	var d = new Date();
            	d.setYear(parseInt(value.substring(0, 4)));
                d.setMonth(parseInt(value.substring(5, 7))-1);
                d.setDate(parseInt(value.substring(8, 10)));
                d.setHours(parseInt(value.substring(11, 13)));
                d.setMinutes(parseInt(value.substring(14, 16)));
                d.setSeconds(parseInt(value.substring(17, 19)));
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
                d.setHours(parseInt(value.substring(11, 13)));
                d.setMinutes(parseInt(value.substring(14, 16)));
                d.setSeconds(parseInt(value.substring(17, 19)));
                $scope.startMaxDate = d;
            } else {
            	$scope.startMaxDate = undefined;
            }
            $scope.$digest();
        });
        
        if(angular.isDefined(params)){
    		if (!isEmpty(params.state)) {
    			$scope.filter.state = params.state;
    		}
    		if (!isEmpty(params.eventLevel)) {
    			$scope.filter.eventLevel = params.eventLevel;
    		}
    		if (!isEmpty(params.category)) {
    			$scope.filter.category = params.category;
    		}
    		if (!isEmpty(params.eventDesc)) {
    			$scope.filter.eventDesc = decodeURIComponent(params.eventDesc);
    		}
    		if (!isEmpty(params.eventSrc)) {
    			$scope.filter.eventSrc = decodeURIComponent(params.eventSrc);
    		}
    		$("#finishTimeStartInput").val(params.eventTime_from);
    		if (params.eventTime_from != undefined) {
    			var d = new Date();
    			d.setYear(parseInt(params.eventTime_from.substring(0, 4)));
                d.setMonth(parseInt(params.eventTime_from.substring(5, 7))-1);
                d.setDate(parseInt(params.eventTime_from.substring(8, 10)));
                d.setHours(parseInt(params.eventTime_from.substring(11, 13)));
                d.setMinutes(parseInt(params.eventTime_from.substring(14, 16)));
                d.setSeconds(parseInt(params.eventTime_from.substring(17, 19)));
    			$scope.endMinDate = d;
    		}
    		$("#finishTimeEndInput").val(params.eventTime_to);
    		if (params.eventTime_to != undefined) {
    			var d = new Date();
    			d.setYear(parseInt(params.eventTime_to.substring(0, 4)));
                d.setMonth(parseInt(params.eventTime_to.substring(5, 7))-1);
                d.setDate(parseInt(params.eventTime_to.substring(8, 10)));
                d.setHours(parseInt(params.eventTime_to.substring(11, 13)));
                d.setMinutes(parseInt(params.eventTime_to.substring(14, 16)));
                d.setSeconds(parseInt(params.eventTime_to.substring(17, 19)));
    			$scope.startMaxDate = d;
    		}
    	}
    });
    
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    
    // 重置
    $scope.reset = function() {
    	$scope.filter.state = 0;
		$scope.filter.eventLevel = 0;
		$scope.filter.category = 0;
		$scope.filter.eventDesc = '';
		$scope.filter.eventSrc = '';
    	$("#finishTimeStartInput").val(""); 
        $("#finishTimeEndInput").val("");
        $scope.startMaxDate = $scope.endMaxDate = new Date();
        $scope.endMinDate= undefined;
	}
    
    $scope.ok = function () {
        var params = {};
        if ($scope.filter.state != 0){
        	params.state = $scope.filter.state;
        }
        if ($scope.filter.eventLevel != 0){
        	params.eventLevel = $scope.filter.eventLevel;
        }
        if ($scope.filter.category != 0){
        	params.category = $scope.filter.category;
        }
        if (!isEmpty($scope.filter.eventDesc)){
        	params.eventDesc = encodeURIComponent($scope.filter.eventDesc);
        }
        if (!isEmpty($scope.filter.eventSrc)){
        	params.eventSrc = encodeURIComponent($scope.filter.eventSrc);
        }
        if (!isEmpty($("#finishTimeStartInput").val())){
        	params.eventTime_from = $("#finishTimeStartInput").val();
        }
        if (!isEmpty($("#finishTimeEndInput").val())){
        	params.eventTime_to = $("#finishTimeEndInput").val();
        }
        $modalInstance.close(params);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

//【告警通知配置控制器】
routeApp.controller('AlarmNoticeTemplateCtrl',function($scope, $http, $modal, $translate,$timeout, $filter, UtilService,GridService, HttpService, AlarmServiceAsync) {
	var url = 'alarm/noticeTemplates';
	var operationTemplate = '<div><div class="ngCellButton">'
	 			+'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="modifyTemplate(row.entity)" has-permission="ALARM_NOTICETEMPLATE_MODIFY" custom-title="{{\'common.modify\'|translate}}"></div>'
	 			+'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="delTemplate(row.entity)" has-permission="ALARM_NOTICETEMPLATE_DELETE" custom-title="{{\'common.delete\'|translate}}"></div>'
	 			+'</div></div>';
	var column=[{ field: 'name', displayName:$translate.instant('common.name'), sortable: false, cellTemplate:titleTemplate, width:'20%'},
	            { field: 'desc', displayName:$translate.instant('common.desc'), sortable: false, width:'10%',cellTemplate:titleTemplate},
	            { field: 'sendType', displayName:$translate.instant('common.type'), sortable: false, width:'10%',cellFilter:'alarmNoticeType'},
	            { field: 'addressStr', displayName:$translate.instant('alarm.address'), sortable: false, width:'20%',cellTemplate:titleTemplate},
	            { field: 'alarmLevel', displayName:$translate.instant('alarm.alarmLevel'), sortable: false, width:'15%',cellFilter:'alarmNoticeLevel'},
	            { field: 'selectedRuleType', displayName:$translate.instant('alarm.alarmRule'), sortable: false, width:'15%',cellFilter:'alarmNoticeRule'},
	            { field: 'oper', displayName:$translate.instant('common.oper'), sortable: false, width:'10%', cellTemplate:operationTemplate}];
	$scope = GridService.grid($scope, url, undefined, undefined, undefined , "noticeTemplateDivId");
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			multiSelect:false,
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
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope.afterLoad = function() {
		for (var i = 0; i < $scope.myData.length; i++) {
			var addressStr = "";
			if (angular.isDefined($scope.myData[i].addresses)) {
				$scope.myData[i].addresses.sort();
				for (var j = 0; j < $scope.myData[i].addresses.length; j++) {
					addressStr += $scope.myData[i].addresses[j] + ",";
				}
				if (addressStr.length > 0) {
					addressStr = addressStr.substr(0, addressStr.length - 1);
				}
			}
			$scope.myData[i].addressStr = addressStr;
		}
	}
	
	$scope.refresh = function() {
		$scope.refreshPage();
	}
	
	$scope.addNoticeTemplate = function() {
		var modalInstance = $modal.open({
            templateUrl: 'html/modal/alarm/addNoticeTemplate.html',
            controller: 'AddNoticeTemplateCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
            	template : function (){
                	return undefined;
                },
                sendType : function() {
                	return undefined;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	$scope.refreshPage();
        }, function () {
        });
	};
	
	$scope.modifyTemplate = function(row) {
		AlarmServiceAsync.queryNoticeTemplateById(row.id, function(result){
			if (angular.isDefined(result)) {
  				var modalInstance = $modal.open({
  		            templateUrl: 'html/modal/alarm/addNoticeTemplate.html',
  		            controller: 'AddNoticeTemplateCtrl',
  		            backdrop: 'static',
  		            size: 'lg',
  		            resolve: {
  		            	template : function (){
  		                	return result.data;
  		                },
	  		            sendType : function() {
	  	                	return undefined;
	  	                }
  		            }
  		        });
  		        modalInstance.result.then(function (selectedItem) {
  		        	$scope.refreshPage();
  		        }, function () {
  		        });
  			}
		});
	};
	
	$scope.delTemplate = function(row) {
        var modalInstance = UtilService.confirm($translate.instant('alarm.deleteNoticeTemplate', {name:row.name}),$translate.instant('common.opertip'));
        modalInstance.result.then(function (selectedItem) {
        	AlarmServiceAsync.deleteNoticeTemplateById(row.id, function(result) {
        		UtilService.handleResult(result);
        		$scope.refreshPage();
        	});
        }, function () {
        });
	};
});

//增加告警通知模板控制器
routeApp.controller('AddNoticeTemplateCtrl',function($scope, $http, $filter, $timeout, $translate, $modalInstance, template, sendType, HttpService, UtilService, AlarmServiceAsync) {
	$scope.model = {};
	$scope.type = "add";
	$scope.model.sendType = 0;
	$scope.model.alarmLevel0 = 1;
	$scope.model.alarmLevel1 = 1;
	$scope.model.alarmLevel2 = 0;
    $scope.model.alarmLevel3 = 0;
    $scope.model.alarmLevel = 12;
	$scope.model.selectedRuleType = 0;
	$scope.model.addresses = [];
	$scope.model.addressStr = "";
	if (angular.isDefined(sendType)) {
		$scope.model.sendType = sendType;
	}
	if (angular.isDefined(template)) {
		$scope.title = $translate.instant('alarm.editNoticeTemplate');
		$scope.type = "edit";
		$scope.model.name = template.name;
		$scope.model.desc = template.desc;
		$scope.model.sendType = template.sendType;
		$timeout(function(){
			for (var i = 0; i < template.addresses.length; i++) {
				$scope.model.addresses.push({'value':template.addresses[i],'label':template.addresses[i]});
				if ($scope.model.addressStr.length == 0) {
		    		$scope.model.addressStr += template.addresses[i];
		    	} else {
		    		$scope.model.addressStr += "," + template.addresses[i];
		    	}
			} 
	    });
		$scope.model.alarmLevel0 = (template.alarmLevel & 8) >> 3 ;
    	$scope.model.alarmLevel1 = (template.alarmLevel & 4) >> 2  ;
    	$scope.model.alarmLevel2 = (template.alarmLevel & 2) >> 1 ;
    	$scope.model.alarmLevel3 = template.alarmLevel & 1;
    	$scope.model.alarmLevel = template.alarmLevel;
		$scope.model.selectedRuleType = template.selectedRuleType;
		$scope.model.alarmRules = template.alarmRules;
	} else {
		$scope.title = $translate.instant('alarm.addNoticeTemplate');
		$scope.type = "add";
	}
	
	$scope.sendType = {
			options:[{value:'0',label:$translate.instant('alarm.emailNotice')}
			,{value:'1',label:$translate.instant('alarm.messageNotice')}]
	};
	
	$scope.allAlarm = {
			options:[{value:'0',label:$translate.instant('alarm.allAlarm')}
			,{value:'1',label:$translate.instant('alarm.selectAlarm')}]
	};
	
	$scope.stepTitles = [$translate.instant('alarm.baseInfo'), $translate.instant('alarm.address'),
	                     $translate.instant('alarm.alarmRule')];
	
	//form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#addAlarmNoticeForm').val() === "true") {
                return true;
            }
            return false;
        },
        stepTwoOver : function() {
            if ($('#addAlarmNoticeForm2').val() === "true")
                return true;
            return false;
        },
        stepThreeOver : function() {
            if ($('#addAlarmNoticeForm3').val() === "true")
                return true;
            return false;
        }
    };
    
    $scope.nextCallBack = {
	  		"1":function(){
                return true;
	  		},
	  		"2":function() {
	  		    if ($scope.model.addresses.length == 0) {
	  		    	var message;
	  		    	if ($scope.model.sendType == 0) {
	  		    		message = $translate.instant('alarm.emailListNull');
	  		    	} else {
	  		    		message = $translate.instant('alarm.messageListNull');
	  		    	}
	  		    	UtilService.alert(message, $translate.instant('common.opertip'), false, 'error');
	  		    	return false;
	  		    }
	  		    return true;
	  		},
	  		"3":function() {
	  		    return true;
	  		}
	};
    
	$scope.$watch("model.sendType", function(newValue, oldValue){
		if (newValue == 0) {
			$scope.model.messageAddr = "";
		} else {
			$scope.model.emailAddr = "";
		}
		$scope.model.addresses.clear();
		$scope.model.addressStr = "";
	});
    
    $scope.addAddress = function() {
    	if ($scope.model.sendType == 0) {
    		if (!$scope.model.emailAddr) {
                return;
            }
    		for (var i = 0; i < $scope.model.addresses.length; i++) {
                if ($scope.model.addresses[i].value.toLowerCase() == $scope.model.emailAddr.toLowerCase()) {
                	UtilService.alert($translate.instant('alarm.existAddress'), $translate.instant('common.opertip'), false, 'error');
                	return;
                }
            }
    		$scope.model.addresses.push({'value':$scope.model.emailAddr,'label':$scope.model.emailAddr});
    		if ($scope.model.addressStr.length == 0) {
        		$scope.model.addressStr += $scope.model.emailAddr;
        	} else {
        		$scope.model.addressStr += "," + $scope.model.emailAddr;
        	}
    		$scope.model.emailAddr = "";
    	} else {
    		if (!$scope.model.messageAddr) {
                return;
            }
    		for (var i = 0; i < $scope.model.addresses.length; i++) {
                if ($scope.model.addresses[i].value == $scope.model.messageAddr) {
                	UtilService.alert($translate.instant('alarm.existAddress'), $translate.instant('common.opertip'), false, 'error');
                	return;
                }
            }
    		$scope.model.addresses.push({'value':$scope.model.messageAddr,'label':$scope.model.messageAddr});
    		if ($scope.model.addressStr.length == 0) {
        		$scope.model.addressStr += $scope.model.messageAddr;
        	} else {
        		$scope.model.addressStr += "," + $scope.model.messageAddr;
        	}
    		$scope.model.messageAddr = "";
    	}
    	
    };
    
    $scope.deleteAddress = function() {
    	if ($scope.model.selectedAddress.length == 0) {
            return;
        }
    	for (var i = 0; i < $scope.model.selectedAddress.length; i++) {
    		var item = $scope.model.selectedAddress[i];
    		var index = -1;
            for (var j = 0; j < $scope.model.addresses.length; j++) {
                if ($scope.model.addresses[j].value == item) {
                    index = j;
                }
            }
            if (index >= 0) {
            	$scope.model.addresses.splice(index, 1);
            }
    	}
    	$scope.model.addressStr= "";
    	for (var i = 0; i < $scope.model.addresses.length; i++) {
    		$scope.model.addressStr += $scope.model.addresses[i].value + ",";
    	}
    	if ($scope.model.addressStr.length != 0) {
    		$scope.model.addressStr.substr(0, $scope.model.addressStr.length - 1);
    	}
    };
    
    $scope.$watchGroup(["model.alarmLevel0","model.alarmLevel1","model.alarmLevel2","model.alarmLevel3"],function(newValue,oldValue){
    	if(newValue != oldValue){
    		$scope.model.alarmLevel = $scope.model.alarmLevel0 * 8 + $scope.model.alarmLevel1 * 4 
    		+ $scope.model.alarmLevel2 * 2 + $scope.model.alarmLevel3 * 1;
    	}
    });
    
    $scope.$watch("model.selectedRuleType",function(newValue,oldValue){
    	if($scope.model.selectedRuleType=='0'){
    		for (var i = 0; i < $scope.tree.data.length; i++) {
    			$scope.tree.data[i].enable = true;
    			for (var j = 0; j < $scope.tree.data[i].children.length; j++) {
    				$scope.tree.data[i].children[j].enable = true;
    			}
    		}
    	}else{
    		for (var i = 0; i < $scope.tree.data.length; i++) {
    			$scope.tree.data[i].enable = false;
    			for (var j = 0; j < $scope.tree.data[i].children.length; j++) {
    				$scope.tree.data[i].children[j].enable = false;
    			}
    		}
    	}
    });
    
    $scope.column = [
                  	  { field: 'oper', displayName:  $translate.instant('common.oper'),width:'40%', 
                  		  cellTemplate:'<div style="margin-top:-3px;">'
                  		 +'<div toggle-switch is-disabled="cellTemplateScope.model.selectedRuleType==\'0\'" style="margin-top: 0px;" on-label="' + $translate.instant('common.yes') + '" off-label="' + $translate.instant('common.no') + '" class="switch-small switch-success" ng-mouseup="cellTemplateScope.switchRule(row.branch, $event)" ng-model="row.branch.enable"></div>'
                  		 +'</div>',cellTemplateScope:$scope}];
    $scope.expandColum = {field: 'ruleName', displayName: $translate.instant('alarm.indexterm'),width:'60%',cellTemplateScope:$scope,
			cellTemplate:'<span custom-title="{{row.branch[expandingProperty.field]}}">{{row.branch[expandingProperty.field]}}</span>'};
	$scope.tree = {};
	$scope.tree.controller = {};
	$scope.tree.data = [];//树展示的数据
	
	$scope.queryTreeData = function(templateId) {
		var waitModal = UtilService.wait();
        $http({
            method: "GET",
            url: "alarm/rules"
        }).success(function(result) {
            waitModal.dismiss();
            packagingTreeData(result.data);
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            waitModal.dismiss();
            UtilService.handleError(code);
        });
	};
	
	$scope.queryTreeData();
	
	/** 组装树结构数据*/
	function packagingTreeData(data) {
		$scope.tree.data.splice(0, $scope.tree.data.length);
		var tempTreeMap = new Map();
        for (var i = 0; i < data.length; i++) {
        	var row = data[i];
            if (tempTreeMap.get(row.category) == null) {
            	var parent = {};
            	parent.ruleName = $filter('alarmType')(row.category, $translate);
            	parent.level = 1;
            	parent.children = new Array();
            	parent.id = row.category;
            	tempTreeMap.put(row.category ,parent);
            }
            row.level = 2;
            row.children = new Array();
            if ($scope.type == "add") {
        		row.enable = true;
        		tempTreeMap.get(row.category).enable = true;
        	} else if ($scope.model.alarmRules.contains(row.id)) {
        		row.enable = true;
        		tempTreeMap.get(row.category).enable = true;
        	} else {
        		row.enable = false;
        		tempTreeMap.get(row.category).enable = tempTreeMap.get(row.category).enable ? true : false;
        	}
            tempTreeMap.get(row.category).children.push(row);
        }
        tempTreeMap.each(function(key, value, index) {
        	$scope.tree.data.splice(key - 1, 0, value);
        });
	}
	
	$scope.switchRule = function(row, event) {
		if (!event) {
            event = window.event;
        }
		if (event.which == 1 && $scope.model.selectedRuleType != '0') {// 1:left, 2:middle, 3:right
			if (row.level == 1) {
				for (var i = 0; i < row.children.length; i++) {
					row.children[i].enable = !row.enable;
				}
			} else if (row.level == 2) {
				//mousedown优于click事件触发，故row.enable还未更变，需反向处理
				var parent = $scope.tree.controller.get_parent_branch(row);
				if (!row.enable) {
					parent.enable = true;
				} else {
					var isAllClosed = true;
					for (var i = 0; i < parent.children.length; i++) {
						if (parent.children[i].enable && parent.children[i].id != row.id) {
							isAllClosed = false;
						}
					}
					if (isAllClosed) {
						parent.enable = false;
					}
				}
			}
		}
	}
	
	$scope.fillData = function() {
		var data = {};
		if (angular.isDefined(template)) {
			data.id = template.id;
		}
		data.name = $scope.model.name;
		data.desc = $scope.model.desc;
		data.sendType = $scope.model.sendType;
		data.addresses = [];
		for (var i = 0; i < $scope.model.addresses.length; i++) {
			data.addresses.push($scope.model.addresses[i].value);
		}
		data.alarmLevel = $scope.model.alarmLevel;
		data.selectedRuleType = $scope.model.selectedRuleType;
		data.alarmRules = [];
		for (var i = 0; i < $scope.tree.data.length; i ++) {
			for (var j = 0; j < $scope.tree.data[i].children.length; j++) {
				if ($scope.tree.data[i].children[j].enable) {
					data.alarmRules.push($scope.tree.data[i].children[j].id);
				}
			}
		}
		return data;
	}
	
	$scope.ok = function () {
		if ($scope.model.alarmLevel == 0) {
			UtilService.alert($translate.instant('alarm.warnLevelNull'), $translate.instant('common.opertip'), false, 'error');
		    return;
		}
		if ($scope.model.selectedRuleType == 1) {
			var isSelecedRule = false;
			outer:
			for (var i = 0; i < $scope.tree.data.length; i ++) {
				for (var j = 0; j < $scope.tree.data[i].children.length; j++) {
					if ($scope.tree.data[i].children[j].enable) {
						isSelecedRule = true;
						break outer;
					}
				}
			}
			if (!isSelecedRule) {
				UtilService.alert($translate.instant('alarm.warnRuleNull'), $translate.instant('common.opertip'), false, 'error');
  		    	return;
			}
		}
		var data = $scope.fillData();
		if ($scope.type == "add") {
			var waitModal = UtilService.wait();
			AlarmServiceAsync.addNoticeTemplate(data, function(result){
				waitModal.dismiss();
				UtilService.handleResult(result);
				if (result.state != 1) {
    				$modalInstance.close('success');
    			}
			});
		} else {
			var waitModal = UtilService.wait();
			AlarmServiceAsync.modifyNoticeTemplate(data, function(result){
				waitModal.dismiss();
				UtilService.handleResult(result);
				if (result.state != 1) {
    				$modalInstance.close('success');
    			}
				AlarmServiceAsync.isNoticeTemplateUsed(data.id, data.sendType, function(result) {
					if (angular.isDefined(result) && result.data.length > 0) {
		  				var modalInstance = UtilService.confirm($translate.instant('alarm.reissueNoticeTemplate', {name:result.data}),$translate.instant('common.opertip'));
		  		        modalInstance.result.then(function (selectedItem) {
		  		        	var waitModal = UtilService.wait();
		  		        	AlarmServiceAsync.issueNoticeTemplate(data.id, function(result){
		  		        		waitModal.dismiss();
		  		        		UtilService.handleResult(result);
		  		        	});
		  		        }, function () {
		  		        });
		  			}
				});
			});
		}
	};
  
	$scope.cancel = function () {
		$modalInstance.dismiss('cancle');
	};
});