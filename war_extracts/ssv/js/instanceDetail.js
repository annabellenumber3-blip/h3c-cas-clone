	var data2;
	function confirmPect(chartname,rateStr){
		var i=0,j=0;
		var rate = parseFloat(rateStr);
		if(rate>50){
			i=180;
			j=rate*3.6-180;
		}else{
			i=rate*3.6;
			
		}
		var chart=$("."+chartname+"-chart"),
		chartDot = chart.parent(".chart").find(".labels .circle-icon img.icon");
		pie=chart.find(".pie"),
		pie1=chart.find(".pie1"),
		pie2=chart.find(".pie2"),
		innerPie=chart.find("#inner-pie"),
		rect=chart.find(".grid-rect-1"),
		bg=rect.find(".bg");
		if(rate<=50){
			pie.removeClass("yellow-pie red-pie green-pie").addClass("green-pie");
			innerPie.removeClass("yellow-word red-word green-word").addClass("green-word");
			chart.find(".inner-pie").removeClass("yellow-inner-pie red-inner-pie green-inner-pie").addClass("green-inner-pie");
			rect.removeClass("yellow-rect red-rect green-rect").addClass("green-rect");
			bg.removeClass("yellow-bg red-bg green-bg").addClass("green-bg");
			chartDot.attr("src","icons/default/green-dot.png");
		}else if(rate<=80){
			pie.removeClass("green-pie red-pie yellow-pie").addClass("yellow-pie");
			innerPie.removeClass("green-word red-word yellow-word").addClass("yellow-word");
			chart.find(".inner-pie").removeClass("green-inner-pie red-inner-pie yellow-inner-pie").addClass("yellow-inner-pie");
			rect.removeClass("green-rect red-rect yellow-rect").addClass("yellow-rect");
			bg.removeClass("green-bg red-bg yellow-bg").addClass("yellow-bg");
			chartDot.attr("src","icons/default/yellow-dot.png");
		}else if(rate<=100){
			pie.removeClass("green-pie yellow-pie red-pie").addClass("red-pie");
			innerPie.removeClass("green-word yellow-word red-word").addClass("red-word");
			chart.find(".inner-pie").removeClass("green-inner-pie yellow-inner-pie red-inner-pie").addClass("red-inner-pie");
			rect.removeClass("green-rect yellow-rect red-rect").addClass("red-rect");
			bg.removeClass("green-bg yellow-bg red-bg").addClass("red-bg");
			chartDot.attr("src","icons/default/red-dot.png");
		}
		pie1.css("-o-transform", "rotate(" + i + "deg)");
		pie1.css("-moz-transform", "rotate(" + i + "deg)");
		pie1.css("-ms-transform", "rotate(" + i + "deg)");
		pie1.css("-webkit-transform", "rotate(" + i + "deg)");
		
		pie2.css("-o-transform", "rotate(" + j + "deg)");
		pie2.css("-moz-transform", "rotate(" + j + "deg)");
		pie2.css("-ms-transform", "rotate(" + j + "deg)");
		pie2.css("-webkit-transform", "rotate(" + j + "deg)");
		if (rate == 100) {
			innerPie.text(rate+"%");
		} else {
			innerPie.text(rate.toFixed(2)+"%");//保留两位by s10462 2014-08-22
		}
	}
	function packChart(data2){	
		confirmPect("cpu",data2.cpuRate);
		confirmPect("memory",data2.memoryRate);
	}
	/*实时数据图表*/
var cpuArr=[],memArr=[],disk = [],net=[];
var cpuset,memset,dataset,netdataset;
var totalPoints = 50;
var updateInterval = 30000;
var now = new Date().getTime();

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

