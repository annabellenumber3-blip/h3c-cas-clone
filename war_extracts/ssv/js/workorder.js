/**
 * 
 */
//打开申请云硬盘
function newWorkOrder() {
	$("#windowOverId").load("page/widget/applyWorkOrder.jsp",function(){
		$("#windowOverId").show();
		$("#titleInputId").focus();
	});
}

function closeWorkOrder() {
	$("#windowOverId").html("");
	$("#windowOverId").hide();
}
function submitApply() {
	var flag = false;
	var obj1=$("#titleInputId, #contentId");
	obj1.keyup();
	flag=obj1.hasClass("wrong-border");
	if (flag) {
		return;
	}
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "servlet/workOrderServlet?way=apply",
		data:"title="+ encodeURIComponent(encodeURIComponent($("#titleInputId").val())) + "&content=" + encodeURIComponent(encodeURIComponent($("#contentId").val())),
		beforeSend : function(xhr) {
			// showWait();
		},
		success : function(result) {
			// hideWait();
			if (result != null && typeof result != 'undefined') {
				if (typeof result == 'object') {
					if (result.success) {
						$("#list").datagrid('reload'); 
						$("#delTickets").addClass("btn-forbidden");
						$.messager.show({
							title : result.title,
							msg : result.message,
							showType : 'show'
						});
						closeWorkOrder();
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

function stopWorkOrder(type){
	
	var row = $('#list').datagrid('getSelected');
	
	var index;
	if (row != null && row != '') {
		index = row.id;
	}
  	if (index == null || index <= 0) {
  		return;
  	}
  	$.messager.confirm($("#hidden-deleteWorkOrder").val(), $("#hidden-confirmWorkOrder").val(), 
			function(r){            
		       if (r){  
				$.ajax({
					   type: "GET",
					   dataType:"json",
					   url: "servlet/workOrderServlet?way="+type,
					   data:"id="+index,
					   beforeSend:function(xhr){
						  //showWait();
					   },
					   success: function(result){
						   //hideWait();
						   if (result != null && typeof result != 'undefined') {
							   if (result.success) {
						    		$("#list").datagrid('reload');
						    		$("#delTickets").addClass("btn-forbidden");
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
						  //hideWait();
					   }
			    });
		     }
  	});
}
function addUl(a){
	$(a).css("text-decoration", "underline").css("color","#3397D3");
}
function removeUl(a){
	$(a).css("text-decoration", "underline").css("color","#000000");
}
function checkTitle(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="titleInputId"){
		 mark = checkReg(inputObj);
		 if (mark) {
			 mark= checkNameLen(inputObj);
		 }
   	 }
	 if(mark&&inputId=="contentId"){
		 mark = checkReg(inputObj);
		 if (mark) {
			 mark= checkContentLen(inputObj);
		 }
   	 }
	 return mark;
}

function checkReg(obj){
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

function checkContentLen(obj){
	obj.tooltip('destroy');
	var titleContent = $('#maxLength140').val();
	 if(obj.val()&&obj.val().length>140){
		 
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
	var titleContent = $('#maxLength20').val();
	 if(obj.val()&&obj.val().length>20){
		 
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