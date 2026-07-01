# iNode Client — DWARF Debug Information Index

## Overview

Complete DWARF debug information extracted from **8 unstripped x86-64 ELF binaries** of the H3C iNode Intelligent Management Center client suite (v7.3, Linux). All binaries contain full debug info (`with debug_info, not stripped`), 6–7 `.debug_*` sections each.

### Global Extraction Summary

| Binary | Size | DWARF Info (lines) | DWARF Line (lines) | Symbols | Strings | Source Files | User Classes |
|---|---|---|---|---|---|---|---|
| **iNodeClient** | 68 MB | 25,683,980 | 532,074 | 24,643 | 116,074 | 261 | ~291 |
| **AuthenMngService** | 1.0 MB | 87,224 | 20,229 | 1,280 | 9,037 | 3 | ~35 |
| **DamAgent** | 13 MB | 2,060,024 | 147,246 | 1,685 | 24,491 | 34 | ~94 |
| **DLPService** | 3.8 MB | 621,566 | 53,598 | 1,077 | 11,182 | 9 | ~40 |
| **iNodeMon** | 1.4 MB | 205,717 | 15,865 | 526 | 5,264 | 9 | ~11 |
| **iNodeTRM** | 9.1 MB | 1,907,870 | 229,536 | 15,354 | 36,539 | 72 | ~277 |
| **TrmClient** | 6.5 MB | 2,311,462 | 53,733 | 5,888 | 22,307 | 37 | ~77 |
| **tickle** | 164 KB | 18,895 | 1,110 | 196 | 1,630 | 2 | ~2 |

### Files Per Binary

Each binary directory contains:
- `dwarf_info.txt` — Full DWARF DIEs (type names, function prototypes, struct/class layouts)
- `dwarf_line.txt` — Source file:line address mappings
- `demangled_symbols.txt` — Full C++ symbol table (nm -C)
- `strings.txt` — All strings ≥ 8 chars (error messages, config keys, log patterns)
- `source_files.txt` — Application-level .cpp/.c source file listing
- `objdump_*.txt` — Disassembly of key functions (AuthenMngService only)

---

## 1. AuthenMngService — Orchestration Daemon (1.0 MB)

**Role:** Central authentication management daemon. Orchestrates all connection types (802.1X, Portal, SSL VPN, IPsec VPN, SPA VPN, EAD). IPC via named pipes (NPIPE_MSG) and D-Bus. ACE framework-based.

### Key Source Files
```
linux1xCenter.cpp       — Main entry point, daemon initialization
ReadInstruction.cpp     — Configuration/instruction parsing
iNodeDetectorMessage.cpp — Detector protocol messages
```

### Protocol & IPC Architecture

**Message Processing Functions (core IPC dispatch):**
```
processMain(void*)           — Main processing thread
loadMsgProc(...)             — Message load/routing dispatcher
dot1xProcMsg(...)            — 802.1X protocol handler
portalProcMsg(...)           — Portal authentication handler
iNodeProcMsg(...)            — iNode proprietary protocol handler
spaVpnMsgProc(...)           — SPA VPN message handler
SslvpnMsgProc(...)           — SSL VPN message handler
eadProcMsg(...)              — EAD (Endpoint Admission) handler
```

**Authentication Protocol Handlers:**
```
procX1AuthReq(CPacketItem&)        — 802.1X authentication request
procPtlAuthReq(CPacketItem&)       — Portal authentication request
procDIFAuthReq(CPacketItem&)       — DIF authentication request
procEadAuthReq(CPacketItem&)       — EAD authentication request
procSslVpnAuthReq(CPacketItem&)    — SSL VPN authentication request
procX1LogOff(CPacketItem&)         — 802.1X logoff
procPtlLogOff(CPacketItem&)        — Portal logoff
procIpsecVpnLogOff(CPacketItem&)   — IPsec VPN logoff
procSslVpnLogOff(CPacketItem&)     — SSL VPN logoff
procX1SmsReq(CPacketItem&)         — SMS verification request
procPtlSMSReq(CPacketItem&)        — Portal SMS request
```