// 图表初始化时html
var initCpu = $(".chart .cpu-chart").html();
var initCpuImg = $("#cpuChart").find(".labels .circle-icon img.icon").attr("src");
var initMemory = $(".chart .memory-chart").html();
var initMemImg = $("#memoryChart").find(".labels .circle-icon img.icon").attr("src");
var initNetIO = $("#netIOChart .lineChart").html();
var initDiskIO = $("#diskIOChart .lineChart").html();
function getDateString(time){
    if (time) {
    	var date = new Date(time);
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return hours + ":" + minutes +":"+second;
    } else {
        return "";
    }
}
function initData() {
	now=now-(totalPoints+1)*updateInterval;
    for (var i = 0; i < totalPoints; i++) {
        var temp = [now+=updateInterval, 0];

        disk.push(temp);
        net.push(temp);
        cpuArr.push(temp);
        memArr.push(temp);
    }
}
function initArrayData(arr,time){
	time=time-(totalPoints+4)*updateInterval;
    for (var i = 0; i < totalPoints; i++) {
        var temp = [time+=updateInterval, 0];
        arr.push(temp);
    }
    return arr;
}
function GetIOData() {
    $.ajaxSetup({ cache: false });
    if($("#toggle-io").length != 0 && !$("#toggle-io").hasClass("toggle-off")){
    	 $.ajax({
    	    	type: "GET",
    			dataType:"json",
    			url: "servlet/vmList?way=getCurrentIOStatById",
    			data:"vmId="+data2.vmId,
    	        success: updateIO,
    	        error: function () {
    	            setTimeout(GetIOData, updateInterval);
    	        }
    	    });
    }
   
}
function GetNetIOData() {
    $.ajaxSetup({ cache: false });
    if($("#toggle-net").length != 0 && !$("#toggle-net").hasClass("toggle-off")){
	    $.ajax({
	    	type: "GET",
			dataType:"json",
			url: "servlet/vmList?way=getCurrentNetIOStatById",
			data:"vmId="+data2.vmId,
	        success: updateNetIO,
	        error: function () {
	            setTimeout(GetNetIOData, updateInterval);
	        }
	    });
    }
}
function GetCpuData() {
    $.ajaxSetup({ cache: false });
    if($("#toggle-cpu").length != 0 && !$("#toggle-cpu").hasClass("toggle-off")){
	    $.ajax({
	    	type: "GET",
			dataType:"json",
			url: "servlet/vmList?way=getCurrentCpuStatById",
			data:"vmId="+data2.vmId,
	        success: updateCpu,
	        error: function () {
	            setTimeout(GetCpuData, updateInterval);
	        }
	    });
    }
}
function GetMemData() {
    $.ajaxSetup({ cache: false });
    if($("#toggle-mem").length != 0 && !$("#toggle-mem").hasClass("toggle-off")){
	    $.ajax({
	    	type: "GET",
			dataType:"json",
			url: "servlet/vmList?way=getCurrentMemStatById",
			data:"vmId="+data2.vmId,
	        success: updateMem,
	        error: function () {
	            setTimeout(GetMemData, updateInterval);
	        }
	    });
    }
}
var temp,tempnet,tempcpu,tempmem,threadCpu,threadMem,threadIO,threadNet,count=0,countnet=0,countcpu=0,countmem=0;

