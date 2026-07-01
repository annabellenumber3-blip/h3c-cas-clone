/**
 * 云硬盘
 */
//提交申请云硬盘
function submitApply() {
	var flag = false;
	var obj1=$("#nameInputId, #capacityInputId,.spinner");
	obj1.keyup();
	checkNameExist(false);
	flag=obj1.hasClass("wrong-border");
	if (flag) {
		return;
	}
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "servlet/applyDiskServlet?way=apply",
		data:"name="+$("#nameInputId").val() + "&capacity=" + $("#capacityInputId").numberspinner('getValue'),
		beforeSend : function(xhr) {
			// showWait();
		},
		success : function(result) {
			// hideWait();
			$("#applyDiskDiv").hide();
			if (result != null && typeof result != 'undefined') {
				if (typeof result == 'object') {
					if (result.success) {
						$("#diskListId").datagrid('reload'); 
						$.messager.show({
							title : result.title,
							msg : result.message,
							showType : 'show'
						});
						$(".window-overlay").css("display", "none");
					} else {
						$.messager.show({
							title : result.title,
							msg : result.message,
							showType : 'show'
						});
					}
				}
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			// hideWait();
		}
	});
}
function checkNameVal(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark){
		 mark= regexName(inputObj);
		 if(mark){
			 mark= regexNameIsAllNum(inputObj);
		 }
	 }
	 if(mark){
   		 mark= checkNameLen(inputObj);
   	 }
	 if(mark){
		 $('body').stopTime('checkName');
		 $('body').oneTime('800ms','checkName',checkNameExist);
	 }
}

function checkNameExist(isAsync){
	var obj = $("#nameInputId");
	if(isAsync != false){
		isAsync = true;
	}
	if(obj.val()){
		 $.ajax({
			 type : "GET",
			 dataType : "json",
			 url : "servlet/applyDiskServlet?way=checkNameExist",
			 data:"name="+obj.val(),
			 async:isAsync,
			 success : function (result){
				 if(!obj.hasClass("wrong-border")){
				 if(result == true){
					 obj.tooltip({
						   title:$('#nameExistTip').val(),
						   placement:"right",
						   trigger:"manual"
					   });
					 mark = showWrongResult(obj);
				 } else {
					 mark = showRightResult(obj);
				 }
			 }
			 }
		 })
	}
}
function checkNumber(e) {
	var inputId = e.target.id;
	var inputObj = $("#" + inputId);
	inputObj.tooltip('destroy');
	if (inputObj.val() != '') {
	    //修改问题单:201706200744 必须为正整数
	    var notIsPositivNum = /^[0-9]+$/;
	    if (!notIsPositivNum.test(inputObj.val())) {
	        inputObj.tooltip({
                title:$('#notIsPositivNum').val(),//必须为正整数
                placement:"right",
                trigger:"manual"
            });
             var result=  showWrongResult(inputObj);
             $("span.spinner > div").css("left", 375);
             return result;
	    }
	    
		if (inputObj.val() > 1024) {
			inputObj.tooltip({
				   title:$('#maxNumber1024').val(),//闀垮害涓嶇
				   placement:"right",
				   trigger:"manual"
			   });
			var result=  showWrongResult(inputObj);
			$("span.spinner > div").css("left", 375);
			return result;
		} else if (inputObj.val() < 1) {
			inputObj.tooltip({
				   title:$('#minNumber1').val(),//闀垮害涓嶇
				   placement:"right",
				   trigger:"manual"
			   });
			var result = showWrongResult(inputObj);
			$("span.spinner > div").css("left", 375);
			return result;
		} else {
			return showRightResult(inputObj);
		}
		
	} 
	checkItemNull(inputObj);
	if(inputObj.val() == ""){
		$("span.spinner > div").css("left", 375);
	}
}
function regexName(name){
	var partten = /^[\A-Za-z0-9\-\_\.\u4E00-\u9FA5\uF900-\uFA2D]*$/;
	name.tooltip('destroy');
	if(name.val()){
		if(partten.test(name.val())){
			if(name.val().substring(0,1)=="-"||name.val().substring(0,1)=="."){
				name.tooltip({
					   title:$('#nameNoChRangeNew').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}else{
				return showRightResult(name);
			}
			
		}else{
			name.tooltip({
				   title:$('#nameNoChRangeNew').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(name);
		}
	}
}
function regexNameIsAllNum(name){
	var partten= /^\d+$/;;
	name.tooltip('destroy');
	if(name.val()){
		if(partten.test(name.val())){
			name.tooltip({
				   title:$('#nameIsNumber').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(name);
			
		}else{
			return showRightResult(name);
		}
	}
}
function checkNameLen(obj){
	obj.tooltip('destroy');
	var titleContent = $('#maxLength').val();
	 if(obj.val()&&obj.val().length>64){
		 
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
	if($.trim(obj.val())==""){
		obj.tooltip({
		   title:$('#nullTip').val(),
		   placement:"right",
		   trigger:"manual"
	   });
	   return showWrongResult(obj);
	} else {
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