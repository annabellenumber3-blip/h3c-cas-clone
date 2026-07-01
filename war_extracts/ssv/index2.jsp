<%@ page contentType = "text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
     Object userTheme=request.getSession().getAttribute("userTheme");
	 if(userTheme==null){
		 response.sendRedirect("login.jsp");
	 }
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String cloudConsole = sm.getString("cloudConsole");
     String easyuiJsPath = sm.getString("easyuiJsPath");
     String dropContentPath = sm.getString("dropContentPath");
     String online = sm.getString("online");
     String myName = sm.getString("myName");
     String customerService = sm.getString("customerService");
     String instantMessageEnabled=(String)request.getSession().getAttribute("instantMessageEnabled");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<title><%=cloudConsole %></title>
<link href="css/ssvcss.css" type="text/css" rel="stylesheet">
<link href="css/<%=dropContentPath %>" type="text/css" rel="stylesheet">
<link href="css/themes/bootstrap/easyui.css" type="text/css" rel="stylesheet">
<link href="css/themes/icon.css" type="text/css" rel="stylesheet">
<link href="css/jquery.datetimepicker.css" type="text/css"  rel="stylesheet">
<link href="css/tooltip.css" type="text/css"  rel="stylesheet">
<link href="css/navtabs.css" type="text/css"  rel="stylesheet">
<link href="css/jquery.tooltip.css" type="text/css"  rel="stylesheet">
<link href="css/chat-style.css" type="text/css"  rel="stylesheet">
<link href="css/color<%=userTheme%>.css" type="text/css" rel="stylesheet" id="ssvcss">
<style>
.colorpick{
    display:inline-block;
	width:210px;
	height:auto;
	position: absolute;
	left: 10px;
	top: 60px;
	z-index:1000;
    overflow:hidden;
}
.colorpick li{
	display:inline-block;
	width:20px;
	height:20px;
	padding:2px;
	position: relative;
}
.colorpick-btn{
    display:inline-block;
	width:18px;
	height:18px;
}

.colorpick:before {
    border-color: rgba(0, 0, 0, 0)  rgba(0, 0, 0, 0) #fff rgba(0, 0, 0, 0);
    border-style:none none solid;
    border-width: 6px;
    content: "";
    font-size: 0;
    height: 0;
    left: 35px;
    line-height: 0;
    position: absolute;
    top: -12px;
}

.detail{
    background: none repeat scroll 0 0 #000;
    display: inline-block;
    height: 24px;
    width:80px;
    position: absolute;
    top: 32px;
    left:4px;
    visibility: visible;
    text-align: center;
	font-size: 14px;
	color:#FFF;
}
  </style>
