/**
 * 云告警配置添加云主机
 */
 function submitConfig() {
 	var ids = [];
 	var names = [];
	var rows = $("#my-instances").datagrid("getSelections");
	if (rows == null || rows.length <= 0) {
    	return false;
    }
    for(var i=0; i<rows.length; i++){
    	var row = rows[i];
    	if (row.id == null || row.id <= 0) {
    		continue;
    	}
    	names.push(row.title);
    	ids.push(row.id);
    }
    names = names.join(",");
    var jsonText = '{';
    jsonText += "'vmIds':[" + ids + "],";
    jsonText += "'eventStrategyId':" + $("#strategyId").val();
    jsonText += "}";
    $.ajax({
	    type: "POST",
	    dataType:"json",
	    url: "servlet/alarm?way=addAlarmVm",
	    data:"json=" + jsonText +"&names="+ names,
	    beforeSend:function(xhr){
		   showWait($("#processing").val(), 999999);
	    },
	    success: function(result){
		   hideWait();
		   $("#windowOverId").hide();
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
	    },
	    error:function(xhr, textStatus, errorThrown) {
		   hideWait();
	    }
    });
 }
 
 /**
  * 关闭告警配置界面
  */
 function closeConifg() {
 	$("#windowOverId").html("");
	$("#windowOverId").hide();
 }
 