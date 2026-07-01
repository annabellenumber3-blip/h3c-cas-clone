# libInodeSecurityAuth.so — EAD Security Posture & 802.1X Authentication

- **File:** `libInodeSecurityAuth.so` (9.3 MB, x86-64 ELF)
- **BuildID:** `b6d7e7c1238c0a2c2ec9e8863d4ad1a47ca27f76`
- **Debug Info:** YES (DWARF: 1,380,882 lines of type info, 104,266 lines of source mapping)
- **Linkage:** Links `libcurl`, `libssl`, `libcrypto`, ACE XML, pthread, ACE, system libs
- **Language:** C++

## Purpose
The **largest and most complex library** — implements H3C EAD (Endpoint Admission Domination) security posture assessment, DIF (Device Inspection Framework), 802.1X authentication, ACL enforcement, TEA encryption for protocol packets, and a wide range of endpoint security checks (antivirus, firewall, patch management, software inventory, password policy, disk encryption, BIOS, screen saver, file integrity, etc.).

## Architecture
```
EAD Security Layer
├── EadSecSessionImpl — Primary EAD session management
│   ├── InitSecAuth() — Initialize EAD security auth session
│   ├── StartSecAuth() — Start EAD authentication
│   ├── SecDataProcess() — Process incoming EAD data
│   ├── SecSetISOAcl() / SecSetSecAcl() — ACL enforcement
│   └── ON_CheckList() — Compliance check orchestration
├── DIF (Device Inspection Framework)
│   ├── InitDIFAuth() — Initialize DIF session
│   ├── StartDIFAuth() — Start DIF auth
│   ├── DIFDataProcess() — Process DIF data
│   ├── ProcDIFPktData() — DIF packet processing
│   ├── CreateDifPkt() — Build DIF packet
│   ├── VerifyDifPkt() — Verify DIF packet integrity
│   ├── EncryPktTea() / DecryPktTea() — TEA encryption
│   └── CalcDIfPktId() — Calculate DIF packet ID
└── OPSWAT Integration (V4)
    ├── secAVOpswatV4() — Antivirus check
    ├── secFWOpswatV4() — Firewall check
    ├── secHDOpswatV4() — Hard disk encryption check
    ├── secAPOpswatV4() — Application/patch check
    └── secASOpswatV4() — Anti-spyware check
```

## Key Exported APIs

### EAD Session Management
| Function | Signature | Description |
|----------|-----------|-------------|
| `InitSecAuth()` | `void InitSecAuth(_EadSecEntry*, _EadSessionEx*)` | Initialize EAD session |
| `StartSecAuth()` | `void StartSecAuth(_EadSecEntry*)` | Start EAD auth |
| `SecDataProcess()` | `void SecDataProcess(_EadSessionEx*, char*, unsigned int)` | Process EAD protocol data |
| `RcvPktThread()` | `void RcvPktThread(void*)` | Receive packet thread |
| `secSendResp()` | `void secSendResp(unsigned short, unsigned short, int, int, int)` | Send EAD response |
| `ConfigNicPara()` | `void ConfigNicPara(_EadSessionEx*, signed char&)` | Configure NIC for EAD |
| `IsNeedResetNic()` | `bool IsNeedResetNic(_EadSessionEx*)` | Check if NIC reset needed |
| `sec_QuitAuth()` | `void sec_QuitAuth(int, int)` | Quit auth session |
| `PacketMatching()` | `void PacketMatching(_EadSessionEx*, EnumSecState, unsigned short, EnumSecState&)` | Match incoming packets |
| `SendSecOffline()` | `void SendSecOffline(_EadSessionEx*)` | Send offline notification |
| `SendSecTrapPkt()` | `void SendSecTrapPkt(_EadSessionEx*)` | Send trap packet |

### DIF Protocol
| Function | Description |
|----------|-------------|
| `InitDIFAuth()` | Initialize DIF session |
| `StartDIFAuth()` | Start DIF |
| `DIFDataProcess()` | Process DIF data |
| `ProcDIFPktData()` | Process DIF packet data |
| `CreateDifPkt()` | Create DIF protocol packet |
| `VerifyDifPkt()` | Verify DIF packet integrity |
| `EncryPktTea()` | TEA encrypt packet |
| `DecryPktTea()` | TEA decrypt packet |
| `CalcDIfPktId()` | Calculate DIF packet ID |
| `PushDifPkt()` | Push DIF packet |
| `PushDifMsgPkt()` | Push DIF message packet |
| `PutPktDataItem()` | Add data item to packet |
| `SendDIFTrapPkt()` | Send DIF trap |
| `SndDIfUDPPkt()` | Send DIF UDP packet |

### Endpoint Security Checks (OPSWAT V4 framework)
| Function | Description |
|----------|-------------|
| `secAVOpswatV4()` | Antivirus check via OPSWAT V4 |
| `secFWOpswatV4()` | Firewall check |
| `secHDOpswatV4()` | Hard disk encryption check |
| `secAPOpswatV4()` | Application/patch check |
| `secASOpswatV4()` | Anti-spyware check |
| `secDamCheck()` | DAM (Database Activity Monitoring) check |
| `bCheckDevice()` | Device check |

### Antivirus Product Detection (individual checks)
| Function | Description |
|----------|-------------|
| `AV360Check()` | 360 Antivirus |
| `AVAISCheck()` | AIS Antivirus |
| `AVAISEngCheck()` | AIS English |
| `AVAntiyCheck()` | Antiy Antivirus |
| `AVEDRCheck()` | EDR check |
| `AVH3CCheck()` | H3C AV |
| `AVH3CEngCheck()` | H3C AV English |
| `AVNOD32Check()` | ESET NOD32 |
| `AVQAXCheck()` | QAX Antivirus |

