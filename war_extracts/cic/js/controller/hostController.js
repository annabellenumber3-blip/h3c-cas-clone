//增加虚拟交换机对话框控制器(in host)
routeApp.controller('addVswitchCtrl', function($scope, $http, $translate, hostId, hostName, entry, cloudId, $modalInstance, UtilService,HttpService) {
    $scope.vswitch = {};
    $scope.vswitch.hostId = hostId;
    $scope.vswitch.hostName = hostName;
    $scope.vswitch.cloudId = cloudId;
    $scope.edit = false;
    $scope.isManage = false;
    $scope.phyList = [];
    $scope.slbTip = $translate.instant("vswitch.balanceSlbTip");
    $scope.lacpReadonly = 'false';
    $scope.vlanIdDisable = 'false';
    $scope.hasScopeId = false;
    if(entry){
    	//modify
    	if(entry.scopeId){
    		$scope.hasScopeId = true;
    	}
    	$scope.edit = true;
    	$scope.title = $translate.instant("cluster.modifyVswitch");
    	$http({
    		method: "GET",
    		url: "network/vswitch",
    		params: {
    			id : entry.id,
        		cloudId : cloudId
        	}
    	}).success(function(result){
    		if(result.data){
    			$scope.editVswitchModel = result.data;
    			$scope.vswitch.portNum = result.data.portNum;
    			$scope.vswitch.vlanId = result.data.vlanId;
    		}
    	});
    	$scope.vswitch.flag = '1';
    	$scope.vswitch.id = entry.id;
    	$scope.vswitch.name = entry.name;
    	$scope.vswitch.description = entry.description;
    	$scope.vswitch.mode = entry.mode;
    	var mode = entry.mode;
    	$scope.oldMode = mode;
    	var inf = entry["interface"];
    	if(inf){
    		var devs = inf.split(",");
    		for(var i = 0; i < devs.length; i++){
    			var ethItem = {};
    			ethItem.name = devs[i];
    			ethItem.checked = 'true';
    			$scope.phyList.push(ethItem);
    		}
    	}
    	if(mode == 0){
    		$scope.slbTip = $translate.instant("vswitch.balanceSlbTip");
    		if(entry.enableLacp == true){
    			$scope.vswitch.enableLacp = 'true';
    		} else {
    			$scope.vswitch.enableLacp = 'false';
    		}
    		if(entry.bondMode){
    			$scope.vswitch.bondMode = entry.bondMode;
    		}else{
    			$scope.vswitch.bondMode = 'balance-tcp';
    		}
    		
    	}else if(mode == 1 || mode == 2){
    		$scope.vswitch.enableLacp = 'false';
    	}else if(mode == 3){
    		$scope.slbTip = $translate.instant("vswitch.vxlanSlbTip");
    		$scope.vswitch.enableLacp = 'false';
    		if(entry.bondMode){
    			$scope.vswitch.bondMode = entry.bondMode;
    		}else{
    			$scope.vswitch.bondMode = 'balance-tcp';
    		}
    	}
    	$scope.vswitch.ip = entry.ip;
    	$scope.vswitch.gateway = entry.gateway;
    	$scope.vswitch.mask = entry.netmask;
    	$scope.oldIp = entry.ip;
    	$scope.oldGateway = entry.gateway;
    	$scope.oldNetmask = entry.netmask;
    	if(parseInt(entry.isManage) == 1){
    		$scope.vlanIdDisable = 'true';
    		$scope.isManage = true;
    	}
    	
    }else{
    	$scope.edit = false;
    	$scope.vswitch.flag = '0';
    	$scope.title = $translate.instant("vswitch.addVswitch");
    	$scope.vswitch.mode = '0';
    	$scope.vswitch.portNum = 32;
    	$scope.vswitch.enableLacp = 'false';
    	$scope.vswitch.bondMode = 'balance-tcp';
    }
    $scope.ipList = [];
    $scope.gatewayList = [];
    $http({
    	method: "GET",
    	url: "network/host/" + hostId + "/vswitchs",
    	params: {
    		cloudId : cloudId
    	}
    }).success(function(result){
    	if(result.data){
    		for(var i = 0; i < result.data.length; i++){
    			var item = result.data[i];
    			if(item.ip){
    				$scope.ipList.push(item.ip);
    			}
    			if(item.gateway){
    				$scope.gatewayList.push(item.gateway);
    			}
    		}
    	}
    })
    $http({
    	method: "GET",
    	url: "network/host/phyEth",
    	params: {
    		hostId : hostId,
    		cloudId : cloudId
    	}
    }).success(function(result){
    	if(result.data){
    		for(var i = 0; i < result.data.length; i++){
    			var ethItem = result.data[i];
    			ethItem.checked = 'false';
    			$scope.phyList.push(ethItem);
        	}
    	}
    });
    $scope.ethSize = 0;
    $scope.$watch("phyList", function(newValue, oldValue){
    	$scope.ethSize = 0;
    	var selectPhy = new Array();
    	for(var i = 0; i < $scope.phyList.length; i++){
    		if($scope.phyList[i].checked == 'true'){
    			$scope.ethSize ++;
    			selectPhy.push($scope.phyList[i].name);
    		}
    	}
    	$scope.selectPhtName = selectPhy.toString();
    }, true);
    $scope.$watch("vswitch.mode", function(newValue, oldValue){
    	if(newValue == 0){
    		$scope.slbTip = $translate.instant("vswitch.balanceSlbTip");
    	}else if(newValue == 3){
    		$scope.slbTip = $translate.instant("vswitch.vxlanSlbTip");
    	}
    })
    
    // 当选择动态链路聚合、而负载分担模式为主备负载时，自动选为高级负载。
    $scope.$watch("vswitch.enableLacp", function(newValue, oldValue){
    	if(newValue == "true" && $scope.vswitch.bondMode == "active-backup"){
    		$scope.vswitch.bondMode = "balance-tcp";
    	}
    })

    //步骤提示的显示
    $scope.stepTitles = [ $translate.instant('common.baseInfo'),
                                  $translate.instant('vswitch.configNetwork')];      
    
    //转发模式veb:0,vds:3,vxlanCas:4
    $scope.transmitType = {
            options:[{value:'0', label:$translate.instant('vswitch.veb')}]
        }
    var loginInfo = localStorage.getItem("cicLoginInfo");
    var version = JSON.parse(loginInfo).version;
    if(loginInfo){
    	if(version > constant.STANDARD_VER){
    		$scope.transmitType.options.push({value:'3', label:$translate.instant('vswitch.vds')});
    	}
    }
    if($scope.edit == false){
    	$scope.transmitType.options.push({value:'4', label:$translate.instant('vswitch.vxlanCas')});
    }
    
    $scope.nameExist = false;
    
    $scope.checkUniqName = function(){
    	if($scope.edit){
    		return;
    	}
    	var params = {};
    	params.hostId = $scope.vswitch.hostId;
    	params.vswitchName = $scope.vswitch.name;
    	params.cloudId = $scope.vswitch.cloudId;
    	$http({
    		method: "GET",
    		url: "network/vswitch/name/exist",
    		params: params
    	}).success(function(result){
    		$scope.nameExist = result;
    	})
    };
    
    $scope.ipAndGatewayAgree = true;
    $scope.checkIpAndGatewayAgree = function(){
    	//仅在前端校验通过的时候检查ip，网关，掩码是否匹配
    	if ($('#form2').val() === "true" && !isEmpty($scope.vswitch.ip) 
    			&& !isEmpty($scope.vswitch.mask) && !isEmpty($scope.vswitch.gateway)){
    		var params = {};
    		params.address = $scope.vswitch.ip;
    		params.netmask = $scope.vswitch.mask;
    		params.gateway = $scope.vswitch.gateway;
    		$http({
    			method: "GET",
    			url: "network/vswitch/ipGatewayAgree",
    			params: params
    		}).success(function(result){
    			$scope.ipAndGatewayAgree = result;
    		});
    	}
    }
    //form之间的切换控制
    $scope.valids = {
        stepOneOver : function() {
            if ($('#form1').val() === "true" && $scope.nameExist == false)
                return true;
            return false;
        },
        stepTwoOver : function() {
            if ($('#form2').val() === "true" && $scope.ipAndGatewayAgree == true)
                return true;
            return false;
        }
    };
    
    $scope.nextCallBack = {
    		"1":function(){
    			if($scope.vswitch.name.trim().toLowerCase() == "auto"){
            		UtilService.error($translate.instant("vswitch.nonAuto"));
            		return false;
            	}
            	if($scope.vswitch.name.trim().toLowerCase().substring(0, 3) == "eth"){
            		UtilService.error($translate.instant("vswitch.nonEth"));
            		return false;
            	}
    		}
    }
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };      
    
    $scope.ok = function () {
    	if($scope.vswitch.mode != 4){
    		if($scope.vswitch.mode > 0 && $scope.ethSize == 0){
    			UtilService.error($translate.instant("vswitch.ethPrompt"));
    			return;
    		}
        	if($scope.vswitch.mode == 3){
        		if(isEmpty($scope.vswitch.ip) || isEmpty($scope.vswitch.mask)){
        			UtilService.error($translate.instant("vswitch.vxLanIpNull"));
        			return;
        		}
        	}
        	if(!$scope.edit){
        		if(!isEmpty($scope.vswitch.ip) && $scope.ipList.contains($scope.vswitch.ip)){
        			UtilService.error($translate.instant("vswitch.ipAddrExist"));
        			return;
        		}
        		if(!isEmpty($scope.vswitch.gateway) && $scope.gatewayList.length > 0){
        			UtilService.error($translate.instant("vswitch.gatewayExist"));
        			return;
        		}
        	}else if($scope.edit){
        		if(!isEmpty($scope.oldIp) && !isEmpty($scope.vswitch.ip) && $scope.oldIp != $scope.vswitch.ip
        				&& $scope.ipList.contains($scope.vswitch.ip)){
        			UtilService.error($translate.instant("vswitch.ipExist"));
        			return;
        		}
        		if(!isEmpty($scope.vswitch.gateway) && $scope.gatewayList.length > 0
        				&& isEmpty($scope.oldGateway)){
        			UtilService.error($translate.instant("vswitch.gatewayExist"));
        			return;
        		}
        	}
        	if(!isEmpty($scope.vswitch.ip) && isEmpty($scope.vswitch.mask)){
        		var modalInstance = UtilService.error($translate.instant("vswitch.maskEmpty"));
        		modalInstance.result.then(function(){
        			$("#mask").focus();
        		})
        		return;
        	}
        	if(!isEmpty($scope.vswitch.mask) && isEmpty($scope.vswitch.ip)){
        		var modalInstance = UtilService.error($translate.instant("vswitch.ipEmpty"));
        		modalInstance.result.then(function(){
        			$("#ip").focus();
        		})
        		return;
        	}
        	if(!isEmpty($scope.vswitch.gateway) && isEmpty($scope.vswitch.ip)){
        		var modalInstance = UtilService.error($translate.instant("vswitch.ipEmptyExistGateway"));
        		modalInstance.result.then(function(){
        			$("#ip").focus();
        		})
        		return;
        	}
        	if(!isEmpty($scope.vswitch.gateway) && isEmpty($scope.vswitch.mask)){
        		var modalInstance = UtilService.error($translate.instant("vswitch.maskEmptyExistGateway"));
        		modalInstance.result.then(function(){
        			$("#mask").focus();
        		})
        		return;
        	}
        	if($scope.vswitch.mode != 4 && $scope.edit == true){
				if(!UtilService.isSameNetworkSegment($scope.vswitch.ip, $scope.vswitch.mask, $scope.oldIp, $scope.oldNetmask) || $scope.ethSize == 0){
					$http({
						method: "GET",
						url:"network/vswitch/route/exist",
						params: {
							hostId : hostId,
							vswitchName : $scope.vswitch.name,
			        		cloudId : cloudId
			        	}
					}).success(function(result){
						if(result.success){
							if(result.data == true){
								var modalInstance = UtilService.confirm($translate.instant("vswitch.hasRoute"));
								modalInstance.result.then(function(){
									$scope.checkAndOperate();
								}, function(){});
							}else{
								$scope.checkAndOperate();
							}
						}else{
							UtilService.handleResult(result);
						}
					}).error(function(response, code, headers, config) {
			        	  UtilService.handleError(code);
			        });
				}else{
					$scope.checkAndOperate();
				}
			}
    	}else if($scope.vswitch.mode == 4){
    		if($scope.vswitch.name.trim().toLowerCase() == "auto"){
        		UtilService.error($translate.instant("vswitch.nonAuto"));
        		return false;
        	}
        	if($scope.vswitch.name.trim().toLowerCase().substring(0, 3) == "eth"){
        		UtilService.error($translate.instant("vswitch.nonEth"));
        		return false;
        	}
    	}
    	if($scope.vswitch.mode == 4 || $scope.edit == false){
    		$scope.checkAndOperate();
    	}
    };
    
    $scope.checkAndOperate = function(){
    	var data = angular.copy($scope.vswitch);
    	delete data.ip;
    	delete data.mask;
    	data.address = $scope.vswitch.ip;
    	data.netmask = $scope.vswitch.mask;
    	if($scope.oldIp){
    		data.oldIpAddr = $scope.oldIp;
    	}
    	if ($scope.phyList.length > 0){
    		var pnic = "";
        	for(var i = 0; i < $scope.phyList.length; i++){
        		if($scope.phyList[i].checked == 'true'){
        			pnic += $scope.phyList[i].name + ",";
        		}
        	}
        	pnic = pnic.substring(0, pnic.length - 1);
        	data.pnic = pnic;
        	
        	var pnicData = [];
        	var pnicItem = {};
        	pnicItem.nic = pnic;
        	pnicItem.hostId = $scope.vswitch.hostId;
        	pnicData.push(pnicItem);
        	data.pnicData = pnicData;
    	}
    	
    	
    	if($scope.edit == false){
    		if($scope.vswitch.mode != 4){
    			if($scope.ethSize > 1){
            		if($scope.vswitch.enableLacp == 'false' && $scope.vswitch.bondMode == 'activeBackup'){
            			$scope.add(data);
            		}else{
            		    var modalInstance1 = UtilService.confirm($translate.instant("vswitch.addVswitchLacpPrompt",{name: $scope.vswitch.name}), $translate.instant("vswitch.addVswitch"));
            		    modalInstance1.result.then(function(){
            		    	if(!isEmpty($scope.vswitch.gateway)){
            		    		var modalInstance2 = UtilService.confirm($translate.instant("vswitch.addVswitchGatewayPrompt",{name: $scope.vswitch.name}), $translate.instant("vswitch.addVswitch"))
            		    		modalInstance2.result.then(function(){
            		    			$scope.add(data);
            		    		}, function(){});
            		    	}else{
            		    		$scope.add(data);
            		    	}
            		    }, function(){});
            		}
            	}else{
            		if(!isEmpty($scope.vswitch.gateway)){
        	    		var modalInstance2 = UtilService.confirm($translate.instant("vswitch.addVswitchGatewayPrompt",{name: $scope.vswitch.name}), $translate.instant("vswitch.addVswitch"))
        	    		modalInstance2.result.then(function(){
        	    			$scope.add(data);
        	    		}, function(){});
        	    	}else{
        	    		$scope.add(data);
        	    	}
            	}
    		} else {
    			$scope.add(data);
    		}
    		
    	}else{
    		if($scope.ethSize > 1){
        		if($scope.vswitch.enableLacp == 'false' && $scope.vswitch.bondMode == 'activeBackup'){
        			$scope.modify(data);
        		}else{
        		    var modalInstance1 = UtilService.confirm($translate.instant("vswitch.addVswitchLacpPrompt",{name: $scope.vswitch.name}), $translate.instant("cluster.modifyVswitch"));
        		    modalInstance1.result.then(function(){
        		    	if($scope.isManage){
        		    		var modalInstance2 = UtilService.confirm($translate.instant("vswitch.managePrompt"), $translate.instant("cluster.modifyVswitch"));
            		    	modalInstance2.result.then(function(){
            		    		$scope.checkMultipleGateway(data);
            		    	})
        		    	} else {
        		    		$scope.checkMultipleGateway(data);
        		    	}
        		    }, function(){});
        		}
        	}else{
        		$scope.checkMultipleGateway(data);
        	}
    	}
    }
    
    $scope.checkMultipleGateway = function(data) {
    	if(!isEmpty($scope.vswitch.gateway)){
    		var modalInstance2 = UtilService.confirm($translate.instant("vswitch.addVswitchGatewayPrompt",{name: $scope.vswitch.name}), $translate.instant("vswitch.addVswitch"))
    		modalInstance2.result.then(function(){
    			$scope.modify(data);
    		}, function(){});
    	}else{
    		$scope.modify(data);
    	}
    }
    
    
    $scope.add = function(data){
    	HttpService.post('network/vswitch', data, $modalInstance);
    };
    
    $scope.modify = function(data){
    	HttpService.put('network/vswitch', data, $modalInstance);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


//增加存储卷控制器
routeApp.controller('AddStorageCtrl', function($rootScope, $scope, $http, $translate, $filter, hostId, cloudId,  storepoolName, storepoolPath, remainSize, $modalInstance, UtilService,HttpService){
	$scope.storage = {};
	$scope.volume = {};
	$scope.volume.hostId = hostId;
	$scope.volume.spName = storepoolName;
	$scope.capacity = 1;
	$scope.minSize = 1;
	
	$scope.storage.format = {
			options:[{value:"raw",label:$translate.instant('storagePool.raw')},
			         {value:"qcow2",label:$translate.instant('storagePool.qcow2')}]
	};
	if (remainSize > 1024) {
    	$scope.storage.poolAvailable = remainSize-1024;
    } else {
    	$scope.storage.poolAvailable = 0;
    }
	$scope.storage.storageUnit = {
	        options:[{value:'MB',label:"MB"},
	                 {value:'GB',label:'GB'},
	                 {value:'TB',label:'TB'}]
	};
	
	$http({
		method : "GET",
		url : "host?hostId=" + hostId + "&cloudId=" + cloudId
	}).success(function(result){
		if (result.data){
			$scope.hostName = result.data.name;
		}
	})
    //监控单位变化
	$scope.poolAvailable = $scope.storage.poolAvailable; //$scope.storage.poolAvailable must keep out.
    $scope.$watch('storage.storageUnit.unit', function(newValue, oldValue) {
        if (newValue == oldValue && newValue == 'GB') {
        	$scope.poolAvailable = $scope.storage.poolAvailable / 1024;
            $scope.minSize = 1;
            $scope.poolAvailable = Math.floor($scope.poolAvailable * 100) / 100;
        	return;
        }
    	if (oldValue == 'MB' && newValue == 'GB') {
            $scope.poolAvailable = $scope.storage.poolAvailable / 1024;
            $scope.minSize = 1;
        } else if (oldValue == 'MB' && newValue == 'TB') {
            $scope.poolAvailable = $scope.storage.poolAvailable / 1048576;//1048576=1024*1024
            $scope.minSize = 0.01;
        } else if (oldValue == 'GB' && newValue == 'MB') {
            $scope.poolAvailable = $scope.storage.poolAvailable;
            $scope.minSize = 1024;
        } else if (oldValue == 'GB' && newValue == 'TB') {
            $scope.poolAvailable = $scope.storage.poolAvailable / 1048576;
            $scope.minSize = 0.01;
        } else if (oldValue == 'TB' && newValue == 'MB') {
            $scope.poolAvailable = $scope.storage.poolAvailable;
            $scope.minSize = 1024;
        } else if (oldValue == 'TB' && newValue == 'GB') {
            $scope.poolAvailable = $scope.storage.poolAvailable / 1024;
            $scope.minSize = 1;
        }
        //keep 2 number after pointer, and cut up.
        $scope.poolAvailable = Math.floor($scope.poolAvailable * 100) / 100;
    });
	// 选择存储卷
    $scope.selectVolume = function() {
    	var resolve = {
    			paramsObj : function(){
    				return {
    					hostId : hostId,
    					cloudId : cloudId,
    					isSelectBase : true
    				}
    			}
        };
  	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
  	    storeFileInstance.result.then(function (reason) {
  	    	if (angular.isDefined(reason) && reason != 'cancel') {
  	    		// 点击了确定按钮
  	    		$scope.volume.baseFile = reason.filePath;
  	    		$scope.baseFileTooltip = reason.filePath;
  	    	}
        });
    };
    $scope.deleteBaseFile = function() {
    	$scope.volume.baseFile = undefined;
    };
    //重名检查参数
    $scope.$watch('volume.volName', function(newValue, oldValue) {
        $scope.checkNameParam.path = storepoolPath + '/' + newValue;
    });
    $scope.checkNameParam = {};
    $scope.checkNameParam.hostId = hostId;
    $scope.checkNameParam.path = storepoolPath + '/' + $scope.volume.volName;
    
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };
    $scope.ok = function() {
    	var callback = function() {
    		var msg = {};
    		msg.hostId = hostId;
    		$rootScope.$broadcast('onQueryStorageVolumeList',msg);
    		$rootScope.$broadcast('onSendSelectVolume',$scope.volume);//将卷对象发送给选择对话框，用于直接选中关闭对话框。
    	};
    	
    	//update unit
    	if ($scope.storage.storageUnit.unit == 'GB') {
    		$scope.volume.capacity = $scope.capacity * 1024;
    	} else if ($scope.storage.storageUnit.unit == 'TB') {
    		$scope.volume.capacity = $scope.capacity * 1048576;
    	} else {
    		$scope.volume.capacity = $scope.capacity;
    	}
    	
    	HttpService.post('storage/volume?cloudId=' + cloudId + "&hostName=" + $scope.hostName, $scope.volume, $modalInstance, callback);
    };
    $scope.cancel = function() {
    	$modalInstance.dismiss('cancel');
    };
});

//上传存储卷
routeApp.controller('UploadCtrl',function($scope, $http,$timeout, $translate, $modalInstance, UtilService,HttpService, hostId,cloudId, row) {
	if (!row instanceof Array || row.length == 0) {
		return;
	}
	$http({
		method : "GET",
		url : "host/cloudUrl",
		params : {
			cloudId : cloudId
		}
	}).success(function(result){
		$scope.cloudData = result.data;
		$scope.host = {};
	    $scope.storage = {};
	    var size = Math.pow(1024,3) * 200;
	    if ($scope.cloudData) {
	    	var config = {
				    autoUploading : false, /**选择文件后是否自动上传**/
					customered : false, /**是否自定义ui**/
					autoRemoveCompleted : true, /**文件上传后是否移除，customered=false时有效**/
				    browseFileId : "i_select_files", /** 选择文件的ID, 默认: i_select_files */
				    browseFileBtn : $translate.instant('uploadfile.uploadisoBrowseFileBtn'), /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
					dragAndDropArea: "i_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
					dragAndDropTips: $translate.instant('uploadfile.uploadisoDragAndDropTips'), /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
					filesQueueId : "i_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
					filesQueueHeight : 314, /** 文件上传容器的高度（px）, 默认: 450 */
					messagerId : "i_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
					multipleFiles: true /** 多个文件一起上传, 默认: false */,
					retryCount : 2, /** HTML5上传失败的重试次数 */
					tokenURL : $scope.cloudData.url  + "spring_check/upload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
					frmUploadURL :  $scope.cloudData.url + "spring_check/upload/fd;", /** Flash上传的URI */
					uploadURL : $scope.cloudData.url + "spring_check/upload/upload", /** HTML5上传的URI */
					swfURL : $scope.cloudData.url + "spring_check/swf/FlashUploader.swf",/** SWF文件的位置 */
					maxSize: size,/** 单个文件的最大大小200G，默认:2G */
					extFilters : [], /**允许上传文件的类型**/
					postVarsPerFile:{"path": row[0].path, "poolName" : row[0].name, "hostId" : hostId, "loginName" : $scope.cloudData.loginName + "@VMC-RS",
						             "userName" : "@VMC-RS", "cicFlag" : 0, "operLoginName" : $scope.cloudData.loginName, "name" : "admin", "password" : "admin"},  /**上传文件时传入的参数**/
					onNameRegexMismatch: function(file) {
						fShowMessage($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}), true);
					},
					onSelect : function(list) {
						fShowMessage($translate.instant('uploadfile.uploadisoSelectFile',{value:list.length}));
					},
					onFileCountExceed : function(selected, limit) {
						fShowMessage($translate.instant('uploadfile.uploadisoFileCountExceed ',{value1:selected,value2:limit}), true);
					},
					onMaxSizeExceed : function(file) {
						fShowMessage($translate.instant('uploadfile.uploadisoMaxSizeExceed',{value1:file.name,value2:file.formatSize,value3:file.limitSize}), true);
					},
					onExtNameMismatch: function(file) {
						fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
					},
					onAddTask: function(file) {
						fShowMessage($translate.instant('uploadfile.uploadisoAddTask',{value:file.name}));
					},
					onCancel : function(file) {
						fShowMessage($translate.instant('uploadfile.uploadisoCancel',{value:file.name}));
					},
					onStop : function() {
						fShowMessage($translate.instant('uploadfile.uploadisoStop'));
					},
					onCancelAll : function(numbers) {
						fShowMessage($translate.instant('uploadfile.uploadisoCancelAll',{value:numbers}));
					},
					onComplete : function(file) {
						fShowMessage($translate.instant('uploadfile.uploadisoComplete',{value1:file.name,value2:file.formatSize}));
					},
					onQueueComplete : function(msg) {
						fShowMessage($translate.instant('uploadfile.uploadisoQueueComplete'));
					},
					onUploadError : function(status, msg) {
						var msgJson = jQuery.parseJSON(msg);
						if (msgJson.errorcode) {
							if (msgJson.errorcode == 20) {
								fShowMessage($translate.instant('uploadfile.uploadRenameError',{value:msgJson.filename}), true);
							} else if (msgJson.errorcode == 21) {
								fShowMessage($translate.instant('uploadfile.uploadCapacityError'), true);
							}
						} else {
							fShowMessage("Error Occur.  Status:" + status + ", Message: " + msg, true);
						}
					},
					onMaxSizeExceed: function(file) {
						fShowMessage($translate.instant('uploadfile.uploadFilesizeLimitError',{value1:file.name,value2:file.formatSize,value3:file.formatLimitSize}), true);
					}
					
			    };
			    $scope.config = config;
			    
			    $timeout(function(){
			    	$scope.stream = new Stream(config);
			    }, 10);
	    }
	    
	}).error(function(response, code, headers, config) {
	  UtilService.handleError(code);
  });;
	$scope.cancel = function () {
		if ($scope.stream != null) {
			$scope.stream.destroy();
	    	$scope.stream=null;
		}		
		$modalInstance.dismiss('cancel');
	};
	
	    function fShowMessage(msg, warning) {
	    	var o = document.getElementById("i_stream_message_container");
	    	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
	    }
	    function falertMessage(msg,warning){
	    	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:0px;padding:10px;margin-bottom:10px;word-break:break-all;" class="alert ';
	    	s+= !!warning?"alert-danger":"alert-success"
	    		s+='" role="alert">'+
	    		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
	    		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><div style="word-wrap:break-word;word-break:break-all;">'+
	    		msg+'</div></div>';
	    	return s;
	    }
});