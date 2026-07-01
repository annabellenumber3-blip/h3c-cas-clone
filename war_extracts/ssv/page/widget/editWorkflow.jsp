<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	/** 多语言资源。 */
	
	StringManager sm = StringManager.getManager(StringManager.class);
	String applayInstance = sm.getString("applayInstance");
	String template = sm.getString("template");
	String selectTemplate = sm.getString("selectTemplate");
	String selectType = sm.getString("selectType");
	String baseParam = sm.getString("baseParam");
	String setNetwork = sm.getString("setNetwork");
	String extensionParam = sm.getString("extensionParam");
	String seperate = sm.getString("seperate");
	String preDefined = sm.getString("preDefined");
	String userDefined = sm.getString("userDefined");
	String nextStep = sm.getString("nextStep");
	String recommendType = sm.getString("recommendType");
	String smallA = sm.getString("smallA");
	String smallB = sm.getString("smallB");
	String smallC = sm.getString("smallC");
	String middleA = sm.getString("middleA");
	String middleB = sm.getString("middleB");
	String middleC = sm.getString("middleC");
	String bigA = sm.getString("bigA");
	String bigB = sm.getString("bigB");
	String bigC = sm.getString("bigC");
	String previous = sm.getString("previous");
	String cloudHostId = sm.getString("cloudHostId");
	String cloudHostName = sm.getString("cloudHostName");
	String cloudHostAlias = sm.getString("cloudHostAlias");
	String cloudHostDesc = sm.getString("cloudHostDesc");
	String cloudDisk = sm.getString("cloudDisk");
	String cloudDiskTip = sm.getString("cloudDiskExtendTip");
	String applyReason = sm.getString("applyReason");
	String ipAssign = sm.getString("ipAssign");
	String ipAddr = sm.getString("ipAddr");
	String netmask = sm.getString("netmask");
	String gateway = sm.getString("gateway");
	String firstDns = sm.getString("firstDns");
	String secondDns = sm.getString("secondDns");
	String apply = sm.getString("apply");
	String configInfo = sm.getString("configInfo");
	String hostType = sm.getString("hostType");
	String outLimit = sm.getString("outLimit");
	String intLimit = sm.getString("intLimit");

	String core = sm.getString("core");
	String memory = sm.getString("memory");
	String Static = sm.getString("Static");
	String disk = sm.getString("harddisk");
	String name = sm.getString("name");
	String desc = sm.getString("desc");
	String processing = sm.getString("processing");
	String operaSystem = sm.getString("operaSystem");
	String version = sm.getString("version");
	String noMonitorData = sm.getString("noMonitorData");
	String extendAttr = sm.getString("extendAttr");
	String modifyHostWorkflow= sm.getString("modifyHostWorkflow");
	String nameNoChRange = sm.getString("nameNoChRange");
	String aliasNoChRange = sm.getString("aliasNoChRange");
	String descriptionRange = sm.getString("descriptionRange");
	String reasonRange = sm.getString("reasonRange");
	String notNumAndLetter = sm.getString("notNumAndLetter");
	String noDataShow = sm.getString("noDataShow");
	String templateMust = sm.getString("templateMust");
	String templateOnly = sm.getString("templateOnly");
	String ipTip = sm.getString("ipTip");
	String ipMaskTip = sm.getString("ipMaskTip");
	String ipMaskOutOfRangeMsgTip = sm.getString("ipMaskOutOfRangeMsgTip");
	String nullTip = sm.getString("nullTip");
	String isRename = sm.getString("sameVmOrTemName");
	String domainPreName =(String)request.getSession().getAttribute("domainPreName");
	String hasPreName=sm.getString("hasPreName",domainPreName);
	String maxLength = sm.getString("maxLength");
	String sameAsFirst=sm.getString("sameAsFirst");
	String titleNoChRange = sm.getString("titleNoChRange");
	String datetimepickerJsPath = sm.getString("datetimepickerJsPath");
	String expireDate = sm.getString("expireDate");
	String clean = sm.getString("clean");
	String linuxOS1 = sm.getString("linuxOS1");
	String linuxOS2 = sm.getString("linuxOS2");
	String zhongbiaoV7OS64 = sm.getString("zhongbiaoV7OS64");
	String zhongbiaoV5OS32 = sm.getString("zhongbiaoV5OS32");
	String neoShineDeskV4OS32 = sm.getString("neoShineDeskV4OS32");
	String neoShineServerV4OS64 = sm.getString("neoShineServerV4OS64");
	String neoShineServerV3OS64 = sm.getString("neoShineServerV3OS64");
	String yiminServersOS64 = sm.getString("yiminServersOS64");
	String yiminServersOS32 = sm.getString("yiminServersOS32");
	String cvmCasOS64 = sm.getString("cvmCasOS64");
	String linxTech64 = sm.getString("linxTech64");
	String linxTech32 = sm.getString("linxTech32");
	Object loginInfo=request.getSession().getAttribute("loginInfo");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%=modifyHostWorkflow%></title>

<script type="text/javascript" src="js/applyVm.js"></script>
</head>
<body>
  <input id="notNumAndLetter" type="hidden" value="<%=notNumAndLetter%>">
  <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength" type="hidden" value="<%=maxLength%>">
  <input id="nameNoChRange" type="hidden" value="<%=nameNoChRange%>">
  <input id="aliasNoChRange" type="hidden" value="<%=aliasNoChRange%>">
  <input id="descriptionRange" type="hidden" value="<%=descriptionRange%>">
  <input id="reasonRange" type="hidden" value="<%=reasonRange%>">
  <input id="ipTip" type="hidden" value="<%=ipTip%>">
  <input id="ipMaskTip" type="hidden" value="<%=ipMaskTip%>">
  <input id="ipMaskOutOfRangeMsgTip" type="hidden" value="<%=ipMaskOutOfRangeMsgTip%>">
  <input id="sameAsFirst" type="hidden" value="<%=sameAsFirst%>">
  <input id="isRename" type="hidden" value="<%=isRename%>">
  <input id="hasPreName" type="hidden" value="<%=hasPreName%>">
  <input id="preName" type="hidden" value="<%=domainPreName%>">
  <input id="titleNoChRange" type="hidden" value="<%=titleNoChRange%>">
  <input id="publicCloudType" type="hidden" value="">
