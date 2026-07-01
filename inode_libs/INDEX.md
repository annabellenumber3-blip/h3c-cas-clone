# iNode Client Library Index — Complete Protocol Implementation Map

> **Extracted from:** H3C iNode Linux Client v7.3 (Build B05D151)
> **Libraries path:** `re/linux/client_tgz/iNodeClient/libs/`
> **Total .so files:** 40+ (including symlinks)
> **iNode-specific libs with full DWARF debug info:** 14
> **Third-party libs with debug info:** 6
> **Stripped/minimal libs:** 20+

---

## ⚡ Quick Reference — Protocol Engine Libraries

| Library | Purpose | Protocol | Analysis |
|---------|---------|----------|----------|
| `libiNodeSslvpnPt.so` | **SSL VPN Auth Engine** | HTTPS/TLS | [analysis/libiNodeSslvpnPt.md](analysis/libiNodeSslvpnPt.md) |
| `libInodeSecurityAuth.so` | **EAD Security Posture** | EAD/DIF/UDP | [analysis/libInodeSecurityAuth.md](analysis/libInodeSecurityAuth.md) |
| `libiNodeL2tpIPSecvpn.so` | **L2TP/IPsec VPN** | IKEv1/ESP/L2TP | [analysis/libiNodeL2tpIPSecvpn.md](analysis/libiNodeL2tpIPSecvpn.md) |
| `libInodePortalPt.so` | **Portal Authentication** | HTTP/Portal | [analysis/libInodePortalPt.md](analysis/libInodePortalPt.md) |
| `libInodeX1Pt.so` | **802.1X EAP-TLS (X1)** | 802.1X/EAP-TLS | [analysis/libInodeX1Pt.md](analysis/libInodeX1Pt.md) |
| `libZeroTrust.so` | **SPA/SDP Zero Trust** | UDP SPA | [analysis/libZeroTrust.md](analysis/libZeroTrust.md) |
| `libvnic.so` | **Virtual NIC Manager** | TUN/Routing/DNS | [analysis/libvnic.md](analysis/libvnic.md) |
| `libInodeUtility.so` | **Core Utility & Crypto** | TLV/BPF/AES/DES | [analysis/libInodeUtility.md](analysis/libInodeUtility.md) |
| `libutility.so` | **Security Key API** | SKF/Crypto | [analysis/libutility.md](analysis/libutility.md) |
| `libskf_wrapper.so` | **ASN.1 DER Codec** | ASN.1 | [analysis/libskf_wrapper.md](analysis/libskf_wrapper.md) |

---

## 📋 Complete Library Catalog

### Tier 1: Protocol Engines (iNode-Specific, Full DWARF)
These are the core protocol implementations with complete debug information enabling full reverse engineering.

| # | Library | Size | Symbols | DWARF Lines | Purpose |
|---|---------|------|---------|-------------|---------|
| 1 | `libInodeSecurityAuth.so` | 9.3 MB | 1,268 T | 1,380,882 | EAD posture check, DIF, 802.1X, OPSWAT V4, TEA crypto |
| 2 | `libInodeUtility.so` | 5.3 MB | 6,762 T | 747,475 | TLV codec, AES/DES/3DES, BPF, zlib, config, license |
| 3 | `libiNodeL2tpIPSecvpn.so` | 2.3 MB | 2,235 T | 350,956 | IKEv1, IPsec ESP/AH, L2TP, embedded AES/DES/DH |
| 4 | `libiNodeSslvpnPt.so` | 2.1 MB | 2,354 T | 297,544 | HTTPS auth (V3/V7), GM crypto, SPA, session mgmt |
| 5 | `libInodePortalPt.so` | 1.8 MB | 442 T | 246,469 | Portal protocol, HTTP redirect, heartbeat |
| 6 | `libUsbDevice.so` | 1.3 MB | 535 T | 279,789 | USB device detection (libusb wrapper) |
| 7 | `libInodeX1Pt.so` | 1.3 MB | 833 T | 217,247 | 802.1X/EAP-TLS, BPF filter, bigint |
| 8 | `libutility.so` | 1.2 MB | 1,733 T | 172,320 | SKF API, DES/3DES/AES wrappers, license verify |
| 9 | `libvnic.so` | 781 KB | 945 T | 91,763 | TUN device, IPv4/IPv6 routing, DNS |
| 10 | `libnm_wrapper.so` | 723 KB | 856 T | 51,850 | NetworkManager D-Bus wrapper |
| 11 | `libZeroTrust.so` | 471 KB | 920 T | — (no DWARF) | SPA knock, SDP, OTP, device ID |
| 12 | `libwaresource.so` | 339 KB | — (stripped) | — | Hardware resource detection |
| 13 | `libThreadpoolNotify.so` | 306 KB | 157 T | 60,827 | Thread pool + event dispatch |
| 14 | `libpipc.so` | 303 KB | 385 T | 48,305 | Named pipe IPC |
| 15 | `libskf_wrapper.so` | 230 KB | 558 T | 5,450 | ASN.1 DER codec for SKF |
| 16 | `libskf_engine.so` | 35 KB | 120 T | 2,088 | GM crypto engine driver |