function updateIO(_data) {
//修改问题单201406120375 ssv 虚拟机性能页面修改 byS10462 2014/6/20
	if(_data){
		if(_data.length>0&&_data[0].name){
			dataset = new Array(_data.length);
			if(count==0){
			   disk = new Array(_data.length);
			   for (var i=0;i<_data.length;i++){
				   disk[i]=new Array();
				   for (var j=0;j<_data[i].rates.length;j++)
					{
						disk[i].push([_data[i].rates[j].time,_data[i].rates[j].rate.toFixed(2)]);
					}
				   dataset[i]={
							label:_data[i].name,
							data:disk[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
			   }
			   count++;
			}
			if(count==1){
				for (var i=0;i<_data.length;i++)
				{
					var oldTime0 = disk[i][disk[i].length-1][0];
					var newTime0 = _data[i].rates[_data[i].rates.length-1].time;
					if(newTime0-oldTime0>0){
						var shiftTime = (newTime0-oldTime0)/updateInterval;
						var _dataLast = _data[i].rates.length-1;
						//201411180059根据时间进行补全。如果数据 正常，不会显示出时间不连贯的趋势图
						for (var st=shiftTime;st>=0;st--){
							if(disk[i].length>49){
								disk[i].shift();
							}
							disk[i].push([_data[i].rates[_dataLast-st].time,_data[i].rates[_dataLast-st].rate.toFixed(2)]);
						}
						
					}
					dataset[i]={
							label:_data[i].name,
							data:disk[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
				}
			}
			
		}else{
			var newNow = new Date().getTime();
			if(now<newNow ){
				now += updateInterval;
				if(now<=newNow){
					disk.shift();
					if(_data.rate){
				    	 temp = [now, _data.rate];
				    }else if(_data.rates){
				    	var temprates = _data.rates;
				    	temp = [now, temprates[temprates.length-1].rate.toFixed(2)];
				    }else{
				    	temp = [now, "0.0"];
				    }
				    disk.push(temp);
				}
			}
		    
		    dataset = [      
		        { data: disk, lines: { fill: true, lineWidth: 1.2 }, color: "#FFC601"} 
		    ];
		}
	    $.plot($("#flot-placeholder1"), dataset, options);
	    $("#flot-placeholder1").UseTooltip();
	    var h = $("#diskIOChart .legend table").height();
	    $("#diskIOChart").height( 300+h);
	    $("#diskIOChart .lineChart .flot-base,#diskIOChart .lineChart .flot-text,#diskIOChart .lineChart .flot-overlay").css("top",h);
	    if(parseInt($(".description").height())<parseInt($(".tab-content").height())){
	    	 $(".description").css("height",$(".tab-content").height()+"px");
	    }
	}
    threadIO=setTimeout(GetIOData, updateInterval);
}
function updateNetIO(_data) {
//修改问题单201406120375 ssv 虚拟机性能页面修改 byS10462 2014/6/20
	if(_data){
		if(_data.length>0&&_data[0].name){
			netdataset = new Array(_data.length);
			if(countnet==0){
				net = new Array(_data.length);
			   for (var i=0;i<_data.length;i++){
				   net[i]=new Array();
				   for (var j=0;j<_data[i].rates.length;j++)
					{
					   net[i].push([_data[i].rates[j].time,_data[i].rates[j].rate.toFixed(2)]);
					}
				   netdataset[i]={
							label:_data[i].name,
							data:net[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
			   }
			   countnet++;
			}
			if(countnet==1){
				for (var i=0;i<_data.length;i++)
				{
					var oldTime1 = net[i][net[i].length-1][0];
					var newTime1 = _data[i].rates[_data[i].rates.length-1].time;
					//201411180059根据时间进行补全。如果数据 正常，不会显示出时间不连贯的趋势图
					if(newTime1-oldTime1>0){
						var shiftTime1 = (newTime1-oldTime1)/updateInterval;
						var _dataLast1 = _data[i].rates.length-1;
						for (var st=shiftTime1;st>=0;st--){
							if(net[i].length>49){
								net[i].shift();
							}
							net[i].push([_data[i].rates[_dataLast1-st].time,_data[i].rates[_dataLast1-st].rate.toFixed(2)]);
						}
					}
					netdataset[i]={
							label:_data[i].name,
							data:net[i],
							lines: { fill: true, lineWidth: 1.2 }
					};
				}
			}
			
		
		}else{
			var newNow = new Date().getTime();
			if(now<newNow){
				now += updateInterval;
				if(now<=newNow){
					net.shift();
				    if(_data.rate){
				    	tempnet = [now, _data.rate];
				    }else if(_data.rates){
				    	var temprates = _data.rates;
				    	tempnet = [now, temprates[temprates.length-1].rate.toFixed(2)];
				    }else{
				    	tempnet = [now, "0.0"];
					}
				    net.push(tempnet);	
				}
			}
		    netdataset = [      
		        { data: net, lines: { fill: true, lineWidth: 1.2 }, color: "#8FC25B"} 
		    ];
		}
	    $.plot($("#flot-placeholder2"), netdataset, options);
	    $("#flot-placeholder2").UseTooltip();
	    var h = $("#netIOChart .legend table").height();
	    $("#netIOChart").height( 300+h);
	    $("#netIOChart .lineChart .flot-base,#netIOChart .lineChart .flot-text,#netIOChart .lineChart .flot-overlay").css("top",h);
	    if(parseInt($(".description").height())<parseInt($(".tab-content").height())){
	    	 $(".description").css("height",$(".tab-content").height()+"px");
	    }
	}
	
    threadNet= setTimeout(GetNetIOData, updateInterval);
}
function updateCpu(_data) {
	if(getBrowser()){
		if(_data&&_data.length>0){
			confirmPect("cpu",_data[_data.length-1].usage);
		}else{
			confirmPect("cpu",0);
		}
		$(".chart .cpu-chart").show();
		threadCpu=setTimeout(GetCpuData, updateInterval);
	}else{
	    updateCpuIe8(_data);
	}
}
function updateCpuIe8(_data) {
	if(_data){
		if(_data.length>0){
			if(countcpu==0){
				cpuArr = [];
			   for (var i=0;i<_data.length;i++){
				   cpuArr.push([_data[i].time,_data[i].usage]);				  
			   }
			   console.warn(cpuset);
			   cpuset = [{
						
						data:cpuArr,
						lines: { fill: true, lineWidth: 1.2 },
						color: "#F0AD4E"}];
			   countcpu++;
			}
			if (countcpu == 1) {

				if (cpuArr.length > 49) {
					cpuArr.shift();
				}
				cpuArr.push([
						_data[_data.length-1].time,
						_data[_data.length-1].usage ]);
				cpuset = [{
						
					     data : cpuArr,
						 lines : { fill : true, lineWidth : 1.2},
						 color: "#F0AD4E"
				}];

			}
			
			$.plot($("#flot-placeholder"), cpuset, options);
			$("#flot-placeholder").UseTooltip();
		}
	}
    threadCpu= setTimeout(GetCpuData, updateInterval);
}
function updateMem(_data) {
	if(getBrowser()){
		if(_data&&_data.length>0){
		    confirmPect("memory",_data[_data.length-1].usage);
		}else{
			confirmPect("memory",0);
		}
		$(".chart .memory-chart").show();
		threadMem=setTimeout(GetMemData, updateInterval);
	}else{
		updateMemIe8(_data);
	}
	
}
function updateMemIe8(_data) {
	if(_data){
	    if(_data.length>0){
			if(countmem==0){
				memArr = [];
			   for (var i=0;i<_data.length;i++){
				   memArr.push([_data[i].time,_data[i].usage]);				  
			   }
			   console.warn(cpuset);
			   memset = [{
						
						data:memArr,
						lines: { fill: true, lineWidth: 1.2 },
						color: "#F0AD4E"}];
			   countmem++;
			}
			if (countmem == 1) {

				if (memArr.length > 49) {
					memArr.shift();
				}
				memArr.push([
						_data[_data.length-1].time,
						_data[_data.length-1].usage ]);
				memset = [{
						 
					     data : memArr,
						 lines : { fill : true, lineWidth : 1.2},
						 color: "#F0AD4E"
				}];

			}
			
			$.plot($("#flot-placeholder0"), memset, options);
			$("#flot-placeholder0").UseTooltip();
		}
	}
    threadMem= setTimeout(GetMemData, updateInterval);
}
//实时数据图表入口
function realtimeChart() {
    initData();
    dataset = [        
        { data: disk, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder1"), dataset, options);
    $("#flot-placeholder1").UseTooltip();
    GetIOData();
}

function realtimeNetChart() {
    initData();
    netdataset = [        
        { data: net, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder2"), netdataset, options);
    $("#flot-placeholder2").UseTooltip();
    GetNetIOData();
}
function realtimeCpuChart(){
	var tpl = $('#tmpl_detail_monitor_chart').html();
	var html = _.template(tpl, data2);
	$(".chart .cpu-chart").hide();
	$(".chart .cpu-chart").html(html);
	GetCpuData();
}
function realtimeCpuChartIe8(){
	initData();
    cpuset = [        
        { data: cpuArr, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder"), cpuset, options);
    $("#flot-placeholder").UseTooltip();
    GetCpuData();
}

function realtimeMemChart(){
	var tpl = $('#tmpl_detail_monitor_chart').html();
	var html = _.template(tpl, data2);
	$(".chart .memory-chart").hide();
	$(".chart .memory-chart").html(html);
	GetMemData();
}
function realtimeMemChartIe8(){
	initData();
    memset = [        
        { data: memArr, lines:{fill:true, lineWidth:1.2} , color: "#FFFFFF"}
    ];
    $.plot($("#flot-placeholder0"), memset, options);
    $("#flot-placeholder0").UseTooltip();
    GetMemData();
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
        'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
        opacity: 0.9
    }).appendTo("body").fadeIn(200);
}


function pageX(elem){
    return elem.offsetParent?(elem.offsetLeft+pageX(elem.offsetParent)):elem.offsetLeft;
        }
function pageY(elem){
    return elem.offsetParent?(elem.offsetTop+pageY(elem.offsetParent)):elem.offsetTop;
        }
//	开关
function controlChart(toggle){
		if(toggle.hasClass("toggle-cpu")){	
			if(getBrowser()){
				realtimeCpuChart();
			}else{
				/*ie8*/
				if(cpuArr.length>0){
					GetCpuData();
				}else if(cpuArr.length==0){
					realtimeCpuChartIe8();
				}
				$("#cpuUsageP").show();
			}
		}else if(toggle.hasClass("toggle-mem")){
			if(getBrowser()){
				realtimeMemChart();
			}else{
				/*ie8*/
				if(memArr.length>0){
					GetMemData();
				}else if(memArr.length==0){
					realtimeMemChartIe8();
				}
				$("#memUsageP").show();
			}
			
		}else if(toggle.hasClass("toggle-io")){
			if(disk.length>0){
				GetIOData();
			}else if(disk.length==0){
				realtimeChart();
			}
			$("#diskUsageP").show();
		}else if(toggle.hasClass("toggle-net")){
			if(net.length>0){
				GetNetIOData();
			}else if(net.length==0){
				realtimeNetChart();
			}
			if($("#hidden-type").val()==3){
				$("#netUsageP").text("KBps");
			}
			$("#netUsageP").show();
		}	
}

//打开性能数据详情
function openMore (toggle){
	var type;
	if (toggle.hasClass("toggle-net")) {
		type = "net";
	}
	if (toggle.hasClass("toggle-io")) {
		type = "io";
	}
	if (toggle.hasClass("toggle-mem")) {
		type = "mem";
	}
	if (toggle.hasClass("toggle-cpu")) {
		type = "cpu";
	}
	$("#windowOverId").load("page/widget/queryDetailChart.jsp?vmId="+data2.vmId +"&type="+type,function(){
		$("#windowOverId").show();
		$("#vmIdDetail").val(data2.vmId);
		$("#typeDetail").val(type);
		$("#modal-close").bind("click",close);
	});	
}
function getBrowser(){
	var ie = (function() {  
        var v = 3, div = document.createElement('div'), a = div.all || [];  
        while (div.innerHTML = '<!--[if gt IE '+(++v)+']><br><![endif]-->', a[0]);  
        return 4 < v && v < 9 ? !v : v;  
      }()); 
	return ie;
}

/*实时数据图表end*/


/**操作云主机的事件start*/

/**启动虚拟机**/
function startVm() {
	$.messager.confirm($("#startVmTi").val(),$("#startVmContext").val() ,
		function(r){            
		if (r){
	    	if (data2 && data2.status == 3){ 
	    		if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
	    			data2.title = data2.name;
	    		}
	        	$.ajax({
	     		   type: "POST",
	     		   dataType:"json",
	     		   url: "servlet/vmList?way=start",
	     		   data:"id="+data2.vmId+"&name="+data2.title,
	     		   beforeSend:function(xhr){
	     			  showWait($("#processing").val(), 999999);
	     		   },
	     		   success: function(result){
	     			  hideWait();
	     			  if (result != null && typeof result != 'undefined') {
	    	 		    	if (result.success) {
	    	 		    		$.messager.show({          
	    	 		    			title:result.title,            
	    	 		    			msg:result.message, 
	    	 		    			showType:'show'       
	    	 		    		});
	    	 		    		if($(".instanceStatus")){
	    	 		    			$(".instanceStatus").html($("#hidden-start").val());
	    	 		    		}
	    	 		    		data2.status=2;
	    	 		    		$("#startVmId").addClass("divDisable");
	    	 		    		$("#closeVmId,#powerOffId").removeClass("divDisable");
	    	 		    		$("#startVmId2").addClass("divDisable");
	    	 		    		$("#closeVmId2,#powerOffId2").removeClass("divDisable");
	    	 		    		$("#startVmId").attr("onclick","");
	    	 		    		$("#closeVmId").attr("onclick","closeVm()");
	    	 		    		$("#powerOffId").attr("onclick","powerOff()");
	    	 		    		$("#startVmId2").attr("href","javascript:void(0)");
	    	 		    		$("#closeVmId2").attr("href","javascript:closeVm()");
	    	 		    		$("#powerOffId2").attr("href","javascript:powerOff()");
	    	 		    		if (data2.system == '0') {
	    	 		    			$("#mstscId").removeClass("divDisable");
	    	 		    			$("#mstscId").attr("onclick","mstsc()");
									$("#mstscId2").removeClass("divDisable");
									$("#mstscId2").attr("href","javascript:mstsc()");
									changeAntiVirSwitch(data2, 1);
								}
	    	 		    		else if (data2.system == '1'){
	    	 		    			$("#sshId").removeClass("divDisable");
			    	 		    	$("#sshId").attr("onclick","ssh()");
									$("#sshId2").removeClass("divDisable");
									$("#sshId2").attr("href","javascript:ssh()");
	    	 		    		}
	    	 		    	} else {
	    	 		    		$.messager.show({          
	    	 		    			title:result.title,            
	    	 		    			msg:result.message, 
	    	 		    			showType:'show'       
	    	 		    		});
	    	 		    	}
	     			  }
	     		   },
	     		   error:function(xhr, textStatus, errorThrown) {
	     			  hideWait();
	     		   }
	    	      });
	    	}
		}
    });
 	
}
/**关闭虚拟机***/
function closeVm() {
	$.messager.confirm($("#closeVmTi").val(),$("#closeVmContext").val() ,
			function(r){            
			if (r){
				if (data2 && data2.status != 3){ 
					if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
		    			data2.title = data2.name;
		    		}
			    	$.ajax({
			 		   type: "POST",
			 		   dataType:"json",
			 		   url: "servlet/vmList?way=close",
			 		   data:"id="+data2.vmId+"&name="+data2.title,
			 		   beforeSend:function(xhr){
			 			  showWait($("#processing").val(), 999999);
			 		   },
			 		   success: function(result){
			 			  hideWait();
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
			 			  }
			 		   },
			 		   error:function(xhr, textStatus, errorThrown) {
			 			 hideWait();
			 		   }
				      });
				} 	
			}
    });
}

/**关闭电源***/
function powerOff() {
	$.messager.confirm($("#poweroffVmTi").val(),$("#poweroffVmContext").val() ,
			function(r){            
			if (r){
				if (data2 && data2.status != 3){ 
					if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
		    			data2.title = data2.name;
		    		}
			    	$.ajax({
			 		   type: "POST",
			 		   dataType:"json",
			 		   url: "servlet/vmList?way=powerOff",
			 		   data:"id="+data2.vmId+"&name="+data2.title,
			 		   beforeSend:function(xhr){
			 			  showWait($("#processing").val(), 999999);
			 		   },
			 		   success: function(result){
			 			  hideWait();
			 			  if (result != null && typeof result != 'undefined') {
				 			  if (result.success) {
				 		    		//$("#my-instances").datagrid('reload');
				 		    		$.messager.show({          
				 		    			title:result.title,            
				 		    			msg:result.message, 
				 		    			showType:'show'       
				 		    		});
				 		    		if($(".instanceStatus")){
				 		    			$(".instanceStatus").html($("#hidden-close").val());
				 		    		}
				 		    		data2.status=3;	
				 		    		$("#startVmId").removeClass("divDisable");
		    	 		    		$("#closeVmId,#powerOffId").addClass("divDisable");
		    	 		    		$("#startVmId2").removeClass("divDisable");
		    	 		    		$("#closeVmId2,#powerOffId2").addClass("divDisable");
		    	 		    		$("#startVmId").attr("onclick","startVm()");
		    	 		    		$("#closeVmId").attr("onclick","");
		    	 		    		$("#powerOffId").attr("onclick","");
		    	 		    		$("#startVmId2").attr("href","javascript:startVm()");
		    	 		    		$("#closeVmId2").attr("href","javascript:void(0)");
		    	 		    		$("#powerOffId2").attr("href","javascript:void(0)");
		    	 		    		$("#mstscId").addClass("divDisable");
		    	 		    		$("#mstscId").attr("onclick","");
		    	 		    		$("#mstscId2").addClass("divDisable");
		    	 		    		$("#mstscId2").attr("href","javascript:void(0)");
		    	 		    		$("#sshId").addClass("divDisable");
			    	 		    	$("#sshId").attr("onclick","");
									$("#sshId2").addClass("divDisable");
									$("#sshId2").attr("href","javascript:void(0)");
									changeAntiVirSwitch(data2, 0);
				 		    	} else {
				 		    		$.messager.show({          
				 		    			title:result.title,            
				 		    			msg:result.message, 
				 		    			showType:'show'       
				 		    		});
				 		    	}
			 			  }
			 		   },
			 		   error:function(xhr, textStatus, errorThrown) {
			 			 hideWait();
			 		   }
				      });
				} 	
			}
    });
}


/**远程桌面**/
function mstsc() {
	if (data2 && data2.status == 2 && data2.system == 0){ 
    	$.ajax({
 		   type: "POST",
 		   dataType:"json",
 		   url: "servlet/vmList?way=network",
 		   data:"id="+data2.vmId,
 		   success: function(result){
 			  if (result != null && typeof result != 'undefined') {
 			       if(result.length == 1) {
 			    	  var net = result[0];
 			    	  var ip = net.ipAddr;
 			    	  mstscIp(ip);
 			      } else {
 			    	 $("#windowOverId").load("page/widget/selectIp.jsp",function(){
 					    $("#modal-close").bind("click",close);
 					    $("#windowOverId").css("display", "inline-block");
 						for (var i =0 ; i < result.length; i++) {
 							var ip = result[i].ipAddr;
 							if (typeof ip != "undefined") {
 								$("#ipSelect").append("<option value='" + ip + "'>" + ip);
 							}
 						}
	 			     });
 			      } 
 			  }
 		   }
	      });
	} 
}
//选择IP确定按钮单击事件
function selectIp() {
	mstscIp($("#ipSelect").val());
	$("#windowOverId").html("").hide();
}

String.prototype.endWith=function(s){ 
	if(s==null||s==""||this.length==0||s.length>this.length) 
		return false; 
	if(this.substring(this.length-s.length)==s) 
		return true; 
	else 
		return false; 
	return true; 
}; 
String.prototype.startWith=function(s){ 
	if(s==null||s==""||this.length==0||s.length>this.length) 
		return false; 
	if(this.substr(0,s.length)==s) 
		return true; 
	else 
		return false; 
	return true; 
};
function isHtml5() {
 	 var Sys = {};
     var ua = navigator.userAgent.toLowerCase();
     ua.match(/msie ([\d.]+)/) ? Sys.ie = ua.match(/msie ([\d.]+)/)[1] :
     ua.match(/firefox\/([\d.]+)/) ? Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1] :
     ua.match(/chrome\/([\d.]+)/) ? Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1] : 0;
     //以下进行测试
     var browserFlag = true;
     if(Sys.ie && (Sys.ie.startWith('7.') || Sys.ie.startWith('8.'))){
        browserFlag = false;
     }
     if(Sys.firefox && (Sys.firefox.startWith('4.') || Sys.firefox.startWith('5.'))) {
         browserFlag = false;
     }
     if(Sys.chrome && (Sys.chrome.startWith('4.') || Sys.chrome.startWith('5.') 
              || Sys.chrome.startWith('6.')  || Sys.chrome.startWith('7.') 
              || Sys.chrome.startWith('8.') || Sys.chrome.startWith('9.') 
              || Sys.chrome.startWith('10.') || Sys.chrome.startWith('11.') 
              || Sys.chrome.startWith('12.') || Sys.chrome.startWith('13.'))) {
                 browserFlag = false;
     }
 	
 	 var canvasFlag;
     try {
	    document.createElement('canvas').getContext('2d');
		canvasFlag = true;
	 } catch (e) {
		canvasFlag = false;
	 }

	 return window.WebSocket && browserFlag && canvasFlag;
}

/**打开VNC控制台**/
function openConsole() {
	
	if (data2){ 
		if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
			data2.title = data2.name;
		}
		
		var way;
		var isHtml5Flag = isHtml5();
		if (isHtml5Flag) {
			way = "getNoVncParam";
		} else {
			way = "getVncParam";
		}
		//先检查用户是否拥有该云主机权限
		$.ajax({
			type : "POST",
			dataType : "json",
			url : "servlet/vmList?way=checkVmBelongUser",
			data : "vmId=" + data2.vmId ,
			success : function(result) {
				if (result != null && typeof result != 'undefined') {
					if (result.success) {
						$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/vmList?way=" + way,
				 		   data:"id="+data2.vmId+"&name="+data2.title,
				 		   success: function(result){
				 			  if (result != null && typeof result != 'undefined') {
					    		var domainId = result.encryptId;
					    		var title = data2.title;
					    		var domainName = data2.domainName;
					    		var userName = result.userName;
					    		var password = result.password;
					    		var protocol = result.protocol;
					    		var hostIp = result.casIp;
					    		var hostPort = result.casPort;
				 		        /*var winName = new Date().getTime();*/
				 		        /* var $win = window.open('about:blank',winName,'resizable=yes,scrollbars=yes,titlebar=no,toolbar=no,menubar=no, location=no, status=no'); */
				 		        if (isHtml5Flag) {
					    			/*var status = result.status;
					    			alert("status" + status);*/
					    			var status = "running";
									var noVNCIp = result.noVncHost;
									var noVNCPort = result.noVNCPort;
									var token = result.token;
									var token = result.token;
									var localCursor = result.localCursor;
									openNoVNCDialog(domainId, title, userName, password, hostIp, hostPort, protocol, noVNCIp, noVNCPort, token, status, localCursor);	
					    		} else {
					    			openVNCDialog(domainId, title, userName, password, hostIp, hostPort, protocol);	
					    		} 	
				 			  }
				 		   }
					  });
					} else {
						$.messager.alert(result.title, result.message, 'error');
					}
				}
			}
		});
	} 	
}

function openVNCDialog(domainId, title, userName, password, hostIp, hostPort, protocol) {
    var $doc = document;
	var turnForm = $doc.createElement("form");  
	//一定要加入到body中！！   
	$doc.body.appendChild(turnForm);
	turnForm.name = "vnc";
	turnForm.method = "post";
//	turnForm.action = "vnc_applet.jsp";
	var explorer =navigator.userAgent;
	var isEdge = false;
	if (explorer != null && explorer != 'undefined' && explorer.indexOf("Edge") >= 0) {
		isEdge = true;
	}
	var javaEnabled = navigator.javaEnabled() && !isEdge;
	if (javaEnabled) {	    		
		turnForm.action = "vnc_applet.jsp";
		turnForm.target = "_blank";
	} else {
		turnForm.action = "vnc_jnlp.jsp";
		turnForm.target = "_self";
	}
	//创建隐藏表单
	    var element = $doc.createElement("input");
	    element.setAttribute("name", "domainId");
	    element.setAttribute("type", "hidden");
	    element.setAttribute("value", domainId);
	    turnForm.appendChild(element);

	if (title != null) {
		title = encodeURI(title);
	} else {
  	title = encodeURI(domainName);
	}
	element = $doc.createElement("input");
	element.setAttribute("name", "title");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", title);
	turnForm.appendChild(element);
	
	element = $doc.createElement("input");
	element.setAttribute("name", "userName");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", userName);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "password");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", password);
	turnForm.appendChild(element);
	
	element = $doc.createElement("input");
	element.setAttribute("name", "protocol");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", protocol);
	turnForm.appendChild(element);
	
	element = $doc.createElement("input");
	element.setAttribute("name", "hostIp");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", hostIp);
	turnForm.appendChild(element);
	if (hostPort != null) {
    	element = $doc.createElement("input");
    	element.setAttribute("name", "hostPort");
    	element.setAttribute("type", "hidden");
    	element.setAttribute("value", hostPort);
    	turnForm.appendChild(element);
	}
	turnForm.submit();  
}