<!--    标记是修改页面 -->
   <input id="updateMark" type="hidden" value="updateMark">
   <!--    关联的扩展字段 -->
   <input id="rsVmWorkflowAppendId" type="hidden" value="">
   <input id="enableAdjustSetting" type="hidden">
   <input id="templateId" type="hidden">
   <input id="linuxOS1" type="hidden" value="<%=linuxOS1%>">
  <input id="linuxOS2" type="hidden" value="<%=linuxOS2%>">
  <input id="zhongbiaoV7OS64" type="hidden" value="<%=zhongbiaoV7OS64%>">
  <input id="zhongbiaoV5OS32" type="hidden" value="<%=zhongbiaoV5OS32%>">
  <input id="neoShineDeskV4OS32" type="hidden" value="<%=neoShineDeskV4OS32%>">
  <input id="neoShineServerV4OS64" type="hidden" value="<%=neoShineServerV4OS64%>">
  <input id="neoShineServerV3OS64" type="hidden" value="<%=neoShineServerV3OS64%>">
  <input id="yiminServersOS64" type="hidden" value="<%=yiminServersOS64%>">
  <input id="yiminServersOS32" type="hidden" value="<%=yiminServersOS32%>">
  <input id="cvmCasOS64" type="hidden" value="<%=cvmCasOS64%>">
  <input id="linxTech64" type="hidden" value="<%=linxTech64%>">
  <input id="linxTech32" type="hidden" value="<%=linxTech32%>">
  <div id="modal" class="modal"  style="position: absolute; top:50%; margin-top:-300px;left:50%;margin-left:-500px;" >
			<div class="modal-header" style="cursor:move">
				<h5><%=modifyHostWorkflow%></h5>
				<div id="modal-close"><span class="single-word-icon"></span></div>
			</div>
			<div id="" class="modal-content">
				<div class="run-instances">
					<div class="wizard" style="width: 599px;">
						<ol class="wizard-nav">
						<li class="current step1"><span>
								<hr> 1 </span><%=selectTemplate%> </li>
						<li class="step2"><span>
								<hr> 2 </span><%=selectType%> </li>
						<li class="step3"><span>
								<hr> 3 </span><%=baseParam%></li>
						<li class="step4"><span>4</span><%=setNetwork%> </li>
						<li class='step5' style="display:none"><span>5</span><%=extendAttr%></li>
					</ol>
						<div class="wizard-content" style="width: 599px; height: 470px;">
							<div class="steps">
								<form class="form form-horizontal">
                             <!--1、选择模板 -->
									<div class="step step-1" style="width: 599px;">
										<div class="step-inner" style="height:390px;">
											<div id="toolbarTip" class="toolbar" data-toggle="tooltip" title="<%=templateMust%>" data-placement="right"
														  data-trigger="manual">
												<a id="template-pre-tab" href="javascript:void(0)" class="tab-item template-pre current"><span class="wordIcon">A</span><%=preDefined%></a> 
												<c:if test="${sessionScope.hasCVMResource}">
												    <a id="template-custom-tab" href="javascript:void(0)" class="tab-item template-custom"><span class="wordIcon">h</span><%=userDefined%></a>
												</c:if>
											</div>
											<div class="list-wrapper">
												<table id="table-template" style="height:350px;width:500px"></table>
												<div id="operSystemDiv" class="item" style="display:none">
													<div class="control-label"><%=operaSystem%></div>
													<div class="controls">
														<label class="radio inline"> <input type="radio" name="operName" value="Windows" checked onclick="checkOper(this)">Microsoft Windows </label>
														<label class="radio inline"> <input type="radio" name="operName" value="Linux" onclick="checkOper(this)"> Linux </label>
														<label class="radio inline"> <input type="radio" name="operName" value="Unix" onclick="checkOper(this)"> Unix </label>
													</div>
												</div>
												<div id="versionDiv" class="item" style="display:none">
													<div class="control-label"><%=version%></div>
													<div class="controls">
														<select id="versionSelect" onchange="changeVersionTd(this)">
															<option>Microsoft Windows Server 2016(64-bit)
															<option>Microsoft Windows Server 2012
															<option>Microsoft Windows Server 2012 R2
															<option>Microsoft Windows Server 2008 R2(64-bit)
															<option>Microsoft Windows Server 2008(64-bit)
															<option>Microsoft Windows Server 2008(32-bit)
															<option>Microsoft Windows Server 2003 R2(64-bit) 
															<option>Microsoft Windows Server 2003 R2(32-bit)
															<option>Microsoft Windows Server 2003(64-bit)
															<option>Microsoft Windows Server 2003(32-bit)
															<option>Microsoft Windows 10(64-bit)
															<option>Microsoft Windows 10(32-bit)
															<option>Microsoft Windows 8.1(64-bit) 
															<option>Microsoft Windows 8.1(32-bit) 
															<option>Microsoft Windows 8(64-bit)
															<option>Microsoft Windows 8(32-bit)
															<option>Microsoft Windows 7(64-bit)
															<option>Microsoft Windows 7(32-bit)
															<option>Microsoft Windows Vista(64-bit) 
															<option>Microsoft Windows Vista(32-bit) 
															<option>Microsoft Windows XP Professional(64-bit)
															<option>Microsoft Windows XP Professional(32-bit) 
														</select>
													</div>
												</div>
											</div>
										</div>
										<div class="step-action">
											<input class="btn btn-next" type="button" value="<%=nextStep%>"
												data-dir="next">
										</div>
									</div>
									 <!--2、选择类型 -->
									<div class="step step-2" style="width: 599px;">
										<div class="step-inner" style="height:390px;">
											<div class="custom-instance-types">
												<%-- <h5><%=recommendType%> </h5>
												<div class="types">
													<div class="types-item" id="nth-child-1">
														<div class="inner" id="smallA">
															<div id="selected"><h6 class="type-name"><%=smallA%></h6> </div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-2" >
														<div class="inner" id="smallB">
															<div id="selected"><h6 class="type-name"><%=smallB%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-3">
														<div class="inner" id="smallC">
															<div id="selected"><h6 class="type-name"><%=smallC%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-4">
														<div class="inner" id="middleA">
															<div id="selected"><h6 class="type-name" ><%=middleA%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-5">
														<div class="inner" id="middleB">
															<div id="selected"><h6 class="type-name"><%=middleB%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-6">
														<div class="inner" id="middleC">
															<div id="selected"><h6 class="type-name"><%=middleC%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-7">
														<div class="inner" id="bigA">
															<div id="selected"><h6 class="type-name"><%=bigA%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-8">
														<div class="inner" id="bigB">
															<div id="selected"><h6 class="type-name"><%=bigB%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
													<div class="types-item" id="nth-child-9">
														<div class="inner" id="bigC">
															<div id="selected"><h6 class="type-name"><%=bigC%></h6></div>
														</div>
														<div class="types-item-line"></div>
													</div>
												</div> --%>
												<div class="cpu">
													<h5>CPU</h5>
													<div id="cpu" class="options">
														<div class="types-item-cpu selected">
															<div data-value="1" class="types-options cpu-options ">1<%=core%></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-cpu">
															<div data-value="2" class="types-options cpu-options ">2<%=core%></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-cpu hide-block">
															<div id="cpu-threed" data-value="" class="types-options cpu-options "></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-cpu">
															<div data-value="4" class="types-options cpu-options ">4<%=core%></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-cpu hide-block">
															<div id="cpu-five-seven" data-value="" class="types-options cpu-options "></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-cpu">
															<div data-value="8" class="types-options cpu-options ">8<%=core%></div>
															<div class="types-item-line"></div>
														</div>
 														<div class="types-item-cpu hide-block">
															<div id="cpu-more-eight" data-value="" class="types-options cpu-options "></div>
															<div class="types-item-line"></div>
													</div>
												</div>
												</div>
												<div class="memory">
													<h5><%=memory%></h5>
													<div id="momory" class="options">
														<div class="types-item-memory hide-block">
															<div id="memory-low-1G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory selected">
															<div data-value="1024" class="types-options memory-options">1GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-1G-2G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="2048" class="types-options memory-options">2GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-2G-4G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="4096" class="types-options memory-options">4GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-4G-6G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="6144" class="types-options memory-options">6GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-6G-8G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="8192" class="types-options memory-options">8GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-8G-12G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="12288" class="types-options memory-options">12GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-12G-16G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="16384" class="types-options memory-options">16GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-16G-24G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="24576" class="types-options memory-options">24GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-24G-32G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory">
															<div data-value="32768" class="types-options memory-options">32GB</div>
															<div class="types-item-line"></div>
														</div>
														<div class="types-item-memory hide-block">
															<div id="memory-more-32G" data-value="" class="types-options memory-options"></div>
															<div class="types-item-line"></div>
													</div>
												</div>
												</div>
										<div class="storage">
											<h5><%=disk%></h5>
											<div id="storage" class="options">
												<div class="types-item-storage selected">
													<div data-value="10" class="types-options storage-options ">10GB</div>
													<div class="types-item-line"></div>
												</div>
												<div class="types-item-storage">
													<div data-value="20" class="types-options storage-options">20GB</div>
													<div class="types-item-line"></div>
												</div>
												<div class="types-item-storage">
													<div data-value="50" class="types-options storage-options ">50GB</div>
													<div class="types-item-line"></div>
												</div>
												<div class="types-item-storage">
													<div data-value="100" class="types-options storage-options ">100GB</div>
													<div class="types-item-line"></div>
												</div>
												<div class="types-item-storage">
													<div data-value="200" class="types-options storage-options ">200GB</div>
													<div class="types-item-line"></div>
												</div>
												<div class="types-item-storage">
													<div data-value="500" class="types-options storage-options ">500GB</div>
													<div class="types-item-line"></div>
												</div>
											</div>
										</div>
												
											</div>

										</div>
										<div class="step-action">
											<input class="btn btn-prev" type="button" value="<%=previous%>" onclick="stepTwoPre()"
												data-dir="prev"> 
											<input class="btn btn-next" type="button" value="<%=nextStep%>" data-dir="next">
										</div>
									</div>
									<!--3、基本参数 -->
									<div class="step step-3" style="width: 599px;">
										<div class="step-inner" style="height:390px;">
											<div class="info">
											
												<div class="item" name="cas_flag">
													<div class="control-label"><%=cloudHostName%><span style="color:red">*</span></div>
													<div class="controls">
														<input id="titleId" type="text" value="" name="instance_name" data-fieldLen="64">
													</div>
												</div>
													
												<div class="item" name="vmware_flag">
													<div class="control-label"><%=cloudHostId%><span style="color:red">*</span></div>
													<div class="controls">
														<input id="domainNameId" type="text" value="" name="instance_name" data-fieldLen="64">
													</div>
												</div>
													
												<div class="item">
													<div class="control-label"><%=cloudHostDesc%></div>
													<div class="controls">
														<textarea id="descId"  name="instance_name" 
														  data-fieldLen="120" style="resize:none" ></textarea>
													</div>
												</div>
												
												<!-- 云硬盘 -->
												<div id="extendCloudDiskDiv" class="item" name="cas_flag">
													<div class="control-label">
														   <%=cloudDisk %><span style="color: red"></span>
													</div>
													<div class="controls">
														 <input id="extendCloudDisk" class="easyui-numberspinner" data-options="min:1,max:1024" 
														     style="width:268px;height:36px"></input>&nbsp;GB
														 <span class="icon-help-gray" style="margin-left:10px;vertical-align:sub" title="<%=cloudDiskTip%>"></span>
													</div>
												</div>
												
												<div class="item">
													<div class="control-label"><%=applyReason%><span style="color:red">*</span></div>
													<div class="controls">
														<textarea id="applyReasonId" name="instance_name" 
														  data-fieldLen="126" style="resize:none"></textarea>
													</div>
												</div>
												<div class="item">
													<div class="control-label"><%=expireDate%><span style="color:red">&nbsp;</span></div>
													<div class="controls">
														<input id="expireDateId"  style="border:1px solid #0081c2;width:268px;height:44px;" readonly="readonly">
														<input class="btn btn-primary" type="button" value="<%=clean%>" onclick="cleanDate()">
													</div>
												</div>
											</div>
										</div>
										<div class="step-action">
											<input class="btn btn-prev" type="button" value="<%=previous%>"
												data-dir="prev"> <input class="btn btn-next"
												type="button" value="<%=nextStep%>" data-dir="next">
										</div>
									</div>
									<!--4、设置网络 -->
									<div class="step step-4" style="width: 599px;">
										<div class="step-inner" style="height:390px;">
										<div class="info">
												<div class="item">
													<div class="control-label"><%=ipAssign%><span style="color:red">*</span></div>
													<div class="controls">
														<label class="radio inline"> <input type="radio" name="ipconfig" value="0" onclick="checkRaido(this)"> DHCP </label>
														<label class="radio inline"> <input type="radio" name="ipconfig" value="1" onclick="checkRaido(this)"> <%=Static%> </label>
													</div>
												</div>
												<div id="ipItemDiv" class="item" style="display:none">
													<div class="control-label"><%=ipAddr%><span style="color:red">*</span></div>
													<div class="controls">
														<input id="ipId" type="text" value="" name="instance_name">
													</div>
												</div>
												<div id="maskItemDiv" class="item" style="display:none">
													<div class="control-label"><%=netmask%><span style="color:red">*</span></div>
													<div class="controls">
														<input id="maskId" type="text" value="" name="instance_name">
													</div>
												</div>
												<div id="gatewayItemDiv" class="item" style="display:none">
													<div class="control-label"><%=gateway%></div>
													<div class="controls">
														<input id="gatewayId" type="text" value="" name="instance_name">
													</div>
												</div>
												<div id="dnsItemDiv" class="item" style="display:none">
													<div class="control-label"><%=firstDns%></div>
													<div class="controls">
														<input id="firstDnsId" type="text" value="" name="instance_name">
													</div>
												</div>
												<div id="secDnsItemDiv" class="item" style="display:none">
													<div class="control-label"><%=secondDns%></div>
													<div class="controls">
														<input id="secondDnsId" type="text" value="" name="instance_name">
													</div>
												</div>
												
											</div>
										</div>
										<div class="step-action">
											<input class="btn btn-prev" type="button" value="<%=previous%>"
												data-dir="prev">
											<input class="btn btn-primary" style="display:none" type="button" value="<%=apply%>" data-dir="next" onclick="updateWorkflow()">
											<input class="btn btn-next" style="display:none" type="button" value="<%=nextStep%>" data-dir="next">
										</div>
									</div>
									<!--5、扩展信息 -->
									<div class="step step-5" style="width: 599px;display:none">
										<div class="step-inner" style="height: 390px;">

										<div class="info">

											<!-- Tab panes -->
											<div class="tab-content" style="min-height: 340px">
												<div class="tab-pane active" id="Extend0"></div>
												<div class="tab-pane" id="Extend1"></div>
												<div class="tab-pane" id="Extend2"></div>
												<div class="tab-pane" id="Extend3"></div>
												<div class="tab-pane" id="Extend4"></div>
												<div class="tab-pane" id="Extend5"></div>
												<div class="tab-pane" id="Extend6"></div>
											</div>
											<!-- Nav tabs -->
											<ul class="nav nav-tabs" id="navId">
												<li id="forwardToPrevTab" class="topGray"><a onclick="forwardToPrevTab()">
												</a>
												</li>
												<li class="no-show active"><a href="#Extend0"
													data-toggle="tab"></a>
												</li>
												<li class="no-show"><a href="#Extend1"
													data-toggle="tab"></a>
												</li>
												<li class="no-show"><a href="#Extend2"
													data-toggle="tab"></a>
												</li>
												<li class="no-show"><a href="#Extend3"
													data-toggle="tab"></a>
												</li>
												<li class="no-show"><a href="#Extend4"
													data-toggle="tab"></a>
												</li>
												<li class="no-show"><a href="#Extend5"
													data-toggle="tab"></a>
												</li>
												<li class="no-show"><a href="#Extend6"
													data-toggle="tab"></a>
												</li>
												<li id="forwardToNextTab" class=""><a onclick="forwardToNextTab()">
												</a>
												</li>
											</ul>


										</div>
									</div>
									<div class="step-action">
										<input class="btn btn-prev" type="button"
											value="<%=previous%>" data-dir="prev"> <input
											class="btn btn-primary" type="button" value="<%=apply%>"
											data-dir="next" onclick="updateWorkflow()">
									</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div class="illustrate">
						<h4><%=configInfo%></h4>
						    <table class="table td" style="width:350px;height:auto;">
						      <tbody>
						        <tr>
						            <td class="td" style="width:30%"><%=template%></td> 
						            <td id="template" class="td"  style="width:70%"></td>
						        </tr>
						        <tr>
						            <td class="td"  style="width:30%"><%=operaSystem%></td>
						            <td id="operaSystemTd" class="td"  style="width:70%"></td>
						        </tr>
						        <tr>
						            <td class="td"  style="width:30%"><%=version%></td>
						            <td id="versionTd" class="td"  style="width:70%"></td>
						        </tr>
						        <tr>
						            <td class="td"  style="width:30%">CPU</td>
						            <td id="cputd" class="td"  style="width:70%"></td>
						        </tr>
						        <tr>
						            <td class="td"  style="width:30%"><%=memory%></td> 
						            <td id="momorytd" class="td"  style="width:70%"></td>
						        </tr>
						         <tr id="storagetr">
						            <td class="td"  style="width:30%"><%=disk%></td> 
						            <td id="storagetd" class="td" data-value='' style="width:70%"></td>
						        </tr>
							    <tr id="cloudDisktr">
							         <td class="td"  style="width:30%"><%=cloudDisk%></td> 
							         <td id="cloudDisktd" class="td" data-value='' style="width:70%"></td>
							    </tr>
						       </tbody>
						    </table>
					</div>
				</div>
			</div>
		</div>
