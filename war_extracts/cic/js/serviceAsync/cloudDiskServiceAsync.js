angular.module('app.cloudDiskServiceAsync',['ngResource','app.httpservice2'])
.factory('CloudDiskServiceAsync', function(HttpService2){
	return {
		queryCloudDiskList : function(offset,limit,sortDir,sortField,callBack) {
			var url = 'cloudDisk/list';
			var requestParams = "";
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
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		deleteCloudDisk : function(id, callBack) {
			var url = 'cloudDisk/'+ id;
			HttpService2.delete(url, callBack);				
		},
		batchDeleteCloudDisk : function(idList, callBack) {
            var url = 'cloudDisk/batchDelete';
            HttpService2.put(url, idList, callBack);             
	}
	}
});