# H3C CAS R0785P03 — Complete WAR File Extraction & URL Mapping

## Overview
Extracted all 6 WAR files + 4 backend service JARs from the H3C CAS frontend package.  
All code is at: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/`

---

## 1. cic.war — Main CIC Web Application (111 MB, 4668 files)

### Web Container: Spring MVC + Jersey REST + Spring Security
### web.xml: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/cic/WEB-INF/web.xml`

### Filters
| Filter Name | Class | URL Pattern |
|---|---|---|
| springSecurityFilterChain | org.springframework.web.filter.DelegatingFilterProxy | `/*` |
| CharacterEncodingFilter | org.springframework.web.filter.CharacterEncodingFilter (utf-8) | `/*` |

### Servlets
| Servlet Name | Class | URL Pattern | Notes |
|---|---|---|---|
| Jersey Spring Web Application | com.sun.jersey.spi.spring.container.servlet.SpringServlet | `/casrs/*` | REST API layer (JAX-RS), resource packages: `com.virtual.plat.server.rs.ext`, RolesAllowedResourceFilterFactory |
| dispatcher | org.springframework.web.servlet.DispatcherServlet | `/` | Spring MVC, config: `dispatcher-servlet.xml`, async-supported |
| pluginDispatcher | com.virtual.plat.server.plugin.spring.PluginDispatcherServlet | `/plugin/*` | Plugin system, config: `plugin-servlet.xml`, async-supported |
| entry | com.virtual.plat.server.servlet.CheckEntryServlet | `/checkEntryServlet` | Browser check → forwards to index.jsp |

### Listeners
- org.springframework.web.context.ContextLoaderListener
- com.virtual.plat.server.rs.ext.event.ClientReceiveListener

### Welcome Files: entry.jsp, index.html
### Error Pages: /404.jsp (404), /401.jsp (401)
### Context Config: `classpath:/com/virtual/plat/config/beans-*.xml`

### JSP Files (8 total)
| JSP | Notes |
|---|---|
| `/entry.jsp` | Browser check page → submits to `/checkEntryServlet` |
| `/index.jsp` | Main AngularJS SPA (Angular 1.x + ui-router) |
| `/404.jsp` | Custom 404 |
| `/401.jsp` | Custom 401 |
| `/vnc/vnc.jsp` | VNC console |
| `/vnc_jnlp.jsp` | Java Web Start VNC |
| `/vnc_applet.jsp` | Java Applet VNC |
| `/rdp.jsp` | RDP console |

### Application Code JAR: `WEB-INF/lib/cic-1.0-SNAPSHOT.jar` (1398 classes)

#### Key Internal Servlets (in cic-1.0-SNAPSHOT.jar)
| Class | Purpose |
|---|---|
| CheckEntryServlet | Browser capability check, forwards to index.jsp |
| BaseServlet | Base class for all custom servlets (Gson + Spring context) |
| RpcServiceServlet | RPC endpoint for internal service communication |
| ValidateCodeServlet | CAPTCHA generation |
| TokenServlet | Token generation/management |
| NoVNCServlet | noVNC HTML5 console |
| HighChartsServlet | Chart rendering (HighCharts) |
| DashboardServlet | Dashboard data |
| HomePageServlet | Home page data |
| IODetailsShowServlet | IO performance details |
| NetIODetailsShowServlet | Network IO details |
| UtilizationDetailsShowServlet | Utilization details |
| WorkflowServlet | Workflow operations |
| DownLoadServlet | File download handler |
| FileUploadServlet | File upload handler |
| LicenseInfoDownloadServlet | License file download |
| LicenseInfoUploadServlet | License file upload |
| LogFileDownloadServlet | Log file download |
| VmTemplateDownloadServlet | VM template download |
| DomainScreenServlet | Domain/screen operations |
| CheckVmHealthServlet | VM health check |

#### Key Internal Filters (cic-1.0-SNAPSHOT.jar)
| Class | Purpose |
|---|---|
| LoginFilter | Authentication check filter |
| CasUsernamePasswordAuthenticationFilter | CAS authentication |
| CasLogoutFilter | CAS logout handling |
| DigestAuthenticationFilterExt | Digest auth for REST |
| PasswordProtectDigestAuthenticationFilter | Password-protected digest auth |

