/** 云安全，防火墙策略管理。 */
/*$.extend($.fn.validatebox.defaults.rules, {   
    checkIP: {   
        validator: function(value, param){
        	if (value != null && value != '') {
        		var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
        		return reg.test(value);
        	}
        }   
    }   
});*/

/** 打开申请防火墙策略(云安全)窗口。 */
function openApplyFwStrategy () {
	$('#cloudSafetyOverlay').load('page/widget/addFirewall.jsp',function(){
		$("#title2").hide();
	    $("#title").show();
		$("#cloudSafetyOverlay").show();
	});
}

/** 云安全，打开修改防火墙策略。 */
function editFwStrategy () {
	var row = $('#firewallListId').datagrid('getSelected');
	var index;
	if (row != null && row != '') {
		index = row.id;
	}
  	if (index == null || index <= 0) {
  		return;
  	}
	$('#cloudSafetyOverlay').load('page/widget/addFirewall.jsp',function(){
		$('#title').hide();
		$('#title2').show();
		$('#fwStrategyId').val(row.id);
		$('#fwStrategyUserId').val(row.userId);
		$('#fwStrategyNameId').val(row.name);
		$('#fwStrategyNameId').attr("disabled",true);
		$('#fwStrategyDescId').val(row.description);
		$("#cloudSafetyOverlay").show();
		$("#fwStrategyHostName").val(row.vmNames);
	});
}

/** 打开修改规则窗口 */
function editFirewallRule(index) {
	var row;
	var inboundRow = $('#aclInRuleId').datagrid('getSelections');
	var outboundRow = $('#aclOutRuleId').datagrid('getSelections');
	//支持多选后，选择两条及以上Firewall规则时，不可编辑
	if (inboundRow.length + outboundRow.length > 1) {
		return;
	}
	if (index == null || index <= 0) {
		if (inboundRow != null && inboundRow != '') {
			row = inboundRow[0];
			index = row.id;
		}
	}
	if (index == null || index <= 0) {
		if (outboundRow != null && outboundRow != '') {
			row = outboundRow[0];
			index = row.id;
		}
	}
	if (index == null || index <= 0) {
		return;
	}
	$('#cloudSafetyOverlay').load('page/widget/addFirewallRule.jsp',function(){
		$('#title').hide();
		$('#title2').show();
		$("#aclRuleSrcIpId,#aclRuleDestIpId").bind("keyup",checkIpFormat);
		$("#aclRuleSrcMaskId,#aclRuleDestMaskId").bind("keyup",checkMaskFormat);
	    //初始All协议隐藏端口
		$('#aclRuleSrcPortItem').hide();
		$('#aclRuleDestPortItem').hide();
		$('#operType').val('edit');
		$('#firewallRuleId').val(row.id);
		$('#aclRuleDirectionId').val(row.direction);
		$('#aclRuleDirectionId').trigger('change');
		$('#aclRuleActionId').val(row.action);
		$('#aclRuleProtocolId').val(row.protocol);
		$('#aclRuleProtocolId').trigger('change');
		$('#aclRuleSrcIpId').val(row.srcIp);
		$('#aclRuleSrcMaskId').val(row.srcMask);
		$('#aclRuleDestIpId').val(row.destIp);
		$('#aclRuleDestMaskId').val(row.destMask);
		
		$('#priorityNum').val(row.priority);
		$('#priorityNum').numberspinner('setValue', row.priority);
		$('#aclRuleSrcPortNum').val(row.srcPort);
		$('#aclRuleSrcPortNum').numberspinner('setValue', row.srcPort);
		$('#aclRuleDestPortNum').val(row.destPort);
		$('#aclRuleDestPortNum').numberspinner('setValue', row.destPort);

		$("#cloudSafetyOverlay").show();
		
	});
}



/** 打开新建规则窗口 */
function addFirewallRule() {
	$('#cloudSafetyOverlay').load('page/widget/addFirewallRule.jsp',function(){
	    $("#title2").hide();
	    $("#title").show();
	    $('#operType').val('add');
	    //初始All协议隐藏端口
		$('#aclRuleSrcPortItem').hide();
		$('#aclRuleDestPortItem').hide();
		$('#aclRuleDestIpItem').hide();
		$('#aclRuleDestMaskItem').hide();
		$('#aclRuleDestPortItem').hide();
		
		$('#priorityNum').val(1);
		$('#priorityNum').numberspinner('setValue', 1);
		
		$("#aclRuleSrcIpId,#aclRuleDestIpId").bind("keyup",checkIpFormat);
		$("#aclRuleSrcMaskId,#aclRuleDestMaskId").bind("keyup",checkMaskFormat);
	
		$("#cloudSafetyOverlay").show();
	});
}


/** 根据ACL不同协议选项显示不同的值。 */
function reloadForm() {
	var protocol = $('#aclRuleProtocolId').find('option:selected').text();
	if (protocol) {
		if ('TCP' == protocol || 'UDP' == protocol) {
			$('#portGroupForUDP').show();
			$('#portGroupForICMP').hide();
		} else if ('ICMP' == protocol) {
			$('#portGroupForUDP').hide();
			$('#portGroupForICMP').show();
		} else if ('GRE' == protocol) {
			$('#portGroupForUDP').hide();
			$('#portGroupForICMP').hide();
		}
	}
}


/** 关闭申请ACL规则窗口。 */
function closeAddQosOrAclRule() {
	$('#cloudSafetyOverlay').hide();
}


/** 关闭申请防火墙策略(云安全)窗口。 */
function close() {
	$('#cloudSafetyOverlay').hide();
}