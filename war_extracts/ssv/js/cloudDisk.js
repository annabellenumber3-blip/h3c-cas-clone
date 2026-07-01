/**
 * 
 */
//打开申请云硬盘
function applyDisk() {
	$("#windowOverId").load("page/widget/applyDisk.jsp",function(){
		$("#windowOverId").show();
		$("#nameInputId").focus();
		$("#deleteBtn").addClass("btn-forbidden");
	});
}

function closeApplyDisk() {
	$("#windowOverId").html("");
	$("#windowOverId").hide();
}