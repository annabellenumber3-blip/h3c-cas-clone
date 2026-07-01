from cinder import exception
from cinder.i18n import _

def get_http_respond_error(resp):
    errorCode = resp.headers.get('error-code')
    errorMessage = resp.headers.get('error-message')
    charset = resp.headers.get('charset')
    
    if errorCode and errorMessage and charset:
        errorString = _("error-code:%s, error-message:%s") % (errorCode, errorMessage.decode(charset))
    else:
        errorString = _("error-headers:%s") % resp.headers
    
    return errorString

class ClientReqException(exception.CinderException):
    """Bad Request"""
    msg_fmt = _("CAS http client fault.")

class CasDriverException(exception.CinderException):
    """Base class for all exceptions raised by the VMware Driver.

    All exceptions raised by the VMwareAPI drivers should raise
    an exception descended from this class as a root. This will
    allow the driver to potentially trap problems related to its
    own internal configuration before halting the nova-compute
    node.
    """
    msg_fmt = _("CAS driver fault.")


class CasDriverConfigurationException(exception.CinderException):
    """Base class for all configuration exceptions.
    """
    msg_fmt = _("CAS driver configuration fault.")

class CasUrlParametersException(exception.CinderException):
    """Base class for all url parameters exceptions"""
    msg_fmt = _("cmd url for CAS fault. ")

class CasHostException(exception.CinderException):
    msg_fmt = _("CAS host fault.")

class CasVmException(exception.CinderException):
    msg_fmt = _("CAS vm fault.")

class CasVolumeException(exception.CinderException):
    msg_fmt = _("CAS volume fault.")

class CasTaskException(exception.CinderException):
    msg_fmt = _("CAS task fault.")

class CasImageException(exception.CinderException):
    msg_fmt = _("CAS image fault.")

class CasImageDisappearException(exception.CinderException):
    msg_fmt = _("CAS image disappear fault.")
   