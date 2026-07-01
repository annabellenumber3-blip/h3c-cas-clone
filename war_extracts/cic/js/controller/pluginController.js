routeApp.controller('pluginManagerCtrl',function($scope, $http, $modal, $translate, $timeout,UtilService, HttpService, GridService,HttpService2){
	var column = [
                  { field: 'name', displayName: $translate.instant('pluginMgr.name'), sortable: true, width:'20%', cellTemplate:titleTemplate},
                  { field: 'title', displayName: $translate.instant('pluginMgr.title'), sortable: true, width:'20%', cellTemplate:titleTemplate},
                  { field: 'desc', displayName: $translate.instant('pluginMgr.desc'), sortable: true, width:'20%', cellTemplate:titleTemplate},
                  { field: 'state', displayName: $translate.instant('pluginMgr.state'), sortable: true, width:'20%', cellTemplate:titleTemplate},
                  { field: 'oper', displayName: $translate.instant('pluginMgr.operation'), sortable: false, width:'20%', cellTemplate:
                  	 '<div><div class="ngCellButton">'
                 	 +'<div type="button" class="btn btn-sm-icon icon-start-gray" ng-if="row.entity.state == \''+$translate.instant('pluginMgr.stopped')+'\' || row.entity.state == \''+$translate.instant('pluginMgr.failed')+'\' " ng-click="startPlugin(row.entity)" custom-title="'+$translate.instant('common.enable')+'"></div>'
                 	 +'<div type="button" class="btn btn-sm-icon icon-pause-gray" ng-if="row.entity.state != \''+$translate.instant('pluginMgr.stopped')+'\' && row.entity.state != \''+$translate.instant('pluginMgr.failed')+'\' && row.entity.state != \''+$translate.instant('pluginMgr.error')+'\'" ng-click="stopPlugin(row.entity)" custom-title="'+$translate.instant('pluginMgr.stop')+'"></div>'
                  	 +'<div type="button" class="btn btn-sm-icon icon-modify-gray" ng-click="editPlugin(row.entity)" custom-title="'+$translate.instant('common.modify')+'"></div>'
                  	 +'<div type="button" class="btn btn-sm-icon icon-delete-gray" ng-click="deletePlugin(row.entity)" custom-title="'+$translate.instant('common.delete')+'"></div>'
                  	 +'<div type="button" class="btn btn-sm-icon icon-upload-gray" ng-click="upgradePlugin(row.entity)" custom-title="'+$translate.instant('pluginMgr.upgrade')+'"></div>'
                  	 +'</div></div>'
                  	 }
                  ]
	
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
    listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
    var url = 'pluginMgr/list';
    $scope = GridService.grid($scope, url, null, null,null, "pluginList");
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            showSelectionCheckbox: false,
            multiSelect: false,
            showGroupPanel: false,
            showColumnMenu: true,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: false,
            showFooter: false,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: false,
            pagingOptions: false,
            columnDefs:column
    }; 
    //刷新
    $scope.refreshPluginList=function(){
    	refreshPluginTree();
		$timeout(function(){
			$scope.refreshPage();
    	}, 400);
    };
    
    $scope.openAddPlugin = function(){
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/plugin/addPlugin.html',
            controller: 'addPluginCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
            }
        });
    	modalInstance.result.then(function () {
    		$scope.refreshPluginList();
	    }, function () {
	    	$scope.refreshPluginList();
	    }); 
    }
    $scope.editPlugin = function(entity){
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/plugin/editPlugin.html',
            controller: 'editPluginCtrl',
            width:'520px',
            backdrop: 'static',
            resolve: {
            	entity : function(){
            		return entity;
            	}
            }
        });
    	modalInstance.result.then(function () {
    		$scope.refreshPluginList();
	    }, function () {
	    	$scope.refreshPluginList();
	    }); 
    }
    $scope.deletePlugin = function(entity){
    	var modalInstance = UtilService.confirm($translate.instant("pluginMgr.deletePluginInfo", {title: entity.title}), $translate.instant("pluginMgr.deletePlugin"));
    	modalInstance.result.then(function(){
    		var url = "pluginMgr/plugin/"+entity.id;
        	HttpService.delete(url, null, undefined, $scope.refreshPluginList);
    	}, function(){});
    }
    $scope.startPlugin = function(entity){
    	var modalInstance = UtilService.confirm($translate.instant("pluginMgr.startPluginInfo", {title: entity.title}), $translate.instant("pluginMgr.startPlugin"));
    	modalInstance.result.then(function(){
    		var url = "pluginMgr/plugin/"+entity.id+"/start";
        	HttpService.put(url, entity, modalInstance,$scope.refreshPluginList);
        	$scope.refreshPluginList();
    	}, function(){
    		$scope.refreshPluginList();
    	});
    }
    $scope.stopPlugin = function(entity){
    	var modalInstance = UtilService.confirm($translate.instant("pluginMgr.stopPluginInfo", {title: entity.title}), $translate.instant("pluginMgr.stopPlugin"));
    	modalInstance.result.then(function(){
    		var url = "pluginMgr/plugin/"+entity.id+"/stop";
        	HttpService.put(url, entity, modalInstance,$scope.refreshPluginList);
        	$scope.refreshPluginList();
    	}, function(){
    		$scope.refreshPluginList();
    	});
    }
    $scope.upgradePlugin = function(entity){
    	var modalInstance = $modal.open({
            templateUrl: 'html/modal/plugin/upgradePlugin.html',
            controller: 'upgradePluginCtrl',
            size:'lg',
            backdrop: 'static',
            resolve: {
            	entity : function(){
            		return entity;
            	}
            }
        });
    	modalInstance.result.then(function () {
    		$scope.refreshPluginList();
	    }, function (reason) {
	    	$scope.refreshPluginList();
	    }); 
    }
    function refreshPluginTree(){
    	$(".plugin-navigation").remove();
    	$("#pluginManageTreeNode_id").removeClass('open');
    	$("#pluginMgrTreeId").hide();
    	$("#pluginManageAccordionLinkId").click();
    }
})