### Tier 2: Third-Party Libraries (with Debug Info)

| # | Library | Size | Symbols | Purpose |
|---|---------|------|---------|---------|
| 17 | `libACE.so.7.1.1` | 16.9 MB | 6,614 | ACE framework (reactor, threads, sockets) |
| 18 | `libACEXML.so.7.1.1` | 1.7 MB | 868 | ACE XML parser |
| 19 | `libACE_SSL.so.7.1.1` | 807 KB | 506 | ACE SSL wrapper |
| 20 | `libACEXML_Parser.so.7.1.1` | 482 KB | 222 | ACE XML parser engine |
| 21 | `libcrypto.so.1.1` | 3.5 MB | 7,705 | OpenSSL 1.1.x crypto |
| 22 | `libdnet.so.0.0.0` | 149 KB | 170 | libdnet network utilities |

### Tier 3: Third-Party Libraries (No DWARF, Symbols Only)

| # | Library | Size | Symbols | Purpose |
|---|---------|------|---------|---------|
| 23 | `libssl.so.1.1` | 721 KB | 1,811 | OpenSSL TLS |
| 24 | `libcurl.so.4.7.0` | 617 KB | 1,399 | libcurl HTTP |
| 25 | `libgmp.so.10` | 537 KB | 815 | GNU MP bignum |

### Tier 4: Bundled Dependencies (Stripped)

| Library | Purpose |
|---------|---------|
| `libQt5Core.so.5`, `libQt5Gui.so.5`, `libQt5Widgets.so.5`, `libQt5Network.so.5`, `libQt5DBus.so.5`, `libQt5Svg.so.5`, `libQt5Xml.so.5`, `libQt5XcbQpa.so.5`, `libQt5EglDeviceIntegration.so.5` | Qt5 GUI framework |
| `libicudata.so.55`, `libicui18n.so.55`, `libicuuc.so.55` | ICU Unicode |
| `libjpeg.so.8`, `libpng12.so.0`, `libtiff.so.3` | Image codecs |
| `libdbusmenu-qt5.so.2`, `libFcitxQt5DBusAddons.so.1` | Desktop integration |
| `libpcre16.so.3` | Regex |
| `libudev.so.1.6.*` | Device management |
| `libusb-1.0.so.0` | USB library |
| `libwaapi.so.4.3.3240.0`, `libwacollector.so.4.3.3240.0`, `libwadeviceinfo.so.4.3.3240.0`, `libwaheap.so.4`, `libwalocal.so.4.3.3240.0`, `libwautils.so.4.3.3240.0` | WA (Windows Agent) framework |

---

## 🔑 Key Protocol APIs by Category