function openNoVNCDialog(domainId, title, userName, password, hostIp, hostPort, protocol, proxyIp, proxyPort, token, status, localCursor) {
	var $doc = document;
	var turnForm = $doc.createElement("form");
	// 一定要加入到body中！！
	$doc.body.appendChild(turnForm);
	turnForm.name = "vnc";
	turnForm.method = "post";
	turnForm.action = "/ssv/vnc/vnc.jsp";
	turnForm.target = "_blank";
	// 创建隐藏表单
	var element = $doc.createElement("input");
	element.setAttribute("name", "domainId");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", domainId);
	turnForm.appendChild(element);

	if (title != null) {
		title = encodeURI(title);
	} else {
		title = encodeURI(domainName);
	}
	element = $doc.createElement("input");
	element.setAttribute("name", "title");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", title);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "userName");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", userName);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "password");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", password);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "casIp");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", hostIp);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "casPort");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", hostPort);
	turnForm.appendChild(element);
	
	element = $doc.createElement("input");
    element.setAttribute("name", "protocol");
    element.setAttribute("type", "hidden");
    element.setAttribute("value", protocol);
    turnForm.appendChild(element);
    
	element = $doc.createElement("input");
	element.setAttribute("name", "token");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", token);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "status");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", status);
	turnForm.appendChild(element);

	element = $doc.createElement("input");
	element.setAttribute("name", "host");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", proxyIp);
	turnForm.appendChild(element);

	if (proxyPort != null) {
		element = $doc.createElement("input");
		element.setAttribute("name", "port");
		element.setAttribute("type", "hidden");
		element.setAttribute("value", proxyPort);
		turnForm.appendChild(element);
	}
	
	element = $doc.createElement("input");
	element.setAttribute("name", "localCursor");
	element.setAttribute("type", "hidden");
	element.setAttribute("value", localCursor);
	turnForm.appendChild(element);
	
	turnForm.submit();
}


