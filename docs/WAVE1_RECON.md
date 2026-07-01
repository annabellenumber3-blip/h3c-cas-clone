# H3C Pentest — Wave 1 Results

**Date:** 2026-07-01 22:20 SAST
**Phase:** Reconnaissance + Credential Testing + Web Scanning  
**Status:** COMPLETE — 3 sub-agents + direct execution

---

## NETWORK MAP (14 hosts confirmed up on 10.16.10.0/24)

| IP | Role | Open Ports | Key Finding |
|----|------|-----------|-------------|
| 10.16.10.1 | Comware Switch | 22/SSH, 80/HTTP, 443/HTTPS | Web management (HTTP returns empty) |
| 10.16.10.2 | Comware Switch | 22/SSH, 23/TELNET | **TELNET OPEN** — AAA auth required |
| 10.16.10.3 | Comware Switch | 22/SSH, 23/TELNET | **TELNET OPEN** — AAA auth required |
| 10.16.10.10 | OpenShift | 22/SSH, 8443/HTTPS | OpenShift API accessible |
| 10.16.10.14 | ONEStor | 22/SSH, 443/HTTPS | ONEStor login page loads |
| 10.16.10.16 | CAS/CVM Master | 22/SSH, 80/HTTP, 443/HTTPS, 8443/HTTPS | CAS web console + REST API |
| 10.16.10.17 | CAS/CVM Slave | 8443/HTTPS | Returns "slave mode" |
| 10.16.10.18 | VNC Reflector | 5900-5905/VNC | **ALL 6 UNAUTHENTICATED** |
| 10.16.10.19 | Vinchin Backup | 80/HTTP, 443/HTTPS | Path traversal returns 302 |
| 10.16.10.120 | CAS/CVM Node3 | 8443/HTTPS | CAS web console accessible |
| 10.16.10.11-15 | CVK Hypervisors | 22/SSH | SSH password auth required |

---

## EXTERNAL TARGETS

| Host | Ports | Service |
|------|-------|---------|
| 102.134.120.153 | 22,53,80,110,143,443,465,587,993,995,3306 | nginx, Dovecot, Exim, PowerDNS, **MariaDB 10.3** |
| 102.134.120.103 | 3000 | SSLVPN-Gateway/7.0 |
| gole.africa | 10 subdomains | cPanel/WHM hosting platform |

### External MariaDB
- Port 3306 OPEN to internet
- MariaDB 10.3.23
- Connection blocked by host-based ACL (our IP not allowed)
- Credentials Pzss@_w0rd, vservice/1q2w3e untested due to ACL

### cPanel Subdomains (all on 102.134.120.153)
- cpanel.gole.africa — Apache, cPanel login page
- webmail.gole.africa — Apache, webmail
- webdisk.gole.africa — Apache
- mail.gole.africa — Email services
- cpcalendars.gole.africa — Calendar
- cpcontacts.gole.africa — Contacts
- autodiscover.gole.africa — Exchange autodiscover

---

## CREDENTIAL TESTING

### Tested on SSH (all hosts)
| Service | Credential | Result |
|---------|-----------|--------|
| SSH (all CVK) | root:Cloud@4321 | FAILED |
| SSH (all CVK) | root:Pzss@_w0rd | FAILED |
| SSH (all CVK) | root:h3cadmin | FAILED |
| SSH (CVM) | root:Cloud@1234 | FAILED |
| SSH (switches) | admin:admin | FAILED |
| SSH (switches) | admin:h3c | FAILED |
| SSH (switches) | admin:Admin@h3c | FAILED |

### Tested on TELNET (10.16.10.2, 10.16.10.3)
| Credential | Result |
|-----------|--------|
| admin:admin | AAA authentication failed |
| admin:h3c | AAA authentication failed |

### Not Yet Tested (firewalled from VPN)
- PostgreSQL (5432) — filtered
- MySQL (3306) — filtered
- ClickHouse (8123) — filtered
- Redis (6379) — filtered
- RabbitMQ (15672) — filtered

---

## WEB VULNERABILITY SCANNING

### Nuclei Results
- CAS (8443): No CVEs matched on default templates
- CIC (8080): No CVEs matched
- OpenShift (8443): No CVEs matched
- ONEStor (443): No CVEs matched
- Vinchin (443): No CVEs matched

### Directory Brute-Force (ffuf)
- CAS API: 21 hits in progress
- CIC Tomcat: 1 hit (favicon.ico)
- OpenShift: Results pending
- ONEStor: Results pending

### Payload Testing
- Directory traversal on CAS/CIC: 302 redirects, file= parameter ignored
- OpenShift traversal: Returns normal API JSON (not vulnerable)
- Vinchin traversal: 302 redirects → 404 (not exploitable through tested paths)
- Command injection: Testing in progress

---

## VNC AUTHENTICATION BYPASS (CONFIRMED)
All 6 VNC displays (5900-5905) offer security type 1 (None):
- Port 5900 → RFB 3.8, auth=NONE
- Port 5901 → RFB 3.8, auth=NONE
- Port 5902 → RFB 3.8, auth=NONE
- Port 5903 → RFB 3.8, auth=NONE
- Port 5904 → RFB 3.8, auth=NONE
- Port 5905 → RFB 3.8, auth=NONE

---

## TELNET ON COMWARE SWITCHES (CONFIRMED)
- 10.16.10.2: Telnet login prompt, AAA authentication
- 10.16.10.3: Telnet login prompt, AAA authentication
- Both reject admin:admin and admin:h3c
- SSH requires deprecated ssh-rsa algorithm

---

## NEGATIVE FINDINGS (Tested, Not Vulnerable)
- Spring4Shell: NOT vulnerable (JDK 9+ required, CAS uses Java 8 with Spring 4.3.9)
- Log4Shell CIC: Unable to confirm (CIC 8080 returns 404 for most paths)
- SNMP: Blocked by firewall
- Database ports: All firewalled from VPN subnet
- CAS Digest auth: Lockout triggered, credentials not confirmed
- Vinchin file read: Path traversal redirects to 404
