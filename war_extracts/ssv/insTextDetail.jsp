<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c"%>
<%@ taglib uri="/WEB-INF/tld/fmt.tld" prefix="fmt"%>
<%@ taglib uri="/WEB-INF/tld/fn.tld" prefix="fn"%>
<%@ page import="com.virtual.common.StringManager"%>
<!DOCTYPE html>
<%
	/** 多语言资源。 */
	StringManager sm = StringManager.getManager(StringManager.class);

	String processing = sm.getString("cloudSafety.processing");
	String success = sm.getString("cloudSafety.success");
	String failed = sm.getString("cloudSafety.failed");

	String cloudHost = sm.getString("cloudHost");
	String cloudHostExplain = sm.getString("cloudHostExplain");
	String applayInstance = sm.getString("applayInstance");
	String start = sm.getString("start");
	String close = sm.getString("domain.shutDown");
	String moreOper = sm.getString("moreOper");
	String powoff = sm.getString("powoff");
	String mstsc = sm.getString("mstsc");
	String ssh = sm.getString("ssh");
	String instanceSnapshot = sm.getString("instanceSnapshot");

	String backup = sm.getString("backup");
	String openConsole = sm.getString("openConsole");
	String canelInstance = sm.getString("canelInstance");
	String layout = sm.getString("layout");
	String tile = sm.getString("tile");
	String icon = sm.getString("icon");
	String list = sm.getString("list");

	String name = sm.getString("name");
	String link = sm.getString("link");
	String status = sm.getString("status");
	String memory = sm.getString("memory");
	String disk = sm.getString("disk");
	String cdrom = sm.getString("cdrom");
	String floppy = sm.getString("floppy");
	String cloudHostDesc = sm.getString("cloudHostDesc");
	String cpuUtilization = sm.getString("cpuUtilization");
	String memoryUtilization = sm.getString("memoryUtilization");
	String viewType = sm.getString("viewType");
	String textType = sm.getString("textType");
	String graphType = sm.getString("graphType");
	String goBackHost = sm.getString("goBackHost");
	String os = sm.getString("os");
	String basicAttributes = sm.getString("basicAttributes");
	String createTime = sm.getString("createTime");
	String runtime = sm.getString("runtime");
	String configInfo = sm.getString("configInfo");
	String hostType = sm.getString("hostType");
	String cpuCount = sm.getString("cpuCount");
	String relatedResource = sm.getString("relatedResource");
	String firewall = sm.getString("firewall");
	String harddisk = sm.getString("harddisk");
	String network = sm.getString("network");
	String ipAddr = sm.getString("ipAddr");
	String basicNetword = sm.getString("basicNetword");
	String monitor = sm.getString("monitor");
	String realTimeData = sm.getString("realTimeData");
	String unit = sm.getString("unit");
	String space = sm.getString("space");
	String minute = sm.getString("minute");
	String percentage = sm.getString("percentage");
	String usageRate = sm.getString("usageRate");
	String noMonitorData = sm.getString("noMonitorData");
	String ipAssign = sm.getString("ipAssign");
	String running = sm.getString("running");
	String closed = sm.getString("closed");
	String stopped = sm.getString("stopped");
	String open2 = sm.getString("open2");
	String close2 = sm.getString("close2");
	String diskUsage = sm.getString("diskUsage");
	String netUsage = sm.getString("netUsage");
	String second = sm.getString("second");
	String noIpAddr = sm.getString("noIpAddr");
	String noCard = sm.getString("noCard");
	String openMore = sm.getString("openMore");

	String canelVm = sm.getString("canelVm");
	String confirmCanelVm = sm.getString("confirmCanelVm");
	String ipnotNull = sm.getString("ipnotNull");
	
	String startVmContext =sm.getString("startVmContext");
	String closeVmContext =sm.getString("closeVmContext");
	String poweroffVmContext =sm.getString("poweroffVmContext");
	String quotationLeft= sm.getString("quotationLeft");
    String quotationRight= sm.getString("quotationRight");
    String questionMark = sm.getString("questionMark");
    String throughput = sm.getString("throughput");
    String applyExpire = sm.getString("applyExpire");
    String releaseVDesktop = sm.getString("releaseVDesktop");
    String confirmReleaseVDesktop = sm.getString("confirmReleaseVDesktop");
    String spiceUri = sm.getString("spiceUri");
    String openMonitor = sm.getString("openMonitor");
    String closeMonitor = sm.getString("closeMonitor");
    
    String openMoreDisk = sm.getString("openMoreDisk");
    String closeMoreDisk = sm.getString("closeMoreDisk");
    
    String enableAntivirus = sm.getString("enableAntivirus");
	String disableAntivirus = sm.getString("disableAntivirus");
	String enableAntivirusContext = sm.getString("enableAntivirusContext");
	String disableAntivirusContext = sm.getString("disableAntivirusContext");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0;">
    <input id="startVmContext" type="hidden" value="<%=startVmContext%>">
	<input id="closeVmContext" type="hidden" value="<%=closeVmContext%>">
	<input id="poweroffVmContext" type="hidden" value="<%=poweroffVmContext%>">
	<input id="startVmTi" type="hidden" value="<%=start%>">
	<input id="closeVmTi" type="hidden" value="<%=close%>">
	<input id="poweroffVmTi" type="hidden" value="<%=powoff%>">
	<input id="processing" type="hidden" value="<%=processing%>">
	<input id="releaseVDesktop" type="hidden" value="<%=releaseVDesktop%>">
	<input id="confirmReleaseVDesktop" type="hidden" value="<%=confirmReleaseVDesktop%>">
	
