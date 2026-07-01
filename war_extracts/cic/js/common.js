/**
 {value:'
 */
//列表中给出title的模板。
var titleTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" title = {{row.entity[col.field]}}><span ng-cell-text >{{row.entity[col.field]}}</span></div>';
var titleByteFilterTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title="{{row.entity[col.field]|byteUnitRender}}" ><span ng-cell-text >{{row.entity[col.field]|byteUnitRender}}</span></div>';
var resultTemplate = '<div class="ngCellText" ng-class="col.colIndex()">'
	+'<span ng-if="row.entity[col.field]==1"><span class="icon-cancel-red successIcon" /><span class="cell-icon-text" translate="common.fail"/></span>'
	+'<span ng-if="row.entity[col.field]==0"><span class="icon-finish-green successIcon" /><span class="cell-icon-text" translate="common.success"/></span>'
	+'<span ng-if="row.entity[col.field]==2"><span class="icon-finish-green successIcon" /><span class="cell-icon-text" translate="common.partSuccess"/></span></div>';
var lineColor = [ 
              	'rgb(255,127,80)','rgb(135,206,250)','rgb(218,112,214)','rgb(50,205,50)','rgb(100,149,237)',
             	'rgb(255,105,180)','rgb(186,85,211)','rgb(205,92,92)','rgb(255,165,0)',	'rgb(64,224,208)',
             	'rgb(30,144,255)','rgb(255,99,71)',	'rgb(123,104,238)','rgb(0,250,154)','rgb(255,215,0)',
             	'rgb(107,142,35)','rgb(255,0,255)',	'rgb(60,179,113)','rgb(184,134,11)','rgb(48,224,224)'
 				    	];
var areaColor=  [ 
                	'rgba(255,127,80,0.7)','rgba(135,206,250,0.7)','rgba(218,112,214,0.7)','rgba(50,205,50,0.7)','rgba(100,149,237,0.7)',
                	'rgba(255,105,180,0.7)','rgba(186,85,211,0.7)','rgba(205,92,92,0.7)','rgba(255,165,0,0.7)',	'rgba(64,224,208,0.7)',
                	'rgba(30,144,255,0.7)','rgba(255,99,71,0.7)',	'rgba(123,104,238,0.3)','rgba(0,250,154,0.7)','rgba(255,215,0,0.7)',
                	'rgba(107,142,35,0.7)','rgba(255,0,255,0.7)',	'rgba(60,179,113,0.3)','rgba(184,134,11,0.7)','rgba(48,224,224,0.7)'
 		    	];
 var symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','emptycircle', 'emptyrect', 'emptyroundRect', 'emptytriangle', 'emptydiamond', 'emptypin', 'emptyarrow','emptyrect', 'emptyroundRect', 'emptytriangle', 'emptydiamond', 'emptypin', 'emptyarrow']
 
String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
};

String.prototype.startWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substr(0, s.length) == s)
		return true;
	else
		return false;
	return true;
};

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};

Array.prototype.unique = function() {
	var n = [];
	for(var i = 0; i < this.length; i++){
		if(n.indexOf(this[i]) == -1){
			n.push(this[i]);
		}
	}
	return n;
};

Array.prototype.contains = function(obj) {
	var i = this.length;
	while(i--){
		if(this[i] === obj){
			return true;
		}
	}
	return false;
}
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
}
Array.prototype.clear = function() {
	this.splice(0, this.length);
}

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) {
			return i;
		}
	}
	return -1;
}

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
}

//保留指定小数，并不四舍五入
Number.prototype.toFixedFloor = function(obj) {
	return Number(this.toString().substring(0, this.toString().indexOf('.') + obj + 1))
}

/**   
 * Simple Map   
 * var m = new Map();   
 * m.put('key','value');   
 */    
function Map() {     
    /** 存放键的数组*/    
    this.keys = new Array();     
    /** 存放数据 */    
    this.data = new Object();     
         
    /**   
     * 放入一个键值对 
     * @param {String} key   
     * @param {Object} value   
     */    
    this.put = function(key, value) {     
        if(this.data[key] == null){     
            this.keys.push(key);     
        }     
        this.data[key] = value;     
    };     
         
    /**   
     * 获取一个键值对
     * @param {String} key   
     * @return {Object} value   
     */    
    this.get = function(key) {     
        return this.data[key];     
    };     
         
    /**   
     * 移除一个键值对
     * @param {String} key   
     */    
    this.remove = function(key) {     
        this.keys.remove(key);     
        this.data[key] = null;     
    };     
         
    /**   
     * 遍历Map,执行处理函数    
     * @param {Function} 回调函数 function(key,value,index){..}   
     */    
    this.each = function(fn){     
        if(typeof fn != 'function'){     
            return;     
        }     
        var len = this.keys.length;     
        for(var i=0;i<len;i++){     
            var k = this.keys[i];     
            fn(k,this.data[k],i);     
        }     
    };     
         
    /**   
     * 获取键值数组（类似java的entrySet()）  
     * @return 键值对象｛key,value｝ 的数组  
     */    
    this.entrys = function() {     
        var len = this.keys.length;     
        var entrys = new Array(len);     
        for (var i = 0; i < len; i++) {     
            entrys[i] = {     
                key : this.keys[i],     
                value : this.data[i]     
            };     
        }     
        return entrys;     
    };     
         
    /**   
     * 判断是否为空
     */    
    this.isEmpty = function() {     
        return this.keys.length == 0;     
    };     
         
    /**   
     * 获取键值对数量  
     */    
    this.size = function(){     
        return this.keys.length;     
    };     
         
    /**   
     * 重写toString
     */    
    this.toString = function(){     
        var s = "{";     
        for(var i=0;i<this.keys.length;i++,s+=','){     
            var k = this.keys[i];     
            s += k+"="+this.data[k];     
        }     
        s+="}";     
        return s;     
    };
    
    this.clear = function() {
        this.keys = new Array();     
        this.data = new Object(); 
    }
}
/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}
function getDateNumber(year, week) {
	var now = new Date(year);
	var days = week*7;
	for (var i = 0;i < 12 ;i++) {
		var MonthDay = getMonthDays(year, i);
		if (MonthDay - days <= 0) {
			now.setMonth(i);
			now.setDate(days);
			break;
		} else {
			days = days - MonthDay;
		}
	}
	return now;
}
/**
 * 获取某年的某天是第几周
 * @param {Number} y
 * @param {Number} m
 * @param {Number} d
 * @returns {Number}
 */
function getWeekNumber(now) {
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
    //那一天是那一年中的第多少天
    for (var i = 0; i < month; i++) {
        days += getMonthDays(year, i);
    }

    //那一年第一天是星期几
    var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

    var week = null;
    if (yearFirstDay == 1) {
        week = Math.ceil(days / yearFirstDay);
    } else {
        days -= (7 - yearFirstDay + 1);
        week = Math.ceil(days / 7) + 1;
    }

    return week;
}
function getNumByKeycode(keycode) {
	var json = {
		"48" : 0,
		"49" : 1,
		"50" : 2,
		"51" : 3,
		"52" : 4,
		"53" : 5, 
		"54" : 6,
		"55" : 7,
		"56" : 8,
		"57" : 9,
		"96" : 0,
		"97" : 1,
		"98" : 2,
		"99" : 3,
		"100" : 4,
		"101" : 5, 
		"102" : 6,
		"103" : 7,
		"104" : 8,
		"105" : 9
	}
	if (keycode > 47 && keycode < 58) {
		return json[keycode];
	} else if (keycode > 95 && keycode < 106) {
		return json[keycode];
	}
}
function lazyPdfmake(func) {
	if (!window.pdfMake.vfs) {
    	setTimeout(function(){
    		lazyPdfmake(func);
    	}, 2000)
    } else {
    	func.apply(this);
    }
}
function getNoDataText(targetId, $translate){
	/*	'<div line-chart color-index=5 item-style="false" y-axis="value" style="width: 100%; height: 240px;">'
		+'<div class="altStyle" style="padding-left:190px;padding-top:75px;">' + $translate.instant('common.noData') + '</div></div>';*/
		var infoHtml = '<div line-chart color-index=5 item-style="false" y-axis="value" style="width: 100%; height: 100%;">'
			+'<div class="alterStyle">' + $translate.instant('common.noData') + '</div></div>';
		$("#" + targetId).html(infoHtml);
		var parentWidth = $("#" + targetId).width();
		var parentHeight = $("#" + targetId).height();
		/*$(".chartStyle").css("width", parentWidth + "px");
		$(".chartStyle").css("height", parentHeight - 50 + "px");*/
		$("#" + targetId+" .alterStyle").css("padding-left", parentWidth/2 - 30 + 'px');
		$("#" + targetId+" .alterStyle").css("padding-top", parentHeight/2+ 'px');
		//$("#" + targetId).css("min-height", 230  + "px");
	}
Date.prototype.Format = function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"H+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
};
//判断一个变量是否为 undefined null ''
function isEmpty(str) {
	if (typeof str == 'undefined' || str == null || (typeof str == 'string'&&str.trim() == '')) {
		return true;
	} else {
		return false;
	}
}
//获取选中框的label信息.value:select的value值，options是select的数组
function getSelectLabel(value, options) {
    if (!angular.isArray(options) || options.length == 0) {
        return "";
    }
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        if (value == option.value) {
            return option.label;
        }
    }
    return value;
}

