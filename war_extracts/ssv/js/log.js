/**
 * 日志
 */

function searchLog() {
//	var nameVal = $("#instantceId").val();
	var resultVal = $("#resultSelect").val();
	var startTimeVal = $("#startTimeId").val();
	var endTimeVal = $("#endTimeId").val();
	$("#logListId").datagrid("load",{
//		name:nameVal,
		result:resultVal,
		startTime:startTimeVal,
		endTime:endTimeVal
	});
}