from oslo_config import cfg
from oslo_log import log as logging
from oslo_service import loopingcall

from neutron_lib import context
from neutron._i18n import _
from neutron.common import topics
from neutron_lib import constants as q_const
from neutron.common import utils as n_utils
from neutron.agent import rpc as agent_rpc
from neutron.api.rpc.callbacks import resources

CONF = cfg.CONF

LOG = logging.getLogger(__name__)

class CASNeutronAgent(object):
    def __init__(self, binary, agent_type, use_call):
        self._report_interval = CONF.AGENT.report_interval
        self._use_call = use_call
        self.state_rpc = agent_rpc.PluginReportStateAPI(topics.PLUGIN)
        
        self._agent_state = {'binary': binary,
                             'host': CONF.host,
                             'topic': q_const.L2_AGENT_TOPIC,
                             'agent_type': agent_type,
                             'configurations':{'CAS_IP':CONF.cas.host_ip, 'netmode': CONF.cas.neutron_plugin, 
                                               'CAS_USER': CONF.cas.host_username, 
                                               'CAS_PSW': CONF.cas.host_password, 
                                               'cap': CONF.cas.soft_sdn if CONF.cas.soft_sdn else '', 
                                               'tunnel_types': ['vxlan'] if CONF.cas.soft_sdn else []},
                             'resource_versions': resources.LOCAL_RESOURCE_VERSIONS,
                             'start_flag': True}
    
    def _setup_rpc(self):
        report_interval = self._report_interval
        if report_interval:
            heartbeat = loopingcall.FixedIntervalLoopingCall(
                self._report_state)
            heartbeat.start(interval=report_interval)

    def _report_state(self):
        adminContext = context.get_admin_context()
        try:
            self._update_mappings()
            self.state_rpc.report_state(adminContext,
                                        self._agent_state,
                                        self._use_call)
            self._agent_state.pop('resource_versions', None)
            self._agent_state.pop('start_flag', None)
        except Exception:
            LOG.error(_("Failed reporting state of %s") % self._agent_state['binary'])
    
    def _get_mapping_item(self, mapping):
        split_result = mapping.split(':')
        if len(split_result) != 2:
            raise Exception(_("Invalid mapping: '%s'") % mapping)
        key = split_result[0].strip()
        if not key:
            raise Exception(_("Missing key in mapping: '%s'") % mapping)
        value = split_result[1].strip()
        if not value:
            raise Exception(_("Missing value in mapping: '%s'") % mapping)
        
        return key, value
    
    def enable_agent(self):
        if not getattr(self,self.mappings_name):
            LOG.warning(_("Dosen't specify %s, can't enable %s.") % (self.mappings_name,self._agent_state['binary']))
            return False
        
        self._setup_rpc()
        return True
    
class CASNeutronSriovAgent(CASNeutronAgent):
    mappings_name = 'physical_device_mappings'
    
    def __init__(self, binary):
        super(CASNeutronSriovAgent,self).__init__(binary,q_const.AGENT_TYPE_NIC_SWITCH,False)
        self.physical_device_mappings = CONF.cas.physical_device_mappings or CONF.SRIOV_NIC.physical_device_mappings
        
    def _update_mappings(self):
        mappings = {}
        for mapping in self.physical_device_mappings:
            mapping = mapping.strip()
            if not mapping:
                continue
            key, value = self._get_mapping_item(mapping)
            mappings.setdefault(key, [])
            if value not in mappings[key]:
                mappings[key].append(value)
        self._agent_state['configurations']['device_mappings'] = mappings

class CASNeutronOvsAgent(CASNeutronAgent):
    mappings_name = 'bridge_mappings'
    
    def __init__(self, binary):
        super(CASNeutronOvsAgent,self).__init__(binary,q_const.AGENT_TYPE_OVS,True)
        self.bridge_mappings = CONF.cas.bridge_mappings or CONF.OVS.bridge_mappings
        
    def _update_mappings(self):
        mappings = {}
        for mapping in self.bridge_mappings:
            mapping = mapping.strip()
            if not mapping:
                continue
            key, value = self._get_mapping_item(mapping)
            mappings[key] = value
        self._agent_state['configurations']['bridge_mappings'] = mappings
