//angular.module('phonecatFilters', []).filter('checkmark', function() {
//	return function(input) {
//		return input ? '\u2713' : '\u2718';
//	};
//});
routeApp.filter('byteUnitRender', function() {//这个是MB单位的Render
	return function(value, showEmpty) {
		if (typeof value == "undefined" || value == null) {
		    if (showEmpty) {
		        return '';
		    } else {
		        value = 0;
		    }
    	}
    	if (value >= 1048576) {
           var m = value/1048576;
           return m.toFixed(2) + 'TB';
        } else if (value >= 1024) {
           return (value/1024).toFixed(2) + 'GB';
        } else {
           return value.toFixed(2) + 'MB';
	    }
	};
});
routeApp.filter('byteUnitRender2', function() {//这个才是Byte单位的Render
	return function(value) {
		if (typeof value == "undefined" || value == null) {
    		value = 0;
    	}
		if (value >= 1099511627776) {
			var m = value/1099511627776;
	        return m.toFixed(2) + 'TB';
		} else if (value >= 1073741824) {
           var m = value/1073741824;
           return m.toFixed(2) + 'GB';
        } else {
           return (value/1048576).toFixed(2) + 'MB';
        }
	};
});
routeApp.filter('byteUnitRender3', function() {//KB单位的Render
    return function(value) {
        if (typeof value == "undefined") {
            value = 0;
        }
        if (value >= 1073741824) {
            var m = value/1073741824;
            return m.toFixed(2) + 'TB';
        } else if (value >= 1048576) {
           var m = value/1048576;
           return m.toFixed(2) + 'GB';
        } else {
           return (value/1024).toFixed(2) + 'MB';
        }
    };
});
routeApp.filter('byteUnitRender4', function() {//GB单位的Render
    return function(value) {
        if (typeof value == "undefined") {
            value = 0;
        }
        if (value >= 1024) {
            var m = value/1024;
            return m.toFixed(2) + 'TB';
        } else if (value >= 1) {
           var m = value;
           return m.toFixed(2) + 'GB';
        } else {
           return (value*1024).toFixed(2) + 'MB';
        }
    };
});
routeApp.filter('authMode', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
    		value = '';
    	}
    	if (value == 0) {
	        return $translate.instant('operator.pwdAuth');
	    } else if (value == 1) {
	        return $translate.instant('operator.ldapAuth');
	    } else {
	        return '';
	    }
	};
});
routeApp.filter('enable', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
		    return '';
		}
		if (value == 0) {
			return $translate.instant("common.forbidden");
		} else if (value == 1) {
			return $translate.instant("common.enable");
		} else {
			return '';
		}
	};
});
routeApp.filter('yes', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == true) {
			return $translate.instant("common.yes");
		} else if (value == false) {
			return $translate.instant("common.no");
		} else {
			return '';
		}
	};
});
routeApp.filter('active', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 0) {
			return $translate.instant('common.notEffective');
		} else if (value == 1) {
			return $translate.instant('common.effective');
		} else {
			return '';
		}
	};
});
//虚拟交换机状态： 
routeApp.filter('status', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 0) {
			//不活动
			return $translate.instant('common.inactive');
		} else if (value == 1) {
			//活动 
			return $translate.instant('common.active');
		} else {
			//未知
			return $translate.instant('unkown');
		}
	};
});
routeApp.filter('backupMode', function($translate) { //备份模式
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 22) {
			return $translate.instant('backupVm.diffbackup');
		} else if (value == 11) {
			return $translate.instant('backupVm.incbackup');
		} else if (value == 0) {
			return $translate.instant('backupVm.allbackup');
		} else if (value == 20) {
			return $translate.instant('backupVm.allDiffBackup');
		} else if (value == 10) {
			return $translate.instant('backupVm.allIncBackup');
		} else {
			return '';
		}
	};
});
//显示select的label值
routeApp.filter('selectLabel', function() {
   //value：为select选中的值,firstLabel:当value为undefined是赋此值，options：select的options数组
   return function(value, firstLabel, options) {
       if (angular.isUndefined(value) || value == 'undefined') {
           value = firstLabel;
       }
       return getSelectLabel(value, options);
   };
});
//根据存储或内存的单位变化，变更显示值
routeApp.filter('unit', function() {
    //value：容量，unit单位（MB，GB）
    return function(value, unit) {
        if (!angular.isNumber(value)) {
            return value;
        }
        if (unit == 'GB') {
            return value / 1024;
        }        
    };
});
//显示checkbox的选择值
//显示radio的选择值
routeApp.filter('radioLabel', function($translate) {
    //要求radio绑定的value为多语言的key，defaultValue传入一个默认值，area表示使用哪个模块的key(需要带.)，plug为需要额外显示的信息
    return function(value, defaultValue, area, plug) {
        if (angular.isUndefined(value) || value == 'undefined') {
            value = defaultValue;
        }
        if (plug) {
            return $translate.instant(area + value) + plug;
        } else {
            return $translate.instant(area + value);
        }
    };
});
//显示操作系统
routeApp.filter('system', function($translate) {
    //1代表Linux，0代表Windows
    return function(value) {        
        if (value == 1) {
            return 'Linux';
        } else if (value == 0) {
            return 'Windows';
        } else {
            return 'Other OS';
        }
    };
});
//显示内存大小
routeApp.filter('memory', function($translate) {
    return function(value) {        
        if (value >= 1024) {
            return (value / 1024).toFixed(2) + " GB";
        } else {
            return value + " MB";
        }
    };
});
//显示存储大小
routeApp.filter('storage', function($translate) {
    //1代表Linux，0代表Windows
    return function(value, unit) {
    	if (unit && unit=='GB') {
    		if (value >= 1024) {
                return (value / 1024 ).toFixed(2) + " TB";
            } else {
                return value + " GB";
            }
    	} else {
    		if (value >= 1024 * 1024) {
                return (value / 1024 / 1024).toFixed(2) + " TB";
            } else if (value >= 1024 && value < 1024 * 1024) {
                return (value / 1024 ).toFixed(2) + " GB";
            } else {
                return value + " MB";
            }
    	}
    };
});
//处理java返回的null值
routeApp.filter('nullStr', function() {
    return function(value) {        
        if (value == "null") {
            return undefined;
        } else {
            return value;
        }
    };
});
//显示密码
routeApp.filter('password', function($translate) {
    return function(value) {        
        if (angular.isUndefined(value)) {
            return undefined;
        } else {
            var pwd = value + "";
            if (pwd.length == 0) {
                return undefined;
            }
            var arr = [];
            for (var i = 0; i < pwd.length; i ++) {
                arr.push($translate.instant("dot"));
            }
            return arr.join('');
        }
    };
});
//方向
routeApp.filter('aspect', function($translate) {
   return function(value) {
       if ('0' == value) {
           return $translate.instant('securityMng.aspectIn');
       } else if ('1' == value) {
           return $translate.instant('securityMng.aspectOut');
       } else {
           return $translate.instant('securityMng.aspectInOut');
       }
   } 
});
//访问类型
routeApp.filter('accessType', function($translate) {
    return function(value) {
        if ('1' == value) {
            return $translate.instant('securityMng.enable');
        } else {
            return $translate.instant('securityMng.refuse');
        }
    } 
 });
