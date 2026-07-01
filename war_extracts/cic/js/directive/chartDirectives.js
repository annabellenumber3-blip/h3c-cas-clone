/*//色库
var lineColor = ['#86CC16', '#E54646', '#F5B16D','#00AE72','#00B7FF',
                 '#52096C', '#00676B', '#006241','#8B0016'];
//区域图对应色库的区域颜色
var areaColor = ['rgba(134,204,22,0.3)','rgba(229,70,70,0.3)','rgba(245,177,109,0.3)','rgba(0,174,114,0.3)','rgba(0,183,255,0.3)',
                 'rgba(82,9,108,0.3)','rgba(0,103,107,0.3)','rgba(0,98,65,0.3)','rgba(139,0,22,0.3)'];*/
var maxSplit = 6;

/**
 *各种图表的指令实现 
 */
angular.module('ui.casChart',[]).
//线型趋势图。可用于显示CPU 利用率，内存利用率等
directive('lineChart',function($translate, $timeout, $http, EchartService, $state){
    return {
        restrict:'A',
        scope: {
            url:'@',//http请求打url
            urlParam:'=',//htt需要的参数
            chartName:'@',//单条线的名称，不定义代表有多条线
            yAxis:'@',//y轴显示样式，默认显示百分比
            hideLegend:'@',// legend参数是否隐藏：true为隐藏
            colorIndex:'@',//指定线的颜色，数字型取值：0-8
            gridY2:'@',//右下角y轴位置
            maxLegend:'@',
            markMax:'@',//markLine的最大值，主要用于DRX
            markLow:'@',//markLine的最小值
            itemStyle:'@',//折线图 or 面积图， true为面积图，默认面积图
            noDataText:'=',
            subStringLength:"@" //底部标题需截断长度
        },
        link:function(scope, element, attrs){
            if (isEmpty(scope.url)) {
                console.error('url error')
                return;
            }
            
            var urlParam = {};
            if (angular.isDefined(scope.urlParam)) {
                urlParam = scope.urlParam;
            }
            var colorIndex = 0;
            if (angular.isDefined(scope.colorIndex)) {
                colorIndex = scope.colorIndex;
            }
            var noDataText = $translate.instant('common.noData');
            if (angular.isDefined(scope.noDataText)) {
                noDataText = scope.noDataText;
            }
            var slipLine = maxSplit;
            var ele = $(element);
            var textStyle = {
					fontSize: 11,
					color : '#333'
			   };
            var itemStyle = {};
            scope.chart = undefined;
//            var chart = echarts.init(element[0]);
            //绘制图形。result：要显示打数据, name：数据名称
            var draw = function(result, name) {
            	if(!angular.isArray(result) || (result != null &&result.length == 0)){
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.dispose();
                        scope.chart = undefined;
                    }
            		getNoDataText(attrs.id, $translate);
                    return;
                    /*getNoDataText(attrs.id, $translate);
            		scope.chart = undefined;*/
            	} else {
            		//传入那么属性，代表图形为单线型
                var names = [];//底部要显示的名称
                var seriesdata = [];//图表的数据
                var maxRate = 0;//y轴最大值
                if (angular.isDefined(name)) {
                    names.push(name)
                    var ratesdata = result;
                        if (ratesdata.length < maxSplit) {
                        slipLine = ratesdata.length;
                    } else {//问题单201602280047　修改drx虚拟机列表性能数据横坐标只有２个点的bug f10574 20160228
                        slipLine = maxSplit;
                    }
                    if (!angular.isDefined(scope.itemStyle) || scope.itemStyle == 'true') {
                        itemStyle = {normal:{areaStyle:{type:'default',color:areaColor[colorIndex]},lineStyle:{color:lineColor[colorIndex],width:1}}};
                    } else if(angular.isDefined(scope.itemStyle) && scope.itemStyle == 'false') {
                        itemStyle = {normal:{lineStyle:{color:lineColor[colorIndex],width:1}}};
                    }
                    var mark = {};
                    if ((angular.isDefined(scope.markMax) || angular.isDefined(scope.markLow)) && ratesdata.length > 0) {
                    	var data = [];
                    	if (angular.isDefined(scope.markMax) && !(scope.markMax == 'undefined')) {
                    		var max = scope.markMax;
                    		var d = [
								{name : $translate.instant('drx.extendThreshold'),symbol:'none', value : max, xAxis: new Date(ratesdata[0].time), yAxis:max, itemStyle:{normal:{color:'#E54646', lineStyle:{type: 'dashed'}}}},
								{symbol:'none' ,xAxis: new Date(ratesdata[ratesdata.length - 1].time), yAxis:max, itemStyle:{normal:{color:'#E54646', lineStyle:{type: 'dashed'}}}},
                    		     ];
                    		data.push(d);
                    	}
                    	if (angular.isDefined(scope.markLow) && !(scope.markLow == 'undefined')) {
                    		var lowest = scope.markLow;
                    		var d = [
								{name : $translate.instant('drx.recyleThreshold'),symbol:'none', value : lowest, xAxis: new Date(ratesdata[0].time), yAxis:lowest, itemStyle:{normal:{color:'#00AE72', lineStyle:{type: 'dashed'}}}},
								{symbol:'none' ,xAxis: new Date(ratesdata[ratesdata.length - 1].time), yAxis:lowest, itemStyle:{normal:{color:'#00AE72', lineStyle:{type: 'dashed'}}}},
                    		     ];
                    		data.push(d);
                    	}
                    	mark.data = data;
                    } else {
                    	var data = [];
                    	mark.data = data;
                    }

                    seriesdata.push({
                        name : name,
                        type : 'line',
                        showAllSymbol : true,
                        smooth : true,
                        itemStyle:itemStyle,
                        symbolSize:0,
                        markLine : mark,
                        data : (function(rates) {
                            var d = [];
                            for (var j=0;j<rates.length;j++){
                                d.push([new Date(rates[j].time),
                                        rates[j].rate.toFixed(2) - 0 ]);
                                
                                if(rates[j].rate > maxRate) {
                                  	 maxRate = rates[j].rate;
                                   }
                            }
                            return d;
                        })(ratesdata)
                    });//放置一个linechart
                } else {//如果没有name属性，则代表多线型的图形
                    if (result.length == 0) {
                        var ratesdata = [];
                        seriesdata.push({
                            name : '',
                            type : 'line',
                            showAllSymbol : true,
                            smooth : true,
                            data : (function(rates) {
                                var d = [];
                                for (var j=0;j<rates.length;j++){
                                    d.push([new Date(rates[j].time),
                                            rates[j].rate.toFixed(2) - 0 ]);
                                        if(rates[j].rate > maxRate) {
                                         	 maxRate = rates[j].rate;
                                }
                                    }
                                return d;
                            })(ratesdata)
                        });//放置一个linechart
                    } else {
                        if (result[0].list.length < maxSplit) {
                            slipLine = result[0].list.length;
                        }
                            var j = 0;
                        for(var i=0; i<result.length; i++){
                            if (angular.isDefined(scope.maxLegend)) {
                                if (i < scope.maxLegend) {
                                    names.push(result[i].name);
                                }
                            } else {
                                names.push(result[i].name);
                            }                            
                            var ratesdata = result[i].list;
                            if (!angular.isDefined(scope.itemStyle) || scope.itemStyle == 'true') {
                                itemStyle = {normal:{areaStyle:{type:'default'},lineStyle:{width:1}}};
                            }
                            
                            seriesdata.push({
                                 name : result[i].name,
                                 type : 'line',
                                 showAllSymbol : true,
                                 smooth : true,
                                 //itemStyle:{normal:{areaStyle:{type:'default',color:areaColor[colorIndex]},lineStyle:{color:lineColor[colorIndex],width:1}}},
                                     //itemStyle:itemStyle,
                                     //itemStyle:{normal:{areaStyle:{type:'default',color:areaColor[j]},lineStyle:{color:lineColor[j],width:1}}},
                                     showAllSymbol : true,
    								 symbol:symbols[j],
    								// areaStyle:{normal : {}},
    					             itemStyle: {
    					                normal: {
    					                	color : areaColor[j],
    					                    lineStyle: {
    					                        width: 1
    					                    }
    					                }
    					             },
    					             areaStyle: {
                                        normal: {
                                            color:  areaColor[j]
                                        },
                                    },
    								smooth : true,
                                 symbolSize:0,
                                     /*symbol:symbols[j],
                                     smooth : true,
                                     itemStyle: {
                                         normal: {
                                             color: lineColor[j],
                                         },
                                     },
                                     */
                                     symbolSize:0,
                                 data : (function(rates) {
                                     var d = [];
                                     for (var j=0;j<rates.length;j++){
                                         d.push([new Date(rates[j].time),
                                                 rates[j].rate.toFixed(2) - 0 ]);
                                             if(rates[j].rate > maxRate) {
                                              	 maxRate = rates[j].rate;
                                     }
                                         }
                                     return d;
                                 })(ratesdata)
                             });//放置一个linechart
                                j++;
                        }
                    }
                }
                var trendOption = {
                        tooltip : {
                                trigger: 'axis',
                                axisPointer:{
    		         	    		lineStyle:{
    		         	    			color:'#e4eaec'
    			    		    }
    			    	    },
                                //修改tooltip的位置
                            formatter : function (params) {
                                	var result = "";
                                	for (var j= 0; j<params.length;j++){
                                		if (angular.isDate(params[j].data[0])) {
                                            var date = new Date(params[j].data[0]);
                                            var name = params[j].seriesName;
                                    var nameStr = "";
                                    if (!isEmpty(name) && name.getWidth(14) > 150) {
                                        var n = name.length;
                                        var index = 0;
                                        for (var i = 1; i < n + 1; i++) {
                                             if (name.substring(index, i).getWidth(14) > 150 || i == n) {
                                            	 index = i;
                                            	 nameStr += name[i-1] + "<br/>";
                                             } else {
                                            	 nameStr += name[i-1];
                                        }
                                        }
                                    } else {
                                                nameStr = name;
                                    }
                                            if (result.indexOf(date.Format("yyyy-MM-dd HH:mm")) == -1) {
                                            	result = date.Format("yyyy-MM-dd HH:mm");
                                            }
                                            result = result + '<br/>' + nameStr +  ' : ' +params[j].data[1] ;
                                    //Y轴是百分比时，tooltip中数据显示加上百分号
                                    if (!angular.isDefined(scope.yAxis)) {
                                    	result += '%';
                                    }
                            	} else {
                                    		result = result + params[j].name + ' : ' + params[j].value + '<br/>';
                            	}
                                	}
                                	return result;
                                	
                            },
                                /*showDelay:200,
                                transitionDuration:0.5*/
                        },
                        legend : {
                            data : names,
                                y:'bottom',
                                textStyle:{
                                	color:function(params){
                                		
                                	}
                        },
                                formatter: function(value) {
                                	if (angular.isDefined(scope.subStringLength)) {
                                		if (value.length > scope.subStringLength) {
                                    		value = value.substring(0, scope.subStringLength - 3) + "...";
                                    	}
                                    	return value;
                                	} else {
                                		return value;
                                	}
                                	
                                },
                                
                                padding: 2,
                                itemGap:5
                            },
                        grid: {
                            x: 50,
                            x2:30,
                            y: 10,
                            y2: 77
                        },
                        xAxis : [
                            {
                                type : 'time',
                                splitNumber:slipLine,
                                axisLabel : {
                                    formatter: function(value){
                                        	var date = new Date(value);
                                            var hour = date.getHours();
                                            var minute = date.getMinutes();
                                        if(minute < 10){
                                            minute = '0' + minute;
                                        }
                                        return hour + ":" + minute;
                                        },
                                        textStyle : {
                        					fontSize: 11,
                        					color : '#333'
                                    }
                                },
                                    axisTick : {
    									show : false
    								},
    					            splitLine : {
    					            	show:true,
    					            	lineStyle : {
    					            		color : [ '#ececec' ]
    					            	}
    					            },
                                axisLine : {
    									show:true,
                                    lineStyle : {
    										color : '#ececec',
                                        width : 1
                                    }
    								},
                                    /*axisLine : {
                                        lineStyle : {
                                            width : 1
                                }
                                    }*/
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                max : 100,
                                axisLabel : {
                                        formatter: '{value}',
                                        textStyle : textStyle
                                },
                                    /*axisLine : {
                                        lineStyle : {
                                            width : 1
                                        }
                                    }*/
                                    axisTick : {
    									show : false
    								},
    					            splitLine : {
    					            	show:true,
    					            	lineStyle : {
    					            		color : [ '#ececec' ]
    					            	}
    					            },
                                axisLine : {
    									show:true,
                                    lineStyle : {
    										color : '#ececec',
                                        width : 1
                                    }
    								},
                                }
                        ],
                        //无数据时的显示效果
                        noDataLoadingOption:{
                            effect: function(params) {
                                return noDataLoadingEffect(params, noDataText);
                            }
                        },
                        series :seriesdata,
                        animation:false
                    };
                //如果指令有传入压轴类型，则重新定义y轴参数
                if (angular.isDefined(scope.yAxis)) {
                    trendOption.yAxis = [{
                        type : 'value',
                        axisLabel : {
                            formatter: function(value){
                            	if (value > 1000) {
                            		var result = value / 1000;
                            		return result + 'k';
                            	} else {
                            		return value;
                            	}
                            }

                        },
                        axisLine : {
                            lineStyle : {
                                width : 1
                            }
                        }
                    }];
                }
                    if (angular.isDefined(scope.yAxis)) {
                	//获取y轴最大值、扩展、回收阈值三者中最大值来定义Y轴
                        var max = maxRate;
                        if (angular.isDefined(scope.markMax) && scope.markMax != "undefined") {
                        	max = Number(scope.markMax) > maxRate ? scope.markMax : maxRate;
                        }
                        if (angular.isDefined(scope.markLow) && scope.markLow != "undefined") {
                    max = Number(max) > scope.markLow ? max : scope.markLow;
                        }
                	trendOption.yAxis = [{
                        type : 'value',
                        max : Math.ceil(max),
                        axisLabel : {
                            formatter: function(value){
                            	if (value > 1000) {
                            		var result = Math.ceil(value / 1000);
                            		return result + 'k';
                            	} else {
                            		return value;
                            	}
                                },
                                textStyle : {
                					fontSize: 11,
                					color : '#333'
                            }

                        },
                            axisTick : {
    							show : false
    						},
    			            splitLine : {
    			            	show:true,
    			            	lineStyle : {
    			            		color : [ '#ececec' ]
    			            	}
    			            },
                        axisLine : {
    							show:true,
                            lineStyle : {
    								color : '#ececec',
                                width : 1
                            }
    						},
                            /*axisLine : {
                                lineStyle : {
                                    width : 1
                        }
                            }*/
                    }];
                }
                if (angular.isDefined(scope.hideLegend) && scope.hideLegend == 'true') {
//                	trendOption.legend = undefined;
                    trendOption.legend.show=false;
                	trendOption.grid = {
                        x: 50,
                        x2:30,
                        y: 10,
                        y2: 50
                    }
                	
                	var max = maxRate;
                	if(angular.isDefined(scope.markMax)  && scope.markMax != "undefined") {
                    	max = Number(scope.markMax) > maxRate ? scope.markMax : maxRate;
                	}
                	if(angular.isDefined(scope.markLow) && scope.markLow != "undefined") {
                		max = Number(max) > scope.markLow ? max : scope.markLow;
                	}
                    	if (max >= 1000) {
                        	trendOption.grid = {
                                    x: 50,
                                    x2:30,
                                    y: 10,
                                    y2: 50
                }
                    	}
                    }
                    if(angular.isDefined(scope.gridY2)) {
                    trendOption.grid.y2 = scope.gridY2;
                }
                    /*if (scope.chart && scope.chart._dom.innerText.length > 0) {
                    	EchartService.dispose(scope.chart);
                		scope.chart = undefined;
                    }*/
                   // scope.chart = EchartService.init(attrs.id);
                    
                    if (angular.isUndefined(scope.chart) || scope.chart == null) {
                scope.chart = echarts.init(element[0]);
                    }
                scope.chart.setOption(trendOption); 
                
            	}
            };
            
            scope.resizeChart = function() {
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.resize();
                    }
            }
            
            //监听大小改变事件，同步刷新图表
            scope.$on('onNavClick', function(event, msg) {
                scope.resizeChart();
            });
            
            //监听浏览器大小变化
            $(window).on('resize', scope.resizeChart);
            /*if ($state.$current.name == "main.cluster.performance") {
              	 $("#clusterPerformance").on('resize', scope.resizeChart);
              } 
              if ($state.$current.name == "main.host.performance") {
              	 $("#hostPerformance").on('resize', scope.resizeChart);
              }
              if ($state.$current.name == "main.vm.performance") {
              	 $("#vmPerformance").on('resize', scope.resizeChart);
              }*/
            scope.$on('onUrlChange', function(event, url, divId){
                if (divId == element[0].id) {
                    scope.url = url;
                    queryData();
                }
            })
            
            scope.$on('onParamsChange', function(event, params, divId){
                if (divId == element[0].id) {
                    urlParam = params;
                    queryData();
                }
            })
            
            //查询数据
            var queryData = function() {
	            $http({
	                method : 'GET',
	                url : scope.url,
	                params: urlParam
	            }).success(function(result) {
	                if (result.state == 0) {
	                    draw(result.data, scope.chartName);//绘图
	                }                
	            });
            }
            
            
            //指令加载完成后加载数据
            element.ready(function() {
            	queryData();
            }); 
            
            $http({
                method: "GET",
                url: "systemConfig/sysConfig?type=sys_conf"
              }).success(function(result){
                var data = result.data;
                var cycle = 30000;
                if(data["monitor.refresh.cycle"]) {
                    cycle = data["monitor.refresh.cycle"];
                }
                scope.intervalTime = setInterval(function(){
                    queryData();
                }, cycle);
             });
            
            scope.$on("$destroy", function() {
                if (angular.isDefined(scope.intervalTime)) {
                	clearInterval(scope.intervalTime);
                }
                $(window).off('resize', scope.resizeChart);
                EchartService.dispose(scope.chart);
                scope.chart = undefined;
            });

        }
    };
}).
//读写线型趋势图。可用于磁盘iops，延迟等有读写之分的线型图。需要外部select组件配合使用
directive('lineRwChart',function($translate, $timeout, $http, EchartService, $state){
    return {
        restrict:'A',
        scope: {
            url:'@',//http请求打url
            urlParam:'=',//htt需要的参数
            currentView:'=',//当前需要显示打读写状态，必须传入对象的一个属性，否则无法监控到该值打变化
            views:'=',//所有view的集合
            noDataText:'='
        },
        link:function(scope, element, attrs){
            if (isEmpty(scope.url)) {
                console.error('url error')
                return;
            }
            
            var urlParam = {}
            if (angular.isDefined(scope.urlParam)) {
                urlParam = scope.urlParam;
            }
            var slipLine = maxSplit;
            //scope.chart = undefined;
            var ele = $(element);
            var noDataText = $translate.instant('common.noData');
            if (angular.isDefined(scope.noDataText)) {
                noDataText = scope.noDataText;
            }
            var symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']
            
            //绘制图形。result：要显示打数据, name：数据名称
            var draw = function(result) {
            	if(!angular.isArray(result) || (result != null &&result.length == 0)){
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.dispose();
                        scope.chart = undefined;
                    }
            		getNoDataText(attrs.id, $translate);
                    return;
                    /*getNoDataText(attrs.id, $translate);
            		scope.chart = undefined;*/
            	} else {
                var names = [];//底部要显示的名称
                var seriesdata = [];//图表的数据
                var viewNames = [];
                    var viewValues = [];
                if (result.length > 0 && result[0].list.length < maxSplit) {
                    slipLine = result[0].list.length;
                }
                
                //下拉框数据
                for(var i = 0; i < result.length; i++){
                    var item = result[i];
                    var name = item.name;
                        var value = item.value;
                    if(name){
                            var devName = name.substring(0, name.lastIndexOf("-"));
                        viewNames.push(devName); 
                            if (value) {
                            	var devValue = value + "(" + devName + ")";
                                viewValues.push(devValue);
                    }
                        }
                    
                }
                    viewNames = viewNames.unique().sort();
                    viewValues = viewValues.unique().sort();
                if (isEmpty(scope.currentView)) {
                    scope.currentView = viewNames[0];
                        if (viewValues.length > 0) {
                        	scope.currentView = viewValues[0];
                        }
                }                
                //下拉框设置
                if (scope.views != undefined) {
                    scope.views.splice(0, scope.views.length);
                        if (viewValues.length > 0) {
                        	for(var i = 0; i < viewValues.length; i++) {
                                scope.views.push({value:viewValues[i], label:viewValues[i]});
                            }
                        } else {
                    for(var i = 0; i < viewNames.length; i++) {
                        scope.views.push({value:viewNames[i], label:viewNames[i]});
                    }
                }
                    }

                if(angular.isArray(result) && result.length > 0){
                    	var j = 0;
                        for(var i=0; i<result.length; i++){
                            var lineName = result[i].name.substring(0, result[i].name.lastIndexOf("-"));
                            if (viewValues.length > 0) {
                            	lineName = result[i].value + "(" + lineName + ")";
                            }
                            if (scope.currentView == lineName || scope.currentView == lineName) {
                            names.push(result[i].name)
                            var ratesdata = result[i].list;
                            seriesdata.push({
                                 name : result[i].name,
                                 type : 'line',
                                 showAllSymbol : true,
    								 symbol:symbols[j],
    								 areaStyle:{normal : {}},
                                    symbolSize:0,
                                     showAllSymbol : true,
                                     symbol:symbols[j],
                                 smooth : true,
                                     itemStyle: {
                                         normal: {
                                             color: areaColor[j],
                                             lineStyle: {
     					                        width: 1
     					                    }
                                         },
                                     },
                                     areaStyle: {
                                         normal: {
                                        	 color: areaColor[j]
                                             /*color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                 offset: 0,
                                                 color: areaColor[j]
                                             }, {
                                                 offset: 1,
                                                 color: areaColor[j]
                                             }])*/
                                         },
                                         lineStyle:{width:1}
                                     },
                                     lineStyle:{width:1},
                                 symbolSize:0,
                                 data : (function(rates) {
                                     var d = [];
                                     for (var j=0;j<rates.length;j++){
                                         d.push([new Date(rates[j].time),
                                                 rates[j].rate.toFixed(2) - 0 ]);
                                     }
                                     return d;
                                 })(ratesdata)
                             });//放置一个linechart
                                j++;
                        }
                    }
                    } else {
                        var ratesdata = [];
                        seriesdata.push({
                            name : '',
                            type : 'line',
                            showAllSymbol : true,
                            showSymbol:false,
                            smooth : true,
                            data : (function(rates) {
                                var d = [];
                                for (var j=0;j<rates.length;j++){
                                    d.push([new Date(rates[j].time),
                                            rates[j].rate.toFixed(2) - 0 ]);
                }
                                return d;
                            })(ratesdata)
                        });//放置一个linechart
                    }
                var trendOption = {
                    tooltip : {
                            trigger: 'axis',
                            axisPointer:{
		         	    		lineStyle:{
		         	    			color:'#e4eaec'
			    		    }
			    	    },
                        formatter : function (params) {
                            	var result = "";
                            	for (var j =0;j < params.length ;j++){
                            		 var date = new Date(params[j].value[0]);
                                     var name = params[j].seriesName;
                            var nameStr = "";
                            if (!isEmpty(name) && name.getWidth(14) > 150) {
                                var n = name.length;
                                var index = 0;
                                for (var i = 1; i < n + 1; i++) {
                                     if (name.substring(index, i).getWidth(14) > 150 || i == n) {
                                    	 index = i;
                                    	 nameStr += name[i-1] + "<br/>";
                                     } else {
                                    	 nameStr += name[i-1];
                                }
                                }
                            } else {
                                         nameStr = name;
                            }
                                     if (result.indexOf(date.Format("yyyy-MM-dd HH:mm")) == -1) {
                                    	 result = date.Format("yyyy-MM-dd HH:mm");
                                     }
                                     
                                     result = result+ '<br/>' + nameStr + ":" +  + params[j].value[1] ;
                                    
                            	}
                            return result;
                        },
                            /*showDelay:200,
                            transitionDuration:0.5*/
                    },
                    legend : {
                        	//textStyle:{color:'auto', animation: false,hoverAnimation:false},
    	    		        animation: false,
    	    		        hoverAnimation:false,
                        data : names,
                            textStyle:{
                            	color:function(params){
                            		
                            	}
                            },
                        y:'bottom'
                    },
                    grid: {
                        x: 50,
                        x2:30,
                        y: 10,
                        y2: 77
                    },
                    xAxis : [
                        {
                            type : 'time',
                            splitNumber:slipLine,
                                axisTick : {
    								show : false
    							},
    				            splitLine : {
    				            	show:true,
    				            	lineStyle : {
    				            		color : [ '#ececec' ]
    				            	}
    				            },
                            axisLine : {
    								show:true,
                                lineStyle : {
    									color : '#ececec',
                                    width : 1
                                }
                            },
                                /*axisLine : {
                                    lineStyle : {
                                        width : 1
                                    }
                                },*/
                            axisLabel : {
                                formatter: function(value){
                                    	var date = new Date(value);
                                        var hour = date.getHours();
                                        var minute = date.getMinutes();
                                    if(minute < 10){
                                        minute = '0' + minute;
                                    }
                                    return hour + ":" + minute;
                                    },
                                    textStyle : {
                    					fontSize: 11,
                    					color : '#333'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            	axisLabel : {
                            		formatter: function(value){
                            			if (value > 1000000) {
                            				var result = value / 1000000;
                            				return result + 'M';
                            			} else if (value > 1000) {
                            				var result = value / 1000;
                            				return result + 'k';
                            			} else {
                            				return value;
                            			}
                            		},
                            		 textStyle : {
                     					fontSize: 11,
                     					color : '#333'
                     			   }
                            
                            	},
                            type : 'value',
                                axisTick : {
    								show : false
    							},
    				            splitLine : {
    				            	show:true,
    				            	lineStyle : {
    				            		color : [ '#ececec' ]
    				            	}
    				            },
                            axisLine : {
    								show:true,
                                lineStyle : {
    									color : '#ececec',
                                    width : 1
                                }
    							},
                                /*axisLine : {
                                    lineStyle : {
                                        width : 1
                            }
                                }*/
                        }
                    ],
                    //无数据时的显示效果
                    noDataLoadingOption:{
                        effect: function(params) {
                            return noDataLoadingEffect(params, noDataText);
                        }
                    },
                    series :seriesdata 
                };
                    /*if (scope.chart && scope.chart._dom.innerText.length > 0) {
                    	EchartService.dispose(scope.chart);
                		scope.chart = undefined;
                    }*/
                    //scope.chart = EchartService.init(element[0]);
                    if (angular.isUndefined(scope.chart) || scope.chart == null) {
                    	scope.chart = echarts.init(element[0]);
                    }
//                    scope.chart = echarts.init(element[0]);
                    scope.chart.setOption(trendOption); 
                
                }
            };
            
            scope.resizeChart = function() {
                $timeout(function() {
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.resize();
                    }
                }, 30);
            }
            //监听大小改变事件，同步刷新图表
            scope.$on('onNavClick', function(event, msg) {
                scope.resizeChart();
            });
            $(window).on('resize', scope.resizeChart);
            //$("#performance").on('resize', scope.resizeChart);
            /*if ($state.$current.name == "main.cluster.performance") {
              	 $("#clusterPerformance").on('resize', scope.resizeChart);
              } 
              if ($state.$current.name == "main.host.performance") {
              	 $("#hostPerformance").on('resize', scope.resizeChart);
              }
              if ($state.$current.name == "main.vm.performance") {
              	 $("#vmPerformance").on('resize', scope.resizeChart);
              }*/
            //监控下拉框的变化
            scope.$watch('currentView', function(newValue, oldValue) {
                if (!isEmpty(newValue) && newValue != oldValue) {
                    queryData();
                }
            });
            
            scope.$on('onUrlChange', function(event, url, divId){
                if (divId == element[0].id) {
                    scope.url = url;
                    queryData();
                }
            });
            
            scope.$on('onParamsChange', function(event, params, divId){
                if (divId == element[0].id) {
                    urlParam = params;
                    queryData();
                }
            });
            
            var queryData = function() {
              //查询数据
                $http({
                    method : 'GET',
                    url : scope.url,
                    params: urlParam
                }).success(function(result) {
                    if (result.state == 0) {
                        draw(result.data);//绘图
                    }                
                });
            };   
            //指令加载完成后加载数据
            element.ready(function() {
            	queryData();
            }); 

            $http({
                method: "GET",
                url: "systemConfig/sysConfig?type=sys_conf"
              }).success(function(result){
                var data = result.data;
                var cycle = 30000;
                if(data["monitor.refresh.cycle"]) {
                    cycle = data["monitor.refresh.cycle"];
                }
                scope.intervalTime = setInterval(function(){
                    queryData();
                }, cycle);
             });
            
            scope.$on("$destroy", function() {
                if (angular.isDefined(scope.intervalTime)) {
                	clearInterval(scope.intervalTime);
                }
                $(window).off('resize', scope.resizeChart);
                EchartService.dispose(scope.chart);
                scope.chart = undefined;
            });
            
        }
    };
})

