/**
 *  登录后的首页
 */

function changeP() {
	var dg = $('#tt');
	dg.datagrid('loadData', []);
	dg.datagrid({
		pagePosition : $('#p-pos').val()
	});
	dg.datagrid('getPager').pagination(
			{
				layout : [ 'list', 'sep', 'first', 'prev', 'sep',
						$('#p-style').val(), 'sep', 'next', 'last', 'sep',
						'refresh' ]
			});
}