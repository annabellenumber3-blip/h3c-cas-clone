<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="java.text.*,java.util.*,com.virtual.common.StringManager,com.virtual.ssv.server.ServerUtils"%>
<!DOCTYPE HTML>
<html>
<head>
<% 
		String ctx = request.getContextPath();
        String domainId = ServerUtils.xssEncode(request.getParameter("domainId"));
        String uniqueKey = ServerUtils.xssEncode(request.getParameter("uniqueKey"));
		String token = ServerUtils.xssEncode(request.getParameter("token"));
		String path = "websockify/?token="+token;
	 	String host = ServerUtils.xssEncode(request.getParameter("host"));
	 	String port = ServerUtils.xssEncode(request.getParameter("port"));
	 	String titleA = ServerUtils.xssEncode(request.getParameter("title"));
	 	String title = null;
	 	String domainName = ServerUtils.xssEncode(request.getParameter("domainName"));
	 	String status = ServerUtils.xssEncode(request.getParameter("status"));
		if (titleA != null) {
			title = ServerUtils.xssEncode(java.net.URLDecoder.decode(titleA, "UTF-8"));
		}
		String cloudId = ServerUtils.xssEncode(request.getParameter("cloudId"));
		StringManager strMng = StringManager.getManager(StringManager.class);
		String jarUrl = "http://" + request.getServerName() + ":" + request.getServerPort() +  request.getContextPath() + "/jre-7u51-windows-i586.exe";
	    String casIp =  ServerUtils.xssEncode(request.getParameter("casIp"));
	    String casPort =  ServerUtils.xssEncode(request.getParameter("casPort"));
	    String userName =  ServerUtils.xssEncode(request.getParameter("userName"));
	    String password =  ServerUtils.xssEncode(request.getParameter("password"));
	    String protocol = ServerUtils.xssEncode(request.getParameter("protocol"));
	    String localCursor = ServerUtils.xssEncode(request.getParameter("localCursor"));
	%>
<title><%=title%></title>

<meta charset="utf-8">

<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
                Remove this if you use the .htaccess -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!-- Apple iOS Safari settings -->
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style"
	content="black-translucent" />
<!-- App Start Icon  -->
<link rel="apple-touch-startup-image" href="images/screen_320x460.png" />
<!-- For iOS devices set the icon to use if user bookmarks app on their homescreen -->
<link rel="apple-touch-icon" href="images/screen_57x57.png">
<!--
    <link rel="apple-touch-icon-precomposed" href="images/screen_57x57.png" />
    -->

