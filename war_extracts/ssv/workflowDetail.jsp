<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	/** 多语言资源。 */
	StringManager sm = StringManager.getManager(StringManager.class);
	String workflowId = (String) request.getParameter("workflowId");
	String operType = request.getParameter("operType");
	String applyRecordId = (String) request
			.getParameter("applyRecordId");
	String status = (String) request.getParameter("status");
	String type = request.getParameter("type");
	Object loginInfo = request.getSession().getAttribute("loginInfo");
%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0;">
	<div class="wrapper page adapter">
		<div class="detail-item">
			<div class="title" style="width: 1130px;">
				<h3><%=sm.getString("processInfo")%></h3>
				<a data-type="goback" href="javascript:void(0)" title="<%=sm.getString("goback")%>" class="view-type type-goback icon-goback-normal" id="workflowGoBack"  style="float: right;margin-top: 5px;"></a>
			</div>
			<!-- 虚拟机电子流信息 -->
			<div   style="padding:10px 0 10px 50px ; width:800px;display:none;" id = "vmWorkflowInfo">
				<div class = "div-left-form">
					<div class = "div-form-group" id = "vmTitleDiv">
						<div class="label-text"><%=sm.getString("cloudHostName") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "vmTitle"></span>
					</div>
					<div class = "div-form-group" id = "vmDescription">
						<div class="label-text"><%=sm.getString("desc") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id ="vmDesc"></span>
					</div>
					<div class = "div-form-group" id = "vmOpinionDiv">
						<div class="label-text"><%=sm.getString("implementOpinion")
					+ sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "vmOpinion"></span>
					</div>
					<div class = "div-form-group" id = "expireDateStr">
						<div class="label-text"><%=sm.getString("expireDate") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "expireDate"></span>
				</div>
				</div>
				<div class = "div-right-form">
					<div class = "div-form-group" id = "applyReason">
						<div class="label-text"><%=sm.getString("applyReason") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "vmApplyReason"></span>
					</div>
					<div class = "div-form-group" id = "expireDateStrRight">
						<div class="label-text"><%=sm.getString("expireDate") + sm.getString("seperate")%></div>
						<span class = "label-value" id = "expireDateRight"></span>
					</div>
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("status") + sm.getString("seperate")%></div>
						<div class = "label-value" id = "vmState"></div>
					</div>
				</div>
			</div>
			<!-- 云硬盘信息 -->
			<div   style="padding:10px 0 10px 50px ; width:800px;display:none;" id = "cloudDiskWorkflowInfo">
				<div class = "div-left-form" >
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("name") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id ="diskName"></span>
					</div>
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("status") + sm.getString("seperate")%></div>
						<span class = "label-value" id = "diskState"></span>
					</div>
				</div>  
				<div class = "div-right-form">
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("capacity") + sm.getString("seperate")%></div>
						<span class = "label-value" id = "diskCapacity"></span>
					</div>
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("implementOpinion")
					+ sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "diskOpinion"></span>
					</div>
				</div>
			</div>
			<!-- 备份策略信息 -->
			<div style="padding:10px 0 10px 50px ; width:800px;display:none;" id = "cloudBackupWorkflowInfo">
				<div class = "div-left-form" >
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("name") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" id ="backupName"></span>
					</div>
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("status") + sm.getString("seperate")%></div>
						<span class = "label-value" id = "backupState"></span>
					</div>
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("effectTime") + sm.getString("seperate")%></div>
						<span class = "label-value" id = "backupEffectTime"></span>
					</div>
				</div>
				<div class = "div-right-form">
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("desc") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "backupDesc"></span>
					</div>
					<div class = "div-form-group" id="backupSuggestionDiv">
						<div class="label-text"><%=sm.getString("implementOpinion")
					+ sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "backupSuggestion"></span>
					</div>
					<div class = "div-form-group">
						<div class="label-text"><%=sm.getString("backupDomain") + sm.getString("seperate")%></div>
						<span class = "label-value needTooltip" data-ellipsis-len="12" id = "backupVmNames"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="detail-item" id="waitHandleOperator" style="width:1100px;display:none;">
			<div class="title" style="width: 300px;">
					<h3><%=sm.getString("handlingOperator")%></h3>
					<a id="userReminderSginBtn" href="javascript:void(0)" class="btn linkbtn"  style="float: right;margin-top:5px !important;" onclick="userReminderSginBtn()">
							<span class="wordIcon"></span><%=sm.getString("reminderSignBtn")%></a>
			</div>
			<div  id="waitHandleOperatorNames" style="padding:10px 0 10px 50px ;font-size: 15px;"></div>
		</div>
		<div class="detail-item">
			<div class="title">
					<h3><%=sm.getString("approvalProcess")%></h3>
			</div>
			<div data-options="plain:true" style="padding:0px 0 10px 10px ; width:1100px">
				<ol class="wizard-nav" id="workflowStep"></ol>
			<table id="table-approvalInfo" style="width: 1100px;"></table>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/common.js"></script>
	<script>
    	var workflowId = <%=workflowId%>;
    	var operType = <%=operType%>;
    	var applyRecordId = <%=applyRecordId%>;
    	// 流程是否结束 0：未结束， 1：结束 
    	var status = <%=status%>;
    	// 云电子流 1:申请，0：注销，4：延期
    	var type = <%=type%>;
    	var workflowName = "";
    	$(function(){  		
    		var loginInfo = '<%=loginInfo%>';
			if (loginInfo == 'null') {
				window.location.replace("login.jsp");
			} else {
				initWorkflowInfo();
			}
			workflowGoBack();
		});
    	function workflowGoBack() {
    		$("#workflowGoBack").bind({
				click:function(){
					var backPage = "home.jsp";
					if (workflowId == 1) {
						// 虚拟电子流
						backPage = "workflow.jsp";
						if (type != null) {
							backPage += "?type=" + type;  
						}
					} else if (workflowId == 2) {
						// 云硬盘电子流
						backPage = "cloudDisk.jsp";
					} else if (workflowId == 3) {
						// 用户预注册电子流
						backPage = "register.jsp";
					} else if (workflowId == 4) {
						// 备份策略电子流
						backPage = "backup.jsp?target=3";
					}
					$("#frame").layout("panel","center").panel('refresh', backPage);
				 },
				 mouseover:function(){
					 $(".type-goback").removeClass("icon-goback-normal");
					 $(".type-goback").addClass("icon-goback-select");
				 },
				 mouseleave:function(){
					 $(".type-goback").addClass("icon-goback-normal");
                     $(".type-goback").removeClass("icon-goback-select");
				 }
			});
    	}
    	function initWorkflowInfo() {
    		getStepInfo();
    		getWorkflowDtail();
    	}
    	function getStepInfo() {
    		$.ajax({
    			type : "GET",
    			dataType : "json",
    			url : "servlet/workflow?way=queryStepRecord",
    			data:"workflowId=" + workflowId + "&applyRecordId=" + applyRecordId + "&status" + status,
    			beforeSend:function(xhr){
  	 			  showWait("<%=sm.getString("processing")%>", 999999);
  	 			},
    			success : function(result) {
    				if (result && result.rows) {
    					var steps = '<li class="current "><span> <hr></span><%=sm.getString("startWorkflow")%></li>';
    					var s = 1;
    					for(var step in result.rows) {
    						if (result.rows[step].isHandle) {
    							steps += '<li class="current "><span> <hr>' + s + '</span>' + getStepType(result.rows[step].type) + '</li>';
    						} else {
    							steps += '<li ><span> <hr>' + s + '</span>' + getStepType(result.rows[step].type) + '</li>';
    						}
    						s++;
    					}
    					var status = <%=status%>;
    					if (status == 0) {
    						steps += '<li><span></span><%=sm.getString("endWorkflot")%></li>';
    					} else {	
    						steps += '<li class="current "><span></span><%=sm.getString("endWorkflot")%></li>';
    					}
    					$("#workflowStep").html(steps);
    					$("#workflowStep > li").css("width", 150 + "px");
    					//$("#workflowStep").find('hr').css("width", hrWidth + "px");
    				}
    				hideWait();
    			},
 	 		   error:function(xhr, textStatus, errorThrown) {
 		 		  hideWait();
 		 	   }
    		});
    	}
    	function getStepType(type) {
    		/* 审批类型：  1:单签->一个人审批; 2:会签->全部通过，才通过; 3:选签->只要有一个通过就通过; 4:半数签->一半人签通过，就久执行下一步。 */
    		if (type == null) {
    			return "";
    		}
    		if (type == 1) {
    			return "<%=sm.getString("singleResign")%>";
    		} else if (type == 2) {
    			return "<%=sm.getString("allResign")%>";
    		} else if (type == 3) {
    			return "<%=sm.getString("selectResign")%>";
    		} else if (type == 4) {
    			return "<%=sm.getString("halfResign")%>";
    		} else {
    			return "";
    		}
    	}
    	// 查询工作流详细信息
    	function getWorkflowDtail() {
    		var url = 'servlet/workflow?way=workflowDetail&workflowId=' + workflowId + '&applyRecordId=' + applyRecordId;
    		$.get(url, "", function(result){
    			if (result != null && result.state == 0) {    	
    				var data = result.data;
    				workflowName = data.name;
    				if (workflowId == 1) {
    					workflowName = data.title;
    					$("#vmName").html(data.domainName);
    					$("#vmDesc").html(data.description);
    					$("#vmState").html(getVmStatusShow(data.status));
    					if ("title" in data) {    						
    						$("#vmTitle").html(data.title);
    					} else {
    						$("#vmTitleDiv").hide();
    					}
    					$("#vmApplyReason").html(data.applyReason);
    					if ("handleReason" in data) {    						
    						$("#vmOpinion").html(data.handleReason);
    						$("#expireDateStr").hide();
	    		    		if ("expireDateStr" in data) {
	    		    			$("#expireDateRight").html(data.expireDateStr);
    					} else {
	    		    			$("#expireDateStrRight").hide();
	    		    		}
    					} else {
    						$("#vmOpinionDiv").hide();
    						$("#expireDateStrRight").hide();
	    		    		if ("expireDateStr" in data) {
	    		    			$("#expireDate").html(data.expireDateStr);
	    		    		} else {
	    		    			$("#expireDateStr").hide();
    					}
    					}
    					
    		    		if (operType && operType == 1) {
    		    			$("#applyReason").hide();
    		    			$("#vmDescription").hide();
    					} else {
    						$("#applyReason").show();
    		    			$("#vmDescription").show();
    					}
    					$("#vmWorkflowInfo").show();
    				} else if (workflowId == 2) {
    					$("#diskName").html(data.name);
    					//$("#diskName").attr("title", data.name);
    					var status = data.state;
    					var st = getDiskStatusShow(status);
    					
    					
    					$("#diskState").html(st);
    					$("#diskCapacity").html(data.capacity + "GB");
    					$("#diskOpinion").html(data.handleReason);
    					//$("#diskOpinion").attr("title", data.handleReason);
    					$("#cloudDiskWorkflowInfo").show();
    				} else if (workflowId == 4) {
    					$("#backupName").html(data.name);
    					//$("#backupName").attr("title", data.name);
    					$("#backupDesc").html(data.description);
    					//$("#backupDesc").attr("title", data.description);
    					if ("suggestion" in data) {    						
	    					$("#backupSuggestion").html(data.suggestion);
    						//$("#backupSuggestion").attr("title", data.suggestion);
    					} else {
    						$("#backupSuggestionDiv").hide();
    					}
    					
    					var effectTime = showEffectTime(null, data, 0);
    					$("#backupEffectTime").html(effectTime);
    					$("#backupState").html(getBackupStatusShow(data.verifyState));
    					$("#backupVmNames").html(data.vmNames);
    					//$("#backupVmNames").attr("title", data.vmNames);
    					//$("#backupSuggestion").html(data.createDate);
    					$("#cloudBackupWorkflowInfo").show();
    				}
    				$(".needTooltip").each(function(){
    					$(this).html(buildToolTip($(this).html(),$(this)));
    				});
    				$("div.itemtooltip").jtooltip();
    		    	//$("#worklfowDtail").html(data.name);
    			}
    		 },"json");
    	}
    	function buildToolTip(value,obj){
	    	var tempValue = value;
			return "<div class='itemtooltip' style='overflow:hidden;text-overflow:ellipsis;word-break:break-all;'>"+tempValue+
            "<div class='tooltip_description' style='display:none;word-break:break-all;'>"
            + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all'>" +value+ "</td></tr></table>"+
		 	 " </div></div>";
		}
    	function getVmStatusShow(status) {
    	   if (status == 0) {
              	return '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("waitApproval")%>"><%=sm.getString("waitApproval")%></span>';
           } else if (status == 2) {
              	return '<span><img src="icons/default/agree.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("pass")%>"><%=sm.getString("pass")%></span>';
           } else if (status == 1) {
           		return '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("approval")%>"><%=sm.getString("approval")%></span>';
           } else if (status == 3) {
               	return '<span><img src="icons/default/refuse.png" style="position:relative;bottom:-4px;" style="position:relative;bottom:-4px;" title="<%=sm.getString("reject")%>"><%=sm.getString("reject")%></span>';
           } else if (status == 10) {
        	   return '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("toBeImplement")%>"><%=sm.getString("toBeImplement")%></span>';
           } else if (status == 11) {
           	// 部署成功
           		return '<span><img src="icons/default/deploySuccess.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("deploySuccess")%>"><%=sm.getString("deploySuccess")%></span>';
           } else if (status == 12) {
           	// 部署失败
           		return '<span><img src="icons/default/deployFailure.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("deployFail")%>"><%=sm.getString("deployFail")%></span>';
           } else if (status == 13) {
           	// 删除成功
           		return '<span><img src="icons/default/deploySuccess.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("deleteSuccess")%>"><%=sm.getString("deleteSuccess")%></span>';
           } else if (status == 14) {
           	//删除失败
           		return '<span><img src="icons/default/deployFailure.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("deleteFail")%>"><%=sm.getString("deleteFail")%></span>';
           } else if (status == 30) {
        	// 撤销
        	   	return '<span><img src="icons/default/revoke.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("revoke")%>"><%=sm.getString("revoke")%></span>';
           } 
    	}
    	function getDiskStatusShow(status) {
    		var st = "";
    		if (status == 0) {
				st = '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("waitApproval")%>"><%=sm.getString("waitApproval")%></span>';
	        } else if (status == 1) {
	        	st = '<span><img src="icons/default/agree.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("pass")%>"><%=sm.getString("pass")%></span>';
	        } else if (status == 2) {
	        	st = '<span><img src="icons/default/refuse.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("reject")%>"><%=sm.getString("reject")%></span>';
	        } else if (status == 3) {
	        	st = '<span><img src="icons/default/question.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("notExist")%>"><%=sm.getString("notExist")%></span>';
	        } else if (status == 4) {
	        	st = '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("approval")%>"><%=sm.getString("approval")%></span>';
	        } else if (status == 5) {
	        	st = '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("toBeImplement")%>"><%=sm.getString("toBeImplement")%></span>';
	        }
    		return st;
    	}
    	function getBackupStatusShow(status) {
    		if (status == 0) {
              	return '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("waitApproval")%>"><%=sm.getString("waitApproval")%></span>';
           } else if (status == 10) {
              	return '<span><img src="icons/default/agree.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("pass")%>"><%=sm.getString("pass")%></span>';
           } else if (status == 20) {
               	return '<span><img src="icons/default/refuse.png" style="position:relative;bottom:-4px;" style="position:relative;bottom:-4px;" title="<%=sm.getString("reject")%>"><%=sm.getString("reject")%></span>';
           } else if (status == 30) {
        	   	return '<span><img src="icons/default/revoke.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("revoke")%>"><%=sm.getString("revoke")%></span>';
           } else if (status == 40) {
           		return '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("approval")%>"><%=sm.getString("approval")%></span>';
           } else if (status == 50) {
           		return '<span><img src="icons/default/waiting.png" style="position:relative;bottom:-4px;" title="<%=sm.getString("toBeImplement")%>"><%=sm.getString("toBeImplement")%></span>';
           }
    	}
    	var index = 1;
    	var workflowPreData={
    			url : 'servlet/workflow?way=queryApprovalRecord&workflowId=' + workflowId + '&applyRecordId=' + applyRecordId,
    			singleSelect : true,
    			fitColumns:true,
    			showGroup:true,
    			groupField:'workflowStepId',
    			groupFormatter:function(group,rows) {
    				var step = '<%=sm.getString("di")%>' + index + '<%=sm.getString("step")%>';
    				index ++ ;
    				return step;
    			},
    			onClickRow:function(rowIndex, rowData){
    				
    			},
    			onLoadSuccess:function(data) {
    				// handlering
					$("div.itemtooltip").jtooltip();
    				var waitOperator = "";
    				if (status == 0 && data.rows) {
    					var mycars = new Array();
    					var flag = false;//判断是否重复存在
    					for(var i in data.rows) {
    						var r = data.rows[i];
    						if (r.handleResult == 0 && r.status == 1) {
    							if (typeof(r.handleOpName) != "undefined") {   
    								for (i=0;i<mycars.length;i++) {
    									if (mycars[i] == r.handleOpName) {
    										flag = true;
    									}
    								}
    								if (!flag) {    									
    									waitOperator += r.handleOpName + "<%=sm.getString("comma")%>&nbsp";
    									mycars.push(r.handleOpName);
    								}
    								flag = false;
    							}
    						}
    					}
    					$("#waitHandleOperator").show();
    					$("#waitHandleOperatorNames").html(waitOperator.replace(/(^<%=sm.getString("comma")%>&nbsp*)|(<%=sm.getString("comma")%>&nbsp*$)/g, ""));
    				}
    			},
    			columns : [ [{
    				field : 'id',
    				title : 'ID',
    				width : 0,
    				hidden:true
    			 }, 
    			 {
    				title : '<%=sm.getString("handlerOpName")%>',
    				field : 'handleOpName',
    				width : 50
    			 },
    			 {
    				title : '<%=sm.getString("handleResult")%>',
    				field : 'handleResult',
    				formatter:showResult,
    				width : 50
    			 },
    			 {
      				title : '<%=sm.getString("handlerDate")%>',
      				field : 'handleDate',
      				width : 100
      			 },
    			 {
    				title : '<%=sm.getString("handleReason")%>',
    				field : 'handleReason',
    				width : 150,
    				formatter:function showTitle(value,rowData,rowIndex){
			    				    if ( value != '' && typeof value != 'undefined' ) {			    				
			    				    	return  "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+ value +
			    					 	 "<div class='tooltip_description' style='display:none;word-break:break-all '>"
			    					 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
			    				    		 	 " </div></div>";
    					}
    				}
    			 }]],
    			pagination:false
    		};
    		function showResult(value,rowData,rowIndex) {
    			if (value) {
    		    	if (value == 1) {
    		    		return '<%=sm.getString("pass")%>';
    		    	} else if (value == 2) {
    		    		return '<%=sm.getString("overrule")%>';
    		    	} else if (value == 3) {
    		    		return '<%=sm.getString("trunApprovael")%>';
    		    	}
    			} else {
    				return '<%=sm.getString("pendingApproval")%>';
    			}
    		};
    		$("#table-approvalInfo").propertygrid(workflowPreData);
    		
    		function userReminderSginBtn() {
    		   		$.messager.confirm('<%=sm.getString("reminderSign")%>', '<%=sm.getString("confirmReminderSign")%><%=sm.getString("quotationLeft")%>' + workflowName + 
    		   				'<%=sm.getString("quotationRight")%><%=sm.getString("questionMark")%>',
						function(r) {
							if (r) {
									$.ajax({
										type : "POST",
										dataType : "json",
										url : "servlet/workflow?way=reminderSign",
										data : "workflowId=" + workflowId + "&applyRecordId="+ applyRecordId + "&name=" + workflowName,
										success : function(result) {
											if (result != null && typeof result != 'undefined') {
												if (result.success) {
													$.messager.show({
														title : result.title,
														msg : result.message,
														showType : 'show'
													});
												} else {
													$.messager.show({
														title : result.title,
														msg : result.message,
														showType : 'show'
													});
												}
											}
										}
								});
							}
				});
		}
	</script>
</body>
</html>