//ACL类型
routeApp.filter('aclType', function($translate) {
    return function(value) {
        if (constant.LAYER_3 == value) {
            return $translate.instant('securityMng.ipv4');
        } else {
            return $translate.instant('securityMng.level2');
        }
    } 
});
//协议
routeApp.filter('protocol', function($translate) {
    return function(value) {
        if ('65535' == value) {
            return 'All';
        } else if ('1' == value) {
            return 'ICMP';
        } else if ('6' == value) {
            return 'TCP';
        } else if ('17' == value) {
            return 'UDP';
        } else if ('2054' == value) {
            return 'ARP';
        } else if ('2048' == value) {
            return 'RARP';
        } else if ('34525' == value) {
            return 'IPv4';
        } else if ('32821' == value) {
            return 'IPv6';
        } else {
            return 'All';
        }
    } 
});
//迁移虚拟机时磁盘格式指定
routeApp.filter('diskFormat', function($translate) {
	return function(value) {
		if (angular.isUndefined(value)) {
			return $translate.instant('migrateVm.sameFormat');
		}
		if (value == 'qcow2') {
			return $translate.instant('migrateVm.qcow2');
		} else if (value == 'raw') {
			return $translate.instant('migrateVm.raw');
		} else {
			return $translate.instant('migrateVm.sameFormat');
		}
	};
});
routeApp.filter('storageType', function($translate) { //存储类型
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 'dir') {
			return $translate.instant('storagePool.local');
		} else if (value == 'logical') {
			return $translate.instant('storagePool.lvm');
		} else if (value == 'cifs') {
			return $translate.instant('storagePool.windowsShareFs');
		} else if (value == 'iscsi') {
			return $translate.instant('storagePool.iscsi');
		} else if (value == 'scsi') {
			return $translate.instant('storagePool.scsi');
		} else if (value == 'netfs') {
			return $translate.instant('storagePool.nfs');
		} else if (value == 'fs') {
			return $translate.instant('storagePool.shareFs');
		} else if (value == 'fc') {
			return $translate.instant('storagePool.fc');
		} else if (value == 'VMFS'){
			return 'VMFS';
		} else if (value == 'NFS') {
			return 'NFS';
		} else {
			return '';
		}
	};
});
//优先级 0： 低 1：中 ： 2 ：高
routeApp.filter('priority', function($translate) {
   return function(value) {
       if ('0' == value) {
           return $translate.instant('common.low');
       } else if ('1' == value) {
           return $translate.instant('common.middle');
       } else if ('2' == value){
           return $translate.instant('common.high');
       }
   } 
});
routeApp.filter('kbps', function() {
	   return function(value) {
		   if (angular.isNumber(value)) {
			   return value + "Kbps";
		   }
	   };
});
routeApp.filter('KBytes', function() {
	   return function(value) {
		   if (angular.isNumber(value)) {
			   return value + "KBytes";
		   }
	   }; 
});
//虚拟交换机转发模式： 
routeApp.filter('vsmode', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 1) {
			//不活动
			return $translate.instant('vswitch.vepa');
		} else if (value == 2) {
			//活动 
			return $translate.instant('vswitch.multiChannel');
		} else if (value == 3) {
			//未知
			return $translate.instant('vswitch.vds');;
		} else if (value == 0) {
			//未知
			return $translate.instant('vswitch.veb');;
		} else if (value == 4) {
			return $translate.instant("vswitch.vxlanCas");
		} else {
			return "";
		}
	};
});
//日期过滤器
routeApp.filter('mydate', function(dateFilter) {
	   return function(value) {
		   if (typeof value == "undefined" || value == '' || value == null) {
				return '';
		   }
		   var v = new Date(value);
		   return dateFilter(v, 'yyyy-MM-dd HH:mm:ss');
	   };
});
//日期过滤器yyyy-MM-dd
routeApp.filter('dayDate', function(dateFilter) {
	   return function(value) {
		   if (typeof value == "undefined" || value == '' || value == null) {
				return '';
		   }
		   var v = new Date(value);
		   return dateFilter(v, 'yyyy-MM-dd');
	   };
});
//IOMMU status filter
routeApp.filter('iommu', function($translate) {
	   return function(value) {
		   if (typeof value == "undefined") {
				return $translate.instant('common.unkown');
		   }
		   if (value == '0') {
			   return $translate.instant('common.forbidden');
		   } else if (value == '1') {
			   return $translate.instant('common.enable');
		   } else {
			   return $translate.instant('common.unkown');
		   }
	   };
});
//Storage adapter device speed
routeApp.filter('devcieSpeed', function($translate) {
	   return function(value) {
		   if (typeof value == "undefined") {
				return $translate.instant('host.notSupport');
		   }
		   if (value == '0') {
			   return $translate.instant('host.notSupport');
		   } else if (value == '1') {
			   return $translate.instant('host.support');
		   } else {
			   return $translate.instant('host.notSupport');
		   }
	   };
});
//备份的方式 本地文件 和 远端服务器
routeApp.filter('backupmode', function($translate) {
	   return function(value) {
		   if (value == '0') {
			   return $translate.instant('backupVm.localDir');
		   } else {
			   return $translate.instant('backupVm.remoteServer');
		   }
	   };
});
//服务器类型 ftp 和scp
routeApp.filter('servertype', function($translate) {
	   return function(value) {
		   if (value == '0') {
			   return $translate.instant('host.ftpType');
		   } else if (value == '1') {
			   return $translate.instant('host.scpType');
		   } else {
			   return '';
		   }
		   
	   };
});

