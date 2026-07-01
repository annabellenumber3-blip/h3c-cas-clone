# libInodeUtility.so — Core Utility & Crypto Library

- **File:** `libInodeUtility.so` (5.3 MB, x86-64 ELF)
- **BuildID:** `983b5e7dface902d48888fdc32a5e49429704160`
- **Debug Info:** YES (DWARF: 747,475 lines of type info, 50,763 lines of source mapping)
- **Language:** C/C++

## Purpose
**The shared utility backbone** — provides TLV packet codec (build/parse), Base64 encode/decode, AES/DES/3DES crypto, zlib compression, BPF packet filtering, PCAP capture, config file parsing, logging, custom XML parsing, and license verification. Used by all other iNode libraries.

## Key Exported APIs

### Crypto (OpenSSL-based + embedded)
| Function | Description |
|----------|-------------|
| `AES_cbc_encrypt()` / `AES_encrypt()` / `AES_decrypt()` | AES operations |
| `AES_set_encrypt_key()` / `AES_set_decrypt_key()` | AES key setup |
| `base64_encode()` / `base64_decode()` / `base64_Form()` | Base64 codec |
| `des3_encrypt()` / `des3_decrypt()` | 3DES-CBC |
| `des3_ecb_encrypt()` / `des3_ecb_decrypt()` | 3DES-ECB |
| `des3_setup()` | 3DES key setup |
| `des_encrypt()` / `des_decrypt()` | DES |
| `des_ecb_encrypt()` / `des_ecb_decrypt()` | DES-ECB |
| `des_setup()` | DES key setup |
| `EOR_WithMix()` | XOR with mixing (obfuscation) |

### TLV Packet Codec (utlCrypt.cpp)
| Function | Description |
|----------|-------------|
| `utl_encrpt()` / `utl_decrpt()` | TLV encrypt/decrypt |
| `utl_3des_encrpt()` / `utl_3des_decrpt()` | 3DES TLV encrypt/decrypt |
| `utl_AESCBC_Encryption()` / `utl_AESCBC_Decryption()` | AES-CBC TLV |
| `utl_AESCBC_Encryption_New()` / `utl_AESCBC_Decryption_New()` | AES-CBC TLV (new) |
| `utl_Encrpt_Aes()` / `utl_decrpt_Aes()` | AES TLV |
| `utl_base64_encode()` / `utl_base64_decode()` | Base64 wrapper |
| `utl_KeyGen()` | Key generation |

### Custom Info / License Verification
| Function | Description |
|----------|-------------|
| `CustomInfoVerify()` | Verify custom/license info |
| `utl_GetCurCusVer()` | Get current custom version |
| `utl_InitVerifyAndLoad()` | Initialize verification and load |
| `utl_LoadComnCusInfo()` | Load common custom info |

### BPF Packet Filter (embedded libpcap BPF)
| Function | Description |
|----------|-------------|
| `bpf_filter()` | BPF bytecode interpreter |
| `bpf_validate()` | Validate BPF program |
| `bpf_optimize()` | Optimize BPF program |
| `bpf_error()` | BPF error handler |
| `add_addr_to_iflist()` | Add address to interface list |
| `add_or_find_if()` | Add or find interface |

### Zlib Compression (embedded)
| Function | Description |
|----------|-------------|
| `compress()` / `compress2()` | Deflate compression |
| `compressBound()` | Maximum compressed size |
| `crc32()` / `crc32_combine()` | CRC32 checksum |
| `adler32()` / `adler32_combine()` | Adler32 checksum |

### String/Data Utilities
- `alloc_reg()` — Register allocation for BPF
- Base64: `base64_encode`, `base64_decode`, `base64_Form`

## Source Files (from DWARF)
- `cfgfile.cpp` / `ConfigFile.cpp` / `ConfigFile.h` — Configuration file I/O
- `CustomXMLParse.cpp` — Custom XML parsing
- `eventSharedMemory.cpp` — Shared memory events
- `logs.cpp` / `logs.h` — Logging framework
- `packet.cpp` — Packet utilities
- `resmng.cpp` / `resmng.h` — Resource management
- `Seckey_API.cpp` / `sec_key_auth.cpp` — Security key API
- `utlCommon.cpp` / `utlCommon.h` — Common utilities
- `utlCrypt.cpp` — Crypto utilities
- `include/CustomBase.h` / `include/CustomBasic.h` — Shared base classes
- `include/../xmltool/include/BaseXmlParser.h` / `tinyxml.h` — XML parsing

## Third-Party Dependencies
- **OpenSSL 1.1.x** — `CRYPTO_free`, `ASN1_STRING_to_UTF8`
- **libcurl** — `curl_easy_*` functions
- **libACE** — Threading, mutexes
- **GLIBC** — System calls

## Data Files
- `symbols/libInodeUtility_demangled.txt` — 6,762 symbols (largest)
- `symbols/libInodeUtility_dynamic.txt` — 5,278 dynamic symbols
- `dwarf/libInodeUtility_dwarf_info.txt` — 747,475 lines DWARF
- `dwarf/libInodeUtility_dwarf_line.txt` — 50,763 lines source mappings
- `strings/libInodeUtility_strings.txt` — 30,229 strings
