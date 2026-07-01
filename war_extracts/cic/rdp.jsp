<%@ page contentType = "text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String host = request.getParameter("ip");
	
	response.setContentType("application");
	response.setHeader("Content-Disposition", "attachment; filename=\"desk.rdp\"");
	
    StringBuilder strBuilder = new StringBuilder();
   
	strBuilder.append("full address:s:");                
    strBuilder.append(host);
    strBuilder.append("\r\ndisable themes:i:0");
    strBuilder.append("\r\ndisable wallpaper:i:0");
    strBuilder.append("\r\nallow font smoothing:i:1");
    
    response.getWriter().write(strBuilder.toString());
    response.getWriter().flush();   
%>