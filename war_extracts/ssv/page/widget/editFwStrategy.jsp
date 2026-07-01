<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
      /** 多语言资源。 */
     StringManager sm = StringManager.getManager(StringManager.class);
     String firewall = sm.getString("cloudSafety.firewall");
     String create = sm.getString("cloudSafety.create");
     String name = sm.getString("name");
     String description = sm.getString("cloudSafety.description");
     String host = sm.getString("cloudSafety.host");
     String submit = sm.getString("cloudSafety.confirm");
     String cancel = sm.getString("cloudSafety.cancel");
     String close = sm.getString("close");
     String list = sm.getString("list");
     String modify = sm.getString("cloudSafety.modify");
     String processing = sm.getString("cloudSafety.processing");
     String success = sm.getString("cloudSafety.success");
     String failed = sm.getString("cloudSafety.failed");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=create %><%=firewall %></title>
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
  <div id="modal" class="modal" onmousedown="drag(event,this)" style="position: relative;width:550px;height:auto;">
      <div class="modal-header" style="cursor:move" onmousedown="drag(event,this)">
			<h5><%=modify %><%=firewall %></h5>
			<div id="modal-close"><span class="single-word-icon"></span></div>
	  </div>
	  <div style="height:30px"></div>
    <div class="modal-content">
		<form id="editFwStrategyFormId" class="form form-horizontal cloudsafety" style="border:1px;height:auto;">
			<div class="item">
				<div class="control-label">
					<%=name %><span style="color: red">*</span>
				</div>
				<div class="controls">
					<input id="fwStrategyId" type="hidden" name="fwStrategyId">
					<input id="fwStrategyNameId" type="text" name="fwStrategyName">
				</div>
			</div>
			<div class="item" >
				<div class="control-label"><%=description %></div>
				<div class="controls">
					<textarea id="fwStrategyDescId"  name="fwStrategyDescName"></textarea>
				</div>
			</div>
			<div class="item">
				<div class="control-label"><%=host%></div>
				<div class="controls">
					<input id="fwStrategyUserNameId" type="text" name="fwStrategyUserName" readonly="readonly">
					<input id="fwStrategyUserId" type="hidden" name="fwStrategyUserId">
				</div>
			</div>
			<div class="item">
				<div class="control-label">&nbsp;</div>
				<div class="controls">
					<table id="vmListId" ></table>
				</div>
			</div>
			<div class="form-actions" style="margin-bottom:0px;padding-left:180px" >
					<input class="btn" id="registerId" type="button" value="<%=submit %>"> 
					<input class="btn" id="cancelId" type="button" value="<%=cancel %>" >
	        </div>
		</form>
    </div> 
  </div>
  <script type="text/javascript">
  		
	  function hideVmListForApply() {
		  $('#vmListId').datagrid({closed:true});
	  }
	  
	  /** 关闭申请防火墙策略(云安全)窗口。 */
	  function closeAddFwStrategy() {
	  	$('#cloudSafetyOverlay').hide();
	  }
	  
	  
	  /** 虚拟机列表 */
	  function showVmListForEditFw() {
		  $('#vmListId').datagrid({
			    url:'servlet/vmList?way=list&cloud=backup',
		  		closed:false,
		  		singleSelect:false,
		  		rownumbers:true,
		  		width:280,
		  		//pagination:true,
		  		//selectOnCheck:true,
		  		//checkOnSelect:true,
		  		onCheck:function(rowIndex, rowData){
		  			var rowNames = [];
		  			var rowIds = [];
		  			var rows = $('#vmListId').datagrid('getSelections');
		  			for(var i=0; i<rows.length; i++){
		  				var row = rows[i];
		  				rowNames.push(row.name);
		  				rowIds.push(row.id);
		  			}
		  			$('#fwStrategyUserNameId').val(rowNames);
		  			$('#fwStrategyUserId').val(rowIds);
		         },
		        onUncheck:function(rowIndex, rowData){
			  			var rowNames = [];
			  			var rowIds = [];
			  			var rows = $('#vmListId').datagrid('getSelections');
			  			for(var i=0; i<rows.length; i++){
			  				var row = rows[i];
			  				rowNames.push(row.name);
			  				rowIds.push(row.id);
			  			}
			  			$('#fwStrategyUserNameId').val(rowNames);
			  			$('#fwStrategyUserId').val(rowIds);
			    },
			    onCheckAll:function(rows){
			    	var rowNames = [];
		  			var rowIds = [];
			    	for(var i=0; i<rows.length; i++){
		  				var row = rows[i];
		  				rowNames.push(row.name);
		  				rowIds.push(row.id);
		  			}
		  			$('#fwStrategyUserNameId').val(rowNames);
		  			$('#fwStrategyUserId').val(rowIds);
			    },
			    onUncheckAll:function(rows){
			    	$('#fwStrategyUserNameId').val('');
		  			$('#fwStrategyUserId').val('');
			    },
		  		onClickRow:function(rowIndex, rowData){
		  			var rowNames = [];
		  			var rowIds = [];
		  			var rows = $('#vmListId').datagrid('getSelections');
		  			for(var i=0; i<rows.length; i++){
		  				var row = rows[i];
		  				rowNames.push(row.name);
		  				rowIds.push(row.id);
		  			}
		  			$('#fwStrategyUserNameId').val(rowNames);
		  			$('#fwStrategyUserId').val(rowIds);
		        },
		        onBeforeLoad:function(param) {
			    	   $(".datagrid-toolbar").css("float","right");
			    },
		        onLoadSuccess:function(data){
		            	//获取数据进行选定
		        	  	var data = $('#vmListId').datagrid('getData').rows;
		            	var userIds = $('#fwStrategyUserId').val();
		            	if (userIds != null && userIds != '') {
		            		var dbIds = userIds.split(",");
		            		for ( var i = 0; i < data.length; i++) {
		      	    			for ( var j = 0; j < dbIds.length; j++) {
		      	    				if (data[i].id == dbIds[j]) {
		      	    					$('#vmListId').datagrid('checkRow',i);
		      	    				}
		      	    			}
		      	    		}
		            	}
		          },
		          columns:[[ 
							{field:'ck',checkbox:true},
		                  {field:'id',title:'',width:0, hidden:true}, 
		                  {field:'name',title:'<%=host%><%=name%>',width:200}
		          ]],
		          toolbar: [{
			          		iconCls: 'icon-cancel',
			          		handler: hideVmListForApply
			      }]
		  	});
	  }
	  
	  /** 获取防火墙策略基本信息。 */
	  function getFirewallStrategyInfo(){
	  	var id = $('#firewallListId').datagrid('getSelected').id;
	  	if (id == null || id <= 0) {
	  		return;
	  	}
	  	$.ajax({
	  		type : "GET",
	  		dataType : "json",
	  		url : "servlet/firewallServlet?way=getFwStrategyById",
	  		data:"id=" + id,
	  		success : function(result) {
	  			if (result != null && typeof result != 'undefined') {
		  			$('#fwStrategyId').val(result.id);
		  			$('#fwStrategyNameId').val(result.name);
		  			$('#fwStrategyDescId').val(result.description);
		  			var domains = result.domains;
		  			if(domains != null) {
		  				var domainNames = [];
		  				var domainIds = [];
		  	    		for(var i=0; i<domains.length; i++){
		  	    			var domain = domains[i];
		  	    			domainNames.push(domain.domainName);
		  	    			domainIds.push(domain.domainId);
		  	    		}
		  				$('#fwStrategyUserNameId').val(domainNames);
		  				$('#fwStrategyUserId').val(domainIds);
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
	  

	  /** 提交防火墙策略修改。 */
	  function submitEditFwStrategy() {
		  	var flag = true;
		  	var name = $('#fwStrategyNameId').val();
		  	if (name == '') {
				$("#fwStrategyNameId").parents(".item").find(".control-label").css("color","red");
				$("#fwStrategyNameId").css("border","red 2px solid");
				flag = false;
			} else{
				$("#fwStrategyNameId").parents(".item").find(".control-label").css("color","#666666");
				$("#fwStrategyNameId").css("border","#CCCCCC 2px solid");
			}
		  	var desc = $('#fwStrategyDescId').val();
		  	if (desc == '') {
		  		$("#fwStrategyDescId").parents(".item").find(".control-label").css("color","red");
				$("#fwStrategyDescId").css("border","red 2px solid");
				flag = false;
		  	} else{
				$("#fwStrategyDescId").parents(".item").find(".control-label").css("color","#666666");
				$("#fwStrategyDescId").css("border","#CCCCCC 2px solid");
			}
		  	
		  	//var flag = $('#editFwStrategyFormId').form('validate');
		  	if ( !flag ) {
		  		return;
		  	} else {
		  		var vms = $('#fwStrategyUserNameId').val();
		  		var id = $('#fwStrategyId').val();
		  		if (id == '' || id <=0) {
		  			return false;
		  		}
		  		//增加策略模板  
		  		var xml = '';
		  		xml += '<firewall>';
		  		xml += '<id>'+id+'</id>';
		  		xml += '<name>'+name+'</name>';
		  		xml += '<description>'+desc+'</description>';
		  		var userName = $('#fwStrategyUserNameId').val();
		  		if (userName != null && userName != '') {
		  			var domainNames = userName.split(',');
		  			var domainIds = $('#fwStrategyUserId').val().split(',');
		  			for ( var i = 0; i < domainIds.length; i++) {
		  				xml += '<domain>';
		  				xml += '<domainId>'+domainIds[i]+'</domainId>';
		  				xml += '<domainName>'+domainNames[i]+'</domainName>';
		  				xml += '</domain>';
		  			}
		  		}
		  		xml += '</firewall>';
		  		$.ajax({
		  			type : "POST",
		  			dataType : "json",
		  			url : "servlet/firewallServlet?way=modifyFwStrategy",
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
			  					$('#firewallListId').datagrid('reload');
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