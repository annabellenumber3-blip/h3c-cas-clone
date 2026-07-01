<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String name = sm.getString("name");
String backupStrategyHistory = sm.getString("backupStrategyHistory");
String maxLength64 = sm.getString("maxNameRange", 64);
String nullTip = sm.getString("nullTip");
String nameIsNumber = sm.getString("nameIsNumber");
String nameNoChRange = sm.getString("nameNoChRange");
String nameNoChRangeNew = sm.getString("nameNoChRangeNew");
String peridoTime = sm.getString("peridoTime");
String dayTime = sm.getString("dayTime");
String weekTime = sm.getString("weekTime");
String monthTime = sm.getString("monthTime");
String dateTime = sm.getString("dateTime");
String timeUnit = sm.getString("timeUnit");
String date = sm.getString("date");
String desc = sm.getString("desc");
String status = sm.getString("status");
String applyTime = sm.getString("appayTime");
String backupStrategyName = sm.getString("backupStrategyName");
String effectTime = sm.getString("effectTime");
String filterQuery = sm.getString("filterQuery");
String pass = sm.getString("pass");
String waitApproval = sm.getString("waitApproval");
String reject = sm.getString("reject");
String all = sm.getString("all");
String implementOpinion = sm.getString("implementOpinion");
String delete = sm.getString("delete");
String revokeBackupStrategyHis = sm.getString("revokeBackupStrategyHis");
String confirmRevokeStrategyHis = sm.getString("confirmRevokeStrategyHis");
String quotationLeft= sm.getString("quotationLeft");
String quotationRight= sm.getString("quotationRight");
String questionMark = sm.getString("questionMark");
String backupDomain = sm.getString("backupDomain");
String historyStrategy = sm.getString("historyStrategy");
String revoked = sm.getString("revoked");
String revoke = sm.getString("revoke");
String view = sm.getString("view");
String reminderSignBtn = sm.getString("reminderSignBtn");
String approval = sm.getString("approval");
String toBeImplement = sm.getString("toBeImplement");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <script src="js/instance.js"></script>
<title><%= historyStrategy%></title>
</head>
<body>
 <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength" type="hidden" value="<%=maxLength64%>">
  <input id="nameIsNumber" type="hidden" value="<%=nameIsNumber%>">
   <input id="nameNoChRange" type="hidden" value="<%=nameNoChRange%>">
   <input id="nameNoChRangeNew" type="hidden" value="<%=nameNoChRangeNew%>">
  <div id="modal" class="wrapper page adapter">
      <a data-type="goback" href="javascript:void(0)" title="<%=sm.getString("goback")%>" class="view-type type-goback" id="backupStrategyGoBack"  style="float: right;margin: 10px;"><img src="./icons/default/goback1.png"></a>
      <div class="page-intro">
            <h1><%= historyStrategy%>
			</h1>
			<p class="lead"><%=sm.getString("historyStrategyDesc") %></p>
      </div>
    <div class="toolbar">
        <form id="applyDiskFormId" class="form form-horizontal" style="border:1px;">
          <div class="step-basicinfo">
            <div class="item" >
                <div class="control-label" style="width:140px">
                    <%=filterQuery %><span style="font-size:12px;">&nbsp;&nbsp;</span>
                </div>
                <div class="controls" >
                  <select id="resultSelect"
                  style="font-size: 14px; width: 80px; height: 30px; font-family: 'Microsoft Yahei', '微软雅黑', serif"
                  onchange="selectStrategyWorkFlow(this)">
                  <option value='-1'><%=all %>
                  <option value='10'><%=pass %>
                  <option value='0'><%=waitApproval %>
                  <option value='20'><%=reject %>
                  <option value='30'><%=revoked %>
                  </select>
                  <a id="revokeBtn" href="javascript:void(0)" class="btn linkbtn btn-forbidden" style=" margin-right: 100px ! important;" onclick="revokeStrategyHis()"><span class="wordIcon">Y</span><%= revoke%></a>
                </div>
            </div>
          </div>
        </form>
    </div> 
    <div data-options="plain:true" style="padding:30px 0 30px 10px ; width:1100px">
          <table id="my-instances"></table>
    </div>
    <div id = "workflowInfoId" class="window-overlay"></div>
  </div>

 <script>
 $(document).ready(function(){
      $(".step-vminfo").show();
      initStrategyWorkFlow(-1);
      backupStrategyGoBack();
 });
   function backupStrategyGoBack() {
	   $("#backupStrategyGoBack").bind({
			click:function(){
				$("#frame").layout("panel","center").panel('refresh','backup.jsp');
			 },
			 mouseover:function(){
				 $(".type-goback img").attr("src","./icons/default/goback0.png");
			 },
			 mouseleave:function(){
				 $(".type-goback img").attr("src","./icons/default/goback1.png");
			 }
		});
   }

   function selectStrategyWorkFlow(obj) {
   		initStrategyWorkFlow($(obj).val());
   }
   function initStrategyWorkFlow(type) {
       var urlStr = 'servlet/backupServlet?way=listStrategyHistory';
       if (type) {
    	   urlStr += '&type=' + type;
       }
       $("#my-instances").datagrid({ 
           url:urlStr, 
           singleSelect:true,
           fitColumns:true,
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
                   {field:'verifyState',title:'<%=status%>',width:45,formatter:showResult},
                   {field:'effectTime',title:'<%=effectTime%>',width:155,formatter:showEffectTime},
                   {field:'suggestion',title:'<%=implementOpinion%>',width:150,formatter:showTitle},
                   {field:'vmNames',title:'<%=backupDomain%>',width:150,formatter:showTitle},
                   {field:'createDateStr',title:'<%=applyTime%>',width:150,formatter:showTitle}
               ]],
               pagination:true,
               pageSize:10,
               pageList:[10,20,30,40,50]
       });   
   }

   
   
   function showResult(status,rowData,rowIndex) {
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
	 		 	if (navigator.userAgent.indexOf("Firefox")>0) {
	 		 	    value = toBreakWord(value, 20);
	 		 	} 
	 		 	return '<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showWorkflowDetail('+parm+')"><span title = "'+value+'">'+ tempValue +'</span></a>';
	    	}
		 	return result;
	  	}
	}
   
 //撤销云备份策略电子流
   function revokeStrategyHis() {
 	   if ($("#revokeBtn").hasClass("btn-forbidden")) {
		   return;
	   }
       var row = $("#my-instances").datagrid("getSelected");
       if (row) {
           $.messager.confirm('<%=revokeBackupStrategyHis%>', '<%=confirmRevokeStrategyHis%>', 
               function(r){            
                  if (r){                   
                      $.ajax({
                          type: "POST",
                          dataType:"json",
                          url: "servlet/backupServlet?way=revokeStrategyHistory",
                          data:"strategyIds="+row.id,
                          success: function(result){
                             if (result != null && typeof result != 'undefined') {
                                   if (result.success) {
                                       $.messager.show({          
                                           title:result.title,            
                                           msg:result.message, 
                                           showType:'show'       
                                       });
                                       $("#my-instances").datagrid('reload');
                                   } else {
                                	   $.messager.alert(result.title, result.message, 'error');
/*                                        $.messager.show({          
                                           title:result.title,           
                                           msg:result.message, 
                                           showType:'show'       
                                       }); */
                                   }
                                   //$("#my-instances").datagrid('reload'); 
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