<script type="text/javascript">
$(document).ready(function(){
	var loginInfo = '<%=loginInfo%>';
	if (loginInfo == 'null') {
		window.location.replace("login.jsp");
	}else{
		if($("#publicCloudType").val()=="3"){
			$("#domainNameId").bind("blur",checkVcenterPreName);
			$("#domainNameId").bind("blur",checkDomainReName);
			$("#domainNameId").bind("keyup",checkVcenterDomainName);
		}
		$('#expireDateId').datetimepicker({lang:'<%=datetimepickerJsPath%>',format:'Y-m-d',minDate:'today',timepicker:false, closeOnDateSelect:true});
		$("#template").html(buildToolTip(""));
	}

});
function cleanDate() {
	$('#expireDateId').val('');
}
//需要提交的数据
var templateName = "";
var templateDesc = "";
var cpu = "";
var memory = "";
var templte_cpu="";
var templte_memory="";
var templte_memoryStr="";
var memory_GB="";
var memory_value="";
//自定义配置的上次数据
var define_cpu="";
var define_memory="";
var define_storage="";

//预定义模板
var templatePreData={
	url : 'servlet/vmList?way=getTemplate',
	singleSelect : true,
	fitColumns:true,
	onClickRow:function(rowIndex, rowData){
		var row = $("#table-template").datagrid("getSelected");
		$("#templateId").val(row.id);
		templateName = row.name;
		templateDesc = row.description;
		
		// 只有cas支持云硬盘、防病毒
		var publicCloudType = row.publicCloudType;
		$("#publicCloudType").val(publicCloudType);
		if(publicCloudType == "2"){	
			$("#extendCloudDiskDiv").show();
			$("#cloudDisktr").show();
			$("#enableAntivirusId").show();
			
			$("div[name='cas_flag']").show();
			$("div[name='vmware_flag']").hide();
		} else {
		    $("#extendCloudDiskDiv").hide();
		    $("#cloudDisktr").hide();
		    $("#enableAntivirusId").hide();
		    
		    $("div[name='cas_flag']").hide();
			$("div[name='vmware_flag']").show();
		}
		
		$("#template").html(templateName);
		var system = row.system;
		$("#template").html(buildToolTip(templateName)); 
		$("div.itemtooltip").jtooltip();
		if (system == 0) {
			$('#operaSystemTd').html('Windows');
		} else if (system == 1) {
			$('#operaSystemTd').html('Linux');
		}
		var osVersion = row.osVersion;
		if (typeof osVersion != 'undefined') {
		    $("#versionTd").html(osVersion);
		}
		var cpu = row.cpu;
		if (typeof cpu != 'undefined') {
			$("#cputd").html(cpu+ "<%=core%>");
			$("#cputd").attr("data-value", cpu);
		}
		templte_cpu=row.cpu;
		var memoryStr = row.memoryStr;
		if (typeof memoryStr != 'undefined') {
		   $("#momorytd").html(memoryStr);
		}
		$("#momorytd").attr("data-value", row.memory);
		templte_memoryStr=row.memoryStr;
		
		//模板显示磁盘大小
		$("#storagetd").html('');
		if (row.storageCapacity && row.storageCapacity < 1024) {
		    var storageStr = row.storageCapacity + 'MB';
		    $("#storagetd").html(storageStr);
		} else if (row.storageCapacity && row.storageCapacity >= 1024) {
		    var storageGB = row.storageCapacity / 1024;
			$("#storagetd").html(storageGB.toFixed(2) + 'GB');
		}

		templte_memory=row.memory;
		if (templte_memory && templte_memory >= 1024)
    	{
			translateMemory(templte_memory);
			$("#momorytd").html(memory_GB+"GB");
			$("#momorytd").attr("data-value", memory_value);
    	} else if (templte_memory && templte_memory >= 0){
    		$("#momorytd").attr("data-value", templte_memory);
    		$("#momorytd").html(templte_memory+"MB");
    	}
	},
	columns : [ [{
		field : 'id',
		title : 'ID',
		width : 0,
		hidden:true
	 }, 
	 {
		field : 'name',
		title : '<%=name%>',
		formatter:showTitle,
		width : 200
	 },
	 {
		field : 'description',
		title : '<%=desc%>',
		formatter:showTitle,
		width : 300
	} ] ],
	pagination : false
};

	function showTitle(value,rowData,rowIndex){
		  if (typeof value != 'undefined') {
			 var tempValue = value;
			 value = toBreakWord(value, 30);
		 	 tempValue = toAddEllipsis(value, 20);
		 	 return  "<div class='itemtooltip' style='nowrap:false;word-break:break-all '>"+tempValue+
		 	 "<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
		 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
		 	 " </div></div>";
		  }
	};
	function buildToolTip(value){
  		var val = value;
	 	value = toBreakWord(value, 30);
	 	var tempValue = toAddEllipsis(value, 30);
		return "<div class='itemtooltip' style='white-space:nowrap; overflow:hidden;text-overflow:ellipsis;' valAttr='"+val+"'><span>"+tempValue+
	 	 "</span><div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
	 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
	 	 " </div></div>";
	}

