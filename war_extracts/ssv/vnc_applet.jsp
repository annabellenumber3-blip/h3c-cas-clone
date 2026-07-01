<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<% 
		String domainId = request.getParameter("domainId");
	 	String userName = request.getParameter("userName");
	 	String password = request.getParameter("password");
	 	String title = "vnc-Console";
		if (request.getParameter("title") != null) {
			title = java.net.URLDecoder.decode(request.getParameter("title"), "UTF-8");
		}
	 	String protocol = request.getParameter("protocol");
	 	String hostIp = request.getParameter("hostIp");
	 	String hostPort = request.getParameter("hostPort");
	 	String jarUrl = "http://" + request.getServerName() + ":" + request.getServerPort() +  request.getContextPath() + "/jre-7u51-windows-i586.exe";;
	%>
<title><%=title %></title>
</head>
<body style="margin:0;height:100%;">

	<script type="text/javascript">
	var str = '<div style="height:100%;"><OBJECT name = "vnc" id = "vncOBJECT" classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="100%" height="100%" codebase="<%=jarUrl%>">'
	+ '<PARAM name="code" value="com.virtual.vnc.VncViewerApplet">'
	+ '<PARAM name="archive" value="jar/vnc.jar">'
	+ '<PARAM name="type" value="application/x-java-applet;version=1.6">'
	+ '<PARAM name="DOMAINID" value="<%=domainId %>">'
	+ '<PARAM name="USERNAME" value="<%=userName %>">'
	+ '<PARAM name="PASSWORD" value="<%=password %>">'
	+ '<PARAM name="PROTOCOL" value="<%=protocol %>">'
	+ '<PARAM name="HOSTIP" value="<%=hostIp %>">'
	+ '<PARAM name="HOSTPORT" value="<%=hostPort %>">'
	+ '<COMMENT>'
	+ '<EMBED name="vnc" id = "vncjar" type="application/x-java-applet;version=1.6" width="100%" height="100%" pluginspage="<%=jarUrl%>" code="com.virtual.vnc.VncViewerApplet" archive="jar/vnc.jar" '
	+ 'DOMAINID="<%=domainId %>" USERNAME="<%=userName %>" PASSWORD="<%=password %>" PROTOCOL="<%=protocol %>" HOSTIP="<%=hostIp %>" HOSTPORT="<%=hostPort %>" >'
	+ '<noembed></noembed>'
	+ '</EMBED>'
	+ '</COMMENT>'
	+ '</OBJECT></div>';
	document.writeln(str);
	if (navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Chrome') >= 0) {
		var vnc = document.getElementById("vncjar");
		if (vnc != null) {			
			vnc.height = window.innerHeight;
			window.onresize = function() {
			    var vnc = document.getElementById("vncjar");
				vnc.height = window.innerHeight;
			}
		}
	}
	if (navigator.userAgent.indexOf('MSIE') >= 0) {
		function getWinHeight() {
			var winHeight;
			if (window.innerHeight) {				
				winHeight = window.innerHeight; 
			} else if ((document.body) && (document.body.clientHeight)) {				
				winHeight = document.body.clientHeight; 
			}
				//通过深入Document内部对body进行检测，获取窗口大小 
			if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) { 
				winHeight = document.documentElement.clientHeight; 
			}
			return winHeight;
		}
		
		var vnc = document.getElementById("vncOBJECT");
		if (vnc != null) {			
			vnc.height = getWinHeight();
			window.onresize = function() {
			    var vnc = document.getElementById("vncOBJECT");
				vnc.height = getWinHeight();
			}
		}
	}
	</script>
</body>
</html>