#### Key Internal Listeners (cic-1.0-SNAPSHOT.jar)
| Class | Purpose |
|---|---|
| ClientReceiveListener | Client message receiver |
| DomainListener | Domain event listener |
| LogoutListener | Session logout cleanup |
| SetLogLevelListener | Dynamic log level changes |
| SpringSupportListener | Spring/EventBus bridge |

#### Spring MVC Controllers (~30+ REST controllers)
| Controller | Path Hint |
|---|---|
| AccessStrategyController | `/casrs/accessStrategy` |
| AclController | `/casrs/acl` |
| AlarmController | `/casrs/alarm` |
| AntivirusController | `/casrs/antivirus` |
| AntivirusFileUploadController | `/casrs/antivirus/upload` |
| CICBackupController | `/casrs/cicbackup` |
| CloudBackupHistoryController | `/casrs/backuphistory` |
| CloudBackupStrategyController | `/casrs/backupstrategy` |
| CloudController | `/casrs/cloud` |
| CloudDiskController | `/casrs/clouddisk` |
| CloudHostController | `/casrs/cloudhost` |
| CloudMessageController | `/casrs/cloudmessage` |
| CloudMonitorController | `/casrs/cloudmonitor` |
| CloudOSController | `/casrs/cloudos` |
| CloudWorkOrderController | `/casrs/cloudworkorder` |
| DashboardController | `/casrs/dashboard` |
| DcController | `/casrs/dc` |
| DesktopController | `/casrs/desktop` |
| DomainController | `/casrs/domain` |
| DomainResource | `/casrs/domain` |
| DomainVNCResource | `/casrs/domain/vnc` |
| FirewallManageResource | `/casrs/firewall` |
| MsgResource | `/casrs/message` |
| OperatorGroupResource | `/casrs/operatorGroup` |
| OperatorLogResource | `/casrs/operlog` |
| OperatorResource | `/casrs/operator` |
| ParameterResource | `/casrs/parameter` |
| RsOrganizeResource | `/casrs/organize` |
| UserGroupResource | `/casrs/userGroup` |
| UserResource | `/casrs/user` |
| VmWorkflowResource | `/casrs/vmworkflow` |
| WarnManageResource | `/casrs/warn` |
| WorkflowResource | `/casrs/workflow` |
| BackupHistoryResource | `/casrs/backuphistory` |
| CloudBackupStrategyResource | `/casrs/cloudbackupstrategy` |
| CloudMessageResource | `/casrs/cloudmessage` |
| DiskWorkflowResource | `/casrs/diskworkflow` |

#### Key Manager/Service Classes (cic-1.0-SNAPSHOT.jar)
- DomainMgr/DomainHandler — VM lifecycle management
- StorageHandler — Storage operations
- ClusterMgr/ClusterHandler — Cluster management
- HostMgr — Physical host management
- VMwareHandler — VMware vCenter integration
- WorkflowMgr/WorkflowHandler — Approval workflows
- AlarmConfigMgr — Alarm configuration
- BackupStrategyHandler — Backup strategy
- FirewallMgr — VM firewall
- AclMgr — ACL management
- UserMgr/UserHandler — User management
- OperatorMgr — Operator/role management
- UIItemMgr — UI customization
- VirtualDesktopPoolMgr — Desktop pool (VDI)
- CloudOSHandler — OpenStack/CloudOS integration
- CloudMonitorHandler — Cloud monitoring
- TemplateHandler — VM template management
- SnapStrategyHandler — Snapshot strategy
- SwitchDomainStrategyHandler — HA/switch domain
- WarnManageHandler — Warning/event management
- AntivirusHandler — Anti-virus integration
- Certificate management (CerMgr, CasX509Certificate)
- SysParameters — System parameter configuration
- SecurityModePasswordStrategy — Password policy

### configs: beans-*.xml, dispatcher-servlet.xml, plugin-servlet.xml (in JAR classpath)
### Properties: `js/topo/i18n/strings.properties`, `strings_zh*.properties`

---

## 2. cas.war — CAS Authentication Engine (165 MB, 395 files)

### web.xml: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/cas/WEB-INF/web.xml`

