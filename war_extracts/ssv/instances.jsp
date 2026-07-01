<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     
     String cloudHost = sm.getString("cloudHost");
     String cloudHostExplain = sm.getString("cloudHostExplain");
     String applayInstance = sm.getString("applayInstance");
     String start = sm.getString("start");
     String close = sm.getString("domain.shutDown");
     String moreOper = sm.getString("moreOper");
     String powoff = sm.getString("powoff");
     String mstsc = sm.getString("mstsc");
     String ssh = sm.getString("ssh");
     String instanceSnapshot = sm.getString("instanceSnapshot");
     
     String backup = sm.getString("backup");
     String openConsole = sm.getString("openConsole");
     String canelInstance = sm.getString("canelInstance");
     String layout = sm.getString("layout");
     String tile = sm.getString("tile");
     String icon = sm.getString("icon");
     String list = sm.getString("list");
     
     String name = sm.getString("name");
     String link = sm.getString("link");
     String status = sm.getString("status");
     String memory = sm.getString("memory");
     String disk = sm.getString("disk");
     String cpuUtilization = sm.getString("cpuUtilization");
     String memoryUtilization = sm.getString("memoryUtilization");
     String os = sm.getString("os");
     
     String canelVm = sm.getString("canelVm");
     String confirmCanelVm = sm.getString("confirmCanelVm");
     String ipnotNull= sm.getString("ipnotNull");
     
     String processing= sm.getString("processing");
     String tips = sm.getString("tips");
     String leftKey = sm.getString("leftKey");
     String tipsOpeContent = sm.getString("tipsOpeContent");
     String tipsContent = sm.getString("tipsContent");
     String quotationLeft= sm.getString("quotationLeft");
     String quotationRight= sm.getString("quotationRight");
     String questionMark = sm.getString("questionMark");
     Object loginInfo=request.getSession().getAttribute("loginInfo");
 	 String startVmContext =sm.getString("startVmContext");
	 String closeVmContext =sm.getString("closeVmContext");
	 String poweroffVmContext =sm.getString("poweroffVmContext");
     String apply = sm.getString("apply");
     String exception = sm.getString("exception");
     String stopped = sm.getString("stopped");
     String running = sm.getString("running");
 	 String closed = sm.getString("closed");
 	 String cloudhostNotExists = sm.getString("cloudhostNotExists");
 	 String applyExpire = sm.getString("applyExpire");
 	 String expireDate = sm.getString("expireDate");
 	 String releaseVDesktop = sm.getString("releaseVDesktop");
 	 String confirmReleaseVDesktop = sm.getString("confirmReleaseVDesktop");
 	 String enableAntivirus = sm.getString("enableAntivirus");
 	 String disableAntivirus = sm.getString("disableAntivirus");
 	 String enableAntivirusContext = sm.getString("enableAntivirusContext");
 	 String disableAntivirusContext = sm.getString("disableAntivirusContext");
 	 String vmAntivirusConfig = sm.getString("vmAntivirusConfig");
 	 String enAbleAntivirus = sm.getString("enAbleAntivirus");
 	 String disAbleAntivirus = sm.getString("disAbleAntivirus");
 	
 	 
 	
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

</head>
<body style=" margin:0;padding:0;">
    <input id="startVmContext" type="hidden" value="<%=startVmContext%>">
	<input id="closeVmContext" type="hidden" value="<%=closeVmContext%>">
	<input id="poweroffVmContext" type="hidden" value="<%=poweroffVmContext%>">
	<input id="applyExpire" type="hidden" value="<%=applyExpire%>">
	<input id="releaseVDesktop" type="hidden" value="<%=releaseVDesktop%>">
	<input id="confirmReleaseVDesktop" type="hidden" value="<%=confirmReleaseVDesktop%>">
	<input id="processing" type="hidden" value="<%=processing%>">
	<input id="enableAntivirusContext" type="hidden" value="<%=enableAntivirusContext%>">
	<input id="disableAntivirusContext" type="hidden" value="<%=disableAntivirusContext%>">
