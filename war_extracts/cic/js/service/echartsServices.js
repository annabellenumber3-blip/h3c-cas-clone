angular.module('app.echartservices',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('EchartService', function($http ,$rootScope, $translate, $filter, $compile,$state, UtilService, HttpService){
	var overControlWarn = function (num){
		if(num>9999999){
			return parseInt(num/10000000) + $translate.instant('dashboard.tenmillion');
		}else if(num>99999){
			return parseInt(num/10000) + $translate.instant('dashboard.tenthousand');
		}else{
			return num;
		}
	};
	var rpOrCpData = {};
	return {
		/**主机top5 cpu**/
		hostTop5Cpu :function(url, echartInstance, noDataText, targetId) {
			if (typeof echartInstance == 'string') {
				echartInstance = echarts.init(document.getElementById(echartInstance));
			}
			return this.top5Cpu(url, echartInstance, constant.DASHBOARD_HOST, noDataText, targetId);
		},
		/**主机top5 内存**/
		hostTop5Mem :function(url, echartInstance, noDataText, targetId) {
			if (typeof echartInstance == 'string') {
				echartInstance = echarts.init(document.getElementById(echartInstance));
			}
			return this.top5Mem(url, echartInstance, constant.DASHBOARD_HOST, noDataText, targetId);
		},
		/**虚拟机top5 cpu**/
		vmTop5Cpu :function(url, echartInstance, noDataText, targetId) {
			if (typeof echartInstance == 'string') {
				echartInstance = echarts.init(document.getElementById(echartInstance));
			}
			return this.top5Cpu(url, echartInstance, constant.DASHBOARD_VM, noDataText, targetId);
		},
		/**虚拟机top5 内存**/
		vmTop5Mem :function(url, echartInstance, noDataText, targetId) {
			if (typeof echartInstance == 'string') {
				echartInstance = echarts.init(document.getElementById(echartInstance));
			}
			return this.top5Mem(url, echartInstance, constant.DASHBOARD_VM, noDataText, targetId);
		},
		/* url:请求路径  
		 * cpuTop5 ：echartInstance  
		 * type：host 代表主机  vm:虚拟机   
		 * noDataText：没有数据时显示的文字
		*/
		top5Cpu : function (url, cpuTop5, type, noDataText, targetId) {
			if (typeof cpuTop5 == 'string') {
				cpuTop5 = echarts.init(document.getElementById(cpuTop5));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					if (result.data) {
						result = result.data;
					}
					if (result != null && result.length == 0) {
						getNoDataText(targetId,$translate);
					} else {
					if (isEmpty(noDataText)) {
		                noDataText = '';
		            }
					// 有legend才能分配颜色，但是不现实legend
					var names = [];
					var rcColors = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
					var rcColors_others = [getRedRgba(0.18), getYellowRgba(0.18), getPurpleRgba(0.18), 
					                       getBlueRgba(0.18), getGreenRgba(0.18)];
					// 五个圆环的位置
					var centers = [['33%', '25%'],['67%', '25%'],['15%', '70%'],['50%', '70%'],['85%', '70%']];
					// 环的大小
					var radius = ['30%', '35%'];
					var maxLength = 7;
					if (result.length == 1) {
						centers = [['50%','50%']];
						radius = ['65%', '75%'];
						maxLength = 16;
					} else if (result.length == 2) {
						centers = [['25%', '50%'],['75%', '50%']];
						radius = ['45%', '55%'];
						maxLength = 10;
					} else if (result.length == 3) {
						centers = [['15%', '50%'],['50%', '50%'],['85%', '50%']];
						radius = ['35%', '40%'];
						maxLength = 8;
					} else if (result.length == 4) {
						centers = [['25%', '25%'],['75%', '25%'],['25%', '75%'],['75%', '75%']];
						radius = ['35%', '40%'];
						maxLength = 8;
					}
						/*var i = 0;
						var j = 0;*/
					// 生成显示数据
					var seriesdata = [];
						/*var labelTop = {
							normal : {
									color : rcColors[i++],
								label : {
									show : true,
									position : 'center',
									formatter : function(params) {
										return params.value + '%';
									},
									textStyle : {
										baseline : 'bottom',
										fontSize : 14						
									}
								},
								labelLine : {
									show : false
								}
							}
					};
					var labelBottom = {
							normal : {
									color : rcColors_others[j++],
								label : {
									show : true,
									position : 'center',
									formatter : function(params) {
										var name = params.name.substring(0, params.name.length - 3);
										var length = 0;
										for (var i=0; i<name.length; i++) {
											if (name.charCodeAt(i) > 255) {
												length +=2;
											} else {
												length ++;
											}
											if (length > maxLength) {
												name = name.substring(0, i) + "...";
												break;
											}
										}
										return name;
									},
									textStyle : {
										baseline : 'top',
										fontSize : 14,
										color : '#333'
									}
								},
								labelLine : {
									show : false
								}
							},
							emphasis : {
								color : 'rgba(0,0,0,0)'
							}
						};*/
					// 生成绘图数据
					if (result.length == 0) {
					    names.push('');
		                seriesdata.push({
		                    name : $translate.instant('dashboard.cpuUseInfo'),
		                    type : 'pie',
		                    center : centers[j],
		                    radius : radius,
		                    data : []
		                });
					} else {
		    			for (var j=0;j<result.length;j++){
		    				names.push(result[j].name);
		    				seriesdata.push({
		    					name : $translate.instant('dashboard.cpuUseInfo'),
		    					type : 'pie',
		    					center : centers[j],
		    					radius : radius,
		    					data : [
			    					        {
			    					        	name:result[j].name, 
			    					        	value:Number(result[j].rate).toFixed(2),
			    					        	itemStyle : {
				    								normal : {
				    									color : rcColors[j],
				    									label : {
				    										show : true,
				    										position : 'center',
				    										formatter : function(params) {
				    											return params.value + '%';
				    										},
				    										textStyle : {
				    											baseline : 'bottom',
				    											fontSize : 14						
				    										}
				    									},
				    									labelLine : {
				    										show : false
				    									}
				    								}
				    						   }
			    					        },
			    					        {
			    					        	name:result[j].name + ' ' + $translate.instant('dashboard.cpuFree'), 
			    					        	value:(100-Number(result[j].rate)).toFixed(2), 
			    					        	itemStyle : {
				    								normal : {
				    									color : rcColors_others[j],
				    									label : {
				    										show : true,
				    										position : 'center',
				    										formatter : function(params) {
				    											var name = params.name.substring(0, params.name.length - 3);
				    											var length = 0;
				    											for (var i=0; i<name.length; i++) {
				    												if (name.charCodeAt(i) > 255) {
				    													length +=2;
				    												} else {
				    													length ++;
				    												}
				    												if (length > maxLength) {
				    													name = name.substring(0, i) + "...";
				    													break;
				    												}
				    											}
				    											return name;
				    										},
				    										textStyle : {
				    											baseline : 'top',
				    											fontSize : 14,
				    											color : '#333'
				    										}
				    									},
				    									labelLine : {
				    										show : false
				    									}
				    								},
				    								emphasis : {
				    									color : rcColors_others[j]
				    								}
				    						}
			    					        }
		    					        ]
		    				});
		    			}
					}
					var cpuTop5Option = {
							color:rcColors,
							legend: {
								show:false,
								data:names
							},
							animation: false,
							//无数据时的显示效果
		                    noDataLoadingOption:{
		                        effect: function(params) {
		                            return noDataLoadingEffect(params, noDataText);
		                        }
		                    },
							series : seriesdata,
							tooltip : {
								trigger : 'item',
									//修改tooltip的位置
								formatter:function(param){
									var name = param.name;
									if (name.length > 24) {
										name = name.substring(0, name.length/3) + '<br/>' + name.substring(name.length/3, (name.length/3) * 2) +
										'<br/>' + name.substring((name.length/3) * 2);
									}
									var str = param.seriesName + '<br/>' + name + ' : ' + param.value + '%';
									return str;
								}
							} 
					};
						cpuTop5.clear();
						cpuTop5.setOption(cpuTop5Option);
						cpuTop5.on('click', function(param){
							var id = param.data.id;
							if (type == constant.DASHBOARD_HOST) {
								selectTreeNode($rootScope, 'main.host', 'host', 'list', id);
							} else if (type == constant.DASHBOARD_VM){
								selectTreeNode($rootScope, 'main.vm', 'vm', 'list', id);
							}
						});
					
					}
				}
			});
		},
		/* url:请求路径  
		 * memoryTop5 ： echart instance
		 * type：host 代表主机  vm:虚拟机   
		 * noDataText：没有数据时显示的文字
		*/
		top5Mem : function(url, memoryTop5, type, noDataText, targetId) {
			if (typeof memoryTop5 == 'string') {
				memoryTop5 = echarts.init(document.getElementById(memoryTop5));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					if (result.data) {
						result = result.data;
					}
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {
					if (isEmpty(noDataText)) {
					    noDataText = '';
					}
					//
					var rcColors = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
					var names = [];
					// 生成显示数据
					var datas = [];
					// 生成绘图数据
					var hostIds = [];
					var vmIds = [];
					for (var j=0;j<result.length;j++){
						if (type == constant.DASHBOARD_HOST) {
							hostIds.push(result[j].id);
						} else {
							vmIds.push(result[j].id);
						}
						names.push(result[j].name);
						datas.push(Number(result[j].rate).toFixed(2));
					}
					var memoryTop5Option = {
							tooltip : {
								trigger : 'axis',
								axisPointer:{
										type:'none'
								},
								formatter:function(param){
									var name = param[0].name;
										var nameStr = "";
	                                    if (!isEmpty(name) && name.getWidth(14) > 150) {
	                                        var n = name.length;
	                                        var index = 0;
	                                        for (var i = 1; i < n + 1; i++) {
	                                             if (name.substring(index, i).getWidth(14) > 150) {
	                                            	 index = i;
	                                            	 nameStr += name[i-1] + "<br/>";
	                                             } else {
	                                            	 nameStr += name[i-1];
									}
	                                        }
	                                    } else {
	                                        nameStr = name;
	                                    }
										var str = param[0].seriesName+ '<br/>' + nameStr + ' : ' +param[0].value + '%';
									return str;
								}
							},
							grid: {
			    		    	borderWidth : 0,
								x : 47,
								x2 : 20,
								y : 24,
								y2 : 50
			    		    },
							xAxis : [ {
								type : 'category',
								data : names,
								axisLabel : {
									textStyle: {
										fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
											color : '#333'
									},
									interval : 0,rotate:25,
									formatter: function (seriesName,ticket,callback) {
										var length = 0;
										for (var i=0; i<seriesName.length; i++) {
											if (seriesName.charCodeAt(i) > 255) {
												length +=2;
											} else {
												length ++;
											}
											if (length > 8) {
												seriesName = seriesName.substring(0, i) + "...";
												break;
											}
										}
										return seriesName;
									}
								},
								splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisTick : {
									show : false
								}
								
							} ],
							yAxis : [ {
								type : 'value',
								max : 100,
								splitNumber:2,
									axisTick : {
										show : false
									},
									axisLabel : {
										textStyle: {
											fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
											color : '#333'
										},
									},
								splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								}
							} ],
							//无数据时的显示效果
		                    noDataLoadingOption:{
		                        effect: function(params) {
		                            return noDataLoadingEffect(params, noDataText);
		                        }
		                    },
							animation: false,
							series : [ {
								name : $translate.instant('dashboard.memUseInfo'),
								type : 'bar',
//									barWidth: 50,
								itemStyle : {
									normal : {
										color : function(params) {
											// build a color map as your
											// need.
											var colorList = rcColors;
											return colorList[params.dataIndex];
										},
										label : {
											show : true,
											position : 'inside',
											formatter : function(param){
												var str = Math.round(param.value) + '%';
												return str;
											}
										}
									}
								},
								data : datas
							} ]
					};
					// 为echarts对象加载数据
						memoryTop5.clear();
						memoryTop5.setOption(memoryTop5Option); 
						memoryTop5.on('click', function(param){
							if (type == constant.DASHBOARD_HOST) {
								var id = hostIds[param.dataIndex];
								selectTreeNode($rootScope, 'main.host', 'host', 'list', id);
							} else if (type == constant.DASHBOARD_VM) {
								var id = vmIds[param.dataIndex];
								selectTreeNode($rootScope, 'main.vm', 'vm', 'list', id);
							}
						});
						
					}
				}
			});
		},
		/*
		 * 获取折线趋势图
		 * @url 查询数据url
		 * @trendChart id或者echart instance
		 * @flag 折线图区域图标识
		 * @percent Y轴数据是否为百分比
		 * @gridFlag 绘图xy周区域是否是暗色背景
		 */ 
		drawTrend : function(targetId, url, trendChart, params, flag, percent, gridFlag) {
			if (typeof trendChart == 'string') {
				trendChart = echarts.init(document.getElementById(trendChart));
			}
			var self = this;
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				data: params,
				success: function(result){
					if (params.trendFlag) {
						result = result[0].trendRates;
					}
					   // 处理同名显示报错
					   result = self.modifyDuplicateElements(result);
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {
					 // 处理数据
					   var names = [];
					   var seriesdata = [];
					   var yAxisData = [];	    		     
					   var xAxisData = [];	    		     
					   var tooltip = {};	    		     
					   var rcColors = [getRedRgba(0.8), getYellowRgba(0.8), getPurpleRgba(0.8),
					                   getBlueRgba(0.8), getGreenRgba(0.8)];
						   var symbols = ['circle', 'rect', 'triangle', 'diamond', 'pin', 'arrow','roundRect'];
					   var unit = "%";
					   var toolTipName;
					   
					   var textStyle = {
							fontSize: 11,
							color : '#333'
					   };
					   var lineShow = true;
					   var gridStyle =  {
							   x: 45,
							   x2: 30,
							   y: 20,
							   y2: '28%',
							   height:'70%'
					   };
					   
					   if (gridFlag) {
						   var x2value = 20;
						   if (params.trendFlag) {
							   x2value = 40;
						   } 
						   gridStyle = {
								   borderWidth : 0,
								   x : 40,
								   x2 : x2value,
								   y : 20,
								   y2 : 80,
								   backgroundColor: 'rgba(166,199,226,0.05)'
						   };
						   textStyle = {
									fontSize: 11,
									color : '#7dabe2'
							   };
						   lineShow = false;
					   }
					  
					   

					   if (percent) {
						   yAxisData.push({
					            type : 'value',
					            splitNumber:2,
					            axisTick : {
									show : false
								},
					            splitLine : {
					            	show:lineShow,
					            	lineStyle : {
					            		color : [ '#ececec' ]
					            	}
					            },
					            axisLine : {
									show:lineShow,
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
									splitArea:{
						                show:true,
						                areaStyle:{
						                	color: [
						                            'rgba(255,255,255,0.1)'
						                        ]
						                }
						            },
					            axisLabel : {
					                formatter: '{value}',
					                textStyle : textStyle
					            }
					        });
					   } else {
						   yAxisData.push({
					            type : 'value',
					            min : 0,
					            max : 100,
					            splitNumber:2,
					            axisTick : {
									show : false
								},
					            splitLine : {
					            	show:lineShow,
					            	lineStyle : {
					            		color : [ '#ececec' ]
					            	}
					            },
						            splitArea:{
						                show:true,
						                areaStyle:{
						                	color: [
						                            'rgba(255,255,255,0.1)'
						                        ]
						                }
						            },
					            axisLine : {
									show:lineShow,
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
					            axisLabel : {
					                formatter: '{value}',
					                textStyle : textStyle
					            }
					        });
					   }
					   
					   for (var i=0;i<result.length;i++){
						   names.push(result[i].name);
						   var ratesdata = result[i].rates;
						   if (flag) {
							   seriesdata.push({
									name : result[i].name,
									type : 'line',
									showAllSymbol : true,
										symbol:symbols[i],
						            itemStyle: {
						                normal: {
							                	color : rcColors[i],
											areaStyle: {type: 'default'},
						                    lineStyle: {
						                        width: 1
						                    }
						                }
						            },
									smooth : true,
									symbolSize:0,
									data : (function(rates) {
										var d = [];
										for (var j=0;j<rates.length;j++){
											d.push([new Date(rates[j].time),
											        rates[j].rate.toFixed(2) - 0 ]);
											if (rates[j].status) {
												unit = rates[j].status;
											}
											if (rates[j].name) {
												toolTipName = rates[j].name;
											}
										}
										return d;
									})(ratesdata)
								});// 放置一个linechart
						   } else {
							   seriesdata.push({
									name : result[i].name,
									type : 'line',
									showAllSymbol : true,
										symbol:symbols[i],
						            itemStyle: {
						                normal: {
							                	color : rcColors[i],
						                    lineStyle: {
						                        width: 1
						                    }
						                }
						            },
									smooth : true,
									symbolSize:0,
									data : (function(rates) {
										var d = [];
										for (var j=0;j<rates.length;j++){
											d.push([new Date(rates[j].time),
											        rates[j].rate.toFixed(2) - 0 ]);
											if (rates[j].status) {
												unit = rates[j].status;
											}
											if (rates[j].name) {
												toolTipName = rates[j].name;
											}
										}
										return d;
									})(ratesdata)
								});// 放置一个linechart 
						   }
						}
					   
					   if (params.trendFlag) {
						   xAxisData.push({
							    type : 'time',
					        	splitNumber:6,
					        	splitLine : {
					        		show:lineShow,
					        		lineStyle : {
					        			color : [ '#ececec' ]
					        		}
					        	},
						        	splitArea:{
						                show:true,
						                areaStyle:{
						                	color: [
						                            'rgba(255,255,255,0.1)'
						                        ]
						                }
						            },
					        	axisLine : {
									show:lineShow,
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisTick : {
									show : false
								},
								axisLabel : {
									formatter : function (params) {
										var date = new Date(params);
	    		            			 var year = date.getFullYear();
	    		            			 var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1)
	    		            					 							  : date.getMonth() + 1;
	    		            			 var day = date.getDate() < 10 ? "0" + date.getDate()
	    		            					 					   : date.getDate();
	    		            			 var dateStr = year + "-" + month + "-" + day;
	    		            			 return dateStr;
				    		        },
				    		        textStyle : textStyle
					            }
					        });
						   tooltip = {
				    		        trigger: 'axis',
				    		        axisPointer:{
				         	    		lineStyle:{
				         	    			color:'#e4eaec'
				         	    		}
				         	    	},
			    		        formatter : function (params) {
			    		        	var name = params.series.name;
			    		        	if (toolTipName) {
			    		        		name = toolTipName + ' ' + name;
			    		        	}
									if (name.length > 24) {
										name = name.substring(0, name.length/3) + '<br/>' + name.substring(name.length/3, (name.length/3) * 2) +
										'<br/>' + name.substring((name.length/3) * 2);
									}
			    		            var date = new Date(params.value[0]);
			    		            var year = date.getFullYear();
			            			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1)
			            					 							 : date.getMonth() + 1;
			            			var day = date.getDate() < 10 ? "0" + date.getDate()
			            					 					  : date.getDate();
			            			var dateStr = year + "-" + month + "-" + day;
			    		            return name + '<br/>'
			    		                   + dateStr + '<br/>'
			    		                   + params.value[1] + ' ' + unit ;
			    		        }
			    		    };
						   
					   } else {
						   xAxisData.push({
							    type : 'time',
					        	splitNumber:6,
					        	splitLine : {
					        		show:lineShow,
					        		lineStyle : {
					        			color : [ '#ececec' ]
					        		}
					        	},
						        	splitArea:{
						                show:true,
						                areaStyle:{
						                	color: [
						                            'rgba(255,255,255,0.1)'
						                        ]
						                }
						            },
					        	axisLine : {
									show:lineShow,
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisTick : {
									show : false
								},
								axisLabel : {
									formatter : function (params) {
										var date = new Date(params);
			                            var hour = date.getHours();
			                            var minute = date.getMinutes();
			                            if(minute < 10){
			                                minute = '0' + minute;
			                            }
			                            return hour + ":" + minute;
				    		        },
				    		        textStyle : textStyle
					            }
					        });
						   tooltip = {
					    		        trigger: 'axis',
					    		        axisPointer:{
					         	    		lineStyle:{
					         	    			color:'#e4eaec'
					         	    		}
					         	    	},
			    		        formatter : function (params) {
					    		        	var result = "";
					    		        	for (var j= 0;j<params.length;j++) {
					    		        		var name = params[j].seriesName;
			    		        	if (toolTipName) {
			    		        		name = toolTipName + ' ' + name;
			    		        	}
						    		        	var nameStr = "";
			                                    if (!isEmpty(name) && name.getWidth(14) > 160) {
			                                        var n = name.length;
			                                        var index = 0;
			                                        for (var i = 1; i < n + 1; i++) {
			                                             if (name.substring(index, i).getWidth(14) > 160) {
			                                            	 index = i;
			                                            	 nameStr += name[i-1] + "<br/>";
			                                             } else {
			                                            	 nameStr += name[i-1];
									}
			                                        }
			                                    } else {
			                                        nameStr = name;
			                                    }
						    		            var date = new Date(params[j].value[0]);
			    		            var minute = date.getMinutes();
		                            if(minute < 10){
		                                minute = '0' + minute;
		                            }
		                            var seconds = date.getSeconds();
		                            if(seconds < 10){
		                            	seconds = '0' + seconds;
		                            }
			    		            data = date.getFullYear() + '-'
			    		                   + (date.getMonth() + 1) + '-'
			    		                   + date.getDate() + ' '
			    		                   + date.getHours() + ':'
			    		                   + minute + ':' + seconds;
						    		            if (result.indexOf(data) == -1) {
						    		            	result = data + "<br/>";
			    		        }
						    		            result = result + nameStr + '   ' + params[j].value[1] + '' + unit + "<br/>";
					    		        	}
					    		        	return result;
					    		        }
			    		    };
					   }
				       trendChartOption = {
				    		    tooltip : tooltip,
				    		    legend : {
				    		        formatter: function (seriesName,ticket,callback) {
				    		            if (seriesName.length > 5)
				    		            	seriesName = seriesName.substring(0, 5) + "...";
				    		            return seriesName;
				    		        },
				    		        textStyle:{
				    		        	color:function(params){
				    		        		//return getRedRgba(0.8);
				    		        	}
				    		        },
				    		        data : names,
				    		        y:'bottom'
				    		    },
				    		    grid: gridStyle,
				    		    xAxis : xAxisData,
				    		    yAxis : yAxisData,
				    		    animation: false,
				    		    series :seriesdata
				    		};
					       if (flag) {
							   trendChartOption.tooltip.axisPointer.type = 'none';
						   }
				       if (trendChart) {
				    	   trendChart.clear();
				    	   trendChart.setOption(trendChartOption); 
				       }
					   
				   }
				}
			});
		},
		getHostStatus : function(url, hostCircle) {
			if (typeof hostCircle == 'string') {
				hostCircle = echarts.init(document.getElementById(hostCircle));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					   option = {
						   
						   title : {
							   text : result.total,
							   sublink : '',
							   x : 'center',
							   y : 'center',
							   textStyle : {
								   color : '#436bb3',
								   fontFamily : 'Arial',
								   fontSize : 60,
//								   fontWeight: 'lighter'
							   }
						   },
						   animation: false,
						   tooltip : {
     						   trigger : 'item',
     						   formatter : "{a} <br/>{b} : {c} ({d}%)"
     					   },
						   series : [ {
							   name : $translate.instant('dashboard.host'),
							   type : 'pie',
							   radius : [ '75%', '85%' ],
							   itemStyle : {
								   normal : {
									   color : function(params) {
										   var colorList = [getGreenRgba(1), getRedRgba(1), getBlueRgba(1)];
										   return colorList[params.dataIndex];
									   },
									   label : {
										   show : false
									   },
									   labelLine : {
										   show : false
									   }
								   }
							   },
							   data : [ {
								   value : result.normal,
								   name : $translate.instant('dashboard.opened')
							   }, {
								   value : result.closed,
								   name : $translate.instant('dashboard.unKnown')
							   }, {
								   value : result.maintain,
								   name : $translate.instant('dashboard.maintain')
							   } ]
						   } ]
					   };
					  /* option.series[0].data = option.series[0].data.filter(function(a){
						   return a.value > 0;
					   });*/
					   if (hostCircle) {
						   hostCircle.clear();
						   hostCircle.setOption(option);
					   }
					   
					   $("#hostInfo #numItem-normal label").html(result.normal);
					   $("#hostInfo #numItem-close label").html(result.closed);
					   $("#hostInfo #numItem-maintain label").html(result.maintain);
					   
					   $("#numBar").show();
				   }
			});
		},
        getVmStatus :function(url, vmCircle, forwardFunction) {
        	if (typeof vmCircle == 'string') {
        		vmCircle = echarts.init(document.getElementById(vmCircle)); 
			}
        	$.ajax({
        		type: "GET",
        		dataType:"json",
        		url: url,
        		success: function(result){
        			// 虚拟机状态
        			option = {
        				title : {
        					text : result.total,
        					sublink : '',
        					x : 'center',
        					y : 'center',
        					textStyle : {
        						color : '#436bb3',
        						fontFamily : 'Arial',
        						fontSize : 60
        					}
        					
        				},
        				animation: false,
        				tooltip : {
  						   trigger : 'item',
  						   formatter : "{a} <br/>{b} : {c} ({d}%)"
  					   },
        				series : [ {
        					name : $translate.instant('dashboard.vm'),
        					type : 'pie',
        					radius : [ '75%', '85%' ],
        					
        					itemStyle : {
        						normal : {
        							color : function(params) {
        								// build a color map as your need.
        								var colorList = [getGreenRgba(1), getRedRgba(1), getYellowRgba(1)];
        								return colorList[params.dataIndex];
        							},
        							label : {
        								show : false
        							},
        							labelLine : {
        								show : false
        							}
        						}
        					},
        					data : [ {
        						value : result.running,
        						name : $translate.instant('dashboard.opened')
        					}, {
        						value : result.shutOff,
        						name : $translate.instant('dashboard.closed')
        					}, {
        						value : result.unknown,
        						name : $translate.instant('dashboard.unKnown')
        					} ]
        				} ]
        			};
        			/*option.series[0].data = option.series[0].data.filter(function(a){
						   return a.value > 0;
					   });*/
        			if (vmCircle) {
        				vmCircle.clear();
        				vmCircle.setOption(option);
        			}
        			$("#vmInfo #numItem-normal label").html(result.running);
        			$("#vmInfo #numItem-close label").html(result.shutOff);
        			$("#vmInfo #numItem-error label").html(result.unknown);
        			
        			$("#vmnumBar #numItem-normal-vm label").html(result.running);
        			$("#vmnumBar #numItem-close-vm label").html(result.shutOff);
        			$("#vmnumBar #numItem-error-vm label").html(result.unknown);
        			
        			$("#vmnumBar").show();
        			
        			if (forwardFunction) {
        				vmCircle.on('click', forwardFunction);
					}
        		}
        	});
		},
        getUserStatus :function(url, userCircle, forwardFunction) {
        	if (typeof userCircle == 'string') {
        		userCircle = echarts.init(document.getElementById(userCircle)); 
			}
        	$.ajax({
        		type: "GET",
        		dataType:"json",
        		url: url,
        		success: function(result){
        			var labelBottom = {
     					   normal : {
     						   color : '#436bb3',
     						   label : {
     							   show : false
     						   },
     						   labelLine : {
     							   show : false
     						   }
     					   }
     			   },
     			   textNum = {
     					   color:'#436bb3',
     					   fontFamily : '微软雅黑,Arial',
     					   fontSize : 14,
     					   fontWeight : 'normal'
     			   },
     			   textTitle = {
     					   color:'#436bb3',
     					   fontFamily : '微软雅黑,Arial',
     					   fontSize : 14
     			   }
     			   userOption = {
     					   title : {
     						   text : result.userCount,
     						   subtext : "",
     						   sublink : '',
     						   x : 'center',
     						   y : 'center',
     						   textStyle : {
     							   color : '#436bb3',
        						fontFamily : 'Arial',
        						fontSize : 60
     						   },
     					   },
     					   animation: false,
     					   stillShowZeroSum:false,
     					   tooltip : {
     						   trigger : 'item',
     						   formatter : "{a} <br/>{b} : {c} ({d}%)"
     					   },
     					   series : [ {
     						   name :  $translate.instant('dashboard.userNum'),
     						   type : 'pie',
     						   radius : [ '75%', '85%' ],
     						   itemStyle : {
     							   normal : {
     								   color : function(params) {
     									   var colorList = [getGreenRgba(1), getYellowRgba(1)];
     									   return colorList[params.dataIndex];
     								   },
     								   label : {
     									   show : false
     								   },
     								   labelLine : {
     									   show : false
     								   }
     							   }
     						   },
     						   data : [ {
     							   value : result.useryes,
     							   name : $translate.instant('dashboard.useryes')
     						   }, {
     							   value : result.userno,
     							   name : $translate.instant('dashboard.userno')
     						   }]
     					   } ]
        			};
        			/*userOption.series[0].data = userOption.series[0].data.filter(function(a){
        				return a.value > 0;
        			});*/
        			if (userCircle) {
        				userCircle.clear();
        				userCircle.setOption(userOption);
        			}
        			
        			$("#userinfo #numItem-useryes label").html(result.useryes);
        			$("#userinfo #numItem-userno label").html(result.userno);
        			$("#usernumBar").show();

        			if (forwardFunction) {
        				userCircle.on('click', forwardFunction);
        			}
        		}
        	});
		},
		getMaxAndCountRate :function(url, countPic, firstRate, secondRate, lastRate, flag) {
			var subText = [$translate.instant('dashboard.CPU'), $translate.instant('dashboard.memory'), $translate.instant('dashboard.storage'), $translate.instant('dashboard.vm')]
			var color = [getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
			var count = 0;
			var max = 0;			 
			var rate = 0;
        	if (typeof countPic == 'string') {
        		countPic = echarts.init(document.getElementById(countPic)); 
			}
        	$.ajax({
        		type: "GET",
        		dataType:"json",
        		url: url,
        		success: function(result){
        			var text = 0;
        			if (flag == 0) {
        				text = result.cpuCount;
        				count = result.cpuCount;
        				max = result.maxCpu;
        				rate = result.cpuRate;
        			} else if (flag == 1) {
        				text = result.memCount.replace("GB","");
        				count = result.memCount;
        				max = result.maxMem;
        				rate = result.memRate;
        			} else if (flag == 2) {
        				text = result.storageCount.replace("GB","");
        				count = result.storageCount;
        				max = $filter('byteUnitRender4')(result.maxStorage);
        				rate = result.storageRate;
        			} else if (flag == 3) {
        				text = result.vmCount;
        				count = result.vmCount;
        				max = result.maxVm;
        				rate = result.vmRate;
        			}
        			var labelBottom = {
     					   normal : {
     						   color : '#436bb3',
     						   label : {
     							   show : false
     						   },
     						   labelLine : {
     							   show : false
     						   }
     					   }
     			   },
     			   textNum = {
     					   color:'#436bb3',
     					   fontFamily : '微软雅黑,Arial',
     					   fontSize : 14,
     					   fontWeight : 'normal'
     			   },
     			   textTitle = {
     					   color:'#436bb3',
     					   fontFamily : '微软雅黑,Arial',
     					   fontSize : 14
     			   }
        		   option = {
     					   title: {
     						   text: text,
     						  // subtext: subText[flag],
     						  // sublink: '',
     						   x : 'center',
     						   y : 'center',
     						   textStyle : {
        						color : '#436bb3',
        						fontFamily : 'Arial',
        						fontSize : 20,
        						//fontWeight : 'bold'
     					   },
     					   },
     					   animation:false,
     					   series : [
     					             {
     					            	 type : 'pie',
     					            	 radius : ['75%', '85%'],
     					            	itemStyle : {
						            		 normal:{
						            			 label:{
						            				 show:false
     					   },
						            			 labelLine: {
						            				 show:false
     					             }
		},
     						   },
     					            	 data : [
     					            	         {name:subText[flag], value:100, itemStyle : labelBottom}
     					            	         ]
     					             }
     					             ]
     			   };
     			   labelBottom.normal.color = color[flag];
     			   if (countPic) {
     				  countPic.clear();
     				  countPic.setOption(option);
     					             }
	   			   $("#" + firstRate).html(max);
				   $("#" + secondRate).html(count);
				   $("#" + lastRate).html(rate);
     			   }
        	});
		},
		hostTop5CpuFiveCricle : function(url, echartInstance, noDataText) {
			if (typeof echartInstance == 'string') {
				echartInstance = echarts.init(document.getElementById(echartInstance)); 
			}
			this.top5CpuFiveCricle(url, echartInstance, constant.DASHBOARD_HOST, noDataText);
		},
		vmTop5CpuFiveCricle : function(url, echartInstance, noDataText, targetId) {
			if (typeof echartInstance == 'string') {
				echartInstance = echarts.init(document.getElementById(echartInstance));
			}
			this.top5CpuFiveCricle(url, echartInstance, constant.DASHBOARD_VM, noDataText, targetId);
		},
		top5CpuFiveCricle : function(url, vmCpuTop5Chart, type, noDataText, targetId) {
			if (typeof vmCpuTop5Chart == 'string') {
				vmCpuTop5Chart = echarts.init(document.getElementById(vmCpuTop5Chart));
			}
			var self = this;
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: url,
				   success: function(result){
				        if (isEmpty(noDataText)) {
			                noDataText = '';
			            }
						result = result.data;
					   if (result != null && result.length == 0) {
						   getNoDataText(targetId, $translate);
					   } else {

					        
						result = self.modifyDuplicateElements(result);
						var rcColors = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
						var rcColors_other = [getRedRgba(0.18), getYellowRgba(0.18), 
						                      getPurpleRgba(0.18), getBlueRgba(0.18), getGreenRgba(0.18)];
						var radius = [['73%', '83%'],['63%', '73%'],['53%', '63%'],['43%', '53%'],['33%', '43%']];
						var names = [];
						var hostIds = [];
						var vmIds = [];
						var seriesdata = [];
						// 生成绘图数据
						var dataStyle = {
							normal: {
								color : function(params) {
									return rcColors[params.seriesIndex];
								},
								label: {show:false},
								labelLine: {show:false}
							}
						};
						var placeHolderStyle = {
						    normal : {
//						        color: '#e2e2e2',
						    	color : function(params) {
									return rcColors_other[params.seriesIndex];
								},
						        label: {show:false},
						        labelLine: {show:false}
						    },
						    emphasis : {
						        color: 'rgba(0,0,0,0)'
						    }
						};
						if (result.length == 0) {
						    names.push('');
						    seriesdata.push({
		                        name : $translate.instant('dashboard.cpuUseInfo'),
		                        type:'pie',
		                        clockWise:false,
		                        radius : radius[j],
		                        center: ['33.3%', '50%'],
		                        itemStyle : {
		                            normal : {
		                                color : "#C5D341",
		                                label : {
		                                    show : false
		                                },
		                                labelLine : {
		                                    show : false
		                                }
		                            }
		                        },
		                        data : []
		                    });
						} else {
		    				for (var j=0;j<result.length;j++){
		    					names.push(result[j].name);
		    					if (type == constant.DASHBOARD_HOST) {
									hostIds.push(result[j].id);
								} else {
									vmIds.push(result[j].id);
								}
		    					seriesdata.push({
		    						name : $translate.instant('dashboard.cpuUseInfo'),
		    						type:'pie',
		    						clockWise:false,
		    						radius : radius[j],
		    						center: ['33.3%', '50%'],
		    						itemStyle : {
	    									normal: {
	    										color : rcColors[j],
	    										label: {show:false},
	    										labelLine: {show:false}
	    									}
	    								},
			    						data : [
												{
													name:result[j].name, 
													value:Number(result[j].rate).toFixed(2),
												},
			    						        {
			    						        	name:result[j].name + ' ' + $translate.instant('dashboard.cpuFree'), 
			    						        	value:(100-Number(result[j].rate)).toFixed(2), 
			    						        	itemStyle : {
		    							normal : {
//			    									        color: '#e2e2e2',
			    									    	color : rcColors_other[j],
			    									        label: {show:false},
			    									        labelLine: {show:false}
		    								},
			    									    emphasis : {
			    									        color: rcColors_other[j],
		    								}
		    							}
			    						        }
		    						        ]
		    						
		    					});
		    					
		    				}
						}
						var legendY = vmCpuTop5Chart.getDom().offsetHeight / 2;
						if (result.length == 2) {
							legendY = vmCpuTop5Chart.getDom().offsetHeight / 2.5;
						} else if (result.length == 3) {
							legendY = vmCpuTop5Chart.getDom().offsetHeight / 3;
						} else if (result.length == 4) {
							legendY = vmCpuTop5Chart.getDom().offsetHeight / 4;
						} else if (result.length == 5) {
							legendY = vmCpuTop5Chart.getDom().offsetHeight / 4;
						}
						
						var legendX = (vmCpuTop5Chart.getDom().offsetWidth * 2) / 3;
						
						legendStyle =  {
								orient: 'vertical',
								formatter: function (seriesName,ticket,callback) {
									var length = 0;
									for (var i=0; i<seriesName.length; i++) {
										if (seriesName.charCodeAt(i) > 255) {
											length +=2;
										} else {
											length ++;
										}
										if (length > 10) {
											seriesName = seriesName.substring(0, i) + "...";
											break;
										}
									}
									return seriesName;
			    		        },
								y : legendY,
								x : legendX,
								data: names
						};
							
						option = {
						    title: {
						        x: 'center',
						        y: 'center',
						        itemGap: 20,
						        textStyle : {
						            color : 'rgba(30,144,255,0.8)',
						            fontFamily : '"Microsoft Yahei", "微软雅黑"',
						            fontSize : 35,
						            fontWeight : 'bolder'
						        }
						    },
						    tooltip : {
								trigger : 'item',
								//修改tooltip的位置
								formatter:function(param){
									var name = param.name;
										var nameStr = "";
	                                    if (!isEmpty(name) && name.getWidth(14) > 140) {
	                                        var n = name.length;
	                                        var index = 0;
	                                        for (var i = 1; i < n + 1; i++) {
	                                             if (name.substring(index, i).getWidth(14) > 140) {
	                                            	 index = i;
	                                            	 nameStr += name[i-1] + "<br/>";
	                                             } else {
	                                            	 nameStr += name[i-1];
									}
	                                        }
	                                    } else {
	                                        nameStr = name;
	                                    }
										var str = param.seriesName + '<br/>' + nameStr + ' : ' + param.value + '%';
									return str;
								}
							},
							grid: {
		                        borderWidth : 0,
		                        x : 47,
		                        x2 : 20,
		                        y : 24,
		                        y2 : 50
		                    },
							animation: false,
							//无数据时的显示效果
		                    noDataLoadingOption:{
		                        effect: function(params) {
		                            return noDataLoadingEffect(params, noDataText);
		                        }
		                    },
						    legend: legendStyle,
							    /*xAxis:[
						           {
						        	  type : 'time',
						        	   axisLine : {
											show:false
										}
						           }],
						     yAxis:[
						           {
						        	  type : 'value',
						        	   axisLine : {
											show:false
									}
							    }],*/
							    series :seriesdata,
						};
							vmCpuTop5Chart.clear();
							vmCpuTop5Chart.setOption(option);
							vmCpuTop5Chart.on('click', function(param){
								if (type == constant.DASHBOARD_HOST) {
									var id = hostIds[param.seriesIndex];
									selectTreeNode($rootScope, 'main.host', 'host', 'list', id);
								} else if (type == constant.DASHBOARD_VM) {
									var id = vmIds[param.seriesIndex];
									selectTreeNode($rootScope, 'main.vm', 'vm', 'list', id);
								}
							});
					   
						}
				   }
			});
		},
		noDataShow :function (divId) {
			getNoDataText(divId, $translate)
			/*return {
			    noDataLoadingOption:{
			    	text :$translate.instant('common.noData'),//"暂无数据",
			    	    effect : 'bubble',
			    	    effectOption:{
			    	    	effect:{n:0},
			    	    	backgroundColor:"#fff"
			    	    },
			    	    textStyle : {
			    	        fontSize : 14
			    	    }
			    	}
				};*/
		},
		yFormat :function(params) {
			if (params == 0) {
				return 0;
			}
			if (Number(params) < 1) {
				return Number(params).toFixed(2);
			} else if (Number(params) < 10) {
				return Number(params).toFixed(1);
			} else {
				if (Number(params) >= 1000000000) {
					return   (Number(params)/Number(1000000000)).toFixed(1)  + $translate.instant('billion');// "十亿";
				} else if (Number(params) >= 100000000) {
					return   (Number(params)/Number(100000000)).toFixed(1)  + $translate.instant('hundredMillion');// "亿";
				} else if (Number(params) >= 10000000) {
					return   (Number(params)/Number(10000000)).toFixed(1)  + $translate.instant('tenMillion');// "千万";
				} else if (Number(params) >= 1000000) {
					return   (Number(params)/Number(1000000)).toFixed(1)  + $translate.instant('oneMillion');// "百万";
				} else if (Number(params) >= 100000) {
					return   (Number(params)/Number(100000)).toFixed(1)  + $translate.instant('hundredThousand');// "十万";
				} else if (Number(params) >= 10000) {
					return   (Number(params)/Number(10000)).toFixed(1)  + $translate.instant('tenThousand');// "万";
				} else {
					return Number(params).toFixed(0);
				}
			}
		},
		//横柱状图top5
		top5Horzontal : function (url, memoryTop5, params, noDataText, targetId) {
			if (typeof memoryTop5 == 'string') {
				memoryTop5 = echarts.init(document.getElementById(memoryTop5));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				data: params,
				success: function(result){
					if (result.data) {
						result = result.data;
					}
					if (isEmpty(noDataText)) {
		                noDataText = '';
		            }
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {

						
					var rcColors = [red, yellow, green, blue, purple];
					var names = [];
					// 生成显示数据
					var datas = [];
					// 生成绘图数据
					for (var j=0;j<result.length;j++){
						names.push(result[j].name);
						datas.push(Number(result[j].rate).toFixed(2));
					}
					var memoryTop5Option = {
							
							tooltip : {
								trigger : 'axis',
								axisPointer:{
									type:'none'
								},
								formatter:function(param){
										var name = param[0].name;									
										if(name.length > 32){
											name = name.substring(0, name.length/2) + '<br/>' + name.substring(name.length/2);
									}
									var str = param[0].seriesName+ '<br/>' + name + ' : ' +param[0].value + '%';
									return str;
								}
							},
							grid : {
								borderWidth : 0,
								x : 100,
								x2 : 20,
								y : 20,
								y2 : 30,
								backgroundColor: 'rgba(166,199,226,0.1)'
							},
							yAxis : [ {
								type : 'category',
								data : names,
								axisLabel : {
									interval : 0,
									formatter: function (seriesName,ticket,callback) {
										var length = 0;
										for (var i=0; i<seriesName.length; i++) {
											if (seriesName.charCodeAt(i) > 255) {
												length +=2;
											} else {
												length ++;
											}
											if (length > 10) {
												seriesName = seriesName.substring(0, i) + "...";
												break;
											}
										}
										return seriesName;
									},
									textStyle : {
										fontSize: 11,
										color : '#7dabe2'
									}
								},
								splitLine : {
									show:false,
									lineStyle : {
										color : [ '#e4eaec' ]
									}
								},
								axisLine : {
									show:false,
									lineStyle : {
										color : '#e4eaec',
										width : 1
									}
								},
									splitArea:{
						                show:true,
						                areaStyle:{
						                	color: [
						                	        'rgba(255,255,255,0.1)'
						                        ]
						                }
						            },
								axisTick : {
									show : false
								}
								
							} ],
							xAxis : [ {
								type : 'value',
								splitNumber:2,
								max : 100,
								min : 0,
								splitLine : {
									show:false,
									lineStyle : {
										color : [ '#e4eaec' ]
									}
								},
									splitArea:{
						                show:true,
						                areaStyle:{
						                	color: [
						                	        'rgba(255,255,255,0.1)'
						                        ]
						                }
						            },
								axisLine : {
									show:false,
									lineStyle : {
										color : '#e4eaec',
										width : 1
									}
								},
								axisTick : {
									show : false
								},
								axisLabel : {
									textStyle : {
										fontSize: 11,
										color : '#7dabe2'
									}
								}
							} ],
							animation: false,
							series : [ {
								name : $translate.instant('dashboard.cpuUseInfo'),
								type : 'bar',
								barWidth: 12,
								itemStyle : {
									normal : {
										color : function(params) {
//											return zrender.tool.color.lift(colorList[params.dataIndex], params.seriesIndex * 0.2);
											var colorList = rcColors;
											return colorList[params.dataIndex];
//											return zrender.tool.color.getLinearGradient(
//												0,0,0,200,
//												[[0,rcColors[params.dataIndex]], [1, rcColors_others[params.dataIndex]]]
//											)
										},
										label : {
											show : false,
											position : 'inside',
											formatter : '{c}'
										}
									}
								},
								data : datas
							} ]
					};
					if (datas.length > 0) {
						// 为echarts对象加载数据
						if (memoryTop5) {
							memoryTop5.clear();
							memoryTop5.setOption(memoryTop5Option); 
						}
					}
					
				}
				}
			});
		},
		// 主机健康度散点图
		getCVKHealthInfo : function (healthFlow){
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/healthInfo",
				success: function(result){
					var seriesdata = [];
					seriesdata.push({
						name : 'cvk',
						type : 'scatter',
						symbolSize:5,
						data : (function() {
							var d = [];
							for (var j=0; j<result.length - 1; j++){
								d.push([result[j].cpuHealth,
								        result[j].memHealth,
								        result[j].cvkHealth,
								        result[j].name,
								        result[j].storageHealth,
								        result[j].netHealth]);
							}
							return d;
						})()
					});
					healthFlowOption = {
							tooltip : {
								trigger: 'item',
								formatter:function(param){
									var data = param.data;
									var str = data[3] + '<br/>' + 
									$translate.instant('dashboard.cpuHealth') + ' : ' + data[0] + '<br/>' + 
									$translate.instant('dashboard.memHealth') + ' : ' + data[1] + '<br/>' + 
									$translate.instant('dashboard.storageHealth') + ' : ' + data[4] + '<br/>' + 
									$translate.instant('dashboard.netHealth') + ' : ' + data[5] + '<br/>' + 
									$translate.instant('dashboard.cvkHealth') + ' : ' + data[2] ;
									return str;
								}
							},
							grid: {
								x: 70,
								x2:45,
								y: 22,
								y2: 50
							},
							dataRange: {
								min: 0,
								max: 100,
								y: 'center',
								text:[$translate.instant('dashboard.high'), $translate.instant('dashboard.low')],           // 文本，默认为数值文本
								color:[getGreenRgba(1), getYellowRgba(1), getRedRgba(1)],
								calculable : true,
								itemHeight:16,
								padding: 10
							},
							xAxis : [
							         {
							        	 type : 'value',
							        	 scale : true,
							        	 splitLine : {
							        		 lineStyle : {
							        			 color : [ '#ececec' ]
							        		 }
							        	 },
							        	 axisLine : {
							        		 lineStyle : {
							        			 color : '#ececec',
							        			 width : 1
							        		 }
							        	 }
							         }
							         ],
							yAxis : [
							         {
					                	  type : 'value',
					                	  position:'right',
					                	  scale : true,
					                	  splitLine : {
					                		  lineStyle : {
					                			  color : [ '#ececec' ]
					                		  }
					                	  },
					                	  axisLine : {
					                		  lineStyle : {
					                			  color : '#ececec',
					                			  width : 1
					                		  }
					                	  }
							          }
							         ],
							animation: false,
							series:seriesdata
					};
					if(result.length > 1) {
						if (healthFlow) {
							healthFlow.clear();
							healthFlow.setOption(healthFlowOption);
						}
					}
				}
			});
		},
		/**
		 * 大屏幕监控主机健康度
		 */
		dashboard_getCvkInfo : function(id, dataId, type, params) {
			require.config({
	            paths: {
	                echarts: 'js/lib/echarts'
	            }
	        });
	        // 使用
	        require(
	            [
	                'echarts',
	                'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
	            ],
	            function (ec) {  
	            	var nameEchart = 'healthFlow' + dataId + 'echart' + type;
	 			    window[nameEchart] = ec.init(document.getElementById(id));
	        		require('echarts/util/mapData/params').params.cloud = {
				getGeoJson : function (callback) {
			        $.ajax({
			            url: "css/img/dashboard/dashboard_cloud.svg",
			            dataType: 'xml',
			            success: function(xml) {
			                callback(xml);
			            }
			        });
			    }
			};
			
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/healthInfo",
	        			data: params,
				success: function(result){
//					var healthFlow = echarts.init(document.getElementById("dashboard_healthFlow"));
					var seriesdata = [];
					var markPointData = [];
					var markLineData = [];
					var cloudCenter = $translate.instant('dashboard.cloudCenter');
					var geoDatas = [
					            	[309.573, 388.809],
					            	[226.971, 81.82],
					            	[533.172, 130.939],
					                [20.041, 264.545],
					                [589.826, 388.807],
					                [393.472, 17.796],
					                [29.864, 348.047],
					                [636.72, 263.562],
					                [88.829, 133.901],
					                [499.466, 82.817],
						            [611.426, 348.566],
						            [10.131, 310.717],
						            [185.604, 388.809],
						            [171.573, 88.218],
						            [312.533, 35.649],
						            [469.714, 49.402],
						            [58.695, 388.809],
						            [577.777, 145.676],
						            [72.352, 172.703],
						            [429.448, 388.809],
						            [59.663, 220.336],
						            [249.21, 388.809],
						            [487.354, 388.809],
						            [122.789, 388.809],
						            [611.425, 198.262],
						            [535.796, 388.809],
						            [354.073, 22.892],
						            [370.333, 388.809],
						            [600.957, 299.91],
						            [124.5, 101.468],
						            [270.875, 54.313],
						            [435.777, 27.935],
						            [635.202, 223.43]
					                ];
					var geoDistionary = {'' : [365.696, 234.893]};
					var result_length = result.length;
					if (result.length > 33) {
						result_length = 33;
					}
					for (var j=0; j< result_length - 1; j++){
						geoDistionary[result[j].name] = geoDatas[j];
						markLineData.push([{name:''}, {name:result[j].name,value:result[j].cvkHealth}]);
						markPointData.push({name:result[j].name, value:result[j].cvkHealth,
											cpuHealth : result[j].cpuHealth,
											memHealth : result[j].memHealth,
											netHealth : result[j].netHealth,
											storageHealth : result[j].storageHealth});
					}
					seriesdata.push({
						type: 'map',
			            mapType: 'cloud',
			            hoverable: false,
//			            roam: true,//是否启用滚轮缩放功能默认关闭
						data : [],
			            geoCoord: geoDistionary,
			            markLine : {
			                smooth:true,
			                symbol:['emptyCircle', 'arrow'],
			                effect : {
			                    show: true,
			                    scaleSize: 1,
			                    period: 30,
			                    color: '#fff',
			                    shadowBlur: 10
			                },
			                itemStyle : {
			                    normal: {
			                        borderWidth:1,
			                        lineStyle: {
			                            type: 'solid',
			                            shadowBlur: 10
			                        }
			                    }
			                },
			                data : markLineData
			            },
			            markPoint : {
			                symbol:'emptyCircle',
			                symbolSize : function (v){
			                    return 16;
			                },
			                effect : {
			                    show: true,
			                    shadowBlur : 0
			                },
			                itemStyle:{
			                    normal:{
			                        label:{show:false}
			                    },
			                    emphasis: {
			                        label:{show:false,position:'top'}
			                    }
			                },
			                data : markPointData
			            }
					});
					healthFlowOption = {
							dataRange: {
						    	show:false,
						        min : 0,
						        max : 100,
						        calculable : true,
						        color: [getGreenRgba(1), getYellowRgba(1), getRedRgba(1)],
						        textStyle:{
//						            color:'#fff'
						        }
						    },
							tooltip : {
								trigger: 'item',
								formatter:function(param){
									var data = param.data;
									if (typeof(data.cpuHealth) != 'undefined')  {
										var str = data.name + '<br/>' + 
										$translate.instant('dashboard.cpuHealth') + ' : ' + data.cpuHealth + '<br/>' + 
										$translate.instant('dashboard.memHealth') + ' : ' + data.memHealth + '<br/>' + 
										$translate.instant('dashboard.storageHealth') + ' : ' + data.storageHealth + '<br/>' + 
										$translate.instant('dashboard.netHealth') + ' : ' + data.netHealth + '<br/>' + 
										$translate.instant('dashboard.cvkHealth')  + ' : ' + data.value ;
										return str;
									} else {
										return '';
									}
								},
								showContent:true
							},
							series:seriesdata
					};
					if(result.length > 1) {
	        					window[nameEchart].setOption(healthFlowOption);
						}
					}
			});
	            }
	        );
		},
		/**大屏监控告警信息*/
		dashboard_warnInfo : function(warnInfo) {
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/alarm",
				success: function(result){
					var urgent = '#F73737';
					var important = '#d98629';
					var accessor = '#9176ce';
					var warning = '#2ba6eb';
					
					// 画布
//					var warnInfo = echarts.init(document.getElementById('warnInfo')); 
					var rcColors = [urgent, important, accessor, warning];
					var datas = [result.urgent,result.important
					             ,result.accessory,result.warning];
					// 生成显示数据
					var names = [
						{
							value:$translate.instant('dashboard.urgent'),
							textStyle : {
								color:urgent
							}
						},
						{
							value:$translate.instant('dashboard.important'),
							textStyle : {
								color:important
							}
						},
						{
							value:$translate.instant('dashboard.accessor'),
							textStyle : {
								color:accessor
							}
						},
						{
							value:$translate.instant('dashboard.warning'),
							textStyle : {
								color:warning
							}
						}
					];
					var option = {
							tooltip : {
								trigger : 'axis',
								axisPointer:{
									type:'none'
								},
								formatter:function(param){
									var name = param[0].name;
									var str = name + ' : ' +param[0].value;
									return str;
								}
							},
							grid : {
								borderWidth : 0,
								x : 10,
								x2 : 10,
								y : 30,
								y2 : 30
							},
							xAxis : [ {
								type : 'category',
								data : names,
								splitLine : {
									show: false,
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									show: true,
									lineStyle : {
										color : '#8aa4c1',
										width : 0.5
									}
								},
								axisTick : {
									show : false
								}
							} ],
							yAxis : [ {
								show : false,
								type : 'value',
								splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								}
							} ],
							animation: false,
							series : [ {
								type : 'bar',
								barWidth: 25,
								itemStyle : {
									normal : {
										color : function(params) {
											var colorList = rcColors;
											return colorList[params.dataIndex];
										},
										label : {
											show : true,
											position : 'top',
											formatter : function(params) {
												return overControlWarn(params.value) ;
											},
											textStyle : {
												fontSize:14
											}
										}
									}
								},
								data : datas
							} ]
					};
					// 为echarts对象加载数据
					if(result) {
						warnInfo.clear();
						warnInfo.setOption(option); 
					}
				}
			});
		},
		//虚拟机状态
		dashboard_vmStatus : function(url, vmCircle, key, params) {
			if (typeof vmCircle == 'string') {
        		vmCircle = echarts.init(document.getElementById(vmCircle)); 
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				data: params,
				success: function(result){
					var size = 60;
					if (result.total > 1000) {
						size = 40;
					} else if (result.total > 10000){
						size = 20;
					}					
					var option = {
						title : {
							text : result.total,
							sublink : '',
							x : 'center',
							y : 'center',
							padding:0,
							itemGao:0,
							textStyle : {
								color : '#83d0ff',
								fontFamily : 'Arial',
								fontSize : size,
								fontWeight:'lighter'
							}
						},
						tooltip : {
							trigger : 'item',
							formatter : "{a} <br/>{b} : {c} ({d}%)"
						},
						animation: false,
						series : [ {
							name : $translate.instant('dashboard.vm'),
							type : 'pie',
							radius : [ '70%', '90%' ],
							itemStyle : {
								normal : {
									color : function(params) {
										// build a color map as your need.
										var colorList = [getGreenRgba(1), getRedRgba(1), getYellowRgba(1)];
										return colorList[params.dataIndex];
									},
									label : {
										show : false
									},
									labelLine : {
										show : false
									}
								}
							},
							data : [ {
								value : result.running,
								name : $translate.instant('dashboard.opened')
							}, {
								value : result.shutOff,
								name : $translate.instant('dashboard.closed')
							}, {
								value : result.unknown,
								name : $translate.instant('dashboard.unKnown')
							} ]
						} ]
					};
					/*option.series[0].data = option.series[0].data.filter(function(a){
        				return a.value > 0;
        			});*/
					if (vmCircle) {
						vmCircle.clear();
						vmCircle.setOption(option);
					}
					$("#vmInfo" + key + " #numItem-normal label").html(result.running);
					$("#vmInfo" + key + " #numItem-close label").html(result.shutOff);
					$("#vmInfo" + key + " #numItem-error label").html(result.unknown);
				}
			});
		},
		dashboard_hostStatus : function(url, hostCircle, key, params) {
			if (typeof hostCircle == 'string') {
				hostCircle = echarts.init(document.getElementById(hostCircle)); 
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				data: params,
				success: function(result){
					   // 主机状态
					   var option = {
						   title : {
							   text : result.total,
							   sublink : '',
							   x : 'center',
							   y : 'center',
							   textStyle : {
								   color : '#83d0ff',
								   fontFamily : 'Arial',
								   fontSize : 60,
								   fontWeight:'lighter'
							   }
						   },
						   tooltip : {
							   trigger : 'item',
							   formatter : "{a} <br/>{b} : {c} ({d}%)"
						   },
						   animation: false,
						   series : [ {
							   name : $translate.instant('dashboard.host'),
							   type : 'pie',
							   radius : [ '70%', '90%' ],
							   itemStyle : {
								   normal : {
									   color : function(params) {
										   var colorList = [getGreenRgba(1), getYellowRgba(1), getBlueRgba(1)];
										   return colorList[params.dataIndex];
									   },
									   label : {
										   show : false
									   },
									   labelLine : {
										   show : false
									   }
								   }
							   },
							   data : [ {
								   value : result.normal,
								   name :$translate.instant('dashboard.opened')
							   }, {
								   value : result.closed,
								   name : $translate.instant('dashboard.unKnown')
							   }, {
								   value : result.maintain,
								   name : $translate.instant('dashboard.maintain')
							   } ]
						   } ]
					   };
					   /*option.series[0].data = option.series[0].data.filter(function(a){
						   return a.value > 0;
					   });*/
					   if (hostCircle) {
						   hostCircle.clear();
						   hostCircle.setOption(option);
					   }
					   $("#hostInfo" + key + " #numItem-normal label").html(result.normal);
					   $("#hostInfo" + key + " #numItem-error label").html(result.closed);
					   $("#hostInfo" + key + " #numItem-maintain label").html(result.maintain);
				   }
			});
		},
		getRecycleResource : function  (recycleResource) {
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: "cloudMonitor/getRecycleResource",
				   success: function(result){
//						var recycleResource = echarts.init(document.getElementById("recycleResource"));
						var rcColors_other = [getRedRgba(0.18), getYellowRgba(0.18), getPurpleRgba(0.18)];
						var dataStyle = {
							normal: {
								color : function(params) {
									var colorList = [ getRedRgba(), getYellowRgba(), getPurpleRgba() ];
									return colorList[params.dataIndex];
								},
								label: {show:false},
								labelLine: {show:false}
							}
						};
						
						var placeHolderStyle = {
							    normal : {
							    	color : function(params) {
										return rcColors_other[params.seriesIndex];
									},
							        label: {show:false},
							        labelLine: {show:false}
							    },
							    emphasis : {
							        color: 'rgba(0,0,0,0)'
							    }
							};
						
						var legendStyle =  {
								y : 'bottom',
								data:[result.cpuItem,result.memoryItem,result.storageItem],
								itemGap : 5
						};
						
						option = {
							animation: false,
						    title: {
						        x: 'center',
						        y: 'center',
						        itemGap: 20,
						        textStyle : {
						            color : 'rgba(30,144,255,0.8)',
						            fontFamily : '"Microsoft Yahei", "微软雅黑"',
						            fontSize : 35,
						            fontWeight : 'bolder'
						        }
						    },
						    tooltip : {
						        show: true,
						        formatter: $translate.instant('dashboard.recycleCan') + "{b}"
						    },
						    legend: legendStyle,
						    series : [
						        {
						            type:'pie',
						            clockWise:false,
						            center: ['50%', '40%'],
						            radius : ['60%', '75%'],
						            itemStyle : {
										   normal : {
											   color : getRedRgba(),
											   label : {
												   show : false
											   },
											   labelLine : {
												   show : false
											   }
										   }
									   },
						            data:[
						                {
						                    value:result.recycleCpu,
						                    name:result.cpuItem
						                },
						                {
						                    value:result.useVcpu,
						                    name:result.cpuItem,
						                    itemStyle : placeHolderStyle
						                }
						            ]
						        },
						        {
						            type:'pie',
						            clockWise:false,
						            center: ['50%', '40%'],
						            radius : ['45%', '60%'],
						            itemStyle : {
										   normal : {
											   color : getYellowRgba(),
											   label : {
												   show : false
											   },
											   labelLine : {
												   show : false
											   }
										   }
									   },
						            data:[
						                {
						                    value:result.recycleMemory, 
						                    name:result.memoryItem
						                },
						                {
						                    value:result.useVmemory,
						                    name:result.memoryItem,
						                    itemStyle : placeHolderStyle
						                }
						            ]
						        },
						        {
						            type:'pie',
						            clockWise:false,
						            center: ['50%', '40%'],
						            radius : ['30%', '45%'],
						            itemStyle : {
										   normal : {
											   color :getPurpleRgba(),
											   label : {
												   show : false
											   },
											   labelLine : {
												   show : false
											   }
										   }
									   },
						            data:[
						                {
						                    value:result.recycleStorage, 
						                    name:result.storageItem
						                },
						                {
						                    value:result.useStorage,
						                    name:result.storageItem,
						                    itemStyle : placeHolderStyle
						                }
						            ]
						        }
						    ]
						};
						if (recycleResource) {
							recycleResource.clear();
							recycleResource.setOption(option); 
						}
			
					   
				   }
			});
		},

		//存储资源容量监控
		storageResCapacity : function (result, ringChart, index) {
			index = index%5;
			// 有legend才能分配颜色，但是不现实legend
			var rcFontColors = [getGreenRgba(1), getYellowRgba(1), getRedRgba(1)];
			var rcColors = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
			var rcColors_others = [getRedRgba(0.18), getYellowRgba(0.18), getPurpleRgba(0.18), 
			                       getBlueRgba(0.18), getGreenRgba(0.18)];
			// 环的大小
			var radius = ['30%', '35%'];
			var maxLength = 25;
			//圆环的位置
			centers = ['50%','50%'];
			radius = ['65%', '75%'];
			// 生成显示数据
			var seriesdata = [];
			//字体样式
			var textStyle = {
				baseline : 'bottom',
				fontFamily : '微软雅黑,Arial',
				fontSize : 30,
				color : '#436bb3'
			}
			//字体颜色 <=20%:绿色;<=80:黄色;<=100:红色
			if (result.rate <= 0.2) {
				textStyle.color = rcFontColors[0];
			} else if (result.rate <= 0.8) {
				textStyle.color = rcFontColors[1];
			} else {
				textStyle.color = rcFontColors[2];
			}
			
			var usedStyle = {
					normal : {
						color : function(params) {
							return rcColors[index];
						},
						label: {show:false},
						labelLine: {show:false}
					},
					emphasis : {
						color: 'rgba(0,0,0,0)'
					}
			};
			var freeStyle = {
				    normal : {
				    	color : function(params) {
							return rcColors_others[index];
						},
				        label: {show:false},
				        labelLine: {show:false}
				    },
				    emphasis : {
				        color: 'rgba(0,0,0,0)'
				    }
				};
			option = {
					animation: false,
					title: {
						   text: Number(result.rate * 100).toFixed(2) + '%',
						   x: 'center',
						   y: 'center',
						   textStyle : textStyle
					},
					legend: {
						show:true,
						y:'bottom',
						data:[result.name],
						textStyle : {
							 fontSize : 14
						},
						formatter : function(params) {
							if (params.length <= 3) {
								return params;
							}
							var name = params.substring(0, params.length - 3);
							var length = 0;
							for (var i=0; i<name.length; i++) {
								if (name.charCodeAt(i) > 255) {
									length +=2;
								} else {
									length ++;
								}
								if (length > maxLength) {
									name = name.substring(0, i) + "...";
									break;
								} else {
									name = params;
								}
							}
							return name;
						}
						
					},
				    series : [{
				            type:'pie',
				            clockWise:false,
				            center: centers,
				            radius : radius,
				            itemStyle : {
								   normal : {
									   
									   label : {
										   show : false
									   },
									   labelLine : {
										   show : false
									   }
								   }
							   },
				            data:[
				                {
				                	id:result.id,
				                    name: result.name,
				                    value: Number(result.rate * 100).toFixed(2),
				                    tooltip:{
				                    	show: true,
										trigger : 'item',
										formatter:function(param){
											var name = param.name;
											if (name.length > 24) {
												name = name.substring(0, name.length/2) + '<br/>' + name.substring(name.length/2, (name.length/2) * 2);
											}
											var str = name + ' : ' + $filter('byteUnitRender')(Number(result.maxSize) - Number(result.storage));
											return str;
										}
				                    },
				                    itemStyle: usedStyle
				                },
				                {
				                	id:result.id,
				                    name:result.name + ' ' + $translate.instant('dashboard.cpuFree'),
				                    value:(100-Number(result.rate * 100)).toFixed(2),
				                    tooltip:{
				                    	show: true,
										trigger : 'item',
										formatter:function(param){
											var name = param.name;
											if (name.length > 24) {
												name = name.substring(0, name.length/2) + '<br/>' + name.substring(name.length/2, (name.length/2) * 2);
											}
											var str = name + ' : ' + $filter('byteUnitRender')(Number(result.storage));
											return str;
										}
				                    },
				                    itemStyle: freeStyle
				                }
				            ]
				        }],
				    
				    noDataLoadingOption:{
                        effect: function(params) {
 		                   var noDataText = $translate.instant('common.noData');;
                            return noDataLoadingEffect(params, noDataText);
                        }
                    },
					tooltip : {
						show: true,
						trigger : 'item',
						formatter:function(param){
							var name = param.name;
							if (name.length > 24) {
								name = name.substring(0, name.length/2) + '<br/>' + name.substring(name.length/2, (name.length/2) * 2);
							}
							var str = name + ' : ' + param.value + '%';
							return str;
						}
					}
					
				};
			
			if (ringChart) {
				ringChart.clear();
				ringChart.setOption(option);
			}
		
		},
		//风险评估
		drawRiskAssessment : function  (result, riskAssessment) {
			
			var rcColors_other = [getRedRgba(0.18), getYellowRgba(0.18), getPurpleRgba(0.18)];
			var dataStyle = {
				normal: {
					color : function(params) {
						var colorList = [ getRedRgba(), getYellowRgba(), getPurpleRgba() ];
						return colorList[params.dataIndex];
					},
					label: {show:false},
					labelLine: {show:false}
				}
			};
			
			var placeHolderStyle = {
				    normal : {
				    	color : function(params) {
							return rcColors_other[params.seriesIndex];
						},
				        label: {show:false},
				        labelLine: {show:false}
				    },
				    emphasis : {
				        color: 'rgba(0,0,0,0)'
				    }
				};
			
			var textNum = {
					   color:'#333',
					   fontFamily : 'Arial',
					   fontSize : 40,
					   fontWeight : 'lighter'
			};
			var textTitle = {
					   color:'#333',
					   fontFamily : '"Microsoft Yahei","微软雅黑",Arial',
					   fontSize : 12
			};
			
			option = {
				animation: false,
				title: {
					   text: result.level,
					   x: 'center',
					   y: 'center',
					   textStyle : textNum,
					   subtextStyle :textTitle
				},
			    tooltip : {
			        show: true,
			        formatter: "{b}"
			    },
			    series : [
			        {
			            type:'pie',
			            clockWise:false,
			            center: ['50%', '50%'],
			            radius : ['70%', '85%'],
			            itemStyle : {
							   normal : {
								   color : getRedRgba(),
								   label : {
									   show : false
								   },
								   labelLine : {
									   show : false
								   }
							   }
						   },
			            data:[
			                {
			                    value:result.cpuUtilizationValue,
			                    name:result.cpuUse + '%'
			                },
			                {
			                    value:100 - result.cpuUtilizationValue,
			                    name:result.cpuFree + '%',
			                    itemStyle : placeHolderStyle
			                }
			            ]
			        },
			        {
			            type:'pie',
			            clockWise:false,
			            center: ['50%', '50%'],
			            radius : ['55%', '70%'],
			            itemStyle : {
							   normal : {
								   color : getYellowRgba(),
								   label : {
									   show : false
								   },
								   labelLine : {
									   show : false
								   }
							   }
						   },
			            data:[
			                {
			                    value:result.memUtilizationValue, 
			                    name:result.memoryUse + '%'
			                },
			                {
			                    value:100 - result.memUtilizationValue,
			                    name:result.memoryFree + '%',
			                    itemStyle : placeHolderStyle
			                }
			            ]
			        },
			        {
			            type:'pie',
			            clockWise:false,
			            center: ['50%', '50%'],
			            radius : ['40%', '55%'],
			            itemStyle : {
							   normal : {
								   color :getPurpleRgba(),
								   label : {
									   show : false
								   },
								   labelLine : {
									   show : false
								   }
							   }
						   },
			            data:[
			                {
			                    value:result.storageUtilizationValue, 
			                    name:result.storageUse + '%'
			                },
			                {
			                    value:100 - result.storageUtilizationValue,
			                    name:result.storageFree + '%',
			                    itemStyle : placeHolderStyle
			                }
			            ]
			        }
			    ]
			};
			
			if (result.avgDay > 80 && result.avgDay <= 100) {
				   textNum.color = getGreenRgba(1);
			} else if (result.avgDay > 20 && result.avgDay <= 80) {
				   textNum.color = getYellowRgba(1);
			} else if (result.avgDay >= 0 && result.avgDay <= 20) {
				   textNum.color = getRedRgba(1);
			}
			if (riskAssessment) {
				riskAssessment.clear();
				riskAssessment.setOption(option); 
			}
			
		    $('#cpuResourceSurplusDays' + result.resourcePoolId).html((result.cpuHaveApex ? '' : '>') + result.cpuSurplusDay);
		    $('#memResourceSurplusDays' + result.resourcePoolId).html((result.memHaveApex ? '' : '>') + result.memSurplusDay);
		    $('#storageResourceSurplusDays' + result.resourcePoolId).html((result.storageHaveApex  ? '' : '>') + result.storageSurplusDay);
	   },
		// 获取监控信息面板，包含CPU，内存，网络吞吐量，IO吞吐量 titlePosition代表title在图中的位置，100%为正下方，-35%代表上方
		getMonitorChart : function  (url, myChart, titlePosition){ 
			if (typeof myChart == 'string') {
				myChart = echarts.init(document.getElementById(myChart));
			}			
			if (titlePosition == null) {
				titlePosition = '-35%';
				width = '20';
				length = '80%';
			} else {
				width = '18';
				length = '70%';
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					
					var option = {
							animation: false,
						    series : [
						        {
						            name:$translate.instant('dashboard.CPU'),
						            type:'gauge',
						            center : ['25%', '50%'],   
						            radius : '65%',
						            splitNumber:5,
						            axisLine: {            
						                lineStyle: {     
						                    width: width,
						                    color: [[0.2, '#70BE46'],[0.799, '#558ECB'],[1, getRedRgba(1)]],
						                }
						            },
						            axisTick: {           
						                length :10,        
						                lineStyle: {       
//						                    color: 'auto'
						                }
						            },
						            splitLine: {           
						                length :20,        
						                lineStyle: {       
//						                    color: 'auto'
						                }
						            },
						            pointer:{
						                length:length,
						            },
						            title : {
						            	offsetCenter: [0, titlePosition],       // x, y，单位px
						                textStyle: {      
						                	fontWeight: 'bolder',
						                    fontSize: 14,
						                    fontStyle: 'normal',
						                    fontFamily: 'Microsoft Yahei',
						                    color:'#558ECB'
						                }
						            },
						            detail : {
						                textStyle: {      
						                    fontWeight: 'bolder',
						                    fontFamily: 'Microsoft Yahei',
						                    fontSize: 20
						                },
						                offsetCenter:[0,'70%'],
						                formatter:'{value}%'
						            },
						            data:[{value: result.cpu.toFixed(2), name: $translate.instant('dashboard.CPU')}]
						        },
						        
						        {
						            name:$translate.instant('dashboard.memory'),
						            type:'gauge',
						            center : ['75%', '50%'],
						            radius : '65%',
						            splitNumber:5,
						            axisLine: {            
						                lineStyle: {     
						                    width: width,
						                    color: [[0.2, '#70BE46'],[0.799, '#558ECB'],[1, getRedRgba(1)]]
						                }
						            },
						            pointer:{
						                length:length,
						            },
						            axisTick: {           
						                length :10,        
						                lineStyle: {       
//						                    color: 'auto'
						                }
						            },
						            splitLine: {           
						                length :20,        
						                lineStyle: {       
//						                    color: 'auto'
						                }
						            },
						            title : {
						            	offsetCenter: [0, titlePosition],       // x, y，单位px
						                textStyle: {      
						                	fontWeight: 'bolder',
						                    fontSize: 14,
						                    fontStyle: 'normal',
						                    fontFamily: 'Microsoft Yahei',
						                    color:'#558ECB'
						                }
						            },
						            detail : {
						                textStyle: {      
						                    fontWeight: 'bolder',
						                    fontFamily: 'Microsoft Yahei',
						                    fontSize: 20
						                },
						                offsetCenter:[0,'70%'],
						                formatter:'{value}%'
						            },
						            data:[{value: result.mem.toFixed(2), name: $translate.instant('dashboard.memory')}]
						        }
						    ]
						};
					if (myChart) {
						myChart.clear();
						myChart.setOption(option);
					}
				}
			});
		},
		/**画出没有xy轴的趋势图 color 区域图颜色 flag 是否显示xy轴线控制*/
		drawNotXYTrend : function(url, trendChart, color, flag) {
			if (flag) {
				flag = true;
			} else {
				flag = false;
			}
			if (typeof trendChart == 'string') {
				trendChart = echarts.init(document.getElementById(trendChart));
			}
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: url,
				   success: function(result){
					 // 处理数据
					   var names = [];
					   var seriesdata = [];
					   var unit = "%";
					   var yMax = 100;
					   var toolTipName;
					   for (var i=0;i<result.length;i++){
						   names.push(result[i].name);
						   var ratesdata = result[i].rates;
						  
						   seriesdata.push({
								name : result[i].name,
								type : 'line',
								itemStyle: {
					                normal: {
					                	color : color,
					                	areaStyle: {type: 'default'},
					                    lineStyle: {
					                        width: 0
					                    }
					                }
					            },
					            symbolSize:0,
								showAllSymbol : true,
								smooth : true,
								data : (function(rates) {
									var d = [];
									for (var j=0;j<rates.length;j++){
										d.push([new Date(rates[j].time),
										        rates[j].rate.toFixed(2) - 0 ]);
										
										if (rates[j].status) {
											unit = rates[j].status;
											yMax = 'null';
										}
										if (rates[j].name) {
											toolTipName = rates[j].name;
										}
									}
									return d;
								})(ratesdata)
							});// 放置一个linechart
						}
				       trendChartOption = {
				    		    tooltip : {
				    		        trigger: 'item',
				    		        formatter : function (params) {
				    		        	var name = params.series.name;
				    		        	if (toolTipName) {
				    		        		name = toolTipName + ' ' + name;
				    		        	}
										if (name.length > 24) {
											name = name.substring(0, name.length/3) + '<br/>' + name.substring(name.length/3, (name.length/3) * 2) +
											'<br/>' + name.substring((name.length/3) * 2);
										}
				    		            var date = new Date(params.value[0]);
				    		            var minute = date.getMinutes();
			                            if(minute < 10){
			                                minute = '0' + minute;
			                            }
			                            var seconds = date.getSeconds();
			                            if(seconds < 10){
			                            	seconds = '0' + seconds;
			                            }
				    		            data = date.getFullYear() + '-'
				    		                   + (date.getMonth() + 1) + '-'
				    		                   + date.getDate() + ' '
				    		                   + date.getHours() + ':'
				    		                   + minute + ":" + seconds;
				    		            return name+'<br/>'
				    		                   + data + '<br/>'
				    		                   + params.value[1] + ' ' + unit;
				    		        }
				    		    },
				    		    legend : {
				    		    	show : false,
				    		        formatter: function (seriesName,ticket,callback) {
				    		            if (seriesName.length > 12)
				    		            	seriesName = seriesName.substring(0, 12) + "...";
				    		            return seriesName;
				    		        },
				    		        data : names,
				    		        y:'bottom'
				    		    },
				    		    grid: {
				    		    	borderWidth : 0,
									x : 40,
									x2 : 20,
									y : 20,
									y2 : 40
				    		    },
				    		    xAxis : [
				    		        {
				    		        	show : flag,
				    		            type : 'time',
				    		            splitNumber:5,
				    		            splitLine : {
				    		            	lineStyle : {
				    		            		color : [ '#ececec' ]
				    		            	}
				    		            },
				    		            axisLine : {
											lineStyle : {
												color : '#ececec',
												width : 1
											}
										},
										axisLabel : {
											formatter : function (params) {
												var date = new Date(params);
					                            var hour = date.getHours();
					                            var minute = date.getMinutes();
					                            if(minute < 10){
					                                minute = '0' + minute;
					                            }
					                            return hour + ":" + minute;
						    		        }
				    		            }
				    		        }
				    		    ],
				    		    yAxis : [
				    		        {
				    		        	show : flag,
				    		            type : 'value',
				    		            min : 0,
				    		            max : yMax,
				    		            splitNumber:2,
				    		            splitLine : {
											lineStyle : {
												color : [ '#ececec' ]
											}
										},
										axisLine : {
											lineStyle : {
												color : '#ececec',
												width : 1
											}
										},
										axisLabel : {
											formatter : function (params) {
							                	if (params == 0) {
							        				return 0;
							        			}
							        			if (Number(params) < 1) {
							        				return Number(params).toFixed(2);
							        			} else if (Number(params) < 10) {
							        				return Number(params).toFixed(1);
							        			} else {
							        				if (Number(params) >= 100000) {
							        					return   (Number(params)/Number(10000)).toFixed(0)  + $translate.instant('oneBtnSerious.tenThousand');// "万";
							        				} else if (Number(params) >= 10000) {
							        					return   (Number(params)/Number(10000)).toFixed(1)  + $translate.instant('oneBtnSerious.tenThousand');// "万";
							        				} else {
							        					return Number(params).toFixed(0);
							        				}
							        			}
						    		        }
				    		            }
				    		        }
				    		    ],
				    		    animation: false,
				    		    series :seriesdata 
				    		};
				       if (trendChart) {
				    	   trendChart.clear();
				    	   trendChart.setOption(trendChartOption); 
				       }
				   }
			});
		},
		//销毁echarts实例
		dispose: function() {
			var len = arguments.length;
			if (len > 0) {
				for (var i = 0 ; i< len; i++) {
					var echartInstance = arguments[i];
					if (echartInstance && echartInstance.dispose) {
						try {
							echartInstance.dispose();
						} catch(err) {
							console.error(err);
						}
					}
				}
			}
		},
		getWarnInfo : function (){
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/alarm",
				success: function(result){
					if (result) {
						var numArr = [ result.urgent, result.important,
						               result.accessory, result.warning ];
						$(".logCenter").each(function(i) {
							var logNum = $(this).find(".logNum");
							switch (i) {
							case 0:
								logNum.html(overControlWarn(result.urgent));
								break;
							case 1:
								logNum.html(overControlWarn(result.important));
								break;
							case 2:
								logNum.html(overControlWarn(result.accessory));
								break;
							case 3:
								logNum.html(overControlWarn(result.warning));
								break;
							default:
								logNum.html(0);
							break;
							}
						});
						$(".logCenter").show();
						$(".isLoadingImg").hide();
						$(".notFoundImg").hide();
						
						var height = $(".logInfo").outerHeight(true);
						$(".log").css("margin-left", (Number(height) * Number(2))/ Number(100));
						$(".log").css("margin-right", (Number(height) * Number(2))/ Number(100));
						var logheight = $(".logCenter").outerHeight(true);
						$(".logPic").css("margin-top", (Number(logheight) * Number(30))/ Number(100));
						$(".logNum").css("margin-top", (Number(logheight) * Number(30))/ Number(100));
					} else {
						$(".logCenter").hide();
						$(".isLoadingImg").hide();
						$(".notFoundImg").show();
						$(".notFoundImg").css("visibility","visible");
					}
					$(".logTitle").click(function(){
						var level = $(this).attr("data-level");
						$state.go('main.realtimeAlarm', {warnLevel: level});
					});
				}
			});
		},
	modifyDuplicateElements : function (result) {
			// 重复的元素
			var repeatItems = [];
			// 没有重复的元素
			var noRepeatItems = [];
			// 取出重复的元素
		    angular.forEach(result, function(item){
		    	if (noRepeatItems.indexOf(item.name) == -1) {
		    		noRepeatItems.push(item.name);
		    	} else if(repeatItems.indexOf(item.name) == -1) {
		    		repeatItems.push(item.name);
		}



 			});
		    // 给重复的元素添加后缀
		    angular.forEach(repeatItems, function(repeatItem){
		    	var index = 1;
		    	angular.forEach(result, function(resultItem){
				    if (repeatItem == resultItem.name) {
				    	resultItem.name = resultItem.name + '(' + index + ')';
				    	index++;
				    }
				});
	 		});
		    return result;
		},
		getRateResourceCount:function(countPic, url, params, isOrg, id, flag) {
			if (typeof countPic == 'string') {
				countPic = echarts.init(document.getElementById(countPic));
			}
			var uri = "dashboard/source";
			if (!isEmpty(url)) {
				uri = url;
			}
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: uri,
				   data: params,
				   success: function(result){
					   if (!isEmpty(result) && !isEmpty(result.cpuRate)) {
						// CPU 内存统计
//						   var countCpuPic = echarts.init(document.getElementById("countCpuPic"));
						   var rate = 0;
						   var firstCount = 0;
						   var secondCount = 0;
						   var fontSize = 60;
						   var text = 0;
						   offsetHeight = $(countPic._dom).children("div")[0].offsetHeight,
						   tasklistVisibility = $("#bottomPanel").css("visibility"),
						   arr = [Math.round(result.cpuRate).toString().length, Math.round(result.memRate).toString().length,Math.round(result.storageRate).toString().length];
						   arr.sort(function (a,b) {
							   return a - b;
						   });
						   if (flag == 'cpu') {
							   text = Math.round(result.cpuRate);
						   } else if (flag == 'memory'){
							   text = Math.round(result.memRate);
						   } else if (flag == 'storage') {
							   text = Math.round(result.storageRate);
						   }
						   var figure = arr.pop();
						   if (figure == 3 || figure == 2 || figure == 1) {
							   if (tasklistVisibility == "visible" || offsetHeight < 130) {
								   fontSize = 45;
							   }
						   } else if (figure == 4) {
							   if (tasklistVisibility == "visible" || (offsetHeight < 140)) {
								   fontSize = 35;
							   } else if (offsetHeight < 155 && offsetHeight >= 140) {
								   fontSize = 39;
							   } else if (offsetHeight < 160 && offsetHeight >= 155) {
								   fontSize = 42;
							   } else if (offsetHeight < 165 && offsetHeight >= 160) {
								   fontSize = 44;
							   }  
						   }
						   
						   var labelBottom = {
								   normal : {
									   color : '#22baee',
									   label : {
										   show : false
									   },
									   labelLine : {
										   show : false
									   }
								   }
						   },
						   textNum = {
								   color:'#333',
								   fontFamily : 'Arial',
								   fontSize : fontSize,
								   fontWeight : 'lighter'
						   },
						   textTitle = {
								   color:'#333',
								   fontFamily : '"Microsoft Yahei","微软雅黑",Arial',
								   fontSize : 12
						   };
						   cpuOption = {
								   title: {
									   text: text,
									   sublink: '',
									   x: 'center',
									   y: 'center',
									   textStyle : textNum,
									   subtextStyle :textTitle
								   },
								   animation: false,
								   series : [
								             {
								            	 type : 'pie',
								            	 center:['50%','50%'],
								            	 radius : ['75%', '85%'],
								            	 itemStyle : {
								            		 normal:{
								            			 label:{
								            				 show:false
								            			 },
								            			 labelLine: {
								            				 show:false
								            			 }
								            		 },
								            	 },
								            	 data : [
								            	         {name:'', value:100, itemStyle : labelBottom}
								            	         ]
								             }
								             ]
						   };
						   if (flag == 'cpu') {
							   rate = result.cpuRate;
						   } else if (flag == 'memory'){
							   rate = result.memRate;
						   } else if (flag == 'storage') {
							   rate = result.storageRate;
						   }
						   if (rate >= 0 && rate <= 20) {
							   labelBottom.normal.color = getGreenRgba(1);
							   textNum.color = getGreenRgba(1);
						   } else if (rate > 20 && rate <= 80) {
							   labelBottom.normal.color = getYellowRgba(1);
							   textNum.color = getYellowRgba(1);
						   } else if (rate > 80) {
							   labelBottom.normal.color = getRedRgba(1);
							   textNum.color = getRedRgba(1);
						   }
						   if (countPic) {
							   countPic.clear();
							   countPic.setOption(cpuOption);
						   }
						   if (flag == 'cpu') {
						   if (isOrg) {
							   $rootScope.correctRpId = id;
							   if (!isEmpty(result.cpuCount)) {
								   $("#orgHostCPUCount").html(result.cpuCount);
							   }
							   if (!isEmpty(result.vmCpuCount)) {
								   $("#orgVmCPUCount").html(result.vmCpuCount);
							   }
							   if (!isEmpty(result.cpuRate)) {
								   $("#orgCpuRate").html(result.cpuRate + "%");
							   }
							   $rootScope.errorRpId = null;
							   if (result.rpError != undefined && result.rpError != null) {
								   //资源池异常
								   $rootScope.errorRpId = id;
								   $rootScope.correctRpId = null;
								   $("#orgImg"+id+"")[0].src = "css/img/gray/resourcePool_gray.svg";
							   }
						   } else {
							   $rootScope.correctCpId = id;
							   if (!isEmpty(result.cpuCount)) {
								   $("#hostCPUCount").html(result.cpuCount);
							   }
							   if (!isEmpty(result.vmCpuCount)) {
								   $("#vmCPUCount").html(result.vmCpuCount);
							   }
							   if (!isEmpty(result.cpuRate)) {
								   $("#cpuRate").html(result.cpuRate + "%");
							   }
							   $rootScope.errorCpId = null;
							   if (result.rpError != undefined && result.rpError != null) {
								   $rootScope.errorCpId = id;
								   $rootScope.correctCpId = null;
								   //云资源异常
								   $("#img"+id+"")[0].src = "css/img/gray/Icon_cloud_website_16x16.svg";
							   }
						   }
						   } else if (flag == 'memory'){
						   if (isOrg) {
							   if (!isEmpty(result.memCount)) {
								   $("#orgHostMemoryCount").html(result.memCount);
							   }
							   if (!isEmpty(result.vmMemCount)) {
								   $("#orgVmMemoryCount").html(result.vmMemCount);
							   }
							   if (!isEmpty(result.memRate)) {
								   $("#orgMemRate").html(result.memRate + "%");
							   }
						   } else {
							   if (!isEmpty(result.memCount)) {
								   $("#hostMemoryCount").html(result.memCount);
							   }
							   if (!isEmpty(result.vmMemCount)) {
								   $("#vmMemoryCount").html(result.vmMemCount);
							   }
							   if (!isEmpty(result.memRate)) {
								   $("#memRate").html(result.memRate + "%");
							   }
						   }
						   } else if (flag == 'storage') {
						   if (isOrg) {
							   if (!isEmpty(result.totalStorage)) {
								   $("#orgTotalStorage").html(result.totalStorage);
							   }
							   if (!isEmpty(result.usedStorage)) {
								   $("#orgUsedStorage").html(result.usedStorage);
							   }
							   if (!isEmpty(result.storageRate)) {
								   $("#orgStorageRate").html(result.storageRate + "%");
							   }
						   } else {
							   if (!isEmpty(result.totalStorage)) {
								   $("#totalStorage").html(result.totalStorage);
							   }
							   if (!isEmpty(result.usedStorage)) {
								   $("#usedStorage").html(result.usedStorage);
							   }
							   if (!isEmpty(result.storageRate)) {
								   $("#storageRate").html(result.storageRate + "%");
							   }
						   }
					   }
						  
				   }
				   }
			});
		},
		//概览第四页
		getHostInfo : function(hostMonitorCpuChart, hostMonitorMemChart, hostMonitorIoChart, hostMonitorNetChart, scope) {
			var self = this;
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/hostInfo",
				success: function(result){
					if (result.length > 0) {
						var items = "";
						var hostMain = '<ul id="hostCarousel" class="elastislide-list"> </ul>';
						$('.hostElasti').html(hostMain);
						for ( var i = 0; i < result.length; i++) {
							items += '<li>';
							items += '<a class="box host" style="width: 100px; height: 100px;">';
							items += '<span class="custom-picture" style="width: 65px; height: 65px; opacity: 0.7;"> ';
							if (result[i].isOver == 1) {
								items += '<img src="css/img/red/Icon_host.svg">';
							} else {
								items += '<img src="css/img/yellow/Icon_host.svg">';
							}
							var str = result[i].name;
							if (str.length > 7) {
								str = str.substring(0, 7) + "...";
							}
							items += '</span><span class="box-title" custom-title= ' + result[i].name + 
							' id =host' + result[i].id + ' dataId = ' + result[i].id + ' name="' + result[i].name  + '">' + str;
							items += '</span>';
							items += '</a></li>';
						}
						$('#hostCarousel').html($compile(items)(scope));
						$('#hostCarousel').elastislide();
						$('.box.host').click(function(){
							var id = $(this).children(".box-title").attr("dataId");
							var name = $(this).children(".box-title").attr("name");
							var url;
							url = "cloudMonitor/getDefinedTrend?data_id=host_definedInfo&data_item=0&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, hostMonitorCpuChart, getRedRgba(0.8), true);
							url = "cloudMonitor/getDefinedTrend?data_id=host_definedInfo&data_item=1&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, hostMonitorMemChart, getYellowRgba(0.8), true);
							url = "cloudMonitor/getDefinedTrend?data_id=host_definedInfo&data_item=2&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, hostMonitorIoChart, getPurpleRgba(0.8), true);
							url = "cloudMonitor/getDefinedTrend?data_id=host_definedInfo&data_item=3&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, hostMonitorNetChart, getBlueRgba(0.8), true);
							$("#hostName").text(name);
							$('.box.host').attr("class", "box host");
							$(this).attr("class", "box host active");
						});
						$('.box.host').dblclick(function(){
							var id = $(this).children(".box-title").attr("dataId");
							selectTreeNode($rootScope, 'main.host', 'host', 'list', id);
						});
						$("#host" + result[0].id).click();
					} 
				}
			});
		},
		getVmInfo : function(vmMonitorCpuChart, vmMonitorMemChart, vmMonitorIoChart, vmMonitorNetChart, scope) {
			var self = this;
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/vmInfo",
				success: function(result){
					if (result.length > 0) {
						var items = "";
						var hostMain = '<ul id="vmCarousel" class="elastislide-list"> </ul>';
						$('.vmElasti').html(hostMain);
						for ( var i = 0; i < result.length; i++) {
							items += '<li>';
							items += '<a class="box vm" style="width: 100px; height: 100px;">';
							items += '<span class="custom-picture" style="width: 65px; height: 65px; opacity: 0.7;"> ';
							if (result[i].isOver == 1) {
								items += '<img src="css/img/red/Icon_virtual_host.svg">';
							} else {
								items += '<img src="css/img/yellow/Icon_virtual_host.svg">';
							}
							
							var str = result[i].name;
							if (str.length > 7) {
								str = str.substring(0, 7) + "...";
							}
							
							items += '</span><span class="box-title" custom-title= ' + result[i].name + 
						     ' id =vm' + result[i].id + ' dataId = ' + result[i].id + ' name="' + result[i].name + '">' + str;
							items += '</span>';
							items += '</a></li>';
						}
						
						$('#vmCarousel').html($compile(items)(scope));
						$('#vmCarousel').elastislide();
						$('.box.vm').click(function(){
							var id = $(this).children(".box-title").attr("dataId");
							var name = $(this).children(".box-title").attr("name");
							var url;
							url = "cloudMonitor/getDefinedTrend?data_id=vm_definedInfo&data_item=0&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, vmMonitorCpuChart, getRedRgba(0.8), true);
							url = "cloudMonitor/getDefinedTrend?data_id=vm_definedInfo&data_item=1&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, vmMonitorMemChart, getYellowRgba(0.8), true);
							url = "cloudMonitor/getDefinedTrend?data_id=vm_definedInfo&data_item=2&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, vmMonitorIoChart, getPurpleRgba(0.8), true);
							url = "cloudMonitor/getDefinedTrend?data_id=vm_definedInfo&data_item=3&interval=20&data_relative=" + id;
							self.drawNotXYTrend (url, vmMonitorNetChart, getBlueRgba(0.8), true);
							
							$("#vmName").text(name);
							$('.box.vm').attr("class", "box vm");
							$(this).attr("class", "box vm active");
						});
						$('.box.vm').dblclick(function(){
							var id = $(this).children(".box-title").attr("dataId");
							selectTreeNode(scope, 'main.vm', 'vm', 'list', id);
						});
						$("#vm" + result[0].id).click();
					}
				}
			});
		},
		drawCpuMemStorageTrends : function (result, trendChart, targetId) {
					   if (result.length == 0) {
				getNoDataText(targetId, $translate);
						} else {
			   // 处理数据
			   var names = [];
			   var seriesdata = [];
			   var rcColors = [getRedRgba(0.8), getYellowRgba(0.8), getPurpleRgba(0.8),
			                   getBlueRgba(0.8), getGreenRgba(0.8)];
			   var dataSize = 0;

					   for (var i=0;i<result.length;i++){
						   names.push(result[i].name);
						   var ratesdata = result[i].rates;
						  
						   if (Number(dataSize) < ratesdata.length) {
							   dataSize = ratesdata.length;
						   }
						   
						   seriesdata.push({
								name : result[i].name,
								type : 'line',
								showAllSymbol : true,
								itemStyle: {
					                normal: {
					                	color : function(params) {
											var colorList = rcColors;
											return colorList[params.seriesIndex];
										},
					                	areaStyle: {type: 'default'},
					                    lineStyle: {
					                        width: 1
					                    }
					                }
					            },
								smooth : true,
								symbolSize:0,
								data : (function(rates) {
									var d = [];
									for (var j=0;j<rates.length;j++){
										d.push([new Date(rates[j].time),
										        rates[j].rate.toFixed(2) ]);
									}
									return d;
								})(ratesdata)
							});// 放置一个linechart
						   
						}
		       var trendChartOption = {
		    	   		animation : false,
		    		    tooltip : {
		    		        trigger: 'item',
		    		        formatter : function (params) {
		    		        	var name = params.series.name;
								if (name.length > 24) {
									name = name.substring(0, name.length/3) + '<br/>' + name.substring(name.length/3, (name.length/3) * 2) +
									'<br/>' + name.substring((name.length/3) * 2);
								}
		    		            var date = new Date(params.value[0]);
		    		            var year = date.getFullYear();
		            			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1)
		            					 							 : date.getMonth() + 1;
		            			var day = date.getDate() < 10 ? "0" + date.getDate()
		            					 					  : date.getDate();
		            			var dateStr = year + "-" + month + "-" + day;
		    		            return name+'<br/>'
		    		                   + dateStr + '<br/>'
		    		                   + params.value[1] + '%' ;
		    		        }
		    		    },
		    		    //无数据时的显示效果
	                    noDataLoadingOption : {
	                        effect: function(params) {
	                        	var noDataText = $translate.instant('common.noData');;
	                            return noDataLoadingEffect(params, noDataText);
	                        }
	                    },
		    		    legend : {
		    		        formatter: function (seriesName,ticket,callback) {
		    		            if (seriesName.length > 12)
		    		            	seriesName = seriesName.substring(0, 12) + "...";
		    		            return seriesName;
		    		        },
		    		        textStyle:{color:'auto'},
		    		        data : names,
		    		        y:'bottom'
		    		    },
		    		    grid: {
		    		    	x: 45,
		    		    	x2: 45,
		    		    	y: 20,
		    		    	y2: '28%',
		    		    	height:'70%'
		    		    },
		    		    xAxis : [
	    		             {
	    		            	 type : 'time',
	    		            	 splitNumber : 5,
	    		            	 splitLine : {
	    		            		 lineStyle : {
	    		            			 color : [ '#ececec' ]
	    		            		 }
	    		            	 },
	    		            	 axisLine : {
	    		            		 lineStyle : {
	    		            			 color : '#ececec',
	    		            			 width : 1
	    		            		 }
	    		            	 },
	    		            	 axisLabel : {
	    		            		 formatter : function (params) {
	    		            			 var date = new Date(params);
	    		            			 var year = date.getFullYear();
	    		            			 var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1)
	    		            					 							  : date.getMonth() + 1;
	    		            			 var day = date.getDate() < 10 ? "0" + date.getDate()
	    		            					 					   : date.getDate();
	    		            			 var dateStr = year + "-" + month + "-" + day;
	    		            			 return dateStr;
	    		            		 }
	    		            	 }
	    		             }
		    		    ],
		    		    yAxis : [
		    		        {
		    		           type : 'value',
		    		           max : 100,
							   splitNumber:2,
							   splitLine : {
								   lineStyle : {
									   color : [ '#ececec' ]
								   }
							   },
							   axisLabel : {
								   formatter: '{value}'
							   },
							   axisLine : {
								   lineStyle : {
									   color : '#ececec',
									   width : 1
								   }
							   }
		    		        }
		    		    ],
		    		    series :seriesdata 
		    		};
		       if (trendChart) {
		    	   trendChart.clear();
		    	   trendChart.setOption(trendChartOption); 
		       }
			
			}
		},
		getEfficiency : function(trendChart) {
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: "cloudMonitor/getEfficiency",
				   success: function(result){
					 // 处理数据
					   var seriesdata = [];
					   seriesdata.push({
						   type : 'line',
						   showAllSymbol : true,
						   smooth : true,
						   symbolSize:0,
						   itemStyle: {
							   normal: {
								   areaStyle: {
									   color : getBlueRgba(0.3),
									   type: 'default'
								   },
								   lineStyle: {
									   width: 0
								   }
							   }
						   },
						   data : (function(rates) {
							   var d = [];
							   for (var i=0;i<rates.length - 1;i++){
								   d.push([new Date(rates[i].time),
								           rates[i].rate.toFixed(2) - 0 ]);
							   }
							   return d;
						   })(result)
					   });// 放置一个linechart
				       var trendChartOption = {
						   		animation: false,
				    		    tooltip : {
				    		        trigger: 'item',
				    		        formatter : function (params) {
				    		            var date = new Date(params.value[0]);
				    		            data = date.getFullYear() + '-'
				    		                   + (date.getMonth() + 1) + '-'
				    		                   + date.getDate() + ' ';
				    		            return data + '<br/>'
				    		                   + params.value[1] + '%' ;
				    		        }
				    		    },
				    		    grid: {
				    		    	x: 45,
				    		    	x2: 30,
				    		    	y: 20,
				    		    	y2: 10,
				    		    	height:'80%'
				    		    },
				    		    xAxis : [
				    		             {
				    		            	 type : 'time',
				    		            	 splitNumber:10,
				    		            	 splitLine : {
				    		            		 lineStyle : {
				    		            			 color : [ '#ececec' ]
				    		            		 }
				    		            	 },
				    		            	 axisLine : {
				    		            		 lineStyle : {
				    		            			 color : '#ececec',
				    		            			 width : 1
				    		            		 }
				    		            	 },
				    		            	 axisLabel : {
				    		            		 formatter : function (params) {
				    		            			 var date = new Date(params);
				    		            			 data = (date.getMonth() + 1) + '-' + date.getDate();
				    		            			 return data;
				    		            		 }
				    		            	 }
				    		             }
				    		             ],
				    		    yAxis : [
				    		        {
				    		           type : 'value',
				    		           max : 100,
									   splitNumber:2,
									   splitLine : {
										   lineStyle : {
											   color : [ '#ececec' ]
										   }
									   },
									   axisLabel : {
										   formatter: '{value}'
									   },
									   axisLine : {
										   lineStyle : {
											   color : '#ececec',
											   width : 1
										   }
									   }
				    		        }
				    		    ],
				    		    series :seriesdata 
				    		};
					   if(result.length>0) {
						   if (trendChart) {
							   trendChart.clear();
							   trendChart.setOption(trendChartOption); 
						   }
					       var mark = result[result.length - 1].name;
					       var color = '#88CC67';
					       if (mark >= 0 && mark <= 20) {
					    	   color = '#88CC67';
					       } else if (mark > 20 && mark <= 80) {
					    	   color = '#FFAF48';
					       } else if (mark > 80) {
					    	   color = '#FF6161';
					       }
					       $('#efficiency').parent("div").find(".markStyle").html(mark);
					       $('#efficiency').parent("div").find(".markStyle").css('color', color);
					   }
				   }
			});
		},
		drawCpuTrend : function(vmCpuRateChart, vmId, vmName,targetId) { 
			if (typeof vmCpuRateChart == 'string') {
				vmCpuRateChart = echarts.init(document.getElementById(vmCpuRateChart));
			}
			$http({
				method : 'GET',
				url : 'domain/'+vmId+"/cpuTrend?interval=30"
			}).success(function(result) {
				 if (result != null && result.data.length == 0) {
					 getNoDataText(targetId);
				 } else {
				 var color1 = 'rgba(0,183,255,0.3)';
				 var color2 = '#00B7FF';
				 var names = [];
				 var seriesdata = [];
				   
				 names.push(vmName)
				 var ratesdata = result.data;
					  
				 seriesdata.push({
						name : vmName,
						type : 'line',
						showAllSymbol : true,
						smooth : true,
						itemStyle:{normal:{areaStyle:{type:'default',color:color1},lineStyle:{color:color2,width:1}}},
						symbolSize:0,
						data : (function(rates) {
							var d = [];
							for (var j=0;j<rates.length;j++){
								d.push([new Date(rates[j].time),
								        rates[j].rate.toFixed(2) - 0 ]);
							}
							return d;
						})(ratesdata)
					})//放置一个linechart
						
				 var vmTrendOption = {
				    		    tooltip : {
				    		        trigger: 'item',
				    		        formatter : function (params) {
				    		            var date = new Date(params.value[0]);
				    		            data = date.getFullYear() + '-'
				    		                   + (date.getMonth() + 1) + '-'
				    		                   + date.getDate() + ' '
				    		                   + date.getHours() + ':'
				    		                   + date.getMinutes();
				    		            return vmName+'<br/>'
				    		                   + data + '<br/>'
				    		                   + params.value[1] ;
				    		        }
				    		    },
				    		    //无数据时的显示效果
			                    noDataLoadingOption:{
			                        effect: function(params) {
			                        	var noDataText = $translate.instant('common.noData');;
			                            return noDataLoadingEffect(params, noDataText);
			                        }
			                    },
				    		    legend : {
				    		        data : names,
				    		        y:'bottom',
				    		        show:false
				    		    },
				    		    grid: {
				    		    	x: 50,
				    		    	x2:30,
				    		        y: '10%',
				    		        y2: '10%'
				    		    },
				    		    xAxis : [
				    		        {
				    		            type : 'time',
				    		            splitNumber:6,
				    		            axisLabel : {
				    		                formatter: function(value){
				    		                	var hour = value.getHours();
				    		                	var minute = value.getMinutes();
				    		                	if(minute < 10){
				    		                		minute = '0' + minute;
				    		                	}
				    		                	return hour + ":" + minute;
				    		                }
				    		            },
				    		            axisLine : {
				    		            	lineStyle : {
				    		            		width : 1
				    		            	}
				    		            }
				    		        }
				    		    ],
				    		    yAxis : [
				    		        {
				    		            type : 'value',
				    		            max : 100,
				    		            axisLabel : {
				    		                formatter: '{value}%'
				    		            },
				    		            axisLine : {
				    		            	lineStyle : {
				    		            		width : 1
				    		            	}
				    		            }
				    		        }
				    		    ],
				    		    series :seriesdata,
				    		    animation:false
				    		};
				 if (vmCpuRateChart) {
					 vmCpuRateChart.clear();
					 vmCpuRateChart.setOption(vmTrendOption); 
				 }
				 }
			});
		},
		drawMemTrend : function(vmMemRateChart, vmId, vmName) { 
			if (typeof vmMemRateChart == 'string') {
				vmMemRateChart = echarts.init(document.getElementById(vmMemRateChart));
			}
			$http({
				method : 'GET',
				url : 'domain/'+vmId+"/memTrend?interval=30"
			}).success(function(result) {
				var color1 = 'rgba(134,204,22,0.3)';
				var color2 = '#86CC16';
				var names = [];
				var seriesdata = [];
				names.push(vmName)
				var ratesdata = result.data;
				seriesdata.push({
					name : vmName,
					type : 'line',
					showAllSymbol : true,
					smooth : true,
					itemStyle:{normal:{areaStyle:{type:'default',color:color1},lineStyle:{color:color2,width:1}}},
					symbolSize:0,
					data : (function(rates) {
						var d = [];
						for (var j=0;j<rates.length;j++){
							d.push([new Date(rates[j].time),
							        rates[j].rate.toFixed(2) - 0 ]);
						}
						return d;
					})(ratesdata)
				})//放置一个linechart
				var vmTrendOption = {
					tooltip : {
						trigger: 'item',
						formatter : function (params) {
							var date = new Date(params.value[0]);
							data = date.getFullYear() + '-'
							+ (date.getMonth() + 1) + '-'
							+ date.getDate() + ' '
							+ date.getHours() + ':'
							+ date.getMinutes();
							return vmName+'<br/>'
							+ data + '<br/>'
							+ params.value[1] ;
						}
					},
					//无数据时的显示效果
                    noDataLoadingOption:{
                        effect: function(params) {
                        	var noDataText = $translate.instant('common.noData');;
                            return noDataLoadingEffect(params, noDataText);
                        }
                    },
					legend : {
						data : names,
						y:'bottom',
						show:false
					},
					grid: {
						x: 50,
						x2:30,
						y: '10%',
						y2: '10%'
					},
					xAxis : [
					         {
					        	 type : 'time',
					        	 splitNumber:6,
					        	 axisLabel : {
					        		 formatter: function(value){
					        			 var hour = value.getHours();
					        			 var minute = value.getMinutes();
					        			 if(minute < 10){
					        				 minute = '0' + minute;
					        			 }
					        			 return hour + ":" + minute;
					        		 }
					        	 },
					        	 axisLine : {
					        		 lineStyle : {
					        			 width : 1
					        		 }
					        	 }
					         }
					         ],
					         yAxis : [
					                  {
					                	  type : 'value',
					                	  max : 100,
					                	  axisLabel : {
					                		  formatter: '{value}%'
					                	  },
					                	  axisLine : {
					                		  lineStyle : {
					                			  width : 1
					                		  }
					                	  }
					                  }
					                  ],
					                  series :seriesdata,
					                  animation:false
				};
				if (vmMemRateChart) {
					vmMemRateChart.clear();
					vmMemRateChart.setOption(vmTrendOption); 
				}
				
			});
			
		},
		/*
		 * 获取折线趋势图
		 * @url 查询数据url
		 * @trendChart id或者echart instance
		 * noDataText：没有数据时显示的文字
		 * @isPercent Y轴数据是否为百分比
		 * @gridFlag 绘图xy周区域是否是暗色背景
		 * xAxisLabelFormatter X轴标点格式化方法
		 * yAxisLabelFormatter Y轴标点格式化方法
		 * dataFormatter 数据格式化方法
		 * tooltipFormatter 浮动框格式化方法
		 * maxLegend  底部标题最大个数
		 * subStringLength 底部标题需截断长度
		 */ 
		drawLineTrend : function(targetId, url, trendChart, noDataText, isPercent, gridFlag, xAxisLabelFormatter, yAxisLabelFormatter, 
				dataFormatter, tooltipFormatter, maxLegend, subStringLength) {
			if (typeof trendChart == 'string') {
				trendChart = echarts.init(document.getElementById(trendChart));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					if (angular.isArray(result.data)) {
						   result = result.data;
				    }
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {
					   // 处理数据
					   var names = [];
					   var seriesdata = [];
					   var yAxisData = [];
					   var xAxisData = [];
					   var rcColors = [getRedRgba(0.8), getYellowRgba(0.8), getPurpleRgba(0.8),
				                   getBlueRgba(0.8), getGreenRgba(0.8)];
					   var rcColorsOther = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1),
					                   getBlueRgba(1), getGreenRgba(1)];
						  
					   var unit = "%";
					   if (isEmpty(noDataText)) {
						    noDataText = '';
						}
					   
					   var textStyle = {
							fontSize: 11,
							color : '#333'
					   };
					   var lineShow = true;
					   var gridStyle =  {
							   x: 45,
							   x2: 40,
							   y: 20,
							   y2: 70,
					   };
					   
					   if (gridFlag) {
						   gridStyle = {
								   borderWidth : 0,
								   x : 40,
								   x2 : 40,
								   y : 20,
								   y2 : 50,
								   backgroundColor: 'rgba(166,199,226,0.05)'
						   };
						   textStyle = {
									fontSize: 11,
									color : '#7dabe2'
							   };
						   lineShow = false;
					   }
						   
					   var nodeNume = [];
					   for (var i=0;i<result.length;i++) {
						   nodeNume.push(result[i].rates.length);
					   }
					   var slipLine = Math.max.apply(Math, nodeNume);
					   for (var i=0;i<result.length;i++){
						   if (angular.isDefined(maxLegend)) {
							   if (i < maxLegend) {
						   names.push(result[i].name);
                               }
						   } else {
							   names.push(result[i].name);
						   }
						   var ratesdata = result[i].rates;
						   seriesdata.push({
								name : result[i].name,
								type : 'line',
								itemStyle: {
					                normal: {
						                	color : rcColors[i],
										areaStyle: {type: 'default'},
					                    lineStyle: {
					                        width: 1
					                    }
					                }
					            },
					            showAllSymbol : true,
								    symbol:symbols[i],
						            itemStyle: {
						                normal: {
						                	color : rcColors[i],
						                    lineStyle: {
						                        width: 1
						                    }
						                }
						             },
						             areaStyle: {
	                                   normal: {
	                                       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                                           offset: 0,
	                                           color: rcColors[i]
	                                       }, {
	                                           offset: 1,
	                                           color: rcColors[i]
	                                       }])
	                                   },
	                                },
	                                symbolSize:0,
								smooth : true,
								symbolSize:0,
								data : (function(rates) {
									if (angular.isFunction(dataFormatter)) {
										return dataFormatter.apply(this,[rates]);
									} else {
										return rates;
									}
								})(ratesdata)
							});
					   }
					   var xAxis = {
						    type : 'time',
						    splitNumber:slipLine,
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
							axisTick : {
								show : false
							},
							axisLabel : {
			    		        textStyle : textStyle
							}
					   };
					   if (angular.isFunction(xAxisLabelFormatter)) {
						   xAxis.axisLabel.formatter = xAxisLabelFormatter;
					   }
					   xAxisData.push(xAxis);
					   
					   if (isPercent) {
						   yAxisData.push({
					            type : 'value',
					            min : 0,
					            max : 100,
					            splitNumber:2,
					            axisTick : {
									show : false
								},
					            splitLine : {
					            	show:lineShow,
					            	lineStyle : {
					            		color : [ '#ececec' ]
					            	}
					            },
					            axisLine : {
									show:lineShow,
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
					            axisLabel : {
					                formatter: angular.isDefined(yAxisLabelFormatter) && 
					                	angular.isFunction(yAxisLabelFormatter) ? yAxisLabelFormatter : '{value}',
					                textStyle : textStyle
					            }
					        });
					   } else {
						   yAxisData.push({
							   	type : 'value',
					            splitNumber:2,
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
									show:lineShow,
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
					            axisLabel : {
					                formatter: angular.isDefined(yAxisLabelFormatter) && 
				                		angular.isFunction(yAxisLabelFormatter) ? yAxisLabelFormatter : '{value}',
					                textStyle : textStyle
					            }
					        });
					   }
				       trendChartOption = {
			    		    tooltip : {
									trigger : 'axis',
									axisPointer:{
				         	    		lineStyle:{
				         	    			color:'#e4eaec'
				         	    		}
				         	    	},
									formatter:function(params){
		                            	var result = "";
		                            	for (var j =0;j < params.length ;j++){
		                            		 var date = new Date(params[j].value[0]);
		                            		 date = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + date.getDate();
		                                     var name = params[j].seriesName;
		                                     if (result.indexOf(name) != -1) {
		                                    	 continue;
		                                     }
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
		                                     if (result.indexOf(date) == -1) {
		                                    	 result = date;
		                                     }
		                                     
		                                     result = result+ '<br/>' + nameStr + " : " +  + params[j].value[1] ;
		                                    
		                            	}
		                            	 return result;
		                            }
							},
			    		    legend : {
			    		        formatter: function(seriesName,ticket,callback) {
	                            	if (angular.isDefined(subStringLength)) {
	                            		if (seriesName.length > subStringLength) {
	                            			seriesName = seriesName.substring(0, subStringLength - 3) + "...";
	                                	}
			    		            return seriesName;
	                            	} else {
	                            		return seriesName;
	                            	}
			    		        },
				    		        //textStyle:{color:'auto'},
			    		        data : names,
			    		        y:'bottom'
			    		    },
			    		    //无数据时的显示效果
		                    noDataLoadingOption:{
		                        effect: function(params) {
		                            return noDataLoadingEffect(params, noDataText);
		                        }
		                    },
			    		    grid: gridStyle,
			    		    xAxis : xAxisData,
			    		    yAxis : yAxisData,
			    		    animation: true,
			    		    series :seriesdata
				       };
				       trendChart.clear();
				       trendChart.setOption(trendChartOption); 
					   
				   }
				}
			});
		},
		/* 
		 * 获取柱状趋势图
		 * url:请求路径  
		 * trendChart ： echart instance
		 * noDataText：没有数据时显示的文字
		 * @isPercent Y轴数据是否为百分比
		 * xAxisLabelFormatter X轴标点格式化方法
		 * yAxisLabelFormatter Y轴标点格式化方法
		 * dataFormatter 数据格式化方法
		 * tooltipFormatter 浮动框格式化方法
		*/
		drawColumnTrend : function(targetId,url, trendChart, noDataText, isPercent, xAxisLabelFormatter, dataFormatter, tooltipFormatter, seriesLabelFormatter, yAxisLabelFormatter) {
			if (typeof trendChart == 'string') {
				trendChart = echarts.init(document.getElementById(trendChart));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					if (result.data) {
						result = result.data;
					}
					if (isEmpty(noDataText)) {
					    noDataText = '';
					}
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {

					var yAxisData = [];
					var rcColors = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
					var names = [];
					// 生成显示数据
					var datas = [];
					var maxValue = 0;
					if (result.length != 0 && result[0].name == undefined && result[0].domainName != undefined) {
						for (var j=0;j<result.length;j++){
							names.push(result[j].domainName);
							if (angular.isFunction(dataFormatter)) {
								datas.push(dataFormatter.apply(this,[result[j].capacity]));
							} else {
								datas.push(result[j].capacity.toFixed(2));
							}
							if (result[j].capacity > maxValue) {
								maxValue = result[j].capacity.toFixed(2);
							}
						}
					} else if (result.length != 0 && result[0].name == undefined && result[0].orgName != undefined) {
						for (var j=0;j<result.length;j++){
							names.push(result[j].orgName);
							if (angular.isFunction(dataFormatter)) {
								datas.push(dataFormatter.apply(this,[result[j].capacity]));
							} else {
								datas.push(result[j].capacity.toFixed(2));
							}
							if (result[j].capacity > maxValue) {
								maxValue = result[j].capacity.toFixed(2);
							}
						}
					} else {
						for (var j=0;j<result.length;j++){
							names.push(result[j].name);
							if (angular.isFunction(dataFormatter)) {
								datas.push(dataFormatter.apply(this,[result[j].rate]));
							} else {
								datas.push(result[j].rate);
							}
							if (result[j].rate > maxValue) {
								maxValue = result[j].rate;
							}
						}
					}
					
					var gridStyle =  {
	    		    	borderWidth : 0,
						x : 47,
						x2 : 20,
						y : 24,
						y2 : 50
					};
					
					if (maxValue > 50000) {
						gridStyle.x = 67;
					}
					
					if (isPercent) {
						   yAxisData.push({
					            type : 'value',
					            min : 0,
					            max : 100,
					            splitNumber:2,
					            splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisLabel : {
					                formatter: angular.isDefined(yAxisLabelFormatter) && 
					                		angular.isFunction(yAxisLabelFormatter) ? yAxisLabelFormatter : '{value}',
					                				textStyle:{
					                					fontSize:11,
					                					fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
					                					color:'#333'
					            }
						            }
					        });
					   } else {
						   yAxisData.push({
							   	type : 'value',
					            splitNumber:2,
					            splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisLabel : {
					                formatter: angular.isDefined(yAxisLabelFormatter) && 
					                		angular.isFunction(yAxisLabelFormatter) ? yAxisLabelFormatter : '{value}',
					                				textStyle:{
					                					fontSize:11,
					                					fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
					                					color:'#333'
					            }
						            }
					        });
					   }
					
					var trendChartOption = {
							tooltip : {
								trigger : 'axis',
								axisPointer:{
									type:'none'
								},
								formatter:function(param){
									if (angular.isFunction(tooltipFormatter)) {
										return tooltipFormatter.apply(this,[param[0]]);
									} else {
										return param[0].value;
									}
								}
							},
							grid: gridStyle,
							xAxis : [ {
								type : 'category',
								data : names,
								axisLabel : {
									textStyle: {
											fontSize:11,
										fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
			                			    color:'#333'
									},
									interval : 0,rotate:25,
									formatter: function (seriesName,ticket,callback) {
										if (angular.isFunction(xAxisLabelFormatter)) {
											return xAxisLabelFormatter.apply(this,[seriesName]);
										} else {
											var length = 0;
											for (var i=0; i<seriesName.length; i++) {
												if (seriesName.charCodeAt(i) > 255) {
													length +=2;
												} else {
													length ++;
												}
												if (length > 8) {
													seriesName = seriesName.substring(0, i) + "...";
													break;
												}
											}
											return seriesName;
										}
									}
								},
								splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisTick : {
									show : false
								}
								
							} ],
							yAxis : yAxisData,
							//无数据时的显示效果
		                    noDataLoadingOption:{
		                        effect: function(params) {
		                            return noDataLoadingEffect(params, noDataText);
		                        }
		                    },
							animation: false,
							series : [ {
								type : 'bar',
								barWidth: 50,
								itemStyle : {
									normal : {
										color : function(params) {
											// build a color map as your
											// need.
											var colorList = rcColors;
											return colorList[params.dataIndex];
										},
										label : {
											show : true,
											position : 'inside',
											formatter : function(param){
												if (angular.isFunction(seriesLabelFormatter)) {
													return seriesLabelFormatter.apply(this,[param]);
												} else {
													return param.value;
												}
											}
										}
									}
								},
								data : datas
							} ]
					};
					// 为echarts对象加载数据
					trendChart.clear();
					trendChart.setOption(trendChartOption); 
					
				}
				}
			});
		},
		/* 
		 * 获取搭配时间轴饼图趋势图
		 * url:请求路径  
		 * trendChart ： echart instance
		 * noDataText：没有数据时显示的文字
		 * @isPercent Y轴数据是否为百分比
		 * axisLabelFormatter X轴标点格式化方法
		 * dataFormatter 数据格式化方法
		 * tooltipFormatter 浮动框格式化方法
		*/
		
		drawTimePieTrend : function(url, trendChart, noDataText, autoPlay, timeLabelFormatter, dataFormatter, tooltipFormatter, color, targetId) {
			if (typeof trendChart == 'string') {
				trendChart = echarts.init(document.getElementById(trendChart));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					if (result != null && result.success == false) {
						return ;
					}
					if (result.data) {
						result = result.data;
					}
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {
					if (isEmpty(noDataText)) {
					    noDataText = '';
					}
						if (result != null && result.length == 0) {
							getNoDataText(targetId, $translate);
						} else {

					var options = [];
					var names = [];
					
					var tooltip = {
		                trigger: 'item'
		            };
					
					var gridStyle =  {
		    		    borderWidth : 0,
						x : 47,
						x2 : 20,
						y : 24,
						y2 : 50
					};
					
					if (angular.isFunction(tooltipFormatter)) {
						tooltip.formatter = function (value) {
							return tooltipFormatter.apply(this,[value]);
						}
								tooltip.backgroundColor = '#436BB3';
								tooltip.borderColor = '#436BB3';
					} else if (angular.isString(tooltipFormatter)) {
						tooltip.formatter = tooltipFormatter;
								tooltip.backgroundColor = '#436BB3';
								tooltip.borderColor = '#436BB3';
					}
					
					// 生成显示数据
					for (var j=0;j<result.length;j++){
						names.push(result[j].name);
						var ratesdata = result[j].rates;
						options.push({ 
							tooltip : tooltip,
							color : color,
							series : [{
								type:'pie',
			                    center: ['50%', '45%'],
			                    radius: '50%',
			                    data:(function(rates) {
									if (angular.isFunction(dataFormatter)) {
										return dataFormatter.apply(this,[rates]);
									} else {
										return rates;
									}
								})(ratesdata)
							}]
						});
					}
					
					var timeline = {
				        data : names,
						        show : true,
						        bottom:"10%",
							    axisType: 'category',
							    // autoPlay: true,
							    playInterval: 2000,
						        tooltip:{
						        	show:true,
						        	formatter : function(value) {
						        		var name = value.name;
						        		if (angular.isFunction(timeLabelFormatter)) {
											return timeLabelFormatter.apply(this,[name]);
										} else {
											return name;
										}
						            },
						        },
						        lineStyle :{
						        	type:'dashed',
						        	width:'1',
						        },
						        checkpointStyle :{
						        	color:getBlueRgba(1),
						        	borderWidth:'0',
						        	emphasis:{
						        		color:getBlueRgba(1),
						        	}
						        },
						        controlStyle:{
						        	//itemSize:20,
						        	normal:{
						        		color:getBlueRgba(1),
						        	},
						        	emphasis:{
						        		color:"#333",
						        	}
						        	//itemGap:0,
						        	
						        },
						        itemStyle:{
						        	normal:{
						        		color:'#304654',
						        	},
						        	emphasis:{
						        		color:'#fff',
						        	}
						        },
				        label : {
						        	normal:{
						        		/*show :true,
						        		interval:'2',
						        		fontSize:'5',*/
				            formatter : function(value) {
							            	var date = new Date(value);
							            	value = date.getFullYear() +'-' + (date.getMonth()+1) +'-'+date.getDate();
				            	if (angular.isFunction(timeLabelFormatter)) {
									return timeLabelFormatter.apply(this,[value]);
								} else {
									return value;
								}
							            },
							           /* tooltip:{
							            	show:true,
							            	trigger: 'item'
							            }*/
						        	},
						        	
						        	emphsis:{
						        		textStyle:{
						        			color:getBlueRgba(1),
				            }
						        	}
				        },
				        autoPlay:autoPlay
				    }
					
					var trendChartOption = {
	                    timeline : timeline,
	                    options : options,
	                    grid: gridStyle,
	                    //无数据时的显示效果
	                    noDataLoadingOption:{
	                        effect: function(params) {
	                            return noDataLoadingEffect(params, noDataText);
	                        }
	                    }
					};
					// 为echarts对象加载数据
					trendChart.clear();
					trendChart.setOption(trendChartOption); 
						
				}
					
					}
				}
			});
		},			
		init : function(id) {
			var dom = null;
			if (typeof id == "string") {
			    dom = document.getElementById(id);
			} else if (angular.isObject(id)) {
				dom = id;
			} 
			if (window.echarts) {
				return echarts.init(dom);
			} else {
				return window.parent.echarts.init(dom);
			}
		},
		getHealthInfo : function  (overview, chartid, span, params){
			$.ajax({
				type: "GET",
				dataType:"json",
				url: "dashboard/healthInfo",
				data: params,
				success: function(result){
					var healthValue = result[result.length - 1].cvmHealth;
					var color = "#8dc629";
					$("." + span).html(Math.round(healthValue));
					var batter = "backbattery";
					if (overview) {
						batter = "overview-backbattery";
					}
					var styleClass = "trendChart " +  batter;
					if (healthValue > 0 && healthValue <= 10) {
						styleClass =  "trendChart " +  batter + "1"; 
						color = '#f73737'
					} else if (healthValue > 10 && healthValue <= 20) {
						styleClass =  "trendChart " +  batter + "2"; 
						color = '#f73737'
					} else if (healthValue > 20 && healthValue <= 30) {
						styleClass =  "trendChart " +  batter + "3";
						color = '#d98629'
					} else if (healthValue > 30 && healthValue <= 40) {
						styleClass =  "trendChart " +  batter + "4";
						color = '#d98629'
					} else if (healthValue > 40 && healthValue <= 50) {
						styleClass =  "trendChart " +  batter + "5";
						color = '#d98629'
					} else if (healthValue > 50 && healthValue <= 60) {
						styleClass =  "trendChart " +  batter + "6";
						color = '#d98629'
					} else if (healthValue > 60 && healthValue <= 70) {
						styleClass =  "trendChart " +  batter + "7";
						color = '#d98629'
					} else if (healthValue > 70 && healthValue <= 80) {
						styleClass =  "trendChart " +  batter + "8";
						color = '#d98629'
					} else if (healthValue > 80 && healthValue <= 90) {
						styleClass =  "trendChart " +  batter + "9";
					} else if (healthValue > 90 && healthValue <= 100) {
						styleClass =  "trendChart " +  batter + "10";
					}
					$("#" + chartid).attr("class", styleClass);
					$("." + span).css("color", color);
				}
			});
		},
		getResourceCount : function (url, params, key) {
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: url,
				   data: params,
				   success: function(result){
					   $("#cpuRateOrg" + key).html(Math.round(result.cpuRateValue));
					   $("#orgCpu" + key).html(result.maxCpu);
					   $("#orgCpuCur" + key).html(result.cpuCount);
					   $("#cpuUtilRate" + key).html(result.cpuRate);
					   
					   $("#memRateOrg" + key).html(Math.round(result.memRateValue));
					   $("#orgMem" + key).html(result.maxMem);
					   $("#orgMemCur" + key).html(result.memCount);
					   $("#memUtilRate" + key).html(result.memRate);
					   
					   $("#storeRateOrg" + key).html(Math.round(result.storageRateValue));
		 			   $("#orgStorage" + key).html($filter('byteUnitRender4')(result.maxStorage));
		 			   $("#orgStorageCur" + key).html(result.storageCount);
		 			   $("#storageUtilRate" + key).html(result.storageRate);
		 			   
		 			   $("#vmRateOrg" + key).html(Math.round(result.vmRateValue));
		 			   $("#orgVmCount" + key).html(result.maxVm); 
		 			   $("#orgVmCur" + key).html(result.vmCount);
		 			   $("#vmUtilRate" + key).html(result.vmRate);
				   }
			});
		},
		getPoolResourceCount : function (url, params, key) {
			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: url,
				   data: params,
				   success: function(result){
					   if (!isEmpty(result.cpuRate) && !isEmpty(result.cpuCount) && !isEmpty(result.vmCpuCount)) {
						   $("#cpuRate" + key).html(Math.round(result.cpuRate));
						   $("#hostCPUCount" + key).html(result.cpuCount);
						   $("#vmCPUCount" + key).html(result.vmCpuCount);
						   $("#cpuUtilRate" + key).html(result.cpuRate + "%");
					   }
					  
					   if (!isEmpty(result.memRate) && !isEmpty(result.memCount) && !isEmpty(result.vmMemCount)) {
						   $("#memRate" + key).html(Math.round(result.memRate));
						   $("#hostMemoryCount" + key).html(result.memCount);
						   $("#vmMemoryCount" + key).html(result.vmMemCount);
						   $("#memUtilRate" + key).html(result.memRate + "%");
					   }
					   
					   if (!isEmpty(result.storageRate) && !isEmpty(result.totalStorage) && !isEmpty(result.usedStorage)) {
						   $("#storeRate" + key).html(Math.round(result.storageRate));
			 			   $("#totalStorage" + key).html(result.totalStorage);
			 			   $("#usedStorage" + key).html(result.usedStorage);
			 			   $("#storageRate" + key).html(result.storageRate + "%");
					   }
				   }
			});
		},
        dashboardUserStatus :function(url, userCircle, params, key) {
        	if (typeof userCircle == 'string') {
        		userCircle = echarts.init(document.getElementById(userCircle)); 
			}
        	$.ajax({
        		type: "GET",
        		dataType:"json",
        		url: url,
        		data: params,
        		success: function(result){
        			var size = 60;
					if (result.userCount > 1000) {
						size = 40;
					} else if (result.userCount > 10000){
						size = 20;
					}
        			var labelBottom = {
     					   normal : {
     						   color : '#436bb3',
     						   label : {
     							   show : false
     						   },
     						   labelLine : {
     							   show : false
     						   }
     					   }
     			   },
     			   textNum = {
     					   color:'#436bb3',
     					   fontFamily : '微软雅黑,Arial',
     					   fontSize : 14,
     					   fontWeight : 'normal'
     			   },
     			   textTitle = {
     					   color:'#436bb3',
     					   fontFamily : '微软雅黑,Arial',
     					   fontSize : 14
     			   }
     			   userOption = {
        					title : {
    							text : result.userCount,
    							sublink : '',
    							x : 'center',
    							y : 'center',
    							padding:0,
    							itemGao:0,
    							textStyle : {
    								color : '#83d0ff',
    								fontFamily : 'Arial',
    								fontSize : size,
    								fontWeight:'lighter'
    							}
    						},
     					   tooltip : {
     						   trigger : 'item',
     						   formatter : "{a} <br/>{b} : {c} ({d}%)"
     					   },
     					   series : [ {
     						   name :  $translate.instant('dashboard.userNum'),
     						   type : 'pie',
     						   radius : [ '70%', '90%' ],
     						   itemStyle : {
     							   normal : {
     								   color : function(params) {
     									   var colorList = [getGreenRgba(1), getYellowRgba(1)];
     									   return colorList[params.dataIndex];
     								   },
     								   label : {
     									   show : false
     								   },
     								   labelLine : {
     									   show : false
     								   }
     							   }
     						   },
     						   data : [ {
     							   value : result.useryes,
     							   name : $translate.instant('dashboard.useryes')
     						   }, {
     							   value : result.userno,
     							   name : $translate.instant('dashboard.userno')
     						   }]
     					   } ]
        			};
        			/*userOption.series[0].data = userOption.series[0].data.filter(function(a){
        				return a.value > 0;
        			});*/
        			if (userCircle) {
        				userCircle.clear();
        				userCircle.setOption(userOption);
        			}
        			$("#userInfo" + key +" #numItem-useryes label").html(result.useryes);
        			$("#userInfo" + key +" #numItem-userno label").html(result.userno);
        		}
        	});
		},
		getChartOption : function(title, reportData, type, myChart, cycle) {
			var targetId = myChart._dom.id;
			if ((reportData == null || angular.equals({}, reportData))||(reportData != null && reportData.length == 0)){
	    		getNoDataText(targetId, $translate);
	    		return null;
	    	} else {
	    		var color = ['#1e90ff','#22bb22','#4b0082','#d2691e'];
	    	var symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','emptycircle', 'emptyrect', 'emptyroundRect', 'emptytriangle', 'emptydiamond', 'emptypin', 'emptyarrow','emptyrect', 'emptyroundRect', 'emptytriangle', 'emptydiamond', 'emptypin', 'emptyarrow']
	    	var legend = [];
	    	var xAxisData = [];
	    	var series = [];
	    	var legendLength = 0;
	    	if (reportData instanceof Array) {
	    		if (reportData.length > 0) {    			
	    			for (var i = 0; i < reportData.length; i++) {
	    				legend[i] = reportData[i].title;
	    				if (reportData[i].title.length > 17) {
	    					//若长度超过17，则会将字符串截断至17位
	    					var showLegend = legend[i].substring(0, 14) + "...";
	    					legendLength += showLegend.getWidth(12);
	                	} else {
	                		legendLength += legend[i].getWidth(12);
	                	}
	    				legendLength += 30; //10:itemGap + 20:itemWidth
	    				var data = [];
	    				if (reportData[i].list) {    				
		    					for (var j = 0; j < reportData[i].list.length; j++) {
		    						if (cycle == 2) {
		    							var weekDay = reportData[i].list[j].name.split(" ");
		    							var now = getDateNumber(weekDay[0], parseInt(weekDay[1]));
		    							reportData[i].list[j].name = [now.getFullYear(), now.getMonth()+ 1, now.getDate()].join('/');
	    					}
		    						data.push([reportData[i].list[j].name,
		    						        reportData[i].list[j].rate]);
		    						//data[j] = reportData[i].list[j].rate;
	    				}
		    				}
	    				var serie = {
	    						name:reportData[i].title,
	    						type:"line",
	    						symbol:symbols[i],
	    						showAllSymbol : true,
	                            smooth : true,
					            itemStyle: {
					                normal: {
					                	color : lineColor[i],
					                    lineStyle: {
						                        width: 1.5
					                    }
					                }
					             },
								smooth : true,
								symbolSize:0,
	    						data:data
	    				};
                            if (angular.isArray(serie.data) && serie.data.length < 2) {
                                serie.symbolSize = 8; // 如果数据条数小于2,那么让标的点可见
                            }
	    				if ("line" != type) {
		    					serie.type = "line";
	    					serie.smooth = true;
	    					serie.areaStyle = {
	                            normal: {
	                            	 color: areaColor[i]
		                            }};
	    				}
	    				series[i] = serie;
	    			}
	    		} else {
	    			series[0] = {data: []};
	    		}
	    	} else {
	    		series[0] = {data: []};
	    	}
	    	var ybottom = 50;
	    	var domId = document.getElementById(myChart._dom.id);
	        var lineLength = $(domId).width() - 100;
	    	ybottom += Math.floor(legendLength / lineLength) * 35;
                var itemCount = getMinItemCount(series); // 后台返回的各系列数据的数据条数最小值.
                var xIndex = 0; // 记录xLabel的fommater当前是第几次调用,用于过滤重复标识
	    	option = {
	    		    title : { text: title ,textStyle:{'fontWeight':'normal','fontSize':14,'color':'#1c3e6d'}},
	    		    tooltip : { trigger: 'axis',
	    		    	axisPointer:{
	         	    		lineStyle:{
	         	    			color:'#e4eaec'
	         	    		}
	         	    	},
	    		    	formatter:function(params){
                        	var result = "";
                        	for (var j =0;j < params.length ;j++){
                            		 var date = params[j].value[0];
                            		 if (cycle == 2) {
                            			 date = new Date(date);
                            			 date = date.getFullYear() + " " + getWeekNumber(date);
                            		 }
                                 var name = params[j].seriesName;
                                 if (result.indexOf(name) != -1) {
                                	 continue;
                                 }
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
                                 if (result.indexOf(date) == -1) {
                                	 result = date;
                                 }
                                 
                                     result = result+ '<br/>' + nameStr + " : " +  + params[j].value[1] ;
                                
                        	}
                        	 return result;
                        }
	    		    	},
	    		    legend:{
	    		    	y:'bottom',
	    		    	data:legend,
	    		    	formatter: function(value) {
	                		if (value.length > 17) {
	                    		value = value.substring(0, 14) + "...";
	                    	}
	                    	return value;
	                    }
	    		    },
	    		    toolbox: {
	    		            mark : {show: false}, dataView : {show: false, readOnly: false},
		    		           /* magicType : {show: true, type: ['line', 'bar'],
	    		            	title : {
		    		                line : $translate.instant('reportLineChange'),
		    		                bar : $translate.instant('reportBarChange')
		    		            	},
		    		            	option :{
		    		            		line :{
		    		            			iconStyle:{
				    		            		normal : {
				    		            			borderColor:color[0],
				    		            		},
				    		            		emphasis: {
				    		            			borderColor:color[0],
	    		            	}
	    		            },
		    		            		},
		    		            		bar:{
		    		            			iconStyle:{
				    		            		normal : {
				    		            			borderColor:color[1],
				    		            		},
				    		            		emphasis: {
				    		            			borderColor:color[1],
				    		            		}
				    		            	}
		    		            		}
		    		            	}
		    		            },
		    		            restore : {show: true,title : $translate.instant('common.revert'), 
		    		            	iconStyle:{
		    		            		normal : {
		    		            			borderColor:color[2],
		    		            		},
		    		            		emphasis: {
		    		            			borderColor:color[2],
		    		            		}
		    		            	}},*/
	    		            saveAsImage : {show: true,
	    		            	title : $translate.instant('reportSaveImage'),
	    		            	type : 'png',
			   		        	   	lang : [$translate.instant('reportClickSaveImage')],
			   		        	   	iconStyle:{
		    		            		normal : {
		    		            			borderColor:color[3],
		    		            		},
		    		            		emphasis: {
		    		            			borderColor:color[3],
	    		        }
		    		            	}},
		    		            	right : '20',
	    		    },
	    		    grid:{
		    		    	y2:ybottom,
		    		    	left:'50px'
	    		    },
	    		    calculable : true,
	    		    xAxis : [{ 
	    		    	axisTick : {
							show : false
						},
         	            splitLine :{lineStyle:{color: ['#e4eaec']}},
         	            axisLine :{lineStyle :{color: '#e4eaec',width: 1}},
         	            axisLabel : {
         	            	rotate: 0,
	         	            	formatter : function (params) {
	         	            		var date = new Date(params);
	         	            		var year = date.getFullYear();
	         	            		var month = date.getMonth() + 1;
	         	            		var day = date.getDate();
		                            var hour = date.getHours();
		                            var minute = date.getMinutes();
                                    var result;
		                            if(minute < 10){
		                                minute = '0' + minute;
		                            }
		                            if(month < 10){
		                            	month = '0' + month;
		                            }
	         	            		++xIndex;
                                    switch (cycle) {
                                        case 0: result = year + "-" + month + "-" + day  + " "+  hour; break; //小时
                                        case 1: result = year + "-" + month + "-" + day; break; // 天
                                        case 2: // 周
                                            // 当数据大于1条时,x轴最后两个标识会重复.所以当数据大于1条时隐藏第1个显示的.
                                            result = (itemCount >= 2 && xIndex === itemCount) ? null : year + " " + getWeekNumber(date);
                                            break;
                                        case 3: // 月
                                            // 当数据大于1条时,x轴前两个标识会重复.所以当数据为2条时隐藏第2个显示的
                                            // 当数据条数大于2条时,隐藏第1个显示的.
                                            result = ((itemCount === 2 && xIndex === 2) || (itemCount > 2 && xIndex === 1)) ? null : year + "-" + month;
                                            break;
                                        case 4: // 年
                                            // 当数据大于1条时,x轴前两个标识会重复.所以当数据大于1条时隐藏第2个显示的
                                            result = (itemCount >= 2 && xIndex === 2) ? null : year;
                                            break;
                                        default: result = ""; break;
	         	            		}
                                    return result;
			    		        },
							textStyle: {
								fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
								color : '#333'
							},
         	            },
	         	            type : 'time'}],
	    		    yAxis : [{type : 'value',max : reportData.max,
	    		    	axisTick : {
							show : false
						},
         	            splitLine :{lineStyle:{color: ['#e4eaec']}},
         	            axisLine :{lineStyle :{color: '#e4eaec',width: 1}},
	     	            axisLabel : {
							formatter : this.yFormat,
							textStyle: {
								fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
								color : '#333'
							},
	     	            }}],
	    		    series :series
	    		};
                if (itemCount > 0 && itemCount < 5) { // 当数据条数在1到4之间时设置splitNumber参数
                    option.xAxis[0].splitNumber = (itemCount > 1) ? itemCount - 1 : itemCount;
                }
	    	return option;
			}
            // 找到series中最小的数据条数(一般各系列数据条数是相等的)
            function getMinItemCount(series) {
                if (series.length < 1) {
                    return 0;
                }
                var minLen = (angular.isArray(series[0].data)) ? series[0].data.length : 1;
                for (var i = 0; i < series.length; i++) {
                    if (angular.isArray(series[i].data)) {
                        minLen = (series[i].data.length < minLen) ? series[i].data.length : minLen;
                    }
                }
                return minLen;
            }
	    },
		//风险评估
		dashboard_drawRisk : function  (url, countPic, params, key) {
			if (typeof countPic == 'string') {
				countPic = echarts.init(document.getElementById(countPic));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				data: params,
				success: function(result){
					result = result[0];
					var rcColors_other = [getRedRgba(0.50), getYellowRgba(0.50), getPurpleRgba(0.50)];
					var dataStyle = {
						normal: {
							color : function(params) {
								var colorList = [ getRedRgba(), getYellowRgba(), getPurpleRgba() ];
								return colorList[params.dataIndex];
							},
							label: {show:false},
							labelLine: {show:false}
						}
					};
					
					var placeHolderStyle = {
						normal : {
							color : function(params) {
								return rcColors_other[params.seriesIndex];
							},
							label: {show:false},
							labelLine: {show:false}
						},
						emphasis : {
							color: 'rgba(0,0,0,0)'
						}
					};
					
					var textNum = {
					    color:'#333',
					    fontFamily : 'Arial',
					    fontSize : 40,
					    fontWeight : 'lighter'
					};
					var textTitle = {
						color:'#333',
						fontFamily : '"Microsoft Yahei","微软雅黑",Arial',
						fontSize : 12
					};
					
					option = {
						animation: false,
						title: {
							   text: result.level,
							   x: 'center',
							   y: 'center',
							   textStyle : textNum,
							   subtextStyle :textTitle
						},
					    tooltip : {
					        show: true,
					        formatter: "{b}"
					    },
					    series : [
					        {
					            type:'pie',
					            clockWise:false,
					            center: ['50%', '50%'],
					            radius : ['70%', '85%'],
					            itemStyle : {
									   normal : {
										   color : getRedRgba(),
										   label : {
											   show : false
										   },
										   labelLine : {
											   show : false
										   }
									   }
								   },
					            data:[
					                {
					                    value:result.cpuUtilizationValue,
					                    name:result.cpuUse + '%'
					                },
					                {
					                    value:100 - result.cpuUtilizationValue,
					                    name:result.cpuFree + '%',
					                    itemStyle : placeHolderStyle
					                }
					            ]
					        },
					        {
					            type:'pie',
					            clockWise:false,
					            center: ['50%', '50%'],
					            radius : ['55%', '70%'],
					            itemStyle : {
									   normal : {
										   color : getYellowRgba(),
										   label : {
											   show : false
										   },
										   labelLine : {
											   show : false
										   }
									   }
								   },
					            data:[
					                {
					                    value:result.memUtilizationValue, 
					                    name:result.memoryUse + '%'
					                },
					                {
					                    value:100 - result.memUtilizationValue,
					                    name:result.memoryFree + '%',
					                    itemStyle : placeHolderStyle
					                }
					            ]
					        },
					        {
					            type:'pie',
					            clockWise:false,
					            center: ['50%', '50%'],
					            radius : ['40%', '55%'],
					            itemStyle : {
									   normal : {
										   color :getPurpleRgba(),
										   label : {
											   show : false
										   },
										   labelLine : {
											   show : false
										   }
									   }
								   },
					            data:[
					                {
					                    value:result.storageUtilizationValue, 
					                    name:result.storageUse + '%'
					                },
					                {
					                    value:100 - result.storageUtilizationValue,
					                    name:result.storageFree + '%',
					                    itemStyle : placeHolderStyle
					                }
					            ]
					        }
					    ]
					};
					
					if (result.avgDay > 80 && result.avgDay <= 100) {
						textNum.color = getGreenRgba(1);
					} else if (result.avgDay > 20 && result.avgDay <= 80) {
						textNum.color = getYellowRgba(1);
					} else if (result.avgDay >= 0 && result.avgDay <= 20) {
						textNum.color = getRedRgba(1);
					}
					
					if (countPic) {
						countPic.clear();
						countPic.setOption(option); 
					}
					
				    $('#cpuDays' + key).html((result.cpuHaveApex ? '' : $translate.instant('board.greaterThan')) + result.cpuSurplusDay);
				    $('#memDays' + key).html((result.memHaveApex ? '' : $translate.instant('board.greaterThan')) +result.memSurplusDay);
				    $('#storageDays' + key).html((result.storageHaveApex  ? '' : $translate.instant('board.greaterThan')) +result.storageSurplusDay);
				}
			});
	   },
	   pieChart : function (url, trend) {
		   $http({
               method : 'GET',
               url : url,
               params: {}
           }).success(function(result) {
               if (result) {
                   if (!result || !angular.isArray(result)) {
                       return;
                   }
                   var noDataText = $translate.instant('common.noData');
                   var rcColors = [getRedRgba(1), '#558ECB', getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
                   
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
                           tooltip:{
                        	   trigger:'item',
                        	   formatter:"{d}%"},
                           legend:{orient:'vertical', x:'left',data:legendData,selectedMode:false},
                           grid:{borderWidth : 0, x : 47, x2 : 20, y : 26, y2 : 50 },
                           series:[{name:'',type:'pie',radius:'70%',center:['50%', '50%'], data:seriesData}],
                           //无数据时的显示效果
                           noDataLoadingOption:{
                               effect: function(params) {
                                   return noDataLoadingEffect(params, noDataText);
                               }
                           }
                   };
                   if (trend) {
                	   trend.clear();
                	   trend.setOption(trendOption); 
                   }
               
               }                
           });
	   },
	   orgHistoryChart:function(url, readName, writeName, memoryTop5, flag){
		   var name = "I/O吞吐量";
		   if (!flag) {
			   name="磁盘请求";
		   }
		   $http({
               method : 'GET',
               url : url,
               params: {}
           }).success(function(result) {
        		   var rsdata = result.read;
        		   if (!flag) {
        			   rsdata = result.write;
        		   }
        		   var timeArray = [];
        		   var dataSeries = [];
        		   for (var i=0; i<rsdata.length; i++) {
        			   timeArray[i] = rsdata[i].name;
        		   }
        		   if (rsdata.length > 0) {
        			   dataSeries.push({
        				   color:getYellowRgba(1),
        				   name:name,
        				   type:'line',
        				   stack: '总量',
        				   itemStyle: {normal: {areaStyle:{type:'default'}}},
        				   data:(function(rates) {
        					   var d = [];
        					   for (var j=0;j<rates.length;j++){
        						   d.push(rates[j].rate);
        					   }
        					   return d;
        				   })(rsdata)
        			   });
        		   }
        		   
       				
       			 var option = {
       					    tooltip : {
       					        trigger: 'axis',
       					        formatter: '{a}:{c}%',
       					    },
       					    grid: {
       		    		    	x: 50,
       		    		    	x2:30,
       		    		        y: '12%',
       		    		        y2: '18%'
       		    		    },
       					    xAxis : [
       					        {
       					            type : 'category',
       					            boundaryGap : false,
       					            data : timeArray
       					        }
       					    ],
       					    yAxis : [
       					        {
       					            type : 'value',
       					            max : 10
       					        }
       					    ],
       					    series : dataSeries,
       					     noDataLoadingOption:{
 		                        effect: function(params) {
 		                            return noDataLoadingEffect(params, noDataText);
 		                        }
 		                    }
       					};
       				if (memoryTop5) {
       					memoryTop5.clear();
       					memoryTop5.setOption(option); 
       				}
           })
		},
		drawCpuOrMemColumnTrend : function(targetId, url, trendChart, noDataText, isCpu, tooltipFormatter) {
			if (typeof trendChart == 'string') {
				trendChart = echarts.init(document.getElementById(trendChart));
			}
			$.ajax({
				type: "GET",
				dataType:"json",
				url: url,
				success: function(result){
					if (result.data) {
						result = result.data;
					}
					if (isEmpty(noDataText)) {
					    noDataText = '';
					}
					if (result != null && result.length == 0) {
						getNoDataText(targetId, $translate);
					} else {
					var yAxisData = [];
					var rcColors = [getRedRgba(1), getYellowRgba(1), getPurpleRgba(1), getBlueRgba(1), getGreenRgba(1)];
					var names = [];
					// 生成显示数据
					var datas = [];
					var maxValue = 0;
					if (isCpu) {
						for (var j=0;j<result.length;j++){
							names.push(result[j].domainName);
							datas.push(result[j].cpu);
							if (result[j].rate > maxValue) {
								maxValue = result[j].rate;
							}
						}
					} else {
						for (var j=0;j<result.length;j++){
							names.push(result[j].domainName);
							datas.push(result[j].memory);
							if (result[j].rate > maxValue) {
								maxValue = result[j].rate;
							}
						}
					}
					
					var gridStyle =  {
	    		    	borderWidth : 0,
						x : 47,
						x2 : 20,
						y : 24,
						y2 : 50
					};
					
					if (maxValue > 50000) {
						gridStyle.x = 67;
					}

				   yAxisData.push({
					   	type : 'value',
			            splitNumber:2,
			            splitLine : {
							lineStyle : {
								color : [ '#ececec' ]
							}
						},
						axisLine : {
							lineStyle : {
								color : '#ececec',
								width : 1
							}
							},
							textStyle: {
								fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
								color : '#333'
							},
							axisLabel : {				                
			                	textStyle:{
			                			fontSize:11,
			                			fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
			                			color:'#333'
			                	}			
				            }
			        });
					
					var trendChartOption = {
							tooltip : {
								trigger : 'axis',
								axisPointer:{
									type:"none",
								},
								formatter:function(param){
									if (angular.isFunction(tooltipFormatter)) {
										return tooltipFormatter.apply(this,[param[0]]);
									} else {
										return param[0].value;
									}
								}
							},
							grid: gridStyle,
							xAxis : [ {
								type : 'category',
								data : names,
								axisLabel : {
									textStyle: {
											fontSize:11,
										fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
											color:'#333'
									},
									interval : 0,rotate:25,
									formatter: function (seriesName,ticket,callback) {
											var length = 0;
											for (var i=0; i<seriesName.length; i++) {
												if (seriesName.charCodeAt(i) > 255) {
													length +=2;
												} else {
													length ++;
												}
												if (length > 8) {
													seriesName = seriesName.substring(0, i) + "...";
													break;
												}
											}
											return seriesName;
									}
								},
								splitLine : {
									lineStyle : {
										color : [ '#ececec' ]
									}
								},
								axisLine : {
									lineStyle : {
										color : '#ececec',
										width : 1
									}
								},
								axisTick : {
									show : false
									},
									textStyle: {
										fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
										color : '#333'
									},
								
							} ],
							yAxis : yAxisData,
							//无数据时的显示效果
		                    noDataLoadingOption:{
		                        effect: function(params) {
		                        	return noDataLoadingEffect(params, noDataText);
		                        }
		                    },
							animation: false,
							series : [ {
								type : 'bar',
								barWidth: 50,
								itemStyle : {
									normal : {
										color : function(params) {
											var colorList = rcColors;
											return colorList[params.dataIndex];
										},
										label : {
											show : true,
											position : 'inside',
											formatter : function(param){
												return param.value;
											}
										}
									}
								},
								data : datas
							} ]
					};
					// 为echarts对象加载数据
					trendChart.clear();
					trendChart.setOption(trendChartOption); 
					
				}
				}
			});
		},
		//资源池或云资源CPU分配比
		rpStorageIo : function(url, readName, writeName,  chart, targetId){
	    	var symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow','emptycircle', 'emptyrect', 'emptyroundRect', 'emptytriangle', 'emptydiamond', 'emptypin', 'emptyarrow','emptyrect', 'emptyroundRect', 'emptytriangle', 'emptydiamond', 'emptypin', 'emptyarrow']

			$.ajax({
				   type: "GET",
				   dataType:"json",
				   url: url,
				   success: function(result){
					   if (result != null && result.length == 0) {
						   getNoDataText(targetId, $translate);
					   } else {
					   if (result != null) {
						   var array = new Array();
						   var showName = [writeName, readName];
						   var names = [];
						   for (var i=result.length-1 ;i>=0; i--) {
							   var readAndWrite = [];
							   readAndWrite.list = result[i];
							   readAndWrite.name = showName[i];
							   array.push(readAndWrite);
						   }
						   var seriesdata = [];//图表的数据
						   for (var i=0 ;i<array.length; i++) {
							   var ratesdata = array[i].list;
							   names.push(array[i].name);
							   seriesdata.push({
								   name : array[i].name,
								   type : 'line',
								   showAllSymbol : true,
								   smooth : true,
									   symbol:symbols[i],
		    						   showAllSymbol : true,
		                               smooth : true,
						               itemStyle: {
						            	   normal: {
						                	 color : lineColor[i],
						                    lineStyle: {
						                        width: 1
						                    }
						                }
						             },
						             areaStyle:{
			                            normal: {
			                            	color: areaColor[i]
						             		/*
			                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                                    offset: 0,
			                                    color: areaColor[i]
			                                }, {
			                                    offset: 1,
			                                    color: areaColor[i]
			                                }])
			                           */}
						             },
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
											   for (var j= 0; j< params.length;j++){
												   var date = new Date(params[j].value[0]);
												   var name = params[j].seriesName;
										   var nameStr = "";
										   if (!isEmpty(name) && name.length > 32) {
											   var n = name.length / 32;
											   for (var i = 0; i < n; i++) {
												   nameStr += name.substring(i * 32, i * 32 + 32) + '<br/>';
											   }
											   nameStr += name.substring(n * 32, name.length);
										   } else {
													   nameStr = name;
										   }
												   if (result.indexOf(date.Format("yyyy-MM-dd HH:mm")) == -1) {
													   	result = date.Format("yyyy-MM-dd HH:mm") ;
												   }
												   result = result  + '<br/>' + nameStr + " : " + params[j].value[1];
												  
											   }
										   return result;
									   },
								   },
								   legend : {
									   data : names,
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
									            	axisTick : {
														show : false
								            	},
							         	            splitLine :{lineStyle:{color: ['#e4eaec']}},
							         	            axisLine :{lineStyle :{color: '#e4eaec',width: 1}},
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
									            		textStyle: {
															fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
															color : '#333'
														},
								            		}
								            	}
								            ],
								            yAxis : [
								                     {
								                    	 type : 'value',
									                    	 axisTick : {
																	show : false
																},
										         	         splitLine :{lineStyle:{color: ['#e4eaec']}},
										         	         axisLine :{lineStyle :{color: '#e4eaec',width: 1}},
										         	         axisLabel : {
																textStyle: {
																	fontFamily:'"Microsoft Yahei","微软雅黑",Arial',
																	color : '#333'
																},
								                    		 }
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
						   if (chart) {
							   chart.setOption(trendOption); 
						   }
					   }
					   
				   }
				   }
			})
		}
	};
});
