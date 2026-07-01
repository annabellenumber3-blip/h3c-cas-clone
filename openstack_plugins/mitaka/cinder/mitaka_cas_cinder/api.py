import time

from oslo_log import log as logging
from oslo_config import cfg
from cinder.i18n import _
from cinder.volume.drivers.cas import  client
from cinder.volume.drivers.cas import error as exceptions
from cinder.volume.drivers.cas import xml as casxml

CONF = cfg.CONF

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
        self._xml = casxml.CasXml()
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
                    raise exceptions.CasHostException()
                return
            except Exception:
                LOG.critical(_("Unable to connect to server at %(server)s, "
                               "please check the network state and the config file of cinder-volume, "
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

    def _check_session(self):
        """Creates a session with the CAS host."""
        if self._client is None:
            self._client = self._get_client_object()

        delay = 120
        uri = self.make_cmd_uri('/operator/test')
        while True:
            try:

                resp,body = self._client.request("GET",uri)
                if resp.status_code != 204:
                    raise exceptions.CasHostException()
                return
            except Exception:
                LOG.critical(_("_check_session Unable to connect to server at %(server)s, "
                               "please check the network state and the config file of nova-compute, "
                               "sleeping for %(seconds)s seconds") %
                             {'server':self._host_ip,'seconds':delay})
                if delay <= 0:
                    return
                time.sleep(10)
                delay = delay - 1

    def call_method(self, method, uri, **kwargs):
        """
        Calls a method within the module specified with
        args provided.
        """
        try:
            resp,body = self._client.request(method,uri,**kwargs)
        except Exception as excep:
            if CONF.cas_create_continuously_while_switchover:
                self._check_session()
            raise excep
        
        return resp, body
    
    def wait_for_task(self, task_id, interval=3):
        wait_time =  24*60*60
        wait_count = wait_time/interval
        uri = self.make_cmd_uri('/message',task_id)
        while True:
            resp,body = self.call_method("GET",uri)
            if resp.status_code == 200:
                task_info = self._xml.decode_xml("wait_for_task",body)
                if task_info["completed"] == "true":
                    return task_info
            elif resp.status_code == 403:
                LOG.info(_("wait_for_task,resp.status_code == 403"))
            else:
                LOG.info(_("fail to wait task finish,resp.status_code:%s,%s")
                         % (resp.status_code,exceptions.get_http_respond_error(resp)))
                raise exceptions.CasTaskException()
            time.sleep(interval)
            wait_count = wait_count - 1
            if wait_count == 0:
                LOG.error(_("Timeout State: wait_for_task timeout!!!"))
                raise exceptions.CasTaskException()
