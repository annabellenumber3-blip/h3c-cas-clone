RainBowTopo = function () {
	jQuery.i18n.properties({
		name : 'strings', //资源文件名称
		path : 'js/topo/i18n/', //资源文件路径
		mode : 'map', //用Map的方式使用资源文件中的值
		language : globalLang //index.jsp中根据后台locale判断的语言值
	});
	this.leftBox = new twaver.ElementBox();
	this.rightBox = new twaver.ElementBox();
	this.leftBox.getSelectionModel().setSelectionMode("singleSelection");
	this.rightBox.getSelectionModel().setSelectionMode("singleSelection");
    this.leftNetwork = new twaver.network.Network(this.leftBox);
	this.rightNetwork = new twaver.network.Network(this.rightBox);
    this.leftAutoLayouter = new twaver.layout.AutoLayouter(this.leftBox);
	this.rightAutoLayouter = new twaver.layout.AutoLayouter(this.rightBox);
    this.topDiv = document.createElement('div');
    this.cloudRainbowScope = null;
    this.cloudRainBows = [];
    this.vmDataArray = [];
    this.selectedCloud = null;
    this.leftSelectedCloud = null;
    this.leftMap = new HashMap();
    this.rightMap = new HashMap();
    this.rainbowframe = null;
    this.mode = 0;   // DESIGN :1 OVERVIEW:0
    this.mainSplitPanel = null;
    this.topoPanel = null;
    this.lastEvent = null;
    this.leftPopupMenu = new twaver.controls.PopupMenu(this.leftNetwork);
    this.rightPopupMenu = new twaver.controls.PopupMenu(this.rightNetwork);
    this.selectedVmId = null;
    this.rightSelectedVmId = null;
    this.cloudIndex = 0;
    this.carouselItems = [];
};

var CLOUDRESOURCE = 1;
var HOSTPOOL = 2;
var CLUSTER = 3;
var HOST = 4;
var VM = 5;

