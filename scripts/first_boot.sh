#!/bin/bash
# H3C CAS First-Boot Initialization Script
# Mirrors the original extras/first_boot.sh from R0785P03
# Runs all component first-boot scripts after initial system start

set -e

INSTALL_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="/var/log/cas-firstboot.log"

exec 1> >(tee -a "$LOG_FILE") 2>&1

echo "============================================================"
echo " H3C CAS Clone First-Boot Initialization"
echo " Date: $(date)"
echo " Install Dir: $INSTALL_DIR"
echo "============================================================"

# ──────────────────────────────────────────────────────────────────────
# 1. Database Initialization
# ──────────────────────────────────────────────────────────────────────
if [ -f "$INSTALL_DIR/init-databases.sh" ]; then
    echo "[1/6] Initializing databases..."
    /bin/bash "$INSTALL_DIR/init-databases.sh"
else
    echo "[1/6] Database init script not found, skipping."
fi

# ──────────────────────────────────────────────────────────────────────
# 2. Start Infrastructure Services
# ──────────────────────────────────────────────────────────────────────
echo "[2/6] Starting infrastructure services..."
if command -v docker-compose &>/dev/null || command -v docker &>/dev/null; then
    cd "$(dirname "$INSTALL_DIR")"
    docker compose up -d postgres mysql redis rabbitmq clickhouse kafka 2>/dev/null || \
    docker-compose up -d postgres mysql redis rabbitmq clickhouse kafka 2>/dev/null || true
fi

# ──────────────────────────────────────────────────────────────────────
# 3. System Configuration
# ──────────────────────────────────────────────────────────────────────
echo "[3/6] Applying CAS system configuration..."

# sysctl tuning
if [ -f /etc/sysctl.conf ]; then
    sysctl -e -p 2>/dev/null || true
fi

# Create required directories
mkdir -p /etc/cvm /etc/cvk/cvm /etc/cvk /etc/tomcat
mkdir -p /var/log/tomcat /var/log/casserver /var/log/noVNC
mkdir -p /var/lib/tomcat/conf /var/lib/tomcat/webapps
mkdir -p /usr/local/noVNC/vnc_tokens

# ──────────────────────────────────────────────────────────────────────
# 4. Install Config Files
# ──────────────────────────────────────────────────────────────────────
echo "[4/6] Installing configuration files..."

CONFIG_DIR="$INSTALL_DIR/../configs"

# CVM configs → /etc/cvk/cvm/
if [ -d "$CONFIG_DIR/cvm" ]; then
    cp -f "$CONFIG_DIR/cvm/db.properties" /etc/cvk/cvm/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvm/redis.properties" /etc/cvk/cvm/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvm/kafka.properties" /etc/cvk/cvm/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvm/clickhouse.properties" /etc/cvk/cvm/ 2>/dev/null || true
fi

# Tomcat server.xml → /etc/tomcat/
if [ -f "$CONFIG_DIR/tomcat/server.xml" ]; then
    cp -f "$CONFIG_DIR/tomcat/server.xml" /etc/tomcat/server.xml 2>/dev/null || true
    cp -f "$CONFIG_DIR/tomcat/server.xml" /var/lib/tomcat/conf/server.xml 2>/dev/null || true
fi

# CVK configs → /etc/cvk/
if [ -d "$CONFIG_DIR/cvk" ]; then
    cp -f "$CONFIG_DIR/cvk/cvk_agent.conf" /etc/cvk/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvk/system_ports" /etc/cvk/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvk/casmon.conf" /etc/cvk/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvk/casaudit.conf" /etc/cvk/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvk/rbd_vendor.conf" /etc/cvk/ 2>/dev/null || true
    cp -f "$CONFIG_DIR/cvk/cpu_mem_threshold.conf" /etc/cvk/ 2>/dev/null || true
fi

# ──────────────────────────────────────────────────────────────────────
# 5. Systemd Services
# ──────────────────────────────────────────────────────────────────────
echo "[5/6] Installing systemd services..."

SYSTEMD_DIR="$INSTALL_DIR/../systemd"
if [ -d "$SYSTEMD_DIR" ]; then
    if [ -d /usr/lib/systemd/system ]; then
        SYSTEMD_TARGET="/usr/lib/systemd/system"
    elif [ -d /etc/systemd/system ]; then
        SYSTEMD_TARGET="/etc/systemd/system"
    else
        SYSTEMD_TARGET="/usr/lib/systemd/system"
    fi

    for svc in "$SYSTEMD_DIR"/*.service; do
        if [ -f "$svc" ]; then
            svc_name=$(basename "$svc")
            echo "  Installing $svc_name"
            cp -f "$svc" "$SYSTEMD_TARGET/$svc_name"
        fi
    done

    systemctl daemon-reload 2>/dev/null || true
fi

# ──────────────────────────────────────────────────────────────────────
# 6. First-Boot Components (mirrors original first_boot.sh logic)
# ──────────────────────────────────────────────────────────────────────
echo "[6/6] Running component first-boot scripts..."

# Create CAS component info
cat > /etc/cas_component_info <<-EOF
<Components>
    <Language>en</Language>
    <CVM>installed</CVM>
</Components>
EOF

# Enable services (but don't start yet — docker handles this)
systemctl enable cvm-server.service 2>/dev/null || true
systemctl enable cvk-agent.service 2>/dev/null || true
systemctl enable casnovnc.service 2>/dev/null || true
systemctl enable ksmtuned.service 2>/dev/null || true
systemctl enable restore-sriov.service 2>/dev/null || true
systemctl enable restore-pci-driver.service 2>/dev/null || true
systemctl enable isolate-cpuset-mem.service 2>/dev/null || true
systemctl enable swap-buffer-off.service 2>/dev/null || true

echo ""
echo "============================================================"
echo " H3C CAS Clone First-Boot Complete"
echo "============================================================"
echo " Config files installed to:"
echo "   /etc/cvk/cvm/   — CVM properties (db, redis, kafka, clickhouse)"
echo "   /etc/cvk/        — CVK agent & monitoring configs"
echo "   /etc/tomcat/     — Tomcat server.xml"
echo ""
echo " Run ./start-cas.sh to launch the full stack"
echo "============================================================"
