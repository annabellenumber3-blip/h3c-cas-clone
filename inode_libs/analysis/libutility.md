# libutility.so — Security Key API & Crypto Wrappers

- **File:** `libutility.so` (1.2 MB, x86-64 ELF)
- **BuildID:** `fb20e536b5253ad1371074b897758ea5d64146ec`
- **Debug Info:** YES (DWARF: 172,320 lines of type info, 10,464 lines of source mapping)
- **Language:** C/C++

## Purpose
**Security key and crypto utility library** — provides SKF (Smart Key Framework) API for GM national crypto USB keys (SM2/SM3/SM4), Base64 codec, DES/3DES/AES crypto wrapped for TLV packet format, custom license verification, and configuration file management. Similar to `libInodeUtility` but focused on security key operations.

## Key Exported APIs

### SKF Security Key API (Seckey_API.cpp)
| Function | Description |
|----------|-------------|
| `API_SecKeyInitial()` | Initialize security key |
| `API_SecKeyCreateConnect()` | Create connection to key device |
| `API_SecKeyDeleteConnect()` | Delete connection |
| `API_SecKeyCloseDevice()` | Close key device |
| `API_SecKeyOpenToken()` | Open token on device |
| `API_SecKeyAuthPIN()` | Authenticate with PIN |
| `API_SecKeyChangePIN()` | Change PIN |
| `API_SecKeyUnlockPIN()` | Unlock PIN |
| `API_SecKeyPinInfo()` | Get PIN information |
| `API_SecKeyMaxRetries()` | Get max PIN retries |
| `API_SecKeyDeviceStatus()` | Get device status |
| `API_SecKeyCreateFile()` | Create file on key |
| `API_SecKeyDeleteFile()` | Delete file on key |
| `API_SecKeyOpenFile()` | Open file on key |
| `API_SeckeyCloseFile()` | Close file on key |
| `API_SecKeyReadFile()` | Read file from key |
| `API_SecKeyWriteFile()` | Write file to key |

### Crypto (embedded implementations)
| Function | Description |
|----------|-------------|
| `base64_encode()` / `base64_decode()` / `base64_Form()` | Base64 codec |
| `des3_encrypt()` / `des3_decrypt()` | 3DES-CBC |
| `des3_ecb_encrypt()` / `des3_ecb_decrypt()` | 3DES-ECB |
| `des3_setup()` | 3DES key setup |
| `des_encrypt()` / `des_decrypt()` | DES-CBC |
| `des_ecb_encrypt()` / `des_ecb_decrypt()` | DES-ECB |
| `des_setup()` | DES key setup |

### TLV Crypto Wrappers (utlCrypt.cpp)
| Function | Description |
|----------|-------------|
| `utl_3des_decrpt()` / `utl_3des_encrpt()` | 3DES TLV |
| `utl_AESCBC_Decryption()` / `utl_AESCBC_Encryption()` | AES-CBC TLV |
| `utl_AESCBC_Decryption_New()` / `utl_AESCBC_Encryption_New()` | AES-CBC TLV (new) |
| `utl_Encrpt_Aes()` / `utl_decrpt_Aes()` | AES TLV |
| `utl_encrpt()` / `utl_decrpt()` | Generic TLV encrypt/decrypt |
| `utl_base64_encode()` / `utl_base64_decode()` | Base64 wrapper |
| `utl_KeyGen()` | Key generation |

### Custom/License Verification
| Function | Description |
|----------|-------------|
| `CustomInfoVerify()` | Verify custom info |
| `utl_InitVerifyAndLoad()` | Initialize and verify |
| `utl_GetCurCusVer()` | Get custom version |
| `utl_LoadComnCusInfo()` | Load common custom info |

### Obfuscation
- `EOR_WithMix()` — XOR with mixing algorithm

## Source Files (from DWARF)
- `Seckey_API.cpp` / `sec_key_auth.cpp` — Security key API
- `utlCommon.cpp` / `utlCommon.h` — Common utilities
- `utlCrypt.cpp` — Crypto utilities
- `ConfigFile.cpp` / `ConfigFile.h` — Configuration files
- `include/CustomBase.h` / `include/CustomBasic.h` — Shared headers

## Data Files
- `symbols/libutility_demangled.txt` — 1,733 symbols
- `symbols/libutility_dynamic.txt` — 1,167 dynamic symbols
- `dwarf/libutility_dwarf_info.txt` — 172,320 lines DWARF
- `dwarf/libutility_dwarf_line.txt` — 10,464 lines source mappings
- `strings/libutility_strings.txt` — 7,668 strings
