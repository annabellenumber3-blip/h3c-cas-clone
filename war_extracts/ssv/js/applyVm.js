/**
 * 申请虚拟机
 */
// 提交申请

//关闭申请虚拟机窗口
function close() {
	$("#windowOverId").hide();
}

//function initfirewallCombbox() {
//	$("#firewallItemDiv").show();
//	$("#firewallId").combobox({   
//        url:'servlet/alarm?way=select&type=vm', 
//        valueField:'id',   
//        textField:'title',
//        editable:false,
//        filter: function(q, row){
//            // q是你输入的值，row是数据集合
//            var opts = $(this).combobox('options');
//            // 同一转换成小写做比较，==0匹配首位，>=0匹配所有
//            return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) >= 0;
//        }
//    }).combobox("initClear");
//}

function checkRaido(radio) {
	if (radio.value == 0) {
		$("#ipItemDiv, #maskItemDiv, #gatewayItemDiv, #dnsItemDiv, #secDnsItemDiv").hide();
	} else {
		$("#ipItemDiv, #maskItemDiv, #gatewayItemDiv, #dnsItemDiv, #secDnsItemDiv").show();
	}
}

	//上一步
	var prevStep=function(){
		var prevLeft=parseInt($(".steps").css("left").slice(0,-2))+599;
		//选择了模板并且组织内不允许调整配置则跳过选择类型
		if ($("#template .itemtooltip").find("span").html() != "" && $("#enableAdjustSetting").val() == 0) {
			if (prevLeft == '-599') {
				$(".steps").animate({left:(prevLeft +=599)+"px"});
			} else {
				$(".steps").animate({left:prevLeft+"px"});
			}
		} else {
			$(".steps").animate({left:prevLeft+"px"});
		}
		var stepNum=prevLeft/(-599);
		$(".wizard ol li").removeClass("current");
		for (var p=0;p<=stepNum;p++){
			$(".wizard ol li:eq("+p+")").addClass("current");
		}
		
	};
	var restoreStepsForTemplate = function(){
		$(".wizard ol li:eq(4)").show();
		$(".wizard ol li.step4 span").html("<hr> 4 ");
		$(".wizard-nav li").css("width","19%");
		$(".wizard-nav li span hr").css("width","85px");
		$(".step.step-5").hide();
		$(".step.step-4 .step-action input.btn-next").show();
		$(".step.step-4 .step-action input.btn-primary").hide();
		$(".step-action .btn-next").unbind().bind("click",nextStep);
		$(".step.step-6").show();
	};
	var restoreSteps = function(){
		$(".wizard ol li:eq(4)").hide();
		$(".wizard ol li.step4 span").html("4");
		$(".wizard-nav li").css("width","24%");
		$(".wizard-nav li span hr").css("width","120px");
		$(".step.step-5").hide();
		$(".step.step-4 .step-action input.btn-next").hide();
		$(".step.step-4 .step-action input.btn-primary").show();
		$(".step.step-6").hide();
	};
	var reformSteps = function(){
		$(".wizard ol li:eq(4)").show();
		$(".wizard ol li.step4 span").html("<hr> 4 ");
		$(".wizard-nav li").css("width","19%");
		$(".wizard-nav li span hr").css("width","85px");
		$(".step.step-5").show();
		$(".step.step-4 .step-action input.btn-next").show();
		$(".step.step-4 .step-action input.btn-primary").hide();
		$(".step-action .btn-next").unbind().bind("click",nextStep);
		$(".step.step-6").hide();
	};
	var formExtend = function(exParam){
		if(exParam){
			completeStepFive(exParam);
			return true;
		}else{
			$.ajax({
				type : "GET",
				dataType : "json",
				url : "servlet/workFlowServlet?way=queryApplyVmExtend",
				success : function(result) {
					if (result != null && typeof result != 'undefined') {
						if(result.total>0){
							completeStepFive(result);
						}
						else{
							$(".step.step-5 .info #noExtend").show();
						}
					}
				}
			});
			return true;
		}
	};
    var completeStepFive= function(result){

		//$(".step.step-5 .info").children().remove();
		var  remaind =result.total%6;
		var pages =(result.total-remaind)/6;
		if(pages<=1){
			$("#navId li#forwardToNextTab").addClass("bottomGray");
		}
		var startNum;
		var endNum;
		for (var p=0;p<=pages;p++)
		{
			var li=$(".step.step-5 .info .nav-tabs li:eq("+(p+1)+")");
			var pane=$(".step.step-5 .info .tab-content .tab-pane");
			if(p==pages){
				if(remaind!=0){
					li.find("a").html((p+1));
					li.removeClass("no-show");
				}
			}else{
				li.find("a").html((p+1));
				li.removeClass("no-show");
			}
			
			pane.children().remove();
			
		}
		var ep = result.rows;
		var str="",tabNum,epObj;
		for (var i=0;i<result.total;i++)
		{
			epObj=ep[i];
			str="";
			//判断是否必填
			if(epObj.fieldAllowBlank==1){
				//不许为空 在后面对所有有mustItem的item检测是否为空
				str+='<div class="item mustItem"><div class="control-label">'+ buildToolTip(epObj.fieldName)+'</div><div class="controls">';
			}else{
				str+='<div class="item nomustItem"><div class="control-label">'+ buildToolTip(epObj.fieldName)+'</div><div class="controls">';
			}
			
			if(epObj.fieldType==0){
				//整数
				str +='<input id="ss'+epObj.id+'" name="'+epObj.columnName+'" data-nummax="'+epObj.fieldMax+'" data-nummin="'+epObj.fieldMin+'"><span>('+epObj.fieldMin+'-'+epObj.fieldMax+')</span>';
			}else if(epObj.fieldType==1){
				//字母和数字
				str +='<input class="numAndLetter hasMaxLength" id="numAndLetter'+epObj.id+'" type="text" data-fieldLen='+epObj.fieldLen+' value="';
				if(epObj.defaultValue){
					str +=epObj.defaultValue;
				}
				str +='" name="'+epObj.columnName+'">';
			}else if(epObj.fieldType==3){
				//选择框
				str +='<select id="cc'+epObj.id+'" class="easyui-combobox" name="'+epObj.columnName+'" >';
				if(!epObj.defaultValue){
					str +='<option value=""></option> '; 
				}
				var options = epObj.options;
				for(var j=0;j<options.length;j++){
					if(options[j].fieldOptions==epObj.defaultValue){
						str +='<option value="'+options[j].fieldOptions+'" selected="selected">'+options[j].fieldOptions+'</option> '; 
					}else{
						str +='<option value="'+options[j].fieldOptions+'">'+options[j].fieldOptions+'</option> '; 
					}
				}
				str +='</select>';
			}else {
				str +='<input id="anychar'+epObj.id+'" class="hasMaxLength xmlNeedReg" type="text" data-fieldLen='+epObj.fieldLen+' value="';
				if(epObj.defaultValue){
					str +=epObj.defaultValue;
				}
				str +='" name="'+epObj.columnName+'">';
			}
			str+='</div></div>';
		   //判断要放在第几页
			tabNum=(i-i%6)/6;
		   $(".step.step-5 .info #Extend"+tabNum).append(str);
		   if(epObj.fieldType==0){
			   $('#ss'+epObj.id).numberspinner({  
				   value:epObj.defaultValue,
				    min: epObj.fieldMin,  
				    max: epObj.fieldMax,
				    editable: true,
				    width: 274,
				    height: 36,
				    onSpinUp:function(){
				    	$('#ss'+epObj.id).keyup();
					   },
				    onSpinDown:function(){
				    	$('#ss'+epObj.id).keyup();
				    }
				});
		   }
		   
		}
		    
			 $("div.itemtooltip").jtooltip();
			 $(".step-5 .info .tab-content").find(".mustItem .itemtooltip span").each(function(){
				 console.log($(this).html());
				 $(this).html($(this).html() + '<span style="color:red">*</span>');
			 });
			 $(".step-5 .info .tab-content").find(".nomustItem .itemtooltip span").each(function(){
				 console.log($(this).html());
				 $(this).html($(this).html() + '<span style="color:red">&nbsp</span>');
			 });
		     var extendItems=$(".step-5 .info .tab-content").find("input,select");
		     extendItems.bind('keyup',function(e){
		    	 var target = e.target;
		    	 var ei = $('#'+target.id);
		    	 var mark = true;
		    	 if(ei.parents("div.item").hasClass("mustItem")){
		    		 mark=checkItemNull(ei);
		    	 }
		    	 if(mark&&ei.hasClass("numAndLetter")){
		    		 mark= checkNumAndLetter(ei);
		    	 }
		    	 if(mark&&ei.hasClass("hasMaxLength")){
		    		 mark= checkMaxLength(ei);
		    	 }
		    	 if(mark&&ei.hasClass("xmlNeedReg")){
		    		 mark= checkXMLReg(ei);
		    	 }
				
			   });
		     $("select").bind('change',function(e){
		    	 var target = e.target;
		    	 var ei = $('#'+target.id);
		    	 ei.keyup();
		    	 
		     });
		
		     $(".spinner").children().bind('click', function(e) {
		         //修改问题单201708290322  界面显示不正确  --add by g14106 2017.9.19
		         var target = e.target;
		         var ei = $('#' + target.id);
		         if (ei.attr("id") === undefined) {
			           var input = $(target).parent().siblings()[0];
			           $('#' + input.id).keyup();
		        } else if (ei.attr("id").substring(0, 2) == 'ss') {
			        ei.keyup();
		       }
			// $(".spinner").children().keyup();
		     });
    };
	var forwardToPrevTab = function(){
		var liAct=$("#navId li.active");
		if(liAct.index()==1){
			return;
		}else {
			if(liAct.index()==2){
				$("#navId li#forwardToPrevTab").addClass("topGray");
			}
			$("#navId li#forwardToNextTab").removeClass("bottomGray");
			$("#navId li:eq("+(liAct.index()-1)+") a").click();
		}
	};
	var forwardToNextTab = function(){
		var liAct=$("#navId li.active");
		var liNoShow = $("#navId li.no-show");
		//7是总页数
		if(liAct.index()==(7-liNoShow.size())){
			return;
		}else{
			if(liAct.index()==6-liNoShow.size()){
				$("#navId li#forwardToNextTab").addClass("bottomGray");
			}
			$("#navId li#forwardToPrevTab").removeClass("topGray");			
			$("#navId li:eq("+(liAct.index()+1)+") a").click();
		}
	};
	
	//cpu 和 内存 选择切换
	var changeOptions =function(){
		$(".types-item").removeClass("selected");
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
		
	};
	//更换内存
	var changeMemory =function(){
		$(".types-item").removeClass("selected");
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
		$("#momorytd").html($(this).find(".types-options").html());
		$("#momorytd").attr("data-value", $(this).find(".types-options").attr("data-value"));
	};
	//更换CPU
	var changeCpu =function(){
		$(".types-item").removeClass("selected");
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
		$("#cputd").html($(this).find(".types-options").html());
		$("#cputd").attr("data-value", $(this).find(".types-options").attr("data-value"));
	};
	//change Storage
	var changeStorage =function(){
		$(".types-item").removeClass("selected");
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
		$("#storagetd").html($(this).find(".types-options").html());
		$("#storagetd").attr("data-value", $(this).find(".types-options").attr("data-value"));
	};
	
	function changeVersionTd(versionTd){
		$("#versionTd").html(versionTd.value);
	}
	function checkOper(changeOperRaido) {
		var optionHtml = '';
		if (changeOperRaido.value == "Windows") {
			$("#operaSystemTd").html("Windows");
			optionHtml = "<option>Microsoft Windows Server 2016(64-bit) <option>Microsoft Windows Server 2012 <option>Microsoft Windows Server 2012 R2 <option>Microsoft Windows Server 2008 R2(64-bit)" + 
			          "<option>Microsoft Windows Server 2008(64-bit) <option>Microsoft Windows Server 2008(32-bit) <option>Microsoft Windows Server 2003 R2(64-bit) <option>Microsoft Windows Server 2003 R2(32-bit)" +
			          "<option>Microsoft Windows Server 2003(64-bit) <option>Microsoft Windows Server 2003(32-bit) <option>Microsoft Windows 10(64-bit) <option>Microsoft Windows 10(32-bit)" + 
			          "<option>Microsoft Windows 8.1(64-bit) <option>Microsoft Windows 8.1(32-bit) <option>Microsoft Windows 8(64-bit)<option>Microsoft Windows 8(32-bit)" +
			          "<option>Microsoft Windows 7(64-bit)<option>Microsoft Windows 7(32-bit)<option>Microsoft Windows Vista(64-bit)"+
			          "<option>MMicrosoft Windows Vista(32-bit)<option>Microsoft Windows XP Professional(64-bit)<option>Microsoft Windows XP Professional(32-bit)" ;
		} else if (changeOperRaido.value == "Linux") {
			$("#operaSystemTd").html("Linux");
			//修改问题单201503280063 增加centos7的选项  -add by h10630 2015.4.2
			optionHtml = "<option>Red Hat Enterprise Linux 7(64-bit) <option>Red Hat Enterprise Linux 7(32-bit)"+
            "<option>Red Hat Enterprise Linux 6(64-bit)<option>Red Hat Enterprise Linux 6(32-bit)<option>Red Hat Enterprise Linux 5.10(64-bit)"+
            "<option>Red Hat Enterprise Linux 5.10(32-bit)<option>Red Hat Enterprise Linux 5.9(64-bit)<option>Red Hat Enterprise Linux 5.9(32-bit)"+
            "<option>Red Hat Enterprise Linux 5.8(64-bit)<option>Red Hat Enterprise Linux 5.8(32-bit)<option>Red Hat Enterprise Linux 5.7(64-bit)"+
            "<option>Red Hat Enterprise Linux 5.7(32-bit)<option>Red Hat Enterprise Linux 5.6(64-bit)<option>Red Hat Enterprise Linux 5.6(32-bit)"+
            "<option>Red Hat Enterprise Linux 5.5(64-bit)<option>Red Hat Enterprise Linux 5.5(32-bit)<option>Red Hat Enterprise Linux 5.4(64-bit)"+
            "<option>Red Hat Enterprise Linux 5.4(32-bit)<option>Red Hat Enterprise Linux 5.3(64-bit)<option>Red Hat Enterprise Linux 5.3(32-bit)"+
            "<option>Red Hat Enterprise Linux 5.2(64-bit)<option>Red Hat Enterprise Linux 5.2(32-bit)<option>Red Hat Enterprise Linux 5.1(64-bit)"+
            "<option>Red Hat Enterprise Linux 5.1(32-bit)<option>Red Hat Enterprise Linux 5.0(64-bit)<option>Red Hat Enterprise Linux 5.0(32-bit)"+
            "<option>Red Hat Enterprise Linux 4(64-bit)<option>Red Hat Enterprise Linux 4(32-bit)<option>Novell SUSE Linux Enterprise 12(64-bit)"+
            "<option>Novell SUSE Linux Enterprise 11(64-bit)<option>Novell SUSE Linux Enterprise 11(32-bit)<option>Novell SUSE Linux Enterprise 10(64-bit)"+
            "<option>Novell SUSE Linux Enterprise 10(32-bit)<option>Novell SUSE Linux Enterprise 8/9(64-bit)<option>Novell SUSE Linux Enterprise 8/9(32-bit)"+
            "<option>SUSE openSUSE(64-bit)<option>SUSE openSUSE(32-bit)<option>CentOS 6/7(64-bit)<option>CentOS 6/7(32-bit)<option>CentOS 5.10(64-bit)"+
            "<option>CentOS 5.10(32-bit)<option>CentOS 5.9(64-bit)<option>CentOS 5.9(32-bit)<option>CentOS 5.8(64-bit)<option>CentOS 5.8(32-bit)"+
            "<option>CentOS 5.7(64-bit)<option>CentOS 5.7(32-bit)<option>CentOS 5.6(64-bit)<option>CentOS 5.6(32-bit)<option>CentOS 5.5(64-bit)"+
            "<option>CentOS 5.5(32-bit)<option>CentOS 5.4(64-bit)<option>CentOS 5.4(32-bit)<option>CentOS 5.3(64-bit)<option>CentOS 5.3(32-bit)"+
            "<option>CentOS 5.2(64-bit)<option>CentOS 5.2(32-bit)<option>CentOS 5.1(64-bit)<option>CentOS 5.1(32-bit)<option>CentOS 5.0(64-bit)"+
            "<option>CentOS 5.0(32-bit)<option>CentOS 4(64-bit)<option>CentOS 4(32-bit)<option>Debian GUN/Linux 9(64-bit)<option>Debian GUN/Linux 8(64-bit)<option>Debian GUN/Linux 8(32-bit)"+
            "<option>Debian GUN/Linux 7(64-bit)<option>Debian GUN/Linux 7(32-bit)<option>Debian GUN/Linux 6(64-bit)<option>Debian GUN/Linux 6(32-bit)"+        
            "<option>Debian GUN/Linux 5(64-bit)<option>Debian GUN/Linux 5(32-bit)<option>Debian GUN/Linux 4(64-bit)<option>Debian GUN/Linux 4(32-bit)"+
            "<option>Red Flag Asianux Server 7(64-bit)<option>Red Flag Asianux Server 4.5(64-bit)<option>Red Flag Asianux Server 4(64-bit)"+
            "<option>Red Flag Asianux Server 4(32-bit)<option>Red Flag Asianux Server 3(64-bit)<option>Red Flag Asianux Server 3(32-bit)"+
            "<option>Red Flag Asianux Server 2(64-bit)<option>Red Flag Asianux Server 2(32-bit)<option>Deepin 15(64-bit)"+           
            "<option>Deepin 15(32-bit)<option>Oracle Linux 7(64-bit)<option>Oracle Linux 7(32-bit)<option>Oracle Linux 6.8(64-bit)"+
            "<option>Oracle Linux 6.8(32-bit)<option>Oracle Linux 6.7(64-bit)<option>Oracle Linux 6.7(32-bit)"+
            "<option>Oracle Linux 6.6(32-bit)<option>Oracle Linux 6.5(64-bit)<option>Oracle Linux 6.5(32-bit)"+
            "<option>Oracle Linux 6.4(64-bit)<option>Oracle Linux 6.4(32-bit)<option>Oracle Linux 6.3(64-bit)"+
            "<option>Oracle Linux 6.3(32-bit)<option>Oracle Linux 6.2(64-bit)<option>Oracle Linux 6.2(32-bit)"+
            "<option>Oracle Linux 6.1(64-bit)<option>Oracle Linux 6.1(32-bit)<option>Oracle Linux 6.0(64-bit)"+
            "<option>Oracle Linux 6.0(32-bit)<option>Oracle Linux 4/5(64-bit)<option>Oracle Linux 4/5(32-bit)"+
            "<option>Ubuntu Linux(64-bit)<option>Ubuntu Linux(32-bit)<option>Fedora 25(64-bit)<option>Fedora 24(64-bit)<option>Fedora 23(64-bit)<option>Fedora 22(64-bit)"+
            "<option>Fedora 21(64-bit)<option>Fedora 20(64-bit)<option>Fedora 17(64-bit)<option>Fedora 15(64-bit)"+
            "<option>Fedora 11(64-bit)<option>Fedora 10(32-bit)<option>Fedora 9(32-bit)<option>Fedora 8(32-bit)"+
            "<option value='zhongbiaoV7OS64'>"+$('#zhongbiaoV7OS64').val()+"<option value='zhongbiaoV6OS64'>"+$('#linuxOS1').val()+"<option value='zhongbiaoV6OS32'>"+$('#linuxOS2').val()+"<option value='zhongbiaoV5OS32'>"+$('#zhongbiaoV5OS32').val()+
            "<option value='zhongbiaoSystemV6OS64'>"+$('#zhongbiaoSystemV6OS64').val()+"<option value='neoShineDeskV4OS32'>"+$('#neoShineDeskV4OS32').val()+"<option value='neoShineServerV4OS64'>"+$('#neoShineServerV4OS64').val()+"<option value='neoShineServerV3OS64'>"+$('#neoShineServerV3OS64').val()+
            "<option value='linxTechV8064'>"+$('#linxTechV8064').val()+"<option value='linxTechV6064'>"+$('#linxTechV6064').val()+"<option value='linxTechV4264'>"+$('#linxTechV4264').val()+
            "<option value='huawei20sp264'>"+$('#huawei20sp264').val()+"<option value='huawei20sp164'>"+$('#huawei20sp164').val()+"<option value='zhongxinV4OS64'>"+$('#zhongxinV4OS64').val()+
            "<option value='zhongxinV3OS64'>"+$('#zhongxinV3OS64').val()+"<option value='yiminServerV764'>"+$('#yiminServerV764').val()+"<option value='yiminServersV464'>"+$('#yiminServersV464').val()+
            "<option value='yiminServersOS64'>"+$('#yiminServersOS64').val()+"<option value='yiminServersOS32'>"+$('#yiminServersOS32').val()+
            "<option value='cvmCasOS64'>"+$('#cvmCasOS64').val()+"<option>Other Linux(64-bit)<option>Other Linux(32-bit)";
		} else if (changeOperRaido.value == "Unix") {
			$("#operaSystemTd").html("Unix");
			optionHtml = "<option>AIX 5L v5.1</option><option>AIX 5L v5.2</option><option>AIX 5L v5.3</option><option>AIX v6.1</option><option>AIX v7.1</option>" +
					"<option>HP-UX 11i v1.5</option><option>HP-UX 11i v1.6</option><option>HP-UX 11i v2</option><option>HP-UX 11i v3</option>" +
					"<option>HP-UX 11i v3 Base OE (BOE)</option><option>HP-UX 11i v3 Virtualization Server OE (VSE-OE)</option><option>HP-UX 11i v3 High Availability OE (HA-OE)</option>" +
					"<option>HP-UX 11i v3 Data Center OE (DC-OE)</option>";
		}
		$("#versionSelect").html(optionHtml);
		$("#versionTd").html($("#versionSelect").val());
	}

	/**
	 * 验证函数
	 * */
	function checkDomainName(){
		var name = $("#domainNameId");
		var mark = true;
   	 if(mark){
   		 mark=checkItemNull(name);
   	 }
   	 if(mark){
   		 mark= regexName(name);
   	 }
   	 if(mark){
   		 mark= checkMaxLength(name);
   	 }
   	 if(mark){
   		 mark = regexNameIsAllNum(name);
   	 }
		return mark;
	}
	function checkVcenterDomainName(){
		var name = $("#domainNameId");
		var mark = true;
		if(mark){
			mark= regexTitle(name);
		}
		if(mark){
			mark= checkMaxLength(name);
		}
		return mark;
	}
	function checkDomainReName(){
		var name = $("#domainNameId");
		if(!name.hasClass("wrong-border")&&$.trim(name.val())!=""){
			$.ajax({
				type : "GET",
				dataType : "json",
				async:false,
				url : "servlet/workFlowServlet?way=checkDomainReName",
				data:"domainName="+name.val(),
				success : function(result) {
					if (result != null && typeof result != 'undefined' && result !="") {
						var domainName = $("#domainNameId");
						if(result == "true"){
							domainName.tooltip({
								   title:$('#isRename').val(),
								   placement:"right",
								   trigger:"manual"
							 });
							showWrongResult(domainName);
						}else{
							showRightResult(domainName);
						}
					}
				}
			});
		}
	}
	function checkPreName(){
		var title = $("#titleId");
		var prename= $("#preName").val();
		if(!title.hasClass("wrong-border")&&$.trim(title.val())!=""&&prename!=""&&prename!="null"){
			if(title.val().substr(0,prename.length)!=prename){	
				title.tooltip({
					   title:$('#hasPreName').val(),
					   placement:"right",
					   trigger:"manual"
				 });
				showWrongResult(title);
			}else{
				showRightResult(title);
			}
		}
	}
	function checkVcenterPreName(){
//		$("#titleId").val($("#domainNameId").val());
		var title = $("#domainNameId");
		var prename= $("#preName").val();
		if(!title.hasClass("wrong-border")&&$.trim(title.val())!=""&&prename!=""&&prename!="null"){
			if(title.val().substr(0,prename.length)!=prename){	
				title.tooltip({
					   title:$('#hasPreName').val(),
					   placement:"right",
					   trigger:"manual"
				 });
				showWrongResult(title);
			}else{
				showRightResult(title);
			}
		}
	}
	function checkTitle(){
		var title = $("#titleId");
		var mark = true;
		 if(mark){
	   		 mark= regexTitle(title);
	   	 }
	   	 if(mark){
	   		 mark= checkMaxLength(title);
	   	 }
	   	 return mark;
	}
	function checkReason(){
		var reason = $("#applyReasonId");
		var mark = true;
	   	 if(mark){
	   		 mark=checkItemNull(reason);
	   	 }
	   	 if(mark){
	   		 mark= checkMaxLength(reason);
	   	 }
	   	 //修改问题单201406040659 解决<>字符报错的问题 by s10462 2014/6/25
	   	 if(mark){
	   		mark= checkXMLReg(reason);
	   	 }
	   	return mark;
	}
	function checkExpireDate(){
		var reason = $("#expireDateId");
		var mark = true;
		if(mark){
			mark=checkItemNull(reason);
		}
		return mark;
	}
	function checkDescription(){
		var desc = $("#descId");
		//修改问题单201406040659 解决<>字符报错的问题 by s10462 2014/6/25
		var mark = true;
	   	 if(mark){
	   		 mark=checkXMLReg(desc);
	   	 }
	   	 if(mark){
	   		 mark= checkMaxLength(desc);
	   	 }
		return mark;
	}
	function checkIpFormat(e){
		var inputId = e.target.id;
		var inputVal = e.target.value;
		var inputObj = $('#'+inputId);
		if(inputId=="ipId"||inputId=="maskId"){
			var mark = true;
			 if(mark){
		   		 mark=checkItemNull(inputObj);
		   	 }
			 if(mark){
				 //问题单号 201405270139  对配置的ip地址等参数进行合法性验证 by s10462 20140605
				 if(inputId=="ipId")
					 mark= regexIP(inputObj);
				 if(inputId=="maskId")
					 mark= regexIPMask(inputObj);
		   	 }
		}else{
			regexIP(inputObj);
		}
	}
	
	function addDefaultMask(){
		var mark = regexIP($('#ipId'));
		if(mark){
			if($('#maskId').val()==""){
				$.ajaxSetup({ cache: false });
				$.ajax({
					type : "GET",
					dataType : "json",
					data : "ip=" + $('#ipId').val(),
					url : "servlet/workFlowServlet?way=getSysMask",
					success:function(result){
						$('#maskId').val(result);
						 showRightResult($('#maskId'));
					}
				});
			}else{
				regexIPMask($('#maskId'));
			}
		}
	}
	//修改问题单201409050257，增加对有效IP的校验， by c10651 2014/09/17
	function validateIpAddress(){
		var ipId =$("#ipId");
		var maskId =$("#maskId");
		if (!ipId.hasClass("wrong-border")&&!maskId.hasClass("wrong-border")){
			if(ipId.val()!=""&&maskId.val()!=""){
				$.ajax({
					type : "GET",
					dataType : "json",
					async:false,
					url : "servlet/workFlowServlet?way=validateIpAddress",
					data:"ip="+ipId.val()+"&mask="+maskId.val(),
					success : function(result) {
						if (result != null && typeof result != 'undefined' && result !="") {
							if(result == "false"){
								ipId.tooltip({
									   title:$('#ipValidateTip').val(),
									   placement:"right",
									   trigger:"manual"
								 });
								showWrongResult(ipId);
							}
						}
					}
				});
			}
		}
	}
	
	//修改问题单 201405260275 首选DNS不能与备选DNS相同 by s10462 2014/6/6
	function contrastFirst(){
		var second =$("#secondDnsId");
		if(!second.hasClass("wrong-border")){
			if(second.val()!=""&&$("#firstDnsId").val()!=""&&second.val()==$("#firstDnsId").val()){
				second.tooltip({
					   title:$('#sameAsFirst').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				showWrongResult(second);
			}else{
				showRightResult(second);
			}
		}
	}
	function checkItemNull(obj){
		obj.tooltip('destroy');
		if(obj.attr("id").substring(0,2)=="ss")
		{
			var spinner=obj.parents("span.spinner");
			spinner.tooltip('destroy');
			if($.trim(obj.val())==""){
				spinner.tooltip({
				   title:$('#nullTip').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(spinner);
			}else{
				return showRightResult(spinner);
			}
		}else{
			if($.trim(obj.val())==""){
			    obj.tooltip({
				   title:$('#nullTip').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(obj);
			}else{
				return showRightResult(obj);
			}
		}
		 
	}
	function checkNumAndLetter(numAndLetter){
		numAndLetter.tooltip('destroy');
		 if(regexNumAndLetter(numAndLetter.val())){
			 numAndLetter.tooltip({
				   title:$('#notNumAndLetter').val(),
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(numAndLetter);
			}else{
				return showRightResult(numAndLetter);
			}
	}
	function checkMaxLength(hasMaxLength){
		hasMaxLength.tooltip('destroy');
		var max=hasMaxLength.attr("data-fieldLen");
		var titleContent = $('#maxLength').val()+max;
		 if(hasMaxLength.val()&&hasMaxLength.val().length>max){
			 
			 hasMaxLength.tooltip({
				   title:titleContent,
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(hasMaxLength);
			}else{
				return showRightResult(hasMaxLength);
			}
	}
	
	function showWrongResult(obj){
			obj.parents(".item").find(".control-label").addClass("wrong-word-color");
			obj.addClass("wrong-border");
			obj.tooltip('show');
			return false;
	}
	function showRightResult(obj){
			obj.parents(".item").find(".control-label").removeClass("wrong-word-color");
			obj.removeClass("wrong-border");
			obj.tooltip('destroy');
			return true;
	}
	function regexName(name){
		var partten = /^[\A-Za-z0-9\-\_\.]*$/;
		name.tooltip('destroy');
		if(name.val()){
			if(partten.test(name.val())){
				if(name.val().substring(0,1)=="-"||name.val().substring(0,1)=="."){
					name.tooltip({
						   title:$('#nameNoChRangeNew').val(),
						   placement:"right",
						   trigger:"manual"
					   });
					return showWrongResult(name);
				}else{
					return showRightResult(name);
				}
				
			}else{
				name.tooltip({
					   title:$('#nameNoChRangeNew').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}
		}
	}
	function regexNameIsAllNum(name){
		var partten= /^\d+$/;;
		name.tooltip('destroy');
		if(name.val()){
			if(partten.test(name.val())){
				name.tooltip({
					   title:$('#nameIsNumber').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
				
			}else{
				return showRightResult(name);
			}
		}
	}
	function regexTitle(name){
		var partten = /^[\A-Za-z0-9\u4E00-\u9FA5\uF900-\uFA2D\-\_\.\s]*$/;
		             //   [^a-zA-Z0-9_\\x2d.\\s\\u4E00-\\u9FA5\\uF900-\\uFA2D]
		name.tooltip('destroy');
		if($.trim(name.val())=="" || !partten.test(name.val())){
				name.tooltip({
					   title:$('#titleNoChRange').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(name);
			}else{
				return showRightResult(name);
			}
		
	}
	function regexNumAndLetter(nl){
		var partten = /^[A-Za-z0-9]*$/;
		return !partten.test(nl);
	}
	//问题单号 201405270139  对配置的ip地址等参数进行合法性验证 by s10462 20140605
	function regexIP(ip){
		var partten = /^([1-9]\d?|1\d{1,2}|2[01]\d|22[0-3])(\.(\d|[1-9]\d|1\d{1,2}|2[0-4]\d|25[0-5])){2}\.(0|[1-9]\d?|1\d{1,2}|2[0-4]\d|25[0-5])$/;
		ip.tooltip('destroy');
		if($.trim(ip.val())!=""){
			if (!partten.test($.trim(ip.val())) || "0.0.0.0"==$.trim(ip.val()) || "255.255.255.255"==$.trim(ip.val())) {
				ip.tooltip({
					   title:$('#ipTip').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(ip);
			}else{
				return showRightResult(ip);
			}
		}else{
			return showRightResult(ip);
		}
	}
	function regexIPMask(ip){
		var partten1 = /^(254|252|248|240|224|192|128|0)\.0\.0\.0$/;
		var partten2 = /^255\.(254|252|248|240|224|192|128|0)\.0\.0$/;
		var partten3 = /^255\.255\.(254|252|248|240|224|192|128|0)\.0$/;
		var partten4 = /^255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
		ip.tooltip('destroy');
		if($.trim(ip.val())!=""){
			if("255.255.255.255"==$.trim(ip.val())){
				ip.tooltip({
					   title:$('#ipMaskOutOfRangeMsgTip').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(ip);
			}else if (!(partten1.test($.trim(ip.val())) || partten2.test($.trim(ip.val())) || partten3.test($.trim(ip.val())) || partten4.test($.trim(ip.val()))) || "0.0.0.0"==$.trim(ip.val()))  {
				ip.tooltip({
					   title:$('#ipMaskTip').val(),
					   placement:"right",
					   trigger:"manual"
				   });
				return showWrongResult(ip);
			}else{
				return showRightResult(ip);
			}
		}else{
			return showRightResult(ip);
		}
	}
	function checkXMLReg(obj){
		obj.tooltip('destroy');
		var titleContent = $('#notSpecialCharacter').val();
		 if(obj.val().indexOf('<') > -1 || obj.val().indexOf('>') > -1||obj.val().indexOf('&') > -1){
			 obj.tooltip({
				   title:titleContent,
				   placement:"right",
				   trigger:"manual"
			   });
			   return showWrongResult(obj);
			}else{
				return showRightResult(obj);
			}
	}
	
	/**
	 * 检测登录账户
	 */
	function checkLoginAccount(){
		var loginName = $("#loginName");
		var mark = true;
		if(loginName.val() != ""){
			if(mark){
		   		mark= regexName(loginName);
		   	}
		   	if(mark){
		   		mark= checkMaxLength(loginName);
		   	}
		   	if(mark){
		   		mark = regexNameIsAllNum(loginName);
		   	}
		} else {
			return showRightResult(loginName);
		}
		return mark;
	}
	
	/**
	 * 检测登录密码
	 */
	function checkLoginPassword(){
		var loginPwd = $("#loginPwd");
		var mark = true;
		if(loginPwd.val() != ""){
			if(mark){
				mark= checkMaxLength(loginPwd);
		   	}
		   	if(mark){
		   		mark= checkXMLReg(loginPwd);
		   	}
		} else {
			return showRightResult(loginPwd);
		}
	   	 
	   	return mark;
	}
	
	/**
	 * 检测确认密码
	 */
	function checkConfirmPassword(){
		var confirmPassword = $("#confirmPassword");
		var mark = true;
		if(confirmPassword.val() != ""){
			if(mark){
		   		mark= checkMaxLength(confirmPassword);
		   	}
		   	if(mark){
		   		mark= checkXMLReg(confirmPassword);
		   	}
		} else {
			return showRightResult(confirmPassword);
		}
	   	return mark;
	}
	
	/**
	 * 检测两次密码一致
	 */
	function checkPasswordSame(){
		var confirmPassword = $("#confirmPassword");
		var loginPwd = $("#loginPwd");
		if((loginPwd.val() != "" || confirmPassword.val() != "") && loginPwd.val() != confirmPassword.val()){
			confirmPassword.tooltip({
				title:$('#passwordDiff').val(),
				placement:"right",
				trigger:"manual"
			});
			return showWrongResult(confirmPassword);
		}else{
			return showRightResult(confirmPassword);
		}
	}
	//检查云硬盘大小
	function checkCloudDiskCapacity(e) {
	    var inputId = e.target.id;
	    var inputObj = $("#" + inputId);
	    if (isNaN(inputObj.val())) {
	        inputObj.val('');
        }
	    if (inputObj.val() != '') {
 	        if (inputObj.val() > 1024) {
	            inputObj.val(1024);
	            inputObj.numberspinner('setValue', 1024);
	        } else if (inputObj.val() < 1) {
	            inputObj.val(1);
	            inputObj.numberspinner('setValue', 1);
	        } else {
	            var value = inputObj.val();
	            inputObj.val(parseInt(value));
	            inputObj.numberspinner('setValue', value);
	        }	        
	    }
	    changeCloudDiskCapacityTD();//显示右侧详细信息
	    if(inputObj.val() == ""){
	        $("span.spinner > div").css("left", 375);
	    }
	}
	//显示右侧云硬盘详细信息
	function changeCloudDiskCapacityTD() {
        var extendDiskValue = $("#extendCloudDisk").val();
        if (extendDiskValue > 0 && $("#cloudDisktd")) {
            $("#cloudDisktd").html(extendDiskValue + "GB");
        } else {
            if ($("#cloudDisktd")) {
                $("#cloudDisktd").html('');
            }
        }
	}