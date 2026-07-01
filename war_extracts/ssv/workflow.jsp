<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     
     String cloudWorkflow = sm.getString("cloudWorkflow");
     String cloudWrokflowDesc = sm.getString("cloudWrokflowDesc");
     String filterQuery = sm.getString("filterQuery");
     String all = sm.getString("all");
     String revoked = sm.getString("revoked");
     String finish = sm.getString("finish");
     
     String approval = sm.getString("approval");
     String waitHandler = sm.getString("waitHandler");
     String reject = sm.getString("reject");
     String modify = sm.getString("modify");
     String revoke = sm.getString("revoke");
     String toBeImplement = sm.getString("toBeImplement");
     
     String waitApproval = sm.getString("waitApproval");
     String pass = sm.getString("pass");
     String deploySuccess = sm.getString("deploySuccess");
     String deployFail = sm.getString("deployFail");
     String deleteSuccess = sm.getString("deleteSuccess");
     String deleteFail = sm.getString("deleteFail");
     String processing = sm.getString("processing");
     String revokevmWorkflow = sm.getString("revokevmWorkflow");
     
     String name = sm.getString("name");
     String status = sm.getString("status");
     String template = sm.getString("template");
     String appayTime = sm.getString("appayTime");
     String confirmRevokevmWorkflow = sm.getString("confirmRevokevmWorkflow");
     String core = sm.getString("core");
     String tips = sm.getString("tips");
     String leftKey = sm.getString("leftKey");
     String tipsOpeContent = sm.getString("tipsOpeContent");
     String tipscheckContent = sm.getString("tipscheckContent");
     String quotationLeft= sm.getString("quotationLeft");
     String quotationRight= sm.getString("quotationRight");
     String questionMark = sm.getString("questionMark");
     Object loginInfo=request.getSession().getAttribute("loginInfo");
     String implementOpinion = sm.getString("implementOpinion");
     String apply = sm.getString("apply");
     String logout = sm.getString("logout");
     String delay = sm.getString("delay");
     String view = sm.getString("view");
     String reminderSignBtn = sm.getString("reminderSignBtn");
     String type = request.getParameter("type");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0;">
	 <div class="wrapper page adapter">
		<div class="page-intro">
			<h1><%= cloudWorkflow%></h1>
			<p class="lead">
				<%=cloudWrokflowDesc %>
			</p>
		</div>
		<div id="toolbar" style="font-size:14px;">
			<a href="javascript:void(0)" id="apply" class="tab-item current"><%=apply %></a>
			<a href="javascript:void(0)" id="logout" class="tab-item" ><%=logout %></a>
			<a href="javascript:void(0)" id="delay" class="tab-item" ><%=delay %></a>
		</div>
		<div style="padding: 10px 0 5px 30px; font-size: 14px; font-family: 'Microsoft Yahei', '微软雅黑', serif;">
			<%=filterQuery %>&nbsp;&nbsp;
			<select id="resultSelect"
				style="font-size: 14px; width: 90px; height: 30px; font-family: 'Microsoft Yahei', '微软雅黑', serif"
				onchange="select(this)">
				<option value='-1'><%=all %>
				<option value='30'><%=revoked %>
				<option value='11'><%=finish %>
				<option value='0'><%=waitHandler%>
				<option value='3'><%=reject%>
			</select>
			<select id="resultSelect2"
				style="font-size: 14px; width: 90px; height: 30px; font-family: 'Microsoft Yahei', '微软雅黑', serif; display:none"
				onchange="selectCancel(this)">
				<option value='-1'><%=all %>
				<option value='30'><%=revoked %>
				<option value='2'><%=pass %>
				<option value='0'><%=waitHandler%>
				<option value='3'><%=reject%>
			</select>
			<select id="resultSelect3"
				style="font-size: 14px; width: 90px; height: 30px; font-family: 'Microsoft Yahei', '微软雅黑', serif;display:none"
				onchange="selectDelay(this)">
				<option value='-1'><%=all %>
				<option value='30'><%=revoked %>
				<option value='2'><%=pass %>
				<option value='0'><%=waitHandler%>
				<option value='3'><%=reject%>
			</select>
			<a id="editWorkflow" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="editWorkflow()">
			    <span class="wordIcon"></span><%=modify %>
			</a> 
			<a id="deleteWorkflow" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="delWorkflow()">
			    <span class="wordIcon">Y</span><%= revoke%>
			</a>
		</div>		
		<div data-options="plain:true" style="padding:30px 0 30px 10px ; width:1100px">
			<table id="workflowListId"></table>
		</div>
		 <p class="tips">
		* <%=tips %>：<span class="alert-info">“<%=leftKey %>”</span><%=tipsOpeContent %>
	 </p>
	</div>

	<!-- 		弹出来的模态窗口 -->
	<div id="windowOverId" class="window-overlay"></div>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/workflow.js"></script>
	<script>
	var type = <%=type%>;
	if (type == null) {		
		type = 1;
	}
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
    				type = 1;
    				$("#resultSelect").show();
    				$("#resultSelect").attr("value",'-1');
    				$("#resultSelect2, #resultSelect3").hide();
    				$("#editWorkflow").show().addClass("btn-forbidden").attr("onclick", "");
    				$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
    				//申请
    				initApplyWorkflowGrid();
    			} else if (index ==  1) {
    				type = 0;
    				$("#resultSelect2").show();
    				$("#resultSelect2").attr("value",'-1');
    				$("#resultSelect, #resultSelect3").hide();
    				$("#resultSelect3").hide();
    				$("#editWorkflow").hide();
    				$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
    				//注销
    				initCancelWorkflowGrid();
    			} else if (index == 2) {
    				type = 4;
    				$("#resultSelect3").show();
    				$("#resultSelect3").attr("value",'-1');
    				$("#resultSelect, #resultSelect2").hide();
    				$("#editWorkflow").hide();
    				$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
    				//延期
    				initDelayWorkflowGrid();
    			}
    		});
    		if (type == 1 || type == 3) {				
    		initApplyWorkflowGrid();
			} else if (type == 0) {
				$(".tab-item").removeClass("current");
    			$("#logout").addClass("current");
				$("#resultSelect2").show();
				$("#resultSelect2").attr("value",'-1');
				$("#resultSelect, #resultSelect3").hide();
				$("#resultSelect3").hide();
				$("#editWorkflow").hide();
				$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
				//注销
				initCancelWorkflowGrid();
			} else if (type == 4) {
				$(".tab-item").removeClass("current");
    			$("#delay").addClass("current");
				$("#resultSelect3").show();
				$("#resultSelect3").attr("value",'-1');
				$("#resultSelect, #resultSelect2").hide();
				$("#editWorkflow").hide();
				$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
				//延期
				initDelayWorkflowGrid();
    	}
    	}
    });  
    function initApplyWorkflowGrid(status) {
    	var url = 'servlet/workFlowServlet?way=list&type=' + 1;
    	if (status) {
    		url += "&status=" + status;
    	}
    	$("#workflowListId").datagrid({ 
            url:url,      
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData){
            	var row = $("#workflowListId").datagrid("getSelected");
            	//驳回
            	if (row.status == 3) {
            		//驳回注销云主机电子流
            		if (row.type  == '0') {
            			$("#editWorkflow").addClass("btn-forbidden").attr("onclick", "");
            		} else {
	            		$("#editWorkflow").removeClass("btn-forbidden").attr("onclick", "editWorkflow()");
            		}
	            	$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
                //待审批
            	}  else if (row.status == 0) {
            		$("#editWorkflow").addClass("btn-forbidden");
            		$("#deleteWorkflow").removeClass("btn-forbidden").attr("onclick", "delWorkflow()");
            	} else {
            		$("#editWorkflow").addClass("btn-forbidden");
            		$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
            	}      
            },
            columns:[[ 
                    {field:'id',title:'',width:0, hidden:true},  
                    {field:'title',title:'<%=name%>',width:100,formatter:vmShowWorkflowName},  
                    {field:'templateName',title:'<%=template%>',width:100,formatter:showTitle},  
                    {field:'status',title:'<%=status%>',width:50,formatter:showResult} ,
                    {field:'handleReason',title:'<%=implementOpinion%>',width:100,formatter:showTitle },
                    {field:'createDateStr',title:'<%=appayTime%>',width:100} 
                ]],  
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
            	$("#deleteWorkflow").addClass("btn-forbidden");
            },
            pagination:true,
            pageSize:10,
            pageList:[10,20,30,40,50]
        });    
    	$("#deleteWorkflow").addClass("btn-forbidden");
    }   
    
    function vmShowWorkflowName(value,rowData,rowIndex){
    	if (typeof value != 'undefined') {
		 	var st = 1;
			if (rowData.status == 0 || rowData.status == 1) {
				st = 0;
			}
		 	var parm = "1," + rowData.id + "," + st + "," + null + "," + rowData.type;
		 	if (typeof value == "undefined") {
	    		value = '  ';
	    	}
	    	if (typeof value != 'undefined') {	
	    		var tempValue = value;
	 		 	if (firefoxBlowFifteen()) {
	 		 	    value = toBreakWord(value, 20);
	 		 	} 
	 		 /*delete for solving 201706140775	var a = "<div class='itemtooltip' style='nowrap:false;word-break:break-all '>"+tempValue+
	 		 	"<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
	 		    + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
	 		 	" </div></div>";

	 		 	return '<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')">'+ a +'</a>';
	    	 */
	    	 	return  "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+'<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')"><span>'+ tempValue +'</span></a>'
                +"<div class='tooltip_description' style='display:none;word-break:break-all '>"
                + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
                " </div></div>";


	    	}
		 	return result;
	  	}
    }
    function vmShowWorkflowNameForCance(value,rowData,rowIndex){
    	if (typeof value != 'undefined') {
		 	var st = 1;
			if (rowData.status == 0 || rowData.status == 1) {
				st = 0;
			}
		 	var parm = "1," + rowData.id + "," + st +  ",1," + rowData.type;
		 	if (typeof value == "undefined") {
	    		value = '  ';
	    	}
	    	if (typeof value != 'undefined') {	
	    		var tempValue = value;
	 		 	if (firefoxBlowFifteen()) {
	 		 	    value = toBreakWord(value, 20);
	 		 	} 
	 		 	return  "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+'<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')"><span>'+ tempValue +'</span></a>'
                +"<div class='tooltip_description' style='display:none;word-break:break-all '>"
                + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
                " </div></div>";
	    	}
		 	return result;
	  	}
    }
    function initCancelWorkflowGrid(status) {
    	var url = 'servlet/workFlowServlet?way=list&type=' + 0;
    	if (status) {
    		url += "&status=" + status;
    	}
    	$("#workflowListId").datagrid({ 
            url:url,      
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData){
            	var row = $("#workflowListId").datagrid("getSelected");
            	//驳回
            	if (row.status == 3) {
            		//驳回注销云主机电子流
            		if (row.type  == '0') {
            			$("#editWorkflow").addClass("btn-forbidden").attr("onclick", "");
            		} else {
	            		$("#editWorkflow").removeClass("btn-forbidden").attr("onclick", "editWorkflow()");
            		}
	            	$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
                //待审批
            	}  else if (row.status == 0) {
            		$("#editWorkflow").addClass("btn-forbidden");
            		$("#deleteWorkflow").removeClass("btn-forbidden").attr("onclick", "delWorkflow()");;
            	} else {
            		$("#editWorkflow").addClass("btn-forbidden");
            		$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");;
            	}
            },
            columns:[[ 
                    {field:'id',title:'',width:0, hidden:true},  
                    {field:'title',title:'<%=name%>',width:150,formatter:vmShowWorkflowNameForCance},  
                    {field:'status',title:'<%=status%>',width:100,formatter:showResult} ,
                    {field:'handleReason',title:'<%=implementOpinion%>',width:200,formatter:showTitle },
                    {field:'createDateStr',title:'<%=appayTime%>',width:200} 
                ]],  
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
            pagination:true,
            pageSize:10,
            pageList:[10,20,30,40,50]
        });    
    }  
    function initDelayWorkflowGrid(status) {
    	var url = 'servlet/workFlowServlet?way=list&type=' + 4;
    	if (status) {
    		url += "&status=" + status;
    	}
    	$("#workflowListId").datagrid({ 
            url:url,      
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData){
            	var row = $("#workflowListId").datagrid("getSelected");
            	//驳回
            	if (row.status == 3) {
            		//驳回注销云主机电子流
            		if (row.type  == '0') {
            			$("#editWorkflow").addClass("btn-forbidden").attr("onclick", "");
            		} else {
	            		$("#editWorkflow").removeClass("btn-forbidden").attr("onclick", "editWorkflow()");
            		}
	            	$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");
                //待审批
            	}  else if (row.status == 0) {
            		$("#editWorkflow").addClass("btn-forbidden");
            		$("#deleteWorkflow").removeClass("btn-forbidden").attr("onclick", "delWorkflow()");;
            	} else {
            		$("#editWorkflow").addClass("btn-forbidden");
            		$("#deleteWorkflow").addClass("btn-forbidden").attr("onclick", "");;
            	}
            },
            columns:[[ 
                    {field:'id',title:'',width:0, hidden:true},  
                    {field:'title',title:'<%=name%>',width:150,formatter:vmShowWorkflowName},  
                    {field:'status',title:'<%=status%>',width:100,formatter:showResult} ,
                    {field:'handleReason',title:'<%=implementOpinion%>',width:200,formatter:showTitle },
                    {field:'createDateStr',title:'<%=appayTime%>',width:200} 
                ]],  
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
            pagination:true,
            pageSize:10,
            pageList:[10,20,30,40,50]
        });    
    }  
    function showResult(status,rowData,rowIndex) {
    	if (status == 0) {
    		// 待审批
    		return '<img src=icons/default/pendingApprove.png title=<%=waitApproval%>>';
        } else if (status == 1) {
        	// 审批中
        	return '<img src=icons/default/inApprove.png title=<%=approval%>>';
        } else if (status == 2 || status == 13 || status == 14) {
        	// 通过
        	return '<img src=icons/default/agree.png title=<%=pass%>>';
        } else if (status == 3) {
        	// 拒绝
        	return '<img src=icons/default/refuse.png title=<%=reject%>>';
        } else if (status == 30) {
        	// 撤销
        	return '<img src=icons/default/revoke.png title=<%=revoke%>>';
        } else if (status == 10) {
        	// 待实施
        	return '<img src=icons/default/waiting.png title=<%=toBeImplement%>>';
        } else if (status == 11) {
        	// 部署成功
        	return '<img src=icons/default/deploySuccess.png title=<%=deploySuccess%>>';
        } else if (status == 12) {
        	// 部署失败
        	return '<img src=icons/default/deployFailure.png title=<%=deployFail%>>';
        } <%-- else if (status == 13) {
        	// 删除成功
        	return '<img src=icons/default/deploySuccess.png title=<%=deleteSuccess%>>';
        } else if (status == 14) {
        	//删除失败
        	return '<img src=icons/default/deployFailure.png title=<%=deleteFail%>>';
        } --%>
        }
    
    var getExtendComplete=false;
    //修改虚拟机工作流
    function editWorkflow() {
    	var row = $("#workflowListId").datagrid("getSelected");
    	
    	if (row && row.status == 3) {
    		$.ajax({
    			type : "GET",
    			dataType : "json",
    			url : "servlet/workFlowServlet?way=getWorkflow",
    			data : "workflowId=" + row.id,
    			beforeSend : function(xhr) {
    				// showWait();
    			},
    			success : function(result) {
    				// hideWait();
    				if (result == null || typeof result == 'undefined') {
    					return false;
    				}
    				var id = result.id;
    				$("#windowOverId").load("page/widget/editWorkflow.jsp",function(){
    					$("#publicCloudType").val(result.publicCloudType);
    					
    					// 只有cas支持云硬盘、防病毒
    					if(result.publicCloudType == "2"){	
    						$("#extendCloudDiskDiv").show();
    						$("#cloudDisktr").show();
    						$("#enableAntivirusId").show();
    						
    						$("div[name='cas_flag']").show();
    						$("div[name='vmware_flag']").hide();
    					} else {
    					    $("#extendCloudDiskDiv").hide();
    					    $("#cloudDisktr").hide();
    					    $("#enableAntivirusId").hide();
    					    
    					    $("div[name='cas_flag']").hide();
    						$("div[name='vmware_flag']").show();
    					}
    					
    					$("#enableAdjustSetting").val(result.enableAdjustSetting);
    					var cpuValue = result.cpuCores;
    					var memoryValue = result.memory;
    					var storageValue = result.storage;
    					$("#cpu").children(".types-item-cpu").removeClass("selected");
    					$("#cpu").find(".cpu-options[data-value="+cpuValue+"]").parents(".types-item-cpu").addClass("selected");
    					$("#momory").children(".types-item-memory").removeClass("selected");
    					$("#momory").find(".memory-options[data-value="+memoryValue+"]").parents(".types-item-memory").addClass("selected");
    					var osVersion = result.osVersion;
    					if(result.type==3){
    						//不通过模板直接选择系统
   						
    						if (osVersion != null) {
					        	if (osVersion.indexOf("Microsoft") > -1) {//win
					        		$("#operaSystemTd").html("Windows");
					        		$.each($("#operSystemDiv input[name=operName]"),function(i,r){
		    							if(r.value=="Windows"){
		    								r.click();
		    							}
		    						});
					        		$("#versionSelect").val(osVersion);
					        	} else if (osVersion.indexOf("AIX") > -1 || osVersion.indexOf("HP") > -1) {//小型机
					        		$("#operaSystemTd").html("Unix"); 
					        		$.each($("#operSystemDiv input[name=operName]"),function(i,r){
		    							if(r.value=="Unix"){
		    								r.click();
		    							}
		    						});
					        		$("#versionSelect").val(osVersion);
					        	} else {//linux
					        		$("#operaSystemTd").html("Linux");
					        		$.each($("#operSystemDiv input[name=operName]"),function(i,r){
		    							if(r.value=="Linux"){
		    								r.click();
		    							}
		    						});
					        		$("#versionSelect").val(osVersion);
					        	}
					        } else {        	
					        	$("#operaSystemTd").html("Windows");
					        }
    						$.ajax({
    							type : "GET",
    							dataType : "json",
    							url : "servlet/workFlowServlet?way=queryApplyVmExtend",
    							async:false,
    							success : function(exParam) {
    								if(exParam.total>0){
    									reformSteps();
    									getExtendComplete=formExtend(exParam)?true:false;
    									
    								}else{
    									restoreSteps();
    								}
    							},
    				  			error : function(xhr, textStatus, errorThrown) {
    				  				// hideWait();
    				  			}
    						});		
    						
    					}else{
    						restoreSteps();
    					}
    					var arrayAppend = new Array();
    					var avs =result.vmWorkflowAppend;
    					if (avs) {
	    					if(avs.vmWorkflowId){
	    						arrayAppend[0]=avs.vmWorkflowId;
	    					}
	    					if(avs.column01){
	    						arrayAppend[1]=avs.column01;
	    					}
	    					if(avs.column02){
	    						arrayAppend[2]=avs.column02;
	    					}
	    					if(avs.column03){
	    						arrayAppend[3]=avs.column03;
	    					}
	    					if(avs.column04){
	    						arrayAppend[4]=avs.column04;
	    					}
	    					if(avs.column05){
	    						arrayAppend[5]=avs.column05;
	    					}
	    					if(avs.column06){
	    						arrayAppend[6]=avs.column06;
	    					}
	    					if(avs.column07){
	    						arrayAppend[7]=avs.column07;
	    					}
	    					if(avs.column08){
	    						arrayAppend[8]=avs.column08;
	    					}
	    					if(avs.column09){
	    						arrayAppend[9]=avs.column09;
	    					}
	    					if(avs.column10){
	    						arrayAppend[10]=avs.column10;
	    					}
	    					if(avs.column11){
	    						arrayAppend[11]=avs.column11;
	    					}
	    					if(avs.column12){
	    						arrayAppend[12]=avs.column12;
	    					}
	    					if(avs.column13){
	    						arrayAppend[13]=avs.column13;
	    					}
	    					if(avs.column14){
	    						arrayAppend[14]=avs.column14;
	    					}
	    					if(avs.column15){
	    						arrayAppend[15]=avs.column15;
	    					}
	    					if(avs.column16){
	    						arrayAppend[16]=avs.column16;
	    					}
	    					if(avs.column17){
	    						arrayAppend[17]=avs.column17;
	    					}
	    					if(avs.column18){
	    						arrayAppend[18]=avs.column18;
	    					}
	    					if(avs.column19){
	    						arrayAppend[19]=avs.column19;
	    					}
	    					if(avs.column20){
	    						arrayAppend[20]=avs.column20;
	    					}
	    					if(avs.column21){
	    						arrayAppend[21]=avs.column21;
	    					}
	    					if(avs.column22){
	    						arrayAppend[22]=avs.column22;
	    					}
	    					if(avs.column23){
	    						arrayAppend[23]=avs.column23;
	    					}
	    					if(avs.column24){
	    						arrayAppend[24]=avs.column24;
	    					}
	    					if(avs.column25){
	    						arrayAppend[25]=avs.column25;
	    					}
	    					if(avs.column26){
	    						arrayAppend[26]=avs.column26;
	    					}
	    					if(avs.column27){
	    						arrayAppend[27]=avs.column27;
	    					}
	    					if(avs.column28){
	    						arrayAppend[28]=avs.column28;
	    					}
	    					if(avs.column29){
	    						arrayAppend[29]=avs.column29;
	    					}
	    					if(avs.column30){
	    						arrayAppend[30]=avs.column30;
	    					}
	    					if(avs.column31){
	    						arrayAppend[31]=avs.column31;
	    					}
	    					if(avs.column32){
	    						arrayAppend[32]=avs.column32;
	    					}
	    					if(avs.column33){
	    						arrayAppend[33]=avs.column33;
	    					}
	    					if(avs.column34){
	    						arrayAppend[34]=avs.column34;
	    					}
	    					if(avs.column35){
	    						arrayAppend[35]=avs.column35;
	    					}
	    					if(avs.column36){
	    						arrayAppend[36]=avs.column36;
	    					}
	    					if(avs.column37){
	    						arrayAppend[37]=avs.column37;
	    					}
	    					if(avs.column38){
	    						arrayAppend[38]=avs.column38;
	    					}
	    					if(avs.column39){
	    						arrayAppend[39]=avs.column39;
	    					}
	    					if(avs.column40){
	    						arrayAppend[40]=avs.column40;
	    					}
	    					
	    					var setValueToExParam=setInterval(function(){
	    						if(getExtendComplete){
	    							var extendItems=$(".step-5 .info .tab-content").find("input,select");
	    	    					$.each(extendItems,function(i,item){
	    	    						var itemName=$(item).attr("name");
	    	    						var numberboxname=$(item).attr("numberboxname");
	    	    						if(numberboxname&&numberboxname.indexOf("OLUMN")>0){
	    	    							var boxIndex = numberboxname.substr(numberboxname.length-2,2);
	    	    					    	$("input[numberboxname=COLUMN_"+boxIndex+"]").val(arrayAppend[parseInt(boxIndex)]);
	    	    						}
	    	    					    if(itemName&&itemName.indexOf("OLUMN")>0){
	    	    					    	var itemIndex = itemName.substr(itemName.length-2,2);
	    	    					    	$("input[name=COLUMN_"+itemIndex+"]").val(arrayAppend[parseInt(itemIndex)]);
	    	    					    	if(item.type=="select-one"){
	    	    					    		$.each(item.options,function(j,op){
	    	    					    			if(op.text==arrayAppend[parseInt(itemIndex)]){
	    	    					    				op.selected="selected";
	    	    					    			}else{
	    	    					    				op.selected="";
	    	    					    			}
	    	    					    		});
	    	    					    	}
	    	    					    }
	    	    					});
	    	    					clearInterval(setValueToExParam);
	    						}
	    					},1000);
    					}
    					
    					//  问题单 201707050437   加入domainname后与模板冲突，不能部署。
    					//$("#domainNameId").val(result.title);
    					$("#titleId").val(result.title);
    					$("#descId").val(result.description);
    					$("#applyReasonId").val(result.applyReason);
    					if (result.expireDateStr) {
        					$("#expireDateId").val(result.expireDateStr);
    					}
    					var templateId = result.domainId;
    					if (templateId) {
    						$("#templateId").val(templateId);
    					}
    					$("#template").html(buildToolTip(result.templateName));
    					if (osVersion) {
    					   $("#versionTd").html(osVersion);
    					   if (osVersion.indexOf("Microsoft") > -1) {//win
				        		$("#operaSystemTd").html("Windows");
				        	} else if (osVersion.indexOf("AIX") > -1 || osVersion.indexOf("HP") > -1) {//小型机
				        		$("#operaSystemTd").html("Unix"); 
				        	} else {//linux
				        		$("#operaSystemTd").html("Linux");
				        	}
    					} else {
    						//如果为空 默认设置为Windows
    						$("#operaSystemTd").html("Windows");
    					}
    					if (cpuValue) {
    					   $("#cputd").html(cpuValue+'<%=core%>');
    					   $("#cputd").attr("data-value", cpuValue);
    					}
    					var memoryInit = result.memoryInit;
    					var memoryUnit = result.memoryUnit;
    					if (typeof(memoryInit) != 'undefined' && typeof(memoryUnit) != 'undefined') {
    					   $("#momorytd").html(memoryInit + memoryUnit);
    					}
    					if (memoryValue) {
    					   $("#momorytd").attr("data-value", memoryValue);
    					}
    					if (result.assignType == 0) {
    						$("input[name=ipconfig]:eq(0)").attr("checked",'checked'); 
    					}
    					if (result.assignType == 1) {
    						$("input[name=ipconfig]:eq(1)").attr("checked",'checked'); 
    						$("#ipId").val(result.ip);
    						$("#maskId").val(result.mask);
    						$("#gatewayId").val(result.gatyway);
    						$("#firstDnsId").val(result.firstDns);
    						$("#secondDnsId").val(result.secondDns);
    						$("#ipItemDiv, #maskItemDiv, #maskItemDiv, #gatewayItemDiv, #dnsItemDiv, #secDnsItemDiv").show();
    					}
    					
    					//时间绑定
    				    $("#modal-close").bind("click",close);
    				    $("#windowOverId").css("display", "inline-block");
    					$(".step-action .btn-next").bind("click",nextStep);
    					$(".step-action .btn-prev").bind("click",prevStep);
    					/*修改问题单201703250235，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【SSV】【云电子流】修改云电子流“申请”页面已驳回云电子流，关闭修改页面后“申请”变为灰色*/
    					$(".tab-item[class^='tab-item template']").bind("click",changeTemplate);
    					$(".tab-item[class^='tab-item template']").removeClass("current");
    					if (!result.templateName) {
 					        //自定义
    					    $("#template-custom-tab").click();
    					    $("#table-template").hide();
    					    $("#extendCloudDiskDiv").hide();
    						$("#cloudDisktr").hide();
    						$("#storage").children(".types-item-storage").removeClass("selected");
    						if (storageValue) {	
    							$("#storage").find(".storage-options[data-value="+storageValue+"]").parents(".types-item-storage").addClass("selected");
	        					$("#storagetd").html(storageValue+"GB");
	      					    $("#storagetd").attr("data-value", storageValue);
        					}
 					    } else {
 					        //模板
 					        $("#template-pre-tab").click();
    					$("#table-template").datagrid(templatePreData);
 	    					//修改问题单:201702140495 显示表格后,选中指定行    
 	    					$("#table-template").datagrid("options").view.onAfterRender=function(target) {
 	    						var gridRows = $("#table-template").datagrid("getRows");
 	    						var selectRowIndex = -1;
 	    						var templateName = result.templateName;
 	    						if (gridRows) {
 		    						for (var rowIndex = 0; rowIndex < gridRows.length; rowIndex++) {
 		    						    var rowData = gridRows[rowIndex];
 		    						    if (rowData.name == templateName) {
 		    						        selectRowIndex = rowIndex;
 		    						        break;
 		    						    }
 		    						}	
 	    						}
 	    						if (selectRowIndex > -1) {
 	    						    $("#table-template").datagrid("selectRow", selectRowIndex);//选中指定模板
 	    						    $("#table-template").datagrid("options").onClickRow(0, {});//显示模板硬盘大小
 	    						}			
 	    					};
 	    					if (storageValue) {
	 	    					$("#extendCloudDisk").val(storageValue);
	 					        $("#extendCloudDisk").numberspinner('setValue', storageValue);
	 					        changeCloudDiskCapacityTD();
 	    					}
 					    }
    					//$("#cpu").children(".cpu-options").bind("click",changeCpu);
    					$(".types-item-memory").bind("click",changeMemory);
						$(".types-item-cpu").bind("click",changeCpu);
    					//$(".types-item").bind("click",changeTypeItem);
    					
    					$(".types-item-storage").bind("click",changeStorage);
    					//$("#storagetd").parent().hide();
    					//$("#table-config").propertygrid(configData); 

    					$("#domainNameId").bind("keyup",checkVcenterDomainName);
						$("#domainNameId").bind("keyup",checkDomainReName);
						$("#domainNameId").bind("keyup",checkVcenterPreName);
    					$("#titleId").bind("keyup",checkTitle);
    					$("#titleId").bind("keyup",checkPreName);
    					$("#applyReasonId").bind("keyup",checkReason);
    					$("#descId").bind("keyup",checkDescription);
    					$("#ipId, #maskId, #gatewayId, #firstDnsId, #secondDnsId").bind("keyup",checkIpFormat);
    					$("#maskId").bind("focus",addDefaultMask);
    					$("#secondDnsId").bind("blur",contrastFirst);
    			
    		     	});
    			},
    			error : function(xhr, textStatus, errorThrown) {
    				// hideWait();
    			}
    		});
    		
    	}
    }   
 // 撤单
    function delWorkflow() {
    	var row = $("#workflowListId").datagrid("getSelected");
    	if (row && row.status == 0) {
    		$.messager.confirm('<%=revokevmWorkflow%>', '<%=confirmRevokevmWorkflow%><%=quotationLeft%>' + row.title + '<%=quotationRight%><%=questionMark%>',
    				function(r) {
    					if (r) {
    						$.ajax({
    							type : "GET",
    							dataType : "json",
    							url : "servlet/workFlowServlet?way=revoke",
    							data : "id=" + row.id + "&name=" + row.domainName
    									+ "&title=" + encodeURIComponent(encodeURIComponent(row.title)) + "&type=" + type,
    							success : function(result) {
    								if (result != null && typeof result != 'undefined') {
	    								if (result.success) {
	    									$("#workflowListId").datagrid('reload');
	    									$.messager.show({
	    										title : result.title,
	    										msg : result.message,
	    										showType : 'show'
	    									});
	    									$("#deleteWorkflow").addClass("btn-forbidden");
	    								} else {
	    									$.messager.alert(result.title, result.message, 'error');
// 	    									$.messager.show({
// 	    										title : result.title,
// 	    										msg : result.message,
// 	    										showType : 'show'
// 	    									});
	    								}
    								}
    							}
    						});
    					}
    				});
    	}
    }
</script>
</body>
</html>