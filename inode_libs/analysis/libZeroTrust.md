# libZeroTrust.so — SPA / SDP Zero Trust Client

- **File:** `libZeroTrust.so` (471 KB, x86-64 ELF)
- **BuildID:** `843db307e51cb1098dc1668b8bcda5f95fb1aeb0`
- **Debug Info:** NO (stripped of DWARF, but symbols preserved)
- **Language:** C++

## Purpose
Implements **H3C Zero Trust / SDP (Software Defined Perimeter)** client-side logic — Single Packet Authorization (SPA) UDP knock, SDP controller communication, OTP (HOTP/TOTP), device fingerprinting, and multi-factor auth flows (password, SMS, WeChat Work QR).

## Key Exported APIs

### SPA Knock (UDP-based)
| Function | Description |
|----------|-------------|
| `onKnockUDPMsg(SpaRegisterParams*, bool)` | Send SPA knock packet |
| `onKnockUDPMsg(SpaRegisterParams*, string, int, int, bool)` | SPA knock with params |
| `GetSpaAidBySdpIP()` | Get SPA AID from SDP controller IP |
| `GetSpaKeyBySdpIP()` | Get SPA key from SDP controller IP |

### Authentication
| Function | Description |
|----------|-------------|
| `AssemblePwdAuthReq()` | Build password auth request |
| `AssembleSmsPreReq()` | Build SMS pre-request |
| `AssembleSmsAuthReq()` | Build SMS auth request |
| `ParsePwdAuthResp()` | Parse password auth response |
| `ParseSmsAuthResp()` | Parse SMS auth response |
| `ParseSmsVirfResp()` | Parse SMS verification response |
| `ParseWeComQRResp()` | Parse WeChat Work QR response |

### OTP (One-Time Password)
| Function | Description |
|----------|-------------|
| `generateOTP(string, long, int, bool, int)` | Generate OTP code |
| `Get_HOTP_Code(string, string&)` | Get HOTP code |
| `calcChecksum(long, int)` | Calculate OTP checksum |

### Device Identification
| Function | Description |
|----------|-------------|
| `GetUniqueID()` | Generate unique device ID |
| `SaveUniqueID()` | Save unique ID to storage |
| `getCardsMac()` | Get network card MACs |
| `getCurrentMac()` | Get current MAC address |
| `GetHardDiskID()` | Get hard disk serial |
| `getTickCount()` | Get system tick count |

### Network
| Function | Description |
|----------|-------------|
| `Domain2ipAddr()` | DNS resolve domain to IP |
| `pingIPAndPort()` | TCP connect test to IP:port |
| `ConfigSocket()` | Configure curl socket options |

### Server Communication
| Function | Description |
|----------|-------------|
| `makePrivateContent()` | Encrypt/obfuscate content |
| `getChallengeTime()` | Get challenge timestamp |
| `saveChallengeTime()` | Save challenge timestamp |
| `GetInfoFromFile()` / `SaveInfo2File()` | Persistent storage |

## Protocol Details

### SPA (Single Packet Authorization)
- UDP-based knock before TCP connection
- `SpaRegisterParams` structure carries knock parameters
- SPA AID (Application ID) and key tied to SDP controller

### Zero Trust Auth Flow
1. `onKnockUDPMsg()` — Send SPA knock to open firewall port
2. `AssemblePwdAuthReq()` / `AssembleSmsPreReq()` — Auth request
3. Server responds with auth challenge
4. `ParsePwdAuthResp()` / `ParseSmsAuthResp()` — Parse response
5. If 2FA: `AssembleSmsAuthReq()` — SMS code verification
6. `Get_HOTP_Code()` — Generate OTP if needed

### Multi-Factor Auth
- Password authentication
- SMS verification code
- WeChat Work QR code scanning
- HOTP/TOTP time-based OTP

## Data Files
- `symbols/libZeroTrust_demangled.txt` — 920 symbols
- `symbols/libZeroTrust_dynamic.txt` — 837 dynamic symbols
- `symbols/libZeroTrust_objdump_syms.txt` — 962 objdump symbols
- `strings/libZeroTrust_strings.txt` — 2,469 strings
