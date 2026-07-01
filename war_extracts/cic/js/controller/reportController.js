
/**
 * 资源池计算资源使用统计
 */
routeApp.controller("resPoolComputeCtrl", function($rootScope, $scope, $http, $modal, $translate, $stateParams, $timeout, UtilService, HttpService,EchartService) {
	$scope.model = {};
	$scope.type = {};
	$scope.type.cpu=1;
	$scope.type.mem=1;
	$scope.currenthost = {name : $translate.instant('report.selectHost'),id : "", cloudId : "", cloudType:constant.PUBLIC_CLOUD_CVM};
	$scope.levels = {cycleOptions:[ {value:0,label:$translate.instant("report.hour")},{value:1,label:$translate.instant("paramconfig.day")},
	                                {value:2,label:$translate.instant("report.week")},{value:3,label:$translate.instant("cloudResource.month")},
	                                {value:4,label:$translate.instant("report.year")}]};

	$scope.model.cycle = 1;
	$scope.dateFmt = "YYYY-MM-DD";
	$scope.isShowTime = false;
	$scope.chartName = {hostNetSpr:[],hostNetSpw:[],hostDiskr:[],hostDiskw:[],hostDiskUtil:[]};
	$scope.chartData = {hostNetSpr:[],hostNetSpw:[],hostDiskr:[],hostDiskw:[],hostDiskUtil:[]};
	var hostCpu = null;
	var hostMem = null;
	var hostDiskUtil = null;
	var hostNet = null;
	var hostNetr = null;
	var hostNetw = null;
	var hostNetSpr = null;
	var hostNetSpw = null;
	var hostDiskr = null;
	var hostDiskw = null;
	var hostIo = null;
	var vcIo = null;
	var vcNet = null;
	
	//选择主机
    $scope.selectHost = function() {
    	var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"selectHostInRespoolCtrl",
			width:"720px",
			resolve: {
				hostId : function() {
					return $scope.currenthost.id;
				}
			}
		  });
		  modalInstance.result.then(function(selectItem){
			  if (selectItem && angular.isArray(selectItem) && selectItem.length > 0) {
				  $scope.currenthost.id = selectItem[0].uniqueKey;
				  $scope.currenthost.cloudId = selectItem[0].publicCloudId;
				  $scope.currenthost.cloudType = selectItem[0].publicCloudType;
				  $scope.currenthost.name = selectItem[0].name;
			  } 
		  },function(reason){
		      
		  });
    }; 
    // 设置查询参数
    $scope.setQueryConfig = function() {
    	$scope.model.startTime = $("#hostReportStartTime").val();
    	$scope.model.endTime = $("#hostReportEndTime").val();
    	$scope.model.hostId = $scope.currenthost.id;
    	$scope.model.cloudId = $scope.currenthost.cloudId;
    	$scope.model.cloudType = $scope.currenthost.cloudType;
    };
    // CPU
    $scope.queryHostCpu = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/cpuMemHost?type=0',
    		params:$scope.model
    	}).success(function(reportData) { 
    		hostCpu = echarts.init(document.getElementById('hostReportCpu')); 
    		reportData.max = 100;
    		var option = EchartService.getChartOption($translate.instant('report.cpuUsed'),reportData, "line", hostCpu,$scope.model.cycle);
    		if (option != null) {
    		hostCpu.setOption(option); 
    		}
    	});
    };
    // MEM
    $scope.queryHostMem = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/cpuMemHost?type=1',
    		params:$scope.model
    	}).success(function(reportData) { 
    		hostMem = echarts.init(document.getElementById('hostReportMem')); 
    		reportData.max = 100;
    		var option = EchartService.getChartOption($translate.instant('report.memUsed'),reportData, "line", hostMem, $scope.model.cycle);
    		if (option != null) {
    		hostMem.setOption(option); 
    		}
    	});
    };
    //disk utilization
    $scope.queryHostDiskUtil = function() {
    	$scope.chartName.hostDiskUtil=[];
    	$scope.chartData.hostDiskUtil=[];
    	$scope.chartName.hostDiskUtilSel = null;
    	$http({ 
    		method: 'GET', 
    		url: 'report/diskHost?type=3',
    		params:$scope.model
    	}).success(function(reportData) { 
    		$scope.setRateData(reportData, $scope.chartName.hostDiskUtil);
    		$scope.chartName.hostDiskUtilSel = 0;
    		$scope.chartData.hostDiskUtil = reportData;
    		$scope.showNoDataChart("hostReportDiskUtil", reportData, hostDiskUtil);
    	});
    }
    // NET ALL
    $scope.queryHostNet = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/netHost?type=0',
    		params:$scope.model
    	}).success(function(reportData) { 
    		hostNet = echarts.init(document.getElementById('hostReportNet')); 
    		var option = EchartService.getChartOption($translate.instant('report.netAllStats'),reportData, "area", hostNet, $scope.model.cycle);
    		if (option != null) {
    		hostNet.setOption(option); 
    		}
    	});
    };
    // MET READ
    $scope.queryHostNetr = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/netHost?type=1',
    		params:$scope.model
    	}).success(function(reportData) { 
    		hostNetr = echarts.init(document.getElementById('hostReportNetr')); 
    		var option = EchartService.getChartOption($translate.instant('report.netReadStats'),reportData, "area", hostNetr, $scope.model.cycle);
    		if (option != null) {
    		hostNetr.setOption(option); 
    		}
    	});
    };
    // MET READ
    $scope.queryHostNetw = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/netHost?type=2',
    		params:$scope.model
    	}).success(function(reportData) { 
    		hostNetw = echarts.init(document.getElementById('hostReportNetw')); 
    		var option = EchartService.getChartOption($translate.instant('report.netWriteStats'),reportData, "area", hostNetw, $scope.model.cycle);
    		if (option != null) {
    		hostNetw.setOption(option); 
    		}
    	});
    };
 // MET READ speed
    $scope.queryHostNetSpr = function() { 
    	$scope.chartName.hostNetSpr=[];
    	$scope.chartData.hostNetSpr=[];
    	$scope.chartName.hostNetSprSel = null;
    	$http({ 
    		method: 'GET', 
    		url: 'report/netSpHost?type=0',
    		params:$scope.model
    	}).success(function(reportData) { 
    		$scope.setRateData(reportData, $scope.chartName.hostNetSpr);
    		$scope.chartName.hostNetSprSel = 0;
    		$scope.chartData.hostNetSpr = reportData;
    		$scope.showNoDataChart("hostReportNetSpr", reportData, hostNetSpr);
    	});
    };
    // MET write speed
    $scope.queryHostNetSpw = function() { 
    	$scope.chartName.hostNetSpw=[];
    	$scope.chartData.hostNetSpw=[];
    	$scope.chartName.hostNetSpwSel = null;
    	$http({ 
    		method: 'GET', 
    		url: 'report/netSpHost?type=1',
    		params:$scope.model
    	}).success(function(reportData) { 
    		$scope.setRateData(reportData, $scope.chartName.hostNetSpw);
    		$scope.chartName.hostNetSpwSel = 0;
    		$scope.chartData.hostNetSpw = reportData;
    		$scope.showNoDataChart("hostReportNetSpw", reportData, hostNetSpw);
    	});
    };
    // disk READ
    $scope.queryHostDiskr = function() {  
    	$scope.chartName.hostDiskr=[];
    	$scope.chartData.hostDiskr=[];
    	$scope.chartName.hostDiskrSel = null;
    	$http({ 
    		method: 'GET', 
    		url: 'report/diskHost?type=0',
    		params:$scope.model
    	}).success(function(reportData) { 
    		$scope.setRateData(reportData, $scope.chartName.hostDiskr);
    		$scope.chartName.hostDiskrSel = 0;
    		$scope.chartData.hostDiskr = reportData;
    		$scope.showNoDataChart("hostReportDiskr", reportData, hostDiskr);
    	});
    };
    // disk Write
    $scope.queryHostDiskw = function() {  
    	$scope.chartName.hostDiskw=[];
    	$scope.chartData.hostDiskw=[];
    	$scope.chartName.hostDiskwSel = null;
    	$http({ 
    		method: 'GET', 
    		url: 'report/diskHost?type=1',
    		params:$scope.model
    	}).success(function(reportData) { 
    		$scope.setRateData(reportData, $scope.chartName.hostDiskw);
    		$scope.chartName.hostDiskwSel = 0;
    		$scope.chartData.hostDiskw = reportData;
    		$scope.showNoDataChart("hostReportDiskw", reportData, hostDiskw);
    	});
    };
    // IO
    $scope.queryHostIo = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/ioHost',
    		params:$scope.model
    	}).success(function(reportData) { 
    		hostIo = echarts.init(document.getElementById('hostReportIo')); 
    		var option = EchartService.getChartOption($translate.instant('report.ioStats'),reportData, "area", hostIo, $scope.model.cycle);
    		if (option != null) {
    		hostIo.setOption(option); 
    		}
    	});
    };
    
 // vcenter IO
    $scope.queryVcenterHostIO = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/vcenterReport?type=0',
    		params:$scope.model
    	}).success(function(reportData) { 
    		vcIo = echarts.init(document.getElementById('vcenterReportIo')); 
    		var option = EchartService.getChartOption($translate.instant('report.diskIoStats'),reportData, "area", vcIo, $scope.model.cycle);
    		if (option != null) {
    		vcIo.setOption(option); 
    		}
    	});
    };
    
 // Vcenter net
    $scope.queryVcenterHostNet = function() {    	
    	$http({ 
    		method: 'GET', 
    		url: 'report/vcenterReport?type=1',
    		params:$scope.model
    	}).success(function(reportData) { 
    		vcNet = echarts.init(document.getElementById('vcenterReportNet')); 
    		var option = EchartService.getChartOption($translate.instant('report.netRateStats'),reportData, "area", vcNet, $scope.model.cycle);
    		if (option != null) {
    		vcNet.setOption(option); 
    		}
    	});
    };
    
    
    // 网络读速率网卡更换
    $scope.$watch('chartName.hostNetSprSel', function(newVal, oldVal) {
    	var sel = $scope.chartName.hostNetSpr[newVal];
    	var hostData = $scope.chartData.hostNetSpr;
    	if (sel != null && sel != "") {
    		var repData = [];
    		var j = 0;
    		if (hostData != null) {    			
    			for (i in hostData) {
    				if (sel.label == hostData[i].name) {
    					repData[j] = hostData[i];
    					j++;
    				}
    			}
    		}
    		if (hostNetSpr && (hostNetSpr.getOption() == null || angular.isUndefined(hostNetSpr.getOption()))) {
    			EchartService.dispose(hostNetSpr);
    			hostNetSpr = null;
    		}
    		hostNetSpr = echarts.init(document.getElementById('hostReportNetSpr')); 
    		var option = EchartService.getChartOption($translate.instant('report.netReadSpStats'),repData, "line", hostNetSpr, $scope.model.cycle);
    		if (option != null) {
    		hostNetSpr.setOption(option); 
    	}
    	}
    });
    // 网络写速率网卡更换
    $scope.$watch('chartName.hostNetSpwSel', function(newVal, oldVal) {
    	var sel = $scope.chartName.hostNetSpw[newVal];
    	var hostData = $scope.chartData.hostNetSpw;
    	if (sel != null && sel != "") {
    		var repData = [];
    		var j = 0;
    		if (hostData != null) {    			
    			for (i in hostData) {
    				if (sel.label == hostData[i].name) {
    					repData[j] = hostData[i];
    					j++;
    				}
    			}
    		}
    		if (hostNetSpw && (hostNetSpw.getOption() == null || angular.isUndefined(hostNetSpw.getOption()))) {
    			EchartService.dispose(hostNetSpw);
    			hostNetSpw = null;
    		}
    		hostNetSpw = echarts.init(document.getElementById('hostReportNetSpw')); 
    		var option = EchartService.getChartOption($translate.instant('report.netWriteSpStats'),repData, "line", hostNetSpw, $scope.model.cycle);
    		if (option != null) {
    		hostNetSpw.setOption(option); 
    	}
    	}
    });
    // 磁盘读速率网卡更换
    $scope.$watch('chartName.hostDiskrSel', function(newVal, oldVal) {
    	var sel = $scope.chartName.hostDiskr[newVal];
    	var hostData = $scope.chartData.hostDiskr;
    	if (sel != null && sel != "") {
    		var repData = [];
    		var j = 0;
    		if (hostData != null) {    			
    			for (i in hostData) {
    				if (sel.label == hostData[i].name) {
    					repData[j] = hostData[i];
    					j++;
    				}
    			}
    		}
    		if (hostDiskr && (hostDiskr.getOption() == null || angular.isUndefined(hostDiskr.getOption()))) {
    			EchartService.dispose(hostDiskr);
    			hostDiskr = null;
    		}
    		hostDiskr = echarts.init(document.getElementById('hostReportDiskr')); 
    		var option = EchartService.getChartOption($translate.instant('report.diskReadSpStats'),repData, "line", hostDiskr, $scope.model.cycle);
    		if (option != null) {
    		hostDiskr.setOption(option); 
    	}
    	}
    });
    // 磁盘写速率网卡更换
    $scope.$watch('chartName.hostDiskwSel', function(newVal, oldVal) {
    	var sel = $scope.chartName.hostDiskw[newVal];
    	var hostData = $scope.chartData.hostDiskw;
    	if (sel != null && sel != "") {
    		var repData = [];
    		var j = 0;
    		if (hostData != null) {    			
    			for (i in hostData) {
    				if (sel.label == hostData[i].name) {
    					repData[j] = hostData[i];
    					j++;
    				}
    			}
    		}
    		if (hostDiskw && (hostDiskw.getOption() == null || angular.isUndefined(hostDiskw.getOption()))) {
    			EchartService.dispose(hostDiskw);
    			hostDiskw = null;
    		}
    		hostDiskw = echarts.init(document.getElementById('hostReportDiskw')); 
    		var option = EchartService.getChartOption($translate.instant('report.diskWriteSpStats'),repData, "line", hostDiskw, $scope.model.cycle);
    		if (option != null) {
    		hostDiskw.setOption(option); 
    	}
    	}
    });
 // 磁盘利用率－更换
    $scope.$watch('chartName.hostDiskUtilSel', function(newVal, oldVal) {
    	var sel = $scope.chartName.hostDiskUtil[newVal];
    	var hostData = $scope.chartData.hostDiskUtil;
    	if (sel != null && sel != "") {
    		var repData = [];
    		var j = 0;
    		if (hostData != null) {    			
    			for (i in hostData) {
    				if (sel.label == hostData[i].name) {
    					repData[j] = hostData[i];
    					j++;
    				}
    			}
    		}
    		if (hostDiskUtil && (hostDiskUtil.getOption() == null || angular.isUndefined(hostDiskUtil.getOption()))) {
    			EchartService.dispose(hostDiskUtil);
    			hostDiskUtil = null;
    		}
    		hostDiskUtil = echarts.init(document.getElementById('hostReportDiskUtil')); 
			repData.max = 100;
    		var option = EchartService.getChartOption($translate.instant('report.diskUtil'),repData, "line", hostDiskUtil, $scope.model.cycle);
    		if (option != null) {
    		hostDiskUtil.setOption(option); 
    	}
    	}
    });
    $scope.showNoDataChart = function(divId,reportData, myChart) {
  	  if (isEmpty(reportData) || reportData.length < 1) {
  		  EchartService.noDataShow(divId);
  		  /*myChart = echarts.init(document.getElementById(divId),EchartService.noDataShow()); 
  		  var option = {series : [{}]};
  		  myChart.setOption(option);*/
  	  }
    };
    $scope.queryHostReport = function() {
    	if ($scope.currenthost.id == null || $scope.currenthost.id == "") {
    		UtilService.alert($translate.instant('selectHostTip'), $translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	EchartService.dispose(hostCpu,hostMem,hostDiskUtil,hostNet,hostNetr,hostNetw, hostNetSpr, hostNetSpw,hostDiskr,hostDiskw,hostIo, vcIo, vcNet);
        $scope.chartName = {hostNetSpr:[],hostNetSpw:[],hostDiskr:[],hostDiskw:[],hostDiskUtil:[]};
        $scope.chartData = {hostNetSpr:[],hostNetSpw:[],hostDiskr:[],hostDiskw:[],hostDiskUtil:[]};
    	hostCpu = null;
    	hostMem = null;
    	hostDiskUtil = null;
    	hostNet = null;
    	hostNetr = null;
    	hostNetw = null;
    	hostNetSpr = null;
    	hostNetSpw = null;
    	hostDiskr = null;
    	hostDiskw = null;
    	hostIo = null;
    	vcIo = null;
    	vcNet = null;
    	$scope.setQueryConfig();
    	$scope.isSelected=false;
    	if ($scope.type.cpu == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostCpu();
    	}
    	if ($scope.type.mem == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostMem();
    	}
    	if ($scope.type.vcio == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryVcenterHostIO();
    	}
    	if ($scope.type.vcnet == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryVcenterHostNet();
    	}
    	if ($scope.type.net == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostNet();
    	}
    	if ($scope.type.netr == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostNetr();
    	}
    	if ($scope.type.netw == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostNetw();
    	}
    	if ($scope.type.netSpr == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostNetSpr();
    	}
    	if ($scope.type.netSpw == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostNetSpw();
    	}
    	if ($scope.type.diskr == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostDiskr();
    	}
    	if ($scope.type.diskw == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostDiskw();
    	}
    	if ($scope.type.io == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostIo();
    	}
    	if ($scope.type.diskUtil == 1)
    	{
    		$scope.isSelected=true;
    		$scope.queryHostDiskUtil();
    	}
    	if(!$scope.isSelected)
    	{
    		UtilService.alert($translate.instant('report.selectStatisticType'), $translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    		
    };
    $scope.searchReset = function() {
    	$scope.model = {};
    	$scope.currenthost = {name : $translate.instant('report.selectHost'),id : "", cloudId : "", cloudType : constant.PUBLIC_CLOUD_CVM};
    	$scope.model.cycle = 1;
    	$scope.dateFmt = "YYYY-MM-DD";
    	$scope.isShowTime = false;
    	$scope.resetDatePicker();
    	//issues:201607070584,modify the problem of reset button event
    	$scope.type.cpu=1;
    	$scope.type.mem=1;
    	$scope.type.diskUtil=0;
    	$scope.type.vcio=0;
    	$scope.type.vcnet=0;
    	$scope.type.diskr=0;
    	$scope.type.diskw=0;
    	$scope.type.io=0;
    	$scope.type.net=0;
    	$scope.type.netr=0;
    	$scope.type.netw=0;
    	$scope.type.netSpr=0;
    	$scope.type.netSpw=0;
    	EchartService.dispose(hostCpu,hostMem,hostDiskUtil,hostNet,hostNetr,hostNetw, hostNetSpr, hostNetSpw,hostDiskr,hostDiskw,hostIo, vcIo, vcNet);
        $scope.chartName = {hostNetSpr:[],hostNetSpw:[],hostDiskr:[],hostDiskw:[],hostDiskUtil:[]};
        $scope.chartData = {hostNetSpr:[],hostNetSpw:[],hostDiskr:[],hostDiskw:[],hostDiskUtil:[]};
    	$scope.chartName.hostNetSprSel = null;
    	$scope.chartName.hostNetSpwSel = null;
    	$scope.chartName.hostDiskrSel = null;
    	$scope.chartName.hostDiskwSel = null;
    	$scope.chartName.hostDiskUtilSel = null;
    	hostCpu = null;
    	hostMem = null;
    	hostDiskUtil = null;
    	hostNet = null;
    	hostNetr = null;
    	hostNetw = null;
    	hostNetSpr = null;
    	hostNetSpw = null;
    	hostDiskr = null;
    	hostDiskw = null;
    	hostIo = null;
    	vcIo = null;
    	vcNet = null;
    };
    $scope.setRateData = function(rateData, chartNames) {
		var j = 0;
		if (rateData != null) {			
			for (i in rateData) {
				var name = rateData[i].name;
				var flag = false;
				for (ii in chartNames) {
					if (name == chartNames[ii].label) {
						flag = true;
						break;
					}
				}
				if (!flag && name != "") {	
					var str = {value:j,label:name}; 
					chartNames[j] = str;
					j++;
				}
			}	
		} else {
			chartNames = [];
		}
    };
    
	$scope.getTomFormatDate = function(format){
    	var date = new Date();
    	date.setDate(date.getDate() -1);
    	date.setHours(23);
      	date.setMinutes(59);
      	date.setSeconds(59);
    	if (format == null) {
    		format = "yyyy-MM-dd";
    	}
        return date.Format(format);
    };
    $scope.tomTime = $scope.getTomFormatDate(null);
    $scope.model.startTime = $scope.tomTime;
	$scope.model.endTime = $scope.tomTime;
	
	
	$scope.$watch('model.cycle', function(newVal, oldVal) {
		switch (newVal) {
		case 0:
			$scope.dateFmt = "YYYY-MM-DD hh";
			$scope.isShowTime = true;
			break;
		case 2:
			$scope.dateFmt = "YYYY-MM-DD";
			$scope.isShowTime = false;
			break;
		case 3:
			$scope.dateFmt = "YYYY-MM";
			$scope.isShowTime = false;
			break;
		case 4:
			$scope.dateFmt = "YYYY";
			$scope.isShowTime = false;
			break;
		default:
			$scope.dateFmt = "YYYY-MM-DD";
			$scope.isShowTime = false;
			break;
		}
		$scope.resetDatePicker();
	});
	$scope.resetDatePicker = function() {		
		switch ($scope.model.cycle) {
		case 0:
			$scope.tomTime = $scope.model.startTime = $scope.model.endTime = $scope.getTomFormatDate("yyyy-MM-dd HH");
			break;
		case 3:			
			$scope.tomTime = $scope.model.startTime = $scope.model.endTime = $scope.getTomFormatDate("yyyy-MM");
			break;
		case 4:
			$scope.tomTime = $scope.model.startTime = $scope.model.endTime = $scope.getTomFormatDate("yyyy");
			break;
		default:
			if (!isEmpty($stateParams.startTime)) {
				$scope.model.startTime = $stateParams.startTime;
				$scope.model.endTime = $stateParams.endTime;
				$stateParams.startTime = null;
				$scope.tomTime = $scope.getTomFormatDate(null);
			} else {				
				$scope.model.endTime = $scope.model.startTime = $scope.tomTime = $scope.getTomFormatDate(null);
			}
		break;
		}
	 	$("#hostReportStartTime").val($scope.model.startTime);
    	$("#hostReportEndTime").val($scope.model.endTime);
	};
	
	//浏览器窗口resize的时候执行的函数
    var onResize = function() {
    	if ($scope.type.cpu == 1 && hostCpu) 
    		hostCpu.resize();
    	if ($scope.type.mem == 1 && hostMem) 
    		hostMem.resize();
    	if ($scope.type.net == 1 && hostNet) 
    		hostNet.resize();
    	if ($scope.type.netr == 1 && hostNetr) 
    		hostNetr.resize();
    	if ($scope.type.netw == 1 && hostNetw) 
    		hostNetw.resize();
    	if ($scope.type.netSpr == 1 && hostNetSpr) 
    		hostNetSpr.resize();
    	if ($scope.type.netSpw == 1 && hostNetSpw) 
    		hostNetSpw.resize();
    	if ($scope.type.diskr == 1 && hostDiskr) 
    		hostDiskr.resize();
    	if ($scope.type.diskw == 1 && hostDiskw) 
    		hostDiskw.resize();
    	if ($scope.type.io == 1 && hostIo) 
    		hostIo.resize();
    	if ($scope.type.vcio == 1 && vcIo)
    		vcIo.resize();
    	if ($scope.type.vcnet == 1 && vcNet)
    		vcNet.resize();
    	if ($scope.type.diskUtil == 1 && hostDiskUtil) 
    		hostDiskUtil.resize();
    };
    
  //监听大小改变事件，同步刷新图表
    $scope.$on('onNavClick', function(event, msg) {
        setTimeout(onResize, 100);
    });
    $(window).on("resize", onResize);
	
    $scope.$on("$destroy", function() {
    	$(window).off("resize", onResize);
    	EchartService.dispose(hostCpu,hostMem,hostDiskUtil,hostNet,hostNetr,hostNetw, hostNetSpr, hostNetSpw,hostDiskr,hostDiskw,hostIo, vcIo, vcNet);
    });
    
    $scope.exportReportPdf = function() {
    	if ($scope.currenthost.id == null || $scope.currenthost.id == "") {
    		UtilService.alert($translate.instant('selectHostTip'), 
    				$translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	var pdfConfig = {};
    	pdfConfig.fileName = "HostReportExport-" + getFormateDate() +".pdf";
    	pdfConfig.targetName = $translate.instant('report.hostReportTitle', {name: $scope.currenthost.name});
    	pdfConfig.urlArry = [];
    	var dataNOExist = false;
    	/*if (hostCpu || hostMem || hostDiskUtil || hostNet || hostNetr || hostNetw || hostNetSpr || hostNetSpw || hostDiskr || hostDiskw || hostIo) {
    		dataNOExist = true;
    	}*/
    	if ($scope.type.cpu == 0 && $scope.type.mem == 0 && Object.getOwnPropertyNames($scope.type).length == 2) {
    		dataNOExist = true;
    	}
    	if ($scope.type.cpu == 1 && hostCpu && hostCpu.getOption()) 
    		pdfConfig.urlArry.push(hostCpu.getDataURL());
    	if ($scope.type.mem == 1 && hostMem && hostMem.getOption()) 
    		pdfConfig.urlArry.push(hostMem.getDataURL());
    	if ($scope.type.vcio == 1 && vcIo && vcIo.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_VMWARE)
    		pdfConfig.urlArry.push(vcIo.getDataURL());
    	if ($scope.type.vcnet == 1 && vcNet && vcNet.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_VMWARE)
    		pdfConfig.urlArry.push(vcNet.getDataURL());
    	if ($scope.type.diskUtil == 1 && hostDiskUtil && hostDiskUtil.getOption()) 
    		pdfConfig.urlArry.push(hostDiskUtil.getDataURL());
    	if ($scope.type.net == 1 && hostNet && hostNet.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM)
    		pdfConfig.urlArry.push(hostNet.getDataURL());
    	if ($scope.type.netr == 1 && hostNetr && hostNetr.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostNetr.getDataURL());
    	if ($scope.type.netw == 1 && hostNetw && hostNetw.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostNetw.getDataURL());
    	if ($scope.type.netSpr == 1 && hostNetSpr && hostNetSpr.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostNetSpr.getDataURL());
    	if ($scope.type.netSpw == 1 && hostNetSpw && hostNetSpw.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostNetSpw.getDataURL());
    	if ($scope.type.diskr == 1 && hostDiskr && hostDiskr.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostDiskr.getDataURL());
    	if ($scope.type.diskw == 1 && hostDiskw && hostDiskw.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostDiskw.getDataURL());
    	if ($scope.type.io == 1 && hostIo && hostIo.getOption() && $scope.currenthost.cloudType == constant.PUBLIC_CLOUD_CVM) 
    		pdfConfig.urlArry.push(hostIo.getDataURL());
    	
    	if (dataNOExist && pdfConfig.urlArry.length == 0) {
    		UtilService.alert($translate.instant('report.queryFirst'), 
    				$translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	if (!dataNOExist && pdfConfig.urlArry.length == 0) {
    		UtilService.alert($translate.instant('report.noData'), 
    				$translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	
    	var waitModal = UtilService.wait();
    	$timeout(function(){
    	exportPdf4Img(pdfConfig);
        	waitModal.dismiss();
    	}, 100);
    };

    $scope.$watch("type.cpu", function(newValue, oldValue) {$scope.chartTypeChanged("type.cpu", newValue);});
    $scope.$watch("type.mem", function(newValue, oldValue) {$scope.chartTypeChanged("type.mem", newValue);});
    $scope.$watch("type.net", function(newValue, oldValue) {$scope.chartTypeChanged("type.net", newValue);});
    $scope.$watch("type.netr", function(newValue, oldValue) {$scope.chartTypeChanged("type.netr", newValue);});
    $scope.$watch("type.netSpr", function(newValue, oldValue) {$scope.chartTypeChanged("type.netSpr", newValue);});
    $scope.$watch("type.netw", function(newValue, oldValue) {$scope.chartTypeChanged("type.netw", newValue);});
    $scope.$watch("type.netSpw", function(newValue, oldValue) {$scope.chartTypeChanged("type.netSpw", newValue);});
    $scope.$watch("type.diskr", function(newValue, oldValue) {$scope.chartTypeChanged("type.diskr", newValue);});
    $scope.$watch("type.diskw", function(newValue, oldValue) {$scope.chartTypeChanged("type.diskw", newValue);});
    $scope.$watch("type.diskUtil", function(newValue, oldValue) {$scope.chartTypeChanged("type.diskUtil", newValue);});
    $scope.$watch("type.io", function(newValue, oldValue) {$scope.chartTypeChanged("type.io", newValue);});
    $scope.$watch("type.vcio", function(newValue, oldValue) {$scope.chartTypeChanged("type.vcio", newValue);});
    $scope.$watch("type.vcnet", function(newValue, oldValue) {$scope.chartTypeChanged("type.vcnet", newValue);});

    $scope.chartTypeChanged = function(type, newValue) {
        if (newValue != 1) {
            return;
        }
        var divId = "";
        var theEchart = null;
        switch (type) {
            case "type.cpu":
                divId = "hostReportCpu";
                theEchart = hostCpu;
                break;
            case "type.mem":
                divId = "hostReportMem";
                theEchart = hostMem;
                break;
            case "type.net":
                divId = "hostReportNet";
                theEchart = hostNet;
                break;
            case "type.netr":
                divId = "hostReportNetr";
                theEchart = hostNetr;
                break;
            case "type.netw":
                divId = "hostReportNetw";
                theEchart = hostNetw;
                break;
            case "type.netSpr":
                divId = "hostReportNetSpr";
                theEchart = hostNetSpr
                break;
            case "type.netSpw":
                divId = "hostReportNetSpw";
                theEchart = hostNetSpw
                break;
            case "type.diskr":
                divId = "hostReportDiskr";
                theEchart = hostDiskr;
                break;
            case "type.diskw":
                divId = "hostReportDiskw";
                theEchart = hostDiskw;
                break;
            case "type.diskUtil":
                divId = "hostReportDiskUtil";
                theEchart = hostDiskUtil;
                break;
            case "type.io":
                divId = "hostReportIo";
                theEchart = hostIo;
                break;
            case "type.vcio":
                divId = "vcenterReportIo";
                theEchart = vcIo;
                break;
            case "type.vcnet":
                divId = "vcenterReportNet";
                theEchart = vcNet;
                break;
            default:  // bad , should not be here;
        }
        if (theEchart !== null) {
            return;
        }
        $timeout(function() {
            theEchart = echarts.init(document.getElementById(divId)); // 为了getNoDataText函数正常工作
            getNoDataText(divId, $translate);
            switch (type) {
                case "type.cpu":  hostCpu = theEchart; break;
                case "type.mem":  hostMem = theEchart; break;
                case "type.net":  hostNet = theEchart; break;
                case "type.netr":  hostNetr = theEchart; break;
                case "type.netw":  hostNetw = theEchart; break;
                case "type.netSpr":  hostNetSpr = theEchart; break;
                case "type.netSpw":  hostNetSpw = theEchart; break;
                case "type.diskr":  hostDiskr = theEchart; break;
                case "type.diskw":  hostDiskw = theEchart; break;
                case "type.diskUtil":  hostDiskUtil = theEchart; break;
                case "type.io":  hostIo = theEchart; break;
                case "type.vcio":  vcIo = theEchart; break;
                case "type.vcnet":  vcNet = theEchart; break;
                default: break; // should not be here.
            }
        });
    };
});
//组织资源配额使用审计
routeApp.controller('orgResQuotaCtrl', function($scope, $http, $modal, $filter,$translate, $timeout, UtilService,GridService,HttpService) {
	var params = {};		
	var url = 'report/oreResQuota';
	$scope.params = {};
	var column = [
	              { field: 'org', displayName: $translate.instant('org.org'), sortable: true, width:'10%' ,cellTemplate:titleTemplate},
	              { field: 'orgCpu', displayName: $translate.instant('dashboard.orgCpu'), sortable: true, width:'7%'},
	              { field: 'orgCpuCur', displayName: $translate.instant('dashboard.orgCpuCur'), sortable: true, width:'7%'},
	              { field: 'cpuUtilRate', displayName: $translate.instant('dashboard.CPUUtilizationRate'), sortable: true,cellTemplate:progressTemplate, width:'7%'},
	              { field: 'orgMem', displayName: $translate.instant('dashboard.orgMem'), sortable: true, width:'7%', cellFilter:'byteUnitRender4'},
	              { field: 'orgMemCur', displayName: $translate.instant('dashboard.orgMemCur'), sortable: true, width:'7%', cellFilter:'byteUnitRender'},
	              { field: 'memUtilRate', displayName: $translate.instant('dashboard.memoryUtilizationRate'), sortable: true,cellTemplate:progressTemplate, width:'7%'},
	              { field: 'orgStorage', displayName: $translate.instant('dashboard.orgStorage'), sortable: true, width:'7%', cellFilter:'byteUnitRender4'},
	              { field: 'orgStorageCur', displayName: $translate.instant('dashboard.orgStorageCur'), sortable: true, width:'7%', cellFilter:'byteUnitRender'},
	              { field: 'storageUtilRate', displayName: $translate.instant('dashboard.storeUtilizationRate'), sortable: true,cellTemplate:progressTemplate, width:'7%'},
	              { field: 'orgVmCount', displayName: $translate.instant('dashboard.orgVmCount'), sortable: true, width:'7%', visible:false},
	              { field: 'orgVmCur', displayName: $translate.instant('dashboard.orgVmCur'), sortable: true, width:'7%', visible:false},
	              { field: 'vmUtilRate', displayName: $translate.instant('dashboard.vmUtilizationRate'), sortable: true,cellTemplate:progressTemplate, width:'7%', visible:false},
	              { field: 'time', displayName: $translate.instant('report.time'), sortable: true, width:'6%',cellTemplate:titleTemplate}
	              ]
	
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, params, null, null, 'orgResourceId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: true,
			showFilter: false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: true,
			showFooter: true,
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	};    
	
	// 刷新虚拟机回收站列表
	$scope.refreshList = function() {
		$scope.refreshPage();
	}
    // 高级搜索
    $scope.advancedQuery = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/common/advancedQuery.html',
            controller: 'advancedQueryCtrl',
            width:"520px",
            backdrop:'static',
            resolve: {
            	params : function() {
  	              return $scope.params;
  	          }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	if (angular.isDefined(selectedItem)) {
       		 $scope.params = selectedItem;
       		if ($scope.pagingOptions.currentPage != 1) {
   				$scope.pagingOptions.currentPage = 1;
   			} else {
   				$scope.refreshPage();
   			}
       	 	}
        }, function (reason) {
        	
        });
    }
    
    $scope.printOrExportList = function(type) {
    	
		var rateTemplate = function(rowData, key) {
			var str = $filter('number')(rowData[key], 2);
			return str+'%';
		};
		var byteUnitTemplate = function(rowData, key) {
			var str = $filter('byteUnitRender')(rowData[key]);
			return str;
		};
		var byteUnitTemplate4 = function(rowData, key) {
			var str = $filter('byteUnitRender4')(rowData[key]);
			return str;
		};
		
		
		var column = [
		              { field: 'org', displayName: $translate.instant('org.org'), sortable: true, width:'10%'},
		              { field: 'orgCpu', displayName: $translate.instant('dashboard.orgCpu'), sortable: true, width:'7%'},
		              { field: 'orgCpuCur', displayName: $translate.instant('dashboard.orgCpuCur'), sortable: true, width:'7%'},
		              { field: 'cpuUtilRate', displayName: $translate.instant('dashboard.CPUUtilizationRate'), cellTemplate:rateTemplate, sortable: true, width:'7%'},
		              { field: 'orgMem', displayName: $translate.instant('dashboard.orgMem'), sortable: true, width:'7%'},
		              { field: 'orgMemCur', displayName: $translate.instant('dashboard.orgMemCur'), sortable: true, width:'7%'},
		              { field: 'memUtilRate', displayName: $translate.instant('dashboard.memoryUtilizationRate'), cellTemplate:rateTemplate, sortable: true, width:'7%'},
		              { field: 'orgStorage', displayName: $translate.instant('dashboard.orgStorage'), sortable: true, width:'7%'},
		              { field: 'orgStorageCur', displayName: $translate.instant('dashboard.orgStorageCur'), sortable: true, width:'7%'},
		              { field: 'storageUtilRate', displayName: $translate.instant('dashboard.storeUtilizationRate'), cellTemplate:rateTemplate, sortable: true, width:'7%'},
		              { field: 'orgVmCount', displayName: $translate.instant('dashboard.orgVmCount'), sortable: true, width:'7%'},
		              { field: 'orgVmCur', displayName: $translate.instant('dashboard.orgVmCur'), sortable: true, width:'7%'},
		              { field: 'vmUtilRate', displayName: $translate.instant('dashboard.vmUtilizationRate'), cellTemplate:rateTemplate, sortable: true, width:'7%'},
		              { field: 'time', displayName: $translate.instant('report.time'), sortable: true, width:'6%'}
		              ];
		
		var getPrintOrExportData = function() {
			var waitAreaId = UtilService.areawait("orgResourceId");
			 var queryUrl = "report/oreResQuota?offset=0&limit=0";
			 var queryStr = "";
			 if($scope.params.id){
				 queryStr += "&id="+$scope.params.id;
			 }
			 if($scope.params.startTime){
				 queryStr += "&startTime="+$scope.params.startTime;
			 }
			 if($scope.params.endTime){
				 queryStr += "&endTime="+$scope.params.endTime;
			 }
			 if (queryStr) {
				 queryUrl += queryStr;
			 }
			$.ajax({
				type: "GET",
				dataType:"json",
				url: queryUrl,
				success: function(result) {
					     if (result != null && typeof result != 'undefined') {
					    	 UtilService.dismissAreawait(waitAreaId);
					    	 if (result.data) {
					    		 if (type == 0) {
					    			 var printConfig = {};
					    			 printConfig.data = {};
					    			 printConfig.data.body = result.data;
					    			 printConfig.data.header = column;
					    			 printTable(printConfig);
					    		 } else if (type == 1) {
					    			 var pdfConfig = {};
					    			 pdfConfig.data = {};
					    			 pdfConfig.fileName = "OrgResQuotaExport-" + getFormateDate() +".pdf";
					    			 pdfConfig.data.body = result.data;
					    			 pdfConfig.data.header = column;		
					    			 exportPdf(pdfConfig); 
					    		 } else if (type == 2) {
						    		 var excelConfig = {};
						    		 excelConfig.data = {};
						    		 excelConfig.fileName = "OrgResQuotaExport-" + getFormateDate() +".xlsx";
						    		 excelConfig.data.body = result.data;
						    		 excelConfig.data.header = column;		
						    		 exportXlsx(excelConfig); 
						    	 }
					    	 }
						}
				}
			});
		};
		getPrintOrExportData();
    };
});
//存储资源容量监控
routeApp.controller("storageResCapacityCtrl", function($rootScope, $scope, $window, $filter, $timeout, $http, $modal, $translate, UtilService, HttpService, EchartService) {
	$scope.resourcePool = {};
	$scope.resourcePool.name = $translate.instant('report.selectRespool');
	$scope.storagePool = {name : $translate.instant('report.selectStorage'), storageKey : undefined};
	var storagePoolKey;
	var ringChart = [];
	var onStorageResCapacityResize;
	var intervalFunc;
//	$scope.storagePools = [];
	//选择资源池
	$scope.selectRespool = function() {
		var modalInstance=$modal.open({
			templateUrl:'html/partials/resourcePool/resPoolList.html',
			backdrop:"static",
			controller:"selectResPoolCtrl",
			width:"420px",
			resolve: {
				resourcePoolId : function () {
					return $scope.resourcePool.id;
				}
			}
		  });
		  modalInstance.result.then(function(selectItem){
			  if (selectItem != null) {
				  $scope.resourcePool = selectItem;
			} 
		  },function(reason){
		      
		  });
	};
	//资源池值改变，则存储池清空
	$scope.$watch('resourcePool.id', function(newVal, oldVal) {
		if (newVal != null && newVal !='') {
			$scope.storagePool = {};
			$scope.storagePool.name =  $translate.instant('report.selectStorage');
			$scope.storagePool.storageKey = undefined;
		}
	});
	//选择存储池
	$scope.selectStoragePool = function() {
		//资源池为空则不能选择存储池
		if ($scope.resourcePool.id == null || $scope.resourcePool.id == "") {
			UtilService.alert($translate.instant('selectRespoolTip'),
					$translate.instant('common.opertip'), false, 'error');
			return;
		}
		
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"selectRespoolStorageCtrl",
			width:"720px",
			resolve: {
				rpId : function() {
					return $scope.resourcePool.id;
				}
			}
		  });
		  modalInstance.result.then(function(selectItem){
			  if (selectItem && angular.isArray(selectItem) && selectItem.length > 0) {
				  $scope.storagePool = {name : selectItem[0].name, storageKey : selectItem[0].storagePoolKey};
			  } 
		  },function(reason){
		      
		  });
	};

	// 设置查询参数
    $scope.searchReset = function() {
    	$scope.resourcePool = {};
    	$scope.resourcePool.name = $translate.instant('report.selectRespool');
    	$scope.storagePool = {};
    	$scope.storagePool.name =  $translate.instant('report.selectStorage');
    	$scope.storagePool.storageKey = undefined;
    }
    
    var queryStorageRes = function() {
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "report/storageResCapacity",
			data : {
				resourcePoolId : $scope.resourcePool.id,
				storageKey : $scope.storagePool.storageKey
			},
			success : function(result) {
				if (result != null && typeof result != 'undefined') {
					$timeout (function () {
						$scope.storagePools = result;
					});
					$timeout (function () {					
						for (var i = 0; i < result.length; i++) {
							var temp = document.getElementById('ringChart' + i);
							if (!temp) {
								continue;
							}
							ringChart[i] = echarts.init(temp, EchartService.noDataShow());
							EchartService.storageResCapacity(result[i], ringChart[i], i);
						}
					},10);
					onStorageResCapacityResize = function() {
						for (var m = 0 ; m < ringChart.length ; m++) {
							if (ringChart[m]) {
								ringChart[m].resize();
							}
						}
					};
					$(window).on('resize', onStorageResCapacityResize);
					//监听大小改变事件，同步刷新图表
					$scope.$on(constant.onNavClick, function(event, msg) {
						setTimeout(onStorageResCapacityResize(), 100);
					});
				}
			}
		});
	}
    
    $scope.queryStorageResCapacity = function() {
    	
		if ($scope.resourcePool.id == null || $scope.resourcePool.id == "") {
			UtilService.alert($translate.instant('selectRespoolTip'),
					$translate.instant('common.opertip'), false, 'error');
			return;
		}
		//清理定时器
		clearInterval(intervalFunc);
//		intervalFunc = undefined;
		queryStorageRes();
		intervalFunc = setInterval(queryStorageRes, $scope.cycle);
	};
	
	$scope.$on("$destroy", function() {
			clearInterval(intervalFunc);
			intervalFunc = undefined;
			
			for (var m = 0 ; m < ringChart.length ; m++) {
				if (ringChart[m]) {
					//销毁echarts实例
					EchartService.dispose(ringChart[m]);
				}
			}
			ringChart = [];
			$(window).off('resize', onStorageResCapacityResize);
	});
	
});
//虚拟机使用量明细
routeApp.controller('vmUsageQueryCtrl', function($scope, $http, $modal, $filter, $translate, $timeout, UtilService, GridService, HttpService) {
	var url = 'report/vmUsage';
	/*$scope.$on(constant.onAdvancedQueryVmUsage, function(event, msg) {
		$scope.params = {};
		if (angular.isDefined(msg)) {
			if (angular.isDefined(msg.orgId)) {
				$scope.params.orgId = msg.orgId;
			}
			if (angular.isDefined(msg.startTime)) {
				$scope.params.startTime = msg.startTime;
			}
			if (angular.isDefined(msg.endTime)) {
				$scope.params.endTime = msg.endTime;
			}
		}
	
	});*/
	var memTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = {{row.entity[col.field]|byteUnitRender}}><span ng-cell-text >{{row.entity[col.field]|byteUnitRender}}</span></div>';
	var capacityTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = {{row.entity[col.field]|byteUnitRender3}}><span ng-cell-text >{{row.entity[col.field]|byteUnitRender3}}</span></div>';
	var dateTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = \'{{row.entity[col.field]|date:"yyyy-MM-dd HH:mm:ss"}}\'><span ng-cell-text >{{row.entity[col.field]|date:"yyyy-MM-dd HH:mm:ss"}}</span></div>';
	var uptimeTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = {{row.entity[col.field]|uptime2}}><span ng-cell-text >{{row.entity[col.field]|uptime2}}</span></div>';
	var column = [{ field: 'title', displayName: $translate.instant('vm.storagepoolModal.title') , sortable: true, width:'12%',cellTemplate:titleTemplate},
	              { field: 'name', displayName: $translate.instant('User') , sortable: true, width:'10%',cellTemplate:titleTemplate, visible: false},
                  { field: 'orgName', displayName: $translate.instant('common.organization') , sortable: true, width:'9%',cellTemplate:titleTemplate},
                  { field: 'userGrpName', displayName: $translate.instant('operator.groupName') , sortable: true, width:'8%',cellTemplate:titleTemplate},
                  { field: 'userName', displayName: $translate.instant('common.userName') , sortable: true, width:'8%',cellTemplate:titleTemplate},
                  { field: 'cpu', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'6%'},
                  { field: 'memory', displayName: $translate.instant('vm.memory'), sortable: true, width:'6%',cellFilter:'byteUnitRender', cellTemplate:memTemplate},
                  { field: 'storageCapacity', displayName: $translate.instant('vmware.storageCapacity'), sortable: true, width:'8%',cellFilter:'byteUnitRender3', cellTemplate:capacityTemplate},
                  { field: 'startTime', displayName: $translate.instant('common.bootTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'11%', cellTemplate:dateTemplate},
                  { field: 'endTime', displayName: $translate.instant('common.shutdownTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'11%', cellTemplate:dateTemplate},
                  { field: 'upTime', displayName: $translate.instant('common.runTime'), sortable: true, width:'11%',cellFilter:'uptime2', cellTemplate:uptimeTemplate}];
	
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, $scope.params, null, null, 'vmUsageId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: true,
			showFilter: false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: true,
			showFooter: true,
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			columnDefs:column
	};    
	
	// 刷新列表
	$scope.refreshList = function() {
		$scope.refreshPage();
	}
    // 高级搜索
    $scope.advancedQuery = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/common/advancedQuery2.html',
            controller: 'advancedQueryForVmCtrl',
            width:"520px",
            backdrop:'static',
            resolve: {
            	params : function() {
            		return $scope.lastFilter;
            	},
	          	type : function() {
                	return undefined;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	if (selectedItem) {
      			 $scope.params = selectedItem;
      			 $scope.lastFilter = selectedItem;
      			if ($scope.pagingOptions.currentPage != 1) {
      				$scope.pagingOptions.currentPage = 1;
      			} else {
      				$scope.refreshPage();
      			}
      		 }
        }, function (reason) {
        	
        });
    }
    
    $scope.printOrExportList = function(type) {
    	
		
		var byteUnitTemplate = function(rowData, key) {
			var str = $filter('byteUnitRender')(rowData[key]);
			return str;
		}
		
		var byteUnitTemplate3 = function(rowData, key) {
			var str = $filter('byteUnitRender3')(rowData[key]);
			return str;
		};
		
		var uptime2 = function(rowData, key) {
			var str = $filter('uptime2')(rowData[key]);
			return str;
		};
		var dateTemplate = function(rowData, key) {
			var str = $filter('date')(rowData[key], "yyyy-MM-dd HH:mm:ss");
			return str;
		 };
		var vmTitleTemplate = function(rowData, key) {
			var str = rowData[key] == null ? rowData["name"] : rowData[key];
			return str;
		}
		
		var column = [{ field: 'title', displayName: $translate.instant('vm.storagepoolModal.title') , sortable: true, width:'10%',cellTemplate:vmTitleTemplate},
		              { field: 'name', displayName: $translate.instant('name') , sortable: true, width:'10%',cellTemplate:null},
		              { field: 'orgName', displayName: $translate.instant('common.organization') , sortable: true, width:'9%',cellTemplate:null},
	                  { field: 'userGrpName', displayName: $translate.instant('operator.groupName') , sortable: true, width:'8%',cellTemplate:null},
	                  { field: 'userName', displayName: $translate.instant('common.userName') , sortable: true, width:'8%',cellTemplate:null},
	                  { field: 'cpu', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'6%'},
	                  { field: 'memory', displayName: $translate.instant('vm.memory'), sortable: true, width:'6%',cellTemplate:byteUnitTemplate},
	                  { field: 'storageCapacity', displayName: $translate.instant('vmware.storageCapacity'), sortable: true, width:'10%',cellTemplate:byteUnitTemplate3},
	                  { field: 'startTime', displayName: $translate.instant('common.bootTime'), cellTemplate: dateTemplate, sortable: true, width:'11%'},
	                  { field: 'endTime', displayName: $translate.instant('common.shutdownTime'), cellTemplate: dateTemplate, sortable: true, width:'11%'},
	                  { field: 'upTime', displayName: $translate.instant('common.runTime'), sortable: true, width:'11%',cellTemplate:uptime2}];
		
		
		var getPrintOrExportData = function() {
			var waitAreaId = UtilService.areawait("vmUsageId");
			 var queryUrl = "report/vmUsage?";
			 var queryStr = "";
			 if($scope.params.orgId){
				 queryStr += "orgId="+$scope.params.orgId+"&";
			 }
			 if($scope.params.startTime){
				 queryStr += "startTime="+$scope.params.startTime+"&";
			 }
			 if($scope.params.endTime){
				 queryStr += "endTime="+$scope.params.endTime+"&";
			 }
			 if ($scope.params.userId) {
				 queryStr += "userId=" + $scope.params.userId+"&";
			 }
			 if ($scope.params.userGrpId) {
				 queryStr += "userGrpId=" + $scope.params.userGrpId + "&";
			 }
			 if ($scope.params.nameOrTitle) {
				 queryStr += "nameOrTitle=" + $scope.params.nameOrTitle + "&";
			 }
			 if (queryStr) {
				 queryUrl += queryStr;
			 }
			$.ajax({
				type: "GET",
				dataType:"json",
				url: queryUrl,
				success: function(result) {
					     // var datas = result.data;
					     UtilService.dismissAreawait(waitAreaId);
					     if (result.data) {
					    	 if (type == 0) {
								 var printConfig = {};
								 printConfig.data = {};
								 printConfig.data.body = result.data;
								 printConfig.data.header = column;
							     printTable(printConfig);
					    	 } else if (type == 1) {
						    	 var pdfConfig = {};
						    	 pdfConfig.data = {};
						    	 pdfConfig.fileName = "VmUsage-" + getFormateDate() +".pdf";
						    	 pdfConfig.data.body = result.data;
						    	 pdfConfig.data.header = column;		
						    	 exportPdf(pdfConfig); 
						     } else if (type == 2) {
					    		 var excelConfig = {};
					    		 excelConfig.data = {};
					    		 excelConfig.fileName = "VmUsage-" + getFormateDate() +".xlsx";
					    		 excelConfig.data.body = result.data;
					    		 excelConfig.data.header = column;		
					    		 exportXlsx(excelConfig); 
					    	 }
						}
				}
			});
		};
		getPrintOrExportData();
    };
});
//虚拟机使用量汇总
routeApp.controller('vmUsageSummaryQueryCtrl', function($scope, $http, $modal, $filter, $translate, $timeout, $state, UtilService, GridService, HttpService) {
	var params = {};
	var url = 'report/vmUsageSummary';
	$scope.lastFilter = {};
	var memTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = {{row.entity[col.field]|byteUnitRender}}><span ng-cell-text >{{row.entity[col.field]|byteUnitRender}}</span></div>';
	var capacityTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = {{row.entity[col.field]|byteUnitRender3}}><span ng-cell-text >{{row.entity[col.field]|byteUnitRender3}}</span></div>';
	var dateTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = \'{{row.entity[col.field]|date:"yyyy-MM-dd HH:mm:ss"}}\'><span ng-cell-text >{{row.entity[col.field]|date:"yyyy-MM-dd HH:mm:ss"}}</span></div>';
	var uptimeTemplate  = '<div class="ngCellText" ng-class="col.colIndex()" custom-title = {{row.entity[col.field]|uptime2}}><span ng-cell-text >{{row.entity[col.field]|uptime2}}</span></div>';
	var column = [{ field: 'title', displayName: $translate.instant('vm.storagepoolModal.title') , sortable: true, width:'13%',cellTemplate:titleTemplate},
	              { field: 'name', displayName: $translate.instant('name') , sortable: true, width:'14%',cellTemplate:titleTemplate, visible: false},
                  { field: 'orgName', displayName: $translate.instant('common.organization') , sortable: true, width:'11%',cellTemplate:titleTemplate},
                  /*{ field: 'userGrpName', displayName: $translate.instant('operator.groupName') , sortable: true, width:'8%',cellTemplate:titleTemplate},
                  { field: 'userName', displayName: $translate.instant('common.userName') , sortable: true, width:'8%',cellTemplate:titleTemplate},*/
                  { field: 'cpu', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'8%'},
                  { field: 'memory', displayName: $translate.instant('vm.memory'), sortable: true, width:'8%',cellFilter:'byteUnitRender', cellTemplate:memTemplate},
                  { field: 'storageCapacity', displayName: $translate.instant('vmware.storageCapacity'), sortable: true, width:'10%',cellFilter:'byteUnitRender3', cellTemplate:capacityTemplate},
                  { field: 'startTime', displayName: $translate.instant('common.bootTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'12%', cellTemplate:dateTemplate},
                  { field: 'endTime', displayName: $translate.instant('common.shutdownTime'), cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',sortable: true, width:'12%', cellTemplate:dateTemplate},
                  { field: 'upTime', displayName: $translate.instant('common.totalRunTime'), sortable: true, width:'12%',cellFilter:'uptime2', cellTemplate:uptimeTemplate}];
	
	// 动态调整表格大小
	$scope.listStyle = $scope.gridStyle(LIST_HEIGHT_ADD_90);
	listenNavClick($scope, $timeout, LIST_HEIGHT_ADD_90);
	
	$scope = GridService.grid($scope, url, params, null, null, 'vmUsageSummaryId');
	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	$scope.gridOptions = {
			data: 'myData',
			jqueryUITheme: false,
			jqueryUIDraggable: false,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: false,
			multiSelect: false,
			showGroupPanel: false,
			showColumnMenu: true,
			showFilter: false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			enablePaging: true,
			showFooter: true,
			i18n: $translate.instant('lang'),
			totalServerItems: 'totalServerItems',
			filterOptions: $scope.filterOptions,
			pagingOptions: $scope.pagingOptions,
			rowTemplate: doubleClickTemplate,    //双击行模板
			columnDefs:column
	};    
	
	$scope.jump = function(entity) {
		$scope.stateParams = {};
		$scope.stateParams.vmKey = entity.vmKey;
		$scope.stateParams.publicCloudId = entity.publicCloudId;
		$scope.stateParams.nameOrTitle = entity.title;
		if (!isEmpty($scope.lastFilter.startTime)) {
			$scope.stateParams.startTime = $scope.lastFilter.startTime;
		}
		if (!isEmpty($scope.lastFilter.endTime)) {
			$scope.stateParams.endTime = $scope.lastFilter.endTime;
		}
		$state.go('main.vmUsage', $scope.stateParams);
	}
	
	// 刷新列表
	$scope.refreshList = function() {
		$scope.refreshPage();
	}
    // 高级搜索
    $scope.advancedQuery = function() {
        var modalInstance = $modal.open({
            templateUrl: 'html/modal/common/advancedQuery2.html',
            controller: 'advancedQueryForVmCtrl',
            width:"520px",
            backdrop:'static',
            resolve: {
            	params : function() {
            		return $scope.lastFilter;
            	},
	          	type : function() {
                	return 'summary';
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        	if (selectedItem) {
      			 $scope.params = selectedItem;
      			 $scope.lastFilter = selectedItem;
      			if ($scope.pagingOptions.currentPage != 1) {
      				$scope.pagingOptions.currentPage = 1;
      			} else {
      				$scope.refreshPage();
      			}
      		 }
        }, function (reason) {
        });
    }
    
    $scope.printOrExportList = function(type) {
		var byteUnitTemplate = function(rowData, key) {
			var str = $filter('byteUnitRender')(rowData[key]);
			return str;
		}
		var byteUnitTemplate3 = function(rowData, key) {
			var str = $filter('byteUnitRender3')(rowData[key]);
			return str;
		};
		var uptime2 = function(rowData, key) {
			var str = $filter('uptime2')(rowData[key]);
			return str;
		};
		var dateTemplate = function(rowData, key) {
			var str = $filter('date')(rowData[key], "yyyy-MM-dd HH:mm:ss");
			return str;
		 };
		var vmTitleTemplate = function(rowData, key) {
			var str = rowData[key] == null ? rowData["name"] : rowData[key];
			return str;
		}
		var column = [{ field: 'title', displayName: $translate.instant('vm.storagepoolModal.title') , sortable: true, width:'10%',cellTemplate:vmTitleTemplate},
		              { field: 'name', displayName: $translate.instant('name') , sortable: true, width:'10%',cellTemplate:null},
		              { field: 'orgName', displayName: $translate.instant('common.organization') , sortable: true, width:'9%',cellTemplate:null},
	                  { field: 'userGrpName', displayName: $translate.instant('operator.groupName') , sortable: true, width:'8%',cellTemplate:null},
	                  { field: 'userName', displayName: $translate.instant('common.userName') , sortable: true, width:'8%',cellTemplate:null},
	                  { field: 'cpu', displayName: $translate.instant('vm.vCpu'), sortable: true, width:'6%'},
	                  { field: 'memory', displayName: $translate.instant('vm.memory'), sortable: true, width:'6%',cellTemplate:byteUnitTemplate},
	                  { field: 'storageCapacity', displayName: $translate.instant('vmware.storageCapacity'), sortable: true, width:'10%',cellTemplate:byteUnitTemplate3},
	                  { field: 'startTime', displayName: $translate.instant('common.bootTime'), cellTemplate: dateTemplate, sortable: true, width:'11%'},
	                  { field: 'endTime', displayName: $translate.instant('common.shutdownTime'), cellTemplate: dateTemplate, sortable: true, width:'11%'},
	                  { field: 'upTime', displayName: $translate.instant('common.runTime'), sortable: true, width:'11%',cellTemplate:uptime2}];
		
		
		var getPrintOrExportData = function() {
			var waitAreaId = UtilService.areawait("vmUsageSummaryId");
			 var queryUrl = "report/vmUsageSummary?";
			 var queryStr = "";
			 if($scope.params.startTime){
				 queryStr += "startTime="+$scope.params.startTime+"&";
			 }
			 if($scope.params.endTime){
				 queryStr += "endTime="+$scope.params.endTime+"&";
			 }
			 if ($scope.params.nameOrTitle) {
				 queryStr += "nameOrTitle=" + $scope.params.nameOrTitle + "&";
			 }
			 if (queryStr) {
				 queryUrl += queryStr;
			 }
			$.ajax({
				type: "GET",
				dataType:"json",
				url: queryUrl,
				success: function(result) {
					     UtilService.dismissAreawait(waitAreaId);
					     if (result.data) {
					    	 if (type == 0) {
								 var printConfig = {};
								 printConfig.data = {};
								 printConfig.data.body = result.data;
								 printConfig.data.header = column;
							     printTable(printConfig);
					    	 } else if (type == 1) {
						    	 var pdfConfig = {};
						    	 pdfConfig.data = {};
						    	 pdfConfig.fileName = "VmUsageSummary-" + getFormateDate() +".pdf";
						    	 pdfConfig.data.body = result.data;
						    	 pdfConfig.data.header = column;		
						    	 exportPdf(pdfConfig); 
						     } else if (type == 2) {
					    		 var excelConfig = {};
					    		 excelConfig.data = {};
					    		 excelConfig.fileName = "VmUsageSummary-" + getFormateDate() +".xlsx";
					    		 excelConfig.data.body = result.data;
					    		 excelConfig.data.header = column;		
					    		 exportXlsx(excelConfig); 
					    	 }
						}
				}
			});
		};
		getPrintOrExportData();
    };
});
//趋势分析控制器
routeApp.controller("trendAnalysisCtrl", function($rootScope, $scope, $http, $timeout, $window, $modal, $translate, UtilService, HttpService, EchartService) {
	$scope.currentrespool = {name : $translate.instant('report.selectRespool'), id : ""};
	// cpu内存的echarts实例数组
	var cpuMemTrendArrayDom = [];
	// 存储的echarts实例数组
    var storageTrendArrayDom = [];
	var initData = function () {
		var params = {};
        $http({
            method  : 'GET',
            url     : 'resourcePool/queryList',
            params  : params}).
        success(function(result) {
        	if (result != null && typeof result != 'undefined') {
        		if (result.state == 0) {
                    $scope.resourcePools = result.data;
                    init();
                }
                UtilService.handleResult(result);
        	}
         }).error(function(data, code, headers, cfg) {
             UtilService.handleError(code);
         });
	}
	initData();
	
	var init = function () {
			$.ajax({
				   type: "GET",
				   dataType: "json",
				   url: "report/cpuMemTrend",
				   data:  {id: $scope.resourcePoolIdList},
				   success: function(result){
				     if (result != null && typeof result != 'undefined') {
					 	for (var i = 0; i < result.length; i++) {
					   		var hostCpuMemDom = document.getElementById('hostCpuMem' + result[i].resourcePoolId);
					   		if (!hostCpuMemDom) {
					   			continue;
					   		}
					   		cpuMemTrendArrayDom[i] = echarts.init(hostCpuMemDom);
					   		EchartService.drawCpuMemStorageTrends(result[i].trendRates, cpuMemTrendArrayDom[i], 'hostCpuMem' + result[i].resourcePoolId);
					   	}
				     }
				   }
			});	
			$.ajax({
				   type: "GET",
				   dataType: "json",
				   url: "report/storageTrend",
				   data:  {id: $scope.resourcePoolIdList},
				   success: function(result){
					 if (result != null && typeof result != 'undefined') {
					   	for (var i = 0 ; i < result.length; i++) {
					   		var storageDom = document.getElementById('storage' + result[i].resourcePoolId);
					   		if (!storageDom) {
					   			continue;
					   		}
					   		storageTrendArrayDom[i] = echarts.init(storageDom);
					   		EchartService.drawCpuMemStorageTrends(result[i].trendRates, storageTrendArrayDom[i], 'storage' + result[i].resourcePoolId);
					   	}
					  }
				   }
			});
	};
	var onCpuMemTrendResize = function() {
   		for (var m = 0 ; m < cpuMemTrendArrayDom.length ; m++) {
   			if (cpuMemTrendArrayDom[m]) {
   				cpuMemTrendArrayDom[m].resize();
   			}
   		}
    };
	var onStorageTrendResize = function() {
   		for (var n = 0; n < storageTrendArrayDom.length ; n++) {
   			if (storageTrendArrayDom[n]) {
	   			storageTrendArrayDom[n].resize();
   			}
   		}
    };
    $(window).on('resize', function(){
    	onCpuMemTrendResize();
    	onStorageTrendResize();
    });
    //监听大小改变事件，同步刷新图表
    $scope.$on(constant.onNavClick, function(event, msg) {
        setTimeout(function () {
        	onCpuMemTrendResize();
        	onStorageTrendResize();
        }, 100);
    });
    $scope.$on("$destroy", function() {
    	$(window).off('resize', function(){
        	onCpuMemTrendResize();
        	onStorageTrendResize();
        });
    	for (var m = 0 ; m < cpuMemTrendArrayDom.length ; m++) {
   			if (cpuMemTrendArrayDom[m]) {
   				EchartService.dispose(cpuMemTrendArrayDom[m]);
   			}
   		}
    	for (var m = 0 ; m < storageTrendArrayDom.length ; m++) {
   			if (storageTrendArrayDom[m]) {
   				EchartService.dispose(storageTrendArrayDom[m]);
   			}
   		}
    	cpuMemTrendArrayDom = [];
    	storageTrendArrayDom = [];
    });
	
	//选择资源池
	$scope.selectRespool = function() {
		var modalInstance=$modal.open({
			templateUrl:'html/partials/resourcePool/resPoolList.html',
			backdrop:"static",
			controller:"selectResPoolCtrl",
			width:"420px",
			resolve: {
				resourcePoolId : function() {
					return $scope.currentrespool.id;
				}
			}
		  });
		  modalInstance.result.then(function(selectItem){
			  if (selectItem != null) {
				  $scope.currentrespool.id = selectItem.id;
				  $scope.currentrespool.name = selectItem.name;
			  }
		  },function(reason){
		  });
	};
	// 查询
    $scope.queryReport = function() {
		// 重置资源池ID数组
		$scope.resourcePoolIdList = [];
		// 重置资源池数组
		$scope.resourcePools = [];
    	if ($scope.currentrespool.id != '') {
    		// 资源池数组赋值
    		$scope.resourcePools.push($scope.currentrespool);
    		// 资源池ID数组赋值
    		$scope.resourcePoolIdList.push($scope.currentrespool.id);
    		init();
    	} else {
    		initData();
    	}
    };
    $scope.searchReset = function() {
    	$scope.currentrespool = {name : $translate.instant('report.selectRespool'), id : ""};
    };
});
//风险评估控制器
routeApp.controller("riskAssessmentCtrl", function($rootScope, $scope, $http, $timeout, $window, $modal, $translate, UtilService, HttpService, EchartService) {
	$scope.model = {};
	$scope.model.topNum = "";
	$scope.currentrespool = {name : $translate.instant('report.selectRespool'), id : ""};
	$scope.levels = {
			topNOptions:[{value:"",label:$translate.instant('monitorMng.chooseTopN')}, {value:5,label:5},{value:10,label:10},{value:15,label:15}]
	};
	// 风险评估的echarts实例数组
	var riskAssessmentArrayDom = [];
	// 选择资源池检测
	$scope.$watch('currentrespool.id', function(newVal, oldVal) {
		if (!isEmpty(newVal)) {
			$scope.model.topNum = "";
		}
	});
	// 选择TOPN检测
	$scope.$watch('model.topNum', function(newVal, oldVal) {
		if (!isEmpty(newVal)) {
			$scope.currentrespool = {name : $translate.instant('report.selectRespool'), id : ""};
			$scope.currentrespool.idArray = [];
		}
	});
	var init = function () {
		$.ajax({
			   type: "GET",
			   dataType: "json",
			   url: "report/riskAssessment",
			   data: {id: $scope.model.resourcePoolIdList,
				      topNum: $scope.model.topNum
				     },
			   success: function(result){
				 if (result != null && typeof result != 'undefined') {
				    $timeout (function () {
					    var resourcePools = [];
						for (var i = 0; i < result.length; i++) {
					   		var resourcePool = {};
					   		resourcePool.id = result[i].resourcePoolId;
					   		resourcePool.name = result[i].resourcePoolName;
					   		resourcePools.push(resourcePool);
						}
						$scope.resourcePools = resourcePools;
				    });
					
					$timeout (function () {
					   	for (var i = 0; i < result.length; i++) {
					   		var riskAssessmentDom = document.getElementById('riskAssessmentPic' + result[i].resourcePoolId);
					   		if (!riskAssessmentDom) {
					   			continue;
					   		}
					   		riskAssessmentArrayDom[i] = echarts.init(riskAssessmentDom);
					   		EchartService.drawRiskAssessment(result[i], riskAssessmentArrayDom[i]);
					   	}
					}, 10);
				  }
			   }
		});
	};
	init();

   	var onRiskAssessmentResize = function() {
   		for (var j = 0 ; j < riskAssessmentArrayDom.length ; j++) {
   			if (riskAssessmentArrayDom[j]) {
	   			riskAssessmentArrayDom[j].resize();
   			}
   		}
    };
    $(window).on('resize', onRiskAssessmentResize);
    //监听大小改变事件，同步刷新图表
    $scope.$on(constant.onNavClick, function(event, msg) {
        setTimeout(onRiskAssessmentResize(), 100);
    });
	
    $scope.$on("$destroy", function() {
    	$(window).off('resize', onRiskAssessmentResize);
    	for (var m = 0 ; m < riskAssessmentArrayDom.length ; m++) {
   			if (riskAssessmentArrayDom[m]) {
   				EchartService.dispose(riskAssessmentArrayDom[m]);
   			}
   		}
    	riskAssessmentArrayDom = [];
    });
	
	//选择资源池
	$scope.selectRespool = function() {
		var modalInstance=$modal.open({
			templateUrl:'html/partials/resourcePool/resPoolList.html',
			backdrop:"static",
			controller:"selectResPoolCtrl",
			width:"420px",
			resolve: {
				resourcePoolId : function() {
					return $scope.currentrespool.id;
				}
			}
		  });
		modalInstance.result.then(function(selectItem){
			$scope.currentrespool.idArray = [];
			if (selectItem != null) {
				$scope.currentrespool.id = selectItem.id;
				$scope.currentrespool.name = selectItem.name;
				$scope.currentrespool.idArray.push($scope.currentrespool.id);
			}
		},function(reason){
		});
	};
	// 报表查询
    $scope.queryReport = function() {
    	if ($scope.currentrespool.idArray != null && $scope.currentrespool.idArray.length > 0) {
        	$scope.model.resourcePoolIdList = $scope.currentrespool.idArray;
    	}
    	init();
    };
    // 查询条件重置
    $scope.searchReset = function() {
    	$scope.model = {};
    	$scope.model.topNum = "";
    	$scope.currentrespool.id = "";
		$scope.currentrespool.name = $translate.instant('report.selectRespool');
		$scope.currentrespool.idArray = [];
    	
    };
});
//组织资源配额中 高级查询控制器
routeApp.controller('advancedQueryCtrl',function($scope, $http, $rootScope, $modal, $filter,$translate, $timeout, $modalInstance, params, UtilService,GridService,HttpService) {
	  $scope.org = {};
	  if (params != null && angular.isDefined(params)) {
		  if (!isEmpty(params.id)) {
			  $scope.org.id = params.id;
		  }
		  if (!isEmpty(params.name)) {
			  $scope.org.name = params.name;
		  }
		  $timeout(function() {
			  $("#satrtTimeInput").val(params.startTime);
			  if (!isEmpty(params.startTime)) {
				  var d = new Date();
				  d.setYear(parseInt(params.startTime.substring(0, 4)));
				  d.setMonth(parseInt(params.startTime.substring(5, 7))-1);
				  d.setDate(parseInt(params.startTime.substring(8, 10)));
				  $scope.endMinDate = d;
				  $scope.org.startTime = params.startTime;
			  }
			  $("#endTimeInput").val(params.endTime);
			  if (!isEmpty(params.endTime)) {
				  var d = new Date();
				  d.setYear(parseInt(params.endTime.substring(0, 4)));
				  d.setMonth(parseInt(params.endTime.substring(5, 7))-1);
				  d.setDate(parseInt(params.endTime.substring(8, 10)));
				  $scope.startMaxDate = d;
				  $scope.org.endTime = params.endTime;
			  }
		  })
		  
	  }
	  
	  $scope.getTomFormatDate = function(format){
	        var date = new Date();
	        date.setDate(date.getDate() - 1);
	        if (format == null) {
	            format = "yyyy-MM-dd";
	        }
	        return date.Format(format);
	    };
	  $scope.tomTime = $scope.getTomFormatDate(null);
	  $scope.startMaxDate = $scope.tomTime;
	  $scope.endMaxDate = $scope.tomTime;
	  $timeout(function(){
		  $("#satrtTimeInput").change(function(){
				var value = $("#satrtTimeInput").val();
				if (value != "") {
					var d = new Date();
					d.setYear(parseInt(value.substring(0, 4)));
					d.setMonth(parseInt(value.substring(5, 7))-1);
					d.setDate(parseInt(value.substring(8, 10)));
					$scope.endMinDate = d;
				} else {
					$scope.endMinDate = undefined;
				}
				$scope.$digest();
			});
			$("#endTimeInput").change(function(){
				var value = $("#endTimeInput").val();
				if (value != "") {
					var d = new Date();
					d.setYear(parseInt(value.substring(0, 4)));
					d.setMonth(parseInt(value.substring(5, 7))-1);
					d.setDate(parseInt(value.substring(8, 10)));
					$scope.startMaxDate = d;
				} else {
					$scope.startMaxDate = undefined;
				}
				$scope.$digest();
			});
	  });
	  // 选择组织
	  $scope.selectOrg = function() {
		var resolve = {
			params: function () {return null;}
		};
		var orgInstance = UtilService.modal('html/modal/common/selectSingle.html', 'selectSingleOrganizeCtrl', resolve, '712px');
		orgInstance.result.then(function(org) {
			if (angular.isDefined(org) && org != null) {
				$scope.org.id = org[0].id;
				$scope.org.name = org[0].name;
			}
		}, function() {
		});
	  }
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };   
    $scope.ok = function() {
        var params = {};
        if (!isEmpty($scope.org.id)){
        	params.id = $scope.org.id;
        }
        if (!isEmpty($scope.org.name)){
        	params.name = $scope.org.name;
        }
        if (!isEmpty($scope.org.startTime)){
        	params.startTime = $scope.org.startTime;
        }
        if (!isEmpty($scope.org.endTime)){
        	params.endTime = $scope.org.endTime;
        }
        $modalInstance.close(params);
    };
    $scope.reset = function() {
    	$scope.org = {};
    	$("#satrtTimeInput").val("");
    	$("#endTimeInput").val("");
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});
//选择组织列表控制器
routeApp.controller('selectOrgForQuotaCtrl',function($scope, $http, orgId, $modal, $translate, $modalInstance,UtilService) {
    $scope.srcOrgId = orgId;
    $scope.$on("selectSvg", function(){
        $scope.ok();
    })
    $scope.ok=function(){
        $modalInstance.close($scope.selectedOrg);
    };  
    $scope.cancel=function(){
        $modalInstance.dismiss("cancel");
    };
});
//选择资源池列表控制器
routeApp.controller('selectResPoolCtrl',function($scope, $http, resourcePoolId, $modal, $translate, $modalInstance,UtilService) {
	$scope.srcResPoolId = resourcePoolId;
	$scope.$on("selectSvg", function(){
		$scope.ok();
	})
	$scope.ok=function(){
		$modalInstance.close($scope.selectedResPool);
	};  
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//选择存储池列表控制器
routeApp.controller('selectStoragePoolCtrl',function($scope, $http, resourcePoolId, $modal, $translate, $modalInstance,UtilService) {
	$scope.srcResourcePoolId = resourcePoolId;
	$scope.$on("selectSvg", function(){
		$scope.ok();
	})
	$scope.ok=function(){
		$modalInstance.close($scope.selectedStoragePool);
	};  
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
routeApp.controller('selectHostInRespoolCtrl', function($scope, $http, hostId, $modal, $translate, $modalInstance, $timeout, UtilService, GridService) {
	$scope.title=$translate.instant('cluster.selectHost');
	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'40%', cellTemplate:titleTemplate},
                  { field: 'status', displayName: $translate.instant('common.state'), sortable: true, width:'20%', cellTemplate:hoststatusTemplate($translate)},
                  { field: 'resourcePoolName', displayName : $translate.instant("virdesk.resourcePool"), sortable: true, width: '20%', cellTemplate: titleTemplate},
                  { field: 'publicCloudType', displayName: $translate.instant('cloudResource.cloudResourceType'), sortable: true, width:"20%", cellFilter:'cloudType'}
                  ];
	$scope.mySelections = [];
	var params = {};
	var url = "report/respoolHosts";
	$scope = GridService.grid($scope, url, params);
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            showSelectionCheckbox: false,
            multiSelect:false,
            showGroupPanel: false,
            showColumnMenu: true,
            showFilter: true,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: true,
            showFooter: true,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: {
      			filterText: "",
      			useExternalFilter: true
            },
            pagingOptions: $scope.pagingOptions,
            columnDefs:column,
            rowTemplate: doubleClickTemplate    //双击行模板
    };  
	$scope.$on('ngGridEventFilter', function(event, msg) {
        // 设置时间间隔
        if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
            $timeout.cancel($scope.keyInterval);
        }
        $scope.keyInterval = $timeout(function() {
        	$scope.params.name = msg;
        	$scope.pagingOptions.currentPage = 1;
        	$scope.refreshPage();
        }, constant.keyInterval);
    });
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});

routeApp.controller('selectRespoolStorageCtrl', function($scope, $http, $modal, $translate, $modalInstance, $timeout, UtilService, GridService, rpId) {
	$scope.title=$translate.instant('report.selectStorage');
	var column = [{ field: 'name', displayName: $translate.instant('common.name'), sortable: true, width:'15%', cellTemplate:titleTemplate},
	              { field: 'type', displayName: $translate.instant('virdesk.poolType'), cellFilter: 'storageType', sortable: true, width:'15%'},
                  { field: 'path', displayName: $translate.instant('virdesk.poolPath'), sortable: true, width:'25%', cellTemplate:titleTemplate},
                  { field: 'capacity', displayName: $translate.instant("storagePool.assignSize"), sortable: true, width:'15%', cellFilter:'byteUnitRender'},
                  { field: 'resourcePoolName', displayName: $translate.instant("virdesk.resourcePool"), sortable: true, width: '13%', cellTemplate: titleTemplate},
                  { field: 'cloudType', displayName: $translate.instant('cloudResource.cloudResourceType'), sortable: true, width:"17%", cellFilter:'cloudType'}
                  ];
	$scope.mySelections = [];
	var params = {};
	if( angular.isDefined(rpId) && rpId != null) {
		params.rpId = rpId;
	}
	var url = "report/respoolStorage";
	$scope = GridService.grid($scope, url, params, undefined, undefined, "singleGrid");
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.gridOptions = {
            data: 'myData',
            jqueryUITheme: false,
            jqueryUIDraggable: false,
            selectedItems: $scope.mySelections,
            showSelectionCheckbox: true,
            multiSelect:true,
            showGroupPanel: false,
            showColumnMenu: true,
            showFilter: false,
            enableCellSelection: false,
            enableCellEditOnFocus: false,
            enablePaging: true,
            showFooter: true,
            i18n: $translate.instant('lang'),
            totalServerItems: 'totalServerItems',
            filterOptions: {
      			filterText: "",
      			useExternalFilter: true
            },
            pagingOptions: $scope.pagingOptions,
            columnDefs:column,
            rowTemplate: doubleClickTemplate    //双击行模板
    };  
	$scope.$on('ngGridEventFilter', function(event, msg) {
        // 设置时间间隔
        if (angular.isDefined($scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
            $timeout.cancel($scope.keyInterval);
        }
        $scope.keyInterval = $timeout(function() {
        	$scope.params.name = msg;
        	$scope.pagingOptions.currentPage = 1;
        	$scope.refreshPage();
        }, constant.keyInterval);
    });
	$scope.jump = function(entity) {
		if (angular.isFunction($scope.ok)) {
			$scope.ok.apply();
		}
	};
	$scope.ok=function(){
		$modalInstance.close($scope.mySelections);
	};	
	$scope.cancel=function(){
		$modalInstance.dismiss("cancel");
	};
});
//vm usage中 高级查询控制器
routeApp.controller('advancedQueryForVmCtrl',function(params, type, $scope, $http, $rootScope, $modal, $filter,$translate, $timeout, $modalInstance, UtilService,GridService,HttpService) {
	  $scope.entry = {};
	  $scope.entry.type = 'user';
	  $scope.startMaxDate = new Date();
	  $scope.endMaxDate = new Date();
	  $scope.type = type;
	  $timeout(function(){
	      $("#satrtTimeInput").change(function(){
	          var value = $("#satrtTimeInput").val();
	          if (value != "") {
	          var d = new Date();
	          d.setYear(parseInt(value.substring(0, 4)));
	          d.setMonth(parseInt(value.substring(5, 7))-1);
	          d.setDate(parseInt(value.substring(8, 10)));
	          d.setHours(parseInt(value.substring(11, 13)));
	          d.setMinutes(parseInt(value.substring(14, 16)));
	          d.setSeconds(parseInt(value.substring(17, 19)))
	          $scope.endMinDate = d;
	          } else {
	          	$scope.endMinDate = undefined;
	          }
	          $scope.$digest();
	      });
	      $("#endTimeInput").change(function(){
	          var value = $("#endTimeInput").val();
	          if (value != "") {
	          var d = new Date();
	          d.setYear(parseInt(value.substring(0, 4)));
	          d.setMonth(parseInt(value.substring(5, 7))-1);
	          d.setDate(parseInt(value.substring(8, 10)));
	          d.setHours(parseInt(value.substring(11, 13)));
	          d.setMinutes(parseInt(value.substring(14, 16)));
	          d.setSeconds(parseInt(value.substring(17, 19)))
	          $scope.startMaxDate = d;
	          } else {
	          	$scope.startMaxDate = undefined;
	          }
	          $scope.$digest();
	      });
	      if (params != null && angular.isDefined(params)) {
			  if (!isEmpty(params.orgId)) {
				  $scope.entry.orgId = params.orgId;
				  $scope.entry.orgName = params.orgName;
			  }
			  if (!isEmpty(params.nameOrTitle)) {
				  $scope.entry.nameOrTitle = params.nameOrTitle;
			  }
			  if (!isEmpty(params.type)) {
				  $scope.entry.type = params.type;
			  }
			  if (!isEmpty(params.userGrpId)) {
				  $scope.entry.userGrpId = params.userGrpId;
				  $scope.entry.userGrpName = params.userGrpName;
			  }
			  if (!isEmpty(params.userId)) {
				  $scope.entry.userId = params.userId;
				  $scope.entry.userName = params.userName;
			  }
			  $("#satrtTimeInput").val(params.startTime);
			  if (params.startTime != undefined) {
				  var d = new Date();
				  d.setYear(parseInt(params.startTime.substring(0, 4)));
		          d.setMonth(parseInt(params.startTime.substring(5, 7))-1);
		          d.setDate(parseInt(params.startTime.substring(8, 10)));
		          d.setHours(parseInt(params.startTime.substring(11, 13)));
		          d.setMinutes(parseInt(params.startTime.substring(14, 16)));
		          d.setSeconds(parseInt(params.startTime.substring(17, 19)))
		          $scope.endMinDate = d;
			  }
			  $("#endTimeInput").val(params.endTime);
			  if (params.endTime != undefined) {
				  var d = new Date();
				  d.setYear(parseInt(params.endTime.substring(0, 4)));
		          d.setMonth(parseInt(params.endTime.substring(5, 7))-1);
		          d.setDate(parseInt(params.endTime.substring(8, 10)));
		          d.setHours(parseInt(params.endTime.substring(11, 13)));
		          d.setMinutes(parseInt(params.endTime.substring(14, 16)));
		          d.setSeconds(parseInt(params.endTime.substring(17, 19)))
		          $scope.startMaxDate = d;
			  }
			  
		  }
	  });
	  // 选择组织
	  
	  $scope.selectOrg = function() {
			var resolve = {
					params: function () {return null;}
				};
				var orgInstance = UtilService.modal('html/modal/common/selectSingle.html', 'selectSingleOrganizeCtrl', resolve, '712px');
				orgInstance.result.then(function(org) {
					if (angular.isDefined(org) && org != null) {
						$scope.entry.orgId = org[0].id;
						$scope.entry.orgName = org[0].name;
					}
				}, function() {
				});
	  }
	  
	  $scope.selectUser = function() {
		if (!angular.isNumber($scope.entry.orgId)) {
			UtilService.error($translate.instant("workflow.selectOrgAlert"), $translate.instant("common.opertip"));
			return;
		}
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			width:'712px',
			controller:"SelectSingleUserCtrl",
			resolve: {
				orgId: function () {
                    return $scope.entry.orgId;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isDefined(selectedItem)) {
				if (angular.isArray(selectedItem) && selectedItem.length > 0) {
					$scope.entry.userName = selectedItem[0].userName;
					$scope.entry.userId = selectedItem[0].id;
					$scope.entry.userGrpId = undefined;
					$scope.entry.userGrpName = undefined;
				}
			}
			
		},function(reason){
		});
	} 
	$scope.selectUserGrp = function() {
		if (!angular.isNumber($scope.entry.orgId)) {
			UtilService.error($translate.instant("workflow.selectOrgAlert"), $translate.instant("common.opertip"));
			return;
		}
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			width:'712px',
			controller:"SelectSingleGroupCtrl",
			resolve: {
				orgId: function () {
                    return $scope.entry.orgId;
                }
            }
		});
		modalInstance.result.then(function(selectedItem){
			if (angular.isArray(selectedItem) && selectedItem.length > 0) {
				$scope.entry.userGrpName = selectedItem[0].name;
				$scope.entry.userGrpId = selectedItem[0].id;
				$scope.entry.userId = undefined;
				$scope.entry.userName = undefined;
			}
			
		},function(reason){
		});
	}
	$scope.deleteUser = function() {
		$scope.entry.userId = undefined;
		$scope.entry.userName = undefined;
	}
	$scope.deleteUserGrp = function() {
		$scope.entry.userGrpId = undefined;
		$scope.entry.userGrpName = undefined;
	}
    //回车
    $scope.enter = function(ev) { 
        if (ev.keyCode == 13 && !$scope.form.$invalid) {
            $scope.ok();
        }
    };   
    $scope.ok = function() {
        var params = {};
        if (!isEmpty($scope.entry.orgId)) {
        	params.orgId = $scope.entry.orgId;
        	params.orgName = $scope.entry.orgName;
        }
        if (!isEmpty($scope.entry.userGrpId)) {
        	params.userGrpId = $scope.entry.userGrpId;
        	params.userGrpName = $scope.entry.userGrpName;
        }
        if (!isEmpty($scope.entry.userId)) {
        	params.userId = $scope.entry.userId;
        	params.userName = $scope.entry.userName;
        }
        if (!isEmpty($("#satrtTimeInput").val())) {
        	params.startTime = $("#satrtTimeInput").val();
        }
        if (!isEmpty($("#endTimeInput").val())) {
        	params.endTime = $("#endTimeInput").val();
        }
        if (!isEmpty($scope.entry.nameOrTitle)) {
        	params.nameOrTitle = $scope.entry.nameOrTitle;
        }
        if (!isEmpty($scope.entry.type)) {
        	params.type = $scope.entry.type;
        }
        $modalInstance.close(params);
    };
    $scope.reset = function() {
    	$scope.entry = {type:'user'};
    	$("#satrtTimeInput").val("");
    	$("#endTimeInput").val("");
    	$scope.startMaxDate = $scope.endMaxDate = new Date();
	    $scope.endMinDate= undefined;
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});
/**
 * 资源池计算资源使用统计
 */
routeApp.controller("resPoolStorageCtrl", function($rootScope, $scope, $http, $modal, $translate, $stateParams, $timeout, UtilService, HttpService,EchartService) {
	$scope.model = {};
	$scope.currentstorage = {name : $translate.instant('report.selectStorage')};
	$scope.currentstorage.storages = [];
	$scope.levels = {cycleOptions:[ {value:1,label:$translate.instant("paramconfig.day")},
	                                {value:2,label:$translate.instant("report.week")},
	                                {value:3,label:$translate.instant("cloudResource.month")},
	                                {value:4,label:$translate.instant("report.year")}]};
	$scope.model.cycle = 1;
	$scope.dateFmt = "YYYY-MM-DD";
	$scope.isShowTime = false;
	var noStorages = [];

	
	$scope.selectStorage = function() {
		var modalInstance=$modal.open({
			templateUrl:'html/modal/common/selectSingle.html',
			backdrop:"static",
			controller:"selectRespoolStorageCtrl",
			width:"720px",
			resolve: {
				rpId : null
			}
		  });
		  modalInstance.result.then(function(selectItem){
			  if (selectItem && angular.isArray(selectItem) && selectItem.length > 0) {
				  $scope.storageNames = [];
				  $scope.currentstorage.storages = [];
				  for (var i=0 ; i < selectItem.length ; i++) {
					  $scope.currentstorage.storages.push(selectItem[i].storagePoolKey + '#' + selectItem[i].cloudId);
					  $scope.storageNames.push(selectItem[i].name);
				  }
				  $scope.currentstorage.name = $scope.storageNames.join(',');
			  } 
		  },function(reason){
		      
		  });
	}
	
	// 设置查询参数
    $scope.setQueryConfig = function() {
    	$scope.model.startTime = $("#storageReportStartTime").val();
    	$scope.model.endTime = $("#storageReportEndTime").val();
    	
    	if (!isEmpty($scope.currentstorage.storages) && $scope.currentstorage.storages.length > 0) {
    		$scope.model.storages = $scope.currentstorage.storages;
    	}
    	
    };
    
    $scope.queryStorageReport = function() {
    	$scope.setQueryConfig();
    	$http({ 
    		method: 'GET', 
    		url: 'report/storageUsage',
    		params:$scope.model
    	}).success(function(reportData) { 
    		$scope.storageData = reportData;
    		$scope.storagePools = [];
    		$scope.showNoData = true;
    		$timeout(function() {
    			var count = 0;
    			if ($scope.storageData == null || angular.equals({}, $scope.storageData)) {
    				$scope.showNoData = true;
    				storagePool = echarts.init(document.getElementById('storageReport'));
    				var option = EchartService.getChartOption(null,$scope.storageData, "line", storagePool, $scope.model.cycle);
    				if (option != null) {
            		storagePool.setOption(option);
    				}
            		$scope.storagePools.push(storagePool);
            		return;
				}
    			if (noStorages && noStorages.length > 0) {
    	    		for (var i = 0; i < noStorages.length; i++) {
    	    			var noStorage = noStorages[i];
    	    			EchartService.dispose(noStorage);
    	    		}
    	    	}
        		for (var storageEntity in $scope.storageData) {
        			$scope.showNoData = false;
        			storagePool = echarts.init(document.getElementById('storageReport' + count)); 
            		$scope.storageData[storageEntity].max = 100;
            		var storageName = "";
            		if (storageEntity) {
            			var array = storageEntity.split("#");
            			if (angular.isArray(array) && array.length >= 2) {
            				storageName = array[0];
            			}
            		}
            		
            		var option = EchartService.getChartOption($translate.instant('report.storageRate') + " - " + storageName,$scope.storageData[storageEntity], "line", storagePool, $scope.model.cycle);
            		if (option != null) {
            		storagePool.setOption(option);
            		} else {
            			storages.push(storagePool);
            		}
            		$scope.storagePools.push(storagePool);
            		count ++;
        		}
    		});
    		
    	});
    }
    
    $scope.searchReset = function() {
    	$scope.model = {};
    	$scope.currentstorage = {name : $translate.instant('report.selectStorage')};
    	$scope.currentstorage.storages = [];
    	$scope.model.cycle = 1;
    	$scope.dateFmt = "YYYY-MM-DD";
    	$scope.isShowTime = false;
    	$scope.resetDatePicker();
    	if (angular.isArray($scope.storagePools)) {
    		for (var i = 0; i < $scope.storagePools.length; i++) {
    			EchartService.dispose($scope.storagePools[i]);
    }
    	}
    	$scope.storageData = [];
    	$scope.storagePools = [];
    }
    
    $scope.setRateData = function(rateData, chartNames) {
		var j = 0;
		if (rateData != null) {			
			for (i in rateData) {
				var name = rateData[i].name;
				var flag = false;
				for (ii in chartNames) {
					if (name == chartNames[ii].label) {
						flag = true;
						break;
					}
				}
				if (!flag && name != "") {	
					var str = {value:j,label:name}; 
					chartNames[j] = str;
					j++;
				}
			}	
		} else {
			chartNames = [];
		}
    };
    
	$scope.getTomFormatDate = function(format){
    	var date = new Date();
    	date.setDate(date.getDate() -1);
    	if (format == null) {
    		format = "yyyy-MM-dd";
    	}
        return date.Format(format);
    };
    $scope.tomTime = $scope.getTomFormatDate(null);
    $scope.model.startTime = $scope.tomTime;
	$scope.model.endTime = $scope.tomTime;
	
	
	$scope.$watch('model.cycle', function(newVal, oldVal) {
		switch (newVal) {
		case 0:
			$scope.dateFmt = "YYYY-MM-DD hh";
			$scope.isShowTime = true;
			break;
		case 2:
			$scope.dateFmt = "YYYY-MM-DD";
			$scope.isShowTime = false;
			break;
		case 3:
			$scope.dateFmt = "YYYY-MM";
			$scope.isShowTime = false;
			break;
		case 4:
			$scope.dateFmt = "YYYY";
			$scope.isShowTime = false;
			break;
		default:
			$scope.dateFmt = "YYYY-MM-DD";
			$scope.isShowTime = false;
			break;
		}
		$scope.resetDatePicker();
	});
	$scope.resetDatePicker = function() {		
		switch ($scope.model.cycle) {
		case 0:			
			$scope.tomTime = $scope.model.startTime = $scope.model.endTime = $scope.getTomFormatDate("yyyy-MM-dd HH");
			break;
		case 3:			
			$scope.tomTime = $scope.model.startTime = $scope.model.endTime = $scope.getTomFormatDate("yyyy-MM");
			break;
		case 4:
			$scope.tomTime = $scope.model.startTime = $scope.model.endTime = $scope.getTomFormatDate("yyyy");
			break;
		default:
			$scope.model.endTime = $scope.model.startTime = $scope.tomTime = $scope.getTomFormatDate(null);
		break;
		}
	 	$("#storageReportStartTime").val($scope.model.startTime);
    	$("#storageReportEndTime").val($scope.model.endTime);
	};
	
	//浏览器窗口resize的时候执行的函数
    var onResize = function() {
    	if ($scope.storagePools && $scope.storagePools.length > 0) {
    		for (var i = 0; i < $scope.storagePools.length; i++) {
    			var storagePool = $scope.storagePools[i];
    			storagePool.resize();
    		}
    		
    	}
    }
    
    $scope.exportReportPdf = function() {
    	var pdfConfig = {};
    	pdfConfig.fileName = "StorageReportExport-" + getFormateDate() +".pdf";
    	pdfConfig.targetName = $translate.instant('report.respoolStorage');
    	pdfConfig.urlArry = [];
    	var dataNOExist = true;
    	if ($scope.storagePools && $scope.storagePools.length > 0) {
    		dataNOExist = false;
    		for (var i = 0; i < $scope.storagePools.length; i++) {
    			var storagePool = $scope.storagePools[i];
    			if (storagePool && storagePool.getOption()) {
    			pdfConfig.urlArry.push(storagePool.getDataURL());
    		}
    		}
    		
    	}
    	if (dataNOExist && pdfConfig.urlArry.length == 0) {
    		UtilService.alert($translate.instant('report.queryFirst'), 
    				$translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	if (!dataNOExist && pdfConfig.urlArry.length == 0) {
    		UtilService.alert($translate.instant('report.noData'), 
    				$translate.instant('common.opertip'), false, 'error');
    		return;
    	}
    	var waitModal = UtilService.wait();
    	$timeout(function(){
    	exportPdf4Img(pdfConfig);
        	waitModal.dismiss();
    	}, 100);
    };
  //监听大小改变事件，同步刷新图表
    $scope.$on('onNavClick', function(event, msg) {
        setTimeout(onResize, 100);
    });
    $(window).on("resize", onResize);
	
    $scope.$on("$destroy", function() {
    	$(window).off("resize", onResize);
    	if ($scope.storagePools && $scope.storagePools.length > 0) {
    		for (var i = 0; i < $scope.storagePools.length; i++) {
    			var storagePool = $scope.storagePools[i];
    			EchartService.dispose(storagePool);
    		}
    	}
    	noStorages = [];
    });
});

