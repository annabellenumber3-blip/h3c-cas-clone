<%@ page contentType = "text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<%@ page import="com.virtual.common.FuncUtil" %>
<%@ page import="com.virtual.ssv.server.Constant" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String title = sm.getString("loginPageTitle");
     boolean isUnis = FuncUtil.versionFromPath(Constant.UNIS);
     boolean isUniCloud = FuncUtil.versionFromPath(Constant.UNI_CLOUD);
     String userName = sm.getString("userName");
     String password = sm.getString("password");
     String login = sm.getString("login");
     String register = sm.getString("register");
     String processing = sm.getString("processing");
     String forgetPassword = sm.getString("forgetPassword");
     String loginIng = sm.getString("loginIng");
     String cloudConsole = sm.getString("cloudConsole");
	 String success = sm.getString("cloudSafety.success");
	 String failed = sm.getString("cloudSafety.failed");
	 String loginBottomPrompt = sm.getString("loginBottomPrompt","<a href='./chrome_installer.exe' title='" + sm.getString("downLoadChromeTitle") + "'>" + sm.getString("downLoadChrome") + "</a>");
	 String errTitle = sm.getString("nullNameOrPwdTitle");
     String nullLoginInfo = sm.getString("nullNameOrPwd");
     String confirm = sm.getString("confirm");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<title><%=title %></title>
<link href="css/themes/bootstrap/easyui.css" type="text/css" rel="stylesheet">
<link href="css/ssvcss.css" type="text/css" rel="stylesheet">
<link href="css/tooltip.css" type="text/css"  rel="stylesheet">
<link href="css/navtabs.css" type="text/css"  rel="stylesheet">
<link href="css/colorblue.css" type="text/css" rel="stylesheet">
		<%  if (isUnis) { %>
	<style type="text/css">
		body {
			padding: 0;
			margin: 0;
			font-size: 100%;
			font-family: "Microsoft Yahei", "微软雅黑", serif;
			background: url("./icons/default/background_unis.png");
		}
	#copyrightLogo{
		width: 100px;
		height: 40px;
		margin-top: -13px;
	}
	#container{
		position:absolute;
		left : 916px;
		left: -moz-calc( 916px - (1600px - 100%)/2 ) ;
		left: -webkit-calc( 916px - (1600px - 100%)/2 ) ;
		left: calc( 916px - (1600px - 100%)/2 ) ;
		top : 245px;
		top: -moz-calc( 245px - (900px - 100%)/2 ) ;
		top: -webkit-calc( 245px - (900px - 100%)/2 ) ;
		top: calc( 245px - (900px - 100%)/2 ) ;
		height: 68%;
		margin-left: auto;
		margin-right:0;
		min-height:450px;
		-webkit-box-sizing: content-box;
		-moz-box-sizing: content-box;
		box-sizing: content-box;
	}
	#left {
		width: 62%;
		height: auto;
	}
	#copyright {
		text-align: left;
	}
	#footer {
		position:absolute;
		bottom:15px;
		width: 100%;
		height: auto;
		min-width:900px;
		text-align:center;
	}
	</style>
	<% } else if (isUniCloud) { %>
	<style type="text/css">
    		body {
    			padding: 0;
    			margin: 0;
    			font-size: 100%;
    			font-family: "Microsoft Yahei", "微软雅黑", serif;
    			background: url("./icons/default/background_unicloud.jpg");
    		}
    	#copyrightLogo{
    		width: 69px;
    		height: 18px;
    	}
    	#container{
    		position:absolute;
    		left : 916px;
    		left: -moz-calc( 916px - (1600px - 100%)/2 ) ;
    		left: -webkit-calc( 916px - (1600px - 100%)/2 ) ;
    		left: calc( 916px - (1600px - 100%)/2 ) ;
    		top : 245px;
    		top: -moz-calc( 245px - (900px - 100%)/2 ) ;
    		top: -webkit-calc( 245px - (900px - 100%)/2 ) ;
    		top: calc( 245px - (900px - 100%)/2 ) ;
    		height: 68%;
    		margin-left: auto;
    		margin-right:0;
    		min-height:450px;
    		-webkit-box-sizing: content-box;
    		-moz-box-sizing: content-box;
    		box-sizing: content-box;
    	}
    	#left {
    		width: 62%;
    		height: auto;
    	}
    	#copyright {
    		text-align: left;
    		color: rgb(255, 255, 255);
            font-size: 14px;
            overflow-wrap: break-word;
            min-width: 400px;
    	}
    	#caslogo {
        	text-align: center;
        }
        #systemLogo{
            width: 84px;
            height: 84px;
        }
    	#footer {
    		position:absolute;
    		bottom:15px;
    		width: 100%;
    		height: auto;
    		min-width:900px;
    		text-align:center;
    	}
    	</style>
		<%  } else {  %>
	<style type="text/css">
		body {
			padding: 0;
			margin: 0;
			font-size: 100%;
			font-family: "Microsoft Yahei", "微软雅黑", serif;
			background: url("./icons/default/background.png");
		}
	#container {
		margin: 0px auto;
		padding-top:200px;
		width: 960px;
		height:65%;
		/* 	修改问题单号 201405210581 浏览器框变小内容错位 by s10462 2014/6/9  */
		min-height:450px;
	}
	#left {
		float: left;
		width: 38%;
		height: auto;
	}
	#footer {
		margin-bottom:43px;
		width: 100%;
		height: auto;
		/* 	修改问题单号 201405210581 浏览器框变小内容错位 by s10462 2014/6/9  */
		min-width:900px;
	}
	</style>
		<%    }  %>
