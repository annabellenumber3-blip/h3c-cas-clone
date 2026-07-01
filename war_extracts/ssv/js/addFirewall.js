/**
 * 云主机防火墙窗口
 */

//关闭防火墙窗口
function closeFirewall() {
	$("#cloudSafetyOverlay").hide();
}
function refreshFwStrategyList() {
	$("#firewallListId").datagrid('reload');
}
//新建\修改防火墙
function submitFwStrategy() {
	//判断是否为修改状态
	var isModify = $('#title').is(':hidden');
	var firewallId = $("#fwStrategyId").val();
	var name = $("#fwStrategyNameId").val();
	var desc = $("#fwStrategyDescId").val();
	var userId = $("#fwStrategyUserId").val();
	var vmNames = $("#fwStrategyHostName").val();
	var flag = false;
	var obj1 = $("#fwStrategyDescId, #fwStrategyNameId");
	if (isModify) {
		//修改状态下，name不可变，无需再次校验
		obj1 = $("#fwStrategyDescId");
	}
	obj1.keyup();
	flag=obj1.hasClass("wrong-border");
	if (flag) {
		return;
	}
	var url ="servlet/firewallServlet?way=applyFwStrategy";
	//策略模板  
	var xml = '';
	xml += '<rsFirewall>';
	xml += '<name>'+name+'</name>';
	xml += '<description>'+desc+'</description>';
	xml += '</rsFirewall>'; 
	if (isModify) {
		url = "servlet/firewallServlet?way=modifyFwStrategy";
		xml = '';
		xml += '<rsFirewall>';
		xml += '<id>'+firewallId+'</id>';
		xml += '<name>'+name+'</name>';
		xml += '<description>'+desc+'</description>';
		xml += '<userId>'+userId+'</userId>';
		xml += '<vmNames>'+vmNames+'</vmNames>';
		xml += '</rsFirewall>';
	}
	$.ajax({
		type : "POST",
		dataType : "json",
		async: false,
		url : url,
		data : "xml=" + encodeURIComponent(encodeURIComponent(xml)),
		beforeSend : function(xhr) {
			 showWait();
		},
		success : function(result) {
			 hideWait();
			$("#cloudSafetyOverlay").hide();
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
				refreshFwStrategyList();
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			 hideWait();
		}
	});

}


function checkTitle(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark&&inputId=="fwStrategyNameId"){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="fwStrategyNameId"){
   		 mark= checkNameLen(inputObj);
   	 }
	 if(mark&&inputId=="fwStrategyNameId"){
   		 mark= regexName(inputObj);
   		 if(mark){
			 mark= regexNameIsAllNum(inputObj);
		 }
   	 }
	 if (mark&&inputId=="fwStrategyNameId") {
		 mark = checkStrategyReName(inputObj);
	 }
	 if(mark&&inputId=="fwStrategyDescId"){
		 mark = checkContentReg(inputObj);
		 if (mark) {
   		     mark= checkContentLen(inputObj);
		 }
   	 }
	 return mark;
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



function checkStrategyReName(obj){
	obj.tooltip('destroy');
	if(!obj.hasClass("wrong-border")&&$.trim(obj.val())!=""){
		$.ajax({
			type : "GET",
			dataType : "json",
			async:false,
			url : "servlet/firewallServlet?way=checkStrategyReName",
			data:"strategyName="+obj.val(),
			success : function(result) {
				if (result != null && typeof result != 'undefined' && result !="") {
					var strategyName = $("#fwStrategyNameId");
					if(result == "true"){
						strategyName.tooltip({
							   title:$('#strategyexists').val(),
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
	var partten = /^[\A-Za-z0-9\-\_\.]*$/;
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
	var titleContent = $('#maxLength64').val();
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
