/**
 * 增加虚拟机快照
 */

//关闭增加虚拟机快照窗口
function closeAddSnapshot() {
	$("#addSnapshotDiv").hide();
}
//提交增加虚拟机快照
function submitAddSnapshot() {
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
		var name = $("#snapshotNameId").val();
		var desc = $("#snapshotDescId").val();
		var domainName = row.name;
		var title = row.title;
		if (typeof title == 'undefined' || '' == title || title == null) {
			title = row.name;
		}
		var flag = false;
		var obj1=$("#snapshotNameId, #snapshotDescId");
		obj1.keyup();
		flag=obj1.hasClass("wrong-border");
		if (flag) {
			return;
		}
		
		$.ajax({
			type : "POST",
			dataType : "json",
			async: false,
			url : "servlet/vmList?way=addSnapshot",
			data : "vmId=" + vmId + "&domainName=" + domainName + "&title=" + title + "&name="
					+ name + "&desc=" + desc,
			beforeSend : function(xhr) {
				// showWait();
			},
			success : function(result) {
				// hideWait();
				if (result != null && typeof result != 'undefined') {
					$("#addSnapshotDiv").hide();
					if (result.success) {
						$.messager.show({
							title : result.title,
							msg : result.message,
							showType : 'show'
						});
						var msgId = result.data;
						if (msgId) {
							$.ajax({
								type : "GET",
								dataType : "json",
								url : "servlet/vmList?way=message",
								data : "msgId=" + msgId,
								success : function(RsTaskMsg) {
									// hideWait();
									if (RsTaskMsg != null && typeof RsTaskMsg != 'undefined') {
										if (RsTaskMsg.completed == true) {
											$("#tt").tree('reload');
										} 
									}
								}
							});
						}
					} else {
						$.messager.alert(result.title, result.message, 'error');
					}
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				// hideWait();
			}
		});
	}

}
function checkTitle(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark&&inputId=="snapshotNameId"){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="snapshotNameId"){
   		 mark= checkNameLen(inputObj);
   	 }
	 if(mark&&inputId=="snapshotNameId"){
   		 mark= regexName(inputObj);
   	 }
	 if(mark&&inputId=="snapshotDescId"){
		 mark = checkContentReg(inputObj);
		 if (mark) {
   		     mark= checkContentLen(inputObj);
		 }
   	 }
	 return mark;
}
function checkContentReg(obj){
	obj.tooltip('destroy');
	var titleContent = $('#notSpecialCharacter').val();
	 if(obj.val().indexOf('<') > -1 || obj.val().indexOf('>') > -1){
		 obj.tooltip({
			   title:titleContent,
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(obj);
		}else{
			return showRightResult(obj);
		}
}
function regexName(name){
	var partten = /^[a-zA-Z0-9_\-\.]+$/;
	var number = /^[0-9]+$/;
	name.tooltip('destroy');
	if(name.val()){
		if(number.test(name.val())){
			name.tooltip({
				   title:$('#snapshotNoChRange').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(name);
		}
		if(name.val().substring(0,1)=="-"||name.val().substring(0,1)=="."){
			name.tooltip({
				   title:$('#snapshotNoChRange').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(name);
		}
		if(!partten.test(name.val())){
			name.tooltip({
				   title:$('#snapshotNoChRange').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(name);
		}
	
		return showRightResult(name);
	}
}
function checkContentLen(obj){
	obj.tooltip('destroy');
	var titleContent = $('#maxLength120').val();
	 if(obj.val()&&obj.val().length>120){
		 
		 obj.tooltip({
			   title:titleContent,
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(obj);
		}else{
			return showRightResult(obj);
		}
}
function checkNameLen(obj){
	obj.tooltip('destroy');
	var titleContent = $('#maxLength100').val();
	 if(obj.val()&&obj.val().length>100){
		 
		 obj.tooltip({
			   title:titleContent,
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(obj);
		}else{
			return showRightResult(obj);
		}
}
function checkItemNull(obj){

	obj.tooltip('destroy');
	if(obj.val()==""){
		obj.tooltip({
		   title:$('#nullTip').val(),
		   placement:"right",
		   trigger:"manual"
	   });
	   return showWrongResult(obj);
	}else{
		return showRightResult(obj);
	}
}
function showWrongResult(obj){
	obj.parents(".item").find(".control-label").addClass("wrong-word-color");
	obj.addClass("wrong-border");
	obj.tooltip('show');
	return false;
}
function showRightResult(obj){
	obj.parents(".item").find(".control-label").removeClass("wrong-word-color");
	obj.removeClass("wrong-border");
	obj.tooltip('destroy');
	return true;
}
