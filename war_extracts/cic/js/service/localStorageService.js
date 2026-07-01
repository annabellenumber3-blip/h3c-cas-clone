/**
* 本地保存模块service.
* @author 10191 
*/
(function(){// IIFE 避免全局变量
	angular.module('app.localStorageservices',['ui.bootstrap','ui.router','pascalprecht.translate','app.services'])
	.factory('LocalStorageService', function($rootScope, $timeout){
		return {
			/**
			 * 保存key-value值 
			 * @param {object} key .
			 * @param {string} value.
			 */
			set: function(key, value) {
				if (localStorage) {
					if (angular.isObject(value)) {
						localStorage.setItem(key, JSON.stringify(value))
					} else {
						localStorage.setItem(key, value);
					}
				} else {
					$rootScope.key = value;
				}
			},
			/**
			 * 根据key值获取value
		     * @param {object} key .
			 * @param {string} value.
			 */
			get: function (key) {
				var value;
				if (localStorage) {
					value = localStorage.getItem(key);
					value = JSON.parse(value);
				} else {
					value = $rootScope.key;
				}
				return value;
			}
		};
	});
})();