**IPC Transport (NPIPE_MSG namespace):**
```
msgProcessor<NPIPE_MSG::msgSender, NPIPE_MSG::msgSendRecver>
CMsgCmd::send(int) / recv(char*, int, int)
CMsgCmd::sendNotifyInfo(const char*, int, int, int)
CMsgCmd::echo(int) / kill(int)
```

**D-Bus Integration (LibDBus):**
```
procSysWakeUp(DBusConnection*)      — System wake-up handler
LibDBus::dbus_connection_send_with_reply_and_block(...)
```

**Connection Lifecycle:**
```
CreateConn(const char*)           — Create connection
CreateX1Conn(const char*)         — Create 802.1X connection
CreateSslConn(const char*)        — Create SSL connection
LoadPortalRun(...)                — Load/run portal connection
LoadSslVpnRun(...)                — Load/run SSL VPN
LoadSpaVpnRun(...)                — Load/run SPA VPN
LoadX1AutoRun()                   — Auto-run 802.1X
LoadEadAutoRun()                  — Auto-run EAD
LogoffAllConn()                   — Disconnect all
OutputConsInfo(ENUM_LOAD_LINK_ACTION) — Connection state output
```

### Key Classes / Structs

| Class/Struct | Role |
|---|---|
| `CPacketItem` | Core IPC message container (get/set attributes) |
| `CMsgCmd` | Named pipe message command (send/recv/kill/echo) |
| `LoginSessionHandler` | Session management (extract session IDs) |
| `SessionInfo` | Per-session state |
| `SUserInfo` | User authentication data |
| `SStateInfo` | Connection state tracking |
| `SOnlineConnInfo` | Online connection information |
| `CCfgFileMgr` | Configuration file management |
| `CPortalConnectObj` | Portal connection object |
| `MsgAuthReqInfo` / `MsgAuthRespInfo` | Text-verification auth request/response |
| `MsgAuthServerInfo` | Auth server configuration |
| `SRenewIpInfo` | IP renewal information |
| `SQRCodeResp` | QR code response data |
| `SCertInfo` | Certificate information |
| `SUniIp` | Unified IP address structure |
| `LibDBus` | D-Bus library wrapper (static function pointers) |
| `EADOptionsInfo` | EAD configuration options |
| `SSLVPNOptionsInfo` / `SSLVPNRemoteInfo` | SSL VPN settings |
| `iNodeDtctrMessage` | Detector protocol message (GetPacketCode, GetPacketLength, GetAuthenticator) |
| `AclRule` / `RuleBase` | ACL (Access Control List) rules |
| `PTL_SYS_INFO` | Portal system information |

### State Machine & Thread Management
```
createThread()        — Thread creation
processSig(void*)      — Signal handler thread
processDetector(void*) — Detector monitoring thread
ProcessAclMonitor(void*) — ACL monitoring thread
startAutoLogin()       — Automatic login initiation
daemonInit()           — Daemon initialization
InitInstance()         — Instance initialization
ExitInstance()         — Instance cleanup
```

---

## 2. iNodeClient — Qt5 GUI Application (68 MB)

**Role:** Main Qt5-based graphical user interface. Manages all connection wizards, settings dialogs, tray icon, DAMA (Desktop Asset Management) UI, EAD UI, and VPN configuration.

### Architecture
- **Framework:** Qt5 (QWidget, QDialog, QWizard, QSystemTrayIcon)
- **UI Pattern:** MVC-like with separate widgets for each connection type
- **Signal/Slot:** MOC-generated files for every widget class
- **Subsystems:** 802.1X, Portal, IPsec VPN, SSL VPN, SDP, WiFi/WLAN, EAD, DAMA

### Key Source File Categories

**Core Application:**
```
main.cpp, inodeapp.cpp, inodedata.cpp, inodetray.cpp
iNodeUiCmn.cpp, msgDeal.cpp, cserver.cpp
```

**Connection Wizards (one per auth type):**
```
x1createwizard.cpp, x1connectionitem.cpp, x1widget.cpp           — 802.1X
portalcreatewizard.cpp, portalconnectionitem.cpp, portalwidget.cpp — Portal
ipsecvpncreatewizard.cpp, ipsecvpnconnectionitem.cpp, ipsecvpnwidget.cpp — IPsec VPN
sslvpncreatewizard.cpp, sslvpnconnectionitem.cpp, vpnwidget.cpp  — SSL VPN
sdpcreatewizard.cpp, sdpconnectionitem.cpp, sdpwidget.cpp        — SDP
wlancreatewizard.cpp, wlanconnectionitem.cpp, wifiwidget.cpp     — WiFi/WLAN
eadcreatewizard.cpp, eadconnectionitem.cpp, eadwidget.cpp        — EAD
```

