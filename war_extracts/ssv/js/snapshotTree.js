/**
 * 虚拟机快照树
 */

//删除虚拟机快照
function delSnapshot() {
	var row;
	var vmId;
	if (typeof data2 == 'undefined') {
		row = $("#my-instances").datagrid("getSelected");
		vmId = row.id;
	} else {
		row = data2;
		vmId = data2.vmId;
	}
	if (row) {
		var node = $("#tt").tree('getSelected');
		if (node) {
			$.messager.confirm($("#delSnapshot").val(), $("#confrimDelSnapshot").val(),
				function(r) {
					if (r) {
						var name = node.text;
						var domainName = row.name;
						var title = row.title;
						if (typeof title == 'undefined' || '' == title || title == null) {
							title = row.name;
						}
						$.ajax({
							type : "POST",
							dataType : "json",
							url : "servlet/vmList?way=delSnapshot",
							data : "vmId=" + vmId + "&domainName=" + domainName + "&name=" + name + "&title=" + title,
							beforeSend : function(xhr) {
								showWait();
							},
							success : function(result) {
								hideWait();
								if (result.success) {
									// 刷新快照树
									refreshSnapshot();
								}
								$.messager.show({
									title : result.title,
									msg : result.message,
									showType : 'show'
								});
							},
							error : function(xhr, textStatus, errorThrown) {
								hideWait();
							}
						});
					}
				});
		}

	}
}

// 恢复虚拟机快照
function restoreSnapshot() {
	var row;
	var vmId;
	if (typeof data2 == 'undefined') {
		row = $("#my-instances").datagrid("getSelected");
		vmId = row.id;
	} else {
		row = data2;
		vmId = data2.vmId;
	}
	if (row) {
		var node = $("#tt").tree('getSelected');
		if (node) {
			$.messager.confirm($("#restoreSnapshot").val(), $("#confrimRestoreSnapshot").val(),
				function(r) {
					if (r) {
						var name = node.text;
						var domainName = row.name;
						var title = row.title;
						if (typeof title == 'undefined' || '' == title || title == null) {
							title = row.name;
						}
						$.ajax({
					 		   type: "POST",
					 		   dataType:"json",
					 		   url: "servlet/vmList?way=restoreSnapshot",
					 		   data:"vmId=" + vmId + "&domainName=" + domainName + "&name=" + name + "&title=" + title,
					 		   beforeSend:function(xhr){
					 			  showWait();
					 		   },
					 		   success: function(result){
					 			    hideWait();
					 			    var state = result.state;
					 		    	if (result.success) {
					 		    		refreshSnapshot();
					 		    		$("#my-instances").datagrid('reload');
					 		    		//修改问题单201703250123，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【SSV】【云主机】选中某一台云主机创建云主机快照，再进行快照还原后删除已创建的快照，此时无法删除
					 		    		setTimeout(function() {
					 		    			$("#my-instances").datagrid("selectRecord", vmId);
					 		    		}, 1000);
					 		    	}
					 		    	$.messager.show({          
				 		    			title:result.title,             
				 		    			msg:result.message, 
				 		    			showType:'show'       
				 		    		});
					 		   },
					 		   error:function(xhr, textStatus, errorThrown) {
					 			  hideWait();
					 		   }
					      });
					}
				});
		}
	}
}
//刷新虚拟机快照树
function refreshSnapshot(){
	$("#tt").tree('reload');
	//	修改问题单 201503280060   删除描述内容    -add by h10630 2015.4.1
	$("#descSpan").text('');
}

function close(){
    $("#windowOverId").hide();
}
function addSnapshot() {
	var row;
	var vmId;
	if (typeof data2 == 'undefined') {
		row = $("#my-instances").datagrid("getSelected");
		vmId = row.id;
	} else {
		row = data2;
		vmId = data2.vmId;
	}
	//先检查用户是否拥有该云主机权限
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "servlet/vmList?way=checkVmBelongUser",
		data : "vmId=" + vmId,
		success : function(result) {
			if (result != null && typeof result != 'undefined') {
				if (result.success) {
					$("#addSnapshotDiv").show();
					$("#addSnapshotDiv").load("page/widget/addSnapshot.jsp",function(){
					});
				} else {
					$.messager.alert(result.title, result.message, 'error');
				}
			}
		}
	});
}