//获取ng-grid分页显示的页面大小数组。5,10,15用于测试
function getPageSize() {
    return [5,10,15,50,100,500];
}
//checkbox勾选
function caschecked(checkboxId) {
    if (angular.isUndefined(checkboxId)) {
        return;
    }
    var ele = $('#' + checkboxId);
    if (angular.isUndefined(ele)) {
        return;
    }
    var children = ele.children();
    var box = children[1];
    if (angular.isDefined(box)) {
        box.click();
    }
}
//动态获取浏览器可显示区域的宽与高,用于根据不同的分辨率动态调整主要列表的大小
function getClientWidth() {
	return $(window).width();
}
function getClientHeight() {
	return $(window).height();
}
//传入一个scope，返回rootScope
function getRootScope(scope) {
	if (angular.isUndefined(scope) || angular.isUndefined(scope.$parent)) {
		return undefined;
	}
	var parent = scope.$parent;
	while (parent != null) {
		if (parent.$parent != null) {
			parent = parent.$parent;
		} else {	
			break;
		}		
	}
	return parent;
}
//用$root广播导航树节点的选中事件
function selectTreeNode(scope, url, type, source, id, event, key) {
	if (angular.isUndefined(scope) || angular.isUndefined(url) ||
			angular.isUndefined(type) || angular.isUndefined(source)) {
		console.error("need 5 params. $scope, url, nodetype, eventsource, entryid");
		return;
	}
	var rootScope = getRootScope(scope);
	var msg = {};
	msg.url = url;
    msg.entryId = type + '_' + id;
    //vmware的entryid组织方式与cvm不同
    if (key) {
        msg.entryId = key;
    }
    msg.entryType = type;
    msg.source = source;
    if (source == 'list') {
    	//事件源是列表的双击
    	rootScope.$broadcast('onNodeStateGo', msg);
    } else {
    	//事件源是导航树
        var e = 'onCloudNodeSelected';
        if (angular.isDefined(event)) {
            e = event;
        }
        rootScope.$broadcast(e, msg);
    }    
}
//find node data in catch
function getNodeData(data, entryId) {
	if (angular.isArray(data)) {
		for (var index in data) {
			var tempdata = data[index];
			if (angular.isUndefined(tempdata.entryId) || tempdata.entryId == null) {
				//the array end element is a function,so when get the function return null
				return null;
			}
			if (tempdata.entryId == entryId) {
				return tempdata;
			} else {
				if (angular.isUndefined(tempdata.nodes) || tempdata.nodes == null) {
					continue;
				}
				console.info('continue data: ' + tempdata.entryId);
				var res = getNodeData(tempdata.nodes, entryId);
				if (res == null) {
				   continue;	
				}
				return res;
			}
		}
	}
}
//根据entryId找到nodeId。参数：未被选中的主机或虚拟机节点的.没有找到返回-1
function getNodeId(nodes, entryId, entryType) {
    if (angular.isDefined(nodes) && angular.isArray(nodes)) {
        for (var i = 0; i < nodes.length; i++) {
            var data = nodes[i];
            // 只在相同类型的节点上找以提高性能
            if (angular.isUndefined(data.entryType) || data.entryType != entryType) {
                continue;
            }   
            if (data.entryId == entryId) {
                return data.nodeId;
            }
        }
    }
    return -1;
}
function getNodeIdByUrl(nodes, url) {
    if (angular.isDefined(nodes) && angular.isArray(nodes) && url != null) {
        for (x in nodes) {
            if (url == nodes[x].stateUrl) {
                return nodes[x].nodeId;
            }
        }
    }
    return -1;
}
//find index where data in parent's nodes
function getNodeIndex(nodes, entryId) {
    if (angular.isArray(nodes)) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].entryId == entryId) {
                return i;
            }
        }
    }
    return -1;
}
//set node other params
function setNodeParam(node) {
	node.nodes = null;
	node.selectable = true;
	node.state = {};
	node.state.checked = false;
	node.state.disabled = false;
	node.state.expanded = false;
	node.state.selected = false;
}

//队列机制 10567
function simpleQueueManager() {
	this.queueInterval = undefined;
	this.dataQueue = [];
	this.add = function(obj) {
		if(!obj) {
			return false;
	}
		this.dataQueue.push(obj);
		if (!this.queueInterval) {
			var self = this;
			this.queueInterval = setInterval(function() {
				if (self.empty()) {
					self.stop();
				} else {
					self.doNext();
				}
	
		}, 100)
	}
	};
	this.doNext = function() {
		this.dataQueue.shift().excute();
	};
	this.length = function() {
		return this.dataQueue.length;
	};
	this.empty = function() {
		return this.length() == 0;
	};
	this.stop = function() {
		clearInterval(this.queueInterval);
		this.queueInterval = null;
	}
}

var messageQueue = new simpleQueueManager();

function addWebsocketMessageToQueue(element, $rootScope, obj, $http, UtilService) {
    //需要实现 excute 方法
	function messageQueueObj(root, data, http, util) {
		this.root = root;
		this.data = data;
		this.http = http;
		this.util = util;
		this.excute = function() {
			handleWebsocketSuccessMessage(this.root, this.data, this.http, this.util);
		}
	};
	var queObj = new messageQueueObj($rootScope, obj, $http, UtilService);
	messageQueue.add(queObj);
}

//websocket消息进度到100时 处理方法
function handleWebsocketSuccessMessage($rootScope, obj, $http) {
	//刷新列表数据
	 // 45:克隆为模板 46：转换为模板 48:删除虚拟机模板
	 if (obj.eventType == constant.CLONE_VM_TEMPLET || obj.eventType == constant.CONVERT_TO_TEMPLET || 
			 obj.eventType == constant.DEL_VM_TEMPLET ||  obj.eventType == constant.EDIT_VM_TEMPLET) {
		 // 模板列表刷新 广播事件
		 $rootScope.$broadcast(constant.onQueryTemplate, obj);
	 } else if (obj.eventType == constant.ADD_CLOUD_NODE || 
			 obj.eventType == constant.EDIT_CLOUD_NODE
			 || obj.eventType == constant.DELETE_CLOUD_NODE) {
		 $rootScope.$broadcast(constant.onRefreshCloudNode);
	 } else if (obj.eventType == constant.ADD_DESKTOP_NODE || 
			 obj.eventType == constant.EDIT_DESKTOP_NODE
			 || obj.eventType == constant.DELETE_DESKTOP_NODE) {
		 $rootScope.$broadcast(constant.onRefreshDesktop);
	 } else if (obj.eventType == constant.ADD_ORG_NODE || 
			 obj.eventType == constant.EDIT_ORG_NODE
			 || obj.eventType == constant.DELETE_ORG_NODE) {
		 $rootScope.$broadcast(constant.onRefreshOrg);
	 } else if (obj.eventType == constant.IMPORT_USER) {
		 $rootScope.$broadcast(constant.onRefreshUserList);
	 } else if (obj.eventType == constant.SYNC_CLOUD_DOMAIN) {
		 if (obj.refreshData[0].type == 61) {
			 $rootScope.$broadcast(constant.onRefreshCloudOSVmList, obj.refreshData[0].value);
		 } else if (obj.refreshData[0].type == 18) {
			 $rootScope.$broadcast(constant.onRefreshCvmVmList, obj.refreshData[0].value);
		 } else if (obj.refreshData[0].type == 19) {
			 $rootScope.$broadcast(constant.onRefreshVmwareVmList, obj.refreshData[0].value);
		 } 
	 } else if (obj.eventType == constant.SYNC_ORG_TEMP) {
		 $rootScope.$broadcast(constant.onRefreshOrgVmTemplateList, obj.refreshData[0].value);
	 } else if (obj.eventType == constant.ADD_MONITOR_NODE || obj.eventType == constant.EDIT_MONITOR_NODE
			 || obj.eventType == constant.DELETE_MONITOR_NODE) {
		 // 增加修改删除监控面板刷新自定义监控管理界面
		 if (angular.isDefined(obj.user) && angular.isDefined($rootScope.loginInfo.loginName) &&
				 (obj.user == $rootScope.loginInfo.loginName || $rootScope.loginInfo.loginName == 'admin'
					 || obj.refreshData[0].operatorId == $rootScope.loginInfo.id)){
			 $rootScope.$broadcast(constant.onRefreshPerformanceMonitor);
		 }
	 }else if (obj.eventType == constant.REFRESH_RAINBOW) {
		 //刷新云彩虹界面
		 handlePublicCloudTaskEvent($rootScope, obj);
		 var refreshData  = obj.refreshData[0];
		 var data = new Array();
		 data.push(refreshData.srcCvm);
		 data.push(refreshData.dstCvm);
		 if(refreshData.cloudId){
			 data.push(refreshData.cloudId);
	 }
		 $rootScope.$broadcast(constant.onReloadVmList, data);
	 }
	 handleNavTree($rootScope, obj, $http);
}
//任务台任务成功时执行该方法。
function handleNavTree($rootScope, obj, $http) {
	 //云资源
	 handleCloudNodeTaskEvent($rootScope, obj, $http);
	 
	 //虚拟机
	 handleVmTaskEvent($rootScope, obj, $http);
	 
	 //虚拟桌面池
	 handleDesktopTaskEvent($rootScope, obj, $http);
	 
	 //组织
	 handleOrgTaskEvent($rootScope, obj, $http);
	 
	 //资源池
	 handleResourcePoolTaskEvent($rootScope, obj, $http);
	 
	 //集群
	 handleClusterTaskEvent($rootScope, obj, $http);
	 //自定义监控
	 handleMonitorNodeTaskEvent($rootScope, obj, $http);
	 //CIC备份
	 handleCICBackupHistoryRefreshEvent($rootScope, obj, $http);
}

