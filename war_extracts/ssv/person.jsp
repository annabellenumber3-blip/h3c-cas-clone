<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);

String personalSetDesc = sm.getString("personalSetDesc");
String personalInfo = sm.getString("personalInfo");
String myHead = sm.getString("myHead");
String modifyHead = sm.getString("modifyHead");
String save = sm.getString("save");
String reset = sm.getString("reset");
String personName = sm.getString("personName");
String modifyPwd =  sm.getString("modifyPwd");
String oldPwd = sm.getString("oldPwd");
String newPwd = sm.getString("newPwd");
String newPwdConfirm = sm.getString("newPwdConfirm");
String dept = sm.getString("dept");
String position = sm.getString("position");
String tel = sm.getString("tel");
String idNum = sm.getString("idNum");
String address = sm.getString("address");
String alarmSeting = sm.getString("alarmSeting");
String monitorMetric = sm.getString("monitorMetric");
String cpuAndMemory = sm.getString("cpuAndMemory");
String moreRate = sm.getString("moreRate");
String lastTime = sm.getString("lastTime");
String checkInterval = sm.getString("checkInterval");
String alarmNotice = sm.getString("alarmNotice");
String Interface = sm.getString("interface");
String shortMsg = sm.getString("shortMsg");
String minute = sm.getString("minute");
String otherSet = sm.getString("otherSet");
String diskCapacity = sm.getString("diskCapacity");
String capacityMore = sm.getString("capacityMore");
String processing= sm.getString("processing");
String personalSetting = sm.getString("personalSetting");

String operLog = sm.getString("operLog");
String logDesc = sm.getString("logDesc");
String operResult = sm.getString("operResult");
String all = sm.getString("all");
String success = sm.getString("success");
String fail = sm.getString("fail");
String startTime = sm.getString("startTime");
String endTime = sm.getString("endTime");
String query = sm.getString("query");
String oper = sm.getString("oper");
String memory = sm.getString("memory");
String userName = sm.getString("userName");
String timeout = sm.getString("timeout");
String nullTip = sm.getString("nullTip");
String confirmNotRight = sm.getString("confirmNotRight");
String emailFormatNot = sm.getString("emailFormatNot");
String notIsPositivNum = sm.getString("notIsPositivNum");
String telNotRight = sm.getString("telNotRight");
String cardNotRight = sm.getString("cardNotRight");
String lengthNotRight = sm.getString("maxNameRange", "4");
String passwordNotSame = sm.getString("passwordNotSame");
String oldPasswordWrong = sm.getString("errorCode.301");
Object loginInfo=request.getSession().getAttribute("loginInfo");
String maxLength32 = sm.getString("maxNameRange", "32");
String maxLength128 = sm.getString("maxNameRange", "128");
String miniNumber = sm.getString("miniNumber","1");
String nextLoginItWorks = sm.getString("nextLoginItWorks");
String tips = sm.getString("tips");
String notSpecialCharacter = sm.getString("notSpecialCharacter2",">","<","&");
String emailRename = sm.getString("errorCode.23");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

</head>
<body style=" margin = 0;padding:0;">
	<input id="nullTip" type="hidden" value="<%=nullTip%>">
	<input id="confirmNotRight" type="hidden" value="<%=confirmNotRight%>">
	<input id="emailFormatNot" type="hidden" value="<%=emailFormatNot%>">
	<input id="notIsPositivNum" type="hidden" value="<%=notIsPositivNum%>">
	<input id="telNotRight" type="hidden" value="<%=telNotRight%>">
	<input id="cardNotRight" type="hidden" value="<%=cardNotRight%>">
	<input id="lengthNotRight" type="hidden" value="<%=lengthNotRight%>">
	<input id="passwordNotRight" type="hidden" value="<%=oldPasswordWrong%>">
	<input id="maxLength32" type="hidden" value="<%=maxLength32%>">
    <input id="maxLength128" type="hidden" value="<%=maxLength128%>">
    <input id="miniNumber" type="hidden" value="<%=miniNumber%>">
    <input id="passwordNotSame" type="hidden" value="<%=passwordNotSame%>">
    <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
    <input id="emailRename" type="hidden" value="<%=emailRename%>">
 	<div class="wrapper page adapter " id="specialPage">
			<div class="page-intro">
				<h1><%=personalSetting %></h1>
				<p class="lead">
                    <%=personalSetDesc %>
				</p>
			</div>
				<div id="toolbar" style="font-size:14px;">
					<a href="javascript:void(0)" class="tab-item current"><span class="wordIcon">m</span><%=personalInfo %></a>
