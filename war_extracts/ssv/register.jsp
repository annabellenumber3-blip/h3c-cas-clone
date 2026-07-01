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
	String userName = sm.getString("userName");
	String basicInfo = sm.getString("basicInfo");
	String contact = sm.getString("contact");
	String checkCode = sm.getString("checkCode");
	String sex = sm.getString("sex");
	String male = sm.getString("male");
	String female = sm.getString("female");
	String employeeNumber = sm.getString("employeeNumber");
	String department = sm.getString("department");
	String position = sm.getString("position");
	String processing = sm.getString("cloudSafety.processing");
    String success = sm.getString("cloudSafety.success");
    String failed = sm.getString("cloudSafety.failed");
    String previous = sm.getString("previous");
    String nextStep = sm.getString("nextStep");
    String apply = sm.getString("apply");
    String nullTip = sm.getString("nullTip");
    String confirmNotRight = sm.getString("confirmNotRight");
    String emailFormatNot = sm.getString("emailFormatNot");
    String notIsNum = sm.getString("notIsNum");
    String telNotRight = sm.getString("telNotRight");
    String cardNotRight = sm.getString("cardNotRight");
    String nameIsNumber = sm.getString("nameIsNumber");
    String usernameNoChRangefull = sm.getString("usernameNoChRangefull");
    String startSpace = sm.getString("startSpace");
    String endSpace = sm.getString("endSpace");
    String passwordIllegal = sm.getString("passwordIllegal");
    String maxLength32 = sm.getString("maxNameRange", 32);
    String maxLength64 = sm.getString("maxNameRange", 64);
    String maxLength128 = sm.getString("maxNameRange", 128);
    String loginNameRename = sm.getString("errorCode.22");
    String emailRename = sm.getString("errorCode.23");
    String notSpecialCharacter = sm.getString("notSpecialCharacter2","&gt;","&lt;","&");
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
.item .controls input[type="text"],.item .controls input[type="password"] {
	position: relative;
	width: 240px;/*修改问题单 201405230446  修改提示信息显示不全  by s10462 2014/6/7  */
	font-size: 16px;
	float: left;
	display: inline-block;
    color: #525253;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    height:auto;
  	padding: 6px;
    line-height:16px;
    height:36px;/* 修改问题单:201608010538, firfox下, 字体显示不完整*/
}

