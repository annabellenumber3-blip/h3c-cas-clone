<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="java.text.*,java.util.*,com.virtual.common.StringManager,com.virtual.plat.server.ServerUtils"%>
<!DOCTYPE HTML>
<html>
<head>
<% 
		String ctx = request.getContextPath();
        String originDomainId = ServerUtils.xssEncode(request.getParameter("domainId"));
        String domainIdParam = request.getParameter("domainId");
        String domainId = null;
        if (domainIdParam != null) {
        	domainId = ServerUtils.xssEncode(java.net.URLDecoder.decode(request.getParameter("domainId"), "UTF-8"));
        }
        String realId = ServerUtils.xssEncode(ServerUtils.decryptText(domainId));
		String token = ServerUtils.xssEncode(request.getParameter("token"));
		//String path = "websockify/?token="+token;
	 	String host = ServerUtils.xssEncode(request.getParameter("host"));
	 	String port = ServerUtils.xssEncode(request.getParameter("port"));
	 	String title = "no_vnc_console";
	 	String domainName = ServerUtils.xssEncode(request.getParameter("domainName"));
	 	String status = ServerUtils.xssEncode(request.getParameter("status"));
	 	String titleOriginal = "";
		if (request.getParameter("title") != null) {
			titleOriginal = ServerUtils.xssEncode(request.getParameter("title"));
			title = ServerUtils.xssEncode(java.net.URLDecoder.decode(request.getParameter("title"), "UTF-8"));
		}
		StringManager strMng = StringManager.getManager("com.virtual.plat.server.servlet");
		String jarUrl = "http://" + request.getServerName() + ":" + request.getServerPort() +  request.getContextPath() + "/jre-7u51-windows-i586.exe";
	    String casIp =  ServerUtils.xssEncode(request.getParameter("casIp"));
	    String casPort =  ServerUtils.xssEncode(request.getParameter("casPort"));
	    String userName =  ServerUtils.xssEncode(request.getParameter("userName"));
	    String originPassword =  ServerUtils.xssEncode(request.getParameter("password"));
	    String passwordParam = request.getParameter("password");
	    String password = null;
	    if (passwordParam != null) {
	    	password =  ServerUtils.xssEncode(java.net.URLDecoder.decode(request.getParameter("password"), "UTF-8"));
	    }
	    String protocol = ServerUtils.xssEncode(request.getParameter("protocol"));
	    String localCursor = ServerUtils.xssEncode(request.getParameter("localCursor"));
	    String ldap = ServerUtils.xssEncode(request.getParameter("ldap"));
		String vmIp = ServerUtils.xssEncode(request.getParameter("vmIp"));
	    String isCvmTemplate = ServerUtils.xssEncode(request.getParameter("isCvmTemplate"));
	    String vncKey = null;
	    String vncKeyParam = request.getParameter("vncKey");
	    if (vncKeyParam != null) {
	    	vncKey = ServerUtils.decryptText(ServerUtils.xssEncode(java.net.URLDecoder.decode(vncKeyParam, "UTF-8")));
	    }
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
<script src="../js/lib/jquery-1.9.1.min.js"></script>
<script src="./include/customKeyEditor.js"></script>
<script src="./include/keysym.js"></script>
<script src="./include/keyboard.js"></script>
<script src="./include/keysymdef.js"></script>
<script src="./include/keynames.js"></script>
<script src="vendor/promise.js"></script>
<!-- ES2015/ES6 modules polyfill -->
<script type="module">
    window._noVNC_has_module_support = true;
</script>
<script>
    window.addEventListener("load", function() {
        if (window._noVNC_has_module_support) return;
        var loader = document.createElement("script");
        loader.src = "vendor/browser-es-module-loader/dist/browser-es-module-loader.js";
        document.head.appendChild(loader);
    });
