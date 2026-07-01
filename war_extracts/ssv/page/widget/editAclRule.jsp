<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String cloudSafety = sm.getString("cloudSafety");
     String create = sm.getString("cloudSafety.create");
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
     String modify = sm.getString("cloudSafety.modify");
     String processing = sm.getString("cloudSafety.processing");
     String success = sm.getString("cloudSafety.success");
     String failed = sm.getString("cloudSafety.failed");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=create %><%=acl %></title>
 <style type="text/css">
 .form .item {
    margin: 12px auto;
}
.form-horizontal .control-label {
    float: left;
    font-size: 16px;
    line-height: 35px;
    text-align: left;
    vertical-align: middle;
    width: 130px;
    margin-left: 50px;
}
.form-horizontal .controls {
    margin-left: 150px;
    min-height: 35px;
}

input[type="radio"], input[type="checkbox"] {
    cursor: pointer;
    line-height: normal;
    margin: 4px 4px 0 0;
    padding: 0;
}

.form-actions {
	border-top: 1px solid #ccc;
	padding: 10px 20px;
	background: #eee;
}
 </style>
</head>
<body>
  <div id="modal" class="modal" onmousedown="drag(event,this)" style="position: relative;width:600px;height:auto">
      <div class="modal-header" style="cursor:move" onmousedown="drag(event,this)">
			<h5><%=modify %><%=acl %></h5>
			<div id="modal-close"><span class="single-word-icon"></span></div>
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
					<li><a class="btn linkbtn" data-type="gre" href="javascript:void(0)">GRE</a></li>
					<li><a class="btn linkbtn" data-type="pptp" href="javascript:void(0)">PPTP</a></li>
				</ul>
			</div>
    <div class="modal-content">
		<form id="editAclRuleFormId" class="form form-horizontal cloudsafety" style="border:1px;height:auto">
			<div class="item">
				<div class="control-label">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="aclRuleId" type="hidden" name="aclRuleId">
					<input id="aclRuleNameId" type="text" name="name" >
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=enabled %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="aclRuleEnabledId" style="align:left;" type="checkbox" name="enabled" value="1">
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=direction %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<select id="aclRuleDirectionId" name="direction"  >
						<option value="0"  selected="selected"><%=directionInbound %></option>
						<option value="1"  ><%=directionOutbound %></option>
					</select>
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=action %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<select id="aclRuleActionId" name="action" >
						<option value="1"  selected="selected"><%=permit%></option>
						<option value="0"  selected="selected"><%=prohibit %></option>
					</select>
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=protocol %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<select id="aclRuleProtocolId" name="protocol" >
						<option value="6"  selected="selected">TCP</option>
						<option value="17" >UDP</option>
						<option value="1" >ICMP</option>
						<option value="13" >GRE</option>
					</select>
				</div>
			</div>
			<div id="portGroupForUDP">
				<div class="item" >
					<div class="control-label">
						<%=portStart %>
					</div>
					<div class="controls">
						<input id="aclRulePortStartId" name="portStart"   type="text">
					</div>
				</div>
				<div class="item" >
					<div class="control-label">
						<%=portEnd %>
					</div>
					<div class="controls">
						<input id="aclRulePortEndId" name="portEnd"  type="text">
					</div>
				</div>
			</div>
			<div id="portGroupForICMP">
				<div class="item" >
					<div class="control-label">
						<%=icmpType %>
					</div>
					<div class="controls">
						<select id="aclRuleICMPTypeId" name="icmpType" disabled="disabled">
							<option value="1"  selected="selected">Echo</option>
						</select>
					</div>
				</div>
				<div class="item" >
					<div class="control-label">
						<%=icmpCode %>
					</div>
					<div class="controls">
						<select id="aclRuleICMPCodeId" name="icmpCode"   disabled="disabled">
							<option value="1"  selected="selected">Echo request</option>
						</select>
					</div>
				</div>
			</div>
			<div class="item" id="aclRuleAddressItem">
					<div class="control-label"><%=source%>&nbsp;<%=ip %></div>
					<div class="controls">
						<input id="aclRuleAddressId" name="address"  type="text">
					</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn" id="registerId" type="button" value="<%=submit %>" > 
					<input class="btn" id="cancelId" type="button" value="<%=cancel %>">
	        </div>
		</form>
    </div> 
  </div>
<script type="text/javascript">

/** 入站出站不同修改表单。 */
function changeAddress() {
	var  direction = $('#aclRuleDirectionId').val();
	if (direction) {
		if (1 == direction) { //出站
			$('#aclRuleAddressItem .control-label').text('<%=destination%>'+' '+'<%=ip %>');
		} else if (0 == direction) {
			$('#aclRuleAddressItem .control-label').text('<%=source%>'+' '+'<%=ip %>');
		}
	}
}


