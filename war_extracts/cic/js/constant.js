/**
 * 
 */
/** 云资源、主机池、主机菜单权限、虚拟机模板权限。**/
constant = {
	    /**================ 权限信息   ==================== START**/
		DASHBOARD_MGR :"DashboardMgr",
		CLOUD_RESOURCE_MNG :"CloudResourceMgr",
		HOST_POOL_MNG : "HostPoolMgr",
		HOST_MNG : "HostMgr",
		HOST_POOL_ADD : "CloudResourceMgr.AddHostPool",
		HOST_POOL_BACKUP : "CloudResourceMgr.Backup",
		HOST_NET_PROFILE_MGR : "CloudResourceMgr.NetProfileMgr",
		VM_SNAP_STRATEGY : "CloudResourceMgr.SnapStrategy",
		MONITOR_STRATEGY : "CloudResourceMgr.MonitorStrategy",
		BACKUP_CVM_DATA : "CloudResourceMgr.BackupCVM",
		VM_TEMPLET_MNG : "CloudResourceMgr.VmTempletMgr",
		VM_TEMPLET_ADD : "CloudResourceMgr.VmTempletMgr.Add",
		VM_TEMPLET_DEPLOY : "CloudResourceMgr.VmTempletMgr.Deploy",
		VM_TEMPLET_MODIFY : "CloudResourceMgr.VmTempletMgr.Modify",
		VM_TEMPLET_DELETE : "CloudResourceMgr.VmTempletMgr.Delete",
		VM_TEMPLET_DOWNLOAD : "CloudResourceMgr.VmTempletMgr.Down",
		VM_TEMPLET_IMPORT : "CloudResourceMgr.VmTempletMgr.Import",
		VM_TEMPLET_VIEW : "CloudResourceMgr.VmTempletMgr.View",
		VM_TEMPLET_RELEASE : "CloudResourceMgr.VmTempletMgr.Release",
		
		VM_TEMPLET_BURST : "CloudResourceMgr.VmTempletMgr.Burst",
		VM_TEMPLET_LOCALIZATION : "CloudResourceMgr.VmTempletMgr.Localization",
		NTP_TIME_SERVER : "CloudResourceMgr.NtpServer",
		
		/** 虚拟存储 */
		VIRTUAL_STORAGE_MNG : "CloudResourceMgr.VirtualStorageMgr",
		VIRTUAL_STORAGE_VIEW : "CloudResourceMgr.VirtualStorageMgr.View",
		VIRTUAL_STORAGE_ADD : "CloudResourceMgr.VirtualStorageMgr.Add",
		VIRTUAL_STORAGE_MODIFY : "CloudResourceMgr.VirtualStorageMgr.Modify",
		VIRTUAL_STORAGE_DEL : "CloudResourceMgr.VirtualStorageMgr.Delete",
		
		HOST_ADD : "HostPoolMgr.AddHost",
		CONNETCT_ALL_HOST : "HostPoolMgr.ConnectAll",
		HOST_POOL_DEL : "HostPoolMgr.Delete",
		SHARE_FILE_SYS_MGR : "HostPoolMgr.ShareFileSysMgr",
		HOST_MODIFY : "HostMgr.Modify",
		HOST_START : "HostMgr.Start",
		HOST_CLOSE : "HostMgr.Close",
		HOST_REBOOT : "HostMgr.Reboot",
		HOST_WAKE : "HostMgr.Wake",
		HOST_INTO_MAINTAIN :"HostMgr.IntoMaintain",
		HOST_EXIT_MAINTAIN :"HostMgr.ExitMaintain",
		CONNETCT_HOST : "HostMgr.Connect",
		VIRT_HOST_ADD : "HostMgr.AddVirtualHost",
		OPEN_ALL_VIRT_HOST : "HostMgr.OpenAllVirtHost",
		CLOSE_ALL_VIRT_HOST : "HostMgr.CloseAllVirtHost",
		HOST_VSWITCH_MGR : "HostMgr.VswitchMgr",
		HOST_STORAGE_MGR : "HostMgr.StorageMgr",
		HOST_DEL : "HostMgr.Delete",
		VIRTUAL_HOST_REVERT : "HostMgr.Revert",
		VIRTUAL_HOST_DEPLOYOVF : "HostMgr.DeployVof",
		HOST_POWER_MGR : "HostMgr.PowerMgr",
		
		CLUSTER_MNG : "ClusterMgr",
		CLUSTER_ADD : "ClusterMgr.Add",
		CLUSTER_DEL : "ClusterMgr.Delete",
		CLUSTER_MODIFY : "ClusterMgr.Modify",
		CLUSTER_BACKUP_MNG : "ClusterMgr.BackupMgr",
		
		/** 虚拟机菜单权限。**/
		VIRT_MNG : "CloudServiceMgr.VirtualHostMgr",
		VIRT_HOST_MODIFY : "CloudServiceMgr.VirtualHostMgr.Modify",
		VIRT_HOST_DEPLOY : "CloudServiceMgr.VirtualHostMgr.Deploy",
		VIRT_HOST_CLONE : "CloudServiceMgr.VirtualHostMgr.Clone",
		VIRT_HOST_MIGRATE : "CloudServiceMgr.VirtualHostMgr.Migrate",
		VIRT_HOST_BACKUP : "CloudServiceMgr.VirtualHostMgr.Backup",
		VIRT_HOST_START : "CloudServiceMgr.VirtualHostMgr.Start",
		VIRT_HOST_PAUSE : "CloudServiceMgr.VirtualHostMgr.Pause",
		VIRT_HOST_RESTORE : "CloudServiceMgr.VirtualHostMgr.Restore",
		VIRT_HOST_SLEEP : "CloudServiceMgr.VirtualHostMgr.Sleep",
		VIRT_HOST_RESTART : "CloudServiceMgr.VirtualHostMgr.Restart",
		VIRT_HOST_CLOSE : "CloudServiceMgr.VirtualHostMgr.Close",
		VIRT_HOST_SHUTDOWN : "CloudServiceMgr.VirtualHostMgr.ShutDown",
		VIRT_HOST_SNAPSHOT : "CloudServiceMgr.VirtualHostMgr.Snapshot",
		VIRT_HOST_DEL : "CloudServiceMgr.VirtualHostMgr.Delete",
		//VIRT_HOST_MANAGER : "CloudServiceMgr.VirtualHostMgr.Manager",
		VIRT_HOST_CONSOLE : "CloudServiceMgr.VirtualHostMgr.Console",
		VIRT_HOST_REVERT : "CloudServiceMgr.VirtualHostMgr.Revert",
		VIRT_HOST_CLONE_TEMPLET : "CloudServiceMgr.VirtualHostMgr.CloneTemplet",
		VIRT_HOST_SWITCH_TEMPLET : "CloudServiceMgr.VirtualHostMgr.SwitchTemplet",
		VIRT_HOST_DISTRIBUTE : "CloudServiceMgr.VirtualHostMgr.Distribute",
		VIRT_HOST_RETRIEVE : "CloudServiceMgr.VirtualHostMgr.Retrieve",
		VIRT_HOST_BATCH_MODIFY : "CloudServiceMgr.VirtualHostMgr.BatchModify",
		VIRT_HOST_CLOUD_BURSTING : "CloudServiceMgr.VirtualHostMgr.Bursting",
		VIRT_HOST_LOCALIZATION : "CloudServiceMgr.VirtualHostMgr.Localization",
		VIRT_HOST_EXPORTOVF : "CloudServiceMgr.VirtualHostMgr.ExportOvf",
		VIRT_HOST_EXPORT : "CloudServiceMgr.VirtualHostMgr.Export",
		VIRT_HOST_RECYCLEBIN : "CloudServiceMgr.VirtualHostMgr.RecycleBin",
		VIRT_HOST_UPGRADE_CASTOOLS : "CloudServiceMgr.VirtualHostMgr.UpgradeCastools",//升级castools
		
		/** 云主机。**/
		CLOUD_HOST_MGR : "CloudHostMgr",
		CLOUD_HOST_VIEW : "CloudHostMgr.View",
		
		/** 云硬盘。**/
		CLOUD_DISK_MGR : "CloudServiceMgr.CloudDiskMgr",
		CLOUD_DISK_VIEW : "CloudServiceMgr.CloudDiskMgr.View",
		CLOUD_DISK_Delete : "CloudServiceMgr.CloudDiskMgr.Delete",
		
		/** 云备份。**/
		CLOUD_BACKUP_STRATEGY_MGR : "CloudServiceMgr.CloudBackUpStrategyMgr",
		CLOUD_BACKUP_STRATEGY_VIEW : "CloudServiceMgr.CloudBackUpStrategyMgr.View",
		
		/** 云服务。**/
		CLOUD_SERVICE_MNG : "CloudServiceMgr",
		/** 流程管理**/
		WORKFLOW_MNG : "WorkflowMgr",
		/** 流程定制*/
		CUSTWORKFLOW_MNG : "WorkflowMgr.WorkflowCustMgr",
		/** 虚拟机电子流*/
		VMWORKFLOW_MNG : "WorkflowMgr.VmWorkflowMgr",
		VMWORKFLOW_VIEW : "WorkflowMgr.VmWorkflowMgr.View",
		VMWORKFLOW_HANDLE : "WorkflowMgr.VmWorkflowMgr.Handle",
		VMWORKFLOW_DELETE : "WorkflowMgr.VmWorkflowMgr.Delete",
		VMWORKFLOW_DEFIEN_FIELD_MNG : "WorkflowMgr.VmWorkflowMgr.DefineFieldMgr",
		VMWORKFLOW_DOWNLOAD : "WorkflowMgr.VmWorkflowMgr.DownLoad",
		/** 云硬盘电子流 **/
		CLOUDDISKFLOW_MNG : "WorkflowMgr.CloudDiskFlowMgr",
		CLOUDDISKFLOW_VIEW : "WorkflowMgr.CloudDiskFlowMgr.View",
		CLOUDDISKFLOW_HANDLE : "WorkflowMgr.CloudDiskFlowMgr.Handle",
		CLOUDDISKFLOW_DELETE : "WorkflowMgr.CloudDiskFlowMgr.Delete",
		
		/**用户预注册电子流**/
		USERREGISTERFLOW_MNG : "WorkflowMgr.UserRegisterFlowMgr",
		USERREGISTERFLOW_VIEW : "WorkflowMgr.UserRegisterFlowMgr.View",
		USERREGISTERFLOW_HANDLE : "WorkflowMgr.UserRegisterFlowMgr.Handle",
		USERREGISTERFLOW_DELETE : "WorkflowMgr.UserRegisterFlowMgr.Delete",

		/**云备份策略**/
		CLOUDBACKUPSTRATEGY_MNG : "WorkflowMgr.CloudBackupStrategyMgr",
		CLOUDBACKUPSTRATEGY_VIEW : "WorkflowMgr.CloudBackupStrategyMgr.View",
		CLOUDBACKUPSTRATEGY_HANDLE : "WorkflowMgr.CloudBackupStrategyMgr.Handle",
		CLOUDBACKUPSTRATEGY_DELETE : "WorkflowMgr.CloudBackupStrategyMgr.Delete",
		
		/**云彩虹**/
		PUBLIC_CLOUD_MGR : "CloudServiceMgr.publicCloudMgr",
		CLOUD_RAINBOW_MNG : "CloudServiceMgr.CloudRainbowMgr",
		
		/**监控管理**/
		MONITOR_MNG:"MonitorMgr",
//		STORAGE_RES_CAPACITY_MNG:"MonitorMgr.StorageResCapacityMgr",
//	    TREND_ANALYSIS_MONITOR_MNG:"MonitorMgr.TrendAnalysisMgr",
//	    RISK_ASSESSMENT_MONITOR_MNG:"MonitorMgr.RiskAssessmentMgr",
		 /** 报表管理 **/
	    REPORT_MNG : "MonitorMgr.ReportMgr",
	    REPORT_RESPOOL_COMPUTE_MNG : "MonitorMgr.ReportMgr.ComputeMgr",
	    REPORT_RESPOOL_STORAGE_MNG : "MonitorMgr.ReportMgr.StorageMgr", 
	    REPORT_ORG_QUOTA_MNG : "MonitorMgr.ReportMgr.OrgresMgr",
	    REPORT_USEAGE_VM_MNG : "MonitorMgr.ReportMgr.UsageMgr",
	    REPORT_USEAGE_VM_SUMMARY_MNG : "MonitorMgr.ReportMgr.UsageSummaryMgr",
		
		REPORT_CUSTOM_MONITOR_MNG:"MonitorMgr.CustomMonitorMgr",
		/** 自定义监控 **/
		REPORT_CUSTOMMONITOR_VIEW : "MonitorMgr.CustomMonitorMgr.View",
		REPORT_CUSTOMMONITOR_MANAGE : "MonitorMgr.CustomMonitorMgr.Mng",
		
		/** 系统管理。**/
		SYS_MNG : "SystemMgr",
		/** 操作员菜单权限。**/
		OPERATOR_SERVICE_MGR: "SystemMgr.OperatorServiceMgr",
		OPERATOR_MNG : "SystemMgr.OperatorServiceMgr.OperatorMgr",
		OPERATOR_ADD : "SystemMgr.OperatorServiceMgr.OperatorMgr.Add",
		OPERATOR_MODIFY : "SystemMgr.OperatorServiceMgr.OperatorMgr.Modify",
		OPERATOR_DELETE : "SystemMgr.OperatorServiceMgr.OperatorMgr.Delete",
		OPERATOR_VIEW : "SystemMgr.OperatorServiceMgr.OperatorMgr.View",
		ONLONE_OPERATOR_MNG : "SystemMgr.OperatorServiceMgr.OnlineOperatorMgr",
		OPERATOR_OFFLINE : "SystemMgr.OperatorServiceMgr.OnlineOperatorMgr.Offline",
		
		OPERATOR_GROUP_MNG : "SystemMgr.OperatorServiceMgr.OperatorGroupMgr",
		OPERATOR_GROUP_ADD : "SystemMgr.OperatorServiceMgr.OperatorGroupMgr.Add",
		OPERATOR_GROUP_MODIFY : "SystemMgr.OperatorServiceMgr.OperatorGroupMgr.Modify",
		OPERATOR_GROUP_DELETE : "SystemMgr.OperatorServiceMgr.OperatorGroupMgr.Delete",
		OPERATOR_GROUP_VIEW : "SystemMgr.OperatorServiceMgr.OperatorGroupMgr.View",
		
		PWD_MNG : "SystemMgr.PwdStrategyMgr",
		PWD_VIEW :"SystemMgr.PwdStrategyMgr.View",
		PWD_MANAGE :"SystemMgr.PwdStrategyMgr.Mng",
		
		ACCESS_STRATEGY_MNG :"SystemMgr.AccessStrategyMgr",
		ACCESS_STRATEGY_ADD :"SystemMgr.AccessStrategyMgr.Add",
		ACCESS_STRATEGY_MODIFY :"SystemMgr.AccessStrategyMgr.Modify",
		ACCESS_STRATEGY_DELETE :"SystemMgr.AccessStrategyMgr.Delete",
		ACCESS_STRATEGY_VIEW : "SystemMgr.AccessStrategyMgr.View",
		ACL_MNG :"SystemMgr.AclMgr",
		ACL_ADD :"SystemMgr.AclMgr.Add",
		ACL_MODIFY :"SystemMgr.AclMgr.Modify",
		ACL_DELETE :"SystemMgr.AclMgr.Delete",
		ACL_VIEW :"SystemMgr.AclMgr.View",
		CIC_BACKUP_MNG:"SystemMgr.cicBackupMgr",
		
		CER_AUTH_MNG :"SystemMgr.CerAuthMgr",
		CER_AUTH_VIEW :"SystemMgr.CerAuthMgr.View",
		CER_AUTH_MANAGE :"SystemMgr.CerAuthMgr.Mng",
		
		BACKUP_MNG :"SystemMgr.BackupMgr",
		PWD_MNG :"SystemMgr.PwdStrategyMgr",
		
		OPERATE_LOG_MNG : "SystemMgr.OperationLogMgr",
		OPERATE_LOG_DEL : "SystemMgr.OperationLogMgr.Delete",
		OPERATE_LOG_DOWNLOAD : "SystemMgr.OperationLogMgr.DownLoad",
		
		GATHER_LOG_MNG : "SystemMgr.gatherLog",
		GATHER_LOG_DEL : "SystemMgr.gatherLog.DownLoad",
		
		SYSUPGRADE_MNG : "SystemMgr.SystemUpgradeMgr",
		
		SYSCONFIG_MNG : "SystemMgr.SystemConfigMgr",
		SYSTEMPARAM_MNG : "SystemMgr.SystemConfigMgr.SystemParam",
		MAILSERVER_MNG : "SystemMgr.SystemConfigMgr.MailServer",
		AUTHSERVER_MNG : "SystemMgr.SystemConfigMgr.AuthServer",
		USERSELFHELP_MNG : "SystemMgr.SystemConfigMgr.UserSelfHelpServer",
		SMSSERVER_MNG : "SystemMgr.SystemConfigMgr.SmsServer",
		
		LICENSE_MNG : "SystemMgr.LicenseMgr",
		RESTRESC_MNG : "SystemMgr.RestResource",
		RESTRESC_ADD : "SystemMgr.RestResource.Add",
		RESTRESC_MODIFY : "SystemMgr.RestResource.Modify",
		RESTRESC_DELETE : "SystemMgr.RestResource.Delete",
		RESTRESC_VIEW : "SystemMgr.RestResource.View",
		RESTRESC_SYNC : "SystemMgr.RestResource.Sync",
		
		/**LDAP同步策略管理**/
		LDAP_CONFIG_MNG : "SystemMgr.LdapMgr.LdapConfigMgr", //LDAP同步策略管理
		LDAP_CONFIG_VIEW : "SystemMgr.LdapMgr.LdapConfigMgr.View", //LDAP同步策略查看
		LDAP_CONFIG_EDIT : "SystemMgr.LdapMgr.LdapConfigMgr.Modify", //LDAP同步策略修改
		LDAP_CONFIG_ADD : "SystemMgr.LdapMgr.LdapConfigMgr.Add", //LDAP同步策略增加
		LDAP_CONFIG_DELETE : "SystemMgr.LdapMgr.LdapConfigMgr.Delete", //LDAP同步策略删除
		LDAP_CONFIG_SYNC : "SystemMgr.LdapMgr.LdapConfigMgr.Sync", //LDAP同步策略手工同步
		LDAP_SERVER_MNG : "SystemMgr.LdapMgr.LdapServerMgr", //LDAP服务器管理节点
		LDAP_SERVER_VIEW : "SystemMgr.LdapMgr.LdapServerMgr.View", //LDAP服务器查看
	    LDAP_SERVER_EDIT : "SystemMgr.LdapMgr.LdapServerMgr.Modify", //LDAP服务器修改
	    LDAP_SERVER_ADD : "SystemMgr.LdapMgr.LdapServerMgr.Add", //LDAP服务器增加
	    LDAP_SERVER_DEL : "SystemMgr.LdapMgr.LdapServerMgr.Delete", //LDAP服务器删除
	    LDAP_USER_EXPORT : "SystemMgr.LdapMgr.LdapUserExport", //LDAP用户导出
		LDAP_MNG : "SystemMgr.LdapMgr",
		
		/**CLOUD MESSAGE**/
		CLOUDMESSAGE_MNG : "WorkflowMgr.CloudMessageMgr",
		CLOUDMESSAGE_CREATE : "WorkflowMgr.CloudMessageMgr.Create",
		CLOUDMESSAGE_DELETE : "WorkflowMgr.CloudMessageMgr.Delete",
		
		/**CLOUD WORKORDER**/
		CLOUDWORKORDER_MNG : "WorkflowMgr.CloudWorkOrderMgr",
		CLOUDWORKORDER_VIEW : "WorkflowMgr.CloudWorkOrderMgr.View",
		CLOUDWORKORDER_EDIT : "WorkflowMgr.CloudWorkOrderMgr.Edit",
		CLOUDWORKORDER_DELETE : "WorkflowMgr.CloudWorkOrderMgr.Delete",
		
		
		/**CLOUD SECURITY*/
		CLOUDSECURITY_MNG:"CloudServiceMgr.CloudSecurityMgr",
		CLOUDANTIVIRUS_CONFIG_MNG :"CloudServiceMgr.CloudSecurityMgr.AntivirusConfigMgr",
		CLOUDSECURITY_FIREWALL:"CloudServiceMgr.CloudSecurityMgr.FirewallMgr",
		
		ENTRUST_MNG : "WorkflowMgr.EntrustMgr",
		
		USER_AND_GROUP_MGR : "VdcMgr.UserAndGroupMgr",
		/**User**/
		USER_MNG : "VdcMgr.UserAndGroupMgr.UserMgr",
		USER_ADD : "VdcMgr.UserAndGroupMgr.UserMgr.Add",
		USER_MODIFY : "VdcMgr.UserAndGroupMgr.UserMgr.Modify",
		USER_DELETE : "VdcMgr.UserAndGroupMgr.UserMgr.Delete",
		USER_VIEW : "VdcMgr.UserAndGroupMgr.UserMgr.View",	
		USER_IMPORT : "VdcMgr.UserAndGroupMgr.UserMgr.Import",
		USER_OFFLINE : "VdcMgr.UserAndGroupMgr.OnlineUserMgr.Offline",
		
		/**User Group**/
		USER_GROUP_MNG : "VdcMgr.UserAndGroupMgr.UserGroupMgr",
		USER_GROUP_ADD : "VdcMgr.UserAndGroupMgr.UserGroupMgr.Add",
		USER_GROUP_MODIFY : "VdcMgr.UserAndGroupMgr.UserGroupMgr.Modify",
		USER_GROUP_DELETE : "VdcMgr.UserAndGroupMgr.UserGroupMgr.Delete",
		USER_GROUP_VIEW : "VdcMgr.UserAndGroupMgr.UserGroupMgr.View",
		
		/** ResourcePool **/
		RESOURCEPOOL_MNG : "VdcMgr.ResourcePoolMgr",
		RESOURCEPOOL_ADD : "VdcMgr.ResourcePoolMgr.Add",
		RESOURCEPOOL_MODIFY : "VdcMgr.ResourcePoolMgr.Modify",
		RESOURCEPOOL_DELETE : "VdcMgr.ResourcePoolMgr.Delete",
		RESOURCEPOOL_VIEW : "VdcMgr.ResourcePoolMgr.View",
	    
		/**organization**/
		ORGANIZATION_MNG : "VdcMgr.OrgMgr",
	    ORGANIZATION_ADD : "VdcMgr.OrgMgr.Add",
	    ORGANIZATION_MODIFY : "VdcMgr.OrgMgr.Modify",
	    ORGANIZATION_DELETE : "VdcMgr.OrgMgr.Delete",
	    ORGANIZATION_VIEW : "VdcMgr.OrgMgr.View",
	    ORGANIZATION_VM_DEPLOY : "VdcMgr.OrgMgr.Deploy",
	    ORGANIZATION_VM_BATCH_DEPLOY : "VdcMgr.OrgMgr.BatchDeploy",
	    
	    /**CVM cloud resource**/
	    CVM_MNG : "CloudResourceMgr.CvmMgr",
	    CVM_MNG_VIEW : "CloudResourceMgr.CvmMgr.View",
	    CVM_MNG_ADD : "CloudResourceMgr.CvmMgr.Add",
	    CVM_MNG_EDIT : "CloudResourceMgr.CvmMgr.Edit",
	    CVM_MNG_DELETE : "CloudResourceMgr.CvmMgr.Delete",
	    CVM_MNG_LOGIN : "CloudResourceMgr.CvmMgr.Login",
	    CVM_MNG_GRANT : "CloudResourceMgr.CvmMgr.Grant",
	    
	    /**告警管理**/
	    ALARM_MGR : "AlarmMgr",
	    ALARM_ACTUAL : "AlarmMgr.AlarmActual",
	    ALARM_CONFIG_MGR : "AlarmMgr.AlarmConfigMgr",
	    ALARM_CONFIG_VIEW : "AlarmMgr.AlarmConfigMgr.View",
	    ALARM_CONFIG_ADD : "AlarmMgr.AlarmConfigMgr.Add",
	    ALARM_CONFIG_MODIFY : "AlarmMgr.AlarmConfigMgr.Modify",
	    ALARM_CONFIG_DELETE : "AlarmMgr.AlarmConfigMgr.Delete",
	    ALARM_NOTICETEMPLATE_MGR : "AlarmMgr.AlarmNoticeTemplateMgr",
	    ALARM_NOTICETEMPLATE_VIEW : "AlarmMgr.AlarmNoticeTemplateMgr.View",
	    ALARM_NOTICETEMPLATE_ADD : "AlarmMgr.AlarmNoticeTemplateMgr.Add",
	    ALARM_NOTICETEMPLATE_MODIFY : "AlarmMgr.AlarmNoticeTemplateMgr.Modify",
	    ALARM_NOTICETEMPLATE_DELETE : "AlarmMgr.AlarmNoticeTemplateMgr.Delete",
	    
	    /**Desktop pool manage**/
	    DESKTOP_POOL_MGR : "VdcMgr.VirDesktopPoolMgr",
	    DESKTOP_POOL_VIEW : "VdcMgr.VirDesktopPoolMgr.View",
	    DESKTOP_POOL_ADD : "VdcMgr.VirDesktopPoolMgr.Add",
	    DESKTOP_POOL_EDIT : "VdcMgr.VirDesktopPoolMgr.Modify",
	    DESKTOP_POOL_DEL : "VdcMgr.VirDesktopPoolMgr.Delete",
	    DESKTOP_POOL_RESTRATEGY : "VdcMgr.VirDesktopPoolMgr.ReStrategy",
	    DESKTOP_POOL_HEALTHCHECK : "VdcMgr.VirDesktopPoolMgr.HealthCheck",
	    
	    VDC_MNG:"VdcMgr",
		/**================ 权限信息   ==================== END**/
	    
	    
		
		keyInterval:500,//按键的时间间隔，用于搜索框设置时间间隔
		
		/** 阿里服务器。 */
	    PUBLIC_CLOUD_ALI : 1,
	    /** CVM。 */
	    PUBLIC_CLOUD_CVM : 2,
	    /** VMware服务器。 */
	    PUBLIC_CLOUD_VMWARE : 3,
	    /** CIC。 */
	    PUBLIC_CLOUD_CIC : 4,
	    /** Cloud_OS。 */
	    PUBLIC_CLOUD_OS : 5,
	    
	    /** 登入方式  */
	    HTTP : "http",
	    HTTPS : "https",
		
		/** 虚拟机启动优先级。**/
		VIRT_PRIORITY_LOWER : 0,
		VIRT_PRIORITY_MIDDLE : 1,
		VIRT_PRIORITY_HIGH : 2,
		
		/** OS故障处理。**/
		OS_FAULT_NO_HANDLE : 0,
	    OS_FAULT_RESATRT : 1,
		OS_FAULT_MIGRATE : 2,
		
		/** 虚拟机内存资源优先级。**/
		VIRT_MEMORY_PRIORITY_LOWER : 0,
		VIRT_MEMORY_PRIORITY_MIDDLE : 50,
		VIRT_MEMORY_PRIORITY_HIGH : 100,
		
		/** 虚拟机调度优先级。**/
		VIRT_SCHEDULER_PRIORITY_LOWER : 256,
		VIRT_SCHEDULER_PRIORITY_MIDDLE : 512,
		VIRT_SCHEDULER_PRIORITY_HIGH : 1024,
		
		/** 虚拟机I/O优先级。**/
		VIRT_IO_PRIORITY_LOWER : 200,
		VIRT_IO_PRIORITY_MIDDLE : 300,
		VIRT_IO_PRIORITY_HIGH : 500,
		
		/** 虚拟机Mode。**/
		CPU_MODE_CUSTOM : "custom",
		CPU_MODE_HOST_MODEL : "host-model",
		CPU_MODE_HOST_PASSTHROUGH : "host-passthrough",
		
		/** 定时器1秒执行一次。 */
		PERIOD : 1 * 1000,
		
		/** LibvirtErrorCode 错误码 */
		DOMAIN_EXSIT : 3001, //虚拟机已存在。
		DOMAIN_NOT_EXIST : 1001,
		/** 虚拟交换机名称已存在。*/
		CLUSTER_VSWITCH_NAME_ALREADY_EXIST : 1129,
		VSWITCH_NAME_ALREADY_EXIST : 1130,
		/** 组织不存在*/
		ORG_NOT_EXIST : 1503,
		/** 目录已存在,请更换目录。 */
		DIRECTORY_ALREADY_EXIST : 93,
		/** 存储池名称已存在。 */
		STORAGE_POOL_NAME_EXIST : 501,
		
		/** 网卡驱动类型。 */
		INF_MODEL_TYPE_RTl8139 : "rtl8139",
		INF_MODEL_TYPE_VIRTIO : "virtio",
		INF_MODEL_TYPE_E1000 : "e1000",
		INF_MODEL_TYPE_SR_IOV : "SR_IOV",
		INF_MODEL_TYPE_PHYSICS : "Physics",
		
		/** SR-IOV网卡驱动类型。 */
		INF_MODEL_TYPE_KVM : "KVM",
		INF_MODEL_TYPE_VFIO : "VFIO",
		
		/** 自动迁移类别 */
		VIRT_BATCH_SELECT_TRUE : 1,
		VIRT_BATCH_SELECT_FALSE : 0,
		
		/** 主机不正常状态 。 */
		HOST_ABNORMITY_STATUS : 0,
		/** 主机正常状态 。 */
		HOST_NORMAL_STATUS : 1,
		/** 是否在集群内。 */
		HOST_CLUSTER_STATUS : 2,
		/** 主机维护状态 。 */
		HOST_MAINTAIN_STATUS : 3,
		/** 主机维护状态(本地存储故障) 。 */
		HOST_MAINTAIN_STATUS_STORAGE_FAILURE : 4,
		
		/** 标准版 。 */
		STANDARD_VER : 1,
		
		/** 延迟刷新时间。 */
		DELAY_REFRESH : 1500,
		
		/** 文件不存在。 */
		FILE_NOT_EXIST : 212,
		
		/** 共享文件系统不存在。 */
		OCFS2_NOT_EXIST : 1200,
		
		/** 该组织下虚拟机模板已经被删除。 */
		ORG_TEMPLATE_NOT_EXIT : 1517,
		
		/** 磁盘存在分区，不可直接用做共享文件系统，请手工删除分区后再配置使用。 */
		DISK_EXIST_PARTITION : 5112,
		
		/** LUN合并失败 */
		OCFS2_LUN_MERGE_FAILED : 5061,
		
		/** 主机ssh连接错误。 */
		HOST_SSH_ERROR_CONNECT_HOST : 801,
		
		/**  公共云不存在  */
		PUBLIC_CLOUD_NOT_EXIST : 9007,
		
		/** chart 到处图片URL。*/
		CHART_EXPORT_RUL : "servlet/highChartsServlet",
		/** Tool 工具安装驱动包。*/
		TOOL_PATH : "/vms/isos/castools.iso",
		
		/** VMware产品下的vCente结点。*/
		VMWARE_VCENTER : 3,
		/** CAS结点。*/
		CAS_CIC : 2,
		
		MESSAGE_VIRTUALHOST : 10,
		
		/** 存储池下的目录不存在。 */
		STORAGEPOOL_FOLDER_NAME_NOT_EXIST : 211,
		
		/** 注释增加必填项 */ 
		REQUIRED : "<span style:\"color:#FF0000, margin-left: -11px, z-index:9999, position: absolute,\">* </span>",
		
		/** combox下拉框tip的template tip显示value的值 */ 
		COMBOXTIP_TEMPLATE : "<tpl for:\".\"><div class:\"x-combo-list-item\" qtip:\"<div style : 'WORD-BREAK:break-all,WORD-WRAP:break-word,'>{value}</div>\">{value}</div></tpl>",
		
		/** combox下拉框tip的template tip显示text的值 */ 
		COMBOXTIP_TEMPLATE_TEXT : "<tpl for:\".\"><div class:\"x-combo-list-item\" qtip:\"<div style : 'WORD-BREAK:break-all,WORD-WRAP:break-word,'>{text}</div>\">{value}</div></tpl>",
		
		/** 组织部署*/
		ORG_DEPLOY : 0,
		/** 虚拟桌面池部署*/
		VIR_DESK_DEPLOY : 1,
		
		/** 虚拟机分配信息不存在。*/
		ACCESS_DOSE_NOT_EXIST : 1532,
		
		/** 动态资源扩展业务内虚拟机最大个数 */
		DRX_VM_MAX_NUM : 100,
		
		/** 虚拟机CPU总核数最大值 */
		VM_CPU_MAX_NUM : 255,
		
		/** 虚拟机最大CPU个数128。*/
		VM_CPU_MAX_NUM2 : 128,
		
		/** 虚拟机导入。 */
		OPERTYPE_IMPORT : "IMPORT",
		/** 虚拟机还原。 */
		OPERTYPE_RESTORE : "RESTORE",
		
		/** 用户登录失败－密码过期。 */
		USERAUTH_PASSWORD_OVERDUE_ERROR : 103,
		
		/** 用户登录失败－当前账户，在线数达到最大限制。 */
		CURR_OPER_ONLINE_NUM_MORE_THAN_MAX_NUM : 106,
		
		/** 虚拟机备份后，磁盘个数发生变化，不允许进行还原操作。  */
		VM_DISK_CHANGE_FORBID_RESTORE : 1918,
		
		/** 虚拟机备份文件不存在  */
		VM_BACKUP_NOT_EXISTS : 4605,
		
		/** 虚拟机备份目录不存在  */
		VM_BACKUP_DIR_NOT_EXISTS : 4517,
		
		/** vmware虚拟机不存在，已删除该虚拟机。*/
		DOMAIN_NOT_EXIST_AND_DELETE : 3903,
		
		NOVNC_TOKEN_PATH : "/usr/local/noVNC/vnc_tokens/",
		
		BACKUP_TMP_DIR : "/vms/vmbackuptmp",
		
		/** 虚拟交换机的增加方式，0：主机下增加。**/
		ADD_IN_HOST : 0,
		/** 虚拟交换机的增加方式，1：集群下增加。**/
		ADD_IN_CLUSTER : 1,
		
		/** FC存储池多路径。**/
		FC_MULTIPATH : "Multipath",
		
		/**物理网卡SR-IOV状态*/
		NETWORK_CARD_SR_IOV_UP:1,
		NETWORK_CARD_SR_IOV_DOWM:0,
		NETWORK_CARD_NOT_SUPPORT : 2,
		
		/**物理网卡LLDP状态*/
		NETWORK_CARD_LLDP_UP : 1,
		NETWORK_CARD_LLDP_DOWN : 0,
		
		/** 普通克隆。 */ 
		NORMAL_CLONE : 0,
		/** 快速克隆。 */
		QUICK_CLONE : 1,
		/** 完整克隆，合并存储为一级。 */
		COMPLETE_CLONE : 2,
		
		/** 快照虚拟机超时时间，默认5分钟 */
		SNAPSHOT_TIMEOUT : 5 * 60000,
		
		/** 本地存储高可靠性状态 */
		LOCAL_STORAGE_HA_UP : 1,
		LOCAL_STORAGE_HA_DOWN : 0,
		
		/** 启动存储I/O控制*/
		UP_IO_CONTROL : 1,
		/** 关闭存储I/O控制*/
		DOWN_IO_CONTROL : 0,
		
		/** 主机池及下级资源授权管理 */
		HOST_POOL_GRANT : "HostPoolMgr.Grant",
		
		/** 告警级别，1：紧急 2：重要 3：次要 4：提示。**/
		ALARM_LEVEL_CRITICA : 1,
		ALARM_LEVEL_MAJOR : 2,
		ALARM_LEVEL_MINOR : 3,
		ALARM_LEVEL_WARNING : 4,
		
		/** 告警类型，1：主机资源告警 2：虚拟机资源告警 3：集群资源告警 4：故障告警 5 操作告警 6 其他异常告警 7 安全告警**/
		ALARM_HOST_TYPE : 1,
		ALARM_VM_TYPE : 2,
		ALARM_CLUSTER_TYPE : 3,
		ALARM_TROUBLE_TYPE : 4,
		ALARM_OPERTOR_TYPE : 5,
		ALARM_EXCEPTION_TYPE : 6,
		ALARM_SECURITY_TYPE : 7,
		
		//ACL类型
		LAYER_2 : '2',    //二层
		LAYER_3 : '3',    //三层，IPv4
		
		FCPATH : '/dev/disk/by-id', //FC存储池路径
		
		/**================ RequestData  类型信息   ==================== START**/
		CANCEL_STATUS :0,
        WAITTING_STATUS :1,
        RUNNING_STATUS :2,
        /** 空操作。 */
        NULL_ACTION :'-1',
		/** 增加集群操作。 */
		ADD_CLUSTER :1,
		/** 删除集群操作。 */
		DEL_CLUSTER :2,
		
		/** 集群HA使能操作。 */
		ENABLE_HA :3,
		/** 集群HA禁用操作。 */
		DISABLE_HA :4,
		/** 重命名集群操作。 */
		RENAME_CLUSTER :5,
		/** 增加主机操作。 */
		ADD_HOST :10,
		
		/** 删除主机操作。 */
		DEL_HOST :11,
		/** 导入VM操作。 */
		IMPORT_VM :12,
		
		/** 重置集群HA操作。 */
		ADD_HOST_RESET_CLUSTER :13,	
		/** 恢复集群HA操作。 */
		ADD_HOST_RESTORE_CLUSTER :14,
		
		/** 加入集群HA操作。 */
		ADD_TO_HA :15,
		
		/** 恢复集群OCFS2操作。 */
		ADD_HOST_RESTORE_OCFS2 :16,
		
		/** 进入维护模式Maintain*/
		HOST_INTO_MAINTAIN :17,
		
		/** 推出维护模式Maintain*/
		HOST_EXIT_MAINTAIN :18,
		
		/** 增加VM操作。 */
		ADD_VM :20,
		/** 删除VM操作。 */
		DEL_VM :21,
		/** 修改VM操作。 */
		EDIT_VM :22,
		/** 增加VM设备操作。 */
		ADD_VM_DEV :23,
		/** 删除VM设备操作。 */
		DEL_VM_DEV :24,
		/** 修改VM设备操作。 */
		EDIT_VM_DEV :25,
		/** 修复虚拟机 */
		REPAIR_VM :26,
		/** 启动VM操作。 */
		RUN_VM :30,
		/** 关闭VM电源操作。 */
		CLOSE_VM :31,
		/** 关闭VM操作。 */
		SHUTDOWN_VM :32,
		/** 重启VM操作。 */
		RESTART_VM :33,
		/** 暂停VM操作。 */
		PAUSE_VM :34,
		/** 恢复VM暂停操作。 */
		RESTORE_VM :35,
		/** 休眠VM操作。 */
		SLEEP_VM :36,
		/** 克隆VM操作。 */
		CLONE_VM :37,
		/** 迁移VM操作。 */
		MIGRATE_VM :38,
		/** 立即备份VM操作。 */
		BACKUP_VM :40,
		/** 还原VM操作。 */
		REVERT_VM :41,
		
		/** 快照VM操作。 */
		SNAPSHOT_VM :42,
		/** 删除快照操作。 */
		DEL_SNAPSHOT :43,
		/** 从快照还原操作。 */
		RESUME_FROM_SNAPSHOT :44,
		
		/** 克隆VM模板操作。 */
		CLONE_VM_TEMPLET :45,
		/** 转换VM模板操作。 */
		CONVERT_TO_TEMPLET :46,
		
		/** 部署VM操作。 */
		DEPLOY_VM :47,
		
		/** 删除VM模板操作。 */
		DEL_VM_TEMPLET :48,
		
		/** 修改VM模板操作。 */
		EDIT_VM_TEMPLET :49,
		/** 批量启动VM操作。 */
		BATCH_RUN_VM :50,
		/** 批量关闭VM操作。 */
		BATCH_CLOSE_VM :51,
		/** 批量重启VM操作。 */
		BATCH_RESTART_VM :52,
		/** 批量暂停VM操作。 */
		BATCH_PAUSE_VM :53,
		/** 批量恢复VM暂停操作。 */
		BATCH_RESTORE_VM :54,
		/** 批量休眠VM操作。 */
		BATCH_SLEEP_VM :55,
		
		/** 批量部署VM操作。 */
		BATCH_DEPLOY_VM :56,
			
		/** 修改VM操作。 */
		MODIFY_VM :58,
		
		/** 快照VM快照操作。 */
		MODIFY_SNAPSHOT_VM :59,
		
		/** 立即备份VM到上级CAS操作。 */
		BACKUP_VM_TO_CAS :60,
		/** 从CAS还原虚拟机操作。 */
		REVERT_VM_FROM_CAS :61,
		
		/** 虚拟机云爆发到其他CAS。 */
		BURST_TO_CAS :63,
		
		/** 虚拟机模板云爆发到其他CAS。 */
		BURST_TMP_TO_CAS :64,
		
		/** 虚拟机本地化 */
		LOCAL_FROM_CAS :66,
		
		/** 部署其他CAS云爆发过来的虚拟机  */
		DEPLOY_BURST_DOMAIN :67,
		
		/** 部署其他CAS云爆发过来的虚拟机模板  */
		DEPLOY_BURST_TEMPLET :68,
		
		/** 部署OVF模板 **/
		DEPLOY_OVF_TEMPLET :69,
		
		/** 收集domain文件，打包压缩*/
		TAR_COLLECT_VM :70,
		
		/** 虚拟机模板本地化 */
		TEMPLATE_LOCAL_FROM_CAS :71,
		
		/** 部署Nova VM操作。 */
		DEPLOY_NOVA_VM :72,
		
		/** 重置 Nova VM操作。 */
		RESIZE_NOVA_VM :73,
		
		/** 历史备份信息导入。 */
		IMPORT_HISTORY :74,
		
		/** 添加HA应用监控任务。 */
		ADD_HA_APP_MONITOR :75,
		
		/** 修改HA应用监控任务。 */
		EDIT_HA_APP_MONITOR :76,
		
		/** 删除HA应用监控任务。 */
		DELETE_HA_APP_MONITOR :77,
		
		/** 开启HA应用监控任务。 */
		START_HA_APP_MONITOR :78,
		
		/** 暂停HA应用监控任务。 */
		STOP_HA_APP_MONITOR :79,
		
		/** 虚拟机创建外部快照任务。 */
		EXTENAL_SNAP_CREATE :80,
		
		/** 虚拟机合并外部快照任务。 */
		EXTENAL_SNAP_COMMIT :81,
		
		SNAPSHOT_DISK_RESUME :82,
		
		/** 刷新VM操作。 */
		REFRESH_VM :100,
		/** 格式化操作。 */
		FORMAT_STORAGE :101,
		/** 拷贝存储卷。 */
		COPY_VOL :102,
		
		/** 从回收站还原虚拟机操作。 */
		RESTORE_VM_FROM_RECYCLEBIN :103,
		
		/** 重注册虚拟机，为REST API开发*/
		 REGISTE_VM :104,
		
		/** 关闭主机 shutoffHost*/
		HOST_SHUTOFF :171,
		/** 重启主机rebootHost*/
		HOST_REBOOT :172,
		/** 远程唤醒主机wakeHost*/
		HOST_WAKE :173,
		/** 备份CVM数据。  */
		BACKUP_CVM_DATA :174,
		/** 处理虚拟机HA异常 */
		HANDLE_VM_HA :175,
		
		/** 导入CIC备份*/
		BACKUP_CIC_IMPORT:177,
		
		/** NOVA快照VM操作。 */
		SNAPSHOT_VM_DISK :200,
		
		/** Cinder 存储卷拷贝操作 */
		VOLUME_COPY :201,
		
		IMPORT_USER : 201,
		
		/** 导入Nova接口上传的虚拟机 */
		NOVA_IMPORT_VM :202,
		
		/** 导出虚拟机 */
		NOVA_EXPORT_VM :203,
		
		
		/** 虚拟机的存储卷更换存储池 */
		ALTER_STRORAGEPOOL :204,
		
		/** 虚拟机的存储卷更换存储池 检查*/
		ALTER_STRORAGEPOOL_CHECK :205,
		
		/** 主机本地存储高可靠性操作 */
		LOCAL_STORAGE_HA :210,
		
		/** 还原VM操作。 */
		REVERT_VM_FROM_OTHER :211,
		
		/** REST接口快照VM操作。（实际是拷贝） */
		REST_SNAPSHOT_VM_DISK :300,
		
		/**增加主机池 **/
		ADD_HOSTPOOL :400,
		/**删除主机池 **/
		DEL_HOSTPOOL :401,
		
		
		
		/**增加监控面板**/
		ADD_MONITOR_NODE : 500,
		/**修改监控面板**/
		EDIT_MONITOR_NODE : 501,
		/**删除监控面板**/
		DELETE_MONITOR_NODE : 502,
		
		/**增加CVM云资源**/
		ADD_CLOUD_NODE : 600,
		/**修改CVM云资源**/
		EDIT_CLOUD_NODE : 601,
		/**删除CVM云资源**/
		DELETE_CLOUD_NODE : 602,
		/**手工同步云资源的虚拟机**/
		SYNC_CLOUD_DOMAIN : 190,
		/**增加虚拟桌面池**/
		ADD_DESKTOP_NODE : 700,
		/**修改虚拟桌面池**/
		EDIT_DESKTOP_NODE : 701,
		/**删除虚拟桌面池**/
		DELETE_DESKTOP_NODE : 702,
		/**增加组织**/
		ADD_ORG_NODE : 800,
		/**修改组织**/
		EDIT_ORG_NODE : 801,
		/**删除组织**/
		DELETE_ORG_NODE : 802,
		/**同步组织模板**/
		SYNC_ORG_TEMP :803,
		/**刷新云彩虹**/
		REFRESH_RAINBOW : 901,
		/** 配置VMware HA*/
		VMWARE_HA : 1000,
		/** 配置VMware DRS*/
		VMWARE_DRS : 1001,
		/**增加资源池**/
		ADD_RESOURCEPOOL_NODE : 1100,
		/**删除资源池**/
		DELETE_RESOURCEPOOL_NODE : 1101,
		
		/**cloudOS vm */
		OPERATE_CLOUDOS_VM : 2000,
	   /**================ RequestData  类型信息   ==================== END**/
		 
	   /**=========== angularjs Controller间传播事件名称信息=========== START**/
		onQueryShareFileList : 'onQueryShareFileList',    //主机池下的共享文件系统列表的刷新事件
		onQueryNetStrategyList : 'onQueryNetStrategyList',//主机池下的网络策略模板的刷新事件
		onQueryBackupFileList : 'onQueryBackupFileList',  //虚拟机备份列表的刷新事件
		onQueryTemplate : 'onQueryTemplate',              //虚拟机模板列表的刷新事件
		onQueryVirtualStorage : 'onQueryVirtualStorage',  //虚拟共享存储列表的刷新事件
		onQueryVmRecycle : 'onQueryVmRecycle',  //虚拟机回收站列表的刷新事件
	    onnext: 'onnext',                      //弹出窗口出发下一步按钮的点击事件的刷新事件 
	    onAlarmNodeSelected:'onAlarmNodeSelected',//选中云告警下节点事件
	    onQueryAlarmThresholdList: 'onQueryAlarmThresholdList',  //告警阈值列表的刷新事件	
	    onMonitorMngNodeSelected:'onMonitorMngNodeSelected',
	    onSystemMngNodeSelected:'onSystemMngNodeSelected',  //选中系统管理下打树节点事件
	    onReportMngNodeSelected:'onReportMngNodeSelected', 
	    onUserMngNodeSelected:'onUserMngNodeSelected',		//选中用户管理下树节点事件
	    oncloudServiceNodeSelected:'oncloudServiceNodeSelected',//选中云服务下节点事件
	    oncloudSecurityNodeSelected:'oncloudSecurityNodeSelected',//选中云安全节点事件
	    onVDCNodeSelected:'onVDCNodeSelected',		//选中VDC节点事件
	    onVDCNodeChange:'onVDCNodeChange',     //vdc节点修改
	    onCloudNodeSelected:'onCloudNodeSelected',			//选中云资源节点事件
	    onRefreshCloudNode:"onRefreshCloudNode",//刷新云资源节点
	    onRefreshDesktop:"onRefreshDesktop",//刷新虚拟桌面池
	    onRefreshOrg:"onRefreshOrg",//刷新组织
	    onReloadVmList:'onReloadVmList',               //重新加载虚拟机列表
	    onRefreshVmListData:'onRefreshVmListData',  //重新加载云主机电子流
	    onReloadDiskWorkFlowList:'onReloadDiskWorkFlowList',//重新加载云硬盘电子流
	    onReloadRegisterWorkFlowList:'onReloadRegisterWorkFlowList',//重新加载用户预注册
	    onReloadBackupWorkFlowList:'onReloadBackupWorkFlowList',//重新加载云备份电子流
	    onReloadWorkOrderList:'onReloadWorkOrderList',//重新加载云工单
	    onNavClick : 'onNavClick',
	    onRefreshUserList : 'refreshUserList',
	    onReloadVmwareVmList:'onReloadVmwareVmList',//刷新vmware虚拟机列表,
	    onReloadVmwareClusterSummary:'onReloadVmwareClusterSummary',//刷新vmware集群概要
	    onRefreshDesktopSummary : 'onRefreshDesktopSummary', //刷新虚拟桌面池概要
	    onRefreshCloudOSVmList : 'onRefreshCloudOSVmList', //刷新cloudOS虚拟机列表
	    onRefreshPerformanceMonitor:"onRefreshPerformanceMonitor",
	    onAdvancedQueryVmUsage:"onAdvancedQueryVmUsage",
	    onResourcePoolMngNodeSelected:"onResourcePoolMngNodeSelected",
	    onQueryAlarmThresholdList:"onQueryAlarmThresholdList",
	    onRefreshRainbowData:'onRefreshRainbowData',
	    onQueryGridError:'onQueryGridError',
	    onRefreshResourcePool:'onRefreshResourcePool',//刷新资源列表
	    onRefreshResourcePoolStorage:'onRefreshResourcePoolStorage',//刷新资源池存储栏,
	    onRefreshVswitch:'onRefreshVswitch',//刷新资源池虚拟交换机,
	    onRefreshProfile:'onRefreshProfile',//刷新资源网络策略模板
	    onWorkFlowMngNodeSelected:'onWorkFlowMngNodeSelected',  //选中流程管理下打树节点事件
	    onRefreshOrgList:'onRefreshOrgList',//刷新组织列表
	    onRefreshOrgResourcePoolList:'onRefreshOrgResourcePoolList',
	    onRefreshDeskTopTemplate : "onRefreshDeskTopTemplate",
	    
	    onResourcePoolNodeChange:'onResourcePoolNodeChange',//刷新资源池节点
	   /**========== angularjs Controller间传播事件名称信息============= END**/
	    	
	    /**=======================错误码============================== START**/
	    WARN_ISSUE_NOT_EXIST_IPCONFIG : 6601,
	    /**=======================错误码============================== END**/
	    
	    cloudTreeId:'cloudResourcTreeId',
	    cas : "cas",
	    unis: "UNIS",
	    casic: "CASIC",
	    casicunis: "CASICUNIS",
	    VXLAN_CAS: "VXLAN_CAS",
			unicloud:"UniCloud",
	    
	    /**=======================导航节点信息============================== START**/
	    PUBLIC_CLOUD_VMWARE_NODE : 19, //外部云资源结点，如VMWare vCenter
	    PUBLIC_CLOUD_HOST_POOL : 20, //外部云vCenter 数据中心DC结点
	    PUBLIC_CLOUD_HOST : 21, //外部云vCenter 主机结点
	    PUBLIC_CLOUD_CLUSTER : 22, //外部云vCenter 集群;
	    VMWARE:"vmware",
	    VMWARE_HOSTPOOL_TYPE : "v_hostpool",
        VMWARE_CLUSTER_TYPE : "v_cluster",
        VMWARE_HOST_TYPE : "v_host",
        VMWARE_VM_TYPE : "v_vm",
        CLOUD_HOST_TYPE : "cloudHost", //云主机节点类型
        /**=======================导航节点信息============================== END**/
        
        /**=======================USBKEY============================== START**/
	    CERT_HASH_ERROR: '167772164', //firefox
	    PIN_ERROR1 :'167772196',  //PIN码错误
	    PIN_ERROR :'167772199',  //PIN码错误
	    USBKEY_LOCK_ERROR :'167772197', //USBkey锁定
	    SGD_SHA1 : 'SGD_SHA1',  //标准摘要算法
	    SGD_SM3 : 'SGD_SM3',  //国密摘要算法
	    /**=======================USBKEY============================== END**/
	    
	    
	    
	    /**========================TABLE id Start================================== **/
	    // 例子: DRX_LIST_DIV_ID : 'drxListDivId',
	    // 云资源
	    CLOUD_RESOURCE_LIST_DIV_ID : 'cloudResourceListDivId',//云资源列表
	    CVM_HOST_LIST_DIV_ID : 'cvmHostListDivId',//云资源-主机列表
	    CVM_VM_LIST_DIV_ID : 'cvmVmListDivId',//云资源-虚拟机列表
	    STORAGE_POOL_SELECTOR_IN_HOST_DIV_ID : 'storagepoolSelectorInHost', //选择存储池
	    SELECT_USER_LIST_DIV_ID : 'userList1Div', // 云资源-分配虚拟机-选择用户
	    // 云服务
	    
	    // VDC管理	    
	    RESOURCE_POOL_LIST_DIV_ID : 'resourcePoolListDivId',
	    VSWITCH_RESOURCE_LIST_DIV_ID : 'vswitchResourceListDivId',
	    ORG_LIST_DIV_ID : 'orgListDivId',
	    ORG_VM_LIST_DIV_ID : 'orgVmListDivId',
	    ORG_VM_USER_LIST_DIV_ID : 'orgVmUserListDivId',
	    TEMPLATE_LIST_DIV_ID : 'templateListDivId',
	    ORG_VM_TMP_NET_LIST_DIV_ID : 'orgVmTmpNetListDivId',
	    ORG_VM_TMP_STORAGE_LIST_DIV_ID : 'orgVmTmpStorageListDivId',
	    USER_LIST_DIV : 'userListDiv',
	    ORG_USER_VM_LIST_DIV_ID : 'orgUserVmListDivId',
	    ORG_CLOUD_BAK_STRATEY_LIST_DIV_ID : 'orgCloudBakStrategyListDivId',
	    USER_GRP_LIST_DIV: 'userGrplistDiv',
	    ORG_MANAGER_LIST_DIV_ID : 'orgManagerListDivId',
	    DESKTOP_LIST_DIV_ID : 'desktopListDivId',
	    // 流程管理
	    
	    // 告警管理
	    REALTIME_ALARM_LIST_DIV_ID : 'realtimeAlarmListDivId',
	    ALARM_SET_LIST_DIV_ID : 'alarmSetListDivId',
	    SELECT_ALARM_ITEM_DIV_ID : 'selectAlarmItemDivId',
	    NOTICE_TEMPLATE_DIV_ID : 'noticeTemplateDivId',
	    // 监控管理
	    ORG_RESOURCE_DIV_ID : 'orgResourceDivId',
	    VM_USAGE_DIV_ID : 'vmUsageDivId',
	    VM_USAGE_SUMMARY_DIV_ID : 'vmUsageSummaryDivId',
	    // 系统管理
	    /**========================TABLE id end================================== **/
};