angular.module('app.alarmServiceAsync',['ngResource','app.httpservice2'])
.factory('AlarmServiceAsync', function(HttpService2){
	return {
		queryCloudAlarmNum : function(callBack) {
			var url = 'alarm/clouds/num';
			HttpService2.get(url, callBack);				
		},		
		queryUnconfirmedNum : function(callBack) {
			var url = 'alarm/clouds/unconfirmedNum';
			HttpService2.get(url, callBack);				
		},		
		queryLevelNum : function(id,callBack) {
			var url = 'alarm/cloud/'+ id +'/levelNum';
			HttpService2.get(url, callBack);				
		},		
		queryCatecoryNum : function(id,callBack) {
			var url = 'alarm/cloud/'+ id +'/catecoryNum';
			HttpService2.get(url, callBack);				
		},		
		queryAlarmConfig : function(offset,limit,sortDir,sortField,callBack) {
			var url = 'alarm/configs';
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
		queryNoticeTemplateById : function(id,callBack) {
			var url = 'alarm/noticeTemplate/'+ id;
			HttpService2.get(url, callBack);				
		},		
		queryAlarmConfigById : function(id,callBack) {
			var url = 'alarm/config/'+ id;
			HttpService2.get(url, callBack);				
		},		
		addAlarmConfig : function(data,callBack) {
			var url = 'alarm/config';
			HttpService2.post(url,data,callBack);				
		},		
		queryAlarmRuleList : function(callBack) {
			var url = 'alarm/rules';
			HttpService2.get(url, callBack);				
		},		
		modifyAlarmConfig : function(data,callBack) {
			var url = 'alarm/config';
			HttpService2.put(url,data,callBack);				
		},		
		issueAlarmConfig : function(id,callBack) {
			var url = 'alarm/config/'+ id +'/issue';
			HttpService2.put(url,null,callBack);				
		},		
		testCloudNotice : function(cloudId,templateId,callBack) {
			var url = 'alarm/cloud/'+ cloudId +'/template/'+ templateId +'/test';
			HttpService2.put(url,null,callBack);				
		},		
		testNoticeConfig : function(id,callBack) {
			var url = 'alarm/config/'+ id +'/test';
			HttpService2.put(url,null,callBack);				
		},		
		checkAlarmConfig : function(data,callBack) {
			var url = 'alarm/config/check';
			HttpService2.put(url,data,callBack);				
		},		
		checkAlarmConfigById : function(id,callBack) {
			var url = 'alarm/config/'+ id +'/check';
			HttpService2.get(url, callBack);				
		},		
		queryAlarmClouds : function(flag,offset,limit,sortDir,sortField,callBack) {
			var url = 'alarm/clouds';
			var requestParams = "";
			if (flag != undefined && flag != null) {
			  	requestParams += 'flag=' + flag + '&';
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
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		queryAlarmHost : function(cloudId,exclusiveUniqueKeyList,offset,limit,sortDir,sortField,callBack) {
			var url = 'alarm/'+ cloudId +'/hosts';
			var requestParams = "";
			if (exclusiveUniqueKeyList != undefined && exclusiveUniqueKeyList != null) {
			  	requestParams += 'exclusiveUniqueKeyList=' + exclusiveUniqueKeyList + '&';
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
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		queryAlarmDomain : function(cloudId,title,exclusiveUniqueKeyList,offset,limit,sortDir,sortField,callBack) {
			var url = 'alarm/'+ cloudId +'/domains';
			var requestParams = "";
			if (title != undefined && title != null) {
			  	requestParams += 'title=' + title + '&';
			}
		   	if (exclusiveUniqueKeyList != undefined && exclusiveUniqueKeyList != null) {
			  	requestParams += 'exclusiveUniqueKeyList=' + exclusiveUniqueKeyList + '&';
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
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		deleteAlarmConfigById : function(id,callBack) {
			var url = 'alarm/config/'+ id;
			HttpService2.delete(url, callBack);				
		},		
		queryRealTimeAlarms : function(cloudId,offset,limit,sortDir,sortField,state,eventLevel,category,eventDesc,eventSrc,eventTime_from,eventTime_to,callBack) {
			var url = 'alarm/'+ cloudId +'/realTimeAlarms';
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
		   	if (state != undefined && state != null) {
			  	requestParams += 'state=' + state + '&';
			}
		   	if (eventLevel != undefined && eventLevel != null) {
			  	requestParams += 'eventLevel=' + eventLevel + '&';
			}
		   	if (category != undefined && category != null) {
			  	requestParams += 'category=' + category + '&';
			}
		   	if (eventDesc != undefined && eventDesc != null) {
			  	requestParams += 'eventDesc=' + eventDesc + '&';
			}
		   	if (eventSrc != undefined && eventSrc != null) {
			  	requestParams += 'eventSrc=' + eventSrc + '&';
			}
		   	if (eventTime_from != undefined && eventTime_from != null) {
			  	requestParams += 'eventTime_from=' + eventTime_from + '&';
			}
		   	if (eventTime_to != undefined && eventTime_to != null) {
			  	requestParams += 'eventTime_to=' + eventTime_to + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		queryNoticeTemplateList : function(offset,limit,sortDir,sortField,sendType,callBack) {
			var url = 'alarm/noticeTemplates';
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
		   	if (sendType != undefined && sendType != null) {
			  	requestParams += 'sendType=' + sendType + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		addNoticeTemplate : function(data,callBack) {
			var url = 'alarm/noticeTemplate';
			HttpService2.post(url,data,callBack);				
		},		
		modifyNoticeTemplate : function(data,callBack) {
			var url = 'alarm/noticeTemplate';
			HttpService2.put(url,data,callBack);				
		},		
		issueNoticeTemplate : function(id,callBack) {
			var url = 'alarm/noticeTemplate/'+ id +'/issue';
			HttpService2.put(url,null,callBack);				
		},		
		deleteNoticeTemplateById : function(id,callBack) {
			var url = 'alarm/noticeTemplate/'+ id;
			HttpService2.delete(url, callBack);				
		},		
		isNoticeTemplateNameExist : function(name,callBack) {
			var url = 'alarm/noticeTemplate/isNameExists';
			var requestParams = "";
			if (name != undefined && name != null) {
			  	requestParams += 'name=' + name + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		},		
		isNoticeTemplateUsed : function(id,sendType,callBack) {
			var url = 'alarm/noticeTemplate/isUsed';
			var requestParams = "";
			if (id != undefined && id != null) {
			  	requestParams += 'id=' + id + '&';
			}
		   	if (sendType != undefined && sendType != null) {
			  	requestParams += 'sendType=' + sendType + '&';
			}
		   	if (requestParams.length != 0) {
				url = url + "?" + requestParams.substr(0, requestParams.length - 1);
			}
			HttpService2.get(url, callBack);				
		}		
	}
});