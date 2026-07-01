angular.module('app.rainbowServiceAsync',['ngResource','app.httpservice2'])
.factory('RainbowServiceAsync', function(HttpService2){
	return {
		checkVmCanMigrate : function(srcCloudId,dstCloudId,domainId,destHostId,callBack) {
			var url = 'rainbow/srcCloud/'+ srcCloudId +'/dstCloud/'+ dstCloudId +'/canMigrate';
			var requestParams = "";
			if (domainId != undefined && domainId != null) {
			  	requestParams += 'domainId=' + domainId + '&';
			}
		   	if (destHostId != undefined && destHostId != null) {
			  	requestParams += 'destHostId=' + destHostId + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.post(url,null,callBack);				
		},		
		migrate : function(srcCloudId,dstCloudId,data,callBack) {
			var url = 'rainbow/srcCloud/'+ srcCloudId +'/dstCloud/'+ dstCloudId;
			HttpService2.post(url,data,callBack);				
		}		
	}
});