//打开虚拟机快照窗口
function snapshot() {
	if (data2) {
		//先检查用户是否拥有该云主机权限
		$.ajax({
			type : "POST",
			dataType : "json",
			url : "servlet/vmList?way=checkVmBelongUser",
			data : "vmId=" + data2.vmId ,
			success : function(result) {
				if (result != null && typeof result != 'undefined') {
					if (result.success) {
						$("#windowOverId").load("page/widget/snapshotTree.jsp",function(){
							$("#modal-close").bind("click",close);
							var overlay=$(".window-overlay");
							overlay.css("display", "inline-block");
							if (data2){ 
								$("#tt").tree({
									method:'GET',
									onClick:function(node){
										var nodeAttr = node.attributes;
										var attr1 = nodeAttr[0].attr1;
										if (typeof attr1 == "undefined") {
											$("#descSpan").text("");
										} else {
										    $(".descTooltip").html(snapBuildToolTip(attr1,$(this)));
									        $(".details-tab").css("height",$(".description").css("height"));
										    $(".description").css("height",$(".details-tab").css("height"));
										    $("div.itemtooltip").jtooltip();
										}
										
									},
									url:"servlet/vmList?way=snapshotList&id="+data2.vmId
								});
							}
					    });
					} else {
						$.messager.alert(result.title, result.message, 'error');
					}
				}
			}
		});
	}
}