//智能资源调度 类型 1：GPU，2：HBA，其他
routeApp.filter('irsTypeRender', function() {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 1) {
			return 'GPU';
		} else if (value == 2) {
			return 'HBA';
		} else {
			return '';
		}
	};
});

//业务模板优先级 类型 0：高，2：低
routeApp.filter('businessTempPriority', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 0) {
			return $translate.instant('irs.high');
		} else if (value == 2) {
			return $translate.instant('irs.low');
		} else {
			return '';
		}
	};
});

//业务模板资源分配比例
routeApp.filter('businessTempProportion', function() {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		return value + '%';
	};
});



//告警确认状态
routeApp.filter("alarmStatus", function($translate){
	return function(value){
		if (typeof value == "undefined") {
			value = '';
		}
		if(value == 1){
			return $translate.instant("alarm.confirmOk")
		} else if(value == 2){
			return $translate.instant("alarm.notconfirm");
		} else {
			return "";
		}
	};
});
routeApp.filter("warnNotifyIndexFlag", function($translate){
	return function(value){
		if (typeof value == "undefined") {
			value = '';
		}
		if(value == 0){
			return $translate.instant("host.host");
		}else if(value == 1){
			return $translate.instant("vm.domain");
		}else{
			return "";
		}
		
	}
});
routeApp.filter("vlanType", function(){
	return function(value){
		if(typeof value == 'undefined') {
			value = '';
		}
		if(value == 0){
			return 'VLAN';
		}else if(value == 1){
			return 'VXLAN';
		}else{
			return "";
		}
	}
})

