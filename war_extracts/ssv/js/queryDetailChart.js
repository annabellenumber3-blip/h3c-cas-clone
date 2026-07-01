var data3;
/*实时数据图表*/
var cpuArrDetail=[],memArrDetail=[],diskDetail = [],netDetail=[];
var cpusetDetail,memsetDetail,datasetDetail,netdatasetDetail;
var totalPoints = 121;
var updateInterval = 30000;
var startTimeLong,endTimeLong;
var unit = 5,num = 1;
function getDateString(time){
    if (time) {
    	var date = new Date(time);
    	var month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return date.getFullYear() + "-" + month + "-" + day
        + " " + hours + ":" + minutes + ":" + seconds;
    } else {
        return "";
    }
}
function formatStrToDate(value) {
	var d = new Date();
	if (value) {
        d.setYear(parseInt(value.substring(0, 4)));
        d.setMonth(parseInt(value.substring(5, 7))-1);
        d.setDate(parseInt(value.substring(8, 10)));
        d.setHours(parseInt(value.substring(11, 13)));
        d.setMinutes(parseInt(value.substring(14, 16)));
        d.setSeconds(parseInt(value.substring(17, 19)));
        return d;
    }
}
function queryDetail(){
	startTimeLong = formatStrToDate($("#startDateId").val()).getTime();
	endTimeLong = formatStrToDate($("#endDateId").val()).getTime();
	var start = new Date(startTimeLong);
	var end = new Date(endTimeLong);
	num = (end.getHours() - start.getHours());
	if (num > 1) {		
		unit = 5 * num;
	} else {
		num = 1;
	}
	options.xaxis.tickSize = [unit, 'minute'];
	if (data3.type == "cpu") {
		GetCpuDataDetail();
	} else if (data3.type == "mem") {
		GetMemDataDetail();
	} else if (data3.type == "io") {
		GetIODataDetail()
	} else {
		GetNetIODataDetail();
	}
}
var options = {
    series: {
        lines: {
            lineWidth: 1.2 ,
            show: true
        }
    },
    xaxis: {
        mode: "time",
        tickSize: [5, "minute"],
        tickFormatter: function (v, axis) {
            var date = new Date(v);

            if (date.getMinutes() % 5 == 0) {
                var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();               
                return hours + ":" + minutes ;
            } else {
                return "";
            }
        }
     
    },
    yaxis: {
    	min:0
    },
    legend: {
    	noColumns:2,
        position:"ne",
        margin:[0, -30]
    },
    grid: {      
        backgroundColor: { colors: ["#ffffff", "#ffffff"] },
        hoverable: true,
        borderColor: "#ffffff", // set if different from the grid color
        tickColor: "#ffffff" // color for the ticks, e.g. "rgba(0,0,0,0.15)"
    }
};
//图表初始化时html
var initCpu = $(".chart .lineChart").html();
var initMemory = $(".chart .lineChart").html();
var initNetIO = $("#netIOChart .lineChart").html();
var initDiskIO = $("#diskIOChart .lineChart").html();
var distributeDate = null;
function updateDistributeDate(data) {
	distributeDate = data;
}
function getDistributeDate() {	
	$.ajaxSetup({ cache: false });
	$.ajax({
		type: "GET",
		dataType:"json",
		url: "servlet/vmList?way=getBeginTime",
		data:"vmId="+data3.vmId,
		success: updateDistributeDate,
		error: function () {           
		}
	});
}
function GetIODataDetail() {
    $.ajaxSetup({ cache: false });
	 $.ajax({
	    	type: "GET",
			dataType:"json",
			url: "servlet/vmList?way=queryIOTrendMore",
			data:"vmId="+data3.vmId + "&startTimeLong="+startTimeLong+"&endTimeLong="+endTimeLong,
	        success: updateIODetail,
	        error: function () {
	            setTimeout(GetIODataDetail, updateInterval);
	        }
	    });  
}
function GetNetIODataDetail() {
    $.ajaxSetup({ cache: false });
    $.ajax({
    	type: "GET",
		dataType:"json",
		url: "servlet/vmList?way=queryNetTrendMore",
		data:"vmId="+data3.vmId + "&startTimeLong="+startTimeLong+"&endTimeLong="+endTimeLong,
        success: updateNetIODetail,
        error: function () {
            setTimeout(GetNetIODataDetail, updateInterval);
        }
    });
}
function GetCpuDataDetail() {
    $.ajaxSetup({ cache: false });
    $.ajax({
    	type: "GET",
		dataType:"json",
		url: "servlet/vmList?way=queryCpuMemTrendMore",
		data:"vmId="+data3.vmId + "&queryFld=cpu&startTimeLong="+startTimeLong+"&endTimeLong="+endTimeLong,
        success: updateCPUDetail,
        error: function () {
            setTimeout(GetCpuDataDetail, updateInterval);
        }
    });
}
function GetMemDataDetail() {
    $.ajaxSetup({ cache: false });
    $.ajax({
    	type: "GET",
		dataType:"json",
		url: "servlet/vmList?way=queryCpuMemTrendMore",
		data:"vmId="+data3.vmId + "&queryFld=mem&startTimeLong="+startTimeLong+"&endTimeLong="+endTimeLong,
        success: updateMEMDetail,
        error: function () {
            setTimeout(GetMemDataDetail, updateInterval);
        }
    });
}
var tempDetail,tempnetDetail,tempcpuDetail,tempmemDetail,threadCpuDetail,threadMemDetail,threadIODetail,threadNetDetail,countDiskDetail=0,countnetDetail=0,countcpuDetail=0,countmemDetail=0;
function updateCPUDetail(_data) {
	clearTimeout(threadCpuDetail);
	//修改问题单201406120375 ssv 虚拟机性能页面修改 byS10462 2014/6/20
		if(_data){
			if(_data.length>0){
				if(countcpuDetail==0){
				   cpusetDetail = new Array(_data.length);
				   cpuArrDetail = new Array(_data.length);
				   for (var i=0;i<_data.length;i++){
					   cpuArrDetail.push([_data[i].time,_data[i].usage]);
				   }
				   cpusetDetail = [      
							   { data: cpuArrDetail, lines: { fill: true, lineWidth: 1.2 }, color: "#FFC601"} 
				   ];
				   countcpuDetail++;
				} else if(countcpuDetail==1){
					var temp = new Array(_data.length);
				    temp = new Array(_data.length);
				    for (var i=0;i<_data.length;i++){
					   temp.push([_data[i].time,_data[i].usage]);
				    }
				   cpusetDetail = [      
							   { data: temp, lines: { fill: true, lineWidth: 1.2 }, color: "#FFC601"} 
				   ];
				}				
			}else{
				now = startTimeLong - updateInterval*num;
				var temp = new Array(totalPoints);
			    for (var i = 0; i < totalPoints; i++) {
			        temp.push([now+=updateInterval*num, 0]);
			    }
			    cpusetDetail = [      
			        { data: temp, lines: { fill: true, lineWidth: 1.2 }, color: "#8FC25B"} 
			    ];
			}
		    $.plot($("#flot-placeholder6"), cpusetDetail, options);
		    $("#flot-placeholder6").UseTooltip();
		    var h = $("#cpuChartDetail .legend table").height();
		    $("#cpuChartDetail").height( 300+h);
		    $("#cpuChartDetail .lineChart .flot-base,#cpuChartDetail .lineChart .flot-text,#cpuChartDetail .lineChart .flot-overlay").css("top",h);
		    if(parseInt($(".description").height())<parseInt($(".tab-content").height())){
		    	 $(".description").css("height",$(".tab-content").height()+"px");
		    }
		}
	}
