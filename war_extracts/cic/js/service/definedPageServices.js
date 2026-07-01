angular.module('app.definedPageservices',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('definedPageService', function($compile, $http ,$modal ,$state, $translate, UtilService, HttpService){
	return {
		//打开增加监控面板窗口
		openAddMonitorNode : function() {
			// 增加监控面板
    		var modalInstance = $modal.open({
    			templateUrl: 'html/modal/cloudMonitor/addMonitorNode.html',
    			controller: 'addMonitorNodeCtrl',
    			backdrop:'static',
    			resolve: {
    				dataid : function() {
    					return null;
    				}
    			}
    		});
    		modalInstance.result.then(function (selectedItem) {
    		}, function (reason) {
    			if ("success" == reason) {

    			}
    		});
		},
		// 打开修改监控面板窗口
		openEidtMonitorNode : function(dataid) {
			// 修改监控面板
    		var modalInstance = $modal.open({
    			templateUrl: 'html/modal/cloudMonitor/addMonitorNode.html',
    			controller: 'addMonitorNodeCtrl',
    			backdrop:'static',
    			resolve: {
    				dataid : function() {
    					return dataid;
    				}
    			}
    		});
    		modalInstance.result.then(function (selectedItem) {
    		}, function (reason) {
    			if ("success" == reason) {

    			}
    		});
		},
		// 打开删除监控面板窗口
		openDeleteMonitorNode : function(dataid, dataName) {
			// 删除监控面板
    		var modalInstance = UtilService.confirm($translate.instant('cloudMonitor.deleteMonitorNodePromot', {name:dataName}),
    				$translate.instant('operConfirm'));
    		modalInstance.result.then(function (selectedItem) {
    			var waitModal = UtilService.wait();
    			$http({
    				method : 'DELETE',
    				url    : 'cloudMonitor/definedMonitor/delete',
    				params : {nodeName:dataName, id:dataid}
    			}).success(function(result) {
    				waitModal.dismiss();
    				UtilService.handleResult(result);
    			}).error(function(response, code, headers, config) {
    				waitModal.dismiss();
    				UtilService.handleError(code);
    			});
    		}, function () {

    		});
		},
		//打开系统告警信息详细信息界面
		openHealthDetailInfo : function() {
    		var modalInstance = $modal.open({
    			templateUrl: 'html/modal/overview/healthDetail.html',
    			controller: 'healthDetailCtrl',
    			backdrop:'static',
    			size:'lg',
    			resolve: {
    				dataid : function() {
    					return null;
    				}
    			}
    		});
    		modalInstance.result.then(function (selectedItem) {
    		}, function (reason) {
    			if ("success" == reason) {

    			}
    		});
		},
		// 自定义设计界面拖拽控制
		check_attr_addWidget : function(gridster, attrValue, timestamp, scope) {
			var vmdefineinfo = $translate.instant('cloudMonitor.vmdefineinfo');
			var hostdefineinfo = $translate.instant('cloudMonitor.hostdefineinfo');
			var storedefineinfo = $translate.instant('cloudMonitor.storedefineinfo');
			var healthchart = $translate.instant('dashboard.cvmHealth');
			var healthflow = $translate.instant('dashboard.cvkHealth');
			var cpuRate = $translate.instant('dashboard.cpuRate');
			var memRate = $translate.instant('dashboard.memRate');
			var storeRate = $translate.instant('dashboard.storeRate');
			var warnInfo = $translate.instant('dashboard.warnInfo');
			var hoststatus = $translate.instant('dashboard.hostStatus');
			var top5host = $translate.instant('board.hostInfoTitle');
			var top5hostcpu = $translate.instant('board.hostCpuRateInfoTitle');
			var top5hostmem = $translate.instant('board.hostMemoryInfoTitle');
			var vmstatus = $translate.instant('board.vmStatus');
			var top5vm = $translate.instant('board.vmInfoTitle');
			var top5vmcpu = $translate.instant('board.virtualHostCpuRateInfoTitle');
			var top5vmmem = $translate.instant('board.virtualHostMemoryInfoTitle');
			var vmRateOrg = $translate.instant('dashboard.vmRateOrg');
			var cpuRateOrg = $translate.instant('dashboard.cpuRateOrg');
			var memRateOrg = $translate.instant('dashboard.memRateOrg');
			var storeRateOrg = $translate.instant('dashboard.storeRateOrg');
			var userstatus = $translate.instant('dashboard.countUser');
			var configTip = $translate.instant('dashboard.configTip');
			var deleteTip = $translate.instant('dashboard.deleteTip');
			var computeTrend = $translate.instant('board.computeTrend');
			var storeTrend = $translate.instant('board.storeTrend');
			var risk = $translate.instant('board.risk');
			var addhtml = '';
			var imgPath = 'css/img/dashboard/';
//			$('#' + attrValue).attr("style", "display: none;");
			$('#' + attrValue + '_img').attr("class", "checkboximg");
			$('#' + attrValue + '_img').parent("div").find("div").attr("class", "corner-label");
			switch (attrValue) 
			{
			case 'healthChart':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ healthchart +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div><header>' + healthchart + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 1, 1, [1,1],[1,1]);
				break;
			case 'healthFlow':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp) + '"data-title = "'+ healthflow +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + healthflow + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 3, 1);
				break;
			case 'cpuRate':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ cpuRate +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + cpuRate + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 2, 1, [1,1],[1,1]);
				break;
			case 'memRate':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ memRate +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + memRate + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 3, 1, [1,1],[1,1]);
				break;
			case 'storeRate':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ storeRate +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + storeRate + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 4, 1, [1,1],[1,1]);
				break;	
			case 'cpuRateOrg':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ cpuRateOrg +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + cpuRateOrg + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 2, 1, [1,1],[1,1]);
				break;
			case 'memRateOrg':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ memRateOrg +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + memRateOrg + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 3, 1, [1,1],[1,1]);
				break;
			case 'storeRateOrg':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ storeRateOrg +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + storeRateOrg + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 4, 1, [1,1],[1,1]);
				break;	
		   case 'vmRateOrg':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ vmRateOrg +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + vmRateOrg + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 1, 2, [1,1],[1,1]);
				break;