function handleCloudNodeTaskEvent(rootScope, entity, http) {
	var msg = {};
	if (entity.eventType == constant.ADD_CLOUD_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = "add";
		msg.node = entry;
		setNodeParam(msg.node);//set must value
	} else if (entity.eventType == constant.EDIT_CLOUD_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = 'update';
		msg.nodeType = entry.entryType;
		msg.nodeTypeId = entry.entryId;
		//修改显示名称
		msg.text = entry.text;
		msg.entryId = entry.id;
	} else if (entity.eventType == constant.DELETE_CLOUD_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = 'delete';
		msg.nodeType = entry.entryType;
        msg.nodeTypeId = entry.entryId;
	} 
	rootScope.$broadcast("onCloudNodeChange", msg);
}

function handleOrgTaskEvent(rootScope, entity, http) {
	var msg = {};
	if (entity.eventType == constant.ADD_ORG_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = "add";
		msg.parentNodeType = 'orgMng';
        msg.parentNodeId = 'orgMng_' + 515;
		msg.node = entry;
		setNodeParam(msg.node);
	}  else if (entity.eventType == constant.DELETE_ORG_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = 'delete';
		msg.nodeType = 'org';
		msg.nodeTypeId = 'org_' + entry.id;
	} 
	rootScope.$broadcast(constant.onVDCNodeChange, msg);
	rootScope.$broadcast(constant.onRefreshOrgList, msg);
}
function handleResourcePoolTaskEvent(rootScope, entity, http) {
	var msg = {};
	if (entity.eventType == constant.ADD_RESOURCEPOOL_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = "add";
        msg.parentNodeType = 'resourcePoolMng';
        msg.parentNodeId = 'resourcePoolMng_' + 518;
		msg.node = entry;
		setNodeParam(msg.node);
		rootScope.$broadcast(constant.onVDCNodeChange, msg);		
	}  else if (entity.eventType == constant.DELETE_RESOURCEPOOL_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = 'delete';
		msg.nodeType = entry.entryType;
        msg.nodeTypeId = entry.entryId;
        rootScope.$broadcast(constant.onVDCNodeChange, msg);
	} else {
		rootScope.$broadcast(constant.onRefreshResourcePool, {});
	}
}
function handleMonitorNodeTaskEvent(rootScope, entity, http) {
	if (angular.isDefined(entity.user) && angular.isDefined(rootScope.loginInfo.loginName) &&
			 (entity.user == rootScope.loginInfo.loginName || rootScope.loginInfo.loginName == 'admin'
				 || entity.refreshData[0].operatorId == rootScope.loginInfo.id)){
		var msg = {};
		if (entity.eventType == constant.ADD_MONITOR_NODE) {
			//500:增加监控面板
			var entry  = entity.refreshData[0].entry;
			msg.type = "add";
			msg.parentNodeType = 'performance_monitor';
			msg.parentNodeId = 'performance_monitor_' + 51;
			msg.node = entry;
			setNodeParam(msg.node);//set must value
		} else if (entity.eventType == constant.EDIT_MONITOR_NODE) {
			//501:修改监控面板
			var entry  = entity.refreshData[0].entry;
			msg.type = 'update';
			msg.nodeType = 'performance_monitor_node';
			msg.nodeTypeId = 'performance_monitor_node_' + entry.id;
			//修改显示名称
			msg.text = entry.text;
			msg.entryId = entry.id;
		} else if (entity.eventType == constant.DELETE_MONITOR_NODE) {
			//502:删除监控面板
			var entry  = entity.refreshData[0].entry;
			msg.type = 'delete';
			msg.nodeType = 'performance_monitor_node';
			msg.nodeTypeId = 'performance_monitor_node_' + entry.id;
		} 
		rootScope.$broadcast("onMonitorNodeChange", msg);
	}
}
function handleDesktopTaskEvent(rootScope, entity, http) {
	var msg = {};
	if (entity.eventType == constant.ADD_DESKTOP_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = "add";
		msg.parentNodeType = 'desktop_mng';
		msg.parentNodeId = 'desktop_mng_' + 517;
		msg.node = entry;
		setNodeParam(msg.node);//set must value
	} else if (entity.eventType == constant.EDIT_DESKTOP_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = 'update';
		msg.nodeType = 'desktop';
		msg.nodeTypeId = 'desktop_' + entry.id;
		//修改显示名称
		msg.text = entry.text;
		msg.entryId = entry.id;
		//刷新概要界面
		rootScope.$broadcast(constant.onRefreshDesktopSummary, msg);
	} else if (entity.eventType == constant.DELETE_DESKTOP_NODE) {
		var entry  = entity.refreshData[0].entry;
		msg.type = 'delete';
		msg.nodeType = 'desktop';
		msg.nodeTypeId = 'desktop_' + entry.id;
	} 
	rootScope.$broadcast(constant.onVDCNodeChange, msg);
}

//用于处理任务栏中的虚拟机事件.rootScope:用于广播事件。row任务栏行数据实体
function handleVmTaskEvent(rootScope, entity, http) {
	var msg = {};
	if (entity.eventType == constant.DEL_VM || entity.eventType == constant.MIGRATE_VM || entity.eventType == constant.CLONE_VM
			|| (entity.eventType >= constant.RUN_VM && entity.eventType <= constant.SLEEP_VM) || entity.eventType == constant.DEPLOY_VM 
			|| (entity.eventType >= constant.BATCH_RUN_VM && entity.eventType <=constant.BATCH_SLEEP_VM) || entity.eventType == constant.CONVERT_TO_TEMPLET) {
		rootScope.$broadcast(constant.onReloadVmList, entity);//刷新虚拟机列表
		if (entity.eventType >= constant.RUN_VM && entity.eventType <= constant.SLEEP_VM) {
			handlePublicCloudTaskEvent(rootScope, entity);
		}
	} else if (entity.eventType == constant.SNAPSHOT_VM || entity.eventType == constant.DEL_SNAPSHOT ||
			entity.eventType == constant.RESUME_FROM_SNAPSHOT) {
		 //snapshot vm mng: onRefreshSnapshot
		 rootScope.$broadcast('onRefreshSnapshot');
		 //clear selected node
		 rootScope.$broadcast('onClearSnapNode');
		 rootScope.$broadcast(constant.onReloadVmList, entity);//刷新虚拟机列表
	 } else if (entity.eventType == constant.IMPORT_HISTORY || entity.eventType == constant.BACKUP_VM) {
		 rootScope.$broadcast(constant.onQueryBackupFileList);
	 } else if (entity.eventType == constant.ADD_VM) {
	     if (entity.refreshData && entity.refreshData[0] && entity.refreshData[0].cloudType == constant.PUBLIC_CLOUD_VMWARE) {
             rootScope.$broadcast(constant.onReloadVmwareVmList, entity.refreshData[0]);//刷新VMware虚拟机列表
	     }
	 } else if (entity.eventType == constant.OPERATE_CLOUDOS_VM) {
		 rootScope.$broadcast(constant.onReloadVmList, entity);
		 rootScope.$broadcast(constant.onRefreshCloudOSVmList, entity.refreshData[0].value);
	 }
}
//处理集群事件
function handleClusterTaskEvent(rootScope, entity, http) {
    if (entity.eventType == constant.VMWARE_HA || entity.eventType == constant.VMWARE_DRS) {
        if (entity.refreshData && entity.refreshData[0] && entity.refreshData[0].cloudType == constant.PUBLIC_CLOUD_VMWARE) {
            rootScope.$broadcast(constant.onReloadVmwareClusterSummary, entity.refreshData[0]);//刷新VMware集群概要
        }
    }
}

//刷新备份历史界面
function handleCICBackupHistoryRefreshEvent(rootScope, entity, http) {
    if (entity.eventType == constant.NULL_ACTION) {
        var datas  = entity.refreshData;
        if (angular.isArray(datas)) {
            for (var i = 0 ; i < datas.length ; i++) {
                var refreshData = datas[i];
                switch (refreshData.type) {
                case 50:
                    rootScope.$broadcast("onQueryBackUpStrategyHistory");//刷新备份历史界面
                    break;
                }
            }
        
        }
    } else if (entity.eventType == constant.BACKUP_CIC_IMPORT) {
        rootScope.$broadcast("onQueryBackUpStrategyHistory");//刷新备份历史界面
    }
}