**Settings/Properties:**
```
conn1xproptcfg.cpp, connptalproptcfg.cpp, connipsecvpnproptcfg.cpp
connsslvpnproptcfg.cpp, connsdpproptcfg.cpp, ipsecbasesetting.cpp
ipseccertcfg.cpp, certconfig.cpp, VPNCustomCfg.cpp
```

**DAMA (Desktop Asset Management) UI:**
```
dammaindlg.cpp, daminputinfo.cpp, damaconfirminfo.cpp
DamAgentCommon.cpp, DamaUiCmn.cpp, DamInputAssetNoDlg.cpp
DamSoftDlvr.cpp, DamSoftwareTaskItem*.cpp
```

**Utilities:**
```
cmessagebox.cpp, framelessdialog.cpp, framelesswidget.cpp
customshadoweffect.cpp, messagewidget.cpp, pushingwidget.cpp
clickwidget.cpp, basewidget.cpp, baseminiwidget.cpp
titlewidget.cpp, contentwidget.cpp, settingswidget.cpp
```

**Network:**
```
DnsManager.cpp, NetworkInfo.cpp, networkDetect.cpp
getnetworkadapter.cpp, gatewaycombobox.cpp
```

### Key UI Classes (non-Qt)
| Class | Role |
|---|---|
| `CServer` | Backend service communication |
| `CConnMgr` | Connection manager |
| `CDifMsgMgr` | Message dispatch/management |
| `CLocsMgr` | Location/network context manager |
| `CDnsManager` | DNS configuration manager |
| `CNetworkInfo` | Network adapter information |
| `AboutWidget` | About dialog |
| `AppItemWidget` | Application list item widget |
| `AuThTypeWidget` | Authentication type selector |
| `BaseMiniWidget` / `BaseWidget` | Base widget classes |
| `ClickWidget` | Clickable widget base |
| `ContentWidget` | Content area widget |
| `CustomShadowEffect` | Custom drop shadow effect |
| `FramelessDialog` / `FramelessWidget` | Frameless window base |
| `FullScreenWidget` | Full screen overlay |
| `IPAddrDlg` | IP address dialog |
| `LogManageDlg` / `LogMessageDlg` | Log management UI |
| `WlanSsidList` / `CusSsidList` | SSID list management |

---

## 3. iNodeTRM — Terminal Remote Management (9.1 MB)

**Role:** TRM (Terminal Remote Management) server/daemon. Provides full-disk encryption, USB device management, remote operations. Based on TrueCrypt-derived crypto stack.

### Cryptographic Subsystem (Full Disk Encryption)

**Ciphers Implemented:**
```
AES, Blowfish, Serpent, Twofish, Cast5, TripleDES
Combined modes: AES-Blowfish, AES-Twofish, AES-Blowfish-Serpent, AES-Twofish-Serpent
```

**Encryption Modes:**
```
CBC (EncryptionModeCBC), LRW (EncryptionModeLRW), XTS (EncryptionModeXTS)
PKCS#5 KDF (derive_key_sha1, derive_key_sha256, derive_key_sha512, derive_key_ripemd160, derive_key_whirlpool)
```

**Crypto Classes:**
```
Cipher, CipherAES, CipherBlowfish, CipherCast5, CipherSerpent, CipherTripleDES, CipherTwofish
EncryptionAlgorithm, EncryptionMode, EncryptionModeCBC, EncryptionModeLRW, EncryptionModeXTS
EncryptionThreadPool, EncryptionTest
Pkcs5Kdf, Hash, Crc32, RandomNumberGenerator
```

**Volume Management (TrueCrypt-like):**
```
Volume, VolumeCreator, VolumeHeader, VolumeInfo
VolumeLayout, VolumePassword, VolumeException
MountOptions, MountPoints, Keyfile, SecurityToken
FuseService (FUSE filesystem integration)
Aes.h, Blowfish.h, Des.h — Header-only crypto primitives
```