<script src="js/common.js" type="text/javascript"></script>
<script src="js/instanceDetail.js" type="text/javascript"></script>
	<div class="wrapper page home" id="instance-detail">
		<div class="topbar">
			<div class="breadcrumbs">
				<a
					data-permalink=""
					href="javascript:void(0)"
					class="level"><%=cloudHost%></a>
					<input type="hidden" id="hidden-vmId" value="${rsDomain.id}">
					<input type="hidden" id="hidden-hostId" value="${rsDomain.hostId}">
					<input type="hidden" id="hidden-name" value="${rsDomain.name}">
					<input type="hidden" id="hidden-title" value="${rsDomain.title}">
					<input type="hidden" id="hidden-status" value="${rsDomain.status}">
					<input type="hidden" id="hidden-system" value="${rsDomain.system}">
					<input type="hidden" id="hidden-flag" value="${rsDomain.flag}">
					<input type="hidden" id="hidden-assignMode" value="${rsDomain.assignMode}">
					<input type="hidden" id="hidden-expireDate" value="${rsDomain.expireDateStr}">
					<input type="hidden" id="hidden-spiceUri" value="${rsDomain.spiceUri}">
					<input type="hidden" id="hidden-start" value="<%=running%>">
					<input type="hidden" id="hidden-close" value="<%=closed%>">
					<input type="hidden" id="hidden-stopped" value="<%=stopped%>">
					<input type="hidden" id="hidden-type" value="${rsDomain.publicCloudType}">
					<input type="hidden" id="hidden-applyExpire" value="<%=applyExpire%>">
					<input type="hidden" id="hidden-antivirusEnable" value="${rsDomain.antivirusEnable}">
			</div>
			<div class="view-types">
				<span class="title"><%=viewType%></span>
				<a data-type="text" href="javascript:void(0)" title="<%=textType%>" class="view-type type-text icon-text-select current"></a>
				<a data-type="graph" href="javascript:void(0)"  title="<%=graphType%>" class="view-type type-graph icon-graph-normal"></a>
				<a data-type="goback" href="javascript:void(0)" title="<%=goBackHost%>" class="view-type type-goback icon-goback-normal"></a>
			</div>
		</div>
		<div class="grid_8 description">
			<div class="detail-item">
				<div class="title">
					<h3><%=basicAttributes%></h3>
					<c:if test="${rsDomain.status != '1'}">
						<div class="dropdown">
							<a href="javascript:void(0)" class="easyui-menubutton "
								data-options="menu:'#dropdown-content'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
							<div id="dropdown-content">
							    <c:if test="${rsDomain.status != '2' && rsDomain.status != '4'}">
							    	<div id="startVmId" data-options="iconCls:'icon-startvm'" onclick="startVm()"><%=start %></div>
							  	</c:if>
							  	<c:if test="${rsDomain.status == '2' || rsDomain.status == '4'}">
							    	<div id="startVmId" data-options="iconCls:'icon-startvm'" class="divDisable"><%=start %></div>
							  	</c:if>  
							  	<c:if test="${rsDomain.status != '3' && rsDomain.status != '4'}">  
							    <div id="closeVmId" data-options="iconCls:'icon-shutdownvm'" onclick="closeVm()"><%=close%></div>
							    </c:if>  
							    <c:if test="${rsDomain.status == '3' || rsDomain.status == '4'}">  
							    <div id="closeVmId" data-options="iconCls:'icon-shutdownvm'" class="divDisable"><%=close%></div>
							    </c:if>  
							  	<c:if test="${rsDomain.status != '3'}">  
								<div id="powerOffId" data-options="iconCls:'icon-poweroffvm'" onclick="powerOff()"><%=powoff%></div>
								</c:if>  
								<c:if test="${rsDomain.status == '3'}">  
								<div id="powerOffId" data-options="iconCls:'icon-poweroffvm'" class="divDisable"><%=powoff%></div>
								</c:if>  
							  	<c:if test="${rsDomain.system == '1'}">  
							  	    <div id="mstscId" data-options="iconCls:'icon-rdp'"  class="divDisable"><%=mstsc%></div>
							  	    <c:choose> 
								  	    <c:when test="${rsDomain.status == '2'}">
								            <div id="sshId" data-options="iconCls:'icon-ssh'" onclick="ssh()"><%=ssh%></div>
								  	    </c:when>
								  	    <c:otherwise>
								  	        <div id="sshId" data-options="iconCls:'icon-ssh'" class="divDisable" ><%=ssh%></div>
								  	    </c:otherwise>
							  	    </c:choose>
								</c:if>  
								<c:if test="${rsDomain.system == '0'}">  
								     <div id="sshId" data-options="iconCls:'icon-ssh'" class="divDisable"><%=ssh%></div>
								       <c:choose> 
								  	    <c:when test="${rsDomain.status == '2'}">
								            <div id="mstscId" data-options="iconCls:'icon-rdp'" onclick="mstsc()"><%=mstsc%></div>
								  	    </c:when>
								  	    <c:otherwise>
								  	       <div id="mstscId" data-options="iconCls:'icon-rdp'"  class="divDisable"><%=mstsc%></div>
								  	    </c:otherwise>
							  	       </c:choose>
								</c:if>  
								<c:if test="${rsDomain.system != '0' && rsDomain.system != '1'}">  
								     <div id="sshId" data-options="iconCls:'icon-ssh'" class="divDisable"><%=ssh%></div>
								  	 <div id="mstscId" data-options="iconCls:'icon-rdp'"  class="divDisable"><%=mstsc%></div>
								</c:if>  
								<c:if test="${rsDomain.publicCloudType == '2'}">
									<c:if test="${sessionScope.snapshotEnabled == '1'}">
									   <c:choose> 
								  	    <c:when test="${rsDomain.assignMode == 2}">
								            <div id="snapshotId" data-options="iconCls:'icon-snapshot'" class="divDisable"><%=instanceSnapshot%></div>
								  	    </c:when>
								  	    <c:otherwise>
								  	       <div id="snapshotId" data-options="iconCls:'icon-snapshot'" onclick="snapshot()"><%=instanceSnapshot%></div>
								  	    </c:otherwise>
							  	       </c:choose>
									</c:if>
									<c:if test="${sessionScope.backupEnabled == '1'}">
									  <c:choose> 
								  	    <c:when test="${rsDomain.assignMode == 2}">
								           <div id="backupId" data-options="iconCls:'icon-backup'" class="divDisable"><%=backup%></div>
								  	    </c:when>
								  	    <c:otherwise>
								  	       <div id="backupId" data-options="iconCls:'icon-backup'" onclick="backup()"><%=backup%></div>
								  	    </c:otherwise>
							  	       </c:choose>
									</c:if>
									<c:if test="${sessionScope.vncEnabled == '1'}">
									  <div id="openConsoleId" data-options="iconCls:'icon-console'" onclick="openConsole()"><%=openConsole%></div>
									</c:if>
								</c:if>
								<c:choose> 
								  	    <c:when test="${rsDomain.assignMode == 2}">
								           <div id="canelVmId" data-options="iconCls:'icon-canelvm'" class="divDisable"><%=canelInstance%></div>
								           <div id="applyExpireId" data-options="iconCls:'icon-delay'" class="divDisable"><%=applyExpire%></div>
								           <div id="releaseId" data-options="iconCls:'icon-unlink'" onclick="releaseVDesktop()"><%=releaseVDesktop%></div>
								  	    </c:when>
								  	    <c:otherwise>
								  	       <div id="canelVmId" data-options="iconCls:'icon-canelvm'" onclick="canelVm()"><%=canelInstance%></div>
								  	       <c:choose>
									  	       <c:when test="${empty(rsDomain.expireDateStr)}">
									  	      	 	<div id="applyExpireId" data-options="iconCls:'icon-delay'" class="divDisable"><%=applyExpire%></div>
									  	       </c:when>
									  	       <c:otherwise>
										           <div id="applyExpireId" data-options="iconCls:'icon-delay'" onclick="applyExpire()"><%=applyExpire%></div>
									  	       </c:otherwise>
								  	       </c:choose>
								           <div id="releaseId" data-options="iconCls:'icon-unlink'" class="divDisable"><%=releaseVDesktop%></div>
								  	    </c:otherwise>
							  	</c:choose>
								<c:choose> 
									<c:when test="${rsDomain.publicCloudType != '2' || rsDomain.system != '0' || rsDomain.status == '4'}">
										<div id="enableAntivirusId" data-options="iconCls:'icon-antivirusopen'" class="divDisable"><%=enableAntivirus%></div>
										<div id="disableAntivirusId" data-options="iconCls:'icon-antivirusclose'" class="divDisable""><%=disableAntivirus%></div>
									</c:when>
									<c:otherwise>
										<c:choose> 
											<c:when test="${rsDomain.status == '3'}">
												<c:if test="${rsDomain.antivirusEnable == '0'}">
													<div id="enableAntivirusId" data-options="iconCls:'icon-antivirusopen'" onclick="antivirusConfig(1)"><%=enableAntivirus%></div>
													<div id="disableAntivirusId" data-options="iconCls:'icon-antivirusclose'" class="divDisable" onclick=""><%=disableAntivirus%></div>
												</c:if>
												<c:if test="${rsDomain.antivirusEnable == '1'}">
													<div id="enableAntivirusId" data-options="iconCls:'icon-antivirusopen'" class="divDisable" onclick=""><%=enableAntivirus%></div>
													<div id="disableAntivirusId" data-options="iconCls:'icon-antivirusclose'" onclick="antivirusConfig(0)"><%=disableAntivirus%></div>
												</c:if>
											</c:when>
											<c:otherwise>
												<c:if test="${rsDomain.antivirusEnable == '0'}">
													<div id="enableAntivirusId" data-options="iconCls:'icon-antivirusopen'" onclick="antivirusConfig(1)"><%=enableAntivirus%></div>
													<div id="disableAntivirusId" data-options="iconCls:'icon-antivirusclose'" class="divDisable" onclick=""><%=disableAntivirus%></div>
												</c:if>
												<c:if test="${rsDomain.antivirusEnable == '1'}">
													<div id="enableAntivirusId" data-options="iconCls:'icon-antivirusopen'" class="divDisable" onclick=""><%=enableAntivirus%></div>
													<div id="disableAntivirusId" data-options="iconCls:'icon-antivirusclose'" class="divDisable" onclick=""><%=disableAntivirus%></div>
												</c:if>
											</c:otherwise>
										</c:choose>
									</c:otherwise>
								</c:choose>
							</div>
						</div>
					</c:if>
				</div>
				<dl class="dl-horizontal">
					
					<dt><%=name%></dt>
					<dd class="needTooltip" data-ellipsis-len="12">
					 <c:if test="${rsDomain.title == null}">
					   ${rsDomain.name}
					 </c:if>
					  <c:if test="${rsDomain.title != null}">
					   ${rsDomain.title}
					 </c:if>
					</dd>
					<dt><%=cloudHostDesc%></dt>
					<dd class="needTooltip" data-ellipsis-len="12">${rsDomain.description}</dd>
					<dt><%=status%></dt>
					<dd class="running instanceStatus">
					<c:if test="${rsDomain.status == 2}">
						<%=running%>
					</c:if>
					<c:if test="${rsDomain.status == 3}">
						 <%=closed%>
					</c:if>
					<c:if test="${rsDomain.status == 4}">
						 <%=stopped%>
					</c:if>
					</dd>
					<c:if test="${rsDomain.type == 0}">
						<dt><%=createTime%></dt>
						<dd class="time">
						    <fmt:formatDate  value="${rsDomain.createDate}" type="both" pattern="yyyy-MM-dd HH:mm:ss" />
						</dd>
					</c:if>
				</dl>
			</div>
			<div class="detail-item">
				<div class="title">
					<h3><%=configInfo%></h3>
