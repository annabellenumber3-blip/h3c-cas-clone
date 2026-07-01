/**
 * 涓汉璁剧疆
 */
//鍒濆鍖栦釜浜鸿缃殑涓汉淇℃伅椤甸潰
function initUser(){
	$.ajax({
	    cache:false,//解决ie11中的缓存问题
		type : "GET",
		dataType : "json",
		url : "login?way=getUser",
		beforeSend : function(xhr) {
			// showWait();
		},
		success : function(result) {
			if (result != null && typeof result != 'undefined') {
				if (result instanceof Array) {
					var baseInfo = result[0];
					$("#loginNameId").val(baseInfo.loginName);
					$("#userNameId").val(baseInfo.userName);
					$("#emailId").val(baseInfo.email);
					$("#deptId").val(baseInfo.dept);
					$("#positionId").val(baseInfo.position);
					$("#phoneId").val(baseInfo.phone);
					$("#certificateNumId").val(baseInfo.certification);
					$("#addressId").val(baseInfo.address);
					$("#image").attr("src",baseInfo.imageUrl);
					$("#imageUrl").val(baseInfo.imageUrl);
	                if (result.length == 2) {
	                	var userSetting = result[1];
	                	if ($("#monitorSelectId").val() == 1 ) {
	                		if (typeof userSetting.cpuMaxrate != 'undefined') {
	                    		$("#moreRateInputId").numberspinner('setValue', userSetting.cpuMaxrate);
	                    	}
	                    	//$("#moreRateInput").val(userSetting.cpuMaxrate);
	                    	$("#lastTimeInputId").val(userSetting.cpuDuration);
	                    	$("#checkIntervalInputId").val(userSetting.cpuCheckInterval);
	                    	var noticeType = userSetting.noticeType;
	                    	if (typeof noticeType != 'undefined') {
	                    		var isInterface = noticeType.substr(0, 1);
	                    		var isMail = noticeType.substr(1, 1);
	                    		var isMessage = noticeType.substr(2, 1);
	                    		
	                    		if (isInterface == 1) {
	                    			$("#pageChk").attr("checked", "checked");
	                    		}
	                    		if (isMail == 1) {
	                    			$("#emailChk").attr("checked", "checked");
	                    		}
	                    		if (isMessage == 1) {
	                    			$("#messageChk").attr("checked", "checked");
	                    		}
	                    	}
	                	}
	                	$("#timeoutInputId").val(userSetting.timeout);
					} 
	                if (baseInfo.authType != null && baseInfo.authType == 0) {
	                	$(".toggle-radio").bind("click", function() {
		    				var toggle = $(this).parents(".toggle");
		    				toggle.toggleClass("toggle-off");
		    				var chd = $("#editpwdId").attr("checked");
		    				if (chd == "checked") {
		    					$("#editpwdId").removeAttr("checked");
		    					$("#oldpwdDiv, #newpwdDiv, #confirmpwdDiv").hide();
		    					$("#oldpwdId, #newpwdId, #confirmPwdId").val("");
		    					//淇敼闂鍗�01407250115 鎻愮ず妗嗛敊浣�
		    					showRightResult($("#oldpwdId"));
		    					showRightResult($("#newpwdId"));
		    					showRightResult($("#confirmPwdId"));
		    					adjustTooltip();
		    				} else if(typeof chd  == "undefined") {
		    					$("#editpwdId").attr("checked","checked");
		    					$("#oldpwdDiv, #newpwdDiv, #confirmpwdDiv").show();
		    					//鎻愮ず妗嗚皟鏁�
		    					adjustTooltip();
		    				}
		    			});
	                }
				} else {
					$.messager.show({
						title : result.title,
						msg : result.message,
						showType : 'show'
					});
				}
			}
			// hideWait();
		},
		error : function(xhr, textStatus, errorThrown) {
			// hideWait();
		}
	});
}
function adjustTooltip(){
	$("#loginNameId,#userNameId, #emailId, #deptId, #positionId, #phoneId, #certificateNumId,#addressId").keyup();
}
//鏇存敼TAB鏇存崲鏂瑰紡鍙婃牱寮�
function initTabChange() {
	$(".tab-item").bind("click",changeTab);
	$("#personInfoId").show();
	$("#alarmSettingId").hide();
	$("#otherSetId").hide();
}