### Filters (in web.xml order)
| Filter Name | Class | URL Pattern | Notes |
|---|---|---|---|
| CAS Single Sign Out Filter | org.jasig.cas.client.session.SingleSignOutFilter | `/*` | SSO single logout |
| CASFilter | com.virtual.plat.security.CasAuthenticationFilter | `/entry.jsp` | Custom CAS auth, serverName: http://localhost |
| CAS Validation Filter | com.virtual.plat.security.filter.Cas20ProxyReceivingTicketValidationFilter | `/*` | CAS ticket validation |
| CAS HttpServletRequest Wrapper Filter | org.jasig.cas.client.util.HttpServletRequestWrapperFilter | `/*` | Request wrapping |
| CAS Assertion Thread Local Filter | org.jasig.cas.client.util.AssertionThreadLocalFilter | `/*` | Thread-local assertion |
| springSecurityFilterChain | org.springframework.web.filter.DelegatingFilterProxy | `/*` | Spring Security |
| CharacterEncodingFilter | org.springframework.web.filter.CharacterEncodingFilter (utf-8) | `/*` | Encoding |
| CasFilter | com.virtual.plat.security.casFilter | `/*` | Custom CAS filter |

### Servlets
| Servlet Name | Class | URL Pattern | Notes |
|---|---|---|---|
| Jersey Spring Web Application | com.sun.jersey.spi.spring.container.servlet.SpringServlet | `/casrs/*` | REST API (same as cic) |
| dispatcher | org.springframework.web.servlet.DispatcherServlet | `/` | Spring MVC, dispatchOptionsRequest: true |
| entry | com.virtual.plat.server.servlet.CheckEntryServlet | `/checkEntryServlet` | Entry check |

### Listeners
- org.jasig.cas.client.session.SingleSignOutHttpSessionListener
- org.springframework.web.context.ContextLoaderListener
- org.springframework.web.context.request.RequestContextListener
- com.virtual.plat.server.WarInitializationFailureListener

### Welcome Files: entry.jsp, index.html
### Error Pages: /404.jsp (404), /401.jsp (401)
### Context Config: `classpath*:/com/virtual/plat/config/beans-*.xml`

### JSP Files (8 total)
| JSP | Notes |
|---|---|
| `/entry.jsp` | Entry point (same as cic) |
| `/vnc/vnc.jsp` | VNC console |
| `/vnc_jnlp.jsp` | JNLP VNC |
| `/vnc_applet.jsp` | Applet VNC |
| `/rdp.jsp` | RDP |
| `/websocket_cic.jsp` | WebSocket connector |
| `/vminfo_cic.jsp` | VM info display |
| `/404.jsp`, `/401.jsp` | Error pages |

### Key Application JARs
- **cas-common-v-cas-e0785.jar**: com.h3c.h3cloud.common.* (H3C cloud common classes)
- **vmc.jar**: com.virtual.* classes (VM management)
- **seamoon-1.0.0.jar**: Internal library
- **casclient-1.0.jar**: Custom CAS client
- **cas-client-core-3.4.1.jar**: Jasig CAS client
- **EIESmProxyApi-4.0.0.jar**: EIE SMS proxy
- **feign-core-10.12.jar + feign-jackson + feign-okhttp**: REST clients
- **vijava-5.1.jar**: VMware vSphere Java API
- **libvirt-1.0.jar**: Libvirt bindings
- **snmp4j-2.2.3.jar**: SNMP
- **redisson-3.17.6.jar**: Redis client
- **jedis-2.9.0.jar**: Redis client
- **alibaba-dingtalk-service-sdk-2.0.0.jar**: DingTalk integration
- **quartz-2.3.2.jar**: Job scheduling
- **protostuff-*1.7.4.jar**: Protobuf serialization

### Config Files Found
- `/cas/WEB-INF/tld/taglib.tld` — Custom tag library descriptor
- `/cas/fonts/glyphicons/selection.json` — Icon selection

---

## 3. ssv.war — Self-Service Virtualization Portal (64 MB, 807 files)

### web.xml: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/ssv/WEB-INF/web.xml`
### Servlet API: 2.5

### Filters
| Filter Name | Class | URL Pattern | Notes |
|---|---|---|---|
| sessionFilter | com.virtual.ssv.server.SessionFilter | `/servlet/*` | Session auth check |

