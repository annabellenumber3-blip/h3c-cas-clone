/**
 * 云主机备份窗口
 */

//关闭云主机窗口
function closeBackup() {
	$("#windowOverId").hide();
}
//云主机备份
function submitBackup() {
	var vmId = $("#vmIdhidden").val();
	var name = $("#backupNameId").val();
	var desc = $("#backupDescId").val();
	var domainName = $("#vmNamehidden").val();
	//问题单201506170234 新增自动替换旧备份字段  by f10574 20150624
	var autoReplacement = $("#autoReplacementInputId").attr("checked") == "checked" ? 1 : 0;
	var flag = false;
	var obj1=$("#backupNameId, #backupDescId");
	obj1.keyup();
	flag=obj1.hasClass("wrong-border");
	if (flag) {
		return;
	}
	$.ajax({
		type : "POST",
		dataType : "json",
		async: false,
		url : "servlet/vmList?way=backup",
		data : "vmId=" + vmId + "&domainName=" + encodeURIComponent(encodeURIComponent(domainName)) + "&name="
		+ encodeURIComponent(encodeURIComponent(name)) + "&desc=" + encodeURIComponent(encodeURIComponent(desc))
		+ "&autoReplacement=" + encodeURIComponent(encodeURIComponent(autoReplacement)),
		beforeSend : function(xhr) {
			// showWait();
		},
		success : function(result) {
			// hideWait();
			$("#windowOverId").hide();
			if (result != null && typeof result != 'undefined') {
				if (result.success) {
					$.messager.show({
						title : result.title,
						msg : result.message,
						showType : 'show'
					});
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
function checkTitle(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark&&inputId=="backupNameId"){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="backupNameId"){
   		 mark= checkNameLen(inputObj);
   	 }
	 if(mark&&inputId=="backupNameId"){
   		 mark= regexName(inputObj);
		 if (mark) {
			 //201706100284 校验备份名称  l12838
			 mark = checkBackNameIsExist(inputObj, inputId);
   	 }
   	 }
	 if(mark&&inputId=="backupDescId"){
		 mark = checkContentReg(inputObj);
		 if (mark) {
   		     mark= checkContentLen(inputObj);
		 }
   	 }
	 return mark;
}

function checkBackNameIsExist (obj, inputId) {
	obj.tooltip('destroy');
	var vmId = $("#vmIdhidden").val();
	if(!obj.hasClass("wrong-border")&&$.trim(obj.val())!=""){
		$.ajax({
			type : "GET",
			dataType : "json",
			async:false,
			url : "servlet/vmList?way=checkBackUpName",
			data:"backUpName="+encodeURIComponent(encodeURIComponent(obj.val()))+"&id="+vmId,
			success : function(result) {
				if (result != null && typeof result != 'undefined' && result !="") {
					var strategyName = $("#backupNameId");
					if(result == true){
						strategyName.tooltip({
							   title:$('#backUpNameExist').val(),
							   placement:"right",
							   trigger:"manual"
						});
					    showWrongResult(strategyName);
					}else{
						showRightResult(strategyName);
					}
				}
			}
		});
	}
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
//	var partten = /^[\A-Za-z0-9\u4E00-\u9FA5\uF900-\uFA2D\-\_\.\@]*$/;
//	name.tooltip('destroy');
//	if(name.val()){
//		if(partten.test(name.val())){
//			return showRightResult(name);
//		}else{
//			name.tooltip({
//				   title:$('#nameNoChRange').val(),
//				   placement:"right",
//				   trigger:"manual"
//			   });
//			return showWrongResult(name);
//		}
//	}
//	var partten = /^[\A-Za-z0-9\-\_\.\u4E00-\u9FA5\uF900-\uFA2D]*$/;
//	name.tooltip('destroy');
//	if(name.val()){
//		if(partten.test(name.val())){
//			if(name.val().substring(0,1)=="-"||name.val().substring(0,1)=="."){
//				name.tooltip({
//					   title:$('#nameNoChRangeNew').val(),
//					   placement:"right",
//					   trigger:"manual"
//				   });
//				return showWrongResult(name);
//			}else{
//				return showRightResult(name);
//			}
//			
//		}else{
//			name.tooltip({
//				   title:$('#nameNoChRangeNew').val(),
//				   placement:"right",
//				   trigger:"manual"
//			   });
//			return showWrongResult(name);
//		}
//	}
	var partten = /^[a-zA-Z0-9_\-\.]+$/;
	var number = /^[0-9]+$/;
	name.tooltip('destroy');
	if(name.val()){
		if(number.test(name.val())){
			name.tooltip({
				   title:$('#nameNoChRangeNew').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(name);
		}
			if(name.val().substring(0,1)=="-"||name.val().substring(0,1)=="."){
				name.tooltip({
					   title:$('#nameNoChRangeNew').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}
		if(!partten.test(name.val())){
			name.tooltip({
				   title:$('#nameNoChRangeNew').val(),
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
	var titleContent = $('#maxLength128').val();
	 if(obj.val()&&obj.val().length>128){
		 
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
