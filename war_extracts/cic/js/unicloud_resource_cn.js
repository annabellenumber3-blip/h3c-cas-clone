//配置国际化--h3c相关特定名称 
// CAStools                          USphereTools  


var unis_resource = {
  "casname2_ic" :"CASIC CAS ISC服务器虚拟化",
  "casname" :"USphere服务器虚拟化",
  "casname2" :"USphere ISC云业务管理中心",
  caslogoImgPath: 'css/img/loginlogo_unicloud.png',
common: {
      "casToolsStatus":"USphereTools状态",
      "casToolsVersion":"USphereTools版本",
  },
  vm: {
      "setNetParamHead":"虚拟机需要安装USphereTools,否则不能正确设置。",
      "casTool":"USphereTools",
      "casToolVersion":"USphereTools 版本",
      "confirmUpgradeCastools":"确认手动升级USphereTools？",
      "confirmBatchUpgradeCastools":"确认批量升级USphereTools？",
      "upgradeCastools":"升级USphereTools",
      "batchUpgradeCastools":"批量升级USphereTools",
  },
  editDomain: {
      "casNetworkPrompt" : "通过USphereTools设置系统网络信息。",
      "casConfigPrompt" : "通过USphereTools设置系统网络信息",
      "castool" : "安装USphereTools",
      "failStrategyTip" : "注：必须启用HA，且安装USphereTools。",
      "timeSyncTip" : "注：开启时间同步要求虚拟机必须安装USphereTools且USphereTools的版本需为2.1.2.0或更高版本，否则可能导致虚拟机时间紊乱，影响业务。",
      "autoTools" : "USphereTools自动升级",
      "autoMemTip" : "注：必须安装USphereTools且未使用内存热添加。开启内存气球功能后，可以通过balloon技术动态调整虚拟机内存，进行按需分配。",
  },
  menu: {
      "upgradeCastools":"升级USphereTools",
  },
  uicustomVm: {
      "castoolsStatus":"USphereTools状态",
      "castoolsVersion":"USphereTools版本",
  },
  vswitch:{
      "vxlanCas" : "VXLAN(USphere)",
      "modeItem" : {
      "4" : "VXLAN(USphere)"
      },
      "selectVswitchErrorForRoute":"请选择一个转发模式非VXLAN(USphere)，并且物理接口、IP地址及子网掩码为非空的虚拟交换机。",
      "vxlanVswitchMatchProfileAlert":"VXLAN(USphere)虚拟交换机只允许使用VXLAN类型网络策略模板。",
  }
}