<%-- 					<a href="javascript:void(0)" class="tab-item" ><span class="wordIcon">]</span><%=alarmSeting %></a> --%>
					<a href="javascript:void(0)" class="tab-item" ><span class="wordIcon">#</span><%=otherSet %></a>
				</div>
				<div id="personInfoId" title="<%=personalInfo %>" style="padding: 10px 10px 30px 10px;font-size:16px">
					   <div style="border:0 solid;width:30%;float:left;margin-top:50px;">
					   	   <div style="width:100%;margin:0 auto;">
					   	   		<img id="image" alt="<%=myHead %>" src="icons/portrait.png" style="width:150px;height:150px;margin-left:150px;"/>
					   	   </div>
					       <div id="upload" style="margin-left:153px;margin-top:10px; cursor:pointer !important;line-height:30px;"><%=modifyHead %></div>
					   </div>
					   <div style="float:left;border:0 solid;display:inline;width:70%">
					     <form id="registerFormId" class="form form-horizontal" >
							<div class="item">
								<div class="control-label">
									 <%=userName %><span style="color: red">*</span>
								</div>
								<div class="controls" >
									<input style="width:400px;background-color:#EBEBE4;color:#000;" id="loginNameId" type="text"  name="loginName" disabled="disabled">
								</div>
							</div>
							<div class="item">
								<div class="control-label">
									<%=personName %><span style="color: red">*</span>
								</div>
								<div class="controls">
									<input style="width:400px" id="userNameId" type="text"  name="userName">
								</div>
							</div>
							<div class="item">
								<div class="control-label">
								    <%=modifyPwd %>
								</div>
								<div class="controls">
									<div class="toggle toggle-cpu toggle-off" style="margin-top:10px;">
										<label class="toggle-radio" style="height: 24px;"></label>
										<label class="toggle-radio" style="height: 24px;"></label>
									</div>
									<input style="min-height:35px;display:none;" id="editpwdId" type="checkbox"  name="editPwd" onclick="checkPwd(this)">
								</div>
							</div>
							<div id="oldpwdDiv" class="item" style="display:none">
								<div class="control-label">
								   <%=oldPwd %><span style="color: red">*</span>
								</div>
								<div class="controls">
									<input style="width:400px" id="oldpwdId" type="password"  name="pwdName">
								</div>
							</div>
							<div id="newpwdDiv" class="item" style="display:none">
								<div class="control-label">
								  <%=newPwd %><span style="color: red">*</span>
								</div>
								<div class="controls">
									<input style="width:400px" id="newpwdId" type="password"  name="pwdName">
								</div>
							</div>
							<div id="confirmpwdDiv" class="item" style="display:none">
								<div class="control-label">
								  <%=newPwdConfirm %><span style="color: red">*</span>
								</div>
								<div class="controls">
									<input style="width:400px" id="confirmPwdId" type="password"  name="confirmPwdName">
								</div>
							</div>
							<div class="item">
								<div class="control-label">
								    E-mail<span style="color: red">*</span>
								</div>
								<div class="controls">
									<input style="width:400px" id="emailId" type="text" value="" name="mailName">
								</div>
							</div>
							<div class="item">
								<div class="control-label">
								  <%=dept %>
								</div>
								<div class="controls">
									<input style="width:400px" id="deptId" type="text" value="" name="deptName">
								</div>
							</div>
							<div class="item" style="display:none">
								<div class="control-label">
								  <%=position %>
								</div>
								<div class="controls">
									<input style="width:400px" id="positionId" type="text" value="" name="positionName" >
								</div>
							</div>
							<div class="item">
								<div class="control-label">
								 <%=tel %>
								</div>
								<div class="controls">
									<input style="width:400px" id="phoneId" type="text" value="" name="phoneName">
								</div>
							</div>
							<div class="item">
								<div class="control-label">
							     <%=idNum %>	      
								</div>
								<div class="controls">
									<input style="width:400px" id="certificateNumId" type="text" value="" name="certificateNumName" >
								</div>
							</div>
							<div class="item">
								<div class="control-label">
								 <%=address %>
								</div>
								<div class="controls">
									<input style="width:400px" id="addressId" type="text" value="" name="address">
								</div>
							</div>
							<input type="hidden" id="imageUrl" />
		                  </form>
					</div>
			   	    <div style="margin-left:145px;width:300px;margin-top:50px;" > 
			           <input type="button" class="btn" id="savePersonId" onclick="savePerson()" value="<%=save %>">
			           <input type="reset" class="btn"  onclick="resetPerson()" value="<%=reset %>">
			   	    </div>
				</div>