### Servlets
| Servlet Name | Class | URL Pattern | Notes |
|---|---|---|---|
| vmList | com.virtual.ssv.server.virtualhost.VmListServlet | `/servlet/vmList` | List virtual machines |
| firewallServlet | com.virtual.ssv.server.firewall.FirewallServlet | `/servlet/firewallServlet` | Firewall rules |
| loginServlet | com.virtual.ssv.server.user.LoginServlet | `/login` | User login |
| homeServlet | com.virtual.ssv.server.home.HomeServlet | `/homeServlet` | Home page / welcome file |
| workFlowServlet | com.virtual.ssv.server.vmworkflow.VmWorkFlowServlet | `/servlet/workFlowServlet` | VM workflow/approval |
| workflow | com.virtual.ssv.server.workflow.WorkflowServlet | `/servlet/workflow` | Workflow management |
| FileUploadServlet | com.virtual.ssv.server.upload.FileUploadServlet | `/servlet/uploadServlet` | File upload |
| BackupServlet | com.virtual.ssv.server.backup.BackupServlet | `/servlet/backupServlet` | Backup management |
| applyDiskServlet | com.virtual.ssv.server.applydisk.ApplyDiskServlet | `/servlet/applyDiskServlet` | Disk application |
| cloudMessageServlet | com.virtual.ssv.server.cloudmessage.CloudMessageServlet | `/servlet/cloudMessageServlet` | Cloud messages |
| workOrderServlet | com.virtual.ssv.server.workorder.WorkOrderServlet | `/servlet/workOrderServlet` | Work orders |
| AlarmServlet | com.virtual.ssv.server.alarm.AlarmServlet | `/servlet/alarm` | Alarm configuration |

### Listeners
- org.springframework.web.context.ContextLoaderListener
- org.springframework.web.context.request.RequestContextListener
- com.virtual.ssv.server.user.LogoutListener

### Welcome File: homeServlet
### Context Config: `classpath:/com/virtual/ssv/config/beans-*.xml`

### JSP Files (30 total)
| JSP | Location | Notes |
|---|---|---|
| `/register.jsp` | Root | User registration |
| `/person.jsp` | Root | Personal settings |
| `/message.jsp` | Root | Messages |
| `/systemConfig.jsp` | Root | System config |
| `/workOrder.jsp` | Root | Work orders |
| `/workflow.jsp` | Root | Workflows |
| `/workflowDetail.jsp` | Root | Workflow detail |
| `/ssh.jsp` | Root | SSH console |
| `/rdp.jsp` | Root | RDP console |
| `/report.jsp` | Root | Reports |
| `/vnc/vnc.jsp` | VNC | VNC console |
| `/page/widget/applyVm.jsp` | Widget | VM application |
| `/page/widget/applyDisk.jsp` | Widget | Disk application |
| `/page/widget/applyWorkOrder.jsp` | Widget | Work order application |
| `/page/widget/applyFwStrategy.jsp` | Widget | Firewall strategy |
| `/page/widget/applyQoSRule.jsp` | Widget | QoS rules |
| `/page/widget/applyExpire.jsp` | Widget | Expiration application |
| `/page/widget/applyAlarmConfig.jsp` | Widget | Alarm config |
| `/page/widget/applyBackupStrategy.jsp` | Widget | Backup strategy |
| `/page/widget/selectCloudHost.jsp` | Widget | Cloud host selector |
| `/page/widget/selectIp.jsp` | Widget | IP selector |
| `/page/widget/queryDetailChart.jsp` | Widget | Chart detail |
| `/page/widget/snapshotTree.jsp` | Widget | Snapshot tree |
| `/page/widget/editWorkflow.jsp` | Widget | Edit workflow |
| `/page/widget/editFwStrategy.jsp` | Widget | Edit firewall |
| `/page/widget/editQoSRule.jsp` | Widget | Edit QoS |
| `/page/widget/editAclRule.jsp` | Widget | Edit ACL |
| `/page/widget/addSnapshot.jsp` | Widget | Add snapshot |
| `/page/widget/addFirewall.jsp` | Widget | Add firewall |
| `/page/widget/addFirewallRule.jsp` | Widget | Add rule |
| `/page/widget/addBackup.jsp` | Widget | Add backup |
| `/page/widget/workflowStepInfo.jsp` | Widget | Workflow step info |

