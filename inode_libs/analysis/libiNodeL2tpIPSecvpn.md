# libiNodeL2tpIPSecvpn.so — L2TP/IPsec VPN Protocol Engine

- **File:** `libiNodeL2tpIPSecvpn.so` (2.3 MB, x86-64 ELF)
- **BuildID:** `4d49131fe3cf6d3a7fe88981f7ab9c21ec50f057`
- **Debug Info:** YES (DWARF: 350,956 lines of type info, 29,085 lines of source mapping)
- **Language:** C and C++

## Purpose
**Complete L2TP/IPsec VPN implementation** — includes IKEv1 key exchange, IPsec ESP/AH encapsulation, L2TP tunnel management, PPP session handling, and cryptographic primitives (AES, DES, 3DES, DH, SHA1, MD5, HMAC). This is a self-contained VPN stack with its own crypto implementations (not relying on OpenSSL for core operations).

## Architecture

```
L2TP/IPsec VPN Stack
├── IKE (Internet Key Exchange) — lib/IKE.cpp
│   ├── dh_create_exchange() / dh_create_shared() — Diffie-Hellman
│   ├── cookie_gen() / cookie_init() — Cookie-based DoS protection
│   └── constant_lookup() / constant_name() — IKE constant parsing
├── IPsec — lib/IPSECSuite.cpp
│   ├── crypto_encrypt() / crypto_decrypt() — ESP crypto
│   ├── crypto_init() / crypto_init_iv() / crypto_update_iv() — IV management
│   ├── crypto_get() / crypto_clone_keystate() — Key state management
│   └── CreateTDB() / DelIkeInfo() — Tunnel descriptor blocks
├── L2TP — lib/L2TP.cpp
│   ├── L2TP tunnel/session management
│   └── PPP session multiplexing
├── Crypto Primitives (embedded implementations)
│   ├── AES: AES_set_encrypt_key, AES_set_decrypt_key, AES_encrypt, AES_decrypt, AES_cbc_encrypt
│   ├── DES: des_set_key, des_ecb_encrypt, des_ecb3_encrypt, des_cbc_encrypt, des_ede3_cbc_encrypt
│   ├── DH: Dh_CreateNewDh, Dh_GenPrivatekey, DH_CalcPublickey, Dh_ComputeKey, Dh_Bnmodexp
│   ├── SHA1/MD5: (embedded)
│   └── HMAC: (embedded)
├── Configuration — attribute_map, attribute_set_*
└── Application interface — app_init(), app_handler()
```

## Key Exported APIs

### IKE (Internet Key Exchange)
| Function | Description |
|----------|-------------|
| `dh_create_exchange()` | Create DH exchange values |
| `dh_create_shared()` | Create shared secret |
| `dh_getlen()` | Get DH key length |
| `cookie_gen()` | Generate IKE cookie |
| `cookie_init()` | Initialize cookie generator |
| `cookie_reset_event()` | Reset cookie event |
| `cookie_secret_reset()` | Reset cookie secret |
| `constant_lookup()` | Look up IKE constant by name |
| `constant_name()` | Get IKE constant name |
| `constant_value()` | Get IKE constant value |
| `constant_link_lookup()` | Linked constant lookup |
| `constant_name_maps()` | Constant name maps |

### IPsec (ESP/AH)
| Function | Description |
|----------|-------------|
| `crypto_encrypt()` | ESP encrypt |
| `crypto_decrypt()` | ESP decrypt |
| `crypto_init()` | Initialize crypto context |
| `crypto_init_iv()` | Initialize IV |
| `crypto_update_iv()` | Update IV |
| `crypto_get()` | Get crypto state |
| `crypto_clone_keystate()` | Clone key state |
| `CreateTDB()` | Create Tunnel Descriptor Block |
| `DelIkeInfo()` | Delete IKE information |
| `ClearIKEInfo()` | Clear all IKE info |

### Diffie-Hellman (embedded bigint implementation)
| Function | Description |
|----------|-------------|
| `Dh_CreateNewDh()` | Create new DH parameters |
| `Dh_FreeDh()` | Free DH parameters |
| `Dh_GenPrivatekey()` | Generate private key |
| `DH_CalcPublickey()` | Calculate public key |
| `Dh_CheckPublicKey()` | Validate public key |
| `Dh_ComputeKey()` | Compute shared secret |
| `Dh_Bnmodexp()` | Big number modular exponentiation |
| `Dh_Finish()` | Clean up DH |

