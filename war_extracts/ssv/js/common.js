/**
 * 
 */
function ClearSubmit(e, id) {
    if (e.keyCode == 13 && e.target.tagName != 'TEXTAREA') {
    	stopDefault(e);
    	$("#" + id).click();
    }
}
function stopDefault(e){
    //非IE
    if(e && e.preventDefault)
      e.preventDefault();
    //IE
    else
      window.event.returnValue = false;
}
function getXmlDoc() {
	var xmlDoc;
	try { //Internet Explorer
		  xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	   }
	 catch(e){
		 try{
		     xmlDoc = document.implementation.createDocument("","",null);
		  }
		  catch(e) {
		    alert(e.message);
		  }
	  }

	  return xmlDoc;

}

function showWait(str, zindex) {
	var html = "processing, please wait...";
	if (typeof str != "undefined") {
		html = str;
	}
	var div1 = "";
	var div2 = "";
	if (typeof zindex == "number") {
		div1 = "<div class=\"datagrid-mask\" style='z-index:"+zindex+"'></div>";
		div2 = "<div class=\"datagrid-mask-msg\" style='z-index:"+zindex+"'></div>";
	} else {
		div1 = "<div class=\"datagrid-mask\"></div>";
	    div2 = "<div class=\"datagrid-mask-msg\"></div>";
	}
	$(div1).css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");
	$(div2).html(html).
	appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2}); 
}

function hideWait() {
	$(".datagrid-mask").remove();  
	$(".datagrid-mask-msg").remove();  
}
var EventUtil = {
		addHandler: function(element, type, handler) {
			if (element.addEventListener){
				element.addEventListener(type,handler, false);
			} else if (element.attachEvent) {
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		},
		removeHandler:function(element, type, handler){
			if (element.removeEventListener){
				element.removeEventListener(type,handler, false);
			} else if (element.detachEvent) {
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},
		getEvent:function(event) {
			return event ? event: window.event;
		},
		getTarget:function(event) {
			return event.target||event.srcElement;
		},
		preventDefault:function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		}


};
var DragDrop = function() {
	var dragging = null;
	var diffX=0;
	var diffY=0;
	function handleEvent(event){
		//获取事件和目标
		 event = EventUtil.getEvent(event);
		 var target = EventUtil.getTarget(event);
		 //确定事件类型
		 switch(event.type) {
			 case "mousedown" :
				 if (target.className.indexOf("draggable") > -1) {
					 dragging = target;
					 diffX = event.clientX - target.offsetLeft;
					 diffY = event.clientY - target.offsetTop;
				 }
				 break;
			 case "mousemove" :
				 if (dragging != null) {
					 //获取事件
					 event = EventUtil.getEvent(event);
					 dragging.style.left = (event.clientX - diffX) + "px";
					 dragging.style.top = (event.clientY - diffY) + "px";
				 }
				 break;
			 case "mouseup":
				 dragging = null;
				 break;
		 }
	};
	//公共接口
	return {
		enable:function() {
			EventUtil.addHandler(document, "mousedown", handleEvent);
			EventUtil.addHandler(document, "mousemove", handleEvent);
			EventUtil.addHandler(document, "mouseup", handleEvent);
			
		},
		disable:function() {
			EventUtil.removeHandler(document, "mousedown", handleEvent);
			EventUtil.removeHandler(document, "mousemove", handleEvent);
			EventUtil.removeHandler(document, "mouseup", handleEvent);
		}
	};
}();

function drag(a,header){
	var o=header.parentNode;
    var d=document;if(!a)a=window.event; 
       if(!a.pageX)a.pageX=a.clientX; 
       if(!a.pageY)a.pageY=a.clientY; 
    var x=a.pageX,y=a.pageY; 
    if(o.setCapture) 
        o.setCapture(); 
    else if(window.captureEvents) 
        window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); 
    var backData = {x : o.style.top, y : o.style.left}; 
    d.onmousemove=function(a){ 
        if(!a)a=window.event; 
        if(!a.pageX)a.pageX=a.clientX; 
        if(!a.pageY)a.pageY=a.clientY; 
        var tx=a.pageX-x+parseInt(o.style.left),ty=a.pageY-y+parseInt(o.style.top); 
        o.style.left=tx+"px"; 
        o.style.top=ty+"px"; 
           x=a.pageX; 
           y=a.pageY; 
    }; 
    d.onmouseup=function(a){ 
        if(!a)a=window.event; 
        if(o.releaseCapture) 
            o.releaseCapture(); 
        else if(window.captureEvents) 
            window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); 
        d.onmousemove=null; 
        d.onmouseup=null; 
        if(!a.pageX)a.pageX=a.clientX; 
        if(!a.pageY)a.pageY=a.clientY; 
        if(!document.body.pageWidth)document.body.pageWidth=document.body.clientWidth; 
        if(!document.body.pageHeight)document.body.pageHeight=document.body.clientHeight; 
        if(a.pageX < 1 || a.pageY < 1 || a.pageX > document.body.pageWidth || a.pageY > document.body.pageHeight){ 
            o.style.left = backData.y; 
            o.style.top = backData.x; 
        } 
    }; 
} 
function toBreakWord(strContent, intLen){
    var strTemp="";
    strContent = $.trim(strContent);
    while(strContent.length>intLen){
          strTemp+=strContent.substr(0,intLen)+"<br>"; 
          strContent=strContent.substr(intLen,strContent.length); 
    }
    strTemp+=" "+strContent;
    return strTemp;
}
function toAddEllipsis(strContent, intLen){
	strContent=$.trim(strContent);
	return strContent&&strContent.length>intLen?strContent.substr(0,intLen)+"...":strContent;
}

