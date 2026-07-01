<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String cloudSafety = sm.getString("cloudSafety");
     String create = sm.getString("cloudSafety.create");
     String modify = sm.getString("cloudSafety.modify");
     String name = sm.getString("name");
     String description = sm.getString("cloudSafety.description");
     String acl = sm.getString("cloudSafety.acl");
     String inbound = sm.getString("cloudSafety.inbound");
     String outbound = sm.getString("cloudSafety.outbound");
     String direction = sm.getString("cloudSafety.direction");
     String directionInbound = sm.getString("cloudSafety.direction.inbound");
     String directionOutbound = sm.getString("cloudSafety.direction.outbound");
     String enabled = sm.getString("cloudSafety.enabled");
     String protocol = sm.getString("cloudSafety.protocol");
     String action = sm.getString("cloudSafety.action");
     String permit = sm.getString("cloudSafety.action.permit");
     String prohibit = sm.getString("cloudSafety.action.prohibt");
     String port = sm.getString("cloudSafety.port");
     String portStart = sm.getString("cloudSafety.port.start");
     String portEnd = sm.getString("cloudSafety.port.end");
     String ip = sm.getString("cloudSafety.ip");
     String icmpType = sm.getString("cloudSafety.icmpType");
     String icmpCode = sm.getString("cloudSafety.icmpCode");
     String shortcut = sm.getString("cloudSafety.shortcut");
     String submit = sm.getString("cloudSafety.confirm");
     String cancel = sm.getString("cloudSafety.cancel");
     String source = sm.getString("cloudSafety.source");
     String destination = sm.getString("cloudSafety.destination");
     String processing = sm.getString("cloudSafety.processing");
     String success = sm.getString("cloudSafety.success");
     String failed = sm.getString("cloudSafety.failed");
     String confirm = sm.getString("confirm");
     
     String srcIp = sm.getString("cloudSafety.srcIp");
     String	srcMask = sm.getString("cloudSafety.srcMask");
     String	srcPort = sm.getString("cloudSafety.srcPort");
     String	destIp = sm.getString("cloudSafety.destIp");
     String	destMask = sm.getString("cloudSafety.destMask");
     String	destPort = sm.getString("cloudSafety.destPort");
 	 String ipTip = sm.getString("ipTip");
 	 String ipValidateTip = sm.getString("ipValidateTip");
 	 String ipMaskTip = sm.getString("ipMaskTip");
 	 String ipMaskOutOfRangeMsgTip = sm.getString("ipMaskOutOfRangeMsgTip");
 	 String	priority = sm.getString("cloudSafety.priority");
     String srcMackIsNeeded = sm.getString("cloudSafety.firewallRule.srcMackIsNeeded");
     String srcIpIsNeeded = sm.getString("cloudSafety.firewallRule.srcIpIsNeeded");
     String destMackIsNeeded = sm.getString("cloudSafety.firewallRule.destMackIsNeeded");
     String destIpIsNeeded = sm.getString("cloudSafety.firewallRule.destIpIsNeeded");     
     String tips = sm.getString("tips");
     String ruleExists = sm.getString("cloudSafety.firewallRule.alreadyExists");
     String rulePriorityExists = sm.getString("cloudSafety.firewallRule.priority.alreadyExists");
     
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=create %><%=acl %></title>
<script type="text/javascript" src="js/addFirewallRule.js"></script>