### SSL VPN Protocol (libiNodeSslvpnPt.so)
```
CHttpsAuth::init() → buildSslCtx() → doAuth() → getDomainParams() → getAuthParams()
→ buildSslAuthPacketV3/V7() → sendAndRecvHttp() → parseAuthRespMsgV3/V7()
→ setACLtoSrv() → doLogout()
CSslClient::conn2Remote() → handle_input() → send2Remote() → closeSocket()
```

### EAD Security Posture (libInodeSecurityAuth.so)
```
InitSecAuth() → StartSecAuth() → SecDataProcess() → ON_CheckList()
→ secAVOpswatV4/FWOpswatV4/HDOpswatV4/APOpswatV4/ASOpswatV4()
→ SecSetISOAcl() → SendSecOffline()
DIF: InitDIFAuth() → ProcDIFPktData() → EncryPktTea()/DecryPktTea()
```

### L2TP/IPsec VPN (libiNodeL2tpIPSecvpn.so)
```
app_init() → dh_create_exchange() → cookie_gen() → crypto_init()
→ AES/DES_set_encrypt_key() → crypto_encrypt()/crypto_decrypt()
→ CreateTDB() → app_handler()
```

### Portal Authentication (libInodePortalPt.so)
```
Portal_Init() → GenHttpReqPkt() → SendAndRecvPkt() → ParseHttpRespPkt()
→ RcvHartbeatThrdEntry() → try2PasvOffline() → Portal_Free()
```

### 802.1X / X1 Protocol (libInodeX1Pt.so)
```
EAP-TLS: dot1x supplicant → TLS handshake → SKF cert auth
BPF: bpf_filter() for EAPOL frame capture
```

### Zero Trust / SDP (libZeroTrust.so)
```
onKnockUDPMsg() → AssemblePwdAuthReq() → ParsePwdAuthResp()
→ AssembleSmsAuthReq() → ParseSmsAuthResp() → Get_HOTP_Code()
```

### Virtual NIC (libvnic.so)
```
CVirNIC::Init() → StartVirNIC() → configVirtNetwork()
→ Data_Input() → StopVirNIC() → clearVirtNetwork()
tunif::ifConfigIpv6addr() → ifAddIpv6Route()
dnserver::add()/del()
```

### Crypto & Codec (libInodeUtility.so, libutility.so)
```
TLV: utl_AESCBC_Encryption() → utl_AESCBC_Decryption()
      utl_3des_encrpt() → utl_3des_decrpt()
Base64: base64_encode() → base64_decode()
BPF: bpf_filter() → bpf_validate() → bpf_optimize()
SKF: API_SecKeyInitial() → API_SecKeyCreateConnect() → API_SecKeyAuthPIN()
```

---

## 🗂️ Extracted Data Files

### symbols/ — Demangled C++ symbols + dynamic symbols
```
libiNodeSslvpnPt_demangled.txt        (2,354 symbols, 376 KB)
libInodeSecurityAuth_demangled.txt    (1,268 symbols, 134 KB)
libiNodeL2tpIPSecvpn_demangled.txt   (2,235 symbols, 244 KB)
libInodeUtility_demangled.txt         (6,762 symbols, 929 KB)
libInodePortalPt_demangled.txt        (442 symbols, 56 KB)
libInodeX1Pt_demangled.txt            (833 symbols, 106 KB)
libvnic_demangled.txt                 (945 symbols, 129 KB)
libutility_demangled.txt              (1,733 symbols, 232 KB)
libZeroTrust_demangled.txt            (920 symbols, 118 KB)
libnm_wrapper_demangled.txt           (856 symbols, 140 KB)
libpipc_demangled.txt                 (385 symbols, 57 KB)
libskf_wrapper_demangled.txt          (558 symbols, 86 KB)
libskf_engine_demangled.txt           (120 symbols, 1 KB)
libThreadpoolNotify_demangled.txt     (157 symbols, 14 KB)
libUsbDevice_demangled.txt            (535 symbols, 90 KB)
+ dynamic symbol exports for all above
+ demangled symbols for: ACE, ACE_SSL, ACEXML, ACEXML_Parser, crypto, curl, dnet, gmp, ssl
```

