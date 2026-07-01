#!/bin/bash
# H3C CAS Clone — Start Script
# Brings up the complete CAS virtualization stack and runs end-to-end tests
#
# Usage:
#   ./start-cas.sh              # Start all services + run e2e tests
#   ./start-cas.sh --up         # Start services only
#   ./start-cas.sh --test       # Run e2e tests only
#   ./start-cas.sh --down       # Stop everything
#   ./start-cas.sh --logs       # Show logs
#   ./start-cas.sh --status     # Show status

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

COMPOSE_CMD="docker compose"
if ! docker compose version &>/dev/null; then
    if docker-compose version &>/dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        echo "ERROR: docker compose or docker-compose not found. Install Docker first."
        exit 1
    fi
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           H3C CAS Clone — Deployment Stack                  ║"
    echo "║           Version R0785P03 (V700R003B06D005)                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

status() {
    echo -e "${YELLOW}=== Service Status ===${NC}"
    $COMPOSE_CMD ps 2>/dev/null || echo "No services running"
}

up() {
    banner
    echo -e "${GREEN}[1/4] Starting infrastructure services...${NC}"
    $COMPOSE_CMD up -d postgres mysql redis rabbitmq clickhouse kafka
    echo ""
    echo -e "${YELLOW}Waiting for infrastructure to be healthy...${NC}"
    sleep 5
    $COMPOSE_CMD ps | grep -E "healthy|starting" || true
    echo ""

    echo -e "${GREEN}[2/4] Starting CVM Server (CAS REST API)...${NC}"
    $COMPOSE_CMD up -d --build cvm-server
    echo -e "${YELLOW}Waiting for CVM server...${NC}"
    for i in $(seq 1 30); do
        HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
            -u admin:Cloud@123 http://localhost:8080/cas/casrs/operator/test 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" == "204" ]; then
            echo -e "  ${GREEN}✓ CVM server healthy (204)${NC}"
            break
        fi
        echo -n "."
        if [ $i -eq 30 ]; then
            echo -e "\n  ${RED}✗ CVM server not responding${NC}"
        fi
        sleep 2
    done
    echo ""

    echo -e "${GREEN}[3/4] Starting CVK Agent and auxiliary services...${NC}"
    $COMPOSE_CMD up -d --build cvk-agent casserver novnc
    echo ""

    echo -e "${GREEN}[4/4] Verifying all services...${NC}"
    sleep 5
    $COMPOSE_CMD ps
    echo ""
    echo -e "${GREEN}=== All services started ===${NC}"
    echo "  CVM REST API:   http://localhost:8080/cas/casrs/"
    echo "  CVM HTTPS:      https://localhost:8443/cas/casrs/"
    echo "  noVNC Console:  http://localhost:8081/"
    echo "  RabbitMQ Mgmt:  http://localhost:15672/ (cloud/Cl@oud13)"
    echo "  ClickHouse:     http://localhost:8123/"
    echo "  Redis:          localhost:6379 (pass: Sy@Redi$79)"
    echo ""
}

down() {
    echo -e "${YELLOW}Stopping all CAS services...${NC}"
    $COMPOSE_CMD down --remove-orphans 2>/dev/null || true
    echo -e "${GREEN}All services stopped.${NC}"
}

logs() {
    $COMPOSE_CMD logs --tail=50 -f "$@"
}

