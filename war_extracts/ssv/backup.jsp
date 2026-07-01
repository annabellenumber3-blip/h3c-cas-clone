<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     
     String cloudBackup = sm.getString("cloudBackup");
     String cloudBackupDesc = sm.getString("cloudBackupDesc");
     String cloudHostName = sm.getString("cloudHostName");
     String query = sm.getString("query");
     String restore = sm.getString("restore");
     String delete = sm.getString("delete");
     String processing= sm.getString("processing");
     String name = sm.getString("name");
     String desc = sm.getString("desc");
     String backupHost = sm.getString("backupHost");
     String backupTime = sm.getString("backupTime");
     String status = sm.getString("status");
     
     String deleteBackup = sm.getString("deleteBackup");
     String confrimDeleteBackup = sm.getString("confrimDeleteBackup");
     String tips = sm.getString("tips");
     String leftKey = sm.getString("leftKey");
     String tipsOpeContent = sm.getString("tipsOpeContent");
     String tipscheckContent = sm.getString("tipscheckContent");
     String quotationLeft= sm.getString("quotationLeft");
     String quotationRight= sm.getString("quotationRight");
     String questionMark = sm.getString("questionMark");
     Object loginInfo=request.getSession().getAttribute("loginInfo");
     String backupInfo = sm.getString("backupInfo");
     String backupStrategy = sm.getString("backupStrategy");
     String effectTimeRange = sm.getString("effectTimeRange");
     String apply = sm.getString("apply");
     String startBackupStrategy = sm.getString("startBackupStrategy");
     String stopBackupStrategy = sm.getString("stopBackupStrategy");
     String modifyBackupStrategy = sm.getString("modifyBackupStrategy");
     String delBackupStrategy = sm.getString("delBackupStrategy");
     String historyStrategy = sm.getString("historyStrategy");
     String effectTime = sm.getString("effectTime");
     String applyTime = sm.getString("appayTime");
     String pass = sm.getString("pass");
     String waitApproval = sm.getString("waitApproval");
     String waitHandler = sm.getString("waitHandler");
     String reject = sm.getString("reject");
     String backupDomain = sm.getString("backupDomain");
     String cloudBackupStrategyDesc = sm.getString("cloudBackupStrategyDesc");
     String startStrategyContext = sm.getString("startStrategyContext");
     String stopStrategyContext = sm.getString("stopStrategyContext");
     String confirmDelStrategy = sm.getString("confirmDelStrategy");
     String strategyWorkFlowExists = sm.getString("strategyWorkFlowExists");
     String strategyWorkFlowNotExists = sm.getString("strategyWorkFlowNotExists");
     String enAbleStrategy = sm.getString("enAbleStrategy");
     String disAbleStrategy = sm.getString("disAbleStrategy");
     String monthTime = sm.getString("monthTime");
     String weekTime = sm.getString("weekTime");
     String dayTime = sm.getString("dayTime");
     String timeUnit = sm.getString("timeUnit");
     String day = sm.getString("day");
     String monthEnd = sm.getString("monthEnd");
     String monday = sm.getString("monday");
     String tuesday = sm.getString("tuesday");
     String wednesday = sm.getString("wednesday");
     String thursday = sm.getString("thursday");
     String friday = sm.getString("friday");
     String saturday = sm.getString("saturday");
     String sunday = sm.getString("sunday");
     String target = (String) request.getParameter("target");
   	 //新增字段
     String keepNumber = sm.getString("keepTimes");
     String autoReplacement = sm.getString("autoReplace");
     String yesString = sm.getString("yes2");
     String noString = sm.getString("no2");
     String revoke = sm.getString("revoke");
     String approval = sm.getString("approval");
     String toBeImplement = sm.getString("toBeImplement");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