### dwarf/ — DWARF debug information
```
libInodeSecurityAuth_dwarf_info.txt   (1,380,882 lines, 191 MB)
libInodeUtility_dwarf_info.txt        (747,475 lines, 103 MB)
libiNodeL2tpIPSecvpn_dwarf_info.txt  (350,956 lines, 48 MB)
libiNodeSslvpnPt_dwarf_info.txt      (297,544 lines, 42 MB)
libUsbDevice_dwarf_info.txt           (279,789 lines, 38 MB)
libInodePortalPt_dwarf_info.txt       (246,469 lines, 34 MB)
libInodeX1Pt_dwarf_info.txt           (217,247 lines, 31 MB)
libutility_dwarf_info.txt             (172,320 lines, 24 MB)
libvnic_dwarf_info.txt                (91,763 lines, 13 MB)
libThreadpoolNotify_dwarf_info.txt    (60,827 lines, 8 MB)
libnm_wrapper_dwarf_info.txt          (51,850 lines, 7 MB)
libpipc_dwarf_info.txt                (48,305 lines, 7 MB)
libskf_wrapper_dwarf_info.txt         (5,450 lines, 1 MB)
libskf_engine_dwarf_info.txt          (2,088 lines, 0.3 MB)
+ corresponding dwarf_line.txt for source:line mappings
```

### strings/ — Embedded strings (min 8 chars)
```
libInodeUtility_strings.txt           (30,229 lines)
libInodeSecurityAuth_strings.txt      (21,554 lines)
libiNodeL2tpIPSecvpn_strings.txt     (15,146 lines)
libiNodeSslvpnPt_strings.txt         (14,803 lines)
libutility_strings.txt                (7,668 lines)
libInodePortalPt_strings.txt          (7,024 lines)
libInodeX1Pt_strings.txt              (6,564 lines)
libnm_wrapper_strings.txt             (5,716 lines)
libvnic_strings.txt                   (5,383 lines)
libUsbDevice_strings.txt              (4,970 lines)
libpipc_strings.txt                   (2,559 lines)
libZeroTrust_strings.txt              (2,469 lines)
libThreadpoolNotify_strings.txt       (2,146 lines)
libskf_wrapper_strings.txt            (1,689 lines)
libskf_engine_strings.txt             (375 lines)
libwaresource_strings.txt             (199 lines)
+ strings for all third-party libs
```

### disasm/ — Key function disassembly
```
libiNodeSslvpnPt_CHttpsAuth_init.txt          (84 lines)
libInodeSecurityAuth_InitDIFAuth.txt           (106 lines)
libInodePortalPt_Portal_Init.txt               (91 lines)
libvnic_StartVirNIC.txt                        (75 lines)
```

### analysis/ — Comprehensive per-library analysis
```
libiNodeSslvpnPt.md — SSL VPN protocol engine analysis
libInodeSecurityAuth.md — EAD security posture analysis
libiNodeL2tpIPSecvpn.md — L2TP/IPsec VPN analysis
libInodePortalPt.md — Portal authentication analysis
libInodeX1Pt.md — 802.1X EAP-TLS analysis
libZeroTrust.md — SPA/SDP Zero Trust analysis
libvnic.md — Virtual NIC analysis
libInodeUtility.md — Core utility & crypto analysis
libutility.md — Security key API analysis
libskf_wrapper.md — ASN.1 codec analysis
supporting_libs.md — Consolidated supporting library analysis
```

---