//			case 'warnInfo_sample':
//				img = imgPath + 'warnInfo.png';
//				addhtml = '<li class="'+ attrValue +'" data-id="warnInfo" data-title = "'+ warnInfo +'">' +
//				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + warnInfo + '</header>'; 
//				addhtml += ' </li>';
//				gridster.add_widget($compile(addhtml)(scope), 1, 1, 4, 2, [1,1],[1,1]);
//				break;
			case 'hoststatus':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ hoststatus +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + hoststatus + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 2, 2, [1,1],[1,1]);
				break;
//			case 'top5host_sample':
//				img = imgPath + 'top5host.png';
//				addhtml = '<li class="'+ attrValue +'" data-id="top5host" data-title = "'+ top5host +'">' +
//				'<div class="del"><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + top5host + '</header>'; 
//				addhtml += ' </li>';
//				gridster.add_widget($compile(addhtml)(scope), 3, 1, 2, 3);
//				break;
			case 'top5hostcpu':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ top5hostcpu +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + top5hostcpu + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 1, 3);
				break;
			case 'top5hostmem':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ top5hostmem +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + top5hostmem + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 3, 3);
				break;
			case 'vmstatus':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  + '"data-title = "'+ vmstatus +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + vmstatus + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 3, 2, [1,1],[1,1]);
				break;
//			case 'top5vm_sample':
//				img = imgPath + 'top5vm.png';
//				addhtml = '<li data-id="top5vm" data-title = "'+ top5vm +'">' +
//				'<div class="del"><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + top5vm + '</header>'; 
//				addhtml += '<img class="definedimg" src="' + img + '">';
//				addhtml += ' </li>';
//				gridster.add_widget($compile(addhtml)(scope), 3, 1, 2, 5);
//				break;
			case 'top5vmcpu':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  +'"data-title = "'+ top5vmcpu +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + top5vmcpu + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 1, 4);
				break;
			case 'top5vmmem':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  +'"data-title = "'+ top5vmmem +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + top5vmmem + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 3, 4);
				break;
			case 'userstatus':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  +'"data-title = "'+ userstatus +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + userstatus + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 4, 2, [1,1],[1,1]);
				break;
			case 'computeTrend':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  +'"data-title = "'+ computeTrend +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + computeTrend + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 1, 4);
				break;
			case 'storeTrend':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  +'"data-title = "'+ storeTrend +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + storeTrend + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 2, 1, 3, 4);
				break;
			case 'risk':
				addhtml = '<li class="'+ attrValue +'_sample" id="' + (attrValue + "_" + timestamp) +'" data-id="' + (attrValue + "_" + timestamp)  +'"data-title = "'+ risk +'">' +
				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div> <header>' + risk + '</header>'; 
				addhtml += ' </li>';
				gridster.add_widget($compile(addhtml)(scope), 1, 1, 4, 2, [1,1],[1,1]);
				break;
