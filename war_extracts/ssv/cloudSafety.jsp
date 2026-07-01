<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String cloudSafety = sm.getString("cloudSafety");
     String firewall = sm.getString("cloudSafety.firewall");
     String summary = sm.getString("cloudSafety.summary");
     String create = sm.getString("cloudSafety.create");
     String delete = sm.getString("cloudSafety.delete");
     String modify = sm.getString("cloudSafety.modify");
     String apply = sm.getString("cloudSafety.apply");
     String name = sm.getString("name");
     String description = sm.getString("cloudSafety.description");
     String host = sm.getString("cloudSafety.host");
     String createTime = sm.getString("cloudSafety.createTime");
     String info = sm.getString("cloudSafety.property");
     String acl = sm.getString("cloudSafety.acl");
     String inbound = sm.getString("cloudSafety.inbound");
     String outbound = sm.getString("cloudSafety.outbound");
     String direction = sm.getString("cloudSafety.direction");
     String directionInbound = sm.getString("cloudSafety.direction.inbound");
     String directionOutbound = sm.getString("cloudSafety.direction.outbound");
     String qos = sm.getString("cloudSafety.qos");
     String value = sm.getString("cloudSafety.value");
     String enabled = sm.getString("cloudSafety.enabled");
     String protocol = sm.getString("cloudSafety.protocol");
     String action = sm.getString("cloudSafety.action");
     String permit = sm.getString("cloudSafety.action.permit");
     String prohibit = sm.getString("cloudSafety.action.prohibt");
     String port = sm.getString("cloudSafety.port");
     String portStart = sm.getString("cloudSafety.port.start");
     String portEnd = sm.getString("cloudSafety.port.end");
     String ip = sm.getString("cloudSafety.ip");
     String icmpType = sm.getString("cloudSafety.icmpType");
     String icmpCode = sm.getString("cloudSafety.icmpCode");
     String shortcut = sm.getString("cloudSafety.shortcut");
     String inboundRate = sm.getString("cloudSafety.inboundRate");
     String outboundRate = sm.getString("cloudSafety.outboundRate");
     String submit = sm.getString("cloudSafety.confirm");
     String cancel = sm.getString("cloudSafety.cancel");
     String unlimited = sm.getString("cloudSafety.unlimited");
     String list = sm.getString("list");
     String close = sm.getString("close");
     String processing = sm.getString("cloudSafety.processing");
     String success = sm.getString("cloudSafety.success");
     String failed = sm.getString("cloudSafety.failed");
     String tips = sm.getString("tips");
     String leftKey = sm.getString("leftKey");
     String tipsOpeContent = sm.getString("tipsOpeContent");
     
     String cloudHostList = sm.getString("cloudHostList");
     String srcIp = sm.getString("cloudSafety.srcIp");
     String	srcMask = sm.getString("cloudSafety.srcMask");
     String	srcPort = sm.getString("cloudSafety.srcPort");
     String	destIp = sm.getString("cloudSafety.destIp");
     String	destMask = sm.getString("cloudSafety.destMask");
     String	destPort = sm.getString("cloudSafety.destPort");
     String	priority = sm.getString("cloudSafety.priority");
     String	deleteFirewall = sm.getString("cloudSafety.deleteFirewall");
     String	confirmDelFirewall = sm.getString("cloudSafety.confirmDelFirewall");
 	 String quotationLeft = sm.getString("quotationLeft");
 	 String quotationRight = sm.getString("quotationRight");
 	 String questionMark = sm.getString("questionMark");
 	 String applyToHost = sm.getString("firewall.applyToHost");
 	 String confirm = sm.getString("confirm");
 	 String desc = sm.getString("desc");
 	 String firewallName = sm.getString("firewall.name");
 	 String hostIp = sm.getString("firewall.hostIp");
 	 String hostMac = sm.getString("firewall.hostMac");
     Object loginInfo=request.getSession().getAttribute("loginInfo");
     String	cloudHostNetList = sm.getString("firewall.cloudHostNetList");
     String	oneVmNetNeeded = sm.getString("oneVmNetNeeded");
     String confirmDelFirewallRule = sm.getString("cloudSafety.confirmDelFirewallRule");
     String deleFirewallRule = sm.getString("cloudSafety.deleteFirewallRule");
     
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style=" margin:0;padding:0;">
<script type="text/javascript" src="js/cloudSafety.js"></script>
<script type="text/javascript" src="js/common.js" ></script>
<div class="wrapper page" style="margin:20px; background:none repeat scroll 0 0 #FFF;height: auto;">
			<div class="page-intro">
				<h1><%=cloudSafety%></h1>
			<p class="lead">
				<%=summary %>
			</p>
			</div>
			<div id="page-index-content">
				<div id="toolbar">
					<a id="addFirewall"  href="javascript:void(0)"  class="btn linkbtn" onclick="openApplyFwStrategy()"><span class="wordIcon">/</span><%=create %></a>
				    <a id="editFirewall" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="editFwStrategy()"><span class="wordIcon"></span><%=modify %></a>
				    <a id="deleteFirewall" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="delFwStrategy()"><span class="wordIcon">Y</span><%=delete %></a>
				    <a id="applyToHostBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="applyToHost()" style="width:120px"><span class="wordIcon">J</span><%=applyToHost%></a>
				    
				</div>
				<div data-options="plain:true" style="padding:30px;">
				   <table id="firewallListId"></table>
				</div>
			</div>
			<div id="page-fwstrategy-info" style="padding:10px 30px;min-width:800px;">
			    <input id="firewallId" type="hidden">
				<div style="float:left;width:35%;border: 0px solid #ddd;">
					<div class="detail-item" style="padding-left:0px;">
						<div class="title">
							<h3><%=info%></h3>
						</div>
						<dl class="dl-horizontal">
							<dt id="nameId"><%=name %></dt>
							<dd style="padding-left:0px;" id="nameValue"></dd>
							<dt id="descId"><%=description %></dt>
							<dd style="padding-left:0px;" id="descValue"></dd>
							<dt id="hostId"><%=host %></dt>
							<dd style="padding-left:0px;" id="hostValue"></dd>
							<dt id="createTimeId"><%=createTime %></dt>
							<dd style="padding-left:0px;" id="createTimeValue"></dd>
						</dl>
					</div>
				</div>
				<div style="float:right;width:60%">
					<h1 style="font-size: 18px;"><%=acl %><a data-type="goback" href="javascript:void(0)" title="goback" style="float:right"><img id="cloudSafeGobackId" src=icons/default/goback1.png></a></h1>
					<div id="toolbar" style="padding: 0px 0px;">
						<a id="addAcl"  href="javascript:void(0)"  class="btn linkbtn" onclick="addFirewallRule()"><%=create %></a>
					    <a id="editAcl" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="editFirewallRule()"><%=modify %></a>
					    <a id="deleteAcl" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="delFirewallRule()"><%=delete %></a>
				    </div>
				    <div style="margin-top:15px">
						<h3><%=inbound %></h3>
						<div id="aclInList" style="margin-top:8px">
							<table id="aclInRuleId"></table>
						</div>
					</div>
					<div style="margin-top:50px">
						<h3><%=outbound %></h3>
						<div id="aclOutList" style="margin-top:8px">
							<table id="aclOutRuleId"></table>
						</div>
					</div>
				</div>
				
				<div class="clear"></div>
			</div>
			<p class="tips">
				* <%=tips %>：<span class="alert-info">“<%=leftKey %>”</span><%=tipsOpeContent %>
			</p>