</head>
<body style=" margin:0;padding:0;">
<input id="processing" type="hidden" value="<%=processing%>">
<input id="startBackupStrategy" type="hidden" value="<%=startBackupStrategy%>">
<input id="stopBackupStrategy" type="hidden" value="<%=stopBackupStrategy%>">
<input id="startStrategyContext" type="hidden" value="<%=startStrategyContext%>">
<input id="stopStrategyContext" type="hidden" value="<%=stopStrategyContext%>">
<input id="delBackupStrategy" type="hidden" value="<%=delBackupStrategy%>">
<input id="tips" type="hidden" value="<%=tips%>">
<input id="strategyWorkFlowExists" type="hidden" value="<%=strategyWorkFlowExists%>">
<input id="strategyWorkFlowNotExists" type="hidden" value="<%=strategyWorkFlowNotExists%>">
 <div class="wrapper page adapter">
			<div class="page-intro">
			    <div id="leadInfo">
			      <h1><%=cloudBackup %></h1>
                  <p class="lead"><%= cloudBackupDesc%></p>
			    </div>
                <div id="leadStrategy">
                  <h1><%=backupStrategy %></h1>
                  <p class="lead"><%= cloudBackupStrategyDesc%></p>
                </div>
                <div id = "historyStrategy">
                	<h1><%= historyStrategy%></h1>
					<p class="lead"><%=sm.getString("historyStrategyDesc") %></p>
                </div>
			</div>
			<div id="toolbar" style="font-size:14px;">
	            <a href="javascript:void(0)" class="tab-item backup-info current" id = "tabBackup"><%=backupInfo %></a>
	            <a href="javascript:void(0)" class="tab-item backup-strategy" id="tabBackupStrategy"><%=backupStrategy %></a>
	            <a href="javascript:void(0)" class="tab-item backup-historyStrategy" id="tabHistoryStrategy"><%=historyStrategy %></a>
            </div>
			<div id ="backup-info" style="padding: 30px 30px 10px 30px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;">
			    <%=cloudHostName %>&nbsp; <input id="instantInputId"   style="color: #555555;height: 30px;width:200px;">&nbsp;&nbsp;&nbsp;&nbsp;
			  <a id="searchLogId" href="javascript:void(0)"  class="btn" style="line-height:30px;" onclick="searchBackup()"><span class="wordIcon"></span><%=query %></a>
			  <a id="restoreBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="restore()"><span class="wordIcon">j</span><%=restore %></a>
			  <a id="deleteBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="del()"><span class="wordIcon">Y</span><%= delete%></a>
            </div>
			<div id ="backup-strategy" style="padding: 30px 30px 10px 30px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;">
              <a id="new-instance" href="javascript:void(0)"  class="btn linkbtn" onclick="applyBackupStrategy('apply')" style="width:100px"><span class="wordIcon">/</span><%=apply %></a>
              <a id="startStrategyBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="startStrategy()"><span class="wordIcon"></span><%=startBackupStrategy %></a>
              <a id="stopStrategyBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="stopStrategy()"><span class="wordIcon"></span><%= stopBackupStrategy%></a>
              <a id="modifyStrategyBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="applyBackupStrategy('modify')"><span class="wordIcon">h</span><%= modifyBackupStrategy%></a>
              <a id="deleStrategyBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="deleStrategy()"><span class="wordIcon">Y</span><%= delBackupStrategy%></a>
            </div>
            <div id ="backup-historyStrategy" style="padding: 30px 30px 10px 30px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;">
            	<div class="item" >
	                <div class="control-label" style="width:140px">
	                    <%=sm.getString("filterQuery")%><span style="font-size:12px;">&nbsp;&nbsp;</span>
	                </div>
	                <div class="controls" >
	                  <select id="resultSelect2"
	                  style="font-size: 14px; width: 80px; height: 30px; font-family: 'Microsoft Yahei', '微软雅黑', serif"
	                  onchange="filterBackupWorkFlow()">
	                  <option value='-1'><%=sm.getString("all") %>
	                  <option value='10'><%=sm.getString("pass") %>
	                  <option value='0'><%=sm.getString("waitHandler") %>
	                  <option value='20'><%=sm.getString("reject") %>
	                  <option value='30'><%=sm.getString("revoked") %>
	                  </select>
	                  <a id="revokeBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" style=" margin-right: 100px ! important;" onclick="revokeStrategyHis()"><span class="wordIcon">Y</span><%= sm.getString("revoke")%></a>
	                </div>
	                <table id="historyStrategyTable"></table>
            	</div>
            </div>
			<div id = "backupListIdDiv" data-options="plain:true" style="padding:30px 0 30px 10px ; width:1100px">
			   <table id="backupListId"></table>
			   
			   <!-- 云备份列表的右键菜单 -->
					<div id="backupmm" class="easyui-menu" style="width:120px;">     
					    <div onClick="restore(1)" data-options="iconCls:'icon-restore'"><%=restore %></div>  
					    <div onClick="del(1)" data-options="iconCls:'icon-cancel'"><%=delete %></div>   
				    </div> 
			</div>
	     <p class="tips">
			  * <%=tips %>：<span class="alert-info">“<%=leftKey %>”</span><%=tipsOpeContent %><span class="tipStrategy"><%= tipscheckContent%></span>
		 </p>