### TRM-Specific Source Files
```
TrmBaseServer.cpp      — TRM base server
TrmSdkClient.cpp       — TRM SDK client
TrmSdkClientCaller.cpp — TRM SDK client caller (RPC proxy)
TrmCommon.cpp          — TRM common utilities
TrmPktCipher.cpp       — TRM packet encryption
TrmShareMem.cpp        — Shared memory communication
DealShareMem.cpp       — Shared memory handling
PackageDeal.cpp        — Package/command processing
RemoteOpera.cpp        — Remote operations handler
PktPeriodJob.cpp       — Periodic packet job
```

### USB Device Management
```
UsbID.cpp, UDevManager.cpp, HostDevice.cpp, HostDeviceManager.cpp
Device.cpp, DeviceEvent.h
```

### System Integration
```
SystemInfo.cpp, SystemLog.cpp, SystemException.cpp
CoreBase.cpp, CoreLinux.cpp, CoreUnix.cpp
Process.cpp, Pipe.cpp, SocketHandle.cpp
Event.cpp, SyncEvent.cpp, Mutex.cpp, Thread.cpp
Poller.cpp, Memory.cpp, MemoryStream.cpp
File.cpp, FileCommon.cpp, FileRec.cpp, FileMon.cpp
Directory.cpp, FilesystemPath.cpp, FatFormatter.cpp
```

### Key Classes
| Class | Role |
|---|---|
| `CTrmClient` | TRM client core |
| `CTrmSdkClient` | TRM SDK client implementation |
| `CTrmSdkClientCaller` | TRM RPC proxy/caller |
| `CPacketItem` | IPC packet (same type as AuthenMngService) |
| `CPackageDeal` | Command package processor |
| `CPartitonMan` | Partition manager |
| `CDiskInfo` / `CDiskInfoGather` | Disk information gathering |
| `CDiskPartitionInfo` / `CDiskPartitionInfoGater` | Partition info |
| `CLogicalDiskInfo` / `CLogicalDiskInfoGather` | Logical disk info |
| `CMountPoints` | Mount point management |
| `CUsbID` / `CUsbIDMan` | USB device identification |
| `ConfigFile` | Configuration file parser |
| `CBasedTXmlParser` / `CTXmlParser` / `CSdkXmlParser` | XML parsers |
| `CSocketHandle` | Socket handle wrapper |
| `CoreBase` / `CoreLinux` / `CoreUnix` | Platform abstraction layer |

---

## 4. TrmClient — Terminal Client Qt5 GUI (6.5 MB)

**Role:** TRM client-side Qt5 GUI. User interface for disk encryption management, password changes, remote operation confirmation.

### Source Files
```
main.cpp, maintray.cpp                — Entry point + system tray
RegisterLoginDlg.cpp                  — Registration/login dialog
RemoteOperaDlg.cpp                    — Remote operations dialog
ChgRegPwdDlg.cpp                      — Change password dialog
chguserpin.cpp                        — Change user PIN
TrmChkPinTrusted.cpp                  — PIN trust verification
TrmcCfg.cpp                           — TRM client configuration
TrmAbout.cpp                          — About dialog
TrmApp.cpp                            — Main TRM application
TrmCommon.cpp, TrmUICmn.cpp           — Utilities
confirmtag.cpp, selecttag.cpp         — Tag selection dialogs
framelessdialog.cpp, framelesswidget.cpp — Custom window chrome
cmessagebox.cpp                       — Custom message box
ReadShareMem.cpp, TrmShareMem.cpp     — Shared memory IPC
diskInfo.cpp, UsbID.cpp               — Disk/USB info (shared with iNodeTRM)
SdkXmlParser.cpp                      — SDK XML parser
libudevDynamicLoader.cpp              — udev dynamic loader
```

