<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String alarmInfo = sm.getString("alarmInfo");
     String alarmInfoDesc = sm.getString("alarmInfoDesc");
     String alarmConfig = sm.getString("alarmConfig");
     String alarmConfigDesc = sm.getString("alarmConfigDesc");
     String cloudHost = sm.getString("cloudHost");
     String category = sm.getString("category");
     String warnLevel = sm.getString("warnLevel");
     String warnDetail = sm.getString("warnDetail");
     String warnTime = sm.getString("warnTime");
     String query = sm.getString("query");
     String tips = sm.getString("tips");
     String leftKey = sm.getString("leftKey");
     String tipsOpeContent = sm.getString("tipsOpeContent");
     String tipscheckContent = sm.getString("tipscheckContent");
     String allLevel = sm.getString("allLevel");
     String urgency = sm.getString("urgency");
     String importance = sm.getString("importance");
     String minor = sm.getString("minor");
     String prompt = sm.getString("prompt");
     String allCategory = sm.getString("allCategory");
     String diskUtilization = sm.getString("diskUtilization");
     String cpuUtilization = sm.getString("cpuUtilization");
     String memoryUtilization = sm.getString("memoryUtilization");
     String openAlarm = sm.getString("openAlarm");
     String closeAlarm = sm.getString("closeAlarm");
     String add = sm.getString("add");
     String remove = sm.getString("remove");
     String name = sm.getString("name");
     String status = sm.getString("status");
     String memory = sm.getString("memory");
     String os = sm.getString("os");
     String expireDate = sm.getString("expireDate");
     String openAlarmContext = sm.getString("openAlarmContext");
     String closeAlarmContext = sm.getString("closeAlarmContext");
     String processing= sm.getString("processing");
     String removeAlarmVm= sm.getString("removeAlarmVm");
     String removeAlarmVmContext= sm.getString("removeAlarmVmContext");
     Object loginInfo=request.getSession().getAttribute("loginInfo");
     String firstWarnTime=sm.getString("firstWarnTime");
     String warnCount=sm.getString("warnCount");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style=" margin:0;padding:0;">
	<input id="processing" type="hidden" value="<%=processing%>">
	<input id="openAlarm" type="hidden" value="<%=openAlarm%>">
	<input id="closeAlarm" type="hidden" value="<%=closeAlarm%>">
	<input id="openAlarmContext" type="hidden" value="<%=openAlarmContext%>">
	<input id="closeAlarmContext" type="hidden" value="<%=closeAlarmContext%>">
	<input id="urgency" type="hidden" value="<%=urgency%>">
	<input id="importance" type="hidden" value="<%=importance%>">
	<input id="minor" type="hidden" value="<%=minor%>">
	<input id="prompt" type="hidden" value="<%=prompt%>">
	<input id="diskUtilization" type="hidden" value="<%=diskUtilization%>">
	<input id="cpuUtilization" type="hidden" value="<%=cpuUtilization%>">
	<input id="memoryUtilization" type="hidden" value="<%=memoryUtilization%>">
	<input id="removeAlarmVm" type="hidden" value="<%=removeAlarmVm%>">
	<input id="removeAlarmVmContext" type="hidden" value="<%=removeAlarmVmContext%>">
	<input id="allCategory" type="hidden" value="<%=allCategory%>">
	<input id="diskUtilization" type="hidden" value="<%=diskUtilization%>">
	<input id="cpuUtilization" type="hidden" value="<%=cpuUtilization%>">
	<input id="memoryUtilization" type="hidden" value="<%=memoryUtilization%>">
	<input id="allLevel" type="hidden" value="<%=allLevel%>">
	<input id="urgency" type="hidden" value="<%=urgency%>">
	<input id="importance" type="hidden" value="<%=importance%>">
	<input id="minor" type="hidden" value="<%=minor%>">
	<input id="prompt" type="hidden" value="<%=prompt%>">

	<div class="wrapper page adapter">
				<div class="page-intro">
					<div id="alarmInfo">
				      <h1><%= alarmInfo%></h1>
						<p class="lead"><%=alarmInfoDesc %></p>
				    </div>
	                <div id="alarmConfig">
	                  <h1><%=alarmConfig %></h1>
	                  <p class="lead"><%= alarmConfigDesc%></p>
	                </div>
					
				</div>
				<div id="toolbar" style="font-size:14px;">
		            <a href="javascript:void(0)" class="tab-item alarm-info current"><%=alarmInfo %></a>
		            <a href="javascript:void(0)" class="tab-item alarm-config" ><%=alarmConfig %></a>
            	</div>
				<div id ="alarm-info" style="padding: 30px 30px 10px 10px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;">
			    	<%=cloudHost %>&nbsp; <input id="cloudHostInputId" style="color: #555555;height: 30px;width:200px;">&nbsp;&nbsp;&nbsp;&nbsp;
			    	<%=category %>&nbsp;
			    	<select  id="categorySelect"></select>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<%=warnLevel %>&nbsp;
			    	<select id="levelSelect"></select>
			    	&nbsp;&nbsp;&nbsp;&nbsp;
			  		<a id="searchId" href="javascript:void(0)"  class="btn" style="line-height:30px;" onclick="searchAlarm()"><span class="wordIcon"></span><%=query %></a>
			  		<a id="startAlarmId" href="javascript:void(0)" class="btn linkbtn" onclick="startAlarm()" style="float: right; margin-right: 150px ! important; width: 85px;"><span class="wordIcon" id="openImg"></span><%=openAlarm %></a>
			  		<a id="closeAlarmId" href="javascript:void(0)" class="btn linkbtn" onclick="closeAlarm()" style="float: right; margin-right: 150px ! important; width: 85px;"><span class="wordIcon" id="closeImg"></span><%=closeAlarm %></a>
	            </div>
	            <div id ="alarm-config" style="padding: 30px 30px 10px 30px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;">
	            	<a id="addVmId" href="javascript:void(0)"  class="btn linkbtn" onclick="addAlarmVm()" style="width:100px"><span class="wordIcon">/</span><%=add %></a>
	            	<a id="removeVmId" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="removeAlarmVm()"><span class="wordIcon">Y</span><%= remove%></a>
	            </div>
				<div style="padding:30px 0 30px 10px ; width:1100px">
				   <table id="alarmlist"></table>
				</div>
				<p class="tips">
			  		* <%=tips %>：<span class="tipStrategy"><%= tipscheckContent%></span>
		 		</p>
	</div>
