<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
	String host = request.getParameter("ip");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>SSH Client</title>
</head>
<body>
	<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" 
	 	codebase="jre-7u51-windows-i586.exe#Version=6,0,0,1"		
		width="825" height="570" name="JCTermApplet">
		<param name="code" value="com.jcraft.jcterm.JCTermApplet" />
		<param name="archive" value="jar/jcterm-0.0.11.jar" />
		<param name="type" value="application/x-java-applet;version=1.6" />
		<param name="jcterm.font_size" value="14" />
		<param name="jcterm.ip_address" value="<%=host%>" />
		<comment> 
			<embed
			    type="application/x-java-applet;version=1.6"
				code="com.jcraft.jcterm.JCTermApplet" 
				width="825" 
				height="570"
				archive="jar/jcterm-0.0.11.jar"
				name="JCTermApplet"
				pluginspage="jre-7u51-windows-i586.exe"
				jcterm.font_size="14" 
				jcterm.ip_address="<%=host%>" >
				<noembed> 
				</noembed>
			</embed> 
		</comment>
	</object>
</body>
</html>