routeApp.filter("recoveryPlanStatus", function($translate){
	return function(status, flag){
		var res = '';
		if (flag) {
			res += $translate.instant("srm.plan.flag_" + flag);
		}
		if (status) {
			res += $translate.instant("srm.plan.status_" + status);
		}
		return res;
	}
})

//模板存储类型
routeApp.filter('templateStorageTypeRender', function($translate) {
	return function(type) {
		var msg = '';
		if (typeof type == "undefined") {
			msg = '';
		}
		if(type == 0) {
			//dir
			msg = $translate.instant('storagePool.local');
		} else if(type == 1) {
			//iscsi
			msg = $translate.instant('template.iscsi');
		} else if(type == 2) {
			//fc
			msg = $translate.instant('template.fc');
		} else if(type == 3) {
			//netfs
			msg = $translate.instant('storagePool.nfs');
		} else if(type == 4) {
			//cifs
			msg = $translate.instant('storagePool.windowsShareFs');
		}
		return msg;
	};
});

routeApp.filter("uptime", function($translate){
	return function(value){
		var timeStr = '';
		if(angular.isUndefined(value) || value == null){
			value = -1;
		}
		if(value >= 0 && value < 60){
			return value + $translate.instant('cluster.minute');
		}else if(value >= 60 && value < 1440){
			var hour = Math.floor(value / 60);
			var minute = value % 60;
			return hour + $translate.instant('cluster.hour') + minute + $translate.instant('cluster.minute');
		}else if(value >= 1440){
			var day = Math.floor(value / 1440);
			var tempMinute = value % 1440;
			var hour = Math.floor(tempMinute / 60);
			var minute = tempMinute % 60;
			return day + $translate.instant("paramconfig.day") + hour + $translate.instant('cluster.hour') + minute + $translate.instant('cluster.minute');
		}else if(value == -1){
			return "-";
		}
	}
})
routeApp.filter("uptime2", function($translate){
	return function(value){
		var timeStr = '';
		if(angular.isUndefined(value) || value == null){
			value = -1;
		}
		if(value >= 0 && value < 60){
			return value + $translate.instant('second');
		}else if(value >= 60 && value < 3600){
			var minute = Math.floor(value / 60);
			var second = value % 60;
			return minute + $translate.instant('cluster.minute') + second + $translate.instant('second');
		}else if(value >= 3600 && value < 86400){
			var hour = Math.floor(value / 3600);
			var tempSecond = value % 3600;
			var minute = Math.floor(tempSecond / 60);
			var second = tempSecond % 60;
			return hour + $translate.instant('cluster.hour') + minute + $translate.instant('cluster.minute') + second + $translate.instant("second");
		}else if (value >= 86400) {
			var day = Math.floor(value / 86400);
			var tempSecond = value % 86400;
			var hour = Math.floor(tempSecond / 3600);
			tempSecond = tempSecond % 3600;
			var minute = Math.floor(tempSecond / 60);
			var second = tempSecond % 60;
			return day + $translate.instant("paramconfig.day") + hour + $translate.instant('cluster.hour') + minute + $translate.instant('cluster.minute') + second + $translate.instant("second");
		}else if(value == -1){
			return "-";
		}
	}
})
routeApp.filter("num", function(){
	return function(value){
		if (angular.isUndefined(value)) {
			return 1;
		} else {
			return value;
		}
	}
})
routeApp.filter("authType", function ($translate){
	return function (value){
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == 0){
			return $translate.instant("user.pwdAuth");
		} else if (value == 1){
			return $translate.instant("user.ldapAuth");
		} else {
			return "";
		}
	}
});
routeApp.filter("userState", function ($translate){
	return function (value){
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == 0){
			return $translate.instant("user.notEffective");
		} else if (value == 1){
			return $translate.instant("user.effective");
		} else {
			return "";
		}
	};
});
routeApp.filter("cloudType", function ($translate){
	return function (value){
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == 2){
			return $translate.instant('cloudResource.cvmResource');
		} else if (value == 3){
			return "vCenter";
		} else if (value == 5){
			return "Cloud OS";
		} else {
			return "";
		}
	}

});

