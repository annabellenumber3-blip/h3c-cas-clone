<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.virtual.common.StringManager"%>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
StringManager sm = StringManager.getManager(StringManager.class);
String name = sm.getString("name");
String apply = sm.getString("apply");
String applyBackupStrategy = sm.getString("applyBackupStrategy");
String modifyBackupStrategyTitle = sm.getString("modifyBackupStrategyTitle");
String maxLength32 = sm.getString("maxNameRange", 32);
String maxLength120 = sm.getString("maxNameRange", 120);
String nullTip = sm.getString("nullTip");
String nameIsNumber = sm.getString("nameIsNumber");
String nameNoChRange = sm.getString("nameNoChRange");
String nameNoChRangeNew = sm.getString("nameNoChRangeNew");
String strategynameNoChRange = sm.getString("strategynameNoChRange");
String peridoTime = sm.getString("peridoTime");
String dayTime = sm.getString("dayTime");
String weekTime = sm.getString("weekTime");
String monthTime = sm.getString("monthTime");
String dateTime = sm.getString("dateTime");
String timeUnit = sm.getString("timeUnit");
String date = sm.getString("date");
String previous = sm.getString("previous");
String nextStep = sm.getString("nextStep");
String os = sm.getString("os");
String expireDate = sm.getString("expireDate");
String desc = sm.getString("desc");
String status = sm.getString("status");
String memory = sm.getString("memory");
String processing= sm.getString("processing");
String strategyexists = sm.getString("strategyexists");
String effectTimeIsNeed = sm.getString("effectTimeIsNeed");
String tips = sm.getString("tips");
String oneVmNeeded = sm.getString("oneVmNeeded");
String monthEnd = sm.getString("monthEnd");
String monday = sm.getString("monday");
String tuesday = sm.getString("tuesday");
String wednesday = sm.getString("wednesday");
String thursday = sm.getString("thursday");
String friday = sm.getString("friday");
String saturday = sm.getString("saturday");
String sunday = sm.getString("sunday");
String notSpecialCharacter = sm.getString("notSpecialCharacter2",">","<","&");
//String type = request.getParameter("type");
String keepTimes = sm.getString("keepTimes");
String autoReplace = sm.getString("autoReplace");
String autoReplaceDesc = sm.getString("autoReplaceDesc");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <script src="js/instance.js"></script>
   <script type="text/javascript" src="js/applyBackupStrategy.js"></script>
<style type="text/css">
    body {
        font-size: 12px;
        line-height: 16px;
    }
    a {
        color: #1f90c8;
        text-decoration: none;
    }

    .scheduler-days .scheduler-day {
        border: 1px solid #e2e2e2;
        background: #eee;
        color: #555;
        line-height: 35px;
        vertical-align: middle;
        padding: 0 10px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        margin-right: 2px;
        display: inline-block;
    }

    .scheduler-days .scheduler-day.selected {
        background: #57b382;
        border-color: #4fae7b;
        font-weight: 700;
        color: #fff;
    }

    .scheduler-days.monthly {
        width: 390px;
    }
 
     .scheduler-days.weekly .scheduler-day {
        width: 22px;
        text-align: center;
        margin-bottom: 2px;
    }
    
    .scheduler-days.monthly .scheduler-day {
        width: 15px;
        text-align: center;
        margin-bottom: 2px;
    }

    .scheduler-days.monthly .scheduler-eom {
        width: 30px;
    }
