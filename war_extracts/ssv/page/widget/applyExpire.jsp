<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	StringManager sm = StringManager.getManager(StringManager.class);
	String confirm = sm.getString("confirm");
	String cancel = sm.getString("cancel");
	String name = sm.getString("name");
	String expireDate = sm.getString("expireDate");
	String applyExpire = sm.getString("applyExpire");
	String datetimepickerJsPath = sm.getString("datetimepickerJsPath");
	String processing = sm.getString("processing");
	String clean = sm.getString("clean");
	String applyReason = sm.getString("applyReason");
	String maxLength = sm.getString("maxLength");
	String nullTip = sm.getString("nullTip");
	String notSpecialCharacter = sm.getString("notSpecialCharacter2",">","<","&");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=applyExpire%></title>
<script type="text/javascript" src="js/addBackup.js"></script>
</head>
<body>
	<input id="applyExpire" type="hidden" value="<%=applyExpire%>">
	<input id="domainId" type="hidden" value="">
	<input id="domainName" type="hidden" value="">
	<input id="maxLength" type="hidden" value="<%=maxLength%>">
	<input id="nullTip" type="hidden" value="<%=nullTip%>">
	<input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
	<input id="expireDateId2" type="hidden" value="">
	<form class="form form-horizontal" style="border: 1px; height: auto">
		<div class="item">
			<div class="control-label" style="width: 100px">
				<%=name%>
			</div>
			<div class="controls">
				<input id="nameid" type="text" name="name" style="width:240px;height:28px;box-sizing:content-box;padding:7px 10px;background-color:#EBEBE4;color:#000;" disabled="disabled">
			</div>
		</div>
		<div class="item">
			<div class="control-label" style="width: 100px"><%=applyReason%><span style="color:red">*</span></div>
			<div class="controls">
				<textarea id="applyReasonId" style="width: 240px;height:73px;resize:none;" name="instance_name" data-fieldLen="126"></textarea>
			</div>
		</div>
		<div class="item">
			<div class="control-label" style="width: 100px"><%=expireDate%></div>
			<div class="controls">
				<input id="expireDateId"  style="border:1px solid #0081c2;width:240px;height:28px;box-sizing:content-box;padding:7px 10px;" readonly="readonly">
				<input class="btn btn-primary" type="button" value="<%=clean%>" onclick="cleanDate()">
			</div>
		</div>
		<div class="form-actions" style="margin-bottom: 0px; padding-left: 180px">
			<input class="btn btn-primary" type="button" value="<%=confirm%>" onclick="saveExpireDate()">
			<input class="btn btn-primary" type="button" value="<%=cancel%>" onclick="mylayer.close()">
		</div>
	</form>
<script>
var expiredateTimePicker = $('#expireDateId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d',minDate:'today',timepicker:false,onShow:setMinDate,closeOnDateSelect:true});
function cleanDate() {
	$('#expireDateId').val('');
}

//设置延期时间最小值为当前的到期时间
function setMinDate() {
	if ($('#expireDateId2').val() != "") {
		this.setOptions({minDate:$('#expireDateId2').val(),formatDate:'Y-m-d'});
	}
};

function checkReason(){
	var reason = $("#applyReasonId");
	var mark = true;
   	 if(mark){
   		 mark=checkItemNull(reason);
   	 }
   	 if(mark){
   		 mark= checkMaxLength(reason);
   	 }
   	 //修改问题单201406040659 解决<>字符报错的问题 by s10462 2014/6/25
   	 if(mark){
   		mark= checkXMLReg(reason);
   	 }
   	return mark;
}

function checkItemNull(obj){

	obj.tooltip('destroy');
	if($.trim(obj.val())==""){
		obj.tooltip({
		   title:$('#nullTip').val(),
		   placement:"right",
		   trigger:"manual"
	   });
	   return showWrongResult(obj);
	}else{
		return showRightResult(obj);
	}
}

function checkMaxLength(hasMaxLength){
	hasMaxLength.tooltip('destroy');
	var max=hasMaxLength.attr("data-fieldLen");
	var titleContent = $('#maxLength').val()+max;
	 if(hasMaxLength.val()&&hasMaxLength.val().length>max){
		 
		 hasMaxLength.tooltip({
			   title:titleContent,
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(hasMaxLength);
		}else{
			return showRightResult(hasMaxLength);
		}
}
function checkXMLReg(obj){
	obj.tooltip('destroy');
	var titleContent = $('#notSpecialCharacter').val();
	 if(obj.val().indexOf('<') > -1 || obj.val().indexOf('>') > -1||obj.val().indexOf('&') > -1){
		 obj.tooltip({
			   title:titleContent,
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(obj);
		}else{
			return showRightResult(obj);
		}
}
function saveExpireDate() {
	var flag = checkReason();
	if (!flag) {
		return;
	}
	var xml = '';
	xml += "<vmWorkflow>";
	xml += "<domainId>" + $("#domainId").val() + "</domainId>";
	xml += "<domainName>" + $("#domainName").val() + "</domainName>";
	xml += "<title>" + $("#nameid").val()+ "</title>";
	xml += "<expireDate>" + $('#expireDateId').val() + "</expireDate>";
	xml += "<applyReason>" + $("#applyReasonId").val()+ "</applyReason>";
	xml += "</vmWorkflow>";
	//修改问题单201406040659 解决%字符报错的问题 by s10462 2014/6/25
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "servlet/vmList?way=saveExpireDate",
		data : "xml=" + encodeURIComponent(encodeURIComponent(xml)),
		beforeSend : function(xhr) {
			showWait("<%=processing%>",999999);
		},
		success : function(result) {
			hideWait();
			if (result != null && typeof result != 'undefined') {
				if (result.success) {
					$("#my-instances").datagrid('reload');
					mylayer.close();
					$.messager.show({
						title : result.title,
						msg : result.message,
						showType : 'show'
					});
				} else {
				  $.messager.alert(result.title, result.message ,'error');
				}
			} 
		},
		error : function() {
			hideWait();
		}
	});
}
</script>
</body>
</html>