//绑定申请虚拟机按钮
//下一步
	var nextStep=function(){
		var nextLeft=parseInt($(".steps").css("left").slice(0,-2))-599;
		var stepNum=nextLeft/(-599);
		if (stepNum == 3) {
			var condition=$("#publicCloudType").val()=="3"?checkVcenterDomainName():checkTitle();
			condition=checkReason()&&condition;
			condition=checkDescription()&&condition;
			if($("#publicCloudType").val()=="3"){
				checkDomainReName();
				checkVcenterPreName();
			}
			else{
				checkPreName();
			}
			if(condition&&!$("#domainNameId").hasClass("wrong-border")&&!$("#titleId").hasClass("wrong-border")){
				$(".steps").animate({left:nextLeft+"px"});
			}else{
				stepNum-=1;//三个有一个没有填不让下一步
			}
		}else if (stepNum ==1){
			var cloudType = $("#publicCloudType").val();
			// VCENTER 模板
			if (cloudType == '3' && $("#template .itemtooltip").find("span").html() == "") {
				stepNum-=1;//没有模板或者系统信息不让下一步
				$("#toolbarTip").attr("title",'<%=templateOnly%>');
				$("#toolbarTip").tooltip('show');
				$("#toolbarTip + div.tooltip").css('left','100px');
			} else	if($("#operaSystemTd").html()==""&&$("#versionTd").html()==""&&$("#template .itemtooltip").find("span").html()==""){
				stepNum-=1;//没有模板或者系统信息不让下一步
				$("#toolbarTip").tooltip('show');
			}else{
				if($("#template .itemtooltip").find("span").html() == ""){
					$.ajax({
						type : "GET",
						dataType : "json",
						url : "servlet/workFlowServlet?way=queryApplyVmExtend",
						success : function(result) {
							if (result != null && typeof result != 'undefined') {
								if(result.total>0){
									reformSteps();
									if($("#navId li:eq(1)").hasClass("no-show")){
										formExtend(result);
									}
								}else{
									restoreSteps();
								}
							}
						},
			  			error : function(xhr, textStatus, errorThrown) {
			  				// hideWait();
			  			}
					});		
				}else{
					restoreSteps();
				}
				$("#toolbarTip").tooltip('hide');
				//选择了模板并且组织内不允许调整配置则跳过选择类型
				if ($("#template .itemtooltip").find("span").html() != "" && $("#enableAdjustSetting").val() == 0) {
					 $(".steps").animate({left:2*nextLeft+"px"});
					 stepNum ++;
				} else {
				   $(".steps").animate({left:nextLeft+"px"});
				   
				    //问题单：201506170387 在SSV申请云主机是，通过模板预定义申请的，取消配置硬盘大小，让其使用模板中的配置 -s10629
				    if ($("#template .itemtooltip").find("span").html() != "") {
		           		$(".storage").hide();
		        		if($("#publicCloudType").val() == "2"){	
		        			$("#extendCloudDiskDiv").show();
		        			$("#cloudDisktr").show();
		        		} else {
		        		    $("#extendCloudDiskDiv").hide();
		        		    $("#cloudDisktr").hide();
						}		
	                } else {
		            	$(".storage").show();
		            	$("#extendCloudDiskDiv").hide();
	                }
				  //点击下一步,配置详情显示面板中选中的值
					if ($("#template .itemtooltip").find("span").html() == "" && define_cpu != "") {
						templte_cpu = define_cpu;
					}
				    $("#cputd").html(templte_cpu+ "<%=core%>");
	        		$("#cputd").attr("data-value", templte_cpu);
					
	        		if (typeof templte_memory != 'undefined') {
	        		   $("#momorytd").html(templte_memoryStr);
				}
	        		$("#momorytd").attr("data-value", templte_memory);
	        		
	        		cpuAdapter();
	        		$("#cpu").children(".types-item-cpu").removeClass("selected");
	        		$("#cpu").find(".cpu-options[data-value="+templte_cpu+"]").parents(".types-item-cpu").addClass("selected");
	        		
	        		memoryAdapter();
					if ($("#template .itemtooltip").find("span").html() == "" && define_memory != "") {
						templte_memory = define_memory;
						translateMemory(templte_memory);
						$("#momorytd").html(memory_GB+"GB");
						$("#momorytd").attr("data-value", memory_value);
					}
	        		$("#momory").children(".types-item-memory").removeClass("selected");
					$("#momory").find(".memory-options[data-value="+templte_memory+"]").parents(".types-item-memory").addClass("selected");
					if ($("#template .itemtooltip").find("span").html() == "" && define_storage != "") {
						$("#storage").children(".types-item-storage").removeClass("selected");
						$("#storage").find(".storage-options[data-value="+define_storage+"]").parents(".types-item-storage").addClass("selected");
						$("#storagetd").html(define_storage+"GB");
						$("#storagetd").attr("data-value", define_storage);
				}
				}
			}	
		}else if (stepNum == 4) {
			var radios=$(".step-4 input[name=ipconfig]");
			if(radios[1].checked){
				var ips=$("#ipId, #maskId, #gatewayId, #firstDnsId, #secondDnsId");
				ips.keyup();
				contrastFirst();
				if(ips.hasClass("wrong-border")){
					stepNum-=1;
				}else{
					$(".steps").animate({left:nextLeft+"px"});
				}
			}else{
				$(".steps").animate({left:nextLeft+"px"});
			}
		}else{
			$(".steps").animate({left:nextLeft+"px"});
		}
		$(".wizard ol li").removeClass("current");
		for (var p=0;p<=stepNum;p++){
			$(".wizard ol li:eq("+p+")").addClass("current");
		}

	};
	
