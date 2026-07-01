angular.module('app.services',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.permissionservices'])
.factory('UtilService', function($rootScope, $http , $modal ,$state, $q, $translate, PermissionService){
	var deskey = "hph3c_z01500";
	var orgArray =  new Array("userstatus", "cpuRateOrg", "memRateOrg", "storeRateOrg", "vmRateOrg");
	var poolArray = new Array("cpuRate", "memRate", "storeRate", "computeTrend", "storeTrend", "risk");
	var allArray = new Array("healthChart", "healthFlow", "hoststatus", "top5hostcpu", "top5hostmem", "vmstatus", "top5vmcpu", "top5vmmem");
	
	var getIsoList  = function() {
		return $http({
		method: 'GET',
		url: 'getIsoList'
		});
	};
	
	var getHostList  = function() {
		return $http({
			method: 'GET',
			url: 'getHostList'
		});
	};
	var getData  = function(data,url) {
		return $http({
			method: 'GET',
			url: url,
			data: data
		});
	};
	var getTask = function(params) {
		return $http({
			method: 'GET',
			url: 'operationlog/queryOperationLogByCondition',
			params: params
		});
	};
	var openOKAlert = function(content,title,isConform,type, size, buttonParams){
		if (typeof size == 'undefined') {
			size = 'sm';
		}
		var modalInstance = $modal.open({
  			templateUrl: 'html/template/alert.html',
  			size: size,
  			type: 'alert',
  			controller: function($scope, $modalInstance,$timeout) {
  				$scope.ok = function () {
  					$modalInstance.close();
					$scope.pwdAutoFocus();
  				};
  				$scope.custom = {
  						content:content,
  						title:title,
  						isConform:isConform,
  						type:type,
  						buttonParams : buttonParams
  				};
  				$scope.cancel = function (data) {
  					if (angular.isDefined(data)) {
  						$modalInstance.dismiss(data);
  					} else {
  					$modalInstance.dismiss('cancel');
  					}
					$scope.pwdAutoFocus();
  				};
  				if(type=="error"){		//修改问题单	201605160421，在错误提示对话框内注册回车监听事件  by ckf6302
					$timeout(function(){
						$("#alertOkBtn")[0].focus();
					},50);
  					$scope.enter=function(event){
  						if(event.keyCode==13){
  							$scope.ok();
  							$scope.pwdAutoFocus();  							
  						}
  					};
  				}
  				$scope.pwdAutoFocus=function(){
  					if($("#loginform")[0]&&$("#pwd")[0]&&type=="error"){
						$("#pwd")[0].focus();
					}
  				};
  			},
  			backdrop:'static'
  		});
		return modalInstance;
	}
	//=================================
	return {
		isoquery: function() {
		   return getIsoList();
		},
		hostquery:function() {
		   return getHostList();
		},
		//获取云资源下的虚拟机
		vmqueryInDc:function(data) {
			return getData(data, 'dc/queryDcVirtualHostInfo');
		},
		//获取主机池下的虚拟机
		vmqueryInHostpool:function(data) {
			return getData(data, 'hostpool/queryVirtHostInfo');
		},
		//获取任务
		queryTask:function(params) {
			return getTask(params);
		},
		alert: function(content,title,isConform,type, size, buttonParams){
			/*请求后台成功框*/
			if(typeof content !== 'string'){
				console.warn("content参数为必填字符串,否则为空字符串")
				content = "";
			}
			
			if(typeof title !== 'string')
				title = $translate.instant('common.tip');
			
			if(typeof isConform === 'undefined')
				isConform = false;
			if(typeof type === 'undefined')
				type = "question";
			return openOKAlert(content,title,isConform,type, size, buttonParams);
		},
		error: function(content,title){
			/*请求后台报错框*/
			if(typeof title !== 'string')
				title=$translate.instant('common.errorTip');
			return this.alert(content,title,false,"error")
		},
		success:function(content,title){
			content = escapeHtml(content);
			/*请求后台成功框*/
			if(typeof title !== 'string')
				title=$translate.instant('common.successTip');
			/*return this.alert(content,title,false,"success");*/  //调用$modal.open()的原方法
			$.messager.lays(300, 180);
			$.messager.show(title, content, 5000);
			return;
		},
		confirm:function(content,title, size, buttonParams){
			/*操作确认框,ps:确认框为两个按钮（确认和取消）第三个参数为true buttonParams为自定义按钮数组参数*/
			return this.alert(content,title,true,"question", size, buttonParams)
		},
//		wait:function(type){
//			//type 可以传入sm mlg
//			var s = 'sm';
//			if (type) {
//				s =type
//			}
//			var modalInstance = $modal.open({
//		   	      templateUrl: 'html/modal/common/loading.html',
//		   	      size: 'sm',
//		   	      type: 'loading',
//				  backdrop:'static'
//		   	});
//			return modalInstance;
//		},
		modal:function(templateurl,c,resolve,width) {
			if (typeof resolve == 'undefined' || resolve == null) {
				resolve = {};
			}
			var modalInstance = $modal.open({
	  			  templateUrl: templateurl,
	  			  controller: c,
	  			  width:width,
	  			  backdrop:'static',
	  			  resolve: resolve
	  			  }
	  		);
			return modalInstance;
		},
		lgmodal:function(templateurl,c,resolve, size) {
			if (typeof resolve == 'undefined' || resolve == null) {
				resolve = {};
			}
			if (typeof size == 'undefined' || size == null) {
				size = 'lg';
			}
			var modalInstance = $modal.open({
				templateUrl: templateurl,
				controller: c,
				size: size,
				backdrop:'static',
				resolve: resolve
			}
			);
			return modalInstance;
		},
		mgmodal:function(templateurl,c,resolve) {
			if (typeof resolve == 'undefined' || resolve == null) {
				resolve = {};
			}
			var modalInstance = $modal.open({
				templateUrl: templateurl,
				controller: c,
				size:'mg',
				backdrop:'static',
				resolve: resolve
			}
			);
			return modalInstance;
		},
		smmodal:function(templateurl,c,resolve) {
			if (typeof resolve == 'undefined' || resolve == null) {
				resolve = {};
			}
			var modalInstance = $modal.open({
				templateUrl: templateurl,
				controller: c,
				size:'sm',
				type: 'alert',
				backdrop:'static',
				resolve: resolve
			}
			);
			return modalInstance;
		},
		handleResult:function(result) {
			//成功
			if (result.state == 0) {
				if (result.successMessage && result.successMessage != '') {
					this.success(result.successMessage);
				}
		    //失败
			} else if (result.state == 1) {
				if(result.errorCode===161) {
					this.error($translate.instant('licenseServer.connectLicenseError'));
				}else if (result.failureMessage && result.failureMessage != '') {
					this.error(result.failureMessage);
				}
				if (result.errorCode == constant.DOMAIN_NOT_EXIST_AND_DELETE) {
				    $rootScope.$broadcast(constant.onReloadVmwareVmList, {cloudId:result.data});
				}
				if (result.errorCode == 14) {
					// 操作员不在线，要求重新登录
					 $state.go('login');
					 return;
				}
		    //部分成功
			} else if (result.state == 2) {
				if (result.successMessage && result.successMessage != '') {
				    this.error(result.successMessage, $translate.instant('common.partSuccessTip'));
				}
				if (result.failureMessage && result.failureMessage != '') {
				    this.error(result.failureMessage, $translate.instant('common.partSuccessTip'));
				}
			}
		},
		handleError:function(errorcode) {
			if (errorcode == 500) {
				this.error($translate.instant('errorServerMsg'));
			} else if (errorcode == 0) {
				
			} else if (errorcode == 404) {
				this.error($translate.instant('errorConnMsgWithCode',{v:'404'}));
			} else if (errorcode == 403) {//无权限
				$state.go('login');
			} else if (errorcode == 401) {//未登录
				$state.go('login');
			} else {
				this.error($translate.instant('errorConnMsgWithCode',{v:errorcode}));
			}
		},
		checkIpMaskGateway : function(ip, mask, gateway) {
			var flag = true;
			if (gateway &&  mask && ip) {
				var ipArr = ip.split(".");
				var maskArr = mask.split(".");
				var gatewayArr = gateway.split(".");
				if (ipArr.length == 4 && maskArr.length == 4 && gatewayArr.length == 4) 
					var res0 = parseInt(ipArr[0]) & parseInt(maskArr[0]);
				var res1 = parseInt(ipArr[1]) & parseInt(maskArr[1]);
				var res2 = parseInt(ipArr[2]) & parseInt(maskArr[2]);
				var res3 = parseInt(ipArr[3]) & parseInt(maskArr[3]);
				
				var res0_gw = parseInt(gatewayArr[0]) & parseInt(maskArr[0]);
				var res1_gw = parseInt(gatewayArr[1]) & parseInt(maskArr[1]);
				var res2_gw = parseInt(gatewayArr[2]) & parseInt(maskArr[2]);
				var res3_gw = parseInt(gatewayArr[3]) & parseInt(maskArr[3]);
				
				if(res0==res0_gw && res1==res1_gw && res2==res2_gw  && res3==res3_gw)
				{
					flag = true;
				} else {
					flag = false;
				}
			}
			return flag;
		},
		checkHtml5 :function() {
			var Sys = {};
	        var ua = navigator.userAgent.toLowerCase();
	        window.ActiveXObject ? Sys.ie = (ua.match(/msie ([\d.]+)/) ? ua.match(/msie ([\d.]+)/)[1] : null) :
	        document.getBoxObjectFor ? Sys.firefox = (ua.match(/firefox\/([\d.]+)/) ? ua.match(/firefox\/([\d.]+)/)[1] : null) :
	        window.MessageEvent && !document.getBoxObjectFor ? Sys.chrome = (ua.match(/chrome\/([\d.]+)/) ? ua.match(/chrome\/([\d.]+)/)[1] : null) : 0;
	        //以下进行测试
	        var browserFlag = true;
            if(Sys.ie && (Sys.ie.startWith('7.') || Sys.ie.startWith('8.'))){
                browserFlag = false;
            }
            if(Sys.firefox && (Sys.firefox.startWith('4.') || Sys.firefox.startWith('5.'))) {
                browserFlag = false;
            }
            if(Sys.chrome && (Sys.chrome.startWith('4.') || Sys.chrome.startWith('5.') 
             || Sys.chrome.startWith('6.')  || Sys.chrome.startWith('7.') 
             || Sys.chrome.startWith('8.') || Sys.chrome.startWith('9.') 
             || Sys.chrome.startWith('10.') || Sys.chrome.startWith('11.') 
             || Sys.chrome.startWith('12.') || Sys.chrome.startWith('13.'))) {
                browserFlag = false;
            }
	    	
	    	var canvasFlag;
			try {
				document.createElement('canvas').getContext('2d');
				canvasFlag = true;
			} catch (e) {
				canvasFlag = false;
			}
			
			return window.WebSocket && browserFlag && canvasFlag;
		},
		openConsole: function(domain, ishtml5) {
			if (typeof ishtml5 != 'boolean') {
				return;
			}
			var self = this;
			var param = {
					id:domain.id,
					orgId:domain.orgId,
					cloudId:domain.cloudId,
					isHtml5:ishtml5
			}
			$http({
	             method  : 'GET',
	             url     : 'domain/vnc',
	             params:param
	         }).success(function(rpcresult) {
	        	 if (rpcresult.success == true) {
	        		 var result = rpcresult.data;
	        		 var cloudId = result.cloudId;
	        		 var id = result.id;
	        		 var title = result.title != null ? result.title : domain.title;
	        		 var domainName = result.domainName;
	        		 if (!title) {
	        			 title = domainName;
	        		 }
	        		 var userName = result.userName;
	        		 var password = result.password;
	        		 var casIp = result.casIp;
	        		 var casPort = result.casPort;
	        		 var uniqueKey = result.uniqueKey;
	        		 var protocol = result.protocol;
	        		 if (ishtml5) {
	        			 var status = result.status;
	        			 var noVncHost = result.noVncHost;
	        			 var noVNCPort = result.noVNCPort;
	        			 var token = result.token;
	        			 var localCursor = result.localCursor;
	        			 self.openNoVNCDialog(cloudId, id, uniqueKey, title, userName, password, casIp, casPort, protocol, noVncHost, noVNCPort, token, status, localCursor);
	        		 } else {
	        			 self.openVNCDialog(uniqueKey, title, userName, password, casIp, casPort, protocol);
	        		 }
	        	 }
	        	 self.handleResult(result);
	         }).error(function(response, code, headers, config) {
	        	 self.handleError(code);
	         });
		},
		openVNCDialog: function(domainId, title, userName, password, hostIp, hostPort, protocol) {
			var winName = new Date().getTime();
			var isEdge = false;
			var explorer =navigator.userAgent;
			if (!isEmpty(explorer) && explorer.indexOf("Edge") >= 0) {
				isEdge = true;
			}
			var javaEnabled = navigator.javaEnabled() && !isEdge;
			if (javaEnabled) {					
				window.open('about:blank',winName,'resizable=yes,scrollbars=yes,titlebar=no,toolbar=no,menubar=no, location=no, status=no');
			}
	    	
		    var $doc = document;
	    	var turnForm = $doc.createElement("form");  
	    	$doc.body.appendChild(turnForm);
	    	turnForm.name = "vnc";
	    	turnForm.method = "post";
	    	if (javaEnabled) {	    		
	    		turnForm.action = "vnc_applet.jsp";
	    		turnForm.target = winName;
	    	} else {
	    		turnForm.action = "vnc_jnlp.jsp";
	    		turnForm.target = "_self";
	    	}
	 	    var element = $doc.createElement("input");
	 	    element.setAttribute("name", "domainId");
	 	    element.setAttribute("type", "hidden");
	 	    element.setAttribute("value", domainId);
	 	    turnForm.appendChild(element);
	    
	    	if (title != null) {
	    		title = encodeURI(title);
	    	} else {
	      	title = encodeURI(domainName);
	    	}
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "title");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", title);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "userName");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", userName);
	    	turnForm.appendChild(element);
	    
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "password");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", password);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "protocol");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", protocol);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "hostIp");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", hostIp);
	    	turnForm.appendChild(element);
	    	if (hostPort != null) {
		    	element = $doc.createElement("input");
		    	element.setAttribute("name", "hostPort");
		    	element.setAttribute("type", "hidden");
		    	element.setAttribute("value", hostPort);
		    	turnForm.appendChild(element);
	    	}
	    	turnForm.submit();  
	    },
	    openNoVNCDialog :function(cloudId, domainId, uniqueKey, title, userName, password, hostIp, hostPort, protocol, proxyIp, proxyPort, token, status, localCursor) {
	    	var winName = new Date().getTime();
	    	var openobj = window;
            if(typeof(window.dialogArguments) == 'object')
            {
                  openobj = window.dialogArguments;
            }
            openobj.open('about:blank',winName,'width=900,height=700,resizable=yes,scrollbars=yes,titlebar=no,toolbar=no,menubar=no,location=no,status=no');
	    	
	        var $doc = document;
	    	var turnForm = $doc.createElement("form");  
	    	$doc.body.appendChild(turnForm);
	    	turnForm.name = "vnc";
	    	turnForm.method = "post";
	    	turnForm.action = "vnc/vnc.jsp";
	    	turnForm.target = winName;
	    	
	    	var element = $doc.createElement("input");
	    	element.setAttribute("name", "domainId");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", domainId);
	    	turnForm.appendChild(element);
	    	
	    	var element = $doc.createElement("input");
	    	element.setAttribute("name", "uniqueKey");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", uniqueKey);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "cloudId");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", cloudId);
	    	turnForm.appendChild(element);

	    	if (title != null) {
	    		title = encodeURI(title);
	    	} else {
	      	title = encodeURI(domainName);
	    	}
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "title");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", title);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "userName");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", userName);
	    	turnForm.appendChild(element);

	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "password");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", password);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "casIp");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", hostIp);
	    	turnForm.appendChild(element);
	    	
	        element = $doc.createElement("input");
	        element.setAttribute("name", "casPort");
	        element.setAttribute("type", "hidden");
	        element.setAttribute("value", hostPort);
	        turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	        element.setAttribute("name", "protocol");
	        element.setAttribute("type", "hidden");
	        element.setAttribute("value", protocol);
	        turnForm.appendChild(element);
	        
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "token");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", token);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "status");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", status);
	    	turnForm.appendChild(element);
	    	
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "host");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", proxyIp);
	    	turnForm.appendChild(element);
	    	
	    	if (proxyPort != null) {
	        	element = $doc.createElement("input");
	        	element.setAttribute("name", "port");
	        	element.setAttribute("type", "hidden");
	        	element.setAttribute("value", proxyPort);
	        	turnForm.appendChild(element);
	    	}
	    	
	    	element = $doc.createElement("input");
        	element.setAttribute("name", "localCursor");
        	element.setAttribute("type", "hidden");
        	element.setAttribute("value", localCursor);
        	turnForm.appendChild(element);
	    	
	    	turnForm.submit();  
	    },
	    rdp: function(ip) {
	    	var param = "height=105, width=200, toolbar=no,scollbars=no, resizable=no,location=no, status=no";
	    	window.open("rdp.jsp?ip=" + ip, "_blank", param);
	    },
	     //判断是否为windows操作系统
	    isWindows : function() {
	    	var ua = window.navigator.userAgent.toLowerCase();
	    	return (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1);
	    },
	    //判断是否为windows操作系统
	    isLinux : function() {
	    	var ua = window.navigator.userAgent.toLowerCase();
	    	return ua.indexOf("linux") != -1;
	    },
	    getContextName :function() {
	    	var pathName = document.location.pathname;
            var index = pathName.substr(1).indexOf("/");
            var result = pathName.substring(1,index+1);
            return result;
	    },
	    getContextPath :function() {
            return "/" + this.getContextName();
	    },
	    transformMHzToGHz: function(num){
	    	var numInGHz = num / 1000 ;
	    	var scaledNumInGHz = Math.round(numInGHz*Math.pow(10, 2))/Math.pow(10, 2);
	    	
	    	return scaledNumInGHz;
	    },
	    transformMBTOGB: function(num){
	    	var numInGB = num / 1024;
	    	var scaledNumInGB = Math.round(numInGB*10000)/10000;
	    	return scaledNumInGB;
	    },
	    transformGBTOMB: function(num){
	    	var numInMB = num * 1024;
	    	
	    	var scaledNumInMB = Math.round(numInMB);
	    	return scaledNumInMB;
	    },
	    getDiskUnit: function(minSize){
	    	if (minSize / 1024 < 1){
	    		return "MB";
	    	} else if(minSize / 1024 / 1024 < 1){
	    		return "GB";
	    	} else {
	    		return "TB";
	    	}
	    },
	    transformMBTOTB: function(num){
	    	var numInTB = num / 1024 / 1024;
	    	return numInTB;
	    },
	    transformTBTOMB: function(num){
	    	var numInMB = num * 1024 * 1024;
	    	var scaledNumInMB = Math.round(numInMB);
	    	return scaledNumInMB;
	    },
	    transformGBTOTB: function(num){
	    	var numInTB = num / 1024;
	    	return numInTB;
	    },
	    transformTBTOGB: function(num){
	    	var numInGB = num * 1024;
	    	var scaledNumInGB = Math.round(numInGB);
	    	return scaledNumInGB;
	    },
	    getNationRegion:function (){
	    	return [{value:'China', label:$translate.instant('nationRegion.China')},
	                {value:'Ukraine', label:$translate.instant('nationRegion.Ukraine')},
	                {value:'Uruguay', label:$translate.instant('nationRegion.Uruguay')},
	                {value:'Yemen', label:$translate.instant('nationRegion.Yemen')},
	                {value:'Israel', label:$translate.instant('nationRegion.Israel')},
	                {value:'Iraq', label:$translate.instant('nationRegion.Iraq')},
	                {value:'Russia', label:$translate.instant('nationRegion.Russia')},
	                {value:'Bulgaria', label:$translate.instant('nationRegion.Bulgaria')},
	                {value:'Croatia', label:$translate.instant('nationRegion.Croatia')},
	                {value:'Iceland', label:$translate.instant('nationRegion.Iceland')},
	                {value:'Libya', label:$translate.instant('nationRegion.Libya')},
	                {value:'Canada', label:$translate.instant('nationRegion.Canada')},
	                {value:'Hungary', label:$translate.instant('nationRegion.Hungary')},
	                {value:'SouthAfrica', label:$translate.instant('nationRegion.SouthAfrica')},
	                {value:'Qatar', label:$translate.instant('nationRegion.Qatar')},
	                {value:'Luxembourg', label:$translate.instant('nationRegion.Luxembourg')},
	                {value:'India', label:$translate.instant('nationRegion.India')},
	                {value:'Indonesia', label:$translate.instant('nationRegion.Indonesia')},
	                {value:'Guatemala', label:$translate.instant('nationRegion.Guatemala')},
	                {value:'Ecuador', label:$translate.instant('nationRegion.Ecuador')},
	                {value:'Syria', label:$translate.instant('nationRegion.Syria')},
	                {value:'Taiwan', label:$translate.instant('nationRegion.Taiwan')},
	                {value:'Colombia', label:$translate.instant('nationRegion.Colombia')},
	                {value:'CostaRica', label:$translate.instant('nationRegion.CostaRica')},
	                {value:'Turkey', label:$translate.instant('nationRegion.Turkey')},
	                {value:'Egypt', label:$translate.instant('nationRegion.Egypt')},
	                {value:'Serbia', label:$translate.instant('nationRegion.Serbia')},
	                {value:'SerbiaAndMontenegro', label:$translate.instant('nationRegion.SerbiaAndMontenegro')},
	                {value:'Cyprus', label:$translate.instant('nationRegion.Cyprus')},
	                {value:'Mexico', label:$translate.instant('nationRegion.Mexico')},
	                {value:'DominicanRepublic', label:$translate.instant('nationRegion.DominicanRepublic')},
	                {value:'Austria', label:$translate.instant('nationRegion.Austria')},
	                {value:'Venezuela', label:$translate.instant('nationRegion.Venezuela')},
	                {value:'Nigaragua', label:$translate.instant('nationRegion.Nigaragua')},
	                {value:'Paraguay', label:$translate.instant('nationRegion.Paraguay')},
	                {value:'Panama', label:$translate.instant('nationRegion.Panama')},
	                {value:'Bahrain', label:$translate.instant('nationRegion.Bahrain')},
	                {value:'Brazil', label:$translate.instant('nationRegion.Brazil')},
	                {value:'Greece', label:$translate.instant('nationRegion.Greece')},
	                {value:'German', label:$translate.instant('nationRegion.German')},
	                {value:'Italy', label:$translate.instant('nationRegion.Italy')},
	                {value:'Latvia', label:$translate.instant('nationRegion.Latvia')},
	                {value:'Norway', label:$translate.instant('nationRegion.Norway')},
	                {value:'CzechRepublic', label:$translate.instant('nationRegion.CzechRepublic')},
	                {value:'Morocco', label:$translate.instant('nationRegion.Morocco')},
	                {value:'Slovakia', label:$translate.instant('nationRegion.Slovakia')},
	                {value:'Slovenia', label:$translate.instant('nationRegion.Slovenia')},
	                {value:'Singapore', label:$translate.instant('nationRegion.Singapore')},
	                {value:'NewZealand', label:$translate.instant('nationRegion.NewZealand')},
	                {value:'Japan', label:$translate.instant('nationRegion.Japan')},
	                {value:'Chile', label:$translate.instant('nationRegion.Chile')},
	                {value:'Belgium', label:$translate.instant('nationRegion.Belgium')},
	                {value:'SaudiArabia', label:$translate.instant('nationRegion.SaudiArabia')},
	                {value:'France', label:$translate.instant('nationRegion.France')},
	                {value:'Poland', label:$translate.instant('nationRegion.Poland')},
	                {value:'PuertoRico', label:$translate.instant('nationRegion.PuertoRico')},
	                {value:'BosniaAndMontenegro', label:$translate.instant('nationRegion.BosniaAndMontenegro')},
	                {value:'Thailand', label:$translate.instant('nationRegion.Thailand')},
	                {value:'Honduras', label:$translate.instant('nationRegion.Honduras')},
	                {value:'Australia', label:$translate.instant('nationRegion.Australia')},
	                {value:'Ireland', label:$translate.instant('nationRegion.Ireland')},
	                {value:'Estonia', label:$translate.instant('nationRegion.Estonia')},
	                {value:'Bolivia', label:$translate.instant('nationRegion.Bolivia')},
	                {value:'Sweden', label:$translate.instant('nationRegion.Sweden')},
	                {value:'Switzerland', label:$translate.instant('nationRegion.Switzerland')},
	                {value:'Byelorussia', label:$translate.instant('nationRegion.Byelorussia')},
	                {value:'Kuwait', label:$translate.instant('nationRegion.Kuwait')},
	                {value:'Peru', label:$translate.instant('nationRegion.Peru')},
	                {value:'Tunisia', label:$translate.instant('nationRegion.Tunisia')},
	                {value:'Lithuania', label:$translate.instant('nationRegion.Lithuania')},
	                {value:'Jordan', label:$translate.instant('nationRegion.Jordan')},
	                {value:'Roumania', label:$translate.instant('nationRegion.Roumania')},
	                {value:'America', label:$translate.instant('nationRegion.America')},
	                {value:'Finland', label:$translate.instant('nationRegion.Finland')},
	                {value:'Sudan', label:$translate.instant('nationRegion.Sudan')},
	                {value:'England', label:$translate.instant('nationRegion.England')},
	                {value:'Netherlands', label:$translate.instant('nationRegion.Netherlands')},
	                {value:'Philippines', label:$translate.instant('nationRegion.Philippines')},
	                {value:'Salvador', label:$translate.instant('nationRegion.Salvador')},
	                {value:'Portugal', label:$translate.instant('nationRegion.Portugal')},
	                {value:'Spain', label:$translate.instant('nationRegion.Spain')},
	                {value:'Vietnam', label:$translate.instant('nationRegion.Vietnam')},
	                {value:'Algeria', label:$translate.instant('nationRegion.Algeria')},
	                {value:'Albania', label:$translate.instant('nationRegion.Albania')},
	                {value:'UnitedArabEmirates', label:$translate.instant('nationRegion.UnitedArabEmirates')},
	                {value:'Oman', label:$translate.instant('nationRegion.Oman')},
	                {value:'Argentina', label:$translate.instant('nationRegion.Argentina')},
	                {value:'Hongkong', label:$translate.instant('nationRegion.Hongkong')},
	                {value:'Macedonia', label:$translate.instant('nationRegion.Macedonia')},
	                {value:'Malaysia', label:$translate.instant('nationRegion.Malaysia')},
	                {value:'Malta', label:$translate.instant('nationRegion.Malta')},
	                {value:'Lebanon', label:$translate.instant('nationRegion.Lebanon')},
	                {value:'Montenegro', label:$translate.instant('nationRegion.Montenegro')}	            
	                ];
	    },
	    ipToLong: function(strIP) {
	    		ip = [];
	    		var position1 = strIP.indexOf(".");
	    		var position2 = strIP.indexOf(".", position1 + 1);
	    		var position3 = strIP.indexOf(".", position2 + 1);
	    		ip[0] = parseInt(strIP.substring(0, position1));
	    		ip[1] = parseInt(strIP.substring(position1 + 1, position2));
	    		ip[2] = parseInt(strIP.substring(position2 + 1, position3));
	    		ip[3] = parseInt(strIP.substring(position3 + 1));
	    		return Number(Number(ip[0]) * Number(Math.pow(2, 24))) + (ip[1] << 16) + (ip[2] << 8) + ip[3];
	    },
	    
	    ipLongToStr: function(ipaddress) {  
	        var str = "";
	        str += ipaddress >>> 24;
	        str += ".";
	        str += (ipaddress & 0x00FFFFFF) >>> 16;
	        str += ".";
	        str += (ipaddress & 0x0000FFFF) >>> 8;
	        str += ".";
	        str += (ipaddress & 0x000000FF);
	        return str;
	    },
	    
	    validateIpAddress: function(ipAddress, ipMask){
	    	var regex0 = /^0+$/;
	    	var regex1 = /^1+$/;
	        if (ipAddress == null || "0.0.0.0" == ipAddress || "255.255.255.255" == ipAddress) {
	            return false;
	        }
	        var ipAddreOfLong = this.ipToLong(ipAddress);
	        var ip = ipAddreOfLong.toString(2);
	        var maskOfLong = this.ipToLong(ipMask);
	        var mask = maskOfLong.toString(2);
	        //补全前面的0
	        var ipLength = ip.length;
	        var maskLength = mask.length;
	        if (ipLength != 32) {
	            for (var i = 0 ; i < 32 - ipLength; i++) {
	                ip = "0" + ip;
	            }
	        }
	        if (maskLength != 32) {
	            for (var i = 0 ; i < 32 - maskLength; i++) {
	                mask = "0" + mask;
	            }
	        }
	        var index = mask.indexOf("0");
	        if (index > 0 ) {
	            //主机地址不全为0或1
	            var hostIp = ip.substring(index);
	            //网络地址不全为0或1
	            var netIp = ip.substring(0, index);
	            var hostMatch = regex0.test(hostIp) || regex1.test(netIp);
	            var netMatch = regex0.test(hostIp) || regex1.test(netIp);
	            return !hostMatch && !netMatch;
	        } else if (mask.indexOf("0") == 0){
	            //排除全0子网掩码
	            return false;
	        }
	        return true;
	    },
	    
	    inSameSubnet: function(addrMask, addrBegin, addrEnd){
	            var ipM = this.ipToLong(addrMask);
	            var ipB = this.ipToLong(addrBegin);
	            var ipE = this.ipToLong(addrEnd);
	            
	            return ((ipM & ipB) == (ipM & ipE));
	    },
	    /**
	     * 检测两个IP地址网段是否相同
	     */
	    isSameNetworkSegment:function(ipAddr, mask,otherIpAddr,otherMask) {
	        var ipLong = 0;
	        var maskLong = 0;
	        var otherIpLong = 0;
	        var otherMaskLong = 0;
	        if (ipAddr && mask) {
	            ipLong = this.ipToLong(ipAddr);
	            maskLong = this.ipToLong(mask);
	        }
	        if (otherIpAddr  && otherMask) {
	            otherIpLong = this.ipToLong(otherIpAddr);
	            otherMaskLong = this.ipToLong(otherMask); 
	        }
	        if ((ipLong & maskLong) == (otherIpLong & otherMaskLong)) {
	            return true;
	        }
	        return false;
	    },
	    /**
		 * 局域模块加载等待的方法
		 * @param areadivId 局域加载局域的id
		 * 		  insertCtrlFlag 页面内嵌入ng-controller的标识（限于对话框）
		 * @returns divId
		 * @desc 设置insertCtrlFlag为true可解决局域等待条覆盖不全的问题（打开弹窗时
		 * 		 需要显示设置width和height），如增加操作员对话框
		 */
		areawait:function(divId,insertCtrlFlag){
			if(angular.isUndefined(divId)){
				return ;
			}
			try {
				var $ele = $("#"+divId);
				var shadeWidth=$ele[0].offsetWidth;
				var shadeHeight=$ele[0].offsetHeight;
//				var shadeTop=$("#"+divId).position().top;
//				var shadeLeft=$("#"+divId).position().left;
				var shadeTop=0,shadeLeft=0;
				if($ele.parents(".modal")[0]){	//解决在非弹出窗口内的页面上产生滚动条问题
					var $topModal=$ele.parents(".modal-content");
					shadeWidth=$topModal[0].offsetWidth;
					shadeHeight=$topModal[0].offsetHeight-42; //整个弹窗的高-标题栏的高
					shadeTop=$topModal.position().top+42;
					shadeLeft=$topModal.position().left;
					//解决页面内嵌入ng-controller时局域等待条覆盖不全的问题
					if(insertCtrlFlag){
						var $backDiv = $ele.closest("[role='dialog']");
						if($backDiv.attr("width")){
							shadeWidth = Number($backDiv.attr("width").split("px")[0]);
						}
						if($backDiv.attr("height")){
							shadeHeight = Number($backDiv.attr("height").split("px")[0]) - 42;
						}
					}
				}else{
					shadeTop=$ele.offset().top;
					shadeLeft=$ele.offset().left;
				}
				var areawaitId=divId+"areawait",areawaitTop=Math.round(shadeHeight/2-174/2);
				var loadingText = $translate.instant('loading');
				var areawaitDiv='<div id="'+areawaitId+'" class="areawaitBgcolor" style="width:'+shadeWidth+'px;height:'+shadeHeight+'px"><div class="modal-body" style="top:'+areawaitTop+'px;"><div style="font-size:12px" class="load-container load6">'
				+'<div style="font-size:12px" class="loader">'+loadingText+'<div class="content">'+loadingText+'</div></div></div></div><div>';
				if(!document.getElementById(areawaitId)){
					if($ele.parents(".modal")[0]){
						$ele.parents(".modal-content").append(areawaitDiv);
					}else{
						$("#main").append(areawaitDiv);
//						$ele.parent().prepend(areawaitDiv);
					}
				}
				if($("#slidebar").width()>shadeLeft&&!$ele.parents(".modal")[0]){
					shadeLeft=$("#slidebar").width();
				}
				$("#"+areawaitId).css({"top": (shadeTop) + "px","left": (shadeLeft) +"px","position":"absolute"}).show();
				return areawaitId;
			} catch(err) {
				console.error(err);
			}
			
		},
		dismissAreawait : function(areaDivId) {
		    //修改问题单:201706080624  遮罩层还在时切换页面,要等数据加载完才关闭.
		    if ($('#'+areaDivId)) {
			$('#'+areaDivId).remove();
		    }
		},		
		changeSkin : function(color) {
			if (color == 'blue') {
	    		$("#changeCss").attr("href","css/blueTheme.css");
	    	} else if (color == 'black') {
	    		$("#changeCss").attr("href","css/blackTheme.css");
	    	} else if (color == 'green') {
	    		$("#changeCss").attr("href","css/greenTheme.css");
	    	} else if (color == 'red') {
	    		$("#changeCss").attr("href","css/redTheme.css");
	    	} else if (color == 'purple') {
	    		$("#changeCss").attr("href","css/purpleTheme.css");
	    	} else if (color == 'azure') {
	    		$("#changeCss").attr("href","css/azureTheme.css");
	    	} else if (color == 'casic') {
	    		$("#changeCss").attr("href","css/casicTheme.css");
	    	} 
		},
		isExistCheck:function(url,params) {
			if (typeof(params) == undefined) {
				return true;
			}
			var isExist = true;
			$.ajax({ 
				url: url, 
				async:false,
				data:params,
				dataType:"text",
				success: function(result){
					if (result.success) {
                        //增加result.data来支持返回结果形式为RpcResult<Boolean>的情况 f10574
                        if (!result.data) {
                        	isExist = true;
                        } else {
                        	isExist = false;
                        }
                    } else if (result == true) {
                    	isExist =  false;
                    } else if (result == "true") {
                    	isExist =  true;
                    } else {
                    	isExist =  false;
                    }
				}
			});
			return isExist;
		},
		// 获取产品名称  casname: l10n key值
		getSystemName : function(casname) {
			if (angular.isDefined($rootScope.uiConfig.casSysName)) {
				  return $rootScope.uiConfig.casSysName;
			} else {
				  if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
					  return $translate.instant('casname2_unis');
				  } else if ($rootScope.uiConfig.copyrightFrom == constant.casicunis) {
					  return $translate.instant('casname2_icunis');
				  } else {
					  if (casname) {
						  return $translate.instant(casname);
					  } else {
						  return $translate.instant('casname2');
					  }
				  }
			}
		},
		// 获取copyright信息
		getCopyright : function() {
			if (angular.isDefined($rootScope.uiConfig.copyrightInfo)) {
				  return $rootScope.uiConfig.copyrightInfo;
			} else {
				var year = (new Date()).getFullYear();
				  if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
						return $translate.instant('copyright_unis', { year: year });
				  } else if ($rootScope.uiConfig.copyrightFrom == constant.unicloud) {
						return $translate.instant('copyright_unicloud', { year: year });
					} else if ($rootScope.uiConfig.copyrightFrom == constant.casic) {
						return $translate.instant('copyright_spaceflight', { year: year });					
				  } else if ($rootScope.uiConfig.copyrightFrom == constant.casicunis) {
						return $translate.instant('copyright_icunis', { year: year });					
				  } else {
						return $translate.instant('copyright', { year: year });
				  }
				  
			 }
		},
		//获取copyright  logo路径
		getCopyrightLogo : function() {
			if (angular.isDefined($rootScope.uiConfig.copyrightLogo)) {
				  return $rootScope.uiConfig.copyrightLogo;
			} else {
				  if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
					  return "css/img/loginCopyrightLogo.svg";
				  }else if ($rootScope.uiConfig.copyrightFrom == constant.unicloud) {
						return "css/img/loginCopyrightLogo_unicloud.png";
					} else if ($rootScope.uiConfig.copyrightFrom == constant.casic) {
					  return "images/spaceflight.png";					
				  } else if ($rootScope.uiConfig.copyrightFrom == constant.casicunis) {
					  return "images/logo_htyw.bmp";					
				  }  else {
					  return "images/h3c.png";
				  }
			}
		},
		encryptByDES : function(message) {
			if (typeof message == 'undefined' || message == null) {
				return message;
			}
			// For the key, when you pass a string,  
		    // it's treated as a passphrase and used to derive an actual key and IV.  
		    // Or you can pass a WordArray that represents the actual key.  
		    // If you pass the actual key, you must also pass the actual IV.  
		    var keyHex = CryptoJS.enc.Utf8.parse(deskey);  
		    //console.log(CryptoJS.enc.Utf8.stringify(keyHex), CryptoJS.enc.Hex.stringify(keyHex));  
		    //console.log(CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Hex)));  
		   
		    // CryptoJS use CBC as the default mode, and Pkcs7 as the default padding scheme  
		    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {  
		        mode: CryptoJS.mode.ECB,  
		        padding: CryptoJS.pad.Pkcs7  
		    });  
		    // decrypt encrypt result  
		    // var decrypted = CryptoJS.DES.decrypt(encrypted, keyHex, {  
		    //     mode: CryptoJS.mode.ECB,  
		    //     padding: CryptoJS.pad.Pkcs7  
		    // });  
		    // console.log(decrypted.toString(CryptoJS.enc.Utf8));  
		   
		    // when mode is CryptoJS.mode.CBC (default mode), you must set iv param  
		    // var iv = 'inputvec';  
		    // var ivHex = CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(iv).toString(CryptoJS.enc.Hex));  
		    // var encrypted = CryptoJS.DES.encrypt(message, keyHex, { iv: ivHex, mode: CryptoJS.mode.CBC });  
		    // var decrypted = CryptoJS.DES.decrypt(encrypted, keyHex, { iv: ivHex, mode: CryptoJS.mode.CBC });  
		   
		    // console.log('encrypted.toString()  -> base64(ciphertext)  :', encrypted.toString());  
		    // console.log('base64(ciphertext)    <- encrypted.toString():', encrypted.ciphertext.toString(CryptoJS.enc.Base64));  
		    // console.log('ciphertext.toString() -> ciphertext hex      :', encrypted.ciphertext.toString());  
		    return encrypted.toString();  
		},
		decryptByDES : function(ciphertext) {
			if (typeof ciphertext == 'undefined' || ciphertext == null) {
				return ciphertext;
			}
			var keyHex = CryptoJS.enc.Utf8.parse(deskey);  
			   
		    // direct decrypt ciphertext  
		    var decrypted = CryptoJS.DES.decrypt({  
		        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)  
		    }, keyHex, {  
		        mode: CryptoJS.mode.ECB,  
		        padding: CryptoJS.pad.Pkcs7  
		    });  
		   
		    return decrypted.toString(CryptoJS.enc.Utf8);  
		},
		logout : function(data) {
			var self = this;
			var importData = {};
			if(data){
				importData.isAutoLogout = data;
			}
			$http({
                method: 'post',
                url: 'login/doLogout',
                params: importData
            }).success(function(result) {
				self.cancelSessionTimer();
			})
			.error(function(response, code, headers, config) {
				$window.location.href = '';
			});
		},
		getSys : function() {
			 var Sys = {};
			 var ua = navigator.userAgent.toLowerCase();
			 var s;
			 (s = ua.match(/(msie\s|trident.*rv:)([\w.]+)/)) ? Sys.ie = s[2] || "0" :
			 (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
			 (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
			 (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
			 (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			 return Sys;
		},
		/**
		 * 创建USBkey的登录插件
		 * @param id 插件的页面元素ID
		 * @returns 
		 */
		createUsbTool : function(id) {
			 var Sys = this.getSys();
			 var ukeyCT = document.getElementById(id);
			 ukeyCT.innerHTML = "";
			
			 if (Sys.ie) {
				ukeyCT.innerHTML = '<OBJECT id="dmwz" CLASSID="CLSID:BCC20D3B-2067-47C1-8631-603FE0C8CED0" height=0 width=0></OBJECT>';
			 } else {
				ukeyCT.innerHTML = '<OBJECT id="dmwz" type="application/mozilla-dmwz-hs-plugin" width=0 height=0 />';
			 }
		},
		/**
		 * 查询连接的设备
		 * @param id 插件的页面元素ID
		 * @returns devPath
		 */
		enumDev : function() {
			var self = this;
			var devPath;
			try {                                                                                 
				  devPath = dmwz.EnumDev();
			} catch(err) {
				  self.error($translate.instant("usbkey.enumdevError"));
				  console.error(err.message);  
			}
			return devPath;
		},
		/**
		 * 获取设备序列号
		 * @param id 插件的页面元素ID
		 * @returns 
		 */
		getsn : function(devpath) {
			var self = this;
			var sn;
			try {                                                                                 
				var keysn = dmwz.GetSN(devpath);
				var myDevSN = keysn.split("|");
				if (myDevSN.length  > 0) {
					sn = myDevSN[0];
				}
			} catch(err) {
				self.error($translate.instant("usbkey.getsnError"));
				console.error(err.message);                                                                            
			}
			return sn;
		},
		/**
		 * 通过序列号获取证书DN
		 * @param sn 设备序列号
		 * isSign  默认为true   true:获取签名证书DN   false：获取加密证书DN
		 * @returns 
		 */
		getCertDn : function(sn, isSign) {
			var self = this;
			var certDn;
			var rv;
			if (isSign == "true") {
				isSign = true;
			} else if (isSign == "false") {
				isSign = false;
			}
			if (typeof isSign !== 'boolean') {
				isSign = true;
			}
			try {                                                                                 
				rv = dmwz.GetAllCertDN(sn, isSign);
			} catch(err) {
				console.error(err.message);                                                                            
			}
			var errNum =  dmwz.ErrorNum();
			if (errNum != 0){
				self.error("usbkey.certDnFail");
				return;
			}
			var myCertDN = rv.split("||");
		    if (myCertDN.length > 0) {
		    	certDn = myCertDN[0];
		    }
		    return certDn;
		},
		/**
		 * 签名函数
		 * @param certDn 证书
		 * @param plainText 插件的页面元素ID
		 * @param hashType 加密方式 (MD5 SHA1 SHA256 SHA384 SHA512 SM3) 第一demo的   （SGD_SHA1 SGD_SHA256 SGD_SM3)第二个demo
 		 * @returns 
		 */
		sign : function(certDn, plainText, hashType, pin) {
			var self = this;
			if (isEmpty(certDn)) {
				this.error($translate.instant("usbkey.certDnNotnull"));
				return;
			}
			if (isEmpty(plainText)) {
				plainText = "admin";
			}
			if (isEmpty(hashType)) {
				hashType = "SGD_SHA1";
			}
			try {                                                                                 
				rv = dmwz.Sign(plainText,certDn,hashType, pin);
			 } catch(err) {
				console.error(err.message);                                                                                
		     }
			 var SignResult = rv.split("||");
			 var signedText = SignResult[0];
			 var certText = SignResult[1];
			 var errNum =  dmwz.ErrorNum();
			 if (errNum == 0) { //0 代表成功，其他代表失败
				 self.loginPost(signedText, certText);
			 } else {
				 var errorcode = errNum.toString(10);
				 self.handleSignError(errorcode, hashType);
			 }
		},
		handleSignError: function(errorcode, hashType) {
			console.error("errorcode(sign)-" + errorcode);
			var self = this;
			if (errorcode == constant.CERT_HASH_ERROR) { //hashType 不支持
				 if (hashType == constant.SGD_SM3) {
					 self.error($translate.instant("usbkey.signFail") + $translate.instant("usbkey.signFailReason1")); 
				 } else {
					 self.error($translate.instant("usbkey.signFail") + $translate.instant("usbkey.signFailReason2")); 
				 }
			 } else if (errorcode == constant.PIN_ERROR || errorcode == constant.PIN_ERROR1){
				 self.error($translate.instant("usbkey.signFail") + $translate.instant("usbkey.pinError"));
			 } else if (errorcode == constant.USBKEY_LOCK_ERROR){
				 self.error($translate.instant("usbkey.signFail") + $translate.instant("usbkey.usbkeyLockError"));
			 } else {
				 self.error($translate.instant("usbkey.signFail"));     
			 }
		},
		loginPost: function(signTextp, certTextp, isForce) {
			 var self = this;
			 var signText = self.encryptByDES(signTextp);
			 var certText = self.encryptByDES(certTextp);
			 var params = {cert:certText,signText:signText};
			 if (isForce) {
				 params.isForce = isForce;
			 }
			 $http({
	             method  : 'POST',
	             url     : 'spring_check',
	             params  : params
	         }).success(function(result) {
	                 if (result.online) {
	                	 PermissionService.setPermissions(result.permissions);
	                	 $rootScope.loginInfo = {};
	                     $rootScope.loginInfo.userName = result.userName;
	                     $rootScope.loginInfo.loginName = result.loginName;
	                     $rootScope.loginInfo.loginIp = result.loginIp;
	                     $rootScope.loginInfo.loginTime = result.loginTime;
	                     $rootScope.loginInfo.operatorGroupMode = result.operatorGroupMode;
	                	 if (angular.isDefined(localStorage)) {
	                		 delete result.pwd;
	                		 localStorage.setItem("loginInfo", JSON.stringify(result));
	                	 }
	                	 $http({
	             	        method  : 'GET',
	             	        url     : 'ui/getParam/operSkin',
	             	        params  : {}
	             	     }).success(function(result) {
	             	    	if (result.data) {
	             	    		self.changeSkin(result.data.param);
	             	    	}
	             	    	self.loginToPage();
	             	     }).error(function(response, code, headers, config) {
	             	    	self.loginToPage();
	             		 });
	                 } else if (result.loginFailErrorCode == constant.CURR_OPER_ONLINE_NUM_MORE_THAN_MAX_NUM){
	                	 var modalInstance = self.confirm($translate.instant('currOperOnlineMax'),$translate.instant('operConfirm'));
    					 modalInstance.result.then(function (selectedItem) {
    						 self.loginPost(signTextp, certTextp, true);
    					 }, function () {
    					 });
	                 } else {
	                	 self.error(result.loginFailMessage);
	                 }
	         }).error(function(response, code, headers, config) {
//	        	 loginmodal.dismiss('cancel');
	        	 self.handleError(code);
	         });
		},
		//根据权限决定登录时跳转到哪个页面
		loginToPage : function() {
			 if (PermissionService.hasPermission('DASHBOARD_MGR')) { //概览
				 $state.go('main.overview');
			 } else if (PermissionService.hasPermission('CLOUD_RESOURCE_MNG')) { //云资源
				 $state.go('main.cloudResource');
			 } else if (PermissionService.hasPermission('CLOUD_HOST_MGR')) { //云主机
				 $state.go('main.cloudHost');
			 } else if (PermissionService.hasPermission('CLOUD_DISK_MGR')) { //云硬盘
				 $state.go('main.cloudDisk');
			 } else if (PermissionService.hasPermission('CLOUD_BACKUP_STRATEGY_MGR')) { //云备份
				 $state.go('main.cloudBackup');
			 } else if (PermissionService.hasPermission('CLOUD_SERVICE_MNG')) { //云服务
				 $state.go('main.cloudService');
			 } else if (PermissionService.hasPermission('ORGANIZATION_MNG')) { //组织管理
				 $state.go('main.orgMng');
			 } else if (PermissionService.hasPermission('USER_AND_GROUP_MGR')) { //用户管理
				 $state.go('main.userManage');
			 } else if (PermissionService.hasPermission('SYS_MNG')) { //系统管理
				 $state.go('main.systemMng');
			 } else if (PermissionService.hasPermission('MONITOR_MNG')) { //监控管理
				 $state.go('main.monitorMng');
			 } else {
				 //没有任何根权限，跳转到空白页面
				 $state.go('main.blank');
			 }
		},
		/**
		 * 通过DN 得到CN
		 * @param dn 
		 * @returns cn
		 */
		getcnByDn : function(dn) {
			var cn = '';
			if (!isEmpty(dn)) {
				var arr = dn.split(",");
				for (var i = 0; i < arr.length; i++) {
					var subSegments = arr[i].split("=");
					if (subSegments.length > 1) {
						if (subSegments[0].toUpperCase() == 'CN') {
							cn = subSegments[1];
							break;
						}
					}
				}
			}
			return cn;
		},
		/**
		 * 发送获取序列号SN的事件（Chrome45版本及其以上浏览器）
		 * @returns 
		 */
		sendGetSnEvent : function() {
			var message = {"msg":"DM_GetDevSN"};
			var event = new CustomEvent("MessageFromPageToCScript_HS:SN", {"detail": message});
			window.dispatchEvent(event);
		},
		/**
		 * 发送获取证书DN的事件（Chrome45版本及其以上浏览器）
		 * @param sn 序列号
		 * @returns 
		 */
		sendGetDnEvent : function(sn) {
			var message = {"msg":"DM_GetAllCertDN","SN":sn,"IsSign":true};
			var event = new CustomEvent("MessageFromPageToCScript_HS:CertDN", {"detail": message});
			window.dispatchEvent(event);
		},
		/**
		 * 发送获取证书的事件（Chrome45版本及其以上浏览器）
		 * @param plainText 
		 * @returns 
		 */
		sendGetCertEvent : function(plainText, certDN, hashType, userPIN) {
			var message = {"msg":"DM_Sign", "PlainText":plainText, "CertDN":certDN, "HashType":hashType, "UserPIN":userPIN};
			var event = new CustomEvent("MessageFromPageToCScript_HS:Sign", {"detail": message});
			window.dispatchEvent(event);
		},
		/**  
		 * 取消session的定时器 
		 * @return {
		 * 
		 */
		cancelSessionTimer : function() {
			if ($rootScope.sessionTimer) {
				clearTimeout($rootScope.sessionTimer);
				$rootScope.sessionTimer = undefined;
		}
		},
		/**  
		 * 启动session的定时器 
		 * @return {
		 * 
		 */
		startSessionTimer : function() {
			var self = this;
			if ($rootScope.timeout) {
			if (!$rootScope.sessionTimer) {
				$rootScope.sessionTimer = setTimeout(function(){
					self.logout(true);
			  	}, $rootScope.timeout);
			}
			}else{//timeout==0 永不超时
				self.cancelSessionTimer();
			}
		},		
		/**
		 * 查看元素是否是仅组织生效
		 */
		checkOrgArray : function(data) {
			if (!isEmpty(data)) {
				for (var i = 0; i < orgArray.length; i++) {
					if (data == orgArray[i]) {
						return true;//存在 
					}
				}
			}
			return false; //不存在  
		},
		/**
		 * 查看元素是否是仅资源池生效
		 */
		checkPoolArray : function(data) {
			if (!isEmpty(data)) {
				for (var i = 0; i < poolArray.length; i++) {
					if (data == poolArray[i]) {
						return true;//存在 
					}
				}
			}
			return false; //不存在  
		},
		/**
		 * 查看元素是否是资源池和组织均生效
		 */
		checkAllArray : function(data) {
			if (!isEmpty(data)) {
				for (var i = 0; i < allArray.length; i++) {
					if (data == allArray[i]) {
						return true;//存在 
					}
				}
			}
			return false; //不存在 
		},
		checkConflict : function(dataArray) {
			var self = this;
			var checkOrg = false;
			var checkPool = false;
			var checkAll = false;
			if (!isEmpty(dataArray)) {
				for(var item in dataArray) {
					if (self.checkOrgArray(dataArray[item])) {
						checkOrg = true;
					}
					if (self.checkPoolArray(dataArray[item])) {
						checkPool = true;
					}
					if (self.checkAllArray(dataArray[item])) {
						checkPool = true;
					}
				}
				if ((checkOrg && checkPool) || (checkOrg && checkAll) || (checkPool && checkAll)) {
					return true;
				}
			}
			return false;
		},
		/**  
		 * 启动定时请求web，防止web session过期 
		 * @return {
		 * 
		 */
		startTestRequest : function() {
			if ($rootScope.timeout) {
			if (!$rootScope.reqTimer) {
				$rootScope.reqTimer = setInterval(function(){
					$http.get("login/test");
			  	}, $rootScope.timeout / 2);
			}
			}else{
				this.cancelTestRequest();
			}
		},
		/**  
		 * 取消定时请求web
		 * @return {
		 * 
		 */
		cancelTestRequest : function() {
			if ($rootScope.reqTimer) {
				clearInterval($rootScope.reqTimer);
				$rootScope.reqTimer = undefined;
			}
		},
		/**
		 * 创建全局等待条，将全局等待条div追加到body元素的结尾处
		 */
		wait: function() {
			if ($("#bodyid > #globalwait_uuid")[0]) {
				return;
		}
			try {
				var body = document.getElementById("bodyid");
				var loadingText = $translate.instant('loading');
				var globalwaitId = "globalwait_uuid";
				var globalwaitDiv = '<div id="'+globalwaitId+'" style="z-index:999999;display:none;background-color:rgba(0,0,0,.37);position:fixed;top:0;right:0;bottom:0;left:0;">'+
					'<div class="modal-body" style="margin:200px auto;"><div style="font-size:12px" class="load-container load5"><div style="font-size:12px" class="loader">'+loadingText+
					'<div class="content" style="margin-top:-28px;">'+loadingText+'</div></div></div></div><div>';
				$(body).append(globalwaitDiv);
				$("#"+globalwaitId).show();
				return this;
			} catch (e) {
				// TODO: handle exception
				console.error(e);
			}
		},
		/**
		 * 移除全局等待条
		 */
		dismiss: function() {
			var $ele = $("#bodyid > #globalwait_uuid");
			if ($ele[0]) {
				$ele.remove();
			}
		},
		/**
		 * 移除全局等待条
		 */
		close: function() {
			this.dismiss();
		},
		checkAdminPwd : function(pwd) {
			 var deferred = $q.defer();//声明承偌
	    	 $http({
					methed: 'GET',
					url:'systemConfig/license/checkAdminPsw',
					params:{name: pwd}
				  }).success(function(result) {
					 deferred.resolve(result); 
				  }).error(function(response, code, headers, config) {
					 deferred.reject(code);
		          });
	    	 return deferred.promise;//返回承偌
		},
		/**
		 * 浏览器顶部的图标路径放入rootscope中
		 */
		setFavicon : function() {
            if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
                $rootScope.faviconImg='css/img/favicon_unis.png';
            }else if ($rootScope.uiConfig.copyrightFrom == constant.unicloud) {
							$rootScope.faviconImg = 'css/img/favicon_unicloud.png';
						} else if ($rootScope.uiConfig.sysFavicon) {
				  $rootScope.faviconImg = $rootScope.uiConfig.sysFavicon;
			} else {
				  if ($rootScope.uiConfig.copyrightFrom == constant.casic) {
					  $rootScope.faviconImg = 'css/img/spaceflight_favicon.png';
				  } else {
					  $rootScope.faviconImg = 'css/img/favicon.png';
				  }
			}
		},
		/**
		 * 浏览器顶部的title放入rootscope中
		 */
		setSystemName : function() {
			if ($rootScope.uiConfig) {
				if (angular.isDefined($rootScope.uiConfig.casSysName)) {
					$rootScope.systemName = $rootScope.uiConfig.casSysName;
				} else {
					if ($rootScope.uiConfig.copyrightFrom == constant.casic) {
						$rootScope.systemName = $translate.instant('casname2_ic');
					} else if ($rootScope.uiConfig.copyrightFrom == constant.casicunis) {
						$rootScope.systemName = $translate.instant('casname2_icunis');
					}  else if ($rootScope.uiConfig.copyrightFrom == constant.unis) {
                        $rootScope.systemName = $translate.instant('casname2_unis');
                    }  else {
						$rootScope.systemName = $translate.instant('casname2');
					}
				}
			}
		}
	};
});