/** 获取ACL规则信息。 */
function getAclRuleInfo(index) {
	id = index;
	if (id == null || id <= 0) {
		return;
	}
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "servlet/firewallServlet?way=getAclRuleRuleById",
		data:"id=" + id,
		success : function(result) {
			if (result != null && typeof result != 'undefined') {
				$('#aclRuleId').val(result.id);
				$('#aclRuleNameId').val(result.name);
				$('#aclRuleEnabledId').attr("checked",result.enabled == 0 ? false:true);
				$('#aclRuleDirectionId').val(result.direction);
				$('#aclRuleActionId').val(result.action);
				$('#aclRuleProtocolId').val(result.protocol);
				$('#aclRulePortStartId').val(result.portStart);
				$('#aclRulePortEndId').val(result.portEnd);
				$('#aclRuleICMPTypeId').val(result.icmpType);
				$('#aclRuleICMPCodeId').val(result.icmpCode);
				$('#aclRuleAddressId').val(result.ip);
				reloadForm();
			}
		},
		error : function() {
			$.messager.show({
				title : '<%=failed%>',
				msg : result.message,
				showType : 'show'
			});
		}
	});
}

/** 更新ACL规则 */
function submitEditAclRule() {
	var aclRuleId = $("#aclRuleId").val();
	if (aclRuleId == '') {
		return;
	}
	var flag = true;
	var name = $('#aclRuleNameId').val();
	if (name == '') {
		$("#aclRuleNameId").parents(".item").find(".control-label").css("color","red");
		$("#aclRuleNameId").css("border","red 2px solid");
		flag = false;
	} else{
		$("#aclRuleNameId").parents(".item").find(".control-label").css("color","#666666");
		$("#aclRuleNameId").css("border","#CCCCCC 2px solid");
	}
	var ip = $('#aclRuleAddressId').val();
	if (ip != '') {
    		var reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    		if (!reg.test(ip)) {
    			$("#aclRuleAddressId").parents(".item").find(".control-label").css("color","red");
    			$("#aclRuleAddressId").css("border","red 2px solid");
    			flag = false;
    		} else {
    			$("#aclRuleAddressId").parents(".item").find(".control-label").css("color","#666666");
    			$("#aclRuleAddressId").css("border","#CCCCCC 2px solid");
    		}
    } else {
    	$("#aclRuleAddressId").parents(".item").find(".control-label").css("color","#666666");
		$("#aclRuleAddressId").css("border","#CCCCCC 2px solid");
    }
	//var flag = $('#editAclRuleFormId').form('validate');
	if ( !flag ) {
		return;
	} else {
		var enabled = ($('#aclRuleEnabledId').is(':checked')? 1:0);
		var direction = $('#aclRuleDirectionId').val();
		var action = $('#aclRuleActionId').val();
		var protocol = $('#aclRuleProtocolId').val();
		var portStart = $('#aclRulePortStartId').val();
		var portEnd = $('#aclRulePortEndId').val();
		var icmpType = $('#aclRuleICMPTypeId').val();
		var icmpCode = $('#aclRuleICMPCodeId').val();
		var ip = $('#aclRuleAddressId').val();
		//增加ACL规则模板  
		var xml = '';
		xml += '<acl>';
		xml += '<id>'+aclRuleId+'</id>';
		xml += '<name>'+name+'</name>';
		xml += '<enabled>'+enabled+'</enabled>';
		xml += '<direction>'+direction+'</direction>';
		xml += '<action>'+action+'</action>';
		xml += '<protocol>'+protocol+'</protocol>';
		xml += '<portStart>'+portStart+'</portStart>';
		xml += '<portEnd>'+portEnd+'</portEnd>';
		xml += '<icmpType>'+icmpType+'</icmpType>';
		xml += '<icmpCode>'+icmpCode+'</icmpCode>';
		xml += '<ip>'+ip+'</ip>';
		xml += '</acl>';
		$.ajax({
			type : "POST",
			dataType : "json",
			url : "servlet/firewallServlet?way=modifyAclRule",
			data : "xml=" + xml,
			beforeSend : function(xhr) {
				$("<div class=\"datagrid-mask\" style='z-index:999999'></div>")
						.css({
							display : "block",
							width : "100%",
							height : $(window).height()
						}).appendTo("body");
				$("<div class=\"datagrid-mask-msg\" style='z-index:999999'></div>")
						.html("<%=processing%>").appendTo("body").css({
							display : "block",
							left : ($(document.body).outerWidth(true) - 190) / 2,
							top : ($(window).height() - 45) / 2
						});
			},
			success : function(result) {
				hideWait();
				if (result != null && typeof result != 'undefined') {
					var state = result.state;
					if (state == "1") {
						$(".window-overlay").css("display", "none");
						$.messager.show({
							title : '<%=success%>',
							msg : result.message,
							showType : 'show'
						});
						$('#aclInRuleId').datagrid('reload');
						$('#aclOutRuleId').datagrid('reload');
					} else {
						$.messager.show({
							title : '<%=failed%>',
							msg : result.message,
							showType : 'show'
						});
					}
				}
			},
			error : function() {
				hideWait();
			}
		});
	}
}
</script>
</body>
</html>