</div>
		
	<!-- 		弹出来的模态窗口 -->
	<div id="cloudSafetyOverlay" class="window-overlay"></div>
	<div id="cloudHostNetOverlay" class="window-overlay">
		<!--<div class="type" >
			<input id="vmMacList" type="text"  name="inputType" style="width: 0px; height: 0px;">
		</div>-->
		<div id="modal" class="modal" style="position: absolute; top: 50%; margin-top: -187px; left: 50%; margin-left: -275px; width: 650px; height: 475px; font-size: 14px;">
			<div class="modal-header" style="cursor: move">
				<h5><%=cloudHostNetList%></h5>
				<div id="modal-close" onclick="closeHostList()">
					<span class="single-word-icon"></span>
				</div>
			</div>
			<div class="modal-content" style="height: 394px; overflow: auto;">
				<table id="cloudHostTable" style="height: 394px;">
				</table>
			</div>
			<div class="form-actions"
				style="margin-bottom: 0px; padding-left: 250px;">
				<input class="btn" type="button" value="<%=confirm%>"
					onclick="submitApplyToHost()"> <input class="btn"
					type="button" value="<%=cancel%>" onclick="closeHostList()">
			</div>
		</div>
	</div>
<script>
    $(document).ready(function(){
    	var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
         	getFwStrategyList();
    	}
    	
    	$("#cloudSafeGobackId").bind({
			click:function(){
		     	$(".page-intro h1").html("<%=cloudSafety%>");
		    	$("#page-index-content").show();
		    	$("#page-fwstrategy-info").hide();
			 },
			 mouseover:function(){
				 $("#cloudSafeGobackId").attr("src","./icons/default/goback0.png");
				 
			 },
			 mouseleave:function(){
				 $("#cloudSafeGobackId").attr("src","./icons/default/goback1.png");
			 }
		});
    	
    });  
    
    
    //将防火墙应用到云主机
    function applyToHost() {
  		var row = $("#firewallListId").datagrid("getSelected");
   		if (row) {
   			$("#cloudHostNetOverlay").show();
   			$("#cloudHostTable").datagrid({ 
             	url:'servlet/vmList?way=vmNetInfoList', //查询虚拟机网卡信息
             	singleSelect:false,
             	fitColumns:true,
             	onLoadSuccess:function(data) {
               		var cloudHostNetRows = $("#cloudHostTable").datagrid("getRows");
               		for (var i = 0;i < cloudHostNetRows.length; i++) {
               			if (cloudHostNetRows[i].firewallName != null && row.name == cloudHostNetRows[i].firewallName) {
               				$("#cloudHostTable").datagrid('selectRow', i);
               			}
               		}
               		//$("#my-cloudHostTable").datagrid('selectRecord',vmIdArr[i]);
             		$("div.itemtooltip").jtooltip();
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
	           	{field:'title',title:'<%=name%>',width:150, align:'center',formatter:showTitle},
	           	{field:'uniqueKey',title:'',width:0, hidden:true} ,
	           	{field:'ip',title:'<%=hostIp%>',width:120, align:'center',formatter:showTitle},
	           	{field:'mac',title:'<%=hostMac%>',width:120, align:'center',formatter:showTitle},
	           	{field:'firewallName',title:'<%=firewallName%>',width:100, align:'center',formatter:showTitle}
            ]],

			pagination:false
			});    
		}
    }
    
    function submitApplyToHost() {
  		var row = $("#firewallListId").datagrid("getSelected");
  		var hostRows = $("#cloudHostTable").datagrid("getSelections");
  		var vmSelectedId = [];
  		var vmMacs = [];
  		var vmTitles = [];
        for (var i = 0; i < hostRows.length; i ++ ) {
            vmSelectedId.push(hostRows[i].uniqueKey);
            vmMacs.push(hostRows[i].mac);
            vmTitles.push(hostRows[i].title);
        }
    	if (row && hostRows) {
    		$.ajax({
    			type : "POST",
    			dataType : "json",
    			url : "servlet/firewallServlet?way=applyToHost",
    			data:"uuid="+row.uuid + "&vmIds=" + vmSelectedId + "&vmMacs=" + vmMacs + "&vmTitles=" + vmTitles,
    			beforeSend : function(xhr) {
    				showWait("<%=processing%>", 999999);
    			},
    			success : function(result) {
    				hideWait();
    				$("#cloudHostNetOverlay").hide();
    				if (result != null && typeof result != 'undefined') {
	  	  				if (typeof result == 'object') {
	  	  					if (result.success) {
	  	  						$.messager.show({
	  	  							title : result.title,
	  	  							msg : result.message,
	  	  							showType : 'show'
	  	  						});
	  	  					} else {
	  	  						$.messager.alert(result.title,result.message,'error');
	  	  					}
	  	  					$("#firewallListId").datagrid('reload'); 
	  	  				}
    				}
    			},
    			error : function(xhr, textStatus, errorThrown) {
    				hideWait();
    			}
    		});
    	  }
    }
    
    
    function closeHostList() {
		$("#cloudHostNetOverlay").hide();
	}
    
    function refreshAclList() {
    	$("#aclInRuleId").datagrid('reload');
    	$("#aclOutRuleId").datagrid('reload');
    }
    
    function showTitle(value,rowData,rowIndex){
  	  	if (typeof value != 'undefined') {
  		 	 if (navigator.userAgent.indexOf("Firefox")>0) {
  		 		 value = toBreakWord(value, 50);
  		 	 }
  		 	 return  "<div class='itemtooltip' style='nowrap:false;word-break:break-all '>"+value+
  		 	 "<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
  		 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
  		 	 " </div></div>";
  	  	}
  	}
    
    /** 获取防火墙策略列表 */
    function getFwStrategyList() {
    	$("#firewallListId").datagrid({ 
            url:'servlet/firewallServlet?way=fwStrategyList',  
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData) {
            	changeToolbarBySelect('firewall');
            },
            onLoadSuccess:function(data) {
            	$("div.itemtooltip").jtooltip();
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
                    {field:'id',title:'',width:0, hidden:true},
                    {field:'uuid',title:'',width:0, hidden:true},  
                    {field:'name',title:'<%=name%>',width:220,formatter:fwStrategyFormat},
                    {field:'description',title:'<%=description%>',width:220},
                    {field:'vmNames',title:'<%=host%>',width:250},
                    {field:'createTime',title:'<%=createTime%>',width:200,formatter:fwStrategyDateFormat}
                ]],  
                pagination:true,
                pageSize:10,
                pageList:[10,20,30,40,50]
        });   
    	$(".page-intro h1").html("<%=cloudSafety%>");
    	$("#page-index-content").show();
    	$("#page-fwstrategy-info").hide();
    }
    
    /**根据选项不同，设置ToolBar状态 */
    function changeToolbarBySelect(type) {
    	if (type == null) {
    		return;
    	}
    	if (type == 'aclInRule' || type == 'aclOutRule') {
    		var toolbar = 'Acl';
    		var rows1 = $('#aclInRuleId').datagrid('getSelections');
    		var rows2 = $('#aclOutRuleId').datagrid('getSelections');
    		var rows = rows1.length + rows2.length;
        	if (rows != null && rows > 1) {
        		$('#editAcl').addClass('btn-forbidden');
            	$('#deleteAcl').removeClass('btn-forbidden');
        		
        	} else if (rows == 1){
    			$('#deleteAcl').removeClass('btn-forbidden');
    			$('#editAcl').removeClass('btn-forbidden');
        	} else {
        		$('#deleteAcl').addClass('btn-forbidden');
    			$('#editAcl').addClass('btn-forbidden');
        	}
    	} else if (type == 'firewall'){
    		var rows = $('#firewallListId').datagrid('getSelections');
        	if (rows != null && rows.length > 1) {
        		$('#editFirewall').addClass('btn-forbidden');
            	$('#deleteFirewall').removeClass('btn-forbidden');
            	$("#applyToHostBtn").addClass("btn-forbidden");
        	} else if (rows.length == 1){
        		$("#applyToHostBtn").removeClass("btn-forbidden");
    			$('#deleteFirewall').removeClass('btn-forbidden');
    			$('#editFirewall').removeClass('btn-forbidden');
        	} else {
        		$("#applyToHostBtn").addClass("btn-forbidden");
        		$('#deleteFirewall').addClass('btn-forbidden');
    			$('#editFirewall').addClass('btn-forbidden');
        	}
    	} 
    	type = null;
    }
    
    /** 格式化代码 */
    function fwStrategyFormat (value,rowData,rowIndex) {
    	var index = rowData.id;
    	var name = rowData.name;
    	var tempValue = value;
	 	if (navigator.userAgent.indexOf("Firefox")>0) {
	 	    value = toBreakWord(value, 20);
	 	} 
    	var html = '<a style="display:inline;font-size: 14px;text-decoration:underline" onClick="openFwStrategy(\''+index+'\',\''+name+'\',\''+rowIndex+'\')"><span title = "'+value+'">'+ tempValue +'</span></a>';
    	return html;
    }
    
    /**格式化云主机代码 */
    function fwStrategyDomainsFormat(value) {
    	var domainNames = [];
    	if(value) {
    		for(var i=0; i<value.length; i++){
    			var domain = value[i];
    			domainNames.push(domain.domainName);
    		}
    	}
    	return domainNames;
    }
    
    /** 格式化显示时间 */
    function fwStrategyDateFormat (value) {
    	var datetime =new Date(value);
    	//var datetime = new Date();
        //datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
    }
    
    /** 打开防火墙策略 */
    function openFwStrategy(index,name,rowIndex) {
    	$("#firewallId").val(index);
    	$(".page-intro h1").append(" > " + name);
    	$("#page-index-content").hide();
    	$("#page-fwstrategy-info").show();
    	// 获取 防火墙信息
    	
    	var row = $('#firewallListId').datagrid('getData').rows[rowIndex];
    	$('#nameValue').text(row.name);
		$('#descValue').text(row.description);
		$('#hostValue').text(row.vmNames);
		$('#firewallId').text(row.id);
		$('#createTimeValue').text(row.createTime);
    	$("#aclInRuleId").datagrid({
    		url:'servlet/firewallServlet?way=getRuleList&page=1&rows=10&id='+index +'&direction=0',
    		onClickRow:function(rowIndex, rowData) {
            	changeToolbarBySelect('aclInRule');
            },
            onLoadSuccess:function(data) {
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
                      {field:'id',title:'',width:0, hidden:true},  
                      {field:'direction',title:'',width:0, hidden:true}, 
                      {field:'priority',title:'<%=priority%>',width:50, align:'center'},
                      {field:'protocol',title:'<%=protocol%>',width:50, align:'center',formatter:protocolFormat},
                      {field:'srcIp',title:'<%=srcIp%>',width:100, align:'center'},
                      {field:'srcMask',title:'<%=srcMask%>',width:100, align:'center'},
                      {field:'srcPort',title:'<%=srcPort%>',width:100, align:'center'},
                    <%--   {field:'destIp',title:'<%=destIp%>',width:100, align:'center'},
                      {field:'destMask',title:'<%=destMask%>',width:100, align:'center'},
                      {field:'destPort',title:'<%=destPort%>',width:100, align:'center'}, --%>
                      {field:'action',title:'<%=action%>',width:50, align:'center',formatter:actionFormat}
                      
                  ]],
              fitColumns:true,
              singleSelect:false,
              pagination:true,
              pageSize:10,
              pageList:[10,20,30,40,50]
    	});
    	$("#aclOutRuleId").datagrid({
    		url:'servlet/firewallServlet?way=getRuleList&page=1&rows=10&id='+index+'&direction=1',
    		onClickRow:function(rowIndex, rowData) {
            	changeToolbarBySelect('aclOutRule');
            },
            onLoadSuccess:function(data) {
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
                      {field:'id',title:'',width:0, hidden:true},  
                      {field:'direction',title:'',width:0, hidden:true}, 
                      {field:'priority',title:'<%=priority%>',width:50, align:'center'},
                      {field:'protocol',title:'<%=protocol%>',width:50, align:'center',formatter:protocolFormat},
                     <%--  {field:'srcIp',title:'<%=srcIp%>',width:100, align:'center'},
                      {field:'srcPort',title:'<%=srcPort%>',width:100, align:'center'},
                      {field:'srcMask',title:'<%=srcMask%>',width:100, align:'center'}, --%>
                      {field:'destIp',title:'<%=destIp%>',width:100, align:'center'},
                      {field:'destMask',title:'<%=destMask%>',width:100, align:'center'},
                      {field:'destPort',title:'<%=destPort%>',width:100, align:'center'},
                      {field:'action',title:'<%=action%>',width:50, align:'center',formatter:actionFormat}
                  ]],
                  fitColumns:true,
                  singleSelect:false,
                  pagination:true,
                  pageSize:10,
                  pageList:[10,20,30,40,50]
    	});
	
    }    
    
    /** 格式化代码 */
    function protocolFormat (value,rowData,rowIndex) {
    	var html = '';
    	if (value == 6) {
    		html += 'TCP';
    	} else if (value == 17) {
    		html += 'UDP';
    	} else if (value == 1) {
    		html += 'ICMP';
    	} else if (value == 65535) {
    		html += 'ALL';
    	} 
    	return html;
    }
    
    /** 格式化代码 */
    function actionFormat (value,rowData,rowIndex) {
    	if (value == 1) {
    		return '<%=permit%>';
    	} else {
    		return '<%=prohibit%>';
    	}
    }
    
    /** 格式化代码 */
    function aclRuleFormat (value,rowData,rowIndex) {
    	var index = rowData.id;
    	var name = rowData.name;
    	var html = '<div onClick="editAclRule(\''+index+'\')"><u>'+name+'</u></div>';
    	return html;
    }
    
    function showResult(value,rowData,rowIndex) {
    	if (value == 1) {
    		return '<img src=icons/oper_ok.gif>';
    	} else {
    		return '<img src=icons/oper_error.gif>';
    	}
   }
    /** 删除防火墙策略。 */
    function delFwStrategy() {
    	var rows = $('#firewallListId').datagrid('getSelections');
    	if (rows == null || rows.length < 0) {
    		return false;
    	}
    	for(var i=0; i<rows.length; i++){
    		var row = rows[i];
    		if (row.id == null || row.id <= 0) {
    			continue;
    		}
    	    $.messager.confirm('<%=deleteFirewall%>', '<%=confirmDelFirewall%><%=quotationLeft%>' + row.name + '<%=quotationRight%><%=questionMark%>', 
    	              function(r){            
    	                 if (r){                   
    	             		$.ajax({
    	        				type : "POST",
    	        				dataType : "json",
    	        				url : "servlet/firewallServlet?way=deleteFwStrategy",
    	        				data : "id="+row.id+"&name="+row.name,
    	        				beforeSend : function(xhr) {
    	        					 showWait();
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
    	        							$.messager.alert(result.title, result.message, 'error');
    	        						}
    	        						$("#firewallListId").datagrid('reload');
    	        					}
    	        				},
    	        				error : function() {
    	        					hideWait();
    	        				}
    	        			});
    	                 }
    	             });
    	}
    } 
    /** 删除规则。 */
    function delFirewallRule() {
    		var outRuleRows = $('#aclOutRuleId').datagrid('getSelections');
    		var inRuleRows = $('#aclInRuleId').datagrid('getSelections');
    		var ruleIds="";
    		console.log("inRuleRows.length："+inRuleRows.length);
    		if (inRuleRows != null && inRuleRows.length >= 0) {
	    		for(var i=0; i<inRuleRows.length; i++){
	    			var inRuleRow = inRuleRows[i];
	    			if (inRuleRow.id == null || inRuleRow.id <= 0) {
	    				continue;
	    			}
	    			ruleIds = ruleIds + inRuleRow.id + ",";
	    			console.log("待删规则："+ruleIds);
	    		}
    		}
    		if (outRuleRows != null && outRuleRows.length >= 0) {
	    		for(var i=0; i<outRuleRows.length; i++){
	    			var outRuleRow = outRuleRows[i];
	    			if (outRuleRow.id == null || outRuleRow.id <= 0) {
	    				continue;
	    			}
	    			ruleIds = ruleIds + outRuleRow.id + ",";
	    		}
    		}
    		console.log("所有的待删规则："+ruleIds);
    		$.messager.confirm('<%=deleFirewallRule%>', '<%=confirmDelFirewallRule%><%=questionMark%>', 
  	              function(r){            
  	                 if (r){                   
  	 	    			$.ajax({
  	 	    				type : "POST",
  	 	    				dataType : "json",
  	 	    				url : "servlet/firewallServlet?way=deleteAclRule",
  	 	    				data : "ids="+ruleIds,
  	 	    				beforeSend : function(xhr) {
  	 	    					showWait();
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
  	         							$.messager.alert(result.title, result.message, 'error');
  	         						}
  	         						$('#aclOutRuleId').datagrid('reload');
  	         						$('#aclInRuleId').datagrid('reload');
  	         					}
  	 	    				},
  	 	    				error : function() {
  	 	    					hideWait();
  	 	    				}
  	 	    			}); 
  	                 }
  	             });
    }

 </script>
</body>
</html>