//线型趋势图，暂时只用于drx性能数据显示
.directive('singleSelectedLineChart',function($translate, $timeout, $http, EchartService){
    return {
        restrict:'A',
        scope: {
            url:'@',//http请求打url
//            urlParam:'=',//htt需要的参数
            chartName:'@',//单条线的名称，不定义代表有多条线
            yAxis:'@',//y轴显示样式，默认显示百分比
            hideLegend:'@',// legend参数是否隐藏：true为隐藏
            colorIndex:'@',//指定线的颜色，数字型取值：0-8
            gridY2:'@',//右下角y轴位置
            maxLegend:'@',
            selected:'='
        },
        link:function(scope, element, attrs){
            if (angular.isUndefined(scope.selected)) {
                scope.selected = "cpu";
            }
            if (isEmpty(scope.url)) {
                console.error('url error')
                return;
            }
            if (angular.isUndefined(scope.urlParam)) {
                scope.urlParam = {};
            }
            var colorIndex = 0;
            if (angular.isDefined(scope.colorIndex)) {
                colorIndex = scope.colorIndex;
            }
            var noDataText = $translate.instant('common.noData');
            var slipLine = maxSplit;
            var ele = $(element);
            scope.chart = undefined;
//            var chart = echarts.init(element[0]);
            //绘制图形。result：要显示打数据, name：数据名称
            var draw = function(result, name) {//传入那么属性，代表图形为单线型
                if(!angular.isArray(result) || result.length <= 0){
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.dispose();
                        return;
                    }
                }
                
                
                var names = [];//底部要显示的名称
                var seriesdata = [];//图表的数据
                    if (result.length == 0) {
                        var ratesdata = [];
                        seriesdata.push({
                            name : '',
                            type : 'line',
                            showAllSymbol : true,
                            smooth : true,
                            data : (function(rates) {
                                var d = [];
                                for (var j=0;j<rates.length;j++){
                                    d.push([new Date(rates[j].time),
                                            rates[j].rate.toFixed(2) - 0 ]);
                                }
                                return d;
                            })(ratesdata)
                        });//放置一个linechart
                    } else {
                        if (result[0].list.length < maxSplit) {
                            slipLine = result[0].list.length;
                        }
                        var j = 0;
                        for(var i=0; i<result.length; i++){
                            if (angular.isDefined(scope.maxLegend)) {
                                if (i < scope.maxLegend) {
                                    names.push(result[i].name);
                                }
                            } else {
                                names.push(result[i].name);
                            }                            
                            var ratesdata = result[i].list;
//                            var yIndex = 0;
//                            if (result[i].name == "flowLink") {
//                                yIndex = 1;
//                            }
                            seriesdata.push({
                                 name : result[i].name,
                                 type : 'line',
                                 showAllSymbol : true,
								 symbol:symbols[j],
					             itemStyle: {
					                normal: {
					                	color : areaColor[j],
					                    lineStyle: {
					                        width: 1
					                    }
					                }
					             },
					             areaStyle: {
                                    normal: {
                                    	 color: areaColor[j]
                                        /*color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: areaColor[j]
                                        }, {
                                            offset: 1,
                                            color: areaColor[j]
                                        }])*/
                                    },
                                },
                                symbolSize:0,
//                                 yAxisIndex: yIndex,
                                /* showAllSymbol : true,
                                 smooth : true,
                                 //itemStyle:{normal:{areaStyle:{type:'default'},lineStyle:{width:1}}},
                                 symbolSize:0,*/
                                 data : (function(rates) {
                                     var d = [];
                                     for (var j=0;j<rates.length;j++){
                                         d.push([new Date(rates[j].time),
                                                 rates[j].rate.toFixed(2) - 0 ]);
                                     }
                                     return d;
                                 })(ratesdata)
                             });//放置一个linechart
                            j++;
                        }
                    }
//                }
                var trendOption = {
//                        title: {
//                            text : name + '-' +  scope.selected,
//                            padding: [0, 0, 0, 30],
//                            textStyle : {
//                                fontSize : 10
//                            }
//                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer:{
		         	    		lineStyle:{
		         	    			color:'#e4eaec'
    			    		    }
    			    	    },
                            /*formatter : function (params) {
                                var date = new Date(params.value[0]);
                                var name = params.series.name;
                                var nameStr = "";
                                if (!isEmpty(name) && name.getWidth(14) > 150) {
                                    var n = name.length;
                                    var index = 0;
                                    for (var i = 1; i < n + 1; i++) {
                                         if (name.substring(index, i).getWidth(14) > 150 || i == n) {
                                        	 index = i;
                                        	 nameStr += name[i-1] + "<br/>";
                                         } else {
                                        	 nameStr += name[i-1];
                                    }
                                    }
                                } else {
                                    nameStr = name + "<br/>";
                                }
                                var result = nameStr
                                + date.Format("yyyy-MM-dd HH:mm") + '<br/>'
                                       + params.value[1] ;
                                return result;
                            },*/
                           /* showDelay:200,
                            transitionDuration:0.5*/
                            },
                        legend : {
                            data : names,
                            x:'center',
                            y:'top',
                            textStyle: {
                                fontSize: 18,
                                color:function(params){
                            		
                            	}
                            },
                            selectedMode:'single',
                            selected: {
                                'cpu': scope.selected == 'cpu',
                                'mem': scope.selected == 'mem',
                                'flowLink': scope.selected == 'flowLink'
                            },
                            padding: [10, 20, 0, 10]
                            
                        },
                        grid: {
                            x: 50,
                            x2:30,
                            y: '15%',
                            y2: '10%'
                        },
                        xAxis : [
                            {
                                type : 'time',
                                splitNumber:slipLine,
                                axisLabel : {
                                    formatter: function(value){
                                    	var date = new Date(value);
                                        var hour = date.getHours();
                                        var minute = date.getMinutes();
                                        if(minute < 10){
                                            minute = '0' + minute;
                                        }
                                        return hour + ":" + minute;
                                    },
                                    textStyle : {
                    					fontSize: 11,
                    					color : '#333'
                                    }
                                },
                                axisTick : {
									show : false
								},
					            splitLine : {
					            	show:true,
					            	lineStyle : {
					            		color : [ '#ececec' ]
					            	}
					            },
                                axisLine : {
									show:true,
                                    lineStyle : {
										color : '#ececec',
                                        width : 1
                                    }
								},
                                /*axisLine : {
                                    lineStyle : {
                                        width : 1
                                }
                                }*/
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                //处理Ｙ轴不同情况
                                max : scope.selected == 'flowLink' ? 'auto' : 100,//auto表示Ｙ轴根据数据变动
                                axisLabel : {
                                    formatter: scope.selected == 'flowLink' ? '{value}' : '{value}%',
                            		 textStyle : {
                     					fontSize: 11,
                     					color : '#333'
                     			   }
                                },
                                axisTick : {
									show : false
								},
					            splitLine : {
					            	show:true,
					            	lineStyle : {
					            		color : [ '#ececec' ]
					            	}
					            },
                                axisLine : {
									show:true,
                                    lineStyle : {
										color : '#ececec',
                                        width : 1
                                    }
								},
                                /*axisLine : {
                                    lineStyle : {
                                        width : 1
                                }
                                }*/
                            }
                        ],
                        //无数据时的显示效果
                        noDataLoadingOption:{
                            effect: function(params) {
                                return noDataLoadingEffect(params, noDataText);
                            }
                        },
                        series :seriesdata,
                        animation:false
                    };
                //如果指令有传入压轴类型，则重新定义y轴参数
                if (angular.isDefined(scope.yAxis)) {
                    trendOption.yAxis = [{
                        type : 'value',
                        axisLine : {
                            lineStyle : {
                                width : 1
                            }
                        }
                    }];
                }
                if (angular.isDefined(scope.hideLegend) && scope.hideLegend == 'true') {
//                  trendOption.legend = undefined;
                    trendOption.legend.show=false;
                    trendOption.grid = {
                        x: 50,
                        x2:30,
                        y: 10,
                        y2: 50
                    }
                }
                if(angular.isDefined(scope.gridY2)) {
                    trendOption.grid.y2 = scope.gridY2;
                }
                scope.chart = EchartService.init(element[0]);
//                scope.chart = echarts.init(element[0]);
                scope.chart.setOption(trendOption); 
                
                //监听legend的选择
                scope.chart.on(echarts.config.EVENT.LEGEND_SELECTED, function(param){
                    scope.selected = param.target;
                    $timeout(function(){
                        draw(result, name);//由于不同性能数据对应的Ｙ轴不同，所以需要重新画图
                    });
                })
            };
            
            scope.resizeChart = function() {
                $timeout(function() {
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.resize();
                    }
                }, 30);
            }
            //监听大小改变事件，同步刷新图表
            scope.$on('onNavClick', function(event, msg) {
                scope.resizeChart();
            });
            //监听浏览器大小变化
            $(window).on('resize', scope.resizeChart);
            
            
