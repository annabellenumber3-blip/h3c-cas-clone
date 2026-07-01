# Copyright (c) 2015 OpenStack Foundation
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

from oslo_config import cfg
from oslo_log import log as logging

from neutron._i18n import _
from neutron.agent.l2.extensions import qos
from neutron.common import constants
from neutron.services.qos.drivers.openvswitch import driver
from neutron.agent.casagent import error as cas_error
from neutron.agent.casagent import api as casapi
from neutron.agent.casagent import xml as casxml

CONF = cfg.CONF

LOG = logging.getLogger(__name__)

class QosCASAgentDriver(qos.QosAgentDriver):
    
    SUPPORTED_RULES = driver.SUPPORTED_RULES
    
    def __init__(self):
        super(QosCASAgentDriver, self).__init__()
    
    def initialize(self):
        host_ip=CONF.cas.host_ip
        host_username=CONF.cas.host_username
        host_password=CONF.cas.host_password
        uri_prefix=CONF.cas.URI_prefix
        api_retry_count=CONF.cas.api_retry_count
        scheme = CONF.cas.rest_protocol
        http_log_debug = CONF.debug
        
        self._session = casapi.CasAPISession(host_ip,host_username,host_password,
                                             uri_prefix,api_retry_count,scheme,http_log_debug)
        self._xml = casxml.QosXml()
    
    def _update_interface_qos(self, port, method, **configArgs):
        vm_id = -1
        if 'vmId' not in port:
            vm_id = self._get_id_from_uuid(port['device_id'])
        else:
            vm_id = port['vmId']
        if not vm_id or vm_id == -1:
            return
        
        xmlstr = self._xml.encode_xml("config_qos",vmId=vm_id,mac=port['mac_address'],**configArgs)
        uri = self._session.make_cmd_uri('/nova/interface/qos')
        resp,body = self._session.call_method(method,uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            try:
                task = self._session.wait_for_task(msgId,0.5)
            except Exception:
                LOG.error(_("exception happened when config port[%s] qos. msgId:%s uri:%s, xmlstr:%s") % (port['port_id'],msgId,uri,xmlstr))
                raise cas_error.CasQosException()
            if task['result'] != 0:
                LOG.error(_("fail to config port[%s] qos. uri:%s, xmlstr:%s") % (port['port_id'],uri,xmlstr))
                LOG.error(_("fail to config port[%s] qos. failMsg:%s") % (port['port_id'],task['failMsg']))
                raise cas_error.CasQosException()
        else:
            LOG.error(_("fail to config port[%s] qos. uri:%s, xmlstr:%s") % (port['port_id'],uri,xmlstr))
            LOG.error(_("fail to config port[%s] qos. resp.status_code:%d,%s") 
                     % (port['port_id'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasQosException()
    
    def create_bandwidth_limit(self, port, rule):
        self.update_bandwidth_limit(port,rule)
    
    def update_bandwidth_limit(self, port, rule):
        max_kbps = rule.max_kbps
        max_burst_kbps = rule.max_burst_kbps
        
        try:
            direction = rule.direction
        except Exception:
            direction = constants.EGRESS_DIRECTION
        else:
            if direction not in [constants.EGRESS_DIRECTION,constants.INGRESS_DIRECTION]:
                LOG.error(_("direction is neither %s or %s") % (constants.EGRESS_DIRECTION,constants.INGRESS_DIRECTION))
                raise cas_error.CasQosException()
        
        if direction == constants.INGRESS_DIRECTION:
            config_args = {'inMaxRate':max_kbps,'inMaxBurst':max_burst_kbps}
        else:
            config_args = {'outMaxRate':max_kbps,'outMaxBurst':max_burst_kbps}
        
        self._update_interface_qos(port,'PUT',**config_args)
    
    def delete_bandwidth_limit(self, port):
        self._update_interface_qos(port,'DELETE',direction=constants.EGRESS_DIRECTION)
    
    def delete_bandwidth_limit_ingress(self, port):
        self._update_interface_qos(port,'DELETE',direction=constants.INGRESS_DIRECTION)
    
    def create_dscp_marking(self, port, rule):
        pass
    
    def update_dscp_marking(self, port, rule):
        pass
    
    def delete_dscp_marking(self, port):
        pass

    def _get_id_from_uuid(self, instance_uuid):
        uri = self._session.make_cmd_uri('/nova/searchVm',uuid=instance_uuid)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            vm_id = self._xml.decode_xml("instance_id", body)
            return vm_id
        else:
            LOG.error(_("fail to get instance[uuid:%s] id! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid:%s] info! resp.status_code:%d,%s")
                     % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