<!-- 					<div class="dropdown"> -->
<!-- 						<a href="javascript:void(0)" class="easyui-menubutton " -->
<!-- 							data-options="menu:'#dropdown-config'"></a> -->
<!-- 						<div id="dropdown-config"> -->
<!-- 						</div> -->
<!-- 					</div> -->
				</div>
				<dl class="dl-horizontal">
					<dt><%=cpuCount%></dt>
					<dd>${rsDomain.cpu}</dd>
					<dt><%=memory%></dt>
					<dd>
						 <c:if test="${not empty rsDomain.memory}">
						    <c:choose>
						        <c:when test="${rsDomain.memory>= 1048576}">
						           <fmt:formatNumber value="${rsDomain.memory/1048576}" pattern="0.00"/> TB
						        </c:when>
						        <c:when test="${rsDomain.memory>= 1024}">
						            <fmt:formatNumber value="${rsDomain.memory/1024}" pattern="0.00"/> GB
						        </c:when>
						        <c:otherwise>
						            <fmt:formatNumber value="${rsDomain.memory}" pattern="0.00"/> MB
						        </c:otherwise>
						    </c:choose>
					   </c:if>
					</dd>
					<dt><%=os%></dt>
					<dd>
					    <c:if test="${not empty rsDomain.osVersion}">
							${rsDomain.osVersion}
						</c:if>
					</dd>
				</dl>
			</div>
			<div class="detail-item">
				<div class="title">
					<h3><%=relatedResource%></h3>
