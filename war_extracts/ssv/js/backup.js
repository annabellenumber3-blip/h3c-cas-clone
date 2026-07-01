/**
 * 云备份
 */

//查询云备份
function searchBackup(){
	$("#backupListId").datagrid('load', {
		domainTitle:$("#instantInputId").combobox('getText'),
		vmId:$("#instantInputId").combobox('getValue')
	});
}

function filterBackupWorkFlow(){
	$("#historyStrategyTable").datagrid('load', {
		type:$("#resultSelect2").val()
	});
}

//打开申请备份策略的窗口
function applyBackupStrategy(type) {
	var row = $("#backupListId").datagrid("getSelected");
	
	if (type == 'modify') {
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "servlet/backupServlet?way=queryStrategyInfo",
			data : "strategyId=" + row.id,
			success:function(result) {
				if (result == null) {
					$.messager.alert($("#tips").val(), $("#strategyWorkFlowNotExists").val(), 'info');
					$("#backupListId").datagrid("reload");
					return;
				} else {
					$.ajax({
						type : "GET",
						dataType : "json",
						url : "servlet/backupServlet?way=queryStrategyWorkFlowInfo",
						data : "strategyId=" + row.id,
						success:function(result) {
							if (result != null && type == 'modify') {
								$.messager.alert($("#tips").val(), $("#strategyWorkFlowExists").val() + result.name + "。", 'info');
								return;
							} else {
							    $("#windowOverId").load("page/widget/applyBackupStrategy.jsp",function(){
							    	//修改问题单201608010365，EDGE浏览器，ssv云备份中云备份策略申请修改成功后，再次修改界面的时间与第一次修改完成后时间不符。add cache:false
							    	if (type == 'modify') { //若为修改策略，初始化界面的数据
										$.ajax({
											type : "GET",
											dataType : "json",
											cache:false,
											url : "servlet/backupServlet?way=queryStrategyInfo",
											data : "strategyId=" + row.id ,
											success:function(result) {
												$('#nameInputId').val(result.name);
												$('#nameInputId').attr("disabled",true);
												$('#typeInputId').val(result.id);
												$('#descId').val(result.description);
												$('#resultSelect').val(result.frequency);
												$('#timeInputId').numberspinner('setValue', result.hour);
												$('#title').hide();
												$('#title2').show();
												//问题单201506170234 新增保留个数、自动替换旧备份字段  by f10574 20150624
												$('#keepNumberInputId').numberspinner('setValue', result.keepNumber);
												$("#autoReplacementInputId").prop("checked", result.autoReplacement != 0);
												var selectedDay = result.day.split(",");
												var vmIdArr = result.vmIdStrs.split(",");
												$('#vmIdList').val(vmIdArr);
												if (result.frequency == 0) { //每月
													$("div.scheduler-days.monthly a.scheduler-day").removeClass("selected");
													for (var i = 0; i < selectedDay.length; i++) {
														$("div.scheduler-days.monthly a#"+selectedDay[i]).addClass("selected");
													}
													$("#modal").height(615);
													$("div.scheduler-days").show();
													$("div.scheduler-days.monthly").show();
													$("div.scheduler-days.weekly").hide();
													$("#dateInfo").show();
												} else if (result.frequency == 1) { //每周
													$("div.scheduler-days.weekly a.scheduler-day").removeClass("selected");
													for (var i = 0; i < selectedDay.length; i++) {
														$("div.scheduler-days.weekly a#"+selectedDay[i]).addClass("selected");
													}
													$("#modal").height(500);
													$("div.scheduler-days").show();
													$("div.scheduler-days.monthly").hide();
													$("div.scheduler-days.weekly").show();
													$("#dateInfo").show();
												} else {
													$("#modal").height(450);
													$("div.scheduler-days").hide();
													$("#dateInfo").hide();
												}
											}
										});
							    	}
								  	$("#windowOverId").show();
							    });
							}
						}
					});
				}
			}
		});
	} else {
		$("#windowOverId").load("page/widget/applyBackupStrategy.jsp",function(){
			$("#windowOverId").show();
		});
	}

}



//启用云备份策略
function startStrategy() {
	var row = $("#backupListId").datagrid("getSelected");

	$.messager.confirm($("#startBackupStrategy").val(),$("#startStrategyContext").val() ,
			function(r){            
			if (r){
	        	$.ajax({
	     		   type: "POST",
	     		   dataType:"json",
	     		   url: "servlet/backupServlet?way=startStrategy",
	     		   data:"strategyId="+row.id+"&strategyName="+row.name,
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
	    	 		    		$("#startStrategyBtn").attr("onclick","");
		    	 		    	$("#stopStrategyBtn").attr("onclick","stopStrategy()");
	    	 		    		$("#startStrategyBtn").addClass("btn-forbidden");
	    	 		    		$("#stopStrategyBtn").removeClass("btn-forbidden");
	    	 		    		$("#backupListId").datagrid('reload'); 
	    	 		    	} else {
/*	    	 		    		$.messager.show({          
	    	 		    			title:result.title,            
	    	 		    			msg:result.message, 
	    	 		    			showType:'show'       
	    	 		    		});*/
	    	 		    		$.messager.alert($("#tips").val(), $("#strategyWorkFlowNotExists").val(), 'info');
	    	 		    		$("#backupListId").datagrid("reload");
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


//停用云备份策略
function stopStrategy() {
	var row = $("#backupListId").datagrid("getSelected");
	$.messager.confirm($("#stopBackupStrategy").val(),$("#stopStrategyContext").val() ,
			function(r){            
			if (r){
	        	$.ajax({
	     		   type: "POST",
	     		   dataType:"json",
	     		   url: "servlet/backupServlet?way=stopStrategy",
	     		   data:"strategyId="+row.id+"&strategyName="+row.name,
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
    	 		    		    $("#startStrategyBtn").attr("onclick","startStrategy()");
    	 		    		    $("#startStrategyBtn").removeClass("btn-forbidden");
    	 		    		    $("#stopStrategyBtn").attr("onclick","");
    	 		    		    $("#stopStrategyBtn").addClass("btn-forbidden");
	    	 		    		$("#backupListId").datagrid('reload'); 
	    	 		    	} else {
/*	    	 		    		$.messager.show({          
	    	 		    			title:result.title,            
	    	 		    			msg:result.message, 
	    	 		    			showType:'show'       
	    	 		    		});*/
	    	 		    		$.messager.alert($("#tips").val(), $("#strategyWorkFlowNotExists").val(), 'info');
	    	 		    		$("#backupListId").datagrid("reload");
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







