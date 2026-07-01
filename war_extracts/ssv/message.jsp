<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String cloudMsg = sm.getString("cloudMsg");
     String cloudMsgDesc_unis = sm.getString("cloudMsgDesc_unis");
     String cloudMsgDesc = sm.getString("cloudMsgDesc");
     
     String workOrderTitle = sm.getString("workOrderTitle");
     String msgLevel = sm.getString("msgLevel");
     String msgContent = sm.getString("msgContent");
     String delete = sm.getString("delete");
     String classcify = sm.getString("classcify");
     String msgSendTime = sm.getString("msgSendTime");
     String generalMsg = sm.getString("generalMsg");
     String importMsg = sm.getString("importMsg");
     String deleteCloudMsg = sm.getString("deleteCloudMsg");
     String confirmDeleteCloudMsg = sm.getString("confirmDeleteCloudMsg");
     String tipsDelContent = sm.getString("tipsDelContent");
     String tips = sm.getString("tips");
     String leftKey = sm.getString("leftKey");
     Object loginInfo=request.getSession().getAttribute("loginInfo");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<style type="text/css">
.form-horizontal .controls {
    margin-left: 110px;
    min-height: 35px;
}
</style>
<body style=" margin:0;padding:0;">
 <div class="wrapper page adapter">
	<div class="page-intro">
		<h1><%=cloudMsg %></h1>
		<p class="lead" id ="cloudMsgDescId"></p>
		
	</div>
	<div id="toolbar">
		    <a id="delete" href="javascript:void(0)" class="btn linkbtn btn-forbidden" onclick="del()"><span class="wordIcon">Y</span><%=delete %></a>
	</div>
	<div data-options="plain:true" style="padding:30px 0 10px 30px ; width:1100px">
	   <table id="list"></table>
	</div>
	 <p class="tips">
		* <%=tips %>：<span class="alert-info">“<%=leftKey %>”</span><%=tipsDelContent %>
	 </p>
	 <!-- 消息内容弹出框 ，默认隐藏  -->
	 <div id="windowOverId" class="window-overlay" style="diaplay:none;">
	  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-253px;left:50%;margin-left:-350px;font-size:14px;width:700px; height: auto;">
      <div class="modal-header"  style="cursor:move" >
			<h5 ><%= cloudMsg%></h5>
			<div id="modal-close" onclick="closeWorkOrder()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="applyWorkOrderFormId" class="form form-horizontal" style="border:1px;height:auto;">
			<div class="item" >
				<div class="control-label" style="width:100px"><%=msgContent%></div>
				<div class="controls">
				   <textarea id="contentId" rows="10" style="width:500px;margin-bottom:25px; resize:none" name="content" readonly></textarea>
				</div>
			</div>
	
		</form>
    </div> 
  </div>
	 
	 
	 </div>
</div>
		