### Application Code JAR: `WEB-INF/lib/ssv-1.0-SNAPSHOT.jar`
#### Key Classes
- BaseServlet — Base for all SSV servlets
- LoginServlet — Login/logout (181KB bytecode — large!)
- VmListServlet — VM listing (322KB bytecode — very large!)
- HomeServlet — Landing page
- SessionFilter — Session validation
- FirewallServlet — Firewall management (97KB)
- BackupServlet — Backup (115KB)
- WorkOrderServlet — Work orders
- WorkflowServlet — Workflows
- VmWorkFlowServlet — VM-specific workflow
- ApplyDiskServlet — Disk application
- FileUploadServlet — Uploads
- CloudMessageServlet — Messages
- AlarmServlet — Alarms

### Libraries: Spring 4.3.9, Commons FileUpload 1.5, Gson 2.2.2, Log4j 2.18.0

---

## 4. ischelp.war — CAS Help System (Chinese) (15 MB, 44 files)

### web.xml: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/ischelp/WEB-INF/web.xml`
### Servlet API: 2.2
### Framework: Eclipse Help System (Equinox OSGi + Servlet Bridge)

### Servlets
| Servlet Name | Class | URL Pattern | Notes |
|---|---|---|---|
| equinoxbridgeservlet | org.eclipse.equinox.servletbridge.BridgeServlet | `/*`, `*.jsp` | Delegates to OSGi |

### Architecture
- `WEB-INF/lib/org.eclipse.equinox.servletbridge*.jar` — Bridge servlet JAR
- `WEB-INF/plugins/*.jar` — OSGi plugins (32 plugins):
  - com.virtual.help_1.0.0.jar — Custom H3C help content
  - org.eclipse.help.* — Eclipse Help engine
  - org.eclipse.equinox.* — Equinox OSGi runtime
  - org.apache.lucene_1.9.1 — Search engine
  - org.apache.jasper_5.5.17 — JSP engine
  - com.jcraft.jsch_0.1.41 — SSH (for context-sensitive help?)
- `WEB-INF/content.jar` — Help content archive
- `WEB-INF/artifacts.jar` — Artifacts
- `WEB-INF/features/org.eclipse.help.infocenter_feature_1.0.0.jar`
- `WEB-INF/configuration/config.ini` — OSGi configuration
- `WEB-INF/launch.ini` — Launch parameters

---

## 5. cicenhelp.war — CAS Help System (English) (13 MB, 46 files)

### Identical structure to ischelp.war (same Equinox Help System)
### web.xml: Same BridgeServlet mapping
### All same plugins + com.virtual.help_1.0.0.jar
### Difference: English help content in content.jar

| Servlet Name | Class | URL Pattern |
|---|---|---|
| equinoxbridgeservlet | org.eclipse.equinox.servletbridge.BridgeServlet | `/*`, `*.jsp` |

---

## 6. cichelp.war — CAS Help System (Chinese) (12 MB, 44 files)

### Identical structure to ischelp.war (same Equinox Help System)
### web.xml: Same BridgeServlet mapping

| Servlet Name | Class | URL Pattern |
|---|---|---|
| equinoxbridgeservlet | org.eclipse.equinox.servletbridge.BridgeServlet | `/*`, `*.jsp` |

---

## 7. Domain Server — domain-server.jar (94 MB, 1552 files, Spring Boot)

### Location: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/_service_jars/domain-server/`
### Type: Spring Boot fat JAR (BOOT-INF/ structure)
### Backend service for VM domain management
- libvirt-based VM operations
- libvirt-1.0.jar binding
- Database: Derby (derby-10.14.2.0.jar)
- Redis: jedis, redisson
- Message queue: amqp-client-5.14.3.jar (RabbitMQ)
- Spring Boot 2.7.16, Spring 5.3.29

---

## 8. Bare Metal Server — bare-metal-server.jar (46 MB, 370 files, Spring Boot)

### Location: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/_service_jars/bare-metal-server/`
### Type: Spring Boot fat JAR
### Bare metal provisioning/management

---