### System/Posture Checks
| Function | Description |
|----------|-------------|
| `GetAssetNo()` | Get asset number |
| `GetClientId()` | Get client ID |
| `GetHardDiskId()` | Get hard disk serial |
| `GetAllUserName()` | Get all user accounts |
| `GetPwdFromDic()` | Password dictionary check |
| `secWeakPwdCheck()` | Weak password check |
| `secSoftCtrl()` | Software control |
| `SecBiosInfo()` | BIOS information |
| `SecDiskInfo()` | Disk information |
| `SecShareInfo()` | Share information |
| `SecScreensaverInfo()` | Screen saver check |
| `SecSimpleCheck()` | Simple compliance check |
| `SecFileCheck()` | File integrity check |
| `SecPMCheck()` | Patch management check |
| `SecPolicyKit()` | Policy kit |
| `SecAclProcess()` | ACL processing |
| `bSoftInstalled()` | Check if software installed |
| `testFileCheck()` | Test file check function |
| `check_env_type()` | Check environment type |
| `detectVirt()` | Detect virtualization |
| `detectMultiOS()` | Detect multi-OS |
| `detectWireless()` | Detect wireless |
| `RunTigerVNC()` | VNC remote desktop |
| `StartService()` / `StopServcie()` | Service management |
| `ExtractInfo()` / `ExtractInfoEx()` | Extract system info |
| `ExtractWInfo()` | Extract Windows info |
| `getVersion()` | Get version info |
| `getPMState()` | Get patch management state |
| `getAttrString()` | Get attribute string |

### Access Control
| Function | Description |
|----------|-------------|
| `GetNormalAcl()` | Get normal ACL rules |
| `GetPingAcl()` | Get ping ACL rules |
| `SecSetISOAcl()` | Set ISO ACL |
| `SecSetSecAcl()` | Set security ACL |
| `ON_ACLRespond()` | ACL response handler |
| `ON_CheckFail()` | Check failure handler |
| `ON_CheckSucess()` | Check success handler |
| `ON_CheckList()` | Check list orchestrator |

### 802.1X Integration
- `set1xAuthPara()` — Set 802.1X auth parameters
- `wlanNeedFunc()` — WLAN function check

### Password Management
- `StartSecChgPwd()` — Start secure password change
- `syncModifyPwd()` — Synchronize password modification
- `StartDownCount()` / `StartHeartbeat()` — Timer functions

## Source Files (from DWARF)
- `EadSecSessionImpl.cpp` — Main EAD session implementation
- `SecAuthOpswat.cpp` — OPSWAT integration
- `secOpswatV4.cpp` — OPSWAT V4 checks
- `secPktProcess.cpp` — Packet processing
- `SecPolicyKit.cpp` — Policy enforcement
- `SecAclProcess.cpp` — ACL processing
- `SecAssetInfo.cpp` / `SecBiosInfo.cpp` / `SecDiskInfo.cpp` — System info
- `SecFileCheck.cpp` / `SecPMCheck.cpp` / `SecShareInfo.cpp` / `SecScreensaverInfo.cpp`
- `SecSoftCtrl.cpp` / `secWeakPwdCheck.cpp` / `SecSimpleCheck.cpp`
- `libOpswatManager.cpp` — OPSWAT library management
- `libSecudevDynamicLoader.cpp` — Dynamic library loader
- `include/dbusInfo.h`, `include/CustomBasic.h` — Shared headers

## Protocol Details

### EAD Protocol (Endpoint Admission Domination)
- UDP-based protocol using TEA (Tiny Encryption Algorithm) for packet encryption
- State machine: `EnumSecState` tracks auth progress
- DIF sub-protocol for device fingerprinting
- ACL push model: server pushes ACL rules to client

### TEA Encryption
- `EncryPktTea()` — TEA encrypt (used for EAD packets)
- `DecryPktTea()` — TEA decrypt
- 128-bit key, 64-bit block cipher

### OPSWAT V4 Framework
- Standardized endpoint compliance checking API
- Categories: AV, FW, HD (disk encryption), AP (patches), AS (anti-spyware)
- Each check reports compliance status to server

## Global Variables (key state)
- `g_EadSessionEx` — Current EAD session
- `g_DifSessionEx` — Current DIF session
- `g_enumEADStatus` — EAD status enum
- `g_enumEADResult` — EAD auth result
- `g_bDIFExit` — DIF exit flag
- `g_bEADExit` — EAD exit flag
- `g_bAVOpswat` / `g_bOpswat` — OPSWAT flags
- `g_EadPMChk` — Patch management check state
- `g_hotspot_policy` — Hotspot policy flag
- `g_network_resume` — Network resume flag
- `g_MsgId` — Message ID counter
- `g_arruiKey` — Array of UI keys
- `g_bchgpwd` — Password change flag

## Third-Party Dependencies
- **libcurl** — HTTP for cloud check callbacks
- **libcrypto** — `crypt()`, `compress()`
- **ACE XML** — XML parsing
- **dlopen/dlsym** — Dynamic loading of OPSWAT/AV libs

## Data Files
- `symbols/libInodeSecurityAuth_demangled.txt` — 1,268 symbols
- `symbols/libInodeSecurityAuth_dynamic.txt` — 1,156 dynamic symbols
- `dwarf/libInodeSecurityAuth_dwarf_info.txt` — 1,380,882 lines DWARF
- `dwarf/libInodeSecurityAuth_dwarf_line.txt` — 104,266 lines source mappings
- `strings/libInodeSecurityAuth_strings.txt` — 21,554 strings
- `disasm/libInodeSecurityAuth_InitDIFAuth.txt` — Disassembly