routeApp.controller('addPluginCtrl',function($rootScope, $scope, $state, $http,$modalInstance, $timeout, $translate, UtilService,HttpService,HttpService2){
	$scope.plugin={};
	$scope.isFirstPage=true;
	$scope.showVersion=false;
	$scope.hasUpload = false;
    $scope.addPluginStep = [$translate.instant('pluginMgr.addPluginStepOne'),$translate.instant('pluginMgr.addPluginStepTwo')];
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && $scope.form.$valid) {
            $scope.ok();
        }
    };
    $scope.ok=function(){
    	var plugin = angular.copy($scope.plugin);
    	var uri = "pluginMgr/plugin/"+plugin.id+"/file";
    	if(!plugin.title){
    		plugin.title = plugin.name;
    	}
    	if(!plugin.version){
    		plugin.version = "1.0";
    	}
    	if(plugin.autostart == true){
    		var plugin = angular.copy($scope.plugin);
    		var callback = function(){
    			$.ajax({ 
    				url:'pluginMgr/plugin/'+plugin.id+'/start',
    				type:'put',
    				contentType:'application/json;charset=UTF-8',
    				data:JSON.stringify(plugin),
    				async:true,
    			});
    		};
    		HttpService.put(uri, plugin, $modalInstance,callback);
    	}else{
    		HttpService.put(uri, plugin, $modalInstance);
    	}
    	$("#i_select_files").show();
    	$("#i_stream_files_queue").hide();
		$("#streambtn").hide();
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
	$scope.stepValids = {
		      stepOneOver : function() {
		    	  if ($('#form1').val() === "true") {
		              return true;
		          }
		          return false;
		      },
		      stepTwoOver : function() {
		          if ($scope.hasUpload){
		    		  return true;
		    	  }
	              return false;
		      }
	}
	$scope.nextCallBack = {
	    	"1" : function(){
	        	var plugin = angular.copy($scope.plugin);
//	        	if(plugin.autostart == true){
//	        		plugin.enable=1;
//	        	}else{
//	        		plugin.enable=0;
//	        	}
	        	var presult =false;
	        	$.ajax({ 
			    	url:'pluginMgr/plugin/'+0,
			    	type:'post',
			    	contentType:'application/json;charset=UTF-8',
			    	data:JSON.stringify(plugin),
			    	async:false,
			    	cache:false,
			    	success: function(result) {
			    		if(result.state == 0){
			        		$scope.isFirstPage=false;
			        		$scope.plugin.id = result.data;
			        		presult = true;
			        		$scope.streamInit(result.data);
		        		}else{
		        			UtilService.alert(result.failureMessage, $translate.instant('common.opertip'), false, 'error');
		        		}
			    	}
			    });
	        	$timeout(function(){
	        		$("#prevbutton").hide();
	        	}, 400);
	        	return presult;
	    	}
	    }
	$scope.preCallBack = {
			"0":function(){
				return false;
			}
	}

	$scope.streamInit=function(id){
		var size = Math.pow(1024,3) * 200;
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
				multipleFiles: false /** 多个文件一起上传, 默认: false */,
				retryCount : 2, /** HTML5上传失败的重试次数 */
				tokenURL : "pluginMgr/upload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
				frmUploadURL : "pluginMgr/upload/fd;", /** Flash上传的URI */
				uploadURL : "pluginMgr/upload/upload", /** HTML5上传的URI */
				swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
				maxSize: size,/** 单个文件的最大大小200G，默认:2G */
				extFilters : ['.zip'], /**允许上传文件的类型**/
				checkFileName : false,/** 对文件名检测是否允许输入特殊字符，默认为true */
				postVarsPerFile:{id:id},  /** 上传文件时传入的参数* */
				onNameRegexMismatch: function(file) {
					fShowMessage($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}), true);
				},
				onSelect : function(list) {
					var uploadFileName=list[0].name;
					var fileExt=uploadFileName.split('.');
					if(fileExt[fileExt.length-1]=='zip'){
						$("#i_select_files").hide();
						$("#i_stream_files_queue").show();
						$("#streambtn").show();
					}
					fShowMessage($translate.instant('uploadfile.uploadisoSelectFile',{value:list.length}));
				},
				onFileCountExceed : function(selected, limit) {
					fShowMessage($translate.instant('uploadfile.uploadisoFileCountExceed ',{value1:selected,value2:limit}), true);
				},
				onMaxSizeExceed : function(file) {
					fShowMessage($translate.instant('uploadfile.uploadisoMaxSizeExceed',{value1:file.name,value2:file.size,value3:file.limitSize}), true);
				},
				onExtNameMismatch: function(file) {
					fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
				},
				onAddTask: function(file) {
					fShowMessage($translate.instant('uploadfile.uploadisoAddTask',{value:file.name}));
				},
				onCancel : function(file) {
					$("#i_stream_files_queue").hide();
					$("#streambtn").hide();
					$("#i_select_files").show();
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
					var msgJson = jQuery.parseJSON(file.msg);
					if (typeof msgJson == 'string') {
						msgJson = jQuery.parseJSON(msgJson);
					}
					$scope.ok();
				},
				onQueueComplete : function(msg) {
					fShowMessage($translate.instant('uploadfile.uploadisoQueueComplete'));
				},
				onUploadError : function(status, msg) {
					var msgJson = jQuery.parseJSON(msg);
					if (typeof msgJson == 'string') {
						msgJson = jQuery.parseJSON(msgJson);
					}
					if (msg.success) {
	                    fShowMessage(msgJson.message);
					} else {
					    fShowMessage(msgJson.message, true);
					}
				},
				onMaxSizeExceed: function(file) {
					fShowMessage($translate.instant('uploadfile.uploadFilesizeLimitError',{value1:file.name,value2:file.formatSize,value3:file.formatLimitSize}), true);
				}
				
		    };
	    
	    function fShowMessage(msg, warning) {
	    	var o = document.getElementById("i_stream_message_container");
	    	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
	    }
	    function falertMessage(msg,warning){
	    	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:0px;padding:10px;margin-bottom:0px;word-break:break-all;" class="alert ';
	    		s+= !!warning?"alert-danger":"alert-success";
	    		s+='" role="alert">'+
	    		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
	    		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
	    		msg+'</div>';
	    	return s;
	    } 
	    $scope.config = config;
	    
	    $timeout(function(){
	    	$scope.stream = new Stream(config);
	    	$("#i_stream_files_queue").hide();
	    	$("#streambtn").hide();
	    }, 400);
	    
	    $scope.upload = function() {
			$scope.stream.upload();
		};
	}
})
routeApp.controller('editPluginCtrl',function($rootScope, $scope, $state, $http,$modalInstance, $timeout, $translate, UtilService,HttpService,entity){
	$scope.plugin={};
	$scope.plugin.name = entity.name;
	$scope.plugin.title = entity.title;
	$scope.plugin.desc = entity.desc;
	$scope.plugin.id = entity.id;
	$scope.plugin.location = entity.location;
	$scope.plugin.enable = entity.enable;
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && $scope.form.$valid) {
            $scope.ok();
        }
    };
    $scope.ok=function(){
    	var plugin = angular.copy($scope.plugin);
    	var uri = "pluginMgr/plugin/"+plugin.id;
    	if(!plugin.title){
    		plugin.title = plugin.name;
    	}
    	if(!plugin.version){
    		plugin.version = "1.0";
    	}
    	HttpService.put(uri, plugin, $modalInstance);
    	
	};
    $scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
	$scope.stepValids = {
		      stepOneOver : function() {
		    	  if ($('#form1').val() === "true") {
		              return true;
		          }
		          return false;
		      },
	};
	$scope.nextCallBack = {
	    	"1" : function(){
	    		return false;
	    	}
	    }
})
routeApp.controller('upgradePluginCtrl',function($rootScope, $scope, $state, $http,$modalInstance, $timeout, $translate, UtilService,HttpService,entity){
	$scope.plugin=entity;
	$scope.hasUpload = false;
	$scope.ok=function(){
    	var plugin = angular.copy($scope.plugin);
    	var uri = "pluginMgr/plugin/"+plugin.id+"/file";
    	HttpService.put(uri, plugin, $modalInstance);
    	$("#i_select_files").show();
    	$("#i_stream_files_queue").hide();
		$("#streambtn").hide();
	};
	var size = Math.pow(1024,3) * 200;
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
			multipleFiles: false /** 多个文件一起上传, 默认: false */,
			retryCount : 2, /** HTML5上传失败的重试次数 */
			tokenURL : "pluginMgr/upload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
			frmUploadURL : "pluginMgr/upload/fd;", /** Flash上传的URI */
			uploadURL : "pluginMgr/upload/upload", /** HTML5上传的URI */
			swfURL : "swf/FlashUploader.swf",/** SWF文件的位置 */
			maxSize: size,/** 单个文件的最大大小200G，默认:2G */
			extFilters : ['.zip'], /**允许上传文件的类型**/
			checkFileName : false,/** 对文件名检测是否允许输入特殊字符，默认为true */
			postVarsPerFile:{id :$scope.plugin.id},  /** 上传文件时传入的参数* */
			onNameRegexMismatch: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoNameRegexMismatch',{value:file.name}), true);
			},
			onSelect : function(list) {
				var uploadFileName=list[0].name;
				var fileExt=uploadFileName.split('.');
				if(fileExt[fileExt.length-1]=='zip'){
					$("#i_select_files").hide();
					$("#i_stream_files_queue").show();
					$("#streambtn").show();
				}
				fShowMessage($translate.instant('uploadfile.uploadisoSelectFile',{value:list.length}));
			},
			onFileCountExceed : function(selected, limit) {
				fShowMessage($translate.instant('uploadfile.uploadisoFileCountExceed ',{value1:selected,value2:limit}), true);
			},
			onMaxSizeExceed : function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoMaxSizeExceed',{value1:file.name,value2:file.size,value3:file.limitSize}), true);
			},
			onExtNameMismatch: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoExtNameMismatch',{value1:file.name,value2:file.filters.toString()}), true);
			},
			onAddTask: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadisoAddTask',{value:file.name}));
			},
			onCancel : function(file) {
				$("#i_stream_files_queue").hide();
				$("#streambtn").hide();
				$("#i_select_files").show();
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
				var msgJson = jQuery.parseJSON(file.msg);
				if (typeof msgJson == 'string') {
					msgJson = jQuery.parseJSON(msgJson);
				}
				$scope.ok();
			},
			onQueueComplete : function(msg) {
				fShowMessage($translate.instant('uploadfile.uploadisoQueueComplete'));
			},
			onUploadError : function(status, msg) {
				var msgJson = jQuery.parseJSON(msg);
				if (typeof msgJson == 'string') {
					msgJson = jQuery.parseJSON(msgJson);
				}
				if (msg.success) {
                    fShowMessage(msgJson.message);
				} else {
				    fShowMessage(msgJson.message, true);
				}
			},
			onMaxSizeExceed: function(file) {
				fShowMessage($translate.instant('uploadfile.uploadFilesizeLimitError',{value1:file.name,value2:file.formatSize,value3:file.formatLimitSize}), true);
			}
			
	    };
    
    function fShowMessage(msg, warning) {
    	var o = document.getElementById("i_stream_message_container");
    	o && (o.innerHTML += (falertMessage(msg,warning))) && (o.scrollTop = o.scrollHeight);
    }
    function falertMessage(msg,warning){
    	var s = '<div style="margin-left:0px;margin-right:0px;margin-top:0px;padding:10px;margin-bottom:0px;word-break:break-all;" class="alert ';
    		s+= !!warning?"alert-danger":"alert-success";
    		s+='" role="alert">'+
    		'<button type="button" class="close" onclick="this.parentNode.remove()">'+
    		'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
    		msg+'</div>';
    	return s;
    } 
    $scope.config = config;
    
    $timeout(function(){
    	$scope.stream = new Stream(config);
    	$("#i_stream_files_queue").hide();
    	$("#streambtn").hide();
    }, 400);
    
    $scope.upload = function() {
		$scope.stream.upload();
	};
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
	
})

routeApp.controller('pluginNavigationCtrl',function($scope,$stateParams){
	$("#pluginIframe").attr("value","/cic/plugin/"+$scope.name+"/");
	$("#pluginIframe").attr("src",$scope.pluginHerf);
})

routeApp.controller('pluginInfoCtrl',function($scope,$stateParams){
	var url = "plugin/"+$scope.name+"/welcomepage.html"
	$.ajax({ 
    	url: url,
    	type:'get',
    	async:false,
    	cache:false,
    	success: function(result) {
    		$("#pluginIframe").attr("src",url);
    	},
    	error:function(){
    		$("#pluginIframe").hide();
    		$('#h').show();
    	}
    });
})