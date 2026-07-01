


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
//		 if(mark){
//			 mark= regexNameIsAllNum(inputObj);
//		 }
		 }
	 if(mark){
   		 mark= checkNameLen(inputObj);
   	 }

	 if (mark) {
		 mark = checkStrategyReName(inputObj,$("#typeInputId").val());
	 }

}

function checkDescVal(){
	var desc = $("#descId");
	var mark = true;
   	 if(mark){
   		 mark=checkXMLReg(desc);
   	 }
   	 if(mark){
   		 mark= checkMaxLength(desc);
   	 }
	return mark;
}

function checkMaxLength(hasMaxLength){
	hasMaxLength.tooltip('destroy');
	var max=hasMaxLength.attr("data-fieldLen");
	var titleContent = $('#maxLength120').val();
	if(hasMaxLength.val()&&hasMaxLength.val().length>max){
		
		hasMaxLength.tooltip({
			title:titleContent,
			placement:"right",
			trigger:"manual"
		});
		return showWrongResult(hasMaxLength);
	}else{
		return showRightResult(hasMaxLength);
	}
}

function checkXMLReg(obj){
	obj.tooltip('destroy');
	var titleContent = $('#notSpecialCharacter').val();
	 if(obj.val().indexOf('<') > -1 || obj.val().indexOf('>') > -1||obj.val().indexOf('&') > -1){
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

function checkDayVal(obj) {
	
    var mounthSelected = [];
    $("div.scheduler-days.monthly a.scheduler-day.selected").each(function(index, data) {
        mounthSelected.push($(data).attr("data-value"));
    });
	
    var weekSelected = [];
    $("div.scheduler-days.weekly a.scheduler-day.selected").each(function(index, data) {
    	weekSelected.push($(data).attr("data-value"));
    });
    var frequency = $("#resultSelect").val();
    if ((frequency == 1 && weekSelected == "")) {
    	$("#dayofweek").tooltip({
			   title:$('#effectTimeIsNeed').val(),
			   placement:"right",
			   trigger:"manual"
		});
	    showWrongResult($("#dayofweek"));
    } else {
    	showRightResult($("#dayofweek"));
    }
    
    if ((frequency == 0 && mounthSelected == "")) {
    	$("#dayofmonth").tooltip({
			   title:$('#effectTimeIsNeed').val(),
			   placement:"right",
			   trigger:"manual"
		});
	    showWrongResult($("#dayofmonth"));
    } else {
    	showRightResult($("#dayofmonth"));
    }

}

function checkNumber(e) {
	var inputId = e.target.id;
	var inputObj = $("#" + inputId);
	if (inputObj.val() != '') {
		if (inputObj.val() > 23) {
			inputObj.val(23);
			inputObj.numberspinner('setValue', 23);
		} else if (inputObj.val() < 0) {
			inputObj.val(0);
			inputObj.numberspinner('setValue', 0);
		} 
		
	} 
	checkItemNull(inputObj);
	if(inputObj.val() == ""){
		$("span.spinner > div").css("left", 190);
	}
}

function checkKeepNumber(e) {
	var inputId = e.target.id;
	var inputObj = $("#" + inputId);
	if (inputObj.val() != '') {
		if (inputObj.val() > 30) {
			inputObj.val(30);
			inputObj.numberspinner('setValue', 30);
		} else if (inputObj.val() <= 0) {
			inputObj.val(1);
			inputObj.numberspinner('setValue', 1);
		} 
		
	} 
//	checkItemNull(inputObj);
//	if(inputObj.val() == ""){
//		$("span.spinner > div").css("left", 375);
//	}
}

function regexName(name){
	var partten = /^[\A-Za-z0-9\u4E00-\u9FA5\uF900-\uFA2D\-\_\.\s]*$/;
	var trimRegExp=/\S/;
	name.tooltip('destroy');
	if(name.val()){
		if(partten.test(name.val())){
			if(!trimRegExp.test(name.val())){
				name.tooltip({
					   title:$('#strategynameNoChRange').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}else{
				return showRightResult(name);
			}
			
		}else{
			name.tooltip({
				   title:$('#strategynameNoChRange').val(),
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
	 if(obj.val() && obj.val().length > 32){
		 
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
	} else {
	   return showRightResult(obj);
	}
}

function checkStrategyReName(obj,type){
	obj.tooltip('destroy');
	if(!obj.hasClass("wrong-border")&&$.trim(obj.val())!=""){
		$.ajax({
			type : "GET",
			dataType : "json",
			async:false,
			url : "servlet/backupServlet?way=checkStrategyReName",
			data:"strategyName="+$.trim(obj.val())+"&id="+type,
			success : function(result) {
				if (result != null && typeof result != 'undefined' && result !="") {
					var strategyName = $("#nameInputId");
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

//下一步按钮
function nextPage(){
    
    var flag = false;
    var obj1=$("#nameInputId,.spinner");
    obj1.keyup();
    flag=obj1.hasClass("wrong-border");
    if (flag) {
        return;
    }
    if ($("#nameInputId").hasClass("wrong-border")) {
        return;
    }
    if ($("#descId").hasClass("wrong-border")) {
        return;
    }
    
    if ($("#keepNumberInputId").hasClass("wrong-border")) {
        return;
    }
    //修改问题单201505220193 时间报错无法点击下一步   add by h10630 2015.5.27
    var obj2=$("#timeInputId");
    obj2.keyup();
    if ($("#timeInputId").hasClass("wrong-border")) {
        return;
    }
    if ($("#dayofmonth").hasClass("wrong-border")) {
        return;
    }
    if ($("#dayofweek").hasClass("wrong-border")) {
    	return;
    }

    $("#modal").height(500);
    $(".step-basicinfo").hide();
    $(".step-vminfo").show();
    initVmList();
}

//上一步按钮
function previousPage(){
	$(".step-basicinfo").show();
	$(".step-vminfo").hide();
	var selectFlag = $("#resultSelect").val();
	if (selectFlag == 2) {
		$("#modal").height(450);
	} else if (selectFlag == 1) {
		$("#modal").height(500);
	} else {
		$("#modal").height(615);
	}
	
}

function selectDate(obj){
	$("#dayofweek").removeClass("wrong-border");
	$("#dayofweek").tooltip('destroy');
	$("#dayofmonth").removeClass("wrong-border");
	$("#dayofmonth").tooltip('destroy');
	var selectFlag = $(obj).val();
	if (selectFlag == 2) { //day
		$("#modal").height(450);
		$("div.scheduler-days").hide();
		$("#dateInfo").hide();
	} else if (selectFlag == 1) { //week
		$("#modal").height(500);
		$("div.scheduler-days").show();
		$("div.scheduler-days.monthly").hide();
		$("div.scheduler-days.weekly").show();
		$("#dateInfo").show();
	} else {   //month
		$("#modal").height(615);
		$("div.scheduler-days").show();
		$("div.scheduler-days.monthly").show();
		$("div.scheduler-days.weekly").hide();
		$("#dateInfo").show();
	}
	checkItemNull($("#timeInputId"));
	if($("#timeInputId").val() == ""){
		$("span.spinner > div").css("left", 375);
	}
}

/**
 * 修改策略时选中策略绑定的虚拟机
 */
function getVmSelected() {
	var vmIdStr = $("#vmIdList").val();
	if (vmIdArr != "") {
		var vmIdArr = vmIdStr.split(",");
		for (var i = 0; i < vmIdArr.length; i++) {
			$("#my-instances").datagrid('selectRecord',vmIdArr[i]);
		}
	}

}

function closeApplyStrategy() {
	$("#windowOverId").html("");
	$("#windowOverId").hide();
}

//防止ctrl + 左键时多生成一个网页
function timeClick() {
	return true;
}