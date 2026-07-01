//配置国际化--h3c相关特定名称 
// CAStools                          SVMtools  


var unis_resource = {
    "casname2_ic" :"CASIC CAS ISC服务器虚拟化",
    "casname" :"SVM服务器虚拟化",
    "casname2" :"SVM ISC云业务管理中心",
    caslogoImgPath: 'css/img/loginlogo_unis_cn.svg',
	common: {
        "casToolsStatus":"SVMtools状态",
        "casToolsVersion":"SVMtools版本",
    },
    vm: {
        "setNetParamHead":"虚拟机需要安装SVMtools,否则不能正确设置。",
        "casTool":"SVMtools",
        "casToolVersion":"SVMtools 版本",
        "confirmUpgradeCastools":"确认手动升级SVMtools？",
        "confirmBatchUpgradeCastools":"确认批量升级SVMtools？",
        "upgradeCastools":"升级SVMtools",
        "batchUpgradeCastools":"批量升级SVMtools",
    },
    editDomain: {
        "casNetworkPrompt" : "通过SVMtools设置系统网络信息。",
        "casConfigPrompt" : "通过SVMtools设置系统网络信息",
        "castool" : "安装SVMtools",
        "failStrategyTip" : "注：必须启用HA，且安装SVMtools。",
        "timeSyncTip" : "注：开启时间同步要求虚拟机必须安装SVMtools且SVMtools的版本需为2.1.2.0或更高版本，否则可能导致虚拟机时间紊乱，影响业务。",
        "autoTools" : "SVMtools自动升级",
        "autoMemTip" : "注：必须安装SVMtools且未使用内存热添加。开启内存气球功能后，可以通过balloon技术动态调整虚拟机内存，进行按需分配。",
    },
    menu: {
        "upgradeCastools":"升级SVMtools",
    },
    uicustomVm: {
        "castoolsStatus":"SVMtools状态",
        "castoolsVersion":"SVMtools版本",
    },
    vswitch:{
        "vxlanCas" : "VXLAN(SVM)",
        "modeItem" : {
            "4" : "VXLAN(SVM)"
         },
        "selectVswitchErrorForRoute":"请选择一个转发模式非VXLAN(SVM)，并且物理接口、IP地址及子网掩码为非空的虚拟交换机。",
        "vxlanVswitchMatchProfileAlert":"VXLAN(SVM)虚拟交换机只允许使用VXLAN类型网络策略模板。",
    }
}
