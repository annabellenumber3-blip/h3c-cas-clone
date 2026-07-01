DataBox = twaver.DataBox;
ElementBox = twaver.ElementBox;

Data = twaver.Data;
Link = twaver.Link;
Node = twaver.Node;
Property = twaver.Property;
Column = twaver.Column;
Tab = twaver.Tab;
Network = twaver.canvas.Network;

Accordion = twaver.controls.Accordion;
BorderPane = twaver.controls.BorderPane;
List = twaver.controls.List;
PropertySheet = twaver.controls.PropertySheet;
SplitPane = twaver.controls.SplitPane;
Table = twaver.controls.Table;
TablePane = twaver.controls.TablePane;
TabPane = twaver.controls.TabPane;
TitlePane = twaver.controls.TitlePane;
Tree = twaver.controls.Tree;
TreeTable = twaver.controls.TreeTable;

var CLOUDRESOURCE = 1;
var HOSTPOOL = 2;
var CLUSTER = 3;
var HOST = 4;
var VM = 5;
var ETH = 6;
var VSWITCH = 7;
var FS = 8;
var TOR = 9;
var UNSTATUS = -100;

var COMPUTER = 1;
var STORAGE = 3;
var NETWORK = 2;

topo = {};

topo.Util = {
    initToolTip : function (data, url, callback, topology) {
    	var tempTip = new KeyValueObject();
    	jQuery.i18n.properties({
    		name : 'strings', //资源文件名称
    		path : 'js/topo/i18n/', //资源文件路径
    		mode : 'map', //用Map的方式使用资源文件中的值
    		language : globalLang //index.jsp中根据后台locale判断的语言值
    	});

        var lunSize = 0;
		// 同节点使用缓存的信息
		if (topology != "storage" && tempTip.getKey() == data.getId()) {
			return tempTip.getValue();
		}
		var tip = "";
		var image = new Image();
		var clientData = {type: data.getClient('type'), status : UNSTATUS};
		var svgImg = topo.Util.getImageByType(clientData);
		image.setAttribute('src', './images/16/'+svgImg+'.svg');
		image.setAttribute('class', 'topoTitleImg');
		if (data && data instanceof twaver.Node) {   // Node 节点的提示
//			var tooltip = data.getToolTip();
			var id = data.getClient('id');
			var type = data.getClient('type');
			switch (type)
			{
			case CLOUDRESOURCE :
			case HOSTPOOL :
				break;
            case FS :
               var hostId = "";
               var ssName = data.getClient("name");
               var poolType = data.getClient("status");
			   var location = url + "?id=" + id + "&type=shareStorage&name=" + ssName + "&poolType=" + poolType;
               var parent = data.getToLinks().get(0).getFromNode();
               if (parent.getClient("type") == HOST) {
            	   hostId = parent.getClient("id");
				   location +=  "&host_id=" + hostId;
               } 

               var storagetip = document.createElement('div');   // 解析存储
               storagetip.setAttribute('id', 'test');
			   storagetip.setAttribute('class','tipDiv');
			   var title = document.createElement('div');
			   title.setAttribute('class','titleDiv');
			   title.setAttribute('title', ssName);
			   title.appendChild(image);
			   var titleH5 = document.createElement('h5');
			   titleH5.appendChild(document.createTextNode(ssName));
			   title.appendChild(titleH5);
			   storagetip.appendChild(title);
				
               $.ajax({
					type : "GET",
					dataType : "json",
					async : false,
					url : location,   // "./lib/tooltip.json" location
					success: function(data) {
						if (data != null && typeof data != "undefined") {
							var breakLine = document.createElement('div');
							breakLine.setAttribute('class','breakLine');
							
							var parent = document.createElement('ul');
							parent.setAttribute('class','tip-items');
							var status = 0;
							for (var item in data) {
								if (item == 'use') {
									var temp = data[item].split(":");
									var li = document.createElement('li');
									var left = document.createElement('div');
									left.setAttribute('class', 'tip-item-name');
									left.innerHTML = $.i18n.prop('usage');
									var right = document.createElement('div');
									right.setAttribute('class', 'tip-item-value');
									var proval = parseInt(temp[1]).toFixed(2) - 0;
									var styles = "normal";
									if (proval > 80) {
										styles = "warning";
									} else if (proval > 50) {
										styles = "high";
									}
									right.innerHTML = "<progress class='" + styles + "' value='" + proval + "' max='100' ></progress>  " + proval + '%';
									li.appendChild(left);
									li.appendChild(right);
									parent.appendChild(li);
								} else if (item != "unused" && item != "use") {
									if (item == "lun") {
										var lunDatas = data[item];
										for (var x = 0; x < lunDatas.length; x++) {
								            var li = document.createElement('li');
								            li.setAttribute('class', 'breakLine2');
								            parent.appendChild(li);
											var lunBean = lunDatas[x];
											for (var lunItem in lunBean) {
												var li = document.createElement('li');
												var left = document.createElement('div');
												left.setAttribute('class', 'tip-item-name');
												left.innerHTML = lunItem;
												var right = document.createElement('div');
												right.setAttribute('class', 'tip-item-value');
												right.innerHTML = lunBean[lunItem];
												li.appendChild(left);
												li.appendChild(right);
												parent.appendChild(li);
							                }
										}
										lunSize = lunDatas.length;
									} else {
										var li = document.createElement('li');
										var left = document.createElement('div');
										left.setAttribute('class', 'tip-item-name');
										left.innerHTML = item;
										var right = document.createElement('div');
										right.setAttribute('class', 'tip-item-value');
										right.innerHTML = data[item];
										li.appendChild(left);
										li.appendChild(right);
										parent.appendChild(li);
									}
								} else if (item == "status") {
									status = data[item];
								}
							}
							storagetip.appendChild(breakLine);
							storagetip.appendChild(parent);
						}
					},
					error: function(result) {
						storagetip = null;
					}
			   });
               tip = storagetip;
			   break;
            case CLUSTER:
				var location = url + "?id=" + id + "&type=" + topo.Util.getType(type);
//				if (tooltip) {
					$.ajax({
						type : "GET",
						dataType : "json",
						async : false,
						url : location,
						success: function(result) {
							if (callback) {
								tip = callback(result);
							} else {
								tip = topo.Util.analyseToolTip(result, data);
							}
						},
						error: function(result) {
							tip = null;
						}
					});
//				}
					break;
			case VSWITCH:
				var  hostId
				var location = url + "?id=" + id + "&type=vswitch";
				var parent = data.getToLinks().get(0).getFromNode();
				if (parent.getClient("type") && parent.getClient("type") == HOST) {
					hostId = parent.getClient("id");
				} else {
					parent = parent.getToLinks().get(0).getFromNode();
					hostId = parent.getClient("id");
				}

				   location +=  "&host_id=" + hostId;   
//				if (tooltip) {
					$.ajax({
						type : "GET",
						dataType : "json",
						async : false,
						url : location,
						success: function(result) {
							if (callback) {
								tip = callback(result);
							} else {
								tip = topo.Util.analyseToolTip(result, data);
							}
						},
						error: function(result) {
							tip = null;
						}
					});
//				}
				break;
				case HOST:
				case VM:
					//if (topology == "computer"){
						var location = url + "?id=" + id + "&type=" + topo.Util.getType(type);
//				   if (tooltip) {
						$.ajax({
							type : "GET",
							dataType : "json",
							async : false,
							url : location,
							success: function(result) {
								if (callback) {
									tip = callback(result);
								} else {
									tip = topo.Util.analyseToolTipWithProgress(result, data);
								}
							},
							error: function(result) {
								tip = null;
							}
						});
//				   }
//					}
					break;
		    default:
                break;
			}
		} else if (data && data instanceof twaver.Link && topology == "network"){	// Link
																					// 节点的提示
			var fromNode = data.getFromNode();
	    	var toNode = data.getToNode();
	    	if (fromNode && toNode && toNode.getClient("type") && fromNode.getClient("type")) {
	    		var toType = toNode.getClient("type");
	    		var domainName = "";
	    		var domainId = "";
	    		var vsId = "";
	    		var vsName = "";
	    		var hostId = "";
	    		var fromType = fromNode.getClient("type");
	    		var type = "";
	    		if (toType == ETH && fromType == TOR) {	// TOR  暂时不处理
	    		} else if (toType == VM && fromType == VSWITCH){	// VNNET
	    			domainName = toNode.getClient("name");
	    			domainId = toNode.getClient("id");
	    			vsId = fromNode.getClient("id");
	    			vsName = fromNode.getClient("name");
	    			var status = toNode.getClient("status");
    				var parent = fromNode.getToLinks().get(0).getFromNode();
	    			if (parent.getClient("type") == HOST) {
	    				hostId = parent.getClient("id");
	    			} else {
	    				parent = parent.getToLinks().get(0).getFromNode();
	    				if (parent.getClient("type") == HOST) {
	    					hostId = parent.getClient("id");
	    				} else {
	    					hostId = -1;
	    				}
	    			}
	    			if (status && status != 2 && status != 4) {
	    				var linkTip = document.createElement('div');
						linkTip.setAttribute('id', 'test');
						linkTip.setAttribute('class','tipDiv');
						var title = document.createElement('div');
						title.setAttribute('class','titleDiv');
						title.setAttribute('title', domainName);
						var titleH5 = document.createElement('h5');
						titleH5.appendChild(document.createTextNode(domainName));
						title.appendChild(titleH5);
						linkTip.appendChild(title);
						tip = linkTip;
	    			} else {
	    				var location = url + "?domainId=" + domainId + "&type=vnet&domain_name=" + domainName + "&id=" + vsId + "&name=" + vsName + "&host_id=" + hostId;
	    				$.ajax({
	    					type : "GET",
	    					dataType : "json",
	    					async : false,
	    					url : location,
	    					success: function(result) {
	    						if (callback) {
	    							tip = callback(result);
	    						} else {
	    							var linkTip = document.createElement('div');
	    							linkTip.setAttribute('id', 'test');
	    							linkTip.setAttribute('class','tipDiv');
	    							var title = document.createElement('div');
	    							title.setAttribute('class','titleDiv');
	    							title.setAttribute('title', domainName);
	    							var titleH5 = document.createElement('h5');
	    							titleH5.appendChild(document.createTextNode(domainName));
	    							title.appendChild(titleH5);
	    							var breakLine = document.createElement('div');
	    							breakLine.setAttribute('class','breakLine');
	    							
	    							var parent = document.createElement('ul');
	    							parent.setAttribute('class','tip-items');
	    							
	    							var li = document.createElement('li');
	    							var left = document.createElement('div');
	    							left.setAttribute('class', 'tip-item-name');
	    							left.innerHTML = $.i18n.prop('domainName');
	    							var right = document.createElement('div');
	    							right.setAttribute('class', 'tip-item-value');
	    							right.innerHTML = domainName;
	    							li.appendChild(left);
	    							li.appendChild(right);
	    							parent.appendChild(li);
	    							
	    							for (var x = 0; x < result.length; x++) {
	    								topo.Util.analyseToolTip(result[x], data, false, parent);
	    							}
	    							
	    							linkTip.appendChild(title);
	    							linkTip.appendChild(breakLine);
	    							linkTip.appendChild(parent);
	    							tip = linkTip;
	    						}
	    					},
	    					error: function(result) {
	    						tip = null;
	    					}
	    				});
	    			}
	    		}
	    	}
		}
		if (tip == "") {
			tip = "";
		}
		tempTip.put(data.getId(), tip);
		return tip;
    },
    initRainbowToolTip : function (data) {
    	// 同节点使用缓存的信息
    	var tempTip = new KeyValueObject();
		
    	var tip = "";
		if (data && data instanceof twaver.Node) {   // Node 节点的提示
			if (tempTip.getKey() == data.getId()) {
				return tempTip.getValue();
			}
			var tooltip = data.getToolTip();
			var id = data.getClient('id');
			var type = data.getClient('type');
			var publicCloudId = data.getClient('publicCloudId');
			switch (type)
			{
				case CLOUDRESOURCE :
					var location = 'publicCloud/'+ publicCloudId +'/tooltips?id=' + id + '&type=' + topo.Util.getType(type);
	            	if (tooltip) {
	            		$.ajax({
	            			type : "GET",
	            			dataType : "json",
	            			async : false,
	            			url : location,
	            			success: function(result) {
	            				if (result && result.errorCode) {
	            					tip = null;
	            				} else {
	            					tip = topo.Util.analyseToolTip(result, data, true);
	            				}
	            			},
	            			error: function(result) {
	            				tip = null;
	            			}
	            		});
	            	}
	            	break;
				case HOSTPOOL :
					break;
	            case CLUSTER:
	            	var location = 'publicCloud/'+ publicCloudId +'/tooltips?id=' + id + '&type=' + topo.Util.getType(type);
	            	if (tooltip) {
	            		$.ajax({
	            			type : "GET",
	            			dataType : "json",
	            			async : false,
	            			url : location,
	            			success: function(result) {
	        					tip = topo.Util.analyseToolTip(result, data, true);
	            			},
	            			error: function(result) {
	            				tip = null;
	            			}
	            		});
	            	}
	            	break;
	            case HOST:
	            	var location = 'publicCloud/'+ publicCloudId +'/tooltips?id=' + id + '&type=' + topo.Util.getType(type);
	            	if (tooltip) {
	            		$.ajax({
	            			type : "GET",
	            			dataType : "json",
	            			async : false,
	            			url : location,
	            			success: function(result) {
	        					tip = topo.Util.analyseToolTipWithProgress(result, data, true);
	            			},
	            			error: function(result) {
	            				tip = null;
	            			}
	            		});
	            	}
			    default:
	                break;
				}
				tempTip.put(data.getId(), tip);
			} else  if (data && data instanceof Object) {
				var id = data.id;
				var type = data.type;
				var publicCloudId = data.publicCloudId;
				var location = 'publicCloud/'+ publicCloudId +'/tooltips?id=' + id + '&type=' + topo.Util.getType(type);
				
				var image = new Image();
				var clientData = {type: data.type, status :UNSTATUS};
				var svgImg = topo.Util.getImageByType(clientData);
				image.setAttribute('src', './images/16/'+svgImg+'.svg');
				image.setAttribute('class', 'topoTitleImg');
				
				var linkTip = document.createElement('div');
				linkTip.setAttribute('id', 'test');
				linkTip.setAttribute('class','tipDiv');
				var title = document.createElement('div');
				title.setAttribute('class','titleDiv');
				title.setAttribute('title', data.name);
				title.appendChild(image);
				var titleH5 = document.createElement('h5');
				titleH5.appendChild(document.createTextNode(data.name));
				title.appendChild(titleH5);
				var breakLine = document.createElement('div');
				breakLine.setAttribute('class','breakLine');
				linkTip.appendChild(title);
				linkTip.appendChild(breakLine);
				
				$.ajax({
	    			type : "GET",
	    			dataType : "json",
	    			async : false,
	    			url : location,
	    			success: function(result) {
						tip = topo.Util.analyseToolTipWithProgress(result, data, true, linkTip);
	    			},
	    			error: function(result) {
	    				tip = null;
	    			}
	    		});
	    		
				tip = linkTip;
				
	        	tempTip.put(id, tip);
		}
		if (tip == "") {
			tip = "";
		}
		return tip;
    },
    createPieChartElement : function(name, value, color, pieChart) {
        var element = new twaver.Element();
        element.setName(name);
        element.setStyle('chart.value', value);
        element.setStyle('chart.color', color);
        pieChart.getDataBox().add(element);
        return element;
    },
    getType : function (type) {
    	var dest = "";
    	switch (type) {
		      case 0:
		    	  dest = "root";
		  		  break;
			  case 1:
				  dest = "cloudResource";
				  break;
			  case 2:
				  dest = "hostPool";
				  break;
			  case 3:
				  dest = "cluster";
				  break;
			  case 4:
				  dest = "host";
				  break;
			  case 5:
				  dest = "domain";
				  break;
			  case 6:
				  dest = "router";
				  break;
			  case 7:
				  dest = "vnet";
				  break;
			  case 8:
				  dest = "storage";
				  break;
		}
    	return dest;
    },
	initAlarm : function (network) {
		jQuery.i18n.properties({
    		name : 'strings', //资源文件名称
    		path : 'js/topo/i18n/', //资源文件路径
    		mode : 'map', //用Map的方式使用资源文件中的值
    		language : globalLang //index.jsp中根据后台locale判断的语言值
    	});
	   twaver.AlarmSeverity.CRITICAL.nickName = $.i18n.prop('abnormal');
	   twaver.AlarmSeverity.MAJOR.nickName = "";
	   twaver.AlarmSeverity.MINOR.nickName = "";
	   twaver.AlarmSeverity.WARNING.nickName = $.i18n.prop('warning');
	   twaver.AlarmSeverity.INDETERMINATE.nickName = "";
	   
	   network.getAlarmLabel = function (element) {
           var severity = element.getAlarmState().getHighestNewAlarmSeverity();
           if (severity) {
           	var label = severity.nickName;
               return label;
           }
           return null;
       };
    },
    initImageResouce : function (network) {
    	var imageArray = new Array("./images/16/vm.svg","./images/16/vm-running.svg","./images/16/vm-close.svg","./images/16/vm-unkown.svg","./images/16/vm-pause.svg",
    			"./images/16/cloudResource.svg","./images/16/cluster.svg","./images/16/hostPool.svg","./images/32/router.png",
    			"./images/16/host_normal.svg","./images/16/host-error.svg","./images/16/host-warn.svg","./images/16/host.svg","./images/16/host-maint.svg",
    			"./images/16/storage.svg","./images/32/storage-warn.png","./images/32/storage-error.png",
    			"./images/16/eth.svg","./images/16/vswitch.svg",
    			"./images/32/fileSystem-warn.png","./images/16/cluster-enable.svg",
    			"./images/16/cluster-close.svg","./images/16/group.png");

    	for (var index = 0; index < imageArray.length; index++) {
    		topo.Util.registerImage(imageArray[index], network);
    	}
    },
    initRainbowImageResouce : function (network) {
    	var imageArray = new Array("./images/16/vm.svg","./images/16/vm-running.svg","./images/16/vm-close.svg","./images/16/vm-unkown.svg","./images/16/vm-pause.svg",
    			"./images/16/casLogo.svg","./images/16/cluster.svg","./images/16/casLogoError.svg","./images/16/hostPool.svg","./images/32/router.png",
    			"./images/16/host_normal.svg","./images/16/host-error.svg","./images/16/host-warn.svg","./images/16/host.svg","./images/16/host-maint.svg",
    			"./images/16/storage.svg","./images/32/storage-warn.png","./images/32/storage-error.png",
    			"./images/16/eth.svg","./images/16/vswitch.svg",
    			"./images/32/fileSystem-warn.png","./images/16/cluster-enable.svg",
    			"./images/16/cluster-close.svg","./images/16/group.png","./images/16/spaceflight_loginlogo.png","./css/img/spaceflight_favicon.png","./css/img/caslogo_unis.svg");
    	for (var index = 0; index < imageArray.length; index++) {
    		topo.Util.registerImage(imageArray[index], network);
    	}
    },
    registerImage: function (url, network, width, height) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        image.onload = function () {
        	//console.log(" now image:"+url+", width:"+image.width+", height:"+image.height);
        	if (width != null && height != null) {
        		twaver.Util.registerImage(topo.Util.getImageName(url), image, width, height, network);        		
        	} else {
        		var w = 32,h = 32;
        		if (image.height != 32) {
        			h = 32;
        			w = image.width * (32.0 / image.height); 
        		}
        		twaver.Util.registerImage(topo.Util.getImageName(url), image, w, h, network);
        	}
            image.onload = null;
            for (var i = 1; i < views.length; i++) {
                var view = views[i];
                if (view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                }
                if (view.invalidateDisplay) {
                    view.invalidateDisplay();
                }
            }
        };
    },
    getImageName: function (url) {
        var index = url.lastIndexOf('/');
        var name = url;
        if (index >= 0) {
            name = url.substring(index + 1);
        }
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    },
	getAlarmByStatus : function (data) {
		var alarm = twaver.AlarmSeverity.CLEARED;
		var type = data.type;
		var status = data.status;
		if (type == HOST) {
		switch(status){
				case 0:
				alarm = twaver.AlarmSeverity.CRITICAL; break;
				case 99: 
					alarm = twaver.AlarmSeverity.WARNING; break;
			}
		} else if (type == VM) {
			switch(status){
				case 0:
			case 1: 
					alarm = twaver.AlarmSeverity.CRITICAL; break;
				case 99: 
				alarm = twaver.AlarmSeverity.WARNING; break;
		}
		} else if (type == FS) {
			switch(status){
				case 99: 
					alarm = twaver.AlarmSeverity.WARNING; break;
			}
		}
		return alarm;
	},
    getImageByType : function(data) {
    	var type =  data.type;
    	var status = data.status;
    	var image = "default";
    	switch (type) {
	      case 0:
	  		  image = "root";
	  		  break;
    	  case 1:
    		  image = "cloudResource";
    		  break;
    	  case 2:
    		  image = "hostPool";
    		  break;
    	  case 3:
    		  image = "cluster";
    		  if(status == 1) {
    		  	 image = "cluster-enable";
    		  } else if(status == 0) {
    		  	 image = "cluster-close";
    		  }
    		  break;
    	  case 4:
    		  image = "host";
    		  if (status == 0) {
    			  image = "host-error";
			  } else if (status == 2 || status == 99) {
    			  image = "host-warn";
			  } else if (status == 3 || status == 4) {
				  image = "host-maint";
			  } else if (status == 1) {
    			  image = "host_normal";
    		  }
    		  break;
    	  case 5:
    		  image = "vm";
    		  var haStatus = data.haStatus;
    		  if (haStatus != null && haStatus != 0) {
    			  image = "vm-haexception";
    		  } else if (status == 2) {
    			  image = "vm-running";
    		  } else if (status == 4) {
    			  image = "vm-pause";
    		  } else if (status == 3) {
    			  image = "vm-close";
    		  } else if (status == 1) {
    			  image = "vm-unkown";
    		  }
    		  break;
    	  case 6:
    		  image = "eth";
    		  break;
    	  case 7:
    		  image = "vswitch";
    		  break;
    	  case 8:
    		  image = "storage";
    		  break;
    	  case 9:
    		  image = "casLogo";
    		  break;
    	}
    	return image;
    },
    analyseToolTipWithProgress : function(data, node, isRainbow, parent) {
    	var tip;
    	if (parent) {
    		tip = parent;
    	} else {
    		var image = new Image();
    		var clientData = {type: node.getClient('type'), status: UNSTATUS};
    		var svgImg = topo.Util.getImageByType(clientData);
    		image.setAttribute('src', './images/16/'+svgImg+'.svg');
    		image.setAttribute('class', 'topoTitleImg');
    		tip = document.createElement('div');
    		tip.setAttribute('id', 'test');
    		tip.setAttribute('class','tipDiv');
    		var title = document.createElement('div');
    		title.setAttribute('class','titleDiv');
    		title.setAttribute('title', node.getClient("name"));
    		title.appendChild(image);
    		var titleH5 = document.createElement('h5');
			titleH5.appendChild(document.createTextNode(node.getClient("name")));
			title.appendChild(titleH5);
    		var breakLine = document.createElement('div');
    		breakLine.setAttribute('class','breakLine');
    		tip.appendChild(title);
    		tip.appendChild(breakLine);
    	}
		if (data != null && typeof data != "undefined") {
			var ul = document.createElement('ul');
			ul.setAttribute('class', 'tip-items');
			for ( var item in data) {
				var li = document.createElement('li');
				var datemp = data[item];
				var regx = /^[0-9]+.[0-9]+%/;
				var runRegx = /^[0-9]+\(\S+,\S+\)$/;
				if (datemp && typeof(datemp) == "string" && regx.test(datemp)) {
					var proval = datemp.substring(0, datemp.length-1);
					var styles = "normal";
					if (proval > 80) {
						styles = "warning";
					} else if (proval > 50) {
						styles = "high";
					}
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop(item);
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = "<progress class='" + styles + "' value='" + proval + "' max='100' ></progress>  " + datemp;
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else if (typeof(datemp) == "string" && datemp.indexOf(")") > 0 && datemp.indexOf(",") > 0 && runRegx.test(datemp)) {
					var total = parseInt(datemp.substring(0,datemp.indexOf("(")));
					var running = 0;
					var close = 0;
					var firstIndex = 0;
					var secondIndex = 0;
					var endIndex = datemp.indexOf(")");
					var splitterIndex = datemp.indexOf(",");
					if (datemp.indexOf(":") > 0) {
						firstIndex = datemp.indexOf(":");
						secondIndex = datemp.lastIndexOf(":");
						running = parseInt(datemp.substring(firstIndex + 1, splitterIndex));
						close = parseInt(datemp.substring(secondIndex + 1, endIndex));
					} else if (datemp.indexOf("：") > 0) {
						firstIndex = datemp.indexOf("：");
						secondIndex = datemp.lastIndexOf("：");
						running = parseInt(datemp.substring(firstIndex + 1, splitterIndex));
						close = parseInt(datemp.substring(secondIndex + 1, endIndex));
					}
					var startImageUrl = "<img width='10px' height='10px' src='./images/running.png'/>";
					var closeImageUrl = "<img width='10px' height='10px' src='./images/closed.png'/>";
					var statusHtml = total + "(" + startImageUrl + " " + running + "," + closeImageUrl + " " + close + ")";
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop(item);
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = statusHtml;
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else if (typeof(item) == "string" && item == "domain.network") {  // 网络单独处理
					//li.setAttribute("word-break","keep-all");
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop('domain.network');
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = datemp.replace(/;/g,"<br/>");
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else if (typeof(item) == "string" && item == "host.status") {  // 主机状态单独处理
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop('status');
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					var hostStatus = new Image();
					var svgImg = "host";
	    		    if (datemp == 0) {
	    		    	svgImg = "host-error";
		  			} else if (datemp == 2 || datemp == 99) {
		  				svgImg = "host-warn";
		  			} else if (datemp == 3 || datemp == 4) {
		  				svgImg = "host-maint";
		  			} else {
	    		    	svgImg = "host_normal";
	    		    }
	    		    hostStatus.setAttribute('src', './images/16/'+svgImg+'.svg');
	    		    hostStatus.setAttribute('class', 'topoTitleImg');
					right.appendChild(hostStatus);
					right.appendChild(document.createTextNode($.i18n.prop('host.status.' + datemp)));
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else if (typeof(item) == "string" && item == "domain.status") {  // 虚拟机状态单独处理
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop('status');
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					var vmStatus = new Image();
					var svgImg = "vm";
	    		    if (datemp == 'running') {
	    		    	svgImg = "vm-running";
	    		    } else if (datemp == 'shutOff') {
	    		    	svgImg = "vm-close";
	    		    } else if (datemp == 'paused') {
	    		    	svgImg = "vm-pause";
	    		    } else if (datemp == 'unknown') {
	    		    	svgImg = "vm-unkown";
	    		    }
					vmStatus.setAttribute('src', './images/16/'+svgImg+'.svg');
					vmStatus.setAttribute('class', 'topoTitleImg');
					right.appendChild(vmStatus);
					right.appendChild(document.createTextNode($.i18n.prop('domain.status.' + datemp)));
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else if (typeof(item) == "string" && item == "host.cpu.quantity") {
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop(item);
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = datemp + $.i18n.prop("cpu.unit");
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else {
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop(item);
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = datemp;
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} 
			}
			tip.appendChild(ul);
		}
		return tip;
	},
    analyseToolTip : function(data, node, isRainbow, parent) {
    	var tip;
    	if (parent) {
    		tip = parent;
    	} else {
    		var image = new Image();
    		var clientData = {type: node.getClient('type'), status : UNSTATUS};
    		var svgImg = topo.Util.getImageByType(clientData);
    		image.setAttribute('src', './images/16/'+svgImg+'.svg');
    		image.setAttribute('class', 'topoTitleImg');
    		tip = document.createElement('div');
    		tip.setAttribute('id', 'test');
    		tip.setAttribute('class','tipDiv');
    		var title = document.createElement('div');
    		title.setAttribute('title', node.getClient("name"));
    		title.setAttribute('class','titleDiv');
    		title.appendChild(image);
    		var titleH5 = document.createElement('h5');
			titleH5.appendChild(document.createTextNode(node.getClient("name")));
			title.appendChild(titleH5);
    		var breakLine = document.createElement('div');
    		breakLine.setAttribute('class','breakLine');
    		tip.appendChild(title);
    		tip.appendChild(breakLine);
    	}
		if (data != null && typeof data != "undefined") {
			var ul = document.createElement('ul');
			ul.setAttribute('class', 'tip-items');
			for ( var item in data) {
				var li = document.createElement('li');
				var datemp = data[item];
				if (typeof(datemp) == "string" && datemp.indexOf(")") > 0 && datemp.indexOf(",") > 0) {
					var total = parseInt(datemp.substring(0,datemp.indexOf("(")));
					var running = 0;
					var close = 0;
					var firstIndex = 0;
					var secondIndex = 0;
					var endIndex = datemp.indexOf(")");
					var splitterIndex = datemp.indexOf(",");
					if (datemp.indexOf(":") > 0) {
						firstIndex = datemp.indexOf(":");
						secondIndex = datemp.lastIndexOf(":");
						running = parseInt(datemp.substring(firstIndex + 1, splitterIndex));
						close = parseInt(datemp.substring(secondIndex + 1, endIndex));
					} else if (datemp.indexOf("：") > 0) {
						firstIndex = datemp.indexOf("：");
						secondIndex = datemp.lastIndexOf("：");
						running = parseInt(datemp.substring(firstIndex + 1, splitterIndex));
						close = parseInt(datemp.substring(secondIndex + 1, endIndex));
					}
					var startImageUrl = "<img width='10px' height='10px' src='./images/running.png'/>";
					var closeImageUrl = "<img width='10px' height='10px' src='./images/closed.png'/>";
					var statusHtml = total + "(" + startImageUrl + " " + running + "," + closeImageUrl + " " + close + ")";
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop(item);
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = statusHtml;
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				} else {
					var left = document.createElement('div');
					left.setAttribute('class', 'tip-item-name');
					left.innerHTML = $.i18n.prop(item);
					var right = document.createElement('div');
					right.setAttribute('class', 'tip-item-value');
					right.innerHTML = datemp;
					li.appendChild(left);
					li.appendChild(right);
					ul.appendChild(li);
				}
			}
			tip.appendChild(ul);
		}
		return tip;
	},
	createPieChartElement: function (name, value, color, pieChart) {
        var element = new twaver.Element();
        element.setName(name);
        element.setStyle('chart.value', value);
        element.setStyle('chart.color', color);
        pieChart.getDataBox().add(element);
        return element;
    },
	nodeTwinkle : function(box) {
		var list = new Array();
		var pos = 0;
		box.getAlarmBox().forEach(function(alarm){
			var severity = alarm.getAlarmSeverity();
			if (severity && (severity.value == 500 || severity.value == 200)) {
				list[pos]=alarm;
				pos ++;
			}
		});
		if (list.length > 0) {
			var count = 0;
			setInterval(function(){
				for (var index = 0; index < list.length; index++) {
					if(count % 2 == 0){
				    	list[index].setCleared(true);
				    } else {
				    	list[index].setCleared(false);
				    }
				}
				count ++;
			},1000);
		}
	},
	setClientValues : function (root, data, element) {
		root.setClient("type", data.type);
		root.setClient("id",data.id);
		root.setClient("name",data.name);
		root.setClient("total", 0);
		if (!!data.total) {
			root.setClient("total", data.total);
		}
		
		root.setClient("status", data.status);
		if (element && element instanceof  twaver.Node && element.getClient('type') == HOST) {
			root.setClient("parentName",element.getName());
			root.setClient("parentId",element.getClient('id'));
			root.setClient("parentType",HOST);
		}

		if (element && element instanceof  twaver.Node && element.getClient('type') == VSWITCH) {
			root.setClient("parentName",element.getName());
			root.setClient("parentId",element.getClient('id'));
			root.setClient("parentType",VSWITCH);
		}
		
		root.setClient("hasDesigned", false);
        if (data.locationX > 0 && data.locationY > 0) {
        	root.setClient("hasDesigned", true);
        }
	},
	
	initSearchDiv : function (self, showSearch) {
		// 增加新的搜索。
		topo.Util.addCheckBox(self.toolbar, showSearch, $.i18n.prop('search'), function (e) {
			if(this.checked){
				$("#search").css("display", "block");
                $("#filterMenu").css("display", "block");
			}else{
				$("#search").css("display", "none");
                $("#filterMenu").css("display", "none");
			}
		}, 'searchCheckboxId');
	},
	
	initOverviewDiv : function (self, showOverview) {
		topo.Util.addCheckBox(self.toolbar, showOverview, $.i18n.prop('overview'), function (e) {
			if(this.checked){
				overviewDiv.style.display="block";
			}else{
				overviewDiv.style.display="none";
			}
		}, 'overviewCheckboxId');
		
		self.overview.setNetwork(self.overview.getNetwork() ? null : self.network);
		self.overview.setFillColor("rgba(184,211,240,0.8)");
		var overviewDiv=document.createElement("div");
		overviewDiv.id="overviewDiv";
		overviewDiv.style.background="white";
		overviewDiv.style.position="absolute";
		overviewDiv.style.right="20px";
		overviewDiv.style.bottom="20px";
		overviewDiv.style.width="300px";
		overviewDiv.style.display="none";
		
		self.network.addPropertyChangeListener(function(e){
			if(e.property==="canvasSizeChange"){
				overviewDiv.style.height=Math.ceil(300*self.network.getCanvasSize().height/self.network.getCanvasSize().width)+"px";
			}
		});
		
		overviewView=self.overview.getView();
		overviewView.style.left = '0px';
        overviewView.style.right = '0px';
        overviewView.style.top = '0px';
        overviewView.style.bottom = '0px';
		overviewDiv.appendChild(overviewView);
		document.body.appendChild(overviewDiv);
		if(showOverview){
			overviewDiv.style.display="block";
		}else{
			overviewDiv.style.display="none";
		}
	},
	appendChild : function(e, parent, top, right, bottom, left) {
		e.style.position = 'absolute';
		if (left != null)
			e.style.left = left + 'px';
		if (top != null)
			e.style.top = top + 'px';
		if (right != null)
			e.style.right = right + 'px';
		if (bottom != null)
			e.style.bottom = bottom + 'px';
		parent.appendChild(e);
	},
	createNetworkToolbar : function(network, type) {
		var toolbar = document.createElement('div');
		toolbar.style.background = '#ffffff';
		toolbar.style.top = '86px';
		toolbar.style.left = '240px';
		toolbar.style.lineHeight = '25px';
		topo.Util.addButton(toolbar, $.i18n.prop('select'), 'select', function() {
			if (twaver.Util.isTouchable) {
				network.setTouchInteractions();
			} else {
				network.setDefaultInteractions();
			}
		});
		topo.Util.addButton(toolbar, $.i18n.prop('magnify'), 'magnify', function() {
			network.setMagnifyInteractions();
		});
		topo.Util.addButton(toolbar, $.i18n.prop('pan'), 'pan', function() {
			network.setPanInteractions();
		});

		/*
		 * topo.Util.addButton(toolbar, 'Zoom In', 'zoomIn', function() {
		 * network.zoomIn(); }); topo.Util.addButton(toolbar, 'Zoom Out',
		 * 'zoomOut', function() { network.zoomOut(); });
		 * topo.Util.addButton(toolbar, 'Zoom Reset', 'zoomReset', function() {
		 * network.zoomReset(); }); topo.Util.addButton(toolbar, 'Zoom
		 * Overview', 'zoomOverview', function() { network.zoomOverview(); });
		 */
		topo.Util.addButton(toolbar, $.i18n.prop('export'), 'generate', function() {
			var canvas;
			if (network.getCanvasSize) {
				canvas = network.toCanvas(network.getCanvasSize().width,
						network.getCanvasSize().height);
			} else {
				canvas = network.toCanvas(network.getView().scrollWidth,
						network.getView().scrollHeight);
			}
			if (twaver.Util.isIE) {
				var w = window.open();
				w.document.open();
				w.document.write("<img src='" + canvas.toDataURL() + "'/>");
				w.document.close();
			} else {
				window.open(canvas.toDataURL(), 'network.png');
			}
		});
		if (typeof(type) != "undefined") {
			var appElement;
			var topoType;
			if (type == "computer") {
				appElement = window.document.querySelector('[ng-controller=ComputerTopoCtrl]');
				topoType = COMPUTER;
			} else if (type == "storage") {
				topoType = STORAGE;
				appElement = window.document.querySelector('[ng-controller=StorageTopoCtrl]');
			} else if (type == "network") {
				topoType = NETWORK;
				appElement = window.document.querySelector('[ng-controller=NetworkTopoCtrl]');
			}
			var $scope = window.angular.element(appElement).scope();
			// 增加新的图例。
			topo.Util.addButton(toolbar, $.i18n.prop('example'), 'example', function(e) {
				$scope.toggleExample();
			});
			// 增加保存按钮
			topo.Util.addButton(toolbar, $.i18n.prop('savedesignTopo'), 'export', function(e) {
				$scope.confirmSaveDesign();
			});
			// 增加重置按钮
			topo.Util.addButton(toolbar, $.i18n.prop('resetTopo'), 'reset', function(e) {
				$scope.resetTopo(topoType);
			});
			
		}
		return toolbar;
	},
	addButton : function(div, name, src, callback) {
		var button = document.createElement('input');
		button.setAttribute('type', src ? 'image' : 'button');
		button.setAttribute('title', name);
		button.style.verticalAlign = 'top';
		if (src) {
			button.style.padding = '4px 4px 4px 4px';
			if (src.indexOf('/') < 0) {
				src = './css/img/toolbar/' + src + '.png';
			}
			button.setAttribute('src', src);
		} else {
			button.value = name;
		}
		button.addEventListener('click', callback, false);
		div.appendChild(button);
		return button;
	},
	addDraggableButton : function(div, name, src, className) {
		var image = new Image();
		image.setAttribute('title', name);
		image.setAttribute('draggable', 'true');
		image.style.cursor = 'move';
		image.style.verticalAlign = 'top';
		image.style.padding = '4px 4px 4px 4px';
		if (src.indexOf('/') < 0) {
			src = './css/img/toolbar/' + src + '.png';
		}
		image.setAttribute('src', src);
		image.addEventListener('dragstart', function(e) {
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('Text', 'className:' + className);
		}, false);
		div.appendChild(image);
		return image;
	},
	addCheckBox : function(div, checked, name, callback, id) {
		var checkBox = document.createElement('input');
		checkBox.id = id;
		checkBox.type = 'checkbox';
		//checkBox.style.padding = '4px 4px 4px 4px';
		checkBox.style.verticalAlign = 'sub';
		checkBox.checked = checked;
		if (callback)
			checkBox.addEventListener('click', callback, false);
		div.appendChild(checkBox);
		var label = document.createElement('label');
		label.htmlFor = name;
		label.innerHTML = name;
		label.setAttribute("font-weight", "normal");
		div.appendChild(label);
		return checkBox;
	},
	addInteractionComboBox : function(div, network, interaction) {
		var items = twaver.Util.isTouchable ? [ 'Touch', 'None' ] : [
				'Default-Live', 'Default-Lazy', 'Edit-Live', 'Edit-Lazy',
				'Pan', 'Magnify', 'None' ];
		var callback = function() {
			if (this.value === 'Default-Live') {
				network.setDefaultInteractions();
			} else if (this.value === 'Default-Lazy') {
				network.setDefaultInteractions(true);
			} else if (this.value === 'Edit-Live') {
				network.setEditInteractions();
			} else if (this.value === 'Edit-Lazy') {
				network.setEditInteractions(true);
			} else if (this.value === 'Pan') {
				network.setPanInteractions();
			} else if (this.value === 'Magnify') {
				network.setMagnifyInteractions();
			} else if (this.value === 'Touch') {
				network.setTouchInteractions();
			} else if (this.value === 'None') {
				network.setInteractions(null);
			}
		};
		return topo.Util.addComboBox(div, items, callback, interaction);
	},
	addComboBox : function(div, items, callback, value) {
		var comboBox = document.createElement('select');
		comboBox.style.verticalAlign = 'top';
		items.forEach(function(item) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(item));
			option.setAttribute('value', item);
			comboBox.appendChild(option);
		});

		if (callback) {
			comboBox.addEventListener('change', callback, false);
		}

		if (value) {
			comboBox.value = value;
		}
		div.appendChild(comboBox);
		return comboBox;
	},
	initOverviewPopupMenu : function(overview) {
		var popupMenu = new twaver.controls.PopupMenu(overview);
		popupMenu.setMenuItems([ {
			label : $.i18n.prop('Mask'),
			type : 'check',
			selected : true,
			action : function(menuItem) {
				if (menuItem.selected) {
					overview.setFillColor(overview.oldFillColor);
					delete overview.oldFillColor;
				} else {
					overview.oldFillColor = overview.getFillColor();
					overview.setFillColor('rgba(0, 0, 0, 0)');
				}
			}
		}, {
			label : $.i18n.prop('Border'),
			type : 'check',
			selected : true,
			action : function(menuItem) {
				if (menuItem.selected) {
					overview.setOutlineColor(overview.oldOutlineColor);
					delete overview.oldOutlineColor;
				} else {
					overview.oldOutlineColor = overview.getOutlineColor();
					overview.setOutlineColor('rgba(0, 0, 0, 0)');
				}
			}
		} ]);
	},
	addInput : function(div, value, name, callback) {
		var input = document.createElement('input');
		input.id = name;
		input.value = value;
		input.addEventListener('keydown', function(e) {
			if (e.keyCode == 13) {
				callback(input.value);
			}
		}, false);
		var label = document.createElement('label');
		label.htmlFor = name;
		label.innerHTML = name;
		div.appendChild(label);
		div.appendChild(input);
		return input;
	},
	addTab : function(tabPane, name, view, selected, closable) {
		var tab = new twaver.Tab(name);
		tab.setName(name);
		tab.setView(view);
		tabPane.getTabBox().add(tab);
		tab.setClosable(closable);
		if (selected) {
			tabPane.getTabBox().getSelectionModel().setSelection(tab);
		}
		return tab;
	},
	randomInt : function(n) {
		return Math.floor(Math.random() * n);
	},
	randomBoolean : function() {
		return topo.Util.randomInt(2) != 0;
	},
	randomNonClearedSeverity : function() {
		while (true) {
			var severity = topo.Util.randomSeverity();
			if (!twaver.AlarmSeverity.isClearedAlarmSeverity(severity)) {
				return severity;
			}
		}
		return null;
	},
	randomSeverity : function() {
		var severities = twaver.AlarmSeverity.severities;
		return severities.get(topo.Util.randomInt(severities.size()));
	},
	randomColor : function() {
		var r = topo.Util.randomInt(255);
		var g = topo.Util.randomInt(255);
		var b = topo.Util.randomInt(255);
		return '#' + topo.Util._formatNumber((r << 16) | (g << 8) | b);
	},
	randomAlarm : function(alarmID, elementID, nonClearedSeverity) {
		var alarm = new twaver.Alarm(alarmID, elementID);
		alarm.setAcked(topo.Util.randomBoolean());
		alarm.setCleared(topo.Util.randomBoolean());
		alarm.setAlarmSeverity(nonClearedSeverity ? topo.Util
				.randomNonClearedSeverity() : topo.Util.randomSeverity());
		alarm.setClient('raisedTime', new Date());
		return alarm;
	},
	createColor : function(rgb, a) {
		if (typeof rgb == 'string' && rgb.indexOf('#') == 0) {
			rgb = parseInt(rgb.substring(1, rgb.length), 16);
		}
		var r = (rgb >> 16) & 0xFF;
		var g = (rgb >> 8) & 0xFF;
		var b = rgb & 0xFF;
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
	},
	_formatNumber : function(value) {
		var result = value.toString(16);
		while (result.length < 6) {
			result = '0' + result;
		}
		return result;
	},
	loadXmlString : function(xml) {
		var xmlDoc;
		if (!twaver.Util.isIE && window.DOMParser) {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(xml, 'text/xml');
		} else {
			xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
			xmlDoc.async = false;
			xmlDoc.loadXML(xml);
		}
		return xmlDoc;
	},
	loadXmlFile : function(url) {
		var xhttp = new XMLHttpRequest();
		xhttp.open('GET', url, false);
		xhttp.send();
		return xhttp.responseXML;
	},
	addStyleProperty : function(box, propertyName, category, name) {
		return topo.Util._addProperty(box, propertyName, category, name,
				'style');
	},
	addClientProperty : function(box, propertyName, category, name) {
		return topo.Util._addProperty(box, propertyName, category, name,
				'client');
	},
	addAccessorProperty : function(box, propertyName, category, name) {
		return topo.Util._addProperty(box, propertyName, category, name,
				'accessor');
	},
	_addProperty : function(box, propertyName, category, name, proprtyType) {
		var property = new twaver.Property();
		property.setCategoryName(category);
		if (!name) {
			name = topo.Util._getNameFromPropertyName(propertyName);
		}
		property.setName(name);
		property.setEditable(true);
		property.setPropertyType(proprtyType);
		property.setPropertyName(propertyName);

		var valueType;
		if (proprtyType === 'style') {
			valueType = twaver.SerializationSettings.getStyleType(propertyName);
		} else if (proprtyType === 'client') {
			valueType = twaver.SerializationSettings
					.getClientType(propertyName);
		} else {
			valueType = twaver.SerializationSettings
					.getPropertyType(propertyName);
		}
		if (valueType) {
			property.setValueType(valueType);
		}

		box.add(property);
		return property;
	},
	_getNameFromPropertyName : function(propertyName) {
		var names = propertyName.split('.');
		var name = '';
		for (var i = 0; i < names.length; i++) {
			if (names[i].length > 0) {
				name += names[i].substring(0, 1).toUpperCase()
						+ names[i].substring(1, names[i].length);
			}
			if (i < names.length - 1) {
				name += ' ';
			}
		}
		return name;
	},
	createColumn : function(table, name, propertyName, propertyType, valueType,
			editable) {
		var column = new twaver.Column(name);
		column.setName(name);
		column.setPropertyName(propertyName);
		column.setPropertyType(propertyType);
		if (valueType)
			column.setValueType(valueType);
		column.setEditable(editable);
		column.renderHeader = function(div) {
			var span = document.createElement('span');
			span.style.whiteSpace = 'nowrap';
			span.style.verticalAlign = 'middle';
			span.style.padding = '1px 2px 1px 2px';
			span.innerHTML = column.getName() ? column.getName() : column
					.getPropertyName();
			span.setAttribute('title', span.innerHTML);
			span.style.font = 'bold 12px Helvetica';
			div.style.textAlign = 'center';
			div.appendChild(span);
		};
		table.getColumnBox().add(column);
		return column;
	},
	formatDate : function(date, format) {
		var o = {
			'M+' : date.getMonth() + 1,
			'd+' : date.getDate(),
			'h+' : date.getHours(),
			'm+' : date.getMinutes(),
			's+' : date.getSeconds(),
			'q+' : Math.floor((date.getMonth() + 3) / 3),
			'S' : date.getMilliseconds()
		};
		if (/(y+)/.test(format))
			format = format.replace(RegExp.$1, (date.getFullYear() + '')
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp('(' + k + ')').test(format))
				format = format.replace(RegExp.$1,
						(RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k])
								.substr(('' + o[k]).length)));
		return format;
	},
	getPropertyName : function(e) {
		var name = e.property;
		if (name.indexOf('C:') == 0) {
			return name.substring(2, name.length);
		}
		if (name.indexOf('S:') == 0) {
			return name.substring(2, name.length);
		}
		return name;
	},
	align : function(elements, alignType) {
		if (!alignType) {
			throw new Error("align type can't be null");
		}
		elements = topo.Util._checkAndFilter(elements);
		if (elements == null) {
			return;
		}
		var bounds = topo.Util._getBounds(elements);
		if (bounds == null || bounds.x == Number.MAX_VALUE) {
			return;
		}
		alignType = alignType.toLowerCase();
		elements
				.forEach(function(node, index, array) {
					if (!(node instanceof twaver.Node)) {
						return;
					}
					var x = node.getX();
					var y = node.getY();
					switch (alignType) {
					case 'left':
						x = bounds.x;
						break;
					case 'right':
						x = bounds.x + bounds.width - node.getWidth();
						break;
					case 'top':
						y = bounds.y;
						break;
					case 'bottom':
						y = bounds.y + bounds.height - node.getHeight();
						break;
					case 'horizontalcenter':
						x = bounds.x
								+ (bounds.x + bounds.width - bounds.x - node
										.getWidth()) / 2;
						break;
					case 'verticalcenter':
						y = bounds.y
								+ (bounds.y + bounds.height - bounds.y - node
										.getHeight()) / 2;
						break;
					}
					node.setLocation(x, y);
				});
	},
	evenSpace : function(elements, isHorizontal, isEvenGap) {
		if (!isEvenGap) {
			isEvenGap = true;
		}
		elements = topo.Util._checkAndFilter(elements);
		if (elements == null) {
			return;
		}
		var bounds = topo.Util._getBounds(elements);
		if (bounds == null || bounds.x == Number.MAX_VALUE) {
			return;
		}
		elements.sort(function(item1, item2) {
			return isHorizontal ? (item1.getX() - item2.getX())
					: (item1.getY() - item2.getY());
		});

		var count = elements.length;
		var lastItem = elements[count - 1];
		var gap;
		if (isEvenGap) {
			var realSize = 0;
			elements.forEach(function(item, index, array) {
				realSize += isHorizontal ? item.getWidth() : item.getHeight();
			});
			gap = ((isHorizontal ? bounds.width : bounds.height) - realSize)
					/ (count - 1);
		} else {
			gap = (isHorizontal ? (bounds.width - lastItem.getWidth())
					: (bounds.height - lastItem.getHeight()))
					/ (count - 1);
		}
		var currentLocation = isHorizontal ? bounds.x : bounds.y;

		elements.forEach(function(node, index, array) {
			if (!(node instanceof twaver.Node)) {
				return;
			}
			if (isHorizontal) {
				node.setLocation(currentLocation + index * gap, node.getY());
			} else {
				node.setLocation(node.getX(), currentLocation + index * gap);
			}
			if (isEvenGap) {
				currentLocation += isHorizontal ? node.getWidth() : node
						.getHeight();
			}
		});
	},
	_checkAndFilter : function(elements) {
		if (!elements || elements.length == 0) {
			return null;
		}
		elements = elements.filter(function(item, index, array) {
			return item instanceof twaver.Node;
		});
		if (elements.length <= 1) {
			return null;
		}
		return elements;
	},
	_getBounds : function(elements) {
		var xMin = Number.MAX_VALUE;
		var xMax = Number.MIN_VALUE;
		var yMin = Number.MAX_VALUE;
		var yMax = Number.MIN_VALUE;

		elements.forEach(function(node, index, array) {
			if (node instanceof twaver.Node) {
				var x = node.getX();
				xMin = Math.min(x, xMin);
				var width = node.getWidth();
				xMax = Math.max(x + width, xMax);
				var y = node.getY();
				yMin = Math.min(y, yMin);
				var height = node.getHeight();
				yMax = Math.max(y + height, yMax);
			}
		});
		return {
			x : xMin,
			y : yMin,
			width : xMax - xMin,
			height : yMax - yMin
		};
	},
	createDraggableNetwork : function(box) {
		var network = new Network(box);

		network.getView().addEventListener('dragover', function(e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			e.dataTransfer.dropEffect = 'copy';
			return false;
		}, false);
		network.getView().addEventListener(
				'drop',
				function(e) {
					if (e.stopPropagation) {
						e.stopPropagation();
					}
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
					var text = e.dataTransfer.getData('Text');
					if (!text) {
						return false;
					}
					if (text && text.indexOf('className:') == 0) {
						topo.Util._createElement(network, text.substr(10,
								text.length), network.getLogicalPoint(e));
					}
					if (text && text.indexOf('<twaver') == 0) {
						network.getElementBox().clear();
						new twaver.XmlSerializer(network.getElementBox())
								.deserialize(text);
					}
					return false;
				}, false);

		network.getView().setAttribute('draggable', 'false');
		network.getView().addEventListener(
				'dragstart',
				function(e) {
					e.dataTransfer.effectAllowed = 'copy';
					e.dataTransfer.setData('Text', new twaver.XmlSerializer(
							network.getElementBox()).serialize());
				}, false);

		return network;
	},
	_createElement : function(network, className, centerLocation) {
		var element = twaver.Util.newInstance(className);
		element.setCenterLocation(centerLocation);
		element.setParent(network.getCurrentSubNetwork());
		network.getElementBox().add(element);
		network.getElementBox().getSelectionModel().setSelection(element);
	},
	isFullScreenSupported : function() {
		var docElm = document.documentElement;
		return docElm.requestFullscreen || docElm.webkitRequestFullScreen
				|| docElm.mozRequestFullScreen;
	},
	toggleFullscreen : function() {
		if (topo.Util.isFullScreenSupported()) {
			var fullscreen = document.fullscreen || document.mozFullScreen
					|| document.webkitIsFullScreen;
			if (!fullscreen) {
				var docElm = document.documentElement;
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				} else if (docElm.webkitRequestFullScreen) {
					docElm
							.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				} else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}
		}
	},
	createButton: function (type, id, status, scope, name) {
		var self = this;
		var li = document.createElement('li');
		//var appElement = window.document.querySelector('[ng-controller=ComputerTopoCtrl]');
		//var scope = window.angular.element(appElement).scope();
		switch (type) {
//			case CLUSTER : {
//				var btn1 = document.createElement('div');
//				btn1.setAttribute('class', 'tip-item-btn');
//				btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.operatCluster')));
//				btn1.addEventListener('click', function (e) {
//						//TODO  操作集群
//				});
//				//li.appendChild(btn1);
//				break;
//			};
//			case HOST : {
//				var btn1 = document.createElement('div');
//				btn1.setAttribute('class', 'tip-item-btn');
//				btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.operatHost')));
//				btn1.addEventListener('click', function (e) {
//						//TODO  操作主机
//				});
//				//li.appendChild(btn1);
//				break;
//			};
			case VM : {
				var btnArray = [];
				
				if(scope.hasPermission('VIRT_HOST_START')) {
					var btn1 = document.createElement('div');
					btn1.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 3)) {
						btn1.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.startVm')));
					btn1.addEventListener('click', function (e) {
						//TODO   start虚拟机
						var type = "start";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						scope.operatVm(type, id);
					});
					btnArray.push(btn1);
				}

				if(scope.hasPermission('VIRT_HOST_SHUTDOWN')) {
					var btn2 = document.createElement('div');
					btn2.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2)) {
						btn2.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					btn2.appendChild(document.createTextNode($.i18n.prop('rainbow.button.closeVm')));
					btn2.addEventListener('click', function (e) {
						//TODO   shutdown虚拟机
						var type = "shutdown";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						scope.operatVm(type, id);
					});
					btnArray.push(btn2);
				}
				
				if(scope.hasPermission('VIRT_HOST_CLOSE')) {
					var btn3 = document.createElement('div');
					btn3.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2) && (status != 4)) {
						btn3.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					btn3.appendChild(document.createTextNode($.i18n.prop('rainbow.button.shutdownVm')));
					btn3.addEventListener('click', function (e) {
						//TODO   close虚拟机
						var type = "close";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						scope.operatVm(type, id, name);
					});
					btnArray.push(btn3);
				}

				if(scope.hasPermission('VIRT_HOST_PAUSE')) {
					var moreBtn1 = document.createElement('div');
					moreBtn1.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2)) {
						moreBtn1.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					moreBtn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.pauseVm')));
					moreBtn1.addEventListener('click', function (e) {
						//TODO   pause虚拟机
						var type = "pause";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						scope.operatVm(type, id);
					});
					btnArray.push(moreBtn1);
				}
				
                if(scope.hasPermission('VIRT_HOST_RESTORE')) {
                	var moreBtn2 = document.createElement('div');
    				moreBtn2.setAttribute('class', 'tip-item-btn');
    				/** 1:未知 2:运行 3:关闭 4 暂停。 */
    				if (status && (status != 4)) {
    					moreBtn2.setAttribute('class', 'tip-item-btn btn-forbidden');
    				}
    				moreBtn2.appendChild(document.createTextNode($.i18n.prop('rainbow.button.restoreVm')));
    				moreBtn2.addEventListener('click', function (e) {
    					//TODO   restore虚拟机
    					var type = "restore";
    					if ($(this).hasClass("btn-forbidden")) {
    						return;
    					}
    					scope.operatVm(type, id);
    				});
    				btnArray.push(moreBtn2);
				}
                
                if(scope.hasPermission('VIRT_HOST_SLEEP')) {
                	var moreBtn3 = document.createElement('div');
    				moreBtn3.setAttribute('class', 'tip-item-btn');
    				/** 1:未知 2:运行 3:关闭 4 暂停。 */
    				if (status && (status != 2) && (status != 4)) {
    					moreBtn3.setAttribute('class', 'tip-item-btn btn-forbidden');
    				}
    				moreBtn3.appendChild(document.createTextNode($.i18n.prop('rainbow.button.sleepVm')));
    				moreBtn3.addEventListener('click', function (e) {
    					//TODO   sleep虚拟机
    					var type = "sleep";
    					if ($(this).hasClass("btn-forbidden")) {
    						return;
    					}
    					scope.operatVm(type, id);
    				});
    				btnArray.push(moreBtn3);
				}

                if(scope.hasPermission('VIRT_HOST_RESTART')) {
                	var moreBtn4 = document.createElement('div');
    				moreBtn4.setAttribute('class', 'tip-item-btn');
    				/** 1:未知 2:运行 3:关闭 4 暂停。 */
    				if (status && (status != 2) && (status != 4)) {
    					moreBtn4.setAttribute('class', 'tip-item-btn btn-forbidden');
    				}
    				moreBtn4.appendChild(document.createTextNode($.i18n.prop('rainbow.button.restartVm')));
    				moreBtn4.addEventListener('click', function (e) {
    					//TODO   restart虚拟机
    					var type = "restart";
    					if ($(this).hasClass("btn-forbidden")) {
    						return;
    					}
    					scope.operatVm(type, id);
    				});
    				btnArray.push(moreBtn4);
				}
                
                if(btnArray.length == 0) {
                	li = null;
                } else if(btnArray.length <= 3) {
                	for(var i=0;i<btnArray.length;i++) {
                		var btn = btnArray[i];
                		btn.style.width='70px';
                		li.appendChild(btn);
                	}
                } else {
                	for(var i=0;i<3;i++) {
                		var btn = btnArray[i];
                		btn.style.width='70px';
                		li.appendChild(btn);
                	}
                	
                	var moreBtn = document.createElement('div');
    				moreBtn.style.position='relative';
    				moreBtn.style.width='70px';
    				moreBtn.setAttribute('class', 'tip-item-btn');
    				moreBtn.appendChild(document.createTextNode($.i18n.prop('rainbow.button.moreVm')));
    				moreBtn.addEventListener('click', function (e) {
    					//TODO   more
    					$(moreOperations).toggle();
    				});

    				var moreOperations = document.createElement('ul');
    				moreOperations.setAttribute('class', 'more');
    				moreOperations.style.display='none';
                	
                	for(var j=3;j<btnArray.length;j++) {
                		var moreBtnli = document.createElement('li');
                		var btn = btnArray[j];
                		btn.style.width='70px';
                		moreBtnli.appendChild(btn);
                		moreOperations.appendChild(moreBtnli);
                	}
                	
                	moreBtn.appendChild(moreOperations);
                	li.appendChild(moreBtn);
                }
                
				break;
			};
			case FS: {

			};
		}
		return li;
	},
};
topo.SHAPE_TYPE = [ 'rectangle', 'oval', 'roundrect', 'star', 'triangle',
		'circle', 'hexagon', 'pentagon', 'diamond' ];
