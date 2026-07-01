<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	StringManager sm = StringManager.getManager(StringManager.class);
	
	String userRegister = sm.getString("userRegister");
	String loginName = sm.getString("loginName");
	String loginPwd = sm.getString("loginPwd");
	String confirmPwd = sm.getString("confirmPwd");
	String personName = sm.getString("personName");
	String tel = sm.getString("tel");
	String idNum = sm.getString("idNum");
	String address = sm.getString("address");
	String register = sm.getString("register");
	String submit = sm.getString("cloudSafety.confirm");
	String cancel = sm.getString("cloudSafety.cancel");
	String processing = sm.getString("cloudSafety.processing");
	String success = sm.getString("cloudSafety.success");
	String failed = sm.getString("cloudSafety.failed");
	String forgetPassword = sm.getString("forgetPassword");
	String nullTip = sm.getString("nullTip");
	String confirmNotRight = sm.getString("confirmNotRight");
    String emailFormatNot = sm.getString("emailFormatNot");
	String nameIsNumber = sm.getString("nameIsNumber");
    String nameNoChRange = sm.getString("nameNoChRange");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=userRegister %></title>
<link href="css/ssvcss.css" type="text/css" rel="stylesheet">
 <link href="css/themes/bootstrap/easyui.css" type="text/css" rel="stylesheet">
 <link href="css/colorblue.css" type="text/css" rel="stylesheet">
<style type="text/css">
body {
	background-color: #FFFFFF;
	padding: 0;
	margin: 0;
	font-size: 100%;
	font-family: "Microsoft Yahei", "微软雅黑", serif;
}

form {
	width: 100%;
	height: 100%;
	float: left;
	display: inline-block;
}
.item .controls  input[type="text"],.item .controls  input[type="password"] {
	position: relative;
	width: 290px;
	font-size: 16px;
	float: left;
	display: inline-block;
    color: #525253;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
  	height:auto;
  	padding: 6px;
    line-height:16px;
}
.item .form-actions input[type="button"],.item .form-actions  input[type="submit"] {
	position: relative;
	width: 100px;
	font-size: 14px;
	margin-left:20px;
	padding:3px 5px;
	float: center;
	display: inline-block;
	background: none repeat scroll 0 0 #FFFFFF;
	border-style: none none solid;
    border-width: 0;
    color: #FFFFFF;
    cursor: pointer;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
}
</style>
</head>
<body>
	<input id="nullTip" type="hidden" value="<%=nullTip%>">
	<input id="emailFormatNot" type="hidden" value="<%=emailFormatNot%>">
	<input id="nameIsNumber" type="hidden" value="<%=nameIsNumber%>">
    <input id="nameNoChRange" type="hidden" value="<%=nameNoChRange%>">
  <div  class="modal" style="width:500px;height:150px">
    <div class="modal-content">
		<form id="forgetFormId" class="form form-horizontal" style="border:1px">
			<div class="item">
				<div class="control-label">
					<%=loginName %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="loginNameId" type="text"  name="loginName" style="width:250px">
				</div>
			</div>
			<div class="item">
				<div class="control-label">
				    E-mail<span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="emailId" type="text" value="" name="mailName" style="width:250px">
				</div>
			</div>
			<div class="item">
				<div class="form-actions" style="margin-bottom:0px;padding-left:160px;overflow:hidden;" >
					<input  class="btn"  id="submitId" type="button" value="<%=submit%>" onclick="submitForgetpassword()">
					<input  class="btn"  id="cancelId" type="button" value="<%=cancel%>" onclick="closeForgetPassword()">
				</div>
			</div>
		</form>
    </div> 
  </div>
  <script type="text/javascript">
  $(document).ready(function(){
	  $("#loginNameId").focus();
	  $(".xubox_title em").text('<%=forgetPassword %>');
	  $(".xubox_title em").html('<%=forgetPassword %>');
	  $("#loginNameId, #emailId").bind("keyup",checkInfo);
	});
  function checkInfo(e){
    var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="loginNameId"){
		 mark= regexName(inputObj);
	 }
	 if(mark&&inputId=="emailId"){
   		 mark= regexEmail(inputObj);
   	 }
  }
   function closeForgetPassword () {
	   layer.close(index);
		$("#my-instances").datagrid('reload');
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
   function regexName(name){
		var partten = /^[\A-Za-z0-9\u4E00-\u9FA5\uF900-\uFA2D\-\_\.\@]*$/;
		name.tooltip('destroy');
		if(name.val()){
			if(partten.test(name.val())){
				if(name.val().substring(0,1)=="-"||name.val().substring(0,1)=="."){
					name.tooltip({
						   title:$('#nameNoChRange').val(),
						   placement:"right",
						   trigger:"manual"
					   });
					return showWrongResult(name);
				}else{
					return showRightResult(name);
				}
			}else{
				name.tooltip({
					   title:$('#nameNoChRange').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}
		}
	}
	
   function regexEmail(obj){
		var partten = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
		obj.tooltip('destroy');
		if(obj.val()){
			if(partten.test(obj.val())){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#emailFormatNot').val(),//邮件格式不符
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
   function submitForgetpassword() {
	   var flag = true;
	   var obj1=$("#loginNameId, #emailId");
		obj1.keyup();
		flag=!obj1.hasClass("wrong-border");
		if (flag) {
			var param = $("#forgetFormId").serialize();
			$("#submitId").addClass("btn-forbidden");
			$.ajax({
				type : "POST",
				dataType : "json",
				url : "login?way=forgetPassword",
				data : param,
				beforeSend : function(xhr) {
					 showWait("<%=processing%>", 999999999);
				},
				success : function(result) {
					hideWait();
					$("#submitId").removeClass("btn-forbidden");
					$("#my-instances").datagrid('reload');
					var state = result.state;
					if (state == "1") {
						layer.close(index);
						$(".window-overlay").css("display", "none");
						$.messager.show({
							title : '<%=success%>',
							msg : result.message,
							showType : 'show'
						});
					} else {
						$.messager.show({
							title : '<%=failed%>',
							msg : result.message,
							showType : 'show'
						});
					}
				},
				error : function() {
					hideWait();
					$("#submitId").removeClass("btn-forbidden");
				}
			});
		}
   }
   function showWrongResult(obj){
		obj.parents(".item").find(".control-label").addClass("wrong-word-color");
		obj.addClass("wrong-border");
		obj.tooltip('show');
		return false;
	}
	function showRightResult(obj){
		obj.parents(".item").find(".control-label").removeClass("wrong-word-color");
		obj.removeClass("wrong-border");
		obj.tooltip('destroy');
		return true;
	}
  </script>
</body>
</html>