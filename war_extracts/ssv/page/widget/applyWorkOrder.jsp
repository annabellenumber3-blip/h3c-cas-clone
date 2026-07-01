<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String capacity = sm.getString("capacity");
String cancel = sm.getString("cancel");
String name = sm.getString("name");
String confirm = sm.getString("confirm");
String newWorkOrder = sm.getString("newWorkOrder");
String workOrderTitle = sm.getString("workOrderTitle");
String workOrderContent = sm.getString("workOrderContent");
String nullTip = sm.getString("nullTip");
String maxLength20 = sm.getString("maxNameRange", 20);
String maxLength140 = sm.getString("maxNameRange", 140);
String notSpecialCharacter = sm.getString("notSpecialCharacter",">","<");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%= newWorkOrder%></title>
<style type="text/css">
.form-horizontal .controls {
    margin-left: 110px;
    min-height: 35px;
}
</style>
</head>
<body>
 <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength20" type="hidden" value="<%=maxLength20%>">
  <input id="maxLength140" type="hidden" value="<%=maxLength140%>">
  <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-253px;left:50%;margin-left:-350px;font-size:14px;width:700px; height: auto;">
      <div class="modal-header"  style="cursor:move" >
			<h5><%= newWorkOrder%></h5>
			<div id="modal-close" onclick="closeWorkOrder()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="applyWorkOrderFormId" class="form form-horizontal" style="border:1px;height:auto;" onkeydown='ClearSubmit(event, "submitId")'>
			<div class="item">
				<div class="control-label" style="width:100px">
					<%=workOrderTitle %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="titleInputId" type="text"  name="title" style="width:250px">
				</div>
			</div>
			<div class="item" >
				<div class="control-label" style="width:100px"><%=workOrderContent%><span style="color: red">*</span></div>
				<div class="controls">
				   <textarea id="contentId" rows="10" style="width:450px; resize:none" name="content"></textarea>
				</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:250px" >
					<input class="btn"  id="submitId" type="button" value="<%=confirm %>" onclick="submitApply()"> 
					<input class="btn"  type="button" value="<%=cancel %>" onclick="closeWorkOrder()">
	        </div>
		</form>
    </div> 
  </div>
 <script type="text/javascript" src="js/workorder.js"></script>	
 <script>
   $(function(){
	   $("#titleInputId").focus();
	   $("#titleInputId,#contentId").bind("keyup",checkTitle);
	   
   });
 </script>
</body>
</html>