### Key Classes
| Class | Role |
|---|---|
| `RegisterLogin` | Registration/login dialog |
| `RemoteOprea` | Remote operations dialog |
| `ChgRegPwdDlg` | Password change dialog |
| `ChgUserPin` | PIN change dialog |
| `ChkPinTrusted` | PIN trust verification |
| `CTrmcCfg` | TRM client configuration |
| `CMainTray` | System tray |
| `CConfirmTag` | Tag confirmation dialog |
| `CSelectTag` | Tag selection dialog |
| `CMessageBox` | Custom message box |
| `FramelessDialog` / `FramelessWidget` | Window chrome |
| `SRemoteDevMap` | Remote device mapping |
| `SRemoteShareInfo` | Remote share information |
| `SPolicy` | Security policy |
| `SAssetTag` | Asset tag |
| `SSearchTag` | Search tag |

### IPC Functions
```
DealCallRtn(unsigned long, SCallReturnInfo*)  — Handle RPC return values
DealAddVolume(STrmNormalDrivers*)             — Add encrypted volume
WriteCfgInfo(STrmCfg const*)                  — Write configuration
GetProxyInfo()                                — Get proxy settings
ClearShareMems()                              — Cleanup shared memory
```

---

## 5. DamAgent — Desktop Asset Management Agent (13 MB)

**Role:** DAMA (Desktop Asset Management) agent daemon. Hardware/software inventory, asset reporting, software compliance.

### Hardware Inventory Gathering
```
asset.cpp/AssetInfoMng.cpp        — Asset manager + gatherer
BIOSInfo.cpp                      — BIOS information
CPUInfo.cpp                       — CPU information
CDROMInfo.cpp                     — CD-ROM drive info
mainboardInfo.cpp                 — Motherboard info
memoryInfo.cpp                    — Memory/RAM info
monitorInfo.cpp                   — Monitor/display info
NICInfo.cpp                       — Network interface info
diskInfo.cpp                      — Disk information
processInfo.cpp                   — Running process info
serviceInfo.cpp                   — System service info
routeInfo.cpp                     — Network routing info
netUsageInfo.cpp                  — Network usage stats
internetAddressInfo.cpp           — IP address info
softwareInfo.cpp                  — Installed software
systemMiscInfo.cpp                — Miscellaneous system info
```

### Asset Communication
```
AssetPktMng.cpp                   — Asset packet management
assetXML.cpp                      — Asset XML serialization
DamPktCommon.cpp/DamPktCipher.cpp — Packet protocol + encryption
DamAgentCommon.cpp                — Shared agent utilities
DamAgent.cpp/DamAgentUtil.cpp     — Agent core
DamaSharedMemMng.cpp              — Shared memory management
DamGlobalData.cpp                 — Global agent state
SoftDlvrMng.cpp/SoftDownload.cpp  — Software delivery
SoftHelper.cpp                    — Software helper utilities
PktProcess.cpp                    — Packet processing
PeriodJob.cpp                     — Periodic reporting job
DevManager.cpp                    — Device manager
XMLParse.cpp                      — XML parser
```

**Package Manager Parsers:**
```
CDpkgQuerySwInfoParser / CDpkgQueryTool   — Debian/Ubuntu dpkg
CRpmSwInfoParser / CRpmTool              — RedHat/Fedora RPM
CFedoraScreenSaverInfoParser             — Fedora screensaver info
CKylinScreenSaverInfoParser              — Kylin screensaver info
CKylinSessionInfoParser                  — Kylin session info
CGsettingsTool / CGsettingsToolRunAs     — GNOME gsettings
```

### Key Classes
| Class | Role |
|---|---|
| `CDamAgent` | Agent main class |
| `CAssetInfo` / `CAssetInfoGather` | Asset info base |
| `CAssetManager` | Asset management |
| `CAssetXML` / `CAssetXMLParser` | XML asset serialization |
| `CDamGlobalData` | Global state |
| `CBIOSInfo` / `CBIOSInfoGather` | BIOS info gathering |
| `CCPUInfo` / `CCPUInfoGather` | CPU info gathering |
| `CCDROMInfo` / `CCDROMInfoGather` | CD-ROM info |
| `CMainboardInfoGather` / `CMemoryInfoGather` | Hardware info |
| `CMonitorInfo` / `CMonitorInfoGather` | Monitor info |
| `CNICInfo` / `CNICInfoGather` | Network interface info |
| `CDiskInfo` / `CDiskInfoGather` | Disk info |
| `CLogicalDiskInfo` / `CLogicalDiskInfoGather` | Logical disk |
| `CDiskPartitionInfo` / `CDiskPartitionInfoGater` | Partition info |
| `COSInfo` / `COSInfoGather` | OS information |
| `CProcessInfo` / `CProcessInfoGather` | Process info |
| `CServiceInfo` / `CServiceInfoGather` | Service info |
| `CRouteInfo` / `CRouteInfoGather` | Routing info |
| `CIPAddrInfo` / `CIPAddrInfoGather` | IPv4 address info |
| `CIPv6AddrInfo` / `CIPv6AddrInfoGather` | IPv6 address info |
| `CScreenSaverInfo` / `CScreenSaverInfoGather` | Screensaver status |
| `CNetUsgeInfoGather` | Network usage |
| `CMiscInfoGather` | Miscellaneous info |
| `CDevManager` | Device manager |
| `CConnectInfo` | Connection info |
| `CCmdTool` | Command execution tool |
| `CPopenLauncher` | Process launcher via popen |
| `CProcessMethod` | Process management |

