# libInodePortalPt.so — Portal Authentication Protocol Engine

- **File:** `libInodePortalPt.so` (1.8 MB, x86-64 ELF)
- **BuildID:** `93dc03da05b01c5eff4f63d83e963946a60d3897`
- **Debug Info:** YES (DWARF: 246,469 lines of type info, 20,786 lines of source mapping)
- **Language:** C++

## Purpose
Implements **H3C Portal authentication protocol** — handles captive portal detection, HTTP redirect interception, fake-auth packet generation, portal heartbeat, passive offline detection, and domain-based authentication. Used for web-based network access control (Wi-Fi hotspots, wired 802.1X fallback).

## Architecture

```
Portal Protocol Stack
├── Portal Core — protConObj.cpp
│   ├── Portal_Init() — Initialize portal session
│   ├── Portal_Free() — Clean up portal session
│   └── Portal_CoTimer() — Portal connection timer
├── Packet Builder — protPktBuilder.cpp
│   ├── GenHttpReqPkt() — Generate HTTP request packet
│   ├── MakeFakeAuthPkt() — Create fake authentication packet
│   ├── SendFakeAuthPkt() — Send fake auth packet
│   ├── MakeDomainReqPkt() — Build domain request packet
│   └── GenTextVrfHttpReqPkt() — Text verification request
├── Packet Analyzer — protPktAnalyse.cpp
│   ├── ParseHttpRespPkt() — Parse HTTP response
│   ├── ParseTextVrfHttpRespPkt() — Parse text verification response
│   └── ProcessDomainRspPkg() — Process domain response
├── Network I/O
│   ├── SendAndRecvPkt() — Send and receive portal packet
│   ├── GetAddrBySendCmn() — Address resolution via common channel
│   └── GetWebPageByUrl() — HTTP GET webpage
├── Offline Detection
│   ├── try2PasvOffline() — Try passive offline detection
│   ├── PasvOfflineThrd() — Passive offline thread
│   └── RcvHartbeatThrdEntry() — Heartbeat receive thread
└── Connection Object — protConObj.cpp
    └── CPortalConnectObj — Portal connection state machine
```

## Key Exported APIs

### Portal Session Management
| Function | Signature | Description |
|----------|-----------|-------------|
| `Portal_Init()` | `void Portal_Init(_PTL_CFG_S*)` | Initialize portal session |
| `Portal_Free()` | `void Portal_Free(_PTL_CFG_S*)` | Free portal resources |
| `Portal_SetCallBack()` | `void Portal_SetCallBack(void*)` | Set callback function |
| `Portal_CoTimer()` | `void Portal_CoTimer(_PTL_CFG_S*)` | Connection timer tick |

### Authentication Packets
| Function | Description |
|----------|-------------|
| `GenHttpReqPkt()` | Generate HTTP authentication request |
| `MakeFakeAuthPkt()` | Create fake auth packet for interception |
| `SendFakeAuthPkt()` | Send fake auth to trigger portal |
| `WriteReqPktAttr()` | Write request packet attribute |
| `WriteRspPktAttr()` | Write response packet attribute |

### HTTP/Portal Protocol
| Function | Description |
|----------|-------------|
| `SendAndRecvPkt()` | Send and receive portal protocol packet |
| `GetWebPageByUrl()` | HTTP GET webpage |
| `GetServiceType()` | Determine portal service type |
| `GetTransferAddr()` | Get transfer/redirect address |
| `GetAddrBySendCmn()` | Get address via common channel |
| `GetAddrBySendCmnImpl()` | Address resolution implementation |
| `GetNicIPAddrType()` | Get NIC IP address type |
| `GetRandURL()` | Generate random URL for portal |
| `GetDomainNameByUrl()` | Extract domain from URL |
| `RefreshDomainInfo()` | Refresh domain information |

### Response Parsing
| Function | Description |
|----------|-------------|
| `ParseHttpRespPkt()` | Parse HTTP response packet |
| `ParseTextVrfHttpRespPkt()` | Parse text verification response |
| `ProcessDomainRspPkg()` | Process domain response |
| `GenTextVrfHttpReqPkt()` | Generate text verification request |
| `ReqTextVrfByHttp()` | Request text verification via HTTP |

### Offline & Heartbeat
| Function | Description |
|----------|-------------|
| `try2PasvOffline()` | Try passive offline detection |
| `PasvOfflineThrd()` | Passive offline detection thread |
| `RcvHartbeatThrdEntry()` | Heartbeat receive thread entry |
| `getPortalNetWorkStatus()` | Get portal network status |
| `sendNotifyLogoff()` | Send notification logoff |
| `ClosePortalSocket()` | Close portal socket |

### Utilities
- `cal_chksum()` — Calculate IP checksum
- `parseHash_5()` — Parse MD5 hash
- `prot_InitCrit()` / `prot_EnterCrit()` / `prot_LeaveCrit()` / `prot_DestroyCrit()` — Critical section
- `ExtractInfoEx()` — Extract system information

## Source Files (from DWARF)
- `protConObj.cpp` / `protConObj.h` — Portal connection object
- `protPktBuilder.cpp` / `protPktBuilder.h` — Packet building
- `protPktAnalyse.cpp` / `protPktAnalyse.h` — Packet analysis
- `ProtUtilCmn.cpp` — Common portal utilities
- `HttpsMgr.cpp` — HTTPS manager
- `include/packet.h` / `include/dbusInfo.h` — Shared headers
- `utility/json/json.h` — JSON parsing
- `utility/../include/aclCommon.h` — ACL common definitions

## Protocol Details

### Portal Authentication Flow
1. Client connects to network, gets IP via DHCP
2. HTTP request intercepted → redirected to portal server
3. Portal_Init() configures session
4. GenHttpReqPkt() builds authentication request
5. SendAndRecvPkt() sends to portal server
6. ParseHttpRespPkt() processes response
7. Periodic heartbeat via RcvHartbeatThrdEntry()
8. Passive offline detection via try2PasvOffline()

### Fake Auth Packet
- Used to trigger portal detection on networks with transparent proxies
- Sends crafted HTTP request to force redirect
- `MakeFakeAuthPkt()` builds the fake auth

### Domain-Based Auth
- `MakeDomainReqPkt()` — DNS-based portal discovery
- `RefreshDomainInfo()` — Periodic domain refresh
- `ProcessDomainRspPkg()` — Domain response processing

### Text Verification
- CAPTCHA-style text verification
- `GenTextVrfHttpReqPkt()` / `ParseTextVrfHttpRespPkt()`

### Packet Format
- Custom binary protocol over HTTP
- Attribute-value pair encoding: `WriteReqPktAttr()` / `WriteRspPktAttr()`
- IP checksum validation: `cal_chksum()`

## Key Data Structures
- `_PTL_CFG_S` — Portal configuration (server, port, URL, etc.)
- `_IP_ADDR_INFO` — IP address information
- `CPortalConnectObj` — Active connection state
- `CPtlPacketBuilder` — Packet builder context
- `PortalPktAnalyse` — Packet analysis context

## Data Files
- `symbols/libInodePortalPt_demangled.txt` — 442 symbols
- `symbols/libInodePortalPt_dynamic.txt` — 400 dynamic symbols
- `dwarf/libInodePortalPt_dwarf_info.txt` — 246,469 lines DWARF
- `dwarf/libInodePortalPt_dwarf_line.txt` — 20,786 lines source mappings
- `strings/libInodePortalPt_strings.txt` — 7,024 strings
- `disasm/libInodePortalPt_Portal_Init.txt` — Disassembly
