<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.FuncUtil" %>
<!DOCTYPE html>

<html  ng-app="app.main">
	<head>
	<meta charset="UTF-8">
	<base href="<%=request.getContextPath()%>/">
	<link type="image/x-icon" href="{{::faviconImg}}" rel="shortcut icon">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title ng-bind="::systemName"></title>
	<link href="css/jquery.ui.resizable.min.css" type="text/css" rel="stylesheet">
	<link href="css/bootstrap.min.css" type="text/css" rel="stylesheet">
	<link href="css/bootstrap-datetimepicker.min.css" type="text/css" rel="stylesheet">
	<link href="css/angular-toggle-switch-bootstrap-3.css" type="text/css" rel="stylesheet">
    <link href="css/font-awesome.min.css" type="text/css" rel="stylesheet">
    <link href="css/inputHasRightBtn.css" type="text/css" rel="stylesheet">
    <link href="css/login.css" type="text/css" rel="stylesheet">
  	<link href="css/jquery-ui.min.css" type="text/css" rel="stylesheet">
 	<link href="css/treeGrid.css" type="text/css" rel="stylesheet">
 	<link href="css/jedate.css" rel="stylesheet" type="text/css" />
 	<link href="css/topology.css" rel="stylesheet" type="text/css" /> 
  	
	<link href="css/wizard-nav.css" rel="stylesheet" type="text/css"  />
	<link href="css/nggrid/ng-grid.css" type="text/css"  rel="stylesheet">
	<link href="js/lib/ui-grid/ui-grid.min.css" type="text/css"  rel="stylesheet">
	<link href="css/iconMapWhite.css" type="text/css"  rel="stylesheet">
	<link href="css/custom.css" rel="stylesheet" type="text/css"  />
	<link href="css/uigrid/uigrid-custom.css" rel="stylesheet" type="text/css"  />
	<link ng-if = "listVerticalLine" href="css/nggrid/listVerticalLine.css" type="text/css"  rel="stylesheet">
	<link ng-if = "listVerticalLine" href="css/uigrid/uigrid-listVerticalLine.css" type="text/css"  rel="stylesheet">
	
	<link href="css/stream-v1.css" rel="stylesheet" type="text/css"  />
	<link href="css/elastislide.css" rel="stylesheet" type="text/css" />
	<link href="css/jquery.gridster.css" rel="stylesheet" type="text/css" />
	<link href="css/jquery-ui-slider-pips.min.css" rel="stylesheet" type="text/css" />
	<link href="css/dashboard.css" rel="stylesheet" type="text/css" />
	<link href="css/workflow.css" rel="stylesheet" type="text/css" />
	<link href="css/ui.jqgrid.css" rel="stylesheet" type="text/css" />
	<link href="css/migrateHistory.css" rel="stylesheet" type="text/css" />
	<link  ng-if="!isCasIc" id="changeCss" href="css/blueTheme.css" rel="stylesheet" type="text/css"  />
	<link  ng-if="isCasIc" id="changeCss" href="css/casicTheme.css" rel="stylesheet" type="text/css"  />
	<!-- 一键系列及打印使用该样式 -->
	<link href="css/buttons/buttons.dataTables.css" rel="stylesheet" type="text/css" />
	<link href="css/buttons/jquery.dataTables.css" rel="stylesheet" type="text/css" />
	
	<link href="css/chat-style.css" rel="stylesheet" type="text/css" />
	
	<script type="text/javascript" src="js/constant.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular-messages.min.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular-ui-router.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/resource.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular-translate.js"></script>
    <script type="text/javascript" src="js/lib/loader-static-files.js"></script>
   
    <script type="text/javascript" src="js/lib/carousel-form.js"></script>
 	<script type="text/javascript" src="js/lib/ui-bootstrap-tpls-0.12.0.js"></script>

	<%--<script src="${resource(dir:'js/lib',file:'jquery-1.8.0.min.js)}"></script>--%>
	<script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="js/lib/jquery-ui.js"></script> 
	<script type="text/javascript" src="js/lib/jquery/checkbox.js"></script>
	<script type="text/javascript" src="js/lib/jquery/jquery.resize.js"></script>
    <script type="text/javascript" src="js/lib/jquery/jquery.md5.js"></script>
	<script type="text/javascript" src="js/lib/jquery/jquery.jqGrid.min.js"></script>
	<script type="text/javascript" src="js/lib/jquery-ui-slider-pips.js"></script>
 	<script type="text/javascript" src="js/lib/jquery.i18n.properties-1.0.9.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap-treeview.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap-datetimepicker.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/switch/sanitize.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/switch/angular-toggle-switch.js"></script>
	<script type="text/javascript" src="js/lib/nggrid/ng-grid.debug.js"></script>
	<!--
	<script type="text/javascript" src="js/lib/ui-grid/ui-grid.js"></script>
	<script type="text/javascript" src="js/lib/ui-grid/draggable-rows.js"></script>
	-->