function updateMEMDetail(_data) {
	//修改问题单201406120375 ssv 虚拟机性能页面修改 byS10462 2014/6/20
		if(_data){
			if(_data.length>0){
				if(countmemDetail==0){
				   memsetDetail = new Array(_data.length);
				   memArrDetail = new Array(_data.length);
				   for (var i=0;i<_data.length;i++){
					   memArrDetail.push([_data[i].time,_data[i].usage]);
				   }
				   memsetDetail = [      
								   { data: memArrDetail, lines: { fill: true, lineWidth: 1.2 }, color: "#FFC601"} 
					   ];
				   countmemDetail++;
				} else if(countmemDetail==1){
					var temp = new Array(_data.length);
				    temp = new Array(_data.length);
				    for (var i=0;i<_data.length;i++){
					   temp.push([_data[i].time,_data[i].usage]);
				    }
				   
				   memsetDetail = [      
							   { data: temp, lines: { fill: true, lineWidth: 1.2 }, color: "#FFC601"} 
				   ];
				}
				
			}else{
				now = startTimeLong - updateInterval*num;
				var temp = new Array(totalPoints);
			    for (var i = 0; i < totalPoints; i++) {
			        temp.push([now+=updateInterval*num, 0]);
			    }
			    memsetDetail = [      
			        { data: temp, lines: { fill: true, lineWidth: 1.2 }, color: "#8FC25B"} 
			    ];
			}
		    $.plot($("#flot-placeholder7"), memsetDetail, options);
		    $("#flot-placeholder7").UseTooltip();
		    var h = $("#memoryChartDetail .legend table").height();
		    $("#memoryChartDetail").height( 300+h);
		    $("#memoryChartDetail .lineChart .flot-base,#memoryChartDetail .lineChart .flot-text,#memoryChartDetail .lineChart .flot-overlay").css("top",h);
		    if(parseInt($(".description").height())<parseInt($(".tab-content").height())){
		    	 $(".description").css("height",$(".tab-content").height()+"px");
		    }
		}
	}
