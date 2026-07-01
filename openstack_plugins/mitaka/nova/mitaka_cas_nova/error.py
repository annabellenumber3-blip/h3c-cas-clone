#add by zhangmingze,2014-2-11

from nova import exception
from nova.i18n import _

def get_http_respond_error(resp):
    errorCode = resp.headers.get('error-code')
    errorMessage = resp.headers.get('error-message')
    charset = resp.headers.get('charset')
    
    if errorCode and errorMessage and charset:
        errorString = _("error-code:%s, error-message:%s") % (errorCode, errorMessage.decode(charset))
    else:
        errorString = _("error-headers:%s") % resp.headers
    
    return errorString

class ClientReqException(exception.NovaException):
    """Bad Request"""
    msg_fmt = _("CAS http client fault.")

class CasDriverException(exception.NovaException):
    """Base class for all exceptions raised by the Cas Driver.

    All exceptions raised by the CasAPI drivers should raise
    an exception descended from this class as a root. This will
    allow the driver to potentially trap problems related to its
    own internal configuration before halting the nova-compute
    node.
    """
    msg_fmt = _("CAS driver fault.")

class CasDriverConfigurationException(exception.NovaException):
    """Base class for all configuration exceptions.
    """
    msg_fmt = _("CAS driver configuration fault.")

class CasUrlParametersException(exception.NovaException):
    """Base class for all url parameters exceptions"""
    msg_fmt = _("cmd url for CAS fault. ")

class CasHostException(exception.NovaException):
    msg_fmt = _("CAS host fault.")

class CasVmException(exception.NovaException):
    msg_fmt = _("CAS vm fault.")

class CasImageException(exception.NovaException):
    msg_fmt = _("CAS image fault.")

class CasVolumeException(exception.NovaException):
    msg_fmt = _("CAS volume fault.")

class CasTaskException(exception.NovaException):
    msg_fmt = _("CAS task fault.")

class CasImageDisappearException(exception.NovaException):
    msg_fmt = _("CAS image fault.")

class CasMigrationException(exception.NovaException):
    msg_fmt = _("CAS migration fault.")

class CasNetworkException(exception.NovaException):
    msg_fmt = _("CAS network fault.")

class CasPciException(exception.NovaException):
    msg_fmt = _("CAS pci fault.")