</style>
<title><%= applyBackupStrategy%></title>
</head>
<body>
 <input id="nullTip" type="hidden" value="<%=nullTip%>">
  <input id="maxLength" type="hidden" value="<%=maxLength32%>">
  <input id="maxLength120" type="hidden" value="<%=maxLength120%>">
  <input id="nameIsNumber" type="hidden" value="<%=nameIsNumber%>">
   <input id="nameNoChRange" type="hidden" value="<%=nameNoChRange%>">
   <input id="nameNoChRangeNew" type="hidden" value="<%=nameNoChRangeNew%>">
   <input id="strategynameNoChRange" type="hidden" value="<%=strategynameNoChRange%>">
   <input id="processing" type="hidden" value="<%=processing%>">
   <input id="strategyexists" type="hidden" value="<%=strategyexists%>">
   <input id="effectTimeIsNeed" type="hidden" value="<%=effectTimeIsNeed%>">
   <input id="notSpecialCharacter" type="hidden" value="<%=notSpecialCharacter%>">
  <div id="modal" class="modal" style="position: absolute; top:30%; margin-top:-125px;left:50%;margin-left:-250px;font-size:14px;width:620px;height:450px">
      <div class="modal-header"  style="cursor:move" >
            <h5 id="title"><%= applyBackupStrategy%></h5>
            <h5 id="title2"><%= modifyBackupStrategyTitle%></h5>
            <div id="modal-close" onclick="closeApplyStrategy()"><span class="single-word-icon"></span></div>
      </div>
      <div style="height:30px"></div>
    <div class="modal-content">
        <form id="applyDiskFormId" class="form form-horizontal" style="border:1px;height:300px">
          <div class="step-basicinfo">
            <div class="item">
                <div class="control-label" style="width:100px">
                    <%=name %><span style="color: red">*</span>
                </div>
                <div class="controls" >
                    <input id="nameInputId" type="text"  name="inputName" style="width: 200px; height: 20px;">
                </div>
                <div class="type" >
                    <input id="typeInputId" type="text"  name="inputType" style="width: 0px; height: 0px;">
                </div>
                <div class="type" >
                    <input id="vmIdList" type="text"  name="inputType" style="width: 0px; height: 0px;">
                </div>
            </div>
            <div class="item">
                <div class="control-label" style="width:100px">
                    <%=desc %><span style="font-size:12px;">&nbsp;&nbsp;</span>
                </div>
                <div class="controls" >
                     <textarea id="descId" name="instance_name" data-fieldLen="120" style="width: 300px; resize:none; height:56px;"></textarea>
                </div>
            </div>
            <div class="item" >
                <div class="control-label" style="width:100px">
                    <%=peridoTime %><span style="font-size:12px;">&nbsp;&nbsp;</span>
                </div>
                <div class="controls" >
                  <select id="resultSelect"
                  style="font-size: 14px; width: 80px; height: 30px; font-family: 'Microsoft Yahei', '微软雅黑', serif"
                  onchange="selectDate(this)">
                  <option value='2'><%=dayTime %>
                  <option value='1'><%=weekTime %>
                  <option value='0'><%=monthTime %>
                  </select>
                </div>
            </div>
            
            <div class="item" >
                <div id="dateInfo" class="control-label" style="width:100px">
                    <%=date %><span style="color: red">*</span>
                </div>
                <div class="scheduler-days" id="scheduler-dayinfo" style="display: block;min-height: 35px;margin-left: 110px;margin-right: 100px;">
	                <div class="scheduler-days weekly" id="dayofweek" style="margin-right: 64px"><a id="2" class="scheduler-day selected" name="weekSelected" href="#" data-value="2"><%=monday%></a><a
	                    id="3" class="scheduler-day " name="weekSelected" href="#" data-value="3"><%=tuesday%></a><a id="4" class="scheduler-day " name="weekSelected" href="#" data-value="4"><%=wednesday%></a><a
	                    id="5" class="scheduler-day " name="weekSelected" href="#" data-value="5"><%=thursday%></a><a id="6" class="scheduler-day " name="weekSelected" href="#" data-value="6"><%=friday%></a><a
	                    id="7" class="scheduler-day " name="weekSelected" href="#" data-value="7"><%=saturday%></a><a id="1" class="scheduler-day " name="weekSelected" href="#" data-value="1"><%=sunday%></a>
	                </div>
	                <div class="scheduler-days monthly" id="dayofmonth"><a class="scheduler-day selected" href="#" id="1" data-value="1">1</a><a
		                class="scheduler-day " href="#" id="2" data-value="2">2</a><a class="scheduler-day " href="#" id="3" data-value="3">3</a><a
		                class="scheduler-day " href="#" id="4" data-value="4">4</a><a class="scheduler-day " href="#" id="5" data-value="5">5</a><a
		                class="scheduler-day " href="#" id="6" data-value="6">6</a><a class="scheduler-day " href="#" id="7" data-value="7">7</a><a
		                class="scheduler-day " href="#" id="8" data-value="8">8</a><a class="scheduler-day " href="#" id="9" data-value="9">9</a><a
		                class="scheduler-day " href="#" id="10" data-value="10">10</a><a class="scheduler-day " href="#" id="11" data-value="11">11</a><a 
		                class="scheduler-day " href="#" id="12" data-value="12">12</a><a class="scheduler-day " href="#" id="13" data-value="13">13</a><a 
		                class="scheduler-day " href="#" id="14" data-value="14">14</a><a class="scheduler-day " href="#" id="15" data-value="15">15</a><a
		                class="scheduler-day " href="#" id="16" data-value="16">16</a><a class="scheduler-day " href="#" id="17" data-value="17">17</a><a 
		                class="scheduler-day " href="#" id="18" data-value="18">18</a><a class="scheduler-day " href="#" id="19" data-value="19">19</a><a 
		                class="scheduler-day " href="#" id="20" data-value="20">20</a><a class="scheduler-day " href="#" id="21" data-value="21">21</a><a
		                class="scheduler-day " href="#" id="22" data-value="22">22</a><a class="scheduler-day " href="#" id="23" data-value="23">23</a><a 
		                class="scheduler-day " href="#" id="24" data-value="24">24</a><a class="scheduler-day " href="#" id="25" data-value="25">25</a><a 
		                class="scheduler-day " href="#" id="26" data-value="26">26</a><a class="scheduler-day " href="#" id="27" data-value="27">27</a><a
		                class="scheduler-day " href="#" id="28" data-value="28">28</a><a class="scheduler-day " href="#" id="29" data-value="29">29</a><a 
		                class="scheduler-day " href="#" id="30" data-value="30">30</a><a class="scheduler-day " href="#" id="31" data-value="31">31</a><a 
		                class="scheduler-day scheduler-eom" href="#" id="-1" data-value="-1"><%=monthEnd %></a></div>
                </div>   
            </div>         
            <div class="item" >
                <div class="control-label" style="width:100px">
                    <%=dateTime %><span style="font-size:12px;">&nbsp;&nbsp;</span>
                </div>
                <div class="controls">
                    <input id="timeInputId" class="easyui-numberspinner" data-options="min:0,max:23" 
                      style="width:60px;height:30px" value=0></input>&nbsp;<%= timeUnit%>
                </div>
            </div>
            <!-- 新增 -->
            <!-- 保留个数 -->
            <div class="item" >
                <div class="control-label" style="width:100px">
                    <%=keepTimes %><span style="font-size:12px;">&nbsp;&nbsp;</span>
                </div>
                <div class="controls">
                    <input id="keepNumberInputId" class="easyui-numberspinner" data-options="min:1,max:30" 
                      style="width:60px;height:30px" value=8></input>
                </div>
            </div>
            <!-- 是否自动替换 -->
            <div class="item">
            	<div class="control-label" style="width:100px">&nbsp;&nbsp;</div>
                <div>
                    <input id="autoReplacementInputId" type="checkbox" checked="checked"><%=autoReplace %>
                </div>
            </div>
            <div class="item">
	          	<span style="color:red"><%=autoReplaceDesc %></span>
	        </div>
            <div class="step-next" style="margin-bottom:0px;margin-right:50px;padding-left:450px">
                <input class="btn btn-next" id="btnNext" style="float:right" type="button" value="<%=nextStep%>" onclick="nextPage()">
            </div>
          </div>
          <div class="step-vminfo">
            <div style="padding:0 0 20px 10px ; width:550px">
                <table id="my-instances" style="height:350px;width:570px">
                </table>
            </div>
            
            <div class="form-actions" style="margin-bottom:0px;margin-right:50px;margin-left:50px;padding-left:20px" >
                <input class="btn"  type="button" value="<%=previous %>" onclick="previousPage()"> 
                <input class="btn"  id="btnConfirm" style="float:right" type="button" value="<%=apply %>" onclick="submitApply()">
                <input class="btn"  id="vmSelected" onclick="getVmSelected()">               
            </div>
          </div>
        </form>
    </div> 
  </div>

 <script>
 $(document).ready(function(){
	 
	  $(".step-basicinfo").show();
	  $(".step-vminfo").hide();
      $("div.scheduler-days").hide();
      $("#dateInfo").hide();
      $("#title2").hide();
      $("#typeInputId").hide();
      $("#vmIdList").hide();
      $("#title").show();
      $("#vmSelected").hide();
 });
 
   $(function(){
       $("#timeInputId, #keepNumberInputId").numberspinner({
           onSpinUp:function(){
               showRightResult($(this));
           },
           onSpinDown:function() {
               showRightResult($(this));
           }
       });
       
       $(".scheduler-day").bind("click", timeClick);
       $("#nameInputId").bind("keyup",checkNameVal);
       //修改问题单201505220148  描述检查    -add by h10630 2015.5.27
       $("#descId").bind("keyup",checkDescVal);
       $("#dayofweek").bind("click",checkDayVal);
       $("#dayofmonth").bind("click",checkDayVal);
       $("#resultSelect").bind("click",checkDayVal);
       $("#timeInputId").bind("keyup",checkNumber);
       $("#keepNumberInputId").bind("keyup",checkKeepNumber);
       $(".scheduler-day").attr("href", "javascript:void(0)");
   });
   
   function initVmList() {
	   var strategyId = $('#typeInputId').val();
       $("#my-instances").datagrid({ 
           url:'servlet/backupServlet?way=queryStrategyVmList&strategyId=' + strategyId, 
           singleSelect:false,
           fitColumns:true,
           idField:'id',
           onClickRow:function(rowIndex, rowData){
               //$("#restoreBtn, #deleteBtn").removeClass("btn-forbidden");
           },
           onLoadSuccess:function(data) {
        	   $("#vmSelected").trigger("click");
               $("div.itemtooltip").jtooltip();
               if (data != '' && typeof data.title != "undefined" && typeof data.message != "undefined") {
                     $.messager.show({
                           title : data.title,
                           msg : data.message,
                           showType : 'show'
                       });
                    return false;
               }
           },
           columns:[[  
                   {field:'title',title:'<%=name%>',width:125,formatter:showTitle},
                   {field:'id',title:'',width:0, hidden:true} ,
                   {field:'cpu',title:'CPU',width:60}, 
                   {field:'memory',title:'<%=memory%>',width:100,formatter:showMemory},
                   {field:'osDesc',title:'<%=os%>',width:230,formatter:showTitle}
               ]],
               pagination:false
       });
       
   }
   
   $(function () {
       $("a.scheduler-day").bind("click", function (event) {
           if ($(this).hasClass("selected")) {
               $(this).removeClass("selected");
           } else {
               $(this).addClass("selected");
           }

           console.log("month selected!");
           var mounthSelected = [];
           $("div.scheduler-days.monthly a.scheduler-day.selected").each(function(index, data) {
               mounthSelected.push($(data).attr("data-value"));
           });
           console.log(mounthSelected);
           console.log("week selected!");
           mounthSelected = [];
           $("div.scheduler-days.weekly a.scheduler-day.selected").each(function(index, data) {
               mounthSelected.push($(data).attr("data-value"));
           });
           console.log(mounthSelected);
       });
   });
   
 //提交申请云备份
   function submitApply() {
       var strategyName = $.trim($("#nameInputId").val());
       var strategyId = $("#typeInputId").val();
       var strategyDesc = $("#descId").val();
       var frequency = $("#resultSelect").val();
       var hour = $("#timeInputId").val();
       //问题单201506170234 新增保留个数、自动替换旧备份字段  by f10574 20150624
       var keepNumber = $("#keepNumberInputId").val();
       var autoReplacement = $("#autoReplacementInputId").attr("checked") == "checked" ? 1 : 0;
       var vmSelected = $("#my-instances").datagrid("getSelections");
       var vmSelectedId = [];
       for (var i = 0; i < vmSelected.length; i ++ ) {
           vmSelectedId.push(vmSelected[i].id);
       }
       if (vmSelectedId.length == 0) {
           $.messager.alert('<%=tips%>', '<%=oneVmNeeded%>','info');
           return;
       }
       
       var mounthSelected = [];
       $("div.scheduler-days.monthly a.scheduler-day.selected").each(function(index, data) {
           mounthSelected.push($(data).attr("data-value"));
       });
       
       var weekSelected = [];
       $("div.scheduler-days.weekly a.scheduler-day.selected").each(function(index, data) {
           weekSelected.push($(data).attr("data-value"));
       });
       
       var xml = '';
       xml += "<cloudBackUpStrategyWorkFlow>";
       xml += "<name>" + strategyName +"</name>";
       xml += "<description>" + strategyDesc + "</description>";
       xml += "<frequency>" + frequency + "</frequency>";
       
       if (frequency == 0) {
           xml += "<day>" + mounthSelected + "</day>";
       } else if (frequency == 1) {
           xml += "<day>" + weekSelected + "</day>";
       } else {
           xml += "<day></day>";
       }
       xml += "<hour>" + hour + "</hour>";
	   //问题单201506170234 新增保留个数、自动替换旧备份字段  by f10574 20150624
       xml += "<keepNumber>" + keepNumber + "</keepNumber>";
       xml += "<autoReplacement>" + autoReplacement + "</autoReplacement>";
       xml += "<domainIdList>" + vmSelectedId + "</domainIdList>";
       xml += "<strategyId>" + strategyId + "</strategyId>";
       xml += "</cloudBackUpStrategyWorkFlow>";
       
       $.ajax({
           type : "POST",
           dataType : "json",
           url : "servlet/backupServlet?way=applyStrategy",
           data:"xml=" + encodeURIComponent(encodeURIComponent(xml))+"&vmidList="+vmSelectedId,
           beforeSend : function(xhr) {
               showWait($("#processing").val(),999999);
           },
           success : function(result) {
               hideWait();
               $("#applyDiskDiv").hide();
               if (result != null && typeof result != 'undefined') {
                   if (typeof result == 'object') {
                       if (result.success) {
                           $("#diskListId").datagrid('reload'); 
                           $.messager.show({
                               title : result.title,
                               msg : result.message,
                               showType : 'show'
                           });
                           $(".window-overlay").css("display", "none");
                       } else {
                           $.messager.show({
                               title : result.title,
                               msg : result.message,
                               showType : 'show'
                           });
                       }
                   }
               }
           },
           error : function(xhr, textStatus, errorThrown) {
               hideWait();
           }
       });
   }
   
 </script>
</body>
</html>