<!--        弹出来的模态窗口 -->
    <div id="windowOverId" class="window-overlay">
    </div>
<script type="text/javascript" src="js/alarm.js"></script>
<script type="text/javascript" src="js/common.js"></script>
<script type="text/javascript" src="js/zClearCombobox.js"></script>
<script>
    $(document).ready(function(){
    	var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
    		$(".tab-item").bind("click",function(){
                $(".tab-item").removeClass("current");
                $(this).addClass("current");
                var index = $(this).index(".tab-item");
                if (index == 0) {
                	$("#alarm-info").show();
                	$("#alarmInfo").show();
                	$("#alarm-config").hide();
                	$("#alarmConfig").hide();
                	//初始化云主机下拉框的值
                	initCloudHost();
                	//初始化云告警状态
                	initAlarmState();
                	setFirstPage();
                	//初始化云告警列表
                	initAlarmList(false);
                } else {
                	$("#alarm-info").hide();
                	$("#alarmInfo").hide();
                	$("#alarm-config").show();
                	$("#alarmConfig").show();
                	//将页码重新设置为第一页
                	setFirstPage();
                	//初始化提供云告警服务的虚拟机列表
                	initAlarmVmList();
                	$("#removeVmId").addClass("btn-forbidden");
                	$("#removeVmId").attr("onclick","");
                }
    		});
    		$("#alarm-info").show();
        	$("#alarmInfo").show();
        	$("#alarm-config").hide();
        	$("#alarmConfig").hide();
        	initSelect();
        	//初始化云告警状态
        	initAlarmState();
        	//初始化云主机下拉框的值
        	initCloudHost();
        	//初始化云告警列表
        	initAlarmList(false);
    	}
    	

    	function initAlarmList(isSearch) {
    		$("#alarmlist").datagrid({ 
    	                url:'servlet/alarm?way=list',      
    	                singleSelect:true,
    	                fitColumns:true,
    	                onLoadSuccess:function(data) {
    		            	$("div.itemtooltip").jtooltip();
    	                	if (isSearch) {
	    		            	if (!isReload && data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
    							  $.messager.show({
    									title : data.title,
    									msg : data.message,
    									showType : 'show'
    							 	});
    							 return false;
    						  }
	    		            	isReload = false;
							}
    	                	isSearch = true;
    	           	    },
    	                columns:[[ 
    	                        {field:'id',title:'',width:0, hidden:true},  
    	                        {field:'title',title:'<%=cloudHost%>',width:300,align:'center',formatter:showTitle},  
    	                        {field:'eventLevel',title:'<%=warnLevel%>',width:220,align:'center',formatter:showLevel},
    	                        {field:'catalogId',title:'<%=category%>',width:220,align:'center',formatter:showCategory},  
    	                        {field:'eventMsg',title:'<%=warnDetail%>',width:300, align:'center',formatter:showTitle},
    	                        {field:'eventTime',title:'<%=warnTime%>',width:250, align:'center',formatter:showTitle},
    	                        {field:'firstEventTime',title:'<%=firstWarnTime%>',width:250, align:'center',formatter:showTitle},
    	                        {field:'eventCount',title:'<%=warnCount%>',width:150, align:'center',formatter:showTitle}
    	                    ]],  
    	                pagination:true,
    	                pageSize:10,
    	                pageList:[10,20,30,40,50]
    	            });
    	}

    	/**
    	 * 初始化提供云告警服务的虚拟机列表
    	 */
    	function initAlarmVmList() {
    		$("#alarmlist").datagrid({ 
    	                url:'servlet/alarm?way=select&strategyId='+strategyId,      
    	            	singleSelect:false,
    	            	fitColumns:true,
    	            	onClickRow:function(rowIndex, rowData){
    	            		var rows = $(this).datagrid("getSelections");
    	            		if (rows.length > 0) {
    	            			if($("#removeVmId")){
        	            			$("#removeVmId").removeClass("btn-forbidden");
        	                		$("#removeVmId").attr("onclick","removeAlarmVm()");
        	    	    		}
    	            		} else {
    	            			if($("#removeVmId")){
        	            			$("#removeVmId").addClass("btn-forbidden");
        	                		$("#removeVmId").attr("onclick","");
        	    	    		}
    	            		}
    	            	},
    	            	onLoadSuccess:function(data) {
    		            	$("div.itemtooltip").jtooltip();
    		            	$("#removeVmId").addClass("btn-forbidden");
    		            	if (data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
    							  $.messager.show({
    									title : data.title,
    									msg : data.message,
    									showType : 'show'
    							 	});
    							 return false;
    						  }
    	           	    },
    	            	columns:[[ 
    	                    {field:'title',title:'<%=name%>',width:125,formatter:showTitle},
    	                    {field:'status',title:'<%=status%>',width:50, formatter:showState} ,
    	                    {field:'cpu',title:'CPU',width:80},  
    	                    {field:'memory',title:'<%=memory%>',width:80,formatter:showMemory},
    	                    {field:'osVersion',title:'<%=os%>',width:250,formatter:showTitle},
    	                    {field:'expireDateStr',title:'<%=expireDate%>',width:150}
    	                ]],  
    	                pagination:true,
    	                pageSize:10,
    	                pageList:[10,20,30,40,50]
    	        });    
    	}
    });
 </script>
</body>
</html>