routeApp.filter('desktopType', function($translate) { //虚拟桌面池类型
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 1) {
			return $translate.instant('virdesk.fixedDesktopPool');
		} else {
			return $translate.instant('virdesk.floatingDesktopPool');
		} 
	};
});

routeApp.filter("msgLevel", function ($translate){
	return function (value){
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == 1) {
			return $translate.instant("cloudService.generalNews");
		} else if (value == 2) {
			return $translate.instant("cloudService.importantNews");
		} else {
			return value;
		}
	}
});

routeApp.filter("totalVm", function ($translate){
	return function (value) {
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == -1) {
			return $translate.instant("operateLog.notLimit");
		} else {
			return value;
		}
	}
});

routeApp.filter("licenseTime", function ($translate){
	return function (value) {
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == -1) {
			return $translate.instant("licenseMng.foreverValid");
		} else {
			return $translate.instant("licenseMng.licenseTime",{value:value});
		}
	}
});

routeApp.filter("workOrderStatus", function ($translate){
	return function (value) {
		if (angular.isUndefined(value)) {
			value = "";
		}
		if (value == 1) {
			return $translate.instant("cloudService.unprocessed")
		} else if (value == 2) {
			return $translate.instant("cloudService.processed");
		} else {
			return value;
		}
	}
});
//虚拟机迁移类型
routeApp.filter('migrateType', function($translate) {
    return function(value) {
        if (value == 0) {
            return $translate.instant('migrateVm.changeHost');
        } else if (value == 1) {
            return $translate.instant('migrateVm.changeStorage');
        } else {
            return $translate.instant('migrateVm.changeHostAndStorage');
        }
    };
});
//虚拟桌面类型
routeApp.filter('virtualDeskType', function($translate) {
    return function(value) {
        if (typeof value == "undefined") {
            return $translate.instant('org.org');
        }
        if (value == 1) {
            return $translate.instant('org.user');
        } else if (value == 2) {
            return $translate.instant('virdesk.userGroup');
        } else {
            return $translate.instant('org.org');
        }
    };
});
//vnc port
routeApp.filter('vncPort', function() {
	return function(value) {
		if (angular.isUndefined(value)){
			value = -1;
		}
		if (value == -1) {
			return "-";
		} else {
			return value;
		}
	}
});
routeApp.filter("modeToVlanType", function() {
	return function(value) {
		if (angular.isUndefined(value)){
			value = "";
		}
		if (value == "VXLAN" || value == "VXLAN(CAS)") {
			return "VXLAN";
		} else {
			return "VLAN";
		}
	}
});
routeApp.filter("busType", function($translate){
	return function(value){
		if (angular.isUndefined(value)){
			value = "";
		}
		if(value == 'ide'){
			return "IDE";
		} else if(value == 'fdc'){
			return "FDC";
		} else if(value == 'virtio'){
			return $translate.instant("common.virtio");
		} else if(value == 'usb'){
			return "USB";
		} else if(value == 'virtio-scsi'){
			return $translate.instant("common.virtioScsi");
		} else if(value == 'scsi'){
			return "SCSI";
		} else {
			return value;
		}
	}
});
routeApp.filter("vmwaretoolsVersion", function($translate){
    return function(value){
        if (angular.isUndefined(value)){
            value = "";
        }
        if(value == 'ok'){
            return $translate.instant("vmware.toolsOk");
        } else if(value == 'old'){
            return $translate.instant("vmware.toolsOld");
        } else {
            return $translate.instant("vmware.toolsNotInstalled");
        }
    }
});
routeApp.filter("cpuArchitecture", function($translate) {
	return function(value) {
		if (angular.isUndefined(value)){
			value = "";
		}
		if (value == "i686") {
			return $translate.instant("addDomain.i686");
		} else if (value == "x86_64") {
			return $translate.instant("addDomain.x86_64");
		} else {
			return value;
		}
	}
});
routeApp.filter('assignTypeRender', function($translate) {
    return function(typeId) {
        //IP地址分配方式 0：DHCP  1： 静态
        if (typeId == 0) {
            return $translate.instant("workflow.typeDhcp");
        } else if (typeId == 1) {
            return $translate.instant("workflow.typeStatic");
        } else {
            return "";
        }
    };
});
routeApp.filter('vmwareCpu', function($translate) {
    return function(value, cpuSocket, cpuThreads) {
        if (value && cpuSocket) {
            var corePerSocket = value / cpuSocket;
            var unit = $translate.instant("vmware.cpuUnit");
            if (cpuThreads > 0) {
                var cpuThread = cpuThreads / value;
                return cpuSocket + " * " + corePerSocket + " * " +  cpuThread + " " + unit;
            } else {
                return cpuSocket + " * " + corePerSocket + " " + unit;
            }
        }
    };
});
routeApp.filter("backupType", function($translate){
	return function(value) {
		if (isEmpty(value)) {
			value = "";
		} else if (value == 0) {
			return $translate.instant('backupVm.domainBackup');
		} else if (value == 1) {
			return $translate.instant('backupVm.diskBackup');
		}
		return value;
	}
});
routeApp.filter('cpuFrequency', function() {
    return function(value) {
        if (value) {
            if (value < 1000) {
                return value + " MHz"
            } else {
                return (value/1000).toFixed(2) + " GHz"
            }
        }
    };
});
routeApp.filter('vmwareDiskModel', function($translate) {
    return function(value) {
        //vmware磁盘置备方式
        if (value == 0) {
            return $translate.instant("vmware.diskModel0");
        } else if (value == 1) {
            return $translate.instant("vmware.diskModel1");
        } else if (value == 2) {
            return $translate.instant("vmware.diskModel2");
        } else {
            return $translate.instant("vmware.diskModel0");
        }
    };
});
//防病毒软件厂商
routeApp.filter('antiVirusSoftwareVendor', function($translate) {
    return function(value) {
        if (value == 1) {
            return $translate.instant("cloudSecurity.antiVirusSoftware_Trend");
        } else if (value == 2) {
            return $translate.instant("cloudSecurity.antiVirusSoftware_360");
        } else {
            return $translate.instant("cloudSecurity.antiVirusSoftware_Trend");
        }
    };
});
//antiVirusSoftwareUploadStatus
routeApp.filter('antiVirusSoftwareUploadStatus', function($translate) {
    return function(value) {
        if (value == 0) {
            return $translate.instant("cloudSecurity.uploadNo");
        } else if (value == 1) {
            return $translate.instant("cloudSecurity.uploadYes");
        } else {
            return $translate.instant("cloudSecurity.uploadNo");
        }
    };
});

