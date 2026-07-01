#add by zhangmingze,2014-2-11

import uuid
import time
import requests
from requests.auth import HTTPDigestAuth
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from oslo_log import log as logging

from ceilometer.compute.virt.cas import error as exceptions

LOG = logging.getLogger(__name__)
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

class CasClient:
    """The Cas HttpClient Object."""

    def __init__(self, protocol, host, username, password,
                 max_try_count, timeout=300, http_log_debug=False):
        """
        Creates the necessary Communication interfaces and gets the
        ServiceContent for initiating SOAP transactions.

        protocol: http or https
        host    : ESX IPAddress[:port] or ESX Hostname[:port]
        """
        if protocol == 'http':
            self._restInfo = {'baseUri':'http://'+host+':8080','restArgs':{}}
        else:
            self._restInfo = {'baseUri':'https://'+host+':8443','restArgs':{'verify':False}}
        
        self._timeout=timeout
        self._http_log_debug = http_log_debug
        
        self.username = username
        self.password = password
        self.auth_chal = {}
        self._max_try_count = max_try_count

    def http_log_req(self, args, kwargs):
        if not self._http_log_debug:
            return None
        
        string_parts = ['curl -i']
        for element in args:
            if element in ('GET', 'POST', 'DELETE', 'PUT'):
                string_parts.append(' -X %s' % element)
            else:
                string_parts.append(' %s' % element)
        for element in kwargs['headers']:
            header = ' -H "%s: %s"' % (element, kwargs['headers'][element])
            string_parts.append(header)
        if 'data' in kwargs:
            string_parts.append(" -d '%s'" % (kwargs['data']))
        req_string = "".join(string_parts)
        
        req_uuid = uuid.uuid1()
        LOG.debug("[cas request: %s]\nREQ: %s\n" % (req_uuid,req_string))
        
        return req_uuid

    def http_log_resp(self, req_uuid, resp):
        if not self._http_log_debug:
            return
        
        LOG.debug("[cas response: %s]\nRESP: [%s] %s\nRESP BODY: %s\n" % (req_uuid,resp.status_code,resp.headers,resp.text))

    def request(self, method, uri, **kwargs):
        kwargs.setdefault('headers',{})
        kwargs['headers']['accept'] = 'application/xml'
        kwargs['headers']['content-type'] = 'application/xml'
        if 'body' in kwargs:
            kwargs['data'] = kwargs['body'].encode('utf-8')
            del kwargs['body']
        kwargs.setdefault('timeout',self._timeout)

        auth = HTTPDigestAuth(self.username,self.password)
        auth.chal = self.auth_chal
        auth.last_nonce = auth.chal.get('nonce','')
        kwargs['auth'] = auth
        
        url = (self._restInfo['baseUri']+uri).encode('utf-8')
        kwargs.update(self._restInfo['restArgs'])
        
        req_uuid = self.http_log_req((url, method,),kwargs)
        
        max_try_count = self._max_try_count
        while max_try_count > 0:
            resp = requests.request(method,
                                    url,
                                    **kwargs)
            if resp.status_code != 403:
                break
            max_try_count -= 1
            time.sleep(1)
            
        self.http_log_resp(req_uuid,resp)
        
        self.auth_chal = auth.chal
        
        if resp.text:
            if resp.status_code == 400:
                if ('Connection refused' in resp.text or
                    'actively refused' in resp.text):
                    raise exceptions.ClientReqException()
            body = resp.text
        else:
            body = None

        return resp, body