</div>
<script type="text/javascript" src="js/backup.js"></script>	
    <!--        弹出来的模态窗口 -->
    <div id="windowOverId" class="window-overlay">
    </div>
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
                    $("#backup-info").show();
                    $("#leadInfo").show();
                    $("#backup-strategy").hide();
                    $("#leadStrategy").hide();
                    $("#backupListIdDiv").show();
                    $("#backup-historyStrategy").hide();
                    $("#historyStrategy").hide();
                    $(".tipStrategy").show();
                    initBackupList();
                } else if (index == 1) {
                	
                    $("#backup-info").hide();
                    $("#leadInfo").hide();
                    $("#backup-strategy").show();
                    $("#leadStrategy").show();
                    $("#backupListIdDiv").show();
                    $("#backup-historyStrategy").hide();
                    $("#historyStrategy").hide();
                    $(".tipStrategy").hide();
                	//查询备份策略信息
                    initBackupStrategyList();
                } else {
                	$("#backup-info").hide();
                    $("#leadInfo").hide();
                    $("#backup-strategy").hide();
                    $("#leadStrategy").hide();
                    $("#backupListIdDiv").hide();
                    $("#backup-historyStrategy").show();
                    $("#historyStrategy").show();
                    $(".tipStrategy").hide();
                	//查询备份策略信息
                    initStrategyWorkFlow(-1);
                	//修改问题单201512030151：SSV云备份策略查看已撤销策略电子流，再查看备份信息，重新回到策略电子流，不做任何动作，查询选项与电子流状态不一致
                	$("#resultSelect2").val(-1);
                }
    		});
    		
    		$("#leadStrategy").hide();
    		$("#backup-strategy").hide();
    		$("#backup-historyStrategy").hide();
            $("#historyStrategy").hide();
    		initBackupList();
            $("#instantInputId").combobox({   
                url:'servlet/vmList?way=list&cloud=backup',   
                valueField:'id',   
                textField:'title',
                onSelect: function(rec){   
                    //var url = 'servlet/vmList?way=list&cloud=backup&name='+rec.name;   
                    searchBackup();
                },
                filter: function(q, row){
                    // q是你输入的值，row是数据集合
                    var opts = $(this).combobox('options');
                    // 同一转换成小写做比较，==0匹配首位，>=0匹配所有
                    return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) >= 0;
                }
            });
            
            var target = '<%=target%>';
    		if (target == "1") {
    			$("#tabBackup").click();
    		} else if (target == "2") {
    			$("#tabBackupStrategy").click();
    		} else if (target == "3") {
    			$("#tabHistoryStrategy").click();
    		}
    	}
    });  
    var backupContextRowData;
    function initBackupList() {
    	$("#backupListId").datagrid({ 
            url:'servlet/backupServlet?way=list', 
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData){
            	$("#restoreBtn, #deleteBtn").removeClass("btn-forbidden");
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
            	$("#restoreBtn").addClass("btn-forbidden");
                $("#deleteBtn").addClass("btn-forbidden");
            },
            /* 右键禁用 by w10456 2014-4-8 9:53:23
            onRowContextMenu:function(e, rowIndex, rowData) {
            	backupContextRowData = rowData;
            	e.preventDefault();               
            	$('#backupmm').menu('show', {       
            		left: e.pageX,               
            		top: e.pageY
            	});
            },*/
            columns:[[ 
                    {field:'id',title:'',width:0, hidden:true},  
                    {field:'name',title:'<%=name%>',width:150,formatter:showTitle},  
                    {field:'description',title:'<%=desc%>',width:200, formatter:showTitle},  
                    {field:'domainId',title:'',width:0, hidden:true} ,
                    {field:'domainName',title:'<%=backupHost%>',width:200, formatter:showTitle} ,
                    {field:'createTime',title:'<%=backupTime%>',width:200} 
                ]],  
                pagination:true,
                pageSize:10,
                pageNumber:1,
                pageList:[10,20,30,40,50]
        });    
    	$("#restoreBtn").addClass("btn-forbidden");
        $("#deleteBtn").addClass("btn-forbidden");
    }
    
  //删除虚拟机备份
    function del(type) {
    	var row = null;
    	if (typeof type == "undefined") {
      	   row = $("#backupListId").datagrid("getSelected");
        } else {
           row = backupContextRowData;
        }
    	if (row) {
     		$.messager.confirm('<%=deleteBackup%>', '<%=confrimDeleteBackup%><%=quotationLeft%>' + row.name + '<%=quotationRight%><%=questionMark%>', 
    	    			function(r){            
    	    		       if (r){                   
    	    		    	   $.ajax({
    	    			 		   type: "POST",
    	    			 		   dataType:"json",
    	    			 		   url: "servlet/backupServlet?way=delete",
    	    			 		   data:"id="+row.id+"&domainName="+row.domainName + "&name=" + row.name,
    	    			 		   success: function(result){
    	    			 			  if (result != null && typeof result != 'undefined') {
	    	    			 		    	if (result.success) {
	    	    			 		    		$("#backupListId").datagrid('reload'); 
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
    	    			 		   		}
    	    			 			}
    	    		 	      });
    	    		       }
    	       });
    	}
    }
	

  //恢复
  function restore(type) {
  	var row = null;
  	if (typeof type == "undefined") {
    	   row = $("#backupListId").datagrid("getSelected");
        } else {
           row = backupContextRowData;
      }
  	if(row) {
  		$("#restoreBtn").addClass("btn-forbidden");
  		$.ajax({
  			type : "POST",
  			dataType : "json",
  			url : "servlet/backupServlet?way=restore",
  			data : "id=" + row.id + "&domainId=" + row.domainId +"&domainName=" + row.domainName + "&name="+row.name,
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
  						$.messager.alert(result.title, result.message, 'error');
  					}
  				}
  				$("#restoreBtn").removeClass("btn-forbidden");
  			},
  			error : function(xhr, textStatus, errorThrown) {
  				hideWait();
  				$("#restoreBtn").removeClass("btn-forbidden");
  			}
  		});
  	}
  }
 
  //查询云备份策略信息
  function initBackupStrategyList() {
      $("#backupListId").datagrid({ 
          url:'servlet/backupServlet?way=listStrategy', 
          singleSelect:true,
          fitColumns:true,
          onClickRow:function(rowIndex, rowData){
              $("#deleStrategyBtn").attr("onclick","deleStrategy()");
              $("#modifyStrategyBtn").attr("onclick","applyBackupStrategy('modify')");
        	  var row = $(this).datagrid("getSelected");
        	  if (row.state == 1) {
        		  $("#stopStrategyBtn, #deleStrategyBtn, #modifyStrategyBtn").removeClass("btn-forbidden");
                  $("#stopStrategyBtn").attr("onclick","stopStrategy()");
        		  $("#startStrategyBtn").addClass("btn-forbidden");
        		  $("#startStrategyBtn").attr("onclick","");
        	  } else {
        		  $("#startStrategyBtn, #deleStrategyBtn, #modifyStrategyBtn").removeClass("btn-forbidden");
        		  $("#startStrategyBtn").attr("onclick","startStrategy()");
        		  $("#stopStrategyBtn").addClass("btn-forbidden");
        		  $("#stopStrategyBtn").attr("onclick","");
        	  }
          },
          onLoadSuccess:function(data) {
              initBtnStatus();
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
                  {field:'name',title:'<%=name%>',width:150,formatter:showTitle},  
                  {field:'description',title:'<%=desc%>',width:250, formatter:showTitle}, 
                  {field:'frequency',title:'',width:0,hidden:true},
                  {field:'hour',title:'',width:0,hidden:true},
                  {field:'day',title:'',width:0,hidden:true},
                  {field:'state',title:'<%=status%>',width:100, formatter:showStrategyState} ,
                  {field:'effectTime',title:'<%=effectTime%>',width:250,formatter:showEffectTime} ,
                  {field:'keepNumber',title:'<%=keepNumber%>',width:150} ,
                  {field:'autoReplacement',title:'<%=autoReplacement%>',width:200, formatter:showBooleanResult} ,
                  {field:'vmNames',title:'<%=backupDomain%>',width:280,formatter:showTitle} 
              ]],  
              pagination:true,
              pageSize:10,
              pageNumber:1,
              pageList:[10,20,30,40,50]
      });    
  }

  function initStrategyWorkFlow(type) {
      $("#historyStrategyTable").datagrid({ 
          url:'servlet/backupServlet?way=listStrategyHistory', 
          singleSelect:true,
          fitColumns:true,
          queryParams:{
        	  'type': type
        	  },
          onClickRow:function(rowIndex, rowData){
       	   if (rowData.verifyState == 0) {
       		   $(" #revokeBtn").removeClass("btn-forbidden");
       	   } else {
       		   $(" #revokeBtn").addClass("btn-forbidden");
       	   }
          },
          onLoadSuccess:function(data) {
              $("div.itemtooltip").jtooltip();
              $("#revokeBtn").addClass("btn-forbidden");
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
                  {field:'name',title:'<%=name%>',width:150,formatter:backupShowWorkflowName},
                  {field:'id',title:'',width:0, hidden:true} ,
                  {field:'description',title:'<%=desc%>',width:150,formatter:showTitle},
                  {field:'verifyState',title:'<%=status%>',width:80,formatter:showResultWorkflow},
                  {field:'effectTime',title:'<%=effectTime%>',width:155,formatter:showEffectTime},
                  {field:'suggestion',title:'<%=sm.getString("implementOpinion")%>',width:150,formatter:showTitle},
                  {field:'vmNames',title:'<%=backupDomain%>',width:150,formatter:showTitle},
                  {field:'createDateStr',title:'<%=applyTime%>',width:150,formatter:showTitle}
                  
              ]],
              pagination:true,
              pageSize:10,
              pageList:[10,20,30,40,50]
      });   
  }
  function backupShowWorkflowName(value,rowData,rowIndex){
		if (typeof value != 'undefined') {
		 	var status = 1;
			if (rowData.verifyState == 0 || rowData.verifyState == 40) {
				status = 0;
			}
		 	var parm = "4," + rowData.id + "," + status;
		 	if (typeof value == "undefined") {
	    		value = '  ';
	    	}
	    	if (typeof value != 'undefined') {	
	    		var tempValue = value;
	 		 // if (navigator.userAgent.indexOf("Firefox")>0) {
	 		 //修改问题单：201707170350，firefox低于15.0版本显示有问题做个兼容
    	        if (firefoxBlowFifteen()) {
	 		 	    value = toBreakWord(value, 20);
	 		 	} 
	 		
	 		 return "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+'<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')"><span>'+ tempValue +'</span></a>'
             +"<div class='tooltip_description' style='display:none;word-break:break-all '>"
             + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
	 		 	" </div></div>";
	 		 	//return '<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')"><span title = "'+value+'">'+ value +'</span></a>';
	    	}
		 	return result;
	  	}
	}
 
