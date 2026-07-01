import time

from neutron_lib.callbacks import registry
from oslo_log import log as logging
import oslo_messaging
from oslo_serialization import jsonutils

from neutron.objects import trunk as trunk_objects
from neutron.api.rpc.callbacks import events
from neutron.api.rpc.handlers import resources_rpc
from neutron.services.trunk import constants as t_const
from neutron.services.trunk.rpc import agent as trunk_rpc

from neutron.db import db_base_plugin_v2
from neutron.db import segments_db

from neutron._i18n import _
from oslo_config import cfg
from neutron.agent.casagent import error as cas_error
from neutron.agent.casagent import xml as casxml
from neutron.agent.casagent import sem as cassem
from neutron.agent.casagent import api as casapi
from neutron.plugins.ml2 import models
from neutron_lib import exceptions

from sqlalchemy.orm import exc as sql_exc

LOG = logging.getLogger(__name__)

CONF = cfg.CONF

@registry.has_registry_receivers
class CasTrunkDriver(trunk_rpc.TrunkSkeleton):
    """Driver responsible for handling trunk/subport/port events.

    Receives data model events from the server and VIF events
    from the agent and uses these to drive a Plumber instance
    to wire up VLAN subinterfaces for any trunks.
    """

    def __init__(self, plumber=None, trunk_api=None, cas_plugin=None):

        self.conf = CONF
        self._host_ip = CONF.cas.host_ip
        self._hostname = CONF.host
        # self._trunk_mode = CONF.cas.trunk_mode
        self._session = casapi.CasAPISession(self._host_ip, CONF.cas.host_username, CONF.cas.host_password,
                                             CONF.cas.URI_prefix, CONF.cas.api_retry_count, CONF.cas.rest_protocol,
                                             CONF.debug)
        self._xml = casxml.TrunkPortXml()

        self._semObj = cassem.CasSem()

        self._tapi = trunk_api or _TrunkAPI(trunk_rpc.TrunkStub())
        self._cas_plugin = cas_plugin
        super(CasTrunkDriver, self).__init__()

    def handle_trunks(self, context, resource_type, trunks, event_type):
        LOG.info("handle_trunks:: Trunk %s will be dealed with handle_trunks!", trunks)
        """Trunk data model change from the server."""
        for trunk in trunks:
            if event_type in (events.UPDATED, events.CREATED):

                self._tapi.put_trunk(trunk.port_id, trunk)
                # self.wire_trunk(context, trunk)
                LOG.info("Trunk %s do nothing on events.CREATED!", trunks)
            elif event_type == events.DELETED:
                self._tapi.put_trunk(trunk.port_id, None)
                self.unwire_trunk(context, trunk)

    def handle_subports(self, context, resource_type, subports, event_type):
        LOG.info("handle_subports:: Subports %s will be dealed with handle_subports!", subports)
        """Subport data model change from the server."""

        affected_trunks = set()
        if event_type == events.DELETED:
            method = self._tapi.delete_trunk_subport
        else:
            self._tapi.bind_subports_to_host(context, subports)
            method = self._tapi.put_trunk_subport
        for s in subports:
            if event_type == events.DELETED:
                LOG.debug("get subport obj: %s", s)
                check = self._check_whether_do_it(context, s.port_id)
                if check:
                    self._cas_plugin.update_subport_port_down(context, s.port_id)

            affected_trunks.add(s['trunk_id'])
            method(s['trunk_id'], s)
        for trunk_id in affected_trunks:
            trunk = self._tapi.get_trunk_by_id(context, trunk_id)
            if not trunk:
                trunk = self._tapi.get_trunk_obj(context, trunk_id)
                LOG.debug("get trunk obj: %s", trunk)
                if not trunk:
                    continue
            self.wire_trunk(context, trunk)

    def _get_binding_port(self, context, port_id):
        session = context.session
        try:
            with session.begin(subtransactions=True):
                result = (session.query(models.PortBinding).
                          filter(models.PortBinding.port_id.startswith(port_id)).
                          one())
        except (sql_exc.NoResultFound, sql_exc.MultipleResultsFound) as exc:
            LOG.debug(_("fail to get binding port for port_id:%s") % port_id)
            raise exc
        return result

    def _get_segmentation_id(self, context, port_id):
        session = context.session
        try:
            with session.begin(subtransactions=True):
                port_binding_level_cnt = (session.query(models.PortBindingLevel).
                                          filter(models.PortBindingLevel.port_id.startswith(port_id)).
                                          count())
                if port_binding_level_cnt == 1:
                    port_binding_level = (session.query(models.PortBindingLevel).
                              filter(models.PortBindingLevel.port_id.startswith(port_id)).
                              filter(models.PortBindingLevel.level.__eq__(0)).
                              one())
                elif port_binding_level_cnt == 2:
                    port_binding_level = (session.query(models.PortBindingLevel).
                              filter(models.PortBindingLevel.port_id.startswith(port_id)).
                              filter(models.PortBindingLevel.level.__eq__(1)).
                              one())
                else:
                    LOG.error(_("fail to get binding port binding level list for port_id:%s") % port_id)
                    raise sql_exc.NoResultFound()

                result = segments_db.get_segment_by_id(context, port_binding_level.segment_id)
        except (sql_exc.NoResultFound, sql_exc.MultipleResultsFound) as exc:
            LOG.error(_("fail to get binding port for port_id:%s") % port_id)
            raise exc
        return result['segmentation_id']

    def _get_vlan_id(self, context, port_id):
        binding_port = self._get_binding_port(context, port_id)
        vlan_id = None
        if binding_port['vif_details']:
            try:
                vif_details = jsonutils.loads(binding_port['vif_details'])
                if 'vlanId' in vif_details:
                    vlan_id = vif_details['vlanId']
            except Exception:
                LOG.error("Serialized vif_details DB value '%(value)s' "
                          "for port %(port)s is invalid",
                          {'value': vif_details,
                           'port': port_id})
        return vlan_id

    def _get_port(self, context, port_id):
        plugin = db_base_plugin_v2.NeutronDbPluginV2()
        try:
            return plugin.get_port(context, port_id)
        except Exception as exc:
            LOG.warning(_("can't get port[%s], may have been deleted, do nothing.") % port_id)
            raise exc

    def _check_whether_do_it(self, context, port_id):
        if port_id:
            binding_port = self._get_binding_port(context, port_id)
            if self._cas_plugin.get_agent_hostname() == binding_port['host']:
                LOG.info(_("I will deal the job(trunk port_id): %s") % port_id)
                return True
            else:
                LOG.warning(_("host: %s will deal the job(trunk port_id): %s") % (binding_port['host'], port_id))
                return False

    def _get_cas_vlantrunk_rules_and_subport_port_ids(self, context, trunk):
        vlanTrunkRules = []
        subport_port_ids = []
        vlan_trunk = None
        cas_vlan_trunk = self._get_vlantrunk(trunk)

        if len(trunk.sub_ports) > 0:
            for subport in trunk.sub_ports:
                rule = {"vmVlan": subport.segmentation_id}
                if cas_vlan_trunk is not None and cas_vlan_trunk.has_key('rule') and len(cas_vlan_trunk['rule']) > 0:
                    for cas_rule in cas_vlan_trunk['rule']:
                        if cas_rule['vmVlan'] == subport.segmentation_id:
                            LOG.error(_("try to get port[%s] vswitchVlan from CAS.") % (subport.port_id))
                            rule['vswitchVlan'] = cas_rule['vswitchVlan']
                            break
                isExist = True
                if not rule.has_key('vswitchVlan'):
                    i = 1
                    while i < 61:
                        try:
                            self._get_port(context, subport.port_id)
                        except exceptions.PortNotFound:
                            LOG.info("----------not found subport %s" % subport.port_id)
                            self._tapi.delete_trunk_subport(trunk.id, subport)
                            isExist = False
                            break

                        try:
                            rule['vswitchVlan'] = self._get_segmentation_id(context, subport.port_id)
                        except Exception:
                            LOG.error(_("try to get port[%s] segmentation id, [%s] time.") % (subport.port_id, i))
                            i = i + 1
                            if i >= 61:
                                isExist = False
                            else:
                                time.sleep(3)
                        else:
                            break
                if isExist:
                    subport_port_ids.append(subport.port_id)
                    vlanTrunkRules.append(rule)
            vlan_trunk = {'title': 'openstack-' + trunk.id, 'rule': vlanTrunkRules}
            if cas_vlan_trunk is not None:
                vlan_trunk['id'] = cas_vlan_trunk['id']
        return vlan_trunk, subport_port_ids

    def _query_vlantrunk_id(self, trunk):
        vlantrunk = self._get_vlantrunk(trunk)
        if vlantrunk is not None and vlantrunk.has_key('id'):
            return vlantrunk['id']
        else:
            return None

    def get_vlantrunk(self, trunk):
        return self._get_vlantrunk(trunk)

    def _get_vlantrunk(self, trunk):
        uri = self._session.make_cmd_uri('/vlanTrunk', name='openstack-' + trunk.id)
        resp, body = self._session.call_method("GET", uri)
        if resp.status_code == 200:
            vlantrunk = self._xml.decode_xml("get_vlantrunk", body)
        else:
            LOG.error(_("fail to get trunk_port[uuid:%s] info! uri:%s") % (trunk.id, uri))
            LOG.error(_("fail to get trunk_port[uuid:%s] info! resp.status_code:%d,%s")
                      % (trunk.id, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        return vlantrunk

    def update_vlantrunk(self, vlantrunk):
        self._update_vlantrunk(vlantrunk)

    def _update_vlantrunk(self, vlantrunk):
        uri = self._session.make_cmd_uri('/vlanTrunk')
        xmlstr = self._xml.encode_xml("update_vlantrunk", **vlantrunk)
        resp, body = self._session.call_method('PUT', uri, body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("update vlantrunk policy failed, uri:%s, xmlstr:%s") % (uri, xmlstr))
            LOG.error(_("update vlantrunk policy failed, resp.status_code:%d,%s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()

    def _delete_vlantrunk(self, vlantrunk_id):
        uri = self._session.make_cmd_uri('/vlanTrunk', id=vlantrunk_id)
        resp, body = self._session.call_method('DELETE', uri)
        if resp.status_code != 204:
            LOG.error(_("delete vlanTrunk policy[id:%s] failed, uri:%s") % (vlantrunk_id, uri))
            LOG.error(_("delete vlanTrunk policy[id:%s] failed,resp.status_code:%d,%s")
                      % (vlantrunk_id, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()

    def _query_vlantrunk_domains(self, vlantrunk_id):
        uri = self._session.make_cmd_uri('/vlanTrunk/list/domain', vlanTrunkId=str(vlantrunk_id), offset='0', limit='100000')
        resp, body = self._session.call_method('GET', uri)
        if resp.status_code == 200:
            vlantrunk_domains = self._xml.decode_xml("query_vlantrunk_domains", body)
        else:
            LOG.error(_("fail to vlanTrunk policy[id:%s] domain used info! uri:%s") % (vlantrunk_id, uri))
            LOG.error(_("fail to vlanTrunk policy[id:%s] domain used info! resp.status_code:%d,%s")
                      % (vlantrunk_id, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        return vlantrunk_domains

    def _config_vlantrunk(self, port, vm_id, policy_args):
        xmlstr = self._xml.encode_xml("config_vlantrunk", id=vm_id, interface=policy_args)
        uri = self._session.make_cmd_uri('/nova/vm/configVlanTrunk')
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id", body)
            try:
                task = self._session.wait_for_task(msgId)
            except Exception:
                LOG.error(
                    _("exception happened when config port[%s] trunk_port. msgId:%s uri:%s, xmlstr:%s") % (
                        port['port_id'], msgId, uri, xmlstr))
                raise cas_error.CasVmException()
            if task['result'] != 0:
                LOG.error(_("fail to config vlantrunk. uri:%s, xmlstr:%s") % (uri, xmlstr))
                LOG.error(_("fail to config vlantrunk. failMsg:%s") % task['failMsg'])
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to config vlantrunk uri:%s, xmlstr:%s") % (uri, xmlstr))
            LOG.error(_("fail to config vlantrunk resp.status_code:%d,%s") % (
                resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def _create_vlantrunk(self, vlan_trunk):
        uri = self._session.make_cmd_uri('/vlanTrunk')
        xmlstr = self._xml.encode_xml("update_vlantrunk", **vlan_trunk)
        resp, body = self._session.call_method('POST', uri, body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("update vlan_trunk policy failed, uri:%s, xmlstr:%s") % (uri, xmlstr))
            LOG.error(_("update vlan_trunk policy failed, resp.status_code:%d,%s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
        return int(body)

    def wire_trunk(self, context, trunk):
        check = self._check_whether_do_it(context, trunk.port_id)
        if check:
            LOG.error(_("lockbefore:%s") % trunk.id)
            sem = self._semObj.get_obj_sem(trunk.id)
            sem.acquire()
            port = self._get_port(context, trunk.port_id)
            LOG.debug("trunk port info: %s", port)
            vm_id = self._get_id_from_uuid(port['device_id'])
            trunk = self._tapi.get_trunk_by_id(context, trunk.id)
            cas_vlan_trunk = self._get_vlantrunk(trunk)
            try:
                if len(trunk.sub_ports) > 0:
                    vlan_trunk, subport_port_ids = self._get_cas_vlantrunk_rules_and_subport_port_ids(context, trunk)
                    if self._manages_this_trunk(trunk.id):
                        configured = False
                        vlantrunk_domains = self._query_vlantrunk_domains(vlan_trunk['id'])
                        for vlantrunk_domain in vlantrunk_domains:
                            if vlantrunk_domain['vmId'] == vm_id and vlantrunk_domain['mac'] == port['mac_address']:
                                configured = True
                        if vlan_trunk['rule'] != cas_vlan_trunk['rule']:
                            self._update_vlantrunk(vlan_trunk)
                        if not configured:
                            policy_args = {'mac': port['mac_address'], 'vlanTrunkName': 'openstack-' + trunk.id}
                            self._config_vlantrunk(port, vm_id, policy_args)
                    else:
                        vlan_trunk['id'] = self._create_vlantrunk(vlan_trunk)
                        policy_args = {'mac': port['mac_address'], 'vlanTrunkName': 'openstack-' + trunk.id}
                        self._config_vlantrunk(port, vm_id, policy_args)
                else:
                    configured = False
                    vlantrunk_id = self._query_vlantrunk_id(trunk)
                    if vlantrunk_id is not None:
                        vlantrunk_domains = self._query_vlantrunk_domains(vlantrunk_id)
                        for vlantrunk_domain in vlantrunk_domains:
                            if vlantrunk_domain['id'] == vm_id and vlantrunk_domain['mac'] == port['mac_address']:
                                configured = True
                    if configured:
                        policy_args = {'mac': port['mac_address']}
                        self._config_vlantrunk(port, vm_id, policy_args)

                self._tapi.set_trunk_status(context, trunk, t_const.ACTIVE_STATUS)

                for port_id in subport_port_ids:
                    self._cas_plugin.update_subport_port_up(context, port_id)

            except Exception:
                LOG.exception("Failure setting up subports for %s", trunk.port_id)
                self._tapi.set_trunk_status(context, trunk, t_const.DEGRADED_STATUS)
            finally:
                sem.release()
                self._semObj.back_obj_sem(trunk.id)
                LOG.error(_("lockafter:%s") % trunk.id)

    def unwire_trunk(self, context, trunk):
        check = self._check_whether_do_it(context, trunk.port_id)
        if check:
            vlantrunk_id = self._query_vlantrunk_id(trunk)
            if vlantrunk_id:
                self._delete_vlantrunk(str(vlantrunk_id))


    def _manages_this_trunk(self, trunk_id):
        """True if this CAS manages trunk based on given ID."""
        uri = self._session.make_cmd_uri("/vlanTrunk", "isExist", name='openstack-' + trunk_id)
        resp, body = self._session.call_method("GET", uri)
        if resp.status_code == 200:
            return body == 'true'
        else:
            LOG.info(_("query vlantrunk policy failed,resp.status_code:%d,resp.headers:%s")
                     % (resp.status_code, resp.headers))
            return False
            # raise cas_error.CasNetworkException()

    def _get_id_from_uuid(self, instance_uuid):
        uri = self._session.make_cmd_uri('/nova/searchVm', uuid=instance_uuid)
        resp, body = self._session.call_method("GET", uri)
        if resp.status_code == 200:
            vm_id = self._xml.decode_xml("instance_id", body)
            return vm_id
        else:
            LOG.error(_("fail to get instance[uuid:%s] id! uri:%s") % (instance_uuid, uri))
            LOG.error(_("fail to get instance[uuid:%s] info! resp.status_code:%d,%s")
                      % (instance_uuid, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def _check_instance_port_exist(self, instance_uuid, instance_id, mac_address):
        uri = self._session.make_cmd_uri('/vm/network', instance_id)
        resp, body = self._session.call_method("GET", uri)
        if resp.status_code == 200:
            instance_ports_info = self._xml.decode_xml("instance_port_list", body)
            mac_list = instance_ports_info.keys()
            LOG.info(_("success to get instance[uuid:%s] ports from CVM, ports=%s") % (instance_uuid, mac_list))
            if mac_address.lower() not in mac_list:
                raise cas_error.CasNetworkException()
            return instance_ports_info.get(mac_address)
        else:
            LOG.error(_("fail to get instance[uuid:%s] ports! uri:%s") % (instance_uuid, uri))
            LOG.error(_("fail to get instance[uuid:%s] ports! resp.status_code:%d,%s")
                      % (instance_uuid, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def check_trunk(self, context, port):
        trunk = self._tapi.get_trunk(context, port['id'])

        if trunk is not None and hasattr(trunk, 'sub_ports') and len(trunk.sub_ports) > 0:
            LOG.info(_("begin to update port trunk. trunk id: %s") % trunk.id)
            self.wire_trunk(context, trunk)
            LOG.info(_("finish to update trunk. trunk id: %s") % trunk.id)


class _TrunkAPI(object):
    """Our secret stash of trunks stored by port ID. Tell no one."""

    def __init__(self, trunk_stub):
        self.server_api = trunk_stub
        self._trunk_by_port_id = {}
        self._trunk_by_id = {}
        self._sub_port_id_to_trunk_port_id = {}

    def get_trunk_obj(self, context, trunk_id):
        return trunk_objects.Trunk.get_object(context, id=trunk_id)

    def _fetch_trunk(self, context, port_id):
        try:
            t = self.server_api.get_trunk_details(context, port_id)
            LOG.debug("Found trunk %(t)s for port %(p)s", dict(p=port_id, t=t))
            return t
        except resources_rpc.ResourceNotFound:
            return None
        except oslo_messaging.RemoteError as e:
            if e.exc_type != 'CallbackNotFound':
                raise
            LOG.debug("Trunk plugin disabled on server. Assuming port %s is "
                      "not a trunk.", port_id)
            return None

    def set_trunk_status(self, context, trunk, status):
        self.server_api.update_trunk_status(context, trunk.id, status)

    def bind_subports_to_host(self, context, subports):
        self.server_api.update_subport_bindings(context, subports)

    def put_trunk_subport(self, trunk_id, subport):
        LOG.debug("Adding subport %(sub)s to trunk %(trunk)s",
                  dict(sub=subport, trunk=trunk_id))
        if trunk_id not in self._trunk_by_id:
            # not on this agent
            return
        trunk = self._trunk_by_id[trunk_id]
        trunk.sub_ports = [s for s in trunk.sub_ports
                           if s.port_id != subport.port_id] + [subport]

    def delete_trunk_subport(self, trunk_id, subport):
        LOG.debug("Removing subport %(sub)s from trunk %(trunk)s",
                  dict(sub=subport, trunk=trunk_id))
        if trunk_id not in self._trunk_by_id:
            # not on this agent
            return
        trunk = self._trunk_by_id[trunk_id]
        trunk.sub_ports = [s for s in trunk.sub_ports
                           if s.port_id != subport.port_id]

    def put_trunk(self, port_id, trunk):
        if port_id in self._trunk_by_port_id:
            # already existed. expunge sub_port cross ref
            self._sub_port_id_to_trunk_port_id = {
                s: p for s, p in self._sub_port_id_to_trunk_port_id.items()
                if p != port_id}
        self._trunk_by_port_id[port_id] = trunk
        if not trunk:
            return
        self._trunk_by_id[trunk.id] = trunk
        for sub in trunk.sub_ports:
            self._sub_port_id_to_trunk_port_id[sub.port_id] = trunk.port_id

    def get_trunk_by_id(self, context, trunk_id):
        """Gets trunk object based on trunk_id. None if not in cache."""
        return self._trunk_by_id.get(trunk_id)

    def get_trunk(self, context, port_id):
        """Gets trunk object for port_id. None if not trunk."""
        if port_id not in self._trunk_by_port_id:
            LOG.debug("Cache miss for port %s, fetching from server", port_id)
            self.put_trunk(port_id, self._fetch_trunk(context, port_id))
            return self.get_trunk(context, port_id)
        return self._trunk_by_port_id[port_id]

    def get_trunk_for_subport(self, context, port_id):
        """Returns trunk if port_id is a subport, else None."""
        trunk_port = self._sub_port_id_to_trunk_port_id.get(port_id)
        if trunk_port:
            return self.get_trunk(context, trunk_port)