## 9. Performance Monitor Service — performance-monitor-service.jar (98 MB, 911 files, Spring Boot)

### Location: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/_service_jars/performance-monitor-service/`
### Type: Spring Boot fat JAR
### Performance data collection and monitoring

---

## 10. VMware API Server — vmware-api-server.jar (54 MB, 441 files, Spring Boot)

### Location: `/home/kali/Downloads/h3c/h3c-cas-clone/war_extracts/_service_jars/vmware-api-server/`
### Type: Spring Boot fat JAR
### VMware vCenter API proxy
- vijava-5.1.jar for vSphere SDK

---

## Hardcoded Credentials / Security Notes

### web.xml Resource References: None found in any web.xml
### No env-entry elements found
### Security observations:
- cas.war has `serverName: http://localhost` (CAS service configuration)
- cas.war has `casServerUrlPrefix: nosso` — disables SSO by default
- Spring Security filter chain on `/*` — all requests pass through auth
- `LoginFilter` and `CasUsernamePasswordAuthenticationFilter` handle authentication
- `DigestAuthenticationFilterExt` for REST API digest auth
- `PasswordProtectDigestAuthenticationFilter` for password-protected endpoints
- SSV `SessionFilter` only on `/servlet/*` paths
- cic/cas use Spring Security (`springSecurityFilterChain`)
- Help WARs have NO authentication (Eclipse Help is public)

---

## Attack Surface Summary

| WAR | Auth Required? | Endpoints |
|---|---|---|
| cic.war | Yes (Spring Security) | `/casrs/*` (REST), `/plugin/*`, `/checkEntryServlet`, JSPs |
| cas.war | Yes (CAS + Spring Security) | `/casrs/*` (REST), `/checkEntryServlet`, JSPs |
| ssv.war | Partial (SessionFilter on /servlet/*) | `/login` (unauthenticated!), `/servlet/*` (authenticated), `/homeServlet` (welcome) |
| ischelp.war | None | `/*` (Eclipse Help) |
| cicenhelp.war | None | `/*` (Eclipse Help) |
| cichelp.war | None | `/*` (Eclipse Help) |

### Key Attack Vectors:
1. **ssv.war `/login`** — No authentication filter; LoginServlet handles credentials
2. **cic.war `/casrs/*`** — REST API with digest authentication; check for auth bypass
3. **cas.war Jasper v5.5.17** — Eclipse help WARs run Jasper JSP engine; possible CVE
4. **org.apache.lucene_1.9.1** — Very old Lucene in help WARs
5. **jstl-1.2.jar** — Standard JSTL, check for EL injection
6. **jersey-core-1.6.jar** — Old Jersey version
7. **spring-web-4.3.9** in cic/ssv — Check Spring Framework CVEs
8. **snmp4j-2.2.3** — SNMP monitoring interface
9. **jna-3.0.9, libvirt-1.0** — Native library calls via JNA
10. **jsch-0.1.41** in help WARs — Old SSH library, potential issues
11. **log4j-core-2.18.0** — Check for Log4Shell variants
12. **jackson-databind-2.9.10** — Check for deserialization CVEs

---

## File Inventory

| Directory | Contents | Size |
|---|---|---|
| `cic/` | cic.war extracted | 4668 files, ~111 MB |
| `cas/` | cas.war extracted | 395 files, ~165 MB |
| `ssv/` | ssv.war extracted | 807 files, ~64 MB |
| `ischelp/` | ischelp.war extracted | 44 files, ~15 MB |
| `cicenhelp/` | cicenhelp.war extracted | 46 files, ~13 MB |
| `cichelp/` | cichelp.war extracted | 44 files, ~12 MB |
| `_service_jars/domain-server/` | domain-server.jar | 1552 files, ~94 MB |
| `_service_jars/bare-metal-server/` | bare-metal-server.jar | 370 files, ~46 MB |
| `_service_jars/performance-monitor-service/` | performance-monitor-service.jar | 911 files, ~98 MB |
| `_service_jars/vmware-api-server/` | vmware-api-server.jar | 441 files, ~54 MB |
| `cic/_javap/` | 11 servlet/filter bytecode dissassemblies | |
| `ssv/_javap/` | 13 servlet bytecode dissassemblies | |
