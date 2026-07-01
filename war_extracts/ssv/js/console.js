$(function() {
	// User Model
	// ---------------
	// **User** model has 'name','id'
	var User = Backbone.Model.extend({
		defaults : function() {
			return {
				id : "123456",
				name : "snow-sun@qq.com"
			};
		}
	});
	// User Collection
	// ---------------
	// 用LocalStorage模仿服务器数据库
	var UserList = Backbone.Collection.extend({
		// Reference to this collection's model.
		model : User,
		// 保存到localStorage 的'users-backbone' namespace.
		localStorage : new Backbone.LocalStorage("users-backbone"),
		// 按照id排序
		comparator : 'id'
	});
	// 创建users全局变量
	var Users = new UserList;
	// View定义
	// --------------
	// navigation-profile
	var NavProfileView = Backbone.View.extend({
		// 绑定页面navigation-profile
		//el : $(".navigation-profile"),
		el : $(".toolbar"),
		curUserTemplate : _.template($('#template-navigation-profile').html()),
		events : {
			"click #new-instance" : "newInstance"
		},
		initialize : function() {

		},
		render : function() {
			var user = new User;
			this.$el.html(this.curUserTemplate(user.toJSON()));
			return this;
		},
		newInstance : function() {

			$(".window-overlay").addClass("show-up");
		}

	});
	var navProfile = new NavProfileView;

	// navigation-permission
	var NavPermissView = Backbone.View.extend({

		
	});

	var StepsView = Backbone.View.extend({
		el:$(".window-overlay"),
		events:{
			"click .step-action .btn-next":"nextStep",
			"click .step-action .btn-prev":"prevStep",
			"click .modal-header .icon-close":"close"
		},
		nextStep:function(){
			var nextLeft=parseInt($(".steps").css("left").trim().slice(0,-2))-599;
			//$(".steps").css("left",nextLeft+"px");
			$(".steps").animate({left:nextLeft+"px"});
			var stepNum=nextLeft/(-599);
			$(".wizard ol li").removeClass("current");
			$(".wizard ol li:eq("+stepNum+")").addClass("current");

		},
		prevStep:function(){
			var prevLeft=parseInt($(".steps").css("left").trim().slice(0,-2))+599;
			$(".steps").animate({left:prevLeft+"px"});
			var stepNum=prevLeft/(-599);
			$(".wizard ol li").removeClass("current");
			$(".wizard ol li:eq("+stepNum+")").addClass("current");
		},
		close:function(){
			this.$el.removeClass("show-up");
			
		}
		
	});
	var stepsView = new StepsView;
	// ////////
});
