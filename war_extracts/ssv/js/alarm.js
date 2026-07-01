var strategyId = null;
var isReload = false;
/**
 * 初始化云主机下拉框的值
 */
function initCloudHost() {
	$("#cloudHostInputId").combobox({   
        url:'servlet/alarm?way=select&type=vm', 
        valueField:'id',   
        textField:'title',
        editable:true,
        onSelect: function(rec){   
        	searchAlarm();
        },
        filter: function(q, row){
            // q是你输入的值，row是数据集合
            var opts = $(this).combobox('options');
            // 同一转换成小写做比较，==0匹配首位，>=0匹配所有
            return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) >= 0;
        }
    }).combobox("initClear");
}

function initSelect() {
	$("#categorySelect").combobox({
		valueField:'value',   
        textField:'text',
        editable:false,
        width:100,
        height:30,
        panelHeight:'auto',
        data:[
	        	{'value':'','text':$("#allCategory").val()},
	        	{'value':'8','text':$("#cpuUtilization").val()},
	        	{'value':'9','text':$("#memoryUtilization").val()},
	        	{'value':'10','text':$("#diskUtilization").val()}
        	 ]
	});
	
	$("#levelSelect").combobox({
		valueField:'value',   
        textField:'text',
        editable:false,
        width:100,
        height:30,
        panelHeight:'auto',
        data:[
	        	{'value':'','text':$("#allLevel").val()},
	        	{'value':'1','text':$("#urgency").val()},
	        	{'value':'2','text':$("#importance").val()},
	        	{'value':'3','text':$("#minor").val()},
	        	{'value':'4','text':$("#prompt").val()}
        	 ]
	});
}
/**
 * 初始化云告警状态
 */
function initAlarmState() {
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "servlet/alarm?way=queryAlarmState",
		success : function(result) {
			if (result != null && typeof result != 'undefined') {
				strategyId = result.id;
				var state = result.state;
				if(state == 0){
					$("#startAlarmId").show();
					$("#closeAlarmId").hide();
				} else {
					$("#startAlarmId").hide();
					$("#closeAlarmId").show();
				}
			}	
		}
	});
}
/**
 * 查询云告警
 */
function searchAlarm() {
	$("#alarmlist").datagrid('load', {
		domainId:$("#cloudHostInputId").combobox('getValue'),
		domainTitle:$("#cloudHostInputId").combobox('getText'),
		category:$("#categorySelect").combobox('getValue'),
		level:$("#levelSelect").combobox('getValue')
	});
}

/**
 * 开启云告警
 */
function startAlarm() {
	$.messager.confirm($("#openAlarm").val(),$("#openAlarmContext").val() ,
        			function(data){            
        			if (data){
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/alarm?way=start",
				 		   data:"strategyId="+strategyId,
				 		   beforeSend:function(xhr){
				 			  showWait($("#processing").val(), 999999);
				 		   },
				 		   success: function(result){
				 			  hideWait();
				 			  if (result != null && typeof result != 'undefined') {
					 			   if (result.success) {
					 			   		$("#startAlarmId").hide();
										$("#closeAlarmId").show();
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    		//刷新列表
					 		    		$("#alarmlist").datagrid("reload",{	 		    			
											domainId:$("#cloudHostInputId").combobox('getValue'),
											category:$("#categorySelect").combobox('getValue'),
											level:$("#levelSelect").combobox('getValue')
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
            });
}

/**
 * 关闭云告警
 */
function closeAlarm() {
	$.messager.confirm($("#closeAlarm").val(),$("#closeAlarmContext").val() ,
        			function(data){            
        			if (data){
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/alarm?way=close",
				 		   data:"strategyId="+strategyId,
				 		   beforeSend:function(xhr){
				 			  showWait($("#processing").val(), 999999);
				 		   },
				 		   success: function(result){
				 			  hideWait();
				 			  if (result != null && typeof result != 'undefined') {
					 			   if (result.success) {
					 			   		$("#startAlarmId").show();
										$("#closeAlarmId").hide();
					 		    		$.messager.show({          
					 		    			title:result.title,            
					 		    			msg:result.message, 
					 		    			showType:'show'       
					 		    		});
					 		    		//刷新列表
					 		    		isReload = true;
					 		    		$("#alarmlist").datagrid("reload",{
					 		    			domainId:$("#cloudHostInputId").combobox('getValue'),
											category:$("#categorySelect").combobox('getValue'),
											level:$("#levelSelect").combobox('getValue')
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
            });
}

/**
 * 新增提供云告警的云主机
 */
function addAlarmVm() {
	$("#windowOverId").load("page/widget/applyAlarmConfig.jsp",function(){
			$("#strategyId").val(strategyId);
			$("#windowOverId").show();
	});
}

/**
 * 删除需提供云告警的云主机
 */
function removeAlarmVm() {
	var ids = [];
	var names = [];
	var rows = $("#alarmlist").datagrid("getSelections");
	if (rows == null || rows.length < 0) {
    	return false;
    }
    for(var i=0; i<rows.length; i++){
    	var row = rows[i];
    	if (row.id == null || row.id <= 0) {
    		continue;
    	}
    	ids.push(row.id);
    	names.push(row.title);
    }
    names = names.join(",");
    var jsonText = '{';
    jsonText += "'vmIds':[" + ids + "],";
    jsonText += "'eventStrategyId':" + strategyId;
    jsonText += "}";
    $.messager.confirm($("#removeAlarmVm").val(),$("#removeAlarmVmContext").val() ,
        			function(data){            
        			if (data){
				    	$.ajax({
				 		   type: "POST",
				 		   dataType:"json",
				 		   url: "servlet/alarm?way=removeAlarmVm",
				 		   data:"json=" + jsonText +"&names=" + names,
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
				 			  $("#alarmlist").datagrid("reload",{});
				 			  $("#removeVmId").attr("onclick","");
				 		   },
				 		   error:function(xhr, textStatus, errorThrown) {
				 			  hideWait();
				 		   }
			 	      });
        			}
            });
}

function showLevel(value,rowData,rowIndex) {
	if (value == 1) {
		return $("#urgency").val();
	} else if (value == 2) {
		return $("#importance").val();
	} else if (value == 3) {
		return $("#minor").val();
	} else {
		return $("#prompt").val();
	}
}

function showCategory(value,rowData,rowIndex) {
	if (value == 8) {
		return $("#cpuUtilization").val();
	} else if (value == 9) {
		return $("#memoryUtilization").val();
	} else {
		return $("#diskUtilization").val();
	}
}

function setFirstPage(){
	var opts = $("#alarmlist").datagrid('options');
    opts.pageNumber = 1;
	opts.pageSize = opts.pageSize;
}