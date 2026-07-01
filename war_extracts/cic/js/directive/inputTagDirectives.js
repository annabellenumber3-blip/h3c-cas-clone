angular.module('ui.casTag.input',['ui.casTag.input.hasRightBtn','ui.casTag.input.selectInput','myTest']);

angular.module('ui.casTag.input.hasRightBtn',[])
.directive('hasRightBtn',function(){
	 return {
		    restrict:'A',
		    link:function(scope,element,attrs){
		    	element.find("input").bind('focus',function(){
		    		element.addClass('active');
		    	}).bind('blur',function(){
		    		element.removeClass('active');
		    	});
			},
		    replace: false
		  };
})
.controller('SlideController',['$scope','$http','$rootScope','$state','$timeout', '$compile','$translate','UtilService','HttpService','PermissionService', 
                               function($scope,$http,$rootScope,$state,$timeout,$compile,$translate,UtilService,HttpService,PermissionService){
	
	var self = this,
	links = self.links = $scope.links = [],
	$slidebar=self.$slidebar=$scope.$slidebar=$("#slidebar"),
	$treeviews= self.$treeviews = $scope.$treeviews=$("#treeviews"),
    currentIndex = 1;
    $scope.currentLink=self.currentLink = null;
    //取消左侧所有树节点的选中状态（因为云资源不属于treeiew的树节点，所以选择云资源时需要取消其他数据点的选中状态）
    self.unSelectAllNode = function() {
    	for (var i = 0; i < links.length; i++) {
			var linktem = links[i];
			var datatreeview = $('#'+linktem.target).data('treeview');
			if (angular.isObject(datatreeview)) {
				var selectedNode = datatreeview.getSelected();;
				if (selectedNode.length > 0) {
					$('#'+linktem.target).treeview('unselectNode',[selectedNode]);
				}
			}
		}
    };
    // 刷新或者访问时
    self.addLink = function(link, element) {
    	link.$element = element;
    	link.target = link.treeId;
    	link.$element.append("<div id=\""+link.target+"\" class=\"treeview nav-tree\"></div>");
    	links.push(link);
        if($state.includes("main."+link.href)) {
        	self.selectLink(link);
        } else if(links.length === 1) {
        	selectLink(link);
        } else{
        	self.closeLink(link);
        }
      };
      
    self.getSelectNode = function() {
    	var selectedNode = $('#'+link.target).data('treeview').getSelected();
    	return selectedNode;
    };
      
    self.selectLink = function(link, element){
    	 var nextIndex = links.indexOf(link);
    	 selectLink(links[nextIndex]);
    	 for (var int = 0; int < links.length; int++) {
			int!=nextIndex?self.closeLink(links[int]):null;
		 }
    };
    self.removeHoverEvent = function(){
    	for (var int = 0; int < links.length; int++) {
    		links[int].$element.unbind("mouseover");
		}
    };
    self.addHoverEvent = function(){
    	for (var int = 0; int < links.length; int++) {
    		var link = links[int];
    		links[int].$element.bind("mouseover",function(){
    			if($(this).hasClass("open") == false){
    				$(this).find(".fa.fa-angle-down").click();
					//左侧导航树收缩后，hover出现的导航树高度自动调整和滚动条出现
					adjustHoverTree();
    	    	}else{
    	    		$(this).children(".nav-tree").bind("mouseleave",function(){
    	    			if($(this).parent().hasClass("open") == true){
    	    				$(this).prev().find(".fa.fa-angle-down").click();
    	    				$(this).unbind("mouseleave");
    	    			}
    	    		});
    	    	}
			});
		}
    };
    //收缩所有树(左侧树收缩的时候使用)
    self.collapseAllTree = function() {
    	for (var int = 0; int < links.length; int++) {
    		var $ele = links[int].$element;
    		if($ele.attr("class").indexOf("open") > -1){
    			$ele.find(".fa.fa-angle-down").click();
	    	}
		}
    };
    // 根据scope出传入的信息，选择对应节点
    self.selectNode = function(link, msg) {
    	var tree = $('#'+link.target).data('treeview');
    	if (angular.isUndefined($('#'+link.target)) || !tree) {
    		return undefined;
    	}
    	
    	// 判断云资源是否展开,如果未展开则展开
    	var el = link.$element;
    	if(el.attr("class").indexOf("open") == -1) {
    		el.addClass('open');
	   		if($rootScope.transition == 0) {
	   			$('#'+link.target).show();
	   		}else{
	   		    $('#'+link.target).slideDown();
	   		}  		
    	}
    	var selectedNode = tree.getSelected();
    	// 先判断节点是否已经选中，如果已经选中则展示节点，如果未选中则选中后再展示
    	var selectId = getNodeId(selectedNode, msg.entryId, msg.entryType);
    	if (selectId != -1) {
    		// 已经选中
    		$('#'+link.target).treeview('revealNode', [ selectId, { silent: true } ]);
    		var selectedNode = $('#'+link.target).treeview('getNode', nodeId);
    		return selectedNode;
    	}
    	// 未选中
    	var unselectedNodes = tree.getUnselected();
    	var nodeId = getNodeId(unselectedNodes, msg.entryId, msg.entryType);    	
    	if (nodeId == -1) {
    		nodeId = getNodeIdByUrl(unselectedNodes, msg.url); 
    		if (nodeId == -1) {    			
    			return undefined;
    		}
    	};
    	//修改问题单：201605300134 解决双击drx中虚拟机，出现云资源和云业务同时展开的问题。
    	for (var int = 0; int < links.length; int++) {
    		var linktem = links[int];
    		if (linktem.target != link.target) {
    			if (linktem.$element.hasClass('open')) {
    				self.closeLink(linktem);
    			}
    		}
		}
    	// 先选中节点，再展示节点
    	$('#'+link.target).treeview('selectNode', [ nodeId, { silent: true } ]);
    	$('#'+link.target).treeview('revealNode', [ nodeId, { silent: true } ]);
    	
    	//修改问题单：201605200121 如果节点在显示位置之外则调整滚动条
    	var selectLi = null;
    	var liEleArr = $('#'+link.target).find('.list-group-item');
    	if (liEleArr) {
    	    for (var i = 0; i < liEleArr.length; i++) {
    	        var liEle = liEleArr[i];
    	        if (liEle.attributes && liEle.attributes['data-nodeid'] && liEle.attributes['data-nodeid'].nodeValue == nodeId) {
    	            selectLi = liEle;
    	            break;
    	        }
    	    }
    	}
    	var ADD_70 = 70;//计算li向下定位的差值
    	var ADD_50 = 50;//计算li向上定位的差值
    	if (selectLi && selectLi.offsetTop + ADD_70 > $('#treeDivId')[0].offsetHeight && 
    	        (selectLi.offsetTop - $('#treeDivId')[0].offsetHeight + ADD_70 > $('#treeDivId')[0].scrollTop || 
    	         selectLi.offsetTop + ADD_50 < $('#treeDivId')[0].scrollTop)) {
    	    $('#treeDivId').animate({scrollTop:(selectLi.offsetTop-$('#treeDivId')[0].offsetHeight)+80});
    	} else if (selectLi && selectLi.offsetTop + ADD_70 < $('#treeDivId')[0].offsetHeight && selectLi.offsetTop + ADD_50 < $('#treeDivId')[0].scrollTop) {
    	    $('#treeDivId').animate({scrollTop:0});
    	}
    	
    	var node = $('#'+link.target).treeview('getNode', nodeId);
    	return node;
    };
    //entryType属性对应的节点类型常量
    self.HOSTPOOL_TYPE = 'hostpool';
    self.CLUSTER_TYPE = 'cluster';
    self.HOST_TYPE = 'host';
    self.VM_TYPE = 'vm';
    //ctreat tree data
    ctreatTreeData = function(data, levels) {
    	var level = 2;
    	if (angular.isDefined(levels)) {
    		level = levels;
    	}
    	var options = {
    			 data: data,
				 enableLinks:false,// 设置<a>标记的超链接无效
				 levels : level,
				 onNodeSelected:function(event, data) {
					 // 去除选中格式（类似云资源这种节点的选中格式）
					 $("a.link.treeSelectColor").removeClass("treeSelectColor");
					 // 当节点被选中后跳转到相应的页签
					 var url = data.stateUrl;
					 var params = data.stateParams;
					 $state.go(url, params);
					 //deal bug when tab is not dashboard to click node. dashboard tab will not active
					 $rootScope.$broadcast('onActiveTab', {href: '.dashboard'});
					 if (data.entryType == 'vmView_dir') {
						 //when vm wiew, if it was current page ,refesh vmView
						 var interval = setInterval(function() {
	                            var pageViewTree = $('#vmViewPageTree').data('treeview');
	                            if (pageViewTree != null) {
	                                var msg = {};
	                                msg.id = data.id;
	                                msg.text = data.text;
	                                if (data.id == -1) {
	                                    msg.icon = 'icon-vm-view-gray';
	                                } else {
	                                    msg.icon = data.icon + '-gray';
	                                }	                                
	                                msg.entryId = data.entryId;
	                                msg.entryType = data.entryType;
	                                $rootScope.$broadcast('onRefreshVmView', msg);
	                                clearInterval(interval);
	                            }
	                        }, 30);
					 }
 				 },
 				onNodeExpanded: function(event, data) {
					$timeout(function() {
						//左侧导航树收缩后，hover出现的导航树高度自动调整和滚动条出现
						adjustHoverTree();
 					});
 				},
 				onNodeCollapsed : function(event, data) {
 					$timeout(function() {
						//左侧导航树收缩后，hover出现的导航树高度自动调整和滚动条出现
						adjustHoverTree();
 					});
 				}
    	};
    	return options;
    };
    //刷新节点下的所有字节点
    self.refreshNode = function(link, msg) {
        //找到需要刷新打节点
        var tree = $('#'+link.target).data('treeview');
        var nodeData = getNodeData(tree.getTree(), msg.nodeTypeId);
        tree.removeNodes(nodeData.nodes);
        tree.addNode(nodeData.nodeId, msg.nodes);
    };
    // 根据传入信息增加节点
    self.addNode = function(link, msg, treeData) {
    	if (angular.isUndefined(msg.type)) {
    		return;
    	}
    	
    	var tree = $('#'+link.target).data('treeview');
    	var node = msg.node;
    	if (angular.isUndefined(msg.parentNodeId)) {
    		//主机池没有父节点
    	    tree.addNode(null, msg.node);
    	} else {
    		var parentData = getNodeData(tree.getTree(), msg.parentNodeId);
    		//find parentData
    		if (parentData == null || angular.isUndefined(parentData.entryId)) {
    			return;
    		}
    		tree.addNode(parentData.nodeId, msg.node);
    		tree.expandNode(parentData.nodeId, {silent:true});
    	}
    	if (node.nodes) {
    	    tree.addNode(node.nodeId, node.nodes);
    	}
    };
    // 根据传入信息删除节点
    self.deleteNode = function(link, msg, treeData) {
    	if (angular.isUndefined(msg.type)) {
    		return;
    	}
    	var tree = $('#'+link.target).data('treeview');
    	var selectNode = tree.getSelected();
    	var node = getNodeData(tree.getTree(), msg.nodeTypeId);
    	if (angular.isDefined(node)) { //回收站列表中销毁虚拟机，此时的node为undefined
    		if (angular.isDefined(node.parentId) && node.parentId != null) {
    			//如果存在父节点
    		    tree.removeNodes(node);
    		    var needForward = false;
    			//如果是在主机列表或者虚拟机列表,云彩虹下进行删除，则不进行跳转
    			if ($state.current.name == 'main.cloudResource.host' || $state.current.name == 'main.cloudResource.vm' ||
			        $state.current.name == 'main.hostpool.host' || $state.current.name == 'main.hostpool.vm' || 
			        $state.current.name == 'main.cluster.host' || $state.current.name == 'main.cluster.vm' || 
			        $state.current.name == 'main.host.vm' || $state.current.name == 'main.publicCloud') {
    			    return;
    			}
    			
    			//删除本节点才向上跳转
    			if (!selectNode || !selectNode[0] || selectNode[0].entryId != msg.nodeTypeId) {
    			    return;
    			}
    			
    			//get new parent node id after reinit.
    			tree.selectNode(node.parentId, { silent: true });	//select host node
    			tree.expandNode(node.parentId, { silent: true });	//expand host node
    			tree.revealNode(node.parentId, { silent: true });	//expand host node
    			//go to parent page
			    var parentNode = tree.getNode(node.parentId);
                var url = parentNode.stateUrl;
                var params = parentNode.stateParams;
                $state.go(url, params);
    		} else {
    			//删除主机池节点
                tree.removeNodes(node);
                if (link.href == 'cloudResource') {
                	if (selectNode && selectNode[0] && selectNode[0].entryId == msg.nodeTypeId) {
                    //云资源背景色设置为选中状态
                    $("#cloudResourceAccordionLinkId").addClass("treeSelectColor");
                    //跳转到云资源页面
	                    $state.go('main.cloudResource');
                	}
                } else if (link.href == 'vmview') {
                    $("#vmViewAccordionLinkId").addClass("treeSelectColor");
                } else if (link.href == 'resourcePoolMng') {
                	if (selectNode && selectNode[0] && selectNode[0].entryId == msg.nodeTypeId) {
	                	$("#resourcePoolLinkId").addClass("treeSelectColor");
	                    $state.go('main.resourcePoolMng');
                	}
                }
    		}
    	}
    	
    };
    //根据传信息更新节点
    self.updateNode = function(link, msg) {
    	if (angular.isUndefined(msg.type)) {
    		return;
    	}
    	var tree = $('#'+link.target).data('treeview');
        var node = getNodeData(tree.getTree(), msg.nodeTypeId);
        if (!node) {
            return;
        }
        //update icon
        if (angular.isString(msg.icon)) {
            node.icon = msg.icon;
        }
        //update node text
        if (angular.isString(msg.text)) {
            node.text = msg.text;
            if (node.stateParams) {
                node.stateParams.name = msg.text;
            }
        }
        tree.updateNode(node);
    };
    
    // 跳转到相应页签
    self.stateGo = function(link, msg) {
    	if (angular.isUndefined($('#'+link.target)) || angular.isUndefined($('#'+link.target).data('treeview'))) {
    		return undefined;
    	}
    	var selectedNode = $('#'+link.target).data('treeview').getSelected();
    	var selectId = getNodeId(selectedNode, msg.entryId, msg.entryType);
    	if (selectId != -1) {
    		var selectedNode = $('#'+link.target).treeview('getNode', selectId);
    		$state.go(selectedNode.stateUrl, selectedNode.stateParams);
    		return;    		
    	}
    	var unselectedNodes = $('#'+link.target).data('treeview').getUnselected();    	
    	var nodeId = getNodeId(unselectedNodes, msg.entryId, msg.entryType); 
    	if (nodeId == -1) {
    		nodeId = getNodeIdByUrl(unselectedNodes, msg.url);
    		if (nodeId == -1 || nodeId == null) {    			
    			return;
    		}
    	};
    	$('#'+link.target).treeview('revealNode', [ nodeId, { silent: true } ]);
    	var node = $('#'+link.target).treeview('getNode', nodeId);
    	$state.go(node.stateUrl, node.stateParams);
    };
    self.stateGoParams = function(link, msg) {
    	$state.go(msg.url, msg.source);
    };
    //收缩某个树
    self.closeLink = function(link){
    	link.$element.removeClass('open');
    	if ($rootScope.transition==0) {
    		$('#'+link.target).hide();
    	} else{
    		$('#'+link.target).slideUp();
    	}
    };
    
    //获取所有节点
    function getAllNodes(link) {
    	var tree = $('#'+link.target).data('treeview');
    	var selectedNode = tree.getSelected();
    	var nodes = tree.getUnselected();
    	if (angular.isDefined(selectedNode) && angular.isArray(selectedNode)) {
    		//如果有选中的节点，则并列入未选中的节点中即为全部节点
    		nodes = nodes.concat(selectedNode);
    	}
    	return nodes;
    }
    //刷新一个节点下面的所有子节点
    function expandRefreshNodes(link, result, entryId) {
        if (angular.isArray(result)) {
            var tree = $('#'+link.target).data('treeview');
            var nodeData = getNodeData(tree.getTree(), entryId);
            for (var j = 0; j < result.length; j++) {
                var isFind = false;
                var requestnode = result[j];
                if (nodeData && angular.isArray(nodeData.nodes)) {
                    for (var i = 0; i<nodeData.nodes.length;i++ ) {
                        var childnode = nodeData.nodes[i];
                        //若节点存在，更新节点
                        if (requestnode.entryId == childnode.entryId) {
                            isFind = true;
                            if (requestnode.text != childnode.text || requestnode.icon != childnode.icon) {
                                tree.updateNode(requestnode);
                            }
                            childnode.update = true;
                        }
                    }
                }
                if (isFind == false) {
                    //增加节点
                    tree.addNode(nodeData.nodeId, requestnode);
                }
            }
            var deleteNodes = [];
            if (nodeData && angular.isArray(nodeData.nodes)) {
                for (var i = 0; i<nodeData.nodes.length;i++ ) {
                    if (nodeData.nodes[i].update == true) {
                        continue;
                    }
                    deleteNodes.push(nodeData.nodes[i]);
                }
            }
            if (deleteNodes.length > 0) {
                //删除节点
                tree.removeNodes(deleteNodes);
            }
        }
    }
    
    function loadVmwareNodes(link, data) {
        $http.get('tree/vcenter/' + data.cloudId).
        success(function (result) {
            if (result.data) {
                var hpNodes = angular.copy(result.data);
                if (hpNodes) {
                    for (var h = 0; h < hpNodes.length; h++) {
                        if (hpNodes[h].nodes) {
                            hpNodes[h].nodes = [];
                        }
                    }                   
                    //添加主机池
                    expandRefreshNodes(link, hpNodes, data.entryId);
                    //增加if判断,防止空主机池出现时,导致js错误
                    for (var h = 0; h < hpNodes.length; h++) {
                        var clusterNodes = angular.copy(result.data[h].nodes);
                        if (clusterNodes) {
                            //清空主机节点
                            for (var i = 0; i < clusterNodes.length; i++) {
                                if (clusterNodes[i].nodes) {
                                    clusterNodes[i].nodes = [];
                                }
                            }
                            //添加集群
                            expandRefreshNodes(link, clusterNodes, result.data[h].entryId);
                            
                            //添加主机
                            for (var i = 0; i < clusterNodes.length; i++) {
                                if (result.data[h].nodes[i].nodes) {
                                    expandRefreshNodes(link, result.data[h].nodes[i].nodes, result.data[h].nodes[i].entryId);
                                }
                            }
                        }
                    }
                }
            }
            UtilService.handleResult(result);
        }).error(function(response, code, headers, config) {
            UtilService.handleError(code);
        });
    }
    
    // 收起和展开树，并加载子节点
    function selectLink(link){
    	 var el = link.$element;
    	 if(el.attr("class").indexOf("open") > 0){
    		 self.closeLink(link);
    	 }else{
    		 el.addClass('open');
    		 if($rootScope.transition == 0) {
    			 $('#'+link.target).show();
    		 }else{
    		     $('#'+link.target).slideDown();
    		 }
        	 $http({ 
                 method: 'GET', 
                 url: link.listhref
             }).success(function(data,status,headers,cfg) { 
            	 if(data){
            		 if (link.href == 'VDCMng' || link.href == 'cloudResource' || link.href == 'systemMng' ||
            		     link.href == 'pluginMng' || link.href == 'cloudService') { // 设置系统管理/报表管理pluginMgr
						 // 下面的树展开一级子节点
            			 $('#'+link.target).treeview({
            				 data: data,
            				 enableLinks:false,
            				 levels: 1,				// 系统管理只展开一层
            				 onNodeSelected:function(event, data) {
            					 // 去除选中格式（类似云资源这种节点的选中格式）
            					 $("a.link.treeSelectColor").removeClass("treeSelectColor");
	        					 // 当节点被选中后跳转到相应的页签
	        					 var url = data.stateUrl;
	        					 var params = data.stateParams;
	        					 //收集日志，页面不跳转
	        					 if (url == "main.gatherLog") {
	        						 var modalInstance = UtilService.confirm($translate.instant("systemMng.logCollectionDesc"), $translate.instant("systemMng.logCollection"),{width:'350px'});
	                             	 modalInstance.result.then(function(){
	                             		HttpService.put("gatherLog/gather", undefined, undefined, function(result){
	                                 		if (result.success){
	                                     		window.open("download/log", "_blank", "height=100,width=100,top=0,left=0,toolbar=no,menubar=no,location=no");	
	                                 		}
	                                 	});
	                     			 }, function(){});
	                             	 return;
	        					 }
	        					 $state.go(url, params);
	        					 //点击VMware节点,加载至主机
	        					 if (data.entryType == constant.VMWARE) {
	        					     loadVmwareNodes(link, data);
                                 }
	         				 },
	                         onNodeExpanded: function(event, data) {
	                             //分步加载vmware节点:主机池
	                             if (data.entryType == constant.VMWARE) {
	                                 loadVmwareNodes(link, data);
	                             }
	                             if (data.entryType == 'plugin') {
	         						$http.get('pluginMgr/plugin/' + data.id + '/pluginNavigation').
	         					    success(function (result) {
	         					        var style = document.createElement("style");
	         					        style.type = "text/css";
	         					    	var cssString = "";
	         					    	var cssId = "";
	         					    	for(var i = 0;i< result.length;i++){	         					    		
	         					    		var navigation = result[i];
	         					    		var iconUrl = "plugin/"+navigation.data.pluginName+"/"+navigation.data.iconUrl;
	         					    		cssId = navigation.id;
	         					    		cssString = cssString + "."+navigation.icon+":before { content : url(\""+iconUrl+"\")}";
	         					    	}
	         					        style.id = 'plugin_'+cssId;
	         					        style.className = "plugin-navigation";
	         					        $("#"+style.id).remove();
	         					    	style.appendChild(document.createTextNode(cssString));
	         					    	document.getElementsByTagName("head")[0].appendChild(style);
	         					    	expandRefreshNodes(link, result, 'plugin_' + data.id);
	         					    })
	          					}
	                             $timeout(function() {
                                     //左侧导航树收缩后，hover出现的导航树高度自动调整和滚动条出现
                                     adjustHoverTree();
                                 });
	                         },
	                         onNodeCollapsed : function(event, data) {
	                             $timeout(function() {
	                                 //左侧导航树收缩后，hover出现的导航树高度自动调整和滚动条出现
	                                 adjustHoverTree();
	                             });
	                         }
            			 });
            			 //如果vmware云资源未展开,则加载该资源.
            			 if ($state.$current.includes['main.vmwareHostpool'] || $state.$current.includes['main.vmwareCluster'] ||
            			     $state.$current.includes['main.vmwareHost'] || $state.$current.includes['main.vmwareVm']) {
            			     var tree = $('#'+link.target).data('treeview');
            			     var cloudNodeId = $state.$current.locals.globals.$stateParams.cloudId || $state.$current.locals.globals.$stateParams.id;
            			     var data = getNodeData(tree.getTree(), 'vmware_' + cloudNodeId);
            			     loadVmwareNodes(link, data);
            			 }
            		 } else {
            			 var levels;
            			 if (link.href == 'cloudResource.dashboard'){ //云资源节点展开到主机
            				 levels = 3;
            			 }
            			 var treeData = ctreatTreeData(data, levels);
	        			 $('#'+link.target).treeview(treeData);
            		 }
            		 // 动画效果
            		 if($rootScope.transition==1){
     					 $(".slidebar").addClass("transition");
     					 $(".link").addClass("transition");
     				 }else{
     					 $(".slidebar").removeClass("transition");
     					 $(".link").removeClass("transition");
     				 }
            		 //right click tree node to select the node
            		 $('#'+link.target).on('mousedown', function(e) {
      		    		if (e.which == 3) {	//right click at tree node
      		    			//get node id
      		    			var toE = e.toElement;
      		    			if (isEmpty(toE)) {
      		    				toE = e.target;
      		    			}
      		    			var nodeid = toE.dataset.nodeid;
      		    			if (angular.isUndefined(nodeid)) {
      		    				nodeid = toE.parentElement.dataset.nodeid;
      		    			}
     		    			
     		    			if (angular.isUndefined(nodeid)) {
     		    				return;
     		    			}
     		    			
     		    			var tree = $('#'+link.target).data('treeview');
     		    			//unselect selected node first
     		    			var selectNodes = tree.getSelected();
     		    			if (selectNodes.length > 0) {
     		    				tree.unselectNode(selectNodes);
     		    			}
     		    			//unselet link element
     		    			$(".link").removeClass("treeSelectColor");//unselect <li>
     		    			var clickNode = tree.getNode(nodeid);
     		    			//select click node
     		    			tree.selectNode(clickNode, { silent: true });
     		    		}		    		
     		    	});
            		 //双击展开节点
            		 $('#'+link.target).on('dblclick', function(e) {
            		     //get node id
                         var toE = e.toElement;
                         if (isEmpty(toE)) {
                             toE = e.target;
                         }
                         var nodeid = toE.dataset.nodeid;
                         if (angular.isUndefined(nodeid)) {
                             nodeid = toE.parentElement.dataset.nodeid;
                         }
                         
                         if (angular.isUndefined(nodeid)) {
                             return;
                         }
                         
                         var tree = $('#'+link.target).data('treeview');
                         //unselect selected node first
                         var selectNodes = tree.getSelected();
                         if (selectNodes.length > 0) {
                             tree.unselectNode(selectNodes);
                         }
                         //unselet link element
                         $(".link").removeClass("treeSelectColor");//unselect <li>
                         var clickNode = tree.getNode(nodeid);
                         //select click node
                         tree.selectNode(clickNode, { silent: true });
                         //如果时收起则展开，如果时展开则收起
                         if (clickNode.state.expanded == false) {
                             tree.collapseNode(clickNode, { silent: true });       //收起节点
                         } else {
                             tree.expandNode(clickNode, { silent: true });       //展开节点
                         }                         
            		 });
            		 if (link.href == 'cloudResource') {
            			 link.$root.cloudData = data;
            		 } else if (link.href == 'cloudService') {
            			 link.$root.cloudServiceData = data;
            		 } else if (link.href == 'orgMng') {
            			 link.$root.orgData = data;
            		 } else if (link.href == 'resourcePoolMng') {
            			 link.$root.resourcePoolData = data;
            		 }
        		};
            		 
             }).error(function(data,status,headers,cfg) { 
             }); 
    	 };
     };
	$scope.slideHidden = false;
	
}])
.directive("casSlidebar",function(){
	return{
		restrict:'AE',
		controller:'SlideController',
		link:function(scope,element,attrs,ctrl){
		}
	};
})

.directive('casAccordion',function(){
	 return {
		    restrict:'A',
		    require: '^casSlidebar',
		    transclude:true,
		    template: '<ul id="accordion" class="accordion st-effect-2" ng-transclude></ul>',
		    link:function(scope,element,attrs,ctrl){
			},
		    replace: true
		  };
})
// 左侧下半部分
.directive('casAccordionLink',function($translate, $timeout, $http, $rootScope, HttpService, UtilService){
	 return {
		    restrict:'A',
		    require: '^casSlidebar',
		    template: '<li><a id = "{{aid}}", class="link" ui-sref=".{{href}}"><span class="accordiong-icon {{icon}}"></span>'
		    	+'<span class="accordiong-text">{{text}}</span><span class="fa fa-angle-down treeTriangle"></span></a></li>',
		    scope:{
		    	aid :'@',
		    	text:'@',
		    	listhref:'@',
		    	href:'@',
		    	icon:'@',
		    	treeId:'@'
		    },
		    link:function(scope,element,attrs,ctrl){
		    	this.el = $(element).find(".fa-angle-down")|| {};
		    	ctrl.addLink(scope, $(element));
		    	this.el.on('click', function(){
		    		ctrl.selectLink(scope);
		    		//阻止执行父元素的click事件。
		    		return false;
		    	});
		    	var linkel = $(element).find(".link")|| {};
		    	linkel.on('click', function(event){
		    		ctrl.selectLink(scope);
		    		if (!linkel.hasClass("treeSelectColor")) {
		    			//取消树节点的选中
		    			ctrl.unSelectAllNode();
		    			$(".link").removeClass("treeSelectColor");
		    			linkel.toggleClass("treeSelectColor");
		    		}
		    		//show domain view
//		    		if (linkel[0].text == $translate.instant('vmView.vmView')) {
//		    			 //when vm wiew, if it was current page ,refesh vmView
//		    		    //等面板上的树生成后再广播
//		    		    var interval = setInterval(function() {
//		    		        var pageViewTree = $('#vmViewPageTree').data('treeview');
//		    		        if (pageViewTree != null) {
//		    		            var msg = {};
//	                            msg.id = -1;
//	                            msg.text = $translate.instant('vmView.vmView');
//	                            msg.icon = 'icon-vm-view-gray';
//	                            msg.entryId = 'vmView_dir_' + -1;
//	                            msg.entryType = 'vmView_dir';
//	                            scope.$root.$broadcast('onRefreshVmView', msg);
//	                            clearInterval(interval);
//		    		        }
//		    		    }, 30);
//		    		}
		    	});
		    	//双击事件
//		    	linkel.on('dblclick', function(e) {
//		    		ctrl.selectLink(scope);
//		    		//阻止执行父元素的click事件。
//		    		return false;		
//		    	});
		    	
		    	//when right click
		    	linkel.on('mousedown', function(e) {
		    		if (e.which == 3) {	//right click at link
		    		    if (!linkel.hasClass("treeSelectColor")) {
	                        //取消树节点的选中
	                        ctrl.unSelectAllNode();
	                        $(".link").removeClass("treeSelectColor");
	                        linkel.toggleClass("treeSelectColor");
	                    }    			
		    		}		    		
		    	});
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
		    	
	    		//健康巡检取消所有树选中
	    		scope.$on('onBtnhelthyCheck', function(event, msg) {
	    			ctrl.unSelectAllNode();
				});
		    	//更新所有字节点
	    		scope.$on(constant.onRefreshNavNode, function(event, msg) {
	    		    if (angular.isArray(msg.nodes) && msg.nodes.length > 0) {
	    		        ctrl.refreshNode(scope, msg);
	    		    }
	    		});
	    		
		    	// 仅云资源树注册即可
		    	if (scope.href == 'cloudResource') {
		    		// 导航树触发的选中不需要跳转
		    		scope.$on('onCloudNodeSelected', function(event, msg) {
		    			ctrl.unSelectAllNode();
						if (msg.entryId == 'cloudResource_-1') {
							$(".link").removeClass("treeSelectColor");
					    	linkel.toggleClass("treeSelectColor");
						} else {
							$(".link").removeClass("treeSelectColor");
							ctrl.selectNode(scope, msg);	
						}						 
					});
		    		// 双击列表触发的跳转。选中事件同一在route的controller中触发
		    		scope.$on('onNodeStateGo', function(event, msg) {
						  ctrl.stateGo(scope, msg);
					});
		    		//注册树节点的增、删、更新事件
		    		scope.$on('onCloudNodeChange', function(envent, msg) {
		    			if (msg.type == 'add') {
		    				//增加节点
		    				ctrl.addNode(scope, msg, scope.$root.cloudData);
		    			} else if (msg.type == 'delete') {
		    				//删除节点
		    				ctrl.deleteNode(scope, msg, scope.$root.cloudData);
		    			} else {
		    				//更新节点
		    				ctrl.updateNode(scope, msg);
		    			}
		    		});
		    	}
		    	
		    	if (scope.href == 'cloudService') {
		    		// 导航树触发的选中不需要跳转
		    		scope.$on(constant.oncloudServiceNodeSelected, function(event, msg) {
                        ctrl.unSelectAllNode();
                        if (msg.entryId == 'cloudService_-1') {
                            $(".link").removeClass("treeSelectColor");
                            linkel.toggleClass("treeSelectColor");
                        } else {
                            //判断树是否已经存在，如果不存在则展开节点，等待树生成,处理未展开资源树，点击顶部搜索栏，无法找到树中节点问题
                            var cloudServiceTree = $('#'+scope.target).data('treeview');
                            if (angular.isUndefined(cloudServiceTree)) {
                                 //等待树对象生存
                                 linkel.click();
                                 var intervalTime = setInterval(function() {
                                     cloudServiceTree = $('#'+scope.target).data('treeview');
                                     if (angular.isDefined(cloudServiceTree)) {
                                         $(".link").removeClass("treeSelectColor");
                                         ctrl.selectNode(scope, msg);    
                                         clearInterval(intervalTime);
                                         intervalTime = undefined;
                                     }
                                 }, 30);
                             } else {
                                 $(".link").removeClass("treeSelectColor");
                                 ctrl.selectNode(scope, msg);
                             }  
                        }                                            
                    });
		    	}
		    	if (scope.href == 'alarmMng') {
		    		// 导航树触发的选中不需要跳转
		    		scope.$on(constant.onAlarmNodeSelected, function(event, msg) {
		    			ctrl.unSelectAllNode();
                        if (msg.entryId == 'realtimeAlarm_-1') {
                            $(".link").removeClass("treeSelectColor");
                            linkel.toggleClass("treeSelectColor");
                        } else {
                            $(".link").removeClass("treeSelectColor");
                            ctrl.selectNode(scope, msg);
                        }
					});
		    	}
		    	//VDC管理
		    	if (scope.href == 'VDCMng') {
		    	    //注册树节点的增、删、更新事件
                    scope.$on(constant.onVDCNodeChange, function(envent, msg) {
                        if (msg.type == 'add') {
                            //增加节点
                            ctrl.addNode(scope, msg, scope.$root.cloudServiceData);
                        } else if (msg.type == 'delete') {
                            //删除节点
                            ctrl.deleteNode(scope, msg, scope.$root.cloudServiceData);
                        } else {
                            //更新节点
                            ctrl.updateNode(scope, msg);
                        }
                    });
                    //注册VDC节点事件
                    scope.$on(constant.onVDCNodeSelected, function(event, msg) {
                        ctrl.unSelectAllNode();
                        if (msg.entryId == 'VDCMng_-1') {
                            $(".link").removeClass("treeSelectColor");
                            linkel.toggleClass("treeSelectColor");
                        } else {
                            //判断树是否已经存在，如果不存在则展开节点，等待树生成,处理未展开资源树，点击顶部搜索栏，无法找到树中节点问题
                            var VDCTree = $('#'+scope.target).data('treeview');
                            if (angular.isUndefined(VDCTree)) {
                                 //等待树对象生存
                                 linkel.click();
                                 var intervalTime = setInterval(function() {
                                     VDCTree = $('#'+scope.target).data('treeview');
                                     if (angular.isDefined(VDCTree)) {
                                         $(".link").removeClass("treeSelectColor");
                                         ctrl.selectNode(scope, msg);    
                                         clearInterval(intervalTime);
                                         intervalTime = undefined;
                                     }
                                 }, 30);
                             } else {
                                 $(".link").removeClass("treeSelectColor");
                                 ctrl.selectNode(scope, msg);
                             }  
                        }                                            
                    });
                    
                    // 双击列表触发的跳转。选中事件同一在route的controller中触发
                    scope.$on('onNodeStateGo', function(event, msg) {
                          ctrl.stateGo(scope, msg);
                    });
		    	}
		    	  	
		    	//工作流管理
		    	if (scope.href == 'workflowMng') {
		    	    scope.$on(constant.onWorkFlowMngNodeSelected, function(event, msg) {
                         ctrl.unSelectAllNode();
                         if (msg.entryId == 'workflowMng_-1') {
                             $(".link").removeClass("treeSelectColor");
                             linkel.toggleClass("treeSelectColor");
                         } else {
                             //判断树是否已经存在，如果不存在则展开节点，等待树生成,处理未展开资源树，点击顶部搜索栏，无法找到树中节点问题
                             var flowManageTree = $('#'+scope.target).data('treeview');
                             if (angular.isUndefined(flowManageTree)) {
                                  //等待树对象生存
                                  linkel.click();
                                  var intervalTime = setInterval(function() {
                                	  flowManageTree = $('#'+scope.target).data('treeview');
                                      if (angular.isDefined(flowManageTree)) {
                             $(".link").removeClass("treeSelectColor");
                             ctrl.selectNode(scope, msg);    
                                          clearInterval(intervalTime);
                                          intervalTime = undefined;
                                      }
                                  }, 30);
                              } else {
	                             $(".link").removeClass("treeSelectColor");
	                             ctrl.selectNode(scope, msg);    
                              }
                         }                                            
		    	    });
		    	}
		    	
		    	/**报表管理**/
		    	if (scope.href == 'reportMng') {
		    	    scope.$on(constant.onReportMngNodeSelected, function(event, msg) {
                     ctrl.unSelectAllNode();
                     if (msg.entryId == 'report_-1') {
                         $(".link").removeClass("treeSelectColor");
                         linkel.toggleClass("treeSelectColor");
                     } else {
                         $(".link").removeClass("treeSelectColor");
                         ctrl.selectNode(scope, msg);
                     }
                    });
		    	}
		    	/**监控管理**/
		    	if (scope.href == 'monitorMng') {
		    	    scope.$on(constant.onMonitorMngNodeSelected, function(event, msg) {
                     ctrl.unSelectAllNode();
                     if (msg.entryId == 'monitor_-1') {
                         $(".link").removeClass("treeSelectColor");
                         linkel.toggleClass("treeSelectColor");
                     } else {
                         $(".link").removeClass("treeSelectColor");
                         ctrl.selectNode(scope, msg);    
                     }
                 });
		    	  //注册树节点的增、删、更新事件
		    		scope.$on('onMonitorNodeChange', function(envent, msg) {
		    			if (msg.type == 'add') {
		    				//增加节点
		    				ctrl.addNode(scope, msg);
		    			} else if (msg.type == 'delete') {
		    				//删除节点
		    				ctrl.deleteNode(scope, msg);
		    			} else {
		    				//更新节点
		    				ctrl.updateNode(scope, msg);
		    			}
		    		});
		    		scope.$on('onNodeParamStateGo', function(event, msg) {
		    			ctrl.selectNode(scope, msg);	
						ctrl.stateGoParams(scope, msg);
					});
		    	}
		    	//系统管理
		    	if (scope.href == 'systemMng') {
		    	    scope.$on(constant.onSystemMngNodeSelected, function(event, msg) {
                     ctrl.unSelectAllNode();
                     if (msg.entryId == 'system_-1') {
                         $(".link").removeClass("treeSelectColor");
                         linkel.toggleClass("treeSelectColor");
                     } else {
                         $(".link").removeClass("treeSelectColor");
                         ctrl.selectNode(scope, msg);    
                     }
                 });
		    	}
			},
		    replace: true
		  };
})
.directive('casAccordionOnlyLink',function($translate, $timeout, $http, $rootScope){
	 return {
		    restrict:'A',
		    require: '^casSlidebar',
		    template: '<li><a id = "{{aid}}", class="link" ui-sref="{{href}}"><span class="accordiong-icon {{icon}}"></span>'
		    	+'<span class="accordiong-text">{{text}}</span></a></li>',
		    scope:{
		    	aid :'@',
		    	text:'@',
		    	listhref:'@',
		    	href:'@',
		    	icon:'@',
		    	treeId:'@'
		    },
		    link:function(scope,element,attrs,ctrl){
		    	this.el = $(element).find(".fa-angle-down")|| {};
		    	ctrl.addLink(scope, $(element));
		    	this.el.on('click', function(){
		    		ctrl.selectLink(scope);
		    		//阻止执行父元素的click事件。
		    		return false;
		    	});
		    	var linkel = $(element).find(".link")|| {};
		    	linkel.on('click', function(event){
		    		if (!linkel.hasClass("treeSelectColor")) {
		    			//取消树节点的选中
		    			ctrl.unSelectAllNode();
		    			$(".link").removeClass("treeSelectColor");
		    			linkel.toggleClass("treeSelectColor");
		    		}
		    	});
		    	//双击事件
		    	linkel.on('dblclick', function(e) {
		    		ctrl.selectLink(scope);
		    		//阻止执行父元素的click事件。
		    		return false;		
		    	});
		    	
		    	//when right click
		    	linkel.on('mousedown', function(e) {
		    		if (e.which == 3) {	//right click at link
		    			linkel.click();		    			
		    		}		    		
		    	});
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
			},
		    replace: true
		  };
})
.directive('casAccordionToggle1',function($translate, $timeout){
	 return {
		    restrict:'A',
		    require: '^casSlidebar',
		    template: '<span id="toggletreeicon" class="fa fa-outdent leftTreeToggele" custom-title></span>',
		    scope: false,
		    link:function(scope,element,attrs,ctrl){
		    	//设置右侧顶部导航条宽度自适应窗口大小的变化
				if($("#slidebar")[0].offsetWidth==200){
    				scope.navbarwidth={"width":(document.body.offsetWidth-200)+"px"};
				}else{
    				scope.navbarwidth={"width":"85%"};
				}				
				$(window).resize(function(){
					if (document.body.clientWidth && $("#slidebar")[0]){
						scope.$apply(function(){
							scope.navbarwidth={"width":(document.body.clientWidth-$("#slidebar")[0].clientWidth)+"px"};
						});
					}
					if(document.body.clientWidth < 874) {
						if (!scope.slideHidden) {
							$(element).click();
						}
					}
				});
    			$("#leftTreeToggle").attr("custom-title",$translate.instant("common.collapseNav"));
		    	element.bind('click',function(){
		    		$timeout(function(){
		    			scope.slideHidden=!scope.slideHidden;
		    			// 当点击导航栏的收放按钮时，向下传播onNavClick事件，用于列表宽度的计算
		    			if(scope.slideHidden){
		    				scope.navbarwidth={"width":(document.body.clientWidth-30)+"px"};
		    				$(".page").addClass("slideHidden");
		    				var msg = {msg: 'hidden'};
		    				scope.$root.$broadcast(constant.onNavClick, msg);
		    				//收缩所有树
		    				ctrl.collapseAllTree();
		    				ctrl.addHoverEvent();
		    				//导航栏左侧折叠展开树按钮的样式变化处理
		    				$("#toggletreeicon").removeClass("fa-outdent").addClass("fa-indent");
		    				$("#leftTreeToggle").attr("custom-title",$translate.instant("common.expandNav"));
		    			}else{
		    				$(".page").removeClass("slideHidden");
		    				$(".nav-tree").height("100%")
		    				var msg = {msg: 'extend'};
		    				scope.$root.$broadcast(constant.onNavClick, msg);
		    				ctrl.removeHoverEvent();
		    				//导航栏左侧折叠展开树按钮的样式变化处理
		    				$(".nav-tree").css({overflow:'visible'});
		    				$("#toggletreeicon").removeClass("fa-indent").addClass("fa-outdent");
		    				$("#leftTreeToggle").attr("custom-title",$translate.instant("common.collapseNav"));
		    				scope.navbarwidth={"width":(document.body.clientWidth-$("#slidebar")[0].clientWidth)+"px"};
		    			}
		    		})
				});
		    	if(document.body.clientWidth < 874) {
					if (!scope.slideHidden) {
						$(element).click();
					}
				}
			},
		    replace: true
		  };
})
.controller('CasTabController', ['$scope', function TabsetCtrl($scope) {
  var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

  ctrl.select = function(selectedTab) {
    angular.forEach(tabs, function(tab) {
      if (tab.active && tab !== selectedTab) {
        tab.active = false;
        tab.onDeselect();
      }
    });
    selectedTab.active = true;
    selectedTab.onSelect();
  };

  ctrl.addTab = function addTab(tab) {
    tabs.push(tab);
    // we can't run the select function on the first tab
    // since that would select it twice
    if (tabs.length === 1) {
      tab.active = true;
    } else if (tab.active) {
      ctrl.select(tab);
    }
  };

  ctrl.removeTab = function removeTab(tab) {
    var index = tabs.indexOf(tab);
    // Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && tabs.length > 1 && !destroyed) {
      // If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };

  var destroyed;
  $scope.$on('$destroy', function() {
    destroyed = true;
  });
}])
.directive('websocket', function($rootScope, $state, $window, $timeout, $http, UtilService) {
	return {
		restrict : 'AE',
		link : function(scope, element, attrs) {
			if (window.addEventListener) {
				window.addEventListener('message', receiver, false);
			} else if (window.attachEvent) {
				window.attachEvent('onmessage', receiver)
			}
			function receiver(e) {
				if (angular.isObject(e.data)) {
					var obj = e.data;
					if (angular.isArray($rootScope.msgArr) && $rootScope.msgArr.contains(obj.id)) {
						var index = -1;
						for (var i=0; i < $rootScope.msgArr.length; i++) {
							if ($rootScope.msgArr[i] == obj.id) {
								index = i;
							}
						}
						if (index != -1) {
							obj.id = "cvm_" + obj.id;
							var objid = $("#grid-table").jqGrid("getInd",  obj.id);
							if (objid == false) {
								$("#grid-table").jqGrid('addRowData', obj.id, obj, "first");
							} else {
								$("#grid-table").jqGrid('setRowData', obj.id, obj);
							}
							if (obj.progress == 100 && obj.result != 1) {
								$rootScope.msgArr.splice(index, 1);
								//这里处理CVM发过来的任务消息(云主机中嵌入的虚拟机详情).
								//当删除虚拟机时,根据ip地址找到云资源,根据uniqueKey定位虚拟机,删除数据库数据,并且跳转到云主机列表
								if (obj.eventType == constant.DEL_VM) {
								    var delParam = {
								        address:e.origin,//http://172.16.20.83:8080
								        uniqueKey:obj.targetId
								    };
								    //删除虚拟机
								    $http({
						                 method  : 'DELETE',
						                 url     : "domain/relatedData",
						                 params: delParam
						             }).success(function(result) {
						                 if (result.state == 0) {
						                     //跳转到云主机列表
						                     $state.go('main.cloudHost');
						                 } else {
						                     UtilService.handleResult(result);
							}
						             }).error(function(response, code, headers, config) {
				                         UtilService.handleError(code);
				                     });
						}
					}
						}
					}
				} else if (e.data) {
					if (!angular.isArray($rootScope.msgArr)) {
						$rootScope.msgArr = [];
					}
					$rootScope.msgArr.push(e.data);
				}
			}
			var contextPath = UtilService.getContextPath();
            if (window.location.protocol == 'http:') {  
                url = 'ws://' + window.location.host + contextPath + "/websocket";  
            } else {  
                url = 'wss://' + window.location.host + contextPath + "/websocket"; 
            }
            if (!scope.ws) {
            	 scope.ws = null;
                 if ('WebSocket' in window) {
                	 scope.ws = new WebSocket(url);
                 } else if ('MozWebSocket' in window) {
                	 scope.ws = new MozWebSocket(url);
                 } else {
                    // websocket = new
					// SockJS("http://localhost:8080/Origami/sockjs/webSocketServer");
                	 scope.ws = new WebSocket(url); 
                 }
                 scope.ws.onopen = function () {  
                	 if (scope.ws != null) {
//                		scope.ws.send("login");
                	 }
                 };  
                 scope.ws.onmessage = function (event) { 
                	 // session失效
                     if (event.data == 'sessionInvalid') {
                    	 
                 	 } else if (event.data){
                 		 // 任务更新
                 		 var obj = jQuery.parseJSON(event.data);
                 		 var refreshData = obj.refreshData;
                 		 var needRefresh = false;
                 		 var hideMessage = false; //只需要刷新，不需要出现任务台 标识。
                 		 if (angular.isArray(refreshData)) {
                 			 // 0 成功 1失败 2部分成功
                 			 // 成功处理
                 			 if (obj.progress == 100 && obj.result != 1 && refreshData.length > 0) {
                 				needRefresh = true;
                 			 }
                 			 // 特殊处理100%立即刷新,无论成功失败
                 			 var data0 = refreshData[0];
             				 if (angular.isDefined(data0) && angular.isDefined(data0.immediateRefresh) && data0.progress == 100) {
             					needRefresh = true;
             				 }
             				 
             				 if (angular.isDefined(data0) && data0.hideMessage === true) {
             					hideMessage = true;
             				 }
                 		 }
                 		 if (needRefresh == true) {
                 			$rootScope.$broadcast("onMessage", obj);
                 		 }
                 		 if (obj.progress == 100 && obj.result != 1 ) {
                 			//处理成功时消息 添加到队列处理 10567，【该方法定义在commmon.js中】
                 			addWebsocketMessageToQueue(element, $rootScope, obj, $http, UtilService);
                 		 }
                 		 if (!hideMessage) {
                 			 var objid = $("#grid-table").jqGrid("getInd", obj.id);
                 			 if (objid == false) {
                 				 $("#grid-table").jqGrid('addRowData', obj.id, obj, "first");
                 			 } else {
                 				 $("#grid-table").jqGrid('setRowData', obj.id, obj);
                 			 }
                 		 }
                 	 } 
                 };  
                 scope.ws.onclose = function (event) { 
                	 if (scope.ws != null) {  
                		 scope.ws = null;  
                     }  
                	 console.log('websocket.onclose method is called and event.reason:' + event.reason);  
                	 $window.location.reload();
                 };  
                 scope.ws.onerror = function (event) {
                	 // 产生异常
                	 console.error('websocket.onerror method is called and event:' + event);  
//                	 $window.location.reload();
                  }; 
            }
		}
	};
})
.directive("taskconsoleContextMenu", function($translate, $http, $timeout,$state,$rootScope,HttpService, UtilService) {
	return {
		restrict: 'A',
		scope: {
			casContextMenu: '=',
			casContextMenuType: '@',
			casContextMenuId: '@'
		},
		templateUrl: 'html/template/contextmenu/taskConsoleContextMenu.html',
		link: function(scope, element, attrs, ctrl){
			element.bind('contextmenu', function(event) {
				event.preventDefault();//prevent default menu show
			});
			scope.showMenu = function(menu) {
				scope.taskconsoleMenu = false;
				scope[menu] = true;
			};
			scope.getRowData = function() {
				var rowid = $('#grid-table').jqGrid('getGridParam','selrow');
				return $('#grid-table').jqGrid('getRowData', rowid);
			}
			//memu object
			$("#grid-table").contextmenu({
				target:'#'+scope.casContextMenuId,
				before:function(e) {
					//when not item select, right click grid header to prevent show menu
					e.preventDefault();
					e.stopPropagation();
					
					//menu element 
					scope.taskconsoleMenu = false;
					var rowData = scope.getRowData();
					if ($(rowData.progress).text() == '0%' && isEmpty(rowData.start)) {
						scope.taskconsoleMenu = true;
					} else {
						scope.taskconsoleMenu = false;
					}
					scope.$apply();
				},
				onItem: function(context, e) {
					//operator vm while click menu
					var toE = e.toElement;
					if (isEmpty(toE)) {
	    				toE = e.target;
	    			}
					var text = toE.innerText || toE.innerHTML;					//get text value for text click
					//-------------------------
					if (scope.taskconsoleMenu) {
						if (text == $translate.instant('common.cancelTask')) {
							var rowData = scope.getRowData();
							if (rowData && rowData.id) {
								var url = 'message/cancelTask/' + rowData.id;
								$http({
									method:"DELETE",
									url:url
								}).success(function(result){
									UtilService.handleResult(result);
								}) 
							}
						}
					}
				}
			});
		}		
	}
})
.directive('jqgrid', function($filter, $translate) { //
	  return {
		restrict : 'AE',
		link:function(scope,element,attrs,ctrl){
			var griddata = [];
			var colNames = ['id',$translate.instant('common.taskName'), $translate.instant('common.operTarget'),
			                $translate.instant('common.taskState'), $translate.instant('common.taskDesc'),
			                $translate.instant('operator.operator'),$translate.instant('common.operatorIp'), 
			                $translate.instant('cloudResource.startTime'), $translate.instant('common.finishTime'),
			                $translate.instant('common.result')];
			var success = $translate.instant("common.fail");
			var fail = $translate.instant("common.success");
			var partialsuccess = $translate.instant("common.partSuccess");
			$(element).jqGrid({
				data:griddata,
				datatype:"local",
				height: '135px',
//				scroll:true,
				autowidth:true,
//				shrinkToFit:true, /**true 安比例初始化列宽度， false：使用colModel 指定的宽度**/
				forceFit: true,    /**true： 调整列宽度不会改变表格的宽度，当shinkToFit为false时，此属性会被忽略**/
				colNames:colNames,
				colModel:[
 					{name:'id',index:'id', width:'0',hidden:true},
					{name:'name',index:'name', width:'170', sortable:false, title:false},
					{name:'target',index:'target', width:'100', sortable:false, title:false}, 
					{name:'progress',index:'progress',width:'120', sortable:false, formatter:showProgress, title:false},
					{name:'detail',index:'detail', width:'350',  sortable:false, title:false, formatter:showCustomtitle},
					{name:'user',index:'user', width:'80',  sortable:false, title:false},
					{name:'address',index:'address', width:'90', sortable:false, title:false},
					{name:'start',index:'start', width:'120', sortable:false, title:false, formatter:showtime},
					{name:'complete',index:'complete', width:'120', sortable:false, title:false, formatter:showtime},
					{name:'result',index:'result', width:'60', sortable:false, title:false, formatter:showResult}
				]
				
			})
			$(window).resize(function(){
				//浏览器窗口变化重新设置任务台列表的宽度
				$(element).setGridWidth($("#bottomMain").width()-2);
			})
			function showCustomtitle (cellvalue, options, row) {
				var tem = '<span class="jqgrid_span" onmouseenter="customTitleMouseEnter(this,event)" onmouseleave="customTitleMouseLeave()" onclick="customTitleMouseLeave()">' +cellvalue+'</span>';
				return tem;
			}
			function showProgress(cellvalue, options, row) {
				var ctrlProgressTemplate= '<div class="progress progressgray" style="position:relative" ><div class="progress-bar progress-bar-success progress-bar-striped"   role="progressbar" aria-valuenow="'+cellvalue+'" aria-valuemin="0" aria-valuemax="100"  style="text-align:left;width: '
				+cellvalue + '%"></div><div style="width:100%;position:absolute;text-align:center;line-height:18px">'+cellvalue + '%</div></div>';
				return ctrlProgressTemplate;
			}
			function showResult(cellvalue, options, row) {
				var res = '';
				if (cellvalue == 1 && row.progress ==100) {
					res = '<span class="icon-cancel-red" style="position:relative;top:4px;padding-right:4px"></span><span >'+success+'</span>';
				} else if (cellvalue == 0) {
					res = '<span class="icon-finish-green" style="position:relative;top:4px;padding-right:4px"></span><span>'+fail+'</span>';
				} else if (cellvalue == 2) {
					res = '<span class="icon-finish-green" style="position:relative;top:4px;padding-right:4px"></span><span>'+partialsuccess+'</span>';
				}
				return res;
			}
			function showtime(cellvalue, options, row){
				return $filter('mydate')(cellvalue);
			}
		}
	  };
})
.directive('jqResize', function($filter) { //
	  return {
		restrict : 'AE',
		link:function(scope,element,attrs,ctrl){
			$(element).resizable({ 
				handles: "n",
				minHeight: 100,
				helper: "ui-resizable-helper",stop:function(event){
				
					$("#slidebar").css("min-height",event.clientY+"px");
					var newBottomPanelHeight = document.documentElement.offsetHeight-event.clientY;
					$("#bottomPanel").height(newBottomPanelHeight + "px");	//任务台拖拽时，其高度自动适应屏幕的变化
					$("#bottomPanel").width('100%');//任务台拖拽时，其宽度自动适应屏幕的变化
					
					var oldBottomPanelHeight = $("#bottomPanel").height();
			    	$("#mainPanel").height("calc(100% - " + oldBottomPanelHeight+"px)");
			    	
			    	var diff = oldBottomPanelHeight + 84;
			    	$("#treeDivId").height("calc(100vh - "+diff+ "px)");
					$("#grid-table").jqGrid('setGridHeight', (document.documentElement.offsetHeight-event.clientY - 65) +"px");
				}  
			});
		}
	  };
})
.directive('loginpageWebsocket', function($rootScope, $state, $window, $timeout, $http, UtilService) {
	return {
		restrict : 'AE',
		link : function(scope, element, attrs) {
			var contextPath = UtilService.getContextPath();
            if (window.location.protocol == 'http:') {  
                url = 'ws://' + window.location.host + contextPath + "/loginpageWebsocket";  
            } else {  
                url = 'wss://' + window.location.host + contextPath + "/loginpageWebsocket"; 
            }
            if (!scope.ws) {
            	 scope.ws = null;
            	 try {
            		 if ('WebSocket' in window) {
            			 scope.ws = new WebSocket(url);
            		 } else if ('MozWebSocket' in window) {
            			 scope.ws = new MozWebSocket(url);
            		 } else {
            			 scope.ws = new WebSocket(url); 
            		 }
            		 if (scope.ws == null) {
            			 UtilService.error($translate.instant("websocketTip"), $translate.instant("common.tip"));
     					 return;
            		 }
            	 } catch(err) {
            		 console.error(err);
            	 }
            	 if (scope.ws == null) return;
                 scope.ws.onopen = function () {  
                	 
                 };  
                 scope.ws.onmessage = function (event) { 
                	
                 };  
                 scope.ws.onclose = function (event) { 
                	 if (scope.ws != null) {  
                		 scope.ws.close();  
                		 scope.ws = null;  
                     }  
                	 console.log('login:websocket.onclose method is called and event:' + event);  
                	 if (event.reason != '') {
                		 $window.location.reload();
                	 }
                 };  
                 scope.ws.onerror = function (event) {
                	 // 产生异常
                	 console.error('login:websocket.onerror method is called and event:' + event);  
                	 $window.location.reload();
                 }; 
            }
		}
	};
})
.directive('cascheckbox', function() {
	  return {
		require:'?ngModel',
		restrict : 'A',
		scope:{
			ngModel :'=',
			value :'@',
			inputReadonly: '@',
			falseValue:'@'
			
		},
		link : function(scope, element, attrs,ngModel) {
			
			var options = {
					onEnable : function() {
						if (angular.isDefined(scope.value)) {
							scope.ngModel=scope.value;
							ngModel.$setViewValue(scope.ngModel);
						} else {
							scope.ngModel = 1;
						}
					},
					onDisable : function() {
						if (angular.isDefined(scope.falseValue)) {
							scope.ngModel=scope.falseValue;
							ngModel.$setViewValue(scope.ngModel);
						} else {
							scope.ngModel = 0;
						}
					}
			};
			/*if(scope.inputReadonly != 'true'){
				$(element).checkbox(options);
			} else {
				$(element).parent().addClass('disable');
			}*/
			$(element).checkbox(options);
			$(element).children().on("click",function(e){
				if(scope.inputReadonly == 'true'){
//					e.stopPropagation();
					return false;
				}
			});
			$(element).on("click",function(e){
				if(scope.inputReadonly == 'true'){
//					e.stopPropagation();
					return false;
				}
			});
			scope.$watch("inputReadonly",function(newValue,oldValue){
				if(angular.isDefined(newValue)&&newValue=='true'){
					$(element).children('.corner-label').addClass("no-drop");
					$(element).children('.box').addClass("no-drop");
					$(element).find('.box-name').addClass("no-drop");
				}else{
					$(element).children('.corner-label').removeClass("no-drop");
					$(element).children('.box').removeClass("no-drop");
					$(element).find('.box-name').removeClass("no-drop");
				}
			});
		}
	};
})

.directive('spinner', function($timeout,$translate) {
      return {
        restrict : 'A',
        require:"?ngModel",
        scope:{
            ngModel :'=',
//          singleAngle:'@',    //单独使用（不和其他标签合在一起）时，设置true解决边框圆角样式问题
            embedGrid:'@',      //嵌入到列表中使用，设置true解决样式问题
            decimal:'@',        //如果是float型，设置保留小数的位数
            step:'@',           //设置递增或递减的步调
            spinnerMax:'@',
            spinnerMin:'@',
            spinnerError:'@',    //设置true，使用非列表的自定义错误提示
//          dirty:'@'           //脏值标志位
            allowBlank:'@',
			securityMode:'@'
        },
        link : function(scope, element, attrs, ngModel) {
            $(element).css("imeMode","disabled");   //禁用输入法
            var max = attrs.spinnerMax;
            var min = attrs.spinnerMin;
            scope.dirty=false;
            $(element).spinner();
//            $(element).spinner( "option", "numberFormat", "n" );
            if(angular.isDefined(scope.step)&&angular.isNumber(Number(scope.step))){
                $(element).spinner( "option", "step", Number(scope.step));
            }
            $(element).on("spinstart",function(event,ui){
                if($(element).attr("disabled")){
                     return false; 
                }
            });
            if(scope.embedGrid=='true'){
                $(element).parent().css("cssText", "height:28px;width: 100%;");
                $(element).css("cssText", "height:28px;");
            	$(element).css("border", "none");
                spinnerAlert('spinnerTip',element,true);
                
            }else if(scope.spinnerError=='true'){
                spinnerAlert($(element).attr("id"),element,false);
            }else{
                $(element).on('input',function(){
                    scope.dirty=true;
                    if(($(element).attr("required")&&isEmpty($(element).val()))||$(element).attr("intOrFloat")){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }
                }).blur(function(){
                    if(!$(element).hasClass("ng-invalid")){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("grayBorder");
                    }
                }).focus(function(){
                    if(!$(element).hasClass("ng-invalid")){
                        $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                    }
                });
            }
            scope.$watch("securityMode",function(newValue,oldValue){
            	if(!isEmpty(newValue)){
            		if( '1' == newValue){
            			scope.max_temp = max;
            			attrs.spinnerMax = 5;
            		} else if('0' == newValue) {
            			if(scope.max_temp != null && scope.max_temp != ''){
                			attrs.spinnerMax = scope.max_temp;
            			}
            		}
            		adjustFrame(newValue,oldValue,element);
            	}
            });
            
            //修改问题单201609230059 保密模式下登录认证失败尝试最大次数只能为5次 add by w13241 2016.9.27
            /**
             * 调整边框的样式
             * @param 数据模型新值 | 数据模型旧值 |element传入的元素
             */
            function adjustFrame(newValue,oldValue,element){
	            	var val=max=min=undefined;
            	    if (isEmpty(newValue)) {
            	        if (angular.isDefined(scope.allowBlank) && scope.allowBlank == "false") {
                            $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                            return;   
            	        }
            	        val = undefined;
            	    }else{
            	    	val=Number($(element).val());
            	    }
            	    if (!isEmpty(attrs.spinnerMax)) {
            	    	max=Number(attrs.spinnerMax);
            	    }
            	    if (!isEmpty(attrs.spinnerMin)) {
            	    	min=Number(attrs.spinnerMin);
            	    }
	                if(newValue!=oldValue||val<min||val>max){
	            	    if($(element).attr("required")&&isEmpty(val)){
	            			$(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
	            		}else if(!isEmpty(val)&&!isEmpty(max)&&val>max){
	            			$(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
	            		}else if(!isEmpty(val)&&!isEmpty(min)&&val<min){
	            			$(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
	            		}else if(typeof($(element).attr("memcheck")) != "undefined"){
	            			var size = attrs.unit == 'GB' || isEmpty(attrs.unit) ? (Number(newValue) * 1024).toFixed(0) : Number(newValue);
	    					if (size % 4 != 0){
	    						$(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
	    					}else {
	    						if(document.activeElement==element[0]){	//判断元素是否获取焦点
	                    			$(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
	                			}else{
	                    			$(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
	                			}
	    					}
	            		}else if(typeof($(element).attr("minutecheck")) != "undefined"){
                            var size = Number(newValue);
                            var numCheck = Number($(element).attr("minutecheck"));
                            if (!isNaN(numCheck)) {
                                if (size % numCheck != 0){
                                    $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                                }else {
                                    if(document.activeElement==element[0]){ //判断元素是否获取焦点
                                        $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                                    }else{
                                        $(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
                                    }
                                }
                            }
                        }else{
	//            			$(element).parent().css("border","solid 2px #57B382");
	            			if(document.activeElement==element[0]){	//判断元素是否获取焦点
	                			$(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
	            			}else{
	                			$(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
	            			}
	            		}
	            		
	            		if(!isEmpty(max) && !isEmpty(val) && val > max){
	            			ngModel.$setValidity("spinnerMax", false);
	            		} else {
	            			ngModel.$setValidity("spinnerMax", true);
	            		}
	            		if(!isEmpty(min) && !isEmpty(val) && val < min){
	            			ngModel.$setValidity("spinnerMin", false);
	            		} else {
	            			ngModel.$setValidity("spinnerMin", true);
	            		}
	            	} else {
	            	    var size = Number(newValue);
                        var numCheck = Number($(element).attr("minutecheck"));
                        if (!isNaN(numCheck)) {
                            if (size % numCheck != 0){
                                $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                            }else {
                                if(document.activeElement==element[0]){ //判断元素是否获取焦点
                                    $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                                }else{
                                    $(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
                                }
                            }
                        }
	            	}
	                
            }
            
        	//绑定model的控件在值发生变化时，检验值的有效性并调整spinner边框的样式
        	scope.$watch("ngModel",function(newValue,oldValue){
        			adjustFrame(newValue,oldValue,element);
            });
            if (angular.isDefined(max)) {
                // 设置控件的最大值属性
                $(element).spinner({
                    'max':max
                });
            }
            if (angular.isDefined(min)) {
                // 设置控件的最小值属性
                $(element).spinner({
                    'min':min
                });
            }
            scope.$watch("spinnerMax",function(newValue,oldValue){
                if(angular.isDefined(newValue)){
                    $(element).spinner({
                        'max':newValue
                    });
                    //$(element).attr("aria-valuemax", newValue);
                    
                    if(scope.ngModel!==Number($(element).val())){
                        $(element).val(scope.ngModel);
                    }
                    var val = $(element).val();
                    if(isEmpty(val)){   //注意：Number("")的值为0，故在此进行判断
                        val=undefined;
                    }else{
                        val=Number($(element).val());
                    }
                    var max=min=undefined;
                    if (!isEmpty(attrs.spinnerMax)) {
                        max=Number(attrs.spinnerMax);
                    }
                    if (!isEmpty(attrs.spinnerMin)) {
                        min=Number(attrs.spinnerMin);
                    }
                if(newValue!=oldValue||val<min||val>max){
                    if($(element).attr("required")&&isEmpty(val)){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }else if(!isEmpty(val)&&!isEmpty(max)&&val>max){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }else if(!isEmpty(val)&&!isEmpty(min)&&val<min){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }else{
//                      $(element).parent().css("border","solid 2px #57B382");
                        if(document.activeElement==element[0]){ //判断元素是否获取焦点
                            $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                        }else{
                            $(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
                        }
                    }
                    
                    if(!isEmpty(max) && !isEmpty(val) && val > max){
                        ngModel.$setValidity("spinnerMax", false);
                    } else {
                        ngModel.$setValidity("spinnerMax", true);
                    }
                    if(!isEmpty(min) && !isEmpty(val) && val < min){
                        ngModel.$setValidity("spinnerMin", false);
                    } else {
                        ngModel.$setValidity("spinnerMin", true);
                    }
                }
                }
            });
            scope.$watch("spinnerMin",function(newValue,oldValue){
                if(angular.isDefined(newValue)){
                    $(element).spinner("option", "min", newValue);
                    //$(element).attr("aria-valuemin", newValue);
                    
                    if(scope.ngModel!==Number($(element).val())){
                        $(element).val(scope.ngModel);
                    }
                    var val = $(element).val();
                    if(isEmpty(val)){   //注意：Number("")的值为0，故在此进行判断
                        val=undefined;
                    }else{
                        val=Number($(element).val());
                    }
                    var max=min=undefined;
                    if (!isEmpty(attrs.spinnerMax)) {
                        max=Number(attrs.spinnerMax);
                    }
                    if (!isEmpty(attrs.spinnerMin)) {
                        min=Number(attrs.spinnerMin);
                    }
                if(newValue!=oldValue||val<min||val>max){
                    if($(element).attr("required")&&isEmpty(val)){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }else if(!isEmpty(val)&&!isEmpty(max)&&val>max){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }else if(!isEmpty(val)&&!isEmpty(min)&&val<min){
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                    }else{
//                      $(element).parent().css("border","solid 2px #57B382");
                        if(document.activeElement==element[0]){ //判断元素是否获取焦点
                            $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                        }else{
                            $(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
                        }
                    }
                    
                    if(!isEmpty(max) && !isEmpty(val) && val > max){
                        ngModel.$setValidity("spinnerMax", false);
                    } else {
                        ngModel.$setValidity("spinnerMax", true);
                    }
                    if(!isEmpty(min) && !isEmpty(val) && val < min){
                        ngModel.$setValidity("spinnerMin", false);
                    } else {
                        ngModel.$setValidity("spinnerMin", true);
                    }
                }
                }
            });
            
            $(element).spinner({
                spin:function(event, ui) {  //在递增/递减的时候，该事件触发
                    var max=attrs.spinnerMax,min=attrs.spinnerMin,val=$(element).val(),step=$(element).spinner("option","step");
                    //由于spinner插件本身不支持浮点数的递增递减功能设置，自定义浮点数的加减运算，实现spinner插件的浮点数递增递减功能
                    scope.$apply(function(){
                        if(!isEmpty(max)&&ui.value>=Number(max)){
                            scope.ngModel=Number(max);
                        }else if(!isEmpty(min)&&ui.value<=Number(min)){
                            scope.ngModel=Number(min);
                        }else if(scope.ngModel<ui.value){
                            if(!isEmpty(max)&&Number(numAdd(val,step))>Number(max)){
                                scope.ngModel = Number(max);
                            }else if(!isEmpty(scope.decimal)&&angular.isNumber(Number(scope.decimal))){
                                scope.ngModel=Number(Number(numAdd(val,step)).toFixed(Number(scope.decimal)));//设置保留小数位数
                            }else{
                                scope.ngModel=Number(numAdd(val,step));
                            }
                        }else if(scope.ngModel>ui.value){
                            if(!isEmpty(min)&&Number(numSub(val,step))<Number(min)){
                                scope.ngModel = Number(min);
                            }else if(!isEmpty(scope.decimal)&&angular.isNumber(Number(scope.decimal))){
                                scope.ngModel=Number(Number(numSub(val,step)).toFixed(Number(scope.decimal)));//设置保留小数位数
                            }else{
                                scope.ngModel=Number(numSub(val,step));
                            }
                        }else{
                            scope.ngModel=Number(min);
                        }
                    });
                    return false;
                }
            });
            $(element).keydown(function(e){     // 控制键盘输入[0-9]数字、小数点                
                var e=e||event;
                if(e.shiftKey||e.ctrlKey||e.altKey) //按下ctrl、shift、alt键，不触发事件
                    return false;
                if(angular.isDefined($(element).attr("checkint"))&&(e.keyCode==110||e.keyCode==190)){   //只能输入整数时，不允许输入小数点
                    return false;
                } 
                //keyCode 48~57字母键上方的十个数字  |8退格键  |96~105小键盘内的十个数字  |110小键盘的的小数点  |37~40左上右下方向键  |46delete键 |190大键盘上的.键 |9Tab键
                if ( (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8||(e.keyCode > 95 && e.keyCode < 106)||e.keyCode==110||e.keyCode==37||e.keyCode==38||e.keyCode==39||e.keyCode==40||e.keyCode==46||e.keyCode==190||e.keyCode==9) { 
                    return true;  
                } else {  
                    return false;  
               }
            });
            /**
             * 列表的错误提示
             * @param eleId元素id |element传入的元素 |embedGrid 嵌入到列表标志位
             */
            function spinnerAlert(eleId,element,embedGrid){
                //实现嵌入到列表中的出错提示功能
                var orginalValue="",alertDiv='<div id="'+eleId+'Alert" class="tooltip in" style="overflow:hidden;display:none;"><div class="tooltip-inner"><div></div>';
                var upBtn$=$(element).next().eq(0),downBtn$=$(element).next().eq(1);
                $timeout(function(){
                    orginalValue=$(element).val();
                    //changeVal(element); //页面重新加载后数据校验                 

                });
                $(element).on('input',function(e){
                    changeVal(this);
                }).focus(function(){
                    if(!$(element).hasClass("ng-invalid")){
                        $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                    }
                }).blur(function(e){
                    if(embedGrid){
                        if($(element).hasClass("ng-invalid")){
                            $(element).val(orginalValue);       //update view
                            ngModel.$setViewValue(orginalValue); //update model
                        }
                        $(element).parent().removeClass("greenBorder redBorder").addClass("grayBorder");
                    }else{
                        if(!$(element).hasClass("ng-invalid")){
                            $(element).parent().removeClass("greenBorder redBorder").addClass("grayBorder");
                        }
                    }
                    $("#"+eleId+"Alert").hide();    //remove
                });
                upBtn$.click(function(){
                    changeVal(this);
                });
                downBtn$.click(function(){
                    changeVal(this);
                });
                
                $(element).parent().mouseenter(function(){
                    var self=this,x=Math.round(($(element).width())/2),y=40;
                    if($(element).hasClass("ng-invalid")&&document.getElementById(eleId+"Alert")){
                        handleScroll();
                        $("#"+eleId+"Alert").css({"top": ($(self).offset().top+y) + "px","left": ($(self).offset().left+x) +"px"}).show();
                    }
                }).mouseleave(function(){
                    $("#"+eleId+"Alert").hide();    //remove
                });
                function changeVal($this){
                    var x=Math.round(($(element).width())/2),y=40,alertinfo="";
                    var self=$this;
                    if($(self).hasClass("ng-invalid")){  //出错类型判断
                        if($(self).hasClass("ng-invalid-required")){
                            alertinfo=$translate.instant("require");
                        }else if($(self).hasClass("ng-invalid-spinner-max")){
                            alertinfo=$translate.instant("maxValueIs")+$(self).attr("spinner-max");
                        }else if($(self).hasClass("ng-invalid-spinner-min")){
                            alertinfo=$translate.instant("minValueIs")+$(self).attr("spinner-min");
                        }else if($(self).hasClass("ng-invalid-int")){
                            alertinfo=$translate.instant("invalidint");
                        }else if($(self).hasClass("ng-invalid-intfloat")){
                            alertinfo=$translate.instant("invalidintfloat");
	    				}else if($(self).hasClass("ng-invalid-memcheck")){
	    					alertinfo=$translate.instant("invalidmemcheck");
                        }else if($(self).hasClass("ng-invalid-minutecheck")){
                            alertinfo=$translate.instant("invalidminutecheck");
                        }
                        $(element).parent().removeClass("grayBorder greenBorder").addClass("redBorder");
                        if(!document.getElementById(eleId+"Alert")){
                            if($("#bodyid").find(".modal:last")[0]){
                                $(".modal:last").append(alertDiv);  //将弹出的div添加到遮罩层中
                            }else{
                                handleScroll();
                                $("#bodyid").append(alertDiv);
                            }
                        }
                        $("#"+eleId+"Alert").children().eq(0).text(alertinfo);
                        $("#"+eleId+"Alert").css({"top": ($(self).offset().top+y) + "px","left": ($(self).offset().left+x) +"px"}).hide();  //设置X  Y坐标， 并且显示
                    }else{
                        if(document.activeElement==element[0]){ //判断元素是否获取焦点
                            $(element).parent().removeClass("grayBorder redBorder").addClass("greenBorder");
                        }else{
                            $(element).parent().removeClass("redBorder greenBorder").addClass("grayBorder");
                        }
                        $("#"+eleId+"Alert").remove();    //remove
                    }
                };
                //handle html scroll
                function handleScroll(){
                    var clientWidth=document.documentElement.offsetWidth,clientHeight=document.documentElement.offsetHeight;
                    if($("#bottomPanel").css("display")!='none'){   //判断页面上是否显示任务台
                        clientHeight+=$("#bottomPanel").height();
                    }
                    if (document.documentElement.scrollWidth ==clientWidth ){
                        $(document.documentElement).css("overflow-x","hidden"); //remove horizontal scrollbar
                    }
                    if (angular.isDefined($("#main")[0])&&$("#main")[0].scrollHeight ==clientHeight ){
                        $("#main").css("overflow-y","hidden");  //remove vertical scrollbar
                    }
                }
            }
            
            /** 
            * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。 
            * 
            * @param num1加数1 | num2加数2 
            */ 
            function numAdd(num1, num2) { 
                var baseNum, baseNum1, baseNum2; 
                try { 
                    baseNum1 = num1.toString().split(".")[1].length; 
                } catch (e) { 
                    baseNum1 = 0; 
                } 
                try { 
                    baseNum2 = num2.toString().split(".")[1].length; 
                } catch (e) { 
                    baseNum2 = 0; 
                } 
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2)); 
                return (numMulti(num1,baseNum) + numMulti(num2,baseNum)) / baseNum; 
            }; 
            /** 
            * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。 
            * 
            * @param num1被减数 | num2减数 
            */ 
            function numSub(num1, num2) { 
                var baseNum, baseNum1, baseNum2; 
                var precision;// 精度 
                try { 
                    baseNum1 = num1.toString().split(".")[1].length; 
                } catch (e) { 
                    baseNum1 = 0; 
                } 
                try { 
                    baseNum2 = num2.toString().split(".")[1].length; 
                } catch (e) { 
                    baseNum2 = 0; 
                } 
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2)); 
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2; 
                return ((numMulti(num1,baseNum) - numMulti(num2 , baseNum)) / baseNum).toFixed(precision); 
            };
            /** 
            * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。 
            * 
            * @param num1被乘数 | num2乘数 
            */ 
            function numMulti(num1, num2) { 
                var baseNum = 0; 
                try { 
                    baseNum += num1.toString().split(".")[1].length; 
                } catch (e) { 
                } 
                try { 
                    baseNum += num2.toString().split(".")[1].length; 
                } catch (e) { 
                } 
                return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum); 
            }; 
            
        }           
    };
})
.directive('loadbackground', function() {
	return function(scope, element, attrs){
        var url = attrs.loadbackground;
        if (url) {
        	$("body").css({
//        	'background': 'url("' + url + '") no-repeat scroll 0 0 rgba(0, 0, 0, 0) ',
        		'background': 'url("' + url + '") no-repeat scroll 0 0 #042048 ',
//        	"background-size":'100% 100%',
        		"background-attachment":'fixed',
        		"background-position":"center"
        			
        	});
        } else {
        	$("body").addClass("bodyHasImage");
        }
    };
})
.directive('removebackground', function() {
	  return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			$("body").removeClass("bodyHasImage");
			$("body").css({
				"background-image" : 'none ',
			    "background-color" : 'rgba(0, 0, 0, 0) '
			});
		}
	};
})
.directive( 'popoverBox',['$http', function ($http) {
	  return {
		    restrict: 'EA',
				    scope : {
					title : '@',
					content : '@',
					placement : '@',
					animation : '&',
					isOpen : '&',
					boxdata: '=',
					datahref: '@',
					bindModel :'='
				},
			link : function(scope, element, attrs) {
				
				$(element).on('click',function(){
					if($(element).attr('aria-describedby')){
						$(element).popover('hide');
					}else{
						$http({
							method : 'GET',
							url : scope.datahref
						}).success(function(result) {
							var str = "";
							var data = result;
							if (!angular.isArray(result)) {
								data = result.data;
							}
							for (var i=0,len=data.length; i<len; i++)
							{
								str +='<div class="cas-checkbox labeled-btn">'
									+'<input id="unique-id" name="somename" type="radio" value="'+i+'">'
									+'<div class="corner-label"><i class="glyphicon glyphicon-ok icon"></i></div>'
								    +' <div class="box"><span class="box-name">'
								    +data[i].text
								    +'</span></div></div>'
								    
							}
							var chooseClusterOptions = {
									title : "选择",
									trigger : "click",
									content : str,
									html : true
								};
							$(element).popover(chooseClusterOptions);
							$(element).popover('show');
							var popoverid = $(element).attr('aria-describedby');
							
							var options = {
									onEnable : function() {scope.bindModel=scope.value;}
									// onDisable : function()
									// {scope.bindModel="否"},
							};
							$("#"+popoverid).find(".cas-checkbox").each(function(){
								var options = {
										onEnable : function() {
											scope.bindModel=data[$(this).val()];
											$(element).popover('hide');      // 选中后关闭popover
										}
										// onDisable : function()
										// {scope.bindModel="否"},
								}
								$(this).checkbox(options);
							});
						}).error(function(data) {
							var chooseClusterOptions = {
									title : "选择",
									trigger : "click",
									content : "获取数据失败"
								};
							$(element).popover(chooseClusterOptions);
							$(element).popover('show');
						});
					}

				})
				
				
			}
	 };
}])
.directive('popoverProgress', function() {
	  return {
		restrict : 'EA',
		scope:{
			data: '='
		},
		link : function(scope, element, attrs) {
			var str = '<div class="popover-progress">';
			for (var i=0; i<10; i++)
			{
				str +='<div class="">'
					+ '<div class="">'
					+ 'cvk-27'
					+ ' </div><div class="progress-content">';
				str +='<div class="progress progress-blue">'
					+ '<div class="progress-bar" role="progressbar" aria-valuenow="'
					+ '60'
					+ '" aria-valuemin="0" aria-valuemax="100" style="width: '
					+ '60'
					+ '%;"><span>'
					+ '60'
					+ '%</span></div></div>';
				str +='<div class="progress-info"><span class="glyphicon glyphicon-ok-circle"></span>删除成功</div>';
				str +='</div></div>';
				    
			}
			str +='</div>';
			var progressOptions = {
					trigger : "click",
					content : str,
					html : true,
					placement: 'bottom'
				};
			$(element).popover(progressOptions);
			// $(element).popover('show');
		}
	};
})
.directive('picture', function() {
	  return {
			restrict : 'EA',
			scope:{
				width: '@',
				height: '@',
				src: '@',
				text: '@'
					
			},
			template: '<div><span class="picture" style="width:{{width}};height:{{height}};">'
				+'<img src="{{src}}"></span>'
				+'<span class="picture-text">{{text}}</span></div>',
			replace: true
		
		};
	})
.directive('formDatetime', function() {
	  //该时间控件已废弃，使用新的时间控件，详见jesDate
	  return {
			restrict : 'EA',
			require: 'ngModel',
			scope:{
				width: '@',
				height: '@',
				src: '@',
				text: '@',
				maxDate: '=',
				minDate: '=',
				initialDate: '=',
				position:'@',
				minView: '@',//show the min view(0-4: second minute hour day month year)
				format: '@',  //show format used with minView
				todayBtn : '@'				
			},
			link : function(scope, element, attrs, ngModel) {
				if (angular.isUndefined(scope.minView)) {
					scope.minView = 2;
				}
				if (angular.isUndefined(scope.format)) {
					scope.format = "yyyy-mm-dd";
				}
				
				if (angular.isUndefined(scope.todayBtn)) {
                    scope.todayBtn = true
                } else if (scope.todayBtn == 'false') {
                    scope.todayBtn = false;
                }
				
				if (angular.isUndefined(scope.position)) {
					scope.position = "bottom-right";
				}
				this.el = $(element);
				this.el.datetimepicker({
					format: scope.format,
					language:"cn",
			        weekStart: 0,
			        todayBtn:  scope.todayBtn,
					autoclose: scope.minView,
					todayHighlight: 1,
					startView: 2,
					minView: scope.minView,
//					maxView: 1,//scope.minView,
					forceParse: 0,
			        showMeridian: 0,
			        minuteStep:10,
			        initialDate: scope.initialDate,
			        pickerPosition:scope.position
			    });
				//当日期改变时，对ngModel进行赋值
				el.datetimepicker().on('changeDate', function(event) {
//				    alert($(element).datetimepicker('getFormattedDate'));
//				    var timeValue = new Date(event.date.valueOf()).Format("yyyy-MM-dd HH:mm:ss");
//				    ngModel.$setModelValue(timeValue);
				    if (angular.isDefined(ngModel)) {
				        ngModel.$setViewValue($(element).datetimepicker('getFormattedDate'));
				    }
				});
				scope.$watch("maxDate", function(newValue, oldValue){
					if(angular.isDefined(scope.maxDate)){
						var value = "";
						value += scope.maxDate.getFullYear() + "-";
						var month = scope.maxDate.getMonth() + 1;
						if(month < 10){
							value += "0" + month + "-"; 
						}else{
							value += month + "-";
						}
						var day = scope.maxDate.getDate();
						if(day < 10){
							value += "0" + day + " ";
						}else{
							value += day + " ";
						}
						if (scope.minView == 0) {
    						var hour = scope.maxDate.getHours();
    						if(hour < 10){
                                value += "0" + hour + ":";
                            }else{
                                value += hour + ":";
                            }
    						var minute = scope.maxDate.getMinutes();
                            if(minute < 10){    
                                value += "0" + minute + ":";
                            }else{
                                value += minute + ":";
                            }
                            var second = scope.maxDate.getSeconds();
                            if(second < 10){
                                value += "0" + second;
                            }else{
                                value += second + "";
                            }
						}
                        $(element).datetimepicker('setEndDate', value);
					} else {
                        $(element).datetimepicker('setEndDate', null);
					}
					
				}, true);
				scope.$watch("minDate", function(newValue, oldValue){
					if(angular.isDefined(scope.minDate)){
						var value = "";
						value += scope.minDate.getFullYear() + "-";
						var month = scope.minDate.getMonth() + 1;
						if(month < 10){
							value += "0" + month + "-"; 
						}else{
							value += month + "-";
						}
						var day = scope.minDate.getDate();
						if(day < 10){
							value += "0" + day + " ";
						}else{
							value += day + " ";
						}
						if (scope.minView == 0) {
                            var hour = scope.minDate.getHours();
                            if(hour < 10){
                                value += "0" + hour + ":";
                            }else{
                                value += hour + ":";
                            }
                            var minute = scope.minDate.getMinutes();
                            if(minute < 10){
                                value += "0" + minute + ":";
                            }else{
                                value += minute + ":";
                            }
                            var second = scope.minDate.getSeconds();
                            if(second < 10){
                                value += "0" + second;
                            }else{
                                value += second + "";
                            }
						}
						$(element).datetimepicker('setStartDate', value);
					} else {
                        $(element).datetimepicker('setStartDate', null);
					}
					
				}, true);
			}
		
		};
	})
angular.module('ui.casTag.input.selectInput',[])
.controller('SelectInputController', ['$scope',function ($scope) {
	var self = this,
    options = self.options = $scope.options,isShowing;
	$scope.value=options?options[0]:"";
	$scope.toggle = function() {
	    if (!isShowing) {
	    	isShowing = true;
	    }else{
	    	isShowing = false;
	    }
	};
	$scope.isShow = function() {
	   return isShowing;
	};
	$scope.setValue = function(option,index) {
		$scope.value=option;
		$scope.option=index;
		$scope.toggle();
	};
}])
.directive('selectInput',function($timeout){
	 return {
// controller: 'SelectInputController',
		    restrict:'E',
		    templateUrl: 'html/template/input/select.html',
		    replace: true,
		    scope:{
		    	inputId:"@",
		    	inputName:"@",
		    	inputReadonly:"@",
		    	options:'=',
		    	bindModel :'=',
		    	//用在select-input做单位跟在别的输入框之后的情况，border-top-left-radius和border-bottom-left-radius设置为0
		    	rightAngle:"@",
		    	leftAngle:"@",
		    	embedGrid:"@",
		    	cutWidth:"@"	//设置截断长字符串的宽度（px单位），默认为200
		    },
		    link:function(scope, element, attrs){
		    	//去掉下拉框在IE浏览器中的空行问题
		    	scope.$watch("options", function() {
		    		$timeout(function() {
		    			if (document.getElementById(scope.inputId)) {
			    			document.getElementById(scope.inputId).selectedIndex = -1;
				    		if (angular.isArray(scope.options)) {
				    			var length = scope.options.length;
				    			for (var i = 0; i < length; i++) {
				    				if (scope.bindModel == scope.options[i].value) {
				    					document.getElementById(scope.inputId).selectedIndex = i;
				    					break;
				    				}
				    			}
				    		}
			    		}
		    		}, 200);
		    	}, true);
		    	//删除选中的下拉框的选中项后再初始化下拉框中的索引，确保下次能成功选中下拉框中的值
		    	scope.$watch("bindModel", function() {
		    			if (document.getElementById(scope.inputId)) {
			    			document.getElementById(scope.inputId).selectedIndex = -1;
				    		if (angular.isArray(scope.options)) {
				    			var length = scope.options.length;
				    			for (var i = 0; i < length; i++) {
				    				if (scope.bindModel == scope.options[i].value) {
				    					document.getElementById(scope.inputId).selectedIndex = i;
				    					break;
				    				}
				    			}
				    		}
			    		}
		    	});
		    	if(angular.isUndefined(scope.cutWidth)){
		    		scope.cutWidth=200;
		    	}
		    	if(scope.rightAngle){
		    		$(element).children().eq(0).addClass("last-child-angle");
		    		$(element).children("label").eq(0).css({"cssText":"border-left:0 !important;"});
		    	}
		    	if(scope.leftAngle){
		    		$(element).children().eq(0).addClass("first-child-angle");
		    		$(element).children("label").eq(0).css({"cssText":"border-top-right-radius:0 !important;border-bottom-right-radius:0 !important"});
		    	}
		    	$(element).on("click",function(e){
		    		if(scope.inputReadonly=='true'){
		    			return false;
		    		}
		    	});

		    	
	    		$(element).children().eq(1).focus(function(){ 	//边框在获取焦点时变成绿色，失去焦点时恢复原样
	        		var self=this;
		    		if(scope.rightAngle){
	        			$(self).prev().css("cssText","border-left:0 !important;");
//	        			$(self).prev().css("cssText","border:solid 2px #57B382;border-left:0 !important;");
		        		$(self).prev().removeClass("grayBorder").addClass("greenBorder");
	        		}else{
//			        		$(self).prev().css("border","solid 2px #57B382");
	        			$(self).prev().removeClass("grayBorder").addClass("greenBorder");
	        		}
	        	}).blur(function(){
	        		var self=this;
	        		if(scope.rightAngle){
	        			$(self).prev().css("cssText","border-left:0 !important;");
//			        		$(self).parent().parent().prev().css("border","2px solid #CBCAD8");
	        			$(self).prev().removeClass("greenBorder").addClass("grayBorder");
	        		}else{
//			        		$(self).prev().css("border","2px solid #CBCAD8");
	        			$(self).prev().removeClass("greenBorder").addClass("grayBorder");
	        		}
//			    		$(element).children("label").eq(0).css({"cssText":"border-left:0 !important;"});
	        	});
	    		if(angular.isDefined(scope.embedGrid) && scope.embedGrid == 'true'){
	    			$(element).children().eq(0).css({"cssText":"top:5px;height:28px;"});
	    		}
			 }
		    
		    	
	 
				 /*
					 * , link:function(scope,element,attrs){
					 * element.bind('click',function(){
					 * element.removeClass('active'); });
					 *  }
					 */
				 
		  };
})
.directive('selectInput2',function(){
	 return {
// controller: 'SelectInputController',
		    restrict:'E',
		    templateUrl: 'html/template/input/select2.html',
		    replace: true,
		    scope:{
		    	inputId:"@",
		    	inputName:"@",
		    	options:'=',
		    	bindModel :'=' 
		    }/*
				 * , link:function(scope,element,attrs){
				 * element.bind('click',function(){
				 * element.removeClass('active'); }); }
				 */
		  };
}).directive('selectInputNggrid',function(){ //ng-grid专用的
	 return {
		// controller: 'SelectInputController',
				    restrict:'E',
				    templateUrl: 'html/template/input/select-nggrid.html',
				    replace: true,
				    scope:{
				    	inputId:"@",
				    	inputName:"@",
				    	options:'=',
				    	bindModel :'=' 
				    }/*
						 * , link:function(scope,element,attrs){
						 * element.bind('click',function(){
						 * element.removeClass('active'); }); }
						 */
				  };
}).directive('fileInput',function(){
	 return {
		    restrict:'A',
		    link:function(scope,element,attrs){
		    	var ipt=element.find('input');
		    	var span=element.find('span');
// element.bind('click',function(){
// ipt[0].click();
// });
		    	ipt.bind('change',function(){
		    		var str = ipt.val();
		    		span.html(getFileNameOfAppJS(str));
		    	})
		    }
		  };
}).directive('casCpu', function($modal) {
    // 虚拟机cpu设备
    return {
        restrict:'A',
// require: 'ngModel',
        templateUrl: 'html/template/input/casCpu.html',
        replace: true,
        scope:{
            bindModel :'=',     // 绑定的虚拟机实体，用于传参
            hostCpuNum : '=',   // 主机cpu数量
            cpuModel : '=',     // cpu工作模式选项数据
            cpuArch : '=',      // cpu体系结构选项数据
            cpuPriority : '=',  // cpu调度优先级选项数据
            ioPriority : '=',   // I/O优先级选项数据
            isCluster : '@'
        },
        link:function(scope,element,attrs){
            // 控制提示小三角
            scope.isCollapse = function() {
                var ele = $('#cpuCollapse');
                var casCpu = $('#cascpu');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });  
            };
            //bind cpu
            scope.bindPcpuSet = function() {
            	if (angular.isUndefined(scope.bindModel.vcpuin)) {
            		scope.bindModel.vcpuin = {};
            	}  
            	if (angular.isUndefined(scope.bindModel.bindPcpu)) {
            		scope.bindModel.bindPcpu = [];
            	}  
            	var body = {};
            	body.hostId = scope.bindModel.hostId;
            	body.cpu = {};
            	body.cpu.cpudetail = {};
            	body.cpu.cpudetail.cpuSocket = scope.bindModel.cpuSocket;
            	body.cpu.cpudetail.cpuCore = scope.bindModel.cpuCore;
            	body.cpu.cpudetail.hostValue = scope.hostCpuNum;
            	body.cpu.cpudetail.bindPhysicalCpu = [];
            	if (scope.bindModel.bindPcpu.length > 0) {
            		for (var pv = 0; pv < scope.bindModel.bindPcpu.length; pv++) {
            			var vc = {};
	            		vc.vcpu = scope.bindModel.bindPcpu[pv].id;
	            		vc.cpuset = scope.bindModel.bindPcpu[pv].devId;
	            		body.cpu.cpudetail.bindPhysicalCpu.push(vc);
            		}
            	} else {
	            	angular.forEach(scope.bindModel.vcpuin, function(data, index, obj) {
	            		var vc = {};
	            		vc.vcpu = index;
	            		vc.cpuset = data;
	            		body.cpu.cpudetail.bindPhysicalCpu.push(vc);
	            	});
            	}
            	var resolve = { vmId: function() {},
				 		 body: function() {return body;},
				 		 isAdd: function() {return true}};
				var modalInstance = $modal.open({
					     templateUrl: 'html/modal/vmEdit/bindVirtualCPU.html',
					     controller: 'BindVCPUCtrl',
					     backdrop:'static',
					     resolve:resolve
					}
				);
				modalInstance.result.then(function (result) {
					if (result != 'cancel' && angular.isArray(result)) {
						scope.bindModel.bindPcpu.splice(0, scope.bindModel.bindPcpu.length);// clear vcpuin
						for (var i = 0; i < result.length; i++) {
							var pcpuList = result[i];
							var pcpuIds = '';
							if (angular.isArray(pcpuList)) {
								for (var j = 0; j < pcpuList.length; j++) {
									pcpuIds = pcpuIds + pcpuList[j].pcpuId;
									if (j != pcpuList.length -1) {
										pcpuIds = pcpuIds + ',';
									}
								}
							}
							var vcpu = {};
							vcpu.id = i;
							vcpu.devId = pcpuIds;
							scope.bindModel.bindPcpu.push(vcpu);
						}
					};
		        }, function () {
		        });
            };
        }
    };
}).directive('casMemory', function() {
    // 虚拟机内存设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casMemory.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的虚拟机实体，用于传参
            hostMemory : '=',       // 主机内存
            hostMemoryUnit : '@',   // 主机内存单位
            memoryUnit : '=',       // 内存单位选项数据
            priority : '=',         // I/O优先级选项数据
            minMemory : '@'		    //set min memory value
        },
        link:function(scope,element,attrs){
            // 控制提示小三角
            scope.isCollapse = function() {
                var ele = $('#memoryCollapse');
                var spanEle = $('#memoryCollapseIcon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });   
            };
        }
    }
}).directive('casNetwork', function() {
    // 虚拟机网卡设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casNetwork.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的虚拟机实体，用于传参
            index : '@',            // 网卡序号
            networkType : '=',      // I/O优先级选项数据
            deleteIcon : '@',       // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        // 这个可以再优化成公用controller，供硬件调用
        controller: function($scope, $element, $attrs, $translate, $http, $timeout, UtilService) {
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#networkCollapse' + $scope.index);
                var spanEle = $('#networkCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });   
            };
            // 删除网卡
            $scope.deletNetwork = function() {  
                // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.network') + $scope.index};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.networks[$scope.index] = undefined; //delete data from net work array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择虚拟交换机
            $scope.selectVswitch = function() {
            	var resolve = {
        	        inputParam: function() {
                        var inputParam = {};
                        inputParam.hostId = $scope.hostId;
                        return inputParam;
                    },
            		clusterId: function() {return $scope.clusterId;}
                };
            	var vswitchInstance = undefined;
            	if ($scope.isCluster == "true") {
            		vswitchInstance = UtilService.modal('html/modal/common/vswitchSelectorInCluster.html', 'vswitchSelectInClusterCtrl', resolve);
            	} else {
            		vswitchInstance = UtilService.lgmodal('html/modal/common/vswitchSelector.html', 'vswitchSelectCtrl', resolve);
            	}	    
          	    vswitchInstance.result.then(function (selectedItem) {
          	    	if (angular.isDefined(selectedItem)) {
          	    		// 点击了确定按钮
                		$scope.bindModel.name = selectedItem.name;
                		$scope.bindModel.vswitchId = selectedItem.id;
                		if (reason.mode == '0') {
                			$scope.bindModel.mode = 'veb';
                			$scope.mode = 0;
                		} else if (reason.mode == '1') {
                			$scope.bindModel.mode = 'vepa';
                			$scope.mode = 1;
                		} else if (reason.mode == '2') {
                			$scope.mode = 2;
                		};
          	    	}
                }, function (reason) {
                });
            };
            // 选择网络策略模板
            $scope.selectProfile = function() {
            	var resolve = {
            		vswitch:function(){},
            		cloudId: function() {
            			return $scope.cloudId;
            		}
            	};
          	    var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
          	    profileInstance.result.then(function (selectedItem) {
          	    	if (angular.isDefined(selectedItem)) {
                		  // 点击了确定按钮
                		 $scope.bindModel.profileId = selectedItem.id;
                		 $scope.bindModel.profileName = selectedItem.name;
                		 $scope.bindModel.vsiMngId = selectedItem.vsiMngId;
                		 $scope.bindModel.vsiTypeId = selectedItem.vsiTypeId;
                		 $scope.bindModel.vsiTypeVer = selectedItem.vsiTypeVer;
                		 $scope.bindModel.vsiIdFormat = selectedItem.vsiIdFormat;
                	   }
                }, function (reason) {
              	   
                });
            };
            $scope.getMac = function() {
            	$http.get('domain/getMacAddress').
            	success(function(result) {
            		if (result.state == 0) {
            			$timeout(function() {$scope.bindModel.mac = result.data.macAddress;});
            		}
            	}).
            	error(function(response, code, headers, config) {
            		
        		});
            };
            // 选择default网络策略模板和虚拟机交换机
            $element.ready(function() {
            	var param = {};
            	$http({
        			methed: 'GET',
        			url:'network/portprofile',
        			params:param
        		}).success(function(result) {
        			if (angular.isArray(result.data) && result.data.length > 0) {
        				var firstProfile = result.data[0];
        				$scope.bindModel.profileId = firstProfile.id;
                 		$scope.bindModel.profileName = firstProfile.name;
                 		$scope.bindModel.vsiMngId = firstProfile.vsiMngId;
                        $scope.bindModel.vsiTypeId = firstProfile.vsiTypeId;
                        $scope.bindModel.vsiTypeVer = firstProfile.vsiTypeVer;
                        $scope.bindModel.vsiIdFormat = firstProfile.vsiIdFormat;
        			}
        		}).error(function(response, code, headers, config) {
        		
        		});
            	//默认选中vswitch0
            	var vswitchParam = {};
            	var promise = null;
            	if ($scope.isCluster == 'true') {//集群下增加
            	    vswitchParam.clusterId = $scope.clusterId;
            	    promise = $http({
                        methed: 'GET',
                        url:'network/cluster/vswitchs',
                        params:vswitchParam
                    });
            	} else {
            	    promise = $http.get('network/host/' + $scope.hostId +'/vswitchs');
            	}
            	if (promise == null) {
            	    return;
            	}
            	promise.success(function(result) {
                    if (result.state == 0 && angular.isArray(result.data) && result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            if (result.data[i].name == 'vswitch0') {
                                $scope.bindModel.name = result.data[i].name;
                                $scope.bindModel.vswitchId = result.data[i].id;
                                if (result.data[i].mode == '0') {
                                  $scope.bindModel.mode = 'veb';
                                  $scope.mode = 0;
                                } else if (result.data[i].mode == '1') {
                                  $scope.bindModel.mode = 'vepa';
                                  $scope.mode = 1;
                                } else if (result.data[i].mode == '2') {
                                  $scope.mode = 2;
                                };
                                return;
                            }
                        }
                    }
                    UtilService.handleResult(result);
                }).error(function(response, code, headers, config) {
                    UtilService.handleError(code);
                });
            });
        }
    };
}).directive('casDisk', function() {
    // 虚拟机磁盘设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casDisk.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的虚拟机实体，用于传参
            index : '@',            // 网卡序号
            busType : '=',          // 总线类型
            volType : '=',          // 磁盘类型
            cacheType : '=',         // 缓存方式
            deleteIcon : '@',         // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        controller: function($scope, $element, $attrs, $translate, UtilService) {
        	//set default values
        	$scope.bindModel.diskDevice = 'disk';
        	$scope.diskModel = {};
        	$scope.diskModel.diskUnit = 'GB';
        	
            $scope.diskUnits = [{value:'MB',label:"MB"},
                                {value:'GB',label:'GB'},
                                {value:'TB',label:'TB'}];
            $scope.formats = [{value:'raw', label:$translate.instant('storagePool.raw')},
                              {value:'qcow2', label:$translate.instant('storagePool.qcow2')}];
            if ($scope.isCluster == 'true') {
            	$scope.capacity = 10;
            } else {
            	$scope.capacity = 0;
            }
            
            $scope.$watch('diskModel.diskUnit', function(newValue, oldValue) {
            	if (angular.isUndefined(newValue)) {
            		// unit unchanged
            		$scope.bindModel.capacity = $scope.capacity * 1024;
            		return;
            	}
            	if (newValue == 'GB') {
            		$scope.bindModel.capacity = $scope.capacity * 1024;
            	} else if (newValue == 'TB') {
            		$scope.bindModel.capacity = $scope.capacity * 1024 * 1024;
            	} else {
            		$scope.bindModel.capacity = $scope.capacity;
            	}            	
            });
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#diskCollapse' + $scope.index);
                var spanEle = $('#diskCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });   
            };
            // 删除磁盘
            $scope.deleteDisk = function() {
              // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.disk') + $scope.index};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.storages[$scope.index] = undefined; //delete data from array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择存储卷
            $scope.selectVolume = function() {
            	var resolve = {
            	        paramsObj: function () {return {hostId:$scope.hostId}; }
                };
          	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
          	    storeFileInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.storeFile = reason.filePath;
              		  $scope.bindModel.driveType = reason.format;
              		  $scope.bindModel.capacity = reason.capacity;
              	   }
                });
            };
            // select storage pool
            $scope.selectStoragePool = function() {
            	var resolve = {
                        hostId: function () {return $scope.hostId; },
            			clusterId: function() {return $scope.clusterId;},
            			isCluster: function() {return $scope.isCluster;}
                    };
              	var poolInstance = UtilService.lgmodal('html/modal/common/storagepoolSelectorInCluster.html', 'storagePoolSelectInClusterCtrl', resolve);
              	poolInstance.result.then(function (selectedItem) {
     	 	    }, function (reason) {
     	 	    	if(angular.isDefined(reason) && reason != 'cancel') {
     	 	    		$scope.bindModel.poolName = reason.poolName;
     	 	    	};
     	 	    });
            };
        }
    };
}).directive('casFloppy', function() {
    // 虚拟机磁盘设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casFloppy.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的实体，用于传参
            index : '@',            // 序号
            deleteIcon : '@',       // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        controller: function($scope, $element, $attrs, $translate, UtilService) {
        	//set default values
        	$scope.bindModel.diskDevice = 'floppy';

        	$scope.connetType = [{value:'autoVirtio', label:$translate.instant('addDomain.autoVirtio')},
        	                     {value:'imgFileName', label:$translate.instant('addDomain.fromImage')}];

        	$scope.$watch('bindModel.driveType', function(newValue, oldValue) {
        		if ($scope.bindModel.driveType=='autoVirtio') {
        			$scope.bindModel.storeFile = $translate.instant('addDomain.autoVirtio');
        		} else {
        			$scope.bindModel.storeFile = '';
        		}
        	});
        	
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#floppyCollapse' + $scope.index);
                var spanEle = $('#floppyCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });   
            };
            // 删除磁盘
            $scope.deleteFloppy = function() {
              // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.floppy') + ($scope.index == '0' ? '' : $scope.index)};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.floppies[$scope.index] = undefined; //delete data from array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择存储卷(virtio dirver)
            $scope.selectVolume = function() {
            	var resolve = {
            	    paramsObj: function () {return {hostId:$scope.hostId}; }
                };
          	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
          	    storeFileInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.storeFile = reason.filePath;
              	   }
                });
            };
        }
    };
}).directive('casCdrom', function() {
    // 虚拟机磁盘设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casCdrom.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的实体，用于传参
            index : '@',            // 序号
            deleteIcon : '@',       // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        controller: function($scope, $element, $attrs, $translate, UtilService) {
        	//set default values
        	$scope.bindModel.diskDevice = 'cdrom';

        	$scope.connectType = [{value:'imgFileName', label:$translate.instant('addDomain.fromImage')},
        	                      {value:'host_cdrom', label:$translate.instant('addDomain.fromCD')}];

        	$scope.$watch('bindModel.driveType', function(newValue, oldValue){
        		if ($scope.bindModel.driveType=='host_cdrom') {
        			$scope.bindModel.storeFile = '/dev/cdrom';
        		} else {
        			$scope.bindModel.storeFile = '';
        		}
        	});
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#cdromCollapse' + $scope.index);
                var spanEle = $('#cdromCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });    
            };
            // 删除磁盘
            $scope.deleteCdrom = function() {
              // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.cdrom') + ($scope.index == '0' ? '' : $scope.index)};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.cdroms[$scope.index] = undefined; //delete data from array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择存储卷(virtio dirver)
            $scope.selectVolume = function() {
            	var resolve = {
            	    paramsObj: function () {return {hostId:$scope.hostId}; }
                };
          	    var storeFileInstance = UtilService.lgmodal('html/modal/common/storageFileSelector.html', 'storageFileSelectCtrl', resolve);
          	    storeFileInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.storeFile = reason.filePath;
              	   }
                });
            };
        }
    };
}).directive('casGpu', function() {
    // 虚拟机磁盘设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casGpu.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的实体，用于传参
            index : '@',            // 序号
            deleteIcon : '@',       // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        controller: function($scope, $element, $attrs, $translate, UtilService) {
        	$scope.gpuPoolHodler = $translate.instant('addDomain.gpuPool');
        	
        	$scope.bindModel.devType = 2;		//set type is GPU
        	
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#gpuCollapse' + $scope.index);
                var spanEle = $('#gpuCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });   
            };
            // 删除磁盘
            $scope.deleteGpu = function() {
              // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.gpu') + ($scope.index >= 1 ? $scope.index : '')};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.gpus[$scope.index] = undefined; //delete data from array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择GPU resource pool
            $scope.selectResourcePool = function() {
            	var resolve = {
                    hostId: function () {return $scope.hostId; },
                    clusterId: function() {return $scope.clusterId;},
                    isCluster:function () {return $scope.isCluster;},
                };
          	    var resPoolInstance = UtilService.lgmodal('html/modal/common/resourcePoolSelector.html', 'resPoolSelectCtrl', resolve);
          	    resPoolInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.vendorId = reason.id;
              		  $scope.bindModel.resourcePoolName = reason.name;
              	   }
                });
            };
            // 选择GPU template
            $scope.selectTemplate = function() {
            	var resolve = {
                    hostId: function () {return $scope.hostId; },
                    clusterId: function() {return $scope.clusterId;},
                    isCluster:function () {return $scope.isCluster;},
                };
          	    var templateInstance = UtilService.lgmodal('html/modal/common/businessTemplateSelector.html', 'businessTemplateSelectCtrl', resolve);
          	    templateInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.productId = reason.id;
              		  $scope.bindModel.templateName = reason.name;
              	   }
                });
            };
        }
    };
}).directive('casUsb', function() {
    // 虚拟机磁盘设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casUsb.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的实体，用于传参
            index : '@',            // 序号
            deleteIcon : '@',       // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        controller: function($scope, $element, $attrs, $translate, UtilService) {
        	$scope.gpuPoolHodler = $translate.instant('addDomain.gpuPool');
        	
        	$scope.drivers = [{value:'3', label:$translate.instant('addHw.usb3')},
        	                  {value:'2', label:$translate.instant('addHw.usb2')},
    	                      {value:'1', label:$translate.instant('addHw.usb1')}];
        	
        	$scope.bindModel.devType = 0;		//set type is BSB
        	
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#usbCollapse' + $scope.index);
                var spanEle = $('#usbCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });   
            };
            // 删除磁盘
            $scope.deleteUsb = function() {
              // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.usb') + ($scope.index >= 1 ? $scope.index : '')};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.usbs[$scope.index] = undefined; //delete data from array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择USB device
            $scope.selectUsb = function() {
            	var resolve = {
                    hostId: function () {return $scope.hostId; },
                    clusterId:function () {return $scope.clusterId; },
                    isCluster:function () {return $scope.isCluster; },
                };
          	    var storeFileInstance = UtilService.lgmodal('html/modal/common/usbSelector.html', 'usbSelectCtrl', resolve);
          	    storeFileInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.devName = reason.name;
              		  $scope.bindModel.ubs = reason.ubs;
              		  $scope.bindModel.device = reason.device;
              		  $scope.bindModel.vendor = reason.vendor;
              		  $scope.bindModel.vendorId = reason.vendorId;
              		  $scope.bindModel.product = reason.product;
              		  $scope.bindModel.productId = reason.productId;
              	   }
                });
            };
        }
    };
}).directive('casPci', function() {
    // 虚拟机磁盘设备
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casPci.html',
        replace: true,
        scope:{
            bindModel :'=',         // 绑定的实体，用于传参
            index : '@',            // 序号
            deleteIcon : '@',       // 是否显示删除图标
            hostId:'@',				// 主机Id
            clusterId:'@',			// cluster id
            isCluster:'@'			// is added in cluster
        },
        controller: function($scope, $element, $attrs, $translate, UtilService) {
        	$scope.gpuPoolHodler = $translate.instant('addDomain.gpuPool');
        	
        	$scope.drivers = [{value:'KVM', label:'KVM'},
        	                  {value:'VFIO', label:'VFIO'}];
        	
        	$scope.bindModel.devType = 1;		//set type is PCI
        	
        	// 控制提示小三角
            $scope.isCollapse = function() {
                var ele = $('#pciCollapse' + $scope.index);
                var spanEle = $('#pciCollapse' + $scope.index + 'Icon');
                ele.on('shown.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-up');
                });
                ele.on('hidden.bs.collapse', function () {
                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                });    
            };
            // 删除磁盘
            $scope.deletePci = function() {
              // 提示是否删除
                var hardware = {name: $translate.instant('addDomain.pci') + ($scope.index >= 1 ? $scope.index : '')};
                var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                modalInstance.result.then(function (selectedItem) {
                    $scope.bindModel = undefined;    // 删除网卡实体数据
                    $scope.$parent.pcis[$scope.index] = undefined; //delete data from array
                    $element.remove();               // 删除dom节点
                    $scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                }, function () {
                });
            };
            // 选择USB device
            $scope.selectPci = function() {
            	var resolve = {
                    hostId: function () {return $scope.hostId; },
                    clusterId:function () {return $scope.clusterId; },
                    isCluster:function () {return $scope.isCluster; },
                };
          	    var storeFileInstance = UtilService.lgmodal('html/modal/common/pciSelector.html', 'pciSelectCtrl', resolve);
          	    storeFileInstance.result.then(function (selectedItem) {
                }, function (reason) {
              	   if (angular.isDefined(reason) && reason != 'cancel') {
              		  // 点击了确定按钮
              		  $scope.bindModel.devName = reason.name;
              		  $scope.bindModel.ubs = reason.ubs;
              		  $scope.bindModel.device = reason.device;
              		  $scope.bindModel.vendor = reason.vendor;
              		  $scope.bindModel.vendorId = reason.vendorId;
              		  $scope.bindModel.product = reason.product;
              		  $scope.bindModel.productId = reason.productId;
              		  $scope.bindModel.ethName = reason.ethName;
              		  $scope.bindModel.slot = reason.slot;
              		  $scope.bindModel.function = reason.function;
              	   }
                });
            };
        }
    };
}).directive('nettopo', function() {
	  return {
			restrict : 'EA',
			scope:{
				width: '@',
				height: '@',
				id: '@',
				text: '@'
					
			},
			replace: false,
			link:function(scope,element,attrs){
				 var computeTopo = new ComputeTopo();
				    jQuery.extend({
				          setApDiv:function (show, overview) {
				        	    $("#main").html('');
				        	    $("#overviewDiv").remove();
				        	    computeTopo = new ComputeTopo();
				        	    computeTopo.init(show, overview);
				          }
				         
				  });
				    var searchNodes = function(nodeName){
			            computeTopo.search(nodeName);
			        }
				    computeTopo.init(true, true);
		    }
		
		};
	})

// angular.module("myTest", [])
// .directive('multipleEmail', [function () {
// return {
// require: "ngModel",
// link: function (scope, element, attr, ngModel) {
// if (ngModel) {
// var emailsRegexp =
// /^([a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*[;；]?)+$/i;
// }
// var customValidator = function (value) {
// var validity = ngModel.$isEmpty(value) || emailsRegexp.test(value);
// ngModel.$setValidity("multipleEmail", validity);
// return validity ? value : undefined;
// };
// ngModel.$formatters.push(customValidator);
// ngModel.$parsers.push(customValidator);
// }
// };
// }]);

angular.module("myTest", [])
.directive('ip', [function () {
    return {
        require: "ngModel",
        scope: {
        	allowLocal: "@"
        },
        link: function (scope, element, attr, ngModel) {
            if (ngModel) {
                var ipRegexp = /^([1-9]\d?|1\d{1,2}|2[01]\d|22[0-3])(\.(\d|[1-9]\d|1\d{1,2}|2[0-4]\d|25[0-5])){2}\.(0|[1-9]\d?|1\d{1,2}|2[0-4]\d|25[0-5])$/;
            }
            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || ipRegexp.test(value);
                
                if(angular.isDefined(scope.allowLocal) && scope.allowLocal == 'false'){
                	validity = validity && (!value.startWith("127"));
                }
                ngModel.$setValidity("ip", validity);
                return validity ? value : undefined;
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}])
.directive('multip', [function () {
    return {
        require: "ngModel",
        scope: {
        	allowLocal: "@"
        },
        link: function (scope, element, attr, ngModel) {
            if (ngModel) {
                var ipRegexp = /^([1-9]\d?|1\d{1,2}|2[01]\d|22[0-3])(\.(\d|[1-9]\d|1\d{1,2}|2[0-4]\d|25[0-5])){2}\.(0|[1-9]\d?|1\d{1,2}|2[0-4]\d|25[0-5])$/;
            }
            var customValidator = function (value) {
            	if (ngModel.$isEmpty(value)) {
            		ngModel.$setValidity("multip", true);
    				return value;
            	} else {
            		var ips = value.split(";");
            		var flag = true;
            		for (var i = 0; i < ips.length; i++) {
            			var ip = ips[i];
            			var validity = ngModel.$isEmpty(ip) || ipRegexp.test(ip);
            			
            			if(angular.isDefined(scope.allowLocal) && scope.allowLocal == 'false'){
            				validity = validity && (!ip.startWith("127"));
            			}
            			flag = validity;
            			if (!flag) {
            				break;
            			}
            		}
            		ngModel.$setValidity("multip", flag);
        			return flag ? value : undefined;
            	}
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}])
.directive('mask',[function(){
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var partten1 = /^(254|252|248|240|224|192|128|0)\.0\.0\.0$/;
				var partten2 = /^255\.(254|252|248|240|224|192|128|0)\.0\.0$/;
				var partten3 = /^255\.255\.(254|252|248|240|224|192|128|0)\.0$/;
				var partten4 = /^255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value) || partten1.test(value) || partten2.test(value)|| partten3.test(value)|| partten4.test(value);
				ngModel.$setValidity("mask", validity);
	            return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('mac',[function(){
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var reg = /([a-fA-F0-9][02468acAC]|[a-eA-E0-9][eE]):([a-fA-F0-9]{2}:){4}[a-fA-F0-9]{2}/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value) || (reg.test(value) && value.length < 18);
				ngModel.$setValidity("mac", validity);
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('charnum',[function(){ // 必须混合使用字母和数字
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regNum = "[0-9]+";
				var regLowercase = "[a-z]+";
		        var regUppercase = "[A-Z]+";
			}
			var customValidator = function (value) {
				if (value) {
					var nothasNum = value.match(new RegExp(regNum)) == null;
					var nothasLowercase = value.match(new RegExp(regLowercase)) == null;
					var nothasUppercase = value.match(new RegExp(regUppercase)) == null;
					var validityold = nothasNum || (nothasLowercase && nothasUppercase);
					var validity = !validityold
					ngModel.$setValidity("charnum", validity);
				}
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('spechar',[function(){ // 必须包含特殊字符
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regEx = "[`~!@#$%^&*()=|{}':;',\\\\ \\[\\].\"<>/?\\_\\-\\+]+";
			}
			var customValidator = function (value) {
				if (value) {
					var nothasEx = value.match(new RegExp(regEx)) == null;
					var validity = !nothasEx;
					ngModel.$setValidity("spechar", validity);
				}
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('charnumspec',[function(){ // 必须字母数字特殊字符组合
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regNum = "[0-9]+";
		        var regLowercase = "[a-z]+";
		        var regUppercase = "[A-Z]+";
		        var regEx = "[`~!@#$%^&*()=|{}':;',\\\\ \\[\\].\"<>/?\\_\\-\\+]+";
			}
			var customValidator = function (value) {
				if (value) {
					var nothasNum = value.match(new RegExp(regNum)) == null;
					var nothasLowercase = value.match(new RegExp(regLowercase)) == null;
					var nothasUppercase = value.match(new RegExp(regUppercase)) == null;
					var nothasEx = value.match(new RegExp(regEx)) == null;
					var validityold = nothasNum || (nothasLowercase && nothasUppercase) || nothasEx;
					var validity = !validityold;
					ngModel.$setValidity("charnumspec", validity);
				}
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('caseCharNumSpec',[function(){ // 必须大小写字母数字特殊字符组合
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regNum = "[0-9]+";
				var regLowercase = "[a-z]+";
				var regUppercase = "[A-Z]+";
				var regEx = "[`~!@#$%^&*()=|{}':;',\\\\ \\[\\].\"<>/?\\_\\-\\+]+";
			}
			var customValidator = function (value) {
				if (value) {
					var nothasNum = value.match(new RegExp(regNum)) == null;
					var nothasLowercase = value.match(new RegExp(regLowercase)) == null;
					var nothasUppercase = value.match(new RegExp(regUppercase)) == null;
					var nothasEx = value.match(new RegExp(regEx)) == null;
					var validityold = nothasNum || nothasLowercase || nothasUppercase || nothasEx;
					var validity = !validityold;
					ngModel.$setValidity("caseCharNumSpec", validity);		
				}
		
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkname',[function(){ // 只允许包含字母、数字，“-_.” 。名称的首字符不能为减号及点。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^[\A-Za-z0-9\-\_\.]*$/;
				var numreg = /^[0-9]+$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkname = namereg.test(value);
					var checknum = numreg.test(value);
// var validityold = !checkname || !checknum || value.startWith("-") ||
// value.startWith(".");
// var validityold = checkname && !checknum && !value.startWith("-") &&
// !value.startWith(".");
					validity = checkname && !checknum && !value.startWith("-") && !value.startWith(".");
					ngModel.$setValidity("checkname", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkhostname',[function(){ // 只允许包含字母、数字，“-_” 。名称的首字符不能为减号及点。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^[\A-Za-z0-9\-\_]*$/;
				var numreg = /^[0-9]+$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkname = namereg.test(value);
					var checknum = numreg.test(value);
// var validityold = !checkname || !checknum || value.startWith("-") ||
// value.startWith(".");
// var validityold = checkname && !checknum && !value.startWith("-") &&
// !value.startWith(".");
					validity = checkname && !checknum;
					ngModel.$setValidity("checkhostname", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checktarget',[function(){ //虚拟共享存储的target校验 只允许包含字母、数字，“-.”
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			var customValidator = function (value) {
				var namereg = /^[a-zA-Z0-9-.]+$/;
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					validity = namereg.test(value);
					ngModel.$setValidity("checktarget", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkip',[function(){ 
	return {
		require:"ngModel",
		scope:{
			alowedEmpty:'@'
		},
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var ipRegexp = /^([1-9]\d?|1\d{1,2}|2[01]\d|22[0-3])(\.(\d|[1-9]\d|1\d{1,2}|2[0-4]\d|25[0-5])){2}\.(0|[1-9]\d?|1\d{1,2}|2[0-4]\d|25[0-5])$/;
			}
			var customValidator = function (value) {
				if (value == "" && scope.alowedEmpty == "true") {
					ngModel.$setValidity("checkip", true);
					return true;
				}
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkname = ipRegexp.test(value);
					var validityold = !checkname;
					validity = !validityold;
					ngModel.$setValidity("checkip", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkPhone',[function(){ 
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regStr = /^((1\d{10})|((0\d{2,3}-)?(\d{7,8})(-\d{3,})?)|(\d{3,5}))$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkphone = regStr.test(value);
					var validityold = !checkphone;
					validity = !validityold;
				}
					ngModel.$setValidity("checkPhone", validity);		
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checksmsphone',[function(){
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var tphone = /^1\d{10}$/;
					var phone = /^0\d{2,3}-?\d{7,8}$/;
					var phon = /^\d{7,8}$/;
					validity = tphone.test(value) || phone.test(value) || phon.test(value);
				}
				ngModel.$setValidity("checkphone", validity);
				return validity ? value : undefined;
			};
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])

.directive('checkipmask',[function(){ 
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regStr = "^(254|252|248|240|224|192|128|0)\\.0\\.0\\.0$" 
					+ "|^255\\.(254|252|248|240|224|192|128|0)\\.0\\.0$" 
					+ "|^255\\.255\\.(254|252|248|240|224|192|128|0)\\.0$"
					+ "|^255\\.255\\.255\\.(254|252|248|240|224|192|128|0)$";
				var namereg = new RegExp(regStr);
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					if (value == "255.255.255.255") {
						ngModel.$setValidity("checkipmask", false);	
					} else {
						var checkname = namereg.test(value);
						var validityold = !checkname;
						validity = !validityold;
						ngModel.$setValidity("checkipmask", validity);	
					}
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkGateway', function () {
    return {
        require: "ngModel",
        restrict: 'A',
        scope: {
        	ngModel :'=',
        	allowLocal: "@",
        	isNeedCheckSameSegment:"@", //是否需要校验同网段
        	checkIp:"=",				//需校验的IP
        	checkMask:"="				//需校验的掩码
        },
        link: function (scope, element, attrs, ngModel) {
        	if (ngModel) {
                var ipRegexp = /^([1-9]\d?|1\d{1,2}|2[01]\d|22[0-3])(\.(\d|[1-9]\d|1\d{1,2}|2[0-4]\d|25[0-5])){2}\.(0|[1-9]\d?|1\d{1,2}|2[0-4]\d|25[0-5])$/;
            }
            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || ipRegexp.test(value);
                
                if(angular.isDefined(scope.allowLocal) && scope.allowLocal == 'false'){
                	validity = validity && (!value.startWith("127"));
                }
                ngModel.$setValidity("ip", validity);
                return validity ? value : undefined;
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
            
            var checkSameSegment = function() {
            	var value = ngModel.$viewValue;
				if (angular.isUndefined(value)) {
					return;
				}
	            var maskRegexp = "(254|252|248|240|224|192|128|0)\\.0\\.0\\.0" + 
	            					"|255\\.(254|252|248|240|224|192|128|0)\\.0\\.0" + 
	            					"|255\\.255\\.(254|252|248|240|224|192|128|0)\\.0" + 
	            					"|255\\.255\\.255\\.(255|254|252|248|240|224|192|128|0)";
	            var regexp = new RegExp(maskRegexp);
	            if (!ipRegexp.test(value) || !ipRegexp.test(scope.checkIp) || !regexp.test(scope.checkMask)) {
	            	return;
	            }
				var result = isSameNetworkSegment(value, scope.checkIp, scope.checkMask);
				ngModel.$setValidity('checkSameSegment', result);
				return result;
            }
        	
            if (angular.isDefined(scope.isNeedCheckSameSegment) && scope.isNeedCheckSameSegment == "true") {
            	scope.$watch("ngModel", function(newValue, oldValue){
            		if (newValue != oldValue) {
            			checkSameSegment();
            		}
            	});
            	scope.$watch("checkIp", function(newValue, oldValue){
            		if (newValue != oldValue) {
            			var result = checkSameSegment();
            			if (result == false) {
            				ngModel.$dirty = true;
            			}
            		}
            	});
            }
        }
    };
})
.directive('checkpath',[function(){ // 有效目录名称的匹配正在表达式。 只允许包含字母、数字，“-_./”
									// 并且必须以"/"开头
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^\/[a-zA-Z0-9_\\x2d.\/]*/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkname = namereg.test(value);
					var validityold = !checkname;
					validity = !validityold;
					ngModel.$setValidity("checkpath", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkserveraddr',[function(){ // 只允许包含字母、数字，“-_.” 。首字符只能为字母、数字。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^[a-zA-Z0-9][a-zA-Z0-9_\\x2d.]*$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkaddr = namereg.test(value);
					var validityold = !checkaddr;
					validity = !validityold;
					ngModel.$setValidity("checkserveraddr", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkemail',[function(){ // 只允许包含字母、数字，“-_.” 。首字符只能为字母、数字。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var regStr = "^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*"
			        + "+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|"
			        + "\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)"
			        + "+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}"
			        + "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\\x01-\\x08\\x0b\\x0c"
			        + "\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$";
				var namereg = new RegExp(regStr);
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkaddr = namereg.test(value);
					var validityold = !checkaddr;
					validity = !validityold;	
				}
				ngModel.$setValidity("checkemail", validity);	
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkblank',[function(){ 
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			var regEx = /^\s+$/;
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var blank = regEx.test(value);
					validity = !blank;
					ngModel.$setValidity("checkblank", validity);		
				} else {
					ngModel.$setValidity("checkblank", validity);
				}
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('positiveint',[function(){
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			var customValidator = function (value) {
				
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					validity = ( parseInt(value)==value);
					validity = validity?parseInt(value)>0:validity;
				}
				ngModel.$setValidity("positiveint", validity);
				return validity ? value : undefined;
			};
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('productkey',[function(){ 
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^([A-Z0-9]{5}-){4}[A-Z0-9]{5}$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var checkkey = namereg.test(value);
					var validityold = !checkkey;
					validity = !validityold;
					ngModel.$setValidity("productkey", validity);		
				}
				if (isEmpty(value)){
					ngModel.$setValidity("productkey", true);
				}
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('mem4',[function(){ 
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var size = attr.unit == 'GB' ? (Number(value) * 1024).toFixed(0) : Number(value);
					if (size % 4 == 0){
						ngModel.$setValidity("mem4", true);
					} else {
						ngModel.$setValidity("mem4", false);
					}
				}
				if (isEmpty(value) || attr.effective == 'false'){
					ngModel.$setValidity("mem4", true);
				}
				return validity ? undefined : value;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('adaptiveControlLabel',[function(){
	return {
		restrict:'A',
		controller:function($scope,$translate){
			var self = this;
			self.getLocal= function(){
				return $translate.use();
			}
		},
		link: function(scope, element, attr,c) {
			var local = c.getLocal();
			if(typeof local !=='undefined'){
				if(local.contains("cn")){
					attr.$removeClass('col-sm-offset-2 col-md-2 col-sm-2 col-xs-8 ');
					attr.$addClass('col-sm-offset-3 col-md-1 col-sm-2 col-xs-8 ');
				}else if(local.contains("en")){
					attr.$removeClass('col-sm-offset-3 col-md-1 col-sm-2 col-xs-8 ');
					attr.$addClass('col-sm-offset-2 col-md-2 col-sm-2 col-xs-8 ');
				}
			}
		}
	}
}])
.directive('bondeth',[function(){
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var reg = /^eth[0-9]{1,}$/;
			}
			var customValidator = function (value) {
				if (ngModel.$isEmpty(value)) {
					ngModel.$setValidity("bondeth", true);
					return value;
				}
				
				var num = 0;
				if(typeof value !== "undefined"){
// value = value.replace(/\s+/g, ' ');
					var arr = value.split("|");
					var etharr = [];
					for (var i = 0; i< arr.length;i++) {
						if (reg.test(arr[i]) && !angular.includes(etharr,arr[i])) {
							etharr.push(arr[i])
							num++;
						}
					}
					if (arr.length == num && num == 2) {
						ngModel.$setValidity("bondeth", true);
						return value;
					} else {
						ngModel.$setValidity("bondeth", false);
						return undefined;
					}
				}
				
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('rpccheck', function($http, $timeout) { //通过服务器端异步检查
			return {
				require : 'ngModel',
				link : function(scope, ele, attrs, c) {
					scope.$watch(attrs.ngModel, function(newValue, oldValue) {
						if (angular.isUndefined(attrs.force)) {
						    if (angular.isUndefined(newValue) || newValue == oldValue) {
						        return;
						    }
						}
					    
						var value = c.$viewValue;
				if (value) {
					value = value.trim();
				}
						if (angular.isUndefined(value)) {
							return;
						} 
						var params = {};
						if (angular.isDefined(scope.checkNameParam)) { //作用域定义了一些需要传递的参数，比如cluster=1
							params = scope.checkNameParam;
						}
						if (angular.isDefined(attrs.namekey)) { //名称的key值可能不是name
							params[attrs.namekey] = value;
						} else {
							//名称的key值默认是name
							params.name = value;
						}
					
						// if Element is disabled or readonly, not check valid.
						//attrs.ngDisabled与ngReadonly可以为字符串，判断是否为true应该用对应的属性attrs.disabled与attrs.readonly f10574
						if (angular.isDefined(attrs.ngDisabled) && attrs.disabled) {
							c.$setValidity('rpccheck', true);
							return;
						}
						
						if (angular.isDefined(attrs.ngReadonly) && attrs.readonly) {
							c.$setValidity('rpccheck', true);
							return;
						}
						if (angular.isDefined(attrs.nocheck) && attrs.nocheck == 'true'){
							c.$setValidity('rpccheck', true);
							return;
						}
						
						//等待0.8秒再去后台取数据，防止输入过快，频繁查询
						if (angular.isDefined(scope.timer)) {//如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
						    $timeout.cancel(scope.timer);
						}						
				
				//修改问题单201702160565 解决同名请求还没返回结果的时候可以点击下一步,从而导致前台校验同名功能失败 add by w13241 2017.02.24
				c.$setValidity('rpccheck', true);
				c.$setValidity('timeout', false);
				c.$invalid = false;
				c.$valid = true;
				
				
						scope.timer = $timeout(function() {
						    $http({
	                            method : 'GET',
	                            url : attrs.rpccheck,
	                            params: params
	                        }).success(function(result) {
						//修改问题单201702160565 解决同名请求还没返回结果的时候可以点击下一步,从而导致前台校验同名功能失败 add by w13241 2017.02.24
                    	c.$setValidity('timeout', true);
                    	

	                            if (result.success) {
	                                //增加result.data来支持返回结果形式为RpcResult<Boolean>的情况 f10574
	                                if (!result.data) {
	                                    c.$setValidity('rpccheck', true);
	                                } else {
	                                    c.$setValidity('rpccheck', false);
	                                }
	                            } else if (result == true) {
	                                //无效
	                                c.$setValidity('rpccheck', false);
	                            } else {
	                                c.$setValidity('rpccheck', true);
	                            }
	                        }).error(function(data) {
						//修改问题单201702160565 解决同名请求还没返回结果的时候可以点击下一步,从而导致前台校验同名功能失败 add by w13241 2017.02.24
                    	c.$setValidity('timeout', true);
                    	

	                            c.$setValidity('rpccheck', false);
	                        });
						}, 800);						
					}); 
					scope.$on("$destroy", function() {//scope销毁时，销毁定时器
		                if (angular.isDefined(scope.timer)) {
		                    $timeout.cancel(scope.timer);
		                }
		            });
				}
			};
})
/*replace pwdCheck with equalcheck,	--by ckf6302*/
/*.directive('pwdCheck', function() {
    // 检查密码与确认密码是否一致。用法：pwd-check=”原密码的id“
    return {
        require: 'ngModel',
        link: function (scope, ele, attrs, c) {
            var firstPassword = '#' + attrs.pwdCheck;
            ele.on('keyup', function () {
                scope.$apply(function () {
                    var v = ele.val()===$(firstPassword).val();
                    c.$setValidity('pwdCheck', v);
                });
            });
        }
    }
})*/
.directive('maxValue', function() {
    // 检查是否超过最打值
    return {
        require: 'ngModel',
        scope: {
        	value: "="
        },
        link: function (scope, ele, attrs, c) {
        	
        	if(angular.isDefined(scope.value)){
        		scope.$watch("value", function(newValue, oldValue){
            		var v = ele.val() < scope.value;
                    c.$setValidity('maxValue', v);
            	})
        	}
        	
            ele.on('keyup', function () {
                scope.$apply(function () {
                	if(angular.isDefined(scope.value)){
                		 var v = ele.val() <= scope.value;
                         c.$setValidity('maxValue', v);
                	}
                   
                });
            });
         // 控制键盘只能输入[0-9]数字
            $(ele).keydown(function(e){
            	  if(e.shiftKey||e.ctrlKey||e.altKey)
            		  return false;
            	  if ( (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8||(e.keyCode > 95 && e.keyCode < 106)) { 
                      return true;  
            	  } else {  
                      return false;  
               }
            });
        }
    }
})
.directive('minMax', function() {
    return {
        require: 'ngModel',
        scope: {
        	max: "=",
        	min: "="
        },
        link: function (scope, ele, attrs, c) {
        	// 控制键盘只能输入[0-9]数字
            $(ele).keydown(function(e){
            	  if(e.shiftKey||e.ctrlKey||e.altKey)
            		  return false;
            	  if ( (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8||(e.keyCode > 95 && e.keyCode < 106)) { 
                      return true;  
            	  } else {  
                      return false;  
               }
            });
        	
            ele.on('keyup', function () {
                scope.$apply(function () {
                	if(angular.isDefined(scope.min) && angular.isDefined(scope.max)){
                		var v = ele.val() <= scope.max && ele.val() >= scope.min;
                        c.$setValidity('minMax', v);
                	}
                    
                });
            });
        }
    }
})
.directive("vswitchProfileMatch", function(){
	return{
		restrict: 'A',
		require:"ngModel",
		scope: {
			vswitch: "=",
			profile: "="
		},
		link: function(scope, element, attrs, ngModel){
			scope.$watch("vswitch", function(){
				if(scope.vswitch && scope.profile){
					var mode = scope.vswitch.mode;
					var vlanType = scope.profile.vlanType;
					
					var flag = (mode==4 && vlanType != 1);
					ngModel.$setValidity("vswitchNotMatchProfile", !flag);
					flag = (mode != 4 && vlanType == 1);
					ngModel.$setValidity("profileNotMatchVswitch", !flag);
				}
			}, true);
			scope.$watch("profile", function(){
				if(scope.vswitch && scope.profile){
					var mode = scope.vswitch.mode;
					var vlanType = scope.profile.vlanType;
					var flag = (mode==4 && vlanType != 1);
					ngModel.$setValidity("vswitchNotMatchProfile", !flag);
					flag = (mode != 4 && vlanType == 1);
					ngModel.$setValidity("profileNotMatchVswitch", !flag);
				}
			}, true);
		}
	}
})
.directive("casHostTree",function(){
	return{
		restrict:'AE',
		controller:'HostTreeController',
		scope:{
			bindData :'=',
			showCheckbox:'@'
		},
		link:function(scope,element,attrs,ctrl){
		}
	};
})
.controller('HostTreeController',['$scope','$http','$rootScope','$state','$timeout','UtilService',function($scope,$http,$rootScope,$state,$timeout,UtilService){
	var self = this,
	links = self.links = $scope.links = [],
    currentIndex = 1;
    $scope.currentLink=self.currentLink = null;
    // 刷新或者访问时
    self.addLink = function(link, element) {
    	link.$element = element;
    	link.target = "hostTreeview"+(currentIndex++);
    	link.$element.append("<div id=\""+link.target+"\" class=\"hostTreeview\"></div>")
    	links.push(link);
       if(links.length === 1) {
        	selectLink(link);
        } 
      };
    //deep check all children
  	var checkAllChildren = function(tree, data) {
			var children = data.nodes;  //if no children, the value is null
			if (children != null) {
				for (var i = 0; i < children.length; i++) {
					if (children[i].state.checked == false) {
						tree.checkNode(children[i].nodeId, {silent:true});
					}
					checkAllChildren(tree, children[i]);
				}
			}
  	};
  	//deep uncheck all children
  	var uncheckAllChildren = function(tree, data) {
  		var children = data.nodes;  //if no children, the value is null
			if (children != null) {
				for (var i = 0; i < children.length; i++) {
					if (children[i].state.checked == true) {
						tree.uncheckNode(children[i].nodeId, {silent:true});
					}
					uncheckAllChildren(tree, children[i]);
				}
			}
  	};
   // 收起和展开树，并加载子节点
     function selectLink(link){
     	 var el = link.$element;
     	 if(el.attr("class").indexOf("open") > 0){
     		self.closeLink(link);
     	 }else{
     		 el.addClass('open');
     		 $('#'+link.target).show();
     		 var waitModal = UtilService.wait();
     		 var params = {};
     		 params.cloudId = link.cloudId;
         	 $http({ 
                  method: 'GET', 
                  url: link.listhref,
                  params: params
              }).success(function(result,status,headers,cfg) { 
            	 waitModal.dismiss();
            	 var data = result;
            	 if (result && angular.isArray(result.data)) {
            	     data = result.data;
            	 }
             	 if(data){             		 		
 	        			 $('#'+link.target).treeview({
 	        				 data: data,
 	        				 enableLinks:false,// 设置<a>标记的超链接无效
 	        				 levels: 4,       //展开到主机
 	        				 color:'#000',    
 	        				 backColor:'#fff', 
 	        				 onhoverColor: '#DFDFDF',
 	        				 showCheckbox:$scope.showCheckbox?true:false,
	        				 onNodeSelected:function(event, data) {
	        					 if(angular.isDefined($scope.bindData)){
	        						 //修改问题单201703270352，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【CIC云业务管理中心】云主机页面无法迁移虚拟机 c11817
	        					     if (data.entryType == 'host') {
	        					         if($(data).attr("entryType")){
	                                         $scope.bindData.entryType=$(data).attr("entryType");
	                                         $scope.bindData.id=$(data).attr("id");
	                                         $scope.bindData.name=$(data).attr("stateParams").name;
	                                         if($(data).attr("entryType")=='host'&&$(data).attr("data")){
	                                             $scope.bindData.hostData=$(data).attr("data");
	                                         }
	                                     }else{
	                                         $scope.bindData.entryType=undefined;
	                                         $scope.bindData.id=undefined;
	                                         $scope.bindData.name=undefined;
	                                         $scope.bindData.hostData=undefined;
	                                     }
	        					     } else if (data.entryType == 'v_host') {
	        					         $scope.bindData = angular.copy(data);
	        					     } else {
	        					    	 $scope.bindData.entryType=undefined;
                                         $scope.bindData.id=undefined;
                                         $scope.bindData.name=undefined;
                                         $scope.bindData.hostData=undefined;
	        					     }	        					     
	        					 } 
	        					 //host Tree with checkbox
	        					 if($scope.showCheckbox=='true'){
	        						 if (data.state.checked == true) {
	 		    						//if is checked, uncheck it
	        							hostTree.uncheckNode(data.nodeId, {silent:true});
	 		    						uncheckAllChildren(hostTree, data);
	 		    					} else {
	 		    						//if unchecded, check it
	 		    						hostTree.checkNode(data.nodeId, {silent:true});
	 		    						checkAllChildren(hostTree, data);
	 		    					}
	        					 }
	         				 },
 	         				onNodeExpanded: function(event, data) {
 	         				},
		    				onNodeChecked:function(event, data) {
		    					if($scope.showCheckbox=='true'){
			    					//when a node has children, check all children
			    					checkAllChildren(hostTree, data);
		    					}
		    				},
		    				onNodeUnchecked:function(event, data) {
		    					if($scope.showCheckbox=='true'){
			    					//when a node has children, uncheck all children
			    					uncheckAllChildren(hostTree, data);
		    					}
		    				}
 	        			 });
      				 }
             	 	var hostTree = $('#' + link.target).data('treeview');
              }).error(function(data,status,headers,cfg) { 
             	 waitModal.dismiss();
              }); 
     	 }
      };
}])
.directive('hostTreeAccordion',function(){
	 return {
		    restrict:'A',
		    require: '^casHostTree',
		    transclude:true,
		    template: '<ul id="hostAccordion" class="accordion st-effect-2" ng-transclude></ul>',
		    link:function(scope,element,attrs,ctrl){
			},
		    replace: true
		  };
})
.directive('hostTreeLink',function(){
	 return {
		    restrict:'A',
		    require: '^casHostTree',
		    template: '<li></li>',
		    scope:{
		    	text:'@',
		    	listhref:'@',
		    	href:'@',
		    	icon:'@',
		    	cloudId:'='
		    },
		    link:function(scope,element,attrs,ctrl){
		    	ctrl.addLink(scope, $(element));
			},
		    replace: true
		  };
})
.directive('dragdrop', function(){
	return {
		restrict: 'A',
		scope:{
			inputReadonly: '@',
			domain: '='
		},
		link:function(scope, element,attrs){
			if(scope.inputReadonly == 'true'){
				return;
			}
			var updateOutput = function(e)
			  {
                 // 更新model优先级
                 var doms = $(element).find(".dd-item");
                 for(index = 0; index < doms.length; index++){
                	 var data_id = $(doms[index]).attr("data-id");
                	 for(var j = 0; j < scope.domain.boot.detail.bootList.length; j++){
                		 if(scope.domain.boot.detail.bootList[j].bootdev == data_id){
                			 scope.domain.boot.detail.bootList[j].order = index;
                			 break;
                		 }
                	 }
                 }
                 scope.$apply();
			  };

			  // activate Nestable for list 1
			  $('#nestable').nestable().on('change', updateOutput);
			  
			  
		}
	}
})
.directive("casSnapshotTree",function(){	// 虚拟机快照树
	return{
		restrict:'A',
		controller:'SnapshotTreeController',
		scope:{
			selectSnap :'='
		},
		link:function(scope,element,attrs,ctrl){
		}
	};
})
.controller('SnapshotTreeController',['$scope','$http','$rootScope','$state','$timeout',function($scope,$http,$rootScope,$state,$timeout){
	var self = this,
	links = self.links = $scope.links = [],
    currentIndex = 1;
    $scope.currentLink=self.currentLink = null;
    // 刷新或者访问时
    self.addLink = function(link, element) {
    	link.$element = element;
    	link.target = link.treeId;
    	link.$element.append("<div id=\""+link.target+"\" class=\"hostTreeview\"></div>")
    	links.push(link);
       if(links.length === 1) {
        	selectLink(link);
        	
        	// 注册刷新快照树
            $scope.$on('onRefreshSnapshot', function() {
        		selectLink(link);
         	});
        } 
      };
      
     // 收起和展开树，并加载子节点
     function selectLink(link){
     	 var el = link.$element;
     	 if(el.attr("class").indexOf("open") > 0){
     	 }else{
     		 el.addClass('open');
     		 $('#'+link.target).show();
     	 }
     	$http({ 
            method: 'GET', 
            url: link.listhref
        }).success(function(data,status,headers,cfg) { 
       	  if(data && data.success){
       			 $('#'+link.target).treeview({
       				 data: data.data,
       				 enableLinks:false,// 设置<a>标记的超链接无效
       				 color:'#000',
       				 backColor:'#fff',
       				 onhoverColor:'#DFDFDF',
      				 onNodeSelected:function(event, data) {
      					 $scope.selectSnap.id = data.id;
      					 $scope.selectSnap.text = data.text;
      					 $scope.selectSnap.name = data.name;
      					 $scope.selectSnap.desc = data.desc;
      					 $scope.selectSnap.createTime = data.createTime;
       				 },
        				onNodeExpanded: function(event, data) {
        				},
        				onSearchComplete: function(event, data) {
           				 // adjust the view port to make the result node in the middle of the dialog
           				 if (data && angular.isUndefined(data[1])) { // only one node in result
           					 $('#'+link.target).treeview("selectNode", data[0]);
           					 //animate
           					 var $ele = $("#snapshotTree [data-nodeid=" + data[0].nodeId + "] .node-icon");
           					 var $tree = $("#snapshotTree");
           					 var treeDivHeight = 400;
           					 var treeDivWidth = 640;
           					 
           					 var offsetTop = $ele.offset().top - $tree.offset().top - treeDivHeight / 2 ;
           					 var offsetLeft = $ele.offset().left - $tree.offset().left - treeDivWidth / 2;
           					 var scrollTop = $tree.scrollTop() + offsetTop;
           					 var scrollLeft = $tree.scrollLeft() + offsetLeft;
           					 $tree.animate({'scrollTop' :scrollTop, 'scrollLeft' :scrollLeft});
           				 }
           			 }
       			 });
       			$('#'+link.target).treeview('expandAll', { levels: 65535, silent: true });
		    }
        }).error(function(data,status,headers,cfg) { 
        }); 
      };
}])
.directive('snapshotTreeAccordion',function(){
	 return {
		    restrict:'A',
		    require: '^casSnapshotTree',
		    transclude:true,
		    template: '<ul id="snaphostAccordion" class="accordion st-effect-2" ng-transclude></ul>',
		    link:function(scope,element,attrs,ctrl){
			},
		    replace: true
		  };
})
.directive('snapshotTreeLink',function($timeout){
	 return {
		    restrict:'A',
		    require: '^casSnapshotTree',
		    template: '<li></li>',
		    scope:{
		    	text:'@',
		    	listhref:'@',
		    	desc:'@',
		    	icon:'@',
		    	createTime:'@',
		    	active:'@',
		    	treeId:'@',
		    	query: '@'
		    },
		    link:function(scope,element,attrs,ctrl){
		    	ctrl.addLink(scope, $(element));
		    	var first = true;
		    	scope.$watch('query', function(newValue, oldValue) {
		    		if (!isEmpty(scope.query)) {
		    			// 设置时间间隔
				        if (angular.isDefined(scope.keyInterval)) {// 如果在事件间隔内，就取消定时器。超过定时器事件，才会执行。
				            $timeout.cancel(scope.keyInterval);
				        }
				        scope.keyInterval = $timeout(function() {
				        	var tree = $('#'+scope.treeId).treeview(true);
				        	//修改问题单201702090417，快照搜索对话框，对搜索词进行通配符转义。 c11817
				        	var finalQuery = "";
				        	for (var i = 0; i < scope.query.length; i++) {
				        		if (scope.query[i] == '.') {
				        			finalQuery += "\\.";
				        		} else {
				        			finalQuery += scope.query[i];
				        		}
				        	}
				        	tree.search(finalQuery, {searchField:'name'});
				        }, constant.keyInterval);
		    		} else {
		    			if (first) {
		    				first = false;
		    			} else {
		    				$('#'+scope.treeId).treeview("clearSearch");
		    			}
		    		}
				});
			},
		    replace: true
		  };
})
.directive('checkint', [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
        	if (ngModel) {
                var intRegexp = /^([-]?([1-9]+\d*)|(0))$/; 	// 判断整数的正则表达式
                var ele=element;
            }
            var customValidator = function (value) {
                if (ngModel.$isEmpty(value)) {
                    ngModel.$setValidity("int", true);
                    return null;
                } else {
                    var validity = intRegexp.test(value);
                    if(!validity){
                    	$(ele).attr("intOrFloat",true);	//the element contains the attribute "intOrFloat" when value is not valid number
                    }else{
                    	$(ele).removeAttr("intOrFloat");
                    }
                    ngModel.$setValidity("int", validity);
                    return validity ? value : undefined;
                }
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}])
.directive('checkintfloat', [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            if (ngModel) {
                var Regexp=/^(([-]?([0][.]\d*[0-9]+))|([-]?([1-9]+\d*[.]?\d*[0-9]+))|(0)|([-]?([1-9]+\d*)))$/;  //验证整数和浮点数的正则表达式
                var ele=element;
            }
            var customValidator = function (value) {
                //增加浮点数的小数位数验证，实际小数位数不超过设置的小数位数则合法 ，by kf6302
                var decimal=$(element).attr("decimal"),decimalFlag=true;
                if(!isEmpty(value)&&Regexp.test(value)&&!isEmpty(decimal)){
                    decimal=Number(decimal);
                    var valArr=value.toString().split('.');
                    if(isEmpty(valArr[1])||valArr[1].length<=decimal){
                        decimalFlag=true;
                    }else{
                        decimalFlag=false;
                    }
                }
                if (ngModel.$isEmpty(value)) {
                    ngModel.$setValidity("intfloat", true);
                    return null;
                } else {
                    var validity = Regexp.test(value)&&decimalFlag;
                    if(!validity){
                        $(ele).attr("intOrFloat",true); //the element contains the attribute "intOrFloat" when value is not valid number
                    }else{
                        $(ele).removeAttr("intOrFloat");
                    }
                    ngModel.$setValidity("intfloat", validity);
                    return validity ? value : undefined;
                }
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}])
.directive('memcheck', [function () {// 内存大小必须为4MB的倍数，在线添加必须未512的倍数。
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var customValidator = function (value) {
            	//增加浮点数的小数位数验证，实际小数位数不超过设置的小数位数则合法 ，by kf6302
            	var decimal=$(element).attr("decimal"),decimalFlag=false;
            	if(!isEmpty(value)&&!isEmpty(decimal)){
            		decimal=Number(decimal);
            		var valArr=value.toString().split('.');
            		if(isEmpty(valArr[1])||valArr[1].length<=decimal){
            			decimalFlag=true;
            		}else{
            			decimalFlag=false;
            		}
            	}
            	if (ngModel.$isEmpty(value)) {
            	    ngModel.$setValidity("memcheck", true);
            	    return null;
            	} else {
            	    var val = Number(value);
            	    var remain = 0
            	    var remainNum = 4;
            	    var remainNumConfig =$(element).attr("multiple");
            	    if (!isEmpty(remainNumConfig)) {
            	    	remainNum = Number(remainNumConfig);
            	    }
            	    if (!decimalFlag) {
            	    	remain = val%remainNum;
            	    } else {
            	    	remain = (val * 1024)%remainNum;
            	    }
            	    ngModel.$setValidity("memcheck", remain == 0);
            	    return val;
            	}
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}]).directive('minutecheck', [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var customValidator = function (value) {
                if (ngModel.$isEmpty(value)) {
                    ngModel.$setValidity("minutecheck", true);
                    return null;
                } else {
                    var val = Number(value);
                    var remain = 0
                    var remainNum = attrs.minutecheck;
                    remain = val%remainNum;
                    ngModel.$setValidity("minutecheck", remain == 0);
                    return value;
                }
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}])
.directive("casEditOverview", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			dirty: '=',
			inRecycle: '@',
			ableModify: '@',
			haEnable: '@',
			valid: "="
		},
		templateUrl: 'html/template/input/editVm/editOverview.html',
		link: function(scope, element, attrs, ctrl){
			// 初始化的时候数据从无到有的变化不监听，
			var first = true;
			scope.$watch('domain.summary.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);// true表示监听各个属性
		},
		controller: function($scope, $element, $attrs, $timeout, $translate, UtilService){
			$scope.options = {
					clock: [{'value':'localtime', 'label':$translate.instant("editDomain.native-clock")},
					        {'value':'utc', 'label':$translate.instant("editDomain.world-clock")}],
					ioPriority: [{'value':200, 'label':$translate.instant("editDomain.low")},
					             {'value':300, 'label':$translate.instant("editDomain.middle")},
					             {'value':500, 'label':$translate.instant("editDomain.high")}],
					bootPriority: [{'value':-1, 'label':$translate.instant("editDomain.default")},
					               {'value':0, 'label':$translate.instant("editDomain.low")},
					               {'value':1, 'label':$translate.instant("editDomain.middle")},
					               {'value':2, 'label':$translate.instant("editDomain.high")}],
					osFault: [{'value':0, 'label':$translate.instant("editDomain.failNone")},
					          {'value':1, 'label':$translate.instant("editDomain.failRestart")},
					          {'value':2, 'label':$translate.instant("editDomain.failMigrate")}]
			};
			$scope.$watch("domain.summary", function(newValue, oldValue){
		    	$timeout(function(){
		    		$scope.valid = $scope.overview.$valid;
		    	}, 100);
		    }, true);
		}
	}
})
.directive("casEditCpu", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			vmId: '@',
			dirty: '=',
			inRecycle: '@',
			ableModify: '@',
			valid:'='
		},
		templateUrl: 'html/template/input/editVm/editCpu.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			var first2 = true;
			scope.$watch('domain.cpu.cpudetail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
			scope.$watch('domain.numa.detail', function(newValue, oldValue){
				if(first2){
					first2 = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, $translate, $modal, $timeout, UtilService){
			$scope.cpuUnit = {
					options:[{value:'MHz', label:'MHz'},
					         {value:'GHz', label:'GHz'}]
			};
			$scope.options = {
					cpuMode : [{'value' : 'custom', 'label' : $translate.instant("addDomain.custom")},
					           {'value' : 'host-model', 'label' : $translate.instant("addDomain.hostModel")},
					           {'value' : 'host-passthrough', 'label' : $translate.instant("addDomain.hostPassthrough")}],
					cpuArch: [{'value' : 'x86_64', 'label' : $translate.instant("addDomain.x86_64")},
					          {'value' : 'i686', 'label' : $translate.instant("addDomain.i686")}],
					cpuShares: [{'value' : 256, 'label' : $translate.instant("editDomain.low")},
					            {'value' : 512, 'label' : $translate.instant("editDomain.middle")},
					            {'value' : 1024, 'label' : $translate.instant("editDomain.high")}]
			}
			
			// 绑定物理cpu
			$scope.bindCpu = function(){
				if($scope.inRecycle == 'true' || $scope.ableModify == 'false'){
					return;
				}
				var cpu = Number($scope.domain.cpu.cpudetail.cpuSocket) * Number($scope.domain.cpu.cpudetail.cpuCore);
				if(cpu > $scope.domain.cpu.cpudetail.maxValue){
					UtilService.error($translate.instant("editDomain.bindCpuPrompt", {maxValue: $scope.domain.cpu.cpudetail.maxValue}),
							$translate.instant("editDomain.editVm"));
					return;
				}
				var resolve = { vmId: function() {return $scope.vmId},
				 		 body: function() {return $scope.domain},
				 		 isAdd: function() {return false}};
				var modalInstance = $modal.open({
					  templateUrl: 'html/modal/vmEdit/bindVirtualCPU.html',
					  
					  controller: 'BindVCPUCtrl',
					  backdrop:'static',
					  resolve:resolve
					  }
				);
				modalInstance.result.then(function (mySelections) {
					var bindPhysicalCpu = [];
					var bindNuma = false;
					for(var i = 0; i < mySelections.length; i++){
						if(angular.isDefined(mySelections[i]) && mySelections[i].length != 0){
							var binding = {};
							binding.vcpu = i;
							binding.cpuset = "";
							var bindCpu = false;
							for(var j = 0; j < mySelections[i].length; j++){
								if(mySelections[i][j].entryType == 'cpu'){
									binding.cpuset += mySelections[i][j].entryId + ',';
									bindCpu = true;
								}else if(mySelections[i][j].entryType == 'numa'){
									$scope.domain.numa.detail.associate = true;
									$scope.domain.numa.detail.nodeSet = mySelections[i][j].entryId;
									bindNuma = true;
								}
							}
							if (bindCpu == true){
								binding.cpuset = binding.cpuset.substring(0, binding.cpuset.length - 1);
								bindPhysicalCpu.push(binding);
							}
						}
					}
					$scope.domain.cpu.cpudetail.bindPhysicalCpu = bindPhysicalCpu;
					if(bindNuma == false){
						$scope.domain.numa.detail.associate = false;
					}
		       }, function () {
		       });
			};
			
			$timeout(function(){
				var spinner = $("#cpuLimitText").spinner();
				
			$scope.$watch('domain.cpu.cpudetail.cpuQuotaUnit', function(newValue, oldValue) {
				if (newValue == 'MHz' && oldValue == 'GHz') {
					$scope.domain.cpu.cpudetail.cpuMax = $scope.domain.cpu.cpudetail.cpuMax * 1000;
					$scope.domain.cpu.cpudetail.cpuMin = $scope.domain.cpu.cpudetail.cpuMin * 1000;
					
				} else if (newValue=='GHz' && oldValue=='MHz'){
					$scope.domain.cpu.cpudetail.cpuMax = $scope.domain.cpu.cpudetail.cpuMax / 1000;
					$scope.domain.cpu.cpudetail.cpuMin = $scope.domain.cpu.cpudetail.cpuMin / 1000;
					
				}
			});			
			});
			$scope.guaranteeBlur = function(){
				//预留输入完毕，设置内存限制最小值
				if($scope.cpu.cpuGuarantee.$valid == true){
					var value = $scope.domain.cpu.cpudetail.cpuQuotaUnit;
	            	if ($scope.domain.cpu.cpudetail.cpuGuarantee!= null) {
	            		$scope.domain.cpu.cpudetail.cpuMin = $scope.domain.cpu.cpudetail.cpuGuarantee > $scope.domain.cpu.cpudetail.cpuOriMinRate ? $scope.domain.cpu.cpudetail.cpuGuarantee : $scope.domain.cpu.cpudetail.cpuOriMinRate;
	            		$scope.domain.cpu.cpudetail.cpuMinRate = $scope.domain.cpu.cpudetail.cpuMin;
			        	if ("MHz" != value) {
			        		$scope.domain.cpu.cpudetail.cpuMin = UtilService.transformMHzToGHz($scope.domain.cpu.cpudetail.cpuMin);
			        	}
	            	} else {
	            		$scope.domain.cpu.cpudetail.cpuMinRate = $scope.domain.cpu.cpudetail.cpuOriMinRate;
			        	if ("MHz" == value) {
			        		$scope.domain.cpu.cpudetail.cpuMin = $scope.domain.cpu.cpudetail.cpuMinRate;
			        	} else {
			        		$scope.domain.cpu.cpudetail.cpuMin = UtilService.transformMHzToGHz($scope.domain.cpu.cpudetail.cpuMinRate);
			        	}
	            	}
				}
			};
			$scope.quotaBlur = function(){
				//限制输入完毕，设置预留最大值
				if($scope.cpu.cpuQuota.$valid == true){
					var value = $scope.domain.cpu.cpudetail.cpuQuotaUnit;
					if($scope.domain.cpu.cpudetail.cpuQuota != null){
						if (value == 'MHz'){
							$scope.domain.cpu.cpudetail.cpuGuaranMaxRate = $scope.domain.cpu.cpudetail.cpuQuota;
						} else {
							$scope.domain.cpu.cpudetail.cpuGuaranMaxRate = $scope.domain.cpu.cpudetail.cpuQuota * 1000;
						}
					} else {
						$scope.domain.cpu.cpudetail.cpuGuaranMaxRate = $scope.domain.cpu.cpudetail.cpuMaxRate;
					}
				}
			};
			$scope.$watch("domain.cpu", function(newValue, oldValue){
				$timeout(function(){
					$scope.valid = $scope.cpu.$valid;
				}, 100);
		    }, true);
		}
			
	}
})
.directive("casEditMemory", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			dirty: '=',
			inRecycle: '@',
			ableModify: '@',
			valid: '='
		},
		templateUrl: 'html/template/input/editVm/editMemory.html',
		link: function(scope, element, attrs, ctrl){
			var count = 0;
			scope.$watch('domain.mem.detail', function(newValue, oldValue){
				if(count == 0){
					count++;
				}else{
					scope.dirty = true;
				}
			}, true);
		},
		controller: function($scope, $element, $attrs, $timeout, $translate, UtilService){
			$scope.memoryUnit = {
					options:[{value:'MB', label:'MB'},
					         {value:'GB', label:'GB'}]
			};
			$scope.options = {
					memoryPriority: [{value : 0, label : $translate.instant("editDomain.low")},
					                 {value : 50, label: $translate.instant("editDomain.middle")},
					                 {value : 100, label: $translate.instant("editDomain.high")}],
					autoMem: [{value : 0, label : $translate.instant("dashboard.closed")},
					          {value : 1, label : $translate.instant("lb.open")}]
			};
			var status = $scope.domain.summary.detail.status;
			if ("running" == status || "paused" == status) {
				$scope.hotMem = $scope.domain.mem.detail.hotMem;
			} else {
				$scope.hotMem = true;
			}
			if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
				var oldMemory = $scope.domain.mem.detail.curValue;
			} else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
				var oldMemory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
			}

			$scope.autoMemFlag = $scope.domain.mem.detail.autoMem;
			
			$scope.$watch("domain.mem.detail", function(newValue, oldValue){
				$timeout(function(){
					$scope.valid = $scope.memory.$valid;
				}, 100);
		    }, true);
			// 限制更改。
			var limitChange = function() {
            	var memory = 0;
                if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
                        memory = $scope.domain.mem.detail.curValue;
                } else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
                        memory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
                }
                $scope.limitMax = memory;
                if($scope.domain.mem.detail.memoryLocked > 0 && $scope.domain.mem.detail.memoryLocked < 100){
                    var memLimit = memory * $scope.domain.mem.detail.memoryLocked / 100;
                    if(memory * $scope.domain.mem.detail.memoryLocked % 100 > 0){
                        memLimit++;
                    }
                    var flag = false;
                    if(memLimit < 512){
                    	flag = true;
                        memLimit = 512;
                    }
                    if($scope.domain.mem.detail.memLimitUnit == "MB"){
                        $scope.limitMin = flag ? Math.ceil(memLimit) : Math.ceil(memLimit) + 10;
                    }else if($scope.domain.mem.detail.memLimitUnit == "GB"){
                        $scope.limitMin = flag ? 0.5 : UtilService.transformMBTOGB(memLimit)*1 + 0.1;
                        $scope.limitMax = UtilService.transformMBTOGB($scope.limitMax);
                    }
                    if ($scope.limitMin > $scope.limitMax) {
                    	$scope.limitMin = $scope.limitMax;
                    }
                }else if($scope.domain.mem.detail.memoryLocked == 100){
                    //spinner2.spinner("disable");
                }else{
                    if($scope.domain.mem.detail.memLimitUnit == "MB"){
                        $scope.limitMin = 512;
                    }else if($scope.domain.mem.detail.memLimitUnit == "GB"){
                        $scope.limitMin = 1;
                        $scope.limitMax = UtilService.transformMBTOGB($scope.limitMax);
                    }
                }
            };
            
			$timeout(function(){
				var max = $scope.domain.mem.detail.maxMemory;
	            var min = 512;
	            if($scope.domain.mem.detail.curMemoryUnit == 'GB'){
	            	var min = 1024;
	            }
	            
	            var spinner = $("#changeMemValue").spinner();
	            if($scope.domain.mem.detail.curMemoryUnit == 'MB'){
	            	$scope.maxValue = $scope.domain.mem.detail.maxValue;
	            	$("#hostValueUnit").html("MB");
	            	$("#quotaValueUnit").html("MB");
				} else {
					max = UtilService.transformMBTOGB(max);
				    min = 1;
					
	            	$("#hostValueUnit").html("GB");
	            	$("#quotaValueUnit").html("GB");
	            	$scope.maxValue = UtilService.transformMBTOGB($scope.domain.mem.detail.maxValue);
				}
	            $scope.max = max;
	            $scope.min = min;
				$scope.$watch('domain.mem.detail.curMemoryUnit', function(newValue, oldValue){
					if(newValue == 'GB' && oldValue == 'MB'){
						$scope.domain.mem.detail.curValue = UtilService.transformMBTOGB($scope.domain.mem.detail.curValue);
						$scope.maxValue = UtilService.transformMBTOGB($scope.domain.mem.detail.maxValue);
						$scope.max = UtilService.transformMBTOGB($scope.max);
						$scope.min = 1;
		            	$("#hostValueUnit").text("GB");
		            	$("#quotaValueUnit").html("GB");
					} else if(newValue == 'MB' && oldValue == 'GB'){
						$scope.domain.mem.detail.curValue = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
						$scope.maxValue = $scope.domain.mem.detail.maxValue;
						$scope.max = UtilService.transformGBTOMB($scope.max);
						$scope.min = 512;
		            	$("#hostValueUnit").text("MB");
		            	$("#quotaValueUnit").html("MB");
					}
					limitChange();
				});
				//set mem limit
				var spinner2 = $("#memLimit").spinner();
				$scope.limitMax = Infinity;
				$scope.limitMin = 0;
				if($scope.domain.mem.detail.memLimitUnit == $scope.domain.mem.detail.curMemoryUnit){
					$scope.limitMax = $scope.domain.mem.detail.curValue;
				}else{
					var memory = 0;
	    			if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
	    					memory = $scope.domain.mem.detail.curValue;
	    			} else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
	    					memory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
	    			}
	    			if (memory > 0) {
	    				if($scope.domain.mem.detail.memLimitUnit == "MB"){
	    					$scope.limitMax = memory;
	    				}else if($scope.domain.mem.detail.memLimitUnit == "GB"){
	    					$scope.limitMax = UtilService.transformMBTOGB(memory);
	    				}
	    			}
				}
				// min value
				if($scope.domain.mem.detail.memoryLocked > 0 && $scope.domain.mem.detail.memoryLocked < 100){
					var memory = 0;
					if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
							memory = $scope.domain.mem.detail.curValue;
					} else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
							memory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
					}
					var memLimit = memory * $scope.domain.mem.detail.memoryLocked / 100;
					if(memory * $scope.domain.mem.detail.memoryLocked % 100 > 0){
						memLimit++;
					}
					var flag = false;
					if(memLimit < 512){
						flag = true;
						memLimit = 512;
					}
					if($scope.domain.mem.detail.memLimitUnit == "MB"){
						$scope.limitMin = flag ? Math.ceil(memLimit) : Math.ceil(memLimit) + 10;
					}else if($scope.domain.mem.detail.memLimitUnit == "GB"){
						$scope.limitMin = flag ? 0.5 : UtilService.transformMBTOGB(memLimit)*1 + 0.1; 
					}
				}else if($scope.domain.mem.detail.memoryLocked == 100){
					//spinner2.spinner("disable");
				}else{
					if($scope.domain.mem.detail.memLimitUnit == "MB"){
						$scope.limitMin = 512;
					}else if($scope.domain.mem.detail.memLimitUnit == "GB"){
						$scope.limitMin = 0.5;
					}
				}
				
				
				$scope.$watch('domain.mem.detail.memLimitUnit', function(newValue, oldValue){
					if(newValue == "MB" && oldValue == "GB"){
						var memory = 0;
		    			if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
		    					memory = $scope.domain.mem.detail.curValue;
		    			} else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
		    					memory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
		    			}
		    			$scope.domain.mem.detail.memLimit = undefined;
		    			$scope.limitMax = memory;
		    			if($scope.domain.mem.detail.memoryLocked > 0 && $scope.domain.mem.detail.memoryLocked < 100){
		    				
		    				var memLimit = memory * $scope.domain.mem.detail.memoryLocked / 100;
		    				if(memory * $scope.domain.mem.detail.memoryLocked % 100 > 0){
		    					memLimit++;
		    				}
		    				var flag = false;
		    				if(memLimit < 512){
		    					flag = true;
		    					memLimit = 512;
		    				}
		    				$scope.limitMin = flag ? Math.ceil(memLimit) : Math.ceil(memLimit) + 10;
		    			}else if($scope.domain.mem.detail.memoryLocked == 100){
		    				//spinner2.spinner("disable");
		    			}else{
		    				$scope.limitMin = 512;
		    			}
					}else if(newValue == "GB" && oldValue == "MB"){
						var memory = 0;
		    			if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
		    					memory = $scope.domain.mem.detail.curValue;
		    			} else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
		    					memory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
		    			}
		    			$scope.domain.mem.detail.memLimit =  undefined;
		    			$scope.limitMax = UtilService.transformMBTOGB(memory);
		    			if($scope.domain.mem.detail.memoryLocked > 0 && $scope.domain.mem.detail.memoryLocked < 100){
		    				var memLimit = memory * $scope.domain.mem.detail.memoryLocked / 100;
		    				if(memory * $scope.domain.mem.detail.memoryLocked % 100 > 0){
		    					memLimit++;
		    				}
		    				var flag = false;
		    				if(memLimit < 512){
		    					flag = true;
		    					memLimit = 512;
		    				}
		    				$scope.limitMin = flag ? 0.5 : UtilService.transformMBTOGB(memLimit)*1 + 0.1;;
		    			}else if($scope.domain.mem.detail.memoryLocked == 100){
		    				//spinner2.spinner("disable");
		    			}else{
		    				if($scope.domain.mem.detail.memLimitUnit == "MB"){
		    					$scope.limitMin = 512;
		    				}else if($scope.domain.mem.detail.memLimitUnit == "GB"){
		    					$scope.limitMin = 1;
		    				}
		    			}
					}
				});
				$scope.$watch("domain.mem.detail.memoryLocked", function(newValue, oldValue){
					var memory = 0;
	    			if ($scope.domain.mem.detail.curMemoryUnit == "MB") {
	    					memory = $scope.domain.mem.detail.curValue;
	    			} else if($scope.domain.mem.detail.curMemoryUnit == "GB"){
	    					memory = UtilService.transformGBTOMB($scope.domain.mem.detail.curValue);
	    			}
					if(newValue > 0 && newValue < 100){
	    				var memLimit = memory * newValue / 100;
	    				if(memory * newValue % 100 > 0){
	    					memLimit++;
	    				}
	    				var flag = false;
	    				if(memLimit < 512){
	    					flag = true;
	    					memLimit = 512;
	    				}
	    				if($scope.domain.mem.detail.memLimitUnit == "MB"){
	    					$scope.limitMin = flag ? Math.ceil(memLimit) : Math.ceil(memLimit) + 10;
	    				}else if($scope.domain.mem.detail.memLimitUnit == "GB"){
	    					$scope.limitMin = flag ? 0.5 : UtilService.transformMBTOGB(memLimit)*1 + 0.1;
	    				}
	    			}else if(newValue == 100){
	    				//spinner2.spinner("disable");
	    			}else{
	    				if($scope.domain.mem.detail.memLimitUnit == "MB"){
	    					$scope.limitMin = 512;
	    				}else if($scope.domain.mem.detail.memLimitUnit == "GB"){
	    					$scope.limitMin = 1;
	    				}
	    			}
				});
				$scope.$watch("domain.mem.detail.curValue", function(newValue, oldValue){
					limitChange();
					if (("running" == status || "paused" == status) && !$scope.domain.mem.detail.hotMem) {
						if($scope.domain.mem.detail.curMemoryUnit == "GB"){
							var newValueMb = UtilService.transformGBTOMB(newValue);
						} else {
							var newValueMb = newValue;
						}
						if(newValueMb != oldMemory) {
							$scope.autoMemFlag = false;
						} else {
							$scope.autoMemFlag = true;
						}
					}

                });
				$scope.$watch('domain.mem.detail.autoMem', function(newValue, oldValue){
					if ("running" == status || "paused" == status) {
						if(newValue == true) {
							$scope.hotMem = false;
						} else {
							$scope.hotMem = true;
						}
					}
				});
			});
		}
	}
})
.directive("casEditBoot", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			dirty: '=',
			inRecycle: '@',
			ableModify: '@',
			haEnable: '@'
		},
		templateUrl: 'html/template/input/editVm/editBootDev.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('domain.boot.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, UtilService){
			
		}
	}
})
.directive("casEditDisk", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			bindModel: '=',
			index: '@',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@',
			valid: '='
		},
		templateUrl: 'html/template/input/editVm/editDisk.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('bindModel.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, $translate,$timeout, UtilService) {
			if($scope.bindModel.detail.type == 'file'){
				var hasSnapshot = $scope.bindModel.detail.enableModify;
				var hasBackingFile = $scope.bindModel.detail.enableConverFmt;
				var status = $scope.domain.summary.detail.status;
				if (!hasSnapshot || !hasBackingFile) {
            	   $scope.editSize = false;
            	} else {
            	    if ($scope.ableModify == 'true') {
                	    $scope.editSize = true;
            	    } else {
            	        $scope.editSize = false;
            	    }
            	}
            	if ("running" == status || "paused" == status || !hasSnapshot || !hasBackingFile) {
            		$scope.editFmt = false;
            	} else {
            	    //修改问题单201407260206。   ---w10450   2014-8-21
            	    if ($scope.ableModify == 'true') {
            	    	$scope.editFmt = true;
            	    } else {
            	    	$scope.editFmt = false;
            	    }
            	}
			}else{
				$scope.editSize = false;
				$scope.editFmt = false;
			}
			
			if($scope.bindModel.detail.minValue / 1024 / 1024 >= 1){
				$scope.min = UtilService.transformMBTOTB($scope.bindModel.detail.minValue);
				$scope.max = UtilService.transformMBTOTB($scope.bindModel.detail.maxValue);
			}else if($scope.bindModel.detail.minValue / 1024 >= 1){
				$scope.min = UtilService.transformMBTOGB($scope.bindModel.detail.minValue);
				$scope.max = UtilService.transformMBTOGB($scope.bindModel.detail.maxValue);
			}else{
				$scope.min = $scope.bindModel.detail.minValue;
				$scope.max = $scope.bindModel.detail.maxValue;
			}
			
			$scope.diskUnit = {
					options:[{value:'MB', label:'MB'},
					         {value:'GB', label:'GB'},
					         {value:'TB', label:'TB'}]
			};
			$scope.options = {
					cacheModel: [{value : 'directsync', label : $translate.instant("editDomain.directsync")},
					             {value: 'writeback', label: $translate.instant("editDomain.writeback")},
					             {value: 'writethrough', label: $translate.instant("editDomain.writethrough")},
					             {value: 'none', label: $translate.instant("editDomain.none")}],
					diskFormat: [{value : 'raw', label: $translate.instant("editDomain.raw")},
					             {value : 'qcow2', label: $translate.instant("editDomain.qcow2")}]
			}
			
			$scope.$watch("bindModel.detail", function(newValue, oldValue){
				$timeout (function(){
					$scope.valid = $scope.disk.$valid;
				}, 100);
		    }, true);
			$timeout(function(){
				var val = $("#diskShowSize" + $scope.index).val();
				if ($scope.bindModel.detail.showSize != Number(val)){
					$("#diskShowSize" + $scope.index).val($scope.bindModel.detail.showSize)
				}
			}, 1000);
			//磁盘容量校验值监听
			$scope.$on('onCapacityChange', function(event, msg) {
				//修改最小下限
				$scope.min = $scope.bindModel.detail.showSize;
				if ($scope.bindModel.detail.showUnit == 'MB') {
					$scope.bindModel.detail.minValue = $scope.min;
				} else if ($scope.bindModel.detail.showUnit == 'GB') {
					$scope.bindModel.detail.minValue = UtilService.transformGBTOMB($scope.min);
				} else if ($scope.bindModel.detail.showUnit == 'TB') {
					$scope.bindModel.detail.minValue = UtilService.transformTBTOMB($scope.min);
				}
			 });
			
			$timeout(function(){
				var spinner = $("#diskShowSize" + $scope.index).spinner();
				$scope.$watch('bindModel.detail.showUnit', function(newValue, oldValue){
	            	if(newValue == 'MB' && oldValue == 'GB'){
	            		
	            		$scope.max = $scope.bindModel.detail.maxValue;
	            		$scope.min = $scope.bindModel.detail.minValue;
	            		//$("#diskShowSize" + $scope.index).focus();
	            	} else if(newValue == 'MB' && oldValue == 'TB'){
	            		
	            		$scope.max = $scope.bindModel.detail.maxValue;
	            		$scope.min = $scope.bindModel.detail.minValue;
	            		//$("#diskShowSize" + $scope.index).focus();	
	            		
	            	} else if(newValue == 'GB' && oldValue == 'MB'){
	            		
	            		$scope.max = UtilService.transformMBTOGB($scope.bindModel.detail.maxValue);
	            		$scope.min = UtilService.transformMBTOGB($scope.bindModel.detail.minValue);
	            		if($scope.max  <= 1){
	            			    $scope.bindModel.detail.showUnit='MB';
	            				
		            			UtilService.error($translate.instant("editDomain.poolNotEnough"), 
		            					$translate.instant("editDomain.operTooltip"));
		            			
	            		} else if ($scope.min <= 1){
	            			$scope.min = 1;
	            		}
	            		//$("#diskShowSize" + $scope.index).focus();	
	            		
	            	} else if(newValue == 'GB' && oldValue == 'TB'){
	            		
	            		$scope.max = UtilService.transformMBTOGB($scope.bindModel.detail.maxValue);
	            		$scope.min = UtilService.transformMBTOGB($scope.bindModel.detail.minValue);
	            		//$("#diskShowSize" + $scope.index).focus();
	            	} else if(newValue == 'TB' && oldValue == 'MB'){
	            		
	            		$scope.max = UtilService.transformMBTOTB($scope.bindModel.detail.maxValue);
	            		$scope.min = UtilService.transformMBTOTB($scope.bindModel.detail.minValue);
	            		if($scope.max  <= 1){
	            			$scope.bindModel.detail.showUnit='MB';
	            			UtilService.error($translate.instant("editDomain.poolNotEnough"), 
	            					$translate.instant("editDomain.operTooltip"));
	            			
	            		} else if ($scope.min <= 1){
	            			$scope.min = 1;
	            		}
	            		//$("#diskShowSize" + $scope.index).focus();
	            	} else if(newValue == 'TB' && oldValue == 'GB'){
	            		
	            		$scope.max = UtilService.transformMBTOTB($scope.bindModel.detail.maxValue);
	            		$scope.min = UtilService.transformMBTOTB($scope.bindModel.detail.minValue);
	            		
	            		
	            		if($scope.max  <= 1){
	            			$scope.bindModel.detail.showUnit='GB';
	            			UtilService.error($translate.instant("editDomain.poolNotEnough"), 
	            					$translate.instant("editDomain.operTooltip"));
            			} else if ($scope.min <= 1){
	            			$scope.min = 1;
	            		}
	            		//$("#diskShowSize" + $scope.index).focus();
	            	}
	            })
			});
		}
	}
})
.directive("casEditCdrom", function($translate){
	return {
		restrict: 'A',
		scope: {
			domain:'=',
			cdrom: '=',
			index: '@',
			//dirty: '=',
			ableModify: '@',
			inRecycle: '@'
		},
		templateUrl: 'html/template/input/editVm/editCdrom.html',
		
		controller: function($scope, $element, $attrs,$timeout,$modal,$http, UtilService){
			if($scope.cdrom.detail.srcPath){
				$scope.isConnect = true;
			}else{
				
				$scope.isConnect = false;
			}
			$scope.$watch("isConnect", function(newValue, oldValue){
				if(newValue == true){
					$timeout(function(){
						$("#disconnectBtn"+$scope.index).text($translate.instant("editDomain.disconnect"));
					});
					
				}else{
					$timeout(function(){
						$("#disconnectBtn"+$scope.index).text($translate.instant("editDomain.connect"));
					});
					
				}
			});
			$timeout(function(){
				$("#disconnectBtn"+$scope.index).click(function(){
				if($scope.isConnect){
					//断开连接
					$scope.domain.operType = 5;
					var waitModal = UtilService.wait();
			    	$http.put("domain", $scope.domain).success(function(result){
			    		waitModal.dismiss();
			      	  	UtilService.handleResult(result);
			    		
			    		$scope.domain.cDROMList[$scope.index].detail.srcPath = "";
			    		$scope.domain.cDROMList[$scope.index].detail.srcPathAll = "";
			    		//$scope.dirty = false;
			    		$scope.isConnect = false;
			    	}).error(function(response, code, headers, config) {
			      	  waitModal.dismiss();
			    	  UtilService.handleError(code);
			      });
					
				}else{
					//连接
					$scope.domain.operType = 6;
					
					
					var resolve = {cdrom: function() {return $scope.cdrom},
							vmId: function() {return $scope.domain.id},
							hostId: function() {return $scope.domain.hostId},
							clusterId: function() {return $scope.domain.clusterId},
							cloudId: function() {return $scope.domain.cloudId}
							};
					var modalInstance = $modal.open({
						  templateUrl: 'html/modal/vmEdit/mount.html',
						  size : {width:'434px'},
						  controller: 'MountCtrl',
						  backdrop:'static',
						  resolve:resolve
						  }
					);
					modalInstance.result.then(function (cdrom) {
					//connect
						$scope.cdrom = cdrom;
						$scope.domain.cDROMList[$scope.index] = cdrom;
						var waitModal = UtilService.wait();
				    	$http.put("domain", $scope.domain).success(function(result){
					    	waitModal.dismiss();
					      	UtilService.handleResult(result);
					      	if (result.state == 0) {				      		  
					      		$scope.domain.cDROMList[$scope.index].detail.srcPathAll = cdrom.detail.filePath;
					      		$scope.domain.cDROMList[$scope.index].detail.srcPath = cdrom.detail.filePath;
					      		//$scope.dirty = false;
					      		$scope.isConnect = true;
					      	}
				    	}).error(function(response, code, headers, config) {
				      	  waitModal.dismiss();
				    	  UtilService.handleError(code);
				      });
						
			       }, function (reason) {
			       });
				}
			});
			}, 100);
		}
	}
})
.directive("casEditFloppy", function(){
	return {
		restrict: 'A',
		scope: {
			floppy: '=',
			index: '@',
			//dirty: '=',
			domain: '=',
			ableModify: '@',
			inRecycle: '@'
		},
		templateUrl: 'html/template/input/editVm/editFloppy.html',
		
		controller: function($scope, $element, $attrs, $timeout, $http, $modal, $translate, UtilService){
			if($scope.floppy.detail.srcPath){
				$scope.isConnect = true;
			}else{
				
				$scope.isConnect = false;
			}
			$scope.$watch("isConnect", function(newValue, oldValue){
				if(newValue == true){
					$timeout(function(){
						$("#floppyDisconnectBtn"+$scope.index).text($translate.instant("editDomain.disconnect"));
					},100);
					
				}else{
					$timeout(function(){
						$("#floppyDisconnectBtn"+$scope.index).text($translate.instant("editDomain.connect"));
					},100);
					
				}
			});
			$timeout(function(){
				$("#floppyDisconnectBtn"+$scope.index).click(function(){
				if($scope.isConnect){
					//断开连接
					$scope.domain.operType = 5;
					var waitModal = UtilService.wait();
			    	$http.put("domain", $scope.domain).success(function(result){
			    		waitModal.dismiss();
			      	  	UtilService.handleResult(result);
			    		
			    		$scope.domain.floppyList[$scope.index].detail.srcPath = "";
			    		$scope.domain.floppyList[$scope.index].detail.srcPathAll = "";
			    		$scope.isConnect = false;
			    		//$scope.dirty = false;
			    	}).error(function(response, code, headers, config) {
			      	  waitModal.dismiss();
			    	  UtilService.handleError(code);
			      });
					
				}else{
					//连接
					$scope.domain.operType = 6;
					
					
					var resolve = {cdrom: function() {return $scope.floppy},
							vmId: function() {return $scope.domain.id},
							hostId: function() {return $scope.domain.hostId},
							clusterId: function() {return $scope.domain.clusterId},
							cloudId: function() {return $scope.domain.cloudId}
							};
					var modalInstance = $modal.open({
						  templateUrl: 'html/modal/vmEdit/mount2.html',
						  size : {width:'434px'},
						  controller: 'MountCtrl',
						  backdrop:'static',
						  resolve:resolve
						  }
					);
					modalInstance.result.then(function (cdrom) {
					//connect
						$scope.floppy = cdrom;
						$scope.domain.floppyList[$scope.index] = cdrom;
						var waitModal = UtilService.wait();
				    	$http.put("domain", $scope.domain).success(function(result){
				    		waitModal.dismiss();
				      	  	UtilService.handleResult(result);
				    		
				    		$scope.domain.floppyList[$scope.index].detail.srcPathAll = $scope.floppy.detail.filePath;
				    		$scope.domain.floppyList[$scope.index].detail.srcPath = $scope.floppy.detail.filePath;
				    		//$scope.dirty = false;
				    		$scope.isConnect = true;
				    	}).error(function(response, code, headers, config) {
				      	  waitModal.dismiss();
				    	  UtilService.handleError(code);
				      });
						
			       }, function (reason) {
			       });
				}
			});
			}, 100);
		}
	}
})
.directive("casEditNetwork", function(){
	return {
		restrict: 'A',
		scope: {
			network: '=',
			index:'@',
			hostId: '@',
			cloudId: '@',
			dirty: '=',
			status: '@',
			ableModify: '@',
			inRecycle: '@',
			valid: "="
		},
		templateUrl: 'html/template/input/editVm/editNetwork.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('network.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, $translate,$http,$timeout, UtilService){
			//console.log($scope.network);
			$scope.options = {
					devType : [{value : 'rtl8139', label : $translate.instant("editDomain.normalNetCard")},
					           {value : 'virtio', label : $translate.instant("addDomain.virtioNetwork")},
					           {value : 'e1000', label : $translate.instant("editDomain.intelE1000")}],
			}
			
			$scope.ipAllowBlank = true;
			$scope.maskAllowBlank = true;
			
			// 选择虚拟交换机
			$scope.selectVswitch = function(index) {
				
					if($scope.inRecycle == 'true' || $scope.ableModify == 'false'){
						return;
					}
				var resolve = {
				        inputParam: function() {
	                        var inputParam = {};
	                        inputParam.hostId = $scope.hostId;
	                        inputParam.cloudId = $scope.cloudId;
	                        return inputParam;
	                    }
		            };
		      	    var vswitchInstance = UtilService.lgmodal('html/modal/common/vswitchSelector.html', 'vswitchSelectCtrl', resolve);
		      	   vswitchInstance.result.then(function (selectedItem) {
		      		 if (angular.isDefined(selectedItem)) {
		          		   // 点击了确定按钮
		          		   $scope.network.detail.vswitch.id = selectedItem.id;
		          		   $scope.network.detail.vswitch.name = selectedItem.name;
		          		   $scope.network.detail.vswitch.mode = selectedItem.mode;
		          		   switch(selectedItem.mode){
		          		   case 0:
		          			   $scope.network.detail.transmitMode = "veb";
		          			   $scope.ipAllowBlank = true;
		          			   break;
		          		   case 1:
		          		   case 2:
		          			   $scope.network.detail.transmitMode = "vepa";
		          			   $scope.ipAllowBlank = true;
		          			   break;
		          		   case 4:
		          			   $scope.ipAllowBlank = true;
		          		   }		      			 
		      		 }
		            }, function (reason) {
		            });
			}
			// 选择网络策略模板
		    $scope.selectProfile = function(index) {
		    	if($scope.inRecycle == 'true' || $scope.ableModify == 'false'){
					return;
				}
		    	var resolve = {
	    	        vswitch:function(){},
	    	        cloudId: function() {
                        return $scope.cloudId;
                    }
		    	};
		  	    var profileInstance = UtilService.lgmodal('html/modal/common/profileSelector.html', 'profileSelectCtrl', resolve);
		  	    profileInstance.result.then(function (selectedItem) {
		  	    	if (angular.isDefined(selectedItem)) {
			      		  // 点击了确定按钮
			      		   $scope.network.detail.profile.id = selectedItem.id;
			      		   $scope.network.detail.profile.name = selectedItem.name;
			      		   $scope.network.detail.profile.vlanType = selectedItem.vlanType;
			      	}
		        }, function (reason) {
		        });
		    };
		    
		    $scope.getNewMac = function(){
		    	if($scope.inRecycle == 'true' || $scope.ableModify == 'false'){
					return;
				}
		    	if($scope.status == "running" || $scope.status == "paused"){
		    		UtilService.error($translate.instant("editDomain.macWarn"), $translate.instant("editDomain.warn"));
		    		return;
		    	}else{
		    		$http.get("domain/getMacAddress?cloudId=" + $scope.cloudId)
		    		.success(function(result){
		    			var data = result.data;
		    			$scope.network.detail.mac = data.macAddress;
		    			var oldName = $scope.network.dispName;
		    			$scope.network.dispName = oldName.substring(0, 2) + data.macAddress;
		    		})
		    		.error(function(response, code, headers, config) {
				    	  UtilService.handleError(code);
				      })
		    	}
		    };
		    
		    $scope.$watch("network.detail.casConfig", function(newValue, oldValue){
		    	if(newValue == true){
		    		$scope.ipAllowBlank = false;
		    		$scope.maskAllowBlank = false;
		    	}else{
		    		$scope.ipAllowBlank = true;
		    		$scope.maskAllowBlank = true;
		    	}
		    });
		    
		    $scope.$watch("network", function(newValue, oldValue){
		    	$timeout(function(){
		    		$scope.valid = $scope.net.$valid;
		    	},100);
		    }, true);
		}
	}
})
.directive("casEditSriov", function(){
	return {
		restrict: 'A',
		scope : {
			sriov: '=',
			index: '@',
			dirty: '=',
			valid: '=',
			ableModify: '@',
			inRecycle: '@',
			status:'@'
		}, 
		templateUrl: 'html/template/input/editVm/editSriov.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('sriov.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, $http, $timeout){
			$scope.driverList = [{value : "kvm", label : "KVM"},
			                     {value : "vfio", label : "VFIO"}];
			 $scope.getNewMac = function(){
			    	if($scope.inRecycle == 'true' || $scope.ableModify == 'false'){
						return;
					}
			    	if($scope.status == "running" || $scope.status == "paused"){
			    		UtilService.error($translate.instant("editDomain.macWarn"), $translate.instant("editDomain.warn"));
			    		return;
			    	}else{
			    		$http.get("domain/getMacAddress")
			    		.success(function(result){
			    			var data = result.data;
			    			$scope.sriov.detail.mac = data.macAddress;
			    			var oldName = $scope.sriov.dispName;
			    			$scope.sriov.dispName = oldName.substring(0, 4) + data.macAddress;
			    		})
			    		.error(function(response, code, headers, config) {
					    	  UtilService.handleError(code);
					      })
			    	}
			    };
			    
			    $scope.$watch("sriov", function(newValue, oldValue){
			    	$timeout(function(){
			    		$scope.valid = $scope.sriovNet.$valid;
			    	},100);
			    }, true);
		}
	}
})
.directive("casEditVnc", function(){
	return {
		restrict: 'A',
		scope: {
			display: '=',
			cloudId: '@',
			index: '@',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@'
		},
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('display.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		templateUrl: 'html/template/input/editVm/editVnc.html',
		
		controller: function($scope, $element, $attrs, $modal, UtilService){
			$scope.setVnc = function(){
				if($scope.inRecycle == 'true' || $scope.ableModify == 'false'){
					return;
				}
				var modalInstance = $modal.open({
					templateUrl: "html/modal/vmEdit/vncConfig.html",
					backdrop: 'static',
					controller: 'VncParamCtrl',
					resolve: {
						cloudId : function() { return $scope.cloudId;}
					}
				});
				modalInstance.result.then(function(result){
				}, function(reason){
				});
			}
		}
	};
})
.directive("casEditVideo", function(){
	return {
		restrict: 'A',
		scope: {
			video: '=',
			index: '@',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@'
		},
		templateUrl: 'html/template/input/editVm/editVideo.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('video.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, UtilService){
			$scope.options = {
					devType: [{value : 'cirrus', label : "Cirrus"},
					          {value : 'vga', label : "Vga"}, 
					          {value : 'qxl', label : "Qxl"}]
			};
		}
	}
})
.directive("casEditSerial", function(){
	return {
		restrict: 'A',
		scope: {
			serial: '=',
			index: '@',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@'
		},
		templateUrl:'html/template/input/editVm/editSerial.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('serial.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, UtilService){
		}
	}
})
.directive("casEditNuma", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@'
		},
		templateUrl:'html/template/input/editVm/editNuma.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('domain.numa.detail', function(newValue, oldValue){
				if(first){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, UtilService){
			$scope.initNumaNodes = function(nodeSize){
				$scope.numa = {};
				$scope.numa.nodes = [];
				for(var i = 0; i < nodeSize; i++){
					$scope.numa.nodes.push(i);
				}
		};
		}
	}
})
.directive("casEditAdvanced", function(){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@',
			valid:'='
		},
		templateUrl: 'html/template/input/editVm/editAdvanced.html',
		link: function(scope, element, attrs, ctrl){
			var first = true;
			scope.$watch('domain.safety', function(newValue, oldValue){
				if(first == true){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		},
		controller: function($scope, $element, $attrs, $translate, $timeout, UtilService){
			$scope.bindData = [{'id':'main', 'value':$translate.instant("editDomain.main")},
		                       {'id':'inputs', 'value':$translate.instant("editDomain.inputs")},
		                       {'id':'display', 'value':$translate.instant("editDomain.display")},
		                       {'id':'cursor', 'value':$translate.instant("editDomain.cursor")},
		                       {'id':'playback', 'value':$translate.instant("editDomain.playback")},
		                       {'id':'record', 'value':$translate.instant("editDomain.record")},
		                       {'id':'smartcard', 'value':$translate.instant("editDomain.smartcard")},
		                       {'id':'usbredir', 'value':$translate.instant("editDomain.usbredir")}];
		    var column = [{field:'value', displayName:$translate.instant("editDomain.SSLChannels"), cellTemplate:'<div id="ssl-{{row.entity.id}}"><div class="ngCellText">' +
			'<div>{{row.entity.value}}</div></div></div>'}];
		    $scope.mySelections = [];
		    $scope.gridOptions = {
					multiSelect: true,
					showSelectionCheckbox: true,
					data: 'bindData',
					i18n: $translate.instant('lang'),
					columnDefs:column,
					selectedItems:$scope.mySelections,
					beforeSelectionChange: function(){
						return $scope.inRecycle == 'false' && $scope.ableModify == 'true';
					}
					
					
			};
		    $scope.$on('ngGridEventData', function(row, event){
		    	if( angular.isDefined($scope.domain.safety)){
		    		for(var i = 0; i < $scope.domain.safety.spiceChannels.length; i++){
		    			for(var j = 0; j < $scope.bindData.length; j++){
		    				if($scope.bindData[j].id == $scope.domain.safety.spiceChannels[i]){
		    					$scope.gridOptions.selectRow(j, true);
		    				}
		    			}
		    			
		    		}
		    	}
			
			});
		    $scope.$watch("mySelections", function(newValue, oldValue){
		    	if (newValue != oldValue){
		    		$scope.domain.safety.spiceChannels = [];
			    	if(newValue && newValue.length){
			    		for(var i = 0; i < newValue.length; i++){
			    			$scope.domain.safety.spiceChannels.push(newValue[i].id);
			    		}
			    	}
		    	}
		    }, true);
		    
			$scope.$watch("domain.safety", function(newValue, oldValue){
				$timeout(function(){
					$scope.valid = $scope.safety.$valid;
				}, 100);
		    }, true);
		}
	}
})
.directive("casEditGpu", function($translate, $timeout){
	return {
		restrict: 'A',
		scope: {
			domain: '=',
			gpu: '=',
			dirty: '=',
			ableModify: '@',
			inRecycle: '@',
			index: '@'
		},
		templateUrl: 'html/template/input/editVm/editGPU.html',
		link:function(scope, ele, attrs, ctrl){
			var first = true;
			scope.$watch('gpu', function(newValue, oldValue){
				if(first == true){
					first = false;
				}else{
					scope.dirty = true;
				}
				
			}, true);
		}, 
		controller: function($scope, $translate, UtilService){
			// 选择GPU resource pool
		    $scope.selGpuResPool = function() {
		    	if($scope.ableModify == 'false' || $scope.inRecycle == 'true'){
		    		return;
		    	}
		    	var resolve = {
		            hostId: function () {return $scope.domain.hostId; },
		            clusterId: function() {return $scope.domain.clusterId;},
		            isCluster:function () {return $scope.domain.clusterId ? 'true' : 'false';},
		        };
		  	    var resPoolInstance = UtilService.lgmodal('html/modal/common/resourcePoolSelector.html', 'resPoolSelectCtrl', resolve);
		  	    resPoolInstance.result.then(function (selectedItem) {
		        }, function (reason) {
		      	   if (angular.isDefined(reason) && reason != 'cancel') {
		      		  // 点击了确定按钮
		      		  $scope.gpu.resPoolId = reason.id;
		      		  $scope.gpu.resPool = reason.name;
		      	   }
		        });
		    };
		    // 选择GPU template
		    $scope.selSerTemplate = function() {
		    	if($scope.ableModify == 'false' || $scope.inRecycle == 'true'){
		    		return;
		    	}
		    	var resolve = {
			            hostId: function () {return $scope.domain.hostId; },
			            clusterId: function() {return $scope.domain.clusterId;},
			            isCluster:function () {return $scope.domain.clusterId ? 'true' : 'false';},
			        };
		  	    var templateInstance = UtilService.lgmodal('html/modal/common/businessTemplateSelector.html', 'businessTemplateSelectCtrl', resolve);
		  	    templateInstance.result.then(function (selectedItem) {
		        }, function (reason) {
		      	   if (angular.isDefined(reason) && reason != 'cancel') {
		      		  // 点击了确定按钮
		      		  $scope.gpu.businessTemId = reason.id;
		      		  $scope.gpu.businessTem = reason.name;
		      	   }
		        });
		    };
		}
	}
})
.directive("casContextMenu", function($translate, $http, $timeout,$state,$rootScope,$modal,
        DomainService,CloudResourceService,OrgService,DesktopService,ResourcePoolService) {
	//
	return {
		restrict: 'A',
		scope: {
			casContextMenu: '=',
			casContextMenuType: '@',
			casContextMenuId: '@',
			casEnterNodeType:'@'
		},
		templateUrl: 'html/template/contextmenu/casContextMenu.html',
		link: function(scope, element, attrs, ctrl){
			element.bind('contextmenu', function(event) {
				event.preventDefault();//prevent default menu show
			});
			scope.showMenu = function(menu) {
				scope.vmMenu = false;
				scope.cloudVmMenu = false;
				scope.cloudVmMenuBatch = false;
				scope.cloudMenu = false;
				scope.orgMngMenu = false;
				scope.orgMenu = false;
				scope.desktopMngMenu = false;
				scope.desktopMenu = false;
				scope.resourcePoolMngMenu = false;
				scope.resourcePoolMenu = false;
				
				scope.vmwareVmMenu = false;
				scope.vmwareBatchVmMenu = false;
				
				scope.cloudOSVmMenu = false;
				scope.cloudOSBatchVmMenu = false;
				
				scope[menu] = true;
			};
			
			/**按钮的权限信息end**/
			//memu object
			$(".rightClick").contextmenu({
				target:'#'+scope.casContextMenuId,
				before:function(e) {
					//when not item select, right click grid header to prevent show menu
					e.preventDefault();
					
					if (angular.isUndefined(scope.casContextMenu) || scope.casContextMenu == null || scope.casContextMenu.length == 0) {
						return false;
					}
					//menu element 
					var casNodeMenu = $("#cas-context-menu-node");
					var casMenu = $("#cas-context-menu");
					//deal right click on menu
					var toE = e.toElement;
	    			if (isEmpty(toE)) {
	    				toE = e.target;
	    			}
					var parentEl = toE.parentElement;
					if (parentEl.localName == 'li') {
						if (parentEl.parentElement.className == 'dropdown-menu ng-scope') {
							return false;
						}
					}
					if (parentEl.localName == 'a') {
						if (parentEl.parentElement.parentElement.className == 'dropdown-menu ng-scope') {
							return false;
						}
					}
					//check selectn item
					scope.entity = {};
					//修改问题单：201607080382，解决右键菜单第一次显示的位置不正确问题
					//item state data
					scope.vm = DomainService.vm;
					//menu show flag
					scope.vmMenu = false;
					scope.cloudVmMenu = false;
					scope.cloudVmMenuBatch = false;
					scope.cloudMenu = false;
					scope.orgMngMenu = false;
					scope.orgMenu = false;
					scope.desktopMngMenu = false;
					scope.desktopMenu = false;
					scope.isFloatDesk = false;
					scope.resourcePoolMngMenu = false;
	                scope.resourcePoolMenu = false;
					
					//vmware相关菜单
					scope.vmwareVmMenu = false;
					scope.vmwareBatchVmMenu = false;
					
					scope.cloudOSVmMenu = false;
					scope.cloudOSBatchVmMenu = false;
					
					//set node data
					if (scope.casContextMenuType == 'node') {
						casMenu.hide();
						casNodeMenu.show();	//修改问题单201612050442：左侧数节点和虚拟机列表的右键菜单来回切换时右键菜单弹出的位置不准确的问题	 --by ckf6302
						
						var crTree = $('#cloudResourcTreeId').data('treeview');//云资源
						var csTree = $('#cloudServiceTreeId').data('treeview');//云服务
						var VDCTree = $('#VDCTreeId').data('treeview');//VDC管理
						var selectNode = [];
						if (crTree) {
						    var selectNode = crTree.getSelected();
						}
						if (csTree && angular.isArray(selectNode) && selectNode.length == 0) {
						    var selectNode = csTree.getSelected();
                        }
						if (VDCTree && angular.isArray(selectNode) && selectNode.length == 0) {
						    var selectNode = VDCTree.getSelected();
                        }
						
						if (angular.isArray(selectNode) && selectNode.length == 1) {
						    scope.entity = selectNode[0].stateParams;

                            //虚拟桌面池
						    if (selectNode[0].entryType == 'desktop_mng') {
						        scope.showMenu('desktopMngMenu');
						    }
						    //虚拟桌面
						    if (selectNode[0].entryType == 'desktop') {
                                scope.showMenu('desktopMenu');
                            }
						    //组织管理
						    if (selectNode[0].entryType == 'orgMng') {
						        scope.showMenu('orgMngMenu');
                            }
						    //组织
						    if (selectNode[0].entryType == 'org') {
                                scope.showMenu('orgMenu');
                            }
						    //资源池
						    if (selectNode[0].entryType == 'resource_pool') {
						        scope.showMenu('resourcePoolMenu');
						    }
						    //资源池管理
						    if (selectNode[0].entryType == 'resourcePoolMng') {
                                scope.showMenu('resourcePoolMngMenu');
                            }
						} else {
							//云资源
							if (toE.id == 'cloudResourceAccordionLinkId' || toE.innerHTML == $translate.instant('cloudResource.cloudResource') ||
							    toE.innerText == $translate.instant('cloudResource.cloudResource') || toE.className == 'accordiong-icon icon-cloudresource') {
								scope.showMenu('cloudMenu');
							}
						}
					} else {
						//set row data
						casNodeMenu.hide();
						casMenu.show();	//修改问题单201612050442：左侧数节点和虚拟机列表的右键菜单来回切换时右键菜单弹出的位置不准确的问题	 --by ckf6302
						if (angular.isArray(scope.casContextMenu) && scope.casContextMenu.length == 1) {
							scope.entity = scope.casContextMenu[0];
						}
						if (scope.casContextMenuType == 'vmlist') {
							scope.showMenu('vmMenu');
						} else if (scope.casContextMenuType == 'cloudVmlist') {
							scope.showMenu('cloudVmMenu');
							if (angular.isArray(scope.casContextMenu) && scope.casContextMenu.length > 1) {
	                            scope.entity = scope.casContextMenu;
	                            scope.showMenu('cloudVmMenuBatch');
	                        }
						} else if (scope.casContextMenuType == 'vmwareVmlist' || 
						           scope.casContextMenuType == 'vmwareDeskpool' ||
						           scope.casContextMenuType == 'vmwareOrg') {
						    //vmware虚拟机右击菜单(云资源，虚拟桌面，组织)
						    scope.showMenu('vmwareVmMenu');
						    //批量vmwareBatchVmMenu
						    if (angular.isArray(scope.casContextMenu) && scope.casContextMenu.length > 1) {
                                scope.entity = scope.casContextMenu;
                                scope.showMenu('vmwareBatchVmMenu');
                            }
						} else if (scope.casContextMenuType == 'cloudOSVmlist' || 
						           scope.casContextMenuType == 'cloudOSOrg') {
						    //cloudOS虚拟机右击菜单(云资源，组织)
						    scope.showMenu('cloudOSVmMenu');
						    //批量cloudOSBatchVmMenu
						    if (angular.isArray(scope.casContextMenu) && scope.casContextMenu.length > 1) {
                                scope.entity = scope.casContextMenu;
                                scope.showMenu('cloudOSBatchVmMenu');
                            }
						} else if (scope.casContextMenuType == 'fixedDeskpool' || scope.casContextMenuType == 'cvmOrg') {
                            //CAS固定桌面池虚拟桌面和组织右击菜单
                            scope.showMenu('vmMenu');
                            if (angular.isArray(scope.casContextMenu) && scope.casContextMenu.length > 1) {
                                scope.entity = scope.casContextMenu;
                                scope.showMenu('cloudVmMenuBatch');
                            }
                        } else if (scope.casContextMenuType == 'floatDeskpool') {
                            //CAS浮动桌面池虚拟桌面右击菜单
                            scope.showMenu('vmMenu');
                            scope.isFloatDesk = true;
                            if (angular.isArray(scope.casContextMenu) && scope.casContextMenu.length > 1) {
                                scope.entity = scope.casContextMenu;
                                scope.showMenu('cloudVmMenuBatch');
                            }
                        }
					}
					if (angular.isDefined(scope.casEnterNodeType)) {
						scope.entity.entryNodeType = scope.casEnterNodeType;
					}
					if (scope.cloudVmMenu || scope.vmMenu) {
						var params = {};
						params.cloudId = scope.entity.cloudId;
						params.id = scope.entity.id;
						$http({
					    	method: "GET",
					    	url: "domain/basicInfo",
					    	params: params
					    }).success(function(result) {
					        var msg = {};
					        if(result.state == 0) {
    							msg.id = scope.entity.id;
    							msg.title = result.data.title;
    							msg.status = result.data.status;
    							msg.haManage = result.data.haManage;
    							msg.haStatus = result.data.haStatus;
    							msg.haEnable = result.data.hostHaEnable;
    							msg.hostStatus = result.data.hoststatus;
    							msg.protect = result.data.protectModel;
    							msg.castoolStatus = result.data.castoolStatus;
					        } else {
					            //修改问题单：201605180071  未知状态虚拟机无法显示菜单
					            msg.id = scope.entity.id;
                                msg.title = scope.entity.title || scope.entity.name;
                                msg.status = 'unknown';
                                msg.haManage = 1;
                                msg.haStatus = 0;
                                msg.haEnable = 1;
                                msg.hostStatus = 0;
					        }
							$timeout(function(){
								scope.vm = DomainService.updateVmButton(msg);
							});
						});
					}
//					if (scope.hostMenu) {
//						$http.get('host/queryHostOverviewInfo?hostId=' + scope.entity.id).success(function(result){
//				    		var data = result.data;
//				    		if(angular.isArray(data)){
//				    			var msg = {};
//				    			msg.id = scope.entity.id;
//				    			msg.status = data[9].hostStatus;
//				    			scope.hostdata = HostService.updateHostButton(msg);
//				    		}
//				    	});
//					}
					scope.$apply();   //apply menu status
					//若右键菜单无可用的按钮，则不显示右键菜单		--by ckf6302
					if(scope.casContextMenuType == 'node'){
						var availableBtns=$("#"+scope.casContextMenuId).find("li").length;
						if(availableBtns==0){
							return false;
						}
					}else{
						var availableBtns=$("#"+scope.casContextMenuId).find("li").length;
						if(availableBtns==0){
							return false;
						}
					}
				},
				onItem: function(context, e) {
					//operator vm while click menu
					var toE = e.toElement;
					if (isEmpty(toE)) {
	    				toE = e.target;
	    			}
					var clazz = null;
					var text = null;
					if (toE.localName == 'li') {
						if (toE.firstChild.className == 'dropdown-forbidden') {
							return false;
						}
						clazz = toE.firstChild.children[0].className;
						text = toE.firstChild.children[1].innerHTML;
					} else if (toE.localName == 'a') {
						if (toE.className == 'dropdown-forbidden') {
							return false;
						}
						clazz = toE.children[0].className;
						text = toE.children[1].innerHTML;
					} else {
						var parentEl = toE.parentElement;
						if (parentEl.className == 'dropdown-forbidden') {
							return false;
						}
						clazz = toE.className;					//get class value for icon click
						text = toE.innerHTML;					//get text value for text click
					}
					scope.showTaskList = scope.$root.showTaskList;
					//----------------------------------------- Domain Menu -------------------------------------
					if (scope.vmMenu || scope.cloudVmMenu) {
					    var cloudTree = $('#'+constant.cloudTreeId).data('treeview');
						if (text == $translate.instant('menu.start') || clazz == 'sm-icon icon-start') {
							DomainService.startVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.pause') || clazz == 'sm-icon icon-pause-yellow') {
							DomainService.pauseVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.resume') || clazz == 'sm-icon icon-vm-resume') {
							DomainService.resumeVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.sleep') || clazz == 'sm-icon icon-vm-sleep') {
							DomainService.sleepVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.restart') || clazz == 'sm-icon icon-vm-reboot') {
							DomainService.restartVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.shutdown') || clazz == 'sm-icon icon-vm-shutdown') {
							DomainService.shutdownVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.close') || clazz == 'sm-icon icon-vm-power-off') {
							DomainService.closeVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.clone') || clazz == 'sm-icon icon-vm-clone') {
							DomainService.cloneVm(scope.entity);
						} else if (text == $translate.instant('menu.migrate') || clazz == 'sm-icon icon-vm-migrate') {
							DomainService.migrateVm(scope.entity);
						} else if (text == $translate.instant('menu.backup') || clazz == 'sm-icon icon-vm-backup') {
							DomainService.backupVm(scope.entity);
						} else if (text == $translate.instant('menu.snapshotMng') || clazz == 'sm-icon icon-vm-snapshot') {
							DomainService.snapshotVm(scope.entity);
						} else if (text == $translate.instant('menu.delete') || clazz == 'sm-icon icon-delete') {
							DomainService.deleteVm(scope.entity, scope.showTaskList);
						} else if (text == $translate.instant('menu.openConsole') || clazz == 'sm-icon icon-vm-console') {
							DomainService.openConsole(scope.entity);
						} else if (text == $translate.instant('vm.backupMng') || clazz == 'sm-icon icon-cvm-bakcup-hisotry') {
							DomainService.backupMng(scope.entity);
						} else if (text == $translate.instant('menu.upgradeCastools') || clazz == 'sm-icon icon-upgrade') {//升级Castools
                            DomainService.upgradeCastools(scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.distributeVm') || clazz == 'sm-icon icon-distributeVm') {//分配虚拟机
                            DomainService.distributeVm(scope.entity.cloudId, scope.entity);
                        } else if (text == $translate.instant('menu.revokeDomain') || clazz == 'sm-icon icon-revokeDomain') {//取消分配虚拟机
                            DomainService.revokeDomain(scope.entity.cloudId, scope.entity);
                        } else if (text == $translate.instant('menu.etrieve') || clazz == 'sm-icon icon-synchronize') {//分配虚拟机
                            DomainService.retrieveVm(scope.entity);
                        } else if (text == $translate.instant('menu.cloneTemplate') || clazz == 'sm-icon icon-vm-clone-to-template') {//克隆为模板
                            DomainService.cloneTemplate(scope.entity);
                        } else if (text == $translate.instant('menu.toTemplate') || clazz == 'sm-icon icon-vm-convert-to-template') {//转换为模板
                            DomainService.toTemplate(scope.entity);
                        }
					}
					//----------------------------------------- 虚拟机批量操作 -------------------------------------
					if (scope.cloudVmMenuBatch) {
					    if (text == $translate.instant('menu.start') || clazz == 'sm-icon icon-start') {//批量启动
					        DomainService.batchStartVm(scope.entity, scope.showTaskList);
					    } else if (text == $translate.instant('menu.pause') || clazz == 'sm-icon icon-pause-yellow') {
					    	DomainService.batchPauseVm(scope.entity, scope.showTaskList);
					    } else if (text == $translate.instant('menu.resume') || clazz == 'sm-icon icon-vm-resume') {//批量恢复
					        DomainService.batchResumeVm(scope.entity, scope.showTaskList);
					    } else if (text == $translate.instant('menu.restart') || clazz == 'sm-icon icon-vm-reboot') {//批量重启
					        DomainService.batchRestartVm(scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.shutdown') || clazz == 'sm-icon icon-vm-shutdown') {//批量关闭
                            DomainService.batchShutdownVm(scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.close') || clazz == 'sm-icon icon-vm-power-off') {//批量关闭电源
                            DomainService.batchCloseVm(scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.delete') || clazz == 'sm-icon icon-delete') {//批量删除
                            DomainService.batchDeleteVm(scope.entity);
                        } else if (text == $translate.instant('menu.upgradeCastools') || clazz == 'sm-icon icon-upgrade') {//批量升级Castools
                            DomainService.batchUpgradeCastools(scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.batchMigrateVm') || clazz == 'sm-icon icon-vm-migrate') {
					        //批量迁移
				            DomainService.batchMigrateVm(scope.entity);
					    } else if (text == $translate.instant('menu.batchCreateRestorePoint') || clazz == 'sm-icon icon-vm-restore') {
					        //批量创建还原点
				            DomainService.batchCreateRestorePoint(scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.batchModifyVm') || clazz == 'sm-icon icon-modify') {
                            //批量修改虚拟机
                            DomainService.batchModifyVm(scope.entity); 
                        } else if (text == $translate.instant('menu.distributeVm') || clazz == 'sm-icon icon-operator') {
                            //批量分配
                            for (var i = 0; i < scope.entity.length; i++) {
                                scope.entity[i].cloudType = 2;
                            }
                            DomainService.batchDistributeVm(scope.entity);
                        }
					}
					//----------------------------------------- VMware虚拟机 Menu -------------------------------------
					if (scope.vmwareVmMenu) {
					    scope.operateVmwareVm = function(type) {
					        var operateInfo = {
					                type:$translate.instant('menu.'+type),
					                name:scope.entity.name
					        };
					        var name = scope.entity.name;
                            var vmKey = scope.entity.vmKey;
                            var cloudId = scope.entity.vCenterId;
					        DomainService.operateVmwareVm(type, name, vmKey, cloudId, operateInfo, scope.showTaskList);
					    };
                        if (text == $translate.instant('menu.start') || clazz == 'sm-icon icon-start') {
                            scope.operateVmwareVm('start');
                        } else if (text == $translate.instant('menu.sleep') || clazz == 'sm-icon icon-vm-sleep') {
                            scope.operateVmwareVm('sleep');
                        } else if (text == $translate.instant('menu.restart') || clazz == 'sm-icon icon-vm-reboot') {
                            scope.operateVmwareVm('restart');
                        } else if (text == $translate.instant('menu.shutdown') || clazz == 'sm-icon icon-vm-shutdown') {
                            scope.operateVmwareVm('shutdown');
                        } else if (text == $translate.instant('menu.close') || clazz == 'sm-icon icon-vm-power-off') {
                            scope.operateVmwareVm('close');
                        } else if (text == $translate.instant('menu.delete') || clazz == 'sm-icon icon-delete') {
                            DomainService.deleteVmwareVm([scope.entity], scope.entity.status, scope.entity.vCenterId, scope.showTaskList);
                        } else if (text == $translate.instant('menu.createSnapshot') || clazz == 'sm-icon icon-vm-snapshot') {
                            DomainService.createVmwareSnapshot(scope.entity.vCenterId, scope.entity.vmKey, scope.entity.name, scope.entity.status, scope.showTaskList);
                        } else if (text == $translate.instant('menu.cloneTemplate') || clazz == 'sm-icon icon-vm-clone-to-template') {
                            DomainService.cloneVmwareTemplate(scope.entity.vCenterId, scope.entity.vmKey, scope.entity.name, scope.entity.status, scope.showTaskList);
                        } else if (text == $translate.instant('menu.distributeVm') || clazz == 'sm-icon icon-operator') {//分配虚拟机
                            var vmData = {
                                    status:scope.entity.status,
                                    vmKey:scope.entity.vmKey,
                                    name:scope.entity.name,
                                    id:scope.entity.id
                            };
                            DomainService.distributeVm(scope.entity.vCenterId, vmData);
                        } else if (text == $translate.instant('menu.revokeDomain') || clazz == 'sm-icon icon-revokeDomain') {//取消分配虚拟机
                        	var vmData = {
                                    status:scope.entity.status,
                                    vmKey:scope.entity.vmKey,
                                    name:scope.entity.name,
                                    id:scope.entity.id
                            };
                            DomainService.revokeDomain(scope.entity.vCenterId, vmData);
                        } else if (text == $translate.instant('menu.migrate') || clazz == 'sm-icon icon-vm-migrate') {
                            DomainService.migrateVmwareVm(scope.entity.vCenterId, scope.entity.vmKey);
                        } 
                    }
					//vmare虚拟机批量操作
					if(scope.vmwareBatchVmMenu) {
					    var type = '';
				        if (text == $translate.instant('menu.start') || clazz == 'sm-icon icon-start') {
				            type = 'start';
				            var operateInfo = {type:$translate.instant('menu.'+type),};
	                        DomainService.batchOperateVmwareVm(type, scope.entity, operateInfo, scope.showTaskList);
                        } else if (text == $translate.instant('menu.sleep') || clazz == 'sm-icon icon-vm-sleep') {
                            type = 'sleep';
                            var operateInfo = {type:$translate.instant('menu.'+type),};
                            DomainService.batchOperateVmwareVm(type, scope.entity, operateInfo, scope.showTaskList);
                        } else if (text == $translate.instant('menu.restart') || clazz == 'sm-icon icon-vm-reboot') {
                            type = 'restart';
                            var operateInfo = {type:$translate.instant('menu.'+type),};
                            DomainService.batchOperateVmwareVm(type, scope.entity, operateInfo, scope.showTaskList);
                        } else if (text == $translate.instant('menu.shutdown') || clazz == 'sm-icon icon-vm-shutdown') {
                            type = 'shutdown';
                            var operateInfo = {type:$translate.instant('menu.'+type),};
                            DomainService.batchOperateVmwareVm(type, scope.entity, operateInfo, scope.showTaskList);
                        } else if (text == $translate.instant('menu.close') || clazz == 'sm-icon icon-vm-power-off') {
                            type = 'close';
                            var operateInfo = {type:$translate.instant('menu.'+type),};
                            DomainService.batchOperateVmwareVm(type, scope.entity, operateInfo, scope.showTaskList);
                        } else if (text == $translate.instant('menu.delete') || clazz == 'sm-icon icon-delete') {
                            type = 'delete';
                            var operateInfo = {type:$translate.instant('menu.'+type),};
                            DomainService.batchOperateVmwareVm(type, scope.entity, operateInfo, scope.showTaskList);
                        }  else if (text == $translate.instant('menu.distributeVm') || clazz == 'sm-icon icon-operator') {
                            //批量分配
                            for (var i = 0; i < scope.entity.length; i++) {
                                scope.entity[i].cloudType = 3;
                            }
                            DomainService.batchDistributeVm(scope.entity);
                        }
				        
					}
					//----------------------------------------- cloudOS虚拟机 Menu -------------------------------------
					if (scope.cloudOSVmMenu) {
                        if (text == $translate.instant('menu.start') || clazz == 'sm-icon icon-start') {
                        	DomainService.operateCloudOSVm('start', scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.shutdown') || clazz == 'sm-icon icon-vm-shutdown') {
                        	DomainService.operateCloudOSVm('close', scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.resume') || clazz == 'sm-icon icon-vm-resume') {
                        	DomainService.operateCloudOSVm('revert', scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('vm.suspended') || clazz == 'sm-icon icon-vm-sleep') {
                        	DomainService.operateCloudOSVm('suspended', scope.entity, scope.showTaskList);
                        } else if (text == $translate.instant('menu.distributeVm') || clazz == 'sm-icon icon-operator') {
                        	DomainService.distributeVm(scope.entity.cloudId, scope.entity);
                        } else if (text == $translate.instant('menu.revokeDomain') || clazz == 'sm-icon icon-revokeDomain') {//取消分配虚拟机
                            DomainService.revokeDomain(scope.entity.cloudId, scope.entity);
                        } else if (text == $translate.instant('menu.delete') || clazz == 'sm-icon icon-delete') {
                        	DomainService.operateCloudOSVm('delete', scope.entity, scope.showTaskList);
                        } 
                    }
					//cloudOS虚拟机批量操作
					if(scope.cloudOSBatchVmMenu) {
					    var type = '';
				        if (text == $translate.instant('menu.start') || clazz == 'sm-icon icon-start') {
				            type = 'start';
                        } else if (text == $translate.instant('menu.close') || clazz == 'sm-icon icon-vm-power-off') {
                            type = 'close';
                        }  
				        var operateInfo = {
                                type:$translate.instant('menu.'+type),
                        };
                        DomainService.batchOperateCloudOSVm(type, scope.entity, operateInfo);
					}
					//----------------------------------------- 云资源 Menu -------------------------------------
					if (scope.cloudMenu) {
					    //当点击“增加云资源”时，弹出框；点击“+”时clazz为
					    if (text == $translate.instant('menu.addCloundResource') || clazz == 'sm-icon icon-add cloudResource') {
					        CloudResourceService.addCloudResource();
                        }
					}
					//----------------------------------------- 组织管理 Menu -------------------------------------
					if (scope.orgMngMenu) {
					    OrgService.addOrg();
					}
					if (scope.orgMenu) {
					    var org = {id:scope.entity.id,
					            name:scope.entity.name};
					    if (text == $translate.instant('resourcePool.releaseResourcePool') || clazz == 'sm-icon icon-resourcePool') {
					    	 var refreshOrgRp = function() {
	                                $rootScope.$broadcast('refreshOrgRp', "");
	                            };
					        OrgService.releaseResourcePool(scope.entity.id, refreshOrgRp);
					    } else if (text == $translate.instant('menu.modifyOrg') || clazz == 'sm-icon icon-modify') {
					        var refreshOrgList = function() {
                                $rootScope.$broadcast(constant.onRefreshOrgList, "");
                            };
					        OrgService.modifOrg(org, refreshOrgList);
                        } else if (text == $translate.instant('menu.deleteOrg') || clazz == 'sm-icon icon-delete') {
                            OrgService.delOrg(org,function() {
                            });
                        } else if (text == $translate.instant('menu.addUser') || clazz == 'sm-icon icon-operator-add') {
                            var addUserModal = $modal.open({
                                templateUrl: 'html/modal/systemManage/user/addUser.html',
                                controller: 'addUserCtrl',
                                backdrop:'static',
                                resolve:{
                                    type:function(){return "orgAdd";},
                                    rowObject:function(){return {orgId:org.id,orgName:org.name};}
                                }
                            });
                        } else if (text == $translate.instant('menu.addGroup') || clazz == 'sm-icon icon-operator-group') {
                            var addUserGrpModal = $modal.open({
                                templateUrl: 'html/modal/systemManage/userGroup/addUserGrp.html',
                                controller: 'addUserGrpCtrl',
                                backdrop:'static',
                                resolve:{
                                    type:function(){return "orgAddGrp";},
                                    rowObj:function(){return {orgId:org.id,orgName:org.name};}
                                }
                            });
                        }
					}
					//----------------------------------------- 虚拟桌面池 Menu -------------------------------------
					if (scope.desktopMngMenu) {
					    DesktopService.addDesktop();
					}
					if(scope.desktopMenu) {
					    var desk = {id:scope.entity.id,
					            name:scope.entity.name};
					    if (text == $translate.instant('menu.modifyDesktopPool') || clazz == 'sm-icon icon-modify') {
					        DesktopService.modifyDesktop(desk);
                        } else if (text == $translate.instant('menu.deleteDesktopPool') || clazz == 'sm-icon icon-delete') {
                            DesktopService.delDesktop(desk);
                        } 
					}
					//-------------------------------------------- 资源池Menu ------------------------------------
					if (scope.resourcePoolMngMenu) { //资源池管理
					    ResourcePoolService.addResourcePool();
					}
					if (scope.resourcePoolMenu) { //资源池节点
					    var resourcePool = {id:scope.entity.id, name:scope.entity.name, cloudType:scope.entity.cloudType};
					    if (text == $translate.instant('menu.modifyResourcePool') || clazz == 'sm-icon icon-modify') {
					        ResourcePoolService.modifyResourcePool(resourcePool);
                        } else if (text == $translate.instant('menu.deleteResourcePool') || clazz == 'sm-icon icon-delete') {
                            ResourcePoolService.deleteResourcePool(resourcePool);
                        } else if (text == $translate.instant('menu.releaseStoragePool') || clazz == 'sm-icon icon-storage') {
                            ResourcePoolService.addStorage(resourcePool);
                        } else if (text == $translate.instant('menu.releaseVswitch') || clazz == 'sm-icon icon-vswitch') {
                            ResourcePoolService.releaseVswitch(resourcePool.id);
                        }
					}
				}
			});
		}		
	}
})
.directive('slider', function($timeout) { //滑动滚动条
	  return {
		restrict : 'AE',
		template:'<div class="slider-horizontal" style="{{sliderstyle}}"><div id="slider{{sliderId}}" class="slider-track"></div></div>'+
				 '<input id="input{{sliderId}}" type="text"  value="{{bindData}}" style="{{inputstyle}}" class="slider-input"><span style="margin-left:5px;">{{text}}</span>',
		controller:"SliderCtrl",
		scope:{
			bindData:'=',
			sliderId:'@',
			inputstyle:'@',
			sliderstyle:'@',
			text:'@',
			min:'@',
			max:'@',
			disabled:'@',
			pipsRest:'@',		//决定在slider滑块上其它pip的样式, 参数值："label", "pip" or false，默认为"pip"
			pipsStep:'=',		//类型为"Number"或"array",若为"Number"表示间隔多少生成pip，若为"array"则表示pip的位置，去掉头尾，从1开始计算
			pipsLabels:'@',		//使用数组中给定的值覆盖pips的值。参数值："array ", "object " or false，默认为"false"
			pipsPrefix:'@',		//类型String, 在pip 标签之前添加一个字符串。
			pipsSuffix:'@',		//类型String, 在pip 标签之后添加一个字符串。
			floatPrefix:'@',	//类型String, 在浮动label之前添加一个字符串。
			floatSuffix:'@',	//类型String, 在浮动label之后添加一个字符串。
			floatLabels:'@'		//使用数组给定的值覆盖floats。参数值："array ", "object " or false，默认为"false"
		},
		link:function(scope,element,attrs,ctrl){
			scope.$watch('disabled',function(newVal, oldVal){
				$timeout(function(){
					$( "#slider"+scope.sliderId ).slider({disabled:newVal});
				})
			})
		}
	  };
})
.controller("SliderCtrl",["$scope","$timeout",function($scope,$timeout){
	$timeout(function(){
		var min = parseInt($scope.min||1);
		var max = parseInt($scope.max||100);
		var disabled;
		if (angular.isDefined($scope.disabled) && $scope.disabled == 'true') {
			disabled = true;
		} else {
			disabled = false;
		}
		var pips ={};
		if (angular.isDefined($scope.pipsRest)) {
			pips.rest=$scope.pipsRest;
		}
		if (angular.isDefined($scope.pipsStep)) {
			pips.step=$scope.pipsStep;
		}
		if (angular.isDefined($scope.pipsLabels)) {
			pips.labels=$scope.pipsLabels;
		}
		if (angular.isDefined($scope.pipsPrefix)) {
			pips.prefix=$scope.pipsPrefix;
		}
		if (angular.isDefined($scope.pipsSuffix)) {
			pips.suffix=$scope.pipsSuffix;
		}
		var float ={};
		if (angular.isDefined($scope.floatPrefix)) {
			float.prefix=$scope.floatPrefix;
		}
		if (angular.isDefined($scope.floatSuffix)) {
			float.suffix=$scope.floatSuffix;
		}
		if (angular.isDefined($scope.floatLabels)) {
			float.labels=$scope.floatLabels;
		}
		$( "#slider"+$scope.sliderId ).slider({
		      orientation: "horizontal",
		      range: "min",
		      min: min,
		      max: max,
		      value: parseInt($scope.bindData)||min,
		      disabled: disabled,
		      slide: function( event, ui ) {
		        $("#input"+$scope.sliderId).val( ui.value );
		        $scope.$apply(function(){
				     $scope.bindData=ui.value;
		        });
		      },
			  change: function(event, ui) {
				  $("#input"+$scope.sliderId).val( ui.value );
				  $scope.$apply(function(){
			    	  $scope.bindData=ui.value;
			      });
			  }
		}).slider("pips", pips).slider("float", float);; 
		if(!isNaN($scope.bindData)){
			$("#input"+$scope.sliderId).val( $scope.bindData );
		}else{
			$("#input"+$scope.sliderId).val(min);
		}
		//输入框失去焦点的blur事件
		$("#input"+$scope.sliderId).on("blur",function(){
			var val=parseInt($("#input"+$scope.sliderId).val()),max=$( "#slider"+$scope.sliderId).slider('option','max'),
			min=$( "#slider"+$scope.sliderId).slider('option','min');
			if(val>max){
				$("#input"+$scope.sliderId).val(max);
				$( "#slider"+$scope.sliderId).slider("value",max);
				$scope.$apply(function(){
			        $scope.bindData=max;
				});
			}else if(val<min){
				$("#input"+$scope.sliderId).val(min);
				$( "#slider"+$scope.sliderId).slider("value",min);
				$scope.$apply(function(){
			        $scope.bindData=min;
				});
			}else{
			    //修改val为空时,显示NaN问题
				$scope.$apply(function(){
				    if (isNaN(val)) {
				        $scope.bindData=min;
				        $( "#slider"+$scope.sliderId).slider("value",min);
				    } else {
				        $scope.bindData=val;
				        $( "#slider"+$scope.sliderId).slider("value",val);
				    }
				});
			}
		});
		//输入框的键盘事件驱动
		$("#input"+$scope.sliderId).keydown(function(e){
			var e=e||event;
			if(!((e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8||(e.keyCode > 95 && e.keyCode < 106)||e.keyCode==110)){
				return false;
			}
		}).keyup(function(e){
			var e=e||event;
			if(e.keyCode==13){
				$("#input"+$scope.sliderId).trigger("blur");
			}
		});
	});
}])
.directive('seniorSlider', function($timeout) { //带浮动框的滑动滚动条
	  return {
		restrict : 'AE',
		template:'<div class="slider-horizontal" style="{{sliderstyle}}"><div id="slider{{sliderId}}" class="slider-track"></div></div>',
		controller:"SeniorSliderCtrl",
		scope:{
			bindData:'=',
			sliderId:'@',
			sliderstyle:'@',
			min:'@',
			max:'@',
			step:'@',
			disabled:'@',
			tooltip:'@', 		//设置浮动框是否一直显示，若一直显示，则为‘always’
			pipsRest:'@',		//决定在slider滑块上其它pip的样式, 参数值："label", "pip" or false，默认为"pip"
			pipsStep:'=',		//类型为"Number"或"array",若为"Number"表示间隔多少生成pip，若为"array"则表示pip的位置，去掉头尾，从1开始计算
			pipsLabels:'@',		//使用数组中给定的值覆盖pips的值。参数值："array ", "object " or false，默认为"false"
			pipsPrefix:'@',		//类型String, 在pip 标签之前添加一个字符串。
			pipsSuffix:'@',		//类型String, 在pip 标签之后添加一个字符串。
			floatPrefix:'@',	//类型String, 在浮动label之前添加一个字符串。
			floatSuffix:'@',	//类型String, 在浮动label之后添加一个字符串。
			floatLabels:'@'		//使用数组给定的值覆盖floats。参数值："array ", "object " or false，默认为"false"
		},
		link:function(scope,element,attrs,ctrl){
			scope.$watch('disabled',function(newVal, oldVal){
				$timeout(function(){
					$( "#slider"+scope.sliderId ).slider({disabled:newVal});
				})
			});
			element.ready(function() {
				if (angular.isDefined(scope.tooltip) && scope.tooltip == 'always') {
					$( "#slider"+scope.sliderId ).find('.ui-slider-tip').css({visibility:"visible",opacity:"1",top:"-30px"});
				}
			});
		}
	  };
})
.controller("SeniorSliderCtrl",["$scope","$timeout",function($scope,$timeout){
	$timeout(function(){
		var min = parseInt($scope.min||0);
		var max = parseInt($scope.max||100);
		var step = parseInt($scope.step||1);
		var disabled;
		if (angular.isDefined($scope.disabled) && $scope.disabled == 'true') {
			disabled = true;
		} else {
			disabled = false;
		}
		var pips ={};
		if (angular.isDefined($scope.pipsRest)) {
			pips.rest=$scope.pipsRest;
		}
		if (angular.isDefined($scope.pipsStep)) {
			pips.step=$scope.pipsStep;
		}
		if (angular.isDefined($scope.pipsLabels)) {
			pips.labels=$scope.pipsLabels;
		}
		if (angular.isDefined($scope.pipsPrefix)) {
			pips.prefix=$scope.pipsPrefix;
		}
		if (angular.isDefined($scope.pipsSuffix)) {
			pips.suffix=$scope.pipsSuffix;
		}
		var float ={};
		if (angular.isDefined($scope.floatPrefix)) {
			float.prefix=$scope.floatPrefix;
		}
		if (angular.isDefined($scope.floatSuffix)) {
			float.suffix=$scope.floatSuffix;
		}
		if (angular.isDefined($scope.floatLabels)) {
			float.labels=$scope.floatLabels;
		}
		$( "#slider"+$scope.sliderId ).slider({
		      orientation: "horizontal",
		      range: "min",
		      min: min,
		      max: max,
		      step : step,
		      value: parseInt($scope.bindData)||min,
		      disabled: disabled,
		      slide: function( event, ui ) {
			      $scope.$apply(function(){
			    	  $scope.bindData=ui.value;
			      });
			  },
			  change: function(event, ui) {
				  $scope.$apply(function(){
			    	  $scope.bindData=ui.value;
			      });
			  }
		}).slider("pips", pips).slider("float", float);
	});
}])
.directive('casPermissionTree',function($http, UtilService){
	 return {
		    restrict:'A',
		    scope:{
		    	id :'@',
		    	bindModel:'=',
		    	disabledModel:'=',//需要desable的权限数组
		    	disableAll:'@',  //disable所有节点
		    	type:'@'		//add, edit, view
		    },
		    link:function(scope, element, attrs, ctrl) {
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
		    	//deep check all children
		    	var checkAllChildren = function(data, array) {
					var children = data.nodes;  //if no children, the value is null
					if (children != null) {
						for (var i = 0; i < children.length; i++) {
							if (children[i].state.checked == false) {
								array.push(children[i].nodeId);
							}
							checkAllChildren(children[i], array);
						}
					}
		    	};
		    	//deep uncheck all children
		    	var uncheckAllChildren = function(data, array) {
		    		var children = data.nodes;  //if no children, the value is null
					if (children != null) {
						for (var i = 0; i < children.length; i++) {
							if (children[i].state.checked == true) {
								array.push(children[i].nodeId);
							}
							uncheckAllChildren(children[i], array);
						}
					}
		    	};
		    	//找到所有父节点的id
		    	var getAllParent = function(tree, data, array) {
		    	    var parentId = data.parentId;
		    	    if (angular.isDefined(parentId)) {
		    	        var parentData = tree.getNode(parentId);
		    	        array.push(parentData.nodeId);
		    	        getAllParent(tree, parentData, array);
		    	    }
		    	}
		    	//判断一个子节点是否有其他兄弟节点被选中
		    	var hasSiblingChecked = function(tree, data) {
		    	    var parentId = data.parentId;
		    	    if (angular.isDefined(parentId)) {
		    	        var parentData = tree.getNode(parentId);
		    	        var children = parentData.nodes;
		    	        for (var i = 0; i < children.length; i++) {
		    	            var child = children[i];
		    	            if (child.data.base == false && child.state.checked == true) {
		    	                return true;
		    	            }
		    	        }
		    	    }
		    	    return false;
		    	}
		    	//将base选中
		    	var checkBase = function(tree, data, array) {
		    	    if (data.data.base == true) {//base节点不做处理
		    	        return;
		    	    }
		    	    var parentId = data.parentId;
                    if (angular.isDefined(parentId)) {
                        var parentData = tree.getNode(parentId);
                        var children = parentData.nodes;
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child.data.base == true && child.state.checked == false) {
                                array.push(child.nodeId);
                            }
                        }
                    }
		    	}
		    	
		    	//检查所有父节点是否需要去选中
                var uncheckAllParent = function(tree, data, array, escapeNodeId) {
                    var parentId = data.parentId;
                    if (angular.isDefined(parentId)) {
                        var parentData = tree.getNode(parentId);
                        if(parentData.nodes) {
                            for(var i = 0; i < parentData.nodes.length; i++) {
                                if(parentData.nodes[i].nodeId == escapeNodeId) {
                                    continue;
                                }
                                if(parentData.nodes[i].state.checked == true) {
                                    return;
                                }
                            }
                        }
                        array.push(parentData.nodeId);
                        uncheckAllParent(tree, parentData, array, parentData.nodeId);
                    }
                }
		    	//监控disabledModel的变化，动态设置desable节点
                scope.$watch('disabledModel', function(newValue, oldValue) {
                    //先enabel所有节点，再disable指定节点
                    if (angular.isArray(newValue)) {
                        var checkedIds = [];
                        var disabledIds = [];
                        var permTree = $('#' + scope.id).data('treeview');
                        if (angular.isUndefined(permTree)) {
                            return;
                        }
                        permTree.enableAll({silent:true});
                        permTree.uncheckAll({silent:true});
                        //获取所有节点
                        var selects = permTree.getSelected();
                        var unselects = permTree.getUnselected();
                        if (angular.isArray(selects) && selects.length > 0) {
                            unselects = unselects.concat(selects);
                        }
                        for (var i = 0; i < unselects.length; i++) {
                            if ($.inArray(unselects[i].entryId, scope.disabledModel) >= 0) {
                                disabledIds.push(unselects[i].nodeId);
                                checkedIds.push(unselects[i].nodeId);
                            }
                            if ($.inArray(unselects[i].entryId, scope.bindModel) >= 0) {
                                checkedIds.push(unselects[i].nodeId);
                            }
                            if (unselects[i].data.base == true) {
                                checkedIds.push(unselects[i].nodeId);
                                getAllParent(permTree, unselects[i], checkedIds)
                            }
                        }
                        if (scope.disableAll == 'true') {
                            permTree.disableAll();
                        } else {
                            permTree.disableNode(disabledIds, {silent:true});//设置disabled的节点
                        }   
                        permTree.checkNode(checkedIds, {silent:true});//选中节点
                        checkedIds.splice(0, checkedIds.length);//clear array
                        disabledIds.splice(0, disabledIds.length);
                    }                   
                }, true);
		    	//load tree data
		    	var areawaitId = UtilService.areawait(scope.id,true);
		    	$http.get('operator/permission').
		    	success(function(data) {
		    		UtilService.dismissAreawait(areawaitId);
		    		if (data) {
		    			var checkedIds = [];
		    			var disabledIds = [];
		    			//create tree
		    			$('#' + scope.id).treeview({
		    				data : data,
		    				levels:5,
		    				enableLinks:false,
		    				showCheckbox:true,
		    				color:'#000',
		    				onhoverColor: '#DFDFDF',
 	        				backColor:'#fff',
		    				showBorder:false, //不显示边框。
		    				onNodeSelected:function(event, data) {
		    					//when select node
		    					var checks = [];
		    					var unchecks = [];
		    					if (data.state.checked == true) {
		    						//if is checked, uncheck it
		    					    if (data.data.base != true) {//base权限不能去选中
		    					        unchecks.push(data.nodeId);
		    					    } else {
		    					        if (!hasSiblingChecked(permTree, data)) {
		    					            unchecks.push(data.nodeId);
		    					        }
		    					    }
		    						uncheckAllChildren(data, unchecks);
		    						uncheckAllParent(permTree, data, unchecks, data.nodeId);
		    					} else {
		    						//if unchecded, check it
		    						checks.push(data.nodeId);
		    						checkBase(permTree, data, checks);  //如果base未选中,则选中
		    						checkAllChildren(data, checks);
		    						getAllParent(permTree, data, checks);//如果有父节点，一并选中
		    					}
		    					permTree.uncheckNode(unchecks, {silent:true});
		    					permTree.checkNode(checks, {silent:true});
		    				},
		    				onNodeChecked:function(event, data) {
		    					//when a node has children, check all children
		    					var checks = [];
		    					checkAllChildren(data, checks);
		    					checkBase(permTree, data, checks);  //如果base未选中,则选中
		    					getAllParent(permTree, data, checks);//如果有父节点，一并选中
		    					permTree.checkNode(checks, {silent:true});
		    				},
		    				onNodeUnchecked:function(event, data) {
		    				    //如果是base权限，且只有此权限被选中,则不允许取消
		    				    if (data.data.base == true && hasSiblingChecked(permTree, data)) {
		    				        permTree.toggleNodeChecked(data.nodeId, {silent:true});
		    				        return;
		    				    }
		    					//when a node has children, uncheck all children
		    					var unchecks = [];
		    					uncheckAllChildren(data, unchecks);
		    					uncheckAllParent(permTree, data, unchecks);
		    					permTree.uncheckNode(unchecks, {silent:true});
		    				},
		    			});
		    			var permTree = $('#' + scope.id).data('treeview');
		    			var selects = permTree.getSelected();
                        var unselects = permTree.getUnselected();
                        if (angular.isArray(selects) && selects.length > 0) {
                            unselects = unselects.concat(selects);
                        }
                        for (var iu = 0; iu < unselects.length; iu++) {
                            var data = unselects[iu];
                            //收集desabled的节点
                            if (scope.disableAll != 'true' && angular.isArray(scope.disabledModel)) {
                                if ($.inArray(data.entryId, scope.disabledModel) >= 0) {
                                    disabledIds.push(data.nodeId);
                                    checkedIds.push(data.nodeId);
                                }
                            }
                            //if type is add
                            if (angular.isArray(scope.bindModel) && $.inArray(data.entryId, scope.bindModel) >= 0) {
                                checkedIds.push(data.nodeId);
                            }  else {
                            	if (scope.type == 'add') {
                                    if (data.data.base == true) {
                                        checkedIds.push(data.nodeId);
                                        getAllParent(permTree, data, checkedIds)
                                    }
                                } 
                            }
                        }
                        
                        if (scope.disableAll == 'true') {
                            permTree.disableAll();
                        } else {
                            permTree.disableNode(disabledIds, {silent:true});//设置disabled的节点
                        }   
                        permTree.checkNode(checkedIds, {silent:true});//选中节点
                        checkedIds.splice(0, checkedIds.length);//clear array
                        disabledIds.splice(0, disabledIds.length);
		    		}
		    	}).
		    	error(function(data, code, headers, cfg) {
		    	    UtilService.dismissAreawait(areawaitId);
		    		UtilService.handleError(code);
		    	});
			},
		  };
})
.directive('casTree',function($http, UtilService){
	 return {
		    restrict:'A',
		    scope:{
		    	id :'@',
		    	bindModel:'=',
		    	disabledModel:'=',//需要desable的权限数组
		    	disableAll:'@',  //disable所有节点
		    	type:'@',		//add, edit, view
		    	treeData:'=' //树的数据
		    },
		    link:function(scope, element, attrs, ctrl) {
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
		    	//deep check all children
		    	var checkAllChildren = function(data, array) {
					var children = data.nodes;  //if no children, the value is null
					if (children != null) {
						for (var i = 0; i < children.length; i++) {
							if (children[i].state.checked == false) {
								array.push(children[i].nodeId);
							}
							checkAllChildren(children[i], array);
						}
					}
		    	};
		    	//deep uncheck all children
		    	var uncheckAllChildren = function(data, array) {
		    		var children = data.nodes;  //if no children, the value is null
					if (children != null) {
						for (var i = 0; i < children.length; i++) {
							if (children[i].state.checked == true) {
								array.push(children[i].nodeId);
							}
							uncheckAllChildren(children[i], array);
						}
					}
		    	};
		    	//找到所有父节点的id
		    	var getAllParent = function(tree, data, array) {
		    	    var parentId = data.parentId;
		    	    if (angular.isDefined(parentId)) {
		    	        var parentData = tree.getNode(parentId);
		    	        array.push(parentData.nodeId);
		    	        getAllParent(tree, parentData, array);
		    	    }
		    	}
		    	//判断一个子节点是否有其他兄弟节点被选中
		    	var hasSiblingChecked = function(tree, data) {
		    	    var parentId = data.parentId;
		    	    if (angular.isDefined(parentId)) {
		    	        var parentData = tree.getNode(parentId);
		    	        var children = parentData.nodes;
		    	        for (var i = 0; i < children.length; i++) {
		    	            var child = children[i];
		    	            if (child.data.base == false && child.state.checked == true) {
		    	                return true;
		    	            }
		    	        }
		    	    }
		    	    return false;
		    	}
		    	//将base选中
		    	var checkBase = function(tree, data, array) {
		    	    if (data.data.base == true) {//base节点不做处理
		    	        return;
		    	    }
		    	    var parentId = data.parentId;
                    if (angular.isDefined(parentId)) {
                        var parentData = tree.getNode(parentId);
                        var children = parentData.nodes;
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child.data.base == true && child.state.checked == false) {
                                array.push(child.nodeId);
                            }
                        }
                    }
		    	}
		    	
		    	//检查所有父节点是否需要去选中
                var uncheckAllParent = function(tree, data, array, escapeNodeId) {
                    var parentId = data.parentId;
                    if (angular.isDefined(parentId)) {
                        var parentData = tree.getNode(parentId);
                        if(parentData.nodes) {
                            for(var i = 0; i < parentData.nodes.length; i++) {
                                if(parentData.nodes[i].nodeId == escapeNodeId) {
                                    continue;
                                }
                                if(parentData.nodes[i].state.checked == true) {
                                    return;
                                }
                            }
                        }
                        array.push(parentData.nodeId);
                        uncheckAllParent(tree, parentData, array, parentData.nodeId);
                    }
                }
		    	//监控disabledModel的变化，动态设置desable节点
                scope.$watch('disabledModel', function(newValue, oldValue) {
                    //先enabel所有节点，再disable指定节点
                    if (angular.isArray(newValue)) {
                        var checkedIds = [];
                        var disabledIds = [];
                        var permTree = $('#' + scope.id).data('treeview');
                        if (angular.isUndefined(permTree)) {
                            return;
                        }
                        permTree.enableAll({silent:true});
                        permTree.uncheckAll({silent:true});
                        //获取所有节点
                        var selects = permTree.getSelected();
                        var unselects = permTree.getUnselected();
                        if (angular.isArray(selects) && selects.length > 0) {
                            unselects = unselects.concat(selects);
                        }
                        for (var i = 0; i < unselects.length; i++) {
                            if ($.inArray(unselects[i].entryId, scope.disabledModel) >= 0) {
                                disabledIds.push(unselects[i].nodeId);
                                checkedIds.push(unselects[i].nodeId);
                            }
                            if ($.inArray(unselects[i].entryId, scope.bindModel) >= 0) {
                                checkedIds.push(unselects[i].nodeId);
                            }
                            if (unselects[i].data.base == true) {
                                checkedIds.push(unselects[i].nodeId);
                                getAllParent(permTree, unselects[i], checkedIds)
                            }
                        }
                        if (scope.disableAll == 'true') {
                            permTree.disableAll();
                        } else {
                            permTree.disableNode(disabledIds, {silent:true});//设置disabled的节点
                        }   
                        permTree.checkNode(checkedIds, {silent:true});//选中节点
                        checkedIds.splice(0, checkedIds.length);//clear array
                        disabledIds.splice(0, disabledIds.length);
                    }                   
                }, true);
                
                scope.$watch('treeData', function(newValue, oldValue) {
                	var checkedIds = [];
	    			var disabledIds = [];
	    			//create tree
	    			$('#' + scope.id).treeview({
	    				data : scope.treeData,
	    				levels:5,
	    				enableLinks:false,
	    				showCheckbox:true,
	    				color:'#000',
	    				onhoverColor: '#DFDFDF',
        				backColor:'#fff',
	    				showBorder:false, //不显示边框。
	    				onNodeSelected:function(event, data) {
	    					//when select node
	    					var checks = [];
	    					var unchecks = [];
	    					if (data.state.checked == true) {
	    						//if is checked, uncheck it
	    					    if (data.data.base != true) {//base权限不能去选中
	    					        unchecks.push(data.nodeId);
	    					    } else {
	    					        if (!hasSiblingChecked(permTree, data)) {
	    					            unchecks.push(data.nodeId);
	    					        }
	    					    }
	    						uncheckAllChildren(data, unchecks);
	    						uncheckAllParent(permTree, data, unchecks, data.nodeId);
	    					} else {
	    						//if unchecded, check it
	    						checks.push(data.nodeId);
	    						checkBase(permTree, data, checks);  //如果base未选中,则选中
	    						checkAllChildren(data, checks);
	    						getAllParent(permTree, data, checks);//如果有父节点，一并选中
	    					}
	    					permTree.uncheckNode(unchecks, {silent:true});
	    					permTree.checkNode(checks, {silent:true});
	    				},
	    				onNodeChecked:function(event, data) {
	    					//when a node has children, check all children
	    					var checks = [];
	    					checkAllChildren(data, checks);
	    					checkBase(permTree, data, checks);  //如果base未选中,则选中
	    					getAllParent(permTree, data, checks);//如果有父节点，一并选中
	    					permTree.checkNode(checks, {silent:true});
	    				},
	    				onNodeUnchecked:function(event, data) {
	    				    //如果是base权限，且只有此权限被选中,则不允许取消
	    				    if (data.data.base == true && hasSiblingChecked(permTree, data)) {
	    				        permTree.toggleNodeChecked(data.nodeId, {silent:true});
	    				        return;
	    				    }
	    					//when a node has children, uncheck all children
	    					var unchecks = [];
	    					uncheckAllChildren(data, unchecks);
	    					uncheckAllParent(permTree, data, unchecks);
	    					permTree.uncheckNode(unchecks, {silent:true});
	    				},
	    			});
	    			var permTree = $('#' + scope.id).data('treeview');
	    			var selects = permTree.getSelected();
                    var unselects = permTree.getUnselected();
                    if (angular.isArray(selects) && selects.length > 0) {
                        unselects = unselects.concat(selects);
                    }
                    for (var iu = 0; iu < unselects.length; iu++) {
                        var data = unselects[iu];
                        //收集desabled的节点
                        if (scope.disableAll != 'true' && angular.isArray(scope.disabledModel)) {
                            if ($.inArray(data.entryId, scope.disabledModel) >= 0) {
                                disabledIds.push(data.nodeId);
                                checkedIds.push(data.nodeId);
                            }
                        }
                        //if type is add
                        if (angular.isArray(scope.bindModel) && $.inArray(data.entryId, scope.bindModel) >= 0) {
                            checkedIds.push(data.nodeId);
                        }  else {
                        	if (scope.type == 'add') {
                                if (data.data.base == true) {
                                    checkedIds.push(data.nodeId);
                                    getAllParent(permTree, data, checkedIds)
                                }
                            } 
                        }
                    }
                    
                    if (scope.disableAll == 'true') {
                        permTree.disableAll();
                    } else {
                        permTree.disableNode(disabledIds, {silent:true});//设置disabled的节点
                    }   
                    permTree.checkNode(checkedIds, {silent:true});//选中节点
                    checkedIds.splice(0, checkedIds.length);//clear array
                    disabledIds.splice(0, disabledIds.length);
                }, true);
			},
		  };
})
.directive('vmViewTree',function($http, $timeout, UtilService){
	 return {
		    restrict:'A',
		    scope:{
		    	id :'@',
		    	selectNode:'='
		    },
		    link:function(scope, element, attrs, ctrl) {
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
		    	
		    	scope.treeData = [];
		    	var navTreeId = '#cloudResourceTree';//vmviewTree
		    	var navTree = $(navTreeId).data('treeview');
		    	
		    	//create tree first
		    	scope.ctreatTreeData = function(initData) {
		        	var options = {
		        			data: initData,
		    				enableLinks:false,// 设置<a>标记的超链接无效
		    				color:'#000',
		    				onhoverColor: '#DFDFDF',
 	        				backColor:'#fff',
 	        				level:3,
		    				onNodeSelected:function(event, data) {
		    				    //如果选中的是目录，则同步选中导航树中打目录
		    				    if (data.entryType == 'vmView_dir') {
		    				      //when panel tree selected, select nav tree node too
	                                var msg = {};
	                                msg.entryId = data.entryId;
	                                msg.entryType = data.entryType;
//	                                scope.$root.$broadcast('onVmViewNodeSelected', msg);
	                                scope.$root.$broadcast('onCloudNodeSelected', msg);
		    				    }
		    				    scope.setSelectNode();
		     				},
		     				onNodeExpanded: function(event, data) {
		     				    //展开时也会选中节点了
                                if (data.entryType == 'vmView_dir') {
                                  //when panel tree selected, select nav tree node too
                                    var msg = {};
                                    msg.entryId = data.entryId;
                                    msg.entryType = data.entryType;
//                                  scope.$root.$broadcast('onVmViewNodeSelected', msg);
                                    scope.$root.$broadcast('onCloudNodeSelected', msg);
                                }
                                scope.setSelectNode();
                                
                                var waitModal = UtilService.areawait(scope.id);
		       			    	$http.get('domainView/tree/' + data.id).
		       			    	success(function(result) {
		       			    	    UtilService.dismissAreawait(waitModal);
		       			    		if (angular.isArray(result)) {
		       			    		    //先清空原数据再添加新数据
		       			    		    var parentData = getNodeData(scope.treeData, data.entryId);
    		       			    		if (angular.isObject(parentData) && angular.isArray(parentData.nodes)) {
    		                                parentData.nodes.splice(0, parentData.nodes.length);
    		       			    		}
		       			    			scope.addNodes(data.entryId, data.entryType, result);    			    			
		       			    		}
		       			    	}).
		       			    	error(function(data, code, headers, cfg) {
		       			    	    UtilService.dismissAreawait(waitModal);
		       			    		UtilService.handleError(code);
		       			    	});
		     				}
		        	};
		        	return options;
		        };
		        
		        //给绑定的选中对赋值
		        scope.setSelectNode = function() {
		            if (angular.isUndefined(scope.selectNode)) {
		                return;
		            }
		            $timeout(function() {
		                var selectNodes = tree.getSelected();
	                    scope.selectNode = selectNodes[0];
		            });
		        };
		        
		        scope.addNodes = function(parentEntryId, parentEntryType, subNodes) {
		        	//find parent data in scope.treeData, add sub nodes, and reinit the tree
	    			var parentData = getNodeData(scope.treeData, parentEntryId);
	    			if (parentData == null || angular.isUndefined(parentData.entryId)) {
	    				return;
	    			}
	    			var selectNodes = tree.getSelected();
	    			var node = null;
                    if (angular.isArray(selectNodes) && selectNodes.length > 0) {
                        node = selectNodes[0];
                    }
                    if (node == null) {
                        return;
                    }
                    if (node.state.expanded == true) {
                        //已经展开则直接添加
                        if (angular.isArray(subNodes) && subNodes.length > 0) {
                            if (angular.isUndefined(parentData.nodes) || parentData.nodes == null) {
                                parentData.nodes = subNodes;
                            } else {
                                parentData.nodes = subNodes.concat(parentData.nodes);
                            }                       
                            tree.init(scope.ctreatTreeData(scope.treeData));
                            
                            scope.selectAndExpandNode(tree, parentEntryId, parentEntryType);
                        }   
                    } else {
                        //未展开打则直接查询后展开
                        var waitModal = UtilService.areawait(scope.id);
                        $http.get('domainView/tree/' + node.id).
                        success(function(result) {
                            UtilService.dismissAreawait(waitModal);
                            if (angular.isArray(result)) {
                                //先清空原数据再添加新数据
                                if (angular.isObject(parentData) && angular.isArray(parentData.nodes)) {
                                    parentData.nodes.splice(0, parentData.nodes.length);
                                }
                                if (angular.isUndefined(parentData.nodes) || parentData.nodes == null) {
                                    parentData.nodes = result;
                                } else {
                                    parentData.nodes = result.concat(parentData.nodes);
                                }                       
                                tree.init(scope.ctreatTreeData(scope.treeData));
                                scope.selectAndExpandNode(tree, parentEntryId, parentEntryType);                        
                            }
                        }).
                        error(function(data, code, headers, cfg) {
                            UtilService.dismissAreawait(waitModal);
                            UtilService.handleError(code);
                        });
                    }	    			
		        };
		        
		        scope.deleteNode = function(msg) {
		        	var selectNodes = tree.getSelected();
    				var unselectNodes = tree.getUnselected();
    				if (angular.isArray(selectNodes) && selectNodes.length > 0) {
    					var node = selectNodes[0];
    				}
		        	if (angular.isDefined(node)) {
	        			//如果存在父节点
	        			var parentNode = tree.getNode(node.parentId);
	        			var parentData = getNodeData(scope.treeData, parentNode.entryId);
	        			if (parentData == null || angular.isUndefined(parentData.entryId)) {
	        				return;
	        			}
	        			var index = getNodeIndex(parentData.nodes, msg.nodeTypeId);
	        			parentData.nodes.splice(index, 1);					//delete node data
	        			if (parentData.nodes.length == 0) {
	        				parentData.nodes = null;
	        			}
	        			tree.init(scope.ctreatTreeData(scope.treeData));	//reinit tree data, must call
	        			
	        			scope.selectAndExpandNode(tree, parentData.entryId, parentData.entryType);
		        	}
		        };
		        //选中并展开节点
		        scope.selectAndExpandNode = function(tree, entryId, entryType) {
		            //get new parent node id after reinit.
                    var selectNodes = tree.getSelected();
                    var unselectNodes = tree.getUnselected();
                    if (angular.isArray(selectNodes) && selectNodes.length > 0) {
                        unselectNodes = unselectNodes.concat(selectNodes);
                    }
                    var newNodeId = getNodeId(unselectNodes, entryId, entryType);
                    tree.selectNode(newNodeId, { silent: true });   //select node
                    tree.expandNode(newNodeId, { silent: true });   //expand node
                    tree.revealNode(newNodeId, { silent: true });   //expand node
                    scope.setSelectNode();
		        };
		        
				var treeData = scope.ctreatTreeData(scope.treeData);
   			    $('#'+scope.id).treeview(treeData);   			    
   			    var tree = $('#'+ scope.id).data('treeview');
				
   			    scope.$on('onRefreshVmViewNode', function(evetn, msg) {
   			         //刷新一个节点下的字节点
   			         var waitModal = UtilService.areawait(scope.id);
       			     $http.get('domainView/tree/' + msg.id).
                     success(function(data) {
                         UtilService.dismissAreawait(waitModal);
                         var parentData = getNodeData(scope.treeData, msg.entryId);
                         if (angular.isObject(parentData) && angular.isArray(parentData.nodes)) {
                             parentData.nodes.splice(0, parentData.nodes.length);
                         }                         
                         scope.addNodes(msg.entryId, msg.entryType, data);                         
                     }).
                     error(function(data, code, headers, cfg) {
                         UtilService.dismissAreawait(waitModal);
                         UtilService.handleError(code);
                     });
   			    });
   			    
   			    scope.$on('onQuerySubVMTree', function(event, msg) {
   			    	//load tree data
   			        var waitModal = UtilService.areawait(scope.id);
   			    	if (angular.isUndefined(msg) || angular.isUndefined(msg.id) || msg.id == null) {
   			    		msg.id = -1;
   			    	}
   			    	$http.get('domainView/tree/' + msg.id).
   			    	success(function(data) {
   			    	    UtilService.dismissAreawait(waitModal);
   			    		if (angular.isArray(data) && data.length > 0) {
   			    			msg.nodes = data;
   			    		}   	
   			    		scope.treeData.splice(0, scope.treeData.length);
   			    		scope.treeData.push(msg);
   			    		tree.init(scope.ctreatTreeData(scope.treeData));

	    				scope.selectAndExpandNode(tree, msg.entryId, msg.entryType);
   			    	}).
   			    	error(function(data, code, headers, cfg) {
   			    	    UtilService.dismissAreawait(waitModal);
   			    		UtilService.handleError(code);
   			    	});
   			    });
		    	scope.$on('onAddVmViewSubNodes', function(event, msg) {
		    		scope.addNodes(msg.parentEntryId, msg.parentEntryType, msg.subNodes);
		    	});
		    	scope.$on('onDeleteVmViewSubNodes', function(event, msg) {
		    		scope.deleteNode(msg);
		    	});
			}
		  };
})
.directive('shortcut',function(){
	return{
		restrict:'A',
		scope:{
			cutStr:'@',
			shortWidth:'@',		//自定义截断字符串宽度，默认设置150px
			inSelectInput:'@',
			strFontsize:'@',		//自定义字体大小，默认设置14px
			changeLength:'@'       //截断字符串长度变化监听
		},
		link:function(scope,ele,attrs){
			scope.$watch('cutStr',function(newValue,oldValue){
				var strWidth,strFontsize;
				if(angular.isDefined(scope.shortWidth)){	
					strWidth=Number(scope.shortWidth);
				}else{
					strWidth=150;
				}
				if(angular.isDefined(scope.strFontsize)){
					strFontsize=Number(scope.strFontsize);
				}else{
					strFontsize=14;
				}
				if(newValue&&newValue.getWidth(strFontsize)>strWidth){
					var i=1,showStr;
					for(;i<newValue.length;i++){
						showStr=newValue.substr(0,newValue.length-i);
						if(showStr.getWidth(strFontsize)<strWidth){
							$(ele).text(showStr+'...');
							//use in input
							$(ele).val(showStr+'...');
							$(ele).attr('custom-title',newValue);	//shortcut和customTitle两指令在同一标签内组合使用
							if(angular.isDefined(scope.inSelectInput) && scope.inSelectInput == 'true'){	//在selectInput插件内另作处理
								$(ele).parents(".file-input").attr('custom-title',newValue);
							}
							break;
						}
					}
				}else{
					$(ele).text(newValue);
					$(ele).val(newValue);
					$(ele).attr('custom-title',"");
					if(angular.isDefined(scope.inSelectInput) && scope.inSelectInput == 'true'){
						$(ele).parents(".file-input").attr('custom-title',"");
					}
				}
			});
			
			if (angular.isDefined(scope.changeLength) && scope.changeLength == 'true') {
				scope.$watch("shortWidth", function(newValue, oldValue){
					var strWidth,strFontsize;
					if(angular.isDefined(scope.shortWidth)){	
						strWidth=Number(scope.shortWidth);
					}else{
						strWidth=150;
					}
					if(angular.isDefined(scope.strFontsize)){
						strFontsize=Number(scope.strFontsize);
					}else{
						strFontsize=14;
					}
					if(scope.cutStr&&scope.cutStr.getWidth(strFontsize)>strWidth){
						var i=1,showStr;
						for(;i<scope.cutStr.length;i++){
							showStr=scope.cutStr.substr(0,scope.cutStr.length-i);
							if(showStr.getWidth(strFontsize)<strWidth){
								$(ele).text(showStr+'...');
								//use in input
								$(ele).val(showStr+'...');
								$(ele).attr('custom-title',scope.cutStr);	//shortcut和customTitle两指令在同一标签内组合使用
								if(angular.isDefined(scope.inSelectInput) && scope.inSelectInput == 'true'){	//在selectInput插件内另作处理
									$(ele).parents(".file-input").attr('custom-title',scope.cutStr);
								}
								break;
							}
						}
					}else{
						$(ele).text(scope.cutStr);
						$(ele).val(scope.cutStr);
						$(ele).attr('custom-title',"");
						if(angular.isDefined(scope.inSelectInput) && scope.inSelectInput == 'true'){
							$(ele).parents(".file-input").attr('custom-title',"");
						}
					}
				})
			}
		}
	};
})
.directive('checkSpecialChar',[function(){ // 只允许输入汉字、字母、数字、减号、下划线、空格及点。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var RegExp = /^[a-zA-Z0-9_\x2d.\s\u4E00-\u9FA5\uF900-\uFA2D]+$/;
				var trimRegExp=/\S/;//去掉对全部为空格的校验
			}

            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || (RegExp.test(value)&&trimRegExp.test(value));
                ngModel.$setValidity("specialChar", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkClientName',[function(){ // 只允许输入字母、数字、下划线。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var RegExp = /^[a-zA-Z0-9_]+$/;
				var trimRegExp=/\S/;//去掉对全部为空格的校验
			}
            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || (RegExp.test(value) && trimRegExp.test(value));
                ngModel.$setValidity("clientName", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkUserLoginname',[function(){ // 只允许输入汉字、字母、数字、 减号、下划线、点,空格及@。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var RegExp = /^[a-zA-Z0-9_\x2d.\s@\u4E00-\u9FA5\uF900-\uFA2D]+$/;
				var trimRegExp=/\S+/;//检查空白的字符
			}

            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || (RegExp.test(value)&&trimRegExp.test(value));
                ngModel.$setValidity("userLoginname", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkStartSpace',[function(){ // 检测以空格开头
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || value.indexOf(" ") != 0;
                ngModel.$setValidity("startSpace", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkEndSpace',[function(){ // 检测以空格结尾
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || value.lastIndexOf(" ") != (value.length - 1);
                ngModel.$setValidity("endSpace", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('checkNotblank',[function(){ // 检查非空白字符。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var trimRegExp=/\S/;
			}

            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || trimRegExp.test(value);
                ngModel.$setValidity("notblank", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('ipv6',[function(){ // 校验ipv6的字符串。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var RegExp = /^^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/g;
			}

            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || RegExp.test(value);
                ngModel.$setValidity("ipv6", validity);
                return validity ? value : undefined;
            };
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.directive('casNetcardTree',function($http, UtilService, $timeout){
	 return {
		    restrict:'A',
		    scope:{
		    	treeId:'@',			//树id
		    	treeData :'=',		//存储指定的集群id
		    	getchecked:'=',		//获取树节点的选中情况：全为主机、未选中任何节点、至少选中一个节点
		    	operateType:'@',	//操作树的类型：增加'add'、编辑'edit'
		    	bindCheckednode:'=',	//编辑时，传入所有选中节点的数据
		    	inputReadonly:'@'
		    },
		    link:function(scope, element, attrs) {
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
		        //check parent 
		      	var checkParent = function(tree, data) {
		      		var parentNode=tree.getParent(data.nodeId);
		      		if(data.state.checked==false){
		      			tree.checkNode(data.nodeId, {silent:true});
		      		}
		      		if(angular.isDefined(parentNode)&&parentNode.state.checked==false){
		      			tree.checkNode(parentNode.nodeId, {silent:true});
		      		}
		      	};
		      	//deep uncheck all children
		      	var uncheckAllChildren = function(tree, data,unchecks,flag) {
		      		var children = data.nodes;  //if no children, the value is null
		    		if (children != null) {
		    			for (var i = 0; i < children.length; i++) {
		    				if (children[i].state.checked == true) {
		    					unchecks.push(children[i].nodeId);
		    				}
		    			}
		    		}
		    		var parentNode=tree.getParent(data.nodeId);//判断该节点的父节点下的其他孩子节点是否全未选中，若是则父亲节点也取消选中
		    		if(angular.isDefined(parentNode)){
		    			children = parentNode.nodes;
		    			var j=0;
		    			if (children != null) {
			    			for (var i = 0; i < children.length; i++) {
			    				if (children[i].state.checked == true) {
			    					j++;
			    				}
			    			}
			    		}
		    			if((flag==true&&j==0)||(!flag&&j==1)){
		    				unchecks.push(parentNode.nodeId);
		    			}
		    		}
		      	};
		      	var getcheckedNode=function(){
		      		var tree=$('#' + scope.treeId).data('treeview'),flag="";
			    	var checkedNodes = tree.getChecked(),i=0,index=0;
			    	if (angular.isArray(checkedNodes) && checkedNodes.length > 0) {
			    		for (; index < checkedNodes.length; index++) {
			    			if(angular.isDefined(checkedNodes[index].entryType)&&checkedNodes[index].entryType=='host'){
			        			i++;
			    			}
			    		};
			    	};
			    	if(index==i&&index!=0){
			    		flag='checkedAllHost';
			    	}else if(i>0&&i<index){
			    		flag='checked';
			    	}else if(i==0){
			    		flag="nochecked";
			    	}
			    	return flag;
		      	};
		      	var checkNodesInEdit=function(data){
		      		
		      	}
		    	scope.$watch("treeData", function(newValue, oldValud){
		    		//load tree data
			    	var waitModal = UtilService.wait();
			    	var params={};
			    	params.clusterId=scope.treeData.clusterId;
			    	params.vSwitchId=scope.treeData.vSwitchId;
			    	params.vxlanCas=scope.treeData.vxlanCas;
			    	$http({ 
		                  method: 'GET', 
		                  url: 'tree/getNetcardList',
		                  params:params
		             }).success(function(data) {
			    		waitModal.dismiss();
			    		if (data) {
			    			var checkedIds = [];
			    			//create tree
			    			$('#' + scope.treeId).treeview({
			    				data:data,
			    				levels:1,
			    				enableLinks:false,
			    				showCheckbox:true,
			    				color:'#000',
			    				onhoverColor: '#DFDFDF',
	 	        				backColor:'#fff',
			    				showBorder:false, //不显示边框。
			    				onNodeExpanded:function(event, data) {
			    						if(scope.bindCheckednode){
			    							var netcardTree = $('#' + scope.treeId).data('treeview');
			    							  if(angular.isArray(scope.bindCheckednode)){
			    								if(scope.bindCheckednode.contains(data.entryId)){
			    								   checkedIds.push(data.nodeId);
			    								}
			    								var children = data.nodes;
			    								if(angular.isArray(children)){
			    									for(var i = 0; i < children.length; i++){
			    										if(scope.bindCheckednode.contains(children[i].entryId)){
			    											checkedIds.push(children[i].nodeId);
			    										}
			    									}
			    								}
			    							  }
				    				    }else{
				    				    	if(scope.operateType != 'add'){
				    				    		$http({
				    				        		method: "GET",
				    				        		url: "network/vswitch/" + scope.treeData.vSwitchId
				    				        	}).success(function(result){
				    				        		if(result.data){
				    				        			scope.bindCheckedNode = result.data.pnicList;
				    				        			var netcardTree = $('#' + scope.treeId).data('treeview');
				    									  if(angular.isArray(scope.bindCheckednode)){
				    										if(scope.bindCheckednode.contains(data.entryId)){
				    										   checkedIds.push(data.nodeId);
				    										}
				    										var children = data.nodes;
				    										if(angular.isArray(children)){
				    											for(var i = 0; i < children.length; i++){
				    												if(scope.bindCheckednode.contains(children[i].entryId)){
				    													checkedIds.push(children[i].nodeId);
				    												}
				    											}
				    										}
				    									  }
				    									  netcardTree.checkNode(checkedIds, {silent:true});
				    				        		}
				    				        	});
				    				    		
				    				    	}
				    				    }
			    				},
			    				onNodeSelected:function(event, data) {
			    					//when select node
			    					var checks=[],unchecks=[];
			    					
			    					if (data.state.checked == true) {
		 		    					 //if is checked, uncheck it
			    						 unchecks.push(data.nodeId);
		 		    					 uncheckAllChildren(netcardTree, data,unchecks);
			    						 netcardTree.uncheckNode(unchecks, {silent:true},unchecks);
		 		    				} else {
		 		    					//if unchecded, check it
		 		    					netcardTree.checkNode(data.nodeId, {silent:true});
		 		    					checkParent(netcardTree, data);
		 		    				}
				    				scope.getchecked=getcheckedNode();
			    				},
			    				onNodeChecked:function(event, data) {
			    					checkParent(netcardTree, data);
				    				scope.getchecked=getcheckedNode();
			    				},
			    				onNodeUnchecked:function(event, data) {
			    					var unchecks=[];
			    					uncheckAllChildren(netcardTree, data,unchecks,true);
			    					netcardTree.uncheckNode(unchecks, {silent:true},unchecks);
				    				scope.getchecked=getcheckedNode();
			    				}
			    			});
			    			var netcardTree = $('#' + scope.treeId).data('treeview');
			    			netcardTree.expandAll();//expand all nodes to fire expand event
			    			netcardTree.checkNode(checkedIds, {silent:true});
			    			if(scope.inputReadonly == "true"){
			    				netcardTree.disableAll();
			    			}
			    			
			    			
			    		}
			    	}).error(function(data, code, headers, cfg) {
			    		waitModal.dismiss();
			    		UtilService.handleError(code);
			    	});
		    	}, true)
			}
		  };
})
.directive('gridAlert',function($timeout,$translate){ 
	return {
		require:'?ngModel',
	    restrict:'A',
		link: function(scope, element, attr,ngModelCtrl) {/*style="border:1px solid red; background:#1A1A1A;position:absolute;padding:1px;color:#FFF;font-size:12px;display:none;z-index:9999;"*/
			var orginalValue="",alertDiv='<div id="customTip" class="tooltip in" style="overflow:hidden;display:none;"><div class="tooltip-inner"><div></div>';
			$timeout(function(){
				orginalValue=$(element).val();
			});
			$(element).on('input',function(e){
				var x=Math.round(($(element).width())/2),y=40,alertinfo="";
				var self=this;
				if($(self).hasClass("ng-invalid")){  //出错类型判断
					if($(self).hasClass("ng-invalid-required")){
						alertinfo=$translate.instant("require");
					}else if($(self).hasClass("ng-invalid-checkname")){
						alertinfo=$translate.instant("checkname");
					}else if($(self).hasClass("ng-invalid-maxlength")){
						alertinfo=$translate.instant("maxlen")+$(self).attr("ng-maxlength");
					}else if($(self).hasClass("ng-invalid-ip")){
						alertinfo=$translate.instant("invalidip");
					}else if($(self).hasClass("ng-invalid-mask")){
						alertinfo=$translate.instant("invalidMask");
					}
					
					$(self).removeClass("grayBorder greenBorder").addClass("redBorder");
					if(!document.getElementById("customTip")){
						$(".modal").last().append(alertDiv);	//将弹出的div添加到遮罩层中
					}
					$("#customTip").children().eq(0).text(alertinfo);
					$("#customTip").css({"top": ($(self).offset().top+y) + "px","left": ($(self).offset().left+x) +"px"}).hide();	//设置X  Y坐标， 并且显示
				}else{
					$(self).removeClass("grayBorder redBorder").addClass("greenBorder");
					$("#customTip").remove();    //remove
				}
			}).blur(function(e){
				if($(element).hasClass("ng-invalid")){
					element.val(orginalValue);		//update view
					ngModelCtrl.$setViewValue(orginalValue); //update model
				}
				$(element).removeClass("greenBorder redBorder").addClass("grayBorder");
				$("#customTip").hide();    //remove
			}).mouseenter(function(){
				var self=this,x=Math.round(($(element).width())/2),y=40;
				if($(element).hasClass("ng-invalid")&&document.getElementById("customTip")){
					$("#customTip").css({"top": ($(self).offset().top+y) + "px","left": ($(self).offset().left+x) +"px"}).show();
				}
			}).mouseleave(function(){
				$("#customTip").hide();    //remove
			}).focus(function(){
				if(!$(element).hasClass("ng-invalid")){
					$(element).removeClass("grayBorder redBorder").addClass("greenBorder");
				}
			});
		}
	}
})
.directive('customTitle',function($timeout){ 
	return {
	    restrict:'A',
		link: function(scope, element, attr) {
			$(element).on('mouseenter',function(e){
				/**
				 * 修改问题单：201609140052，解决Firefox中selectInput出现悬浮提示时无法选中其他选项的问题（如增加虚机弹窗中的操作系统下拉框） by ckf6302
				 * Firefox中当出现下拉框时，光标从其他地方快速移进来会出现悬浮提示，导致无法成功切换成其他选项，此时e.relatedTarget为null(其他情况不为null)，
				 * 利用e.relatedTarget这个条件判断，可解决Firefox下的这个bug
				 */
				/** 
				 *  deleted for by z14580 solving 201707060758 cause no other <option> use custom-title in cic .  			
				 *	if($(e.target).is("option") || !e.relatedTarget){
				 *		return ;
				 *	}
				 */
				customTitleMouseEnter(element, e);
			});
			$(element).on('mouseleave click mousedown',function(e){
//				e.stopPropagation();
				customTitleMouseLeave();
			});
		}
	}
})
.directive('ipv4', [function () {
    return {
    	restrict:'A',
        require: "ngModel",
        scope: {
        	allowLocal: "@"
        },
        link: function (scope, element, attr, ngModel) {
        	if (ngModel) {
                var ipRegexp = /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]\d|\d)$/;
            }
            var customValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || ipRegexp.test(value);
                
                if(angular.isDefined(scope.allowLocal) && scope.allowLocal == 'false'){
                	validity = validity && (!value.startWith("127"));
                }
                ngModel.$setValidity("ip", validity);
                return validity ? value : undefined;
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
}])
.directive('casSrmTree',function($http, UtilService){
	 return {
		    restrict:'A',
		    scope:{
		    	id :'@',
		    	bindModel:'=',
		    	url:'@',
		    	params:'@'
		    },
		    link:function(scope, element, attrs, ctrl) {
		    	$(element).bind('contextmenu', function(e) {
		    		e.preventDefault(); //prevent Default meue show
		    	});
		    	//load tree data
		    	var waitModal = UtilService.wait();
		    	$http({
		    		url:scope.url,
		    		method:'GET',
		    		params:angular.fromJson(scope.params),
		    		headers :{
		    			'Content-Type': 'application/json'
		    		}
		    	}).success(function(data) {
		    		waitModal.dismiss();
		    		//{"list":[{"id":1,"name":"cas89","children":[],"ip":"192.168.10.89"}],"isSuccess":true}
		    		if (data && data.list && data.state == 0) {
		    			var checkedIds = [];
		    			//create tree
		    			var tree = $('#' + scope.id).treeview({
		    				data : data.list,
		    				levels:2,
		    				color:'#000',
		    				onhoverColor: '#DFDFDF',
 	        				backColor:'#fff',
 	        				onNodeSelected:function(event, data) {
		    				    if (data.lunType) {
		    				    	scope.bindModel = data;
		    				    } else {
		    				    	scope.bindModel = null;
		    				    }
 	        				}
		    			}).expandAll();//expand all nodes to fire expand event
		    		} else {
		    			UtilService.handleError(data);
		    		}
		    	}).
		    	error(function(data, code, headers, cfg) {
		    		waitModal.dismiss();
		    		UtilService.handleError(code);
		    	});
			},
		  };
})
.directive('checkUrl', function () {
    return {
    	restrict:'A',
        require: "ngModel",
        scope: {
        	urlType: "@"
        },
        link: function (scope, element, attr, ngModel) {
            if (ngModel) {
            	var urlRegexp = "\\:\\/\\/[0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*(:(0-9)*)*(\\/?)([a-zA-Z0-9\\-\\.\\?\\,\\'\\/\\\\+&amp;%\\$#_]*)?$";
            }
            var customValidator = function (value) {
            	var prefixRegex;
                if (angular.isDefined(scope.urlType)) {
                	if (scope.urlType == "ftp") {
                		prefixRegex = "^ftp";
                	} else if (scope.urlType == "http") {
                		prefixRegex = "^http";
                	} else if (scope.urlType == "https") {
                		prefixRegex = "^https";
                	}
                } else {
            		ngModel.$setValidity("checkUrl", false);
            		return undefined;
            	}
                var regexp = new RegExp(prefixRegex + urlRegexp);
                var validity = ngModel.$isEmpty(value) || regexp.test(value);
                
                ngModel.$setValidity("checkUrl", validity);
                return validity ? value : undefined;
            };
            ngModel.$formatters.push(customValidator);
            ngModel.$parsers.push(customValidator);
        }
    };
})
.directive('checkSpecialCharacters',[function(){ // 只允许输入汉字、字母、数字 减号、下划线及点。
	return {
		require:"ngModel",
		scope:{
			isNeedCheck:"="
		},
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var reg = /^[a-zA-Z0-9_\x2d.\u4E00-\u9FA5\uF900-\uFA2D]+$/;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					validity = reg.test(value);;
					if (angular.isDefined(scope.isNeedCheck) && scope.isNeedCheck == false) {
						validity = true;
					}
					ngModel.$setValidity("specialCharacters", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}])
.controller('NewcasTabController', ['$scope',function TabsetCtrl($scope) {
	var ctrl = this,
      	tabs = ctrl.tabs = $scope.tabs = [];

	ctrl.select = function(selectedTab) {
		angular.forEach(tabs, function(tab) {
			if (tab.active && tab !== selectedTab) {
				tab.active = false;
			}
		});
		selectedTab.active = true;
		selectedTab.onSelect();
	};

	ctrl.addTab = function addTab(tab) {
		tabs.push(tab);
		// we can't run the select function on the first tab
		// since that would select it twice
		if (tabs.length === 1) {
			tab.active = true;
		} else if (tab.active) {
			ctrl.select(tab);
		}
	};
}])
.directive('newcastabset', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
//			type: '@'
		},
		controller: 'NewcasTabController',
		template: ' <ul class=\"newcas-tabs\" ng-transclude></ul>',
		link: function(scope, element, attrs) {

		}
	};
})
.directive('newcastab', ['$parse', function($parse) {
	return {
		require: '^newcastabset',
		restrict: 'E',
		replace: true,
		template: '<li ng-class="{active: active,newnavliActive2:active}"><a ui-sref="{{href}}" ng-click="select()" ng-class="{newnavaActive2:active}"><span class="sm-icon {{icon}}"></span><span>{{heading}}</span></a><div class="navTriangle" ng-if=\"active==true\" ng-style=\"halfLiwidth\"></div></li>',
		scope: {
			active: '@',
			heading: '@',
			icon: '@',
			href:'@',
			onSelect: '&select', // This callback is called in
								 // contentHeadingTransclude
                         		 // once it inserts the tab's content into the dom
			halfLiwidth:'@'		 //store the half width of the li tag

		},
		controller: function() {
			// Empty controller so other directives can require being 'under' a tab
		},
		compile: function(elm, attrs, transclude) {
			return function postLink(scope, elm, attrs, tabsetCtrl) {
				scope.$watch('active', function(active) {
					if (active) {
						tabsetCtrl.select(scope);
					}
				});

				scope.disabled = false;
				if ( attrs.disabled ) {
					scope.$parent.$watch($parse(attrs.disabled), function(value) {
						scope.disabled = !!value;
					});
				}

				scope.select = function() {
					if ( !scope.disabled ) {
						scope.active = true;
						/*计算每个选项卡标题所在li标签的宽度，灵活设置下面倒三角的位置*/
						var halfli=Number(($(elm).width()-8)/2);
						scope.halfLiwidth={'left':halfli+'px'};
					}
				};
				tabsetCtrl.addTab(scope);
			};
		}
	};
}])

.controller('NewcasTabController2', ['$scope',function TabsetCtrl($scope) {
	var ctrl = this,
      	tabs = ctrl.tabs = $scope.tabs = [];

	ctrl.select = function(selectedTab) {
		angular.forEach(tabs, function(tab) {
			if (tab.active && tab !== selectedTab) {
				tab.active = false;
			}
		});
		selectedTab.active = true;
	};

	ctrl.addTab = function addTab(tab) {
		tabs.push(tab);
		// we can't run the select function on the first tab
		// since that would select it twice
		if (tabs.length === 1) {
			tab.active = true;
		} else if ((typeof tab.active == "boolean" && tab.active) || (tab.active === "true")) {
			ctrl.select(tab);
		}
	};

}])
.directive('castabset', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
//			type: '@'
		},
		controller: 'NewcasTabController2',
		template: ' <ul class=\"newcas-tabs\" ng-transclude ></ul>',
		link: function(scope, element, attrs) {

		}
	};
})
.directive('castab', ['$parse', function($parse) {
	return {
		require: '^castabset',
		restrict: 'E',
		replace: true,
		template: '<li ng-class="{active: active,newnavliActive2:active,noPointerEvents:active}"><a ui-sref="{{href}}" ng-click="select()" ng-class="{newnavaActive2:active}"><span class="sm-icon {{icon}}"></span><span>{{heading}}</span></a></li>',
		scope: {
			active: '@',
			heading: '@',
			icon: '@',
			href:'@',
			onSelect: '&select' // This callback is called in
								 // contentHeadingTransclude
                         		 // once it inserts the tab's content into the dom

		},
		controller: function() {
			// Empty controller so other directives can require being 'under' a tab
		},
		compile: function(elm, attrs, transclude) {
			return function postLink(scope, elm, attrs, tabsetCtrl) {
				scope.$watch('active', function(active) {
					if ((typeof active == "boolean" && active) || (active === "true")) {
						tabsetCtrl.select(scope);
					}
				});

				scope.disabled = false;
				if ( attrs.disabled ) {
					scope.$parent.$watch($parse(attrs.disabled), function(value) {
						scope.disabled = !!value;
					});
				}

				scope.select = function() {
					if ( !scope.disabled ) {
						scope.active = true;
					}
				};
				
				tabsetCtrl.addTab(scope);
			};
		}
	};
}])
.directive('equalcheck', function() {
    // 检查密码与确认密码是否一致。用法：obj1 确认密码| obj2 密码
    return {
        require:"ngModel",
        scope: {
            obj1 : '=ngModel',
            obj2 : '=',
            considerspace:'='// 是否对比空格。　true是，fals不是。
        },
        link: function (scope, ele, attrs, ngModel) {
        	//监听确认密码的值的变化
            scope.$watch('obj1', function(newValue, oldValue) {
                if (newValue == oldValue) {
                	if(!isEmpty(newValue)){
                    	ngModel.$dirty=true;
                	}
                    ngModel.$setValidity('equalcheck', true);
                    return;
                }
                if (!scope.considerspace) {                	
                	if (!isEmpty(scope.obj1) && !isEmpty(scope.obj2)) {
                		ngModel.$setValidity('equalcheck', ele.val().trim() == scope.obj2.trim());
                		return;
                	}
                }
                ngModel.$setValidity('equalcheck', ele.val() == scope.obj2);
            });
        	//监听密码的值的变化
            scope.$watch('obj2', function(newValue, oldValue) {
                if (newValue == oldValue) {
                    ngModel.$setValidity('equalcheck', true);
                    return;
                }
                if (!scope.considerspace) {                  	
                	if (!isEmpty(scope.obj1) && !isEmpty(scope.obj2)) {
                		ngModel.$setValidity('equalcheck', ele.val().trim() == scope.obj2.trim());
                		return;
                	}
                }
                ngModel.$setValidity('equalcheck', ele.val() == scope.obj2);
            });
        }
    }
}).directive('contentStyle', function($timeout) {
    return {
    	restrict: 'AE',
    	scope :false,
        link: function (scope, ele, attrs) {
//        	$timeout(function(){
//        		var h = ($(window).height() - $(ele)
//        				.offset().top - 15) + 'px';
//        		$(ele).height(h);
//        	});
        }
    }
}).directive('listStyle', function($timeout) { //适用与紧邻底部的列表元素
    return {
    	restrict: 'AE',
    	scope :false,
        link: function (scope, ele, attrs) {
//        	$timeout(function(){
//        		var h = ($(window).height() - $(ele)
//        				.offset().top - 15) + 'px';
//        		$(ele).height(h);
//        	})
//        	scope.$on('onNavClick', function(event, msg) {
//        		$(window).resize();
//	       		 //点击事件触发后对style重新赋值，并触发resize事件调整表格宽度
//	       		 timeout(function() {
//	       			 $('#main').css("overflow","hidden");
//	       			 $(window).resize();
//	       		 });
////	       		 //先禁用main面板的滚动条，再启用防止出现不必要的滚动条。
//	       		 timeout(function() {
//	       			 $('#main').css("overflow","auto"); 
//	       		 }, 30);
//       	 });
        }
    }
}).directive('progressStyle', function($timeout){
	return {
		restrict: 'AE',
		scope: false,
		link: function(scope, ele, attrs){
			$timeout(function(){
				var progressWidth = $(ele).parents(".progressgray").width();
				var margin = (progressWidth - 30) / 2;
				$(ele).css("position", "relative");
				$(ele).css("margin-left", margin + "px");
				$(ele).css("bottom", 1 + "px");
				$(ele).css("width", "60px");
				$(ele).css("display", "inline-block");
			});
		}
	}
}).directive("topStyle", function($timeout){
	return {
		restrict: 'AE',
		scope: {
			id: "@"
		},
		link: function(scope, ele, attrs){
			$timeout(function(){
				var num = $(ele).children().length;
				var offset = -48 * (num - 1);
				if(scope.id != "moreOptionsTab" && num > 4){
					offset = offset + 100;
				}
				$(ele).css("top", offset + "px");
				
			});
		}
	}
})
.directive('cicFolderTree',function($http, $timeout, UtilService){
    //CIC目录结构
    return {
        restrict:'A',
        scope:{
            id :'@',
            url:'@',
            selectNode:'='
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            
            scope.treeData = [];
            //create tree first
            scope.ctreatTreeData = function(initData) {
                var options = {
                        data: initData,
                        enableLinks:false,// 设置<a>标记的超链接无效
                        color:'#000',
                        onhoverColor: '#DFDFDF',
                        backColor:'#fff',
                        level:3,
                        onNodeSelected:function(event, data) {
                            
                            scope.setSelectNode();
                        },
                        onNodeExpanded: function(event, data) {
                            tree.selectNode(data.nodeId, { silent: true });   //select node
                            scope.setSelectNode();
                            var param = {path:data.entryId};
                            var waitModal = UtilService.areawait(scope.id);
                            $http({
                                method  : 'GET',
                                url     : scope.url,
                                params: param
                            }).success(function(result) {
                                UtilService.dismissAreawait(waitModal);
                                if (result.state == 0) {
                                    var resultData = result.data;
                                    if (angular.isArray(resultData)) {
                                        //先清空原数据再添加新数据
                                        var parentData = getNodeData(scope.treeData, data.entryId);
                                        if (angular.isObject(parentData) && angular.isArray(parentData.nodes)) {
                                            parentData.nodes.splice(0, parentData.nodes.length);
                                        }
                                        scope.addNodes(data.entryId, data.entryType, resultData);                               
                                    }
                                }
                                UtilService.handleResult(result);
                            }). error(function(data, code, headers, cfg) {
                                UtilService.dismissAreawait(waitModal);
                                UtilService.handleError(code);
                            });
                        }
                };
                return options;
            };
            
            //给绑定的选中对赋值
            scope.setSelectNode = function() {
                if (angular.isUndefined(scope.selectNode)) {
                    return;
                }
                $timeout(function() {
                    var selectNodes = tree.getSelected();
                    scope.selectNode = selectNodes[0];
                });
            };
            
            scope.addNodes = function(parentEntryId, parentEntryType, subNodes) {
                //find parent data in scope.treeData, add sub nodes, and reinit the tree
                var parentData = getNodeData(scope.treeData, parentEntryId);
                if (parentData == null || angular.isUndefined(parentData.entryId)) {
                    return;
                }
                var selectNodes = tree.getSelected();
                var selectNode = null;
                if (angular.isArray(selectNodes) && selectNodes.length > 0) {
                    selectNode = selectNodes[0];
                }
                if (selectNode == null) {
                    return;
                }
                
                if (selectNode.state.expanded == true) {//已经展开则直接添加
                    if (angular.isArray(subNodes) && subNodes.length > 0) {
                        if (angular.isUndefined(parentData.nodes) || parentData.nodes == null) {
                            parentData.nodes = subNodes;
                        } else {
                            parentData.nodes = subNodes.concat(parentData.nodes);
                        }                       
                        tree.init(scope.ctreatTreeData(scope.treeData));
                        
                        scope.selectAndExpandNode(tree, parentEntryId, parentEntryType);
                    }   
                } else {//未展开打从后台查询
                    if (angular.isArray(parentData.nodes)) {
                        parentData.nodes.splice(0, parentData.nodes.length);
                    } else {
                        parentData.nodes = [];
                    }
                    var param = {path:parentEntryId};
                    var waitModal = UtilService.areawait(scope.id);
                    $http({
                        method  : 'GET',
                        url     : scope.url,
                        params: param
                    }).success(function(result) {
                        UtilService.dismissAreawait(waitModal);
                        if (result.state == 0) {
                            var resultData = result.data;
                            if (angular.isArray(resultData)) {
                                parentData.nodes = resultData.concat(parentData.nodes);
                                tree.init(scope.ctreatTreeData(scope.treeData));
                                scope.selectAndExpandNode(tree, parentEntryId, parentEntryType);                          
                            }
                        }
                        UtilService.handleResult(result);
                    }). error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(waitModal);
                        UtilService.handleError(code);
                    });                    
                }                
            };
            
            //选中并展开节点
            scope.selectAndExpandNode = function(tree, entryId, entryType) {
                //get new parent node id after reinit.
                var selectNodes = tree.getSelected();
                var unselectNodes = tree.getUnselected();
                if (angular.isArray(selectNodes) && selectNodes.length > 0) {
                    unselectNodes = unselectNodes.concat(selectNodes);
                }
                var newNodeId = getNodeId(unselectNodes, entryId, entryType);
                tree.selectNode(newNodeId, { silent: true });   //select node
                tree.expandNode(newNodeId, { silent: true });   //expand node
                tree.revealNode(newNodeId, { silent: true });   //expand node
                scope.setSelectNode();
            };
            
            var treeData = scope.ctreatTreeData(scope.treeData);
            $('#'+scope.id).treeview(treeData);                 
            var tree = $('#'+ scope.id).data('treeview');
            
            scope.loadTreeData = function() {
                //load tree data
                var params = {path:'/'};
                var areawaitId = UtilService.areawait(scope.id);
                $http({
                    method  : 'GET',
                    url     : scope.url,
                    params: params
                }).success(function(result) {
                    UtilService.dismissAreawait(areawaitId);
                    if (result.state == 0) {
                        var data = result.data;
                        scope.treeData.splice(0, scope.treeData.length);
                        //装载根目录
                        var rootFolder = {};
                        rootFolder.entryId = '/';
                        rootFolder.entryType = 'cvm_folder';
                        rootFolder.text = '/';
                        rootFolder.icon = 'icon-folder-gray';
                        rootFolder.nodes = [];
                        scope.treeData.push(rootFolder);
                        if (angular.isArray(data) && data.length > 0) {
                            $timeout(function() {
                                for (var i = 0; i < data.length; i++) {
                                    scope.treeData[0].nodes.push(data[i]);
                                }
                                tree.init(scope.ctreatTreeData(scope.treeData));
                            });
                        }       
                    }
                    UtilService.handleResult(result);
                }).error(function(data, code, headers, cfg) {
                    UtilService.dismissAreawait(areawaitId);
                    UtilService.handleError(code);
                });
            };
            //指令加载完成后加载数据
            element.ready(function() {
                scope.loadTreeData();  
            }, 100);
            
            scope.$on('onAddCvmFolder', function(event, msg) {
                scope.addNodes(msg.parentEntryId, msg.parentEntryType, msg.subNodes);
            });
        }
    };
}).directive('casStoragePool',function($http, $timeout, UtilService, HostService){
    //CVM目录结构
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casStoragePool.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            hostId:'=',         //主机id
            selectPool:'='      //选中的存储池，传入值必须时对象的一个属性，否则值无法获取
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.poolList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
                    scope.selectPool = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            
            scope.$watch('hostId', function(newValue, oldValue) {
                if (newValue != oldValue) {//hostid发生变化时重新加载数据
                    scope.poolList.splice(0, scope.poolList.length);
                    $timeout(function() {
                        scope.selectPool = {};
                    }); 
                    scope.loadPool();
                }
            });
            
            //刷新数据
            scope.$on('onQueryStoragePoolList', function(event, msg) {
                scope.loadPool();
            });
            //加载数据
            scope.loadPool = function() {
                var areawaitId = UtilService.areawait(scope.id);
                var params = {id:scope.hostId};
                $http({
                    method  : 'GET',
                    url     : 'storage/queryStoragePoolList',
                    params: params}).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                            $timeout(function() {
                                scope.poolList = result.data;
                                for (var i = 0; i < scope.poolList.length; i++) {
                                    if (scope.poolList[i].path == '/vms/images') {
                                        scope.selectPool = scope.poolList[i];
                                        scope.selectModel.model = scope.selectPool;
                                        break;
                                    }
                                }
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.loadPool();
            });
            //启动存储池
            scope.startStoragePool = function(row) {
                HostService.startStoragePool(scope.hostId, row);
            };
            //刷新存储池
            scope.refreshStoragePool = function(row) {
                HostService.refreshStoragePool(scope.hostId, row);
            };
            //查看存储池
            scope.viewStoragePool = function(row) {
                HostService.viewStoragePool(scope.hostId, row);
            };
        }
    };
}).directive('casStoragePoolIntersection',function($http, $timeout, UtilService){
    //CVM目录结构
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casStoragePoolIntersection.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            objectId:'=',         //主机id/集群ID/主机池ID
            cloudId:'=',		  //云资源ID
            objectType:'=',       //host/cluster/hostpool
            selectPool:'='      //选中的存储池，传入值必须时对象的一个属性，否则值无法获取
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.poolList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
                    scope.selectPool = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            
            scope.$watch('objectId', function(newValue, oldValue) {
                if (newValue != oldValue) {//hostid发生变化时重新加载数据
                    scope.poolList.splice(0, scope.poolList.length);
                    $timeout(function() {
                        scope.selectPool = {};
                    }); 
                    scope.loadPool();
                }
            });
            
            scope.$watch('objectType', function(newValue, oldValue) {
                if (newValue != oldValue) {//hostid发生变化时重新加载数据
                    scope.poolList.splice(0, scope.poolList.length);
                    $timeout(function() {
                        scope.selectPool = {};
                    }); 
                    scope.loadPool();
                }
            });
            
            //刷新数据
            scope.$on('onQueryStoragePoolIntersectionList', function(event, msg) {
                scope.loadPool();
            });
            //加载数据
            scope.loadPool = function() {
                var areawaitId = UtilService.areawait(scope.id);
                var params = {};
                params.cloudId = scope.cloudId;
                if (scope.objectType == 'host') {
                	params.targetHostId = scope.objectId;
                } else if (scope.objectType == 'cluster') {
                	params.targetClusterId = scope.objectId;
                } else if (scope.objectType == 'hostpool') {
                	params.targetHostPoolId = scope.objectId;
                }
                
                $http({
                    method  : 'GET',
                    url     : 'storage/storagePoolIntersection',
                    params: params}).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                            $timeout(function() {
                                scope.poolList = result.data;
                                for (var i = 0; i < scope.poolList.length; i++) {
                                    if (scope.poolList[i].path == '/vms/images') {
                                        scope.selectPool = scope.poolList[i];
                                        scope.selectModel.model = JSON.stringify(scope.selectPool);
                                        break;
                                    }
                                }
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.loadPool();
            });
        }
    };
}).directive('casTemplateStoragePool',function($http, $timeout, $modal, $translate, UtilService, HttpService){
    //模板存储列表
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casTemplateStoragePool.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            cloudId:'@',
            selectPool:'='      //选中的存储池，传入值必须时对象的一个属性，否则值无法获取
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.poolList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
//                	console.log("newValue="+newValue);
                    scope.selectPool = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            
            //刷新数据
            scope.$on(constant.onRefreshTemplateStorageList, function(event, msg) {
                scope.loadTemplateStoragePool();
            });
            //加载数据
            scope.loadTemplateStoragePool = function() {
                var areawaitId = UtilService.areawait(scope.id);
                $http({
                    method  : 'GET',
                    url     : 'template/'+scope.cloudId+'/templateStorageList'
                    }).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                        	scope.selectPool = null;
                            $timeout(function() {
                                scope.poolList = result.data;
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.loadTemplateStoragePool();
            });
        }
    };
}).directive('casSearchSelect',function($http, $timeout, $translate, UtilService){
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casSearchSelect.html',
        replace: true,
        scope:{
        	bindModel :'=',			//绑定值
            isDisabled:'=',			//输入框是否可以编辑，默认false
            isRequired:'=',			//输入框是否必输，默认false
            isPaging:'=',			//是否需要分页，默认true
            searchUrl:'@',			//查询数据URL（必须）
            searchParams:'=',		//查询数据的参数(必须)
            nameKey:'@', 			//查询数据的参数中与输入框值绑定的参数名称（必须）
            selectedText : '@',		//选中的前台展示属性（必须）
            searchWidth : '@', 		//输入框宽度（必须）
            searchHeight : '@',		//输入框高度
            selectCallback:'=', 	//选中回调方法
            inputHolder:'@', 		//输入框输入字段的提示
            inputName:'@',			//输入框name
            inputMaxlenght:'@',		//输入框最大长度
            entryCallback:'='		//回车回调方法
        },
        controller: function($scope, $element, $attrs, $transclude) {
        	$scope.pagingOptions = {};
        	$scope.pagingOptions.pageSize =5;
        	$scope.pagingOptions.currentPage = 1;
        	$scope.resultTotalRows = 0;
        	$scope.isSelected = false;
        	$scope.ulHeight = "115px";
        	$scope.divHeight = "145px";
        	
        	$scope.divStyle={width: $scope.searchWidth, height:$scope.divHeight};
        	$scope.ulStyle={width: $scope.searchWidth, height:$scope.ulHeight};
        	var canHide = true;
        	
        	if (angular.isUndefined($scope.isRequired)) {
        		$scope.needRequired = false;
        	} else {
        		$scope.needRequired = $scope.isRequired;
        	}
        	
        	if (angular.isUndefined($scope.isDisabled)) {
        		$scope.needDisabled = false;
        	} else {
        		$scope.needDisabled = $scope.isDisabled;
        	}
        	
        	if (angular.isUndefined($scope.isPaging)) {
        		$scope.needPaging = true;
        	} else {
        		$scope.needPaging = $scope.isPaging;
        	}
        	
        	if (angular.isUndefined($scope.searchHeight)) {
        		$scope.searchHeight = "34px";
        	}
        	
        	$scope.search = function() {
        		if($scope.needPaging) {
        			var limit = $scope.pagingOptions.pageSize;
            		var offset = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
            		if ($scope.searchParams) {
    		    		$scope.searchParams.limit= limit;
    		    		$scope.searchParams.offset = offset;
    		    	} else {
    		    		$scope.searchParams = {"limit":limit,"offset" : offset};
    		    	}
        		}
        		$http({
                    method: 'GET',
                    url: $scope.searchUrl,
                    params: $scope.searchParams
                }).success(function(result) {
                	if (result.success == true) {
                		if ($scope.needPaging) {
                			if (angular.isArray(result)) {
                    			$scope.store = result;
    	   				     	$scope.resultTotalRows = result.length;
                    		} else {
    	   		    		 	$scope.store = result.data;
    	   		    		 	$scope.resultTotalRows = result.totalLength;
                    		}
                    		$scope.pageInfo = $translate.instant('common.pageInfo',{currentPage:$scope.pagingOptions.currentPage,maxPages:$scope.maxPages(),resultTotalRows:$scope.resultTotalRows});
                    		$scope.divStyle.height = "145px";
                    		$scope.ulStyle.height = "115px";
                		} else {
                			$scope.store = result.data;
	   				     	$scope.resultTotalRows = result.data.length;
	   				     	$scope.divStyle.height = $scope.resultTotalRows * 23 + "px";
	   				     	$scope.ulStyle.height = $scope.resultTotalRows * 23 + "px";
                		}
                		if($scope.resultTotalRows > 0) {
                			$scope.isShowGrid = true;
                		} else {
                			$scope.isShowGrid = false;
                		}
               	  	}
                 }).error(function(response, code, headers, config) {
                     UtilService.handleError(code);
                });
        	};
        	
        	$scope.maxRows = function () {
                var ret = Math.max($scope.resultTotalRows, $scope.store.length);
                return ret;
            };
        	
        	$scope.maxPages = function () {
        		if ($scope.needPaging) {
        			if($scope.maxRows() === 0) {
                        return 1;
                    }
                    var pageNum = $scope.maxRows() / $scope.pagingOptions.pageSize;
                    if (isNaN(pageNum)) {
                    	return 1;
                    }
                    pageNum = Math.ceil(pageNum);
                    return pageNum;
        		} else {
        			return 1;
        		}
            };
        	
            //上一页
        	$scope.pageForward = function() {
                var curPage = $scope.pagingOptions.currentPage;
                $scope.pagingOptions.currentPage = Math.min(curPage + 1, $scope.maxPages());
            };
            
            //下一页
            $scope.pageBackward = function() {
                var curPage = $scope.pagingOptions.currentPage;
                $scope.pagingOptions.currentPage = Math.max(curPage - 1, 1);
            };
            
            //回到首页
            $scope.pageToFirst = function() {
                $scope.pagingOptions.currentPage = 1;
            };
            
            //前往最后一页
            $scope.pageToLast = function() {
                var maxPages = $scope.maxPages();
                $scope.pagingOptions.currentPage = maxPages;
            };
            
            //能否点击首页，上一页
            $scope.cantPageForward = function() {
                return $scope.pagingOptions.currentPage >= $scope.maxPages();
            };
            
            //能否点击最后一页
            $scope.cantPageToLast = function() {
                if ($scope.resultTotalRows > 0) {
                    return $scope.cantPageForward();
                } else {
                    return true;
                }
            };
            
            //能否点击首页，下一页
            $scope.cantPageBackward = function() {
                var curPage = $scope.pagingOptions.currentPage;
                return curPage <= 1;
            };
        	
        	$scope.selectRow = function(selected) {
        		$scope.bindModel = selected[$scope.selectedText];
                $scope.selectData = selected;
                $scope.isShowGrid = false;
                canHide = true;
                $scope.highlightedRow = 0;
                $scope.isSelected = true;
                $scope.$emit('car-search-select', selected);
                //选择后，输入框重新获得焦点，针对firefox选择后失去焦点
        		var input = angular.element($element).find('input')[0];
                input.focus();
                if (angular.isDefined($scope.selectCallback) && angular.isFunction($scope.selectCallback)) {
        			$scope.selectCallback.apply();
        		}
            };
            
            //回车事件
            $scope.onKeyPress =  function(event) {
            	if (!event) {
                    event = window.event;
                }
            	if (event.which == 13) {
            		if (angular.isDefined($scope.entryCallback) && angular.isFunction($scope.entryCallback)) {
            			$scope.entryCallback.apply();
            		}
            	}
            }
        	
            $scope.$watch('pagingOptions', function (newVal, oldVal) {
		    	if (newVal !== oldVal) {
		    	    $scope.search();
		    	}
		    }, true);
            
            //高亮
        	$scope.setHighlightedRow = function(index) {
        		$scope.highlightedRow = index;
            };
            
            $scope.intoGrid = function() {
            	canHide = false;
            }
            
            $scope.outGrid = function() {
            	canHide = true;
            }
            
            $scope.blur = function() {
        		if(canHide) {
            		$scope.isShowGrid = false;
            	} else {
            		//若是点击选择框，则input重新获得焦点
            		var input = angular.element($element).find('input')[0];
                    input.focus();
            	}
            };
        },
        link:function(scope, element, attrs) {
            scope.$watch("bindModel", function(newValue, oldValue) {
            	if (newValue != oldValue && !scope.isSelected) {
            		if (angular.isUndefined(newValue) || newValue.trim() == '') {
                        scope.isShowGrid = false;
                        return;
                    }
            		//若searchParams未定义，需重新定义
            		if (angular.isUndefined(scope.searchParams)){
            			scope.searchParams = {};
            		}
            		scope.searchParams[scope.nameKey] = newValue;
            		//重新计算当前页
            		scope.pagingOptions.currentPage = 1;
            		scope.search();
            	}
            	scope.isSelected = false;
            });
            
            if (angular.isUndefined(scope.inputMaxlenght)) {
        		var input = angular.element(element).find('input')[0];
        		input.removeAttribute("ng-maxlength");
			}
        }
    };
})
.directive('casVmCheckbox',function(UtilService){
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casVmCheckbox.html',
        replace: false,
        scope:{
        	bigcheckboxId:'@',  //div的id
            selectElement:'=',  //选中元素
            bindData:'='      	//绑定传入的对象数组
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.eleList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                if(angular.isDefined(newValue)&&newValue!=oldValue){
                	scope.selectElement = (angular.fromJson(scope.selectModel.model)).vmName;//将字符串转成json对象;
                }
            });
            
            scope.$watch('bindData', function(newValue, oldValue) {
                if (angular.isDefined(newValue)&&newValue != oldValue) {//hostid发生变化时重新加载数据
                    scope.eleList.splice(0, scope.eleList.length);
                    scope.selectModel = {};
                    scope.loadData();
                }
            },true);
            
            //加载数据
            scope.loadData = function() {
                if(angular.isArray(scope.bindData)){
                	scope.eleList=scope.bindData;
                }
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.loadData();
            });
           
        }
    };
})
.directive('casTimeCheckbox',function(UtilService){
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casTimeCheckbox.html',
        replace: false,
        scope:{
        	bigcheckboxId:'@',  //div的id
            selectElement:'=',  //选中元素
            bindData:'='      	//绑定传入的对象数组
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.eleList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                if(angular.isDefined(newValue)&&newValue!=oldValue){
                	scope.selectElement = (angular.fromJson(scope.selectModel.model)).time;//将字符串转成json对象;
                }
            });
            
            scope.$watch('bindData', function(newValue, oldValue) {
                if (angular.isDefined(newValue)&&newValue != oldValue) {//hostid发生变化时重新加载数据
                    scope.eleList.splice(0, scope.eleList.length);
                    scope.selectModel = {};
                    scope.loadData();
                }
            },true);
            
            //加载数据
            scope.loadData = function() {
                if(angular.isArray(scope.bindData)){
                	scope.eleList=scope.bindData;
                }
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.loadData();
            });
           
        }
    };
})
.directive("repaintDone", function($timeout){
	return {
		restrict: 'A',
		link : function(scope, element, attrs){
            scope.$eval(attrs.repaintDone);
		}
	}
}).directive("casCpuTree", function(UtilService, $http, $timeout){
	return {
		restrict: 'A',
		scope: {
			treeId : "@",
			hostId : "@",
			cloudId : "@",
			domain: '=',
			vcpu: '@',
			isAdd : '@',
			checkType : '@',
			preSelect : '='
		},
		link: function(scope, element, attrs, controller){
			$(element).bind('contextmenu', function(e) {
	    		e.preventDefault(); //prevent Default meue show
	    	});
			
			//deep check all children
	    	var checkAllChildren = function(data, array) {
				var children = data.nodes;  //if no children, the value is null
				if (children != null) {
					for (var i = 0; i < children.length; i++) {
						if (children[i].state.checked == false) {
							array.push(children[i].nodeId);
						}
						checkAllChildren(children[i], array);
					}
				}
	    	};
	    	//deep uncheck all children
	    	var uncheckAllChildren = function(data, array) {
	    		var children = data.nodes;  //if no children, the value is null
				if (children != null) {
					for (var i = 0; i < children.length; i++) {
						if (children[i].state.checked == true) {
							array.push(children[i].nodeId);
						}
						uncheckAllChildren(children[i], array);
					}
				}
	    	};
	    	
	    	if (scope.isAdd != 'true'){
	    		scope.$watch("checkType", function(newValue, oldValue){
	    			var cpuTree = $('#' + scope.treeId).data('treeview');
		    		if (angular.isDefined(cpuTree)){
		    			cpuTree.uncheckAll();
			    		if (newValue == 'numa' ){
			    			cpuTree.enableNode(disabledIdNuma, {silent:true});
			    			if (angular.isArray(scope.cpuMap) && scope.cpuMap.length > 0) {
			    				for (var i = 0; i < scope.cpuMap.length; i++){
			    					cpuTree.removeNodes(scope.cpuMap[i].children, scope.cpuMap[i].parent);
			    				}
			    			}
			    		} else if (newValue == 'cpu') {
		    				cpuTree.disableNode(disabledIdNuma, {silent:true});
			    			if (angular.isArray(scope.cpuMap) && scope.cpuMap.length > 0) {
			    				for (var i = 0; i < scope.cpuMap.length; i++){
			    					cpuTree.addNode(scope.cpuMap[i].parent.nodeId, scope.cpuMap[i].children, true);
			    				}
			    			}
			    		}
		    		}
		    	})
	    	}
			var disabledIdNuma = [];
		    var disabledIdCpu = [];
		    
	    	//初始情况下显示cpu和numa
			$timeout(function(){
				var params = {};
				params.hostId = scope.hostId;
				params.cloudId = scope.cloudId;
				$http({
					method: "GET",
					url: "tree/numaCpu",
					params: params
				}).success(function(data){
					if (data) {
						scope.cpuMap = [];
		    			var checkedIds = [];
		    			//create tree
		    			$('#' + scope.treeId).treeview({
		    				data:data,
		    				levels:1,
		    				enableLinks:false,
		    				showCheckbox:true,
		    				color:'#000',
		    				onhoverColor: '#DFDFDF',
		        			backColor:'#fff',
		    				showBorder:false, //不显示边框。
		    				onNodeSelected: function(event, data){
		    					var checks = [];
		    					var unchecks = [];
		    					if (data.state.checked == true) {
		    						unchecks.push(data.nodeId);
		    						if (scope.isAdd == 'true'){
		    							uncheckAllChildren(data, unchecks);
		    						}
		    					} else {
		    						checks.push(data.nodeId);
		    						if (scope.isAdd == 'true'){
		    							checkAllChildren(data, checks);
		    						}
		    					}
		    					if(angular.isDefined(scope.isAdd) && scope.isAdd == 'false' && data.entryType == 'numa'){
		    						var checkedNodes = cpuTree.getChecked();
		    						if(checkedNodes && angular.isArray(checkedNodes)){
		    							for(var i = 0; i < checkedNodes.length; i++){
		    								if(checkedNodes[i].entryType == 'numa' && checkedNodes[i].entryId != data.entryId){
		    									unchecks.push(checkedNodes[i].nodeId);
		    									var checkedChildren = checkedNodes[i].nodes;
		    									if(checkedChildren != null){
		    										for(var j = 0; j < checkedChildren.length; j++){
		    											if(checkedChildren[j].entryType == 'cpu'){
		    												unchecks.push(checkedChildren[j].nodeId);
		    											}
		    										}
		    									}
		    								}
		    							}
		    						}
		    					}
		    					cpuTree.uncheckNode(unchecks, {silent:true});
		    					cpuTree.checkNode(checks, {silent:true});
		    				},
		    				onNodeExpanded: function(event, data){
		    					if(scope.domain){
		    						//numa node
		    						if(data.entryType == 'numa' && scope.domain.numa && scope.domain.numa.detail.nodeSet == data.entryId &&scope.domain.numa.detail.associate == true && angular.isUndefined(scope.preSelect)){
			    						checkedIds.push(data.nodeId);
			    					}
		    						if(data.entryType == 'numa' && scope.isAdd != 'true') {
		    							disabledIdNuma.push(data.nodeId);
		    							scope.cpuMap.push({parent:angular.copy(data), children:angular.copy(data.nodes)});
		    						}
		    						//cpu node
		    						var children = data.nodes;
		    						if(children != null && angular.isArray(children) && scope.vcpu && angular.isUndefined(scope.preSelect)){
		    							var bindings = scope.domain.cpu.cpudetail.bindPhysicalCpu;
		    							for(var tmpIndex = 0; tmpIndex < bindings.length; tmpIndex++ ){
		    								
		    								if(bindings[tmpIndex].vcpu == scope.vcpu){
		    									pcpus = bindings[tmpIndex].cpuset.split(",");
		    									for(var i = 0; i < pcpus.length; i++){
		    										for(var j = 0; j < children.length; j++){
		    											if(children[j].entryType == 'cpu' && children[j].entryId == pcpus[i]){
		    												checkedIds.push(children[j].nodeId);
		    												break;
		    											}
		    										}
		    									}
		    								}
		    							}
		    						}
		    						
		    					}
		    				},
		    				onNodeChecked: function(event, data){
		    					// isAdd is false, numa节点只能选中一个
		    					var checks = [];
		    					var unchecks = [];
		    					if(angular.isDefined(scope.isAdd) && scope.isAdd == 'false' && data.entryType == 'numa'){
		    						var checkedNodes = cpuTree.getChecked();
		    						if(checkedNodes && angular.isArray(checkedNodes)){
		    							for(var i = 0; i < checkedNodes.length; i++){
		    								if(checkedNodes[i].entryType == 'numa' && checkedNodes[i].entryId != data.entryId){
		    									unchecks.push(checkedNodes[i].nodeId);
		    									var checkedChildren = checkedNodes[i].nodes;
		    									if(checkedChildren != null){
		    										for(var j = 0; j < checkedChildren.length; j++){
		    											if(checkedChildren[j].entryType == 'cpu'){
		    												unchecks.push(checkedChildren[j].nodeId);
		    											}
		    										}
		    									}
		    								}
		    							}
		    						}
		    					}
		    					if (scope.isAdd == 'true'){
		    						checkAllChildren(data, checks);
		    					}
		    					cpuTree.checkNode(checks, {silent:true});
		    					cpuTree.uncheckNode(unchecks, {silent:true});
		    				},
		    				onNodeUnchecked: function(event, data){
		    					var unchecks = [];
		    					uncheckAllChildren(data, unchecks);
		    					cpuTree.uncheckNode(unchecks, {silent:true});
		    				}
		    			});
		    			var cpuTree = $('#' + scope.treeId).data('treeview');
		    			cpuTree.expandAll();
		    			var tree = cpuTree.getTree();
		    			if (scope.preSelect) {
    						if (angular.isArray(scope.preSelect) && scope.preSelect.length > 0){
    							if (angular.isArray(tree) && tree.length > 0){
    								var nodes = [];
    								for (var i = 0; i < tree.length; i++) {
    									nodes.push(tree[i]);
    									if (tree[i].nodes){
    										for (var j = 0; j < tree[i].nodes.length; j++){
        										nodes.push(tree[i].nodes[j]);
        									}
    									}
    									
    								}
    								for (var i = 0; i < scope.preSelect.length; i++){
        								for (var j = 0; j < nodes.length; j++){
        									if (scope.preSelect[i].entryId == nodes[j].entryId && scope.preSelect[i].entryType == nodes[j].entryType){
        										checkedIds.push(nodes[j].nodeId);
        										break;
        									}
        								}
        								
        								
        							}
    							}
    							
    						}
    					}
		    			cpuTree.checkNode(checkedIds, {silent:true});
		    			checkedIds.splice(0, checkedIds.length);//clear array
		    			if (scope.checkType == 'numa' ){
			    			if (angular.isArray(scope.cpuMap) && scope.cpuMap.length > 0) {
			    				for (var i = 0; i < scope.cpuMap.length; i++){
			    					cpuTree.removeNodes(scope.cpuMap[i].children, scope.cpuMap[i].parent);
			    				}
			    			}
			    		} else if (scope.isAdd == 'false'){
			    			cpuTree.disableNode(disabledIdNuma, {silent:true});
			    		}
					}
				}).error(function(data, code, headers, cfg) {
		    		UtilService.handleError(code);
		    	});
			});
		}
	}
}).directive('casCluster',function($http, $timeout, UtilService, HostService){
    //CVM目录结构
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casCluster.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            srcClusterId: '=',
            selectedCluster:'='      //选中的存储池，传入值必须时对象的一个属性，否则值无法获取
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.clusterList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
                    scope.selectedCluster = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            
            //刷新数据
            scope.$on('onQueryStorageclusterList', function(event, msg) {
                scope.load();
            });
            scope.ok = function() {
                scope.$emit('selectDrxCluster');
            }
            scope.isSelected = function(id) {
                if (scope.srcClusterId == id) {
                    return true;
                }
                return false;
            }
            //加载数据
            scope.load = function() {
                var areawaitId = UtilService.areawait(scope.id);
                var params = {};
                $http({
                    method  : 'GET',
                    url     : 'cluster/clustersWithVmInfo',
                    params: params}).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                            $timeout(function() {
                                scope.clusterList = result.data;
                                for (var i = 0; i < scope.clusterList.length; i++) {
                                    if (scope.clusterList[i].id == scope.srcClusterId) {
                                        scope.selectPool = scope.clusterList[i];
                                        break;
                                    }
                                }
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.load();
            });
        }
    };
}).directive('casVm',function($http, $timeout, UtilService, HostService){
    //CVM目录结构
    return {
        restrict:'A',
        templateUrl: 'html/template/input/casVm.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            srcVmId: '=',       //已选择的虚拟机或者虚拟机模板ＩＤ
            selectedVm:'=',      //选中的虚拟机，传入值必须时对象的一个属性，否则值无法获取
            isTemplet:'=',      //true-模板; false－虚拟机
            vmEntities:'='      //外部传入列表数据
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.vmList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
                    scope.selectedVm = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            scope.ok = function() {
                scope.$emit('selectDrxVmOrTemplet');
            }
            scope.isSelected = function(id) {
                if (scope.srcVmId == id) {
                    return true;
                }
                return false;
            }
            //加载数据
            scope.load = function() {
                if (angular.isDefined(scope.vmEntities)) {
                    //如果外部传入数据，则直接使用该数据
                    scope.vmList = scope.vmEntities;
                } else if (!scope.isTemplet) {//虚拟机
                    //TODO　需要时添加
                } else {//虚拟机模板
                    var areawaitId = UtilService.areawait(scope.id);
                    var params = {
                            limit:500,
                            offset:0
                    };
                    $http({
                        method  : 'GET',
                        url     : 'template',
                        params: params}).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                            $timeout(function() {
                                scope.vmList = result.data;
                                for (var i = 0; i < scope.vmList.length; i++) {
                                    if (scope.vmList[i].id == scope.srcVmId) {
                                        scope.selectedVm = scope.vmList[i];
                                        break;
                                    }
                                }
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
                }
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.load();
            });
        }
    };
})
.directive('hasPermission', function(PermissionService) {
  return {
	restrict:'A',
    link: function(scope, element, attrs) {
      if(!angular.isString(attrs.hasPermission))
        throw "hasPermission value must be a string";
  
      var value = attrs.hasPermission.trim();
      var result;
      try {
    	  var exg = /[|&()]/g;
    	  if(exg.test(value)) {
    		  var arr = PermissionService.parseExpression(value);
    		  var exps = '';
    		  for(var index = 0; index < arr.length; index++) {
    			  var temp = arr[index];
    			  if ( temp != '(' && temp != ')' && temp != '||' && temp != '&&') {
    				  temp = PermissionService.hasPermission(temp);
    			  }
    			  exps += temp;
    		  }
    		  result = eval(exps);
    	  } else {
    		  result = PermissionService.hasPermission(value);
    	  }
      } catch(e) {
    	  result = false;
      }
  
      function toggleVisibilityBasedOnPermission() {
        var hasPermission = PermissionService.hasPermission(value);
  
        if(!result)
        	setTimeout(function(){        		
        		$(element).remove();
        	},20);
      }
      toggleVisibilityBasedOnPermission();
      scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
    }
  };
})
.directive('casAceCheck',function($http, $timeout, UtilService){
    //ace checkbox
    return {
        restrict:'E',
        require:'?ngModel',
        template: '<label ng-style="{\'pointer-events\':inputReadonly==\'true\'?\'none\':\'auto\'}" style="width:{{::textWidth}};margin:0px;"><input id="{{::id}}" name="{{::name}}" type="{{::type}}" class="ace ace-checkbox-2" ng-disabled="inputReadonly==\'true\'" ng-checked="checked==\'true\'" style="display:none;"><span class="lbl" style="font-size:12px;"> {{::text}}</span></label>',
        replace: true,
        scope:{
            id:'@',                 //元素id
            name:'@',               //元素名称
            type:'@',               //类型：checkbox或radio
            text:'@',               //显示的文本
            textWidth:'@',          //显示文本的长度
            checkedValue:'@',        //checkbox的选中的值
            uncheckedValue:'@',     //checkbox的未选中的值
            ngModel:'=',          //绑定值
            inputReadonly:'@',
            onCheck:'&',
            onUncheck:'&',
            checked:'@'
        },
        link:function(scope, element, attrs, ngModel) {
            if (angular.isUndefined(scope.textWidth)) {
                scope.textWidth = '100%';
            }
            element.ready(function() {
            	var options = {
    					onEnable : function() {
    						if (angular.isDefined(scope.checkedValue)) {
    							scope.ngModel=scope.checkedValue;
    							ngModel.$setViewValue(scope.ngModel);
    						} else {
    							scope.ngModel = true;
    						}
    						if (angular.isDefined(scope.onCheck)){
    							scope.$eval(scope.onCheck);
    						}
    					},
    					onDisable : function() {
    						if (angular.isDefined(scope.uncheckedValue)) {
    							scope.ngModel=scope.uncheckedValue;
    							ngModel.$setViewValue(scope.ngModel);
    						} else {
    							scope.ngModel = false;
    						}
    						if (angular.isDefined(scope.onUncheck)){
    							scope.$eval(scope.onUncheck);
    						}
    					}
    			};
    			if (!angular.isDefined(scope.type) || scope.type == "checkbox") {    				
    				$(element).checkbox(options);
    			} 
    			$(element).children().on("click",function(e){
    			    if(scope.inputReadonly == 'true'){
                        return false;
                    }
                    if (scope.type == "radio") {                        
                        if (angular.isDefined(scope.checkedValue)) {
                            scope.ngModel=scope.checkedValue;
                        }
                    }
    			});
    			$(element).on("click",function(e){
    			    if(scope.inputReadonly == 'true'){
                        return false;
                    }
                    if (scope.type == "radio") {                        
                        if (angular.isDefined(scope.checkedValue)) {
                            scope.ngModel=scope.checkedValue;
                        }
                    }
    			});
    			scope.$watch("ngModel",function(newValue,oldValue){
    				if (angular.isDefined(scope.ngModel) && scope.ngModel == scope.checkedValue) {
    					$(element).children().attr("checked",true);
    				}
    			});
            });
        }
    };
})
.directive('pwdComplexityCheck',function($translate){
    return {
        require:'ngModel',
        restrict:'A',
        scope: {
            ngModel:'=',
            complexType:'='
        },
        link : function(scope, ele, attrs, c) {
            scope.$watch("ngModel", function(newValue, oldValue) {
                if (angular.isUndefined(newValue)) {
                    return;
                }
                
                //按键间隔设置
                
                var value = c.$viewValue;
                if (angular.isUndefined(value)) {
                    return;
                }
                if (value == 0) {
                    return;
                }
                var password = value;
                var regNum = "[0-9]+";
                var regLowercase = "[a-z]+";
                var regUppercase = "[A-Z]+";
                var regEx = "[`~!@#$%^&*()=|{}':;',\\\\ \\[\\].\"<>/?\\_\\-\\+]+";
                var nothasNum = password.match(new RegExp(regNum)) == null;
                var nothasLowercase = password.match(new RegExp(regLowercase)) == null;
                var nothasUppercase = password.match(new RegExp(regUppercase)) == null;
                var nothasEx = password.match(new RegExp(regEx)) == null;
               
                if (1 == scope.complexType) {//必须混合使用字母和数字
                    if (nothasNum || (nothasLowercase && nothasUppercase)) {
                        c.$setValidity('pwdComplexityCheck', false);
                        return;
                    }
                } else if (2 == scope.complexType) {//必须包含特殊字符
                    if (nothasEx) {
                        c.$setValidity('pwdComplexityCheck', false);
                        return;
                    }
                    
                } else if (3 == scope.complexType) {//必须字母数字特殊字符
                    if (nothasNum || (nothasLowercase && nothasUppercase) || nothasEx) {
                        c.$setValidity('pwdComplexityCheck', false);
                        return;
                    }

                } else if (4 == scope.complexType) {//必须大小写字母数字特殊字符组合
                    if (nothasNum || nothasLowercase || nothasUppercase || nothasEx) {
                        c.$setValidity('pwdComplexityCheck', false);
                        return;
                    }
                }
                c.$setValidity('pwdComplexityCheck', true);
                return;
            });
        }
    };
})
.directive('vmwareStoragePool',function($http, $timeout, $modal, $translate, UtilService, HttpService){
    //模板存储列表
    return {
        restrict:'A',
        templateUrl: 'html/template/vmware/vmwareStoragePool.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            url:'@',
            selectPool:'='      //选中的存储池，传入值必须时对象的一个属性，否则值无法获取
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.poolList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
//                  console.log("newValue="+newValue);
                    scope.selectPool = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
           
            //加载数据
            scope.loadTemplateStoragePool = function() {
                var areawaitId = UtilService.areawait(scope.id);
                $http({
                    method  : 'GET',
                    url     : scope.url,
                    }).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                            scope.selectPool = null;
                            $timeout(function() {
                                scope.poolList = result.data;
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                if (scope.url) {
                    scope.loadTemplateStoragePool();
                }                
            });
            //url变化时进行查询
            scope.$watch('url', function(newValue, oldValue) {
                if (scope.url) {
                    scope.loadTemplateStoragePool();
                }
            });
        }
    };
})
.directive('setTdWidth',function($timeout){
	return {
		restrict:"A",
		link: function (scope,ele,attrs){
			var resizeWidth=function(){
				var timer=$timeout(function (){
					var tableWith=$(ele).parents(".table-responsive:first-child").width()
						, tdWidth=$(ele).attr("set-td-width")
						, tdwidthPx="";
					tdWidth = isEmpty(tdWidth) ?  $(ele).closest("td")[0].style.width : tdWidth;
					if ($(ele).parent().attr("compile").indexOf("expanding") != -1) {
						tdwidthPx = (tableWith*(Number(tdWidth.replace('%', '')) / 100)).toFixed(0) - ($(ele)[0].getBoundingClientRect().left - $(ele).closest("td")[0].getBoundingClientRect().left);
					} else {
						tdwidthPx = (tableWith*(Number(tdWidth.replace('%', '')) / 100)).toFixed(0);
					}
					$(ele).css("width",(tdwidthPx - 16)+'px');
					$timeout.cancel(timer);
				});
			}
			$(window).resize(function(){
				resizeWidth();
			});
			//收缩左侧树时重新调整td宽度
			$("#toggletreeicon").mouseup(function(){
				var timer2=$timeout(function (){
					resizeWidth();
					$timeout.cancel(timer2);
				},20);
			});
			resizeWidth();
		}
	};
}).directive('summaryProgressBar',function($filter){
    //概要界面的进度条
    return {
        restrict:'E',
        templateUrl: 'html/template/input/summaryProgressBar.html',
        replace: true,
        scope:{
           rate:'='
        }
    };
})
.directive('timeSelect', function() {
	  return {
			restrict : 'EA',
			scope:{
				inputId:"@",
				inputReadonly:"@",
			},
			template: '<table id="{{inputId}}" ng-style="{\'pointer-events\':inputReadonly==\'true\'?\'none\':\'auto\'}" class="table-checking" editable="true" border="1" cellspacing="0" cellpadding="0" data-checked="">'
			+'<thead>'
			+'<tr>'
			+'<th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>'
			+'<th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th>'
			+'	<th>21</th><th>22</th><th>23</th>'
			+'</tr>'
			+'</thead>'
			+'<tbody>'
			+'<tr>'
			+'	<td id="0"></td><td id="1"></td><td id="2"></td><td id="3"></td><td id="4"></td><td id="5"></td><td id="6"></td>'
			+'	<td id="7"></td><td id="8"></td><td id="9"></td><td id="10"></td><td id="11"></td><td id="12"></td><td id="13"></td>'
			+'	<td id="14"></td><td id="15"></td><td id="16"></td><td id="17"></td><td id="18"></td><td id="19"></td><td id="20"></td>'
			+'	<td id="21"></td><td id="22"></td><td id="23"></td>'
			+'</tr>'
			+'</tbody>'
			+'</table>',
			link:function(scope, element, attrs, ngModel){
				$(element).find("td").bind({"mousedown":function(){
					$(this).toggleClass("td-checked");
					$(element).find("td").bind("mouseover",function(){
						$(this).toggleClass("td-checked");
					})
				},"mouseup":function(){
					$(element).find("td").unbind("mouseover");
					var checked =[];
					$(element).find("td.td-checked").each(function(){
						checked.push($(this).attr("id"));
					});
				}});
				$(element).find("tbody>tr").bind({"mouseout":function(){
			          var checked =[];
			          $(element).find("td.td-checked").each(function(){
			              checked.push($(this).attr("id"));
			          });
			    }});
			},
			replace: true
		};
	}).directive('vmwareCpu', function($timeout, $http) {
	    // vmware虚拟机cpu设备
	    return {
	        restrict:'A',
	        templateUrl: 'html/template/vmware/vmwareCpu.html',
	        replace: true,
	        scope:{
	            bindModel :'=',     // 绑定的虚拟机cpu实体，用于传参
	            form:'=',
	            guestId : '=',          //用于watch操作系统版本
	            hostKey:'@',
                clusterKey:'@',
                cloudId:'@'
	        },
	        link:function(scope,element,attrs){
	            // 控制提示小三角
	            scope.isCollapse = function() {
	                var ele = $('#cpuCollapse');
	                var spanEle = $('#cpuCollapseIcon');
	                ele.on('shown.bs.collapse', function () {
	                    spanEle.attr('class', 'icon expand-icon fa fa-caret-down');
	                    $timeout(function() {                       
	                        scope.shown = true;
	                    });
	                });
	                ele.on('hidden.bs.collapse', function () {
	                    spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
	                    $timeout(function() {                       
	                        scope.shown = false;
	                    });
	                });   
	            };
	            
	            //查询支持的cpu数量
	            scope.maxCpus = 0;
	            scope.maxSocket = 0;
	            scope.maxCoresPerSocket = 0;
                scope.getSupportedCpus = function() {
                    var param = '?clusterKey='+scope.clusterKey + '&guestId=' + scope.guestId;
                    if (scope.hostKey && scope.hostKey != 'undefined') {
                        param = '?clusterKey='+scope.clusterKey + '&hostKey=' + scope.hostKey + '&guestId=' + scope.guestId;
                    }                    
                    var querySupportedCpusUrl = 'vmware/vcenter/'+scope.cloudId+'/cpu/supported' + param;
                    $http.get(querySupportedCpusUrl).success(function(result){
                        $timeout(function() {
                            if (result.state == 0) {
                                scope.maxCpus = result.data;
                            }
                        });
                    });
                }
                scope.getSupportedCpus();
                
                //监控bindModel
                scope.$watch('bindModel.coresPerSocket', function(newValue, oldValue) {
                    if (scope.maxCpus == 0) {
                        return;
                    }
                    
                    $timeout(function() {
                        scope.maxSocket = scope.maxCpus;
                        scope.maxCoresPerSocket = Math.floor(scope.maxCpus / scope.bindModel.cpuSocket);
                        if (scope.maxCoresPerSocket == 0) {
                            scope.maxCoresPerSocket = 1;
                        }
                    });
                }, true);
                scope.$watch('bindModel.cpuSocket', function(newValue, oldValue) {
                    if (scope.maxCpus == 0) {
                        return;
                    }                    
                    $timeout(function() {
                        scope.maxSocket = Math.floor(scope.maxCpus / scope.bindModel.coresPerSocket);
                        scope.maxCoresPerSocket = scope.maxCpus;
                        if (scope.maxSocket == 0) {
                            scope.maxSocket = 1;
                        }
                    });
                }, true);
                
                //监控System版本变化
                scope.$watch('guestId', function(newValue, oldValue) {
                    if (newValue && (newValue != oldValue)) {
                        scope.getSupportedCpus();
                    }
                });
                //监控maxCpus变化
                scope.$watch('maxCpus', function(newValue, oldValue) {
                    if (newValue == 0 || newValue == oldValue) {
                        return;
                    }
                    
                    $timeout(function() {
                        checkMaxCpus();
                    });
                });
                //cpu最大值校验
                var checkMaxCpus = function() {
                    if (scope.bindModel.coresPerSocket > scope.maxCpus && scope.bindModel.cpuSocket > scope.maxCpus) {
                        scope.maxSocket = 1;
                        scope.maxCoresPerSocket = scope.maxCpus;
                    } else if (scope.bindModel.coresPerSocket > scope.maxCpus && scope.bindModel.cpuSocket <= scope.maxCpus) {
                        scope.maxSocket = scope.maxCpus;
                        scope.maxCoresPerSocket = Math.floor(scope.maxCpus / scope.bindModel.cpuSocket);
                    } else if (scope.bindModel.coresPerSocket <= scope.maxCpus && scope.bindModel.cpuSocket > scope.maxCpus) {
                        scope.maxSocket = Math.floor(scope.maxCpus / scope.bindModel.coresPerSocket);
                        scope.maxCoresPerSocket = scope.maxCpus
                    } else {
                        scope.maxSocket = Math.floor(scope.maxCpus / scope.bindModel.coresPerSocket);
                        scope.maxCoresPerSocket = scope.maxCpus
                    }
                    
                    if (scope.maxSocket == 0) {
                        scope.maxSocket = 1;
                    }
                    if (scope.maxCoresPerSocket == 0) {
                        scope.maxCoresPerSocket = 1;
                    }
                }
	        }
	    };
	}).directive('vmwareMemory', function($timeout) {
        // vmware虚拟机内存设备
        return {
            restrict:'A',
            templateUrl: 'html/template/vmware/vmwareMemory.html',
            replace: true,
            scope:{
                bindModel :'=',     // 绑定的虚拟机内存实体，用于传参
                form:'='
            },
            link:function(scope,element,attrs){
                //变换内存单位
                scope.$watch('bindModel.memoryUnit', function(newValue, oldValue) {
                    $timeout(function() {
                        if (newValue == 'GB' && oldValue =='MB') {
                            scope.bindModel.memory = 4;
                        } else if (newValue == 'MB' && oldValue =='GB') {
                            scope.bindModel.memory = 4096;
                        }
                    });        
                });
            }
        };
    }).directive('vmwareDisk', function($timeout, $modal) {
        // vmware虚拟机磁盘设备
        return {
            restrict:'A',
            templateUrl: 'html/template/vmware/vmwareDisk.html',
            replace: true,
            scope:{
                bindModel :'=',     // 绑定的虚拟机磁盘实体，用于传参
                index : '@',
                hostKey:'@',
                clusterKey:'@',
                cloudId:'@',
                form:'='
            },
            link:function(scope,element,attrs){
                // 控制提示小三角
                scope.isCollapse = function() {
                    var ele = $('#diskCollapse' + scope.index);
                    var spanEle = $('#diskCollapse' + scope.index + 'Icon');
                    ele.on('shown.bs.collapse', function () {
                        spanEle.attr('class', 'icon expand-icon fa fa-caret-down');
                    });
                    ele.on('hidden.bs.collapse', function () {
                        spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                    });   
                };
                scope.$watch('form.capacity' + scope.index, function(){
                    scope.capacityForm = scope.form['capacity' + scope.index];
                },true);
                scope.$watch('form.capacityMB' + scope.index, function(){
                    scope.capacityMBForm = scope.form['capacityMB' + scope.index];
                },true);
                
                scope.selectStoragePool = function() {
                    //主机下增加
                    if (scope.hostKey && scope.hostKey != 'undefined') {
                        scope.queryStorageUrl = 'vmware/'+scope.cloudId+'/storageList?type=3&key='+scope.hostKey;
                    } else {//集群下增加
                        scope.queryStorageUrl = 'vmware/'+scope.cloudId+'/storageList?type=2&key='+scope.clusterKey; 
                    }
                    //选择存储
                    var modalInstance = $modal.open({
                        templateUrl:'html/modal/vmware/vmwareStorageSelector.html',
                        backdrop:"static",
                        controller:"SelectVmwareStorageListCtrl",
                        width:"540px",
                        resolve: {
                            url: function(){return scope.queryStorageUrl;},
                            type: function(){ return "selectStoragepool";}
                        }
                    });
                    modalInstance.result.then(function(selectItem){
                        scope.bindModel.selectPool.name = selectItem.name;
                        scope.bindModel.selectPool.morValue = selectItem.morValue;
                        //磁盘最大可用空间检查
                        scope.bindModel.selectPool.available = selectItem.available;
                        if (scope.bindModel.diskUnit == 'GB') {
                            scope.bindModel.diskMax = (selectItem.available / 1073741824).toFixed(2);
                        } else if (scope.bindModel.diskUni == 'MB') {
                            scope.bindModel.diskMax = (selectItem.available / 1048576).toFixed(0);
                        }
                    },function(reason){

                    });
                };
                
                scope.bindModel.diskModel = '0';//置备方式-精简置备
                //变换磁盘单位
                scope.bindModel.diskMax = 1048576;
                scope.$watch('bindModel.diskUnit', function(newValue, oldValue) {
                    $timeout(function() {
                        if (newValue == 'GB' && oldValue =='MB') {
                            scope.bindModel.diskSize = 40;
                            scope.bindModel.diskMax = 1048576;
                            if (scope.bindModel.selectPool.available) {
                                scope.bindModel.diskMax = (scope.bindModel.selectPool.available / 1073741824).toFixed(2);
                            }
                        } else if (newValue == 'MB' && oldValue =='GB') {
                            scope.bindModel.diskSize = 40960;
                            scope.bindModel.diskMax = 1073741824;
                            if (scope.bindModel.selectPool.available) {
                                scope.bindModel.diskMax = (scope.bindModel.selectPool.available / 1048576).toFixed(0);
                            }
                        }
                    });        
                });
            }
        };
    }).directive('vmwareNetwork', function($timeout, $http, $translate, UtilService) {
        // vmware虚拟机网络设备
        return {
            restrict:'A',
            templateUrl: 'html/template/vmware/vmwareNetwork.html',
            replace: true,
            scope:{
                bindModel :'=',     // 绑定的虚拟机磁盘实体，用于传参
                index : '@',
                hostKey:'@',
                clusterKey:'@',
                cloudId:'@',
                deleteIcon : '@',       // 是否显示删除图标
                guestId : '=',          //用于watch操作系统版本
                form:'='
            },
            link:function(scope,element,attrs){
                //网络适配器
                scope.adapters = [];
                scope.networks = [];//网络选择列表 
                //主机下增加
                if (scope.hostKey && scope.hostKey != 'undefined') {
                    scope.queryNetworkUrl = 'vmware/'+scope.cloudId+'/networks?type=3&key='+scope.hostKey;
                } else {//集群下增加
                    scope.queryNetworkUrl = 'vmware/'+scope.cloudId+'/networks?type=2&key='+scope.clusterKey; 
                }
                //监控System版本变化
                scope.$watch('guestId', function(newValue, oldValue) {
                    if (newValue && (newValue != oldValue)) {
                        scope.getSupportedAdapter();
                    }
                });
                
                //查询支持的网卡适配器
                scope.getSupportedAdapter = function() {
                    var param = '?clusterKey='+scope.clusterKey + '&guestId=' + scope.guestId;
                    if (scope.hostKey && scope.hostKey != 'undefined') {
                        param = '?clusterKey='+scope.clusterKey + '&hostKey=' + scope.hostKey + '&guestId=' + scope.guestId;
                    }                    
                    var querySupportedAdapterUrl = 'vmware/vcenter/'+scope.cloudId+'/ethernetCard/supported' + param;
                    $http.get(querySupportedAdapterUrl).success(function(result){
                        $timeout(function() {
                            if (result.state == 0) {
                                scope.adapters.splice(0, scope.adapters.length);
                                var supportedArr = result.data;
                                if (supportedArr.length > 0) {
                                    for (var i = 0; i < supportedArr.length; i++) {
                                        var item = {};
                                        item.value = supportedArr[i];
                                        item.label = $translate.instant('vmware.' + supportedArr[i]);
                                        scope.adapters.push(item);
                                    }
                                }
                            } else {
                                scope.adapters.splice(0, scope.adapters.length);
                                scope.adapters.push({value:'VirtualE1000', label:$translate.instant('vmware.VirtualE1000')});
                            }
                        });
                    });
                }
                scope.getSupportedAdapter();
                
                //查询可用网络
                $http.get(scope.queryNetworkUrl).success(function(result){
                    if (result.state == 0) {
                        $timeout(function() {
                            var netList = result.data;
                            if (netList.length > 0) {
                                scope.bindModel.deviceName = netList[0];
                                for (var netIndex = 0; netIndex < netList.length; netIndex++) {
                                    var net = {value:netList[netIndex], label:netList[netIndex]};
                                    scope.networks.push(net);
                                }
                            }
                        });
                    }
                });
                
                // 控制提示小三角
                scope.isCollapse = function() {
                    var ele = $('#networkCollapse' + scope.index);
                    var spanEle = $('#networkCollapse' + scope.index + 'Icon');
                    ele.on('shown.bs.collapse', function () {
                        spanEle.attr('class', 'icon expand-icon fa fa-caret-down');
                    });
                    ele.on('hidden.bs.collapse', function () {
                        spanEle.attr('class', 'icon expand-icon fa fa-caret-right');
                    });   
                };
                // 删除网卡
                scope.deletNetwork = function() {  
                    // 提示是否删除
                    var hardware = {name: $translate.instant('addDomain.network') + scope.index};
                    var modalInstance = UtilService.confirm($translate.instant('addDomain.deleteHarawareConfirm', hardware), $translate.instant('operConfirm'));
                    modalInstance.result.then(function (selectedItem) {
                        scope.bindModel = undefined;    // 删除网卡实体数据
                        scope.$parent.pageData.netcards[scope.index] = {}; //delete data from net work array
                        element.remove();               // 删除dom节点
                        scope.$destroy();               // 销毁scope，一是节省资源，二是表单验证需要。
                    }, function () {
                    });
                };
            }
        };
	}).directive('localeIsEn',function(){
		   	 return {
				    restrict: 'EA',
				    compile: function(element, attrs) {
				    	if (localeIsEn) {
				    		var title = $(element.find('span')[1]).attr('translate');
				    		$(element.find('div')).attr('custom-title', "{{'"+ title + "'| translate}}");
				    		$(element).find('.status-name').remove();
				    	}
					},
				    replace: true
				  };
	})
.directive('jesDate', function() {
  return {
		restrict : 'EA',
		require: 'ngModel',
		scope:{
			dateCell: '@', //目标元素，允许传入class, tag这种方式'#id, .class'
			format: '@',  //日期格式
			maxDate: '=', //最大时间
			minDate: '=', //最小时间
			isinitVal: '@', //是否初始化时间，默认为不初始化时间，false
			initialDate :'=',//初始化时间，必须配合isinitVal且isinitVal为true才有作用,若该值为空，则当前系统时间,允许输入类型Date,String
			initAddVal:'@', //初始化时间，加减天，时，分，必须配合isinitVal且isinitVal为true才有作用，默认为[0]，也可写成[0,"DD"]
			isTime: '@', //是否开启时间选择，默认为fasle
			ishmsVal: '@',//是否限制十分秒输入框输入，默认可以直接输入,默认true
			isToday: '@', //是否显示今天或本月，默认为true
			isClear:'@', //是否显示清空，默认为true
			pickerPosition:'@', //时间控件弹出位置参数,默认butom,可选top,left,right,butom
			chooseCallBack:'=', //选中日期后的回调函数
			okCallBack:'=' //点击确认后的回调函数
		},
		link : function(scope, element, attrs, ngModel) {
			var maxDate = minDate = null, initialDate;
			if (angular.isUndefined(scope.format)) {
				scope.format = "YYYY-MM-DD";
			}
			if (angular.isUndefined(scope.isToday)) {
				scope.isToday = true;
			} else if (scope.isToday.toString() == "true") {
				scope.isToday = true;
			} else {
				scope.isToday = false;
			}
			if (angular.isUndefined(scope.isinitVal)) {
				scope.isinitVal = false;
			} else if (scope.isinitVal.toString() == "true") {
				scope.isinitVal = true;
			} else {
				scope.isinitVal = false;
			}
			if (angular.isUndefined(scope.isTime)) {
				scope.isTime = false;
			} else if (scope.isTime.toString() == "true") {
				scope.isTime = true;
			} else {
				scope.isTime = false;
			}
			if (angular.isUndefined(scope.ishmsVal)) {
				scope.ishmsVal = true;
			} else if (scope.ishmsVal.toString() == "true") {
				scope.ishmsVal = true;
			} else {
				scope.ishmsVal = false;
			}
			if (angular.isUndefined(scope.isClear)) {
				scope.isClear = true;
			} else if (scope.isClear.toString() == "true") {
				scope.isClear = true;
			} else {
				scope.isClear = false;
			}
			var layout = scope.format.replace(/YYYY/, "yyyy").replace(/DD/, "dd").replace(/hh/, "HH");
			if (scope.maxDate instanceof Date) {
				maxDate = scope.maxDate.Format(layout);
			} else {
				maxDate = scope.maxDate;
			}
			if (scope.minDate instanceof Date) {
				minDate = scope.minDate.Format(layout);
			} else {
				minDate = scope.minDate;
			}
			if (angular.isDefined(scope.initialDate)) {
				initialDate = scope.initialDate;
			}
			if (angular.isUndefined(scope.pickerPosition)) {
                scope.pickerPosition = 'bottom';
            }
			
			var options = {
				dateCell : scope.dateCell,
				format : scope.format,
				maxDate: maxDate,
				minDate: minDate,
				isinitVal : scope.isinitVal,
				initialDate : initialDate,
				initAddVal : scope.initAddVal,
				isTime: scope.isTime,
				ishmsVal : scope.ishmsVal,
				isToday : scope.isToday,
				isClear :scope.isClear,
				clearRestore : false,
				pickerPosition: scope.pickerPosition,
				choosefun : function(elem, val) {
					if (angular.isDefined(ngModel)) {
						ngModel.$setViewValue(val);
					}
					if (angular.isDefined(scope.chooseCallBack) && angular.isFunction(scope.chooseCallBack)) {
						scope.chooseCallBack.apply();
					}
				},
				okfun : function(elem, val) {
					if (angular.isDefined(ngModel)) {
						ngModel.$setViewValue(val);
					}
					if (angular.isDefined(scope.okCallBack) && angular.isFunction(scope.okCallBack)) {
						scope.okCallBack.apply();
					}
				},
				clearfun : function(elem, val){
					if (angular.isDefined(ngModel)) {
						ngModel.$setViewValue("");
					}
				}
			};
			element.ready(function(){
				jeDate(options);
			});
			
			scope.$watch("maxDate", function(newValue, oldValue){
				if(angular.isDefined(scope.maxDate) && newValue != "Invalid Date"){
					if (newValue instanceof Date) {
						options.maxDate = newValue.Format(layout);
					} else {
						options.maxDate = newValue;
					}
				} else {
					options.maxDate = undefined;
				}
				
			}, true);
			scope.$watch("minDate", function(newValue, oldValue){
				if(angular.isDefined(scope.minDate) && newValue != "Invalid Date"){
					if (newValue instanceof Date) {
						options.minDate = newValue.Format(layout);
					} else {
						options.minDate = newValue;
					}
				} else {
					options.minDate = undefined;
				}
				
			}, true);
			
			scope.$watch("format", function(newValue, oldValue){
				if(newValue != oldValue){
					options.format = scope.format;
				}
			}, true);
			
			scope.$watch("isTime", function(newValue, oldValue){
				if(newValue != oldValue){
					if (scope.isTime.toString() == "true") {
						options.isTime = true;
					} else {
						options.isTime = false;
					}
					
				}
			}, true);
		}
	
	};
})
.directive('selectSvg',function($http, $timeout, $filter, $translate, UtilService) {
    return {
        restrict:'A',
        templateUrl: 'html/template/input/selectSvg.html',
        replace: false,
        scope:{
        	id: '@',
            srcSvgId: '=',			 //已选择单元id
            selectedSvg:'=',         //选中的单元，传入值必须时对象的一个属性，否则值无法获取
            svgUrl:'@',				 //获取数据的url
            svgSrc:'@',				 //图标SVG的路径
            infoOneDesc:'@',		 //中间行显示的信息描述 国际化
            infoOneValue:'@',		 //中间行显示的信息值 后台返回的单元对象的属性
            infoOneFilter:'@',		 //中间行显示的信息值过滤器
            infoTwoDesc:'@',		 //下行显示的信息描述 国际化
            infoTwoValue:'@',		 //下行显示的信息值 后台返回的单元对象的属性
            infoTwoFilter:'@'		 //下行显示的信息值过滤器
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.svgList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
                    scope.selectedSvg = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            scope.ok = function() {
                scope.$emit('selectSvg');
            }
            scope.isSelected = function(id) {
                if (scope.srcSvgId == id) {
                    return true;
                }
                return false;
            }
            //加载数据
            scope.load = function() {
                var areawaitId = UtilService.areawait(scope.id);
                var params = {};
                $http({
                    method  : 'GET',
                    url     : scope.svgUrl,
                    params  : params}).
                    success(function(result) {
                    	if(result != null && typeof result != 'undefined'){
                    		UtilService.dismissAreawait(areawaitId);
                    		if (result.state == 0 && result.data != null && typeof result.data != 'undefined') {
                    			$timeout(function() {
                    				scope.svgList = result.data;
                    				for (var i = 0; i < scope.svgList.length; i++) {
                    					if (scope.infoOneDesc != null && scope.infoOneDesc != '') {
                    						scope.svgList[i].infoOneDesc = $translate.instant(scope.infoOneDesc);
                    					}
                    					if (scope.infoOneFilter != null && scope.infoOneFilter != '') {
                    						scope.svgList[i].infoOneFilterValue = $filter(scope.infoOneFilter)(scope.svgList[i][scope.infoOneValue]);
                    					}
                    					if (scope.infoTwoDesc != null && scope.infoTwoDesc != '') {
                    						scope.svgList[i].infoTwoDesc = $translate.instant(scope.infoTwoDesc);
                    					}
                    					if (scope.infoTwoFilter != null && scope.infoTwoFilter != '') {
                    						scope.svgList[i].infoTwoFilterValue = $filter(scope.infoTwoFilter)(scope.svgList[i][scope.infoTwoValue]);
                    					}
                    					if (scope.svgList[i].id == scope.srcSvgId) {
                    						scope.selectedSvg = scope.svgList[i];
                    					}
                    				}
                    			});
                    		}
                    		UtilService.handleResult(result);
                    	}
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.load();
            });
        }
    };
})
.directive('cicOrg',function($http, $timeout, UtilService){
	return {
        restrict:'A',
        templateUrl: 'html/template/input/cicOrg.html',
        replace: false,
        scope:{
            id:'@',             //div的id
            srcOrgId: '=',
            selectedOrg:'='      //选中的存储池，传入值必须时对象的一个属性，否则值无法获取
        },
        link:function(scope, element, attrs, ctrl) {
            $(element).bind('contextmenu', function(e) {
                e.preventDefault(); //prevent Default meue show
            });
            scope.orgList = [];
            scope.selectModel = {};
            scope.$watch('selectModel.model', function(newValue, oldValue) {
                $timeout(function() {
                    scope.selectedOrg = angular.fromJson(newValue);//将字符串转成json对象
                });                
            }, true);
            
            /*//刷新数据
            scope.$on('onQueryStorageclusterList', function(event, msg) {
                scope.load();
            });*/
            scope.ok = function() {
                scope.$emit('selectOrg');
            }
            scope.isSelected = function(id) {
                if (scope.srcClusterId == id) {
                    return true;
                }
                return false;
            }
            //加载数据
            scope.load = function() {
                var areawaitId = UtilService.areawait(scope.id);
                var params = {};
                $http({
                    method  : 'GET',
                    url     : 'org/list',
                    params: params}).
                    success(function(result) {
                        UtilService.dismissAreawait(areawaitId);
                        if (result.state == 0) {
                            $timeout(function() {
                                scope.orgList = result.data;
                               /* for (var i = 0; i < scope.clusterList.length; i++) {
                                    if (scope.clusterList[i].id == scope.srcClusterId) {
                                        scope.selectPool = scope.clusterList[i];
                                        break;
                                    }
                                }*/
                            });                            
                        }
                        UtilService.handleResult(result);
                    }).error(function(data, code, headers, cfg) {
                        UtilService.dismissAreawait(areawaitId);
                        UtilService.handleError(code);
                    });
            };
            
            //指令加载完成后加载数据
            element.ready(function() {
                scope.load();
            });
        }
    };
}).directive('checkpluginname',function(){ // 只允许输入字母、数字。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^[a-zA-Z0-9]+$/;;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var validity = namereg.test(value);
					ngModel.$setValidity("checkpluginname", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
}).directive('checkplugintitle',function(){ // 只允许输入中英文字母、数字。
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel) {
			if (ngModel) {
				var namereg = /^[a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D]+$/;;
			}
			var customValidator = function (value) {
				var validity = ngModel.$isEmpty(value);
				if (!validity) {
					var validity = namereg.test(value);
					ngModel.$setValidity("checkplugintitle", validity);		
				}
				
				return validity ? value : undefined;
			}
			ngModel.$formatters.push(customValidator);
			ngModel.$parsers.push(customValidator);
		}
	}
})
;