<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String capacity = sm.getString("capacity");
String cancel = sm.getString("cancel");
String name = sm.getString("name");
String apply = sm.getString("apply");
String applyDisk = sm.getString("applyDisk");
String maxLength64 = sm.getString("maxNameRange", 64);
String maxNumber1024 = sm.getString("maxNumber", 1024);
String minNumber1 = sm.getString("minNumber" ,1);
String nullTip = sm.getString("nullTip");
String nameIsNumber = sm.getString("nameIsNumber");
String nameNoChRange = sm.getString("nameNoChRange");
String nameNoChRangeNew = sm.getString("nameNoChRangeNew");
String cloudDiskNameExist = sm.getString("cloudDiskNameExist");
String notIsPositivNum = sm.getString("notIsPositivNum");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%= applyDisk%></title>
</head>
<body>
 <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength" type="hidden" value="<%=maxLength64%>">
  <input id="maxNumber1024" type="hidden" value="<%=maxNumber1024%>">
  <input id="minNumber1" type="hidden" value="<%=minNumber1%>">
  <input id="nameIsNumber" type="hidden" value="<%=nameIsNumber%>">
   <input id="nameNoChRange" type="hidden" value="<%=nameNoChRange%>">
   <input id="nameNoChRangeNew" type="hidden" value="<%=nameNoChRangeNew%>">
   <input id="nameExistTip" type="hidden" value="<%=cloudDiskNameExist%>">
   <input id="notIsPositivNum" type="hidden" value="<%=notIsPositivNum %>">
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-125px;left:50%;margin-left:-250px;font-size:14px;width:500px;height:250px">
      <div class="modal-header"  style="cursor:move" >
			<h5><%= applyDisk%></h5>
			<div id="modal-close" onclick="closeApplyDisk()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="applyDiskFormId" class="form form-horizontal" style="border:1px;height:300px" onkeydown='ClearSubmit(event, "submitId")'>
			<div class="item">
				<div class="control-label" style="width:100px">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls" >
					<input id="nameInputId" type="text"  name="inputName" style="width:240px">
				</div>
			</div>
			<div class="item" >
				<div class="control-label" style="width:100px">
				    <%=capacity %><span style="color: red">*</span>
				</div>
				<div class="controls">
				    <input id="capacityInputId" class="easyui-numberspinner" data-options="min:1,max:1024" 
				      style="width:262px;height:36px" value=1></input>&nbsp;GB
				</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn"  id="submitId" type="button" value="<%=apply %>" onclick="submitApply()"> 
					<input class="btn"  type="button" value="<%=cancel %>" onclick="closeApplyDisk()">
	        </div>
		</form>
    </div> 
  </div>
 <script type="text/javascript" src="js/applyDisk.js"></script>
 <script>
   $(function(){
	  $("#capacityInputId").numberspinner({
		   onSpinUp:function(){
			   showRightResult($(this));
		   },
		   onSpinDown:function() {
			   showRightResult($(this));
		   }
	   }); 
	   $("#nameInputId").bind("keyup",checkNameVal);
	   $("#capacityInputId").bind("keyup",checkNumber);
	   $("#capacityInputId").bind("blur",checkNumber);
   });
   
 </script>
</body>
</html>