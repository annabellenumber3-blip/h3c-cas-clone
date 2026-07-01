<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String cloudHostBackup = sm.getString("cloudHostBackup");
String confirm = sm.getString("confirm");
String cancel = sm.getString("cancel");
String name = sm.getString("name");
String desc = sm.getString("desc");
String maxLength120 = sm.getString("maxNameRange", 120);
String maxLength128 = sm.getString("maxNameRange", 128);
String nullTip = sm.getString("nullTip");
String usernameNoChRange = sm.getString("usernameNoChRange");
String nameNoChRangeNew = sm.getString("snapshotNoChRange");
String notSpecialCharacter = sm.getString("notSpecialCharacter",">","<");
String cloudBackUpTitle = sm.getString("cloudBackUp");
String replaceWarning = sm.getString("replaceWarning");
String autoReplace = sm.getString("autoReplace");
String autoReplaceDesc = sm.getString("autoReplaceDesc2");
String backUpNameExist = sm.getString("backUpNameExist");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%= cloudHostBackup%></title>
<script type="text/javascript" src="js/addBackup.js"></script>
</head>
<body>
  <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength120" type="hidden" value="<%=maxLength120%>">
  <input id="maxLength128" type="hidden" value="<%=maxLength128%>">
  <input id="nameNoChRange" type="hidden" value="<%=usernameNoChRange%>">
  <input id="nameNoChRangeNew" type="hidden" value="<%=nameNoChRangeNew%>">
  <input id="backUpNameExist" type="hidden" value="<%=backUpNameExist%>">
  <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
  <input id="cloudBackUpTitle" type="hidden" value="<%=cloudBackUpTitle%>">
  <input id="replaceWarning" type="hidden" value="<%=replaceWarning%>">
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-141px;left:50%;margin-left:-250px; font-size:14px;width:500px;height:300px">
      <div class="modal-header" style="cursor:move">
			<h5><%= cloudHostBackup%></h5>
			<div id="modal-close" onclick="closeBackup()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="addSnapshotFormId" class="form form-horizontal" style="border:1px;height:auto" onkeydown='ClearSubmit(event, "submitId")'>
			<div class="item">
				<div class="control-label" style="width:100px">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="backupNameId" type="text"  name="backupName" style="width:240px">
				</div>
			</div>
			<div class="item" >
				<div class="control-label" style="width:100px"><%=desc %></div>
				<div class="controls">
					<textarea id="backupDescId"  name="backupDescName" style="width:240px; resize:none; height:56px;"></textarea>
				</div>
			</div>
			<div class="item">
            	<div class="control-label" style="width:100px;height:100px;">&nbsp;&nbsp;</div>
                <div>
                    <input id="autoReplacementInputId" type="checkbox" checked="checked"><%=autoReplace %>
                </div>
            </div>
            <div class="item">
	          	<span style="color:red"><%=autoReplaceDesc %></span>
	        </div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn btn-primary"  id="submitId" type="button" value="<%=confirm %>" onclick="submitBackup()"> 
					<input class="btn btn-primary"  type="button" value="<%=cancel %>" onclick="closeBackup()">
	        </div>
	        
	        <input type="hidden" id="vmIdhidden">
	        <input type="hidden" id="vmNamehidden">
		</form>
    </div> 
  </div>
 
 <script>
   $(function(){
	   $("#backupNameId").focus();
	   $("#backupNameId, #backupDescId").bind("keyup",checkTitle);
   });
 </script>
</body>
</html>