//告警类型
routeApp.filter("alarmType", function($translate){
	return function(value){
		if (typeof value == "undefined") {
			value = '';
		}
		if(value == constant.ALARM_HOST_TYPE){
			return $translate.instant('alarm.hostAlarm');
		} else if(value == constant.ALARM_VM_TYPE){
			return $translate.instant('alarm.vmAlarm');
		} else if(value == constant.ALARM_CLUSTER_TYPE){
			return $translate.instant("alarm.clusterAlarm");
		} else if(value == constant.ALARM_TROUBLE_TYPE){
			return $translate.instant("alarm.troubleAlarm");
		} else if(value == constant.ALARM_OPERTOR_TYPE){
			return $translate.instant("alarm.opertorAlarm");
		} else if(value == constant.ALARM_EXCEPTION_TYPE){
			return $translate.instant("alarm.exceptionAlarm");
		} else if(value == constant.ALARM_SECURITY_TYPE){
			return $translate.instant("alarm.securityAlarm");
		} else{
			return "";
		}
	};
});

routeApp.filter('timeType', function($translate) {
    return function(value) {
        if (typeof value == "undefined") {
            value = '';
        }
        if (value == "HOURS") {
            return $translate.instant("common.hour");
        } else if (value == "MINUTES") {
            return $translate.instant("common.minute");
        } else if (value == "SECONDS") {
            return $translate.instant("common.second");
        } else {
            return '';
        }
    };
});