//打开虚拟机备份窗口
function backup() {
	if (data2) {
		//先检查
		$.ajax({
			type : "POST",
			dataType : "json",
			url : "servlet/vmList?way=checkBackup",
			data : "vmId=" + data2.vmId ,
			success : function(result) {
				if (result != null && typeof result != 'undefined') {
					if (result.success) {
						$("#windowOverId").load("page/widget/addBackup.jsp",function(){
							$("#modal-close").bind("click",close);
							var overlay=$(".window-overlay");
							overlay.css("display", "inline-block");
							$("#vmIdhidden").val(data2.vmId);
							if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
								data2.title = data2.name;
							}
							$("#vmNamehidden").val(data2.title);
						});
					} else {
						$.messager.alert(result.title, result.message, 'error');
					}
				}
			}
		});
	}
}
//断开浮动桌面池的虚拟桌面
function releaseVDesktop() {
	$.messager.confirm($("#releaseVDesktop").val(), $("#confirmReleaseVDesktop").val(),
			function(r) {
				if (r) {
					if (data2 && data2.assignMode == 2) {
						if (typeof data2.title == 'undefined'
								|| '' == data2.title || data2.title == null) {
							data2.title = data2.name;
						}
						$.ajax({
							type : "POST",
							dataType : "json",
							url : "servlet/vmList?way=releaseVDesktop",
							data : "vmId=" + data2.vmId + "&title=" + data2.title,
							beforeSend:function(xhr){
					 			  showWait($("#processing").val(), 999999);
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
										$.messager.alert(result.title,
												result.message, 'error');
									}
								}
								$("#frame").layout("panel","center").panel('refresh','instances.jsp');
							},
							error:function(xhr, textStatus, errorThrown) {
					 			  hideWait();
					 		}
						});
					}
				}
			});
}