.step-action input[type="button"],.step-action input[type="submit"] {
	position: relative;
	width: 100px;
	font-size: 14px;
	margin-left:20px;
	padding:3px 5px;
	float: right;
	display: inline-block;
	background: none repeat scroll 0 0 #525252;
	border-style: none none solid;
    border-width: 0;
    color: #FFFFFF;
    cursor: pointer;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
}
.tooltip-inner {
 	max-width:160px;/*修改问题单 201405230446  修改提示信息显示不全   by s10462 2014/6/7  */
 	word-break:unset;
}
</style>
<script type="text/javascript" src="js/login.js"></script>
</head>
<body>
	<input id="nullTip" type="hidden" value="<%=nullTip%>">
    <input id="confirmNotRight" type="hidden" value="<%=confirmNotRight%>">
    <input id="emailFormatNot" type="hidden" value="<%=emailFormatNot%>">
    <input id="notIsNum" type="hidden" value="<%=notIsNum%>">
    <input id="telNotRight" type="hidden" value="<%=telNotRight%>">
    <input id="cardNotRight" type="hidden" value="<%=cardNotRight%>">
    <input id="maxLength32" type="hidden" value="<%=maxLength32%>">
    <input id="maxLength64" type="hidden" value="<%=maxLength64%>">
    <input id="maxLength128" type="hidden" value="<%=maxLength128%>">
    <input id="nameNoChRange" type="hidden" value="<%=usernameNoChRangefull%>">
    <input id="startSpace" type="hidden" value="<%=startSpace%>">
    <input id="endSpace" type="hidden" value="<%=endSpace%>">
    <input id="passwordIllegal" type="hidden" value="<%=passwordIllegal%>">
    <input id="loginNameRename" type="hidden" value="<%=loginNameRename%>">
    <input id="emailRename" type="hidden" value="<%=emailRename%>">
    <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
    
  <div  class="modal" style="width:620px;height:481px;">
    <div class="modal-content">
    	<div class="wizard" style="width: 620px;border:0px;">
			<ol class="wizard-nav" style="margin-left:30px;">
				<li class="step1 current">
					<span> <hr>  1</span>
					<%=basicInfo%>
				</li>
				<li class="step2">
					<span>  2</span>
					<%=contact %>
				</li>
			</ol>
			<div class="wizard-content" style="width: 620px; height: 380px;">
				<div class="steps">
					<form id="registerForCompany" class="form form-horizontal">
						<div class="step step-1" style="width: 620px;">
							<div class="step-inner" style="height:300px;">
								<div class="item">
									<div class="control-label">
										<%=loginName %><span style="color: red">*</span>
									</div>
									<div class="controls">
										<input id="loginNameId" type="text"  name="loginName">
									</div>
								</div>
								<div class="item">
									<div class="control-label">
									           <%=loginPwd %><span style="color: red">*</span>
									</div>
									<div class="controls">
										<input id="pwdId" type="password"  name="pwdName">
									</div>
								</div>
								<div class="item">
									<div class="control-label">
									         <%=confirmPwd %><span style="color: red">*</span>
									</div>
									<div class="controls">
										<input id="confirmPwdId" type="password"  name="confirmPwdName">
									</div>
								</div>
								<div class="item">
									<div class="control-label">
									    E-mail<span style="color: red">*</span>
									</div>
									<div class="controls">
										<input id="emailId" type="text" value="" name="mailName">
									</div>
								</div>
								<div class="item">
									<div class="control-label">
									   <%=address %>
									</div>
									<div class="controls">
										<input id="addressId" type="text" value="" name="address">
									</div>
								</div>
							</div>
							<div class="step-action">
								<input class="btn btn-next" type="button" value="<%=nextStep%>" data-dir="next" >
							</div>
						</div>
						<div class="step step-2" style="width: 620px;">
							<div class="step-inner" style="height:300px;">
								<div class="item">
									<div class="control-label">
									         <%=personName %><span style="color: red">*</span>
									</div>
									<div class="controls">
										<input id="userNameId" type="text" value="" name="userName">
									</div>
								</div>
								<div class="item" style="display:none">
									<div class="control-label">
									         <%=sex %><span style="color: red">*</span>
									</div>
									<div class="controls">
										<select id="sexId" name="sex" style="height:36px;width:240px;font-size:15px;">
											<option value="1"  selected="selected"><%=male %></option>
											<option value="0" ><%=female %></option>
										</select>
									</div>
								</div>
								<div class="item">
									<div class="control-label">
									        <%=idNum %>
									</div>
									<div class="controls">
										<input id="certificateNumId" type="text" value="" name="certificateNumName">
									</div>
								</div>
								<div class="item" style="display:none">
									<div class="control-label">
									   <%=department %><span style="color: red">*</span>
									</div>
									<div class="controls">
										<input id="departmentId" type="text" value="" name="department">
									</div>
								</div>
								<div class="item" style="display:none">
									<div class="control-label">
									   <%=position %>
									</div>
									<div class="controls">
										<input id="positionId" type="text" value="" name="position">
									</div>
								</div>
								<div class="item">
									<div class="control-label">
									   <%=tel %>
									</div>
									<div class="controls">
										<input id="phoneId" type="text" value="" name="phoneName">
									</div>
								</div>
							</div>
							<div class="step-action">
								<input class="btn btn-prev" style="float:left;" type="button" value="<%=previous%>" data-dir="prev" >
								<input class="btn btn-primary"  type="button" value="<%=apply %>" data-dir="next" >
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
    </div> 
  </div>
  <script type="text/javascript">
  	$(document).ready(function(){
  		$("#loginNameId").focus();
  		$(".step-action .btn-next").bind("click",nextStep);
  		$(".step-action .btn-prev").bind("click",prevStep);
  		$(".step-action .btn-primary").bind("click",registerApply);
  		$(".xubox_title em").text('<%=userRegister %>');
  		$(".xubox_title em").html('<%=userRegister %>');
  		//第一步
  		$("#loginNameId, #pwdId, #confirmPwdId, #emailId,#addressId").bind("keyup",checkStepOne);
  		$(".step-action .btn-next").bind("keydown", stopTab);  //阻止按tab建进入下一步
  		//修改 201406210183 隐藏性别和部门
  		//$("#userNameId, #sexId, #certificateNumId, #departmentId,#positionId, #phoneId").bind("keyup",checkStepTwo);
  		$("#userNameId,#certificateNumId,#positionId, #phoneId").bind("keyup",checkStepTwo);
  		$(".item").css('margin','20px');
  	});
  	
  	//阻止按tab建进入下一步
  	function stopTab(e) {
  	    console.error(e.keyCode);
  	    if (e.keyCode == 9) {
  	        $("#loginNameId").focus();
  	        return false;
  	    }
  	}
  	
  	function checkStepOne(e){
		var inputId = e.target.id;
		var inputVal = e.target.value;
		var inputObj = $('#'+inputId);
		var mark = true;
		 if(mark&&inputId!="addressId" && mark&&inputId!="loginNameId"){
	   		 mark=checkItemNull(inputObj);
	   	 }
		 if(mark&&inputId=="loginNameId"){
			 mark= regexName(inputObj);
			 if (mark) {
				 mark= checkLen128(inputObj);
			 }
		 }
		 
		 if(mark&&(inputId=="pwdId"||inputId=="confirmPwdId")){
			 mark = checkLen32(inputObj);
		 }
		 if(mark&&inputId=="pwdId"){
			 mark= regexPwd(inputObj);
			 
		 }
		 if(mark&&inputId=="confirmPwdId"){
	   		 mark= checkConfirm(inputObj);
	   	 }
		 if(mark&&inputId=="emailId"){
	   		 mark= regexEmail(inputObj);
	   	 }
		 if(mark&&(inputId=="emailId"||inputId=="addressId")){
			 mark = checkLen64(inputObj);
		 }
		 
		 if(mark&&(inputId=="addressId")){
	         mark = checkXMLReg(inputObj);
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
  	        } else{
  	           return showRightResult(obj);
  	        }
  	}
  	function checkLen32(obj){
  		obj.tooltip('destroy');
  		var len32 = $('#maxLength32').val();
  		 if(obj.val()&&obj.val().length>32){			 
  			 obj.tooltip({
  				   title:len32,
  				   placement:"right",
  				   trigger:"manual"
  			   });
  			   return showWrongResult(obj);
  			}else{
  				return showRightResult(obj);
  			}
  	}
  	function checkLen64(obj){
  		obj.tooltip('destroy');
  		var len64 = $('#maxLength64').val();
  		 if(obj.val()&&obj.val().length>64){			 
  			 obj.tooltip({
  				   title:len64,
  				   placement:"right",
  				   trigger:"manual"
  			   });
  			   return showWrongResult(obj);
  			}else{
  				return showRightResult(obj);
  			}
  	}
	function checkLen128(obj){
  		obj.tooltip('destroy');
  		var len128 = $('#maxLength128').val();
  		 if(obj.val()&&obj.val().length>128){			 
  			 obj.tooltip({
  				   title:len128,
  				   placement:"right",
  				   trigger:"manual"
  			   });
  			   return showWrongResult(obj);
  			}else{
  				return showRightResult(obj);
  			}
  	}
  	function checkItemNull(obj){
  		obj.tooltip('destroy');
		if(obj.val()==""){
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
  	function regexPwd(pwd){
  		pwd.tooltip('destroy');
		if(pwd.val()){
			if($.trim(pwd.val())!=""){
				return showRightResult(pwd);
			}else{
				pwd.tooltip({
					   title:$('#passwordIllegal').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(pwd);
			}
		}
	}
  	function regexName(name){
		var partten = /^[\A-Za-z0-9\u4E00-\u9FA5\uF900-\uFA2D\-\_\.\@\s]*$/;
		var leftS = /^[^\s]\.*/;//检查空白的字符
		var rightS = /\.*[^\s]$/;//检查空白的字符
		name.tooltip('destroy');
		if(name.val() && partten.test(name.val()) && leftS.test(name.val()) && rightS.test(name.val())) {
					return showRightResult(name);
			}else{
				name.tooltip({
					   title:$('#nameNoChRange').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}
		}
  	function checkConfirm(obj){
  		obj.tooltip('destroy');
		if(obj.val()!=$("#pwdId").val()){
			obj.tooltip({
			   title:$('#confirmNotRight').val(),//密码不一致
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(obj);
		}else{
			return showRightResult(obj);
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
  	function checkStepTwo(e){
		var inputId = e.target.id;
		var inputVal = e.target.value;
		var inputObj = $('#'+inputId);
		var mark = true;
		 
		 if(mark&&inputId!="certificateNumId"&&inputId!="phoneId"&&inputId!="positionId"){
	   		 mark=checkItemNull(inputObj);
	   	 }
		 if(mark&&inputId=="userNameId"){
			 showRightResult(inputObj);
			 mark = checkLen32(inputObj);
		 }
		 if(mark&&inputId=="certificateNumId"){
			 showRightResult(inputObj);
	   		 mark= regexCard(inputObj);
	   		if(mark){
				 mark = checkLen32(inputObj);
			 }
	   	 }
		 if(mark&&inputId=="phoneId"){
			 showRightResult(inputObj);
	   		 mark= regexPhone(inputObj);
	   		 if(mark){
				 mark = checkLen32(inputObj);
			 }
	   	 }
		 if(mark&&(inputId=="departmentId"||inputId=="positionId")){
			 mark = checkLen64(inputObj);
		 }
    }
  	function regexNum(obj){
		var partten = /^\d+$/;
		obj.tooltip('destroy');
		if(obj.val()){
			if(partten.test(obj.val())){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#notIsNum').val(),//不为数字
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
  	function regexPhone(obj){
		var phone = obj.val();
		obj.tooltip('destroy');
		if(obj.val()){
			if((phone.length == 11 && /^(1\d{10})$/.test(phone)) || /^(0\d{2,3}-)?(\d{7,8})(-\d{3,})?$/.test(phone) || /^(\d{3,5})$/.test(phone)){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#telNotRight').val(),//号码格式不对
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
  	/** 注册下一步 */
	function nextStep(){
		var nextLeft=parseInt($(".steps").css("left").slice(0,-1))-620;
		if (validInput(1) && nextLeft > -621) {
			var name = $("#loginNameId").val();
			var email = $("#emailId").val();
			$.ajax({
		 		   type: "POST",
		 		   dataType:"json",
		 		   url: "login?way=checkRenameAndemail",
		 		   data:"name=" + encodeURIComponent(encodeURIComponent(name)) + "&email=" + encodeURIComponent(encodeURIComponent(email)),
		 		   success: function(result){
		 			  if (result != null && typeof result != 'undefined') {
			 		    	if (result.success) {
			 		    		$(".steps").animate({left:nextLeft+"px"});
			 					var stepNum=nextLeft/(-620);
			 					$(".wizard ol li:eq("+stepNum+")").addClass("current");
			 		    	} else {
			 		    		if (result.message == 22) {
			 		    			$("#loginNameId").tooltip({
			 						   title:$('#loginNameRename').val(),
			 						   placement:"right",
			 						   trigger:"manual"
			 					   });
			 					   showWrongResult($("#loginNameId"));
			 		    		} else if (result.message == 23) {
			 		    			$("#emailId").tooltip({
				 						   title:$('#emailRename').val(),
				 						   placement:"right",
				 						   trigger:"manual"
				 					   });
				 					showWrongResult($("#emailId"));
			 		    		}
			 		    	}
		 		   		}
		 			}
	 	    });
		
		}
	};
	/** 注册上一步 */
	function prevStep(){
		var left = parseInt($(".steps").css("left").slice(0,-1));
		var prevLeft=parseInt(left)+620;
		$(".steps").animate({left:prevLeft+"px"});
		var stepNum=prevLeft/(-620);
		$(".wizard ol li").removeClass("current");
		$(".wizard ol li:eq("+stepNum+")").addClass("current");
		
	};
 	
	function validInput(stepNum) {
		var flag = true;
		if (stepNum == 1) {
			var obj1=$("#loginNameId, #pwdId, #confirmPwdId, #emailId, #addressId");
			obj1.keyup();
			flag=!obj1.hasClass("wrong-border");
		} else if (stepNum == 2) {
			//修改 201406210183 隐藏性别和部门
			//var obj2=$("#userNameId, #sexId, #certificateNumId, #departmentId, #phoneId");
			var obj2=$("#userNameId, #certificateNumId, #phoneId");
			obj2.keyup();
			flag=!obj2.hasClass("wrong-border");
		}
		return flag;
	}
	
	function registerApply () {
		var flag = validInput(2);
		if (flag) {
			var param = $("#registerForCompany").serialize();
			$.ajax({
				type : "POST",
				dataType : "json",
				url : "login?way=register",
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
				}
			});
		}
	}
	function regexCard(obj){
		var partten = /^[\w\-\.]+$/;
		obj.tooltip('destroy');
		if(obj.val()){
			if(partten.test(obj.val())){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#cardNotRight').val(),//证件号为字母、数字、下划线
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
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