var mylayer = {
		show:function(json){
			var url = json.url;
			if (!url) {
				alert("not found url attr!");
				return;
			}
			var head = json.head;
			if(!head) {
				head = "";
			}
			var f = json.f;
			var width = json.width;
			if (!width) {
				width = '500px';
			}
			var height = json.height;
			if (!height) {
				height = '282px';
			}
			var html= "<div id='windowOver' class='window-overlaynew' style='display:inline-block'>" +
					      "<div id='modal' class='modal' style='position: absolute; top:50%; margin-top:-141px;left:50%;margin-left:-250px; font-size:14px;width:"+width+";height:"+height+"'>" +
			                "<div class='modal-header' style='cursor:move'>" +
			                    "<h5>" + head + "</h5>" + 
						         "<div id='modal-close' onclick='mylayer.close()'><span class='single-word-icon' style='font-family:fantasy;font-size:22px;'>&times;</span></div>"+
				              "</div>" +
				              "<div style='height:30px'></div>" +
			                "<div id='modalContent' class='modal-content'></div>" + 
			              "</div>" +
                      "</div>";
            $(document.body).append(html);
            if (typeof f == 'function') {
				$("#modalContent").load(url,f);
			} else {
				$("#modalContent").load(url);
			}
		},
		close:function() {
			$("#windowOver").empty();
			$("#windowOver").remove();
		}
};

function showTitle(value,rowData,rowIndex){
    if (typeof value != 'undefined') {
        var tempValue = value;
//    	if (navigator.userAgent.indexOf("Firefox")>0) {
    	//修改问题单：201707170350，firefox低于15.0版本显示有问题做个兼容
        if (firefoxBlowFifteen()) {
    		value = toBreakWord(value, 50);
    	}
    	return  "<div class='itemtooltip' style='overflow:hidden;word-break:break-all;text-overflow:ellipsis '>"+ tempValue +
	 	 "<div class='tooltip_description' style='display:none;word-break:break-all '>"
	 	 + "<table style='TABLE-LAYOUT: fixed'><tr><td style='word-break:break-all'>" +value+ "</td></tr></table>"+
    		 	 " </div></div>";
    }
}



function showMemory(value,rowData,rowIndex) {
	if (typeof value == "undefined") {
		value = 0;
	}
	if (value >= 1048576) {
		var m = value/1048576;
		return m.toFixed(2) + 'TB';
	} else if (value >= 1024) {
		return (value/1024).toFixed(2) + 'GB';
	} else {
		return value.toFixed(2) + 'MB';
	}
}

function showState(value,rowData,rowIndex) {
    	if (value == 2) {
	           return '<img width="17px" height="17px" src=icons/default/homestart.png>';
	        } else if (value == 3) {
	           return '<img width="17px" height="17px" src=icons/default/homeclose.png>';
	        } else if (value == 4) {
	           return '<img width="17px" height="17px" src=icons/default/homepause.png>';
	        } else {
	           return '<img width="17px" height="17px" src=icons/default/homequestion.png>';
	        }
    }

// 流程id，申请电子流id，电子流状态
function showWorkflowDetail(workflowId, applyRecordId, status, operType, type) {
	var url = 'servlet/workflow?way=workflowDetail&workflowId=' + workflowId + '&applyRecordId=' + applyRecordId;
	$.get(url, "", function(result){
		if (result != null && result.state == 0) {    				
			var url = "workflowDetail.jsp?workflowId=" + workflowId + "&applyRecordId=" + applyRecordId + "&status=" + status;
			if (operType) {
				url += "&operType=" + operType;
			}
			if(type != null) {
				url += "&type=" + type;
			}
			$("#frame").layout("panel","center").panel('refresh',url);
		} else {
			$.messager.show({          
	    		title:result.title,           
	    		msg:result.failureMessage, 
	    		showType:'show'       
	    	});
		}
	},"json");
}

