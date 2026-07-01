<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String confirm = sm.getString("confirm");
String cancel = sm.getString("cancel");
String name = sm.getString("name");
String desc = sm.getString("desc");
String maxLength64 = sm.getString("maxNameRange", 64);
String maxLength128 = sm.getString("maxNameRange", 128);
String nullTip = sm.getString("nullTip");
String usernameNoChRange = sm.getString("usernameNoChRange");
String nameNoChRangeNew = sm.getString("nameNoChRangeNew");
String notSpecialCharacter = sm.getString("notSpecialCharacter",">","<");
String firewallstrategyexists=sm.getString("firewallstrategyexists");


String firewall = sm.getString("cloudSafety.firewall");
String create = sm.getString("cloudSafety.create");
String description = sm.getString("cloudSafety.description");
String host = sm.getString("cloudSafety.host");
String submit = sm.getString("cloudSafety.confirm");
String close = sm.getString("close");
String processing = sm.getString("cloudSafety.processing");
String success = sm.getString("cloudSafety.success");
String failed = sm.getString("cloudSafety.failed");
String modify = sm.getString("cloudSafety.modify");
String nameIsNumber = sm.getString("nameIsNumber");

%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=create %><%=firewall %></title>
<script type="text/javascript" src="js/addFirewall.js"></script>
</head>
<body>
  <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength64" type="hidden" value="<%=maxLength64%>">
  <input id="maxLength128" type="hidden" value="<%=maxLength128%>">
  <input id="nameNoChRange" type="hidden" value="<%=usernameNoChRange%>">
  <input id="nameNoChRangeNew" type="hidden" value="<%=nameNoChRangeNew%>">
  <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
  <input id="strategyexists" type="hidden" value="<%=firewallstrategyexists%>">
  <input id="nameIsNumber" type="hidden" value="<%=nameIsNumber%>">
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-141px;left:50%;margin-left:-250px; font-size:14px;width:500px;height:300px">
      <div class="modal-header" style="cursor:move">
			<h5 id="title"><%=create %><%=firewall %></h5>
            <h5 id="title2"><%=modify %><%=firewall %></h5>
			<div id="modal-close" onclick="closeFirewall()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="addFwStrategyFormId" class="form form-horizontal" style="border:1px;height:auto">
			<div class="item">
				<div class="control-label" style="width:100px">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="fwStrategyNameId" type="text"  name="fwStrategyName" style="width:240px">
				</div>
			</div>
			<div class="item" >
				<div class="control-label" style="width:100px"><%=desc %></div>
				<div class="controls">
					<textarea id="fwStrategyDescId"  name="fwStrategyDescName" style="width:240px; resize:none; height:56px;"></textarea>
				</div>
			</div>
	         <%-- <div class="item">
	            <div class="control-label" style="width:100px;height:100px;">&nbsp;&nbsp;</div>
	          	<span style="color:red"><%=firewall %></span>
	         </div> --%>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn btn-primary"  type="button" value="<%=confirm %>" onclick="submitFwStrategy()"> 
					<input class="btn btn-primary"  type="button" value="<%=cancel %>" onclick="closeFirewall()">
	        </div>
	        
	        <input type="hidden" id="fwStrategyId">
	        <input id="fwStrategyUserId" type="hidden">
	        <input id="fwStrategyHostName" type="hidden">
		</form>
    </div> 
  </div>
 
 <script>
   $(function(){
	   $("#fwStrategyNameId").focus();
	   $("#fwStrategyNameId, #fwStrategyDescId").bind("keyup",checkTitle);
   });
 </script>
</body>
</html>