<%-- 				<div id="alarmSettingId" title="<%=alarmSeting %>" style="padding: 10px;font-size:16px"> --%>
<!--                       <form id="alarmFormId" class="form form-horizontal" > -->
<!-- 							<div id="monitorDiv" class="item"> -->
<!-- 								<div class="control-label"> -->
<%-- 									<%=monitorMetric %> --%>
<!-- 								</div> -->
<!-- 								<div class="controls" > -->
<!-- 									<select id="monitorSelectId" name="monitorSelect" onchange="changeMoinitor(this)" style="font-size:14px;width:80px;height:30px;font-family: 'Microsoft Yahei', '微软雅黑', serif"> -->
<!-- 									   <option value=1>CPU -->
<%-- 									   <option value=2><%=memory %> --%>
<%-- 									   <option value=3><%=diskCapacity %> --%>
<!-- 									</select> -->
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 							<div id="moreRateDiv" class="item"> -->
<!-- 								<div class="control-label"> -->
<%-- 									<%=moreRate %><span style="color: red">*</span> --%>
<!-- 								</div> -->
<!-- 								<div class="controls"> -->
<!-- 								    <input id="moreRateInputId" name="moreRate" class="easyui-numberspinner " data-options="min:1,max:100,required:true" style="width:110px;height:30px;border: 1px #999999 solid;"></input>% -->
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 							<div id="lastTimeDiv" class="item"> -->
<!-- 								<div class="control-label"> -->
<%-- 									<%=lastTime %><span style="color: red">*</span> --%>
<!-- 								</div> -->
<!-- 								<div class="controls"> -->
<%-- 									<input id="lastTimeInputId" style="width:200px" type="text"  name="lastTime">&nbsp;<%=minute %> --%>
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 							<div id="checkIntervalDiv" class="item"> -->
<!-- 								<div class="control-label"> -->
<%-- 									<%=checkInterval %><span style="color: red">*</span> --%>
<!-- 								</div> -->
<!-- 								<div class="controls"> -->
<%-- 									<input id="checkIntervalInputId" style="width:200px" type="text"  name="checkInterval">&nbsp;<%=minute %> --%>
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 							<div id="capacityMoreDiv" class="item" style="display:none">内存使用率 -->
<!-- 								<div class="control-label"> -->
<%-- 									<%=capacityMore %><span style="color: red">*</span> --%>
<!-- 								</div> -->
<!-- 								<div class="controls"> -->
<!-- 								    <input id="capacityMoreInputId" name="capacityMore" class="easyui-numberspinner" data-options="min:1,max:100" style="width:110px;height:28px"></input>% -->
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 							<div class="item"> -->
<!-- 								<div class="control-label"> -->
<%-- 									<%=alarmNotice %><span style="color: red">*</span> --%>
<!-- 								</div> -->
<!-- 								<div class="controls" style="padding-top: 10px;" > -->
<%-- 									<input  id="pageChk" type="checkbox"  name="inter"><%=Interface %> --%>
<!-- 									<input  id="emailChk" type="checkbox"  name="email">E-mail -->
<%-- 									<input  id="messageChk" type="checkbox"  name="message"><span id="messageChkSpan"><%=shortMsg %></span> --%>
<!-- 								</div> -->
<!-- 							</div> -->
<!-- 					</form> -->
<!-- 					<div style="margin-left:145px;text-align:center;width:300px;" >  -->
<%--  					           <input type="button"  class="btn"   onclick="saveUserSetting()" value="<%=save %>"> --%>
<%-- 					           <input type="button"  class="btn"   onclick="resetUserSetting()" value="<%=reset %>"> --%>
<!-- 					</div> -->
<!--                 </div> -->
				<div id="otherSetId" title="<%=otherSet %>" style="padding: 10px 10px 30px 10px;font-size:16px">
				     <form id="otherFormId" class="form form-horizontal" >
							<div class="item">
								<div class="control-label" style="width: 160px" >
									<%=timeout %><span style="color: red">*</span>
								</div>
								<div class="controls" >
									<input id="timeoutInputId" style="width:200px" type="text"  name="timeoutInput">&nbsp;<%=minute %>
								</div>
							</div>
					</form>