function cpuAdapter()
{
	clearCpu();
	var cpu_width="107px";
	if (templte_cpu && 3 == templte_cpu)
	{
	    $("#cpu-threed").parent(".types-item-cpu").removeClass("hide-block");
	    $("#cpu-threed").attr("data-value",templte_cpu);
	    $("#cpu-threed").html(templte_cpu+ "<%=core%>");
	    $(".cpu-options").css("width",cpu_width);
	} else if (templte_cpu && templte_cpu>=5 && templte_cpu <= 7)
	{
			$("#cpu-five-seven").parent(".types-item-cpu").removeClass("hide-block");
			$("#cpu-five-seven").html(templte_cpu+ "<%=core%>");
			$("#cpu-five-seven").attr("data-value",templte_cpu);
			$(".cpu-options").css("width",cpu_width);
	} else if (templte_cpu && templte_cpu > 8)
	{
			$("#cpu-more-eight").parent(".types-item-cpu").removeClass("hide-block");
			$("#cpu-more-eight").html(templte_cpu+ "<%=core%>");
			$("#cpu-more-eight").attr("data-value",templte_cpu);
			$(".cpu-options").css("width",cpu_width);
	}
}

function memoryAdapter()
{
	if (!templte_memory)
	{
		return;
	}
	clearMemory();
	var memory_width="53.5px";
	if (templte_memory >= 1024)
	{
		$("#momorytd").attr("data-value", memory_value);
		$("#momorytd").html(memory_GB+"GB");
		templte_memory=memory_value;
	} else if (templte_memory >= 0)
	{
		$("#momorytd").attr("data-value", templte_memory);
		$("#momorytd").html(templte_memory+"MB");
	}
	if (templte_memory >= 0 && templte_memory < 1024)
	{
	    $("#memory-low-1G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-low-1G").attr("data-value",templte_memory);
	    $("#memory-low-1G").html(templte_memory+"MB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 2048 && templte_memory <= 3072)
	{
		$("#memory-2G-4G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-2G-4G").attr("data-value",memory_value);
	    $("#memory-2G-4G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory && templte_memory> 4096 && templte_memory <= 5120)
	{
		$("#memory-4G-6G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-4G-6G").attr("data-value",memory_value);
	    $("#memory-4G-6G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 6144 && templte_memory <= 7168)
	{
		$("#memory-6G-8G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-6G-8G").attr("data-value",memory_value);
	    $("#memory-6G-8G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 8192 && templte_memory <= 11264)
	{
		$("#memory-8G-12G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-8G-12G").attr("data-value",memory_value);
	    $("#memory-8G-12G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 12288 && templte_memory <= 15360)
	{
		$("#memory-12G-16G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-12G-16G").attr("data-value",memory_value);
	    $("#memory-12G-16G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 16384 && templte_memory <=23552)
	{
		$("#memory-16G-24G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-16G-24G").attr("data-value",memory_value);
	    $("#memory-16G-24G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 24576 && templte_memory <= 31744)
	{
		$("#memory-24G-32G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-24G-32G").attr("data-value",memory_value);
	    $("#memory-24G-32G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	} else if (templte_memory > 32768)
	{
		$("#memory-more-32G").parent(".types-item-memory").removeClass("hide-block");
	    $("#memory-more-32G").attr("data-value",memory_value);
	    $("#memory-more-32G").html(memory_GB+"GB");
	    $(".memory-options").css("width",memory_width);
	}
}

function stepTwoPre()
{
	clearCpu();
	clearMemory();
	if ($("#template .itemtooltip").find("span").html() == "") {
		define_cpu = $("#cpu").children(".selected").children(0).attr("data-value");
		define_memory = $("#momory").children(".selected").children(0).attr("data-value");
		define_storage = $("#storage").children(".selected").children(0).attr("data-value");
	}
}

function clearCpu()
{
	$(".cpu-options").css("width","133.75px");
	$("#cpu-threed").parent(".types-item-cpu").addClass("hide-block");
	$("#cpu-five-seven").parent(".types-item-cpu").addClass("hide-block");
	$("#cpu-more-eight").parent(".types-item-cpu").addClass("hide-block");
}

function clearMemory()
{
	$(".memory-options").css("width","59.44px");
	$("#memory-low-1G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-1G-2G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-2G-4G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-4G-6G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-6G-8G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-8G-12G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-12G-16G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-16G-24G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-24G-32G").parent(".types-item-memory").addClass("hide-block");
	$("#memory-more-32G").parent(".types-item-memory").addClass("hide-block");
}

function translateMemory(memoryValue)
{
	memory_GB=Math.ceil(memoryValue/1024);
	memory_value=memory_GB*1024;
}

function updateWorkflow() {
	var row = $("#workflowListId").datagrid("getSelected");
	if (!row) {
		return;
	}
	var extendItems=$(".step-5 .info .tab-content").find("spinner,input,select");
	var extendXml='<vmWorkflowAppend>'+ "<id>" + $("#rsVmWorkflowAppendId").val()+ "</id>" +"<vmWorkflowId>"+row.id+"</vmWorkflowId>";;
	var extendName="";
	for (var i=0;i<extendItems.length;i++)
	{
		extendName=extendItems[i].name;
		extendName=extendName.substr(extendName.length-2,extendName.length-1);
		extendXml+="<column"+extendName+">"+extendItems[i].value+"</column"+extendName+">";
	}
	extendXml+='</vmWorkflowAppend>';
	
	var xml = '';
	xml += "<vmWorkflow>";
	xml +="<id>" + row.id+ "</id>";
	/* if (templateName == "") {
		templateName=$("#template").html();
		$("#template").html().replace('%','%25').replace('\\','%5c').replace('/','%2f');
	} */
	templateName = $("#template .itemtooltip").attr("valAttr").replace('%','%25').replace('\\','%5c').replace('/','%2f');
	xml += "<templateName>" + templateName + "</templateName>";
	if (templateName == "") {
		xml += "<type>3</type>";
		extendItems.keyup();
		var wrongList =extendItems.parents(".item").find(".control-label").hasClass("wrong-word-color");
		if(wrongList){
			$.each(extendItems,function(i,item){
				if($(item).parents(".item").find(".control-label").hasClass("wrong-word-color")){
					var paneId=$(item).parents(".tab-pane").attr("id");
					var index=paneId.charAt(paneId.length-1);
					$("#navId li:eq("+(parseInt(index)+1)+") a").click();
					return false;
				}
			});
			return;
		}
	} else {
		xml += "<type>1</type>";
	}
	var radios=$(".step-4 input[name=ipconfig]");
	if(radios[1].checked){
		var ips=$("#ipId, #maskId, #gatewayId, #firstDnsId, #secondDnsId");
		ips.keyup();
		//修改问题单 201405260275 首选DNS不能与备选DNS相同 by s10462 2014/6/6
		contrastFirst();
		if(ips.hasClass("wrong-border")){
			return;
		}
	}
	var cpu = $("#cputd").attr("data-value");
	var memory = $("#momorytd").attr("data-value");
	var memoryHtml = $("#momorytd").html();
	var memoryInit = memoryHtml.substring(0, memoryHtml.length-2);
	var memoryUnit = memoryHtml.substring(memoryHtml.length-2);
	// 磁盘容量可选  add by y10496 
	var storageHtml = $("#storagetd").html();
	var storage = storageHtml.substring(0, storageHtml.length-2);
	//模板扩展云硬盘	
	if ($("#template .itemtooltip").find("span").html() != "" && $("#publicCloudType").val() == "2") {
	    var extendDiskValue = $("#extendCloudDisk").numberspinner('getValue');
	    storage = extendDiskValue;
	}
	xml += "<osVersion>" + $("#versionTd").html() + "</osVersion>";
	xml += "<cpuCores>" + cpu + "</cpuCores>";
	xml += "<cpuSockets>1</cpuSockets>";
	xml += "<memory>" + memory + "</memory>";
	xml += "<memoryInit>" + memoryInit + "</memoryInit>";
	xml += "<memoryUnit>" + memoryUnit + "</memoryUnit>";
	xml += "<storage>" + storage + "</storage>";
	xml += "<domainId>" + $("#templateId").val() + "</domainId>";
	if ($("#domainNameId").val() != null && $("#domainNameId").val() != "undefined") {	
		xml += "<domainName>" + $("#domainNameId").val() + "</domainName>";
	}
	xml += "<title>";	
	if($("#titleId").val()==""){
		xml += $("#domainNameId").val(); 
		
	}else{
		xml += $("#titleId").val(); 
	}
	xml += "</title>";
	xml += "<description>" + $("#descId").val() + "</description>";
	xml += "<applyReason>" + $("#applyReasonId").val() + "</applyReason>";
	xml += "<expireDate>" + $("#expireDateId").val() + "</expireDate>";
	xml += "<assignType>" + $('input:radio[name="ipconfig"]:checked').val()
			+ "</assignType>";
	xml += "<ip>" + $("#ipId").val() + "</ip>";
	xml += "<mask>" + $("#maskId").val() + "</mask>";
	xml += "<gatyway>" + $("#gatewayId").val() + "</gatyway>";
	xml += "<firstDns>" + $("#firstDnsId").val() + "</firstDns>";
	xml += "<secondDns>" + $("#secondDnsId").val() + "</secondDns>";
	xml += "<status>0</status>";
	xml += "</vmWorkflow>";

	$.ajax({
		type : "POST",
		dataType : "json",
		url : "servlet/workFlowServlet?way=updateWorkflow",
		data : "xml=" + xml+"&extendXml="+extendXml,
		beforeSend : function(xhr) {
			showWait("<%=processing%>" ,999999);
		},
		success : function(result) {
			hideWait();
			if (result != null && typeof result != 'undefined') {
				$("#workflowListId").datagrid('reload');
				if (result.success) {
					$(".window-overlay").css("display", "none");
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
		},
		error : function() {
			hideWait();
		}
	});
}
//第一步 模板切换
var changeTemplate = function(){
	/*修改问题单201703250235，【CAS 3.0鉴定】【V300R003B01D020】【测试中心】【SSV】【云电子流】修改云电子流“申请”页面已驳回云电子流，关闭修改页面后“申请”变为灰色*/
	$(".tab-item[class^='tab-item template']").removeClass("current");
	$(this).addClass("current");
	var tabClass=$(this).hasClass("template-custom");
	if(tabClass){
		$(".list-wrapper .datagrid").hide();
		$("#operSystemDiv, #versionDiv").show();
		$("#template .itemtooltip").find("span").html("");
		$("#template .itemtooltip").attr("valAttr", "");
		$.each($("#operSystemDiv input[name=operName]"),function(i,r){
			if(r.checked){
				$("#operaSystemTd").html(r.value);
			}
		});
        // 问题单: 201704260160 ssv用户修改被cic操作员驳回的申请自定义云主机电子流，右侧配置详情中 cpu和内存没有显示申请时的值
        
        templte_cpu=$("#cputd").attr("data-value");
		$("#versionTd").html($("#versionSelect").val());
        if ($("#cputd").attr("data-value") === undefined) {
		$("#cputd").html("1<%=core%>");
            $("#cputd").attr("data-value", 1);
            templte_cpu=1;
        } else {
        	$("#cputd").html(templte_cpu+"<%=core%>");
        	$("#cputd").attr("data-value", templte_cpu);
        }
        
        templte_memory=$("#momorytd").attr("data-value");
        if (templte_memory && templte_memory >= 1024)
    	{
        	translateMemory(templte_memory);
			$("#momorytd").html(memory_GB+"GB");
    	} else if (templte_memory && templte_memory >= 0){
    		$("#momorytd").html(templte_memory+"MB");
    	} else  {
    		templte_memory=1024;
    		translateMemory(templte_memory);
			$("#momorytd").html(memory_GB+"GB");
    		$("#momorytd").attr("data-value",1024);
        }
        templte_memoryStr=$("#momorytd").html();
        if ($("#storagetd").attr("data-value") === undefined) {
	   	$("#storagetd").html("10GB");
		$("#storagetd").attr("data-value", "10");
        }
        // 刷新第2步中的选中值
        $("#cpu").children(".types-item-cpu").removeClass("selected");
        $("#cpu").find(".cpu-options[data-value=" + $("#cputd").attr("data-value") + "]").parents(".types-item-cpu").addClass("selected");
        $("#momory").children(".types-item-memory").removeClass("selected");
        $("#momory").find(".memory-options[data-value=" + $("#momorytd").attr("data-value") + "]").parents(".types-item-memory").addClass("selected");
		$("#storage").children(".types-item-storage").removeClass("selected");
		$("#storage").find(".storage-options[data-value="+$("#storagetd").attr("data-value")+"]").parents(".types-item-storage").addClass("selected");
		$(".storage").show();
		$("#extendCloudDiskDiv").hide();
		$("#cloudDisktr").hide();
	} else{
		$("#operaSystemTd").html("");
		$("#versionTd").html("");
		$("#operSystemDiv, #versionDiv").hide();
		$("#table-template").show();
		$("#table-template").datagrid(templatePreData);
		$("#cputd").html("");
		$("#cputd").removeAttr("data-value");
		$("#momorytd").html("");
		$("#momorytd").removeAttr("data-value");
		$("#storagetd").html("");
		$("#storagetd").removeAttr("data-value");
		$(".storage").hide();
		$("#extendCloudDisk").val('');//切换模板,云硬盘重置
		$("#extendCloudDisk").numberspinner('setValue', '');
	}
	$("#cloudDisktd").html('');
};

//型号的选择
<%-- var changeTypeItem =function(){
 	var item =$(this);
	item.siblings().removeClass("selected");
 	item.addClass("selected");
// 	var itemSel = item.find("div.inner div#selected");
// 	itemSel.css("opacity","1");
	switch(item.attr("id")) {
	    //小型A 1核 512M
	    case "nth-child-1" :
	    	cpu = 1;
	    	memory = 0.5;
	    	$("#cputd").html("1<%=core%>");
	    	$("#cputd").attr("data-value", 1);
	    	$("#momorytd").html("512MB");
	    	$("#momorytd").attr("data-value", 512);
	    	$("#cpu > .types-item-cpu :eq(0)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(0)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(0)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(0)").siblings().removeClass("selected");
	    break;	
	    //小型B 1核1G
	    case "nth-child-2" :
	    	cpu = 1;
	    	memory = 1;
	    	$("#cputd").html("1<%=core%>");
	    	$("#momorytd").html("1GB");
	    	$("#cputd").attr("data-value", 1);
	    	$("#momorytd").attr("data-value", 1024);
	    	$("#cpu > .types-item-cpu :eq(0)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(0)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(1)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(1)").siblings().removeClass("selected");
	    break;	
	    //小型C 1核2G
	    case "nth-child-3" :
	    	cpu = 1;
	    	memory = 2;
	    	$("#cputd").html("1<%=core%>");
	    	$("#momorytd").html("2GB");
	    	$("#cputd").attr("data-value", 1);
	    	$("#momorytd").attr("data-value", 2048);
	    	$("#cpu > .types-item-cpu :eq(0)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(0)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(2)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(2)").siblings().removeClass("selected");
	    break;	
	   //中型A 2核2G
	    case "nth-child-4" :
	    	cpu = 2;
	    	memory = 2;
	    	$("#cputd").html("2<%=core%>");
	    	$("#momorytd").html("2GB");
	    	$("#cputd").attr("data-value", 2);
	    	$("#momorytd").attr("data-value", 2048);
	    	$("#cpu > .types-item-cpu :eq(1)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(1)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(2)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(2)").siblings().removeClass("selected");
	    break;	
	  //中型B 2核4G
	    case "nth-child-5" :
	    	cpu = 2;
	    	memory = 4;
	    	$("#cputd").html("2<%=core%>");
	    	$("#momorytd").html("4GB");
	    	$("#cputd").attr("data-value", 2);
	    	$("#momorytd").attr("data-value", 4096);
	    	$("#cpu > .types-item-cpu :eq(1)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(1)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(3)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(3)").siblings().removeClass("selected");
	    break;	
	  //中型C 2核8G
	    case "nth-child-6" :
	    	cpu = 2;
	    	memory = 8;
	    	$("#cputd").html("2<%=core%>");
	    	$("#momorytd").html("8GB");
	    	$("#cputd").attr("data-value", 2);
	    	$("#momorytd").attr("data-value", 8192);
	    	$("#cpu > .types-item-cpu :eq(1)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(1)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(5)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(5)").siblings().removeClass("selected");
	    break;	
	  //大型A 4核4G
	    case "nth-child-7" :
	    	cpu = 4;
	    	memory = 4;
	    	$("#cputd").html("4<%=core%>");
	    	$("#momorytd").html("4GB");
	    	$("#cputd").attr("data-value", 4);
	    	$("#momorytd").attr("data-value", 4096);
	    	$("#cpu > .types-item-cpu :eq(2)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(2)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(3)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(3)").siblings().removeClass("selected");
	    break;	
	    //大型B 4核8G
	    case "nth-child-8" :
	    	cpu = 4;
	    	memory = 8;
	    	$("#cputd").html("4<%=core%>");
	    	$("#momorytd").html("8GB");
	    	$("#cputd").attr("data-value", 4);
	    	$("#momorytd").attr("data-value", 8192);
	    	$("#cpu > .types-item-cpu :eq(2)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(2)").siblings().removeClass("selected");
	    	
	    	$("#momory > .types-item-memory :eq(5)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(5)").siblings().removeClass("selected");
	    break;	
	    //大型C 4核16G
	    case "nth-child-9" :
	    	cpu = 4;
	    	memory = 16;
	    	$("#cputd").html("4<%=core%>");
	    	$("#momorytd").html("16GB");
	    	$("#cputd").attr("data-value", 4);
	    	$("#momorytd").attr("data-value", 16384);
	    	$("#cpu > .types-item-cpu :eq(2)").addClass("selected");
	    	$("#cpu > .types-item-cpu :eq(2)").siblings().removeClass("selected");	    	
	    	$("#momory > .types-item-memory :eq(7)").addClass("selected");
	    	$("#momory > .types-item-memory :eq(7)").siblings().removeClass("selected");
	    break;	
	    	
	}
// 	item.siblings().find("div.inner div#selected").css("opacity","0");
}; --%>
$("#extendCloudDisk").numberspinner({
	   onSpinUp:function(){
		   showRightResult($(this));
	   },
	   onSpinDown:function() {
		   showRightResult($(this));
	   }
});
$("#extendCloudDisk").bind("keyup",checkCloudDiskCapacity);
$("#extendCloudDisk").bind("blur",changeCloudDiskCapacityTD);

</script>
</body>
</html>
