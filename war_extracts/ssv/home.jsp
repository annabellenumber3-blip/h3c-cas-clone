<%@page import="java.util.Random"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	StringManager sm = StringManager.getManager(StringManager.class);
	
	String homePage = sm.getString("homePage");
	String exception = sm.getString("exception");
	String recentOper = sm.getString("recentOper");
	String result = sm.getString("result");
	String startTime = sm.getString("startTime");
	String endTime = sm.getString("endTime");
	String recentAlarm = sm.getString("recentAlarm");
	String alarmContent = sm.getString("alarmContent");
	String occurTime = sm.getString("occurTime");
	String name = sm.getString("name");
	String expireDate = sm.getString("expireDate");
	String expireDateVm = sm.getString("expireDateVm");
	
	String cloudHost = sm.getString("cloudHost");
	String start = sm.getString("start");
	String close = sm.getString("close");
	String oper = sm.getString("oper");
	
	String success = sm.getString("success");
	String fail = sm.getString("fail");
	String cloudMsg = sm.getString("cloudMsg");
	String messageEnabled = (String)request.getSession().getAttribute("messageEnabled");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=homePage %></title>

</head>
<body>
	<div class="wrapper page home">
		<div class="status-back">
			<div class="status-bar">
				<div class="status status-instance">
					<div class="status-pic">
						<span class="icon"><img class="icon"
							src="icons/default/homeinstances.png"> </span>
					</div>
					<div class="status-num">
						<span id="totalId" style="color: white"></span>
					</div>

					<div class="status-name">
						<span style="color: #54C0E6"><%=cloudHost %></span>
					</div>
				</div>
				<div class="status status-start">
					<div class="status-pic">
						<span class="icon"><img class="icon"
							src="icons/default/homestart.png"> </span>
					</div>
					<div class="status-num">
						<span id="runTotalId" style="color: white"></span>
					</div>

					<div class="status-name">
						<span style="color: #73BC4A"><%=start %></span>
					</div>
				</div>
				<div class="status status-close">
					<div class="status-pic">
						<span class="icon"><img class="icon"
							src="icons/default/homeclose.png"> </span>
					</div>
					<div class="status-num">
						<span id="closeTotalId" style="color: white"></span>
					</div>

					<div class="status-name">
						<span style="color: #ED5B4C"><%=close %></span>
					</div>
				</div>
				<div class="status status-error">
					<div class="status-pic">
						<span class="icon"><img class="icon"
							src="icons/default/homequestion.png"> </span>
					</div>
					<div class="status-num">
						<span id="unknowTotalId" style="color: white"></span>
					</div>

					<div class="status-name">
						<span style="color: #F06E0E"><%=exception %></span>
					</div>
				</div>
			</div>
		</div>
		<div class="operation-table">
			<table id="operLog" class="easyui-datagrid" title="<%=recentOper %>" style="width: 750px; height: 540px"></table>
		</div>
		 <div id="warnings-table-id" class="warnings-table">
			<table id="vmList" class="easyui-datagrid" title="<%=expireDateVm %>" style="width:375px;height:270px"></table>
		</div>
		<div id="cloudMessage-id" class="warnings-table">
			<div class="panel datagrid" style="width: 375px;">
				<div class="panel-header" style="width: 352px;">
					<div class="panel-title"><%=cloudMsg %></div>
					<div id="marquee-close" onclick="closeCloudMessage()" >
						<span class="single-word-icon"></span>
					</div>
				</div>
				<div  id ="marquee-id" class="datagrid-wrap panel-body" title="" style="width: 335px; height: 194px;">
					<div id="marquee" onClick="forwardToMessage()">
						<ul id="marquee_ul">
						</ul>
					</div>
				</div>
			</div>
		</div>


		<script type="text/javascript">
		$(document).ready(function(){
			InitList();
			$.ajax({
	    		   type: "GET",
	    		   dataType:"json",
	    		   url: "servlet/vmList?way=vmStatusCount&random="+Math.random(),
	    		   success: function(result){
	    			   var total = result.total;
	    			   $("#totalId").text(total);
	    			   $("#runTotalId").text(result.runTotal);
	    			   $("#closeTotalId").text(result.closeTotal);
	    		       $("#unknowTotalId").text(result.unknownTotal);
	    		   }
	    	});
			initMarquee();
			setCloudMessageTotal();
			if ('<%=messageEnabled%>' == '0') {
				closeCloudMessage();
			}
			
		});
		
		function initMarquee() {
			$.ajax({
				type : "POST",
				dataType : "json",
				async: false,
				url : "servlet/cloudMessageServlet?way=list",
				data : "page=1&rows=20",
				beforeSend : function(xhr) {
					// showWait();
				},
				success : function(result) {
					// hideWait();
					if (result != null && typeof result != 'undefined') {
						if (result.state == 1 ) {
							 $.each(result.rows, function(){
								 var li = '<li>' + this.title + '：' + this.content +  '</li>';
								 $("#marquee_ul").append(li);
							 });  
						}
					}
				},
				error : function(xhr, textStatus, errorThrown) {
					// hideWait();
				}
			});
			$("#marquee").kxbdMarquee({isEqual:false, direction:"up",scrollDelay:"30"});
			$("#cloudMessage-id").mouseenter(function(){
				$("#marquee-close").show();
				}); 
			$("#cloudMessage-id").mouseleave(function(){
				$("#marquee-close").hide();
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
						if (result[1].cloudMessageTotal) {
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
		
		function forwardToMessage() {
			 $("#frame").layout("panel","center").panel('refresh',"message.jsp");
		}
		
		function closeCloudMessage () {
			$("#cloudMessage-id").html("");
			$("#cloudMessage-id").hide();
			$("#warnings-table-id").html("");
			$("#warnings-table-id").append('<table id="vmList" class="easyui-datagrid" title="<%=expireDateVm %>" style="width:375px;height:540px"></table>');
			InitList();
			
		}
	
	  function InitList() {
		  $("#operLog").datagrid({ 
	            url:'servlet/vmList?way=getRecentLog&random='+Math.random(), 
	            fitColumns:true,
	            singleSelect:true,    
	            onClickRow:function(rowIndex, rowData){
	            },
	            columns:[[ 
	                    {field:'description',title:'<%=oper%>',width:150,formatter:showTitle},  
	                    {field:'result',title:'<%=result%>',width:70,formatter:showResult},  
	                    {field:'startTime',title:'<%=startTime%>',width:135},
	                    {field:'endTime',title:'<%=endTime%>',width:135},
	             ]], 
                onLoadSuccess:function(data) {
                	//adjust for english version c11817
                	var headerSpanStartTime = $("tr.datagrid-header-row  > td[field='startTime'] > .datagrid-cell > span:first-child");
                	headerSpanStartTime.css("margin-left", "10px");
                	var headerSpanEndTime = $("tr.datagrid-header-row  > td[field='endTime'] > .datagrid-cell > span:first-child");
                	headerSpanEndTime.css("margin-left", "10px");
                	$("div.itemtooltip").jtooltip();
	              	if (data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
	  					  $.messager.show({
	  							title : data.title,
	  							msg : data.message,
	  							showType : 'show'
	  					 	});
	  					 return false;
	  				  }
	                }
// 	            pagination:true,
// 	            pageSize:11,
// 	            pageList:[11]
	        });    
			
			$("#vmList").datagrid({
				url:'servlet/vmList?way=getExpireVm&random='+Math.random(),
	            fitColumns:true,
	            singleSelect:true,    
	            onClickRow:function(rowIndex, rowData){
	            },
	            columns:[[ 
	                    {field:'title',title:'<%=name%>',width:120,formatter:showTitle},  
	                    {field:'expireDateStr',title:'<%=expireDate%>',width:100}, 
	                    {field:'flag',title:'',width:0, hidden:true},
	                ]], 
	            rowStyler: function(index,row){
                    if (1 == row.flag){
                        return 'color:red;';
                    } else {
                    	return 'color:orange;';
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
              	
              	
              	
              }
// 	            pagination:true,
// 	            pageSize:10,
// 	            pageList:[10]
	        });    
	  }	
	
	  function showResult(value,rowData,rowIndex) {
	    	if (value == 0) {
	    		return '<img src=icons/default/oper_ok.png title="<%=success%>">';
	    	} else {
	    		return '<img src=icons/default/oper_error.png title="<%=fail%>">';
	    	}
	 }
</script>
</body>
</html>