---

## 6. DLPService — Data Loss Prevention (3.8 MB)

**Role:** DLP (Data Loss Prevention) service agent. Monitors USB events, file uploads, and enforces data leak policies.

### Source Files
```
LvdunMain.cpp        — Main DLP service entry
LDAgent.cpp          — DLP agent core
LDAgentUtil.cpp      — DLP agent utilities
LvdunPkt.cpp         — DLP packet protocol
LvdunThread.cpp      — DLP threading
DlpCommon.cpp        — Shared DLP utilities
DlpCommonUtils.cpp   — DLP utility functions
CConveyor.cpp        — DLP conveyor/transport
jsoncpp.cpp          — JSON parsing (jsoncpp library)
```

### Key Functions
```
DlpServiceEntry(void*)                    — Main DLP service thread
InitConveyor()                            — Initialize transport conveyor
GetIConveyor(const char*, unsigned long)   — Get conveyor interface
AnalysePkt(LDTransmitData*, ConveyorSrvData&) — Analyze DLP packet
HandleUSBEvent(LDTransmitData*, ConveyorSrvData&) — USB event handler
HandleAlarmWarn(LDTransmitData*, ConveyorSrvData&) — Alarm/warning handler
PushRequest()                             — Push DLP policy request
sendAndRecive(...)                        — Send/receive to DLP server
FileUploadCheck()                         — File upload policy check
dealPkt2LDData(char*, unsigned short, LDTransmitData&) — Packet parsing
GetEbmServerIp()                          — Get EBM server IP
GetServiceState(const char*)              — Service state query
NetworkProbe(const char*)                 — Network connectivity check
ExecuteCommand(const char*)               — Command execution
TimerMngEntry(void*)                      — Timer management
listenQuit(void*)                         — Graceful shutdown
```

---

## 7. iNodeMon — Monitoring Daemon (1.4 MB)

**Role:** Log management and monitoring daemon. Handles log rotation, compression, cleanup, and log level configuration.

### Source Files
```
inodeMon.cpp             — Main daemon entry point
inodeMonConfig.cpp       — Configuration management
inodeMonLog.cpp          — Log file operations
inodeMonMsg.cpp          — IPC message handling
inodeMonTimerTask.cpp    — Timer-based periodic tasks
Singleton.cpp            — Singleton pattern base
Containers_T.cpp         — ACE container templates
Task_T.cpp               — ACE task templates
Unbounded_Queue.cpp      — ACE unbounded queue
```

### Key Functions
```
main()                         — Entry: daemonize, start log task
doCoreTask()                   — Core monitoring loop
startLogTask(const char*)      — Start log processing
startLogCleanTask()            — Start log cleanup
doUniLogClean(char const*, unsigned int) — Log cleanup
doUniLogZip(char const*, char const*, unsigned int) — Log compression
doUniLogZipClean(char const*, unsigned int) — Combined zip+clean
dealLogZipTask(const char*)    — Log zip task
dealLogCleanTask(int, char const*, char const*) — Log clean task
CTimerTask::eventThread / handleTimeout — Timer management
CCfgFileMgr::loadFromFile / write2File / getValue — Config
utl_CreateLog / utl_GetLogLevel / utl_SetLogLevel — Log utilities
logX(int, char const*, ...)    — Log writing
convertPath / getFileSize / fileExist / directoryExist — FS utils
```

