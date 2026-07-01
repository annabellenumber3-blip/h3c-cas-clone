<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	StringManager sm = StringManager.getManager(StringManager.class);
	String title = sm.getString("capacity");
	String workflowId = (String) request.getParameter("workflowId");
	String applyRecordId = (String) request.getParameter("applyRecordId");
	String status = (String) request.getParameter("status");
	Object loginInfo = request.getSession().getAttribute("loginInfo");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script>
	$(document).ready(function(){
		var loginInfo = '<%=loginInfo%>';
		if (loginInfo == 'null') {
			window.location.replace("login.jsp");
		} else {
		    initStepList();
		}
	});  
	function initStepList() {
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "servlet/workflow?way=queryStepRecord",
			data:"workflowId=<%=workflowId%>&applyRecordId=<%=applyRecordId%>",
			success : function(result) {
				if (result && result.rows) {
					var steps = '<li class="current "><span> <hr></span><%=sm.getString("startWorkflow")%></li>';
					var s = 1;
					for(var step in result.rows) {
						//<li class="current step1"><span> <hr>1 </span></li> <li class="step2"><span> <hr> 2 </span></li>
						if (result.rows[step].isHandle) {
							steps += '<li class="current "><span> <hr>' + s + '</span></li>';
						} else {
							steps += '<li ><span> <hr>' + s + '</span></li>';
						}
						s++;
					}
					var status = <%=status%>;
					if (status == 0) {
						steps += '<li><span></span><%=sm.getString("endWorkflot")%></li>';
					} else {	
						steps += '<li class="current "><span></span><%=sm.getString("endWorkflot")%></li>';
					}
					$("#workflowStep").html(steps);
					var wit = 100 / (result.rows.length + 2);
					var hrWidth = 660 * wit / 100 - 15;
					$("#workflowStep > li").css("width", wit + "%");
					$("#workflowStep").find('hr').css("width", hrWidth + "px");
				}
			}
		});
	}
	var workflowPreData={
		url : 'servlet/workflow?way=queryApprovalRecord&workflowId=<%=workflowId%>&applyRecordId=<%=applyRecordId%>',
		singleSelect : true,
		fitColumns:true,
		striped:true,
		onClickRow:function(rowIndex, rowData){
			
		},
		columns : [ [{
			field : 'id',
			title : 'ID',
			width : 0,
			hidden:true
		 }, 
		 {
			title : '<%=sm.getString("handlerOpName")%>',
			field : 'handleOpName',
			width : 50
		 },
		 {
			title : '<%=sm.getString("handleResult")%>',
			field : 'handleResult',
			formatter:showResult,
			width : 50
		 },
		 {
			title : '<%=sm.getString("handleReason")%>',
			field : 'handleReason',
			width : 50
		 },
		 {
			title : '<%=sm.getString("handlerDate")%>',
			field : 'handleDate',
			width : 100
		 }
		] ],
		pagination:false
	};
	function showResult(value,rowData,rowIndex) {
		if (value) {
	    	if (value == 1) {
	    		return '<%=sm.getString("pass")%>';
	    	} else if (value == 2) {
	    		return '<%=sm.getString("refuse")%>';
	    	} else if (value == 3) {
	    		return '<%=sm.getString("trunApprovael")%>';
	    	}
		} else {
			return '<%=sm.getString("pendingApproval")%>';
		}
	};
	$("#table-workflowsStepInfo").datagrid(workflowPreData);
</script>
</head>
<body>
	<div id="modal" class="modal"
		style="position: absolute; top: 30%; margin-top: -125px; left: 50%; margin-left: -250px; font-size: 14px; width: 700px; height: 500px">
		<div class="modal-header" style="cursor: move">
			<h5><%=sm.getString("approvalProcess")%></h5>
			<div id="modal-close" onclick="closeWorkflowInfo()">
				<span class="single-word-icon"></span>
			</div>
		</div>
		<div style="height: 10px"></div>
		<ol class="wizard-nav" id="workflowStep"></ol>
		<div class="wizard-content" style="margin-left: 20px;">
			<div class="modal-content">
				<table id="table-workflowsStepInfo" style="width: 660px; height: 340px;"></table>
			</div>
		</div>
	</div>
</body>
</html>