//            scope.$on('onUrlChange', function(event, url){
//                scope.url = url;
//                queryData();
//            })
            
            //查询数据
            var queryData = function() {
                $http({
                    method : 'GET',
                    url : scope.url,
                    params: scope.urlParam
                }).success(function(result) {
                    if (result.state == 0) {
                        draw(result.data, scope.chartName);//绘图
                    }                
                });
            }
            queryData();
            
            $http({
                method: "GET",
                url: "systemConfig/sysConfig?type=sys_conf"
              }).success(function(result){
                var data = result.data;
                var cycle = 30000;
                if(data["monitor.refresh.cycle"]) {
                    cycle = data["monitor.refresh.cycle"];
                }
                scope.intervalTime = setInterval(function(){
                    queryData();
                }, cycle);
             });
            scope.$on("$destroy", function() {
                if (angular.isDefined(scope.intervalTime)) {
                    clearInterval(scope.intervalTime);
                }
                $(window).off('resize', scope.resizeChart);
                EchartService.dispose(scope.chart);
                scope.chart = undefined;
            });
            
        }
    };
})//饼图将value按百分比切块
.directive('pieChart',function($translate, $timeout, $http, EchartService){
    return {
        restrict:'A',
        scope: {
            url:'@',//http请求打url
            hideLegend:'@',// legend参数是否隐藏：true为隐藏
            noDataText:'@',
            orient:'@',
            intervalQuery:'@'
        },
        link:function(scope, element, attrs) {
            if (isEmpty(scope.url)) {
                console.error('url error')
                return;
            }
            var noDataText = $translate.instant('common.noData');
            if (angular.isDefined(scope.noDataText)) {
                noDataText = scope.noDataText;
            }
            var rcColors = [getRedRgba(1), '#558ECB', getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
            scope.chart  = undefined;
            //绘制饼图
            var draw = function(result) {
            	if(!angular.isArray(result) || (result != null && result.length <= 0)){
                    if (angular.isDefined(scope.chart)) {
                        scope.chart.dispose();
                        scope.chart = undefined;
                    }
                    getNoDataText(attrs.id, $translate);
                    return;
                }
                if (!scope.orient) {
                    scope.orient = 'vertical';
                }
                
                var legendData = [];
                var seriesData = [];
                for (var i = 0; i < result.length; i++) {
                    legendData.push(result[i].name);
                    var data = {};
                    data.name = result[i].name;
                    data.value = result[i].rate;
                    seriesData.push(data);
                }
                
                //画饼图
                var trendOption = {
                        color:rcColors,
                        //animation: false,
                        tooltip:{trigger:'item',formatter:"{d}%"},
                        legend:{orient:scope.orient, x:'left',data:legendData,selectedMode:false},
                        series:[{name:'',type:'pie',radius:'75%',center:['50%', '50%'], data:seriesData}],
                        //无数据时的显示效果
                        noDataLoadingOption:{
                            effect: function(params) {
                                return noDataLoadingEffect(params, noDataText);
                            }
                        }
                };
                
                if (angular.isDefined(scope.hideLegend) && scope.hideLegend == 'true') {
                    trendOption.legend.show=false;
                }
                if (angular.isUndefined(scope.chart) || scope.chart == null) {
                	scope.chart = echarts.init(element[0]);
                }
                scope.chart.setOption(trendOption); 
            }
            
            scope.resizeChart = function() {
                $timeout(function() {
                    if (angular.isDefined(scope.chart) && scope.chart != null) {
                        scope.chart.resize();
                    }
                }, 30);
            }
            
            //监听大小改变事件，同步刷新图表
            scope.$on('onNavClick', function(event, msg) {
                scope.resizeChart();
            });
            
            //监听浏览器大小变化
            $(window).on('resize', scope.resizeChart);
            
            //查询数据
            var queryData = function() {
                $http({
                    method : 'GET',
                    url : scope.url,
                    params: {}
                }).success(function(result) {
                    if (result) {
                        draw(result);//绘图
                    }                
                });
            }
            
            
            //指令加载完成后加载数据
            element.ready(function() {
                queryData();
            }); 
            
            //传入intervalQuery才定时刷新
            if (angular.isDefined(scope.intervalQuery) && scope.intervalQuery == 'true') {
                $http({
                    method: "GET",
                    url: "systemConfig/sysConfig?type=sys_conf"
                  }).success(function(result){
                    var data = result.data;
                    var cycle = 30000;
                    if(data["monitor.refresh.cycle"]) {
                        cycle = data["monitor.refresh.cycle"];
                    }
                    scope.intervalTime = setInterval(function(){
                        queryData();
                    }, cycle);
                 });
            }
            
            scope.$on("$destroy", function() {
                if (angular.isDefined(scope.intervalTime)) {
                    clearInterval(scope.intervalTime);
                }
                EchartService.dispose(scope.chart);
            });
        }
    };
});

