/**
 * 云主机防火墙规则窗口
 */

//关闭防火墙窗口
function closeFirewallRule() {
	$("#cloudSafetyOverlay").hide();
}

function refreshAclList() {
	$("#aclInRuleId").datagrid('reload');
	$("#aclOutRuleId").datagrid('reload');
}

//新建防火墙规则
function submitFwStrategyRule() {
	var firewallRuleId = $("#firewallRuleId").val();
	var direction = $('#aclRuleDirectionId').val();
	var action = $('#aclRuleActionId').val();
	var protocol = $('#aclRuleProtocolId').val();
	var aclRuleSrcIp = $('#aclRuleSrcIpId').val();
	var aclRuleSrcMask = $('#aclRuleSrcMaskId').val();
	var aclRuleSrcPortNum = $('#aclRuleSrcPortNum').val();
	var aclRuleDestIp = $('#aclRuleDestIpId').val();
	var aclRuleDestMask = $('#aclRuleDestMaskId').val();
	var aclRuleDestPortNum = $('#aclRuleDestPortNum').val();
	var firewallId = $('#firewallId').val();
	var priority =  $('#priorityNum').val();
	var operType = $('#operType').val();
	var flag = false;
	var obj1=$("#aclRuleSrcIpId, #aclRuleSrcMaskId, #aclRuleDestIpId, #aclRuleDestMaskId");
	obj1.keyup();
	flag=obj1.hasClass("wrong-border");
	if (flag) {
		return;
	}
	
	if (aclRuleSrcIp != "" && aclRuleSrcMask == "") {
		$.messager.alert($("#tips").val(), $("#srcMackIsNeeded").val(), 'error');
		return;
	}
	
	if (aclRuleSrcIp == "" && aclRuleSrcMask != "") {
		$.messager.alert($("#tips").val(), $("#srcIpIsNeeded").val(), 'error');
		return;
	}
	
	if (aclRuleDestIp !="" && aclRuleDestMask == "") {
		$.messager.alert($("#tips").val(), $("#destMackIsNeeded").val(), 'error');
		return;
	}
	
	if (aclRuleDestIp !="" && aclRuleDestMask == "") {
		$.messager.alert($("#tips").val(), $("#destIpIsNeeded").val(), 'error');
		return;
	}
	var rule = {};
	rule.firewallId = firewallId;
	if (aclRuleSrcIp != "") {
		rule.srcIp = aclRuleSrcIp;
	}
	if (aclRuleSrcMask != "") {
		rule.srcMask = aclRuleSrcMask;
	}
	if (aclRuleDestIp != "") {
		rule.destIp = aclRuleDestIp;
	}
	if (aclRuleDestMask != "") {
		rule.destMask = aclRuleDestMask;
	}
	if (aclRuleSrcPortNum != "") {
		rule.srcPort = aclRuleSrcPortNum;
	}
	if (aclRuleDestPortNum != "") {
		rule.destPort = aclRuleDestPortNum;
	}
	rule.protocol = protocol;
	rule.action = action;
	rule.priority = priority;
	rule.direction = direction;
	rule.firewallRuleId = firewallRuleId;
	//检查规则是否重复，
	var ruleCheck = checkRule(rule, operType);
	if (ruleCheck == 1) {
		$.messager.alert($("#tips").val(), $("#ruleExists").val(), 'error');
		return;
	}
	//优先级是否存在
	if (ruleCheck == 2) {
		$.messager.alert($("#tips").val(), $("#rulePriorityExists").val(), 'error');
		return;
	}
	
	
	var url ="servlet/firewallServlet?way=applyAclRule";
	//策略模板  
	var xml = '';
	xml += '<rsFirewallRule>';
	if (firewallRuleId) {
		xml += '<id>'+firewallRuleId+'</id>';
	}
	if (aclRuleSrcIp) {
		xml += '<srcIp>'+aclRuleSrcIp+'</srcIp>';
		xml += '<srcMask>'+aclRuleSrcMask+'</srcMask>';
	}
	if (aclRuleDestIp) {
		xml += '<destIp>'+aclRuleDestIp+'</destIp>';
		xml += '<destMask>'+aclRuleDestMask+'</destMask>';
	}
	if (aclRuleSrcPortNum) {
		xml += '<srcPort>'+aclRuleSrcPortNum+'</srcPort>';
	}
	if (aclRuleDestPortNum) {
		xml += '<destPort>'+aclRuleDestPortNum+'</destPort>';
	}
	xml += '<firewallId>'+firewallId+'</firewallId>';
	xml += '<protocol>'+protocol+'</protocol>';
	xml += '<action>'+action+'</action>';
	xml += '<priority>'+priority+'</priority>';
	xml += '<direction>'+direction+'</direction>';
	xml += '</rsFirewallRule>';
	
	var isModify = $('#title').is(':hidden'); 
	if (isModify) {
		url ="servlet/firewallServlet?way=modifyAclRule";
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
				refreshAclList();
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			 hideWait();
		}
	});

}
//检查rule是否重复，优先级是否冲突 0 检验通过 1 规则已存在 2 已存在相同的优先级
function checkRule(rule, operType) {
	var firewallId = rule.firewallId;
	var checkResult = 0;
	$.ajax({
		type : "GET",
		dataType : "json",
		async:false,
		url : "servlet/firewallServlet?way=getRuleList",
		data:"id=" + firewallId,
		success : function(result) {
			var rules = result.rows;
			if (rules.length > 0) {
				for (var i = 0; i < rules.length; i ++) {
					var flag = isRuleSame(rules[i], rule, operType);
					console.log('flag ' + flag);
					if (flag) {
						checkResult = 1;
						break;
					} 
					//校验优先级不能相同
					if ('add' == operType) {
						if (rules[i].priority == rule.priority) {
							checkResult = 2;
							break;
						}
					} else {
						console.log('rules[i].id' + rules[i].id + ' rule.firewallRuleId ' + rule.firewallRuleId);
						if (rules[i].priority == rule.priority && rules[i].id != rule.firewallRuleId) {
							checkResult = 2;
							break;
						}
					}
				}
			}
		}
	});
	return checkResult;
}
//检查规则是否相同
function isRuleSame (rule1, rule2, operType) {

	if ('add' == operType) {
	    if (rule1.direction == rule2.direction && rule1.protocol == rule2.protocol && rule1.srcIp == rule2.srcIp
	            && rule1.srcMask == rule2.srcMask && rule1.srcPort == rule2.srcPort && rule1.destIp == rule2.destIp
	            && rule1.destMask == rule2.destMask && rule1.destPort == rule2.destPort) {
	        return true;
	    } 
	} else {
		console.log('operType' + operType);
		console.log('rule1.id' + rule1.id + ' rule2.firewallRuleId ' + rule2.firewallRuleId);
		console.log(rule1.id != rule2.firewallId);
	    if ((rule1.direction == rule2.direction && rule1.protocol == rule2.protocol && rule1.srcIp == rule2.srcIp
	            && rule1.srcMask == rule2.srcMask && rule1.srcPort == rule2.srcPort && rule1.destIp == rule2.destIp
	            && rule1.destMask == rule2.destMask && rule1.destPort == rule2.destPort) && rule1.id != rule2.firewallRuleId) {
	        return true;
	    } 
	}
    return false;
};

