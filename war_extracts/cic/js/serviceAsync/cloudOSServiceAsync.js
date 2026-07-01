angular.module('app.cloudOSServiceAsync',['ngResource','app.httpservice2'])
.factory('CloudOSServiceAsync', function(HttpService2){
	return {
		operatorDomain : function(data,callBack) {
			var url = 'cloudOS/vm/operate';
			HttpService2.post(url,data,callBack);				
		},		
		queryVmlistByCondition : function(cloudId,offset,limit,sortDir,sortField,title,callBack) {
			var url = 'cloudOS/vmList';
			var requestParams = "";
			if (cloudId != undefined && cloudId != null) {
			  	requestParams += 'cloudId=' + cloudId + '&';
			}
		   	if (offset != undefined && offset != null) {
			  	requestParams += 'offset=' + offset + '&';
			}
		   	if (limit != undefined && limit != null) {
			  	requestParams += 'limit=' + limit + '&';
			}
		   	if (sortDir != undefined && sortDir != null) {
			  	requestParams += 'sortDir=' + sortDir + '&';
			}
		   	if (sortField != undefined && sortField != null) {
			  	requestParams += 'sortField=' + sortField + '&';
			}
		   	if (title != undefined && title != null) {
			  	requestParams += 'title=' + title + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		deployDomain : function(data,callBack) {
			var url = 'cloudOS/deploy';
			HttpService2.post(url,data,callBack);				
		},		
		queryFlavors : function(cloudId,cpuNum,memNum,diskNum,callBack) {
			var url = 'cloudOS/flavors';
			var requestParams = "";
			if (cloudId != undefined && cloudId != null) {
			  	requestParams += 'cloudId=' + cloudId + '&';
			}
		   	if (cpuNum != undefined && cpuNum != null) {
			  	requestParams += 'cpuNum=' + cpuNum + '&';
			}
		   	if (memNum != undefined && memNum != null) {
			  	requestParams += 'memNum=' + memNum + '&';
			}
		   	if (diskNum != undefined && diskNum != null) {
			  	requestParams += 'diskNum=' + diskNum + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		queryNetworks : function(cloudId,callBack) {
			var url = 'cloudOS/networks';
			var requestParams = "";
			if (cloudId != undefined && cloudId != null) {
			  	requestParams += 'cloudId=' + cloudId + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		queryAzones : function(cloudId,callBack) {
			var url = 'cloudOS/azones';
			var requestParams = "";
			if (cloudId != undefined && cloudId != null) {
			  	requestParams += 'cloudId=' + cloudId + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		}		
	}
});