<%@ page contentType = "text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%/* 文件说明： 生成vnc的JNLP文件的文件  */%>
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

	String userAgentInfo = request.getHeader("user-agent");
    userAgentInfo = userAgentInfo == null ? null : userAgentInfo.toLowerCase();
    
	response.setContentType("application/x-java-jnlp-file");
	if (userAgentInfo != null && userAgentInfo.indexOf(" chrome/") > 0) {
		response.setHeader("Content-Disposition", "attachment; filename=\"vnc.jnlp\"");
	}
    StringBuilder strBuilder = new StringBuilder();
    
    String url = request.getRequestURL().toString();
    int pos = url.lastIndexOf("/");
    url = url.substring(0, pos);
    String mainClass = "com.virtual.vnc.VncViewer";
    String jnlpType = request.getParameter("jnlpType");
    if ("JNbd".equalsIgnoreCase(jnlpType)) {
    	mainClass = "com.virtual.vnc.JNbdPanel";
    	response.setHeader("Content-Disposition", "attachment; filename=\"Jnbd.jnlp\"");
    }
    
	strBuilder.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");                
    strBuilder.append("<jnlp spec=\"1.5+\" codebase=\"" + url + "\">");
    strBuilder.append("<information>");
    strBuilder.append("<title>VirtDesktop</title>");
    strBuilder.append("<vendor>VirtCompany</vendor>");
    strBuilder.append("<homepage href=\"http://www.virtDesktop.com\"/>");
    strBuilder.append("<description>Virt Desktop</description>");
    strBuilder.append("<icon kind=\"splash\" href=\"gxt/images/default/s.gif\"/>");
    strBuilder.append("</information>");
    strBuilder.append("<security>");
	strBuilder.append("<all-permissions/>");
	strBuilder.append("</security>");
	strBuilder.append("<update check=\"timeout\" policy=\"always\"/>");
    strBuilder.append("<resources>");
    strBuilder.append("<jar  href=\"jar/vnc.jar\"/>");                
    strBuilder.append("<java version=\"1.6+\" java-vm-args=\"-Xnosplash\" href=\"http://java.sun.com/products/autodl/j2se\"/>");                
    strBuilder.append("</resources>");             
    strBuilder.append("<application-desc main-class=\"" + mainClass + "\">");
    strBuilder.append("<argument>DOMAINID</argument>");
    strBuilder.append("<argument>" + domainId + "</argument>");
    strBuilder.append("<argument>USERNAME</argument>");
    strBuilder.append("<argument>" + userName + "</argument>");
    strBuilder.append("<argument>PASSWORD</argument>");
    strBuilder.append("<argument>" + password + "</argument>");
    strBuilder.append("<argument>PROTOCOL</argument>");
    strBuilder.append("<argument>" + protocol + "</argument>");
    strBuilder.append("<argument>HOSTIP</argument>");
    strBuilder.append("<argument>" + hostIp + "</argument>");
    strBuilder.append("<argument>HOSTPORT</argument>");
    strBuilder.append("<argument>" + hostPort + "</argument>");
    strBuilder.append("</application-desc>");
    strBuilder.append("</jnlp>");
    response.getWriter().write(strBuilder.toString());
    response.getWriter().flush();   
%>