<style type="text/css">


#right {
	float:left;
	width: 62%;
	height: auto;
}


#caslogo {
	margin: 50px auto 0px;
	width: 163px;
	height: 103px;
}

#system{
	color: #FFFFFF;
	font-family: "Microsoft Yahei", "微软雅黑", serif;
	margin: 24px auto;
	text-align: center;
	font-size: 30px;
	line-height: 30px;
	max-width: 85%;
/* 	修改问题单  201405230364 系统名称太长 强制换行*/
	word-wrap:break-word;
}


.operator-login-recommend {
	float: left;
	margin: 20px 50px 0 31%;
	width: 800px;
	height: 18px;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.6);
	font-family: "Microsoft Yahei", "微软雅黑", serif;
}

.operator-login-recommend a{
	display:inline;
	font-size:12px;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
   
}
.operator-login-recommend a:hover{
	color: rgba(255, 255, 255, 1);
}
img {
	width: 100%;
	height: 100%;
}

form {
	width: 100%;
	height: auto;
	float: left;
}

form img{
	width:37px;
	height:37px;
	float:left;
	margin:7px;
}

#username,#password,#menubutton {
	float: left;
	position: relative;
	display: inline-block;
 	width: 351px; 
 	height: 51px; 
}

#username{
	margin:12px 30px;
	background: none repeat scroll 0 0 #FFFFFF;
}

#password{
    margin:6px 30px;
    background: none repeat scroll 0 0 #FFFFFF;
}

#username > input, #password > input{ 
 	width: 280px; 
 	height: 36px; 
 	line-height: 36px; 
     -moz-box-sizing:content-box; /* Firefox  */
     -webkit-box-sizing:content-box; /* Safari */
 	box-sizing: content-box;
 } 

/*
#menubutton{
  	margin:0px 30px;
    border:0px;
}
*/
#linkId{
	position: relative;
	display: inline-block;
	width: 350px;
    margin:22px 30px 0px;
}
#registerId{
	float:left;
	font-size:16px;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    color: #FFFFFF;
}

#forgetPasswordId{
	float:right;
	font-size:16px;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    color: #FFFFFF;
}

#loginId{
	margin:30px 30px;
}

#company {
	float:left;
	/* 	修改问题单号 201405210581 浏览器框变小内容错位 by s10462 2014/6/9  */
	margin: 3px 50px 0 30%;
	width: 69px;
	height: 18px;
	word-wrap:break-word;
}

#copyright{
	float:left;
	color: #FFFFFF;
	font-size:16px;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    /* 	修改问题单号 201405210581 浏览器框变小内容错位 by s10462 2014/6/9  */
    word-wrap:break-word;
	width:50%;
    min-width:400px;
}

input[type="text"],input[type="password"] {
	position: relative;
	font-size: 16px;
	float: left;
    color: #525253;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    border:0px;
    width: 300px;
	height: 50px;
	box-sizing: border-box;
}

input[type="text"]:focus,input[type="password"]:focus {
	position: relative;
	font-size: 16px;
	float: left;
    color: #525253;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
    border:0px;
  }

