<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html >
	<head>
	<meta charset="UTF-8">
	<base href="<%=request.getContextPath()%>/">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<script type="text/javascript" src="js/lib/jquery-1.9.1.min.js"></script>
	<script type="text/javascript">
	   var pathName = document.location.pathname;
       var index = pathName.substr(1).indexOf("/");
       var contextPath = "/" + pathName.substring(1,index+1);
       if (window.location.protocol == 'http:') {  
           url = 'ws://' + window.location.host + contextPath + "/websocket";  
       } else {  
           url = 'wss://' + window.location.host + contextPath + "/websocket"; 
       }
       var ws = null;
       if ('WebSocket' in window) {
           	ws = new WebSocket(url);
       } else if ('MozWebSocket' in window) {
           	ws = new MozWebSocket(url);
       } else {
           	ws = new WebSocket(url); 
       }
       ws.onopen = function () {  
    	   
       };  
       ws.onmessage = function (event) { 
           	 // session失效
           if (event.data == 'sessionInvalid') {
               	 
           } else if (event.data){
              // 任务更新
              var obj = jQuery.parseJSON(event.data);
              var refreshData = obj.refreshData;
              var needRefresh = false;
              var hideMessage = false; //只需要刷新，不需要出现任务台 标识。
              if ($.isArray(refreshData)) {
            		// 0 成功 1失败 2部分成功
            		// 成功处理
            		if (obj.progress == 100 && obj.result != 1 && refreshData.length > 0) {
            		   needRefresh = true;
            		}
            		// 特殊处理100%立即刷新,无论成功失败
            		var data0 = refreshData[0];
        		    if (typeof(data0) != 'undefined' && typeof(data0.immediateRefresh) != 'undefined' && data0.progress == 100) {
        				needRefresh = true;
        			}       				 
        			if (typeof(data0) != 'undefined' && data0.hideMessage === true) {
        				hideMessage = true;
        			}
              }
            		
              if (!hideMessage) {
            	 try {
            			window.parent.postMessage(obj, "*");
            		 } catch(err) { }
              }
            } 
        };  
        ws.onclose = function (event) { 
           	 if (ws != null) {  
           		 ws = null;  
                }  
           	 console.log('websocket.onclose method is called and event.reason:' + event.reason);  
        };  
        ws.onerror = function (event) {
           	 // 产生异常
           	 console.error('websocket.onerror method is called and event:' + event);  
        }; 
	</script>
	</head>
	<body>
<!-- 	   <div class="height100" ui-view></div> -->
	</body>
</html>
