angular.module('app.vmServiceAsync',['ngResource','app.httpservice2'])
.factory('VmServiceAsync', function(HttpService2){
	return {	
		startDomain : function(data,callBack) {
			var url = 'domain/start';
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			HttpService2.put(url,vmdata,callBack);				
		},		
		pauseDomain : function(data,callBack) {
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			var url = 'domain/pause';
			HttpService2.put(url,vmdata,callBack);				
		},		
		restoreDomain : function(data,callBack) {
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			var url = 'domain/restore';
			HttpService2.put(url,vmdata,callBack);				
		},		
		sleepDomain : function(data,callBack) {
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			var url = 'domain/sleep';
			HttpService2.put(url,vmdata,callBack);				
		},		
		restartDomain : function(data,callBack) {
			var url = 'domain/restart';
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			HttpService2.put(url,vmdata,callBack);				
		},		
		closeDomain : function(data,callBack) {
			var url = 'domain/close';
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			HttpService2.put(url,vmdata,callBack);				
		},		
		shutDownDomain : function(data,callBack) {
			var url = 'domain/shutDown';
			var vmdata = {};
			vmdata.id = data.id;
			vmdata.title = data.name;
			vmdata.cloudId = data.publicCloudId;
			HttpService2.put(url,vmdata,callBack);				
		}	
	}
});