function changeTab(){
	$(".tab-item").removeClass("current");
	$(this).addClass("current");
	var index = $(this).index(".tab-item");
	initUser();//切换tab刷新信息
	if (index == 0) {
		$("#personInfoId").show();
		$("#alarmSettingId").hide();
		$("#otherSetId").hide();
	} else if (index ==  1) {
		$("#personInfoId").hide();
		$("#alarmSettingId").hide();
		$("#otherSetId").show();
	}
};
//function changeTab(){
//	$(".tab-item").removeClass("current");
//	$(this).addClass("current");
//	var index = $(this).index(".tab-item");
//	if (index == 0) {
//		$("#personInfoId").show();
//		$("#alarmSettingId").hide();
//		$("#otherSetId").hide();
//	} else if (index ==  1) {
//		$("#personInfoId").hide();
//		$("#alarmSettingId").show();
//		$("#otherSetId").hide();
//	} else if (index == 2) {
//		$("#personInfoId").hide();
//		$("#alarmSettingId").hide();
//		$("#otherSetId").show();
//	}
//};

//鐐瑰嚮淇敼瀵嗙爜澶嶉�妗�
function checkPwd(obj) {
	if($(obj).attr("checked") == "checked") {
		$("#oldpwdDiv, #newpwdDiv, #confirmpwdDiv").show();
	} else {
		$("#oldpwdDiv, #newpwdDiv, #confirmpwdDiv").hide();
		$("#oldpwdId, #newpwdId, #confirmPwdId").val("");
	}
}

//閲嶇疆
function resetPerson() {
	$("#userNameId, #oldpwdId, #newpwdId, #confirmPwdId,#emailId, #deptId, #positionId, #phoneId, #certificateNumId, #addressId").val("");
}

function checkPassword(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="confirmPwdId"){
   		 mark= checkConfirm(inputObj);
   	 }
	 if (mark&&inputId=="oldpwdId") {
		 mark=checkRight(inputObj); 
	 }
	 
	 if($("#editpwdId").attr("checked")=="checked"){
		 if(mark&&(inputId=="newpwdId"||inputId=="confirmPwdId")){
			 mark = checkLen32(inputObj);
		 }
		 if(mark&&inputId=="newpwdId"){
			 mark = checkSame(inputObj);
		 }
	 }
	 return mark;
}

function checkSame(obj){
	obj.tooltip('destroy');
	if(obj.val()==$("#oldpwdId").val()){
		obj.tooltip({
		   title:$('#passwordNotSame').val(),//鏃у瘑鐮佷笉瀵�
		   placement:"right",
		   trigger:"manual"
	   });
	   return showWrongResult(obj);
	}else{
		return showRightResult(obj);
	}
}

function checkRight(obj){
	var oldpwdId = $("#oldpwdId");
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "login?way=isOldPassword",
		data:"password="+encodeURIComponent(oldpwdId.val()),
		success : function(result) {
				obj.tooltip('destroy');
				if (result != null && typeof result != 'undefined' && result !="") {
					if (result == "false") {
						obj.tooltip({
							   title:$('#passwordNotRight').val(),//鏃у瘑鐮佷笉瀵�
							   placement:"right",
							   trigger:"manual"
						});
						return showWrongResult(obj);
					} else {
						return showRightResult(obj);
					}
				}
		},
		error : function(xhr, textStatus, errorThrown) {
			// hideWait();
		}
	});
}

