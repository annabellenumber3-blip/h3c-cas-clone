<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	/** 多语言资源。 */
	StringManager sm = StringManager.getManager(StringManager.class);

	String cloudDisk = sm.getString("cloudDisk");
	String cloudHostName = sm.getString("cloudHostName");
	String apply = sm.getString("apply");
	String query = sm.getString("query");
	String restore = sm.getString("restore");
	String delete = sm.getString("delete");
	String loadedToHost = sm.getString("loadedToHost");
	String unloadFromHost = sm.getString("unloadFromHost");
	String capacity = sm.getString("capacity");
	String status = sm.getString("status");
	String pendingApproval = sm.getString("pendingApproval");
	String waitApproval = sm.getString("waitApproval");
	String refused = sm.getString("refused");
	String reject = sm.getString("reject");
	String pass = sm.getString("pass");
	String processing = sm.getString("processing");
	String name = sm.getString("name");
	String cloudDiskDesc = sm.getString("cloudDiskDesc");
	String approval = sm.getString("approval");
	String toBeImplement = sm.getString("toBeImplement");
	String deleteDisk = sm.getString("deleteDisk");
	String confirmDisk = sm.getString("confirmDisk");
	String confirmUnloadedFromHost = sm
			.getString("confirmUnloadedFromHost");
	String desc = sm.getString("desc");
	String applyCloudHost = sm.getString("applyCloudHost");
	String tips = sm.getString("tips");
	String leftKey = sm.getString("leftKey");
	String tipsOpeContent = sm.getString("tipsOpeContent");
	String applyDiskTip = sm.getString("applyDiskTip");
	String quotationLeft = sm.getString("quotationLeft");
	String quotationRight = sm.getString("quotationRight");
	String questionMark = sm.getString("questionMark");
	String unloadFromHostConfirm = sm
			.getString("unloadFromHostConfirm");
	String implementOpinion = sm.getString("implementOpinion");
	String cloudHostList = sm.getString("cloudHostList");
	String confirm = sm.getString("confirm");
	String cancel = sm.getString("cancel");
	String notExist = sm.getString("notExist");
	Object loginInfo = request.getSession().getAttribute("loginInfo");
	String view = sm.getString("view");
	String reminderSignBtn = sm.getString("reminderSignBtn");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style=" margin:0;padding:0;">
 	<div class="wrapper page adapter">
		<div class="page-intro">
			<h1><%=cloudDisk%></h1>
			<p class="lead"><%=cloudDiskDesc%></p>
			
		</div>
<!-- 		<div style="padding: 30px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;"> -->
<%-- 		    <%=cloudHostName %> <input id="instantInputId"   style="width:200px;height:32px;">&nbsp;&nbsp;&nbsp;&nbsp; --%>
<%-- 		  <a id="searchLogId" href="javascript:void(0)"  class="btn btn-primary" style="line-height:30px;" onclick="searchBackup()"><%=query %></a> --%>
<!-- 		</div> -->
		<div id="toolbar">
				<a id="applyDiskBtn" href="javascript:void(0)" class="btn linkbtn" onclick="applyDisk()"><span class="wordIcon">/</span><%=apply%></a>
			    <a id="loadToHostBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="loadedInHost()" style="width:120px"><span class="wordIcon">J</span><%=loadedToHost%></a>
			    <a id="unloadFromHostBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="unloadFromHost()" style="width:110px"><span class="wordIcon">&</span><%=unloadFromHost%></a>
			    <a id="deleteBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="del()"><span class="wordIcon">Y</span><%=delete%></a>
		</div>
		<div data-options="plain:true" style="padding:30px 0 30px 10px ; width:1100px">
		   <table id="diskListId"></table>
<!-- 		   <table id="diskListId2"></table> -->
		   <!-- 右键菜单 -->
