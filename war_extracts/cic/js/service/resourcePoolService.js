angular.module('app.resourcePoolService',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('ResourcePoolService', function($translate,$modal,$rootScope, HttpService, GridService,UtilService){
	return {		
		/** 发布虚拟交换机 */
		releaseVswitch : function(resourcePoolId) {
			var modalInstance = $modal.open({
	  			  templateUrl: 'html/modal/resourcePool/releaseVswitch.html',
	  			  controller: 'resourcePoolReleaseVswitchCtrl',
	  			  backdrop:'static',
	  			  resolve: {resourcePoolId : function() {return resourcePoolId;}}
	  		});
	  		modalInstance.result.then(function (reason) {
	  		  if(reason){
                  var data = []
                  for(var i=0;i<reason.length;i++){
                      var da = {
                          rpId:resourcePoolId,
                          name:reason[i].name,
                          mode:reason[i].mode,
                          vswitchKey:reason[i].vswitchKey != undefined ? reason[i].vswitchKey : null,
                      }
                      data[i] = da;
                  }
                  var callBack = function() {
                      var msg = {id:resourcePoolId};
                      $rootScope.$broadcast(constant.onRefreshVswitch, msg);
                  }
                  var url = "resourcePool/addNet";
                  if (data.length > 0) {
                      HttpService.post(url, data, modalInstance, callBack, null);
                  }
              }
	        }, function (reason) {
	        });
		},
		/** 发布存储池 */
		addStorage : function(entity) {
		    var modalInstance = $modal.open({
	              templateUrl: 'html/modal/resourcePool/addStorage.html',
	              controller: 'addStorage',
	              backdrop:'static',
	              resolve: {params : function() {
	                  var resourcePool = {};
	                    resourcePool.type = entity.cloudType;
	                    resourcePool.rpId = entity.id;
	                    return resourcePool;}}
	        });
	        modalInstance.result.then(function(){
	            $rootScope.$broadcast(constant.onRefreshResourcePoolStorage, {id:entity.id});
	        })
		},
		
		selectCloudResource : function (param, callBack) {
			var modalInstance = $modal.open({
				templateUrl: 'html/modal/common/selectCloudResource.html',
				controller: 'SelectCloudResourceCtrl',
				width: $rootScope.isEn ? '1100px' : '800px',
				backdrop:'static',
				resolve: {}
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
		/** 增加资源池*/
		addResourcePool : function(){
	        var modalInstance=$modal.open({
	            templateUrl:"html/modal/resourcePool/addResourcePool.html",
	            controller:"addResourcePoolCtrl",
	            backdrop:"static",
	            width:'970px',
	            resolve:{}
	        });
	        modalInstance.result.then(function (selectedItem) {
	            $rootScope.$broadcast(constant.onRefreshOrgResourcePoolList, {});
	        }, function (reason) {
	        });
	    },
	    /** 修改资源池*/
	    modifyResourcePool : function(entity) {
	        var modalInstance=$modal.open({
	            templateUrl:"html/modal/resourcePool/modifyResourcePool.html",
	            controller:"modifyResourcePoolCtrl",
	            windowClass: 'editvm-dialog',
	            backdrop:"static",
	            width:'530px',
	            resolve:{resourcePool:function(){
	                var resourcePool = {};
	                resourcePool.cloudType = entity.cloudType;
	                resourcePool.rpId = entity.id;
	                return resourcePool;
	            }}
	        });
	        modalInstance.result.then(function(selectedItem){
	        },function(){
	            
	        });
	    },
	    /**删除资源池 */
	    deleteResourcePool : function(entity) {
	        var delUrl = "resourcePool/delete/" + entity.id;
	        var modalInstance = UtilService.confirm($translate.instant('resourcePool.delResourcePool',{value:entity.name}),$translate.instant('common.opertip'));
	        modalInstance.result.then(function () {
	            HttpService.delete(delUrl, null, modalInstance);
	        }, function () {
	        });
	    }
	};
});