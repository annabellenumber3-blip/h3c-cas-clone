# libskf_wrapper.so — SKF (Smart Key Framework) ASN.1 Codec

- **File:** `libskf_wrapper.so` (230 KB, x86-64 ELF)
- **BuildID:** `c670d9afd3f49629b931d8e911b9df22da319868`
- **Debug Info:** YES (DWARF: 5,450 lines, 803 source line mappings)
- **Language:** C

## Purpose
**ASN.1 DER codec library** for GM national crypto (SM2/SM3/SM4) smart key framework. Provides complete ASN.1 encode/decode for all standard types used in SKF certificate and key operations.

## Key Exported APIs

### ASN.1 Core
| Function | Description |
|----------|-------------|
| `asn1_length_to_der()` | Encode ASN.1 length |
| `asn1_length_from_der()` | Decode ASN.1 length |
| `asn1_length_is_zero()` | Check if length is zero |
| `asn1_length_le()` | Length comparison |
| `asn1_header_to_der()` | Encode ASN.1 header (tag+length) |
| `asn1_check()` | Validate ASN.1 structure |

### ASN.1 Primitive Types
| Function | Description |
|----------|-------------|
| `asn1_boolean_from_der_ex()` | Decode BOOLEAN |
| `asn1_boolean_to_der_ex()` | Encode BOOLEAN |
| `asn1_boolean_from_name()` / `asn1_boolean_name()` | BOOLEAN string |
| `asn1_integer_from_der_ex()` / `asn1_int_from_der_ex()` | Decode INTEGER |
| `asn1_integer_to_der_ex()` / `asn1_int_to_der_ex()` | Encode INTEGER |
| `asn1_bit_string_from_der_ex()` / `asn1_bit_string_to_der_ex()` | BIT STRING |
| `asn1_bit_octets_from_der_ex()` / `asn1_bit_octets_to_der_ex()` | BIT OCTETS |
| `asn1_bits_from_der_ex()` / `asn1_bits_to_der_ex()` | BITS |
| `asn1_bits_print()` | Print bits |

### ASN.1 String Types
| Function | Description |
|----------|-------------|
| `asn1_ia5_string_from_der_ex()` / `asn1_ia5_string_to_der_ex()` | IA5String |
| `asn1_generalized_time_from_der_ex()` / `asn1_generalized_time_to_der_ex()` | GeneralizedTime |

### ASN.1 ANY / Generic
| Function | Description |
|----------|-------------|
| `asn1_any_from_der()` | Decode ANY |
| `asn1_any_to_der()` | Encode ANY |
| `asn1_any_type_from_der()` | Decode ANY with type |
| `asn1_data_from_der()` | Decode generic data |
| `asn1_data_to_der()` | Encode generic data |

## Source Files (from DWARF)
- ASN.1 DER codec implementation (standard C)
- Integrates with `libskf_engine.so` for GM crypto operations

## Data Files
- `symbols/libskf_wrapper_demangled.txt` — 558 symbols
- `symbols/libskf_wrapper_dynamic.txt` — 393 dynamic symbols
- `dwarf/libskf_wrapper_dwarf_info.txt` — 5,450 lines DWARF
- `dwarf/libskf_wrapper_dwarf_line.txt` — 803 lines source mappings
- `strings/libskf_wrapper_strings.txt` — 1,689 strings