function checkItemNull(obj){
	obj.tooltip('destroy');
	if(obj.attr("id")=="capacityMoreInputId"||obj.attr("id")=="moreRateInputId")
	{
		var spinner=obj.parents("span.spinner");
		spinner.tooltip('destroy');
		if($.trim(obj.val())==""){
			spinner.tooltip({
			   title:$('#nullTip').val(),
			   placement:"right",
			   trigger:"manual"
		   });
		   return showWrongResult(spinner);
		}else{
			return showRightResult(spinner);
		}
	}else{
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
	 
}

function checkConfirm(obj){
		obj.tooltip('destroy');
	if(obj.val()!=$("#newpwdId").val()){
		obj.tooltip({
		   title:$('#confirmNotRight').val(),//瀵嗙爜涓嶄竴鑷�
		   placement:"right",
		   trigger:"manual"
	   });
	   return showWrongResult(obj);
	}else{
		return showRightResult(obj);
	}
}
	function regexCard(obj){
		var partten = /^[\w\-\.]+$/;
		obj.tooltip('destroy');
		if(obj.val()){
			if(partten.test(obj.val())){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#cardNotRight').val(),//璇佷欢鍙蜂负瀛楁瘝銆佹暟瀛椼�涓嬪垝绾�
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
	function regexNum(obj){
		var partten = /^[1-9]\d*$/;
		obj.tooltip('destroy');
		if(obj.val()){
			if(partten.test(obj.val())){
					return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#notIsPositivNum').val(),//涓嶄负鏁板瓧
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
  	function regexPhone(obj){
		var phone = obj.val();
		obj.tooltip('destroy');
		if(obj.val()){
			if((phone.length == 11 && /^(1\d{10})$/.test(phone)) || /^(0\d{2,3}-)?(\d{7,8})(-\d{3,})?$/.test(phone) || /^(\d{3,5})$/.test(phone)){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#telNotRight').val(),//鍙风爜鏍煎紡涓嶅
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
  	function regexEmail(obj){
		var partten = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
		obj.tooltip('destroy');
		if(obj.val()){
			if(partten.test(obj.val())){
				
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#emailFormatNot').val(),//閭欢鏍煎紡涓嶇
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
  	function checkLength(obj){
		obj.tooltip('destroy');
		if(obj.val()){
			if(obj.val().length < 5){
				return showRightResult(obj);
			}else{
				obj.tooltip({
					   title:$('#lengthNotRight').val(),//闀垮害涓嶇
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(obj);
			}
		}
	}
function checkAllInfo(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark&&inputId!="certificateNumId"&&inputId!="phoneId"&&inputId!="positionId"&&inputId!="addressId"&&inputId!="deptId"){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark&&inputId=="emailId"){
   		 mark= regexEmail(inputObj);
   		 if(mark){
			 mark = checkLen128(inputObj);
		 }
   	 }
	 if(mark&&inputId=="certificateNumId"){
		 showRightResult(inputObj);
   		 mark= regexCard(inputObj);
   		 if(mark){
			 mark = checkLen32(inputObj);
		 }
   	 }
	 if(mark&&inputId=="phoneId"){
		 showRightResult(inputObj);
   		 mark= regexPhone(inputObj);
   		 if(mark){
			 mark = checkLen32(inputObj);
		 }
   	 }
	
	 if(mark&&inputId=="userNameId"){
		 showRightResult(inputObj);
		 mark = checkLen128(inputObj);
	 }
	 if(mark&&(inputId=="addressId"||inputId=="deptId"||inputId=="positionId")){
		 mark = checkXMLReg(inputObj);
		 if (mark) {
			 mark = checkLen64(inputObj);
		 }
		 
	 }
	 return mark;
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
		} else{
		   return showRightResult(obj);
		}
}
function checkLen32(obj){
		obj.tooltip('destroy');
		var len32 = $('#maxLength32').val();
		 if(obj.val()&&obj.val().length>32){			 
			 obj.tooltip({
				   title:len32,
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(obj);
			}else{
				return showRightResult(obj);
			}
	}
	function checkLen64(obj){
		obj.tooltip('destroy');
		var len64 = $('#maxLength64').val();
		 if(obj.val()&&obj.val().length>64){			 
			 obj.tooltip({
				   title:len64,
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(obj);
			}else{
				return showRightResult(obj);
			}
	}
function checkLen128(obj){
		obj.tooltip('destroy');
		var len128 = $('#maxLength128').val();
		 if(obj.val()&&obj.val().length>128){			 
			 obj.tooltip({
				   title:len128,
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(obj);
			}else{
				return showRightResult(obj);
			}
	}
function initUpload() {
	var btnUpload=$('#upload');
	new AjaxUpload(btnUpload, {
		action: 'servlet/uploadServlet?imageUrl='+$("#imageUrl").val(),
		name: 'uploadfile',
		onSubmit: function(file, ext){
			 if (! (ext && /^(jpg|png|jpeg|gif|bmp)$/.test(ext))){ 
                // extension is not allowed 
				return false;
			}
			//status.text('Uploading...');
		},
		onComplete: function(file, response){
			var url = "icons/portrait.png";
			try {
				url = $(response).html();
			} catch(e) {
				url = response;
			}
			//On completion clear the status
			$("#image").attr("src",url);
			$("#personImg").attr("src",url);
		}
	});
}

//淇濆瓨鐢ㄦ埛璁剧疆
function saveUserSetting() {
	var flag = false;
	var selectedMonitor = $("#monitorSelectId").val();
	if (selectedMonitor != null && selectedMonitor <= 2) {
		var obj2=$("#moreRateInputId, #lastTimeInputId, #checkIntervalInputId,.spinner");
		obj2.keyup();
		flag=obj2.hasClass("wrong-border");

	} else if (selectedMonitor == 3) {
		// 纾佺洏
		var obj2=$("#capacityMoreInputId,.spinner");
		obj2.keyup();
		flag=obj2.hasClass("wrong-border");
		
	}
	if (!$("#pageChk").is(":checked") && !$("#emailChk").is(":checked") && !$("#messageChk").is(":checked")) {
		$("#pageChk").parents(".item").find(".control-label").addClass("wrong-word-color");
		$("#messageChkSpan").tooltip('show');
		flag = flag||true;
	}else {
		$("#pageChk").parents(".item").find(".control-label").removeClass("wrong-word-color");
		$("#messageChkSpan").tooltip('hide');
		flag = flag||false;
	}
	if (flag) {
		return;
	}
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "login?way=saveUserSetting",
		data:$("#alarmFormId").serialize(),
		beforeSend : function(xhr) {
			// showWait();
		},
		success : function(result) {
			// hideWait();
			if (result != null && typeof result != 'undefined') {
				if (typeof result == 'object') {
					if (result.success) {
						$.messager.show({
							title : result.title,
							msg : result.message,
							showType : 'show'
						});
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
function checkSetting(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	var mark = true;
	 if(mark){
   		 mark=checkItemNull(inputObj);
   	 }
	 if(mark){
   		 mark= regexNum(inputObj);
   	 }
	 if(mark){
		 mark = checkLength(inputObj);
	 }
	 return mark;
}


//鏀瑰彉鐩戞帶鎸囨爣
function changeMoinitor(select) {
	if ($(select).val()==1) {
		$("#moreRateDiv, #lastTimeDiv, #checkIntervalDiv").show();
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "login?way=getUserSetting",
			beforeSend : function(xhr) {
				// showWait();
			},
			success : function(result) {
					$("#capacityMoreDiv").hide();
					if (typeof result != "undefined") {
						$("#moreRateInputId").numberspinner('setValue', result.cpuMaxrate);
						$("#lastTimeInputId").val(result.cpuDuration);
						$("#checkIntervalInputId").val(result.cpuCheckInterval);
						var noticeType = result.noticeType;
	                	if (typeof noticeType != 'undefined') {
	                		var isInterface = noticeType.substr(0, 1);
	                		var isMail = noticeType.substr(1, 1);
	                		var isMessage = noticeType.substr(2, 1);
	                		
	                		if (isInterface == 1) {
	                			$("#pageChk").attr("checked", "checked");
	                		}
	                		if (isMail == 1) {
	                			$("#emailChk").attr("checked", "checked");
	                		}
	                		if (isMessage == 1) {
	                			$("#messageChk").attr("checked", "checked");
	                		}
	                	}
					}
					// hideWait();
					showRightResult($("#moreRateInputId, #lastTimeInputId, #checkIntervalInputId,.spinner "));
			},
			error : function(xhr, textStatus, errorThrown) {
				// hideWait();
			}
		});
		
	} else if ($(select).val()==2) {
		$("#moreRateDiv, #lastTimeDiv, #checkIntervalDiv").show();
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "login?way=getUserSetting",
			beforeSend : function(xhr) {
				// showWait();
			},
			success : function(result) {
				$("#capacityMoreDiv").hide();
				if (typeof result != "undefined") {
					$("#moreRateInputId").numberspinner('setValue', result.memoryMaxrate);
					$("#lastTimeInputId").val(result.memoryDuration);
					$("#checkIntervalInputId").val(result.memoryCheckInterval);
					
					var noticeType = result.noticeType;
                	if (typeof noticeType != 'undefined') {
                		var isInterface = noticeType.substr(0, 1);
                		var isMail = noticeType.substr(1, 1);
                		var isMessage = noticeType.substr(2, 1);
                		
                		if (isInterface == 1) {
                			$("#pageChk").attr("checked", "checked");
                		}
                		if (isMail == 1) {
                			$("#emailChk").attr("checked", "checked");
                		}
                		if (isMessage == 1) {
                			$("#messageChk").attr("checked", "checked");
                		}
                	}
				}
				// hideWait();
				showRightResult($("#moreRateInputId, #lastTimeInputId, #checkIntervalInputId,.spinner "));
			},
			error : function(xhr, textStatus, errorThrown) {
				// hideWait();
			}
		});
		
	} else if ($(select).val()==3) {
		$("#moreRateDiv, #lastTimeDiv, #checkIntervalDiv").hide();
		$("#capacityMoreDiv").show();
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "login?way=getUserSetting",
			beforeSend : function(xhr) {
				// showWait();
			},
			success : function(result) {
				if (typeof result != "undefined") {
					$("#capacityMoreInputId").numberspinner('setValue', result.diskMaxRate);
					var noticeType = result.noticeType;
                	if (typeof noticeType != 'undefined') {
                		var isInterface = noticeType.substr(0, 1);
                		var isMail = noticeType.substr(1, 1);
                		var isMessage = noticeType.substr(2, 1);
                		
                		if (isInterface == 1) {
                			$("#pageChk").attr("checked", "checked");
                		}
                		if (isMail == 1) {
                			$("#emailChk").attr("checked", "checked");
                		}
                		if (isMessage == 1) {
                			$("#messageChk").attr("checked", "checked");
                		}
                	}
				}
				// hideWait();
				showRightResult($("#capacityMoreInputId,.spinner"));
			},
			error : function(xhr, textStatus, errorThrown) {
				// hideWait();
			}
		});
	}
}
//閲嶇疆鐢ㄦ埛璁剧疆
function resetUserSetting() {
	
}

//閲嶇疆鐢ㄦ埛鍛婅璁剧疆
function resetUserSetting() {
	$("#moreRateInput, #lastTimeInput, #checkIntervalInput, #capacityMoreInput").val("");
	$("#pageChk, #emailChk, #messageChk").removeAttr("checked");
}

//閲嶇疆鐢ㄦ埛鍏朵粬璁剧疆
function resetOtherUserSetting() {
	$("#timeoutInputId").val("10");
	$("#timeoutInputId").trigger("keyup");
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

