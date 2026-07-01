#add by zhangmingze,2014-2-11

from neutron._i18n import _
from neutron_lib import exceptions

def get_http_respond_error(resp):
    errorCode = resp.headers.get('error-code')
    errorMessage = resp.headers.get('error-message')
    charset = resp.headers.get('charset')
    
    if errorCode and errorMessage and charset:
        errorString = _("error-code:%s, error-message:%s") % (errorCode, errorMessage.decode(charset))
    else:
        errorString = _("error-headers:%s") % resp.headers
    
    return errorString

class ClientReqException(exceptions.NeutronException):
    """Bad Request"""
    message = _("CAS http client failed.")

class CasHostException(exceptions.NeutronException):
    message = _("CAS host failed.")

class CasTaskException(exceptions.NeutronException):
    message = _("CAS task failed.")

class CasNetworkException(exceptions.NeutronException):
    message = _("CAS network failed.")

class CasVmException(exceptions.NeutronException):
    message = _("CAS vm failed.")

class CasQosException(exceptions.NeutronException):
    message = _("CAS qos failed.")
