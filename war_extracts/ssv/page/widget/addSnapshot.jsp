<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String addSnapshot = sm.getString("addSnapshot");
String snapshotTip = sm.getString("snapshotTip");
String confirm = sm.getString("confirm");
String cancel = sm.getString("cancel");
String name = sm.getString("name");
String desc = sm.getString("desc");
String maxLength100 = sm.getString("maxNameRange", 100);
String maxLength120 = sm.getString("maxNameRange", 120);
String nullTip = sm.getString("nullTip");
String snapshotNoChRange = sm.getString("snapshotNoChRange");
String notSpecialCharacter = sm.getString("notSpecialCharacter",">","<");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=addSnapshot %></title>
<script type="text/javascript" src="js/addSnapshot.js"></script>
</head>
<body>
<input id="nullTip" type="hidden" value="<%=nullTip%>">
<input id="maxLength100" type="hidden" value="<%=maxLength100%>">
<input id="maxLength120" type="hidden" value="<%=maxLength120%>">
<input id="snapshotNoChRange" type="hidden" value="<%=snapshotNoChRange%>">
 <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
  <div  class="modal" style="position:relative;width:500px;height:auto" id="modal">
      <div class="modal-header" style="cursor:move" >
			<h5><%=addSnapshot %></h5>
			<div id="modal-close" onclick="closeAddSnapshot()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="addSnapshotFormId" class="form form-horizontal" style="border:1px;height:auto" onkeydown='ClearSubmit(event, "submitId")'>
			<div class="item">
				<div class="control-label" style="width:100px">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="snapshotNameId" type="text"  name="snapshotName" style="width:250px">
				</div>
			</div>
			<div class="item" >
				<div class="control-label" style="width:100px"><%=desc %></div>
				<div class="controls" style="overflow-x:auto">
					<textarea id="snapshotDescId"  name="snapshotDescName" style="width:250px;resize:none"></textarea>
				</div>
			</div>
			<div class="item" style="height:100px;padding-left:50px">
				            <%=snapshotTip %>
		    </div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn btn-primary"  id="submitId" type="button" value="<%=confirm %>" onclick="submitAddSnapshot()"> 
					<input class="btn btn-primary"  type="button" value="<%=cancel %>" onclick="closeAddSnapshot()">
	        </div>
		</form>
    </div> 
  </div>
  <script>
   $(function(){
	   $("#snapshotNameId").focus();
	   $("#snapshotNameId, #snapshotDescId").bind("keyup",checkTitle);
   });
 </script>
</body>
</html>