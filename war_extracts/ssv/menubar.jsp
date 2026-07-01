<%@ page contentType = "text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String homePage = sm.getString("homePage");
     String logout = sm.getString("logout");
     String confirm = sm.getString("confirmLogout");
     
     String resourceMng = sm.getString("resourceMng");
     String systemMng = sm.getString("systemMng");
     String cloudHost = sm.getString("cloudHost");
     String cloudDisk = sm.getString("cloudDisk");
     String cloudSafety = sm.getString("cloudSafety");
     String cloudBackup = sm.getString("cloudBackup");
     String cloudProperties = sm.getString("cloudProperties");
     String cloudAlarm = sm.getString("cloudAlarm");
     String cloudMessage = sm.getString("cloudMessage");
     String cloudWorkflow = sm.getString("cloudWorkflow");
     String personalSetting = sm.getString("personalSetting");
     String consumerReport = sm.getString("consumerReport");
     String operLog = sm.getString("operLog");
     String workOrder = sm.getString("workOrder");      
     String questionMark = sm.getString("questionMark");
     String theme = sm.getString("theme");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0;">
	<div class="navigation">
		<div class="wrapper">
			<div class="navigation-profile">
				<div class="portrait" id="portrait">
					<img id="personImg"  class="icon" src="">
				</div>
				<div class="user-name" id="user-name">
					<a id="loginUserNameId" href="javascript:void(0)" style="text-overflow:ellipsis;overflow:hidden;" title="<%= session.getAttribute("userName") %>"><%= session.getAttribute("userName") %></a>
				</div>
				<div class="user-links" id="user-links">
					<a id="home-icon-small" class="icon-small" data-forward="home" title="<%= homePage%>"><img class="icon" src="icons/default/home.png"> </a> 
<!-- 					<a class="icon-small"><img class="icon" src="icons/task.png"> </a> -->
					<a id="logout-icon-small" class="icon-small" title="<%= logout%>" onclick="logout()"><img class="icon" src="icons/default/logout.png"> </a>
					<a id="theme-icon-small" class="icon-small" title="<%= theme%>" onclick="changeSkin()"><img class="icon" src="icons/default/theme.png"> </a>
					<ul id="colorpick" class="colorpick" style="display:none">
						<li data-color="darkblue" >
						<a class="colorpick-btn" href="javascript:void(0)" ><img class="icon" src="./icons/default/1.png"></a>
						</li>
						<li data-color="blue" >
						<a class="colorpick-btn" href="javascript:void(0)"><img class="icon" src="./icons/default/2.png"></a>
						</li>
						<li data-color="orange" >
						<a class="colorpick-btn" href="javascript:void(0)"><img class="icon" src="./icons/default/3.png"></a>
						</li>
						<li data-color="green" >
						<a class="colorpick-btn" href="javascript:void(0)"><img class="icon" src="./icons/default/4.png"></a>
						</li>
						<li data-color="gray" >
					    <a class="colorpick-btn" href="javascript:void(0)"><img class="icon" src="./icons/default/5.png"></a>
						</li>
						<li data-color="red">
						<a class="colorpick-btn" href="javascript:void(0)"><img class="icon" src="./icons/default/6.png"></a>
						</li>
						<li data-color="black">
						<a class="colorpick-btn" href="javascript:void(0)"><img class="icon" src="./icons/default/7.png"></a>
						</li>
					</ul>
				</div>
			</div>
			<div class="navigation-permission">
				<h5><%=resourceMng %></h5>
				<ul>
					<li class="item item0"><a data-forward="instances"><span
							class="icon"><img class="icon" src="icons/default/instances.png">
						</span><%=cloudHost %></a></li>
				    
				    <c:if test="${sessionScope.hasCVMResource}">
						<c:if test="${sessionScope.diskEnabled == '1'}">
							<li class="item item1"><a data-forward="cloudDisk"><span class="icon"><img
										class="icon" src="icons/default/clouddisk.png"> </span><%=cloudDisk %></a>
							</li>
						</c:if>
						<c:if test="${sessionScope.backupEnabled == '1'}">
							<li class="item item2"><a data-forward="backup"><span class="icon"><img
										class="icon" src="icons/default/backup.png"> </span><%= cloudBackup%></a>
							</li>
						</c:if>
					</c:if>
					<c:if test="${sessionScope.firewallEnable == '1'}">
						<li class="item item3"><a data-forward="cloudSafety"><span class="icon"><img
							class="icon" src="icons/safe.png"> </span><%=cloudSafety %></a></li>
					</c:if>

				<%-- <li class="item"><a data-forward="report"><span class="icon"><img 
							class="icon" src="icons/performance.png"> </span><%= cloudProperties%></a></li> --%> 
					<c:if test="${sessionScope.hasCVMResource}">
						<c:if test="${sessionScope.alarmEnabled == '1'}">
							<li class="item"><a data-forward="alarm"><span class="icon"><img
									class="icon" src="icons/default/cloudwarning.png"> </span><%=cloudAlarm %> </a></li>
						</c:if>	
					</c:if>			
					<c:if test="${sessionScope.messageEnabled == '1'}">
						<li class="item item4"><a data-forward="message"><span class="icon"><img
									class="icon" src="icons/default/message.png"> </span><%=cloudMessage %>
									<div id="zh-top-nav-count" class="zu-top-nav-count zg-noti-number" style=""></div>
									</a>
					    </li>
					</c:if>
					<li class="item item5 item-last"><a data-forward="workflow"><span class="icon"><img
								class="icon" src="icons/default/process.png"> </span><%=cloudWorkflow %></a></li>
				</ul>
				<h5 class="second"><%=systemMng %></h5>
				<ul>
					<li class="item item6"><a data-forward="person"><span class="icon"><img
								class="icon" src="icons/default/setting.png"> </span><%=personalSetting %></a>
					</li>
					<!--  下一版本出现-->	