<!-- 				<div id="cloudDiskmm" class="easyui-menu" style="width:120px;">      -->
<%-- 				    <div onClick="loadedInHost(1)"><%=loadedToHost%></div>    --%>
<%-- 				    <div onClick="unloadFromHost(1)"><%=unloadFromHost%></div>    --%>
<%-- 				    <div onClick="del(1)" data-options="iconCls:'icon-cancel'"><%=delete%></div>    --%>
<!-- 			    </div>  -->
		</div>
        <div id="windowOverId" class="window-overlay">
	    </div>
	    <div id = "workflowInfoId" class="window-overlay"></div>
	    <div id="windowOverId2" class="window-overlay">
<!-- 			<div id="modal" class="modal" -->
<!-- 				style="position: absolute; top: 50%; margin-top: -187px; left: 50%; margin-left: -275px; width: 550px; height: 375px; font-size: 14px;"> -->
<!-- 				<div class="modal-header" style="cursor: move"> -->
<%-- 					<h5><%=cloudHostList%></h5> --%>
<!-- 					<div id="modal-close" onclick="closeHostList()"> -->
<!-- 						<span class="single-word-icon"></span> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 				<div class="modal-content" style="height: 294px; overflow: auto;"> -->
<!-- 					<table id="cloudHostTable" style="height: 294px;"> -->
<!-- 					</table> -->
<!-- 				</div> -->

<!-- 				<div class="form-actions" -->
<!-- 					style="margin-bottom: 0px; padding-left: 180px;"> -->
<%-- 					<input class="btn" type="button" value="<%=confirm%>" --%>
<!-- 						onclick="submitLoadedToHost()"> <input class="btn" -->
<%-- 						type="button" value="<%=cancel%>" onclick="closeHostList()"> --%>
<!-- 				</div> -->
<!-- 			</div> -->
				</div>
        <p class="tips">
		* <%=tips%>：<span class="alert-info">“<%=leftKey%>”</span><%=tipsOpeContent%> <%=applyDiskTip%>
		</p>
