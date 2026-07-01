<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String selectIp = sm.getString("selectIp");
String confirm = sm.getString("confirm");
String cancel = sm.getString("cancel");
String ipAddr = sm.getString("ipAddr");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%= selectIp%></title>
 <style type="text/css">
 .form .item {
    margin: 12px auto;
}
.run-instances .control-label {
    color: #666666;
    line-height: 41px;
}
.form-horizontal .control-label {
    float: left;
    font-size: 16px;
    line-height: 35px;
    text-align: left;
    vertical-align: middle;
    width: 130px;
    margin-left: 50px;
}
.form-horizontal .controls {
    margin-left: 150px;
    min-height: 35px;
}
.run-instances .controls input[type="text"],.run-instances .controls textarea{
    border: 2px solid #CCCCCC;
    border-radius: 4px 4px 4px 4px;
    margin-right: 10px;
    padding: 9px;
    vertical-align: middle;
    width: 260px;
}
.run-instances .controls textarea{
	resize:none;
}
input[type="radio"], input[type="checkbox"] {
    cursor: pointer;
    line-height: normal;
    margin: 4px 4px 0 0;
    padding: 0;
}
.run-instances .controls label.inline {
    display: inline-block;
    line-height: 35px;
    margin: 0;
    padding-right: 10px;
    vertical-align: middle;
    font-size:14px;
}
.form-actions {
	border-top: 1px solid #ccc;
	padding: 10px 20px;
	background: #eee;
}
 </style>
</head>
<body>
  <input type="hidden" id="rowid" />
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-86px;left:50%;margin-left:-150px;font-size:14px;width:300px;height:172px">
      <div class="modal-header" style="cursor:move" >
			<h5><%=selectIp %></h5>
			<div id="modal-close" onclick="closeLayer()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="addSnapshotFormId" class="form form-horizontal" style="border:1px;height:200px">
			<div class="item">
				<div class="control-label" style="width:60px;">
					<%=ipAddr %><span style="color: red">*</span>
				</div>
				<div class="controls" style="margin-left:100px">
				    <select id="ipSelect" style="width:150px">
				    
				    </select>
				</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:80px" >
					<input class="btn btn-primary"  type="button" value="<%=confirm %>" onclick="selectIp()"> 
					<input class="btn btn-primary"  type="button" value="<%=cancel %>" onclick="closeLayer()">
	        </div>
		</form>
    </div> 
  </div>
  <script>
  //选择IP确定按钮单击事件
  function selectIp() {
  	mstscIp($("#ipSelect").val(), $("#rowid").val());
  	$("#windowOverId").html("").hide();
  }
  </script>
</body>
</html>