</head>
<input id="srcMackIsNeeded" type="hidden" value="<%=srcMackIsNeeded%>">
<input id="srcIpIsNeeded" type="hidden" value="<%=srcIpIsNeeded%>">
<input id="destMackIsNeeded" type="hidden" value="<%=destMackIsNeeded%>">
<input id="destIpIsNeeded" type="hidden" value="<%=destIpIsNeeded%>"> 
<input id="tips" type="hidden" value="<%=tips%>">
<input id="ipMaskOutOfRangeMsgTip" type="hidden" value="<%=ipMaskOutOfRangeMsgTip%>">
<input id="ipMaskTip" type="hidden" value="<%=ipMaskTip%>">
<input id="ruleExists" type="hidden" value="<%=ruleExists%>">
<input id="rulePriorityExists" type="hidden" value="<%=rulePriorityExists%>">
<body>
  <input type="hidden" id="firewallRuleId">
  <input type="hidden" id="operType">
  <input id="ipTip" type="hidden" value="<%=ipTip%>">
  <input id="ipValidateTip" type="hidden" value="<%=ipValidateTip%>">
  <input id="ipMaskTip" type="hidden" value="<%=ipMaskTip%>">
  <input id="ipMaskOutOfRangeMsgTip" type="hidden" value="<%=ipMaskOutOfRangeMsgTip%>">
  <!-- <div id="modal" class="modal" style="position: relative;width:600px;height:auto"> -->
  <div id="modal" class="modal" style="position: absolute; top:30%; margin-top:-125px;left:50%;margin-left:-250px;font-size:14px;width:665px;">
	  <div class="modal-header" style="cursor:move" >
			<h5 id="title"><%=create %><%=acl %></h5>
            <h5 id="title2"><%=modify %><%=acl %></h5>
			<div id="modal-close" onclick="closeFirewallRule()"><span class="single-word-icon"></span></div>
	  </div>
	  <div class="shortcut" id="aclRuleQiuckSettingId">
			<ul>
					<li><%=shortcut %></li>
					<li><a class="btn linkbtn" data-type="ping" href="javascript:void(0)">PING</a></li>
					<li><a class="btn linkbtn" data-type="ssh" href="javascript:void(0)">SSH</a></li>
					<li><a class="btn linkbtn" data-type="http" href="javascript:void(0)">HTTP</a></li>
					<li><a class="btn linkbtn" data-type="https" href="javascript:void(0)">HTTPS</a></li>
					<li><a class="btn linkbtn" data-type="openvpn" href="javascript:void(0)">OPENVPN</a></li>
					<li><a class="btn linkbtn" data-type="remote" href="javascript:void(0)">RDP</a></li>
					<li><a class="btn linkbtn" data-type="pptp" href="javascript:void(0)">PPTP</a></li>
			</ul>
	  </div>
    <div class="modal-content">
		<form id="applyAclRuleFormId" class="form form-horizontal" style="border:1px;height:auto">
			<div class="item" >
				<div class="control-label">
					<%=direction %>
				</div>
				<div class="controls">
					<select id="aclRuleDirectionId" name="direction"  style="width:268px" onchange="selectDirection(this)">
						<option value="0"  selected="selected"><%=directionInbound %></option>
						<option value="1"  ><%=directionOutbound %></option>
					</select>
				</div>
			</div>
			
			<!-- 协议 -->
			<div class="item" >
				<div class="control-label">
					<%=protocol %>
				</div>
				<div class="controls">
					<select id="aclRuleProtocolId" name="protocol" style="width:268px" onchange="selectProtocol(this)">
						<option value="65535" selected="selected">ALL</option>
						<option value="1" >ICMP</option>
						<option value="6" >TCP</option>
						<option value="17" >UDP</option>
						
					</select>
				</div>
			</div>
            <!-- 源IP -->
		   <div class="item" id="aclRuleSrcIpItem">
					<div class="control-label"><%=srcIp%></div>
					<div class="controls">
						<input id="aclRuleSrcIpId" name="address"  type="text">
					</div>
			</div>
			 <!-- 源子网 -->
		   <div class="item" id="aclRuleSrcMaskItem">
				<div class="control-label"><%=srcMask%></div>
				<div class="controls">
					<input id="aclRuleSrcMaskId" name="address"  type="text">
				</div>
			</div>
			 <!-- 源端口 -->
			<div id="aclRuleSrcPortItem" class="item" >
				<div class="control-label">
				    <%=srcPort %>
				</div>
				<div class="controls">
				    <input id="aclRuleSrcPortNum" class="easyui-numberspinner" data-options="min:1,max:65535" 
				      style="width:268px;height:36px"></input>
				</div>
			</div>
			
			
			<!-- 目的IP -->
		   <div class="item" id="aclRuleDestIpItem">
					<div class="control-label"><%=destIp%></div>
					<div class="controls">
						<input id="aclRuleDestIpId" name="address"  type="text">
					</div>
			</div>
			 <!-- 目的子网 -->
		   <div class="item" id="aclRuleDestMaskItem">
				<div class="control-label"><%=destMask%></div>
				<div class="controls">
					<input id="aclRuleDestMaskId" name="address"  type="text">
				</div>
			</div>
		    <!-- 目的端口 -->
			<div id="aclRuleDestPortItem" class="item" >
				<div class="control-label">
				    <%=destPort %>
				</div>
				<div class="controls">
				    <input id="aclRuleDestPortNum" class="easyui-numberspinner" data-options="min:1,max:65535" 
				      style="width:268px;height:36px"></input>
				</div>
			</div>
			
			<!-- 优先级 -->
			<div id="priorityItem" class="item" >
				<div class="control-label">
				    <%=priority %>
				</div>
				<div class="controls">
				    <input id="priorityNum" class="easyui-numberspinner" data-options="min:1,max:100" 
				      style="width:268px;height:36px"></input>
				</div>
			</div>
			
			<!-- 动作 -->
			<div class="item" >
				<div class="control-label">
					<%=action %>
				</div>
				<div class="controls">
					<select id="aclRuleActionId" name="action" style="width:268px">
						<option value="1"  selected="selected"><%=permit%></option>
						<%-- <option value="0"  ><%=prohibit %></option> --%>
					</select>
				</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn btn-primary"  type="button" value="<%=confirm %>" onclick="submitFwStrategyRule()"> 
					<input class="btn btn-primary"  type="button" value="<%=cancel %>" onclick="closeFirewallRule()">
	        </div>
		</form>
    </div> 
  </div>