routeApp.filter('alarmNoticeType', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 0) {
			return $translate.instant('alarm.emailNotice');
		} else if (value == 1) {
			return $translate.instant('alarm.messageNotice');
		} else {
			return '';
		}
	};
});

routeApp.filter('alarmNoticeLevel', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		var result = "";
		if ((value & 8) >> 3 == 1) {
			result += $translate.instant('alarm.emergency');
		}
		if ((value & 4) >> 2 == 1) {
			if (result.length != 0) {
				result += ",";
			}
			result += $translate.instant('alarm.important');
		}
		if ((value & 2) >> 1 == 1) {
			if (result.length != 0) {
				result += ",";
			}
			result += $translate.instant('alarm.secondary');
		}
		if ((value & 1) == 1) {
			if (result.length != 0) {
				result += ",";
			}
			result += $translate.instant('alarm.tip');
		}
		return result;
	};
});

routeApp.filter('alarmNoticeRule', function($translate) {
	return function(value) {
		if (typeof value == "undefined") {
			value = '';
		}
		if (value == 0) {
			return $translate.instant('alarm.allAlarm');
		} else if (value == 1) {
			return $translate.instant('alarm.selectAlarm');
		} else {
			return '';
		}
	};
});

routeApp.filter("warnNotifyIndexFlag", function($translate){
	return function(value){
		if (typeof value == "undefined") {
			value = '';
		}
		if(value == 0){
			return $translate.instant("host.host");
		}else if(value == 1){
			return $translate.instant("vm.domain");
		}else{
			return "";
		}
		
	}
});


routeApp.filter("hostStatus", function($translate) {
	return function(value) {
		if (isEmpty(value)) {
			value = 0;
		} else if (value == 1) {
			return $translate.instant("common.normal");
		} else if (value == 2) {
			return $translate.instant("host.notInHA");
		} else if (value == 3 || value == 4) {
			return $translate.instant("host.maintainMode");
		} else if (value == 0) {
			return $translate.instant("common.abnormal");
		}
	}
})