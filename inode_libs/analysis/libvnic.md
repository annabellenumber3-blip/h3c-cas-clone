# libvnic.so — Virtual NIC / TUN Driver / Routing / DNS

- **File:** `libvnic.so` (781 KB, x86-64 ELF)
- **BuildID:** `10431206cefb2536f10716f29abcb521506e85e7`
- **Debug Info:** YES (DWARF: 91,763 lines of type info, 6,230 lines of source mapping)
- **Language:** C++

## Purpose
**Virtual network interface management** — creates and manages TUN/TAP virtual adapters, configures IP addresses, routes, and DNS servers for VPN tunnels. Supports both IPv4 and IPv6. Used by both SSL VPN and L2TP/IPsec VPN.

## Key Exported APIs

### CVirNIC — Virtual NIC Manager
| Function | Signature | Description |
|----------|-----------|-------------|
| `CVirNIC::Init()` | `void Init(int (*)(char*, int), bool)` | Initialize with data callback |
| `CVirNIC::StartVirNIC()` | `void StartVirNIC()` | Start virtual NIC |
| `CVirNIC::StopVirNIC()` | `void StopVirNIC()` | Stop virtual NIC |
| `CVirNIC::EnableVirNIC()` | `void EnableVirNIC(signed char)` | Enable/disable |
| `CVirNIC::Data_Input()` | `void Data_Input(char*, unsigned int)` | Input data to virtual NIC |
| `CVirNIC::GetNICInfo()` | `void GetNICInfo(_tagNICInfo&)` | Get NIC configuration |
| `CVirNIC::SetNICInfo()` | `void SetNICInfo(_tagNICInfo&)` | Set NIC configuration |
| `CVirNIC::getNicInfo()` | `void getNicInfo(tagNICInfoIPSec&)` | Get IPsec NIC info |
| `CVirNIC::setNICInfo()` | `void setNICInfo(tagNICInfoIPSec&)` | Set IPsec NIC info |
| `CVirNIC::configVirtNetwork()` | Full config | Configure virtual network (SSL VPN) |
| `CVirNIC::changeVirNetwork()` | Change config | Change virtual network settings |
| `CVirNIC::configIPSecVirtNetwork()` | IPsec config | Configure IPsec virtual network |
| `CVirNIC::clearVirtNetwork()` | `void clearVirtNetwork()` | Remove all virtual network config |
| `CVirNIC::isChangeDns()` / `isChangeRoute()` / `isChangeInnerIp()` | Bool checks | Check if config changed |

### NS_VNIC::tunif — TUN Interface Operations
| Function | Description |
|----------|-------------|
| `tunif::ifsetIpv6addr()` | Set IPv6 address on TUN |
| `tunif::ifclearaddr()` | Clear IPv4 address |
| `tunif::ifclearIpv6addr()` | Clear IPv6 address |
| `tunif::ifClearIpv6addr()` | Clear all IPv6 addresses |
| `tunif::ifConfigIpv6addr()` | Configure IPv6 address |
| `tunif::ifAddIpv6Route()` | Add IPv6 route |
| `tunif::ifDelIpv6Route()` | Delete IPv6 route |
| `tunif::ifClearIpv6Route()` | Clear all IPv6 routes |
| `tunif::ifConifgIpv6Route()` | Configure IPv6 route (full) |

### NS_DNS::dnserver — DNS Server Management
| Function | Description |
|----------|-------------|
| `dnserver::add()` | Add DNS server |
| `dnserver::del()` | Delete DNS server |
| `dnserver::insert()` | Insert DNS server |
| `dnserver::clear()` | Clear all DNS servers |

### Package Processing
| Function | Description |
|----------|-------------|
| `packageProcEntry()` | Package processing thread entry |

## Source Files (from DWARF)
- `VirNIC.cpp` / `VirNIC.h` — Virtual NIC management
- `vnic_tun.cpp` / `vnic_tun.h` — TUN/TAP interface operations
- `vnic_route.cpp` / `vnic_route.h` — Route management
- `vnic_dns.cpp` — DNS server configuration

## Architecture

### TUN Device Flow
1. `StartVirNIC()` — Creates TUN device (typically `/dev/net/tun`)
2. `configVirtNetwork()` — Sets IP, netmask, MTU on TUN
3. Routes added for VPN subnets via `vnic_route`
4. DNS servers configured via `vnic_dns` (resolv.conf manipulation)
5. `Data_Input()` receives encrypted tunnel packets from protocol engine
6. Packets forwarded to TUN device → kernel routing

### IPsec Mode
- `configIPSecVirtNetwork()` — Special configuration for L2TP/IPsec
- Uses `tagNICInfoIPSec` struct instead of `_tagNICInfo`
- Maps security policy IDs to interfaces

### IPv6 Support
- Full IPv6 address configuration
- IPv6 route addition/deletion
- Dual-stack support

## Data Files
- `symbols/libvnic_demangled.txt` — 945 symbols
- `symbols/libvnic_dynamic.txt` — 905 dynamic symbols
- `dwarf/libvnic_dwarf_info.txt` — 91,763 lines DWARF
- `dwarf/libvnic_dwarf_line.txt` — 6,230 lines source mappings
- `strings/libvnic_strings.txt` — 5,383 strings
- `disasm/libvnic_StartVirNIC.txt` — Disassembly
