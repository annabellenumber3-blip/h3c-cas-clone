angular.module('app.clusterservice',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services','app.httpservice'])
.factory('ClusterService', function($http , $modal ,$state, $translate,UtilService, HttpService){
    
    return {
        //==================VMWARE 集群服务开始===============
        //配置vmware集群HA
        configVmwareHA : function(cloudId, clusterKey) {
            var waitModal = UtilService.wait();
            //查询集群的配置信息
            $http.get("vmware/vcenter/" + cloudId + "/cluster/ha?clusterKey=" + clusterKey)
                 .success(function(result){
                    waitModal.dismiss();
                    if (result.state == 0) {
                        var resolve = { clusterInfo: function () {return result.data}};
                        var snapInstance = UtilService.lgmodal('html/modal/vmware/configClusterHA.html', 'vmwareConfigHAController', resolve);
                        snapInstance.result.then(function (snap) {
                        }, function () {
                        });
                    }
                    UtilService.handleResult(result);
                 }).error(function(response, code, headers, config) {
                       waitModal.dismiss();
                       UtilService.handleError(code);
                 });
        },
        //配置vmware集群DRS
        configVmwareDRS : function(cloudId, clusterKey) {
            var waitModal = UtilService.wait();
            //查询集群的配置信息
            $http.get("vmware/vcenter/" + cloudId + "/cluster/drs?clusterKey=" + clusterKey)
                 .success(function(result){
                    waitModal.dismiss();
                    if (result.state == 0) {
                        var resolve = { clusterInfo: function () {return result.data}};
                        var snapInstance = UtilService.modal('html/modal/vmware/configClusterDRS.html', 'vmwareConfigDRSController', resolve, '510px');
                        snapInstance.result.then(function (snap) {
                        }, function () {
                        });
                    }
                    UtilService.handleResult(result);
                 }).error(function(response, code, headers, config) {
                       waitModal.dismiss();
                       UtilService.handleError(code);
                 });
        }
        //==================VMWARE 集群服务结束===============
    }
});