</script>
</head>
<body>
    <!-- 遮罩层 -->
    <div id='masklayer' class="mask-layer"></div>
	<div id="noVNC_screen">
		<div id="noVNC_status_bar" class="noVNC_status_bar">
			<table border=0 width="100%">
				<tr>
					<td>
						<div id="noVNC_status" style="position: relative; height: 30px;">
							<ul class="clear">
								<li class="gray operation first">
			                        <a href="#" id="startVM" style="display:none;">
									    <img src="images/startvm.svg" style="vertical-align: sub;padding-right:5px"/>
									    <%=strMng.getString("domain.start")%>
									</a>
								</li>
								<li class="gray operation first">
			                        <a href="#" id="shutDownVM" style="display:none;">
										<img src="images/shutdown.svg" style="vertical-align: sub;padding-right:5px"/>
										<%=strMng.getString("domain.shutDown")%>
									</a>
								</li>
								<li class="gray operation first">
			                        <a href="#" id="closeVM" style="display:none;">
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
                                        <dd>
                                            <a href="#" id ="sendKeysAltF4" onclick="javacript:sendAltF4()">
                                                <span class="key">Alt</span>+
                                                <span class="key">F4</span>
                                            </a>
                                        </dd>
										<dd>
                                            <a href="#" id ="sendKeysPrtSc" onclick="javacript:sendPrtSc()">
                                                <span class="key">PrtSc</span>
                                            </a>
                                        </dd>
                                       <!--  <dd>
                                            <a href="#" id ="sendKeysCtrlA" onclick="javacript:sendUserKeys([XK_Control_L,XK_A])">
                                                <span class="key">Ctrl</span>+
                                                <span class="key">A</span>
                                            </a>
                                        </dd>
                                        <dd>
                                            <a href="#" id ="sendKeysCtrlC" onclick="javacript:sendUserKeys([XK_Control_L,XK_C])">
                                                <span class="key">Ctrl</span>+
                                                <span class="key">C</span>
                                            </a>  
                                        </dd>
                                        <dd>
                                            <a href="#" id ="sendKeysCtrlV" onclick="javacript:sendUserKeys([XK_Control_L,XK_V])">
                                                <span class="key">Ctrl</span>+
                                                <span class="key">V</span>
                                            </a>
                                        </dd>
                                        <dd>
                                            <a href="#" id ="sendKeysCtrlX" onclick="javacript:sendUserKeys([XK_Control_L,XK_X])">
                                                <span class="key">Ctrl</span>+
                                                <span class="key">X</span>
                                            </a>
                                        </dd>
                                        <dd>
                                            <a href="#" id ="sendKeysCtrlZ" onclick="javacript:sendUserKeys([XK_Control_L,XK_Z])">
                                                <span class="key">Ctrl</span>+
                                                <span class="key">Z</span>
                                            </a>
                                        </dd> -->
                                        <%-- <dd>
                                            <a href="#" id ="sendCustomKeys" onclick="javacript:openCustomKeysDiv()">
                                                <span class="key"><%=strMng.getString("domain.send.keys.custom")%></span>
                                            </a>
                                        </dd> --%>
									</dl>
								</li>
								<li id="virtualDrive" style="display:none;" class="first gary" title="<%=strMng.getString("domain.isoTip") %>"><a href="#" onclick="javascript:showISOPanel()"><img class="imageLeft" src="images/cdrom.png"/><%=strMng.getString("domain.load.iso")%></a></li>
								<li class="first gary"><a id="connect_type" href="#"><img class="imageLeft" src="images/disconnect.svg"/><%=strMng.getString("domain.disconnect")%></a></li>
								<li class="first gary"><a href="#" onclick="javascript:refreshPage()"><img class="imageLeft" src="images/refresh.svg"/><%=strMng.getString("domain.refresh")%></a></li>
								<li id="fullscreen" class="first gary"><a href="#" onclick="javascript:togglefullScreen(0)"><div class="imageLeft"></div><%=strMng.getString("domain.fullscreen")%></a></li>
								<li id="exitfull" class="first gary"><a href="#" onclick="javascript:togglefullScreen(1)"><div class="imageLeft"></div><%=strMng.getString("domain.exitfullscreen")%></a></li>
							</ul>
						</div>
					</td>
					<td width="15%">
					   <a id="vmTitle" href="#"><%=strMng.getString("domain.connecting")%></a>
				   </td>
					<td width="10%">
						<a id="vmIp" href="#"><%=strMng.getString("domain.connecting")%></a>
					</td>
				</tr>
			</table>
		</div>
		
	</div>
	<div id="pass_required" class="vnc_password" >
	    <table>
	       <tr>
	         <td><input type="password" id="vnc_password_input" type="text" placeholder="<%=strMng.getString("domain.changePasswd.inputpasswd")%>" /></td>
	         <td><button id="vnc_password_btn"><%=strMng.getString("yes")%></button></td>
	       </tr>
	    </table>
	</div>
    <!-- <div id="floatWindow" class="window-overlay"></div> -->
    <div id="draggable" class="dragHide">这个可以拖动</div>
    <div id="changePasswdDiv" class="modalDialog">
      <table>
         <tr>
           <td><label class="uname" for="username"><%=strMng.getString("domain.changePasswd.username")%></label></td>
           <td><input id="username" name="username" type="text" placeholder="<%=strMng.getString("domain.changePasswd.inputusername")%>"/></td>
         </tr>
         <tr>
           <td><label class="uname" for="passwd"><%=strMng.getString("domain.changePasswd.passwd")%></label></td>
           <td><input id="passwd" name="passwd" type="password" placeholder="<%=strMng.getString("domain.changePasswd.inputpasswd")%>"/></td>
         </tr>
         <tr>
           <td><label class="uname" for="passwd2"><%=strMng.getString("domain.changePasswd.passwd2")%></label></td>
           <td><input id="passwd2" name="passwd2" type="password" placeholder="<%=strMng.getString("domain.changePasswd.inputpasswd2")%>"/></td>
         </tr>
      </table>
      <button id="passwdbutton1" onclick="changePasswd()"><%=strMng.getString("yes")%></button>
      <button id="passwdbutton2" onclick="closeChangePasswdDiv()"><%=strMng.getString("no")%></button>
    </div>
    
    <div id="confirmDilog" class="dragHide"></div>
    <form name="refreshForm" action="<%=ctx%>/vnc/vnc.jsp" method="post">
        <input type="hidden" name="domainId" value="<%=originDomainId%>" />
        <input type="hidden" name="title" value="<%=titleOriginal%>" />
        <input type="hidden" name="domainName" value="<%=domainName%>" />
        <input type="hidden" name="casIp" value="<%=casIp%>" />
        <input type="hidden" name="casPort" value="<%=casPort%>" />
        <input type="hidden" name="userName" value="<%=userName%>" />
        <input type="hidden" name="password" value="<%=originPassword%>" />
        <input type="hidden" name="token" value="<%=token%>" />
        <input type="hidden" name="status" value="<%=status%>" />
        <input type="hidden" name="host" value="<%=host%>" />
        <input type="hidden" name="port" value="<%=port%>" />
        <input type="hidden" name="localCursor" value="<%=localCursor%>" />
        <input type="hidden" name="ldap" value="<%=ldap%>" />
        <input type="hidden" name="vmIp" value="<%=vmIp%>" />
        <input type="hidden" name="isCvmTemplate" value="<%=isCvmTemplate%>" />
        <input type="hidden" name="vncKey" value="<%=vncKeyParam%>" />
    </form>
    
    <!-- add by h14520 2017.9.11 易用性需求 发送自定义按键 -->
    <div id="customKeysDiv" class="modal-dialog">
      <table>
         <tr>
           <td><label class="uname" for="inputCustomKeys"><%=strMng.getString("domain.send.keys.custom.keys")%></label></td>
           <td><input name="inputCustomKeys" id="inputCustomKeys" type="text" placeholder="<%=strMng.getString("domain.send.keys.custom.input")%>" /><td/>
         </tr>
      </table>
      <div class="button-group">
        <button id="btnRestCustomKeys" onclick="resetCustomKeys()"><%=strMng.getString("domain.send.keys.custom.reset")%></button>
        <button id="btnSendCustomKeys" onclick="sendCustomKeys()"><%=strMng.getString("domain.send.keys")%></button>
        <button id="btnCloseCustomKeys" onclick="closeCustomKeysDiv()"><%=strMng.getString("no")%></button>
      </div>
    </div>
    
	<script>
	var VNC_KEY = "<%=vncKey%>"
	var ctx = "<%=ctx%>";
	function isIpv4(sIPv4) {
	    var bOK = /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d\d|[1-9]\d|\d)$/.test(sIPv4);
	    if(!bOK) {
	        return false;
	    }
	    return true;
	}
	
	function refreshPage() {
		var form = document.forms.refreshForm;
		var request_url = ctx + "/vnc/noVnc";
		var param = {
				id:<%=realId%>,
				operateType:99
		}
		$.ajax({
        	url : request_url,
        	type : "POST",
        	data : param, 
        	success : function(result) {
        		if (result.state == 0) {        			
	        		var msg = result.data;
	        		var value = msg.trim().split(";");
	        		form.status.value = value[0];
	        		form.host.value = value[1];
					form.submit();
        		} else {}
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
    
	var connect_status;

	var customKeyEditor = new CustomKeyEditor(); 
	
	function sendCtrlAltDel() {
		window.rfb.sendCtrlAltDel();
		return false;
	}
	function sendAltTab() {
		window.rfb.sendKeys([XK_Alt_L,XK_Tab]);
		return false;
	}
	function sendCtrlSpace() {
		window.rfb.sendKeys([XK_Control_L,XK_space]);
		return false;
	}
	
	// 发送自定义按键 add by h14520 一线易用性增强需求. 补充无法直接截获输入的键
	// 截屏键   -- 不提供SysRq键，功能太高级
	function sendPrtSc() {
		window.rfb.sendKeys([XK_Print]);
		return false;
	}  
	// Alt + F4, 浏览器下按这个键，会强制关闭浏览器，因此提供发送功能。一般用于关闭窗口
	function sendAltF4() {
		window.rfb.sendKeys([XK_Alt_L,XK_F4]);
		return false;
	}
	
	// 发送自定义的组合键，keys:组合键序列，如[XK_Alt_L,XK_F4]
    function sendUserKeys(keys) {
    	window.rfb.sendKeys(keys);
        return false;
    }
	
	// 重置自定义按键输入框
	function resetCustomKeys() {
		customKeyEditor.reset();
		var keysInput = $('#inputCustomKeys');
		keysInput.val('');
	}
	
	// 发送自定义按键 add by h14520 一线易用性增强需求
	function sendCustomKeys() {
		if (customKeyEditor.keySyms.length <= 0) {
			return false;
		}
		
		// TODO: 由于浏览器限制，ctrl + space, SysRq, Alt+F4 无法捕捉, 只能通过界面上选择特殊键组合
		// alt+F4 会触发浏览器窗口关闭. 可以在输入时，先按下一个alt 再按下一个f4
		// Fn键是直接发给键盘控制器的的，X11或OS无法直接获取 
		window.rfb.sendKeys(customKeyEditor.keySyms);
		return false;
	}
			
	// 显示模态对话框, 显示遮罩层mask-layer挡住下面的窗口,本文件中是仅仅挡住canvas
	// divId 元素的id, 模态对话框的div需要提前定义好，class=modal-dialog
	function showModalDialog(divId) {
		$('#'+divId).show();
		$(".mask-layer").css("display","block");
	}
	
	// 关闭模态对话框
	function closeModalDialog(divId) {
		$('#customKeysDiv').hide();
		$(".mask-layer").css("display","none");
	}
	
 // 显示输入自定义按键的对话框
	function openCustomKeysDiv() {          
		
		showModalDialog('customKeysDiv');
		
		customKeyEditor.reset(); // 重置自定义按键
		
		/* 输入自定义按键的文本框处， 绑定键盘事件， 截获用户按下的键并显示 . */
		$('#inputCustomKeys').bind('keydown',function(event) {
			event.preventDefault();  // 禁止浏览器默认行为, 防止组合键按下时，激活浏览器的快捷键功能，例如ctrl+p打印，ctrl+s保存
			event.stopPropagation(); // 阻止事件进一步传递
			
			// 记录按下的键 e: 键盘按下的event. 当用户在自定义按键输入框, 按下键keydown时,触发
			// 允许先按下组合键，再按下普通键
			customKeyEditor.recordKeydown(event);
			var keysInput = $('#inputCustomKeys');
			keysInput.val(customKeyEditor.keyText);
			return false; // IE中阻止键盘事件进一步传递
		});
		$('#inputCustomKeys').bind('keypress keyup',function(event) {
			// 对keypress keyup事件, 忽略. 只在keydown时处理
			event.preventDefault();  // 禁止浏览器默认行为, 防止组合键按下时，激活浏览器的快捷键功能，例如ctrl+p打印，ctrl+s保存
			event.stopPropagation(); // 阻止事件进一步传递
			customKeyEditor.recordKeyup();
			// 中文输入法下，可能输入中文到文本框中，因此键盘抬起后，需要刷新文本框
			var keysInput = $('#inputCustomKeys');
			keysInput.val(customKeyEditor.keyText);
			return false; // IE中阻止键盘事件进一步传递
		});
	}
 
	// 关闭自定义按键对话框
	function closeCustomKeysDiv() {
		var keysInput = $('#inputCustomKeys');
		keysInput.val('');
		closeModalDialog('customKeysDiv');
	}       
	
	function getWinSize() {
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

		if (self.innerHeight) { // all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement
				&& document.documentElement.clientHeight) { // Explorer 6 Strict Mode
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

		return {
			'pageWidth' : pageWidth,
			'pageHeight' : pageHeight,
			'windowWidth' : windowWidth,
			'windowHeight' : windowHeight
		}
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
		
		var winSize = getWinSize();
		//alert(winSize.pageWidth);
		//遮罩层
		var styleStr = 'top:0;left:0;position:absolute;z-index:10000;background:#666;width:' + winSize.pageWidth + 'px;height:' +  (winSize.pageHeight + 30) + 'px;';
		styleStr += (isIe) ? "filter:alpha(opacity=80);" : "opacity:0.8;"; //遮罩层DIV
		var shadowDiv = document.createElement('div'); //添加阴影DIV
		shadowDiv.style.cssText = styleStr; //添加样式
		shadowDiv.id = "shadowDiv";
		//如果是IE6则创建IFRAME遮罩SELECT
		if (true) {
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
		var rfb = window.rfb;
		if (type == 3) {
			var typebv = $("#connect_type").css("opacity");
			if (typebv != "1") {
				return;
			}
		}
		
		// var request_url = "/cas/servlet/noVNCServlet";
		var request_url = ctx + "/vnc/noVnc";
		var dataStr = "id=" + '<%=realId%>' + "&operateType=" + type;
			dataStr += "&domainName=" + '<%=domainName%>';
		var domainName;
		if ('<%=domainName%>' != 'null') {
			domainName = '<%=domainName%>';
		}
		var param = {
				id:<%=realId%>,
				operateType:type,
				domainName:domainName
		}
		
		$.ajax({
			url : request_url,
			type : "POST",
			data : dataStr, 
			success : function(result, textStatus) {
				var msg = result.data;
				if (result.state == 0 && msg.trim() == "success") {
					switch (type) {
					case 0:
						refreshPage();
						break;
					case 2:
						status = 'shutOff';
						refreshPage();
						break;
					case 3:
						if (connect_status == 1) {
							refreshPage();
					} else {
						    window.rfb.disconnect();
						}
						break;
					default:
						status = 'shutOff';
						break;
					}
				   // alertMsg(0, 0);
				} else {
					alertMsg(1, 0);
				} 
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alertMsg(1, 0);
			}
		});
	}
	
	function openChangePasswdDiv(){
		$('#changePasswdDiv').show();
		 /*防止键盘事件冒泡*/
		$('#changePasswdDiv').bind('keypress keydown keyup',function(event){
			event.stopPropagation();
		});
	}
	
	function closeChangePasswdDiv() {
		var username = $('#username');
		var passwd = $('#passwd');
		var passwd2 = $('#passwd2');
		$('#changePasswdDiv').hide();
		username.val('');
		passwd.val('');
		passwd2.val('');
	}
	
	function changePasswd() {
		var username = $('#username');
		var passwd = $('#passwd');
		var passwd2 = $('#passwd2');
		if (checkValueIsNull(username) || checkValueIsNull(passwd) || checkValueIsNull(passwd2)) {
			return;
		}
		if (passwd.val() != passwd2.val()) {
			passwd2.focus();
			passwd2.css("border","1px solid red");
			passwd2.attr("title","<%=strMng.getString("domain.changePasswd.passwdnotsame")%>")
			return;
		} else {
			passwd2.attr("title","")
			passwd2.css("border","1px solid rgb(178, 178, 178)");
		}
		var request_url = ctx + "/vnc/noVnc";
		var param = {
				id:<%=realId%>,
				operateType:4,
				username:username.val(),
				password:passwd.val()
		}
		$.ajax({
			url : request_url,
			type : "POST",
			data : param, 
			success : function(result) {
				var msg = result.data;
				if (result.state == 0 && msg.trim() == "success") {
					alertMsg(0, 0);
				} else {
					alertMsg(1, 0);
				} 
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alertMsg(1, 0);
			}
		});
		
		closeChangePasswdDiv();
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
	var fullScreenInterval = setInterval(function() {
		if(document.isFullScreen||document.mozFullScreen||document.webkitIsFullScreen) {
			$('#fullscreen').hide();
			$('#exitfull').show();
		}else {
			$('#fullscreen').show();
			$('#exitfull').hide();
		}
	},200)
	function checkValueIsNull(obj) {
		if (!obj.val() || !obj.val().trim()) {
			obj.focus();
			obj.css("border","1px solid red");
			return true;
		} else {
			obj.css("border","1px solid rgb(178, 178, 178)");
			return false;
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
				var str = '<div style="text-align: center;"><div style="width: 500px;height: 16px;border-top-left-radius: 10px;border-top-right-radius: 10px;background: none repeat scroll 0% 0% rgba(131, 143, 131, 1);"><img onclick="hideISOPanel()" style="height: 15px;float: right;width: 20px;padding-right: 3px;" src="images/close.png" /></div><OBJECT name = "jnbd" id = "JNbdObject" classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="500px" height="300px" codebase="<%=jarUrl%>">'
					+ '<PARAM name="code" value="com.virtual.vnc.JNbdApplet">'
					+ '<PARAM name="archive" value="../jar/vnc.jar">'
					+ '<PARAM name="type" value="application/x-java-applet;version=1.6">'
					+ '<PARAM name="DOMAINID" value="<%=domainId %>">'
					+ '<PARAM name="HOSTIP" value="<%=casIp %>">'
					+ '<PARAM name="HOSTPORT" value="<%=casPort %>">'
					+ '<PARAM name="USERNAME" value="<%=userName %>">'
					+ '<PARAM name="PASSWORD" value="<%=password %>">'
					+ '<PARAM name="PROTOCOL" value="<%=protocol %>">'
					+ '<PARAM name="LDAP" value="<%=ldap %>">'
					+ '<PARAM name="VMIP" value="<%=vmIp %>">'
					+ '<COMMENT>'
					+ '<EMBED name="jnbd" id = "JNbdJar" type="application/x-java-applet;version=1.6" width="500px" height="300px" pluginspage="<%=jarUrl%>" code="com.virtual.vnc.JNbdApplet" archive="../jar/vnc.jar" '
					+ 'DOMAINID="<%=domainId %>" USERNAME="<%=userName %>" PASSWORD="<%=password %>" PROTOCOL="<%=protocol %>" HOSTIP="<%=casIp %>" HOSTPORT="<%=casPort %>" LDAP="<%=ldap %>" VMIP="<%=vmIp %>">'
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
			// var $doc = document;
			// var turnForm = $doc.createElement("form");
			// $doc.body.appendChild(turnForm);
			// turnForm.name = "vnc";
			// turnForm.method = "post";
			// turnForm.action = ctx + "/vnc_jnlp.jsp";
			// turnForm.target = "_self";
			// var element = $doc.createElement("input");
			// element.setAttribute("name", "domainId");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", "<%=domainId %>");
			// turnForm.appendChild(element);
		
			// var title = "<%=title %>";
			// if (title != null) {
			// 	title = encodeURI(title);
			// }
			// element = $doc.createElement("input");
			// element.setAttribute("name", "title");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", title);
			// turnForm.appendChild(element);

			// element = $doc.createElement("input");
			// element.setAttribute("name", "userName");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", "<%=userName %>");
			// turnForm.appendChild(element);

			// element = $doc.createElement("input");
			// element.setAttribute("name", "password");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", "<%=password %>");
			// turnForm.appendChild(element);

			// element = $doc.createElement("input");
			// element.setAttribute("name", "protocol");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", "<%=protocol %>");
			// turnForm.appendChild(element);

			// element = $doc.createElement("input");
			// element.setAttribute("name", "hostIp");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", "<%=casIp %>");
			// turnForm.appendChild(element);
			// var casPort = "<%=casPort %>";
			// if (casPort != null) {
			// 	element = $doc.createElement("input");
			// 	element.setAttribute("name", "hostPort");
			// 	element.setAttribute("type", "hidden");
			// 	element.setAttribute("value", "<%=casPort %>");
			// 	turnForm.appendChild(element);
			// }

			// element = $doc.createElement("input");
			// element.setAttribute("name", "jnlpType");
			// element.setAttribute("type", "hidden");
			// element.setAttribute("value", "JNbd");
			// turnForm.appendChild(element);

			// turnForm.submit();


			// fix: 使用iframe形式代替原本的form表单形式解决问题单
			var title = "<%=title %>";
			if (title != null) {
				title = encodeURI(title);
			}
			var elemIF = document.createElement("iframe");
			elemIF.src = ctx + "/vnc_jnlp.jsp?domainId="+encodeURIComponent("<%=domainId %>")+
			"&title="+title+
			"&userName="+"<%=userName %>"+
			"&password="+encodeURIComponent("<%=password %>")+
			"&protocol="+"<%=protocol %>"+
			"&hostIp="+"<%=casIp %>"+
			"&hostPort="+"<%=casPort %>"+
			"&ldap="+"<%=ldap %>"+
			"&vmIp="+"<%=vmIp %>"+
			"&jnlpType=JNbd";
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
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
	
	function connected() {
		var s,si, sb, ctype;
		s = $('#vmTitle')[0];
		si = $('#vmIp')[0];
		sb = $('#noVNC_status_bar')[0];
		ctype = $('#connect_type')[0];
		
		var title = '<%=title%>';
		var vmIp = '<%=vmIp%>';
		if (vmIp == null || vmIp == undefined) {
            vmIp = ""
		}
		if (title.length > 18) {
			s.innerHTML = title.substr(0,15) + '...';
		} else {
			s.innerHTML = title;
		}
		si.innerHTML = vmIp;
		s.title = '<%=title%>';
		si.vmIp = vmIp;
		ctype.innerHTML = '<img class="imageLeft" src="images/disconnect.svg"/><%=strMng.getString("domain.disconnect")%>';
		connect_status = 0;
		status = 'running';
		
		updateBarShow();
	}
	
	function disconnected() {
		var s, si,sb, ctype;
		s = $('#vmTitle')[0];
		si = $('#vmIp')[0];
		sb = $('#noVNC_status_bar')[0];
		ctype = $('#connect_type')[0];
		
		s.innerHTML = '<%=strMng.getString("domain.status.disconnect")%>';
		si.innerHTML = '<%=strMng.getString("domain.status.disconnect")%>';
		ctype.innerHTML = '<img class="imageLeft" src="images/connect.svg"/><%=strMng.getString("domain.connect")%>';
		connect_status = 1;
		
		updateBarShow();
	}
	
	function updatePowerButtons() {
		
	}
	
	function updateDesktopName () {
		
	}
	
	function updateBarShow(){
		var startb = $("#startVM");
		var shutb = $("#shutDownVM");
		var closeb = $("#closeVM");
		var isCvmTemplate = "<%=isCvmTemplate%>";
		if ("true" != isCvmTemplate) {
			startb.show();
			shutb.show();
			closeb.show();
			$("#virtualDrive").show();
		}
		//var changepasswdb = $("#changePassbtn");
		var typeb = $("#connect_type");
		var sendKeys1 = $("#sendKeys1");
		var sendKeys2 = $("#sendKeys2");
		var sendKeys3 = $("#sendKeys3");
		var sendKeysAltF4 = $("#sendKeysAltF4");
		var sendKeysPrtSc = $("#sendKeysPrtSc");
		var sendCustomKeys = $("#sendCustomKeys");
		startb.css("opacity", status != 'running' ? "1" : "0.5"); //设置透明度
		shutb.css("opacity", status == 'running' ? "1" : "0.5"); //设置透明度
		closeb.css("opacity", status == 'running' ? "1" : "0.5"); //设置透明度
		//changepasswdb.css("opacity", status == 'running' ? "1" : "0.5"); //设置透明度
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
			sendKeysAltF4.css("opacity", "1");
			sendKeysPrtSc.css("opacity", "1");
			sendCustomKeys.css("opacity", "1");
		} else {
			sendKeys1.css("opacity", "0.5");
			sendKeys2.css("opacity", "0.5");
			sendKeys3.css("opacity", "0.5");
			sendKeysAltF4.css("opacity", "0.5");
			sendKeysPrtSc.css("opacity", "0.5");
			sendCustomKeys.css("opacity", "0.5");
		}
	}
	
	function initModules() {
		$("#startVM").click(function() {
			alertMsg(this, 1, 0);
		});
		
		$("#shutDownVM").click(function() {
			alertMsg(this, 1, 1);
		});
		
		$("#closeVM").click(function() {
			alertMsg(this, 1, 2);
		});
		
		$("#connect_type").click(function() {
			operateVM(3);
		});
		
		
		var obj = document.getElementById('draggable');
		rDrag.init(obj);
		
		$('#vmTitle').click(function (){
			$('#vmTitle').focus();
		});
		$('#vmTitle').bind('keypress keydown keyup',function(event){
			if (event.keyCode == 121) {
				openChangePasswdDiv();
			}
			event.preventDefault();
			event.stopPropagation();
		});

        $('#vmIp').click(function (){
            $('#vmIp').focus();
        });
        $('#vmIp').bind('keypress keydown keyup',function(event){
            if (event.keyCode == 121) {
                openChangePasswdDiv();
            }
            event.preventDefault();
            event.stopPropagation();
        });

		$('#exitfull').hide();
	};
	</script>
    <script type="module"  crossorigin="anonymous">
        import * as WebUtil from './app/webutil.js';
        import RFB from './core/rfb.js';

        var rfb;
        var desktopName;

        function updateDesktopName(e) {
            desktopName = e.detail.name;
        }
        function credentials(e) {
			if(VNC_KEY && VNC_KEY!='null') {
            	rfb.sendCredentials({ password: VNC_KEY });
			}else {
				$('#pass_required').show();
				$('#vnc_password_input').keypress(function(event) {
					if (event.keyCode == 13) {
						setPassword();
					}
				});
				$('#vnc_password_btn').click(function() {
					setPassword();
				});
			}
        }
        function setPassword() {
            rfb.sendCredentials({ password: $('#vnc_password_input').val() });
		    $('#vnc_password_input').val("");
		    $('#pass_required').hide();
            return false;
        }
        function sendCtrlAltDel() {
            rfb.sendCtrlAltDel();
            return false;
        }
        function machineShutdown() {
            rfb.machineShutdown();
            return false;
        }
        function machineReboot() {
            rfb.machineReboot();
            return false;
        }
        function machineReset() {
            rfb.machineReset();
            return false;
        }
        function status(text, level) {
            switch (level) {
                case 'normal':
                case 'warn':
                case 'error':
                    break;
                default:
                    level = "warn";
            }
        }

        WebUtil.init_logging(WebUtil.getConfigVar('logging', 'warn'));
        //document.title = WebUtil.getConfigVar('title', 'noVNC');

        // By default, use the host and port of server that served this file
        var host = "<%=host%>";
		var port = <%=port%>;
        //兼容IPv6
        if (!isIpv4(host)) {
            host = '[' + host + ']';
        }   
        var password = '';
        var path = 'websockify';

        var token = '<%=token%>';
        if (token) {
            // if token is already present in the path we should use it
            path = WebUtil.injectParamIfMissing(path, "token", token);

            WebUtil.createCookie('token', token, 1)
        }

        function connectRFB() {
            status("Connecting", "normal");

            if ((!host) || (!port)) {
                status('Must specify host and port in URL', 'error');
            }

            var url;

            if (WebUtil.getConfigVar('encrypt',
                                     (window.location.protocol === "https:"))) {
                url = 'wss';
            } else {
                url = 'ws';
            }

            url += '://' + host;
            if(port) {
                url += ':' + port;
            }
            url += '/' + path;

            var canvasDiv = document.getElementById('noVNC_screen');
            rfb = new RFB(canvasDiv, url,
                          { repeaterID: WebUtil.getConfigVar('repeaterID', ''),
                            shared: WebUtil.getConfigVar('shared', true),
                            credentials: { password: password } });
            rfb.viewOnly = WebUtil.getConfigVar('view_only', false);
            rfb.addEventListener("connect",  connected);
            rfb.addEventListener("disconnect", disconnected);
            rfb.addEventListener("capabilities", function () { updatePowerButtons(); });
            rfb.addEventListener("credentialsrequired", credentials);
            rfb.addEventListener("desktopname", updateDesktopName);
            rfb.scaleViewport = WebUtil.getConfigVar('scale', false);
            rfb.resizeSession = WebUtil.getConfigVar('resize', false); 

            window.rfb = rfb;
        }

        (function() {
            connectRFB();
            initModules();
        })();
    </script>
</body>
</html>