<script src="js/instance.js" type="text/javascript"></script>
     <div class="wrapper page adapter">
			<div class="page-intro">
				<h1><%=cloudHost %></h1>
			<p class="lead">
				<%=cloudHostExplain %>
			</p>
			</div>
			<div id="toolbar">
				<a id="new-instance" href="javascript:void(0)"  class="btn linkbtn" onclick="openApplyVm()" style="width:100px"><span class="wordIcon">/</span><%=apply %></a>
			    <a id="startVmId" href="javascript:void(0)" class="btn linkbtn btn-forbidden " onclick="startVm()"><span class="wordIcon"></span><%=start %></a>
			    <a id="closeVmId" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="closeVm()"><span class="wordIcon"></span><%=close %></a>
			    <a href="javascript:void(0)" class="btn easyui-menubutton" data-options="menu:'#dropdown-content'"><%=moreOper %></a> 
				<input class="easyui-searchbox" data-options="prompt:'',searcher:doSearch"/>
			</div>
			<div id="dropdown-content">
				<div id="powerOffId" data-options="iconCls:'icon-poweroffvm'" onclick="powerOff()"><%=powoff %></div>
				<div id="sshId" data-options="iconCls:'icon-ssh'" onclick="ssh()"><%=ssh %></div>
				<div id="mstscId" data-options="iconCls:'icon-rdp'" onclick="mstsc()"><%=mstsc %></div>
				<c:if test="${sessionScope.snapshotEnabled == '1'}">
					<div id="snapshotId" data-options="iconCls:'icon-snapshot'" onclick="snapshot()"><%=instanceSnapshot %></div>
				</c:if>
				<c:if test="${sessionScope.backupEnabled == '1'}">
					<div id="backupId" data-options="iconCls:'icon-backup'" onclick="backup()"><%=backup %></div>
				</c:if>
				<c:if test="${sessionScope.vncEnabled == '1'}">
					<div id="openConsoleId" data-options="iconCls:'icon-console'" onclick="openConsole()"><%=openConsole %></div>
				</c:if>
				<div id="canelVmId" data-options="iconCls:'icon-canelvm'" onclick="canelVm()"><%=canelInstance %></div>
				<div id="applyExpireId" data-options="iconCls:'icon-delay'" onclick="applyExpire()"><%=applyExpire %></div>
				<div id="releaseId" data-options="iconCls:'icon-unlink'" onclick="releaseVDesktop()"><%=releaseVDesktop %></div>
				<div id="enableAntivirusId" style="display:none" data-options="iconCls:'icon-antivirusopen'" onclick="antivirusConfig(1)"><%=enableAntivirus %></div>
				<div id="disableAntivirusId" style="display:none" data-options="iconCls:'icon-antivirusclose'" onclick="antivirusConfig(0)"><%=disableAntivirus %></div>
			</div>

			<div style="padding:30px 0 30px 10px ; width:1100px">
				<table id="my-instances">
				</table>
				<!-- 虚拟机列表的右键菜单 -->
				<div id="mm" class="easyui-menu" style="width:120px;">     
				    <div onClick="startVm(1)" data-options="iconCls:'icon-startvm'"><%=start %></div>  
				    <div onClick="closeVm(1)" data-options="iconCls:'icon-shutdownvm'"><%=close %></div>   
				    <div onClick="powerOff(1)" data-options="iconCls:'icon-poweroffvm'"><%=powoff %></div> 
				    <div onClick="mstsc(1)" data-options="iconCls:'icon-rdp'"><%=mstsc %></div>  
				    <div onClick="ssh(1)" data-options="iconCls:'icon-ssh'"><%=ssh %></div>  
<!-- 					    <div class="menu-sep"></div>     -->
					<c:if test="${sessionScope.snapshotEnabled == '1'}">
				    <div onClick="snapshot(1)" data-options="iconCls:'icon-snapshot'"><%=instanceSnapshot %></div>
				    </c:if> 
				    <c:if test="${sessionScope.backupEnabled == '1'}">
				    <div onClick="backup(1)" data-options="iconCls:'icon-backup'"><%=backup %></div>  
				    </c:if> 
				    <c:if test="${sessionScope.vncEnabled == '1'}">
				    <div onClick="openConsole(1)" data-options="iconCls:'icon-console'"><%=openConsole %></div>
				    </c:if>
				    <div onClick="canelVm(1)" data-options="iconCls:'icon-canelvm'"><%=canelInstance %></div>
				    <div onClick="applyExpire(1)" data-options="iconCls:'icon-canelvm'"><%=applyExpire %></div>
			    </div> 
			</div>
<p class="tips">
* <%=tips %>：<span class="alert-info">“<%=leftKey %>”</span><%=tipsOpeContent %><%=tipsContent%>
</p>
	</div>
		
	<!-- 		弹出来的模态窗口 -->
	<div id="windowOverId" class="window-overlay">
	</div>
