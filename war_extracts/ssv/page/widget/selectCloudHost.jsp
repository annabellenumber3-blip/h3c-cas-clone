<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String cloudHostList = sm.getString("cloudHostList");
String create = sm.getString("create");
String refresh = sm.getString("refresh");
String delete = sm.getString("delete");
String name = sm.getString("name");
String desc = sm.getString("desc");
String seperate = sm.getString("seperate");
String confirm = sm.getString("confirm");
String cancel = sm.getString("cancel");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=cloudHostList %></title>
</head>
<body>
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-187px;left:50%;margin-left:-275px;width:550px;height:375px;font-size:14px;">
      <div class="modal-header" style="cursor:move" >
				<h5><%=cloudHostList %></h5>
				<div id="modal-close" onclick="closeHostList()"><span class="single-word-icon"></span></div>
	  </div>
	  <div class="modal-content" style="height:294px;overflow:auto">
	        <table id="cloudHostTable" style="height:294px">
	        </table>
	  </div> 
	  
	  <div class="form-actions" style="margin-bottom:0px;padding-left:180px;" >
			<input class="btn"  type="button" value="<%=confirm %>" onclick="submitLoadedToHost()"> 
			<input class="btn"  type="button" value="<%=cancel %>" onclick="closeHostList()">
	  </div>
  </div>
</body>
</html>