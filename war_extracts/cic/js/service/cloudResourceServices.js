angular.module('app.cloudResourceService',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('CloudResourceService', function($translate,$modal, HttpService, GridService,UtilService){
	return {
	    /*增加云资源资源. type:1-ali 2-cvm, 3-vmware, 4=cic */
	    addCloudResource : function (){
	        var modalInstance = $modal.open({
	            templateUrl: 'html/modal/cloudResource/addCvm.html',
	            controller: 'addPublicCloudCtrl',
	            backdrop: 'static',
	            resolve:{
	            	     flag: function (){return null;},
	                     id: function (){return undefined;},
	                     type: function (){return "add";}
	            }
	        });
	        modalInstance.result.then(function (selectedItem) {
	        }, function (reason) {
	        });
	    },
	//增加网络策略模板
	 addNetStrategy : function() {
		 var modalInstance = $modal.open({
            templateUrl: 'html/modal/cloudResource/addNetworkStrategy.html',
            controller: 'networkStrategyCtrl',
            size:'lg',
            backdrop: 'static',
            resolve:{entry: function(){
           	 return undefined;
            }}
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
	 }
		
	};
});