/*function checkIpFormat(e){
	var inputId = e.target.id;
	var inputVal = e.target.value;
	var inputObj = $('#'+inputId);
	if(inputId=="aclRuleSrcIpId"||inputId=="aclRuleSrcMaskId" || inputId=="aclRuleDestIpId" || inputId=="aclRuleDestMaskId"){
		var mark = true;
		 if(mark){
	   		 mark=checkItemNull(inputObj);
	   	 }
		 if(mark){
			 //问题单号 201405270139  对配置的ip地址等参数进行合法性验证 by s10462 20140605
			 if(inputId=="ipId" || )
				 mark= regexIP(inputObj);
			 if(inputId=="maskId")
				 mark= regexIPMask(inputObj);
	   	 }
	}else{
		regexIP(inputObj);
	}
}*/

function checkIpFormat(e){
	var inputId = e.target.id;
	var inputObj = $('#'+inputId);
	regexIP(inputObj);

}

function checkMaskFormat(e){
	var inputId = e.target.id;
	var inputObj = $('#'+inputId);
	regexIPMask(inputObj);
}



function regexIP(ip){
	var partten = /^([1-9]\d?|1\d{1,2}|2[01]\d|22[0-3])(\.(\d|[1-9]\d|1\d{1,2}|2[0-4]\d|25[0-5])){2}\.(0|[1-9]\d?|1\d{1,2}|2[0-4]\d|25[0-5])$/;
	ip.tooltip('destroy');
	if($.trim(ip.val())!=""){
		if (!partten.test($.trim(ip.val())) || "0.0.0.0"==$.trim(ip.val()) || "255.255.255.255"==$.trim(ip.val())) {
			ip.tooltip({
				   title:$('#ipTip').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(ip);
		}else{
			return showRightResult(ip);
		}
	}else{
		return showRightResult(ip);
	}
}
function regexIPMask(ip){
	var partten1 = /^(254|252|248|240|224|192|128|0)\.0\.0\.0$/;
	var partten2 = /^255\.(254|252|248|240|224|192|128|0)\.0\.0$/;
	var partten3 = /^255\.255\.(254|252|248|240|224|192|128|0)\.0$/;
	var partten4 = /^255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
	ip.tooltip('destroy');
	if($.trim(ip.val())!=""){
		if("255.255.255.255"==$.trim(ip.val())){
			ip.tooltip({
				   title:$('#ipMaskOutOfRangeMsgTip').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(ip);
		}else if (!(partten1.test($.trim(ip.val())) || partten2.test($.trim(ip.val())) || partten3.test($.trim(ip.val())) || partten4.test($.trim(ip.val()))) || "0.0.0.0"==$.trim(ip.val()))  {
			ip.tooltip({
				   title:$('#ipMaskTip').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			return showWrongResult(ip);
		}else{
			return showRightResult(ip);
		}
	}else{
		return showRightResult(ip);
	}
}


function checkItemNull(obj){
	obj.tooltip('destroy');
	if(obj.attr("id").substring(0,2)=="ss")
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

//检查优先级
function checkPriorityNum(e) {
    var inputId = e.target.id;
    var inputObj = $("#" + inputId);
    if (isNaN(inputObj.val())) {
        inputObj.val('');
    }
    if (inputObj.val() != '') {
	        if (inputObj.val() > 100) {
            inputObj.val(100);
            inputObj.numberspinner('setValue', 100);
        } else if (inputObj.val() < 1) {
            inputObj.val(1);
            inputObj.numberspinner('setValue', 1);
        } else {
            var value = inputObj.val();
            inputObj.val(parseInt(value));
            inputObj.numberspinner('setValue', value);
        }	        
    }
    if(inputObj.val() == ""){
        $("span.spinner > div").css("left", 375);
    }
}


//检查端口大小
function checkPortNum(e) {
    var inputId = e.target.id;
    var inputObj = $("#" + inputId);
    if (isNaN(inputObj.val())) {
        inputObj.val('');
    }
    if (inputObj.val() != '') {
	        if (inputObj.val() > 65535) {
            inputObj.val(65535);
            inputObj.numberspinner('setValue', 65535);
        } else if (inputObj.val() < 1) {
            inputObj.val(1);
            inputObj.numberspinner('setValue', 1);
        } else {
            var value = inputObj.val();
            inputObj.val(parseInt(value));
            inputObj.numberspinner('setValue', value);
        }	        
    }
    if(inputObj.val() == ""){
        $("span.spinner > div").css("left", 375);
    }
}

function selectProtocol(obj){
	var selectFlag = $(obj).val();
	if (selectFlag == 65535 || selectFlag == 1) { //隐藏端口
		$('#aclRuleSrcPortItem').hide();
		$('#aclRuleDestPortItem').hide();
		$('#aclRuleSrcPortNum').val("");
		$('#aclRuleSrcPortNum').numberspinner('setValue', "");
		$('#aclRuleDestPortNum').val("");
		$('#aclRuleDestPortNum').numberspinner('setValue', "");
	} else {   //显示端口
		var direction = $('#aclRuleDirectionId').val();
		if (direction == 0) {
			$('#aclRuleSrcPortItem').show();
		} else {
			$('#aclRuleDestPortItem').show();
		}
	}
}

function selectDirection(obj){
	var selectFlag = $(obj).val();
	var protocol = $('#aclRuleProtocolId').val();
	if (selectFlag == 0 ) { //入站
		$('#aclRuleDestIpItem').hide();
		$('#aclRuleDestMaskItem').hide();
		$('#aclRuleDestPortItem').hide();
		$('#aclRuleDestIpId').val("");
		$('#aclRuleDestMaskId').val("");
		$('#aclRuleDestPortNum').val("");
		$('#aclRuleDestPortNum').numberspinner('setValue', "");
		
		$('#aclRuleSrcIpItem').show();
		$('#aclRuleSrcMaskItem').show();
		if (protocol != 65535 && protocol != 1) {
			$('#aclRuleSrcPortItem').show();
		}
	} else {   //出站
		$('#aclRuleSrcIpItem').hide();
		$('#aclRuleSrcMaskItem').hide();
		$('#aclRuleSrcPortItem').hide();
		$('#aclRuleSrcIpId').val("");
		$('#aclRuleSrcMaskId').val("");
		$('#aclRuleSrcPortNum').val("");
		$('#aclRuleSrcPortNum').numberspinner('setValue', "");
		
		$('#aclRuleDestIpItem').show();
		$('#aclRuleDestMaskItem').show();
		if (protocol != 65535 && protocol != 1) {
			$('#aclRuleDestPortItem').show();
		}
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