<!-- Stylesheets -->
<link rel="stylesheet" href="include/base.css" title="plain">
<link rel="stylesheet" href="include/vncStyle.css" title="plain">
<script src="include/util.js"></script>
</head>
<body>
	<div id="noVNC_screen">
		<div id="noVNC_status_bar" class="noVNC_status_bar">
			<table border=0 width="100%">
				<tr>
					<td>
						<div id="noVNC_status" style="position: relative; height: 30px;">
							<ul class="clear">
								<li class="gray operation first">
			                        <a href="#" id="startVM" onclick="javacript:alertMsg(this, 1, 0)">
									    <img src="images/startvm.svg" style="vertical-align: sub;padding-right:5px"/>
									    <%=strMng.getString("domain.start")%>
									</a>
								</li>
								<li class="gray operation first">
			                        <a href="#" id="shutDownVM" onclick="javacript:alertMsg(this, 1, 1)">
										<img src="images/shutdown.svg" style="vertical-align: sub;padding-right:5px"/>
										<%=strMng.getString("domain.shutDown")%>
									</a>
								</li>
								<li class="gray operation first">
			                        <a href="#" id="closeVM" onclick="javacript:alertMsg(this, 1, 2)">
									    <img src="images/poweroff.svg" style="vertical-align: sub;padding-right:5px"/>
										<%=strMng.getString("domain.close")%>
									</a>
								</li>
								<li class="gray sendkeys"><span class="Darrow"></span><a href="#"><div class="imageLeft"></div><%=strMng.getString("domain.send.keys")%></a>
									<dl>
										<dd>
											<a href="#" id ="sendKeys1" onclick="javacript:sendCtrlAltDel()">
											   <span class="key">Ctrl</span>+
											   <span class="key">Alt</span>+
											   <span class="key">Del</span>
											</a>
										</dd>
										<dd>
											<a href="#" id ="sendKeys3" onclick="javacript:sendCtrlSpace()">
											    <span class="key">Ctrl</span>+
												<span class="key">Space</span>
											</a>
										</dd>
										<dd>
											<a href="#" id ="sendKeys2" onclick="javacript:sendAltTab()">
												<span class="key">Alt</span>+
												<span class="key">Tab</span>
									        </a>
										</dd>
									</dl>
								</li>
								<li class="first gary"><a href="#" onclick="javascript:showISOPanel()"><img class="imageLeft" src="images/cdrom.png"/><%=strMng.getString("domain.load.iso")%></a></li>
								<li class="first gary"><a id="connect_type" href="#" onclick="javascript:operateVM(3)"><img class="imageLeft" src="images/disconnect.svg"/><%=strMng.getString("domain.disconnect")%></a></li>
								<li class="first gary"><a href="#" onclick="javascript:refreshPage()"><img class="imageLeft" src="images/refresh.svg"/><%=strMng.getString("domain.refresh")%></a></li>
								<li id="fullscreen" class="first gary"><a href="#" onclick="javascript:togglefullScreen(0)"><div class="imageLeft"></div><%=strMng.getString("domain.fullscreen")%></a></li>
								<li id="exitfull" class="first gary"><a href="#" onclick="javascript:togglefullScreen(1)"><div class="imageLeft"></div><%=strMng.getString("domain.exitfullscreen")%></a></li>
							</ul>
						</div>
					</td>
					<td width="20%">
					   <div id="vmTitle"><%=strMng.getString("domain.connecting")%></div>
				   </td>
				</tr>
			</table>
		</div>
		<canvas id="noVNC_canvas" width="640px" height="20px">
                Canvas not supported.
        </canvas>
	</div>
	<div id="pass_required" class="vnc_password" >
	    <table>
	       <tr>
	         <td><input type="password" id="vnc_password_input" type="text" placeholder="<%=strMng.getString("domain.changePasswd.inputpasswd")%>" /></td>
	         <td><button id="vnc_password_btn" onclick="setPassword()"><%=strMng.getString("yes")%></button></td>
	       </tr>
	    </table>
	</div>
    <!-- <div id="floatWindow" class="window-overlay"></div> -->
    <div id="confirmDilog" class="dragHide"></div>
    <div id="draggable" class="dragHide">这个可以拖动</div>
    <div id="confirmDilog" class="dragHide"></div>
    <form name="refreshForm" action="/ssv/vnc/vnc.jsp" method="post">
        <input type="hidden" name="domainId" value="<%=domainId%>" />
        <input type="hidden" name="uniqueKey" value="<%=uniqueKey%>" />
        <input type="hidden" name="title" value="<%=titleA%>" />
        <input type="hidden" name="domainName" value="<%=domainName%>" />
        <input type="hidden" name="casIp" value="<%=casIp%>" />
        <input type="hidden" name="casPort" value="<%=casPort%>" />
        <input type="hidden" name="userName" value="<%=userName%>" />
        <input type="hidden" name="password" value="<%=password%>" />
        <input type="hidden" name="token" value="<%=token%>" />
        <input type="hidden" name="status" value="<%=status%>" />
        <input type="hidden" name="host" value="<%=host%>" />
        <input type="hidden" name="port" value="<%=port%>" />
        <input type="hidden" name="cloudId" value="<%=cloudId%>" />
    </form>
	<script>
	var ctx = "<%=ctx%>";
	function refreshPage() {
		var form = document.forms.refreshForm;
		var request_url = "/ssv/servlet/vmList?way=operateVM";
		var dataStr = "&id=" + '<%=domainId%>' + "&operateType=99";
    	dataStr += "&name=" + '<%=title%>';
		$.ajax({
        	url : request_url,
        	type : "POST",
        	data : dataStr, 
        	dataType:"json",
        	contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        	success : function(msg) {
        		form.status.value = msg.result.trim();
				form.submit();
        	},
        	error : function(XMLHttpRequest, textStatus, errorThrown) {
        		alertMsg(1, 0);
        	}
        });
	}
	
	var rDrag = {
    		
    		o:null,
    		
    		init:function(o){
    			o.onmousedown = this.start;
    		},
    		start:function(e){
    			var o;
    			e = rDrag.fixEvent(e);
    	               e.preventDefault && e.preventDefault();
    	               rDrag.o = o = this;
    			o.x = e.clientX - rDrag.o.offsetLeft;
    	        o.y = e.clientY - rDrag.o.offsetTop;
    			document.onmousemove = rDrag.move;
    			document.onmouseup = rDrag.end;
    		},
    		move:function(e){
    			e = rDrag.fixEvent(e);
    			var oLeft,oTop;
    			oLeft = e.clientX - rDrag.o.x;
    			oTop = e.clientY - rDrag.o.y;
    			rDrag.o.style.left = oLeft + 'px';
    			rDrag.o.style.top = oTop + 'px';
    		},
    		end:function(e){
    			e = rDrag.fixEvent(e);
    			rDrag.o = document.onmousemove = document.onmouseup = null;
    		},
    	    fixEvent: function(e){
    	        if (!e) {
    	            e = window.event;
    	            e.target = e.srcElement;
    	            e.layerX = e.offsetX;
    	            e.layerY = e.offsetY;
    	        }
    	        return e;
    	    }
    	}
	    
        /*jslint white: false */
        /*global window, $, Util, RFB, */
        "use strict";

        // Load supporting scripts
        Util.load_scripts(["webutil.js", "base64.js", "websock.js", "des.js", "jquery.min.js",
                           "keysymdef.js", "keyboard.js", "input.js", "display.js",
                           "jsunzip.js", "rfb.js"]);

        var rfb;
        var host, port, password, path, token;
        var status = '<%=status%>';
        var connect_status;
        
        function passwordRequired(rfb) {
            $D('pass_required').style.display = "block";
        }
        function setPassword() {
            rfb.sendPassword($D('vnc_password_input').value);
            $D('vnc_password_input').value = "";
            $D('pass_required').style.display = "none";
        }
        function sendCtrlAltDel() {
            rfb.sendCtrlAltDel();
            return false;
        }
        function sendAltTab() {
            rfb.sendAltTab();
            return false;
        }
        function sendCtrlSpace() {
            rfb.sendCtrlSpace();
            return false;
        }
        
        function alertMsg(cad, mode, type) { 
        	//mode为空，即只有一个确认按钮，mode为1时有确认和取消两个按钮
            mode = mode || 0;
        	var msg;
        	if (mode) {
        		var barId = cad.id;
        		var objectValue = $("#" + barId).css("opacity");
        		if (objectValue != "1") {
        			return;
        		}
        		var content = cad.innerHTML;
	        	msg = '<%=strMng.getString("confirm.do.or.not")%>' + content.substring(content.indexOf('>')+1) + ' "<%=title%>" ' + "?";
        	} else {
        		msg = cad == 0 ? '<%=strMng.getString("oper.success")%>' : '<%=strMng.getString("oper.fail")%>';
        	}
            var top = document.body.scrollTop || document.documentElement.scrollTop;
            var isIe = (document.all) ? true : false;
            var isIE6 = isIe && !window.XMLHttpRequest;
            var sTop = document.documentElement.scrollTop || document.body.scrollTop;
            var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            var winSize = function(){
                var xScroll, yScroll, windowWidth, windowHeight, pageWidth, pageHeight;
                // innerHeight获取的是可视窗口的高度，IE不支持此属性
                if (window.innerHeight && window.scrollMaxY) {
                    xScroll = document.body.scrollWidth;
                    yScroll = window.innerHeight + window.scrollMaxY;
                } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
                    xScroll = document.body.scrollWidth;
                    yScroll = document.body.scrollHeight;
                } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                    xScroll = document.body.offsetWidth;
                    yScroll = document.body.offsetHeight;
                }

                if (self.innerHeight) {    // all except Explorer
                    windowWidth = self.innerWidth;
                    windowHeight = self.innerHeight;
                } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                } else if (document.body) { // other Explorers
                    windowWidth = document.body.clientWidth;
                    windowHeight = document.body.clientHeight;
                }

                // for small pages with total height less then height of the viewport
                if (yScroll < windowHeight) {
                    pageHeight = windowHeight;
                } else {
                    pageHeight = yScroll;
                }

                // for small pages with total width less then width of the viewport
                if (xScroll < windowWidth) {
                    pageWidth = windowWidth;
                } else {
                    pageWidth = xScroll;
                }

                return{
                    'pageWidth':pageWidth,
                    'pageHeight':pageHeight,
                    'windowWidth':windowWidth,
                    'windowHeight':windowHeight
                }
            }();
            //alert(winSize.pageWidth);
            //遮罩层
            var styleStr = 'top:0;left:0;position:absolute;z-index:10000;background:#666;width:' + winSize.pageWidth + 'px;height:' +  (winSize.pageHeight + 30) + 'px;';
            styleStr += (isIe) ? "filter:alpha(opacity=80);" : "opacity:0.8;"; //遮罩层DIV
            var shadowDiv = document.createElement('div'); //添加阴影DIV
            shadowDiv.style.cssText = styleStr; //添加样式
            shadowDiv.id = "shadowDiv";
            //如果是IE6则创建IFRAME遮罩SELECT
            if (isIE6) {
                var maskIframe = document.createElement('iframe');
                maskIframe.style.cssText = 'width:' + winSize.pageWidth + 'px;height:' + (winSize.pageHeight + 30) + 'px;position:absolute;visibility:inherit;z-index:-1;filter:alpha(opacity=0);';
                maskIframe.frameborder = 0;
                maskIframe.src = "about:blank";
                shadowDiv.appendChild(maskIframe);
            }
            document.body.insertBefore(shadowDiv, document.body.firstChild); //遮罩层加入文档
            //弹出框
            var styleStr1 = 'display:block;position:fixed;_position:absolute;left:' + (winSize.windowWidth / 2 - 200) + 'px;top:' + (winSize.windowHeight / 2 - 150) + 'px;_top:' + (winSize.windowHeight / 2 + top - 150)+ 'px;'; //弹出框的位置
            var alertBox = document.createElement('div');
            alertBox.id = 'alertMsg';
            alertBox.style.cssText = styleStr1;
            //创建弹出框里面的内容P标签
            var alertMsg_info = document.createElement('P');
            alertMsg_info.id = 'alertMsg_info';
            alertMsg_info.innerHTML = msg;
            alertBox.appendChild(alertMsg_info);
            //创建按钮
            var btn1 = document.createElement('a');
            btn1.id = 'alertMsg_btn1';
            btn1.href = 'javascript:void(0)';
            btn1.innerHTML = '<cite><%=strMng.getString("yes")%></cite>';
            btn1.onclick = function () {
                document.body.removeChild(alertBox);
                document.body.removeChild(shadowDiv);
                if (type != null && type != 'undefined') {
	                operateVM(type);
                }
            };
            alertBox.appendChild(btn1);
            if (mode === 1) {
                var btn2 = document.createElement('a');
                btn2.id = 'alertMsg_btn2';
                btn2.href = 'javascript:void(0)';
                btn2.innerHTML = '<cite><%=strMng.getString("no")%></cite>';
                btn2.onclick = function () {
                    document.body.removeChild(alertBox);
                    document.body.removeChild(shadowDiv);
                    return false;
                };
                alertBox.appendChild(btn2);
            }
            document.body.appendChild(alertBox);
        }
        
        function operateVM(type) {
        	if (type == 3) {
        		var typebv = $("#connect_type").css("opacity");
        		if (typebv != "1") {
        			return;
        		}
        	}
        	
        	var request_url = "/ssv/servlet/vmList?way=operateVM";
        	var dataStr = "&id=" + '<%=domainId%>' + "&operateType=" + type;
        	dataStr += "&name=" + '<%=title%>';
        	$.ajax({
        		url : request_url,
        		type : "POST",
        		data : dataStr,
        		dataType:"json",
        		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        		success : function(msg) {
        			if (msg.result.trim() == "success") {
        				switch (type) {
	        			case 0:
	        				rfb.connect(host, port, password, path);
	        				break;
	        			case 2:
	        				status = 'shutOff';
	        				updateBarShow();
	        			    break;
	        			case 3:
	        				if (connect_status == 1) {
	        					rfb.connect(host, port, password, path);
	        				} else {
	        					rfb.disconnect();
	        				}
	        				break;
	        			default:
	        				status = 'shutOff';
	        			    break;
	        			}
		              //  alertMsg(0, 0);
	        		} else {
	        			alertMsg(1, 0);
	        		} 
	        	},
	        	error : function(XMLHttpRequest, textStatus, errorThrown) {
	        		alertMsg(1, 0);
	        	}
        	});
        }
        
                function togglefullScreen(op) {
        	if(op == 0) {
	        	var docElm = document.documentElement;
        		//W3C  
        		if (docElm.requestFullscreen) {  
        		    docElm.requestFullscreen();  
        		}
        		//FireFox  
        		else if (docElm.mozRequestFullScreen) {  
        		    docElm.mozRequestFullScreen();  
        		}
        		//Chrome等  
        		else if (docElm.webkitRequestFullScreen) {  
        		    docElm.webkitRequestFullScreen();  
        		}
        		//IE11
        		else if (elem.msRequestFullscreen) {
        		  elem.msRequestFullscreen();
        		}
        		$('#fullscreen').hide();
        		$('#exitfull').show();
        	} else {
        		if (document.exitFullscreen) {  
        		    document.exitFullscreen();  
        		}  
        		else if (document.mozCancelFullScreen) {  
        		    document.mozCancelFullScreen();  
        		}  
        		else if (document.webkitCancelFullScreen) {  
        		    document.webkitCancelFullScreen();  
        		}
        		else if (document.msExitFullscreen) {
        		      document.msExitFullscreen();
        		}
        		$('#fullscreen').show();
        		$('#exitfull').hide();
        	}
        }
        
        function showISOPanel() {
        	var explorer =navigator.userAgent;
        	var isEdge = false;
        	if (explorer != null && explorer != 'undefined' && explorer.indexOf("Edge") >= 0) {
        		isEdge = true;
        	}
        	var javaEnabled = navigator.javaEnabled() && !isEdge;
        	if (javaEnabled) {	   
	        	var JNbd = $D('JNbdObject');
	        	if (JNbd == 'undefined' || JNbd == null) {
		        	var str = '<div style="text-align: center;"><div style="width:  500px;height: 16px;border-top-left-radius: 10px;border-top-right-radius: 10px;background: none repeat scroll 0% 0% rgba(131, 143, 131, 1);"><img onclick="hideISOPanel()" style="height: 15px;float: right;width: 20px;padding-right: 3px;" src="images/close.png" /></div><OBJECT name = "jnbd" id = "JNbdObject" classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="500px" height="300px" codebase="<%=jarUrl%>">'
		        		+ '<PARAM name="code" value="com.virtual.vnc.JNbdApplet">'
		        		+ '<PARAM name="archive" value="../jar/vnc.jar">'
		        		+ '<PARAM name="type" value="application/x-java-applet;version=1.6">'
		        		+ '<PARAM name="DOMAINID" value="<%=uniqueKey %>">'
		        		+ '<PARAM name="HOSTIP" value="<%=casIp %>">'
		        		+ '<PARAM name="HOSTPORT" value="<%=casPort %>">'
		        		+ '<PARAM name="USERNAME" value="<%=userName %>">'
		        		+ '<PARAM name="PASSWORD" value="<%=password %>">'
		        		+ '<PARAM name="PROTOCOL" value="<%=protocol %>">'
		        		+ '<COMMENT>'
		        		+ '<EMBED name="jnbd" id = "JNbdJar" type="application/x-java-applet;version=1.6" width="500px" height="300px" pluginspage="<%=jarUrl%>" code="com.virtual.vnc.JNbdApplet" archive="../jar/vnc.jar" '
		        		+ 'DOMAINID="<%=uniqueKey %>" USERNAME="<%=userName %>" PASSWORD="<%=password %>" PROTOCOL="<%=protocol %>" HOSTIP="<%=casIp %>" HOSTPORT="<%=casPort %>" >'
		        		+ '<noembed></noembed>'
		        		+ '</EMBED>'
		        		+ '</COMMENT>'
		        		+ '</OBJECT></div>';
		        	$D('draggable').innerHTML = str;
	        	}
		        $D('draggable').setAttribute("class", "dragShow");
		        var width = document.body.clientWidth - 500;
		        $D('draggable').style.left= width + 'px';
	        	$D('draggable').style.top= 50 + 'px';
        	} else {
    		    var $doc = document;
    	    	var turnForm = $doc.createElement("form");  
    	    	$doc.body.appendChild(turnForm);
    	    	turnForm.name = "vnc";
    	    	turnForm.method = "post";
    	    	turnForm.action = ctx + "/vnc_jnlp.jsp";
    	    	turnForm.target = "_self";
    	 	    var element = $doc.createElement("input");
    	 	    element.setAttribute("name", "domainId");
    	 	    element.setAttribute("type", "hidden");
    	 	    element.setAttribute("value", "<%=uniqueKey %>");
    	 	    turnForm.appendChild(element);
    	    
    	    	var title = "<%=title %>";
    	    	if (title != null) {
    	    		title = encodeURI(title);
    	    	}
    	    	element = $doc.createElement("input");
    	    	element.setAttribute("name", "title");
    	    	element.setAttribute("type", "hidden");
    	    	element.setAttribute("value", title);
    	    	turnForm.appendChild(element);
    	    	
    	    	element = $doc.createElement("input");
    	    	element.setAttribute("name", "userName");
    	    	element.setAttribute("type", "hidden");
    	    	element.setAttribute("value", "<%=userName %>");
    	    	turnForm.appendChild(element);
    	    
    	    	element = $doc.createElement("input");
    	    	element.setAttribute("name", "password");
    	    	element.setAttribute("type", "hidden");
    	    	element.setAttribute("value", "<%=password %>");
    	    	turnForm.appendChild(element);
    	    	
    	    	element = $doc.createElement("input");
    	    	element.setAttribute("name", "protocol");
    	    	element.setAttribute("type", "hidden");
    	    	element.setAttribute("value", "<%=protocol %>");
    	    	turnForm.appendChild(element);
    	    	
    	    	element = $doc.createElement("input");
    	    	element.setAttribute("name", "hostIp");
    	    	element.setAttribute("type", "hidden");
    	    	element.setAttribute("value", "<%=casIp %>");
    	    	turnForm.appendChild(element);
    	    	var casPort = "<%=casPort %>";
    	    	if (casPort != null) {
    		    	element = $doc.createElement("input");
    		    	element.setAttribute("name", "hostPort");
    		    	element.setAttribute("type", "hidden");
    		    	element.setAttribute("value", "<%=casPort %>");
    		    	turnForm.appendChild(element);
    	    	}
    	    	
    	    	element = $doc.createElement("input");
    	    	element.setAttribute("name", "jnlpType");
    	    	element.setAttribute("type", "hidden");
    	    	element.setAttribute("value", "JNbd");
    	    	turnForm.appendChild(element);
    	    	
    	    	turnForm.submit();  
        	}
        }
        
        function closeISOPanel() {
        	$D('draggable').setAttribute("class", "dragHide");
        }
        
        function hideISOPanel() {
        	$D('draggable').setAttribute("class", "dragMin");
        	$D('draggable').style.left= -1000 + 'px';
        	$D('draggable').style.top= -1000 + 'px';
        }
        
        function xvpShutdown() {
            rfb.xvpShutdown();
            return false;
        }
        function xvpReboot() {
            rfb.xvpReboot();
            return false;
        }
        function xvpReset() {
            rfb.xvpReset();
            return false;
        }
        function updateState(rfb, state, oldstate, msg) {
            var s, sb, ctype, level;
            s = $D('vmTitle');
            sb = $D('noVNC_status_bar');
            ctype = $D('connect_type');
            switch (state) {
                case 'failed':       
                case 'fatal':        
                	level = "error"; 
                	s.innerHTML = '<%=strMng.getString("domain.error")%>';
                	ctype.innerHTML = '<img class="imageLeft" src="images/connect.svg"/><%=strMng.getString("domain.connect")%>';
                	connect_status = 1;
                break;
                case 'normal':       
                	level = "normal"; 
                	s.innerHTML = '<%=title%>';
                	s.title = '<%=title%>';
                	ctype.innerHTML = '<img class="imageLeft" src="images/disconnect.svg"/><%=strMng.getString("domain.disconnect")%>';
                	connect_status = 0;
                	status = 'running';
                break;
                case 'disconnected': 
                	level = "disconnected";
                	s.innerHTML = '<%=strMng.getString("domain.status.disconnect")%>';
                	ctype.innerHTML = '<img class="imageLeft" src="images/connect.svg"/><%=strMng.getString("domain.connect")%>';
                	connect_status = 1;
                break;
                case 'loaded':       
                	level = "loaded";
                	s.innerHTML = '<%=strMng.getString("domain.connecting")%>';
                	ctype.innerHTML = '<img class="imageLeft" src="images/disconnect.svg"/><%=strMng.getString("domain.disconnect")%>';
                	connect_status = 0;
                break;
                default:             
                	level = "warn";
                    ctype.innerHTML = '<img class="imageLeft" src="images/connect.svg"/><%=strMng.getString("domain.connect")%>';
                    connect_status = 1;
                break;
            }

            updateBarShow();
            if (state === "normal") {
            //    cad.disabled = false;
            } else {
            //    cad.disabled = true;
                xvpInit(0);
            }

            sb.setAttribute("class", "noVNC_status_normal");
        }
        
        function updateBarShow(){
        	var startb = $("#startVM");
        	var shutb = $("#shutDownVM");
        	var closeb = $("#closeVM");
        	var typeb = $("#connect_type");
        	var sendKeys1 = $("#sendKeys1");
        	var sendKeys2 = $("#sendKeys2");
        	var sendKeys3 = $("#sendKeys3");
        	startb.css("opacity", status != 'running' ? "1" : "0.5"); //设置透明度
        	shutb.css("opacity", status == 'running' ? "1" : "0.5"); //设置透明度
        	closeb.css("opacity", status == 'running' ? "1" : "0.5"); //设置透明度
        	if (connect_status == 0) {
	        	typeb.css("opacity", "1"); //设置透明度
        	} else if (status == 'running') {
        		typeb.css("opacity", "1"); //设置透明度
        	} else {
        		typeb.css("opacity", "0.5"); //设置透明度
        	}
        	if (connect_status == 0) {
        		sendKeys1.css("opacity", "1");
        		sendKeys2.css("opacity", "1");
        		sendKeys3.css("opacity", "1");
        	} else {
        		sendKeys1.css("opacity", "0.5");
        		sendKeys2.css("opacity", "0.5");
        		sendKeys3.css("opacity", "0.5");
        	}
        }

        function xvpInit(ver) {
            var xvpbuttons;
            //xvpbuttons = $D('noVNC_xvp_buttons');
            if (ver >= 1) {
                //xvpbuttons.style.display = 'inline';
            } else {
                //xvpbuttons.style.display = 'none';
            }
        }
        
        window.onscriptsload = function () {

            //$D('sendCtrlAltDelButton').style.display = "inline";
            //$D('sendCtrlAltDelButton').onclick = sendCtrlAltDel;
            //$D('xvpShutdownButton').onclick = xvpShutdown;
            //$D('xvpRebootButton').onclick = xvpReboot;
            //$D('xvpResetButton').onclick = xvpReset;

            WebUtil.init_logging(WebUtil.getQueryVar('logging', 'warn'));
            //document.title = unescape(WebUtil.getQueryVar('title', 'noVNC'));
            // By default, use the host and port of server that served this file
            //host = WebUtil.getQueryVar('host', window.location.hostname);
            //port = WebUtil.getQueryVar('port', window.location.port);
			host = "<%=host%>";
			port = <%=port%>;

            // if port == 80 (or 443) then it won't be present and should be
            // set manually
            if (!port) {
                if (window.location.protocol.substring(0,5) == 'https') {
                    port = 443;
                }
                else if (window.location.protocol.substring(0,4) == 'http') {
                    port = 80;
                }
            }

            // If a token variable is passed in, set the parameter in a cookie.
            // This is used by nova-novncproxy.
           /*  token = WebUtil.getQueryVar('token', null);
            if (token) {
                WebUtil.createCookie('token', token, 1)
            } */

            password = WebUtil.getQueryVar('password', '');
            //path = WebUtil.getQueryVar('path', 'websockify');
            path = "<%=path%>";

            if ((!host) || (!port)) {
                updateState('failed',
                    "Must specify host and port in URL");
                return;
            }

            rfb = new RFB({'target':       $D('noVNC_canvas'),
                           'encrypt':      WebUtil.getQueryVar('encrypt',
                                    (window.location.protocol === "https:")),
                           'repeaterID':   WebUtil.getQueryVar('repeaterID', ''),
                           'true_color':   WebUtil.getQueryVar('true_color', true),
                           'local_cursor': <%=localCursor%>,
                           'shared':       WebUtil.getQueryVar('shared', true),
                           'view_only':    WebUtil.getQueryVar('view_only', false),
                           'updateState':  updateState,
                           'onXvpInit':    xvpInit,
                           'onPasswordRequired':  passwordRequired});
            //if (status.trim() == 'running' || status.trim() == 'paused') {
               rfb.connect(host, port, password, path);
            //}
            
            var obj = document.getElementById('draggable');
       		rDrag.init(obj);
       		
       		$('#exitfull').hide();
        };
      </script>

</body>
</html>