//撤销云备份策略电子流
 function revokeStrategyHis() {
	   if ($("#revokeBtn").hasClass("btn-forbidden")) {
		   return;
	   }
     var row = $("#historyStrategyTable").datagrid("getSelected");
     if (row) {
         $.messager.confirm('<%=sm.getString("revokeBackupStrategyHis")%>', '<%=sm.getString("confirmRevokeStrategyHis")%><%=quotationLeft%>'+ row.name + '<%=quotationRight%><%=questionMark%>', 
             function(r){            
                if (r){                   
                    $.ajax({
                        type: "POST",
                        dataType:"json",
                        url: "servlet/backupServlet?way=revokeStrategyHistory",
                        data:"strategyIds="+row.id+"&name="+row.name,
                        success: function(result){
                           if (result != null && typeof result != 'undefined') {
                                 if (result.success) {
                                     $.messager.show({          
                                         title:result.title,            
                                         msg:result.message, 
                                         showType:'show'       
                                     });
                                     $("#historyStrategyTable").datagrid('reload');
                                 } else {
                              	   $.messager.alert(result.title, result.message, 'error');
/*                                        $.messager.show({          
                                         title:result.title,           
                                         msg:result.message, 
                                         showType:'show'       
                                     }); */
                                 }
                                 //$("#historyStrategyTable").datagrid('reload'); 
                           }
                        }
                   });
                }
            });
     }
 }
  function showResult(status,rowData,rowIndex) {
	    if (status == 0) {
	        return '<img src=icons/default/waiting.png title=<%=waitApproval%>>';
	    } else if (status == 3) {
	        return '<img src=icons/default/agree.png title=<%=pass%>>';
	    } else if (status == 2) {
	        return '<img src=icons/default/refuse.png title=<%=reject%>>';
	    }
	}

