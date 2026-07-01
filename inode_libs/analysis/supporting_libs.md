# Supporting Libraries — Consolidated Analysis

## libnm_wrapper.so — Network Manager Wrapper
- **Size:** 723 KB | **Debug Info:** YES | **Symbols:** 856 demangled, 788 dynamic
- **Source:** `nm_wrapper.cpp`, `nm_wrapper.h`
- **Purpose:** Wraps Linux NetworkManager D-Bus API for managing network connections programmatically. Uses `dlopen`/`dlsym` to dynamically load `libnm` and `libgio` at runtime.

### Key APIs
| Class/Function | Description |
|----------------|-------------|
| `NMFacade::load_libnm()` / `unload_libnm()` | Dynamic load/unload libnm |
| `NMFacade::init_nm_ctx()` | Initialize NM GLib context |
| `NMFacade::enter_nm_ctx()` / `leave_nm_ctx()` | Thread context switch |
| `NMFacade::nm_client_new()` | Create NM client |
| `NMFacade::g_object_unref()` | GLib object unref |
| `NMFacade::g_bytes_get_data()` | GLib bytes access |
| `NMFacade::nm_device_get_iface()` | Get interface name from device |
| `NMFacade::nm_setting_to_string()` | Serialize NM setting |
| `NMFacade::isSupported()` | Check if NM is available |
| `SyncAndNotify` class | Thread synchronization (mutex+condvar) |

## libpipc.so — Named Pipe IPC
- **Size:** 303 KB | **Debug Info:** YES | **Symbols:** 385 demangled, 341 dynamic
- **Source:** `local_msg.cpp`, `msg_npipe.cpp`, `npipe.cpp`

### Key APIs
| Class/Function | Description |
|----------------|-------------|
| `NPIPE_MSG::npipe::npipe_init()` / `npipe_build()` | Initialize/build named pipe |
| `NPIPE_MSG::npipe::rx()` / `tx()` | Read/write over pipe |
| `NPIPE_MSG::npipe::sendRecvMsg()` | Send request + receive response |
| `NPIPE_MSG::msgRecver::msgRecverInit()` / `recvMsg()` | Server-side receiver |
| `NPIPE_MSG::msgSender::setNewPipe()` | Set pipe for sender |
| `NPIPE_MSG::readv_timeout()` / `writev_timeout()` | Scatter/gather I/O with timeout |

## libskf_engine.so — GM National Crypto Engine
- **Size:** 35 KB | **Debug Info:** YES | **Symbols:** minimal (120 lines)
- **Purpose:** Thin wrapper/driver for GM SM2/SM3/SM4 hardware crypto via SKF USB keys. Calls into the SKF device driver.

## libThreadpoolNotify.so — Thread Pool & Event System
- **Size:** 306 KB | **Debug Info:** YES | **Symbols:** 157 demangled, 120 dynamic

### Key APIs
| Class | Description |
|-------|-------------|
| `PthreadPool` | Singletons thread pool with `Init()`, `AddTask()`, `Destory()`, `Instance()` |
| `EventsCenter` | Event dispatch system with `addEventListener()`, `deleteEventListener()`, `eventDispatchLoop()`, `Init()` |

## libUsbDevice.so — USB Device Detection
- **Size:** 1.3 MB | **Debug Info:** YES | **Symbols:** 535 demangled, 468 dynamic
- **Purpose:** Wraps `libusb-1.0` for USB device enumeration and communication.

### Key APIs
| Class/Function | Description |
|----------------|-------------|
| `DeviceImpl` | USB device wrapper (open, get descriptors, string descriptors, configs) |
| `EndPointImpl` | Endpoint wrapper (create transfers) |
| `BulkTransfer` | Bulk USB transfer |
| `TransferImpl::AsyncStart()` | Async USB transfer |
| `dump_interface()` / `dump_altsetting()` | Debug dump USB descriptors |

## libwaresource.so — Hardware Resource Detection (STRIPPED)
- **Size:** 339 KB | **Debug Info:** NO | **Stripped:** YES
- **Purpose:** Hardware resource enumeration (likely uses WA (Windows Agent) framework libs: `libwaapi`, `libwacollector`, etc.)
- Only 199 strings extracted — heavily stripped
- Related WA framework libs: `libwaapi.so.4.3.3240.0`, `libwacollector.so.4.3.3240.0`, `libwadeviceinfo.so.4.3.3240.0`, `libwaheap.so.4`, `libwalocal.so.4.3.3240.0`, `libwautils.so.4.3.3240.0` — all stripped

## Third-Party Libraries (with debug info)

### libACE.so.7.1.1 — ACE Framework
- **Size:** 16.9 MB | **Debug Info:** YES | **Symbols:** 6,614 demangled
- Standard ADAPTIVE Communication Environment (ACE) — reactor, threads, sockets, timers

### libACE_SSL.so.7.1.1 — ACE SSL Wrapper
- **Size:** 807 KB | **Debug Info:** YES | **Symbols:** 506 demangled

### libACEXML.so.7.1.1 / libACEXML_Parser.so.7.1.1 — ACE XML
- **Sizes:** 1.7 MB / 482 KB | **Debug Info:** YES

### libcrypto.so.1.1 — OpenSSL 1.1.x Crypto
- **Size:** 3.5 MB | **Debug Info:** YES | **Symbols:** 7,705 demangled

### libssl.so.1.1 — OpenSSL 1.1.x TLS
- **Size:** 721 KB | **No DWARF** | **Symbols:** 1,811 demangled

### libcurl.so.4.7.0 — libcurl HTTP
- **Size:** 617 KB | **No DWARF** | **Symbols:** 1,399 demangled

### libdnet.so.0.0.0 — libdnet Network
- **Size:** 149 KB | **Debug Info:** YES | **Symbols:** 170 demangled

### libgmp.so.10 — GNU MP Bignum
- **Size:** 537 KB | **No DWARF** | **Symbols:** 815 demangled

## Other Bundled Libraries (stripped, no debug info)
- `libQt5Core.so.5`, `libQt5Gui.so.5`, `libQt5Widgets.so.5`, `libQt5Network.so.5`, etc. — Qt5 framework (GUI)
- `libicudata.so.55`, `libicui18n.so.55`, `libicuuc.so.55` — ICU Unicode
- `libjpeg.so.8`, `libpng12.so.0`, `libtiff.so.3` — Image codecs
- `libdbusmenu-qt5.so.2`, `libFcitxQt5DBusAddons.so.1` — Desktop integration
- `libpcre16.so.3` — Regex
- `libudev.so.1.6.*` — Device management
- `libusb-1.0.so.0` — USB library