---

## 8. tickle — Keepalive/Heartbeat Utility (164 KB)

**Role:** Lightweight keepalive/heartbeat utility. Tests network connectivity and host reachability.

### Source Files
```
tickle.cpp      — Main tickle implementation
UnitTest.cpp    — Unit tests
```

### Key Functions
```
main()                   — Entry: parse orders, execute
tickleUsage()            — Usage/help display
dealOrder(string&)       — Process command orders
matchPrefix(...)         — Match command prefix
matchPrefixEx(...)       — Extended prefix matching
showOrderList()          — Show available orders
showTime(string const&)  — Display timestamp
showIfHostEqualNet()     — Host-network equality check
getProgramPath(string&)  — Get program path
hexviewer(char const*)   — Hex dump viewer
```

---

## Cross-Binary Shared Types

### Common Protocol Types (shared across binaries)

| Type | Found In | Description |
|---|---|---|
| `CPacketItem` | AuthenMngService, iNodeTRM, iNodeClient | Core IPC message container (setAttrValue/getAttrValue) |
| `CAttrItem` | AuthenMngService, iNodeTRM, iNodeClient | Attribute item within packet |
| `CCfgFileMgr` | AuthenMngService, DamAgent, iNodeMon | Configuration file manager |
| `CDiskInfo` / `CDiskInfoGather` | DamAgent, iNodeTRM, TrmClient | Disk information gathering |
| `CDiskPartitionInfo` / `CDiskPartitionInfoGater` | DamAgent, iNodeTRM, TrmClient | Disk partition info |
| `CLogicalDiskInfo` / `CLogicalDiskInfoGather` | DamAgent, iNodeTRM, TrmClient | Logical disk info |
| `CMessageBox` | iNodeClient, TrmClient | Custom message box |
| `FramelessDialog` / `FramelessWidget` | iNodeClient, TrmClient | Frameless Qt windows |
| `CBasedTXmlParser` | TrmClient, iNodeTRM, DamAgent, iNodeClient | XML parser base class |
| `CSdkXmlParser` | TrmClient, iNodeTRM | SDK XML parser |
| `CUsbID` / `CUsbIDMan` | iNodeTRM, TrmClient, DamAgent | USB device ID |
| `ConfigFile` | iNodeTRM, TrmClient | Config file parser |
| `EADOptionsInfo` | AuthenMngService, iNodeClient | EAD options |

### IPC Protocol Summary

The iNode client suite uses a **layered IPC architecture**:

1. **Named Pipes (NPIPE_MSG)** — Primary IPC between iNodeClient GUI ↔ AuthenMngService
   - `CMsgCmd` class: send, recv, echo, kill, sendNotifyInfo
   - Template: `msgProcessor<NPIPE_MSG::msgSender, NPIPE_MSG::msgSendRecver>`
   - Message container: `CPacketItem` with key-value attributes

2. **D-Bus** — System bus communication (wake-up, network events)
   - `LibDBus` wrapper class with static function pointers
   - `procSysWakeUp(DBusConnection*)`

3. **Shared Memory** — TRM/iNodeTRM ↔ TrmClient communication
   - `TrmShareMem.cpp`, `ReadShareMem.cpp`
   - `DamaSharedMemMng.cpp` (DAMA agent)

4. **Unix Domain Sockets** — AuthenMngService ↔ subprocesses
   - `createSocket()`, `CSocketHandle`

### Authentication Flow State Machine

```
                    ┌──────────────────────────────────┐
                    │      iNodeClient (Qt5 GUI)        │
                    │   User selects connection type     │
                    └──────────┬───────────────────────┘
                               │ CPacketItem via named pipe
                               ▼
                    ┌──────────────────────────────────┐
                    │    AuthenMngService (Daemon)      │
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │   loadMsgProc()  dispatcher  │  │
                    │  └─────────────────────────────┘  │
                    │          │         │         │     │
                    │     ┌────┘    ┌────┘    ┌────┘    │
                    │     ▼         ▼         ▼         │
                    │  dot1x    portal    sslvpn    ... │
                    │  ProcMsg  ProcMsg   ProcMsg       │
                    │     │         │         │         │
                    │     └────┬────┴────┬────┘         │
                    │          ▼         ▼              │
                    │     procX1AuthReq  procPtlAuthReq │
                    │     sendAuthInfo   sendDevInfo    │
                    └──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────────────────┐
                    │     External Auth Server          │
                    │   (RADIUS / Portal / LDAP)        │
                    └──────────────────────────────────┘
```

