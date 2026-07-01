<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String cloudHostSnapshot = sm.getString("cloudHostSnapshot");
String create = sm.getString("create");
String restoreNew = sm.getString("restoreNew");
String refresh = sm.getString("refresh");
String delete = sm.getString("delete");
String name = sm.getString("name");
String desc = sm.getString("desc");
String seperate = sm.getString("seperate");
String delSnapshot = sm.getString("delSnapshot");
String restoreSnapshot = sm.getString("restoreSnapshot");
String confrimDelSnapshot = sm.getString("confrimDelSnapshot");
String confrimRestoreSnapshot = sm.getString("confrimRestoreSnapshot");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=cloudHostSnapshot %></title>
 <style type="text/css">
 .form .item {
    margin: 12px auto;
}
.run-instances .control-label {
    color: #666666;
    line-height: 41px;
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
 </style>
 <script src="js/common.js" type="text/javascript"></script>
 <script type="text/javascript" src="js/snapshotTree.js"></script>
</head>
<body>
  <input id="delSnapshot" type="hidden" value="<%=delSnapshot %>">
  <input id="restoreSnapshot" type="hidden" value="<%=restoreSnapshot %>">
  <input id="confrimDelSnapshot" type="hidden" value="<%=confrimDelSnapshot %>">
  <input id="confrimRestoreSnapshot" type="hidden" value="<%=confrimRestoreSnapshot %>">
  <div id="modal" id="snapshotTreeDiv" class="modal"  style="position: absolute; top:50%; margin-top:-300px;left:50%;margin-left:-275px;width:550px;font-size:14px;">
      <div class="modal-header" style="cursor:move" >
				<h5><%=cloudHostSnapshot %></h5>
				<div id="modal-close"><span class="single-word-icon"></span></div>
	  </div>
      <div style="margin: 10px 0;padding-left:40px">
			<a href="javascript:void(0)" class="btn linkbtn" onclick="addSnapshot()"><%=create %></a>
			<a href="javascript:void(0)" class="btn linkbtn" onclick="restoreSnapshot()"><%=restoreNew %></a>
			<a href="javascript:void(0)" class="btn linkbtn" onclick="delSnapshot()"><%=delete %></a>
			<a href="javascript:void(0)" class="btn linkbtn" onclick="refreshSnapshot()"><%=refresh %></a>
	  </div>
	  <div class="modal-content">
	        <div style="overflow:auto">
			  <ul id="tt" style="height:390px"></ul>
	        </div>
			<div style="margin-bottom: 10px;padding:10px;">
				<span style="vertical-align:middle"><%=desc+seperate %></span><span id="descSpan" class="descTooltip" data-ellipsis-len="100" style="display:inline-block;max-width:450px;font-size: 14px;position: relative;overflow: hidden;text-overflow:ellipsis;vertical-align:middle" title=""></span>
			</div>
	  </div> 
  </div>
  <div id="addSnapshotDiv" style="position: absolute;left:0; top:20%;right:0;bottom:0;width:500px;height:auto;margin:auto;font-size:14px;">
	    
  </div> 
  <script>

  
  </script>
</body>
</html>