<script type="text/javascript">
	var contextRowData = null;
	var rowSelect = null;
    $(document).ready(function(){
   		var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
    	   initVmGrid();  
    	   //修改问题单 201405230172 按钮状态置灰 by s10462 2014/6/6
    	   initBtnStatus();
    	}
    });  
    function initBtnStatus(){
    	$("#startVmId").addClass("btn-forbidden");
    	$("#startVmId").attr("onclick","");
    	$("#closeVmId").addClass("btn-forbidden");
    	$("#closeVmId").attr("onclick","");
    	$("#enableAntivirusId").addClass("divDisable");
        $("#enableAntivirusId").attr("onclick","");
		$("#disableAntivirusId").addClass("divDisable");
		$("#disableAntivirusId").attr("onclick","");
		
    	if ($("#powerOffId")) {
    		$("#powerOffId").addClass("divDisable");
    		$("#powerOffId").attr("onclick","");
    	}
    	
   	    if ($("#sshId")){
   	    	$("#sshId").addClass("divDisable");
   	    	$("#sshId").attr("onclick","");
   	    }
  			
        if ($("#mstscId")){
        	$("#mstscId").addClass("divDisable");
        	$("#mstscId").attr("onclick","");
        }
  			
        if ($("#snapshotId")){
        	$("#snapshotId").addClass("divDisable");
        	$("#snapshotId").attr("onclick","");
        }
  			
        if ($("#backupId")){
        	$("#backupId").addClass("divDisable");
        	$("#backupId").attr("onclick","");
        }
  			
        if ($("#openConsoleId")){
        	$("#openConsoleId").addClass("divDisable");
        	$("#openConsoleId").attr("onclick","");
        }
  			
        if ($("#canelVmId")){
        	$("#canelVmId").addClass("divDisable");
        	$("#canelVmId").attr("onclick","");
        }
        
        if ($("#applyExpireId")){
        	$("#applyExpireId").addClass("divDisable");
        	$("#applyExpireId").attr("onclick","");
        }
        if ($("#releaseId")) {
        	$("#releaseId").addClass("divDisable");
        	$("#releaseId").attr("onclick","");
        }  			
    }
    //初始化虚拟机表格
    function initVmGrid() {
    	$("#my-instances").datagrid({ 
            url:'servlet/vmList?way=list',      
            singleSelect:true,
            fitColumns:true,
            //修改问题单201703250123，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【SSV】【云主机】选中某一台云主机创建云主机快照，再进行快照还原后删除已创建的快照，此时无法删除
            idField:'id',
            onClickRow:function(rowIndex, rowData){
            	var row = $(this).datagrid("getSelected");
            	//$("#enableAntivirusId").addClass("divDisable");
                //$("#enableAntivirusId").attr("onclick","");
        		//$("#disableAntivirusId").addClass("divDisable");
        		//$("#disableAntivirusId").attr("onclick","");
        		if (row.publicCloudType == '2') {
        			if($("#snapshotId").length > 0 ) {
        				$("#snapshotId").show();
        			}
        			if($("#backupId").length > 0 ) {
        				$("#backupId").show();
        			}
        			if($("#openConsoleId").length > 0 ) {
        				$("#openConsoleId").show();
        			}
        			if($("#enableAntivirusId").length > 0 ) {
        				$("#enableAntivirusId").show();
        			}
        			if($("#disableAntivirusId").length > 0 ) {
        				$("#disableAntivirusId").show();
        			}
        		} else {
        			if($("#snapshotId").length > 0 ) {
        				$("#snapshotId").hide();
        			}
        			if($("#backupId").length > 0 ) {
        				$("#backupId").hide();
        			}
        			if($("#openConsoleId").length > 0 ) {
        				$("#openConsoleId").hide();
        			}
        			if($("#enableAntivirusId").length > 0 ) {
        				$("#enableAntivirusId").hide();
        			}
        			if($("#disableAntivirusId").length > 0 ) {
        				$("#disableAntivirusId").hide();
        			}
        		}
        		
            	//修改问题单 201405230172 按钮根据选中云主机状态改变是否可点的状态  by s10462 2014/6/6
            	if($("#canelVmId")){
    	    		$("#canelVmId").removeClass("divDisable");
    	    		$("#canelVmId").attr("onclick","canelVm()");
    	    	}
    	    	//修改问题单201701130311：不带到期日期的云主机不可以申请延期，按钮置灰禁用  by ckf6302 2017/1/16
    	    	if($("#applyExpireId") && row.hasOwnProperty("expireDateStr")){
    	    		$("#applyExpireId").removeClass("divDisable");
    	    		$("#applyExpireId").attr("onclick","applyExpire()");
    	    	} else {
    	    		$("#applyExpireId").addClass("divDisable");
    	    		$("#applyExpireId").attr("onclick","");
    	    	}
    	    	
            	if (row.antivirusEnable == 0) { //未安装防病毒
        			$("#enableAntivirusId").removeClass("divDisable");
        			$("#enableAntivirusId").attr("onclick","antivirusConfig(1)");
        			
        			$("#disableAntivirusId").addClass("divDisable");
        			$("#disableAntivirusId").attr("onclick","");
        		} else {
        			$("#enableAntivirusId").addClass("divDisable");
        			$("#enableAntivirusId").attr("onclick","");
        			
        			$("#disableAntivirusId").removeClass("divDisable");
        			$("#disableAntivirusId").attr("onclick","antivirusConfig(0)");
        		}
    	    	
            	if(row.status == 2||row.status == 3||row.status == 4){
            		if($("#snapshotId")){
            			$("#snapshotId").removeClass("divDisable");
            			$("#snapshotId").attr("onclick","snapshot()");
            		}
        	   			
            	    if($("#backupId")){
            	    	$("#backupId").removeClass("divDisable");
            	    	$("#backupId").attr("onclick","backup()");
            	    }
        	   			
            	    if($("#openConsoleId")){
            	    	$("#openConsoleId").removeClass("divDisable");
            	    	$("#openConsoleId").attr("onclick","openConsole()");
            	    }
        	   			
    				//启动状态
                	if (row.status == 2) {
                		$("#startVmId").addClass("btn-forbidden");
                		$("#startVmId").attr("onclick","");
                		$("#closeVmId").removeClass("btn-forbidden");
                		$("#closeVmId").attr("onclick","closeVm()");
                		$("#powerOffId").removeClass("divDisable");
                		$("#powerOffId").attr("onclick","powerOff()");
                		//虚拟机启动且防病毒开启时不能关闭防病毒，保持与cvm一致
                		if (row.antivirusEnable == 1) {
                	    	$("#enableAntivirusId").addClass("divDisable");
                	        $("#enableAntivirusId").attr("onclick","");
                			$("#disableAntivirusId").addClass("divDisable");
                			$("#disableAntivirusId").attr("onclick","");
                		}
                    //关闭状态
                	} else if (row.status == 3) {
                		$("#startVmId").removeClass("btn-forbidden");
                		$("#startVmId").attr("onclick","startVm()");
                		$("#closeVmId").addClass("btn-forbidden");
                		$("#closeVmId").attr("onclick","");
                		$("#powerOffId").addClass("divDisable");
                		$("#powerOffId").attr("onclick","");
                		
                	} else if (row.status == 4) {
                	    //修改问题单:201506190285 暂停虚拟机打启动按钮状态错误
                		$("#startVmId").addClass("btn-forbidden");
                		$("#startVmId").attr("onclick","");
                		$("#closeVmId").addClass("btn-forbidden");
                		$("#closeVmId").attr("onclick","");
                		$("#powerOffId").removeClass("divDisable");
                		$("#powerOffId").attr("onclick","powerOff()");
                		
                		//虚拟机暂停状态不配置防病毒
                	    $("#enableAntivirusId").addClass("divDisable");
                	    $("#enableAntivirusId").attr("onclick","");
                		$("#disableAntivirusId").addClass("divDisable");
                		$("#disableAntivirusId").attr("onclick","");
                	}
                	if(row.system ==0){
                		//window 启动状态
                		if (row.status == 2) {
    	            		//远程桌面可以用
    	            		$("#mstscId").removeClass("divDisable");
    	            		$("#mstscId").attr("onclick","mstsc()");
                		} else {
                			//非启动状态 远程桌面不可以用
                    		$("#mstscId").addClass("divDisable");
                    		$("#mstscId").attr("onclick","");
                		}
                		//ssh不可用
                		$("#sshId").addClass("divDisable");
                		$("#sshId").attr("onclick","");
                		
                		var isAntiConfigured = false;
                		$.ajax({
             	 		   type: "GET",
             	 		   dataType:"json",
             	 		   url: "servlet/vmList?way=checkAntivirusConfigured",
             	 		   data:"domainId="+row.id,
             	 		   success: function(data){
	             		       if (data != null && typeof data != 'undefined') {
									if (data != '') {
										isAntiConfigured = data.message;
									}
	             		 	   }
	             		       if (isAntiConfigured == 'false') {
                                   $("#enableAntivirusId").addClass("divDisable");
                                   $("#enableAntivirusId").attr("onclick","");
                                   $("#disableAntivirusId").addClass("divDisable");
                                   $("#disableAntivirusId").attr("onclick","");
	             		       }
             	 		   }
             	      	});
                		// 防病毒功能不可用
                	} else {
                	    //linux
                	    if (row.status == 2) {
    	            	    //ssh可用
    	            		$("#sshId").removeClass("divDisable");
    	            		$("#sshId").attr("onclick","ssh()");
                	    } else {
                	    	//ssh不可用
                    		$("#sshId").addClass("divDisable");
                    		$("#sshId").attr("onclick","");
                	    }
                		
                		//远程桌面不可以用
                		$("#mstscId").addClass("divDisable");
                		$("#mstscId").attr("onclick","");
                		
                		// 防病毒功能不可用
                		$("#enableAntivirusId").addClass("divDisable");
                        $("#enableAntivirusId").attr("onclick","");
                        $("#disableAntivirusId").addClass("divDisable");
                        $("#disableAntivirusId").attr("onclick","");
                	}
                	//浮动桌面池的虚拟桌面
                	if (row.assignMode == 2) {
                		if($("#releaseId")){
                			$("#releaseId").removeClass("divDisable");
                			$("#releaseId").attr("onclick","releaseVDesktop()");
                		}
                		if($("#snapshotId")){
                			$("#snapshotId").addClass("divDisable");
                			$("#snapshotId").attr("onclick","");
                		}
            	   			
                	    if($("#backupId")){
                	    	$("#backupId").addClass("divDisable");
                	    	$("#backupId").attr("onclick","");
                	    }
                	    if($("#canelVmId")){
            	    		$("#canelVmId").addClass("divDisable");
            	    		$("#canelVmId").attr("onclick","");
            	    	}
            	    	if($("#applyExpireId")){
            	    		$("#applyExpireId").addClass("divDisable");
            	    		$("#applyExpireId").attr("onclick","");
            	    	}	
                		
                	} else {
                		if($("#releaseId")){
                			$("#releaseId").addClass("divDisable");
                			$("#releaseId").attr("onclick","");
                		}
                	}
                	if (row.protectModel != null && row.protectModel == 1) {
                		if($("#snapshotId")){
                			$("#snapshotId").addClass("divDisable");
                			$("#snapshotId").attr("onclick","");
                		}
                	}
            	} else {
            		initBtnStatus();
            	}
            },
            onLoadSuccess:function(data) {
            	$("div.itemtooltip").jtooltip();
   //             $("#startVmId").addClass("btn-forbidden");
     //           $("#closeVmId").addClass("btn-forbidden");
            	if (data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
					  $.messager.show({
							title : data.title,
							msg : data.message,
							showType : 'show'
					 	});
					 return false;
				  }
            	if (typeof data2 != 'undefined') {
					data2 = undefined;
				}
            	
            	var row = $(this).datagrid("getSelected");
            	if (row) {
            		var rowIndex = $(this).datagrid("getRowIndex", row.id);
	            	//修改问题单201706200183，云主机选中后点击上一下或下一页或刷新会虚拟机列表显示不正确
	            	if (rowIndex != -1) {
                	var data = $(this).datagrid("getData");
                	var vmData = data.rows[rowIndex];
                	//启动状态
                	if (vmData.status == 2) {
                		$("#startVmId").addClass("btn-forbidden");
                		$("#startVmId").attr("onclick","");
                		$("#closeVmId").removeClass("btn-forbidden");
                		$("#closeVmId").attr("onclick","closeVm()");
                		$("#powerOffId").removeClass("divDisable");
                		$("#powerOffId").attr("onclick","powerOff()");
                		//虚拟机启动且防病毒开启时不能修改防病毒，保持与cvm一致
                		if (row.antivirusEnable == 1) {
                	    	$("#enableAntivirusId").addClass("divDisable");
                	        $("#enableAntivirusId").attr("onclick","");
                			$("#disableAntivirusId").addClass("divDisable");
                			$("#disableAntivirusId").attr("onclick","");
                		}
                    //关闭状态
                	} else if (vmData.status == 3) {
                		$("#startVmId").removeClass("btn-forbidden");
                		$("#startVmId").attr("onclick","startVm()");
                		$("#closeVmId").addClass("btn-forbidden");
                		$("#closeVmId").attr("onclick","");
                		$("#powerOffId").addClass("divDisable");
                		$("#powerOffId").attr("onclick","");
                		
                	} else if (vmData.status == 4) {
                	    //修改问题单:201506190285 暂停虚拟机打启动按钮状态错误
                		$("#startVmId").addClass("btn-forbidden");
                		$("#startVmId").attr("onclick","");
                		$("#closeVmId").addClass("btn-forbidden");
                		$("#closeVmId").attr("onclick","");
                		$("#powerOffId").removeClass("divDisable");
                		$("#powerOffId").attr("onclick","powerOff()");
                	}
                	
                	if (vmData.antivirusEnable == 0) { //未安装防病毒
            			$("#enableAntivirusId").removeClass("divDisable");
            			$("#enableAntivirusId").attr("onclick","antivirusConfig(1)");
            			
            			$("#disableAntivirusId").addClass("divDisable");
            			$("#disableAntivirusId").attr("onclick","");
            		} else {
            			$("#enableAntivirusId").addClass("divDisable");
            			$("#enableAntivirusId").attr("onclick","");
            			if (vmData.status == 3) { //虚拟机若为关闭状态，关闭防病毒的按钮不可用
                            $("#disableAntivirusId").removeClass("divDisable");
                            $("#disableAntivirusId").attr("onclick","antivirusConfig(0)");
                        }
            		}
	                	if (vmData.status == 4) {
	                 		//虚拟机暂停状态不配置防病毒
	                	    $("#enableAntivirusId").addClass("divDisable");
	                	    $("#enableAntivirusId").attr("onclick","");
	                		$("#disableAntivirusId").addClass("divDisable");
	                		$("#disableAntivirusId").attr("onclick","");
	                	}
	                	// 目前windows系统才支持防病毒功能
	                	if (vmData.system != 0) {
	                		// 防病毒功能不可用
	                        $("#enableAntivirusId").addClass("divDisable");
	                        $("#enableAntivirusId").attr("onclick","");
	                        $("#disableAntivirusId").addClass("divDisable");
	                        $("#disableAntivirusId").attr("onclick","");
	                	}
	                	
	                	if(vmData.status == 2||vmData.status == 3||vmData.status == 4){
	                		if(vmData.system ==0){
	                    		//window 启动状态
	                    		if (vmData.status == 2) {
	        	            		//远程桌面可以用
	        	            		$("#mstscId").removeClass("divDisable");
	        	            		$("#mstscId").attr("onclick","mstsc()");
	            	} else {
	                    			//非启动状态 远程桌面不可以用
	                        		$("#mstscId").addClass("divDisable");
	                        		$("#mstscId").attr("onclick","");
	                    		}
	                    		//ssh不可用
	                    		$("#sshId").addClass("divDisable");
	                    		$("#sshId").attr("onclick","");
	                    	} else {
	                    	    //linux
	                    	    if (vmData.status == 2) {
	        	            	    //ssh可用
	        	            		$("#sshId").removeClass("divDisable");
	        	            		$("#sshId").attr("onclick","ssh()");
	                    	    } else {
	                    	    	//ssh不可用
	                        		$("#sshId").addClass("divDisable");
	                        		$("#sshId").attr("onclick","");
	                    	    }
	                    		
	                    		//远程桌面不可以用
	                    		$("#mstscId").addClass("divDisable");
	                    		$("#mstscId").attr("onclick","");
	                    	}
	                	}
	            	} else {
	            		$(this).datagrid("clearSelections");
	            		initBtnStatus();
            	}
            	}
            },
            /* 右键禁用 by w10456 2014-4-8 9:53:23
            onRowContextMenu:function(e, rowIndex, rowData) {
            	contextRowData = rowData;
            	e.preventDefault();               
            	$('#mm').menu('show', {       
            		left: e.pageX,               
            		top: e.pageY
            	});
            },*/
            columns:[[ 
                    {field:'title',title:'<%=name%>',width:120,formatter:showName},  
                    <%-- {field:'name',title:'<%=name%>',width:120,formatter:showVmName},   --%>
<%--                     {field:'link',title:'<%=link%>',width:120},   --%>
                    {field:'status',title:'<%=status%>',width:60, formatter:showState} ,
                    {field:'cpu',title:'CPU',width:60},  
                    {field:'memory',title:'<%=memory%>',width:80,formatter:showMemory},  
                    <%--
                    	{field:'storageCapacity',title:'<%=disk%>',width:80,formatter:showDisk},
                    --%>
                    {field:'cpuRate',title:'<%=cpuUtilization%>',width:140,formatter:progressFormatter},  
                    {field:'memRate',title:'<%=memoryUtilization%>',width:140,formatter:progressFormatter},  
                    {field:'osDesc',title:'<%=os%>',width:250,formatter:showTitle},
                    {field:'expireDateStr',title:'<%=expireDate%>',width:140},
                    {field:'antivirusEnable',title:'<%=vmAntivirusConfig%>',width:100, formatter:showEnableResult}
//                    {field:'runtime',title:'运行时长',width:220}
                ]],  
                pagination:true,
                pageSize:10,
                pageList:[10,20,30,40,50]
        });    
    }
    function getDetail(rowIndex){
    	var list =$("#my-instances");
    	list.datagrid("selectRow",rowIndex);
    	var row = list.datagrid("getSelected");
    	$.ajax({
	 		   type: "GET",
	 		   dataType:"json",
	 		   url: "servlet/vmList?way=getDetail",
	 		   data:"vmId="+row.id+"&flag="+ row.flag,
	 		   beforeSend:function(xhr){
	 			  showWait("<%=processing%>", 999999);
	 		   },
	 		   success: function(data){
		 			  hideWait();
		 			  if (data != null && typeof data != 'undefined') {
			 			  if (data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
		 					  $.messager.show({
								title : data.title,
								msg : data.message,
								showType : 'show'
							 });
		 					 $("#my-instances").datagrid('reload');
		 					 return false;
						  }
			 			  $("#frame").layout("panel","center").panel('refresh','insTextDetail.jsp?vmId='+data.id);
		 			  }
	 		   },
	 		   error:function(xhr, textStatus, errorThrown) {
		 		  hideWait();
		 	   }
	      });
    }
    function showState(value,rowData,rowIndex) {
    	if (value == 2) {
	           return '<img width="17px" height="17px" title=<%=running %> src=icons/default/homestart.png>';
	        } else if (value == 3) {
	           return '<img width="17px" height="17px" title=<%=closed %> src=icons/default/homeclose.png>';
	        } else if (value == 4) {
	           return '<img width="17px" height="17px" title=<%=stopped %> src=icons/default/homepause.png>';
	        } else {
	           return '<img width="17px" height="17px" title=<%=exception %> src=icons/default/homequestion.png>';
	        }
    }
    /**申请注销虚拟机**/
    function canelVm(type) {
    	var row = null;
    	if (typeof type == "undefined") {
        	   row = $("#my-instances").datagrid("getSelected");
            } else {
               row = contextRowData;
        }
    	var title = row.title;
		if (typeof title == 'undefined' || '' == title || title == null) {
			title = row.name;
		}
    	if (row){
    		if (typeof row.name == 'undefined' || row.name == '') {
    			$.messager.alert('<%=canelVm%>','<%=cloudhostNotExists%>','error');
    			return;
    		}
	    	$.messager.confirm('<%=canelVm %>', '<%=confirmCanelVm%><%=quotationLeft%>' + title + '<%=quotationRight%><%=questionMark%>', 
	    			function(r){            
	    		       if (r){     
	    		    	   $.ajax({
	    			 		   type: "POST",
	    			 		   dataType:"json",
	    			 		   url: "servlet/vmList?way=cancelVm",
	    			 		   data:"id="+row.id+"&name="+row.name+"&title=" + title + "&type=0&flag=" + row.flag,
	    			 		   success: function(result){
	    			 			  if (result != null && typeof result != 'undefined') {
		    			 		    	if (result.success) {
		    			 		    		$.messager.show({          
		    			 		    			title:result.title,            
		    			 		    			msg:result.message, 
		    			 		    			showType:'show'       
		    			 		    		});
		    			 		    	} else {
		    			 		    		$("#my-instances").datagrid('reload');
		    			 		    		$.messager.alert(result.title,result.message,'error');
		    			 		    	}
	    			 			  }
	    			 		   }
	    		 	      });
	    		       }
	       });
    	}
    }
    /**SSH连接**/
    function ssh(type) {
    	var row = null;
    	if (typeof type == "undefined") {
        	   row = $("#my-instances").datagrid("getSelected");
            } else {
               row = contextRowData;
        }
    	if (row && row.status == 2 && row.system == 1){ 
	    	$.ajax({
	 		   type: "GET",
	 		   dataType:"json",
	 		   url: "servlet/vmList?way=network",
	 		   data:"id="+row.id,
	 		   success: function(result){
	 			  if (result instanceof Array) {
	 				   if (result.length == 0) {
	 					  $.messager.alert('<%=ssh%>','<%=ipnotNull%>','error');
	 				   } else {
	 					  var ips = "";
	 					  for (var i = 0; i< result.length; i++) {
	 						 var ip =result[i].ipAddr;
	 						 if (typeof ip != 'undefined' && ip != null && ip != '') {
	 							  ips += ip + ",";
	 						 }
	 					  }
	 			    	  if (typeof ips == '') {
	 			    		  $.messager.alert('<%=ssh%>','<%=ipnotNull%>','error');
	 			    	  } else {
		 			    	  var param = "height=605, width=850, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
		 			    	  window.open("ssh.jsp?auto=1&ip="+ips, "_blank", param);
	 			    	  }
	 				   }
	 			  } else {
	 				  $.messager.alert(result.title, result.message, 'error');
	 				  //重新刷新界面
	 				 $("#my-instances").datagrid('reload');
				  }
	 		   }
 	      });
    	} 
    }
    /**远程桌面**/
    function mstsc(type) {
    	var row = null;
    	if (typeof type == "undefined") {
    		row = $("#my-instances").datagrid("getSelected");
        } else {
        	row = contextRowData;
        }
    	if (row && row.status == 2 && row.system == 0){ 
	    	$.ajax({
	 		   type: "GET",
	 		   dataType:"json",
	 		   url: "servlet/vmList?way=network",
	 		   data:"id="+row.id,
	 		   success: function(result){
	 			  if (result instanceof Array) {
	 				  if (result.length == 0 ) {
	 					 $.messager.alert('<%=mstsc%>','<%=ipnotNull%>','error');
	 				  } else if(result.length == 1) {
	 			    	  var net = result[0];
	 			    	  var ip = net.ipAddr;
	 			    	  mstscIp(ip, row.id);
	 			      } else {
	 			    	 $("#windowOverId").load("page/widget/selectIp.jsp",function(){
	 					    $("#modal-close").bind("click",close);
	 					    $("#windowOverId").css("display", "inline-block");
	 					    $("#rowid").val(row.id);
	 						for (var i =0 ; i < result.length; i++) {
	 							var ip = result[i].ipAddr;
	 							if (typeof ip != "undefined") {
	 								$("#ipSelect").append("<option value='" + ip + "'>" + ip);
	 							}
	 						}
 	 			     	});
	 			      } 
	 			  } else {
	 				  $.messager.alert(result.title, result.message, 'error');
	 				  //重新刷新界面
	 				 $("#my-instances").datagrid('reload');
				  }
	 		   }
 	      });
    	} 
    }
  //根据IP打开远程桌面
    function mstscIp(ip, id) {
    	if (typeof ip != "undefined" && typeof id != "undefined") {
   		  $.ajax({
   			  type: "GET",
   			  dataType:"json",
   			  url: "servlet/vmList?way=desktopParamter",
   			  data:"id=" + id,
   			  success: function(result){
   				if (typeof result != 'undefined') {
   				  var param = "height=105, width=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
   				  var ieparam = "height=105, width=200, toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes";
   				  if(result == null) {
    				  if(isIE()) {  
    					  window.open("ierdp.jsp?ip="+ip, "_blank", ieparam);
    				  } else {
   					      window.open("rdp.jsp?ip="+ip, "_blank", param);
    				  }

   				  } else {
   					  var audio = result.audio;
   					  var clipboard = result.clipboard;
   					  var colorDepth = result.colorDepth;
   					  var disk = result.disk;
   					  var printer = result.printer;
   					  var serialPort = result.serialPort;
   					  var usb = result.usb;
   					  var url = null;
   					  if(isIE()) {  
	   					  url = "ierdp.jsp?ip="+ip +"&enableCb=" + clipboard + "&enableCom=" + serialPort + "&enableDrive=" + disk + "&enablePrinter=" + printer + "&enableAudio=" + audio + "&enableUsb=" + usb + "&sessionBpp=" + colorDepth;
   						  window.open(url, "_blank", ieparam);
  				      } else {
	   					  url = "rdp.jsp?ip="+ip +"&enableCb=" + clipboard + "&enableCom=" + serialPort + "&enableDrive=" + disk + "&enablePrinter=" + printer + "&enableAudio=" + audio + "&enableUsb=" + usb + "&sessionBpp=" + colorDepth;
	   					  window.open(url, "_blank", param);
  				      }
   				  } 
   				}
   			  }
   		  }); 
   	  }
    }
    
    /**启动虚拟机**/
    function startVm(type) {
    	var row = null;
        if (typeof type == "undefined") {
    	   row = $("#my-instances").datagrid("getSelected");
        } else {
           row = contextRowData;
        }
    	if (row && row.status == 3){
    		$.messager.confirm("<%=start %>",$("#startVmContext").val() ,
        			function(r){            
        			if (r){
			    		var title = row.title;
			    		if (typeof title == 'undefined' || '' == title || title == null) {
			    			title = row.name;
			    		}
			    		$("#startVmId").addClass("btn-forbidden");
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/vmList?way=start",
				 		   data:"id="+row.id+"&name="+title,
				 		   beforeSend:function(xhr){
				 			  showWait("<%=processing%>", 999999);
				 		   },
				 		   success: function(result){
				 			    hideWait();
				 			   if (result != null && typeof result != 'undefined') {
				 				  if (result.success) {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    	} else {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    	}
				 				  $("#my-instances").datagrid('reload');
				 			   }
				 			//  initBtnStatus();
				 		   },
				 		   error:function(xhr, textStatus, errorThrown) {
				 			  hideWait();
				 			 $("#startVmId").removeClass("btn-forbidden");
				 		   }
			 	      });
        			}
            });
    	}
    }
    /**关闭虚拟机***/
    function closeVm(type) {
    	var row = null;
    	if (typeof type == "undefined") {
      	   row = $("#my-instances").datagrid("getSelected");
          } else {
             row = contextRowData;
          }
    	if (row && row.status != 3){
    		$.messager.confirm("<%=close %>",$("#closeVmContext").val() ,
        			function(r){            
        			if (r){
			    		var title = row.title;
			    		if (typeof title == 'undefined' || '' == title || title == null) {
			    			title = row.name;
			    		}
			    		$("#closeVmId").addClass("btn-forbidden");
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/vmList?way=close",
				 		   data:"id="+row.id+"&name="+title,
				 		   beforeSend:function(xhr){
				 			  showWait("<%=processing%>", 999999);
				 		   },
				 		   success: function(result){
				 			   hideWait();
				 			  if (result != null && typeof result != 'undefined') {
					 			   if (result.success) {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    	} else {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    	}
					 			   $("#my-instances").datagrid('reload');
				 			  }
				 		//	 initBtnStatus();
				 		   },
				 		   error:function(xhr, textStatus, errorThrown) {
				 			  hideWait();
				 			 $("#closeVmId").removeClass("btn-forbidden");
				 		   }
			 	      });
        			}
            });
    	} 	
    }
    
    /**关闭电源***/
    function powerOff(type) {
    	var row = null;
    	if (typeof type == "undefined") {
       	   row = $("#my-instances").datagrid("getSelected");
           } else {
              row = contextRowData;
         }
    	if (row && row.status != 3){ 
    		$.messager.confirm("<%=powoff %>",$("#poweroffVmContext").val() ,
        			function(r){            
        			if (r){
			    		var title = row.title;
			    		if (typeof title == 'undefined' || '' == title || title == null) {
			    			title = row.name;
			    		}
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/vmList?way=powerOff",
				 		   data:"id="+row.id+"&name="+title,
				 		   beforeSend:function(xhr){
				 			  showWait("<%=processing%>", 999999);
				 		   },
				 		   success: function(result){
				 			   hideWait();
				 			   if (result != null && typeof result != 'undefined') {
					 			  if (result.success) {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'     
					 		    		});
					 		    	} else {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'  
					 		    		});
					 		    	}
					 			  $("#my-instances").datagrid('reload');
				 			   }
				 		//	  initBtnStatus();
				 		   },
				 		   error:function(xhr, textStatus, errorThrown) {
				 			   hideWait();
				 		   }
			 	      });
        			}
  	      });
    	} 
    }
    
    /**防病毒配置 1 启用 2 关闭**/
    function antivirusConfig(type) {
    	var row = $("#my-instances").datagrid("getSelected");
    	var tipContent;
    	if (type == 1) {
    		tipContent = $("#enableAntivirusContext").val();
    	} else {
    		tipContent = $("#disableAntivirusContext").val();
    	}
    	if (row){
    		$.messager.confirm("<%=start %>",tipContent ,
        			function(r){            
        			if (r){
			    		var title = row.title;
			    		if (typeof title == 'undefined' || '' == title || title == null) {
			    			title = row.name;
			    		}
			    		if (type == 1) {
			    			$("#enableAntivirusId").addClass("divDisable");
			    		} else {
			    			$("#disableAntivirusId").addClass("divDisable");
			    		}
			    		
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/vmList?way=antivirusConfig",
				 		   data:"id="+row.id+"&name="+title+"&type="+type,
				 		   beforeSend:function(xhr){
				 			  showWait("<%=processing%>", 999999);
				 		   },
				 		   success: function(result){
				 			    hideWait();
				 			   if (result != null && typeof result != 'undefined') {
				 				  if (result.success) {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    	} else {
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    	}
				 				  $("#my-instances").datagrid('reload');
				 			   }
				 		//	  initBtnStatus();
				 		   },
				 		   error:function(xhr, textStatus, errorThrown) {
				 			  hideWait();
				 			 $("#startVmId").removeClass("btn-forbidden");
				 		   }
			 	      });
        			}
            });
    	}
    }
    function showEnableResult(value,rowData,rowIndex) {
  	  if (value == 1) {
  		  return '<%=enAbleAntivirus%>';
  	  } else {
  		  return '<%=disAbleAntivirus%>';
  	  }
    }
    
</script>
</body>
</html>