//显示云备份策略生效状态
  function showStrategyState(value,rowData,rowIndex) {
      if (value == 1) {
         return '<img width="17px" height="17px" src=icons/default/homestart.png title=<%=enAbleStrategy%>> ';
      } else {
         return '<img width="17px" height="17px" src=icons/default/homeclose.png title=<%=disAbleStrategy%>>';
      }
  }
  function showBooleanResult(value,rowData,rowIndex) {
	  if (value == 1) {
		  return '<%=yesString%>';
	  } else {
		  return '<%=noString%>';
	  }
  }
  
//删除云备份策略
  function deleStrategy() {
      var row = $("#backupListId").datagrid("getSelected");

      if (row) {
          $.messager.confirm('<%=delBackupStrategy%>', '<%=confirmDelStrategy%><%=quotationLeft%>' + row.name + '<%=quotationRight%><%=questionMark%>', 
              function(r){            
                 if (r){                   
                     $.ajax({
                         type: "POST",
                         dataType:"json",
                         url: "servlet/backupServlet?way=deleStrategy",
                         data:"strategyId="+row.id+"&strategyName="+row.name,
                         success: function(result){
                            if (result != null && typeof result != 'undefined') {
                                  if (result.success) {
                                      $.messager.show({          
                                          title:result.title,            
                                          msg:result.message, 
                                          showType:'show'       
                                      });
                                      $("#backupListId").datagrid('reload'); 
                                  } else {
                                      $.messager.show({          
                                          title:result.title,           
                                          msg:result.message, 
                                          showType:'show'       
                                      });
                                  }
                                  $("#diskListId").datagrid('reload'); 
                            }
                         }
                    });
                 }
             });
      }
  }
  
  function initBtnStatus() {
      $("#startStrategyBtn").addClass("btn-forbidden");
      $("#startStrategyBtn").attr("onclick","");
      $("#stopStrategyBtn").addClass("btn-forbidden");
      $("#stopStrategyBtn").attr("onclick","");
      $("#deleStrategyBtn").addClass("btn-forbidden");
      $("#deleStrategyBtn").attr("onclick","");
      $("#modifyStrategyBtn").addClass("btn-forbidden");
      $("#modifyStrategyBtn").attr("onclick","");
  }
  