<script>
    $(document).ready(function(){
    	var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
    		 $.ajax({
 				type : "POST",
 				url : "login?way=getCopyrightFrom",
 				dataType : "json",
 				success : function(rsParameter) {
 					if (rsParameter && rsParameter.value == 'UNIS' ) {
 						$("#cloudMsgDescId").text("<%= cloudMsgDesc_unis%>");
 					} else {
 						$("#cloudMsgDescId").text("<%= cloudMsgDesc%>");
 					}
 				}
    		 });
	        $("#list").datagrid({ 
	            url:'servlet/cloudMessageServlet?way=list',  
	            fitColumns:true,
	            singleSelect:true,
	            columns:[[ 
						{field:'title',title:'<%=workOrderTitle%>',width:220,formatter:showTitle},  
						{field:'msgLevel',title:'<%=msgLevel%>',width:140,formatter:showLevel},  
						{field:'content',title:'<%=msgContent%>',width:450,formatter:showContent} ,
						{field:'createTime',title:'<%=msgSendTime%>',width:200,formatter:showTime} 
	            ]],
	            onClickRow:function(rowIndex, rowData){
		        	$("#delete").removeClass("btn-forbidden");
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
	            	 setMessageRead();
	            	 $("#delete").addClass("btn-forbidden");
	            },
	            pagination:true,
	            pageSize:10,
	            pageList:[10,20,30,40,50]
	        });    
    	}
    });  
    
    function showLevel(value, rowData, rowIndex) {
    	if (value == 1) {
    		return '<%=generalMsg%>';
    	} else if (value == 2) {
    		return '<%=importMsg%>';
    	}
    }
    
    /** 格式化显示时间 */
    function showTime(value, rowData, rowIndex) {
    	if (typeof value == "undefined" || value == null) {
    		return "";
    	}
//     	issues:201607220211,Firefox v46.0.1 not support new Date(string)	--by ckf6302
    	/* var datetime = new Date(value);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second; */
		return value;
    }
    
    function del() {
    	var row = $('#list').datagrid('getSelected');
    	var index,name,flag;
    	if (row != null && row != '') {
    		index = row.id;
    		name = row.title;
    		flag = row.flag;
    	}
      	if (index == null || index <= 0) {
      		return;
      	}
      	$.messager.confirm("<%=deleteCloudMsg%>", "<%=confirmDeleteCloudMsg%>", 
      	    			function(r){            
      	    		       if (r){                   
      	    		    	   $.ajax({
      	    			 		   type: "POST",
      	    			 		   dataType:"json",
      	    			 		   url: "servlet/cloudMessageServlet?way=delete",
      	    			 		   data:"id="+index+ "&name=" +name+"&flag="+flag,
      	    			 		   success: function(result){
      	    			 			if (result != null && typeof result != 'undefined') {
      	    			 		    	if (result.success) {
      	    			 		    		$("#list").datagrid('reload'); 
      	    			 		    		//setCloudMessageTotal();
      	    			 		    		$.messager.show({          
      	    			 		    			title:result.title,            
      	    			 		    			msg:result.message, 
      	    			 		    			showType:'show'       
      	    			 		    		});
      	    			 		    	} else {
      	    			 		    		$.messager.alert(result.title,result.message,'error');
      	    			 		    	}
      	    			 		    	$("#list").datagrid('reload');
      	    			 			}
      	    			 		   }
      	    		 	      });
      	    		       }
      	       });
    }
    
    function setCloudMessageTotal() {
    	$.ajax({
			type : "GET",
			dataType : "json",
			url : "login?way=getUser",
			success : function(result) {
				// hideWait();
				if (typeof (result) == "object"){
					$("#zh-top-nav-count").html(result[1].cloudMessageTotal);
					if (result[1].cloudMessageTotal && result[1].cloudMessageTotal !=  0) {
						$("#zh-top-nav-count").css('display',''); 
					} else {
						$("#zh-top-nav-count").css('display','none');
					}
				} else {
					
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				// hideWait();
			}
		});
    }
    
    function setMessageRead() {
    	$.ajax({
	 		   type: "POST",
	 		   dataType:"json",
	 		   url: "servlet/cloudMessageServlet?way=setRead",
	 		   data:"",
	 		   success: function(result){
	 			  setCloudMessageTotal();
	 		   }
	      });
    }
	 /* 显示消息内容弹出框 */ 
    function showDetail(data){
    	var list =$("#list");
    	list.datagrid("selectRow",data);
    	var row = list.datagrid("getSelected");
    	$("#contentId").val(row.content);
    	$("#windowOverId").show();			
    }

    function showContent(value,rowData,rowIndex){
    	  if (typeof value != 'undefined') {
        	var tempValue=value;
        	if (firefoxBlowFifteen()) {
    		 		 value = toBreakWord(value, 50);
    	  }
        	return   "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+'<a style="display:inline;font-size: 14px;text-decoration:underline" onclick="showDetail('+rowIndex+')"><span>'+ tempValue +'</span></a>'
            +"<div class='tooltip_description' style='display:none;word-break:break-all '>"
    	 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;'>" +value+ "</td></tr></table>"+
        		 	 " </div></div>";
  	}
    }
    
    /* 关闭消息内容弹出框 */ 
    function closeWorkOrder(){
    	$("#windowOverId").hide();
    	$("#contentId").val("");
    }
    
    
 </script>
</body>
</html>