//			case 'vm_definedInfo':
//				img = imgPath + 'vm_definedinfo.png';
//				addhtml = '<li class="'+ attrValue +'_sample" id="' + ("vm_definedInfo_" + timestamp) +'" data-id="' + ("vm_definedInfo_" + timestamp) +'"  data-title = "'+ vmdefineinfo + '_' + timestamp +'">' +
//				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div><header> ' + vmdefineinfo + '_' + timestamp +'</header>';
//				addhtml += ' </li>';
//				gridster.add_widget($compile(addhtml)(scope), 4, 1, 1, 1);
//				break;
//			case 'host_definedInfo':
//				img = imgPath + 'host_definedinfo.png';
//				addhtml = '<li class="'+ attrValue +'_sample" id="' + ("host_definedInfo_" + timestamp) +'" data-id="' + ("host_definedInfo_" + timestamp) +'" data-title = "'+ hostdefineinfo + '_' + timestamp +'">' +
//				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div><header> ' + hostdefineinfo + '_' + timestamp +'</header>';
//				addhtml += ' </li>';
//				gridster.add_widget($compile(addhtml)(scope), 4, 1, 1, 1);
//				break;
//			case 'store_definedInfo':
//				img = imgPath + 'store_definedinfo.png';
//				addhtml = '<li class="'+ attrValue +'_sample" id="' + ("store_definedInfo_" + timestamp) +'" data-id="' + ("store_definedInfo_" + timestamp) +'" data-title = "'+ storedefineinfo + '_' + timestamp +'">' +
//				'<div class="del"><span class="fa fa-cog" custom-title="' + configTip + '"></span><span class="fa fa-times" custom-title="' + deleteTip + '"></span></div><header> ' + storedefineinfo + '_' + timestamp +'</header>';
//				addhtml += ' </li>';
//				gridster.add_widget($compile(addhtml)(scope), 4, 1, 1, 1);
//				break;
			}
		},
		getHazard : function  (hazard) {
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: "cloudMonitor/getHazard",
				   success: function(result){
//						var hazard = echarts.init(document.getElementById("hazard"));
						textNum = {
								color : '#88CC67',
								fontFamily : 'Arial',
								fontSize : 60
						},
						textTitle = {
								color : '#88CC67',
								fontFamily : 'Arial',
								fontSize : 30
						}
						option = {
								   title : {
									   text : result.hazard,
									   subtext : $translate.instant('dashboard.hazard'),
									   sublink : '',
									   x : 'center',
									   y : 'center',
									   textStyle : textNum,
									   subtextStyle : textTitle
								   },
								   tooltip : {
									   trigger : 'item',
									   formatter : "{a} <br/>{b} : {c}%"
								   },
								   series : [ {
									   name : $translate.instant('dashboard.hazard'),
									   type : 'pie',
									   radius : [ '65%', '95%' ],
									   itemStyle : {
										   normal : {
											   color : function(params) {
												   var colorList = [ "#C5D341", "#3183B5", "#6AA249" ];
												   return colorList[params.dataIndex]
											   },
											   label : {
												   show : false
											   },
											   labelLine : {
												   show : false
											   }
										   }
									   },
									   data : [ 
									   {
										   value : result.cpuRate,
										   name : $translate.instant('board.cpuInfo')
									   }, 
									   {
										   value : result.memRate,
										   name : $translate.instant('board.memInfo')
									   }, {
										   value : result.storageRate,
										   name : $translate.instant('board.sfsUseage')
									   } ]
								   } ]
							   };
						if (result.hazard >= 0 && result.hazard <= 20) {
							textNum.color = '#88CC67';
							textTitle.color = '#88CC67';
						} else if (result.hazard > 20 && result.hazard <= 80) {
							textNum.color = '#FFAF48';
							textTitle.color = '#FFAF48';
						} else if (result.hazard > 80) {
							textNum.color = '#FF6161';
							textTitle.color = '#FF6161';
						}
						hazard.setOption(option); 
				   }
			});
		},
		getHtmlInfoByDataId : function (data_id, data_title, type) {
			var addhtml = '';
			var FULL_IMG = 'css/img/dashboard/icon_full_screen_16x16.png';
			if (!isEmpty(data_id)) {
				var key = data_id.substring(data_id.indexOf("_"), data_id.length);
				data_id = data_id.substring(0, data_id.indexOf("_"));
				switch (data_id)
				{
				case 'healthChart':
					addhtml +=  "<h4>" + data_title + "</h4>"
							+ "<div id=\"healthChart" + key + "\" class=\"dashboard_trendChart\" ><div class=\"health_span\"></div></div>";
					break;
				case 'healthFlow':
					
					if ("view" == type) {
						addhtml += "<div data-id=\"healthFlow" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"healthFlow" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\" >";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"dashboard_healthFlow" + key + "\" class=\"dashboard_trendChart\"></div>";
					break;
				case 'userstatus':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"userCircle" + key + "\" class=\"overview-circle\"></div>";
					addhtml += "<div id=\"userInfo" + key + "\" class=\"dashboard_numBar\" style=\"width:233px\">";
					addhtml += "<div class=\"dashboard_numItem numItem_double\" id=\"numItem-useryes\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.useryes\"></span>";
					addhtml += "</div>";
					addhtml += "<div class=\"dashboard_numItem numItem_double\" id=\"numItem-userno\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.userno\"></span>";
					addhtml += "</div>";
					addhtml += "</div>";
					break;
				case 'cpuRate':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic cpu_rate_img\" id=\"countCpuRate\">"
							+ "<div class=\"view_span\" id=\"cpuRate" + key + "\"></div></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.hostCPUCount\"></td><td class=\"leftText\" id = \"hostCPUCount" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.vmCPUCount\"></td><td class=\"leftText\" id = \"vmCPUCount" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.CPUUtilizationRate\"></td><td class=\"leftText\" id = \"cpuUtilRate" + key + "\"></td></tr>";
					addhtml += "</table>";
					addhtml += "</div>";
					
					break;
				case 'memRate':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic mem_rate_img\" id=\"countMemRate\">"
							+ "<div class=\"view_span\" id=\"memRate" + key + "\"></div></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.hostMemoryCount\"></td><td class=\"leftText\" id = \"hostMemoryCount" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.vmMemoryCount\"></td><td class=\"leftText\" id = \"vmMemoryCount" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.memoryUtilizationRate\"></td><td class=\"leftText\" id = \"memUtilRate" + key + "\"></td></tr>";
					addhtml += "</table>";	
					addhtml += "</div>";
					
					break;
				case 'storeRate':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic store_rate_img\" id=\"countStoreRate\">"
							+ "<div class=\"view_span\" id=\"storeRate" + key + "\"></div></div>";
					
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.hostStoreCount\"></td><td class=\"leftText\" id = \"totalStorage" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.vmStoreCount\"></td><td class=\"leftText\" id = \"usedStorage" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.storeUtilizationRate\"></td><td class=\"leftText\" id = \"storageRate" + key + "\"></td></tr>";
					addhtml += "</table>";	
					addhtml += "</div>";
					
					break;
				case 'vmRateOrg':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic vm_rate_img\" id=\"countVmRateOrg\">"
							+ "<div class=\"view_span\" id=\"vmRateOrg" + key + "\"></div></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgVmCount\"></td><td class=\"leftText\" id = \"orgVmCount" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgVmCur\"></td><td class=\"leftText\" id = \"orgVmCur" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.vmUtilRate\"></td><td class=\"leftText\" id = \"vmUtilRate" + key + "\"></td></tr>";
					addhtml += "</table>";
					addhtml += "</div>";
					break;
				case 'cpuRateOrg':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic cpu_rate_img\" id=\"countCpuRateOrg\">"
							+ "<div class=\"view_span\" id=\"cpuRateOrg" + key + "\"></div></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgCpu\"></td><td class=\"leftText\" id = \"orgCpu" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgCpuCur\"></td><td class=\"leftText\" id = \"orgCpuCur" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.cpuUtilRate\"></td><td class=\"leftText\" id = \"cpuUtilRate" + key + "\"></td></tr>";
					addhtml += "</table>";
					addhtml += "</div>";
					break;
				case 'memRateOrg':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic mem_rate_img\" id=\"countMemRateOrg\">"
							+ "<div class=\"view_span\" id=\"memRateOrg" + key + "\"></div></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgMem\"></td><td class=\"leftText\" id = \"orgMem" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgMemCur\"></td><td class=\"leftText\" id = \"orgMemCur" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.memUtilRate\"></td><td class=\"leftText\" id = \"memUtilRate" + key + "\"></td></tr>";
					addhtml += "</table>";	
					addhtml += "</div>";
					
					break;
				case 'storeRateOrg':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div class = \"view-countPic store_rate_img\" id=\"countStoreRateOrg\">"
							+ "<div class=\"view_span\" id=\"storeRateOrg" + key + "\"></div></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgStorage\"></td><td class=\"leftText\" id = \"orgStorage" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.orgStorageCur\"></td><td class=\"leftText\" id = \"orgStorageCur" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"dashboard.storageUtilRate\"></td><td class=\"leftText\" id = \"storageUtilRate" + key + "\"></td></tr>";
					addhtml += "</table>";	
					addhtml += "</div>";
					
					break;
				case 'hoststatus':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"hostCircle" + key + "\" class=\"overview-circle\"></div>";
					addhtml += "<div id=\"hostInfo" + key + "\" class=\"dashboard_numBar\" style=\"width:233px\"> ";
					
					addhtml += "<div class=\"dashboard_numItem\" id=\"numItem-normal\">";
					addhtml += "<label></label><br>";
					addhtml += "<span  translate=\"dashboard.opened\"></span>";
					addhtml += "</div>";
					addhtml += "<div class=\"dashboard_numItem\" id=\"numItem-error\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.unKnown\"></span>";
					addhtml += "</div>";
					addhtml += "<div class=\"dashboard_numItem\" id=\"numItem-maintain\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.maintain\"></span>";
					addhtml += "</div>";
					addhtml += "</div>";
					
					break;
				case 'top5hostcpu':
					if ("view" == type) {
						addhtml += "<div data-id=\"top5hostcpu" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"top5hostcpu" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\">";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"ringChart" + key + "\" class=\"dashboard_trendChart\"></div>";
					
					break;
				case 'top5hostmem':
					if ("view" == type) {
						addhtml += "<div data-id=\"top5hostmem" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"top5hostmem" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\">";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"barChart" + key + "\" class=\"dashboard_trendChart\"></div>";
					
					break;
				case 'vmstatus':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"vmCircle" + key + "\" class=\"overview-circle\"></div>";
					addhtml += "<div id=\"vmInfo" + key + "\" class=\"dashboard_numBar\" style=\"width:233px\">";
					
					addhtml += "<div class=\"dashboard_numItem\" id=\"numItem-normal\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.opened\"></span>";
					addhtml += "</div>";
					addhtml += "<div class=\"dashboard_numItem\" id=\"numItem-close\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.closed\"></span>";
					addhtml += "</div>";
					addhtml += "<div class=\"dashboard_numItem\" id=\"numItem-error\">";
					addhtml += "<label></label><br>";
					addhtml += "<span translate=\"dashboard.unKnown\"></span>";
					addhtml += "</div>";
					addhtml += "</div>";
					break;
				case 'top5vmcpu':
					if ("view" == type) {
						addhtml += "<div data-id=\"top5vmcpu" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"top5vmcpu" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\">";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"vmringChart" + key + "\"  class=\"dashboard_trendChart\"></div>";
					break;
				case 'top5vmmem':
					if ("view" == type) {
						addhtml += "<div data-id=\"top5vmmem" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"top5vmmem" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\">";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"vmbarChart" + key + "\"  class=\"dashboard_trendChart\" ></div>";
					break;
				case 'computeTrend':
					if ("view" == type) {
						addhtml += "<div data-id=\"computeTrend" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"computeTrend" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\">";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"computeTrendBarChar" + key + "\" class=\"dashboard_trendChart\"></div>";
					
					break;
				case 'storeTrend':
					if ("view" == type) {
						addhtml += "<div data-id=\"storeTrend" + key + "\" class=\"himg\">";
						addhtml += "<img data-id=\"storeTrend" + key + "\" src=\""+ FULL_IMG + "\" custom-title=\"" + $translate.instant("dashboard.expand") + "\" style=\"display:none\">";
						addhtml += "</div>";
					}
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"storeTrendBarChar" + key + "\" class=\"dashboard_trendChart\"></div>";
					break;
				case 'risk':
					addhtml += "<h4>" + data_title + "</h4>";
					addhtml += "<div id=\"riskCircle" + key + "\" class=\"dashBoard_viewPic\"></div>";
					addhtml += "<div class = \"dashBoard_countTable table_font_color\" >";
					addhtml += "<table class=\"dashBoard_table\">";
					addhtml += "<tr><td class=\"name\" translate=\"monitorMng.cpuResourceSurplusDays\"></td><td class=\"leftText\" id = \"cpuDays" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"monitorMng.memResourceSurplusDays\"></td><td class=\"leftText\" id = \"memDays" + key + "\"></td></tr>";
					addhtml += "<tr><td class=\"name\" translate=\"monitorMng.storageResourceSurplusDays\"></td><td class=\"leftText\" id = \"storageDays" + key + "\"></td></tr>";
					addhtml += "</table>";
					addhtml += "</div>";
					break;	
				
				}
			}
			return addhtml;
		}
	};
});