<script type="text/javascript">

$('#aclRuleQiuckSettingId ul').click(function(e){
	var target = e.target;
	var text = $(target).text();
	var direction = $('#aclRuleDirectionId').val();
	if (direction == 0) {
		if ('PING' == text) {
			$('#aclRuleProtocolId').val(1);
		} else if ('SSH' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleSrcPortNum').val(22);
			$('#aclRuleSrcPortNum').numberspinner('setValue', 22);
		} else if ('HTTP' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleSrcPortNum').val(80);
			$('#aclRuleSrcPortNum').numberspinner('setValue', 80);
		} else if ('HTTPS' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleSrcPortNum').val(443);
			$('#aclRuleSrcPortNum').numberspinner('setValue', 443);
		} else if ('OPENVPN' == text) {
			$('#aclRuleProtocolId').val(17);
			$('#aclRuleSrcPortNum').val(1194);
			$('#aclRuleSrcPortNum').numberspinner('setValue', 1194);
		} else if ('RDP' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleSrcPortNum').val(3389);
			$('#aclRuleSrcPortNum').numberspinner('setValue', 3389);
		} else if ('PPTP' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleSrcPortNum').val(1723);
			$('#aclRuleSrcPortNum').numberspinner('setValue', 1723);
		}
	} else {
		if ('PING' == text) {
			$('#aclRuleProtocolId').val(1);
		} else if ('SSH' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleDestPortNum').val(22);
			$('#aclRuleDestPortNum').numberspinner('setValue', 22);
		} else if ('HTTP' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleDestPortNum').val(80);
			$('#aclRuleDestPortNum').numberspinner('setValue', 80);
		} else if ('HTTPS' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleDestPortNum').val(443);
			$('#aclRuleDestPortNum').numberspinner('setValue', 443);
		} else if ('OPENVPN' == text) {
			$('#aclRuleProtocolId').val(17);
			$('#aclRuleDestPortNum').val(1194);
			$('#aclRuleDestPortNum').numberspinner('setValue', 1194);
		} else if ('RDP' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleDestPortNum').val(3389);
			$('#aclRuleDestPortNum').numberspinner('setValue', 3389);
		} else if ('PPTP' == text) {
			$('#aclRuleProtocolId').val(6);
			$('#aclRuleDestPortNum').val(1723);
			$('#aclRuleDestPortNum').numberspinner('setValue', 1723);
		}
	}
	$('#aclRuleProtocolId').trigger('change');
});

$("#priorityNum").numberspinner({
	   onSpinUp:function(){
		   showRightResult($(this));
	   },
	   onSpinDown:function() {
		   showRightResult($(this));
	   }
});
$("#priorityNum").bind("keyup",checkPriorityNum);

$("#aclRuleSrcPortNum").numberspinner({
	   onSpinUp:function(){
		   showRightResult($(this));
	   },
	   onSpinDown:function() {
		   showRightResult($(this));
	   }
});
$("#aclRuleSrcPortNum").bind("keyup",checkPortNum);

$("#aclRuleDestPortNum").numberspinner({
	   onSpinUp:function(){
		   showRightResult($(this));
	   },
	   onSpinDown:function() {
		   showRightResult($(this));
	   }
});
$("#aclRuleDestPortNum").bind("keyup",checkPortNum);




</script>
</body>
</html>