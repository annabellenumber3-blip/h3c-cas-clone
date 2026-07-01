<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
String vmId = request.getParameter("vmId");
String type = request.getParameter("type");
StringManager sm = StringManager.getManager(StringManager.class);
String cpuUtilization = sm.getString("cpuUtilization");
String memoryUtilization = sm.getString("memoryUtilization");
String diskUsage = sm.getString("diskUsage");
String netUsage = sm.getString("netUsage");
String cancel = sm.getString("cancel");
String name = sm.getString("cloudSafety.host");
String timeSlot = sm.getString("timeSlot");
String monitor = sm.getString("monitor");
String noMonitorData = sm.getString("noMonitorData");
String space = sm.getString("space");
String minute = sm.getString("minute");
String datetimepickerJsPath = sm.getString("datetimepickerJsPath");
String percentage = sm.getString("percentage");
String usageRate = sm.getString("usageRate");
String second = sm.getString("second");
String throughput = sm.getString("throughput");
String query = sm.getString("query");
%>
<html>
<body>
  <input id="vmIdDetail" type="hidden">
  <input id="typeDetail" type="hidden">
  <div id="modal" class="modal" style="position: absolute; top:50%; margin-top:-300px;left:50%;margin-left:-400px;font-size:14px;width:1000px;height:600px">
      <div class="modal-header"  style="cursor:move" >
			<h5><%= monitor%></h5>
			<div id="modal-close" onclick="closeChartDetail()"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="applyDiskFormId" class="form form-horizontal" style="border:1px;" onkeydown='ClearSubmit(event, "submitId")'>
			<div class="item">
				<div class="control-label"><%=timeSlot%><span style="color:red">&nbsp;</span></div>
				<div class="controls oneline">
					<input id="startDateId"  oninput="changeStart(event)" style="width:246px;padding:7px 10px;height:28px;box-sizing:content-box;" readonly="readonly">					
					<span style="margin:0 10px;">-</span>
					<input id="endDateId"  style="width:246px;padding:7px 10px;height:28px;box-sizing:content-box;" readonly="readonly">
					<input class="btn" style="margin-left:20px"  id="submitId" type="button" value="<%=query%>" onclick="queryDetail()"> 
				</div>
			</div>
			<div>
				<div class="tab-content">
					<div class="monitor">
						<div class="charts">
							<div class="bigChart" id="cpuChartDetail" style="display:none">
								<h3><%=cpuUtilization%></h3>
								<div class="lineChart">
								  <div id="flot-placeholder6" style="width:860px;height:300px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>	
								</div>
							</div>
							<div class="bigChart" id="memoryChartDetail" style="display:none">
								<h3><%=memoryUtilization%></h3>
								<div class="lineChart">
								  <div id="flot-placeholder7" style="width:860px;height:300px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>	
								</div>
							</div>
							<div class="bigChart" id="diskIOChartDetail" style="display:none;">
								<h3><%=diskUsage%></h3>
								<p id="diskUsagePP">KBps</p>
								<div class="lineChart">
								  <div id="flot-placeholder8" style="width:860px;height:300px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>	
								</div>
							</div>
							<div class="bigChart" id="netIOChartDetail" style="display:none;">
								<h3><%=netUsage%></h3>
								<p id="netUsagePP">Mbps</p>
								<div class="lineChart">
								  <div id="flot-placeholder9" style="width:860px;height:300px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>	
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
    </div> 
  </div>
 <script type="text/javascript" src="js/queryDetailChart.js"></script>
 <script>
   $(document).ready(function(){
		data3 = {
				vmId: '<%=vmId%>',
				type:'<%=type%>',
		      };
		getDistributeDate();
        var oldEndTime = new Date();
        var endTime = new Date();
        var lastDate = new Date();
        var datestr = getAllDate(endTime);
        var timestr = getHourTime(endTime);
        console.log("datestr:" + datestr);
        endTimeLong = endTime.getTime();
        var formatEndTime = formatTime(endTime);
        var initTime = new Date(endTime - 1000*60*60);
        var oldStartTime = new Date(endTime - 1000*60*60);
        startTimeLong = initTime.getTime();
        var formatStartTime = formatTime(initTime);
        var now = endTimeLong;
        var reasonStartDateStr,reasonEndDateStr;       
        function formatTime (time) {
	        var month = time.getMonth() + 1;
	        if (month < 10) {
	            month = "0" + month;
	        }
	        var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
	        var hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
	        var minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
	        var seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
	        return time.getFullYear() + "-" + month + "-" + date
	            + " " + hours + ":" + minutes + ":" + seconds;
	    }
        function formatToDate (str){
        	return new Date(Date.parse(str.replace(/-/g, "/")));
        }
        var setMaxMinForStart =  function (currentDateTime){
        	console.log("setMaxMinForStart");
        	lastDate = new Date();
    		var endDate = getAllDate(lastDate);
    		var endTime = getHourTime(lastDate);
    		var endHour = lastDate.getHours() + ":00";
    		var startDateTime = startDateTimePicker.val();
    		var selectedDatestr = getAllDate(currentDateTime);
    		if (distributeDate != null) {
    			var minDate = new Date(distributeDate);
    			var minDateStr = getAllDate(minDate);
    			var minTime = getHourTime(minDate);
    			var minHour = minTime.split(":",1)[0] + ":00";
    			console.log("minDate:" + minDateStr + minTime + minHour);
    		}
    		if (selectedDatestr != endDate) {
    			if (selectedDatestr != minDateStr) {
    				this.setOptions({value:startDateTime,maxDate:endDate,maxTime:false,minDate:minDateStr, formatDate:'Y-m-d',minTime:false,formatTime:'H:i'});
    			} else {
    				this.setOptions({value:startDateTime,maxDate:endDate,maxTime:false,minDate:minDateStr,formatDate:'Y-m-d',minTime:minHour,formatTime:'H:i'});
    			}
    			//this.setOptions({value:startDateTime,maxDate:endDate,formatDate:'Y-m-d',maxTime:false,formatTime:'H:i'});
    		} else {
    			if (selectedDatestr != minDateStr) {
    				this.setOptions({value:startDateTime,maxDate:endDate,maxTime:endHour,minDate:minDateStr, formatDate:'Y-m-d',minTime:false,formatTime:'H:i'});
    			} else {
    				this.setOptions({value:startDateTime,maxDate:endDate,maxTime:endHour,minDate:minDateStr,formatDate:'Y-m-d',minTime:minHour,formatTime:'H:i'});
    			}
    			//this.setOptions({value:startDateTime,maxDate:endDate,formatDate:'Y-m-d',maxTime:endHour,formatTime:'H:i'});
    		}
    		if (endDate != datestr) {
    			this.setOptions({todayButton:false});
    		} else if (endDate == datestr) {
    			this.setOptions({todayButton:true});
    		}
    };

    var setMaxMinOnSelected = function (currentDateTime,$input){
    	console.log("setMaxMinOnSelected");
    	if (currentDateTime != null) {
    		var selectedDatestr = getAllDate(currentDateTime);
    		var selectedTimestr = getHourTime(currentDateTime);
    		var selectedDataTime = selectedDatestr + " " + selectedTimestr;
			lastDate = new Date();
    		var endDate = getAllDate(lastDate);
    		var endTime = getHourTime(lastDate);
    		var endHour = lastDate.getHours() + ":00";
    		
    		if (distributeDate != null) {
    			var minDate = new Date();
    			minDate.setTime(distributeDate);
    			var minDateTime = formatTime(minDate);
    			var minDateStr = getAllDate(minDate);
    			var minTime = getHourTime(minDate);
    			var distributeHour = minTime.split(":",1)[0];
    			var minHour = minTime.split(":",1)[0] + ":00";
    			console.log("minDate:" + minDateStr + minTime + minHour);
    		}

    		if (selectedDatestr < endDate) {//小于当前日期时
    			if (minDateStr && selectedDatestr < minDateStr) {//小于分配日期时 赋值分配日期    				
    				selectedDataTime = minDateTime;
    				this.setOptions({maxTime:false,value:minDateTime,minDate:selectedDataTime,minTime:false,formatTime:'H:i'});
    			} else if (minDateStr && selectedDatestr == minDateStr) {
    				if (selectedTimestr < minTime){//等于分配日期但是hour小于时   					
	        			selectedDataTime = selectedDatestr + " " + minTime;
    				}
    				this.setOptions({maxTime:false,value:selectedDataTime,minDate:minDateStr,minTime:minHour,formatTime:'H:i'});
    			} else {//大于分配日期
    				this.setOptions({maxTime:false,value:selectedDataTime,minDate:minDateStr,minTime:false,formatTime:'H:i'});
    			}  			
    			//this.setOptions({maxTime:false,value:selectedDataTime});
    		} else if (selectedDatestr > endDate){ //大于当前日期时
    			var newLastDate = new Date(lastDate);
    			newLastDate.setHours(lastDate.getHours() -1);
    			var lastDateStr = formatTime(newLastDate);
    			this.setOptions({maxTime:endHour,formatTime:'H:i',value:lastDateStr,minDate:minDateStr,minTime:minHour,formatTime:'H:i'});
    		} else {//等于当前日期
				if (selectedTimestr > endTime) {//hour大于当前hour时
    				var endTimeArr = endTime.split(":");
    				selectedDataTime = selectedDatestr + " " + (endTimeArr[0]-1) + ":"+ endTimeArr[1]+":"+endTimeArr[2];
    			}
    			if (minDateStr && selectedDatestr < minDateStr) {//小于分配日期时 赋值分配日期
    				this.setOptions({maxTime:endHour,formatTime:'H:i',value:selectedDataTime,minDate:minDateStr,minTime:false,formatTime:'H:i'});
    			} else if(minDateStr && selectedDatestr == minDateStr && selectedTimestr < minTime) {//等于分配日期但是hour小于时
    				if (distributeHour < (lastDate.getHours() - 1)){
    					selectedDataTime = selectedDatestr + " " + minTime;
    				}
    				this.setOptions({maxTime:endHour,formatTime:'H:i',value:selectedDataTime,minDate:minDateStr,minTime:minHour,formatTime:'H:i'});
    			} else {
    				this.setOptions({maxTime:endHour,formatTime:'H:i',value:selectedDataTime,minDate:minDateStr,minTime:false,formatTime:'H:i'});
    			}
    			//this.setOptions({maxTime:endHour,formatTime:'H:i',value:selectedDataTime});
    		}
			var oldDateStr = getAllDate(oldStartTime);
			var oldHour = getHourTime(oldStartTime);
			var endPickerTime = endDateTimePicker.val().split(" ")[1];
	    	selectedDatestr = selectedDataTime.split(" ")[0];
    		selectedTimestr = selectedDataTime.split(" ")[1];
			//修改end输入框的时间
			if (oldDateStr != selectedDatestr || (oldDateStr == selectedDatestr && selectedTimestr >= endPickerTime)) { 
				var reasonEndDate = formatToDate(selectedDataTime);
				reasonEndDate.setHours(reasonEndDate.getHours() + 1);
    			reasonEndDateStr = formatTime(reasonEndDate);
    			if (reasonEndDate.getTime() < lastDate.getTime()){
    				endDateTimePicker.val(reasonEndDateStr);
    			} else {    
    				reasonEndDateStr = formatTime(lastDate);
    				endDateTimePicker.val(reasonEndDateStr);
    			}
    			endDateTimePicker = $('#endDateId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d H:i:s',value:reasonEndDateStr,maxDate:'today',maxTime:'timestr',onShow:setMinForEnd,onChangeDateTime:setMaxMinForEnd});
			}
    		oldStartTime = formatToDate(selectedDataTime);
    	}
    };

    var setMaxMinForEnd = function (currentDateTime,$input){
    	console.log("setMaxMinForEnd");
    	if (currentDateTime != null) {
    		var selectedDatestr = getAllDate(currentDateTime);
    		var selectedTimestr = getHourTime(currentDateTime);
    		var selectedHourMinutestr = getHourMinute(currentDateTime);
    		var selectedDataTime = selectedDatestr + " " + selectedTimestr;
    		lastDate = new Date();
    		var endDate = getAllDate(lastDate);
    		var endTime = getHourTime(lastDate);
    		var endHour = lastDate.getHours() + ":00";
    		var startDate = startDateTimePicker.val().split(" ")[0];
    		var startTime = startDateTimePicker.val().split(" ")[1];
    		var startHour = (1 + parseInt(startTime.split(":",1)[0])) + ":00";

/*     		if (selectedDatestr == endDate) {//当天
    			if (selectedTimestr > endTime) {
    				var lastDateStr = formatTime(LastDate);
        			this.setOptions({maxDate:endDate,maxTime:endHour,formatTime:'H:i',value:lastDateStr,minTime:false,formatTime:'H:i'});
    			} else {    				
	    			this.setOptions({maxDate:selectedDatestr,maxTime:timestr,minTime:false,value:selectedDataTime});
    			}
    		} else  if (selectedDatestr > endDate){//大于当天
    			var lastDateStr = formatTime(lastDate);
    			this.setOptions({maxDate:endDate,maxTime:endHour,formatTime:'H:i',value:lastDateStr,minTime:false,formatTime:'H:i'});
    		} else if (selectedDatestr == startDate) {//等于起始日期
				if (selectedTimestr < startTime) {
					var reasonStartDate = formatToDate(startDateTimePicker.val());
	    			reasonStartDate.setHours(reasonStartDate.getHours() + 1);
	    			reasonStartDateStr = formatTime(reasonStartDate);
    				this.setOptions({value:reasonStartDateStr,maxDate:selectedDatestr,maxTime:timestr,minTime:startHour,formatTime:'H:i'});
				} else {					
    				this.setOptions({value:selectedDataTime,maxDate:selectedDatestr,maxTime:timestr,minTime:startHour,formatTime:'H:i'});
				}
    		} */
    			
    		if (selectedDatestr != startDate) {//不等于起始日期
    			var reasonStartDate = formatToDate(startDateTimePicker.val());
    			reasonStartDate.setHours(reasonStartDate.getHours() + 1);
    			reasonStartDateStr = formatTime(reasonStartDate);
    			if (reasonStartDate < endDate) {//小于当前日期   				
    				this.setOptions({minDate:startDate,maxDate:startDate,maxTime:false,minTime:startHour,value:reasonStartDateStr});
    			} else {
    				this.setOptions({minDate:startDate,maxDate:startDate,maxTime:endHour,minTime:startHour,value:reasonStartDateStr});
    			}
    		} else {
    			if (selectedDatestr < endDate) {//小于当前日期   				
    				this.setOptions({minDate:startDate,maxDate:selectedDatestr,maxTime:false,minTime:startHour,value:selectedDataTime});
    			} else {
    				this.setOptions({minDate:startDate,maxDate:selectedDatestr,maxTime:endHour,minTime:startHour,value:selectedDataTime});
    			}
    		}
    	}
    };

    var setMinForEnd = function (currentDateTime) {
    	console.log("setMinForEnd");
    	var selectedDatestr = getAllDate(currentDateTime);
    	var startDate = startDateTimePicker.val().split(" ")[0];
    	var startTime = startDateTimePicker.val().split(" ")[1];
    	var startHour = ( 1 + parseInt(startTime.split(":",1)[0])) + ":00";
    	lastDate = new Date();
		var endDate = getAllDate(lastDate);
		var endTime = getHourTime(lastDate);
		var endHour = lastDate.getHours() + ":00";
    	if (selectedDatestr < endDate) {//小于当前日期
    		this.setOptions({minDate:startDate,formatDate:'Y-m-d',maxDate:startDate,maxTime:false,minTime:startHour,formatTime:'H:i'});
    	} else {//当天
    		this.setOptions({minDate:startDate,formatDate:'Y-m-d',maxDate:startDate,maxTime:endHour,minTime:startHour,formatTime:'H:i'});
    	}
    };

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
    var startDateTimePicker = $('#startDateId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d H:i:s',value:formatStartTime,maxDate:'today',maxTime:'timestr',onShow:setMaxMinForStart,onChangeDateTime:setMaxMinOnSelected});
	var endDateTimePicker = $('#endDateId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d H:i:s',value:formatEndTime,maxDate:'today',maxTime:'timestr',onShow:setMinForEnd,onChangeDateTime:setMaxMinForEnd});
		if (data3.type == "cpu") {
 			console.log("GetCpuData")
			$("#cpuChartDetail").css("display", "block");
 			realtimeCpuChartDetail();
		} else if (data3.type == "mem") {
			realtimeMemChartDetail();
			$("#memoryChartDetail").css("display", "block");
		} else if (data3.type == "io") {
			realtimeIOChartDetail();
			$("#diskIOChartDetail").css("display", "block");
			$("#diskUsagePP").show();
		} else {
			realtimeNetChartDetail();
			$("#netIOChartDetail").css("display", "block");
			$("#netUsagePP").show();
		}
   });
 </script>
</body>
</html>