function isIE() {
	if (navigator.userAgent.toLowerCase().indexOf("msie") > -1 || navigator.userAgent.toLowerCase().indexOf("edge") > -1 ||
    						  navigator.userAgent.toLowerCase().indexOf("rv:11") > -1) {
		return true;
	} else {
		return false;
	}
}
var deskey = "hph3c_z01500";
function encryptByDES(message) {
	// For the key, when you pass a string,  
    // it's treated as a passphrase and used to derive an actual key and IV.  
    // Or you can pass a WordArray that represents the actual key.  
    // If you pass the actual key, you must also pass the actual IV.  
    var keyHex = CryptoJS.enc.Utf8.parse(deskey);  
    //console.log(CryptoJS.enc.Utf8.stringify(keyHex), CryptoJS.enc.Hex.stringify(keyHex));  
    //console.log(CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Hex)));  
   
    // CryptoJS use CBC as the default mode, and Pkcs7 as the default padding scheme  
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {  
        mode: CryptoJS.mode.ECB,  
        padding: CryptoJS.pad.Pkcs7  
    });  
    // decrypt encrypt result  
    // var decrypted = CryptoJS.DES.decrypt(encrypted, keyHex, {  
    //     mode: CryptoJS.mode.ECB,  
    //     padding: CryptoJS.pad.Pkcs7  
    // });  
    // console.log(decrypted.toString(CryptoJS.enc.Utf8));  
   
    // when mode is CryptoJS.mode.CBC (default mode), you must set iv param  
    // var iv = 'inputvec';  
    // var ivHex = CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(iv).toString(CryptoJS.enc.Hex));  
    // var encrypted = CryptoJS.DES.encrypt(message, keyHex, { iv: ivHex, mode: CryptoJS.mode.CBC });  
    // var decrypted = CryptoJS.DES.decrypt(encrypted, keyHex, { iv: ivHex, mode: CryptoJS.mode.CBC });  
   
    // console.log('encrypted.toString()  -> base64(ciphertext)  :', encrypted.toString());  
    // console.log('base64(ciphertext)    <- encrypted.toString():', encrypted.ciphertext.toString(CryptoJS.enc.Base64));  
    // console.log('ciphertext.toString() -> ciphertext hex      :', encrypted.ciphertext.toString());  
    return encrypted.toString();  
};
function decryptByDES(ciphertext) {
	var keyHex = CryptoJS.enc.Utf8.parse(deskey);  
	   
    // direct decrypt ciphertext  
    var decrypted = CryptoJS.DES.decrypt({  
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)  
    }, keyHex, {  
        mode: CryptoJS.mode.ECB,  
        padding: CryptoJS.pad.Pkcs7  
    });  
   
    return decrypted.toString(CryptoJS.enc.Utf8);  
}

/**  
 * 取消session的定时器 
 * @return {
 * 
 */
function cancelSessionTimer() {
	if (sessionTimer) {
		clearTimeout(sessionTimer);
		sessionTimer = undefined;
	}
}
//session定时器
var sessionTimer;
var sessionTimeout;

//请求定时器，定时请求后台，防止session超时
var reqTimer;

/**  
 * 启动session的定时器 
 */
function startSessionTimer() {
	console.log("start session timer");
	if (!sessionTimeout) {
		sessionTimeout = 600000; //default 10 minutes;
		$.ajax({
		    cache:false,//解决ie11中的缓存问题
		    async:false,
			type : "GET",
			dataType : "json",
			url : "login?way=getUser",
			success : function(result) {
				if (result != null && typeof result != 'undefined') {
					if (result instanceof Array) {
						 if (result.length == 2) {
			                	var userSetting = result[1];
			                	sessionTimeout = userSetting.timeout * 60 * 1000;
						 }
					 }
			      } 
			  }
		});
	}
	if (!sessionTimer) {
		console.log(sessionTimeout);
		sessionTimer = setTimeout(function(){
			 $.ajax({
	    			type : "POST",
	    			dataType : "text",
	    			url : "login?way=logout&autoLogout=true",
	    			success : function(result) {
	    				window.location.href = "login.jsp";
	    				}
	    			});
	  	}, sessionTimeout);
	}
	if (!reqTimer) {
		reqTimer = setInterval(function(){
			$.ajax({
				type : "GET",
				url : "login?way=test"
			});
		}, sessionTimeout / 2);
	}
}

function restartSessionTimer () {
		cancelSessionTimer();
	startSessionTimer();
}
/**
 * 判断firefox是否低于15.0版本。为了解决问题单：201707170350，
 * --by：g14106 2017/07/26
 */

function firefoxBlowFifteen(){
	var explorer=navigator.userAgent.toLowerCase();
	if (explorer.indexOf("firefox")>=0){
		 var ver=explorer.match(/firefox\/([\d.]+)/)[1];
		 if (parseInt(ver)<15){
		 	return true
		 }else{
		 	return false
		 }
	}
	return false
}