//操作系统版本列表
function getWindowsVersions(translate) {
	return [{value:'Microsoft Windows Server 2016(64-bit)', label:translate.instant('Microsoft Windows Server 2016(64-bit)')},
	        {value:'Microsoft Windows Server 2012 R2', label:translate.instant('Microsoft Windows Server 2012 R2')},
	        {value:'Microsoft Windows Server 2012', label:translate.instant('Microsoft Windows Server 2012')}, 
            {value:'Microsoft Windows Server 2008 R2(64-bit)', label:translate.instant('Microsoft Windows Server 2008 R2(64-bit)')}, 
            {value:'Microsoft Windows Server 2008(64-bit)', label:translate.instant('Microsoft Windows Server 2008(64-bit)')}, 
            {value:'Microsoft Windows Server 2008(32-bit)', label:translate.instant('Microsoft Windows Server 2008(32-bit)')}, 
            {value:'Microsoft Windows Server 2003 R2(64-bit)', label:translate.instant('Microsoft Windows Server 2003 R2(64-bit)')}, 
            {value:'Microsoft Windows Server 2003 R2(32-bit)', label:translate.instant('Microsoft Windows Server 2003 R2(32-bit)')}, 
            {value:'Microsoft Windows Server 2003(64-bit)', label:translate.instant('Microsoft Windows Server 2003(64-bit)')}, 
            {value:'Microsoft Windows Server 2003(32-bit)', label:translate.instant('Microsoft Windows Server 2003(32-bit)')}, 
            {value:'Microsoft Windows 10(64-bit)', label:translate.instant('Microsoft Windows 10(64-bit)')}, 
            {value:'Microsoft Windows 10(32-bit)', label:translate.instant('Microsoft Windows 10(32-bit)')},
            {value:'Microsoft Windows 8.1(64-bit)', label:translate.instant('Microsoft Windows 8.1(64-bit)')}, 
            {value:'Microsoft Windows 8.1(32-bit)', label:translate.instant('Microsoft Windows 8.1(32-bit)')}, 
            {value:'Microsoft Windows 8(64-bit)', label:translate.instant('Microsoft Windows 8(64-bit)')}, 
            {value:'Microsoft Windows 8(32-bit)', label:translate.instant('Microsoft Windows 8(32-bit)')}, 
            {value:'Microsoft Windows 7(64-bit)', label:translate.instant('Microsoft Windows 7(64-bit)')}, 
            {value:'Microsoft Windows 7(32-bit)', label:translate.instant('Microsoft Windows 7(32-bit)')}, 
            {value:'Microsoft Windows Vista(64-bit)', label:translate.instant('Microsoft Windows Vista(64-bit)')}, 
            {value:'Microsoft Windows Vista(32-bit)', label:translate.instant('Microsoft Windows Vista(32-bit)')}, 
            {value:'Microsoft Windows XP Professional(64-bit)', label:translate.instant('Microsoft Windows XP Professional(64-bit)')}, 
            {value:'Microsoft Windows XP Professional(32-bit)', label:translate.instant('Microsoft Windows XP Professional(32-bit)')}];
}
function getLinuxVersions(translate) {
	return [{value:'Red Hat Enterprise Linux 7(64-bit)', label:translate.instant('Red Hat Enterprise Linux 7(64-bit)')},
            {value:'Red Hat Enterprise Linux 7(32-bit)', label:translate.instant('Red Hat Enterprise Linux 7(32-bit)')},
            {value:'Red Hat Enterprise Linux 6(64-bit)', label:translate.instant('Red Hat Enterprise Linux 6(64-bit)')},
            {value:'Red Hat Enterprise Linux 6(32-bit)', label:translate.instant('Red Hat Enterprise Linux 6(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.10(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.10(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.10(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.10(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.9(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.9(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.9(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.9(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.8(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.8(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.8(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.8(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.7(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.7(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.7(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.7(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.6(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.6(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.6(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.6(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.5(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.5(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.5(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.5(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.4(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.4(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.4(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.4(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.3(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.3(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.3(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.3(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.2(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.2(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.2(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.2(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.1(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.1(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.1(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.1(32-bit)')},
            {value:'Red Hat Enterprise Linux 5.0(64-bit)', label:translate.instant('Red Hat Enterprise Linux 5.0(64-bit)')},
            {value:'Red Hat Enterprise Linux 5.0(32-bit)', label:translate.instant('Red Hat Enterprise Linux 5.0(32-bit)')},
            {value:'Red Hat Enterprise Linux 4(64-bit)', label:translate.instant('Red Hat Enterprise Linux 4(64-bit)')},
            {value:'Red Hat Enterprise Linux 4(32-bit)', label:translate.instant('Red Hat Enterprise Linux 4(32-bit)')},
            {value:'Red Hat Enterprise Linux 3(64-bit)', label:translate.instant('Red Hat Enterprise Linux 3(64-bit)')},
            {value:'Red Hat Enterprise Linux 3(32-bit)', label:translate.instant('Red Hat Enterprise Linux 3(32-bit)')},
            {value:'Red Hat Enterprise Linux 2.1', label:translate.instant('Red Hat Enterprise Linux 2.1')},
            {value:'Novell SUSE Linux Enterprise 12(64-bit)', label:translate.instant('Novell SUSE Linux Enterprise 12(64-bit)')},
            {value:'Novell SUSE Linux Enterprise 11(64-bit)', label:translate.instant('Novell SUSE Linux Enterprise 11(64-bit)')},
            {value:'Novell SUSE Linux Enterprise 11(32-bit)', label:translate.instant('Novell SUSE Linux Enterprise 11(32-bit)')},
            {value:'Novell SUSE Linux Enterprise 10(64-bit)', label:translate.instant('Novell SUSE Linux Enterprise 10(64-bit)')},
            {value:'Novell SUSE Linux Enterprise 10(32-bit)', label:translate.instant('Novell SUSE Linux Enterprise 10(32-bit)')},
            {value:'Novell SUSE Linux Enterprise 8/9(64-bit)', label:translate.instant('Novell SUSE Linux Enterprise 8/9(64-bit)')},
            {value:'Novell SUSE Linux Enterprise 8/9(32-bit)', label:translate.instant('Novell SUSE Linux Enterprise 8/9(32-bit)')},
            {value:'SUSE openSUSE(64-bit)', label:translate.instant('SUSE openSUSE(64-bit)')},
            {value:'SUSE openSUSE(32-bit)', label:translate.instant('SUSE openSUSE(32-bit)')},
            {value:'CentOS 6/7(64-bit)', label:translate.instant('CentOS 6/7(64-bit)')},
            {value:'CentOS 6/7(32-bit)', label:translate.instant('CentOS 6/7(32-bit)')},
            {value:'CentOS 5.10(64-bit)', label:translate.instant('CentOS 5.10(64-bit)')},
            {value:'CentOS 5.10(32-bit)', label:translate.instant('CentOS 5.10(32-bit)')},
            {value:'CentOS 5.9(64-bit)', label:translate.instant('CentOS 5.9(64-bit)')},
            {value:'CentOS 5.9(32-bit)', label:translate.instant('CentOS 5.9(32-bit)')},
            {value:'CentOS 5.8(64-bit)', label:translate.instant('CentOS 5.8(64-bit)')},
            {value:'CentOS 5.8(32-bit)', label:translate.instant('CentOS 5.8(32-bit)')},
            {value:'CentOS 5.7(64-bit)', label:translate.instant('CentOS 5.7(64-bit)')},
            {value:'CentOS 5.7(32-bit)', label:translate.instant('CentOS 5.7(32-bit)')},
            {value:'CentOS 5.6(64-bit)', label:translate.instant('CentOS 5.6(64-bit)')},
            {value:'CentOS 5.6(32-bit)', label:translate.instant('CentOS 5.6(32-bit)')},
            {value:'CentOS 5.5(64-bit)', label:translate.instant('CentOS 5.5(64-bit)')},
            {value:'CentOS 5.5(32-bit)', label:translate.instant('CentOS 5.5(32-bit)')},
            {value:'CentOS 5.4(64-bit)', label:translate.instant('CentOS 5.4(64-bit)')},
            {value:'CentOS 5.4(32-bit)', label:translate.instant('CentOS 5.4(32-bit)')},
            {value:'CentOS 5.3(64-bit)', label:translate.instant('CentOS 5.3(64-bit)')},
            {value:'CentOS 5.3(32-bit)', label:translate.instant('CentOS 5.3(32-bit)')},
            {value:'CentOS 5.2(64-bit)', label:translate.instant('CentOS 5.2(64-bit)')},
            {value:'CentOS 5.2(32-bit)', label:translate.instant('CentOS 5.2(32-bit)')},
            {value:'CentOS 5.1(64-bit)', label:translate.instant('CentOS 5.1(64-bit)')},
            {value:'CentOS 5.1(32-bit)', label:translate.instant('CentOS 5.1(32-bit)')},
            {value:'CentOS 5.0(64-bit)', label:translate.instant('CentOS 5.0(64-bit)')},
            {value:'CentOS 5.0(32-bit)', label:translate.instant('CentOS 5.0(32-bit)')},
            {value:'CentOS 4(64-bit)', label:translate.instant('CentOS 4(64-bit)')},
            {value:'CentOS 4(32-bit)', label:translate.instant('CentOS 4(32-bit)')},
            {value:'Debian GUN/Linux 8(64-bit)', label:translate.instant('Debian GUN/Linux 8(64-bit)')},
            {value:'Debian GUN/Linux 8(32-bit)', label:translate.instant('Debian GUN/Linux 8(32-bit)')},
            {value:'Debian GUN/Linux 7(64-bit)', label:translate.instant('Debian GUN/Linux 7(64-bit)')},
            {value:'Debian GUN/Linux 7(32-bit)', label:translate.instant('Debian GUN/Linux 7(32-bit)')},
            {value:'Debian GUN/Linux 6(64-bit)', label:translate.instant('Debian GUN/Linux 6(64-bit)')},
            {value:'Debian GUN/Linux 6(32-bit)', label:translate.instant('Debian GUN/Linux 6(32-bit)')},
            {value:'Debian GUN/Linux 5(64-bit)', label:translate.instant('Debian GUN/Linux 5(64-bit)')},
            {value:'Debian GUN/Linux 5(32-bit)', label:translate.instant('Debian GUN/Linux 5(32-bit)')},
            {value:'Debian GUN/Linux 4(64-bit)', label:translate.instant('Debian GUN/Linux 4(64-bit)')},
            {value:'Debian GUN/Linux 4(32-bit)', label:translate.instant('Debian GUN/Linux 4(32-bit)')},
            {value:'Red Flag Asianux Server 7(64-bit)', label:translate.instant('Red Flag Asianux Server 7(64-bit)')},
            {value:'Red Flag Asianux Server 4.5(64-bit)', label:translate.instant('Red Flag Asianux Server 4.5(64-bit)')},
            {value:'Red Flag Asianux Server 4(64-bit)', label:translate.instant('Red Flag Asianux Server 4(64-bit)')},
            {value:'Red Flag Asianux Server 4(32-bit)', label:translate.instant('Red Flag Asianux Server 4(32-bit)')},
            {value:'Red Flag Asianux Server 3(64-bit)', label:translate.instant('Red Flag Asianux Server 3(64-bit)')},
            {value:'Red Flag Asianux Server 3(32-bit)', label:translate.instant('Red Flag Asianux Server 3(32-bit)')},
            {value:'Red Flag Asianux Server 2(64-bit)', label:translate.instant('Red Flag Asianux Server 2(64-bit)')},
            {value:'Red Flag Asianux Server 2(32-bit)', label:translate.instant('Red Flag Asianux Server 2(32-bit)')},
            {value:'Deepin 15(64-bit)', label:translate.instant('Deepin 15(64-bit)')},
            {value:'Deepin 15(32-bit)', label:translate.instant('Deepin 15(32-bit)')},
            {value:'Oracle Linux 7(64-bit)', label:translate.instant('Oracle Linux 7(64-bit)')},
            {value:'Oracle Linux 7(32-bit)', label:translate.instant('Oracle Linux 7(32-bit)')},
            {value:'Oracle Linux 6.8(64-bit)', label:translate.instant('Oracle Linux 6.8(64-bit)')},
            {value:'Oracle Linux 6.8(32-bit)', label:translate.instant('Oracle Linux 6.8(32-bit)')},
            {value:'Oracle Linux 6.7(64-bit)', label:translate.instant('Oracle Linux 6.7(64-bit)')},
            {value:'Oracle Linux 6.7(32-bit)', label:translate.instant('Oracle Linux 6.7(32-bit)')},
            {value:'Oracle Linux 6.6(64-bit)', label:translate.instant('Oracle Linux 6.6(64-bit)')},
            {value:'Oracle Linux 6.6(32-bit)', label:translate.instant('Oracle Linux 6.6(32-bit)')},
            {value:'Oracle Linux 6.5(64-bit)', label:translate.instant('Oracle Linux 6.5(64-bit)')},
            {value:'Oracle Linux 6.5(32-bit)', label:translate.instant('Oracle Linux 6.5(32-bit)')},
            {value:'Oracle Linux 6.4(64-bit)', label:translate.instant('Oracle Linux 6.4(64-bit)')},
            {value:'Oracle Linux 6.4(32-bit)', label:translate.instant('Oracle Linux 6.4(32-bit)')},
            {value:'Oracle Linux 6.3(64-bit)', label:translate.instant('Oracle Linux 6.3(64-bit)')},
            {value:'Oracle Linux 6.3(32-bit)', label:translate.instant('Oracle Linux 6.3(32-bit)')},
            {value:'Oracle Linux 6.2(64-bit)', label:translate.instant('Oracle Linux 6.2(64-bit)')},
            {value:'Oracle Linux 6.2(32-bit)', label:translate.instant('Oracle Linux 6.2(32-bit)')},
            {value:'Oracle Linux 6.1(64-bit)', label:translate.instant('Oracle Linux 6.1(64-bit)')},
            {value:'Oracle Linux 6.1(32-bit)', label:translate.instant('Oracle Linux 6.1(32-bit)')},
            {value:'Oracle Linux 6.0(64-bit)', label:translate.instant('Oracle Linux 6.0(64-bit)')},
            {value:'Oracle Linux 6.0(32-bit)', label:translate.instant('Oracle Linux 6.0(32-bit)')},
            {value:'Oracle Linux 4/5(64-bit)', label:translate.instant('Oracle Linux 4/5(64-bit)')},
            {value:'Oracle Linux 4/5(32-bit)', label:translate.instant('Oracle Linux 4/5(32-bit)')},
            {value:'Ubuntu Linux(64-bit)', label:translate.instant('Ubuntu Linux(64-bit)')},
            {value:'Ubuntu Linux(32-bit)', label:translate.instant('Ubuntu Linux(32-bit)')},
            {value:'Fedora 23(64-bit)', label:translate.instant('Fedora 23(64-bit)')},
            {value:'Fedora 22(64-bit)', label:translate.instant('Fedora 22(64-bit)')},
            {value:'Fedora 21(64-bit)', label:translate.instant('Fedora 21(64-bit)')},
            {value:'Fedora 20(64-bit)', label:translate.instant('Fedora 20(64-bit)')},
            {value:'Fedora 17(64-bit)', label:translate.instant('Fedora 17(64-bit)')},
            {value:'Fedora 15(64-bit)', label:translate.instant('Fedora 15(64-bit)')},
            {value:'Fedora 11(64-bit)', label:translate.instant('Fedora 11(64-bit)')},
            {value:'Fedora 10(32-bit)', label:translate.instant('Fedora 10(32-bit)')},
            {value:'Fedora 9(32-bit)', label:translate.instant('Fedora 9(32-bit)')},
            {value:'Fedora 8(32-bit)', label:translate.instant('Fedora 8(32-bit)')},
            //增加中标麒麟服务器版
            {value:'zhongbiaoV7OS64',label:translate.instant('zhongbiaoV7OS64')},
            {value:'zhongbiaoV6OS64',label:translate.instant('zhongbiaoV6OS64')},
            {value:'zhongbiaoV6OS32',label:translate.instant('zhongbiaoV6OS32')},
            //增加中标麒麟桌面版v5
            {value:'zhongbiaoV5OS32',label:translate.instant('zhongbiaoV5OS32')},
            //中标普华v4
            {value:'neoShineDeskV4OS32',label:translate.instant('neoShineDeskV4OS32')},
            {value:'neoShineServerV4OS64',label:translate.instant('neoShineServerV4OS64')},
            {value:'neoShineServerV3OS64',label:translate.instant('neoShineServerV3OS64')},
            {value:'linxTech64',label:translate.instant('linxTech64')},
            {value:'linxTech32',label:translate.instant('linxTech32')},
            {value:'yiminServersOS64',label:translate.instant(translate.instant('yiminServersOS64'))},
            {value:'yiminServersOS32',label:translate.instant(translate.instant('yiminServersOS32'))},
            //CAS
            {value:'cvmCasOS64',label:translate.instant(translate.instant('cvmCasOS64'))},
            {value:'Other Linux(64-bit)', label:translate.instant('Other Linux(64-bit)')},
            {value:'Other Linux(32-bit)', label:translate.instant('Other Linux(32-bit)')}];
}