topo.GRADIENT_TYPE = [ 'linear.east', 'linear.north', 'linear.northeast',
		'linear.northwest', 'linear.south', 'linear.southeast',
		'linear.southwest', 'linear.west', 'none', 'radial.center',
		'radial.east', 'radial.north', 'radial.northeast', 'radial.northwest',
		'radial.south', 'radial.southeast', 'radial.southwest', 'radial.west',
		'spread.antidiagonal', 'spread.diagonal', 'spread.east',
		'spread.horizontal', 'spread.north', 'spread.south', 'spread.vertical',
		'spread.west' ];
topo.DIRECTION_TYPE = [ 'northwest', 'north', 'northeast', 'east', 'west',
		'south', 'southwest', 'southeast' ];
topo.ATTACHMENT_DIRECTION_TYPE = [ 'aboveleft', 'aboveright', 'belowleft',
		'belowright', 'leftabove', 'leftbelow', 'rightabove', 'rightbelow',
		'above', 'below', 'left', 'right' ];
topo.POSITION_TYPE = [ 'topleft.topleft', 'top.top', 'topright.topright',
		'right.right', 'left.left', 'bottom.bottom', 'bottomleft.bottomleft',
		'bottomright.bottomright' ];
topo.ATTACHMENT_POSITION_TYPE = [ 'hotspot', 'from', 'to', 'topleft.topleft',
		'topleft.topright', 'top.top', 'topright.topleft', 'topright.topright',
		'topleft', 'top', 'topright', 'topleft.bottomleft',
		'topleft.bottomright', 'top.bottom', 'topright.bottomleft',
		'topright.bottomright', 'left.left', 'left', 'left.right', 'center',
		'right.left', 'right', 'right.right', 'bottomleft.topleft',
		'bottomleft.topright', 'bottom.top', 'bottomright.topleft',
		'bottomright.topright', 'bottomleft', 'bottom', 'bottomright',
		'bottomleft.bottomleft', 'bottomleft.bottomright', 'bottom.bottom',
		'bottomright.bottomleft', 'bottomright.bottomright' ];
