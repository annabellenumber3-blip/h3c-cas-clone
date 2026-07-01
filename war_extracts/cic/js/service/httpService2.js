angular.module('app.httpservice2',['ngResource', 'app.services'])
.factory('HttpService2', function($http, UtilService){
	return {
		get : function(uri, callBack) {
			$http.get(uri)
	          .success(function(result) {
	        	  if (angular.isDefined(callBack) && angular.isFunction(callBack)) {
        			  callBack.apply(this,[result]);
	        	  } else if (angular.isDefined(callBack) && angular.isObject(callBack)) {
	        		  if (angular.isDefined(callBack.self)) {
	        			  callBack.callback.apply(callBack.self,[result]);
	        		  } else {
	        			  callBack.callback.apply(this,[result]);
	        		  }
	        	  }
	          }).error(function(response, code, headers, config) {
	        	  UtilService.handleError(code);
	          });
		},
		post : function(uri, data, callBack) {
			$http.post(uri, data)
	          .success(function(result) {
	        	  if (angular.isDefined(callBack) && angular.isFunction(callBack)) {
        			  callBack.apply(this,[result]);
	        	  } else if (angular.isDefined(callBack) && angular.isObject(callBack)) {
	        		  if (angular.isDefined(callBack.self)) {
	        			  callBack.callback.apply(callBack.self,[result]);
	        		  } else {
	        			  callBack.callback.apply(this,[result]);
	        		  }
	        	  }
	          }).error(function(response, code, headers, config) {
	        	  UtilService.handleError(code);
	          });
		},
		put : function(uri, data, callBack) {
			$http.put(uri, data)
	          .success(function(result) {
	        	  if (angular.isDefined(callBack) && angular.isFunction(callBack)) {
        			  callBack.apply(this,[result]);
	        	  } else if (angular.isDefined(callBack) && angular.isObject(callBack)) {
	        		  if (angular.isDefined(callBack.self)) {
	        			  callBack.callback.apply(callBack.self,[result]);
	        		  } else {
	        			  callBack.callback.apply(this,[result]);
	        		  }
	        	  }
	          }).error(function(response, code, headers, config) {
	        	  UtilService.handleError(code);
	          });
		},
		delete : function(uri, callBack) {
	         $http({
	             method  : 'DELETE',
	             url     : uri
	         }).success(function(result) {
	        	 if (angular.isDefined(callBack) && angular.isFunction(callBack)) {
       			  callBack.apply(this,[result]);
	        	  } else if (angular.isDefined(callBack) && angular.isObject(callBack)) {
	        		  if (angular.isDefined(callBack.self)) {
	        			  callBack.callback.apply(callBack.self,[result]);
	        		  } else {
	        			  callBack.callback.apply(this,[result]);
	        		  }
	        	  }
	          }).error(function(response, code, headers, config) {
	        	  UtilService.handleError(code);
	          });
		}
	}
});