//删除数组中选定元素
function delSelEleInArray(selArray,objArray){
	 for (var i=0; i < selArray.length; i++) {
         var item = selArray[i];
         var index = -1;
         for (var j = 0; j < objArray.length; j++) {
             if (objArray[j].value == item) {
                 index = j;
             }
         }
         if (index >= 0) {
        	 objArray.splice(index, 1);
         }
     }
}
//增加字符串中获取字符串占用宽度的实例方法
String.prototype.getWidth = function(fontSize)  
{  
    var span = document.getElementById("__getwidth");  
    if (span == null) {  
        span = document.createElement("span");  
        span.id = "__getwidth";  
        document.body.appendChild(span);  
        span.style.visibility = "hidden";  
        span.style.whiteSpace = "nowrap";  
    }  
    span.textContent = this;  //FireFox不支持innerText属性，FF/GG核心都支持textContent属性 
    span.style.fontSize = fontSize + "px";  
  
    return span.offsetWidth;  
};
function printTable(printConfig) {
	   var config = {
				title: '*',
				message: '',
				header: true,
				autoPrint: true,
				customize: null	
	   };
	   var _relToAbs = function(el) {
	    	var clone = $(el).clone()[0];
	    	var linkHost;
	    	var _link = document.createElement( 'a' );
	    	if ( clone.nodeName.toLowerCase() === 'link' ) {
	    		_link.href = clone.href;
	    		linkHost = _link.host;

	    		// IE doesn't have a trailing slash on the host
	    		// Chrome has it on the pathname
	    		if (_link.pathname.indexOf('buttons') != -1) { //只取buttons下的CSS
	        		if ( linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
	        			linkHost += '/';
	        		}
	        		clone.href = _link.protocol+"//"+linkHost+_link.pathname+_link.search;
	    		}
	    	}
	    	return clone.outerHTML;
		};
		var data = printConfig.data;
		var addHeader = function (header) {
			var str = '<tr>';
			for ( var i=0, ien=header.length ; i<ien ; i++ ) {
				var widthNum = data.header[i].width;
				//控制列表宽度
				if (widthNum != null) {
					str += '<th width="' + widthNum + '">'+ header[i].displayName +'</th>';
				} else {
					str += '<th width="">'+ header[i].displayName +'</th>';
				}
				
			}
			return str + '</tr>';
		};
		
		var addRowData = function (rowData) {
			var str = '<tr>';
			//取头个数拼装数据
			for ( var i=0, ien= data.header.length ; i<ien ; i++ ) {
				var key = data.header[i].field;
				//若有cellTemplate，优先使用其方法
				var cellTemplate = data.header[i].cellTemplate;
				//if (rowData[key] != null) {
					//if (typeof cellTemplate === 'function') {
				if (cellTemplate != null) {
					str += '<td>'+ cellTemplate(rowData, key) +'</td>';
				} else {
					if (rowData[key] != null) {
					    str += '<td>'+rowData[key]+'</td>';
					} else {
						str += '<td></td>';
					}
				}
			} 
			return str + '</tr>';
		};

		// Construct a table for printing
		var html = '<table class="display dataTable" style="text-align:left;font-size:12px;word-break:break-all;word-wrap:break-word;">';

		if (config.header) {
			html += '<thead>'+ addHeader(data.header) +'</thead>';
		}

		html += '<tbody>';
		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			html += addRowData(data.body[i]);
		}
		html += '</tbody>';
		// Open a new window for the printable table
		var win = window.open( '', '' );
		var title = config.title.replace( '*', $('title').text() );
		win.document.close();
		// Inject the title and also a copy of the style and link tags from this
		// document so the table can retain its base styling. Note that we have
		// to use string manipulation as IE won't allow elements to be created
		// in the host document and then appended to the new window.
		var head = '<title>'+title+'</title>';
		$('style, link').each( function () {
			head += _relToAbs( this );
		} );
		$(win.document.head).html(head);
		// Inject the table and other surrounding information
		$(win.document.body).html(
		    //'<h1>'+title+'</h1>'+
			'<div>'+config.message+'</div>'+
			html
		);
		/*if ( config.customize ) {
			config.customize( win );
		}*/
		
		setTimeout( function () {
			if ( config.autoPrint ) {
				win.print(); // blocking - so close will not
				win.close(); // execute until this is done
			}
		}, 250 );
}

