/**
 * 虚拟机工作流
 */



function select(obj) {
	initApplyWorkflowGrid($(obj).val());
//	$("#workflowListId").datagrid('load', {
//		status:$(obj).val()
//	});
}

function selectCancel(obj) {
	initCancelWorkflowGrid($(obj).val());
}

function selectDelay(obj) {
	initDelayWorkflowGrid($(obj).val());
//	$("#SELECTDELAY").DATAGRID('LOAD', {
//		STATUS:$(OBJ).VAL()
//	});
}

