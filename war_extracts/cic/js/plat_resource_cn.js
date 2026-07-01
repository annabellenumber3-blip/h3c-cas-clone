//配置国际化--h3c相关特定名称 
// CAStools                          SVMtools  


var unis_resource = {
    "casname2_ic" :"CASIC CAS CIC服务器虚拟化",
    "casname" :"CAS云计算管理平台",
    "casname2" :"CAS CIC云业务管理中心",
    caslogoImgPath: 'css/img/caslogo_cn.svg',
    common: {
        "casToolsStatus":"CAStools状态",
        "casToolsVersion":"CAStools版本",
    },
    vm: {
        "setNetParamHead":"虚拟机需要安装CAStools,否则不能正确设置。",
        "casTool":"CAStools",
        "casToolVersion":"CAStools 版本",
        "confirmUpgradeCastools":"确认手动升级CAStools？",
        "confirmBatchUpgradeCastools":"确认批量升级CAStools？",
        "upgradeCastools":"升级CAStools",
        "batchUpgradeCastools":"批量升级CAStools",
    },
    editDomain: {
        "casNetworkPrompt" : "通过CAStools设置系统网络信息。",
        "casConfigPrompt" : "通过CAStools设置系统网络信息",
        "castool" : "安装CAStools",
        "failStrategyTip" : "注：必须启用HA，且安装CAStools。",
        "timeSyncTip" : "注：开启时间同步要求虚拟机必须安装CAStools且CAStools的版本需为2.1.2.0或更高版本，否则可能导致虚拟机时间紊乱，影响业务。",
        "autoTools" : "CAStools自动升级",
        "autoMemTip" : "注：必须安装CAStools且未使用内存热添加。开启内存气球功能后，可以通过balloon技术动态调整虚拟机内存，进行按需分配。",
    },
    menu: {
        "upgradeCastools":"升级CAStools",
    },
    uicustomVm: {
        "castoolsStatus":"CAStools状态",
        "castoolsVersion":"CAStools版本",
    },
    vswitch:{
        "vxlanCas" : "VXLAN(CAS)",
        "modeItem" : {
            "4" : "VXLAN(CAS)"
        },
        "selectVswitchErrorForRoute":"请选择一个转发模式非VXLAN(CAS)，并且物理接口、IP地址及子网掩码为非空的虚拟交换机。",
        "vxlanVswitchMatchProfileAlert":"VXLAN(CAS)虚拟交换机只允许使用VXLAN类型网络策略模板。",
    }
}