//显示云备份策略生效时间
  function showEffectTime(value,rowData,rowIndex) {
      //每月
      var effectTime = "";
      var rowDayStr = rowData.day;
      var rowDays = rowData.day.split(",");
      if (typeof rowData != "undefined" && rowData != null) {
          if (rowData.frequency == 0) {
              if (rowDayStr.indexOf("-1") > 0) {
                  rowDayStr = rowDayStr.substring(0,rowDayStr.indexOf("-1")-1);
              }
              if (rowDayStr.indexOf("-1") == 0) {
                  rowDayStr = " ";
              }
              
              effectTime += '<%=monthTime%> ' + rowDayStr;
              if (rowDays.length > 0) {
                  if (rowDays[0] != -1) {
                      effectTime += '<%=day%> ';
                  }
              }
              if (rowDays[rowDays.length-1] == '-1') {
                  effectTime += ' <%=monthEnd%> ';
              }
              effectTime += rowData.hour + '<%=timeUnit%>';
          } else if (rowData.frequency == 1) {
              effectTime += '<%=weekTime%> ';
              if (rowDayStr.indexOf("2") != -1) {
                  effectTime += '<%=monday%>' + ",";
              }
              if (rowDayStr.indexOf("3") != -1) {
                  effectTime += '<%=tuesday%>' + ",";
              }
              if (rowDayStr.indexOf("4") != -1) {
                  effectTime += '<%=wednesday%>' + ",";
              }
              if (rowDayStr.indexOf("5") != -1) {
                  effectTime += '<%=thursday%>' + ",";
              }
              if (rowDayStr.indexOf("6") != -1) {
                  effectTime += '<%=friday%>' + ",";
              }
              if (rowDayStr.indexOf("7") != -1) {
                  effectTime += '<%=saturday%>' + ",";
              }
              if (rowDayStr.indexOf("1") != -1) {
                  effectTime += '<%=sunday%>' + ",";
              }
              effectTime = effectTime.substring(0, effectTime.length-1);
              effectTime += " " + rowData.hour + '<%=timeUnit%>';
          } else {
              effectTime += '<%=dayTime%> ' + rowData.hour + '<%=timeUnit%>';
          }
          if (navigator.userAgent.indexOf("Firefox")>0) {
              effectTime = toBreakWord(effectTime, 50);
          }
      }
      if (effectTime.length > 20){
          var showEffectTime = effectTime.substring(0, 20) + "...";
          return "<div class='itemtooltip' style='nowrap:false;word-break:break-all '>"+showEffectTime+
           "<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
           + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +effectTime+ "</td></tr></table>"+
           " </div></div>";
      } else {
          return "<div class='itemtooltip' style='nowrap:false;word-break:break-all '>"+effectTime+
           "<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
           + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +effectTime+ "</td></tr></table>"+
           " </div></div>";
      }
  }
  
  function showResultWorkflow(status,rowData,rowIndex) {
      if (status == 0) {
         	return '<img src=icons/default/waiting.png title=<%=waitApproval%>>';
      } else if (status == 10) {
         	return '<img src=icons/default/agree.png title=<%=pass%>>';
      } else if (status == 20) {
          	return '<img src=icons/default/refuse.png title=<%=reject%>>';
      } else if (status == 30) {
   	   	return '<img src=icons/default/revoke.png title=<%=revoke%>>';
      } else if (status == 40) {
      		return '<img src=icons/default/waiting.png title=<%=approval%>>';
      } else if (status == 50) {
      		return '<img src=icons/default/waiting.png title=<%=toBeImplement%>>';
      }
  }
  
 </script>
</body>
</html>