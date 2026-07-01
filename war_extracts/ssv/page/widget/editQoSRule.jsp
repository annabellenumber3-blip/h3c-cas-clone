<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String create = sm.getString("cloudSafety.create");
     String name = sm.getString("name");
     String qos = sm.getString("cloudSafety.qos");
     String enabled = sm.getString("cloudSafety.enabled");
     String inboundRate = sm.getString("cloudSafety.inboundRate");
     String outboundRate = sm.getString("cloudSafety.outboundRate");
     String submit = sm.getString("cloudSafety.confirm");
     String cancel = sm.getString("cloudSafety.cancel");
     String unlimited = sm.getString("cloudSafety.unlimited");
     String modify = sm.getString("cloudSafety.modify");
     String processing = sm.getString("cloudSafety.processing");
     String success = sm.getString("cloudSafety.success");
     String failed = sm.getString("cloudSafety.failed");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=create %><%=qos %></title>
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
			<h5><%=modify %><%=qos %></h5>
			<div id="modal-close"><span class="single-word-icon"></span></div>
	  </div>
    <div class="modal-content">
		<form id="editQoSRuleFormId" class="form form-horizontal cloudsafety" style="border:1px;height:auto">
			<div class="item">
				<div class="control-label">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="qosRuleId" type="hidden" name="qosRuleId">
					<input id="qosRuleNameId" type="text" name="name" >
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=enabled %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="qosRuleEnabledId" style="align:left;" type="checkbox" name="enabled">
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=inboundRate %>
				</div>
				<div class="controls">
					<select id="qosRuleInBoundRateId" name="inBoundRate" >
							<option value="-1"  selected="selected"><%=unlimited %></option>
							<option value="128" >128</option>
							<option value="256" >256</option>
							<option value="512" >512</option>
							<option value="1024" >1024</option>
							<option value="2048" >2048</option>
							<option value="4096" >4096</option>
					</select>
					Kbps
				</div>
			</div>
			<div class="item" >
				<div class="control-label">
					<%=outboundRate %>
				</div>
				<div class="controls">
					<select id="qosRuleOutBoundRateId" name="outBoundRate" >
							<option value="-1"  selected="selected"><%=unlimited %></option>
							<option value="128" >128</option>
							<option value="256" >256</option>
							<option value="512" >512</option>
							<option value="1024" >1024</option>
							<option value="2048" >2048</option>
							<option value="4096" >4096</option>
					</select>
					Kbps
				</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn" id="registerId" type="button" value="<%=submit %>"> 
					<input class="btn" id="cancelId" type="button" value="<%=cancel %>">
	        </div>
		</form>
    </div> 
  </div>
  <script type="text/javascript">
  /** 获取QoS规则信息。 */
  function getQoSRuleInfo(index) {
  	id = index;
  	if (id == null || id <= 0) {
  		return;
  	}
  	$.ajax({
  		type : "GET",
  		dataType : "json",
  		url : "servlet/firewallServlet?way=getQoSRuleById",
  		data:"id=" + id,
  		success : function(result) {
  			if (result != null && typeof result != 'undefined') {
	  			$('#qosRuleId').val(result.id);
	  			$('#qosRuleNameId').val(result.name);
	  			$('#qosRuleEnabledId').attr("checked",result.enabled == 0 ? false:true);
	  			var inboundEnabled = result.inbound;
	  			if (!inboundEnabled) {
	  				$('#qosRuleInBoundRateId').val(-1);
	  			} else {
	  				$('#qosRuleInBoundRateId').val(result.inPeakBandwidth);
	  			}
	  			var outboundEnabled = result.outbound;
	  			if (!outboundEnabled) {
	  				$('#qosRuleOutBoundRateId').val(-1);
	  			} else {
	  				$('#qosRuleOutBoundRateId').val(result.outPeakBandWidth);
	  			}
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
  
  /** 更新QoS规则 */
  function submitEditQoSRule() {
  	var qosRuleId = $("#qosRuleId").val();
  	if (qosRuleId == '') {
  		return;
  	}
  	var flag = true;
	var name = $('#qosRuleNameId').val();
	if (name == '') {
		$("#qosRuleNameId").parents(".item").find(".control-label").css("color","red");
		$("#qosRuleNameId").css("border","red 2px solid");
		flag = false;
	} else{
		$("#qosRuleNameId").parents(".item").find(".control-label").css("color","#666666");
		$("#qosRuleNameId").css("border","#CCCCCC 2px solid");
	}
  	//var flag = $('#editQoSRuleFormId').form('validate');
  	if ( !flag ) {
  		return;
  	} else {
  		var enabled = ($('#qosRuleEnabledId').is(':checked') ? 1:0);
  		var inRate = $('#qosRuleInBoundRateId').val();
  		var inbound = 0;
  		if (inRate > -1) {
  			inbound = 1;
  		}
  		var outRate = $('#qosRuleOutBoundRateId').val();
  		var outbound = 0;
  		if (outRate > -1) {
  			outbound = 1;
  		}
  		//增加QoS规则模板  
  		var xml = '';
  		xml += '<qos>';
  		xml += '<id>'+qosRuleId+'</id>';
  		xml += '<name>'+name+'</name>';
  		xml += '<enabled>'+enabled+'</enabled>';
  		xml += '<inbound>'+inbound+'</inbound>';
  		xml += '<inPeakBandwidth>'+inRate+'</inPeakBandwidth>';
  		xml += '<outbound>'+outbound+'</outbound>';
  		xml += '<outPeakBandwidth>'+outRate+'</outPeakBandwidth>';
  		xml += '</qos>';
  		$.ajax({
  			type : "POST",
  			dataType : "json",
  			url : "servlet/firewallServlet?way=modifyQoSRule",
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
	  					$('#qosListId').datagrid('reload');
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