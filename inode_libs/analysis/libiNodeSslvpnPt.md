# libiNodeSslvpnPt.so — SSL VPN Protocol Engine

- **File:** `libiNodeSslvpnPt.so` (2.1 MB, x86-64 ELF)
- **BuildID:** `beba9f2ad843c91887207614b1b3599961a7e79a`
- **Debug Info:** YES (DWARF: 297,544 lines of type info, 17,562 lines of source mapping)
- **Linkage:** Links OpenSSL (`libssl`, `libcrypto`), libACE, pthread, system libs
- **Language:** C++ (GCC, `std::__cxx11::basic_string` ABI)

## Purpose
The **primary SSL VPN protocol engine** — handles HTTPS-based authentication to H3C SSL VPN gateways (V3 and V7 protocol versions), TLS session management, GM national crypto (SM2/SM3/SM4 via SKF), realm/domain discovery, multi-factor auth flows (password, SMS, certificate, USB key), SPA (Single Packet Authorization) knock, minus-one packet keepalive, and VPN session lifecycle.

## Architecture
```
CHttpsAuth (singleton) — Main auth orchestrator
    ├── buildSslCtx() — TLS context setup (GM certs, USB key, file certs)
    ├── doAuth() — Full auth state machine
    │   ├── getDomainParams() — Realm/gateway discovery
    │   ├── getAuthParams() — Auth parameter negotiation  
    │   ├── sendAndRecvHttp() — HTTPS POST/GET to VPN gateway
    │   ├── buildSslAuthPacketV3() / V7() — Auth request XML/JSON
    │   ├── parseAuthRespMsgV3() / V7() — Parse auth response
    │   ├── buildVldImgReq() — CAPTCHA/verify image request
    │   ├── buildSsl2ndAuthPacketV7() — Second-factor auth
    │   └── buildSslChallengeAuthPacketV7() — Challenge auth
    ├── doLogout() — Logout request
    ├── setACLtoSrv() / clearACLtoSrv() — Access control rules
    └── kickOldLogin() — Force old session logout
CSslClient — TLS socket client (ACE reactor pattern)
    ├── conn2Remote() — Connect with SPA knock support
    ├── handle_input() / handle_close() — ACE event handlers
    ├── send2Remote() — Send encrypted data
    └── closeSocket() — Clean disconnect
SslvpnMgr — VPN session manager
    ├── SslvpnReconn() — Reconnection logic
    ├── SslvpnPollTimer() / SslvpnHeartBeatTimer() — Keepalive timers
    └── SendMinusOnePacketTimer() — Minus-one packet timer
CSSLVpnXmlParser — XML configuration parser
    └── GetLogInInfo() — Parse VPN login configuration
```

## Key Exported APIs

### CHttpsAuth (Main Auth Class)
| Function | Signature | Description |
|----------|-----------|-------------|
| `CHttpsAuth::instance()` | singleton accessor | Get global auth instance |
| `CHttpsAuth::init()` | `void init()` | Initialize TLS/SSL context |
| `CHttpsAuth::buildSslCtx()` | `void buildSslCtx(int, const char*, const char*, const char*, const char*, const char*)` | Build SSL_CTX with cert paths, TLS version |
| `CHttpsAuth::doAuth()` | `void doAuth(_SslvpnUser&, string&)` | Full auth flow |
| `CHttpsAuth::doLogout()` | `void doLogout(const _SslVpnCfg&, string&)` | Logout request |
| `CHttpsAuth::loadGMFileCert()` | `void loadGMFileCert(ssl_ctx_st*)` | Load GM national crypto cert from file |
| `CHttpsAuth::loadGMSKFCert()` | `void loadGMSKFCert(ssl_ctx_st*)` | Load GM cert from SKF USB key |
| `CHttpsAuth::setACLtoSrv()` | `void setACLtoSrv(const char*, int)` | Push ACL rules to server |
| `CHttpsAuth::sendAndRecvHttp()` | `void sendAndRecvHttp(const ACE_INET_Addr&, const string&, string&, int&, string&, int)` | HTTP request/response over TLS |
| `CHttpsAuth::getDomainParams()` | `void getDomainParams(int, const string&, ...)` | Discover VPN realms/domains |
| `CHttpsAuth::getAuthParams()` | `void getAuthParams(int, const string&, ...)` | Negotiate auth parameters |
| `CHttpsAuth::getVerifyPic()` | `void getVerifyPic(const string&, const string&, int, string&, string&, string&)` | Get CAPTCHA image |
| `CHttpsAuth::buildSslAuthPacketV3()` | protocol V3 auth XML | Build auth request for V3 gateways |
| `CHttpsAuth::buildSslAuthPacketV7()` | protocol V7 auth JSON | Build auth request for V7 gateways |
| `CHttpsAuth::parseAuthRespMsgV3()` / `V7()` | response parser | Parse auth response |
| `CHttpsAuth::parseHttpRespV3()` / `V7()` | response parser | Parse HTTP auth response |
| `CHttpsAuth::buildSsl2ndAuthPacketV7()` | 2FA request | Second-factor auth packet |
| `CHttpsAuth::buildSslChallengeAuthPacketV7()` | challenge auth | Challenge-response auth packet |
| `CHttpsAuth::makePrivateContent()` | obfuscation | Encrypt/obfuscate sensitive content |
| `CHttpsAuth::kickOldLogin()` | session mgmt | Force-kick previous session |
| `CHttpsAuth::hasErrorTitle()` | error parsing | Check for error in response |
| `CHttpsAuth::getOldLoginInfo()` | session mgmt | Query existing session info |
| `CHttpsAuth::ignoreDebugContent()` | debug filter | Strip debug from response |

