<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*,com.virtual.common.StringManager,com.virtual.plat.server.uidefine.UIItemMgr" %>
<% 
response.setHeader("Pragma","No-cache"); 
response.setHeader("Cache-Control","no-cache"); 
response.setDateHeader("Expires", 0); 
%> 
<% 
	Locale myLocale = request.getLocale();
	String ctx = request.getContextPath();
	StringManager strMng = StringManager.getManager(UIItemMgr.class);
%> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">



<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0"> 
		
		<script type="text/javascript" src="<%=ctx %>/js/lib/jquery-1.9.1.js"></script>
		<script>
		String.prototype.startWith = function(s) {
			if (s == null || s == "" || this.length == 0 || s.length > this.length)
				return false;
			if (this.substr(0, s.length) == s)
				return true;
			else
				return false;
			return true;
		};
		/** judge BroswerType by userAgent
		 *  desc:IE		!!window.ActiveXObject return true under all the IE broswers except for IE11,
		 *				window.WebSocket is supported by IE10+
		 *       Firefox	!!document.getBoxObjectFor return true under all the Firefox broswers except for the updated Firefox 
		 */
		var checkHtml5 = function() {
			var Sys = {};
	        var ua = navigator.userAgent.toLowerCase();
	        "ActiveXObject" in window ? Sys.ie = (ua.match(/msie ([\d.]+)/) ? ua.match(/msie ([\d.]+)/)[1] : null) :
		    ua.indexOf("firefox") > -1 ? Sys.firefox = (ua.match(/firefox\/([\d.]+)/) ? ua.match(/firefox\/([\d.]+)/)[1] : null) :
		    window.MessageEvent && !document.getBoxObjectFor && ua.indexOf("chrome") > -1 ? Sys.chrome = (ua.match(/chrome\/([\d.]+)/) ? ua.match(/chrome\/([\d.]+)/)[1] : null) : 0;
		    //以下进行测试
	        var browserFlag = true;
	        if(Sys.ie && (Sys.ie.startWith('7.') || Sys.ie.startWith('8.'))){
	        	browserFlag = false;
	        }
	        //修改问题单201703030412，更新浏览器版本检测。
	        if(Sys.firefox && (Sys.firefox.startWith('4.') || Sys.firefox.startWith('5.')
	         || Sys.firefox.startWith('6.')  || Sys.firefox.startWith('7.')
	         || Sys.firefox.startWith('8.')  || Sys.firefox.startWith('9.')
	         || Sys.firefox.startWith('10.') || Sys.firefox.startWith('11.')
	         || Sys.firefox.startWith('12.') || Sys.firefox.startWith('13.')
	         || Sys.firefox.startWith('14.') || Sys.firefox.startWith('15.')
	         || Sys.firefox.startWith('16.') || Sys.firefox.startWith('17.')
	         || Sys.firefox.startWith('18.') || Sys.firefox.startWith('19.')
	         || Sys.firefox.startWith('20.') || Sys.firefox.startWith('21.'))) {
	            browserFlag = false;
	        }
	        if(Sys.chrome && (Sys.chrome.startWith('4.') || Sys.chrome.startWith('5.') 
	         || Sys.chrome.startWith('6.')  || Sys.chrome.startWith('7.') 
	         || Sys.chrome.startWith('8.') || Sys.chrome.startWith('9.') 
	         || Sys.chrome.startWith('10.') || Sys.chrome.startWith('11.') 
	         || Sys.chrome.startWith('12.') || Sys.chrome.startWith('13.')
	         || Sys.chrome.startWith('14.') || Sys.chrome.startWith('15.')
	         || Sys.chrome.startWith('16.') || Sys.chrome.startWith('17.')
	         || Sys.chrome.startWith('18.') || Sys.chrome.startWith('19.')
	         || Sys.chrome.startWith('20.') || Sys.chrome.startWith('21.')
	         || Sys.chrome.startWith('22.') || Sys.chrome.startWith('23.')
	         || Sys.chrome.startWith('24.') || Sys.chrome.startWith('25.')
	         || Sys.chrome.startWith('26.') || Sys.chrome.startWith('27.')
	         || Sys.chrome.startWith('28.') || Sys.chrome.startWith('29.')
	         || Sys.chrome.startWith('30.') || Sys.chrome.startWith('31.')
	         || Sys.chrome.startWith('32.') || Sys.chrome.startWith('33.')
	         || Sys.chrome.startWith('34.') || Sys.chrome.startWith('35.')
	         || Sys.chrome.startWith('36.') || Sys.chrome.startWith('37.')
	         || Sys.chrome.startWith('38.'))) {
	            browserFlag = false;
	        }
	    	
	    	var canvasFlag;
			try {
				document.createElement('canvas').getContext('2d');
				canvasFlag = true;
			} catch (e) {
				canvasFlag = false;
			}
			
			return window.WebSocket && browserFlag && canvasFlag;
		};
		
		
		$(document).ready(function(){
			
			var ua = navigator.userAgent.toLowerCase();
		     var ie = (ua.match(/msie ([\d.]+)/) ? ua.match(/msie ([\d.]+)/)[1] : null);
		     var supportFlag = true;
		     if (ie&&ie.startWith('6')) {
			     	supportFlag = false;
			     	var button = $("a.button");
			    	button.css("padding-bottom", "0px").css("padding-top", "12px");
			 }
		     
		     if (!(supportFlag && checkHtml5())) {
		    	 var el = document.getElementById('modal-overlay');
		    	 el.style.visibility = "visible";
		    	 $("#img").attr("src", "css/img/loginpage.png");
		     } else {
		    	var form = document.getElementById("form");
		    	form.submit();
		     }
		});
		
		function overlay() {
			try {
				window.opener = window;
				var win = window.open("", "_self");
				win.close();
			} catch (e) {
				
			}
		}
		</script>
		<style type="text/css">
		html,body,.height100{
			margin: 0;
		    padding: 0;
			height:100%;
			overflow-y:hidden;
			font-family: Arial,"Microsoft Yahei","微软雅黑",SimSun;
			font-size: 14px;
		}
		.ieBg{
			width:100%;
			height:100%;
			display:block;
		}
		 #modal-overlay {
			visibility : hidden;
			position: absolute;
			width:100%;
			height:100%;
			top:0px;
			left:0px;
			text-align:center;
			z-index:1000; 
			background-color: #333;
			opacity:0.7; 
			filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
			
		} 
		.modal-data {
			width:300px;
			margin:200px auto;
			background-color: #fff;
			border:1px solid #000;
			padding:15px;
			text-align:left;
			z-index:10000;
		}
		
		a.button {
			
			color:#fff;
			background-color:#436bb3;
			display:block;
			text-align:center;
			height:24px;
			margin:auto;
			padding:4px 0 6px 0;
			text-decoration:none;
			width:80px;
		}
		
		a.button > span {
			cursor:pointer;
			display:block;
			height:20px;
			padding:5px 0 5px 0px;
		}
		
		 
		
		</style>
	</head>
	<body >
		<div class="height100">
			 <img  id="img" class="height100 ieBg" />
	         <div id="modal-overlay">
	         	<div class="modal-data">
	         		<p><%= strMng.getString("checkBrowser.tip") %></p>
	         		<a class="button" onclick="overlay()" ><span><%= strMng.getString("close") %></span></a>
	         	</div>
	         </div> 
	         <form action="checkEntryServlet" method="post" id="form">
	         </form>   
	    </div>
	</body>
</html>