</div>
<script type="text/javascript" src="js/cloudDisk.js"></script>	
<script type="text/javascript" src="js/common.js"></script>	
<script>
    $(document).ready(function(){
    	var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
    	    initDiskList();
    	}
    });  
    function closeHostList() {
   	  $("#windowOverId2").hide();
    }
    var cloudDiskContextRowData;
    function initDiskList() {
    	$("#diskListId").datagrid({ 
            url:'servlet/applyDiskServlet?way=list', 
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData){
            	if (rowData.state == 1) {
            		if (rowData.domainId) {
            	        $("#unloadFromHostBtn").removeClass("btn-forbidden");
            	        $("#loadToHostBtn").addClass("btn-forbidden");
            	        $("#deleteBtn").addClass("btn-forbidden").attr("onclick", "");
            		} else {
            	        $("#loadToHostBtn").removeClass("btn-forbidden");
            	        $("#unloadFromHostBtn").addClass("btn-forbidden");
            	        $("#deleteBtn").removeClass("btn-forbidden").attr("onclick", "del()");
            		}
            	} else {
            		$("#deleteBtn").removeClass("btn-forbidden").attr("onclick", "del()");;
            		$("#unloadFromHostBtn, #loadToHostBtn").addClass("btn-forbidden");
            	}
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
            	$("#loadToHostBtn").addClass("btn-forbidden");
                $("#unloadFromHostBtn").addClass("btn-forbidden");
                $("#deleteBtn").addClass("btn-forbidden");
            },
            /* 右键禁用 by w10456 2014-4-8 9:53:23
            onRowContextMenu:function(e, rowIndex, rowData) {
            	cloudDiskContextRowData = rowData;
            	e.preventDefault();               
            	$('#cloudDiskmm').menu('show', {       
            		left: e.pageX,               
            		top: e.pageY
            	});
            },*/
            columns:[[ 
                    {field:'name',title:'<%=name%>',width:150,formatter:diskShowWorkflowName},  
                    {field:'state',title:'<%=status%>',width:200,formatter:showState},
                    {field:'capacity',title:'<%=capacity%>',width:200,formatter:showCapacity},
                    {field:'handleReason',title:'<%=implementOpinion%>',width:200,formatter:showTitle},
                    {field:'title',title:'<%=applyCloudHost%>',width:200,formatter:showTitle}
                ]],  
                pagination:true,
                pageSize:10,
                pageList:[10,20,30,40,50]
        });  
    	
    }

    function diskShowWorkflowName(value,rowData,rowIndex){
    	if (typeof value != 'undefined') {
		 	var status = 1;
			if (rowData.state == 0 || rowData.state == 4) {
				status = 0;
			}
		 	var parm = "2," + rowData.id + "," + status;
		 	if (typeof value == "undefined") {
	    		value = '  ';
	    	}
	    	if (typeof value != 'undefined') {	
	    		var tempValue = value;
	 		 	//if (navigator.userAgent.indexOf("Firefox")>0) {
	 		 		//修改问题单：201707170350，firefox低于15.0版本显示有问题做个兼容
    	           if (firefoxBlowFifteen()) {
	 		 	    value = toBreakWord(value, 20);
	 		 	} 
	 		 	return "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+'<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')"><span>'+ tempValue +'</span></a>'
	 		 	+"<div class='tooltip_description' style='display:none;word-break:break-all '>"
	    	 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
    		 	 " </div></div>";
	    	}
		 	return result;
	  	}
    }

    function showState(status,rowData,rowIndex) {
    	if (status == 0) {
    		return '<img src=icons/default/waiting.png title=<%=waitApproval%>>';
        } else if (status == 1) {
        	return '<img src=icons/default/agree.png title=<%=pass%>>';
        } else if (status == 2) {
        	return '<img src=icons/default/refuse.png title=<%=reject%>>';
        } else if (status == 3) {
        	return '<img src=icons/default/question.png title=<%=notExist%>>';
        } else if (status == 4) {
        	return '<img src=icons/default/waiting.png title=<%=approval%>>';
        } else if (status == 5) {
        	return '<img src=icons/default/waiting.png title=<%=toBeImplement%>>';
        }
    	
    }
    function showCapacity(value,rowData,rowIndex) {
       return value + "GB";
    }
  //删除云硬盘
    function del(type) {
    	var row = null;
    	if (typeof type == "undefined") {
      	   row = $("#diskListId").datagrid("getSelected");
        } else {
           row = cloudDiskContextRowData;
        }
    	if (row) {
     		$.messager.confirm('<%=deleteDisk%>', '<%=confirmDisk%><%=quotationLeft%>' + row.name + '<%=quotationRight%><%=questionMark%>', 
    	    			function(r){            
    	    		       if (r){                   
    	    		    	   $.ajax({
    	    			 		   type: "POST",
    	    			 		   dataType:"json",
    	    			 		   url: "servlet/applyDiskServlet?way=delete",
    	    			 		   data:"id="+row.id + "&name=" +row.name,
    	    			 		   success: function(result){
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
	    	    			 		    	$("#diskListId").datagrid('reload'); 
	    	    			 		    	$("#deleteBtn").addClass("btn-forbidden");
    	    			 			  }
    	    			 		   }
    	    		 	      });
    	    		       }
    	       });
    	}
    }
  //打开加载到云硬盘选择云主机窗口
  function loadedInHost(type) {
	  var row = null;
  	  if (typeof type == "undefined") {
    	   row = $("#diskListId").datagrid("getSelected");
      } else {
           row = cloudDiskContextRowData;
      }
  	  if (row && row.state == 1 && !row.domainId) {
  		$("#windowOverId2").load("page/widget/selectCloudHost.jsp",function(){
  		$("#windowOverId2").show();
  		$("#cloudHostTable").datagrid({ 
  			url:'servlet/vmList?way=list&applyDiskId='+row.id,
            singleSelect:true,
            fitColumns:true,
           
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
                    {field:'title',title:'<%=name%>',width:220, formatter:showTitle},
                    {field:'description',title:'<%=desc%>',width:326, formatter:showTitle}
                ]],
                pagination:true,
                pageSize:10,
                pageList:[10,20,30,40,50]
        });    
  		});
  			
  		 
  	  }
  }
  
  //加载到云主机
  function submitLoadedToHost() {
	  var row = $("#diskListId").datagrid("getSelected");
  	  if (!row) {
           row = cloudDiskContextRowData;
      }
  	  var hostRow = $("#cloudHostTable").datagrid("getSelected");
  	  if (row && hostRow ) {
  		$.ajax({
  			type : "POST",
  			dataType : "json",
  			url : "servlet/applyDiskServlet?way=loadedToHost",
  			data:"id="+row.id + "&vmId="+ hostRow.id + "&vmName=" + hostRow.title,
  			beforeSend : function(xhr) {
  				showWait("<%=processing%>", 999999);
  			},
  			success : function(result) {
  				hideWait();
  				$("#windowOverId2").hide();
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
	  					$("#diskListId").datagrid('reload'); 
	  	            	$("#deleteBtn").addClass("btn-forbidden");
	  	            	$("#loadToHostBtn").addClass("btn-forbidden");
	  				}
  				}
  			},
  			error : function(xhr, textStatus, errorThrown) {
  				hideWait();
  			}
  		});
  	  }
  }
  //卸载云硬盘
  function unloadFromHost(type) {
	  var row = null;
  	  if (typeof type == "undefined") {
    	   row = $("#diskListId").datagrid("getSelected");
      } else {
           row = cloudDiskContextRowData;
      }
  	  if (row && row.domainId) {
  		$.ajax({
			type : "POST",
			dataType : "json",
			url : "servlet/vmList?way=getDetail",
			data:"vmId="+ row.domainId + "&cloudDiskId=" + row.id,
			success : function(result) {
				if (result != null && typeof result != 'undefined' && typeof(result.status) != 'undefined') {
					var status  =  result.status;
					var tip;
					if (status == '2' || status == '4') {
						tip = '<%=unloadFromHostConfirm%>';
					}  else {
						tip = '<%=confirmUnloadedFromHost%><%=quotationLeft%>' + row.name + '<%=quotationRight%><%=questionMark%>';
					}
			  		$.messager.confirm('<%=unloadFromHost%>', tip,
			  				function(r){            
				  				if (r){
				  			  		$.ajax({
				  			  			type : "POST",
				  			  			dataType : "json",
				  			  			url : "servlet/applyDiskServlet?way=unloadFromHost",
				  			  			data:"id="+row.id,
				  			  			beforeSend : function(xhr) {
				  			  				showWait("<%=processing%>", 999999);
				  			  			},
				  			  			success : function(result) {
				  			  				hideWait();
				  			  				$("#windowOverId").html("").hide();
				  			  				if (result != null && typeof result != 'undefined') {
				  				  				if (typeof result == 'object') {
				  				  					if (result.success) {
				  				  						$.messager.show({
				  				  							title : result.title,
				  				  							msg : result.message,
				  				  							showType : 'show'
				  				  						});
				  				  					} else {
				  				  					   $.messager.alert(result.title, result.message, 'error');
				  				  					}
				  				  				$("#diskListId").datagrid('reload'); 
				  				            	$("#deleteBtn").addClass("btn-forbidden");
				  				            	$("#unloadFromHostBtn").addClass("btn-forbidden");
				  				  				}
				  			  				}
				  			  			},
				  			  			error : function(xhr, textStatus, errorThrown) {
				  			  				hideWait();
				  			  			}
				  			  		});
				  				}
			  		 });
				} else {
					$.messager.alert(result.title, result.message, 'error');
					$("#diskListId").datagrid('reload');
					$("#unloadFromHostBtn").addClass("btn-forbidden");
        	        $("#loadToHostBtn").addClass("btn-forbidden");
        	        $("#deleteBtn").addClass("btn-forbidden").attr("onclick", "");
				}
			}
		});
  	  }
  }
 </script>
</body>
</html>