<!-- 					<li class="item"><a data-forward="consume"><span class="icon"><img -->
<%-- 								class="icon" src="icons/consume.png"> </span><%=consumerReport %></a> --%>
<!-- 					</li> -->
<!--  下一版本出现-->	
					<li class="item item7"><a data-forward="log" ><span class="icon"><img
								class="icon" src="icons/default/log.png"> </span><%=operLog %></a>
					</li>
					<c:if test="${sessionScope.workorderEnabled == '1'}">
						<li class="item item8 item-last"><a data-forward="workOrder" ><span class="icon"><img
									class="icon" src="icons/default/ticket.png"> </span><%=workOrder %></a>
						</li>
					</c:if>
				</ul>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		   $(document).ready(function(){
			   $("#home-icon-small").mouseover(function(e){
				  $(this).find("img").attr("src","icons/default/home0.png");
				  
			   });
			   $("#home-icon-small").mouseleave(function(e){
				   $(this).find("img").attr("src","icons/default/home.png");
			   });
			   $("#logout-icon-small").mouseover(function(e){
					  $(this).find("img").attr("src","icons/default/logout0.png");
					  
			   });
			   $("#logout-icon-small").mouseleave(function(e){
				   $(this).find("img").attr("src","icons/default/logout.png");
			   });
			   $("#theme-icon-small").mouseover(function(e){
				  $(this).find("img").attr("src","icons/default/theme0.png");
				  
			   });
			   $("#theme-icon-small").mouseleave(function(e){
				   $(this).find("img").attr("src","icons/default/theme.png");
			   });
			   var colorpick = $(".colorpick"),showpick;
			   colorpick.mouseleave(function(e){
				   $(this).delay(10000).slideUp(1000);
			   });
			   colorpick.mouseover(function(e){
				   clearInterval(showpick);
			   });
			   var ___lis___=$(".colorpick li");
			   $.each(___lis___,function(i,item){
							$(item).mouseenter(function(e){
							    $('.detail',this).animate({top:'4px'},200,function(){});
							});
							$(item).mouseleave(function(e){
							    $('.detail',this).animate({top:'32px'},200,function(){});
							});
						});
			   ___lis___.bind({
					click:function(){
						var color=$(this);
						$(".colorpick-btn").removeClass("selected");
						$('.colorpick-btn',this).addClass("selected");
						var css=document.getElementById("ssvcss");
		                
						if(color.attr("data-color")){
							var colorherf="css/color"+color.attr("data-color")+".css";
							css.setAttribute("href",colorherf);
						}else{
							css.setAttribute("href","css/colorblack.css");
						}
						$.ajax({
							type : "POST",
							dataType : "json",
							url : "login?way=saveTheme&theme="+color.attr("data-color"),
							beforeSend : function(xhr) {
								// showWait();
							},
							success : function(result) {
								$.messager.show({
									title : result.title,
									msg : result.message,
									showType : 'show'
								});
							},
							error : function(xhr, textStatus, errorThrown) {
								// hideWait();
							}
						});
					}
				   });
			   $(".navigation-permission ul li a,#user-links a").bind({
				click:function(){
					 var a = $(this);
					 if (typeof a.attr("data-forward") != "undefined") {
						 var forward=a.attr("data-forward")+'.jsp';
						 $("#frame").layout("panel","center").panel('refresh',forward);
						 if(!a.hasClass("icon-small")){
							$(".navigation-permission li").removeClass("current");
							a.parents("li").addClass("current");
						 } else if (a.prop("id") == "home-icon-small") {
							 /*修改问题单201703240253，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【CAS用户服务自助门户】页面实现有问题，打开首页后，左侧菜单栏的选择条依然停留在某个菜单位置*/
							 $(".navigation-permission li").removeClass("current");
						 }
					 }
				}
			   });
			   $.ajax({
					type : "GET",
					dataType : "json",
					url : "login?way=getUser",
					beforeSend : function(xhr) {
						// showWait();
					},
					success : function(result) {
						// hideWait();
						if (typeof (result) == "object"){
							$("#zh-top-nav-count").html(result[1].cloudMessageTotal);
							if (result[1].cloudMessageTotal && result[1].cloudMessageTotal !=  0) {
								$("#zh-top-nav-count").css('display',''); 
							} else {
								$("#zh-top-nav-count").css('display','none');
							}
							$("#menubarUserNameId").html(result[0].userName);
							$("#personImg").attr("src", result[0].imageUrl);
						} else {
							
						}
					},
					error : function(xhr, textStatus, errorThrown) {
						// hideWait();
					}
				});
		   });
		   
		   function logout() {
				$.messager.confirm('<%=logout %>', '<%=confirm%>'+'&nbsp;'+'<%=logout%><%=questionMark%>',
						function(r){            
					       if (r){
					    	   $.ajax({
					    			type : "POST",
					    			dataType : "text",
					    			url : "login?way=logout&autoLogout=false",
					    			success : function(result) {
					    				cancelSessionTimer();
					    				window.location.href = "login.jsp";
					    				}
					    			});
					       	}
					       });
		   }
		   /**  
		     * 取消session的定时器 
		     * @return {
		     * 
		     */
		    function cancelSessionTimer() {
		    	if (sessionTimer) {
		    		clearTimeout(sessionTimer);
		    		sessionTimer = undefined;
		    	}
		    }
		   function changeSkin(){
			   $("#colorpick").toggle();
		   }
		   
	</script>

</body>
</html>