### CSslClient (TLS Transport)
| Function | Description |
|----------|-------------|
| `CSslClient::conn2Remote()` | Connect to VPN gateway with SPA knock |
| `CSslClient::handle_input()` | ACE reactor input handler |
| `CSslClient::handle_close()` | ACE reactor close handler |
| `CSslClient::send2Remote()` | Send data over TLS |
| `CSslClient::closeSocket()` | Close TLS connection |
| `CSslClient::logSSLError()` | Log SSL errors |

### VPN Session Management
| Function | Description |
|----------|-------------|
| `SslvpnReconn()` | Reconnection thread |
| `SslvpnPollTimer()` | Poll timer for session status |
| `SslvpnHeartBeatTimer()` | Heartbeat keepalive |
| `SendMinusOnePacketTimer()` | Minus-one keepalive timer |
| `SendAuthMsg()` | Send auth message to UI |
| `SendNotify2UI()` | UI notification |
| `SendStatusMsg()` | Status message |
| `SendSpaLogout()` | SPA logout |
| `SendSslVpnginfoMsg()` | VPN gateway info message |
| `buildMinusOnePacket()` | Build minus-one keepalive |
| `sendMinusOnePacket()` | Send minus-one keepalive |
| `getProtoIDByConnID()` | Protocol ID lookup |

### Utility Functions
- `Hex2Int()` — Hex string to integer
- `RemoveInvalidChar()` — String sanitization
- `createDynamicMutex()` / `destoryDynamicMutex()` / `aquireOrReleaseDynamicMutex()` — OpenSSL thread safety callbacks

## Source Files (from DWARF)
- `HttpsAuth.cpp` / `HttpsAuth.h` — Main authentication logic
- `HttpsTool.cpp` / `HttpsTool.h` — HTTP utility functions
- `SslClient.cpp` — TLS client implementation
- `SslvpnMgr.cpp` — VPN session management
- `SslVpnXmlParser.cpp` — XML configuration parser
- `include/CustomBasic.h`, `include/dbusInfo.h` — Shared headers

## Protocol Details

### SSL VPN Protocol Versions
- **V3 Protocol:** XML-based request/response format
- **V7 Protocol:** JSON/delimited format with extended features (2FA, challenge auth)

### Auth Flow
1. `init()` — Initialize TLS context
2. `getDomainParams()` — Discover available VPN realms
3. `getAuthParams()` — Negotiate auth parameters (password, cert, SMS, etc.)
4. `buildSslAuthPacket()` — Build auth request
5. `sendAndRecvHttp()` — Send over HTTPS
6. `parseAuthRespMsg()` — Parse response
7. If 2FA required: `buildSsl2ndAuthPacketV7()`
8. If challenge: `buildSslChallengeAuthPacketV7()`
9. `setACLtoSrv()` — Push access control rules
10. `doLogout()` — Clean disconnect

### SPA (Single Packet Authorization)
- `buildMinusOnePacket()` — Build SPA knock packet
- `sendMinusOnePacket()` — Send UDP knock before TCP connect
- `SendSpaLogout()` — SPA-based logout

### GM National Crypto (SM2/SM3/SM4)
- `loadGMFileCert()` — Load SM2 cert from PEM/DER file
- `loadGMSKFCert()` — Load SM2 cert from SKF USB key
- `unloadGMSKFCert()` — Clean up SKF cert
- TLS context configured with GM cipher suites

## Third-Party Dependencies
- **OpenSSL 1.1.x** — `SSL_*`, `EVP_*`, `BIO_*`, `ERR_*` functions
- **ACE** — `ACE_INET_Addr`, reactor pattern for async I/O
- **pthread** — Threading
- **libcurl** — (via utility lib, not direct)

## Key Strings / Protocol Endpoints (from strings)
- TLS versions: `CNTLS_client_method`, `OPENSSL_init_ssl`
- GM crypto: `SM2`, `SM3`, `SM4`, `skf_`, `GMFileCert`, `GMSKFCert`
- USB key: `USBKEY`, `SetUSBkeyPINE`, `PIN`
- Auth tokens: `cams`, `svpn`, `login`, `logout`, `auth`, `verify`, `challenge`, `sms`
- HTTP: `POST`, `GET`, `Content-Type`, `Cookie`, `Set-Cookie`
- Data structures: `_SslvpnUser`, `_SslVpnCfg`, `_VPNAuthParams`, `_VPNAuthUrlV7`, `SpaRegisterParams`, `MinusOnePktData`
- Cipher: `AES`, `DES`, `3DES`, `RSA`, `SM2`, `SM4`

## Global Variables
- `g_bMinusOnePacketTimerOn` — Minus-one timer state
- `g_isEscape` — Escape flag
- `g_OnlineInfo` — Online status (external reference)

## Data Files
- `symbols/libiNodeSslvpnPt_demangled.txt` — 2,354 demangled symbols
- `symbols/libiNodeSslvpnPt_dynamic.txt` — 2,107 dynamic symbols
- `dwarf/libiNodeSslvpnPt_dwarf_info.txt` — 297,544 lines DWARF type info
- `dwarf/libiNodeSslvpnPt_dwarf_line.txt` — 17,562 lines source mappings
- `strings/libiNodeSslvpnPt_strings.txt` — 14,803 strings
- `disasm/libiNodeSslvpnPt_CHttpsAuth_init.txt` — Disassembly of init()
