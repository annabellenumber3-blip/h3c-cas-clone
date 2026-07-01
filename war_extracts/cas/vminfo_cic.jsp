<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html  ng-app="app.main">
	<head>
	<meta charset="UTF-8">
	<base href="<%=request.getContextPath()%>/">
	<link type="image/x-icon" href="{{::faviconImg}}" rel="bookmark">
	<link type="image/x-icon" href="{{::faviconImg}}" rel="shortcut icon">
	<link type="image/x-icon" href="{{::faviconImg}}" rel="icon">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title ng-bind="::systemName"></title>
	<link href="css/jquery.ui.resizable.min.css" type="text/css" rel="stylesheet">
	<link href="css/bootstrap.min.css" type="text/css" rel="stylesheet">
	<link href="css/bootstrap-datetimepicker.min.css" type="text/css" rel="stylesheet">
	<link href="css/angular-toggle-switch-bootstrap-3.css" type="text/css" rel="stylesheet">
    <link href="css/font-awesome.min.css" type="text/css" rel="stylesheet">
    <link href="css/inputHasRightBtn.css" type="text/css" rel="stylesheet">
<!--     <link href="css/login.css" type="text/css" rel="stylesheet"> -->
  	<link href="css/jquery-ui.min.css" type="text/css" rel="stylesheet">
  	<link href="css/treeGrid.css" type="text/css" rel="stylesheet">
  	<link href="css/ui.jqgrid.css" type="text/css" rel="stylesheet">
  	
	<link href="css/wizard-nav.css" rel="stylesheet" type="text/css"  />
	<link href="css/nggrid/ng-grid.css" type="text/css"  rel="stylesheet">
	<link href="js/lib/ui-grid/ui-grid.min.css" type="text/css"  rel="stylesheet">
	<link href="css/iconMapWhite.css" type="text/css"  rel="stylesheet">
	<link href="css/custom.css" rel="stylesheet" type="text/css"  />
	<link id="changeCss" href="css/blueTheme.css" rel="stylesheet" type="text/css"  />
	<link href="css/stream-v1.css" rel="stylesheet" type="text/css"  />
    <link href="css/elastislide.css" rel="stylesheet" type="text/css" />
<!-- 	<link href="css/jquery.gridster.css" rel="stylesheet" type="text/css" /> -->
	<link href="css/migrateHistory.css" rel="stylesheet" type="text/css" />
	<link href="css/mapping.css" rel="stylesheet" type="text/css" />
	<link href="css/topology.css" rel="stylesheet" type="text/css" />
	<link href="css/jquery-ui-slider-pips.min.css" rel="stylesheet" type="text/css" />
	<link href="css/jedate.css" rel="stylesheet" type="text/css" />
	<link href="css/buttons/buttons.dataTables.css" rel="stylesheet" type="text/css" />
	<link href="css/buttons/jquery.dataTables.css" rel="stylesheet" type="text/css" />
	
	<script type="text/javascript" src="js/constant.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular.min.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular-messages.min.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular-ui-router.min.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/resource.js"></script>
    <script type="text/javascript" src="js/lib/angularjs/angular-translate.min.js"></script>
<!--     <script type="text/javascript" src="js/lib/loader-static-files.js"></script> -->
    <script type="text/javascript" src="js/lib/carousel-form.js"></script>
 	<script type="text/javascript" src="js/lib/ui-bootstrap-tpls-0.12.0.js"></script>

	<script type="text/javascript" src="js/lib/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="js/lib/jquery-ui.js"></script> 
	<script type="text/javascript" src="js/lib/jquery/checkbox.js"></script>
    <script type="text/javascript" src="js/lib/jquery/jquery.resize.js"></script>
	<script type="text/javascript" src="js/lib/jquery.i18n.properties-1.0.9.js"></script>
	<script type="text/javascript" src="js/lib/jquery-ui-slider-pips.js"></script>
