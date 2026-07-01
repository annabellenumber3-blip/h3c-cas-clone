#!/bin/bash
# H3C CAS RabbitMQ Initialization Script
# Sets up the cloudMsgHost vhost and configures the cloud user

set -e

echo "=== RabbitMQ Initialization for H3C CAS ==="

# Wait for RabbitMQ to be ready
until rabbitmqctl status >/dev/null 2>&1; do
    echo "Waiting for RabbitMQ..."
    sleep 2
done

echo "RabbitMQ is ready. Configuring CAS vhost and exchanges..."

# Create the cloudMsgHost vhost (default already created by env var, verify)
rabbitmqctl add_vhost cloudMsgHost 2>/dev/null || true

# Set permissions for cloud user on cloudMsgHost
rabbitmqctl set_permissions -p cloudMsgHost cloud ".*" ".*" ".*"

# Create the CAS event exchange and queue
rabbitmqadmin -u cloud -p 'Cl@oud13' -V cloudMsgHost declare exchange \
    name=cloud_vm_exchange_direct type=direct durable=true 2>/dev/null || true

rabbitmqadmin -u cloud -p 'Cl@oud13' -V cloudMsgHost declare queue \
    name=cas_vm_event_nova_compute durable=true \
    'arguments={"x-max-length-bytes":268435456,"x-queue-mode":"lazy"}' 2>/dev/null || true

rabbitmqadmin -u cloud -p 'Cl@oud13' -V cloudMsgHost declare binding \
    source=cloud_vm_exchange_direct destination=cas_vm_event_nova_compute \
    routing_key=cas_vm_event 2>/dev/null || true

echo "=== RabbitMQ initialization complete ==="
echo "  VHost: cloudMsgHost"
echo "  User: cloud / Cl@oud13"
echo "  Exchange: cloud_vm_exchange_direct"
echo "  Queue: cas_vm_event_nova_compute (256MB max, lazy mode)"
