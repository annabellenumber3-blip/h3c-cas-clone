/**
 *   登录页面相关js
 */

var index;
function forgetPassword() {

	index = $.layer({
		type : 1,
		fix : false,
		area : [ '500px', '150px' ],
		border : [ 1 ],
		shade : [ 0.5, '#000', true ],
		moveOut : false,
		zIndex : layer.zIndex,
		title : 'Forgot Password',
		page : {
			url : 'forgetPassword.jsp'
		},
		success : function(othis) {
			var next = othis.find('#next'), tit = othis.find('.xubox_title');
			next.on('click', function(event) {
				layerLoop();
			});

			//开启点击使当前窗口置顶功能
			layer.setTop(othis);
		}
	});
}

/**  用户注册。*/
function register() {
	index = $.layer({
		type : 1,
		fix : false,
		area : [ '620px', '500px' ],
		border : [ 1 ],
		shade : [ 0.5, '#000', true ],
		moveOut : false,
		zIndex : layer.zIndex,
		title : 'Register',
		page : {
			url : 'register.jsp'
		},
		success : function(othis) {
			var next = othis.find('#next'), tit = othis.find('.xubox_title');
			next.on('click', function(event) {
				layerLoop();
			});
			//开启点击使当前窗口置顶功能
			layer.setTop(othis);
		}
	});
}

/**  用户系统设置。*/
function systemConfig() {
	index = $.layer({
		type : 1,
		fix : false,
		area : [ '500px', '150px' ],
		border : [ 1 ],
		shade : [ 0.5, '#000', true ],
		moveOut : false,
		zIndex : layer.zIndex,
		title : 'System Config',
		page : {
			url : 'systemConfig.jsp'
		},
		success : function(othis) {
			var next = othis.find('#next'), tit = othis.find('.xubox_title');
			next.on('click', function(event) {
				layerLoop();
			});
			//开启点击使当前窗口置顶功能
			layer.setTop(othis);
		}
	});
}

function submitRegister() {
	var param = $("#registerFormId").serialize();
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "login?way=register",
		data : param,
		beforeSend : function(xhr) {
			//showWait();
		},
		success : function(result) {
			//hideWait();
			layer.close(index);
			$("#my-instances").datagrid('reload');
			if (result.success) {
				layer.close(index);
				$.messager.show({
					title : result.title,
					msg : result.message,
					showType : 'show'
				});
			} else {
				$.messager.show({
					title : result.title,
					msg : result.message,
					showType : 'show'
				});
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			//hideWait();
		}
	});
}