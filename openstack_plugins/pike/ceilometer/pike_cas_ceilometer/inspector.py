from oslo_config import cfg
from oslo_log import log as logging
from oslo_utils import importutils

from ceilometer.i18n import _
from ceilometer.compute.virt.cas import api as casapi

casapi_opts = [
    cfg.StrOpt('host_ip',
               help='ip for connection to CAS host. Required if '
                    'Used only if hypervisor_inspector is cas. '),
    cfg.StrOpt('host_username',
               help='Username for connection to CAS host. '
                    'Used only if hypervisor_inspector is cas. '),
    cfg.StrOpt('host_password',
               help='Password for connection to CAS host. '
                    'Used only if hypervisor_inspector is cas. ',
               secret=True),
    cfg.StrOpt('rest_protocol',
               default='http',
               help='the name of protocol to use http or https. '
                    'Used only if if hypervisor_inspector is cas. '),
    cfg.StrOpt('URI_prefix',
               default='/cas/casrs',
               help='the prefix of URL to assemble rest url address. '
                    'Used only if hypervisor_inspector is cas. '),
    cfg.StrOpt('inspector',
                default='official',
                help='the Option to decide whether custom inspector will be used or not. '
                     'Used only if hypervisor_inspector is cas. '),
    cfg.IntOpt('api_retry_count',
               default=10,
               help='The number of times we retry on failures, e.g., '
                    'socket error, etc. '
                    'Used only if hypervisor_inspector is cas. '),
    ]

LOG = logging.getLogger(__name__)

SUPPORT_INSPECTOR = {
    'official':'official.CasOfficialInspector',
    'tecs':'tecs.CasTecsInspector',
    'ctcloud': 'ctcloud.CasCtcloudInspector'
}

class CasInspector(object):
    def __init__(self, conf):
        conf.register_opts(casapi_opts, group='cas')
        
        host_ip = conf.cas.host_ip
        host_username = conf.cas.host_username
        host_password = conf.cas.host_password
        if not (host_ip and host_username and host_password):
            raise Exception(_("Must specify host_ip, "
                              "host_username "
                              "host_password to use "
                              "cas ceilometer driver."))
        
        uri_prefix = conf.cas.URI_prefix
        api_retry_count = conf.cas.api_retry_count
        http_log_debug = conf.debug
        
        scheme = conf.cas.rest_protocol
        if scheme not in ('http','https'):
            raise Exception(_("rest protocol is %s, only support http or https") % scheme)
        
        self._session = casapi.CasAPISession(host_ip,host_username,host_password,
                                             uri_prefix,api_retry_count,scheme,http_log_debug)
        self._setup_inspector(conf)
        
        LOG.info(_("Success to initialize cas inspector."))
    
    def _setup_inspector(self, conf):
        inspector = conf.cas.inspector
        
        if inspector not in SUPPORT_INSPECTOR:
            raise Exception(_("dosen't support inspector:%s") % inspector)
        else:
            self._inspector = importutils.import_object_ns('ceilometer.compute.virt.cas.inspectors',
                                                           SUPPORT_INSPECTOR[inspector],
                                                           self._session,conf)
    
    def can_patch(self):
        return self._inspector.can_patch
    
    def patch_inspector(self):
        if hasattr(self._inspector,'patch_inspector'):
            self._inspector.patch_inspector(self._session)
    
    def __getattr__(self, attr):
        return getattr(self._inspector, attr)