topo.LINK_TYPE = [ 'arc', 'triangle', 'parallel', 'flexional',
		'flexional.horizontal', 'flexional.vertical', 'orthogonal', ,
		'orthogonal.horizontal', 'orthogonal.vertical', 'orthogonal.H.V',
		'orthogonal.V.H', 'extend.top', 'extend.left', 'extend.bottom',
		'extend.right' ];
topo.LINK_LOOPED_TYPE = [ 'arc', 'rectangle' ];
topo.LINK_CORNER_TYPE = [ 'none', 'round', 'bevel' ];
topo.LAYOUT_TYPE = [ 'round', 'topbottom', 'bottomtop', 'symmetry',
		'rightleft', 'leftright', 'hierarchic' ];
topo.BUS_STYLE_TYPE = [ 'nearby', 'north', 'south', 'west', 'east' ];
topo.SHAPELINK_TYPE = [ 'lineto', 'quadto', 'cubicto' ];
topo.BODY_TYPE = [ 'none', 'default', 'vector', 'default.vector',
		'vector.default' ];
topo.SEGMENT_TYPE = [ 'moveto', 'lineto', 'quadto', 'cubicto' ];
topo.CAP_TYPE = [ 'butt', 'round', 'square' ];
topo.JOIN_TYPE = [ 'miter', 'round', 'bevel' ];
topo.ORIENTATION_TYPE = [ 'top', 'left', 'bottom', 'right' ];
topo.SELECT_TYPE = [ 'none', 'shadow', 'border' ];
topo.ARROW_SHAPE_TYPE = [ 'arrow.standard', 'arrow.delta', 'arrow.diamond',
		'arrow.short', 'arrow.slant' ];

//  js Map
HashMap = function HashMap(){
    this.map = {};
};
HashMap.prototype = {
    put : function(key , value){
        this.map[key] = value;
    },
    get : function(key){
        if(this.map.hasOwnProperty(key)){
            return this.map[key];
        }
        return null;
    },
    remove : function(key){
        if(this.map.hasOwnProperty(key)){
            return delete this.map[key];
        }
        return false;
    },
    removeAll : function(){
        this.map = {};
    },
    keySet : function(){
        var _keys = [];
        for(var i in this.map){
            _keys.push(i);
        }
        return _keys;
    }
};

KeyValueObject = function KeyValueObject(){
    this.key = {};
    this.value = {};
};
KeyValueObject.prototype = {
    put : function(key , value){
        this.key = key;
        this.value = value;
    },
    getKey : function(){
        return this.key;
    },
    getValue : function() {
    	return this.value;
    }
};