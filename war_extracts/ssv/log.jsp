<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);

String operLog = sm.getString("operLog");
String logDesc = sm.getString("logDesc");
String operResult = sm.getString("operResult");
String all = sm.getString("all");
String success = sm.getString("success");
String fail = sm.getString("fail");
String startTime = sm.getString("startTime");
String endTime = sm.getString("endTime");
String query = sm.getString("query");
String oper = sm.getString("oper");
String failureReason = sm.getString("failureReason");
String datetimepickerJsPath = sm.getString("datetimepickerJsPath");
String tips = sm.getString("tips");
String leftKey = sm.getString("leftKey");
String tipscheckContent = sm.getString("tipscheckContent");
Object loginInfo=request.getSession().getAttribute("loginInfo");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style=" margin:0;padding:0;">
       <div class="wrapper page adapter">
			<div class="page-intro">
				<h1><%=operLog %></h1>
			<p class="lead">
				<%=logDesc %>
			</p>
			</div>
			<div style="padding: 30px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif;">
<!-- 			     云主机        <input id="instantceId" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp; -->
			   <%=operResult %> &nbsp;&nbsp;  <select id="resultSelect" style="font-size:14px;width:80px;height:30px;font-family: 'Microsoft Yahei', '微软雅黑', serif"> 
			              <option value=''><%=all %> 
			              <option value='0'><%=success %> 
			              <option value='1'><%=fail %>
			            </select>&nbsp;&nbsp;&nbsp;&nbsp;
			    <%=startTime %>   <input id="startTimeId" style="width:176px;height:25px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif" readonly="readonly">&nbsp;&nbsp;&nbsp;&nbsp;
			    <%= endTime%>  <input id="endTimeId" style="width:176px;height:25px;font-size:14px;font-family: 'Microsoft Yahei', '微软雅黑', serif" readonly="readonly">&nbsp;&nbsp; &nbsp;&nbsp;
			    
			  <a id="searchLogId" href="javascript:void(0)"  class="btn" style="line-height:30px;" onclick="searchLog()"><span class="wordIcon"></span><%=query %></a>
			</div>
			<div data-options="plain:true" style="padding:5px 0px 30px 10px ; width:1100px">
			   <table id="logListId"></table>
			</div>
			 <p class="tips">
		* <%= tips%> ：<%= tipscheckContent%>
	 </p>
	 </div>