//type 1 start, 0 close
function changeAntiVirSwitch(data2, type) {
	if (data2.publicCloudType != '2' || data2.system != '0') {
		return ;
	}
	switch (type) {
		case 0 :
			$.ajax({
	 	 		   type: "GET",
	 	 		   dataType:"json",
	 	 		   url: "servlet/vmList?way=checkAntivirusConfigured",
	 	 		   data:"domainId="+data2.vmId,
	 	 		   success: function(data){
	 	 			   if (data != null && typeof data != 'undefined' && data.message != 'true') {
							return ;
	     		 	   }
	 	 			   if (data2.antivirusEnable == '0') {
	 	 				   $("#enableAntivirusId").removeClass("divDisable");
	 	 				   $("#enableAntivirusId").attr("onclick","antivirusConfig(1)");
	 	 				   
	 	 				   $("#enableAntivirusGraphId").removeClass("divDisable");
	 	 				   $("#enableAntivirusGraphId").attr("href","javascript:antivirusConfig(1)");
	 	 			   }
	 	 			   else {
	 	 				   $("#disableAntivirusId").removeClass("divDisable");
	 	 				   $("#disableAntivirusId").attr("onclick","antivirusConfig(0)");
	 	 				   
	 	 				   $("#disableAntivirusGraphId").removeClass("divDisable");
	 	 				   $("#disableAntivirusGraphId").attr("href","javascript:antivirusConfig(0)");
	 	 			   }
	 	 		   }
	 	      	});
			break;
		case 1 :
			$("#disableAntivirusId").addClass("divDisable");
			$("#disableAntivirusId").attr("onclick","");
			$("#disableAntivirusGraphId").addClass("divDisable");
			$("#disableAntivirusGraphId").attr("href","javascript:void(0)");
			break;
	}
}
