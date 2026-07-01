import time

from oslo_log import log as logging

from ceilometer.i18n import _
from ceilometer.compute.virt.cas import client
from ceilometer.compute.virt.cas import error as cas_error

LOG = logging.getLogger(__name__)

class CasAPISession(object):
    """
    Sets up a session with the CAS host and handles all
    the calls made to the host.
    """

    def __init__(self, host_ip, username, password, uri_prefix, retry_count, scheme, http_log_debug):
        self._host_ip = host_ip
        self._host_username = username
        self._host_password = password
        self._uri_prefix = uri_prefix
        self._api_retry_count = retry_count
        self._scheme = scheme
        self._http_log_debug = http_log_debug
        self._client = None
        self._create_session()

    def _get_client_object(self):
        """Create the CasClient Object instance."""
        return client.CasClient(protocol=self._scheme, host=self._host_ip,
                                username=self._host_username, 
                                password=self._host_password,
                                max_try_count=self._api_retry_count,
                                http_log_debug=self._http_log_debug)

    def _create_session(self):
        """Creates a session with the CAS host."""
        if self._client is None:
            self._client = self._get_client_object()
            
        delay = 1
        uri = self.make_cmd_uri('/operator/test')
        while True:
            try:
                resp,body = self.call_method("GET", uri)
                if resp.status_code != 204:
                    raise cas_error.CasHostException()
                return
            except Exception:
                LOG.critical(_("Unable to connect to server at %(server)s, "
                               "please check the network state and the config file of nova-compute, "
                               "sleeping for %(seconds)s seconds") % 
                               {'server': self._host_ip, 'seconds': delay})
                time.sleep(delay)
                delay = min(2 * delay, 60)

    def make_cmd_uri(self, module, *args, **kwargs):
        """build url from args"""
        uri = self._uri_prefix + module

        for arg in args:
            uri += "/"+arg
        
        if kwargs:
            uri += "?"
            for key, value in kwargs.items():
                uri += key+"="+value+"&"
            uri = uri.rstrip("&")

        return uri

    def call_method(self, method, uri, **kwargs):
        """
        Calls a method within the module specified with
        args provided.
        """
        try:
            resp,body = self._client.request(method,uri,**kwargs)
        except cas_error.ClientReqException as excep:
            LOG.info(_("Request error, host is %s, uri is %s") % (self._host_ip,uri))
            raise excep

        return resp, body