## 🔬 Protocol Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                     iNode Client Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│  GUI Layer (Qt5)                                                 │
│  ├── libQt5Widgets, libQt5Gui, libQt5Core                       │
│  └── DBus integration (libQt5DBus, libdbusmenu-qt5)             │
├─────────────────────────────────────────────────────────────────┤
│  IPC Layer                                                       │
│  ├── libpipc.so — Named pipe IPC (client ↔ daemon)              │
│  └── libThreadpoolNotify.so — Thread pool + event dispatch       │
├─────────────────────────────────────────────────────────────────┤
│  Protocol Engines (iNode-specific)                               │
│  ├── libiNodeSslvpnPt.so — SSL VPN (HTTPS/TLS auth)             │
│  ├── libiNodeL2tpIPSecvpn.so — L2TP/IPsec (IKEv1/ESP/L2TP)     │
│  ├── libInodeSecurityAuth.so — EAD posture check (UDP/TEA)      │
│  ├── libInodePortalPt.so — Portal auth (HTTP redirect)          │
│  ├── libInodeX1Pt.so — 802.1X EAP-TLS (EAPOL)                  │
│  └── libZeroTrust.so — SPA/SDP Zero Trust (UDP knock)           │
├─────────────────────────────────────────────────────────────────┤
│  Network Layer                                                   │
│  ├── libvnic.so — TUN device, routing, DNS                      │
│  └── libnm_wrapper.so — NetworkManager integration              │
├─────────────────────────────────────────────────────────────────┤
│  Crypto / Codec Layer                                            │
│  ├── libInodeUtility.so — TLV codec, AES/DES/3DES, BPF, zlib   │
│  ├── libutility.so — SKF API, crypto wrappers                   │
│  ├── libskf_wrapper.so — ASN.1 DER for GM crypto                │
│  └── libskf_engine.so — GM SM2/SM3/SM4 engine                   │
├─────────────────────────────────────────────────────────────────┤
│  System / Hardware                                               │
│  ├── libUsbDevice.so — USB device detection                     │
│  └── libwaresource.so — Hardware resource detection             │
├─────────────────────────────────────────────────────────────────┤
│  Third-Party Libraries                                           │
│  ├── libACE.so — ACE reactor framework                          │
│  ├── libcrypto.so / libssl.so — OpenSSL 1.1.x                   │
│  ├── libcurl.so — HTTP client                                   │
│  ├── libgmp.so — GNU MP bignum                                  │
│  └── libdnet.so — Network utilities                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Cryptographic Findings

### Embedded Crypto Implementations (not using OpenSSL)
- **libiNodeL2tpIPSecvpn.so** contains its own AES, DES, 3DES, DH implementations
- **libInodeSecurityAuth.so** uses TEA (Tiny Encryption Algorithm) for EAD protocol packets
- **libInodeUtility.so** and **libutility.so** have TLV-layer crypto wrappers (AES-CBC, 3DES-CBC)

### GM National Crypto (SM2/SM3/SM4)
- **libskf_engine.so** + **libskf_wrapper.so** — SKF (Smart Key Framework) for USB crypto tokens
- **libiNodeSslvpnPt.so** — `loadGMFileCert()`, `loadGMSKFCert()` for SM2 certs
- **libInodeX1Pt.so** — SKF uKey integration for 802.1X

### Password/Derived Key Crypto
- **libiNodeL2tpIPSecvpn.so** — `des_ecb_encrypt_pwd()`, `DecryptPassword()`
- **libInodeSecurityAuth.so** — `EncryPktTea()` / `DecryPktTea()` (TEA cipher)
- **libZeroTrust.so** — `makePrivateContent()` (obfuscation)
- **libiNodeSslvpnPt.so** — `makePrivateContent()` (obfuscation)
- **libutility.so** — `EOR_WithMix()` (XOR obfuscation)

---

## 📊 Extraction Statistics

| Category | Count | Total Size |
|----------|-------|------------|
| iNode-specific libs with DWARF | 14 | ~28 MB |
| Third-party libs with DWARF | 6 | ~24 MB |
| Stripped/partial libs | 20+ | ~86 MB |
| **Total extracted data** | — | **~600 MB** |
| Demangled symbol files | 26 | ~3.5 MB |
| DWARF info dumps | 14 | ~560 MB |
| String dumps | 26 | ~14 MB |
| Disassembly files | 4 | ~28 KB |
| Analysis documents | 11 | ~55 KB |
