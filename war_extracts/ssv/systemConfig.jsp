<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	StringManager sm = StringManager.getManager(StringManager.class);
	
	String systemConfig = sm.getString("systemConfig");
	String casIp = sm.getString("casServerIp");
	String loginName = sm.getString("loginName");
	String loginPwd = sm.getString("loginPwd");
	String submit = sm.getString("cloudSafety.confirm");
	String cancel = sm.getString("cloudSafety.cancel");
	String processing = sm.getString("cloudSafety.processing");
	String success = sm.getString("cloudSafety.success");
	String failed = sm.getString("cloudSafety.failed");
	
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=systemConfig %></title>
<link href="css/ssvcss.css" type="text/css" rel="stylesheet">
<link href="css/themes/bootstrap/easyui.css" type="text/css" rel="stylesheet">
<link href="css/colorblack.css" type="text/css" rel="stylesheet">
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
.item .controls input[type="text"],.item .controls  input[type="password"] {
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
.item .controls input[type="text"]:focus,.item .controls  input[type="password"]:focus {
	position: relative;
	font-size: 16px;
	float: left;
	display: inline-block;
    color: #525253;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    border:#525252 1px solid;
  }
 
 
.item .form-actions input[type="button"], .item .form-actions input[type="submit"] {
	position: relative;
	width: 100px;
	font-size: 14px;
	margin-left:20px;
	padding:3px 5px;
	float: right;
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
  <div  class="modal" style="width:500px;height:200px">
    <div class="modal-content">
		<form id="systemConfigFormId" class="form form-horizontal" style="border:1px">
			<div class="item">
					<div class="control-label">
					    <%=casIp %><span style="color: red">*</span>
					</div>
					<div class="controls">
						<input id="casIpId" type="text" value="" name="casIp" style="width:250px">
					</div>
			</div>
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
				    <%=loginPwd %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="pwdId" type="password" value="" name="password" style="width:250px">
				</div>
			</div>
			<div class="item">
				<div class="form-actions" style="margin-bottom:0px;padding-left:180px;overflow:hidden;" >
					<input  class="btn"  id="cancelId" type="button" value="<%=cancel%>" onclick="closeSystemConfig()">
					<input  class="btn"  id="submitId" type="button" value="<%=submit%>" onclick="submitSystemConfig()">
				</div>
			</div>
		</form>
    </div> 
  </div>
  <script type="text/javascript">
  $(document).ready(function(){
	  $("#casIpId").focus();
	  $(".xubox_title em").text('<%=systemConfig %>');
	  $(".xubox_title em").html('<%=systemConfig %>');
	  $.ajax({
			type : "POST",
			url : "login?way=getSsvConfig",
			dataType : "json",
			beforeSend : function(xhr) {
				// showWait();
			},
			success : function(loginConfig) {
				//hideWait();
				$("#casIpId").val(loginConfig.host);
				$("#loginNameId").val(loginConfig.userName);
				$("#pwdId").val(loginConfig.password);
			},
			error : function(xhr, textStatus, errorThrown) {
				//hideWait();
				$.messager.show({
					title : '<%=failed%>',
					msg : '<%=failed%>',
					showType : 'show'
				});
			}
		});
	});
  
   function closeSystemConfig () {
	   layer.close(index);
   }
   
   function submitSystemConfig() {
	   var flag = true;
	   var ip = $('#casIpId').val();
		if (ip != '') {
	    		var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
	    		if (!reg.test(ip)) {
	    			$("#casIpId").parents(".item").find(".control-label").css("color","#D16E6C");
	    			$("#casIpId").css("border","#D16E6C 2px solid");
	    			flag = false;
	    		} else {
	    			$("#casIpId").parents(".item").find(".control-label").css("color","#666666");
	    			$("#casIpId").css("border","#CCCCCC 2px solid");
	    		}
	    } else {
	    	$("#casIpId").parents(".item").find(".control-label").css("color","#666666");
			$("#casIpId").css("border","#CCCCCC 2px solid");
	    }
	   var loginName = $("#loginNameId").val();
		if (loginName == '') {
			$("#loginNameId").parents(".item").find(".control-label").css("color","#D16E6C");
			$("#loginNameId").css("border","#D16E6C 2px solid");
			flag = false;
		} else {
			$("#loginNameId").parents(".item").find(".control-label").css("color","#666666");
			$("#loginNameId").css("border","#CCCCCC 2px solid");
		}
		var pwdId = $("#pwdId").val();
		if (pwdId == '') {
			$("#pwdId").parents(".item").find(".control-label").css("color","#D16E6C");
			$("#pwdId").css("border","#D16E6C 2px solid");
			flag = false;
		} else {
			$("#pwdId").parents(".item").find(".control-label").css("color","#666666");
			$("#pwdId").css("border","#CCCCCC 2px solid");
		}
		if (flag) {
			var param = $("#systemConfigFormId").serialize();
			$.ajax({
				type : "POST",
				dataType : "json",
				url : "login?way=saveSsvConfig",
				data : param,
				beforeSend : function(xhr) {
					$("<div class=\"datagrid-mask\" style='z-index:1000000000'></div>")
							.css({
								display : "block",
								width : "100%",
								height : $(window).height()
							}).appendTo("body");
					$("<div class=\"datagrid-mask-msg\" style='z-index:1000000000'></div>")
							.html("<%=processing%>").appendTo("body").css({
								display : "block",
								left : ($(document.body).outerWidth(true) - 190) / 2,
								top : ($(window).height() - 45) / 2
							});
				},
				success : function(result) {
					hideWait();
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
				}
			});
		}
   }
   
  </script>
</body>
</html>