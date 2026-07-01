 
/**
 * 云主机列表
 */
 var contextRowData = null;
    var rowSelect = null;
    /**打开VNC控制台**/
    
    String.prototype.endWith=function(s){ 
    	if(s==null||s==""||this.length==0||s.length>this.length) 
    		return false; 
    	if(this.substring(this.length-s.length)==s) 
    		return true; 
    	else 
    		return false; 
    	return true; 
    }; 
    String.prototype.startWith=function(s){ 
    	if(s==null||s==""||this.length==0||s.length>this.length) 
    		return false; 
    	if(this.substr(0,s.length)==s) 
    		return true; 
    	else 
    		return false; 
    	return true; 
    };
    function isHtml5() {
     	 var Sys = {};
         var ua = navigator.userAgent.toLowerCase();
         ua.match(/msie ([\d.]+)/) ? Sys.ie = ua.match(/msie ([\d.]+)/)[1] :
         ua.match(/firefox\/([\d.]+)/) ? Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1] :
         ua.match(/chrome\/([\d.]+)/) ? Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1] : 0;
         //以下进行测试
         var browserFlag = true;
         if(Sys.ie && (Sys.ie.startWith('7.') || Sys.ie.startWith('8.'))){
             browserFlag = false;
         }
         if(Sys.firefox && (Sys.firefox.startWith('4.') || Sys.firefox.startWith('5.'))) {
             browserFlag = false;
         }
         if(Sys.chrome && (Sys.chrome.startWith('4.') || Sys.chrome.startWith('5.') 
              || Sys.chrome.startWith('6.')  || Sys.chrome.startWith('7.') 
              || Sys.chrome.startWith('8.') || Sys.chrome.startWith('9.') 
              || Sys.chrome.startWith('10.') || Sys.chrome.startWith('11.') 
              || Sys.chrome.startWith('12.') || Sys.chrome.startWith('13.'))) {
                 browserFlag = false;
         }
     	
     	 var canvasFlag;
 		 try {
 			document.createElement('canvas').getContext('2d');
 			canvasFlag = true;
 		 } catch (e) {
 			canvasFlag = false;
 		 }
 		
 		return window.WebSocket && browserFlag && canvasFlag;
    }
    
    function openConsole(type) {
    	var row = null;
    	if (typeof type == "undefined") {
        	   row = $("#my-instances").datagrid("getSelected");
            } else {
               row = contextRowData;
        }
    	if (row){ 
    		var title = row.title;
    		if (typeof title == 'undefined' || '' == title || title == null) {
    			title = row.name;
    		}
    		
    		var isHtml5Flag = isHtml5();
    		var way;
    		if (isHtml5Flag) {
    			way = "getNoVncParam";
    		} else {
    			way = "getVncParam";
    		}
    	
    		//先检查用户是否拥有该云主机权限
    		$.ajax({
    			type : "POST",
    			dataType : "json",
    			url : "servlet/vmList?way=checkVmBelongUser",
    			data : "vmId=" + row.id ,
    			success : function(result) {
    				if (result != null && typeof result != 'undefined') {
    					if (result.success) {
    						$.ajax({
					 		   type: "POST",
					 		   dataType:"json",
					 		   url: "servlet/vmList?way=" + way,
					 		   data:"id="+row.id+"&name="+title,
					 		   success: function(result){
					 			  if (result != null && typeof result != 'undefined') {
						    		var domainId = row.id;
						    		var uniqueKey = result.uniqueKey;
						    		var title = row.title;
						    		var domainName = row.name;
						    		var userName = result.userName;
						    		var password = result.password;
						    		var protocol = result.protocol;
						    		var hostIp = result.casIp;
						    		var hostPort = result.casPort;
					 		        /*var winName = new Date().getTime();*/
					 		        /* var $win = window.open('about:blank',winName,'resizable=yes,scrollbars=yes,titlebar=no,toolbar=no,menubar=no, location=no, status=no'); */
					 		        if (isHtml5Flag) {
						    			var status = result.status;
										var noVNCIp = result.noVncHost;
										var noVNCPort = result.noVNCPort;
										var token = result.token;
										var localCursor = result.localCursor;
										openNoVNCDialog(domainId, uniqueKey, title, userName, password, hostIp, hostPort, protocol, noVNCIp, noVNCPort, token, status, localCursor);
						    		} else {
						    			openVNCDialog(uniqueKey, title, userName, password, protocol, hostIp, hostPort);	
						    		}
					 			  }
					 		   }
					      });
    					} else {
    						$("#my-instances").datagrid('reload');
    						$.messager.alert(result.title, result.message, 'error');
    					}
    				}
    			}
    		});
    	} 	
    }
    
    
    function openVNCDialog(domainId, title, userName, password, protocol, hostIp, hostPort) {
	    var $doc = document;
    	var turnForm = $doc.createElement("form");  
    	$doc.body.appendChild(turnForm);
    	turnForm.name = "vnc";
    	turnForm.method = "post";
//    	turnForm.action = "vnc_applet.jsp";
    	var explorer =navigator.userAgent;
    	var isEdge = false;
		if (explorer != null && explorer != 'undefined' && explorer.indexOf("Edge") >= 0) {
			isEdge = true;
		}
		var javaEnabled = navigator.javaEnabled() && !isEdge;
    	if (javaEnabled) {	    		
    		turnForm.action = "vnc_applet.jsp";
    		turnForm.target = "_blank";
    	} else {
    		turnForm.action = "vnc_jnlp.jsp";
    		turnForm.target = "_self";
    	}
 	    var element = $doc.createElement("input");
 	    element.setAttribute("name", "domainId");
 	    element.setAttribute("type", "hidden");
 	    element.setAttribute("value", domainId);
 	    turnForm.appendChild(element);
    
    	if (title != null) {
    		title = encodeURI(title);
    	} else {
      	title = encodeURI(domainName);
    	}
    	element = $doc.createElement("input");
    	element.setAttribute("name", "title");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", title);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "userName");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", userName);
    	turnForm.appendChild(element);
    
    	element = $doc.createElement("input");
    	element.setAttribute("name", "password");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", password);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "protocol");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", protocol);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "hostIp");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", hostIp);
    	turnForm.appendChild(element);
    	if (hostPort != null) {
	    	element = $doc.createElement("input");
	    	element.setAttribute("name", "hostPort");
	    	element.setAttribute("type", "hidden");
	    	element.setAttribute("value", hostPort);
	    	turnForm.appendChild(element);
    	}
    	turnForm.submit();  
    }

    function openNoVNCDialog(domainId, uniqueKey, title, userName, password, hostIp, hostPort, protocol, proxyIp, proxyPort, token, status, localCursor) {
        var $doc = document;
    	var turnForm = $doc.createElement("form");  
    	$doc.body.appendChild(turnForm);
    	turnForm.name = "vnc";
    	turnForm.method = "post";
    	turnForm.action = "/ssv/vnc/vnc.jsp";
    	turnForm.target = "_blank";
    	
    	var element = $doc.createElement("input");
    	element.setAttribute("name", "domainId");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", domainId);
    	turnForm.appendChild(element);
    	
    	var element = $doc.createElement("input");
    	element.setAttribute("name", "uniqueKey");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", uniqueKey);
    	turnForm.appendChild(element);
    	
    	if (title != null) {
    		title = encodeURI(title);
    	} else {
      	title = encodeURI(domainName);
    	}
    	element = $doc.createElement("input");
    	element.setAttribute("name", "title");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", title);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "userName");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", userName);
    	turnForm.appendChild(element);

    	element = $doc.createElement("input");
    	element.setAttribute("name", "password");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", password);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "casIp");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", hostIp);
    	turnForm.appendChild(element);
    	
        element = $doc.createElement("input");
        element.setAttribute("name", "protocol");
        element.setAttribute("type", "hidden");
        element.setAttribute("value", protocol);
        turnForm.appendChild(element);
        
        element = $doc.createElement("input");
        element.setAttribute("name", "casPort");
        element.setAttribute("type", "hidden");
        element.setAttribute("value", hostPort);
        turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "token");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", token);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "status");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", status);
    	turnForm.appendChild(element);
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "host");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", proxyIp);
    	turnForm.appendChild(element);
    	
    	if (proxyPort != null) {
        	element = $doc.createElement("input");
        	element.setAttribute("name", "port");
        	element.setAttribute("type", "hidden");
        	element.setAttribute("value", proxyPort);
        	turnForm.appendChild(element);
    	}
    	
    	element = $doc.createElement("input");
    	element.setAttribute("name", "localCursor");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", localCursor);
    	turnForm.appendChild(element);
    	
    	turnForm.submit();  
    }
   
    //打开申请虚拟机窗口
    function openApplyVm() {
    	$("#windowOverId").load("page/widget/applyVm.jsp",function(){
    		//获得云主机显示名称前缀
			$.ajax({
				type : "GET",
				dataType : "json",
				url : "servlet/workFlowServlet?way=queryPreName",
				success:function(result){
					$('#hasPreName').val(result.message);
					$('#preName').val(result.domainPreName);
					$('#enableAdjustSetting').val(result.enableAdjustSetting);
				}
			});
		    $("#modal-close").bind("click",close);
		    $("#windowOverId").css("display", "inline-block");
			$(".step-action .btn-next").bind("click",nextStep);
			$(".step-action .btn-prev").bind("click",prevStep);
			$(".tab-item").bind("click",changeTemplate);
			$("#table-template").datagrid(templatePreData);
			$(".types-item-memory").bind("click",changeMemory);
			$(".types-item-cpu").bind("click",changeCpu);
			//$(".types-item").bind("click",changeTypeItem);
			$(".types-item-storage").bind("click",changeStorage);
			$("#titleId").bind("keyup",checkTitle);
			$("#titleId").bind("keyup",checkPreName);
			$("#domainNameId").bind("keyup",checkVcenterDomainName);
			$("#domainNameId").bind("keyup",checkDomainReName);
			$("#domainNameId").bind("keyup",checkVcenterPreName);
			$("#applyReasonId").bind("keyup",checkReason);
			$("#descId").bind("keyup",checkDescription);
			$("#ipId, #maskId, #gatewayId, #firstDnsId, #secondDnsId").bind("keyup",checkIpFormat);
			$("#maskId").bind("focus",addDefaultMask);
			$("#secondDnsId").bind("blur",contrastFirst);
			$("#loginName").bind("keyup",checkLoginAccount);
			$("#loginPwd").bind("keyup",checkLoginPassword);
			$("#confirmPassword").bind("keyup",checkConfirmPassword);
			$("#loginPwd").bind("blur",checkPasswordSame);
			$("#confirmPassword").bind("blur",checkPasswordSame);
     	});
    }
    
    function progressFormatter(value,rowData,rowIndex){
    	value = '' + value + '';
    	if (value.length > 4) {
    		value = value.substring(0,4);
    	}
        var htmlstr =  '<div class="easyui-progressbar progressbar"  data-options="value:' + value + '" style="width:100%;height: 20px;">'
        	+'<div class="progressbar-text" style="width:100%; height: 20px; line-height: 20px; background-color:#EBEBEB;color:#666666;"></div>';
        if(value>80){
            //红色
        	htmlstr+='<div class="progressbar-value" style="width: ' + value + '%; height: 20px; line-height: 20px;background-color:#FF3636;position: absolute;z-index:2;"></div>';
        	htmlstr+='<div style="width:100%;color:#fff;position: absolute;z-index:3;text-align:center;">' + value + '%</div>';
//        	htmlstr+='<div class="progressbar-text" style="background-color:#FF3636; width: ' + value + '%; height: 20px; line-height: 20px;"></div>';
        } else if(value>50){
        	//黄色
        	htmlstr+='<div class="progressbar-value" style="width: ' + value + '%; height: 20px; line-height: 20px;background-color:#FFAC2A;position: absolute;z-index:2;"></div>';
            htmlstr+='<div style="width:100%;color:#fff;position: absolute;z-index:3;text-align:center;">' + value + '%</div>'; 
        	//        	htmlstr+='<div class="progressbar-text" style="background-color:#FFAC2A; width: ' + value + '%; height: 20px; line-height: 20px;"></div>';
        } else{
        	//蓝色
        	htmlstr+='<div class="progressbar-value" style="width: ' + value + '%; height: 20px; line-height: 20px;background-color:#88CC67;position: absolute;z-index:2;"></div>';
            htmlstr+='<div style="width:100%;color:#666666;position: absolute;z-index:3;text-align:center;">' + value + '%</div>';
        	//        	htmlstr+='<div class="progressbar-text" style="background-color:#88CC67; width: ' + value + '%; height: 20px; line-height: 20px;"></div>';
        }
        htmlstr+='</div>';  
        return htmlstr;  
    }  
    function addUl(a){
    	$(a).css("text-decoration", "underline").css("color","#3397D3");
    }
    function removeUl(a){
    	$(a).css("text-decoration", "underline").css("color","#000000");
    }
    function showVmName(value,rowData,rowIndex){
    	if (typeof value == "undefined") {
    		value = '  ';
    	}
    	if (typeof value != 'undefined') {
    		var tempValue = value;
 		 	if (navigator.userAgent.indexOf("Firefox")>0) {
 		 	    value = toBreakWord(value, 20);
 		 	} 
 		 	var a = "<div class='itemtooltip' style='nowrap:false;word-break:break-all '>"+tempValue+
 		 	"<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
 		    + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
 		 	" </div></div>";
 		 	if (typeof rowData != "undefined" && rowData != null && rowData.status == 1) {
 		 		return '<div style="font-size: 14px">' + a + '</div>';
 		 	}
 		 	
 		 	return '<a style="display:inline;color:#3397D3;font-size: 14px;text-decoration:underline" onclick="getDetail('+rowIndex+')" onmouseover="addUl(this)" onmouseout="removeUl(this)">'+a+'</a>';
    	}
    }
    
    function showName(value,rowData,rowIndex){
    	if (typeof value == "undefined") {
    		value = '  ';
    	}
    	if (typeof value != 'undefined') {
    		var tempValue = value;
    		//修改问题单：201707170350，firefox低于15.0版本显示有问题做个兼容
    	    if (firefoxBlowFifteen()) {
 		 	    value = toBreakWord(value, 20);
    		}
 		 	return "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+'<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="getDetail('+rowIndex+')"><span>'+ tempValue +'</span></a>'
                +"<div class='tooltip_description' style='display:none;word-break:break-all '>"
                 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
 		 	" </div></div>";
    	}
    }
    
    function showState(value,rowData,rowIndex) {
    	if (value == 2) {
	           return '<img width="17px" height="17px" src=icons/default/homestart.png>';
	        } else if (value == 3) {
	           return '<img width="17px" height="17px" src=icons/default/homeclose.png>';
	        } else if (value == 4) {
	           return '<img width="17px" height="17px" src=icons/default/homepause.png>';
	        } else {
	           return '<img width="17px" height="17px" src=icons/default/homequestion.png>';
	        }
    }
    
    function showMemory(value,rowData,rowIndex) {
    	if (typeof value == "undefined") {
    		value = 0;
    	}
    	 if (value >= 1048576) {
	           var m = value/1048576;
	           return m.toFixed(2) + 'TB';
	        } else if (value >= 1024) {
	           return (value/1024).toFixed(2) + 'GB';
	        } else {
	           return value.toFixed(2) + 'MB';
	        }
    }
    
    function showDisk(value,rowData,rowIndex) {
    	if (typeof value == "undefined") {
    		value = 0;
    	}
    	if (value >= 1048576) {
	           var m = value/1048576;
	           return m.toFixed(2) + 'TB';
	        } else if (value >= 1024) {
	           return (value/1024).toFixed(2) + 'GB';
	        } else {
	           return value + 'MB';
	        }
    }
    //打开虚拟机快照窗口
    function snapshot(type) {
    	var row = null;
    	if (typeof type == "undefined") {
        	   row = $("#my-instances").datagrid("getSelected");
            } else {
               row = contextRowData;
        }
    	if (row) {
    		//先检查用户是否拥有该云主机权限
    		$.ajax({
    			type : "POST",
    			dataType : "json",
    			url : "servlet/vmList?way=checkVmBelongUser",
    			data : "vmId=" + row.id ,
    			success : function(result) {
    				if (result != null && typeof result != 'undefined') {
    					if (result.success) {
    						$("#windowOverId").load("page/widget/snapshotTree.jsp",function(){
				    			$("#modal-close").bind("click",close);
				    			var overlay=$(".window-overlay");
				    			overlay.css("display", "inline-block");
				    			var row = $("#my-instances").datagrid("getSelected");
				    			var random = Math.random();
				    			if (row){ 
				    				$("#tt").tree({
				    					method:'POST',
				    					onClick:function(node){
				    						var nodeAttr = node.attributes;
				    						var attr1 = nodeAttr[0].attr1;
				    						if (typeof attr1 == "undefined") {
				    							$("#descSpan").text("");
				    						} else {
				    						     $(".descTooltip").html(snapBuildToolTip(attr1,$(this)));
											     $(".details-tab").css("height",$(".description").css("height"));
											     $(".description").css("height",$(".details-tab").css("height"));
											     $("div.itemtooltip").jtooltip();
				    						}
				    						
				    					},
				    					url:"servlet/vmList?way=snapshotList&id="+row.id +"&random=" + random
				    				});
				    			}
				    		});
    					} else {
    						$("#my-instances").datagrid('reload');
    						$.messager.alert(result.title, result.message, 'error');
    					}
    				}
    			}
    		});
    	}
    }
    
    function snapBuildToolTip(srcValue,obj){
    	var tempValue = srcValue;
    	var value = srcValue;
    		if (navigator.userAgent.indexOf("Firefox")>0) {
    		 	value = toBreakWord(srcValue, 20);
    		 	tempValue = toAddEllipsis(srcValue, obj.attr("data-ellipsis-len"));
    		} 
    		
    		return "<div class='itemtooltip' style='white-space:nowrap; overflow:hidden;text-overflow:ellipsis;'>"+tempValue+
    	 	 "<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
    	 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
    	 	 " </div></div>";
    	}
  //打开虚拟机备份窗口
    function backup(type) {
    	var row = null;
    	if (typeof type == "undefined") {
        	   row = $("#my-instances").datagrid("getSelected");
            } else {
               row = contextRowData;
        }
    	if (row) {
    		//先检查
    		$.ajax({
    			type : "POST",
    			dataType : "json",
    			url : "servlet/vmList?way=checkBackup",
    			data : "vmId=" + row.id ,
    			success : function(result) {
    				if (result != null && typeof result != 'undefined') {
    					if (result.success) {
    						$("#modal-close").bind("click",close);
    						var overlay=$(".window-overlay");
    						overlay.css("display", "inline-block");
    						var title = row.title;
    			    		if (typeof title == 'undefined' || '' == title || title == null) {
    			    			title = row.name;
    			    		}
    			    		$("#windowOverId").load("page/widget/addBackup.jsp",function(){
    			    			$("#vmIdhidden").val(row.id);
    			    			$("#vmNamehidden").val(title);
    			    		});
    					} else {
    						$("#my-instances").datagrid('reload');
    						$.messager.alert(result.title, result.message, 'error');
    					}
    				}
    			}
    		});
    		
    	}
    }
    //打开延期虚拟机日期的窗口
    function applyExpire(type) {
    	//先检查是否满足延期条件
    	var row = null;
    	if (typeof type == "undefined") {
    		row = $("#my-instances").datagrid("getSelected");
    	} else {
    		row = contextRowData;
    	}
    	if (row) {
    		//先检查
    		$.ajax({
    			type : "POST",
    			dataType : "json",
    			url : "servlet/vmList?way=checkDelay",
    			data : "vmId=" + row.id ,
    			success : function(result) {
    				if (result != null && typeof result != 'undefined') {
    					if (result.success) {
    						var f = function() {
    							$("#applyReasonId").bind("keyup",checkReason);
    			    			$("#domainId").val(row.id);
    			    			$("#domainName").val(row.name);
    			    			var title = row.title;
        			    		if (typeof title == 'undefined' || '' == title || title == null) {
        			    			title = row.name;
        			    		}
    			    			$("#nameid").val(title);
    			    			$("#expireDateId").val(row.expireDateStr);
    			    			var expireDateId2 = row.expireDateStr;
			    		        $("#expireDateId2").val(expireDateId2);
    			    		};
    			    		var json={
    			    				url:"page/widget/applyExpire.jsp",
    			    				head:$("#applyExpire").val(),
    			    				width:'520px',
    			    				f:f,
    			    				height:"291px"
    			    		};
    			    		mylayer.show(json);
    					} else {
    						$("#my-instances").datagrid('reload');
    						$.messager.alert(result.title, result.message, 'error');
    					}
    				}
    			}
    		});
    		
    	}
    }
    //查询云主机
    function doSearch(value) {
		$('#my-instances').datagrid('load', {   
		    title: value
        }); 
	}
    //关闭层
    function closeLayer(){
    	$("#windowOverId").hide();
    	$("#windowOverId").html("");
    }
    //断开浮动桌面池的虚拟桌面
    function releaseVDesktop(type){
    	var row = null;
    	if (typeof type == "undefined") {
        	   row = $("#my-instances").datagrid("getSelected");
            } else {
               row = contextRowData;
        }
    	if (row) {
    		var title = row.title;
    		if (typeof title == 'undefined' || '' == title || title == null) {
    			title = row.name;
    		}
    		$.messager.confirm($("#releaseVDesktop").val(), $("#confirmReleaseVDesktop").val(),
    				function(r){
    			         if (r) {
    			        	 //先检查
    			        	 $.ajax({
    			        		 type : "POST",
    			        		 dataType : "json",
    			        		 url : "servlet/vmList?way=releaseVDesktop",
    			        		 data : "vmId=" + row.id + "&title=" + title,
    			        		 beforeSend:function(xhr){
    					 			  showWait($("#processing").val(), 999999);
    					 		 },
    			        		 success : function(result) {
    			        			 hideWait();
    			        			 if (result != null && typeof result != 'undefined') {
    			        				 if (result.success) {
    			        					 $("#my-instances").datagrid('reload');
    			        					 $.messager.show({          
    			        						 title:result.title,            
    			        						 msg:result.message, 
    			        						 showType:'show'     
    			        					 });
    			        				 } else {
    			        					 $.messager.alert(result.title, result.message, 'error');
    			        				 }
    			        			 }
    			        		 },
    					 		error:function(xhr, textStatus, errorThrown) {
    					 			  hideWait();
    					 		   }
    			        	 });
    			        	 
    			         }
    		        });
    		
    	}
    }
