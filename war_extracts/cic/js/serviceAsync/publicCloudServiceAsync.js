angular.module('app.publicCloudServiceAsync',['ngResource','app.httpservice2'])
.factory('PublicCloudServiceAsync', function(HttpService2){
	return {
		queryPublicCloudList : function(offset,limit,callBack) {
			var url = 'publicCloud/list';
			var requestParams = "";
			if (offset != undefined && offset != null) {
			  	requestParams += 'offset=' + offset + '&';
			}
		   	if (limit != undefined && limit != null) {
			  	requestParams += 'limit=' + limit + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
//		queryPublicCloud : function(id,callBack) {
//			var url = 'publicCloud/'+ id;
//			HttpService2.get(url, callBack);				
//		},		
		queryPublicCloudDetail : function(id,callBack) {
			var url = 'publicCloud/'+ id +'/detail';
			HttpService2.get(url, callBack);				
		},		
		modifyDesignData : function(data,callBack) {
			var url = 'publicCloud/updateDesignData';
			HttpService2.put(url,data,callBack);				
		},		
		queryDestHostStorageList : function(publicCloudId,hostId,callBack) {
			var url = 'publicCloud/'+ publicCloudId +'/destHostStorages/'+ hostId;
			HttpService2.get(url, callBack);				
		},				
		getToolTips : function(publicCloudId,type,id,callBack) {
			var url = 'publicCloud/'+ publicCloudId +'/tooltips';
			var requestParams = "";
			if (type != undefined && type != null) {
			  	requestParams += 'type=' + type + '&';
			}
		   	if (id != undefined && id != null) {
			  	requestParams += 'id=' + id + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		}		
	}
});