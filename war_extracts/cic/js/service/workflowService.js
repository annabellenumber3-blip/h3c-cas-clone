angular.module('app.workflowService',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('WorkflowService', function($http , $modal ,$state, $translate,$timeout, HttpService, UtilService, GridService){
	return {
		//界面定制按钮
	    uicustom : function(data) {
	        var modalInstance = $modal.open({
	            templateUrl: 'html/modal/common/uicustom.html',
	            controller: 'uicustomCtrl',
	            width:'810PX',
	            WINDOWCLass: "editvm-dialog",
	            backdrop: 'static',
	            resolve: {
	            	data: function () {
	            		return data;
	            	}
	            }
	        });
	        modalInstance.result.then(function (selectedItem) {
	        	
	        }, function () {
	        	
	        });
	    },
	    // 附加字段
	    defineField : function() {
	        var modalInstance = $modal.open({
	            templateUrl: 'html/modal/workflow/defineFieldList.html',
	            controller: 'DefineFieldCtrl',
	            size:'lg',
	            backdrop: 'static'
	        });
	        modalInstance.result.then(function (selectedItem) {
	        }, function () {
	        });
	    },
	    downloadWorkflow : function(params) {
	    	var modalInstance = UtilService.confirm($translate.instant("workflow.downloadVmWfTip"), $translate.instant("common.opertip"));
	    	modalInstance.result.then(function(){
	    		var data = angular.copy(params);
	    		if (data.status == 15){
	    			delete data.status
	    		}
	    		$http({
	    			method : "GET",
	    			url : "workflow/compress",
	    			params:data
	    		}).success(function(result){
	    			if (result.success && result.data){
	    				var param = "height=100, width=100, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
	    				var path = encodeURIComponent(UtilService.encryptByDES(result.data.path));
	           		 	var name = encodeURIComponent(UtilService.encryptByDES("vmWorkflow.tar.gz"));
	    				var url = "download/fileDownload?filePath=" + path + "&fileName=" + name;
	    				window.open(url, "_blank", param);
	    			}
	    		}).error(function(response, code, headers, config) {
	        		UtilService.handleError(code);
	        });
	    	}, function(){});
	    },
		handlerWorkflow : function(data) {
		    $http.get('workflow/field/list').success(function(result){
    		     var modalInstance = $modal.open({
    	             templateUrl: 'html/modal/workflow/handlerWorkflow.html',
    	             controller: 'WorkflowCommonCtrl',
    	             windowClass: 'editvm-dialog',
    	             size:'lg',
    	             backdrop: 'static',
    	             resolve: {
    	            	 data: function () {
    	                     return data;
    	                 },
    	                 fields : function () {
    	                     return result.data;
    	                 }
    	             }
    	         });
    	         modalInstance.result.then(function (selectedItem) {
    	         }, function () {
    	         });
		    }).error(function(response, code, headers, config) {
	        });
		 },
		 vmImplement: function(data) {
			 if (!isEmpty(data.osVersion) && (data.osVersion.indexOf("AIX") > -1 || data.osVersion.indexOf("HP") > -1)) {
				 // 申请unix虚拟机
				 var modalInstance = $modal.open({
		    			templateUrl: 'html/modal/workflow/workflowVmUnix.html',
		    			controller: 'VmUnixImplementCtrl',
		    			size:'lg',
		    			backdrop: 'static',
		    			resolve: {
		    				data: function () {
		    					return data;
		    				}
		    			}
		    	});
				modalInstance.result.then(function (selectedItem) {
				}, function () {
				});
			 } else {
				// 1模板申请 3自定义申请 0注销 4延期
		    	if (data.type == null || data.type == 1) {
		    		// 模板申请虚拟机deploy
		    		var modalInstance = $modal.open({
		    			templateUrl: 'html/modal/workflow/workflowTemplateDeployVm.html',
		    			controller: 'VmDeployImplementCtrl',
		    			size:{width:'960px'},
		    			backdrop: 'static',
		    			resolve: {
		    				data: function () {
		    					return data;
		    				}
		    			}
		    		});
		    		modalInstance.result.then(function (selectedItem) {
		    		}, function () {
		    		}); 
		    	} else if (data.type == 0) {
		    		var modalInstance = $modal.open({
		    			templateUrl: 'html/modal/workflow/workflowVmCancel.html',
		    			controller: 'VmCancelImplementCtrl',
//		    			size:'lg',
		    			backdrop: 'static',
		    			resolve: {
		    				data: function () {
		    					return data;
		    				}
		    			}
		    		});
		    		modalInstance.result.then(function (selectedItem) {
		    		}, function () {
		    		}); 
		    	} else if (data.type == 4) { // 延期
		    		var modalInstance = $modal.open({
		    			templateUrl: 'html/modal/workflow/workflowVmDelay.html',
		    			controller: 'VmDelayImplementCtrl',
//		    			size:'lg',
		    			backdrop: 'static',
		    			resolve: {
		    				data: function () {
		    					return data;
		    				}
		    			}
		    		});
		    		modalInstance.result.then(function (selectedItem) {
		    		}, function () {
		    		}); 
		    	} else if (data.type == 3) {
	    		// // 申请空的虚拟机
		    		var modalInstance = $modal.open({
		    			templateUrl: 'html/modal/workflow/workflowDeployVm.html',
		    			controller: 'VmImplementCtrl',
		    			size:'lg',
		    			backdrop: 'static',
		    			resolve: {
		    				data: function () {
		    					return data;
		    				}
		    			}
		    		});
		    		modalInstance.result.then(function (selectedItem) {
		    		}, function () {
		    		});
				}
			 }
		 },
		 diskImplement: function(data) {
			 var modalInstance = $modal.open({
	             templateUrl: 'html/modal/workflow/diskImplement.html',
	             controller: 'DiskImplementCtrl',
	             size:{width:'486px'},
	             backdrop: 'static',
	             resolve: {
	            	 data: function () {
	                     return data;
	                 }
	             }
	         });
	         modalInstance.result.then(function (selectedItem) {
	         }, function () {
	         });
		 },
		 registerImplement: function(data) {
			 var modalInstance = $modal.open({
	             templateUrl: 'html/modal/workflow/registerImplement.html',
	             controller: 'RegisterImplementCtrl',
//	             size:'lg',
	             backdrop: 'static',
	             resolve: {
	            	 data: function () {
	                     return data;
	                 }
	             }
	         });
	         modalInstance.result.then(function (selectedItem) {
	         }, function () {
	         });
		 },
		 backupImplement: function(data) {
			 var modalInstance = $modal.open({
	             templateUrl: 'html/modal/workflow/backupImplement.html',
	             controller: 'BackupImplementCtrl',
//	             size:'lg',
	             backdrop: 'static',
	             resolve: {
	            	 data: function () {
	                     return data;
	                 }
	             }
	         });
	         modalInstance.result.then(function (selectedItem) {
	         }, function () {
	         });
		 },
		 handleWorkflowInfo : function () {
			// 查询步骤信息
			var resultTmp = '<div class="ngCellText" ng-class="col.colIndex()">' +
				    '<span ng-if= \'row.entity.handleResult == 1\' translate="workflow.pass"></span>' +
				    '<span ng-if= \'row.entity.handleResult == 2\' translate="workflow.refuse"></span>' +
				    '<span ng-if= \'row.entity.handleResult == 3\' translate="workflow.trun"></span></div>' ;
			var operationTemplate = '<div><div class="ngCellText">'
			var aggregateTemplate = '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" style="cursor:pointer;" class="ngAggregate">' +
				'<div class="{{row.aggClass()}}"></div><div style="margin-left:30px;margin-top:5px;"><span>{{row.label}}</span>'+
				'</div></div>';
			var column=[{ field: 'workflowStep',visible:false},
			              { field: 'handleOpName', displayName:$translate.instant('workflow.approvalOperator'), sortable: false, width:'25%'},
			              { field: 'handleResult', displayName:$translate.instant('workflow.approvalResult'), cellTemplate:resultTmp, sortable: false, width:'15%'},
			              { field: 'handleReason', displayName:$translate.instant('workflow.approvalOpinion'), sortable: false, width:'35%',cellTemplate:titleTemplate},
			              { field: 'handleDate', displayName:$translate.instant('workflow.approvalTime'), sortable: false, width:'25%'}	]
			//创建表格
			var gridOptions = {
				data: 'myData',
				jqueryUITheme: false,
				jqueryUIDraggable: true,
			    showSelectionCheckbox: false,
			    multiSelect: false,
			    showGroupPanel: false,
			    showColumnMenu: false,
			    showFilter: false,
			    enableCellSelection: false,
			    enableCellEditOnFocus: false,
			    enablePaging: false,
			    showFooter: false,
			    groups:['workflowStep'],
			    groupsCollapsedByDefault:false,
			    aggregateTemplate:aggregateTemplate,
			    i18n: $translate.instant('load.static.lang'),
			    totalServerItems: 'totalServerItems',
			    filterOptions: false,
			    pagingOptions: false,
			    columnDefs:column
			};
			return gridOptions;
		}
	};
});