//导出报表
function exportPdf4Img(pdfConfig) {
	var urlArr = pdfConfig.urlArry;
	if (urlArr.length <= 0) {
		return;
	}
	var header = '';
	if (pdfConfig.targetName) {
		header = pdfConfig.targetName;
	}
	var content = [];
	for (var i = 0; i < urlArr.length; i++) {
		if (i == 0 || i % 2 != 0)
            content.push({image : urlArr[i], fit:[500,800], margin: [ 0, 10, 0, 10 ]})
        else
            content.push({image : urlArr[i], fit:[500,800], margin: [ 0, 10, 0, 10  ], pageBreak : 'before'}) 
	}
	var docDefinition = {
		header: header,
		content: content,
		defaultStyle: {
			font: 'msyh',
			fontSize: 10
		}
	}
	var funcPdfmake = function() {
		pdfMake.fonts = {
				msyh: {
					normal: 'msyh.ttf'
				}
		};
		
		var pdf = window.pdfMake.createPdf( docDefinition );
		pdf.download(pdfConfig.fileName);
	}
	lazyPdfmake(funcPdfmake);
}
//导出pdf文件
function exportPdf(config) {
	var data = config.data;
	var rows = [];
	var widths = [];
	if ( data.header ) {
		rows.push( $.map( data.header, function ( d ) {
			var result = {text: typeof d.displayName === 'string' ? d.displayName : d.displayName + '', width:d.width, style: 'tableHeader' };
			return result;
		} ) );
	}
	//填充表格的列框
	for (var i = 0; i < data.header.length; i++) {
		widths.push(data.header[i].width);
	}
	

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var srows = [];
		
		for ( var j=0; j < data.header.length; j++ ) {
			var key = data.header[j].field;
			//若有cellTemplate，优先使用其方法
			var cellTemplate = data.header[j].cellTemplate;
			var d;
			if (cellTemplate != null) {
				d = cellTemplate(data.body[i], key);
			} else {
				d = data.body[i][key] == null ? '' : data.body[i][key];
			}
			if (config.hasChildren) {//若为树形数据
				var isChildren = data.body[i]["parent_uid"];
				if (isChildren != null) {//若是子节点
					srows.push({text: typeof d === 'string' ? d : d+'', style: i % 2 ? 'tableBodyChildrenEven' : 'tableBodyChildrenOdd'});
				} else {
					srows.push({text: typeof d === 'string' ? d : d+'', style: i % 2 ? 'tableBodyParentEven' : 'tableBodyParentOdd'});
				}
			} else {
				srows.push({text: typeof d === 'string' ? d : d+'', style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'});
			}
		}
		
		rows.push(srows);
	}
	


	if ( config.footer ) {
		rows.push( $.map( data.footer, function ( d ) {
			return {
				text: typeof d === 'string' ? d : d+'',
				style: 'tableFooter'
			};
		} ) );
	}

	var doc = {
		pageSize: 'A3',
		pageOrientation: config.orientation,
		content: [
			{
				table: {
					widths: widths,
					headerRows: 1,
					body: rows
				},
				layout: 'noBorders'
			}
		],
		styles: {
			tableHeader: {
				bold: false,
				fontSize: 10,
				color: 'white',
				fillColor: '#436BB3',
				alignment: 'center'
			},
			tableBodyEven: {
				bold: false,
				fontSize: 9,
				alignment: 'center'
			},
			tableBodyParentEven: {
				bold: false,
				margin:[20,0,0,0],
				fontSize: 11,
				alignment: 'left'
			},
			tableBodyChildrenEven: {
				bold: false,
				fontSize: 10,
				margin:[30,0,0,0],
				alignment: 'left'
			},
			tableBodyOdd: {
				bold: false,
				alignment: 'center',
				fontSize: 9,
				fillColor: '#f3f3f3'
			},
			tableBodyParentOdd: {
				bold: false,
				alignment: 'left',
				margin:[20,0,0,0],
				fontSize: 11,
				fillColor: '#f3f3f3'
			},
			tableBodyChildrenOdd: {
				bold: false,
				alignment: 'left',
				margin:[30,0,0,0],
				fontSize: 10,
				fillColor: '#f3f3f3'
			},
			tableFooter: {
				bold: true,
				fontSize: 11,
				color: 'white',
				fillColor: '#2d4154'
			},
			title: {
				alignment: 'center',
				fontSize: 15
			},
			message: {}
		},
		defaultStyle: {
			font: 'msyh',
			fontSize: 10
		}
	};

	if ( config.message ) {
		doc.content.unshift( {
			text: config.message,
			style: 'message',
			margin: [ 0, 0, 0, 12 ]
		} );
	}

	if ( config.title ) {
		doc.content.unshift( {
			text: _title( config, false ),
			style: 'title',
			margin: [ 0, 0, 0, 12 ]
		} );
	}

	if ( config.customize ) {
		config.customize( doc );
	}
	var funcPdfmake = function() {
		pdfMake.fonts = {
				msyh: {
					normal: 'msyh.ttf'
				}
		};
		
		var pdf = window.pdfMake.createPdf( doc );
		pdf.download(config.fileName);
	}
	lazyPdfmake(funcPdfmake);
};

//导出xlsx文件
function exportXlsx(config) {
	//Excel - Pre-defined strings to build a minimal XLSX file
	var excelStrings = {
		"_rels/.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
	<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
		<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\
	</Relationships>',

		"xl/_rels/workbook.xml.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
	<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
		<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>\
	</Relationships>',

		"[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
	<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\
		<Default Extension="xml" ContentType="application/xml"/>\
		<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\
		<Default Extension="jpeg" ContentType="image/jpeg"/>\
		<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>\
		<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\
	</Types>',

		"xl/workbook.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
	<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\
		<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>\
		<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>\
		<bookViews>\
			<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>\
		</bookViews>\
		<sheets>\
			<sheet name="Sheet1" sheetId="1" r:id="rId1"/>\
		</sheets>\
	</workbook>',

		"xl/worksheets/sheet1.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
	<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">\
		<sheetData>\
			__DATA__\
		</sheetData>\
	</worksheet>'
	};
	var xml = '';
	var data = config.data;
	var addRow = function ( rowData ) {
		var cells = [];

		//取头个数拼装数据
		for ( var i=0, ien= data.header.length ; i<ien ; i++ ) {
			var key = data.header[i].field;
			//若有cellTemplate，优先使用其方法
			var cellTemplate = data.header[i].cellTemplate;
			//if (rowData[key] != null) {
				//if (typeof cellTemplate === 'function') {
			if (cellTemplate != null) {
				cells.push('<c t="inlineStr"><is><t>'+ cellTemplate(rowData, key) +'</t></is></c>');
			} else {
				if (rowData[key] != null) {
					cells.push('<c t="inlineStr"><is><t>'+rowData[key]+'</t></is></c>');
				} else {
					cells.push('<c t="inlineStr"><is><t></t></is></c>');
				}
			}
		}

		return '<row>'+cells.join('')+'</row>';
	};
	
	var addHeaderRow = function ( row ) {
		var cells = [];
		for ( var i=0, ien=row.length ; i<ien ; i++ ) {
			if ( row[i] === null || row[i] === undefined ) {
				row[i] = '';
			}
			cells.push('<c t="inlineStr"><is><t>'+ row[i].displayName + '</t></is></c>'); 
			
		}
		return '<row>'+cells.join('')+'</row>';
	};
	xml += addHeaderRow( data.header );
	
	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		xml += addRow( data.body[i] );
	}

	var zip           = new window.JSZip();
	var _rels         = zip.folder("_rels");
	var xl            = zip.folder("xl");
	var xl_rels       = zip.folder("xl/_rels");
	var xl_worksheets = zip.folder("xl/worksheets");

	zip.file(           '[Content_Types].xml', excelStrings['[Content_Types].xml'] );
	_rels.file(         '.rels',               excelStrings['_rels/.rels'] );
	xl.file(            'workbook.xml',        excelStrings['xl/workbook.xml'] );
	xl_rels.file(       'workbook.xml.rels',   excelStrings['xl/_rels/workbook.xml.rels'] );
	xl_worksheets.file( 'sheet1.xml',          excelStrings['xl/worksheets/sheet1.xml'].replace( '__DATA__', xml ) );

	_saveAs(
		zip.generate( {type:"blob"} ),
		config.fileName
	);

};