---

## Extraction Methodology

### Tools Used Per Binary

| Tool | Purpose | Output File |
|---|---|---|
| `readelf --debug-dump=info` | DWARF DIEs: type names, function prototypes, struct/class layouts | `dwarf_info.txt` |
| `readelf --debug-dump=line` | Source file:line number address mappings | `dwarf_line.txt` |
| `nm -C` | Demangled C++ symbol table (global functions, class methods, static variables) | `demangled_symbols.txt` |
| `strings -n 8` | Meaningful strings ≥ 8 chars: error messages, log formats, config keys | `strings.txt` |
| `objdump -d` | Disassembly of critical functions (AuthenMngService only) | `objdump_*.txt` |

### Filtering Applied for Source File Lists

Source file lists exclude:
- C++ standard library headers (`algorithm`, `stl_*`, `type_traits`, etc.)
- System headers (`pthread.h`, `socket.h`, `signal.h`, etc.)
- ACE framework headers (`ace_*`, `Atomic_Op*`, `Guard_*`, etc.)
- OpenSSL headers
- Curl headers

---

## File Inventory

```
inode_dwarf/
├── DWARF_INDEX.md                          ← This file
├── iNodeClient/
│   ├── dwarf_info.txt          (25.68M lines, ~2.1 GB)
│   ├── dwarf_line.txt          (532K lines)
│   ├── demangled_symbols.txt   (24,643 lines)
│   ├── strings.txt             (116,074 lines)
│   └── source_files.txt        (261 .cpp/.c files)
├── AuthenMngService/
│   ├── dwarf_info.txt          (87K lines)
│   ├── dwarf_line.txt          (20K lines)
│   ├── demangled_symbols.txt   (1,280 lines)
│   ├── strings.txt             (9,037 lines)
│   ├── source_files.txt        (3 .cpp files)
│   ├── objdump_main.txt
│   ├── objdump_processMain.txt
│   ├── objdump_InitInstance.txt
│   ├── objdump_createThread.txt
│   └── objdump_procX1AuthReq.txt
├── DamAgent/
│   ├── dwarf_info.txt          (2.06M lines)
│   ├── dwarf_line.txt          (147K lines)
│   ├── demangled_symbols.txt   (1,685 lines)
│   ├── strings.txt             (24,491 lines)
│   └── source_files.txt        (34 .cpp files)
├── DLPService/
│   ├── dwarf_info.txt          (621K lines)
│   ├── dwarf_line.txt          (53K lines)
│   ├── demangled_symbols.txt   (1,077 lines)
│   ├── strings.txt             (11,182 lines)
│   └── source_files.txt        (9 .cpp files)
├── iNodeMon/
│   ├── dwarf_info.txt          (205K lines)
│   ├── dwarf_line.txt          (15K lines)
│   ├── demangled_symbols.txt   (526 lines)
│   ├── strings.txt             (5,264 lines)
│   └── source_files.txt        (9 .cpp files)
├── iNodeTRM/
│   ├── dwarf_info.txt          (1.91M lines)
│   ├── dwarf_line.txt          (229K lines)
│   ├── demangled_symbols.txt   (15,354 lines)
│   ├── strings.txt             (36,539 lines)
│   └── source_files.txt        (72 .cpp files)
├── TrmClient/
│   ├── dwarf_info.txt          (2.31M lines)
│   ├── dwarf_line.txt          (53K lines)
│   ├── demangled_symbols.txt   (5,888 lines)
│   ├── strings.txt             (22,307 lines)
│   └── source_files.txt        (37 .cpp files)
└── tickle/
    ├── dwarf_info.txt          (18K lines)
    ├── dwarf_line.txt          (1,110 lines)
    ├── demangled_symbols.txt   (196 lines)
    ├── strings.txt             (1,630 lines)
    └── source_files.txt        (2 .cpp files)
```