function updateIODetail(_data) {
//修改问题单201406120375 ssv 虚拟机性能页面修改 byS10462 2014/6/20
	if(_data){
		if(_data.length>0&&_data[0].name){
			datasetDetail = new Array(_data.length);
			if(countDiskDetail==0){
			   diskDetail = new Array(_data.length);
			   for (var i=0;i<_data.length;i++){
				   diskDetail[i]=new Array();
				   for (var j=0;j<_data[i].rates.length;j++)
					{
						diskDetail[i].push([_data[i].rates[j].time,_data[i].rates[j].rate.toFixed(2)]);
					}
				   datasetDetail[i]={
							label:_data[i].name,
							data:diskDetail[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
			   }
			   countDiskDetail++;
			}
			if(countDiskDetail==1){
				var temp = new Array(_data.length);
				for (var i=0;i<_data.length;i++){
					temp[i]=new Array();
				    for (var j=0;j<_data[i].rates.length;j++){
					   temp[i].push([_data[i].rates[j].time,_data[i].rates[j].rate.toFixed(2)]);
				    }
				    datasetDetail[i]={
							label:_data[i].name,
							data:temp[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
			   }				
			}
			
		}else{
			now = startTimeLong - updateInterval*num;
			var temp = new Array(totalPoints);
		    for (var i = 0; i < totalPoints; i++) {
		        temp.push([now+=updateInterval*num, 0]);
		    }
		    datasetDetail = [      
		        { data: temp, lines: { fill: true, lineWidth: 1.2 }, color: "#8FC25B"} 
		    ];
		}
	    $.plot($("#flot-placeholder8"), datasetDetail, options);
	    $("#flot-placeholder8").UseTooltip();
	    var h = $("#diskIOChartDetail .legend table").height();
	    $("#diskIOChartDetail").height( 300+80);
	    $("#diskIOChartDetail .lineChart .flot-base,#diskIOChartDetail .lineChart .flot-text,#diskIOChartDetail .lineChart .flot-overlay").css("top",h);
	    if(parseInt($(".description").height())<parseInt($(".tab-content").height())){
	    	 $(".description").css("height",$(".tab-content").height()+"px");
	    }
	}
}
function updateNetIODetail(_data) {
//修改问题单201406120375 ssv 虚拟机性能页面修改 byS10462 2014/6/20
	if(_data){
		if(_data.length>0&&_data[0].name){
			netdatasetDetail = new Array(_data.length);
			if(countnetDetail==0){
				netDetail = new Array(_data.length);
			    for (var i=0;i<_data.length;i++){
				   netDetail[i]=new Array();
				   for (var j=0;j<_data[i].rates.length;j++)
					{
					   netDetail[i].push([_data[i].rates[j].time,_data[i].rates[j].rate.toFixed(2)]);
					}
				   netdatasetDetail[i]={
							label:_data[i].name,
							data:netDetail[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
			   }
			   countnetDetail++;
			}
			if(countnetDetail==1){
				var temp = new Array(_data.length);
			    for (var i=0;i<_data.length;i++){
			    	temp[i]=new Array();
				   for (var j=0;j<_data[i].rates.length;j++)
					{
					   temp[i].push([_data[i].rates[j].time,_data[i].rates[j].rate.toFixed(2)]);
					}
				   netdatasetDetail[i]={
							label:_data[i].name,
							data:temp[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
			   }
			}
			
		
		}else{
			now = startTimeLong - updateInterval*num;
			var temp = new Array(totalPoints);
		    for (var i = 0; i < totalPoints; i++) {
		        temp.push([now+=updateInterval*num, 0]);
		    }
		    netdatasetDetail = [      
		        { data: temp, lines: { fill: true, lineWidth: 1.2 }, color: "#8FC25B"} 
		    ];
		}
	    $.plot($("#flot-placeholder9"), netdatasetDetail, options);
	    $("#flot-placeholder9").UseTooltip();
	    var h = $("#netIOChartDetail .legend table").height();
	    $("#netIOChartDetail").height( 300+80);
	    $("#netIOChartDetail .lineChart .flot-base,#netIOChartDetail .lineChart .flot-text,#netIOChartDetail .lineChart .flot-overlay").css("top",h);
	    if(parseInt($(".description").height())<parseInt($(".tab-content").height())){
	    	 $(".description").css("height",$(".tab-content").height()+"px");
	    }
	}	
}
function initDataDetail() {
	now=startTimeLong - updateInterval;
    for (var i = 0; i < totalPoints; i++) {
        var tempDetail = [now+=updateInterval, 0];
        diskDetail.push(tempDetail);
        netDetail.push(tempDetail);
        cpuArrDetail.push(tempDetail);
        memArrDetail.push(tempDetail);
    }
}
//实时数据图表入口
function realtimeIOChartDetail() {
    initDataDetail();
    datasetDetail = [        
        { data: diskDetail, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder8"), datasetDetail, options);
    $("#flot-placeholder8").UseTooltip();
    GetIODataDetail();
}

function realtimeNetChartDetail() {
    initDataDetail();
    netdatasetDetail = [        
        { data: netDetail, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder9"), netdatasetDetail, options);
    $("#flot-placeholder9").UseTooltip();
    GetNetIODataDetail();
}
function realtimeCpuChartDetail() {
    initDataDetail();
    cpusetDetail = [        
        { data: cpuArrDetail, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder6"), cpusetDetail, options);
    $("#flot-placeholder6").UseTooltip();
    GetCpuDataDetail();
}
function realtimeMemChartDetail() {
    initDataDetail();
    memsetDetail = [        
        { data: memArrDetail, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder7"), memsetDetail, options);
    $("#flot-placeholder7").UseTooltip();
    GetMemDataDetail();
}
var previousPoint = null, previousLabel = null;
$.fn.UseTooltip = function () {
    $(this).bind("plothover", function (event, pos, item) {
        if (item) {
            if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;
                $("#tooltip").remove();
                var x = item.datapoint[0];
                var y = item.datapoint[1];

                var color = item.series.color;

                if (item.seriesIndex == 0) {
                    showTooltip(item.pageX,
                    item.pageY,
                    color,
                    "<strong>" + getDateString(x) + "</strong>" +  " : <strong>" + y + "</strong>");
                } else {
                    showTooltip(item.pageX,
                    item.pageY,
                    color,
                    "<strong>" + getDateString(x) + "</strong>" +  " : <strong>" + y + "</strong>");
                }
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};

function showTooltip(x, y, color, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y - 40,
        left: x - 120,
        border: '2px solid ' + color,
        padding: '3px',
        'font-size': '9px',
        'border-radius': '5px',
        'background-color': '#fff',
        'z-index':'1000',
        'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
        opacity: 0.9
    }).appendTo("body").fadeIn(200);
}
function closeChartDetail() {
	$("#windowOverId").html("");
	$("#windowOverId").hide();
}