<!-- 					<div class="dropdown"> -->
<!-- 						<a href="javascript:void(0)" class="easyui-menubutton " -->
<!-- 							data-options="menu:'#dropdown-source'"></a> -->
<!-- 						<div id="dropdown-source"> -->
<!-- 						</div> -->
<!-- 					</div> -->
				</div>
				<dl class="dl-horizontal">
					
					<c:forEach  items="${rsDomainFwList}" var="fw" varStatus="fstatus" >
					<dt><%=firewall%>${fstatus.index+1}</dt>
					<dd>${fw.name}
						<c:if test="${not empty fw.description}">
						/${fw.description}
						</c:if>
					</dd>
					</c:forEach>
					
					<c:forEach  items="${rsDomain.storages}" var="storage" >
					<dt>
					    <c:if test="${rsDomain.type eq 1}">${storage.diskDevice}</c:if>
						<c:if test="${storage.diskDevice eq 'disk' and rsDomain.type eq 0}"><%=disk%></c:if>
						<c:if test="${storage.diskDevice eq 'floppy' and rsDomain.type eq 0}"><%=floppy%></c:if>
						<c:if test="${storage.diskDevice eq 'cdrom' and rsDomain.type eq 0}"><%=cdrom%></c:if>
					</dt>
					<dd>
						 <c:if test="${not empty storage.capacity}">
						    <c:choose>
						        <c:when test="${storage.capacity>= 1048576}">
						           <fmt:formatNumber value="${storage.capacity/1048576}" pattern="0.00"/> TB
						        </c:when>
						        <c:when test="${storage.capacity>= 1024}">
						            <fmt:formatNumber value="${storage.capacity/1024}" pattern="0.00"/> GB
						        </c:when>
						        <c:otherwise>
						            <fmt:formatNumber value="${storage.capacity}" pattern="0.00"/> MB
						        </c:otherwise>
						    </c:choose>
					    </c:if>
					</dd>
					</c:forEach>
					<c:forEach  items="${rsDomain.networks}" var="network" varStatus="nstatus">
					<dt><%=network%>${nstatus.index+1}</dt>
					<dd> 
					${network.mac}
					<c:if test="${not empty network.ipAddr}">
						/${network.ipAddr}
					</c:if>
					</dd>
					</c:forEach>
					<c:if test="${rsDomain.assignMode == 2}">
						<dt><%=spiceUri%></dt>
						<dd>
						    <c:if test="${not empty rsDomain.spiceUri}">
							 ${rsDomain.spiceUri}
						    </c:if>
						</dd>
					</c:if>
				</dl>
			</div>
			
		</div>
		<div class="grid_16 details-tab">
			<div class="tab-content">
				<div class="monitor">
					<div class="title">
						<h3><%=monitor%></h3>				
					</div>
					<div class="charts">
						<div class="chart" id="cpuChart">
							<h3><%=cpuUtilization%></h3>
							<c:choose>																				
								<c:when test="${rsDomain.publicCloudType == '2'}">		
									<div id = "toggle-cpu" class="toggle toggle-cpu open-more" title = "<%=openMore%>">
										<label class="toggle-openmore"></label>
									</div>
								</c:when>
								<c:otherwise>
									<div id = "toggle-cpu"  class="toggle toggle-cpu" >
									</div>
								</c:otherwise>
							</c:choose>
							<p id="cpuUsageP">%</p>
							<div class="svg cpu-chart">
								<div id="flot-placeholder" style="width:309px;height:191px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>
							</div>
							<div class="labels">
								<span class="clock-icon"><img src="icons/default/clock-pic.png"></span><span class="step"><%=space%>：30<%=second%></span><span class="circle-icon"><img class="icon" src="icons/default/gray-d.png"></span><span class="step"><%=usageRate%></span>
							</div>
						</div>
						<div class="chart" id="memoryChart">
							<h3><%=memoryUtilization%></h3>
							<c:choose>																				
								<c:when test="${rsDomain.publicCloudType == '2'}">		
									<div id = "toggle-mem"  class="toggle toggle-mem open-more" title = "<%=openMore%>">
										<label class="toggle-openmore"></label>
									</div>
								</c:when>
								<c:otherwise>
									<div id = "toggle-mem"  class="toggle toggle-mem" >
									</div>
								</c:otherwise>
							</c:choose>
							<p id="memUsageP">%</p>
							<div class="svg memory-chart">
								<div id="flot-placeholder0" style="width:309px;height:191px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>
							</div>
							<div class="labels">
								<span class="clock-icon"><img src="icons/default/clock-pic.png"></span><span class="step"><%=space%>：30<%=second%></span><span class="circle-icon"><img class="icon" src="icons/default/gray-d.png"></span><span class="step"><%=usageRate%></span>
							</div>
						</div>
						<div class="chart" id="diskIOChart">
							<h3><%=diskUsage%></h3>
							<c:choose>																				
								<c:when test="${rsDomain.publicCloudType == '2'}">						
									<div id = "toggle-io" class="toggle toggle-io open-more" title = "<%=openMore%>">
										<label class="toggle-openmore"></label>
									</div>
								</c:when>
								<c:otherwise>
									<div id = "toggle-io" class="toggle toggle-io">
									</div>
								</c:otherwise>
							</c:choose>
							<p id="diskUsageP">KBps</p>
							<div class="lineChart">
							  <div id="flot-placeholder1" style="width:309px;height:191px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>	
							</div>
							<div class="labels">
								<span class="clock-icon"><img src="icons/default/clock-pic.png"></span><span class="step"><%=space%>：30<%=second%></span><span class="circle-icon"><img class="icon" src="icons/default/yellow-d.png"></span><span class="step"><%=throughput%></span>
							</div>
						</div>
						<div class="chart" id="netIOChart">
							<h3><%=netUsage%></h3>	
							<c:choose>																				
								<c:when test="${rsDomain.publicCloudType == '2'}">
									<div id = "toggle-net" class="toggle toggle-net open-more" title = "<%=openMore%>">
										<label class="toggle-openmore"></label>
									</div>
								</c:when>
								<c:otherwise>
									<div id = "toggle-net" class="toggle toggle-net">
									</div>
								</c:otherwise>
							</c:choose>
							<p id="netUsageP">Mbps</p>
							<div class="lineChart">
							  <div id="flot-placeholder2" style="width:309px;height:191px"><img src="icons/default/nodata-pic.png"><p class="none"><%=noMonitorData%></p></div>	
							</div>
							<div class="labels">
								<span class="clock-icon"><img src="icons/default/clock-pic.png"></span><span class="step"><%=space%>：30<%=second%></span><span class="circle-icon"><img class="icon" src="icons/default/yellow-d.png"></span><span class="step"><%=throughput%></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 		图形详情 -->
		<div class="grid_16 graph" style="display:none">
			<div class="graph-wrapper" id = "graph-wrapper">
				<h2 class="graph-title"></h2>
				<c:if test="${rsDomain.status != '1'}">
					<div class="grid_4 actions">
						<div class="graph-actions">
						    <c:if test="${rsDomain.status != '2'}">
							    <a id="startVmId2" class="icon-btn" href="javascript:startVm()"><img class="icon" src="icons/default/m-start.png"><span class="text"><%=start%></span> </a>
							</c:if>
							<c:if test="${rsDomain.status == '2'}">
							    <a id="startVmId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-start.png"><span class="text"><%=start%></span> </a>
							</c:if>
							<c:if test="${rsDomain.status != '3'}">
								<a id="closeVmId2" class="icon-btn" href="javascript:closeVm()"><img class="icon" src="icons/default/m-close.png"><span class="text"><%=close%></span> </a>
							</c:if>
							<c:if test="${rsDomain.status == '3'}">
								<a id="closeVmId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-close.png"><span class="text"><%=close%></span> </a>
							</c:if>
							<c:if test="${rsDomain.status != '3'}">
								<a id="powerOffId2" class="icon-btn" href="javascript:powerOff()"><img class="icon" src="icons/default/m-poweroff.png"><span class="text"><%=powoff%></span> </a>
							</c:if>
							<c:if test="${rsDomain.status == '3'}">
								<a id="powerOffId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-poweroff.png"><span class="text"><%=powoff%></span> </a>
							</c:if>
							<c:if test="${rsDomain.system == '1'}">  
							  	    <a id="mstscId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-rdp.png"><span class="text"><%=mstsc%></span> </a>
							  	    <c:choose> 
								  	    <c:when test="${rsDomain.status == '2'}">
								            <a id="sshId2" class="icon-btn" href="javascript:ssh()"><img class="icon" src="icons/default/m-ssh.png"><span class="text"><%=ssh%></span> </a>
								  	    </c:when>
								  	    <c:otherwise>
								  	        <a id="sshId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-ssh.png"><span class="text"><%=ssh%></span> </a>
								  	    </c:otherwise>
							  	    </c:choose>
							</c:if>
							<c:if test="${rsDomain.system == '0'}">  
							    <a id="sshId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-ssh.png"><span class="text"><%=ssh%></span> </a>
							       <c:choose> 
							  	    <c:when test="${rsDomain.status == '2'}">
							            <a id="mstscId2" class="icon-btn" href="javascript:mstsc()"><img class="icon" src="icons/default/m-rdp.png"><span class="text"><%=mstsc%></span> </a>
							  	    </c:when>
							  	    <c:otherwise>
							  	       <a id="mstscId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-rdp.png"><span class="text"><%=mstsc%></span> </a>
							  	    </c:otherwise>
						  	    </c:choose>
							</c:if>
							<c:if test="${rsDomain.system != '0' && rsDomain.system != '1'}">  
								  <a id="sshId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-ssh.png"><span class="text"><%=ssh%></span> </a>
							  	  <a id="mstscId2" class="icon-btn divDisable" href="javascript:void(0)"><img class="icon" src="icons/default/m-rdp.png"><span class="text"><%=mstsc%></span> </a>
							</c:if> 
							<c:if test="${rsDomain.publicCloudType == '2'}">
									<c:if test="${sessionScope.snapshotEnabled == '1'}">
									   <c:choose>
									    <c:when test="${rsDomain.assignMode == 2}">
								           <a class="icon-btn divDisable"><img class="icon" src="icons/default/m-snapshot.png"><span class="text"><%=instanceSnapshot%></span> </a>
								  	    </c:when>
								  	    <c:otherwise>
								  	       <a class="icon-btn" href="javascript:snapshot()"><img class="icon" src="icons/default/m-snapshot.png"><span class="text"><%=instanceSnapshot%></span> </a>
								  	    </c:otherwise>
							  	       </c:choose>
									</c:if>
									<c:if test="${sessionScope.backupEnabled == '1'}">
									    <c:choose>
									    <c:when test="${rsDomain.assignMode == 2}">
								           <a class="icon-btn divDisable"><img class="icon" src="icons/default/m-backup.png"><span class="text"><%=backup%></span> </a>
								  	    </c:when>
								  	    <c:otherwise>
								  	       <a class="icon-btn" href="javascript:backup()"><img class="icon" src="icons/default/m-backup.png"><span class="text"><%=backup%></span> </a>
								  	    </c:otherwise>
							  	       </c:choose>
									
									</c:if>
									<c:if test="${sessionScope.vncEnabled == '1'}">
										<a class="icon-btn" href="javascript:openConsole()"><img class="icon" src="icons/default/m-console.png"><span class="text"><%=openConsole%></span> </a>
									</c:if>
							</c:if>
							<c:choose>
							    <c:when test="${rsDomain.assignMode == 2}">
						           <a class="icon-btn icon-btn-danger divDisable"><img class="icon" src="icons/default/m-cancel.png"><span class="text"><%=canelInstance%></span> </a>
							       <a class="icon-btn divDisable" ><img class="icon" src="icons/default/m-delay.png"><span class="text"><%=applyExpire%></span> </a>
							       <a class="icon-btn" href="javascript:releaseVDesktop()"><img class="icon" src="icons/default/m-unlink.png"><span class="text"><%=releaseVDesktop%></span> </a>
						  	    </c:when>
						  	    <c:otherwise>
						  	       <a class="icon-btn icon-btn-danger" href="javascript:canelVm()"><img class="icon" src="icons/default/m-cancel.png"><span class="text"><%=canelInstance%></span> </a>
						  	       <c:choose>
									  <c:when test="${empty rsDomain.expireDateStr}">
									  	  <a class="icon-btn divDisable" ><img class="icon" src="icons/default/m-delay.png"><span class="text"><%=applyExpire%></span> </a>
									  </c:when>
									  <c:otherwise>
									      <a class="icon-btn" href="javascript:applyExpire()"><img class="icon" src="icons/default/m-delay.png"><span class="text"><%=applyExpire%></span> </a>
									  </c:otherwise>
								  	</c:choose>
						  	       <a class="icon-btn divDisable" ><img class="icon" src="icons/default/m-unlink.png"><span class="text"><%=releaseVDesktop%></span> </a>
						  	    </c:otherwise>
							</c:choose>
							<c:choose> 
								<c:when test="${rsDomain.publicCloudType != '2' || rsDomain.system != '0' || rsDomain.status == '4'}">
									<a id="enableAntivirusGraphId" class="icon-btn divDisable"><img class="icon" src="icons/default/m-antivirusopen.png"><span class="text"><%=enableAntivirus%></span> </a>
									<a id="disableAntivirusGraphId" class="icon-btn divDisable"><img class="icon" src="icons/default/m-antivirusclose.png"><span class="text"><%=disableAntivirus%></span> </a>
								</c:when>
								<c:otherwise>
									<c:choose> 
										<c:when test="${rsDomain.status == '3'}">
											<c:if test="${rsDomain.antivirusEnable == '0'}">
												<a id="enableAntivirusGraphId" class="icon-btn" href="javascript:antivirusConfig(1)"><img class="icon" src="icons/default/m-antivirusopen.png"><span class="text"><%=enableAntivirus%></span> </a>
												<a id="disableAntivirusGraphId" class="icon-btn divDisable"><img class="icon" src="icons/default/m-antivirusclose.png"><span class="text"><%=disableAntivirus%></span> </a>
											</c:if>
											<c:if test="${rsDomain.antivirusEnable == '1'}">
												<a id="enableAntivirusGraphId" class="icon-btn divDisable" ><img class="icon" src="icons/default/m-antivirusopen.png"><span class="text"><%=enableAntivirus%></span> </a>
												<a id="disableAntivirusGraphId" class="icon-btn" href="javascript:antivirusConfig(0)"><img class="icon" src="icons/default/m-antivirusclose.png"><span class="text"><%=disableAntivirus%></span> </a>
											</c:if>
										</c:when>
										<c:otherwise>
											<c:if test="${rsDomain.antivirusEnable == '0'}">
												<a id="enableAntivirusGraphId" class="icon-btn" href="javascript:antivirusConfig(1)"><img class="icon" src="icons/default/m-antivirusopen.png"><span class="text"><%=enableAntivirus%></span> </a>
												<a id="disableAntivirusGraphId" class="icon-btn divDisable"><img class="icon" src="icons/default/m-antivirusclose.png"><span class="text"><%=disableAntivirus%></span> </a>
											</c:if>
											<c:if test="${rsDomain.antivirusEnable == '1'}">
												<a id="enableAntivirusGraphId" class="icon-btn divDisable"><img class="icon" src="icons/default/m-antivirusopen.png"><span class="text"><%=enableAntivirus%></span> </a>
												<a id="disableAntivirusGraphId" class="icon-btn divDisable"><img class="icon" src="icons/default/m-antivirusclose.png"><span class="text"><%=disableAntivirus%></span> </a>
											</c:if>
										</c:otherwise>
									</c:choose>
								</c:otherwise>
							</c:choose>
						</div>
					</div>
				</c:if>

				<div class="grid_20 components">
					<div class="component-instance-network">
						<img src="icons/internet.png">
					</div>
					<div class="component-instance-link0">
						<div class="component-instance-link-left0"></div>
						<div class="component-instance-link-right0"></div>
					</div>
					<div class="component-instance-network">
						<a class="bind-ip" href="javascript:void(0)"><span class="single-word-icon"> R </span>