<!-- 	<script type="text/javascript" src="js/lib/jquery/jquery.md5.js"></script> -->
	<script type="text/javascript" src="js/lib/jquery/jquery.jqGrid.min.js"></script>
	
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap-treeview.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap-datetimepicker.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/switch/sanitize.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/switch/angular-toggle-switch.js"></script>
	<script type="text/javascript" src="js/lib/nggrid/ng-grid.debug.js"></script>
	<!-- <script type="text/javascript" src="js/lib/ui-grid/ui-grid.min.js"></script> -->
	<script type="text/javascript" src="js/lib/ui-grid/ui-grid.js"></script>
	<script type="text/javascript" src="js/lib/ui-grid/draggable-rows.js"></script>
	<script type="text/javascript" src="js/lib/ace/jquery.nestable.js"></script>
	<script type="text/javascript" src="js/lib/bootstrap/bootstrap-contextmenu.js"></script>
	<script type="text/javascript" src="js/lib/treegrid/tree-grid-directive.js"></script>
	<script type="text/javascript" src="js/lib/icheck/icheck.min.js"></script>
	<script type="text/javascript" src="js/lib/jedate/jedate.js"></script>
	<script type="text/javascript" src="js/lib/dashboard/echarts_vminfo.js"></script>
	<script type="text/javascript" src="js/lib/dashboard/modernizr.js"></script>
    <script type="text/javascript" src="js/lib/dashboard/jquery.elastislide.js"></script>
    <script type="text/javascript" src="js/lib/cryptoJS.js"></script>
    <script type="text/javascript" src="js/lib/mode-ecb.js"></script>
<!-- 	<script type="text/javascript" src="js/lib/dashboard/jquery.gridster.js"></script> -->
	
	<script type="text/javascript" src="js/lib/My97DatePicker/WdatePicker.js"></script>
	
    <script type="text/javascript" src="js/lib/iscroll.js"></script>
    <script type="text/javascript" src="js/app_vm.js"></script>
	<script type="text/javascript" src="js/filter/filters.js"></script>
	<script type="text/javascript" src="js/service/services.js"></script>
	<script type="text/javascript" src="js/service/httpservice.js"></script>
	<script type="text/javascript" src="js/service/httpService2.js"></script>
	<script type="text/javascript" src="js/service/gridservice.js"></script>
	<script type="text/javascript" src="js/service/echartsServices.js"></script>
	<script type="text/javascript" src="js/service/cloudServices.js"></script>
	<script type="text/javascript" src="js/service/vmServices.js"></script>
	<script type="text/javascript" src="js/service/hostServices.js"></script>
	<script type="text/javascript" src="js/service/clusterServices.js"></script>
	<script type="text/javascript" src="js/service/permissionService.js"></script>
	<script type="text/javascript" src="js/service/systemMgrServices.js"></script>
	<script type="text/javascript" src="js/service/templateServices.js"></script>
	<script type="text/javascript" src="js/service/lockServices.js"></script>
	<script type="text/javascript" src="js/service/localStorageService.js"></script>
	<script type="text/javascript" src="js/service/uiGridService.js"></script>
	<script type="text/javascript" src="js/service/tableStateService.js"></script>
	<script type="text/javascript" src="js/service/IpServices.js"></script>
	<script type="text/javascript" src="js/gridCellTemplate.js"></script>
	<%
		String locale = request.getParameter("locale");
		if (locale == null) {
		  locale = java.util.Locale.getDefault().toString();
	  	}
	%>
	<%	if (locale.startsWith("zh"))  {%>
			<script type="text/javascript" src="js/resource_cn.js"></script>
		    <script type="text/javascript" src="js/lib/jedate/i18n/jeDate_resource_cn.js"></script>
		    <script>var globalLang = "zh_CN";</script>
	<%	} else { %>
			<script type="text/javascript" src="js/resource_en.js"></script>
			<script>var globalLang = "en_US";</script>
	<%	} %>
	<script type="text/javascript" src="js/l10n.js"></script>
	
	<script type="text/javascript" src="js/serviceAsync/vmServiceAsync.js"></script>
    <script type="text/javascript" src="js/serviceAsync/antivirusServiceAsync.js"></script>
   
	<script type="text/javascript" src="js/controller/controllers.js"></script>
    <script type="text/javascript" src="js/controller/loginController.js"></script>
    <script type="text/javascript" src="js/controller/hostChartController.js"></script>
    <script type="text/javascript" src="js/controller/hostController2.js"></script>
    <script type="text/javascript" src="js/controller/vmController.js"></script>
    <script type="text/javascript" src="js/controller/ListController.js"></script>
    <script type="text/javascript" src="js/controller/vmRecycleController.js"></script>
    <script type="text/javascript" src="js/controller/templateController.js"></script>
    <script type="text/javascript" src="js/controller/systemController.js"></script>
	<script type="text/javascript" src="js/directive/inputTagDirectives.js"></script>
	<script type="text/javascript" src="js/directive/chartDirectives.js"></script>
	<script type="text/javascript" src="js/lib/stream/stream.js"></script>	
	<script type="text/javascript" src="js/lib/jquery.messager.js"></script>
	</head>
	<body id="bodyid" style='width:100%' ng-click='docClick($event)'>
	   <div class="height100" ui-view></div>
	</body>
</html>