</head>
<body class="easyui-layout" id="frame" onkeydown="restartSessionTimer()" onmousedown="restartSessionTimer()">
	<div id="menuframe" data-options="region:'west',border:false,href:'menubar.jsp'"
		style="width:240px;padding-left:0px;padding-right:0px;"></div>
	<!-- 菜单栏跳转就改变center的href -->
	<div data-options="region:'center',border:false,href:'home.jsp'" style="padding-left:0px;padding-right:0px;">
	</div>
	<div class="nonConnected" >
		<div id="SideNav">
			<div class="sideLink" style="right: 0px;">
				<img src="icons/customer_service.png" style="width: 60px;">
				<div><%=customerService%></div>
			</div>
			<!--<div class="SideSubmit" style="height: 176px; width: 206px; right: -206px;">-->
			<div class="pusherChat">
				<div id="membersContent" style="bottom: 225px; right: -204px;">
					<!--<span id="expand"><span class="close">&#x25BC;</span><span class="open">&#x25B2;</span></span>-->
					<h2 style="margin: 10px 0px;">
						<span id="count">0</span>
						<%=online%></h2>
					<div class="scroll" style="overflow-y: auto; height: 150px;">
						<div id="members-list"></div>
					</div>
				</div>
			</div>

		</div>

		<div class="pusherChat">
			<!-- chat box template -->
			<div id="templateChatBox">
				<div class="pusherChatBox" style="box-sizing: content-box !important;">
					 <div class="boxHeader">
				        <div style="height: 18px;">
							<span class="state"> 
							   <span class="pencil"> 
							      <img src="icons/quote.png" />
							   </span>
							   <span class="quote"> 
							      <img src="icons/quote.png" />
							   </span>
							</span> 
							<span class="expand">
							   <span class="closeDlg">&#x25BC;</span>
							   <span class="openDlg" style="display:none">&#x25B2;</span>
							</span> 
							<span class="closeBox">x</span>
						    <span class="userName" title="title"></span>
				        </div>
					    <div class="headerBottom" href="#">
					       <img src="" class="imgFriend" />
                           <span class="userName"></span>
                        </div>
				    </div>
					<div class="slider">
						<div class="logMsg">
							<div class="msgTxt"></div>
						</div>
						<form method="post" name="#123" style="margin: auto;">
							<textarea name="msg" rows="3"></textarea>
							<input type="hidden" name="to" class="to" /> 
						</form>
					</div>
				</div>
			</div>
			<!-- chat box template end -->
			<div class="chatBoxWrap">
				<div class="chatBoxslide"></div>
				<span id="slideLeft"> <img src="icons/quote.png" />&#x25C0;</span> 
				<span id="slideRight">&#x25B6; <img src="icons/quote.png" /></span>
			</div>
		</div>
	</div>
	<script src="js/jquery-1.8.0.min.js"></script>
	<script src="js/underscore.js"></script>
	<script src="js/jquery.easyui.min.js"></script>
	<script src="js/jquery.datetimepicker.js"></script>
	<script src="js/bootstrap/tooltip.js"></script>
	<script src="js/bootstrap/tab.js"></script>
	<script src="js/bootstrap/transition.js"></script>
	<script src="js/jquery.kxbdmarquee.js"></script>
    <script src="js/<%=easyuiJsPath%>"></script>	
	<script type="text/javascript" src="js/index.js"></script>
	<!--[if lte IE 8]><script language="javascript" type="text/javascript" src="js/flot/excanvas.min.js"></script><![endif]-->   
	<script type="text/javascript" src="js/flot/jquery.flot.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.time.js"></script>  
    <script type="text/javascript" src="js/flot/jquery.flot.symbol.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.pie.js"></script>
