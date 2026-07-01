<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String alarmConfig = sm.getString("alarmConfig");
String yes = sm.getString("yes");
String no = sm.getString("no");
String title = sm.getString("name");
String os = sm.getString("os");
String memory = sm.getString("memory");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <script type="text/javascript" src="js/applyAlarmConfig.js"></script>
   <script type="text/javascript" src="js/common.js"></script>
<title><%= alarmConfig%></title>
</head>
<body>
	<input id="strategyId" type="hidden">
	<div id="modal" class="modal" style="position: absolute; top:40%; margin-top:-125px;left:50%;margin-left:-250px;font-size:14px;width:600px;height:430px">
		<div class="modal-header"  style="cursor:move" >
			<h5><%= alarmConfig%></h5>
			<div id="modal-close" onclick="closeConifg()"><span class="single-word-icon"></span></div>
		</div>
	    <div class="modal-content">
			<div style="padding:0 0 5px 10px ; width:550px">
				<table id="my-instances" style="height:340px;width:570px"></table>
			</div>
		
			<div class="form-actions" style="margin-bottom:0px;margin-right:50px;margin-left:180px;padding-left:20px" >
				<input class="btn"  type="button" value="<%=yes %>" onclick="submitConfig()"> 
				<input class="btn"  type="button" value="<%=no %>" onclick="closeConifg()">       
			</div>
		</div> 
	</div>
 <script>
	 $(document).ready(function(){
	       $("#my-instances").datagrid({ 
	           url:'servlet/alarm?way=unselect', 
	           singleSelect:false,
	           fitColumns:true,
	           idField:'id',
	           onLoadSuccess:function(data) {
	        	   $("div.itemtooltip").jtooltip();
	           },
	           columns:[[  
	                   {field:'title',title:'<%=title%>',width:125,formatter:showTitle},
	                   {field:'id',title:'',width:0, hidden:true} ,
	                   {field:'cpu',title:'CPU',width:60}, 
	                   {field:'memory',title:'<%=memory%>',width:100,formatter:showMemory},
	                   {field:'osDesc',title:'<%=os%>',width:230,formatter:showTitle}
	               ]],
	           pagination:false
	       });
	 });
 </script>
</body>
</html>