twaver.Util.ext('RainBowTopo', Object, {
	init: function () {
		this.leftAutoLayouter.setAnimate(false);
		this.leftAutoLayouter.isMovable = function (element) {
			if (element && element.getClassName() == 'twaver.Node' && element.getClient("hasDesigned")) {
				return false;
			}
			return true;
		};
		this.rightAutoLayouter.setAnimate(false);
		this.rightAutoLayouter.setExplicitXOffset(100);
		this.rightAutoLayouter.isMovable = function (element) {
			if (element && element.getClassName() == 'twaver.Node' && element.getClient("hasDesigned")) {
				return false;
			}
			return true;
		};
		topo.Util.initRainbowImageResouce(this.leftNetwork);
		topo.Util.initRainbowImageResouce(this.rightNetwork);
		topo.Util.initAlarm(this.rightNetwork);
		topo.Util.initAlarm(this.leftNetwork);
		
		var mainSplitPanel = new twaver.controls.SplitPane(this.leftNetwork, this.rightNetwork, 'horizontal', 0.5);
		mainSplitPanel.setDividerWidth(0);
		mainSplitPanel.setDividerBackground('#FFFFFF');
		mainSplitPanel.setDividerDraggable(false);
		var splitDiv = mainSplitPanel.getDividerDiv();
		splitDiv.className = 'split-line';
		var appElement = window.document.querySelector('[ng-controller=CloudRainbowCtrl]');
		this.cloudRainbowScope = window.angular.element(appElement).scope();
		this.rootScope = getRootScope(this.cloudRainbowScope);
		
	    var main = document.getElementById('cloudRainbowMain');
	    var topoPanel = new twaver.controls.BorderPane(mainSplitPanel, this.createRainbowToolbar());
		topo.Util.appendChild(topoPanel.getView(), main, 0, 0, 0, 0);
		
		if (twaver.Util.isIE) {
        	this.leftNetwork.getView().style.background = 'url(./images/rainbow_background.png) no-repeat, white';
        	this.rightNetwork.getView().style.background = 'url(./images/rainbow_background.png) no-repeat, white';
        } else {
			this.leftNetwork.getView().style.setProperty('background', 'url(./images/rainbow_background.png) no-repeat, white', null);
			this.rightNetwork.getView().style.background = 'url(./images/rainbow_background.png) no-repeat, white';
        } 

		this.rainbowframe = window.$("#cloudRainbowMain");
		twaver.Styles.setStyle('select.style', 'border');
		$(document).bind("contextmenu", function (e) {
			return false;
		});

		var self = this;

		window.onresize = function (e) {
			self.resizePanel();
		};
		//修改问题单:201707240737 左侧导航收起后,分隔线没有调整位置
		var $scope = window.angular.element(appElement).scope();
		$scope.$on(constant.onNavClick, function(event, msg) {
		    self.resizePanel();
        });
		
		self.mainSplitPanel = mainSplitPanel;
		self.topoPanel = topoPanel;
		main.addEventListener('click', function (e) {
		    self.handleClickEventListener(e);
		}, true);
		this.leftNetwork.setMovableFunction(function (element) {
			if (element && element.getClassName() == 'twaver.Node') {
				return element.getClient('type') != CLOUDRESOURCE || self.mode == 1;
			} 
			return true; 
		});
		this.leftNetwork.getView().addEventListener('dragover', this.dropOverListener, false);
		this.leftNetwork.addInteractionListener(this.LiveMoveEventListener, this, false);
		this.leftNetwork.addInteractionListener(this.DoubleClickEventListener, this, false);
		this.leftNetwork.addInteractionListener(this.EventListener, this, true);
		this.initPopupMenu(this.leftNetwork, this.leftPopupMenu);
		
		this.rightNetwork.setMovableFunction(function (element) {
			if (element && element.getClassName() == 'twaver.Node') {
				return element.getClient('type') != CLOUDRESOURCE  || self.mode == 1;
			} 
			return true; 
		});
		this.rightNetwork.getView().addEventListener('dragover', this.dropOverListener, false);
		this.rightNetwork.addInteractionListener(this.LiveMoveEventListener, this, false);
		this.rightNetwork.addInteractionListener(this.DoubleClickEventListener, this, false);
		this.rightNetwork.addInteractionListener(this.EventListener, this, true);
		this.initPopupMenu(this.rightNetwork, this.rightPopupMenu);
		
		// 默认就是设计模式
		this.intoDesignMode();
		
		// 加载云资源列表数据 
		this.cloudRainbowScope.getPublicCloudList(function(cloudList){
			self.cloudRainBows.splice(0,self.cloudRainBows.length);
			// 连接数组
			self.cloudRainBows = self.cloudRainBows.concat(cloudList.data);
			var publicClouds = self.createRainBowBox(self.cloudRainBows);
			main.appendChild(publicClouds);
		});
		
		// 增加拖拽处理。 
		this.leftNetwork.getView().addEventListener('drop',  function (e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			var type = e.dataTransfer.getData("type");
			if(type){
				if(self.leftSelectedCloud){
					$("#"+self.leftSelectedCloud.id).parent(".carouselVm").removeClass("selected").removeClass("testleft");
				}
				self.leftSelectedCloud = {name:e.dataTransfer.getData("name"), id:e.dataTransfer.getData("cloudId")};
				self.leftBox.clear();
				self.leftMap.removeAll();
				self.cloudRainbowScope.queryPublicCloudDetail(e.dataTransfer.getData("cloudId"), self.layoutLocalCloud);
			}
			var text = e.dataTransfer.getData('from');
			if (!text) {
				return false;
			}
			var valid = self.processHost(e);
			if (valid) {
				self.cloudRainbowScope.migrateConfig(valid);
			}
			return false;
		}, false);
		this.rightNetwork.getView().addEventListener('drop',  function (e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			var type = e.dataTransfer.getData("type");
			if(type){
				if(self.selectedCloud){
					$("#"+self.selectedCloud.id).parent(".carouselVm").removeClass("selected").removeClass("testright");
				}
				self.selectedCloud = {name:e.dataTransfer.getData("name"), id:e.dataTransfer.getData("cloudId")};
				self.rightBox.clear();
				self.rightMap.removeAll();
				self.cloudRainbowScope.queryPublicCloudDetail(e.dataTransfer.getData("cloudId"), self.layoutRemoteCloud);
			}
			var text = e.dataTransfer.getData('from');
			if (!text) {
				return false;
			}
			var valid = self.processHost(e);
			if (valid) {
				self.cloudRainbowScope.migrateConfig(valid);
			}
			return false;
		}, false);
		
		// 增加右侧loading
		var loading = document.createElement("div");
		var loadingInnerHtml = '<div class="loading"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div></div>';
		if (twaver.Util.isFirefox) {
			loading.setAttribute('class', 'loading-background');
		} else {
			loading.className = 'loading-background';
		}
		loading.innerHTML += loadingInnerHtml;
		topo.Util.appendChild(loading, self.rightNetwork.getView(), 0, null, null, 0);
		$(".loading-background").hide();
		
		// 显示Tree
		setTimeout(function(){
			self.drag($(".carouselVm"));
			self.addSearchMenu();
//			self.initBox();
		},300);
		
	},
	drag:function(carouselVms){
		for(var i=0;i<carouselVms.length;i++){
			carouselVms[i].ondragstart = function(e){
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text", e.target.innerHTML);
				e.dataTransfer.setData("cloudId", e.target.getElementsByTagName("span")[0].getAttribute("id"));
				e.dataTransfer.setData("name", e.target.getElementsByTagName("span")[0].getAttribute("name"));
				e.dataTransfer.setData("type", "loadPublicCloud");
			}
		}
	},
	resizePanel : function () {
		var self = this;
		self.mainSplitPanel.invalidate();
		self.leftNetwork.invalidate();
		self.rightNetwork.invalidate();
		self.topoPanel.invalidate();
	},
	createRainbowToolbar : function() {
		var self = this;
		var toolbar = document.createElement('div');
		toolbar.style.background = '#ffffff';
		toolbar.style.lineHeight = '25px';
		topo.Util.addButton(toolbar, $.i18n.prop('savedesignTopo'), 'export', function() {
			// confirm
			self.cloudRainbowScope.confirmSaveDesign();
		});
		return toolbar;
	},
	intoDesignMode : function () {
		// 增加loading
		var self = this;
		self.leftNetwork.setDefaultInteractions();
		self.rightNetwork.setDefaultInteractions();
		self.mode = 1;
		self.leftNetwork.setToolTipEnabled(false);
		self.rightNetwork.setToolTipEnabled(false);
	},
	resetOverviewMode : function () {
		var self = this;
		self.leftNetwork.setPanInteractions();
		self.rightNetwork.setPanInteractions();
		self.leftNetwork.setToolTipEnabled(true);
		self.rightNetwork.setToolTipEnabled(true);
		self.rightBox.getSelectionModel().clearSelection();
		self.leftBox.getSelectionModel().clearSelection();
		self.mode = 0;
	},
	saveDesignData : function () {
		var self = this;
		var param = {};
		var items = [];
		// 左侧BOX
		self.leftBox.forEachByLayerReverse(function (element) {
			if (element && element.getClassName() == 'twaver.Node') {
				var item = {}; 
				item.locationX = element.getLocation().x;
				item.locationY = element.getLocation().y;
				item.type = element.getClient('type');
				if (item.type != CLOUDRESOURCE) {
					item.targetId = element.getClient('id');
				}else {
					item.targetId = element.getClient('publicCloudId');
				}
				item.publicCloudId = element.getClient('publicCloudId');
				items.push(item);
			}
		});
		// 右侧BOX
		self.rightBox.forEachByLayerReverse(function (element) {
			var width = (document.getElementById('cloudRainbowMain').offsetWidth)/2;
			if (element && element.getClassName() == 'twaver.Node') {
				var item = {}; 
				item.locationX = width -52- element.getLocation().x;
				item.locationY = element.getLocation().y;
				item.type = element.getClient('type');
				if (item.type != CLOUDRESOURCE) {
					item.targetId = element.getClient('id');
				} else {
					item.targetId = element.getClient('publicCloudId');
				}
				item.publicCloudId = element.getClient('publicCloudId');
				items.push(item);
			}
		});
		param.data = items;
		return param;
	},
	loadPublicCloudData : function (item) {	
		//重新加载右上角数据
		var self = this;
		if (item && item.flag == 0) {
			self.cloudRainbowScope.queryPublicCloudDetail(0, self.layoutLocalCloud);
		} else {
			self.cloudRainbowScope.getPublicCloudList(function(cloudList){
				$(".rainbow-show").remove();
				self.cloudRainBows.splice(0,self.cloudRainBows.length);
				// 连接数组
				self.cloudRainBows = self.cloudRainBows.concat(cloudList.data);
				var publicClouds = self.createRainBowBox(self.cloudRainBows);
				
				var main = document.getElementById('cloudRainbowMain');
				main.appendChild(publicClouds);
				
				// 删除只有本地的时候进行该项的加载
				if (cloudList && cloudList.state == 0 && cloudList.data.length == 0) {
					self.cloudRainbowScope.queryPublicCloudDetail(0, self.layoutLocalCloud);
					self.rightBox.clear();
					self.rightMap.removeAll();
					$(".loading-background").hide();
				} 
				
				// 删除后刷新右侧节点
				if ((item && item.flag == 2) || (cloudList && cloudList.state == 0 && cloudList.data.length >= 1)) {
					$(".loading-background").show();
					self.rightBox.clear();
					self.rightMap.removeAll();
					var cloudId;
					if (item && item.id) {
						cloudId = item.id;
					} else {
						cloudId = cloudList.data[0].id;
					}
					self.cloudRainbowScope.queryPublicCloudDetail(cloudId, self.layoutRemoteCloud);
				}
			});
		}
	},
	dropOverListener : function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		e.dataTransfer.dropEffect = 'move';
		return false;
	},
	addHostVm : function (element, event, selectedVm) {
		var type = element.getClient('type');
		var name = element.getClient('name');
		var id = element.getClient('id');
		var hostStatus = element.getClient('status');
		var from = element.getClient('from');
		var publicCloudId = element.getClient('publicCloudId');
		// 创建新的DIV
		this.topDiv = document.createElement('div');
		this.topDiv.addEventListener('click', function (e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return false;
		}, false);
		$(this.topDiv).attr('name', 'popOverDiv');
		$(this.topDiv).addClass("hostVm");
		
		
		var dataArr = [];
		var vmArray = [];
		this.vmDataArray = [];
		if (from == 'left') {
			var hostVms = this.leftMap.get(id);
			if (hostVms && hostVms.children) {
				vmArray = vmArray.concat(hostVms.children);
			}
		} else {
			var hostVms = this.rightMap.get(id);
			if (hostVms && hostVms.children) {
				vmArray = vmArray.concat(hostVms.children);
			}
		}
		if (vmArray.length > 0) {
			for (var i = 0; i < vmArray.length; i++) {
				// add Image  Get Server Vm Data
				var data = {};
				data.id = vmArray[i].id;
				data.name = vmArray[i].name;
				data.hostId = id;
				data.hostName = name;
				data.publicCloudId = publicCloudId;
				data.status = vmArray[i].status;
				data.haStatus = vmArray[i].haStatus;
				data.type = vmArray[i].type;
				if (selectedVm && data.id == selectedVm.id) {
					data.selected = true;
				}
				// 缓存数据，已备刷新使用
				this.vmDataArray.push(data);
				dataArr.push(this.createVmPopDiv(this.vmDataArray[i], VM, from));
			}
			var self = this;
			var res = self.roundLayout(dataArr, 65, 50);
			var minLeft = 0;
			var minTop = 0;
			var height = self.rainbowframe.height()+400;
			var width = self.rainbowframe.width();
			var offsetTop =  self.rainbowframe[0].offsetTop;
			var offsetLeft =  self.rainbowframe[0].offsetLeft;
			var top,left,hostTop,hostLeft,bottom, right;
			if (event) {
				top = event.clientY - res.height / 2 - offsetTop;
				left = event.clientX -  res.width / 2 - offsetLeft;
				hostTop =  res.height / 2 - 25;
				hostLeft = res.width / 2 - 25;
				bottom = event.clientY +  res.height / 2 - offsetTop;
				right = event.clientX +  res.width / 2 - offsetLeft;
			} else {
				top = element.getLocation().y - res.height / 2;
				left = element.getLocation().x - res.width / 2;
				hostTop =  res.height / 2 - 25;
				hostLeft = res.width / 2 - 25;
				bottom = element.getLocation().y +  res.height / 2;
				right = element.getLocation().x +  res.width / 2;
			}
			if (top < 20) {
				top = 20;
			}
			if (left < 20) {
				left = 20;
			}
			if (bottom > height) {
				top = height - res.height;
			}
			if (right > width) {
				left = width - res.width;
			}
			if (from != 'left' && !event) {
				left = left + this.rightNetwork.getView().offsetLeft;
			}
			$.each(res.data, function(i,val) {
				val.style.left = val.x + 'px';
				val.style.top = val.y + 'px';
				self.topDiv.appendChild(val);
			});
			this.topDiv.style.width = res.width + 'px';
			this.topDiv.style.height = res.height + 'px';
			
			var hostImage = this.createVmPopDiv({name:name, status:hostStatus, type:HOST}, HOST);
			topo.Util.appendChild(hostImage, this.topDiv, hostTop, null, null, hostLeft);
			topo.Util.appendChild(this.topDiv, document.getElementById('cloudRainbowMain'), top, null, null, left);
			setTimeout(function(){
				$(self.topDiv).addClass("active");
			},200);
			$(this.topDiv).show();
			// 隐藏tooltip   _twaver.popup.hideToolTip();
			$("div#test").remove();
		}
	},
	LiveMoveEventListener : function (e) {
		if (e.kind === 'liveMoveStart') {
			this.lastEvent = 'liveMoveStart';
		} 
		// 阻止事件上传
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return false;
	},
	DoubleClickEventListener : function (e) {
		if (e.kind === 'doubleClickElement') {
			this.lastEvent = 'doubleClickElement';
		} 
		// 阻止事件上传
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return false;
	},
	EventListener : function (e) {
		if ((e.kind === 'clickElement') && e.element && e.element.getClassName() == 'twaver.Node') {
			var self = this;
			this.lastEvent = e.kind;
			
			// 删除不活动对象
			this.handleClickEventListener(e);
			var left = e.element.getClient('from');
			var type = e.element.getClient('type');
			if (type == HOSTPOOL) {
				return;
			}
			if (left) {
				if (left == 'left') {
					this.rightBox.getSelectionModel().clearSelection();
				} else {
					this.leftBox.getSelectionModel().clearSelection();
				}
			}
			
			// 设置tooltip
			this.controlTooltip(e);
			// 阻止事件上传
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return false;
		} else {
			var dialog = document.getElementById("test");
			if (dialog) {
				dialog.style.display = 'none';
				$(dialog).remove();
			}
		}
	},
	controlTooltip : function (e, data) {
		var self = this;
		var type,id,left,from,hostMenu;
		if (e && e.element && e.element instanceof twaver.Node) {
			type = e.element.getClient('type');
			id = e.element.getClient('id');
			from = e.element.getClient('from');
		} else if (e && e instanceof twaver.Node) {
			type = e.getClient('type');
			id = e.getClient('id');
			from = e.getClient('from');
		} else {
			if (!data) {
				return;
			}
			type = data.type;
			id = data.id;
			from = data.from;
		}
		if (data) {
			hostMenu = data.hostMenu;
		}
		
		// 增加主机的虚拟机
		setTimeout(function(){
			if (self.lastEvent && (self.lastEvent === 'clickElement')) {
				setTimeout(function(){
					if (self.lastEvent && (self.lastEvent != 'doubleClickElement')) {
						var elementData = e.element;
						if (elementData) {
							self.showDialog(e, elementData, type, id, from);
						} else if (data) {
							self.showDialog(e, data, type, id, from);
						}
					}
				},100);
				return;
			}
			
			if (self.lastEvent && (self.lastEvent === 'doubleClickElement')) {
				if (e && e.element && e.element instanceof twaver.Node) {
					if (type == HOST) {
						self.addHostVm(e.element, e.event);
					}
				} else  {
					setTimeout(function(){
						self.showDialog(e, data, type, id, from);
					},100);
				}
				return;
			}
			
			if (hostMenu || !self.lastEvent) {
				if (type == HOST) {
					setTimeout(function(){
						self.addHostVm(e, null);
					},100);
				}
				if (type == VM) {
					setTimeout(function(){
						self.showDialog(e, data, type, id, from);
					},100);
				}
				return;
			}
			
		},200);
	},
	showDialog: function (e, elementData, type, id, from) {
		if (!elementData) {
			return;
		}
		var self = this;
		var dialog = document.getElementById("test");
		if (dialog) {
			dialog.style.display = 'none';
			$(dialog).remove();
		}
		var dialog = topo.Util.initRainbowToolTip(elementData);
		// 组装操作
		if (from) {
			var ul = $(dialog).find("ul.tip-items");
			var status = -1;
			if (elementData && elementData instanceof Object) {
				status = elementData.status;
			} else if (elementData && elementData instanceof twaver.Node){
				status = elementData.getClient('status');
			}
			var btnList = self.createRainbowButton(type, elementData, status);
			btnList && ul.append(btnList);
		}
		
		if (!dialog) {
			return;
		}
		var s = dialog.style;
        s.display = 'block';    
		s.position = 'absolute';
		s.zIndex = '1000';
		var offsetTop =  self.rainbowframe[0].offsetTop;
		var offsetLeft =  self.rainbowframe[0].offsetLeft;
		var height = self.rainbowframe.height();
		var width = self.rainbowframe.width();
		
		$.when($('#cloudRainbowMain').append(dialog)).then(function(){
			var dialogHeight = dialog.clientHeight;
			var dialogWidth = dialog.clientWidth;
			var left,right,top,bottom;
			
			if (e && e instanceof twaver.Node) {
				left = e.getLocation().x + 20 - offsetLeft;
				top = e.getLocation().y + 20 - offsetTop;
			} else if (e && e.event) {
				left = e.event.clientX + 20 - offsetLeft;
				top = e.event.clientY  + 20 - offsetTop;
			} else {
				left = e.clientX + 20 - offsetLeft;
				top = e.clientY  + 20 - offsetTop;
			}
			
			bottom = top + dialogHeight;
			right = left + dialogWidth;
			if (bottom > height) {
				top = height - dialogHeight;
			}
			if (right > width) {
				left = width - dialogWidth;
			}
			
			s.left = left +'px';
			s.top = top +'px';
		});
	},
	createRainbowButton: function (type, elementData, status) {
		var self = this;
		var id = elementData.id;
    	var li = document.createElement('li');
    	switch (type) {
			case CLOUDRESOURCE : {
				if (self.cloudRainbowScope.hasPermission('PUBLIC_CLOUD_EDIT')) {
					var btn1 = document.createElement('div');
					btn1.setAttribute('class', 'tip-item-btn');
					btn1.style.width="100px";
					btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.viewCloud')));
					btn1.addEventListener('click', function (e) {
						if (id == 0) {
							self.cloudRainbowScope.modifyLocalCloud(self.loadPublicCloudData);
						} else {
							self.cloudRainbowScope.modifyPublicCloud(id, self.loadPublicCloudData);
						}
					});
					li.appendChild(btn1);
				} else {
					li = null;
				}
				break;
			};
			case CLUSTER : {
				var btn1 = document.createElement('div');
				btn1.setAttribute('class', 'tip-item-btn');
				btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.operatCluster')));
				btn1.addEventListener('click', function (e) {
						//TODO  操作集群
				});
				//li.appendChild(btn1);
				break;
			};
			case HOST : {
				var btn1 = document.createElement('div');
				btn1.setAttribute('class', 'tip-item-btn');
				btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.operatHost')));
				btn1.addEventListener('click', function (e) {
						//TODO  操作主机
				});
				//li.appendChild(btn1);
				break;
			};
			case VM : {
				var btnArray = [];
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_START')) {
					var btn1 = document.createElement('div');
					btn1.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 3)) {
						btn1.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					btn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.startVm')));
					btn1.addEventListener('click', function (e) {
						var type = "start";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
					});
					btnArray.push(btn1);
				}
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_SHUTDOWN')) {
					var btn2 = document.createElement('div');
					btn2.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2)) {
						btn2.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					btn2.appendChild(document.createTextNode($.i18n.prop('rainbow.button.closeVm')));
					btn2.addEventListener('click', function (e) {
						var type = "shutdown";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
					});
					btnArray.push(btn2);
				}
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_CLOSE')) {
					var btn3 = document.createElement('div');
					btn3.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2) && (status != 4)) {
						btn3.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					btn3.appendChild(document.createTextNode($.i18n.prop('rainbow.button.shutdownVm')));
					btn3.addEventListener('click', function (e) {
						var type = "close";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
					});
					btnArray.push(btn3);
				}
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_PAUSE')) {
					var moreBtn1 = document.createElement('div');
					moreBtn1.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2)) {
						moreBtn1.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					moreBtn1.appendChild(document.createTextNode($.i18n.prop('rainbow.button.pauseVm')));
					moreBtn1.addEventListener('click', function (e) {
						var type = "pause";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
					});
					btnArray.push(moreBtn1);
				}
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_RESTORE')) {
					var moreBtn2 = document.createElement('div');
					moreBtn2.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 4)) {
						moreBtn2.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					moreBtn2.appendChild(document.createTextNode($.i18n.prop('rainbow.button.restoreVm')));
					moreBtn2.addEventListener('click', function (e) {
						var type = "restore";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
					});
					btnArray.push(moreBtn2);
				}
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_SLEEP')) {
					var moreBtn3 = document.createElement('div');
					moreBtn3.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2) && (status != 4)) {
						moreBtn3.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					moreBtn3.appendChild(document.createTextNode($.i18n.prop('rainbow.button.sleepVm')));
					moreBtn3.addEventListener('click', function (e) {
						var type = "sleep";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
					});
					btnArray.push(moreBtn3);
				}
				
				if(self.cloudRainbowScope.hasPermission('VIRT_HOST_RESTART')) {
					var moreBtn4 = document.createElement('div');
					moreBtn4.setAttribute('class', 'tip-item-btn');
					/** 1:未知 2:运行 3:关闭 4 暂停。 */
					if (status && (status != 2) && (status != 4)) {
						moreBtn4.setAttribute('class', 'tip-item-btn btn-forbidden');
					}
					moreBtn4.appendChild(document.createTextNode($.i18n.prop('rainbow.button.restartVm')));
					moreBtn4.addEventListener('click', function (e) {
						var type = "restart";
						if ($(this).hasClass("btn-forbidden")) {
							return;
						}
						self.cloudRainbowScope.operatVm(type, elementData);
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
			}
    	}
    	return li;
    },
	handleClickEventListener : function (e, data) {
		var self = this;
		if (e.target && $(e.target).parents(".vm") && $(e.target).parents(".vm").length > 0) {  // 虚拟机界面显示。
			$(".vm").removeClass("selectedVm");
			if ($(e.target).parents(".vm")) {
				$(e.target).parents(".vm").addClass("selectedVm");
			}
			self.controlTooltip(e, data);
		} else if (e.target && $(e.target).hasClass("hostVm") && $(e.target).hasClass("active")) {  // 虚拟机界面显示。
			$("div#test").remove();
			return false;
		} else if (e.target && ($(e.target).hasClass("tipDiv")|| $(e.target).parents(".tipDiv") && $(e.target).parents(".tipDiv").length > 0)) {  // 虚拟机界面显示。
			return false;
		} else {
			var isExist = false;
			var main = document.getElementById('cloudRainbowMain');
			for (var i = 0; i< main.childNodes.length; i++) {
				if ($(main.childNodes[i]).hasClass('active')) {
					isExist = true;
				}
			}
			if (isExist) {
				var selector = "div[name='popOverDiv']";
				var oldDiv = $(selector);
				oldDiv.removeClass("active");
				setTimeout(function(){
					oldDiv.hide();
					$("#cloudRainbowMain").children(selector).remove();
				},300);
			}
		}
		
		// 处理右侧及顶端搜索事件
		if (e.target) {
			var target = $(e.target);
			if (target.hasClass("carousel-ctrl")) {
				if ($("#myCarousel").hasClass("carousel-hide")) {  //数据中心carous显示
					target.removeClass("carousel-ctrl-show");
					self.refreshPublicCloud();
					$("#myCarousel").removeClass("carousel-hide");
				} else {
					$("#myCarousel").addClass("carousel-hide");
					target.addClass("carousel-ctrl-show");
				}
				return;
			}  else if(target.hasClass("carousel-control") && target.hasClass("right")) {
				if(self.carouselItems.length<=6){
					return;
				}
				var selectedClouds = $(".carouselVm.selected");
				$("#selectedCarousel").append($(".carouselVm.selected"));
				$(".carouselVm:not(.selected)").remove();
				var index = self.cloudIndex;
				var length = self.carouselItems.length;
				if(index > length){
					index = 0;
				}
				var lineNum = 6 - $(".selected").length;
				var lastIndex = Math.min(lineNum + index - 1 , length)
				for(var i = 0; i<lineNum ; i++){
					if(index > length-1){
						index = 0;
					}
					var cloudId =  $(self.carouselItems[index]).attr("cloudId");
					if(self.checkIsRepeat(selectedClouds,cloudId)){
						i--;
						index++;
						continue;
					}
					$(".item.active").eq(0).append(self.carouselItems[index]);
					index++;
				}
				self.cloudIndex = index;
				self.drag($(".active.item .carouselVm"));
				$("#myCarousel").removeClass("carousel-hide");
			}else if(target.hasClass("carousel-control") && target.hasClass("left")){
				if(self.carouselItems.length <= 6){
					return;
				}
				var selectedClouds = $(".carouselVm.selected");
				var carouselIndex = Number($(".active.item .carouselVm").eq(0).attr("index"));
				var lineNum = 6 - $(".selected").length;
				var index = carouselIndex - 1;
				$("#selectedCarousel").append($(".carouselVm.selected"));
				$(".carouselVm:not(.selected)").remove();
				self.cloudIndex = index;
				var carouselList = [];
				var length = self.carouselItems.length;
				for(var i = 0; i<lineNum; i++){
					if(index < 0){
						index = length-1;
					}
					var cloudId =  $(self.carouselItems[index]).attr("cloudId");
					if(self.checkIsRepeat(selectedClouds,cloudId)){
						i--;
						index--;
						continue;
					}
					carouselList.push(self.carouselItems[index]);
					index--;
				}
				for(var i = carouselList.length-1 ;i >= 0;i--){
					$(".item.active").eq(0).append(carouselList[i]);
				}
				self.drag($(".active.item .carouselVm"));
			}
		}
	},
	refreshPublicCloud:function(){
		var self = this;
		this.cloudRainbowScope.getPublicCloudList(function(cloudList){
			self.cloudRainBows.splice(0,self.cloudRainBows.length);
			self.carouselItems.splice(0,self.carouselItems.length);
			self.cloudIndex = 0;
			self.cloudRainBows = self.cloudRainBows.concat(cloudList.data);
			$("#selectedCarousel").append($(".carouselVm.selected"));
			$(".carouselVm:not(.selected)").remove();
			var carouselItem = $(".item.active").eq(0);
			var selectedClouds = $(".carouselVm.selected");
			var lineNum = 6 - selectedClouds.length;
			var index = 0;
			for (index = 0; index < self.cloudRainBows.length ; index ++) {
				var cloudData = self.cloudRainBows[index];
				var image = document.createElement("span");
                if (self.rootScope.uiConfig.copyrightFrom == constant.unis) {
                    image.className = "selectPublicCloud_unis";
                } else if (self.rootScope.uiConfig.copyrightFrom != constant.casic) {
					image.className = "selectPublicCloud";
				} else {
					image.className = 'selectPublicCloud2';
				}
				image.setAttribute("id", cloudData.id);
				image.setAttribute("name", cloudData.name);
				var vmImageDiv = document.createElement("div");
				vmImageDiv.setAttribute("cloudId",cloudData.id);
				vmImageDiv.setAttribute("index",index);
				vmImageDiv.appendChild(image);
				var vmTitleDiv = document.createElement("div");
				if (twaver.Util.isFirefox) {
					vmImageDiv.setAttribute('class', 'carouselVm');
					vmTitleDiv.setAttribute('class', 'carouselVmTitle');
					vmTitleDiv.textContent = cloudData.name;
					vmTitleDiv.setAttribute('title', cloudData.name);
				} else {
					vmImageDiv.className = "carouselVm";
					vmTitleDiv.className = 'carouselVmTitle';
					vmTitleDiv.innerText = cloudData.name;
					vmTitleDiv.title = cloudData.name;
				}
				vmImageDiv.appendChild(vmTitleDiv);
				vmImageDiv.setAttribute("draggable","true");
				self.carouselItems.push(vmImageDiv)			
				if(lineNum>0){
					if(self.checkIsRepeat(selectedClouds,cloudData.id)){
						continue;
					}
					carouselItem.append(vmImageDiv);
					self.cloudIndex = index+1;
					lineNum--;
				}
			}
			self.drag($(".active.item .carouselVm"));
		});
	},
	checkIsRepeat:function(data,cloudId){
		for(var i=0;i<data.length;i++){
			if(cloudId == data.eq(i).attr("cloudId")){
				return true;
			}
		}
		return false;
	},
	createVmPopDiv : function (data, type, left) {
		var image = new Image();
		image.setAttribute('title', data.name);
		image.setAttribute('draggable', 'true');
		image.className = "vmImg";
		var self = this;
		var svgImg = topo.Util.getImageByType(data);
		if (type == VM) {
			image.style.cursor = 'move';
			image.setAttribute('domainId', data.id);
			image.setAttribute('src', './images/16/'+svgImg+'.svg');
			image.addEventListener('dragstart', function (e) {
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('from', left);
				e.dataTransfer.setData('cloudId', data.publicCloudId);
				e.dataTransfer.setData('domainId', data.id);
				e.dataTransfer.setData('domainName', data.name);
				e.dataTransfer.setData('hostName', data.hostName);
			}, false, this);
			image.addEventListener('click', function (e) {
				data.type = type;
				data.from = left;
				self.handleClickEventListener(e, data);
			}, false, self);
		} else {
			image.setAttribute('src', './images/16/'+svgImg+'.svg');
//			image.addEventListener('click', function (e) {
//				data.type = type;
//				data.from = left;
//				self.handleClickEventListener(e, data);
//			}, false, self);

			image.addEventListener('dragstart', function (e) {
				e.dataTransfer.effectAllowed = 'none';
				return false;
			}, false, self);
		}
		var vmImageDiv = document.createElement("div");
		vmImageDiv.appendChild(image);
		var vmTitleDiv = document.createElement("div");
		var vmDiv = document.createElement("div");
		if (twaver.Util.isFirefox) {
			vmTitleDiv.setAttribute('class', 'vmTitle');
			vmTitleDiv.textContent = data.name;
			vmDiv.setAttribute('class', 'vm');
			if (data.selected) {
				vmDiv.setAttribute('class', 'vm selectedVm');
			}
		} else {
			vmTitleDiv.innerText = data.name;
			vmTitleDiv.className = 'vmTitle';
			vmDiv.className = 'vm';
			if (data.selected) {
				vmDiv.className = 'vm selectedVm';
			}
		}
		vmDiv.appendChild(vmImageDiv);
		vmDiv.appendChild(vmTitleDiv);
		return vmDiv;
	},
	initPopupMenu: function (network, popupMenu) {
        var lastData, lastPoint, magnifyInteraction,lastEvent;
        var self = this;
        popupMenu.onMenuShowing = function (e) {
            lastData = network.getSelectionModel().getLastData();
            lastPoint = network.getLogicalPoint(e);
            lastEvent = e;
            magnifyInteraction = null;
            network.getInteractions().forEach(function (interaction) {
                if (interaction instanceof twaver.network.interaction.MagnifyInteraction
                    || interaction instanceof twaver.canvas.interaction.MagnifyInteraction) {
                    magnifyInteraction = interaction;
                }
            });
            return true;
        };
        popupMenu.onAction = function (menuItem) {
            if (menuItem.label === $.i18n.prop('rainbow.button.hostDetail')) {
            	if (lastData) {
            		self.lastEvent = null;
            		var data = {}
            		data.type = lastData.getClient("type");
            		data.id = lastData.getClient("id");
            		data.from = lastData.getClient("from");
            		data.publicCloudId = lastData.getClient("publicCloudId");
            		data.name = lastData.getClient("name");
            		data.status = lastData.getClient("status");
            		data.hostMenu = true;
            		self.controlTooltip(lastData, data);
            	}
            }
        };
        popupMenu.isVisible = function (menuItem) {
            if (magnifyInteraction) {
                return menuItem.group === 'Magnify';
            } else {
                if (lastData) {
                	if (lastData instanceof twaver.Group) {
                		return false;
                	}
                    if (lastData instanceof twaver.Node) {
                    	var type = lastData.getClient("type");
                    	if (type && type == HOST) {
                    		return true;
                    	} else {
                    		return false;
                    	}
                    }
                }
            }
        };
        popupMenu.isEnabled = function (menuItem) {
            return true;
        };
        popupMenu.setMenuItems([
            { label: $.i18n.prop('rainbow.button.hostDetail'), group: 'Element' ,icon: 'css/img/fuhao_18x18.svg'}
        ]);
        popupMenu.setBackground("white");
        popupMenu.setBorder("1px outset rgb(173, 173, 173)");
        popupMenu.setWidth(150);
    },
	processHost: function (event) {
		var pointLeft = this.leftNetwork.getLogicalPoint(event);
		var pointRight = this.rightNetwork.getLogicalPoint(event);
		var isLeft = this.judgeLeft(pointLeft, pointRight);
		var point, destBox,destNetwork;
		var fromLeft = event.dataTransfer.getData("from") == 'left'? true : false;
		if (fromLeft == isLeft) {
			return;
		}
		if (isLeft) {
			point = pointLeft;
			destBox = this.leftBox;
			destNetwork = this.leftNetwork;
		} else {
			point = pointRight;
			destBox = this.rightBox;
			destNetwork = this.rightNetwork;
		}
		var destNode;
		destBox.forEachByLayerReverse(function (element) {
			if (!destNetwork.isVisible(element)) {
				return true;
			}
			if (element instanceof Node && twaver.Util.containsPoint(element.getRect(), point)) {
				var type = element.getClient('type');
				if (type == HOST) {
					destNode = element;
				}
				return false;
			}
		}, null, this);
		
		if (!destNode) {
			return;
		}
		
		var publicCloudId = event.dataTransfer.getData("cloudId");
		var domainId = event.dataTransfer.getData("domainId");
		var domainName = event.dataTransfer.getData("domainName");
		var hostName = event.dataTransfer.getData("hostName");
		var entry = {};
		entry.dstCloudId = destNode.getClient('publicCloudId');
		entry.destHostId = destNode.getClient('id');
		entry.destHostName = destNode.getClient('name');
		entry.srcCloudId = publicCloudId;
		entry.domainId = domainId;
		entry.sourceHostName = hostName;
		entry.domainName =  domainName;
		return entry;
	},
	judgeLeft : function (pointLeft, pointRight) {
		if (pointLeft.x > 0 && pointRight.x >= 0) {
			return false;
		}
		if (pointLeft.x > 0 && pointRight.x < 0) {
			return true;
		}
	},
	createDcTitle : function (name) {
		var dcTitle = document.createElement("div");
		dcTitle.className = "dcTitle";
		dcTitle.innerText = name;
		return dcTitle;
	},
	createRainBowBox: function (data) {
		var carouselCtrl = document.createElement("div");
		carouselCtrl.className = "rainbow-show";
		var ctrlOutterDiv = document.createElement("div");
		ctrlOutterDiv.className = "carousel-outter";
		var ctrlDiv = document.createElement("span");
		ctrlDiv.className = "carousel-ctrl";
		ctrlOutterDiv.appendChild(ctrlDiv);
		var carousel = document.createElement("div");
		carousel.id  = "myCarousel";
		carousel.className = "carousel slide";
		carousel.setAttribute("data-interval", "false");
		var carouselInner = document.createElement("div");
		carouselInner.className  = "carousel-inner";
		var self = this;
		var lineNum = 6;  // 控制每列个数
		var selectedCarouselItems = document.createElement("div");
		selectedCarouselItems.setAttribute('id', 'selectedCarousel');
		carouselInner.appendChild(selectedCarouselItems);
		var carouselItem = document.createElement("div");
		carouselItem.className = "item active"
		var lastImageIndex = lineNum;
		var index;
		for (index = 0; index < data.length ; index ++) {
			var image = document.createElement("span");
            if (self.rootScope.uiConfig.copyrightFrom == constant.unis) {
                image.className = "selectPublicCloud_unis";
            } else if (self.rootScope.uiConfig.copyrightFrom != constant.casic) {
				image.className = "selectPublicCloud";
			} else {
				image.className = 'selectPublicCloud2';
			}
			var cloudData = data[index];
			image.setAttribute("id", cloudData.id);
			image.setAttribute("name", cloudData.name);
			var vmImageDiv = document.createElement("div");
			vmImageDiv.setAttribute("cloudId",cloudData.id);
			vmImageDiv.setAttribute("index",index);
			vmImageDiv.appendChild(image);
			var vmTitleDiv = document.createElement("div");
			if (twaver.Util.isFirefox) {
				vmImageDiv.setAttribute('class', 'carouselVm');
				vmTitleDiv.setAttribute('class', 'carouselVmTitle');
				vmTitleDiv.textContent = cloudData.name;
				vmTitleDiv.setAttribute('title', cloudData.name);
			} else {
				vmImageDiv.className = "carouselVm";
				vmTitleDiv.className = 'carouselVmTitle';
				vmTitleDiv.innerText = cloudData.name;
				vmTitleDiv.title = cloudData.name;
			}
			vmImageDiv.appendChild(vmTitleDiv);
			vmImageDiv.setAttribute("draggable","true");
			this.carouselItems.push(vmImageDiv)			
			if(index < lineNum){
				carouselItem.appendChild(vmImageDiv);
			}
		}
		this.cloudIndex = lineNum;
		carouselInner.appendChild(carouselItem);
	
		
		carousel.appendChild(carouselInner);
		var preDiv = '<span class="carousel-control left" >&lsaquo;</span>';
		var nextDiv = '<span class="carousel-control right" >&rsaquo;</span>';
		carousel.innerHTML += (preDiv + nextDiv);
				
		carouselCtrl.appendChild(ctrlOutterDiv);
		carouselCtrl.appendChild(carousel);
		return carouselCtrl;
	},
	gc: function () {
		this.box = null;
		this.leftBox = null;
		this.rightBox = null;
		this.network = null;
		this.leftAutoLayouter = null;
		this.rightAutoLayouter = null;
		this.toolbar = null;
	},
	createNode : function(data,layer,width) {
		var node = new twaver.Node();
		if (data && data.name) {
            node.setToolTip("<b>" + data.name + "</b>");
            node.setName(data.name);
		}
		
		var self = this;
		var image = null;
		if (data.type == 1) {
            if (self.rootScope.uiConfig.copyrightFrom == constant.unis) {
                image = 'caslogo_unis';
            } else if (self.rootScope.uiConfig.copyrightFrom != constant.casic) {
				image = 'casLogo';
			} else {
				image = 'spaceflight_favicon';
			}
			if (data.status && data.status == -1) {
				node.getAlarmState().setNewAlarmCount(twaver.AlarmSeverity.CRITICAL, 1);
			}
		} else {
			image = topo.Util.getImageByType(data);
		}
		if (image) {
            node.setImage(image);
		}
		if (data.locationX >= 0 && data.locationY >= 0) {
			if ("left" == layer) {
				node.setLocation(data.locationX, data.locationY);
			} else {
				node.setLocation(width-52-data.locationX, data.locationY);
			}
		}
        this.setClientValues(node, data);
		return node;
	},
    setClientValues : function (node, data) {
        node.setClient("type", data.type);
        node.setClient("id", data.id);
        node.setClient("name", data.name);
        node.setClient("status", data.status);
        node.setClient("hasDesigned", false);
        if (data.locationX > 0 || data.locationY > 0) {
        	 node.setClient("hasDesigned", true);
        }
    },
	createLink : function(from, to, layoutId) {
		var link = new twaver.Link(from, to);
		link.setStyle('link.width', 1);
		link.setStyle('link.color', '#00FF00');
		link.setStyle('link.type', 'arc');
		return link;
	},
	addHostVmMap: function (layer,data) {
		if (layer == 'left') {
			this.leftMap.put(data.id, data);
		} else {
			this.rightMap.put(data.id, data);
		}
		
	},
	analyJson: function (data,layer, box){
		if (data != null) {
			var boxWidth = (document.getElementById('cloudRainbowMain').offsetWidth)/2;
			var root = this.createNode(data,layer,boxWidth);
			root.setClient("publicCloudId", data.id);
			root.setClient("from", layer);
			box.add(root);
			if (data.children) {
				// 增加主机池
				var cloudNode = root;
				for (var pIndex = 0; pIndex < data.children.length; pIndex++) {
					var poolData = data.children[pIndex];
					var pDataNode = this.createNode(poolData,layer,boxWidth);
					pDataNode.setClient("publicCloudId", data.id);
					pDataNode.setClient("from", layer);
					box.add(pDataNode);
					var pLink = this.createLink(cloudNode, pDataNode);
					box.add(pLink);
					if (poolData.children) {
						// 增加集群
						var pFrom = pDataNode;
						for (var cIndex = 0; cIndex < poolData.children.length; cIndex++) {
							var clusterData = poolData.children[cIndex];
							var cDataNode = this.createNode(clusterData,layer,boxWidth);
							cDataNode.setClient("publicCloudId", data.id);
							cDataNode.setClient("from", layer);
							box.add(cDataNode);
							var cLink = this.createLink(pFrom, cDataNode);
							box.add(cLink);
							// 如果是主机下一层不展示
							if(clusterData.type == HOST) {
								cDataNode.setClient("from", layer);
								this.addHostVmMap(layer, clusterData);
								continue;
							}
							if (clusterData.children) {
								// 增加主机
								var cFrom = cDataNode;
								for (var hIndex = 0; hIndex < clusterData.children.length; hIndex++) {
									var hostData = clusterData.children[hIndex];
									var hDataNode = this.createNode(hostData,layer,boxWidth);
									hDataNode.setClient("from", layer);
									hDataNode.setClient("publicCloudId", data.id);
									box.add(hDataNode);
									var hLink = this.createLink(cFrom, hDataNode);
									box.add(hLink);
									this.addHostVmMap(layer, hostData);
								}
							}
						}
					}
				}
			}
			return root;
		}
	},
	addSearchMenu : function () {
		// 增加搜索框
		var self = this;
		var searchCtrl = document.createElement("div");
		searchCtrl.className="searchLeft";
		var searchNameCtrl =  document.createElement("input");
		searchNameCtrl.setAttribute("location", 'left');
		searchNameCtrl.type="text";
		searchNameCtrl.style.boxSizing = "border-box";
		searchNameCtrl.placeholder = $.i18n.prop('inputVmTitle');
		searchNameCtrl.style.position = 'relative';
		searchCtrl.appendChild(searchNameCtrl);
		document.getElementById('cloudRainbowMain').appendChild(searchCtrl);

		// 增加搜索框
		var searchRightCtrl = document.createElement("div");
		searchRightCtrl.className="searchRight";
		var searchRightNameCtrl =  document.createElement("input");
		searchRightNameCtrl.setAttribute("location", 'right');
		searchRightNameCtrl.type="text";
		searchRightNameCtrl.style.boxSizing = "border-box";
		searchRightNameCtrl.placeholder = $.i18n.prop('inputVmTitle');
		searchRightNameCtrl.style.position = 'relative';
		searchRightCtrl.appendChild(searchRightNameCtrl);
		document.getElementById('cloudRainbowMain').appendChild(searchRightCtrl);
		self.bindKeyDownListener(searchNameCtrl, searchRightNameCtrl);
	},
	bindKeyDownListener : function (searchNameCtrl, searchRightNameCtrl) {
		var self = this;
		var keyListener = function (event) {
            if(event.keyCode == "13") {
            	var target = $(event.target);
            	if (target.attr('type') == 'text') {
					var location = target.attr("location");
					var nodeName  = target.val();
					var vmId = null;
					if (!nodeName) {
						self.cloudRainbowScope.nodeNotExist();
						return false;
					}
					var destMap,selHostName,destNetwork,destBox,selectedVm;
					if (location == 'left') {
						vmId = self.selectedVmId;
						destMap = self.leftMap;
						destBox = self.leftBox;
						destNetwork = self.leftNetwork;
					} else {
						vmId = self.rightSelectedVmId;
						destMap = self.rightMap;
						destBox = self.rightBox;
						destNetwork = self.rightNetwork;
					}
//					if (vmId == null) {
//						self.cloudRainbowScope.nodeNotExist();
//						return false;
//					}
					$.each(destMap.keySet(), function (index, data) {
						var exist = false;
						var hostVm = destMap.get(data);
						if (hostVm && hostVm.children) {
							$.each(hostVm.children, function (vmIndex, vm) {
								if (nodeName == vm.name) {//&& vmId == vm.id
									if (vmId == null) {
										selHostName = hostVm.name;
										selectedVm = vm;
										exist = true;
									} else {
										if (vmId == vm.id) {
											selHostName = hostVm.name;
											selectedVm = vm;
											exist = true;
										}
									}
								}
								if (exist) {
									return false;
								}
							});
						}
						if (exist) {
							return false;
						}
					});
					if (!selHostName) {
						self.cloudRainbowScope.nodeNotExist();
						return false;
					}
					var nameFinder = new twaver.QuickFinder(destBox,"name");
					var data = nameFinder.findFirst(selHostName);
					if (data == null) {
						self.cloudRainbowScope.nodeNotExist();
					} else {
						destNetwork.makeVisible(data);
						
						var main = document.getElementById('cloudRainbowMain');
						var isExist = false;
						for (var i = 0; i< main.childNodes.length; i++) {
							if ($(main.childNodes[i]).hasClass('active')) {
								isExist = true;
							}
						}
						if (isExist) {
							var selector = "div[name='popOverDiv']";
							var oldDiv = $(selector);
							oldDiv.removeClass("active");
							setTimeout(function(){
								oldDiv.hide();
								$("#cloudRainbowMain").children(selector).remove();
								self.addHostVm(data, null, selectedVm);
							},300);
						} else {
							self.addHostVm(data, null, selectedVm);
						}
					}
				}
            }
		};
		$(searchNameCtrl).on('keypress', keyListener);
		$(searchRightNameCtrl).on('keypress', keyListener);
	},
	layoutLocalCloud : function (data) {
		var self = this;
		if (data && data.id) {
			self.leftBox.clear();
			self.leftMap.removeAll();
			self.analyJson(data, 'left',self.leftBox);
			self.leftAutoLayouter.doLayout('leftright');
		}else {
			data = {};
			data.status = -1;
			data.type = 1;
			data.name = self.leftSelectedCloud.name;
			data.id = self.leftSelectedCloud.id;
			self.leftBox.clear();
			self.leftMap.removeAll();
			self.analyJson(data, 'left',self.leftBox);
			self.leftAutoLayouter.doLayout('leftright');
		}
		if(self.selectedCloud){
			if((data && data.id == self.selectedCloud.id) || (self.selectedCloud.id == self.leftSelectedCloud.id)){
				self.rightBox.clear();
				self.rightMap.removeAll();
				self.selectedCloud = null;
			}
		}
		var destData = [];
		$.each(self.leftMap.keySet(), function (index, data) {
			var exist = false;
			var hostVm = self.leftMap.get(data);
			if (hostVm && hostVm.children) {
				$.each(hostVm.children, function (vmIndex, vm) {
					var sourceData = {};
					sourceData.label = vm.name;
					sourceData.value = vm.name;
					sourceData.vmId = vm.id;
					destData.push(sourceData);
				});
			}
		});
		
		$("#"+data.id).parent(".carouselVm").removeClass("testright").addClass("selected").addClass("testleft");
		$(".searchLeft>input").autocomplete({
			source : destData,
			select : function(event, ui) {
				self.selectedVmId = ui.item.vmId;
			}
		});
	},
	layoutRemoteCloud : function (data) {
		var self = this;
		$(".loading-background").hide();
		if (data && data.id) {
			self.rightBox.clear();
			self.rightMap.removeAll();
			self.analyJson(data, 'right',self.rightBox);
			self.rightAutoLayouter.doLayout('rightleft');
		} else {
			data = {};
			data.status = -1;
			data.type = 1;
			data.name = self.selectedCloud.name;
			data.id = self.selectedCloud.id;
			self.rightBox.clear();
			self.rightMap.removeAll();
			self.analyJson(data, 'right',self.rightBox);
			self.rightAutoLayouter.doLayout('rightleft');
		}
		if(self.leftSelectedCloud){
			if((data && data.id == self.leftSelectedCloud.id) || (self.selectedCloud.id == self.leftSelectedCloud.id)){
				self.leftBox.clear();
				self.leftMap.removeAll();
				self.leftSelectedCloud = null;
			}
		}
		var destData = [];
		$.each(self.rightMap.keySet(), function (index, data) {
			var exist = false;
			var hostVm = self.rightMap.get(data);
			if (hostVm && hostVm.children) {
				$.each(hostVm.children, function (vmIndex, vm) {
					var sourceData = {};
					sourceData.label = vm.name;
					sourceData.value = vm.name;
					sourceData.vmId = vm.id;
					destData.push(sourceData);
				});
			}
		});
		$("#"+data.id).parent(".carouselVm").removeClass("testleft").addClass("selected").addClass("testright");
		$(".searchRight>input").autocomplete({
				source: destData,
				select : function(event, ui) {
					self.rightSelectedVmId = ui.item.vmId;
				}
			});
	},
	refreshRainbow :function (cloudIds) {  // 待刷新的IDs
		var self = this;
		if (cloudIds) {
			$("div#test").remove();
			var selector = "div[name='popOverDiv']";
			var oldDiv = $(selector);
			oldDiv.removeClass("active");
			setTimeout(function(){
				oldDiv.hide();
				$("#cloudRainbowMain").children(selector).remove();
			},300);
			$.each(cloudIds, function(i, value){
				if (self.leftSelectedCloud.id && self.leftSelectedCloud.id == value) {
					self.leftBox.clear();
					self.leftMap.removeAll();
					self.cloudRainbowScope.queryPublicCloudDetail(value, self.layoutLocalCloud);
				} else if (self.selectedCloud && self.selectedCloud.id == value) {
					self.rightBox.clear();
					self.rightMap.removeAll();
					$(".loading-background").show();
					self.cloudRainbowScope.queryPublicCloudDetail(value, self.layoutRemoteCloud);
				}
			});
		} else {
			$(".loading-background").show();
			self.initBox();
		}
	},
	refreshVmData : function (stateParams) {
		var self = this;
		if (stateParams && stateParams.id && stateParams.status) {
			var status;
			if (stateParams.hostId) {
				var hostVm = self.leftMap.get(stateParams.hostId);
				if (hostVm && hostVm.children) {
					$.each(hostVm.children, function (vmIndex, vm) {
						if (vm && vm.id == stateParams.id) {
							status = vm.status;
							/** 1:未知 2:运行 3:关闭 4 暂停。 */
							if (stateParams.status == 'running') {
								status = 2;
			    		    } else if (stateParams.status == 'shutOff') {
			    		    	status = 3;
			    		    } else if (stateParams.status == 'paused') {
			    		    	status = 4;
			    		    } else if (stateParams.status == 'unknown') {
			    		    	status = 1;
			    		    }
							vm.status = status;
							return false;
						}
					});
				}
				if (this.vmDataArray) {
					for (var i = 0; i < this.vmDataArray.length; i++) {
						if ( this.vmDataArray[i].id &&  this.vmDataArray[i].id == stateParams.id) {
							 this.vmDataArray[i].status = status;
							 break;
						}
					}
				}
			}
			$("div#test").remove();
			var selector = "div[name='popOverDiv']";
			var hostVmDiv = $(selector);
			if (hostVmDiv && hostVmDiv.length > 0) {
				var status = stateParams.status;
				var svgImg = hostVmDiv.find("img[domainId='"+stateParams.id+"']").attr('src');
			    if (status == 'running') {
    		    	svgImg = "vm-running";
    		    	svgImg = './images/16/'+svgImg+'.svg';
    		    } else if (status == 'shutOff') {
    		    	svgImg = "vm-close";
    		    	svgImg = './images/16/'+svgImg+'.svg';
    		    } else if (status == 'paused') {
    		    	svgImg = "vm-pause";
    		    	svgImg = './images/16/'+svgImg+'.svg';
    		    } else if (status == 'unknown') {
    		    	svgImg = "vm-unkown";
    		    	svgImg = './images/16/'+svgImg+'.svg';
    		    }
			    if (svgImg) {
			    	hostVmDiv.find("img[domainId='"+stateParams.id+"']").attr('src', svgImg);
			    }
			}
		}
	},
	roundLayout : function (dataArray,circleR,nodeLength) {
		var length = dataArray.length;
		// 获取层数
		if (length == 0) {
			return;
		}
		var count = length;
		var r = 100;
		if (circleR) {
			r = circleR;
		}
		var rLength = 60;
		if (nodeLength) {
			rLength = nodeLength + 10;
		}
		var R = r;
		for (;count > 0;) {
			var round = 2 * Math.PI * R;
			var n = parseInt(round/60);
			count = count - n;
			if(count > 0) {
				R = R + rLength;
			}
		}
		var centerX = R + 10;
		var centerY = R + 10;
		var R = r;
		var count = length;
		var position = 0
		for (;count > 0;) {
			var round = 2 * Math.PI * R;
			var n = parseInt(round/60) > count ? count:parseInt(round/60);
			var end = position + n;
			var radius = 360/n;
			for (var i = position; i < end; i++) {
				var rad = (2*Math.PI / 360) * radius * (i-position);
				var x = centerX + Math.sin(rad) * R;
				var y = centerY - Math.cos(rad) * R;
				dataArray[i].x = x;
				dataArray[i].y = y;
			}
			count = count - n;
			if(count > 0) {
				R = R + rLength;
			}
			position = end;
		}
		var res = {};
		res.width = R * 2 + rLength + 10;
		res.height = R * 2 + rLength + 10;
		res.data = dataArray;
		return res;
	}
});