<!-- 					修改问题单201405220523  提示闲置时间设置之后重新登录才能生效 by s10462 2014/6/7 -->
					<div style="text-align:center;width:300px;margin:50px 0px 50px 145px;" > 
				       <input type="button" class="btn" id="savePersonSettingId"   onclick="saveOtherUserSetting()" value="<%=save %>">
			           <input type="button" class="btn"   onclick="resetOtherUserSetting()" value="<%=reset %>">
					</div>
					
				</div>
	</div>
<script src="js/cryptoJS.js" type="text/javascript"></script>
<script src="js/mode-ecb.js" type="text/javascript"></script>
<script type="text/javascript" src="js/person.js"></script>
<script type="text/javascript" src="js/ajaxupload.3.5.js"></script>
<script>
    $(document).ready(function(){
    	var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
	    	initUser();
	    	initUpload();
	    	initTabChange();
	    	$("#oldpwdId, #newpwdId, #confirmPwdId").bind("keyup",checkPassword);
	  		$("#loginNameId,#userNameId, #emailId, #deptId, #positionId, #phoneId, #certificateNumId,#addressId").bind("keyup",checkAllInfo);
	  		$("#moreRateInputId, #lastTimeInputId, #checkIntervalInputId,#capacityMoreInputId").bind("keyup",checkSetting);
	  		$("#timeoutInputId").bind("keyup",checkSetting);
// 	  		$("#messageChkSpan").tooltip({
// 				   title:$('#nullTip').val(),
// 				   placement:"right",
// 				   trigger:"manual"
// 			   });
// 	  		$("#messageChkSpan").tooltip('hide');
			var formitems = $("#oldpwdId, #newpwdId, #confirmPwdId,#loginNameId,#userNameId, #emailId, #deptId, #positionId, #phoneId, #certificateNumId,#addressId,#timeoutInputId");
			$(window).bind('resizeEnd', function() {
				formitems.each(function(){
		  	    	    if($(this).hasClass("wrong-border")){
		  	    	    	$(this).keyup();
		  	    	    }
		  	    	});
			});
    	}
    });  
    $(window).resize(function() {
        if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
        }, 500);
    });
  //保存用户信息
    function savePerson() {
    	var flag = false;
    	var obj1=$("#loginNameId,#userNameId, #emailId, #deptId, #positionId, #phoneId, #certificateNumId, #addressId");
    	obj1.keyup();
    	flag=obj1.hasClass("wrong-border");
    	var isEditPwd = false;
    	if($("#editpwdId").attr("checked") == "checked") {
    		var obj2=$("#oldpwdId, #newpwdId, #confirmPwdId");
    		obj2.keyup();
    		flag=flag||obj2.hasClass("wrong-border");
    	    isEditPwd = true;
    	}
    	if (flag) {
    		return false;
    	} else {
    		var oldpwd = encryptByDES($("#oldpwdId").val());
    		var newpwd = encryptByDES($("#confirmPwdId").val());
    		var userName = $("#userNameId").val();
    		var xml = "<user>" +
    		"<loginName>" + $("#loginNameId").val() + "</loginName>" +
    		"<userName>" + $("#userNameId").val() + "</userName>" +
    		"<email>" + $("#emailId").val() + "</email>" +
    		"<dept>" + $("#deptId").val() + "</dept>" +
    		"<position>" + $("#positionId").val() + "</position>" +
    		"<phone>" + $("#phoneId").val() + "</phone>" +
            "<certification>" + $("#certificateNumId").val() + "</certification>"+
            "<address>" + $("#addressId").val() + "</address>";
    		if (isEditPwd) {
    		xml += "<password>" + newpwd + "</password>";
    		}
    		xml += "</user>";
    		$("#savePersonId").addClass("btn-forbidden");
    		$.ajax({
    		type : "POST",
    		dataType : "json",
    		url : "login?way=editUser",
    		data:"xml=" + encodeURIComponent(encodeURIComponent(xml)) + "&oldpwd=" + oldpwd+ "&userName=" + userName,
    		beforeSend : function(xhr) {
    			showWait("<%=processing%>", 999999);
    		},
    		success : function(result) {
    			hideWait();
    			if (result != null && typeof result != 'undefined') {
    				if (result.success) {
    					$.messager.show({
    						title : result.title,
    						msg : result.message,
    						showType : 'show'
    					});
    				} else {
    					if (result.message == 23) {
	 		    			$("#emailId").tooltip({
		 						   title:$('#emailRename').val(),
		 						   placement:"right",
		 						   trigger:"manual"
		 					   });
		 					showWrongResult($("#emailId"));
    					} else {
	    					$.messager.show({
	    						title : result.title,
	    						msg : result.message,
	    						showType : 'show'
	    					});
    					}
    				}
    			}
    			//问题单201703230052    h13338
    			var userName = $("#userNameId").val();
    			$("#loginUserNameId").text(userName);
    			$("#loginUserNameId").attr("title", userName);
    			
    			$("#savePersonId").removeClass("btn-forbidden");
    		},
    		error : function(xhr, textStatus, errorThrown) {
    			hideWait();
    			$("#savePersonId").removeClass("btn-forbidden");
    		}
    		});
    	}
    }
  
  //保存其他设置
    function saveOtherUserSetting() {
    	var flag = false;
    	var timeout = $("#timeoutInputId").val();
    	$("#timeoutInputId").keyup();
    		flag=$("#timeoutInputId").hasClass("wrong-border");
    	if (flag) {
    		return;
    	}
    	$("#savePersonSettingId").addClass("btn-forbidden");
    	$.ajax({
    		type : "GET",
    		dataType : "json",
    		url : "login?way=saveOtherUserSetting",
    		data: "timeout="+timeout,
    		beforeSend : function(xhr) {
    			showWait("<%=processing%>", 999999);
    		},
    		success : function(result) {
    			hideWait();
    			if (typeof result != "undefined") {
    				if (result.success) {
    					$.messager.show({
    						title : result.title,
    						msg : result.message,
    						showType : 'show'
    					});
    					sessionTimeout = parseInt(timeout) * 60 * 1000;
    					restartSessionTimer();
    				} else {
	    					$.messager.show({
	    						title : result.title,
	    						msg : result.message,
	    						showType : 'show'
	    					});
    				}
    			}
    			$("#savePersonSettingId").removeClass("btn-forbidden");
    		},
    		error : function(xhr, textStatus, errorThrown) {
    			hideWait();
    			$("#savePersonSettingId").removceClass("btn-forbidden");
    		}
    	});
    }
</script>
</body>
</html>
