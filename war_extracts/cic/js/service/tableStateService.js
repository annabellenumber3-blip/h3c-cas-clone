/**
* UIGrid模块表格宽度service.
* @author s13103 
*/
(function(){// IIFE 避免全局变量
	angular.module('app.tableStateServices',['ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.permissionservices'])
	.factory('TableStateService', function($rootScope, $timeout, LocalStorageService){
		return {
			/**
			 * 保存列表的状态.
			 * @param {object} grid - ui-grid表格对象.
			 * @param {string} key - key值.
			 */
			saveState : function($scope, gridApi, key) {
				var state = gridApi.saveState.save();
				LocalStorageService.set(key, state);
			},
			
			/**
			 * 还原列表的状态.
			 * @param {object} grid - ui-grid表格对象.
			 * @param {string} key - key值.
			 */
			restoreState : function($scope, gridApi, key) {
				$timeout(function() {
					var state = LocalStorageService.get(key);
					if (state) {
						gridApi.saveState.restore($scope, state);
					}
				});
			}
		};
	});
})();