run_tests() {
    echo -e "${CYAN}=== Running End-to-End Tests ===${NC}"
    echo ""

    # Check if CVM is up
    echo -e "${YELLOW}[1/8] Checking health...${NC}"
    HTTP_CODE=$(curl -s -o /tmp/cas-test-health.txt -w '%{http_code}' \
        -u admin:Cloud@123 http://localhost:8080/cas/casrs/operator/test 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" == "204" ]; then
        echo -e "  ${GREEN}✓ Health check: 204 No Content${NC}"
    else
        echo -e "  ${RED}✗ Health check failed: HTTP $HTTP_CODE${NC}"
        return 1
    fi

    # Test host pools
    echo -e "${YELLOW}[2/8] Listing host pools...${NC}"
    HOSTPOOLS=$(curl -s -u admin:Cloud@123 \
        http://localhost:8080/cas/casrs/hostpool/all 2>/dev/null)
    if echo "$HOSTPOOLS" | grep -q "hostPool"; then
        echo -e "  ${GREEN}✓ Host pools returned${NC}"
        echo "$HOSTPOOLS" | python3 -c "import sys; import xml.etree.ElementTree as ET; root=ET.fromstring(sys.stdin.read()); [print(f'    Pool: {hp.find(\"name\").text} (id={hp.find(\"id\").text})') for hp in root.findall('hostPool')]" 2>/dev/null || echo "$HOSTPOOLS"
    else
        echo -e "  ${RED}✗ Failed to list host pools${NC}"
    fi

    # Test host listing
    echo -e "${YELLOW}[3/8] Listing hosts in DefaultPool...${NC}"
    POOL_ID=$(echo "$HOSTPOOLS" | python3 -c "
import sys, xml.etree.ElementTree as ET
root=ET.fromstring(sys.stdin.read())
for hp in root.findall('hostPool'):
    if hp.find('name').text == 'DefaultPool':
        print(hp.find('id').text)
        break
" 2>/dev/null)
    if [ -n "$POOL_ID" ]; then
        HOSTS=$(curl -s -u admin:Cloud@123 \
            "http://localhost:8080/cas/casrs/hostpool/${POOL_ID}/allChildNode" 2>/dev/null)
        if echo "$HOSTS" | grep -q "host"; then
            echo -e "  ${GREEN}✓ Hosts listed${NC}"
            echo "$HOSTS" | python3 -c "import sys; import xml.etree.ElementTree as ET; root=ET.fromstring(sys.stdin.read()); [print(f'    Host: {h.find(\"name\").text} ({h.find(\"id\").text}) cpu={h.find(\"cpu\").text} mem={h.find(\"memory\").text})') for h in root.findall('host')]" 2>/dev/null || true
        fi
    fi

    # Test register CVK (mock: already registered via cvk-agent service)
    echo -e "${YELLOW}[4/8] Verifying CVK registration...${NC}"
    if curl -s -u admin:Cloud@123 http://localhost:8080/cas/casrs/nova/vmList 2>/dev/null | grep -q "domain"; then
        echo -e "  ${GREEN}✓ CVK registered (VM list accessible)${NC}"
    else
        echo -e "  ${YELLOW}⚠ VM list empty or CVK not registered${NC}"
    fi

    # Test VM list
    echo -e "${YELLOW}[5/8] Listing VMs...${NC}"
    VM_LIST=$(curl -s -u admin:Cloud@123 \
        http://localhost:8080/cas/casrs/nova/vmList 2>/dev/null)
    if echo "$VM_LIST" | grep -q "domain"; then
        echo -e "  ${GREEN}✓ VMs listed${NC}"
        echo "$VM_LIST" | python3 -c "import sys; import xml.etree.ElementTree as ET; root=ET.fromstring(sys.stdin.read()); [print(f'    VM: {d.find(\"name\").text} ({d.find(\"uuid\").text})') for d in root.findall('domain')]" 2>/dev/null || true
    else
        echo -e "  ${YELLOW}⚠ No VMs found (new deployment)${NC}"
    fi

    # Test VM start operation
    echo -e "${YELLOW}[6/8] Testing VM start...${NC}"
    VM_START=$(curl -s -w '\n%{http_code}' -X POST \
        -u admin:Cloud@123 \
        -H "Content-Type: application/xml" \
        http://localhost:8080/cas/casrs/vm/start/vm-001 2>/dev/null)
    VM_START_CODE=$(echo "$VM_START" | tail -1)
    if [ "$VM_START_CODE" == "200" ]; then
        echo -e "  ${GREEN}✓ VM start initiated (200 OK)${NC}"
    else
        echo -e "  ${RED}✗ VM start failed: HTTP $VM_START_CODE${NC}"
    fi

    # Test VM stop operation
    echo -e "${YELLOW}[7/8] Testing VM stop...${NC}"
    VM_STOP=$(curl -s -w '\n%{http_code}' -X POST \
        -u admin:Cloud@123 \
        -H "Content-Type: application/xml" \
        http://localhost:8080/cas/casrs/vm/stop/vm-001 2>/dev/null)
    VM_STOP_CODE=$(echo "$VM_STOP" | tail -1)
    if [ "$VM_STOP_CODE" == "200" ]; then
        echo -e "  ${GREEN}✓ VM stop initiated (200 OK)${NC}"
    else
        echo -e "  ${RED}✗ VM stop failed: HTTP $VM_STOP_CODE${NC}"
    fi

    # Test snapshot creation
    echo -e "${YELLOW}[8/8] Testing snapshot creation...${NC}"
    SNAP_RESULT=$(curl -s -w '\n%{http_code}' -X POST \
        -u admin:Cloud@123 \
        -H "Content-Type: application/xml" \
        -d '<snapshot><name>test-snapshot-1</name></snapshot>' \
        http://localhost:8080/cas/casrs/vm/snapshot 2>/dev/null)
    SNAP_CODE=$(echo "$SNAP_RESULT" | tail -1)
    if [ "$SNAP_CODE" == "200" ]; then
        echo -e "  ${GREEN}✓ Snapshot creation initiated (200 OK)${NC}"
    else
        echo -e "  ${RED}✗ Snapshot creation failed: HTTP $SNAP_CODE${NC}"
    fi

    # Test VM delete
    echo ""
    echo -e "${YELLOW}[Bonus] Testing VM delete...${NC}"
    VM_DELETE=$(curl -s -w '\n%{http_code}' -X POST \
        -u admin:Cloud@123 \
        "http://localhost:8080/cas/casrs/vm/deleteVmForce?id=vm-003&type=1&force=true" 2>/dev/null)
    VM_DELETE_CODE=$(echo "$VM_DELETE" | tail -1)
    if [ "$VM_DELETE_CODE" == "200" ]; then
        echo -e "  ${GREEN}✓ VM delete initiated (200 OK)${NC}"
    else
        echo -e "  ${RED}✗ VM delete failed: HTTP $VM_DELETE_CODE${NC}"
    fi

    echo ""
    echo -e "${GREEN}=== End-to-End Tests Complete ===${NC}"
}

# ── Main ───────────────────────────────────────────────────────────

case "${1:-}" in
    --up)
        up
        ;;
    --down)
        down
        ;;
    --test)
        run_tests
        ;;
    --logs)
        shift
        logs "$@"
        ;;
    --status)
        status
        ;;
    --help|-h)
        echo "Usage: $0 [--up|--down|--test|--logs|--status|--help]"
        echo ""
        echo "  (no args)   Start all services and run end-to-end tests"
        echo "  --up        Start all services only"
        echo "  --down      Stop all services"
        echo "  --test      Run end-to-end tests against running services"
        echo "  --logs      Show logs (pass service name for filtering)"
        echo "  --status    Show service status"
        ;;
    *)
        # Default: start everything + run tests
        up
        echo ""
        run_tests
        ;;
esac
