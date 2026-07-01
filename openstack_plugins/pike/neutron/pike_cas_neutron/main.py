# add by zhangmingze

import sys

import eventlet
eventlet.monkey_patch()
from eventlet import greenthread

from oslo_config import cfg
from oslo_log import log as logging

from neutron._i18n import _
from neutron.conf.agent import common as agent_config
from neutron.common import config as common_config
from neutron.agent.casagent import agent as cas_agent
from neutron.agent.casagent import plugin as cas_plugin
from neutron.agent.casagent import dhcp as cas_dhcp
from neutron import version
from oslo_reports import guru_meditation_report as gmr

casapi_opts = [
    cfg.StrOpt('host_ip',
               help='ip for connection to CAS host. '
                    'Used only neutron agent is casagent. '),
    cfg.StrOpt('host_username',
               help='Username for connection to CAS host. '
                    'Used only if neutron agent is casagent. '),
    cfg.StrOpt('host_password',
               help='Password for connection to CAS host. '
                    'Used only if neutron agent is casagent. ',
               secret=True),
    cfg.StrOpt('soft_sdn',
               default='',
               help='Set the software sdn mode for hypervisor to use. '
                    'Used only if we want to use ovn for neutron_plugin = openvswitch, to enable explictly set soft_sdn = ovn. '),
    cfg.StrOpt('neutron_plugin',
               default='openvswitch',
               help='the plugin name of neutron to deal network configure. '
                    'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('config_mtu',
                default=False,
                help='the Option to decide whether vm will be configed or not. '
                     'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('sriov_vlan_transparent',
                default=True,
                help='the Option to decide whether vf will be configed with vlan 4095 or not. '
                     'Used only if neutron agent is casagent. '),
    cfg.ListOpt('sriov_transparent_type_drivers',
                default=['flat'],
                help='list of type drivers which need to set vf vlan 4095. '
                     'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('enable_dhcp_security',
                default=False,
                help='the plugin name of neutron to deal network configure. '
                     'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('enable_remote_security_group',
                default=False,
                help='the plugin name of neutron to deal network configure. '
                     'Used only if neutron agent is casagent. '),
    cfg.StrOpt('rest_protocol',
                default='http',
                help='the name of protocol to use http or https. '
                     'Used only if neutron agent is casagent. '),
    cfg.StrOpt('security_policy',
               default='acl',
               help='the name of security_policy to use acl or fw. '
                    'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('enable_dhcp_monitor',
                default=False,
                help='the name of security_policy to use acl or fw. '
                     'Used only if neutron agent is casagent. '),
    cfg.StrOpt('URI_prefix',
               default='/cas/casrs',
               help='the prefix of URL to assemble rest url address. '
                    'Used only if neutron agent is casagent. '),
    cfg.IntOpt('api_retry_count',
               default=10,
               help='The number of times we retry on failures, e.g., '
                    'socket error, etc. '
                    'Used only if neutron agent is casagent. '),
    cfg.ListOpt('bridge_mappings',
                help='list of bridge mappings. '
                     'Used only if neutron agent is casagent. '),
    cfg.ListOpt('physical_device_mappings',
                help='list of bridge mappings. '
                     'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('configPort',
                default=True,
                help='the Option to decide whether port will be configed or not. '
                     'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('enable_sync_security_group',
                default=False,
                help='enable plugin to synchronize security groups'
                     'Used only if neutron agent is casagent. '),
    cfg.BoolOpt('enable_sync_port_info',
                default=True,
                help='enable plugin to synchronize port info'
                     'Used only if neutron agent is casagent. '),
    cfg.StrOpt('event_type',
                default='rabbitmq',
                help='the CAS event publish type,http/rabbitmq'
                     'Used only if neutron agent is casagent..'),
    cfg.StrOpt('rmq_host',
                help='ip addr for connection to CAS rabbitmq.'
                     'Used only if neutron agent is casagent. '),
    cfg.IntOpt('rmq_port',
                default=5672,
                help='the ip port of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('rmq_user',
                help='the user of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('rmq_password',
                help='the password of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('rmq_vhost',
                default='cloudMsgHost',
                help='the vhost of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('rmq_exchange',
                default='cloud_vm_exchange_direct',
                help='the exchange of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('rmq_queue',
                default='cas_vm_event_neutron_cas_agent',
                help='the queue of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.IntOpt('rmq_queue_max_length_Mbytes',
                default=256,
                help='the queue of connection to CAS rabbitmq'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('rmq_queue_mode',
                default='lazy',
                help='the queue of connection to CAS rabbitmq,lazy/default'
                     'Used only if neutron agent is casagent.'),
    cfg.StrOpt('acl_in_port',
               default='dest',
               help='the port configuration for ACL inbound direction,dest/src'
                    'Used only if neutron agent is casagent.')
    ]

CONF = cfg.CONF
CONF.register_opts(casapi_opts, 'cas')
CONF.import_group('AGENT', 'neutron.plugins.ml2.drivers.openvswitch.'
                      'agent.common.config')
CONF.import_group('OVS', 'neutron.plugins.ml2.drivers.openvswitch.agent.'
                      'common.config')
CONF.import_group('SRIOV_NIC', 'neutron.plugins.ml2.drivers.mech_sriov.agent.'
                      'common.config')
agent_config.register_agent_state_opts_helper(CONF)

LOG = logging.getLogger(__name__)

def main():
    common_config.init(sys.argv[1:])
    common_config.setup_logging()
    gmr.TextGuruMeditation.setup_autorun(version)
    
    agents = []
    casOvsAgent = cas_agent.CASNeutronOvsAgent('neutron-cas-ovs-agent')
    if casOvsAgent.enable_agent():
        agents.append(casOvsAgent)
    casSrivoAgent = cas_agent.CASNeutronSriovAgent('neutron-cas-sriov-agent')
    if casSrivoAgent.enable_agent():
        agents.append(casSrivoAgent)
    
    if not agents:
        LOG.error(_("No agent enable, service can't start."))
    else:
        casPlugin = cas_plugin.CASNeutronAgent(['neutron-cas-ovs-agent','neutron-cas-sriov-agent'])
        
        if CONF.cas.enable_dhcp_monitor:
            monitor = cas_dhcp.OVSDhcpPortMonitor()
            greenthread.spawn(monitor.daemon_loop)
        
        # Start everything.
        LOG.info(_("Service initialized successfully, now running... "))
        
        casPlugin.daemon_loop()
    
    sys.exit(0)

if __name__ == "__main__":
    main()
