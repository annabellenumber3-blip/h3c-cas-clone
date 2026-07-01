<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	/** 多语言资源。 */
	StringManager sm = StringManager.getManager(StringManager.class);
	String workOrder = sm.getString("workOrder");
	String newWorkOrder = sm.getString("newWorkOrder");
	String workOrderMsgDesc = sm.getString("workOrderMsgDesc");
	String tips = sm.getString("tips");
	String leftKey = sm.getString("leftKey");
	String tipsOpeContent = sm.getString("tipsOpeContent");
	String workOrderTitle = sm.getString("workOrderTitle");
	String workOrderContent = sm.getString("workOrderContent");
	String workOrderStatus = sm.getString("workOrderStatus");
	String workOrderCreateTime = sm.getString("workOrderCreateTime");
	String delete = sm.getString("delete");
	String close = sm.getString("close");
	String workOrderStop = sm.getString("workOrderStop");
	String workOrderNoDetail = sm.getString("workOrderNoDetail");
	String workOrderDetail = sm.getString("workOrderDetail");
	String workOrderNoStatus = sm.getString("workOrderNoStatus");
	String oper = sm.getString("oper");
	String workOrderCheckDetail = sm.getString("workOrderCheckDetail");
	String workOrderReply = sm.getString("workOrderReply");
	String deleteWorkOrder = sm.getString("deleteWorkOrder");
	String confirmWorkOrder = sm.getString("confirmWorkOrder");
	String workOrderMsg = sm.getString("workOrderMsg");
	Object loginInfo=request.getSession().getAttribute("loginInfo");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style=" margin:0;padding:0;">
<input type="hidden" id="hidden-deleteWorkOrder" value="<%=deleteWorkOrder%>">
<input type="hidden" id="hidden-confirmWorkOrder" value="<%=confirmWorkOrder%>">
<div class="wrapper page adapter" >
	<div class="page-intro">
		<h1><%=workOrder%></h1>
		<p class="lead"><%=workOrderMsgDesc%></p>
		
	</div>
	<div id="toolbar">
		    <a id="newTickets" href="javascript:void(0)" class="btn linkbtn" onclick="newWorkOrder()"><span class="wordIcon">h</span><%=newWorkOrder%></a>
		    <a id="delTickets" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="stopWorkOrder('delete')"><span class="wordIcon">></span><%=delete%></a>
		    <!-- <a id="delTickets" href="javascript:void(0)" class="btn linkbtn" onclick="stopWorkOrder('stop')"><span class="wordIcon">Y</span><%=close%></a>-->
	</div>
	<div data-options="plain:true" style="padding:30px 0 30px 10px ; width:1100px;">
	   <table id="list"></table>
	</div>
	<div id="windowOverId" class="window-overlay"></div>
		<div id="detailOverId" class="window-overlay">
			<div id="modal" class="modal"
				style="position: absolute; top:50%; margin-top:-225px;left:50%;margin-left:-350px;font-size: 14px; width: 700px; height: 450px;">
				<div class="modal-header" style="cursor: move">
					<h5 id="workOrderTitle"></h5>
					<div id="modal-close" onclick="closeIt()">
						<span class="single-word-icon"></span>
					</div>
				</div>
				<div style="height: 30px"></div>
				<div class="modal-content">
					<form id="applyWorkOrderFormId" class="form form-horizontal"
						style="border: 1px; height: 300px">
						<div class="item">
							<div class="control-label" style="width: 100px"><%=workOrderContent%><span
									style="color: red">&nbsp</span>
							</div>
							<div class="controls">
								<textarea id="contentId" rows="5" style="width: 500px;resize: none;height: 140px;"
									name="content" disabled="disabled"></textarea>
							</div>
						</div>
						<div class="item">
							<div class="control-label" style="width: 100px"><%=workOrderReply%><span
									style="color: red">&nbsp</span>
							</div>
							<div class="controls">
								<textarea id="replyId" rows="5" style="width: 500px;resize: none;height: 140px;"
									name="content" disabled="disabled"></textarea>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		<p class="tips">
		* <%=tips%>：<span class="alert-info">“<%=leftKey%>”</span><%=tipsOpeContent%>
	 </p>
</div>
<script type="text/javascript" src="js/workorder.js"></script>			
<script>
$(document).ready(function(){
	var loginInfo = '<%=loginInfo%>';
	if (loginInfo == 'null') {
		window.location.replace("login.jsp");
	} else {
	    $("#list").datagrid({ 
	        url:'servlet/workOrderServlet?way=list',  
	        singleSelect:true,
	        fitColumns:true,
	        columns:[[ 
	                  {field:'title',title:'<%=workOrderTitle%>',width:180,formatter:showTitle},
	                  {field:'content',title:'<%=workOrderContent%>',width:300,formatter:showTitle},  
	                  {field:'status',title:'<%=workOrderStatus%>',width:100,formatter:showState} ,
	                  {field:'createTimeStr',title:'<%=workOrderCreateTime%>',width:150},
	                  {field:'reply',title:'<%=oper%>',width:70,formatter:showOper}  
	              ]],
	        onClickRow:function(rowIndex, rowData){
	        	$("#delTickets").removeClass("btn-forbidden");
	        },
	        onLoadSuccess:function(data) {
	        	$("div.itemtooltip").jtooltip();
	          	  if (data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
					  $.messager.show({
							title : data.title,
							msg : data.message,
							showType : 'show'
					   });
					   return false;
				  }
	          	$("#delTickets").addClass("btn-forbidden");
	        },
	        pagination:true,
	        pageSize:10,
	        pageList:[10,20,30,40,50]
	    });    
		
	}
}); 
function showState(value,rowData,rowIndex) {
	if (value == 0) {
       return '<img src=icons/default/refuse.png title="<%=workOrderStop%>">';
    } else if (value == 1) {
       return '<img src=icons/default/waiting.png title="<%=workOrderNoDetail%>">';
    } else if (value == 2) {
       return '<img src=icons/default/agree.png title="<%=workOrderDetail%>">';
    } else {
       return '<img src=icons/default/refuse.png title="<%=workOrderNoStatus%>">';
    }
}
function showOper(value,rowData,rowIndex) {
	
	if (value == null||value=="") {
       return '';
    } else {
       return '<a onmouseout="removeUl(this)" onmouseover="addUl(this)" onclick="showDetail('+rowIndex+')" style="color:#3397D3 ; font-size: 12px; text-decoration: underline;"><%=workOrderCheckDetail%></a>';
    }
}
function showDetail(data){
	var list =$("#list");
	list.datagrid("selectRow",data);
	var row = list.datagrid("getSelected");
	$("#workOrderTitle").html("<%=workOrderMsg%>");
	$("#contentId").val(row.content);
	$("#replyId").val(row.reply);
	$("#detailOverId").show();
}
function closeIt(){
	$("#detailOverId").hide();
}
 </script>
</body>
</html>