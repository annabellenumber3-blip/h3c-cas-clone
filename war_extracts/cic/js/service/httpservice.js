angular.module('app.httpservice',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services'])
.factory('HttpService', function($http , $modal ,$state, $translate,UtilService){
	
	//=================================
	return {
	    //增加回调函数func，用于删除数据后刷新列表等后续操作
		post : function(uri, data, $modalInstance, cbObject, error) {
			  var waitModal = UtilService.wait();
			  if (!angular.isObject(data)) {
				  data = {};
			  }
			  $http.post(uri, data)
			          .success(function(result) {
			        	  waitModal.dismiss();
			        	  if (angular.isObject(cbObject) && cbObject.noHandle && result.state == '0') {
			        		  //if noHandle, do nothing.
			        	  } else {
			        		  UtilService.handleResult(result);
			        	  }			        	  
			        	  //confirm对话框没有$modalInstance对象
			        	  if (result.success == true && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
			        		  $modalInstance.close('success');
			        	  }
			        	  if (result.state == 2 && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
                              $modalInstance.close('partSuccess');
                          }
//			        	  if (result.state == 1 && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
//                              $modalInstance.close();
//                          }
			        	  //post数据成功返回后执行回调方法
			        	  if (result.state == '0' && angular.isDefined(cbObject)) {
			        		  if (angular.isFunction(cbObject.callback)) {
			        			  cbObject.callback.apply(this,[result]);
			        		  } else if (angular.isFunction(cbObject)) {
			        			  cbObject.apply(this,[result]);
			        		  }
			        	  }
			        	  if (result.state != '0' && angular.isDefined(error)) {
			        		  if (angular.isFunction(error.callback)) {
			        			  error.callback.apply(this,[result]);
			        		  } else if (angular.isFunction(error)) {
			        			  error.apply(this,[result]);
			        		  }
			        	  }
			        	  
			          }).error(function(response, code, headers, config) {
			        	  waitModal.dismiss();
			        	  UtilService.handleError(code);
			          });
		},
		put : function(uri, data, $modalInstance, cbObject, error) {
			 var waitModal = UtilService.wait();
			 if (!angular.isObject(data)) {
				  data = {};
			  }
			  $http.put(uri, data)
			          .success(function(result) {
			        	  waitModal.dismiss();
			        	  //confirm对话框没有$modalInstance对象
			        	  if (result.success == true && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.dismiss)) {
			        		  $modalInstance.close('success');
			        	  }
			        	  if (result.state == 2 && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
                              $modalInstance.close('partSuccess');
                          }
//			        	  if (result.state == 1 && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
//                              $modalInstance.close();
//                          }
			        	  if (result.success == true) {
			        		  //put数据成功返回后执行回调方法
			        		  if (angular.isDefined(cbObject)) {
			        			  if (angular.isFunction(cbObject.callback)) {
			        				  cbObject.callback.apply(this,[result]);
			        			  } else if (angular.isFunction(cbObject)) {
			        				  cbObject.apply(this,[result]);
			        			  }
			        		  }
			        	  }
			        	  
			        	  if (result.state != '0' && angular.isDefined(error)) {	//失败处理
			        		  if (angular.isFunction(error.callback)) {
			        			  error.callback.apply(this,[result]);
			        		  } else if (angular.isFunction(error)) {
			        			  error.apply(this,[result]);
			        		  }
			        	  }
			        	  
			        	  //set handle result message
			        	  if (result.state == '0') {	//成功处理
			        		  if (angular.isObject(cbObject) && cbObject.noHandle == true) {
				        		  //if noHandle, do nothing.
				        	  } else {
				        		  UtilService.handleResult(result);
				        	  }	
			        	  } else {			//部分成功处理，修改问题单201606060467 --ckf6302
			        		  if (angular.isObject(error) && error.noHandle == true) {
				        		  //if noHandle, do nothing.
				        	  } else {
				        		  if (angular.isFunction(cbObject)) {
				        			  cbObject.apply(this, [result]);
				        		  } 
				        		  UtilService.handleResult(result);
				        	  }	
			        	  }
			        	  
			          }).error(function(response, code, headers, config) {
			        	  waitModal.dismiss();
			        	  UtilService.handleError(code);
			          })
		},
		delete : function(uri, params, $modalInstance, cbObject) {
			 var waitModal = UtilService.wait();
	         $http({
	             method  : 'DELETE',
	             url     : uri,
	             params: params
	         }).success(function(result) {
			        	  waitModal.dismiss();
			        	  UtilService.handleResult(result);
			        	  //confirm对话框没有$modalInstance对象
			        	  if (result.success == true && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
			        		  $modalInstance.close('success');
			        	  }
			        	  if (result.state == 2 && angular.isDefined($modalInstance) && angular.isDefined($modalInstance.close)) {
                              $modalInstance.close('partSuccess');
                          }
			        	  //请求数据成功返回后执行回调方法
			        	  if (angular.isDefined(cbObject)) {
			        	      if (angular.isFunction(cbObject.callback)) {
                                  cbObject.callback.apply(this,[result]);
                              } else if (angular.isFunction(cbObject)) {
                                  cbObject.apply(this,[result]);
                              }
			        	  }
			          }).error(function(response, code, headers, config) {
			        	  waitModal.dismiss();
			        	  UtilService.handleError(code);
			          })
		}
	}
});