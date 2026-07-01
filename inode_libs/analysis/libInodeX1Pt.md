# libInodeX1Pt.so — X1 Protocol (802.1X EAP-TLS Variant)

- **File:** `libInodeX1Pt.so` (1.3 MB, x86-64 ELF)
- **BuildID:** `c87afad4909f76d8ca1145557bcccb1b7eaa0197`
- **Debug Info:** YES (DWARF: 217,247 lines of type info, 9,141 lines of source mapping)
- **Language:** C/C++

## Purpose
Implements the **X1 protocol** — H3C's variant of 802.1X authentication with EAP-TLS support, including embedded BPF packet filter, TLS handshake (client-side), big integer math, and dot1x session management.

## Key Exported APIs

### 802.1X / Dot1x Core
| Function | Description |
|----------|-------------|
| Functions in `dot1x.cpp`, `dotFunc.cpp`, `dotSession.cpp`, `dotUser.cpp` | 802.1X state machine |
| EAP-TLS functions in `EapTlsFunc.cpp`, `TlsFunc.cpp`, `TlsPt.cpp` | EAP-TLS handshake |
| `linux1x.cpp` | Linux-specific 802.1X integration |

### BPF Packet Filter (embedded, shared with libInodeUtility)
| Function | Description |
|----------|-------------|
| `bpf_filter()` | BPF bytecode interpreter |
| `bpf_validate()` | Validate BPF program |
| `bpf_optimize()` | Optimize BPF program |
| `bpf_error()` | BPF error handler |
| `gen_acode()`, `gen_ecode()`, `gen_mcode()`, `gen_ncode()`, `gen_scode()` | BPF code generation |
| `gen_load()`, `gen_loadi()`, `gen_loadlen()` | BPF load instructions |
| `gen_and()`, `gen_or()`, `gen_not()`, `gen_neg()` | BPF logical ops |
| `gen_less()`, `gen_greater()`, `gen_relation()` | BPF comparisons |
| `gen_arth()` | BPF arithmetic |
| `gen_byteop()` | BPF byte operations |
| `gen_portop()` | BPF port operations |
| `gen_broadcast()`, `gen_multicast()` | BPF address filters |
| `gen_proto_abbrev()` | Protocol abbreviations |
| `gen_atmtype_abbrev()`, `gen_atmfield_code()`, `gen_atmmulti_abbrev()` | ATM filtering |
| `gen_inbound()`, `gen_pf_*()` | Direction and PF filters |
| `finish_parse()` | Finish BPF parse |
| `add_addr_to_iflist()`, `add_or_find_if()`, `dup_sockaddr()` | Interface utilities |

### Big Integer Math (BigInt.cpp)
- Support for large number operations used in TLS/SSL

### SKF UKey Integration
- `include/skf_ukey.h` — GM national crypto USB key support

### Utilities
- `include/utlUpdate.h` — Update utilities
- `include/dbusInfo.h`, `include/packet.h` — Shared headers

## Source Files (from DWARF)
- `dot1x.cpp` / `Dot1x.h` — 802.1X main
- `dotFunc.cpp` — Dot1x functions
- `dotSession.cpp` — Session management
- `dotUser.cpp` — User handling
- `EapTlsFunc.cpp` — EAP-TLS functions
- `TlsFunc.cpp` / `TlsFunc.h` — TLS handshake
- `TlsPt.cpp` — TLS protocol
- `BigInt.cpp` — Big integer math
- `linux1x.cpp` — Linux 802.1X integration
- `include/skf_ukey.h`, `include/utlUpdate.h`, `include/dbusInfo.h`, `include/packet.h`

## Protocol Details

### X1 Protocol (802.1X Variant)
- 802.1X supplicant with EAP-TLS authentication
- H3C proprietary extensions to standard 802.1X
- SKF (GM national crypto) USB key support for SM2 certificates
- TLS 1.0/1.1/1.2 client-side handshake

### BPF Integration
- Full BPF (Berkeley Packet Filter) engine for packet capture/filtering
- Code generation from filter expressions
- Optimization and validation of BPF programs
- Used for capturing 802.1X EAPOL frames

## Data Files
- `symbols/libInodeX1Pt_demangled.txt` — 833 symbols
- `symbols/libInodeX1Pt_dynamic.txt` — 641 dynamic symbols
- `dwarf/libInodeX1Pt_dwarf_info.txt` — 217,247 lines DWARF
- `dwarf/libInodeX1Pt_dwarf_line.txt` — 9,141 lines source mappings
- `strings/libInodeX1Pt_strings.txt` — 6,564 strings