<!-- 	<script type="text/javascript" src="js/lib/ace/jquery.nestable.min.js"></script> -->
	<script type="text/javascript" src="js/lib/ace/jquery.nestable.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap-contextmenu.js"></script>
	<script type="text/javascript" src="js/lib/treegrid/tree-grid-directive.js"></script>
	 
<!-- 	<script type="text/javascript" src="js/lib/dashboard/raphael.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/circle.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/ringChart.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/pie.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/popup.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/analytics.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/jquery.flot.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/jquery.flot.time.js"></script> -->
<!-- 	<script type="text/javascript" src="js/lib/dashboard/analytics.js"></script> -->

	<script type="text/javascript" src="js/lib/dashboard/modernizr.js"></script>
	<script type="text/javascript" src="js/lib/dashboard/jquery.elastislide.js"></script>
	<script type="text/javascript" src="js/lib/dashboard/jquery.gridster.js"></script>
	<script type="text/javascript" src="js/lib/jedate/jedate.js"></script>

	
	<script type="text/javascript" src="js/lib/ajaxfileupload.js"></script>
	<script type="text/javascript" src="js/lib/iscroll.js"></script>
 	<script type="text/javascript" src="js/lib/topo/twaver.js"></script> 
 	<script type="text/javascript" src="js/lib/topo/twaver_ext.js"></script> 
 	<script type="text/javascript" src="js/lib/topo/license.js"></script> 
 	<script type="text/javascript" src="js/lib/topo/topoUtil.js"></script>
<!-- 	<script type="text/javascript" src="js/lib/topo/computerTopology.js"></script> -->
    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript" src="js/topo/rainbowTopology.js"></script> 
   
	<script type="text/javascript" src="js/filter/filters.js"></script>
	<script type="text/javascript" src="js/service/services.js"></script>
	<script type="text/javascript" src="js/service/httpservice.js"></script>
	<script type="text/javascript" src="js/service/httpService2.js"></script>
	<script type="text/javascript" src="js/service/gridservice.js"></script>
	<script type="text/javascript" src="js/service/workflowService.js"></script>
	<script type="text/javascript" src="js/service/orgService.js"></script>
	<script type="text/javascript" src="js/service/resourcePoolService.js"></script>
	<script type="text/javascript" src="js/service/vmServices.js"></script>
	<script type="text/javascript" src="js/service/desktopService.js"></script>
	<script type="text/javascript" src="js/service/permissionService.js"></script>
	<script type="text/javascript" src="js/service/cloudResourceServices.js"></script>
	<script type="text/javascript" src="js/service/clusterService.js"></script>
	<script type="text/javascript" src="js/service/definedPageServices.js"></script>
	<!--
	<script type="text/javascript" src="js/service/localStorageService.js"></script>
	<script type="text/javascript" src="js/service/uiGridService.js"></script>
	<script type="text/javascript" src="js/service/tableStateService.js"></script>
	-->
<!-- 	<script type="text/javascript" src="js/service/clusterServices.js"></script> -->
<!-- 	<script type="text/javascript" src="js/service/hostpoolServices.js"></script> -->
<!-- 	<script type="text/javascript" src="js/service/cloudServices.js"></script> -->
	<%
		String locale = request.getParameter("locale");
		if (locale == null) {
		  locale = java.util.Locale.getDefault().toString();
	  	}
		boolean isUnis = FuncUtil.isUnis();
		boolean isUniCloud = FuncUtil.isUnicloud();
	%>
	<%	if (locale.startsWith("zh"))  {%>
			<script type="text/javascript" src="js/resource_cn.js"></script>
			<script type="text/javascript" src="js/lib/jedate/i18n/jeDate_resource_cn.js"></script>
			<%  if (isUnis) { %>
		<script type="text/javascript" src="js/unis_resource_cn.js"></script>
			<%  }else if (isUniCloud) {  %>
				<script type="text/javascript" src="js/unicloud_resource_cn.js"></script>
			<%  } else {  %>
		<script type="text/javascript" src="js/plat_resource_cn.js"></script>
			<%    }  %>
			<script type="text/javascript">
			var localeIsEn = false;
			</script>
			<script>var globalLang = "zh_CN";</script>
	<%	} else { %>
			<script type="text/javascript" src="js/resource_en.js"></script>
			<script type="text/javascript" src="js/lib/jedate/i18n/jeDate_resource_en.js"></script>
			<% if (isUnis) { %>
		<script type="text/javascript" src="js/unis_resource_en.js"></script>
			<%  } else if (isUniCloud) {  %>
				<script type="text/javascript" src="js/unicloud_resource_en.js"></script>
	 		<%  } else {  %>
		<script type="text/javascript" src="js/plat_resource_en.js"></script>
			<%  }  %>
			<script type="text/javascript">
            var localeIsEn = true;
            </script>
            <script>var globalLang = "en_US";</script>
	<%	} %>
	<script type="text/javascript" src="js/i10n.js"></script>
	
	<script type="text/javascript" src="js/serviceAsync/cloudDiskServiceAsync.js"></script>
	<script type="text/javascript" src="js/serviceAsync/publicCloudServiceAsync.js"></script>
	<script type="text/javascript" src="js/serviceAsync/rainbowServiceAsync.js"></script>
	<script type="text/javascript" src="js/serviceAsync/vmServiceAsync.js"></script>
	<script type="text/javascript" src="js/serviceAsync/alarmServiceAsync.js"></script>
