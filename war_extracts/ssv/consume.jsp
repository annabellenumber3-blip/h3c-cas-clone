<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String consumerReport = sm.getString("consumerReport");
     String consumerReportDesc = sm.getString("consumerReportDesc");
     String oper = sm.getString("oper");
     String startTime = sm.getString("startTime");
     String endTime = sm.getString("endTime");
     
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style=" margin:0;padding:0;">
<div class="wrapper page">
			<div class="page-intro">
				<h1><%=consumerReport %></h1>
				<p class="lead">
					<%=consumerReportDesc%>
				</p>
				
			</div>
			<div data-options="plain:true" style="padding: 30px;">
			   <table id="list"></table>
			</div>
			
			
</div>
		
<script>
    function edit() {
    	var row = $("#list").datagrid("getSelected");
    	if(row) {
    		
    	}
    }
    
    function del() {
    	var row = $("#list").datagrid("getSelected");
    	if (row) {
    	}
    }
    $(document).ready(function(){
        $("#list").datagrid({ 
            url:'',      
            singleSelect:true,
            fitColumns:true,
            onClickRow:function(rowIndex, rowData){
            	var row = $("#list").datagrid("getSelected");
            	if (row.status == 0) {
            		$("#edit").addClass("btn-forbidden");
            		$("#delete").removeClass("btn-forbidden");
            	} else if (row.status == 20) {
            		$("#edit").removeClass("btn-forbidden");
            		$("#delete").removeClass("btn-forbidden");
            	} else {
            		$("#edit").addClass("btn-forbidden");
            		$("#delete").addClass("btn-forbidden");
            	} 
            },
            columns:[[ 
                    {field:'id',title:'',width:0, hidden:true},  
                    {field:'oper',title:'<%=oper%>',width:400},  
                    {field:'startTime',title:'<%=startTime%>',width:220,align:'center'},  
                    {field:'endTime',title:'<%=endTime%>',width:250, align:'center'} 
                ]],  
            pagination:true
        });    
    });  
    
 </script>
</body>
</html>