input[type="button"],input[type="submit"] {
	position: relative;
	width: 351px;
	height: 50px;
	background: none repeat scroll 0 0 #2290ED;
    color: #FFFFFF;
    border:0px;
    cursor: pointer;
    font-size:26px;
    font-family: "Microsoft Yahei", "微软雅黑", serif;
}
</style>
<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="js/common.js" ></script>
<script type="text/javascript" src="layer/layer.js"></script>
<script type="text/javascript" src="js/login.js"></script>
<script src="js/bootstrap/tooltip.js"></script>
<script src="js/bootstrap/tab.js"></script>
<script src="js/bootstrap/transition.js"></script>
<script src="js/cryptoJS.js" type="text/javascript"></script>
<script src="js/mode-ecb.js" type="text/javascript"></script>
<script type="text/javascript">
$(document).ready(function(){
    	$("#loginName").focus();
	    $("#loginName").keydown(function(event) {
	 		if(event.keyCode==13) {
	 		    login();	
	 		}
	  	});
	    $("#pwd").keydown(function(event) {
	 		if(event.keyCode==13) {
	 		    login();	
	 		}
	  	});
	     $.ajax({
				type : "POST",
				url : "login?way=getUIConfig",
				dataType : "json",
				success : function(UIConfig) {
					console.log(UIConfig);
					if (UIConfig != null && typeof UIConfig != "undefined") {
						$("#systemLogo").attr('src',UIConfig.systemLogo);
						if (UIConfig.systemName != '<%=cloudConsole%>') {
							$("title").html(UIConfig.systemName);
						}
						/*标题名称换行*/
						$("#system").html(UIConfig.systemName);
						$("#copyrightLogo").attr('src',UIConfig.copyrightLogo);
						$("#copyright").text(UIConfig.copyrightName);
						if (UIConfig.systemLogoWidth) {
						  $("#caslogo").width(UIConfig.systemLogoWidth +'px');
						}
						if (UIConfig.systemLogoHeight) {
						  $("#caslogo").height(UIConfig.systemLogoHeight +'px');
						}
						if (UIConfig.copyrightLogoWidth) {
						  $("#company").width(UIConfig.copyrightLogoWidth +'px');
						}
						if (UIConfig.copyrightLogoHeight) {
						  $("#company").height(UIConfig.copyrightLogoHeight +'px');
						}
					}
				}
			});
	});
</script>
</head>
<body>
		<%  if (isUnis) { %>
	<img style="width: 300px;height:30px;position: absolute;left:60px;top:40px;" src="./icons/default/loginlogoLeft_unis.svg" />
		<%  } %>
	<div id=container>
		<div id="left">
			<div id="caslogo">
				<img src="icons/default/caslogo.png" id="systemLogo">
			</div>
			<div id="system"><%=cloudConsole%></div>
		</div>
		<div id="right">
			<form class="form">
				<div id="username">
					<img src="icons/default/username.png">
					<input id = "loginName" type="text" value="" name="user" placeholder="<%=userName %>">
				</div>
				<div id="password">
					<img src="icons/default/password.png">
					<input id="pwd" type="password" value="" name="passwd" placeholder="<%=password %>">
				</div>
				<div id="linkId">
						<a href="javascript:void(0)" id="registerId" onclick="register()"> <%=register %></a>
						<a href="javascript:void(0)" id="forgetPasswordId" onclick="forgetPassword()"><%=forgetPassword%></a>
				</div>
				<input id="loginId" type="button" value="<%=login%>" onclick="login()">
			</form>
		</div>
	</div>
	<div id="footer">
			<div id="company">
				<img src="" id="copyrightLogo">
			</div>
			<div id="copyright"></div>
			<div class="operator-login-recommend" onmouseover="javascript:noticeIt();" onmouseout="javascript:outIt();"><%= loginBottomPrompt%></div>
	</div>
	
<script type="text/javascript">
//登录
function login() {
	var loginName = $("#loginName").val();
	var pwd = $("#pwd").val();
	var password = encryptByDES(pwd);
	if (loginName != "" && pwd != "") {
		$.ajax({
			type : "POST",
			url : "login?way=login",
			dataType : "json",
			data : "loginName=" + loginName + "&password=" + encodeURIComponent(encodeURIComponent(password)) + "&isEncrypt=true",
			beforeSend : function(xhr) {
				$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");
				$("<div class=\"datagrid-mask-msg\"></div>").html("<%=loginIng%>").
				appendTo("body").css({display:"block",fontSize:"14px",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2}); 
			},
			success : function(loginInfo) {
				hideWait();
				if (loginInfo.online == true) {
					window.location.href = "homeServlet";
				} else {
					if (loginInfo.errorCode == 102 || loginInfo.errorCode == 103) {
						$.messager.show({
							title : loginInfo.errorTitle,
							msg : loginInfo.loginFailMessage,
							showType : 'show'
						});
					} else {
						$.messager.show({
							title : loginInfo.errorTitle,
							msg : loginInfo.loginFailMessage,
							showType : 'show'
						});
						$("#pwd").focus();
					}
				}

			},
			error : function(xhr, textStatus, errorThrown) {
				hideWait();
			}
		});
	}
	else {
        $.messager.defaults = { ok: '<%=confirm%>'};  
        $.messager.alert('<%=errTitle%>', '<%=nullLoginInfo%>');
	}
}
function noticeIt(){
	$(".operator-login-recommend").css("color","rgba(255, 255, 255, 1)");
}
function outIt(){
	$(".operator-login-recommend").css("color","rgba(255, 255, 255, 0.6)");
}
</script>
</body>
</html>