var _saveAs = (function(view) {
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
		// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
		// for the reasoning behind the timeout and revocation flow
		, arbitrary_revoke_timeout = 500 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob(["\ufeff", blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name) {
			blob = auto_bom(blob);
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						var new_tab = view.open(object_url, "_blank");
						if (new_tab === undefined && typeof safari !== "undefined") {
							//Apple do not allow window.open, see http://bit.ly/1kZffRI
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
									revoke(file);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name) {
			return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
		};
	}

	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(window));
//获取当前时间，格式为 yyyy-mm-dd
function getFormateDate() {
	var date = new Date();
	var seperateStr1 = "-";
	//var seperateStr2 = ":";
	var month = date.getMonth() +1;
	var strDate = date.getDate();
	
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	
	var currentDate = date.getFullYear() + seperateStr1 + month + seperateStr1 + strDate;
	return currentDate;
};
//custom-title指令和直接注册鼠标放上去的事件两个地方使用 鼠标移动上去的事件
function customTitleMouseEnter(element, e) {
	var titleDiv='<div id="customTitle" class="tooltip in" style="z-index:999999;visibility:hidden;"><div class="tooltip-inner" style="word-wrap:break-word;"><div></div>';
	if($(element).attr("inputTag")=='true'){	//若该指令应用到input输入框标签内，获取焦点时，悬浮提示消失
		$(element).focus(function(event){
			if(document.getElementById("customTitle")){
				$("#customTitle").remove();    //remove div
				$(document.documentElement).css("overflow-x","auto");
				$("#main").css("overflow-y","auto");
			}
		});
	}
	if(document.activeElement!=element[0]){		//当该元素未获得焦点时，才执行悬浮提示事件驱动
		var x=13,y=23,e=e||event,title=$(element).attr("custom-title");
		if(isEmpty(title) && $(element).hasClass("jqgrid_span")) {
			//任务台中需要使用 add by 10191
			title = $(element).text();
		}
		//影响右键菜单关闭了，先注释掉   --w10450
//		e.stopPropagation();
		if(!document.getElementById("customTitle")&&title){
			if($("#bodyid").find(".modal").last()[0]){
				$(".modal").last().append(titleDiv);	//将弹出的div添加到遮罩层中
			}else{
				$("#bodyid").append(titleDiv);	//将弹出的div添加到文档中	
				var clientWidth=document.documentElement.offsetWidth,clientHeight=document.documentElement.offsetHeight;
				if($("#bottomPanel").css("visibility")!='hidden'){	//判断页面上是否显示任务台
					clientHeight+=$("#bottomPanel").height();
				}
				if (document.documentElement.scrollWidth ==clientWidth ){
					$(document.documentElement).css("overflow-x","hidden");	//remove horizontal scrollbar
				}
				if (angular.isDefined($("#main")[0])&&$("#main")[0].scrollHeight ==clientHeight ){
					$("#main").css("overflow-y","hidden");	//remove vertical scrollbar
				}
			}
		}
		if(title){		//判断div显示的内容是否为空
			var diffValueX=200,diffValueY;	//默认设置弹出div的宽度为200px
			var $contentContainer=$("#customTitle").children().eq(0);
			if(title.getWidth(12)<180){	//【弹出div自适应字符串宽度】若显示的字符串占用宽度小于180，则设置弹出div的宽度为“符串占用宽度”+20
				$contentContainer.css("max-width",(title.getWidth(12)+20)+"px");
				diffValueX=e.clientX+(title.getWidth(12)+50)-document.body.offsetWidth;
			}else{
				$contentContainer.css("max-width","200px");
				diffValueX=e.clientX+230-document.body.offsetWidth;	//计算div水平方向显示的内容超出屏幕多少宽度
			}
			$contentContainer.html(escapeHtml(title));	//html方法可解析内容中换行标签，text方法不能
			if(diffValueX>0){	//水平方向超出可见区域时
				x-=diffValueX;
			}					
			$("#customTitle").css({"top": (e.clientY+y) + "px","left": (e.clientX+x) +"px","visibility":"hidden"});	//设置X  Y坐标， 并且显示
			
			diffValueY=$("#customTitle").offset().top+$contentContainer[0].offsetHeight+15-document.body.offsetHeight;
			if(diffValueY>0){	//垂直方向超出可见区域时
				$("#customTitle").css({"top":e.clientY-diffValueY,"visibility":"visible"});
			}else{
				$("#customTitle").css({"visibility":"visible"});
			}
			
		}
	}
}
function escapeHtml(str) {
	if (isEmpty(str)) return "";
	str = str.trim();
	str=str.replace(new RegExp("&", "gm"), "&amp;")
			.replace(new RegExp("\"", "gm"), "&quot;")
			.replace(new RegExp(" ", "gm"), "&nbsp;")
			.replace(new RegExp("<", "gm"), "&lt;")
			.replace(new RegExp(">", "gm"), "&gt;")
			.replace(new RegExp("\'", "gm"), "&#039;")
			.replace(new RegExp("\r\n", "gm"), "<br/>")
			.replace(new RegExp("\n", "gm"),"<br/>")
			.replace(new RegExp("\r", "gm"),"<br/>");
	return str;
}
//custom-title指令 鼠标移动出或者点击的事件
function customTitleMouseLeave() {
	if(document.getElementById("customTitle")){
		$("#customTitle").remove();    //remove div
		$(document.documentElement).css("overflow-x","auto");
		$("#main").css("overflow-y","auto");
	}
}

//echart图形无数据时显示的内容
function noDataLoadingEffect(params, text, top) {
    var topValue = '40%';
    if (top) {
        topValue = top;
    }
    params.start = function(h) {
        h._bgDom.style.backgroundColor = '#fff';
        h._bgDom.style.textAlign = 'center';
        h._bgDom.style.width = '99%';
        h._bgDom.style.fontSize = 12;
        h._bgDom.style.fontFamily = 'Arial,"Microsoft Yahei","微软雅黑",SimSun';
        h._bgDom.style.top = topValue;
        h._bgDom.innerText = text;
    };
    params.stop = function() {
        
    };
    return params;
}

function setScopeCycle($scope, cycleObj) {
	var data = cycleObj.data;
    if (typeof data != "undefined" && data["monitor.refresh.cycle"]) {
       $scope.cycle = data["monitor.refresh.cycle"];
    } else {
       $scope.cycle = 30000;
    }
}

function adjustHoverTree() {
	if ($("#mainPanel").hasClass("slideHidden")) {
		var ulheight = $("li.open .nav-tree ul.list-group").height();
		var targetJquery = $("li.open .nav-tree");
		if (!isEmpty(ulheight) && !isEmpty(targetJquery.offset())) {
			var treedivOffsetBottom = $(window).height()- targetJquery.offset().top;
			if (ulheight < treedivOffsetBottom)  {
				targetJquery.height(ulheight + 23);
			} else {
				targetJquery.height(treedivOffsetBottom);
				targetJquery.css({overflow:"auto"});
			}
		}
	}
}

function getTimezones($translate) {
	return [{value:83, label:$translate.instant("virdesk.timezone83")},
			{value:80, label:$translate.instant("virdesk.timezone80")},
			{value:75, label:$translate.instant("virdesk.timezone75")},
			{value:65, label:$translate.instant("virdesk.timezone65")},
			{value:70, label:$translate.instant("virdesk.timezone70")},
			{value:73, label:$translate.instant("virdesk.timezone73")},
			{value:60, label:$translate.instant("virdesk.timezone60")},
			{value:50, label:$translate.instant("virdesk.timezone50")},
			{value:55, label:$translate.instant("virdesk.timezone55")},
			{value:56, label:$translate.instant("virdesk.timezone56")},
			{value:45, label:$translate.instant("virdesk.timezone45")},
			{value:35, label:$translate.instant("virdesk.timezone35")},
			{value:40, label:$translate.instant("virdesk.timezone40")},
			{value:30, label:$translate.instant("virdesk.timezone30")},
			{value:25, label:$translate.instant("virdesk.timezone25")},
			{value:20, label:$translate.instant("virdesk.timezone20")},
			{value:33, label:$translate.instant("virdesk.timezone33")},
			{value:10, label:$translate.instant("virdesk.timezone10")},
			{value:13, label:$translate.instant("virdesk.timezone13")},
			{value:15, label:$translate.instant("virdesk.timezone15")},
			{value:4, label:$translate.instant("virdesk.timezone4")},
			{value:3, label:$translate.instant("virdesk.timezone3")},
			{value:2, label:$translate.instant("virdesk.timezone2")},
			{value:1, label:$translate.instant("virdesk.timezone1")},
			{value:0, label:$translate.instant("virdesk.timezone0")},
			{value:85, label:$translate.instant("virdesk.timezone85")},
			{value:90, label:$translate.instant("virdesk.timezone90")},
			{value:110, label:$translate.instant("virdesk.timezone110")},
			{value:95, label:$translate.instant("virdesk.timezone95")},
			{value:105, label:$translate.instant("virdesk.timezone105")},
			{value:100, label:$translate.instant("virdesk.timezone100")},
			{value:113, label:$translate.instant("virdesk.timezone113")},
			{value:130, label:$translate.instant("virdesk.timezone130")},
			{value:140, label:$translate.instant("virdesk.timezone140")},
			{value:125, label:$translate.instant("virdesk.timezone125")},
			{value:120, label:$translate.instant("virdesk.timezone120")},
			{value:115, label:$translate.instant("virdesk.timezone115")},
			{value:135, label:$translate.instant("virdesk.timezone135")},
			{value:158, label:$translate.instant("virdesk.timezone158")},
			{value:150, label:$translate.instant("virdesk.timezone150")},
			{value:145, label:$translate.instant("virdesk.timezone145")},
			{value:155, label:$translate.instant("virdesk.timezone155")},
			{value:160, label:$translate.instant("virdesk.timezone160")},
			{value:165, label:$translate.instant("virdesk.timezone165")},
			{value:170, label:$translate.instant("virdesk.timezone170")},
			{value:175, label:$translate.instant("virdesk.timezone175")},
			{value:180, label:$translate.instant("virdesk.timezone180")},
			{value:185, label:$translate.instant("virdesk.timezone185")},
			{value:190, label:$translate.instant("virdesk.timezone190")},
			{value:193, label:$translate.instant("virdesk.timezone193")},
			{value:201, label:$translate.instant("virdesk.timezone201")},
			{value:195, label:$translate.instant("virdesk.timezone195")},
			{value:200, label:$translate.instant("virdesk.timezone200")},
			{value:203, label:$translate.instant("virdesk.timezone203")},
			{value:207, label:$translate.instant("virdesk.timezone207")},
			{value:205, label:$translate.instant("virdesk.timezone205")},
			{value:210, label:$translate.instant("virdesk.timezone210")},
			{value:215, label:$translate.instant("virdesk.timezone215")},
			{value:225, label:$translate.instant("virdesk.timezone225")},
			{value:220, label:$translate.instant("virdesk.timezone220")},
			{value:227, label:$translate.instant("virdesk.timezone227")},
			{value:235, label:$translate.instant("virdesk.timezone235")},
			{value:230, label:$translate.instant("virdesk.timezone230")},
			{value:240, label:$translate.instant("virdesk.timezone240")},
			{value:250, label:$translate.instant("virdesk.timezone250")},
			{value:245, label:$translate.instant("virdesk.timezone245")},
			{value:260, label:$translate.instant("virdesk.timezone260")},
			{value:270, label:$translate.instant("virdesk.timezone270")},
			{value:275, label:$translate.instant("virdesk.timezone275")},
			{value:265, label:$translate.instant("virdesk.timezone265")},
			{value:255, label:$translate.instant("virdesk.timezone255")},
			{value:280, label:$translate.instant("virdesk.timezone280")},
			{value:290, label:$translate.instant("virdesk.timezone290")},
			{value:285, label:$translate.instant("virdesk.timezone285")},
			{value:300, label:$translate.instant("virdesk.timezone300")}];
		
}
function Base64() {
	 
	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
 
	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
 
	// private method for UTF-8 encoding
	_utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}
 
	// private method for UTF-8 decoding
	_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

/**   
 * Simple Map   
 * var m = new Map();   
 * m.put('key','value');   
 */    
function Map() {     
    /** 存放键的数组*/    
    this.keys = new Array();     
    /** 存放数据 */    
    this.data = new Object();     
         
    /**   
     * 放入一个键值对 
     * @param {String} key   
     * @param {Object} value   
     */    
    this.put = function(key, value) {     
        if(this.data[key] == null){     
            this.keys.push(key);     
        }     
        this.data[key] = value;     
    };     
         
    /**   
     * 获取一个键值对
     * @param {String} key   
     * @return {Object} value   
     */    
    this.get = function(key) {     
        return this.data[key];     
    };     
         
    /**   
     * 移除一个键值对
     * @param {String} key   
     */    
    this.remove = function(key) {     
        this.keys.remove(key);     
        this.data[key] = null;     
    };     
         
    /**   
     * 遍历Map,执行处理函数    
     * @param {Function} 回调函数 function(key,value,index){..}   
     */    
    this.each = function(fn){     
        if(typeof fn != 'function'){     
            return;     
        }     
        var len = this.keys.length;     
        for(var i=0;i<len;i++){     
            var k = this.keys[i];     
            fn(k,this.data[k],i);     
        }     
    };     
         
    /**   
     * 获取键值数组（类似java的entrySet()）  
     * @return 键值对象｛key,value｝ 的数组  
     */    
    this.entrys = function() {     
        var len = this.keys.length;     
        var entrys = new Array(len);     
        for (var i = 0; i < len; i++) {     
            entrys[i] = {     
                key : this.keys[i],     
                value : this.data[i]     
            };     
        }     
        return entrys;     
    };     
         
    /**   
     * 判断是否为空
     */    
    this.isEmpty = function() {     
        return this.keys.length == 0;     
    };     
         
    /**   
     * 获取键值对数量  
     */    
    this.size = function(){     
        return this.keys.length;     
    };     
         
    /**   
     * 重写toString
     */    
    this.toString = function(){     
        var s = "{";     
        for(var i=0;i<this.keys.length;i++,s+=','){     
            var k = this.keys[i];     
            s += k+"="+this.data[k];     
        }     
        s+="}";     
        return s;     
    };
    
    this.clear = function() {
        this.keys = new Array();     
        this.data = new Object(); 
    }
}
//云彩虹刷新
function handlePublicCloudTaskEvent($rootScope, obj) {
	 var refreshData  = obj.refreshData[0];
	 var data = new Array();
	 data.push(refreshData.srcCvm);
	 data.push(refreshData.dstCvm);
	 if(refreshData.cloudId){
		 data.push(refreshData.cloudId);
	 }
	 $rootScope.$broadcast(constant.onRefreshRainbowData, data);
}//注册ngGridEventData事件，使表格显示时默认选中第一行
//selectArray: select array, must has one object.
//column: compare column name, must uniqu.
//gridOptions: grid config objcet
//onlyColumn:需要选中某行的表格的特有列 用来防止其他联动表格多次触发afterSelectionChange事件
function selectFirstLine(scope, selectArray, column, gridOptions, onlyColumn) {
	if (angular.isUndefined(scope) || angular.isUndefined(scope.$on)) {
		return;
	}
	scope.$on('ngGridEventData', function(row, event) {
		var renderedRows = row.targetScope.renderedRows.length;
		// console.info(renderedRows);
		if (renderedRows > 0) {              // 有数据显示时才执行
			var ngrow0 = row.targetScope.renderedRows[0];
			if (ngrow0.selected == true || !angular.isDefined(ngrow0.entity[column])) {   // 此处会执行多次，只要第一行选中就返回，防止多次触发afterSelectionChange事件
				return;
			}
			// 防止多次触发afterSelectionChange事件
			if (angular.isDefined(onlyColumn) && angular.isUndefined(ngrow0.entity[onlyColumn])) {
				return;
			}
			
			// if has selected item, select it again.
			if (angular.isArray(selectArray) && selectArray.length == 1 && angular.isString(column)) {
	         	for (var i = 0; i < renderedRows; i++) {
	             	var ngrowi = row.targetScope.renderedRows[i];
	             	if (ngrowi.entity[column] == selectArray[0][column]) {
	             		if (angular.isObject(gridOptions)) {
	             			gridOptions.selectRow(ngrowi.rowIndex, true);
	             		} else {
	             			scope.gridOptions.selectRow(ngrowi.rowIndex, true);
	             		}
	             		return;
	             	}
	             }
	         }
			if (angular.isObject(gridOptions)) {
	        	if(gridOptions.hasOwnProperty("selectRow")){
	        		gridOptions.selectRow(0, true);
	            }
	        } else {
	        	if(scope.gridOptions.hasOwnProperty("selectRow")){
	            	scope.gridOptions.selectRow(0, true);
	            }
	        }
		} 
	});
}