### AES (embedded implementation)
| Function | Description |
|----------|-------------|
| `AES_set_encrypt_key()` | Set AES encrypt key |
| `AES_set_decrypt_key()` | Set AES decrypt key |
| `AES_encrypt()` | AES encrypt block |
| `AES_decrypt()` | AES decrypt block |
| `AES_cbc_encrypt()` | AES-CBC mode |

### DES/3DES (embedded implementation)
| Function | Description |
|----------|-------------|
| `des_set_key()` | Set DES key |
| `des_set_key_simple()` | Simple key setup |
| `des_set_odd_parity()` | Set odd parity |
| `des_is_weak_key()` | Check weak key |
| `des_encrypt()` | DES encrypt |
| `des_encrypt2()` | DES encrypt (variant) |
| `des_ecb_encrypt()` | DES-ECB |
| `des_ecb3_encrypt()` | 3DES-ECB |
| `des_cbc_encrypt()` | DES-CBC |
| `des_ede3_cbc_encrypt()` | 3DES-EDE-CBC |
| `des_ecb_encrypt_pwd()` | DES-ECB for passwords |
| `des_encrypt_pwd()` | DES password encrypt |
| `des_options()` | DES options |

### Configuration / Attributes
| Function | Description |
|----------|-------------|
| `attribute_set_basic()` | Set basic attribute |
| `attribute_set_var()` | Set variable attribute |
| `attribute_set_constant()` | Set constant attribute |
| `attribute_map()` | Map attributes |

### Application Interface
| Function | Description |
|----------|-------------|
| `app_init()` | Initialize VPN app |
| `app_handler()` | Handle VPN events |
| `DecryptPassword()` | Decrypt stored password |

### Encoding Utilities
- `AscToBin()` / `BinToAsc()` — ASCII ↔ binary
- `aToQuestionMark()` — ASCII to question mark
- `decode_16()` / `decode_32()` — Decode integers
- `des_ecb_encrypt_pwd()` — Password encryption

## Source Files (from DWARF)
- `IKE.cpp` — IKE key exchange implementation
- `IPSECSuite.cpp` — IPsec ESP/AH
- `L2TP.cpp` — L2TP tunnel management
- `l2tp_IPSEC.cpp` / `l2tp_IPSEC.h` — L2TP/IPsec integration
- `L2TP_IPSEC_common.h` — Common definitions
- `L2TPIPSECVPN.cpp` / `L2TPIPSecvpnMgr.cpp` — VPN manager
- `include/cfgfile.h` / `include/CustomBasic.h` / `include/packet.h` — Shared headers

## Protocol Details

### IKEv1 Implementation
- Main mode and aggressive mode support
- DH groups (MODP)
- Cookie-based DoS protection
- Standard ISAKMP/IKEv1 attribute encoding

### IPsec ESP
- AES-CBC, DES-CBC, 3DES-CBC
- HMAC-SHA1, HMAC-MD5 for integrity
- Tunnel mode encapsulation

### Embedded Crypto
- The library contains its own AES, DES, 3DES, DH implementations
- Does NOT depend on OpenSSL for core VPN crypto
- Uses internal bigint library (`BigInt`) for DH operations

### Password Encryption
- `des_ecb_encrypt_pwd()` / `des_encrypt_pwd()` — DES-based password encryption for config storage
- `DecryptPassword()` — Decrypt stored passwords

## Data Files
- `symbols/libiNodeL2tpIPSecvpn_demangled.txt` — 2,235 symbols
- `symbols/libiNodeL2tpIPSecvpn_dynamic.txt` — 1,704 dynamic symbols
- `dwarf/libiNodeL2tpIPSecvpn_dwarf_info.txt` — 350,956 lines DWARF
- `dwarf/libiNodeL2tpIPSecvpn_dwarf_line.txt` — 29,085 lines source mappings
- `strings/libiNodeL2tpIPSecvpn_strings.txt` — 15,146 strings