<script type="text/javascript" src="js/log.js"></script>
<script>
	var startDateTimePicker,endDateTimePicker;
    $(document).ready(function(){
    	var loginInfo = '<%=loginInfo%>';
    	if (loginInfo == 'null') {
    		window.location.replace("login.jsp");
    	} else {
		   	initLogGrid();
		   	var datetime = new Date();
		   	var datestr = getAllDate(datetime);
		   	var timestr = getHourTime(datetime);
		   	var dateTimeString = getAllDate(datetime) + " 00:00:00";
		   	var dateTimeStr = datestr + " " + timestr;
		   	
		   	var setMaxMinForStart =  function (currentDateTime){
		   		var endDate = endDateTimePicker.val().split(" ")[0];
		   		var endTime = endDateTimePicker.val().split(" ")[1];
		   		var endHour = endTime.split(":",1)[0] + ":00";
		   		var endDateTime = startDateTimePicker.val();
		   		var selectedDatestr = getAllDate(currentDateTime);
		   		if (selectedDatestr != endDate) {
					this.setOptions({value:endDateTime,maxDate:endDate,formatDate:'Y-m-d',maxTime:false,formatTime:'H:i'});
				} else {
					this.setOptions({value:endDateTime,maxDate:endDate,formatDate:'Y-m-d',maxTime:endHour,formatTime:'H:i'});
				}
		   		if (endDate != datestr) {
		   			this.setOptions({todayButton:false});
		   		} else if (endDate == datestr) {
		   			this.setOptions({todayButton:true});
		   		}
		    };
		    
		    var  setMaxMinOnSelected = function (currentDateTime,$input){
				if (currentDateTime != null) {
					var selectedDatestr = getAllDate(currentDateTime);
					var selectedTimestr = getHourTime(currentDateTime);
					var selectedDataTime = selectedDatestr + " " + selectedTimestr;
					var endDate = endDateTimePicker.val().split(" ")[0];
					var endTime = endDateTimePicker.val().split(" ")[1];
					var endHour = endTime.split(":",1)[0] + ":00";
					if (selectedDatestr != endDate) {
						this.setOptions({maxTime:false,value:selectedDataTime});
					} else {
						this.setOptions({maxTime:endHour,formatTime:'H:i',value:selectedDataTime});
					}
				}
		    };
		    
			var setMaxMinForEnd = function (currentDateTime,$input){
				if (currentDateTime != null) {
					var selectedDatestr = getAllDate(currentDateTime);
					var selectedTimestr = getHourTime(currentDateTime);
					var selectedHourMinutestr = getHourMinute(currentDateTime);
					var selectedDataTime = selectedDatestr + " " + selectedTimestr;
					var startDate = startDateTimePicker.val().split(" ")[0];
					var startTime = startDateTimePicker.val().split(" ")[1];
					var startHour = startTime.split(":",1)[0] + ":00";
					if (selectedTimestr != timestr) {
						selectedDataTime = selectedDatestr + " " + selectedHourMinutestr;
					}
					if (selectedDatestr == datestr) {
						this.setOptions({maxTime:timestr,minTime:false,value:selectedDataTime});
					} else if (selectedDatestr == startDate) {
						this.setOptions({value:selectedDataTime,maxTime:false,minTime:startHour,formatTime:'H:i'});
					} else {
						this.setOptions({maxTime:false,minTime:false,value:selectedDataTime});
					}
				}
		    };
		    
		    var setMinForEnd = function (currentDateTime) {
		    	var selectedDatestr = getAllDate(currentDateTime);
				var startDate = startDateTimePicker.val().split(" ")[0];
				var startTime = startDateTimePicker.val().split(" ")[1];
				var startHour = startTime.split(":",1)[0] + ":00";
				if (selectedDatestr != startDate) {
					this.setOptions({minDate:startDate,formatDate:'Y-m-d',minTime:false,formatTime:'H:i'});
				} else {
					this.setOptions({minDate:startDate,formatDate:'Y-m-d',minTime:startHour,formatTime:'H:i'});
				}
		    	
		    };
		    
		   	startDateTimePicker = $('#startTimeId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d H:i:s',value:dateTimeString,maxDate:'today',maxTime:'timestr',onShow:setMaxMinForStart,onChangeDateTime:setMaxMinOnSelected});
		   	endDateTimePicker = $('#endTimeId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d H:i:s',value:dateTimeStr,maxDate:'today',maxTime:'timestr',onShow:setMinForEnd,onChangeDateTime:setMaxMinForEnd});
    	}
    });  
    
    /** 格式化显示时间 */
    function getDateTime(datetime) {
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
    }
    
    function getAllDate(datetime) {
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        return year + "-" + month + "-" + date;
    }
    
    function getHourTime(datetime) {
    	 var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
         var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
         var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
         return hour+":"+minute+":"+second;
    }
    
    function getHourMinute(datetime) {
    	 var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
         var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
         return hour+":"+minute+":00";
    }
    
    
    function initLogGrid() {
    	$("#logListId").datagrid({ 
            url:'servlet/vmList?way=getLog', 
            fitColumns:true,
            singleSelect:true,    
            onClickRow:function(rowIndex, rowData){
            },
            columns:[[ 
                    {field:'description',title:'<%=oper%>',width:150,formatter:showTitle},  
                    {field:'result',title:'<%=operResult%>',width:70, formatter:showResult},  
                    {field:'startTime',title:'<%=startTime%>',width:135} ,
                    {field:'endTime',title:'<%=endTime%>',width:135},
                    {field:'failureReason',title:'<%=failureReason%>',width:300,formatter:showTitle} 
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
            },
            pagination:true,
            pageSize:10,
            pageList:[10,20,30,40,50]
        });    
    }
    function showResult(value, rowData, rowIndex) {
    	if (value == 0) {
    		return '<img src=icons/default/oper_ok.png title="<%=success%>">';
    	} else {
    		return '<img src=icons/default/oper_error.png title="<%=fail%>">';
    	}
    }
</script>
</body>
</html>