<!--     <script src="js/common.js" type="text/javascript"></script> -->
    <script type="text/javascript" src="js/tooltip/jquery.tooltip.min.js"></script>
    <script src="js/cryptoJS.js" type="text/javascript"></script>
    <script src="js/mode-ecb.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/common.js" ></script>
    <script type="text/javascript" src="js/jquery.timers.js" ></script>
    <script type="text/javascript" src="js/jquery.timers.min.js" ></script>
    <script>
    // 处理问题单201703250100：增加SSV中对话框的拖拽功能	--by ckf6302 2017.3.29
    $(document).ready(function(){
    	/*定义对话框拖动函数*/
    	function bindDraggable(evt) {
    			$(evt.currentTarget).draggable({
    				handle: ".modal-header",
    				onStopDrag: function(ev){
    					// 阻止对话框标题栏被拖入不可见区域
    					var $modal = $(this);
    					var modalTop = Number($modal[0].style.top.split('px')[0]),
    						clientTop = $modal[0].getBoundingClientRect().top,
    						frameHeight = $("#frame")[0].offsetHeight;
    					if (clientTop < 0) {
    						$modal.css({"top": (modalTop - clientTop) + "px"});
    					} else if (clientTop + 34 >= frameHeight) {
    						$modal.css({"top": (modalTop - (clientTop + 34 - frameHeight)) + "px"});
    					}
    					var modalLeft = Number($modal[0].style.left.split('px')[0]),
    					    modalWidth = $modal[0].offsetWidth,
    					    marginLeft = Number($modal[0].style.marginLeft.split('px')[0]),
    				        clientLeft = $modal[0].getBoundingClientRect().left,
    				        frameWidth = $("#frame")[0].offsetWidth;
    					var prarentLeft = 0;
    					if ($modal[0].parentElement != "undefined") {
    						prarentLeft = Number($modal[0].parentElement.style.left.split('px')[0]);
    					}
    					if (clientLeft < 0) {
    						$modal.css({"left": (modalLeft - clientLeft) + "px"});
    					} else if (clientLeft + modalWidth > frameWidth) {
    						$modal.css({"left": (frameWidth - modalWidth - prarentLeft - marginLeft) + "px"});
    				}
    				}
    			});
    			// 拖动对话框时，不显示覆盖层的横纵向滚动条
    			$(evt.currentTarget).closest(".window-overlay").css("overflow","hidden");
    	}
    	$(".panel-body").on("mouseenter", ".modal", bindDraggable);
    	startSessionTimer();
    });
        
    $.ajaxSetup({
        contentType:"application/x-www-form-urlencoded;charset=utf-8",

        complete:function(XMLHttpRequest,textStatus){
              //通过XMLHttpRequest取得响应头，sessionstatus           
              var sessionstatus=XMLHttpRequest.getResponseHeader("session");
              if(sessionstatus=="timeout"){
                  window.location.replace("login.jsp");
          	 }
        }
    });
    
    $(function() {
        $.ajax({
                type : "POST",
                url : "login?way=getUIConfig",
                dataType : "json",
                success : function(UIConfig) {
                    if (UIConfig != null && typeof UIConfig != "undefined") {
                        $("title").html(UIConfig.systemName);
                    }
                }
         });
        
    	var instantMessageEnabled = '<%=instantMessageEnabled%>'; 
    	if (instantMessageEnabled == 0) {
    		$('.nonConnected').hide();
    	}
    	$.ajax({
    		cache:false,//解决ie11中的缓存问题
    		type : "GET",
    		dataType : "json",
    		url : "login?way=getUser",
    		beforeSend : function(xhr) {
    			// showWait();
    		},
    		success : function(result) {
    			if (result != null && typeof result != 'undefined') {
    				if (result instanceof Array) {
    					var baseInfo = result[0];
    					localStorage.setItem("ssvLoginName", baseInfo.loginName);
    					init(baseInfo.loginName, baseInfo.password);
    				} else {
    					$.messager.show({
    						title : result.title,
    						msg : result.message,
    						showType : 'show'
    					});
    				}
    			}
    			// hideWait();
    		},
    		error : function(xhr, textStatus, errorThrown) {
    			// hideWait();
    		}
    	});
    	
    	var websocket;
    	var operatorAndUserList;
    	var loginName;
    	var pwd;
    	
    	function init (loginName, pwd) {
    		this.loginName = loginName;
    		this.pwd = pwd;
    		if (instantMessageEnabled == 1) {
    			createWebSocket();
    		}
    		$('#SideNav .sideLink img').mouseenter(function () {
    			$('#SideNav .sideLink').animate({right:'204px'});
    			$('#membersContent').animate({right:'0px'});
    		})
    		$('#SideNav').mouseleave(function () {
    			$('#SideNav .sideLink').animate({right: '0px'});
    			$('#membersContent').animate({right: '-' + '204px'});
    		})
    		// trigger whene user stop typing 
//    		$('.nonConnected').on('focusout','.pusherChatBox textarea',function(){
//    			if($(this).next().next().next().val()=='true'){
//    				var from = $(this).parents('form');
//    				$(this).next().next().next().val('null');
//    			}
//    		});
    		
    		/*-----------------------------------------------------------*
    		 * slide up & down friends list & chat boxes
    		 *-----------------------------------------------------------*/  
    		$('.nonConnected').on('click','.pusherChat .pusherChatBox .expand',function(){
    			var obj = $(this);
    			obj.parent().parent().find('.headerBottom').show();
    			obj.parent().parent().parent().find('.slider').slideToggle('1', function() {
    				if ($(this).is(':visible')){
    					obj.find('.closeDlg').show();
    					obj.find('.openDlg').hide();
    				}else {
    					obj.find('.closeDlg').hide();
    					obj.find('.openDlg').show();
    					obj.parent().parent().find('.headerBottom').hide();
    				}
    			});    
    			return false
    		});
    		
    		// close chat box
    		$('.nonConnected').on('click','.pusherChat .closeBox',function(){
    			$(this).parents('.pusherChatBox').hide();
    			updateBoxPosition();
    			return false;
    		});
    		
    		// trigger click on friend & create chat box
    		$('.nonConnected').on('click','.pusherChat #members-list a',function(){
    			var obj=$(this);
    			showChatBox(obj);
    			obj.find('span.notreadnum').remove();
    			obj.removeClass('usertwinkling');
    			updateHeadTwinkleState();
    			var name = obj.attr('href').replace('#','id_');
    			var chatBox = $('.pusherChatBox[id=' + name + ']');
    			chatBox.find('.boxHeader').removeClass('headtwinkling2');
    			if (!chatBox.find('.slider').is(':visible')) {
    				chatBox.find('.headerBottom').show();
    				chatBox.find('.slider').show();
    				chatBox.find('.expand .closeDlg').show();
    				chatBox.find('.expand .openDlg').hide();
    			}
    			return false;
    		});
    		
    		// some action whene click on chat box
    		$('.nonConnected').on('click','.pusherChatBox',function(){
    			var newMessage = false;
    			$(this).find('.boxHeader').removeClass('headtwinkling2');
    			var name = $(this).attr("id").replace('id_','');
    			$('.pusherChat #members-list a[href="#' + name + '"]').removeClass('usertwinkling').find('span.notreadnum').remove();
    			updateHeadTwinkleState();
    			$('.pusherChatBox').each(function(){
    				if ($(this).find('.boxHeader').hasClass('headtwinkling2')){
    					newMessage = true;
    					return false; 
    				}       
    			});  
    		});   
    		
    		$('.nonConnected').on('click','#slideLeft',function(){
    			$('.chatBoxslide .pusherChatBox:visible:first').addClass('overFlowHide');
    			$('.chatBoxslide .pusherChatBox.overFlow').removeClass('overFlow');
    			updateBoxPosition();
    		});
    		
    		$('.nonConnected').on('click','#slideRight',function(){
    			$('.chatBoxslide .pusherChatBox.overFlowHide:last').removeClass('overFlowHide');
    			updateBoxPosition();
    		});
    		
    		/*-----------------------------------------------------------*
    		 * send message & typing event to server
    		 *-----------------------------------------------------------*/ 
    		$(".nonConnected").on('keypress','.pusherChatBox textarea',function(event) {
    			if ($(this).val().length > 500) {
    	    		  $(this).val($(this).val().substring(0, 500));
    	    	} 
    			var from = $(this).parents('form');
    			if ( event.which == 13 ) {                
    				if ($(this).val() == '\n' || $(this).val() == '') {
    					$(this).val('');
    					$(this).focus();
    					return;
    				}
//    				$(this).next().next().next().val('false');
    				var to = $(this).next().val().replace('#', '');
    				if (!checkOnlineUser(loginName)) {
    					websocket.close();
    					console.log('Exit liveChat');
    					return;
    				}
    				var data={};
    				data.from = loginName;
    				data.to = to;
    				data.message =  $(this).val().replace(/</g,'&lt;').replace(/>/g,'&gt;');
    				doSend(data);
    				event.preventDefault();
    				$(this).val('');
    				$(this).focus();
    				var time = getTimeString();
    				$('#id_'+data.to+' .msgTxt').append('<p class="you"><b>' + '<%=myName%>' + '</b>' + '<b class="time">' + time + '</b>' + '<br/>' + data.message+'</p>');
    				$('#id_'+data.to+' .logMsg').scrollTop( $('#id_'+data.to+' .msgTxt')[0].scrollHeight );
    			}
//    			else if (!$(this).val() || ($(this).next().next().next().val()=='null' && $(this).val())) {               
//    				$(this).next().next().next().val('true');
//    			}
    		});     
    		
    		/*-----------------------------------------------------------*
    		 * some css tricks
    		 *-----------------------------------------------------------*/ 
    		$('.pusherChat .scroll').css({
    			'max-height':$(window).height()/2
    		})               
    		
    		$('.pusherChat .chatBoxWrap').css({
    			'width':$(window).width() -  $('#membersContent').width()-30 
    		})           
    		
    		$(window).resize(function(){
    			$('.pusherChat .scroll').css({
    				'max-height':$(window).height()/2
    			});
    			
    			$('.pusherChat .chatBoxWrap').css({
    				'width':$(window).width() -  $('#membersContent').width() -30
    			}) 
    			updateBoxPosition();
    		});
    	}  
    	
    	function checkOnlineUser(currentuser) {
    		var result = false;
    		var ssvLoginName = localStorage.getItem("ssvLoginName");
    		if (ssvLoginName != null && ssvLoginName == currentuser) {
    			result = true;
    		}
    		return result;
    	}
    	
    	function getTimeString() {
    		var da = new Date();
    		return (da.getHours() < 10 ? '0' + da.getHours() : '' + da.getHours()) + ':' + (da.getMinutes() < 10 ? '0' + da.getMinutes() : '' + da.getMinutes());
    	}
    	
    	function updateHeadTwinkleState() {
    		var needTwikle = false;
    		$('.pusherChat #members-list a').each(function(index, item) {
    			if ($(item).hasClass('usertwinkling')) {
    				needTwikle = true;
    			}
    		});
    		if (needTwikle) {
               $('#SideNav .sideLink img').addClass('headtwinkling');
    		} else {
    		   $('#SideNav .sideLink img').removeClass('headtwinkling');
    		}
    	}
    	
    	function createWebSocket() {
    		//修改问题单201702240260， ssv用https访问，鼠标移动到在线服务上，不能够弹出对话框，并且在cic上看到在线的用户还是0。
    		var wsUri ="ws://" + window.location.host +"/cic/livechat?username=" + this.loginName +"&usertype=2&pwd=" + encodeURIComponent(encryptByDES(this.pwd));
    		if (window.location.protocol == 'https:') {
    			wsUri ="wss://" + window.location.host +"/cic/livechat?username=" + this.loginName +"&usertype=2&pwd=" + encodeURIComponent(encryptByDES(this.pwd));
    		}
    		websocket = new WebSocket(wsUri);
    		websocket.onopen = function(evt) {
    			onOpen(evt)
    		};
    		websocket.onclose = function(evt) {
    			onClose(evt)
    		};
    		websocket.onmessage = function(evt) {
    			onMessage(evt)
    		};
    		websocket.onerror = function(evt) {
    			onError(evt)
    		};
    	}
    	
    	function onOpen(evt) {
    		
    	}
    	
    	function onClose(evt) {
    		clearMessage();
    	}
    	
    	function onMessage(evt) {
    		var dataJson=$.parseJSON(evt.data);
    		if (dataJson.type == 1) {
    			memberUpdate(dataJson.userlist);
    		} else if (dataJson.type == 2) {
    			var obj = $('a[href=#'+dataJson.user +']');
    			createChatBox(obj);
    			var name = $('#id_'+dataJson.user).find('.boxHeader .userName').html();
    			var message = dataJson.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    			var time = getTimeString();
    			$('#id_' + dataJson.user + ' .msgTxt').append('<p class="friend"><b>' + name + '</b>' + '<b class="time">' + time + '</b><br/>'+ message +'</p>');
    			$('#id_' + dataJson.user + ' .boxHeader').addClass('headtwinkling2')
    			$('#id_' + dataJson.user + ' .logMsg').scrollTop( $('#id_'+dataJson.user+' .msgTxt')[0].scrollHeight );
    			if (!$('.pusherChat #members-list a[href="#' + dataJson.user + '"] span.notreadnum').html()) {
    				if (!$('#id_' + dataJson.user).is(':visible')){
	    				$('.pusherChat #members-list a[href="#' + dataJson.user + '"]').append('<span class="notreadnum">1</span>');
        			}
    			} else {
    				var ust = $('.pusherChat #members-list a[href="#' + dataJson.user + '"] span.notreadnum').html();
    				$('.pusherChat #members-list a[href="#' + dataJson.user + '"] span.notreadnum').html(parseInt(ust)+1);
    			}
    			if (!$('#id_' + dataJson.user).is(':visible')){
	    			$('.pusherChat #members-list a[href="#' + dataJson.user + '"]').addClass('usertwinkling');
    			}
    			updateHeadTwinkleState();
    		}
    	}
    	
    	function onError(evt) {
    		clearMessage();
    	}
    	function doSend(data) {
    		var tousertype;
    		$.each(operatorAndUserList, function(index, val) {
    			if (data.to ==val.username) {
    				tousertype = val.type;
    			}
    		});
    		var message = {};
    		message.type = 2;
    		message.user = data.from;
    		message.usertype = 2;
    		message.touser = data.to;
    		message.tousertype = tousertype;
    		message.message = data.message;
    		var sendData = JSON.stringify(message);
    		websocket.send(sendData);
    	}
    	
    	function memberUpdate(userList) {
    		operatorAndUserList = userList;
    		//删除不再在线的用户
    		$('.pusherChat #members-list a').each(function(index, val) {
    			var id = $(val).attr('href').replace('#','');
    			var isExist = false;
    			$.each(userList, function(i, vl) {
    				if (vl.username == id) {
    					isExist = true;
    					return;
    				}
    			});
    			if (!isExist) {
    			    $(val).remove();
    			}
    		});
    		
    		var count = 0;
    		var userNameList = [];
    		$.each(userList, function(index, val) {
    			userNameList[index] = val.username;
    			if (val.type == 1) {
    				count++;
    				var userImage;
    				if (val.type == 1) {
    					userImage = "http://" + window.location.host + "/cic/" + val.image;
    					if (window.location.protocol == 'https:') {
    						userImage = "https://" + window.location.host + "/cic/" + val.image;
    					}
    				} else if (val.type == 2) {
    					userImage = val.image;
    				}
    				var onlineUser = $('.pusherChat #members-list a[href=#' + val.username + ']');
    				if (onlineUser.html()) {
    					onlineUser.find('img').attr('src' , userImage);
    					onlineUser.find('span.realName').attr('title' , val.realname).html(val.realname);
    					var temp = onlineUser.clone();
    					onlineUser.remove();
    					$('.pusherChat #members-list').append(temp);
    				} else {
    					var onlineUser = '<a href="#' + val.username + '" class="on"><img  src="'+userImage+'"/> <span class="realName" title=' + 
    					                  val.realname + '>'+ val.realname +'</span></a>';
    					$('.pusherChat #members-list').append(onlineUser);
    				}
    				$('#id_'+val.username + ' .userName').html(val.realname);
    			}
    		});
    		$('.chatBoxslide > .pusherChatBox').each(function () {
    			var obj = $(this);    
    			var id = obj.attr('id').replace('id_', '');
    			if (userNameList.indexOf(id) == -1) {
    				if (obj.is(':visible')) {
    					obj.hide();
    					updateBoxPosition();
    				}
    			}
    		});
    		$("#count").html(count);
    	}
    	
    	function clearMessage () {
    		$('#pusherChat #members-list').html('');
    		$("#count").html(0);
    		$('.chatBoxslide > .pusherChatBox').hide();
    	}
    	
    	/*-----------------------------------------------------------*
    	 * create a chat box from the html template 
    	 *-----------------------------------------------------------*/        
    	function createChatBox(obj){
    		var name = obj.find('span').html();
    		var img = obj.find('img').attr('src');
    		var id = obj.attr('href').replace('#', 'id_');
    		var off = clone ='';
    		if (obj.hasClass('off')) off='off';
    		if (!$('#'+id).html()){
    			$('#templateChatBox .pusherChatBox .boxHeader .userName').html(name);
    			$('#templateChatBox .pusherChatBox .boxHeader .userName').attr("title",name);
    			$('#templateChatBox .pusherChatBox .boxHeader img.imgFriend').attr('src',img);
    			$('.chatBoxslide').prepend($('#templateChatBox .pusherChatBox').clone().hide().attr('id',id));
    		}
    		$('#'+id+' .to').val(obj.attr('href'));
    		$('#'+id).addClass(off);
    		return false
    	}
    	
    	function showChatBox(obj){
    		var id = obj.attr('href').replace('#', 'id_');
    		if (!$('#'+id).html()){
    			createChatBox(obj);
    		}
            
    		if (!$('#'+id).is(':visible') ){
    			$('.chatBoxslide .pusherChatBox:visible').hide();
    			$('#'+id).show();
    		}
    		
    		$('#'+id+' textarea').focus();
    		updateBoxPosition();
    		return false;
    	}
    	
    	/*-----------------------------------------------------------*
    	 * reorganize the chat box position on adding or removing
    	 *-----------------------------------------------------------*/  
    	function updateBoxPosition(){
    		var right=0;
    		var slideLeft = false;
    		$('.chatBoxslide .pusherChatBox:visible').each(function(){
    			$(this).css({
    				'right':right
    			});
    			
    			right += $(this).width()+20;
    			
    			$('.chatBoxslide').css({
    				'width':right
    			});
    			
    			if ($(this).offset().left- 20<0){
    				$(this).addClass('overFlow');
    				slideLeft = true;
    			}
    			else
    				$(this).removeClass('overFlow');
    		});          
    		if(slideLeft) $('#slideLeft').show();
    		else $('#slideLeft').hide();
    		
    		if($('.overFlowHide').html()) $('#slideRight').show();
    		else $('#slideRight').hide();
    	}
    });
    </script>
</body>

</html>