<%-- 						<span class="text"><%=ipAssign%></span> --%>
						<c:if test="${empty rsDomain.networks}" >
						    <span class="text"><%=noCard%></span>
					    </c:if>
					    <c:if test="${not empty rsDomain.networks}">
					    
						    <c:forEach  items="${rsDomain.networks}" var="network" >
							    <span class="text">${network.ipAddr}</span>
							</c:forEach>
						    
					    </c:if>
						
						 </a>
					</div>
					<div class="component-instance-link1">
						<div class="component-instance-link-left1"></div>
						<div class="component-instance-link-right1"><img
								style="font-size: 16px; position: relative; top: 20px; left: -39px"
								src="icons/nodelink.png"></div>
					</div>
					<div class="component-instance-link2">
						<div class="component-instance-link-left2">
							<span
								style="font-size: 16px; position: relative; top: -10px; left: 200px"></span>
							
						</div>
						<div class="component-instance-link-right2">
						<c:if test="${empty rsDomainFwList}" >
						    <span style="font-size: 16px; position: relative; top: 40px; left: 120px"></span>
					    </c:if>
					    <c:if test="${not empty rsDomainFwList}">
					    
						    <c:forEach  items="${rsDomainFwList}" var="fw" >
							    <span style="font-size: 16px; position: relative; top: 40px; left: 100px">${fw.name}</span>
							</c:forEach>
					    </c:if>
							
								<img class="left-top" src="icons/modify-firewall.png">
						</div>
					</div>
					<div class="component-instance-wall">
						<img src="icons/wall.png">
					</div>
					<div class="component-instance-link3">
						<div class="component-instance-link-left3" id="nodelink2" >
							<img
								style="font-size: 16px; position: relative; top: 40px; left: 64px"
								src="icons/nodelink2.png">
						</div>
						<div class="component-instance-link-right3">
							<span
								style="font-size: 16px; position: relative; top: 10px; left: 10px"></span>
						</div>
					</div>
					<div class="component-instance-pc">
						<img src="icons/pc.png">
					</div>
					<div class="component-instance-link4">
						<div class="component-instance-link-left4"></div>
						<div class="component-instance-link-right4">
							<span class="needTooltip" data-ellipsis-len="6" style="display:inline-block;max-width:120px;font-size: 16px;line-height:20px; position: relative; top: -50px; left: 50px;overflow: hidden;text-overflow:ellipsis;" title="">
								<c:if test="${rsDomain.title == null}">
									   ${rsDomain.name}
							    </c:if>
							    <c:if test="${rsDomain.title != null}">
									   ${rsDomain.title}
								</c:if>
							</span>
						</div>
					</div>
					
					<div class="component-instance-link5">
						<div class="component-instance-link-left5">
							<c:forEach items="${rsDomain.storages}" var="storage"
								varStatus="sstatus">
								<c:if test="${sstatus.index <= 2}">
									<div style="cursor: pointer"
										title="${storage.driveType}${storage.diskDevice}:<c:if test="${not empty storage.capacity}"><c:if test="${storage.capacity >= 1048576}"><fmt:formatNumber value="${storage.capacity/1048576}" pattern="0.00"/> TB</c:if><c:if test="${storage.capacity < 1048576 && storage.capacity >= 1024}"><fmt:formatNumber value="${storage.capacity/1024}" pattern="0.00"/> GB</c:if><c:if test="${storage.capacity >= 0 && storage.capacity < 1024}"><fmt:formatNumber value="${storage.capacity}" pattern="0.00"/> MB</c:if></c:if>"
										class="harddisk-link-left">
										<span class="single-word-icon">z</span>
									</div>
								</c:if>
							</c:forEach>
						</div>
						<div class="component-instance-link-right5">
							<c:forEach items="${rsDomain.storages}" var="storage"
								varStatus="sstatus">
								<c:if test="${sstatus.index > 2&& sstatus.index <6}">
									<div style="cursor: pointer"
										title="${storage.driveType}${storage.diskDevice}:<c:if test="${not empty storage.capacity}"><c:if test="${storage.capacity >= 1048576}"><fmt:formatNumber value="${storage.capacity/1048576}" pattern="0.00"/> TB</c:if><c:if test="${storage.capacity < 1048576 && storage.capacity >= 1024}"><fmt:formatNumber value="${storage.capacity/1024}" pattern="0.00"/> GB</c:if><c:if test="${storage.capacity >= 0 && storage.capacity < 1024}"><fmt:formatNumber value="${storage.capacity}" pattern="0.00"/> MB</c:if></c:if>"
										class="harddisk-link-left">
										<span class="single-word-icon">z</span>
									</div>
								</c:if>
							</c:forEach>
						</div>

						<c:if test="${fn:length(rsDomain.storages)>6}">
							<div class="component-instance-link5">
								<div class="diskLinkLine"></div>
								<div class="component-instance-link-left5">
									<c:forEach items="${rsDomain.storages}" var="storage"
										varStatus="sstatus">
										<c:if test="${sstatus.index >= 6&& sstatus.index <9}">
											<div style="cursor: pointer"
												title="${storage.driveType}${storage.diskDevice}:<c:if test="${not empty storage.capacity}"><c:if test="${storage.capacity >= 1048576}"><fmt:formatNumber value="${storage.capacity/1048576}" pattern="0.00"/> TB</c:if><c:if test="${storage.capacity < 1048576 && storage.capacity >= 1024}"><fmt:formatNumber value="${storage.capacity/1024}" pattern="0.00"/> GB</c:if><c:if test="${storage.capacity >= 0 && storage.capacity < 1024}"><fmt:formatNumber value="${storage.capacity}" pattern="0.00"/> MB</c:if></c:if>"
												class="harddisk-link-left">
												<span class="single-word-icon">z</span>
											</div>
										</c:if>
									</c:forEach>
								</div>
								<div class="component-instance-link-right5">
									<c:forEach items="${rsDomain.storages}" var="storage"
										varStatus="sstatus">
										<c:if test="${sstatus.index >= 9&& sstatus.index <12}">
											<div style="cursor: pointer"
												title="${storage.driveType}${storage.diskDevice}:<c:if test="${not empty storage.capacity}"><c:if test="${storage.capacity >= 1048576}"><fmt:formatNumber value="${storage.capacity/1048576}" pattern="0.00"/> TB</c:if><c:if test="${storage.capacity < 1048576 && storage.capacity >= 1024}"><fmt:formatNumber value="${storage.capacity/1024}" pattern="0.00"/> GB</c:if><c:if test="${storage.capacity >= 0 && storage.capacity < 1024}"><fmt:formatNumber value="${storage.capacity}" pattern="0.00"/> MB</c:if></c:if>"
												class="harddisk-link-left">
												<span class="single-word-icon">z</span>
											</div>
										</c:if>
									</c:forEach>
								</div>
								<c:if test="${fn:length(rsDomain.storages)>12}">
									<div class="component-instance-link5" id = "showMoreStorage">
										<div class="diskLinkLine-left">
											<div class="diskLinkLine-go" id="getMoreStorage"><div><%=openMoreDisk %></div></div>
										</div>
										<div style="display: none">
											<ul id = "moreStorage">
												<c:forEach items="${rsDomain.storages}" var="storage"
													varStatus="sstatus">
													<c:if test="${sstatus.index >= 12}">
														<li
															data-drive-title="${storage.driveType}${storage.diskDevice}:<c:if test="${not empty storage.capacity}"><c:if test="${storage.capacity >= 1048576}"><fmt:formatNumber value="${storage.capacity/1048576}" pattern="0.00"/> TB</c:if><c:if test="${storage.capacity < 1048576 && storage.capacity >= 1024}"><fmt:formatNumber value="${storage.capacity/1024}" pattern="0.00"/> GB</c:if><c:if test="${storage.capacity >= 0 && storage.capacity < 1024}"><fmt:formatNumber value="${storage.capacity}" pattern="0.00"/> MB</c:if></c:if>"></li>
													</c:if>

												</c:forEach>
											</ul>

										</div>
									</div>
								</c:if>
							</div>

						</c:if>

					</div>
				</div>
			</div>
		</div>
		<div class="grid_8 graph-info instance-info" style="display:none">
			<div class="basic instance-basic">
				<div class="basic-inner">
				<div class="title">
					<h3><%=basicAttributes%></h3>
					</div>
					<table class="info">
						<tbody>
							<tr>
								<td><%=name%></td>
								<td class="needTooltip" data-ellipsis-len="10">
									<c:if test="${rsDomain.title == null}">
									   ${rsDomain.name}
									 </c:if>
									  <c:if test="${rsDomain.title != null}">
									   ${rsDomain.title}
									 </c:if>
					            </td>
							</tr>
							<tr>
								<td><%=cloudHostDesc%></td><td class="needTooltip" data-ellipsis-len="10">${rsDomain.description}</td>
							</tr>
							<tr>
								<td><%=status%></td><td class="instanceStatus">
								<c:if test="${rsDomain.status == 2}">
									 <%=running%>
								</c:if>
								<c:if test="${rsDomain.status == 3}">
									 <%=closed%>
								</c:if>
								<c:if test="${rsDomain.status == 4}">
									 <%=stopped%>
								</c:if>
								</td>
							</tr>
							
							<tr>
								<td>CPU</td><td>${rsDomain.cpu}</td>
							</tr>
							<tr>
								<td><%=memory%></td><td>
									<c:if test="${not empty rsDomain.memory}">
									    <c:choose>
									        <c:when test="${rsDomain.memory>= 1048576}">
									           <fmt:formatNumber value="${rsDomain.memory/1048576}" pattern="0.00"/> TB
									        </c:when>
									        <c:when test="${rsDomain.memory>= 1024}">
									            <fmt:formatNumber value="${rsDomain.memory/1024}" pattern="0.00"/> GB
									        </c:when>
									        <c:otherwise>
									            <fmt:formatNumber value="${rsDomain.memory}" pattern="0.00"/> MB
									        </c:otherwise>
									    </c:choose>
								   </c:if>
								</td>
							</tr>
							<tr>
								<td><%=createTime%></td><td><span class="time"><fmt:formatDate  value="${rsDomain.createDate}" type="both" pattern="yyyy-MM-dd HH:mm:ss" /></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
		<!-- 		弹出来的模态窗口 -->
	<div id="windowOverId" class="window-overlay">
	
	
	</div>
	<script type="text/javascript">

		$(document).ready(function() {
			data2 ={
					vmId: $("#hidden-vmId").val(),
					hostId:$("#hidden-hostId").val(),
					name:$("#hidden-name").val(),
					status:$("#hidden-status").val(),
					system:$("#hidden-system").val(),
					publicCloudType:$("#hidden-type").val(),
					osDesc:$("#hidden-osDesc").val(),
					flag:$("#hidden-flag").val(),
					title:$("#hidden-title").val(),
					assignMode:$("#hidden-assignMode").val(),
					expireDateStr:$("#hidden-expireDate").val(),
					spiceUri:$("#hidden-spiceUri").val(),
					antivirusEnable:$("#hidden-antivirusEnable").val()
			      };
     
			$(".needTooltip").each(function(){
				$(this).html(buildToolTip($(this).html(),$(this)));
			});
			$(".details-tab").css("height",$(".description").css("height"));
			$(".description").css("height",$(".details-tab").css("height"));
			$("div.itemtooltip").jtooltip();
			$(".graph, .graph-info").hide();
			$(".view-type").bind({
				 click:function(){
					 $(this).siblings().removeClass("current");
					 $(this).addClass("current");
					 if( $(this).hasClass("type-text")){
						 $(".graph, .graph-info").hide();	
						 $(".details-tab").css("height",$(".description").css("height"));
						 $(".description, .details-tab").show();
						 $(".view-type.type-text").addClass("icon-text-select");
						 $(".view-type.type-text").removeClass("icon-text-normal");
						 $(".view-type.type-graph").addClass("icon-graph-normal");
						 $(".view-type.type-graph").removeClass("icon-graph-select");
					 }
					 else if($(this).hasClass("type-graph")){
						 $(".graph, .graph-info").show();
						 $(".graph-info").css("height",document.getElementById("graph-wrapper").offsetHeight +"px" );
				
						 $(".description, .details-tab").hide();
						 $(".view-type.type-text").addClass("icon-text-normal");
                         $(".view-type.type-text").removeClass("icon-text-select");
                         $(".view-type.type-graph").addClass("icon-graph-select");
                         $(".view-type.type-graph").removeClass("icon-graph-normal");
					 }
				 } 
			});
			 $("#getMoreStorage").bind("click",function(){
				 $("#getMoreStorage").parent().hide();
				var storageshtml='<div class="diskLinkLine"></div><div class="component-instance-link-left5">';
				 var storagesLi = $("#moreStorage li");
				
				 storagesLi.each(function(i) {
					
					 if(i>0&&i%6==0){
							storageshtml += '<div class="component-instance-link5"><div class="diskLinkLine"></div><div class="component-instance-link-left5">';
						}
					if(i%6==3){
						storageshtml += '<div class="component-instance-link-right5">';
					}
					storageshtml += '<div style="cursor: pointer" title="'
					+ $(this).attr("data-drive-title")
					+ '" class="harddisk-link-left">'
					+ ' <span class="single-word-icon">z</span>'
					+ ' </div>';
					if(i==storagesLi.length-1){
						storageshtml += '<div class="diskLinkLine-go" id="closeMoreStorage"><div><%=closeMoreDisk %></div></div>';
					}	
					if(i%3==2||i==storagesLi.length-1){
						storageshtml += '</div>';
					}	
					
				});
				 storageshtml += '</div>';
				 $("#showMoreStorage").append(storageshtml);
				 $(".graph-info").css("height",document.getElementById("graph-wrapper").offsetHeight +"px" );
				 $('#instance-detail').animate({ scrollTop: document.getElementById("graph-wrapper").offsetHeight }, 1200);
				 $("#closeMoreStorage").bind("click",function(){
					 $("#getMoreStorage").parent().show();
					 $("#getMoreStorage").parent().parent().find(".component-instance-link5, .component-instance-link-right5, .component-instance-link-left5,.diskLinkLine").remove();
					 $(".graph-info").css("height",document.getElementById("graph-wrapper").offsetHeight +"px" );
				 });
			 });
			$(".type-goback").bind({
				click:function(){
					$("#frame").layout("panel","center").panel('refresh','instances.jsp');
				 },
				 mouseover:function(){
					$(".type-goback").removeClass("icon-goback-normal");
					$(".type-goback").addClass("icon-goback-select");
				 },
				 mouseleave:function(){
					$(".type-goback").removeClass("icon-goback-select");
					$(".type-goback").addClass("icon-goback-normal");
				 }
			});
			var cpuChart = $("#toggle-cpu");
			controlChart(cpuChart);
			var memChart = $("#toggle-mem");
			controlChart(memChart);
			var ioChart = $("#toggle-io");
			controlChart(ioChart);
			var netChart = $("#toggle-net");
			controlChart(netChart);
			//开关性能
			$(".open-more").bind("click", function() {				
				openMore($(this));
			});
			//图形详情页面相关操作
			$(".graph-actions .icon-btn").bind("mouseover", function() {
				$(this).siblings().find(".text").css("display", "none");
				$(this).find(".text").css("display", "block");
			});
			$(".graph-actions").bind("mouseleave", function() {
				$(this).find(".icon-btn").find(".text").css("display", "none");
			});
			$(".left-top").bind({
			    click:function(){$(".window-overlay");},
			    mouseover:function(){$(".left-top").css("display","block");},  
			    mouseout:function(){$(".left-top").css("display","none");}  
			  });
			
			checkAntivirusConfigured(data2.vmId);
			
		});
		
		function buildToolTip(value,obj){
	    	var tempValue = value;
			// 修改问题单201703270065: Firefox和其他浏览器下长字符串截断的显示效果不一致问题	-- by kf6302
// 	 		if (navigator.userAgent.indexOf("Firefox")>0) {
// 	 		 	value = toBreakWord(value, 20);
// 	 		 	tempValue = toAddEllipsis(value, obj.attr("data-ellipsis-len"));
// 	 		} 
			return "<div class='itemtooltip' style='white-space:nowrap; overflow:hidden;text-overflow:ellipsis;'>"+tempValue+
		 	 "<div class='tooltip_description' style='display:none;nowrap:false;word-break:break-all '>"
		 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all;nowrap:false'>" +value+ "</td></tr></table>"+
		 	 " </div></div>";
		}
		
		/**申请注销虚拟机**/
		function canelVm() {
			if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
    			data2.title = data2.name;
    	    }
			if (data2){ 
		    	$.messager.confirm('<%=canelVm%>', '<%=confirmCanelVm%><%=quotationLeft%>' + data2.title + '<%=quotationRight%><%=questionMark%>', 
		    			function(r){            
		    		       if (r){        
		    		    	   
		    		    	   $.ajax({
		    			 		   type: "POST",
		    			 		   dataType:"json",
		    			 		   url: "servlet/vmList?way=cancelVm",
		    			 		   data:"id="+data2.vmId+"&name="+data2.name+"&title=" +data2.title + "&type=0&flag="+data2.flag,
		    			 		   success: function(result){
		    			 			  if (result != null && typeof result != 'undefined') {
		    			 		    	if (result.success) {
		    			 		    		$.messager.show({          
		    			 		    			title:result.title,            
		    			 		    			msg:result.message, 
		    			 		    			showType:'show'       
		    			 		    		});
		    			 		    	} else {
		    			 		    		$.messager.alert(result.title,result.message,'error');
		    			 		    	}
		    			 		   }}
		    		 	      });
		    		       }
		       });
			}
		}
		
		//打开延期虚拟机日期的窗口
	    function applyExpire() {
	    	//先检查是否满足延期条件
	    	if (typeof data2.title == 'undefined' || '' == data2.title || data2.title == null) {
    			data2.title = data2.name;
    	    }
	    	if (data2) {
	    		//先检查
	    		$.ajax({
	    			type : "POST",
	    			dataType : "json",
	    			url : "servlet/vmList?way=checkDelay",
	    			data : "vmId=" + data2.vmId ,
	    			success : function(result) {
	    				if (result != null && typeof result != 'undefined') {
	    					if (result.success) {
	    						var f = function() {
	    			    			$("#domainId").val(data2.vmId);
	    			    			$("#domainName").val(data2.name);
	    			    			$("#nameid").val(data2.title);
	    			    			$("#expireDateId").val(data2.expireDateStr);
	    			    			$("#expireDateId2").val(data2.expireDateStr);
	    			    		};
	    			    		//issues:201607290405,modify the problems of Firefox style compatibility and no title		--by ckf6302
	    			    		var json={
	    			    				url:"page/widget/applyExpire.jsp",
	    			    				head:$("#hidden-applyExpire").val(),
	    			    				f:f,
	    			    				height:"291px"
	    			    		};
	    			    		mylayer.show(json);
	    					} else {
	    						$.messager.alert(result.title, result.message, 'error');
	    					}
	    				}
	    			}
	    		});
	    		
	    	}
	    }
		/**SSH连接**/
		function ssh() {
			if (data2 && data2.status == 2 && data2.system == 1){ 
		    	$.ajax({
		 		   type: "GET",
		 		   dataType:"json",
		 		   url: "servlet/vmList?way=network",
		 		   data:"id="+data2.vmId,
		 		   success: function(result){
		 			  if (result instanceof Array) {
		 				   if (result.length == 0) {
		 					  $.messager.alert('<%=ssh%>','<%=ipnotNull%>','error');
		 				   } else {
		 			    	  var net = result[0];
		 			    	  var ip = net.ipAddr;
		 			    	  if (typeof ip == 'undefined') {
		 			    		  $.messager.alert('<%=ssh%>','<%=ipnotNull%>','error');
		 			    	  } else {
			 			    	  var param = "height=605, width=850, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
			 			    	  window.open("ssh.jsp?auto=1&ip="+ip, "_blank", param);
		 			    	  }
		 			      } 
		 		 	  } else { 
		 				  $.messager.alert(result.title, result.message, 'error');
					  }
		 		   }
			   });
			} 
		}
		/**远程桌面**/
	    function mstsc() {
	    	if (data2 && data2.status == 2 && data2.system == 0){ 
		    	$.ajax({
		 		   type: "GET",
		 		   dataType:"json",
		 		   url: "servlet/vmList?way=network",
		 		   data:"id="+data2.vmId,
		 		   success: function(result){
		 			  if (result instanceof Array) {
		 				  if (result.length == 0 ) {
		 					 $.messager.alert('<%=mstsc%>','<%=ipnotNull%>','error');
		 				  } else if(result.length == 1) {
		 			    	  var net = result[0];
		 			    	  var ip = net.ipAddr;
		 			    	  mstscIp(ip, data2.vmId);
		 			      } else {
		 			    	 $("#windowOverId").load("page/widget/selectIp.jsp",function(){
		 					    $("#modal-close").bind("click",close);
		 					    $("#windowOverId").css("display", "inline-block");
		 					    $("#rowid").val(data2.vmId);
		 						for (var i =0 ; i < result.length; i++) {
		 							var ip = result[i].ipAddr;
		 							if (typeof ip != "undefined") {
		 								$("#ipSelect").append("<option value='" + ip + "'>" + ip);
		 							}
		 						}
	 	 			     	});
		 			      } 
		 			  } else {
		 				  $.messager.alert(result.title, result.message, 'error');
					  }
		 		   }
	 	      });
	    	} 
	    }
		
	  //根据IP打开远程桌面
	    function mstscIp(ip, id) {
	    	if (typeof ip != "undefined" && typeof id != "undefined") {
	   		  $.ajax({
	   			  type: "GET",
	   			  dataType:"json",
	   			  url: "servlet/vmList?way=desktopParamter",
	   			  data:"id="+id,
	   			  success: function(result){
	   				if (typeof result != 'undefined') {
	   				  var param = "height=105, width=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
	   				  var ieparam = "height=105, width=200, toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes";
	   				  if(result == null) {
	   					if(isIE()) {  
	    					  window.open("ierdp.jsp?ip="+ip, "_blank", ieparam);
	    				  } else {
	   					      window.open("rdp.jsp?ip="+ip, "_blank", param);
	    				  }
	   				  } else {
	   					  var audio = result.audio;
	   					  var clipboard = result.clipboard;
	   					  var colorDepth = result.colorDepth;
	   					  var disk = result.disk;
	   					  var printer = result.printer;
	   					  var serialPort = result.serialPort;
	   					  var usb = result.usb;
	   					  var url = null;
	   					  if(isIE()) {  
		   					  url = "ierdp.jsp?ip="+ip +"&enableCb=" + clipboard + "&enableCom=" + serialPort + "&enableDrive=" + disk + "&enablePrinter=" + printer + "&enableAudio=" + audio + "&enableUsb=" + usb + "&sessionBpp=" + colorDepth;
	   						  window.open(url, "_blank", ieparam);
	  				      } else {
		   					  url = "rdp.jsp?ip="+ip +"&enableCb=" + clipboard + "&enableCom=" + serialPort + "&enableDrive=" + disk + "&enablePrinter=" + printer + "&enableAudio=" + audio + "&enableUsb=" + usb + "&sessionBpp=" + colorDepth;
		   					  window.open(url, "_blank", param);
	  				      }
	   				  } 
	   				}
	   			  }
	   		  }); 
	   	  }
	    }
		function addFirewallforVm () {
			//增加防火墙-虚拟机关系  
			var domainId = '';
			var firewallId = '';
			var xml = '<firewallDomain>';
			xml += '<domainId>'+domainId+'</domainId>';
			xml += '<domainName>' + domainName + '</domainName>';
			xml += '<firewallId>' + firewallId + '</firewallId>';
			xml += '</firewallDomain>';
	  		$.ajax({
	  			type : "POST",
	  			dataType : "json",
	  			url : "servlet/firewallServlet?way=addFwStrategyDomain",
	  			data : "xml="+xml,
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
		
		function deleteFirewallforVm () {
			//增加防火墙-虚拟机关系  
			var domainId = '';
			var firewallId = '';
			var domainName = '';
	  		$.ajax({
	  			type : "POST",
	  			dataType : "json",
	  			url : "servlet/firewallServlet?way=addFwStrategyDomain",
	  			data : "domainId="+domainId+"&firewallId="+firewallId+"&domainName="+domainName,
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
		
		/**防病毒配置 1 启用 2 关闭**/
	    function antivirusConfig(type) {
			var tipContent;
	    	if (type == 1) {
	    		tipContent = "<%=enableAntivirusContext%>";
	    	} else {
	    		tipContent = "<%=disableAntivirusContext%>";
	    	}
	    	$.messager.confirm("<%=start%>", tipContent, 
	    			function(r){
	    				if (!r) {
	    					return ;
	    				}
			    		$.ajax({
					 		   type: "POST",
					 		   dataType:"json",
					 		   url: "servlet/vmList?way=antivirusConfig",
					 		   data:"id="+data2.vmId+"&name="+data2.name+"&type="+type,
					 		   beforeSend:function(xhr){
					 			   showWait("<%=processing%>", 999999);
					 		   },
					 		   success: function(result){
					 			   hideWait();
					 			   if (result != null && typeof result != 'undefined') {
										if (result.success) {
											if (type == 1) {
												$("#enableAntivirusId").addClass("divDisable");
												$("#enableAntivirusId").attr("onclick","");
												
												$("#enableAntivirusGraphId").addClass("divDisable");
												$("#enableAntivirusGraphId").attr("href","javascript:void(0)");
												if (data2.status != '2' && data2.status != '4') {
													// not [running or pause]
													$("#disableAntivirusId").removeClass("divDisable");
													$("#disableAntivirusId").attr("onclick","antivirusConfig(0)");
													
													$("#disableAntivirusGraphId").removeClass("divDisable");
													$("#disableAntivirusGraphId").attr("href","javascript:antivirusConfig(0)");
												}
											} else {
												//only in stop status can in this
												$("#enableAntivirusId").removeClass("divDisable");
												$("#enableAntivirusId").attr("onclick","antivirusConfig(1)");
												
												$("#enableAntivirusGraphId").removeClass("divDisable");
												$("#enableAntivirusGraphId").attr("href","javascript:antivirusConfig(1)");
												
												$("#disableAntivirusId").addClass("divDisable");
												$("#disableAntivirusId").attr("onclick","");
												
												$("#disableAntivirusGraphId").addClass("divDisable");
												$("#disableAntivirusGraphId").attr("href","javascript:void(0)");
											}
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
					 			  hideWait();
					 		   }
				 	      });
            });
	    }
		
	    function checkAntivirusConfigured(domainId) {
	    	var isAntiConfigured = false;
    		$.ajax({
 	 		   type: "GET",
 	 		   dataType:"json",
 	 		   url: "servlet/vmList?way=checkAntivirusConfigured",
 	 		   data:"domainId="+domainId,
 	 		   success: function(data){
     		       if (data != null && typeof data != 'undefined') {
						if (data != '') {
							isAntiConfigured = data.message;
						}
     		 	   }
     		       if (isAntiConfigured == 'false') {
                       $("#enableAntivirusId").addClass("divDisable");
                       $("#enableAntivirusId").attr("onclick","");
                       
                       $("#enableAntivirusGraphId").addClass("divDisable");
                       $("#enableAntivirusGraphId").attr("href","javascript:void(0)");
                       
                       $("#disableAntivirusId").addClass("divDisable");
                       $("#disableAntivirusId").attr("onclick","");
                       
                       $("#disableAntivirusGraphId").addClass("divDisable");
                       $("#disableAntivirusGraphId").attr("href","javascript:void(0)");
     		       }
 	 		   }
 	      	});
	    }
	</script>
	<script type="text/template" id="tmpl_detail_monitor_chart">
<div class="grid-rect-1">
<div class="hold hold1">
	<div class="pie pie1"></div>
</div>
<div class="hold hold2">
<div class="pie pie2"></div>
</div>
<div class="bg"></div>
<div class="inner-pie">
<span id="inner-pie" ></span><em></em>
</div>
</div>
</script>
</body>
</html>