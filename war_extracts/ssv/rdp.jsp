<%@ page contentType = "text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String host = request.getParameter("ip");

	String redirectClipboard = request.getParameter("enableCb");
	redirectClipboard = redirectClipboard == null ? "1" : redirectClipboard;
	String redirectCom = request.getParameter("enableCom");
	redirectCom = redirectCom == null ? "1" : redirectCom;
	String redirectDrives = request.getParameter("enableDrive");
	redirectDrives = redirectDrives == null ? "1" : redirectDrives;
	String redirectPrinter = request.getParameter("enablePrinter");
	redirectPrinter = redirectPrinter == null ? "1" : redirectPrinter;
	String redirectAudio = request.getParameter("enableAudio");
	redirectAudio = redirectAudio == null ? "1" : redirectAudio;
	String redirectUsb = request.getParameter("enableUsb");
	redirectUsb = (redirectUsb == null || "1".equals(redirectUsb) )? "*" : "";
	String sessionBpp = request.getParameter("sessionBpp");
	sessionBpp = sessionBpp == null ? "32" : sessionBpp;
	
	response.setContentType("application");
	response.setHeader("Content-Disposition", "attachment; filename=\"desk.rdp\"");
	
    StringBuilder strBuilder = new StringBuilder();
   
	strBuilder.append("full address:s:");                
    strBuilder.append(host);    
    strBuilder.append("\r\ndisable themes:i:0");
    strBuilder.append("\r\ndisable wallpaper:i:0");
    strBuilder.append("\r\nallow font smoothing:i:1");
    
    strBuilder.append("\r\nredirectclipboard:i:").append(redirectClipboard);
    strBuilder.append("\r\nredirectcomports:i:").append(redirectCom);
    strBuilder.append("\r\nredirectdrives:i:").append(redirectDrives);
    strBuilder.append("\r\nredirectprinters:i:").append(redirectPrinter);   
    strBuilder.append("\r\naudiocapturemode:i:").append(redirectAudio);
    strBuilder.append("\r\naudiomode:i:").append(redirectAudio.equals("0") ? "1" : "0");    
    strBuilder.append("\r\nusbdevicestoredirect:s:").append(redirectUsb);
    strBuilder.append("\r\nsession bpp:i:").append(sessionBpp);
    response.getWriter().write(strBuilder.toString());
    response.getWriter().flush();   
%>