<!-- 	<script type="text/javascript" src="js/controller/controllers.js"></script> -->
	<script type="text/javascript" src="js/controller/listController.js"></script>
    <script type="text/javascript" src="js/controller/loginController.js"></script>
    <script type="text/javascript" src="js/controller/cloudResourceCtrl.js"></script>
    <script type="text/javascript" src="js/controller/workflowCtrl.js"></script>
    <script type="text/javascript" src="js/controller/orgCtrl.js"></script>
    <script type="text/javascript" src="js/controller/desktopController.js"></script>
<!--     <script type="text/javascript" src="js/controller/cloudResourceController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/hostpoolController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/clusterController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/hostChartController.js"></script> -->
    <script type="text/javascript" src="js/controller/hostController.js"></script>
	<script type="text/javascript" src="js/controller/vmController.js"></script>
	<script type="text/javascript" src="js/controller/dashboardController.js"></script>
<!--     <script type="text/javascript" src="js/controller/ListController.js"></script> -->
	<script type="text/javascript" src="js/controller/reportController.js"></script> 
<!--     <script type="text/javascript" src="js/controller/virualstorageController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/vmRecycleController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/vmViewController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/templateController.js"></script> -->
<!--     <script type="text/javascript" src="js/controller/cloudServiceController.js"></script> -->
    <script type="text/javascript" src="js/controller/alarmController.js"></script>
    <script type="text/javascript" src="js/controller/systemController.js"></script>
    <script type="text/javascript" src="js/controller/cloudServiceController.js"></script>
    <script type="text/javascript" src="js/controller/selectorController.js"></script>
    <script type="text/javascript" src="js/controller/vmwareController.js"></script>
    <script type="text/javascript" src="js/controller/cloudDiskCtrl.js"></script>
    <script type="text/javascript" src="js/controller/cloudBackupCtrl.js"></script>
    <script type="text/javascript" src="js/controller/cloudHostCtrl.js"></script>
    <script type="text/javascript" src="js/controller/cloudOSController.js"></script>
    <script type="text/javascript" src="js/controller/publicCloudController.js"></script>
    <script type="text/javascript" src="js/controller/resourcePoolCtrl.js"></script>
	<script type="text/javascript" src="js/directive/inputTagDirectives.js"></script>
	<script type="text/javascript" src="js/directive/chartDirectives.js"></script>
	<script type="text/javascript" src="js/lib/stream/stream.js"></script>	
	<script type="text/javascript" src="js/lib/jquery.messager.js"></script>
	<script type="text/javascript" src="js/lib/cryptoJS.js"></script>
	<script type="text/javascript" src="js/lib/mode-ecb.js"></script>
	<script type="text/javascript" src="js/controller/pluginController.js"></script>
<!-- 	<script type="text/javascript" src="js/serviceAsync/pluginServiceAsync.js"></script>  -->
	<script type="text/javascript" src="js/lib/buttons/jquery.dataTables.js"></script>
	<script type="text/javascript" src="js/lib/buttons/pdfmake.min2.js"></script>
	<script type="text/javascript" src="js/lib/buttons/vfs_fonts.js" async="async"></script>
	<script type="text/javascript" src="js/lib/buttons/fileSave.js"></script>
	<script type="text/javascript" src="js/lib/buttons/html2canvas.js"></script>
	<script type="text/javascript" src="js/lib/buttons/canvas2image.js"></script>
	<!-- <script type="text/javascript" src="js/lib/buttons/base64.js"></script> -->
	<!-- <script type="text/javascript" src="js/lib/buttons/ace.js"></script> -->
	<script type="text/javascript" src="js/lib/buttons/jspdf.min.js"></script>
	<script type="text/javascript" src="js/lib/buttons/jszip.min.js"></script>
	<script type="text/javascript" src="js/lib/dashboard/echarts-all.js"></script>
	<script type="text/javascript" src="js/service/echartsServices.js"></script>
	<script type="text/javascript" src="js/lib/echarts/echarts.js"></script>
	<script type="text/javascript" src="js/lib/echarts/map.js"></script>
	</head>
	<body id="bodyid" style='width:100%' ng-click='docClick($event)'>
	   <div class="height100" ui-view></div>
	</body>
</html>
